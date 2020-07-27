import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './styles.module.scss';
import { deleteBook } from '../../Firebase';
import { MONTHS } from '../../utils';

const emojis = {
  started: '📖',
  finished: '✔️',
  unfinished: '⭕️'
};

export default ({ book }) => {
  const history = useHistory();
  const [month, year] = book.startedIn.split('-');

  const confirmDeleteBook = () => {
    const shouldDelete = window.confirm(`Are you sure you want to delete "${book.title}"`);
    if (shouldDelete) {
      deleteBook(book.id)
        .catch(err => {
          alert('An error occured while deleting a book.', err);
        })
        .finally(() => {
          window.location = '/';
        });
    }
  };

  const pushToEditBook = () => history.push(`edit-book/${book.id}`);

  return (
    <div className={styles.book}>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.title}>{book.title}</div>
          <div className={styles.status} title={book.status}>
            {emojis[book.status]}
          </div>
        </div>
        <div className={styles.author}>by {book.author}</div>
        <div className={styles.contentFooter}>
          <div className={styles.date}>
            {MONTHS[month]} {year}
          </div>
          <div className={styles.pages}>{book.pages} pages</div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.edit} onClick={pushToEditBook}>
          edit
        </button>
        <button className={styles.delete} onClick={confirmDeleteBook}>
          delete
        </button>
      </div>
    </div>
  );
};
