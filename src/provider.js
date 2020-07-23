import React, { Component } from 'react';
import Context from './context';
import { onAuthStateChanged, getAllBooks } from './Firebase';

const sortByDate = (b1, b2) => {
  const [month1, year1] = b1.startedIn.split('-');
  const [month2, year2] = b2.startedIn.split('-');
  return new Date(year2, month2, 1) - new Date(year1, month1, 1);
};

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
    Object.keys(booksPerYear).forEach(
      year => (booksPerYear[year] = booksPerYear[year].sort(sortByDate))
    );

    const firstYear = Math.min(...Object.keys(booksPerYear).map(Number));

    const sortedBooks = books.sort(sortByDate);

    this.setState({ books: sortedBooks, booksPerYear, firstYear });
  };

  render() {
    return <Context.Provider value={{ ...this.state }}>{this.props.children}</Context.Provider>;
  }
}
