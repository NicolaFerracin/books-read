import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Menu from './components/Menu';
import AddBook from './components/AddBook';
import Main from './components/Main';

export default () => {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route path="/add-book">
          <AddBook />
        </Route>
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
