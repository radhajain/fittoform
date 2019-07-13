import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import './SignOut.css';

class SignOutButton extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut(e) {
    e.preventDefault();
    this.props.firebase
      .doSignOut()
      .then(authUser => {
        this.props.history.push({
          pathname: '/'
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <button type="button" onClick={this.handleSignOut} className="nav-href signout-btn">
        Sign Out
      </button>
    );
  }
}

export default withRouter(withFirebase(SignOutButton));
