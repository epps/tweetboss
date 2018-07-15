import React, { Component } from 'react';
import { Button, Container, Jumbotron } from 'reactstrap';
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
		return (
			<div style={{ marginTop: '25px' }}>
				<Jumbotron fluid>
					<Container fluid>
						<h2 className="display-3">You're Not Logged In</h2>
						<p className="lead">
							To use Tweetboss, you need to log in with Twitter first.
						</p>
						<hr className="my-2" />
						<p className="lead text-center">
							<Button color="primary" onClick={this.signIn}>
								Sign In
							</Button>
						</p>
					</Container>
				</Jumbotron>
			</div>
		);
	}
}

export default SignIn;
