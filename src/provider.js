import React, { Component } from 'react';
import Context from './context';
import { onAuthStateChanged, getAllBooks } from './Firebase';

export default class Provider extends Component {
  state = {
    isLoggedIn: false,
    books: []
  };

  constructor(props) {
    super(props);
    onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true, user });
        this.getData();
      }
    });
  }

  getData = async () => {
    // data is not iterable, need to loop through it
    const books = [];
    (await getAllBooks()).forEach(entry => {
      books.push({ ...entry.data(), id: entry.id });
    });
    this.setState({ books });
  };

  getDataForBook = book => ({});

  render() {
    return <Context.Provider value={{ ...this.state }}>{this.props.children}</Context.Provider>;
  }
}
