import React from 'react'

import Item from 'components/item/item'

import { sortableElement, sortableContainer , DragLayer } from 'libraries/react-sortable-multiple-hoc';

import { FixedSizeList as List } from 'react-window';

export const dragLayer = new DragLayer();

export const SortableItemElement = sortableElement(props => {
    return (
        <div onClick={props.onSelect} className={props.className} > 
            <Item item={props.item} isSelected={(props.className === "selected")} />
        </div>
    )
});

// For Virtualized List, high performance but buggy..., disabled for now
const Rowy = (items) => {
    const Row = ({ index, style }) => {
        if (items[index]) {
            return (
                <div style={style}>
                    <SortableItemElement
                        key={index}
                        index={index}
                        item={items[index]}
                    />
                </div>
            )
        }
        console.log("attempted to render null item")
        return
    };
    return Row
}

// Using react-sortable-hoc to create a container for the sortable containers
export const SortableItemCollection = sortableContainer(({items, displayEditItem}) => {
    const itemHeight = 40;
    const maxHeight = 1000;
    const totalHeight = items.length * itemHeight;
    const height = totalHeight > maxHeight ? maxHeight : totalHeight + 1;

    const useVirtualize = false;

    if (useVirtualize) {
        return (
            // It needs to be wrapped in a div to prevent an error
            <div>
                <List height={height} itemCount={items.length} itemSize={itemHeight} >
                    {Rowy(items)}
                </List>
                
                { displayEditItem() }   
            </div>
        )
    }
    return (
        <div>
            {items.map((item, index) => {
                if (item) {
                    return <SortableItemElement key={index} index={index} item={item}/>
                }
                console.log("attempted to render null item")
                return
            })}
        </div>
    )
    
}); 