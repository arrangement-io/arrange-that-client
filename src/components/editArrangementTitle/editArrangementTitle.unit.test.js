import React from 'react';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json'

import EditArrangementTitle from './editArrangementTitle';

Enzyme.configure({adapter: new Adapter()});

it('EditArrangementTitle renders', () => {
    const editArrangementTitle = render(<EditArrangementTitle 
        name='First arrangement'
        handleEnter={null}
        handleEsc={null}/>);

    expect(toJson(editArrangementTitle)).toMatchSnapshot();
});