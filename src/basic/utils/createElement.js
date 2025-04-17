export const createElementWithClass = (tag, className) => {
    const el = document.createElement(tag);
    el.className = className;
    return el;
}

export const createElementWithId = (tag, id, className) => {
    const el = document.createElement(tag);
    el.id = id;
    if (className) {
        el.className = className;
    }
    return el;
}