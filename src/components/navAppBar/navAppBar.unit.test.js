import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json'

import NavAppBar from './navAppBar';

Enzyme.configure({adapter: new Adapter()});

it('NavAppBar is consistent', () => {
    // Render a NavAppBar
    const navAppBar = shallow(<NavAppBar />);

    expect(toJson(navAppBar, {
        mode: 'deep'
    })).toMatchSnapshot();
});