import { Host, host_create, Peer } from "enet";
import { LiaisonMode, LiaisonStatus, Network } from "../network";
import { formatData, NetEventTypes, parseData } from "./utils";

const peerIdGenerator = {
  next: () => {
    return peerIdGenerator.current++;
  },
  current: 0,
};
export class EnetNetwork implements Network {
  mode: LiaisonMode = LiaisonMode.LIAISON_MODE_NONE;
  enetHost: Host | undefined;
  peers = {
    idToPeer: new Map<number, Peer>(),
    peerToId: new Map<Peer, number>(),
    add(id: number, peer: Peer) {
      this.idToPeer.set(id, peer);
      this.peerToId.set(peer, id);
    },
    removeId(id: number) {
      const peer = this.idToPeer.get(id);
      if (peer) {
        this.idToPeer.delete(id);
        this.peerToId.delete(peer);
      }
    },
    removePeer(peer: Peer) {
      const id = this.peerToId.get(peer);
      if (id) {
        this.idToPeer.delete(id);
        this.peerToId.delete(peer);
      }
    },
  };

  init(passphrase: string): string {
    return liaison?.init(passphrase) ?? "no network";
  }
  print_constatus(): void {
    liaison?.print_constatus();
  }
  getStatus(): LiaisonStatus {
    return this.enetHost != null
      ? LiaisonStatus.LIAISON_STATUS_CONNECTED
      : LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
  }
  getMode(): LiaisonMode {
    return this.mode;
  }
  isClient(): boolean {
    return this.mode === LiaisonMode.LIAISON_MODE_CLIENT;
  }
  isServer(): boolean {
    return this.mode === LiaisonMode.LIAISON_MODE_SERVER;
  }
  host(): boolean {
    this.mode = LiaisonMode.LIAISON_MODE_SERVER;
    this.enetHost = host_create("0.0.0.0:1234");
    return true;
  }
  waitConnectionStatusEvent(nextEvent: boolean, wait: boolean): boolean {
    return liaison?.waitConnectionStatusEvent(nextEvent, wait) ?? false;
  }
  join(): boolean {
    this.mode = LiaisonMode.LIAISON_MODE_CLIENT;
    this.enetHost = host_create();
    this.enetHost.connect("localhost:1234");
    return true;
  }
  sendData(type: number, data: string, peerId?: number): void {
    if (peerId != null) {
      const peer = this.peers.idToPeer.get(peerId);
      if (peer) {
        const formattedData = formatData(type, data);
        peer.send(formattedData);
        return;
      }
    }
    this.enetHost?.broadcast(formatData(type, data));
  }
  receiveData(): [type: number, content: string, peerId: number] | undefined {
    const event = this.enetHost?.service(10);
    if (!event) {
      return undefined;
    }
    if (event.type === "receive") {
      const peerId = this.peers.peerToId.get(event.peer)!;
      const data = parseData(event.data);
      //print("received data", data.join("|"));
      return [...data, peerId];
    } else if (event?.type === "connect") {
      const peerId = peerIdGenerator.next();
      this.peers.add(peerId, event.peer);
      return [NetEventTypes.Connected, "", peerId];
    } else if (event?.type === "disconnect") {
      const peerId = this.peers.peerToId.get(event.peer)!;
      this.peers.removePeer(event.peer);
      return [NetEventTypes.Disconnected, "", peerId];
    }
  }
  update(_dt: number): void {
    this.enetHost?.flush();
  }

  deinit(): void {
    liaison?.deinit();
  }
}
