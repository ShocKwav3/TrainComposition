import moment from 'moment'
import _ from 'lodash'


export const prepareTrainsDataForView = (item, stationToShow) => {
  let loco = item.specificDetails.journeySections?Object.values(item.specificDetails.journeySections[0].locomotives[0]).filter((item, i) => {return i!=0;}).join(' '):item.specificDetails.errorMessage
  let wagons = item.specificDetails.journeySections?_.map(item.specificDetails.journeySections[0].wagons, _.property('wagonType')).join(', '):item.specificDetails.errorMessage
  let maxSpeed = item.specificDetails.journeySections?item.specificDetails.journeySections[0].maximumSpeed:item.specificDetails.errorMessage
  let length = item.specificDetails.journeySections?item.specificDetails.journeySections[0].totalLength:item.specificDetails.errorMessage
  let origin = item.specificDetails.journeySections?item.specificDetails.journeySections[0].beginTimeTableRow.stationShortCode:item.train.timeTableRows[0].stationShortCode
  let destination = item.specificDetails.journeySections?item.specificDetails.journeySections[0].endTimeTableRow.stationShortCode:_.last(item.train.timeTableRows).stationShortCode
  let timeTable = item.train.timeTableRows
  let scheduledTime = item.train.timeTableRows.map((elem) => {
    if(elem.stationShortCode==stationToShow && elem.type=="DEPARTURE"){
      return elem.scheduledTime
    }
  })
  let RunningOrNot = item.train.runningCurrently?"Running":"Not Running"
  let originTime = moment(item.train.timeTableRows[0].scheduledTime, "YYYY-MM-DDTHH:mm:ss").toDate()
  let destinationTime = moment(_.last(item.train.timeTableRows).scheduledTime, "YYYY-MM-DDTHH:mm:ss").toDate()
  let time = moment(scheduledTime, 'YYYY-MM-DDTHH:mm:ss').format("MMM D hh:mm a")

  return {
    loco,
    wagons,
    maxSpeed,
    length,
    origin,
    destination,
    timeTable,
    RunningOrNot,
    originTime,
    destinationTime,
    time,
    scheduledTime,
  }
}

export const filterResult = (trainData, fromSearch, toSearch) => (
  trainData.filter((item) => {
    let fromTime = _.result(_.find(item.train.timeTableRows, {'stationShortCode': fromSearch, 'type': 'DEPARTURE' }), 'scheduledTime');
    let toTime = _.result(_.find(item.train.timeTableRows, {'stationShortCode': toSearch }), 'scheduledTime');
    
    return fromTime < toTime
  })
)