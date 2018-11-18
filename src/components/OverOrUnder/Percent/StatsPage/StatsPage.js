import React, { Component } from 'react';
import XoverY from '../../XoverY/XoverY';
import moment from 'moment';
import {Doughnut, HorizontalBar, Line} from 'react-chartjs-2';


class StatsPage extends Component {

  componentDidMount() {
    window.scrollTo(0, 0)
  }

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

      // create the label/percent Array
      let month = moment(element.theDate).format('MMM');
      if (date < nowString) {
        if (lastMonth !== month) {
          if (lastMonth) {
            thisPercent = goodDayCount/(dayCount/100);
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
    // push the last month!
    thisPercent = goodDayCount/(dayCount/100);
    lineGraphData.push(thisPercent);
    lineGraphLabels.push(lastMonth[0]);

    const daysToGo = this.props.total - (notSet + this.props.over + this.props.under);
    const toWin = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.over + this.props.oldOver));
    const toLose = Math.round(((((this.props.total + this.props.oldOver + this.props.oldUnder) - notSet)/ 2) + 0.5) - (this.props.under + this.props.oldUnder));

    let currentpc = 0
    if ((this.props.over === 0) && (this.props.under === 0)) {
      currentpc = 0;
    } else {
      currentpc = Math.round(((this.props.over + this.props.oldOver) / ((this.props.total + this.props.oldOver + this.props.oldUnder - daysToGo - notSet) / 100) ));
      if (currentpc < 0) {
        currentpc = 0;
      }
    }

    //const futurepc = Math.round(toWin / (daysToGo/100));
    //const futureLosePs = Math.round(toLose / (daysToGo/100));
    //const toWin = futurepc * daysToGo;

    //let pc = null;
    //if (currentpc >= 50) {
    //  pc = <h3 className="teal-text text-lighten-2 percent">{currentpc}%</h3>
    //} else {
    //  pc = <h3 className="deep-orange-text text-accent-3 percent">{currentpc}%</h3>
    //}

    let overNinety = 0;
    let underNinety = 0;
    //let ninetyPc = 0;
    let ninetyPc2 = 0;
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
      ninetyPc2 = Math.round(overNinety / ((overNinety+underNinety) /100));

  //    if(ninetyPc2 >= 50) {
//        ninetyPcComponent2 = <p className="percentText"><span className="teal-text text-lighten-2 percent">{ninetyPc2}%</span> over the last <span className="teal-text text-lighten-2 percent">90 days</span></p>
//      } else {
//        ninetyPcComponent2 = <p className="percentText"><span className="deep-orange-text text-accent-3 percent">{ninetyPc2}%</span> over the last <span className="deep-orange-text text-accent-3 percent">90 days</span></p>
//      }
    }

    //let thirtyPcComponent = null;
    //if (this.props.monthPc >= 50) {
    //  thirtyPcComponent = <p className="percentText"><span className="teal-text text-lighten-2 percent">{this.props.monthPc}% </span>over the last <span className="teal-text text-lighten-2 percent">30 days</span></p>
    //} else {
    //  thirtyPcComponent = <p className="percentText"><span className="deep-orange-text text-accent-3 percent">{this.props.monthPc}% </span>over the last <span className="deep-orange-text text-accent-3 percent">30 days</span></p>
    //}

    let thirtyDownPc = 100 - this.props.monthPc;
    let labelThirtyPC = this.props.monthPc + "%";
    let labelThirtyDown = thirtyDownPc + "%";
    let thirtyDaysData = {
      labels: [labelThirtyPC, labelThirtyDown],
    	datasets: [{
    		data: [this.props.monthPc, thirtyDownPc],
    		backgroundColor: [
    		'#4db6ac',
    		'#ff3d00'
    		]
    	}],
    };

    let labelnintyGood = ninetyPc2 + "%";
    let nintyDownPc = 100 - ninetyPc2;
    let labelnintyDown = nintyDownPc + "%";
    let nintyDaysData = {
      labels: [labelnintyGood, labelnintyDown],
    	datasets: [{
    		data: [ninetyPc2, nintyDownPc],
    		backgroundColor: [
    		'#4db6ac',
    		'#ff3d00'
    		]
    	}],
    };

    let streakData = {
    	datasets: [
        {
          label: "longest good streak",
    		  data: [goodStreak],
    		  backgroundColor: ['#4db6ac']
    	  },
        {
          label: "longest bad streak",
    		  data: [badStreak],
    		  backgroundColor: ['#ff3d00']
        }
      ],
    };

    let winLoseData = {
    	datasets: [
        {
          label: "good days to win",
    		  data: [toWin],
    		  backgroundColor: ['#4db6ac']
    	  },
        {
          label: "bad days till lost",
    		  data: [toLose],
    		  backgroundColor: ['#ff3d00']
        }
      ],
    };



    let lineData = {
    //labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J'],
    labels: lineGraphLabels.reverse(),
    datasets: [
      {
        label: 'Monthly %',
        fillColor: '#4db6ac',
        strokeColor: '#4db6ac',
        pointColor: '#4db6ac',
        backgroundColor: ['#4db6ac'],
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        //data: [65, 59, 80, 81, 56, 55, 40],
        data: lineGraphData.reverse(),
      },
    ]
  }

    return (
      <div>
        <div className="signInButton">
          <XoverY over={this.props.over} under={this.props.under} oldOver={this.props.oldOver} oldUnder={this.props.oldUnder}  />
        </div>
        <h3 className="teal-text text-lighten-2 percent">Trends</h3>
        <Line data={lineData} />
        <p>last 30 days</p>
        <Doughnut className="pie" data={thirtyDaysData} />
        <p>last 90 days</p>
        <Doughnut className="pie" data={nintyDaysData} />

        <h3 className="teal-text text-lighten-2 percent">Streaks</h3>
        <p className="percentText"> current streak of {myStreakNum} {myStreakState} days </p>
        <HorizontalBar className="pie" data={streakData} />
        <h3 className="teal-text text-lighten-2 percent">Win or Lose</h3>
        <p className="percentText">{daysToGo} days to go</p>
        <HorizontalBar className="pie" data={winLoseData} />
      </div>
    );
  }
}

export default StatsPage;

//<p className="percentText">{notSet} days have not been set</p>
//<p className="percentText">top streak of good days <span className="teal-text text-lighten-2 percent">{goodStreak}</span></p>
//<p className="percentText">top streak of bad  days <span className="deep-orange-text text-accent-3 percent">{badStreak}</span></p>

//<Line data={lineData} />
