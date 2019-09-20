export const migrate = (real) => {
    let result = real;
    // Change list of containers => dictionary of containers for performance
    if (Array.isArray(real.containers)) {
        result = {
            ...result,
            containers: real.containers.reduce((obj, container) => {
                obj[container._id] = container;
                return obj;
            }, {}),
        };
    }
    return result;
};
