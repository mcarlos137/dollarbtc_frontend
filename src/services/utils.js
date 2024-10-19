import config from "../services/config";
import axios from "axios";
import HMACInterceptor from "../hmac/HMACInterceptor";
const URL_IPAPI = config.apiIpApiUrl;
const SESSION_USER_CHAT_UNREGISTER = "SessionUserChatUnregister";

export default {
  getAllInfo(ip) {
    return axios.get(URL_IPAPI + ip + "/json");
  },
  letters: "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789.",
  validateAddress(value) {
    let valid;
    for (let val of value) {
      if (this.letters.indexOf(val) !== -1) {
        valid = true;
        continue;
      } else {
        valid = false;
        break;
      }
    }
    return valid;
  },
  validateNumber(value, setValue) {
    let valid,
      cont = 0;
    for (let val of value) {
      if (this.number.indexOf(val) !== -1) {
        if (val !== ".") {
          valid = true;
          continue;
        } else {
          cont++;
          continue;
        }
      } else {
        valid = false;
        break;
      }
    }
    if (cont <= 1) {
      valid = true;
    } else {
      valid = false;
    }
    return valid;
  },
  formatCountryCoinCode(code){
    let values = code.split("_");
    if(values.length > 1)
      return values[0].toLowerCase()+values[1].charAt(0).toUpperCase()+values[1].slice(1).toLowerCase();
    else
      return code.toLowerCase();
  },
  isAccountOwnedUser(name, lastName, verify, value){
    let propertyUser;
    if(verify){
      name = name.toUpperCase();
      lastName = lastName.toUpperCase();
      value = value.toUpperCase();
      let fullName=name+" "+lastName;
      if (value.includes(fullName)){
        propertyUser = true;
      }else if (value.includes(name)){
        propertyUser = true;
      }else if (value.includes(lastName)){
        propertyUser = true;
      }
    }else{
      propertyUser=false;
    }
  },
  isToday(someDate) {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  },

  isYesterday(someDate){
    const today = new Date();
    return (someDate.getDate()+1) === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  },

  getMonthInLetters(month){
    switch (month) {
      case 0: return "Ene";
      case 1: return "Feb";
      case 2: return "Mar";
      case 3: return "Abr";
      case 4: return "May";
      case 5: return "Jun";
      case 6: return "Jul";
      case 7: return "Ago";
      case 8: return "Sep";
      case 9: return "Oct";
      case 10: return "Nov";
      case 11: return "Dic";
    }
  },
  determinateLanguage(lang){
    switch (lang) {
      case 'por': return "PT";
      case 'spa': return "ES";
      case "eng": return "EN";
      case "fra": return "FR";
      case "rus": return "RU";
      case "deu": return "DE";
      case "pol": return "PL";
      case "gsw": return "EL";
      case "cmn": return "ZH";
      case "jpn": return "JA";
    }
  },

  getSessionChatUnregisterKey(){
    return SESSION_USER_CHAT_UNREGISTER;
  }

};
