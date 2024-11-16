import { Source } from "love.audio";
import { Screen } from "love.graphics";
import { Joystick } from "love.joystick";
import * as urutora from "urutora";
import { config } from "../../conf";
import { Camera } from "../../engine/camera";
import {
  Event,
  EventEmitter,
  SimpleEvent,
  SimpleEventEmitter,
} from "../../engine/event";
import { ExtendedJoystick } from "../../engine/input/extended-joystick";
import { Input, InputActions } from "../../engine/input/input";
import { LiaisonMode, LiaisonStatus } from "../../engine/network";
import { Scene } from "../../engine/scene";
import { u } from "../../gui";
import { Player } from "../../player";
import { StarField } from "../../world/starfield";
import { GameNetEventTypes, initNetwork, multiplayer } from "../multiplayer";
import { startScreenGui } from "./start-screen-gui";

let currentGuiIdx = 0;

const playerIdGenerator = {
  next: () => {
    return playerIdGenerator.current++;
  },
  current: 0,
};

let status = LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
export class StartScreenScene
  implements Scene, EventEmitter<"start", StartScreenScene>
{
  music: Source;
  joysticks = new Map<
    ExtendedJoystick<InputActions>,
    { player: Player; readyState: boolean }
  >();
  private emitter = new SimpleEventEmitter<"start", StartScreenScene>();
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
    const panel = startScreenGui({
      onStartAction: (e: any) => {
        u.remove(panel);
        if (!multiplayer.network?.isClient()) {
          this.start = true;
          if (multiplayer.network?.isServer()) {
            multiplayer.network?.sendData(GameNetEventTypes.Start, "start");
          }
        }
      },
      onHostAction: (e: any) => {
        initNetwork();
        if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
          multiplayer.network?.init(config.network?.passphrase);
          status = LiaisonStatus.LIAISON_STATUS_PENDING;
          multiplayer.network?.host();
          multiplayer.network?.waitConnectionStatusEvent(false, false);
        }
      },
      onJoinAction: (e: any) => {
        initNetwork();
        if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
          multiplayer.network?.init(config.network?.passphrase);
          status = LiaisonStatus.LIAISON_STATUS_PENDING;
          multiplayer.network?.join();
        }
      },
    });
    u.add(panel);
    this.startButton = u.getByTag("start-button") as urutora.Button;
    this.startButton.disable();
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
    callback: (e: Event<"start", StartScreenScene>) => void
  ): void {
    return this.emitter.listen(eventType, callback);
  }

  ready(joystick: ExtendedJoystick<InputActions>, peerId?: number): Player {
    const p = this.joysticks.get(joystick);
    if (p == null) {
      const newP = {
        player: new Player(playerIdGenerator.next(), joystick, peerId),
        readyState: true,
      };
      this.joysticks.set(joystick, newP);
      this.startButton.enable();
      return newP.player;
    }
    return p.player;
  }

  update(dt: number): void {
    if (this.getPlayers().length <= 0) {
      this.startButton.disable();
    }
    if (this.start) {
      this.emitter.pushEvent(new SimpleEvent("start", this));
      return;
    }
    const visibleWidgets = u.nodes
      .flatMap((n) =>
        n.type === urutora.utils.nodeTypes.PANEL
          ? [
              n,
              ...Object.entries((n as urutora.Panel).children)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([k, v]) => v),
            ]
          : [n]
      )
      .filter(
        (n) =>
          n.visible &&
          n.type !== urutora.utils.nodeTypes.PANEL &&
          n.type !== urutora.utils.nodeTypes.LABEL
      );
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadReleased("start")) {
        this.ready(joystick);
      }
      if (joystick.isGamepadReleased("back")) {
        love.event.quit(0);
      }
      if (joystick.isGamepadReleased("dpup")) {
        currentGuiIdx = Math.abs((currentGuiIdx - 1) % visibleWidgets.length);
        urutora.lm.setPosition(
          visibleWidgets[currentGuiIdx].centerX() * urutora.utils.sx,
          visibleWidgets[currentGuiIdx].centerY() * urutora.utils.sy
        );
      }
      if (joystick.isGamepadReleased("dpdown")) {
        currentGuiIdx = Math.abs((currentGuiIdx + 1) % visibleWidgets.length);
        urutora.lm.setPosition(
          visibleWidgets[currentGuiIdx].centerX() * urutora.utils.sx,
          visibleWidgets[currentGuiIdx].centerY() * urutora.utils.sy
        );
      }
      if (joystick.isActionPressed("confirm")) {
        const node = visibleWidgets[currentGuiIdx];
        u.pressed(
          node.centerX() * urutora.utils.sx,
          node.centerY() * urutora.utils.sy,
          urutora.utils.mouseButtons.LEFT
        );
      }
      if (joystick.isActionReleased("confirm")) {
        const node = visibleWidgets[currentGuiIdx];
        u.released(
          node.centerX() * urutora.utils.sx,
          node.centerY() * urutora.utils.sy
        );
      }
    }
    status =
      multiplayer.network?.getStatus() ||
      LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
    if (status === LiaisonStatus.LIAISON_STATUS_CONNECTED) {
      let receivedData = multiplayer.network?.receiveData();
      while (receivedData) {
        const [type, content, peerId] = receivedData;
        if (type === GameNetEventTypes.Connected) {
          const p = this.ready(Input.registerNullJoystick());
          p.peerId = peerId;
          if (multiplayer.network?.isClient()) {
            p.id = 0; // server is always player 0
          } else if (multiplayer.network?.isServer()) {
            // send the id to the client
            multiplayer.network?.sendData(
              GameNetEventTypes.Ready,
              "" + p.id,
              peerId
            );
          }
        } else if (type === GameNetEventTypes.Start) {
          // start the game
          this.start = true;
        } else if (type === GameNetEventTypes.Ready) {
          // get the id from the server
          if (multiplayer.network?.isClient()) {
            const id = parseInt(content);
            this.joysticks.forEach((p) => {
              if (p.player.peerId == null) {
                p.player.id = id;
              }
            });
          }
        }
        receivedData = multiplayer.network?.receiveData();
      }
    }
    this.starField.update(dt);
    multiplayer.network?.update(dt);
  }
  draw(screen?: Screen): void {
    if (screen !== "bottom") {
      this.starField.draw();
      if (
        status === LiaisonStatus.LIAISON_STATUS_PENDING &&
        multiplayer.network?.getMode() === LiaisonMode.LIAISON_MODE_SERVER
      ) {
        multiplayer.network?.waitConnectionStatusEvent(false, false);
      }
      this.displayNetworkStatus();
      this.joysticks.forEach((p) => {
        love.graphics.setColor(1, 1, 1);
        love.graphics.print(
          "ready",
          10 + p.player.id * 50,
          config.screenHeight - 30
        );
        love.graphics.setColor(1, 1, 1);
      });
      urutora.utils.prettyPrint(
        "<press start>",
        10 + this.joysticks.size * 50,
        config.screenHeight - 30,
        { fgColor: urutora.utils.style.fgColor }
      );
    }
  }
  private displayNetworkStatus() {
    if (multiplayer.network?.isServer() || multiplayer.network?.isClient()) {
      const liaisonResult = ["not connected", "pending", "connected"][
        Math.max(Math.min(status, 2), 0)
      ];
      love.graphics.print(liaisonResult, 10, 10);
    }
  }

  unload(): void {
    this.music.stop();
    this.music.release();
  }
}
