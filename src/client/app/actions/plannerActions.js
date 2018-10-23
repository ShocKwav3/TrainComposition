export const plannerActionTypes = {
  FETCH_STATION_FROM: 'planner/FETCH_STATION_FROM',
  FETCH_STATION_FROM_SUCCESS: 'planner/FETCH_STATION_FROM_SUCCESS'
}

const plannerFrom = ({
  type: plannerActionTypes.FETCH_STATION_FROM,
})

const plannerFromSuccess = (payload) => ({
  type: plannerActionTypes.FETCH_STATION_FROM_SUCCESS,
  payload,
})

export const plannerActions = {
  plannerFrom,
  plannerFromSuccess
}