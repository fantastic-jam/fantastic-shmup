import { getOS } from "love.system";
import { Network } from "../engine/network";
import { EnetNetwork } from "../engine/network/enet-network";
import { UdsNetwork } from "../engine/network/uds-network";
import { NetEventTypes } from "../engine/network/utils";

export const network: Network =
  (getOS() as string) === "3DS" ? new UdsNetwork() : new EnetNetwork();

export enum GameNetEventTypes {
  // default events
  None = NetEventTypes.None,
  Connected = NetEventTypes.Connected,
  Disconnected = NetEventTypes.Disconnected,
  // player events
  Button = NetEventTypes.Last + 1,
  Position,
  Fire,
  Hit,
  Respawn,
  // enemy events
  EnemySpawn,
  // game events
  Ready,
  Start,
  Score,
  Gameover,
  Reset,
  Pause,
  Resume,
  Quit,
}
