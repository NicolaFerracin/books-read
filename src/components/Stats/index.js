import React from 'react';

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
    <div>
      <div>Pages Read: {pagesRead}</div>
      <div>Pages Per Day: {Math.round(pagesRead / daysSinceYearStart)}</div>
      <div>Books Read: {finishedBooks.length}</div>
    </div>
  );
};
