import React, { Component } from 'react';

class AppCartridge extends Component{

  render(){
    var cartridgeClassName = this.props.app.isLoaded ? "app-cartridge loaded" : "app-cartridge";

    return( this.props.app ?
      (
        <div className={cartridgeClassName}>
            <img draggable={false} src={require("../images/virtual-console/"+this.props.app.imgName)} alt={this.props.app.imgName}></img>
        </div>
      )
      :
      (
        null
      )
    )
  }

}

export default AppCartridge;
