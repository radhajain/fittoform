import React from 'react';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import './Account.css';
import { FooterSmall } from '../Footer';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.braToBust = {
      AA: 1,
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      DD: 5,
      DDD: 6,
      E: 6,
      EE: 7,
      F: 7,
      G: 8
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
      saved: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = field => event => {
    event.preventDefault();
    let newVal = event.target.value;
    if (field === 'bra') {
      var newBra = newVal;
      var newBust = parseInt(newBra.slice(0, 2), 10) + this.braToBust[newBra.substr(2)];
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
        bra: user.bra
      });
    });
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
      authUser ? this.setState({ uid: authUser.uid }) : this.setState({ uid: null });
      authUser ? this.getUserData(this.state.uid) : this.setState({ name: null });
    });
  }

  render() {
    return (
      <div className="account-outer">
        <div className="account-inner">
          <div className="account-content">
            <p className="account-title">Welcome back, {this.state.name}.</p>
            <div className="account-row account-row-top">
              <div className="account-section-title-wrapper account-title-wrapper-top">
                <p className="account-section-title">Fit and Preferences</p>
              </div>
              <form>
                <div className="account-section-wrapper account-section-wrapper-top">
                  <div className="account-wrapper-item">
                    <div className="account-select-round">
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
                    </div>
                    <label className="account-item-label">Height</label>
                  </div>
                  <div className="account-wrapper-item">
                    <div className="account-select-round">
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
                        <option value="30H">30H</option>
                        <option value="30I">30I</option>
                        <option value="30J">30J</option>
                        <option value="32AA">32AA</option>
                        <option value="32A">32A</option>
                        <option value="32B">32B</option>
                        <option value="32C">32C</option>
                        <option value="32D">32D</option>
                        <option value="32DD">32DD</option>
                        <option value="32DDD/E">32E</option>
                        <option value="32F">32F</option>
                        <option value="32G">32G</option>
                        <option value="32H">32H</option>
                        <option value="32I">32I</option>
                        <option value="32J">32J</option>
                        <option value="34AA">34AA</option>
                        <option value="34A">34A</option>
                        <option value="34B">34B</option>
                        <option value="34C">34C</option>
                        <option value="34D">34D</option>
                        <option value="34DD">34DD</option>
                        <option value="34DDD/E">34E</option>
                        <option value="34F">34F</option>
                        <option value="34G">34G</option>
                        <option value="34H">34H</option>
                        <option value="34I">34I</option>
                        <option value="34J">34J</option>
                        <option value="36AA">36AA</option>
                        <option value="36A">36A</option>
                        <option value="36B">36B</option>
                        <option value="36C">36C</option>
                        <option value="36D">36D</option>
                        <option value="36DD">36DD</option>
                        <option value="36DDD/E">36E</option>
                        <option value="36F">36F</option>
                        <option value="36G">36G</option>
                        <option value="36H">36H</option>
                        <option value="36I">36I</option>
                        <option value="36J">36J</option>
                        <option value="38AA">38AA</option>
                        <option value="38A">38A</option>
                        <option value="38B">38B</option>
                        <option value="38C">38C</option>
                        <option value="38D">38D</option>
                        <option value="38DD">38DD</option>
                        <option value="38DDD/E">38E</option>
                        <option value="38F">38F</option>
                        <option value="38G">38G</option>
                        <option value="38H">38H</option>
                        <option value="38I">38I</option>
                        <option value="38J">38J</option>
                      </select>
                    </div>
                    <label className="account-item-label">Bra size </label>
                  </div>
                  <div className="account-wrapper-item">
                    <div className="account-select-round">
                      <select
                        value={this.state.size}
                        onChange={this.handleChange('size')}
                        name="size"
                        className="account-select"
                      >
                        <option value="0">0</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                      </select>
                    </div>
                    <label className="account-item-label">Dress size </label>
                  </div>
                  <div className="account-wrapper-item">
                    <div className="account-select-round">
                      <select
                        value={this.state.waist}
                        onChange={this.handleChange('waist')}
                        name="waist"
                        className="account-select"
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
                      </select>
                    </div>
                    <label className="account-item-label">Waist (in.) </label>
                  </div>
                  <div className="account-wrapper-item">
                    <div className="account-select-round">
                      <select
                        value={this.state.hips}
                        onChange={this.handleChange('hips')}
                        name="hips"
                        className="account-select"
                      >
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="37">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="40">41</option>
                        <option value="40">42</option>
                        <option value="40">43</option>
                        <option value="40">44</option>
                        <option value="40">45</option>
                        <option value="40">46</option>
                      </select>
                    </div>
                    <label className="account-item-label">Hips (in.) </label>
                  </div>
                </div>
              </form>
            </div>
            <div style={{ marginTop: 50 }}>
              <button className="account-save-btn" onClick={this.handleSubmit}>
                <div style={{ position: 'relative' }}>Save</div>
              </button>
              {this.state.saved && (
                <p className="account-saved-text">
                  <i>Changes saved!</i>
                </p>
              )}
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
