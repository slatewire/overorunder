import React, { Component } from 'react';
import { Switch, Route } from  'react-router-dom'
import './App.css';
//import Home from '../Home/Home'
import SignIn from '../SignIn/SignIn'
import OverOrUnder from '../OverOrUnder/OverOrUnder'
import Terms from '../Terms/Terms'
import Reset from '../Reset/Reset'


class App extends Component {

  render() {
    return (
      <div className ="container">
        <Switch>
          <Route exact path='/' component={SignIn}/>
          <Route exact path='/signin/' component={SignIn}/>
          <Route exact path='/terms/' component={Terms}/>
          <Route exact path='/reset/' component={Reset}/>
          <Route exact path='/overorunder/' component={OverOrUnder}/>
        </Switch>
      </div>
    );
  }
}

export default App;
