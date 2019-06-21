import React, { Component } from 'react';
import firebase from 'firebase';
import { withFirebase } from'../Firebase';
import { fromRenderProps } from 'recompose';
require('firebase/auth')

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
            size: '',
            color: '',
            rating: '',
            comment: '',
            dressID: "",
            items: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.getDressID = this.getDressID.bind(this);
        this.createDressID = this.createDressID.bind(this);
        this.createReviewID = this.createReviewID.bind(this);
        this.addDressToGroup = this.addDressToGroup.bind(this);
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
        console.log(this.state);
    }

      getDressID() {
        //Create the dress ref
        // check if dress doesn't already exist -- still some synchronisation issues here
        const dressesRef = firebase.database().ref('dresses');
          dressesRef.once('value', snapshot => {
            snapshot.forEach((DBdress) => {
              console.log(DBdress.val())
              if (DBdress.val().dressLink === this.state.dressLink) {
                //If user measurements exist, get the groupID
                this.setState({dressID: DBdress.key}, () => {
                  console.log("MAtched existing dress")
                  this.createReviewID();
                });
              }
            });
            this.createDressID();
          });
      }


      createDressID() {
        console.log(this.state.dressID);
        if (!this.state.dressID) {
          const dressesRef = firebase.database().ref('dresses');
          const newDressRef = dressesRef.push();
          newDressRef.set({
            dressLink: this.state.dressLink,
            color: this.state.color
          });
          var newDressKey = newDressRef.key;
          this.setState({dressID: newDressKey}, () => {
            console.log("CREATE DRESS DONE")
            console.log(this.state);
            this.createReviewID();
          });
        } else {
          this.createReviewID();
        }

      }

  

      createReviewID() {
        //Create the review ref
        const reviewsRef = firebase.database().ref('reviews');
        const newReviewRef = reviewsRef.push();
        newReviewRef.set({
          //TODO: add user ID
          userInfo: {height: this.state.height, waist: this.state.waist, bust: this.state.bust, hips: this.state.hips},
          dressID: this.state.dressID,
          comment: this.state.comment,
          size: this.state.size,
          rating: this.state.rating
        });
        var newReviewKey = newReviewRef.key;
        this.setState({reviewID: newReviewKey}, () => {
          console.log("REVIEW CREATED");
          console.log(this.state);
          this.getGroupIDIfExists();
        });
      }

      measurementsExist(mts, DBmts) {
        console.log(DBmts);
        return (mts.height === DBmts.height && mts.waist === DBmts.waist && mts.bust === DBmts.bust && mts.hips === DBmts.hips);
      }


      getGroupIDIfExists() {
        const userMeasurments = {
          height: this.state.height,
          waist: this.state.waist,
          bust: this.state.bust,
          hips: this.state.hips
        };
        const measurementsRef = firebase.database().ref('measurements');
        measurementsRef.once('value', snapshot => {
          snapshot.forEach((DBmts) => {
            if (this.measurementsExist(userMeasurments, DBmts.val())) {
              //If user measurements exist, get the groupID
              this.setState({dressGroupID: DBmts.val().groupIDDresses}, () => {
                console.log("MAtched existing measurements")
                this.addDressToGroup();
              });
            }
          });
          this.addDressToGroup() ;
        });

      }

      addDressToGroup() {
        if (this.state.dressGroupID) {
          const groupIDDressesRef = firebase.database().ref('groupIDDresses').child(this.state.dressGroupID);
          //TODO: Need to check if dress already exists in group id -- if so, update rating
          const newDressRef = groupIDDressesRef.push();
          newDressRef.set({
            dress: this.state.dressID,
            rating: this.state.rating
          });
        } else {
          //create groupIDDresses
          const groupIDDressesRef = firebase.database().ref('groupIDDresses');
          const newGroupIDDressesRef = groupIDDressesRef.push();
          newGroupIDDressesRef.set({
            dress: this.state.dressID,
            rating: this.state.rating
          });
          //Push groupIDDressref to measurements
          const measurementsRef = firebase.database().ref('measurements');
          var newMeasurementRef = measurementsRef.push();
          var newGroupIDDressesKey = newGroupIDDressesRef.key;
          this.setState({groupIDDressesID: newGroupIDDressesKey}, () => {
              console.log("NEW GROUP ID CREATED");
              console.log(this.state);
              newMeasurementRef.set({
                height: this.state.height,
                waist: this.state.waist,
                bust: this.state.bust,
                hips: this.state.hips,
                groupIDDresses: newGroupIDDressesKey
              });
          });    
        }
      }


      handleSubmit(e) {
        e.preventDefault();
        this.createDressID();
      }

      //TODO: get user id
      getUserData(uid) {
        console.log(uid);
        let UserRef = this.props.firebase.user(uid);
        console.log(UserRef);
        UserRef.on('value', (snapshot) => {
          this.setState({
            userID: snapshot.key
          });
          let user = snapshot.val();
          this.setState({
            user: user
          });
        });
        console.log(this.state)
      }

      componentDidMount() {

      }

    render() {
        return (
        <div className='container'>
          <section className='add-item'>
            <h1>Add Dress</h1>
              <form onSubmit={this.handleSubmit}>
                <input type="number" name="height" placeholder="How tall are you in inches?" onChange={this.handleChange} value={this.state.height}/>  
                <input type="number" name="waist" placeholder="How wide is your waist in inches?" onChange={this.handleChange} value={this.state.waist}/>
                <input type="number" name="bust" placeholder="How many inches is your bust?" onChange={this.handleChange} value={this.state.bust}/>
                <input type="number" name="hips" placeholder="How many inches are your hips?" onChange={this.handleChange} value={this.state.hips}/>
                <input type="text" name="dressLink" placeholder="What's the link to your dress?" onChange={this.handleChange} value={this.state.dressLink} />
                <input type="text" name="size" placeholder="What size did you buy?" onChange={this.handleChange} value={this.state.size}/>
                <input type="text" name="color" placeholder="What color did you buy?" onChange={this.handleChange} value={this.state.color}/>
                <input type="number" name="rating" placeholder="What would you rate this dress from 1-10?" onChange={this.handleChange} value={this.state.rating}/>
                <input type="text" name="comment" placeholder="How would you review this dress?" onChange={this.handleChange} value={this.state.comment}/>
                <button>Add Item</button>
              </form>
          </section>
          <section className='display-item'>
            <div className='wrapper'>
              <ul>
              </ul>
            </div>
          </section>
        </div>
        );
    }
 }

export default withFirebase(AddItem);