import React, { Component } from 'react';
import axios from 'axios';
import Tweet from './Tweet';

class Timeline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeline: [],
			hasApiError: false
		};
	}

	componentDidMount() {
		axios
			.get(
				`/api/timeline?user_id=${this.props.userId}&screen_name=${
					this.props.screenName
				}`
			)
			.then(response => {
				if (!response.data.errors) {
					this.setState({ timeline: response.data });
				} else {
					this.setState({ hasApiError: true });
				}
			});
	}

	render() {
		const timeline = this.state.timeline;
		return this.state.hasApiError ? (
			<div className="alert alert-danger" role="alert">
				An error has occurred. Please, try your request again.
			</div>
		) : (
			<div className="row">
				<div className="col" />
				<div className="col-6">
					{timeline.map(tweet => <Tweet key={tweet.id_str} {...tweet} />)}
				</div>
				<div className="col" />
			</div>
		);
	}
}

export default Timeline;
