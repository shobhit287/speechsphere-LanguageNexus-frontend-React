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
    
    let all_candidate=[]
    const iceCandidateHandler = async (event) => {
      if(event.candidate){ 
        all_candidate.push(event.candidate)
    }
    else{
        send_candidates(all_candidate)
    }

};
    peerConnection.current.onicecandidate = iceCandidateHandler;

    try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        sendOffer();
        return true;
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
    function send_candidates(candidate){
        const candidate_obj = {
            type: 'create_ice_candidates',
            remote_id: selectedUser['user_id'], 
            candidates: candidate
        };
        ws.send(JSON.stringify(candidate_obj));
    }
}
