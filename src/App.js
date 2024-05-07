import logo from './static/img/logo.png';
import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Help from './components/Help';
import {toast} from 'react-toastify';
import { IoIosLogOut } from "react-icons/io";
import { Dropdown, Space,Menu} from 'antd';
import axios from "axios"
import {  useEffect, useState} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { check_authenticate_status } from './redux/slices/authenticated';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(check_authenticate_status());
  }, [dispatch]);
  const authenticated_status = useSelector(state => state.authenticationSlice.isAuthenticated);
  const [loginModal,setLoginModal]=useState(false);
  const [SignupModal,setSignupModal]=useState(false);
  const BASE_URL=window.location.hostname === 'localhost' ? process.env.REACT_APP_BASE_URL : process.env.REACT_APP_IP_BASE_URL;
  const [signup_details,setsignup_details]=useState({
    "signup_firstname":"",
    "signup_lastname":"",
    "signup_email":"",
    "signup_password":"",
    "signup_gender":"",
    "signup_nationality":"",
  })
  const [login_details,setlogin_details]=useState({
    "login_email":"",
    "login_password":""
  })
  function SignupHandler(e){
    e.preventDefault();
    axios.post(`${BASE_URL}/signup`,signup_details)
    .then(response=>{
      if (response.data.status){
         toast.success("SignUp Successfully")
         setSignupModal(false);
         setLoginModal(true);
      }
    })
    .catch((error)=>{
       if (error?.response?.status===400){
        toast.error("Error While Signing Up")
       }
       else if( error?.response?.status===409){
        toast.error(error.response.data.message)
       }
       else{
        toast.error("Internal Server Error")
       }
    })
  
  }
  function LoginHandler(e){
    e.preventDefault();
    axios.post(`${BASE_URL}/login`,login_details)
    .then(response=>{
       if (response.data.status){
        toast.success("Login Successfullly")
        localStorage.setItem('token',response.data.token)
        dispatch(check_authenticate_status());
        setLoginModal(false)
       }
       else{
        toast.error("Error while authenticating the user")
       }
    }).catch(error=>{
      if(error?.response?.status===401){
        toast.error("Invalid Credentials")
       }
       else if(error?.response?.status===400){
        toast.error("Error while authenticating the user")
       }
       else{
        toast.error("Internal Server Error")
       }
    })
   
  }
  function SignupchangeHandler(e){
    const {name,value}=e.target;
    setsignup_details({...signup_details,[name]:value});
  }
  function LoginChangeHandler(e){
    const {name,value}=e.target;
    setlogin_details({...login_details,[name]:value});
  }
  function triggerLogin(){
    setSignupModal(false);
    setLoginModal(true);
  }
  function triggerSignUp(){
    setLoginModal(false);
    setSignupModal(true);
  }
  function logOutHandler(){
    localStorage.removeItem('token')
    dispatch(check_authenticate_status());
  }
  const user_items= (
     <Menu >
      <Menu.Item key="log_out">
        <Space>
          <p onClick={logOutHandler}><IoIosLogOut /> Log Out</p>
        </Space>
      </Menu.Item>
      </Menu>
  );
  return (
   <div className="container">
   <div className="navbar">
    <nav>
         <div className="left_nav">
        <img src={logo} alt="logo"/>
      </div>

      <div className="right_nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="help">Help</NavLink>
        {authenticated_status?(<> <Dropdown overlay={ user_items} trigger={['click']}>
      <Space>
      <FaUser style={{ fontSize: '30px',marginRight:"20px",cursor:"pointer" }}/>
      </Space>
  </Dropdown></>):(<><div className='signup_loginbtn'>
        <button  className="nav_login" onClick={()=>setLoginModal(true)}>
        Login
      </button>
        <button  className="nav_signup" onClick={()=>setSignupModal(true)}>
        Signup
      </button>
       </div></>)}
      </div>
    </nav>
   </div> 
   <div className='modal_body'>
   {/* login Modal */}
   <Modal show={loginModal} onHide={()=>setLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='login_form' onSubmit={(e)=>LoginHandler(e)}>
            <div className='login_email_div label_fix'>
              <label>Email ID:</label>
              <input type="email" placeholder='Enter Your Email ID' required name="login_email" onChange={(e)=>LoginChangeHandler(e)}></input>
            </div>
            <div className='login_password_div label_fix'>
              <label>Password:</label>
              <input type="password" placeholder='Enter Your Password' required name="login_password" onChange={(e)=>LoginChangeHandler(e)}></input>
            </div>

            <div className='login_btn'>
            <button type='submit'>Login</button>           
            </div>
          </form>
          <button  onClick={triggerSignUp}>SignUp</button>
          <Button variant="secondary" onClick={()=>setLoginModal(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

   {/* signup Modal */}
   <Modal show={SignupModal} onHide={()=>setSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={(e)=>SignupHandler(e)} className='signup_form'>
       
          <div className='signup_firstname label_fix'>
            <label>First Name:</label>
            <input type="text" placeholder='Enter Your First Name ' name="signup_firstname" required onChange={(e)=>SignupchangeHandler(e)}/>
          </div>

          <div className='signup_lastname label_fix'>
          <label>Last Name:</label>
          <input type="text" placeholder='Enter Your Last Name ' name="signup_lastname" required onChange={(e)=>SignupchangeHandler(e)}/>
          </div>
        
      <div className='email_signup label_fix'>
        <label> Email ID:</label>
        <input type="email" placeholder='Enter Your Email ID' required name="signup_email" onChange={(e)=>SignupchangeHandler(e)}></input>
      </div>

      <div className='password_signup label_fix'>
        <label>Password:</label>
        <input type="password" placeholder='Create Your Password' required name="signup_password" onChange={(e)=>SignupchangeHandler(e)}></input>
      </div>

      <div className='gender_signup '>
         <div className='gender_label'>
        <label>Gender:</label></div>
        <div className='gender_radios'>
        <div className='radio_fix'>
        <input type="radio"  required name="signup_gender" value="Male" onChange={(e)=>SignupchangeHandler(e)}></input>
        <label>Male</label>
        </div>
        <div className='radio_fix'>
        <input type="radio"  required name="signup_gender" value="Female" onChange={(e)=>SignupchangeHandler(e)}></input>
        <label>Female</label>
      </div>
      </div>
      </div>

      <div className='nationality_signup label_fix'>
        <label>Nationality:</label>
        <select required name="signup_nationality" onChange={(e)=>SignupchangeHandler(e)} value={signup_details.signup_nationality}>
          <option value="" disabled hidden>Choose Nationality</option>
          <option>India</option>
          <option>USA</option>
          <option>United Kingdom</option>
          <option>Italy</option>
          <option>China</option>
        </select>
        
      </div>
     <div className='signup_btn'>
      <button type='submit'>Signup</button>
      <button  onClick={triggerLogin}>Login</button>
      <Button variant="secondary"  onClick={()=>setSignupModal(false)} >
            Close
          </Button>
     </div>
        </form>

        </Modal.Body>
      </Modal>
   </div>
   
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/help" element={<Help/>}/>
    </Routes>
   </div>
  );
}

export default App;
