import React from "react";
import renderer from 'react-test-renderer';
import {shallow, mount} from "enzyme";
import moment from "moment";
import SlotContainer from "../components/SlotContainer";

let mockJson, mockGetSlots, mockEditSlot;
let testProps, testSlots, mockApi;

beforeEach(() => {
	testSlots = [
		{identity: "parkerpeter15", note: "Everyone gets one."},
		{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
		{identity: "", note: ""}
	]
	mockJson = () => {
		return new Promise((resolve, reject) => {
			resolve(testSlots);
		});
	}
	mockGetSlots = () => {
		return new Promise((resolve, reject) => {
			resolve({
				status: 200,
				statusText: "OK",
				json: mockJson
			});
		});
	}
	mockEditSlot = jest.fn().mockImplementation((blockId, i, slot) => {
		testSlots[i] = slot;
		return new Promise((resolve, reject) => {
			resolve({
				status: 200,
				statusText: "OK"
			});
		});
	});
	mockApi = {
		getSlots: (blockId) => mockGetSlots(),
		editSlot: mockEditSlot
		};
	testProps = {
		api: mockApi,
		blockId: "someId123",
		startTime: moment("2077/01/01 00:00", "YYYY-MM-DD HH:mm"),
		slotDuration: 600000,
	};
});

describe("instructor view", () => {
	let wrapper;
	beforeEach(async () => {
		testProps.id = "octaviusotto3";
		testProps.role = "instructor";
		wrapper = shallow(<SlotContainer {...testProps}/>);
		await wrapper.instance().componentDidMount();
	});
	
	test("render", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});
	
	test("handleSlotClick isn't called", () => {
		wrapper.find("#slot2").props().onClick();
		expect(wrapper.find("#identity2").text()).toEqual("");
		expect(wrapper.find("#note2").props().value).toEqual("");
	});
	
	test("handleIdentityChange changes identity", () => {
		// Edit empty
		wrapper.find("#identity2").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#identity2").props().value).toEqual("osbornharry31");
		// Edit occupied (should clear note)
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#identity0").props().value).toEqual("osbornharry31");
		expect(wrapper.find("#note0").props().value).toEqual("");
	});
	
	test("handleNoteChange changes note", () => {
		// Edit empty (shouldn't allow changes)
		wrapper.find("#note2").simulate("change", {target: {value: "Honor is for fools."}});
		expect(wrapper.find("#note2").props().value).toEqual("");
		// Edit occupied
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		expect(wrapper.find("#note0").props().value).toEqual("Honor is for fools.");
	});
	
	test("handleSlotConfirm applies slot changes", () => {
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#confirm0").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("someId123", 0, {identity: "osbornharry31", note: "Honor is for fools."});
	});
	
	test("handleSlotCancel cancels changes", () => {
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#cancel0").simulate("click");
		expect(wrapper.find("#identity0").props().value).toEqual("parkerpeter15");
		expect(wrapper.find("#note0").props().value).toEqual("Everyone gets one.");
	});
	
	test("handleEmpty empties slots", async () => {
		await wrapper.find("#empty-button").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(3);
		expect(mockEditSlot).toHaveBeenCalledWith("someId123", 2, 
			{identity: "", note: ""});
	});
});

describe("student view", () => {
	let wrapper;
	beforeEach(async () => {
		testProps.id = "parkerpeter15";
		testProps.role = "student";
		wrapper = shallow(<SlotContainer {...testProps}/>);
		await wrapper.instance().componentDidMount();
	});
	
	test("render", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});
	
	test("handleSlotClick assigns slot", () => {
		// Click on own slot (unregisters slot and deletes note)
		wrapper.find("#slot0").props().onClick();
		expect(wrapper.find("#identity0").text()).toEqual("Available");
		expect(wrapper.find("#note0").text()).toEqual("");
		// Click on occupied slot (does nothing)
		wrapper.find("#slot1").props().onClick();
		expect(wrapper.find("#identity1").text()).toEqual("Not Available");
		expect(wrapper.find("#note1").text()).toEqual("");
		// Click on empty slot (registers slot)
		wrapper.find("#slot2").props().onClick();
		expect(wrapper.find("#identity2").text()).toEqual("parkerpeter15");
		expect(wrapper.find("#note2").props().value).toEqual("");
	});
	
	test("handleIdentityChange can't be called", () => {
		expect(wrapper.find("#identity0").props().onClick).toEqual(undefined);
	});
	
	test("handleNoteChange changes only own notes", () => {
		// Edit empty (shouldn't allow changes)
		expect(wrapper.find("#note2").props().onChange).toEqual(undefined);
		// Edit occupied (shouldn't allow changes)
		expect(wrapper.find("#note1").props().onChange).toEqual(undefined);
		// Edit own
		wrapper.find("#note0").simulate("change", {target: {value: "With great powers comes great responsibility."}});
		expect(wrapper.find("#note0").props().value).toEqual("With great powers comes great responsibility.");
	});
	
	test("handleSlotConfirm applies slot changes", () => {
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("someId123", 2, {identity: "parkerpeter15", note: "With great powers..."});
	});
	
	test("handleSlotCancel cancels changes", () => {
		// Edit identity and note
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#cancel2").simulate("click");
		expect(wrapper.find("#identity2").text()).toEqual("Available");
		expect(wrapper.find("#note2").text()).toEqual("");
		// Edit note only
		wrapper.find("#note0").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#cancel0").simulate("click");
		expect(wrapper.find("#note0").props().value).toEqual("Everyone gets one.");
	});
	
	test("handleEmpty empties only own slots", async () => {
		await wrapper.find("#empty-button").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("someId123", 0, 
			{identity: "", note: ""});
	});
});
