import React, { Component } from 'react';
import moment from 'moment'
import './Date.css'
import classNames from 'classnames'

class Date extends Component{
  constructor(props) {
      super(props);
      this.state = {
        reserved: this.props.reserved,
        loading: false,
      };
    }
    //if date is bookable, it sends a put request to server and changes the components state to reflect the change to the user
    bookDate = () => {
      if(this.props.grey || this.props.sunday){
        return
      }
      this.setState({loading:true})
      let url = "http://localhost:3000/reserved/"  + moment(this.props.date).format('YYYY-MM-DD')
      fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          "reserved":!this.state.reserved
        }),
      }).then((res)=> res.json()).then(
        (result)=>{
          this.setState(prevState => ({
            reserved:!prevState.reserved,
            loading:false
      }))
    },
    (error)=>this.bookDate())
    }


  render(){
    return(
      <div className={classNames( this.props.grey?"grey":null, this.props.sunday?"sunday":null, "cell", this.state.reserved?"booked":"free")} onClick={this.bookDate}>
      {this.state.loading?
        <img src={require('./Images/loading.gif')} alt="loading..." className="loadingCell" height="30px"/>:
        <div>
        <h1 className="date">
          {moment(this.props.date).format('DD')}
        </h1>
        <h1 className="mobileDate">
        {moment(this.props.date).format('dddd, MMMM Do')}
        </h1>
        </div>
    }
    </div>
    );
  }
}


export default Date;
