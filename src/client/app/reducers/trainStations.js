import { trainStationsActionTypes } from '../actions/trainStations'


export const trainStations = (state=[], action) => {
  switch(action.type){
    case trainStationsActionTypes.FETCH_ALL_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export const selectedStation = (state=[], action) => {
  switch(action.type){
    case trainStationsActionTypes.FETCH_TRAINS_PER_STATION_SUCCESS:
        return action.payload
      default:
        return state
  }
}