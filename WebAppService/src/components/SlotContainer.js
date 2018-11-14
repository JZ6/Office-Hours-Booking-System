import React from "react";
import moment from "moment";

export default class SlotContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			enabled: false,
			slots: []
		}
		this.prevSlots = this.copySlots(this.state.slots);
		
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleUndo = this.handleUndo.bind(this);
		
		/*
		Props:
		this.props.id = "rossbob2";
		this.props.role = "instructor";  // for the current class
		this.props.blockId = "someblock123";
		*/
	}
	
	componentDidMount() {
		// Initialize slots on load.
		this.updateSlots();
	}
	
	handleSlotClick = (i) => () => {
		if (this.state.enabled) {
			if (this.state.slots[i].identity === "") {
				// Click on empty slot to assign
				this.editSlot(i, this.props.id, "");
			} else {
				if (this.props.id === this.state.slots[i].identity) {
					// Click on own slot to delete
					this.editSlot(i, "", "");
				}
				//Click on occupied slot to do nothing
			}
		}
	}
	
	handleIdentityChange = (i) => (event) => {
		if (this.state.enabled) {
			// Delete note to protect privacy
			this.editSlot(i, event.target.value, "");
		}
	}
	
	handleNoteChange = (i) => (event) => {
		if (this.state.enabled) {
			// Can't edit note that belongs to nobody
			if (this.state.slots[i].identity !== "") {
				this.editSlot(i, this.state.slots[i].identity, event.target.value);
			}
		}
	}
	
	handleSlotConfirm = (i) => () => {
		if (this.state.enabled) {
			if (!this.slotsEqual(this.state.slots[i], updatedSlot)) {
				this.setState({enabled: false});
				this.props.api.editSlot(this.props.blockId, i, this.state.slots[i])
				.then((response) => {
					this.setState({enabled: true});
				})
				.catch((error) => {
					window.alert(error.message);
					this.setState({enabled: true});
				});
			}
		}
	}
	
	handleSlotCancel = (i) => () => {
		if (this.state.enabled) {
			this.editSlot(i, this.prevSlots[i].identity, this.prevSlots[i].note);
		}
	}
	
	handleEmpty = () => {
		if (this.state.enabled) {
			this.setState({enabled: false});
			let promises = [];
			
			if (this.props.role === "student") {
				// Student clears only their own
				for (let i = 0; i < this.state.slots.length; i++) {
					if (this.props.id === this.state.slots[i].identity) {
						promises.push(this.props.api.editSlot(this.props.blockId, i, {identity: "", note: ""}));
					}
				}
			} else {
				// Instructor clears all
				for (let i = 0; i < this.state.slots.length; i++) {
					promises.push(this.props.api.editSlot(this.props.blockId, i, {identity: "", note: ""}));
				}
			}
			
			Promise.all(promises)
			.then(([response]) => {
				// Update slots to match server's emptied slots (or not, if failed)
				this.updateSlots();
				this.setState({enabled: true});
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
			})
		}
	}
	
	handleUpdate() {
		if (this.state.enabled) {
			this.updateSlots();
		}
	}
	
	handleUndo() {
		if (this.state.enabled) {
			this.setState({slots: this.copySlots(this.prevSlots)});
		}
	}
	
	editSlot(i, identity, note) {
		const newSlots = this.copySlots(this.state.slots);
		newSlots[i].identity = identity;
		newSlots[i].note = note;
		this.setState({slots: newSlots});
	}
	
	copySlots(slots) {
		return slots.map(slot => {
			return {identity: slot.identity, note: slot.note}
		});
	}
	
	slotsEqual(a, b) {
		return (a.identity === b.identity && a.note === b.note);
	}
	
	updateSlots() {
		this.setState({enabled: false});
		this.props.api.getSlots(this.props.blockId)
		.then((data) => {
			this.prevSlots = data;
			this.setState({slots: this.copySlots(this.prevSlots)});
			this.setState({enabled: true});
		})
		.catch((error) => {
			window.alert(error.message);
			this.setState({enabled: true});
		});
		
	}
	
	renderIdentity(i) {
		if (this.props.role === "student") {
			let name;
			if (this.props.id === this.state.slots[i].identity) {
				// Student owns slot
				name = this.props.id;
			} else {
				if (this.state.slots[i].identity === "") {
					// Slot is available
					name = "Available";
				} else {
					// Slot is taken by someone else
					name = "Not Available";
				}
			}
			return <div id={`identity${i}`}>{name}</div>;
		} else {
			return (
				<input
					className="text-input"
					name={`identity${i}`}
					id={`identity${i}`}
					type="text"
					value={this.state.slots[i].identity}
					placeholder="Unassigned UtorID..."
					maxLength={50}
					onChange={this.handleIdentityChange(i)}
				/>
			);
		}
	}
	
	renderNote(i) {
		if (this.props.role !== "student" || 
				this.props.id === this.state.slots[i].identity) {
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
					onClick={this.props.role === "student" ? this.handleSlotClick(i) : () => {return false}}
				>
					<button id={`confirm${i}`} onClick={this.handleSlotConfirm(i)}>✎</button>
					<button id={`cancel${i}`} onClick={this.handleSlotCancel(i)}>❌</button>
					{moment(this.props.startTime + this.props.slotDuration * i).format("h:mmA - ")}
					{moment(this.props.startTime + this.props.slotDuration * (i + 1)).format("h:mmA")}
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
				<button id="empty-button" onClick={this.handleEmpty}>
					{this.props.role === "student" ? (
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