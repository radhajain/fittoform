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
import grid from '../../assets/images/landingpage_grid.jpg';

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
          <div className="landing-container-inner-85">
            <div className="landing-intro-hero">
              <div className="landing-title-wrapper">
                <p className="landing-title">We try on dresses so you don't have to.</p>
              </div>
              <div className="landing-img-wrapper">
                <div>
                  <img
                    src="https://fittoform-landing.s3.amazonaws.com/orangedress_50p_progressive.jpg"
                    className="landing-img"
                  />
                </div>
              </div>
            </div>
            <div className="landing-intro-footer landing-intro-footer-btn-top">
              <div className="landing-intro-footer-inner">
                <p className="landing-desc">
                  It's hard to know what fits well while shopping online. We show you a curated set
                  of dresses, recommended by real women with the same measurements as you. Buy with
                  confidence, every time.
                </p>
                <div className="landing-callToAction-wrapper">
                  <Link to="/search">
                    <button className="landing-callToAction landing-btn-top">
                      <div className="landing-btn-flexWrapper">Get Started</div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* PAGE 2 */}
        <div className="landing-child landing-child-1" style={{ display: 'block' }}>
          <div className="landing-2-header"></div>
          <div className="landing-container-inner-60 landing-2-container">
            <div className="landing-2-col-container">
              <div className="landing-2-leftCol">
                <p className="landing-title landing-2-title">How it works</p>
              </div>
              <div className="landing-2-rightCol">
                <div className="landing-howitworks-steps">
                  <div className="landing-howitworks-box landing-howitworks-box-1">
                    <p className="landing-desc">Tell us your size</p>
                    <p className="landing-howitworks-desc">
                      Tell us what sizes you wear and how they normally fit
                    </p>
                  </div>
                  <div className="landing-howitworks-box">
                    <p className="landing-desc">Browse curations</p>
                    <p className="landing-howitworks-desc">
                      Get personalized recommendations by women with the same measurements as you
                    </p>
                  </div>
                  <div className="landing-howitworks-box">
                    <p className="landing-desc">Buy with confidence</p>
                    <p className="landing-howitworks-desc">
                      Read reviews from women with your measurements who have tried each dress on
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* PAGE 3 */}
        <div className="landing-child landing-third-page">
          <div className="landing-container-inner-60 landing-3-container">
            <img src={grid} className="landing-3-img" />
          </div>
        </div>
        {/* PAGE 4 */}
        <div className="landing-child landing-fourth-page">
          <div className="landing-container-inner-60 landing-4-container">
            <div className="landing-4-content">
              <div className="landing-4-leftCol">
                <p className="landing-title landing-4-title">Clothes look best when they fit. </p>
              </div>
              <div className="landing-4-rightCol">
                <p className="landing-desc landing-desc-4">
                  There's a perfect dress for everyone, and we're here to help you find it.
                </p>
              </div>
            </div>
          </div>
          <div className="landing-4-footer"></div>
        </div>
        {/* PAGE 5 */}
        <div className="landing-child landing-fifth-page">
          <div className="landing-container-inner-85">
            <div className="landing-intro-hero">
              <div className="landing-title-wrapper">
                <p className="landing-title landing-5-title">
                  Women with your body have tried on these dresses.
                </p>
              </div>
              <div className="landing-img-wrapper">
                <div>
                  <img
                    src="https://fittoform-landing.s3.amazonaws.com/dresses_45p_progressive.jpg"
                    className="landing-img"
                  />
                </div>
              </div>
            </div>
            <div className="landing-intro-footer">
              <div className="landing-intro-footer-inner">
                <p className="landing-desc">
                  Brands and even items can have inconsistent sizing. Every piece on our site has
                  been tried on by women with your measurements. Then, we show you a curated set of
                  the dresses that fit them perfectly.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* PAGE 6 */}
        <div className="landing-child landing-sixth-page">
          <div className="landing-container-inner-85">
            <div className="landing-intro-hero">
              <div className="landing-title-wrapper">
                <p className="landing-title">You're the stylist.</p>
              </div>
              <div className="landing-img-wrapper">
                <div>
                  <img
                    src="https://fittoform-landing.s3.amazonaws.com/hatlady_60p_progressive.jpg"
                    className="landing-img"
                  />
                </div>
              </div>
            </div>
            <div className="landing-intro-footer landing-intro-footer-btn">
              <div className="landing-intro-footer-inner">
                <p className="landing-desc">
                  No commitments, no subscriptions, no fees. We give you the tools to find the
                  pieces you want - and the peace of mind that they will flatter you.
                </p>
                <div className="landing-callToAction-wrapper">
                  <Link to="/search">
                    <button className="landing-callToAction landing-btn-bottom">
                      <div className="landing-btn-flexWrapper">Try it out</div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterLarge />
      </div>
    );
  }
}

export default Landing;
