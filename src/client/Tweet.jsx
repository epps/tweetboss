import React from 'react';

const Tweet = props => {
	const isRetweet = !!props.retweet_status;
	const author = isRetweet ? props.retweet_status.user : props.user;

	return (
		<div className="card bg-light mb-3">
			<div className="card-body">
				<h5 className="card-title">
					<div className="row">
						<div className="col-2">
							<img style={{ borderRadius: '25%' }} src={author.profile_image_url_https} alt="User profile image" />
						</div>
						<div className="col">
							{author.name} {`@${author.screen_name}`}
						</div>
					</div>
				</h5>
				<p className="card-text">{props.text}</p>
			</div>
		</div>
	);
};

export default Tweet;
