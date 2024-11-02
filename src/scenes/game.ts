import { Source } from "love.audio";
import { Enemy1 } from "../actors/enemies/enemy-1";
import { config } from "../conf";
import { Camera } from "../engine/camera";
import { Engine } from "../engine/engine";
import { Input } from "../engine/input/input";
import { Scene } from "../engine/scene";
import { SpriteEngine } from "../engine/sprite-engine";
import { Vector2 } from "../engine/tools";
import { StarField } from "../world/starfield";
import { Joystick } from "love.joystick";
import { Ship } from "../actors/ship";
import { Screen } from "love.graphics";

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

  constructor() {
    const enemyCount = 10;

    Input.init();
    Engine.load();
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
  }

  update(dt: number): void {
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadDown("start") && this.ships.get(joystick) == null) {
        const ship = new Ship(
          this.spriteEngine,
          new Vector2(100, 100),
          joystick
        );
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
    }
    this.starField.update(dt);
    this.spriteEngine.update(dt);
  }
  draw(screen?: Screen): void {
    if (screen !== "bottom") {
      this.starField.draw(screen);
      this.spriteEngine.draw(screen);
    }
  }
  unload(): void {
    // nothing to explicitely unload
  }
}
