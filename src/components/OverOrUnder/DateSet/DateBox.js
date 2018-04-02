import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize'

class DateBox extends Component {
  constructor(props) {
    super(props);

  this.state = {
    date: this.props.cardDate.date,
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

  let newDate = new Date(this.state.date);

  const days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

  const dayOfWeek = days[ newDate.getDay() ];
  const month = months[ newDate.getMonth() ];
  const day = newDate.getDate();

  const theDate = dayOfWeek + " " + day.toString() + " " + month;

  let pTag = null;
  if (this.state.dateState === 'bad') {
    pTag = <p className="deep-orange-text text-accent-3">{theDate}</p>
  } else if (this.state.dateState === 'good') {
    pTag = <p className="teal-text text-lighten-2">{theDate}</p>
  } else {
    pTag = <p>{theDate}</p>
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

export default DateBox;
