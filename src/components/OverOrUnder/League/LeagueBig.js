import React, { Component } from 'react';

class LeagueBig extends Component {

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {

    return (
      <div className='datesContainer'>
        <div className='dateBox'>
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
                    }
                })
              }

            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default LeagueBig;
