import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../../assets/fonts/fonts.css';
import FavoritesPage from '../Favorites';
import PasswordChange from '../PasswordChange';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import ItemPage from '../Item';
import ResultsPage from '../Results';
import SearchPage from '../Search';
import AddItem from '../AddItem';
import HowItWorks from '../HowItWorks';
import Contact from '../Contact';
import Analytics from '../Analytics';
import HttpsRedirect from 'react-https-redirect';
import { ParallaxProvider } from 'react-scroll-parallax';
import Popup from '../Popup';
import SubmitPage from '../Submit';
import PromoPage from '../Promo';
import PurchasesPage from '../Purchases';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log(window.location.pathname);
  }

  render() {
    return (
      <HttpsRedirect>
        <Router>
          <ParallaxProvider>
            <div>
              <Navigation />

              <Route exact path={ROUTES.LANDING} component={LandingPage} />
              {/* <Route exact path={ROUTES.LANDING} component={SearchPage} /> */}
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
              <Route path={ROUTES.PURCHASES} component={PurchasesPage} />
            </div>
          </ParallaxProvider>
        </Router>
      </HttpsRedirect>
    );
  }
}

export default withAuthentication(App);
