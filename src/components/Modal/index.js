import React, { Component } from 'react';
import './Modal.css';

function validate(name, email, password) {
  var emailRe = /^.+@.+\..+$/;
  return {
    name: name.length === 0,
    email: email.length === 0 || !email.match(emailRe),
    password: password.length === 0
  };
}

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
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
    this.props.history.push({
      pathname: '/signin'
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, email, password } = this.state;
    this.props.createAccount(name, email, password);
  }

  componentWillReceiveProps(props) {
    this.setState({
      name: props.name
    });
  }

  render() {
    var { name, email, password } = this.state;
    const errors = validate(this.state.name, this.state.email, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    return (
      <div
        className="modal"
        style={{
          transform: this.props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
          opacity: this.props.show ? '1' : '0'
        }}
      >
        <div className="modal-overlay"></div>
        <div className="modal-wrapper">
          <div className="modal-header">
            <p className="modal-title">{this.props.message}</p>
            <p className="modal-subtitle">{this.props.desc}</p>
            <span className="close-modal-btn" onClick={this.props.close}>
              ×
            </span>
          </div>
          <div className="modal-body">
            <form className="modal-form" onSubmit={this.handleSubmit}>
              <input
                name="name"
                value={name}
                onChange={this.handleInputChange}
                type="text"
                style={{ marginTop: 20, textTransform: 'capitalize' }}
                className="modal-input"
                placeholder="Name"
              />
              <input
                name="email"
                value={email}
                onChange={this.handleInputChange}
                type="text"
                className="modal-input"
                placeholder="Email"
              />
              <input
                name="password"
                value={password}
                style={{ marginBottom: 20 }}
                onChange={this.handleInputChange}
                type="password"
                className="modal-input"
                placeholder="Password"
              />
              <button
                disabled={isDisabled}
                type="submit"
                className={isDisabled ? 'modal-btn-disabled' : 'modal-btn-createAccount'}
              >
                {this.props.btnMsg}
              </button>
              {/* {error && <p>{error.message}</p>} */}
              <p className="modal-signin-text">
                Already have an account?{' '}
                <span
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={this.props.goToSignIn}
                >
                  Sign in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
