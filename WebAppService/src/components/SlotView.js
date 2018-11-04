import React from "react";
import moment from "moment";

export default class SlotView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			warning: ""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(event) {
		this.validate(event);
		this.setState({value: event});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		if (this.validate(this.state.value)) {
			alert("Valid note was submitted: " + this.state.value);
			this.props.apiCallback(this.state); // TODO: Call API properly
		} else {
			alert("Invalid note was submitted: " + this.state.value);
		}
	}
	
	validate(input) {
		if (input.length > this.props.maxLength) {
			this.setState({warning: `Note exceeds ${this.props.maxLength} characters.`});
			return false;
		} else {
			this.setState({warning: ""});
			return true;
		}
	}
	
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="submit" value="Submit" />
        <label>
					<h1>
						{this.props.author}'s Note for 
						{moment(this.props.startTime).format(" h:mmA - ")}
						{moment(this.props.endTime).format("h:mmA")}
					</h1>
          {this.state.warning}
          <textarea 
						type="text" 
						value={this.state.value}
						maxLength={this.props.maxLength}
						onChange={this.handleChange}
					/>
        </label>
      </form>
		);
	}
}