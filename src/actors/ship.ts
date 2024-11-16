import { Image } from "love.graphics";
import { CollisionLayer } from "../collisions";
import { config } from "../conf";
import { Actor, Damageable, idGenerator } from "../engine/actor";
import { BoxCollider2d } from "../engine/collision/box-collider2d";
import { Engine } from "../engine/engine";
import {
  Event,
  EventEmitter,
  SimpleEvent,
  SimpleEventEmitter,
} from "../engine/event";
import { SpriteEngine } from "../engine/sprite-engine";
import { AnimatedSprite } from "../engine/sprite/animated-sprite";
import { Rectangle, Vector2 } from "../engine/tools";
import { Player } from "../player";
import { GameNetEventTypes, multiplayer } from "../scenes/multiplayer";
import { WeaponGun } from "./weapon/gun/weapon_gun";
import { WeaponMissile } from "./weapon/missile/weapon_missile";
import { Weapon } from "./weapon/weapon";

let image: Image;
Engine.preload(() => {
  image = love.graphics.newImage("/assets/ship.png");
});

export type DeserializedShip = {
  id: number;
  pos: Vector2;
  playerId: number;
  color: [number, number, number];
  currentWeapon: number;
  invincibleUntil: number;
};

export class Ship
  extends Actor
  implements Damageable, EventEmitter<"killed", Ship>
{
  /**
   * Set the ship to be invincible for a certain amount of time
   * @param time The time in seconds the ship will be invincible
   */
  setInvincible(time: number) {
    this.invincibleUntil = love.timer.getTime() + time;
  }

  /**
   * Check if the ship is invincible
   * @returns True if the ship is invincible
   */
  isInvincible(): boolean {
    return this.invincibleUntil > love.timer.getTime();
  }

  weapons: Weapon[];
  currentWeapon = 0;
  private simpleEventEmitter = new SimpleEventEmitter<"killed", Ship>();
  public score = 0;
  public color: [number, number, number] = [1, 1, 1];
  public invincibleUntil = 0;

  constructor(
    id: number,
    spriteEngine: SpriteEngine,
    pos: Vector2,
    public readonly player: Player
  ) {
    const animatedSprite = new AnimatedSprite(image, 40, 32, 0.1);
    const collider = new BoxCollider2d(
      new Rectangle(17, 10, 21, 12),
      [CollisionLayer.PLAYERS],
      [CollisionLayer.ENEMIES]
    );
    super(id, "Ship", spriteEngine, pos, 200, animatedSprite, collider);

    this.weapons = [
      new WeaponGun(
        idGenerator.next(),
        spriteEngine,
        new Vector2(35, 13),
        0.1,
        this
      ),
      new WeaponMissile(
        idGenerator.next(),
        spriteEngine,
        new Vector2(30, 10),
        0.4,
        this
      ),
    ];
  }
  listen(
    eventType: "killed",
    callback: (_e: Event<"killed", Ship>) => void
  ): void {
    this.simpleEventEmitter.listen(eventType, callback);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  damage(_src: Actor | undefined, _amount: number): void {
    this.simpleEventEmitter.pushEvent(new SimpleEvent("killed", this));
  }

  getScore(): number {
    return this.score;
  }

  private getDir(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    const j = this.player.joystick;

    let axisX = j.getGamepadAxis("leftx");
    let axisY = j.getGamepadAxis("lefty");

    if (j.isGamepadDown("dpleft") || j.isGamepadDown("dpright")) {
      axisX =
        0 +
        (j.isGamepadDown("dpleft") ? -1 : 0) +
        (j.isGamepadDown("dpright") ? 1 : 0);
    }

    if (j.isGamepadDown("dpup") || j.isGamepadDown("dpdown")) {
      axisY =
        0 +
        (j.isGamepadDown("dpup") ? -1 : 0) +
        (j.isGamepadDown("dpdown") ? 1 : 0);
    }

    if (Math.abs(axisX) > 0.2) {
      x = axisX;
    }

    if (Math.abs(axisY) > 0.2) {
      y = axisY;
    }
    return { x, y };
  }

  private isMainWeaponFiring(): boolean {
    if (this.player.joystick.isActionDown("fire")) {
      return true;
    }
    return false;
  }

  update(dt: number) {
    super.update(dt); // Call the parent class's update method
    this.weapons[this.currentWeapon].update(dt);

    const dir = this.getDir();

    this.pos.x += dir.x * this.speed * dt;
    this.pos.y += dir.y * this.speed * dt;

    if (this.pos.x + (this.sprite?.getWidth() ?? 0) > config.screenWidth) {
      this.pos.x = config.screenWidth - (this.sprite?.getWidth() ?? 0);
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.y + (this.sprite?.getHeight() ?? 0) > config.screenHeight) {
      this.pos.y = config.screenHeight - (this.sprite?.getHeight() ?? 0);
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
    }

    if (this.isMainWeaponFiring()) {
      const fired = this.weapons[this.currentWeapon].fire();
      if (fired && this.player.isLocal() && multiplayer.network?.isClient()) {
        multiplayer.sendData(GameNetEventTypes.Fire, `${this.id}|fire`);
      }
    }

    let weaponIdx = this.currentWeapon;
    if (this.player.joystick.isActionReleased("weapon_up")) {
      weaponIdx = Math.abs((this.currentWeapon + 1) % this.weapons.length);
    }
    if (this.player.joystick.isActionReleased("weapon_down")) {
      weaponIdx = Math.abs((this.currentWeapon - 1) % this.weapons.length);
    }
    if (weaponIdx !== this.currentWeapon) {
      if (!multiplayer.network?.isClient()) {
        this.currentWeapon = weaponIdx;
      }
      if (multiplayer.network?.isClient() || multiplayer.network?.isServer()) {
        multiplayer.sendData(
          GameNetEventTypes.ChangeWeapon,
          `${this.id}|${weaponIdx}`
        );
      }
    }
  }

  draw() {
    let alpha = 1;
    if (this.isInvincible()) {
      alpha = 0.5 + 0.5 * Math.sin(love.timer.getTime() * 20);
    }
    love.graphics.setColor(...this.color, alpha < 1 ? alpha * 0.5 : alpha);
    love.graphics.rectangle("fill", this.pos.x + 21, this.pos.y + 11, 15, 6);
    love.graphics.setBlendMode("alpha");
    love.graphics.setColor(1, 1, 1, alpha);
    super.draw();
    this.weapons[this.currentWeapon].draw();
    love.graphics.setColor(1, 1, 1);
  }

  serialize(): string {
    return [
      "Ship",
      this.id,
      this.pos.x,
      this.pos.y,
      this.player.id,
      ...this.color.map((c) => Math.round(c * 255)),
      this.currentWeapon,
      this.invincibleUntil,
    ].join("|");
  }
  deserialize(data: string | DeserializedShip): void {
    const props = typeof data === "string" ? Ship.deserialize(data) : data;
    this.id = props.id;
    this.player.id = props.playerId;
    this.pos = props.pos;
    this.color = props.color;
    this.currentWeapon = props.currentWeapon;
    this.invincibleUntil = props.invincibleUntil;
  }
  static deserialize(data: string | string[]): DeserializedShip {
    const arr = typeof data === "string" ? data.split("|") : data;
    let idx = 1;
    return {
      id: parseInt(arr[idx++]),
      pos: new Vector2(parseFloat(arr[idx++]), parseFloat(arr[idx++])),
      playerId: parseInt(arr[idx++]),
      color: [
        parseInt(arr[idx++]) / 255,
        parseInt(arr[idx++]) / 255,
        parseInt(arr[idx++]) / 255,
      ],
      currentWeapon: parseInt(arr[idx++]),
      invincibleUntil: parseInt(arr[idx++]),
    };
  }
}
