import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import WhiteArrow from '../../assets/images/white-arrow.png';
import pg2 from '../../assets/images/landing-p2.png';
import pg2SM from '../../assets/images/landing-2-sm.png';
import WrapImg from '../../assets/images/wrap-lady.png';
import firebase from 'firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import { FooterLarge } from '../Footer';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      error: null,
      user: {
        name: '',
        height: '',
        waist: '',
        hips: '',
        bust: '',
        size: '',
        bra: ''
      }
    };
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase
      .database()
      .ref('users')
      .child(`${uid}`);
    return UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      var userInfo = {
        bra: user.bra,
        bust: user.bust,
        name: user.name,
        height: user.height,
        hips: user.hips,
        size: user.size,
        waist: user.waist,
        id: uid
      };
      return userInfo;
    });
  }

  authlistener() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        this.getUserData(authUser.uid).then(userInfo => {
          this.setState(
            {
              user: userInfo
            },
            () => {
              console.log(this.state);
              this.props.history.push({
                pathname: '/results',
                state: {
                  height: this.state.user.height,
                  waist: this.state.user.waist,
                  hips: this.state.user.hips,
                  bra: this.state.user.bra,
                  bust: this.state.user.bust,
                  size: this.state.user.size,
                  name: this.state.user.name
                }
              });
            }
          );
        });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    if (this._isMounted) {
      this.authlistener();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  render() {
    return (
      <div className="landing-parent">
        <div className="landing-fakeNav" />
        <div className="landing-child">
          <div className="landing-container-inner">
            <div className="landing-intro-hero">
              <div className="landing-title-wrapper">
                <p className="landing-title">We try on dresses so you don't have to.</p>
              </div>
              <div className="landing-intro-img"></div>
            </div>
            <div className="landing-intro-footer">
              <div className="landing-intro-footer-inner">
                <p className="landing-desc">
                  It's hard to know what fits well while shopping online. We show you a curated set
                  of dresses, recommended by real women with the same measurements as you. Buy with
                  confidence, every time.
                </p>
                <div className="landing-callToAction-wrapper">
                  <Link to="/search">
                    <button className="landing-callToAction">Get Started</button>
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className="landing-howitworks-outer">
              <div className="landing-howitworks-inner">
                <p
                  className="serif"
                  style={{ color: 'white', textAlign: 'center', fontSize: '1.75em' }}
                >
                  How it works
                </p>
                <hr />
                <div className="landing-howitworks-steps">
                  <div className="landing-howitworks-box">
                    <p className="landing-howitworks-title">1. Tell us your size</p>
                    <p className="landing-howitworks-desc">
                      Tell us what sizes you wear and how they normally fit
                    </p>
                  </div>
                  <div className="landing-howitworks-box">
                    <p className="landing-howitworks-title">2. Browse curations</p>
                    <p className="landing-howitworks-desc">
                      Get personalized recommendations by women with the same measurements as you
                    </p>
                  </div>
                  <div className="landing-howitworks-box">
                    <p className="landing-howitworks-title">3. Buy with confidence</p>
                    <p className="landing-howitworks-desc">
                      Read reviews from women with your measurements who have tried each dress on
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="landing-child landing-second-page">
          <div className="landing-container-inner">
            <div className="landing-2-col-container">
              <div className="landing-2-leftCol">
                <div className="landing-2-content">
                  <p className="landing-second-title">Clothes look best when they fit.</p>
                  <p className="landing-second-desc">
                    You look like a million bucks when the dress fits just right. There’s a perfect
                    dress for everyone, and we’re here to help you find it.
                  </p>
                </div>
              </div>
              <div className="landing-2-rightCol">
                {/* <img src={pg2} className="landing-2-rightImg"/> */}
              </div>
            </div>
          </div>
        </div>
        <div className="landing-child landing-third-page">
          <img src={WrapImg} className="landing-third-img" />

          <div
            className="landing-container-inner"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              height: '80%',
              zIndex: 100,
              position: 'relative'
            }}
          >
            <div className="landing-third-content">
              <p className="landing-third-title">Women like you have tried on these dresses.</p>
              <p className="landing-third-desc">
                Brands and even items can have inconsistent sizing. Every piece on our site has been
                tried on by real women who are the same size as you. We show you a curated selection
                of dresses that we know will make you look fantastic.{' '}
              </p>
            </div>
            <div>
              <img
                src="https://fittoform-landing.s3.amazonaws.com/wrap-sm%402x.jpg"
                className="landing-third-sm"
              />
            </div>
          </div>
        </div>
        <div className="landing-child landing-fourth-page">
          <div className="landing-container-inner" style={{ position: 'relative' }}>
            <div className="landing-fourth-img-rows">
              <div className="landing-fourth-flex-grid">
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-1%402x.jpg"
                  className="landing-fourth-img dress1"
                />
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-2%402x.jpg"
                  className="landing-fourth-img dress2"
                />
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-3%402x.jpg"
                  className="landing-fourth-img dress3"
                />
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-4%402x.jpg"
                  className="landing-fourth-img dress4"
                />
              </div>
              <div
                className="landing-fourth-flex-grid landing-fourth-row2"
                style={{ float: 'right', marginTop: 50 }}
              >
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-5%402x.jpg"
                  className="landing-fourth-img2 dress5"
                />
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-6%402x.jpg"
                  className="landing-fourth-img2 dress6"
                />
                <img
                  src="https://fittoform-landing.s3.amazonaws.com/landing-4-7%402x.jpg"
                  className="landing-fourth-img2 dress7"
                />
              </div>
            </div>
            <div className="landing-fourth-content">
              <p className="landing-fourth-title">You're the stylist.</p>
              <p className="landing-fourth-desc">
                No commitments, no subscriptions, no fees. We give you the tools to find the pieces
                and styles you want - and the knowledge that they will flatter you.{' '}
              </p>
              <Link to="/search">
                <button className="landing-callToAction">Try it out</button>
              </Link>
            </div>
          </div>
        </div>
        <FooterLarge />
      </div>
    );
  }
}

export default Landing;
