import React from 'react';
import { ReactTypeformEmbed } from 'react-typeform-embed';

class Popup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ReactTypeformEmbed url="https://radhajain143579.typeform.com/to/DxUNxw" />;
      </div>
    );
  }
}

export default Popup;
