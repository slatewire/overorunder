import React, { Component } from 'react';
import DateBox from './DateBox'

class DateSet extends Component {
  render() {

    let myDates = this.props.datesData;

    return (
      <div>
                {
                  myDates.map(thisDate => {
                    return <DateBox key={thisDate.theDate} cardDate={thisDate} habitName ={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
                  })
                }
    
      </div>
    );
  }
}

export default DateSet;
