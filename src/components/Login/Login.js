import React, { Component } from 'react';
import {
  Form,
  Container,
  Header,
  Segment,
  List,
  Grid,
  Divider,
  Message,
  Label,
  Button,
  Modal,
  Icon,
  Input,
  Responsive,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import './Login.css';
import userService from '../../services/user';
import config from '../../services/config.js';
import NumberFormat from 'react-number-format';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import uuid from 'uuid';
import _ from 'underscore';
import prefits from '../../common/prefits';
import Cookies from 'universal-cookie';
import { parse } from 'query-string';
import RetailService from '../../services/moneyclick';
import { Link } from 'react-router-dom';
import translate from '../../i18n/translate';
import interceptor from '../../services/interceptor';
import {
  osVersion,
  osName,
  fullBrowserVersion,
  browserName,
  mobileVendor,
  mobileModel,
  isMobile,
} from 'react-device-detect';
import decode from '../../services/decode';
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
const URL_BASE_DOLLAR = config.apiDollarBtcUrl;
const recapcha = React.createRef();
const cookies = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      captcha: '',
      iamUserMc: false,
      errorUser: false,
      errorCountry: false,
      errorPhone: false,
      errorPassword: false,
      userfind: '',
      errorCaptcha: false,
      message: '',
      headerMessage: '',
      notVerifyUser: false,
      loadForm: false,
      notAuth: false,
      prefit: prefits.country,
      responseAuth: false,
      auth: false,
      varlog: false,
      userType: '',
      individualField: false,
      phone: '',
      address: '',
      userStatus: '',
      countryCode: '',
      balance: null,
      listUser: [],
      userWallets: null,
      showModal: false,
      errorUpdatingDevice: false,
      resultUpdatingMessage: 'notErrors',
      loadingButtons: false,
      contentModal: 'login.errors.notContent',
      currentDeviceStatus: '',
      successUpdate: false,
      readyToRedirect: false,
      tokenurl: '',
      hidden: true,
      retailIds: null,
      balanceBtc: '',
      balanceOtherCurrencies: [],
      balanceMoneyClick: [],
      retailsInfo: [],
      balanceRetail: {},
      translator: props.translate,
      completeAccount: false,
      factorPrefered: false,
      viewCompleteAccount: false,
      load: false,
      company: '',
    };
    this.handleUser = this.handleUser.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleCaptcha = this.handleCaptcha.bind(this);
    this.login = this.login.bind(this);
    this.findUser = this.findUser.bind(this);
    this.blankErrors = this.blankErrors.bind(this);
    this.authUserLogin = this.authUserLogin.bind(this);
    this.setLoginFull = this.setLoginFull.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.setLoginNotVerifiedEmail = this.setLoginNotVerifiedEmail.bind(this);
    this.updateUsersDevices = this.updateUsersDevices.bind(this);
    this.closeModalDevices = this.closeModalDevices.bind(this);
    this.acceptUpdateModifications = this.acceptUpdateModifications.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }
  handleUser(e) {
    this.setState({ user: e.target.value.toLowerCase() });
    //	}
  }
  handlePassword(e) {
    this.setState({ password: e.target.value });
  }
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  handleCaptcha(params) {
    this.setState({
      captcha: params,
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
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith('phone') && !listKeys[i].includes("__")) {
        actualPhoneKey = listKeys[i];
      } else if (listKeys[i].startsWith('questionSecurity')) {
        actualQuestionSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith('answerSecurity')) {
        actualAnswerSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith('typeDocumentIdentity')) {
        actualTypeDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith('numberDocumentIdentity')) {
        actualNumberDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith('gender')) {
        actualGenderKey = listKeys[i];
      } else if (listKeys[i].startsWith('birthdate')) {
        actualBirthdateKey = listKeys[i];
      } else if (listKeys[i].startsWith('birthplace')) {
        actualBirthplaceKey = listKeys[i];
      } else if (listKeys[i].startsWith('familyName')) {
        actualFamilyNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('familyEmail')) {
        actualFamilyEmailKey = listKeys[i];
      } else if (listKeys[i].startsWith('userLocalBitcoin')) {
        actualUserLocalBitcoinKey = listKeys[i];
      } else if (listKeys[i].startsWith('userFacebook')) {
        actualUserFacebookKey = listKeys[i];
      } else if (listKeys[i].startsWith('userDirection')) {
        actualUserAddressKey = listKeys[i];
      } else if (listKeys[i].startsWith('nickname')) {
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
      'address',
      'operationAccount',
      'environment',
      'type',
      'active',
      'email',
      'wallets',
      'devices'
    );
    var modifiedObj = _.pick(allInfo, [listActualKeys]);
    var normalizeObject = {};
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith('firstName')) {
        normalizeObject.firstName = value;
      } else if (key.startsWith('lastName')) {
        normalizeObject.lastName = value;
      } else if (key.startsWith('email')) {
        normalizeObject.email = value;
      } else if (key.startsWith('active')) {
        normalizeObject.active = value;
      } else if (key === 'type') {
        normalizeObject.type = value;
      } else if (key.startsWith('environment')) {
        normalizeObject.environment = value;
      } else if (key.startsWith('operationAccount')) {
        normalizeObject.operationAccount = value;
      } else if (key.startsWith('address')) {
        normalizeObject.address = value;
      } else if (key.startsWith('questionSecurity')) {
        normalizeObject.questionSecurity = value;
      } else if (key.startsWith('answerSecurity')) {
        normalizeObject.answerSecurity = value;
      } else if (key.startsWith('typeDocumentIdentity')) {
        normalizeObject.typeDocumentIdentity = value;
      } else if (key.startsWith('numberDocumentIdentity')) {
        normalizeObject.numberDocumentIdentity = value;
      } else if (key.startsWith('gender')) {
        normalizeObject.gender = value;
      } else if (key.startsWith('birthdate')) {
        normalizeObject.birthdate = value;
      } else if (key.startsWith('birthplace')) {
        normalizeObject.birthplace = value;
      } else if (key.startsWith('familyName')) {
        normalizeObject.familyName = value;
      } else if (key.startsWith('familyEmail')) {
        normalizeObject.familyEmail = value;
      } else if (key.startsWith('userLocalBitcoin')) {
        normalizeObject.userLocalBitcoin = value;
      } else if (key.startsWith('userFacebook')) {
        normalizeObject.userFacebook = value;
      } else if (key.startsWith('userDirection')) {
        normalizeObject.userDirection = value;
      } else if (key.startsWith('phone') && key.search('__') === -1) {
        normalizeObject.phone = value;
      } else if (key.startsWith('nickname')) {
        normalizeObject.nickname = value;
      } else if (key.startsWith('wallets')) {
        normalizeObject.wallets = value;
      } else if (key.startsWith('devices')) {
        normalizeObject.devices = value;
      }
    });
    return normalizeObject;
  };
  async authUserLogin(username, password) {
    //	console.log("dentro del authUserlogin ");
    // this.setState({ loadForm: true });
    userService
      .authUser(username, password)
      .then(async (res) => {
        //	console.log(res);
        if (!res.data.errors || res.data.errors.length === 0) {
          let userConfig = await this.validateUser(res.data.user.username);
          if (userConfig !== undefined) {
            let token = String(res.data.token);
            while (token.includes('-')) {
              token = token.replace('-', '');
            }
            let cookieSessionUser = cookies.get('SessionUserDevice');
            let deviceId =
              cookieSessionUser !== undefined && cookieSessionUser !== null
                ? cookieSessionUser
                : uuid.v4();
            let body = {
              userName: res.data.user.username,
              secretKey: token,
              deviceId: deviceId,
            };
            console.log(deviceId);
            sessionStorage.setItem('device', deviceId);
            try {
              const response = await userService.setAccessTokenAuth(body);
              var pass = decode.encode(token);
              var hash = decode.randomBytes(50);
              var endPass = decode.encode(
                pass + '__' + decode.bytesToBase64(hash)
              );

              sessionStorage.setItem('s', endPass);
            } catch (error) {
              //console.log(error);
            }

            this.setLoginFull(res, password, userConfig.wallets);
            this.getBalanceMoneyClick(res.data.user.username);
          } else {
            this.setState({
              viewmesage: true,
              messagetext: 'error.credentials.header',
              loadForm: false,
              load: false,
            });
            setTimeout(() => {
              this.setState({
                viewmesage: false,
              });
            }, 7000);
            window.sessionStorage.removeItem('userBalanceBTC');
          }
          this.setState({ loadForm: false, load: false });
        } else if (
          res.data.errors[0].code === 28 ||
          res.data.errors[0].code === 29
        ) {
          let userConfig = await this.validateUser(res.data.user.username);
          if (userConfig !== undefined) {
            let token = String(res.data.token);
            while (token.includes('-')) {
              token = token.replace('-', '');
            }
            let cookieSessionUser = cookies.get('SessionUserDevice');
            let deviceId =
              cookieSessionUser !== undefined && cookieSessionUser !== null
                ? cookieSessionUser
                : uuid.v4();
            let body = {
              userName: res.data.user.username,
              secretKey: token,
              deviceId: deviceId,
            };
            sessionStorage.setItem('device', deviceId);
            try {
              const response = await userService.setAccessTokenAuth(body);
              var pass = decode.encode(token);
              var hash = decode.randomBytes(50);
              var endPass = decode.encode(
                pass + '__' + decode.bytesToBase64(hash)
              );
              sessionStorage.setItem('s', endPass);
            } catch (error) {
              //console.log(error);
            }
            this.setLoginFull(res, password, userConfig.wallets);
            // this.setLoginNotVerifiedEmail(
            //   res.data.user,
            //   username,
            //   password,
            //   userConfig.wallets
            // );
            this.getBalanceMoneyClick(res.data.user.username);
            this.setState({ load: false, loadForm: false });
          } else {
            this.setState({
              loadForm: false,
              load: false,
              viewmesage: true,
              messagetext: 'error.credentials.header',
            });
            setTimeout(() => {
              this.setState({
                viewmesage: false,
              });
            }, 7000);
            window.sessionStorage.removeItem('userBalanceBTC');
          }
          //this.setState({ loadForm: false });
        } else if (res.data.errors[0].code === 71) {
          this.setState({
            loadForm: false,
            load: false,
            viewmesageErrorSession: true,
            messagetext: 'login.errors.credentials.previusSession',
          });
          setTimeout(() => {
            this.setState({
              viewmesageErrorSession: false,
            });
          }, 7000);
          window.sessionStorage.removeItem('userBalanceBTC');
        } else {
          //	console.log("dentro del error");
          this.setState({
            loadForm: false,
            load: false,
            viewmesage: true,
            messagetext: 'error.credentials.header',
          });
          setTimeout(() => {
            this.setState({
              viewmesage: false,
            });
          }, 7000);
          window.sessionStorage.removeItem('userBalanceBTC');
        }
        if (recapcha.current !== null) {
          recapcha.current.reset('capt');
        }
      })
      .catch((error) => {
        ////////console.log(error);
        this.setState({
          loadForm: false,
          load: false,
          errorCaptcha: true,
          message: 'login.errors.errorCaptcha',
          user: '',
          password: '',
        });
        if (recapcha.current !== null) {
          recapcha.current.reset('capt');
        }
        this.blankErrors('errorCaptcha');
        // ////////console.log(error);
      });
  }
  configWalletUser(wallet) {}
  setBalanceInStore(username) {
    userService
      .getBalanceUser(username)
      .then((resp) => {
        let acum = 0;
        let result = {
          available: 0,
          estimated: 0,
        };
        let acumdefered = 0;
        if (
          resp.data.result.modelBalances !== undefined &&
          resp.data.result.modelBalances.length > 0
        ) {
          for (let val of resp.data.result.modelBalances) {
            for (let data of val.availableAmounts) {
              if (data.currency === 'BTC') {
                acum = acum + parseFloat(data.amount);
              }
            }
          }
        }
        let decimales = Math.pow(10, 8);
        let data2 = Math.floor(acum * decimales) / decimales;
        if (resp.data.result.availableAmounts !== undefined) {
          if (resp.data.result.availableAmounts.length > 0) {
            if (resp.data.result.availableAmounts[0].amount > 0) {
              acumdefered =
                acumdefered +
                Math.floor(
                  resp.data.result.availableAmounts[0].amount * decimales
                ) /
                  decimales;
            } else {
              acumdefered = acumdefered;
            }
          }
        }
        if (resp.data.result.deferredAmounts !== undefined) {
          if (resp.data.result.deferredAmounts.length > 0) {
            if (resp.data.result.deferredAmounts[0].amount > 0) {
              acumdefered =
                acumdefered +
                Math.floor(
                  resp.data.result.deferredAmounts[0].amount * decimales
                ) /
                  decimales;
            } else {
              acumdefered = acumdefered;
            }
          }
        }
        result.available = acumdefered;
        result.estimated = data2;
        sessionStorage.setItem('userBalanceBTC', JSON.stringify(result));
      })
      .catch((error) => {
        sessionStorage.setItem('userBalanceBTC', '');
      });
  }
  async validateUser(username) {
    let configUser;
    try {
      const res = await userService.getConfigUserGeneralAsync(username);
      let keys = Object.keys(res.data.result);
      if (keys.length > 0) {
        if (
          res.data.result.type === 'NORMAL' ||
          res.data.result.type === 'BROKER'
        ) {
          this.setBalanceInStore(username);
          //userService.getBalanceUser(username).then(res => {});
          configUser = this.getActualUserInfo(res.data.result);
          if (res.data.result.retailIds !== undefined) {
            let retails = res.data.result.retailIds;
            this.setState({
              retailIds: retails,
            });
          }

          let dataUser = {
            userDirection:
              configUser.userDirection !== undefined
                ? configUser.userDirection
                : '',
            userLocalBitcoin:
              configUser.userLocalBitcoin !== undefined
                ? configUser.userLocalBitcoin
                : '',
            userFacebook:
              configUser.userFacebook !== undefined
                ? configUser.userFacebook
                : '',

            nickname:
              configUser.nickname !== undefined ? configUser.nickname : '',
          };
          //this.updateWalletCreationDate(dataendUser.wallets);
          this.setState({
            userType: res.data.result.type,
            userData: dataUser,
          });
          if (res.data.result.verification === undefined) {
            this.setState({
              userStatusC: 'UNINITIATED',
              userStatusA: false,
              userStatusB: false,
            });
          } else {
            if (res.data.result.verification.C === undefined) {
              this.setState({ userStatusC: 'UNINITIATED' });
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
            userService.generateKeyService(username, this.state.password);
          }
          return configUser;
        } else if (res.data.result.type === 'ADMIN') {
          configUser = this.getActualUserInfo(res.data.result);
          this.setState({ loadForm: true });
          this.setState({ userType: res.data.result.type });
          let dataUser = {
            userDirection:
              configUser.userDirection !== undefined
                ? configUser.userDirection
                : '',
            userLocalBitcoin:
              configUser.userLocalBitcoin !== undefined
                ? configUser.userLocalBitcoin
                : '',
            userFacebook:
              configUser.userFacebook !== undefined
                ? configUser.userFacebook
                : '',
            nickname:
              configUser.nickname !== undefined ? configUser.nickname : '',
          };

          this.setState({
            userType: res.data.result.type,
            userData: dataUser,
          });
          if (res.data.result.verification === undefined) {
            this.setState({
              userStatusC: 'UNINITIATED',
              userStatusA: false,
              userStatusB: false,
            });
          } else {
            if (res.data.result.verification.C === undefined) {
              this.setState({ userStatusC: 'UNINITIATED' });
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

          return configUser;
        } else {
          if (recapcha.current !== null) {
            recapcha.current.reset('capt');
          }
          return undefined;
          // this.setState({
          //   errorLog: true,
          //   message: "login.errors.errorProTrader",
          // });
        }
      } else {
        return undefined;
      }
    } catch (error) {
      //console.log(error);
      this.setState({
        errorCaptcha: true,
        message: 'login.errors.errorCaptcha',
        user: '',
        password: '',
      });
      if (recapcha.current !== null) {
        recapcha.current.reset('capt');
      }
      this.blankErrors('errorCaptcha');
    }
  }
  sendCode() {
    ////console.log('dentro del sendCode');
    let body = {
      username: userService.getUserName(),
      enforceSms: false,
    };
    axios
      .post(URL_BASE_BUSHIDO + config.urlBushido.sendCode, body, {
        auth: {
          username: atob(userService.getHeader()).split(':')[1],
          password: atob(userService.getHeader()).split(':')[0],
        },
      })
      .then((res) => {
        ////console.log(res);
      })
      .catch((error) => {
        ////console.log(error);
      });
  }
  setLoginFull(res, password, walletsDLBT) {
    //	console.log(res, password, walletsDLBT);
    // interceptor.setNewConstructor(res.data.user.username, res.data.token);
    var websocketKey = uuid.v4();
    window.sessionStorage.setItem(
      'firstName',
      res.data.user.firstName !== undefined && res.data.user.firstName !== null
        ? res.data.user.firstName
        : ''
    );
    window.sessionStorage.setItem(
      'lastName',
      res.data.user.lastName !== undefined && res.data.user.lastName !== null
        ? res.data.user.lastName
        : ''
    );
    window.sessionStorage.setItem('phone', res.data.user.phone);
    window.sessionStorage.setItem('countryCode', res.data.user.countryCode);
    window.sessionStorage.setItem('twoFactor', res.data.user.has2FAEnabled);
    window.sessionStorage.setItem('phoneVerified', res.data.user.phoneVerified);
    window.sessionStorage.setItem('username', res.data.user.username);
    window.sessionStorage.setItem('email', res.data.user.email);
    window.sessionStorage.setItem(
      'preferedSendCodeSecurity',
      res.data.user.preferedSendCodeSecurity
    );
    window.sessionStorage.setItem(
      '2FactorPrefered',
      res.data.user.preferedSendCodeSecurityTwoFactor
    );
    sessionStorage.setItem('isQrCodeCreated', res.data.user.isQrCodeCreated);
    let hashCredencial = btoa(password + ':' + res.data.user.username);
    window.sessionStorage.setItem('header', hashCredencial);
    window.sessionStorage.setItem('verify', true);
    window.sessionStorage.setItem(
      'devices',
      JSON.stringify(res.data.user.devices)
    );
    this.determinateUpdateWallet(res.data.user.wallets, walletsDLBT);
    let usernoAdmin = {
      id: '',
      name: '',
      functionsAvailables: ['not'],
    };
    sessionStorage.setItem(
      'r',
      res.data.user.rol !== null
        ? JSON.stringify(res.data.user.rol)
        : JSON.stringify(usernoAdmin)
    );
    window.sessionStorage.setItem('websocketKey', websocketKey);
    this.updateUsersDevices();
    if (res.data.user.has2FAEnabled === true) {
      this.get2FPreference();
      if (
        res.data.user.lastConexion === null ||
        res.data.user.lastConexion === undefined
      ) {
        this.setState({ twoFactor: true });
        window.sessionStorage.setItem('auth', false);
        userService.updateLastConexion(res.data.user.username);
      } else {
        let actualDate = new Date();
        let lastDate = new Date(res.data.user.lastConexion);
        let result = actualDate.getTime() - lastDate.getTime();
        if (result > 360) {
          this.setState({ twoFactor: true });
          window.sessionStorage.setItem('auth', false);
        } else {
          this.setState({ auth: true });
          window.sessionStorage.setItem('auth', true);
        }
      }
    } else {
      //	console.log("entrando el else del loginfull");
      this.setState({
        auth: true,
        factorPrefered: true,
        loadForm: false,
        load: false,
      });
      sessionStorage.setItem('auth', true);
      userService.updateLastConexion(res.data.user.username);
      if (this.state.viewCompleteAccount === true) {
        //		console.log("dentro de la condicion viewCompleteAccount");
        this.setState({ viewModalSuccess: true });
      }
    }
  }

  setLoginNotVerifiedEmail(res, email, password, walletsDLBT) {
    var websocketKey = uuid.v4();
    //interceptor.setNewConstructor(res.username, res.data.token);
    window.sessionStorage.setItem('firstName', '');
    window.sessionStorage.setItem('lastName', '');
    window.sessionStorage.setItem('phone', res.phone);
    window.sessionStorage.setItem('countryCode', res.countryCode);
    window.sessionStorage.setItem('twoFactor', res.has2FAEnabled);
    window.sessionStorage.setItem('phoneVerified', res.phoneVerified);
    window.sessionStorage.setItem('username', res.username);
    window.sessionStorage.setItem(
      'preferedSendCodeSecurity',
      res.preferedSendCodeSecurity
    );
    window.sessionStorage.setItem('2FactorPrefered', res.twoFactorPrefered);
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('websocketKey', websocketKey);
    let hashCredencial = btoa(password + ':' + res.username);
    window.sessionStorage.setItem('header', hashCredencial);
    window.sessionStorage.setItem('verify', false);
    window.sessionStorage.setItem('devices', JSON.stringify(res.devices));
    this.determinateUpdateWallet(res.wallets, walletsDLBT);

    let usernoAdmin = {
      id: '',
      name: '',
      functionsAvailables: ['not'],
    };
    sessionStorage.setItem(
      'r',
      res.rol !== null ? JSON.stringify(res.rol) : JSON.stringify(usernoAdmin)
    );
    this.updateUsersDevices();
    if (res.has2FAEnabled === true) {
      this.get2FPreference();
      if (res.lastConexion === null || res.lastConexion === undefined) {
        this.setState({ twoFactor: true });
        window.sessionStorage.setItem('auth', false);
        userService.updateLastConexion(res.username);
      } else {
        let actualDate = new Date();
        let lastDate = new Date(res.lastConexion);
        let result = actualDate.getTime() - lastDate.getTime();
        if (result > 3600000) {
          //3600000
          this.setState({ twoFactor: true });
          window.sessionStorage.setItem('auth', false);
        } else {
          this.setState({ auth: true });
          window.sessionStorage.setItem('auth', true);
        }
      }
    } else {
      this.setState({ auth: true, factorPrefered: true });
      //sessionStorage.setItem("auth", true);
      if (this.state.viewCompleteAccount === true) {
        this.setState({ viewModalSuccess: true });
      }
      userService.updateLastConexion(res.username).then((resp) => {
        if (resp !== '') {
          //	console.log(resp);
        }
      });
    }
  }
  componentDidMount() {
    this.readUrlWhitParams();
  }
  determinateUpdateWallet(wallets, walletsTo) {
    //  //console.log(wallets, walletsTo);
    let walletsBushido = wallets;
    let walletsToUpdate = [];
    if (walletsTo !== undefined) {
      let currentAddress = Object.values(walletsTo.current)[0].address;
      walletsToUpdate = walletsBushido.filter((wallet) => {
        if (
          wallet.creationDate === undefined ||
          wallet.creationDate === null ||
          wallet.creationDate === 0
        )
          if (wallet.address === currentAddress) return wallet;
      });
      if (walletsToUpdate.length > 0) {
        //    //console.log(walletsToUpdate);
        this.updateWalletCreationDate(walletsToUpdate);
      }
    }
    window.sessionStorage.setItem(
      'wallets',
      JSON.stringify(
        walletsToUpdate.length > 0 ? walletsToUpdate : walletsBushido
      )
    );
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  async completeAccount(username, email, nickname) {
    this.setState({ load: true, loadForm: true });
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
        if (response.data.payload === true) {
          let verificationStatus = {
            A: this.state.userStatusA,
            B: this.state.userStatusB,
            C: this.state.userStatusC,
          };
          window.sessionStorage.setItem(
            'userVerificationStatus',
            JSON.stringify(verificationStatus)
          );
          window.sessionStorage.setItem(
            'userDataDBTC',
            JSON.stringify(this.state.userData)
          );
          window.sessionStorage.setItem('nickname', this.state.nickname);
          window.sessionStorage.setItem('address', this.state.address);
          window.sessionStorage.setItem('userType', this.state.userType);
          window.sessionStorage.setItem(
            'userWallets',
            JSON.stringify(this.state.userWallets)
          );
          if (this.state.retailIds !== undefined) {
            window.sessionStorage.setItem(
              'retail',
              JSON.stringify(this.state.retailIds)
            );
          }

          if (this.state.hasEmail === true) {
            await this.updateDataExistInUser(
              username,
              'email',
              this.state.email
            );
          } else {
            await this.updateDataInUser(username, 'email', this.state.email);
          }
          window.sessionStorage.setItem('email', this.state.email);
          this.authUserLogin(this.state.userfind, this.state.password);
          //	this.setState({ viewModalSuccess: true });
        } else if (response.data.errors[0].code === 48) {
          //	console.log("dentro del 48");
          this.setState({
            loadForm: false,
            load: false,
            errorForm: true,
            message: 'profile.updateProfile.errors.repeatedPhone',
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: '',
            });
          }, 6000);
        } else if (response.data.errors[0].code === 65) {
          this.setState({
            loadForm: false,
            load: false,
            errorForm: true,
            message: 'registration.errors.form.alreadyEmail',
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: '',
            });
          }, 6000);
        } else {
          this.setState({
            loadForm: false,
            load: false,
            errorForm: true,
            message: 'profile.updateProfile.errors.repeatedPhone',
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: '',
            });
          }, 6000);
        }
      })
      .catch((error) => {
        this.setState({ load: false, loadForm: false });
        this.setState({
          errorForm: true,
          message: 'registration.errors.unexpectedError',
        });
        setTimeout(() => {
          this.setState({
            errorForm: false,
            message: '',
          });
        }, 6000);
      });
  }
  handleRegistrer() {
    //	console.log(this.state.userfind, this.state.email, this.state.nickname);
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.state.email !== '') {
      if (regex.test(this.state.email)) {
        this.completeAccount(
          this.state.userfind,
          this.state.email,
          this.state.nickname
        );
      } else {
        this.setState({
          errorEmail: true,
          message: 'registration.errors.form.email',
        });
        setTimeout(() => {
          this.setState({
            errorEmail: false,
            message: '',
          });
        }, 6000);
      }
    } else {
      this.setState({
        errorEmail: true,
        message: 'registration.errors.form.email',
      });
      setTimeout(() => {
        this.setState({
          errorEmail: false,
          message: '',
        });
      }, 6000);
    }
  }
  findUser() {
    let userMc;
    if (
      this.state.countryCode !== '' &&
      this.state.phone !== '' &&
      this.state.user !== ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 5000);
    } else if (
      this.state.countryCode !== '' &&
      this.state.user !== '' &&
      this.state.phone === ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
          countryCode: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user !== '' &&
      this.state.phone !== ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode !== '' &&
      this.state.user === '' &&
      this.state.phone === ''
    ) {
      this.setState({
        errorPhone: true,
        message: 'login.errors.errorRequired',
      });
      setTimeout(() => {
        this.setState({
          errorPhone: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user === '' &&
      this.state.phone !== ''
    ) {
      this.setState({
        errorCountry: true,
        message: 'login.errors.errorRequired',
      });
      setTimeout(() => {
        this.setState({
          errorCountry: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user === '' &&
      this.state.phone === ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.completeFields',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 5000);
    }

    if (
      this.state.phone !== null &&
      this.state.phone !== '' &&
      this.state.countryCode !== '' &&
      this.state.countryCode !== null &&
      this.state.user === ''
    ) {
      this.setState({
        loadForm: true,
        load: true,
      });
      userMc = this.state.countryCode + this.state.phone;

      userService
        .findUserByPhone(this.state.phone, this.state.countryCode)
        .then((res) => {
          if (
            res.data.payload !== false &&
            res.data.payload !== null &&
            res.data.payload !== undefined
          ) {
            //	console.log("payload findUserPhone:", res.data.payload);
            this.setState(
              {
                userfind: res.data.payload[0].toString(),
                nickname: res.data.payload[1].toString(),
              },
              () => {
                this.getBalanceMoneyClick();
                this.login(res.data.payload[0].toString());
              }
            );
            //	this.getBalanceMoneyClick();
            //	console.log("despues del set state:", this.state.userfind);
          } else {
            //	console.log("dentro del else");
            this.setState({
              viewmesage: true,
              messagetext: 'error.credentials.header',
              loadForm: false,
              load: false,
            });
            setTimeout(() => {
              this.setState({
                viewmesage: false,
              });
            }, 7000);
          }
        })
        .catch((error) => {
          this.setState({ load: false, loadForm: false });
          this.setState({
            errorForm: true,
            message: 'registration.errors.unexpectedError',
          });
          setTimeout(() => {
            this.setState({
              errorForm: false,
              message: '',
            });
          }, 6000);
        });
    } else {
      //	console.log("por el else find user");
      this.login();
    }
  }
  login(username) {
    if (
      this.state.user !== '' &&
      this.state.user !== null &&
      this.state.countryCode === '' &&
      this.state.phone === ''
    ) {
      if (this.state.password !== '') {
        if (this.state.captcha !== '') {
          if (username === undefined) {
            console.log('dentrod del usrname = undefined');
            this.setState({
              loadForm: true,
              load: true,
            });
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let result = re.test(this.state.user);
            if (result === true) {
              this.authUserLogin(this.state.user, this.state.password);
              // userService
              // 	.findUserByEmail(this.state.user)
              // 	.then((res) => {
              // 		console.log("respuesta find user email:", res);
              // 		if (res !== "") {
              // 			if (
              // 				res.data.payload !== false &&
              // 				res.data.payload !== null &&
              // 				res.data.payload !== undefined
              // 			) {
              // 				//	this.authUserLogin(this.state.user, this.state.password);
              // 			} else {
              // 				//	console.log("dentro del else");
              // 				this.setState({
              // 					viewmesage: true,
              // 					messagetext: "error.credentials.header",
              // 					loadForm: false,
              // 					load: false,
              // 				});
              // 				setTimeout(() => {
              // 					this.setState({
              // 						viewmesage: false,
              // 					});
              // 				}, 7000);
              // 			}
              // 		}
              // 	})
              // 	.catch((error) => {
              // 		console.log(error);
              // 	});
            } else {
              this.setState({
                loadForm: false,
                load: false,
                errorUser: true,
                message: 'profile.addAccount.messages.errorEmailReceiverWrong',
              });
              setTimeout(() => {
                this.setState({
                  errorUser: false,
                  message: '',
                });
              }, 5000);
            }
          } else {
            //	console.log("por el else del username undefined");
            this.authUserLogin(username, this.state.password);
          }
        } else {
          this.setState({
            loadForm: false,
            load: false,
            errorCaptcha: true,
            message: 'login.errors.errorCaptcha2',
          });
          this.blankErrors('errorCaptcha');
        }
      } else {
        this.setState({
          loadForm: false,
          load: false,
          errorPassword: true,
          message: 'login.errors.errorRequired',
        });
        this.blankErrors('errorPassword');
      }
    } else if (
      this.state.user === '' &&
      this.state.countryCode !== '' &&
      this.state.phone !== ''
    ) {
      if (this.state.password !== '') {
        if (this.state.captcha !== '') {
          if (
            this.state.userfind !== null &&
            this.state.userfind !== undefined &&
            this.state.userfind !== ''
          ) {
            userService
              .getConfigUserGeneral(this.state.userfind)

              .then((res) => {
                //	console.log(" getCongif:", res.data);
                if (
                  res.data.result.name !== '' &&
                  res.data.result.name !== null &&
                  res.data.result.name !== undefined
                ) {
                  if (
                    res.data.result.email !== '' &&
                    res.data.result.email !== null &&
                    res.data.result.email !== undefined
                  ) {
                    this.setState({ dataFullUser: res.data.result });
                    if (res.data.result.email !== undefined) {
                      if (res.data.result.email !== '') {
                        this.setState({ hasEmail: true });
                      } else {
                        this.setState({ hasEmail: false });
                      }
                    } else {
                      this.setState({ hasEmail: false });
                    }
                    if (
                      res.data.result.type === 'NORMAL' ||
                      res.data.result.type === 'BROKER'
                    ) {
                      userService.getBalanceUser(this.state.userfind);
                      let dataUser = this.getActualUserInfo(res.data.result);
                      let userData = this.getActualUserInfo(res.data.result);
                      sessionStorage.setItem(
                        'nickname',
                        userData.nickname !== undefined ? userData.nickname : ''
                      );
                      //console.log("dentro del login ");
                      this.authUserLogin(
                        this.state.userfind,
                        this.state.password,
                        dataUser.wallets
                      );
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
                            : '',
                        userLocalBitcoin:
                          dataUser.userLocalBitcoin !== undefined
                            ? dataUser.userLocalBitcoin
                            : '',
                        userFacebook:
                          dataUser.userFacebook !== undefined
                            ? dataUser.userFacebook
                            : '',
                      };
                      //this.updateWalletCreationDate(dataendUser.wallets);
                      this.setState({
                        userType: res.data.result.type,
                        userData: dataUser,
                      });
                      if (res.data.result.verification === undefined) {
                        this.setState({
                          userStatusC: 'UNINITIATED',
                          userStatusA: false,
                          userStatusB: false,
                        });
                      } else {
                        if (res.data.result.verification.C === undefined) {
                          this.setState({ userStatusC: 'UNINITIATED' });
                        } else {
                          this.setState({
                            userStatusC:
                              res.data.result.verification.C
                                .userVerificationStatus,
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
                          let current = Object.values(
                            res.data.result.wallets.current
                          )[0].address;
                          this.setState({
                            address: current,
                            userWallets: res.data.result.wallets,
                          });
                        } else
                          this.setState({
                            userWallets: res.data.result.wallets,
                          });
                      } else {
                        userService.generateKeyService(
                          this.state.userfind,
                          this.state.password
                        );
                      }
                      //=======================================================================================================
                    } else if (res.data.result.type === 'ADMIN') {
                      let dataUser = this.getActualUserInfo(res.data.result);
                      this.authUserLogin(
                        this.state.userfind,
                        this.state.password,
                        dataUser.wallets
                      );
                      this.setState({ load: true });
                      this.setState({ userType: res.data.result.type });
                      dataUser = {
                        userDirection:
                          dataUser.userDirection !== undefined
                            ? dataUser.userDirection
                            : '',
                        userLocalBitcoin:
                          dataUser.userLocalBitcoin !== undefined
                            ? dataUser.userLocalBitcoin
                            : '',
                        userFacebook:
                          dataUser.userFacebook !== undefined
                            ? dataUser.userFacebook
                            : '',
                      };
                      this.setState({
                        userType: res.data.result.type,
                        userData: dataUser,
                      });
                      if (res.data.result.verification === undefined) {
                        this.setState({
                          userStatusC: 'UNINITIATED',
                          userStatusA: false,
                          userStatusB: false,
                        });
                      } else {
                        if (res.data.result.verification.C === undefined) {
                          this.setState({ userStatusC: 'UNINITIATED' });
                        } else {
                          this.setState({
                            userStatusC:
                              res.data.result.verification.C
                                .userVerificationStatus,
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
                      //	console.log("ninguno de los anteriores");
                      this.setState({
                        errorLog: true,
                        message: 'login.errors.errorProTrader',
                      });
                      if (recapcha.current !== null) {
                        recapcha.current.reset('capt');
                      }
                    }
                  } else {
                    let dataUser = this.getActualUserInfo(res.data.result);
                    this.setState({
                      firstName:
                        dataUser.firstName !== undefined
                          ? dataUser.firstName
                          : '',
                      lastName:
                        dataUser.lastName !== undefined
                          ? dataUser.lastName
                          : '',
                      loadForm: false,
                      load: false,
                      viewCompleteAccount: true,
                    });
                    // this.authUserLogin(
                    // 	this.state.userfind,
                    // 	this.state.password,
                    // );
                    // setTimeout(() => {
                    // 	this.setState({
                    // 		//	individualField: false,
                    // 		//	message: "",
                    // 		//	iamUserMc: false,
                    // 	});
                    // }, 8000);
                    let hashCredencial = btoa(
                      this.state.password + ':' + this.state.userfind
                    );
                    window.sessionStorage.setItem('header', hashCredencial);
                  }
                } else {
                  this.setState({
                    individualField: true,
                    message: 'login.errors.errorCaptcha3',
                  });
                  setTimeout(() => {
                    this.setState({
                      individualField: false,
                      message: '',
                    });
                  }, 5000);
                }
              })
              .catch((error) => {
                this.setState({
                  errorCaptcha: true,
                  message: 'login.errors.errorCaptcha',
                  user: '',
                  password: '',
                });
                if (recapcha.current !== null) {
                  recapcha.current.reset('capt');
                }
                setTimeout(() => {
                  this.setState({ errorCaptcha: false, message: '' });
                }, 6000);
                console.log(error);
              });
          }
        } else {
          this.setState({
            errorCaptcha: true,
            message: 'login.errors.errorCaptcha2',
          });
          this.blankErrors('errorCaptcha');
        }
      } else {
        this.setState({
          errorPassword: true,
          message: 'login.errors.errorRequired',
        });
        this.blankErrors('errorPassword');
      }
    } else if (
      this.state.countryCode !== '' &&
      this.state.phone !== '' &&
      this.state.user !== ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 5000);
    } else if (
      this.state.countryCode !== '' &&
      this.state.user !== '' &&
      this.state.phone === ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
          countryCode: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user !== '' &&
      this.state.phone !== ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.individualField',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode !== '' &&
      this.state.user === '' &&
      this.state.phone === ''
    ) {
      this.setState({
        errorPhone: true,
        message: 'login.errors.errorRequired',
      });
      setTimeout(() => {
        this.setState({
          errorPhone: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user === '' &&
      this.state.phone !== ''
    ) {
      this.setState({
        errorCountry: true,
        message: 'login.errors.errorRequired',
      });
      setTimeout(() => {
        this.setState({
          errorCountry: false,
          message: '',
        });
      }, 4000);
    } else if (
      this.state.countryCode === '' &&
      this.state.user === '' &&
      this.state.phone === ''
    ) {
      this.setState({
        individualField: true,
        message: 'login.errors.completeFields',
      });
      setTimeout(() => {
        this.setState({
          individualField: false,
          message: '',
        });
      }, 5000);
    }
  }
  blankErrors(label) {
    if (label === 'errorUser') {
      setTimeout(() => {
        this.setState({ errorUser: false, message: '' });
      }, 5000);
    }
    if (label === 'errorPassword') {
      setTimeout(() => {
        this.setState({ errorPassword: false, message: '' });
      }, 5000);
    }
    if (label === 'errorCaptcha') {
      setTimeout(() => {
        this.setState({ errorCaptcha: false, message: '' });
      }, 5000);
    }
    if (label === 'error') {
      setTimeout(() => {
        this.setState({ notVerifyUser: false, notAuth: false });
        // user.updateResponse();
      }, 5000);
    }
  }
  getBalanceMoneyClick(username) {
    RetailService.getBalanceMoneyclick(username)
      .then((resp) => {
        window.sessionStorage.setItem(
          'balanceMoneyClick',
          JSON.stringify(resp.data)
        );
      })
      .catch((error) => {
        //////console.log(error);
      });
  }
  handleForgotPassword() {
    if (this.props.setView !== undefined) {
      this.props.setView('forgotPassword');
    }
    this.setState({ forgotPassword: true });
  }
  handleUserMC() {
    if (this.props.setView !== undefined) {
      this.props.setView('completeAccount');
    }
    this.setState({ completeAccount: true });
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
        ////////console.log(result);
      })
      .catch((error) => {
        ////////console.log(error);
      });
  }
  addNewBrowserToUser() {
    let cookieSessionUser = cookies.get('SessionUserDevice');
    let creation = new Date();
    let expiration = new Date();
    expiration.setDate(creation.getDate() + 180);
    let body = {
      deviceId:
        cookieSessionUser !== undefined && cookieSessionUser !== null
          ? cookieSessionUser
          : uuid.v4(),
      deviceName:
        (isMobile ? mobileVendor + ' ' + mobileModel : browserName) +
        ', IP: ' +
        window.sessionStorage.getItem('ipAddress'),
      deviceSO: osName + ' ' + osVersion,
      deviceModel: isMobile
        ? mobileModel + ', ' + browserName + ' ' + fullBrowserVersion
        : browserName + ' ' + fullBrowserVersion,
      deviceStatus: true,
      userName: userService.getUserName(),
      source: 'DOLLARBTC',
    };
    userService
      .addDeviceToUser(body)
      .then((resp) => {
        ////////console.log(resp);
        if (resp.data.payload) {
          //////////console.log("Agregado el device");
          cookies.set('SessionUserDevice', body.deviceId, {
            path: '/',
            expires: expiration,
          });
          let devices = JSON.parse(window.sessionStorage.getItem('devices'));
          delete body.userName;
          body.deviceAtDate = new Date().getTime();
          if (devices !== null && devices !== undefined) {
            devices.push(body);
          } else {
            devices = [];
            devices.push(body);
          }
          window.sessionStorage.setItem('devices', JSON.stringify(devices));
          this.setState({
            resultUpdatingMessage: 'login.successUpdating.addDevice',
            successUpdate: true,
          });
          setTimeout(() => {
            this.setState({
              resultUpdatingMessage: '',
              loadingButtons: false,
              contentModal: '',
              currentDeviceStatus: false,
              successUpdate: false,
              showModal: false,
            });
            this.setState({ readyToRedirect: true });
          }, 3000);
        } else {
          if (resp.data.errors.length > 0) {
            if (resp.data.errors[0].code === 55) {
              //////////console.log("ALREADY DEVICE IN USER");
              this.setState({
                resultUpdatingMessage: 'login.errors.deviceInUser',
                errorUpdatingDevice: true,
              });
              setTimeout(() => {
                this.setState({
                  resultUpdatingMessage: '',
                  loadingButtons: false,
                  contentModal: '',
                  currentDeviceStatus: false,
                  errorUpdatingDevice: false,
                  showModal: false,
                });
                this.setState({ readyToRedirect: true });
              }, 3000);
            } else if (resp.data.errors[0].code === 32) {
              //////////console.log("USER NOT FOUND");
              this.setState({
                resultUpdatingMessage: 'login.errors.userNotFound',
                errorUpdatingDevice: true,
              });
              setTimeout(() => {
                this.setState({
                  resultUpdatingMessage: '',
                  loadingButtons: false,
                  contentModal: '',
                  currentDeviceStatus: false,
                  errorUpdatingDevice: false,
                  showModal: false,
                });
                this.setState({ readyToRedirect: true });
              }, 3000);
            }
          } else {
            //////////console.log("Ha ocurrido un error inesperado");
            this.setState({
              resultUpdatingMessage: 'login.errors.unexpectedError',
              errorUpdatingDevice: true,
            });
            setTimeout(() => {
              this.setState({
                resultUpdatingMessage: '',
                loadingButtons: false,
                contentModal: '',
                currentDeviceStatus: false,
                errorUpdatingDevice: false,
                showModal: false,
              });
              this.setState({ readyToRedirect: true });
            }, 3000);
          }
        }
      })
      .catch((error) => {
        ////////console.log(error);
        this.setState({
          resultUpdatingMessage: 'login.errors.unexpectedError',
          errorUpdatingDevice: true,
        });
        setTimeout(() => {
          this.setState({
            resultUpdatingMessage: '',
            loadingButtons: false,
            contentModal: '',
            currentDeviceStatus: false,
            errorUpdatingDevice: false,
            showModal: false,
          });

          this.setState({ readyToRedirect: true });
        }, 3000);
      });
  }
  updateBrowserToUser() {
    let devices = JSON.parse(window.sessionStorage.getItem('devices'));
    let currentDevice = cookies.get('SessionUserDevice');
    let deviceToUpdate = devices.filter((device) => {
      return device.deviceId === currentDevice;
    })[0];
    if (deviceToUpdate !== undefined) {
      deviceToUpdate.deviceStatus = true;
      deviceToUpdate.userName = userService.getUserName();
      userService
        .updateDeviceToUser(deviceToUpdate)
        .then((res) => {
          //////////console.log(res);
          if (res.data.payload) {
            devices.map((device) => {
              if (device.deviceId === currentDevice) {
                device.deviceStatus = true;
              }
            });
            window.sessionStorage.setItem('devices', JSON.stringify(devices));
            this.setState({
              resultUpdatingMessage: 'login.successUpdating.updateDevice',
              successUpdate: true,
            });
            setTimeout(() => {
              this.setState({
                resultUpdatingMessage: '',
                loadingButtons: false,
                contentModal: '',
                currentDeviceStatus: '',
                successUpdate: false,
                showModal: false,
              });

              this.setState({ readyToRedirect: true });
            }, 3000);
          }
        })
        .catch((error) => {
          ////////console.log(error);
          this.setState({
            resultUpdatingMessage: 'login.errors.unexpectedError',
            errorUpdatingDevice: true,
          });
          setTimeout(() => {
            this.setState({
              resultUpdatingMessage: '',
              loadingButtons: false,
              contentModal: '',
              currentDeviceStatus: '',
              errorUpdatingDevice: false,
              showModal: false,
            });
            this.setState({ readyToRedirect: true });
          }, 3000);
        });
    }
  }
  updateUsersDevices() {
    let isActive = this.containCurrentDevice();
    if (isActive === 'NOT_FOUND') {
      this.setState({
        showModal: true,
        contentModal: 'login.modalUpdateDevice.contentAdd',
        currentDeviceStatus: isActive,
      });
    } else if (isActive === 'DEVICE_INACTIVE') {
      this.setState({
        showModal: true,
        contentModal: 'login.modalUpdateDevice.contentUpdate',
        currentDeviceStatus: isActive,
      });
    } else {
      //////////console.log("not device to add");
      this.setState({ readyToRedirect: true });
    }
  }
  readUrlWhitParams() {
    let query = parse(window.location.search);
    let keys = Object.keys(query);
    if (keys.length === 0) {
      this.setState({ varlog: false });
    } else {
      let tokenUrl = '';
      let typeOffer = '';
      if (query.offerKey !== undefined) {
        //console.log('por el normal');
        tokenUrl = query.offerKey;
        typeOffer = 'offerKey';
      } else if (query.brokerOfferKey !== undefined) {
        //console.log('por el broker');
        tokenUrl = query.brokerOfferKey;
        typeOffer = 'brokerOfferKey';
      }
      if (tokenUrl !== undefined && tokenUrl !== ' ' && tokenUrl !== null) {
        this.setState({
          tokenurl: tokenUrl,
          varlog: true,
          typeOffer: typeOffer,
        });
      }
    }
  }
  get2FPreference() {
    userService
      .preferedUserSendCodeTwoFactor()
      .then((resp) => {
        this.setState({ factorPrefered: true });
        if (
          resp.data.payload !== false &&
          resp.data.payload !== null &&
          resp.data.payload !== undefined
        ) {
          window.sessionStorage.setItem('2FactorPrefered', resp.data.payload);
        } else {
          //console.log('error ');
          this.setState({ factorPrefered: true });
        }
      })
      .catch((error) => {
        //  //console.log(error);
      });
  }
  containCurrentDevice() {
    let devices;
    let found = 'NOT_FOUND';
    devices = JSON.parse(window.sessionStorage.getItem('devices'));
    let currentDevice = cookies.get('SessionUserDevice');
    if (devices !== undefined && devices !== null) {
      if (currentDevice !== undefined) {
        devices.forEach((device) => {
          if (device.deviceId === currentDevice) {
            if (device.deviceStatus) found = 'DEVICE_ACTIVE';
            else found = 'DEVICE_INACTIVE';
          }
        });
      }
    }
    return found;
  }
  closeModalDevices() {
    this.setState({
      errorUpdatingDevice: true,
      resultUpdatingMessage: 'login.errors.deviceNotAllowedByUser',
    });
    setTimeout(() => {
      this.setState({
        showModal: false,
        errorUpdatingDevice: false,
        resultUpdatingMessage: '',
        loadingButtons: false,
        currentDeviceStatus: '',
      });
      userService.logout();
      if (this.state.varlog === true) {
        window.location.href =
          '/?' + this.state.typeOffer + '=' + this.state.tokenurl;
      } else {
        window.location.href = '/';
      }
    }, 2000);
  }
  acceptUpdateModifications() {
    this.setState({
      loadingButtons: true,
    });
    if (this.state.currentDeviceStatus === 'NOT_FOUND')
      this.addNewBrowserToUser();
    else if (this.state.currentDeviceStatus === 'DEVICE_INACTIVE')
      this.updateBrowserToUser();
  }
  handlePrefit(e, data) {
    this.setState({ countryCode: data.value });
  }
  handleRegistryCompany() {
    this.setState({ company: !this.state.company });
  }
  handleConditions(e) {
    if (this.state.conditions === 'false') {
      this.setState({ conditions: 'true' });
    } else {
      this.setState({ conditions: 'false' });
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
  async updateDataExistInUser(user, field, value) {
    let body = {
      userName: user,
      fieldName: field,
      fieldValue: value,
    };
    try {
      let response = await userService.updateUserData(body);

      if (response.data !== 'OK') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  async updateDataInUser(user, field, value) {
    let body = {
      userName: user,
      fieldName: field,
      fieldValue: value,
    };
    try {
      let response = await userService.addDataUserAsync(body);
      if (response.data !== 'OK') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  handleModalClose() {
    this.setState({ viewModalSuccess: false }, () => {
      window.sessionStorage.setItem('timeLogin', new Date());
      this.setState({ auth: true });
      sessionStorage.setItem('auth', true);
      window.location.href = '/';
    });
  }
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  render() {
    let t = this.state.translator;
    let resultPostMessage = (
      <div>
        {t('registration.modalResult.resultPost.headerComplete')}
        <List bulleted>
          <List.Item>
            {t('registration.modalResult.resultPost.items.line1')}
          </List.Item>
          <List.Item>
            {t('registration.modalResult.resultPost.items.line2')}
          </List.Item>
          <List.Item>
            {t('registration.modalResult.resultPost.items.line3')}
          </List.Item>
          <List.Item>
            {t('registration.modalResult.resultPost.items.line4')}
          </List.Item>
          <List.Item>
            {t('registration.modalResult.resultPost.items.line5')}
          </List.Item>
        </List>
        <Message
          warning
          content={t('registration.modalResult.resultPost.warningMessage')}
        />
        <Message
          info
          content={t('registration.modalResult.resultPost.infoMessage')}
        />
      </div>
    );
    let list = [];
    if (this.state.prefit.length > 0) {
      for (let pre of this.state.prefit) {
        if (pre.value !== '') {
          list.push({ text: pre.nombre, value: pre.value, key: pre.iso2 });
        }
      }
    }

    if (this.state.forgotPassword) {
      return <Redirect to='/forgotPassword' />;
    }
    if (this.state.completeAccount) {
      return <Redirect to='/completeAccount' />;
    }
    let message,
      labelPassword,
      labelUser,
      labelPhone,
      errorEmail,
      errornickname,
      labelCountry,
      labelCaptcha,
      labelUpdateDevice,
      individualField,
      errorForm;
    if (this.state.errorNickName) {
      errornickname = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorForm) {
      errorForm = <Message error content={t(this.state.message)} />;
    }
    if (this.state.errorEmail) {
      errorEmail = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.individualField === true) {
      individualField = (
        <Message
          error
          //	header={t("login.errors.individualField")}
          content={t(this.state.message)}
        />
      );
    }
    if (this.state.notauth) {
      message = (
        <Message
          error
          header={t('login.errors.credentials.header')}
          content={t('login.errors.credentials.content')}
        />
      );
      // this.blankErrors("error");
    }
    if (this.state.viewmesage) {
      message = (
        <Message
          error
          header={t('login.errors.credentials.header')}
          content={t('login.errors.credentials.content')}
        />
      );
    }
    if (this.state.viewmesageErrorSession) {
      message = <Message error content={t(this.state.messagetext)} />;
    }
    if (this.state.auth) {
      sessionStorage.setItem('lastSession', new Date().getTime().toString());
      if (this.state.userType !== 'ADMIN') {
        if (this.state.readyToRedirect) {
          if (this.state.varlog) {
            //console.log('entrando por el varlog true');
            window.location.href =
              '/?' + this.state.typeOffer + '=' + this.state.tokenurl;
          } else {
            window.location.href = '/';
          }
        }
      } else {
        if (this.state.readyToRedirect) window.location.href = '/dashboard';
        ////////console.log("entrando por el admin");
      }
      let verificationStatus = {
        A: this.state.userStatusA,
        B: this.state.userStatusB,
        C: this.state.userStatusC,
      };
      window.sessionStorage.setItem(
        'userVerificationStatus',
        JSON.stringify(verificationStatus)
      );
      window.sessionStorage.setItem(
        'userDataDBTC',
        JSON.stringify(this.state.userData)
      );
      window.sessionStorage.setItem('nickname', this.state.userData.nickname);
      window.sessionStorage.setItem('address', this.state.address);
      window.sessionStorage.setItem('userType', this.state.userType);
      window.sessionStorage.setItem(
        'userWallets',
        JSON.stringify(this.state.userWallets)
      );
      if (this.state.retailIds !== null) {
        window.sessionStorage.setItem(
          'retail',
          JSON.stringify(this.state.retailIds)
        );
      }
    } else if (this.state.twoFactor === true) {
      let verificationStatus = {
        A: this.state.userStatusA,
        B: this.state.userStatusB,
        C: this.state.userStatusC,
      };
      window.sessionStorage.setItem(
        'userVerificationStatus',
        JSON.stringify(verificationStatus)
      );
      window.sessionStorage.setItem(
        'userDataDBTC',
        JSON.stringify(this.state.userData)
      );
      sessionStorage.setItem('lastSession', new Date().getTime().toString());
      window.sessionStorage.setItem('address', this.state.address);
      window.sessionStorage.setItem('userType', this.state.userType);
      window.sessionStorage.setItem('nickname', this.state.userData.nickname);
      if (this.state.readyToRedirect) {
        if (this.props.setView !== undefined) {
          this.props.setView('loginTwoFactor');
        }
        window.location.href = '/loginTwoFactor';
      }
      //window.location.href = "/loginTwoFactor";
      //return <Redirect to="/loginTwoFactor" />;
    }
    if (this.state.errorCountry) {
      labelCountry = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorPhone) {
      labelPhone = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorUser) {
      labelUser = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorPassword) {
      labelPassword = (
        <Label basic color='red' pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorCaptcha) {
      labelCaptcha = (
        <div>
          <Message error header='Error' content={t(this.state.message)} />
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
              <a href='https://clients.dollarbtc.com'>
                https://clients.dollarbtc.com
              </a>
            </Message.Content>
          </Message>
          <Divider hidden />
        </div>
      );
    }
    if (this.state.errorUpdatingDevice) {
      labelUpdateDevice = (
        <Message error content={t(this.state.resultUpdatingMessage)} />
      );
    }
    if (this.state.successUpdate) {
      labelUpdateDevice = (
        <Message success content={t(this.state.resultUpdatingMessage)} />
      );
    }
    return (
      <div>
        {this.state.viewCompleteAccount && (
          <div>
            <Responsive minWidth={992}>
              <Grid columns='equal'>
                <Grid.Column />
                <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                  <Container>
                    <Segment color='orange' textAlign='left'>
                      <div />
                      <Header
                        as='h4'
                        className='titleComponent'
                        textAlign='center'
                      >
                        {t('login.compleAccount2')}
                      </Header>
                      <Container className='container-form'>
                        <Form
                          error
                          unstackable
                          loading={this.state.load}
                          onSubmit={this.handleRegistrer.bind(this)}
                        >
                          <Form.Field>
                            <Form.Input
                              type='email'
                              label={t('registration.form.email')}
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
                          <Grid>
                            <Grid.Row>
                              {/* <Grid.Column /> */}
                              <Grid.Column textAlign='center'>
                                <Form.Field>
                                  <Form.Checkbox
                                    label={t('registration.form.companyText')}
                                    onChange={this.handleRegistryCompany.bind(
                                      this
                                    )}
                                    checked={this.state.company}
                                  />
                                </Form.Field>
                              </Grid.Column>
                              {/* <Grid.Column /> */}
                            </Grid.Row>
                          </Grid>
                          <Header as='h5'>
                            {window.innerWidth > 429 && (
                              <Grid>
                                {/* <Grid.Row> */}
                                {/* <Grid.Column width={3} /> */}
                                <Grid.Column style={{ marginLeft: '100px' }}>
                                  <Form.Group inline>
                                    <Form.Checkbox
                                      onChange={this.handleConditions.bind(
                                        this
                                      )}
                                      checked={this.state.conditions === 'true'}
                                    />
                                    <Form.Field>
                                      <label>
                                        {t('registration.form.terms.first')}
                                        <a
                                          href='#'
                                          onClick={this.onClickTermsAndConditions.bind(
                                            this
                                          )}
                                        >
                                          {t('registration.form.terms.second')}
                                        </a>
                                      </label>
                                    </Form.Field>
                                  </Form.Group>
                                </Grid.Column>
                                {/* <Grid.Column width={3} /> */}
                                {/* </Grid.Row> */}
                              </Grid>
                            )}

                            {window.innerWidth <= 429 && (
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column textAlign='center'>
                                    <Form.Group>
                                      <Form.Field>
                                        <Form.Checkbox
                                          onChange={this.handleConditions.bind(
                                            this
                                          )}
                                          checked={
                                            this.state.conditions === 'true'
                                          }
                                        />
                                        <label>
                                          {t('registration.form.terms.first')}
                                          <a
                                            href='#'
                                            onClick={this.onClickTermsAndConditions.bind(
                                              this
                                            )}
                                          >
                                            {t(
                                              'registration.form.terms.second'
                                            )}
                                          </a>
                                        </label>
                                      </Form.Field>
                                    </Form.Group>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            )}

                            <Divider hidden />
                            {errorForm}
                            <Grid>
                              <Grid.Column textAlign='center'>
                                <Form.Button
                                  // style={{ marginLeft: "130px" }}
                                  color='blue'
                                  size='large'
                                  content={t('registration.signup')}
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
              <Grid columns='equal'>
                <Grid.Column />
                <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                  <Container>
                    {/* <Segment color="orange" textAlign="left"> */}
                    <div />
                    <Header
                      as='h4'
                      className='titleComponent'
                      textAlign='center'
                    >
                      {/* {t("registration.completeAccount")} */}
                      {t('login.compleAccount2')}
                      {/* {t("login.compleAccount")} */}
                    </Header>
                    <hr style={{ borderColor: '#207ef2' }} />
                    <Divider hidden />
                    <Container className='container-form'>
                      <Form
                        error
                        unstackable
                        loading={this.state.load}
                        onSubmit={this.handleRegistrer.bind(this)}
                      >
                        <Form.Field>
                          <label className='titleComponentMobile'>
                            {t('registration.form.email')}
                          </label>
                          <Form.Input
                            type='email'
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
                        <Header as='h5' textAlign='left'>
                          <Grid>
                            <Grid.Row columns={2}>
                              <Grid.Column mobile={2}>
                                <Form.Field textAlign='left'>
                                  <Form.Checkbox
                                    style={{
                                      borderStyle: 'groove',
                                      borderColor: 'grey',
                                    }}
                                    onChange={this.handleRegistryCompany.bind(
                                      this
                                    )}
                                    checked={this.state.company}
                                  />
                                </Form.Field>
                              </Grid.Column>
                              <Grid.Column mobile={12}>
                                <Form.Field>
                                  <label className='titleComponentMobile'>
                                    {t('registration.form.companyText')}
                                  </label>
                                </Form.Field>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Header>
                        <Header as='h5' textAlign='left'>
                          {window.innerWidth <= 429 && (
                            <Grid>
                              <Grid.Row columns={2}>
                                <Grid.Column mobile={2}>
                                  <Form.Field textAlign='left'>
                                    <Form.Checkbox
                                      style={{
                                        borderStyle: 'groove',
                                        borderColor: 'grey',
                                      }}
                                      onChange={this.handleConditions.bind(
                                        this
                                      )}
                                      checked={this.state.conditions === 'true'}
                                    />
                                  </Form.Field>
                                </Grid.Column>
                                <Grid.Column mobile={12}>
                                  <Form.Field>
                                    <label className='titleComponentMobile'>
                                      {t('registration.form.terms.first')}
                                      <a
                                        href='#'
                                        onClick={this.onClickTermsAndConditions.bind(
                                          this
                                        )}
                                      >
                                        {t('registration.form.terms.second')}
                                      </a>
                                    </label>
                                  </Form.Field>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          )}

                          <Divider hidden />
                          {errorForm}
                          <div className='text-center'>
                            <Form.Button
                              color='blue'
                              size='large'
                              style={{
                                borderRadius: '40px/40px',
                                height: '50px',
                                width: '200px',
                              }}
                              content={t('registration.signup')}
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
          </div>
        )}
        {!this.state.viewCompleteAccount && (
          <div>
            <Responsive minWidth={992}>
              <Grid columns='equal'>
                <Grid.Column />
                <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                  <Container>
                    <Segment color='orange' textAlign='left'>
                      <div />
                      <Header
                        as='h4'
                        className='titleComponent'
                        textAlign='center'
                      >
                        {t('login.header')}
                      </Header>
                      <Container className='container-form'>
                        <Form
                          onSubmit={this.findUser}
                          loading={this.state.loadForm}
                          error
                          unstackable
                        >
                          <Segment>
                            <Form.Field>
                              <label>{t('login.form.email')}</label>
                              <Form.Input
                                placeholder='test@mail.com'
                                onChange={this.handleUser.bind(this)}
                                type='text'
                                value={this.state.user}
                              />
                              {labelUser}
                            </Form.Field>

                            <Form.Field>
                              <Divider horizontal>
                                {t('login.form.optionsUser')}
                              </Divider>
                            </Form.Field>
                            {/* <div className='text-center' style={{ marginTop: 20 }}>
													<Button
														basic
														color='blue'
														onClick={this.handleUserMC.bind(this)}>
														<span style={{ fontSize: "11px" }}>
															{t("login.form.userMoney")}
														</span>
													</Button>
												</div> */}
                            <Form.Group>
                              <Form.Field width={6}>
                                <Form.Select
                                  label={t(
                                    'profile.updateProfile.form.placeholderCountry'
                                  )}
                                  required
                                  selection
                                  search={true}
                                  options={list}
                                  value={this.state.countryCode}
                                  placeholder={t(
                                    'profile.updateProfile.form.placeholderCountry'
                                  )}
                                  onChange={this.handlePrefit.bind(this)}
                                  onSearchChange={this.handleSearchChange.bind(
                                    this
                                  )}
                                />
                                {labelCountry}
                              </Form.Field>
                              <Form.Field width={1} />
                              <Form.Field
                                required
                                width={9}
                                style={{ marginLeft: '10px' }}
                              >
                                <label>
                                  {t(
                                    'buy.formVerificationPhone.formRequestCode.phone'
                                  )}
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
                                  placeholder='12345678'
                                  onChange={(e) => {
                                    const telNo = e.target.value;
                                    const re2 = /^[0-9]*$/;
                                    if (telNo === '' || re2.test(telNo)) {
                                      this.setState({ phone: e.target.value });
                                    }
                                  }}
                                  value={this.state.phone}
                                  type='text'
                                />
                                {labelPhone}
                              </Form.Field>
                            </Form.Group>

                            {individualField}
                          </Segment>

                          {this.state.iamUserMc === true && (
                            <div
                              className='text-center'
                              style={{ marginTop: 20 }}
                            >
                              <Button
                                basic
                                color='blue'
                                onClick={this.handleUserMC.bind(this)}
                              >
                                <span style={{ fontSize: '11px' }}>
                                  {t('login.form.userMoney')}
                                </span>
                              </Button>
                            </div>
                          )}

                          <Form.Field>
                            <label>{t('login.form.password')}</label>
                            <Input
                              icon={
                                this.state.hidden ? (
                                  <Icon
                                    name='eye'
                                    circular
                                    link
                                    onClick={this.toggleShow}
                                  />
                                ) : (
                                  <Icon
                                    name='eye slash'
                                    circular
                                    link
                                    onClick={this.toggleShow}
                                  />
                                )
                              }
                              type={this.state.hidden ? 'password' : 'text'}
                              value={this.state.password}
                              onChange={this.handlePassword.bind(this)}
                            />
                            {labelPassword}
                          </Form.Field>
                          <Segment
                            basic
                            textAlign='center'
                            verticalAlign='middle'
                            style={{ textAlign: '-webkit-center' }}
                          >
                            <p>{t('login.form.captcha')}</p>
                            <Grid>
                              <Grid.Row columns={1} centered>
                                <Grid.Column
                                  textAlign='center'
                                  verticalAlign='middle'
                                  width={window.innerWidth <= 394 ? 5 : 0}
                                >
                                  <ReCAPTCHA
                                    id='reca'
                                    ref={recapcha}
                                    //badge="inline"
                                    size={
                                      window.innerWidth < 394
                                        ? 'compact'
                                        : 'normal'
                                    }
                                    style={{
                                      marginLeft:
                                        window.innerWidth < 394 ? 0 : 70,
                                    }}
                                    sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
                                    onChange={this.handleCaptcha}
                                  />
                                </Grid.Column>
                                <Grid.Column />
                              </Grid.Row>
                            </Grid>
                            <Segment
                              basic
                              style={{ textAlign: '-webkit-center' }}
                            >
                              {message}
                              {labelCaptcha}
                              <Form.Button
                                type='submit'
                                color='blue'
                                size='large'
                              >
                                {t('login.header')}
                              </Form.Button>
                            </Segment>
                          </Segment>
                        </Form>
                        <div className='text-center'>
                          <Button
                            basic
                            onClick={this.handleForgotPassword.bind(this)}
                          >
                            <span style={{ fontSize: '11px' }}>
                              {t('login.form.forgotPassword')}
                            </span>
                          </Button>
                        </div>
                        {/* <div className='text-center' style={{ marginTop: 20 }}>
											<Button basic onClick={this.handleUserMC.bind(this)}>
												<span style={{ fontSize: "11px" }}>
													{t("login.form.userMoney")}
												</span>
											</Button>
										</div> */}
                      </Container>
                    </Segment>
                  </Container>
                </Grid.Column>
                <Grid.Column />
              </Grid>
              <Modal
                open={this.state.showModal}
                onClose={this.closeModalDevices}
              >
                <Modal.Header>
                  {t('login.modalUpdateDevice.header')}
                </Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    {t(this.state.contentModal)}
                    {(this.state.errorUpdatingDevice ||
                      this.state.successUpdate) &&
                      labelUpdateDevice}
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={this.closeModalDevices}
                    disabled={this.state.loadingButtons}
                    color='red'
                  >
                    {t('login.modalUpdateDevice.buttonNo')}
                  </Button>
                  <Button
                    onClick={this.acceptUpdateModifications}
                    disabled={this.state.loadingButtons}
                    loading={this.state.loadingButtons}
                    color='green'
                  >
                    {t('login.modalUpdateDevice.buttonYes')}
                  </Button>
                </Modal.Actions>
              </Modal>
            </Responsive>
            <Responsive minWidth={0} maxWidth={991}>
              <Grid columns='equal'>
                <Grid.Column />
                <Grid.Column largeScreen={10} mobile={16} tablet={14}>
                  <Container>
                    {/* <Segment  textAlign="left"> */}
                    <div />
                    <Header
                      as='h4'
                      className='titleComponent'
                      textAlign='center'
                    >
                      {t('login.header')}
                    </Header>
                    <hr style={{ borderColor: '#207ef2' }} />
                    <Divider hidden />
                    <Container className='container-form'>
                      <Form
                        onSubmit={this.findUser}
                        loading={this.state.loadForm}
                        error
                        unstackable
                      >
                        <Segment>
                          {/* <Form.Group> */}

                          <Form.Field>
                            <label className='titleComponentMobile'>
                              {t('login.form.email')}
                            </label>
                            <Form.Input
                              placeholder=''
                              value={this.state.user}
                              onChange={this.handleUser.bind(this)}
                              type='text'
                            />
                            {labelUser}
                          </Form.Field>
                          <Form.Field>
                            <Divider horizontal>
                              {t('login.form.optionsUser')}
                            </Divider>
                          </Form.Field>

                          <Form.Field>
                            <label className='titleComponentMobile'>
                              {t(
                                'profile.updateProfile.form.placeholderCountry'
                              )}
                            </label>
                            <Form.Select
                              selection
                              search={true}
                              options={list}
                              value={this.state.countryCode}
                              placeholder={t(
                                'profile.updateProfile.form.placeholderCountry'
                              )}
                              onChange={this.handlePrefit.bind(this)}
                              onSearchChange={this.handleSearchChange.bind(
                                this
                              )}
                            />
                            {labelCountry}
                          </Form.Field>
                          {/* //	<Form.Field width={1}></Form.Field> */}
                          <Form.Field>
                            <label className='titleComponentMobile'>
                              {t(
                                'buy.formVerificationPhone.formRequestCode.phone'
                              )}
                            </label>

                            <Form.Input
                              placeholder='12345678'
                              onChange={(e) => {
                                const telNo = e.target.value;
                                const re2 = /^[0-9]*$/;
                                if (telNo === '' || re2.test(telNo)) {
                                  this.setState({ phone: e.target.value });
                                }
                              }}
                              value={this.state.phone}
                              type='text'
                            />
                            {labelPhone}
                          </Form.Field>
                          {/* </Form.Group> */}
                          {individualField}
                        </Segment>

                        {this.state.iamUserMc === true && (
                          <div
                            className='text-center'
                            style={{ marginTop: 20 }}
                          >
                            <Button
                              basic
                              color={'blue'}
                              as={Link}
                              to='/completeAccount'
                              onClick={this.handleUserMC.bind(this)}
                              style={{
                                borderRadius: '40px/40px',
                                height: '42px',
                                width: '200px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontFamily: 'Montserrat',
                                }}
                              >
                                {t('login.form.userMoney')}
                              </span>
                            </Button>
                            <Divider hidden />
                          </div>
                        )}
                        <Form.Field>
                          <label className='titleComponentMobile'>
                            {t('login.form.password')}
                          </label>
                          <Input
                            icon={
                              this.state.hidden ? (
                                <Icon
                                  name='eye'
                                  circular
                                  link
                                  onClick={this.toggleShow}
                                />
                              ) : (
                                <Icon
                                  name='eye slash'
                                  circular
                                  link
                                  onClick={this.toggleShow}
                                />
                              )
                            }
                            type={this.state.hidden ? 'password' : 'text'}
                            value={this.state.password}
                            onChange={this.handlePassword.bind(this)}
                          />
                          {labelPassword}
                        </Form.Field>
                        <Segment
                          basic
                          textAlign='center'
                          verticalAlign='middle'
                          style={{ textAlign: '-webkit-center' }}
                        >
                          <p className='titleComponentMobile'>
                            {t('login.form.captcha')}
                          </p>
                          <Grid>
                            <Grid.Row columns={1} centered>
                              <Grid.Column
                                textAlign='center'
                                verticalAlign='middle'
                                width={window.innerWidth <= 394 ? 5 : 0}
                              >
                                <ReCAPTCHA
                                  id='reca'
                                  ref={recapcha}
                                  //badge="inline"
                                  size={
                                    window.innerWidth < 394
                                      ? 'compact'
                                      : 'normal'
                                  }
                                  style={{
                                    marginLeft:
                                      window.innerWidth < 394 ? 0 : 70,
                                  }}
                                  sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
                                  onChange={this.handleCaptcha}
                                />
                              </Grid.Column>
                              <Grid.Column />
                            </Grid.Row>
                          </Grid>

                          {message}
                          {labelCaptcha}
                        </Segment>
                        <div className='text-center'>
                          <Form.Button
                            type='submit'
                            color='blue'
                            size='large'
                            style={{
                              borderRadius: '40px/40px',
                              height: '50px',
                              width: '200px',
                            }}
                          >
                            {t('login.header')}
                          </Form.Button>
                        </div>
                        <Divider hidden />
                        <div className='text-center'>
                          <Button
                            basic
                            // color="blue"
                            onClick={this.handleForgotPassword.bind(this)}
                            style={{
                              borderRadius: '40px/40px',
                              height: '50px',
                              width: '200px',
                            }}
                          >
                            <span style={{ fontSize: '11px' }}>
                              {t('login.form.forgotPassword')}
                            </span>
                          </Button>
                        </div>
                        {/* <div className='text-center' style={{ marginTop: 20 }}>
											<Button
												basic
												as={Link}
												to='/completeAccount'
												onClick={this.handleUserMC.bind(this)}
												style={{
													borderRadius: "40px/40px",
													height: "42px",
													width: "200px",
												}}>
												<span
													style={{
														fontSize: "11px",
														fontFamily: "Montserrat",
													}}>
													{t("login.form.userMoney")}
												</span>
											</Button>
										</div> */}
                      </Form>
                    </Container>
                    {/* </Segment> */}
                  </Container>
                </Grid.Column>
                <Grid.Column />
              </Grid>
              <Modal
                open={this.state.showModal}
                onClose={this.closeModalDevices}
              >
                <Modal.Header>
                  {t('login.modalUpdateDevice.header')}
                </Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    {t(this.state.contentModal)}
                    {(this.state.errorUpdatingDevice ||
                      this.state.successUpdate) &&
                      labelUpdateDevice}
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={this.closeModalDevices}
                    disabled={this.state.loadingButtons}
                    color='red'
                  >
                    {t('login.modalUpdateDevice.buttonNo')}
                  </Button>
                  <Button
                    onClick={this.acceptUpdateModifications}
                    disabled={this.state.loadingButtons}
                    loading={this.state.loadingButtons}
                    color='green'
                  >
                    {t('login.modalUpdateDevice.buttonYes')}
                  </Button>
                </Modal.Actions>
              </Modal>
            </Responsive>
          </div>
        )}
        <Modal open={this.state.seeTermsAndConditions}>
          <Modal.Header>{t('registration.modalTerms.header')}</Modal.Header>
          <Modal.Content>
            <p>{t('registration.modalTerms.content.termsAndConditions')}</p>
            <h4>{t('registration.modalTerms.content.item1.title')}</h4>
            <p>{t('registration.modalTerms.content.item1.content')}</p>
            <h4>{t('registration.modalTerms.content.item2.title')}</h4>
            <p>{t('registration.modalTerms.content.item2.content')}</p>
            <h4>{t('registration.modalTerms.content.item3.title')}</h4>
            <p>{t('registration.modalTerms.content.item3.content')}</p>
            <h4>{t('registration.modalTerms.content.item4.title')}</h4>
            <p>{t('registration.modalTerms.content.item4.content')}</p>
            <h4>{t('registration.modalTerms.content.item5.title')}</h4>
            <p>{t('registration.modalTerms.content.item5.content')}</p>
            <h4>{t('registration.modalTerms.content.item6.title')}</h4>
            <p>{t('registration.modalTerms.content.item6.content')}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='blue' onClick={this.handleConditions.bind(this)}>
              {t('registration.modalTerms.agreeButton')}
            </Button>
            <Button
              onClick={this.onClickCloseModalTermsAndConditions.bind(this)}
            >
              {t('registration.modalTerms.closeButton')}
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.viewModalSuccess}>
          <Modal.Header>
            {t('registration.modalResult.headerSuccess')}
          </Modal.Header>
          <Modal.Content>
            <p>{resultPostMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='blue' onClick={this.handleModalClose.bind(this)}>
              {t('registration.modalResult.closeButton')}
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(Login);
