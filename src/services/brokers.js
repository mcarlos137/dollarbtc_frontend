import config from "./config.js";
import interceptorHeaders from "./interceptor";
export default {
  getBrokers(operation) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBrokers + "/" + operation,
      undefined,
      "GET"
    );
  },
  createStaticOffer(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.addStaticOfferBroker,
      body,
      "POST"
    );
  },
  createDynamicOffer(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.addDynamicOfferBroker,
      body,
      "POST"
    );
  },
  getOffersParams(currency) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getOfferParams + currency,
      undefined,
      "GET"
    );
  },
  getOfferByUrl(token) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getOfferUrl + token,
      undefined,
      "GET"
    );
  },
  getOfferByUser(user) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getOfferBroker + user,
      undefined,
      "GET"
    );
  },
  editOfferStatic(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.updateOfferStatic,
      body,
      "POST"
    );
  },
  editOfferDynamic(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.updateOfferDynamic,
      body,
      "POST"
    );
  },
  removeOffer(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.removeOfferBroker,
      body,
      "POST"
    );
  },
  getOldOffer(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getOldOffersBroker + username,
      undefined,
      "GET"
    );
  },
  sendToPaymentMethod(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.sendToPayment,
      body,
      "POST"
    );
  },
  getBalance(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBalanceBroker + username,
      undefined,
      "GET"
    );
  },
};
