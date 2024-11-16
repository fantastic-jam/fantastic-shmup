/* eslint-disable @typescript-eslint/no-invalid-void-type */
/**
 * @noResolution
 */
declare module "enet" {
  export function host_create(this: void, address?: string): Host;
  export function linked_version(this: void): string;
}
