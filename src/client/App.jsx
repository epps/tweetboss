import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Timeline from './Timeline';
import SignIn from './SignIn';

const FourOhFour = () => <h1>404</h1>;

class App extends Component {
	constructor(props) {
		super(props);
		this.getCookie = this.getCookie.bind(this);
	}

	getCookie(cookieName) {
		const cookies = document.cookie.split(' ');

		const cookiesMap = cookies.reduce((map, cookie) => {
			const cookieNameSeparatorIndex = cookie.indexOf('=');
			const keyValueString = cookie.slice(cookieNameSeparatorIndex + 1);

			const keyValues = decodeURIComponent(keyValueString)
				.split('&')
				.reduce((map, keyValue) => {
					const pair = keyValue.split('=');
					map[pair[0]] = pair[1];

					return map;
				}, {});

			map[cookie.slice(0, cookieNameSeparatorIndex)] = keyValues;

			return map;
		}, {});

		return cookiesMap[cookieName];
	}

	render() {
		const userDetails = this.getCookie('userDetails');

		return (
			<BrowserRouter>
				<div className="container-fluid">
					<Switch>
						<Route
							exact
							path="/"
							render={props =>
								!!userDetails ? (
									<Timeline
										userId={userDetails.userId}
										screenName={userDetails.screenName}
									/>
								) : (
									<Redirect
										to={{
											pathname: '/sign-in',
											state: { from: props.location }
										}}
									/>
								)
							}
						/>
						<Route path="/sign-in" component={SignIn} />
						<Route component={FourOhFour} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
