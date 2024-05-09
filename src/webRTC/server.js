export const server = {
    iceServers: [
        {
            urls: ["stun:bn-turn1.xirsys.com"]
        },
        {
            username: "FwxuJ06cV6DyjY4jTXpfTJ5pYlGm01NTxryKwV8GipmlrfKxg9yN6S-gh9B5cG-FAAAAAGY8xvpzaG9iaGl0Mjg=",
            credential: "f3820fba-0e02-11ef-9559-0242ac140004",
            urls: [
                "turn:bn-turn1.xirsys.com:80?transport=udp",
                "turn:bn-turn1.xirsys.com:3478?transport=udp",
                "turn:bn-turn1.xirsys.com:80?transport=tcp",
                "turn:bn-turn1.xirsys.com:3478?transport=tcp",
                "turns:bn-turn1.xirsys.com:443?transport=tcp",
                "turns:bn-turn1.xirsys.com:5349?transport=tcp"
            ]
        }
    ]
};
