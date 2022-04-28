
export default class MyError extends Error {
    constructor(...params) {
        super(params);
        this.name = 'MyError';
    }
}