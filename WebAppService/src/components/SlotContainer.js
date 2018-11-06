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
	
	handleSlotClick = (i) => (event) => {
		if (this.state.slots[i].utorId == "") {
			// Click on empty slot to assign
			this.updateSlot(i, this.props.user, "");
		} else {
			if (this.props.user == this.state.slots[i].utorId) {
				// Click on own slot to delete
				this.updateSlot(i, "", "");
			}
			//Click on occupied slot to do nothing
		}
	}
	
	handleUtorIdChange = (i) => (event) => {
		// Delete note to protect privacy
		this.updateSlot(i, event.target.value, "");
	}
	
	handleNoteChange = (i) => (event) => {
		// Can't edit note that belongs to nobody
		if (this.state.slots[i].utorId !== "") {
			this.updateSlot(i, this.state.slots[i].utorId, event.target.value);
		}
	}
	
	updateSlot(i, utorId, note) {
		const newSlots = this.state.slots.slice();
		newSlots[i].utorId = utorId;
		newSlots[i].note = note;
		this.setState({slots: newSlots});
	}
	
	handleEmpty = () => {
		const newSlots = this.state.slots.slice();
		newSlots.map((slot, i) => {
			if ((!this.props.isStudent) ||
					(this.props.isStudent && this.props.user == newSlots[i].utorId)){
				newSlots[i].utorId = "";
				newSlots[i].note = "";
			}
		});
		this.setState({slots: newSlots});
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
				<div 
					className="slot"
					id={`slot${i}`}
					key={i}
					onClick={this.props.isStudent ? this.handleSlotClick(i) : undefined}
				>
					{moment(this.props.startTime + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(this.props.startTime + this.props.slotDuration * (i + 1)).format("h:mmA")}
					{this.props.isStudent ? (
						<div id={`utorId${i}`}>
						{(this.props.user == this.state.slots[i].utorId) ? (
							this.props.user
						) : (
							this.state.slots[i].utorId == "" ? (
								"Available"  // Hide utorId of other students
							) : (
								"Not Available"  // Hide utorId of other students
							)
						)}</div>
					) : (
						<input
						className="text-input"
						name={`utorId${i}`}
						id={`utorId${i}`}
						type="text"
						value={this.state.slots[i].utorId}
						placeholder="Unassigned UtorID..."
						maxLength={50}
						onChange={this.handleUtorIdChange(i)}
						/>
					)}
					{(!this.props.isStudent || this.props.user == this.state.slots[i].utorId) ? (
						<input
							className="text-input"
							name={`note${i}`}
							id={`note${i}`}
							type="text"
							value={this.state.slots[i].note}
							placeholder="Empty Note..."
							maxLength={280}
							onChange={this.handleNoteChange(i)}
						/>
					) : (
						<div id={`note${i}`} />  // Hide notes that don't belong to student
					)}
				</div>
			)
		);
	}

	render() {
		return (
			<div className="slot-container">
				{this.renderSlots()}
				{this.props.isStudent ? (
					<button id="empty-button" onClick={this.handleEmpty}>Empty My Slots</button>
				):(
					<button id="empty-button" onClick={this.handleEmpty}>Empty All Slots</button>
				)}
				<button id="confirm-button" onClick={this.handleConfirm}>Confirm</button>
				<button id="cancel-button" onClick={this.handleCancel}>Cancel</button>
			</div>
		);
	}
}