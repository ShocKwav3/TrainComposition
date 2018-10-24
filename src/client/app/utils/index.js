import _ from 'lodash'
import moment from 'moment'


export const constructIndexedData = (data, indexBy='id', toInclude=['name']) => (
  _.keyBy(data.map(item => _.pick(item, toInclude)), indexBy)
)

export const constructArrayOfSelectedValues = (objectSource, toPick='name') => {
  let result = []

  for(let key in objectSource){
    result.push(objectSource[key][toPick])
  }

  return result
}

export const getTime = (source, condition, targetParameter, format) => (
  moment(_.result(_.find(source, condition), targetParameter), format).toDate()
)