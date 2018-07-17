import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Tweet from './Tweet';

class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			results: [],
			searchTerm: ''
		};
		this.getSearchResults = this.getSearchResults.bind(this);
	}

	shouldComponentUpdate() {
		const searchHistory = this.props.searchHistory;
		const query = this.props.twitterQuery.query;

		if (!searchHistory.hasOwnProperty(query) && query.length) {
			this.getSearchResults();
		}

		if (searchHistory.hasOwnProperty(query) && query.length) {
			this.setState({ results: searchHistory[query], searchTerm: query });
			this.props.twitterQuery.query = '';
		}

		return true;
	}

	componentDidMount() {
		if (this.props.searchHistory.hasOwnProperty(this.props.twitterQuery.query)) {
			this.setState({
				results: this.props.searchHistory[this.props.twitterQuery.query],
				searchTerm: query
			});
			this.props.twitterQuery.query = '';
		} else {
			if (this.props.userId) {
				this.getSearchResults();
			}
		}
	}

	getSearchResults() {
		axios
			.get(`/api/search?user_id=${this.props.userId}&twitter_query=${this.props.twitterQuery.query}`)
			.then(response => {
				if (!response.data.errors) {
					this.props.searchHistory[this.props.twitterQuery.query] = response.data.statuses;
					this.setState({ results: response.data.statuses, searchTerm: this.props.twitterQuery.query });
					this.props.twitterQuery.query = '';
				}
			});
	}

	render() {
		if (!this.props.userId) {
			return (
				<Redirect
					to={{
						pathname: '/',
						state: { from: this.props.location }
					}}
				/>
			);
		} else {
			const searchAlert = this.state.results.length ? (
				<div className="alert alert-success" role="alert">
					Search results for "{this.state.searchTerm}"
				</div>
			) : (
				<span />
			);
			return (
				<div>
					{searchAlert}
					<div className="row">
						<div className="col" />
						<div className="col-6">{this.state.results.map(tweet => <Tweet key={tweet.id_str} {...tweet} />)}</div>
						<div className="col" />
					</div>
				</div>
			);
		}
	}
}

export default SearchResults;
