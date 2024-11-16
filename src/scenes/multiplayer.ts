import { Network } from "../engine/network";
import { NetEventTypes } from "../engine/network/utils";

export let multiplayer: {network: Network | undefined} = {network: undefined};

export enum GameNetEventTypes {
  // default events
  None = NetEventTypes.None,
  Connected = NetEventTypes.Connected,
  Disconnected = NetEventTypes.Disconnected,
  // player events
  Button = NetEventTypes.Last + 1,
  Position,
  Fire,
  ChangeWeapon,
  Hit,
  SyncActor,
  RemoveActor,
  // enemy events
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

export function initNetwork() {
  print("init network");
  if (love._console === "3DS") {
    const UdsNetwork = require("../engine/network/uds-network").UdsNetwork;
    multiplayer.network = new UdsNetwork();
    print("network", multiplayer);
  } else {
    const EnetNetwork = require("../engine/network/enet-network").EnetNetwork;
    multiplayer.network = new EnetNetwork();
    print("network", multiplayer);
  }
}
