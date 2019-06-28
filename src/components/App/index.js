import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Footer from '../Footer';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AddItemPage from '../AddItem';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import ItemPage from '../Item';
import ResultsPage from '../Results';
import SearchPage from '../Search';
import AddItem from '../AddItem';
import HowItWorks from '../HowItWorks';
import Contact from '../Contact';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';


const App = () => (
  <Router>
    <div>
      <Navigation />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.SEARCH} component={SearchPage} />
      <Route path={ROUTES.RESULTS} component={ResultsPage} />
      <Route path={ROUTES.ITEM} component={ItemPage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.ADDITEM} component={AddItem} />
      <Route path={ROUTES.CONTACT} component={Contact} />
      <Route path={ROUTES.HOWITWORKS} component={HowItWorks} />
    </div>
  </Router>
);

export default withAuthentication(App);
