import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    //this.props in the future should have all of the following populated fields:
    /*
       currPage: 'Onboarding1',
        name: null,
        heightFt: null,
        heightIn: null,
        size: null,
        inches: null,
        waistIn: null,
        hipsIn: null,
        bustIn: null,
        insideLegIn: null,
        favoriteJeansBrand: null,
        favoriteJeansSize: null
    */

    console.log(this.props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    //const name = this.props.name;
    //const heightFt = this.props.heightFt;
    //const heightIn = this.props.heightIn;
    //const size = this.props.size;
    //const inches = this.props.inches;
    //const waistIn= this.props.waistIn;
    //const hipsIn = this.props.hipsIn;
    //const insideLegIn = this.props.insideLegIn;
    //const favoriteJeansBrand = this.props.favoriteJeansBrand;
    //const favoriteJeansSize = this.props.favoriteJeansSize;
    //const savedItems = 'none';

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email
            //name,  
            //heightFt,
            //heightIn,
            //size,
            //inches,
            //waistIn,
           // hipsIn,
           // bustIn
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
   this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (

      <div className="signup-parent">
      <div className="signup-container-first signup-child">
        <div className="signup-search-content">
            <form>
              <label className="signup-search-label">
                I am
                <input
                  name="heightft"
                  type="number"
                  className="signup-input"
                  onChange={this.handleInputChange} />
                ft, 
                <input
                  name="heightin"
                  type="number"
                  className="signup-input"
                  onChange={this.handleInputChange} />
                in tall.
              </label>
            </form>
          </div>
      </div>
      <div className="signup-container-second signup-child">
        <div className="signup-search-content">
            <form>
              <label className="signup-search-label">
                I normally wear US size
                <input
                  name="size"
                  type="number"
                  className="signup-input"
                  onChange={this.addUSSize} />
              </label>
            </form>
          </div>
      </div>
      <div className="signup-container-third signup-child">
        <div className="signup-search-content">
          <p className="signup-desc">On me, size 2 is generally fits:</p>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div className="signup-desc" style={{display:'block'}}>
                WAIST
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <button className="signup-size-buttons" onClick={() => this.modifyWaist(0.5)}>Too small</button>
                <button className="signup-size-buttons" onClick={() => this.modifyWaist(0.25)}>Tight</button>
                <button className="signup-size-buttons" onClick={() => this.modifyWaist(0)}>Perfect</button>
                <button className="signup-size-buttons" onClick={() => this.modifyWaist(-0.25)}>Loose</button>
                <button className="signup-size-buttons" onClick={() => this.modifyWaist(-0.5)}>Large</button>
                </div>
            </div>
            <div className="signup-desc" style={{marginLeft: 100, marginRight: 100}}>
                HIPS
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <button className="signup-size-buttons" onClick={() => this.modifyHips(0.5)}>Too small</button>
                <button className="signup-size-buttons" onClick={() => this.modifyHips(0.25)}>Tight</button>
                <button className="signup-size-buttons" onClick={() => this.modifyHips(0)}>Perfect</button>
                <button className="signup-size-buttons" onClick={() => this.modifyHips(-0.25)}>Loose</button>
                <button className="signup-size-buttons" onClick={() => this.modifyHips(-0.5)}>Large</button>
                </div>
            </div>
            <div className="signup-desc">
                BUST
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <button className="signup-size-buttons" onClick={() => this.modifyBust(0.5)}>Too small</button>
                <button className="signup-size-buttons" onClick={() => this.modifyBust(0.25)}>Tight</button>
                <button className="signup-size-buttons" onClick={() => this.modifyBust(0)}>Perfect</button>
                <button className="signup-size-buttons" onClick={() => this.modifyBust(-0.25)}>Loose</button>
                <button className="signup-size-buttons" onClick={() => this.modifyBust(-0.5)}>Large</button>
                </div>
            </div>
          </div>
          </div>

        </div>

          <div className="signup-container-fourth signup-child">
          <form onSubmit={this.onSubmit}>
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
              className="signup-input-email"
            />
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
              className="signup-input-email"
            />
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              className="signup-input-email"
            />
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
              className="signup-input-email"
            />
            {/* <button disabled={isInvalid} type="submit">
              Sign Up
            </button>
            {error && <p>{error.message}</p>} */}
          </form>
       
        <div>
            <Link to= {{
              pathname: '/results',
              state: {
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bust: this.state.bust,
                size: this.state.size
              }}}><button disabled={isInvalid} className="signup-results-btn" type="submit">See dresses picked for my size</button></Link>
              {error && <p>{error.message}</p>}
          </div>
        </div>



          

  
          
       

        

    
     
     
    </div>
     



      
    );
  }
}

const SignUpLink = () => (
  <p class="message">Not registered? <Link to={ROUTES.SIGN_UP}>Create an account</Link></p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
