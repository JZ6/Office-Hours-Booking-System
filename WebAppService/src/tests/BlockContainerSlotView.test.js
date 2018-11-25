import React from "react";
import renderer from 'react-test-renderer';
import {shallow, mount} from "enzyme";
import moment from "moment";
import BlockContainer from "../components/BlockContainer";

let mockJson, mockGetBlock, mockEditSlot;
let mockProps, mockBlock, mockApi;

beforeEach(() => {
	mockBlock = {
		blockId: "0",
		owners: ["rossbob2", "atat4"],
		courseCodes: ["csc301", "csc302"],
		comment: "We don't make mistakes, just happy little accidents.",
		startTime: "2018-11-18T12:00:00Z",
		appointmentDuration: 600000,
		appointmentSlots: [
			{identity: "parkerpeter15", note: "Everyone gets one.", courseCode: "csc302"},
			{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!", courseCode: "csc302"},
			{identity: "", note: "", courseCode: ""}
		]
	};
	mockJson = jest.fn(() => {
		return new Promise((resolve, reject) => {
			resolve(mockBlock);
		});
	});
	mockGetBlock = jest.fn((blockId) => {
		return new Promise((resolve, reject) => {
			resolve({
				status: 200,
				statusText: "OK",
				json: mockJson
			});
		});
	});
	mockEditSlot = jest.fn((blockId, slotId, slot) => {
		mockBlock.appointmentSlots[slotId] = slot;
		return new Promise((resolve, reject) => {
			resolve({
				status: 200,
				statusText: "OK"
			});
		});
	});
	mockApi = {
		getBlock: mockGetBlock,
		editSlot: mockEditSlot
		};
	mockProps = {
		api: mockApi,
	};
});

describe("instructor view", () => {
	let wrapper;
	beforeEach(() => {
		mockProps.id = "octaviusotto3";
		mockProps.role = "instructor";
		wrapper = mount(<BlockContainer {...mockProps}/>);
		wrapper.instance().onOpen(mockBlock);
		wrapper = wrapper.update();
	});
	
	test("render", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});
	
	test("handleSlotClick isn't called", () => {
		wrapper.find("#identity2").simulate("click");
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
	
	test("handleSlotConfirm applies slot changes", async () => {
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		await wrapper.find("#confirm0").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("0", 0, {courseCode: "csc302", identity: "osbornharry31", note: "Honor is for fools."});
	});
	
	test("handleSlotCancel cancels changes", async () => {
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		await wrapper.find("#cancel0").simulate("click");
		expect(mockGetBlock).toHaveBeenCalledTimes(1);
		expect(mockGetBlock).toHaveBeenCalledWith("0");
	});
	
	test("handleEmpty empties slots", async () => {
		await wrapper.find("#empty-button").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(3);
		expect(mockEditSlot).toHaveBeenCalledWith("0", 2, 
			{identity: "", courseCode: "", note: ""});
	});
});

describe("student view", () => {
	let wrapper;
	beforeEach(async () => {
		mockProps.id = "parkerpeter15";
		mockProps.role = "student";
		wrapper = mount(<BlockContainer {...mockProps}/>);
		wrapper.instance().onOpen(mockBlock);
		wrapper = wrapper.update();
	});
	
	test("render", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});
	
	test("handleSlotClick assigns slot", () => {
		// Click on own slot (unregisters slot and deletes note)
		wrapper.find("#identity0").simulate("click");
		expect(wrapper.find("#identity0").text()).toEqual("Register");
		expect(wrapper.find("#note0").text()).toEqual("");
		// Click on occupied slot (does nothing)
		wrapper.find("#identity1").simulate("click");
		expect(wrapper.find("#identity1").text()).toEqual("Not Available");
		expect(wrapper.find("#note1").text()).toEqual("");
		// Click on empty slot (registers slot)
		wrapper.find("#identity2").simulate("click");
		expect(wrapper.find("#identity2").text()).toEqual("Unregister");
		expect(wrapper.find("#note2").props().value).toEqual("");
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
	
	test("handleSlotConfirm applies slot changes", async () => {
		wrapper.find("#identity2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		await wrapper.find("#confirm2").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("0", 2, {identity: "parkerpeter15", courseCode: "", note: "With great powers..."});
	});
	
	test("handleSlotCancel cancels changes", async () => {
		// Edit identity and note
		wrapper.find("#identity2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		await wrapper.find("#cancel2").simulate("click");
		expect(mockGetBlock).toHaveBeenCalledTimes(1);
		expect(mockGetBlock).toHaveBeenCalledWith("0");
	});
	
	test("handleEmpty empties only own slots", async () => {
		await wrapper.find("#empty-button").simulate("click");
		expect(mockEditSlot).toHaveBeenCalledTimes(1);
		expect(mockEditSlot).toHaveBeenCalledWith("0", 0, 
			{identity: "", courseCode: "", note: ""});
	});
});
