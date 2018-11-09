import React from "react";

import "../styles/BlockView.css";

export default class BlockView extends React.Component {
    constructor(props) { //props are either student or instructor. Will render differently depending which is passed
        super(props);
        this.state = {
          display: 'none',
          startTime: 'HH:mm',
          endTime: 'HH:mm',
          date: "yyy-MM-dd",
          numberOfSlots: 12,
          slotDuration: 5,
          blockDuration: 60,
          instructorName: "Bob Ross",
          courseList: ["CSC302","CSC401","MAT321"],
          blockDescription: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }
  
    handleInputChange(event) {

        const target = event.target;
        const name = target.name;
        if(name==='slotDuration'){ //also update the number of slots
            this.setState({numberOfSlots: this.state.blockDuration/target.value});
        }
        this.setState({
            [name]: target.value
        });

      }

    onSelectEvent(e) {
        //displays and initializes the block view
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
                    <textarea  name = "blockDescription" onChange={this.handleInputChange} rows="4" cols="50" placeholder="Enter block description...">
                        {this.state.blockDescription}
                    </textarea>

                    
                </div>    
                </form>
          </div>          
		);
    }
   
}

//FUNCTIONALITY: you can either write comma separated courses or choose them from a drop down list
//The dropdown list will display courses that match the last course being typed
class CourseSelection extends React.Component {
    //need to implement dynamic creation of courses from props.courses array
    constructor(props) { //props are either student or instructor. Will render differently depending which is passed
        super(props);
        this.state = {
          selectedCourses: [],
          stringCourseList: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCourseSelection = this.handleCourseSelection.bind(this);
    }
 
    //updates both the course input and the selected list of courses    
    updateSelectedCourses(courseInput){
        var courseArray =courseInput.split(",");
        var updatedInput="";

        this.setState({selectedCourses:[]})
        var newSelectedCourses =[]
        for (let i = 0; i < courseArray.length; i++) {
            if(this.props.courses.includes(courseArray[i])&&!newSelectedCourses.includes(courseArray[i])){
                //update input
                updatedInput=updatedInput + courseArray[i] + ',';
                //keep track of courses scanned
                newSelectedCourses.push(courseArray[i]);
            }else if((i===courseArray.length-1)){ //dont trim the last course while being inputed
                updatedInput=updatedInput + courseArray[i];
                
            } 
        }
        //avoid deleting the course that's currently being edited
        if(updatedInput.charAt(updatedInput.length-1)===',' && !(courseInput.charAt(courseInput.length-1)===',')){
            updatedInput=updatedInput.substr(0,updatedInput.length-1);
        }


        this.setState({selectedCourses:newSelectedCourses})
        this.setState({stringCourseList:updatedInput})
    }

    //perform relevant actions when course search box receives input
    handleInputChange(event){
        //update input text
        var target = event.target;
        var fullInput = target.value.toUpperCase();


        //creates a filter variable used to only display courses that match that filter
        //the filter corresponds to the last unfinished course entry
        var filter = fullInput;
        if(filter.lastIndexOf(",")!==-1){
            filter = filter.substr(filter.lastIndexOf(",")+1,filter.length-1);
        }

        //update courses
        this.updateSelectedCourses(fullInput);

        
        //removes courses that don't match the input name from dropdown menu
        var ul = this.refs.courseList;
        var li = ul.getElementsByTagName("li");
        var a, i;
        
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }

    }
    dummy(){
        return false;
    }
    
    //update relevant variables when a course is selected
    handleCourseSelection(event){
        var selectedCourses = this.state.selectedCourses;
        var course = event.target.id;
        var courseString = this.state.stringCourseList;

        if(selectedCourses.includes(course)){ //if the course is already selected
            return;
        }

        //update the string representation of the course state variable

        if(courseString==="" || courseString.charAt(courseString.length-1)===','){
            courseString=courseString+course + ",";

            
        } else{ //delete the last course currently being input and replace it by the clicked course
            if(courseString.indexOf(',')===-1){//first course being input
                courseString=course+','
            }else{
                courseString=courseString.substr(0, courseString.lastIndexOf(',')+1)+course + ',';
            }

            
        }
        this.setState({stringCourseList:courseString});
        
        //update the selected courses state variable
        var updatedCourses = selectedCourses;
        updatedCourses.push(course);
        console.log(updatedCourses);
        this.setState({selectedCourses:updatedCourses})
        
    }
    render(){
        return (
            <div>
                <label>
        <input type="text" value = {this.state.stringCourseList} onChange={this.handleInputChange} placeholder="Search for courses..."/>
        <br/>
        Use commas to sepparate courses
            <ul ref="courseList">
            <li ><a id = "MAT321" onClick={this.handleCourseSelection} href="#">MAT321</a></li>
            <li ><a id = "CSC302" onClick={this.handleCourseSelection} href="#">CSC302</a></li>
            <li ><a id = "CSC401" onClick={this.handleCourseSelection} href="#">CSC401</a></li>
            </ul>
            </label>
            </div>

        );
    }
}