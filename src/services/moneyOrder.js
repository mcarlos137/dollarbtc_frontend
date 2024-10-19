import config from "./config.js";
import interceptorHeader from "./interceptor";
export default {
  async getMoneyOrder(status) {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.getMoneyOrder + status,
      undefined,
      "GET"
    );
    return RESPONSE;
  },
  async changeStatusMoneyOrder(body) {
    return await interceptorHeader.createHeaders(
      config.urlDollar.changeStatusMoneyOrder,
      body,
      "POST"
    );
  },
  
  async getMoneyOrderImage(fileName) {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.getMoneyOrderImage + fileName,
      undefined,
      "GET",
      true
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
};
