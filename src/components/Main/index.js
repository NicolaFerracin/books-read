import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Context from '../../context';
import Book from '../Book';

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
        </>
      )}
    </Context.Consumer>
  );
};
