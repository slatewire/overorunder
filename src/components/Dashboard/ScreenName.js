import React, { Component } from 'react';
import { Input, Row, Button } from 'react-materialize'
import '../App/App.css';

// array of ProfileActivity

class ScreenName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenName: this.props.myScreenName
    };

    this.handleScreenNameChange = this.handleScreenNameChange.bind(this);
    this.handleScreenNameUpdate = this.handleScreenNameUpdate.bind(this);
  }

  handleScreenNameChange (update) {
    this.setState({screenName : update.target.value});
    this.props.handleSetScreenName(update.target.value);
  }

  async handleScreenNameUpdate () {

      // call update on api
      const myToken = localStorage.getItem('overUnderToken');

      let url = 'http://localhost:8080/api/updateScreenName';

      if (process.env.REACT_APP_ENV === 'dev') {
        url = 'http://localhost:8080/api/updateScreenName';
      } else if (process.env.REACT_APP_ENV === 'prod') {
        url = 'https://api.overorunder.io/api/updateScreenName';
      } else {
        url = 'http://localhost:8080/api/updateScreenName';
      }

      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({screenName: this.state.screenName}),
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
    return (
      <div>
        <Row>
            <Input s={12} type="number" class="validate" defaultValue={this.state.screenName} label="screen name" onChange={this.handleScreenNameChange.bind(this)}/>
        </Row>
        <div className="signInButton">
          <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.handleScreenNameUpdate}>save changes</Button>
        </div>
      </div>
    );
  }
}

export default ScreenName;
