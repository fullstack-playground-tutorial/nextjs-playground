export interface Notification {
  id: string;
  title: string;
  content: string;
  requester: Requester;
  subscribers: Subscriber[];
  type: NotificationType;
  url: string;
  createdAt: string;
  createdBy: string;
}

export interface Subscriber {
  id: string;
  readed: boolean;
}

interface Requester {
  id: string;
  name: string;
  avatarURL?: string;
}

export interface NotificationFilter {
  subscriberId?: string;
  createdFrom?: Date;
  createdTo?: Date;
  Visible?: boolean;
}

export interface NotificationService {
  Search(filter: NotificationFilter): Promise<Notification[]>;
  Patch(notification: Notification): Promise<number>;
}

type NotificationType = "inform" | "addfriend"| "accept_add_friend" | "reject_add_friend";
