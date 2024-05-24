import React, { useEffect, useRef, useState } from 'react';
import blackscreen from '../static/img/blackscreen.png'
import { RiCameraFill } from "react-icons/ri";
import { RiCameraOffFill } from "react-icons/ri";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import noise from '../static/img/noise.jpg';
import { FaMale } from "react-icons/fa";
import { server } from '../webRTC/server';
import { FaFemale } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { create_offer_remote } from '../webRTC/createoffer';
import { answer_offer_remote } from '../webRTC/answeroffer';
import { Dropdown, Space ,Menu} from 'antd';
import sender_tone from '../static/audio/sender_tone.mp3';
import { accept_answer } from '../webRTC/acceptanswer';
import remote_tone from '../static/audio/remote_tone.mp3';
import { useDispatch,useSelector } from 'react-redux';
import { check_authenticate_status } from '../redux/slices/authenticated';
import { addCandidate } from '../webRTC/addIceCandidate';
import {signup_modal_handle,login_modal_handle} from '../redux/slices/model_popUp';
import { toast } from 'react-toastify';
function Home() {
  const [ws, setWs] = useState(null);
  const peerConnection=useRef(null);
  const dispatch = useDispatch();
  // const BASE_URL=window.location.hostname === 'localhost' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_IP_BASE_URL;
  const senderAudio=useRef(null)
  const RemoteAudio=useRef(null)
  const [selectedUser,setSelectedUser]=useState();
  const[remoteCall,setRemoteCall]=useState(false);
  const[offeredUser_window_popup,set_offeredUser_window_popup]=useState(false);
  const[startBtnText,setStartBtnText]=useState("Start");
  const[remoteUserName,setRemoteUserName]=useState(null)
  const[wsdata,setwsdata]=useState();
  const local_video=useRef(null);
  const [notMuted,setNotMuted]=useState(true);
  const remote_video=useRef(null);
  const remote_user_id=useRef(null);
  const remote_user_answer=useRef(null);
  const[messages,setmessages]=useState([]);
  const ws_reference=useRef(null);
  useEffect(() => {
    dispatch(check_authenticate_status());
  }, [dispatch]);
  const authenticated_status = useSelector(state => state.authenticationSlice.isAuthenticated);
  useEffect(()=>{
   let newws=null;

   if (authenticated_status && newws===null){
    const ws_url=process.env.REACT_APP_WS_URL;
    const ws_base_url=window.location.hostname === 'localhost' ? process.env.REACT_APP_WS_BASE_URL : process.env.REACT_APP_IP_WS_BASE_URL;
    const token=localStorage.getItem('token');
    if (token){
    newws=new WebSocket(`${ws_base_url}${ws_url}/${token}`)
    setWs(newws);
    ws_reference.current=newws;}
   }
   else if (newws && !authenticated_status) {
      newws.close()
      setWs(null);
    
   }
   return () => {
   
    if (ws_reference.current && peerConnection?.current?.currentRemoteDescription){
      let data={'type':'user_leave','remote_id':remote_user_id?.current?.user_id}
      ws_reference.current.send(JSON.stringify(data))
      newws?.close();
      ws_reference.current=null;
      setWs(null);
     }
     if (ws || ws_reference.current){
      newws?.close();
      ws_reference.current=null;
      setWs(null);
     }
   
  };
  //eslint-disable-next-line 
  },[authenticated_status])
  

//recieve data   
if (ws){
  ws.onclose=async function(){
    if (ws_reference.current && peerConnection?.current?.currentRemoteDescription){
      let data={'type':'user_leave','remote_id':remote_user_id?.current?.user_id}
      ws_reference.current.send(JSON.stringify(data))
      ws_reference.current=null;
      setWs(null);
     }
  }
  ws.onmessage=async function (event){
    let data_recieve=JSON.parse(event['data'])
    setwsdata(data_recieve)
    if (data_recieve['type']==="users_info"){
        handleUpdateOnlineUsers(data_recieve['data'])
    }
    if (data_recieve['type']==="recieved_offer"){
        handleRecievedOffer(data_recieve)
    }
    if (data_recieve['type']==="rejected"){
        handleCallRejected(data_recieve['rejected_by'])
    }
    if (data_recieve['type']==="cancelled_by_offered_user"){
       cancelled_by_offered_user()
    }
    if (data_recieve['type']==="call_accepted"){
       handleAcceptedCall(data_recieve)
    }
    if (data_recieve['type']==="call_connected_success"){
       handleCallConnectedSuccess()
    }
    if (data_recieve['type']==="call_disconnected_by_user"){
       handleCallDisconnected()
    }
    if (data_recieve['type']==="user_leave"){
       handleUserLeave()
    }
    if (data_recieve['type']==="recieved_msg"){
       handleRecievedMsg(data_recieve['msg'])
    }
    if (data_recieve['type']==="create_ice_candidates"){
      handleCreateIceCandidates(data_recieve['candidate'])
    }
    if (data_recieve['type']==="answer_ice_candidates"){
       handleAnswerIceCandidates(data_recieve['candidate'])
    }
    if (data_recieve['type']==="candidates_create"){
      handleCreateIceCandidates(data_recieve['candidates'])
    }
    

  }
}

function handleAnswerIceCandidates(data){
  if(peerConnection.current){
    data.forEach((candidate)=>{
      addCandidate(peerConnection,candidate)
    })
  }
}
function handleCreateIceCandidates(data){
  if(peerConnection.current){
    data.forEach((candidate)=>{
      addCandidate(peerConnection,candidate)
    })
    all_candidates.current=[]
  }
}



function handleRecievedMsg(msg){
  let data_remote=[...messages,{'className':'recieved_msg','msg_text':msg}]
  setmessages(data_remote);

}
function handleUserLeave(){
  setStartBtnText("Start");
  setremotemediaaccess(false);
  remote_user_id.current=null;
}
function handleCallDisconnected(){
  if (peerConnection.current){
    peerConnection.current.close();
    }
  peerConnection.current=null;
  setStartBtnText("Start");
  setremotemediaaccess(false);
}
function handleCallConnectedSuccess(){

  let data={'type':'answer_ice_candidates','candidates':answer_candidates.current,'remote_id':remote_user_id.current['user_id']}
  ws.send(JSON.stringify(data))
setRemoteCall(false)  
RemoteAudio.current.pause();
}
function handleAcceptedCall(data)
{
  let send_candidates={'type':'candidates_create','remote_id':selectedUser['user_id'],'candidates':all_candidates.current}
  ws.send(JSON.stringify(send_candidates))
  accept_answer(peerConnection,data['answer_sdp'])
  setremotemediaaccess(true);
  set_offeredUser_window_popup(false);
  senderAudio.current.pause();
  data={'type':'call_connected_success','remote_id':selectedUser['user_id']}
  ws.send(JSON.stringify(data))
}
function cancelled_by_offered_user(){
  setRemoteCall(false);
  RemoteAudio.current.pause();
}
function handleCallRejected(rejected_by){
if(peerConnection.current){
  peerConnection.current=null;
}
set_offeredUser_window_popup(false);
senderAudio.current.pause();
setStartBtnText("Start")
toast.error(`Call Rejected By ${rejected_by}`)
}


function handleRecievedOffer(data) {
  if (!RemoteAudio.current || RemoteAudio.current.paused) {
    remote_user_id.current = { 'user_id': data['offered_user_id'] };
    remote_user_answer.current = data['offer'];
    setRemoteUserName(data['offered_by']);
    setRemoteCall(true);
    let remote_audio = new Audio(remote_tone);
    RemoteAudio.current = remote_audio;
    RemoteAudio.current.play();
    setTimeout(() => {
      RemoteAudio.current.pause();
      setRemoteCall(false);
    }, 25000);
  }
}

const [isCameraaccess,setIsCameraAccess]=useState(true);
const [micShow,setMicShow]=useState(false);
 function MuteMic(){
  if (local_video) {
    local_video.current.srcObject.getAudioTracks().forEach(track => {
      track.enabled = false;
    });
    setNotMuted(false);
  }
 } 
function UnmuteMic(){
  if (local_video) {
    local_video.current.srcObject.getAudioTracks().forEach(track => {
      track.enabled = true;
    });
    setNotMuted(true);
  }
}
function HideCamera(){
  if (local_video) {
    local_video.current.srcObject.getVideoTracks().forEach(track => {
      track.enabled = false;
    });
    setIsCameraAccess(false);
  }
}
function UnhideCamera(){
  if (local_video) {
    local_video.current.srcObject.getVideoTracks().forEach(track => {
      track.enabled = true;
    });
    setIsCameraAccess(true);
  }
}
  const [localmediaaccess,setlocalmediaaccess]=useState(false);
  const [remotemediaaccess,setremotemediaaccess]=useState(false);
  useEffect(() => {
    let mediaStream;
    function accessmedia() {
      navigator?.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
          setlocalmediaaccess(true);
          if (local_video.current) {
            mediaStream=stream
            local_video.current.srcObject = stream;
          }
        
      }).catch(error => {
        setlocalmediaaccess(false)
        toast.error("Error while accessing media device");
        
      });
    } 
  
    accessmedia();
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }

      
    };
  
   
  }, []);
  
useState(()=>{
if(navigator?.mediaDevices?.getUserMedia({ video: true, audio: true })){

  setlocalmediaaccess(true)
}
else{
  setlocalmediaaccess(false)
}
},[localmediaaccess])

function answerBtnHandler(event)
{
  const buttonText = event.target.innerText;
  if (buttonText==="Answer"){
   if(local_video.current){ 
   answer_offer_remote(peerConnection,server,ws,local_video,remote_video,remote_user_id.current['user_id'],remote_user_answer.current,answer_candidates) 
   setmessages([]);
   setremotemediaaccess(true);
   setStartBtnText("Stop")
   remote_user_answer.current=null;
  }
   else{
    remote_user_answer.current=null;
    toast.error("Error While Accessing Media ")
    setRemoteCall(false);
    RemoteAudio.current.pause();
    let data={'type':'rejected','user_id':remote_user_id.current['user_id']}
    ws.send(JSON.stringify(data))
   }
  }
  else{
    remote_user_answer.current=null;
    setRemoteCall(false);
    RemoteAudio.current.pause();
    setStartBtnText("Start")
    let data={'type':'rejected','user_id':remote_user_id.current['user_id']}
    ws.send(JSON.stringify(data))
  }
}
  
  


  const [msg_text,setmsg_text]=useState({
    "msg_text":""
  })
  const [selectedGender, setSelectedGender] = useState(null);
  let [list_users,setlist_users]=useState([]);
  const selectGender=[
    { key: 'Any', label: 'Any',icon:<BiMaleFemale/> },
    { key: 'Male', label: 'Male', icon: <FaMale /> },
    { key: 'Female', label: 'Female', icon: <FaFemale /> }
  ];
 
  const gender_menu = (
    <Menu onClick={handleGenderClick}>
      {selectGender.map(option => (
        <Menu.Item key={option.key} icon={option.icon}>
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );
  const onlineUsers_menu = (
    <Menu onClick={handleOnlineUserClick}>
      {list_users.length > 0 ? (
        list_users.map(option => (
          <Menu.Item key={option.id} >
            {option.status ? (
              <>
                <div style={{display:"flex", justifyContent:'space-between',alignItems:'center'}}>
                  <span>{option.name}</span>
                  <h1 style={{color:"orange"}}>&#x2022;</h1>
                </div>
              </>
            ) : (
              <>
                <div style={{display:"flex", justifyContent:'space-between',alignItems:'center'}}>
                  <span>{option.name}</span>
                  <h1 style={{color:"green"}}>&#x2022;</h1>
                </div>
              </>
            )}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>No user found</Menu.Item>
      )}
    </Menu>
  );
  
  function handleGenderClick(value){
    setSelectedGender(value.key);
    setSelectedUser();
  }
  function handleOnlineUserClick(event){
    const userId = event.key;
    const username = list_users.find(user => user.id === userId).name;
    const status = list_users.find(user => user.id === userId).status;
    setSelectedUser({"user_id":userId,"name":username,"status":status})
  }
  function msg_text_handler(e){
    const { name, value } = e.target;
    setmsg_text({...msg_text,[name]:value})
  }
 function handleUpdateOnlineUsers(wsdata){
  setlist_users({});
  let filtered_data=[]
  wsdata.forEach(user=>{
    if(selectedGender===null || selectedGender==="Any"){
      filtered_data.push(user)
    }
    else if(selectedGender===user['gender']){
      filtered_data.push(user)
    }
  })
  setlist_users(filtered_data);
 } 

 useEffect(()=>{
if (wsdata?.type==='users_info'){
  handleUpdateOnlineUsers(wsdata['data']);
}//  eslint-disable-next-line
 },[selectedGender,wsdata])

function handleDisconnectedCall(){
  let data={"type":"call_disconnected_by_user","remote_id":remote_user_id.current['user_id']}
  ws.send(JSON.stringify(data))
}

useEffect(()=>{

if(remotemediaaccess===false && wsdata?.type==='call_accepted'){
  setremotemediaaccess(true);
}
if(remotemediaaccess===true && wsdata?.type==='call_disconnected_by_user'){
  setremotemediaaccess(false)
}
if(remotemediaaccess===true && peerConnection.current===null){
  setremotemediaaccess(false)
}
if(remotemediaaccess===true && wsdata?.type==='user_leave'){
  setremotemediaaccess(false)
}
},[remotemediaaccess,wsdata?.type])
const all_candidates=useRef([]);
const answer_candidates=useRef([]);
 function handleStartCall(event) {
  const buttonText = event.target.innerText;
  if (buttonText==="Start"){
  if (authenticated_status) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (selectedUser) {
        if (selectedUser.status){
          toast.error(`${selectedUser.name} is already Busy`);
        }
        else{
           if(local_video?.current?.srcObject){
            remote_user_answer.current=null;
            setmessages([]);
            remote_user_id.current={"user_id":selectedUser['user_id']}
            let response=create_offer_remote(peerConnection,server,ws,local_video,remote_video,selectedUser,all_candidates)
            if (response){
              set_offeredUser_window_popup(true);
              let audio=new Audio(sender_tone)
              senderAudio.current=audio;
              setStartBtnText("Stop")
              senderAudio.current.play();
              setTimeout(() => {
                senderAudio.current.pause();
                set_offeredUser_window_popup(false);
                if (!peerConnection?.current?.currentRemoteDescription){
                  setStartBtnText("Start")
                }
              }, 25000);
             
            }
    
           }
           else{
            toast.error("Error While Accessing User Media")
           }
        }
      } 
      else {
        toast.error("Choose Partner First");
      }
    } 
    else {
      toast.error("WebSocket Connection Error");
    }
  }
   else {
    dispatch(login_modal_handle(true));
  }}
  else{
    remote_user_answer.current=null;
    if(peerConnection.current)
      {
          peerConnection.current.close();
          setremotemediaaccess(false)
          handleDisconnectedCall();
          remote_user_id.current=null;
          setStartBtnText("Start")
         
      }
      else{
    handleCallCancelled();
    setStartBtnText("Start")
      }
      peerConnection.current=null;
  }
}
function send_msg(event) {
  event.preventDefault();
  const new_msg = {
    type: 'text_message',
    msg: msg_text.msg_text,
    remote_id: remote_user_id?.current?.user_id
  };
  ws.send(JSON.stringify(new_msg));
  const updatedMessages = [...messages, { className: 'sender_msg', msg_text: msg_text.msg_text }];
  setmessages(updatedMessages);
  setmsg_text({ msg_text: "" });
}
function handleCallCancelled(){
  set_offeredUser_window_popup(false);
  setStartBtnText("Start");
  senderAudio.current.pause();
  let data={'type':'cancelled_by_offered_user','remote_user_id':selectedUser['user_id']}
  ws.send(JSON.stringify(data))
}
return(<div class="main_page">
<div className="video_container">
<div className="remote_video">

    <video ref={remote_video}  autoPlay playsInline style={{display:remotemediaaccess?"grid":"none"}}></video>
  {remotemediaaccess ? (<></>
  ) : authenticated_status?<>
    <div style={{ position: 'relative', textAlign: 'center' }}>
    <video poster={noise} autoplay></video>
    <span style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color:'white',
      padding: '10px',
      fontSize:'1.5em'
    }}>
      Press Start To Connect
    </span>
  </div>
    </>
  :<>
    <div style={{ position: 'relative', textAlign: 'center' }}>
    <video poster={noise} autoplay></video>
    <div className='btn_on_video' style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color:'white',
      padding: '10px',
      fontSize:'2.3vw'
    }}>
      <button className='login_btn_on_video' onClick={()=>dispatch(login_modal_handle(true))}>Login</button>
      <button className='signup_btn_on_video' onClick={()=>dispatch(signup_modal_handle(true))}>Signup</button>
    </div>
  </div>
 
  </>}

 
  </div>

  <div className='user_video'>
  {localmediaaccess?(
<>
  <div
    style={{ position: 'relative', textAlign: 'center' }}
    onMouseEnter={() => setMicShow(true)}
    onMouseLeave={() => setMicShow(false)}
  >
    <video ref={local_video} autoPlay playsInline muted></video>
    {micShow && (
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display:'flex',gap:'20px' }}>
        {notMuted ? (
          <button className='mic_btn' onClick={MuteMic}>
            <span><FaMicrophone /></span>
          </button>
        ) : (
          <button className='mic_btn' onClick={UnmuteMic}>
            <span><FaMicrophoneSlash /></span>
          </button>
        )}

        {
          isCameraaccess?(<button className='camera_btn' onClick={HideCamera}>
            <span><RiCameraFill /></span>
          </button>):(<button className='camera_btn' onClick={UnhideCamera}>
            <span><RiCameraOffFill /></span>
          </button>)
        }
      </div>
    )}
  </div>
</>
):<>
  <div style={{ position: 'relative', textAlign: 'center' }}>
    <video poster={blackscreen} autoPlay ></video>
    <span style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color:'white',
      padding: '10px',
      fontSize:'2.3vw'
    }}>
      Error While Accessing User Media
    </span>
  </div>
  </>

 }
  
  
  </div>
</div>


<div className="interaction_section">
 <div className='left_interaction'>
  <button className='startcall_btn' onClick={(event)=>handleStartCall(event)} style={{backgroundColor:startBtnText==="Stop"?"red":""}}>{startBtnText==="Start"?<>Start</>:<>Stop</>}</button>
  <Dropdown overlay={gender_menu} trigger={['click']}>
  <button className='gender_button' style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
<Space>
  <span style={{ textAlign: "center" }}>
    Filter Gender : {selectedGender ? 
      selectedGender === "Male" ? 
        <>Male <FaMale /></> : 
        selectedGender === "Female" ? 
          <>Female <FaFemale /></> : 
          <>Any <FaMale /> / <FaFemale /></>
      :
      <> <FaMale /> / <FaFemale /></>
    }
  </span>
</Space>
</button>
  </Dropdown>

  <Dropdown overlay={onlineUsers_menu} trigger={['click']}>
    <button className='onlineUsers_button'>
      <Space>
        <span style={{textAlign:"center"}}>Choose Partner : {selectedUser?selectedUser.name:<><FaMale></FaMale>/<FaFemale></FaFemale></>}</span>
      </Space>
    </button>
  </Dropdown>

 </div>
 <div className='right_interaction'>
  <div className='msg_body'>
  <div class="all_msgs">
  {messages.map((message, index) => (
<div key={index} className={message.className}>
  <span>{message.msg_text}</span>
</div>
))}
   
    </div>
    <div className='msg_form'>
      <form onSubmit={(event)=>send_msg(event)}>
        <input type='text' placeholder='Enter Your Message' value={msg_text.msg_text} required onChange={(e)=>msg_text_handler(e)} name='msg_text'></input>
        <button style={{backgroundColor:remotemediaaccess?"#389A73":"#829b91" , cursor:remotemediaaccess?"pointer":"not-allowed"}} disabled={remotemediaaccess?false:true}>Send</button>
      </form>
    </div>
  </div>

 </div>


</div>
{offeredUser_window_popup?<> <div className='offeredUser_window_popup' style={{display: offeredUser_window_popup ? 'flex' : 'flex' }}>
    <h2 style={{ textAlign: "center", fontSize: "24px" }}>{selectedUser.name}</h2>
    <h3 style={{ textAlign: "center", fontSize: "18px" }}>Calling</h3>
    <button style={{ fontSize: "18px" }} onClick={handleCallCancelled}>Cancel</button>
  </div></>:<></>}

{remoteCall?<> <div className="remote_window" >
<h3  style={{textAlign:"center"}}>{remoteUserName}</h3>
<div class="answer_buttons">
<button onClick={(event)=>answerBtnHandler(event)} >Answer</button>
<button onClick={(event)=>answerBtnHandler(event)}>Reject</button>
</div></div></>:<></>}

</div>)
}

export default Home;
