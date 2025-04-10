export const serverHost = "http://localhost:8080";
export const wsHost = "ws://localhost:8080";
export const clientHost = "http://localhost:3000";
export const config = {
  auth_url: serverHost + "/auth",
  user_url: serverHost + "/user",
  search_url: serverHost + "/search",
  notification_url: serverHost + "/notification",
  friend_url: serverHost + "/friend",
  english_note_url: clientHost + "/eng-note",
  ws: {
    notification_url: wsHost + `/notification/ws`,
  },
};
