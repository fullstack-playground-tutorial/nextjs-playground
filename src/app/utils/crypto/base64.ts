export class  Base64 {
    static EncodeToString = (s :string) => {
        return Buffer.from(s).toString('base64')
    }
    static DecodeToString = (s: string) => {
        return Buffer.from(s,'base64').toString("ascii")
    }
}
