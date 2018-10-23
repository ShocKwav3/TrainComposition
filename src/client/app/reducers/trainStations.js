import { trainStationsActionTypes } from '../actions/trainStations'


export const trainStations = (state=[], action) => {
  console.log("CAMEHERE", action)
  switch(action.type){
    case trainStationsActionTypes.FETCH_ALL_SUCCESS:
      console.log("AAAAANNNNDDD HHHEERE")
      return action.payload
    default:
      return state
  }
}

export const selectedStation = (state=[], action) => {
  console.log("ALSO HERE")
  switch(action.type){
    case trainStationsActionTypes.FETCH_TRAINS_PER_STATION_SUCCESS:
      console.log("AAANNND ALLSO HEREEE")
        return action.payload
      default:
        return state
  }
}