import React from 'react';
import './InstagramModal.css';
import { callbackify } from 'util';

class InstagramModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="instaModal">
        <div className="instaModal-overlay" />
        <div className="instaModal-wrapper">
          <div className="instaModal-inner">
            <div className="instaModal-img-wrapper">
              <img src={this.props.info.imgLink} className="instaModal-img" />
            </div>
            <div className="instaModal-info-wrapper">
              <span className="close-instaModal-btn" onClick={this.props.close}>
                ×
              </span>
              <div>
                <div className="instaModal-shop-wrapper">
                  <div className="instaModal-shop-img-wrapper">
                    <img src={this.props.info.dressImg} className="instaModal-shop-img" />
                  </div>
                  <div className="instaModal-shop-action">
                    <div className="instaModal-shop-info">
                      <p className="instaModal-shop-name">{this.props.info.dressName}</p>
                      <p className="instaModal-shop-brand">{this.props.info.dressBrand}</p>
                    </div>
                    <div className="instaModal-shopbtn-wrapper">
                      <a href={this.props.info.dressLink}>
                        <button className="instaModal-shop-btn">Shop Now</button>
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="instaModal-comment">
                    <span>
                      <a
                        href="https://www.instagram.com/fit.to.form/"
                        className="instaModal-instagram-link"
                      >
                        @fit.to.form
                      </a>
                    </span>{' '}
                    {this.props.info.comment}
                  </p>
                </div>
              </div>
              <div className="instaModal-real-wrapper">
                <a
                  href="https://www.instagram.com/fit.to.form/"
                  className="instaModal-instagram-link"
                >
                  View on Instagram
                </a>
                <a href="https://www.instagram.com/fit.to.form/">
                  <img
                    src="https://likeshop.me/static/img/icon-social-ig.png"
                    className="instaModal-insta-logo"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InstagramModal;
