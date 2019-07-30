import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import '../assets/fonts/fonts.css';
import FavoritesPage from '../Components/Favorites';
import PasswordChange from '../Components/PasswordChange';
import Navigation from '../Components/Navigation';
import LandingPage from '../Components/Landing';
import SignUpPage from '../Components/SignUp';
import SignInPage from '../Components/SignIn';
import PasswordForgetPage from '../Components/PasswordForget';
import HomePage from '../Components/Home';
import AccountPage from '../Components/Account';
import AdminPage from '../Components/Admin';
import ItemPage from '../Components/Item';
import ResultsPage from '../Components/Results';
import SearchPage from '../Components/Search';
import AddItem from '../Components/AddItem';
import HowItWorks from '../Components/HowItWorks';
import Contact from '../Components/Contact';
import Analytics from '../Components/Analytics';
import HttpsRedirect from 'react-https-redirect';
import { ParallaxProvider } from 'react-scroll-parallax';
import Popup from '../Components/Popup';
import SubmitPage from '../Components/Submit';
import PromoPage from '../Components/Promo';

import * as ROUTES from '/routes';
import { withAuthentication } from '../Components/Session';



 
export default (
    <Route>
	 <Route exact path={ROUTES.LANDING} component={LandingPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
              <Route path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.SEARCH} component={SearchPage} />
              <Route path={ROUTES.RESULTS} component={ResultsPage} />
              <Route path={ROUTES.ITEM} component={ItemPage} />
              <Route path={ROUTES.ACCOUNT} component={AccountPage} />
              <Route path={ROUTES.ADMIN} component={AdminPage} />
              <Route path={ROUTES.ADDITEM} component={AddItem} />
              <Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
              <Route path={ROUTES.CONTACT} component={Contact} />
              <Route path={ROUTES.HOWITWORKS} component={HowItWorks} />
              <Route path={ROUTES.ANALYTICS} component={Analytics} />
              <Route path={ROUTES.FAVORITES} component={FavoritesPage} />
              <Route path={ROUTES.POPUP} component={Popup} />
              <Route path={ROUTES.SUBMIT} component={SubmitPage} />
              <Route path={ROUTES.PROMO} component={PromoPage} />
    </Route>
);

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     console.log(window.location.pathname);
//   }

//   render() {
//     return (
//       <HttpsRedirect>
//         <Router>
//             <div>
//               <Navigation />

//               <Route exact path={ROUTES.LANDING} component={LandingPage} />
//               <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
//               <Route path={ROUTES.SIGN_IN} component={SignInPage} />
//               <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
//               <Route path={ROUTES.HOME} component={HomePage} />
//               <Route path={ROUTES.SEARCH} component={SearchPage} />
//               <Route path={ROUTES.RESULTS} component={ResultsPage} />
//               <Route path={ROUTES.ITEM} component={ItemPage} />
//               <Route path={ROUTES.ACCOUNT} component={AccountPage} />
//               <Route path={ROUTES.ADMIN} component={AdminPage} />
//               <Route path={ROUTES.ADDITEM} component={AddItem} />
//               <Route path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
//               <Route path={ROUTES.CONTACT} component={Contact} />
//               <Route path={ROUTES.HOWITWORKS} component={HowItWorks} />
//               <Route path={ROUTES.ANALYTICS} component={Analytics} />
//               <Route path={ROUTES.FAVORITES} component={FavoritesPage} />
//               <Route path={ROUTES.POPUP} component={Popup} />
//               <Route path={ROUTES.SUBMIT} component={SubmitPage} />
//               <Route path={ROUTES.PROMO} component={PromoPage} />
//             </div>
//         </Router>
//       </HttpsRedirect>
//     );
//   }
// }

// export default withAuthentication(App);
