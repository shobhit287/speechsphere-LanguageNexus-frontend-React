export async function create_offer_remote(peerConnection, server, ws, local_video_ref, remote_video_ref, selectedUser) {
    let Connection = new RTCPeerConnection({iceServers: [
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
  });
    peerConnection.current = Connection;
    let localstream = local_video_ref.current.srcObject;
    let remotestream = new MediaStream();
    remote_video_ref.current.srcObject = remotestream;
    localstream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localstream);
    });
    peerConnection.current.ontrack = async (event) => {
        event.streams[0].getTracks().forEach(track => {
            remotestream.addTrack(track);
        });
    };

    let icecandidate = true;
    const iceCandidateHandler = async (event) => {
        if (event.candidate) {
            // icecandidate = false;
            const offer = {
                type: 'create_offer',
                remote_id: selectedUser['user_id'], 
                status: selectedUser['status'], 
                offer_sdp: peerConnection.current.localDescription
            };
            ws.send(JSON.stringify(offer));
            peerConnection.current.removeEventListener('icecandidate', iceCandidateHandler);
        }
    };

    peerConnection.current.onicecandidate = iceCandidateHandler;

    try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        return true;
    } catch (error) {
        console.error('Error creating offer or setting local description:', error);
        return false;
    }
}
