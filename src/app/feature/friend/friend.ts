export interface FriendService {
    addFriend(friendId: string):Promise<number>
    accept(friendId: string): Promise<number>
    reject(friendId: string): Promise<number>
    cancel(friendId: string): Promise<number>
    unfriend(friendId: string): Promise<number>
}