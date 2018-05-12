import React, { Component } from 'react';
import { Modal, Button, Icon } from 'react-materialize'
import '../../App/App.css';

class Dot extends Component {
    constructor(props) {
      super(props);

    this.state = {
      dot: this.props.dot,
      date: this.props.date.theDate,
      dateState: this.props.date.dateState,
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
      this.setState({dot: "o"})
    }
  }

  handleHabitDateUpdateBad (habit, date, oldState, newState) {
    if (this.state.dateState === 'bad') {
      // do nothig i guess - maybe set back to unSet in future?
    } else {
      this.props.handleHabitDateUpdate(this.props.habitName, this.state.date, this.state.dateState, 'bad');
      this.setState({dateState: 'bad'});
      this.setState({dot: "u"})
    }
  }

  render() {

    let dotType = "blank";
    switch (this.state.dot) {
      case "o":
        dotType = "goodButton";
        break;
      case "u":
        dotType = "badButton";
        break;
      case "n":
        dotType = "notSetButton";
        break;
      default:
        dotType = "blankButton";
    }

    if (dotType === "blankButton") {
      return (
          <td>
            <div className={dotType}></div>
          </td>
      );
    } else {

      return (
          <td>
            <Modal className="questionModal" bottomSheet
              trigger={<button className={dotType}></button>}>
              <p>text in modal</p>
              <div className="trendDiv">
                <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
                <Button className="dateButton deep-orange accent-3" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
              </div>
            </Modal>
          </td>
      );
    }
  }
}

export default Dot;
