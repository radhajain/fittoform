import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { FooterLarge } from '../Footer';
import InstagramEmbed from 'react-instagram-embed';
import InstagramModal from '../InstagramModal';
import blueArrow from '../../assets/images/blue_arrow.svg';

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
      },
      showInstaModal: false,
      currInstaIndex: null
    };
    this.showInstaModal = this.showInstaModal.bind(this);
    this.hideInstaModal = this.hideInstaModal.bind(this);
    this.instaPosts = [
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_rox_optimized.jpg',
        dressLink: 'https://www.princesspolly.com/gracie-mini-dress',
        dressImg:
          'https://cdn.shopify.com/s/files/1/0061/8627/0804/products/4_106_31_1800x.jpg?v=1555644833',
        dressName: 'Gracie Mini Dress',
        dressBrand: 'Princess Polly',
        comment: 'Roxanna in Gracie Mini Dress by Princess Polly, Size 4'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_logan_optimized.jpg',
        dressLink: 'https://fave.co/2KcKhuz',
        dressImg:
          'https://images.bloomingdalesassets.com/is/image/BLM/products/7/optimized/10362037_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$&fmt=webp',
        dressName: 'Whisper Ruffle-Trim Sweetheart Dress',
        dressBrand: 'French Connection',
        comment: 'Logan in Ruffle-Trim Sweetheart Dress by French Connection, Size 4'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_marri_optimized.jpg',
        dressLink: 'https://www.zara.com/us/en/textured-dress-with-belt-p01165702.html',
        dressImg:
          'https://static.zara.net/photos///2019/I/0/1/p/1165/702/614/2/w/560/1165702614_1_1_1.jpg?ts=1562761407624',
        dressName: 'Textured Dress with Belt',
        dressBrand: 'Zara',
        comment: 'Marri in Textured Dress with Belt by Zara, Size L'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_emily_optimized.jpg',
        dressLink: 'https://realisationpar.com/the-alexandra-red-star/',
        dressImg:
          'https://cdn11.bigcommerce.com/s-233ct/images/stencil/759x1000/products/59/2059/ALEXANDRA_RedStar_web___50429__10528.1549336994.jpg?c=2',
        dressName: 'The Alexandra',
        dressBrand: 'Realisation Par',
        comment: 'Emily in The Alexandra by Realisation Par, Size 4'
      }
    ];
  }

  showInstaModal(idx) {
    console.log('showing insta modal...');
    this.setState({
      currInstaIndex: idx,
      showInstaModal: true
    });
  }

  hideInstaModal() {
    this.setState({
      showInstaModal: false
    });
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
          {this.state.showInstaModal && (
            <InstagramModal
              show={this.state.showInstaModal}
              close={this.hideInstaModal}
              info={this.instaPosts[this.state.currInstaIndex]}
            />
          )}
          <div className="landing-intro-img" />
          <div className="landing-content">
            <div>
              <p className="landing-title">Shop dresses knowing they'll fit.</p>
              <p className="landing-subtitle">Recommended by women with your measurements.</p>
            </div>
            <Link to="/search">
              <button className="landing-fitquiz">TAKE THE FIT QUIZ</button>
            </Link>
          </div>
        </div>
        <div className="landing-shop-container">
          <div className="landing-shop-content">
            <div className="landing-items-container">
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
            </div>
            <div className="landing-items-container">
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
              <div className="landing-item-div"></div>
            </div>
          </div>
          <Link to="/search" style={{ textDecoration: 'none', color: 'black' }}>
            <div className="landing-link-box">
              <p className="landing-link">SHOP ALL</p>
            </div>
          </Link>
        </div>
        <div className="landing-philosophy-container">
          <div className="landing-philosophy-content">
            <p className="landing-typewriter">OUR PHILOSOPHY</p>
            <p className="landing-philosophy-text">
              All bodies are made unique, and we want to help you find the clothes that will make
              yours look best. Too many of us feel sizing is hit or miss. We show you something fits
              in the most trustworthy way we know how, by only showing you items that look great on
              someone else with the exact same body as you.
            </p>
          </div>
        </div>
        <div className="landing-info-row">
          <div className="landing-info-pic landing-pic1" />
          <div className="landing-info-container">
            <div className="landing-info-content">
              <p className="landing-info-title">
                Women with your measurements have tried these dresses on
              </p>
              <p className="landing-info-subtitle">
                Brands and even items can have inconsistent sizing. Every piece on our site has been
                tried on by real women who are the same size as you.
              </p>
              <Link to="/howitworks" style={{ textDecoration: 'none', color: 'black' }}>
                <div className="landing-link-box">
                  <p className="landing-link">READ MORE</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="landing-info-row">
          <div className="landing-info-container">
            <div className="landing-info-content">
              <p className="landing-info-title">One place to shop all of your favorite brands</p>
              <p className="landing-info-subtitle">
                Brands and even items can have inconsistent sizing. Every piece on our site has been
                tried on by real women who are the same size as you.
              </p>
              <Link to="/search" style={{ marginTop: 150 }}>
                <button className="landing-fitquiz">TAKE THE FIT QUIZ</button>
              </Link>
            </div>
          </div>
          <div className="landing-info-pic landing-pic2" />
        </div>
        {/* <div className="landing-howitworks-container">
          <div className="landing-howitworks-firstRow">
            <div className="landing-howitworks-content">
              <div className="landing-2-col-container">
                <div className="landing-2-leftCol">
                  <p className="landing-title landing-2-title">How it works</p>
                </div>
                <div className="landing-2-rightCol">
                  <div className="landing-howitworks-steps">
                    <div className="landing-howitworks-box landing-howitworks-box-1">
                      <p className="landing-desc">1. Enter your measurements</p>
                    </div>
                    <div className="landing-howitworks-box">
                      <p className="landing-desc">2. See dresses that fit you perfectly</p>
                    </div>
                    <div className="landing-howitworks-box">
                      <p className="landing-desc">3. Shop from your favorite brands</p>
                    </div>

                    <div className="landing-howitworks-box">
                      <Link to="/search" className="landing-shopnow">
                        Shop Now <img src={blueArrow} style={{ width: 25, marginLeft: 5 }} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-howitworks-img1" />
          </div>
          <div className="landing-howitworks-secondRow">
            <img
              src="https://fittoform-landing.s3.amazonaws.com/landing_image_3.jpg"
              className="landing-howitworks-img2"
            />
          </div>
        </div> */}
        <div className="landing-instagram-container">
          <p className="landing-instagram-title">
            Join the movement{' '}
            <a href="https://www.instagram.com/fit.to.form/" style={{ color: 'black' }}>
              @fit.to.form
            </a>
          </p>
          <div className="landing-instagram-content">
            <div className="landing-instagram-posts">
              {this.instaPosts.map((info, idx) => {
                return (
                  <img
                    className="landing-insta-img"
                    src={info.imgLink}
                    onClick={() => this.showInstaModal(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <FooterLarge />
      </div>
    );
  }
}

export default Landing;
