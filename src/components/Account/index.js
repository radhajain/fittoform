import React from 'react';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import './Account.css';
import {FooterSmall} from '../Footer';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    var user = {
      waist: '',
      name: '',
      hips: '',
      bust: '',
      size: '',
      bra: '',
      email: ''
    }
    this.state = {
      authUser: '',
      uid: '',
      name: '',
      user: user,
      editMode: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


    handleChange(event) {
      this.setState({
        user: { ...this.state.user, [event.target.name]: event.target.value },
      });
      console.log(this.state);
    }

    handleSubmit(event) {
      event.preventDefault();
      //Write firebase object
      this.props.firebase.user(this.state.uid).update({
        waist: this.state.user.waist,
        hips: this.state.user.hips,
        bust: this.state.user.bust,
        size: this.state.user.size,
        bra: this.state.user.bra,
      });
    }

    // Sets the user values
    getUserData(uid) {
      console.log(uid);
      let UserRef = this.props.firebase.user(uid)
      UserRef.once('value').then((snapshot) => {
       let user = snapshot.val();
       console.log(user);
        this.setState({
          name: user.name
        })
        this.setState({
         user: user
       });
      });
    }  
  
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser ? this.setState({authUser}): this.setState({authUser:null});
          authUser ? this.setState({uid: authUser.uid}) : this.setState({uid: null});
          authUser ? this.getUserData(this.state.uid) : this.setState({name : null})
        },
      );
    }

  render() {
    return (
      <div className="account-outer">
        <div className="account-inner">
          <p className="account-title">Welcome back, {this.state.name}.</p>
          <div>
            <div className="account-section-title-wrapper">
              <p className="account-section-title">Fit and Preferences</p>
            </div>
            <hr className="account-hr"/>
            <form>
            <div className="account-section-wrapper">
              <div className="account-wrapper-item">
                <label className="account-item-label">
                  Height: 
                </label>
                <select name="height" type="select" value={this.state.user.height} onChange={this.handleChange} className="account-select">
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
              <div className="account-wrapper-item">
                <label className="account-item-label">Bra size </label>
                <select value={this.state.user.bra} onChange={this.handleChange} name="bra" className="account-select">
                  <option value="30AA">30AA</option>
                  <option value="30A">30A</option>
                  <option value="30B">30B</option>
                  <option value="30C">30C</option>
                  <option value="30D">30D</option>
                  <option value="30DD">30DD</option>
                  <option value="30DDD/E">30DDD/E</option>
                  <option value="30F">30F</option>
                  <option value="30G">30G</option><option value="30H">30H</option><option value="30I">30I</option><option value="30J">30J</option><option value="32AA">32AA</option><option value="32A">32A</option><option value="32B">32B</option><option value="32C">32C</option><option value="32D">32D</option><option value="32DD">32DD</option><option value="32DDD/E">32DDD/E</option><option value="32F">32F</option><option value="32G">32G</option><option value="32H">32H</option><option value="32I">32I</option><option value="32J">32J</option><option value="34AA">34AA</option><option value="34A">34A</option><option value="34B">34B</option><option value="34C">34C</option><option value="34D">34D</option><option value="34DD">34DD</option><option value="34DDD/E">34DDD/E</option><option value="34F">34F</option><option value="34G">34G</option><option value="34H">34H</option><option value="34I">34I</option><option value="34J">34J</option><option value="36AA">36AA</option><option value="36A">36A</option><option value="36B">36B</option><option value="36C">36C</option><option value="36D">36D</option><option value="36DD">36DD</option><option value="36DDD/E">36DDD/E</option><option value="36F">36F</option><option value="36G">36G</option><option value="36H">36H</option><option value="36I">36I</option><option value="36J">36J</option><option value="38AA">38AA</option><option value="38A">38A</option><option value="38B">38B</option><option value="38C">38C</option><option value="38D">38D</option><option value="38DD">38DD</option><option value="38DDD/E">38DDD/E</option><option value="38F">38F</option><option value="38G">38G</option><option value="38H">38H</option><option value="38I">38I</option><option value="38J">38J</option>
                </select>
              </div>
              <div className="account-wrapper-item">
                <label className="account-item-label">Dress size </label>
                <select value={this.state.user.size} onChange={this.handleChange} name="size" className="account-select">
                    <option value="0">0</option><option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option><option value="14">14</option><option value="16">16</option>
                </select>
              </div>
              <div className="account-wrapper-item">
                <label className="account-item-label">Waist (in.) </label>
                <select value={this.state.user.waist} onChange={this.handleChange}  name="waist" className="account-select">
                  <option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option>
                </select>
              </div>
              <div className="account-wrapper-item">
                <label className="account-item-label">Hips (in.) </label>
                <select value={this.state.user.hips} onChange={this.handleChange}  name="hips" className="account-select">
                  <option value="37">35</option><option value="37">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="40">41</option><option value="40">42</option><option value="40">43</option><option value="40">44</option><option value="40">45</option><option value="40">46</option>
                </select>
              </div>
            </div>
            <button className="account-save-btn" onClick={this.handleSubmit}>Save</button>
            </form>
            
          </div>
          <div style={{marginTop: 50, marginBottom: 50}}>
            <p className="account-section-title">Your Account</p>
            <hr className="account-hr"/>
            <p><span className="account-item-label">Email: </span>{this.state.user.email}</p>
            <Link to={ROUTES.PASSWORD_FORGET} className="account-links">Forgot your password?</Link>
            <Link to={ROUTES.PASSWORD_CHANGE} className="account-links">Change password</Link>
          </div>
        </div>
        <FooterSmall />
      </div>
    );
  }
}



const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
