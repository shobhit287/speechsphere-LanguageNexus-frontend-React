export const server = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "9c5d1a0fc5d641f9c1b6c657",
      credential: "DqZp8UeIDGqx/X9s",
    },
    {
      urls: "turn:global.relay.metered.ca:80?transport=tcp",
      username: "9c5d1a0fc5d641f9c1b6c657",
      credential: "DqZp8UeIDGqx/X9s",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "9c5d1a0fc5d641f9c1b6c657",
      credential: "DqZp8UeIDGqx/X9s",
    },
    {
      urls: "turns:global.relay.metered.ca:443?transport=tcp",
      username: "9c5d1a0fc5d641f9c1b6c657",
      credential: "DqZp8UeIDGqx/X9s",
    },
],
};
