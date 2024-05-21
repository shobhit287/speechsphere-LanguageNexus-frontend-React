export const addCandidate=async (peerConnection,candidate)=>{
    
    const ice_candidate = new RTCIceCandidate(candidate);
    await peerConnection.current.addIceCandidate(ice_candidate);
}