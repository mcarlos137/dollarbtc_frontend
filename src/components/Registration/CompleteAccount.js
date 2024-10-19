import React, { Component } from "react";
import {
  Button,
  Form,
  Container,
  Header,
  Segment,
  Grid,
  Divider,
  Modal,
  Label,
  Message,
  List,
  Input,
  Icon,
  Responsive,
} from "semantic-ui-react";
import "./Registration.css";
import ReCAPTCHA from "react-google-recaptcha";
import NumberFormat from "react-number-format";
import uuid from "uuid";
import _ from "underscore";
//Services
import { Redirect, Link } from "react-router-dom";
import userService from "../../services/user";
import RetailService from "../../services/moneyclick";
import termsAndConditions from "../../common/termsAndConditions";
import translate from "../../i18n/translate";
import prefits from "../../common/prefits";
const recapcha = React.createRef();
class CompleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      phone: "",
      countryCode: "",
      email: "",
      nickname: "",
      error: false,
      messsage: "",
      colorMessage: "",
      load: false,
      translator: props.translate,
      conditions: "false",
      termsAndConditions: termsAndConditions,
      viewCompleteAccount: false,
      hidden: true,
      errorCredentials: false,
      prefit: prefits.country,
      viewModalSuccess: false,
      company: false,
      hasNickname: false,
      captcha: "",
      hasEmail: false,
      searchQuery: null,
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  handleRegistryCompany() {
    this.setState({ company: !this.state.company });
  }
  handleConditions(e) {
    if (this.state.conditions === "false") {
      this.setState({ conditions: "true" });
    } else {
      this.setState({ conditions: "false" });
    }

    this.onClickCloseModalTermsAndConditions();
  }
  onClickCloseModalTermsAndConditions() {
    this.setState({
      seeTermsAndConditions: false,
    });
  }
  onClickTermsAndConditions() {
    this.setState({
      seeTermsAndConditions: true,
    });
  }
  async completeAccount(username, email, nickname) {
    this.setState({ load: true });
    var body = {
      email: email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      countryCode: this.state.countryCode,
      phone: this.state.phone,
      has2FAEnabled: false, //this.state.twoFactor
    };
    userService
      .updateProfile(body, username)
      .then(async (response) => {
        this.setState({ load: false });
        if (response.data.payload === true) {
          let verificationStatus = {
            A: this.state.userStatusA,
            B: this.state.userStatusB,
            C: this.state.userStatusC,
          };
          window.sessionStorage.setItem(
            "userVerificationStatus",
            JSON.stringify(verificationStatus)
          );
          window.sessionStorage.setItem(
            "userDataDBTC",
            JSON.stringify(this.state.userData)
          );
          window.sessionStorage.setItem("nickname", this.state.nickname);
          window.sessionStorage.setItem("address", this.state.address);
          window.sessionStorage.setItem("userType", this.state.userType);
          window.sessionStorage.setItem(
            "userWallets",
            JSON.stringify(this.state.userWallets)
          );
          if (this.state.retailIds !== undefined) {
            window.sessionStorage.setItem(
              "retail",
              JSON.stringify(this.state.retailIds)
            );
          }

          if (this.state.hasEmail === true) {
            await this.updateDataExistInUser(
              username,
              "email",
              this.state.email
            );
          } else {
            await this.updateDataInUser(username, "email", this.state.email);
          }

          window.sessionStorage.setItem("email", this.state.email);
          this.setState({ viewModalSuccess: true });
        } else if (response.data.error[0].code === 48) {
          this.setState({
            errorForm: true,
            message: "registration.errors.form.username",
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: "",
            });
          }, 6000);
        } else if (response.data.error[0].code === 65) {
          this.setState({
            errorForm: true,
            message: "registration.errors.form.alreadyEmail",
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: "",
            });
          }, 6000);
        }
      })
      .catch((errro) => {
        this.setState({ load: false });
        this.setState({
          errorForm: true,
          message: "registration.errors.unexpectedError",
        });
        setTimeout(() => {
          this.setState({
            errorForm: false,
            message: "",
          });
        }, 6000);
      });
  }
  async updateDataInUser(user, field, value) {
    let body = {
      userName: user,
      fieldName: field,
      fieldValue: value,
    };
    try {
      let response = await userService.addDataUserAsync(body);
      if (response.data !== "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  async updateDataExistInUser(user, field, value) {
    let body = {
      userName: user,
      fieldName: field,
      fieldValue: value,
    };
    try {
      let response = await userService.updateUserData(body);

      if (response.data !== "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  handleRegistrer() {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.state.email !== "") {
      if (regex.test(this.state.email)) {
        //	if (this.state.nickname !== "") {
        this.completeAccount(
          this.state.username,
          this.state.email,
          this.state.nickname
        );
      } else {
        this.setState({
          errorEmail: true,
          message: "registration.errors.form.email",
        });
        setTimeout(() => {
          this.setState({
            errorEmail: false,
            message: "",
          });
        }, 6000);
      }
    } else {
      this.setState({
        errorEmail: true,
        message: "registration.errors.form.email",
      });
      setTimeout(() => {
        this.setState({
          errorEmail: false,
          message: "",
        });
      }, 6000);
    }
  }
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  handlePassword(e) {
    this.setState({ password: e.target.value });
  }
  handleCaptcha(params) {
    this.setState({
      captcha: params,
    });
  }
  handlePrefit(e, data) {
    this.setState({ countryCode: data.value });
  }
  getBalanceMoneyClick() {
    RetailService.getBalanceMoneyclick(this.state.username)
      .then((resp) => {
        window.sessionStorage.setItem(
          "balanceMoneyClick",
          JSON.stringify(resp.data)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getActualUserInfo = (allInfo) => {
    var listKeys = Object.keys(allInfo);
    var listActualKeys = [];
    var actualfirstNameKey;
    var actualLastnameKey;
    var actualPhoneKey;
    var actualQuestionSecurityKey;
    var actualAnswerSecurityKey;
    var actualTypeDocumentIdentityKey;
    var actualNumberDocumentIdentityKey;
    var actualGenderKey;
    var actualBirthdateKey;
    var actualBirthplaceKey;
    var actualFamilyNameKey;
    var actualFamilyEmailKey;
    var actualUserLocalBitcoinKey;
    var actualUserFacebookKey;
    var actualUserAddressKey;
    var acutualNickName;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i].startsWith("firstName")) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith("lastName")) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith("phone")) {
        actualPhoneKey = listKeys[i];
      } else if (listKeys[i].startsWith("questionSecurity")) {
        actualQuestionSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith("answerSecurity")) {
        actualAnswerSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith("typeDocumentIdentity")) {
        actualTypeDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith("numberDocumentIdentity")) {
        actualNumberDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith("gender")) {
        actualGenderKey = listKeys[i];
      } else if (listKeys[i].startsWith("birthdate")) {
        actualBirthdateKey = listKeys[i];
      } else if (listKeys[i].startsWith("birthplace")) {
        actualBirthplaceKey = listKeys[i];
      } else if (listKeys[i].startsWith("familyName")) {
        actualFamilyNameKey = listKeys[i];
      } else if (listKeys[i].startsWith("familyEmail")) {
        actualFamilyEmailKey = listKeys[i];
      } else if (listKeys[i].startsWith("userLocalBitcoin")) {
        actualUserLocalBitcoinKey = listKeys[i];
      } else if (listKeys[i].startsWith("userFacebook")) {
        actualUserFacebookKey = listKeys[i];
      } else if (listKeys[i].startsWith("userDirection")) {
        actualUserAddressKey = listKeys[i];
      } else if (listKeys[i].startsWith("nickname")) {
        acutualNickName = listKeys[i];
      }
    }
    listActualKeys.push(
      actualfirstNameKey,
      actualLastnameKey,
      actualPhoneKey,
      actualQuestionSecurityKey,
      actualAnswerSecurityKey,
      actualTypeDocumentIdentityKey,
      actualNumberDocumentIdentityKey,
      actualGenderKey,
      actualBirthdateKey,
      actualBirthplaceKey,
      actualFamilyNameKey,
      actualFamilyEmailKey,
      actualUserLocalBitcoinKey,
      actualUserFacebookKey,
      actualUserAddressKey,
      acutualNickName,
      "address",
      "operationAccount",
      "environment",
      "type",
      "active",
      "email",
      "wallets",
      "devices"
    );
    var modifiedObj = _.pick(allInfo, [listActualKeys]);
    var normalizeObject = {};
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith("firstName")) {
        normalizeObject.firstName = value;
      } else if (key.startsWith("lastName")) {
        normalizeObject.lastName = value;
      } else if (key.startsWith("email")) {
        normalizeObject.email = value;
      } else if (key.startsWith("active")) {
        normalizeObject.active = value;
      } else if (key === "type") {
        normalizeObject.type = value;
      } else if (key.startsWith("environment")) {
        normalizeObject.environment = value;
      } else if (key.startsWith("operationAccount")) {
        normalizeObject.operationAccount = value;
      } else if (key.startsWith("address")) {
        normalizeObject.address = value;
      } else if (key.startsWith("questionSecurity")) {
        normalizeObject.questionSecurity = value;
      } else if (key.startsWith("answerSecurity")) {
        normalizeObject.answerSecurity = value;
      } else if (key.startsWith("typeDocumentIdentity")) {
        normalizeObject.typeDocumentIdentity = value;
      } else if (key.startsWith("numberDocumentIdentity")) {
        normalizeObject.numberDocumentIdentity = value;
      } else if (key.startsWith("gender")) {
        normalizeObject.gender = value;
      } else if (key.startsWith("birthdate")) {
        normalizeObject.birthdate = value;
      } else if (key.startsWith("birthplace")) {
        normalizeObject.birthplace = value;
      } else if (key.startsWith("familyName")) {
        normalizeObject.familyName = value;
      } else if (key.startsWith("familyEmail")) {
        normalizeObject.familyEmail = value;
      } else if (key.startsWith("userLocalBitcoin")) {
        normalizeObject.userLocalBitcoin = value;
      } else if (key.startsWith("userFacebook")) {
        normalizeObject.userFacebook = value;
      } else if (key.startsWith("userDirection")) {
        normalizeObject.userDirection = value;
      } else if (key.startsWith("phone")) {
        normalizeObject.phone = value;
      } else if (key.startsWith("nickname")) {
        normalizeObject.nickname = value;
      } else if (key.startsWith("wallets")) {
        normalizeObject.wallets = value;
      } else if (key.startsWith("devices")) {
        normalizeObject.devices = value;
      }
    });
    return normalizeObject;
  };
  login() {
    if (
      this.state.countryCode !== "" &&
      this.state.phone !== "" &&
      this.state.password !== "" &&
      this.state.captcha !== ""
    ) {
      this.setState(
        { username: this.state.countryCode + this.state.phone },
        () => {
          this.getBalanceMoneyClick();
        }
      );
      let user = this.state.countryCode + this.state.phone;
      userService
        .getConfigUserGeneral(user)

        .then((res) => {
          this.setState({ dataFullUser: res.data.result });
          if (res.data.result.email !== undefined) {
            if (res.data.result.email !== "") {
              this.setState({ hasEmail: true });
            } else {
              this.setState({ hasEmail: false });
            }
          } else {
            this.setState({ hasEmail: false });
          }
          if (res.data.result.nickname !== undefined) {
            this.setState({
              hasNickname: true,
              nickname: res.data.result.nickname,
            });
          }

          if (
            res.data.result.type === "NORMAL" ||
            res.data.result.type === "BROKER"
          ) {
            userService.getBalanceUser(user);

            let dataUser = this.getActualUserInfo(res.data.result);
            let userData = this.getActualUserInfo(res.data.result);
            this.setState({
              firstName:
                dataUser.firstName !== undefined ? dataUser.firstName : "",
              lastName:
                dataUser.lastName !== undefined ? dataUser.lastName : "",
            });
            sessionStorage.setItem(
              "nickname",
              userData.nickname !== undefined ? userData.nickname : ""
            );

            this.authUserLogin(user, this.state.password, dataUser.wallets);
            if (res.data.result.retailIds !== undefined) {
              let retails = res.data.result.retailIds;
              this.setState({
                retailIds: retails,
              });
            }

            dataUser = {
              userDirection:
                dataUser.userDirection !== undefined
                  ? dataUser.userDirection
                  : "",
              userLocalBitcoin:
                dataUser.userLocalBitcoin !== undefined
                  ? dataUser.userLocalBitcoin
                  : "",
              userFacebook:
                dataUser.userFacebook !== undefined
                  ? dataUser.userFacebook
                  : "",
            };
            //this.updateWalletCreationDate(dataendUser.wallets);
            this.setState({
              userType: res.data.result.type,
              userData: dataUser,
            });
            if (res.data.result.verification === undefined) {
              this.setState({
                userStatusC: "UNINITIATED",
                userStatusA: false,
                userStatusB: false,
              });
            } else {
              if (res.data.result.verification.C === undefined) {
                this.setState({ userStatusC: "UNINITIATED" });
              } else {
                this.setState({
                  userStatusC:
                    res.data.result.verification.C.userVerificationStatus,
                });
              }
              if (res.data.result.verification.A === undefined) {
                this.setState({
                  userStatusA: false,
                });
              } else {
                this.setState({
                  userStatusA: true,
                });
              }
              if (res.data.result.verification.B === undefined) {
                this.setState({
                  userStatusB: false,
                });
              } else {
                this.setState({
                  userStatusB: true,
                });
              }
            }
            if (res.data.result.wallets !== undefined) {
              if (res.data.result.wallets.current !== undefined) {
                let current = Object.values(res.data.result.wallets.current)[0]
                  .address;
                this.setState({
                  address: current,
                  userWallets: res.data.result.wallets,
                });
              } else this.setState({ userWallets: res.data.result.wallets });
            } else {
              userService.generateKeyService(user, this.state.password);
            }
            //=======================================================================================================
          } else if (res.data.result.type === "ADMIN") {
            let dataUser = this.getActualUserInfo(res.data.result);
            this.authUserLogin(user, this.state.password, dataUser.wallets);
            this.setState({ load: true });
            this.setState({ userType: res.data.result.type });
            dataUser = {
              userDirection:
                dataUser.userDirection !== undefined
                  ? dataUser.userDirection
                  : "",
              userLocalBitcoin:
                dataUser.userLocalBitcoin !== undefined
                  ? dataUser.userLocalBitcoin
                  : "",
              userFacebook:
                dataUser.userFacebook !== undefined
                  ? dataUser.userFacebook
                  : "",
            };

            this.setState({
              userType: res.data.result.type,
              userData: dataUser,
            });
            if (res.data.result.verification === undefined) {
              this.setState({
                userStatusC: "UNINITIATED",
                userStatusA: false,
                userStatusB: false,
              });
            } else {
              if (res.data.result.verification.C === undefined) {
                this.setState({ userStatusC: "UNINITIATED" });
              } else {
                this.setState({
                  userStatusC:
                    res.data.result.verification.C.userVerificationStatus,
                });
              }
              if (res.data.result.verification.A === undefined) {
                this.setState({
                  userStatusA: false,
                });
              } else {
                this.setState({
                  userStatusA: true,
                });
              }
              if (res.data.result.verification.B === undefined) {
                this.setState({
                  userStatusB: false,
                });
              } else {
                this.setState({
                  userStatusB: true,
                });
              }
            }
          } else {
            this.setState({
              errorLog: true,
              message: "login.errors.errorProTrader",
            });
            if (recapcha.current !== null) {
              recapcha.current.reset("capt");
            }
          }
        })
        .catch((error) => {
          this.setState({
            errorCaptcha: true,
            message: "login.errors.errorCaptcha",
            user: "",
            password: "",
          });
          if (recapcha.current !== null) {
            recapcha.current.reset("capt");
          }
          setTimeout(() => {
            this.setState({ errorCaptcha: false, message: "" });
          }, 6000);
          console.log(error);
        });
    } else {
      this.setState({
        errorForm: true,
        message: "login.errors.completeFields",
      });
      setTimeout(() => {
        this.setState({ errorForm: false, message: "" });
      }, 6000);
    }
  }
  handleModalClose() {
    this.setState({ viewModalSuccess: false }, () => {
      window.sessionStorage.setItem("timeLogin", new Date());
      this.setState({ auth: true });
      sessionStorage.setItem("auth", true);
      window.location.href = "/";
    });
  }
  authUserLogin(username, password, walletsDLBT) {
    this.setState({ load: true });
    userService
      .authUser(username, password)
      .then((res) => {
        if (!res.data.errors || res.data.errors.length === 0) {
          this.setLoginFull(res, password, walletsDLBT);
          if (
            res.data.user.email === null ||
            res.data.user.email === "null" ||
            res.data.user.email === ""
          ) {
            this.setState({
              load: false,
              viewCompleteAccount: true,
            });
          } else {
            // this.setState({
            //   load: false,
            //   viewCompleteAccount: true,
            // });
            sessionStorage.setItem(
              "lastSession",
              new Date().getTime().toString()
            );
            window.sessionStorage.setItem("timeLogin", new Date());
            window.sessionStorage.setItem("auth", true);
            window.location.href = "/";
          }
        } else if (
          res.data.errors[0].code === 28 ||
          res.data.errors[0].code === 29
        ) {
          this.setLoginNotVerifiedEmail(
            res.data.user,
            username,
            password,
            walletsDLBT
          );
          if (
            res.data.user.email === null ||
            res.data.user.email === "null" ||
            res.data.user.email === ""
          ) {
            this.setState({
              load: false,
              viewCompleteAccount: true,
            });
          } else {
            // this.setState({
            //   load: false,
            //   viewCompleteAccount: true,
            // });
            sessionStorage.setItem(
              "lastSession",
              new Date().getTime().toString()
            );
            window.sessionStorage.setItem("timeLogin", new Date());
            window.sessionStorage.setItem("auth", true);
            window.location.href = "/";
          }
        } else if (res.data.errors[0].code === 71) {
          this.setState({
            viewmesageErrorSession: true,
            message: "login.errors.credentials.previusSession",
            load: false,
          });
          setTimeout(() => {
            this.setState({
              viewmesageErrorSession: false,
            });
          }, 12000);
          window.sessionStorage.removeItem("userBalanceBTC");
        } else {
          this.setState({
            errorCredentials: true,
            message: "error.credentials.header",
            load: false,
          });
          setTimeout(() => {
            this.setState({
              errorCredentials: false,
            });
          }, 7000);
          window.sessionStorage.removeItem("userBalanceBTC");
        }
        if (recapcha.current !== null) {
          recapcha.current.reset("capt");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorCaptcha: true,
          message: "login.errors.errorCaptcha",
          user: "",
          password: "",
          load: false,
        });
        if (recapcha.current !== null) {
          recapcha.current.reset("capt");
        }
        setTimeout(() => {
          this.setState({
            errorCaptcha: false,
            message: "",
          });
        }, 7000);
      });
  }
  updateWalletCreationDate(wallets) {
    let promisesArray = wallets.map((wallet) => {
      userService.updateWalletCreation(
        userService.getUserName(),
        wallet.address
      );
    });
    Promise.all(promisesArray)
      .then((result) => {
        //console.log(result);
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  setLoginFull(res, password, walletsDLBT) {
    var websocketKey = uuid.v4();
    window.sessionStorage.setItem(
      "firstName",
      res.data.user.firstName !== null ? res.data.user.firstName : ""
    );
    window.sessionStorage.setItem(
      "lastName",
      res.data.user.lastName !== null ? res.data.user.lastName : ""
    );
    window.sessionStorage.setItem(
      "phone",
      res.data.user.phone !== null ? res.data.user.phone : ""
    );
    window.sessionStorage.setItem(
      "countryCode",
      res.data.user.countryCode !== null ? res.data.user.countryCode : ""
    );
    window.sessionStorage.setItem("twoFactor", res.data.user.has2FAEnabled);
    window.sessionStorage.setItem("phoneVerified", res.data.user.phoneVerified);
    window.sessionStorage.setItem("username", res.data.user.username);
    window.sessionStorage.setItem("email", res.data.user.email);
    let hashCredencial = btoa(password + ":" + res.data.user.username);
    window.sessionStorage.setItem("header", hashCredencial);
    window.sessionStorage.setItem("verify", true);
    window.sessionStorage.setItem(
      "devices",
      JSON.stringify(res.data.user.devices)
    );
    let walletsBushido = res.data.user.wallets;
    let walletsToUpdate = [];
    if (walletsDLBT !== undefined) {
      let currentAddress = Object.values(walletsDLBT.current)[0].address;
      walletsToUpdate = walletsBushido.filter((wallet) => {
        if (
          wallet.creationDate === undefined ||
          wallet.creationDate === null ||
          wallet.creationDate === 0
        )
          if (wallet.address === currentAddress) return wallet;
      });
      if (walletsToUpdate.length > 0)
        this.updateWalletCreationDate(walletsToUpdate);
    }
    window.sessionStorage.setItem(
      "wallets",
      JSON.stringify(
        walletsToUpdate.length > 0 ? walletsToUpdate : walletsBushido
      )
    );
    let usernoAdmin = {
      id: "",
      name: "",
      functionsAvailables: ["not"],
    };
    sessionStorage.setItem(
      "r",
      res.data.user.rol !== null
        ? JSON.stringify(res.data.user.rol)
        : JSON.stringify(usernoAdmin)
    );
    window.sessionStorage.setItem("websocketKey", websocketKey);
    userService.updateLastConexion(res.data.user.username);

    if (
      this.state.dataFullUser.firstName === undefined &&
      res.data.user.firstName !== null
    ) {
      this.updateDataInUser(
        res.data.user.username,
        "firstName",
        res.data.user.firstName
      );
    } else {
      this.updateDataExistInUser(
        res.data.user.username,
        "firstName",
        res.data.user.firstName
      );
    }
    if (
      this.state.dataFullUser.lastName === undefined &&
      res.data.user.lastName !== null
    ) {
      this.updateDataInUser(
        res.data.user.username,
        "lastName",
        res.data.user.lastName
      );
    } else {
      this.updateDataExistInUser(
        res.data.user.username,
        "lastName",
        res.data.user.lastName
      );
    }
    if (
      this.state.dataFullUser.phone === undefined &&
      res.data.user.countryCode !== null &&
      res.data.user.phone !== null
    ) {
      this.updateDataInUser(
        res.data.user.username,
        "phone",
        res.data.user.countryCode + res.data.user.phone
      );
    } else {
      this.updateDataExistInUser(
        res.data.user.username,
        "phone",
        res.data.user.countryCode + res.data.user.phone
      );
    }
  }
  setLoginNotVerifiedEmail(res, username, password, walletsDLBT) {
    var websocketKey = uuid.v4();
    window.sessionStorage.setItem("firstName", res.firstName);
    window.sessionStorage.setItem(
      "lastName",
      res.lastName !== null ? res.lastName : ""
    );
    window.sessionStorage.setItem("phone", res.phone !== null ? res.phone : "");
    window.sessionStorage.setItem(
      "countryCode",
      res.countryCode !== null ? res.countryCode : ""
    );
    window.sessionStorage.setItem("twoFactor", res.has2FAEnabled);
    window.sessionStorage.setItem("phoneVerified", res.phoneVerified);
    window.sessionStorage.setItem("username", username);
    window.sessionStorage.setItem("email", res.email);
    window.sessionStorage.setItem("websocketKey", websocketKey);
    let hashCredencial = btoa(password + ":" + username);
    window.sessionStorage.setItem("header", hashCredencial);
    window.sessionStorage.setItem("verify", false);
    window.sessionStorage.setItem("devices", JSON.stringify(res.devices));
    let walletsBushido = res.wallets;
    let walletsToUpdate = [];
    if (walletsDLBT !== undefined) {
      let currentAddress = Object.values(walletsDLBT.current).map((w) => {
        return w.address;
      })[0];
      walletsToUpdate = walletsBushido.filter((wallet) => {
        if (
          wallet.creationDate === undefined ||
          wallet.creationDate === null ||
          wallet.creationDate === 0
        )
          if (wallet.address === currentAddress) return wallet;
      });
      if (walletsToUpdate.length > 0)
        this.updateWalletCreationDate(walletsToUpdate);
    }
    window.sessionStorage.setItem(
      "wallets",
      JSON.stringify(
        walletsToUpdate.length > 0 ? walletsToUpdate : walletsBushido
      )
    );
    let usernoAdmin = {
      id: "",
      name: "",
      functionsAvailables: ["not"],
    };
    sessionStorage.setItem(
      "r",
      res.rol !== null ? JSON.stringify(res.rol) : JSON.stringify(usernoAdmin)
    );

    if (res.firstName !== null) {
      if (this.state.dataFullUser.firstName === undefined) {
        this.updateDataInUser(username, "firstName", res.firstName);
      } else {
        this.updateDataExistInUser(username, "firstName", res.firstName);
      }
    }
    if (res.lastName !== null) {
      if (this.state.dataFullUser.lastName === undefined) {
        this.updateDataInUser(username, "lastName", res.lastName);
      } else {
        this.updateDataExistInUser(username, "lastName", res.lastName);
      }
    }
    if (res.countryCode !== null && res.phone !== null) {
      if (this.state.dataFullUser.phone === undefined) {
        this.updateDataInUser(username, "phone", res.countryCode + res.phone);
      } else {
        this.updateDataExistInUser(
          username,
          "phone",
          res.countryCode + res.phone
        );
      }
    }
  }
  handleItemOther(e, data) {
    this.props.setView(data.name);
  }
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  render() {
    let t = this.state.translator;
    let errorEmail,
      errornickname,
      errorForm,
      labelUser,
      labelPassword,
      labelCaptcha,
      message;
    if (this.state.errorEmail) {
      errorEmail = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    let resultPostMessage = (
      <div>
        {t("registration.modalResult.resultPost.headerComplete")}
        <List bulleted>
          <List.Item>
            {t("registration.modalResult.resultPost.items.line1")}
          </List.Item>
          <List.Item>
            {t("registration.modalResult.resultPost.items.line2")}
          </List.Item>
          <List.Item>
            {t("registration.modalResult.resultPost.items.line3")}
          </List.Item>
          <List.Item>
            {t("registration.modalResult.resultPost.items.line4")}
          </List.Item>
          <List.Item>
            {t("registration.modalResult.resultPost.items.line5")}
          </List.Item>
        </List>
        <Message
          warning
          content={t("registration.modalResult.resultPost.warningMessage")}
        />
        <Message
          info
          content={t("registration.modalResult.resultPost.infoMessage")}
        />
      </div>
    );
    if (this.state.errorCredentials) {
      message = (
        <Message
          error
          header={t("login.errors.credentials.header")}
          content={t("login.errors.credentials.content")}
        />
      );
      // this.blankErrors("error");
    }
    if (this.state.viewmesageErrorSession) {
      message = <Message error content={t(this.state.message)} />;
    }
    if (this.state.errorNickName) {
      errornickname = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorForm) {
      errorForm = <Message error content={t(this.state.message)} />;
    }
    if (this.state.errorUser) {
      labelUser = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorPassword) {
      labelPassword = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorCaptcha) {
      labelCaptcha = (
        <div>
          <Message error header="Error" content={t(this.state.message)} />
          <Divider hidden />
        </div>
      );
    }
    if (this.state.errorLog) {
      labelCaptcha = (
        <div>
          <Message info>
            <Message.Content>
              {t(this.state.message)}
              <br />
              <a href="https://clients.dollarbtc.com">
                https://clients.dollarbtc.com
              </a>
            </Message.Content>
          </Message>
          <Divider hidden />
        </div>
      );
    }
    let list2 = this.state.prefit.map((element, i) => (
      <option value={element.value} key={i}>
        {element.text}
      </option>
    ));
    let list = [];
    if (this.state.prefit.length > 0) {
      for (let pre of this.state.prefit) {
        if (pre.value !== "") {
          list.push({ text: pre.nombre, value: pre.value, key: pre.iso2 });
        }
      }
    }
    if (this.state.viewCompleteAccount === false) {
      return (
        <div>
          <Responsive minWidth={992}>
            <Grid columns="equal">
              <Grid.Column />
              <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                <Container>
                  <Segment color="orange" textAlign="left">
                    <div />
                    <Header
                      as="h4"
                      className="titleComponent"
                      textAlign="center"
                    >
                      {t("login.compleAccount")}
                    </Header>
                    <Container className="container-form">
                      <Form
                        onSubmit={this.login.bind(this)}
                        loading={this.state.load}
                        error
                        unstackable
                      >
                        <Form.Group>
                          <Form.Field width={6}>
                            <Form.Select
                              label={t(
                                "profile.updateProfile.form.placeholderCountry"
                              )}
                              required
                              selection
                              search={true}
                              options={list}
                              value={this.state.countryCode}
                              placeholder={t(
                                "profile.updateProfile.form.placeholderCountry"
                              )}
                              onChange={this.handlePrefit.bind(this)}
                              onSearchChange={this.handleSearchChange.bind(
                                this
                              )}
                            />
                          </Form.Field>
                          <Form.Field width={1}></Form.Field>
                          <Form.Field required width={9}>
                            <label>
                              {t(
                                "buy.formVerificationPhone.formRequestCode.phone"
                              )}
                            </label>
                            {/* <NumberFormat
															type='tel'
															value={this.state.phone}
															allowNegative={false}
															thousandSeparator={false}
															placeholder={"12345678"}
															onValueChange={(values) => {
																const { value } = values;
																this.setState({ phone: value });
															}}
														/> */}
                            <Form.Input
                              placeholder="12345678"
                              onChange={(e) => {
                                const telNo = e.target.value;
                                const re2 = /^[0-9]*$/;
                                if (telNo === "" || re2.test(telNo)) {
                                  this.setState({ phone: e.target.value });
                                }
                              }}
                              value={this.state.phone}
                              type="text"
                            />

                            {labelUser}
                          </Form.Field>
                        </Form.Group>
                        <Form.Field required>
                          <label>{t("login.form.password")}</label>
                          <Input
                            icon={
                              this.state.hidden ? (
                                <Icon
                                  name="eye"
                                  circular
                                  link
                                  onClick={this.toggleShow.bind(this)}
                                />
                              ) : (
                                <Icon
                                  name="eye slash"
                                  circular
                                  link
                                  onClick={this.toggleShow.bind(this)}
                                />
                              )
                            }
                            type={this.state.hidden ? "password" : "text"}
                            value={this.state.password}
                            onChange={this.handlePassword.bind(this)}
                          />
                          {labelPassword}
                          {errorForm}
                        </Form.Field>
                        <Segment
                          basic
                          textAlign="center"
                          verticalAlign="middle"
                          style={{ textAlign: "-webkit-center" }}
                        >
                          <p>{t("login.form.captcha")}</p>
                          <Grid>
                            <Grid.Row columns={1} centered>
                              <Grid.Column
                                textAlign="center"
                                verticalAlign="middle"
                                width={window.innerWidth <= 394 ? 5 : 0}
                              >
                                <ReCAPTCHA
                                  id="reca"
                                  ref={recapcha}
                                  //badge="inline"
                                  size={
                                    window.innerWidth < 394
                                      ? "compact"
                                      : "normal"
                                  }
                                  style={{
                                    marginLeft:
                                      window.innerWidth < 394 ? 0 : 70,
                                  }}
                                  sitekey="6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c"
                                  onChange={this.handleCaptcha.bind(this)}
                                />
                              </Grid.Column>
                              <Grid.Column />
                            </Grid.Row>
                          </Grid>
                          <Segment
                            basic
                            style={{ textAlign: "-webkit-center" }}
                          >
                            {message}
                            {labelCaptcha}
                            <Form.Button
                              type="submit"
                              color="blue"
                              size="large"
                            >
                              {t("login.form.continue")}
                            </Form.Button>
                          </Segment>
                        </Segment>
                        {/* <div className="text-center">
                          <Button
                            basic
                            onClick={this.handleForgotPassword.bind(this)}
                          >
                            <span style={{ fontSize: "11px" }}>
                              {t("login.form.forgotPassword")}
                            </span>
                          </Button>
                        </div> */}
                        <div className="text-center">
                          <Link
                            to="/login"
                            name="login"
                            onClick={this.handleItemOther.bind(this)}
                          >
                            {t("registration.cancelAccount")}
                          </Link>
                        </div>
                      </Form>
                    </Container>
                  </Segment>
                </Container>
              </Grid.Column>
              <Grid.Column />
            </Grid>
          </Responsive>
          <Responsive minWidth={0} maxWidth={991}>
            <Grid columns="equal">
              <Grid.Column />
              <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                <Container>
                  {/* <Segment  textAlign="left"> */}
                  <div />
                  <Header as="h4" className="titleComponent" textAlign="center">
                    {t("login.compleAccount")}
                  </Header>
                  <hr style={{ borderColor: "#207ef2" }}></hr>
                  <Divider hidden></Divider>
                  <Container className="container-form">
                    <Form
                      onSubmit={this.login.bind(this)}
                      loading={this.state.load}
                      error
                      unstackable
                    >
                      <Form.Field required>
                        <label
                          className="titleComponentMobile"
                          style={{ textAlign: "left" }}
                        >
                          {t(
                            "buy.formVerificationPhone.formRequestCode.countryCode"
                          )}
                        </label>
                        <Form.Select
                          selection
                          search={true}
                          options={list}
                          value={this.state.countryCode}
                          placeholder={t(
                            "profile.updateProfile.form.placeholderCountry"
                          )}
                          onChange={this.handlePrefit.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationPhone.formRequestCode.phone")}
                        </label>
                        {/* <NumberFormat
													value={this.state.phone}
													allowNegative={false}
													thousandSeparator={false}
													placeholder={"12345678"}
													onValueChange={(values) => {
														const { value } = values;
														this.setState({ phone: value });
													}}
												/> */}
                        <Form.Input
                          placeholder="12345678"
                          onChange={(e) => {
                            const telNo = e.target.value;
                            const re2 = /^[0-9]*$/;
                            if (telNo === "" || re2.test(telNo)) {
                              this.setState({ phone: e.target.value });
                            }
                          }}
                          value={this.state.phone}
                          type="text"
                        />
                        {labelUser}
                      </Form.Field>
                      <Form.Field required>
                        <label className="titleComponentMobile">
                          {t("login.form.password")}
                        </label>
                        <Input
                          icon={
                            this.state.hidden ? (
                              <Icon
                                name="eye"
                                circular
                                link
                                onClick={this.toggleShow.bind(this)}
                              />
                            ) : (
                              <Icon
                                name="eye slash"
                                circular
                                link
                                onClick={this.toggleShow.bind(this)}
                              />
                            )
                          }
                          type={this.state.hidden ? "password" : "text"}
                          value={this.state.password}
                          onChange={this.handlePassword.bind(this)}
                        />
                        {labelPassword}
                      </Form.Field>
                      <Segment
                        basic
                        textAlign="center"
                        verticalAlign="middle"
                        style={{ textAlign: "-webkit-center" }}
                      >
                        <p className="titleComponentMobile">
                          {t("login.form.captcha")}
                        </p>
                        <Grid>
                          <Grid.Row columns={1} centered>
                            <Grid.Column
                              textAlign="center"
                              verticalAlign="middle"
                              width={window.innerWidth <= 394 ? 5 : 0}
                            >
                              <ReCAPTCHA
                                id="reca"
                                ref={recapcha}
                                //badge="inline"
                                size={
                                  window.innerWidth < 394 ? "compact" : "normal"
                                }
                                style={{
                                  marginLeft: window.innerWidth < 394 ? 0 : 70,
                                }}
                                sitekey="6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c"
                                onChange={this.handleCaptcha.bind(this)}
                              />
                            </Grid.Column>
                            <Grid.Column />
                          </Grid.Row>
                        </Grid>

                        {message}
                        {labelCaptcha}
                      </Segment>
                      <div className="text-center">
                        <Form.Button
                          type="submit"
                          color="blue"
                          size="large"
                          style={{
                            borderRadius: "40px/40px",
                            height: "50px",
                            width: "200px",
                          }}
                        >
                          {t("registration.continue")}
                        </Form.Button>
                      </div>
                      <Divider hidden></Divider>
                      <div className="text-center">
                        {/* <Button
                          onClick={this.handleForgotPassword.bind(this)}
                          style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}
                        >
                          <span style={{ fontSize: "11px" }}>
                            {t("login.form.forgotPassword")}
                          </span>
                        </Button> */}
                        {/* <Button
                            basic
                            // color="blue"
                            onClick={this.handleForgotPassword.bind(this)}
                            style={{
                              borderRadius: "40px/40px",
                              height: "50px",
                              width: "200px"
                            }}
                          >
                            <span style={{ fontSize: "11px" }}>
                              {t("login.form.forgotPassword")}
                            </span>
                          </Button> */}
                        <Link
                          to="/login"
                          name="login"
                          onClick={this.handleItemOther.bind(this)}
                        >
                          {t("registration.cancelAccount")}
                        </Link>
                      </div>
                    </Form>
                  </Container>
                  {/* </Segment> */}
                </Container>
              </Grid.Column>
              <Grid.Column />
            </Grid>
          </Responsive>
        </div>
      );
    }
    return (
      <div>
        <Responsive minWidth={992}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                <Segment color="orange" textAlign="left">
                  <div />
                  <Header as="h4" className="titleComponent" textAlign="center">
                    {t("login.compleAccount2")}
                  </Header>
                  <Container className="container-form">
                    <Form
                      error
                      unstackable
                      loading={this.state.load}
                      onSubmit={this.handleRegistrer.bind(this)}
                    >
                      <Form.Field>
                        <Form.Input
                          type="email"
                          label={t("registration.form.email")}
                          value={this.state.email}
                          onChange={(e, data) =>
                            this.setState({ email: e.target.value })
                          }
                          required
                        />
                        {errorEmail}
                      </Form.Field>
                      {/* <Form.Field>
												<Form.Input
													type='text'
													label={t("registration.form.username")}
													value={this.state.nickname}
													onChange={(e, data) =>
														this.setState({ nickname: e.target.value })
													}
													required
												/>
												{errornickname}
											</Form.Field> */}
                      {/* <Grid>
                        <Grid.Row>
                          {/* <Grid.Column /> 
                          <Grid.Column textAlign="center">
                            <Form.Field>
                              <Form.Checkbox
                                label={t("registration.form.companyText")}
                                onChange={this.handleRegistryCompany.bind(this)}
                                checked={this.state.company}
                              />
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid> */}
                      <Header as="h5">
                        {/* {window.innerWidth > 429 && (
                          <Grid>
                            <Grid.Column style={{ marginLeft: "100px" }}>
                              <Form.Group inline>
                                <Form.Checkbox
                                  onChange={this.handleConditions.bind(this)}
                                  checked={this.state.conditions === "true"}
                                />
                                <Form.Field>
                                  <label>
                                    {t("registration.form.terms.first")}
                                    <a
                                      href="#"
                                      onClick={this.onClickTermsAndConditions.bind(
                                        this
                                      )}
                                    >
                                      {t("registration.form.terms.second")}
                                    </a>
                                  </label>
                                </Form.Field>
                              </Form.Group>
                            </Grid.Column>
                          </Grid>
                        )} */}

                        {/* {window.innerWidth <= 429 && (
                          <Grid>
                            <Grid.Row>
                              <Grid.Column textAlign="center">
                                <Form.Group>
                                  <Form.Field>
                                    <Form.Checkbox
                                      onChange={this.handleConditions.bind(
                                        this
                                      )}
                                      checked={this.state.conditions === "true"}
                                    />
                                    <label>
                                      {t("registration.form.terms.first")}
                                      <a
                                        href="#"
                                        onClick={this.onClickTermsAndConditions.bind(
                                          this
                                        )}
                                      >
                                        {t("registration.form.terms.second")}
                                      </a>
                                    </label>
                                  </Form.Field>
                                </Form.Group>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        )} */}

                        <Divider hidden />
                        {errorForm}
                        <Grid>
                          <Grid.Column textAlign="center">
                            <Form.Button
                              // style={{ marginLeft: "130px" }}
                              color="blue"
                              size="large"
                              content={t("registration.signup")}
                            />
                          </Grid.Column>
                        </Grid>

                        <Divider hidden />
                      </Header>
                    </Form>
                  </Container>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                {/* <Segment color="orange" textAlign="left"> */}
                <div />
                <Header as="h4" className="titleComponent" textAlign="center">
                  {/* {t("registration.completeAccount")} */}
                  {t("login.compleAccount2")}
                  {/* {t("login.compleAccount")} */}
                </Header>
                <hr style={{ borderColor: "#207ef2" }}></hr>
                <Divider hidden></Divider>
                <Container className="container-form">
                  <Form
                    error
                    unstackable
                    loading={this.state.load}
                    onSubmit={this.handleRegistrer.bind(this)}
                  >
                    <Form.Field>
                      <label className="titleComponentMobile">
                        {t("registration.form.email")}
                      </label>
                      <Form.Input
                        type="email"
                        value={this.state.email}
                        onChange={(e, data) => {
                          this.setState({ email: e.target.value });
                        }}
                        required
                      />
                      {errorEmail}
                    </Form.Field>
                    {/* <Form.Field>
											<label className='titleComponentMobile'>
												{t("registration.form.username")}
											</label>
											<Form.Input
												type='text'
												value={this.state.nickname}
												onChange={(e, data) => {
													var er = new RegExp(/\s/);
													if (!er.test(e.target.value)) {
														if (e.target.value.length < 21) {
															this.setState({ nickname: e.target.value });
														} else {
															this.setState({
																errorNickName: true,
																messageError:
																	"registration.errors.errorMaxLongitude",
															});
															setTimeout(() => {
																this.setState({
																	errorNickName: false,
																	messageError: "",
																});
															}, 5000);
														}
													} else {
														this.setState({
															errorNickName: true,
															messageError:
																"registration.errors.errorBlankSpace",
														});
														setTimeout(() => {
															this.setState({
																errorNickName: false,
																messageError: "",
															});
														}, 5000);
													}
												}}
												required
											/>
											{errornickname}
										</Form.Field> */}
                    <Header as="h5" textAlign="left">
                      <Grid>
                        <Grid.Row columns={2}>
                          <Grid.Column mobile={2}>
                            <Form.Field textAlign="left">
                              <Form.Checkbox
                                style={{
                                  borderStyle: "groove",
                                  borderColor: "grey",
                                }}
                                onChange={this.handleRegistryCompany.bind(this)}
                                checked={this.state.company}
                              />
                            </Form.Field>
                          </Grid.Column>
                          <Grid.Column mobile={12}>
                            <Form.Field>
                              <label className="titleComponentMobile">
                                {t("registration.form.companyText")}
                              </label>
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Header>
                    <Header as="h5" textAlign="left">
                      {window.innerWidth <= 429 && (
                        <Grid>
                          <Grid.Row columns={2}>
                            <Grid.Column mobile={2}>
                              <Form.Field textAlign="left">
                                <Form.Checkbox
                                  style={{
                                    borderStyle: "groove",
                                    borderColor: "grey",
                                  }}
                                  onChange={this.handleConditions.bind(this)}
                                  checked={this.state.conditions === "true"}
                                />
                              </Form.Field>
                            </Grid.Column>
                            <Grid.Column mobile={12}>
                              <Form.Field>
                                <label className="titleComponentMobile">
                                  {t("registration.form.terms.first")}
                                  <a
                                    href="#"
                                    onClick={this.onClickTermsAndConditions.bind(
                                      this
                                    )}
                                  >
                                    {t("registration.form.terms.second")}
                                  </a>
                                </label>
                              </Form.Field>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      )}

                      <Divider hidden />
                      {errorForm}
                      <div className="text-center">
                        <Form.Button
                          color="blue"
                          size="large"
                          style={{
                            borderRadius: "40px/40px",
                            height: "50px",
                            width: "200px",
                          }}
                          content={t("registration.signup")}
                        />
                      </div>
                      <Divider hidden />
                    </Header>
                  </Form>
                </Container>
                {/* </Segment> */}
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Responsive>

        <Modal open={this.state.seeTermsAndConditions}>
          <Modal.Header>{t("registration.modalTerms.header")}</Modal.Header>
          <Modal.Content>
            <p>{t("registration.modalTerms.content.termsAndConditions")}</p>
            <h4>{t("registration.modalTerms.content.item1.title")}</h4>
            <p>{t("registration.modalTerms.content.item1.content")}</p>
            <h4>{t("registration.modalTerms.content.item2.title")}</h4>
            <p>{t("registration.modalTerms.content.item2.content")}</p>
            <h4>{t("registration.modalTerms.content.item3.title")}</h4>
            <p>{t("registration.modalTerms.content.item3.content")}</p>
            <h4>{t("registration.modalTerms.content.item4.title")}</h4>
            <p>{t("registration.modalTerms.content.item4.content")}</p>
            <h4>{t("registration.modalTerms.content.item5.title")}</h4>
            <p>{t("registration.modalTerms.content.item5.content")}</p>
            <h4>{t("registration.modalTerms.content.item6.title")}</h4>
            <p>{t("registration.modalTerms.content.item6.content")}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={this.handleConditions.bind(this)}>
              {t("registration.modalTerms.agreeButton")}
            </Button>
            <Button
              onClick={this.onClickCloseModalTermsAndConditions.bind(this)}
            >
              {t("registration.modalTerms.closeButton")}
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.viewModalSuccess}>
          <Modal.Header>
            {t("registration.modalResult.headerSuccess")}
          </Modal.Header>
          <Modal.Content>
            <p>{resultPostMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={this.handleModalClose.bind(this)}>
              {t("registration.modalResult.closeButton")}
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(CompleteAccount);
