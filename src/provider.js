import React, { Component } from 'react';
import Context from './context';
import { onAuthStateChanged, getAllBooks } from './Firebase';

export default class Provider extends Component {
  state = {
    isLoggedIn: false,
    books: [],
    booksPerYear: {}
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
    const booksPerYear = books.reduce((booksPerYear, book) => {
      const year = book.startedIn.split('-')[1];
      if (booksPerYear[year]) {
        booksPerYear[year].push(book);
      } else {
        booksPerYear[year] = [book];
      }
      return booksPerYear;
    }, {});
    this.setState({ books, booksPerYear });
  };

  render() {
    return <Context.Provider value={{ ...this.state }}>{this.props.children}</Context.Provider>;
  }
}
