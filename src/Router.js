import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Menu from './components/Menu';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import Main from './components/Main';
import Layout from './components/Layout';

export default () => {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route path="/add-book">
          <Layout>
            <AddBook />
          </Layout>
        </Route>
        <Route path="/edit-book/:id">
          <Layout>
            <EditBook />
          </Layout>
        </Route>
        <Route path="/:year">
          <Layout>
            <Main />
          </Layout>
        </Route>
        <Route path="/">
          <Redirect to="/all" />
        </Route>
      </Switch>
    </Router>
  );
};
