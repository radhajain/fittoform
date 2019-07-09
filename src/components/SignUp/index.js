import React, { Component } from 'react';
import './SignUp.css';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Link, withRouter } from 'react-router-dom';
import whiteArrow from '../../assets/images/white-arrow.png';
import whiteTick from '../../assets/images/white-tick.png';
import dress1 from '../../assets/images/howitworks-1.svg';
import dress2 from '../../assets/images/howitworks-2.svg';
import dress3 from '../../assets/images/howitworks-3.svg';
import dress4 from '../../assets/images/howitworks-4.svg';
import dress5 from '../../assets/images/howitworks-5.svg';
import dress6 from '../../assets/images/howitworks-6.svg';
import save from '../../assets/images/signup-save.svg';

const SignUpPage = () => (
  <div>
    <SignUpForm />
  </div>
);

function validate(heightft, heightin, size, bra, name, email, passwordOne, passwordTwo) {
  var braRe = /[0-9][0-9][a-gA-G][a-gA-G]?[a-gA-G]?/;
  var emailRe = /^.+@.+\..+$/;
  heightft = parseInt(heightft, 10);
  heightin = parseInt(heightin, 10);
  size = parseInt(size, 10);
  return {
    heightft: heightft.length === 0 || !Number.isInteger(heightft) || heightft < 4 || heightft > 6,
    heightin: heightin.length === 0 || !Number.isInteger(heightin) || heightin < 0 || heightin > 12,
    size: size.length === 0 || !Number.isInteger(size) || size % 2 === 1 || size > 16,
    bra: bra.length === 0 || !bra.match(braRe),
    name: name.length === 0,
    email: email.length === 0 || !email.match(emailRe),
    passwordOne: passwordOne.length === 0,
    passwordTwo: passwordTwo.length === 0 || passwordOne !== passwordTwo
  };
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.USsizeArray = {
      '00': {
        waist: 24,
        hips: 34,
        bust: 32
      },
      '0': {
        waist: 24,
        hips: 35,
        bust: 33
      },
      '2': {
        waist: 26,
        hips: 37,
        bust: 34
      },
      '4': {
        waist: 27,
        hips: 38,
        bust: 35
      },
      '6': {
        waist: 28,
        hips: 39,
        bust: 36
      },
      '8': {
        waist: 29,
        hips: 40,
        bust: 37
      },
      '10': {
        waist: 30,
        hips: 41,
        bust: 38.5
      },
      '12': {
        waist: 31,
        hips: 42,
        bust: 40
      },
      '14': {
        waist: 33,
        hips: 44,
        bust: 42
      },
      '16': {
        waist: 34,
        hips: 45,
        bust: 44
      }
    };
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
        name: false,
        heightft: false,
        heightin: false,
        size: false,
        bra: false,
        email: false,
        passwordOne: false,
        passwordTwo: false
      },
      focused: {
        name: false,
        heightft: false,
        heightin: false,
        size: false,
        bra: false,
        email: false,
        passwordOne: false,
        passwordTwo: false
      }
    };
    this.braToBust = {
      AA: 1,
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      DD: 5,
      E: 5,
      DDD: 6,
      EE: 7,
      F: 7,
      G: 8
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.modifyWaist = this.modifyWaist.bind(this);
    this.modifyHips = this.modifyHips.bind(this);
    this._handleKeyPressHeightFt = this._handleKeyPressHeightFt.bind(this);
    this._handleKeyPressHeightIn = this._handleKeyPressHeightIn.bind(this);
    this._handleKeyPressSize = this._handleKeyPressSize.bind(this);
    this._handleKeyPressName = this._handleKeyPressName.bind(this);
    this._handleKeyPressBra = this._handleKeyPressBra.bind(this);
    this._handleKeyPressEmail = this._handleKeyPressEmail.bind(this);
    this._handleKeyPressPw1 = this._handleKeyPressPw1.bind(this);
    this._handleKeyPressPw2 = this._handleKeyPressPw2.bind(this);
    this.goToSize = this.goToSize.bind(this);
    this.goToHeight = this.goToHeight.bind(this);
    this.goToBra = this.goToBra.bind(this);
    this.goToSize = this.goToSizing.bind(this);
    this.goToAccount = this.goToAccount.bind(this);
    this.getErrorObj = this.getErrorObj.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sizingRef = React.createRef();
    this.sizeRef = React.createRef();
    this.braRef = React.createRef();
    this.accountRef = React.createRef();
    this.heightRef = React.createRef();
  }

  modifyWaist(val) {
    this.setState({ modifyWaist: val });
  }

  modifyHips(val) {
    this.setState({ modifyHips: val });
  }

  goToHeight(e) {
    e.preventDefault();
    this.heightRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    this.refs.heightftinput.focus();
  }

  goToSize(e) {
    e.preventDefault();
    this.sizeRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    this.refs.sizeinput.focus();
  }

  goToBra(e) {
    e.preventDefault();
    this.braRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    this.refs.brainput.focus();
  }

  goToSizing(e) {
    e.preventDefault();
    this.sizingRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  goToAccount(e) {
    e.preventDefault();
    this.accountRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  _handleKeyPressHeightFt(e) {
    this.setState({
      touched: { ...this.state.touched, heightft: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['heightft']) {
        this.refs.heightininput.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, heightft: true }
        });
      }
    }
  }

  _handleKeyPressHeightIn(e) {
    console.log('key pressed');
    this.setState({
      touched: { ...this.state.touched, heightin: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['heightin']) {
        this.sizeRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        this.refs.sizeinput.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, heightin: true }
        });
      }
    }
  }

  _handleKeyPressSize(e) {
    this.setState({
      touched: { ...this.state.touched, size: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['size']) {
        this.braRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        this.refs.brainput.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, size: true }
        });
      }
    }
  }

  _handleKeyPressBra(e) {
    this.setState({
      touched: { ...this.state.touched, bra: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['bra']) {
        this.sizingRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      } else {
        this.setState({
          focused: { ...this.state.focused, bra: true }
        });
      }
    }
  }

  _handleKeyPressName(e) {
    this.setState({
      touched: { ...this.state.touched, name: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['name']) {
        this.heightRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        this.refs.heightftinput.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, name: true }
        });
      }
    }
  }

  _handleKeyPressEmail(e) {
    this.setState({
      touched: { ...this.state.touched, email: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['email']) {
        this.refs.passwordOne.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, email: true }
        });
      }
    }
  }

  _handleKeyPressPw1(e) {
    this.setState({
      touched: { ...this.state.touched, passwordOne: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['passwordOne']) {
        this.refs.passwordTwo.focus();
      } else {
        this.setState({
          focused: { ...this.state.focused, passwordOne: true }
        });
      }
    }
  }

  _handleKeyPressPw2(e) {
    this.setState({
      touched: { ...this.state.touched, passwordTwo: true }
    });
    if (e.key === 'Enter') {
      e.preventDefault();
      var errors = this.getErrorObj();
      if (!errors['passwordOne']) {
        this.handleSubmit(e);
      } else {
        this.setState({
          focused: { ...this.state.focused, passwordTwo: true }
        });
      }
    }
  }

  handleBlur = field => evt => {
    this.setState({
      focused: { ...this.state.focused, [field]: true }
    });
  };

  handleSubmit = evt => {
    if (!this.canBeSubmitted()) {
      evt.preventDefault();
      return;
    }
    console.log(this.state);
    console.log(this.getErrorObj());
    const { name, email, passwordOne } = this.state;
    var measurements = this.USsizeArray[this.state.size.toString()];
    var height = parseInt(this.state.heightft, 10) * 12 + parseInt(this.state.heightin, 10);
    var newBust =
      parseInt(this.state.bra.slice(0, 2), 10) + this.braToBust[this.state.bra.substr(2)];
    var newHips = measurements.hips + this.state.modifyHips;
    var newWaist = measurements.waist + this.state.modifyWaist;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
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
        this.setState(
          {
            height: height,
            bust: newBust,
            hips: newHips,
            waist: newWaist
          },
          () => {
            this.props.history.push({
              pathname: '/results',
              state: {
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bra: this.state.bra,
                bust: this.state.bust,
                size: this.state.size,
                name: this.state.name
              }
            });
          }
        );
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });

    evt.preventDefault();
  };

  canBeSubmitted() {
    const errors = validate(
      this.state.heightft,
      this.state.heightin,
      this.state.size,
      this.state.bra,
      this.state.name,
      this.state.email,
      this.state.passwordOne,
      this.state.passwordTwo
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  getErrorObj() {
    const errors = validate(
      this.state.heightft,
      this.state.heightin,
      this.state.size,
      this.state.bra,
      this.state.name,
      this.state.email,
      this.state.passwordOne,
      this.state.passwordTwo
    );
    return errors;
  }

  render() {
    //TODO -- OK button and autoscroll, page indicators of question, not allowed to scroll until enter info
    //Detect when user clicks off
    //On mobile scroll to middle of page
    //don't allow invalid inputs
    const { name, email, passwordOne, passwordTwo } = this.state;

    const errors = validate(
      this.state.heightft,
      this.state.heightin,
      this.state.size,
      this.state.bra,
      this.state.name,
      this.state.email,
      this.state.passwordOne,
      this.state.passwordTwo
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    const shouldMarkError = field => {
      const hasError = errors[field];
      const shouldShow = this.state.focused[field];
      return hasError ? shouldShow : false;
    };
    const shouldShowNext = field => {
      var isTouched = this.state.touched[field];
      var hasError = errors[field];
      if (field === 'height') {
        isTouched = this.state.touched['heightft'] && this.state.touched['heightin'];
        hasError = errors['heightft'] || errors['heightin'];
      }
      return hasError ? false : isTouched;
    };
    return (
      <div className="signup-parent">
        {/* <div className="signup-container-intro signup-child">
                <div className="signup-benefits-inner">
                    <p className="signup-benefits-title">Why join the Ftf fam?</p>
                    <hr />
                    <div className="signup-benefits-steps">
                        <div className="signup-benefits-box">
                        <div className="signup-benefits-graphic">
                          <div className="howitworks-child-dressgrid">
                            <img src={dress1} className="signup-dress-icon"/>
                            <img src={dress2} className="signup-dress-icon"/>
                            <img src={dress3} className="signup-dress-icon hiw-dress3"/>
                            <img src={dress4} className="signup-dress-icon"/>
                            <img src={dress5} className="signup-dress-icon"/>
                            <img src={dress6} className="signup-dress-icon hiw-dress6"/>
                          </div>
                          </div>
                            <p className="signup-benefits-desc">Be the first to hear about dresses recommended for your size</p>
                        </div>
                        <div className="signup-benefits-box">
                            <div className="signup-benefits-graphic">
                              <div className= "signup-benefits-waist-box">
                                <p className="signup-benefits-waist-title">WAIST</p>
                                <p className="signup-benefits-waist">27<span style={{fontWeight: 'lighter', fontSize: 40}}>I</span></p>
                              </div>
                            </div>
                            <p className="signup-benefits-desc">Edit your measurements to find the perfect fit</p>
                        </div>
                        <div className="signup-benefits-box">
                          <div className="signup-benefits-graphic">
                              <img src={save} style={{maxHeight: '200px'}} />
                          </div>
                          <p className="signup-benefits-desc">Save items you love to come back to later</p>
                        </div>
                    </div>
                  </div>
              </div> */}
        <div className="signup-container-first signup-child">
          <div className="signup-signup-content">
            <form>
              <label className="signup-signup-label">
                My name is
                <input
                  name="name"
                  type="text"
                  ref="name"
                  onBlur={this.handleBlur('name')}
                  className={
                    shouldMarkError('name')
                      ? 'signup-input-error signup-name'
                      : 'signup-input signup-name'
                  }
                  onKeyPress={this._handleKeyPressName}
                  onChange={this.handleInputChange}
                />
                .
                <p
                  className={shouldMarkError('name') ? 'signup-error-msg' : 'hide-signup-error-msg'}
                >
                  <i>Please enter your full name.</i>
                </p>
              </label>
              <div className={shouldShowNext('name') ? 'signup-nextDiv' : 'signup-nextDiv-hide'}>
                <button className="signup-ok-btn" onClick={this.goToHeight}>
                  <div className="signup-ok-flexWrapper">
                    <span className="signup-ok-text">OK</span>
                    <img src={whiteTick} style={{ width: 16, marginLeft: 8 }} />
                  </div>
                </button>
                <p className="signup-pressEnter">
                  <i>
                    press <b>ENTER</b>
                  </i>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="signup-container-second signup-child" ref={this.heightRef}>
          <div className="signup-signup-content">
            <form>
              <label className="signup-signup-label">
                I am
                <input
                  name="heightft"
                  type="number"
                  ref="heightftinput"
                  onBlur={this.handleBlur('heightft')}
                  className={shouldMarkError('heightft') ? 'signup-input-error' : 'signup-input'}
                  onKeyPress={this._handleKeyPressHeightFt}
                  onChange={this.handleInputChange}
                />
                ft,
                <input
                  name="heightin"
                  type="number"
                  onBlur={this.handleBlur('heightin')}
                  className={shouldMarkError('heightin') ? 'signup-input-error' : 'signup-input'}
                  onKeyPress={this._handleKeyPressHeightIn}
                  ref="heightininput"
                  onChange={this.handleInputChange}
                />
                inches tall.
                <p
                  className={
                    shouldMarkError('heightin') || shouldMarkError('heightft')
                      ? 'signup-error-msg'
                      : 'hide-signup-error-msg'
                  }
                >
                  <i>Please enter a valid height, e.g. 5 ft, 4 in etc.</i>
                </p>
              </label>
              <div className={shouldShowNext('height') ? 'signup-nextDiv' : 'signup-nextDiv-hide'}>
                <button className="signup-ok-btn" onClick={this.goToSize}>
                  <div className="signup-ok-flexWrapper">
                    <span className="signup-ok-text">OK</span>
                    <img src={whiteTick} style={{ width: 16, marginLeft: 8 }} />
                  </div>
                </button>
                <p className="signup-pressEnter">
                  <i>
                    press <b>ENTER</b>
                  </i>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="signup-container-third signup-child" ref={this.sizeRef}>
          <div className="signup-signup-content">
            <form>
              <label className="signup-signup-label">
                I normally wear US size
                <input
                  name="size"
                  type="number"
                  ref="sizeinput"
                  onBlur={this.handleBlur('size')}
                  className={shouldMarkError('size') ? 'signup-input-error' : 'signup-input'}
                  onKeyPress={this._handleKeyPressSize}
                  onChange={this.handleInputChange}
                />
                .
                <p
                  className={shouldMarkError('size') ? 'signup-error-msg' : 'hide-signup-error-msg'}
                >
                  <i>Please enter a numeric US size, e.g. 0, 2, 4, 6 etc.</i>
                </p>
              </label>
              <div className={shouldShowNext('size') ? 'signup-nextDiv' : 'signup-nextDiv-hide'}>
                <button className="signup-ok-btn" onClick={this.goToBra}>
                  <div className="signup-ok-flexWrapper">
                    <span className="signup-ok-text">OK</span>
                    <img src={whiteTick} style={{ width: 16, marginLeft: 8 }} />
                  </div>
                </button>
                <p className="signup-pressEnter">
                  <i>
                    press <b>ENTER</b>
                  </i>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="signup-container-fourth signup-child" ref={this.braRef}>
          <div className="signup-signup-content">
            <form>
              <label className="signup-signup-label">
                My bra size is
                <input
                  name="bra"
                  type="text"
                  ref="brainput"
                  onBlur={this.handleBlur('bra')}
                  onKeyPress={this._handleKeyPressBra}
                  className={shouldMarkError('bra') ? 'signup-input-error' : 'signup-input'}
                  style={{ width: 150 }}
                  onChange={this.handleInputChange}
                />
                .
                <p
                  className={shouldMarkError('bra') ? 'signup-error-msg' : 'hide-signup-error-msg'}
                >
                  <i>Please enter a valid bra size, e.g. 32B, 34DD etc.</i>
                </p>
              </label>
              <div className={shouldShowNext('bra') ? 'signup-nextDiv' : 'signup-nextDiv-hide'}>
                <button className="signup-ok-btn" onClick={this.goToSizing}>
                  <div className="signup-ok-flexWrapper">
                    <span className="signup-ok-text">OK</span>
                    <img src={whiteTick} style={{ width: 16, marginLeft: 8 }} />
                  </div>
                </button>
                <p className="signup-pressEnter">
                  <i>
                    press <b>ENTER</b>
                  </i>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="signup-container-fifth signup-child" ref={this.sizingRef}>
          <div className="signup-signup-content">
            <p className="signup-signup-label final-signup-label">
              On me, size {this.state.size} is generally:
            </p>
            <div className="signup-size-box">
              <div className="signup-selector" style={{ display: 'block' }}>
                <p className="signup-desc">WAIST</p>
                <div className="signup-btn-group">
                  <button
                    className={
                      this.state.modifyWaist == 2
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyWaist(2)}
                  >
                    Tight
                  </button>
                  <button
                    className={
                      this.state.modifyWaist == 1
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyWaist(1)}
                  >
                    A lil snug
                  </button>
                  <button
                    className={
                      this.state.modifyWaist == 0
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyWaist(0)}
                  >
                    Perfect
                  </button>
                  <button
                    className={
                      this.state.modifyWaist == -1
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyWaist(-1)}
                  >
                    A lil loose
                  </button>
                  <button
                    className={
                      this.state.modifyWaist == -2
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyWaist(-2)}
                  >
                    Extra room
                  </button>
                </div>
              </div>
              <div className="signup-selector">
                <p className="signup-desc">HIPS</p>
                <div className="signup-btn-group">
                  <button
                    className={
                      this.state.modifyHips == 2
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyHips(2)}
                  >
                    Tight
                  </button>
                  <button
                    className={
                      this.state.modifyHips == 1
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyHips(1)}
                  >
                    A lil snug
                  </button>
                  <button
                    className={
                      this.state.modifyHips == 0
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyHips(0)}
                  >
                    Perfect
                  </button>
                  <button
                    className={
                      this.state.modifyHips == -1
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyHips(-1)}
                  >
                    A lil loose
                  </button>
                  <button
                    className={
                      this.state.modifyHips == -2
                        ? 'signup-size-buttons-selected'
                        : 'signup-size-buttons'
                    }
                    onClick={() => this.modifyHips(-2)}
                  >
                    Extra room
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="signup-nextDiv" style={{ marginTop: 50 }}>
            <button className="signup-ok-btn" onClick={this.goToAccount}>
              <div className="signup-ok-flexWrapper">
                <span className="signup-ok-text">OK</span>
                <img src={whiteTick} style={{ width: 16, marginLeft: 8 }} />
              </div>
            </button>
          </div>
        </div>
        <div
          className="signup-container-sixth signup-child"
          style={{ flexDirection: 'column' }}
          ref={this.accountRef}
        >
          <div className="signup-signup-content">
            <form>
              <div className="signup-form-div">
                <label className="signup-signup-label signup-label-long">
                  My email is
                  <input
                    name="email"
                    value={email}
                    onBlur={this.handleBlur('email')}
                    ref="emailinput"
                    onChange={this.handleInputChange}
                    onKeyPress={this._handleKeyPressEmail}
                    type="text"
                    className={
                      shouldMarkError('email')
                        ? 'signup-input-error signup-long-input'
                        : 'signup-input signup-long-input'
                    }
                  />
                  <p
                    className={
                      shouldMarkError('email') ? 'signup-error-msg' : 'hide-signup-error-msg'
                    }
                  >
                    <i>Please enter a valid email address.</i>
                  </p>
                </label>
              </div>
              <div className="signup-form-div">
                <label className="signup-signup-label signup-label-long">
                  Password:
                  <input
                    name="passwordOne"
                    value={passwordOne}
                    onBlur={this.handleBlur('passwordOne')}
                    onChange={this.handleInputChange}
                    onKeyPress={this._handleKeyPressPw2}
                    type="password"
                    ref="passwordOneInput"
                    className={
                      shouldMarkError('passwordOne')
                        ? 'signup-input-error signup-long-input'
                        : 'signup-input signup-long-input'
                    }
                  />
                  <p
                    className={
                      shouldMarkError('passwordOne') ? 'signup-error-msg' : 'hide-signup-error-msg'
                    }
                  >
                    <i>Please enter a password.</i>
                  </p>
                </label>
              </div>
              <div className="signup-form-div">
                <label className="signup-signup-label signup-label-long">
                  Re-enter password:
                  <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur('passwordTwo')}
                    onKeyPress={this._handleKeyPressPw2}
                    type="password"
                    ref="passwordTwoInput"
                    className={
                      shouldMarkError('passwordTwo')
                        ? 'signup-input-error signup-long-input'
                        : 'signup-input signup-long-input'
                    }
                  />
                  <p
                    className={
                      shouldMarkError('passwordTwo') ? 'signup-error-msg' : 'hide-signup-error-msg'
                    }
                  >
                    <i>Oops, your passwords don't match. Try again.</i>
                  </p>
                  {this.state.error && (
                    <p className={'signup-error-msg'}>
                      <i>{this.state.error.message}</i>
                    </p>
                  )}
                </label>
              </div>
            </form>
          </div>

          <div style={{ marginTop: 100 }}>
            <button
              className={isDisabled ? 'signup-results-btn-disabled' : 'signup-results-btn'}
              onClick={this.handleSubmit}
              disabled={isDisabled}
            >
              Join the fam
              <img
                src={whiteArrow}
                className="signup-whitearrow"
                style={{ width: 25, paddingLeft: 15 }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p className="message">
    Not registered? <Link to={ROUTES.SIGN_UP}>Create an account</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
