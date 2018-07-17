import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';
import Timeline from './Timeline';
import SignIn from './SignIn';
import FourOhFour from './FourOhFour';
import SearchResults from './SearchResults';
import SearchButton from './SearchButton';

let twitterQuery = {
	query: ''
};
let searchHistory = {};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			isAuthenticated: false,
			userDetails: {}
		};

		this.searchInput = React.createRef();

		this.getCookie = this.getCookie.bind(this);
		this.toggle = this.toggle.bind(this);
		this.logOut = this.logOut.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.resetSearchTerm = this.resetSearchTerm.bind(this);
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
		document.cookie = `userDetails='';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
		this.setState({ isAuthenticated: false, userDetails: {} });
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	handleChange(event) {
		if (event.target.value.trim().length === 0) {
			event.target.value = '';
			return;
		}
		twitterQuery.query = event.target.value.toLowerCase();
	}

	resetSearchTerm() {
		this.searchInput.current.value = '';
	}

	render() {
		const search = this.state.isAuthenticated ? (
			<div className="input-group">
				<input
					type="text"
					className="form-control"
					placeholder="Search"
					ref={this.searchInput}
					onChange={this.handleChange}
				/>
				<div className="input-group-append">{<SearchButton resetSearchTerm={this.resetSearchTerm} />}</div>
			</div>
		) : (
			<span />
		);

		const logOut = this.state.isAuthenticated ? (
			<NavItem style={{ width: '30%' }}>
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
						<Navbar className="fixed-top" color="light" light expand="md">
							<Link className="navbar-brand" to="/">
								Tweetboss
							</Link>
							<NavbarToggler onClick={this.toggle} />
							<Collapse isOpen={this.state.isOpen} navbar>
								<Nav className="ml-auto" navbar>
									{logOut}
									{search}
								</Nav>
							</Collapse>
						</Navbar>
					</div>
					<div className="container-fluid" style={{ marginTop: '85px' }}>
						<Switch>
							<Route
								exact
								path="/"
								render={props =>
									this.state.isAuthenticated ? (
										<Timeline userId={this.state.userDetails.userId} screenName={this.state.userDetails.screenName} />
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
							<Route
								path="/search-results"
								render={props => (
									<SearchResults
										{...props}
										userId={this.state.userDetails.userId}
										twitterQuery={twitterQuery}
										searchHistory={searchHistory}
									/>
								)}
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
