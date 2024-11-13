import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { GamepadButton, Joystick } from "love.joystick";
import * as urutora from "urutora";
import { Urutora } from "urutora";
import { config } from "../conf";
import { Camera } from "../engine/camera";
import {
  Event,
  EventEmitter,
  SimpleEvent,
  SimpleEventEmitter,
} from "../engine/event";
import { ExtendedJoystick } from "../engine/input/extended-joystick";
import { Input, InputActions } from "../engine/input/input";
import { LiaisonMode, LiaisonStatus } from "../engine/network";
import { Scene } from "../engine/scene";
import { Player } from "../player";
import { StarField } from "../world/starfield";
import { GameNetEventTypes, network } from "./network";
const u: Urutora = (urutora as any).new();
u.setDimensions(0, 0, 4, 4);

love.mousepressed = (x: number, y: number, button: number) =>
  u.pressed(x, y, button);
love.mousemoved = (x: number, y: number, dx: number, dy: number) =>
  u.moved(x, y, dx, dy);
love.mousereleased = (x: number, y: number, _button: number) =>
  u.released(x, y);
love.textinput = (text: string) => u.textinput(text);
love.keypressed = (k: string, scancode: string, isrepeat: boolean) =>
  u.keypressed(k, scancode, isrepeat);
love.wheelmoved = (x: number, y: number) => u.wheelmoved(x, y);
love.gamepadpressed = ((cb) => {
  return function (j: Joystick, b: GamepadButton) {
    if (cb) {
      cb(j, b);
    }
  };
})(love.gamepadpressed);
let currentGuiIdx = 0;

const playerIdGenerator = {
  next: () => {
    return playerIdGenerator.current++;
  },
  current: 0,
};

let status = LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
export class MenuScene implements Scene, EventEmitter<"start", MenuScene> {
  music: Source;
  joysticks = new Map<
    ExtendedJoystick<InputActions>,
    { player: Player; readyTime: number }
  >();
  private emitter = new SimpleEventEmitter<"start", MenuScene>();
  private joystickAddedEvents: Joystick[] = [];
  private starField: StarField;
  private start = false;
  private startButton: urutora.Button;

  constructor() {
    this.music = love.audio.newSource("assets/menu.ogg", "stream");
    this.music.setLooping(true);
    this.music.setVolume(0.2);
    this.music.play();
    this.starField = new StarField(new Camera(), 200);
    love.joystickadded = (j) => {
      this.joystickAddedEvents.push(j);
    };
    network.init("udsdemo passphrase c186093cd2652741");
    let yPos = 70;
    const startButton = u.button({
      tag: "start",
      text: "Start",
      x: 100,
      y: (yPos += 30),
      w: 200,
      idx: 0,
    });
    startButton.center();
    startButton.update = (_dt) => {
      startButton.enabled = this.getPlayers().length > 0;
    };
    startButton.action((e: any) => {
      if (!network.isClient()) {
        this.start = true;
        if (network.isServer()) {
          network.sendData(GameNetEventTypes.Start, "start");
        }
      }
    });
    this.startButton = startButton;

    const hostButton = u.button({
      tag: "host",
      text: "Host",
      x: 100,
      y: (yPos += 30),
      w: 200,
      idx: 1,
    });
    hostButton.action((e: any) => {
      if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
        status = LiaisonStatus.LIAISON_STATUS_PENDING;
        network.host();
        network.waitConnectionStatusEvent(false, false);
      }
      hostButton.visible = false;
      joinButton.visible = false;
    });
    const joinButton = u.button({
      text: "Join",
      x: 100,
      y: (yPos += 30),
      w: 200,
      idx: 1,
    });
    joinButton.action((e: any) => {
      if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
        status = LiaisonStatus.LIAISON_STATUS_PENDING;
        network.join();
      }
      hostButton.visible = false;
      joinButton.visible = false;
    });
    u.add(startButton);
    u.add(hostButton);
    u.add(joinButton);
  }

  getPlayers(): Player[] {
    const result: Player[] = [];
    this.joysticks.forEach((p) => {
      result.push(p.player);
    });
    return result;
  }

  listen(
    eventType: "start",
    callback: (e: Event<"start", MenuScene>) => void
  ): void {
    return this.emitter.listen(eventType, callback);
  }

  ready(joystick: ExtendedJoystick<InputActions>, peerId?: number): Player {
    this.startButton.enabled = true;
    const p = this.joysticks.get(joystick);
    if (p == null) {
      const newP = {
        player: new Player(playerIdGenerator.next(), joystick, peerId),
        readyTime: love.timer.getTime(),
      };
      this.joysticks.set(joystick, newP);
      return newP.player;
    }
    return p.player;
  }

  update(dt: number): void {
    u.update(dt);
    if (this.start) {
      this.emitter.pushEvent(new SimpleEvent("start", this));
      return;
    }
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadReleased("start")) {
        this.ready(joystick);
      }
      if (joystick.isGamepadReleased("back")) {
        love.event.quit(0);
      }
      if (joystick.isGamepadReleased("dpup")) {
        currentGuiIdx = Math.abs(
          (currentGuiIdx - 1) % u.nodes.filter((n) => n.visible).length
        );
        love.mouse.setPosition(
          u.nodes[currentGuiIdx].centerX() * u.utils.sx,
          u.nodes[currentGuiIdx].centerY() * u.utils.sy
        );
      }
      if (joystick.isGamepadReleased("dpdown")) {
        currentGuiIdx = Math.abs((currentGuiIdx + 1) % u.nodes.length);
        love.mouse.setPosition(
          u.nodes[currentGuiIdx].centerX() * u.utils.sx,
          u.nodes[currentGuiIdx].centerY() * u.utils.sy
        );
      }
      if (joystick.isGamepadDown("a")) {
        const node = u.nodes[currentGuiIdx];
        u.pressed(
          node.centerX() * u.utils.sx,
          node.centerY() * u.utils.sy,
          u.utils.mouseButtons.LEFT
        );
      }
      if (joystick.isGamepadReleased("a")) {
        const node = u.nodes[currentGuiIdx];
        u.released(node.centerX() * u.utils.sx, node.centerY() * u.utils.sy);
      }
    }
    let receivedData = network.receiveData();
    while (receivedData) {
      const [type, content, peerId] = receivedData;
      if (type === GameNetEventTypes.Connected) {
        const p = this.ready(Input.registerNullJoystick());
        p.peerId = peerId;
        if (network.isClient()) {
          p.id = 0; // server is always player 0
        } else if (network.isServer()) {
          // send the id to the client
          network.sendData(GameNetEventTypes.Ready, "" + p.id, peerId);
        }
      } else if (type === GameNetEventTypes.Start) {
        // start the game
        this.start = true;
      } else if (type === GameNetEventTypes.Ready) {
        // get the id from the server
        if (network.isClient()) {
          const id = parseInt(content);
          this.joysticks.forEach((p) => {
            if (p.player.peerId == null) {
              p.player.id = id;
            }
          });
        }
      }
      receivedData = network.receiveData();
    }
    status = network.getStatus();
    this.starField.update(dt);
    network.update(dt);
  }
  sendJoys() {
    if (
      status === LiaisonStatus.LIAISON_STATUS_PENDING &&
      network.getMode() === LiaisonMode.LIAISON_MODE_SERVER
    ) {
      network.waitConnectionStatusEvent(false, false);
    }
  }

  draw(screen?: Screen): void {
    if (screen !== "bottom") {
      this.starField.draw();
      this.sendJoys();
      const liaisonResult = ["not connected", "pending", "connected"][
        Math.max(Math.min(status, 2), 0)
      ];
      love.graphics.print(liaisonResult, 10, 10);

      this.joysticks.forEach((p) => {
        if (love.timer.getTime() - p.readyTime < 1) {
          love.graphics.setColor(0.6, 0.6, 0.3);
        } else {
          love.graphics.setColor(1, 1, 1);
        }
        love.graphics.print(
          "ready",
          10 + p.player.id * 50,
          config.screenHeight - 30
        );
        love.graphics.setColor(1, 1, 1);
      });
      u.draw();
    }
  }
  unload(): void {
    this.music.stop();
    this.music.release();
  }
}
