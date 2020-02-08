import React, { Component } from 'react';
import { Input, Row, Button, Textarea } from 'react-materialize'
import '../App/App.css';

// array of ProfileActivity

class Email extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: "",
      text: "",
      subject: ""
    };

    this.handleEmailAddressChange = this.handleEmailAddressChange.bind(this);
    this.handleAllButtonChange = this.handleAllButtonChange.bind(this);
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleUpdateSubject = this.handleUpdateSubject.bind(this);
    this.handleSendEmail = this.handleSendEmail.bind(this);
    this.handleSendEmailOne = this.handleSendEmailOne.bind(this);
    this.handleSendEmailAll = this.handleSendEmailAll.bind(this);
    this.handleUpdatePwd = this.handleUpdatePwd.bind(this);

  }

  handleEmailAddressChange (update) {
    this.setState({emailAddress : update.target.value});
  }

  handleUpdateText (update) {
    this.setState({text: update.target.value});
  }

  handleUpdateSubject (update) {
    this.setState({subject: update.target.value});
  }

  handleAllButtonChange () {
    if(this.state.all) {
      this.setState({all : false});
    } else {
      this.setState({all : true});
    }
  }

  handleSendEmailOne () {
    this.handleSendEmail(false);
  }

  handleSendEmailAll () {
    this.handleSendEmail(true);
  }

  async handleSendEmail (all) {
      // call update on api
      const myToken = localStorage.getItem('overUnderToken');

      let url = 'http://localhost:8080/api/sendEmail';

      if (process.env.REACT_APP_ENV === 'dev') {
        url = 'http://localhost:8080/api/sendEmail';
      } else if (process.env.REACT_APP_ENV === 'prod') {
        url = 'https://api.overorunder.io/api/sendEmail';
      } else {
        url = 'http://localhost:8080/api/sendEmail';
      }

      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({text: this.state.text, subject: this.state.subject, all: all, emailAddress: this.state.emailAddress}),
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

  async handleUpdatePwd () {
      // call update on api
      const myToken = localStorage.getItem('overUnderToken');

      let url = 'http://localhost:8080/api/adminRestPwd';

      if (process.env.REACT_APP_ENV === 'dev') {
        url = 'http://localhost:8080/api/adminRestPwd';
      } else if (process.env.REACT_APP_ENV === 'prod') {
        url = 'https://api.overorunder.io/api/adminRestPwd';
      } else {
        url = 'http://localhost:8080/api/adminRestPwd';
      }

      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({subject: this.state.subject, emailAddress: this.state.emailAddress}),
          headers: {
            "Content-type": "application/json",
            "crossDomain": true,
            "x-access-token": myToken
          }
        });
        if (response.ok) {
          let jsonResponse = await response.json();

          if(jsonResponse.success) {
console.log("Updated PWD");
console.log(jsonResponse);
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
        <Row>
            <Input s={12} type="textarea" className="validate" defaultValue={this.state.text} label="email text" onChange={this.handleUpdateText.bind(this)}/>
        </Row>
        <Row>
            <Input s={12} type="text" className="validate" defaultValue={this.state.subject} label="subject" onChange={this.handleUpdateSubject.bind(this)}/>
        </Row>
        <Row>
            <Input s={12} type="text" className="validate" defaultValue={this.state.emailAddress} label="email" onChange={this.handleEmailAddressChange.bind(this)}/>
        </Row>
        <div className="emailButton">
          <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.handleSendEmailOne}>send email to one</Button>
        </div>
        <div className="emailButton">
          <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.handleSendEmailAll}>send email to all</Button>
        </div>
        <div className="emailButton">
          <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.handleUpdatePwd}>reset pwd</Button>
        </div>
      </div>
    );
  }
}

export default Email;

//<div>
//  <Row>
//      <Textarea s={12} className="validate" defaultValue={this.state.text} label="email text" onChange={this.handleUpdateText.bind(this)}/>
//  </Row>
//  <Row>
//      <Input s={12} type="text" className="validate" defaultValue={this.state.emailAddress} label="email" onChange={this.handleEmailAddressChange.bind(this)}/>
//  </Row>
//  <div className="signInButton">
//    <Button className="updateSceenNameButton teal lighten-2" waves='green' node='a' onClick={this.sendMail}>send email</Button>
//  </div>
//</div>
