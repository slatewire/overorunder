import React, { Component } from 'react';
import XoverY from './XoverY/XoverY';
import Trend from './Trend/Trend';
import StatsText from './StatsText/StatsText';
import DateSet from './DateSet/DateSet';
import '../App/App.css';

// array of ProfileActivity

class HabitScreen extends Component {
  render() {

    // need to work out total as we no longer store it on server
    var totalDays = this.props.habitData.dates.length;

    let trendIndex = 6;
    // have to work out array indexs for the 7 dates
    this.props.habitData.dates.forEach(function(element, index){
      // create a date for totalDays
//console.log("PASSED IN ", element);
//console.log("DATE PASSED in ",element.theDate )
      let thisDate = new Date(element.theDate);
      thisDate.setHours(0,0,0,0);
      let today = new Date();
      today.setHours(0,0,0,0);
      var yesterday = new Date();
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      yesterday.setDate(yesterday.getDate()-1);

      if ((today > yesterday) && (today < tomorrow)) {

          trendIndex = index;
      }

    });

    return (
      <div>
        <XoverY over={this.props.habitData.over} under={this.props.habitData.under} />
        <Trend daysAgo7={this.props.habitData.dates[trendIndex-1].dateState} daysAgo6={this.props.habitData.dates[trendIndex-2].dateState} daysAgo5={this.props.habitData.dates[trendIndex-3].dateState} daysAgo4={this.props.habitData.dates[trendIndex-4].dateState} daysAgo3={this.props.habitData.dates[trendIndex-5].dateState} daysAgo2={this.props.habitData.dates[trendIndex-6].dateState} daysAgo1={this.props.habitData.dates[trendIndex-7].dateState} />
        <StatsText over={this.props.habitData.over} under={this.props.habitData.under} total={totalDays} notSet={this.props.habitData.notSet}/>
        <DateSet datesData={this.props.habitData.dates} habitName={this.props.habitData.title} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
      </div>
    );
  }
}

export default HabitScreen;
