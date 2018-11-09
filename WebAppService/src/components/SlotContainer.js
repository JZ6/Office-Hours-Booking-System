import React from "react";
import moment from "moment";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			slots: this.props.api.getSlots(this.props.blockId)
		}
		this.prevslots = this.copySlots(this.state.slots);
	}
	
	update() {
		this.prevslots = this.copySlots(this.state.slots);
		this.setState({slots: this.props.api.getSlots(this.props.blockId)});
	}
	
	handleSlotClick = (i) => (event) => {
		if (this.state.slots[i].utorId == "") {
			// Click on empty slot to assign
			this.editSlot(i, this.props.api.user.utorId, "");
		} else {
			if (this.props.api.user.utorId == this.state.slots[i].utorId) {
				// Click on own slot to delete
				this.editSlot(i, "", "");
			}
			//Click on occupied slot to do nothing
		}
	}
	
	handleUtorIdChange = (i) => (event) => {
		// Delete note to protect privacy
		this.editSlot(i, event.target.value, "");
	}
	
	handleNoteChange = (i) => (event) => {
		// Can't edit note that belongs to nobody
		if (this.state.slots[i].utorId !== "") {
			this.editSlot(i, this.state.slots[i].utorId, event.target.value);
		}
	}
	
	editSlot(i, utorId, note) {
		const newSlots = this.copySlots(this.state.slots);
		newSlots[i].utorId = utorId;
		newSlots[i].note = note;
		this.setState({slots: newSlots});
	}
	
	copySlots(slots) {
		return slots.map(slot => {
			return {utorId: slot.utorId, note: slot.note}
		});
	}
	
	handleSlotConfirm = (i) => (event) => {
		let updatedSlot = this.props.api.getSlot(this.props.blockId, i);
		console.log(updatedSlot)
		if (!this.slotsEqual(this.prevslots[i], updatedSlot)) {
			console.log("deep")
			// Slot has changed since last update from server
			if (this.props.api.user.role == "student") {
				// TODO: Notify student that this slot has been taken already and abort
				this.editSlot(i, updatedSlot.utorId, updatedSlot.note);
			} else {
				// TODO: Notify instructor that someone has taken this slot and 
				// ask if they want to overwrite that anyway
			}
		} else {
			if (!this.slotsEqual(this.state.slots[i], updatedSlot)) {
				// Slot is different from one on server, post new slot
				console.log("indeep")
				this.props.api.postSlot(this.props.blockId, i, this.state.slots[i]);
			}
		}
	}
	
	slotsEqual(a, b) {
		return (a.utorId == b.utorId && a.note == b.note);
	}
	
	handleSlotCancel = (i) => (event) => {
		this.editSlot(i, this.prevslots[i].utorId, this.prevslots[i].note);
	}
	
	handleEmpty = () => {
		//const newSlots = this.copySlots(this.state.slots);
		let newSlots = this.state.slots.map((slot, i) => {
			if ((this.props.api.user.role !== "student") ||
					(this.props.api.user.role == "student" && this.props.api.user.utorId == newSlots[i].utorId)){
				return {utorId: "", note: ""};
			} else {
				return {utorId: this.state.slots[i].utorId, note: this.state.slots[i].note};
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
	
	renderUtorId(i) {
		if (this.props.api.user.role == "student") {
			let name;
			if (this.props.api.user.utorId == this.state.slots[i].utorId) {
				// Student owns slot
				name = this.props.api.user.utorId;
			} else {
				if (this.state.slots[i].utorId == "") {
					// Slot is available
					name = "Available";
				} else {
					// Slot is taken by someone else
					name = "Not Available";
				}
			}
			return <div id={`utorId${i}`}>{name}</div>;
		} else {
			return (
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
			);
		}
	}
	
	renderNote(i) {
		if (this.props.api.user.role !== "student" || 
				this.props.api.user.utorId == this.state.slots[i].utorId) {
			// Note editable by instructor or student author
			return (
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
			);
		} else {
			// Note by someone else hidden
			return <div id={`note${i}`} />;
		}
	}
	
	renderSlots() {
		return (
			this.state.slots.map((slot, i) => 
				<div 
					className="slot"
					id={`slot${i}`}
					key={i}
					onClick={this.props.api.user.role == "student" ? this.handleSlotClick(i) : undefined}
				>
					<button id={`confirm${i}`} onClick={this.handleSlotConfirm(i)}>✎</button>
					<button id={`cancel${i}`} onClick={this.handleSlotCancel(i)}>❌</button>
					{moment(this.props.startTime + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(this.props.startTime + this.props.slotDuration * (i + 1)).format("h:mmA")}
					{this.renderUtorId(i)}
					{this.renderNote(i)}
				</div>
			)
		);
	}

	render() {
		return (
			<div className="slot-container">
				{this.renderSlots()}
				{this.props.api.user.role == "student" ? (
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