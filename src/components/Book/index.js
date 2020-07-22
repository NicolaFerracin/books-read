import React from 'react';
import styles from './styles.module.scss';

export default ({ book }) => (
  <div className={styles.book}>
    <div>{book.title}</div>
    <div>{book.author}</div>
    <div>{new Date(book.started_in).toString()}</div>
    <div>{book.pages}</div>
    <div>{book.status}</div>
  </div>
);
