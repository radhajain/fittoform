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
        var dressObj = {
                measurement: "",
                ratings: [],
                dresses: [{
                    bra: "",
                    brand: "",
                    color: "",
                    dressLink: "",
                    img: "",
                    length: "",
                    material: "",
                    name: "",
                    neckline: "",
                    occassion: "",
                    price: "",
                    straps: "",
                    style: "",
                }]
        }
        this.state = {
            bust: this.props.location.state.bust,
            height: this.props.location.state.height,
            hips: this.props.location.state.hips,
            waist: this.props.location.state.waist,
            size: this.props.location.state.size,
            name: (this.props.location.state.name ? this.props.location.state.name : ''),
            fromItem: (this.props.location.state.fromItem ? this.props.location.state.fromItem : false),
            closestMeasurements: '',
            dressGroupID: null,
            //DressIDObjs: {dressIDs: [dressID, dressID ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
            dressesIDObjs: [],
            //DressIDObjs: {dresses: [dress, dress ...], ratings [10, 9 ...], reviewsIDs: [reviewID, reviewID ...]}
            dressesObjs: dressObj,
            nextBestDressesLoaded: false,
            exactMatch: false,
            //NextBestDressGroupIDs: [{ concatMtms: "64, 27, 24, 38", dressGroupID: "dressGroupID", height: , waist: , hips: , bust: },  ...]
            nextBestDressGroupIDs: [],
            //NextBestDressesIDs: [ {measurement: "64, 27, 24, 38", dressIDs: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}, ... ]
            nextBestDressesIDs: [],
            //NextBestDresses: [{ measurement: "64, 27, 24, 38 ,dresses: [dressID, dressID...], ratings: [10, 9...], reviewIDs: [firebaseKey: {reviewID: "reviewID"}]}]
            nextBestDresses: [dressObj],
            showMoreDresses: (this.props.location.state.showMoreDresses ? this.props.location.state.showMoreDresses : false),
            showRecInfo: true,
            currMeasurements: '',
            seenDresses: [],
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
        this.isElementInViewport = this.isElementInViewport.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.getRecommendedStr = this.getRecommendedStr.bind(this);
    }

    isElementInViewport(el) {
        if (!el) return false;
        var rect =  el.getBoundingClientRect();
        return (
            // rect.top >= 300 && rect.bottom <= window.innerHeight
            rect.top < 300 && rect.bottom > 300
        )
    }

    componentDidMount() {

        window.addEventListener('scroll', this.handleScroll);
        this.getBestDressGroupID().then(result => {
            result[3].sort((a, b) => (a.diff > b.diff) ? 1 : -1)
            let nextBestDresses = result[3].map(a => a.closestMeasurements);
            var exactMatchIdx = nextBestDresses.indexOf(result[0]);
            if (exactMatchIdx > -1) {
                nextBestDresses.splice(exactMatchIdx, 1);
            }
            this.setState({
                exactMatch: (result[2] === 0 ? true : false),
                dressGroupID: result[1],
                closestMeasurements: result[0],
                currMeasurements: result[0],
                nextBestDressGroupIDs: nextBestDresses
            }, () => {
                this.getBestDressesID(result[1]);
                if (this.state.showMoreDresses) {
                    this.getNextBestDressesID();
                }
            });
        });
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }


    //Make cleaner
    handleScroll() {
        for (var i = 0; i < 10; i++) {
            var currPage = document.getElementById(i);
            if (this.isElementInViewport(currPage)) {
                if (i === 0) {
                    this.setState({
                        currMeasurements: this.state.closestMeasurements
                    });
                } else {
                    if (this.state.currMeasurements !== this.state.nextBestDressGroupIDs[i-1]) {
                        this.setState({
                            currMeasurements: this.state.nextBestDressGroupIDs[i-1]
                        });
                    }
                }
            }
        }

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


    //TODO: order by what measurements are most important to you on your profile (create an account)
    // TODO: when want to edit measurements -> profile page (create an account)
    //TODO: maintain scroll position when come from item view
    //TODO: show difference between current and future

    getBestDressGroupID() {
        //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements 
        // and this.state.dressGroupId
        var lowestDiff = Number.MAX_VALUE;
        var closestMeasurements, dressGroupID;
        var nextBestDressGroupIDs = [];
        var nextBestDressesOpenSpaces = 9;
        var minimumNextBestDiff = 3;
        var measurementsRef = firebase.database().ref('measurements');
        return new Promise((resolve, reject) => {
            measurementsRef.once('value').then((snapshot) => {
                snapshot.forEach(measurement => {
                    var values = measurement.val();
                    var diffSq = Math.pow((values.height - this.state.height),2) + Math.pow((values.waist - this.state.waist),2) + Math.pow((values.bust - this.state.bust),2) + Math.pow((values.hips - this.state.hips),2);
                    if (nextBestDressesOpenSpaces > 0 && Math.sqrt(diffSq) < 3) {
                        var dressIDObj = {diff: Math.sqrt(diffSq), closestMeasurements : values};
                        nextBestDressGroupIDs.push(dressIDObj);
                        nextBestDressesOpenSpaces = nextBestDressesOpenSpaces - 1;
                    } else {
                        if (Math.sqrt(diffSq) < minimumNextBestDiff) {
                            var dressIDObj = {diff: Math.sqrt(diffSq), closestMeasurements : values};
                            nextBestDressGroupIDs.push(dressIDObj);
                            var newMin = Number.MAX_VALUE;
                            var lowestIndex = 8;
                            nextBestDressGroupIDs.forEach((dressIDObj, idx) => {
                                if (dressIDObj.diff < newMin) {
                                    newMin = dressIDObj.diff;
                                    lowestIndex = idx;
                                }
                            });
                            nextBestDressGroupIDs.splice(lowestIndex, 1);
                            nextBestDressGroupIDs.forEach((dressIDObj, idx) => {
                                if (dressIDObj.diff < newMin) {
                                    newMin = dressIDObj.diff;
                                }
                            });
                            minimumNextBestDiff = newMin;
                        }
                    }
                    if (Math.sqrt(diffSq) < lowestDiff) {
                        lowestDiff =  Math.sqrt(diffSq);
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
                dressesIDObjs: results,
                seenDresses: results.dressIDs
            }, () => { 
                this.getDressesInfo(results);
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
                    if (dress.val().reviews) {
                        dressReviews.push(dress.val().reviews);
                    }
                
            })
            return ({dressIDs: dressIDs, ratings: dressRatings, reviewIDs: dressReviews})
            
        });
    }

    //Using the dressesIDs, gets information about each dress
    getDressesInfo(dressesIDObjs) {
        var dressesRef = firebase.database().ref('dresses');
        var dressIDs = dressesIDObjs.dressIDs;
        var ratings = dressesIDObjs.ratings;
        var reviewIDs = dressesIDObjs.reviewIDs;
        return Promise.all(dressIDs.map(dressID => {
            return dressesRef.child(`${dressID}`);
        })).then((dressRefs) => {
            var promises = []
            for (const dressRef of dressRefs) {
                promises.push(this.getDressInfo(dressRef));
            }
            Promise.all(promises).then((dresses) => {
                var newDressObj = {};
                newDressObj["dresses"] = dresses;
                newDressObj["ratings"] = ratings;
                newDressObj["reviewIDs"] = reviewIDs;
                this.setState({dressesObjs: newDressObj}, () => {
                    console.log(this.state);
                });
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
        var nextBestDressesIDs = []
        for (const dressGroupRef of this.state.nextBestDressGroupIDs) {
            promises.push(
                this.getNextBestDressesIDHelper(dressGroupRef.dressGroupID, dressGroupRef.concatMtms).then((dresses) => {
                    nextBestDressesIDs.push(dresses);
                })
            );
        }
        Promise.all(promises).then((dresses) => {
            this.setState({
                nextBestDressesIDs: nextBestDressesIDs
            });
            this.getNextBestDressesInfo(nextBestDressesIDs);
        })
    }

    //Returns the dressIDs in the best dress group
    getNextBestDressesIDHelper(dressGroupID, concat, seenDresses) {
        var dressGroupIDRef = firebase.database().ref('dressGroup').child(dressGroupID);
        return dressGroupIDRef.orderByChild('rating').once('value').then(snapshot => {
            var dressIDs = [];
            var dressRatings = [];
            var dressReviews = [];
            snapshot.forEach(dress => {
                if (!this.state.seenDresses.includes(dress.val().dress)) {
                    dressIDs.push(dress.val().dress);
                    dressRatings.push(dress.val().rating);
                    if (dress.val().reviews) {
                        dressReviews.push(dress.val().reviews);
                    }
                    this.setState({
                        seenDresses: [...this.state.seenDresses, dress.val().dress]
                    })
                }
            })
            return ({dressIDs: dressIDs, ratings: dressRatings, reviewIDs: dressReviews, measurement: concat})
            
        });
    }


    //Using the dressesIDs, gets information about each dress
    getNextBestDressesInfo(nextBestDressesIDs) {
        var dressesRef = firebase.database().ref('dresses');
        var allDressPromises = []
        for (var dressIDObjKey in nextBestDressesIDs) {
            allDressPromises.push(new Promise((resolve, reject) => {
                var dressIDs = nextBestDressesIDs[dressIDObjKey].dressIDs;
                var ratings = nextBestDressesIDs[dressIDObjKey].ratings;
                var reviewIDs = nextBestDressesIDs[dressIDObjKey].reviewIDs;
                var measurement = nextBestDressesIDs[dressIDObjKey].measurement;
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
                        newDressObj["ratings"] = ratings;
                        newDressObj["reviewIDs"] = reviewIDs;
                        resolve(newDressObj);
                    })
                })
            }));
        }
        Promise.all(allDressPromises).then((nextBestDresses) => {
            this.setState({
                nextBestDresses: nextBestDresses,
                nextBestDressesLoaded: true,
                showMoreDresses: true,
            }, () => {
                console.log(this.state);
                if (!this.state.fromItem) {
                    var firstPage = document.getElementById(1);
                    firstPage.scrollIntoView({behavior: 'smooth'});
                }
            });
        }) 
    }







    goToItemView(selectedItem, key, dressID, dressMeasurements, reviewIDs, dressGroupID) {
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
                dressGroupID: dressGroupID,
                cachedReviews: reviewIDs,
                dressMeasurements: dressMeasurements,
                closestMeasurements: this.state.closestMeasurements,
                dressID: dressID,
                showMoreDresses: this.state.showMoreDresses,
            }
        });
    }

    getMeasurementsFromConcat(concat) {
        var mmtArr = concat.split(',');
        var height = mmtArr[0].trim();
        var waist = mmtArr[1].trim();
        var bust = mmtArr[2].trim();
        var hips = mmtArr[3].trim();
        var measurementsObj = {
            concatMtms: concat,
            height: height,
            waist: waist,
            hips: hips,
            bust: bust
        }
        return measurementsObj;
    }

    getHeightStr(height) {
        var heightFt = Math.floor(height / 12);
        var heightIn = height % 12;
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

    getRecommendedStr() {
        return ("Recommended by other women that are " + this.getHeightStr(this.state.currMeasurements.height) + ", bust " + this.state.currMeasurements.bust + ", waist: " + this.state.currMeasurements.waist + ", hips: " + this.state.currMeasurements.hips);
    }


    render() {
        var imgClassName = (dresses) => {
            return (dresses.length === 1 ? "results-img-single" : "results-img");
        };
        const itemDivClass = (this.state.dressesObjs.dresses.length === 1 ? "results-item-div" : "results-item-div results-item-div-multiple");
        var rightColClass = (
            this.state.showRecInfo ? (this.state.exactMatch ? "results-rightCol results-rightCol-adjust" : "results-rightCol") : "hide"
        );
        const placeholder = (
            <img src="https://fittoform-landing.s3.amazonaws.com/dress-loading.gif" />
        );
        
        return (
        <div>
        <div className="results-container-outer">
                <div className={this.state.exactMatch ? "results-leftCol results-leftCol-adjust" : "results-leftCol"}>
                    <div className="results-leftCol-inner">
  
                        <div className="results-grid" id="0">
                            {this.state.dressesObjs.dresses && this.state.dressesObjs.dresses.map((dress, key) => {
                                return (
                                    <div className="results-col" onClick={() => this.goToItemView(dress, key, this.state.dressesIDObjs.dressIDs[key], this.state.closestMeasurements, this.state.dressesObjs.reviewIDs[key], this.state.dressGroupID)} key={key}>
                                        <div className={itemDivClass}>
                                            <ProgressiveImage src={dress.img}>
                                            {(src, loading) => {
                                                return loading ? placeholder : <img src={src} alt="dress image" className={imgClassName(this.state.dressesObjs.dresses)}/>;
                                            }}
                                            </ProgressiveImage>
                                            <p className="results-rating">Rated {this.getRating(this.state.dressesObjs.ratings[key])}/10 by women like you</p>
                                            <p className="results-price">${dress.price}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {this.state.nextBestDressGroupIDs.length !== 0 && !this.state.showMoreDresses && 
                        <div className="results-loadMore-btn-div">
                             <button className="results-loadMore-btn" onClick={this.getNextBestDressesID}>Load near perfect matches </button>
                        </div>}
                        {this.state.showMoreDresses && this.state.nextBestDressesLoaded && Object.entries(this.state.nextBestDresses).map(([keyDressObj, dressObj]) => 
                            dressObj.dresses.length > 0 && <div className="results-grid results-margin-top" key={keyDressObj} id={parseInt(keyDressObj,10) + 1}>
                                {dressObj.dresses.map((dress,key) => {
                                    return (
                                        dress && <div className="results-col" onClick={() => this.goToItemView(dress, key, this.state.nextBestDressesIDs[keyDressObj].dressIDs[key], this.getMeasurementsFromConcat(dressObj.measurement), dressObj.reviewIDs[key], this.state.nextBestDressGroupIDs[keyDressObj].dressGroupID)} key={key}>
                                        
                                            {dress && <div className={itemDivClass} key={key}>
                                                <ProgressiveImage src={dress.img}>
                                                    {(src, loading) => {
                                                        return loading ? placeholder : <img src={src} alt="dress image" className={imgClassName(dressObj.dresses)}/>;
                                                    }}
                                                </ProgressiveImage>
                                                <p className="results-rating">Rated {this.getRating(dressObj.ratings[key])}/10 by women like you</p>
                                                <p className="results-price">${dress.price}</p>
                                            </div>}
                                        </div>
                                    );   
                                })}
                                </div>
                                                          
                            )}
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
                                {this.state.closestMeasurements && <p className="results-text">{this.getRecommendedStr()} </p>}
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