import React, { Component } from 'react';
import Login from './components/Login';
import Provider from './provider';
import Context from './context';

class App extends Component {
  render() {
    return (
      <Provider>
        <Context.Consumer>
          {ctx => {
            return ctx.isLoggedIn ? <h1>{ctx.user.displayName}</h1> : <Login />;
          }}
        </Context.Consumer>
      </Provider>
    );
  }
}

export default App;
