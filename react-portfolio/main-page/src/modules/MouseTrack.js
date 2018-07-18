import React, { Component } from 'react';
import PropTypes from 'prop-types';
/*
Author: Gustavo Rocha de Almeida Guimaraes
Date: 05-24-2018

This component is responsible for tracking the mouse events and spread it to registered listeners.
Mouse position is tracked and passed to mouse trackers.
Drag and drop actions are coordinated by this component. It will detect when the mouse button is released and
inform to drop recipients so those can verify if the drop action happened on their scope.
*/
class MouseTrack extends Component {

  DropListenersRegister = [];
  MouseTrackersRegister = [];
  OnDropMatchListeners = [];

  MOUSE_MOVE = "MOUSE_MOVE";
  MOUSE_DOWN = "MOUSE_DOWN";
  MOUSE_UP = "MOUSE_UP";
  MOUSE_DRAG_OVER = "DRAG_OVER";
  TOUCH_START = "TOUCH_START";
  TOUCH_MOVE = "TOUCH_MOVE";
  TOUCH_END = "TOUCH_END";


  constructor(props){
    super(props);

    //Verifies if there are initial listeners
    /*
    */
    if(Array.isArray(props.dropMatchListeners)){
      props.dropMatchListeners.forEach((listener) => {

        if(listener.listenerId && listener.callbackFunction){
          //console.log("Has initial dropMatchListeners", listener)
          this._registerOnDropMatchListener(listener.listenerId, listener.callbackFunction, this.OnDropMatchListeners);
        }
      });
    }

    this.isTrackOn = true;
    if(props.isTrackOn !== undefined){
      this.isTrackOn = props.isTrackOn;
    }

    //This property is responsible for record mouse states throught the tracking. It is used to create mouse events to be
    //spread to listeners.
    this.mouseState = {
      x:0,
      y:0,
      isMouseDown: false,
      dragAction: {
        isDragging: false,
        draggableItem: undefined,
        draggableId: undefined,
      }
    }
    this.touchState = {
      x:0,
      y:0,
      touchStarted: false,
      dragAction: {
        isDragging: false,
        draggableItem: undefined,
        draggableId: undefined,
      }
    }

    //This is the exposed API of this component.
    this.MouseTrackApi = Object.freeze({
      MOUSE_MOVE: this.MOUSE_MOVE,
      MOUSE_DOWN: this.MOUSE_DOWN,
      MOUSE_UP: this.MOUSE_UP,
      MOUSE_DRAG_OVER: this.MOUSE_DRAG_OVER,
      TOUCH_START: this.TOUCH_START,
      TOUCH_MOVE: this.TOUCH_MOVE,
      TOUCH_END: this.TOUCH_END,
      registerDropListener : this._registerDropListener,
      deregisterDropListener : this._deregisterDropListener,
      registerMouseTraker: this._registerMouseTraker,
      deregisterMouseTraker: this._deregisterMouseTraker,
      registerDraggingAction: this._registerDraggingAction,
      deregisterDraggingAction: this._deregisterDraggingAction,
    })

  }

  //Method receives a listener ID, callbackFunction and the Register Holder.
  //ListernerId must be an String and callbackFunction must be a function
  registerListener(listenerId, callbackFunction, register){
    if(!listenerId || typeof listenerId !== "string"){
      throw new Error("Invalid listenerId passed to register "+register);
    }
    if(!callbackFunction || typeof callbackFunction !== "function"){
      throw new Error("Invalid callbackFunction passed to register "+register);
    }
    register.forEach(function(listener){
      if(listener.id === listenerId){
        listener.callbackFunction = callbackFunction;
        return;
      }
    })
    //If do not return, there is no listener with the given id. Therefore a new one is created.
    register.push(
      {id:listenerId, callbackFunction: callbackFunction}
    )
  }

  deregisterListener(listenerId, register){
    var indexToRemove = -1;
    register.forEach(function(listener, index){
      if(listener.id === listenerId){
        indexToRemove = index;
      }
    })

    if (indexToRemove >= 0) {
      register.splice(indexToRemove, 1);
    }
    return register;
  }

  /*
  */
  _registerDropListener = (listenerId, callbackFunction) => {
    this.registerListener(listenerId, callbackFunction, this.DropListenersRegister);
  };

  /*
  */
  _deregisterDropListener = (listenerId) => {
    this.deregisterListener(listenerId, this.DropListenersRegister);
  };

  /*
  */
  _registerMouseTraker = (listenerId, callbackFunction) => {
    this.registerListener(listenerId, callbackFunction, this.MouseTrackersRegister);
  };

  /*
  */
  _deregisterMouseTraker = (listenerId) => {
    this.deregisterListener(listenerId, this.MouseTrackersRegister);
  };


  _registerOnDropMatchListener = (listenerId, callbackFunction) => {
    this.registerListener(listenerId, callbackFunction, this.OnDropMatchListeners);
  };

  /*
  */
  _deregisterOnDropMatchListener = (listenerId) => {
    this.deregisterListener(listenerId, this.OnDropMatchListeners);
  };

  //Any element that wants to be considered in drag status must register the
  //beginning of drag action. This will allow the Mouse Track to keep the status of
  //the dragging (there is a dragging in action, which item is been dragged, etc.).
  //Only one dragging is allowed at time.
  _registerDraggingAction = (draggableId, draggable) => {

    //console.log("_registerDraggingAction")

    if(!this.isTrackOn || this.mouseState.dragAction.isDragging){
      //console.log("false", !this.isTrackOn, this.mouseState.dragAction.isDragging)
      return false;
    }
    this.mouseState.dragAction.isDragging = true;
    this.mouseState.dragAction.draggableItem = draggable;
    this.mouseState.dragAction.draggableId = draggableId;
    //console.log("true")
    return true;
  }

  //Mouse up events originated either in Mouse Track component or children components
  //will trigger the _deregisterDraggingAction. This method will generate a drag end Action
  //(if there is one in action). Next, the drag end Action if informed to the DropListeners
  //Each DropListeners must return true or false about having match the drop.
  //A positive match happens when the drop end action occurs on a drop listener area.
  //It is expected from the drop listeners to always return a match status, no matter it is
  //a positive o negative one. All the match results are passed to the OnDropMatchListeners.
  //These listeners are responsible for handle the matching between and draggable item and a dropable item.
  _deregisterDraggingAction = (draggableId) => {

    //console.log("_deregisterDraggingAction")

    if(!this.isTrackOn || !this.mouseState.dragAction.isDragging ||
      this.mouseState.dragAction.draggableId !== draggableId){ //Only the item that registred the drag action can unregister it.
        return false;
      }

      var dragEndEvent = {
        eventType: this.MOUSE_DRAG_OVER,
        mouseX: this.mouseState.x,
        mouseY: this.mouseState.y,
        isMouseDown: false,
        isDragging: false,
        draggableItem: this.mouseState.dragAction.draggableItem,
        draggableId: this.mouseState.dragAction.draggableId,
      }

      this.mouseState.dragAction.isDragging = false;
      this.mouseState.dragAction.draggableItem = undefined;
      this.mouseState.dragAction.draggableId = undefined;

      var matches = [];
      this.DropListenersRegister.forEach((listener) => {
        if(listener.callbackFunction(dragEndEvent)){
          matches.push(listener.id);
        }
      })

      var matchingResults = {
        match: matches.length > 0 ? true : false,
        draggableItem: dragEndEvent.draggableItem,
        matches: matches,
      }
      this.OnDropMatchListeners.forEach(function(dropMatchListener){
        dropMatchListener.callbackFunction(matchingResults);
      })

      return true;
    }

    /*
    On the event of mouse movement, the tracker will inform the listeners about the new position.
    */
    handleMouseMove = (e) => {
      if(this.isTrackOn){

        var nextX = e.clientX;
        var nextY = e.clientY;

        this.createMouseEvent(nextX, nextY, this.MOUSE_MOVE);
      }
    }

    handleTouchMove = (e) => {
      if(this.isTrackOn){

        var nextX = e.touches[0].clientX;
        var nextY = e.touches[0].clientY;

        this.createMouseEvent(nextX, nextY, this.MOUSE_MOVE);
      }
    }

    handleMouseDown = (e) => {

      if(this.isTrackOn){

        var nextX = e.clientX;
        var nextY = e.clientY;

        this.createMouseEvent(nextX, nextY, this.MOUSE_DOWN);
      }
    }

    handleTouchStart = (e) => {

      if(this.isTrackOn){
        console.log("Touch start ", e.touches[0])
        var nextX = e.touches[0].clientX;
        var nextY = e.touches[0].clientY;

        this.createMouseEvent(nextX, nextY, this.MOUSE_DOWN);
      }
    }

    /*
    On the event of mouse button released, the tracker will inform the drop listener about drag end
    */
    handleMouseUp = (e) => {

      if(this.isTrackOn){

        var nextX = e.clientX;
        var nextY = e.clientY;

        this.createMouseEvent(nextX, nextY, this.MOUSE_UP);
      }
    }

    handleTouchEnd = (e) => {

      if(this.isTrackOn){
        console.log("Touch end ", e, e.touches)
        var nextX = this.mouseState.x;
        var nextY = this.mouseState.y;

        this.createMouseEvent(nextX, nextY, this.MOUSE_UP);
      }
    }

    createMouseEvent = (newX, newY, eventType) => {
        if(eventType === this.MOUSE_UP){
            this.mouseState.isMouseDown = false;
        }
        if(eventType === this.MOUSE_DOWN){
            this.mouseState.isMouseDown = true;
        }

        var mouseEvent = {
          eventType: eventType,
          previousX: this.mouseState.x,
          previousY: this.mouseState.y,
          x: newX,
          y: newY,
          isMouseDown: this.mouseState.isMouseDown,
          isDragging: this.mouseState.dragAction.isDragging,
        }

        this.mouseState.x = newX;
        this.mouseState.y = newY;

        this.MouseTrackersRegister.forEach((listener) => {
          listener.callbackFunction(mouseEvent);
        })
    }

    //All eligible children of this component will receive the API. To be eligible the child must be
    //a valid React Element and have the mouseTrackerId property (required for control of listeners).
    checkChildrenForTracking = (element) => {
      //console.log("Verifing children of "+element, element.props.children)
      var that = this;
      if(element){

        var renderedChildren = React.Children.map(element.props.children, function(child) {
          if(child){
            if(React.isValidElement(child)){
              //Any child that has mouseTrackerId will receive the mouseTrackApi
              if(child.props.mouseTrackerId){
                //console.log("Injecting MouseTrack on "+child.props.mouseTrackerId, child)
                child = React.cloneElement(
                  child,
                  { mouseTrack: that.MouseTrackApi }
                );
              }
            }
            if(child.props && child.props.children){
              //Injecting api
              //console.log("Has children")
              child = React.cloneElement(
                child,
                { children: that.checkChildrenForTracking(child) }
              );
            }
            return child;
          }
        });
        return renderedChildren;
      }
    }

    render(){

      var renderedChildren = this.checkChildrenForTracking(this)
      return(
        <div style={{height: "100%"}}
          onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
          onTouchMove={this.handleTouchMove} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
          {renderedChildren}
        </div>
      )
    }

  }

  /*
  Optional props:

  - Listeners - Listeners can be:
  DropListener
  MouseTrackers
  OnDropMatchListeners
  The format for each listener must be:
  {listenerId: String, unique value, callbackFunction: function}
  */
  MouseTrack.propTypes = {
    dropMatchListeners: PropTypes.arrayOf(
      PropTypes.shape({
        listenerId: PropTypes.string.isRequired,
        callbackFunction: PropTypes.func.isRequired
      })
    ),
    isTrackOn: PropTypes.bool,
  }

  export default MouseTrack;
