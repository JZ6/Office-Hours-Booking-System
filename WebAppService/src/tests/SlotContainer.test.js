import React from "react";
import renderer from 'react-test-renderer';
import {shallow, mount} from "enzyme";
import moment from "moment";
import SlotContainer from "../components/SlotContainer";

function testGetSlots() {
	return new Promise((resolve, reject) => {
		resolve([
			{identity: "parkerpeter15", note: "Everyone gets one."},
			{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
			{identity: "", note: ""}
		]);
	});
}

let testProps, testSlots, mockPostSlot, mockPostSlots, mockApi;
beforeEach(() => {
	mockPostSlot = jest.fn();
	mockPostSlots = jest.fn();
	mockApi = {
		getSlots: (blockId) => testGetSlots(),
		postSlot: mockPostSlot,
		postSlots: mockPostSlots
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
		testProps.id = "octaviusotto3";
		testProps.role = "instructor";
	});
	
	test("render", () => {
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	
	test("handleSlotClick isn't called", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#slot2").props().onClick();
		expect(wrapper.find("#identity2").text()).toEqual("");
		expect(wrapper.find("#note2").props().value).toEqual("");
	});
	
	test("handleIdentityChange changes identity", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Edit empty
		wrapper.find("#identity2").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#identity2").props().value).toEqual("osbornharry31");
		// Edit occupied (should clear note)
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		expect(wrapper.find("#identity0").props().value).toEqual("osbornharry31");
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
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#confirm0").simulate("click");
		expect(mockPostSlot).toHaveBeenCalledTimes(1);
		expect(mockPostSlot).toHaveBeenCalledWith("someId123", 0, {identity: "osbornharry31", note: "Honor is for fools."});
	});
	
	test("handleSlotConfirm handles if slot changed by someone else", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Simulate change in server slots
		testProps.api.getSlots = (id) => {
			return [
				{identity: "parkerpeter15", note: "Everyone gets one."},
				{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{identity: "parkerpeter15", note: "Sneaky spidey sneaks in."}
			];
		};
		testProps.api.getSlot = (id, i) => {
			return [
				{identity: "parkerpeter15", note: "Everyone gets one."},
				{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{identity: "parkerpeter15", note: "Sneaky spidey sneaks in."}
			][i];
		};
		wrapper.find("#identity2").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note2").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockPostSlot).toHaveBeenCalledTimes(0);
		// TODO: Test prompt asking instructor what to do
	});
	
	test("handleSlotCancel cancels changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#identity0").simulate("change", {target: {value: "osbornharry31"}});
		wrapper.find("#note0").simulate("change", {target: {value: "Honor is for fools."}});
		wrapper.find("#cancel0").simulate("click");
		expect(wrapper.find("#identity0").props().value).toEqual("parkerpeter15");
		expect(wrapper.find("#note0").props().value).toEqual("Everyone gets one.");
	});
	
	test("handleSlotConfirm doesn't change if identical to server", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#confirm0").simulate("click");
		expect(mockPostSlot).toHaveBeenCalledTimes(0);
	});
	
	test("handleEmpty empties slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		expect(wrapper.find("#identity0").props().value).toEqual("");
		expect(wrapper.find("#note0").props().value).toEqual("");
		expect(wrapper.find("#identity1").props().value).toEqual("");
		expect(wrapper.find("#note1").props().value).toEqual("");
		expect(wrapper.find("#identity2").props().value).toEqual("");
		expect(wrapper.find("#note2").props().value).toEqual("");
		expect(mockPostSlots).toHaveBeenCalledTimes(1);
		expect(mockPostSlots).toHaveBeenCalledWith("someId123", 
			[{identity: "", note: ""},
			{identity: "", note: ""},
			{identity: "", note: ""}]);
	});
	
	test("handleUpdate updates all slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Simulate change in server slots
		testProps.api.getSlots = (id) => {
			return [
				{identity: "Everything", note: "you"},
				{identity: "know", note: "is"},
				{identity: "wrong", note: "!"}
			];
		};
		wrapper.find("#update-button").simulate("click");
		expect(wrapper.find("#identity0").props().value).toEqual("Everything");
		expect(wrapper.find("#note0").props().value).toEqual("you");
		expect(wrapper.find("#identity1").props().value).toEqual("know");
		expect(wrapper.find("#note1").props().value).toEqual("is");
		expect(wrapper.find("#identity2").props().value).toEqual("wrong");
		expect(wrapper.find("#note2").props().value).toEqual("!");
	});
});

describe("student view", () => {
	beforeEach(() => {
		testProps.id = "parkerpeter15";
		testProps.role = "student";
	});
	
	test("render", async () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		await wrapper.instance().componentDidMount();
		console.log(wrapper.html());
		
		const tree = renderer.create(<SlotContainer {...testProps}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	
	test("handleSlotClick assigns slot", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
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
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		expect(wrapper.find("#identity0").props().onClick).toEqual(undefined);
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
		expect(mockPostSlot).toHaveBeenCalledTimes(1);
		expect(mockPostSlot).toHaveBeenCalledWith("someId123", 2, {identity: "parkerpeter15", note: "With great powers..."});
	});
	
	test("handleSlotConfirm handles if slot changed by someone else", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		// Simulate change in server slots
		testProps.api.getSlots = (id) => {
			return [
				{identity: "parkerpeter15", note: "Everyone gets one."},
				{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{identity: "osbornharry31", note: "It was me spidey! It was me all along spidey!"}
			];
		};
		testProps.api.getSlot = (id, i) => {
			return [
				{identity: "parkerpeter15", note: "Everyone gets one."},
				{identity: "watsonmj25", note: "Face it Tiger... you just hit the jackpot!"},
				{identity: "osbornharry31", note: "It was me spidey! It was me all along spidey!"}
			][i];
		};
		wrapper.find("#slot2").simulate("click");
		wrapper.find("#note2").simulate("change", {target: {value: "With great powers..."}});
		wrapper.find("#confirm2").simulate("click");
		expect(mockPostSlot).toHaveBeenCalledTimes(0);
		// It updates the slot if student after doing nothing
		expect(wrapper.find("#identity2").text()).toEqual("Not Available");
		expect(wrapper.find("#note2").text()).toEqual("");
	});
	
	test("handleSlotCancel cancels changes", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
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
	
	test("handleSlotConfirm doesn't change if identical to server", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#confirm0").simulate("click");
		expect(mockPostSlot).toHaveBeenCalledTimes(0);
	});
	
	test("handleEmpty empties only own slots", () => {
		const wrapper = shallow(<SlotContainer {...testProps}/>);
		wrapper.find("#empty-button").simulate("click");
		expect(wrapper.find("#identity0").text()).toEqual("Available");
		expect(wrapper.find("#note0").text()).toEqual("");
		expect(wrapper.find("#identity1").text()).toEqual("Not Available");
		expect(wrapper.find("#note1").text()).toEqual("");
		expect(wrapper.find("#identity2").text()).toEqual("Available");
		expect(wrapper.find("#note2").text()).toEqual("");
		expect(mockPostSlot).toHaveBeenCalledTimes(1);
		expect(mockPostSlot).toHaveBeenCalledWith("someId123", 0, {identity: "", note: ""});
	});
});
