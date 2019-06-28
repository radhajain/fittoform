import React, { Component } from 'react';
// import * as SHOPINFO from '../../constants/shoppingConstants';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import InstagramEmbed from 'react-instagram-embed';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <h1>Home Page</h1>
      <p>The Home Page is accessible by every signed in user.</p>
      <InstagramEmbed
        url='https://www.instagram.com/p/BwtEozUhmtL/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      {/* {SHOPINFO.itemCategories.map((category, i) => (
          <Link to={{
            pathname: '/search',
            state: {
              itemCategory: category.name
          }}}> 
            <div key={i}>{category.name}</div>
          </Link>
      ))} */}
    </div>
    );
  }
} 

// Uncommented for now during dev
// const condition = authUser => !!authUser;

// export default withAuthorization(condition)(HomePage);

export default HomePage;
