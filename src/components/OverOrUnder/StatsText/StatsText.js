import React, { Component } from 'react';

class StatsText extends Component {
  render() {

    const daysToGo = this.props.total - (this.props.notSet + this.props.over + this.props.under);
    const toWin = Math.round((((this.props.total - this.props.notSet)/ 2) - this.props.over) + 0.5);
    const currentpc =  Math.round((this.props.over / ((this.props.total - daysToGo - this.props.notSet) / 100) -1));
    const futurepc = toWin / (daysToGo/100);


    return (
      <div>
        <p>{daysToGo} days to go with {toWin} good days needed to win. Currently you are on {currentpc}% of good days, you need {futurepc}% of days remaining to be good.</p>
      </div>
    );
  }
}

export default StatsText;
