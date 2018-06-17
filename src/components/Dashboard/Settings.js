import React, { Component } from 'react';
import ScreenName from './ScreenName';
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
        <div className="signOutDiv">
          <Exit handleSignOut={this.props.handleSignOut}/>
        </div>
      </div>
    );
  }
}

export default Settings;
