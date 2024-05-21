export async function create_offer_remote(peerConnection, server, ws, local_video_ref, remote_video_ref, selectedUser) {
  
    var Connection = new RTCPeerConnection(server);
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
        if (event?.candidate?.type==="relay"  && icecandidate) {
            console.log("turn server used")
           sendOffer();
           icecandidate=false;
        }
        if (event?.candidate?.type=="srflx" && icecandidate){
            console.log("stun server used")
            sendOffer();
            icecandidate=false;
        }
    };
    peerConnection.current.oniceconnectionstatechange = () => {
        const state = peerConnection.iceConnectionState;
        console.log('ICE connection state: ', state);
        
        // Check if the connection is established
        if (state === 'connected' || state === 'completed') {
          console.log('Peer connection established with remote user.');
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

    function sendOffer() {
        const offer = {
            type: 'create_offer',
            remote_id: selectedUser['user_id'], 
            status: selectedUser['status'], 
            offer_sdp: peerConnection.current.localDescription
        };
        ws.send(JSON.stringify(offer));
    }
}
