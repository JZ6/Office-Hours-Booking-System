import React from "react";
import moment from "moment";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			slots: this.props.slots
		};
	}

	renderSlots() {
		return (
			this.state.slots.map((slot, i) =>
				<Slot
					key={i}
					startTime={this.props.startTime + this.props.slotDuration * i}
					endTime={this.props.startTime + this.props.slotDuration * (i + 1)}
					utorId={slot.utorId}
					note={slot.note}
					maxLength={50}
					onChange=(this.handleChange(i)}
					onSubmit={this.handleSubmit(i)}
					onClick={this.handleClick(i)}
				/>
			);
		);
	}

	handleChange(i, event) {
		this.validate(event);
		let newSlots = this.state.slots.slice();  // Don't mutate state directly
		newSlots[i] = {
			utorId: newSlots[i].utorId,
			note:
		};
		this.setState({slots});
	}

	handleSubmit(i, event) {
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

	handleClick(i) {

	}

	handleConfirm() {

	}

	handleCancel() {

	}

	render() {
		return (
			<div className="slot-container">
				{renderSlots()}
				<button onClick={this.handleConfirm}>Confirm</button>
				<button onClick={this.handleCancel}>Cancel</button>
			</div>
		);
	}
}