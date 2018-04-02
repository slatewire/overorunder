import React, { Component } from 'react';
import { Button } from 'react-materialize'
import '../App/App.css';

// array of ProfileActivity

class Exit extends Component {

  constructor(props) {
    super(props);

    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }

  handleDeleteAccount() {
    // modal from click to say-are you sure all data will be lost
    // call to api to delete
    // redirect to home

    console.log("handle delete account");
    this.props.handleSignOut();

  }

  render() {
    return (
      <div className="oo-header">
        <div>
          <button className="button1" onClick={this.handleDeleteAccount}>delete my account</button>
        </div>
        <div>
          <Button className="signOutButton teal lighten-2" waves='green' node='a' onClick={this.props.handleSignOut}>Sign Out</Button>
        </div>
      </div>
    );
  }
}

export default Exit;
