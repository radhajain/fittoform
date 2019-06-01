import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import './Search.css';
import { Link } from 'react-router-dom';

class Search extends Component {
    constructor(props) {
        super(props);
        //Sets the state's item category from Home page
        // E.g. state is now = { itemCategory: 'Jeans' }
        // this.state = this.props.location.state;
        this.state = {
            itemCategory: this.props.location.state.itemCategory,
            colorValue: '',
            lengthValue: '',
        }
    }

    render() {
        const colorInputProps = {
            placeholder: "any color",
        }
        const lengthInputProps = {
            placeholder: "any length",
        }
        return (
            <div style={{backgroundColor: 'black', height: '100vh'}}>

                <div className="inner-container">
                    <div className="search-container">
                        <p className="search-text">I'm looking for <span className="search-text search-input">{this.state.itemCategory.toLowerCase()}</span></p>
                        <p className="search-text">that are</p>
                        <ReactAutocomplete
                            style={{ width: '200px', display: 'inline'}}
                            getItemValue={(item) => item.label}
                            items={[
                                { label: 'white' },
                                { label: 'black' },
                                { label: 'blue' },
                                { label: 'red' },
                                { label: 'pink' },
                                { label: 'orange' },
                                { label: 'yellow' }
                            ]}
                            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            renderItem={(item, isHighlighted) =>
                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.label}
                                </div>
                            }
                            value={this.state.colorValue}
                            onChange={(e) => this.setState({ colorValue: e.target.value })}
                            onSelect={(value) => this.setState({ colorValue: value })}
                            inputProps={colorInputProps}
                        />
                        <p className="search-text" style={{display: 'inline'}}> and </p>
                        <ReactAutocomplete
                            style={{display: 'inline', width: '200px'}}
                            getItemValue={(item) => item.label}
                            items={[
                                { label: 'short' },
                                { label: 'midi' },
                                { label: 'maxi' },
                            ]}
                            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            renderItem={(item, isHighlighted) =>
                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.label}
                                </div>
                            }
                            value={this.state.lengthValue}
                            onChange={(e) => this.setState({ lengthValue: e.target.value })}
                            onSelect={(value) => this.setState({ lengthValue: value })}
                            inputProps={lengthInputProps}
                        />
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                        <Link to={{
                            pathname: '/results',
                            state: {
                                itemCategory: this.state.itemCategory,
                                color: this.state.colorValue,
                                length: this.state.lengthValue
                        }}}> 
                            <button style={{display: 'block'}}>See results fitted to me</button>
                        </Link>
                        </div>
                        
                    </div>
                </div>
               
            </div>
        );
    }
 }

export default Search;
