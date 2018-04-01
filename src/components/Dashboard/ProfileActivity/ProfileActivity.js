import React, { Component } from 'react';
import '../../App/App.css';

class ProfileActivity extends Component {
  render() {
    return (
      <div>
        <p className="activityText"> <a className="teal-text text-lighten-2" href='/overorunder'>{this.props.activity}</a></p>
        <div class="row">
          <form className="col s12">
            <div className="row">
              <div className="activityDash col s7">
                <p className="reminderAlerts">reminder alerts?</p>
              </div>
              <div className="col s5">
                <div className="switch">
                  <label>Off<input type="checkbox" /> <span class="lever"></span>On</label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ProfileActivity;

//<div className="dashIcon">
//  <i class="small material-icons">edit</i>
//</div>
