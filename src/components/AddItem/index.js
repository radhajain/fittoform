import firebase from 'firebase'
import React, { Component } from 'react';

class AddItem extends Component {
    constructor(props) {
        super(props);
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
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }

      handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
          dressLink: this.state.dressLink,
          size: this.state.size,
          color: this.state.color,
          rating: this.state.rating,
          review: this.state.review
        }
        console.log(item);
        itemsRef.push(item);
        this.setState({
          dressLink: '',
          size: '',
          color: '',
          rating: '',
          review: ''
        });
      }

      componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
          let items = snapshot.val();
          let newState = [];
          for (let item in items) {
            newState.push({
              id: item,
              dressLink: items[item].dressLink,
              size: items[item].size,
              color: items[item].color,
              rating: items[item].rating,
              review: items[item].review
            });
          }
          this.setState({
            items: newState
          });
        });
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

export default AddItem;