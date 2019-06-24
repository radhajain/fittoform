import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import Logo from '../../assets//images/insta1.jpeg';
import './Footer.css'

const Footer = () => (
    <footer class="site-footer">
      <div class="footer-container">
        <div class="row">
          <div class="footer-about">
            <h6>About</h6>
            <p class="text-justify">Based in San Francisco, Fit to Form is the only shopping experience that is focused on fit. We understand the uncertainties of online shopping and the frustrations that come with returns. Our mission is to help every woman find their perfect dress that makes them feel like a million bucks.</p>
          </div>

          <div class="footer-about">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <li><a href="">About Us</a></li>
              {/* <li><a href="">Contact Us</a></li> */}
            </ul>
            <ul class="social-icons">
              <li><a class="instagram" href="#"><i class="fa fa-instagram"></i></a></li>  
            </ul>
          </div>
        </div>
        <hr></hr>
      </div>
      <div class="footer-container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-12">
            <p class="copyright-text">Copyright &copy; 2019 All Rights Reserved by Fit to Form
            </p>
          </div>

          
        </div>
      </div>
</footer>
);

export default Footer;
