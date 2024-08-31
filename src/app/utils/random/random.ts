/**
 * Generate random UUIDs 
 * Thank to solution https://stackoverflow.com/a/2117523/23604995
 */

export const uuidv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
