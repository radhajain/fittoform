import React from 'react';
import { Switch, Route } from 'react-router';
import * as ROUTES from './routes.js';

export default (
  // Switch is added in v4 react-router
  <Switch>
    <Route exact path={ROUTES.LANDING} />
    <Route path={ROUTES.SIGN_UP} />
    <Route path={ROUTES.SIGN_IN} />
    <Route path={ROUTES.PASSWORD_FORGET} />
    <Route path={ROUTES.HOME} />
    <Route path={ROUTES.SEARCH} />
    <Route path={ROUTES.RESULTS} />
    <Route path={ROUTES.ITEM} />
    <Route path={ROUTES.ACCOUNT} />
    <Route path={ROUTES.ADMIN} />
    <Route path={ROUTES.ADDITEM} />
    <Route path={ROUTES.PASSWORD_CHANGE} />
    <Route path={ROUTES.CONTACT} />
    <Route path={ROUTES.HOWITWORKS} />
    <Route path={ROUTES.ANALYTICS} />
    <Route path={ROUTES.FAVORITES} />
    <Route path={ROUTES.POPUP} />
    <Route path={ROUTES.SUBMIT} />
    <Route path={ROUTES.PROMO} />
  </Switch>
);
