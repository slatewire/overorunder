import React, { Component } from 'react';

class ProfileEmail extends Component {
  render() {
    return (
      <div>
        <p>{this.props.email}</p>
      </div>
    );
  }
}

export default ProfileEmail;
