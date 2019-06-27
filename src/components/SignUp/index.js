import React, { Component } from 'react';
import './SignUp.css';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';
import whiteArrow from '../../assets/images/white-arrow.png';


const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);


function validate(heightft, heightin, size, bra, name, email, passwordOne, passwordTwo) {
    var braRe = /[0-9][0-9]\w\w?\w?/;
    var emailRe = /^.+@.+\..+$/;
    var heightft = parseInt(heightft, 10);
    var heightin = parseInt(heightin, 10);
    var size = parseInt(size, 10);
    return {
        heightft: ( (heightft.length === 0) || !Number.isInteger(heightft) || (heightft < 4) || (heightft > 6)),
        heightin: ( (heightin.length === 0) || !Number.isInteger(heightin) || heightin < 0 || heightin > 12),
        size: ( (size.length === 0) || !Number.isInteger(size) || (size % 2 === 1) ),
        bra: ( (bra.length === 0) || !bra.match(braRe)),
        name: (name.length === 0),
        email: (email.length === 0 || !email.match(emailRe)),
        passwordOne: (passwordOne.length === 0),
        passwordTwo: (passwordTwo.length === 0 || passwordOne !== passwordTwo),
        
    };
}


class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.USsizeArray = 
        {
          "00": {
            waist: 24,
            hips: 34,
            bust: 32,
          },
          "0": {
            waist: 24,
            hips: 35,
            bust: 33,
          },
          "2": {
            waist: 26,
            hips: 37,
            bust: 34,
          },
          "4": {
            waist: 27,
            hips: 38,
            bust: 35,
          },
          "6": {
            waist: 28,
            hips: 39,
            bust: 36,
          },
          "8": {
            waist: 29,
            hips: 40,
            bust: 37,
          },
          "10": {
            waist: 30,
            hips: 41,
            bust: 38.5,
          },
          "12": {
            waist: 31,
            hips: 42,
            bust: 40,
          },
          "14": {
            waist: 33,
            hips: 44,
            bust: 42,
          },
          "16": {
            waist: 34,
            hips: 45,
            bust: 44,
          }
        }
        this.state = {
          height: '',
          heightft: '',
          heightin: '',
          size: '',
          waist: '',
          bust: '',
          bra: '',
          modifyWaist: '',
          modifyHips: '',
          name: '',
          email: '',
          passwordOne: '',
          passwordTwo: '',
          error: '',
          touched: {
            heightft: false,
            heightin: false,
            size: false,
            bra: false
          },
        };
        this.braToBust = {
            "A" : 1,
            "B" : 2,
            "C" : 3,
            "D" : 4,
            "DD" : 5,
            "DDD" : 6,
            "E" : 6,
            "F" : 7,
            "G" : 8

        }
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.modifyWaist = this.modifyWaist.bind(this);
        this.modifyHips = this.modifyHips.bind(this);
        this._handleKeyPressHeightFt = this._handleKeyPressHeightFt.bind(this);
        this._handleKeyPressHeightIn = this._handleKeyPressHeightIn.bind(this);
        this._handleKeyPressSize = this._handleKeyPressSize.bind(this);
        this._handleKeyPressBra = this._handleKeyPressBra.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sizingRef = React.createRef();
      }
    
      modifyWaist(val) {
        this.setState({modifyWaist: val});
      }
    
      modifyHips(val) {
        this.setState({modifyHips: val});
      }
    
    
      handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      _handleKeyPressHeightFt(e) {
          if (e.key === 'Enter') {
              e.preventDefault();
              this.refs.heightin.focus();
          }
      }

      _handleKeyPressHeightIn(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.refs.size.focus();
        }
    }

        _handleKeyPressSize(e) {
            if (e.key === 'Enter') {
                this.refs.bra.focus();
                e.preventDefault();
                console.log("going to focus on tittys");
                
        }
    }

    
    _handleKeyPressBra(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.sizingRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }   
    }

    handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
    }

    handleSubmit = evt => {
        if (!this.canBeSubmitted()) {
          evt.preventDefault();
          return;
        }
        const { name, email, passwordOne } = this.state;
        var measurements = this.USsizeArray[this.state.size.toString()];
        var height = (parseInt(this.state.heightft,10) * 12) + parseInt(this.state.heightin,10);
        var newBust = parseInt(this.state.bra.slice(0, 2), 10) + this.braToBust[this.state.bra.substr(2)];
        var newHips = measurements.hips + this.state.modifyHips; 
        var newWaist = measurements.waist + this.state.modifyWaist; 
        
        this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
            // Create a user in your Firebase realtime database
            return this.props.firebase
            .user(authUser.user.uid)
            .set({
                email: email,
                name: name,
                height: height,
                waist: newWaist,
                bust: newBust,
                hips: newHips,
                size: this.state.size,
                bra: this.state.bra
            });
        })
        .then(authUser => {
            this.setState({
                height: height,
                bust: newBust,
                hips: newHips,
                waist: newWaist
            }, () => {
                this.props.history.push({
                    pathname: '/results',
                    state: {
                        height: this.state.height,
                        waist: this.state.waist,
                        hips: this.state.hips,
                        bra: this.state.bra,
                        bust: this.state.bust,
                        size: this.state.size
                    }
                });
            });
        })
        .catch(error => {
            this.setState({ error });
            console.log(error);
        });

            evt.preventDefault();
      };
    
      canBeSubmitted() {
        const errors = validate(this.state.heightft, this.state.heightin, this.state.size, this.state.bra, this.state.name, this.state.email, this.state.passwordOne, this.state.passwordTwo);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      }  

    render() {
        //TODO -- OK button and autoscroll, page indicators of question, not allowed to scroll until enter info
        //Detect when user clicks off
        //On mobile scroll to middle of page
        //don't allow invalid inputs
        const {
            name,
            email,
            passwordOne,
            passwordTwo,
          } = this.state;
      
        const errors = validate(this.state.heightft, this.state.heightin, this.state.size, this.state.bra, this.state.name, this.state.email, this.state.passwordOne, this.state.passwordTwo);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];    
            return hasError ? shouldShow : false;
        };
        return (
            <div className="signup-parent">
              <div className="signup-container-first signup-child">
                <div className="signup-signup-content">
                  <form>
                    <label className="signup-signup-label">
                      My name is
                      <input
                        name="name"
                        type="text"
                        ref="name"
                        style={{width: 400}}
                        onBlur={this.handleBlur('name')}
                        className={shouldMarkError('name') ? "signup-input-error" : "signup-input"}
                        onKeyPress={this._handleKeyPressSize}
                        onChange={this.handleInputChange} />
                        .
                        <p className={shouldMarkError('name') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter your full name.</i></p>
                    </label>
                  </form>
                </div>
              </div>
            <div className="signup-container-second signup-child">
              <div className="signup-signup-content">
                <form>
                  <label className="signup-signup-label">
                    I am
                    <input
                      name="heightft"
                      type="number"
                      onBlur={this.handleBlur('heightft')}
                      className={shouldMarkError('heightft') ? "signup-input-error" : "signup-input"}
                      onKeyPress={this._handleKeyPressHeightFt}
                      onChange={this.handleInputChange} />
                    ft, 
                    <input
                      name="heightin"
                      type="number"
                      onBlur={this.handleBlur('heightin')}
                      className={shouldMarkError('heightin') ? "signup-input-error" : "signup-input"}
                      onKeyPress={this._handleKeyPressHeightIn}
                      ref="heightin"
                      onChange={this.handleInputChange} />
                    inches tall.
                    <p className={ (shouldMarkError('heightin') || shouldMarkError('heightft')) ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter a valid height, e.g. 5 ft, 4 in etc.</i></p>
                  </label>
                </form>
              </div>
          </div>
          <div className="signup-container-third signup-child">
            <div className="signup-signup-content">
              <form>
                <label className="signup-signup-label">
                  I normally wear US size
                  <input
                    name="size"
                    type="number"
                    ref="size"
                    onBlur={this.handleBlur('size')}
                    className={shouldMarkError('size') ? "signup-input-error" : "signup-input"}
                    onKeyPress={this._handleKeyPressSize}
                    onChange={this.handleInputChange} />
                    .
                    <p className={shouldMarkError('size') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter a numeric US size, e.g. 0, 2, 4, 6 etc.</i></p>
                </label>
              </form>
            </div>
          </div>
          <div className="signup-container-fourth signup-child">
            <div className="signup-signup-content">
                <form>
                  <label className="signup-signup-label">
                    My bra size is
                    <input
                      name="bra"
                      type="text"
                      ref="bra"
                      onBlur={this.handleBlur('bra')}
                      onKeyPress={this._handleKeyPressBra}
                      className={shouldMarkError('bra') ? "signup-input-error" : "signup-input"}
                      style={{width: 150}}
                      onChange={this.handleInputChange} />
                      <p className={shouldMarkError('bra') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter a valid bra size, e.g. 32B, 34DD etc.</i></p>
                  </label>
                </form>
              </div>
          </div>

          <div className="signup-container-fifth signup-child" ref={this.sizingRef}>
            <div className="signup-signup-content">
              <p className="signup-signup-label final-signup-label">On me, size {this.state.size} is generally:</p>
              <div className="signup-size-box" >
                <div className="signup-selector" style={{display:'block'}}>
                    <p className="signup-desc">WAIST</p>
                    <div className="signup-btn-group" >
                    <button className={this.state.modifyWaist == 2 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyWaist(2)}>Small</button>
                    <button className={this.state.modifyWaist == 1 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyWaist(1)}>Tight</button>
                    <button className={this.state.modifyWaist == 0 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyWaist(0)}>Perfect</button>
                    <button className={this.state.modifyWaist == -1 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyWaist(-1)}>Loose</button>
                    <button className={this.state.modifyWaist == -2 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyWaist(-2)}>Large</button>
                    </div>
                </div>
                <div className="signup-selector">
                    <p className="signup-desc">HIPS</p>
                    <div className="signup-btn-group">
                    <button className={this.state.modifyHips == 2 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyHips(2)}>Small</button>
                    <button className={this.state.modifyHips == 1 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyHips(1)}>Tight</button>
                    <button className={this.state.modifyHips == 0 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyHips(0)}>Perfect</button>
                    <button className={this.state.modifyHips == -1 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyHips(-1)}>Loose</button>
                    <button className={this.state.modifyHips == -2 ? 'signup-size-buttons-selected' : 'signup-size-buttons'} onClick={() => this.modifyHips(-2)}>Large</button>
                    </div>
                </div>
              </div>
            </div>
            </div>
            <div className="signup-container-sixth signup-child" style={{flexDirection: 'column'}}>
              <div className="signup-signup-content">
                <form>
                  <div className="signup-form-div">
                  <label className="signup-signup-label">
                    My email is 
                    <input
                    name="email"
                    value={email}
                    onBlur={this.handleBlur('email')}
                    ref="email"
                    style={{width: 450, fontSize: '1.0em'}}
                    onChange={this.handleInputChange}
                    onKeyPress={this._handleKeyPressSize}
                    type="text"
                    className={shouldMarkError('email') ? "signup-input-error" : "signup-input"}
                    />
                    
                    <p className={shouldMarkError('email') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter a valid email address.</i></p>
                  </label>
                  </div>
                  <div className="signup-form-div">
                  <label className="signup-signup-label">
                    Password:
                      <input
                      name="passwordOne"
                      value={passwordOne}
                      style={{width: 450, fontSize: '1.0em'}}
                      onBlur={this.handleBlur('passwordOne')}
                      onChange={this.handleInputChange}
                      onKeyPress={this._handleKeyPressSize}
                      type="password"
                      ref="passwordOne"
                      className={shouldMarkError('passwordOne') ? "signup-input-error" : "signup-input"}
                      />
                      <p className={shouldMarkError('passwordOne') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Please enter a password.</i></p>
                  </label>
                  </div>
                  <div className="signup-form-div">
                  <label className="signup-signup-label">
                    Re-enter password:
                      <input
                      name="passwordTwo"
                      value={passwordTwo}
                      style={{width: 450, fontSize: '1.0em'}}
                      onChange={this.handleInputChange}
                      onBlur={this.handleBlur('passwordTwo')}
                      onKeyPress={this._handleKeyPressSize}
                      type="password"
                      ref="passwordtwo"
                      className={shouldMarkError('passwordTwo') ? "signup-input-error" : "signup-input"}
                      />
                      <p className={shouldMarkError('passwordTwo') ? "signup-error-msg" : "hide-signup-error-msg"}><i>Oops, your passwords don't match. Try again.</i></p>
                  </label>
                  </div>
                </form>
              </div>

            <div style={{marginTop: 100}}>
                <button className={isDisabled ? "signup-results-btn-disabled" : "signup-results-btn"} onClick={this.handleSubmit} disabled={isDisabled}>
                    Join the fam
                    <img src={whiteArrow} className="signup-whitearrow"/>
                </button>
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