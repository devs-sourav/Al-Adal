import axios from "axios";

const api = axios.create({
  baseURL: "https://server.al-adal.com/api/v1/",
});

export default api;
