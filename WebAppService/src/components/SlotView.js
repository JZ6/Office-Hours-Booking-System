import React from "react";
import moment from "moment";

import "../styles/SlotView.css";

export default class SlotView extends React.Component {
	slotsEqual(a, b) {
		return (a && b && a.identity === b.identity && a.note === b.note);
	}
	
	renderIdentity(i) {
		if (this.props.role === "student") {
			let name;
			if (this.props.id === this.props.slots[i].identity) {
				// Student owns slot
				name = <button id={`identity${i}`} onClick={this.props.handleSlotClick(i)}>Unregister</button>;
			} else {
				if (this.props.slots[i].identity === "") {
					// Slot is available
					name = <button id={`identity${i}`} onClick={this.props.handleSlotClick(i)}>Register</button>;
				} else {
					// Slot is taken by someone else
					name = <button id={`identity${i}`} disabled>Not Available</button>;
				}
			}
			return name;
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
		if (this.slotsEqual(this.props.slots[i], this.props.prevSlots[i])) {
			// No changes
			return <span />
		} else {
			// Pending changes
			return <span>
				<button id={`confirm${i}`} onClick={this.props.handleSlotConfirm(i)}>Confirm</button>
				<button id={`cancel${i}`} onClick={this.props.handleSlotCancel(i)}>Cancel</button>
			</span>;
		}
		
	}
	
	getSlotClass(i) {
		if (this.props.role !== "student") {
			return "Slot";
		}
		if (this.props.slots[i].identity === this.props.id) {
			return "Slot--mine";
		} else if (this.props.slots[i].identity === "") {
			return "Slot";
		} else {
			return "Slot--taken";
		}
	}
	
	renderSlots() {
		return (
			this.props.slots.map((slot, i) => 
				<div 
					className={this.getSlotClass(i)}
					id={`slot${i}`}
					key={i}
				>
					{moment(moment(this.props.startTime) + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(moment(this.props.startTime) + this.props.slotDuration * (i + 1)).format("h:mmA")}
					{this.renderIdentity(i)}
					{this.renderNote(i)}
					{this.renderSlotButtons(i)}
				</div>
			)
		);
	}

	render() {
		return (
			<div className="slot-container">
				{this.renderSlots()}
			</div>
		);
	}
}