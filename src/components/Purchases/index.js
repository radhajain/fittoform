import React from 'react';
import './Purchases.css';
import firebase from 'firebase';

class Purchases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      uid: '',
      shoppedLinks: [],
      favorites: [],
      requestedLinks: [],
      shoppedDresses: []
    };
  }

  getDressInfo(shoppedLinks) {
    if (shoppedLinks.length === 0) return;
    for (var i = 0; i < shoppedLinks.length; i++) {
      this.getDressInfoHelper(shoppedLinks[i]).then(dress => {
        if (dress) {
          this.setState(
            {
              shoppedDresses: [...this.state.shoppedDresses, dress]
            },
            () => {
              console.log(this.state);
            }
          );
        }
      });
    }
  }

  getDressInfoHelper(dressID) {
    var dressRef = firebase
      .database()
      .ref('dresses')
      .child(`${dressID}`);
    if (dressRef) {
      return dressRef.once('value').then(snapshot => {
        let currDress = snapshot.val();
        return currDress;
      });
    } else {
      return null;
    }
  }

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
          this.setState(
            {
              name: user.name,
              shoppedLinks: user.shoppedLinks ? user.shoppedLinks : [],
              favorites: user.favorites ? user.favorites : [],
              requestedLinks: user.requestedLinks ? user.requestedLinks : []
            },
            () => {
              console.log('auth user loaded');
              console.log(this.state);
              this.getDressInfo(user.shoppedLinks);
            }
          );
        });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getDressInfo = this.getDressInfo.bind(this);
    this.getDressInfoHelper = this.getDressInfoHelper.bind(this);
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
      <div className="purchases-outer">
        <div className="purchases-inner">
          <div className="purchases-title-wrapper">
            <p className="purchases-title">Dresses you've bought</p>
          </div>
          <div className="purchases-items-container">
            {this.state.shoppedDresses.map((dress, idx) => {
              return (
                <div className="purchases-item-wrapper">
                  <div className="purchases-item-imgWrapper">
                    <img src={dress.img} className="purchases-dressImg" />
                  </div>
                  <div className="purchases-item-infoWrapper">
                    <p className="purchases-text purchases-name">{dress.name} </p>
                    <p className="purchases-text purchases-brand">{dress.brand}</p>
                    <p className=" purchases-textpurchases-price">${dress.price}</p>
                  </div>
                  <div className="purchases-item-buyWrapper">
                    <p>Did you buy this dress?</p>
                    <button>Yes</button>
                    <button>No</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Purchases;
