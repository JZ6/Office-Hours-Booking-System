import React from "react";
import renderer from 'react-test-renderer';
import {shallow, mount} from "enzyme";
import moment from "moment";
import SlotContainer from "../components/SlotContainer";

let testProps, testSlots;

describe("instructor view", () => {
	beforeEach(() => {
		testSlots = [
			{utorId: "parkerpeter15", note: "Everyone gets one."},
			{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
			{utorId: "", note: ""}
		];
		testProps = {
			slots: testSlots.slice(),
			startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
			slotDuration: 600000,
			isStudent: false,
			user: "octaviusotto3"
		};
	});
	
	test("render", () => {
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	
	test("handleSlotClick can't be called", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		expect(wrapper.find("#slot0").props().onClick).toEqual(undefined);
	});
	
	test("handleUtorIdChange changes utorId", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Edit empty
		wrapper.find("#utorId2").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#utorId2").props().value).toEqual("osbornharry31");
		// Edit occupied (should clear note)
		wrapper.find("#utorId0").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#utorId0").props().value).toEqual("osbornharry31");
		expect(wrapper.find("#note0").props().value).toEqual("");
	});
	
	test("handleNoteChange changes note", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Edit empty (shouldn't allow changes)
		wrapper.find("#note2").simulate("change", {target: {value: "Honor is for fools."}});
		expect(wrapper.find("#note2").props().value).toEqual("");
		// Edit occupied
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		expect(wrapper.find("#note0").props().value).toEqual("Honor is for fools.");
	});
	
	test("handleEmpty empties slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe("student view", () => {
	beforeEach(() => {
		testSlots = [
			{utorId: "parkerpeter15", note: "Everyone gets one."},
			{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
			{utorId: "", note: ""}
		];
		testProps = {
			slots: testSlots.slice(),
			startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
			slotDuration: 600000,
			isStudent: true,
			user: "parkerpeter15"
		};
	});
	
	test("handleSlotClick assigns slot", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Click on own slot (unregisters slot and deletes note)
		wrapper.find("#slot0").props().onClick();
		expect(wrapper.find("#utorId0").text()).toEqual("Available");
		expect(wrapper.find("#note0").text()).toEqual("");
		// Click on occupied slot (does nothing)
		wrapper.find("#slot1").props().onClick();
		expect(wrapper.find("#utorId1").text()).toEqual("Not Available");
		expect(wrapper.find("#note1").text()).toEqual("");
		// Click on empty slot (registers slot)
		wrapper.find("#slot2").props().onClick();
		
		expect(wrapper.find("#utorId2").text()).toEqual("parkerpeter15");
		expect(wrapper.find("#note2").props().value).toEqual("");
	});
	
	test("handleUtorIdChange can't be called", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		expect(wrapper.find("#utorId0").props().onClick).toEqual(undefined);
	});
	
	test("handleNoteChange changes only own notes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Edit empty (shouldn't allow changes)
		expect(wrapper.find("#note2").props().onChange).toEqual(undefined);
		// Edit occupied (shouldn't allow changes)
		expect(wrapper.find("#note1").props().onChange).toEqual(undefined);
		// Edit own
		wrapper.find("#note0").simulate("change", {target: {value: "With great powers comes great responsibility."}});
		expect(wrapper.find("#note0").props().value).toEqual("With great powers comes great responsibility.");
	});
	
	test("handleEmpty empties only own slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
