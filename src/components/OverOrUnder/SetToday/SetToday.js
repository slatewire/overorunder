import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize'
//import moment from 'moment'

class SetToday extends Component {
  constructor(props) {
    super(props);

  this.handleHabitDateUpdateGood = this.handleHabitDateUpdateGood.bind(this);
  this.handleHabitDateUpdateBad = this.handleHabitDateUpdateBad.bind(this);
}

handleHabitDateUpdateGood (habit, date, oldState, newState) {
    this.props.handleHabitDateUpdate(this.props.habitName, this.props.cardDate.theDate, this.props.cardDate.dateState, 'good');
}

handleHabitDateUpdateBad (habit, date, oldState, newState) {
    this.props.handleHabitDateUpdate(this.props.habitName, this.props.cardDate.theDate, this.props.cardDate.dateState, 'bad');
}

  render() {
    return (
      <div>
      <div className="spacer"></div>
      <div className="card todayCard">
        <div className="card-content">
          <p>How did you do yesterday?</p>
          <div className="trendDiv">
            <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
            <Button className="dateButton deep-orange accent-3" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default SetToday;
