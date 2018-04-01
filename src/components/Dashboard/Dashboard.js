import React, { Component } from 'react';
// import ProfileEmail from './ProfileEmail/ProfileEmail';
import ProfileActivity from './ProfileActivity/ProfileActivity';
import '../App/App.css';

// array of ProfileActivity

class Dashboard extends Component {
  render() {
    return (
      <div>
        <div className="pageHeader">
          <i class="medium material-icons">dashboard</i>
        </div>
        <ProfileActivity activity='drinking' moreOrLess='less' />
        <ProfileActivity activity='exercise' moreOrLess='more' />

        <div className="bottomDiv">
          <p> <a className="logIn" href='/'>log out</a></p>
        </div>
      </div>
    );
  }
}

export default Dashboard;

// <ProfileEmail email='matthew.denyer@slatewire.com' reminder='true' />
