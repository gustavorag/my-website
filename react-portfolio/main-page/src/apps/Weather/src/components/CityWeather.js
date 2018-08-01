import React, { Component } from 'react';
import wind from '../images/breeze.svg';
import ForecastComponent from './ForecastComponent';
import TemperatureComponent from './TemperatureComponent';
import Constants from "../utils/Constants";

class CityWeather extends Component{

  constructor(props){
    super(props);

    this.rotateVertical = {transform:"rotateY(360deg)"};

    this.state = {
      //This property control which temperature must be shown
      tempType: Constants.TEMP_C,
      tempStyleRotarion: 0,
    }

    this.changeTemperatureType = this.changeTemperatureType.bind(this);

  }

  changeTemperatureType(){
    this.setState(
      {
        tempType: (this.state.tempType === Constants.TEMP_C ? Constants.TEMP_F : Constants.TEMP_C),
        tempStyleRotarion: (this.state.tempStyleRotarion === 0 ? 360 : 0),
      }
    );
  }

    render(){

      var currentTempStyle = {transform: `rotateY(${this.state.tempStyleRotarion}deg)`};

      return(
        <div className="CityWeather">
          <p className="CityName">{this.props.city.name}</p>
          <div className="CurrentTemperature" onClick={this.changeTemperatureType} style={currentTempStyle}>
            <TemperatureComponent temps={this.props.weather.temps} tempType={this.state.tempType} />
          </div>
          <div className="Conditions">
            <p className="Conditions-desc">{this.props.weather.weatherCondition}</p>
            <img className="Conditions-icon" src={this.props.weather.imageUrl} alt="{this.props.weather.weatherCondition}"/>
          </div>
          <div className="Wind">
            <img className="Wind-icon" src={wind} alt="Wind"/>
            <p className="Wind-value">Speed: {this.props.weather.wind.speed}</p>
          </div>
          {/* ForecastComponent has a key to ensure that it will be reset when the city changes */}
          <ForecastComponent key={this.props.city.name+"-"+this.props.city.province} forecast={this.props.weather.forecast} tempType={this.state.tempType}/>
          <p className="CityWeather-info">Click on the temperature to change  Metric System</p>
        </div>
      )
    }

  }

  export default CityWeather;


  // var myWeather = {
  //   temps:{
  //     f: channel.item.condition.temp,
  //     c: fahrenheitToCelsius(channel.item.condition.temp),
  //   },
  //   weatherCondition: channel.item.condition.text,
  //   wind: channel.wind,
  //   atmosphere: channel.atmosphere,
  //   forecast: channel.item.forecast,
  //   imageUrl: imgsEndpoint+channel.item.condition.code+imgsFormat,
  // }
