import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import './Results.css';
import { FooterSmall } from '../Footer';
import downArrow from '../../assets/images/menu-hide-arrow.png';
import ProgressiveImage from 'react-progressive-image';


// class EditMeasurements extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <div>
//                 <p>Create an account to edit your measurements</p>
//                 <form className="login-form" onSubmit={this.onSubmit} >
//                     <input 
//                     name="name"
//                     value={name}
//                     onChange={this.onChange}
//                     type="text" 
//                     placeholder="username"/>
//                     <input 
//                     name="email"
//                     value={email}
//                     onChange={this.onChange}
//                     type="text" 
//                     placeholder="username"/>
//                     <input 
//                     name="password"
//                     value={password}
//                     onChange={this.onChange}
//                     type="password" 
//                     placeholder="password"/>
//                     <PasswordForgetLink />
//                     <button disabled={isInvalid} type="submit" >login</button>
//                     {error && <p>{error.message}</p>}
//                     <SignUpLink />
//                 </form>
//             </div>

//         );
//     }
// }



class Results extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.state);
        // var dressObj = {
        //     "64, 26, 35, 36": {
        //         bra: "any",
        //         brand: "Free People",
        //         color: "Ivory",
        //         dressLink: "https://www.freepeople.com/shop/fp-one-verona-dress/",
        //         img: "https://s7d5.scene7.com/is/image/FreePeople/50878875_011_a?$a15-pdp-detail-shot$&hei=900&qlt=80&fit=constrain",
        //         length: "mini",
        //         material: "Linen",
        //         name: "FP One Verona Dress",
        //         neckline: "normal",
        //         occassion: "Island-Vibes, Wedding-guest, Night-out",
        //         price: "128",
        //         straps: "tank",
        //         style: "fit-and-flare",
        //     }
        // }
        this.state = {
            bust: this.props.location.state.bust,
            height: this.props.location.state.height,
            hips: this.props.location.state.hips,
            waist: this.props.location.state.waist,
            size: this.props.location.state.size,
            name: (this.props.location.state.name ? this.props.location.state.name : ''),
            closestMeasurements: '',
            dressGroupID: null,
            dressesIDs: [],
            dressRatings: [],
            dressReviews: [],
            dressesLoaded: false,
            exactMatch: false,
            dresses: [],
            nextBestDressGroupIDs: [],
            nextBestDressesIDs: [],
            nextBestDresses: [],
            showMoreDresses: false,
            showRecInfo: true,
        };
        console.log(this.state);
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
        this.getDressesInfo = this.getDressesInfo.bind(this);
        this.getDressInfo = this.getDressInfo.bind(this);
        this.goToItemView = this.goToItemView.bind(this);
        this.getHeightStr = this.getHeightStr.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getBestDressesIDHelper = this.getBestDressesIDHelper.bind(this);
        this.getRating = this.getRating.bind(this);
        this.getNextBestDressesID = this.getNextBestDressesID.bind(this);
        this.getNextBestDressesIDHelper = this.getNextBestDressesIDHelper.bind(this);
        this.getNextBestDressesInfo = this.getNextBestDressesInfo.bind(this);
        this.dismissRecommendationPanel = this.dismissRecommendationPanel.bind(this);
    }

    componentDidMount() {
        // this.getBestDressGroupID().then(() => this.getBestDressesID());
        this.getBestDressGroupID().then(result => {
            console.log(result);
            this.setState({
                exactMatch: (result[2] === 0 ? true : false),
                dressGroupID: result[1],
                closestMeasurements: result[0],
                nextBestDressGroupIDs: result[3]
            }, () => {
                this.getBestDressesID(result[1]);
            });
        });
        window.scrollTo(0, 0);
    }

    handleInput(e) {
        e.preventDefault();
        this.setState({
            name: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.refs.resultsName.blur();
    }
 

    getBestDressGroupID() {
        //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements 
        // and this.state.dressGroupId
        var lowestDiff = Number.MAX_VALUE;
        var closestMeasurements, dressGroupID;
        var nextBestDressGroupIDs = [];
        var measurementsRef = firebase.database().ref('measurements');
        return new Promise((resolve, reject) => {
            measurementsRef.once('value').then((snapshot) => {
                snapshot.forEach(measurement => {
                    var values = measurement.val();
                    var heightDiff = (Math.abs(values.height - this.state.height) < 1) ? 0 : (Math.abs(values.height - this.state.height) - 1);
                    var diffSq = Math.pow((heightDiff),2) + Math.pow((values.waist - this.state.waist),2) + Math.pow((values.bust - this.state.bust),2) + Math.pow((values.hips - this.state.hips),2);
                    if (Math.sqrt(diffSq) < 2) {
                        nextBestDressGroupIDs.push(values);
                    }
                    if (Math.sqrt(diffSq) < lowestDiff) {
                        lowestDiff =  Math.sqrt(diffSq);
                        console.log("updating state");
                        console.log(lowestDiff);
                        closestMeasurements = values;
                        dressGroupID = values.dressGroupID;
                    }
                });
                resolve([closestMeasurements, dressGroupID, lowestDiff, nextBestDressGroupIDs]);
            });
        });
    }

    //Gets the dressIDs from the best dressGroup and then calls getDressInfo
    getBestDressesID(dressGroupID) {
        this.getBestDressesIDHelper(dressGroupID).then((results) => {
            this.setState({
                dressRatings: results[1],
                dressesIDs: results[0],
                dressReviews: (results[2].length === 0 ? [] : results[2])
            }, () => {
                console.log(this.state);
                this.getDressesInfo(results[0]);
            });
        })
    }

    //Returns the dressIDs in the best dress group
    getBestDressesIDHelper(dressGroupID) {
        var dressGroupIDRef = firebase.database().ref('dressGroup').child(dressGroupID);
        return dressGroupIDRef.orderByChild('rating').once('value').then(snapshot => {
            var dressIDs = [];
            var dressRatings = [];
            var dressReviews = [];
            snapshot.forEach(dress => {
                dressIDs.push(dress.val().dress);
                dressRatings.push(dress.val().rating);
                // console.log(dress.val().reviews);
                if (dress.val().reviews) {
                    dressReviews.push(dress.val().reviews);
                }
            })
            return [dressIDs, dressRatings, dressReviews]
            
        });
    }

    //Using the dressesIDs, gets information about each dress
    getDressesInfo(dressesIDs) {
        var dressesRef = firebase.database().ref('dresses');
        return Promise.all(dressesIDs.map(dressID => {
            return dressesRef.child(`${dressID}`);
        })).then((dressRefs) => {
            var promises = []
            for (const dressRef of dressRefs) {
                promises.push(this.getDressInfo(dressRef));
            }
            Promise.all(promises).then((dresses) => {
                this.setState({dresses: dresses});
            })
        })
    }

    // Helper function for getDressesInfo: 
    // Given the reference to a dress, gets information about the dress
    getDressInfo(dressRef) {
        return dressRef.once('value').then((snapshot) => {
            return snapshot.val();
        });
    }



    // GET NEXT BEST DRESSES


    getNextBestDressesID() {
        var promises = []
        for (const dressGroupRef of this.state.nextBestDressGroupIDs) {
            promises.push(
                this.getNextBestDressesIDHelper(dressGroupRef.dressGroupID, dressGroupRef.concatMtms).then((dresses) => {
                    this.setState({
                        nextBestDressesIDs: { 
                            ...this.state.nextBestDressesIDs, [dresses[1]]: dresses[0][0]  
                        },
                      });
                })
            );
        }
        Promise.all(promises).then((dresses) => {
            this.getNextBestDressesInfo();
        })
    }

    //Returns the dressIDs in the best dress group
    getNextBestDressesIDHelper(dressGroupID, concat) {
        var dressGroupIDRef = firebase.database().ref('dressGroup').child(dressGroupID);
        return dressGroupIDRef.orderByChild('rating').once('value').then(snapshot => {
            var dressIDs = [];
            var dressRatings = [];
            var dressReviews = [];
            snapshot.forEach(dress => {
                dressIDs.push(dress.val().dress);
                dressRatings.push(dress.val().rating);
                // console.log(dress.val().reviews);
                if (dress.val().reviews) {
                    console.log("found review");
                    dressReviews.push(dress.val().reviews);
                }
            })
            return [[{dressIDs: dressIDs, ratings: dressRatings, reviewIDs: dressReviews}], [concat]]
            
        });
    }


    //Using the dressesIDs, gets information about each dress
    getNextBestDressesInfo() {
        var dressesRef = firebase.database().ref('dresses');
        var allDressPromises = []
        for (var dressIDObjKey in this.state.nextBestDressesIDs) {
            allDressPromises.push(new Promise((resolve, reject) => {
                var dressIDs = this.state.nextBestDressesIDs[dressIDObjKey].dressIDs;
                var measurement = dressIDObjKey;
                console.log(measurement);
                return Promise.all(dressIDs.map(dressID => {
                    return dressesRef.child(`${dressID}`);
                })).then((dressRefs) => {
                    var promises = []
                    for (const dressRef of dressRefs) {
                        promises.push(this.getDressInfo(dressRef));
                    }
                    Promise.all(promises).then((dresses) => {
                        var newDressObj = {};
                        newDressObj["measurement"] = measurement
                        newDressObj["dresses"] = dresses;
                        resolve(newDressObj);
                    })
                })
            }));
        }
        Promise.all(allDressPromises).then((nextBestDresses) => {
            this.setState({
                nextBestDresses: nextBestDresses,
                showMoreDresses: true,
            }, () => {
                console.log(this.state);
                console.log(this.state.nextBestDresses);
            });
        }) 
    }







    goToItemView(selectedItem, key) {
        var dressID = this.state.dressesIDs[key];
        this.props.history.push({
            pathname: '/item',
            state: {
                item: selectedItem,
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bust: this.state.bust,
                size: this.state.size,
                name: this.state.name,
                dressGroupID: this.state.dressGroupID,
                cachedReviews: this.state.dressReviews[key],
                closestMeasurements: this.state.closestMeasurements,
                dressID: dressID,
            }
        });
    }

    getHeightStr() {
        var heightFt = Math.floor(this.state.height / 12);
        var heightIn = this.state.height % 12;
        return heightFt + "'" + heightIn;
    };

    getRating(rating) {
        if (rating > 10) {
            return 10;
        }
        return rating;
    }

    dismissRecommendationPanel() {
        this.setState({
            showRecInfo: false,
        });
    }

    getFirstName(name) {
        if (name.includes(' ')) {
          return name.split(' ')[0];
        }
        return name;
    }


    render() {
        const imgClassName = (this.state.dresses.length === 1 ? "results-img-single" : "results-img");
        const itemDivClass = (this.state.dresses.length === 1 ? "results-item-div" : "results-item-div results-item-div-multiple");
        var rightColClass = (
            this.state.showRecInfo ? (this.state.exactMatch ? "results-rightCol results-rightCol-adjust" : "results-rightCol") : "hide"
        );
        const dominantImageColor = '#EFE5E5';
        const placeholder = (
            <img src="https://fittoform-landing.s3.amazonaws.com/dress-loading.gif" className={imgClassName} />
        );
        
        return (
        <div>
        <div className="results-container-outer">
                <div className={this.state.exactMatch ? "results-leftCol results-leftCol-adjust" : "results-leftCol"}>
                    <div className="results-leftCol-inner">
                        <div className="results-grid">
                            {this.state.dresses.map((dress, key) => {
                                return (
                                    <div className="results-col" onClick={() => this.goToItemView(dress, key)} key={key}>
                                        <div className={itemDivClass}>
                                            <ProgressiveImage src={dress.img}>
                                            {(src, loading) => {
                                                return loading ? placeholder : <img src={src} alt="dress image" className={imgClassName}/>;
                                            }}
                                            </ProgressiveImage>
                                            <p className="results-rating">Rated {this.getRating(this.state.dressRatings[key])}/10 by women like you</p>
                                            <p className="results-price">${dress.price}</p>
                                        </div>
                                    </div>
                                );
                            })}
                             {this.state.showMoreDresses && Object.entries(this.state.nextBestDresses).map(([key, dressObj]) => 
                                <div className="results-col" onClick={() => this.goToItemView(dressObj.dresses[0], key)} key={key}>     
                                    <div className={itemDivClass}>
                                        <ProgressiveImage src={dressObj.dresses[0].img}>
                                        {(src, loading) => {
                                            return loading ? placeholder : <img src={src} alt="dress image" className={imgClassName}/>;
                                        }}
                                        </ProgressiveImage>
                                        <p className="results-rating">Rated {this.getRating(this.state.dressRatings[key])}/10 by women like you</p>
                                        <p className="results-rating">Recommended by women with size {dressObj.measurement} </p>
                                        <p className="results-price">${dressObj.dresses[0].price}</p>
                                    </div>
                                </div> 
                                // {dressObj.dresses.map( (dress,key) => {
                                //     console.log(dress);
                                //     return (
                                //         <div className="results-col" onClick={() => this.goToItemView(dress, key)} key={key}>
                                        
                                //             <div className={itemDivClass}>
                                //                 <ProgressiveImage src={dressObj.dresses[0].img}>
                                //                 {(src, loading) => {
                                //                     return loading ? placeholder : <img src={src} alt="dress image" className={imgClassName}/>;
                                //                 }}
                                //                 </ProgressiveImage>
                                //                 <p className="results-rating">Rated {this.getRating(this.state.dressRatings[key])}/10 by women like you</p>
                                //                 <p className="results-price">${dress.price}</p>
                                //             </div>
                                //         </div> 
                                //     );   
                                // })}                                
                            )}
                            {this.state.nextBestDressGroupIDs.length !== 0 && !this.state.showMoreDresses && <button onClick={this.getNextBestDressesID}>Load More Dresses</button>}
                           
                        </div>
                    </div>
                </div>
                <div className={rightColClass}>
                    <div className="results-rightCol-inner">
                        <div className="results-name-div">
                            <p className="results-text" style={{textAlign: 'right'}}>Curated for:</p>
                            <form style={{textAlign: 'right'}} onSubmit={this.handleSubmit} >
                                    <input
                                    name="name"
                                    type="text"
                                    ref="resultsName"
                                    value={this.getFirstName(this.state.name)}
                                    className="results-input"
                                    onChange={this.handleInput} 
                                    placeholder="ADD YOUR NAME"/>
                                    
                            </form>
                        </div>
                        <div className="results-title-div">
                            <p className="results-title">Chosen for you</p>
                        </div>
                        <div className="results-right-flexCol">
                            <div className="results-text-div">
                                <div className="results-menu-hide-div">
                                    <img src={downArrow} className="results-menu-hide-arrow" onClick={this.dismissRecommendationPanel}/>
                                </div>
                                {this.state.closestMeasurements && <p className="results-text">Recommended by other women that are {this.getHeightStr(this.state.closestMeasurements.height)}, bust {this.state.closestMeasurements.bust}, waist: {this.state.closestMeasurements.waist}, hips: {this.state.closestMeasurements.hips}</p>}
                                <p className="results-text-small"><i>Your measurements: {this.getHeightStr(this.state.height)}, bust: {this.state.bust}, waist: {this.state.waist}, hips: {this.state.hips}</i> </p>
                                {this.state.exactMatch && <p className="results-match">EXACT MATCH</p>}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <FooterSmall />
        </div>
        
        );
    }
 }

export default withFirebase(Results);