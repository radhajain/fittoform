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
      name: '', //TODO: Also for auth user
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
      showMoreDresses: false,
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
      this.state.showMoreDresses = this.props.location.state.showMoreDresses
        ? this.props.location.state.showMoreDresses
        : false;
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
    this.getRating = this.getRating.bind(this);
    this.getNextBestDressesID = this.getNextBestDressesID.bind(this);
    this.getNextBestDressesInfo = this.getNextBestDressesInfo.bind(this);
    this.dismissRecommendationPanel = this.dismissRecommendationPanel.bind(this);
    this.showRecommendationPanel = this.showRecommendationPanel.bind(this);
    this.isElementInViewport = this.isElementInViewport.bind(this);
    // this.handleScroll = this.handleScroll.bind(this);
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
              favorites: user.favorites ? user.favorites : [],
              requestedLinks: user.requestedLinks ? user.requestedLinks : []
            },
            () => {
              console.log(this.state);
              this.loadData();
            }
          );
        });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    this.loadData = this.loadData.bind(this);
    if (this._isMounted) {
      this.authlistener();
      // window.addEventListener('scroll', this.handleScroll);
      if (!this.state.authUser && this.props.location.state) {
        this.loadData();
      }
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  //Make cleaner
  // handleScroll() {
  //   for (var i = 0; i < 10; i++) {
  //     var currPage = document.getElementById(i);
  //     if (this.isElementInViewport(currPage)) {
  //       if (i === 0) {
  //         this.setState({
  //           currMeasurements: this.state.closestMeasurements,
  //           currDiv: 0
  //         });
  //       } else {
  //         if (this.state.currMeasurements !== this.state.nextBestDressGroupIDs[i - 1]) {
  //           this.setState({
  //             currMeasurements: this.state.nextBestDressGroupIDs[i - 1],
  //             currDiv: i
  //           });
  //         }
  //       }
  //     }
  //   }
  // }

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

  loadData() {
    this.getBestDressGroupID().then(result => {
      result[3].sort((a, b) => (a.diff > b.diff ? 1 : -1));
      let nextBestDresses = result[3].map(a => a.closestMeasurements);
      var exactMatchIdx = nextBestDresses.indexOf(result[0]);
      if (exactMatchIdx > -1) {
        nextBestDresses.splice(exactMatchIdx, 1);
      }

      var bestDressGroupIDs = nextBestDresses.slice(0, 3);
      var nextBestDressesArr = nextBestDresses.slice(3);
      console.log(result);
      console.log('bestDressGroupIDs are: ');
      console.log(bestDressGroupIDs);
      console.log('next best dresses are: ');
      console.log(nextBestDressesArr);
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
  //TODO: horizontal scroll

  getBestDressGroupID() {
    //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements
    // and this.state.dressGroupId
    var lowestDiff = Number.MAX_VALUE;
    var closestMeasurements, dressGroupID;
    var bestDressGroupIDs = [];
    var maxNextBestDiff = 3;
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
          dressIDs.push(dress.val().dress);
          dressRatings.push(dress.val().rating);
          if (dress.val().reviews) {
            dressReviews.push(dress.val().reviews);
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
      this.setState({
        bestDresses: bestDresses,
        bestDressesLoaded: true
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

  showMoreDresses() {
    if (!this.state.authUser) {
      this.setState({
        modalMsg: 'Create an account to see more dresses picked for you',
        isHomeModalShowing: true,
        modalDismiss: true
      });
    }
    this.getNextBestDressesID();
  }

  getNextBestDressesID(nextBestDressGroupIDs) {
    var promises = [];
    var nextBestDressesIDs = [];
    for (const dressGroupRef of nextBestDressGroupIDs) {
      promises.push(
        this.getDressesIDHelper(dressGroupRef.dressGroupID, dressGroupRef.concatMtms).then(
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
            var firstPage = document.getElementById(1);
            if (firstPage) {
              firstPage.scrollIntoView({ behavior: 'smooth' });
            }
          }
          // else if (this.state.divID) {
          //   var currPage = document.getElementById(this.state.divID);
          //   const yCoordinate = currPage.getBoundingClientRect().top - 200;
          //   window.scrollTo({
          //     top: yCoordinate
          //   });
          else {
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
    const itemDivClass = 'results-item-div';
    // this.state.dressesObjs.dresses.length === 1
    //   ? 'results-item-div'
    //   : 'results-item-div';
    var rightColClass = this.state.showRecInfo
      ? this.state.exactMatch
        ? 'results-rightCol results-rightCol-adjust'
        : 'results-rightCol'
      : 'hide';
    const placeholder = <div style={{ backgroundColor: '#E2F8F6', height: 500, width: 350 }} />;
    return (
      <div>
        <div className="results-fakeNav">
          <div className="results-fakeNav-leftCol"></div>
          <div className="results-fakeNav-rightCol"></div>
        </div>
        <div className="results-getReview-wrapper">
          <p className="results-getReview-text" onClick={this.showMakeRequestModal}>
            Have a particular dress in mind? Request a review
          </p>
        </div>
        <div className="results-container-outer">
          <div className="results-container-inner">
            <div className="results-leftCol">
              {/* <div className="results-leftCol-fakeNav"></div> */}
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
                            dress && (
                              <div key={key} id={parseInt(keyDressObj, 10) + 1}>
                                {dress && (
                                  <div
                                    className={itemDivClass}
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
                                            alt="dress image"
                                            className="results-img"
                                            onClick={() =>
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
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })
                    )}
                </div>
                {/* <div className="results-grid" id="0">
                  {this.state.dressesObjs.dresses &&
                    this.state.dressesObjs.dresses.map((dress, key) => {
                      return (
                        dress && (
                          <div className="results-col" id={'0' + key} key={key}>
                            <div
                              className={itemDivClass}
                              onMouseEnter={() => this.handleMouseEnter(0, false)}
                              onMouseLeave={() => this.handleMouseLeave()}
                            >
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
                                style={{ textAlign: 'left', cursor: 'pointer' }}
                              >
                                <p className="results-rating">
                                  Rated {this.getRating(this.state.dressesObjs.ratings[key])}/10 by
                                  women like you
                                </p>
                                <p className="results-brand">
                                  {dress.brand} ${this.getWholePrice(dress.price)}
                                </p>
                                <p className="results-color">{this.getNumColors(dress.color)}</p>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    })}
                </div> */}
                {this.state.nextBestDressGroupIDs.length !== 0 && !this.state.showMoreDresses && (
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
                <div className="results-grid">
                  {this.state.showMoreDresses &&
                    this.state.nextBestDressesLoaded &&
                    Object.entries(this.state.nextBestDresses).map(
                      ([keyDressObj, dressObj]) =>
                        dressObj.dresses.length > 0 &&
                        dressObj.dresses.map((dress, key) => {
                          return (
                            dress && (
                              <div key={key} id={parseInt(keyDressObj, 10) + 1}>
                                {dress && (
                                  <div
                                    className={itemDivClass}
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
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          );
                        })
                    )}
                </div>
                {this.state.showMoreDresses && (
                  <div className="results-review-wrapper">
                    <p
                      className="results-review"
                      onClick={this.goToSubmitDress}
                      style={{ cursor: 'pointer' }}
                    >
                      Want to see more results? Review one of your dresses
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
                    className="results-menu-hide-arrow"
                    onClick={this.dismissRecommendationPanel}
                  />
                </div>
                {this.state.showCurrMeasurement && this.state.currMeasurements && (
                  <div className="results-recommended-div">
                    <p className="results-text">Recommended by women that are</p>
                    <p className="results-text-large">
                      {this.getHeightStr(this.state.currMeasurements.height)}, Bust{' '}
                      {this.state.currMeasurements.bust}, Waist {this.state.currMeasurements.waist},
                      Hips {this.state.currMeasurements.hips}{' '}
                    </p>
                  </div>
                )}
                <div className="results-measurements-wrapper">
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
