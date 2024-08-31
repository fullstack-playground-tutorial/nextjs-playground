import * as crypto from 'crypto';

export class Crypto {
    static hmacSHA256(input: string, key: string){
        return crypto.createHmac('sha256', key).update(input).digest("base64")
    } 
}