import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import AppLoader from './AppLoader';
import About from './About';
import NotFound from './NotFound';

const AppLoaderComponent = ({match}) => (
  <AppLoader key={match.params.categoryId} categoryId={match.params.categoryId}/>
)

const Routes = () =>(
  <div id="content">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/apploader/:categoryId" component={AppLoaderComponent} />
      <Route path="/about" component={About} />
      <Route exact component={NotFound} /> {/*If there is no path, any path that do not exist will show this component*/}
      </Switch>
    </div>
  );

export default Routes;
