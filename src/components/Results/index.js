import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import './Results.css';
import { FooterSmall } from '../Footer';
import downArrow from '../../assets/images/down triangle.svg';
import ProgressiveImage from 'react-progressive-image';
import Modal from '../Modal';
import upArrow from '../../assets/images/up arrow.svg';
import heartOutline from '../../assets/images/heart_outline.png';
import heartFilled from '../../assets/images/heart_icon.png';
// import { Parallax } from 'react-scroll-parallax';

class Results extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    var dressObj = {
      measurement: '',
      dressIDs: '',
      ratings: [],
      dresses: [
        {
          bra: '',
          brand: '',
          color: '',
          dressLink: '',
          img: '',
          length: '',
          material: '',
          name: '',
          neckline: '',
          occassion: '',
          price: '',
          straps: '',
          style: ''
        }
      ]
    };
    //TODO: should be getting from authuser
    console.log(this.props.location.state);
    this.state = {
      bust: this.props.location.state.bust,
      height: this.props.location.state.height,
      hips: this.props.location.state.hips,
      waist: this.props.location.state.waist,
      size: this.props.location.state.size,
      bra: this.props.location.state.bra,
      divID: this.props.location.state.divID ? this.props.location.state.divID : '00',
      favorites: [],
      authUser: false,
      uid: null,
      name: this.props.location.state.name ? this.props.location.state.name : '', //TODO: Also for auth user
      fromItem: this.props.location.state.fromItem ? this.props.location.state.fromItem : false,
      closestMeasurements: '',
      dressGroupID: null,
      //DressIDObjs: {dressIDs: [dressID, dressID ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
      dressesIDObjs: [],
      //DressIDObjs: {dresses: [dress, dress ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
      dressesObjs: dressObj,
      nextBestDressesLoaded: false,
      exactMatch: false,
      //NextBestDressGroupIDs: [{ concatMtms: "64, 27, 24, 38", dressGroupID: "dressGroupID", height: , waist: , hips: , bust: },  ...]
      nextBestDressGroupIDs: [],
      //NextBestDressesIDs: [ {measurement: "64, 27, 24, 38", dressIDs: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}, ... ]
      nextBestDressesIDs: [],
      //NextBestDresses: [{ measurement: "64, 27, 24, 38 ,dresses: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}]
      nextBestDresses: [dressObj],
      showMoreDresses: this.props.location.state.showMoreDresses
        ? this.props.location.state.showMoreDresses
        : false,
      showRecInfo: true,
      currMeasurements: '',
      seenDresses: [],
      isModalShowing: false,
      currDiv: 0,
      modalMsg: ''
    };
    console.log(this.state);
    this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
    this.getBestDressesID = this.getBestDressesID.bind(this);
    this.getDressesInfo = this.getDressesInfo.bind(this);
    this.getDressInfo = this.getDressInfo.bind(this);
    this.goToItemView = this.goToItemView.bind(this);
    this.getHeightStr = this.getHeightStr.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBestDressesIDHelper = this.getBestDressesIDHelper.bind(this);
    this.getRating = this.getRating.bind(this);
    this.getNextBestDressesID = this.getNextBestDressesID.bind(this);
    this.getNextBestDressesIDHelper = this.getNextBestDressesIDHelper.bind(this);
    this.getNextBestDressesInfo = this.getNextBestDressesInfo.bind(this);
    this.dismissRecommendationPanel = this.dismissRecommendationPanel.bind(this);
    this.showRecommendationPanel = this.showRecommendationPanel.bind(this);
    this.isElementInViewport = this.isElementInViewport.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getRecommendedStr = this.getRecommendedStr.bind(this);
    this.openModalHandler = this.openModalHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.goToSignIn = this.goToSignIn.bind(this);
    this.toggleFavoriteDress = this.toggleFavoriteDress.bind(this);
  }

  toggleFavoriteDress(selectedDressKey) {
    var favorites = this.state.favorites;
    var index = favorites.indexOf(selectedDressKey);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(selectedDressKey);
    }
    this.setState(
      {
        favorites: favorites
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

  openModalHandler = msg => {
    //if auth user then go to account
    if (this.state.authUser) {
      this.props.history.push({
        pathname: '/account'
      });
    } else {
      this.setState({
        modalMsg: msg,
        isModalShowing: true
      });
    }
  };

  closeModalHandler = () => {
    this.setState({
      isModalShowing: false
    });
  };

  goToSignIn = () => {
    this.props.history.push({
      pathname: '/signin'
    });
  };

  createAccount = (name, email, password) => {
    console.log('account being created!');
    console.log(name + ', ' + email + ', ' + password);
    this.closeModalHandler();
    const { bust, height, size, waist, hips, bra } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          email: email,
          name: name,
          height: height,
          waist: waist,
          bust: bust,
          hips: hips,
          size: size,
          bra: bra
        });
      })
      .then(authUser => {
        this.props.history.push({
          pathname: '/account'
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  isElementInViewport(el) {
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    return rect.top < 100 && rect.bottom > 100;
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
              favorites: user.favorites ? user.favorites : []
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
      window.addEventListener('scroll', this.handleScroll);
      this.getBestDressGroupID().then(result => {
        result[3].sort((a, b) => (a.diff > b.diff ? 1 : -1));
        let nextBestDresses = result[3].map(a => a.closestMeasurements);
        var exactMatchIdx = nextBestDresses.indexOf(result[0]);
        if (exactMatchIdx > -1) {
          nextBestDresses.splice(exactMatchIdx, 1);
        }
        this.setState(
          {
            exactMatch: result[2] === 0 ? true : false,
            dressGroupID: result[1],
            closestMeasurements: result[0],
            currMeasurements: result[0],
            nextBestDressGroupIDs: nextBestDresses
          },
          () => {
            this.getBestDressesID(result[1]);
            if (this.state.showMoreDresses) {
              this.getNextBestDressesID();
            }
          }
        );
      });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  //Make cleaner
  handleScroll() {
    for (var i = 0; i < 10; i++) {
      var currPage = document.getElementById(i);
      if (this.isElementInViewport(currPage)) {
        if (i === 0) {
          this.setState({
            currMeasurements: this.state.closestMeasurements,
            currDiv: 0
          });
        } else {
          if (this.state.currMeasurements !== this.state.nextBestDressGroupIDs[i - 1]) {
            this.setState({
              currMeasurements: this.state.nextBestDressGroupIDs[i - 1],
              currDiv: i
            });
          }
          console.log(this.state);
        }
      }
    }
  }

  handleInput(e) {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.refs.resultsName.blur();
    if (this.state.name.length !== 0) {
      var capitalizedName = this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1);
      this.openModalHandler('Hey ' + capitalizedName + ', sign up to save your results.');
    }
  }

  //TODO: order by what measurements are most important to you on your profile (create an account)
  //TODO: horizontal scroll

  getBestDressGroupID() {
    //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements
    // and this.state.dressGroupId
    var lowestDiff = Number.MAX_VALUE;
    var closestMeasurements, dressGroupID;
    var nextBestDressGroupIDs = [];
    var nextBestDressesOpenSpaces = 9;
    var minimumNextBestDiff = 3;
    var measurementsRef = firebase.database().ref('measurements');
    return new Promise((resolve, reject) => {
      measurementsRef.once('value').then(snapshot => {
        snapshot.forEach(measurement => {
          var values = measurement.val();
          var diffSq =
            Math.pow(values.height - this.state.height, 2) +
            Math.pow(values.waist - this.state.waist, 2) +
            Math.pow(values.bust - this.state.bust, 2) +
            Math.pow(values.hips - this.state.hips, 2);
          if (nextBestDressesOpenSpaces > 0 && Math.sqrt(diffSq) < 3) {
            var dressIDObj = { diff: Math.sqrt(diffSq), closestMeasurements: values };
            nextBestDressGroupIDs.push(dressIDObj);
            nextBestDressesOpenSpaces = nextBestDressesOpenSpaces - 1;
          } else {
            if (Math.sqrt(diffSq) < minimumNextBestDiff) {
              var dressIDObj = { diff: Math.sqrt(diffSq), closestMeasurements: values };
              nextBestDressGroupIDs.push(dressIDObj);
              var newMin = Number.MAX_VALUE;
              var lowestIndex = 8;
              nextBestDressGroupIDs.forEach((dressIDObj, idx) => {
                if (dressIDObj.diff < newMin) {
                  newMin = dressIDObj.diff;
                  lowestIndex = idx;
                }
              });
              nextBestDressGroupIDs.splice(lowestIndex, 1);
              nextBestDressGroupIDs.forEach((dressIDObj, idx) => {
                if (dressIDObj.diff < newMin) {
                  newMin = dressIDObj.diff;
                }
              });
              minimumNextBestDiff = newMin;
            }
          }
          if (Math.sqrt(diffSq) < lowestDiff) {
            lowestDiff = Math.sqrt(diffSq);
            closestMeasurements = values;
            dressGroupID = values.dressGroupID;
          }
        });
        resolve([closestMeasurements, dressGroupID, lowestDiff, nextBestDressGroupIDs]);
      });
    });
  }

  //Gets the dressIDs from the best dressGroup and then calls getDressInfo
  getBestDressesID(dressGroupID) {
    this.getBestDressesIDHelper(dressGroupID).then(results => {
      this.setState(
        {
          dressesIDObjs: results,
          seenDresses: results.dressIDs
        },
        () => {
          this.getDressesInfo(results);
        }
      );
    });
  }

  //Returns the dressIDs in the best dress group
  getBestDressesIDHelper(dressGroupID) {
    var dressGroupIDRef = firebase
      .database()
      .ref('dressGroup')
      .child(dressGroupID);
    return dressGroupIDRef
      .orderByChild('rating')
      .once('value')
      .then(snapshot => {
        var dressIDs = [];
        var dressRatings = [];
        var dressReviews = [];
        snapshot.forEach(dress => {
          dressIDs.push(dress.val().dress);
          dressRatings.push(dress.val().rating);
          if (dress.val().reviews) {
            dressReviews.push(dress.val().reviews);
          }
        });
        return { dressIDs: dressIDs, ratings: dressRatings, reviewIDs: dressReviews };
      });
  }

  //Using the dressesIDs, gets information about each dress
  getDressesInfo(dressesIDObjs) {
    var dressesRef = firebase.database().ref('dresses');
    var dressIDs = dressesIDObjs.dressIDs;
    var ratings = dressesIDObjs.ratings;
    var reviewIDs = dressesIDObjs.reviewIDs;
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
        var newDressObj = {};
        newDressObj['dressIDs'] = dressIDs;
        newDressObj['dresses'] = dresses;
        newDressObj['ratings'] = ratings;
        newDressObj['reviewIDs'] = reviewIDs;
        this.setState({ dressesObjs: newDressObj }, () => {
          console.log(this.state);
        });
      });
    });
  }

  // Helper function for getDressesInfo:
  // Given the reference to a dress, gets information about the dress
  getDressInfo(dressRef) {
    return dressRef.once('value').then(snapshot => {
      return snapshot.val();
    });
  }

  // GET NEXT BEST DRESSES

  getNextBestDressesID() {
    var promises = [];
    var nextBestDressesIDs = [];
    for (const dressGroupRef of this.state.nextBestDressGroupIDs) {
      promises.push(
        this.getNextBestDressesIDHelper(dressGroupRef.dressGroupID, dressGroupRef.concatMtms).then(
          dresses => {
            nextBestDressesIDs.push(dresses);
          }
        )
      );
    }
    Promise.all(promises).then(dresses => {
      this.setState({
        nextBestDressesIDs: nextBestDressesIDs
      });
      this.getNextBestDressesInfo(nextBestDressesIDs);
    });
  }

  //Returns the dressIDs in the best dress group
  getNextBestDressesIDHelper(dressGroupID, concat, seenDresses) {
    var dressGroupIDRef = firebase
      .database()
      .ref('dressGroup')
      .child(dressGroupID);
    return dressGroupIDRef
      .orderByChild('rating')
      .once('value')
      .then(snapshot => {
        var dressIDs = [];
        var dressRatings = [];
        var dressReviews = [];
        snapshot.forEach(dress => {
          if (!this.state.seenDresses.includes(dress.val().dress)) {
            dressIDs.push(dress.val().dress);
            dressRatings.push(dress.val().rating);
            if (dress.val().reviews) {
              dressReviews.push(dress.val().reviews);
            }
            this.setState({
              seenDresses: [...this.state.seenDresses, dress.val().dress]
            });
          }
        });
        return {
          dressIDs: dressIDs,
          ratings: dressRatings,
          reviewIDs: dressReviews,
          measurement: concat
        };
      });
  }

  //Using the dressesIDs, gets information about each dress
  getNextBestDressesInfo(nextBestDressesIDs) {
    var dressesRef = firebase.database().ref('dresses');
    var allDressPromises = [];
    for (var dressIDObjKey in nextBestDressesIDs) {
      allDressPromises.push(
        new Promise((resolve, reject) => {
          var dressIDs = nextBestDressesIDs[dressIDObjKey].dressIDs;
          var ratings = nextBestDressesIDs[dressIDObjKey].ratings;
          var reviewIDs = nextBestDressesIDs[dressIDObjKey].reviewIDs;
          var measurement = nextBestDressesIDs[dressIDObjKey].measurement;
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
              var newDressObj = {};
              newDressObj['measurement'] = measurement;
              newDressObj['dressIDs'] = dressIDs;
              newDressObj['dresses'] = dresses;
              newDressObj['ratings'] = ratings;
              newDressObj['reviewIDs'] = reviewIDs;
              resolve(newDressObj);
            });
          });
        })
      );
    }
    Promise.all(allDressPromises).then(nextBestDresses => {
      this.setState(
        {
          nextBestDresses: nextBestDresses,
          nextBestDressesLoaded: true,
          showMoreDresses: true
        },
        () => {
          console.log(this.state);
          if (!this.state.fromItem) {
            var firstPage = document.getElementById(1);
            firstPage.scrollIntoView({ behavior: 'smooth' });
          } else if (this.state.divID) {
            var currPage = document.getElementById(this.state.divID);
            const yCoordinate = currPage.getBoundingClientRect().top - 200;
            window.scrollTo({
              top: yCoordinate
            });
          } else {
            window.scrollTo({
              top: 0
            });
          }
        }
      );
    });
  }

  goToItemView(selectedItem, key, dressID, dressMeasurements, reviewIDs, dressGroupID) {
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
        divID: key,
        dressGroupID: dressGroupID,
        cachedReviews: reviewIDs,
        dressMeasurements: dressMeasurements,
        closestMeasurements: this.state.closestMeasurements,
        dressID: dressID,
        showMoreDresses: this.state.showMoreDresses
      }
    });
  }

  getMeasurementsFromConcat(concat) {
    var mmtArr = concat.split(',');
    var height = mmtArr[0].trim();
    var waist = mmtArr[1].trim();
    var bust = mmtArr[2].trim();
    var hips = mmtArr[3].trim();
    var measurementsObj = {
      concatMtms: concat,
      height: height,
      waist: waist,
      hips: hips,
      bust: bust
    };
    return measurementsObj;
  }

  getHeightStr(height) {
    var heightFt = Math.floor(height / 12);
    var heightIn = height % 12;
    return heightFt + "'" + heightIn;
  }

  getRating(rating) {
    if (rating > 10) {
      return 10;
    }
    return rating;
  }

  dismissRecommendationPanel() {
    this.setState({
      showRecInfo: false
    });
  }

  showRecommendationPanel() {
    this.setState({
      showRecInfo: true
    });
  }

  getFirstName(name) {
    if (name.includes(' ')) {
      return name.split(' ')[0];
    }
    return name;
  }

  getRecommendedStr() {
    var height = this.getHeightStr(this.state.currMeasurements.height);
    var heightObj = { label: 'Height', mmt: height };
    var bustObj = { label: 'Bust', mmt: this.state.currMeasurements.bust };
    var waistObj = { label: 'Waist', mmt: this.state.currMeasurements.waist };
    var hipsObj = { label: 'Hips', mmt: this.state.currMeasurements.hips };
    var recommmendedArr = [heightObj, bustObj, waistObj, hipsObj];
    return recommmendedArr;
  }

  render() {
    const itemDivClass =
      this.state.dressesObjs.dresses.length === 1
        ? 'results-item-div'
        : 'results-item-div results-item-div-multiple';
    var rightColClass = this.state.showRecInfo
      ? this.state.exactMatch
        ? 'results-rightCol results-rightCol-adjust'
        : 'results-rightCol'
      : 'hide';
    const placeholder = <div style={{ backgroundColor: '#E2F8F6', height: 500, width: 350 }} />;
    return (
      <div>
        <div className="results-container-outer">
          <div className="results-leftCol">
            <div className="results-leftCol-fakeNav"></div>
            <div className="results-leftCol-inner">
              <Modal
                className="modal"
                show={this.state.isModalShowing}
                close={this.closeModalHandler}
                createAccount={this.createAccount}
                goToSignIn={this.goToSignIn}
                name={this.state.name}
                btnMsg="Join the FtF Fam"
                message={this.state.modalMsg}
              ></Modal>
              <div className="results-grid" id="0">
                {this.state.dressesObjs.dresses &&
                  this.state.dressesObjs.dresses.map((dress, key) => {
                    return (
                      dress && (
                        <div className="results-col" id={'0' + key} key={key}>
                          <div className={itemDivClass}>
                            <div
                              onClick={() =>
                                this.toggleFavoriteDress(this.state.dressesObjs.dressIDs[key])
                              }
                              className={
                                !this.state.favorites ||
                                this.state.favorites.indexOf(
                                  this.state.dressesObjs.dressIDs[key]
                                ) === -1
                                  ? 'results-heart-outline'
                                  : 'results-heart-fill'
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
                                    className="results-img"
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
                                  />
                                );
                              }}
                            </ProgressiveImage>
                            <div
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
                            >
                              <p className="results-rating">
                                Rated {this.getRating(this.state.dressesObjs.ratings[key])}/10 by
                                women like you
                              </p>
                              <p className="results-price">${dress.price}</p>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
              </div>
              {this.state.nextBestDressGroupIDs.length !== 0 && !this.state.showMoreDresses && (
                <div className="results-loadMore-btn-div">
                  <div className="results-loadMore-wrapper">
                    <button className="results-loadMore-btn" onClick={this.getNextBestDressesID}>
                      <div style={{ position: 'relative' }}>Show near perfect matches</div>
                    </button>
                  </div>
                </div>
              )}
              {this.state.showMoreDresses &&
                this.state.nextBestDressesLoaded &&
                Object.entries(this.state.nextBestDresses).map(
                  ([keyDressObj, dressObj]) =>
                    dressObj.dresses.length > 0 && (
                      <div
                        className="results-grid results-margin-top"
                        key={keyDressObj}
                        id={parseInt(keyDressObj, 10) + 1}
                      >
                        {dressObj.dresses.map((dress, key) => {
                          return (
                            dress && (
                              <div
                                className="results-col"
                                id={(parseInt(keyDressObj, 10) + 1).toString() + key}
                                key={key}
                              >
                                {dress && (
                                  <div className={itemDivClass} key={key}>
                                    <div
                                      onClick={() =>
                                        this.toggleFavoriteDress(
                                          this.state.nextBestDressesIDs[keyDressObj].dressIDs[key]
                                        )
                                      }
                                      className={
                                        !this.state.favorites ||
                                        this.state.favorites.indexOf(
                                          this.state.nextBestDressesIDs[keyDressObj].dressIDs[key]
                                        ) === -1
                                          ? 'results-heart-outline'
                                          : 'results-heart-fill'
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
                                            className="results-img"
                                            onClick={() =>
                                              this.goToItemView(
                                                dress,
                                                (parseInt(keyDressObj, 10) + 1).toString() + key,
                                                this.state.nextBestDressesIDs[keyDressObj].dressIDs[
                                                  key
                                                ],
                                                this.getMeasurementsFromConcat(
                                                  dressObj.measurement
                                                ),
                                                dressObj.reviewIDs[key],
                                                this.state.nextBestDressGroupIDs[keyDressObj]
                                                  .dressGroupID
                                              )
                                            }
                                          />
                                        );
                                      }}
                                    </ProgressiveImage>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        this.goToItemView(
                                          dress,
                                          (parseInt(keyDressObj, 10) + 1).toString() + key,
                                          this.state.nextBestDressesIDs[keyDressObj].dressIDs[key],
                                          this.getMeasurementsFromConcat(dressObj.measurement),
                                          dressObj.reviewIDs[key],
                                          this.state.nextBestDressGroupIDs[keyDressObj].dressGroupID
                                        )
                                      }
                                    >
                                      <p className="results-rating">
                                        Rated {this.getRating(dressObj.ratings[key])}/10 by women
                                        like you
                                      </p>
                                      <p className="results-price">${dress.price}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })}
                      </div>
                    )
                )}
            </div>
          </div>
          <div className={rightColClass}>
            <div className="results-rightCol-inner">
              <div className="results-menu-hide-div">
                <img
                  src={downArrow}
                  className="results-menu-hide-arrow"
                  onClick={this.dismissRecommendationPanel}
                />
              </div>
              <div className="results-name-div">
                <p className="results-text">Curated for</p>
                <form onSubmit={this.handleSubmit}>
                  <input
                    name="name"
                    type="text"
                    ref="resultsName"
                    value={this.getFirstName(this.state.name)}
                    className="results-input"
                    onChange={this.handleInput}
                    placeholder="Add Your Name"
                  />
                </form>
              </div>
              <div className="results-recommended-wrapper">
                {this.state.exactMatch && this.state.currDiv === 0 && (
                  <p className="results-match">Exact Match</p>
                )}
                {!this.state.exactMatch && this.state.currDiv === 0 && (
                  <p className="results-match">Closest Match</p>
                )}
                <p className="results-text">Recommended by other women that are</p>
                {this.state.closestMeasurements &&
                  this.getRecommendedStr().map(line => (
                    <div className="results-measurement-wrapper">
                      <p className="results-measurement-label">{line.label}</p>
                      <p className="results-measurement">{line.mmt}</p>
                    </div>
                  ))}
              </div>
              <div className="results-your-measurements-wrapper">
                <p className="results-text">Your measurements are</p>
                <p
                  className="results-your-measurements"
                  onClick={() =>
                    this.openModalHandler('Know your exact measurements? Create an account to edit')
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {this.getHeightStr(this.state.height)}, Bust: {this.state.bust}, Waist:{' '}
                  {this.state.waist}, Hips: {this.state.hips}
                </p>
              </div>
            </div>
          </div>
          <div
            className={
              this.state.showRecInfo ? 'results-menu-show-div-hidden' : 'results-menu-show-div'
            }
          >
            <img
              src={upArrow}
              className="results-menu-hide-arrow"
              onClick={this.showRecommendationPanel}
            />
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default withFirebase(Results);
