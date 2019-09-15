import {
    SNAPSHOT_DND_RESET,
    SNAPSHOT_DND_SET_DRAG_ITEM,
    SNAPSHOT_DND_SET_SELECTED_ITEMS,
    SNAPSHOT_DND_TOGGLE_SELECTION,
    SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP,
    SNAPSHOT_DND_MULTI_SELECT_TO,
    SNAPSHOT_DND_UNSELECT_ITEMS,
} from 'actions/actionTypes';
import { getSnapshotContainer } from 'utils';

const initialState = {
    // {itemId: _id, containerId: _id, index: index}
    selectedItems: [],
    // _id
    draggingItemId: null,
};

const snapshotDndReducer = (state = initialState, action) => {
    switch (action.type) {
        case SNAPSHOT_DND_RESET: {
            return initialState;
        }
        case SNAPSHOT_DND_SET_DRAG_ITEM: {
            return { ...state, draggingItemId: action.itemId };
        }
        case SNAPSHOT_DND_SET_SELECTED_ITEMS: {
            return { ...state, selectedItems: action.selectedItems };
        }
        case SNAPSHOT_DND_TOGGLE_SELECTION: {
            const { selectedItems } = state;
            const wasSelected = selectedItems.some(x => x.itemId === action.selectedItem.itemId);

            const newTaskIds = (() => {
                // Task was not previously selected
                // now will be the only selected item
                if (!wasSelected) {
                    return [action.selectedItem];
                }

                // Task was part of a selected group
                // will now become the only selected item
                if (selectedItems.length > 1) {
                    return [action.selectedItem];
                }

                // task was previously selected but not in a group
                // we will now clear the selection
                return [];
            })();

            return { ...state, selectedItems: newTaskIds };
        }
        case SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP: {
            const { selectedItems } = state;
            const index = selectedItems.findIndex(x => x.itemId === action.selectedItem.itemId);

            // if not selected - add it to the selected items
            if (index === -1) {
                return { ...state, selectedItems: [...selectedItems, action.selectedItem] };
            }

            // it was previously selected and now needs to be removed from the group
            const shallow = [...selectedItems];
            shallow.splice(index, 1);
            return { ...state, selectedItems: shallow };
        }
        case SNAPSHOT_DND_MULTI_SELECT_TO: {
            const { selectedItems } = state;
            // Nothing already selected
            if (!selectedItems.length) {
                return { ...state, selectedItems: [action.selectedItem] };
            }

            const containerOfNew = (action.selectedItem.containerId === 'unassigned')
                ? action.snapshot.unassigned
                : getSnapshotContainer(action.snapshot, action.selectedItem.containerId).items;
            const indexOfNew = action.selectedItem.index;

            const lastSelected = selectedItems[selectedItems.length - 1];
            const indexOfLast = lastSelected.index;

            // multi selecting to another column
            // Just add that new item
            if (action.selectedItem.containerId !== lastSelected.containerId) {
                return { ...state, selectedItems: [...selectedItems, action.selectedItem] };
            }

            // multi selecting in the same column
            // need to select everything between the last index and the current index inclusive

            // nothing to do here
            if (indexOfNew === indexOfLast) {
                return null;
            }

            const isSelectingForwards = indexOfNew > indexOfLast;
            const start = isSelectingForwards ? indexOfLast : indexOfNew;
            const end = isSelectingForwards ? indexOfNew : indexOfLast;

            const inBetween = containerOfNew.slice(start, end + 1);
            const toAdd = inBetween
                .filter(itemId => !selectedItems.some(item => item.itemId === itemId))
                .map(itemId => ({ itemId, containerId: action.selectedItem.containerId, index: containerOfNew.indexOf(itemId) }));

            const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
            return { ...state, selectedItems: [...selectedItems, ...sorted] };
        }
        case SNAPSHOT_DND_UNSELECT_ITEMS: {
            return { ...state, selectedItems: [] };
        }
        default: {
            return state;
        }
    }
};

export default snapshotDndReducer;
