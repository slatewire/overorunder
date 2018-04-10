import React, { Component } from 'react';
import DateBox from './DateBox'

class DateSet extends Component {
  render() {

    let myDates = this.props.datesData;

    return (
      <div className="datesContainer">
        <div className="dateBox">
                {
                  myDates.map(thisDate => {
                    return <DateBox key={thisDate.theDate} cardDate={thisDate} habitName ={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
                  })
                }
        </div>
      </div>
    );
  }
}

export default DateSet;
