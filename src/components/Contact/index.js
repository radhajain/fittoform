import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import './Contact.css'

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            message: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {

    }

    handleSubmit(e) {

    }

    render() {
        return (
          

            <div className="contactus-parent">
                <div className="contactus-messagebackground">
                    <div className="contactus-message">
                        <p className="contactus-title">We'd love to hear from you!</p>
                        <p style={{fontSize:'1.2em'}}>Email us at contact@thefittoform.com or dm us on Instagram @fit.to.form</p>
                    </div>
                </div>
              
                {/* <div className="contact-form" method="post" action="Contact.php">
                    
                    <div className="messages"></div>

                    <h1>Leave a comment</h1>
                    <div className="group">      
                        <input className="form-input" type="text" name="first_name" required/>
                        <span className="highlight"></span>
                        <label>Your name</label>
                    </div>
                    <div className="group">      
                        <input className="form-input" type="text" name="email_address" required/>
                        <span className="highlight"></span>
                        <label>Your email</label>
                    </div>
                    <div className="group">      
                        <input className="form-input" type="text" name="comments" required/>
                        <span className="highlight"></span>
                        <label>Your message</label>
                    </div>
                    <a className="send-btn">Send</a>
                </div> */}
                  
            </div>
        
           
        );
    }
}




export default Contact;
