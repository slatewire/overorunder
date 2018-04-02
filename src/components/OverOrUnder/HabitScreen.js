import React, { Component } from 'react';
import XoverY from './XoverY/XoverY';
import Trend from './Trend/Trend';
import StatsText from './StatsText/StatsText';
import DateSet from './DateSet/DateSet';
import '../App/App.css';

// array of ProfileActivity

class HabitScreen extends Component {
  render() {

    return (
      <div>
        <XoverY over={this.props.habitData.over} under={this.props.habitData.under} />
        <Trend daysAgo7={this.props.habitData.dates[6].dateState} daysAgo6={this.props.habitData.dates[5].dateState} daysAgo5={this.props.habitData.dates[4].dateState} daysAgo4={this.props.habitData.dates[3].dateState} daysAgo3={this.props.habitData.dates[2].dateState} daysAgo2={this.props.habitData.dates[1].dateState} daysAgo1={this.props.habitData.dates[0].dateState} />
        <StatsText over={this.props.habitData.over} under={this.props.habitData.under} total={this.props.habitData.total} notSet={this.props.habitData.notSet}/>
        <DateSet datesData={this.props.habitData.dates} habitName={this.props.habitData.name} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
      </div>
    );
  }
}

export default HabitScreen;
