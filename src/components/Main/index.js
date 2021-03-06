import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Context from '../../context';
import { capitalize } from '../../utils';
import Book from '../Book';
import AddBookButton from '../AddBookButton';
import Stats from '../Stats';
import styles from './styles.module.scss';

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
          <main>
            <h1>
              {capitalize(year)} {year === 'all' && 'Books'}
            </h1>
            <Stats books={books} year={year} firstYear={ctx.firstYear} />
            <div className={styles.books}>
              {books.map(book => (
                <Book book={book} key={book.id} />
              ))}
            </div>
            <AddBookButton />
          </main>
        );
      }}
    </Context.Consumer>
  );
};
