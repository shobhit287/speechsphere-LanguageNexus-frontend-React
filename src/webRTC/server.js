export const server={
    iceServers:[
    {
        urls:['stun:stun2.l.google.com:19302','stun:stun1.l.google.com:19302']
    },
    {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    },
]
}