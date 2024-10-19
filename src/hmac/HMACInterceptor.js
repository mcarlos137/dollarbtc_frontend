import HMACAlgorithmFactory from './HMACAlgorithmFactory';
import HMACAuthorizationHeader from './HMACAuthorizationHeader';
import uuid from 'uuid';
import crypto from 'crypto';
import HMACMessageCreator from './HMACMessageCreator';

/*const CONTEXT_HTTP_VERB = "httpVerb";
const CONTEXT_AUTH_HEADER = "authHeader";
const CONTEXT_X_AUTHORIZATION_TIMESTAMP = "xAuthorizationTimestamp";
const CONTEXT_SIGNABLE_REQUEST_MESSAGE = "signableRequestMessage";
const CONTEXT_SIGNED_REQUEST_MESSAGE = "signedRequestMessage";*/
const VERSION = '2.0';

export default class HMACInterceptor {
  constructor(realm, accessKey, secretKey, algorithmName) {
    this.realm = realm;
    this.accessKey = accessKey;
    this.secretKey = secretKey;

    let algorithmFactory = new HMACAlgorithmFactory();
    this.algorithm = algorithmFactory.createAlgorithm(algorithmName);

    this.customHeaders = [];
  }

  createHMACAuthorizationHeader() {
    let result = new HMACAuthorizationHeader(
      this.realm,
      this.accessKey,
      uuid.v4(),
      VERSION,
      this.customHeaders,
      /*signature*/ null
    );
    if (result.isAuthorizationHeaderValid()) {
      return result;
    } else {
      return null;
    }
  }

  process(request) {
    let authHeader = this.createHMACAuthorizationHeader();
    if (authHeader === undefined) {
      let message =
        'Error: Invalid authHeader; one or more required attributes are not set.';
      //console.log(message);
      throw new Error(message);
    }

    //add X-Authorization-Timestamp if not set
    let xAuthorizationTimestampHeaderHeader =
      request.headers[HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP];
    if (xAuthorizationTimestampHeaderHeader === undefined) {
      let unixTime = this.getCurrentUnixTime();
      request.headers[
        HMACMessageCreator.PARAMETER_X_AUTHORIZATION_TIMESTAMP
      ] = unixTime.toString();
    }

    //check content length
    let contentLengthHeader =
      request.headers[HMACMessageCreator.PARAMETER_CONTENT_LENGTH];
    ////console.log(contentLengthHeader);
    let contentLength = 0;
    if (contentLengthHeader !== undefined) {
      contentLength = parseInt(contentLengthHeader);
      ////console.log(contentLength);
    }
    if (contentLength > 0) {
      request.headers[
        HMACMessageCreator.PARAMETER_CONTENT_LENGTH
      ] = contentLength;
      let xAuthorizationContentSha256Header =
        request.headers[
          HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256
        ];
      if (xAuthorizationContentSha256Header === undefined) {
        let bytes = Buffer.from(request.data, 'utf8');
        let bodyHash = this.getBase64Sha256String(bytes);
        ////console.log(bodyHash);
        request.headers[
          HMACMessageCreator.PARAMETER_X_AUTHORIZATION_CONTENT_SHA256
        ] = bodyHash;
      }
    }

    //create signature
    let messageCreator = new HMACMessageCreator();
    let signableRequestMessage = messageCreator.createSignableRequestMessage1(
      request,
      authHeader
    );
    ////console.log("signableRequestMessage:\n" + signableRequestMessage);
    let signedRequestMessage = '';
    try {
      signedRequestMessage = this.algorithm.encryptMessage(
        this.secretKey,
        signableRequestMessage
      );
      ////console.log("signedRequestMessage:\n" + signedRequestMessage);
    } catch (e) {
      let message = 'Fail to sign request message';
      //console.log(message);
      throw new e(message, e);
    }

    authHeader.signature = signedRequestMessage;
    //add Authorization with encrypted signature
    request.headers[
      HMACMessageCreator.PARAMETER_AUTHORIZATION
    ] = authHeader.toString();

    //request.headers[HMACMessageCreator.PARAMETER_HOST] = request.baseURL;
  }

  getBase64Sha256String(inputStream) {
    return crypto.createHash('sha256').update(inputStream).digest('base64');
  }
  getCurrentUnixTime() {
    return parseInt(new Date().getTime() / 1000);
  }
}
