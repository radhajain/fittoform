import React from 'react';

import { withFirebase } from '../Firebase';
import './SignOut.css'

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut} className="nav-href signout-btn">
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
