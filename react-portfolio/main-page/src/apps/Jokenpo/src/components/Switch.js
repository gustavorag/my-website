import React, { Component } from 'react';
import './Switch.css';


class Switch extends Component {

  constructor(props){
    super(props);

    this.state = {
      isOn: props.isOn,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    var newValue = !this.state.isOn;
    this.setState({isOn:newValue});
    if(this.props.onChangeValue){
      this.props.onChangeValue(newValue)
    }
  }

  render() {

    var cursorClass = "switch-selector-cursor " + (this.state.isOn ? "on" : "off");

    return(
      <div className="switch-compoment">
        <p className="label">{this.props.label}</p>
        <div className="switch-selector" onClick={this.handleClick}>
          <p><span className="on-label">on</span><span className="off-label">off</span></p>
          <span className={cursorClass}></span>
        </div>
      </div>
    )
  }
}

export default Switch;
