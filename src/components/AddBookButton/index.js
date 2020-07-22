import React from 'react';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();

  return (
    <button className={styles.addBook} onClick={() => history.push('/add-book')}>
      +
    </button>
  );
};
