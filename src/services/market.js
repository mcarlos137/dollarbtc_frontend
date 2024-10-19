import config from "./config";
import interceptorHeaders from "./interceptor";
export default {
  prices: [],
  getOffers() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getOffers,
      undefined,
      "GET"
    );
  },
  getFullPriceInfo() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getFullPriceInfo,
      undefined,
      "GET"
    );
  },
  getReducedOffers() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getReducedOffers,
      undefined,
      "GET"
    );
  },
  getLocalbitcoinTicker(parameter) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getLocalbitcoinTicker + "/" + parameter,
      undefined,
      "GET"
    );
  },
  getLocalbitcoinTickerTwo(parameter1, parameter2) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getLocalbitcoinTicker +
        "/" +
        parameter1 +
        "/" +
        parameter2,
      undefined,
      "GET"
    );
  },
  getPercentGauge(symbol) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getPercentSymbol + symbol,
      undefined,
      "GET"
    );
  },
  getLocalbitcoinReducedTickers() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getLocalbitcoinReducedTickers,
      undefined,
      "GET"
    );
  },
  fastChangeFromBTC(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.fastChangeFromBTC,
      body,
      "PUT"
    );
  },
  fastChangeToBTC(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.fastChangeToBTC,
      body,
      "PUT"
    );
  },
  obtPrices() {
    return this.prices;
  },
};
