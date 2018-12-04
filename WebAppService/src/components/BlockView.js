import React from "react";
import moment from "moment";

import "../styles/BlockView.css";

export default class BlockView extends React.Component {
	renderDurationList() {
		return (
			<label>
				Slot duration:
				<select 
					name = "duration" 
					value={this.props.duration} 
					onChange={this.props.handleInputChange}
				>
						<option value="300000">5 minutes</option>
						<option value="600000">10 minutes</option>
						<option value="900000">15 minutes</option>
						<option value="1800000">30 minutes</option>
						<option value="3600000">60 minutes</option>
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
					Date: {this.props.date}
				</div>
			);
		} else {
			return (
				<div className="blockTimes">
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
						value={this.props.date}
						onChange={this.props.handleInputChange}
					/>
					{this.renderDurationList()}
					Slot number: {this.props.slotNumber}
					<br/>
					{this.renderTimeSubmit()}
				</div>
				
			);
		}
	}
	
	renderTimeSubmit() {
		if (this.props.blockId) {
			// If editing...
			return <div>
				<button 
					className="submit-button"
					onClick={this.props.handleSubmitTime}
					disabled={!this.props.timeChanged}
				>
					Change Time
				</button> Warning: Changing times will clear slots!
			</div>;
		} else {
			// If creating, this button's functionality is bundled in the other 
			// Submit button in BlockContainer's render.
			return null;
		}
	}
	
	renderInfo(role) {
		if (role === "student") {
			return (
				<div className="blockInfo">
					<p>Owners: {this.props.owners}</p>
					<p>Courses:{this.props.courseCodes}</p>
					<p><h3>Block Description</h3></p>
					<br/>
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
					Courses:
					<input
						name="courseCodes"
						type="text"
						value={this.props.courseCodes}
						onChange={this.props.handleInputChange}
					/>
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
				<div className="close-block" onClick={this.props.onClose}>X</div>
				{this.renderTimes(this.props.role)}
				{this.renderInfo(this.props.role)}
			</div>
		);
	}
}
