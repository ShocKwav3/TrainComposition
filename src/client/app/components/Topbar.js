import React, { Component }from 'react'

import Dialog from 'material-ui/Dialog'
import Snackbar from 'material-ui/Snackbar'

import { Timeline } from 'antd'

import axios from 'axios'
import _ from 'lodash'

import moment from 'moment'

import { Card, Popup, Divider, Segment, Label } from 'semantic-ui-react'
import { AutoComplete, FlatButton, RaisedButton } from 'material-ui'

class Topbar extends Component {
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

  filterResult = (trainData) => {
    let trainsToCatch = trainData.filter((item) => {
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

  openDialog = () => {
    const { state, props } = this
    let fromValue = document.getElementById('from').value;
    let from = _.findKey(props.stations, {stationName: fromValue})

    let toValue = document.getElementById('to').value;
    let to = _.findKey(props.stations, {stationName: toValue})

    props.fetchTrainsPerStation(from, true)

    //this.filterResult(props.plannerFrom)

    this.setState({
      openDialog: true,
      fromSearch: from,
      toSearch: to,
    })
  }


  render () {
    const { state, props, openDialog } = this
    console.log("THE STATE", state.result)

    let resultComponent = state.result.length > 0 ? state.result.map((item, i) => {
      let scheduledTime = item.timeTableRows.map((elem) => {
        if(elem.stationShortCode==this.state.fromSearch && elem.type=="DEPARTURE"){
          return elem.scheduledTime;
        }
      });
      let time = moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate().toLocaleString();
      //console.log(scheduledTime);
      return <Timeline.Item color={moment().toDate() > moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"}key={i}>{`${i+1} - ${item.trainType + item.trainNumber} - ${time}`}</Timeline.Item>;
    }) : null

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.closeBox}
        keyboardFocused={true}
      />
    ];
    return (
      <div className="top_bar">
        <Segment>
          <div className="container top_bar_inner">
          <Dialog
          title={'CHILL'}
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          //onRequestClose={this.handleClose}
        >
          <Timeline>
            {resultComponent}
          </Timeline>
        </Dialog>
            <AutoComplete hintText="From"
                          dataSource={props.stationShortCodes}
                          filter={AutoComplete.caseInsensitiveFilter}
                          id="from" />
            <AutoComplete hintText="To"
                          dataSource={props.stationShortCodes}
                          filter={AutoComplete.caseInsensitiveFilter}
                          id="to" />
            <FlatButton label="Find Trains"
                        primary={true}
                        onTouchTap={openDialog}
                        keyboardFocused={true} />
            { /*state.dialogOpenState?prompt:"Search for Routes"*/ }
          </div>
        </Segment>
      </div>
    )
  }
}

export default Topbar