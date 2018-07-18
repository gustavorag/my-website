import React, { Component } from 'react';
//Loading assets
import consoleImg from '../images/virtual-console/console.png'

//Internal Components
import MyAppService from '../utils/AppService';
import CartridgeShelf from './CartridgeShelf';
import AppCartridge from './AppCartridge';

//Utilitaries
// import Utils from '../utils/Utils';

//Internal Modules
import MouseTrack from '../modules/MouseTrack';
import DropListener from '../modules/DropListener';
import Draggable from '../modules/Draggable';

class AppLoader extends Component{



  constructor(props){
    super(props);

    var category = undefined;
    if(this.props.categoryId){
      category = MyAppService.getCategoryById(this.props.categoryId);
    }

    this.state = {
      category: category,
      apps: category.apps.slice(),
      loadedApp: undefined,
      trackOn: true,
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
    this.setState(newState)

  }

  render(){

    var appContent = null;
    if(this.state.loadedApp){
      var ReactApp = MyAppService.getReactAppById(this.state.loadedApp.id);
      appContent = (<ReactApp />)
    }else{
      appContent = (
        <h2>No Apps</h2>
      )
    }

    return(
      <MouseTrack isTrackOn={this.state.trackOn} dropMatchListeners={this.dropeMatchListener}>
        <div>
          <CartridgeShelf mouseTrackerId={this.CARTRIDGE_SHELF_ID}
            apps={this.state.category ? this.state.apps : undefined} />
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
            <div id="virtual-console-screen">
              {appContent}
            </div>
          </div>
        </div>
      </MouseTrack>

    )
  }
}

export default AppLoader;
