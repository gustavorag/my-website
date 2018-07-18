import React, { Component } from 'react';
import cartridgeTop from '../images/virtual-console/cartridge_top.png';
import cartridgeBottom from '../images/virtual-console/cartridge_bottom.png';

class AppCartridge extends Component{

  render(){
    var cartridgeClassName = this.props.app.isLoaded ? "app-cartridge loaded" : "app-cartridge";

    return( this.props.app ?
      (
        <div className={cartridgeClassName}>
            <img draggable={false} src={cartridgeTop} className="cartridge-top" alt="Cartridge top"></img>
            <img draggable={false} src={require("../images/virtual-console/"+this.props.app.imgName)} alt={this.props.app.imgName} className="cartridge-art"></img>
            <img draggable={false} src={cartridgeBottom} className="cartridge-bottom" alt="Cartridge bottom"></img>
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
