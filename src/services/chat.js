import config from "./config.js";
import interceptorHeaders from "./interceptor";
export default {
  postMessage(formData) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.postMessage,
      formData,
      "POST"
    );
  },
  getAllChatRooms(formData) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getAllChatRooms,
      formData,
      "POST"
    );
  },
  markAdminMessagesAsReaded(userName, subject, language) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.markAdminMessagesAsReaded +
        userName +
        "/" +
        subject +
        "/" +
        language,
      undefined,
      "GET"
    );
  },
};
