import React, { Component } from 'react';
import XoverY from './XoverY/XoverY';
import Trend from './Trend/Trend';
import StatsText from './StatsText/StatsText';
import DateSet from './DateSet/DateSet';
import moment from 'moment'
import '../App/App.css';

// array of ProfileActivity

class HabitScreen extends Component {
  render() {

console.log("Old habit data ", this.props.habitData);

    // need to work out total as we no longer store it on server
    var totalDays = this.props.habitData.dates.length;

    let trendIndex = 6;
    // have to work out array indexs for the 7 dates
    this.props.habitData.dates.forEach(function(element, index){

  //    var d = new Date();
  //    var year = d.getFullYear();
  //    var month = d.getMonth() + 1;
  //    var day = d.getDate();
  //    var dateString = year + "-" + month + "-" + day;

      let date = element.theDate;
      let now = moment();
      let nowString = now.format('YYYY-MM-DD');
      console.log("DATE STRING ", nowString);


      let noIndex = true;

      if (date === nowString) {
        noIndex = false;
        trendIndex = index;
        //console.log("IS THE SAME ", index);
      }

      //if (dateString === element.theDate) {

        //  trendIndex = index;
      //}

    });

    return (
      <div>
        <XoverY over={this.props.habitData.over} under={this.props.habitData.under} oldOver={this.props.habitData.oldOver} oldUnder={this.props.habitData.oldUnder} />
        <Trend daysAgo7={this.props.habitData.dates[trendIndex+7].dateState} daysAgo6={this.props.habitData.dates[trendIndex+6].dateState} daysAgo5={this.props.habitData.dates[trendIndex+5].dateState} daysAgo4={this.props.habitData.dates[trendIndex+4].dateState} daysAgo3={this.props.habitData.dates[trendIndex+3].dateState} daysAgo2={this.props.habitData.dates[trendIndex+2].dateState} daysAgo1={this.props.habitData.dates[trendIndex+1].dateState} />
        <StatsText over={this.props.habitData.over} under={this.props.habitData.under} total={totalDays} notSet={this.props.habitData.notSet} oldOver={this.props.habitData.oldOver} oldUnder={this.props.habitData.oldUnder}/>
        <DateSet datesData={this.props.habitData.dates} habitName={this.props.habitData.title} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
      </div>
    );
  }
}

export default HabitScreen;
