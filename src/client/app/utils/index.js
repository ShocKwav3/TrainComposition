import _ from 'lodash'


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