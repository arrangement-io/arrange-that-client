import React from 'react';
import Enzyme, {render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import OccupancyDisplay from './occupancyDisplay';

Enzyme.configure({adapter: new Adapter()});

it('Shows default occupancy display', () => {
    const occupancy = render(<OccupancyDisplay count={7} total={8} />);

    expect(toJson(occupancy, {})).toMatchSnapshot();
});

it('Shows over occupancy display', () => {
    const overOccupancy = render(<OccupancyDisplay count={9} total={8} />);

    expect(toJson(overOccupancy, {})).toMatchSnapshot();
});