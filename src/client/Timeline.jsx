import React, { Component } from 'react';
import axios from 'axios';

class Timeline extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		axios.get(
			`/api/timeline?user_id=${this.props.userId}&screen_name=${
				this.props.screenName
			}`
		);
		return <h1>Timeline</h1>;
	}
}

export default Timeline;
