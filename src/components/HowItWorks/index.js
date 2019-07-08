import React from 'react';
import { Link } from 'react-router-dom';
import WhiteArrow from '../../assets/images/white-arrow.png';
import { FooterLarge } from '../Footer';
import './HowItWorks.css'
import FullLady from '../../assets/images/howitworks-full.svg';
import dress1 from '../../assets/images/howitworks-1.svg';
import dress2 from '../../assets/images/howitworks-2.svg';
import dress3 from '../../assets/images/howitworks-3.svg';
import dress4 from '../../assets/images/howitworks-4.svg';
import dress5 from '../../assets/images/howitworks-5.svg';
import dress6 from '../../assets/images/howitworks-6.svg';

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="howitworks-parent">
            <div className="howitworks-child howitworks-dark howitworks-first">
              <div className="howitworks-child-inner" style={{justifyContent: 'center', alignItems: 'center', width: '80%'}}>
              <div className="howitworks-title-div">
                  <p className="howitworks-title">Shopping, as it should be.</p>
                  <p className="howitworks-title-desc">A personalized shopping experience where everything has been tried and tested by women with the same body as you.</p>
                  <Link to='/search'>
                    <button className="howitworks-callToAction howitworks-small-margin">
                      Try it out
                      <img src={WhiteArrow} className="landing-whitearrow"/>
                    </button>
                  </Link>
              </div>
              </div>
            </div>
            <div className="howitworks-child">
              <div className="howitworks-child-inner">
                <div className="howitworks-child-c1">
                    <div className="howitworks-child-c1-flex">
                      <div className="howitworks-child-c1-c1">
                          <div>
                          <p className="howitworks-brands">Free People</p>
                          <p className="howitworks-brands">Lovers + Friends</p>
                          <p className="howitworks-brands">Topshop</p>
                          <p className="howitworks-brands">Zara</p>
                          <p className="howitworks-brands">Majorelle</p>
                          <p className="howitworks-brands">ACQUA</p>
                          <p className="howitworks-brands">Aritzia</p>
                          <p className="howitworks-brands">All Saints</p>
                          <p className="howitworks-brands">Realization Par</p>
                          </div>
                      </div>
                      <div className="howitworks-child-c1-c2">
                        <div>
                          <p className="howitworks-brands">Reformation</p>
                          <p className="howitworks-brands">superdown</p>
                          <p className="howitworks-brands">Lulus</p>
                          <p className="howitworks-brands">H&M</p>
                          <p className="howitworks-brands">Anthropologie</p>
                          <p className="howitworks-brands">Alice + Olivia</p>
                          <p className="howitworks-brands">Club Monaco</p>
                          <p className="howitworks-brands">French Connection</p>
                          <p className="howitworks-brands">Urban Outfitters</p>
                        </div>
                      </div>
                  </div>
                </div>
              <div className="howitworks-child-c2">
                <p className="howitworks-bigNum">01</p>
                <div className="howitworks-child-c2-content">
                  <p className="howitworks-subtitle">IT STARTS WITH STYLE</p>
                  <p className="howitworks-desc">We choose the most popular items from brands you love. Discover new designers   and see what people like you are wearing.</p>
                </div>
              </div>
              </div>
            </div>
            <div className="howitworks-child howitworks-dark">
              <div className="howitworks-child-inner">
                <div className="howitworks-child-c1">
                    <img src={FullLady} className="hiw-full-lady"/>
                </div>
                <div className="howitworks-child-c2">
                  <p className="howitworks-bigNum">02</p>
                  <div className="howitworks-child-c2-content">
                    <p className="howitworks-subtitle">WE CHECK THE FIT</p>
                    <p className="howitworks-desc">Hundreds of women with different measurements try on each piece. We see what fits, and most importantly how they feel.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="howitworks-child">
              <div className="howitworks-child-inner">
                <div className="howitworks-child-c1">
                    <div className="howitworks-child-dressgrid">
                        <img src={dress1} className="howitworks-dress-icon"/>
                        <img src={dress2} className="howitworks-dress-icon"/>
                        <img src={dress3} className="howitworks-dress-icon hiw-dress3"/>
                        <img src={dress4} className="howitworks-dress-icon"/>
                        <img src={dress5} className="howitworks-dress-icon"/>
                        <img src={dress6} className="howitworks-dress-icon hiw-dress6"/>
                    </div>
                </div>
                <div className="howitworks-child-c2">
                  <p className="howitworks-bigNum">03</p>
                  <div className="howitworks-child-c2-content">
                    <p className="howitworks-subtitle">You see the best of the best</p>
                    <p className="howitworks-desc">We show you the dresses they loved. You pick the styles that you want, knowing that all the items will fit you.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="howitworks-child-4 howitworks-dark">
            <div style={{textAlign: 'center', display: 'flex', alignItems: "center", flexDirection: "column"}}>
              <Link to='/search'>
                <button className="howitworks-callToAction">
                  Try it out
                  <img src={WhiteArrow} className="landing-whitearrow"/>
                </button>
              </Link>
              </div>
            </div>
            <FooterLarge />
        </div>
    );
  }
} 
 

export default HowItWorks;
