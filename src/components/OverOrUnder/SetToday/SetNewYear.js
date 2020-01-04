import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize'
//import moment from 'moment'

class SetNewYear extends Component {
  constructor(props) {
    super(props);

  this.handleStartNewYear = this.handleStartNewYear.bind(this);
}

handleStartNewYear (habit) {
    this.props.handleStartNewYear(this.props.habitName);
}

  render() {
    return (
      <div>
      <header className="oo-header">
        <h3 className="teal-text text-lighten-2 over">habits make lives</h3>
        <hr className="HeaderLine" ></hr>
        <h3 className="deep-orange-text text-accent-3">habits break lives</h3>
      </header>
      <p>thank you for playing OverOrUnder during 2019, all the feedback and ideas have been much appreciated. The plan for 2020 is to add alerts and customizable games... so, click below to start your 2020 habit changing journey. </p>
      <div className="spacer"></div>
      <div className="card todayCard">
        <div className="card-content">
          <div className="trendDiv">
            <Button className="dateButton teal lighten-2" waves='green' node='a' onClick={this.handleStartNewYear}><Icon>check</Icon></Button>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default SetNewYear;
