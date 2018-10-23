import { trainStationsActionTypes } from '../actions/trainStations'


export const spinner = (state=false, action) => {
  switch(action.type){
    case trainStationsActionTypes.FETCH_ALL:
    case trainStationsActionTypes.FETCH_TRAINS_PER_STATION:
      return true
    case trainStationsActionTypes.FETCH_ALL_SUCCESS:
    case trainStationsActionTypes.FETCH_TRAINS_PER_STATION_SUCCESS:
      return false
    default:
      return state
  }
}