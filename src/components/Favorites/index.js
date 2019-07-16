import React from 'react';
import './Favorites.css';
import firebase from 'firebase';
import { FooterSmall } from '../Footer';
import ProgressiveImage from 'react-progressive-image';

import heartOutline from '../../assets/images/heart_outline.png';
import heartFilled from '../../assets/images/heart_icon.png';

class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      dresses: []
    };
    this.getFavoritedDresses = this.getFavoritedDresses.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  //Using the dressesIDs, gets information about each dress
  getFavoritedDresses(dressIDs) {
    let dressesRef = firebase.database().ref('dresses');
    return Promise.all(
      dressIDs.map(dressID => {
        return dressesRef.child(`${dressID}`);
      })
    ).then(dressRefs => {
      var promises = [];
      for (const dressRef of dressRefs) {
        promises.push(this.getDressInfo(dressRef));
      }
      Promise.all(promises).then(dresses => {
        this.setState({ dresses: dresses }, () => {
          console.log(this.state);
        });
      });
    });
  }

  // Helper function for getFavoritedDresses:
  // Given the reference to a dress, gets information about the dress
  getDressInfo(dressRef) {
    return dressRef.once('value').then(snapshot => {
      return snapshot.val();
    });
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
        this.getUserData(authUser.uid).then(user => {
          console.log(user);
          this.setState(
            {
              email: user.email,
              name: user.name,
              waist: user.waist,
              hips: user.hips,
              height: user.height,
              bust: user.bust,
              size: user.size,
              bra: user.bra,
              favorites: user.favorites
            },
            () => {
              console.log(this.state);
              if (user.favorites && user.favorites.length !== 0) {
                this.getFavoritedDresses(user.favorites);
              }
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
    window.removeEventListener('scroll', this.handleScroll);
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  render() {
    const itemDivClass =
      this.state.dresses.length === 1
        ? 'favorites-item-div'
        : 'favorites-item-div favorites-item-div-multiple';
    const placeholder = <div style={{ backgroundColor: '#E2F8F6', height: 500, width: 350 }} />;
    return (
      <div className="favorites">
        <div className="favorites-inner">
          {!this.state.favorites && (
            <p className="favorites-empty-msg">You have not favorited any dresses yet.</p>
          )}
          {this.state.favorites &&
            this.state.dresses &&
            this.state.dresses.map((dress, key) => {
              return (
                dress && (
                  <div
                    className="favorites-col"
                    id={'0' + key}
                    onClick={() =>
                      this.goToItemView(
                        dress,
                        '0' + key,
                        this.state.dressesIDObjs.dressIDs[key],
                        this.state.closestMeasurements,
                        this.state.dressesObjs.reviewIDs[key],
                        this.state.dressGroupID
                      )
                    }
                    key={key}
                  >
                    <div className={itemDivClass}>
                      <img
                        src={heartOutline}
                        // onClick={() => this.favoriteDress(dress)}
                        className="favorites-heartIcon"
                      />
                      <img src={heartFilled} className="favorites-heart-selected" />
                      <ProgressiveImage src={dress.img}>
                        {(src, loading) => {
                          return loading ? (
                            placeholder
                          ) : (
                            <img src={src} alt="dress image" className="favorites-img" />
                          );
                        }}
                      </ProgressiveImage>
                      <p className="favorites-brand">{dress.brand}</p>
                      <p className="favorites-price">${dress.price}</p>
                    </div>
                  </div>
                )
              );
            })}
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default Favorites;
