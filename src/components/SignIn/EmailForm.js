import React, { Component } from 'react';
import '../App/App.css';


class EmailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange (event) {
    this.setState({email: event.target.value});
    this.props.handleUserName(event.target.value);
  }

  render() {

    return (
      <div className="row">
        <div className="input-field col s12">
          <input id="email" type="email" className="validate" value={this.state.email} onChange={this.handleEmailChange.bind(this)}/>
          <label form="email">Email</label>
        </div>
      </div>
    );
  }
}

export default EmailForm;
