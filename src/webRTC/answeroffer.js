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
    let icecandidate = true;
    peerConnection.current.onicecandidate = async (event) => {
        console.log(event.candidate)
        if (event?.candidate?.type==="relay" && icecandidate) {
                icecandidate=false
                console.log("TURN SERVER USED");

                answeroffer();    
        }
    
        
    };
    peerConnection.oniceconnectionstatechange = function(event) {
        console.log("ICE connection state change:", peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === "connected" ||
            peerConnection.iceConnectionState === "completed") {
          // Connection is established
        } else if (peerConnection.iceConnectionState === "failed" ||
                   peerConnection.iceConnectionState === "disconnected") {
          // Connection failed or disconnected
        }
      };
    await peerConnection.current.setRemoteDescription(offer_data)
    let answer=await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)
    function answeroffer() {
        const offer = {
            type: 'answer_offer',
            remote_id: remote_user, 
            offer_sdp: peerConnection.current.localDescription
        };
        ws.send(JSON.stringify(offer));
    }
  }
