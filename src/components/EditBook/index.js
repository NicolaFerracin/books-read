import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { MONTHS, STATUSES, firstToUpperCase } from '../../utils';
import { editBook, getBook } from '../../Firebase';

const BASE_YEAR = 1900;

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

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isPosting: true });
    const { id, title, author, month, year, pages, status } = this.state;
    const updatedBook = {
      title: title,
      author: author,
      startedIn: `${month}-${year}`,
      pages: Number(pages),
      status: status
    };
    await editBook(id, updatedBook)
      .then(() => {
        this.setState({ isPosting: false });
        this.props.history.push('/');
      })
      .catch(err => {
        alert('An error occured while editing a book.', err);
      });
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { isPosting, title, author, month, year, pages, status } = this.state;

    if (!title) {
      return <h3>Loading...</h3>;
    }

    const NOW = new Date();

    return (
      <form onSubmit={this.handleSubmit} disabled>
        <label>
          Title:
          <input type="text" name="title" value={title} onChange={this.handleChange} required />
        </label>
        <label>
          Author:
          <input type="text" name="author" onChange={this.handleChange} value={author} />
        </label>
        <label>
          Started In:
          <select name="month" value={month} onChange={this.handleChange} required>
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year:
          <select name="year" value={year} onChange={this.handleChange} required>
            {Array(NOW.getFullYear() - BASE_YEAR + 1)
              .fill(1)
              .map((_, idx) => {
                const year = BASE_YEAR + idx;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
          </select>
        </label>
        <label>
          Pages:
          <input type="number" name="pages" value={pages} onChange={this.handleChange} required />
        </label>
        <label>
          Status:
          <select name="status" value={status} onChange={this.handleChange}>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {firstToUpperCase(s)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={isPosting}>
          Edit Book
        </button>
      </form>
    );
  }
}

export default withRouter(EditBook);
