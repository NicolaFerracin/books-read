import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../Firebase';
import Context from '../../context';
import styles from './styles.module.scss';

export default () => {
  const { pathname } = useLocation();

  return (
    <Context.Consumer>
      {ctx => (
        <div className={styles.sidebar}>
          <h2>{ctx.user.displayName}'s books</h2>
          <nav className={styles.nav}>
            <ul>
              <li className={`${styles.li} ${pathname === '/all' ? styles.active : ''}`}>
                <Link to="/all">All Books</Link>
              </li>
              {Object.keys(ctx.booksPerYear)
                .sort((a, b) => b - a)
                .map(year => (
                  <li
                    key={year}
                    className={`${styles.li} ${pathname === `/${year}` ? styles.active : ''}`}
                  >
                    <Link to={`/${year}`}>{year}</Link>
                  </li>
                ))}
            </ul>
          </nav>
          <div className={styles.footer}>
            <button onClick={logout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      )}
    </Context.Consumer>
  );
};
