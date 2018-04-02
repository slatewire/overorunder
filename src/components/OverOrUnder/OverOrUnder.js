import React, { Component } from 'react';
import { Button } from 'react-materialize'
import  HabitScreen from './HabitScreen'
import Dashboard from '../Dashboard/Dashboard'
import '../App/App.css';

// array of ProfileActivity

class OverOrUnder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myScreen: 'habitScreen',
      habits: [],
      currentHabit: '',
      myToken: ''
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleMenuButton = this.handleMenuButton.bind(this);
    this.handleHabitDateUpdate = this.handleHabitDateUpdate.bind(this);
  }

  async handleHabitDateUpdate (habit, date, oldState, newState) {

    // call update on api
const myToken = localStorage.getItem('overUnderToken');

const authUrl = 'http://localhost:8080/api/updateDateState';
try {
  let response = await fetch(authUrl, {
    method: 'POST',
    body: JSON.stringify({habit: habit,
                          date: date,
                          newState: newState}),
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


      // one day record if update and do store/update stuff

    if (oldState === newState){
      // we are doing to do nothing
    } else {

      let newHabits = this.state.habits;
      let habitIndex = null;
      let datesIndex = null;

      this.state.habits.forEach(function(element, index){
        if (element.name === habit) {
          habitIndex = index;
          element.dates.forEach(function(theDate, index){
            if (theDate.date === date) {
              datesIndex = index;
            }
          });
        }
      });

      // if habit or date index are null we should error.

      if(newState === 'good') {
        if(oldState === 'notSet') {  // notSet to good
          newHabits[habitIndex].notSet = newHabits[habitIndex].notSet - 1;
          newHabits[habitIndex].over = newHabits[habitIndex].over + 1;
        } else { // it is bad to good
          newHabits[habitIndex].under = newHabits[habitIndex].under -1;
          newHabits[habitIndex].over = newHabits[habitIndex].over + 1;
        }
      } else {  // it is bad state
        if(oldState === 'notSet') { // notSet to Bad
          newHabits[habitIndex].notSet = newHabits[habitIndex].notSet - 1;
          newHabits[habitIndex].under = newHabits[habitIndex].under + 1;
        } else { // good to bad
          newHabits[habitIndex].over = newHabits[habitIndex].over - 1;
          newHabits[habitIndex].under = newHabits[habitIndex].under + 1;
        }
      }
      newHabits[habitIndex].dates[datesIndex].dateState = newState;


      this.setState({habits: newHabits});
    }
  }

  componentWillMount() {
    let isAuthed = sessionStorage.getItem('isAuthed');
    if(!isAuthed) {
      const { history } = this.props
      history.replace('/');
    } else {
      // could do extra defensive here!

      const thisToken = localStorage.getItem('overUnderToken')
      this.setState({myToken: thisToken});
      // get data, if fail (no user , then sign thm out maybe)
      this.handleGetData();

    }
  }

  handleSignOut () {
    sessionStorage.removeItem('isAuthed');
    localStorage.removeItem('overUnderToken');

    const { history } = this.props
    history.push('/');

  }

  handleMenuButton () {

    let newState = '';
    const currentState = this.state.myScreen;

    if (currentState === 'habitScreen') {
      newState =  "dashboardScreen";
    } else if (currentState === 'dashboardScreen') {
      newState = "habitScreen";
    } else if (currentState === 'habitDetails') {
      newState = "dashboardScreen";
    } else {
      // we have a real problem with state
    }

    this.setState({myScreen: newState});

  }

  handleGetData () {

    const myToken = localStorage.getItem('overUnderToken');

    return fetch(`http://localhost:8080/api/userData/`, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        "x-access-token": myToken
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      // TURN THE RESPONSE INTO MY DATA
      let habitIndex = null;
      jsonResponse.habits.forEach(function(element, index){
        if (element.default) {
          habitIndex = index;
        }
      });


      this.setState({habits: jsonResponse.habits});
      this.setState({currentHabit: jsonResponse.habits[habitIndex].name});
    });

// CREATE FAKE DATA RETURNED TO BUILD FRONT trendDiv



  }


  render() {

    const thisScreen = this.state.myScreen;
    let componentToShow = null;
    let menuButton = null;

    if (thisScreen === "habitScreen") {

      // if this currentHabit === "" we have no data so show  the load myScreen
      // when the default updates the state reder will be redrawn

      // find the habit
      let currentHabit = this.state.currentHabit;
      let habitObject = null;

      if (currentHabit === '') {
        componentToShow = <p>loading the darn data</p>
      } else {


        this.state.habits.forEach(function(thisElement){
          if (thisElement.name === currentHabit) {
            habitObject = thisElement;
          }
        });


        componentToShow = <HabitScreen habitData={habitObject} handleHabitDateUpdate={this.handleHabitDateUpdate}/>
        menuButton = <Button floating  className='teal lighten-2' waves='light' icon='menu' onClick={this.handleMenuButton}/>

      }
    } else if (thisScreen === "dashboardScreen") {
      componentToShow = <Dashboard handleSignOut={this.handleSignOut}/>
      menuButton = <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton}/>
    }

    return (
      <div>
        {componentToShow}
        <div className="bottomDiv">
          {menuButton}
        </div>
      </div>
    );
  }
}

export default OverOrUnder;
