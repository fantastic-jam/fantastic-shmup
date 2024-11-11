import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { Enemy1 } from "../actors/enemies/enemy-1";
import { Ship } from "../actors/ship";
import { config } from "../conf";
import { idGenerator } from "../engine/actor";
import { Camera } from "../engine/camera";
import { Input } from "../engine/input/input";
import { LiaisonStatus } from "../engine/network";
import { Scene } from "../engine/scene";
import { SpriteEngine } from "../engine/sprite-engine";
import { Vector2 } from "../engine/tools";
import { Player } from "../player";
import { StarField } from "../world/starfield";
import { GameNetEventTypes, network } from "./network";

export class GameScene implements Scene {
  spriteEngine: SpriteEngine;
  starField: StarField;
  music: Source;
  camera: Camera;
  ships = new Map<Player, Ship>();
  networkStatus: LiaisonStatus = network.getStatus();

  private newEnemy(id: number): void {
    const enemy = new Enemy1(
      id,
      this.spriteEngine,
      new Vector2(
        config.screenWidth + love.math.random(config.screenWidth),
        love.math.random(config.screenHeight)
      )
    );
    this.spriteEngine.addActor(enemy);
    if (network.isServer()) {
      network.sendData(GameNetEventTypes.EnemySpawn, enemy.serialize());
    }
  }

  constructor(private players: Player[]) {
    const enemyCount = 3;

    this.camera = new Camera();
    this.starField = new StarField(this.camera, 200);
    this.spriteEngine = new SpriteEngine();
    if (!network.isClient()) {
      for (let i = 0; i < enemyCount; i++) {
        this.newEnemy(idGenerator.next());
      }
    }
    this.music = love.audio.newSource("assets/fantastic-shmup.ogg", "stream");
    this.music.setLooping(true);
    this.music.setVolume(0.2);
    this.music.play();
    if (!network.isClient()) {
      let idx = 0;
      for (const p of players) {
        const ship = new Ship(
          idGenerator.next(),
          this.spriteEngine,
          new Vector2(100, 100),
          p
        );
        ship.color = GameScene.getShipColor(idx++);
        this.spriteEngine.addActor(ship);
        this.ships.set(p, ship);
        ship.listen("killed", () => {
          const ship = this.ships.get(p);
          if (ship) {
            this.spriteEngine.removeActor(ship);
            this.ships.delete(p);
          }
        });
        network.sendData(GameNetEventTypes.Respawn, ship.serialize());
      }
    }
  }

  static getShipColor(playerIdx: number): [number, number, number] {
    switch (playerIdx) {
      case 0:
        return [1, 1, 1]; // normal
      case 1:
        return [1, 1, 0.5]; // yellow
      case 2:
        return [0.5, 1, 0.3]; // green
      case 3:
        return [0.2, 0.2, 1]; // blue
      default:
        return [0.5, 0.4, 1]; // purple
    }
  }

  drawScore(): void {
    let idx = 0;
    this.players.forEach((player) => {
      const ship = this.ships.get(player);
      love.graphics.setColor(...GameScene.getShipColor(idx));
      love.graphics.print(
        "" + (ship?.getScore() ?? 0),
        10 + idx++ * 50,
        config.screenHeight - 30
      );
    });
  }

  networkUpdate(dt: number): void {
    let receivedData = network.receiveData();
    while (receivedData) {
      const [type, content] = receivedData;
      if (type === GameNetEventTypes.Fire) {
        const [id, _action] = content.split("|");
        const ship = this.spriteEngine
          .getActors()
          .find((a) => a.id === parseInt(id)) as Ship | undefined;
        if (ship) {
          ship.weapons[ship.currentWeapon].fire();
        }
      } else if (type === GameNetEventTypes.Position) {
        const [id, x, y] = content.split("|").map((v) => parseFloat(v));
        const a = this.spriteEngine.getActors().find((a) => a.id === id);
        if (a) {
          a.pos = new Vector2(x, y);
        }
      } else if (type === GameNetEventTypes.EnemySpawn) {
        const strId = content.split("|").shift();
        const id = strId ? parseInt(strId) : undefined;
        if (id) {
          const a = this.spriteEngine.getActors().find((a) => a.id === id);
          if (!a) {
            const enemy = new Enemy1(id, this.spriteEngine, new Vector2(0, 0));
            enemy.deserialize(content);
            this.spriteEngine.addActor(enemy);
          } else {
            a.deserialize?.(content);
          }
        }
      } else if (type === GameNetEventTypes.Respawn) {
        const shipProps = Ship.deserialize(content);
        const ship = this.spriteEngine
          .getActors()
          .find((a) => a.id === shipProps.id) as Ship | undefined;
        if (ship != null) {
          ship.deserialize(content);
        } else {
          const player = this.players.find((p) => p.id === shipProps.playerId)!;
          const newShip = new Ship(
            shipProps.id,
            this.spriteEngine,
            shipProps.pos,
            player
          );
          newShip.color = shipProps.color;
          this.ships.set(player, newShip);
          this.spriteEngine.addActor(newShip);
        }
      }
      receivedData = network.receiveData();
    }
  }

  update(dt: number): void {
    this.networkStatus = network.getStatus();
    let idx = 0;
    for (const localPlayer of this.players.filter((p) => p.peerId == null)) {
      if (this.networkStatus === LiaisonStatus.LIAISON_STATUS_CONNECTED) {
        // send ship position
        const ship = this.ships.get(localPlayer);
        if (ship) {
          if (
            (ship as unknown as any).lastPos?.x !== ship.pos.x ||
            (ship as unknown as any).lastPos?.y !== ship.pos.y
          ) {
            network.sendData(
              GameNetEventTypes.Position,
              `${ship.id}|${ship.pos.x.toFixed(3)}|${ship.pos.y.toFixed(3)}`
            );
            (ship as unknown as any).lastPos = Vector2.of(ship.pos);
          }
        }
      }
      if (localPlayer.joystick.isGamepadDown("start") && localPlayer.isDead) {
        const ship = this.ships.get(localPlayer)!;
        this.spriteEngine.addActor(ship);
        if (network.isServer()) {
          network.sendData(GameNetEventTypes.Respawn, "" + ship.id);
        }
      }
      if (localPlayer.joystick.isGamepadDown("back")) {
        love.event.quit(0);
      }
      idx++;
    }
    this.networkUpdate(dt);
    this.starField.update(dt);
    this.spriteEngine.update(dt);
    network.update(dt);
  }
  draw(screen?: Screen): void {
    if (screen !== "bottom") {
      this.starField.draw(screen);
      this.spriteEngine.draw(screen);
      this.drawScore();
    }
  }
  unload(): void {
    // nothing to explicitely unload
  }
}
