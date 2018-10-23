export const trainStationsActionTypes = {
  FETCH_ALL: 'trainStations/FETCH_ALL_STATIONS',
  FETCH_ALL_SUCCESS: 'trainStations/FETCH_ALL_STATIONS_SUCCESS',

  FETCH_TRAINS_PER_STATION: 'trainStations/FETCH_TRAINS_PER_STATION',
  FETCH_TRAINS_PER_STATION_SUCCESS: 'trainStations/FETCH_TRAINS_PER_STATION_SUCCESS',
}

const fetchAllStations = ({
  type: trainStationsActionTypes.FETCH_ALL,
})

const fetchSucess = (payload) => ({
  type: trainStationsActionTypes.FETCH_ALL_SUCCESS,
  payload,
})

const fetchTrainsPerStation = ({
  type: trainStationsActionTypes.FETCH_TRAINS_PER_STATION,
})

const fetchTrainsPerStationSuccess = (payload) => ({
  type: trainStationsActionTypes.FETCH_TRAINS_PER_STATION_SUCCESS,
  payload,
})

export const trainStationsActions = {
  fetchAllStations,
  fetchSucess,
  fetchTrainsPerStation,
  fetchTrainsPerStationSuccess,
}