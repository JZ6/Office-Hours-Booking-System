import React from "react";
import moment from "moment";

import "../styles/BlockView.css";

export default class BlockView extends React.Component {
	renderDurationList() {
		return (
			<label>
				Slot duration:
				<select 
					name = "appointmentDuration" 
					value={this.props.appointmentDuration} 
					onChange={this.props.handleInputChange}
				>
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
					From: {moment(this.props.start, "HH:mm").format("hh:mmA")}, 
					To: {moment(this.props.end, "HH:mm").format("hh:mmA")}, 
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
					{this.props.timeChanged ? <button className="submit-button" onClick={this.props.submitTime}>Refresh slots</button>:" "}
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
					Owners:
					<input
						name="owners"
						type="text"
						value={this.props.owners}
						onChange={this.props.handleInputChange}
					/>
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
			</div>
		);
	}
}
