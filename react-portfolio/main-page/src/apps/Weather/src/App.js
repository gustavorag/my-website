import React, { Component } from 'react';
import ShowGlobalMessage from './utils/ShowGlobalMessage';
import Constants from './utils/Constants';
import logo from './logo.svg';
import './App.css';

//Importing components
import CitiesDropdown from './components/CitiesDropdown';
import CityWeather from './components/CityWeather';

//Importing Utilitaries
import WeatherService from './weather-service/WeatherService';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      weather: undefined,
      cities: WeatherService.getCities(),
      actualCity: undefined,
      msg: undefined,
      msgType: Constants.MSG_TYPE_ERROR,
    }

    //Binds
    this.handleCitySelection = this.handleCitySelection.bind(this);
    this.handleCloseGlobalMsg = this.handleCloseGlobalMsg.bind(this);
  }


  handleCitySelection(e){

    this.state.cities.forEach((city, index)=>{
      if(city.id === e.target.value){
        /*
          Call service to recover city's weather passing city name, city
          province and an anonymous function as callback
        */
        WeatherService.getCityWeather(city.name, city.province, (error, data) => {
          if(data){
            this.setState(
              {
                actualCity : city,
                weather : data,
                msg: undefined,
                msgType: undefined,
              }
            );
          }else{
            this.setState(
              {
                msg: "An error occurred while trying to connect Weather service. Please try again later.",
                msgType: Constants.MSG_TYPE_ERROR,
              }
            );
          }
        });
        return;
      }
    })

  }

  handleCloseGlobalMsg(){
    this.setState(
      {
        msg: undefined,
        msgType: undefined,
      }
    );
  }

  render() {

    return (
      <div className="WeatherApp">
        <div className="WeatherApp-header">
          <h2>The Weater APP</h2>
        </div>
        <CitiesDropdown cities={this.state.cities} onSelectItem={this.handleCitySelection}/>
        {
          this.state.actualCity && this.state.weather  ?
          (<CityWeather city={this.state.actualCity} weather={this.state.weather} />)
          :
          null
        }
        <ShowGlobalMessage msg={this.state.msg} msgType={this.state.msgType} onClose={this.handleCloseGlobalMsg}/>

        <div className="icons-label">Icons made by <a href="https://www.flaticon.com/authors/hirschwolf" title="hirschwolf">hirschwolf</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
      </div>
    );
  }
}

export default App;
