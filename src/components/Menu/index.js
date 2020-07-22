import React from 'react';
import { Link } from 'react-router-dom';
import Context from '../../context';

export default () => (
  <Context.Consumer>
    {ctx => (
      <nav>
        <ul>
          <li>
            <Link to="/all">See All</Link>
          </li>
          {Object.keys(ctx.booksPerYear)
            .sort((a, b) => b - a)
            .map(year => (
              <li key={year}>
                <Link to={`/${year}`}>{year}</Link>
              </li>
            ))}
        </ul>
      </nav>
    )}
  </Context.Consumer>
);
