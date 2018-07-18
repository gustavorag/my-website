/*
*/
import React, { Component } from 'react';
// import Utils from '../utils/Utils';
import PropTypes from 'prop-types';
// import MouseTrack from './MouseTrack'


class Draggable extends Component {

  constructor(props){
    super(props);

    this.state = {
      isMoving: false,
      mousePreviousX: 0,
      mousePreviousY: 0,
      mouseActualX: 0,
      mouseActualY: 0,
    }

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
    this.handlerMouseMove = this.handlerMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount(){

  }


  handleMouseEvent(mouseTrackEvent){
    if(this.props.mouseTrack.MOUSE_MOVE === mouseTrackEvent.eventType){
      //console.log("Mouse Move")
      this.handlerMouseMove(mouseTrackEvent);

    }else if(this.props.mouseTrack.MOUSE_UP === mouseTrackEvent.eventType){
      //console.log("Mouse up")
      this.handleMouseUp(mouseTrackEvent);
    }
  }

  handleMouseDown(mouseTrackEvent, localEvent) {

    var proceed = true;

    var mouseX = localEvent ? localEvent.x : mouseTrackEvent.x;
    var mouseY = localEvent ? localEvent.y : mouseTrackEvent.y;

    if(this.props.beforeDragBegins){
      // //Get actual mouse position to pass as param to beforeDragBegins function
      let mousePosition = {
        x: mouseX,
        y: mouseY
      }
      proceed = this.props.beforeDragBegins(this.props.mouseTrackerId, mousePosition);
    }

    if(proceed){
      //console.log("Proceed",proceed)
      if(this.props.mouseTrackerId){
        this.props.mouseTrack.registerMouseTraker(this.props.mouseTrackerId, this.handleMouseEvent);
        var successfulDragging = this.props.mouseTrack.registerDraggingAction(this.props.mouseTrackerId, this.props.draggableItem ? this.props.draggableItem : this.props.mouseTrackerId)
      }
      if(successfulDragging){
        this.setState({
          isMoving: true,
          mouseInitialX: mouseX,
          mouseInitialY: mouseY,
          mouseActualX: mouseX,
          mouseActualY: mouseY,
        });
      }
      if(this.props.afterDragBegins){
        //Get actual mouse position to pass as param to afterDragBegins function
        let mousePosition = {
          x: this.state.mouseActualX,
          y: this.state.mouseActualX
        }
        this.props.afterDragBegins(this.props.mouseTrackerId, mousePosition);
      }
    }

  }

  handlerMouseMove(mouseTrackEvent, localEvent){
    if(this.state.isMoving){

      var proceed = true;

      var mouseX = localEvent ? localEvent.x : mouseTrackEvent.x;
      var mouseY = localEvent ? localEvent.y : mouseTrackEvent.y;

      if(this.props.beforeDragMovement){
        //Get actual mouse position to pass as param to beforeDragMovement function
        let mousePosition = {
          x: mouseX,
          y: mouseY
        }
        proceed = this.props.beforeDragMovement(this.props.mouseTrackerId, mousePosition);
      }
      if(proceed){

        this.setState({
          mouseActualX: mouseX,
          mouseActualY: mouseY,
        });

        if(this.props.afterDragMovement){
          //Get actual mouse position to pass as param to afterDragMovement function
          let mousePosition = {
            x: this.state.mouseActualX,
            y: this.state.mouseActualX
          }
          this.props.afterDragMovement(this.props.mouseTrackerId, mousePosition);
        }
      }
    }
  }

  handleMouseUp(mouseTrackEvent, localEvent) {

    var proceed = true;

    var mouseX = localEvent ? localEvent.x : mouseTrackEvent.x;
    var mouseY = localEvent ? localEvent.y : mouseTrackEvent.y;

    //console.log("Draggable handleMouseUp")
    if(this.props.beforeDragEnds){
      //Get actual mouse position to pass as param to beforeDragEnds function
      let mousePosition = {
        x: mouseX,
        y: mouseY
      }
      proceed = this.props.beforeDragEnds(this.props.mouseTrackerId, mousePosition);
    }
    if(proceed){

      this.props.mouseTrack.deregisterMouseTraker(this.props.mouseTrackerId);
      this.props.mouseTrack.deregisterDraggingAction(this.props.mouseTrackerId);

      this.setState({
        isMoving: false,
        mousePreviousX: 0,
        mousePreviousY: 0,
        mouseActualX: 0,
        mouseActualY: 0,
      })

      if(this.props.afterDragEnds){
        //Get actual mouse position to pass as param to afterDragEnds function
        let mousePosition = {
          x: this.state.mouseActualX,
          y: this.state.mouseActualX
        }
        this.props.afterDragEnds(this.props.mouseTrackerId, mousePosition);
      }
    }


  }


  render(){

    var style = {
      position: "relative",
      left: 0,
      top: 0,
    };

    var cursorClass = "";

    if(this.props.cursorClass){
        cursorClass = this.props.cursorClass.grab ? this.props.cursorClass.grab : "";
    }

    if(this.state.isMoving){

      //Updating new position
      style.left = (this.state.mouseActualX - this.state.mouseInitialX);
      style.top = (this.state.mouseActualY - this.state.mouseInitialY);

      //Changing class for cursor if it has one
      if(this.props.cursorClass){
          cursorClass = this.props.cursorClass.grabbing ? this.props.cursorClass.grabbing : "";
      }

    }else{
      if(this.props.coordinates){
        style.left = this.props.coordinates.x;
        style.top = this.props.coordinates.y;
      }
    }

    // //console.log("Style: ",style)

    return(
      <div className={cursorClass}  style={style}
        onMouseDown={
          (e) => {
            var localEvent = {
              x: e.clientX,
              y: e.clientY
            }
            this.handleMouseDown(undefined, localEvent)
          }
        }
        onMouseUp={
          (e) => {
            var localEvent = {
              x: e.clientX,
              y: e.clientY
            }
            this.handleMouseUp(undefined, localEvent)
          }
        }
        onTouchStart={
          (e) => {
            var localEvent = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
            }
            this.handleMouseDown(undefined, localEvent)
          }
        }
        onTouchEnd={
          (e) => {
            var localEvent = {
              x: this.state.previousX,
              y: this.state.previousY
            }
            this.handleMouseUp(undefined, localEvent)
          }
        }>
        {this.props.children}
      </div>
    )
  }

}

/*
*** Optional props ***

  this.props.beforeDragBegins: it is a function call right before the component starts the dragging action.
  It will execute before the registerDraggingAction. It must return a boolen value to indicate if the
  drag starting must proceed.

  this.props.beforeDragMovement
  this.props.beforeDragEnds

*** Required props ***

  this.props.mouseTrack -- MouseTrack is the component that listens to mouse events.
  this.props.mouseTrackerId  -- Id of this component. All components that follow MouseTrack must have a unique ID
*/

Draggable.propTypes = {
  mouseTrack: PropTypes.object.isRequired,
  mouseTrackerId: PropTypes.string.isRequired,
  beforeDragBegins: PropTypes.func,
  afterDragBegins: PropTypes.func,
  beforeDragMovement: PropTypes.func,
  afterDragMovement: PropTypes.func,
  beforeDragEnds: PropTypes.func,
  afterDragEnds: PropTypes.func,
}

export default Draggable;
