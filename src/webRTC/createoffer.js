export async function create_offer_remote(peerConnection, server, ws, local_video_ref, remote_video_ref, selectedUser,all_candidates) {
  
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
    all_candidates.current=[];
    const iceCandidateHandler = async (event) => {
      if(event.candidate){ 
        all_candidates.current.push(event.candidate)
    }
};
    peerConnection.current.onicecandidate = iceCandidateHandler;
    try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        
        sendOffer();
    } catch (error) {
        console.error('Error creating offer or setting local description:', error);
        return false;
    }
    function sendOffer() {
        const offer_sdp = {
            type: 'create_offer',
            remote_id: selectedUser['user_id'], 
            status: selectedUser['status'], 
            offer_sdp: peerConnection.current.localDescription
        };
        ws.send(JSON.stringify(offer_sdp));
    }

}
