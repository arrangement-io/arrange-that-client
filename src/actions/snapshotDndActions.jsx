import {
    SNAPSHOT_DND_RESET,
    SNAPSHOT_DND_SET_DRAG_ITEM,
    SNAPSHOT_DND_SET_SELECTED_ITEMS,
    SNAPSHOT_DND_TOGGLE_SELECTION,
    SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP,
    SNAPSHOT_DND_MULTI_SELECT_TO,
    SNAPSHOT_DND_UNSELECT_ITEMS,
} from 'actions/actionTypes';

export const snapshotDndReset = () => ({ type: SNAPSHOT_DND_RESET });

export const snapshotDndSetDragItem = itemId => ({
    type: SNAPSHOT_DND_SET_DRAG_ITEM,
    itemId,
});

export const snapshotDndSetSelectedItems = selectedItems => ({
    type: SNAPSHOT_DND_SET_SELECTED_ITEMS,
    selectedItems,
});

export const snapshotDndToggleSelection = selectedItem => ({
    type: SNAPSHOT_DND_TOGGLE_SELECTION,
    selectedItem,
});

export const snapshotDndToggleSelectionInGroup = selectedItem => ({
    type: SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP,
    selectedItem,
});

export const snapshotDndMultiSelectTo = (selectedItem, snapshot) => ({
    type: SNAPSHOT_DND_MULTI_SELECT_TO,
    selectedItem,
    snapshot,
});

export const snapshotDndUnselectItems = () => ({ type: SNAPSHOT_DND_UNSELECT_ITEMS });
