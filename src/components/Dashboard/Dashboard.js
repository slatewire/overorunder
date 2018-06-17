import React, { Component } from 'react';
import { Button } from 'react-materialize'
import Games from './Games';
import Settings from './Settings';
import '../App/App.css';

// array of ProfileActivity

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      habits: "signUp",
      currentScreen: "menu"
    };

    this.handleHabitSelect = this.handleHabitSelect.bind(this);
    this.handleGamesScreen = this.handleGamesScreen.bind(this);
    this.handleHabitScreen = this.handleHabitScreen.bind(this);
  }

  handleGamesScreen () {
    this.setState({currentScreen: "habits"});
  }

  handleHabitScreen () {
    console.log("HabitScreen please");
    this.setState({currentScreen: "settings"});
  }

  handleHabitSelect (habit) {
    // stub for handling habit select
    // pass habit select to each habit when created
  }

  render() {

    let componentToShow = null;

    switch(this.state.currentScreen) {
      case "menu":
          console.log("bob");
          componentToShow =
                            <div className="centeredMenu">
                              <div className="menuBut">
                                <Button floating  className='menuBut teal lighten-2' waves='light' icon='games' onClick={this.handleGamesScreen}>games</Button>
                              </div>
                              <div className="menuBut">
                                <Button floating  className=' menuBut eal lighten-2' waves='light' icon='settings' onClick={this.handleHabitScreen}>games</Button>
                              </div>
                            </div>

          break;
      case "habits":
        console.log("bobob");
        componentToShow = <Games handleSetMyScreen={this.props.handleSetMyScreen}/>
        break;
      case "settings":
        console.log("settings");
        componentToShow = <Settings handleSignOut={this.props.handleSignOut} myScreenName={this.props.myScreenName} handleSetScreenName={this.props.handleSetScreenName} handleSetMyScreen={this.props.handleSetMyScreen}/>
        break;
      default:
        console.log("default");
    }



    return (
      <div>
        {componentToShow}
      </div>
    );
  }
}

export default Dashboard;

// <ProfileEmail email='matthew.denyer@slatewire.com' reminder='true' />
