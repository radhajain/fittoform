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
            dressLink: '',
            size: '',
            color: '',
            rating: '',
            review: '',
            items: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUserData = this.getUserData.bind(this);
        firebase.auth().onAuthStateChanged(function(authUser) {
          if (authUser) {
            console.log(authUser);
            var uid = authUser.uid;
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
            // console.log(this.state)this.getUserData(authUser.uid);
          } 
        });
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

      handleSubmit(e) {
        e.preventDefault();
        //Create the dress ref
        // TODO: need to check if dress doesn't already exist
        const dressesRef = firebase.database().ref('dresses');
        const dressItem = {
          dressLink: this.state.dressLink,
          color: this.state.color
        }
        console.log(dressItem);
        dressesRef.push(dressItem).then((snap) => {
          this.state.dressID = snap.key
        });
       
        //Create the review ref
        const reviewsRef = firebase.database().ref('reviews');
        const reviewItem = {
          userID: this.state.userID,
          dressID: this.state.dressID,
          comment: this.state.comment,
          size: this.state.size,
          rating: this.state.rating
        }
        console.log(reviewItem);
        reviewsRef.push(reviewItem).then((snap) => {
          this.state.reviewID = snap.key
        });
        // TODO: add reviewID to dress object

        //Create the measurements ref
        const measurementsRef = firebase.database().ref('measurements');
        //var userMeasurmentsKey = [this.state.user.height, this.state.user.waist, this.state.user.bust, this.state.user.hips];
        var userMeasurmentsKey = [65, 24, 33, 36];
        measurementsRef.on('value', snapshot => {
          if (snapshot.hasChild(userMeasurmentsKey)) {
            //If user measurements exist, get the groupID
            this.state.dressGroupID = snapshot.value();
          } 
        });
        if (!this.state.dressGroupID) {
          //create groupIDDresses
          const groupIDDressesRef = firebase.database().ref('groupIDDresses');
          const groupIDDressesItem = {
            dress: this.state.dressID,
            rating: this.state.rating
          }
          var groupIDDresses = groupIDDressesRef.push(groupIDDressesItem);
          var groupIDDressesID = groupIDDresses.name();
          //Push groupIDDressref to measurements
          measurementsRef.child(userMeasurmentsKey).setValue(groupIDDressesID);
        } else {
          //Add dress to groupDressID
          const groupIDDressesRef = firebase.database().ref('groupIDDresses');
          const groupIDDresses = {
            dress: this.state.dressID,
            rating: this.state.rating
          }
          groupIDDressesRef.push(groupIDDresses);
        }

        this.setState({
          dressLink: '',
          size: '',
          color: '',
          rating: '',
          review: ''
        });
      }

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
  




        // const itemsRef = firebase.database().ref('items');
        // itemsRef.on('value', (snapshot) => {
        //   let items = snapshot.val();
        //   let newState = [];
        //   for (let item in items) {
        //     newState.push({
        //       id: item,
        //       dressLink: items[item].dressLink,
        //       size: items[item].size,
        //       color: items[item].color,
        //       rating: items[item].rating,
        //       review: items[item].review
        //     });
        //   }
        //   this.setState({
        //     items: newState
        //   });
        // });
      }

    render() {
        return (
        <div className='container'>
          <section className='add-item'>
            <h1>Add Dress</h1>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="dressLink" placeholder="What's the link to your dress?" onChange={this.handleChange} value={this.state.dressLink} />
                <input type="text" name="size" placeholder="What size did you buy?" onChange={this.handleChange} value={this.state.size}/>
                <input type="text" name="color" placeholder="What color did you buy?" onChange={this.handleChange} value={this.state.color}/>
                <input type="text" name="rating" placeholder="What would you rate this dress from 1-10?" onChange={this.handleChange} value={this.state.rating}/>
                <input type="text" name="review" placeholder="How would you review this dress?" onChange={this.handleChange} value={this.state.review}/>
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