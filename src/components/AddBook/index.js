import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { addBook } from '../../Firebase';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const STATUSES = ['started', 'finished', 'unfinished'];

class AddBook extends Component {
  state = { isPosting: false };

  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.author = React.createRef();
    this.startedIn = React.createRef();
    this.pages = React.createRef();
    this.status = React.createRef();
  }

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isPosting: true });
    const newBook = {
      title: this.title.current.value,
      author: this.author.current.value,
      startedIn: Number(this.startedIn.current.value),
      pages: Number(this.pages.current.value),
      status: this.status.current.value
    };
    const bookRef = await addBook(newBook).catch(err => {
      alert('An error occured while adding a new book.', err);
    });
    if (bookRef) {
      this.setState({ isPosting: false });
      this.props.history.push('/');
    }
  };

  render() {
    const { isPosting } = this.state;
    const NOW = new Date();

    return (
      <form onSubmit={this.handleSubmit} disabled>
        <label>
          Title:
          <input type="text" name="title" ref={this.title} required />
        </label>
        <label>
          Author:
          <input type="text" name="author" ref={this.author} />
        </label>
        <label>
          Started In:
          <select name="started-in" defaultValue={NOW.getMonth() + 1} ref={this.startedIn} required>
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pages:
          <input type="number" name="pages" ref={this.pages} required />
        </label>
        <label>
          Status:
          <select name="status" defaultValue={STATUSES[0]} ref={this.status}>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.substr(1)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={isPosting}>
          Add Book
        </button>
      </form>
    );
  }
}

export default withRouter(AddBook);
