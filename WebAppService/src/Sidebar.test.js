import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';

describe("Menu", () => {
  it("should render the sidebar menu", () => {
    const wrapper = shallow(<Menu />);
  });
});