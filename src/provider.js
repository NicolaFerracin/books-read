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

    const firstYear = Math.min(...Object.keys(booksPerYear).map(Number));

    const sortedBooks = books.sort((b1, b2) => {
      const year1 = b1.startedIn.split('-')[1];
      const year2 = b2.startedIn.split('-')[1];
      return year2 - year1;
    });

    this.setState({ books: sortedBooks, booksPerYear, firstYear });
  };

  render() {
    return <Context.Provider value={{ ...this.state }}>{this.props.children}</Context.Provider>;
  }
}
