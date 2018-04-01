import React, { Component } from 'react';
import XoverY from './XoverY/XoverY';
import Trend from './Trend/Trend';
import StatsText from './StatsText/StatsText';
import DateSet from './DateSet/DateSet';
import { Button, Icon } from 'react-materialize'

import '../App/App.css';

// array of ProfileActivity

class OverOrUnder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      myToken: '',
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
  }

  componentWillMount() {
    console.log("in under over");
    let isAuthed = sessionStorage.getItem('isAuthed');
    if(!isAuthed) {
      const { history } = this.props
      history.replace('/');
    } else {
      // could do extra defensive here!
      const thisToken = localStorage.getItem('overUnderToken')
      this.setState({myToken: thisToken});
    }
  }

  handleSignOut () {
    sessionStorage.removeItem('isAuthed');
    localStorage.removeItem('overUnderToken');

    const { history } = this.props
    history.push('/');

  }

  handleGetData () {

    return fetch(`http://localhost:8080/api/users/`, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        "x-access-token": this.state.myToken
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      console.log('data response');
      console.log(jsonResponse);
      //if (jsonResponse.businesses) {
        //return jsonResponse.businesses.map(business => ({
        //
        //}));
      //}
    });
  }


  render() {
    return (
      <div>
        <h3>hi</h3>
        <Button className="goButton teal lighten-2" waves='green' node='a' onClick={this.handleSignOut}>Sign Out<Icon right>send</Icon></Button>
        <Button className="goButton teal lighten-2" waves='green' node='a' onClick={this.handleGetData}>Get Data<Icon right>send</Icon></Button>
        <XoverY />
        <Trend />
        <StatsText />
        <DateSet />
        <DateSet />
        <DateSet />
      </div>
    );
  }
}

export default OverOrUnder;
