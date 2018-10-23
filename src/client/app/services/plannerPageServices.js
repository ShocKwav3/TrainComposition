import { trainStationsActions } from '../actions/trainStations'
import { apiCallsServices } from './apiCalls'
import { constructIndexedData } from '../utils/'
import { plannerActions } from '../actions/plannerActions'


const fetchAllStations = () => (dispatch) => {
  dispatch(trainStationsActions.fetchAllStations)
  dispatch(apiCallsServices.getStationNames())
}

const fetchAllStationsSucess = (data) => (dispatch) => {
  const stations = constructIndexedData(data, 'stationShortCode', ['stationName', 'stationShortCode'])
  dispatch(trainStationsActions.fetchSucess(stations))
}

const fetchTrainsPerStation = (station, planner) => (dispatch) => {
  if(planner){
    dispatch(plannerActions.plannerFrom)
    dispatch(apiCallsServices.getStationData(station, planner))
  } else {
    dispatch(trainStationsActions.fetchTrainsPerStation)
    dispatch(apiCallsServices.getStationData(station))
  }
}

const fetchTrainsPerStationSuccess = (data, planner) => (dispatch) => {
  if(planner){
    dispatch(plannerActions.plannerFromSuccess(data))
  } else {
    dispatch(trainStationsActions.fetchTrainsPerStationSuccess(data))
  }
}

export const plannerPageServices = {
  fetchAllStations,
  fetchAllStationsSucess,
  fetchTrainsPerStation,
  fetchTrainsPerStationSuccess,
}