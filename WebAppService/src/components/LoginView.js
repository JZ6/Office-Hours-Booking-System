import React, {
    createElement as h
} from "react"

// import api from './common/api'
import storage from './common/storage'

import "../styles/LoginView.css";
import '../styles/common.css'

export default class LoginView extends React.Component {
    state = {
        display: 'block',
        loading: false
    };

    tryToLogin(permissions) {

        // Show loading animation
        this.setState({
            loading: true
        })

        const authPromise = this.authenticate(1, 2)
        if (authPromise) {
            authPromise.then(result => {

                //Store current info to storage.
                Object.assign(storage,
                    {
                        currentUserType: permissions,
                        loggedIn: true
                    }
                )

                this.setState({
                    display: 'none',
                    loading: false
                })

                console.log(storage);
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
                        h("div", { key: 'LoadingOverlay0' }),
                        h("div", { key: 'LoadingOverlay1' }),
                        h("div", { key: 'LoadingOverlay2' }),
                        h("div", { key: 'LoadingOverlay3' }),
                        h("div", { key: 'LoadingOverlay4' }),
                        h("div", { key: 'LoadingOverlay5' }),
                        h("div", { key: 'LoadingOverlay6' }),
                        h("div", { key: 'LoadingOverlay7' })
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
            h("div", { id: 'loginButtonsContainer' },
                [
                    h("button", { id: "studentLoginButton", className: 'loginButton', onClick: () => this.tryToLogin(0),key: 'loginButton0' }, 'Student'),
                    h("button", { id: "instructorLoginButton", className: 'loginButton', onClick: () => this.tryToLogin(1),key: 'loginButton1' }, 'Instructor')
                ]
            )
            : null
    }

    render() {
        return (this.state.display !== 'none') ?
            h("div", { id: "loginView" },
                h("p", { id: "loginText", className: 'lightText' }, 'Login as'),
                this.getLoginButtons(),
                this.getLoadingAnimation()
            ) : null
    }
}
