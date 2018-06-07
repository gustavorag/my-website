import React, { Component } from 'react';
import './App.css';


import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Routes from './components/Routes';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
