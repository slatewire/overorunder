import React, { Component } from 'react';
import { Button, Icon } from 'react-materialize';
import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';
import Header from '../Home/Header';
import '../App/App.css';


function GoToButton(props) {
  return (
    <button className="button1" onClick={props.onClick}>{props.label}</button>
  );
}

function ActionButton(props) {
  return (
    <Button className="goButton teal lighten-2" waves='green' node='a' onClick={props.onClick}>{props.label}<Icon right>send</Icon></Button>
  );
}

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flowType: "login",
      email: '',
      password: '',
      message: ''
    };

    this.handleUserName = this.handleUserName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.resetPwdRequest = this.resetPwdRequest.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.goToResetPwdReq = this.goToResetPwdReq.bind(this);
  }

  async componentWillMount() {

    // check token, if valid user redirect to Dashboard
    let isAuthed = sessionStorage.getItem('isAuthed');
    if(isAuthed) {
      const { history } = this.props
      history.replace('/overorunder');
    } else {
      let myToken = localStorage.getItem('overUnderToken');
      if(myToken) {

        // call the API to see if valid

        let url = 'http://localhost:8080/api/validate';

        if (process.env.REACT_APP_ENV === 'dev') {
          url = 'http://localhost:8080/api/validate';
        } else if (process.env.REACT_APP_ENV === 'prod') {
          url = 'https://api.overorunder.io/api/validate';
        } else {
          url = 'http://localhost:8080/api/validate';
        }

        try {
          let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({token: myToken}),
            headers: {
              "Content-type": "application/json",
              "crossDomain": true,
            }
          });
          if (response.ok) {
            let jsonResponse = await response.json();

            if(jsonResponse.success) {

              sessionStorage.setItem('isAuthed', true);
              const { history } = this.props
              history.replace('/overorunder');
            } else {
              localStorage.removeItem('overUnderToken');
              // not needed by logic, but for completeness
              sessionStorage.removeItem('isAuthed');
            }
          }
          // no else for not ok!
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  handleUserName (email) {
    this.setState({email: email})
  }

  handlePassword (password) {
    this.setState({password: password})
  }

  goToLogin () {
    this.setState({flowType: 'login'});
    this.setState({message: ""});
  }

  goToSignUp () {
    this.setState({flowType: 'signUp'});
    this.setState({message: ""});
  }

  goToResetPwdReq () {
    this.setState({flowType: 'requestReset'});
    this.setState({message: ""});
  }

  async login () {

    this.setState({message: ""});

    let url = 'http://localhost:8080/api/authenticate';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/authenticate';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/authenticate';
    } else {
      url = 'http://localhost:8080/api/authenticate';
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({name: this.state.email,
                              password: this.state.password}),
        headers: {
          "Content-type": "application/json",
          "crossDomain": true,
        }
      });
      if (response.ok) {
        let jsonResponse = await response.json();

        if(jsonResponse.success) {

          localStorage.setItem('overUnderToken', jsonResponse.token);
          sessionStorage.setItem('isAuthed', true);
          const { history } = this.props
          history.push('/overorunder');
        } else {
          this.setState({message: jsonResponse.message});
        }

      }
    } catch (error) {
      console.log(error);
      this.setState({message: "Error from OverOrUnder"});
    }

  }

  async signUp () {

    this.setState({message: ""});

    let url = 'http://localhost:8080/api/signup';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/signup';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/signup';
    } else {
      url = 'http://localhost:8080/api/signup';
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({name: this.state.email,
                              password: this.state.password}),
        headers: {
          "Content-type": "application/json",
          "crossDomain": true,
        }
      });
      if (response.ok) {
        let jsonResponse = await response.json();
        if(jsonResponse.success) {

          localStorage.setItem('overUnderToken', jsonResponse.token);
          sessionStorage.setItem('isAuthed', true);
          const { history } = this.props
          history.push('/overorunder');
        } else {
          this.setState({message: jsonResponse.message});
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({message: "Error from OverOrUnder"});
    }

  }

  async resetPwdRequest () {
    //this.setState({message: ""});

console.log("Reset PWD call");

    let url = 'http://localhost:8080/api/forgotpass';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/forgotpass';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/forgotpass';
    } else {
      url = 'http://localhost:8080/api/forgotpass';
    }

    try {
      let response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({email: this.state.email}),
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
      // no else for not ok!
    } catch (error) {
      console.log(error);
    }
  }

  render() {

    //console.log('the state of redirect and isAuth is:');
    //console.log(this.state.redirectToReferrer);

const flow = this.state.flowType;

let header = null;
let navButton = null;
let actionButton = null;
let resetReqButton = null;
let emailFormDiv = null;
let passwordFormDiv = null;
let tandc = null;
let formFieldsCss = "FormFields";

if (flow === "login") {
  header = <Header />
  navButton = <GoToButton onClick={this.goToSignUp} label="Sign Up" />
  actionButton = <ActionButton onClick={this.login} label="Login" />
  resetReqButton = <GoToButton onClick={this.goToResetPwdReq} label="Reset Password" />
  //resetReqButton = "";
  emailFormDiv = <EmailForm handleUserName={this.handleUserName}/>
  passwordFormDiv = <PasswordForm handlePassword={this.handlePassword}/>

} else if (flow === "signUp") {
  formFieldsCss = "FormFieldsSignUp"
  navButton = <GoToButton onClick={this.goToLogin} label="Login" />
  actionButton = <ActionButton onClick={this.signUp} label="Sign up" />
  emailFormDiv = <EmailForm handleUserName={this.handleUserName}/>
  passwordFormDiv = <PasswordForm handlePassword={this.handlePassword}/>
  // resetReqButton = <GoToButton onClick={this.goToResetPwdReq} label="Reset Password" />
  // resetReqButton = "";
  tandc = <p> <a className="teal-text text-lighten-2" href="/terms">by signing up you are agreeing to the terms and conditions and the cookie usage policy of UnderOver.</a></p>

} else if (flow === "requestReset") {
  navButton = <GoToButton onClick={this.goToLogin} label="Login"/>
  actionButton = <ActionButton onClick={this.resetPwdRequest} label="Reset Password" />
  emailFormDiv = <div className="FormFieldsSignUp"><EmailForm handleUserName={this.handleUserName}/></div>

} else {
  navButton = <GoToButton onClick={this.goToLogin} label="Login" />
  actionButton = <ActionButton onClick={this.SignUp} label="Sign up" />
  emailFormDiv = <div className="FormFieldsSignUp"><EmailForm handleUserName={this.handleUserName}/></div>
  passwordFormDiv = <PasswordForm handlePassword={this.handlePassword}/>
}

    return (
    <div className="mainContainer">
      <div className="SignInUp">
        {header}

        <p className="deep-orange-text text-accent-3">{this.state.message}</p>

        <div className="bottomDiv">
          <div className={formFieldsCss}>
            {emailFormDiv}
            {passwordFormDiv}
          </div>
          {tandc}
          <div className="signInButton">
            {actionButton}
          </div>
          <div className="signInNavButton">
            {navButton}
          </div>
          <div className="resetNavButton">
            {resetReqButton}
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default SignIn;
