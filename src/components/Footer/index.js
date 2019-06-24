
import React, { Component } from 'react';
import './Footer.css';
import IGLogo from '../../assets/images/ig-logo.png'


const Footer = () => (
    <div className="footer-outer">
        <div className="footer-inner">
            <div className="footer-c1">
                <p>OUR MISSION</p>
                <hr style={{width: '60%', float: 'left'}} />
            </div>
            <div className="footer-c2">
                <p>Our Story</p>
                <p>FAQ</p>
                <p>Contact Us</p>
            </div>
            <div className="footer-c3">
                <p style={{fontWeight: 'bold'}}>Follow us:</p>
                <div>
                    <a style={{display: "table-cell"}} href="https://www.instagram.com/fit.to.form/" target="_blank">
                        <img src={IGLogo} style={{width: 35}}/>
                    </a>
                </div>
                
            </div>
        </div>
    </div>
  );


export default Footer;

