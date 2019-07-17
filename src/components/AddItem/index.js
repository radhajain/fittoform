import React, { Component } from 'react';
import './AddItem.css';
import firebase from 'firebase';
import { withFirebase } from '../Firebase';
import { fromRenderProps } from 'recompose';
require('firebase/auth');

class AddItem extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      height: '',
      waist: '',
      bust: '',
      hips: '',
      dressLink: '',
      brand: '',
      price: '',
      img: '',
      userName: '',
      size: '',
      color: '',
      rating: '',
      straps: '',
      occassion: '',
      bra: '',
      neckline: '',
      style: '',
      material: '',
      comment: '',
      dressGroupID: '',
      braSize: '',
      USSize: '',
      dressID: '',
      items: [],
      uid: '',
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.getUserData = this.getUserData.bind(this); << May need for the user's actual measurements? TBD
    this.createMeasurementsAndGroupID = this.createMeasurementsAndGroupID.bind(this);
    this.makeConcatMeasurements = this.makeConcatMeasurements.bind(this);
    this.getDressID = this.getDressID.bind(this);
    this.createDressID = this.createDressID.bind(this);
    this.createReviewID = this.createReviewID.bind(this);
    this.addDressToGroup = this.addDressToGroup.bind(this);
  }

  /* Logic for creating a new item:
          1. Create a new dress (link, color, brand, price, img, etc) => dressID
          2. Create a new review (dressID, comment, rating, userID, measurements) 
          3. If measurements exist, get dressGroupID; else create measurements and dressGroup => dressGroupID (think of this like a clothing rack for each size)
          4. Add dress to dressGroup at dressGroupID (where dressGroup is a list of dressIDs with ratings for each size)
    */

  handleChange(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  }

  getDressID() {
    //Check to see if dress already exists -- if so, just create a review, otherwise create the dress itself
    const dressesRef = firebase.database().ref('dresses');
    //This is how to query a child property to see if it already exists in a collection
    dressesRef
      .orderByChild('name')
      .equalTo(this.state.name)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          var key = Object.keys(snapshot.val())[0];
          console.log('dress exists');
          this.setState({ dressID: key }, () => {
            this.createReviewID();
          });
        } else {
          console.log("dress doesn't exist");
          this.createDressID();
        }
      });
  }

  createDressID() {
    const dressesRef = firebase.database().ref('dresses');
    const newDressRef = dressesRef.push();
    newDressRef.set({
      dressLink: this.state.dressLink,
      color: this.state.color,
      brand: this.state.brand,
      name: this.state.name,
      age: this.state.age,
      price: this.state.price,
      img: this.state.img,
      length: this.state.length,
      occassion: this.state.occassion,
      bra: this.state.bra,
      style: this.state.style,
      neckline: this.state.neckline,
      straps: this.state.straps,
      material: this.state.material
    });
    var newDressKey = newDressRef.key;
    this.setState({ dressID: newDressKey }, () => {
      console.log('CREATE DRESS DONE');
      console.log(this.state);
      this.createReviewID();
    });
  }

  createReviewID() {
    //Create the review ref
    var user = firebase.auth().currentUser;
    const reviewsRef = firebase.database().ref('reviews');
    const newReviewRef = reviewsRef.push();
    newReviewRef.set({
      // uid: this.state.uid, << comment back in if user is putting in measurements
      userInfo: {
        height: this.state.height,
        waist: this.state.waist,
        bust: this.state.bust,
        hips: this.state.hips,
        bra: this.state.braSize,
        size: this.state.USSize,
        name: this.state.userName,
        age: this.state.age
      },
      dressID: this.state.dressID,
      comment: this.state.comment,
      size: this.state.size,
      rating: this.state.rating
    });
    var newReviewKey = newReviewRef.key;
    this.setState({ reviewID: newReviewKey }, () => {
      console.log('REVIEW CREATED');
      console.log(this.state);
      this.getGroupIDIfExists();
    });
  }

  makeConcatMeasurements() {
    var string =
      this.state.height + ', ' + this.state.waist + ', ' + this.state.bust + ', ' + this.state.hips;
    return string;
  }

  getGroupIDIfExists() {
    // Gets the dressGroup corresponding to the user's measurements (if exists, otherwise creates measurements and dressGroup)
    // Structure is: Measurements -> groupID; groupID -> [dressID, dressID ... etc]
    const concatUsrMeasurements = this.makeConcatMeasurements();
    const measurementsRef = firebase.database().ref('measurements');
    measurementsRef
      .orderByChild('concatMtms')
      .equalTo(concatUsrMeasurements)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          var groupID = Object.values(snapshot.val())[0].dressGroupID;
          this.setState({ dressGroupID: groupID }, () => {
            console.log('MAtched existing measurements');
            //If measurements already exist, then add dress to the corresponding group of dresses
            this.addDressToGroup();
          });
        } else {
          //If measurements don't exist, then create new measurements & group, and add dress to group
          this.createMeasurementsAndGroupID();
        }
      });
  }

  addDressToGroup() {
    console.log('adding dress to group....');
    console.log(this.state.dressGroupID);
    if (this.state.dressGroupID) {
      const dressGroupRef = firebase
        .database()
        .ref('dressGroup')
        .child(this.state.dressGroupID);
      dressGroupRef
        .orderByChild('dress')
        .equalTo(this.state.dressID)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            //If dress already exists in group id, update rating of dress
            var currRating = parseInt(Object.values(snapshot.val())[0].rating, 10);
            var currCount = Object.values(snapshot.val())[0].count;
            var newRating = Math.round(
              (currRating * currCount + this.state.rating) / (currCount + 1)
            );
            var updatedCount = currCount + 1;
            var key = Object.keys(snapshot.val())[0];
            dressGroupRef.child(key).update({
              count: updatedCount,
              rating: newRating,
              reviews: {}
            });
            var newReviewRef = dressGroupRef
              .child(key)
              .child('reviews')
              .push();
            newReviewRef.set({
              reviewID: this.state.reviewID
            });
          } else {
            //Add a new dress
            const newDressRef = dressGroupRef.push();
            newDressRef.set({
              dress: this.state.dressID,
              rating: this.state.rating,
              count: 1
            });
            var newReviewRef = newDressRef.child('reviews').push();
            newReviewRef.set({
              reviewID: this.state.reviewID
            });
          }
        });
    }
  }

  createMeasurementsAndGroupID() {
    //create dressGroup
    const dressGroupsRef = firebase.database().ref('dressGroup');
    const newDressGroupRef = dressGroupsRef.push();
    var newDressRef = newDressGroupRef.push();
    newDressRef.set({
      dress: this.state.dressID,
      rating: this.state.rating,
      count: 1
    });
    var newReviewRef = newDressRef.child('reviews').push();
    newReviewRef.set({
      reviewID: this.state.reviewID
    });
    console.log('NEW DRESS GROUP created');
    //Push groupIDDressref to measurements
    const measurementsRef = firebase.database().ref('measurements');
    var newMeasurementRef = measurementsRef.push();
    var newDressGroupKey = newDressGroupRef.key;
    var concatUsrMeasurements = this.makeConcatMeasurements();
    this.setState({ dressGroupID: newDressGroupKey }, () => {
      console.log('NEW MEAUSREMENTS CREATED');
      console.log(this.state);
      newMeasurementRef.set({
        height: this.state.height,
        waist: this.state.waist,
        bust: this.state.bust,
        hips: this.state.hips,
        concatMtms: concatUsrMeasurements,
        dressGroupID: newDressGroupKey
        //Maybe want a group ID for users?
      });
    });
  }

  getUserData(user) {}

  handleSubmit(e) {
    e.preventDefault();
    this.getDressID();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // User is signed in.
          this.setState({ userID: user.uid });
        } else {
          console.log('no user is signed in');
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  render() {
    return (
      <div className="container">
        <section className="add-item">
          <h1>Add Dress</h1>
          <form className="additem-form" onSubmit={this.handleSubmit}>
            <input
              className="add-input"
              type="text"
              name="userName"
              placeholder="What is your name?"
              onChange={this.handleChange}
              value={this.state.userName}
            />
            <input
              className="add-input"
              type="text"
              name="age"
              placeholder="What is your age? e.g. 23F"
              onChange={this.handleChange}
              value={this.state.age}
            />
            <input
              className="add-input"
              type="number"
              name="height"
              placeholder="How tall are you in inches?"
              onChange={this.handleChange}
              value={this.state.height}
            />
            <input
              className="add-input"
              type="number"
              name="waist"
              placeholder="How wide is your waist in inches?"
              onChange={this.handleChange}
              value={this.state.waist}
            />
            <input
              className="add-input"
              type="number"
              name="bust"
              placeholder="How many inches is your bust?"
              onChange={this.handleChange}
              value={this.state.bust}
            />
            <input
              className="add-input"
              type="text"
              name="braSize"
              placeholder="What is your bra size?"
              onChange={this.handleChange}
              value={this.state.braSize}
            />
            <input
              className="add-input"
              type="number"
              name="USSize"
              placeholder="What US size do you generally wear?"
              onChange={this.handleChange}
              value={this.state.USSize}
            />
            <input
              className="add-input"
              type="number"
              name="hips"
              placeholder="How many inches are your hips?"
              onChange={this.handleChange}
              value={this.state.hips}
            />
            <input
              className="add-input"
              type="text"
              name="dressLink"
              placeholder="What's the link to your dress?"
              onChange={this.handleChange}
              value={this.state.dressLink}
            />
            <input
              className="add-input"
              type="text"
              name="brand"
              placeholder="What brand is the dress?"
              onChange={this.handleChange}
              value={this.state.brand}
            />
            <input
              className="add-input"
              type="text"
              name="name"
              placeholder="What is the name of the dress?"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <input
              className="add-input"
              type="text"
              name="length"
              placeholder="How long is the dress? e.g. mini, midi, maxi, knee, high-low"
              onChange={this.handleChange}
              value={this.state.length}
            />
            <input
              className="add-input"
              type="number"
              name="price"
              placeholder="How much was the dress?"
              onChange={this.handleChange}
              value={this.state.price}
            />
            <input
              className="add-input"
              type="text"
              name="img"
              placeholder="What's the link to the image?"
              onChange={this.handleChange}
              value={this.state.img}
            />
            <input
              className="add-input"
              type="text"
              name="neckline"
              placeholder="What's the neckline? e.g. high, normal, plunge"
              onChange={this.handleChange}
              value={this.state.neckline}
            />
            <input
              className="add-input"
              type="text"
              name="straps"
              placeholder="What's the straps? e.g. strapless, short-sleeve, off-shoulder, asymmetric, tank "
              onChange={this.handleChange}
              value={this.state.straps}
            />
            <input
              className="add-input"
              type="text"
              name="bra"
              placeholder="What type of bra do you wear with it? e.g. any, strapless, none"
              onChange={this.handleChange}
              value={this.state.bra}
            />
            <input
              className="add-input"
              type="text"
              name="style"
              placeholder="What's the style of the dress? e.g. bodycon, fit-and-flare, shift, t-shirt, wrap, shift, slit"
              onChange={this.handleChange}
              value={this.state.style}
            />
            <input
              className="add-input"
              type="text"
              name="occassion"
              placeholder="What occassion? e.g. Night-out, Island-Vibes, Wedding-guest, Daytime-cute, Safe-For-Work, Day-to-Night, 90s-vibes"
              onChange={this.handleChange}
              value={this.state.occassion}
            />
            <input
              className="add-input"
              type="text"
              name="material"
              placeholder="What's the material of the dress? e.g. jersey, silk, lace, beaded, denim, chiffon, cotton, leather, linen, sequin, velvet, crepe"
              onChange={this.handleChange}
              value={this.state.material}
            />
            <input
              className="add-input"
              type="text"
              name="size"
              placeholder="What size did you buy?"
              onChange={this.handleChange}
              value={this.state.size}
            />
            <input
              className="add-input"
              type="text"
              name="color"
              placeholder="What colors is the dress available in?"
              onChange={this.handleChange}
              value={this.state.color}
            />
            <input
              className="add-input"
              type="number"
              name="rating"
              placeholder="What would you rate this dress from 1-10?"
              onChange={this.handleChange}
              value={this.state.rating}
            />
            <input
              className="add-input"
              type="text"
              name="comment"
              placeholder="How would you review this dress?"
              onChange={this.handleChange}
              value={this.state.comment}
            />
            <button>Add Item</button>
          </form>
        </section>
        <section className="display-item">
          <div className="wrapper">
            <ul></ul>
          </div>
        </section>
      </div>
    );
  }
}

export default withFirebase(AddItem);
