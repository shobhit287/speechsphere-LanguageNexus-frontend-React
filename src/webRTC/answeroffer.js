export async function answer_offer_remote(peerConnection,server,ws,local_video_ref,remote_video_ref,remote_user,offer_data){
    const response = 
    await fetch("https://speechsphere.metered.live/api/v1/turn/credentials?apiKey=028fad1b2daad62402a032033aa82b2178d5");
  
  // Saving the response in the iceServers array
  const iceServers = await response.json();
  
  // Using the iceServers array in the RTCPeerConnection method
  var Connection = new RTCPeerConnection({
    iceServers: iceServers
  });
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
    
    let icecandidate = true;
    peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate && icecandidate) {
            icecandidate = false;
            const offer = {
                type: 'answer_offer',
                remote_id: remote_user, 
                offer_sdp: peerConnection.current.localDescription
            };
            console.log("Answer OFFER", offer);
            ws.send(JSON.stringify(offer));
        }
    };
    await peerConnection.current.setRemoteDescription(offer_data)
    let answer=await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)

  }
