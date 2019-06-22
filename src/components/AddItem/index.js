import React, { Component } from 'react';
import './AddItem.css';
import firebase from 'firebase';
import { withFirebase } from'../Firebase';
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
            name: '',
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
            groupIDDressesID: '',
            dressID: "",
            items: [],
            uid: "",
        }
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
          3. If measurements exist, get groupID; else create measurements and groupID => groupIDDresses (think of this like a clothing rack for each size)
          4. Add dress to groupIDDresses at groupIDDressesID (where groupIDDresses is a list of dressIDs with ratings for each size)
    */




    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
        console.log(this.state);
    }

      getDressID() {
        //Check to see if dress already exists -- if so, just create a review, otherwise create the dress itself
        const dressesRef = firebase.database().ref('dresses');
        //This is how to query a child property to see if it already exists in a collection
        dressesRef.orderByChild("dressLink").equalTo(this.state.dressLink).once('value', snapshot => {
          if (snapshot.exists()) {
            var key = Object.keys(snapshot.val())[0];
            console.log("dress exists");
            this.setState({dressID: key}, () => {
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
          price: this.state.price,
          img: this.state.img,
          length: this.state.length,
          occassion: this.state.occassion,
          bra: this.state.bra,
          style: this.state.style,
          neckline: this.state.neckline,
          straps: this.state.straps,
          material: this.state.material,
        });
        var newDressKey = newDressRef.key;
        this.setState({dressID: newDressKey}, () => {
          console.log("CREATE DRESS DONE")
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

      // measurementsExist(mts, DBmts) {
      //   console.log(DBmts);
      //   return (mts.height === DBmts.height && mts.waist === DBmts.waist && mts.bust === DBmts.bust && mts.hips === DBmts.hips);
      // }


      makeConcatMeasurements() {
        var string = this.state.height + ", " + this.state.waist + ", " + this.state.bust + ", " + this.state.hips;
        return string;
      }   

      getGroupIDIfExists() {
        const userMeasurments = {
          height: this.state.height,
          waist: this.state.waist,
          bust: this.state.bust,
          hips: this.state.hips
        };
        const concatUsrMeasurements = this.makeConcatMeasurements();
        const measurementsRef = firebase.database().ref('measurements');
        measurementsRef.orderByChild("concatMtms").equalTo(concatUsrMeasurements).once('value', snapshot => {
          if (snapshot.exists()) {
            var groupID = Object.values(snapshot.val())[0].groupIDDresses;
            this.setState({groupIDDressesID: groupID}, () => {
              console.log("MAtched existing measurements")
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
        console.log("adding dress to group....");
        console.log(this.state.groupIDDressesID);
        if (this.state.groupIDDressesID) {
          const groupIDDressesRef = firebase.database().ref('groupIDDresses').child(this.state.groupIDDressesID);
          groupIDDressesRef.orderByChild("dress").equalTo(this.state.dressID).once('value', snapshot => {
            if (snapshot.exists()) {
              //If dress already exists in group id, update rating of dress
              var currRating = Object.values(snapshot.val())[0].rating;
              var currCount = Object.values(snapshot.val())[0].count;
              var newRating = (currRating*currCount + this.state.rating)/(currCount + 1)
              var updatedCount = currCount + 1;
              var key = Object.keys(snapshot.val())[0];
              groupIDDressesRef.child(key).update({
                count: updatedCount,
                rating: newRating
              });
            } else {
              //Add a new dress

              const newDressRef = groupIDDressesRef.push();
              newDressRef.set({
                dress: this.state.dressID,
                rating: this.state.rating,
                count: 1,
              });
            }
          })
        }
      }


      createMeasurementsAndGroupID() {
        //create groupIDDresses
        const groupIDDressesRef = firebase.database().ref('groupIDDresses');
        const newGroupIDDressesRef = groupIDDressesRef.push();
        var newDressRef = newGroupIDDressesRef.push();
        newDressRef.set({
          dress: this.state.dressID,
          rating: this.state.rating,
          count: 1
        });
        console.log("NEW GROUPIDDRESSES created");
        //Push groupIDDressref to measurements
        const measurementsRef = firebase.database().ref('measurements');
        var newMeasurementRef = measurementsRef.push();
        var newGroupIDDressesKey = newGroupIDDressesRef.key;
        var concatUsrMeasurements = this.makeConcatMeasurements();
        this.setState({groupIDDressesID: newGroupIDDressesKey}, () => {
            console.log("NEW MEAUSREMENTS CREATED");
            console.log(this.state);
            newMeasurementRef.set({
              height: this.state.height,
              waist: this.state.waist,
              bust: this.state.bust,
              hips: this.state.hips,
              concatMtms: concatUsrMeasurements,
              groupIDDresses: newGroupIDDressesKey
              //Maybe want a group ID for users?
            });
        });    
      }

      getUserData(user) {

      }


      handleSubmit(e) {
        e.preventDefault();
        this.getDressID();
      }


      componentDidMount() {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            this.setState({userID: user.uid});
          } else {
            console.log("no user is signed in");
            // No user is signed in.
          }
        }.bind(this));
      }



    render() {
        return (
        <div className='container'>
          <section className='add-item'>
            <h1>Add Dress</h1>
              <form onSubmit={this.handleSubmit}>
                <input className="add-input" type="number" name="height" placeholder="How tall are you in inches?" onChange={this.handleChange} value={this.state.height}/>  
                <input className="add-input" type="number" name="waist" placeholder="How wide is your waist in inches?" onChange={this.handleChange} value={this.state.waist}/>
                <input className="add-input" type="number" name="bust" placeholder="How many inches is your bust?" onChange={this.handleChange} value={this.state.bust}/>
                <input className="add-input" type="number" name="hips" placeholder="How many inches are your hips?" onChange={this.handleChange} value={this.state.hips}/>
                <input className="add-input" type="text" name="dressLink" placeholder="What's the link to your dress?" onChange={this.handleChange} value={this.state.dressLink} />
                <input className="add-input" type="text" name="brand" placeholder="What brand is the dress?" onChange={this.handleChange} value={this.state.brand} />
                <input className="add-input" type="text" name="name" placeholder="What is the name of the dress?" onChange={this.handleChange} value={this.state.name} />
                <input className="add-input" type="text" name="length" placeholder="How long is the dress? e.g. " onChange={this.handleChange} value={this.state.length} />
                <input className="add-input" type="number" name="price" placeholder="How much was the dress?" onChange={this.handleChange} value={this.state.price} />
                <input className="add-input" type="text" name="img" placeholder="What's the link to the image?" onChange={this.handleChange} value={this.state.img} />
                <input className="add-input" type="text" name="neckline" placeholder="What's the neckline? e.g. high, normal, plunge" onChange={this.handleChange} value={this.state.neckline} />
                <input className="add-input" type="text" name="straps" placeholder="What's the straps? e.g. strapless, short-sleeve, off-shoulder, asymmetric, tank " onChange={this.handleChange} value={this.state.straps} />
                <input className="add-input" type="text" name="bra" placeholder="What type of bra do you wear with it? e.g. any, strapless, none" onChange={this.handleChange} value={this.state.bra} />
                <input className="add-input" type="text" name="style" placeholder="What's the style of the dress? e.g. bodycon, fit-and-flare, shift, t-shirt, wrap" onChange={this.handleChange} value={this.state.style} />
                <input className="add-input" type="text" name="occassion" placeholder="What occassion? e.g. Night out, Island Vibes, Wedding guest, Daytime cute  " onChange={this.handleChange} value={this.state.occassion} />
                <input className="add-input" type="text" name="material" placeholder="What's the material of the dress? e.g. jersey, silk, lace, beaded, denim, chiffon, cotton, leather, linen, sequin, velvet" onChange={this.handleChange} value={this.state.material} />
                <input className="add-input" type="text" name="size" placeholder="What size did you buy?" onChange={this.handleChange} value={this.state.size}/>
                <input className="add-input" type="text" name="color" placeholder="What color did you buy?" onChange={this.handleChange} value={this.state.color}/>
                <input className="add-input" type="number" name="rating" placeholder="What would you rate this dress from 1-10?" onChange={this.handleChange} value={this.state.rating}/>
                <input className="add-input" type="text" name="comment" placeholder="How would you review this dress?" onChange={this.handleChange} value={this.state.comment}/>
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