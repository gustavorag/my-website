import TodoApp from '../apps/TodoApp/src/App';
import Weather from '../apps/Weather/src/App';
import Jokenpo from '../apps/Jokenpo/src/JokenPoGame';

var appComponents = {
  tasksManager: TodoApp,
  weatherApp: Weather,
  jokenpo: Jokenpo,
  // crazypong: App2,
  // movingWords: App1,
}

var apps = [
  {name:"Jokenpo", id:"jokenpo", imgName: "jokenpo_art.png", desc: ""},
  {name:"Tasks Manager", id:"tasksManager", imgName: "todo_app_art.png", desc: "This app use REACT and Axios module. For backend it uses NODEJS and MongoDB"},
  {name:"Weather App", id:"weatherApp", imgName: "weather_app_art.png", desc: "This app use REACT and Axios module. Also the Yahoo Weather API is used to retrieve weather information"},
  // {name:"Crazy Pong", id:"crazypong", imgName: "crazy_pong_art.png", desc: ""},
  // {name:"App1", id:"app1" , imgName: "crazy_pong_art.png", desc:"This app use REACT"},
  // {name:"Moving Words", id:"movingWords", imgName: "crazy_pong_art.png", desc: ""}
];

var _getReactAppById = function(id){
  return appComponents[id];
}

var AppService = {
  getApps: ()=> apps,
  getReactAppById:  _getReactAppById,
}

export default AppService;
