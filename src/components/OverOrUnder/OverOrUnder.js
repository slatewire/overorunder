import React, { Component } from 'react';
import { Button } from 'react-materialize';
import  HabitScreen from './HabitScreen';
import Dashboard from '../Dashboard/Dashboard';
import SetToday from './SetToday/SetToday';
import XoverY from './XoverY/XoverY';
import Dates from './Dates/Dates';
import moment from 'moment';
import '../App/App.css';

// array of ProfileActivity

class OverOrUnder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myScreen: 'habitScreen',
      habits: [],
      currentHabit: -1,
      myToken: '',
      lastDateIndex: -1
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleMenuButton = this.handleMenuButton.bind(this);
    this.handleHabitDateUpdate = this.handleHabitDateUpdate.bind(this);
    this.handleDatesButton = this.handleDatesButton.bind(this);
    this.handleTrendScreenButton = this.handleTrendScreenButton.bind(this);
  }

  async handleHabitDateUpdate (habit, date, oldState, newState) {

    // call update on api
    const myToken = localStorage.getItem('overUnderToken');

    let url = 'http://localhost:8080/api/updateDateState';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/updateDateState';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/updateDateState';
    } else {
      url = 'http://localhost:8080/api/updateDateState';
    }

    try {
      let response = await fetch(url, {
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
      // we are going to do nothing
    } else {

      let newHabits = this.state.habits;
      let habitIndex = null;
      let datesIndex = null;

      habitIndex = this.state.currentHabit;
      this.state.habits[habitIndex].dates.forEach(function(theDate, index){

        if (theDate.theDate === date) {
          datesIndex = index;
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
      this.setState({lastDateIndex: datesIndex});
    }

    this.forceUpdate();
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
    } else if ((currentState === 'dashboardScreen') || (currentState === "datesScreen") || (currentState === "trendScreen")) {
      newState = "habitScreen";
    } else if (currentState === 'habitDetails') {
      newState = "dashboardScreen";
    } else {
      // we have a real problem with state
    }

    this.setState({myScreen: newState});

  }

  handleTrendScreenButton () {
    this.setState({myScreen: "trendScreen"});
  }

  handleDatesButton () {
    this.setState({myScreen: "datesScreen"});
  }

  handleGetData () {

    const myToken = localStorage.getItem('overUnderToken');

    let url = 'http://localhost:8080/api/userData/';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/userData/';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/userData';
    } else {
      url = 'http://localhost:8080/api/userData/';
    }

    return fetch(url, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        "x-access-token": myToken
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      // TURN THE RESPONSE INTO MY DATA
      let habitIndex = -1;

      if(jsonResponse.habits !== null) {

        jsonResponse.habits.forEach(function(element, index){
          if (element.isDefault) {
            habitIndex = index;
          }

          let reverseDates = element.dates;
          //let datesToSave = reverseDates.reverse();
          reverseDates.reverse();
        });

        if (habitIndex !== -1) {
          this.setState({habits: jsonResponse.habits});
          this.setState({currentHabit: habitIndex});
        }
      } else {
        // somethig went wrong - do sign out till we fix interval
        this.handleSignOut();
      }
    });
  }


  render() {

    const thisScreen = this.state.myScreen;
    let componentToShow = null;
    let menuButton = null;

    if (thisScreen === "habitScreen" || thisScreen === "datesScreen" || thisScreen === "trendScreen") {
      // find the habit
      let currentHabit = this.state.currentHabit;
      let habitObject = null;

      if (currentHabit === -1) {
        componentToShow = <p>sorry for the delay, we are just loading up your data</p>
        menuButton = <Button floating  className='teal lighten-2' waves='light' icon='menu' onClick={this.handleMenuButton}/>
      } else {

        habitObject = this.state.habits[currentHabit];

  //console.log("RENDER, Date index and sateState ", this.state.lastDateIndex, " ", habitObject.dates[this.state.lastDateIndex].dateState);

        ////////////////////////////////////////////////////
        let setToday = false;
        let todayIndex = 0;
        habitObject.dates.forEach(function(element, index){

          let date = element.theDate;
          let now = moment().subtract(1, 'days');
          let nowString = now.format('YYYY-MM-DD');

          if (date === nowString) {
            todayIndex = index;
          }
        });

        if (habitObject.dates[todayIndex].dateState === "notSet") {
          setToday = true;
        }

        let monthOver = 0;
        let monthUnder = 0;

        const startDate = todayIndex + 30;

        habitObject.dates.forEach(function(element, index){

          if ((index >= todayIndex) && (index < startDate)) {
            if (element.dateState === "good") {
              monthOver = monthOver + 1;
            } else if (element.dateState === "bad") {
              monthUnder = monthUnder + 1;
            }
          }
        });

        let monthPc = 0;
        if (monthOver !== 0) {
          const monthOnePc = (monthOver + monthUnder) / 100;
          monthPc = Math.round((monthOver / monthOnePc));
        }

        /////////////////////////////////////////////////////

        if (setToday) {
            // new screen for seting today
          return (
            <div>
              <XoverY over={habitObject.over} under={habitObject.under} oldOver={habitObject.oldOver} oldUnder={habitObject.oldUnder} />
              <SetToday cardDate={habitObject.dates[todayIndex]} habitName ={habitObject.title} handleHabitDateUpdate={this.handleHabitDateUpdate}/>
            </div>
          );
            //cardDate={thisDate} habitName ={this.props.habitName}

//        } else if (thisScreen === "datesScreen") {
//          return (
//            <div>
//              <div className="headerRow">
//                <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
//              </div>
//              <DateSet datesData={habitObject.dates} habitName={habitObject.title} handleHabitDateUpdate={this.handleHabitDateUpdate}/>
//            </div>
//          );
        } else if (thisScreen === "trendScreen") {

          return (
            <div>
              <div className="headerRow">
                <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
              </div>
              <div>
                <Dates datesData={habitObject.dates} habitData={habitObject} habitName={habitObject.title} handleHabitDateUpdate={this.handleHabitDateUpdate}/>
              </div>
            </div>
          );
        } else {

          return (
            <div>
              <div className="headerRow">
                <Button floating icon='menu' waves='light' className='teal lighten-2' onClick={this.handleMenuButton}/>
              </div>
              <HabitScreen habitData={habitObject} monthPc={monthPc} handleHabitDateUpdate={this.handleHabitDateUpdate} handleTrendScreenButton={this.handleTrendScreenButton}/>
            </div>
          );
        }
      }
    } else if (thisScreen === "dashboardScreen") {

      return (
        <div>
          <div className="headerRow">
            <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
          </div>
          <Dashboard handleSignOut={this.handleSignOut}/>
        </div>
      );
    }

    return (
      <div>
        {menuButton}
        {componentToShow}
      </div>
    );
  }
}

export default OverOrUnder;
// style={{bottom: '45px', right: '24px'}}
