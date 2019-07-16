import React from 'react';
import { Link } from 'react-router-dom';
import { FooterLarge } from '../Footer';
import './HowItWorks.css';

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="howitworks-parent">
        <div className="landing-fakeNav" />
        <div className="howitworks-child">
          <div
            className="howitworks-child-inner"
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <div className="howitworks-content">
              <div className="howitworks-title-div">
                <div className="howitworks-titleCol">
                  <p className="howitworks-title">Shopping, based on your body.</p>
                </div>
                <div className="howitworks-titleCol">
                  <p className="howitworks-title-desc">
                    A personalized shopping experience where everything has been tried on and
                    recommended by your body doubles: women with your body measurements.
                  </p>
                </div>
              </div>
              <div className="howitworks-callToAction-wrapper">
                <Link to="/search">
                  <button className="howitworks-callToAction">
                    <div className="howitworks-btn-flexWrapper">Try it out</div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="howitworks-child  howitworks-first">
          <div className="howitworks-child-inner">
            <img
              src="https://fittoform-landing.s3.amazonaws.com/weddingdress_50p_progressive.jpg"
              className="howitworks-img"
            />
            <div className="howitworks-child-c1">
              <div className="howitworks-child-c1-flex">
                <div className="howitworks-child-c1-c">
                  <div>
                    <p className="howitworks-brands">Free People</p>
                    <p className="howitworks-brands">Lovers + Friends</p>
                    <p className="howitworks-brands">Topshop</p>
                    <p className="howitworks-brands">Zara</p>
                    <p className="howitworks-brands">Majorelle</p>
                  </div>
                </div>
                <div className="howitworks-child-c1-c">
                  <div>
                    <p className="howitworks-brands">Reformation</p>
                    <p className="howitworks-brands">superdown</p>
                    <p className="howitworks-brands">Lulus</p>
                    <p className="howitworks-brands">BB Dakota</p>
                    <p className="howitworks-brands">Anthropologie</p>
                  </div>
                </div>
                <div className="howitworks-child-c1-c">
                  <div>
                    <p className="howitworks-brands">Realization Par</p>
                    <p className="howitworks-brands">AQUA</p>
                    <p className="howitworks-brands">Aritzia</p>
                    <p className="howitworks-brands">All Saints</p>
                    <p className="howitworks-brands">Bardot</p>
                  </div>
                </div>
                <div className="howitworks-child-c1-c">
                  <div>
                    <p className="howitworks-brands">Urban Outfitters</p>
                    <p className="howitworks-brands">Alice + Olivia</p>
                    <p className="howitworks-brands">Club Monaco</p>
                    <p className="howitworks-brands">French Connection</p>
                    <p className="howitworks-brands">ASTR the Label</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="howitworks-child-c2">
              <p className="howitworks-bigNum">01</p>
              <div className="howitworks-child-c2-content">
                <p className="howitworks-subtitle">It starts with style</p>
                <p className="howitworks-desc">
                  We choose the most popular items from brands you love. Discover new designers and
                  see what people like you are wearing.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="howitworks-child howitworks-dark">
          <div className="howitworks-child-inner">
            <img
              src="https://fittoform-landing.s3.amazonaws.com/tapemeasure_60p_progressive.jpg"
              className="howitworks-img"
            />
            <div className="howitworks-child-c1"></div>
            <div className="howitworks-child-c2">
              <p className="howitworks-bigNum">02</p>
              <div className="howitworks-child-c2-content">
                <p className="howitworks-subtitle">We check the fit</p>
                <p className="howitworks-desc">
                  We have hundreds of women with different measurements try on dresses. We see what
                  fits, and most importantly how they feel.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="howitworks-child">
          <div className="howitworks-child-inner">
            <img
              src="https://fittoform-landing.s3.amazonaws.com/shopping_30p_progressive.jpg"
              className="howitworks-img"
            />
            <div className="howitworks-child-c1"></div>
            <div className="howitworks-child-c2">
              <p className="howitworks-bigNum">03</p>
              <div className="howitworks-child-c2-content">
                <p className="howitworks-subtitle">You see the best of the best</p>
                <p className="howitworks-desc">
                  Enter your size and see dresses loved by women with your body. Pick the styles you
                  like, knowing that all the items will fit you.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="howitworks-child-4 howitworks-dark">
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <div className="landing-callToAction-wrapper hiw-btn-bottom">
              <Link to="/search">
                <button className="landing-callToAction landing-btn-bottom">
                  <div className="landing-btn-flexWrapper">Try it out</div>
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

export default HowItWorks;
