import React, { Component } from 'react';
import ScreenName from './ScreenName';
import LeagueSwitch from './LeagueSwitch';
import Exit from './Exit';
import '../App/App.css';

// array of ProfileActivity

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      habits: "signUp"
    };
  }

  componentWillMount () {
    //this.props.handleSetMyScreen("settingsScreen");
  }



  render() {
    return (
      <div className="screenNameLabel">
        <ScreenName myScreenName={this.props.myScreenName} handleSetScreenName={this.props.handleSetScreenName} />
        <LeagueSwitch leagueSwitch={this.props.leagueSwitch} handleUpdateLeagueSwitch={this.props.handleUpdateLeagueSwitch} />
        <div className="signOutDiv">
          <Exit handleSignOut={this.props.handleSignOut}/>
        </div>
      </div>
    );
  }
}

export default Settings;
