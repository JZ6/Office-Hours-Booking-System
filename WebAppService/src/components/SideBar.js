import React from "react";

import "../styles/SideBar.css";

export default class Sidebar extends React.Component {
	state = {
		width: 0
	};
	
	handleClick() {
		if (this.state.width == 0) {
			this.setState({width: 15});
		} else {
			this.setState({width: 0});
		}
	}
	
	render() {
		return (
			<div className="Sidebar">
				<div className="Sidebar-button" onClick={() => this.handleClick()}>≡</div>
				<div className="Sidebar-panel" style={{width: this.state.width + "vw"}}>
					Hello World
				</div>
			</div>
		);
	}
}