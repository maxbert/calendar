import React, { Component } from 'react';
import './App.css';
import {getAllDays, getLastSunday, getNextSaturday} from './functions.js';
import moment from 'moment'
import Date from './Date'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        month:moment(),
        reservedDates:[],
        loading:true,
        days:[],
      };
    }

    //increments month by 1
    nextMonth = () =>{
      this.setState(prevState => {
        return {month:prevState.month.add(1,'months')}
      }, this.getReservedDates)
    }

    //decrements month by 1
    prevMonth = () =>{
      this.setState(prevState =>{
        return {month:(prevState.month.subtract(1,'months'))}
      }, this.getReservedDates)
    }

    //queries api and stores a list of this monhts reserved dates in state
    getReservedDates = () =>{
      this.setState({loading:true})
      let start = moment(getLastSunday(moment(this.state.month).startOf('month'))).format('YYYY-MM-DD')
      let end = moment(getNextSaturday(moment(this.state.month).endOf('month'))).format('YYYY-MM-DD')
      let url = "http://localhost:3000/reserved/" + start  + "/" +  end

      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            if(typeof(result.payload[0]) !== "undefined"){
              let resDays = []
              for(var i = 0; i < result.payload.length; i++){
                resDays.push(moment(result.payload[i]).format('YYYY-MM-DD'))
              }
              this.setState({reservedDates:resDays})
              this.getMonthTable(this.state.month)

            }else{
              this.getMonthTable(this.state.month)

            }
          },
          (error) => {
            this.getReservedDates(this.state.month)
          }
        )
    }

    //gets all days for this month, plus filler ones to fit in the table, checks if they are reserved, creates their date object and puts them in an array of rows of 7 of Date components
    getMonthTable = () => {
      let a = getAllDays(this.state.month)
      let days = []
      let count = 0;
      for(var i = 0; i < a.length / 7; i++){
        let week = []
        for(var j = 0; j < 7; j++){
           week.push( <Date date={a[count].format('MMMM-DD-YYYY')}
                      key={a[count].format('MMMDDYYYY')}
                      grey={a[count].format('MMMM') !== this.state.month.format('MMMM')}
                      sunday = {a[count].format('e') === "0"}
                      reserved={this.state.reservedDates.indexOf(a[count].format('YYYY-MM-DD')) >= 0}/>)
           count++
        }
        days.push(<div className="row" key={i}>{week}</div>)
      }
      this.setState({days:days, loading:false})
    }

    componentDidMount(){
      this.getReservedDates()
    }

    render() {
    return (
      <div>
      <div className="header">
      <div className="prev">
        <h1 onClick={this.prevMonth} >
           &lt; {moment(this.state.month).subtract(1, 'month').format('MMMM YYYY')}
        </h1>
      </div>
      <div className="currentMonth">
        <h1>
          {this.state.month.format('MMMM YYYY')}
        </h1>
      </div>
      <div className="next">
        <h1 onClick={this.nextMonth} >
          {moment(this.state.month).add(1, 'month').format('MMMM YYYY')} &gt;
        </h1>
      </div>
      </div>
        {this.state.loading?
        <img src={require('./Images/loading.gif')} alt="loading..." className="loading" height="150px"/>:
        <div className="calendar">
          <div className="row">
            <div className="headerCell">Sunday</div>
            <div className="headerCell">Monday</div>
            <div className="headerCell">Tuesday</div>
            <div className="headerCell">Wednesday</div>
            <div className="headerCell">Thursday</div>
            <div className="headerCell">Friday</div>
            <div className="headerCell">Saturday</div>
          </div>
          {this.state.days}
        </div>
      }
      </div>
    );
  }
}

export default App;
