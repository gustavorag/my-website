import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppService from '../utils/AppService';

class Header extends Component{

  constructor(props){
    super(props);

    var categories = AppService.getCategories();

    this.state={
      selectedApps:undefined,
      categories: categories,
    }
    this.handleCategorySelection = this.handleCategorySelection.bind(this);
  }

  handleCategorySelection(categoryId){

    var selectedApps = undefined;

    for(let index=0; index < this.state.categories.length; index++){
      if(this.state.categories[index].id === categoryId){
        selectedApps = this.state.categories[index].apps;
        break;
      }
    }
    console.log("selectedApps - "+JSON.stringify(selectedApps))
    this.setState({selectedApps:selectedApps});
  }

  render(){

    return (
      <div id="header">
        <nav id="react-navbar" className="navbar navbar-expand-lg navbar-light">
          <a href="/#" onClick={()=>{
              this.props.onCategorySelection(null);
            }}>
            <i id="react-main-logo" className="fab fa-react"></i>
          </a>
          <a id="home-link" href="/#" onClick={()=>{
              this.props.onCategorySelection(null);
            }}>
            React Apps
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#categoriesNavBar" aria-controls="categoriesNavBar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="categoriesNavBar">
            <div className="navbar-nav">
              {
                this.state.categories.map((category) => (
                    <Link key={category.name} to={"/apploader/"+category.id}>
                      {category.name}
                    </Link>
                  )
                )
              }
            </div>
          </div>
          <div id="react-main-info">

          </div>
          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn my-2 my-sm-0" type="submit">Search</button>
          </form>
        </nav>
      </div>
    )
  }

}

export default Header;
