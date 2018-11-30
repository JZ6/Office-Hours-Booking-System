import React, {
	createElement as h
} from "react"

import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import '../styles/App.css'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

//import api from "./common/api";
import dummyAPI from './common/dummyApi'

import components from './';
const {
	LoginView,
	BlockContainer,
	DateTimePicker
} = components

// console.log(LoginView)

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

const DnDCalendar = withDragAndDrop(Calendar);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			authenticated: false,
			locked: true,
			id: "",
			role: ""
		};
		// this.api = new api("localhost/");

		this.api = new dummyAPI('Test');
		this.authenticated = this.authenticated.bind(this)

		// setTimeout(() => this.deleteBlock('blockid2')
		// , 2000);
	}

	authenticated(role, id) {
		this.setState({
			authenticated: true,
			locked: false,
			role: role,
			id: id,
			currentDate: new Date()
		});
		console.log('Logged in as:', role)
		this.fetchBlocks(7);
	}

	fetchBlocks(days) {
		if (!this.state.authenticated) return false;

		const startDate = new Date();
		const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days);
		const blocksPromise = this.api.getBlocks(startDate.toISOString(), endDate.toISOString());

		blocksPromise.then(
			result => {

				const {
					status,
					statusText,
					json: jsonPromise
				} = result

				if (status !== 200 || statusText !== "OK") { return false };

				this.setState({ events: [] });  // Empty out existing events

				jsonPromise().then(
					result => {
						result.blocks.forEach(block => this.addNewBlock(block));
					}
				)
			}
		)
	}

	addNewBlock(block) {
		if (!this.state.authenticated) return false;

		// console.log(block)
		const {
			appointmentDuration,
			appointmentSlots,
			courseCodes,
			startTime
		} = block;

		const totalSeconds = appointmentSlots.length * appointmentDuration / 1000;

		const endTime = new Date(startTime)
		endTime.setSeconds(endTime.getSeconds() + totalSeconds);

		const newBlockEvent = {
			start: new Date(startTime),
			end: endTime,
			title: courseCodes.toString(),
			block: block
		}
		// console.log(newBlockEvent);

		this.setState({ events: [...this.state.events, newBlockEvent] });
		return true;	//Succeeded
	}

	deleteBlock(blockId) {
		if (!this.state.authenticated) return false;

		const newEventList = this.state.events.filter(
			blockEvent => blockEvent.block.blockId !== blockId)
		// console.log(newEventList);
		this.setState({ events: newEventList });
	}

	modifyBlock(blockId, block) {
		if (!this.state.authenticated) return false;

		this.deleteBlock(blockId);
		this.addNewBlock(block);
	}

	onEventResize = (type, { event, start, end, allDay }) => {
		if (!this.state.authenticated || this.state.locked) return false;
		/* this.setState(state => {
			state.events[0].start = start;
			state.events[0].end = end;
			return { events: state.events };
		}); */
	};

	onEventDrop = ({ event, start, end, allDay }) => {
		if (!this.state.authenticated || this.state.locked) return false;
		//console.log(start);
	};

	onSelectSlot = (event) => {
		if (!this.state.authenticated ||
			this.state.locked ||
			this.state.role === "student") return false;

		let block = {
			blockId: "",
			owners: [],
			courseCodes: [],
			comment: "",
			startTime: event.start.toISOString(),
			appointmentDuration: 300000,
			appointmentSlots: [...Array(Math.floor((event.end - event.start) / 300000))]
				.map(() => ({ "identity": "", "courseCode": "", "note": "" }))
		}

		this.setState({ locked: true });
		this.refs.blockContainer.onOpen(block);
	}

	onSelectEvent = (event, e) => {
		if (!this.state.authenticated || this.state.locked) return false;

		console.log("Clicked on ", event);
		this.setState({ locked: true });
		this.refs.blockContainer.onOpen(event.block);
	};

	blockContainerCallback = (blockId, block) => {
		if (!this.state.authenticated) return false;

		if (!blockId) {
			console.log("Create");
			// No blockId, have to wait for server to send back the block with it
		} else {
			if (block) {
				console.log("Edit", blockId, block);
				this.modifyBlock(blockId, block);
			} else {
				console.log("Delete", blockId);
				this.deleteBlock(blockId);
			}
		}
		this.fetchBlocks(7);
	};

	blockContainerClose = () => {
		this.setState({ locked: false });	
	}

	render() {
		return (
			<div className="App">
				<LoginView api={this.api} authenticated={this.authenticated} />
				<DateTimePicker selected={this.state.date} onChange={this.handleChange} />
				<div className={this.state.locked ? "App-container--locked" : "App-container"}>
					<DnDCalendar
						date={this.state.currentDate}
						defaultView="week"
						events={this.state.events}
						onEventDrop={this.onEventDrop}
						onEventResize={this.onEventResize}
						onSelectEvent={this.onSelectEvent}
						selectable={this.state.role !== "student"}
						onSelectSlot={this.onSelectSlot}
						resizable
						style={{
							height: "100vh",
							padding: '0.5em'
						}}
						onNavigate={(day) => {
							this.setState({
								currentDate:day,
							});
						 }}
					// components={{toolbar: DateTimePicker}}
					/>
				</div>
				{this.state.locked ? <div className="App-LockOverlay" /> : null}
				{this.state.authenticated ?
					<BlockContainer
						ref="blockContainer"
						id={this.state.id}
						role={this.state.role}
						api={this.api}
						blockContainerCallback={this.blockContainerCallback}
						blockContainerClose={this.blockContainerClose}
					/>
					:
					null
				}
			</div>
		);
	}
}

export default App;
