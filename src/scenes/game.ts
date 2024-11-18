import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { Enemy1 } from "../actors/enemies/enemy-1";
import { EnemyBullet } from "../actors/enemies/enemy-bullets";
import { Ship } from "../actors/ship";
import { Bullet } from "../actors/weapon/gun/bullet";
import { Missile } from "../actors/weapon/missile/missile";
import { config } from "../conf";
import { idGenerator } from "../engine/actor";
import { Camera } from "../engine/camera";
import { Vector2 } from "../engine/geometry/vector2";
import { LiaisonStatus } from "../engine/network";
import { Scene } from "../engine/scene";
import { SpriteEngine } from "../engine/sprite-engine";
import { Player } from "../player";
import { StarField } from "../world/starfield";
import { GameNetEventTypes, multiplayer } from "./multiplayer";

export class GameScene implements Scene {
  spriteEngine: SpriteEngine;
  starField: StarField;
  music: Source;
  camera: Camera;
  ships = new Map<Player, Ship>();
  networkStatus: LiaisonStatus =
    multiplayer.network?.getStatus() ??
    LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;

  private newEnemy(
    id: number,
    type: "EnemyBullet" | "Enemy1" = "Enemy1"
  ): void {
    const enemy =
      type === "EnemyBullet"
        ? new EnemyBullet(
            id,
            this.spriteEngine,
            new Vector2(
              config.screenWidth + love.math.random(config.screenWidth),
              love.math.random(config.screenHeight)
            )
          )
        : new Enemy1(
            id,
            this.spriteEngine,
            new Vector2(
              config.screenWidth + love.math.random(config.screenWidth),
              love.math.random(config.screenHeight)
            )
          );
    this.spriteEngine.addActor(enemy);
    if (multiplayer.network?.isServer()) {
      multiplayer.network?.sendData(
        GameNetEventTypes.SyncActor,
        enemy.serialize()
      );
    }
  }

  constructor(private players: Player[]) {
    const enemyCount = 8;
    const bulletCount = 16;

    this.camera = new Camera();
    this.starField = new StarField(this.camera, 200);
    this.spriteEngine = new SpriteEngine();
    if (!multiplayer.network?.isClient()) {
      for (let i = 0; i < enemyCount; i++) {
        this.newEnemy(idGenerator.next(), "Enemy1");
      }
      for (let i = 0; i < bulletCount; i++) {
        this.newEnemy(idGenerator.next(), "EnemyBullet");
      }
    }
    this.music = love.audio.newSource("assets/fantastic-shmup.ogg", "stream");
    this.music.setLooping(true);
    this.music.setVolume(0.2);
    this.music.play();
    if (!multiplayer.network?.isClient()) {
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
        ship.listen("killed", (e) => {
          const ship = e.getSource();
          ship.score = Math.max(ship.score - 1000, 0);
          ship.pos = new Vector2(100, 100);
          ship.setInvincible(3);
          if (multiplayer.network?.isServer()) {
            multiplayer.network?.sendData(
              GameNetEventTypes.SyncActor,
              ship.serialize()
            );
          }
        });
        if (multiplayer.network?.isServer()) {
          multiplayer.network?.sendData(
            GameNetEventTypes.SyncActor,
            ship.serialize()
          );
        }
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

  networkUpdate(_dt: number): void {
    let receivedData = multiplayer.network?.receiveData();
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
        const [id, x, y] = content.split("|");
        const a = this.spriteEngine
          .getActors()
          .find((a) => a.id === parseInt(id));
        if (a) {
          a.pos = new Vector2(parseFloat(x), parseFloat(y));
        }
      } else if (type === GameNetEventTypes.ChangeWeapon) {
        const [id, weapon] = content.split("|");
        const a = this.spriteEngine
          .getActors()
          .find((a) => a.id === parseInt(id)) as Ship;
        if (a != null) {
          a.currentWeapon = parseInt(weapon);
        }
      } else if (type === GameNetEventTypes.RemoveActor) {
        const id = parseInt(content);
        const a = this.spriteEngine.getActors().find((a) => a.id === id);
        if (a) {
          this.spriteEngine.removeActor(a);
        }
      } else if (type === GameNetEventTypes.SyncActor) {
        const arr = content.split("|");
        const id = parseInt(arr[1]);
        const a = this.spriteEngine.getActors().find((a) => a.id === id);
        if (a) {
          a.deserialize?.(content);
        } else {
          if (arr[0] === "Ship") {
            const shipProps = Ship.deserialize(content);
            const player = this.players.find(
              (p) => p.id === shipProps.playerId
            );
            if (!player) throw new Error("Player not found");
            const newShip = new Ship(
              shipProps.id,
              this.spriteEngine,
              shipProps.pos,
              player
            );
            newShip.color = shipProps.color;
            this.ships.set(player, newShip);
            this.spriteEngine.addActor(newShip);
          } else if (arr[0] === "Enemy1") {
            const enemy = new Enemy1(id, this.spriteEngine, new Vector2(0, 0));
            enemy.deserialize(content);
            this.spriteEngine.addActor(enemy);
          } else if (arr[0] === "Bullet") {
            const bulletProps = Bullet.deserialize(content);
            const bullet = new Bullet(
              id,
              this.spriteEngine,
              new Vector2(0, 0),
              { id: bulletProps.parentId } as Ship
            );
            bullet.deserialize(bulletProps);
            this.spriteEngine.addActor(bullet);
          } else if (arr[0] === "Missile") {
            const missileProps = Missile.deserialize(content);
            const missile = new Missile(
              id,
              this.spriteEngine,
              new Vector2(0, 0),
              { id: missileProps.parentId } as Ship
            );
            missile.deserialize(missileProps);
            this.spriteEngine.addActor(missile);
          }
        }
      }
      receivedData = multiplayer.network?.receiveData();
    }
  }

  update(dt: number): void {
    this.networkStatus =
      multiplayer.network?.getStatus() ??
      LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
    for (const localPlayer of this.players.filter((p) => p.peerId == null)) {
      if (this.networkStatus === LiaisonStatus.LIAISON_STATUS_CONNECTED) {
        // send ship position
        const ship = this.ships.get(localPlayer);
        if (ship) {
          if (ship.lastPos.x !== ship.pos.x || ship.lastPos.y !== ship.pos.y) {
            multiplayer.network?.sendData(
              GameNetEventTypes.Position,
              `${ship.id}|${ship.pos.x.toFixed(3)}|${ship.pos.y.toFixed(3)}`
            );
            ship.lastPos = Vector2.of(ship.pos);
          }
        }
      }
      if (localPlayer.joystick.isGamepadDown("start") && localPlayer.isDead) {
        const ship = this.ships.get(localPlayer);
        if (!ship) throw new Error("No ship found");
        this.spriteEngine.addActor(ship);
        if (multiplayer.network?.isServer()) {
          multiplayer.network?.sendData(
            GameNetEventTypes.SyncActor,
            "" + ship.id
          );
        }
      }
      if (localPlayer.joystick.isGamepadDown("back")) {
        love.event.quit(0);
      }
    }
    this.networkUpdate(dt);
    this.starField.update(dt);
    this.spriteEngine.update(dt);
    multiplayer.network?.update(dt);
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
