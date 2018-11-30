import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import '../styles/DateTimePicker.css'

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.props.changeDate(date)
    }

    render() {
        return this.props.authenticated ? (
            <DatePicker
                id='DateTimePicker'
                selected={this.props.currentDate}
                onChange={this.handleChange}
            />
        ): null;
    }
}