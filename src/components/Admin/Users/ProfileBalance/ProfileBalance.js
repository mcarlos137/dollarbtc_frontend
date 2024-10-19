import React, { Component } from 'react';
import '../../Admin.css';
import {
  Container,
  Grid,
  Form,
  Divider,
  Icon,
  Popup,
  Segment,
  Button,
  Message,
  Header,
  Loader,
  Dimmer,
  Modal,
  Select,
  Label,
  List,
} from 'semantic-ui-react';
import config from '../../../../services/config';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import userService from '../../../../services/user';

import _ from 'underscore';
import { faSmileWink } from '@fortawesome/free-solid-svg-icons';

class ProfileBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsersProfiles: [],
      profileToSearch: '',
      ready: false,
      userSelected: '',
      profileBalance: null,
      showProfileToSearch: false,
      flagUser: '',
      showProfileDetail: true,
      userInfo: {},
      openModal: false,
      colorSelected2: '',
      colorlabel2: '',
      loadModal: false,
      message: '',
      colorMessage: '',
      showMessage2: false,
      colorSelected: '',
    };
  }
  getActualUserInfo = (allInfo) => {
    var listKeys = Object.keys(allInfo);
    var listActualKeys = [];
    var actualfirstNameKey;
    var actualLastnameKey;
    var actualPhoneKey;
    var actualQuestionSecurityKey;
    var actualAnswerSecurityKey;
    var paymentCommissions = [];
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
      actualMCWallets,
      actualTokens;
    var actualWallets;
    var isACompany = false;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith('phone')) {
        actualPhoneKey = listKeys[i];
      } else if (listKeys[i].startsWith('paymentCommissions')) {
        paymentCommissions.push(listKeys[i]);
      } else if (listKeys[i].startsWith('flag')) {
        actualFlag = listKeys[i];
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
      } else if (
        listKeys[i] !== 'name' &&
        listKeys[i] !== 'masterWalletIds' &&
        listKeys[i] !== 'verification' &&
        !listKeys[i].endsWith('URL') &&
        listKeys[i] !== 'company'
      ) {
        otherKeys.push(listKeys[i]);
      }
    }
    listActualKeys.push(
      actualfirstNameKey,
      actualLastnameKey,
      actualPhoneKey,
      paymentCommissions,
      actualQuestionSecurityKey,
      actualAnswerSecurityKey,
      actualTypeDocumentIdentityKey,
      actualNumberDocumentIdentityKey,
      actualGenderKey,
      actualFlag,
      actualBirthdateKey,
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
      } else if (key.startsWith('paymentCommissions')) {
        let ob = {};

        Object.entries(value).forEach(([k, v]) => {
          ob.currency = k;
          ob.commissionToDeposit = v.mcBuyBalancePercent;
          ob.commissionToTransfer = v.sendToPaymentPercent;

          normalizeObject.paymentCommissions = ob;
        });
      } else if (key.startsWith('flag')) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'color') {
            normalizeObject.flag = v;
            this.setState({ flagUser: v });
          }
        });
        // normalizeObject.flag = value;
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
      } else if (key.startsWith('otherNotificationTokens')) {
        normalizeObject.otherNotificationTokens = value;
      } else if (key.startsWith('mcWallets')) {
        normalizeObject.mcWallets = value;
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
  closeUserDetailModal = () => {
    this.setState({ userDetailModal: false, userSelected: '' });
  };
  openUserDetailModal = (user) => {
    this.getUserConfig(user);
  };
  getUserConfig = (username) => {
    this.setState({ flagUser: '', userSelected: username });
    userService
      .getConfigUserGeneral(username)
      .then((resp) => {
        var lastUserInfo = this.getActualUserInfo(resp.data.result);

        this.setState({
          userInfo: lastUserInfo,
          userDetailModal: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.getUsersProfile();
  }
  getUsersProfile = () => {
    var profiles = [
      { key: 'NORMAL', value: 'NORMAL', text: 'NORMAL' },
      { key: 'ADMIN', value: 'ADMIN', text: 'ADMIN' },
      {
        key: 'PRO_TRADER_MASTER',
        value: 'PRO_TRADER_MASTER',
        text: 'PRO_TRADER_MASTER',
      },
      {
        key: 'PRO_TRADER_TESTER',
        value: 'PRO_TRADER_TESTER',
        text: 'PRO_TRADER_TESTER',
      },
      {
        key: 'PRO_TRADER_EMULATED',
        value: 'PRO_TRADER_EMULATED',
        text: 'PRO_TRADER_EMULATED',
      },
      { key: 'PRO_TRADER', value: 'PRO_TRADER', text: 'PRO_TRADER' },
      { key: 'BROKER', value: 'BROKER', text: 'BROKER' },
    ];
    this.setState({ listUsersProfiles: profiles }, () => {
      this.setState({ showProfileToSearch: true });
    });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  getProfileBalance = () => {
    this.setState({ showProfileDetail: false }, () => {
      userService
        .listNamesByIndexAndValue('type', this.state.profileToSearch)
        .then((resp) => {
          //	console.log(resp);
          let listEmail = [];
          let array = [];
          Object.entries(resp.data).forEach(([key, value]) => {
            listEmail.push(value);
          });

          let body1 = {
            userNames: listEmail,
          };
          userService
            .getUserConfigs(body1)
            .then((resp) => {
              Object.entries(resp.data).forEach(([ke, val]) => {
                Object.entries(val).forEach(([k, v]) => {
                  let data = userService.getActualUserInfo(v);
                  array.push(data);
                });
              });
            })
            .catch((error) => {
              console.log(error);
            });

          //	console.log(body);
          this.setState(
            {
              profileBalance: listEmail,
            },
            () => {
              this.setState({
                showProfileDetail: true,
              });
            }
          );
        })
        .catch((error) => {
          this.setState({ showProfileDetail: true });
          console.log(error);
        });
    });
  };
  pickProfile = (e, data) => {
    this.setState({ profileToSearch: data.value });
  };
  openModal() {
    this.setState({ openModal: true, userDetailModal: false });
  }
  closeModal() {
    this.setState({ openModal: false, colorSelected2: '' });
  }

  addFlag() {
    let body = {
      operatorUserName: window.sessionStorage.getItem('username'),
      userName: this.state.userSelected,
      flagColor: this.state.colorSelected2.toUpperCase(),
    };
    this.setState({ loadModal: true });
    userService
      .addFlag(body)
      .then((res) => {
        if (res.data !== 'OK') {
          this.setState({
            loadModal: false,
            message: 'Error de la actualizacion',
            colorMessage: 'red',
            showMessage2: true,
            userSelected: '',
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
            ready: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
              colorSelected: '',
              ready: false,
            });
            this.closeModal();
            this.getUserConfig(this.state.userSelected);
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
              userSelected: '',
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
            this.setState({
              message: '',
              showMessage2: false,
              userSelected: '',
            });
          }, 5000);
          this.closeModal();
        }
      });
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
  handleColors2(e, data) {
    this.setState({
      colorSelected2: data.value,
      colorlabel2: data.text,
    });
  }
  render() {
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
    //	console.log(this.state.userInfo);
    return (
      <div>
        <Modal
          closeIcon
          open={this.state.openModal}
          onClose={this.closeModal.bind(this)}
        >
          <Modal.Header>{'Seleccione el Tipo de la Alerta'}</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loadModal}>
              <p>
                ¿Está seguro que desea este color para la nueva alerta del
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
              this.state.colorSelected2 !== undefined &&
              this.state.ready !== true && (
                <div>
                  <Button onClick={this.closeModal.bind(this)} negative>
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button onClick={this.addFlag.bind(this)} positive>
                    <Icon name='checkmark' />
                    Si
                  </Button>
                </div>
              )}
            {this.state.ready === true && (
              <div>
                <Button onClick={this.closeModal.bind(this)}>Cerrar</Button>
              </div>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          closeIcon
          open={this.state.userDetailModal}
          onClose={this.closeUserDetailModal}
        >
          <Modal.Header>Detalle de usuario</Modal.Header>
          <Modal.Content>
            {/* <Button
							disabled={this.state.userInfo === ""}
							color='blue'
							style={{ marginTop: 23 }}
							onClick={this.openModal.bind(this)}
							loading={this.state.loadSearch}>
							Agregar Alerta
						</Button> */}
            <Modal.Description>
              <Form>
                <Button
                  style={{ marginLeft: '350px' }}
                  //disabled={this.state.userInfo === ""}
                  color='blue'
                  // style={{ marginTop: 23 }}
                  onClick={this.openModal.bind(this)}
                  //loading={this.state.loadSearch}
                >
                  Agregar Alerta
                </Button>
                {this.state.flagUser !== '' &&
                  this.state.userInfo.flag !== '' &&
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
                        this.state.userInfo.companyNumberOfFiscalRecord !== ''
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
                {/* {this.state.userInfo !== "" && ( */}

                {/* )} */}
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
                      {this.state.userInfo.typeDocumentIdentity !== undefined &&
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
                      this.state.userInfo.phone !== '' &&
                      this.state.userInfo.phone !== '0'
                        ? this.state.userInfo.phone
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Dirección</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.userDirection !== undefined &&
                      this.state.userInfo.userDirection !== ''
                        ? this.state.userInfo.userDirection
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field></Form.Field>
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
                  {/* <Form.Field>
										<label>Usuario de Facebook</label>
										<p className='infoUserParagraph'>
											{this.state.userInfo.userFacebook !== undefined &&
											this.state.userInfo.userFacebook !== ""
												? this.state.userInfo.userFacebook
												: "No posee"}
										</p>
									</Form.Field> */}
                  <Form.Field>
                    <label>Pregunta de seguridad</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.questionSecurity !== undefined &&
                      this.state.userInfo.questionSecurity !== ''
                        ? '**************' //this.state.userInfo.questionSecurity
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Respuesta de seguridad</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.answerSecurity !== undefined &&
                      this.state.userInfo.answerSecurity !== ''
                        ? '**************' // this.state.userInfo.answerSecurity
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
                  {/* <Form.Field>
										<label>Alerta de Usuario</label>
										<Form.Group inline>
											<Label
												circular
												color={this.state.flagUser.toLowerCase()}
											/>
											<Button
												//disabled={this.state.userInfo === ""}
												color='blue'
												size='small'
												// style={{ marginTop: 23 }}
												onClick={this.openModal.bind(this)}
												//loading={this.state.loadSearch}
											>
												Agregar
											</Button> 
										</Form.Group>
									</Form.Field>*/}
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
                  <Form.Field>
                    <label>Address</label>
                    {this.state.userInfo.address !== undefined &&
                    this.state.userInfo.address !== ''
                      ? this.state.userInfo.address
                      : 'No posee'}
                  </Form.Field>
                  <Form.Field />
                  <Form.Field style={{ marginLeft: -140 }}>
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
                    {this.state.userInfo.environment}
                  </Form.Field>

                  <Form.Field>
                    <label>Cuenta de operación</label>
                    {this.state.userInfo.operationAccount}
                  </Form.Field>
                  {this.state.userInfo.wallets !== undefined && (
                    <Form.Field style={{ marginRight: -100 }}>
                      <label>Addresses anteriores</label>
                      <List divided relaxed>
                        {Object.keys(this.state.userInfo.wallets.old).map(
                          (key) => {
                            return (
                              <List.Item key={key}>
                                <List.Content>
                                  <List.Header>
                                    {
                                      this.state.userInfo.wallets.old[key]
                                        .address
                                    }
                                  </List.Header>
                                  <List.Description>
                                    Creación:{' '}
                                    {new Date(key).toLocaleDateString('en-US')}
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
                {this.state.userInfo &&
                  this.state.userInfo.other &&
                  this.state.userInfo.other.length > 0 && (
                    <Container>
                      <Divider horizontal>
                        <Header as='h4'>Datos adicionales</Header>
                      </Divider>
                      <Form.Group widths={5}>
                        {/* {this.state.userInfo.other.map((k) => {
													return (
														<Form.Field key={k.dataName}>
															<label>
																{k.dataName === "nickname"
																	? "Nombre de usuario"
																	: k.dataName}
															</label>
															<p className='infoUserParagraph'>{k.dataValue}</p>
														</Form.Field>
													);
												})} */}
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
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        {!this.state.showProfileToSearch && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {!this.state.showProfileDetail && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Perfil a consultar:</label>
              <Select
                search
                placeholder='Seleccione un perfil'
                options={this.state.listUsersProfiles}
                onChange={this.pickProfile}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.profileToSearch === ''}
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={this.getProfileBalance}
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        {this.state.profileBalance !== null && (
          <div>
            <Divider section />
            <Grid>
              {/* <Grid.Row columns='equal'>
								<Grid.Column>
									{this.state.profileBalance.availableAmounts.length > 0 ? (
										<List as='ol'>
											<List.Item>
												<List.Header>Montos disponibles</List.Header>
												<List.Item as='ol'>
													{this.state.profileBalance.availableAmounts.map(
														(availableAmount) => (
															<List.Item
																as='li'
																value='-'
																key={availableAmount.currency}>
																<div>
																	<label>
																		<b>{availableAmount.currency}: </b>
																	</label>{" "}
																	<NumberFormat
																		value={this.floorDecimals(
																			availableAmount.amount,
																			8,
																		)}
																		displayType={"text"}
																		thousandSeparator={true}
																	/>
																</div>
															</List.Item>
														),
													)}
												</List.Item>
											</List.Item>
										</List>
									) : (
										<p> Este perfil no posee valores disponibles</p>
									)}
								</Grid.Column>
							</Grid.Row> */}
            </Grid>
            <Divider hidden />
            {this.state.profileBalance.length > 0 ? (
              <div>
                <label>
                  <b>Usuarios pertenecientes a este perfil:</b>
                </label>
                <Divider fitted hidden />
                <Grid>
                  <Grid.Row columns={4}>
                    {this.state.profileBalance.map((user, i) => (
                      <Grid.Column key={i}>
                        <p
                          className='fake-link'
                          onClick={() => this.openUserDetailModal(user)}
                        >
                          {user}
                        </p>
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </div>
            ) : (
              <p>Este perfil no posee usuarios</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ProfileBalance;
