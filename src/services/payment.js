import config from "./config";
import user from "./user";
import interceptorHeaders from "./interceptor";

export default {
  createExternalPaymentMethod(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.createExternalPayment,
      body,
      "POST"
    );
  },
  getExternalPaymentMethod(currency, idPayment, bank) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getExternalPaymentMethod +
        user.getUserName() +
        "/" +
        currency +
        "/" +
        idPayment +
        "/" +
        bank,
      undefined,
      "GET"
    );
  },
};
