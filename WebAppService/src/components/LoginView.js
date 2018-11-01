import React, {
    createElement as h
} from "react"

import "../css/LoginView.css";

export default class LoginView extends React.Component {
    state = {
        display: 'block'
    };

    tryToLogin() {

        const authPromise = this.authenticate(1, 2)
        if (authPromise) {
            authPromise.then(result => {
                this.setState({
                    display: 'none'
                })
            })
            .catch(error => console.log(error))
        }
    }

    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1000);
        })
    }

    render() {
        return this.state.display != 'none' ? h("div", { id: "loginView" },
            h("input", { className: 'inputField', type: "text", placeholder: "Name", name: "loginName" }),
            h("input", { className: 'inputField', type: "text", placeholder: "Password", name: "loginPass" }),
            h("button", { name: "loginButton", onClick: () => this.tryToLogin() }, 'Login')
        ) : null
    }
}
