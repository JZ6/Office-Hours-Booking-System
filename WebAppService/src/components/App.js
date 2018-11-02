import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import '../styles/App.css'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import components from './';

const {
  LoginView,
  BlockView,
  SideBar
} = components

console.log(LoginView)

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
        <LoginView />
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
        <BlockView ref="blockView" />
        <SideBar />
      </div>
    );
  }
}

export default App;
