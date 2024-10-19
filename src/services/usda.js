import config from "./config";
import interceptorHeaders from "./interceptor";
export default {
  getParamsUsda() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getParamsUSDA,
      undefined,
      "GET"
    );
  },
  editParamsUsda(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.editParamsUSDA,
      body,
      "POST"
    );
  },
};
