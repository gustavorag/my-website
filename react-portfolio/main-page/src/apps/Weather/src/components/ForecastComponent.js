import React, { Component } from 'react';
import TemperatureComponent from './TemperatureComponent';

class ForecastComponent extends Component{

  constructor(props){
    super(props)

    console.log(props.forecast)
    //Initial values
    var initalDay = 0;
    var defaulDaysPerPage = 3;
    var lastPage = Math.ceil(this.props.forecast.length/defaulDaysPerPage) - 1;
    var actualPage = 0;

    this.state = {
      initialDay: initalDay,
      endDay: defaulDaysPerPage,
      daysPerPage: defaulDaysPerPage,
      lastPage: lastPage,
      actualPage: actualPage,
      showNext: (actualPage < lastPage ? true : false),
      showPrevious: (actualPage > 0 ? true : false),
    }

    //Binds
    this.changePage = this.changePage.bind(this);
  }


  changePage(delta){
    var newPage = this.state.actualPage+delta;

    if(newPage >= 0 && newPage <= this.state.lastPage){

      var initialDay = this.state.daysPerPage * newPage;
      var endDay = initialDay + this.state.daysPerPage;

      this.setState({
        initialDay: initialDay,
        endDay: endDay,
        actualPage: newPage,
        showNext: (newPage < this.state.lastPage ? true : false),
        showPrevious: (newPage > 0 ? true : false),
      })
    }
  }

  render(){

    return(
      // {days}
      <div className="Forecast">
        <button onClick={()=>{this.changePage(-1)}} disabled={!this.state.showPrevious}>&lsaquo;</button>
        <ul>{
            this.props.forecast.slice(this.state.initialDay, this.state.endDay).map((item)=>{
              return(
                <li key={item.date}>
                  <p>{item.day}</p>
                  <p>{item.date}</p>
                  <span>&uarr;</span><TemperatureComponent temps={{c:item.highC, f:item.high}} tempType={this.props.tempType} />
                  <span>&darr;</span><TemperatureComponent temps={{c:item.lowC, f:item.low}} tempType={this.props.tempType} />
                </li>
              )
            })
          }
        </ul>
        <button onClick={()=>{this.changePage(1)}} disabled={!this.state.showNext}>&rsaquo;</button>
      </div>
    )
  }

}

export default ForecastComponent;
