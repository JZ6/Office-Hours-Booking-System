import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import logo from "./logo.svg";

const localizer = Calendar.momentLocalizer(moment);

class App extends Component {
  state = {
    events: [
      {
        start: new Date(),
        end: new Date(moment().add(1, "hours")),
        title: "Some title"
      },
			{
        start: new Date(),
        end: new Date(moment().add(2, "hours")),
        title: "Some title"
      },
			{
        start: new Date(),
        end: new Date(moment().add(2, "hours")),
        title: "Some title"
      },
			{
        start: new Date(moment().add(1, "hours")),
        end: new Date(moment().add(2, "hours")),
        title: "Some title"
      }
    ]
  };
	
	handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
	}

  render() {
    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "100vh" }}
					selectable
					timeslots="1"
					step="60"
					onSelectEvent={event => alert(event.title)}
					onSelectSlot={this.handleSelect}
					drilldownView="day"
					scrollToTime={new Date()}
        />
      </div>
    );
  }
}

export default App;
