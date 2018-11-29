import React, {
    createElement as h
} from "react"

export default class DateTimePicker extends React.Component {
    state = {
        display: 'block'
    }

    render() {
        return h("div", {
            id: "loginView"
        }, 'test')
    }
}