import React from "react";
import moment from "moment";

import "../styles/BlockView.css";

export default class BlockView extends React.Component {
		constructor(props) { //props are either student or instructor. Will render differently depending which is passed
				super(props);
				this.state = {
						event: "", //data that holds the time of the event. The rest of the state variables regarding time are just for display
						display: 'none',
						startTime: 'HH:mm',
						endTime: 'HH:mm',
						negativeIntervalError: "",
						date: "yyyy-MM-dd", //events can only span over 1 day to be supported
						numberOfSlots: 12,
						slotDuration: 5,
						blockDuration: 60,
						instructorName: ["Bob Ross"],
						courseList: ["CSC302","CSC401","MAT321"], //list of eligibles courses for current instructor
						blockDescription: "",
						selectedCourses: [], //list of selected courses
						courseCheckBoxes: [], //list of checkboxes corresponding to courses
				};

				//this.props.permission is either 'student' or 'instructor'
				//this.props.course contains the course data

				//TO DO: add a variable that's set when there are unsaved changes
		}
		//renders condinally of permissions
	
	renderDurationList() {
		return (
			<label>
				Slot duration:
				<select 
					name = "appointmentDuration" 
					value={this.props.appointmentDuration} 
					onChange={this.props.handleInputChange}
				>
						// Values are in milliseconds
						<option value="300000">5 minutes</option>
						<option value="600000">10 minutes</option>
						<option value="900000">15 minutes</option>
				</select>
			</label>
		);
	}
	
	renderTimes(role) {
		if (role === "student") {
			return (
				<div className="blockTimes">
					From: {moment(this.props.start).format("HH:mm")} 
					To: {moment(this.props.end).format("HH:mm")} 
					Date: {moment(this.props.startTime).format("YYYY-MM-DD")}
				</div>
			);
		} else {
			return (
				<div className="BlockTimes">
					<div>Warning: Changing times will clear slots!</div>
					<input
						name="start"
						type="time"
						value={this.props.start}
						onChange={this.props.handleInputChange} 
					/>
					-
					<input
						name="end"
						type="time"
						value={this.props.end} 
						onChange={this.props.handleInputChange}
					/>
					<input
						name="date"
						type="date"
						value={moment(this.props.startTime).format("YYYY-MM-DD")}
						onChange={this.props.handleInputChange}
					/>
					{this.renderDurationList()}
					Slot number: {this.props.appointmentSlots.length}
				</div>
			);
		}
	}
	
	renderInfo(role) {
		if (role === "student") {
			return (
				<div className="blockInfo">
					Owners: {this.props.owners}
					<br/>
					Courses:{this.props.courseCodes}
					<br/>
					<h3>Block Description</h3>
					<div> {this.props.comment}  </div>
				</div>
			);
		} else {
			return (
				<div className="blockInfo">
					Owners: {this.props.owners}
					<br/>
					Courses:
					<input
						name="courseCodes"
						type="text"
						value={this.props.courseCodes}
						onChange={this.props.handleInputChange}
					/>
					<br/>
					Block Description
					<textarea
						value = {this.props.comment} 
						name = "comment" 
						onChange={this.props.handleInputChange} 
						rows="4" 
						cols="50" 
						placeholder="Enter block description..."
					>
					</textarea>
				</div>
			);
		}
	}
	
	render() {
		return (
			<div className="BlockView">
				<div className="close-block" onClick={this.props.onClose}>Close</div>
				{this.renderTimes(this.props.role)}
				{this.renderInfo(this.props.role)}
				<button className="submit-button" onClick={this.props.submitBlock}>Submit</button>
				<button className="submit-button" onClick={this.props.updateBlock}>Cancel</button>
			</div>
		);
	}
}
