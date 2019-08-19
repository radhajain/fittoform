import React from 'react';
import { FooterSmall } from '../Footer';
import firebase from 'firebase';
import ProgressiveImage from 'react-progressive-image';
import './Shop.css';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dresses: [],
      dressIDs: [],
      isLoaded: false,
      currDiv: ''
    };
    console.log(this.props);
    if (this.props.location.state && this.props.location.state.currDiv) {
      this.state.currDiv = this.props.location.state.currDiv;
    }
    this.getWholePrice = this.getWholePrice.bind(this);
    this.getNumColors = this.getNumColors.bind(this);
    this.goToItemView = this.goToItemView.bind(this);
  }

  loadData() {
    var dresses = [];
    var dressIDs = [];
    var dressesRef = firebase
      .database()
      .ref('dresses')
      .orderByKey();
    dressesRef.once('value').then(snapshot => {
      snapshot.forEach(dress => {
        if (dress.val().inStock) {
          dresses.push(dress.val());
          dressIDs.push(dress.key);
        }
      });
      this.setState(
        {
          dresses: dresses.reverse(),
          dressIDs: dressIDs.reverse(),
          isLoaded: true
        },
        () => {
          console.log(this.state);
          if (this.state.currDiv) {
            var currPage = document.getElementById(this.state.currDiv);
            if (currPage) {
              const yCoordinate = currPage.getBoundingClientRect().top - 80;
              window.scrollTo({
                top: yCoordinate
              });
            }
          } else {
            window.scrollTo({
              top: 0
            });
          }
        }
      );
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadData = this.loadData.bind(this);
    if (this._isMounted) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getNumColors(colors) {
    if (colors.indexOf(',') > -1) {
      var colorsArr = colors.split(',');
      return colorsArr.length + ' colors';
    } else {
      return '';
    }
  }

  getWholePrice(price) {
    return Math.round(price);
  }

  goToItemView(selectedItem, key, dressID) {
    this.props.history.push({
      pathname: '/item',
      state: {
        item: selectedItem,
        divID: key,
        dressID: this.state.dressIDs[key],
        fromShopAll: true
      }
    });
  }

  render() {
    const placeholder = (
      <div style={{ backgroundColor: '#E2F8F6', cursor: 'wait' }} className="results-img" />
    );

    return (
      <div className="shop">
        <div className="landing-fakeNav" />
        <div className="shop-inner">
          {this.state.isLoaded &&
            this.state.dresses.map((dress, index) => {
              return (
                dress && (
                  <div
                    key={index}
                    id={index}
                    className="shop-item-div"
                    onClick={() => this.goToItemView(dress, index)}
                  >
                    <ProgressiveImage src={dress.img}>
                      {(src, loading) => {
                        return loading ? (
                          placeholder
                        ) : (
                          <img
                            src={src}
                            onMouseOver={e =>
                              dress.img2
                                ? (e.currentTarget.src = dress.img2)
                                : console.log("don't have rollover")
                            }
                            onMouseOut={e =>
                              dress.img2
                                ? (e.currentTarget.src = dress.img)
                                : console.log('no return')
                            }
                            alt={dress.name}
                            className="results-img"
                          />
                        );
                      }}
                    </ProgressiveImage>
                    <div className="shop-item-info">
                      <p className="shop-brand">
                        {dress.brand} ${this.getWholePrice(dress.price)}
                      </p>
                      <p className="shop-color">{this.getNumColors(dress.color)}</p>
                    </div>
                  </div>
                )
              );
            })}
        </div>
        <FooterSmall />
      </div>
    );
  }
}

export default Shop;
