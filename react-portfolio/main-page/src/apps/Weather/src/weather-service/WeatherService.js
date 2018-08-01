const axios = require('axios');

const cityOptions = [
  {name:"Vancouver",province:"BC", id:"c001"},
  {name:"Victoria",province:"BC", id:"c002"},
  {name:"Calgary",province:"AB", id:"c003"},
  {name:"Toronto",province:"ON", id:"c004"},
  {name:"Winnipeg",province:"MB", id:"c005"},
]

//Constants to help logical process over data
const format = "json";
const endPoint = "https://query.yahooapis.com/v1/public/yql";
const imgsEndpoint = "http://l.yimg.com/a/i/us/we/52/";
const imgsFormat = ".gif";
const fahrenheitCelsiusDiff = 32;
const fahrenheitCelsiusFactor = 5/9;

var _getCityWeatherRange = function(name, province, initDay, endDay, callback){
  var weatherQuery = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${name}, ${province}")`;
  const options = {
    params:{
      q : weatherQuery,
      format: format,
    }
  }

  axios.get(endPoint, options)
  .then(function(response){

    var channel = response.data.query.results.channel;

    //Formating return to keep only desired info and process temperature
    var myWeather = {
      temps:{
        f: channel.item.condition.temp,
        c: fahrenheitToCelsius(channel.item.condition.temp),
      },
      weatherCondition: channel.item.condition.text,
      wind: channel.wind,
      atmosphere: channel.atmosphere,
      forecast: channel.item.forecast.map((item)=>{
        item.highC = fahrenheitToCelsius(item.high);
        item.lowC = fahrenheitToCelsius(item.low);
        return item;
      }),
      imageUrl: imgsEndpoint+channel.item.condition.code+imgsFormat,
    }
    callback(null, myWeather);
  }).catch(function(error){
    callback(error, null);
  });
}

var _getCityWeather = function(name, province, callback){
  _getCityWeatherRange(name, province, null, null, callback)
}

function fahrenheitToCelsius(f){
  return Math.round((f-fahrenheitCelsiusDiff) * fahrenheitCelsiusFactor);
}

var api = {
  getCities : ()=> cityOptions,
  getCityWeather: _getCityWeather,
}

export default api;
