import React, { Component } from 'react';
import './Search.css';
import whiteArrow from '../../assets/images/white-arrow.png';
import whiteTick from '../../assets/images/white-tick.png';

function validate(heightft, heightin, size, bra) {
    var braRe = /[0-9][0-9][a-gA-G][a-gA-G]?[a-gA-G]?/;
    heightft = parseInt(heightft, 10);
    heightin = parseInt(heightin, 10);
    size = parseInt(size, 10);
    return {
        heightft: ( (heightft.length === 0) || !Number.isInteger(heightft) || (heightft < 4) || (heightft > 6)),
        heightin: ( (heightin.length === 0) || !Number.isInteger(heightin) || heightin < 0 || heightin > 12),
        size: ( (size.length === 0) || !Number.isInteger(size) || (size % 2 === 1) || size > 16),
        bra: ( (bra.length === 0) || !bra.match(braRe))
    };
}


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
          touched: {
            heightft: false,
            heightin: false,
            size: false,
            bra: false
          },
          focused: {
            heightft: false,
            heightin: false,
            size: false,
            bra: false
          },
        };
        this.braToBust = {
            "AA": 1,
            "A" : 1,
            "B" : 2,
            "C" : 3,
            "D" : 4,
            "DD" : 5,
            "DDD" : 6,
            "E" : 6,
            "F" : 7,
            "G" : 8

        }
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeBra = this.handleInputChangeBra.bind(this);
        this.modifyWaist = this.modifyWaist.bind(this);
        this.modifyHips = this.modifyHips.bind(this);
        this._handleKeyPressHeightFt = this._handleKeyPressHeightFt.bind(this);
        this._handleKeyPressHeightIn = this._handleKeyPressHeightIn.bind(this);
        this._handleKeyPressSize = this._handleKeyPressSize.bind(this);
        this._handleKeyPressBra = this._handleKeyPressBra.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goToSize = this.goToSize.bind(this);
        this.goToBra = this.goToBra.bind(this);
        this.goToSizing = this.goToSizing.bind(this);
        this.getErrorObj = this.getErrorObj.bind(this);
        this.sizingRef = React.createRef();
        this.sizeRef = React.createRef();
        this.braRef = React.createRef();
      }

    
    modifyWaist(val) {
        this.setState({modifyWaist: val});
    }

    modifyHips(val) {
        this.setState({modifyHips: val});
    }
    

    goToSize(e) {
        e.preventDefault();
        this.sizeRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        this.refs.sizeinput.focus();
    }

    goToBra(e) {
        e.preventDefault();
        this.braRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        this.refs.brainput.focus();
    }

    goToSizing(e) {
        e.preventDefault();
        this.sizingRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }
    
    handleInputChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleInputChangeBra(event) {
        const value = event.target.value.toUpperCase();
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    _handleKeyPressHeightFt(e) {
        this.setState({
            touched: { ...this.state.touched, heightft: true },
        });
        if (e.key === 'Enter' || e.target.name === 'heightininput') {
            e.preventDefault();
            var errors = this.getErrorObj();
            if (!errors['heightft']) {
                this.refs.heightininput.focus();
            } else {
                this.setState({
                    focused: { ...this.state.focused, heightft: true },
                });
            }
            
        }
      }

    _handleKeyPressHeightIn = (field) => (e) => {
        console.log("key pressed")
        this.setState({
            touched: { ...this.state.touched, heightin: true },
        });
        if (e.key === 'Enter') {
            e.preventDefault();
            var errors = this.getErrorObj();
            console.log(errors)
            if (!errors[field]) {
                this.sizeRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                this.refs.sizeinput.focus();
            } else {
                console.log("errors were found");
                this.setState({
                    focused: { ...this.state.focused, [field]: true },
                });
            }
        }
    }

    _handleKeyPressSize = (field) => (e) =>{
        this.setState({
            touched: { ...this.state.touched, size: true },
        });
        if (e.key === 'Enter') {
            e.preventDefault();
            var errors = this.getErrorObj();
            if (!errors[field]) {
                this.braRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                this.refs.brainput.focus();
            } else {
                this.setState({
                    focused: { ...this.state.focused, [field]: true },
                });
            }
        }
    }

    
    _handleKeyPressBra(e) {
        this.setState({
            touched: { ...this.state.touched, bra: true },
        });
        if (e.key === 'Enter') {
            e.preventDefault();
            var errors = this.getErrorObj();
            if (!errors['bra']) {
                this.sizingRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            } else {
                this.setState({
                    focused: { ...this.state.focused, bra: true },
                });
            }
            
        }   
    }

    handleBlur = (field) => (evt) => {
        this.setState({
          focused: { ...this.state.focused, [field]: true },
        });
    }

    handleSubmit = evt => {
        if (!this.canBeSubmitted()) {
          evt.preventDefault();
          return;
        }
        var measurements = this.USsizeArray[this.state.size.toString()];
        var height = (parseInt(this.state.heightft,10) * 12) + parseInt(this.state.heightin,10);
        var newBust = parseInt(this.state.bra.slice(0, 2), 10) + this.braToBust[this.state.bra.substr(2)];
        var newHips = measurements.hips + this.state.modifyHips; 
        var newWaist = measurements.waist + this.state.modifyWaist; 
        this.setState({
            height: height,
            bust: newBust,
            hips: newHips,
            waist: newWaist
        }, () => {
            this.props.history.push({
                pathname: '/results',
                state: {
                    height: this.state.height,
                    waist: this.state.waist,
                    hips: this.state.hips,
                    bra: this.state.bra,
                    bust: this.state.bust,
                    size: this.state.size
                }
            });
        })
      };
    
      canBeSubmitted() {
        const errors = validate(this.state.heightft, this.state.heightin, this.state.size, this.state.bra);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
      } 
      
      getErrorObj() {
        const errors = validate(this.state.heightft, this.state.heightin, this.state.size, this.state.bra);
        return errors;
      }

    render() {
        //TODO -- OK button and autoscroll, page indicators of question, not allowed to scroll until enter info
        //Detect when user clicks off
        //On mobile scroll to middle of page
        //don't allow invalid inputs
        const errors = this.getErrorObj();
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        const shouldMarkError = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.focused[field];    
            return hasError ? shouldShow : false;
        };
        const shouldShowNext = (field) => {
            var isTouched = this.state.touched[field];
            var hasError = errors[field];
            if (field === 'height') {
                isTouched = this.state.touched["heightft"] && this.state.touched["heightin"];
                hasError = errors["heightft"] || errors["heightin"];
            }
            return hasError ? false : isTouched;
        }
        return (
            <div className="search-parent">
            <div className="search-container-first search-child">
            <div className="search-search-content">
                <form className="search-form">
                  <label className="search-search-label">
                    I am
                    <input
                      name="heightft"
                      type="number"
                      value={this.state.heightft}
                      ref="heightftinput"
                      onBlur={this.handleBlur('heightft')}
                      className={shouldMarkError('heightft') ? "search-input-error" : "search-input"}
                      onKeyPress={this._handleKeyPressHeightFt}
                      onChange={this.handleInputChange} />
                    ft, 
                    <input
                      name="heightin"
                      type="number"
                      value={this.state.heightin}
                      onBlur={this.handleBlur('heightin')}
                      className={shouldMarkError('heightin') ? "search-input-error" : "search-input"}
                      onKeyPress={this._handleKeyPressHeightIn('heightin') }
                      ref="heightininput"
                      onChange={this.handleInputChange} />
                    inches tall.
                    <p className={ (shouldMarkError('heightin') || shouldMarkError('heightft')) ? "search-error-msg" : "hide-search-error-msg"}><i>Please enter a valid height, e.g. 5 ft, 4 in etc.</i></p>
                  </label>
                  <div className={shouldShowNext('height') ? "search-nextDiv" : "search-nextDiv-hide"} >
                    <button className="search-ok-btn" onClick={this.goToSize}>
                        <div className="search-ok-flexWrapper">
                            <span className="search-ok-text">OK</span>
                            <img src={whiteTick} style={{width: 16, marginLeft: 8}}/>
                        </div>
                    </button>
                    <p className="search-pressEnter"><i>press <b>ENTER</b></i></p>
                  </div>
                </form>
              </div>
          </div>
          <div className="search-container-second search-child" ref={this.sizeRef}>
            <div className="search-search-content" >
                <form className="search-form">
                  <label className="search-search-label">
                    I normally wear US size
                    <input
                      name="size"
                      type="number"
                      ref="sizeinput"
                      value={this.state.size}
                      onBlur={this.handleBlur('size')}
                      className={shouldMarkError('size') ? "search-input-error" : "search-input"}
                      onKeyPress={this._handleKeyPressSize('size')}
                      onChange={this.handleInputChange} />
                      .
                      <p className={shouldMarkError('size') ? "search-error-msg" : "hide-search-error-msg"}><i>Please enter a numeric US size, e.g. 0, 2, 4, 6 etc.</i></p>
                  </label>
                  <div className={shouldShowNext('size') ? "search-nextDiv" : "search-nextDiv-hide"} >
                    <button className="search-ok-btn" onClick={this.goToBra}>
                        <div className="search-ok-flexWrapper">
                            <span className="search-ok-text">OK</span>
                            <img src={whiteTick} style={{width: 16, marginLeft: 8}}/>
                        </div>
                    </button>
                    <p className="search-pressEnter"><i>press <b>ENTER</b></i></p>
                  </div>
                </form>
              </div>
          </div>
          <div className="search-container-third search-child" ref={this.braRef}>
            <div className="search-search-content">
                <form className="search-form">
                  <label className="search-search-label">
                    My bra size is
                    <input
                      name="bra"
                      type="text"
                      ref="brainput"
                      value={this.state.bra}
                      onBlur={this.handleBlur('bra')}
                      onKeyPress={this._handleKeyPressBra}
                      className={shouldMarkError('bra') ? "search-input-error search-bra" : "search-input search-bra"}
                      onChange={this.handleInputChangeBra} />
                      .
                      <p className={shouldMarkError('bra') ? "search-error-msg" : "hide-search-error-msg"}><i>Please enter a valid bra size, e.g. 32B, 34DD etc.</i></p>
                    
                  </label>
                  <div className={shouldShowNext('bra') ? "search-nextDiv" : "search-nextDiv-hide"} >
                    <button className="search-ok-btn" onClick={this.goToSizing}>
                        <div className="search-ok-flexWrapper">
                            <span className="search-ok-text">OK</span>
                            <img src={whiteTick} style={{width: 16, marginLeft: 8}}/>
                        </div>
                    </button>
                    <p className="search-pressEnter"><i>press <b>ENTER</b></i></p>
                  </div>
                </form>
              </div>
          </div>

          <div className="search-container-fourth search-child" ref={this.sizingRef}>
            <div className="search-search-content">
              <p className="search-search-label final-search-label">On me, size {this.state.size} is generally:</p>
              <div className="search-size-box" >
                <div className="search-selector" style={{display:'block'}}>
                    <p className="search-desc">WAIST</p>
                    <div className="search-btn-group" >
                    <button className={this.state.modifyWaist == 2 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(2)}>Small</button>
                    <button className={this.state.modifyWaist == 1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(1)}>Tight</button>
                    <button className={this.state.modifyWaist == 0 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(0)}>Perfect</button>
                    <button className={this.state.modifyWaist == -1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(-1)}>Loose</button>
                    <button className={this.state.modifyWaist == -2 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyWaist(-2)}>Large</button>
                    </div>
                </div>
                <div className="search-selector">
                    <p className="search-desc">HIPS</p>
                    <div className="search-btn-group">
                    <button className={this.state.modifyHips == 2 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(2)}>Small</button>
                    <button className={this.state.modifyHips == 1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(1)}>Tight</button>
                    <button className={this.state.modifyHips == 0 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(0)}>Perfect</button>
                    <button className={this.state.modifyHips == -1 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(-1)}>Loose</button>
                    <button className={this.state.modifyHips == -2 ? 'search-size-buttons-selected' : 'search-size-buttons'} onClick={() => this.modifyHips(-2)}>Large</button>
                    </div>
                </div>
              </div>
            </div>
            <div className="search-results-btn-div">
                <button className={isDisabled ? "search-results-btn-disabled" : "search-results-btn"} onClick={this.handleSubmit} disabled={isDisabled}>
                    See dresses picked for my size
                    <img src={whiteArrow} className="search-whitearrow"/>
                </button>
            </div>
  
          </div>
          </div>
        );
    }
}

export default Search;