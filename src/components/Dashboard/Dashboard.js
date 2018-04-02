import React, { Component } from 'react';
import Exit from './Exit';
import '../App/App.css';

// array of ProfileActivity

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      habits: "signUp"
    };

    this.handleHabitSelect = this.handleHabitSelect.bind(this);
  }

  handleHabitSelect (habit) {
    // stub for handling habit select
    // pass habit select to each habit when created
  }

  render() {
    return (
      <div>
        <Exit handleSignOut={this.props.handleSignOut}/>
        <div className="forTheHabits"></div>
      </div>
    );
  }
}

export default Dashboard;

// <ProfileEmail email='matthew.denyer@slatewire.com' reminder='true' />
