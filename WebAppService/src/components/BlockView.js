import React from "react";

import "../styles/BlockView.css";

export default class BlockView extends React.Component {
    constructor(props) { //props are either student or instructor. Will render differently depending which is passed
        super(props);
        this.state = {
            event: "", //data that holds the time of the event. The rest of the state variables regarding time are just for display
            display: 'none',
            startTime: 'HH:mm',
            endTime: 'HH:mm',
            negativeIntervalError: "",
            date: "yyyy-MM-dd", //events can only span over 1 day to be supported
            numberOfSlots: 12,
            slotDuration: 5,
            blockDuration: 60,
            instructorName: ["Bob Ross"],
            courseList: ["CSC302","CSC401","MAT321"], //list of eligibles courses for current instructor
            blockDescription: "",
            selectedCourses: [], //list of selected courses
            courseCheckBoxes: [], //list of checkboxes corresponding to courses
        };

        //this.props.permission is either 'student' or 'instructor'
        //this.props.course contains the course data

        //TO DO: add a variable that's set when there are unsaved changes

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCourseSelection = this.handleCourseSelection.bind(this);
        
    }

    //init component state using block object passed in props
    componentDidMount(){
        // TO DO: update state with course object passed in props

        //create checkboxes for courses
        var courses = this.state.courseList.map((course) =>
        <div>
          <input
            id = {course}
            type="checkbox"
            onChange={this.handleCourseSelection} />
            {course}
            <br></br>
        </div>
        );

        this.setState({courseCheckBoxes:courses});
    }

    //calculate and update the number of slots
    updateNumberOfSlots(event){
        var diffMs=(event.end-event.start);
        var diffMins = Math.round((diffMs / 1000) / 60);   
        this.setState({blockDuration:diffMins});
        this.setState({numberOfSlots: Math.floor(diffMins/this.state.slotDuration)});
    }

    handleInputChange(event){

        const target = event.target;
        const name = target.name;
        var newEvent;
        if(name==='slotDuration'){ //also update the number of slots
            this.setState({numberOfSlots: Math.floor(this.state.blockDuration/target.value)});
        }else if(name === 'startTime'){ 

            //change internal representation of the event
            //setHours, setMinutes instantly modifies the event state so no need to this.setState 
            newEvent = this.state.event;
            newEvent.start.setHours(target.value.substr(0,2));
            newEvent.start.setMinutes(target.value.substr(3,2));

            //if start time is later than endTime then display error
            if(newEvent.start>newEvent.end){
                console.log("NEGATIVE LENGTH")
                this.setState({negativeIntervalError:"Start time can't be later than end time"})
            }else{
                this.setState({negativeIntervalError:""})
                this.updateNumberOfSlots(newEvent);
            }


           
        }else if(name === 'endTime'){ 
            //change internal representation of the event.
            //setHours, setMinutes instantly modifies the event state so no need to this.setState 
            newEvent = this.state.event;
            newEvent.end.setHours(target.value.substr(0,2));
            newEvent.end.setMinutes(target.value.substr(3,2));

            //if start time is later than endTime then display error
            if(newEvent.start>newEvent.end){
                console.log("NEGATIVE LENGTH")
                this.setState({negativeIntervalError:"Start time can't be later than end time"})
            }else{
                this.setState({negativeIntervalError:""})
                this.updateNumberOfSlots(newEvent);
            }

        }else if(name === 'date'){

            //change internal representation of the event
            newEvent = this.state.event;
            newEvent.start.setYear(target.value.substr(0,4));
            newEvent.end.setYear(target.value.substr(0,4));

            newEvent.start.setMonth(target.value.substr(5,2));
            newEvent.end.setMonth(target.value.substr(5,2));

            newEvent.start.setDate(target.value.substr(8,2));
            newEvent.end.setDate(target.value.substr(8,2));
            this.setState({event:newEvent})

            this.updateNumberOfSlots(newEvent);
        }

        this.setState({
            [name]: target.value
        });

    }

    //update relevant selectedCourses when a course is selected
    handleCourseSelection(event){
        var newSelectedCourses = this.state.selectedCourses;
        var course = event.target.id;

        var target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        //add course to course list if checked
        if(value===true){
            if(!newSelectedCourses.includes(course)){
                //add course to selected courses
                newSelectedCourses.push(course);
                this.setState({selectedCourses:newSelectedCourses});
            }

        }else{ //remove course from selected courses
            var index = newSelectedCourses.indexOf(course);
            if (index > -1) {
            newSelectedCourses.splice(index, 1);
            }
        }
        console.log(this.state.selectedCourses)

        
    }
    
    //displays and initializes the block view when an event is clicked
    onSelectEvent(e) {
        this.setState({event:e});
        this.setState({display: 'block'});
        this.setState({startTime: ("0" + e.start.getHours()).slice(-2) + ":" + ("0" + e.start.getMinutes()).slice(-2)});
        this.setState({endTime: ("0" + e.end.getHours()).slice(-2) + ":" + ("0" + e.end.getMinutes()).slice(-2)});
        this.setState({date: e.start.getFullYear()+"-"+("0" + e.end.getMonth()).slice(-2)+"-"+("0" + e.end.getDate()).slice(-2)});

        //set block length (in minutes)
        
        var diffMs=(e.end-e.start);
        var diffMins = Math.round((diffMs / 1000) / 60);   
        this.setState({blockDuration:diffMins});
    }

    close(){
        console.log('close');
        this.setState({display: 'none'});
    }

    //POSTs the edited block to the API and update calendar views
    submitBlock(){

        //create block using component state
        let block = {
        id:"",
        owners:this.state.instructorName,
        courseCodes:this.state.selectedCourses,
        comment:this.state.blockDescription,
        startTime: this.state.date+"T"+this.state.startTime+":"+this.state.event.start.getSeconds(), //2008-09-15T15:53:00
        appointmentDuration:this.state.slotDuration*60*1000,
        appointmentSlots:[] //get slots from slot component
        }

        //TO DO: alert and cancel submission if block length is negative.

        // call function to update calendar view with the new block
        // HERE

        this.props.api.postBlock(block)
        .then((response) => {
            if (response.status === 200) {
                //callback function if POST successful
            } else {
                window.alert(response.status, response.statusText);
                //call function to refresh the page and revert the posted block
                // HERE
            }
        })
        .catch((error) => {
            window.alert(error.message);
        });

    }

    //renders condinally of permissions
	render() {
        if(this.props.permission==="instructor"){
		return (
            <div className="BlockView" style={{display: this.state.display}}>
                <div className="close-block" onClick={() => this.close()}>Close</div>
                <h3>BLOCK VIEW </h3>
                <div className="blockTimes">
                    <input
                        name="startTime"
                        type="time"
                        value={this.state.startTime}
                        onChange={this.handleInputChange} />
                    - 
                    <input
                        name="endTime"
                        type="time"
                        value={this.state.endTime}
                        onChange={this.handleInputChange} />
                    <div> {this.state.negativeIntervalError} </div>
                    <input
                    name="date"
                    type="date"
                    value={this.state.date}
                    onChange={this.handleInputChange} />
                    <br />
                    <label>
                        Slot duration:
                        <select name = "slotDuration" value={this.state.slotDuration} onChange={this.handleInputChange}>
                            <option value="5">5 minutes</option>
                            <option value="10">10 minutes</option>
                            <option value="15">15 minutes</option>
                        </select>
                    </label>
                        Slot number: {this.state.numberOfSlots}
                </div>

                <div className="blockInfo">
                    Instructor {this.state.instructorName}
                    <br />
                        {this.state.courseCheckBoxes}
                    <br />
                    Block Description   
                    <textarea  value =  {this.state.blockDescription} name = "blockDescription" onChange={this.handleInputChange} rows="4" cols="50" placeholder="Enter block description...">
                    </textarea>
                    <div> SLOT VIEW </div>
                    <button className="submit-button" onClick={() => this.submitBlock()}>Submit</button>

                </div>    
          </div>          
        );
    }else if(this.props.permission==="student"){
        return(
        <div className="BlockView" style={{display: this.state.display}}>
                <div className="close-block" onClick={() => this.close()}>Close</div>
                <h2>BLOCK VIEW </h2>
                <div className="blockTimes">
                    <div> from {this.state.startTime} to {this.state.endTime} </div>
                    <br/>
                    <div> Date: {this.state.date} </div>
                    <br />
                </div>

                <div className="blockInfo">
                    Instructor {this.state.instructorName}
                    <br/>
                    <h3>Block Description</h3>
                    <div> {this.state.blockDescription} </div>
                    <div> SLOT VIEW </div>
                </div>    
        </div>    
        );
    }else{
        console.error("wrong permissions");
        return(
            <div className="BlockView" style={{display: this.state.display}}>
            </div>);
    }
    }
   
}
