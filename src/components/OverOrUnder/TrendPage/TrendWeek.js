import React, { Component } from 'react';
import Dot from './Dot'
import '../../App/App.css';

class TrendWeek extends Component {


  render() {

    return (
      <tr>
        {
          this.props.week.map((thisDot, index) => {
            return (
              <Dot key={index} dot={thisDot.dot} date={thisDot.date} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate} />
            );
          })
        }
      </tr>
    );
  }
}

export default TrendWeek;
