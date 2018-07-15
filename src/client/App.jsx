import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	Button,
	Form,
	Input
} from 'reactstrap';
import Timeline from './Timeline';
import SignIn from './SignIn';

const FourOhFour = () => <h1>404</h1>;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			isAuthenticated: false,
			userDetails: {}
		};

		this.getCookie = this.getCookie.bind(this);
		this.toggle = this.toggle.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	componentDidMount() {
		const userDetails = this.getCookie('userDetails');
		this.setState({ isAuthenticated: !!userDetails, userDetails: userDetails });
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

	logOut() {
		document.cookie = '';
		this.setState({ isAuthenticated: false, userDetails: {} });
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		const search = this.state.isAuthenticated ? (
			<Form inline className="my-2 my-lg-0">
				<Input type="search" name="search" placeholder="Search" />
				<Button outline color="success">
					Search
				</Button>
			</Form>
		) : (
			<span />
		);

		const logOut = this.state.isAuthenticated ? (
			<NavItem>
				<NavLink href="#" onClick={this.logOut}>
					Log Out
				</NavLink>
			</NavItem>
		) : (
			<span />
		);

		return (
			<BrowserRouter>
				<div>
					<div>
						<Navbar color="light" light expand="md">
							<NavbarBrand href="/">Tweetboss</NavbarBrand>
							<NavbarToggler onClick={this.toggle} />
							<Collapse isOpen={this.state.isOpen} navbar>
								<Nav className="ml-auto" navbar>
									{logOut}
									{search}
								</Nav>
							</Collapse>
						</Navbar>
					</div>
					<div className="container-fluid">
						<Switch>
							<Route
								exact
								path="/"
								render={props =>
									this.state.isAuthenticated ? (
										<Timeline
											userId={this.state.userDetails.userId}
											screenName={this.state.userDetails.screenName}
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
							<Route
								exact
								path="/sign-in"
								render={props =>
									!this.state.isAuthenticated ? (
										<SignIn />
									) : (
										<Redirect
											to={{
												pathname: '/',
												state: { from: props.location }
											}}
										/>
									)
								}
							/>
							<Route component={FourOhFour} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
