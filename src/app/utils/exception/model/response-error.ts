export class ResponseError<T> extends Error {
    status: number;
    body: T;
    constructor(message: string | null, status: number, body: T) {
        super(message ?? "")
        this.body = body
        this.status = status
    }
}