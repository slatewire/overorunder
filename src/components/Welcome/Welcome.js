import React from 'react';
import '../App/App.css';

class Welcome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false,
                  welocomeFlow: 'homeScreen'
                 };

  //  this.handleLoginClick = this.handleLoginClick.bind(this);
  //  this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  render() {
    return (
      <div className="Welcome">

      </div>
    );
  }
}

export default Welcome;
