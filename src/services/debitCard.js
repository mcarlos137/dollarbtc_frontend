import config from "./config.js";
import interceptorHeader from "./interceptor";
export default {
  async listDebitCard(body) {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.listDebitCard,
      body,
      "POST"
    );
    return RESPONSE;
  },
  async changeStatusCard(body) {
    return await interceptorHeader.createHeaders(
      config.urlDollar.changeStatusCard,
      body,
      "POST"
    );
  },
};
