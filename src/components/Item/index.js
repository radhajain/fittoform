import React, { Component } from 'react';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.location.state;
        console.log(this.state);
        this.getHeightStr = this.getHeightStr.bind(this);

    }

    getHeightStr() {
        var heightFt = Math.round(this.state.height / 12);
        var heightIn = this.state.height % 12;
        return heightFt + "'" + heightIn;
    };

    render() {
        //TODO: add reviews for each user and recommended size 
        //TODO: fix back button to results
        return (
        <div className="itemView">
            <div className="itemView-c1">
                <div className="itemView-c1-inner">
                    <div className="itemView-c1-left">
                        <div className="itemView-c1-text">
                            <div className="itemView-titleBtn-div">
                                <p className="itemView-item-title">{this.state.item.name}</p>
                                <button className="itemView-shop-btn"><a href={this.state.item.link} className="itemView-shop-link">SHOP</a></button>
                            </div>
                            <p className="itemView-item-brand" style={{marginTop: 0}}>{this.state.item.brand}</p>
                            <p className="itemView-item-brand">Available in {this.state.item.color}</p>
                            <p className="itemView-item-size">Recommended size: 27</p>
                            <p className="itemView-item-price">${this.state.item.price}</p>


                            {/* { isSaved(this.selectedItem.name)
                            ? <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Removed from Saved</button>
                            : <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Save for later</button>
                            } */}
                        
                            <p className="itemView-review-title"> <i>See what other people with your measurements have to say</i></p>
                            <p className="itemView-item-measurements"><i>Showing women that are {this.getHeightStr()}, waist: {this.state.waist}", hips: {this.state.hips}", bust: {this.state.bust}" </i></p>
                            <hr />

                            <div className="itemView-review">
                                <p className="itemView-numRating">10/10</p>
                                <div>
                                    <p className="itemView-comment">I tried the XS too and this fits much better! I love this print and fit for summer! It's a cute length too, would definitely recommend!</p>
                                    <p className="itemView-review-name"> - Alina</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="itemView-c1-right">
                        <img alt={this.state.item.name} src={this.state.item.img} className="itemView-img"/>
                    </div>
                </div>
            </div>
        </div>
        );
    }
 }

export default Item;