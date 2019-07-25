import React from 'react';
import './Promo.css';
import firebase from 'firebase';

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
        <div className="promo-inner">
          <div className="promo-content">
            <div className="promo-title-wrapper">
              <p className="promo-title">Tell us what you bought and get $$$</p>
              <p className="promo-subtitle">$5 off purchases under $50</p>
              <p className="promo-subtitle">$10 off for purchases under $100</p>
              <p className="promo-subtitle">$15 off for purchases over $100</p>
            </div>
            <form className="promo-form" onSubmit={this.handleSubmit}>
              <div className="promo-form-div">
                <input
                  name="promoCode"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={this.onChange}
                  type="text"
                  className="promo-input"
                />
                <button className="promo-btn" type="submit">
                  Add
                </button>
              </div>
            </form>
            {this.state.validPromoCode && (
              <p>
                Promo code accepted! Upload a screenshot below of your confirmation and you will be
                emailed a giftcard.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Promo;
