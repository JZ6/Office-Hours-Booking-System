import React from "react";
import renderer from 'react-test-renderer';
import {shallow, mount} from "enzyme";
import moment from "moment";
import SlotContainer from "../components/SlotContainer";

function testGetSlots() {
	return [
		{utorId: "parkerpeter15", note: "Everyone gets one."},
		{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
		{utorId: "", note: ""}
	];
}

let testProps, testSlots, mockPost, mockApi;
beforeEach(() => {
	mockPost = jest.fn();
	mockApi = {
		getSlots: (id) => {return testGetSlots()},
		getSlot: (id, i) => {return testGetSlots()[i]},
		postSlot: mockPost
		};
	testProps = {
		api: mockApi,
		blockId: "someId123",
		startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
		slotDuration: 600000,
	};
});

describe("instructor view", () => {
	beforeEach(() => {
		mockApi.user = {utorId: "octaviusotto3", role: "instructor"};
	});
	
	test("render", () => {
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	
	test("handleSlotClick isn't called", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#slot2").props().onClick();
		expect(wrapper.find("#utorId2").text()).toEqual("");
		expect(wrapper.find("#note2").props().value).toEqual("");
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
	
	test("handleSlotConfirm applies slot changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#utorId0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#confirm0").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost).toHaveBeenCalledWith("someId123", 0, {utorId: "osbornharry31", note: "Honor is for fools."});
	});
	
	test("handleSlotConfirm handles if slot changed by someone else", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		testProps.api.getSlots = (id) => {
			return [
				{utorId: "parkerpeter15", note: "Everyone gets one."},
				{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{utorId: "parkerpeter15", note: "Sneaky spidey sneaks in."}
			];
		}
		testProps.api.getSlot = (id, i) => {
			return [
				{utorId: "parkerpeter15", note: "Everyone gets one."},
				{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{utorId: "parkerpeter15", note: "Sneaky spidey sneaks in."}
			][i];
		}
		wrapper.find("#utorId2").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note2").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(0);
		// TODO: Test prompt asking instructor what to do
	});
	
	test("handleSlotCancel cancels changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#utorId0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#cancel0").simulate("click");
		expect(wrapper.find("#utorId0").props().value).toEqual("parkerpeter15");
		expect(wrapper.find("#note0").props().value).toEqual("Everyone gets one.");
	});
	
	test("handleSlotConfirm doesn't change if identical to server", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#confirm0").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(0);
	});
	
	test("handleEmpty empties slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		expect(wrapper.find("#utorId0").props().value).toEqual("");
		expect(wrapper.find("#note0").props().value).toEqual("");
		expect(wrapper.find("#utorId1").props().value).toEqual("");
		expect(wrapper.find("#note1").props().value).toEqual("");
		expect(wrapper.find("#utorId2").props().value).toEqual("");
		expect(wrapper.find("#note2").props().value).toEqual("");
	});
});

describe("student view", () => {
	beforeEach(() => {
		mockApi.user = {utorId: "parkerpeter15", role: "student"};
	});
	
	test("render", () => {
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
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
	
	test("handleSlotConfirm applies slot changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost).toHaveBeenCalledWith("someId123", 2, {utorId: "parkerpeter15", note: "With great powers..."});
	});
	
	test("handleSlotConfirm handles if slot changed by someone else", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		testProps.api.getSlots = (id) => {
			return [
				{utorId: "parkerpeter15", note: "Everyone gets one."},
				{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{utorId: "osbornharry31", note: "It was me spidey! It was me all along spidey!"}
			];
		}
		testProps.api.getSlot = (id, i) => {
			return [
				{utorId: "parkerpeter15", note: "Everyone gets one."},
				{utorId: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{utorId: "osbornharry31", note: "It was me spidey! It was me all along spidey!"}
			][i];
		}
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(0);
		// It updates the slot if student after doing nothing
		expect(wrapper.find("#utorId2").text()).toEqual("Not Available");
		expect(wrapper.find("#note2").text()).toEqual("");
	});
	
	test("handleSlotCancel cancels changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Edit utorId and note
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#cancel2").simulate("click");
		expect(wrapper.find("#utorId2").text()).toEqual("Available");
		expect(wrapper.find("#note2").text()).toEqual("");
		// Edit note only
		wrapper.find("#note0").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#cancel0").simulate("click");
		expect(wrapper.find("#note0").props().value).toEqual("Everyone gets one.");
	});
	
	test("handleSlotConfirm doesn't change if identical to server", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#confirm0").simulate("click");
		expect(mockPost).toHaveBeenCalledTimes(0);
	});
	
	test("handleEmpty empties only own slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		expect(wrapper.find("#utorId0").text()).toEqual("Available");
		expect(wrapper.find("#note0").text()).toEqual("");
		expect(wrapper.find("#utorId1").text()).toEqual("Not Available");
		expect(wrapper.find("#note1").text()).toEqual("");
		expect(wrapper.find("#utorId2").text()).toEqual("Available");
		expect(wrapper.find("#note2").text()).toEqual("");
	});
});
