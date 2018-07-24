import App1 from '../apps/App1/App1';
import App2 from '../apps/App2/App2';
import Jokenpo from '../apps/Jokenpo/src/JokenPoGame';

var appComponents = {
  app1: App1,
  tasksManager: App2,
  weatherApp: App1,
  jokenpo: Jokenpo,
  crazypong: App2,
  movingWords: App1,
}

var apps = [
      {name:"App1", id:"app1" , imgName: "crazy_pong_art.png", desc:"This app use REACT"},
      {name:"Tasks Manager", id:"tasksManager", imgName: "todo_app_art.png", desc: "This app use REACT and Axios module. For backend it uses NODEJS and MongoDB"},
      {name:"Weather App", id:"weatherApp", imgName: "crazy_pong_art.png", desc: "This app use REACT and Axios module. Also the Yahoo Weather API is used to retrieve weather information"},
      {name:"Crazy Pong", id:"crazypong", imgName: "crazy_pong_art.png", desc: ""},
      {name:"Jokenpo", id:"jokenpo", imgName: "crazy_pong_art.png", desc: ""},
      {name:"Moving Words", id:"movingWords", imgName: "crazy_pong_art.png", desc: ""}
];

var _getReactAppById = function(id){
  return appComponents[id];
}

var AppService = {
  getApps: ()=> apps,
  getReactAppById:  _getReactAppById,
}

export default AppService;
