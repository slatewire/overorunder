import React, { Component } from 'react';

class Trend extends Component {
  render() {
    return (
      <div className="trend">
        <div className='trendDiv'>
          <table className="centered responsice-table">
            <tbody>
              <tr>
                <td><div className={this.props.daysAgo7}></div></td>
                <td><div className={this.props.daysAgo6}></div></td>
                <td><div className={this.props.daysAgo5}></div></td>
                <td><div className={this.props.daysAgo4}></div></td>
                <td><div className={this.props.daysAgo3}></div></td>
                <td><div className={this.props.daysAgo2}></div></td>
                <td><div className={this.props.daysAgo1}></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Trend;
