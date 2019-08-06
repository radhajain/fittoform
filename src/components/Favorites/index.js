import React from 'react';
import './Favorites.css';
import firebase from 'firebase';
import { FooterSmall } from '../Footer';
import ProgressiveImage from 'react-progressive-image';
import { Link } from 'react-router-dom';
import heartOutline from '../../assets/images/heart_outline.png';
import heartFilled from '../../assets/images/heart_icon.png';

class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      dressIDs: [],
      dresses: [],
      authUser: false,
      uid: ''
    };
    this.getUserData = this.getUserData.bind(this);
    this.toggleFavoriteDress = this.toggleFavoriteDress.bind(this);
  }

  toggleFavoriteDress(selectedDressKey) {
    var favorites = this.state.favorites;
    var dresses = this.state.dresses;
    var index = favorites.indexOf(selectedDressKey);
    if (index !== -1) {
      favorites.splice(index, 1);
      dresses.splice(index, 1);
    } else {
      favorites.push(selectedDressKey);
    }
    if (!favorites) {
      favorites = [];
    }
    this.setState(
      {
        favorites: favorites,
        dresses: dresses
      },
      () => {
        let UserRef = firebase
          .database()
          .ref('users')
          .child(`${this.state.uid}`);
        UserRef.update({
          favorites: this.state.favorites
        });
        console.log(this.state);
      }
    );
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
        this.setState(
          {
            dresses: dresses,
            dressIDs: dressIDs
          },
          () => {
            console.log(this.state);
          }
        );
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

  authlistener(first) {
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
              if (user.favorites && user.favorites.length !== 0 && first) {
                this.getFavoritedDresses(user.favorites);
                first = false;
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
    this.getFavoritedDresses = this.getFavoritedDresses.bind(this);
    if (this._isMounted) {
      var first = true;
      this.authlistener(first);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  goToItemView(selectedItem, dressID) {
    this.props.history.push({
      pathname: '/item',
      state: {
        item: selectedItem,
        height: this.state.height,
        waist: this.state.waist,
        hips: this.state.hips,
        bust: this.state.bust,
        bra: this.state.bra,
        size: this.state.size,
        authUser: this.state.authUser,
        name: this.state.name,
        dressID: dressID
      }
    });
  }

  render() {
    const itemDivClass =
      this.state.dresses.length === 1
        ? 'favorites-item-div'
        : 'favorites-item-div favorites-item-div-multiple';
    const placeholder = <div style={{ backgroundColor: '#E2F8F6', height: 500, width: 350 }} />;
    return (
      <div className="favorites">
        <div className="results-leftCol-fakeNav"></div>
        <div className="favorites-inner">
          <div className="favorites-leftCol">
            {!this.state.favorites && (
              <div style={{ margin: '0 auto', textAlign: 'center' }}>
                <p className="favorites-empty-msg">You have not favorited any dresses yet.</p>
                <Link to="/results">
                  <p className="favorites-empty-msg">View all dresses picked for you</p>
                </Link>
              </div>
            )}
            {this.state.favorites &&
              this.state.dresses &&
              this.state.dresses.map((dress, key) => {
                return (
                  dress && (
                    <div className="favorites-col" id={'0' + key} key={key}>
                      <div className={itemDivClass}>
                        <div
                          onClick={() => this.toggleFavoriteDress(this.state.dressIDs[key])}
                          className={
                            !this.state.favorites ||
                            this.state.favorites.indexOf(this.state.dressIDs[key]) === -1
                              ? 'favorites-heart-outline'
                              : 'favorites-heart-fill'
                          }
                        />
                        <ProgressiveImage src={dress.img}>
                          {(src, loading) => {
                            return loading ? (
                              placeholder
                            ) : (
                              <img
                                src={src}
                                alt="dress image"
                                className="favorites-img"
                                onClick={() => this.goToItemView(dress, this.state.dressIDs[key])}
                              />
                            );
                          }}
                        </ProgressiveImage>
                        <div
                          onClick={() => this.goToItemView(dress, this.state.dressIDs[key])}
                          style={{ cursor: 'pointer' }}
                        >
                          <p className="favorites-brand">{dress.brand}</p>
                          <p className="favorites-price">${dress.price}</p>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
          <div className="favorites-rightCol">
            <div>
              <Link to="/results" style={{ textDecoration: 'none' }}>
                <p className="favorites-back">
                  <i> {'< '} Back to results</i>
                </p>
              </Link>
              <p className="favorites-title">Your Favorites</p>
            </div>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default Favorites;
