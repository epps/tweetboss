import React, { Component } from 'react';
import axios from 'axios';
import Tweet from './Tweet';

class Timeline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeline: []
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
				this.setState({ timeline: response.data });
			});
	}

	render() {
		const timeline = this.state.timeline;
		return (
			<div>
				{timeline.map(tweet => <Tweet key={tweet.id_str} {...tweet} />)}
			</div>
		);
	}
}

export default Timeline;
