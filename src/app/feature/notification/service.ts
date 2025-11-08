import {
  Notification,
  NotificationFilter,
  NotificationService,
} from "./notification";
import { getCookieHeader } from "@/app/utils/http/headers/headers.server";
import { HeaderType } from "@/app/utils/http/headers";
import { HTTPService } from "@/app/utils/http";

export class NotificationClient implements NotificationService {
  constructor(private http: HTTPService, private url: string) {
    this.Search = this.Search.bind(this);
  }

  async Search(filter: NotificationFilter): Promise<Notification[]> {
    try {
      const cookieHeader = await getCookieHeader();
      const res = await this.http.post<Notification[], NotificationFilter>(
        `${this.url}/search`,
        filter,
        {
          headers: {
            [HeaderType.cookie]: cookieHeader,
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
    const cookieHeader = await getCookieHeader();
    return this.http.patch<number>(`${this.url}`, notification, {
      headers: {
        [HeaderType.cookie]: cookieHeader,
      },
      cache: "no-cache",
    }).then(res => res.body);
  }
}
