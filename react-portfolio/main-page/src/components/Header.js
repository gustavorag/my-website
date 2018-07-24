import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import AppService from '../utils/AppService';

import '../styles/Header.css';

class Header extends Component{

  constructor(props){
    super(props);

    this.state={
      selectedApps:undefined,
      showCollapsedNav: false,
    }

    this.handleCategorySelection = this.handleCategorySelection.bind(this);
    this.toggleNavBar = this.toggleNavBar.bind(this);
  }

  handleCategorySelection(categoryId){

    var selectedApps = undefined;

    this.setState({selectedApps:selectedApps});
  }

  toggleNavBar(show){
    this.setState({showCollapsedNav: show});
  }

  render(){

    var showNavigation = this.state.showCollapsedNav ? "show-navigation" : "";

    return (
      <div id="header">
        <nav id="react-navbar">
          <div id="react-navbar-logo">
            <a href="/#">
              <i id="react-main-logo" className="fab fa-react"></i>
            </a>
            <a id="home-link" href="/#">
              React Apps
            </a>
          </div>
          <div id="react-navbar-navigation" className={showNavigation}>
            <ul id="links">
              <li>
                <Link to={"/home/"} onClick={
                    ()=>{
                      this.toggleNavBar(false)
                    }
                  }>
                  <i class="fas fa-home"></i><p>Home</p>
                </Link>
              </li>

              <li>
                <Link to={"/apploader/"} onClick={
                    ()=>{
                      this.toggleNavBar(false)
                    }
                  }>
                  <i class="fas fa-terminal"></i><p>Virtual Console</p>
                </Link>
              </li>

              <li>
                <Link to={"/about/"} onClick={
                    ()=>{
                      this.toggleNavBar(false)
                    }
                  }>
                  <i class="fas fa-address-card"></i><p>About</p>
                </Link>
              </li>
            </ul>
            <form className="form-inline mt-2 mt-md-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
          <div id="navbar-toggler" onClick={
              ()=>{
                this.toggleNavBar(!this.state.showCollapsedNav)
              }
            }>
            <i className="fas fa-bars"></i>
          </div>

        </nav>
        <div id="react-main-info">

        </div>
      </div>
    )
  }

}

export default Header;
