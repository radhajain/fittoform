import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import BlackLogo from '../../assets/images/ftf-one-line-logo-black.png';
import firebase from 'firebase';
import blackArrow from '../../assets/images/down-triangle-black.svg';
import menuIcon from '../../assets/images/menu_icon.svg';
import heartIcon from '../../assets/images/heart_outline.png';

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
      bra: '',
      favorites: [],
      shoppedLinks: [],
      showMenu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  toggleMenu() {
    var currVal = this.state.showMenu;
    console.log('toggling menu...');
    this.setState({
      showMenu: !currVal
    });
  }

  handleClick = e => {
    this.setState({
      showMenu: false
    });
    // if (this.node.contains(e.target)) {
    //   return;
    // } else {
    // }
  };

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
        bra: user.bra,
        favorites: user.favorites ? user.favorites : [],
        shoppedLinks: user.shoppedLinks ? user.shoppedLinks : []
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

  firebaseFavoritesListener() {
    if (this.state.uid) {
      let UserRef = firebase
        .database()
        .ref('users')
        .child(`${this.state.uid}`)
        .child('favorites');
      if (UserRef) {
        UserRef.onUpdate(e => {
          console.log('userRef updating');
          var favorites = e.data.val();
          this.setState({
            favorites: favorites
          });
        });
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    this.firebaseFavoritesListener = this.firebaseFavoritesListener.bind(this);
    if (this._isMounted) {
      this.authlistener();
      this.firebaseFavoritesListener();
      document.addEventListener('mousedown', this.handleClick, false);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
    this.firebaseFavoritesListener = undefined;
    document.removeEventListener('mousedown', this.handleClick, false);
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
            <Link to={ROUTES.RESULTS} className="nav-logo-right nav-logo-right-auth">
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c2">
            <Link to={ROUTES.RESULTS} className="nav-logo-center nav-logo-center-auth">
              <img src={BlackLogo} style={{ height: 20 }} />
            </Link>
          </div>
          <div className="nav-c3 nav-c3-auth">
            <Link to={ROUTES.FAVORITES} className="nav-favorites">
              <div className="nav-favorites-inner">
                <img src={heartIcon} className="nav-heart-icon" alt="your-favorites" />
                {this.state.favorites.length > 0 && (
                  <p className="nav-favorites-label">{this.state.favorites.length}</p>
                )}
              </div>
            </Link>
            <div className="dropdown">
              <button className="dropbtn" onClick={this.toggleMenu}>
                Hey, {this.getFirstName(this.state.name)}
                <img src={blackArrow} style={{ marginLeft: 5 }} className="nav-whitearrow" />
              </button>

              <div
                className={
                  this.state.showMenu
                    ? 'dropdown-content dropdown-content-show'
                    : 'dropdown-content'
                }
              >
                <Link to={ROUTES.ACCOUNT} className="nav-profile-btn">
                  Your Profile
                </Link>
                <div className="nav-favorites-menu">
                  <hr></hr>
                  <Link to={ROUTES.FAVORITES} className="nav-profile-btn">
                    Your Favorites{' '}
                    <span className="nav-favorites-label">{this.state.favorites.length}</span>
                  </Link>
                </div>
                <hr></hr>
                <Link to={ROUTES.PURCHASES} className="nav-profile-btn">
                  Your Purchases{' '}
                  {this.state.shoppedLinks.length > 0 && (
                    <span>({this.state.shoppedLinks.length})</span>
                  )}
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
    this.state = {
      showMenu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    var currVal = this.state.showMenu;
    console.log('toggling menu...');
    this.setState({
      showMenu: !currVal
    });
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
            <div className="nav-c3-mobile dropdown">
              <div onClick={this.toggleMenu} className="nav-menuIcon">
                <img src={menuIcon} className="nav-menu-icon-img" />
              </div>
              <div className="dropdown-content dropdown-nonauth">
                <Link to={ROUTES.SHOP} className="nav-profile-btn">
                  Shop
                </Link>
                <hr></hr>
                <Link to={ROUTES.HOWITWORKS} className="nav-profile-btn">
                  How it works
                </Link>
                <hr></hr>
                <Link to={ROUTES.SIGN_IN} className="nav-profile-btn">
                  Sign In
                </Link>
                <hr></hr>
                <Link to={ROUTES.SIGN_UP} className="nav-profile-btn">
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="nav-c3-desktop">
              <Link to={ROUTES.SHOP} className="nav-href ">
                Shop
              </Link>
              <Link to={ROUTES.HOWITWORKS} className="nav-href nav-margin-left">
                How it works
              </Link>
              <Link to={ROUTES.SIGN_IN} className="nav-href nav-margin-left">
                Sign In
              </Link>
              <Link to={ROUTES.SIGN_UP} className="nav-href nav-margin-left">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
