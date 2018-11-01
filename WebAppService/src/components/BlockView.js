import React from "react";

import "../css/BlockView.css";

export default class BlockView extends React.Component {
	state = {
        display: 'none',
        text: 'NONE'
	};

    onSelectEvent(e) {
        //displays and initializes the block view
        this.setState({display: 'block', text: e.title + " From " + e.start + " to " + e.end });
    }

    close(){
        console.log('close');
        this.setState({display: 'none'});
    }
    
	render() {
		return (
            <div className="BlockView" style={{display: this.state.display}}>
                <div className="close-block" onClick={() => this.close()}>Close</div>
                <i>{this.state.text}</i>
            </div>
		);
	}
}