import { Network } from "../engine/network";
import { NetEventTypes } from "../engine/network/utils";

export const multiplayer: {network: Network | undefined} = {network: undefined};

export enum GameNetEventTypes {
  // default events
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  None = NetEventTypes.None,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  Connected = NetEventTypes.Connected,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  Disconnected = NetEventTypes.Disconnected,
  // player events
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const UdsNetwork = require("../engine/network/uds-network").UdsNetwork;
    multiplayer.network = new UdsNetwork();
    print("network", multiplayer);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const EnetNetwork = require("../engine/network/enet-network").EnetNetwork;
    multiplayer.network = new EnetNetwork();
    print("network", multiplayer);
  }
}
