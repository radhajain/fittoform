import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import './SignIn.css'
import { AuthUserContext, withAuthorization } from '../Session';

const SignInPage = () => (
  <div className="signin-background">
    <SignInForm />
  </div>
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      password: '',
      error: null,
      authUser: false,
      uid: '',
      name: '',
      height: '',
      waist: '',
      hips: '',
      bust: '',
      size: '',
      bra: '',
    };
  }


  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase.database().ref('users').child(`${uid}`);
    UserRef.once('value').then((snapshot) => {
      let user = snapshot.val();
      console.log(user);
      this.setState({
        bra: user.bra,
        bust: user.bust,
        name: user.name,
        height: user.height,
        hips: user.hips,
        size: user.size,
        waist: user.waist,
      });
    });
  }  

  componentDidMount() {
    this.listener = firebase.auth().onAuthStateChanged(
      authUser => {
        authUser ? this.setState({authUser: true}): this.setState({authUser:null});
        authUser ? this.setState({uid: authUser.uid}) : this.setState({uid: null});
        authUser ? this.getUserData(this.state.uid) : this.setState({name : null})
      },
    );
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        //this.setState({ ...INITIAL_STATE });

        
        this.props.history.push({
          pathname: '/results',
          state: {
              height: this.state.height,
              waist: this.state.waist,
              hips: this.state.hips,
              bra: this.state.bra,
              bust: this.state.bust,
              size: this.state.size,
              name: this.state.name
          }
      });
       
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
  
      <div className="login-page">
        <div className="signin-form">
          <form className="login-form" onSubmit={this.onSubmit} >
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
  <button className="signout-btn"><Link to={ROUTES.SIGN_IN}> SIGN IN</Link></button>
);

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
