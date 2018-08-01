import React, { Component } from 'react';

class TemperatureComponent extends Component{

  render(){

    return(
      <div className="Temperature">
        <p className="Temperature-value">{this.props.temps[this.props.tempType]}<sup>o</sup></p>
        <span className="Temperature-type">{this.props.tempType.toUpperCase()}</span>
      </div>
    )
  }
}

export default TemperatureComponent;
