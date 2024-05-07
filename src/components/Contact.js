import { useState } from "react";
import contactUs from "../static/img/contactUs.png"
function Contact(){
    const [contactFormDetails,setContactFormDetails]=useState({
        "contactus_name":"",
        "contactus_email":"",
        "contactus_description":""
    })
    function contactFormHandler(e){
        e.preventDefault();
    }
    function changeHandler(e){
        const {name,value}=e.target;
        setContactFormDetails({...contactFormDetails,[name]:value});
    }
    return(
        <div className="contactus_section">
           <div className="contactus_container">

              <div className="contactus_upperContainer">
                 <div className="contactus_upperimg">
                 <img src={contactUs} alt="contactUs"></img>
                 </div>

                 <div className="contactus_upperright">
                    <h3><strong>Have questions?<br></br>Shoot Us an Email.</strong></h3>
                    <p> We're here to help! we value your feedback and are committed to providing you with exceptional support. Whether you're encountering an issue with our platform, have a suggestion for improvement, or just want to say hello, we encourage you to reach out to us. Our dedicated customer support team is ready to assist you with prompt and personalized assistance. Your input matters to us, and we're eager to hear from you. Feel free to drop us a message using the contact form below, and we'll get back to you as soon as possible.</p>
                 </div>

              </div>

              <div className="contactus_lowerContainer">
              <form class="contact-form" onSubmit={(e)=>contactFormHandler(e)}>
    <div class="contactus_field">
        <label for="contactus_name">Your Name <span class="required">*</span></label>
        <input type="text" id="contactus_name" placeholder="Enter Your Full Name" name="contactus_name" required onChange={(e)=>changeHandler(e)} value={contactFormDetails.contactus_name}/>
    </div>
    <div class="contactus_field">
        <label for="contactus_email">Email Address <span class="required">*</span></label>
        <input type="email" id="contactus_email" placeholder="Enter Your Email" name="contactus_email" required onChange={(e)=>changeHandler(e)} value={contactFormDetails.contactus_email}/>
    </div>
    <div class="contactus_field">
        <label for="contactus_description">Your Message <span class="required">*</span></label>
        <textarea id="contactus_description" name="contactus_description" placeholder="Enter Your Message" required onChange={(e)=>changeHandler(e)} value={contactFormDetails.contactus_description}></textarea>
    </div>
    <button type="submit">Submit</button>
</form>
              </div>
           </div>
        </div>

    )
}
export default Contact;