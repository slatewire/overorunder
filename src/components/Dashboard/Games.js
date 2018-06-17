import React, { Component } from 'react';
import '../App/App.css';

// array of ProfileActivity

class Games extends Component {
  constructor(props) {
    super(props);

    this.state = {
      habits: "signUp"
    };
  }



  render() {
    return (
      <div>
        <p>hello Games</p>
      </div>
    );
  }
}

export default Games;
