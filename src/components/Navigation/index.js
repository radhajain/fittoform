import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import SignOutButton from '../SignOut';
import SignInLink from '../SignIn';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import WhiteLogo from '../../assets/images/one-line-logo.png';
import BlackLogo from '../../assets/images/ftf-one-line-logo-black.png';
import firebase from 'firebase';
import WhiteArrow from '../../assets/images/down triangle.svg';
import { withRouter } from 'react-router-dom';

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
              <button className="dropbtn">Hey, {this.getFirstName(this.state.name)}</button>
              <img src={WhiteArrow} className="nav-whitearrow" />
              <div className="dropdown-content">
                <Link to={ROUTES.ACCOUNT} className="nav-profile-btn">
                  Your Profile
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
    console.log(this.props);
    this.state = {
      whiteLogo: false,
      whiteNav: false
    };
    // if (
    //   this.props.path === '/' ||
    //   this.props.path === 'search' ||
    //   this.props.path === 'signup' ||
    //   this.props.path === 'signin' ||
    //   this.props.path === 'howitworks'
    // ) {
    //   this.state.whiteLogo = true;
    //   this.state.whiteNav = true;
    // } else {
    //   this.state.whiteLogo = false;
    //   this.state.whiteNav = false;
    //   if (this.props.path === 'results') {
    //     this.state.whiteNav = true;
    //   }
    // }
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
              {!this.state.whiteLogo && <img src={BlackLogo} style={{ height: 20 }} />}
              {this.state.whiteLogo && <img src={WhiteLogo} style={{ height: 30 }} />}
            </Link>
          </div>
          <div className="nav-c3">
            <Link
              to={ROUTES.SIGN_IN}
              className={this.state.whiteNav ? 'nav-href' : 'nav-href-black'}
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.SIGN_UP}
              className={this.state.whiteNav ? 'nav-href' : 'nav-href-black'}
              style={{ marginLeft: 30 }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
