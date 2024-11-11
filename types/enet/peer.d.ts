declare module "enet" {
  export type PeerState =
    | "disconnected"
    | "connecting"
    | "acknowledging_connect"
    | "connection_pending"
    | "connection_succeeded"
    | "connected"
    | "disconnect_later"
    | "disconnecting"
    | "acknowledging_disconnect"
    | "zombie"
    | "unknown";

  export interface Peer {
    /**
     * Queues a packet to be sent to the peer.
     *
     * @param {string} data - The contents of the packet, it must be a string.
     * @param {number} [channel=0] - The channel to send the packet on. Optional. Defaults to 0.
     * @param {"reliable" | "unsequenced" | "unreliable"} [flag="reliable"] - The flag indicating the type of packet. Optional. Defaults to "reliable".
     * @returns {void}
     */
    send(data: string, channel?: number, flag?: "reliable" | "unsequenced" | "unreliable"): void;
    disconnect(): void;
    disconnect_now(): void;
    disconnect_later(): void;
    reset(): void;
    ping(): void;

    /**
     * Attempts to dequeue an incoming packet for this peer. Returns `nil` if there are no packets waiting.
     * Otherwise, returns two values: The string representing the packet data, and the channel the packet came from.
     *
     * @returns {LuaMultiReturn<[string, number]>} - A tuple where the first element is the data from the received packet in a string,
     * and the second element is the channel the packet was received from.
     */
    receive(): undefined | LuaMultiReturn<[string, number]>;
    throttle_configure(): void;
    ping_interval: number;
    /**
     * Returns or sets the parameters when a timeout is detected. This happens either after a fixed timeout or a variable timeout of time that takes the round trip time into account.
     * The former is specified with the maximum parameter.
     *
     * @param {number} [limit] - A factor that is multiplied with a value based on the average round trip time to compute the timeout limit.
     * @param {number} [minimum] - Timeout value, in milliseconds, that a reliable packet has to be acknowledged if the variable timeout limit was exceeded before dropping the peer.
     * @param {number} [maximum] - Fixed timeout in milliseconds for which any packet has to be acknowledged before dropping the peer.
     * @returns {void | LuaMultiReturn<[number, number, number]>} - If no arguments are provided, returns a tuple with the current timeout parameters: limit, minimum, and maximum.
     */
    timeout(
      limit?: number,
      minimum?: number,
      maximum?: number
    ): undefined | LuaMultiReturn<[number, number, number]>;
    index: number;
    /**
     * Returns the state of the peer as a string.
     *
     * @returns {PeerState} - The peer's current state.
     */
    state(): PeerState;
    connect_id: number;
    round_trip_time: number;
    last_round_trip_time: number;
  }
}
