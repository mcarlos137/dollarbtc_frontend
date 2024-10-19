import crypto from "crypto";
export default class SHAHMACAlgorithm {
  constructor(shaSize) {
    shaSize = parseInt(shaSize);
    try {
      if (
        shaSize !== 1 &&
        shaSize !== 256 &&
        shaSize !== 384 &&
        shaSize !== 512
      )
        throw new Error(
          "Size " +
            shaSize +
            " not supported (only 1, 256, 384 and 512 are supported)"
        );
    } catch (err) {
      //console.log(err);
    }
    this.algorithm = "SHA" + shaSize;
  }

  encryptMessage(secretKey, message) {
    let hash = crypto
      .createHmac(this.algorithm, new Buffer(secretKey, "base64"))
      .update(new Buffer(message, "utf8"), "utf8")
      .digest("base64");
    //  console.log("Result: "+hash);
    return hash;
  }
}
