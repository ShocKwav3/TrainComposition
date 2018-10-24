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
import { AutoComplete, RaisedButton } from 'material-ui'
import { Steps } from 'antd'
const Step = Steps.Step

import Topbar from './Topbar'


class App extends Component {
  constructor() {
    super()
    this.state = {
      trainData: [],
      stationToShow: "SLO",
      currentStationName: "Salo",
      stationsAndShortNames: [],
      iputStationValue: '',
    }
  }

  componentDidMount = () => {
    const { props, state } = this

    //fetch and store station names
    props.fetchTrainStations()

    //fetch default
    props.fetchTrainsPerStation(state.stationToShow)
  }

  updateSelectedStation = (text) => {
    this.setState({
      iputStationValue: text
    })
  }

  newStation = () => {
    const { props, state } = this
    const inputStation = state.iputStationValue
    
    if(props.allStationNames.includes(inputStation)){
      const stationToShow = _.findKey(props.stations, {stationName: inputStation})

      this.setState({
        stationToShow,
        currentStationName: inputStation,
      })

      props.fetchTrainsPerStation(stationToShow)
    }
  }

  individualTrainCards = (item, trainData, stationToShow) => (
    <Card color={moment().toDate() > moment(trainData.scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"} raised className="width_100 margin_10_0">
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
  )

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
    const { state, props, trainSpecificDetails, newStation, updateSelectedStation } = this
 
    return(
      <div>
        <MuiThemeProvider>
          <div>
          <Topbar {...props} />
          <div className="container">
            <div className="main">
              <Segment raised loading={props.spinner}>
                <div>
                  <Label color="blue" ribbon>
                    { state.currentStationName }
                  </Label>
                  <AutoComplete hintText="Enter Station"
                                dataSource={props.allStationNames}
                                filter={AutoComplete.caseInsensitiveFilter}
                                onUpdateInput={updateSelectedStation}
                                id="station" />
                  <RaisedButton label="Search"
                                primary={true}
                                onTouchTap={newStation}
                                className="button_s_search" />
                  {state.iputStationValue.length > 0 && !props.allStationNames.includes(state.iputStationValue) && 'Please provide full station name!'}
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