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
import { GameNetEventTypes, network } from "../network";

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
    let yPos = 40;
    const startButton = u.button({
      tag: "start",
      text: "Start",
      x: 100,
      y: (yPos += 40),
      w: 200,
      h: 30,
      idx: 0,
    });
    startButton.center();
    startButton.update = (_dt) => {
      startButton.enabled = this.getPlayers().length > 0;
    };
    startButton.action((e: any) => {
      print("!network?.isClient()", !network?.isClient());
      if (!network?.isClient()) {
        this.start = true;
        print("start", this.start);
        if (network?.isServer()) {
          network?.sendData(GameNetEventTypes.Start, "start");
        }
      }
    });
    this.startButton = startButton;

    const hostButton = u.button({
      tag: "host",
      text: "Host",
      x: 100,
      y: (yPos += 40),
      w: 200,
      h: 30,
      idx: 1,
    });
    hostButton.action((e: any) => {
      if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
        network?.init(config.network?.passphrase);
        status = LiaisonStatus.LIAISON_STATUS_PENDING;
        network?.host();
        network?.waitConnectionStatusEvent(false, false);
      }
      hostButton.visible = false;
      hostButton.enabled = false;
      joinButton.visible = false;
      joinButton.enabled = false;
    });
    const joinButton = u.button({
      text: "Join",
      x: 100,
      y: (yPos += 40),
      w: 200,
      h: 30,
      idx: 1,
    });
    joinButton.action((e: any) => {
      if (status === LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED) {
        network?.init(config.network?.passphrase);
        status = LiaisonStatus.LIAISON_STATUS_PENDING;
        network?.join();
      }
      startButton.disable();
      startButton.text = "Waiting for host";
      hostButton.visible = false;
      hostButton.enabled = false;
      joinButton.visible = false;
      joinButton.enabled = false;
    });
    const text = u.text({
      text: "host",
      x: 100,
      y: (yPos += 40),
      w: 200,
      h: 30,
    });
    u.add(startButton);
    u.add(hostButton);
    u.add(joinButton);
    u.add(text);
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
      this.startButton.enabled = this.getPlayers().length > 0;
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
    const visibleNodes = u.nodes.filter((n) => n.visible);
    for (const joystick of Input.getJoysticks()) {
      if (joystick.isGamepadReleased("start")) {
        this.ready(joystick);
      }
      if (joystick.isGamepadReleased("back")) {
        love.event.quit(0);
      }
      if (joystick.isGamepadReleased("dpup")) {
        currentGuiIdx = Math.abs((currentGuiIdx - 1) % visibleNodes.length);
        urutora.lm.setPosition(
          visibleNodes[currentGuiIdx].centerX() * urutora.utils.sx,
          visibleNodes[currentGuiIdx].centerY() * urutora.utils.sy
        );
      }
      if (joystick.isGamepadReleased("dpdown")) {
        currentGuiIdx = Math.abs((currentGuiIdx + 1) % visibleNodes.length);
        urutora.lm.setPosition(
          visibleNodes[currentGuiIdx].centerX() * urutora.utils.sx,
          visibleNodes[currentGuiIdx].centerY() * urutora.utils.sy
        );
      }
      if (joystick.isActionPressed("confirm")) {
        const node = visibleNodes[currentGuiIdx];
        print("pressed !");
        u.pressed(
          node.centerX() * urutora.utils.sx,
          node.centerY() * urutora.utils.sy,
          urutora.utils.mouseButtons.LEFT
        );
      }
      if (joystick.isActionReleased("confirm")) {
        const node = visibleNodes[currentGuiIdx];
        print("released !");
        u.released(
          node.centerX() * urutora.utils.sx,
          node.centerY() * urutora.utils.sy
        );
      }
    }
    status = network?.getStatus() || LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
    if (status === LiaisonStatus.LIAISON_STATUS_CONNECTED) {
      let receivedData = network?.receiveData();
      while (receivedData) {
        const [type, content, peerId] = receivedData;
        if (type === GameNetEventTypes.Connected) {
          const p = this.ready(Input.registerNullJoystick());
          p.peerId = peerId;
          if (network?.isClient()) {
            p.id = 0; // server is always player 0
          } else if (network?.isServer()) {
            // send the id to the client
            network?.sendData(GameNetEventTypes.Ready, "" + p.id, peerId);
          }
        } else if (type === GameNetEventTypes.Start) {
          // start the game
          this.start = true;
        } else if (type === GameNetEventTypes.Ready) {
          // get the id from the server
          if (network?.isClient()) {
            const id = parseInt(content);
            this.joysticks.forEach((p) => {
              if (p.player.peerId == null) {
                p.player.id = id;
              }
            });
          }
        }
        receivedData = network?.receiveData();
      }
    }
    this.starField.update(dt);
    network?.update(dt);
  }
  sendJoys() {
    if (
      status === LiaisonStatus.LIAISON_STATUS_PENDING &&
      network?.getMode() === LiaisonMode.LIAISON_MODE_SERVER
    ) {
      network?.waitConnectionStatusEvent(false, false);
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
        love.graphics.setColor(1, 1, 1);
        love.graphics.print(
          "ready",
          10 + p.player.id * 50,
          config.screenHeight - 30
        );
        love.graphics.setColor(1, 1, 1);
      });
      love.graphics.print(
        "<press start>",
        10 + this.joysticks.size * 50,
        config.screenHeight - 30
      );

      u.draw();
    }
  }
  unload(): void {
    this.music.stop();
    this.music.release();
  }
}
