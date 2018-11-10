import React from "react";
import moment from "moment";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			slots: this.props.api.getSlots(this.props.blockId)
		}
		this.prevSlots = this.copySlots(this.state.slots);
		
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleUndo = this.handleUndo.bind(this);
	}
	
	handleSlotClick = (i) => () => {
		if (this.state.slots[i].utorId === "") {
			// Click on empty slot to assign
			this.editSlot(i, this.props.api.user.utorId, "");
		} else {
			if (this.props.api.user.utorId === this.state.slots[i].utorId) {
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
	
	handleSlotConfirm = (i) => () => {
		let updatedSlot = this.props.api.getSlot(this.props.blockId, i);
		if (!this.slotsEqual(this.prevSlots[i], updatedSlot)) {
			// Slot has changed since last update from server
			if (this.props.api.user.role === "student") {
				// TODO: Notify student that this slot has been taken already and abort
				this.editSlot(i, updatedSlot.utorId, updatedSlot.note);
			} else {
				// TODO: Notify instructor that someone has taken this slot and 
				// ask if they want to overwrite that anyway
			}
		} else {
			if (!this.slotsEqual(this.state.slots[i], updatedSlot)) {
				// Slot is different from one on server, post new slot
				this.props.api.postSlot(this.props.blockId, i, this.state.slots[i]);
			}
		}
	}
	
	slotsEqual(a, b) {
		return (a.utorId === b.utorId && a.note === b.note);
	}
	
	handleSlotCancel = (i) => () => {
		this.editSlot(i, this.prevSlots[i].utorId, this.prevSlots[i].note);
	}
	
	handleEmpty = () => {
		// Ensure slots match server's
		this.handleUpdate();
		if (this.props.api.user.role === "student") {
			// Student clears only their own
			for (let i = 0; i < this.state.slots.length; i++) {
				if (this.props.api.user.utorId === this.state.slots[i].utorId) {
					this.editSlot(i, "", "");
					this.props.api.postSlot(this.props.blockId, i, this.state.slots[i]);
				}
			}
		} else {
			// Instructor clears all
			let newSlots = this.state.slots.map((slot, i) => {
				return {utorId: "", note: ""}
			});
			this.setState({slots: newSlots});
			this.props.api.postSlots(this.props.blockId, this.state.slots);
		}
	}
	
	handleUpdate() {
		this.prevSlots = this.props.api.getSlots(this.props.blockId);
		this.setState({slots: this.copySlots(this.prevSlots)});
	}
	
	handleUndo() {
		this.setState({slots: this.copySlots(this.prevSlots)});
	}

	validate(input) {
		return true;
	}
	
	renderUtorId(i) {
		if (this.props.api.user.role === "student") {
			let name;
			if (this.props.api.user.utorId === this.state.slots[i].utorId) {
				// Student owns slot
				name = this.props.api.user.utorId;
			} else {
				if (this.state.slots[i].utorId === "") {
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
				this.props.api.user.utorId === this.state.slots[i].utorId) {
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
					// Only students can click to assign a free slot to themselves
					onClick={this.props.api.user.role === "student" ? this.handleSlotClick(i) : () => {return false}}
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
				<button id="empty-button" onClick={this.handleEmpty}>
					{this.props.api.user.role === "student" ? (
						"Empty My Slots"
					):(
						"Empty All Slots"
					)}
				</button>
				<button id="update-button" onClick={this.handleUpdate}>Refresh</button>
				<button id="undo-button" onClick={this.handleUndo}>Undo Changes</button>
			</div>
		);
	}
}