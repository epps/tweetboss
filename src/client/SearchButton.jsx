import React from 'react';
import { withRouter } from 'react-router-dom';

class SearchButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.props.resetSearchTerm();
		this.props.history.push('/search-results');
	}
	render() {
		return (
			<button className="btn btn-outline-success" onClick={this.handleClick}>
				Search
			</button>
		);
	}
}

export default withRouter(SearchButton);
