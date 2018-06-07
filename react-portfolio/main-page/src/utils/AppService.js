import App1 from '../apps/App1/App1';
import App2 from '../apps/App2/App2';

var appComponents = {
  app1: App1,
  tasksManager: App2,
  weatherApp: App1,
  jokenpo: App2,
  movingWords: App1,
}

var categories = [
  {
    id:"cat01",
    name: "Tools",
    apps:[
      {name:"App1", id:"app1" , imgName: "cartridgePong.png"},
      {name:"Tasks Manager", id:"tasksManager", imgName: "cartridgePong.png"},
      {name:"Weather App", id:"weatherApp", imgName: "cartridgePong.png"}
    ]
  },
  {
    id:"cat02",
    name: "Games",
    apps:[
      {name:"Crazy Pong", id:"crazypong", imgName: "cartridgePong.png"},
      {name:"Jokenpo", id:"jokenpo", imgName: "cartridgePong.png"},
      {name:"Moving Words", id:"movingWords", imgName: "cartridgePong.png"}
    ]
  }
];


var _getCategoryById = function(id){
  for(let index = 0; index < categories.length; index++){
    if(categories[index].id === id){
      return categories[index];
    }
  }

}

var _getReactAppById = function(id){
  return appComponents[id];
}

var AppService = {
  getCategories: ()=> categories,
  getCategoryById:  _getCategoryById,
  getReactAppById:  _getReactAppById,
}

export default AppService;