import React, { Component } from 'react';

// Author: Gustavo Rocha de Almeida Guimaraes
// Dropdown item selector to hold cities
class CitiesDropdown extends Component{

  constructor(props){
    super(props);

    this.initialLabel = "Select the city";

    this.state = {

    }

  }

  render(){


    return(
      <div className="CitiesDropdown">
        <select name="city" onChange={this.props.onSelectItem}>
          <option value={null}>{this.initialLabel}</option>
          {
            this.props.cities.map((city)=>{
              return (
                <option key={city.id} value={city.id}>{city.name}</option>
              )
            })
          }
        </select>
      </div>
    );
  }

}

export default CitiesDropdown;
