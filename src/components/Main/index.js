import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Context from '../../context';
import Book from '../Book';
import AddBookButton from '../AddBookButton';
import Stats from '../Stats';

export default () => {
  const { year } = useParams();
  const history = useHistory();

  if (year > new Date().getFullYear()) {
    history.push('/');
  }

  const getBooksPerYear = ctx => (year === 'all' ? ctx.books : ctx.booksPerYear[year] || []);

  return (
    <Context.Consumer>
      {ctx => {
        const books = getBooksPerYear(ctx);
        return (
          <>
            <h1>
              {year[0].toUpperCase()}
              {year.substr(1)}
            </h1>
            <Stats books={books} year={year} firstYear={ctx.firstYear} />
            {books.map(book => (
              <Book book={book} key={book.id} />
            ))}
            <AddBookButton />
          </>
        );
      }}
    </Context.Consumer>
  );
};
