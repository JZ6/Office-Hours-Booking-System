import React from "react";
import moment from "moment";

export default class Slot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			assignee: this.props.assignee,
			note: this.props.note,
			isSelected: false,
			warning: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleClick(event) {
		// TODO: Open edit note popup.
	}
	
	handleChange(event) {
		this.validate(event);
		this.setState({assignee: event});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		if (this.validate(this.state.value)) {
			this.setState({note: ""});  // Protect note privacy by clearing it
			this.props.apiCallback(this.state); // TODO: Call API properly
			alert("Valid assignee was submitted: " + this.state.value);
		} else {
			alert("Invalid assignee was submitted: " + this.state.value);
		}
	}
	
	validate(input) {
		if (input.length > this.props.maxLength) {
			this.setState({warning: `UtorID exceeds ${this.props.maxLength} characters.`});
			return false;
		} else {
			this.setState({warning: ""});
			return true;
		}
	}
	
	render() {
		return (
			<div 
				className={this.state.isSelected ? "Slot-Selected" : "Slot"} 
				onClick={this.handleClick}
			>
				{moment(this.props.startTime).format("h:mmA - ")}
				{moment(this.props.endTime).format("h:mmA")}
				
				<form onSubmit={this.handleSubmit}>
					<input 
						type="text" 
						value={this.state.assignee} 
						maxLength={this.props.maxLength}
						onChange={this.handleChange}
					/>
					{this.state.warning}
				</form>
				
				<div className="Note"> {this.state.note} </div>
			</div>
		);
	}
}