import config from "./config";
import interceptorHeaders from "./interceptor";
export default {
  getBalanceRetail(retailId) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBalanceRetail + retailId,
      undefined,
      "GET"
    );
  },

  async getMovementsRetail(retailId, type) {
    var dateEnd = new Date();
    var timeback = 1000 * 60 * 60 * 24 * 180;
    var dateInit = new Date(dateEnd.getTime() - timeback);
    var timeadd = 1000 * 60 * 60 * 48;
    dateEnd = new Date(dateEnd.getTime() + timeadd);
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBalanceMovementsRetail +
        retailId +
        "/" +
        dateInit.toISOString() +
        "/" +
        dateEnd.toISOString() +
        "/" +
        type,
      undefined,
      "GET"
    );
  },

  getBalanceMoneyclick(username) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBalanceMoneyclick + username,
      undefined,
      "GET"
    );
  },

  getInfoRetail(id) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getInfoRetail + id,
      undefined,
      "GET"
    );
  },

  getListRetails() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getRetails,
      undefined,
      "GET"
    );
  },

  addRetail(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.addRetail,
      body,
      "POST"
    );
  },
  addCurrencyOperationType(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.addCurrencyOperationType,
      body,
      "PUT"
    );
  },
  removeCurrencyOperationType(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.removeCurrencyOperationType,
      body,
      "PUT"
    );
  },
  changeStatusCreationRetail(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.changeStatusCreationRetail,
      body,
      "PUT"
    );
  },
  addAttachmentRetail(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.addAttachmentRetail,
      body,
      "POST",
      true
    );
  },
};
