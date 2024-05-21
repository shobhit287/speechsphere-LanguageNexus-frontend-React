export const addCandidate=async (peerConnection,candidate)=>{
    console.log("CAND",candidate)
    const ice_candidate = new RTCIceCandidate(candidate);
    await peerConnection.current.addIceCandidate(ice_candidate);
}