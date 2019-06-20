import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

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
            <p className="landing-desc">No more scrolling, tabs and uncertainty. Fit to Form gives you a curated set of clothing, that will fit you perfectly, so you can buy with confidence.</p>
          </div>
        </div>
        <div className="landing-container-first landing-child">
          <div className="landing-search-content">
              <form>
                <label className="landing-search-label">
                  I am
                  <input
                    name="heightft"
                    type="number"
                    className="landing-input"
                    onChange={this.handleInputChange} />
                  ft, 
                  <input
                    name="heightin"
                    type="number"
                    className="landing-input"
                    onChange={this.handleInputChange} />
                  in tall.
                </label>
              </form>
            </div>
        </div>
        <div className="landing-container-second landing-child">
          <div className="landing-search-content">
              <form>
                <label className="landing-search-label">
                  I normally wear US size
                  <input
                    name="size"
                    type="number"
                    className="landing-input"
                    onChange={this.addUSSize} />
                </label>
              </form>
            </div>
        </div>
        <div className="landing-container-third landing-child">
          <div className="landing-search-content">
            <p className="landing-desc">On me, size 2 is generally fits:</p>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div className="landing-desc" style={{display:'block'}}>
                  WAIST
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                  <button className="landing-size-buttons" onClick={() => this.modifyWaist(0.5)}>Too small</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyWaist(0.25)}>Tight</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyWaist(0)}>Perfect</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyWaist(-0.25)}>Loose</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyWaist(-0.5)}>Large</button>
                  </div>
              </div>
              <div className="landing-desc" style={{marginLeft: 100, marginRight: 100}}>
                  HIPS
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                  <button className="landing-size-buttons" onClick={() => this.modifyHips(0.5)}>Too small</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyHips(0.25)}>Tight</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyHips(0)}>Perfect</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyHips(-0.25)}>Loose</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyHips(-0.5)}>Large</button>
                  </div>
              </div>
              <div className="landing-desc">
                  BUST
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                  <button className="landing-size-buttons" onClick={() => this.modifyBust(0.5)}>Too small</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyBust(0.25)}>Tight</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyBust(0)}>Perfect</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyBust(-0.25)}>Loose</button>
                  <button className="landing-size-buttons" onClick={() => this.modifyBust(-0.5)}>Large</button>
                  </div>
              </div>
            </div>
            <div>
              <Link to= {{
                pathname: '/results',
                state: {
                  height: this.state.height,
                  waist: this.state.waist,
                  hips: this.state.hips,
                  bust: this.state.bust,
                  size: this.state.size
                }}}><button className="landing-results-btn">See dresses picked for my size</button></Link>
            </div>
            
          </div>

        </div>
       
      </div>
    );
  }

} 
 


export default Landing;