import React from 'react';
import { Button, Icon } from 'react-materialize'
import '../App/App.css';

class Home extends React.Component {

  async componentWillMount() {

    // check token, if valid user redirect to Dashboard
    let isAuthed = sessionStorage.getItem('isAuthed');
    if(isAuthed) {
      const { history } = this.props
      history.replace('/overorunder');
    } else {
      let myToken = localStorage.getItem('overUnderToken');
      if(myToken) {

        let url = 'http://localhost:8080/api/validate/';

        if (process.env.REACT_APP_ENV === 'dev') {
          url = 'http://localhost:8080/api/validate/';
        } else if (process.env.REACT_APP_ENV === 'prod') {
          url = 'http://api.overorunder.io/api/validate';
        } else {
          url = 'http://localhost:8080/api/validate/';
        }

        // call the API to see if valid
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="teal-text text-lighten-2">Over</h1>
          <hr className="HeaderLine" ></hr>
          <h1 className="deep-orange-text text-accent-3">Under</h1>
        </header>
        <p className="flow-text">
          The social habit tracking game.
        </p>
        <div className="bottomDiv">
        <Button className="goButton teal lighten-2" waves='green' node='a' href='/signin'>get started<Icon right>send</Icon></Button>

        </div>
      </div>
    );
  }
}

export default Home;
