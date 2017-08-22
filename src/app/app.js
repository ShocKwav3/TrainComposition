import React, { Component } from 'react';

import Prompt from './prompt';

import '../assets/css/app.scss';
import 'bootstrap/dist/css/bootstrap.css';
//import Prompt from './prompt.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
//import Chip from 'material-ui/Chip';

import 'semantic-ui-css/semantic.min.css';
import { Card, Popup, Divider, Segment, Label } from 'semantic-ui-react';

import 'antd/dist/antd.min.css';
import { Steps } from 'antd';
const Step = Steps.Step;

import axios from 'axios';

import _ from 'lodash';
import moment from 'moment';


class App extends Component {
  constructor() {
    super();
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
      load: true,
      stationsAndShortNames: [],
    };
  }

  componentDidMount = () => {
    //fetch and store station names
    axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations')
    .then((response) => {
      //console.log(response.data);
      this.setState({
        dataSourceStations: _.map(response.data, _.property('stationName')),
        stationsAndShortNames: response.data.map(({stationName, stationShortCode}) => ({stationName, stationShortCode})),
      }, () => {console.log(this.state.stationsAndShortNames);});
    })
    .catch((error) => {
      console.log(error);
    });
    this.getStationData(); //initiate data fetching from api
  }
  getStationData = () => {
    //console.log('Fetching Station Data...');
    //fetching train composition for a perticular station
    let apiLink = 'https://rata.digitraffic.fi/api/v1/live-trains';
    axios.get(apiLink, {
      params:{
        station: this.state.stationToShow,
      }
    })
    .then((response) => {
      const trainData = response.data;

      // For each train, fetching specific details
      const promises = trainData.map((train, i) => {
        return this.getSpecificTrainDetails(train.trainNumber, train.departureDate)
        .then((trainResponse) => {
        // Create a new object with both
        // item's regular data and it's specific data
          return {
            idx: i,
            train,
            specificDetails: trainResponse.data
          };
        });
      });
    // Await on all promises
    return Promise.all(promises);
    }).then((trainsData) => {
      // all results fetched, update state
      this.setState({
        trainData: trainsData,
        load: false,
      });
    }).catch((error) => {
      console.log(error);
    });
  }
  
  getSpecificTrainDetails = (trainNum, date) => {
    //gets trains details based on provided train number and date
    let apiLink = "https://rata.digitraffic.fi/api/v1/compositions/";
    let apiConstructedLink = apiLink + trainNum + "?departure_date=" + date;

    return axios.get(apiConstructedLink)
    .then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
  }

  newStation = () => {
    //console.log(value);
    let value = document.getElementById('station').value;
    if(value!=""){
      let stationToShow = this.state.stationsAndShortNames.filter((item) => {
        return item.stationName===value;
      });
      //console.log(stationToShow[0].stationShortCode);
    this.setState({
      stationToShow: stationToShow[0].stationShortCode,
      shouldRender: true,
      load: true,
      currentStationName: value,
    }, () => {this.getStationData();});
    //console.log(this.state.stationToShow);
    }
  }

  openDialog = () => {
    let fromValue = document.getElementById('from').value;
    let from = this.state.stationsAndShortNames.filter((item) => {
      return item.stationName===fromValue;
    });
    //console.log(from);
    let toValue = document.getElementById('to').value;
    let to = this.state.stationsAndShortNames.filter((item) => {
      return item.stationName===toValue;
    });
    //console.log(to);
    this.setState({
      dialogOpenState: true,
      fromSearch: from[0].stationShortCode,
      toSearch: to[0].stationShortCode,
      load: true,
    });
  }

  closeDialog = (confirmation) => {
    this.setState({
      dialogOpenState: confirmation,
      load: false,
    });
  }

  render () {
    let prompt = <Prompt openState={this.state.dialogOpenState} fromValue={this.state.fromSearch} toValue={this.state.toSearch} handleCloseDialog = {(confirmation) => {this.closeDialog(confirmation);}}/>;
    //console.log(__dirname);
    /*if(this.state.shouldRender){
      this.setState({
        shouldRender: false,
      });
      this.getStationData();
    }*/
    let content = this.state.trainData.map((item) => {
      let loco = item.specificDetails.journeySections?Object.values(item.specificDetails.journeySections[0].locomotives[0]).filter((item, i) => {return i!=0;}).join(' '):item.specificDetails.errorMessage;
      let wagons = item.specificDetails.journeySections?_.map(item.specificDetails.journeySections[0].wagons, _.property('wagonType')).join(', '):item.specificDetails.errorMessage;
      let maxSpeed = item.specificDetails.journeySections?item.specificDetails.journeySections[0].maximumSpeed:item.specificDetails.errorMessage;
      let length = item.specificDetails.journeySections?item.specificDetails.journeySections[0].totalLength:item.specificDetails.errorMessage;
      let origin = item.specificDetails.journeySections?item.specificDetails.journeySections[0].beginTimeTableRow.stationShortCode:item.train.timeTableRows[0].stationShortCode;
      let destination = item.specificDetails.journeySections?item.specificDetails.journeySections[0].endTimeTableRow.stationShortCode:_.last(item.train.timeTableRows).stationShortCode;
      let timeTable = item.train.timeTableRows;
      let scheduledTime = item.train.timeTableRows.map((elem) => {
        if(elem.stationShortCode==this.state.stationToShow && elem.type=="DEPARTURE"){
          return elem.scheduledTime;
        }
      });
      let RunningOrNot = item.train.runningCurrently?"Running":"Not Running";
      //console.log(scheduledTime);
      let originTime = moment(item.train.timeTableRows[0].scheduledTime, "YYYY-MM-DDTHH:mm:ss").toDate();
      //console.log(originTime);
      let destinationTime = moment(_.last(item.train.timeTableRows).scheduledTime, "YYYY-MM-DDTHH:mm:ss").toDate();
      //console.log(destinationTime);
      let time = moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').format("MMM D hh:mm a");//.toDate().toLocaleString();
      //console.log(moment().toDate() > moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate());
      //console.log(moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate().getDate());
      //console.log(time);
      return <div className="col-md-4" key={item.idx}><Popup wide
              trigger={<Card color={moment().toDate() > moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"red":"green"} raised className="width_100 margin_10_0">
                <Card.Header>
                  <div className="card_header_left padding_5_10">
                  {`${item.idx}.${item.train.timeTableRows[0].stationShortCode} - ${_.last(item.train.timeTableRows).stationShortCode}`}
                  </div>
                  <div className="card_header_right padding_5_10">{RunningOrNot}</div>
                </Card.Header>
                <Card.Meta className="padding_0_10">
                  {item.train.trainType + item.train.trainNumber}
                </Card.Meta>
                <Card.Content extra>
                  <Steps size="small" current={1}>
                    <Step status={moment().toDate() > originTime?"finish":"wait"} title={origin} />
                    <Step status={moment().toDate() > moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').toDate()?"error":"process"} title={this.state.stationToShow} description={time=="Invalid date"?"Last Stop":time}/>
                    <Step status={moment().toDate() > destinationTime?"finish":"wait"} title={origin==destination?timeTable.reverse()[1].stationShortCode:_.last(item.train.timeTableRows).stationShortCode} />
                  </Steps>
                </Card.Content>
              </Card>}
              on='click'
              hideOnScroll
            >
              {`Locomotive:${loco}`}
              <Divider/>
              {`Wagons:${wagons}`}
              <Divider/>
              {`Maximum Speed:${maxSpeed}`}
              <Divider/>
              {`Total Length:${length}`}
              <Divider/>
            </Popup></div>;
    });
    return(
      <div>
      <MuiThemeProvider><div>
        <div className="top_bar">
        <Segment>
        <div className="container top_bar_inner">
          <AutoComplete
          hintText="From"
          dataSource={this.state.dataSourceStations}
          filter={AutoComplete.caseInsensitiveFilter}
          id="from"
          />
          <AutoComplete
          hintText="To"
          dataSource={this.state.dataSourceStations}
          filter={AutoComplete.caseInsensitiveFilter}
          id="to"
          />
          <FlatButton
          label="Find Trains"
          primary={true}
          onTouchTap={this.openDialog}
          keyboardFocused={true}
          />
          {this.state.dialogOpenState?prompt:"Search for Routes"}
        </div>
        </Segment>
        </div>
        <div className="container">
        <div className="main">
      <Segment raised loading={this.state.load}><div>
        <Label color="blue" ribbon>
          {this.state.currentStationName}
        </Label>
        <AutoComplete
          hintText="Enter Station"
          dataSource={this.state.dataSourceStations}
          filter={AutoComplete.caseInsensitiveFilter}
          id="station"
        />
        <RaisedButton
          label="Search"
          primary={true}
          onTouchTap={this.newStation}
          className="button_s_search"
        />
        <Divider/>
          <div className="row">
            {content}
          </div>
      </div>
      </Segment>
      </div>
      </div></div>
        </MuiThemeProvider>
      </div>
    );

  }

}

export default App;
