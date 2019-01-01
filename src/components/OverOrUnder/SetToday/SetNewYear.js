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
      <p>thank you for playing OverOrUnder during 2018, all the feedback and ideas have been much appreciate. Early in 2019 I hope to take it into Beta along with a few additional features, such as a leaderboard so that you can gauge how you are doing compared to the rest of the community. All continued feedback will be really valuable... so, click below to start your 2019 habit changing journey. </p>
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
