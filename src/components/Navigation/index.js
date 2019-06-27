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

  <SignOutButton />
);

/*
  This code defines what the header will look like for a user who is
  NOT logged in to the website.
*/
const NavigationNonAuth = () => (
  <div className="nav-nonauth-outer">
    <div className="nav-nonauth-inner">
      <div style={{flexBasis: '20%'}}></div>
      <div style={{flexBasis: '60%', display: 'flex', justifyContent:'center', alignItems: 'center'}}>
        <Link to={ROUTES.LANDING}>
          <img src={ShortLogo} style={{height: 30}}/> 
        </Link>
      </div>
      <div style={{flexBasis: '20%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
        <Link to={ROUTES.SIGN_IN} className="nav-signin-btn nav-href">Log In</Link>
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
