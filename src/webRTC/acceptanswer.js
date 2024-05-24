export async function accept_answer(peerConnection,accept_sdp){ 

    if(!peerConnection.current.currentRemoteDescription)
    {
        console.log("FINAL SDP",accept_sdp)
         peerConnection.current.setRemoteDescription(accept_sdp);

        
    }
}