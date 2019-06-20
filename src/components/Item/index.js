import React, { Component } from 'react';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.location.state;
        console.log(this.state);
        // this.selectedItem = this.props.location.item.selectedItem;
    }

    render() {
        return (
            <div className="itemView">
            <div className="itemView-c1">
                <div className="itemView-c1-inner">
                <div className="itemView-c1-left">
                  <img alt={this.state.item.name} src={this.state.item.img} style={{width: '100%'}}/>
                </div>
                <div className="itemView-c1-center">
                  <div className="itemView-c1-center-text">
                    <p className="itemView-item-title">{this.state.item.name}</p>
                    <p className="itemView-item-brand">{this.state.item.brand}</p>
                    <p className="itemView-item-price">{this.state.item.price}</p>
                    <p className="itemView-item-size">Recommended size: 27</p>
                    <p className="itemView-item-measurements"><i>Your measurements: height 5'2, waist 26", hips 32"</i></p>
                    <button className="itemView-shop-btn"><a href={this.state.item.link} className="itemView-shop-link">SHOP THIS ITEM</a></button>
                    {/* { isSaved(this.selectedItem.name)
                      ? <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Removed from Saved</button>
                      : <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Save for later</button>
                    } */}
                  </div>
                </div>

                <div className="itemView-c1-right">
                  <p className="itemView-item-title">Reviews</p>

                  <div className="itemView-review">

                      <div className="itemView-reviewer-profile">
                        <p className="itemView-reviewer-name">Maria <span style={{fontWeight: 'normal', textTransform: 'lowercase'}}>(100% match)</span> </p>
                        <p style={{marginBottom: '0px'}}>Height 5'2, Waist 26", Hips 32"</p>
                      </div>
                      <div className="itemView-reviewer-comment">
                        <p className="itemView-reviewer-title">Perfect fit</p>
                        <p>These jeans are perfect for my height, and fit just above the ankle. The waist in stretchy but also fitted. Would absolutely recommend.</p>
                      </div>
                    
                  </div>
                </div>
                </div>
            </div>
          </div>
        );
    }
 }

export default Item;