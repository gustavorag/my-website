import React, { Component } from 'react';
import Utils from '../utils/Utils';
import Draggable from '../modules/Draggable';
import AppCartridge from './AppCartridge';

class CartridgeShelf extends Component {

  constructor(props){
    super(props);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragEnd(mouse, item){
    this.props.onCartridgeRelease(mouse, item);
  }

  render(){
    return this.props.mouseTrack ?
    (
      <div id="react-cartridge-shelf" className={Utils.isArrayEmpty(this.props.apps) ? " collapsed" : ""}>
        {
          Utils.isArrayEmpty(this.props.apps) ? null : (
            <ul>
              {
                this.props.apps.map(
                  (item)=>{
                    if(!item.isLoaded){
                      return(
                        <li key={item.id}>
                          <Draggable mouseTrackerId={item.id} cursorClass={{grab: "cartridge-grab", grabbing: "cartridge-grabbing"}} mouseTrack={this.props.mouseTrack}
                            draggableItem={item}
                            >
                            <AppCartridge app={item} mouse={this.props.mouse}/>
                          </Draggable>
                        </li>
                      )
                    }else{
                      return null;
                    }
                  }
                )
              }
            </ul>
          )
        }
      </div>
    )
    :
    null
  }
}

export default CartridgeShelf;
