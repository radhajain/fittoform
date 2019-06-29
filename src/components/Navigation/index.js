import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import SignOutButton from '../SignOut';
import SignInLink from '../SignIn';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import ShortLogo from '../../assets/images/one-line-logo.png';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);


const NavigationAuth = () => (
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
          <Link to={ROUTES.ACCOUNT} className="nav-signin-btn nav-href">Your Profile</Link>
          <SignOutButton />
        </div>
    </div>
  </div>

);

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
