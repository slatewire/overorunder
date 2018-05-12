import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize';
//import Moment from 'react-moment';
import moment from 'moment';

class DateBox extends Component {
  constructor(props) {
    super(props);

  this.state = {
    date: this.props.cardDate.theDate,
    dateState: this.props.cardDate.dateState
  };

  this.handleHabitDateUpdateGood = this.handleHabitDateUpdateGood.bind(this);
  this.handleHabitDateUpdateBad = this.handleHabitDateUpdateBad.bind(this);
}

handleHabitDateUpdateGood (habit, date, oldState, newState) {

  if (this.state.dateState === 'good') {
    // do nothig i guess - maybe set back to unSet in future?
  } else {
    this.props.handleHabitDateUpdate(this.props.habitName, this.state.date, this.state.dateState, 'good');
    this.setState({dateState: 'good'});
  }
}

handleHabitDateUpdateBad (habit, date, oldState, newState) {
  if (this.state.dateState === 'bad') {
    // do nothig i guess - maybe set back to unSet in future?
  } else {
    this.props.handleHabitDateUpdate(this.props.habitName, this.state.date, this.state.dateState, 'bad');
    this.setState({dateState: 'bad'});
  }
}

  render() {

    var date = this.state.date + "T00:00-0000";
    var now = moment().subtract(1, 'days');

    if (now.isBefore(date)) {
      return ( <div></div>);
    } else {

      let dateString = moment(this.state.date).format('dddd');
      dateString = dateString.substring(0, 3);
      let dateStringB = moment(this.state.date).format('MMM Do');
      dateString = dateString + " " + dateStringB;

      let pTag = null;
      if (this.state.dateState === 'bad') {
        pTag = <p className="deep-orange-text text-accent-3">{dateString}</p>
      } else if (this.state.dateState === 'good') {
        pTag = <p className="teal-text text-lighten-2">{dateString}</p>
      } else {
        pTag = <p>{dateString}</p>
      }

      return (
        <div className="card dateCard">
          <div className="card-content">
            {pTag}
              <div className="trendDiv">
                <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
                <Button className="dateButton deep-orange accent-3" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
              </div>
            </div>
          </div>
      );
    }
  }
}

export default DateBox;
