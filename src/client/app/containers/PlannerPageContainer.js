import { connect } from 'react-redux'
import PlannerPage from '../components/PlannerPage'
import { plannerPageServices } from '../services/plannerPageServices'
import { constructArrayOfSelectedValues } from '../utils/'


const mapStateToProps = (state) => {
  const stations = state.trainStations
  const stationShortCodes = constructArrayOfSelectedValues(state.trainStations, 'stationName')
  const selectedStationTrains = state.selectedStation
  const spinner = state.spinner

  return {
    spinner,
    stations,
    stationShortCodes,
    fromStation: state.plannerFrom,
    trainData: selectedStationTrains,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTrainStations: () => dispatch(plannerPageServices.fetchAllStations()),
    fetchTrainsPerStation: (station, planner) => dispatch(plannerPageServices.fetchTrainsPerStation(station, planner))
  }
}


const PlannerPageContainer = connect(mapStateToProps, mapDispatchToProps)(PlannerPage)
export default PlannerPageContainer