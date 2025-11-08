export const authServerHost = "https://localhost:8081";
export const wsHost = "ws://localhost:8081";
export const backofficeServerHost = "https://localhost:8082";
export const clientHost = "http://localhost:3000";
export const config = {
  auth_url: authServerHost + "/v1/auth",
  user_url: authServerHost + "/user",
  search_url: authServerHost + "/search",
  topic_url: backofficeServerHost+ "/topics",
  topic_tag_url: backofficeServerHost+ "/topics/tags",
  notification_url: authServerHost + "/notification",
  friend_url: authServerHost + "/friend",
  english_note_url: clientHost + "/api/eng-note",
  ws: {
    notification_url: wsHost + `/notification/ws`,
  },
};
