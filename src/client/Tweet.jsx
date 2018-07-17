import React from 'react';

const Tweet = props => {
	const isRetweet = !!props.retweet_status;
	const author = isRetweet ? props.retweet_status.user : props.user;

	return (
		<div className="card bg-light mb-3">
			<div className="card-body">
				<h5 className="card-title">
					{author.name} {`@${author.screen_name}`}
				</h5>
				<p className="card-text">{props.text}</p>
			</div>
		</div>
	);
};

export default Tweet;
