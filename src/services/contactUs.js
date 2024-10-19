import axios from "axios";
import config from "./config.js";
import HMACInterceptor from "../hmac/HMACInterceptor";
import headers from "./headers";
const URL_DOLLAR_BTC = config.apiDollarBtcUrl;

export default {
  sendFormContactUs(details) {
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    const instance = axios.create();
    let interceptor = new HMACInterceptor(
      "Admin",
      "f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
      "eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
      "SHA256"
    );
    let conf = headers.createHeadersPostDistinct(
      URL_DOLLAR_BTC,
      config.urlDollar.sendContactUs,
      formBody
    );

    instance.interceptors.request.use(
      (conf) => {
        interceptor.process(conf);
        return conf;
      },
      (error) => {
        //console.log(error);
        return Promise.reject(error);
      }
    );
    return instance(conf);
  },
  /*sendFormContactUs(details){
    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
    return axios.post(URL_DOLLAR_BTC+config.urlDollar.sendContactUs ,formBody,{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }*/
};
