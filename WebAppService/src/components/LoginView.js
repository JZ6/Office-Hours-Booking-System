import React, {
    createElement as h
} from "react"

// import api from './common/api'

import "../styles/LoginView.css";
import '../styles/common.css'

export default class LoginView extends React.Component {
    state = {
        display: 'block',
        loading: false
    };

    tryToLogin() {

        // Show loading animation
        this.setState({
            loading: true
        })

        const authPromise = this.authenticate(1, 2)
        if (authPromise) {
            authPromise.then(result => {
                this.setState({
                    display: 'none',
                    loading: false
                })
            })
                .catch(error => console.log(error))
        }
    }

    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1000);
        })

        // api.login();
    }

    getLoadingAnimation() {
        return this.state.loading ? h("div", {
            className: "login-LoadingOverlay",
        }, [
                h("div", {
                    className: "login-loader"
                }, [
                        h("div", {}),
                        h("div", {}),
                        h("div", {}),
                        h("div", {}),
                        h("div", {}),
                        h("div", {}),
                        h("div", {}),
                        h("div", {})
                    ])
            ]) : null
    }

    // Old login fields with username and password.
    getLoginInput() {
        return !this.state.loading ? [
            h("input", { className: 'inputField', type: "text", placeholder: "Name", name: "loginName" }),
            h("input", { className: 'inputField', type: "text", placeholder: "Password", name: "loginPass" }),
            h("button", { className: "loginButton", onClick: () => this.tryToLogin() }, 'Login')
        ] : null
    }

    getLoginButtons() {
        return !this.state.loading ?
            h("div", {},
                [
                    h("button", { id: "studentLoginButton", className: 'loginButton', onClick: () => this.tryToLogin() }, 'Student'),
                    h("button", { id: "instructorLoginButton", className: 'loginButton', onClick: () => this.tryToLogin() }, 'Instructor')
                ]
            )
            : null
    }

    render() {
        return (this.state.display !== 'none') ?
            h("div", { id: "loginView" },
                this.getLoginButtons(),
                this.getLoadingAnimation()
            ) : null
    }
}
