import React, { Component } from 'react';
import { Input, Row, Button } from 'react-materialize'
import '../App/App.css';

// array of ProfileActivity

class Games extends Component {
  constructor(props) {
    super(props);

    this.state = {
      habit: "drinking",
      oldOver: this.props.oldOver,
      oldUnder: this.props.oldUnder
    };

    this.handleOldOverChange = this.handleOldOverChange.bind(this);
    this.handleOldUnderChange = this.handleOldUnderChange.bind(this);
    this.handleOldNumbersUpdate = this.handleOldNumbersUpdate.bind(this);

  }

  handleOldOverChange (update) {
    this.setState({oldOver : update.target.value});
    this.props.handleSetOldOver(update.target.value);
  }

  handleOldUnderChange (update) {
    this.setState({oldUnder : update.target.value});
    this.props.handleSetOldUnder(update.target.value);
  }

  async handleOldNumbersUpdate () {
      // call update on api
      const myToken = localStorage.getItem('overUnderToken');

      let url = 'http://localhost:8080/api/updateOldScore';

      if (process.env.REACT_APP_ENV === 'dev') {
        url = 'http://localhost:8080/api/updateOldScore';
      } else if (process.env.REACT_APP_ENV === 'prod') {
        url = 'https://api.overorunder.io/api/updateOldScore';
      } else {
        url = 'http://localhost:8080/api/updateOldScore';
      }

      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({habit: this.state.habit, over: this.state.oldOver , under: this.state.oldUnder}),
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
      <div className="screenNameLabel">
        <div>
          <Row>
              <Input s={12} type="number" className="validate" defaultValue={this.state.oldOver} label="past over score" onChange={this.handleOldOverChange.bind(this)}/>
          </Row>
          <Row>
              <Input s={12} type="number" className="validate" defaultValue={this.state.oldUnder} label="past under score" onChange={this.handleOldUnderChange.bind(this)}/>
          </Row>
          <div className="signInButton">
            <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.handleOldNumbersUpdate}>save changes</Button>
          </div>
        </div>

      </div>
    );
  }
}

export default Games;
