import React, { Component }from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import _ from 'lodash'
import moment from 'moment'
import { prepareTrainsDataForView } from '../helpers/plannerPageHelpers'

import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'antd/dist/antd.min.css'
import '../../assets/css/app.scss'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Card, Popup, Divider, Segment, Label } from 'semantic-ui-react'
import { AutoComplete, FlatButton, RaisedButton } from 'material-ui'
import { Steps } from 'antd'
const Step = Steps.Step

import Prompt from './common/Prompt'


class App extends Component {
  constructor() {
    super()
    this.state = {
      dataSourceStations: [],
      trainData: [],
      specificTrainDetails: {},
      stationToShow: "SLO",
      currentStationName: "Salo",
      shouldRender: true,
      dialogOpenState: false,
      fromSearch: "",
      toSearch: "",
      load: false,
      stationsAndShortNames: [],
    }
  }

  componentDidMount = () => {
    const { props } = this

    //fetch and store station names
    props.fetchTrainStations()
  }

  newStation = () => {
    const { state, props } = this
    let value = document.getElementById('station').value;
    
    if(value!=""){
      let stationToShow = _.findKey(props.stations, {stationName: value})
      //console.log(stationToShow[0].stationShortCode);
      this.setState({
        stationToShow,
        shouldRender: true,
        load: false,
        currentStationName: value,
      });
      //console.log(this.state.stationToShow);
      props.fetchTrainsPerStation(stationToShow)
    }
  }

  openDialog = () => {
    const { state, props } = this
    let fromValue = document.getElementById('from').value;
    let from = _.findKey(props.stations, {stationName: fromValue})

    let toValue = document.getElementById('to').value;
    let to = _.findKey(props.stations, {stationName: toValue})

    this.setState({
      dialogOpenState: true,
      fromSearch: from,
      toSearch: to,
      load: true,
    });
  }

  closeDialog = (confirmation) => {
    this.setState({
      dialogOpenState: confirmation,
      load: false,
    });
  }

  individualTrainCards = (item, trainData, stationToShow) => {
    console.log("THE TIME", moment().toDate(), trainData.scheduledTime)
    return <Card color={moment().toDate() > moment(trainData.scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"} raised className="width_100 margin_10_0">
      <Card.Header>
        <div className="card_header_left padding_5_10">
          {`${item.idx}.${item.train.timeTableRows[0].stationShortCode} - ${_.last(item.train.timeTableRows).stationShortCode}`}
        </div>
        <div className="card_header_right padding_5_10">{trainData.RunningOrNot}</div>
      </Card.Header>

      <Card.Meta className="padding_0_10">
        {item.train.trainType + item.train.trainNumber}
      </Card.Meta>

      <Card.Content extra>
        <Steps size="small" current={1}>
          <Step status={moment().toDate() > trainData.originTime?"finish":"wait"} title={trainData.origin} />
          <Step status={moment().toDate() > moment(trainData.scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"error":"process"} title={stationToShow} description={trainData.time=="Invalid date"?"Last Stop":trainData.time}/>
          <Step status={moment().toDate() > trainData.destinationTime?"finish":"wait"} title={trainData.origin==trainData.destination?trainData.timeTable.reverse()[1].stationShortCode:_.last(item.train.timeTableRows).stationShortCode} />
        </Steps>
      </Card.Content>
    </Card>
  }

  trainSpecificDetails = (trainsToShow, stationToShow) => (
    trainsToShow.map((item) => {
      const trainData = prepareTrainsDataForView(item, stationToShow)
      return  <div className="col-md-4" key={item.idx}>
                <Popup wide
                       on='click'
                       hideOnScroll
                       trigger={this.individualTrainCards(item, trainData, stationToShow)}>
                  { `Locomotive:${trainData.loco}` }
                  <Divider/>
                  { `Wagons:${trainData.wagons}` }
                  <Divider/>
                  { `Maximum Speed:${trainData.maxSpeed}` }
                  <Divider/>
                  { `Total Length:${length}` }
                  <Divider/>
                </Popup>
              </div>
    })
  )

  render () {
    const { state, props, trainSpecificDetails, openDialog, newStation, closeDialog } = this

    let prompt = <Prompt openState={state.dialogOpenState}
                         fromValue={state.fromSearch}
                         toValue={state.toSearch}
                         handleCloseDialog = {(confirmation) => {closeDialog(confirmation)}} />
 
    return(
      <div>
        <MuiThemeProvider>
          <div>
          <div className="top_bar">
            <Segment>
              <div className="container top_bar_inner">
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
                { state.dialogOpenState?prompt:"Search for Routes" }
              </div>
            </Segment>
          </div>
          <div className="container">
            <div className="main">
              <Segment raised loading={props.spinner}>
                <div>
                  <Label color="blue" ribbon>
                    { state.currentStationName }
                  </Label>
                  <AutoComplete hintText="Enter Station"
                                dataSource={props.stationShortCodes}
                                filter={AutoComplete.caseInsensitiveFilter}
                                id="station" />
                  <RaisedButton label="Search"
                                primary={true}
                                onTouchTap={newStation}
                                className="button_s_search" />
                  <Divider/>
                  <div className="row">
                    { trainSpecificDetails(props.trainData, state.stationToShow) }
                  </div>
                </div>
              </Segment>
            </div>
          </div>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App