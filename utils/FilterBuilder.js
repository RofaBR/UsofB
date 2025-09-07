export default class FilterBuilder {
    static where(key, operator, value) {
        return { type: "filter", key, operator, value };
    }

    static and(...filters) {
        return { type: "and", filters };
    }

    static or(...filters) {
        return { type: "or", filters };
    }
}