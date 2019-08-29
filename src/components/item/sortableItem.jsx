import React from 'react'

import Item from 'components/item/item'

import { sortableElement, sortableContainer } from 'libraries/react-sortable-multiple-hoc';
import { DragLayer } from 'libraries/react-sortable-multiple-hoc';

export const dragLayer = new DragLayer();

export const SortableItemElement = sortableElement(props => {
    return (
        <div onClick={props.onSelect} className={props.className}> 
            <Item item={props.item} />
        </div>
    )
});

// const dragLayer = new DragLayer();
// console.log(dragLayer);

// Using react-sortable-hoc to create a container for the sortable containers
export const SortableItemCollection = sortableContainer(({items, displayEditItem}) => {
    return (
        // It needs to be wrapped in a div to prevent an error
        <div>
            {items.map((item, index) => {
                    // Check for null items
                    if (item) {
                        return (
                            <SortableItemElement
                                key={index}
                                index={index}
                                item={item}
                            />
                        )
                    }
                    console.log("attempted to render null item")
                    return
                })
            }
            { displayEditItem() }   
        </div>
    )
}); 