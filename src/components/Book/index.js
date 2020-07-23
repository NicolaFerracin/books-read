import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.scss';
import { deleteBook } from '../../Firebase';
import { MONTHS } from '../../utils';

export default ({ book }) => {
  const history = useHistory();
  const [month, year] = book.startedIn.split('-');

  const confirmDeleteBook = () => {
    const shouldDelete = window.confirm(`Are you sure you want to delete "${book.title}"`);
    if (shouldDelete) {
      deleteBook(book.id).catch(err => {
        alert('An error occured while deleting a book.', err);
      });
    }
  };

  const pushToEditBook = () => history.push(`edit-book/${book.id}`);

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
        <button onClick={pushToEditBook}>EDIT</button>
        <button onClick={confirmDeleteBook}>DELETE</button>
      </div>
    </div>
  );
};
