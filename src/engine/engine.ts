import { Input } from "./input/input";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Engine {
  private static loadCallbacks: (() => void)[] = [];
  public static preload<T>(cb: () => T): Promise<T> {
    const promise = new Promise<T>((resolve) => {
      Engine.loadCallbacks.push(() => {
        resolve(cb());
      });
    });
    return promise;
  }

  public static load() {
    Engine.loadCallbacks.forEach((cb) => cb());
    Input.init();
  }

  public static update(dt: number, cb: (dt: number) => void) {
    cb(dt);
    Input.update(dt); // input update must be called after the main update
  }
}
