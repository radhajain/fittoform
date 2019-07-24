import React from 'react';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import './Account.css';
import firebase from 'firebase';
import { FooterSmall } from '../Footer';
import MakeRequest from '../MakeRequest';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.braToBust = {
      AA: 0,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      DD: 4,
      DDD: 5,
      E: 5,
      EE: 6,
      F: 6,
      G: 7,
      GG: 8,
      H: 8
    };
    this.state = {
      authUser: '',
      uid: '',
      name: '',
      height: '',
      waist: '',
      hips: '',
      bust: '',
      size: '',
      bra: '',
      email: '',
      saved: false,
      showMakeRequest: false,
      requestedLinks: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showMakeRequestModal = this.showMakeRequestModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.makeReviewRequest = this.makeReviewRequest.bind(this);
  }

  handleChange = field => event => {
    event.preventDefault();
    let newVal = event.target.value;
    if (field === 'bra') {
      var newBra = newVal;
      var newBust =
        parseInt(newBra.slice(0, 2), 10) + this.braToBust[newBra.substr(2).toUpperCase()];
      console.log(newBust);
      console.log(this.braToBust[newBra.substr(2).toUpperCase()]);
      this.setState(
        {
          [field]: newVal,
          bust: newBust
        },
        () => {
          console.log(this.state);
        }
      );
    } else {
      this.setState({
        [field]: newVal
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    //Write firebase object
    this.setState({
      saved: true
    });
    this.props.firebase.user(this.state.uid).update({
      waist: this.state.waist,
      hips: this.state.hips,
      bust: this.state.bust,
      size: this.state.size,
      bra: this.state.bra,
      height: this.state.height
    });
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = this.props.firebase.user(uid);
    UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      this.setState({
        email: user.email,
        name: user.name,
        waist: user.waist,
        hips: user.hips,
        height: user.height,
        bust: user.bust,
        size: user.size,
        bra: user.bra,
        requestedLinks: user.requestedLinks ? user.requestedLinks : []
      });
    });
  }

  authlistener() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
      authUser ? this.setState({ uid: authUser.uid }) : this.setState({ uid: null });
      authUser ? this.getUserData(this.state.uid) : this.setState({ name: null });
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

  showMakeRequestModal() {
    this.setState({
      showMakeRequest: true
    });
  }

  closeModal() {
    this.setState({
      showMakeRequest: false
    });
  }

  makeReviewRequest(link) {
    if (this.state.authUser) {
      console.log(link);
      this.closeModal();
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
    }
  }

  render() {
    return (
      <div className="account-outer">
        <div className="results-leftCol-fakeNav"></div>
        <div className="results-getReview-wrapper">
          <p className="results-getReview-text" onClick={this.showMakeRequestModal}>
            Have a particular dress in mind? Request a review
          </p>
        </div>
        <div className="account-inner">
          <MakeRequest
            show={this.state.showMakeRequest}
            close={this.closeModal}
            makeReviewRequest={this.makeReviewRequest}
            name={this.state.name}
          ></MakeRequest>
          <div className="account-content">
            <p className="account-title">Welcome back, {this.state.name}.</p>
            <div className="account-row account-row-top">
              <div className="account-section-title-wrapper account-title-wrapper-top">
                <p className="account-section-title">Fit and Preferences</p>
              </div>
              <form>
                <div className="account-section-wrapper account-section-wrapper-top">
                  <div className="account-wrapper-item">
                    <span>
                      <select
                        name="height"
                        type="select"
                        value={this.state.height}
                        onChange={this.handleChange('height')}
                        className="account-select account-lg-input"
                      >
                        <option value="59">4' 11"</option>
                        <option value="60">5' 0"</option>
                        <option value="61">5' 1"</option>
                        <option value="62">5' 2"</option>
                        <option value="63">5' 3"</option>
                        <option value="64">5' 4"</option>
                        <option value="65">5' 5"</option>
                        <option value="66">5' 6"</option>
                        <option value="67">5' 7"</option>
                        <option value="68">5' 8"</option>
                        <option value="69">5' 9"</option>
                        <option value="70">5' 10"</option>
                        <option value="71">5' 11"</option>
                        <option value="72">6' 0"</option>
                        <option value="73">6' 1"</option>
                        <option value="74">6' 2"</option>
                        <option value="75">6' 3"</option>
                        <option value="76">6' 4"</option>
                        <option value="77">6' 5"</option>
                        <option value="78">6' 6"</option>
                      </select>
                    </span>
                    <label className="account-item-label">Height</label>
                  </div>
                  <div className="account-wrapper-item">
                    <select
                      value={this.state.bra}
                      onChange={this.handleChange('bra')}
                      name="bra"
                      className="account-select account-lg-input"
                    >
                      <option value="30AA">30AA</option>
                      <option value="30A">30A</option>
                      <option value="30B">30B</option>
                      <option value="30C">30C</option>
                      <option value="30D">30D</option>
                      <option value="30DD">30DD</option>
                      <option value="30DDD/E">30E</option>
                      <option value="30F">30F</option>
                      <option value="30G">30G</option>
                      <option value="30GG">30GG</option>
                      <option value="30H">30H</option>
                      <option value="32AA">32AA</option>
                      <option value="32A">32A</option>
                      <option value="32B">32B</option>
                      <option value="32C">32C</option>
                      <option value="32D">32D</option>
                      <option value="32DD">32DD</option>
                      <option value="32DDD/E">32E</option>
                      <option value="32F">32F</option>
                      <option value="32G">32G</option>
                      <option value="32GG">32GG</option>
                      <option value="32H">32H</option>
                      <option value="34AA">34AA</option>
                      <option value="34A">34A</option>
                      <option value="34B">34B</option>
                      <option value="34C">34C</option>
                      <option value="34D">34D</option>
                      <option value="34DD">34DD</option>
                      <option value="34DDD/E">34E</option>
                      <option value="34F">34F</option>
                      <option value="34G">34G</option>
                      <option value="34GG">34GG</option>
                      <option value="34H">34H</option>
                      <option value="36AA">36AA</option>
                      <option value="36A">36A</option>
                      <option value="36B">36B</option>
                      <option value="36C">36C</option>
                      <option value="36D">36D</option>
                      <option value="36DD">36DD</option>
                      <option value="36DDD/E">36E</option>
                      <option value="36F">36F</option>
                      <option value="36G">36G</option>
                      <option value="36GG">36GG</option>
                      <option value="36H">36H</option>
                      <option value="38AA">38AA</option>
                      <option value="38A">38A</option>
                      <option value="38B">38B</option>
                      <option value="38C">38C</option>
                      <option value="38D">38D</option>
                      <option value="38DD">38DD</option>
                      <option value="38DDD/E">38E</option>
                      <option value="38F">38F</option>
                      <option value="38G">38G</option>
                      <option value="38GG">38GG</option>
                      <option value="38H">38H</option>
                    </select>
                    <label className="account-item-label">Bra size </label>
                  </div>
                  <div className="account-wrapper-item">
                    <select
                      value={this.state.size}
                      onChange={this.handleChange('size')}
                      name="size"
                      className="account-select account-select-sm"
                    >
                      <option value="00">00</option>
                      <option value="0">0</option>
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="16">16</option>
                      <option value="18">18</option>
                      <option value="20">20</option>
                      <option value="22">22</option>
                      <option value="24">24</option>
                      <option value="26">26</option>
                      <option value="28">28</option>
                      <option value="30">30</option>
                    </select>
                    <label className="account-item-label">Dress size </label>
                  </div>
                  <div className="account-wrapper-item">
                    <select
                      value={this.state.waist}
                      onChange={this.handleChange('waist')}
                      name="waist"
                      className="account-select account-select-sm"
                    >
                      <option value="23">23</option>
                      <option value="24">24</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                      <option value="27">27</option>
                      <option value="28">28</option>
                      <option value="29">29</option>
                      <option value="30">30</option>
                      <option value="31">31</option>
                      <option value="32">32</option>
                      <option value="33">33</option>
                      <option value="34">34</option>
                      <option value="35">35</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="41">41</option>
                    </select>
                    <label className="account-item-label">Waist (in.) </label>
                  </div>
                  <div className="account-wrapper-item">
                    <select
                      value={this.state.hips}
                      onChange={this.handleChange('hips')}
                      name="hips"
                      className="account-select account-select-sm"
                    >
                      <option value="32">32</option>
                      <option value="33">33</option>
                      <option value="34">34</option>
                      <option value="35">35</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="41">41</option>
                      <option value="42">42</option>
                      <option value="43">43</option>
                      <option value="44">44</option>
                      <option value="45">45</option>
                      <option value="46">46</option>
                      <option value="47">47</option>
                      <option value="48">48</option>
                      <option value="49">49</option>
                      <option value="50">50</option>
                      <option value="51">51</option>
                      <option value="52">52</option>
                    </select>
                    <label className="account-item-label">Hips (in.) </label>
                  </div>
                  <div className="account-wrapper-item">
                    <select
                      value={this.state.bust}
                      onChange={this.handleChange('bust')}
                      name="bust"
                      className="account-select account-select-sm"
                    >
                      <option value="30">30</option>
                      <option value="32">31</option>
                      <option value="32">32</option>
                      <option value="33">33</option>
                      <option value="34">34</option>
                      <option value="35">35</option>
                      <option value="36">36</option>
                      <option value="37">37</option>
                      <option value="38">38</option>
                      <option value="39">39</option>
                      <option value="40">40</option>
                      <option value="41">41</option>
                      <option value="42">42</option>
                      <option value="43">43</option>
                      <option value="44">44</option>
                      <option value="45">45</option>
                      <option value="46">46</option>
                    </select>
                    <label className="account-item-label">Bust (in.) </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="account-row account-row-2">
              <div className="account-section-title-wrapper account-section-title-wrapper-2">
                <button className="account-save-btn" onClick={this.handleSubmit}>
                  <div style={{ position: 'relative' }}>Save</div>
                </button>
                {this.state.saved && (
                  <div>
                    <p className="account-saved-text">
                      <i>Changes saved!</i>
                    </p>
                    <Link to="/results" className="account-back">
                      <p className="account-section-title"> {`<`} Back to results</p>
                    </Link>
                  </div>
                )}
              </div>
              <div className="account-section-wrapper account-section-wrapper-2">
                <Link to="/submit" className="account-back">
                  <button className="account-review-button"> Review a dress</button>
                </Link>
              </div>
            </div>
            <div style={{ marginTop: 50, marginBottom: 50 }} className="account-row">
              <div className="account-section-title-wrapper" style={{ alignItems: 'flex-start' }}>
                <p className="account-section-title">Your Account</p>
              </div>
              <div className="account-section-wrapper account-account-section">
                <p className="account-text">
                  <span className="account-item-label">Email: </span>
                  {this.state.email}
                </p>
                <Link to={ROUTES.PASSWORD_FORGET} className="account-links">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
