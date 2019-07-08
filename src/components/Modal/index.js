import React, { Component } from 'react';
import './Modal.css';
import whiteArrow from '../../assets/images/white-arrow.png';

function validate(name, email, password) {
    var emailRe = /^.+@.+\..+$/;
    return {
        name: (name.length === 0),
        email: (email.length === 0 || !email.match(emailRe)),
        password: (password.length === 0),        
    };
}


class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.goToSignIn = this.goToSignIn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;    
        this.setState({
          [name]: value
        });
    }

    goToSignIn() {

    }

    handleSubmit(e) {
        e.preventDefault();
        var name = this.state.name;
        var email = this.state.email;
        var password = this.state.password;
        this.props.createAccount(name, email, password);
    }

    render() {
        const {
            name,
            email,
            password,
          } = this.state;
      
        const errors = validate(this.state.name, this.state.email, this.state.password);
        const isDisabled = Object.keys(errors).some(x => errors[x]);

        return (
            <div className="modal" style={{
                transform: this.props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                opacity: this.props.show ? '1' : '0'
            }}>
                <div className="modal-overlay"></div>
                <div className="modal-wrapper">
                <div className="modal-header">
                    <p className="modal-title">Create an account to edit your measurements</p>
                    <span className="close-modal-btn" onClick={this.props.close}>×</span>
                </div>
                <div className="modal-body">
                    <form className="modal-form" onSubmit={this.handleSubmit} >
                        <input 
                            name="name"
                            value={name}
                            onChange={this.handleInputChange}
                            type="text" 
                            style={{marginTop: 20}}
                            className="modal-input"
                            placeholder="NAME"/>
                        <input 
                            name="email"
                            value={email}
                            onChange={this.handleInputChange}
                            type="text" 
                            className="modal-input"
                            placeholder="EMAIL"/>
                        <input 
                            name="password"
                            value={password}
                            style={{marginBottom: 20}}
                            onChange={this.handleInputChange}
                            type="password" 
                            className="modal-input"
                            placeholder="PASSWORD"/>
                        <button disabled={isDisabled} type="submit" className={isDisabled ? "modal-btn-disabled" : "modal-btn-createAccount"} >
                            Join the FtF fam
                            <img src={whiteArrow} style={{width: 15, marginLeft: 15}}/>
                        </button>
                        {/* {error && <p>{error.message}</p>} */}
                        <p className="modal-signin-text">Already have an account? <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={this.goToSignIn}>Sign in</span></p>
                    </form>
                </div>
            </div>
        </div>

        );
    }
}

export default Modal;