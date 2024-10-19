import React, { Component } from "react";
import {
  Menu,
  Segment,
  Dimmer,
  Loader,
  Form,
  Select,
  Icon,
} from "semantic-ui-react";
import "react-table/react-table.css";
import OTCAccounts from "./OTCAccounts";
import InfoOperations from "./InfoOperations";
import SendBitCoinsMasterAccount from "./SendBitCoinsMasterAccount";
import ReceiveBitCoinsToMasterAccount from "./ReceiveBitCoinsToMasterAccount";
import userService from "../../../../services/user";
import otc from "../../../../services/otc";
import marketModulator from "../../../../services/marketModulator";
import moment from "moment";
import masterAccount from "../../../../services/masterAccount";
class MenuOtcAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      miniMenu: false,
      OTCAccountsSelectOptions: [],
      OTCAccountsBalance: {},
      OTCAccountToSearch: "",
      OTCAccountBalance: "",
      OTCAccountMovements: [],
      OTCAccountBalances: [],
      showOTCAccounts: false,
      showOTCAccountDetail: true,
      OTCAccountCurrencies: [],
      dateFrom: "",
      dateTo: "",
      balanceOtcBtc: "",
      activeAddress: "",
      actionsUser: [],
    };
  }
  /* state = { activeItem: "sendBitcoins",miniMenu:false };*/
  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = "";
      if (arrayFunctions.indexOf("otc_account_transactions") !== -1) {
        nameItem = "transactions";
      } else {
        if (arrayFunctions.indexOf("send_bitcoins") !== -1) {
          nameItem = "send_bitcoins";
        } else {
          if (arrayFunctions.indexOf("receive_bitcoins") !== -1) {
            nameItem = "receive_bitcoins";
          } else {
            nameItem = "info_operations";
          }
        }
      }
      this.setState({
        actionsUser: arrayFunctions,
        activeItem: nameItem,
      });
    }
    this.getOTCAccounts();
    this.getOTCAccountsBalance();
  }
  getOTCAccounts = () => {
    let url = otc.getMasterAccount(userService.getUserName());
    url
      .then((resp) => {
        var OTCaccountsArray = resp.data;
        var OTCAccountsToSelect = [];
        for (var i = 0; i < OTCaccountsArray.length; i++) {
          var objectToPush = {};
          objectToPush.key = OTCaccountsArray[i].name;
          objectToPush.text = OTCaccountsArray[i].description;
          var currenciesString = "";
          for (var j = 0; j < OTCaccountsArray[i].currencies.length; j++) {
            if (j > 0) {
              currenciesString += "_" + OTCaccountsArray[i].currencies[j];
            } else {
              currenciesString = OTCaccountsArray[i].currencies[j];
            }
          }
          objectToPush.value =
            OTCaccountsArray[i].name + "_currencies_" + currenciesString;
          OTCAccountsToSelect.push(objectToPush);
        }
        this.setState({
          OTCAccountsSelectOptions: OTCAccountsToSelect,
          showOTCAccounts: true,
        });
      })
      .catch((error) => {});
  };

  getOTCAccountsBalance = () => {
    let url = otc.getOTCAccountsBalance(userService.getUserName());
    url
      .then((resp) => {
        this.setState({ OTCAccountsBalance: resp.data });
      })
      .catch((error) => {});
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  pickOTCAccountToSearch = (e, data) => {
    this.setState({
      OTCAccountToSearch: data.value,
      otcName: data.value.split("_currencies_")[0],
    });
  };
  searchOTCAccount = () => {
    this.setState({ showOTCAccountDetail: false });
    var otcName = this.state.OTCAccountToSearch.split("_currencies_")[0];
    var otcCurrenciesArray = this.state.OTCAccountToSearch.split(
      "_currencies_"
    )[1].split("_");
    var otcCurrenciesString = otcCurrenciesArray.join(", ");
    var balanceArray = this.state.OTCAccountsBalance[otcName];
    var amountBalance = "";
    for (var i = 0; i < balanceArray.length; i++) {
      if (balanceArray[i].currency === "BTC") {
        amountBalance = balanceArray[i].amount;
        break;
      }
    }
    var body = {
      masterAccountName: otcName,
      initTimestamp: "",
      endTimestamp: "",
      balanceOperationType: null,
    };
    this.getConfigAccountOtc(otcName);
    let url = marketModulator.getBalanceMovementsMaster(body);
    url
      .then((res) => {
        var allMovements = [];
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
        this.setState({
          OTCAccountMovements: allMovements,
          OTCAccountBalance: amountBalance,
          OTCAccountCurrencies: otcCurrenciesString,
          showOTCAccountDetail: true,
        });
      })
      .catch((error) => {
        ////console.log(error);
      });

    let userName = userService.getUserName();
    var bodyOtc = {
      userName: userName,
      masterAccountName: otcName,
      initTimestamp: "",
      finalTimestamp: "",
    };

    let urlOtc = otc.getOTCMasterAccountProfitsAndChargesBalance(bodyOtc);
    urlOtc
      .then((res) => {
        var allBalances = [];
        Object.entries(res.data).forEach(([currency, balanceCurrency]) => {
          var balanceToAdd = {};

          if (currency !== "BTC") {
            balanceToAdd.currency = currency;
            Object.entries(balanceCurrency).forEach(
              ([keyData, balanceInfo]) => {
                if (keyData === "operationBalance") {
                  balanceToAdd.operationBalance = balanceInfo;
                } else if (keyData === "charges") {
                  Object.entries(balanceInfo).forEach(
                    ([chargeName, chargeValue]) => {
                      if (chargeName === "COMMISSION") {
                        balanceToAdd.VAT = 0;
                        balanceToAdd.COMMISSION = chargeValue;
                      } else if (chargeName === "VAT") {
                        balanceToAdd.VAT = chargeValue;
                        balanceToAdd.COMMISSION = 0;
                      }
                    }
                  );
                }
              }
            );
            allBalances.push(balanceToAdd);
          } else if (currency === "BTC") {
            balanceToAdd.currency = currency;
            Object.entries(balanceCurrency).forEach(
              ([keyData, balanceInfo]) => {
                if (keyData === "operationBalance") {
                  balanceToAdd.operationBalance = balanceInfo;
                } else if (keyData === "charges") {
                  Object.entries(balanceInfo).forEach(
                    ([chargeName, chargeValue]) => {
                      if (chargeName === "COMMISSION") {
                        balanceToAdd.COMMISSION = chargeValue;
                        balanceToAdd.VAT = 0;
                      }
                    }
                  );
                }
              }
            );
            allBalances.push(balanceToAdd);
          }
        });
        this.setState(
          {
            OTCAccountBalances: allBalances,
            showOTCAccountDetail: true,
          },
          () => {
            this.setState({
              balanceOtcBtc: this.state.OTCAccountBalances.filter(
                (currency) => {
                  return currency.currency === "BTC";
                }
              )[0].operationBalance,
            });
          }
        );
      })
      .catch((error) => {
        ////console.log(error);
      });
  };
  getBalanceAcountCountOtc = () => {
    let userName = userService.getUserName();
    var otcName = this.state.OTCAccountToSearch.split("_currencies_")[0];
    var bodyOtc = {
      userName: userName,
      masterAccountName: otcName,
      initTimestamp: new Date(this.state.dateFrom).toISOString(),
      finalTimestamp: new Date(this.state.dateTo).toISOString(),
    };
    let urlOtc = otc.getOTCMasterAccountProfitsAndChargesBalance(bodyOtc);
    urlOtc
      .then((res) => {
        var allBalances = [];
        Object.entries(res.data).forEach(([currency, balanceCurrency]) => {
          var balanceToAdd = {};
          /*movementToAdd.date = moment(keyDate.split("__")[0]).format(
            "YYYY/MM/DD HH:mm:ss"
          );*/
          if (currency !== "BTC") {
            balanceToAdd.currency = currency;
            Object.entries(balanceCurrency).forEach(
              ([keyData, balanceInfo]) => {
                if (keyData === "operationBalance") {
                  balanceToAdd.operationBalance = balanceInfo;
                } else if (keyData === "charges") {
                  Object.entries(balanceInfo).forEach(
                    ([chargeName, chargeValue]) => {
                      if (chargeName === "COMMISSION") {
                        balanceToAdd.COMMISSION = chargeValue;
                        balanceToAdd.VAT = 0;
                      } else if (chargeName === "VAT") {
                        balanceToAdd.COMMISSION = 0;
                        balanceToAdd.VAT = chargeValue;
                      }
                    }
                  );
                }
              }
            );
            allBalances.push(balanceToAdd);
          } else if (currency === "BTC") {
            balanceToAdd.currency = currency;
            Object.entries(balanceCurrency).forEach(
              ([keyData, balanceInfo]) => {
                if (keyData === "operationBalance") {
                  balanceToAdd.operationBalance = balanceInfo;
                } else if (keyData === "charges") {
                  Object.entries(balanceInfo).forEach(
                    ([chargeName, chargeValue]) => {
                      if (chargeName === "COMMISSION") {
                        balanceToAdd.COMMISSION = chargeValue;
                        balanceToAdd.VAT = 0;
                      }
                    }
                  );
                }
              }
            );
            allBalances.push(balanceToAdd);
          }
        });
        this.setState(
          {
            OTCAccountBalances: allBalances,
            showOTCAccountDetail: true,
          },
          () => {
            this.setState({
              balanceOtcBtc: this.state.OTCAccountBalances.filter(
                (currency) => {
                  return currency.currency === "BTC";
                }
              )[0].operationBalance,
            });
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  pickDateFrom(e, date) {
    this.setState({ dateFrom: e.target.value });
  }
  pickDateTo(e, date1) {
    this.setState({ dateTo: e.target.value });
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  async getConfigAccountOtc(otc_name) {
    try {
      let oldAddress = [];
      const response = await masterAccount.getMasterAccountConfig(otc_name);
      if (response.data.wallets !== undefined) {
        let old = response.data.wallets.old;
        let current = {
          address: Object.values(response.data.wallets.current).map((w) => {
            return w.address;
          })[0],
          created: this.formatDate(
            new Date(
              Object.keys(response.data.wallets.current).map((key) => {
                return key;
              })[0]
            )
          ),
        };
        oldAddress = Object.keys(old).map((key) => {
          return {
            address: old[key].address,
            created: this.formatDate(new Date(key)),
          };
        });
        oldAddress.push(current);
        this.setState({
          activeAddress: current.address,
        });
      }
      this.setState(
        {
          oldAddress: oldAddress,
        },
        () => console.log(this.state.oldAddress)
      );
    } catch (error) {
      console.log(error);
    }
  }
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true",
    };
    let data = date.toLocaleString(regi, options);
    if (regi === "es-ES") {
      data = data.split(" ");
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + " " + date;
      }
    } else {
      cad = data;
    }
    return cad;
  }
  render() {
    let t = this.state.translator;
    let menu;
    const { activeItem } = this.state;
    return (
      <span>
        {!this.state.showOTCAccounts && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {!this.state.showOTCAccountDetail && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Cuenta a consultar</label>
              <Select
                search
                placeholder="Seleccione una cuenta"
                options={this.state.OTCAccountsSelectOptions}
                onChange={this.pickOTCAccountToSearch.bind(this)}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.OTCAccountToSearch === ""}
              icon
              labelPosition="left"
              color="blue"
              style={{ marginTop: 23 }}
              type="submit"
              onClick={this.searchOTCAccount.bind(this)}
            >
              <Icon name="search" />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        {this.state.OTCAccountBalances.length > 0 && (
          //  <Menu pointing secondary>
          //<Menu.Item
          //     style={{ fontSize: 15 }}
          //     content={"Transacciones"}
          //     name="transactions"
          //     active={activeItem === "transactions"}
          //     onClick={this.handleItemClick.bind(this)}
          //   />
          //   {this.state.actionsUser.indexOf("master_account_send_bitcoins") !==
          //     -1 && (
          //     <Menu.Item
          //       style={{ fontSize: 15 }}
          //       content={"Enviar Bitcoins"}
          //       name="send_bitcoins"
          //       active={activeItem === "send_bitcoins"}
          //       onClick={this.handleItemClick.bind(this)}
          //     />
          //   )}
          //   {this.state.actionsUser.indexOf(
          //     "master_account_receive_bitcoins"
          //   ) !== -1 && (
          //     <Menu.Item
          //       style={{ fontSize: 15 }}
          //       content={"Recibir Bitcoins"}
          //       name="receive_bitcoins"
          //       active={activeItem === "receive_bitcoins"}
          //       onClick={this.handleItemClick.bind(this)}
          //     />
          //   )}

          //   <Menu.Item
          //     style={{ fontSize: 15 }}
          //     content={"Informe de Operaciones"}
          //     name="info_operations"
          //     active={activeItem === "info_operations"}
          //     onClick={this.handleItemClick.bind(this)}
          //   />
          // </Menu>
          <Menu pointing secondary>
            {this.state.actionsUser.indexOf("otc_account_transactions") !==
              -1 && (
              <Menu.Item
                style={{ fontSize: 15 }}
                content={"Transacciones"}
                name="transactions"
                active={activeItem === "transactions"}
                onClick={this.handleItemClick.bind(this)}
              />
            )}
            {this.state.actionsUser.indexOf("send_bitcoins") !== -1 && (
              <Menu.Item
                style={{ fontSize: 15 }}
                content={"Enviar Bitcoins"}
                name="send_bitcoins"
                active={activeItem === "send_bitcoins"}
                onClick={this.handleItemClick.bind(this)}
              />
            )}
            {this.state.actionsUser.indexOf("receive_bitcoins") !== -1 && (
              <Menu.Item
                style={{ fontSize: 15 }}
                content={"Recibir Bitcoins"}
                name="receive_bitcoins"
                active={activeItem === "receive_bitcoins"}
                onClick={this.handleItemClick.bind(this)}
              />
            )}
            {this.state.actionsUser.indexOf("consult_operations_report") !==
              -1 && (
              <Menu.Item
                style={{ fontSize: 15 }}
                content={"Informe de Operaciones"}
                name="info_operations"
                active={activeItem === "info_operations"}
                onClick={this.handleItemClick.bind(this)}
              />
            )}
          </Menu>
        )}
        {this.state.OTCAccountBalances.length > 0 && (
          <Segment basic>
            {activeItem === "transactions" && (
              <OTCAccounts
                OTCAccountCurrencies={this.state.OTCAccountCurrencies}
                OTCAccountMovements={this.state.OTCAccountMovements}
                pickDateFrom={this.pickDateFrom.bind(this)}
                pickDateTo={this.pickDateTo.bind(this)}
                OTCAccountBalance={this.state.OTCAccountBalance}
                OTCAccountBalances={this.state.OTCAccountBalances}
                getBalanceAcountCountOtc={this.getBalanceAcountCountOtc.bind(
                  this
                )}
              />
            )}
            {activeItem === "info_operations" && (
              <InfoOperations
                OTCAccountCurrencies={this.state.OTCAccountCurrencies}
                OTCAccountMovements={this.state.OTCAccountMovements}
                pickDateFrom={this.pickDateFrom.bind(this)}
                pickDateTo={this.pickDateTo.bind(this)}
                OTCAccountBalance={this.state.OTCAccountBalance}
                OTCAccountBalances={this.state.OTCAccountBalances}
                getBalanceAcountCountOtc={this.getBalanceAcountCountOtc.bind(
                  this
                )}
              />
            )}
            {activeItem === "send_bitcoins" && (
              <SendBitCoinsMasterAccount
                otcSelected={this.state.OTCAccountBalance}
                balanceOtcBtc={this.state.balanceOtcBtc}
                activeAddress={this.state.activeAddress}
                otcName={this.state.otcName}
              />
            )}
            {activeItem === "receive_bitcoins" && (
              <ReceiveBitCoinsToMasterAccount
                otcName={this.state.otcName}
                otcSelected={this.state.OTCAccountBalance}
                activeAddress={this.state.activeAddress}
                oldAddress={this.state.oldAddress}
                getConfigAccountOtc={this.getConfigAccountOtc.bind(this)}
              />
            )}
          </Segment>
        )}
      </span>
    );
  }
}
export default MenuOtcAccounts;
