import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import api from "./common/api";

import '../styles/App.css'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import components from './';

import dummyAPI from './common/dummyApi'

const {
	LoginView,
	BlockView,
	SideBar
} = components

// console.log(LoginView)

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [
				{
					start: new Date(),
					end: new Date(moment().add(1, "days")),
					title: "Test Event"
				},
				{
					start: new Date(moment().add(1, "days")),
					end: new Date(moment().add(2, "days")),
					title: "Test Event"
				},
			]
		};
		// this.api = new api("localhost/");

		this.api = new dummyAPI('Test');
		this.fetchBlocks('test');
	}

	fetchBlocks() {
		const startDate = new Date();
		const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);   //7 day week
		const blocksPromise = this.api.getBlocks(startDate.toISOString(), endDate.toISOString());

		blocksPromise.then(
			result => {

				const {
					status,
					statusText,
					json: jsonPromise
				} = result

				if (status !== 200 || statusText !== "OK") { return false };

				jsonPromise.then(
					result => {
						const { blocks } = result;
						console.log(blocks)
						for (var i = 0; i < blocks.length; i++) {
							this.addNewBlock(blocks[i]);
						}
					}
				)
			}
		)
	}

	addNewBlock(block) {
		console.log(block)
		const {
			appointmentDuration,
			appointmentSlots,
			blockId,
			comment,
			courseCodes,
			owners,
			startTime
		} = block;

		const totalSeconds = appointmentSlots.length * appointmentDuration / 1000;

		const endTime = new Date(startTime)
		endTime.setSeconds(endTime.getSeconds() + totalSeconds);

		const newBlockEvent = {
			start: new Date(startTime),
			end: endTime,
			title: courseCodes.toString(),
			details: {
				appointmentSlots: appointmentSlots,
				blockId: blockId,
				comment: comment,
				owners: owners,
			}
		}
		console.log(newBlockEvent);

		this.setState({ events: [...this.state.events, newBlockEvent] });
	}

	onEventResize = (type, { event, start, end, allDay }) => {
		this.setState(state => {
			state.events[0].start = start;
			state.events[0].end = end;
			return { events: state.events };
		});
	};

	onEventDrop = ({ event, start, end, allDay }) => {
		console.log(start);
	};

	onSelectEvent = (event, e) => {
		this.refs.blockView.onSelectEvent(event);
	};

	render() {
		return (
			<div className="App">
				<LoginView api={this.api} />
				<div className="App-container">
					<DnDCalendar
						defaultDate={new Date()}
						defaultView="week"
						events={this.state.events}
						onEventDrop={this.onEventDrop}
						onEventResize={this.onEventResize}
						onSelectEvent={this.onSelectEvent}
						resizable
						style={{
							height: "95vh",
							paddingTop: '1em'
						}}
					/>
				</div>
				<BlockView ref="blockView" permission={"instructor"} />
				<SideBar />
			</div>
		);
	}
}

export default App;
