import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { Joystick } from "love.joystick";
import { Enemy1 } from "../actors/enemies/enemy-1";
import { Ship } from "../actors/ship";
import { config } from "../conf";
import { Camera } from "../engine/camera";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { InputActions } from "../engine/input/input";
import { Scene } from "../engine/scene";
import { SpriteEngine } from "../engine/sprite-engine";
import { Vector2 } from "../engine/tools";
import { StarField } from "../world/starfield";

export class GameScene implements Scene {
  spriteEngine: SpriteEngine;
  starField: StarField;
  music: Source;
  camera: Camera;
  ships = new Map<Joystick, Ship>();

  private newEnemy() {
    this.spriteEngine.addActor(
      new Enemy1(
        this.spriteEngine,
        new Vector2(
          config.screenWidth + love.math.random(config.screenWidth),
          love.math.random(config.screenHeight)
        )
      )
    );
  }

  constructor(private players: ExtendedJoystick<InputActions>[]) {
    const enemyCount = 10;

    this.camera = new Camera();
    this.starField = new StarField(this.camera, 200);
    this.spriteEngine = new SpriteEngine();
    for (let i = 0; i < enemyCount; i++) {
      this.newEnemy();
    }
    this.music = love.audio.newSource("assets/fantastic-shmup.ogg", "stream");
    this.music.setLooping(true);
    this.music.setVolume(0.2);
    this.music.play();
    let idx = 0;
    for (const joystick of players) {
      const ship = new Ship(this.spriteEngine, new Vector2(100, 100), joystick);
      ship.color = GameScene.getShipColor(idx++);
      this.spriteEngine.addActor(ship);
      this.ships.set(joystick, ship);
      ship.listen("killed", () => {
        const ship = this.ships.get(joystick);
        if (ship) {
          this.spriteEngine.removeActor(ship);
          this.ships.delete(joystick);
        }
      });
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

  update(dt: number): void {
    let idx = 0;
    for (const joystick of this.players) {
      if (joystick.isGamepadDown("start") && this.ships.get(joystick) == null) {
        const ship = new Ship(
          this.spriteEngine,
          new Vector2(100, 100),
          joystick
        );
        ship.color = GameScene.getShipColor(idx);
        this.spriteEngine.addActor(ship);
        this.ships.set(joystick, ship);
        ship.listen("killed", () => {
          const ship = this.ships.get(joystick);
          if (ship) {
            this.spriteEngine.removeActor(ship);
            this.ships.delete(joystick);
          }
        });
      }
      if (joystick.isGamepadDown("back")) {
        love.event.quit(0);
      }
      idx++;
    }
    this.starField.update(dt);
    this.spriteEngine.update(dt);
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
