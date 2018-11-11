import React, { Component } from 'react';

class XoverY extends Component {
  render() {

    const over = this.props.over + this.props.oldOver;
    const under = this.props.under + this.props.oldUnder;
    //console.log("over: ", over);
    //console.log("under: ", under);

    return (
      <div>
      <header className="oo-header">
        <h1 className="teal-text text-lighten-2 over">{over}</h1>
        <hr className="HeaderLine" ></hr>
        <h1 className="deep-orange-text text-accent-3">{under}</h1>
      </header>
      </div>
    );
  }
}

export default XoverY;
