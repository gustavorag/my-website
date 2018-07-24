import React, { Component } from 'react';
//Loading assets
import consoleImg from '../images/virtual-console/console.png'
import lnCorpLogo from '../images/virtual-console/lnCorpLogo.png'

//Internal Components
import MyAppService from '../utils/AppService';
import CartridgeShelf from './CartridgeShelf';
import AppCartridge from './AppCartridge';
import TypingSimulation from './TypingSimulation.js'

//Utilitaries
// import Utils from '../utils/Utils';

//Internal Modules
import MouseTrack from '../modules/MouseTrack';
import DropListener from '../modules/DropListener';
import Draggable from '../modules/Draggable';

//Styles
import '../styles/VirtualConsole.css';

var consoleInputText = [
  "LN CORP - 2018",
  "INITIALIZING VIRTUAL CONSOLE /*/*--*# - ()OK",
  "LOADING ASSETS *******",
  "---- Instructions: Drag and Drop Cartridges on the Console to load the APP ----",
  "WAITING FOR CARTRIDGE SELECTION ..."
]

class AppLoader extends Component{

  constructor(props){
    super(props);



    this.state = {
      apps: [],
      loadedApp: undefined,
      trackOn: true,
      appInfo: null,

    }

    this.CARTRIDGE_SHELF_ID = "cartridgeSheld";
    this.CARTRIDGE_INPUT_ID = "cartridgeInput";
    this.CARTRIDGE_INPUT_ID_B = "cartridgeInputB";
    this.DROPMARCH_LISTENER_ID = "dropMatchedCartriges";

    //Creates the info for register this component as a DropMatched Listener
    //in the MouseTrack Module
    this.dropeMatchListener = [
      {
        listenerId: this.DROPMARCH_LISTENER_ID,
        callbackFunction: (matches) => {
          this.handleDropMatched(matches);
        }
      }
    ]

    this.handleDropMatched = this.handleDropMatched.bind(this);
    this.handlerMouseOverCartridge = this.handlerMouseOverCartridge.bind(this);
    this.handleTypeEnding = this.handleTypeEnding.bind(this);
  }

  /*
  The AppLoader is registered in the MouseTrack Module as a DropMatched listener.
  A DropMatched listener will receive a match result always that a drag and drop
  is finished. The match result contains information about which item was dragged
  and if it was released at any drop container.

  Match Result contains:
  match: boolean - indicates if the item as dropped in any dropable container
  draggableItem: the dragged item
  matches: array (string) - Contains the ids of all dropable containers that matched
  positive for receiving the dragged item.

  This method will resolve the drop action looking for any item that is released
  in the Cartridge Input area (drop listener) or dragged from it.
  */
  handleDropMatched(matchResult){

    var newState = {};


    var matchOnCartridgeInput = false;

    //If there was at least one match, goes through the id of the drop listeners that matched for dropping
    //and verifies if it is the Cartridge Input
    if(matchResult.match){
      matchResult.matches.forEach((dropListenerId) => {
        if(this.CARTRIDGE_INPUT_ID === dropListenerId){
          matchOnCartridgeInput = true;
        }
      })
    }

    //If the drop was in the Cartridge input
    if(matchOnCartridgeInput){
      //Is the same app previously loaded?
      if(this.state.loadedApp && this.state.loadedApp.name === matchResult.draggableItem.name){
        //If is the same app, does nothing. There is no needing to change states
        return;
      }else{
        newState.loadedApp = matchResult.draggableItem;
      }
    }else{
      //Is the same app previously loaded?
      if(this.state.loadedApp && this.state.loadedApp.name !== matchResult.draggableItem.name){
        /*
        If is not the same app, does nothing as the dragged item as not
        released in the Cartridge input. Therefore, the previous app must
        remain loaded.
        */
        return;
      }else{
        //If there was no matching in the Cartridge input and it was the previous
        //loaded app, it must be unloaded;
        newState.loadedApp = undefined;
      }
    }

    //Update list of app to marke loaded app as 'loaded' if any was dropped
    //in the Cartridge Input area.
    var apps = this.state.apps.map((app)=>{

      //Mark app as unloaded. Later will check if it is loaded and then update
      //to loaded;
      app.isLoaded = false;

      //There is a loaded app?
      if(newState.loadedApp){
        // if yes, verify if is the actual app from the list and if
        //yes, mark the actual as loaded.
        if(app.name === newState.loadedApp.name){
          app.isLoaded = true;
        }
      }

      return app;
    })

    newState.apps = apps;
    newState.appInfo = null;
    this.setState(newState)

  }

  handlerMouseOverCartridge(app, isOver){
    if(isOver){
      this.setState({appInfo: {name: app.name, desc: app.desc}})
    }else{
      this.setState({appInfo: null})
    }
  }

  handleTypeEnding(){
    if(this.state.apps.length < 1){
      this.setState({apps: MyAppService.getApps().slice()})
    }

  }


  render(){

    //Content to be displayed in the Virtual Console Screen
    var consoleContent = null;
    var isAppLoaded = false;

    if(this.state.loadedApp){
      isAppLoaded = true;
      var ReactApp = MyAppService.getReactAppById(this.state.loadedApp.id);
      consoleContent = (<ReactApp />)

    }else{

      var appInfoConten = this.state.appInfo ?
      (
        <div>
          <p>-------------------------------------------------------------</p>
          <p>App Name: {this.state.appInfo.name}</p>
          <p>App Desc: {this.state.appInfo.desc}</p>
        </div>
      )
      :
      null;
      consoleContent = (
        <div className="type-simulation">
          <TypingSimulation input={consoleInputText} onTypingEnd={this.handleTypeEnding} fast={true} noSimulation={false}/>
          {appInfoConten}
        </div>
      )

    }

    var virtualConsoleScreenClass = isAppLoaded ? "browsing" : "terminal"

    return(
      <MouseTrack isTrackOn={this.state.trackOn} dropMatchListeners={this.dropeMatchListener}>
        <div>
          <CartridgeShelf mouseTrackerId={this.CARTRIDGE_SHELF_ID} onMouseOverCartridge={this.handlerMouseOverCartridge}
            apps={this.state.apps ? this.state.apps : undefined} />
          <div id="virtual-console">
            <div id="virtual-console-loader">
              <img src={consoleImg} id="console-img"/>
              <DropListener mouseTrackerId={this.CARTRIDGE_INPUT_ID}
                dragDropListenerClass="cartridge-input">
                {
                  this.state.loadedApp ?
                  (
                    <Draggable mouseTrackerId={"loaded-"+this.state.loadedApp.name} draggableItem={this.state.loadedApp}
                      cursorClass={{grab: "cartridge-grab",grabbing: "cartridge-grabbing"}}>
                      <AppCartridge app={this.state.loadedApp}/>
                    </Draggable>
                  )
                  :
                  (null)
                }
              </DropListener>

            </div>
            <div id="virtual-console-screen" className={virtualConsoleScreenClass}>
              {consoleContent}
            </div>
          </div>
        </div>
      </MouseTrack>

    )
  }
}

export default AppLoader;
