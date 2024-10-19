import config from "./config.js";
import interceptorHeaders from "./interceptor";

export default {
  getAutomaticRules() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getAutomaticRules,
      undefined,
      "GET"
    );
  },
  getManualRules() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getManualRules,
      undefined,
      "GET"
    );
  },

  getActiveSymbols() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getActiveSymbols,
      undefined,
      "GET"
    );
  },
  getBalanceMovementsMaster(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getBalanceMovementsMaster,
      body,
      "POST"
    );
  },
  updateManualRules(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.updateManualRules,
      body,
      "POST"
    );
  },
  updateAutomaticRules(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.updateAutomaticRules,
      body,
      "POST"
    );
  },
  transferBetweenMaster(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.transferBetweenMaster,
      body,
      "POST"
    );
  },
  editAutomaticRules(body) {
    return interceptorHeaders.createHeaders(
      config.urlDollar.editAutomaticRules,
      body,
      "POST"
    );
  },
};
