import React, { Component } from 'react';
import '../App/App.css';


class PasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: ''
    }

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handlePasswordChange (event) {
    this.setState({password: event.target.value});
    this.props.handlePassword(event.target.value);
  }

  render() {

    return (
      <div className="row">
        <div className="input-field col s12">
          <input id="password" type="password" className="validate" value={this.state.password} onChange={this.handlePasswordChange}/>
          <label form="password">Password</label>
        </div>
      </div>
    );
  }
}

export default PasswordForm;
