export const migrate = (arrangement) => {
    let result = arrangement;
    // Change list of containers => dictionary of containers for performance
    if (Array.isArray(arrangement.containers)) {
        result = {
            ...result,
            containers: arrangement.containers.reduce((obj, container) => {
                obj[container._id] = container;
                return obj;
            }, {}),
        };
    }
    // Change list of items => dictionary of items for performance
    if (Array.isArray(arrangement.items)) {
        result = {
            ...result,
            items: arrangement.items.reduce((obj, item) => {
                obj[item._id] = item;
                return obj;
            }, {}),
        };
    }
    return result;
};
