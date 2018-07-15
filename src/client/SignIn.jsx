import React, { Component } from 'react';
import axios from 'axios';

class SignIn extends Component {
	constructor(props) {
		super(props);

		this.signIn = this.signIn.bind(this);
	}

	signIn() {
		axios.get('/api/sign-in').then(response => {
			location.href = response.data.redirectUrl;
		});
	}

	render() {
		return <button onClick={this.signIn}>Sign In</button>;
	}
}

export default SignIn;
