import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { Joystick } from "love.joystick";
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
import { formatData, parseData } from "../engine/network/utils";
import { Scene } from "../engine/scene";
import { StarField } from "../world/starfield";
import { GameNetEventTypes, network } from "./network";
import { Player } from "../player";

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
    const p = this.joysticks.get(joystick);
    if (p == null) {
      const newP = {
        player: new Player(playerIdGenerator.next(), joystick, peerId),
        readyTime: love.timer.getTime(),
      };
      this.joysticks.set(joystick, newP);
      return newP.player;
    } else if (!network.isClient() && love.timer.getTime() - p.readyTime > 1) {
      this.start = true;
      if (network.isServer()) {
        network.sendData(GameNetEventTypes.Start, "start");
      }
    }
    return p.player;
  }

  update(dt: number): void {
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
    this.joysticks.forEach((l, j) => {
      if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
        if (j.isGamepadDown("leftshoulder")) {
          status = LiaisonStatus.LIAISON_STATUS_PENDING;
          network.host();
          network.waitConnectionStatusEvent(false, false);
        } else if (j.isGamepadDown("rightshoulder")) {
          status = LiaisonStatus.LIAISON_STATUS_PENDING;
          network.join();
        }
      }
    });
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
    }
  }
  unload(): void {
    this.music.stop();
    this.music.release();
  }
}
