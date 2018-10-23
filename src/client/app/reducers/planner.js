import { plannerActionTypes } from '../actions/plannerActions'


export const plannerFrom = (state=[], action) => {
  switch(action.type){
    case plannerActionTypes.FETCH_STATION_FROM_SUCCESS:
      return action.payload
    default:
      return state
  }
}