import React, { Component } from 'react';

class Percent extends Component {
  render() {

    const daysToGo = this.props.total - (this.props.notSet + this.props.over + this.props.under);
    const toWin = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - this.props.notSet)/ 2) + 0.5) - (this.props.over + this.props.oldOver));

    let currentpc = 0
    if ((this.props.over === 0) && (this.props.under === 0)) {
      currentpc = 0;
    } else {
        currentpc = Math.round(((this.props.over + this.props.oldOver) / ((this.props.total + this.props.oldOver + this.props.oldUnder - daysToGo - this.props.notSet) / 100) ));
        if (currentpc < 0) {
          currentpc = 0;
        }
    }

    const futurepc = Math.round(toWin / (daysToGo/100));
    //const toWin = futurepc * daysToGo;

    let pc = null;
    if (currentpc >= 50) {
      pc = <h2 className="teal-text text-lighten-2 percent">{currentpc}%</h2>
    } else {
      pc = <h2 className="deep-orange-text text-accent-3 percent">{currentpc}%</h2>
    }

    return (
      <div>
        {pc}
        <p className="percentText">{this.props.monthPc}% over the last 30 days</p>
        <p className="percentText">{futurepc}% of the remaining days needed, which is {toWin} days</p>
      </div>
    );
  }
}

export default Percent;
