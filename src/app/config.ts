export const serverHost = "https://localhost:8081";
export const wsHost = "ws://localhost:8081";
export const clientHost = "http://localhost:3000";
export const config = {
  auth_url: serverHost + "/v1/auth",
  user_url: serverHost + "/user",
  search_url: serverHost + "/search",
  notification_url: serverHost + "/notification",
  friend_url: serverHost + "/friend",
  english_note_url: clientHost + "/api/eng-note",
  ws: {
    notification_url: wsHost + `/notification/ws`,
  },
};
