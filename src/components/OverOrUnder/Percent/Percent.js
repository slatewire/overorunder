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
    let myStreakState = "nothing";
    let lastState = 'nothing';
    let now = moment();
    let nowString = now.format('YYYY-MM-DD');
    let lineGraphData = [];
    let lineGraphLabels = [];
    let lastMonth = null;
    let dayCount = 0;
    let goodDayCount = 0;
    let thisPercent = 0;
    let currentMonthPc = 0;
    let currentMonth = true;
    let bestMonth = false;

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
      if (date < nowString) {
        // work out the streaks
        if (thisState === "good") {
          if (lastState === "good" || lastState === "nothing") {
            lastState = "good"
            currentStreak = currentStreak + 1;
          } else {
            // this means a change in streak
            if (currentStreak > badStreak) {
              badStreak = currentStreak;
            }
            if (myStreakNum === -1) {
              myStreakNum = currentStreak;
              if (myStreakNum === 0) {myStreakNum = 1}
              myStreakState = "bad";
            }
            lastState = "good";
            currentStreak = 1;
          }

        } else if (thisState === "bad") {

          if (lastState === "bad" || lastState === "nothing") {
            lastState = "bad"
            currentStreak = currentStreak + 1;
          } else {
            // this means a change in streak
            if (currentStreak > goodStreak) {
              goodStreak = currentStreak;
            }
            if (myStreakNum === -1) {
              myStreakNum = currentStreak;
              if (myStreakNum === 0) {myStreakNum = 1}
              myStreakState = "good";
            }
            lastState = "bad"
            currentStreak = 1;
          }

        } else {
          if(lastState === "good"){
            if (currentStreak > goodStreak) {
              goodStreak = currentStreak;
            }
            if (myStreakNum === -1) {
              myStreakNum = currentStreak;
              if (myStreakNum === 0) {myStreakNum = 1}
              myStreakState = "good";
            }
          }
          if(lastState === "bad"){
            if (currentStreak > badStreak) {
              badStreak = currentStreak;
            }
            if (myStreakNum === -1) {
              myStreakNum = currentStreak;
              if (myStreakNum === 0) {myStreakNum = 1}
              myStreakState = "bad";
            }
          }
          currentStreak = 0;
          lastState = "notSet";
        }
      }

      let month = moment(element.theDate).format('MMM');
      if (date < nowString) {
        if (lastMonth !== month) {
          if (lastMonth) {

            thisPercent = goodDayCount/(dayCount/100);
            if (currentMonth && dayCount > 27 ) {
              currentMonthPc = thisPercent;
              currentMonth = false;
              bestMonth = true;
            } else if (!currentMonth) {
              if (thisPercent > currentMonthPc) {
                bestMonth = false;
              }
            }
            lineGraphData.push(thisPercent);
            lineGraphLabels.push(lastMonth[0]);
            dayCount = 0;
            goodDayCount = 0;
          }
        }
        lastMonth = month;
        if (element.dateState === 'good' || element.dateState === 'bad') {
            dayCount = dayCount + 1;
        }
        if (element.dateState === 'good') {
          goodDayCount = goodDayCount +1;
        }
      }

    });

    thisPercent = goodDayCount/(dayCount/100);
    lineGraphData.push(thisPercent);
    lineGraphLabels.push(lastMonth[0]);

    const daysToGo = this.props.total - (notSet + this.props.over + this.props.under);
    const toWin = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.over + this.props.oldOver));
    const toLose = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.under + this.props.oldUnder));

    let currentpc = 0;
    let pcToShow = 0;
    if ((this.props.over === 0) && (this.props.under === 0)) {
      currentpc = 0;
    } else {
        currentpc = Math.round((((this.props.over + this.props.oldOver) / ((this.props.total + this.props.oldOver + this.props.oldUnder - daysToGo - this.props.notSet) / 100) ))-0.5);
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

    let overThirty = 0;
    let underThirty = 0;
    let overNinety = 0;
    let underNinety = 0;
    let ninetyPc2 = 0;
    let numberOfDays = this.props.over + this.props.under + notSet;
    if (numberOfDays >= 90) {
      for (let x=0; x<90; x++){
        let thisState = this.props.habitData.dates[x].dateState;
        if(thisState === 'good' ) {
          overNinety = overNinety+1;
          if(x<30) {
            overThirty = overThirty+1;
          }
        } else if (thisState === 'bad') {
          underNinety = underNinety+1;
          if(x<30) {
            underThirty = underThirty+1;
          }
        }
      }

      //ninetyPc = Math.round(overNinety * 0.9);
      if((overNinety+underNinety) >= 66) {
        ninetyPc2 = Math.round(overNinety / ((overNinety+underNinety) /100));
      }
    }

//    let overThirty = 0;
//    let underThirty = 0;
//    let thirtyPc = 0;
//    if (numberOfDays >= 30) {
//      for (let y=0; y<30; y++){
//    console.log("y ", y);
//        let thisState = this.props.habitData.dates[y].dateState;
//    console.log("thisState ", thisState);
//        if(thisState === 'good' ) {
//          overThirty = overThirty+1;
///        } else if (thisState === 'bad') {
//          underThirty = underThirty+1;
//        }
//      }
      //ninetyPc = Math.round(overNinety * 0.9);
      //thirtyPc = Math.round(overThirty / ((overThirty+underThirty) /100));

    //}

    let messageType = <p> tap to learn more </p>

    // set the message Type
    if (numberOfDays >= 30) {
      messageType = <p>{this.props.monthPc}% over the last 30 days, tap to learn more</p>
    }

    if (ninetyPc2 >= 70) {
      messageType = <p>habit forming at {ninetyPc2}% over the last 90 days, tap to learn more</p>
    }

    if (toWin === 30 || toWin === 10 || toWin === 3 || toWin === 2 || toWin ===1 || toWin === 100 || toWin === 50 ) {
      messageType = <p>{toWin} days needed to win, tap to learn more</p>
    }

    if (toLose === 30 || toLose === 10 || toLose === 3 || toLose === 2 || toLose ===1 || toLose === 100 || toLose === 50) {
      messageType = <p>{toLose} till you lose! tap to learn more</p>
    }

    if (myStreakState === 'bad') {
      let diff = badStreak - myStreakNum;
      if (diff < 7 && diff !== 0) {
        messageType = <p>close to your worst streak! tap to learn more</p>
      }
      if (diff === 0) {
        messageType = <p>break your worst streak!! tapto learn more</p>
      }
    }

    if (myStreakState === 'good') {
      let diff = goodStreak - myStreakNum;
      if (diff < 7 && diff !== 0) {
        messageType = <p>{diff+1} for a new best streak, tap to learn more</p>
      }
      if (diff === 0) {
        messageType = <p>awesome, best ever streak, tap to learn more</p>
      }
    }

    if (bestMonth) {
      messageType = <p>this is your best ever month, tap to learn more</p>
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
            <p>{currentpc}% overall</p>
            {messageType}
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
