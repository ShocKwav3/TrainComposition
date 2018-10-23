import { combineReducers } from 'redux'
import { trainStations, selectedStation } from './trainStations'
import { spinner } from './spinners'
import { plannerFrom } from './planner'


const allReducers = combineReducers({
  trainStations,
  selectedStation,
  spinner,
  plannerFrom,
})


export default allReducers