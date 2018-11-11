import React, { Component } from 'react';
import UpdateButton from './UpdateButton';
//import { Button, Icon } from 'react-materialize';
import '../../App/App.css';

class ModalButtons extends Component {

  render() {
    return (
        <div>
          {
            this.props.modalTrendArray.map((thisDate, index) => {
              return (
                <div key={index}>
                  <UpdateButton key={index} thisDot={thisDate} handleHabitDateUpdate={this.props.handleHabitDateUpdate} habitName={this.props.habitName} />
                </div>
              );
          })
        }
      </div>
    );
  }
}

export default ModalButtons;
