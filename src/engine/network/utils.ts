export enum NetEventTypes {
  None = -1,
  Connected = 0,
  Disconnected = 1,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  Last = Disconnected,
}

export function parseData<T extends number>(
  data: string
): [type: T, data: string] {
  return [(data.charCodeAt(0) * 10 + data.charCodeAt(1)) as T, data.slice(2)];
}

export function formatData<T extends number>(
  type: T,
  data: string
): string {
  return String.fromCharCode(type / 10) + String.fromCharCode(type % 10) + data;
}
