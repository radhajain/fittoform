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
          

            <div className="howitworks-parent">
              
                <div className="contact-form" id="contact-form" method="post" action="contact.php">

                    <div class="messages"></div>

                    <h1>Leave a comment</h1>
                    <div className="group">      
                        <input className="form-input" type="text" required/>
                        <span className="highlight"></span>
                        <label>Your name</label>
                    </div>
                    <div className="group">      
                        <input className="form-input" type="text" required/>
                        <span className="highlight"></span>
                        <label>Your email</label>
                    </div>
                    <div className="group">      
                        <input className="form-input" type="text" required/>
                        <span className="highlight"></span>
                        <label>Your message</label>
                    </div>
                    <a className="send-btn">Send</a>
                </div>
                  
            </div>
        
           
        );
    }
}




export default Contact;
