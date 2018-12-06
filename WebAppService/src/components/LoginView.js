import React, {
	createElement as h
} from "react"

//import storage from './common/storage'
import logo from '../logo.png'

import "../styles/LoginView.css";
import '../styles/common.css'

export default class LoginView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			loading: false,
			username: "",
			password: ""
		};
		
		this.handleLogin = this.handleLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleLogin() {
		if (this.state.loading || !this.state.visible) {return false;}
		this.setState({loading: true});
		
		let promise = this.props.api.login(this.state.username, this.state.password);
		promise.then((response) => {
			console.log("Response:", response);
			if (response.status !== 200) {
				window.alert(`${response.status}: ${response.statusText}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log("Response Data:", data);
			this.id = data.id;
			this.sessionToken = data.token;
			
			this.props.api.sessionToken = data.token;
			
			if (typeof (Storage) !== "undefined") {
				sessionStorage.setItem("sessionToken", this.sessionToken);
			}
			
			this.setState({
				visible: false,
				loading: false
			});
			console.log(this.state.username);
			if (this.state.username === "user1") {
				this.props.authenticate(this.state.username, "instructor");
			} else {
				this.props.authenticate(this.state.username, "student");
			}
		})
		.catch((error) => {
			console.log(error);
			window.alert(error.message);
			this.setState({loading: false});
		});
	}
	
	handleChange(event) {
		let name = event.target.id;
		let value = event.target.value;
		if (name === "username") {
			this.setState({username: value});
		} else if (name === "password") {
			this.setState({password: value});
		} else {
			console.log(`${name} is not a valid input element id.`);
		}
	}
	
	renderLogin() {
		if (this.state.loading) {
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
		} else {
			return (
				<div>
					Username:
					<input 
						id="username" 
						type="text" 
						value={this.state.username} 
						placeholder="Username..."
						onChange={this.handleChange} 
					/><br/>
					Password:
					<input 
						id="password" 
						type="password" 
						value={this.state.password}
						placeholder="Password..."
						onChange={this.handleChange} 
					/><br/>
					<button onClick={this.handleLogin}>Login</button>
				</div>
			);
		}
	}
	
	render() {
		if (this.state.visible) {
			return (
				<div className="LoginContainer">
					<img src={logo} alt="Projekt Cool-aid" />
					{this.renderLogin()}
				</div>
			);
		} else {
			return null;
		}
	}
}
