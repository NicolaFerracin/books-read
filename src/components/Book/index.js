import React from 'react';
import styles from './styles.module.scss';
import { deleteBook } from '../../Firebase';
import { MONTHS } from '../../utils';

export default ({ book }) => {
  const [month, year] = book.startedIn.split('-');

  const confirmDeleteBook = book => {
    const shouldDelete = window.confirm(`Are you sure you want to delete "${book.title}"`);
    if (shouldDelete) {
      deleteBook(book.id).catch(err => {
        alert('An error occured while deleting a book.', err);
      });
    }
  };

  return (
    <div className={styles.book}>
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div>
        {MONTHS[month]} {year}
      </div>
      <div>{book.pages}</div>
      <div>{book.status}</div>
      <div>
        <button onClick={() => confirmDeleteBook(book)}>DELETE</button>
      </div>
    </div>
  );
};
