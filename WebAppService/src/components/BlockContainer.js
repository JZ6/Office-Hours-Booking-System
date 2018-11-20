import React from "react";
import moment from "moment";

import "../styles/BlockContainer.css";
import SlotView from "./SlotView";

export default class BlockContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			visible: false,
			enabled: false,
			block: {},
			slots: []
		}
		
		this.prevSlots = [];
		
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleUndo = this.handleUndo.bind(this);
		
		/*
		Props:
		this.props.id = "rossbob2";
		this.props.role = "instructor";  // for the current class
		this.props.blockId = "someblock123";
		*/
	}
	
	onOpen(block) {
		this.prevSlots = this.copySlots(block.appointmentSlots);
		delete block.appointmentSlots;
		this.setState({
			block: block, 
			slots: this.copySlots(this.prevSlots),
			visible: true, 
			enabled: true
		});
	}
	onClose() {
		this.setState({block: {}, visible: false, enabled: false});
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
		console.log("handleIdentityChange", i, event);
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
			this.setState({enabled: false});
			this.props.api.editSlot(this.props.blockId, i, this.state.slots[i])
			.then((response) => {
				if (response.status === 200) {
					this.updateSlot(i);
				} else {
					window.alert(response.status, response.statusText);
					this.updateSlot(i);
				}
				
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
			});
		}
	}
	
	handleSlotCancel = (i) => () => {
		if (this.state.enabled) {
			this.editSlot(i, this.prevSlots[i].identity, this.prevSlots[i].note);
			this.updateSlot(i);
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
				if (response.status === 200) {
					this.updateSlots();
				} else {
					window.alert(response.status, response.statusText);
					this.updateSlots();
				}
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
	
	updateSlots() {
		this.setState({enabled: false});
		this.props.api.getBlock(this.state.block.blockId)
		.then((response) => {
			if (response.status === 200) {
				// Successful, return json promise to next .then
				return response.json;
			} else {
				window.alert(response.status, response.statusText);
			}
			this.setState({enabled: true});
		})
		.then((data) => {
			if (data.appointmentSlots) {
				// Extract data from json promise, undefined if failure
				this.prevSlots = data.appointmentSlots;
				this.setState({slots: this.copySlots(this.prevSlots)});
			}
			this.setState({enabled: true});
		})
		.catch((error) => {
			window.alert(error.message);
			this.setState({enabled: true});
		});
	}
	
	updateSlot(i) {
		this.setState({enabled: false});
		this.props.api.getBlock(this.state.block.blockId)
		.then((response) => {
			if (response.status === 200) {
				// Successful, return json promise to next .then
				return response.json;
			} else {
				window.alert(response.status, response.statusText);
			}
			this.setState({enabled: true});
		})
		.then((data) => {
			if (data.appointmentSlots) {
				// Extract data from json promise, undefined if failure
				this.prevSlots[i] = data.appointmentSlots[i]
				this.editSlot(i, this.prevSlots[i].identity, this.prevSlots[i].note);
			}
			this.setState({enabled: true});
		})
		.catch((error) => {
			window.alert(error.message);
			this.setState({enabled: true});
		});
	}
	
	render() {
		if (this.state.visible) {
			return <div className="BlockContainer">Loading: {(!this.state.enabled).toString()}<SlotView 
				handleSlotClick={this.handleSlotClick}
				handleIdentityChange={this.handleIdentityChange}
				handleNoteChange={this.handleNoteChange}
				handleSlotConfirm={this.handleSlotConfirm}
				handleSlotCancel={this.handleSlotCancel}
				handleEmpty={this.handleEmpty}
				handleUpdate={this.handleUpdate}
				handleUndo={this.handleUndo}
				
				startTime={this.state.block.startTime}
				slotDuration={this.state.block.appointmentDuration}
				slots={this.state.slots}
				prevSlots={this.prevSlots}
				role={this.props.role}
				id={this.props.id}
			/></div>;
		}
		else {
			return null;
		}
	}
}
