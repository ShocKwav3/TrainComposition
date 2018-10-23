import axios from 'axios'
import { plannerPageServices } from './plannerPageServices'


const getStationNames = () => (dispatch) => {
  const url = 'https://rata.digitraffic.fi/api/v1/metadata/stations'

  axios.get(url)
       .then(response => {
         dispatch(plannerPageServices.fetchAllStationsSucess(response.data))
       }).catch((error) => {
         console.log(error);
       })
}

const getStationData = (station, planner) => (dispatch) => {
  const url = 'https://rata.digitraffic.fi/api/v1/live-trains'

  axios.get(url, {
    params:{
      station: station,
    }
  }).then((response) => {
    const trainData = response.data

    // For each train, fetching specific details
    const promises = trainData.map((train, i) => {
      return getSpecificTrainDetails(train.trainNumber, train.departureDate)
      .then((trainResponse) => {
      // Create a new object with both
      // item's regular data and it's specific data
        return {
          idx: i,
          train,
          specificDetails: trainResponse.data
        }
      })
    })

  // Await on all promises
  return Promise.all(promises)
  }).then((trainsData) => {
    // all results fetched, dispatch action
    if(planner){
      dispatch(plannerPageServices.fetchTrainsPerStationSuccess(trainsData, planner))
    } else {
      dispatch(plannerPageServices.fetchTrainsPerStationSuccess(trainsData))
    }
  }).catch((error) => {
    console.log(error)
  })
}

const getSpecificTrainDetails = (trainNum, date) => {
  //gets trains details based on provided train number and date
  let url = 'https://rata.digitraffic.fi/api/v1/compositions/'
  let apiConstructedLink = url + trainNum + "?departure_date=" + date

  return axios.get(apiConstructedLink)
              .then((response) => {
                return response
              }).catch((error) => {
                console.log(error)
              })
}


export const apiCallsServices = {
  getStationNames,
  getStationData,
}