import React, { Component } from 'react';
import '../../Admin.css';
import {
  Container,
  Grid,
  Form,
  Label,
  Divider,
  Icon,
  Header,
  Loader,
  Dimmer,
  Select,
  Segment,
  Button,
  List,
  Message,
  Popup,
  Modal,
  Image,
  Menu,
  Flag,
} from 'semantic-ui-react';
import config from '../../../../services/config';
import user from '../../../../services/user';
import axios from 'axios';
import _ from 'underscore';
import attachments from '../../../../services/attachments';
import payment from '../../../../services/payment';
import otc from '../../../../services/otc';
import isoCurrencies from '../../../../common/ISO4217';
import Eth from '../../../../img/eth.svg';
import theter from '../../../../img/tether-seeklogo.svg';
import { Document, Page } from 'react-pdf';
import ReactTable from 'react-table';
import EditPersonalData from './EditPersonalData';
class UserBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'list-holder',
      listUsersEmail: [],
      userToSearch: '',
      userBalance: null,
      showUserBalance: false,
      userToSearchTrue: true,
      flagUser: '',
      userInfo: {},
      colorSelected2: '',
      colorlabel2: '',
      colorMessage: '',
      openModal: false,
      message: '',
      showMessage2: false,
      loadModal: false,
      loadSearch: false,
      showInactivationSuccessMessage: false,
      showInactivationErrorMessage: false,
      showActivationSuccessMessage: false,
      showActivationErrorMessage: false,
      showDeleteSuccessMessage: false,
      showDeleteErrorMessage: false,
      imagesUser: [],
      loadImages: false,
      identityURLToVerify: null,
      bankURLToVerify: null,
      selfURLToVerify: null,
      locationURLToVerify: null,
      otherDocumentsToShow: [],
      listPayments: [],
      segmentLoad: false,
      listPaymentsOther: [],
      loadImagesUser: false,
      editUser: false,
    };
    this.loadUserImages = this.loadUserImages.bind(this);
    this.constantPaymentsTypes = new Map();
    this.constantPaymentsTypes.set(
      'TRANSFER_WITH_SPECIFIC_BANK',
      'Desde el Mismo Banco'
    );
    this.constantPaymentsTypes.set(
      'TRANSFER_NATIONAL_BANK',
      'Desde otro Banco'
    );
    this.constantPaymentsTypes.set('CHECK_DEPOSIT', 'Depósito en Cheque');
    this.constantPaymentsTypes.set('CASH_DEPOSIT', 'Depósito en Efectivo');
    this.constantPaymentsTypes.set(
      'WIRE_TRANSFER',
      'Wire (Transferencia Bancaria)'
    );
    this.constantPaymentsTypes.set(
      'TRANSFER_INTERNATIONAL_BANK',
      'Banco Internacional (Swift o Aba)'
    );
    this.constantPaymentsTypes.set(
      'TRANSFER_TO_CRYPTO_WALLET',
      'Transferencia a Crypto Wallet'
    );
  }
  componentDidMount() {
    //this.getUsers();
  }

  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
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

  formatDateModal(date) {
    console.log('date sin new date', date);
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
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
  }

  getActualUserInfo = (allInfo) => {
    //	console.log("allInfo:", allInfo);
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
    var actualFamilyNameKey;
    var actualFamilyEmailKey;
    var actualUserLocalBitcoinKey;
    var actualUserFacebookKey;
    var actualUserAddressKey;
    var otherKeys = [];
    var actualNickName;
    var actualFlag;
    var actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration,
      actualTokens;
    var actualWallets;
    var actualMCWallets;
    var paymentCommissions = [];
    var isACompany = false;
    let imagesUser = [];
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('paymentCommissions')) {
        paymentCommissions.push(listKeys[i]);
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith('phone')) {
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
      } else if (listKeys[i].startsWith('flag')) {
        actualFlag = listKeys[i];
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
        actualMCWallets = listKeys[i];
      } else if (listKeys[i].startsWith('otherNotificationTokens')) {
        actualTokens = listKeys[i];
      } else if (listKeys[i].endsWith('URL')) {
        imagesUser.push(listKeys[i]);
      } else if (
        listKeys[i] !== 'masterWalletIds' &&
        listKeys[i] !== 'verification' &&
        !listKeys[i].endsWith('URL') &&
        listKeys[i] !== 'company' &&
        listKeys[i] !== 'automaticChange'
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
      actualFlag,
      paymentCommissions,
      actualBirthplaceKey,
      actualCountryOfBirthKey,
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
      actualMCWallets,
      actualTokens,
      'address',
      'operationAccount',
      'environment',
      'type',
      'active',
      'email'
    );
    var allKeys = listActualKeys.concat(otherKeys);
    if (imagesUser.length > 0) allKeys = allKeys.concat(imagesUser);
    var modifiedObj = _.pick(allInfo, [allKeys]);
    var normalizeObject = { other: [], images: [] };
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith('name')) {
        normalizeObject.name = value;
      } else if (key.startsWith('firstName')) {
        normalizeObject.firstName = value;
      } else if (key.startsWith('lastName')) {
        normalizeObject.lastName = value;
      } else if (key.startsWith('paymentCommissions')) {
        let ob = {};

        Object.entries(value).forEach(([k, v]) => {
          ob.currency = k;
          ob.commissionToDeposit = v.mcBuyBalancePercent;
          ob.commissionToTransfer = v.sendToPaymentPercent;

          normalizeObject.paymentCommissions = ob;
        });
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
      } else if (key.startsWith('phone')) {
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
        normalizeObject.wallets = value;
      } else if (key.startsWith('mcWallets')) {
        normalizeObject.mcWallets = value;
      } else if (key.startsWith('otherNotificationTokens')) {
        normalizeObject.otherNotificationTokens = value;
      } else if (key.startsWith('flag')) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'color') {
            normalizeObject.flag = v;
            this.setState({ flagUser: v });
          }
        });
        // normalizeObject.flag = value;
      } else if (key.startsWith('identityURL')) {
        normalizeObject.images.push({
          dataName: 'Identificación',
          dataValue: value,
        });
      } else if (key.startsWith('bankURL')) {
        normalizeObject.images.push({
          dataName: 'Comprobante Bancario',
          dataValue: value,
        });
      } else if (key.startsWith('locationURL')) {
        normalizeObject.images.push({
          dataName: 'Comprobante de Dirección',
          dataValue: value,
        });
      } else if (key.startsWith('selfURL')) {
        normalizeObject.images.push({
          dataName: 'Selfie con Identificación',
          dataValue: value,
        });
      } else if (
        !key.startsWith('paymentId') &&
        !key.startsWith('enableRequestDebitCards') &&
        !key.startsWith('enableOneDepositVerification') &&
        !key.startsWith('enableActivateGiftCards')
      ) {
        normalizeObject.other.push({ dataName: key, dataValue: value });
      }
    });
    normalizeObject.isACompany = isACompany;
    return normalizeObject;
  };

  getUserBalance = () => {
    this.setState({
      userToSearchTrue: true,
      loadImagesUser: false,
      showUserBalance: false,
      loadSearch: true,
      imagesUser: [],
      listPayments: [],
      listPaymentsOther: [],
      verification: [],
      active: 'list-holder',
      identityURLToVerify: '',
      bankURLToVerify: '',
      selfURLToVerify: '',
      locationURLToVerify: '',
      identityVerificationMcURLToVerify: '',
      selfieVerificationMcURLToVerify: '',
    });
    // user
    //   .getBalanceUser(this.state.userToSearch)
    //   .then((response) => {
    // console.log(response);
    user
      .getConfigUserGeneral(this.state.userToSearch)
      .then(async (resp) => {
        //this.getDataUser();
        var otherDocuments = [];
        if (resp.data.result.verification !== undefined) {
          if (resp.data.result.verification.D !== undefined) {
            this.setState({
              statusD: resp.data.result.verification.D.userVerificationStatus,
            });
          }
        }
        var actualUserInfo = this.getActualUserInfo(resp.data.result);
        console.log('actualUserInfo ', actualUserInfo);
        let oldAdrres = [];
        this.loadDatauserPayment(actualUserInfo);
        if (actualUserInfo.wallets !== undefined) {
          Object.entries(actualUserInfo.wallets).forEach(([key, value]) => {
            if (key === 'current') {
              Object.entries(value).forEach(([inerKey, inerValue]) => {
                if (inerValue.address !== undefined) {
                  actualUserInfo.address = inerValue.address;
                }
              });
            } else {
              Object.entries(value).forEach(([inerKey, inerValue]) => {
                if (inerValue.address !== undefined) {
                  oldAdrres.push({
                    create: inerKey,
                    value: inerValue.address,
                  });
                }
              });
            }
          });
        }
        let verification = [];
        if (resp.data.result.verification !== undefined) {
          Object.entries(resp.data.result.verification).forEach(
            ([key, value]) => {
              let info, timestamp, userVerificationStatus;
              Object.entries(value).forEach(([inerKey, inerValue]) => {
                if (inerKey === 'info') {
                  info = inerValue;
                }
                if (inerKey === 'timestamp') {
                  timestamp = inerValue;
                }
                if (inerKey === 'userVerificationStatus') {
                  userVerificationStatus = inerValue;
                }
              });
              if (key !== 'D' && key !== 'F') {
                verification.push({
                  type: key,
                  info: info,
                  timestamp: timestamp,
                  userVerificationStatus: userVerificationStatus,
                });
              }
            }
          );
        }
        actualUserInfo.oldAdrres = oldAdrres;
        actualUserInfo.verification = verification;
        //console.log('actualUserInfo ', actualUserInfo);
        //console.log(this.formatDateModal(new Date(actualUserInfo.birthdate)));
        this.setState({
          userInfo: actualUserInfo,
          showUserBalance: true,
          loadSearch: false,
          userToSearchTrue: false,
        });
        let identityURL = {};
        let bankURL = {};
        let locationURL = {};
        let selfURL = {};
        let identityVerificationMc = {};
        let selfieVerificationMc = {};

        if (
          resp.data.result.identityURL !== null &&
          resp.data.result.identityURL !== undefined
        ) {
          identityURL.isPdf = resp.data.result.identityURL.includes('pdf');
          identityURL.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.identityURL
          );
        } else {
          identityURL = null;
        }

        if (
          resp.data.result.bankURL !== null &&
          resp.data.result.bankURL !== undefined
        ) {
          bankURL.isPdf = resp.data.result.bankURL.includes('pdf');
          bankURL.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.bankURL
          );
        } else {
          bankURL = null;
        }

        if (
          resp.data.result.selfURL !== null &&
          resp.data.result.selfURL !== undefined
        ) {
          selfURL.isPdf = resp.data.result.selfURL.includes('pdf');
          selfURL.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.selfURL
          );
        } else {
          selfURL = null;
        }

        if (
          resp.data.result.locationURL !== null &&
          resp.data.result.locationURL !== undefined
        ) {
          locationURL.isPdf = resp.data.result.locationURL.includes('pdf');
          locationURL.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.locationURL
          );
        } else {
          locationURL = null;
        }

        if (
          resp.data.result.identityVerificationMc !== null &&
          resp.data.result.identityVerificationMc !== undefined
        ) {
          identityVerificationMc.isPdf =
            resp.data.result.identityVerificationMc.includes('pdf');
          identityVerificationMc.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.identityVerificationMc
          );
        } else {
          identityVerificationMc = null;
        }

        if (
          resp.data.result.selfieIdentityVerificationMc !== null &&
          resp.data.result.selfieIdentityVerificationMc !== undefined
        ) {
          selfieVerificationMc.isPdf =
            resp.data.result.selfieIdentityVerificationMc.includes('pdf');
          selfieVerificationMc.file = await this.getImageToShow(
            this.state.userToSearch,
            resp.data.result.selfieIdentityVerificationMc
          );
        } else {
          selfieVerificationMc = null;
        }

        this.setState(
          {
            loadImagesUser: true,
            identityURLToVerify: identityURL,
            bankURLToVerify: bankURL,
            selfURLToVerify: selfURL,
            locationURLToVerify: locationURL,
            identityVerificationMcURLToVerify: identityVerificationMc,
            selfieVerificationMcURLToVerify: selfieVerificationMc,
          },
          () => {
            this.loadUserImages(this.state.userToSearch);
          }
        );
      })
      .catch((error) => {
        //console.log(error);
      });
    this.setState({ userBalance: this.state.userInfo });
    // })
    // .catch((error) => {
    //   this.setState({ showUserBalance: true });
    //   //console.log(error);
    // });
  };

  async getImageToShow(username, fileName) {
    let result, type;

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

    return result;
  }
  pickUser = (e, data) => {
    this.setState({ userToSearch: data.value });
  };
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  async loadUserImages(username) {
    this.setState({ loadImages: true });
    let arrayImage = [];
    if (this.state.userInfo.images.length > 0) {
      for (let image of this.state.userInfo.images) {
        try {
          const response = await attachments.getAttachementUser(
            username,
            image.dataValue
          );
          let imageURL;
          let blob = new Blob([response.data], {
            type: response.headers['content-type'],
          });
          imageURL = URL.createObjectURL(blob);

          arrayImage.push({
            dataName: image.dataName,
            dataValue: imageURL,
            isPdf: image.dataValue.includes('pdf'),
          });
        } catch (error) {
          console.log(error);
          continue;
        }
      }
      let images = arrayImage.map((value) => {
        if (value.isPdf) {
          return (
            <List.Item onClick={() => window.open(value.dataValue, '_blank')}>
              <Document
                file={value.dataValue}
                externalLinkTarget='_blank'
                onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
              >
                <Page pageNumber={1} width={150} height={150} />
              </Document>
            </List.Item>
          );
        } else {
          return (
            <Modal
              closeIcon
              key={value.dataName}
              trigger={
                <List.Item>
                  <Image
                    src={value.dataValue}
                    size='small'
                    style={{
                      maxHeight: '100px',
                      maxWidth: '150px',
                      cursor: 'pointer',
                    }}
                  />
                </List.Item>
              }
            >
              <Modal.Header>{value.dataName}</Modal.Header>
              <Modal.Content>
                <Image centered src={value.dataValue} size='medium' />
              </Modal.Content>
            </Modal>
          );
        }
      });
      this.setState(
        {
          imagesUser: images,
        },
        () => {
          this.setState({ loadImages: false });
        }
      );
    } else this.setState({ loadImages: false });
  }

  openModal() {
    this.setState({ openModal: true });
    //	console.log("dentro del open");
  }
  editUser() {
    this.setState({
      editUser: !this.state.editUser,
    });
  }

  closeModal() {
    this.setState({ openModal: false, colorSelected2: '' });
  }

  addFlag() {
    let body = {
      operatorUserName: window.sessionStorage.getItem('username'),
      userName: this.state.userToSearch,
      flagColor: this.state.colorSelected2.toUpperCase(),
    };
    //	console.log(body);
    this.setState({ loadModal: true });
    user
      .addFlag(body)
      .then((res) => {
        //	console.log(res);
        if (res.data !== 'OK') {
          this.setState({
            loadModal: false,
            message: 'Error de la actualizacion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          this.setState({
            loadModal: false,
            message: 'Actualizacion exitosa',
            colorMessage: 'green',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
              colorSelected: '',
            });
            //	this.getUsersBoth();
            //this.getUsers();
            this.getUserBalance();
            this.closeModal();
          }, 5000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.toString().includes('network')) {
          this.setState({
            loadModal: false,
            message: 'Error de conexion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          this.setState({
            loadModal: false,
            message:
              'Ha ocurrido un error inesperado, por favor intente mas tarde',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({ message: '', showMessage2: false });
          }, 5000);
          this.closeModal();
        }
      });
  }

  handleColors2(e, data) {
    this.setState({
      colorSelected2: data.value,
      colorlabel2: data.text,
    });
  }

  handleSearchUser = (e) => {
    this.setState({ userToSearch: e.target.value });
  };

  handleItemClick(id, data) {
    this.setState({
      active: data.name,
      listPayments: [],
      listPaymentsOther: [],
    });
    if (data.name === 'list-other') {
      this.getOtherPayment();
    }
    if (data.name !== 'list-other') {
      this.getDataUser();
    }
  }
  getOtherPayment() {
    this.setState({ segmentLoad: true });
    let config = user.getConfigUserGeneral(this.state.userToSearch);
    let datauser;
    config
      .then((resp) => {
        datauser = user.getActualUserInfo(resp.data.result);
        let name = datauser.firstName;
        let lastname = datauser.lastName;
        let companyName =
          datauser.companyName !== undefined && datauser.companyName !== ''
            ? datauser.companyName
            : '';
        let list = otc.getUserTypePaymentsAdmin(this.state.userToSearch);
        list
          .then((res) => {
            Object.entries(res.data).forEach(([key, value]) => {
              let currency = key;
              let file;
              let currencyISO = isoCurrencies.ISOCURRENCIES.find(function (
                element
              ) {
                return element.key === key;
              });
              if (currencyISO !== undefined) file = currencyISO.flag;
              else if (key === 'ETH') file = Eth;
              let array = value;
              for (let val of array) {
                let type, id, propertyUser;
                let dat = '';
                let keys = Object.keys(val);
                if (keys.indexOf('type') === -1) {
                  type = 'Zelle';
                }

                if (
                  val.verified !== undefined ||
                  val.mcVerified !== undefined
                ) {
                  if (companyName === '') {
                    let fullname = name + ' ' + lastname;
                    if (val.accountHolderName !== undefined) {
                      let accountName = val.accountHolderName;
                      if (accountName.includes(fullname)) {
                        propertyUser = true;
                      } else if (accountName.includes(name)) {
                        propertyUser = true;
                      } else if (accountName.includes(lastname)) {
                        propertyUser = true;
                      } else {
                        propertyUser = false;
                      }
                    } else {
                      propertyUser = true;
                    }
                  } else {
                    let accountName = val.accountHolderName;
                    if (accountName.includes(companyName)) {
                      propertyUser = true;
                    } else {
                      if (companyName.indexOf(' ') !== -1) {
                        let splitCompany = companyName.split(' ');
                        for (let partialCompanyName of splitCompany) {
                          if (
                            partialCompanyName !== 'CA' &&
                            partialCompanyName !== 'SA' &&
                            partialCompanyName !== 'C.A' &&
                            partialCompanyName !== 'C.A.' &&
                            partialCompanyName !== 'S.A' &&
                            partialCompanyName !== 'S.A.'
                          ) {
                            if (
                              accountName
                                .toUpperCase()
                                .includes(partialCompanyName.toUpperCase())
                            ) {
                              propertyUser = true;
                            } else {
                              propertyUser = true;
                            }
                          }
                        }
                      } else {
                        propertyUser = false;
                      }
                    }
                  }
                } else {
                  propertyUser = false;
                }

                Object.entries(val).forEach(([data, val]) => {
                  if (data === 'type') {
                    if (this.constantPaymentsTypes.has(val)) {
                      type = this.constantPaymentsTypes.get(val);
                    } else {
                      type = val;
                    }
                  } else {
                    if (data !== 'id') {
                      if (data !== 'messages') {
                        if (data !== 'automaticCharge') {
                          if (data !== 'verified') {
                            if (data !== 'apiKey') {
                              if (data !== 'automatic') {
                                if (data !== 'accountCurrency') {
                                  if (data !== 'accountBalance') {
                                    if (data !== 'accountStatus') {
                                      if (data !== 'forceVerification') {
                                        if (dat === '') {
                                          dat = val;
                                        } else {
                                          dat = dat + ' - ' + val;
                                          if (data === 'cardNumber') {
                                            let aux =
                                              '**** **** **** ' + val.slice(-4);
                                            dat = dat.replace(val, aux);
                                          }
                                          if (data === 'accountHolderName') {
                                            let accountHolderName = val;
                                            if (
                                              dat.includes(accountHolderName)
                                            ) {
                                              dat = dat.replace(
                                                accountHolderName + ' -',
                                                ''
                                              );
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      id = val;
                    }
                  }
                });

                let obj = {
                  currency: currency,
                  file: file,
                  type: type,
                  data: dat,
                  id: id,
                  property: propertyUser,
                };
                if (obj.property !== true) {
                  this.setState({
                    listPaymentsOther: [...this.state.listPaymentsOther, obj],
                  });
                }
              }
            });
            this.setState({
              segmentLoad: false,
            });
          })
          .catch((error) => {
            this.setState({
              listPaymentsOther: [],
              segmentLoad: false,
              responseError: true,
              errorInRed: true,
            });
          });
      })
      .catch((error) => {
        this.setState({ segmentLoad: false, errorInRed: true });
      });
  }

  updateInfo(info) {
    this.setState({
      userInfo: info,
    });
  }
  getDataUser() {
    this.setState({ segmentLoad: true, listPayments: [] });
    let config = user.getConfigUserGeneral(this.state.userToSearch);
    let datauser;
    config
      .then((resp) => {
        // //console.log(resp.data.result);
        if (resp.data.result.verification !== undefined) {
          if (resp.data.result.verification.D !== undefined) {
            this.setState({
              statusD: resp.data.result.verification.D.userVerificationStatus,
            });
          }
        }
        datauser = user.getActualUserInfo(resp.data.result);
        // //console.log(datauser);
        let name = datauser.firstName;
        let lastname = datauser.lastName;
        let companyName =
          datauser.companyName !== undefined && datauser.companyName !== ''
            ? datauser.companyName
            : '';
        let list = otc.getUserTypePaymentsAdmin(this.state.userToSearch);
        list
          .then((res) => {
            //console.log(res);
            Object.entries(res.data).forEach(([key, value]) => {
              let currency = key;
              let currencyISO = isoCurrencies.ISOCURRENCIES.find(function (
                element
              ) {
                return element.key === key;
              });
              let file;
              if (currencyISO !== undefined) file = currencyISO.flag;
              else if (key === 'ETH') file = Eth;
              let array = value;
              for (let val of array) {
                // //console.log(val);
                let type, id, propertyUser;
                let dat = '';
                let keys = Object.keys(val);
                if (keys.indexOf('type') === -1) {
                  type = 'Zelle';
                }
                if (
                  val.verified !== undefined ||
                  val.mcVerified !== undefined
                ) {
                  if (companyName === '') {
                    let fullname = name + ' ' + lastname;
                    if (val.accountHolderName !== undefined) {
                      let accountName = String(val.accountHolderName);
                      if (accountName.includes(fullname)) {
                        propertyUser = true;
                      } else if (accountName.includes(name)) {
                        propertyUser = true;
                      } else if (accountName.includes(lastname)) {
                        propertyUser = true;
                      } else {
                        propertyUser = false;
                      }
                    } else {
                      propertyUser = true;
                    }
                  } else {
                    let accountName = String(val.accountHolderName);
                    if (accountName.includes(companyName)) {
                      propertyUser = true;
                    } else {
                      if (companyName.indexOf(' ') !== -1) {
                        let splitCompany = companyName.split(' ');
                        for (let partialCompanyName of splitCompany) {
                          if (
                            partialCompanyName !== 'CA' &&
                            partialCompanyName !== 'SA' &&
                            partialCompanyName !== 'C.A' &&
                            partialCompanyName !== 'C.A.' &&
                            partialCompanyName !== 'S.A' &&
                            partialCompanyName !== 'S.A.'
                          ) {
                            if (
                              accountName
                                .toUpperCase()
                                .includes(partialCompanyName.toUpperCase())
                            ) {
                              propertyUser = true;
                            } else {
                              propertyUser = true;
                            }
                          }
                        }
                      } else {
                        propertyUser = false;
                      }
                    }
                  }
                } else {
                  propertyUser = false;
                }
                Object.entries(val).forEach(([data, val]) => {
                  if (data === 'type') {
                    if (this.constantPaymentsTypes.has(val)) {
                      type = this.constantPaymentsTypes.get(val);
                    } else {
                      type = val;
                    }
                  } else {
                    if (data !== 'id') {
                      if (data !== 'messages') {
                        if (data !== 'automaticCharge') {
                          if (data !== 'verified') {
                            if (data !== 'apiKey') {
                              if (data !== 'automatic') {
                                if (data !== 'accountCurrency') {
                                  if (data !== 'accountBalance') {
                                    if (data !== 'accountStatus') {
                                      if (data !== 'forceVerification') {
                                        if (dat === '') {
                                          dat = val;
                                        } else {
                                          dat = dat + ' - ' + val;
                                          if (data === 'cardNumber') {
                                            let aux =
                                              '**** **** **** ' + val.slice(-4);
                                            dat = dat.replace(val, aux);
                                          }
                                          if (data === 'accountHolderName') {
                                            let accountHolderName = val;
                                            if (
                                              dat.includes(accountHolderName)
                                            ) {
                                              dat = dat.replace(
                                                accountHolderName + ' -',
                                                ''
                                              );
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      id = val;
                    }
                  }
                });
                let obj = {
                  currency: currency,
                  file: file,
                  type: type,
                  data: dat,
                  id: id,
                  property: propertyUser,
                };
                if (obj.property === true) {
                  // //console.log(obj);
                  this.setState({
                    listPayments: [...this.state.listPayments, obj],
                  });
                }
              }
            });
            this.setState({
              segmentLoad: false,
            });
          })
          .catch((error) => {
            this.setState({
              listPayments: [],
              segmentLoad: false,
              responseError: true,
              errorInRed: true,
            });
          });
      })
      .catch((error) => {
        this.setState({ segmentLoad: false, errorInRed: true });
      });
  }
  loadDatauserPayment(datauser) {
    let name = datauser.firstName;
    let lastname = datauser.lastName;
    let companyName =
      datauser.companyName !== undefined && datauser.companyName !== ''
        ? datauser.companyName
        : '';
    let list = otc.getUserTypePaymentsAdmin(this.state.userToSearch);
    list
      .then((res) => {
        //console.log(res);
        Object.entries(res.data).forEach(([key, value]) => {
          let currency = key;
          let currencyISO = isoCurrencies.ISOCURRENCIES.find(function (
            element
          ) {
            return element.key === key;
          });
          let file;
          if (currencyISO !== undefined && key !== 'ETH' && key !== 'USDT') {
            file = currencyISO.flag;
          } else if (key === 'ETH') {
            file = Eth;
          } else if (key === 'USDT') {
            file = theter;
          }
          let array = value;
          for (let val of array) {
            // //console.log(val);
            let type, id, propertyUser;
            let dat = '';
            let keys = Object.keys(val);
            if (keys.indexOf('type') === -1) {
              type = 'Zelle';
            }
            if (val.verified !== undefined || val.mcVerified !== undefined) {
              if (companyName === '') {
                let fullname = name + ' ' + lastname;
                if (val.accountHolderName !== undefined) {
                  let accountName = String(val.accountHolderName);
                  if (accountName.includes(fullname)) {
                    propertyUser = true;
                  } else if (accountName.includes(name)) {
                    propertyUser = true;
                  } else if (accountName.includes(lastname)) {
                    propertyUser = true;
                  } else {
                    propertyUser = false;
                  }
                } else {
                  propertyUser = true;
                }
              } else {
                let accountName = String(val.accountHolderName);
                if (accountName.includes(companyName)) {
                  propertyUser = true;
                } else {
                  if (companyName.indexOf(' ') !== -1) {
                    let splitCompany = companyName.split(' ');
                    for (let partialCompanyName of splitCompany) {
                      if (
                        partialCompanyName !== 'CA' &&
                        partialCompanyName !== 'SA' &&
                        partialCompanyName !== 'C.A' &&
                        partialCompanyName !== 'C.A.' &&
                        partialCompanyName !== 'S.A' &&
                        partialCompanyName !== 'S.A.'
                      ) {
                        if (
                          accountName
                            .toUpperCase()
                            .includes(partialCompanyName.toUpperCase())
                        ) {
                          propertyUser = true;
                        } else {
                          propertyUser = true;
                        }
                      }
                    }
                  } else {
                    propertyUser = false;
                  }
                }
              }
            } else {
              propertyUser = false;
            }
            Object.entries(val).forEach(([data, val]) => {
              if (data === 'type') {
                if (this.constantPaymentsTypes.has(val)) {
                  type = this.constantPaymentsTypes.get(val);
                } else {
                  type = val;
                }
              } else {
                if (data !== 'id') {
                  if (data !== 'messages') {
                    if (data !== 'automaticCharge') {
                      if (data !== 'verified') {
                        if (data !== 'apiKey') {
                          if (data !== 'automatic') {
                            if (data !== 'accountCurrency') {
                              if (data !== 'accountBalance') {
                                if (data !== 'accountStatus') {
                                  if (data !== 'forceVerification') {
                                    if (dat === '') {
                                      dat = val;
                                    } else {
                                      dat = dat + ' - ' + val;
                                      if (data === 'cardNumber') {
                                        let aux =
                                          '**** **** **** ' + val.slice(-4);
                                        dat = dat.replace(val, aux);
                                      }
                                      if (data === 'accountHolderName') {
                                        let accountHolderName = val;
                                        if (dat.includes(accountHolderName)) {
                                          dat = dat.replace(
                                            accountHolderName + ' -',
                                            ''
                                          );
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  id = val;
                }
              }
            });
            let obj = {
              currency: currency,
              file: file,
              type: type,
              data: dat,
              id: id,
              property: propertyUser,
            };
            if (obj.property === true) {
              // //console.log(obj);
              this.setState({
                listPayments: [...this.state.listPayments, obj],
              });
            }
          }
        });
        this.setState({
          segmentLoad: false,
        });
      })
      .catch((error) => {
        this.setState({
          listPayments: [],
          segmentLoad: false,
          responseError: true,
          errorInRed: true,
        });
      });
  }
  render() {
    let active = this.state.active;
    const currensTableHeaders = [
      {
        Header: 'Moneda',
        accessor: 'currency',
        Cell: (row) => (
          <div>
            {row.value !== 'ETH' && row.value !== 'USDT' && (
              <Flag name={row.original.file} />
            )}
            {(row.value === 'ETH' || row.value === 'USDT') && (
              <Image src={row.original.file} className={'iconEth'} />
            )}
            {row.value}
          </div>
        ),
        width: 90,
      },
      {
        Header: 'Datos',
        accessor: 'data',
        width: 900,
      },
      //   {
      //     Header: t("profile.listAccountOther.currentTableHeaders.action"),
      //     width: 90,
      //     Cell: row => (
      //       <Button
      //         icon="cancel"
      //         circular
      //         compact
      //         size="mini"
      //         color="red"
      //         id={row.original.id}
      //         name={row.value}
      //         title={t("profile.listAccountOther.buttonDelete")}
      //         onClick={this.deleteAccount.bind(this)}
      //       />
      //     )
      //   }
    ];
    const currensTableHeadersOther = [
      {
        Header: 'Moneda',
        accessor: 'currency',
        Cell: (row) => (
          <div>
            {row.value !== 'ETH' && <Flag name={row.original.file} />}
            {row.value === 'ETH' && (
              <Image src={row.original.file} className={'iconEth'} />
            )}
            {row.value}
          </div>
        ),
        width: 90,
      },
      {
        Header: 'Datos',
        accessor: 'data',
        width: 900,
      },
      //   {
      //     Header: t("profile.listAccountOther.currentTableHeaders.action"),
      //     Cell: row => (
      //       <Button
      //         circular
      //         compact
      //         size="mini"
      //         color="red"
      //         icon="cancel"
      //         id={row.original.id}
      //         name={row.value}
      //         title={t("profile.listAccountOther.buttonDelete")}
      //         onClick={this.deleteAccount.bind(this)}
      //       />
      //     )
      //   }
    ];
    const verification = [
      {
        Header: 'Tipo de Verificación',
        accessor: 'type',
        Cell: (row) => (
          <div>
            <p>
              {row.value}
              {' - '}
              {row.value === 'A'
                ? 'Verificación del Correo electrónico del usuario'
                : row.value === 'B'
                ? 'Verificación del número de teléfono del usuario'
                : row.value === 'C'
                ? 'Verificación inicial de Cuenta de usuario'
                : row.value === 'E'
                ? 'Verificación de Cuenta de usuario MoneyClick'
                : ''}
            </p>
          </div>
        ),
        width: 500,
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        Cell: (row) => (
          <div>
            <p>{this.formatDate(new Date(row.value))}</p>
          </div>
        ),
        width: 200,
      },
      {
        Header: 'Estatus',
        accessor: 'userVerificationStatus',
        Cell: (row) => (
          <div>
            <p>
              {row.value === 'OK'
                ? 'Verificado'
                : row.value === 'FAIL'
                ? 'FALLIDO'
                : 'PROCESANDO'}
            </p>
          </div>
        ),
        width: 200,
      },
    ];
    const listColors = [
      {
        key: 'select',
        text: 'seleccione',
        value: null,
        //description: "",
      },
      {
        key: 'red',
        text: 'Rojo',
        value: 'red',
        //description: "Usuario Estafador",
      },
      {
        key: 'purple',
        text: 'Violeta',
        value: 'purple',
        //description: "Usuario problemático",
      },
      {
        key: 'green',
        text: 'Verde',
        value: 'green',
        //description: "Usuario Confiable",
      },
      {
        key: 'yellow',
        text: 'Amarillo',
        value: 'yellow',
        //description: "Usuario Sospechoso",
      },
      {
        key: 'black',
        text: 'Negro',
        value: 'black',
        //description: "Usuario Suspendido",
      },
      {
        key: 'orange',
        text: 'Naranja',
        value: 'orange',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'blue',
        text: 'Azul',
        value: 'blue',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'grey',
        text: 'Gris',
        value: 'grey',
        //	description: "Usuario en Investigacion",
      },
    ];
    let inactivationSuccessMessage,
      inactivationErrorMessage,
      activationSuccessMessage,
      activationErrorMessage,
      deleteSuccessMessage,
      deleteErrorMessage;
    if (this.state.showInactivationErrorMessage) {
      inactivationErrorMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>No se pudo inactivar el usuario en este momento.</p>
        </Message>
      );
    }
    if (this.state.showInactivationSuccessMessage) {
      inactivationSuccessMessage = (
        <Message positive>
          <Message.Header>Usuario inactivado</Message.Header>
          <p>El usuario ha sido inactivado exitosamente.</p>
        </Message>
      );
    }
    if (this.state.showActivationErrorMessage) {
      activationErrorMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>No se pudo activar el usuario en este momento.</p>
        </Message>
      );
    }
    if (this.state.showActivationSuccessMessage) {
      activationSuccessMessage = (
        <Message positive>
          <Message.Header>Usuario activado</Message.Header>
          <p>El usuario ha sido activado exitosamente.</p>
        </Message>
      );
    }
    if (this.state.showDeleteErrorMessage) {
      deleteErrorMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>No se pudo eliminar el usuario en este momento.</p>
        </Message>
      );
    }
    if (this.state.showDeleteSuccessMessage) {
      deleteSuccessMessage = (
        <Message positive>
          <Message.Header>Usuario eliminado</Message.Header>
          <p>El usuario ha sido eliminado exitosamente.</p>
        </Message>
      );
    }

    return (
      <div>
        {/* {!this.state.showUserSearch && (
					<Dimmer active inverted>
						<Loader inverted>Cargando...</Loader>
					</Dimmer>
				)} */}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Usuario a consultar:</label>
              <input
                placeholder='Indique un usuario'
                onChange={this.handleSearchUser}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.userToSearch === ''}
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={this.getUserBalance.bind(this)}
              loading={this.state.loadSearch}
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
            <Form.Field>
              {this.state.userToSearch !== '' && (
                <Button
                  disabled={
                    this.state.userBalance === null &&
                    this.state.userToSearch.length < 12
                    //this.state.userToSearchTrue
                  }
                  color='blue'
                  style={{ marginTop: 23 }}
                  onClick={this.openModal.bind(this)}
                >
                  Agregar Alerta
                </Button>
              )}
            </Form.Field>
            <Form.Field>
              {this.state.showUserBalance && (
                <Button
                  color='blue'
                  style={{ marginTop: 23 }}
                  onClick={this.editUser.bind(this)}
                >
                  {!this.state.editUser
                    ? 'Habilitar Edición'
                    : 'Deshabilitar Edición'}
                </Button>
              )}
            </Form.Field>
          </Form.Group>
          {inactivationSuccessMessage}
          {inactivationErrorMessage}
          {activationSuccessMessage}
          {activationErrorMessage}
        </Form>
        {this.state.userBalance !== null && (
          <div>
            {!this.state.showUserBalance && (
              <Dimmer active inverted>
                <Loader inverted>Cargando...</Loader>
              </Dimmer>
            )}
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Form>
                    {this.state.userInfo.flag !== '' &&
                      this.state.userInfo.flag !== undefined &&
                      this.state.userInfo.flag !== null && (
                        <Popup
                          position='top center'
                          trigger={
                            <Segment
                              textAlign='center'
                              color={this.state.userInfo.flag.toLowerCase()}
                              inverted
                            >
                              {this.state.userInfo.flag === 'GREEN'
                                ? 'Usuario Confiable'
                                : this.state.userInfo.flag === 'PURPLE'
                                ? 'Usuario problemático'
                                : this.state.userInfo.flag === 'RED'
                                ? 'Usuario Estafador'
                                : this.state.userInfo.flag === 'BLACK'
                                ? 'Usuario Suspendido'
                                : this.state.userInfo.flag === 'ORANGE'
                                ? 'Usuario en Investigación'
                                : this.state.userInfo.flag === 'YELLOW'
                                ? 'Usuario Sospechoso'
                                : this.state.userInfo.flag === 'BLUE'
                                ? 'Usuario VIP'
                                : this.state.userInfo.flag === 'GREY'
                                ? 'Usuario de pruebas'
                                : ''}
                            </Segment>
                          }
                          content='Tipo de Alerta'
                        />
                      )}

                    {this.state.userInfo.isACompany && (
                      <Divider horizontal>
                        <Header as='h4'>Datos de la empresa</Header>
                      </Divider>
                    )}
                    {this.state.userInfo.isACompany && (
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>Nombre de la empresa</label>
                          <p className='infoUserParagraph'>
                            {this.state.userInfo.companyName !== undefined &&
                            this.state.userInfo.companyName !== ''
                              ? this.state.userInfo.companyName
                              : 'No posee'}
                          </p>
                        </Form.Field>
                        <Form.Field>
                          <label>Tipo de registro fiscal</label>
                          <p className='infoUserParagraph'>
                            {this.state.userInfo.companyTypeOfFiscalRecord !==
                              undefined &&
                            this.state.userInfo.companyTypeOfFiscalRecord !== ''
                              ? this.state.userInfo.companyTypeOfFiscalRecord
                              : 'No posee'}
                          </p>
                        </Form.Field>
                        <Form.Field>
                          <label>Número de registro fiscal</label>
                          <p className='infoUserParagraph'>
                            {this.state.userInfo.companyNumberOfFiscalRecord !==
                              undefined &&
                            this.state.userInfo.companyNumberOfFiscalRecord !==
                              ''
                              ? this.state.userInfo.companyNumberOfFiscalRecord
                              : 'No posee'}
                          </p>
                        </Form.Field>
                        <Form.Field>
                          <label>Año de registro</label>
                          <p className='infoUserParagraph'>
                            {this.state.userInfo.companyYearRegistration !==
                              undefined &&
                            this.state.userInfo.companyYearRegistration !== ''
                              ? this.state.userInfo.companyYearRegistration
                              : 'No posee'}
                          </p>
                        </Form.Field>
                      </Form.Group>
                    )}

                    <Divider horizontal>
                      <Header as='h4'>Datos personales</Header>
                    </Divider>
                    {!this.state.editUser && (
                      <div>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>Nombres</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.firstName !== undefined &&
                              this.state.userInfo.firstName !== ''
                                ? this.state.userInfo.firstName
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Apellidos</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.lastName !== undefined &&
                              this.state.userInfo.lastName !== ''
                                ? this.state.userInfo.lastName
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Sexo</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.gender !== undefined &&
                              this.state.userInfo.gender !== ''
                                ? this.state.userInfo.gender === 'male'
                                  ? 'Masculino'
                                  : 'Femenino'
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Tipo de documento</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.typeDocumentIdentity !==
                                undefined &&
                              this.state.userInfo.typeDocumentIdentity !== ''
                                ? this.state.userInfo.typeDocumentIdentity
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Número de documento</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.numberDocumentIdentity !==
                                undefined &&
                              this.state.userInfo.numberDocumentIdentity !== ''
                                ? this.state.userInfo.numberDocumentIdentity
                                : 'No posee'}
                            </p>
                          </Form.Field>
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>Fecha de nacimiento</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.birthdate !== undefined &&
                              this.state.userInfo.birthdate !== ''
                                ? this.formatDateModal(
                                    new Date(
                                      this.state.userInfo.birthdate.replace(
                                        /-/g,
                                        '/'
                                      )
                                    )
                                  )
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>País de nacimiento</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.countryOfBirth !==
                                undefined &&
                              this.state.userInfo.countryOfBirth !== ''
                                ? this.state.userInfo.countryOfBirth
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Lugar de nacimiento</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.birthplace !== undefined &&
                              this.state.userInfo.birthplace !== ''
                                ? this.state.userInfo.birthplace
                                : 'No posee'}
                            </p>
                          </Form.Field>

                          <Form.Field>
                            <label>Teléfono</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.phone !== undefined &&
                              this.state.userInfo.phone !== '' &&
                              this.state.userInfo.phone !== '0'
                                ? this.state.userInfo.phone
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Dirección</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.userDirection !==
                                undefined &&
                              this.state.userInfo.userDirection !== ''
                                ? this.state.userInfo.userDirection
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          {/* <Form.Field>
												<label>Usuario localBitcoin</label>
												<p className='infoUserParagraph'>
													{this.state.userInfo.userLocalBitcoin !== undefined &&
													this.state.userInfo.userLocalBitcoin !== ""
														? this.state.userInfo.userLocalBitcoin
														: "No posee"}
												</p>
											</Form.Field> */}
                        </Form.Group>
                        <Form.Group widths='equal'>
                          <Form.Field>
                            <label>Email</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.email !== undefined &&
                              this.state.userInfo.email !== ''
                                ? this.state.userInfo.email
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Pregunta de seguridad</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.questionSecurity !==
                                undefined &&
                              this.state.userInfo.questionSecurity !== ''
                                ? '**************' // this.state.userInfo.questionSecurity
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Respuesta de seguridad</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.answerSecurity !==
                                undefined &&
                              this.state.userInfo.answerSecurity !== ''
                                ? '**************' //this.state.userInfo.answerSecurity
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Familiar de contacto</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.familyName !== undefined &&
                              this.state.userInfo.familyName !== ''
                                ? this.state.userInfo.familyName
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          <Form.Field>
                            <label>Email del contacto</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.familyEmail !== undefined &&
                              this.state.userInfo.familyEmail !== ''
                                ? this.state.userInfo.familyEmail
                                : 'No posee'}
                            </p>
                          </Form.Field>
                          {/* <Form.Field>
												<label>Alerta de Usuario</label>
												<Label
													circular
													color={this.state.flagUser.toLowerCase()}
												/> 
											</Form.Field>*/}
                        </Form.Group>
                      </div>
                    )}
                    {this.state.editUser && (
                      <EditPersonalData
                        userInfo={this.state.userInfo}
                        updateInfo={this.updateInfo.bind(this)}
                      ></EditPersonalData>
                    )}

                    <Divider horizontal>
                      <Header as='h4'>Datos del usuario</Header>
                    </Divider>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Email</label>
                        {this.state.userInfo.email !== undefined &&
                        this.state.userInfo.email !== ''
                          ? this.state.userInfo.email
                          : 'No posee'}
                      </Form.Field>
                      <Form.Field style={{ marginRight: -100 }}>
                        <label>Address</label>
                        {this.state.userInfo.address !== undefined &&
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
                        {this.state.userInfo.active ? 'Activo' : 'Inactivo'}
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <label>Nombre de usuario</label>
                        {this.state.userInfo.nickname !== undefined &&
                        this.state.userInfo.nickname !== ''
                          ? this.state.userInfo.nickname
                          : 'No posee'}
                      </Form.Field>
                      <Form.Field>
                        <label>Ambiente del usuario</label>
                        {this.state.userInfo.environment === 'NONE'
                          ? 'Ninguno'
                          : this.state.userInfo.environment}
                      </Form.Field>
                      <Form.Field>
                        <label>Cuenta de operación</label>
                        {this.state.userInfo.operationAccount === 'SELF'
                          ? 'Propia'
                          : this.state.userInfo.operationAccount}
                      </Form.Field>
                      {this.state.userInfo.wallets !== undefined &&
                        this.state.userInfo.oldAdrres !== undefined && (
                          <Form.Field style={{ marginRight: -60 }}>
                            <label>Addresses anteriores</label>
                            <List
                              divided
                              relaxed
                              style={{
                                maxHeight: '100px',
                                maxWidth: '350px',
                                overflow: 'auto',
                              }}
                            >
                              {this.state.userInfo.oldAdrres.map(
                                (item, index) => {
                                  return (
                                    <List.Item key={index}>
                                      <List.Content>
                                        <List.Header>{item.value}</List.Header>
                                        <List.Description>
                                          Creación:{' '}
                                          {new Date(
                                            item.create
                                          ).toLocaleDateString('en-US')}
                                        </List.Description>
                                      </List.Content>
                                    </List.Item>
                                  );
                                }
                              )}
                            </List>
                          </Form.Field>
                        )}
                      <Form.Field />
                    </Form.Group>
                    {/* {this.state.imagesUser.length > 0 && (
											<Grid.Row style={{ paddingTop: "0px" }}>
												<Grid.Column
													largeScreen={16}
													computer={16}
													mobile={16}
													tablet={16}>
													{this.state.loadImages && (
														<Dimmer active inverted>
															<Loader inverted>Cargando...</Loader>
														</Dimmer>
													)}
													<Header as='h5' textAlign='center'>
														Documentos
														<Divider hidden />
														<List horizontal>{this.state.imagesUser}</List>
													</Header>
												</Grid.Column>
											</Grid.Row>
										)} */}
                    {this.state.userInfo &&
                      this.state.userInfo.other &&
                      this.state.userInfo.other.length > 0 && (
                        <Container>
                          <Divider horizontal>
                            <Header as='h4'>Datos adicionales</Header>
                          </Divider>
                          <Form.Group widths={5}>
                            {this.state.userInfo.other.map((k) => {
                              return (
                                <Form.Field>
                                  <label>
                                    {k.dataName === 'nickname'
                                      ? 'Nombre de usuario'
                                      : k.dataName === 'operatorName'
                                      ? 'Nombre del operador'
                                      : k.dataName === 'creationTimestamp'
                                      ? 'Fecha de creación'
                                      : k.dataName === 'sourceSignin'
                                      ? 'Fuente de registro'
                                      : k.dataName === 'createdFromMCSend'
                                      ? 'Creado desde envio MC'
                                      : k.dataName ===
                                        'selfieIdentityVerificationMc'
                                      ? 'Selfie de Identificación MC'
                                      : k.dataName === 'identityVerificationMc'
                                      ? 'Identificación MC'
                                      : k.dataName === 'referralCode'
                                      ? 'Código de Referido'
                                      : k.dataName}
                                  </label>
                                  {k.dataName === 'creationTimestamp' ? (
                                    <p className='infoUserParagraph'>
                                      {this.formatDate(new Date(k.dataValue))}
                                    </p>
                                  ) : (
                                    <p className='infoUserParagraph'>
                                      {k.dataName ===
                                        'selfieIdentityVerificationMc' ||
                                      k.dataName === 'identityVerificationMc'
                                        ? 'SI'
                                        : k.dataValue}
                                    </p>
                                  )}
                                </Form.Field>
                              );
                            })}
                          </Form.Group>
                        </Container>
                      )}
                    {this.state.userInfo &&
                      this.state.userInfo.verification &&
                      this.state.userInfo.verification.length > 0 && (
                        <div>
                          <Container>
                            <Divider horizontal>
                              <Header as='h4'>Datos de Verificación</Header>
                            </Divider>
                          </Container>
                          <Container>
                            <Segment basic padded>
                              <ReactTable
                                className='transactionTable'
                                data={this.state.userInfo.verification}
                                columns={verification}
                                defaultPageSize={5}
                                previousText='Anterior'
                                nextText='Siguiente'
                                loadingText='Cargando...'
                                noDataText='No hay medios de pagos registrados'
                                pageText='Página'
                                ofText='de'
                                rowsText='filas'
                                pageJumpText='ir a la página'
                                rowsSelectorText='filas por página'
                              />
                            </Segment>
                          </Container>
                        </div>
                      )}
                    {this.state.userInfo &&
                      this.state.userInfo.verification &&
                      this.state.userInfo.verification.length > 0 && (
                        <div>
                          <Container>
                            <Divider horizontal>
                              <Header as='h4'>
                                Datos de Medios de Pagos Afiliados
                              </Header>
                            </Divider>
                          </Container>
                          <Menu>
                            <Menu.Item
                              content={'Propios / Para Comprar y Vender'}
                              name='list-holder'
                              active={active === 'list-holder'}
                              onClick={this.handleItemClick.bind(this)}
                              style={{
                                maxWidth: window.innerWidth <= 430 ? 90 : '',
                                padding: window.innerWidth <= 430 ? 5 : '',
                                textAlign: 'center',
                              }}
                            ></Menu.Item>
                            <Menu.Item
                              content={'Terceros / Para Enviar Dinero'}
                              name='list-other'
                              active={active === 'list-other'}
                              onClick={this.handleItemClick.bind(this)}
                              style={{
                                maxWidth: window.innerWidth <= 430 ? 90 : '',
                                padding: window.innerWidth <= 430 ? 5 : '',
                                textAlign: 'center',
                              }}
                            ></Menu.Item>
                          </Menu>
                          <Segment basic>
                            {this.state.active === 'list-holder' && (
                              <Container>
                                {/* {this.state.statusD === "OK" && this.state.errorInRed === false && ( */}
                                <Segment
                                  basic
                                  padded
                                  loading={this.state.segmentLoad}
                                >
                                  <ReactTable
                                    className='transactionTable'
                                    data={this.state.listPayments}
                                    columns={currensTableHeaders}
                                    defaultPageSize={5}
                                    previousText='Anterior'
                                    nextText='Siguiente'
                                    loadingText='Cargando...'
                                    noDataText='No hay medios de pagos registrados'
                                    pageText='Página'
                                    ofText='de'
                                    rowsText='filas'
                                    pageJumpText='ir a la página'
                                    rowsSelectorText='filas por página'
                                    defaultFilterMethod={(
                                      filter,
                                      row,
                                      column
                                    ) => {
                                      const id = filter.pivotId || filter.id;
                                      return row[id] !== undefined
                                        ? String(row[id]).startsWith(
                                            filter.value.toUpperCase()
                                          )
                                        : true;
                                    }}
                                  />
                                </Segment>
                                {/* )} */}
                              </Container>
                            )}
                            {this.state.active === 'list-other' && (
                              <Container>
                                <Segment
                                  basic
                                  padded
                                  loading={this.state.segmentLoad}
                                >
                                  <ReactTable
                                    className='transactionTable'
                                    data={this.state.listPaymentsOther}
                                    columns={currensTableHeadersOther}
                                    defaultPageSize={5}
                                    previousText='Anterior'
                                    nextText='Siguiente'
                                    loadingText='Cargando...'
                                    noDataText='No hay medios de pagos registrados'
                                    pageText='Página'
                                    ofText='de'
                                    rowsText='filas'
                                    pageJumpText='ir a la página'
                                    rowsSelectorText='filas por página'
                                    defaultFilterMethod={(
                                      filter,
                                      row,
                                      column
                                    ) => {
                                      const id = filter.pivotId || filter.id;
                                      return row[id] !== undefined
                                        ? String(row[id]).startsWith(
                                            filter.value.toUpperCase()
                                          )
                                        : true;
                                    }}
                                  />
                                </Segment>
                              </Container>
                            )}
                          </Segment>
                        </div>
                      )}
                  </Form>
                  <Divider />
                  <Segment loading={!this.state.loadImagesUser}>
                    <Container textAlign='center'>
                      <Grid centered columns={2}>
                        <Grid.Column>
                          <Grid.Row>
                            <div style={{ textAlign: 'center' }}>
                              <p>
                                <b style={{ color: '#207ef2' }}>
                                  {this.state.userInfo.isACompany
                                    ? 'Documento de identidad (Debe coincidir con la persona firmante en el registro mercantil)'
                                    : 'Documento de identidad'}
                                </b>
                              </p>
                              {this.state.identityURLToVerify !== undefined &&
                              this.state.identityURLToVerify !== null &&
                              this.state.identityURLToVerify !== '' &&
                              this.state.identityURLToVerify.isPdf ? ( // primer caso de pdf
                                <div>
                                  <List.Item>
                                    <Document
                                      file={this.state.identityURLToVerify.file}
                                      externalLinkTarget='_blank'
                                    >
                                      <Page
                                        pageNumber={1}
                                        width={400}
                                        height={400}
                                      />
                                    </Document>
                                  </List.Item>

                                  {this.state.identityURLToVerify.file !==
                                    '' && (
                                    <Button
                                      as='a'
                                      href={this.state.identityURLToVerify.file}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                    >
                                      Descargar PDF
                                    </Button>
                                  )}
                                </div>
                              ) : this.state.identityURLToVerify !==
                                  undefined &&
                                this.state.identityURLToVerify !== null &&
                                this.state.identityURLToVerify !== '' ? (
                                <Modal
                                  //key={id}
                                  trigger={
                                    // <List.Item>
                                    <Image
                                      title='Ver pantalla completa'
                                      src={this.state.identityURLToVerify.file}
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
                                      src={this.state.identityURLToVerify.file}
                                      size='huge'
                                    />
                                  </Modal.Content>
                                </Modal>
                              ) : (
                                <Segment size='tiny' placeholder>
                                  <Header icon>
                                    <Icon name='file image outline' />
                                    El usuario no ha subido este documento.
                                  </Header>
                                </Segment>
                              )}
                            </div>
                          </Grid.Row>
                        </Grid.Column>
                        <Grid.Column>
                          <Grid.Row>
                            <div style={{ textAlign: 'center' }}>
                              <p>
                                <b style={{ color: '#207ef2' }}>
                                  {this.state.userInfo.isACompany
                                    ? 'Comprobante de cuenta jurídica'
                                    : 'Comprobante de cuenta bancaria'}
                                </b>
                              </p>
                              {this.state.bankURLToVerify !== undefined &&
                              this.state.bankURLToVerify !== null &&
                              this.state.bankURLToVerify !== '' &&
                              this.state.bankURLToVerify.isPdf ? ( // segundo caso de pdf
                                <div>
                                  <List.Item>
                                    <Document
                                      file={this.state.bankURLToVerify.file}
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
                                    href={this.state.bankURLToVerify.file}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    Descargar PDF
                                  </Button>
                                </div>
                              ) : this.state.bankURLToVerify !== undefined &&
                                this.state.bankURLToVerify !== null &&
                                this.state.bankURLToVerify !== '' ? (
                                <Modal
                                  //key={id}
                                  trigger={
                                    // <List.Item>
                                    <Image
                                      title='Ver pantalla completa'
                                      src={this.state.bankURLToVerify.file}
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
                                      src={this.state.bankURLToVerify.file}
                                      size='huge'
                                    />
                                  </Modal.Content>
                                </Modal>
                              ) : (
                                <Segment size='tiny' placeholder>
                                  <Header icon>
                                    <Icon name='file image outline' />
                                    El usuario no ha subido este documento.
                                  </Header>
                                </Segment>
                              )}
                            </div>
                          </Grid.Row>
                        </Grid.Column>
                        {this.state.locationURLToVerify !== undefined &&
                          this.state.locationURLToVerify !== null &&
                          this.state.locationURLToVerify !== '' && (
                            <Grid.Column>
                              <Grid.Row>
                                <div style={{ textAlign: 'center' }}>
                                  <p>
                                    <b style={{ color: '#207ef2' }}>
                                      {this.state.userInfo.isACompany
                                        ? 'Registro mercantil (con sello húmedo)'
                                        : 'Comprobante de dirección'}
                                    </b>
                                  </p>
                                  {this.state.locationURLToVerify.isPdf ? ( //tercer caso pdf
                                    <div>
                                      <List.Item>
                                        <Document
                                          file={
                                            this.state.locationURLToVerify.file
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
                                          this.state.locationURLToVerify.file
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                      >
                                        Descargar PDF
                                      </Button>
                                    </div>
                                  ) : this.state.locationURLToVerify !==
                                      undefined &&
                                    this.state.locationURLToVerify !== null &&
                                    this.state.locationURLToVerify !== '' ? (
                                    <Modal
                                      //key={id}
                                      trigger={
                                        // <List.Item>
                                        <Image
                                          title='Ver pantalla completa'
                                          src={
                                            this.state.locationURLToVerify.file
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
                                            this.state.locationURLToVerify.file
                                          }
                                          size='huge'
                                        />
                                      </Modal.Content>
                                    </Modal>
                                  ) : (
                                    <Segment size='tiny' placeholder>
                                      <Header icon>
                                        <Icon name='file image outline' />
                                        El usuario no ha subido este documento.
                                      </Header>
                                    </Segment>
                                  )}
                                </div>
                              </Grid.Row>
                            </Grid.Column>
                          )}
                        <Grid.Column>
                          <Grid.Row>
                            <div style={{ textAlign: 'center' }}>
                              <p>
                                <b style={{ color: '#207ef2' }}>
                                  {this.state.userInfo.isACompany
                                    ? 'Selfie con documento de registro físcal de un miembro firmante'
                                    : 'Selfie con documento de identidad'}
                                </b>
                              </p>
                              {this.state.selfURLToVerify !== undefined &&
                              this.state.selfURLToVerify !== null &&
                              this.state.selfURLToVerify !== '' &&
                              this.state.selfURLToVerify.isPdf ? ( // cuarto caso de pdf
                                <div>
                                  <List.Item>
                                    <Document
                                      file={this.state.selfURLToVerify.file}
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
                                    href={this.state.selfURLToVerify.file}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    Descargar PDF
                                  </Button>
                                </div>
                              ) : this.state.selfURLToVerify !== undefined &&
                                this.state.selfURLToVerify !== null &&
                                this.state.selfURLToVerify !== '' ? (
                                <Modal
                                  //key={id}
                                  trigger={
                                    // <List.Item>
                                    <Image
                                      title='Ver pantalla completa'
                                      src={this.state.selfURLToVerify.file}
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
                                      src={this.state.selfURLToVerify.file}
                                      size='huge'
                                    />
                                  </Modal.Content>
                                </Modal>
                              ) : (
                                <Segment size='tiny' placeholder>
                                  <Header icon>
                                    <Icon name='file image outline' />
                                    El usuario no ha subido este documento.
                                  </Header>
                                </Segment>
                              )}
                            </div>
                          </Grid.Row>
                        </Grid.Column>
                        {this.state.identityVerificationMcURLToVerify !==
                          undefined &&
                          this.state.identityVerificationMcURLToVerify !==
                            null &&
                          this.state.identityVerificationMcURLToVerify !==
                            '' && (
                            <Grid.Column>
                              <Grid.Row>
                                <div style={{ textAlign: 'center' }}>
                                  <p>
                                    <b style={{ color: '#207ef2' }}>
                                      {'Verificación de Identidad MoneyClick'}
                                    </b>
                                  </p>

                                  {this.state.identityVerificationMcURLToVerify
                                    .isPdf ? (
                                    // segundo caso de pdf
                                    <div>
                                      <List.Item>
                                        <Document
                                          file={
                                            this.state
                                              .identityVerificationMcURLToVerify
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
                                            .identityVerificationMcURLToVerify
                                            .file
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                      >
                                        Descargar PDF
                                      </Button>
                                    </div>
                                  ) : this.state
                                      .identityVerificationMcURLToVerify !==
                                      undefined &&
                                    this.state
                                      .identityVerificationMcURLToVerify !==
                                      null &&
                                    this.state
                                      .identityVerificationMcURLToVerify !==
                                      '' ? (
                                    <Modal
                                      //key={id}
                                      trigger={
                                        // <List.Item>
                                        <Image
                                          title='Ver pantalla completa'
                                          src={
                                            this.state
                                              .identityVerificationMcURLToVerify
                                              .file
                                          }
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          alt=''
                                          size='medium'
                                          as='a'
                                          style={{ maxHeight: '800px' }}
                                        />
                                        // </List.Item> */}
                                      }
                                    >
                                      <Modal.Content>
                                        <Image
                                          centered
                                          src={
                                            this.state
                                              .identityVerificationMcURLToVerify
                                              .file
                                          }
                                          size='huge'
                                        />
                                      </Modal.Content>
                                    </Modal>
                                  ) : (
                                    <Segment size='tiny' placeholder>
                                      <Header icon>
                                        <Icon name='file image outline' />
                                        El usuario no ha subido este documento.
                                      </Header>
                                    </Segment>
                                  )}
                                </div>
                              </Grid.Row>
                            </Grid.Column>
                          )}
                        <Grid.Column>
                          <Grid.Row>
                            <div style={{ textAlign: 'center' }}>
                              <p>
                                <b style={{ color: '#207ef2' }}>
                                  {
                                    'Selfie de Verificación de Identidad MoneyClick'
                                  }
                                </b>
                              </p>
                              {this.state.selfieVerificationMcURLToVerify !==
                                undefined &&
                              this.state.selfieVerificationMcURLToVerify !==
                                null &&
                              this.state.selfieVerificationMcURLToVerify !==
                                '' &&
                              this.state.selfieVerificationMcURLToVerify
                                .isPdf ? (
                                // segundo caso de pdf
                                <div>
                                  <List.Item>
                                    <Document
                                      file={
                                        this.state
                                          .selfieVerificationMcURLToVerify.file
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
                                      this.state.selfieVerificationMcURLToVerify
                                        .file
                                    }
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    Descargar PDF
                                  </Button>
                                </div>
                              ) : this.state.selfieVerificationMcURLToVerify !==
                                  undefined &&
                                this.state.selfieVerificationMcURLToVerify !==
                                  null &&
                                this.state.selfieVerificationMcURLToVerify !==
                                  '' ? (
                                <Modal
                                  //key={id}
                                  trigger={
                                    // <List.Item>
                                    <Image
                                      title='Ver pantalla completa'
                                      src={
                                        this.state
                                          .selfieVerificationMcURLToVerify.file
                                      }
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      alt=''
                                      size='medium'
                                      as='a'
                                      style={{ maxHeight: '800px' }}
                                    />
                                    // </List.Item> */}
                                  }
                                >
                                  <Modal.Content>
                                    <Image
                                      centered
                                      src={
                                        this.state
                                          .selfieVerificationMcURLToVerify.file
                                      }
                                      size='huge'
                                    />
                                  </Modal.Content>
                                </Modal>
                              ) : (
                                <Segment size='tiny' placeholder>
                                  <Header icon>
                                    <Icon name='file image outline' />
                                    El usuario no ha subido este documento.
                                  </Header>
                                </Segment>
                              )}
                            </div>
                          </Grid.Row>
                        </Grid.Column>

                        {/* {this.state.otherDocumentsToShow
                                          .length > 0 && (
                                          <Container>
                                            <Divider horizontal>
                                              <Header as="h4">
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
                                                        ".pdf"
                                                      ) ||
                                                        document.url.endsWith(
                                                          ".PDF"
                                                        )) ? (
                                                        <Grid centered>
                                                          <Grid.Row>
                                                            <label>
                                                              <b
                                                                style={{
                                                                  color:
                                                                    "#207ef2",
                                                                }}
                                                              >
                                                                {document.name}
                                                              </b>
                                                            </label>
                                                          </Grid.Row>
                                                          <Grid.Row>
                                                            <iframe
                                                              title="PDF"
                                                              src={document.url}
                                                              width="300"
                                                              height="250"
                                                              frameBorder="0"
                                                              allowFullScreen
                                                            />
                                                            <Button
                                                              as="a"
                                                              href={
                                                                document.url
                                                              }
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                            >
                                                              Ver PDF pantalla
                                                              completa
                                                            </Button>
                                                          </Grid.Row>
                                                        </Grid>
                                                      ) : document.url !==
                                                          undefined &&
                                                        document.url !==
                                                          null ? (
                                                        <Grid centered>
                                                          <Grid.Row>
                                                            <label>
                                                              {document.name}
                                                            </label>
                                                          </Grid.Row>
                                                          <Grid.Row>
                                                            <Image
                                                              title="Ver pantalla completa"
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              alt=""
                                                              href={
                                                                document.url
                                                              }
                                                              src={document.url}
                                                              size="medium"
                                                            />
                                                          </Grid.Row>
                                                        </Grid>
                                                      ) : (
                                                        <Segment
                                                          size="tiny"
                                                          placeholder
                                                        >
                                                          <Header icon>
                                                            <Icon name="file image outline" />
                                                            El usuario no ha
                                                            subido este
                                                            documento.
                                                          </Header>
                                                        </Segment>
                                                      )}
                                                    </Grid.Column>
                                                  );
                                                }
                                              )}
                                            </Grid>
                                          </Container>
                                        )} */}
                      </Grid>
                    </Container>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
        <Modal
          closeIcon
          open={this.state.openModal}
          onClose={this.closeModal.bind(this)}
        >
          <Modal.Header>{'Seleccione el Tipo de la Alerta'}</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loadModal}>
              <p>
                ¿Está seguro que desea este color para la nueva alerta de este
                usuario?
              </p>
              <Form>
                <Form.Group inline>
                  <label>
                    <b>Tipo de la Alerta</b>
                  </label>
                  <Form.Select
                    search
                    options={listColors}
                    onChange={this.handleColors2.bind(this)}
                  ></Form.Select>

                  {this.state.colorSelected2 && (
                    <Label
                      circular
                      color={this.state.colorSelected2}
                      style={{ marginLeft: '20px' }}
                    />
                  )}

                  {this.state.colorSelected2 && (
                    <Label style={{ marginLeft: '20px' }}>
                      {this.state.colorSelected2.toLowerCase() === 'green'
                        ? 'Usuario Confiable'
                        : this.state.colorSelected2.toLowerCase() === 'purple'
                        ? 'Usuario problemático'
                        : this.state.colorSelected2.toLowerCase() === 'red'
                        ? 'Posible Estafador'
                        : this.state.colorSelected2.toLowerCase() === 'black'
                        ? 'Usuario Suspendido'
                        : this.state.colorSelected2.toLowerCase() === 'orange'
                        ? 'Usuario en Investigación'
                        : this.state.colorSelected2.toLowerCase() === 'yellow'
                        ? 'Usuario Sospechoso'
                        : this.state.colorSelected2.toLowerCase() === 'blue'
                        ? 'Usuario VIP'
                        : this.state.colorSelected2.toLowerCase() === 'grey'
                        ? 'Usuario de pruebas'
                        : ''}
                    </Label>
                  )}
                </Form.Group>
              </Form>
              {this.state.showMessage2 && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {this.state.colorSelected2 !== '' &&
              this.state.colorSelected2 !== undefined && (
                <div>
                  <Button
                    onClick={this.closeModal.bind(this)}
                    disabled={this.state.showMessage2 || this.state.loadModal}
                    negative
                  >
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button
                    onClick={this.addFlag.bind(this)}
                    disabled={this.state.showMessage2 || this.state.loadModal}
                    positive
                  >
                    <Icon name='checkmark' />
                    Si
                  </Button>
                </div>
              )}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default UserBalance;
