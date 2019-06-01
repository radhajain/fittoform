import React, { Component } from 'react';
import * as SHOPINFO from '../../constants/shoppingConstants';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <h1>Home Page</h1>
      <p>The Home Page is accessible by every signed in user.</p>
      {SHOPINFO.itemCategories.map((category, i) => (
          <Link to={{
            pathname: '/search',
            state: {
              itemCategory: category.name
          }}}> 
            <div key={i}>{category.name}</div>
          </Link>
      ))}
    </div>
    );
  }
} 

// Uncommented for now during dev
// const condition = authUser => !!authUser;

// export default withAuthorization(condition)(HomePage);

export default HomePage;
