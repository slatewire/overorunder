import React, { Component } from 'react';
//import { Modal, Button, Icon } from 'react-materialize';
//import moment from 'moment';
import '../../App/App.css';

class Dot extends Component {
    constructor(props) {
      super(props);

    this.state = {
      //dot: this.props.dot,
      //date: this.props.date.theDate,
      dot: this.props.dot
      //habitName: this.props.habitName,
    };

  //  this.handleHabitDateUpdateGood = this.handleHabitDateUpdateGood.bind(this);
  //  this.handleHabitDateUpdateBad = this.handleHabitDateUpdateBad.bind(this);
  }

  //handleHabitDateUpdateGood (habit, date, oldState, newState) {

//    if (this.state.dateState === 'good') {
//      // do nothig i guess - maybe set back to unSet in future?
//    } else {
//      this.props.handleHabitDateUpdate(this.props.habitName, this.state.date, this.state.dateState, 'good');
//      this.setState({dateState: 'good'});
//      this.setState({dot: "o"})
//    }
//  }
//
//  handleHabitDateUpdateBad (habit, date, oldState, newState) {
//    if (this.state.dateState === 'bad') {
//      // do nothig i guess - maybe set back to unSet in future?
//    } else {
//      this.props.handleHabitDateUpdate(this.props.habitName, this.state.date, this.state.dateState, 'bad');
//      this.setState({dateState: 'bad'});
//      this.setState({dot: "u"})
//    }
//  }

  render() {
    //let dateString = moment(this.state.date).format('dddd');
    //dateString = dateString.substring(0, 3);
    //let dateStringB = moment(this.state.date).format('MMM Do');
    //dateString = dateString + " " + dateStringB;

    let dotType = "blank";
    if (this.state.dot.dot === 'b') {
      dotType = "blankButton";
    } else {


      //let sig = "";
      switch (this.state.dot.date.dateState) {
        case "good":
          dotType = "goodButton";
          //sig="sigGood";
          break;
        case "bad":
          dotType = "badButton";
          //sig="sigBad";
          break;
        case "notSet":
          dotType = "notSetButton";
          //sig="sigNotSet";
          break;
        default:
          dotType = "blankButton";
      }
    }

    //if (dotType === "blankButton") {

      return (
          <td>
            <div className={dotType}></div>
          </td>
      );
  }
}

export default Dot;

//<td>
//  <Modal bottomSheet
//    trigger={<button className={dotType}></button>}>
//    <div className={sig}></div>
//    <p>{dateString}</p>
//    <div className="trendDiv">
//      <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleHabitDateUpdateGood}><Icon>check</Icon></Button>
//      <Button className="dateButton deep-orange accent-3" waves='green' node='a' onClick={this.handleHabitDateUpdateBad}><Icon>clear</Icon></Button>
//    </div>
//  </Modal>
//</td>
