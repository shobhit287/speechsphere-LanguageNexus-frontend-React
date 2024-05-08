export async function accept_answer(peerConnection,accept_sdp){ 
    if(!peerConnection.current.currentRemoteDescription)
    {
        
         peerConnection.current.setRemoteDescription(accept_sdp);
        

        
    }
}