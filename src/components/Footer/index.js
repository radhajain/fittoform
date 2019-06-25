import React from 'react';
import { Link } from 'react-router-dom';
import IGLogo from '../../assets/images/ig-logo.png'
import * as ROUTES from '../../constants/routes';

import './Footer.css'

const Footer = () => (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="row">
          <div className="footer-about">
            <h6>About</h6>
            <p className="text-justify">Based in San Francisco, Fit to Form is the only shopping experience that is focused on fit. We understand the uncertainties of online shopping and the frustrations that come with returns. Our mission is to help every woman find their perfect dress that makes them feel like a million bucks.</p>
          </div>

          <div className="footer-about">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><a href="">About Us</a></li>
              <li><a href="">FAQs</a></li>
            </ul>
            <div className="footer-social-icons">
                <a style={{display: "table-cell"}} href="https://www.instagram.com/fit.to.form/" target="_blank">
                    <img src={IGLogo} style={{width: 35}}/>
                </a> 
            </div>
          </div>

          
        </div>
        <hr></hr>
      </div>
      <div className="footer-container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2019 All Rights Reserved by Fit to Form
            </p>
          </div>

          
        </div>
      </div>
</footer>
);

export default Footer;
