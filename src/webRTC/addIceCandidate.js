export const addCandidate=async (peerConnection,candidate)=>{
    console.log("INSiDE THIS")
    const ice_candidate = new RTCIceCandidate(candidate);
    await peerConnection.current.addIceCandidate(ice_candidate);
}