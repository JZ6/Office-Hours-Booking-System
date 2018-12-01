import React from "react";
import moment from "moment";

import "../styles/BlockContainer.css";
import BlockView from "./BlockView";
import SlotView from "./SlotView";

export default class BlockContainer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			visible: false,
			locked: false,
			prevSlots: [],  // Only updated on block opening
			timeChanged: false 
		}
		
		// Block
		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateBlock = this.updateBlock.bind(this);
		this.handleSubmitBlock = this.handleSubmitBlock.bind(this);
		this.handleSubmitTime = this.handleSubmitTime.bind(this);
		this.deleteBlock = this.deleteBlock.bind(this);
		this.onClose = this.onClose.bind(this)
	}
	
	onOpen(block) {
		this.setState({
			visible: true,
			...block,
			
			start: moment(block.startTime).format("HH:mm"),
			end: this.calculateEnd(block),
			date: moment(block.startTime).format("YYYY-MM-DD"),
			duration: block.appointmentDuration,
			timeChanged: false,
			
			appointmentSlots: this.copySlots(block.appointmentSlots),
			prevSlots: this.copySlots(block.appointmentSlots)
		});
	}
	onClose() {
		if (!this.state.locked && this.state.visible) {
			this.props.blockContainerClose();
			this.setState({
				visible: false,
			});
		}
	}
	
	// Update the shown block, "block" for everything, "slot, i" for one slot
	update(scope, i) {
		
		if (!this.state.blockId) {
			// If creating (empty block ID) just close BlockContainer.
			this.props.blockContainerCallback();
			this.onClose();
		}
		
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			this.props.api.getBlock(this.state.blockId)
			.then((response) => {
				if (response.status === 200) {
					// Successful, return json promise to next .then
					return response.json();
				} else {
					window.alert(response.status, response.statusText);
				}
				this.setState({locked: false});
			})
			.then((data) => {
				if (data.appointmentSlots) {
					// Extract data from json promise, undefined if failure
					if (scope === "block") {
						this.setState({prevSlots: this.copySlots(data.appointmentSlots)});
						this.setState({...data});
						this.setState({appointmentSlots: this.copySlots(data.appointmentSlots)});
						this.setState({
							start: moment(data.startTime).format("HH:mm"),
							end: this.calculateEnd(data),
							date: moment(data.startTime).format("YYYY-MM-DD"),
							duration: data.appointmentDuration,
							timeChanged: false
						});
						
						// Update the calendar
						this.props.blockContainerCallback(data.blockId, data);
					} else if (scope === "slot") {
						let prevSlots = this.copySlots(this.state.prevSlots);
						prevSlots[i].identity = data.appointmentSlots[i].identity;
						prevSlots[i].courseCode = data.appointmentSlots[i].courseCode;
						prevSlots[i].note = data.appointmentSlots[i].note;
						this.setState({prevSlots: prevSlots});
						this.updateSlot(
							i, 
							data.appointmentSlots[i].identity, 
							data.appointmentSlots[i].courseCode, 
							data.appointmentSlots[i].note
						);
					}
				}
				this.setState({locked: false});
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({locked: false});
			});
		}
	}
	
	// POST block, "info" for just details, "time" for start/end/duration, "all"
	// for both.
	submitBlock(scope) {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			
			let block = {blockId: this.state.blockId};
			if (scope === "info" || scope === "all") {
				block.owners = this.state.owners;
				block.courseCodes = this.state.courseCodes;
				block.comment = this.state.comment;
			}
			if (scope === "time" || scope === "all") {
				let times = this.validateTime();
				if (times) {
					block.startTime = times.startTime;
					block.appointmentDuration = times.appointmentDuration;
					block.appointmentSlots = times.appointmentSlots;
				} else {
					// Invalid time parameters, abort
					window.alert("Invalid time settings.");
					this.setState({locked: false});
					return;
				}
			}
			
			// Make API call
			this.props.api.postBlock(block)
			.then((response) => {
				if (response.status !== 200) {
					window.alert(response.status, response.statusText);
				}
				this.setState({locked: false});
				this.update("block");
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({locked: false});
			});
		}
	}
	
	//============================================================================
	//================================== Block ===================================
	//============================================================================
	
	handleInputChange(event) {
		if (!this.state.locked && this.state.visible) {
			const value = event.target.value;
			const name = event.target.name;
			
			if (name === "duration") {
				this.setState({duration: value});
				this.setState({timeChanged: true});
			} else if (name === "start") {
				this.setState({start: value});
				this.setState({timeChanged: true});
			} else if (name === "end") { 
				this.setState({end: value});
				this.setState({timeChanged: true});
			} else if (name === "date") {
				this.setState({date: value});
				this.setState({timeChanged: true});
			} else if (name === "courseCodes") {
				this.setState({courseCodes: value.split(",")});
			} else if (name === "owners") {
				this.setState({owners: value.split(",")});
			} else if (name === "comment") {
				this.setState({comment: value});
			} else {
				window.alert("Invalid form element name ", name);
			}
		}
	}
	
	handleSubmitBlock(event) {
		if (this.state.blockId)
			this.submitBlock("info");  // If editing, submit only block details
		else
			this.submitBlock("all");  // If creating, submit all
	}
	
	handleSubmitTime(event) {
		this.submitBlock("time");
	}
	
	updateBlock() {
		this.update("block");
	}
	
	deleteBlock() {
		if (!this.state.locked && this.state.visible) {
			if (!this.state.blockId) {
				this.onClose();
				return false;
			}
			this.setState({locked: true});
			this.props.api.deleteBlock(this.state.blockId)
			.then((response) => {
				if (response.status !== 200) {
					window.alert(response.status, response.statusText);
				}
				this.setState({locked: false});
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({locked: false});
			});
			
			this.props.blockContainerCallback(this.state.blockId);
			this.onClose();
		}
	}
	
	// Process the staged time parameters into properties fit for a block
	validateTime() {
		let start = moment(this.state.start, "HH:mm");
		let end = moment(this.state.end, "HH:mm");
		let date = moment(this.state.date, "YYYY-MM-DD");
		let duration = parseInt(this.state.duration, 10);
		
		let startTime, appointmentSlots;

		if (start.isValid()
				&& end.isValid()
				&& date.isValid()
				&& !Number.isNaN(duration)) {
			
			// Do not allow end of block to be before start
			if (start > end) {
				end = moment(start);
			}
			
			// Need to update block's actual startTime which includes date
			startTime = moment(date)
				.hour(start.hour())
				.minute(start.minute())
				.second(start.second())
				.millisecond(start.millisecond())
				.toISOString();
			
			// Do not allow duration to be negative
			if (duration < 0) {
				duration = 0;
			}
			
			// Generate appointmentSlots array
			if (duration === 0) {
				// Do not divide by zero
				appointmentSlots = [];
			} else {
				let slotNumber = this.calculateSlotNumber(start, end, duration);
				if (slotNumber === 0) {
					// Create array with no slots
					appointmentSlots = [];
				} else {
					// Create array of empty slots
					appointmentSlots = [...Array(slotNumber)].map(() => 
						({identity: "", courseCode: "", note: ""}));
				}
			}
			
			return {
				startTime: startTime,
				appointmentDuration: duration,
				appointmentSlots: appointmentSlots
			};
		}
	}
	
	calculateEnd(block) {
		return moment(block.startTime).add(block.appointmentDuration * block.appointmentSlots.length).format("HH:mm");
	}
	
	calculateSlotNumber(start, end, duration) {
		return Math.floor((
			moment(end, "HH:mm") - 
			moment(start, "HH:mm")) / 
			duration);
	}
	
	//============================================================================
	//================================== Slots ===================================
	//============================================================================
	
	handleSlotClick = (i) => () => {
		if (!this.state.locked && this.state.visible) {
			if (this.state.appointmentSlots[i].identity === "") {
				// Click on empty slot to assign
				this.updateSlot(i, 
					this.props.id, 
					"",
					"");
			} else {
				if (this.props.id === this.state.appointmentSlots[i].identity) {
					// Click on own slot to delete
					this.updateSlot(i, 
					"", 
					"", 
					"");
				}
				//Click on occupied slot to do nothing
			}
		}
	}
	
	handleIdentityChange = (i) => (event) => {
		if (!this.state.locked && this.state.visible) {
			this.updateSlot(i, 
				event.target.value, 
				this.state.appointmentSlots[i].courseCode, 
				"");  // Delete note to protect privacy
		}
	}
	
	handleCourseChange = (i) => (event) => {
		if (!this.state.locked && this.state.visible) {
			this.updateSlot(i, 
				this.state.appointmentSlots[i].identity, 
				event.target.value, 
				this.state.appointmentSlots[i].note);
		}
	}
	
	handleNoteChange = (i) => (event) => {
		if (!this.state.locked && this.state.visible) {
			// Can't edit note that belongs to nobody
			if (this.state.appointmentSlots[i].identity !== "") {
				this.updateSlot(i, 
					this.state.appointmentSlots[i].identity, 
					this.state.appointmentSlots[i].courseCode, 
					event.target.value);
			} else {
				window.alert("Can't edit note of an unregistered slot.");
			}
		}
	}
	
	handleSlotConfirm = (i) => () => {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			this.props.api.editSlot(
				this.state.blockId, i, 
				{
					identity: this.state.appointmentSlots[i].identity, 
					courseCode: this.state.appointmentSlots[i].courseCode, 
					note: this.state.appointmentSlots[i].note
				})
			.then((response) => {
				if (response.status !== 200) {
					window.alert(response.status, response.statusText);
				}
				this.setState({locked: false});
				this.update("slot", i);
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({locked: false});
				this.update("slot", i);
			});
		}
	}
	
	handleSlotCancel = (i) => () => {
		//this.update("slot", i);
		this.updateSlot(
			i, 
			this.state.prevSlots[i].identity, 
			this.state.prevSlots[i].courseCode, 
			this.state.prevSlots[i].note
		);
	}
	
	handleEmpty = () => {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			let promises = [];
			
			if (this.props.role === "student") {
				// Student clears only their own
				for (let i = 0; i < this.state.appointmentSlots.length; i++) {
					if (this.props.id === this.state.appointmentSlots[i].identity) {
						promises.push(this.props.api.editSlot(
							this.state.blockId, i, 
							{identity: "", courseCode: "", note: ""}));
					}
				}
			} else {
				// Instructor clears all
				for (let i = 0; i < this.state.appointmentSlots.length; i++) {
					promises.push(this.props.api.editSlot(
						this.state.blockId, i, 
						{identity: "", courseCode: "", note: ""}));
				}
			}
			Promise.all(promises)
			.then((responses) => {
				responses.forEach((response) => {
					if (response.status !== 200) {
						window.alert(response.status, response.statusText);
					}
				});
				this.setState({locked: false});
				this.update("block");
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({locked: false});
				this.update("block");
			})
		}
	}
	
	updateSlot(i, identity, courseCode, note) {
		const newSlots = this.copySlots(this.state.appointmentSlots);
		newSlots[i].identity = identity;
		newSlots[i].courseCode = courseCode;
		newSlots[i].note = note;
		this.setState({appointmentSlots: newSlots});
	}
	
	copySlots(slots) {
		return slots.map(slot => {
			return {
				identity: slot.identity, 
				courseCode: slot.courseCode, 
				note: slot.note
			}
		});
	}
	
	//----------------------------------------------------------------------------
	//---------------------------------- Render ----------------------------------
	//----------------------------------------------------------------------------
	
	renderButtons(role, blockId) {
		if (role === "student") {
			return <div className="ButtonContainer">
				<button id="refresh-button" className="submit-button" onClick={this.updateBlock}>Refresh</button> 
				<button id="empty-button" onClick={this.handleEmpty}>Unregister My Slots</button>
			</div>;
		} else {
			return <div className="ButtonContainer">
				<button className="submit-button" onClick={this.handleSubmitBlock}>Submit</button>
				{blockId ? 
					<React.Fragment>
						<button id="refresh-button" className="submit-button" onClick={this.updateBlock}>Refresh</button> 
						<button id="delete-button" className="submit-button" onClick={this.deleteBlock}>Delete</button>
						<button id="empty-button" onClick={this.handleEmpty}>Unregister All Slots</button>
					</React.Fragment>
				: null}
			</div>;
		}
	}
	
	render() {
		if (this.state.visible) {
			return <div className="BlockContainer">Loading: {(this.state.locked).toString()}
				<BlockView 
					handleInputChange={this.handleInputChange}
					onClose={this.onClose}
					handleSubmitTime={this.handleSubmitTime}
					
					owners={this.state.owners}
					courseCodes={this.state.courseCodes}
					comment={this.state.comment}
					
					slotNumber={this.calculateSlotNumber(
						this.state.start, 
						this.state.end, 
						this.state.duration)}
					
					start={this.state.start}
					end={this.state.end}
					date={this.state.date}
					duration={this.state.duration}
					
					role={this.props.role}
					id={this.props.id}
					timeChanged={this.state.timeChanged}
					blockId={this.state.blockId}
				/>
				
				{this.renderButtons(this.props.role, this.state.blockId)}
				{!this.state.blockId ? 
					"Please submit the new block before editing slots."
				: 
					<SlotView 
						handleSlotClick={this.handleSlotClick}
						handleIdentityChange={this.handleIdentityChange}
						handleCourseChange={this.handleCourseChange}
						handleNoteChange={this.handleNoteChange}
						handleSlotConfirm={this.handleSlotConfirm}
						handleSlotCancel={this.handleSlotCancel}
						
						startTime={this.state.startTime}
						slotDuration={this.state.appointmentDuration}
						slots={this.state.appointmentSlots}
						prevSlots={this.state.prevSlots}
						role={this.props.role}
						id={this.props.id}
					/>
				}
			</div>;
		} else {
			return null;
		}
	}
}
