import React, { Component } from 'react';
import './MakeRequest.css';
import doneTick from '../../assets/images/done-tick.svg';

class MakeRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      done: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state.link);
    const link = this.state.link;
    this.setState(
      {
        done: true
      },
      () => {
        setTimeout(
          function() {
            this.props.makeReviewRequest(link);
            this.setState({
              done: false,
              link: ''
            });
          }.bind(this),
          2000
        );
      }
    );
  }

  render() {
    var { link } = this.state;
    const isDisabled = link.length === 0;

    return (
      <div
        className="makeRequest"
        style={{
          transform: this.props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
          opacity: this.props.show ? '1' : '0'
        }}
      >
        <div className="makeRequest-overlay"></div>
        <div className="makeRequest-wrapper">
          <div className="makeRequest-header">
            <p className="makeRequest-title">What dress would you like to be reviewed?</p>
            <span className="close-makeRequest-btn" onClick={this.props.close}>
              ×
            </span>
          </div>
          <div className="makeRequest-body">
            <form className="makeRequest-form" onSubmit={this.handleSubmit}>
              <input
                name="link"
                value={link}
                onChange={this.handleInputChange}
                type="text"
                className="makeRequest-input"
                placeholder="Link to the dress"
              />
              {!this.state.done && (
                <button
                  disabled={isDisabled}
                  type="submit"
                  className={isDisabled ? 'makeRequest-btn-disabled' : 'makeRequest-btn-submit'}
                >
                  <div style={{ position: 'relative' }}>Submit</div>
                </button>
              )}
              {this.state.done && (
                <div className="makeRequest-done-wrapper">
                  <img src={doneTick} className="makeRequest-doneTick" />
                  <p className="makeRequest-confirmation">
                    Your dress has been added to the waiting list!
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default MakeRequest;
