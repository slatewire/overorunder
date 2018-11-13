import React, { Component } from 'react';
import XoverY from './XoverY/XoverY';
import Trend from './Trend/Trend';
//import StatsText from './StatsText/StatsText';
//import DateSet from './DateSet/DateSet';
import Percent from './Percent/Percent';
import moment from 'moment'
import '../App/App.css';

// array of ProfileActivity

class HabitScreen extends Component {
  render() {

    // need to work out total as we no longer store it on server
    var totalDays = this.props.habitData.dates.length;

    let notSet = 0;
    let trendIndex = 6;
    let now = moment();
    let nowString = now.format('YYYY-MM-DD');
    // have to work out array indexs for the 7 dates
    // at the same time lets do not set count
    this.props.habitData.dates.forEach(function(element, index){

      let date = element.theDate;
      //let now = moment();
      //let nowString = now.format('YYYY-MM-DD');

      if (date === nowString) {
        trendIndex = index;
      }

      if (date < nowString) {
        if (element.dateState === "notSet"){
          notSet = notSet +1;
        }
      }

    });

    let numberSet = this.props.habitData.over + this.props.habitData.under;
    let level = 0;
    let scorePercentage = 0;

    if (numberSet <= 7) {
      scorePercentage = Math.round(numberSet / 0.08);
      level = 1;
    } else if (numberSet <= 14 && numberSet > 7) {
      level = 2;
      scorePercentage = Math.round((numberSet - 8) / 0.8);
    } else if (numberSet <=30 && numberSet > 14) {
      level = 3;
      scorePercentage = Math.round((numberSet - 15) / 0.16);
    } else if (numberSet <=45 && numberSet > 30) {
      level = 4;
      scorePercentage = Math.round((numberSet - 31) / 0.15);
    } else if (numberSet <= 60 && numberSet > 45) {
      level = 5;
      scorePercentage = Math.round((numberSet - 61) / 0.15);
    } else if (numberSet <= 90 && numberSet > 60) {
      level = 6;
      scorePercentage = Math.round((numberSet - 61) / 0.30);
    } else if (numberSet <= 120 && numberSet > 90) {
      level = 7;
      scorePercentage = Math.round((numberSet - 61) / 0.30);
    } else if (numberSet <= 150 && numberSet > 120) {
      level = 8;
      scorePercentage = Math.round((numberSet - 61) / 0.30);
    } else if (numberSet <= 183 && numberSet > 150) {
      level = 9;
      scorePercentage = Math.round((numberSet - 61) / 0.33);
    } else if (numberSet <= 240 && numberSet > 183) {
      level = 10;
      scorePercentage = Math.round((numberSet - 61) / 0.57);
    } else if (numberSet <= 300 && numberSet > 240) {
      level = 11;
      scorePercentage = Math.round((numberSet - 61) / 0.60);
    } else {
      level = 12;
      scorePercentage = 100;
    }

    return (
      <div className="signInButton">
        <XoverY over={this.props.habitData.over} under={this.props.habitData.under} oldOver={this.props.habitData.oldOver} oldUnder={this.props.habitData.oldUnder} />
        <div>
          <button className="trendButton" onClick={this.props.handleTrendScreenButton}>
            <Trend daysAgo7={this.props.habitData.dates[trendIndex+7].dateState} daysAgo6={this.props.habitData.dates[trendIndex+6].dateState} daysAgo5={this.props.habitData.dates[trendIndex+5].dateState} daysAgo4={this.props.habitData.dates[trendIndex+4].dateState} daysAgo3={this.props.habitData.dates[trendIndex+3].dateState} daysAgo2={this.props.habitData.dates[trendIndex+2].dateState} daysAgo1={this.props.habitData.dates[trendIndex+1].dateState} />
          </button>
        </div>
        <Percent habitData={this.props.habitData} over={this.props.habitData.over} under={this.props.habitData.under} total={totalDays} notSet={notSet} oldOver={this.props.habitData.oldOver} oldUnder={this.props.habitData.oldUnder} monthPc={this.props.monthPc} handleStatsPageButton={this.props.handleStatsPageButton}/>

          <button className="footer" onClick={this.props.handleMenuButton}>
            <div className="progress-bar">
              <div className="progress-bar-percentage" style={{width: `${scorePercentage}%` }}><span>Level {level}</span></div>
            </div>
          </button>

      </div>
    );
  }
}

export default HabitScreen;
// <DateSet datesData={this.props.habitData.dates} habitName={this.props.habitData.title} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
// <StatsText over={this.props.habitData.over} under={this.props.habitData.under} total={totalDays} notSet={this.props.habitData.notSet} oldOver={this.props.habitData.oldOver} oldUnder={this.props.habitData.oldUnder}/>
//<div>
//  <Button className="habitButton" floating small onClick={this.props.handleTrendScreenButton} icon='date_range'></Button>
//</div>
