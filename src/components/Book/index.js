import React from 'react';
import styles from './styles.module.scss';
import { MONTHS } from '../../utils';

export default ({ book }) => {
  const [month, year] = book.startedIn.split('-');

  return (
    <div className={styles.book}>
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div>
        {MONTHS[month]} {year}
      </div>
      <div>{book.pages}</div>
      <div>{book.status}</div>
    </div>
  );
};
