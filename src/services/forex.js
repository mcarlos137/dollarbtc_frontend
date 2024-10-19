import config from "./config.js";
import interceptorHeaders from "./interceptor";

export default {
  getRate(symbol) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getRate + symbol,
      undefined,
      "GET"
    );
  },
  getHistoricalRates(symbol) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getHistoricalRates + symbol,
      undefined,
      "GET"
    );
  },
};
