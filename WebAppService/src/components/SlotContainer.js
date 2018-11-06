import React from "react";
import moment from "moment";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			slots: this.props.slots
		}
	}
	
	update(slots) {
		this.setState({slots: slots});
	}
	
	handleClick(event) {
	}
	
	handleUtorIdChange = (i) => (event) => {
		this.setState({[`utorId${i}`]: event.target.value});
		this.setState({[`note${i}`]: ""}); // Delete note to protect privacy
	}
	
	handleConfirm(event) {
	}
	
	handleCancel(event) {
	}

	validate(input) {
		return true;
	}
	
	renderSlots() {
		return (
			this.state.slots.map((slot, i) => 
				<div className="slot" id={`slot${i}`} onClick={this.handleClick} key={i}>
					{moment(this.props.startTime + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(this.props.startTime + this.props.slotDuration * (i + 1)).format("h:mmA")}
					<input
						className="text-input"
						name={`utorId${i}`}
						id={`utorId${i}`}
						type="text"
						value={this.state.slots[i].utorId}
						placeholder="UtorID..."
						maxLength={50}
						onChange={this.handleUtorIdChange(i)}
					/>
					{this.state.slots[i].note}
				</div>
			)
		);
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