import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "./logo.svg";

import Sidebar from "./Sidebar.js";
import BlockView from "./BlockView.js";

import components from './components';

console.log(components.login)

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
  state = {
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
				<div className="App-container">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<h1 className="App-title">Welcome to React</h1>
					</header>
					<p className="App-intro">
						To get started, edit <code>src/App.js</code> and save to reload.
					</p>
					<DnDCalendar
						defaultDate={new Date()}
						defaultView="month"
						events={this.state.events}
						onEventDrop={this.onEventDrop}
            onEventResize={this.onEventResize}
            onSelectEvent={this.onSelectEvent}
						resizable
						style={{ height: "100vh" }}
					/>
				</div>
        <BlockView ref="blockView" />
				<Sidebar/>
      </div>
    );
  }
}

export default App;
