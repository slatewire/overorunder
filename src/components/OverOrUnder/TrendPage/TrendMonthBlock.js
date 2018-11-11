import React, { Component } from 'react';
import TrendMonth from './TrendMonth';
import '../../App/App.css';

class TrendMonthBlock extends Component {

  render() {
    return (
      <div key={this.props.passedData.index}>
        <p className={this.props.passedData.pPercent}>{this.props.passedData.monthName} {this.props.passedData.percent}%</p>
        <p><span className="pGreen">{this.props.passedData.month.over}</span> / <span className="pRed">{this.props.passedData.month.under}</span></p>
        <div className="trend">
          <div className='trendDiv'>
            <table className="centered">

              <TrendMonth key={this.props.passedData.index} month={this.props.passedData.month} habitName={this.props.passedData.habitName} modalTrendArray={this.props.modalTrendArray} handleHabitDateUpdate={this.props.passedData.handleHabitDateUpdate} />

            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TrendMonthBlock;
