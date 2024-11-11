declare module "love" {
  export enum LiaisonStatus {
    LIAISON_STATUS_NOT_CONNECTED = 0,
    LIAISON_STATUS_PENDING = 1,
    LIAISON_STATUS_CONNECTED = 2,
  }

  global {
    const liaison:
      | undefined
      | {
          /**
           * @noSelf
           */
          init(passphrase: string): string;
          /**
           * @noSelf
           */
          print_constatus(): void;

          /**
           * @noSelf
           */
          getStatus(): LiaisonStatus;

          /**
           * @noSelf
           */
          host(): boolean;

          /**
           * @noSelf
           */
          waitConnectionStatusEvent(nextEvent: boolean, wait: boolean): boolean;

          /**
           * @noSelf
           */
          join(): boolean;

          /**
           * @noSelf
           */
          sendData(data: string): void;

          /**
           * @noSelf
           */
          receiveData(): { size: number; data: string } | undefined;

          /**
           * @noSelf
           */
          deinit(): void;
        }
  }
}
