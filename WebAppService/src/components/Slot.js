import React from "react";
import moment from "moment";

export default class Slot extends React.Component {
	render() {
		return (
			<div onClick={this.props.onClick}>
				{moment(this.props.startTime).format("h:mmA - ")}
				{moment(this.props.endTime).format("h:mmA")}

				<form onSubmit={this.props.onSubmit}>
					<input
						type="text"
						value={this.props.utorId}
						maxLength={this.props.maxLength}
						onChange={this.props.onChange}
					/>
					<input type="submit" hidden />
				</form>

				<div className="Note"> {this.props.note} </div>
			</div>
		);
	}
}
