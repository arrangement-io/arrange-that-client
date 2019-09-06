import {
    SNAPSHOT_DND_RESET,
    SNAPSHOT_DND_SET_DRAG_ITEM,
    SNAPSHOT_DND_SET_SELECTED_ITEMS,
    SNAPSHOT_DND_TOGGLE_SELECTION,
    SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP,
    SNAPSHOT_DND_MULTI_SELECT_TO,
    SNAPSHOT_DND_UNSELECT_ITEMS
} from 'actions/actionTypes'

export const snapshotDndReset = () => {
    return {type: SNAPSHOT_DND_RESET}
};

export const snapshotDndSetDragItem = (itemId) => {
    return {
        type: SNAPSHOT_DND_SET_DRAG_ITEM,
        itemId
    }
};

export const snapshotDndSetSelectedItems = (selectedItems) => {
    return {
        type: SNAPSHOT_DND_SET_SELECTED_ITEMS,
        selectedItems
    }
};

export const snapshotDndToggleSelection = (selectedItem) => {
    return {
        type: SNAPSHOT_DND_TOGGLE_SELECTION,
        selectedItem
    }
}

export const snapshotDndToggleSelectionInGroup = (selectedItem) => {
    return {
        type: SNAPSHOT_DND_TOGGLE_SELECTION_IN_GROUP,
        selectedItem
    }
}

export const snapshotDndMultiSelectTo = (selectedItem, snapshot) => {
    return {
        type: SNAPSHOT_DND_MULTI_SELECT_TO,
        selectedItem,
        snapshot
    }
}

export const snapshotDndUnselectItems = () => {
    return {type: SNAPSHOT_DND_UNSELECT_ITEMS}
};