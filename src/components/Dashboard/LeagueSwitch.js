import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize';
import '../App/App.css';

// array of ProfileActivity

class LeagueSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leagueSwitch: this.props.leagueSwitch
    };

    this.handleLeagueSwitchChange = this.handleLeagueSwitchChange.bind(this);
    this.handleLeagueSwitchUpdate = this.handleLeagueSwitchUpdate.bind(this);
  }

  handleLeagueSwitchChange () {



    if (this.state.leagueSwitch === "true") {
      this.setState({leagueSwitch : "false"});
      this.handleLeagueSwitchUpdate("false");
      this.props.handleUpdateLeagueSwitch("false");
    } else {
      this.setState({leagueSwitch : "true"});
      this.handleLeagueSwitchUpdate("true");
      this.props.handleUpdateLeagueSwitch("true");
    }

  }

  async handleLeagueSwitchUpdate (theSwitch) {

console.log("Do the keague switch update call ", this.state.leagueSwitch);

      // call update on api
      const myToken = localStorage.getItem('overUnderToken');

      let url = 'http://localhost:8080/api/updateLeagueSwitch';

      if (process.env.REACT_APP_ENV === 'dev') {
        url = 'http://localhost:8080/api/updateLeagueSwitch';
      } else if (process.env.REACT_APP_ENV === 'prod') {
        url = 'https://api.overorunder.io/api/updateLeagueSwitch';
      } else {
        url = 'http://localhost:8080/api/updateLeagueSwitch';
      }

      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({leagueSwitch: theSwitch}),
          headers: {
            "Content-type": "application/json",
            "crossDomain": true,
            "x-access-token": myToken
          }
        });
        if (response.ok) {
          let jsonResponse = await response.json();

          if(jsonResponse.success) {

            // TO DO NOT ALOT APART FROM ERROR AND QUEUEING IF NOT NETWORK
          }
        }
      } catch (error) {
        console.log(error);
        this.setState({message: "Error from OverOrUnder"});
      }
  }

  render() {

    console.log("state ", this.state.leagueSwitch);
    console.log("props ", this.props.leagueSwitch);

    let buttonText = "";
    if (this.state.leagueSwitch === "true") {
      buttonText="remove from league";
    } else {
      buttonText="enter into league";
    }


    return (
      <div className="leagueSettings">
        <Button className="leagueButton teal lighten-2" waves='green' node='a' onClick={this.handleLeagueSwitchChange}>{buttonText}</Button>
      </div>
    );
  }
}

export default LeagueSwitch;
