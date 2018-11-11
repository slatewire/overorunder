import React, { Component } from 'react';
import moment from 'moment';
import {Doughnut} from 'react-chartjs-2';

class Percent extends Component {
  render() {

    let notSet = 0;
    let goodStreak = 0;
    let badStreak = 0;
    let currentStreak = 0;
    let myStreakNum = -1;
    //let myStreakState = "nothing";
    let lastState = 'nothing';
    let now = moment();
    let nowString = now.format('YYYY-MM-DD');

    // have to work out array indexs for the 7 dates
    // at the same time lets do not set count
    this.props.habitData.dates.forEach(function(element, index){

      let date = element.theDate;
      //let now = moment();
      //let nowString = now.format('YYYY-MM-DD');
      let thisState = element.dateState;
      if (date < nowString) {
        if (element.dateState === "notSet"){
          notSet = notSet +1;
        }
      }

      // work out the streaks
      if (thisState === "good") {
        if (lastState === "good" || lastState === "nothing") {
          currentStreak = currentStreak + 1;
        } else {
          // this means a change in streak
          if (currentStreak > badStreak) {
            badStreak = currentStreak;
          }
          if (myStreakNum === -1) {
            myStreakNum = currentStreak;
            if (myStreakNum === 0) {myStreakNum = 1}
            //myStreakState = "good";
          }
          currentStreak = 1;
          lastState = "good"
        }

      } else if (thisState === "bad") {

        if (lastState === "bad" || lastState === "nothing") {
          currentStreak = currentStreak + 1;
        } else {
          // this means a change in streak
          if (currentStreak > goodStreak) {
            goodStreak = currentStreak;
          }
          if (myStreakNum === -1) {
            myStreakNum = currentStreak;
            if (myStreakNum === 0) {myStreakNum = 1}
            //myStreakState = "bad";
          }
          currentStreak = 1;
          lastState = "bad"
        }

      } else {
        currentStreak = 0;
        lastState = "notSet";
      }

    });

    const daysToGo = this.props.total - (notSet + this.props.over + this.props.under);
    //const toWin = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.over + this.props.oldOver));
    //const toLose = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.under + this.props.oldUnder));

    let currentpc = 0;
    let pcToShow = 0;
    if ((this.props.over === 0) && (this.props.under === 0)) {
      currentpc = 0;
    } else {
        currentpc = Math.round(((this.props.over + this.props.oldOver) / ((this.props.total + this.props.oldOver + this.props.oldUnder - daysToGo - this.props.notSet) / 100) ));
        if (currentpc < 0) {
          currentpc = 0;
        }
    }

    //const futurepc = Math.round(toWin / (daysToGo/100));
    //const futureLosePs = Math.round(toLose / (daysToGo/100));
    //const toWin = futurepc * daysToGo;

    let pc = null;
    pcToShow = currentpc - 50;
    if (currentpc >= 50) {
      pc = <h2 className="teal-text text-lighten-2 percent">+{pcToShow}%</h2>
    } else {
      pc = <h2 className="deep-orange-text text-accent-3 percent">{pcToShow}%</h2>
    }

    let overNinety = 0;
    let underNinety = 0;
    //let ninetyPc = 0;
    //let ninetyPc2 = 0;
    //let ninetyPcComponent = null;
    //let ninetyPcComponent2 = null;
    let numberOfDays = this.props.over + this.props.under + notSet;
    if (numberOfDays >= 90) {
      for (let x=0; x<90; x++){
        let thisState = this.props.habitData.dates[x].dateState;
        if(thisState === 'good' ) {
          overNinety = overNinety+1;
        } else if (thisState === 'bad') {
          underNinety = underNinety+1;
        }
      }
      //ninetyPc = Math.round(overNinety * 0.9);
      //ninetyPc2 = Math.round(overNinety / ((overNinety+underNinety) /100));
    }

    let downpc = Math.abs(100 - currentpc);
    const data = {
    	datasets: [{
    		data: [currentpc, downpc],
    		backgroundColor: [
    		'#4db6ac',
    		'#ff3d00'
    		]
    	}],
    };

    return (
      <div>
          {pc}
        <div>
          <Doughnut className="pie" data={data} />
          <button className="basicButton" onClick={this.props.handleStatsPageButton}>
            <p className="learnMore">learn more...</p>
          </button>
        </div>
      </div>
    );
  }
}

export default Percent;

//<button className="basicButton" onClick={this.props.handleStatsPageButton}>
//  {pc}
//  <p className="percentText">{this.props.monthPc}% over the last 30 days</p>
//  <p className="percentText">{futurepc}% of the remaining days needed, which is {toWin} days</p>
//</button>
