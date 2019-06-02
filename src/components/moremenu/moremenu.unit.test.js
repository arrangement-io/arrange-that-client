import React from 'react';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import MoreMenu from './moremenu';

Enzyme.configure({adapter: new Adapter()});

it('moremenu loads', () => {
    const optionsList = ["option"]
    const moremenu = render(<MoreMenu options={optionsList}/>);
    expect(toJson(moremenu)).toMatchSnapshot();
});
