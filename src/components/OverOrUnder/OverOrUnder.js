import React, { Component } from 'react';
import { Button } from 'react-materialize';
import  HabitScreen from './HabitScreen';
import Dashboard from '../Dashboard/Dashboard';
import SetToday from './SetToday/SetToday';
import SetNewYear from './SetToday/SetNewYear';
import XoverY from './XoverY/XoverY';
import Dates from './Dates/Dates';
import StatsPage from './Percent/StatsPage/StatsPage'
import LeagueBig from './League/LeagueBig';
import moment from 'moment';
import '../App/App.css';

// array of ProfileActivity

class OverOrUnder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myScreen: 'habitScreen',
      myScreenName: "",
      leagueSwitch: true,
      habits: [],
      currentHabit: -1,
      myToken: '',
      lastDateIndex: -1,
      oldOver: 0,
      oldUnder: 0,
      league: [],
      isAdmin: false
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleScoreCalc = this.handleScoreCalc.bind(this);
    this.handleMenuButton = this.handleMenuButton.bind(this);
    this.handleHabitDateUpdate = this.handleHabitDateUpdate.bind(this);
    this.handleDatesButton = this.handleDatesButton.bind(this);
    this.handleTrendScreenButton = this.handleTrendScreenButton.bind(this);
    this.handleSetScreenName = this.handleSetScreenName.bind(this);
    this.handleSetMyScreen = this.handleSetMyScreen.bind(this);
    this.handleSetOldOver = this.handleSetOldOver.bind(this);
    this.handleSetOldUnder = this.handleSetOldUnder.bind(this);
    this.handleStatsPageButton = this.handleStatsPageButton.bind(this);
    this.handleLeagueScreenButton = this.handleLeagueScreenButton.bind(this);
    this.handleGetLeague = this.handleGetLeague.bind(this);
    this.handleStartNewYear = this.handleStartNewYear.bind(this);
    this.handleUpdateLeagueSwitch = this.handleUpdateLeagueSwitch.bind(this);
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
          // updated to update the league!!!!!!!
          this.handleGetLeague();
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
  }

  async handleStartNewYear (habit) {

    const myToken = localStorage.getItem('overUnderToken');

    let url = 'http://localhost:8080/api/resetGame';

    if (process.env.REACT_APP_ENV === 'dev') {
      url = 'http://localhost:8080/api/resetGame';
    } else if (process.env.REACT_APP_ENV === 'prod') {
      url = 'https://api.overorunder.io/api/resetGame';
    } else {
      url = 'http://localhost:8080/api/resetGame';
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({habit: habit}),
        headers: {
          "Content-type": "application/json",
          "crossDomain": true,
          "x-access-token": myToken
        }
      });
      if (response.ok) {
        let jsonResponse = await response.json();

        if(jsonResponse.success) {
          // get the new data
          this.handleGetData();
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({message: "Error from OverOrUnder"});
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
    } else if ((currentState === 'dashboardScreen') || (currentState === "datesScreen") || (currentState === "trendScreen") || (currentState === "statsScreen") || (currentState === "league")) {
      newState = "habitScreen";
    } else if ((currentState === 'habitDetails') || (currentState === "settingsScreen") || (currentState === "gamesScreen")) {
      newState = "dashboardScreen";
    } else {
      // we have a real problem with state
    }

    this.setState({myScreen: newState});

  }

  handleTrendScreenButton () {
    this.setState({myScreen: "trendScreen"});
  }

  handleStatsPageButton () {
    this.setState({myScreen: "statsScreen"});
  }

  handleDatesButton () {
    this.setState({myScreen: "datesScreen"});
  }

  handleLeagueScreenButton () {
    this.setState({myScreen: "league"});
  }

  handleSetMyScreen (newMyScreen) {
    this.setState({myScreen: newMyScreen});
  }

  handleUpdateLeagueSwitch (update) {
    this.setState({leagueSwitch: update});
  }

  handleSetScreenName (newScreenName) {
    this.setState({myScreenName: newScreenName});
  }

  handleSetOldOver (newOldOver) {
    this.setState({oldOver: newOldOver});
  }

  handleSetOldUnder (newOldUnder) {
    this.setState({oldUnder: newOldUnder});
  }

  handleScoreCalc (oldState, newState) {
    let score = 0;
    let notSet = 0;
    let level = 0;
    let over = this.state.habits[this.state.currentHabit].over;
    let under = this.state.habits[this.state.currentHabit].under;
    let now = moment();
    let nowString = now.format('YYYY-MM-DD');

    this.state.habits[this.state.currentHabit].dates.forEach(function(element, index){

      let date = element.theDate;

      if (date < nowString) {
        if (element.dateState === "notSet"){
          notSet = notSet +1;
        }
      }
    });

    if (newState === "good") {
      if (oldState === "notSet") {
        notSet = notSet -1;
        over = over +1;
      } else if (oldState === "good") {
        // do nothing
      } else {
        over = over +1;
        under = under -1;
      }
    } else {
      if (oldState === "notSet") {
        notSet = notSet -1;
        under = under +1;
      } else if (oldState === 'bad' ) {
        // do nothing
      } else {
        under = under +1;
        over = over -1;
      }
    }

    let numberSet = over + under;

    this.state.habits[this.state.currentHabit].dates.forEach(function(element, index){

      if (numberSet <= 7) {
        level = 1;
      } else if (numberSet <= 14 && numberSet > 7) {
        level = 1.15;
      } else if (numberSet <=30 && numberSet > 14) {
        level = 1.33;
      } else if (numberSet <=45 && numberSet > 30) {
        level = 1.38;
      } else if (numberSet <= 60 && numberSet > 45) {
        level = 1.44;
      } else if (numberSet <= 90 && numberSet > 60) {
        level = 1.46;
      } else if (numberSet <= 120 && numberSet > 90) {
        level = 1.48;
      } else if (numberSet <= 150 && numberSet > 120) {
        level = 1.49;
      } else if (numberSet <= 183 && numberSet > 150) {
        level = 1.5;
      } else if (numberSet <= 240 && numberSet > 183) {
        level = 1.52;
      } else if (numberSet <= 300 && numberSet > 240) {
        level = 1.54;
      } else {
        level = 1.55;
      }
  });

  // calculate and set the score

  score = Math.round((((100 / (numberSet+(notSet*1.5)))*over)*level)*100);
  //this.setState({score: score});
  return score;
}

async handleGetLeague () {
  const myToken = localStorage.getItem('overUnderToken');
  let myScore = this.handleScoreCalc("good", "good");

  let url = 'http://localhost:8080/api/leagueTable/';

  if (process.env.REACT_APP_ENV === 'dev') {
    url = 'http://localhost:8080/api/leagueTable/';
  } else if (process.env.REACT_APP_ENV === 'prod') {
    url = 'https://api.overorunder.io/api/leagueTable';
  } else {
    url = 'http://localhost:8080/api/leagueTable/';
  }

//  return fetch(url, {
//    headers: {
//      "Content-Type": 'application/x-www-form-urlencoded',
//      "x-access-token": myToken
//    }
//  }).then(response => {
//    return response.json();
//  }).then(jsonResponse => {

try {
  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({score: myScore}),
    headers: {
      "Content-type": "application/json",
      "crossDomain": true,
      "x-access-token": myToken
    }
  });
  if (response.ok) {
    let jsonResponse = await response.json();

    if(jsonResponse.success) {

      this.setState({league: jsonResponse.league});
      // this.setState({league: jsonResponse.userData.league});
      // TO DO NOT ALOT APART FROM ERROR AND QUEUEING IF NOT NETWORK
    }
  }
} catch (error) {
  console.log(error);
  this.setState({message: "Error from OverOrUnder"});
}

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

      if(jsonResponse.userData !== null) {

console.log("USER DATA: ", jsonResponse.userData);
        this.setState({myScreenName: jsonResponse.userData.screenName});
        this.setState({leagueSwitch: jsonResponse.userData.leagueSwitch});
        this.setState({isAdmin: jsonResponse.userData.admin});
        //this.setState({league: jsonResponse.userData.league});

        let oldOverScore = 0;
        let oldUnderScore = 0;

        jsonResponse.userData.habits.forEach(function(element, index){
          if (element.isDefault) {
            habitIndex = index;

            if(element.oldOver) {
              oldOverScore = element.oldOver;
            }
            if(element.oldUnder) {
              oldUnderScore = element.oldUnder;
            }
          }

          let reverseDates = element.dates;
          //let datesToSave = reverseDates.reverse();
          reverseDates.reverse();
        });

        this.setState({oldOver: oldOverScore});
        this.setState({oldUnder: oldUnderScore});

        if (habitIndex !== -1) {
          this.setState({habits: jsonResponse.userData.habits});
          this.setState({currentHabit: habitIndex});
        }
        this.handleGetLeague();
      } else {
        // somethig went wrong - do sign out till we fix interval
        this.handleSignOut();
      }
    });
  }


  render() {

console.log("The habit data: ", this.state.habits[this.state.currentHabit]);

    const thisScreen = this.state.myScreen;
    let componentToShow = null;
    let menuButton = null;

    if (thisScreen === "habitScreen" || thisScreen === "datesScreen" || thisScreen === "trendScreen" || thisScreen === "statsScreen" || thisScreen === "league") {
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
        let over = 0;
        let under = 0;
        habitObject.dates.forEach(function(element, index){

          let date = element.theDate;
          let now = moment().subtract(1, 'days');
          let nowString = now.format('YYYY-MM-DD');

          if (date === nowString) {
            todayIndex = index;
          }

          if (date < nowString) {
            if (element.dateState === "good"){
              over = over +1;
            }
            if (element.dateState === "bad") {
              under = under +1;
            }
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

        // if new year do...
        let now = moment();
        let nowString = now.format('YYYY');

        if(nowString !== habitObject.title) {

          // it is a new year!!!
         return (
            <div>
              <SetNewYear habitName ={habitObject.title} handleStartNewYear={this.handleStartNewYear}/>
            </div>
          );

        } else {

          if (setToday) {
              // new screen for seting today
            return (
              <div>
                <XoverY over={over} under={under} oldOver={habitObject.oldOver} oldUnder={habitObject.oldUnder} />
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
          } else if (thisScreen === "statsScreen") {

            let total = habitObject.dates.length;
            return (
              <div>
                <div className="headerRow">
                  <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
                </div>
                <div>
                  <StatsPage total={total} habitData={habitObject} monthPc={monthPc} over={habitObject.over} under={habitObject.under} oldOver={habitObject.oldOver} oldUnder={habitObject.oldUnder}/>
                </div>
              </div>
            );
          } else if (thisScreen === "league") {
            return (
              <div>
                <div className="headerRow">
                  <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
                </div>
                <div>
                  <LeagueBig league={this.state.league}/>
                </div>
              </div>
            );
          } else {

            return (
              <div>
                <div className="headerRow">

                </div>
                <HabitScreen habitData={habitObject} monthPc={monthPc} league={this.state.league} leagueSwitch={this.state.leagueSwitch} handleHabitDateUpdate={this.handleHabitDateUpdate} handleTrendScreenButton={this.handleTrendScreenButton} handleMenuButton={this.handleMenuButton} handleStatsPageButton={this.handleStatsPageButton} handleLeagueScreenButton={this.handleLeagueScreenButton} isAdmin={this.state.isAdmin}/>
              </div>
            );
          }
        }
      }
    } else if (thisScreen === "dashboardScreen") {

      return (
        <div>
          <div className="headerRow">
            <Button floating  className='teal lighten-2' waves='light' icon='arrow_back' onClick={this.handleMenuButton} />
          </div>
          <Dashboard handleSignOut={this.handleSignOut} myScreenName={this.state.myScreenName} leagueSwitch={this.state.leagueSwitch} handleSetScreenName={this.handleSetScreenName} handleSetMyScreen={this.handleSetMyScreen} handleUpdateLeagueSwitch={this.handleUpdateLeagueSwitch} oldOver={this.state.oldOver} oldUnder={this.state.oldUnder} handleSetOldOver={this.handleSetOldOver} handleSetOldUnder={this.handleSetOldUnder} isAdmin={this.state.isAdmin}/>
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
// button in header rom for habit screenName
//<Button floating icon='menu' waves='light' className='teal lighten-2' onClick={this.handleMenuButton}/>
