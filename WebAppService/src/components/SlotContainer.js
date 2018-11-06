import React from "react";
import moment from "moment";
import Slot from "./Slot";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			slotCount: this.props.slots.length
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		
		for (let i = 0; i < this.props.slots.length; i ++) {
			this.state[`utorId${i}`] = this.props.slots[i].utorId;
			this.state[`note${i}`] = this.props.slots[i].note;
		}
	}

	renderSlots() {
		let output = [];
		for (let i = 0; i < this.state.slotCount; i ++) {
			output.push(
				<div className="slot" onClick={this.handleClick} key={i}>
					{moment(this.props.startTime + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(this.props.startTime + this.props.slotDuration * (i + 1)).format("h:mmA")}
					<input
						className="text-input"
						name={`utorId${i}`}
						type="text"
						value={this.state[`utorId${i}`]}
						placeholder="UtorID..."
						maxLength={50}
						onChange={this.handleChange}
					/>
					{this.state[`note${i}`]}
				</div>
			);
		}
		return output;
	}
	
	handleClick(event) {
		console.log(event.target.name);
	}
	
	handleChange(event) {
		console.log(event.target.value);
		this.setState({[event.target.name]: event.target.value});
	}
	
	handleConfirm(event) {
		let newSlots = this.state.slots.slice();  // Don't mutate state directly
		newSlots[i] = {
			utorId: value,
			note: ""
		};
		console.log(newSlots)
		this.setState({slots: newSlots});
		console.log(this.state.slots)
	}
	
	handleCancel(event) {
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
			<div className="slot-container">
				{this.renderSlots()}
				<button onClick={this.handleConfirm}>Confirm</button>
				<button onClick={this.handleCancel}>Cancel</button>
			</div>
		);
	}
}