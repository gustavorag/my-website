import React, { Component } from 'react';
import Constants from './Constants';
import svg_cancel from '../images/cancel.svg';

class ShowGlobalMessage extends Component{

  render(){

    var headerClass = "Global-mgs-header"
    if(this.props.msgType === Constants.MSG_TYPE_SUCCESS){
      headerClass = headerClass+" success";
    }else if(this.props.msgType === Constants.MSG_TYPE_ERROR){
      headerClass = headerClass+" error";
    }else if(this.props.msgType === Constants.MSG_TYPE_WARNING){
      headerClass = headerClass+" warning";
    }

    if(this.props.msg){
      return (
        <div className="Global-mgs">
          <div className="Global-mgs-modal">
            <div className={headerClass}>
              <span onClick={this.props.onClose}><i class="fas fa-times-circle"></i></span>
            </div>
            <p className="Global-mgs-content">{this.props.msg}</p>
          </div>
        </div>
      )
    }else{
      return null;
    }

  }

}

export default ShowGlobalMessage;
