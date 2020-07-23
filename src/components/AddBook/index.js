import React, { Component } from 'react';
import { addBook } from '../../Firebase';
import BookForm from '../BookForm';

class AddBook extends Component {
  handleSubmit = async newBook => {
    const bookRef = await addBook(newBook).catch(err => {
      alert('An error occured while adding a new book.', err);
    });
    return !!bookRef;
  };

  render() {
    return <BookForm page="add" {...this.state} handleSubmit={this.handleSubmit} />;
  }
}

export default AddBook;
