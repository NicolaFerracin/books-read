import React, { Component } from 'react';
import Context from './context';
import { onAuthStateChanged } from './Firebase';

export default class Provider extends Component {
  state = {
    isLoggedIn: false
  };

  constructor(props) {
    super(props);
    onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true, user });
      }
    });
  }

  render() {
    return <Context.Provider value={{ ...this.state }}>{this.props.children}</Context.Provider>;
  }
}
