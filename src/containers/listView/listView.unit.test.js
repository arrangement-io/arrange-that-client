import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ListView from './listView';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

Enzyme.configure({adapter: new Adapter()});

it('ListView renders', () => {
    // Render a NavAppBar
    const store = mockStore({real: {
        "_id": "aDTWNFJSD",
        "timestamp": 1552685689.281,
        "owner": "102783229633165750360",
        "containers": [
          {
            "_id": "cFB0XUMG0",
            "size": 3,
            "name": "Jeff Van"
          },
          {
            "_id": "cP48SZN1U",
            "size": 25,
            "name": "Crystal"
          },
          {
            "_id": "cGTOEPCVY",
            "name": "Gideon",
            "size": 3
          },
          {
            "_id": "cVKDKIXR6",
            "name": "Gideo",
            "size": 3
          },
          {
            "_id": "cK3XB6EJW",
            "name": "Hok Van",
            "size": 3
          }
        ],
        "name": "Testingsd y",
        "is_deleted": false,
        "modified_timestamp": 1559617844.67,
        "items": [
          {
            "_id": "iK1MOQZ5Y",
            "size": 1,
            "name": "Aaron Fong Nope"
          },
          {
            "_id": "iJXBPIW15",
            "size": 1,
            "name": "1 2 3 4 5"
          },
          {
            "_id": "i8KG6ZPT2",
            "size": 1,
            "name": "2 here there hi"
          },
          {
            "_id": "iP82MZZYO",
            "size": 1,
            "name": "3"
          },
          {
            "_id": "i2RREEBCE",
            "size": 1,
            "name": "4 there"
          },
          {
            "_id": "iNV1XIPDM",
            "size": 1,
            "name": "6"
          },
          {
            "_id": "iI04V0CTB",
            "size": 1,
            "name": "7"
          },
          {
            "_id": "iFOXK90S0",
            "name": "10",
            "size": 1
          },
          {
            "_id": "iTGOYZKAO",
            "size": 1,
            "name": "Tfgggpr"
          },
          {
            "_id": "iDU0CTN0O",
            "size": 1,
            "name": "Gideon Chia"
          },
          {
            "_id": "iRFF0QTIJ",
            "size": 1,
            "name": "Caleb Cheung Bassist"
          },
          {
            "_id": "i331O0U5H",
            "size": 1,
            "name": "help"
          },
          {
            "_id": "iT89F1QGF",
            "name": "Crystal Chia",
            "size": 1
          }
        ],
        "user": "102783229633165750360",
        "users": [
          "102783229633165750360"
        ],
        "snapshots": [
          {
            "_id": "sQJQEU4PY",
            "unassigned": [
              "i2RREEBCE",
              "iP82MZZYO",
              "i8KG6ZPT2",
              "iJXBPIW15"
            ],
            "snapshotContainers": [
              {
                "_id": "cFB0XUMG0",
                "items": [
                  "i331O0U5H",
                  "iI04V0CTB"
                ]
              },
              {
                "_id": "cP48SZN1U",
                "items": [
                  "iT89F1QGF",
                  "iDU0CTN0O",
                  "iNV1XIPDM",
                  "iFOXK90S0"
                ]
              },
              {
                "_id": "cGTOEPCVY",
                "items": [
                  "iTGOYZKAO"
                ]
              },
              {
                "_id": "cVKDKIXR6",
                "items": [
                  "iRFF0QTIJ",
                  "iK1MOQZ5Y"
                ]
              },
              {
                "_id": "cK3XB6EJW",
                "items": []
              }
            ],
            "name": "To SB",
            "snapshot": {}
          },
          {
            "_id": "sH1Y3NY15",
            "unassigned": [
              "iRFF0QTIJ",
              "iFOXK90S0",
              "i2RREEBCE",
              "iNV1XIPDM",
              "iI04V0CTB",
              "iT89F1QGF"
            ],
            "snapshotContainers": [
              {
                "_id": "cFB0XUMG0",
                "items": [
                  "i331O0U5H"
                ]
              },
              {
                "_id": "cP48SZN1U",
                "items": [
                  "iDU0CTN0O"
                ]
              },
              {
                "_id": "cGTOEPCVY",
                "items": [
                  "i8KG6ZPT2"
                ]
              },
              {
                "_id": "cVKDKIXR6",
                "items": [
                  "iJXBPIW15"
                ]
              },
              {
                "_id": "cK3XB6EJW",
                "items": [
                  "iTGOYZKAO",
                  "iK1MOQZ5Y",
                  "iP82MZZYO"
                ]
              }
            ],
            "name": "Rides back home",
            "snapshot": {}
          }
        ]
      }})

    const listView = mount(<ListView store={store} snapshotId={"sQJQEU4PY"} />);

    expect(toJson(listView, {
        mode: 'deep'
    })).toMatchSnapshot();
});