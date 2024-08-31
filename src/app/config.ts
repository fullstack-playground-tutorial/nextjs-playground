export const host = "http://localhost:8080";
export const wsHost = "ws://localhost:8080";
export const config = {
  auth_url: host + "/auth",
  user_url: host + "/user",
  search_url: host + "/search",
  notification_url: host + "/notification",
  friend_url: host + "/friend",
  ws: {
    notification_url: wsHost + `/notification/ws`,
  },
};
