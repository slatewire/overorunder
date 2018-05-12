import React, { Component } from 'react';
import moment from 'moment'
import TrendMonth from './TrendMonth';
import '../../App/App.css';

class TrendPage extends Component {

  render() {

    // need to work out total as we no longer store it on server
    let trendIndex = 6;
    // have to work out array indexs for the 7 dates
    this.props.habitData.dates.forEach(function(element, index){

      let date = element.theDate;
      let now = moment();
      let nowString = now.format('YYYY-MM-DD');

      if (date === nowString) {
        trendIndex = index;
      }
    });


    let trendArray = this.props.habitData.dates.slice(trendIndex, (this.props.habitData.dates.length - 1));
    let thisWeek = [{dot: String, date: {}}];
    let thisMonth = [{monthName: String, weeks: [thisWeek]}]
    let fullTrend = [thisMonth];
    let lastMonth = null;

    trendArray = trendArray.reverse();

    trendArray.forEach(function(element, index) {
      //fullTrend = [];
      let day = moment(element.theDate).format('dddd');
      day = day.substring(0, 3);
      let month = moment(element.theDate).format('MMM');
      let addToLastMonth = 0;
      let addToNewMonth = 0;

      switch(day) {
        case "Mon":
          addToLastMonth = 6;
          addToNewMonth = 0;
          break;
        case "Tue":
          addToLastMonth = 5;
          addToNewMonth = 1;
          break;
        case "Wed":
          addToLastMonth = 4;
          addToNewMonth = 2;
          break;
        case "Thu":
          addToLastMonth = 3;
          addToNewMonth = 3;
          break;
        case "Fri":
          addToLastMonth = 2;
          addToNewMonth = 4;
          break;
        case "Sat":
          addToLastMonth = 1;
          addToNewMonth = 5;
          break;
        case "Sun":
          addToLastMonth = 0;
          addToNewMonth = 6;
          break;
        default:
          addToLastMonth = 0;
          addToNewMonth = 0;
      }

      // if first dates
      if (lastMonth === null) {
        lastMonth = month;

        // initialise the structures
        thisMonth = {monthName: month, weeks: []};
        thisWeek = [];

        // start first week
        for(let x = 0; x < addToNewMonth; x++) {
          thisWeek.push({dot: "b", date: element});
        }

      } else if (lastMonth !== month) {

        // end old month
        for (let i = 0; i <= addToLastMonth; i++) {
          thisWeek.push({dot: "b", date: element});
        }

        thisMonth.weeks.push(thisWeek);
        fullTrend.push(thisMonth);

        // Start new month
        lastMonth = month;
        thisMonth = {monthName: month, weeks: []};

        thisWeek = [];
        for(let x = 0; x < addToNewMonth; x++) {
          thisWeek.push({dot: "b", date: element});
          //console.log("PUSH: b ", month, day);
        }
      }



      if (thisWeek.length === 7) {
        // we have a full week
        thisMonth.weeks.push(thisWeek);
        thisWeek = [];
      }

      // add today
      let theState = "n"
      switch(element.dateState) {
        case "good":
          theState = "o";
          break;
        case "bad":
          theState = "u";
          break;
        default:
          theState = "n";
      }
      thisWeek.push({dot: theState, date: element});

      let date2 = element.theDate;
      let now2 = moment();
      let nowString2 = now2.format('YYYY-MM-DD');

      if (date2 === nowString2) {
      // last element  in array
        for (let i = 0; i < addToLastMonth; i++) {
          thisWeek.push({dot: "b", date: element});
        }

        thisMonth.weeks.push(thisWeek);
        fullTrend.push(thisMonth);
      }
    });

    //fullTrend.reverse();

    return (
      <div>
        {
          fullTrend.map((thisTrend, index) => {
            if (thisTrend.monthName !== undefined) {
              return (
                <div key={index}>
                  <p>{thisTrend.monthName}</p>
                  <div className="trend">
                    <div className='trendDiv'>
                      <table className="centered">

                        <TrendMonth key={index} month={thisTrend} habitName={this.props.habitName} handleHabitDateUpdate={this.props.handleHabitDateUpdate} />

                      </table>
                    </div>
                  </div>
                </div>
              );
            }
            return <div key={index}></div> ;
          })
        }
      </div>
    );
  }
}

export default TrendPage;