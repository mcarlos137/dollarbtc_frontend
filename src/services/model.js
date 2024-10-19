import config from "./config.js";
import interceptorHeaders from "./interceptor";

export default {
  modelCopy(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelCopy,
      body,
      "POST"
    );
    //return axios.post(URL_BASE_DBTC + config.urlDollar.modelCopy, body);
  },
  modelActive(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelActivate,
      body,
      "POST"
    );
  },
  modelModifyDescription(planNameToChange, description) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelModifyDescription +
        planNameToChange +
        "/" +
        description,
      undefined,
      "GET"
    );
  },
  modelListUser(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelListUser + username + "/false",
      undefined,
      "GET"
    );
  },
  getInitialAmounts(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getInitialAmounts + username,
      undefined,
      "GET"
    );
  },
  modelInactivate(planNameToInactivate) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelInactivate + "/" + planNameToInactivate,
      undefined,
      "GET"
    );
  },
  modelListAvailable(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.modelListAvailable + "/" + username,
      undefined,
      "GET"
    );
  },
};
