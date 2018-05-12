import React from 'react';
import '../App/App.css';

class Header extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="teal-text text-lighten-2">Over</h1>
          <hr className="HeaderLine" ></hr>
          <h1 className="deep-orange-text text-accent-3">Under</h1>
        </header>
        <p className="tagLine">
          The habit tracking game.
        </p>
      </div>
    );
  }
}

export default Header;
