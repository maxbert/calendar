import moment from 'moment'

//gets days in the month, plus the neccesary ones before and and after to fill in the grid
export function getAllDays (date){
  let start = getLastSunday(moment(date).startOf('month'))
  let end = getNextSaturday(moment(date).endOf('month'))
  let list = []
  while(moment(start).isBefore(moment(end))){
    list.push(moment(start))
    start.add(1,'days')
  }
  return list

}

//gets the previous sunday before a given date (if the date is sunday, it reutns the given date)
export function getLastSunday(date){
  let day = moment(date)

  while(day.format('e') > 0){
    day = day.subtract(1,'days')
  }
  return day
}
//get the next Saturday after a given date
export function getNextSaturday(date){
  let day = moment(date)

  while(day.format('e') < 6){
    day = day.add(1,'days')
  }
  return day
}
