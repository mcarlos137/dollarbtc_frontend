import config from "./config.js";
import inteceptoHeaders from "./interceptor";
export default {
  async getAttachementByRetail(idRetail, nameFile) {
    const RESPONSE = await inteceptoHeaders.createHeaders(
      config.urlDollar.getAttachmentRetail + idRetail + "/" + nameFile,
      undefined,
      "GET",
      true
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async getAttachementUser(username, fileName) {
    const RESPONSE = await inteceptoHeaders.createHeaders(
      config.urlDollar.getAttachmentsUser + username + "/" + fileName,
      undefined,
      "GET",
      true
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async getQRGoogleAuth(username) {
    const RESPONSE = await inteceptoHeaders.createHeaders(
      config.urlDollar.getQrAttachmentGoogleAuth + username,
      undefined,
      "GET",
      true
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
  async getOtcAttachment(otcOperaionId, fileName) {
    const RESPONSE = await inteceptoHeaders.createHeaders(
      config.urlDollar.getOtcOperationFile + otcOperaionId + "/" + fileName,
      undefined,
      "GET",
      true
    );
    if (RESPONSE.status !== 200) {
      throw Error("Error in request");
    }
    return RESPONSE;
  },
};
