import React from "react";
import moment from "moment";

export default class Slot extends React.Component {
	render() {
		return (
			<div
				onClick={this.props.onClick}
				onChange={this.props.onChange}
				onSubmit={this.props.onSubmit}
			>
				{moment(this.props.startTime).format("h:mmA - ")}
				{moment(this.props.endTime).format("h:mmA")}

				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						value={this.props.utorId}
						maxLength={this.props.maxLength}
						onChange={this.handleChange}
					/>
					<input type="submit" hidden />
				</form>

				<div className="Note"> {this.props.note} </div>
			</div>
		);
	}
}
