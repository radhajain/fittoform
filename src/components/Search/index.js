import React, { Component } from 'react';
import './Search.css';
import { Link } from 'react-router-dom';
import whiteArrow from '../../assets/images/white-arrow.png';


class Search extends Component {
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
          bra: '',
          modifyWaist: '',
          modifyHips: '',
          modifyBust: '',
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
        this.setState({modifyWaist: val});
        console.log(this.state);
      }
    
      modifyHips(val) {
        var newHips = this.state.hips + val; 
        this.setState({hips: newHips});
        this.setState({modifyHips: val});
      }
    
      modifyBust(val) {
        var newBust = this.state.bust + val; 
        this.setState({bust: newBust});
        this.setState({modifyBust: val});
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
            <div className="search-parent">
            <div className="search-container-first search-child">
            <div className="search-search-content">
                <form>
                  <label className="search-search-label">
                    I am
                    <input
                      name="heightft"
                      type="number"
                      className="search-input"
                      onChange={this.handleInputChange} />
                    ft, 
                    <input
                      name="heightin"
                      type="number"
                      className="search-input"
                      onChange={this.handleInputChange} />
                    inches tall.
                  </label>
                </form>
              </div>
          </div>
          <div className="search-container-second search-child">
            <div className="search-search-content">
                <form>
                  <label className="search-search-label">
                    I normally wear US size
                    <input
                      name="size"
                      type="number"
                      className="search-input"
                      onChange={this.addUSSize} />
                      .
                  </label>
                </form>
              </div>
          </div>
          <div className="search-container-third search-child">
            <div className="search-search-content">
                <form>
                  <label className="search-search-label">
                    My bra size is
                    <input
                      name="bra"
                      type="text"
                      className="search-input"
                      style={{width: 130}}
                      onChange={this.handleInputChange} />
                      .
                  </label>
                </form>
              </div>
          </div>

          <div className="search-container-fourth search-child">
            <div className="search-search-content">
              <p className="search-search-label final-search-label">On me, size {this.state.size} is generally:</p>
              <div className="search-size-box">
                <div className="search-selector" style={{display:'block'}}>
                    <p className="search-desc">WAIST</p>
                    <div className="search-btn-group" >
                    <button className={this.state.modifyWaist == 1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(1)}>Small</button>
                    <button className={this.state.modifyWaist == 0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(0.5)}>Tight</button>
                    <button className={this.state.modifyWaist == 0 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(0)}>Perfect</button>
                    <button className={this.state.modifyWaist == -0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(-0.5)}>Loose</button>
                    <button className={this.state.modifyWaist == -1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(-1)}>Large</button>
                    </div>
                </div>
                <div className="search-selector">
                    <p className="search-desc">HIPS</p>
                    <div className="search-btn-group">
                    <button className={this.state.modifyHips == 1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(1)}>Small</button>
                    <button className={this.state.modifyHips == 0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(0.5)}>Tight</button>
                    <button className={this.state.modifyHips == 0 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(0)}>Perfect</button>
                    <button className={this.state.modifyHips == -0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(-0.5)}>Loose</button>
                    <button className={this.state.modifyHips == -1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(-1)}>Large</button>
                    </div>
                </div>
                <div className="search-selector">
                    <p className="search-desc">BUST</p>
                    <div  className="search-btn-group">
                    <button className={this.state.modifyBust == 1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyBust(1)}>Small</button>
                    <button className={this.state.modifyBust == 0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyBust(0.5)}>Tight</button>
                    <button className={this.state.modifyBust == 0 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyBust(0)}>Perfect</button>
                    <button className={this.state.modifyBust == -0.5 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyBust(-0.5)}>Loose</button>
                    <button className={this.state.modifyBust == -1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyBust(-1)}>Large</button>
                    </div>
                </div>
              </div>
            </div>
            <div style={{marginTop: 100}}>
                <Link to= {{
                  pathname: '/results',
                  state: {
                    height: this.state.height,
                    waist: this.state.waist,
                    hips: this.state.hips,
                    bra: this.state.bra,
                    bust: this.state.bust,
                    size: this.state.size
                  }}}>
                    <button className="search-results-btn">
                        See dresses picked for my size
                        <img src={whiteArrow} className="search-whitearrow"/>
                    </button>
                </Link>
              </div>
  
          </div>
          </div>
        );
    }
}

export default Search;