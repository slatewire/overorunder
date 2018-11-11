import React, { Component } from 'react';
import {Button, Icon } from 'react-materialize';
import moment from 'moment';
import '../../App/App.css';

class UpdateButton extends Component {
    constructor(props) {
      super(props);

    this.state = {
      date: this.props.thisDot.theDate,
      dateState: this.props.thisDot.dateState,
      habitName: this.props.habitName,
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

    let dateString = moment(this.state.date).format('dddd');
    dateString = dateString.substring(0, 3);
    let dateStringB = moment(this.state.date).format('MMM Do');
    dateString = dateString + " " + dateStringB;


    let buttons = null;
    switch (this.state.dateState) {
      case "good":
        buttons = <div>
                    <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
                    <Button className="dateButton grey" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
                  </div>
        break;
      case "bad":
        buttons = <div>
                    <Button className="dateButton grey" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
                    <Button className="dateButton deep-orange accent-3" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
                  </div>
        break;
      default:
        buttons = <div>
                    <Button className="dateButton grey" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
                    <Button className="dateButton grey" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
                  </div>
    }

      return (
          <div>
            <p>{dateString}</p>
            <div className="trendDiv">
              {buttons}
            </div>
          </div>
      );
  }
}

export default UpdateButton;

// teal
