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
		this.submitBlock = this.submitBlock.bind(this);
		this.submitTime = this.submitTime.bind(this);
		this.deleteBlock = this.deleteBlock.bind(this);
		this.onClose = this.onClose.bind(this)
	}
	
	onOpen(block) {
		this.setState({
			visible: true,
			...block,
			
			start: moment(block.startTime).format("HH:mm"),
			end: this.getEnd(block),
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
	
	update(scope, i) {
		// If creating (empty block ID) just close box.
		if (!this.state.blockId) {
			// Update the calendar
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
						console.log(data);
						this.setState({prevSlots: this.copySlots(data.appointmentSlots)});
						this.setState({...data});
						this.setState({appointmentSlots: this.copySlots(data.appointmentSlots)});
						this.setState({
							start: moment(data.startTime).format("HH:mm"),
							end: this.getEnd(data),
							date: moment(data.startTime).format("YYYY-MM-DD"),
							duration: data.appointmentDuration,
							timeChanged: false
						});
						
						// Update the calendar
						this.props.blockContainerCallback(data.blockId, data);
					} else if (scope === "slot") {
						let prevSlots = this.copySlots(this.state.prevSlots);
						prevSlots[i].identity = data.appointmentSlots[i].identity;
						prevSlots[i].note = data.appointmentSlots[i].note;
						this.setState({prevSlots: prevSlots});
						this.editSlot(
							i, 
							data.appointmentSlots[i].identity, 
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
	
	//----------------------------------------------------------------------------
	//---------------------------------- Block -----------------------------------
	//----------------------------------------------------------------------------
	
	getEnd(block) {
		return moment(block.startTime).add(block.appointmentDuration * block.appointmentSlots.length).format("HH:mm");
	}
	
	
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

	//update relevant selectedCourses when a course is selected
	handleCourseSelection(event){
		if (!this.state.locked && this.state.visible) {
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
	}

	// POSTs block excluding startTime, appointmentDuration, appointmentSlots
	// unless creating a block.
	submitBlock() {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			
			let block = {
				blockId: this.state.blockId,
				owners: this.state.owners,
				courseCodes: this.state.courseCodes,
				comment: this.state.comment,
			}
			
			// If creating, append times then post
			if (this.state.blockId === "") {
				let times = this.__processTime();
				if (times) {
					block.startTime = times.startTime;
					block.appointmentDuration = times.appointmentDuration;
					block.appointmentSlots = times.appointmentSlots;
					this.setState({locked: false});
					this.__postBlock(block);
				} else {
					window.alert("Invalid time settings.");
					this.setState({locked: false});
				}
			} else {
				// If editing, just post
				this.setState({locked: false});
				this.__postBlock(block);
			}
		}
	}
	
	// POSTs startTime, appointmentDuration, appointmentSlots, to be called only
	// when time changes.
	submitTime() {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			
			let times = this.__processTime();
			if (times) {
				let block = {
					blockId: this.state.blockId,
					startTime: times.startTime,
					appointmentDuration: times.appointmentDuration,
					appointmentSlots: times.appointmentSlots
				}
				this.setState({locked: false});
				this.__postBlock(block);
			} else {
				window.alert("Invalid time settings.");
				this.setState({locked: false});
			}
		}
	}
	
	__postBlock(block) {
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
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
	
	__processTime() {
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
				let slotNumber = Math.floor((end - start) / duration);
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
		} else {
			return null;
		}
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
	
	//----------------------------------------------------------------------------
	//---------------------------------- Slots -----------------------------------
	//----------------------------------------------------------------------------
	
	handleSlotClick = (i) => () => {
		if (!this.state.locked && this.state.visible) {
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
		if (!this.state.locked && this.state.visible) {
			// Delete note to protect privacy
			this.editSlot(i, event.target.value, "");
		}
	}
	
	handleNoteChange = (i) => (event) => {
		if (!this.state.locked && this.state.visible) {
			// Can't edit note that belongs to nobody
			if (this.state.appointmentSlots[i].identity !== "") {
				this.editSlot(i, this.state.appointmentSlots[i].identity, event.target.value);
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
		this.editSlot(
			i, 
			this.state.prevSlots[i].identity, 
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
	
	editSlot(i, identity, note) {
		const newSlots = this.copySlots(this.state.appointmentSlots);
		newSlots[i].identity = identity;
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
				<button className="submit-button" onClick={this.submitBlock}>Submit</button>
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
					submitTime={this.submitTime}
					
					owners={this.state.owners}
					courseCodes={this.state.courseCodes}
					comment={this.state.comment}
					
					slotNumber={Math.floor((
						moment(this.state.end, "HH:mm") - 
						moment(this.state.start, "HH:mm")) / 
						this.state.duration)}
					
					start={this.state.start}
					end={this.state.end}
					date={this.state.date}
					duration={this.state.duration}
					
					role={this.props.role}
					id={this.props.id}
					timeChanged={this.state.timeChanged}
					isCreating={this.state.blockId === ""}
				/>
				
				{this.renderButtons(this.props.role, this.state.blockId)}
				{!this.state.blockId ? 
					"Please submit the new block before editing slots."
				: 
					<SlotView 
						handleSlotClick={this.handleSlotClick}
						handleIdentityChange={this.handleIdentityChange}
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
