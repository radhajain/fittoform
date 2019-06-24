import React from 'react';
import { Link } from 'react-router-dom';

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="landing-parent">
            <div className="landing-container-first landing-child">
                <div style={{width: '80%', textAlign: 'left'}}>
                    <p className="landing-title">The perfect fit, everytime</p>
                    <p className="landing-desc">Only see dresses guaranteed to fit, so you can focus on styles you like.</p>
                </div>
            </div>
            <div className="landing-container-second landing-child">
                <div style={{width: '80%', textAlign: 'left'}}>
                    <p className="landing-desc" style={{color: "black"}}>Forget the uncertainity that comes from online shopping or the pain of fitting rooms or returns. Only see dresses tried and tested by women of the same measurements as you so you can buy with confidence.</p>
                </div>
            </div>
        </div>
    );
  }
} 
 

export default HowItWorks;
