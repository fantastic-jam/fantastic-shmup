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
  }
}
