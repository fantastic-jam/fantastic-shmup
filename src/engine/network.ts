export enum LiaisonStatus {
  LIAISON_STATUS_NOT_CONNECTED = 0,
  LIAISON_STATUS_PENDING = 1,
  LIAISON_STATUS_CONNECTED = 2,
}

export enum LiaisonMode {
  LIAISON_MODE_NONE = 0,
  LIAISON_MODE_SERVER = 1,
  LIAISON_MODE_CLIENT = 2,
}

export interface Network {
  update(dt: number): void;
  getMode(): LiaisonMode;
  isClient(): boolean;
  isServer(): boolean;
  init(passphrase: string): string;
  print_constatus(): void;
  getStatus(): LiaisonStatus;
  host(): boolean;
  waitConnectionStatusEvent(nextEvent: boolean, wait: boolean): boolean;
  join(): boolean;
  sendData(type: number, data: string, peerId?: number): void;
  receiveData(): [type: number, content: string, peerId: number] | undefined;
  deinit(): void;
}
