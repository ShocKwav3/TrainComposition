import React, { Component }from 'react'

import Snackbar from 'material-ui/Snackbar'
import { Timeline } from 'antd'
import { Segment, Button, Icon } from 'semantic-ui-react'
import { AutoComplete, FlatButton } from 'material-ui'

import _ from 'lodash'
import moment from 'moment'

import { filterResult } from '../helpers/plannerPageHelpers'
import { getTime } from '../utils/'
import DialogPrompt from './common/DialogPrompt'


class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      toInput: '',
      fromInput: '',
      fromSearch: '',
      toSearch: '',
      openSnack: false,
      dialogTitle: '',
      snackMessage: '',
      autoHideDuration: 1000,
    }
  }

  closeDialog = () => {
    this.setState({
      openDialog: false,
    })
  }

  resetSnackState = () => {
    this.setState({
      openSnack: false,
    })
  }

  updateFromStation = (text) => {
    this.setState({
      fromInput: text
    })
  }

  updateToStation = (text) => {
    this.setState({
      toInput: text
    })
  }

  resetSnackState = () => {
    this.setState({
      openSnack: false,
    })
  }

  swapStations = () => {
    const { state } = this

    this.setState({
      fromInput: state.toInput,
      toInput: state.fromInput,
    })
  }

  openDialog = () => {
    const { props, state } = this
    const fromValue = state.fromInput
    const toValue = state.toInput
    
    if(props.allStationNames.includes(fromValue) && props.allStationNames.includes(toValue)){
      const from = _.findKey(props.stations, {stationName: fromValue})
      const to = _.findKey(props.stations, {stationName: toValue})
      const dialogTitle = `All Trains From ${props.stations[from].stationName} To ${props.stations[to].stationName}`

      this.setState({
        openDialog: true,
        fromSearch: from,
        toSearch: to,
        dialogTitle,
        snackMessage: 'Fetching Results',
        openSnack: true,
      })

      props.fetchTrainsPerStation(from, true)
    } else {
      this.setState({
        openSnack: true,
        snackMessage: 'Please provide full name of the station!'
      })
    }
  }

  searchResultTimeline = (data, from, to) => (
    <Timeline>
      {
        filterResult(data, from, to).map((item, i) => {
          const time = getTime(item.train.timeTableRows, {'stationShortCode': from, 'type': 'DEPARTURE' }, 'scheduledTime', 'YYYY-MM-DDTHH:mm:ss')
          const color = moment().toDate() > moment(time, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"

          return  <Timeline.Item key={i} color={color}>
                    {`${i+1} - ${item.specificDetails.trainType + item.specificDetails.trainNumber} - ${time.toLocaleString()}`}
                  </Timeline.Item>
        })
      }
    </Timeline>
  )

  render () {
    const { state, props, openDialog, searchResultTimeline, closeDialog, updateFromStation, updateToStation, resetSnackState, swapStations } = this

    return (
      <div className="top_bar">
        <Segment>
          <div className="container top_bar_inner">

            <DialogPrompt title={state.dialogTitle}
                          openDialog={state.openDialog}
                          closeDialog={() => closeDialog()}
                          toShow={searchResultTimeline(props.fromStation, state.fromSearch, state.toSearch)}/>

            <AutoComplete hintText="From"
                          searchText={state.fromInput}
                          dataSource={props.allStationNames}
                          filter={AutoComplete.caseInsensitiveFilter}
                          onUpdateInput={updateFromStation}
                          id="from" />

            <Button icon onClick={swapStations}>
              <Icon name='exchange' />
            </Button>

            <AutoComplete hintText="To"
                          searchText={state.toInput}
                          dataSource={props.allStationNames}
                          filter={AutoComplete.caseInsensitiveFilter}
                          onUpdateInput={updateToStation}
                          id="to" />
            {
              !state.openDialog ?
                <FlatButton label="Find Trains"
                            primary={true}
                            onTouchTap={openDialog}
                            keyboardFocused={true} /> : "Showing Results..."
            }

            <Snackbar open={state.openSnack}
                      message={state.snackMessage}
                      onRequestClose={resetSnackState}
                      autoHideDuration={state.autoHideDuration} />
          </div>
        </Segment>
      </div>
    )
  }
}

export default Topbar