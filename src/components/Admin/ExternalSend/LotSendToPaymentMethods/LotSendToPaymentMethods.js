/* eslint-disable no-loop-func */
import React, { Component } from 'react';
import '../../Admin.css';
import {
  Button,
  Icon,
  Loader,
  Dimmer,
  Popup,
  Label,
  Modal,
  Header,
  Form,
  Dropdown,
  Input,
  Checkbox,
  Divider,
  Message,
  Select,
  Container,
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import NumberFormat from 'react-number-format';
import transferToBank from '../../../../services/transferToBank';
import userService from '../../../../services/user';
import ISOCURRENCIES from '../../../../common/ISO4217';
import otc from '../../../../services/otc';
import '../lot.css';
import { CSVLink } from 'react-csv';
import _ from 'underscore';
import { ConsoleView } from 'react-device-detect';
import theter from '../../../../img/tether-seeklogo.svg';

class LotSendToPaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listBatchProcesses: [],
      operations: [],
      showBatchProcessesTable: false,
      newProcess: false,
      showOperationsTable: true,
      showCreateProcess: false,
      currencies: [],
      currency: '',
      selectAccountType: '',
      dateFrom: null,
      dateTo: null,
      minOperationAmount: '',
      maxOperationAmount: '',
      totalAmount: '',
      totOperationAmount: 0,
      messageCreate: false,
      checkedAll: false,
      cantProcess: 0,
      changeStatusModal: false,
      operationsForProcess: [],
      expandedRow: null,
      changeStatusOpModal: false,
      messageProcessStatusSucess: false,
      messageProcessStatusFailed: false,
      messageOperationStatus: false,
      statusProcess: '',
      idProcess: '',
      statusOperation: '',
      idOperation: '',
      showButtonProcess: false,
      loaderChangeStatusProcess: false,
      loaderChangeStatusOperation: false,
      selectStatusProcessChange: [],
      selectStatusOperationChange: [],
      selectCurrencyPaymentMethodsAllowed: [],
      dataCVS: '',
      paymentMethodToChange: '',
      dollarBTCToPayToChangeStatus: '',
      paymentMethods: null,
      applyProcessModal: false,
      messageApplyProcess: '',
      statusApplyProcessModal: false,
    };
  }
  componentDidMount() {
    this.getBatchProcesses();
    this.getPaymentMethods();
  }
  getBatchProcesses = async () => {
    const response = await transferToBank.getBatchProcesses(
      this.state.cantProcess
    );
    try {
      var result = [];
      for (let l of response.data) {
        if (l !== undefined || l !== null) {
          let own = 0;
          let third = 0;
          let acumAmount = 0;
          for (let op of l.operations) {
            l.currency = op.currency;
            if (op.clientPayment.type === 'TRANSFER_WITH_SPECIFIC_BANK') {
              own = own + 1;
            } else {
              third = third + 1;
            }

            acumAmount = acumAmount + op.amount;
          }
          if (own > 0 && third > 0) {
            l.accounts = 'Ambas';
          } else if (own > 0) {
            l.accounts = 'Cuentas propias';
          } else {
            l.accounts = 'Cuentas de terceros';
          }

          if (l.dollarBTCPayment === undefined || l.dollarBTCPayment === null) {
            l.dollarBTCPayment = 'adminChoose';
          }

          let n;
          if (
            l.applyed === undefined ||
            l.applyed === null ||
            l.applyed === false
          ) {
            n = false;
          } else {
            n = l.applyed;
          }
          l.applyed = n;

          l.acumAmount = acumAmount;
          result.push(l);
        }
        this.setState({
          listBatchProcesses: result,
        });
      }
    } catch (error) {
      // console.log(error);
    }
    this.setState({
      showBatchProcessesTable: true,
    });
    if (this.state.expandedRow !== null) {
      this.operationsForProcess(this.state.expandedRow);
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

  newProcess = () => {
    this.loadCurrenciesToSearch();
    this.setState({ newProcess: true });
  };

  loadCurrenciesToSearch = () => {
    let currency = otc.getAdminCurrencies(userService.getUserName());
    currency
      .then((resp) => {
        let currencies = resp.data;
        let selectCurrencies = [];
        let currencyCurrent = {};
        for (let i = 0; i < currencies.length; i++) {
          let currencyToAddSelect = {};
          let countryCoin = currencies[i].shortName.split('_');
          currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
         if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAddSelect.flag = currencyCurrent.flag;
          } else if(currencies[i].shortName === "ETH") {
					  currencyToAddSelect.icon = "ethereum";
          } else if(currencies[i].shortName === "USDT") {
            currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          };
          currencyToAddSelect.key = currencies[i].shortName;
          currencyToAddSelect.value = currencies[i].shortName;
          currencyToAddSelect.text = currencies[i].fullName;
          if (currencyToAddSelect.key === 'USD') {
            selectCurrencies.push(currencyToAddSelect);
          }
        }
        this.setState({ currencies: selectCurrencies });
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  closeNewProcess = () => {
    this.setState({
      newProcess: false,
      showCreateProcess: false,
      operations: [],
      showOperationsTable: true,
      messageCreate: false,
      minOperationAmount: '',
      maxOperationAmount: '',
      totalAmount: '',
      dateFrom: null,
      dateTo: null,
    });
  };

  pickDateFrom = (e, data) => {
    this.setState({ dateFrom: e.target.value });
  };
  pickDateTo = (e, data) => {
    this.setState({ dateTo: e.target.value });
  };
  pickCant = (e, data) => {
    this.setState({ cantProcess: e.target.value });
  };
  pickMinOperationAmount = (e, data) => {
    this.setState({ minOperationAmount: e.target.value });
  };
  pickMaxOperationAmount = (e, data) => {
    this.setState({ maxOperationAmount: e.target.value });
  };
  pickTotOperationAmount = (e, data) => {
    this.setState({ totalAmount: e.target.value });
  };

  operations = async () => {
    if (this.state.minOperationAmount < this.state.maxOperationAmount) {
      this.setState({ showOperationsTable: false });
      var body = {
        userName: sessionStorage.getItem('username'),
        currency: this.state.currency,
        initTimestamp: this.state.dateFrom,
        finalTimestamp: this.state.dateTo,
        userPaymentType: this.state.selectAccountType,
        minPerOperationAmount: this.state.minOperationAmount,
        maxPerOperationAmount: this.state.maxOperationAmount,
        totalAmount: this.state.totalAmount,
      };
      let response = await transferToBank.getOperations(body);
      try {
        var result = [];
        for (let l of response.data) {
          let userList = l;
          if (userList !== undefined || userList !== null) {
            if (userList.checked === undefined) {
              userList.checked = false;
            }
            result.push(userList);
          }
          this.setState({
            operations: result,
            showOperationsTable: true,
          });
        }
      } catch (error) {}
    } else {
      this.setState({
        viewAlert: true,
        message: 'El monto minimo debe ser inferior al monto máximo',
      });
      setTimeout(() => {
        this.setState({
          viewAlert: false,
          message: '',
        });
      }, 6000);
    }
  };

  downloadCVS = (row) => {
    let userName = sessionStorage.getItem('username');
    // let id = this.state.idProcess;
    let id = row.original.id;
    let type = 'TDBANK';
    transferToBank
      .getProcessFile(userName, id, type)
      .then((resp) => {
        this.setState({ dataCVS: resp.data });
      })
      .catch((error) => {
        //////console.log(error);
      });
  };

  createProcess = async () => {
    this.setState({
      showButtonProcess: true,
    });
    let ids = [];
    this.state.operations.map(function (key) {
      if (key.checked === true) {
        ids.push(key.id);
      }
    });
    let body = {
      userName: sessionStorage.getItem('username'),
      currency: this.state.currency,
      ids: ids,
    };

    await transferToBank
      .createProcess(body)
      .then((resp) => {
        this.setState({ messageCreate: true, showButtonProcess: false }, () => {
          this.getBatchProcesses();
          setTimeout(() => {
            this.closeNewProcess();
          }, 5000);
        });
      })
      .catch((error) => {});
  };
  changeProcessStatus = () => {
    this.setState({
      loaderChangeStatusProcess: true,
    });

    let idDollarBTCPayment;
    if (this.state.statusProcess === 'FAILED') {
      idDollarBTCPayment = null;
    } else {
      idDollarBTCPayment = this.state.paymentMethodToChange;
    }
    let body = {
      userName: sessionStorage.getItem('username'),
      id: this.state.idProcess,
      status: this.state.statusProcess,
      dollarBTCPaymentId: idDollarBTCPayment,
    };
    transferToBank
      .changeProcessStatus(body)
      .then((resp) => {
        this.getBatchProcesses();
        if (resp.data === 'OK') {
          this.setState({ messageProcessStatusSucess: true }, () => {
            setTimeout(() => {
              this.setState({
                changeStatusModal: false,
                messageProcessStatusSucess: false,
                loaderChangeStatusProcess: false,
              });
            }, 5000);
          });
        } else {
          this.setState({ messageProcessStatusFailed: true }, () => {
            setTimeout(() => {
              this.setState({
                changeStatusModal: false,
                messageProcessStatusFailed: false,
                loaderChangeStatusProcess: false,
              });
            }, 5000);
          });
        }
      })
      .catch((error) => {});
  };

  changeOperationsOfProcessStatus = () => {
    this.setState({
      loaderChangeStatusOperation: true,
    });
    let body = {
      userName: sessionStorage.getItem('username'),
      processId: this.state.idProcess,
      id: this.state.idOperation,
      status: this.state.statusOperation,
    };

    transferToBank
      .changeOperationsOfProcessStatus(body)
      .then((resp) => {
        this.getBatchProcesses();
        this.setState({ messageOperationStatus: true }, () => {
          setTimeout(() => {
            this.setState({
              changeStatusOpModal: false,
              messageOperationStatus: false,
              loaderChangeStatusOperation: false,
            });
          }, 5000);
        });
      })
      .catch((error) => {});
  };

  currencyToSearch = (e, data) => {
    this.setState({ currency: data.value });
  };

  handleAccountType(e, data) {
    this.setState({
      selectAccountType: data.value,
    });
  }

  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };

  handleChecked = (e, data) => {
    var labelValue = data.value;
    var checkedValue = data.checked;
    var objectToSet = this.state.operations;
    for (var i = 0; i < objectToSet.length; i++) {
      if (objectToSet[i].id === labelValue) {
        objectToSet[i].checked = checkedValue;
        break;
      }
    }
    this.setState({ operations: objectToSet });
    this.funtionCreateProcess();
  };
  handleCheckedAll = (e, data) => {
    var checkedValue = data.checked;
    var objectToSet = this.state.operations;
    for (var i = 0; i < objectToSet.length; i++) {
      objectToSet[i].checked = checkedValue;
    }
    this.setState({ operations: objectToSet, checkedAll: data.checked });
    this.funtionCreateProcess();
  };

  funtionCreateProcess() {
    let cont = 0;
    this.state.operations.map(function (key) {
      if (key.checked === true) {
        cont = cont + 1;
      }
    });

    if (cont >= 1) {
      this.setState({ showCreateProcess: true });
    } else {
      this.setState({ showCreateProcess: false });
    }
  }

  openChangeStatusModal = (row) => {
    this.getPaymentMethodsDBTC(row.currency, row.acumAmount);
    this.setState({
      changeStatusModal: true,
      idProcess: row.id,
      dollarBTCToPayToChangeStatus: row.dollarBTCPayment,
    });
  };
  openChangeStatusOpModal = (row) => {
    this.getAvailableStatusToChangeOp(row);
    this.setState({ changeStatusOpModal: true, idOperation: row.id });
  };
  operationsForProcess = (row) => {
    var result = [];
    for (let op of row.original.operations) {
      result.push(op);
    }
    this.setState({ operationsForProcess: result, idProcess: row.original.id });
  };
  closeChangeStatus = () => {
    this.setState({
      changeStatusModal: false,
      statusProcess: '',
      paymentMethodToChange: '',
      dollarBTCToPayToChangeStatus: '',
      selectCurrencyPaymentMethodsAllowed: [],
      selectStatusProcessChange: [],
    });
  };

  closeApplyProcess = () => {
    this.setState({
      applyProcessModal: false,
      messageApplyProcess: ' ',
      statusApplyProcessModal: false,
    });
  };

  closeChangeOpStatus = () => {
    this.setState({
      changeStatusOpModal: false,
    });
  };

  pickStatusProcess = (e, data) => {
    this.setState({ statusProcess: data.value });
  };
  pickStatusOp = (e, data) => {
    this.setState({ statusOperation: data.value });
  };
  pickPaymentMethod = (e, data) => {
    this.setState({ paymentMethodToChange: data.value });
  };

  applyProcess = (e, data) => {
    var body = {
      userName: sessionStorage.getItem('username'),
      id: this.state.idProcess,
    };

    transferToBank
      .applyProcess(body)
      .then((resp) => {
        let message, positive;
        if (resp.data === 'OK') {
          message = 'El proceso ha sido aplicado con exito';
          positive = true;
          this.getBatchProcesses();
        } else {
          message = 'El proceso no ha sido aplicado con exito';
          positive = false;
        }
        this.setState(
          {
            applyProcessModal: true,
            messageApplyProcess: message,
            statusApplyProcessModal: positive,
          },
          () => {
            setTimeout(() => {
              this.setState({
                applyProcessModal: false,
                messageApplyProcess: ' ',
                statusApplyProcessModal: false,
              });
            }, 5000);
          }
        );
      })
      .catch((error) => {
        this.setState(
          {
            applyProcessModal: true,
            messageApplyProcess: 'El proceso no ha sido aplicado con exito',
            statusApplyProcessModal: false,
          },
          () => {
            setTimeout(() => {
              this.setState({
                applyProcessModal: false,
                messageApplyProcess: ' ',
                statusApplyProcessModal: false,
              });
            }, 5000);
          }
        );
      });
  };

  getPaymentMethods = () => {
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then((resp) => {
        this.setState({ paymentMethods: resp.data });
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  validateData(value) {
    if (value !== undefined) {
      return ' - ' + value;
    } else {
      return ' ';
    }
  }

  getPaymentMethodsDBTC = (currency, amount) => {
    var allCurrencyPaymentMethods = this.state.paymentMethods;
    var selectCurrencyPaymentMethods = [];
    Object.entries(allCurrencyPaymentMethods).forEach(
      ([currencyPaymentMethod, methodPaymentInfo]) => {
        if (currencyPaymentMethod === currency) {
          selectCurrencyPaymentMethods = methodPaymentInfo;
        }
      }
    );
    for (var i = 0; i < selectCurrencyPaymentMethods.length; i++) {
      if (
        selectCurrencyPaymentMethods[i].acceptOut === false ||
        selectCurrencyPaymentMethods[i].active === false
      ) {
        selectCurrencyPaymentMethods.splice(i, 1);
      }
    }
    var idsPayment = [];
    var balanceObject = {};
    for (var y = 0; y < selectCurrencyPaymentMethods.length; y++) {
      idsPayment.push(selectCurrencyPaymentMethods[y].id);
    }
    if (idsPayment.length > 0) {
      var body = {
        currency: currency,
        paymentIds: idsPayment,
      };
      let url = otc.getDollarBTCPaymentBalance(body);
      url
        .then((res) => {
          balanceObject = res.data;
          Object.entries(balanceObject).forEach(([idPayment, arrayBalance]) => {
            for (var z = 0; z < selectCurrencyPaymentMethods.length; z++) {
              if (idPayment === selectCurrencyPaymentMethods[z].id) {
                if (arrayBalance.length > 0) {
                  for (var x = 0; x < arrayBalance.length; x++) {
                    if (arrayBalance[x].currency === currency) {
                      selectCurrencyPaymentMethods[z].balance = arrayBalance[
                        x
                      ].amount.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      });
                    }
                  }
                } else {
                  selectCurrencyPaymentMethods[z].balance = 0;
                }
              }
            }
          });

          var definitiveSelectPaymentMethods = [];
          for (var j = 0; j < selectCurrencyPaymentMethods.length; j++) {
            var paymentMethodToPush = {};
            paymentMethodToPush.key = selectCurrencyPaymentMethods[j].id;
            paymentMethodToPush.value = selectCurrencyPaymentMethods[j].id;
            paymentMethodToPush.text =
              selectCurrencyPaymentMethods[j].bank !== undefined
                ? selectCurrencyPaymentMethods[j].id.slice(-4) +
                  this.validateData(selectCurrencyPaymentMethods[j].bank) +
                  this.validateData(
                    selectCurrencyPaymentMethods[j].accountHolderName
                  ) +
                  this.validateData(
                    selectCurrencyPaymentMethods[j].accountNumber
                  ) +
                  this.validateData(
                    selectCurrencyPaymentMethods[j].accountHolderId
                  ) +
                  this.validateData(currency) +
                  ' ' +
                  selectCurrencyPaymentMethods[j].balance
                : selectCurrencyPaymentMethods[j].id.slice(-4) +
                  this.validateData(
                    selectCurrencyPaymentMethods[j].walletAddress
                  ) +
                  this.validateData(currency) +
                  ' ' +
                  selectCurrencyPaymentMethods[j].balance;
            if (
              selectCurrencyPaymentMethods[j].balance.replace(/,/g, '') >=
              amount
            ) {
              definitiveSelectPaymentMethods.push(paymentMethodToPush);
            }
          }
          var definitiveSelectPaymentMethodsUniqueKey = _.uniq(
            definitiveSelectPaymentMethods,
            'key'
          );

          this.setState(
            {
              selectCurrencyPaymentMethodsAllowed: definitiveSelectPaymentMethodsUniqueKey,
            },
            () => {
              this.getAvailableStatusToChange();
            }
          );
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };

  getAvailableStatusToChange = () => {
    var allStatus = ['FAILED', 'OK'];
    if (
      this.state.expandedRow.original.transferToBankStatus.toString() ===
        'FAILED' ||
      this.state.expandedRow.original.transferToBankStatus.toString() === 'OK'
    ) {
      var index = allStatus.indexOf(
        this.state.expandedRow.original.transferToBankStatus.toString()
      );
      if (index > -1) {
        var availableStatus = [];
        allStatus.splice(index, 1);
        for (var i = 0; i < allStatus.length; i++) {
          var status = '';
          if (allStatus[i] === 'FAILED') {
            status = 'FALLIDA';
          } else {
            status = 'OK';
          }
          var itemToAdd = {
            key: allStatus[i],
            value: allStatus[i],
            text: status,
          };
          availableStatus.push(itemToAdd);
        }
        this.setState({ selectStatusProcessChange: availableStatus });
      }
    } else {
      var availableStatus = [];
      for (var j = 0; j < allStatus.length; j++) {
        var statusText = '';
        if (allStatus[j] === 'FAILED') {
          statusText = 'FALLIDA';
        } else {
          statusText = 'OK';
        }
        var itemToAdd = {
          key: allStatus[j],
          value: allStatus[j],
          text: statusText,
        };
        availableStatus.push(itemToAdd);
      }
      this.setState({ selectStatusProcessChange: availableStatus });
    }
  };

  getAvailableStatusToChangeOp = (row) => {
    var allStatus = ['FAILED', 'OK'];
    if (
      row.transferToBankStatus.toString() === 'FAILED' ||
      row.transferToBankStatus.toString() === 'OK'
    ) {
      var index = allStatus.indexOf(row.transferToBankStatus.toString());
      if (index > -1) {
        var availableStatus = [];
        allStatus.splice(index, 1);
        for (var i = 0; i < allStatus.length; i++) {
          var status = '';
          if (allStatus[i] === 'FAILED') {
            status = 'FALLIDA';
          } else {
            status = 'OK';
          }
          var itemToAdd = {
            key: allStatus[i],
            value: allStatus[i],
            text: status,
          };
          availableStatus.push(itemToAdd);
        }
        this.setState({ selectStatusOperationChange: availableStatus });
      }
    } else {
      var availableStatus = [];
      for (var j = 0; j < allStatus.length; j++) {
        var statusText = '';
        if (allStatus[j] === 'FAILED') {
          statusText = 'FALLIDA';
        } else {
          statusText = 'OK';
        }
        var itemToAdd = {
          key: allStatus[j],
          value: allStatus[j],
          text: statusText,
        };
        availableStatus.push(itemToAdd);
      }
      this.setState({ selectStatusOperationChange: availableStatus });
    }
  };

  render() {
    const accountType = [
      { key: 'OWN', value: 'OWN', text: 'Cuentas propias' },
      { key: 'THIRD', value: 'THIRD', text: 'Cuentas de terceros' },
      { key: 'BOTH', value: 'BOTH', text: 'Ambos' },
    ];

    const batchProcessesTableHeaders = [
      {
        Header: 'Aplicado',
        accessor: 'applyed',
        Cell: (row) => {
          if (row.value === true) {
            var icon;
            icon = (
              <Popup
                trigger={<Icon bordered inverted color='green' name='check' />}
                content='Proceso Aplicado'
              />
            );
          }
          return <div>{icon}</div>;
        },
        width: 65,
      },
      {
        Header: 'Id',
        accessor: 'id',
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: 'Creado por',
        accessor: 'creationUser',
        width: 200,
        Cell: (row) => {
          return row.value;
        },
      },
      {
        Header: 'Fecha de Creación',
        accessor: 'creationTimestamp',
        width: 180,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: 'Cantidad de Op.',
        accessor: 'operations.length',
        width: 150,
      },
      {
        Header: 'Tipo de Cuentas',
        accessor: 'accounts',
        width: 150,
      },
      {
        Header: 'Moneda',
        accessor: 'currency',
        width: 90,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Estatus',
        accessor: 'transferToBankStatus',
        Cell: (row) => {
          if (row.value === 'OK') {
            return (
              <Label color='green'>
                <Icon name='check circle' />
                OK
              </Label>
            );
          } else if (row.value === 'PENDING') {
            return (
              <Label color='blue'>
                <Icon name='sync' loading />
                PENDIENTE
              </Label>
            );
          } else if (row.value === 'FAILED') {
            return (
              <Label color='red'>
                <Icon name='warning circle' />
                FALLIDA
              </Label>
            );
          }
        },
        width: 150,
      },
    ];
    const operationsTableHeaders = [
      {
        Header: <Icon name='add' />,
        accessor: 'checked',
        width: 32,
        Cell: (row) => {
          if (row.value !== '' || row.value !== undefined) {
            var icon;
            return (icon = (
              <Checkbox
                value={row.original.id}
                onClick={this.handleChecked}
                checked={row.value}
              />
            ));
          }
          return <div>{icon}</div>;
        },
      },
      {
        Header: 'Id',
        accessor: 'id',
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: 'Usuario',
        accessor: 'userName',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        width: 134,
        minWidth: 110,
        width: 160,
        // filterMethod: (filter, row) => customOptionsFilterMethod2(filter, row),
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Moneda',
        accessor: 'currency',
        width: 50,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Banco',
        accessor: 'clientPayment.bank',
        width: 210,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Tipo de cuenta',
        accessor: 'clientPayment.type',
        width: 180,
        Cell: (row) => {
          if (row.value === 'TRANSFER_WITH_SPECIFIC_BANK') {
            return 'Cuenta propia';
          } else if (row.value === undefined || row.value === '') {
            return 'No definido';
          } else {
            return 'Cuenta de terceros';
          }
        },
      },
    ];
    const operationsForProcessTableHeaders = [
      {
        Header: 'Id',
        accessor: 'id',
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: 'Usuario',
        accessor: 'userName',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        width: 134,
        minWidth: 110,
        width: 160,
        // filterMethod: (filter, row) => customOptionsFilterMethod2(filter, row),
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Moneda',
        accessor: 'currency',
        width: 50,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Banco',
        accessor: 'clientPayment.bank',
        width: 210,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Tipo de cuenta',
        accessor: 'clientPayment.type',
        width: 120,
        Cell: (row) => {
          if (row.value === 'TRANSFER_WITH_SPECIFIC_BANK') {
            return 'Cuenta propia';
          } else if (row.value === undefined || row.value === '') {
            return 'No definido';
          } else {
            return 'Cuenta de terceros';
          }
        },
      },
      {
        Header: 'Estatus',
        accessor: 'transferToBankStatus',
        Cell: (row) => {
          if (row.value === 'OK') {
            return (
              <Label color='green'>
                <Icon name='check circle' />
                OK
              </Label>
            );
          } else if (row.value === 'PENDING') {
            return (
              <Label color='blue'>
                <Icon name='sync' loading />
                PENDIENTE
              </Label>
            );
          } else if (row.value === 'FAILED') {
            return (
              <Label color='red'>
                <Icon name='warning circle' />
                FALLIDA
              </Label>
            );
          }
        },
        width: 150,
      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        width: 75,
        Cell: (row) => {
          return (
            <div>
              <Popup
                trigger={
                  <Button
                    onClick={() => this.openChangeStatusOpModal(row.original)}
                    color='blue'
                    size='tiny'
                    circular
                    icon
                  >
                    <Icon name='exchange' />
                  </Button>
                }
                content='Cambiar estatus'
              />
            </div>
          );
        },
      },
    ];
    const SoperationsForProcessTableHeaders = [
      {
        Header: 'Id',
        accessor: 'id',
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: 'Usuario',
        accessor: 'userName',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        width: 134,
        minWidth: 110,
        width: 160,
        // filterMethod: (filter, row) => customOptionsFilterMethod2(filter, row),
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        width: 120,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Moneda',
        accessor: 'currency',
        width: 50,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Banco',
        accessor: 'clientPayment.bank',
        width: 210,
        Cell: (row) => {
          return <p>{row.value}</p>;
        },
      },
      {
        Header: 'Tipo de cuenta',
        accessor: 'clientPayment.type',
        width: 120,
        Cell: (row) => {
          if (row.value === 'TRANSFER_WITH_SPECIFIC_BANK') {
            return 'Cuenta propia';
          } else if (row.value === undefined || row.value === '') {
            return 'No definido';
          } else {
            return 'Cuenta de terceros';
          }
        },
      },
      {
        Header: 'Estatus',
        accessor: 'transferToBankStatus',
        Cell: (row) => {
          if (row.value === 'OK') {
            return (
              <Label color='green'>
                <Icon name='check circle' />
                OK
              </Label>
            );
          } else if (row.value === 'PENDING') {
            return (
              <Label color='blue'>
                <Icon name='sync' loading />
                PENDIENTE
              </Label>
            );
          } else if (row.value === 'FAILED') {
            return (
              <Label color='red'>
                <Icon name='warning circle' />
                FALLIDA
              </Label>
            );
          }
        },
        width: 150,
      },
    ];
    return (
      <div>
        {!this.state.showBatchProcessesTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <div style={{ textAlign: 'right' }}>
          <Button color='blue' type='submit' onClick={() => this.newProcess()}>
            Nuevo Proceso
          </Button>
        </div>
        <Divider></Divider>
        <Form>
          <Form.Group style={{ marginRight: 70 }}>
            <Form.Field width={3}>
              <label>Cantidad de procesos:</label>
              <Input name='date1' onChange={this.pickCant}></Input>
            </Form.Field>
            <Form.Field width={4}>
              <div align='center'>
                <Button
                  style={{ marginTop: 22 }}
                  type='submit'
                  onClick={this.getBatchProcesses}
                  color='blue'
                  icon
                  labelPosition='center'
                >
                  <Icon name='search' />
                  Buscar
                </Button>
              </div>
            </Form.Field>
            <Form.Field></Form.Field>
          </Form.Group>
        </Form>
        <ReactTable
          key={this.state.keyOperationTable}
          defaultSorted={[
            {
              id: 'creationTimestamp',
              desc: true,
            },
          ]}
          style={{ fontSize: 12 }}
          className='transactionTable'
          data={this.state.listBatchProcesses}
          columns={batchProcessesTableHeaders}
          defaultPageSize={5}
          previousText='Anterior'
          nextText='Siguiente'
          loadingText='Cargando...'
          noDataText='No hay transacciones'
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
                this.operationsForProcess(this.state.expandedRow);
                this.downloadCVS(this.state.expandedRow);
              }
            );
          }}
          SubComponent={(row) => {
            this.state.expandedRow = row;
            return (
              <Container
                style={{
                  padding: 30,
                  backgroundColor: row.original.applyed ? '#F1F0F0' : '#ffffff',
                }}
              >
                <Form>
                  <Form.Group inline>
                    <Form.Field width={10}>
                      <p>
                        <strong>Estatus actual del proceso: </strong>
                        {row.original.transferToBankStatus === 'FAILED'
                          ? 'FALLIDA'
                          : row.original.transferToBankStatus === 'OK'
                          ? 'OK'
                          : 'PENDIENTE'}
                      </p>
                      {!row.original.applyed && (
                        <Popup
                          trigger={
                            <Button
                              onClick={() =>
                                this.openChangeStatusModal(row.original)
                              }
                              color='blue'
                              size='tiny'
                              circular
                              icon
                            >
                              <Icon name='exchange' />
                            </Button>
                          }
                          content='Cambiar estatus'
                        />
                      )}
                    </Form.Field>
                    <Form.Field width={3}></Form.Field>
                    <Form.Field width={5}>
                      <CSVLink
                        data={this.state.dataCVS}
                        filename={'Lote_' + row.original.id + '.csv'}
                        target='_blank'
                        className={'btn'}
                        asyncOnClick={true}
                        onClick={(event, done) => {
                          done();
                        }}
                      >
                        <Icon name='download' />
                        Descargar archivo CSV
                      </CSVLink>
                    </Form.Field>
                    {!row.original.applyed &&
                      row.original.transferToBankStatus !== 'PENDING' && (
                        <Form.Field width={5}>
                          <Button
                            icon='check'
                            color='green'
                            content='Aplicar proceso'
                            onClick={this.applyProcess}
                          />
                          {/* <Button basic icon='check' color='green' content='Aplicar proceso' /> */}
                        </Form.Field>
                      )}
                  </Form.Group>
                </Form>
                <Divider hidden></Divider>
                <ReactTable
                  defaultSorted={[
                    {
                      id: 'timestamp',
                      desc: true,
                    },
                  ]}
                  className='operationsForProcessTable'
                  data={this.state.operationsForProcess}
                  columns={
                    !row.original.applyed
                      ? operationsForProcessTableHeaders
                      : SoperationsForProcessTableHeaders
                  }
                  defaultPageSize={5}
                  previousText='Anterior'
                  nextText='Siguiente'
                  loadingText='Cargando...'
                  noDataText='No existen envíos'
                  pageText='Página'
                  ofText='de'
                  rowsText='filas'
                  pageJumpText='ir a la página'
                  rowsSelectorText='filas por página'
                  minRow={5}
                />
              </Container>
            );
          }}
        />
        <Modal
          open={this.state.applyProcessModal}
          onClose={this.closeApplyProcess}
        >
          <Modal.Header>Aplicación del Proceso</Modal.Header>
          <Modal.Content>
            <Message
              positive={this.state.statusApplyProcessModal}
              negative={!this.state.statusApplyProcessModal}
            >
              <Message.Header>
                Aplicación{' '}
                {this.state.statusApplyProcessModal ? 'Exitosa' : 'Fallida'}
              </Message.Header>
              <p>{this.state.messageApplyProcess}</p>
            </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button
              type='submit'
              onClick={this.closeApplyProcess}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name='cancel' />
              Cancelar
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.changeStatusModal}
          onClose={this.closeChangeStatus}
        >
          <Modal.Header>Cambiar estatus del Proceso</Modal.Header>
          <Modal.Content>
            {this.state.selectStatusProcessChange.length === 0 && (
              <Dimmer active inverted>
                <Loader inverted>Cargando...</Loader>
              </Dimmer>
            )}
            {this.state.selectStatusProcessChange.length >= 0 && (
              <Form>
                <Form.Field width={16}>
                  <Select
                    placeholder='Escoge el nuevo estatus'
                    label='Seleccione el estatus :'
                    // disabled={this.state.loadChangeStatus}
                    options={this.state.selectStatusProcessChange}
                    onChange={this.pickStatusProcess}
                  />
                </Form.Field>
                {this.state.statusProcess === 'OK' &&
                  this.state.dollarBTCToPayToChangeStatus === 'adminChoose' && (
                    <Form.Field width={16}>
                      <Select
                        //disabled={this.state.loadChangeStatus}
                        placeholder='Escoge el medio de pago'
                        options={this.state.selectCurrencyPaymentMethodsAllowed}
                        onChange={this.pickPaymentMethod}
                      />
                    </Form.Field>
                  )}

                {this.state.messageProcessStatusSucess && (
                  <Message positive>
                    <Message.Header>Cambio de estatus exitoso</Message.Header>
                    <p>
                      El cambio de estatus del proceso se ejecuto exitosamente.
                    </p>
                  </Message>
                )}
                {this.state.messageProcessStatusFailed && (
                  <Message negative>
                    <Message.Header>Cambio de estatus fallido</Message.Header>
                    <p>Por favor indique el medio de pago.</p>
                  </Message>
                )}
              </Form>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              type='submit'
              onClick={this.closeChangeStatus}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name='cancel' />
              Cancelar
            </Button>
            {!this.state.messageProcessStatusSucess &&
              !this.state.messageProcessStatusFailed && (
                <Button
                  type='submit'
                  onClick={this.changeProcessStatus}
                  color='blue'
                  loading={this.state.loaderChangeStatusProcess}
                >
                  Cambiar Estatus
                </Button>
              )}
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.changeStatusOpModal}
          onClose={this.closeChangeOpStatus}
        >
          <Modal.Header>Cambiar estatus de la operación</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group>
                <Form.Field width={16}>
                  <Select
                    placeholder='Escoge el nuevo estatus'
                    label='Seleccione el estatus :'
                    // disabled={this.state.loadChangeStatus}
                    options={this.state.selectStatusOperationChange}
                    onChange={this.pickStatusOp}
                  />
                  {this.state.messageOperationStatus && (
                    <Message positive>
                      <Message.Header>Cambio de estatus exitoso</Message.Header>
                      <p>
                        El cambio de estatus de la operación se ejecuto
                        exitosamente.
                      </p>
                    </Message>
                  )}
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              type='submit'
              onClick={this.closeChangeOpStatus}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name='cancel' />
              Cancelar
            </Button>
            {!this.state.messageOperationStatus && (
              <Button
                type='submit'
                onClick={this.changeOperationsOfProcessStatus}
                color='blue'
                loading={this.state.loaderChangeStatusOperation}
              >
                Cambiar Estatus
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.newProcess}>
          <Header content='Nuevo Proceso' />
          <Modal.Content>
            {!this.state.messageCreate && (
              <div>
                <Form>
                  {this.state.currencies.length === 0 && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Form.Group style={{ marginRight: 70 }}>
                    <Form.Field width={5}>
                      <label>Moneda a consultar</label>
                      <Dropdown
                        placeholder='Seleccione una moneda'
                        fluid
                        search
                        selection
                        options={this.state.currencies}
                        onChange={this.currencyToSearch}
                      />
                    </Form.Field>
                    <Form.Field width={5}>
                      <label>Tipo de cuenta a consultar</label>
                      <Dropdown
                        placeholder='Seleccione un tipo de cuenta'
                        fluid
                        search
                        selection
                        options={accountType}
                        onChange={this.handleAccountType.bind(this)}
                      />
                    </Form.Field>
                    <Form.Field width={5}>
                      <label>Consultar desde:</label>
                      <Input
                        type='date'
                        name='dateFrom'
                        onChange={this.pickDateFrom}
                      ></Input>
                    </Form.Field>
                    <Form.Field width={5}>
                      <label>Consultar hasta:</label>
                      <Input
                        type='date'
                        name='dateTo'
                        onChange={this.pickDateTo}
                      ></Input>
                    </Form.Field>
                  </Form.Group>
                  <Form.Group style={{ marginRight: 70 }}>
                    <Form.Field width={5}>
                      <label>Monto minimo:</label>
                      <Input
                        name='date1'
                        value={this.state.minOperationAmount}
                        onChange={this.pickMinOperationAmount.bind(this)}
                      ></Input>
                    </Form.Field>
                    <Form.Field width={5}>
                      <label>Monto máximo:</label>
                      <Input
                        name='date'
                        value={this.state.maxOperationAmount}
                        onChange={this.pickMaxOperationAmount.bind(this)}
                      ></Input>
                    </Form.Field>
                    <Form.Field width={5}>
                      <label>Monto limite:</label>
                      <Input
                        name='date2'
                        value={this.state.totalAmount}
                        onChange={this.pickTotOperationAmount.bind(this)}
                      ></Input>
                    </Form.Field>
                    <Form.Field width={4}>
                      <div align='center'>
                        <Button
                          style={{ marginTop: 22 }}
                          type='submit'
                          onClick={this.operations.bind(this)}
                          color='blue'
                          icon
                          disabled={
                            this.state.minOperationAmount === '' ||
                            this.state.maxOperationAmount === '' ||
                            this.state.totalAmount === ''
                          }
                          labelPosition='center'
                          loading={!this.state.showOperationsTable}
                        >
                          <Icon name='search' />
                          Buscar
                        </Button>
                      </div>
                    </Form.Field>
                    <Form.Field></Form.Field>
                  </Form.Group>
                  {this.state.viewAlert === true && (
                    <Message negative style={{ marginBottom: 10 }}>
                      <p>{this.state.message}</p>
                    </Message>
                  )}
                </Form>
                <ReactTable
                  defaultSorted={[
                    {
                      id: 'timestamp',
                      desc: true,
                    },
                  ]}
                  loading={!this.state.showOperationsTable}
                  className='operationsTable'
                  data={this.state.operations}
                  columns={operationsTableHeaders}
                  defaultPageSize={5}
                  previousText='Anterior'
                  nextText='Siguiente'
                  loadingText='Cargando...'
                  noDataText='No existen envíos'
                  pageText='Página'
                  ofText='de'
                  rowsText='filas'
                  pageJumpText='ir a la página'
                  rowsSelectorText='filas por página'
                  minRow={5}
                />
                {this.state.operations.length !== 0 && (
                  <Checkbox
                    style={{ marginLeft: 10, marginTop: 10 }}
                    label='Todas las operaciones'
                    onClick={this.handleCheckedAll}
                    checked={this.state.checkedAll}
                  ></Checkbox>
                )}
              </div>
            )}
            {this.state.messageCreate && (
              <Message positive>
                <Message.Header>Creación exitosa</Message.Header>
                <p>El lote ha sido creado exitosamente.</p>
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              type='submit'
              onClick={this.closeNewProcess}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name='cancel' />
              Cancelar
            </Button>
            {this.state.showCreateProcess && !this.state.messageCreate && (
              <Button
                type='submit'
                onClick={this.createProcess}
                color='blue'
                icon
                labelPosition='left'
                loading={this.state.showButtonProcess}
              >
                <Icon name='add' />
                Crear Nuevo Proceso
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default LotSendToPaymentMethods;
