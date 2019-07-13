import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import './SignIn.css';

const SignInPage = () => <SignInForm />;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      user: {
        name: '',
        height: '',
        waist: '',
        hips: '',
        bust: '',
        size: '',
        bra: ''
      }
    };
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase
      .database()
      .ref('users')
      .child(`${uid}`);
    return UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      var userInfo = {
        bra: user.bra,
        bust: user.bust,
        name: user.name,
        height: user.height,
        hips: user.hips,
        size: user.size,
        waist: user.waist,
        id: uid
      };
      return userInfo;
    });
  }

  componentDidMount() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        this.getUserData(authUser.uid).then(userInfo => {
          this.setState(
            {
              user: userInfo
            },
            () => {
              console.log(this.state);
              this.props.history.push({
                pathname: '/results',
                state: {
                  height: this.state.user.height,
                  waist: this.state.user.waist,
                  hips: this.state.user.hips,
                  bra: this.state.user.bra,
                  bust: this.state.user.bust,
                  size: this.state.user.size,
                  name: this.state.user.name
                }
              });
            }
          );
        });
      }
    });
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('logging in...');
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className="signin-page">
        <div className="signin-content">
          <form className="signin-form" onSubmit={this.onSubmit}>
            <div className="signin-form-div">
              <input
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.onChange}
                type="text"
                className="signin-input"
              />
            </div>
            <div className="signin-form-div">
              <input
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.onChange}
                type="password"
                className="signin-input"
              />
            </div>
            <PasswordForgetLink />
            <div style={{ marginTop: 100, textAlign: 'center' }}>
              <button
                className={isInvalid ? 'signin-btn-disabled' : 'signin-btn'}
                disabled={isInvalid}
                type="submit"
              >
                Sign in
              </button>
              {error && (
                <p className="signin-error-msg">
                  We couldn't find an account with this username and password. Please try again
                </p>
              )}
              <SignUpLink />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const SignInLink = () => (
  <button className="signout-btn">
    <Link to={ROUTES.SIGN_IN}> SIGN IN</Link>
  </button>
);

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
