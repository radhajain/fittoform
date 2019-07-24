import React from 'react';
import './Submit.css';
import firebase from 'firebase';
import { FooterSmall } from '../Footer';

//TODO: slider for quality, discrete button select for length of dress, tightness around the bust/waist/butt, comfort level, [tight, fitted, loose, large]

class Submit extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      link: '',
      size: '',
      review: '',
      rating: '',
      authUser: false,
      uid: '',
      name: '',
      waist: '',
      hips: '',
      height: '',
      bust: '',
      bra: '',
      userSize: ''
    };
    this.onChange = this.onChange.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getFirstName = this.getFirstName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    const submitRef = firebase.database().ref('submits');
    const newReviewRef = submitRef.push();
    newReviewRef.set({
      uid: this.state.uid,
      height: this.state.height,
      waist: this.state.waist,
      bust: this.state.bust,
      hips: this.state.hips,
      name: this.state.name,
      age: this.state.age,
      bra: this.state.bra,
      userSize: this.state.userSize,
      dressLink: this.state.link,
      sizeBought: this.state.size,
      review: this.state.review,
      rating: this.state.rating
    });
    this.setState({
      link: '',
      size: '',
      review: '',
      rating: ''
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
          this.setState(
            {
              name: user.name,
              waist: user.waist,
              hips: user.hips,
              height: user.height,
              userSize: user.size,
              bra: user.bra,
              bust: user.bust,
              age: user.age ? user.age : 'N/A'
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
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  getFirstName(name) {
    if (name.indexOf(' ') > -1) {
      return name.split(' ')[0];
    } else {
      return name;
    }
  }

  render() {
    const { link, size, review, rating } = this.state;
    const isInvalid = link === '' || size === '' || review === '' || rating === '';
    return (
      <div className="submit">
        <div className="submit-inner">
          <div className="submit-content">
            {this.state.name && (
              <p className="submit-title">
                {this.getFirstName(this.state.name)}, help women with your body.
              </p>
            )}
            {!this.state.name && <p className="submit-title">Help women with your body.</p>}
            <p className="submit-subtitle">
              Let's make something great together. Leave a review of a dress.
            </p>
            <form onSubmit={this.handleSubmit}>
              <div className="submit-form-div">
                <input
                  name="link"
                  placeholder="Link to the dress"
                  value={link}
                  onChange={this.onChange}
                  type="text"
                  className="submit-input"
                />
              </div>
              <div className="submit-form-div">
                <input
                  name="size"
                  placeholder="What size did you buy?"
                  value={size}
                  onChange={this.onChange}
                  type="text"
                  className="submit-input"
                />
              </div>
              <div className="submit-form-div">
                <input
                  name="rating"
                  placeholder="Rating out of 10?"
                  value={rating}
                  onChange={this.onChange}
                  type="number"
                  className="submit-input"
                />
              </div>
              <div className="submit-form-div">
                <textarea
                  name="review"
                  placeholder="How did the dress fit?"
                  value={review}
                  onChange={this.onChange}
                  type="text"
                  className="submit-textarea"
                />
              </div>
              <button className="submit-btn" disabled={isInvalid} type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default Submit;
