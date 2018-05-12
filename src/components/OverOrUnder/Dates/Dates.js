import React, { Component } from 'react';
import { Button } from 'react-materialize';
import DateSet from '../DateSet/DateSet';
import TrendPage from '../TrendPage/TrendPage'
import '../../App/App.css';

class Dates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendar: true
    };

    this.handleViewButton = this.handleViewButton.bind(this);
  }

  handleViewButton () {
    if (this.state.calendar) {
      this.setState({calendar: false});
    } else {
      this.setState({calendar: true});
    }
  }

  render() {

    let componentToShow = "";
    let buttonLabel = "dehaze"

    if (this.state.calendar) {
      componentToShow = <TrendPage habitData={this.props.habitData} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
    } else {
      buttonLabel = "date_range";
      componentToShow = <DateSet datesData={this.props.datesData} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate}/>
    }

    return (
      <div>
        <div className="dateSwitch">
          <Button icon={buttonLabel} onClick={this.handleViewButton}></Button>
        </div>
        <div className="datesContainer">
          <div className="dateBox">
          {componentToShow}
          </div>
        </div>
      </div>
    );
  }
}

export default Dates;
