export async function answer_offer_remote(peerConnection,server,ws,local_video_ref,remote_video_ref,remote_user,offer_data){
    let Connection = new RTCPeerConnection({iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "5bc265146469de02b6e0324c",
          credential: "MZTnljpPqcgC47cs",
        },
    ],
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
