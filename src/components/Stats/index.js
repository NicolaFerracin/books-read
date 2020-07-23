import React from 'react';
import styles from './styles.module.scss';

const getDaysSinceYearStart = (year, firstYear) => {
  const end = new Date();
  // if showing all books, we should start counting from the first year ever
  const start = new Date(year === 'all' ? firstYear : end.getFullYear(), 0, 1);

  // if showing past years' books, the year is already over
  if (year < new Date().getFullYear()) {
    return 365;
  }

  return Math.ceil((end - start + 1) / 86400000);
};

export default ({ books, year, firstYear }) => {
  const finishedBooks = books.filter(b => b.status === 'finished');
  const daysSinceYearStart = getDaysSinceYearStart(year, firstYear);
  const pagesRead = finishedBooks.reduce((acc, b) => acc + b.pages, 0);

  return (
    <div className={styles.stats}>
      <div className={styles.box}>
        <div className={styles.title}>Pages Read</div>
        <div className={styles.value}>{pagesRead}</div>
      </div>
      <div className={styles.box}>
        <div className={styles.title}>Pages Per Day</div>
        <div className={styles.value}>{Math.round(pagesRead / daysSinceYearStart)}</div>
      </div>
      <div className={styles.box}>
        <div className={styles.title}>Books Read</div>
        <div className={styles.value}>{finishedBooks.length}</div>
      </div>
    </div>
  );
};
