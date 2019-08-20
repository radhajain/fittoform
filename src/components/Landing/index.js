import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { FooterLarge } from '../Footer';
import InstagramEmbed from 'react-instagram-embed';
import InstagramModal from '../InstagramModal';
import blueArrow from '../../assets/images/blue_arrow.svg';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      error: null,
      user: {
        name: '',
        height: '',
        waist: '',
        hips: '',
        bust: '',
        size: '',
        bra: ''
      },
      showInstaModal: false,
      currInstaIndex: null
    };
    this.showInstaModal = this.showInstaModal.bind(this);
    this.goToItemView = this.goToItemView.bind(this);
    this.hideInstaModal = this.hideInstaModal.bind(this);
    this.instaPosts = [
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_rox_optimized.jpg',
        dressLink: 'https://www.princesspolly.com/gracie-mini-dress',
        dressImg:
          'https://cdn.shopify.com/s/files/1/0061/8627/0804/products/4_106_31_1800x.jpg?v=1555644833',
        dressName: 'Gracie Mini Dress',
        dressBrand: 'Princess Polly',
        comment: 'Roxanna in Gracie Mini Dress by Princess Polly, Size 4'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_logan_optimized.jpg',
        dressLink: 'https://fave.co/2KcKhuz',
        dressImg:
          'https://images.bloomingdalesassets.com/is/image/BLM/products/7/optimized/10362037_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$&fmt=webp',
        dressName: 'Whisper Ruffle-Trim Sweetheart Dress',
        dressBrand: 'French Connection',
        comment: 'Logan in Ruffle-Trim Sweetheart Dress by French Connection, Size 4'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_marri_optimized.jpg',
        dressLink: 'https://www.zara.com/us/en/textured-dress-with-belt-p01165702.html',
        dressImg:
          'https://static.zara.net/photos///2019/I/0/1/p/1165/702/614/2/w/560/1165702614_1_1_1.jpg?ts=1562761407624',
        dressName: 'Textured Dress with Belt',
        dressBrand: 'Zara',
        comment: 'Marri in Textured Dress with Belt by Zara, Size L'
      },
      {
        imgLink: 'https://fittoform-landing.s3.amazonaws.com/ig_emily_optimized.jpg',
        dressLink: 'https://realisationpar.com/the-alexandra-red-star/',
        dressImg:
          'https://cdn11.bigcommerce.com/s-233ct/images/stencil/759x1000/products/59/2059/ALEXANDRA_RedStar_web___50429__10528.1549336994.jpg?c=2',
        dressName: 'The Alexandra',
        dressBrand: 'Realisation Par',
        comment: 'Emily in The Alexandra by Realisation Par, Size 4'
      }
    ];
    this.featuredDresses = [
      {
        dressID: '-LlJSxnz9qBqEGqRHKg0',
        bra: 'any',
        brand: "L'Academie",
        color: 'Blue, Pink, White',
        distributor: 'Revolve',
        dressLink:
          'https://redirect.viglink.com?key=893f3ebe79d4316f39781f8c764affb1&u=https%3A%2F%2Fwww.revolve.com%2Flacademie-august-shirt-dress-in-blue-stripe%2Fdp%2FLCDE-WD236%2F',
        freeReturns: true,
        freeShippingAmount: '0',
        img: 'https://is4.revolveassets.com/images/p4/n/z/LCDE-WD236_V1.jpg',
        img2: 'https://is4.revolveassets.com/images/p4/n/z/LCDE-WD236_V3.jpg',
        inStock: true,
        length: 'mini',
        material: 'polyester',
        name: 'August Shirt Dress',
        neckline: 'normal',
        occassion: 'daytime-cute',
        price: '168',
        straps: 'long-sleeve',
        style: 't-shirt'
      },
      {
        dressID: '-LjtNmG3AC-3PE_K2mu9',
        age: '22F',
        bra: 'any',
        brand: 'Free People',
        color: 'Black, Pale Pink',
        distributor: 'Free People',
        dressLink: 'https://fave.co/2NZGgPm',
        freeReturns: true,
        freeShippingAmount: 100,
        img:
          'https://s7d5.scene7.com/is/image/FreePeople/52643863_001_a?$a15-pdp-detail-shot$&hei=900&qlt=80&fit=constrain',
        img2:
          'https://s7d5.scene7.com/is/image/FreePeople/52643863_001_b?$a15-pdp-detail-shot$&hei=900&qlt=80&fit=constrain',
        inStock: 'true',
        length: 'mini',
        material: 'cotton',
        name: 'Pera Mini Dress',
        neckline: 'normal',
        occassion: 'Daytime-Cute, Day-to-Night, going-out',
        price: '108',
        straps: 'short-sleeve',
        style: 'a-line'
      },
      {
        dressID: '-Lk_wbowH-aXMrzaUNsb',
        age: '23F',
        bra: 'none',
        brand: 'Lovers + Friends',
        color: 'Red',
        distributor: 'Revolve',
        dressLink:
          'https://redirect.viglink.com?key=893f3ebe79d4316f39781f8c764affb1&u=https%3A%2F%2Fwww.revolve.com%2Flovers-friends-skylight-dress%2Fdp%2FLOVF-WD684%2F',
        freeReturns: true,
        freeShippingAmount: 0,
        img: 'https://is4.revolveassets.com/images/p4/n/z/LOVF-WD684_V1.jpg',
        img2: 'https://is4.revolveassets.com/images/p4/n/z/LOVF-WD684_V3.jpg',
        inStock: true,
        length: 'knee',
        material: 'lace',
        name: 'Skylight Dress',
        neckline: 'v-neck',
        occassion: 'Going-out, wedding-guest',
        price: '180',
        straps: 'tank',
        style: 'bodycon'
      },

      {
        dressID: '-LiUyJxMCnSEXXzIrQLq',
        bra: 'none',
        brand: 'Lulus',
        color: 'White',
        distributor: 'Lulus',
        dressLink: 'https://fave.co/2NYtjFq',
        freeReturns: true,
        freeShippingAmount: 50,
        img: 'https://www.lulus.com/images/product/xlarge/3964490_326782.jpg?w=560',
        img2: 'https://www.lulus.com/images/product/xlarge/3115280_326782.jpg?w=560',
        inStock: true,
        length: 'maxi',
        material: 'rayon',
        name: 'Ivory Embroidered Maxi',
        neckline: 'v-neck',
        occassion: 'Island-Vibes, Daytime-Cute',
        price: '53',
        straps: 'tank',
        style: 'fit-and-flare'
      }
    ];
    this.featuredDresses2 = [
      {
        dressID: '-LkFrWaQ1bV6VKe85sp2',
        age: '22F',
        bra: 'none',
        brand: 'Realisation Par',
        color: 'yellow, white, black, tiger, purple',
        distributor: 'Réalisation Par ',
        dressLink: 'https://fave.co/2y0C5YJ',
        freeReturns: true,
        freeShippingAmount: 350,
        img:
          'https://cdn11.bigcommerce.com/s-233ct/images/stencil/759x1000/products/128/2630/rachel_edit9__08714.1512498405.500.659__67781__62737.1549337336.jpg?c=2',
        img2:
          'https://cdn11.bigcommerce.com/s-233ct/images/stencil/759x1000/products/128/2627/BAMBI_ChristySunflower_2__81289.1512066675.500.659__96331__85005.1549337336.jpg?c=2',
        inStock: true,
        length: 'mini',
        material: 'silk',
        name: 'The Christy',
        neckline: 'normal',
        occassion: 'Daytime-cute, day-to-night, island-vibes',
        price: '180',
        straps: 'tank',
        style: 'fit-and-flare'
      },
      {
        dressID: '-LlJN_C5ll_zqbmSXaAw',
        bra: 'tank',
        brand: 'Reformation',
        color: 'Red',
        distributor: 'Nordstrom',
        dressLink: 'https://bit.ly/2KbTTqE',
        freeReturns: true,
        freeShippingAmount: '0',
        img:
          'https://n.nordstrommedia.com/id/sr3/e5c6b4a4-6e4f-4e53-b6c6-e88cd6fc177a.jpeg?crop=pad&pad_color=FFF&format=jpeg&w=780&h=1196&dpr=2&quality=60',
        img2:
          'https://n.nordstrommedia.com/id/sr3/551c8230-c78f-482e-acbb-95d3d1f78cf7.jpeg?crop=pad&pad_color=FFF&format=jpeg&w=780&h=1196&dpr=2&quality=60',
        inStock: true,
        length: 'midi',
        material: 'polyester',
        name: 'Isabel Sheath Dress',
        neckline: 'normal',
        occassion: 'daytime-cute, day-to-night, going-out',
        price: '198',
        straps: 'tank',
        style: 'a-line'
      },
      {
        dressID: '-LiC0ADQDiXUJBw694Y0',
        bra: 'strapless',
        brand: 'Majorelle',
        color: 'White',
        distributor: 'Revolve',
        dressLink:
          'https://redirect.viglink.com?key=893f3ebe79d4316f39781f8c764affb1&u=https%3A%2F%2Fwww.revolve.com%2Fmajorelle-bandit-dress%2Fdp%2FMALR-WD208%2F',
        freeReturns: true,
        freeShippingAmount: 0,
        img: 'https://is4.revolveassets.com/images/p4/n/z/MALR-WD208_V1.jpg',

        img2: 'https://is4.revolveassets.com/images/p4/n/z/MALR-WD208_V3.jpg',
        inStock: true,
        length: 'mini',
        material: 'jersey',
        name: 'Bandit Dress',
        neckline: 'normal',
        occassion: 'Night-out',
        price: '138',
        straps: 'strapless',
        style: 'bodycon'
      },

      {
        dressID: '-LiZPEDcIkRc0_j5n3SK',
        bra: 'none',
        brand: 'Lulus',
        color: 'Blue, Yellow',
        distributor: 'Lulus',
        dressLink: 'https://fave.co/32BUyZV',
        freeReturns: true,
        freeShippingAmount: 50,
        img: 'https://www.lulus.com/images/product/xlarge/3288240_609182.jpg?w=560&hdpi=1',
        img2: 'https://www.lulus.com/images/product/xlarge/3242130_609182.jpg?w=372&hdpi=1',
        inStock: true,
        length: 'mini',
        material: 'rayon',
        name: 'Yellow Wrap Dress',
        neckline: 'plunge',
        occassion: 'Daytime-Cute, Day-to-Night',
        price: '39',
        straps: 'tank',
        style: 'fit-and-flare'
      }
    ];
  }

  goToItemView(dress, index) {
    this.props.history.push({
      pathname: '/item',
      state: {
        item: dress,
        dressID: dress.dressID,
        fromShopAll: true
      }
    });
  }

  showInstaModal(idx) {
    console.log('showing insta modal...');
    this.setState({
      currInstaIndex: idx,
      showInstaModal: true
    });
  }

  hideInstaModal() {
    this.setState({
      showInstaModal: false
    });
  }

  // Sets the user values
  getUserData(uid) {
    let UserRef = firebase
      .database()
      .ref('users')
      .child(`${uid}`);
    return UserRef.once('value').then(snapshot => {
      let user = snapshot.val();
      var userInfo = {
        bra: user.bra,
        bust: user.bust,
        name: user.name,
        height: user.height,
        hips: user.hips,
        size: user.size,
        waist: user.waist,
        id: uid
      };
      return userInfo;
    });
  }

  authlistener() {
    this.listener = firebase.auth().onAuthStateChanged(authUser => {
      if (authUser) {
        this.getUserData(authUser.uid).then(userInfo => {
          this.setState(
            {
              user: userInfo
            },
            () => {
              console.log(this.state);
              this.props.history.push({
                pathname: '/results',
                state: {
                  height: this.state.user.height,
                  waist: this.state.user.waist,
                  hips: this.state.user.hips,
                  bra: this.state.user.bra,
                  bust: this.state.user.bust,
                  size: this.state.user.size,
                  name: this.state.user.name
                }
              });
            }
          );
        });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.authlistener = this.authlistener.bind(this);
    if (this._isMounted) {
      this.authlistener();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.listener && this.listener();
    this.authlistener = undefined;
  }

  render() {
    return (
      <div className="landing-parent">
        <div className="landing-fakeNav" />
        <div className="landing-title-container">
          {this.state.showInstaModal && (
            <InstagramModal
              show={this.state.showInstaModal}
              close={this.hideInstaModal}
              info={this.instaPosts[this.state.currInstaIndex]}
            />
          )}
          <div className="landing-intro-img" />
          <div className="landing-content">
            <div>
              <p className="landing-title">Shop dresses knowing they'll fit.</p>
              {/* <p className="landing-subtitle">Recommended by women with your measurements.</p> */}
            </div>
            <Link to="/search">
              <button className="landing-fitquiz">TAKE THE FIT QUIZ</button>
            </Link>
          </div>
        </div>
        <div className="landing-shop-container">
          <div className="landing-shop-content">
            <p className="landing-shop-title">Our Collection</p>
            <div className="landing-items-container">
              {this.featuredDresses2.map((dress, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => this.goToItemView(dress, index)}
                    style={{ cursor: 'pointer' }}
                    className={'landing-item-' + index}
                  >
                    <img src={dress.img} alt={dress.name} className="landing-item-img" />
                    <div className="landing-item-info">
                      <p className="landing-item-name">{dress.name}</p>
                      <p className="landing-item-brand">{dress.brand}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="landing-items-container">
              {this.featuredDresses.map((dress, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => this.goToItemView(dress, index)}
                    style={{ cursor: 'pointer' }}
                    className={'landing-item-' + index}
                  >
                    <img src={dress.img} alt={dress.name} className="landing-item-img" />
                    <div className="landing-item-info">
                      <p className="landing-item-name">{dress.name}</p>
                      <p className="landing-item-brand">{dress.brand}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Link to="/search" style={{ textDecoration: 'none', color: 'black' }}>
            <div className="landing-link-box">
              <p className="landing-link">SHOP ALL</p>
            </div>
          </Link>
        </div>
        <div className="landing-philosophy-container">
          <div className="landing-philosophy-content">
            <p className="landing-typewriter">OUR PHILOSOPHY</p>
            <p className="landing-philosophy-text">
              All bodies are made unique, and we want to help you find the clothes that will make
              yours look best. Too many of us feel sizing is hit or miss. We show you something fits
              in the most trustworthy way we know how, by only showing you items that look great on
              someone else with the exact same body as you.
            </p>
          </div>
        </div>
        <div className="landing-info-row">
          <div className="landing-info-pic landing-pic1" />
          <div className="landing-info-container">
            <div className="landing-info-content">
              <p className="landing-info-title">
                Women with your measurements have tried these dresses on
              </p>
              <p className="landing-info-subtitle">
                Brands and even items can have inconsistent sizing. Every piece on our site has been
                tried on by real women who are the same size as you.
              </p>
              <Link to="/howitworks" style={{ textDecoration: 'none', color: 'black' }}>
                <div className="landing-link-box">
                  <p className="landing-link">READ MORE</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="landing-info-row landing-row-2">
          <div className="landing-info-container">
            <div className="landing-info-content">
              <p className="landing-info-title">One place to shop all of your favorite brands</p>
              <p className="landing-info-subtitle">
                Brands and even items can have inconsistent sizing. Every piece on our site has been
                tried on by real women who are the same size as you.
              </p>
              <Link to="/search">
                <button className="landing-fitquiz">TAKE THE FIT QUIZ</button>
              </Link>
            </div>
          </div>
          <div className="landing-info-pic landing-pic2" />
        </div>
        <div className="landing-instagram-container">
          <p className="landing-instagram-title">
            Join the movement{' '}
            <a href="https://www.instagram.com/fit.to.form/" style={{ color: 'black' }}>
              @fit.to.form
            </a>
          </p>
          <div className="landing-instagram-content">
            <div className="landing-instagram-posts">
              {this.instaPosts.map((info, idx) => {
                return (
                  <img
                    className="landing-insta-img"
                    src={info.imgLink}
                    onClick={() => this.showInstaModal(idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <FooterLarge />
      </div>
    );
  }
}

export default Landing;
