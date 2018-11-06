import React from "react";
import moment from "moment";

export default class Slot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.utorId
		};
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(event) {
		this.setState({value: event.target.value})
	}
	
	render() {
		return (
			<div className="slot" onClick={this.props.onClick}>
				{moment(this.props.startTime).format("h:mmA - ")}
				{moment(this.props.endTime).format("h:mmA")}

				<form onSubmit={this.props.onSubmit.bind(this, this.state.value)}>
					<input
						className="text-input"
						name={this.props.name}
						type="text"
						value={this.state.value}
						placeholder="UtorID..."
						maxLength={this.props.maxLength}
						onChange={this.onChange}
					/>
					<input className="submit-input" type="submit" value="Change"/>
				</form>

				<div className="Note"> {this.props.note} </div>
			</div>
		);
	}
}
