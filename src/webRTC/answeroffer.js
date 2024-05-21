export async function answer_offer_remote(peerConnection,server,ws,local_video_ref,remote_video_ref,remote_user,offer_data){
  
  var Connection = new RTCPeerConnection(server)
    peerConnection.current=Connection
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

    const iceCandidateHandler  = async (event) => {
        console.log("KFDLKF",event.candidate)
        if(event.candidate){
          send_answer_Candidates(event.candidate)
        }
       
    };
    peerConnection.current.onicecandidate = iceCandidateHandler;
    peerConnection.current.onicegatheringstatechange = () => {
        console.log('ICE Gathering State Changed:', peerConnection.current.iceGatheringState);
        if (peerConnection.current.iceGatheringState === 'complete') {
            console.log('ICE Candidate gathering completed.');
            answeroffer()
        }
    };
    await peerConnection.current.setRemoteDescription(offer_data)
    let answer=await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)
    function answeroffer() {
        const offer = {
            type: 'answer_offer',
            remote_id: remote_user, 
            offer_sdp: answer
        };
        
        ws.send(JSON.stringify(offer));
    }
    function send_answer_Candidates(candidate) {
        const candidate_obj = {
            type: 'answer_ice_candidates',
            remote_id: remote_user, 
            candidates: candidate
        };
        ws.send(JSON.stringify(candidate_obj));
    }
  }
