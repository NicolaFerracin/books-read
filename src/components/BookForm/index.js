import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { MONTHS, STATUSES, firstToUpperCase } from '../../utils';

const BASE_YEAR = 1900;

class BookForm extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      ...props,
      id: props.id,
      title: props.title || '',
      author: props.author || '',
      month: props.month || now.getMonth(),
      year: props.year || now.getFullYear(),
      pages: props.pages || '',
      status: props.status
    };
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isPosting: true });
    const { id, title, author, month, year, pages, status } = this.state;
    const newBook = {
      title,
      author,
      startedIn: `${month}-${year}`,
      pages: Number(pages),
      status
    };

    const success = await this.props.handleSubmit(newBook, id);
    if (success) {
      this.setState({ isPosting: false });
      this.props.history.push('/');
    }
  };

  render() {
    const { isPosting, title, author, month, year, pages, status } = this.state;
    const now = new Date();

    return (
      <form onSubmit={this.handleSubmit} disabled>
        <label>
          Title:
          <input type="text" name="title" value={title} onChange={this.handleChange} required />
        </label>
        <label>
          Author:
          <input type="text" name="author" value={author} onChange={this.handleChange} />
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
            {Array(now.getFullYear() - BASE_YEAR + 1)
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

export default withRouter(BookForm);
