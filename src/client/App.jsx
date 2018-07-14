import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);

		this.signIn = this.signIn.bind(this);
	}

	signIn() {
		axios.get('/api/sign-in').then(response => {
			console.log('Response: ', response);
			location.href = response.data.redirectUrl;
		});
	}

	render() {
		return (
			<div>
				<h1>Tweetboss</h1>
				<button onClick={this.signIn}>Sign In</button>
			</div>
		);
	}
}

export default App;
