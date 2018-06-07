import React, { Component } from 'react';

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
      loadedApp2: undefined,
      trackOn: true,
    }

    this.CARTRIDGE_SHELF_ID = "cartridgeSheld";
    this.CARTRIDGE_INPUT_ID = "cartridgeInput";
    this.CARTRIDGE_INPUT_ID_B = "cartridgeInputB";
    this.DROPMARCH_LISTENER_ID = "dropMatchedCartriges";
    this.dropeMatchListener = [
      {
        listenerId: this.DROPMARCH_LISTENER_ID,
        callbackFunction: (matches) => {
          this.handleDropMatched(matches);
        }
      }
    ]

    this.handleDropMatched = this.handleDropMatched.bind(this);
    this.registerDropListener = this.registerDropListener.bind(this);
  }

  registerDropListener(listenerId, callbackMethod){
    this.DropListeners.forEach( (listener) => {
      if(listener.id === listenerId){
        listener.callbackMethod =callbackMethod;
        return;
      }
    })
    this.DropListeners.push({id:listenerId, callbackMethod:callbackMethod})
  }

  handleDropMatched(matchResult){
    console.log("Machts", matchResult)
    var that = this;
    var dropMatchItem = undefined;

    var newState = {};

    var apps = that.state.apps.map((app)=>{
      if(app.name === matchResult.draggableItem.name){
        if(matchResult.match){
          app.isLoaded = true;
          dropMatchItem = app;
        }else{
          app.isLoaded = false;
        }
      }
      return app;
    })

    //If there is no loaded
    var appToUnload = undefined;

    if(!dropMatchItem){
      if(this.state.loadedApp && matchResult.draggableItem.name === this.state.loadedApp.name ){
        newState.loadedApp = undefined;
      }
    }else{
      matchResult.matches.forEach((dropListenerId) => {
        if(dropListenerId === that.CARTRIDGE_INPUT_ID){
          appToUnload = this.state.loadedApp;
          newState.loadedApp = dropMatchItem;
        }
      });
    }

    if(appToUnload){
      apps = apps.map((app) => {
        if(app.name === appToUnload.name){
          app.isLoaded = false;
        }
        return app;
      });
    }

    newState.apps = apps;
    that.setState(newState)

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
