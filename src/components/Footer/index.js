import React from 'react';
import { Link } from 'react-router-dom';
import IGLogo from '../../assets/images/ig-logo.png';
import * as ROUTES from '../../constants/routes';

import './Footer.css';

const FooterLarge = () => (
  <footer className="site-footer">
    <div className="footer-container">
      <div className="row">
        <div className="footer-about">
          <p className="footer-headers">About</p>
          <p className="footer-abouttext">
            Based in San Francisco, Fit to Form is the only shopping experience that is focused on
            fit. We understand the uncertainties of online shopping and the frustrations that come
            with returns. Our mission is to help every woman find their perfect dress that makes
            them feel like a million bucks.
          </p>
        </div>

        <div className="footer-about footer-c2">
          <ul className="footer-links">
            <li>
              <Link to={ROUTES.HOWITWORKS}>How It Works</Link>
            </li>
            <li>
              <Link to={ROUTES.CONTACT}>Contact Us</Link>
            </li>
          </ul>
          <div className="footer-social-icons">
            <a
              style={{ display: 'table-cell' }}
              href="https://www.instagram.com/fit.to.form/"
              target="_blank"
            >
              <img src={IGLogo} style={{ width: 35 }} />
            </a>
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
    <div className="footer-container">
      <div className="row">
        <div className="col-md-8 col-sm-6 col-xs-12">
          <p className="copyright-text">Copyright &copy; 2019 All Rights Reserved by Fit to Form</p>
        </div>
      </div>
    </div>
  </footer>
);

const FooterSmall = () => (
  <div className="footer-sm-outer">
    <div className="footer-sm-inner">
      <div className="footer-sm-divs footer-sm-c1">
        <p className="copyright-text"> &copy; 2019 Fit to Form</p>
      </div>
      <div className="footer-sm-divs footer-sm-c2">
        <p className="footer-sm-label footer-connect">Let's connect</p>
        <a
          style={{ display: 'table-cell' }}
          href="https://www.instagram.com/fit.to.form/"
          target="_blank"
        >
          <img src={IGLogo} style={{ width: 20, display: 'inline-block', marginLeft: 15 }} />
        </a>
      </div>
      <div className="footer-sm-divs footer-sm-c3">
        <div>
          <Link to={ROUTES.HOWITWORKS} className="footer-sm-links">
            How It Works
          </Link>
          <Link to={ROUTES.CONTACT} className="footer-sm-links footer-sm-contact">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export { FooterLarge, FooterSmall };
