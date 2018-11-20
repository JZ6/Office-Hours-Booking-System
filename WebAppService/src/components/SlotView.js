import React from "react";
import moment from "moment";

export default class SlotView extends React.Component {
	slotsEqual(a, b) {
		return (a.identity === b.identity && a.note === b.note);
	}
	
	renderIdentity(i) {
		if (this.props.role === "student") {
			let name;
			if (this.props.id === this.props.slots[i].identity) {
				// Student owns slot
				name = this.props.id;
			} else {
				if (this.props.slots[i].identity === "") {
					// Slot is available
					name = "Available";
				} else {
					// Slot is taken by someone else
					name = "Not Available";
				}
			}
			return <span id={`identity${i}`}>{name}</span>;
		} else {
			return (
				<input
					className="text-input"
					name={`identity${i}`}
					id={`identity${i}`}
					type="text"
					value={this.props.slots[i].identity}
					placeholder="Unassigned UtorID..."
					maxLength={50}
					onChange={this.props.handleIdentityChange(i)}
				/>
			);
		}
	}
	
	renderNote(i) {
		if (this.props.role !== "student" || 
				this.props.id === this.props.slots[i].identity) {
			// Note editable by instructor or student author
			return (
				<input
					className="text-input"
					name={`note${i}`}
					id={`note${i}`}
					type="text"
					value={this.props.slots[i].note}
					placeholder="Empty Note..."
					maxLength={280}
					onChange={this.props.handleNoteChange(i)}
				/>
			);
		} else {
			// Note by someone else hidden
			return <span id={`note${i}`} />;
		}
	}
	
	renderSlotButtons(i) {
		if (!this.slotsEqual(this.props.slots[i], this.props.prevSlots[i])) {
			return <span>
				<button id={`confirm${i}`} onClick={this.props.handleSlotConfirm(i)}>Confirm</button>
				<button id={`cancel${i}`} onClick={this.props.handleSlotCancel(i)}>Cancel</button>
			</span>;
		}
		return <span />
	}
	
	getSlotClass(i) {
		if (this.props.role !== "student") {
			return "slot";
		}
		if (this.props.slots[i].identity === this.props.id) {
			return "slot--mine";
		} else if (this.props.slots[i].identity === "") {
			return "slot";
		} else {
			return "slot--taken";
		}
	}
	
	renderSlots() {
		return (
			this.props.slots.map((slot, i) => 
				<div 
					className={this.getSlotClass(i)}
					id={`slot${i}`}
					key={i}
					// Only students can click to assign a free slot to themselves
					onClick={this.props.role === "student" ? this.props.handleSlotClick(i) : () => {return false}}
				>
				{this.renderSlotButtons(i)}
					{moment(moment(this.props.startTime) + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(moment(this.props.startTime) + this.props.slotDuration * (i + 1)).format("h:mmA")}
					{this.renderIdentity(i)}
					{this.renderNote(i)}
				</div>
			)
		);
	}

	render() {
		return (
			<div className="slot-container">
				{this.renderSlots()}
				<button id="empty-button" onClick={this.props.handleEmpty}>
					{this.props.role === "student" ? (
						"Empty My Slots"
					):(
						"Empty All Slots"
					)}
				</button>
				<button id="update-button" onClick={this.props.handleUpdate}>Refresh</button>
				<button id="undo-button" onClick={this.props.handleUndo}>Undo Changes</button>
			</div>
		);
	}
}