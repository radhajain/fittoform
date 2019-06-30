import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import './SignIn.css'

const SignInPage = () => (
  <div className="signin-background">
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      //<div style={{padding: '50px 30px 20px 30px'}}>
  
      <div class="login-page">
        <div class="signin-form">
          <form class="login-form" onSubmit={this.onSubmit} >
            <input 
              name="email"
              value={email}
              onChange={this.onChange}
              type="text" 
              placeholder="username"/>
            <input 
              name="password"
              value={password}
              onChange={this.onChange}
              type="password" 
              placeholder="password"/>
            <PasswordForgetLink />
            <button disabled={isInvalid} type="submit" >login</button>
            {error && <p>{error.message}</p>}
            <SignUpLink />
          </form>
        </div>
      </div>
      //</div>
   );
  }
}

const SignInLink = () => (
  <button class="signout-btn"><Link to={ROUTES.SIGN_IN}> SIGN IN</Link></button>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
