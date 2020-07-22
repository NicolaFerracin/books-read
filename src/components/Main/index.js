import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

export default () => {
  const { year } = useParams();
  const history = useHistory();

  if (year > new Date().getFullYear()) {
    history.push('/');
  }

  return <h1>{year}</h1>;
};
