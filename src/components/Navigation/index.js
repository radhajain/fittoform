import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import BlackLogo from '../../assets/images/ftf-one-line-logo-black.png';
import firebase from 'firebase';
import blackArrow from '../../assets/images/down-triangle-black.svg';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this._isMounted = false;
    this.state = {
      authUser: false,
      uid: '',
      name: '',
      height: '',
      waist: '',
      hips: '',
      bust: '',
      size: '',
      bra: ''
    };
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase
      .database()
      .ref('users')
      .child(`${uid}`);
    UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      this.setState({
        name: user.name,
        height: user.height,
        waist: user.waist,
        hips: user.hips,
        bust: user.bust,
        size: user.size,
        bra: user.bra
      });
    });
  }

  authlistener() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      authUser ? this.setState({ authUser: true }) : this.setState({ authUser: null });
      authUser ? this.setState({ uid: authUser.uid }) : this.setState({ uid: null });
      authUser ? this.getUserData(this.state.uid) : this.setState({ name: null });
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    if (this._isMounted) {
      this.authlistener();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
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
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c2">
            <Link to={ROUTES.LANDING} className="nav-logo-center">
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c3">
            <div className="dropdown">
              <Link to={ROUTES.ACCOUNT}>
                <button className="dropbtn">Hey, {this.getFirstName(this.state.name)}</button>
              </Link>
              <img src={blackArrow} className="nav-whitearrow" />
              <div className="dropdown-content">
                <Link to={ROUTES.ACCOUNT} className="nav-profile-btn">
                  Your Profile
                </Link>
                <hr></hr>
                <Link to={ROUTES.FAVORITES} className="nav-profile-btn">
                  Your Favorites
                </Link>
                <hr></hr>
                <Link to={ROUTES.SUBMIT} className="nav-profile-btn">
                  Review a dress
                </Link>
                <hr></hr>
                <Link to={ROUTES.PROMO} className="nav-profile-btn">
                  Redeem Promo
                </Link>
                <hr></hr>
                <SignOutButton />
              </div>
            </div>
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
class NavigationNonAuth extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="nav-outer">
        <div className="nav-inner">
          <div className="nav-c1">
            <Link to={ROUTES.LANDING} className="nav-logo-right">
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c2">
            <Link to={ROUTES.LANDING} className="nav-logo-center">
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c3">
            <Link to={ROUTES.SIGN_IN} className="nav-href">
              Sign In
            </Link>
            <Link to={ROUTES.SIGN_UP} className="nav-href nav-margin-left">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
