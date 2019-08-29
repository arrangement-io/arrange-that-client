import React from 'react'
import { Grid } from '@material-ui/core'

import { sortableElement, sortableContainer } from 'libraries/react-sortable-multiple-hoc';

import Container from 'components/container/container'

// Using react-sortable-hoc to create a sortable container element
export const SortableContainerElement = sortableElement(props => {
    return (
        <Grid item xs={12} sm={6} md={3} lg={2} key={props.container._id}>
            <Container 
                container={props.container}
                snapshot={props.snapshot}
                items={props.items}
            /> 
        </Grid>
    )
});

// Using react-sortable-hoc to create a container for the sortable containers
export const SortableContainerCollection = sortableContainer(({snapshot, containers, items, displayEditContainer}) => {
    const indexedItems = {};
    items.forEach(item => indexedItems[item._id] = item);

    return (
        // It needs to be wrapped in a div to prevent an error
        <div>
            <Grid container spacing={8}>
                {
                    snapshot.snapshotContainers.map((snapshotContainer, index) => {
                        const container = containers.find(c => c._id === snapshotContainer._id);

                        if (container) {
                            // Convert the itemIds into items
                            const itemsInContainer = []
                            for (let itemId of snapshotContainer.items) {
                                const item = indexedItems[itemId];
                                if (item) {
                                    itemsInContainer.push(item);
                                }
                            }
                            return (          
                                <SortableContainerElement 
                                    key={container._id} 
                                    index={index} 
                                    container={container}
                                    snapshot={snapshot}
                                    items={itemsInContainer}
                                />
                            )  
                        }
                    })
                }
                { displayEditContainer() }
            </Grid>        
        </div>
    )
});