import config from "./config.js";
import interceptorHeader from "./interceptor";
export default {
  async getBatchProcesses(cant) {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.getBatchProcesses + cant,
      undefined,
      "GET"
    );
    return RESPONSE;
  },
  async getOperations(body) {
    return await interceptorHeader.createHeaders(
      config.urlDollar.getOperationsTranfer,
      body,
      "POST"
    );
  },
  createProcess(body) {
    return interceptorHeader.createHeaders(
      config.urlDollar.createProcessTranfer,
      body,
      "POST"
    );
  },
  changeProcessStatus(body) {
    return interceptorHeader.createHeaders(
      config.urlDollar.changeProcessStatus,
      body,
      "POST"
    );
  },
  changeOperationsOfProcessStatus(body) {
    return interceptorHeader.createHeaders(
      config.urlDollar.changeOperationsOfProcessStatus,
      body,
      "POST"
    );
  },
  applyProcess(body) {
    return interceptorHeader.createHeaders(
      config.urlDollar.applyProcess,
      body,
      "POST"
    );
  },
  getProcessFile(username, id, type) {
    return interceptorHeader.createHeaders(
      config.urlDollar.getProcessFile + username + "/" + id + "/" + type,
      undefined,
      "GET"
    );
  },
};
