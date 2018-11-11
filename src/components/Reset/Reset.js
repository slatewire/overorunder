import React, { Component } from 'react';
import PasswordForm from '../SignIn/PasswordForm';
import { Button, Icon } from 'react-materialize';
import Header from '../Home/Header';

function ActionButton(props) {
  return (
    <Button className="goButton teal lighten-2" waves='green' node='a' onClick={props.onClick}>{props.label}<Icon right>send</Icon></Button>
  );
}

function GoToButton(props) {
  return (
    <button className="button1" onClick={props.onClick}>{props.label}</button>
  );
}

class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      password: '',
      message: ''
    };

    this.handlePassword = this.handlePassword.bind(this);
    this.resetPwd = this.resetPwd.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }

  componentDidMount() {
      this.setState({code: this.props.match.params.code});
  }

  handlePassword (password) {
    this.setState({password: password})
  }

  async resetPwd () {
    this.setState({message: ""});

    let url = 'http://localhost:8080/api/resetpass';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/resetpass';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/resetpass';
    } else {
      url = 'http://localhost:8080/api/resetpass';
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({code: this.state.code,
                              password: this.state.password}),
        headers: {
          "Content-type": "application/json",
          "crossDomain": true,
        }
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if(jsonResponse.success) {
          this.setState({message: jsonResponse.message});
        } else {
          this.setState({message: jsonResponse.message});
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({message: "Error from OverOrUnder"});
    }
  }

  goToLogin () {
    const { history } = this.props
    history.replace('/overorunder');
  }

  render() {

console.log("code: ", this.state.code);

    return (
      <div className="mainContainer">
        <div className="SignInUp">
          <Header />

          <p className="deep-orange-text text-accent-3">{this.state.message}</p>

          <div className="bottomDiv">
            <div className="FormFieldsSignUp">
              <PasswordForm handlePassword={this.handlePassword}/>
            </div>
            <div className="signInButton">
              <ActionButton onClick={this.resetPwd} label="Reset Password" />
            </div>
            <div className="signInNavButton">
              <GoToButton onClick={this.goToLogin} label="Login"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reset;
