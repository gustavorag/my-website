import React, { Component } from 'react';
import Utils from '../utils/Utils';
// import PropTypes from 'prop-types';

class DropListener extends Component {

  constructor(props){
    super(props);

    this.state = {
      top:undefined,
      left:undefined,
      height:undefined,
      width:undefined,
    }

    this.matchDropEvent = this.matchDropEvent.bind(this)
  }

  componentDidMount(){
    //Register itself as a Listener for drop actions
    if(this.props.mouseTrack){
        this.props.mouseTrack.registerDropListener(this.props.mouseTrackerId, this.matchDropEvent);
    }


    /*
    Getting component rectangle and position to calculate colision with droped items in
    matchDropEvent method
    */
    var cliRect = this.refs[this.props.mouseTrackerId].getBoundingClientRect();
    console.log("cliRect",cliRect)
    var newState = {
      top:cliRect.y,
      left:cliRect.x,
      height:cliRect.height,
      width:cliRect.width,
    }
    console.log("newState",newState)
    this.setState(newState)

  }

  // componentDidUpdate(){
  //
  //
  // }

  shouldComponentUpdate(nextProps, nextState){

    var sameProps = Utils.shallowEqual(this.props, nextProps);
    var sameState = Utils.shallowEqual(this.state, nextState);

    if(!sameState){
      return true;
    }
    if(!sameProps){
      return true;
    }
    return false;
  }

  /*
    This method will be call by the MouseTrack if this component is registered as DropListener.
    The method return true if the drop action occurrs in this component.
  */
  matchDropEvent(dragAndDropState){
    var matchX = false;
    var matchY = false;
    if(dragAndDropState){
      if(dragAndDropState.mouseX >= this.state.left && dragAndDropState.mouseX <= this.state.left+this.state.width){
        matchX = true;
      }
      if(dragAndDropState.mouseY >= this.state.top && dragAndDropState.mouseY <= this.state.top+this.state.height){
        matchY = true;
      }
    }
    if(matchX && matchY){
      return true;
    }
  }

  render(){
    return(
      <div ref={this.props.mouseTrackerId} className={this.props.dragDropListenerClass ? this.props.dragDropListenerClass : ""}>
        {this.props.children}
      </div>
    )
  }

}

export default DropListener;
