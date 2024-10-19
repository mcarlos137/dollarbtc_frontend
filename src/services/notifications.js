import axios from "axios";
import config from "./config.js";
import headers from "./headers";
import decode from "./decode";
import _ from "underscore";
import HMACInterceptor from "../hmac/HMACInterceptor";
import interceptorHeader from "./interceptor";
import packageJson from "../../package.json";
const URL_BASE_DBTC = config.apiDollarBtcUrl;
const URL_BASE_BUSHIDO = packageJson.bushidoServiceURL;

export default {
  getHeader() {
    return sessionStorage.getItem("header");
  },
 createTopic(body) {
    return interceptorHeader.createHeaders(
			config.urlDollar.createTopic,
			body,
			"POST",
		);
  },
  getTopics() {
      return interceptorHeader.createHeaders(
      config.urlDollar.getTopics,
      undefined,
			"GET",
    );
  },
  getGroups() {
      return interceptorHeader.createHeaders(
      config.urlDollar.getGroups,
      undefined,
			"GET",
		);
  },
  getMessages(){
     return interceptorHeader.createHeaders(
      config.urlDollar.getMessages ,
      undefined,
			"GET",
		);
  },
  getMessagesByUserName(userName){
     return interceptorHeader.createHeaders(
      config.urlDollar.getMessages + " / " + userName ,
      undefined,
			"GET",
		);
  },
  addGroupsToTopic(body){
       return interceptorHeader.createHeaders(
			config.urlDollar.addGroupsToTopic,
			body,
			"POST",
		);
  },
  sendMessage(body) {
  return interceptorHeader.createHeaders(
			config.urlDollar.sendMessage,
			body,
			"POST",
		);
    },
    markMessageAsReaded(userName,id){
       return interceptorHeader.createHeaders(
      config.urlDollar.markMessageAsReaded + "/" + userName + "/" + id,
      undefined,
			"GET",
		);
    },
    addTokenToUser(body){
       return interceptorHeader.createHeaders(
			config.urlDollar.addTokenToUser,
			body,
			"POST",
		);
    },
    async tokenTransferred(userName){
      const RESPONSE = await axios.put(
			config.apiBushidoBaseUrl + config.urlBushido.tokenTransferred,
			userName,
			{ headers: { "Content-Type": "text/plain" } },
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error tokenTransferred");
		}
		return RESPONSE;
    }
   
};
