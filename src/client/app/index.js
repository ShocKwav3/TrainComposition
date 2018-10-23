import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import PlannerPageContainer from './containers/PlannerPageContainer'
import allReducers from './reducers/index'


const middlewares = [thunk, logger]

const store = createStore(
  allReducers,
  applyMiddleware(...middlewares),
)

ReactDOM.render(
  <Provider store={store}>
    <PlannerPageContainer />
  </Provider>, 
  document.getElementById('main')
)