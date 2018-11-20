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
			enabled: false
		}
		
		// Blocks
		this.courseList = ["csc302","csc401","csc321"];
		this.handleInputChange = this.handleInputChange.bind(this);
		this.submitBlock = this.submitBlock.bind(this);
		this.updateBlock = this.updateBlock.bind(this);
		this.onClose = this.onClose.bind(this)
		
		// Slots
		this.prevSlots = [];
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleUndo = this.handleUndo.bind(this);
	}
	
	onOpen(block) {
		this.prevSlots = this.copySlots(block.appointmentSlots);
		this.setState({
			visible: true,
			enabled: true,
			...block,
			start: moment(block.startTime).format("HH:mm"),
			end: this.getEnd(block)
		});
	}
	onClose() {
		this.setState({
			visible: false,
			enabled: false
		});
	}
	
	update(scope, i) {
		if (this.state.enabled) {
			this.setState({enabled: false});
			this.props.api.getBlock(this.state.blockId)
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
					if (scope === "block") {
						this.prevSlots = data.appointmentSlots;
						this.setState({...data});
						
						this.setState({
							start: moment(data.startTime).format("HH:mm"),
							end: this.getEnd(data)
						});
					} else if (scope === "slots") {
						this.prevSlots = data.appointmentSlots;
						this.setState({appointmentSlots: this.copySlots(this.prevSlots)});
						
						this.setState({end: this.getEnd(data)});
					} else if (scope === "slot" && i) {
						this.prevSlots[i] = data.appointmentSlots[i]
						this.editSlot(i, this.prevSlots[i].identity, this.prevSlots[i].note);
						
						this.setState({end: this.getEnd(data)});
					}
				}
				this.setState({enabled: true});
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
			});
		}
	}
	
	//----------------------------------------------------------------------------
	//---------------------------------- Block -----------------------------------
	//----------------------------------------------------------------------------
	
	getEnd(block) {
		return moment(block.startTime).add(block.appointmentDuration * block.appointmentSlots.length).format("HH:mm");
	}
	
	updateSlotNumber(start, end, appointmentDuration){
		let slotNumber = Math.floor(
			(moment(end, "HH:mm") - moment(start, "HH:mm")) / appointmentDuration);
		if (slotNumber === 0) {
			this.prevSlots = [];
			this.setState({appointmentSlots: []})
		} else {
			let slots = [...Array(slotNumber)].map(() => 
				({identity: "", courseCode: "", note: ""}));
			this.prevSlots = this.copySlots(slots);
			this.setState({appointmentSlots: slots});
			
			// Update End Time?
			this.setState({
				end: moment(start, "HH:mm").add(appointmentDuration * slotNumber).format("HH:mm")
			});
			
		}
	}
	
	handleInputChange(event) {
		const value = event.target.value;
		const name = event.target.name;
		
		if (name==="appointmentDuration") {
			this.updateSlotNumber(this.state.start, this.state.end, value);
			this.setState({appointmentDuration: value});
		} else if (name === "start") {
			// Validate
			let start = value;
			if (moment(start, "HH:mm") > moment(this.state.end, "HH:mm")) {
				start = this.state.end;
			}
			this.setState({start: start});
			
			// Need to update block's actual startTime which includes date
			let newStartTime = this.state.startTime;  // String immutable
			newStartTime = moment(newStartTime)
				.hour(parseInt(start.slice(0, 2)))
				.minute(parseInt(start.slice(3, 5)))
				.second(0)
				.millisecond(0)
				.toISOString();
			this.setState({startTime: newStartTime})
			
			// Changes number of slots
			this.updateSlotNumber(start, this.state.end, this.state.appointmentDuration);
		} else if (name === "end") { 
			// Validate
			let end = value;
			if (moment(end) < moment(this.state.start)) {
				end = this.state.start;
			}
			this.setState({end: end});
			
			// Changes number of slots
			this.updateSlotNumber(this.state.start, end, this.state.appointmentDuration);
		} else if (name === "date") {
			let date = value;
			
			let newStartTime = this.state.startTime;  // String immutable
			newStartTime = moment(newStartTime)
				.year(parseInt(date.slice(0, 4)))
				.month(parseInt(date.slice(5, 7)))
				.date(parseInt(date.slice(8, 10)))
				.toISOString();
			
			this.setState({startTime:newStartTime})

			// Shouldn't change number of slots
		} else if (
			name === "owners" || 
			name === "courseCodes" || 
			name === "comment") {
			this.setState({[name]: value});
		}

		
	}

	//update relevant selectedCourses when a course is selected
	handleCourseSelection(event){
		var newSelectedCourses = this.state.selectedCourses;
		var course = event.target.id;

		var target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		//add course to course list if checked
		if (value === true){
			if(!newSelectedCourses.includes(course)){
				//add course to selected courses
				newSelectedCourses.push(course);
				this.setState({selectedCourses:newSelectedCourses});
			}
		} else { //remove course from selected courses
			var index = newSelectedCourses.indexOf(course);
			if (index > -1) {
				newSelectedCourses.splice(index, 1);
			}
		}
		console.log(this.state.selectedCourses);
	}
	
	submitBlock() {
		if (this.state.enabled) {
			this.setState({enabled: false});
			this.props.api.postBlock(this.state)  // Will be sanitized in API class
			.then((response) => {
				if (response.status !== 200) {
					window.alert(response.status, response.statusText);
				}
				this.setState({enabled: true});
				this.update("block");
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
			});
		}
	}
	
	updateBlock() {
		this.update("block");
	}
	
	//----------------------------------------------------------------------------
	//---------------------------------- Slots -----------------------------------
	//----------------------------------------------------------------------------
	
	handleSlotClick = (i) => () => {
		if (this.state.enabled) {
			if (this.state.appointmentSlots[i].identity === "") {
				// Click on empty slot to assign
				this.editSlot(i, this.props.id, "");
			} else {
				if (this.props.id === this.state.appointmentSlots[i].identity) {
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
			if (this.state.appointmentSlots[i].identity !== "") {
				this.editSlot(i, this.state.appointmentSlots[i].identity, event.target.value);
			} else {
				window.alert("Can't edit note of an unregistered slot.");
			}
		}
	}
	
	handleSlotConfirm = (i) => () => {
		if (this.state.enabled) {
			this.setState({enabled: false});
			this.props.api.editSlot(this.props.blockId, i, this.state.appointmentSlots[i])
			.then((response) => {
				if (response.status !== 200) {
					window.alert(response.status, response.statusText);
				}
				this.setState({enabled: true});
				this.update("slot", i);
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
				this.update("slot", i);
			});
		}
	}
	
	handleSlotCancel = (i) => () => {
		this.update("slot", i);
	}
	
	handleEmpty = () => {
		if (this.state.enabled) {
			this.setState({enabled: false});
			let promises = [];
			
			if (this.props.role === "student") {
				// Student clears only their own
				for (let i = 0; i < this.state.appointmentSlots.length; i++) {
					if (this.props.id === this.state.appointmentSlots[i].identity) {
						promises.push(this.props.api.editSlot(this.props.blockId, i, {identity: "", note: ""}));
					}
				}
			} else {
				// Instructor clears all
				for (let i = 0; i < this.state.appointmentSlots.length; i++) {
					promises.push(this.props.api.editSlot(this.props.blockId, i, {identity: "", note: ""}));
				}
			}
			Promise.all(promises)
			.then((responses) => {
				responses.map((response) => {
					if (response.status !== 200) {
						window.alert(response.status, response.statusText);
					}
				});
				this.setState({enabled: true});
				this.update("slots");
			})
			.catch((error) => {
				window.alert(error.message);
				this.setState({enabled: true});
				this.update("slots");
			})
		}
	}
	
	handleUpdate() {
		this.update("slots");
	}
	
	handleUndo() {
		if (this.state.enabled) {
			this.setState({appointmentSlots: this.copySlots(this.prevSlots)});
		}
	}
	
	editSlot(i, identity, note) {
		const newSlots = this.copySlots(this.state.appointmentSlots);
		newSlots[i].identity = identity;
		newSlots[i].note = note;
		this.setState({appointmentSlots: newSlots});
	}
	
	copySlots(slots) {
		return slots.map(slot => {
			return {identity: slot.identity, note: slot.note}
		});
	}
	
	//----------------------------------------------------------------------------
	//---------------------------------- Render ----------------------------------
	//----------------------------------------------------------------------------
	
	render() {
		if (this.state.visible) {
			return <div className="BlockContainer">Loading: {(!this.state.enabled).toString()}
				<BlockView 
					handleInputChange={this.handleInputChange}
					submitBlock={this.submitBlock}
					updateBlock={this.updateBlock}
					onClose={this.onClose}
					
					startTime={this.state.startTime}
					appointmentDuration={this.state.appointmentDuration}
					owners={this.state.owners}
					courseCodes={this.state.courseCodes}
					comment={this.state.comment}
					appointmentSlots={this.state.appointmentSlots}
					
					start={this.state.start}
					end={this.state.end}
					
					role={this.props.role}
					id={this.props.id}
				/>
				<SlotView 
					handleSlotClick={this.handleSlotClick}
					handleIdentityChange={this.handleIdentityChange}
					handleNoteChange={this.handleNoteChange}
					handleSlotConfirm={this.handleSlotConfirm}
					handleSlotCancel={this.handleSlotCancel}
					handleEmpty={this.handleEmpty}
					handleUpdate={this.handleUpdate}
					handleUndo={this.handleUndo}
					
					startTime={this.state.startTime}
					slotDuration={this.state.appointmentDuration}
					slots={this.state.appointmentSlots}
					prevSlots={this.prevSlots}
					role={this.props.role}
					id={this.props.id}
				/>
			</div>;
		}
		else {
			return null;
		}
	}
}
