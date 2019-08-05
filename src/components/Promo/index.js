import React from 'react';
import './Promo.css';
import firebase from 'firebase';
import { FooterSmall } from '../Footer';
import { Link } from 'react-router-dom';

class Promo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validPromoCode: false,
      promoCode: ''
    };
    this.promoCodes = ['EMORYXFTF'];
    this.getUserData = this.getUserData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.promoCodes.indexOf(this.state.promoCode) > -1) {
      this.setState({
        validPromoCode: true
      });
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getUserData(uid) {
    let UserRef = firebase
      .database()
      .ref('users')
      .child(`${uid}`);
    return UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      return user;
    });
  }

  authlistener() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      console.log(authUser);
      if (authUser && authUser.uid) {
        this.setState({
          authUser: true,
          uid: authUser.uid
        });
        this.getUserData(authUser.uid).then(user => {
          console.log(user);
          this.setState(
            {
              name: user.name,
              waist: user.waist,
              hips: user.hips,
              height: user.height,
              userSize: user.size,
              bra: user.bra,
              bust: user.bust,
              age: user.age ? user.age : 'N/A'
            },
            () => {
              console.log(this.state);
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
    var promoCode = this.state.promoCode;
    return (
      <div className="promo">
        <div className="landing-fakeNav" />
        <div className="promo-inner">
          <div className="promo-content">
            <div className="promo-info-wrapper">
              <div className="promo-title-wrapper">
                <p className="promo-title">Buy through Fit to Form and get $$$</p>
                <div className="promo-box">
                  <p className="promo-subtitle">
                    Spend <span className="underline">$50</span> or more,{'  '}
                  </p>
                  <p className="promo-subtitle">
                    Get <span className="underline">$10</span>
                  </p>
                </div>
                <div className="promo-box">
                  <p className="promo-subtitle">
                    Spend <span className="underline">$100</span> or more,{'  '}
                  </p>
                  <p className="promo-subtitle">
                    Get <span className="underline">$25</span>
                  </p>
                </div>
                {/* <div className="promo-box">
                  <p className="promo-subtitle">
                    Spend <span className="underline">$200</span> or more,
                  </p>
                  <p className="promo-subtitle">
                    Get <span className="underline">$25</span>
                  </p>
                </div> */}
                <p className="promo-text promo-brands">
                  Giftcards from Revolve, Reformation, Nordstrom or Bloomingdale's.
                </p>
                <p className="promo-text">
                  To redeem, email your order confirmation to{' '}
                  <span className="underline">promo@thefittoform.com</span>.
                </p>
                <Link to="/results">
                  <button className="promo-btn">Shop now</button>
                </Link>
                <p className="promo-tc">Valid once per user, until August 10th</p>
                <p className="promo-tc">
                  Giftcards for Revolve and Reformation only redeemable with $100+ purchase
                </p>
              </div>
            </div>
            <div className="promo-img-wrapper">
              {/* <img
                src="https://fittoform-landing.s3.amazonaws.com/landing_image_3.jpg"
                className="promo-img"
              /> */}
            </div>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default Promo;
