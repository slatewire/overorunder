import React, { Component } from 'react';
import TrendWeek from './TrendWeek';
//import ModalButtons from './ModalButtons';
//import { Modal } from 'react-materialize';
import '../../App/App.css';

class TrendMonth extends Component {

  render() {
    return (
        <tbody>
          {
            this.props.month.weeks.map((thisMonth, index) => {
              return (
                  <TrendWeek key={index} week={thisMonth}  />
              );
            })
        }
      </tbody>
    );
  }
}

export default TrendMonth;

//<Modal bottomSheet key={index}
//  trigger={<button className="trendButton">
//            <TrendWeek key={index} week={thisMonth} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate} />
//          </button>}>
//  <p>update your past 14 days</p>
//  <div className="trendDiv">
//    <ModalButtons modalTrendArray={this.props.modalTrendArray} handleHabitDateUpdate={this.props.handleHabitDateUpdate} habitName={this.props.habitName} />
//  </div>
//</Modal>
