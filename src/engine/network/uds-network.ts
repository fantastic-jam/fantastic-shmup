import { LiaisonMode, LiaisonStatus, Network } from "../network";
import { formatData, parseData } from "./utils";

export class UdsNetwork implements Network {
  mode: LiaisonMode = LiaisonMode.LIAISON_MODE_NONE;
  init(passphrase: string): string {
    return liaison?.init(passphrase) ?? "no network";
  }
  print_constatus(): void {
    liaison?.print_constatus();
  }
  getStatus(): LiaisonStatus {
    return liaison?.getStatus() ?? LiaisonStatus.LIAISON_STATUS_NOT_CONNECTED;
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
    return liaison?.host() ?? false;
  }
  waitConnectionStatusEvent(nextEvent: boolean, wait: boolean): boolean {
    return liaison?.waitConnectionStatusEvent(nextEvent, wait) ?? false;
  }
  join(): boolean {
    this.mode = LiaisonMode.LIAISON_MODE_CLIENT;
    return liaison?.join() ?? false;
  }
  sendData(type: number, data: string): void {
    liaison?.sendData(formatData(type, data));
  }
  receiveData(): [type: number, content: string, peerId: number] | undefined {
    const data = liaison?.receiveData()?.data;
    return data ? [...parseData(data), 0] : undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(_dt: number): void {}
  deinit(): void {
    liaison?.deinit();
  }
}
