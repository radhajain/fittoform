import React, { Component } from 'react';
import firebase from 'firebase';
import { withFirebase } from '../Firebase';
import backBtn from '../../assets/images/back-btn.png';
import './Item.css';
import { FooterSmall } from '../Footer';
import Modal from '../Modal';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.state;
    console.log(this.state);
    var review = {
      comment: '',
      size: '',
      rating: '',
      name: '',
      userInfo: {
        height: '',
        waist: '',
        hips: '',
        bust: '',
        age: ''
      }
    };
    this.state.reviews = [review];
    this.state.cachedReviewIDs = [];
    this.state.reviewsFound = false;
    this.state.isModalShowing = false;
    this.state.shoppedLinks = [];
    this.state.modalDesc =
      'You will be redirected to ' + this.state.item.brand + ' to buy the dress.';
    this.getHeightStr = this.getHeightStr.bind(this);
    this.getReviewData = this.getReviewData.bind(this);
    this.goToResultsView = this.goToResultsView.bind(this);
    this.getReviewsFromCache = this.getReviewsFromCache.bind(this);
    this.getReviewFromReviewID = this.getReviewFromReviewID.bind(this);
    this.shopItem = this.shopItem.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.goToSignIn = this.goToSignIn.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getNumColors = this.getNumColors.bind(this);
  }

  getHeightStr(height) {
    var heightFt = Math.floor(height / 12);
    var heightIn = height % 12;
    return heightFt + "'" + heightIn;
  }

  goToSignIn = () => {
    this.props.history.push({
      pathname: '/signin'
    });
  };

  //TODO: data cleanup: add all reviewIDs to the dressGroup where the dressGroupObj dressID matches dressID
  getReviewData() {
    const reviewsRef = firebase.database().ref('reviews');
    var mmts = this.state.dressMeasurements;
    var reviews = [];
    var reviewQuery = reviewsRef.orderByChild('dressID').equalTo(this.state.dressID);
    return new Promise((resolve, reject) => {
      reviewQuery.once('value').then(snapshot => {
        snapshot.forEach(data => {
          var reviewerMmts = data.val().userInfo;
          //If coming through favorites:
          if (!mmts) {
            var diffSq =
              Math.pow(reviewerMmts.height - this.state.height, 2) +
              Math.pow(reviewerMmts.waist - this.state.waist, 2) +
              Math.pow(reviewerMmts.bust - this.state.bust, 2) +
              Math.pow(reviewerMmts.hips - this.state.hips, 2);
            if (Math.sqrt(diffSq) < 3) {
              var review = {
                comment: data.val().comment,
                size: data.val().size,
                rating: data.val().rating,
                dressID: this.state.dressID,
                id: data.key,
                userInfo: data.val().userInfo
              };
              reviews.push(review);
            }
          } else if (
            mmts &&
            mmts.height == reviewerMmts.height &&
            mmts.bust == reviewerMmts.bust &&
            mmts.waist == reviewerMmts.waist &&
            mmts.hips == reviewerMmts.hips
          ) {
            var review = {
              comment: data.val().comment,
              size: data.val().size,
              rating: data.val().rating,
              dressID: this.state.dressID,
              id: data.key,
              userInfo: data.val().userInfo
            };
            reviews.push(review);
          }
        });
        resolve(reviews);
      });
    });
  }

  getReviewsFromCache(reviewIDObjs) {
    var reviewIDs = [];
    for (var reviewObj in reviewIDObjs) {
      var reviewID = reviewIDObjs[reviewObj].reviewID;
      reviewIDs.push(reviewID);
    }
    this.setState({
      cachedReviewIDs: reviewIDs
    });
    var promises = [];
    for (const reviewID of reviewIDs) {
      promises.push(this.getReviewFromReviewID(reviewID));
    }
    Promise.all(promises).then(reviews => {
      if (reviews.length !== 0) {
        this.setState({
          reviews: reviews,
          reviewsFound: true
        });
      }
    });
  }

  //Helper function for getReviewsFromCache
  getReviewFromReviewID(reviewID) {
    var reviewRef = firebase.database().ref('reviews');
    return reviewRef
      .child(`${reviewID}`)
      .once('value')
      .then(snapshot => {
        console.log(snapshot.val());
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
        this.setState({
          authUser: true,
          uid: authUser.uid
        });
        this.getUserData(authUser.uid).then(user => {
          console.log(user);
          this.setState({
            email: user.email,
            name: user.name,
            waist: user.waist,
            hips: user.hips,
            height: user.height,
            bust: user.bust,
            size: user.size,
            bra: user.bra,
            favorites: user.favorites ? user.favorites : [],
            shoppedLinks: user.shoppedLinks ? user.shoppedLinks : []
          });
        });
      }
    });
  }

  componentDidMount() {
    console.log(this.props.location.state.cachedReviews);
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    if (this._isMounted) {
      this.authlistener();
    }

    if (this.props.location.state.cachedReviews) {
      //This is if the groupDressID had a reviews object linked to it (this is the case for recent reviews)
      this.getReviewsFromCache(this.props.location.state.cachedReviews);
    } else {
      //For the first few reviews, there is no reviews object linked to dressIDs, in which case go through all reviews and
      // find ones that match dressID and closestMeasurements
      this.getReviewData().then(reviews => {
        console.log(reviews);
        if (reviews.length !== 0) {
          this.setState({
            reviews: reviews,
            reviewsFound: true
          });
        }
        //Updates the firebase database with the found review, so that in the future it will be cached
        // var dressGroupRef = firebase.database().ref('dressGroup').child(this.state.dressGroupID).orderByChild('dressID').equalTo(this.state.dressID);
        // dressGroupRef.update({
        //     reviews: {}
        // });

        // for (var review of reviews) {
        //     var newReviewRef = dressGroupRef.push();
        //     newReviewRef.set({
        //         reviewID: review.id
        //     });
        // }
      });
    }
  }

  goToResultsView() {
    this.props.history.push({
      pathname: '/results',
      state: {
        height: this.state.height,
        waist: this.state.waist,
        hips: this.state.hips,
        bust: this.state.bust,
        bra: this.state.bra,
        size: this.state.size,
        name: this.state.name,
        closestMeasurements: this.state.closestMeasurements,
        showMoreDresses: this.state.showMoreDresses,
        fromItem: true,
        divID: this.state.divID
      }
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

  shopItem() {
    if (this.state.authUser) {
      var shoppedLinks = this.state.shoppedLinks;
      shoppedLinks.push(this.state.dressID);
      this.setState({
        shoppedLinks: shoppedLinks
      });
      let UserRef = firebase
        .database()
        .ref('users')
        .child(`${this.state.uid}`);
      if (UserRef) {
        UserRef.update({
          shoppedLinks: shoppedLinks
        });
      }
    }
    window.open(this.state.item.dressLink, '_blank');
  }

  closeModalHandler() {
    this.setState({
      isModalShowing: false
    });
  }

  createAccount = (name, email, password) => {
    console.log('account being created!');
    console.log(name + ', ' + email + ', ' + password);
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
        this.setState(
          {
            isModalShowing: false
          },
          () => {
            window.open(this.state.item.dressLink, '_blank');
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }
  getNumColors(colors) {
    if (colors.indexOf(',') > -1) {
      var colorsArr = colors.split(',');
      return colorsArr.length;
    } else {
      return 1;
    }
  }

  render() {
    return (
      <div className="itemView">
        <div className="itemView-fakeNav"></div>
        <div className="itemView-c1">
          <div className="itemView-c1-inner">
            <div className="itemView-c1-left">
              <div className="itemView-img-wrapper">
                <button className="itemView-backbtn" onClick={() => this.goToResultsView()}>
                  <img src={backBtn} className="itemView-back-arrow" />
                </button>
                <img
                  alt={this.state.item.name}
                  src={this.state.item.img}
                  className="itemView-img"
                  onMouseOver={e =>
                    this.state.item.img2
                      ? (e.currentTarget.src = this.state.item.img2)
                      : console.log("don't have rollover")
                  }
                  onMouseOut={e =>
                    this.state.item.img2
                      ? (e.currentTarget.src = this.state.item.img)
                      : console.log('no return')
                  }
                />
              </div>
            </div>
            <div className="itemView-c1-right">
              {/* <Modal
                className="modal"
                show={this.state.isModalShowing}
                close={this.closeModalHandler}
                createAccount={this.createAccount}
                goToSignIn={this.goToSignIn}
                name={this.state.name}
                btnMsg="Shop item"
                message="Before you go, create an account to save your results"
                desc={this.state.modalDesc}
              ></Modal> */}
              <div className="itemView-c1-text">
                <div className="itemView-title-div">
                  <p className="itemView-item-title">{this.state.item.name}</p>
                  <p className="itemView-item-price">${this.state.item.price}</p>
                </div>
                <div className="itemView-c1-desc">
                  {this.state.reviewsFound && (
                    <p className="itemView-item-size">
                      Recommended size: {this.state.reviews[0].size}
                    </p>
                  )}
                  {this.getNumColors(this.state.item.color) !== 1 && (
                    <p className="itemView-item-brand">
                      Available
                      <span style={{ textTransform: 'lowercase' }}>
                        {' '}
                        in {this.state.item.color}
                      </span>
                    </p>
                  )}
                  {this.state.item.brand !== this.state.item.distributor && (
                    <p className="itemView-item-brand" style={{ marginTop: 0 }}>
                      {this.state.item.brand}
                    </p>
                  )}
                  {!this.state.item.inStock && (
                    <p className="itemView-comingback">Coming back in stock soon</p>
                  )}

                  <button className="itemView-shop-btn" onClick={this.shopItem}>
                    Shop on {this.state.item.distributor}
                  </button>

                  <p className="itemView-shipping">
                    {this.state.item.distributor} has free shipping{' '}
                    {this.state.item.freeShippingAmount !== 0 && (
                      <span>on orders over ${this.state.item.freeShippingAmount}</span>
                    )}{' '}
                    {this.state.item.freeReturns && <span>& free returns</span>}{' '}
                  </p>
                </div>

                <hr />
                {this.state.reviewsFound && (
                  <div className="itemView-reviews-header">
                    <p className="itemView-review-title">
                      See what other people with your measurements have to say
                    </p>
                    <p className="itemView-text-small">
                      <i>
                        Your measurements: {this.getHeightStr(this.state.height)}, bust:{' '}
                        {this.state.bust}, waist: {this.state.waist}, hips: {this.state.hips}
                      </i>
                    </p>
                  </div>
                )}
                {this.state.reviewsFound &&
                  this.state.reviews.map((review, key) => {
                    return (
                      <div className="itemView-review" key={key}>
                        <p className="itemView-numRating">{review.rating}/10</p>
                        <div>
                          <p className="itemView-comment">{review.comment}</p>
                          <p className="itemView-review-name">{review.userInfo.name}</p>
                          <p className="itemView-item-measurements">
                            {review.userInfo.age}, {this.getHeightStr(review.userInfo.height)},
                            bust: {review.userInfo.bust}", waist: {review.userInfo.waist}", hips:{' '}
                            {review.userInfo.hips}"{' '}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default withFirebase(Item);
