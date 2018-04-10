import React, { Component } from 'react';

class Trend extends Component {
  render() {

console.log("days ago 1 ", this.props.daysAgo1);
console.log("days ago 2 ", this.props.daysAgo2);

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
