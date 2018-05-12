import React, { Component } from 'react';
import TrendWeek from './TrendWeek'
import '../../App/App.css';

class TrendMonth extends Component {

  render() {

    return (
        <tbody>
          {
            this.props.month.weeks.map((thisMonth, index) => {
              return (

                  <TrendWeek key={index} week={thisMonth} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate} />
              );
          })
        }
      </tbody>
    );
  }
}

export default TrendMonth;
