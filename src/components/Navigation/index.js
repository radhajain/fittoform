import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import SignOutButton from '../SignOut';
import SignInLink from '../SignIn';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import ShortLogo from '../../assets/images/one-line-logo.png';
import firebase from 'firebase';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <NavigationAuth /> : <NavigationNonAuth />
          }
        </AuthUserContext.Consumer>
      </div>
    );
  }
}




class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      authUser: false,
      uid: '',
      name: ''
    }
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase.database().ref('users').child(`${uid}`);
    UserRef.once('value').then((snapshot) => {
      let user = snapshot.val();
      this.setState({
        name: user.name,
      });
    });
  }  

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
    this.listener = firebase.auth().onAuthStateChanged(
      authUser => {
        authUser ? this.setState({authUser: true}): this.setState({authUser:null});
        authUser ? this.setState({uid: authUser.uid}) : this.setState({uid: null});
        authUser ? this.getUserData(this.state.uid) : this.setState({name : null})
      },
    );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFirstName(name) {
    if (name.includes(' ')) {
      return name.split(' ')[0];
    }
    return name;
  }

  render() {
    return (
      <div className="nav-outer">
        <div className="nav-inner">
          <div className="nav-c1">
            <Link to={ROUTES.LANDING} className="nav-logo-right">
              <img src={ShortLogo} style={{height: 30}}/> 
            </Link>
          </div>
            <div className="nav-c2">
              <Link to={ROUTES.LANDING} className="nav-logo-center">
                <img src={ShortLogo} style={{height: 30}}/> 
              </Link>
            </div>
            <div className="nav-c3">
              <Link to={ROUTES.ACCOUNT} className="nav-account-btn nav-href">Your Profile</Link>
              <SignOutButton />
            </div>
        </div>
      </div>
    );
  }
}


/*
  This code defines what the header will look like for a user who is
  NOT logged in to the website.
*/
const NavigationNonAuth = () => (
  <div className="nav-outer">
    <div className="nav-inner">
      <div className="nav-c1">
        <Link to={ROUTES.LANDING} className="nav-logo-right">
          <img src={ShortLogo} style={{height: 30}}/> 
        </Link>
      </div>
      <div className="nav-c2">
        <Link to={ROUTES.LANDING} className="nav-logo-center">
          <img src={ShortLogo} style={{height: 30}}/> 
        </Link>
      </div>
      <div className="nav-c3">
        <Link to={ROUTES.SIGN_IN} className="nav-signin-btn nav-href">Sign In</Link>
        <Link to={ROUTES.SIGN_UP} className="nav-href">
          <button className="nav-signup-btn">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default Navigation;
