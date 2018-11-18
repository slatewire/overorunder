import React, { Component } from 'react';

class LeagueSmall extends Component {
  render() {

    let myPos = 1;
    let firstPos = 1;
    let lastPos = 3;

    this.props.league.forEach(function(leagueEntry, index){
      if (leagueEntry.me){
        myPos = leagueEntry.pos;
        if (myPos === 1) {
          firstPos = 1;
          lastPos = 3;
        } else {
          firstPos = myPos - 1;
          lastPos = myPos + 1;
        }
      }
    });

    return (
      <div className='tableOuter'>
        <button className="trendButton" onClick={this.props.handleLeagueScreenButton}>
        <div className='tableInner'>
          <table className="leagueSmall">
            <thead>
              <tr>
                <th><p>Rank</p></th>
                <th><p>Name</p></th>
                <th><p>Score</p></th>
              </tr>
            </thead>
            <tbody>

              {
                this.props.league.map((leagueRow, index) => {
                  if (leagueRow.pos >= firstPos && leagueRow.pos <= lastPos) {
                    let posToShow = <td className="leagueEntry"><p>{leagueRow.pos}</p></td>
                    if (leagueRow.move === "up") {
                      posToShow = <td className="leagueEntry"><p className='leaguePosColourUp'>{leagueRow.pos}</p></td>
                    } else if (leagueRow.move === "down"){
                      posToShow = <td className="leagueEntry"><p className='leaguePosColourDown'>{leagueRow.pos}</p></td>
                    }


                    if(leagueRow.me) {
                      return (
                        <tr key={index} bgcolor="e0e0e0">
                          {posToShow}
                          <td className="leagueEntry"><p>{leagueRow.name}</p></td>
                          <td className="leagueEntry"><p>{leagueRow.score}</p></td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={index}>
                          {posToShow}
                          <td className="leagueEntry"><p>{leagueRow.name}</p></td>
                          <td className="leagueEntry"><p>{leagueRow.score}</p></td>
                        </tr>
                      );
                    } // end of else
                  }
                  return null;
                })
              }

            </tbody>
          </table>
        </div>
        </button>
      </div>
    );
  }
}

export default LeagueSmall;
