import axios from "axios";
import config from "./config.js";
import decode from "./decode";
import headers from "./headers";
import HMACInterceptor from "../hmac/HMACInterceptor";
const URL_BASE_DBTC = config.apiDollarBtcUrl;
export default {
  createHeaders(url, body, method, attacht, timeout) {
    const instance = axios.create();
    let interceptor;
    if (sessionStorage.getItem("auth") !== "true") {
      interceptor = new HMACInterceptor(
        "Admin",
        "f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
        "eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
        "SHA256"
      );
    } else if (
      sessionStorage.getItem("s") !== "null" &&
      sessionStorage.getItem("s") !== null &&
      sessionStorage.getItem("s") !== undefined
    ) {
      let userName = sessionStorage.getItem("username");
      if (userName.includes("@")) {
        userName = userName.replace("@", "____");
      }
      let decryptoken = decode.decode(sessionStorage.getItem("s"));
      decryptoken = decryptoken.split("__")[0];
      decryptoken = decode.decode(decryptoken);
      interceptor = new HMACInterceptor(
        userName,
        "f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
        decryptoken,
        "SHA256"
      );
    } else {
      interceptor = new HMACInterceptor(
        "Admin",
        "f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
        "eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
        "SHA256"
      );
    }
    let conf;
    conf = headers.createGeneral(
      URL_BASE_DBTC,
      url,
      body,
      method,
      attacht,
      timeout
    );
    instance.interceptors.request.use(
      (conf) => {
        interceptor.process(conf);
        return conf;
      },
      (error) => {
        ////console.log(error);
        return Promise.reject(error);
      }
    );
    return instance(conf);
  },
};
