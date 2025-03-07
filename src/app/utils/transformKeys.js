// utils/transformKeys.js
export function camelToSnakeCase(obj) {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = key.replace(
                /[A-Z]/g,
                (letter) => `_${letter.toLowerCase()}`
            );
            newObj[newKey] = obj[key];
        }
    }
    return newObj;
}

// utils/transformKeys.js
export function snakeToCamelCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamelCase(item));
    } else if (obj !== null && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = key.replace(/_([a-z])/g, (match, letter) =>
                    letter.toUpperCase()
                );
                newObj[newKey] = snakeToCamelCase(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}
