import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import './Results.css';
import { FooterSmall } from '../Footer';
import downArrow from '../../assets/images/down triangle.svg';
import ProgressiveImage from 'react-progressive-image';
import Modal from '../Modal';
import upArrow from '../../assets/images/up arrow.svg';
import { Link } from 'react-router-dom';
import MakeRequest from '../MakeRequest';
import * as ROUTES from '../../constants/routes.js';
// import { Parallax } from 'react-scroll-parallax';

//TODO: maintain scroll position

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
    //TODO: should show % match
    console.log(this.props.location.state);

    this.state = {
      bust: '',
      height: '',
      hips: '',
      waist: '',
      size: '',
      bra: '',
      divID: '00',
      favorites: [],
      authUser: false,
      uid: null,
      name: '',
      fromItem: false,
      closestMeasurements: '',
      dressGroupID: null,
      bestDressGroupIDs: [],
      //DressIDObjs: {dressIDs: [dressID, dressID ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
      bestDressesIDs: [],
      //DressIDObjs: {dresses: [dress, dress ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
      bestDresses: [dressObj],
      bestDressesLoaded: false,
      nextBestDressesLoaded: false,
      exactMatch: false,
      //NextBestDressGroupIDs: [{ concatMtms: "64, 27, 24, 38", dressGroupID: "dressGroupID", height: , waist: , hips: , bust: },  ...]
      nextBestDressGroupIDs: [],
      //NextBestDressesIDs: [ {measurement: "64, 27, 24, 38", dressIDs: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}, ... ]
      nextBestDressesIDs: [],
      //NextBestDresses: [{ measurement: "64, 27, 24, 38 ,dresses: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}]
      nextBestDresses: [dressObj],
      showMoreDresses: true,
      showRecInfo: true,
      currMeasurements: '',
      seenDresses: [],
      isModalShowing: false,
      isHomeModalShowing: false,
      showMakeRequest: false,
      currDiv: 0,
      modalMsg: '',
      requestedLinks: [],
      showCurrMeasurement: false
    };
    if (this.props.location.state) {
      this.state.bust = this.props.location.state.bust ? this.props.location.state.bust : '';
      this.state.height = this.props.location.state.height ? this.props.location.state.height : '';
      this.state.hips = this.props.location.state.hips ? this.props.location.state.hips : '';
      this.state.waist = this.props.location.state.waist ? this.props.location.state.waist : '';
      this.state.size = this.props.location.state.size ? this.props.location.state.size : '';
      this.state.bra = this.props.location.state.bra ? this.props.location.state.bra : '';
      this.state.divID = this.props.location.state.divID ? this.props.location.state.divID : '00';
      this.state.name = this.props.location.state.name ? this.props.location.state.name : '';
      this.state.fromItem = this.props.location.state.fromItem
        ? this.props.location.state.fromItem
        : false;
      // this.state.showMoreDresses = this.props.location.state.showMoreDresses
      //   ? this.props.location.state.showMoreDresses
      //   : true;
    } else {
      this.props.history.push(ROUTES.LANDING);
    }
    console.log(this.state);
    this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
    this.getBestDressesID = this.getBestDressesID.bind(this);
    this.getBestDressesInfo = this.getBestDressesInfo.bind(this);
    this.getDressInfo = this.getDressInfo.bind(this);
    this.goToItemView = this.goToItemView.bind(this);
    this.getHeightStr = this.getHeightStr.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getDressesIDHelper = this.getDressesIDHelper.bind(this);
    this.getNextBestDressesIDHelper = this.getNextBestDressesIDHelper.bind(this);
    this.getRating = this.getRating.bind(this);
    this.getNextBestDressesID = this.getNextBestDressesID.bind(this);
    this.getNextBestDressesInfo = this.getNextBestDressesInfo.bind(this);
    this.dismissRecommendationPanel = this.dismissRecommendationPanel.bind(this);
    this.showRecommendationPanel = this.showRecommendationPanel.bind(this);
    this.getRecommendedStr = this.getRecommendedStr.bind(this);
    this.openModalHandler = this.openModalHandler.bind(this);
    this.openHomeModalHandler = this.openHomeModalHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.goToSignIn = this.goToSignIn.bind(this);
    this.toggleFavoriteDress = this.toggleFavoriteDress.bind(this);
    this.createAccountToAccount = this.createAccountToAccount.bind(this);
    this.createAccountAndRefresh = this.createAccountAndRefresh.bind(this);
    this.makeReviewRequest = this.makeReviewRequest.bind(this);
    this.showMakeRequestModal = this.showMakeRequestModal.bind(this);
    this.showMoreDresses = this.showMoreDresses.bind(this);
    this.goToSubmitDress = this.goToSubmitDress.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.getPercentageMatch = this.getPercentageMatch.bind(this);
  }

  handleMouseEnter(currBucketID, showingNextBest) {
    if (showingNextBest) {
      this.setState({
        currMeasurements: this.state.nextBestDressGroupIDs[currBucketID],
        showCurrMeasurement: true
      });
    } else {
      this.setState({
        currMeasurements: this.state.bestDressGroupIDs[currBucketID],
        showCurrMeasurement: true
      });
    }
  }

  handleMouseLeave() {
    this.setState({
      showCurrMeasurement: false
    });
  }

  getPercentageMatch(values) {
    var heightDiff =
      Math.abs(values.height - this.state.height) <= 1 &&
      Math.abs(values.height - this.state.height) > 0
        ? 0.1
        : Math.abs(values.height - this.state.height);
    var hipsDiff = Math.abs(values.hips - this.state.hips);
    if (values.hips >= this.state.hips && values.hips - this.state.hips <= 1.5) {
      hipsDiff = 0.1;
    }
    var diffAbs =
      heightDiff +
      Math.abs(values.waist - this.state.waist) +
      Math.abs(values.bust - this.state.bust) +
      hipsDiff;
    // var diffAbs =
    //   Math.abs(values.height - this.state.height) +
    //   Math.abs(values.waist - this.state.waist) +
    //   Math.abs(values.bust - this.state.bust) +
    //   Math.abs(values.hips - this.state.hips);
    // var total = this.state.height + this.state.waist + this.state.bust + this.state.hips;
    // var percentageDiff = Math.round(((total - diffAbs) / total) * 100);
    // return percentageDiff;
    return Math.round(100 - diffAbs * 2.4);
  }

  toggleFavoriteDress(selectedDressKey) {
    if (!this.state.authUser) {
      this.setState({
        modalMsg: 'Create an account to save the dresses you love',
        isHomeModalShowing: true
      });
    } else {
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
  }

  makeReviewRequest(link) {
    if (this.state.authUser) {
      console.log(link);
      this.closeModalHandler();
      let requestedRef = firebase.database().ref('requested');
      var newRequest = requestedRef.push();
      newRequest.set({
        uid: this.state.uid,
        height: this.state.height,
        waist: this.state.waist,
        bust: this.state.bust,
        hips: this.state.hips,
        name: this.state.name,
        bra: this.state.bra,
        dressLink: link
      });
      //Since this is an array, will only add it if it is unique
      this.setState({
        requestedLinks: [...this.state.requestedLinks, link]
      });
      let UserRef = firebase
        .database()
        .ref('users')
        .child(`${this.state.uid}`);
      UserRef.update({
        requestedLinks: this.state.requestedLinks
      });
      console.log(this.state);
      //If already exists then don't add
    }
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

  openHomeModalHandler = msg => {
    if (this.state.authUser) {
      this.props.history.push({
        pathname: '/results'
      });
    } else {
      this.setState({
        modalMsg: msg,
        isHomeModalShowing: true
      });
    }
  };

  closeModalHandler = () => {
    this.setState({
      isModalShowing: false,
      isHomeModalShowing: false,
      showMakeRequest: false
    });
  };

  goToSignIn = () => {
    this.props.history.push({
      pathname: '/signin'
    });
  };

  createAccountToAccount = (name, email, password) => {
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

  createAccountAndRefresh = (name, email, password) => {
    this.closeModalHandler();
    const { bust, height, size, waist, hips, bra } = this.state;
    if (this.state.requestLink) {
      console.log(this.requestLink);
      //TODO: Then add it to the user object?
    }
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
          pathname: '/results'
        });
      })
      .catch(error => {
        console.log(error);
      });
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
              favorites: user.favorites ? user.favorites : [],
              requestedLinks: user.requestedLinks ? user.requestedLinks : []
            },
            () => {
              console.log('auth user loaded');
              this.loadData();
            }
          );
        });
      } else if (this.props.location.state) {
        this.loadData();
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    this.loadData = this.loadData.bind(this);
    if (this._isMounted) {
      this.authlistener();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
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
      this.openHomeModalHandler('Hey ' + capitalizedName + ', sign up to save your results.');
    }
  }

  // FIREBASE DATA BACKEND ---------------------------------------------------------------

  //TODO: need to account for case when you don't have near matches within 3 inches
  loadData() {
    this.getBestDressGroupID().then(result => {
      result[3].sort((a, b) => (a.diff > b.diff ? 1 : -1));
      let nextBestDresses = result[3].map(a => a.closestMeasurements);
      var exactMatchIdx = nextBestDresses.indexOf(result[0]);
      if (exactMatchIdx > -1) {
        nextBestDresses.splice(exactMatchIdx, 1);
      }
      //Best Dress Group IDs are the top 3 closest measurements
      var bestDressGroupIDs = nextBestDresses.slice(0, 3);
      //These are the next top measurements within 3 inches
      var nextBestDressesArr = nextBestDresses.slice(3);
      this.setState(
        {
          exactMatch: result[2] === 0 ? true : false,
          dressGroupID: result[1],
          closestMeasurements: result[0],
          currMeasurements: result[0],
          bestDressGroupIDs: bestDressGroupIDs,
          nextBestDressGroupIDs: nextBestDressesArr
        },
        () => {
          this.getBestDressesID(bestDressGroupIDs);
          if (this.state.showMoreDresses) {
            this.getNextBestDressesID(nextBestDressesArr);
          }
        }
      );
    });
    window.scrollTo(0, 0);
  }

  //TODO: order by what measurements are most important to you on your profile (create an account)

  getBestDressGroupID() {
    //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements
    // and this.state.dressGroupId
    var lowestDiff = Number.MAX_VALUE;
    var closestMeasurements, dressGroupID;
    var bestDressGroupIDs = [];
    var maxNextBestDiff = 4;
    var measurementsRef = firebase.database().ref('measurements');
    return new Promise((resolve, reject) => {
      measurementsRef.once('value').then(snapshot => {
        snapshot.forEach(measurement => {
          var values = measurement.val();
          var heightDiff =
            Math.abs(values.height - this.state.height) <= 1 &&
            Math.abs(values.height - this.state.height) > 0
              ? 0.1
              : Math.abs(values.height - this.state.height);
          var hipsDiff = Math.abs(values.hips - this.state.hips);
          if (values.hips >= this.state.hips && values.hips - this.state.hips <= 1.5) {
            hipsDiff = 0.1;
          }
          var diffAbs =
            heightDiff +
            Math.abs(values.waist - this.state.waist) +
            Math.abs(values.bust - this.state.bust) +
            hipsDiff;
          if (diffAbs <= maxNextBestDiff) {
            var dressIDObj = { diff: diffAbs, closestMeasurements: values };
            bestDressGroupIDs.push(dressIDObj);
          }
          if (diffAbs < lowestDiff) {
            lowestDiff = diffAbs;
            closestMeasurements = values;
            dressGroupID = values.dressGroupID;
          }
        });
        resolve([closestMeasurements, dressGroupID, lowestDiff, bestDressGroupIDs]);
      });
    });
  }

  //Gets the dressIDs from the best dressGroup and then calls getDressInfo
  getBestDressesID(bestDressGroupIDs) {
    var promises = [];
    var bestDressesIDs = [];
    console.log('getBest dresses being called');
    this.setState(
      {
        seenDresses: []
      },
      () => {
        for (const dressGroupRef of bestDressGroupIDs) {
          promises.push(
            this.getDressesIDHelper(dressGroupRef.dressGroupID, dressGroupRef.concatMtms).then(
              dresses => {
                bestDressesIDs.push(dresses);
              }
            )
          );
        }
        Promise.all(promises).then(dresses => {
          this.setState({
            bestDressesIDs: bestDressesIDs
          });
          this.getBestDressesInfo(bestDressesIDs);
        });
      }
    );
  }

  //TODO: add set of all duplicates
  //Returns the dressIDs in the best dress group
  getDressesIDHelper(dressGroupID, concatMtms) {
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
          } else {
            console.log('dress already exists');
          }
        });
        return {
          dressIDs: dressIDs,
          ratings: dressRatings,
          reviewIDs: dressReviews,
          measurement: concatMtms
        };
      });
  }

  //Returns the dressIDs in the best dress group
  getNextBestDressesIDHelper(dressGroupID, concatMtms) {
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
          } else {
            console.log('dress already exists in next best');
          }
        });
        return {
          dressIDs: dressIDs,
          ratings: dressRatings,
          reviewIDs: dressReviews,
          measurement: concatMtms
        };
      });
  }

  //Using the dressesIDs, gets information about each dress
  getBestDressesInfo(bestDressesIDs) {
    var dressesRef = firebase.database().ref('dresses');
    var allDressPromises = [];
    for (var dressIDObjKey in bestDressesIDs) {
      allDressPromises.push(
        new Promise((resolve, reject) => {
          var dressIDs = bestDressesIDs[dressIDObjKey].dressIDs;
          var ratings = bestDressesIDs[dressIDObjKey].ratings;
          var reviewIDs = bestDressesIDs[dressIDObjKey].reviewIDs;
          var measurement = bestDressesIDs[dressIDObjKey].measurement;
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
    Promise.all(allDressPromises).then(bestDresses => {
      this.setState(
        {
          bestDresses: bestDresses,
          bestDressesLoaded: true
        },
        () => {
          console.log(this.state);
        }
      );
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

  showMoreDresses() {
    // if (!this.state.authUser) {
    //   this.setState({
    //     modalMsg: 'Create an account to see more dresses picked for you',
    //     isHomeModalShowing: true,
    //     modalDismiss: true
    //   });
    // }
    this.getNextBestDressesID(this.state.nextBestDressGroupIDs);
  }

  getNextBestDressesID(nextBestDressGroupIDs) {
    var promises = [];
    var nextBestDressesIDs = [];
    for (const dressGroupRef of nextBestDressGroupIDs) {
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
            // var firstPage = document.getElementById(4);
            // if (firstPage) {
            //   firstPage.scrollIntoView({ behavior: 'smooth' });
            // }
          } else if (this.state.fromItem && this.state.divID) {
            var currPage = document.getElementById(this.state.divID);
            if (currPage) {
              console.log('scrolling to....' + currPage);
              const yCoordinate = currPage.getBoundingClientRect().top - 80;
              window.scrollTo({
                top: yCoordinate
              });
            }
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

  showMakeRequestModal() {
    if (!this.state.authUser) {
      this.setState({
        modalMsg: 'Create an account to request a dress review',
        isHomeModalShowing: true
      });
    } else {
      this.setState({
        showMakeRequest: true
      });
    }
  }

  goToSubmitDress() {
    if (this.state.authUser) {
      this.props.history.push('/submit');
    } else {
      this.setState({
        modalMsg: 'First, create an account to save your measurements.',
        isHomeModalShowing: true
      });
    }
  }

  getNumColors(colors) {
    if (colors.indexOf(',') > -1) {
      var colorsArr = colors.split(',');
      return colorsArr.length + ' colors';
    } else {
      return '';
    }
  }

  getWholePrice(price) {
    return Math.round(price);
  }

  render() {
    var rightColClass = this.state.showRecInfo
      ? this.state.exactMatch
        ? 'results-rightCol results-rightCol-adjust'
        : 'results-rightCol'
      : 'hide';
    const placeholder = (
      <div style={{ backgroundColor: '#E2F8F6', cursor: 'wait' }} className="results-img" />
    );
    var name = this.state.name;
    return (
      <div>
        <div className="results-fakeNav">
          <div className="results-fakeNav-leftCol"></div>
          <div className="results-fakeNav-rightCol"></div>
        </div>
        {/* <div className="results-getReview-wrapper">
          <p className="results-getReview-text" onClick={this.showMakeRequestModal}>
            Have a particular dress in mind? Request a review
          </p>
        </div> */}
        <div className="results-container-outer">
          <div className="results-container-inner">
            <div className="results-leftCol">
              <div className="results-leftCol-inner">
                <Modal
                  className="modal"
                  show={this.state.isModalShowing}
                  close={this.closeModalHandler}
                  createAccount={this.createAccountToAccount}
                  goToSignIn={this.goToSignIn}
                  name={this.state.name}
                  btnMsg="Join the FtF Fam"
                  message={this.state.modalMsg}
                ></Modal>
                <Modal
                  className="modal"
                  show={this.state.isHomeModalShowing}
                  close={this.closeModalHandler}
                  createAccount={this.createAccountAndRefresh}
                  goToSignIn={this.goToSignIn}
                  name={this.state.name}
                  btnMsg="Join the FtF Fam"
                  message={this.state.modalMsg}
                ></Modal>
                <MakeRequest
                  show={this.state.showMakeRequest}
                  close={this.closeModalHandler}
                  makeReviewRequest={this.makeReviewRequest}
                  name={this.state.name}
                ></MakeRequest>
                <div className="results-grid">
                  {this.state.bestDressesLoaded &&
                    Object.entries(this.state.bestDresses).map(
                      ([keyDressObj, dressObj]) =>
                        dressObj.dresses.length > 0 &&
                        dressObj.dresses.map((dress, key) => {
                          return (
                            dress &&
                            dress.inStock && (
                              <div key={key} id={parseInt(keyDressObj, 10) + 1}>
                                {dress && (
                                  <div
                                    className="results-item-div"
                                    key={key}
                                    id={(parseInt(keyDressObj, 10) + 1).toString() + key}
                                    onMouseEnter={() => this.handleMouseEnter(keyDressObj, false)}
                                    onMouseLeave={() => this.handleMouseLeave()}
                                  >
                                    <div
                                      onClick={() =>
                                        this.toggleFavoriteDress(
                                          this.state.bestDressesIDs[keyDressObj].dressIDs[key]
                                        )
                                      }
                                      className={
                                        !this.state.favorites ||
                                        this.state.favorites.indexOf(
                                          this.state.bestDressesIDs[keyDressObj].dressIDs[key]
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
                                            onMouseOver={e =>
                                              dress.img2
                                                ? (e.currentTarget.src = dress.img2)
                                                : console.log("don't have rollover")
                                            }
                                            onMouseOut={e =>
                                              dress.img2
                                                ? (e.currentTarget.src = dress.img)
                                                : console.log('no return')
                                            }
                                            alt={dress.name}
                                            className="results-img"
                                            onClick={() =>
                                              // goToItemView(selectedItem, key, dressID, dressMeasurements, reviewIDs, dressGroupID) {
                                              this.goToItemView(
                                                dress,
                                                (parseInt(keyDressObj, 10) + 1).toString() + key,
                                                this.state.bestDressesIDs[keyDressObj].dressIDs[
                                                  key
                                                ],
                                                this.getMeasurementsFromConcat(
                                                  dressObj.measurement
                                                ),
                                                dressObj.reviewIDs[key],
                                                this.state.bestDressGroupIDs[keyDressObj]
                                                  .dressGroupID
                                              )
                                            }
                                          />
                                        );
                                      }}
                                    </ProgressiveImage>
                                    <div
                                      style={{ cursor: 'pointer', textAlign: 'left' }}
                                      onClick={() =>
                                        this.goToItemView(
                                          dress,
                                          (parseInt(keyDressObj, 10) + 1).toString() + key,
                                          this.state.bestDressesIDs[keyDressObj].dressIDs[key],
                                          this.getMeasurementsFromConcat(dressObj.measurement),
                                          dressObj.reviewIDs[key],
                                          this.state.bestDressGroupIDs[keyDressObj].dressGroupID
                                        )
                                      }
                                    >
                                      <p className="results-rating">
                                        Rated {this.getRating(dressObj.ratings[key])}/10 by women
                                        like you
                                      </p>
                                      <p className="results-brand">
                                        {dress.brand} ${this.getWholePrice(dress.price)}
                                      </p>
                                      <p className="results-color">
                                        {this.getNumColors(dress.color)}
                                      </p>
                                      {/* <p className="results-percentageMatch">
                                        {this.getPercentageMatch(
                                          this.state.bestDressGroupIDs[keyDressObj]
                                        )}
                                        % match
                                      </p> */}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })
                    )}
                  {/* </div>
                <div className="results-grid"> */}
                  {this.state.showMoreDresses &&
                    this.state.nextBestDressesLoaded &&
                    Object.entries(this.state.nextBestDresses).map(
                      ([keyDressObj, dressObj]) =>
                        dressObj.dresses.length > 0 &&
                        dressObj.dresses.map((dress, key) => {
                          return (
                            dress &&
                            dress.inStock && (
                              <div key={key} id={parseInt(keyDressObj, 10) + 1}>
                                {dress && (
                                  <div
                                    className="results-item-div"
                                    key={key}
                                    id={(parseInt(keyDressObj, 10) + 1).toString() + key}
                                    onMouseEnter={() => this.handleMouseEnter(keyDressObj, true)}
                                    onMouseLeave={() => this.handleMouseLeave()}
                                  >
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
                                            alt={dress.name}
                                            className="results-img"
                                            onMouseOver={e =>
                                              dress.img2
                                                ? (e.currentTarget.src = dress.img2)
                                                : console.log("don't have rollover")
                                            }
                                            onMouseOut={e =>
                                              dress.img2
                                                ? (e.currentTarget.src = dress.img)
                                                : console.log('no return')
                                            }
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
                                      style={{ cursor: 'pointer', textAlign: 'left' }}
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
                                      <p className="results-brand">
                                        {dress.brand} ${this.getWholePrice(dress.price)}
                                      </p>
                                      <p className="results-color">
                                        {this.getNumColors(dress.color)}
                                      </p>
                                      {/* <p className="results-percentageMatch">
                                        {this.getPercentageMatch(
                                          this.state.nextBestDressGroupIDs[keyDressObj]
                                        )}
                                        % match
                                      </p> */}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })
                    )}
                </div>
                {this.state.nextBestDressGroupIDs.length !== 0 &&
                  !this.state.showMoreDresses &&
                  this.state.bestDressesLoaded && (
                    <div className="results-loadMore-btn-div">
                      <div className="results-loadMore-wrapper">
                        <button className="results-loadMore-btn" onClick={this.showMoreDresses}>
                          <div className="click-loadmore" style={{ position: 'relative' }}>
                            Show near perfect matches
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                {this.state.showMoreDresses && this.state.bestDressesLoaded && (
                  <div className="results-review-wrapper">
                    <p className="results-review-text">Want to see more results?</p>
                    <p
                      className="results-review"
                      onClick={this.goToSubmitDress}
                      style={{ cursor: 'pointer' }}
                    >
                      Review a dress you own
                    </p>
                  </div>
                )}
                {this.state.bestDressGroupIDs.length === 0 && this.state.bestDressesLoaded && (
                  <div className="results-review-wrapper">
                    <p className="results-review-text">
                      There are no reviews for your exact measurements right now.
                    </p>
                    <p
                      className="results-review"
                      onClick={this.goToSubmitDress}
                      style={{ cursor: 'pointer' }}
                    >
                      Review a dress to help other women like you.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className={rightColClass}>
              <div className="results-rightCol-inner">
                <div className="results-menu-hide-div">
                  <img
                    src={downArrow}
                    alt="down arrow"
                    className="results-menu-hide-arrow"
                    onClick={this.dismissRecommendationPanel}
                  />
                </div>
                {this.state.currMeasurements && (
                  <div
                    className={
                      this.state.showCurrMeasurement
                        ? 'results-recommended-div'
                        : 'results-recommended-div-hide'
                    }
                  >
                    <p className="results-text">Recommended by women that are</p>
                    <p className="results-text-large">
                      {this.getHeightStr(this.state.currMeasurements.height)}, Bust{' '}
                      {this.state.currMeasurements.bust}, Waist {this.state.currMeasurements.waist},
                      Hips {this.state.currMeasurements.hips}{' '}
                    </p>
                  </div>
                )}
                <div className="results-measurements-wrapper">
                  {/* <form onSubmit={this.handleSubmit}>
                    <input
                      name="name"
                      type="text"
                      ref="resultsName"
                      value={name}
                      className="results-input"
                      onChange={this.handleInput}
                      placeholder="Add Your Name"
                    />
                  </form> */}
                  <p className="results-your-measurements-label">Your Measurements</p>
                  <p
                    className="results-your-measurements"
                    onClick={() =>
                      this.openModalHandler(
                        'Know your exact measurements? Create an account to edit'
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {this.getHeightStr(this.state.height)}, Bust {this.state.bust}, Waist{' '}
                    {this.state.waist}, Hips {this.state.hips}
                  </p>
                  <p
                    className="results-edit"
                    onClick={() =>
                      this.openModalHandler(
                        'Know your exact measurements? Create an account to edit'
                      )
                    }
                  >
                    Edit
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
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default withFirebase(Results);
