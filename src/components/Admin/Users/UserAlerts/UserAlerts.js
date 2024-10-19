import React, { Component } from 'react';
import {
  Segment,
  Select,
  Form,
  Label,
  Message,
  Icon,
  Modal,
  Popup,
  Button,
  Divider,
  Dimmer,
  Loader,
  Grid,
  Header,
  Container,
  List,
  Image,
  Checkbox,
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import user from '../../../../services/user';
import _ from 'underscore';
import { hiddenContentStyle } from 'office-ui-fabric-react';
import * as jsPDF from 'jspdf';
import attachments from '../../../../services/attachments';
import { Document, Page } from 'react-pdf';

class UserAlerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorSelected: '',
      colorSelected2: '',
      showprint: false,
      colorLabel2: '',
      flagUser: '',
      usersToPrint: [],
      userBalance: null,
      userInfo: {},
      usernameSelected: '',
      imagesUser: [],
      closeModal: false,
      dataToPdf: [],
      load: false,
      view: false,
      data: [],
      data2: [],
      data3: [],
    };
    this.loadUserImages = this.loadUserImages.bind(this);
  }
  componentDidMount() {}
  handleColors(e, data) {
    this.setState({ colorSelected: data.value });
  }
  handleColors2(e, data) {
    this.setState({
      colorSelected2: data.value,
      colorlabel2: data.text,
    });
  }
  getUsersByFlag() {
    this.setState({
      view: false,
      load: true,
      view2: true,
      userBalance: null,
      loadSearch: true,
    });

    if (
      this.state.colorSelected === '' ||
      this.state.colorSelected === null ||
      this.state.colorSelected === undefined
    ) {
      this.setState({
        view2: false,
        load: false,
        loadSearch: false,
      });
    } else {
      user
        .getUserByFlag(this.state.colorSelected.toUpperCase())
        .then((res) => {
          if (res.data !== '' && res.data !== undefined) {
            this.setState({
              data2: res.data,
            });
            let u = [];

            Object.entries(res.data).forEach(([k, v]) => {
              if (k !== undefined && k !== '') {
                let ob = {
                  username: k,
                  flag: this.state.colorSelected,
                };
                u.push(ob);
              }
            });
            // let item;
            // let arr = [];

            this.setState({
              data3: u,
              load: false,
              loadSearch: false,
              view2: true,
            });

            // if (
            // 	this.state.data3.length === "" ||
            // 	this.state.data3.length === 0
            // ) {
            // 	this.setState({ showprint: false });
            // } else {
            // 	this.setState({ showprint: true });
            // }
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.toString().includes('Network')) {
            this.setState({
              load: false,
              loadSearch: false,
              showMessage: true,
              colorMessage: 'red',
              message: 'Error de Conexion',
            });

            setTimeout(() => {
              this.setState({
                showMessage: false,
                colorMessage: '',
                message: '',
                colorSelected: '',
                view: true,
                view2: false,
              });
              //	this.getUsersBoth();
            }, 5000);
          } else {
            //	console.log("dentro del else catch inesperado");
            this.setState({
              load: false,
              loadSearch: false,
              showMessage: true,
              colorMessage: 'red',
              message: 'No hay resultados para la busqueda',
            });

            setTimeout(() => {
              this.setState({
                showMessage: false,
                colorMessage: '',
                message: '',
                colorSelected: '',
                view: true,
                view2: false,
              });
              //	this.getUsersBoth();
            }, 5000);
          }
        });
    }
  }
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
  async prepareDataToPdf() {
    let arrobj = [];
    let arr = [];
    Object.entries(this.state.data3).forEach(([k, v]) => {
      Object.entries(v).forEach(([key, val]) => {
        if (key === 'username') {
          arr.push(val);
        }
      });
    });

    for (let i of arr) {
      //var i = 0; i < arr.length; i++
      let resultArray = await user
        .getConfigUserGeneral(i)
        .then((resp) => {
          var actualUserInfo = this.formatDataUserToPdf(resp.data.result);

          // let oldAdrres = [];
          // if (actualUserInfo.wallets !== undefined) {
          // 	Object.entries(actualUserInfo.wallets).forEach(([key, value]) => {
          // 		if (key === "current") {
          // 			Object.entries(value).forEach(([inerKey, inerValue]) => {
          // 				if (inerValue.address !== undefined) {
          // 					actualUserInfo.address = inerValue.address;
          // 				}
          // 			});
          // 		} else {
          // 			Object.entries(value).forEach(([inerKey, inerValue]) => {
          // 				if (inerValue.address !== undefined) {
          // 					oldAdrres.push({
          // 						create: inerKey,
          // 						value: inerValue.address,
          // 					});
          // 				}
          // 			});
          // 		}
          // 	});
          // }
          // actualUserInfo.oldAdrres = oldAdrres;
          //	arrobj.push(actualUserInfo); //preguntar si se puede hacer un push aca en este nivel

          if (!_.isEmpty(actualUserInfo)) {
            return actualUserInfo;
          }
        })
        .catch((error) => {});

      if (!_.isEmpty(resultArray)) {
        arrobj.push(resultArray);
      }
    }

    this.setState({ usersToPrint: arrobj });
    this.printInvoice();
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
    var isACompany = false;
    let imagesUser = [];
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (
        listKeys[i].startsWith('phone') &&
        !listKeys[i].includes('__')
      ) {
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
        listKeys[i] !== 'name' &&
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
      actualBirthplaceKey,
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
    //	console.log("normalizeObject:", normalizeObject);
    return normalizeObject;
  };
  formatDataUserToPdf(data) {
    let optionsPdf = [];
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== 'active' &&
        //	key !== "address" &&
        key !== 'environment' &&
        key !== 'masterWalletIds' &&
        key !== 'operationAccount' &&
        key !== 'type' &&
        key !== 'active' &&
        key !== 'verification' &&
        key !== 'name' &&
        key !== 'email' &&
        !key.startsWith('paymentId') &&
        !key.endsWith('URL')
      ) {
        var dataName = '';
        if (key === 'sourceSignin') {
          dataName = 'Fuente de Registro';
        } else if (key === 'address') {
          dataName = 'Dirección';
        } else if (key === 'flag') {
          dataName = 'Alerta';
        } else if (key === 'questionSecurity') {
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
        if (
          key === 'lastName' ||
          key === 'firstName' ||
          key === 'nickname' ||
          key === 'typeDocumentIdentity' ||
          key === 'numberDocumentIdentity' ||
          key === 'phone' ||
          key === 'address' ||
          key === 'companyName' ||
          key === 'companyTypeOfFiscalRecord' ||
          key === 'companyNumberOfFiscalRecord' ||
          key === 'companyYearRegistration'
        ) {
          var objPdf = {
            label: dataName,
            value: value,
          };
          optionsPdf.push(objPdf);
        } else if (key === 'flag') {
          Object.entries(value).forEach(([k, v]) => {
            if (k === 'color') {
              if (v === 'GREEN') {
                v = 'Verde' + '  ' + '(Usuario Confiable)';
              } else if (v === 'PURPLE') {
                v = 'Morado' + '  ' + '(Usuario  problemático)';
              } else if (v === 'RED') {
                v = 'Rojo' + '  ' + '(Estafador o Posible Estafador)';
              } else if (v === 'ORANGE') {
                v = 'Naranja' + '  ' + '(Usuario en Investigación)';
              } else if (v === 'YELLOW') {
                v = 'Amarillo' + '  ' + '(Usuario Sospechoso)';
              } else if (v === 'BLACK') {
                v = 'Negro' + '  ' + '(Usuario Suspendido)';
              } else if (v === 'BLUE') {
                v = 'Azul' + '  ' + '(Usuario VIP)';
              } else if (v === 'GREY') {
                v = 'Gris' + '  ' + '(Usuario de pruebas)';
              }

              var objPdf = {
                label: dataName,
                value: v,
              };
              optionsPdf.push(objPdf);
            }
          });
        }
      }
    });
    return optionsPdf;
  }
  printInvoice() {
    let f = new Date();
    let today = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
    let doc = new jsPDF();

    doc.addFont('Montserrat');
    doc.setFontSize(18);
    doc.text(50, 20, 'Listado de Usuarios con Alertas');

    doc.setFontSize(12);
    doc.text(80, 30, today);
    let x = 20;
    let y = 40;
    doc.setFontSize(12);

    for (let data of this.state.usersToPrint) {
      for (let d of data) {
        //	console.log(d);
        doc.text(d.label + ':' + ' ' + d.value, x, y);
        y = y + 5;
      }

      y = y + 10;
    }

    // Object.entries(this.state.usersToPrint).forEach(([key, value]) => {
    // 	Object.entries(value).forEach(([k, v]) => {
    // 		doc.text(k + ":" + "   " + v, x, y);
    // 		y = y + 5;
    // 	});
    // 	//	y = y + 10;
    // 	doc.addPage();
    // 	x = 20;
    // 	y = 30;
    // });
    //	}

    doc.save('Listado.pdf');
  }
  closeModal() {
    this.setState({ openModal: false, colorSelected2: '' });
  }
  addFlag() {
    let body = {
      operatorUserName: window.sessionStorage.getItem('username'),
      userName: this.state.usernameSelected,
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
              data3: [],
            });

            this.getUserBalance();
            this.closeModal();
          }, 5000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.toString().includes('Network')) {
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
          //	console.log("dentro del else catch inesperado addflag");
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
  OpenModal() {
    this.setState({ openModal: true });
  }
  setUserNameTable(e, data) {
    this.setState({
      usernameSelected: data.name,
    });
    this.OpenModal();
  }
  setUserNameTableShow(e, data) {
    //	console.log(data);

    this.setState(
      {
        usernameSelected: data.name,
        // loadModal:true
        loadSearch: true,
      },
      () => {
        this.getUserBalance();
      }
    );
  }
  getUserBalance = () => {
    //console.log(this.state.usernameSelected);
    this.setState({ showUserBalance: false, imagesUser: [], userInfo: {} });
    //	console.log(this.state.usernameSelected);
    user
      .getBalanceUser(this.state.usernameSelected)
      .then((response) => {
        user
          .getConfigUserGeneral(this.state.usernameSelected)
          .then((resp) => {
            //	console.log("getConfig:", resp.data.result);
            var actualUserInfo = this.getActualUserInfo(resp.data.result);
            let oldAdrres = [];
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
            actualUserInfo.oldAdrres = oldAdrres;
            this.setState({
              userInfo: actualUserInfo,
              showUserBalance: true,
              loadSearch: false,
              //	loadModal:false,
              view2: false,
            });
            this.loadUserImages(this.state.usernameSelected);
          })
          .catch((error) => {});
        this.setState({ userBalance: response.data.result });
      })
      .catch((error) => {
        this.setState({ showUserBalance: true });
      });
  };
  back() {
    this.setState({ view2: true, userBalance: null, showUserBalance: false });
    //this.handleColors();
  }
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
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  render() {
    //	console.log("this.state.data3.lenght > -1", this.state.data3);
    const userTableHeaders = [
      {
        Header: 'Alerta',
        width: 150,
        accessor: 'flag',
        //	filterable: true,
        // filterMethod: (filter, row) => customOptionsFlagMethod(filter, row),
        Cell: (row) => {
          return (
            <div>
              <Label
                circular
                color={row.value}
                style={{ marginLeft: '60px' }}
              />
            </div>
          );
          //}
        },
      },
      {
        Header: 'Nombre de usuario',
        accessor: 'username',
        width: 450,
        filterable: true,
      },
      {
        Header: 'Acción',
        width: 250,
        Cell: (row) => {
          return (
            <div>
              <Button
                style={{ marginLeft: '100px' }}
                icon='eye'
                circular
                compact
                size='tiny'
                color='blue'
                title='Detalle de Usuario'
                name={row.original.username}
                onClick={this.setUserNameTableShow.bind(this)}
              />
            </div>
          );
        },
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

    return (
      <div>
        <Segment loading={this.state.loadSearch}>
          <Form>
            <Form.Group inline>
              <label>
                <b>Tipo de Alerta</b>
              </label>
              <Form.Select
                search
                options={listColors}
                onChange={this.handleColors.bind(this)}
              ></Form.Select>

              <Form.Button
                type='submit'
                color='blue'
                style={{ marginLeft: '10px' }}
                onClick={this.getUsersByFlag.bind(this)}
              >
                Buscar
              </Form.Button>
              {this.state.data3 !== '' &&
                this.state.data3 !== undefined &&
                this.state.data3 !== null &&
                this.state.data3.length > 0 && (
                  <Form.Button
                    color='blue'
                    disabled={this.state.showUserBalance}
                    onClick={this.prepareDataToPdf.bind(this)}
                  >
                    Imprimir
                  </Form.Button>
                )}
            </Form.Group>
          </Form>
          {this.state.showMessage && (
            <Message color={this.state.colorMessage}>
              <p>{this.state.message}</p>
            </Message>
          )}
          <Divider hidden />

          {this.state.userBalance !== null &&
            this.state.userBalance !== undefined &&
            this.state.userBalance !== '' &&
            !this.state.view2 && (
              <div>
                {!this.state.showUserBalance ||
                  (this.state.loadSearch && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  ))}
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Form>
                        <Form.Group inline>
                          <Form.Button
                            color='blue'
                            onClick={this.OpenModal.bind(this)}
                          >
                            Editar alerta
                          </Form.Button>
                          <Form.Button
                            style={{ marginLeft: '860px' }}
                            color='blue'
                            onClick={this.back.bind(this)}
                          >
                            Salir
                          </Form.Button>
                        </Form.Group>
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
                                {this.state.userInfo.companyName !==
                                  undefined &&
                                this.state.userInfo.companyName !== ''
                                  ? this.state.userInfo.companyName
                                  : 'No posee'}
                              </p>
                            </Form.Field>
                            <Form.Field>
                              <label>Tipo de registro fiscal</label>
                              <p className='infoUserParagraph'>
                                {this.state.userInfo
                                  .companyTypeOfFiscalRecord !== undefined &&
                                this.state.userInfo
                                  .companyTypeOfFiscalRecord !== ''
                                  ? this.state.userInfo
                                      .companyTypeOfFiscalRecord
                                  : 'No posee'}
                              </p>
                            </Form.Field>
                            <Form.Field>
                              <label>Número de registro fiscal</label>
                              <p className='infoUserParagraph'>
                                {this.state.userInfo
                                  .companyNumberOfFiscalRecord !== undefined &&
                                this.state.userInfo
                                  .companyNumberOfFiscalRecord !== ''
                                  ? this.state.userInfo
                                      .companyNumberOfFiscalRecord
                                  : 'No posee'}
                              </p>
                            </Form.Field>
                            <Form.Field>
                              <label>Año de registro</label>
                              <p className='infoUserParagraph'>
                                {this.state.userInfo.companyYearRegistration !==
                                  undefined &&
                                this.state.userInfo.companyYearRegistration !==
                                  ''
                                  ? this.state.userInfo.companyYearRegistration
                                  : 'No posee'}
                              </p>
                            </Form.Field>
                          </Form.Group>
                        )}
                        <Divider horizontal>
                          <Header as='h4'>Datos personales</Header>
                        </Divider>
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
                                ? this.state.userInfo.birthdate
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
                              this.state.userInfo.phone !== ''
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
                          <Form.Field></Form.Field>
                          {/* <Form.Field>
                            <label>Usuario localBitcoin</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.userLocalBitcoin !==
                                undefined &&
                              this.state.userInfo.userLocalBitcoin !== ''
                                ? this.state.userInfo.userLocalBitcoin
                                : 'No posee'}
                            </p>
                          </Form.Field> */}
                        </Form.Group>
                        <Form.Group widths='equal'>
                          {/* <Form.Field>
                            <label>Usuario de Facebook</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.userFacebook !== undefined &&
                              this.state.userInfo.userFacebook !== ''
                                ? this.state.userInfo.userFacebook
                                : 'No posee'}
                            </p>
                          </Form.Field> */}
                          <Form.Field>
                            <label>Pregunta de seguridad</label>
                            <p className='infoUserParagraph'>
                              {this.state.userInfo.questionSecurity !==
                                undefined &&
                              this.state.userInfo.questionSecurity !== ''
                                ? '**************' //this.state.userInfo.questionSecurity
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
                          <Form.Field></Form.Field>
                        </Form.Group>
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
                                            <List.Header>
                                              {item.value}
                                            </List.Header>
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
                      </Form>
                      <Form>
                        {this.state.imagesUser.length > 0 && (
                          <Grid.Row style={{ paddingTop: '0px' }}>
                            <Grid.Column
                              largeScreen={16}
                              computer={16}
                              mobile={16}
                              tablet={16}
                            >
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
                        )}
                        {this.state.userInfo &&
                          this.state.userInfo.other &&
                          this.state.userInfo.other.length > 0 && (
                            <Container>
                              <Divider horizontal>
                                <Header as='h4'>Datos adicionales</Header>
                              </Divider>
                              {this.state.userInfo.other !== '' &&
                                this.state.userInfo.other !== undefined &&
                                this.state.userInfo.other !== null && (
                                  <Form.Group widths={5}>
                                    {this.state.userInfo.other.map((k) => {
                                      return (
                                        <Form.Field>
                                          <label>
                                            {k.dataName === 'nickname'
                                              ? 'Nombre de usuario'
                                              : k.dataName === 'operatorName'
                                              ? 'Nombre del operador'
                                              : k.dataName ===
                                                'creationTimestamp'
                                              ? 'Fecha de creación'
                                              : k.dataName === 'sourceSignin'
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
                                              : k.dataName === 'referralCode'
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
                                      );
                                    })}
                                  </Form.Group>
                                )}
                            </Container>
                          )}
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            )}

          {this.state.view2 && this.state.userBalance === null && (
            <ReactTable
              data={this.state.data3}
              columns={userTableHeaders}
              defaultPageSize={5}
              previousText='Anterior'
              nextText='Siguiente'
              loadingText='Cargando...'
              noDataText='No hay resultados'
              pageText='Página'
              ofText='de'
              rowsText='filas'
              pageJumpText='ir a la página'
              rowsSelectorText='filas por página'
              minRow={5}
            />
          )}
        </Segment>
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

                  {this.state.colorSelected2 !== '' && (
                    <Label
                      circular
                      color={this.state.colorSelected2}
                      style={{ marginLeft: '20px' }}
                    />
                  )}

                  {this.state.colorSelected2 !== '' && (
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
                    negative
                    disabled={this.state.showMessage2 || this.state.loadModal}
                  >
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button
                    onClick={this.addFlag.bind(this)}
                    positive
                    disabled={this.state.showMessage2 || this.state.loadModal}
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

export default UserAlerts;
