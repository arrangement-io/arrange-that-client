import React from 'react';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json'

import EditItem from './editItem';

Enzyme.configure({adapter: new Adapter()});

it('EditItem renders', () => {
    const editItem = render(<EditItem
        name='person'
        handleChange={null}
        handleEnter={null}
        handleEsc={null}/>);

    expect(toJson(editItem)).toMatchSnapshot();
});