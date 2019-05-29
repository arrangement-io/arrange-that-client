import React from 'react';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json'

import EditContainer from './editContainer';

Enzyme.configure({adapter: new Adapter()});

it('NavAppBar is consistent', () => {
    // Render a NavAppBar
    const editContainer = render(<EditContainer 
        name='van'
        size={8}
        handleNameChange={null}
        handleSizeChange={null}
        handleEnter={null}
        handleEsc={null}/>);

    expect(toJson(editContainer)).toMatchSnapshot();
});