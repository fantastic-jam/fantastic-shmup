import "enet";

declare module "enet" {
  export interface Host {
    /**
     * Wait for events, send and receive any ready packets.
     * @param {number} [timeout] - The timeout in milliseconds to wait for events.
     * @returns {Event | null} - The event that occurred, or null if no event occurred.
     */
    service(timeout: number): Event | null;

    /**
     * Checks for any queued events and dispatches one if available.
     * @returns {Event | null} - The event that occurred, or null if no event occurred.
     */
    check_events(): Event | null;

    /**
     * Toggles an adaptive order-2 PPM range coder for the transmitted data of all peers.
     */
    compress_with_range_coder(): void;

    /**
     * Connects a host to a remote host.
     * @param {string} address - The address of the remote host.
     * @returns {Peer} - The peer object associated with the remote host.
     */
    connect(address: string): Peer;

    /**
     * Sends any queued packets.
     */
    flush(): void;

    /**
     * Queues a packet to be sent to all connected peers.
     * @param {string | number} data - The data to be sent.
     */
    broadcast(data: string | number): void;

    /**
     * Sets the maximum number of channels allowed.
     * @param {number} limit - The maximum number of channels.
     */
    channel_limit(limit: number): void;

    /**
     * Sets the bandwidth limits of the host in bytes/sec.
     * @param {number} [incomingBandwidth] - The incoming bandwidth limit.
     * @param {number} [outgoingBandwidth] - The outgoing bandwidth limit.
     */
    bandwidth_limit(
      incomingBandwidth?: number,
      outgoingBandwidth?: number
    ): void;

    /**
     * Returns a string that describes the socket address of the given host.
     * @returns {string} - The socket address of the host.
     */
    get_socket_address(): string;

    /**
     * Deprecated version of host:get_socket_address.
     * @returns {string} - The socket address of the host.
     */
    socket_get_address(): string;

    /**
     * Destroys the host, freeing any bound ports and addresses.
     * Alias for the host:__gc method.
     */
    destroy(): void;

    /**
     * Returns the number of bytes that were sent through the given host.
     * @returns {number} - The total number of bytes sent.
     */
    total_sent_data(): number;

    /**
     * Returns the number of bytes that were received by the given host.
     * @returns {number} - The total number of bytes received.
     */
    total_received_data(): number;

    /**
     * Returns the timestamp of the last call to host:service() or host:flush().
     * @returns {number} - The timestamp of the last service or flush call.
     */
    service_time(): number;

    /**
     * Returns the number of peers that are allocated for the given host.
     * @returns {number} - The number of allocated peers.
     */
    peer_count(): number;

    /**
     * Returns the connected peer at the specified index (starting at 1).
     * @param {number} index - The index of the peer.
     * @returns {Peer} - The connected peer at the specified index.
     */
    get_peer(index: number): Peer;

    /**
     * Destroys the host, freeing any bound ports and addresses.
     */
    __gc(): void;
  }
}
