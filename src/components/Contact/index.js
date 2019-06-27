import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

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
            <div>
                <p>We'd love to hear from you.</p>
                <form onSubmit={this.handleSubmit}>
                        <input
                            name="name"
                            placeholder="Your name"
                            onChange={this.handleChange}
                        />
                        <input
                            name="email"
                            placeholder="Your email"
                            onChange = {this.handleChange}
                        />
                        <input 
                            name="message"
                            placeholder="What would you like us to know?"
                            onChange={this.handleChange}
                        />
                        <button>Send</button>

                </form>
            </div>
        );
    }
}




export default Contact;
