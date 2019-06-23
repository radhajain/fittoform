import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import './Landing.css'

//TODO: change so that the user cannot scroll to next page if they haven't filled out the previous field
class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.USsizeArray = 
    {
      "00": {
        waist: 24,
        hips: 34,
        bust: 32,
      },
      "0": {
        waist: 24,
        hips: 35,
        bust: 33,
      },
      "2": {
        waist: 26,
        hips: 37,
        bust: 34,
      },
      "4": {
        waist: 27,
        hips: 38,
        bust: 35,
      },
      "6": {
        waist: 28,
        hips: 39,
        bust: 36,
      },
      "8": {
        waist: 29,
        hips: 40,
        bust: 37,
      },
      "10": {
        waist: 30,
        hips: 41,
        bust: 38.5,
      },
      "12": {
        waist: 31,
        hips: 42,
        bust: 40,
      },
      "14": {
        waist: 33,
        hips: 44,
        bust: 42,
      },
      "16": {
        waist: 34,
        hips: 45,
        bust: 44,
      }
    }
    this.state = {
      height: '',
      heightft: '',
      heightin: '',
      size: '',
      waist: '',
      bust: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.modifyWaist = this.modifyWaist.bind(this);
    this.modifyHips = this.modifyHips.bind(this);
    this.modifyBust = this.modifyBust.bind(this);
    this.addUSSize = this.addUSSize.bind(this);
  }

  modifyWaist(val) {
    var newWaist = this.state.waist + val; 
    this.setState({waist: newWaist});
    console.log(this.state);
  }

  modifyHips(val) {
    var newHIps = this.state.hips + val; 
    this.setState({hips: newHIps});
  }

  modifyBust(val) {
    var newBust = this.state.bust + val; 
    this.setState({bust: newBust});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  addUSSize(event) {
    const value = event.target.value;
    this.setState({size: value});
    var measurements = this.USsizeArray[value.toString()];
    this.setState({waist: measurements.waist});
    this.setState({hips: measurements.hips});
    this.setState({bust: measurements.bust});
    var height = (parseInt(this.state.heightft,10) * 12) + parseInt(this.state.heightin,10);
    console.log(height);
    console.log(this.state);
    this.setState({height: height});
  }




  render() {
    return (
        <div className="landing-parent">
        <div className="landing-container-intro landing-child">
          <div style={{width: '80%', textAlign: 'left'}}>
            <p className="landing-title">Easily find a summer dress with the perfect fit. Recommended by women with the same body as you.</p>
            <p className="landing-desc">Finally, the end of fitting rooms and returns. Our dresses have been tried and tested by women of your exact measurements so you don’t have to. Only see dresses guaranteed to fit you so you can focus on the styles you like. No more scrolling, tabs and uncertainty. Fit to Form gives you a curated set of clothing that might as well have been tailored for you, so you can buy with confidence.</p>
            <button className="landing-results-btn">See dresses picked for my size</button>
          </div>
        </div>
        <div className="landing-container-first landing-child">
          <div style={{width: '80%', textAlign: 'left'}}>
              <p className="landing-title">We’re here to get rid of the uncertainties of shopping</p>
              <ul className="landing-desc">
                <li>We know how important fit is to looking good and we’re here to make sure you know which dresses will fit you best</li>
                <li>Brands and even items can have inconsistent sizing so we’re here to clear the confusion and let you know if any size will fit you perfectly</li>
                <li>There’s nothing as sad as having to return the dress you so desperately wanted to work, we will make sure all our dresses fit exactly as you imagined</li>
              </ul>
            </div>
        </div>
        <div className="landing-container-second landing-child">
          <div style={{width: '80%', textAlign: 'left'}}>
            <p className="landing-title" style={{textAlign: "center"}}>How it works</p>
            <ul>
              <li>1. Tell us your measurements</li>
              <li>2. Search for dresses</li>
              <li>3. Pick the styles you like and read reviews from other women of your exact measurements who have tried this dress on</li>
            </ul>
            <button className="landing-results-btn">See dresses picked for my size</button>
          </div>
        </div>
      </div>
    );
  }

} 
 


export default Landing;
