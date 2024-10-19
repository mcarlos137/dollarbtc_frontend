import React, { Component } from 'react';
import '../../Admin.css';
import {
  Menu,
  Segment,
  Container,
  Grid,
  Form,
  Button,
  Divider,
  Icon,
  Header,
  Loader,
  Dimmer,
  Modal,
  Popup,
  Image,
  Select,
  Message,
  Label,
  Input,
  Feed,
  TextArea,
  List,
} from 'semantic-ui-react';
import avatarNull from '../../../../img/avatarNull.png';
import Sockette from 'sockette';
import ReactTable from 'react-table';
import config from '../../../../services/config';
import axios from 'axios';
import userService from '../../../../services/user';
import otc from '../../../../services/otc';
import uuid from 'uuid';
import FormData from 'form-data';
import _ from 'underscore';
import attachments from '../../../../services/attachments';
import { Document, Page } from 'react-pdf';
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;

class UserVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      userVerificationTable: [],
      modalVerify: false,
      addressUserToVerify: '',
      emailUserToVerify: '',
      otherDocumentsToVerify: [],
      statusToSearch: 'PROCESSING',
      showingOnTable: 'PROCESSING',
      showVerificationTable: false,
      showModalAttachment: false,
      statusUserToVerify: '',
      userImage: {},
      typeUserToVerify: '',
      environmentUserToVerify: '',
      operationAccountUserToVerify: '',
      userInfo: {},
      userToVerify: null,
      modalEditUser: false,
      activeItemEditUser: 'addData',
      toEditDataName: null,
      toEditDataValue: null,
      addDataFormKey: Math.random(),
      failAddInfo: false,
      messageAddInfo: '',
      isPdf: false,
      loadEditUser: false,
      dataNameToEditOptions: [],
      otherDocumentsToShow: [],
      loadingNewFile: false,
      selectedFile: null,
      keyFile: Math.random(),
      genderOptions: [
        { key: 'male', value: 'male', text: 'Masculino' },
        { key: 'female', value: 'female', text: 'Femenino' },
      ],
      documentTypeOptions: [
        { key: 'dni', value: 'dni', text: 'DNI' },
        { key: 'id', value: 'id', text: 'ID' },
        { key: 'cedula', value: 'cedula', text: 'Cédula' },
        { key: 'passport', value: 'passport', text: 'Pasaporte' },
        { key: 'other', value: 'other', text: 'Otro' },
      ],
      identityURLToVerify: null,
      bankURLToVerify: null,
      selfURLToVerify: null,
      locationURLToVerify: null,
      expandedRow: null,
      messageToSend: '',
      loadingSendButton: false,
      key: Math.random(),
      paymentVerificationSelectedFile: null,
      oldOperationsMessages: [],
      showOperationMessages: false,
      expanded: {},
      paymentInfoToConfirm: '',
      paymentInfoReady: false,
      newIdMessage: false,
      idsNewMessageIcon: [],
      allMessagesSocket: null,
      showStatusVerify: false,
      urlAttachment: '',
    };
    this.typeOperation = React.createRef();
  }

  sendNotificationSubscribe = () => {
    let subscribe = {
      method: 'getAdminOperationMessages',
      params: {
        maxQuantity: 10,
        websocketKey: window.sessionStorage.getItem('websocketKey'),
      },
    };
    try {
      this.state.allMessagesSocket.json(subscribe);
    } catch (e) {}
  };
  openSocketAllMessages = () => {
    this.setState({
      allMessagesSocket: new Sockette(URL_WEBSOCKET_DBTC + '/otc', {
        onopen: (e) => this.sendNotificationSubscribe(),
        onmessage: (e) => this.showNotification(e.data),
      }),
    });
  };
  showNotification = (value) => {
    let keys = Object.keys(value);
    if (keys.length > 1) {
      let result = JSON.parse(value);
      var newAdminMessages = [];
      newAdminMessages = result.params.data;
      if (newAdminMessages.length > 0) {
        for (var i = 0; i < newAdminMessages.length; i++) {
          this.showNewMessageIcon(newAdminMessages[i].id);
        }
      }
    }
  };
  showNewMessageIcon = (idToShow) => {
    var newId = idToShow;
    var idsIcons = this.state.idsNewMessageIcon;
    idsIcons.push(newId);
    this.setState({ idsNewMessageIcon: idsIcons, newIdMessage: true });
  };
  handleMessage = (e) => {
    this.setState({ messageToSend: e.target.value });
  };
  focusRowExpanded = () => {
    if (
      this.typeOperation !== null &&
      this.typeOperation !== undefined &&
      this.typeOperation.current !== null &&
      this.typeOperation.current !== undefined
    ) {
      this.typeOperation.current.focus();
    }
  };
  socketReady = (operationId, webSocketId) => {
    let wsId = null;
    if (webSocketId === null || webSocketId === '') {
      wsId = uuid.v4();
      window.sessionStorage.setItem('otcOperationSocketId', wsId);
    } else {
      wsId = webSocketId;
    }
    let men = {
      method: 'getOperationMessages',
      params: {
        id: operationId,
        side: 'Admin',
        websocketKey: wsId,
      },
    };
    try {
      this.state.socket.json(men);
    } catch (e) {
      //console.log(e)
    }
    setTimeout(() => {
      this.setState({
        showOperationMessages: true,
      });
    }, 1500);
  };
  reconnectSocket(e, operationId) {
    let ws = window.sessionStorage.getItem('otcOperationSocketId');
    this.socketReady(e, operationId, ws);
  }
  async getOperationsAttachment(operationId, fileName) {
    let result;
    try {
      const response = await attachments.getOtcAttachment(
        operationId,
        fileName
      );
      let blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      let image = URL.createObjectURL(blob);
      result = image;
      //console.log(result)
    } catch (error) {
      //console.log(error)
      result = '';
    }
    return result;
  }
  async handleValue(value, operationId) {
    let result = JSON.parse(value);
    if (result.method === 'oldOperationMessages') {
      var oldMessages = [];
      oldMessages = result.params.data;
      for (let message of oldMessages) {
        if (message.attachment !== undefined) {
          message.urlFile = await this.getOperationsAttachment(
            operationId,
            message.attachment
          );
        }
      }
      oldMessages.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      //console.log(oldMessages);
      this.setState({ oldOperationsMessages: oldMessages }, () => {
        this.setState({ showOperationMessages: true });
      });
    } else if (result.method === 'currentOperationMessages') {
      var newMessages = result.params.data;
      var messagesToAdd = [];
      messagesToAdd = this.state.oldOperationsMessages;
      // if (newMessages !== null) {
      if (newMessages.length > 0 && newMessages !== null) {
        for (var newMess of newMessages) {
          if (newMess.attachment !== undefined && newMess.attachment !== null) {
            newMess.urlFile = await this.getOperationsAttachment(
              operationId,
              newMess.attachment
            );
          }
          messagesToAdd.push(newMess);
        }
        ////console.log(messagesToAdd);
        messagesToAdd.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        this.setState({ oldOperationsMessages: messagesToAdd }, () => {
          this.setState({ showOperationMessages: true });
        });
      }
      // }
    }
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
    var actualCountryOfBirthKey;
    var actualCityOfBirthKey;
    var actualFamilyNameKey;
    var actualFamilyEmailKey;
    var actualUserLocalBitcoinKey;
    var actualUserFacebookKey;
    var actualUserAddressKey;
    var otherKeys = [];
    var actualNickName;
    var actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration;
    var actualWallets;
    var actualWalletsMC;
    var actualTokens;
    var isACompany = false;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith('phone') && listKeys[i].search("__") === -1) {
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
      } else if (listKeys[i].startsWith('countryOfBirth')) {
        actualCountryOfBirthKey = listKeys[i];
      } else if (listKeys[i].startsWith('cityOfBirth')) {
        actualCityOfBirthKey = listKeys[i];
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
        actualNickName = listKeys[i];
      } else if (listKeys[i].startsWith('companyName')) {
        actualCompanyName = listKeys[i];
      } else if (listKeys[i].startsWith('companyTypeOfFiscalRecord')) {
        actualCompanyTypeOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyNumberOfFiscalRecord')) {
        actualCompanyNumberOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyYearRegistration')) {
        actualCompanyYearRegistration = listKeys[i];
      } else if (listKeys[i].startsWith('wallets')) {
        actualWallets = listKeys[i];
      } else if (listKeys[i].startsWith('mcWallets')) {
        actualWalletsMC = listKeys[i];
      } else if (listKeys[i].startsWith('otherNotificationTokens')) {
        actualTokens = listKeys[i];
      } else if (
        listKeys[i] !== 'name' &&
        listKeys[i] !== 'masterWalletIds' &&
        listKeys[i] !== 'verification' &&
        !listKeys[i].endsWith('URL') &&
        listKeys[i] !== 'company' &&
        listKeys[i] !== 'wallets' &&
        listKeys[i] !== 'mcWallets'
      ) {
        otherKeys.push(listKeys[i]);
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
      actualCountryOfBirthKey,
      actualCityOfBirthKey,
      actualFamilyNameKey,
      actualFamilyEmailKey,
      actualUserLocalBitcoinKey,
      actualUserFacebookKey,
      actualUserAddressKey,
      actualNickName,
      actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration,
      actualWallets,
      actualTokens,
      'address',
      'operationAccount',
      'environment',
      'type',
      'active',
      'email'
    );
    var allKeys = listActualKeys.concat(otherKeys);
    var modifiedObj = _.pick(allInfo, [allKeys]);
    var normalizeObject = { other: [] };
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
      } else if (key.startsWith('cityOfBirth')) {
        normalizeObject.cityOfBirth = value;
      } else if (key.startsWith('countryOfBirth')) {
        normalizeObject.countryOfBirth = value;
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
      } else if (key.startsWith('companyName')) {
        normalizeObject.companyName = value;
      } else if (key.startsWith('companyTypeOfFiscalRecord')) {
        normalizeObject.companyTypeOfFiscalRecord = value;
      } else if (key.startsWith('companyNumberOfFiscalRecord')) {
        normalizeObject.companyNumberOfFiscalRecord = value;
      } else if (key.startsWith('companyYearRegistration')) {
        normalizeObject.companyYearRegistration = value;
      } else if (key.startsWith('wallets')) {
        normalizeObject.address = Object.values(value.current)[0].address;
      } else if (key.startsWith('mcWallets')) {
        normalizeObject.mcAddress = Object.values(value.current)[0].address;
      } else if (key.startsWith('otherNotificationTokens')) {
        normalizeObject.otherNotificationTokens = value;
      } else if (
        !key.startsWith('paymentId') &&
        !key.startsWith('automaticChange') &&
        !key.startsWith('enableRequestDebitCards') &&
        !key.startsWith('enableOneDepositVerification') &&
		    !key.startsWith('enableActivateGiftCards')
      ) {
        normalizeObject.other.push({
          dataName: key,
          dataValue: value.toString(),
        });
      }
    });
    normalizeObject.isACompany = isACompany;
    return normalizeObject;
  };
  componentDidMount() {
    this.getUserVerifications('PROCESSING');
    window.sessionStorage.setItem('otcOperationSocketId', '');
    window.sessionStorage.setItem('websocketKey', uuid.v4());
    this.showNotification(this.props.state.notificationsAdmin);
    //this.openSocketAllMessages();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.state.unreadAdmin !== nextProps.state.unreadAdmin) {
      this.showNotification(nextProps.state.notificationsAdmin);
    }
  }
  getUserConfig = (username) => {
    this.setState({ showStatusVerify: true, userInfo: {} });
    userService
      .getConfigUserGeneral(username)
      .then(async (resp) => {
        var otherDocuments = [];
        //console.log(resp);
        this.setState({
          addressUserToVerify:
            resp.data.result.address !== undefined
              ? resp.data.result.address
              : '',
          emailUserToVerify:
            resp.data.result.email !== undefined ? resp.data.result.email : '',
          statusUserToVerify: resp.data.result.active,
          typeUserToVerify: resp.data.result.type,
          environmentUserToVerify: resp.data.result.environment,
          operationAccountUserToVerify:
            resp.data.result.operationAccount !== undefined
              ? resp.data.result.operationAccount
              : '',
        });
        this.setState({ showStatusVerify: false });
        Object.entries(resp.data.result).forEach(async ([key, value]) => {
          if (
            key.endsWith('URL') &&
            key !== 'identityURL' &&
            key !== 'bankURL' &&
            key !== 'locationURL' &&
            key !== 'selfURL'
          ) {
            var nameToShow = key.split('URL')[0].replace(/_/g, ' ');

            let valueUrl = await this.getImageToShow(username, value !== undefined ? value : "");
            otherDocuments.push({ name: nameToShow, url: valueUrl });
          }
        });
        var lastUserInfo = this.getActualUserInfo(resp.data.result);
        let identityURL = {};
        let bankURL = {};
        let locationURL = {};
        let selfURL = {};

        identityURL.isPdf =
          resp.data.result.identityURL !== undefined
            ? resp.data.result.identityURL.includes('pdf')
            : '';
        bankURL.isPdf =
          resp.data.result.bankURL !== undefined
            ? resp.data.result.bankURL.includes('pdf')
            : '';
        selfURL.isPdf =
          resp.data.result.selfURL !== undefined
            ? resp.data.result.selfURL.includes('pdf')
            : '';
        locationURL.isPdf =
          resp.data.result.locationURL !== undefined
            ? resp.data.result.locationURL.includes('pdf')
            : '';
        identityURL.file = await this.getImageToShow(
          username,
          resp.data.result.identityURL !== undefined ? resp.data.result.identityURL : ""
        );
        bankURL.file = await this.getImageToShow(
          username,
          resp.data.result.bankURL !== undefined ? resp.data.result.bankURL : ""
        );

        locationURL.file = await this.getImageToShow(
          username,
          resp.data.result.locationURL !== undefined ? resp.data.result.locationURL : ""
        );

        selfURL.file = await this.getImageToShow(
          username,
          resp.data.result.selfURL !== undefined ? resp.data.result.selfURL : ""
        );
        lastUserInfo.name = resp.data.result.name;
      	console.log('locationURL ', locationURL);
        this.setState({
          otherDocumentsToShow: otherDocuments,
          userInfo: lastUserInfo,
          identityURLToVerify: identityURL,
          bankURLToVerify: bankURL,
          selfURLToVerify: selfURL,
          locationURLToVerify: locationURL,
        });
      })
      .catch((error) => {
        this.setState({ showStatusVerify: false });
        console.log(error);
      });
  };
  async getImageToShow(username, fileName) {
    let result = "", type = "";
    if(fileName !== "") {
    if (fileName.includes('pdf')) {
      type = 'application/pdf';
    } else if (fileName.includes('jpg') || fileName.includes('jpeg')) {
      type = 'image/jpg';
    } else if (fileName.includes('png')) {
      type = 'image/png';
    } else {
      type = '';
    }

    try {
      const response = await attachments.getAttachementUser(username, fileName);
      let blob = new Blob([response.data], {
        type: type !== '' ? type : response.headers['content-type'],
      });

      let image = URL.createObjectURL(blob);
      result = image;
    } catch (error) {
      result = '';
    }
  }
    return result;
  }

  openVerifyConfirmModal = (row, username) => {
    this.getUserConfig(username);
    this.setState({
      modalVerify: true,
      userToVerify: row,
    });
  };
  openEditUserModal = (row, username) => {
    //console.log(username);
    this.getUserConfig(username);
    this.setState({
      modalEditUser: true,
    });
  };
  closeEditUserModal = () =>
    this.setState({ modalEditUser: false, activeItemEditUser: 'addData' });
  closeVerifyConfirmModal = () => this.setState({ modalVerify: false });
  makeDataTable = (userVerifications, status) => {
    var userVerification = [];
    for (var i = 0; i < userVerifications.length; i++) {
      var verificationToAdd = {};
      verificationToAdd.date = new Date(userVerifications[i].timestamp);
      if (userVerifications[i].info.includes('Initial verification')) {
        verificationToAdd.info = 'Verificación inicial del usuario';
      } else if (userVerifications[i].info.includes('Verification payment')) {
        verificationToAdd.info = 'Verificación de medio de pago del cliente';
      } else {
        verificationToAdd.info = userVerifications[i].info;
      }
      verificationToAdd.username = userVerifications[i].userName;
      verificationToAdd.userVerificationType =
        userVerifications[i].userVerificationType;
      verificationToAdd.identityURL = userVerifications[i].identityURL;
      verificationToAdd.bankURL = userVerifications[i].bankURL;
      verificationToAdd.locationURL = userVerifications[i].locationURL;
      verificationToAdd.selfURL = userVerifications[i].selfURL;
      if (userVerifications[i].userVerificationType === 'C') {
        verificationToAdd.verificationOperationId =
          userVerifications[i].verificationOperationId;
      } else if (userVerifications[i].userVerificationType === 'D') {
        verificationToAdd.verificationOperationId =
          userVerifications[i].verificationOperationId;
        verificationToAdd.paymentId = userVerifications[i].paymentId;
      }
      verificationToAdd.status = status;
      if(userVerifications[i].numberDocumentIdentity === '25280338-6'){
        console.log('userVerifications[i] ', userVerifications[i]);
      }
      userVerification.push(verificationToAdd);
    }
    this.setState({
      userVerificationTable: userVerification,
      showingOnTable: status,
      showVerificationTable: true,
    });
  };
  getUsernamePaymentId = (paymentId, username) => {
    let url = otc.getClientPaymentById(username, paymentId);
    url
      .then((resp) => {
        var paymentInfoConcat = '';
        Object.entries(resp.data).forEach(([paymentName, paymentInfo]) => {
          if (
            paymentName !== 'automaticCharge' &&
            paymentName !== 'messages' &&
            paymentName !== 'verified' &&
            paymentName !== 'forceVerification'
          ) {
            if (paymentInfo === 'TRANSFER_WITH_SPECIFIC_BANK') {
              paymentInfo = 'TRANSFERENCIA CON BANCO ESPECÍFICO';
            }
            if (paymentInfo === 'TRANSFER_NATIONAL_BANK') {
              paymentInfo = 'TRANSFERENCIA BANCO NACIONAL';
            }
            if (paymentInfo === 'CREDIT_CARD') {
              paymentInfo = 'TARJETA DE CRÉDITO';
            }
            if (paymentInfo === 'WIRE_TRANSFER') {
              paymentInfo = 'TRANSFERENCIA BANCARIA';
            }
            if (paymentInfoConcat === '') {
              if (paymentName === 'id') {
                paymentInfoConcat = paymentInfoConcat.concat(
                  paymentInfo.slice(-4)
                );
              } else {
                paymentInfoConcat = paymentInfoConcat.concat(paymentInfo);
              }
            } else {
              if (paymentName === 'id') {
                paymentInfoConcat = paymentInfoConcat
                  .concat('-')
                  .concat(paymentInfo.slice(-4));
              } else {
                paymentInfoConcat = paymentInfoConcat
                  .concat('-')
                  .concat(paymentInfo);
              }
            }
          }
        });
        this.setState({ paymentInfoToConfirm: paymentInfoConcat }, () => {
          this.setState({ paymentInfoReady: true });
        });
      })
      .catch((error) => {});
  };
  getUserVerifications = (status) => {
    let username = window.sessionStorage.getItem('username');
    this.setState({ showVerificationTable: false });
    userService
      .getVerifications(username, status)
      .then((resp) => {
        //console.log(resp);
        this.makeDataTable(resp.data, status);
      })
      .catch((error) => {
        //////console.log(error);
        this.setState({ showVerificationTable: true });
      });
  };
  verifyUser = (success, username, date, userType, lastStatus) => {
    var body = {
      userName: this.state.userToVerify.username,
      timestamp: this.state.userToVerify.date,
      success: success,
      userVerificationType: this.state.userToVerify.userVerificationType,
      lastUserVerificationStatus: this.state.userToVerify.status,
    };
    userService
      .userProcessVerification(body)
      .then((res) => {
        this.setState({ expanded: {} });
        this.closeVerifyConfirmModal();
        this.getUserVerifications(this.state.statusToSearch);
      })
      .catch((error) => {
        ////console.log(error);
      });
  };
  pickStatus = (e, data) => {
    this.setState({ statusToSearch: data.value });
  };
  handleDataName = (e) => {
    this.setState({ toEditDataName: e.target.value });
  };
  handleDataValue = (e) => {
    this.setState({ toEditDataValue: e.target.value });
  };
  handleItemEditUser = (e, { name }) => {
    this.getDataNamesOptions();
    this.setState({
      activeItemEditUser: name,
      toEditDataName: null,
      toEditDataValue: null,
      selectedFile: null,
    });
  };
  addDocumentToUser = () => {
    this.setState({ loadEditUser: true });
    var dataName = this.state.toEditDataName.replace(/\s/g, '_');
    dataName = dataName + 'URL';
    const formData = new FormData();
    formData.append('attachment', this.state.selectedFile);
    formData.append('userName', this.state.userInfo.name);
    formData.append('fieldName', dataName);
    let url = userService.userAddAttachment(formData);
    url
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({
            toEditDataName: null,
            selectedFile: null,
            addDataFormKey: Math.random(),
            loadEditUser: false,
          });
        } else {
          this.setState({
            failAddInfo: true,
            messageAddInfo: resp.data,
            loadEditUser: false,
          });
          setTimeout(() => {
            this.setState({
              failAddInfo: false,
            });
          }, 5000);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          this.setState({
            failAddInfo: true,
            messageAddInfo:
              'Ha habido un error agregando el nuevo documento, por favor revise si ya este usuario posee un documento con dicho nombre',
            loadEditUser: false,
          });
          setTimeout(() => {
            this.setState({
              failAddInfo: false,
            });
          }, 5000);
        }
      });
  };
  async addInfoToUser() {
    this.setState({ loadEditUser: true });
    try {
      const dataName = this.state.toEditDataName.replace(/\s/g, '_');

      var body = {
        userName: this.state.userInfo.name,
        fieldName: dataName,
        fieldValue: this.state.toEditDataValue,
      };
      const response = await userService.addDataUserAsync(body);
      if (response.data === 'OK') {
        this.setState({
          toEditDataName: null,
          toEditDataValue: null,
          addDataFormKey: Math.random(),
          loadEditUser: false,
        });
      } else {
        this.setState({
          failAddInfo: true,
          messageAddInfo: response.data,
          loadEditUser: false,
        });
        setTimeout(() => {
          this.setState({
            failAddInfo: false,
          });
        }, 5000);
      }
    } catch (error) {
      ////console.log(error);
    }
  }
  async modifyInfoToUser() {
    this.setState({ loadEditUser: true });

    try {
      const dataName = this.state.toEditDataName.replace(/\s/g, '_');
      // console.log(this.state.userInfo);
      var body = {
        userName: this.state.userInfo.name,
        fieldName: dataName,
        fieldValue: this.state.toEditDataValue,
      };
      const response = await userService.updateUserData(body);
      if (response.data === 'OK') {
        this.getDataNamesOptions();
        this.setState({
          toEditDataName: null,
          toEditDataValue: null,
          editDataFormKey: Math.random(),
          loadEditUser: false,
        });
      } else {
        this.setState({
          failAddInfo: true,
          messageAddInfo: response.data,
          loadEditUser: false,
        });
        setTimeout(() => {
          this.setState({
            failAddInfo: false,
          });
        }, 5000);
      }
    } catch (error) {
      ////console.log(error);
    }
  }
  pickToEdit = (e, data) => {
    this.setState({ toEditDataName: data.value, toEditDataValue: null });
  };
  pickGenderToEdit = (e, data) => {
    this.setState({ toEditDataValue: data.value });
  };
  pickDocumentTypeToEdit = (e, data) => {
    this.setState({ toEditDataValue: data.value });
  };
  getDataNamesOptions = () => {
    userService
      .getConfigUserGeneral(this.state.userInfo.name)
      .then((resp) => {
        var options = [];
        var normalizaeObject = this.getActualUserInfo(resp.data.result);
        delete normalizaeObject.other;
        delete normalizaeObject.isACompany;
        Object.entries(normalizaeObject).forEach(([key, value]) => {
          if (
            key !== 'active' &&
            key !== 'address' &&
            key !== 'environment' &&
            key !== 'masterWalletIds' &&
            key !== 'operationAccount' &&
            key !== 'type' &&
            key !== 'active' &&
            key !== 'verification' &&
            key !== 'name' &&
            key !== 'email' &&
            !key.startsWith('paymentId') &&
            !key.startsWith('automaticChange') &&
            !key.endsWith('URL')
          ) {
            var dataName = '';
            if (key === 'questionSecurity') {
              dataName = 'Pregunta de seguridad';
            } else if (key === 'lastName') {
              dataName = 'Apellidos';
            } else if (key === 'answerSecurity') {
              dataName = 'Respuesta de seguridad';
            } else if (key === 'typeDocumentIdentity') {
              dataName = 'Tipo de documento de identidad';
            } else if (key === 'numberDocumentIdentity') {
              dataName = 'Número de documento de identidad';
            } else if (key === 'gender') {
              dataName = 'Sexo';
              value === 'male' ? (value = 'Masculino') : (value = 'Femenino');
            } else if (key === 'birthdate') {
              dataName = 'Fecha de nacimiento';
            } else if (key === 'birthplace') {
              dataName = 'Lugar de nacimiento';
            } else if (key === 'countryOfBirth') {
              dataName = 'País de nacimiento';
            } else if (key === 'cityOfBirth') {
              dataName = 'Ciudad de nacimiento';
            } else if (key === 'familyName') {
              dataName = 'Familiar de contacto';
            } else if (key === 'familyEmail') {
              dataName = 'Email del contacto';
            } else if (key === 'userLocalBitcoin') {
              dataName = 'Usuario LocalBitcoin';
            } else if (key === 'userFacebook') {
              dataName = 'Usuario Facebook';
            } else if (key === 'userDirection') {
              dataName = 'Dirección';
            } else if (key === 'firstName') {
              dataName = 'Nombres';
            } else if (key === 'phone') {
              dataName = 'Teléfono';
            } else if (key === 'nickname') {
              dataName = 'Nombre de usuario';
            } else if (key === 'companyName') {
              dataName = 'Nombre de la compañia';
            } else if (key === 'companyTypeOfFiscalRecord') {
              dataName = 'Tipo de registro fiscal';
            } else if (key === 'companyNumberOfFiscalRecord') {
              dataName = 'Número de registro fiscal';
            } else if (key === 'companyYearRegistration') {
              dataName = 'Año de registro de la compañia';
            } else {
              dataName = key.replace(/_/g, ' ');
            }
            if (value === '') {
              value = 'No posee';
            } else if (value === 'cedula') {
              value = 'Cédula de identidad';
            } else if (value === 'passport') {
              value = 'Pasaporte';
            } else if (value === 'dni') {
              value = 'DNI';
            } else if (value === 'id') {
              value = 'ID';
            }
            var toPush = {
              key: key,
              value: key,
              text: dataName + ': ' + value,
            };
            options.push(toPush);
          }
        });
        this.setState({ dataNameToEditOptions: options });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fileChangedHandler = (event) => {
    this.setState({ loadingNewFile: true });
    this.setState({ selectedFile: event.target.files[0] }, () =>
      this.setState({ loadingNewFile: false })
    );
  };
  paymentFileChangedHandler = (event) => {
    let obj = event.target.files[0];
    //console.log(obj)
    let newname1 = event.target.files[0].name.replace(/ /g, '-').toLowerCase();
    let newnamesinn = newname1.replace(/ñ/gi, 'n');
    let sinacentos = newnamesinn.replace(/[áäà]/gi, 'a');
    let newname = sinacentos;
    let f = new File([obj], newname, { type: obj.type });

    this.setState({ loadingNewFile: true });
    this.setState({ paymentVerificationSelectedFile: f }, () =>
      this.setState({ loadingNewFile: false })
    );
  };
  openSocket = (operationId) => {
    if (operationId !== undefined) {
      this.setState({ showOperationMessages: false });
      this.setState({
        socket: new Sockette(config.webSocketsClients + '/otc', {
          onopen: (e) =>
            this.socketReady(
              operationId,
              window.sessionStorage.getItem('otcOperationSocketId')
            ),
          onmessage: (e) => this.handleValue(e.data, operationId),
          onreconnect: (e) => this.reconnectSocket(e, operationId),
        }),
      });
    } else {
      this.setState({ showOperationMessages: true });
    }
  };
  async sendMessage(id, username, message) {
    if (
      message !== '' ||
      (this.state.paymentVerificationSelectedFile !== null &&
        this.state.paymentVerificationSelectedFile !== undefined)
    ) {
      this.setState({
        loadingSendButton: true,
      });
      const messageUnderscored = message.replace(/\s/g, '_');

      if (this.state.paymentVerificationSelectedFile === null) {
        let formData = new FormData();
        await formData.append('id', id);
        await formData.append('userName', userService.getUserName());
        await formData.append('message', messageUnderscored);
        await formData.append('operationMessageSide', 'ADMIN');

        for (var value of formData.values()) {
          ////console.log(value);
        }
        let OTCPOST = otc.addPostOperationMessageWithFile(formData);
        OTCPOST.then((resp) => {
          this.setState({ messageToSend: '' }, () => {
            this.setState({
              key: Math.random(),
              keyFile: Math.random(),
              paymentVerificationSelectedFile: null,
              loadingSendButton: false,
            });
          });
        }).catch((error) => {
          ////console.log(error);
        });
      } else {
        let formData = new FormData();
        formData.append(
          'attachment',
          this.state.paymentVerificationSelectedFile
        );
        formData.append('id', id);
        formData.append('userName', userService.getUserName());
        formData.append('message', messageUnderscored);
        formData.append('operationMessageSide', 'ADMIN');
        let OTCPOST = otc.addPostOperationMessageWithFile(formData);
        //console.log("formData:", formData);
        OTCPOST.then((res) => {
          this.setState({
            messageToSend: '',
            key: Math.random(),
            keyFile: Math.random(),
            paymentVerificationSelectedFile: null,
            loadingSendButton: false,
          });
        }).catch((error) => {
          //console.log(error);
        });
      }
    }
  }
  enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.sendMessage(
        this.state.expandedRow.original.verificationOperationId,
        this.state.expandedRow.original.username,
        this.state.messageToSend
      );
    }
  };
  formatDate(date) {
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: 'true',
    };
    let data = date.toLocaleString(regi, options);
    if (regi === 'es-ES') {
      data = data.split(' ');
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + ' ' + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  closeModal = () => {
    this.setState({ showModalAttachment: false });
  };
  render() {
    let addInfoMessage;
    if (this.state.failAddInfo) {
      addInfoMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{this.state.messageAddInfo}</p>
        </Message>
      );
    }
    const statusOptions = [
      { key: 'PROCESSING', value: 'PROCESSING', text: 'Procesando' },
      { key: 'OK', value: 'OK', text: 'Verificados' },
      { key: 'FAIL', value: 'FAIL', text: 'Fallidos' },
    ];
    const userVerificationTableHeaders = [
      {
        Header: <Icon name='mail' />,
        accessor: 'actions',
        width: 32,
        Cell: (row) => {
          if (row.original.status !== 'FINISHED') {
            var icon;
            if (this.state.newIdMessage) {
              for (var i = 0; i < this.state.idsNewMessageIcon.length; i++) {
                if (
                  this.state.idsNewMessageIcon[i] ===
                  row.original.verificationOperationId
                ) {
                  return (icon = (
                    <Popup
                      trigger={<Icon color='red' name='exclamation' />}
                      content='Mensaje nuevo'
                    />
                  ));
                }
              }
            }
          }
          return <div>{icon}</div>;
        },
      },
      {
        Header: 'Fecha',
        accessor: 'date',
        Cell: (row) => {
          return this.formatDate(row.value);
        },
        width: 165,
      },
      {
        Header: 'Información',
        accessor: 'info',
      },
      {
        Header: 'Usuario',
        accessor: 'username',
      },
      {
        Header: 'Tipo de verificación',
        accessor: 'userVerificationType',
        width: 150,
      },
    ];

    return (
      <div>
        {!this.state.showVerificationTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Estatus a buscar:</label>
              <Select
                placeholder='Procesando'
                onChange={this.pickStatus}
                options={statusOptions}
                style={{ zIndex: 100 }}
              />
            </Form.Field>
            <Form.Button
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={() =>
                this.getUserVerifications(this.state.statusToSearch)
              }
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        <Divider />
        <ReactTable
          defaultSorted={[
            {
              id: 'date',
              desc: false,
            },
          ]}
          className='transactionTable'
          data={this.state.userVerificationTable}
          columns={userVerificationTableHeaders}
          defaultPageSize={5}
          previousText='Anterior'
          nextText='Siguiente'
          loadingText='Cargando...'
          noDataText='No hay verificaciones de este estatus'
          pageText='Página'
          ofText='de'
          rowsText='filas'
          pageJumpText='ir a la página'
          rowsSelectorText='filas por página'
          minRow={5}
          collapseOnDataChange={false}
          expanded={this.state.expanded}
          onExpandedChange={(newExpanded, index, event) => {
            var otherExpandedRow = false;
            if (newExpanded[index[0]] === false) {
              newExpanded = {};
            } else {
              Object.keys(newExpanded).map((k) => {
                newExpanded[k] = parseInt(k) === index[0] ? {} : false;
                otherExpandedRow = true;
                return null;
              });
            }
            this.setState(
              {
                ...this.state,
                expanded: newExpanded,
              },
              () => {
                if (
                  this.state.socket !== null &&
                  this.state.socket !== undefined
                ) {
                  this.state.socket.close();
                  window.sessionStorage.setItem('otcOperationSocketId', '');
                  this.setState(
                    {
                      socket: null,
                      oldOperationsMessages: [],
                      showOperationMessages: false,
                      paymentVerificationSelectedFile: null,
                      paymentInfoReady: false,
                    },
                    () => {
                      if (
                        (this.state.socket === null ||
                          this.state.socket === undefined) &&
                        otherExpandedRow
                      ) {
                        this.openSocket(
                          this.state.expandedRow.original
                            .verificationOperationId
                        );
                      }
                    }
                  );
                } else {
                  this.openSocket(
                    this.state.expandedRow.original.verificationOperationId
                  );
                }
              }
            );
            setTimeout(() => {
              this.focusRowExpanded();
              if (
                this.state.expandedRow.original.userVerificationType === 'D'
              ) {
                this.getUsernamePaymentId(
                  this.state.expandedRow.original.paymentId,
                  this.state.expandedRow.original.username
                );
              }
            }, 1000);
          }}
          SubComponent={(row) => {
            this.state.expandedRow = row;
            if (
              this.state.expandedRow.original.userVerificationType === 'C' ||
              this.state.expandedRow.original.userVerificationType === 'A'
            ) {
              return (
                <Container style={{ padding: 30 }}>
                  {!this.state.showOperationMessages && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Divider />

                  <Grid columns='equal'>
                    <Grid.Column width={8}>
                      <Grid>
                        {this.state.expandedRow.original
                          .verificationOperationId !== undefined && (
                          <Container style={{ marginTop: 14 }}>
                            <Grid.Row>
                              <Form>
                                <Form.Field key={this.state.key}>
                                  <TextArea
                                    ref={this.typeOperation}
                                    onChange={this.handleMessage}
                                    placeholder=''
                                    onKeyPress={this.enterPressed}
                                  />
                                </Form.Field>
                                <Container>
                                  <Grid columns='equal'>
                                    <Grid.Row columns='equal'>
                                      <Grid.Column width={8}>
                                        <Grid.Row>
                                          <Button
                                            as='label'
                                            size='mini'
                                            htmlFor='hidden-new-file-editUser'
                                            color='grey'
                                            loading={this.state.loadingNewFile}
                                            basic
                                          >
                                            Adjuntar documento
                                          </Button>
                                        </Grid.Row>
                                        {this.state
                                          .paymentVerificationSelectedFile !==
                                          null &&
                                          this.state
                                            .paymentVerificationSelectedFile !==
                                            undefined && (
                                            <Grid.Row>
                                              <Label style={{ width: 110 }}>
                                                {
                                                  this.state
                                                    .paymentVerificationSelectedFile
                                                    .name
                                                }
                                              </Label>
                                            </Grid.Row>
                                          )}
                                      </Grid.Column>
                                      <Input
                                        id='hidden-new-file-editUser'
                                        key={this.state.keyFile}
                                        type='file'
                                        accept='image/*'
                                        onChange={
                                          this.paymentFileChangedHandler
                                        }
                                        style={{ display: 'none' }}
                                      />
                                      <Grid.Column width={4}>
                                        <Button
                                          size='mini'
                                          loading={this.state.loadingSendButton}
                                          onClick={() => {
                                            this.sendMessage(
                                              row.original
                                                .verificationOperationId,
                                              row.original.username,
                                              this.state.messageToSend
                                            );
                                          }}
                                          color='blue'
                                        >
                                          Enviar
                                        </Button>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>
                                </Container>
                              </Form>
                            </Grid.Row>
                            <Container style={{ marginTop: 48 }}>
                              <Divider horizontal>
                                <Header as='h4'>Acciones</Header>
                              </Divider>
                            </Container>
                          </Container>
                        )}
                        <Grid.Row columns='equal'>
                          <Grid.Column>
                            <Modal
                              open={this.state.modalEditUser}
                              onClose={this.closeEditUserModal}
                              trigger={
                                <Button
                                  onClick={() =>
                                    this.openEditUserModal(
                                      row.original,
                                      row.original.username
                                    )
                                  }
                                  labelPosition='left'
                                  size='tiny'
                                  type='submit'
                                  color='blue'
                                  icon
                                >
                                  <Icon name='edit outline' />
                                  Editar Usuario
                                </Button>
                              }
                            >
                              <Modal.Header>
                                <Icon name='edit outline' />
                                Editar usuario
                              </Modal.Header>
                              <Modal.Content>
                                {this.state.userInfo.name === undefined && (
                                  <Dimmer active inverted>
                                    <Loader inverted>Cargando...</Loader>
                                  </Dimmer>
                                )}
                                {this.state.userInfo.name !== undefined && (
                                  <Modal.Description>
                                    <Header as='h4'>
                                      ¿Desea agregar un nuevo dato o modificar
                                      alguno existente del usuario{' '}
                                      {this.state.userInfo.name}?
                                    </Header>
                                    <Divider hidden />
                                    <Menu pointing secondary>
                                      <Menu.Item
                                        content='Añadir dato'
                                        name='addData'
                                        active={
                                          this.state.activeItemEditUser ===
                                          'addData'
                                        }
                                        onClick={this.handleItemEditUser}
                                      />
                                      <Menu.Item
                                        content='Editar dato'
                                        name='editData'
                                        active={
                                          this.state.activeItemEditUser ===
                                          'editData'
                                        }
                                        onClick={this.handleItemEditUser}
                                      />
                                      <Menu.Item
                                        content='Añadir documento'
                                        name='addDocument'
                                        active={
                                          this.state.activeItemEditUser ===
                                          'addDocument'
                                        }
                                        onClick={this.handleItemEditUser}
                                      />
                                    </Menu>
                                    {this.state.activeItemEditUser ===
                                      'addData' && (
                                      <Form>
                                        <Form.Group
                                          widths='equal'
                                          key={this.state.addDataFormKey}
                                        >
                                          <Form.Field>
                                            <label>Nombre</label>
                                            <input
                                              placeholder='Primera mascota'
                                              onChange={this.handleDataName}
                                            />
                                          </Form.Field>
                                          <Form.Field>
                                            <label>Valor</label>
                                            <input
                                              placeholder='Pez dorado'
                                              onChange={this.handleDataValue}
                                            />
                                          </Form.Field>
                                          <Form.Button
                                            style={{ marginTop: 23 }}
                                            content='Añadir dato'
                                            color='blue'
                                            type='submit'
                                            loading={this.state.loadEditUser}
                                            disabled={
                                              this.state.toEditDataName ===
                                                null ||
                                              this.state.toEditDataValue ===
                                                null
                                            }
                                            onClick={this.addInfoToUser.bind(
                                              this
                                            )}
                                          />
                                        </Form.Group>
                                        {addInfoMessage}
                                      </Form>
                                    )}
                                    {this.state.activeItemEditUser ===
                                      'editData' && (
                                      <Form>
                                        {this.state.dataNameToEditOptions
                                          .length === 0 && (
                                          <Dimmer active inverted>
                                            <Loader inverted>
                                              Cargando...
                                            </Loader>
                                          </Dimmer>
                                        )}
                                        {this.state.dataNameToEditOptions
                                          .length > 0 && (
                                          <div>
                                            <Form.Group
                                              widths='equal'
                                              key={this.state.editDataFormKey}
                                            >
                                              <Form.Field>
                                                <label>Nombre</label>
                                                <Select
                                                  placeholder='Primera mascota'
                                                  search
                                                  onChange={this.pickToEdit}
                                                  options={
                                                    this.state
                                                      .dataNameToEditOptions
                                                  }
                                                />
                                              </Form.Field>
                                              {this.state.toEditDataName !==
                                                'gender' &&
                                                this.state.toEditDataName !==
                                                  'typeDocumentIdentity' && (
                                                  <Form.Field>
                                                    <label>Nuevo valor</label>
                                                    <input
                                                      placeholder='Pez dorado'
                                                      onChange={
                                                        this.handleDataValue
                                                      }
                                                    />
                                                  </Form.Field>
                                                )}
                                              {this.state.toEditDataName ===
                                                'gender' && (
                                                <Form.Field>
                                                  <label>Nuevo valor</label>
                                                  <Select
                                                    placeholder='Masculino'
                                                    search
                                                    onChange={
                                                      this.pickGenderToEdit
                                                    }
                                                    options={
                                                      this.state.genderOptions
                                                    }
                                                  />
                                                </Form.Field>
                                              )}
                                              {this.state.toEditDataName ===
                                                'typeDocumentIdentity' &&
                                                (this.state.toEditDataValue ===
                                                  null ||
                                                  this.state.toEditDataValue ===
                                                    'id' ||
                                                  this.state.toEditDataValue ===
                                                    'cedula' ||
                                                  this.state.toEditDataValue ===
                                                    'passport' ||
                                                  this.state.toEditDataValue ===
                                                    'dni') && (
                                                  <Form.Field>
                                                    <label>Nuevo valor</label>
                                                    <Select
                                                      placeholder='DNI'
                                                      search
                                                      onChange={
                                                        this
                                                          .pickDocumentTypeToEdit
                                                      }
                                                      options={
                                                        this.state
                                                          .documentTypeOptions
                                                      }
                                                    />
                                                  </Form.Field>
                                                )}
                                              {this.state.toEditDataName ===
                                                'typeDocumentIdentity' &&
                                                (this.state.toEditDataValue ===
                                                  'other' ||
                                                  (this.state
                                                    .toEditDataValue !== null &&
                                                    this.state
                                                      .toEditDataValue !==
                                                      'id' &&
                                                    this.state
                                                      .toEditDataValue !==
                                                      'cedula' &&
                                                    this.state
                                                      .toEditDataValue !==
                                                      'passport' &&
                                                    this.state
                                                      .toEditDataValue !==
                                                      'dni')) && (
                                                  <Form.Field>
                                                    <label>Nuevo valor</label>
                                                    <input
                                                      placeholder='Licencia de conducir'
                                                      onChange={
                                                        this.handleDataValue
                                                      }
                                                    />
                                                  </Form.Field>
                                                )}
                                              <Form.Button
                                                style={{ marginTop: 23 }}
                                                content='Modificar dato'
                                                color='blue'
                                                type='submit'
                                                loading={
                                                  this.state.loadEditUser
                                                }
                                                disabled={
                                                  this.state.toEditDataName ===
                                                    null ||
                                                  this.state.toEditDataValue ===
                                                    null
                                                }
                                                onClick={this.modifyInfoToUser.bind(
                                                  this
                                                )}
                                              />
                                            </Form.Group>
                                            {addInfoMessage}
                                          </div>
                                        )}
                                      </Form>
                                    )}
                                    {this.state.activeItemEditUser ===
                                      'addDocument' && (
                                      <Form>
                                        <Form.Group
                                          widths='equal'
                                          key={this.state.addDataFormKey}
                                        >
                                          <Form.Field>
                                            <label>Nombre</label>
                                            <input
                                              placeholder='Firma del usuario'
                                              onChange={this.handleDataName}
                                            />
                                          </Form.Field>
                                          <Form.Field>
                                            <Button
                                              style={{ marginTop: 25 }}
                                              as='label'
                                              size='mini'
                                              htmlFor='hidden-new-file'
                                              color='grey'
                                              loading={
                                                this.state.loadingNewFile
                                              }
                                              basic
                                            >
                                              Adjuntar documento
                                            </Button>

                                            {this.state.selectedFile !== null &&
                                              this.state.selectedFile !==
                                                undefined && (
                                                <Grid.Row>
                                                  <Label>
                                                    {
                                                      this.state.selectedFile
                                                        .name
                                                    }
                                                  </Label>
                                                </Grid.Row>
                                              )}
                                            <Input
                                              id='hidden-new-file'
                                              key={this.state.keyFile}
                                              type='file'
                                              accept='image/*'
                                              onChange={this.fileChangedHandler}
                                              style={{ display: 'none' }}
                                            />
                                          </Form.Field>
                                          <Form.Button
                                            style={{ marginTop: 23 }}
                                            content='Añadir documento'
                                            color='blue'
                                            type='submit'
                                            loading={this.state.loadEditUser}
                                            disabled={
                                              this.state.toEditDataName ===
                                                null ||
                                              this.state.selectedFile === null
                                            }
                                            onClick={this.addDocumentToUser}
                                          />
                                        </Form.Group>
                                        {addInfoMessage}
                                      </Form>
                                    )}
                                  </Modal.Description>
                                )}
                              </Modal.Content>
                              <Modal.Actions>
                                <Button onClick={this.closeEditUserModal}>
                                  <Icon name='arrow alternate circle left' />{' '}
                                  Cancelar
                                </Button>
                              </Modal.Actions>
                            </Modal>
                          </Grid.Column>
                          <Grid.Column>
                            <Modal
                              size='large'
                              open={this.state.modalVerify}
                              onClose={this.closeVerifyConfirmModal}
                              trigger={
                                <Button
                                  onClick={() => {
                                    this.setState(
                                      { showStatusVerify: true },
                                      () => {
                                        this.openVerifyConfirmModal(
                                          row.original,
                                          row.original.username
                                        );
                                      }
                                    );
                                  }}
                                  labelPosition='left'
                                  type='submit'
                                  color='blue'
                                  size='tiny'
                                  icon
                                >
                                  <Icon name='id card outline' />
                                  Verificar usuario
                                </Button>
                              }
                            >
                              <Modal.Header>
                                <Icon name='id card outline' />
                                Verificación de usuario
                              </Modal.Header>
                              <Modal.Content scrolling>
                                {Object.keys(this.state.userInfo).length ===
                                  0 && <Segment basic loading />}
                                {Object.keys(this.state.userInfo).length >
                                  0 && (
                                  <Modal.Description>
                                    <Header as='h4'>
                                      ¿Este usuario cumple con los
                                      requerimientos exigidos para verificar su
                                      cuenta?
                                    </Header>
                                    <Divider hidden />
                                    <Form>
                                      {this.state.userInfo.isACompany && (
                                        <Divider horizontal>
                                          <Header as='h4'>
                                            Datos de la empresa
                                          </Header>
                                        </Divider>
                                      )}
                                      {this.state.userInfo.isACompany && (
                                        <Form.Group widths='equal'>
                                          <Form.Field>
                                            <label>Nombre de la empresa</label>
                                            <p className='infoUserParagraph'>
                                              {this.state.userInfo
                                                .companyName !== undefined &&
                                              this.state.userInfo
                                                .companyName !== ''
                                                ? this.state.userInfo
                                                    .companyName
                                                : 'No posee'}
                                            </p>
                                          </Form.Field>
                                          <Form.Field>
                                            <label>
                                              Tipo de registro fiscal
                                            </label>
                                            <p className='infoUserParagraph'>
                                              {this.state.userInfo
                                                .companyTypeOfFiscalRecord !==
                                                undefined &&
                                              this.state.userInfo
                                                .companyTypeOfFiscalRecord !==
                                                ''
                                                ? this.state.userInfo
                                                    .companyTypeOfFiscalRecord
                                                : 'No posee'}
                                            </p>
                                          </Form.Field>
                                          <Form.Field>
                                            <label>
                                              Número de registro fiscal
                                            </label>
                                            <p className='infoUserParagraph'>
                                              {this.state.userInfo
                                                .companyNumberOfFiscalRecord !==
                                                undefined &&
                                              this.state.userInfo
                                                .companyNumberOfFiscalRecord !==
                                                ''
                                                ? this.state.userInfo
                                                    .companyNumberOfFiscalRecord
                                                : 'No posee'}
                                            </p>
                                          </Form.Field>
                                          <Form.Field>
                                            <label>Año de registro</label>
                                            <p className='infoUserParagraph'>
                                              {this.state.userInfo
                                                .companyYearRegistration !==
                                                undefined &&
                                              this.state.userInfo
                                                .companyYearRegistration !== ''
                                                ? this.state.userInfo
                                                    .companyYearRegistration
                                                : 'No posee'}
                                            </p>
                                          </Form.Field>
                                        </Form.Group>
                                      )}
                                      <Divider horizontal>
                                        <Header as='h4'>
                                          Datos personales
                                        </Header>
                                      </Divider>
                                      <Form.Group widths='equal'>
                                        <Form.Field>
                                          <label>Nombres</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.firstName !==
                                              undefined &&
                                            this.state.userInfo.firstName !== ''
                                              ? this.state.userInfo.firstName
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Apellidos</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.lastName !==
                                              undefined &&
                                            this.state.userInfo.lastName !== ''
                                              ? this.state.userInfo.lastName
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Sexo</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.gender !==
                                              undefined &&
                                            this.state.userInfo.gender !== ''
                                              ? this.state.userInfo.gender ===
                                                'male'
                                                ? 'Masculino'
                                                : 'Femenino'
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Tipo de documento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .typeDocumentIdentity !==
                                              undefined &&
                                            this.state.userInfo
                                              .typeDocumentIdentity !== ''
                                              ? this.state.userInfo
                                                  .typeDocumentIdentity
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Número de documento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .numberDocumentIdentity !==
                                              undefined &&
                                            this.state.userInfo
                                              .numberDocumentIdentity !== ''
                                              ? this.state.userInfo
                                                  .numberDocumentIdentity
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                      </Form.Group>
                                      <Form.Group widths='equal'>
                                        <Form.Field  >
                                          <label>Fecha de nacimiento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.birthdate !==
                                              undefined &&
                                            this.state.userInfo.birthdate !== ''
                                              ? this.state.userInfo.birthdate
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                         <Form.Field >
                                          <label>País de nacimiento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.countryOfBirth !==
                                              undefined &&
                                            this.state.userInfo.countryOfBirth !==
                                              ''
                                              ? this.state.userInfo.countryOfBirth
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                         <Form.Field >
                                          <label>Ciudad de nacimiento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.cityOfBirth !==
                                              undefined &&
                                            this.state.userInfo.cityOfBirth !==
                                              ''
                                              ? this.state.userInfo.cityOfBirth
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field >
                                          <label>Lugar de nacimiento</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.birthplace !==
                                              undefined &&
                                            this.state.userInfo.birthplace !==
                                              ''
                                              ? this.state.userInfo.birthplace
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                       
                                        <Form.Field >
                                          <label>Teléfono</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.phone !==
                                              undefined &&
                                            this.state.userInfo.phone !== ''
                                              ? this.state.userInfo.phone
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        {/* <Form.Field>
                                          <label>Usuario localBitcoin</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .userLocalBitcoin !== undefined &&
                                            this.state.userInfo
                                              .userLocalBitcoin !== ''
                                              ? this.state.userInfo
                                                  .userLocalBitcoin
                                              : 'No posee'}
                                          </p>
                                        </Form.Field> */}
                                      </Form.Group>
                                      <Form.Group widths='equal'>
                                        {/* <Form.Field>
                                          <label>Usuario de Facebook</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .userFacebook !== undefined &&
                                            this.state.userInfo.userFacebook !==
                                              ''
                                              ? this.state.userInfo.userFacebook
                                              : 'No posee'}
                                          </p>
                                        </Form.Field> */}
                                         <Form.Field >
                                          <label>Dirección</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .userDirection !== undefined &&
                                            this.state.userInfo
                                              .userDirection !== ''
                                              ? this.state.userInfo
                                                  .userDirection
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Pregunta de seguridad</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .questionSecurity !== undefined &&
                                            this.state.userInfo
                                              .questionSecurity !== ''
                                              ? '************' //this.state.userInfo.questionSecurity
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Respuesta de seguridad</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo
                                              .answerSecurity !== undefined &&
                                            this.state.userInfo
                                              .answerSecurity !== ''
                                              ? '************' //this.state.userInfo.answerSecurity
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Familiar de contacto</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.familyName !==
                                              undefined &&
                                            this.state.userInfo.familyName !==
                                              ''
                                              ? this.state.userInfo.familyName
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Email del contacto</label>
                                          <p className='infoUserParagraph'>
                                            {this.state.userInfo.familyEmail !==
                                              undefined &&
                                            this.state.userInfo.familyEmail !==
                                              ''
                                              ? this.state.userInfo.familyEmail
                                              : 'No posee'}
                                          </p>
                                        </Form.Field>
                                      </Form.Group>
                                      <Divider horizontal>
                                        <Header as='h4'>
                                          Datos del usuario
                                        </Header>
                                      </Divider>
                                      <Form.Group widths='equal'>
                                        <Form.Field>
                                          <label>Email</label>
                                         {this.state.userInfo.email !== undefined &&
											                      this.state.userInfo.email !== ""
												                    ? this.state.userInfo.email
												                  : "No posee"}
                                        </Form.Field>
                                        <Form.Field
                                          style={{ marginRight: -110 }}
                                        >
                                          <label>Address</label>
                                          {this.state.userInfo.address !==
                                            undefined &&
                                          this.state.userInfo.address !== ''
                                            ? this.state.userInfo.address
                                            : 'No posee'}
                                        </Form.Field>
                                        <Form.Field />
                                        <Form.Field>
                                          <label>Tipo de usuario</label>
                                          {this.state.userInfo.type}
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Estatus del usuario</label>
                                          {this.state.userInfo.active
                                            ? 'Activo'
                                            : 'Inactivo'}
                                        </Form.Field>
                                      </Form.Group>
                                      <Form.Group widths='equal'>
                                        <Form.Field>
                                          <label>Nombre de usuario</label>
                                          {this.state.userInfo.nickname !==
                                            undefined &&
                                          this.state.userInfo.nickname !== ''
                                            ? this.state.userInfo.nickname
                                            : 'No posee'}
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Ambiente del usuario</label>
                                          {this.state.userInfo.environment}
                                        </Form.Field>
                                        <Form.Field>
                                          <label>Cuenta de operación</label>
                                          {this.state.userInfo.operationAccount}
                                        </Form.Field>
                                        <Form.Field />
                                        <Form.Field />
                                      </Form.Group>
                                      {this.state.userInfo &&
                                        this.state.userInfo.other &&
                                        this.state.userInfo.other.length >
                                          0 && (
                                          <Container>
                                            <Divider horizontal>
                                              <Header as='h4'>
                                                Datos adicionales
                                              </Header>
                                            </Divider>
                                            <Form.Group widths='equal'>
                                              {this.state.userInfo.other.map(
                                                (k) => (
                                                  <Form.Field key={k.dataName}>
                                                    <label>
                                                      {k.dataName === 'nickname'
                                                        ? 'Nombre de usuario'
                                                        : k.dataName ===
                                                          'operatorName'
                                                        ? 'Nombre del operador'
                                                        : k.dataName ===
                                                          'creationTimestamp'
                                                        ? 'Fecha de creación'
                                                        : k.dataName ===
                                                          'sourceSignin'
                                                        ? 'Fuente de registro'
                                                        : k.dataName ===
                                                          'createdFromMCSend'
                                                        ? 'Creado desde envio MC'
                                                        : k.dataName ===
                                                          'selfieIdentityVerificationMc'
                                                        ? 'Selfie de Identificación MC'
                                                        : k.dataName ===
                                                          'identityVerificationMc'
                                                        ? 'Identificación MC'
                                                        : k.dataName ===
                                                          'referralCode'
                                                        ? 'Código de Referido'
                                                        : k.dataName}
                                                    </label>
                                                    {k.dataName ===
                                                    'creationTimestamp' ? (
                                                      <p className='infoUserParagraph'>
                                                        {this.formatDate(
                                                          new Date(k.dataValue)
                                                        )}
                                                      </p>
                                                    ) : (
                                                      <p className='infoUserParagraph'>
                                                        {k.dataName ===
                                                          'selfieIdentityVerificationMc' ||
                                                        k.dataName ===
                                                          'identityVerificationMc'
                                                          ? 'SI'
                                                          : k.dataValue}
                                                      </p>
                                                    )}
                                                  </Form.Field>
                                                )
                                              )}
                                            </Form.Group>
                                          </Container>
                                        )}
                                    </Form>
                                    <Divider />
                                    <Container textAlign='center'>
                                      <Grid centered columns={2}>
                                        <Grid.Column>
                                          <Grid.Row>
                                            <div
                                              style={{ textAlign: 'center' }}
                                            >
                                              <p>
                                                <b style={{ color: '#207ef2' }}>
                                                  {this.state.userInfo
                                                    .isACompany
                                                    ? 'Documento de identidad (Debe coincidir con la persona firmante en el registro mercantil)'
                                                    : 'Documento de identidad'}
                                                </b>
                                              </p>
                                              {this.state
                                                .identityURLToVerify !==
                                                undefined &&
                                              this.state.identityURLToVerify !==
                                                null &&
                                              this.state.identityURLToVerify !==
                                                '' &&
                                              this.state.identityURLToVerify
                                                .isPdf ? ( // primer caso de pdf
                                                <div>
                                                  <List.Item>
                                                    <Document
                                                      file={
                                                        this.state
                                                          .identityURLToVerify
                                                          .file
                                                      }
                                                      externalLinkTarget='_blank'
                                                    >
                                                      <Page
                                                        pageNumber={1}
                                                        width={400}
                                                        height={400}
                                                      />
                                                    </Document>
                                                  </List.Item>

                                                  {this.state
                                                    .identityURLToVerify
                                                    .file !== '' && (
                                                    <Button
                                                      as='a'
                                                      href={
                                                        this.state
                                                          .identityURLToVerify
                                                          .file
                                                      }
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                    >
                                                      Descargar PDF
                                                    </Button>
                                                  )}
                                                </div>
                                              ) : this.state
                                                  .identityURLToVerify !==
                                                  undefined &&
                                                this.state
                                                  .identityURLToVerify !==
                                                  null &&
                                                this.state
                                                  .identityURLToVerify !==
                                                  '' && (
                                                <Modal
                                                  //key={id}
                                                  trigger={
                                                    // <List.Item>
                                                    <Image
                                                      title='Ver pantalla completa'
                                                      src={
                                                        this.state
                                                          .identityURLToVerify
                                                          .file
                                                      }
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      alt=''
                                                      size='medium'
                                                      as='a'
                                                      style={{
                                                        maxHeight: '800px',
                                                      }}
                                                    />
                                                    // </List.Item> */}
                                                  }
                                                >
                                                  {/* <Modal.Header>{t(element.message)}</Modal.Header> */}
                                                  <Modal.Content>
                                                    <Image
                                                      centered
                                                      src={
                                                        this.state
                                                          .identityURLToVerify
                                                          .file
                                                      }
                                                      size='huge'
                                                    />
                                                  </Modal.Content>
                                                </Modal>
                                              )}
                                            </div>
                                          </Grid.Row>
                                        </Grid.Column>
                                        <Grid.Column>
                                          <Grid.Row>
                                            <div
                                              style={{ textAlign: 'center' }}
                                            >
                                              <p>
                                                <b style={{ color: '#207ef2' }}>
                                                  {this.state.userInfo
                                                    .isACompany
                                                    ? 'Comprobante de cuenta jurídica'
                                                    : 'Comprobante de cuenta bancaria'}
                                                </b>
                                              </p>
                                              {this.state.bankURLToVerify !==
                                                undefined &&
                                              this.state.bankURLToVerify !==
                                                null &&
                                              this.state.bankURLToVerify !==
                                                '' &&
                                              this.state.bankURLToVerify
                                                .isPdf ? ( // segundo caso de pdf
                                                <div>
                                                  <List.Item>
                                                    <Document
                                                      file={
                                                        this.state
                                                          .bankURLToVerify.file
                                                      }
                                                      externalLinkTarget='_blank'
                                                    >
                                                      <Page
                                                        pageNumber={1}
                                                        width={400}
                                                        height={400}
                                                      />
                                                    </Document>
                                                  </List.Item>

                                                  <Button
                                                    as='a'
                                                    href={
                                                      this.state.bankURLToVerify
                                                        .file
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                  >
                                                    Descargar PDF
                                                  </Button>
                                                </div>
                                              ) : this.state.bankURLToVerify !==
                                                  undefined &&
                                                this.state.bankURLToVerify !==
                                                  null &&
                                                this.state.bankURLToVerify !==
                                                  '' && (
                                                <Modal
                                                  //key={id}
                                                  trigger={
                                                    // <List.Item>
                                                    <Image
                                                      title='Ver pantalla completa'
                                                      src={
                                                        this.state
                                                          .bankURLToVerify.file
                                                      }
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      alt=''
                                                      size='medium'
                                                      as='a'
                                                      style={{
                                                        maxHeight: '800px',
                                                      }}
                                                    />
                                                    // </List.Item> */}
                                                  }
                                                >
                                                  {/* <Modal.Header>{t(element.message)}</Modal.Header> */}
                                                  <Modal.Content>
                                                    <Image
                                                      centered
                                                      src={
                                                        this.state
                                                          .bankURLToVerify.file
                                                      }
                                                      size='huge'
                                                    />
                                                  </Modal.Content>
                                                </Modal>
                                              )}
                                            </div>
                                          </Grid.Row>
                                        </Grid.Column>
                                        {this.state
                                                .locationURLToVerify !==
                                                undefined &&
                                              this.state.locationURLToVerify !==
                                                null &&
                                              this.state.locationURLToVerify !==
                                                '' &&
                                              this.state.locationURLToVerify.file !==
                                                '' && (<Grid.Column>
                                          <Grid.Row>
                                            <div
                                              style={{ textAlign: 'center' }}
                                            >
                                              <p>
                                                <b style={{ color: '#207ef2' }}>
                                                  {this.state.userInfo
                                                    .isACompany
                                                    ? 'Registro mercantil (con sello húmedo)'
                                                    : 'Selfie con documento de identificación'}
                                                </b>
                                              </p>
                                              {
                                              this.state.locationURLToVerify
                                                .isPdf ? ( //tercer caso pdf
                                                <div>
                                                  <List.Item>
                                                    <Document
                                                      file={
                                                        this.state
                                                          .locationURLToVerify
                                                          .file
                                                      }
                                                      externalLinkTarget='_blank'
                                                    >
                                                      <Page
                                                        pageNumber={1}
                                                        width={400}
                                                        height={400}
                                                      />
                                                    </Document>
                                                  </List.Item>

                                                  <Button
                                                    as='a'
                                                    href={
                                                      this.state
                                                        .locationURLToVerify
                                                        .file
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                  >
                                                    Descargar PDF
                                                  </Button>
                                                </div>
                                              ) :  (
                                                <Modal
                                                  //key={id}
                                                  trigger={
                                                    // <List.Item>
                                                    <Image
                                                      title='Ver pantalla completa'
                                                      src={
                                                        this.state
                                                          .locationURLToVerify
                                                          .file
                                                      }
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      alt=''
                                                      size='medium'
                                                      as='a'
                                                      style={{
                                                        maxHeight: '800px',
                                                      }}
                                                    />
                                                    // </List.Item> */}
                                                  }
                                                >
                                                  {/* <Modal.Header>{t(element.message)}</Modal.Header> */}
                                                  <Modal.Content>
                                                    <Image
                                                      centered
                                                      src={
                                                        this.state
                                                          .locationURLToVerify
                                                          .file
                                                      }
                                                      size='huge'
                                                    />
                                                  </Modal.Content>
                                                </Modal>
                                              )}
                                            </div>
                                          </Grid.Row>
                                        </Grid.Column>)}
                                        <Grid.Column>
                                          {this.state.selfURLToVerify !==
                                                undefined &&
                                              this.state.selfURLToVerify !==
                                                null &&
                                              this.state.selfURLToVerify.file !==
                                                undefined &&
                                                this.state.selfURLToVerify.file !== "" && (<Grid.Row>
                                            <div
                                              style={{ textAlign: 'center' }}
                                            >
                                              <p>
                                                <b style={{ color: '#207ef2' }}>
                                                  {this.state.userInfo
                                                    .isACompany
                                                    ? 'Selfie con documento de registro físcal de un miembro firmante'
                                                    : 'Selfie con documento de identidad'}
                                                </b>
                                              </p>
                                              {
                                              this.state.selfURLToVerify
                                                .isPdf ? ( // cuarto caso de pdf
                                                <div>
                                                  <List.Item>
                                                    <Document
                                                      file={
                                                        this.state
                                                          .selfURLToVerify.file
                                                      }
                                                      externalLinkTarget='_blank'
                                                    >
                                                      <Page
                                                        pageNumber={1}
                                                        width={400}
                                                        height={400}
                                                      />
                                                    </Document>
                                                  </List.Item>
                                                  <Button
                                                    as='a'
                                                    href={
                                                      this.state.selfURLToVerify
                                                        .file
                                                    }
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                  >
                                                    Descargar PDF
                                                  </Button>
                                                </div>
                                              ) : (
                                                <Modal
                                                  //key={id}
                                                  trigger={
                                                    // <List.Item>
                                                    <Image
                                                      title='Ver pantalla completa'
                                                      src={
                                                        this.state
                                                          .selfURLToVerify.file
                                                      }
                                                      target='_blank'
                                                      rel='noopener noreferrer'
                                                      alt=''
                                                      size='medium'
                                                      as='a'
                                                      style={{
                                                        maxHeight: '800px',
                                                      }}
                                                    />
                                                  }
                                                >
                                                  <Modal.Content>
                                                    <Image
                                                      centered
                                                      src={
                                                        this.state
                                                          .selfURLToVerify.file
                                                      }
                                                      size='huge'
                                                    />
                                                  </Modal.Content>
                                                </Modal>
                                              )}
                                            </div>
                                          </Grid.Row>)}
                                        </Grid.Column>
                                        {this.state.otherDocumentsToShow
                                          .length > 0 && (
                                          <Container>
                                            <Divider horizontal>
                                              <Header as='h4'>
                                                Otros documentos
                                              </Header>
                                            </Divider>

                                            <Grid columns={2}>
                                              {this.state.otherDocumentsToShow.map(
                                                (document) => {
                                                  return (
                                                    <Grid.Column
                                                      key={document.url}
                                                    >
                                                      {document.url !==
                                                        undefined &&
                                                      (document.url.endsWith(
                                                        '.pdf'
                                                      ) ||
                                                        document.url.endsWith(
                                                          '.PDF'
                                                        )) ? (
                                                        <Grid centered>
                                                          <Grid.Row>
                                                            <label>
                                                              <b
                                                                style={{
                                                                  color:
                                                                    '#207ef2',
                                                                }}
                                                              >
                                                                {document.name}
                                                              </b>
                                                            </label>
                                                          </Grid.Row>
                                                          <Grid.Row>
                                                            <iframe
                                                              title='PDF'
                                                              src={document.url}
                                                              width='300'
                                                              height='250'
                                                              frameBorder='0'
                                                              allowFullScreen
                                                            />
                                                            <Button
                                                              as='a'
                                                              href={
                                                                document.url
                                                              }
                                                              target='_blank'
                                                              rel='noopener noreferrer'
                                                            >
                                                              Ver PDF pantalla
                                                              completa
                                                            </Button>
                                                          </Grid.Row>
                                                        </Grid>
                                                      ) : document.url !==
                                                          undefined &&
                                                        document.url !==
                                                          null && (
                                                        <Grid centered>
                                                          <Grid.Row>
                                                            <label>
                                                              {document.name}
                                                            </label>
                                                          </Grid.Row>
                                                          <Grid.Row>
                                                            <Image
                                                              title='Ver pantalla completa'
                                                              target='_blank'
                                                              rel='noopener noreferrer'
                                                              alt=''
                                                              href={
                                                                document.url
                                                              }
                                                              src={document.url}
                                                              size='medium'
                                                            />
                                                          </Grid.Row>
                                                        </Grid>
                                                      )}
                                                    </Grid.Column>
                                                  );
                                                }
                                              )}
                                            </Grid>
                                          </Container>
                                        )}
                                      </Grid>
                                    </Container>
                                  </Modal.Description>
                                )}
                              </Modal.Content>
                              <Modal.Actions>
                                <Button onClick={this.closeVerifyConfirmModal}>
                                  <Icon name='arrow alternate circle left' />{' '}
                                  Cancelar
                                </Button>
                                {this.state.showingOnTable !== 'FAIL' && (
                                  <Button
                                    onClick={() =>
                                      this.verifyUser(
                                        false,
                                        row.original.username,
                                        row.original.date,
                                        row.original.userVerificationType,
                                        row.original.status
                                      )
                                    }
                                    color='red'
                                  >
                                    <Icon name='remove' /> No
                                  </Button>
                                )}
                                {this.state.showingOnTable !== 'OK' && (
                                  <Button
                                    onClick={() =>
                                      this.verifyUser(
                                        true,
                                        row.original.username,
                                        row.original.date,
                                        row.original.userVerificationType,
                                        row.original.status
                                      )
                                    }
                                    color='green'
                                  >
                                    <Icon name='checkmark' /> Si
                                  </Button>
                                )}
                              </Modal.Actions>
                            </Modal>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                    <Grid.Column>
                      {this.state.expandedRow.original
                        .verificationOperationId !== undefined && (
                        <Segment>
                          <Feed
                            style={{
                              height: 211,
                              overflowX: 'auto',
                            }}
                          >
                            {this.state.oldOperationsMessages.map(
                              (oldMessage) => (
                                <Feed.Event key={oldMessage.timestamp}>
                                  <Feed.Label>
                                    <img alt='' src={avatarNull} />
                                  </Feed.Label>
                                  <Feed.Content>
                                    <Feed.Summary>
                                      <Feed.User>
                                        {oldMessage.userName ===
                                        sessionStorage.getItem('email')
                                          ? 'Yo'
                                          : oldMessage.userName}
                                      </Feed.User>{' '}
                                      <span style={{ fontWeight: 'normal' }}>
                                        {oldMessage.message}
                                      </span>{' '}
                                      {oldMessage.attachment !== undefined && (
                                        <Modal
                                          trigger={
                                            <div>
                                              {/* <Image
                                                    src={oldMessage.urlFile}
                                                    size='small'
                                                    as='a'
                                                    style={{ maxHeight: '200px' }}
                                                  />
                                                </List.Item> */}
                                              {/* <Icon
                                                  name="file image outline"
                                                  size="big"
                                                  color="blue"
                                                /> */}

                                              <Icon
                                                name='file image outline'
                                                color='blue'
                                                onClick={() => {
                                                  this.setState({
                                                    //showImage: true,
                                                    isPdf: oldMessage.attachment.includes(
                                                      'pdf'
                                                    )
                                                      ? true
                                                      : false,
                                                  });
                                                }}
                                              />
                                            </div>
                                          }
                                        >
                                          <Modal.Header>
                                            {'Ver archivo adjunto'}
                                          </Modal.Header>
                                          <Modal.Content>
                                            {!this.state.isPdf && (
                                              <Image
                                                centered
                                                src={oldMessage.urlFile}
                                                size='medium'
                                              />
                                            )}
                                            {this.state.isPdf && (
                                              <div textAlign='center'>
                                                <Grid centered>
                                                  <Document
                                                    file={oldMessage.urlFile}
                                                    externalLinkTarget='_blank'
                                                  >
                                                    <Page
                                                      pageNumber={1}
                                                      width={400}
                                                      height={400}
                                                    />
                                                  </Document>
                                                </Grid>
                                              </div>
                                            )}
                                          </Modal.Content>
                                        </Modal>
                                      )}
                                      {/* {oldMessage.attachment !== undefined && (
                                          <Popup //popup change
                                            trigger={
                                              <Button
                                                onClick={
                                                  () =>
                                                  window.open(
                                                    oldMessage.urlFile,
                                                    "_blank"
                                                  )
                                                }
                                                size="tiny"
                                                color="blue"
                                                icon
                                              >
                                                <Icon name="file image outline" />
                                              </Button>
                                            }
                                            content="Ver archivo adjunto"
                                          />
                                        )} */}
                                      <Feed.Date>
                                        {this.formatDate(
                                          new Date(oldMessage.timestamp)
                                        )}
                                      </Feed.Date>
                                    </Feed.Summary>
                                  </Feed.Content>
                                </Feed.Event>
                              )
                            )}
                          </Feed>
                        </Segment>
                      )}
                      {this.state.expandedRow.original
                        .verificationOperationId === undefined && (
                        <p style={{ textAlign: 'justify' }}>
                          <b>
                            Este proceso de verificación es muy antiguo, en
                            consecuencia, no posee la funcionalidad del chat.
                          </b>
                        </p>
                      )}
                    </Grid.Column>
                  </Grid>
                </Container>
              );
            } else if (
              this.state.expandedRow.original.userVerificationType === 'D'
            ) {
              return (
                <Container style={{ padding: 30 }}>
                  {(!this.state.showOperationMessages ||
                    !this.state.paymentInfoReady) && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Divider />
                  {this.state.expandedRow.original.verificationOperationId !==
                    undefined && (
                    <Grid columns='equal'>
                      <Grid.Column width={5} textAlign='justified'>
                        <Grid>
                          <Grid.Row>
                            <p style={{ textAlign: 'left' }}>
                              <b>Medio de Pago: </b>{' '}
                              {this.state.paymentInfoToConfirm}
                            </p>
                          </Grid.Row>
                          <Grid.Row centered>
                            <Modal
                              open={this.state.modalVerify}
                              onClose={this.closeVerifyConfirmModal}
                              trigger={
                                <Button
                                  onClick={() =>
                                    this.openVerifyConfirmModal(
                                      row.original,
                                      row.original.username
                                    )
                                  }
                                  labelPosition='left'
                                  type='submit'
                                  color='blue'
                                  size='tiny'
                                  icon
                                >
                                  <Icon name='payment' />
                                  Verificar medio de pago
                                </Button>
                              }
                            >
                              <Modal.Header>
                                <Icon name='payment' />
                                Verificación de medio de pago
                              </Modal.Header>
                              <Modal.Content scrolling>
                                <Modal.Description>
                                  <Header as='h4'>
                                    ¿Este medio de pago cumple con los
                                    requerimientos exigidos para poder ser
                                    verificado?
                                  </Header>
                                </Modal.Description>
                              </Modal.Content>
                              <Modal.Actions>
                                <Button onClick={this.closeVerifyConfirmModal}>
                                  <Icon name='arrow alternate circle left' />{' '}
                                  Cancelar
                                </Button>
                                {this.state.showingOnTable !== 'FAIL' && (
                                  <Button
                                    onClick={() =>
                                      this.verifyUser(
                                        false,
                                        row.original.username,
                                        row.original.date,
                                        row.original.userVerificationType,
                                        row.original.status
                                      )
                                    }
                                    color='red'
                                  >
                                    <Icon name='remove' /> No
                                  </Button>
                                )}
                                {this.state.showingOnTable !== 'OK' && (
                                  <Button
                                    onClick={() =>
                                      this.verifyUser(
                                        true,
                                        row.original.username,
                                        row.original.date,
                                        row.original.userVerificationType,
                                        row.original.status
                                      )
                                    }
                                    color='green'
                                  >
                                    <Icon name='checkmark' /> Si
                                  </Button>
                                )}
                              </Modal.Actions>
                            </Modal>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                      <Grid.Column width={5}>
                        <Form>
                          <Form.Field key={this.state.key}>
                            <TextArea
                              ref={this.typeOperation}
                              onChange={this.handleMessage}
                              placeholder=''
                              onKeyPress={this.enterPressed}
                            />
                          </Form.Field>
                          <Container>
                            <Grid columns='equal'>
                              <Grid.Row columns='equal'>
                                <Grid.Column width={8}>
                                  <Grid.Row>
                                    <Button
                                      as='label'
                                      size='mini'
                                      htmlFor='hidden-new-file'
                                      color='grey'
                                      loading={this.state.loadingNewFile}
                                      basic
                                    >
                                      Adjuntar documento
                                    </Button>
                                  </Grid.Row>
                                  {this.state
                                    .paymentVerificationSelectedFile !== null &&
                                    this.state
                                      .paymentVerificationSelectedFile !==
                                      undefined && (
                                      <Grid.Row>
                                        <Label style={{ width: 110 }}>
                                          {
                                            this.state
                                              .paymentVerificationSelectedFile
                                              .name
                                          }
                                        </Label>
                                      </Grid.Row>
                                    )}
                                </Grid.Column>
                                <Input
                                  id='hidden-new-file'
                                  key={this.state.keyFile}
                                  type='file'
                                  accept='image/*'
                                  onChange={this.paymentFileChangedHandler}
                                  style={{ display: 'none' }}
                                />
                                <Grid.Column width={6}>
                                  <Button
                                    size='mini'
                                    loading={this.state.loadingSendButton}
                                    onClick={() => {
                                      this.sendMessage(
                                        row.original.verificationOperationId,
                                        row.original.username,
                                        this.state.messageToSend
                                      );
                                    }}
                                    color='blue'
                                  >
                                    Enviar
                                  </Button>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Container>
                        </Form>
                      </Grid.Column>
                      <Grid.Column>
                        <Segment>
                          <Feed
                            style={{
                              height: 200,
                              overflowX: 'auto',
                            }}
                          >
                            {this.state.oldOperationsMessages.map(
                              (oldMessage) => (
                                <Feed.Event key={oldMessage.timestamp}>
                                  <Feed.Label>
                                    <img alt='' src={avatarNull} />
                                  </Feed.Label>
                                  <Feed.Content>
                                    <Feed.Summary>
                                      <Feed.User>
                                        {oldMessage.userName ===
                                        sessionStorage.getItem('email')
                                          ? 'Yo'
                                          : oldMessage.userName}
                                      </Feed.User>{' '}
                                      <span style={{ fontWeight: 'normal' }}>
                                        {oldMessage.message}
                                      </span>{' '}
                                      <Feed.Extra images>
                                        <a href='#'>
                                          {oldMessage.attachment !==
                                            undefined && (
                                            <Icon
                                              name='file image outline'
                                              color='blue'
                                              onClick={() => {
                                                this.setState({
                                                  showModalAttachment: true,
                                                  isPdf: oldMessage.attachment.includes(
                                                    'pdf'
                                                  )
                                                    ? true
                                                    : false,
                                                  urlAttachment:
                                                    oldMessage.urlFile,
                                                });
                                              }}
                                            />
                                          )}
                                          {oldMessage.attachment !==
                                            undefined && (
                                            <Modal
                                              open={
                                                this.state.showModalAttachment
                                              }
                                              onClose={
                                                !this.state.showModalAttachment
                                              }
                                            >
                                              <Modal.Header>
                                                {'Ver archivo adjunto'}
                                              </Modal.Header>
                                              <Modal.Content>
                                                {!this.state.isPdf && (
                                                  <Image
                                                    centered
                                                    src={
                                                      this.state.urlAttachment
                                                    }
                                                    size='medium'
                                                  />
                                                )}
                                                {this.state.isPdf && (
                                                  <div textAlign='center'>
                                                    <Grid centered>
                                                      <Document
                                                        file={
                                                          this.state
                                                            .urlAttachment
                                                        }
                                                        externalLinkTarget='_blank'
                                                      >
                                                        <Page
                                                          pageNumber={1}
                                                          width={400}
                                                          height={400}
                                                        />
                                                      </Document>
                                                    </Grid>
                                                  </div>
                                                )}
                                              </Modal.Content>
                                              <Modal.Actions>
                                                <Button
                                                  type='submit'
                                                  onClick={this.closeModal}
                                                  color='blue'
                                                >
                                                  cerrar
                                                </Button>
                                              </Modal.Actions>
                                            </Modal>
                                          )}
                                        </a>
                                      </Feed.Extra>
                                      <Feed.Date>
                                        {this.formatDate(
                                          new Date(oldMessage.timestamp)
                                        )}
                                      </Feed.Date>
                                    </Feed.Summary>
                                  </Feed.Content>
                                </Feed.Event>
                              )
                            )}
                          </Feed>
                        </Segment>
                      </Grid.Column>
                    </Grid>
                  )}
                </Container>
              );
            }
          }}
        />
      </div>
    );
  }
}
export default UserVerification;
