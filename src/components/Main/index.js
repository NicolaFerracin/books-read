import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Context from '../../context';
import Book from '../Book';
import AddBookButton from '../AddBookButton';

export default () => {
  const { year } = useParams();
  const history = useHistory();

  if (year > new Date().getFullYear()) {
    history.push('/');
  }

  return (
    <Context.Consumer>
      {ctx => (
        <>
          <h1>{year}</h1>
          {ctx.books.map(book => (
            <Book book={book} key={book.id} />
          ))}
          <AddBookButton />
        </>
      )}
    </Context.Consumer>
  );
};
