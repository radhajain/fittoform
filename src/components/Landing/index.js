import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { FooterLarge } from '../Footer';
import InstagramEmbed from 'react-instagram-embed';

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
        <div className="landing-title-container">
          <div className="landing-intro-img" />
          <div className="landing-content">
            <div className="landing-title">
              Shop dresses knowing they'll fit. Recommended by women with your measurements.
            </div>
            <div className="landing-callToAction-wrapper">
              <Link to="/search">
                <button className="landing-callToAction">
                  <div className="landing-btn-flexWrapper">Shop Now</div>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="landing-howitworks-container">
          <div className="landing-howitworks-firstRow">
            <div className="landing-howitworks-content">
              <div className="landing-2-col-container">
                <div className="landing-2-leftCol">
                  <p className="landing-title landing-2-title">How it works</p>
                </div>
                <div className="landing-2-rightCol">
                  <div className="landing-howitworks-steps">
                    <div className="landing-howitworks-box landing-howitworks-box-1">
                      <p className="landing-desc">1 Tell us your size</p>
                      <p className="landing-howitworks-desc">
                        We estimate your measurements based on the sizes you wear and how they fit
                        you
                      </p>
                    </div>
                    <div className="landing-howitworks-box">
                      <p className="landing-desc">2 Browse curations</p>
                      <p className="landing-howitworks-desc">
                        See personalized recommendations by women with the same measurements as you
                      </p>
                    </div>
                    <div className="landing-howitworks-box">
                      <p className="landing-desc">3 Buy with confidence</p>
                      <p className="landing-howitworks-desc">
                        Read reviews from women with your measurements who have tried each dress on
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-howitworks-img1" />
          </div>
          <div className="landing-howitworks-secondRow">
            <img
              src="https://fittoform-landing.s3.amazonaws.com/lp_1.jpg"
              className="landing-howitworks-img2"
            />
          </div>
        </div>
        <div className="landing-instagram-container">
          <p className="landing-instagram-title">Join us on Instagram @fit.to.form</p>
          <div className="landing-instagram-content">
            <InstagramEmbed
              url="https://www.instagram.com/p/B0gyUu4AdKm/"
              maxWidth={320}
              hideCaption={true}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
            <InstagramEmbed
              url="https://www.instagram.com/p/B0ZuakAhPTn/"
              maxWidth={320}
              hideCaption={true}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
            <InstagramEmbed
              url="https://www.instagram.com/p/B0ZTljQhJuD/"
              maxWidth={320}
              hideCaption={true}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
            <InstagramEmbed
              url="https://www.instagram.com/p/B0ZNGSAhXHW/"
              maxWidth={320}
              hideCaption={true}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>
        </div>
        <FooterLarge />
      </div>
    );
  }
}

export default Landing;
