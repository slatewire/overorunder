import React, { Component } from 'react';

class StatsText extends Component {
  render() {

    const daysToGo = this.props.total - (this.props.notSet + this.props.over + this.props.under);
    //const toWin = Math.round((((this.props.total - this.props.notSet)/ 2) + 0.5) - this.props.over);
    const toWin = Math.round((((this.props.total - this.props.notSet + this.props.oldOver + this.props.oldUnder)/ 2) + 0.5) - (this.props.over + this.props.oldOver));

    let currentpc = 0
    if ((this.props.over === 0) && (this.props.under === 0)) {
      currentpc = 0;
    } else {
        currentpc = Math.round(((this.props.over + this.props.oldOver) / ((this.props.total + this.props.oldOver + this.props.oldUnder - daysToGo - this.props.notSet) / 100) -1));
        if (currentpc < 0) {
          currentpc = 0;
        }
    }
    //const futurepc = Math.round(toWin / (daysToGo/100));

    return (
      <div>
        <p>{toWin} out of the {daysToGo} days left needed to win.</p>
      </div>
    );
  }
}

export default StatsText;

// <p>{daysToGo} days to go with {toWin} good days needed to win. Currently you are on {currentpc}% of good days, you need {futurepc}% of days remaining to be good.</p>
