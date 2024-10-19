import config from "./config.js";
import interceptorHeaders from "./interceptor";
export default {
  getAutomaticRulesMaster() {
    return interceptorHeaders.createHeaders(
      config.urlDollar.getAutomaticRulesMaster,
      undefined,
      "GET"
    );
  },
  async getMasterAccountConfig(masterName) {
    const RESPONSE = await interceptorHeaders.createHeaders(
      config.urlDollar.getConfigMasterAccount + masterName + "/true",
      undefined,
      "GET"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async generateMasterAccount(body) {
    const RESPONSE = await interceptorHeaders.createHeaders(
      config.urlDollar.addWalletToMasterAccount,
      body,
      "POST"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async sendBitCoinsMasterAccount(body) {
    const RESPONSE = await interceptorHeaders.createHeaders(
      config.urlDollar.balanceOperationMasterAccountSend,
      body,
      "POST"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async getMasterAccountNames() {
    const RESPONSE = await interceptorHeaders.createHeaders(
      config.urlDollar.getMasterAccountsName,
      null,
      "GET"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async getMasterAccountDetails() {
    const RESPONSE = await interceptorHeaders.createHeaders(
      config.urlDollar.getMasterAccountDetails,
      null,
      "GET"
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
};
