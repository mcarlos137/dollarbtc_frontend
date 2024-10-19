import React, { Component } from "react";
import "../../../Admin.css";
import {
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
  Select,
  List,
  Message,
  Label,
  Checkbox,
} from "semantic-ui-react";

import ReactTable from "react-table";
import config from "../../../../../services/config";
import otc from "../../../../../services/otc";
import currency from "../../../../../common/currency";
import axios from "axios";
import moment from "moment";
import NumberFormat from "react-number-format";
import marketModulator from "../../../../../services/marketModulator";
import masterAccountService from "../../../../../services/masterAccount";
const URL_BASE_DBTC = config.apiDollarBtcUrl;

class MasterAccountBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listMasterAccounts: [],
      masterAccountToSearch: "",
      masterAccountBalance: null,
      showAccountSearch: false,
      showAccountDetail: true,
      showAllAccountTable: null,
      showTransferBtn: false,
      transferModalOpen: false,
      currenciesBaseName: [],
      amountBaseName: [],
      masterAccountBaseName: null,
      currencyBaseName: null,
      listMasterAccountTargetName: [],
      masterAccountTargetName: null,
      amountBaseToSend: null,
      showMessageTransferError: false,
      showMessageTransferSuccess: false,
      showLabelNotEnough: false,
      keyTransfer: Math.random(),
      showMessageAllFieldRequired: false,
      masterAccountMovements: [],
      checkedMoneclick: false,
      currenciesToCompensate: [],
      amountToTransferCompensate: "",
      currencyToCompensate: "",
    };
    this.getMasterAccountBalance = this.getMasterAccountBalance.bind(this);
  }
  componentDidMount() {
    this.getMasterAccounts();
    this.getCurrenciesAvailables();
  }
  getCurrenciesAvailables() {
    otc.getCurrencies().then((response) => {
      let arrayCurrency = response.data;
    
      //console.log('currency.currencies ', currency.currencies);
      for (let i = 0; i < arrayCurrency.length; i++) {
        let currencyFiltered = currency.currencies.filter((currency) => {
          return currency.value === arrayCurrency[i].shortName;
        });
        if (currencyFiltered !== undefined && currencyFiltered.length > 0) {
          arrayCurrency[i].img = currencyFiltered[0].img;
        }
        arrayCurrency[i].flag = currencyFiltered[0].flag;

        if (currencyFiltered[0].value === "ETH") {
          arrayCurrency[i].icon = currencyFiltered[0].icon;
        }
        arrayCurrency[i].value = arrayCurrency[i].shortName;
        arrayCurrency[i].text = currencyFiltered[0].text;
      }
      this.setState({ currenciesToCompensate: arrayCurrency });
    });
  }
  getMasterAccounts = () => {
    masterAccountService
      .getMasterAccountNames()
      .then((resp) => {
        var masterAccounts = [];
        for (var i = 0; i < resp.data.length; i++) {
          var optionToPush = {};
          optionToPush.key = resp.data[i];
          optionToPush.text = resp.data[i];
          optionToPush.value = resp.data[i];
          masterAccounts.push(optionToPush);
        }
        masterAccounts.push({ key: "TODAS", value: "TODAS", text: "TODAS" });
        this.setState({ listMasterAccounts: masterAccounts }, () =>
          this.setState({ showAccountSearch: true })
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  makeDataTable = (account) => {
    var allMasterAccountBalance = [];
    Object.entries(account).forEach(([key, value]) => {
      var masterAccountBalanceToAdd = {};
      masterAccountBalanceToAdd.accountName = key;
      masterAccountBalanceToAdd.balance = value;
      allMasterAccountBalance.push(masterAccountBalanceToAdd);
    });
    this.setState(
      {
        masterAccountBalance: allMasterAccountBalance,
        showAllAccountTable: true,
      },
      () => this.setState({ showAccountDetail: true })
    );
  };
  getMasterAccountBalance = () => {
    this.setState({ showAccountDetail: false });
    this.getMasterAccounts();
    if (this.state.masterAccountToSearch === "TODAS") {
      let url = otc.getBalancesMaster();
      url
        .then((resp) => {
          this.makeDataTable(resp.data.result);
        })
        .catch((error) => {
          //console.log(error);
        });
    } else {
      let url = otc.getBalancesMaster(this.state.masterAccountToSearch);
      url
        .then((resp) => {
          var showTransferButton = false;
          var currenciesBase = [];
          var amountsBase = [];
          for (var i = 0; i < resp.data.result.length; i++) {
            if (resp.data.result[i].amount > 0) {
              showTransferButton = true;
              for (var j = 0; j < resp.data.result.length; j++) {
                if (resp.data.result[j].amount > 0) {
                  var currencyToAdd = {};
                  var amountToAdd = {};
                  currencyToAdd.key = resp.data.result[j].currency;
                  currencyToAdd.value = resp.data.result[j].currency;
                  currencyToAdd.text = resp.data.result[j].currency;
                  amountToAdd.key = resp.data.result[j].currency;
                  amountToAdd.value = resp.data.result[j].amount;
                  amountToAdd.text = resp.data.result[j].amount;
                  currenciesBase.push(currencyToAdd);
                  amountsBase.push(amountToAdd);
                }
              }
              break;
            }
          }
          let masterAccountsTransfer = this.state.listMasterAccounts.slice();
          var index = masterAccountsTransfer
            .map((x) => {
              return x.key;
            })
            .indexOf(this.state.masterAccountToSearch);
          masterAccountsTransfer.splice(index, 1);
          var allIndex = masterAccountsTransfer
            .map((x) => {
              return x.key;
            })
            .indexOf({ key: "TODAS", value: "TODAS", text: "TODAS" });
          masterAccountsTransfer.splice(allIndex, 1);
          var body = {
            masterAccountName: this.state.masterAccountToSearch,
            initTimestamp: "",
            endTimestamp: "",
            balanceOperationType: null,
          };
          let url = marketModulator.getBalanceMovementsMaster(body);
          url
            .then((res) => {
              var allMovements = [];
              //console.log(res.data);
              Object.entries(res.data).forEach(([keyDate, movements]) => {
                var movementToAdd = {};
                movementToAdd.date = moment(keyDate.split("__")[0]).format(
                  "YYYY/MM/DD HH:mm:ss"
                );
                Object.entries(movements).forEach(([keyData, movementInfo]) => {
                  if (keyData === "addedAmount") {
                    movementToAdd.type = "add";
                    Object.entries(movementInfo).forEach(
                      ([amountName, amountValue]) => {
                        if (amountName === "currency") {
                          movementToAdd.currency = amountValue;
                        } else if (amountName === "amount") {
                          movementToAdd.amount = amountValue;
                        }
                      }
                    );
                  } else if (keyData === "substractedAmount") {
                    movementToAdd.type = "remove";
                    Object.entries(movementInfo).forEach(
                      ([amountName, amountValue]) => {
                        if (amountName === "currency") {
                          movementToAdd.currency = amountValue;
                        } else if (amountName === "amount") {
                          movementToAdd.amount = amountValue;
                        }
                      }
                    );
                  } else if (keyData === "balanceOperationType") {
                    movementToAdd.balanceOperationType = movementInfo;
                  } else if (keyData === "balanceOperationStatus") {
                    movementToAdd.balanceOperationStatus = movementInfo;
                  }
                });
                allMovements.push(movementToAdd);
              });

              //console.log(allMovements);
              this.setState(
                {
                  listMasterAccountTargetName: masterAccountsTransfer,
                  masterAccountBalance: resp.data.result,
                  showTransferBtn: showTransferButton,
                  currenciesBaseName: currenciesBase,
                  amountBaseName: amountsBase,
                  masterAccountBaseName: this.state.masterAccountToSearch,
                  masterAccountMovements: allMovements,
                  showAllAccountTable: false,
                },
                () => this.setState({ showAccountDetail: true })
              );
            })
            .catch((error) => {
              //console.log(error);
            });
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };
  pickMasterAccount = (e, data) => {
    this.setState({
      masterAccountToSearch: data.value,
    });
  };

  pickCurrencyBaseName = (e, data) => {
    this.setState({
      currencyBaseName: data.value,
    });
  };
  pickCurrencyBaseNameCompensate = (e, data) => {
    this.setState({
      currencyToCompensate: data.value,
    });
  };
  handleAmount = (e) => {
    this.setState({ amountBaseToSend: e.target.value });
  };
  pickMasterAccountTargetName = (e, data) => {
    this.setState({
      masterAccountTargetName: data.value,
    });
  };
  openTransferModal = () => this.setState({ transferModalOpen: true });

  closeTransferModal = () => {
    this.getMasterAccounts();
    this.setState({
      transferModalOpen: false,
      checkedMoneclick: false,
      amountToTransferCompensate: "",
      currencyToCompensate: "",
    });
  };
  transferBetweenMasters = () => {
    if (
      this.state.currencyBaseName !== null &&
      this.state.amountBaseToSend !== null &&
      this.state.masterAccountTargetName !== null
    ) {
      for (var i = 0; i < this.state.amountBaseName.length; i++) {
        if (this.state.currencyBaseName === this.state.amountBaseName[i].key) {
          var maxToSend = this.state.amountBaseName[i].value;
        }
      }

      if (this.state.amountBaseToSend <= maxToSend) {
        var body = {
          masterAccountBaseName: this.state.masterAccountBaseName,
          masterAccountTargetName: this.state.masterAccountTargetName,
          currency: this.state.currencyBaseName,
          amount: this.state.amountBaseToSend,
          compensateMoneyclick: this.state.checkedMoneclick,
          moneyclickCompensationCurrency:
            this.state.checkedMoneclick === true
              ? this.state.currencyToCompensate
              : null,
          moneyclickCompensationAmount:
            this.state.checkedMoneclick === true
              ? this.state.amountToTransferCompensate
              : null,
        };
        marketModulator
          .transferBetweenMaster(body)
          .then((res) => {
            this.setState({
              showMessageTransferSuccess: true,
              keyTransfer: Math.random(),
              masterAccountTargetName: null,
              currencyBaseName: null,
              amountBaseToSend: null,
              checkedMoneclick: false,
              currencyToCompensate: "",
              amountToTransferCompensate: "",
            });
            setTimeout(() => {
              this.setState(
                {
                  showMessageTransferSuccess: false,
                },
                () => this.closeTransferModal()
              );
            }, 5000);
          })
          .catch((error) => {
            this.setState({
              showMessageTransferError: true,
              keyTransfer: Math.random(),
              masterAccountTargetName: null,
              currencyBaseName: null,
              amountBaseToSend: null,
            });
            setTimeout(() => {
              this.setState({
                showMessageTransferError: false,
              });
            }, 5000);
            //console.log(error);
          });
      } else {
        this.setState({ showLabelNotEnough: true });
        setTimeout(() => {
          this.setState({
            showLabelNotEnough: false,
          });
        }, 5000);
      }
    } else {
      this.setState({ showMessageAllFieldRequired: true });
      setTimeout(() => {
        this.setState({
          showMessageAllFieldRequired: false,
        });
      }, 5000);
    }
  };
  render() {
    var messageTransferSuccess,
      messageTransferError,
      labelNotEnough,
      messageAllFieldRequired;
    if (this.state.showMessageTransferSuccess) {
      messageTransferSuccess = (
        <Message positive>
          <Message.Header>Transferencia exitosa</Message.Header>
          <p>La transferencia entre cuentas master ha sido exitosa.</p>
        </Message>
      );
    }
    if (this.state.showMessageAllFieldRequired) {
      messageAllFieldRequired = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>Todos los campos son necesarios.</p>
        </Message>
      );
    }
    if (this.state.showMessageTransferError) {
      messageTransferError = (
        <Message negative>
          <Message.Header>Transferencia fallida</Message.Header>
          <p>
            La transferencia entre cuentas master no ha podido ser realizada,
            intente de nuevo más tarde.
          </p>
        </Message>
      );
    }
    if (this.state.showLabelNotEnough) {
      labelNotEnough = (
        <Label basic color="red" pointing>
          Esta cuenta no tiene fondos suficientes
        </Label>
      );
    }
    const allAccountMasterTableHeaders = [
      {
        Header: "Cuenta",
        accessor: "accountName",
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: (row) => {
          if (row.value.length > 0) {
            return (
              <List>
                {row.value.map((balance) => (
                  <List.Item key={balance.currency}>
                    <div>
                      <label>
                        <b>{balance.currency}:</b>
                      </label>{" "}
                      <NumberFormat
                        value={this.floorDecimals(balance.amount, 8)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </List.Item>
                ))}
              </List>
            );
          } else {
            return 0;
          }
        },
      },
    ];
    const accountMasterMovementsTableHeaders = [
      {
        Header: "Tipo",
        accessor: "type",
        Cell: (row) =>
          row.value === "add" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          ),
        width: 55,
      },
      {
        Header: "Fecha",
        accessor: "date",
      },
      {
        Header: "Moneda",
        accessor: "currency",
        width: 89,
      },
      {
        Header: "Monto",
        accessor: "amount",
        width: 152,
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right",
            },
          };
        },
        Cell: (row) => (
          <NumberFormat
            value={this.floorDecimals(row.value, 8)}
            displayType={"text"}
            thousandSeparator={true}
          />
        ),
      },
      {
        Header: "Tipo de operación",
        accessor: "balanceOperationType",
        Cell: (row) => {
          if (row.value === "TRANSFER_BETWEEN_MASTERS") {
            return "Transferencia entre cuentas maestras";
          } else if (row.value === "TRANSFER_TO_CLIENTS") {
            return "Transferencia a clientes";
          } else if (row.value === "CREDIT") {
            return "Crédito";
          } else if (row.value === "DEBIT") {
            return "Débito";
          } else if (row.value === "TRANSFER_TO_MASTER") {
            return "Transferencia a cuenta maestra";
          } else {
            return row.value;
          }
        },
      },
      {
        Header: "Estatus",
        accessor: "balanceOperationStatus",
        Cell: (row) => {
          if (row.value === "OK") {
            return (
              <Label color="green">
                <Icon name="check circle" />
                OK
              </Label>
            );
          } else if (row.value === "PROCESSING") {
            return (
              <Label color="blue">
                <Icon name="sync" loading />
                PROCESANDO
              </Label>
            );
          } else if (row.value === "FAIL") {
            return (
              <Popup
                trigger={
                  <Label color="red">
                    <Icon name="warning circle" />
                    FALLIDA
                  </Label>
                }
                content={row.original.message}
                on="hover"
              />
            );
          } else {
            return row.value;
          }
        },
        width: 150,
      },
    ];
    return (
      <div>
        {!this.state.showAccountSearch && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {!this.state.showAccountDetail && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Cuenta a consultar:</label>
              <Select
                search
                placeholder="Seleccione una cuenta"
                options={this.state.listMasterAccounts}
                onChange={this.pickMasterAccount}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.masterAccountToSearch === ""}
              icon
              labelPosition="left"
              color="blue"
              style={{ marginTop: 23 }}
              type="submit"
              onClick={this.getMasterAccountBalance}
            >
              <Icon name="search" />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        {this.state.masterAccountBalance !== null &&
          !this.state.showAllAccountTable && (
            <div>
              <Divider section />
              <Grid>
                <Grid.Row columns="equal">
                  <Grid.Column>
                    {this.state.masterAccountBalance.length > 0 ? (
                      <div>
                        <List as="ol">
                          <List.Item>
                            <List.Header>Balance</List.Header>
                            <List.Item as="ol">
                              {this.state.masterAccountBalance.map(
                                (masterAccount) => {
                                  return (
                                    <List.Item
                                      as="li"
                                      value="-"
                                      key={masterAccount.currency}
                                    >
                                      <div>
                                        <label>
                                          <b>{masterAccount.currency}: </b>
                                        </label>{" "}
                                        <NumberFormat
                                          value={this.floorDecimals(
                                            masterAccount.amount,
                                            8
                                          )}
                                          displayType={"text"}
                                          thousandSeparator={true}
                                        />
                                      </div>
                                    </List.Item>
                                  );
                                }
                              )}
                            </List.Item>
                          </List.Item>
                        </List>
                      </div>
                    ) : (
                      <p> Esta cuenta no posee valores</p>
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {this.state.showTransferBtn && (
                      <Modal
                        trigger={
                          <Button
                            style={{ marginTop: 10 }}
                            color="blue"
                            icon
                            labelPosition="left"
                            onClick={this.openTransferModal}
                          >
                            <Icon name="external square alternate" />
                            Transferir fondos
                          </Button>
                        }
                        open={this.state.transferModalOpen}
                        onClose={this.closeTransferModal}
                      >
                        <Header
                          icon="external square alternate"
                          content="Transferir fondos"
                        />
                        <Modal.Content>
                          Recuerde que la transferencia de fondos será realizada
                          desde la cuenta {this.state.masterAccountBaseName}
                          <Divider />
                          <Form>
                            {messageTransferSuccess}
                            {messageTransferError}
                            {messageAllFieldRequired}
                            <Form.Group key={this.state.keyTransfer}>
                              <Form.Field>
                                <label>Moneda a transferir:</label>
                                <Select
                                  search
                                  placeholder="Seleccione una moneda"
                                  options={this.state.currenciesBaseName}
                                  onChange={this.pickCurrencyBaseName}
                                />
                              </Form.Field>
                              <Form.Field>
                                <label>Cuenta a transferir:</label>
                                <Select
                                  search
                                  placeholder="Seleccione una cuenta"
                                  options={
                                    this.state.listMasterAccountTargetName
                                  }
                                  onChange={this.pickMasterAccountTargetName}
                                />
                              </Form.Field>
                              <Form.Field>
                                <label>Monto a transferir:</label>
                                <input
                                  placeholder="0.00000"
                                  onChange={this.handleAmount}
                                />
                                {labelNotEnough}
                              </Form.Field>
                              <Form.Field style={{ marginTop: "32px" }}>
                                <Checkbox
                                  label="Compensa MoneyClick"
                                  onChange={() =>
                                    this.setState({
                                      checkedMoneclick: !this.state
                                        .checkedMoneclick,
                                    })
                                  }
                                  checked={this.state.checkedMoneclick}
                                />
                              </Form.Field>
                            </Form.Group>
                            {this.state.checkedMoneclick === true && (
                              <Form.Group>
                                <Form.Field>
                                  <label>Moneda de Compensación:</label>
                                  <Select
                                    search
                                    selection
                                    value={this.state.currencyToCompensate}
                                    placeholder="Seleccione una moneda"
                                    options={this.state.currenciesToCompensate}
                                    onChange={this.pickCurrencyBaseNameCompensate.bind(
                                      this
                                    )}
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <label>Monto de Compensación:</label>
                                  <NumberFormat
                                    placeholder="0.00"
                                    value={
                                      this.state.amountToTransferCompensate
                                    }
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.setState({
                                        amountToTransferCompensate: parseFloat(
                                          value
                                        ),
                                      });
                                    }}
                                    suffix={
                                      "   " +
                                      this.state.currencyToCompensate.toUpperCase()
                                    }
                                  />
                                </Form.Field>
                              </Form.Group>
                            )}
                          </Form>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button onClick={this.closeTransferModal}>
                            <Icon name="cancel" /> Cancelar
                          </Button>
                          <Button
                            color="green"
                            onClick={this.transferBetweenMasters.bind(this)}
                          >
                            <Icon name="checkmark" /> Transferir
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider />
              <Header as="h3">Movimientos de la cuenta maestra</Header>
              <ReactTable
                className="transactionTable"
                defaultSorted={[
                  {
                    id: "date",
                    desc: true,
                  },
                ]}
                data={this.state.masterAccountMovements}
                columns={accountMasterMovementsTableHeaders}
                defaultPageSize={5}
                previousText="Anterior"
                nextText="Siguiente"
                loadingText="Cargando..."
                noDataText="No existen movimientos"
                pageText="Página"
                ofText="de"
                rowsText="filas"
                pageJumpText="ir a la página"
                rowsSelectorText="filas por página"
                minRow={5}
              />
            </div>
          )}
        {this.state.masterAccountBalance !== null &&
          this.state.showAllAccountTable && (
            <div>
              <Divider section />
              <ReactTable
                className="transactionTable"
                data={this.state.masterAccountBalance}
                columns={allAccountMasterTableHeaders}
                defaultPageSize={5}
                previousText="Anterior"
                nextText="Siguiente"
                loadingText="Cargando..."
                noDataText="No existen balances"
                pageText="Página"
                ofText="de"
                rowsText="filas"
                pageJumpText="ir a la página"
                rowsSelectorText="filas por página"
                minRow={5}
              />
            </div>
          )}
      </div>
    );
  }
}

export default MasterAccountBalance;
