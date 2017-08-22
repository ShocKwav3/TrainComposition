import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import { Timeline } from 'antd';

import axios from 'axios';
import _ from 'lodash';

import moment from 'moment';

class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      fromStationTrainData: [],
      fromSearch: '',
      toSearch: '',
      result: [],
      openSnack: false,
    };
  }

  componentDidMount = () => {
    //console.log(this.props.fromValue);
    this.setState({
      openDialog: this.props.openState,
      fromSearch: this.props.fromValue,
      toSearch: this.props.toValue,
      openSnack: true,
    }, () => {this.fetchResultData();});
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      openDialog: newProps.openState,
      fromSearch: newProps.fromValue,
      toSearch: newProps.toValue,
      openSnack: true,
    }, () => {this.fetchResultData();});
  }

  fetchResultData = () => {
    //console.log(this.state.fromSearch);
    let apiLink = 'https://rata.digitraffic.fi/api/v1/live-trains';
    axios.get(apiLink, {
      params:{
        station: this.state.fromSearch,
      }
    })
    .then((response) => {
      this.setState({
        fromStationTrainData: response.data,
      });
      this.filterResult();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  filterResult = () => {
    let trainsToCatch = this.state.fromStationTrainData.filter((item) => {
      let fromTime = _.result(_.find(item.timeTableRows, {'stationShortCode': this.state.fromSearch }), 'scheduledTime');
      let toTime = _.result(_.find(item.timeTableRows, {'stationShortCode': this.state.toSearch }), 'scheduledTime');
      //if(fromTime < toTime){
        //console.log(fromTime);
        //console.log(toTime);
        return fromTime < toTime;
      //}
    });
    //console.log(trainsToCatch);
    this.setState({
      result: trainsToCatch,
      //openSnack: false,
    });
  }

  closeBox = () => {
    this.setState({
      openDialog: false,
    });
    this.props.handleCloseDialog(false);
  }

  resetSnackState = () => {
    this.setState({
      openSnack: false,
    });
  }


  render () {
    let resultComponent = this.state.result.map((item, i) => {
      let scheduledTime = item.timeTableRows.map((elem) => {
        if(elem.stationShortCode==this.state.fromSearch && elem.type=="DEPARTURE"){
          return elem.scheduledTime;
        }
      });
      let time = moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate().toLocaleString();
      //console.log(scheduledTime);
      return <Timeline.Item color={moment().toDate() > moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"}key={i}>{`${i+1} - ${item.trainType + item.trainNumber} - ${time}`}</Timeline.Item>;
    });
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.closeBox}
        keyboardFocused={true}
      />
    ];
    return (
      <div>
        <Dialog
          title={this.state.fromSearch==""||this.state.toSearch==""?"Please enter stations":`Available trains from ${this.state.fromSearch} to ${this.state.toSearch}`}
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          //onRequestClose={this.handleClose}
        >
          <Timeline>
            {resultComponent}
          </Timeline>
        </Dialog>
        <Snackbar
          open={this.state.openSnack}
          message="Fetching results..."
          autoHideDuration={1000}
          onRequestClose={this.resetSnackState}
        />
      </div>
    );
  }
}

export default Prompt;
