import config from "./config.js";
import interceptorHeader from "./interceptor";
export default {
  async _giftCardSubmit(body) {
    const RESPONSE = await interceptorHeader.createHeaders(
      config.urlDollar.giftCardSubmit,
      body,
      "POST"
    );
    return RESPONSE;
  },
  async _giftCardDelete(body) {
    return await interceptorHeader.createHeaders(
      config.urlDollar.giftCardDelete,
      body,
      "POST"
    );
  },
   async _giftCardResend(body) {
    return await interceptorHeader.createHeaders(
      config.urlDollar.giftCardResend,
      body,
      "POST"
    );
  },
};