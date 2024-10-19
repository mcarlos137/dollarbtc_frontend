import HMACAuthorizationHeader from "./HMACAuthorizationHeader";
import crypto from "crypto";

const ENCODING_UTF_8 = "UTF-8";

const PARAMETER_HOST = "Host";
const PARAMETER_X_SERVER_AUTHORIZATION_HMAC_SHA256 = "X-Server-Authorization-HMAC-SHA256";

export default class HMACMessageCreator{

  static PARAMETER_AUTHORIZATION = "Authorization";
  static PARAMETER_X_AUTHORIZATION_TIMESTAMP= "X-Authorization-Timestamp";
  static PARAMETER_X_AUTHORIZATION_CONTENT_SHA256 = "X-Authorization-Content-SHA256";
  static PARAMETER_CONTENT_LENGTH = "Content-Length";
  static PARAMETER_CONTENT_TYPE = "Content-Type";
  static PARAMETER_HOST = "Host";

  constructor(){

  }

  createSignableRequestMessage1(request, authHeader){
    ////console.log(request.baseURL);
    ////console.log(request.headers);
    let httpVerb = request.method.toUpperCase();
    let host = request.baseURL.split("//")[1];
    let path = request.url;
    let queryParameters = request.params;
    if (queryParameters === undefined) {
      queryParameters = "";
    }

    if(httpVerb === "POST")
      request.headers.post["Content-Type"] = "application/json; charset=UTF-8";

    //if authHeader is not set, try setting it from request
    if (authHeader === undefined) {
      let authorization = request.headers.common[HMACMessageCreator.PARAMETER_AUTHORIZATION];
      authHeader = HMACAuthorizationHeader.getAuthorizationHeaderObject(authorization);
      if (authHeader === undefined) {
        let message = "Error: Invalid authHeader; one or more required attributes are not set.";
        //console.log(message);
        throw new Error(message);
      }
    }

    let authorizationCustomHeaderParameterMap = this.getCustomHeaderMap(authHeader, request);
    ////console.log(authorizationCustomHeaderParameterMap);
    let xAuthorizationTimestamp = request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP];
    ////console.log(xAuthorizationTimestamp);
    let contentLengthHeader = request.headers[HMACMessageCreator.PARAMETER_CONTENT_LENGTH];
    ////console.log(contentLengthHeader);
    let contentLength = 0;
    if (contentLengthHeader !== undefined) {
      contentLength = parseInt(contentLengthHeader);
    }

    //optional content type
    let contentTypeHeader = httpVerb === "POST"
      ? request.headers.post[HMACMessageCreator.PARAMETER_CONTENT_TYPE]:request.headers.get[HMACMessageCreator.PARAMETER_CONTENT_TYPE];
    let contentType = "";
    if (contentTypeHeader !== undefined) {
      contentType = contentTypeHeader;
    }

    //optional authorization content sha256
    let xAuthorizationContentSha256Header = request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256];
    let xAuthorizationContentSha256 = "";
    ////console.log(xAuthorizationContentSha256Header);
    if (xAuthorizationContentSha256Header !== undefined) {
      xAuthorizationContentSha256 = xAuthorizationContentSha256Header;
    }

    //optional request body
    let requestBody = request.data;

    return this.createSignableRequestMessage(httpVerb, host, path, queryParameters, authHeader,
      authorizationCustomHeaderParameterMap, xAuthorizationTimestamp, contentLength,
      contentType, xAuthorizationContentSha256, requestBody);

  }


  getCustomHeaderMap(authHeader,request){
    let theMap = new Map();
    let customHeaders = authHeader.headers;
    if (customHeaders !== undefined && customHeaders.length > 0) {
      customHeaders.forEach(headerName=>{
        let headerValue = request.headers[headerName];
        if (headerValue === undefined) {
          let message = "Error: Custom header \"" + headerName
            + "\" cannot be found in the HTTP request.";
          //console.log(message);
          throw new Error(message);
        }
        theMap.set(headerName.toLowerCase(), headerValue);
      })
    }
    return theMap;
  }

  createSignableRequestMessage(httpVerb, host, path, queryParameters, authHeader, authorizationCustomHeaderParameterMap,
             xAuthorizationTimestamp, contentLength, contentType, xAuthorizationContentSha256, requestBody) {
    let result = [];
    //adding request URI information
    result.push(httpVerb);
    result.push("\n");
    result.push(host);
    result.push("\n");
    result.push(path);
    result.push("\n");
    result.push(queryParameters);
    result.push("\n");

    //adding Authorization header parameters
    result.push("id=");
    result.push(this.escapeProper(authHeader.id));
    result.push("&nonce=");
    result.push(this.escapeProper(authHeader.nonce));
    result.push("&realm=");
    result.push(this.escapeProper(authHeader.realm));
    result.push("&version=");
    result.push(this.escapeProper(authHeader.version));
    result.push("\n");

    //adding Authorization custom header parameters
    ////console.log(authorizationCustomHeaderParameterMap);
    if (authorizationCustomHeaderParameterMap.length > 0) {
      let sortedCustomKeyList = authorizationCustomHeaderParameterMap.keys().sort();
      sortedCustomKeyList.forEach((headerKey) => {
        result.push(headerKey.toLowerCase());
        result.push(":");
        result.push(authorizationCustomHeaderParameterMap.get(headerKey));
        result.push("\n");
      });
    }

    //adding X-Authorization-Timestamp
    result.push(xAuthorizationTimestamp);

    //adding more if needed
    if(this.isPassingRequestBody(contentLength, xAuthorizationContentSha256, requestBody)) {
      if (this.isValidRequestBody(xAuthorizationContentSha256, requestBody)) {
        result.push("\n");
        result.push(contentType.toLowerCase());
        result.push("\n");
        result.push(xAuthorizationContentSha256);
      } else {
        let message = "Error: Request body does not have the same hash as X-Authorization-Content-Sha256 header.";
        //console.log(message);
        throw new Error(message);
      }
    }else{
      let message = "Error: Falling pasing request body";
      ////console.log(message);
      //throw new Error(message);
    }
    ////console.log(requestBody);
    ////console.log(result.join(""));
    return result.join("");
  }

  escapeProper(theString) {
    let x = encodeURI(theString).replace("+","%20");
    ////console.log("Escape proper: "+x);
    return x;
  }

  isValidRequestBody(xAuthorizationContentSha256, requestBody) {
    ////console.log(xAuthorizationContentSha256+"____"+requestBody+"____"+xAuthorizationContentSha256.length);
    if (xAuthorizationContentSha256 === undefined || xAuthorizationContentSha256.length <= 0
      || requestBody === undefined) {
      return false;
    }
    //calculate and check body hash
    let bodyHash = this.getBase64Sha256String(requestBody); //v2 specification requires base64 encoded SHA-256
    return bodyHash === xAuthorizationContentSha256;
  }

  isPassingRequestBody(contentLength, xAuthorizationContentSha256, requestBody) {
    ////console.log(xAuthorizationContentSha256+"____"+requestBody+"____"+xAuthorizationContentSha256.length+"____"+contentLength);
    return !(contentLength <= 0 || xAuthorizationContentSha256 === undefined
      || xAuthorizationContentSha256.length <= 0 || requestBody === undefined);
  }

  getBase64Sha256String(inputStream) {
    let inputStreamBytes = this.convertInputStreamIntoByteArrayOutputStream(inputStream); //convert to byte array
    return crypto.createHash("sha256").update(inputStreamBytes).digest("base64");
  }

  convertInputStreamIntoByteArrayOutputStream(inputStream) {
      return inputStream;
  }
}
