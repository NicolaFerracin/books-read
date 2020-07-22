import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './components/Main';

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/:year">
          <Main />
        </Route>
        <Route path="/">
          <Redirect to="/all" />
        </Route>
      </Switch>
    </Router>
  );
};
