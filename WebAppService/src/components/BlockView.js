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
            date: "yyyy-MM-dd", //events can only span over 1 day
            numberOfSlots: 12,
            slotDuration: 5,
            blockDuration: 60,
            instructorName: "Bob Ross",
            courseList: ["CSC302","CSC401","MAT321"],
            blockDescription: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }
  
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

            //if start time is later than endTime then return
            if(newEvent.start>=newEvent.end){
                console.log("NEGATIVE LENGTH")
                //reset changes
                newEvent.start.setHours(this.state.startTime.substr(0,2));
                newEvent.start.setMinutes(this.state.startTime.substr(3,2));
                return;
            }
            this.updateNumberOfSlots(newEvent);


           
        }else if(name === 'endTime'){ 
            //change internal representation of the event.
            //setHours, setMinutes instantly modifies the event state so no need to this.setState 
            newEvent = this.state.event;
            newEvent.end.setHours(target.value.substr(0,2));
            newEvent.end.setMinutes(target.value.substr(3,2));

            //if start time is later than endTime then return
            if(newEvent.start>=newEvent.end){
                console.log("NEGATIVE LENGTH")
                //reset changes
                newEvent.end.setHours(this.state.endTime.substr(0,2));
                newEvent.end.setMinutes(this.state.endTime.substr(3,2));
                return;
            }
            this.updateNumberOfSlots(newEvent);

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
    
	render() {
		return (
            <div className="BlockView" style={{display: this.state.display}}>
                <div className="close-block" onClick={() => this.close()}>Close</div>
                <h3>BLOCK VIEW </h3>
                <form>
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
                        <CourseSelection courses = {this.state.courseList}/>
                    <br />
                    Block Description   
                    <textarea  value =  {this.state.blockDescription} name = "blockDescription" onChange={this.handleInputChange} rows="4" cols="50" placeholder="Enter block description...">
                       
                    </textarea>

                    
                </div>    
                </form>
          </div>          
		);
    }
   
}

class CourseSelection extends React.Component {
    constructor(props) { //props are either student or instructor. Will render differently depending which is passed
        super(props);
        this.state = {
          selectedCourses: [],
          courseCheckBoxes: [], //list of checkboxes corresponding to courses
        };
        this.handleCourseSelection = this.handleCourseSelection.bind(this);

        //create checkboxes for courses
        var courses = this.props.courses.map((course) =>
        <label>
          <input
            id = {course}
            type="checkbox"
            // checked={this.state.selected}
            onChange={this.handleCourseSelection} />
            {course}
            <br></br>
        </label>
        );

        this.state.courseCheckBoxes=courses;
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
    render(){
        return(
            <label>
            {this.state.courseCheckBoxes}
            </label>
        );

    }

}

