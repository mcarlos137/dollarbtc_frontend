const PROVIDER = 'acquia-http-hmac';
const DELIMITER_AUTHORIZATION_HEADER = ',';
const GLUE_AUTHORIZATION_HEADER_PAIR = '=';

const DELIMITER_CUSTOM_SUBHEADER = ';';
const GLUE_CUSTOM_SUBHEADER_PAIR = ':';

export default class HMACAuthorizationHeader {
  constructor(realm, id, nonce, version, headers, signature) {
    this.realm = realm;
    this.id = id;
    this.nonce = nonce;
    this.version = version;
    this.headers = headers;
    this.signature = signature;
  }

  static getAuthorizationHeaderObject(authString) {
    let indexSpace = authString.indexOf(' ');
    let authContent = authString.substring(indexSpace + 1);
    let authParams = authContent.split(',');
    let theMap = new Map();
    authParams.forEach((param) => {
      let indexDelimiter = param.indexOf('='); //first index of delimiter
      let key = param.substring(0, indexDelimiter);
      let val = param.substring(indexDelimiter + 1);
      theMap.set(key.toLowerCase(), val.substring(1, val.length - 1)); //remove "" from val
    });

    let result = new HMACAuthorizationHeader(
      theMap.get('realm'),
      theMap.get('id'),
      theMap.get('nonce'),
      theMap.get('version')
    );

    //check headers
    let headers = theMap.get('headers');
    if (headers !== undefined && headers.length() > 0) {
      result.headers = headers.split(DELIMITER_CUSTOM_SUBHEADER);
    }
    //check signature
    let signature = theMap.get('signature');
    if (signature !== undefined && signature.length() > 0) {
      result.signature = signature;
    }
    if (result.isAuthorizationHeaderValid()) {
      return result;
    } else {
      return null;
    }
  }

  isAuthorizationHeaderValid() {
    return (
      this.realm !== undefined &&
      this.realm.length > 0 &&
      this.id !== undefined &&
      this.id.length > 0 &&
      this.nonce !== undefined &&
      this.nonce.length > 0 &&
      this.version !== undefined &&
      this.version.length > 0
    );
  }

  getAuthorizationString() {
    let authBuilder = [];
    authBuilder.push(PROVIDER);
    authBuilder.push(' ');
    authBuilder.push('realm="');
    authBuilder.push(this.realm);
    authBuilder.push('",');
    authBuilder.push('id="');
    authBuilder.push(this.id);
    authBuilder.push('",');
    authBuilder.push('nonce="');
    authBuilder.push(this.nonce);
    authBuilder.push('",');
    authBuilder.push('version="');
    authBuilder.push(this.version);
    authBuilder.push('"');

    if (this.headers != null && this.headers.length > 0) {
      authBuilder.push(',headers="');
      authBuilder.push(
        this.implodeStringArray(this.headers, DELIMITER_CUSTOM_SUBHEADER)
      );
      authBuilder.push('"');
    }

    if (this.signature !== undefined && this.signature.length > 0) {
      authBuilder.push(',signature="');
      authBuilder.push(this.signature);
      authBuilder.push('"');
    }
    if (sessionStorage.getItem('auth') === 'true') {
      if (
        sessionStorage.getItem('s') !== 'null' &&
        sessionStorage.getItem('s') !== null &&
        sessionStorage.getItem('s') !== undefined
      ) {
        let device = sessionStorage.getItem('device');
        authBuilder.push(',deviceid="');
        authBuilder.push(device);
        authBuilder.push('"');
      }
    }
    return authBuilder.join('');
  }

  implodeStringArray(theList, glue) {
    let sBuilder = [];
    let isFirst = true;
    theList.forEach((aString) => {
      if (!isFirst) {
        sBuilder.push(glue);
      }
      sBuilder.push(aString);
      isFirst = false;
    });

    return sBuilder.join('');
  }

  toString() {
    return this.getAuthorizationString();
  }
}
