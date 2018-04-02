import React, { Component } from 'react';
import DateBox from './DateBox'

class DateSet extends Component {
  render() {

    return (
      <div className="datesContainer">
        <div className="dateBox">
                {
                  this.props.datesData.map(thisDate => {
                    return <DateBox key={thisDate.date} cardDate={thisDate} habitName ={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
                  })
                }
        </div>
      </div>
    );
  }
}

export default DateSet;
