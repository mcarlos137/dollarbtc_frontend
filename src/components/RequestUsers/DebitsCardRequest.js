import React, { Component } from 'react';
import ReactTable from 'react-table';
import {
  Modal,
  Button,
  Segment,
  Divider,
  Header,
  Grid,
  Message,
  Form,
  Select,
  Icon,
  Image
} from 'semantic-ui-react';
import './DebitsCardRequest.css';
import _ from 'underscore';
import debitCardService from '../../services/debitCard';
import userService from '../../services/user';
import model_A from "../../img/tarjeta-1.jpg";
import model_B from "../../img/tarjeta-2.jpg";
import model_C from "../../img/tarjeta-3.jpg";
class DebitsCardRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFormat: [],
      showChangeStatus: false,
      load: false,
      viewMessage: false,
      textMessage: '',
      colorMessage: '',
      typeSelectToSearch: '',
      listStatus: [
        {
          value: 'WAITING_TO_PRINT',
          key: 'WAITING_TO_PRINT',
          text: 'Esperando por imprimir',
        },
        { value: 'PRINTED', key: 'PRINTED', text: 'Impreso' },
        {
          value: 'SENDED_TO_DELIVER',
          key: 'SENDED_TO_DELIVER',
          text: 'Enviado para entregar',
        },
        {
          value: 'IN_PLACE',
          key: 'IN_PLACE',
          text: 'En el lugar',
        },
        {
          value: 'INACTIVE',
          key: 'INACTIVE',
          text: 'Inactivo',
        },
        { value: 'ACTIVE', key: 'ACTIVE', text: 'Activo' },
      ],
      listStatusToChange: [],
      infoDebitCardSelect: {},
      showButtons: true,
      statusToChange: '',
      userDetailModal: false,
      usernameSelected: {},
      userInfo: {},
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }
  componentDidMount() {}
  handleSearchButton(e, data) {
    this.setState({ typeSelectToSearch: data.value });
  }
  searchDebitCards() {
    this.setState({ load: true });
    let body = {
      id: null,
      userName: null,
      currency: null,
      holderName: null,
      initTimestamp: null,
      finalTimestamp: null,
      debitCardStatus: this.state.typeSelectToSearch,
    };
    debitCardService
      .listDebitCard(body)
      .then((resp) => {
        this.setState({ dataFormat: resp.data }, () => {
          this.setState({ load: false });
        });
        this.setState({ load: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ load: false });
      });
  }
  closeModalChangeStatus() {
    this.setState(
      {
        showChangeStatus: false,
        listStatusToChange: [],
        infoDebitCardSelect: {},
        showButtons: true,
        statusToChange: '',
        viewMessage: false,
        textMessage: '',
        colorMessage: '',
      },
      () => {
        this.searchDebitCards();
      }
    );
  }
  handleChangeStatus(data) {
    this.selectStatusModal(data.debitCardStatus);
    this.setState(
      {
        infoDebitCardSelect: data,
      },
      () => {
        this.setState({ showChangeStatus: true });
      }
    );
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
  }
  formatStatus(status) {
    if (status === 'WAITING_TO_PRINT') {
      return 'Esperando por imprimir';
    } else if (status === 'PRINTED') {
      return 'Impreso';
    } else if (status === 'SENDED_TO_DELIVER') {
      return 'Enviado para entregar';
    } else if (status === 'IN_PLACE') {
      return 'En el lugar';
    } else if (status === 'INACTIVE') {
      return 'Inactivo';
    } else if (status === 'ACTIVE') {
      return 'Activo';
    } else return status;
  }
  selectStatusModal(statusShow) {
    let arrayStatus = [];
    if (statusShow === 'WAITING_TO_PRINT') {
      arrayStatus = [{ value: 'PRINTED', key: 'PRINTED', text: 'Impreso' }];
    }
    if (statusShow === 'PRINTED') {
      arrayStatus = [
        {
          value: 'SENDED_TO_DELIVER',
          key: 'SENDED_TO_DELIVER',
          text: 'Enviado para entregar',
        },
      ];
    }
    if (statusShow === 'SENDED_TO_DELIVER') {
      arrayStatus = [
        {
          value: 'IN_PLACE',
          key: 'IN_PLACE',
          text: 'En el lugar',
        },
      ];
    }
    if (statusShow === 'IN_PLACE') {
      arrayStatus = [{ value: 'ACTIVE', key: 'ACTIVE', text: 'Activo' }];
    }
    if (statusShow === 'INACTIVE') {
      arrayStatus = [{ value: 'ACTIVE', key: 'ACTIVE', text: 'Activo' }];
    }
    if (statusShow === 'ACTIVE') {
      arrayStatus = [{ value: 'INACTIVE', key: 'INACTIVE', text: 'Inactivo' }];
    }
    this.setState({ listStatusToChange: arrayStatus });
  }
  handleSelectChangeStatus = (e, data) => {
    this.setState({ statusToChange: data.value });
  };
  changeStatus() {
    this.setState({ load: true });
    let body = {
      id: this.state.infoDebitCardSelect.id,
      debitCardStatus: this.state.statusToChange,
    };
    debitCardService
      .changeStatusCard(body)
      .then((resp) => {
        if (resp.data === 'OK') {
          this.setState({
            load: false,
            showButtons: false,
            viewMessage: true,
            textMessage: 'Estado actualizado exitosamente',
            colorMessage: 'green',
          });
        } else {
          this.setState({
            load: false,
            showButtons: false,
            viewMessage: true,
            textMessage:
              'No se ha podido actualizar el estado. Intente de nuevo',
            colorMessage: 'red',
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          viewMessage: true,
          textMessage: 'Ha ocurrido un error de conexión, intente mas tarde',
          colorMessage: 'red',
          load: false,
          showButtons: false,
        });
      });
  }
  getUserConfig = (username) => {
    this.setState({ userInfo: {} });
    userService
      .getConfigUserGeneral(username)
      .then(async (resp) => {
        var lastUserInfo = this.getActualUserInfo(resp.data.result);
        this.setState({
          userInfo: lastUserInfo,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  getActualUserInfo = (allInfo) => {
    var listKeys = Object.keys(allInfo);
    var listActualKeys = [];
    var actualfirstNameKey;
    var actualLastnameKey;
    var actualPhoneKey;
    var actualFlag;
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
    var actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration;
    var isACompany = false;
    var mcWallets, wallets;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('flag')) {
        actualFlag = listKeys[i];
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
        actualNickName = listKeys[i];
      } else if (listKeys[i].startsWith('companyName')) {
        actualCompanyName = listKeys[i];
      } else if (listKeys[i].startsWith('companyTypeOfFiscalRecord')) {
        actualCompanyTypeOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyNumberOfFiscalRecord')) {
        actualCompanyNumberOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyYearRegistration')) {
        actualCompanyYearRegistration = listKeys[i];
      } else if (listKeys[i].startsWith('mcWallets')) {
        mcWallets = listKeys[i];
      } else if (listKeys[i].startsWith('wallets')) {
        wallets = listKeys[i];
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
      actualFlag,
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
      actualNickName,
      actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration,
      'address',
      'operationAccount',
      'environment',
      'type',
      'active',
      'email',
      'mcWallets',
      'wallets'
    );
    var allKeys = listActualKeys.concat(otherKeys);
    var modifiedObj = _.pick(allInfo, [allKeys]);
    var normalizeObject = { other: [] };
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith('firstName')) {
        normalizeObject.firstName = value;
      } else if (key.startsWith('flag')) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'color') {
            normalizeObject.flag = v;
            this.setState({ flagUser: v });
          }
        });
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
      } else if (key.startsWith('mcWallets')) {
        normalizeObject.mcWallets = value;
      } else if (key.startsWith('wallets')) {
        normalizeObject.wallets = value;
      } else if (!key.startsWith('paymentId')) {
        normalizeObject.other.push({ dataName: key, dataValue: value });
      }
    });
    normalizeObject.isACompany = isACompany;
    return normalizeObject;
  };
  openUserDetailModal = (user) => {
    this.setState({
      infoDebitCardSelect: user,
    });
    this.getUserConfig(user.userName);
    this.setState({
      userDetailModal: true,
      usernameSelected: user.userName,
    });
  };
  openModal() {
    this.setState({ userDetailModal: false });
  }
  closeUserDetailModal = () => {
    this.setState({ userDetailModal: false, infoDebitCardSelect:{} });
  };
  formatDateModal(date) {
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
  render() {
    const currensTableHeaders = [
      {
        Header: "Fecha",
        width: 180,
        accessor: "timestamp",
        Cell: (row) => this.formatDate(new Date(row.value)),
      },
      {
        Header: "Moneda",
        width: 100,
        accessor: "currency",
      },
      {
        Header: "ID",
        width: 160,
        accessor: "id",
      },
      {
        Header: "Usuario",
        accessor: "userName",
        Cell: (row) => {
          return (
            <p
              className="fake-link"
              onClick={() => this.openUserDetailModal(row.original)}
            >
              {row.value}
            </p>
          );
        },
      },
      {
        Header: "Estado",
        accessor: "debitCardStatus",
        Cell: (row) => this.formatStatus(row.value),
      },
      {
        Header: "Acción",
        width: 80,
        Cell: (row) => (
          <div>
            <Button
              icon="edit"
              circular
              compact
              size="mini"
              color="blue"
              id={row.original}
              name="modify"
              title="Cambiar Estado"
              onClick={() => this.handleChangeStatus(row.original)}
            />
          </div>
        ),
      },
    ];
    return (
      <div>
        <Grid>
          <Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
            <Form>
              <Form.Group>
                <Form.Field>
                  <label>Estado a consultar:</label>
                  <Select
                    search
                    placeholder="Seleccione"
                    options={this.state.listStatus}
                    onChange={this.handleSearchButton.bind(this)}
                    value={this.state.typeSelectToSearch}
                  />
                </Form.Field>
                <Form.Button
                  disabled={this.state.typeSelectToSearch === ""}
                  icon
                  labelPosition="left"
                  color="blue"
                  style={{ marginTop: 23 }}
                  type="submit"
                  onClick={this.searchDebitCards.bind(this)}
                  loading={this.state.load}
                >
                  <Icon name="search" />
                  Buscar
                </Form.Button>
              </Form.Group>
            </Form>
            <Segment basic loading={this.state.load}>
              <ReactTable
                className="rolTable"
                data={this.state.dataFormat}
                columns={currensTableHeaders}
                defaultPageSize={5}
                previousText="Anterior"
                nextText="Siguiente"
                loadingText="Cargando..."
                noDataText="No hay solicitudes"
                pageText="Página"
                ofText="de"
                rowsText="filas"
                pageJumpText="ir a la página"
                rowsSelectorText="filas por página"
                minRow={5}
                defaultFilterMethod={(filter, row, column) => {
                  const id = filter.pivotId || filter.id;
                  return row[id] !== undefined
                    ? String(row[id]).startsWith(filter.value.toUpperCase())
                    : true;
                }}
              />
              <Divider hidden />
              <Divider hidden />
            </Segment>
          </Grid.Column>
        </Grid>

        <Modal open={this.state.showChangeStatus} size="small">
          <Header
            icon="exclamation circle"
            content="Cambiar estado de Solicitud de Tarjeta de Débito"
          />
          <Modal.Content>
            <Segment basic loading={this.state.load}>
              <Form>
                <p>
                  ¿Desea actualizar el estado de solicitud de Tarjeta de Débito
                  del usuario <b>{this.state.infoDebitCardSelect.userName}</b>?
                </p>
                <Form.Group>
                  <Form.Field>
                    <label>Seleccione un estado:</label>
                    <Select
                      search
                      placeholder="Seleccione"
                      options={this.state.listStatusToChange}
                      onChange={this.handleSelectChangeStatus.bind(this)}
                      value={this.state.statusToChange}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Segment>
            {this.state.viewMessage && (
              <Message color={this.state.colorMessage}>
                {this.state.textMessage}
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            {this.state.showButtons && (
              <div>
                <Button
                  disabled={this.state.load}
                  color="grey"
                  onClick={this.closeModalChangeStatus.bind(this)}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={this.state.statusToChange === ""}
                  color="blue"
                  onClick={this.changeStatus.bind(this)}
                >
                  Aceptar
                </Button>
              </div>
            )}
            {!this.state.showButtons && (
              <Button
                color="grey"
                onClick={this.closeModalChangeStatus.bind(this)}
              >
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          closeIcon
          open={this.state.userDetailModal}
          onClose={this.closeUserDetailModal}
        >
          <Modal.Header>Detalle de usuario</Modal.Header>
          <Modal.Content scrolling>
            {Object.keys(this.state.userInfo).length === 0 && (
              <Segment basic loading></Segment>
            )}
            {Object.keys(this.state.userInfo).length > 0 && (
              <Modal.Description>
                <Form>
                  {this.state.userInfo.isACompany && (
                    <Divider horizontal>
                      <Header as="h4">Datos de la empresa</Header>
                    </Divider>
                  )}
                  {this.state.userInfo.isACompany && (
                    <Form.Group widths="equal">
                      <Form.Field>
                        <label>Nombre de la empresa</label>
                        <p className="infoUserParagraph">
                          {this.state.userInfo.companyName !== undefined &&
                          this.state.userInfo.companyName !== ""
                            ? this.state.userInfo.companyName
                            : "No posee"}
                        </p>
                      </Form.Field>
                      <Form.Field>
                        <label>Tipo de registro fiscal</label>
                        <p className="infoUserParagraph">
                          {this.state.userInfo.companyTypeOfFiscalRecord !==
                            undefined &&
                          this.state.userInfo.companyTypeOfFiscalRecord !== ""
                            ? this.state.userInfo.companyTypeOfFiscalRecord
                            : "No posee"}
                        </p>
                      </Form.Field>
                      <Form.Field>
                        <label>Número de registro fiscal</label>
                        <p className="infoUserParagraph">
                          {this.state.userInfo.companyNumberOfFiscalRecord !==
                            undefined &&
                          this.state.userInfo.companyNumberOfFiscalRecord !== ""
                            ? this.state.userInfo.companyNumberOfFiscalRecord
                            : "No posee"}
                        </p>
                      </Form.Field>
                      <Form.Field>
                        <label>Año de registro</label>
                        <p className="infoUserParagraph">
                          {this.state.userInfo.companyYearRegistration !==
                            undefined &&
                          this.state.userInfo.companyYearRegistration !== ""
                            ? this.state.userInfo.companyYearRegistration
                            : "No posee"}
                        </p>
                      </Form.Field>
                    </Form.Group>
                  )}
                  <Divider horizontal>
                    <Header as="h4">Datos personales</Header>
                  </Divider>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Nombres</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.firstName !== undefined &&
                        this.state.userInfo.firstName !== ""
                          ? this.state.userInfo.firstName
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Apellidos</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.lastName !== undefined &&
                        this.state.userInfo.lastName !== ""
                          ? this.state.userInfo.lastName
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Sexo</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.gender !== undefined &&
                        this.state.userInfo.gender !== ""
                          ? this.state.userInfo.gender === "male"
                            ? "Masculino"
                            : "Femenino"
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Tipo de documento</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.typeDocumentIdentity !==
                          undefined &&
                        this.state.userInfo.typeDocumentIdentity !== ""
                          ? this.state.userInfo.typeDocumentIdentity
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Número de documento</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.numberDocumentIdentity !==
                          undefined &&
                        this.state.userInfo.numberDocumentIdentity !== ""
                          ? this.state.userInfo.numberDocumentIdentity
                          : "No posee"}
                      </p>
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field >
                      <label>Fecha de nacimiento</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.birthdate !== undefined &&
                        this.state.userInfo.birthdate !== ""
                          ? this.formatDateModal(
                              new Date(this.state.userInfo.birthdate.replace(/-/g, '\/'))
                            )
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field >
                      <label>Lugar de nacimiento</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.birthplace !== undefined &&
                        this.state.userInfo.birthplace !== ""
                          ? this.state.userInfo.birthplace
                          : "No posee"}
                      </p>
                    </Form.Field>
                    
                    <Form.Field >
                      <label>Teléfono</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.phone !== undefined &&
                        this.state.userInfo.phone !== ""  &&
													this.state.userInfo.phone !== "0"
                          ? this.state.userInfo.phone
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field >
                      <label>Dirección</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.userDirection !== undefined &&
                        this.state.userInfo.userDirection !== ""
                          ? this.state.userInfo.userDirection
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field >
                    </Form.Field>
                    {/* <Form.Field>
                      <label>Usuario localBitcoin</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.userLocalBitcoin !== undefined &&
                        this.state.userInfo.userLocalBitcoin !== ""
                          ? this.state.userInfo.userLocalBitcoin
                          : "No posee"}
                      </p>
                    </Form.Field> */}
                  </Form.Group>
                  <Form.Group widths="equal">
                    {/* <Form.Field>
                      <label>Usuario de Facebook</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.userFacebook !== undefined &&
                        this.state.userInfo.userFacebook !== ""
                          ? this.state.userInfo.userFacebook
                          : "No posee"}
                      </p>
                    </Form.Field> */}
                    <Form.Field>
                      <label>Pregunta de seguridad</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.questionSecurity !== undefined &&
                        this.state.userInfo.questionSecurity !== ""
                          ? this.state.userInfo.questionSecurity
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Respuesta de seguridad</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.answerSecurity !== undefined &&
                        this.state.userInfo.answerSecurity !== ""
                          ? this.state.userInfo.answerSecurity
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Familiar de contacto</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.familyName !== undefined &&
                        this.state.userInfo.familyName !== ""
                          ? this.state.userInfo.familyName
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Email del contacto</label>
                      <p className="infoUserParagraph">
                        {this.state.userInfo.familyEmail !== undefined &&
                        this.state.userInfo.familyEmail !== ""
                          ? this.state.userInfo.familyEmail
                          : "No posee"}
                      </p>
                    </Form.Field>
                    <Form.Field></Form.Field>
                  </Form.Group>
                  <Divider horizontal>
                    <Header as="h4">Datos del usuario</Header>
                  </Divider>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Email</label>
                      {this.state.userInfo.email !== undefined &&
                        this.state.userInfo.email !== ""
                          ? this.state.userInfo.email
                          : "No posee"}
                    </Form.Field>
                    <Form.Field style={{ marginRight: -110 }}>
                      <label>Address</label>
                      {this.state.walletUser !== undefined &&
                      this.state.walletUser !== ""
                        ? this.state.walletUser
                        : "No posee"}
                    </Form.Field>
                    <Form.Field />
                    <Form.Field>
                      <label>Tipo de usuario</label>
                      {this.state.userInfo.type}
                    </Form.Field>
                    <Form.Field>
                      <label>Estatus del usuario</label>
                      {this.state.userInfo.active ? "Activo" : "Inactivo"}
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Nombre de usuario</label>
                      {this.state.userInfo.nickname !== undefined &&
                      this.state.userInfo.nickname !== ""
                        ? this.state.userInfo.nickname
                        : "No posee"}
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
                  <Divider horizontal>
                    <Header as="h4">Datos de la tarjeta</Header>
                  </Divider>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Nombre del Titular</label>
                      {this.state.infoDebitCardSelect.holderName}
                    </Form.Field>
                    <Form.Field>
                      <label>Moneda</label>
                      {this.state.infoDebitCardSelect.currency}
                    </Form.Field>
                    <Form.Field>
                      <label>Modelo</label>
                      {this.state.infoDebitCardSelect.model}
                    </Form.Field>
                    <Form.Field>
                      <label>Número de tarjeta</label>
                      {this.state.infoDebitCardSelect.id}
                    </Form.Field>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <div>
                        {this.state.infoDebitCardSelect.model === "MODEL_A" && (
                          <Image
                            style={{ margin: "auto", display: "block" }}
                            size="medium"
                            src={model_A}
                          />
                        )}
                        {this.state.infoDebitCardSelect.model === "MODEL_B" && (
                          <Image
                            style={{ margin: "auto", display: "block" }}
                            size="medium"
                            src={model_B}
                          />
                        )}
                        {this.state.infoDebitCardSelect.model === "MODEL_C" && (
                          <Image
                            style={{ margin: "auto", display: "block" }}
                            size="medium"
                            src={model_C}
                          />
                        )}
                      </div>
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Modal.Description>
            )}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default DebitsCardRequest;
