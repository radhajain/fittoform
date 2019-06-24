import React from 'react';
import { Link } from 'react-router-dom';

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

  <SignOutButton />
);

/*
  This code defines what the header will look like for a user who is
  NOT logged in to the website.
*/
const NavigationNonAuth = () => (
  <div style={{overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
      <Link to={ROUTES.LANDING}><img src={ShortLogo} style={{height: 30, padding: '20px 20px'}}/> </Link>
      {/* <Link to={ROUTES.SIGN_IN}>Sign In</Link> */}
  </div>
);

export default Navigation;
