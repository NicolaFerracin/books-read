import React, { Component } from 'react';
import Login from './components/Login';
import Provider from './provider';
import Context from './context';
import Router from './Router';

class App extends Component {
  render() {
    return (
      <Provider>
        <Context.Consumer>
          {ctx => {
            return ctx.isLoggedIn ? <Router /> : <Login />;
          }}
        </Context.Consumer>
      </Provider>
    );
  }
}

export default App;
