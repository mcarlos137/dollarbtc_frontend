import config from "./config.js";
import interceptorHeader from "./interceptor";
export default {
  getAddressByCurrency(currency) {
    return interceptorHeader.createHeaders(
      config.urlDollar.getAddressByCurrency + currency,
      undefined,
      "GET"
    );
  },
  createAddressByCurrency(body) {
    return interceptorHeader.createHeaders(
      config.urlDollar.createAddress,
      body,
      "POST"
    );
  },
  async getMovementProcesUsers() {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.getProcessingBalance,
      undefined,
      "GET"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in get balance blockchain");
    }
    return RESPONSE;
  },
};
