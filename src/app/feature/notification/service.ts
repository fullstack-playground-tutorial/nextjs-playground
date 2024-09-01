import { HttpService } from "@/app/utils/http/http-default";
import {
  Notification,
  NotificationFilter,
  NotificationService,
} from "./notification";
import { getCookieHeader, HeaderType } from "@/app/utils/http/headers";

export class NotificationClient implements NotificationService {
  constructor(private http: HttpService, private url: string) {
    this.Search = this.Search.bind(this);
  }

  async Search(filter: NotificationFilter): Promise<Notification[]> {
    try {
      const res = await this.http.post<Notification[]>(
        `${this.url}/search`,
        filter,
        {
          headers: {
            [HeaderType.cookie]: getCookieHeader(),
          },
          cache: "no-cache",
        }
      );
      return res.body;
    } catch (e) {
      throw e;
    }
  }

  async Patch(notification: Notification): Promise<number> {
    return this.http.patch<number>(`${this.url}`, notification, {
      headers: {
        [HeaderType.cookie]: getCookieHeader(),
      },
      cache: "no-cache",
    }).then(res => res.body);
  }
}
