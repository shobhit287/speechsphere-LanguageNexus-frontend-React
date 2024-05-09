export const server={
    iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
    ],
  }