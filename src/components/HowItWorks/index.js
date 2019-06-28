import React from 'react';
import { Link } from 'react-router-dom';
import WhiteArrow from '../../assets/images/white-arrow.png';
import { FooterLarge, FooterSmall } from '../Footer';
import './HowItWorks.css'

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="howitworks-parent">
            <div className="howitworks-child">
              <div style={{width: '80%', textAlign: 'left'}}>
                  <p className="howitworks-title">How it works</p>
              </div>
            </div>
            <hr></hr>
            <div className="howitworks-child">
                <div style={{width: '80%', textAlign: 'center'}}>
                    <p className="howitworks-subtitle">It all starts with the fit</p>
                    <p className="howitworks-desc">Our stylists find the hottest new dresses and most popular classics</p>
                </div>
            </div>
            <hr></hr>
            <div className="howitworks-child">
                <div style={{width: '80%', textAlign: 'center'}}>
                    <p className="howitworks-subtitle">Check the fit</p>
                    <p className="howitworks-desc">We get real women of diverse body measurements to try on these dresses and see what fits and most imporantly how they feel in them</p>
                </div>
            </div>
            <hr></hr>
            <div className="howitworks-child">
                <div style={{width: '80%', textAlign: 'center'}}>
                    <p className="howitworks-subtitle">Gather reviews</p>
                    <p className="howitworks-desc">We take their reviews and show you the dresses we know will fit you because someone else with the same body tried it on for you and loved it</p>
                </div>
            </div>
            <hr></hr>
            <div className="howitworks-child-4">
            <div style={{textAlign: 'center', display: 'flex', alignItems: "center", flexDirection: "column"}}>
                <p className="howitworks-subtitle">Buy with confidence</p>
                <p className="howitworks-final-desc">So forget the uncertainity that comes from online shopping or the pain of fitting rooms and returns. Only see dresses that might as well have been tailored to your body so you can buy with confidence.</p>
              <Link to='/search'>
                <button className="howitworks-callToAction">
                  Try it out
                  <img src={WhiteArrow} className="landing-whitearrow"/>
                </button>
              </Link>
              </div>
            </div>
            <FooterSmall />
        </div>
    );
  }
} 
 

export default HowItWorks;
