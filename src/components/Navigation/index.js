import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import SignInLink from '../SignIn';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import Logo from '../../assets//images/insta1.jpeg';
import './Navigation.css'
import '../SignOut/SignOut.css'

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);


// const NavigationAuth = () => (
//   <SignOutButton />
// );

// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//     </li>
//   </ul>
//);

const NavigationAuth = () => (
  <nav className = "navbar long">
    <div className="nav-inner">
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className="nav-left-panel">
          <div className="nav-logo">
              <Link to={ROUTES.LANDING}>
                  <img alt="The Fitting Room" src={Logo} style={{width: '100%', height: 'auto'}}/>
              </Link>
          </div>
        </div>
        <div className="nav-center-panel"></div>
        <div style={{display: 'flex', justifyContent: 'center',  flex: '0 0 30%'}}>
        <div className="nav-right-panel">
          <div className="nav-right-icons">
            <SignOutButton />
          </div>
        </div>
        </div>
        
      </div>
    </div>
  </nav>
);

/*
  This code defines what the header will look like for a user who is
  NOT logged in to the website.
*/
const NavigationNonAuth = () => (
  <nav className = "navbar long">
  <div className="nav-inner">
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className="nav-left-panel">
        <div className="nav-logo">
            <Link to={ROUTES.LANDING}>
                <img alt="The Fitting Room" src={Logo} style={{width: '100%', height: 'auto'}}/>
            </Link>
        </div>
      </div>
      <div className="nav-center-panel"></div>
      <div style={{display: 'flex', justifyContent: 'center',  flex: '0 0 30%'}}>
      <div className="nav-right-panel">
        <div className="nav-right-icons">
          <button className="signin-btn"><Link to={ROUTES.SIGN_IN}>SIGN IN</Link></button>
        </div>
      </div>
      </div>
      
    </div>
  </div>
 
  </nav>
);

export default Navigation;
