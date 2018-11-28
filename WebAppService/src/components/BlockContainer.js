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
			prevSlots: [], //only updated on block opening
			timeChanged: false 
		}
		
		// Block
		this.handleInputChange = this.handleInputChange.bind(this);

		this.submitBlock_properties = this.submitBlock_properties.bind(this);
		this.submitBlock_everything = this.submitBlock_everything.bind(this);
		this.submit = this.submit.bind(this);

		this.updateBlock = this.updateBlock.bind(this);
		this.submitTime = this.submitTime.bind(this);
		this.deleteBlock = this.deleteBlock.bind(this);
		this.onClose = this.onClose.bind(this)
	}
	
	onOpen(block) {
		this.setState({
			originalNumberOfSlots : block.appointmentSlots.length,
			visible: true,
			...block,
			start: moment(block.startTime).format("HH:mm"),
			end: this.getEnd(block),
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
							end: this.getEnd(data)
						});
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
						
						this.setState({end: this.getEnd(data)});
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
	
	updateSlotNumber(start, end, appointmentDuration){
		if (!this.state.locked && this.state.visible) {
			let slotNumber = Math.floor(
				(moment(end, "HH:mm") - moment(start, "HH:mm")) / appointmentDuration);
			if (slotNumber === 0) {
				this.setState({appointmentSlots: []});
			} else {
				let slots = [...Array(slotNumber)].map(() => 
					({identity: "", courseCode: "", note: ""}));
				// this.setState({prevSlots: this.copySlots(slots)});
				this.setState({appointmentSlots: slots});
				
				// Update End Time?
				this.setState({
					end: moment(start, "HH:mm").add(appointmentDuration * slotNumber).format("HH:mm")
				});
			}
		}
	}
	
	handleInputChange(event) {
		if (!this.state.locked && this.state.visible) {
			const value = event.target.value;
			const name = event.target.name;
			
			if (name==="appointmentDuration") {
				let duration = parseInt(value, 10);
				if (duration && duration > 0) {
					this.updateSlotNumber(this.state.start, this.state.end, duration);
					this.setState({appointmentDuration: duration});
				}
			} else if (name === "start") {
				// just change display start time
				let start = value;
				this.setState({start: start});
				this.setState({timeChanged:true})
				
			} else if (name === "end") { 
				// just change display end time
				let end = value;
				this.setState({end: end});
				this.setState({timeChanged:true})

				
			} else if (name === "date") {
				// ValiDATE
				let date = value;
				if (moment(date, "YYYY-MM-DD").isValid()) {
					let newStartTime = moment(date, "YYYY-MM-DD")
						.add(moment(this.state.startTime).hour(), "hours")
						.add(moment(this.state.startTime).minute(), "minutes")
						.add(moment(this.state.startTime).second(), "seconds")
						.toISOString();
					this.setState({startTime:newStartTime})

					// Shouldn't change number of slots
				}
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
	
	//submits non time-related attributes (doesn't submit slots)
	//only called from submit
	submitBlock_properties() {
		if (!this.state.locked && this.state.visible) {
			
			this.setState({locked: true});
			let block = {
				blockId: this.state.blockId,
				
				owners: this.state.owners,
				courseCodes: this.state.courseCodes,
				comment: this.state.comment
			}

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

	//submits time-related attributes (also submits all the slots)
	//only called from submit
	submitBlock_everything(){
		if (!this.state.locked && this.state.visible) {
			this.setState({locked: true});
			let block = {
				blockId: this.state.blockId,
				owners: this.state.owners,
				courseCodes: this.state.courseCodes,
				comment: this.state.comment,
				startTime: this.state.startTime,
				appointmentDuration: this.state.appointmentDuration,
				appointmentSlots: this.state.appointmentSlots
			}

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

	//submits whole block and closes it. 
	//Also checks for changes in slots number and submits different attributes accordingly
	submit(){
		console.log(this.state.prevSlots)
			console.log(this.state.appointmentSlots);
		if(this.state.prevSlots.length!==this.state.appointmentSlots.length){
			this.submitBlock_everything();
			
		}else{
			console.log("properties")
			this.submitBlock_properties();
		}
		
		//prepare for callback
		let block = {
			blockId: this.state.blockId,
			owners: this.state.owners,
			courseCodes: this.state.courseCodes,
			comment: this.state.comment,
			startTime: this.state.startTime,
			appointmentDuration: this.state.appointmentDuration,
			appointmentSlots: this.state.appointmentSlots
		}
		//THIS CAUSES ERRORS BECAUSE API IS CREATING BLOCKS WITH MISSING ATTRIBUTES
		this.props.blockContainerCallback(this.state.blockId, block);
		this.onClose();
	}

	
	updateBlock() {
		this.update("block");
	}

	//checks inputted time, validates it and updates slots accordingly
	//doesn't post the block.
	submitTime(){
		console.log("hey");
		if (!this.state.locked && this.state.visible) {
		this.setState({timeChanged:false});
	
			let start = this.state.start;
			let end = this.state.end;
			
			// Validate
			if (moment(start, "HH:mm").isValid() && moment(end, "HH:mm").isValid()) {
				if (moment(start, "HH:mm") > moment(end, "HH:mm")) {
					end = this.state.start;
					this.setState({end:end});
				}

				// Need to update block's actual startTime which includes date
				let newStartTime = this.state.startTime;  // String immutable
				newStartTime = moment(newStartTime)
					.hour(parseInt(start.slice(0, 2), 10))
					.minute(parseInt(start.slice(3, 5), 10))
					.second(0)
					.millisecond(0)
					.toISOString();
				this.setState({startTime: newStartTime})
				
				// Changes number of slots
				this.updateSlotNumber(start, end, this.state.appointmentDuration);
			}
		}
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
		this.update("slot", i);
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
				<button className="submit-button" onClick={this.submit}>Submit</button>
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
					startTime={this.state.startTime}
					appointmentDuration={this.state.appointmentDuration}
					owners={this.state.owners}
					courseCodes={this.state.courseCodes}
					comment={this.state.comment}
					appointmentSlots={this.state.appointmentSlots}
					blockId={this.state.blockId}
					
					start={this.state.start}
					end={this.state.end}
					
					role={this.props.role}
					id={this.props.id}
					timeChanged={this.state.timeChanged}
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
