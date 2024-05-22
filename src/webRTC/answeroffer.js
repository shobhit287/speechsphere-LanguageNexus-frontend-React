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
    let all_candidate=[]
    const iceCandidateHandler  = async (event) => {
        if(event.candidate){
           console.log("KFJJFKFJKFJFKJKFJKFJKFJFKJF",event.candidate) 
          all_candidate.push(event.candidate)
        }    
    };
    peerConnection.current.onicecandidate = iceCandidateHandler;
    await peerConnection.current.setRemoteDescription(offer_data)
    let answer=await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)
    setTimeout(() => {
        if (peerConnection.current.iceGatheringState !== 'complete') {
            console.warn('ICE gathering timed out, sending answer offer with gathered candidates');
            answeroffer();
            send_answer_Candidates(all_candidate)
        }
    }, 1000);
    function answeroffer() {
        const offer = {
            type: 'answer_offer',
            remote_id: remote_user, 
            offer_sdp: peerConnection.current.localDescription
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
