import React, {
    createElement as h
} from "react"

import "../css/LoginView.css";

export default class LoginView extends React.Component {
    state = {
        display: 'block'
    };

    hideOverlay() {
        this.setState({
            display: 'none'
        })
        console.log(1)
    }

    render() {
        return this.state.display != 'none' ? h("div", { id: "loginView" },
            h("input", { className: 'inputField', type: "text", placeholder: "Name", name: "loginName" }),
            h("input", { className: 'inputField', type: "text", placeholder: "Password", name: "loginPass" }),
            h("button", { name: "loginButton", onClick: () => this.hideOverlay() }, 'Login')
        ) : null
    }
}
