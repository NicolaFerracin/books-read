import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { editBook, getBook } from '../../Firebase';
import BookForm from '../BookForm';

class EditBook extends Component {
  state = { isPosting: false };

  async componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const rawBook = await getBook(id);
    const book = rawBook.data();
    const [month, year] = book.startedIn.split('-');
    this.setState({
      id: rawBook.id,
      ...book,
      month,
      year
    });
  }

  handleSubmit = async (book, id) => {
    await editBook(id, book).catch(err => {
      alert('An error occured while editing a book.', err);
    });
    return true;
  };

  render() {
    return (
      <BookForm key={this.state.id} page="edit" {...this.state} handleSubmit={this.handleSubmit} />
    );
  }
}

export default withRouter(EditBook);
