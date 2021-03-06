import React from "react"

import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import '../styles/App.css'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../styles/common.css';

import api from "./common/api";
import dummyAPI from './common/dummyApi'

import components from './';
const {
	LoginView,
	BlockContainer,
	DateTimePicker
} = components

const config = require('../config.json');
// console.log(config)

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
			role: "",
			currentDate: new Date()
		};
		// console.log(process.env)
		let url = "localhost";
		if (process.env.REACT_APP_url) {
			url = process.env.REACT_APP_url;
		}
		
		if (process.env.REACT_APP_useDummyAPI === "true") {
			console.log("Using dummy API");
			this.api = new dummyAPI("TESTURL");
		} else {
			console.log(`Using real API at ${url}`);
			this.api = new api(url);
		}

		this.authenticate = this.authenticate.bind(this);
		this.setState = this.setState.bind(this);

		// setTimeout(() => this.deleteBlock('blockid2')
		// , 2000);
	}

	authenticate(id, role) {
		this.setState({
			authenticated: true,
			locked: false,
			role: role,
			id: id,
			currentDate: new Date()
		});
		console.log(`Logged in as ${role} ${id}.`);
		this.fetchBlocks(7);
	}

	fetchBlocks(days) {
		if (!this.state.authenticated) return false;

		const startDate = new Date();
		const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + days);
		const blocksPromise = this.api.getBlocks(startDate.toISOString(), endDate.toISOString());
		
		blocksPromise.then((response) => {
			console.log("Response:", response);
			if (response.status === 200) {
				return response.json();
			} else {
				window.alert(`${response.status}: ${response.statusText}`);
			}
		}).then((data) => {
			if (data) {
				console.log("Response Data:", data);
				this.setState({ events: [] });  // Empty existing events
				data.blocks.forEach(block => this.addNewBlock(block));  // Repopulate
			}
		}).catch(error => {
			console.log(error);
			window.alert(error.message);
		});
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
		this.setState({locked: false});
		this.fetchBlocks(7);
	}

	changeDate = day => this.setState({ currentDate: day });

	render() {
		return (
			<div className="App">
				<LoginView api={this.api} authenticate={this.authenticate} />
				<div className={this.state.locked ? "App-container--locked" : "App-container"}>
					<DateTimePicker currentDate={this.state.currentDate} changeDate={this.changeDate} authenticated={this.state.authenticated} />
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
						onNavigate={day => this.changeDate(day)}
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
