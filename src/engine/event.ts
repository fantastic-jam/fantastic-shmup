export interface Event<T extends string, S> {
  getType(): T;
  getSource(): S;
}
export interface EventEmitter<T extends string, S> {
  listen(eventType: T, callback: (e: Event<T, S>) => void): void;
}

export class SimpleEvent<T extends string, S> implements Event<T, S> {
  constructor(private type: T, private source: S) {}
  getType(): T {
    return this.type;
  }
  getSource(): S {
    return this.source;
  }
}

export class SimpleEventEmitter<T extends string, S>
  implements EventEmitter<T, S>
{
  private listenersMap = new Map<T, ((e: Event<T, S>) => void)[]>();

  listen(eventType: T, callback: (e: Event<T, S>) => void): void {
    const listeners = this.listenersMap.get(eventType) ?? [];
    this.listenersMap.set(eventType, [...listeners, callback]);
  }

  pushEvent(event: Event<T, S>): void {
    const listeners = this.listenersMap.get(event.getType()) ?? [];
    listeners.forEach((cb) => cb(event));
  }
}
