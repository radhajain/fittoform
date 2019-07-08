import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import WhiteArrow from '../../assets/images/white-arrow.png';
import pg2 from '../../assets/images/landing-p2.png';
import pg2SM from '../../assets/images/landing-2-sm.png';
import WrapImg from '../../assets/images/wrap-lady.png';

import { FooterLarge } from '../Footer';


class Landing extends React.Component {
  constructor(props) {
    super(props);
   }


  render() {
    return (
        <div className="landing-parent">
            <div className="landing-child" style={{display: 'block'}}>
            <div className="landing-container-intro">
                <div className="landing-intro-hero">
                    <div className="landing-intro-content">
                        <p className="landing-title">We try on dresses so you don't have to</p>
                        <p className="landing-desc">It's hard to know what fits your body while shopping online. We show you dresses recommended by women with your measurements. Buy with confidence, every time.</p>
                        <Link to='/search'>
                            <button className="landing-callToAction">
                                Try it out
                                <img src={WhiteArrow} className="landing-whitearrow"/>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="landing-howitworks-outer"> 
                    <div className="landing-howitworks-inner">
                        <p className="serif" style={{color: 'white', textAlign: 'center', fontSize: '1.75em'}}>How it works</p>
                        <hr />
                        <div className="landing-howitworks-steps">
                            <div className="landing-howitworks-box">
                                <p className="landing-howitworks-title">1. Tell us your size</p>
                                <p className="landing-howitworks-desc">Tell us what sizes you wear and how they normally fit</p>
                            </div>
                            <div className="landing-howitworks-box">
                                <p className="landing-howitworks-title">2. Browse curations</p>
                                <p className="landing-howitworks-desc">Get personalized recommendations by women with the same measurements as you</p>
                            </div>
                            <div className="landing-howitworks-box">
                                <p className="landing-howitworks-title">3. Buy with confidence</p>
                                <p className="landing-howitworks-desc">Read reviews from women with your measurements who have tried each dress on</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
            </div>
            <div className="landing-child landing-second-page">
                <div className="landing-container-inner">
                    <div className="landing-2-col-container">
                        <div className="landing-2-leftCol"> 
                            <div className="landing-2-content">
                                <p className="landing-second-title">Clothes look best when they fit.</p>
                                <p className="landing-second-desc">There’s a perfect dress for everyone, and we’re here to help you find it.</p>
                            </div>
                        </div>
                        <div className="landing-2-rightCol">
                            {/* <img src={pg2} className="landing-2-rightImg"/> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="landing-child landing-third-page">
                <img src={WrapImg} className="landing-third-img"/>
                
                <div className="landing-container-inner" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '80%', zIndex: 100, position: 'relative'}}>
                    <div className="landing-third-content"> 
                        <p className="landing-third-title">Women like you have tried on these dresses.</p>
                        <p className="landing-third-desc">Brands can have inconsistent sizing. Every piece on our site has been tried on by real women who are the same size as you. We show you a curated selection of dresses that we know will make you look fantastic. </p>
                    </div>
                    <div>
                        <img src="https://fittoform-landing.s3.amazonaws.com/wrap-sm%402x.jpg" className="landing-third-sm"/>
                    </div>
                </div>
            </div>
            <div className="landing-child landing-fourth-page">
                <div className="landing-container-inner" style={{position: 'relative'}}>
                    <div className="landing-fourth-img-rows">
                        <div className="landing-fourth-flex-grid">
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-1%402x.jpg" className="landing-fourth-img dress1"/>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-2%402x.jpg" className="landing-fourth-img dress2"/>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-3%402x.jpg" className="landing-fourth-img dress3"/>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-4%402x.jpg" className="landing-fourth-img dress4"/>
                        </div>
                        <div  className="landing-fourth-flex-grid landing-fourth-row2" style={{float: 'right', marginTop: 50}}>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-5%402x.jpg" className="landing-fourth-img2 dress5"/>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-6%402x.jpg" className="landing-fourth-img2 dress6"/>
                            <img src="https://fittoform-landing.s3.amazonaws.com/landing-4-7%402x.jpg" className="landing-fourth-img2 dress7"/>
                        </div>
                        
                    </div>
                    <div className="landing-fourth-content"> 
                        <p className="landing-fourth-title">You're the stylist.</p>
                        <p className="landing-fourth-desc">No subscriptions, no fees.  We give you the tools to find the pieces and styles you want - and the knowledge that they will flatter you. </p>
                        <Link to='/search'>
                            <button className="landing-callToAction">
                                Try it out
                                <img src={WhiteArrow} className="landing-whitearrow"/>
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
            <FooterLarge />
      </div>
    );
  }

} 
 


export default Landing;
