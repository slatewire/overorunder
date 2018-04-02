import React, { Component } from 'react';

class XoverY extends Component {
  render() {
    return (
      <div>
      <header className="oo-header">
        <h1 className="teal-text text-lighten-2">{this.props.over}</h1>
        <hr className="HeaderLine" ></hr>
        <h1 className="deep-orange-text text-accent-3">{this.props.under}</h1>
      </header>
      </div>
    );
  }
}

export default XoverY;
