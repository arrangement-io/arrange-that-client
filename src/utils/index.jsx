export function uuid (type) {
    var text
    if (type === 'container')
        text = "c"
    else if (type === "item")
        text = "i"
    else if (type === "snapshot")
        text = "s"
    else if (type === "arrangement")
        text = "a"
    else
        return ''
    
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}

export function getListStyle (isDraggingOver, isOwn, isFull) {
    let color = 'white'
    if (isDraggingOver) {
        if (!isOwn && isFull)
            color = 'lightcoral'
        else
            color = 'lightblue'
    }
    return {
        background: color,
        padding: 0,
    }
}

export function getItemStyle (isDragging, draggableStyle, dragColor) {
    return {
    // some basic styles to make the items look a bit nicer
        userSelect: 'none',
        padding: 0,
        margin: `0 0 $8px 0`,

        // change background colour if dragging
        background: isDragging ? dragColor : 'white',

        // styles we need to apply on draggables
        ...draggableStyle
    }
}

export function reorder (list, startIndex, endIndex) {
    if (typeof list === 'undefined')
        list = []
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result;
}

export function move (source, destination, droppableSource, droppableDestination) {
    if (typeof source === 'undefined')
        source = []
    if (typeof destination === 'undefined')
        destination = []
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result['source'] = sourceClone
    result['destination'] = destClone

    return result
}

export function getSnapshotIndex (state, snapshotId) {
    return state.snapshots.findIndex(x => x._id === snapshotId)
}

export function getSnapshotContainerIndex (snapshot, containerId) {
    return snapshot.snapshotContainers.findIndex(x => (x && x._id === containerId))
}

export function getSnapshotContainer (snapshot, containerId) {
    return snapshot.snapshotContainers.find(x => (x && x._id === containerId))
}
