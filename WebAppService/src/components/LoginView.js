import React, {
    createElement as h
} from "react"

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

                const {
                    status,
                    statusText,
                    json: jsonPromise
                } = result

                if (status !== 200 || statusText !== "OK") { return false };

                jsonPromise().then(
                    result => {

                        Object.assign(storage,
                            {
                                currentUserType: permissions,
                                loggedIn: true,
                                token: result.sessionToken
                            }
                        )

                        const permID = {
                            student: "parkerpeter15",
                            instructor: "rossbob2"
                        }

                        this.props.authenticated(permissions, permID[permissions]);

                        
                        sessionStorage.setItem('sessionToken', result.sessionToken);
                        sessionStorage.setItem('currentUserType', permissions);
                        sessionStorage.setItem('loggedIn', 1);
                    }
                )

                this.setState({
                    display: 'none',
                    loading: false
                })

                // console.log(storage);
                // console.log(sessionStorage)

            })
                .catch(error => console.log(error))
        }
    }

    authenticate(username, password) {
        return this.props.api.login();
    }

    getLoadingAnimation() {
        return this.state.loading ? h("div", {
            className: "login-LoadingOverlay",
        }, [
                h("div", {
                    className: "login-loader",
                    key: 'loginLoaderContainer'
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

            h("input", {
                placeholder: "Name",
                className: 'inputField',
                type: "text",
                name: "loginName"
            }),

            h("input", {
                placeholder: "Password",
                className: 'inputField',
                type: "text",
                name: "loginPass"
            }),

            h("button", {
                className: "loginButton",
                onClick: () => this.tryToLogin()
            }, 'Login')

        ] : null
    }

    getLoginButtons() {
        return !this.state.loading ?
            h("div", { id: 'loginButtonsContainer' },
                [
                    h("button", {
                        id: "studentLoginButton",
                        key: 'loginButton0',
                        className: 'loginButton',
                        onClick: () => this.tryToLogin("student"),
                    }, 'Student'),

                    h("button", {
                        id: "instructorLoginButton",
                        key: 'loginButton1',
                        className: 'loginButton',
                        onClick: () => this.tryToLogin("instructor"),
                    }, 'Instructor')
                ]
            )
            : null
    }

    render() {
        return (this.state.display !== 'none') ?
            h("div", {
                id: "loginView"
            },
                h("p", {
                    id: "loginText",
                    className: 'lightText'
                }, 'Login as'),

                this.getLoginButtons(),
                this.getLoadingAnimation()

            ) : null
    }
}
