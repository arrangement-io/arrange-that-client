import React from 'react'

import Item from 'components/item/item'

import { SortableElement, SortableContainer } from 'react-sortable-hoc';

export const SortableItemElement = SortableElement(({item}) => {
    return (
        <Item item={item} />
    )
});

// const dragLayer = new DragLayer();
// console.log(dragLayer);

// Using react-sortable-hoc to create a container for the sortable containers
export const SortableItemCollection = SortableContainer(({itemsInContainer, displayEditItem}) => {
    return (
        // It needs to be wrapped in a div to prevent an error
        <div>
            {
                itemsInContainer.map((item, index) => {
                    // Check for null items
                    if (item) {
                        return (
                            <SortableItemElement
                                key={item._id}
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