import React, { Component } from 'react';
import { MONTHS, STATUSES, capitalize } from '../../utils';
import styles from './styles.module.scss';

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
      status: props.status || 'started'
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
      window.location = '/';
    }
  };

  render() {
    const { page, isPosting, title, author, month, year, pages, status } = this.state;
    const now = new Date();

    return (
      <>
        <h1>{capitalize(page)} Book</h1>
        <form onSubmit={this.handleSubmit} disabled className={styles.form}>
          <div className={styles.formControl}>
            <label>
              Title
              <input type="text" name="title" value={title} onChange={this.handleChange} required />
            </label>
          </div>
          <div className={styles.formControl}>
            <label>
              Author
              <input type="text" name="author" value={author} onChange={this.handleChange} />
            </label>
          </div>
          <div className={styles.formControl}>
            <label>
              Started In Month
              <select name="month" value={month} onChange={this.handleChange} required>
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.formControl}>
            <label>
              Year
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
          </div>
          <div className={styles.formControl}>
            <label>
              Pages
              <input
                type="number"
                name="pages"
                value={pages}
                onChange={this.handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formControl}>
            <label>
              Status
              <select name="status" value={status} onChange={this.handleChange}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {capitalize(s)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.buttonWrapper}>
            <button type="submit" disabled={isPosting}>
              {capitalize(page)} Book
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default BookForm;
