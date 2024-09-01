import { HttpService } from "@/app/utils/http/http-default";
import { FriendService } from "./friend";
import { ContentType, getCookieHeader, HeaderType } from "@/app/utils/http/headers";


export class FriendClient implements FriendService {
  constructor(
    private httpInstance: HttpService,
    private friend_url: string,
  ) {
    this.addFriend = this.addFriend.bind(this);
  }
  async accept(friendId: string): Promise<number> {    
    const res = await this.httpInstance.patch<number>(
      `${this.friend_url}/${friendId}/accept`,
      {},
      {
        headers: {
          [HeaderType.contentType]: ContentType.applicationJson,
          [HeaderType.cookie]: getCookieHeader(),
        },
        cache: "no-cache",
      }
    );
    return res.body;
  }
  async reject(friendId: string): Promise<number> {
    const res = await this.httpInstance.patch<number>(
      `${this.friend_url}/${friendId}/reject`,
      {},
      {
        headers: {
          [HeaderType.contentType]: ContentType.applicationJson,
          [HeaderType.cookie]: getCookieHeader(),
        },
        cache: "no-cache",
      }
    );
    return res.body;
  }

  async addFriend(friendId: string): Promise<number> {
    const res = await this.httpInstance.post<number>(
      `${this.friend_url}/${friendId}`,
      {},
      {
        headers: {
          [HeaderType.contentType]: ContentType.applicationJson,
          [HeaderType.cookie]: getCookieHeader(),
        },
        cache: "no-cache",
      }
    );
    return res.body;
  }

  async unfriend(friendId: string): Promise<number> {
    const res = await this.httpInstance.patch<number>(
      `${this.friend_url}/${friendId}/unfriend`,
      {},
      {
        headers: {
          [HeaderType.contentType]: ContentType.applicationJson,
          [HeaderType.cookie]: getCookieHeader(),
        },
        cache: "no-cache",
      }
    );
    return res.body;
  }

  async cancel(requestId: string): Promise<number> {
    const res = await this.httpInstance.patch<number>(
      `${this.friend_url}/${requestId}/cancel`,
      {},
      {
        headers: {
          [HeaderType.contentType]: ContentType.applicationJson,
          [HeaderType.cookie]: getCookieHeader(),
        },
        cache: "no-cache",
      }
    );
    return res.body;
  }
}
