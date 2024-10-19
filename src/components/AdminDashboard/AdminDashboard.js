import React, { Component } from "react";
import "./AdminDashboard.css";
import Dashboard from "react-dazzle";
import "react-dazzle/lib/style/style.css";
import {
  Container,
  Form,
  Select,
  Icon,
  Flag,
  Dimmer,
  Loader,
  List,
  Grid,
  Divider,
  Header,
  Button,
  Popup,
  Dropdown
} from "semantic-ui-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import moment from "moment";
import NumberFormat from "react-number-format";
import config from "../../services/config";
import ReactTable from "react-table";
import _ from "underscore";
import userService from "../../services/user";
import otc from "../../services/otc";
import marketModulator from "../../services/marketModulator";
import ISOCURRENCIES from "../../common/ISO4217";
import theter from '../../img/tether-seeklogo.svg';
class OTCBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otcBalance: null,
      otcMovements: [],
      allOTCMovements: null,
      OTCAccounts: [],
      OTCAccountsBalance: {},
      loadOTCBalance: true,
      colors: {
        names: {
          aqua: "#00ffff",
          azure: "#f0ffff",
          black: "#000000",
          blue: "#0000ff",
          brown: "#a52a2a",
          cyan: "#00ffff",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgrey: "#a9a9a9",
          darkgreen: "#006400",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkviolet: "#9400d3",
          fuchsia: "#ff00ff",
          gold: "#ffd700",
          green: "#008000",
          indigo: "#4b0082",
          khaki: "#f0e68c",
          lightblue: "#add8e6",
          lightcyan: "#e0ffff",
          lightgreen: "#90ee90",
          lightgrey: "#d3d3d3",
          lightpink: "#ffb6c1",
          lightyellow: "#ffffe0",
          lime: "#00ff00",
          magenta: "#ff00ff",
          maroon: "#800000",
          navy: "#000080",
          olive: "#808000",
          orange: "#ffa500",
          pink: "#ffc0cb",
          purple: "#800080",
          violet: "#800080",
          red: "#ff0000",
          silver: "#c0c0c0",
          yellow: "#ffff00"
        }
      }
    };
  }
  componentWillMount() {
    this.getOTCAccounts();
    //this.getOTCBalance();
  }

  randomColor = () => {
    var result;
    var count = 0;
    for (var prop in this.state.colors.names)
      if (Math.random() < 1 / ++count) result = prop;
    return result;
  };

  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };

  getOTCAccountsBalance = async () => {
    /*var url =
      URL_BASE_DBTC +
      "/masterAccountNew/getOTCMasterAccountBalances/" +
      userService.getUserName();
    axios
      .get(url)*/
    let url = otc.getOTCAccountsBalance(userService.getUserName());
    url
      .then(resp => {
        this.getOTCMovements(Object.keys(resp.data));
        this.setState({ OTCAccountsBalance: resp.data });
        var arrayBalances = [];
        Object.keys(resp.data).forEach(key => {
          var objectToPush = {};
          objectToPush.name = key;
          objectToPush.balance = resp.data[key][0].amount;
          // eslint-disable-next-line array-callback-return
          var object = this.state.OTCAccounts.filter(obj => {
            if (obj.key === key) {
              return obj;
            }
          });
          objectToPush.description = object[0].text;
          arrayBalances.push(objectToPush);
        });
        this.setState({ otcBalance: arrayBalances });
      })
      .catch(error => {});
  };

  getOTCAccounts = () => {
    let url = otc.getMasterAccount(userService.getUserName());
    url
      .then(resp => {
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
        this.setState(
          {
            OTCAccounts: OTCAccountsToSelect
          },
          () => this.getOTCAccountsBalance()
        );
      })
      .catch(error => {});
  };

  getOTCMovements = async otcAccounts => {
    var axiosArray = [];
    for (var x = 0; x < otcAccounts.length; x++) {
      var body = {
        masterAccountName: otcAccounts[x],
        initTimestamp: "",
        endTimestamp: "",
        balanceOperationType: null
      };

      let newPromise = marketModulator.getBalanceMovementsMaster(body);
      axiosArray.push(newPromise);
    }
    let response = await axios.all(axiosArray);
    var listMovements = [];
    for (var i = 0; i < response.length; i++) {
      var totalAmount = 0;
      var auxTotalAmount = 0;
      // eslint-disable-next-line no-loop-func
      Object.entries(response[i].data).forEach(([dateKey, movementInfo]) => {
        var movementToPush = {};
        movementToPush.date = moment(dateKey.split("__")[0]).valueOf();
        auxTotalAmount = totalAmount;
        Object.entries(movementInfo).forEach(([dateKey, movementInfo]) => {
          if (dateKey === "addedAmount") {
            totalAmount = totalAmount + movementInfo.amount;
            movementToPush[otcAccounts[i]] = totalAmount;
          } else if (dateKey === "substractedAmount") {
            totalAmount = totalAmount - movementInfo.amount;
            movementToPush[otcAccounts[i]] = totalAmount;
          }
          if (dateKey === "balanceOperationStatus") {
            movementToPush.status = movementInfo;
          }
        });
        if (movementToPush.status === "OK") {
          listMovements.push(movementToPush);
        } else {
          totalAmount = auxTotalAmount;
        }
      });
    }

    this.setState({
      allOTCMovements: listMovements,
      loadOTCBalance: false
    });
  };
  render() {
    return (
      <div style={{ height: 277 }}>
        <Container textAlign="right">
          {this.state.loadOTCBalance && (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          )}
          <Form>
            <Form.Field>
              <label>Saldo actual</label>
              {this.state.otcBalance !== null &&
                this.state.otcBalance.map(balance => (
                  <div key={balance.name}>
                    <b>{balance.description}: </b>{" "}
                    <NumberFormat
                      value={this.floorDecimals(balance.balance, 8)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />{" "}
                    BTC
                  </div>
                ))}
            </Form.Field>
          </Form>
        </Container>
        <Divider fitted hidden />
        {this.state.allOTCMovements !== null && (
          <ResponsiveContainer>
            <LineChart
              data={this.state.allOTCMovements}
              margin={{ top: 15, right: 30, left: -15, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                tickFormatter={(value, name, props) =>
                  moment(value).format("DD/MM/YYYY HH:mm:ss")
                }
                type="number"
                domain={["dataMin", "dataMax"]}
                dataKey="date"
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value, name, props) =>
                  moment(value).format("DD/MM/YYYY HH:mm:ss")
                }
                formatter={(value, name, props) => (
                  <NumberFormat
                    value={this.floorDecimals(value, 8)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                )}
              />
              <Legend />
              {this.state.OTCAccounts.map(OTCAccount => {
                return (
                  <Line
                    key={OTCAccount.value.split("_currencies_")[0]}
                    name={OTCAccount.text}
                    dot={false}
                    type="monotone"
                    dataKey={OTCAccount.value.split("_currencies_")[0]}
                    stroke={this.randomColor()}
                    //style={{marginTop:-5}}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
}

class ActualAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offersTable: [],
      showOffersTable: false,
      details: []
    };
  }
  getOfferDetail = async offerArray => {
    let paymentIdArray = offerArray.filter(obj =>
      Object.keys(obj).includes("paymentMethod")
    );
    let listDetails = [];
    if (paymentIdArray.length === 0) {
      this.setState({ showOffersTable: true });
    }
    for (let i = 0; i < paymentIdArray.length; i++) {
      let toPush = await otc
        .getDollarBTCPayment(
          paymentIdArray[i].currency,
          paymentIdArray[i].paymentMethod
        )
        .then(res => {
          if (!_.isEmpty(res.data)) {
            let detail = "",
              id = "";
            Object.entries(res.data).forEach(([key, value]) => {
              if (
                key !== "id" &&
                key !== "acceptIn" &&
                key !== "acceptOut" &&
                key !== "active" &&
                key !== "joinField" &&
                key !== "types"
              ) {
                if (detail === "") {
                  detail = detail + value;
                } else {
                  detail = detail + " - " + value;
                }
              } else if (key === "id") {
                id = value;
              }
            });
            return {
              id: id,
              detail: detail
            };
          } else {
            return {};
          }
        })
        .catch(error => {
          console.log(error);
        });
      if (!_.isEmpty(toPush)) {
        listDetails.push(toPush);
      }
      if (i + 1 === paymentIdArray.length) {
        this.setState({ details: listDetails }, () => {
          this.setState({ showOffersTable: true });
        });
      }
    }
  };
  makeDataTable = offers => {
    let tableToShow = [];
    Object.entries(offers).forEach(([currency, operationType]) => {
      Object.entries(operationType).forEach(([operationName, offerInfo]) => {
        let offer = {};
        let offerType = operationName.split("__")[0];
        offer.paymentMethod = operationName.split("__")[1];
        if (operationName.split("__")[2] === "TRANSFER_INTERNATIONAL_BANK") {
          offer.paymentType = "Transferencia internacional (Swift o Aba)";
        } else if (operationName.split("__")[2] === "CASH_DEPOSIT") {
          offer.paymentType = "Depósito en efectivo";
        } else if (
          operationName.split("__")[2] === "TRANSFER_WITH_SPECIFIC_BANK"
        ) {
          offer.paymentType = "Transferencia desde un banco específico";
        } else if (operationName.split("__")[2] === "TRANSFER_NATIONAL_BANK") {
          offer.paymentType = "Transferencia desde un tercer banco";
        } else if (
          operationName.split("__")[2] === "TRANSFER_TO_CRYPTO_WALLET"
        ) {
          offer.paymentType = "Transferencia desde una crypto wallet";
        } else if (operationName.split("__")[2] === "WIRE_TRANSFER") {
          offer.paymentType = "Wire (Transferencia cablegráfica)";
        } else if (operationName.split("__")[2] === "CHECK_DEPOSIT") {
          offer.paymentType = "Depósito en cheque";
        } else if (operationName.split("__")[2] === "RETAIL") {
          offer.paymentType = "Retail (Minorista)";
        } else if (operationName.split("__")[2] === "MAIN") {
          offer.paymentType = "Main (Principal)";
        } else if (operationName.split("__")[2] === "CREDIT_CARD") {
          offer.paymentType = "Tarjeta de crédito";
        } else if (operationName.split("__")[2] === "PERSONAL_CHECK_DEPOSIT") {
          offer.paymentType = "Cheque personal";
        } else if (operationName.split("__")[2] === "CASHIER_CHECK_DEPOSIT") {
          offer.paymentType = "Cheque de gerencia";
        } else if (operationName.split("__")[2] === "MONEY_ORDER") {
          offer.paymentType = "Orden de dinero";
        } else {
          offer.paymentType = operationName.split("__")[2];
        }
        let countryCoin = currency.split("_");
        let countryPrefix = countryCoin.length > 1 ? countryCoin[0] : "";
        let symbol = countryCoin.length > 1 ? countryCoin[1] : countryCoin[0];
        let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
          if (countryCoin.length > 1)
            return c.flag === countryPrefix.toLowerCase();
          else return c.key === symbol;
        })[0];
        if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {

          offer.flag = currencyCurrent.flag;

        } else if(symbol === "ETH") {

          offer.flag = "ethereum";

        };
        offer.currency = symbol;
        if (offerType === "ASK") {
          offer.operationType = "COMPRA - " + offer.paymentType;
        } else if (offerType === "BID") {
          offer.operationType = "VENTA - " + offer.paymentType;
        }
        Object.entries(offerInfo).forEach(([infoLabel, infoData]) => {
          if (infoLabel === "price") {
            offer.price = infoData;
          } else if (infoLabel === "minPerOperationAmount") {
            offer.minPerOperationAmount = infoData;
          } else if (infoLabel === "maxPerOperationAmount") {
            offer.maxPerOperationAmount = infoData;
          } else if (infoLabel === "totalAmount") {
            offer.totalAmount = infoData;
          } else if (infoLabel === "timestamp") {
            offer.date = this.formatDate(new Date(infoData));
          }
        });
        tableToShow.push(offer);
      });
    });
    this.getOfferDetail(tableToShow);
    this.setState({ offersTable: tableToShow });
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState(
      {
        showOffersTable: nextProps.showTable
      },
      () => {
        this.makeDataTable(nextProps.dataTable);
      }
    );
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true"
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
    const adTableHeaders = [
      {
        Header: "Moneda",
        accessor: "currency",
        Cell: row => {
         if (row.value !== 'ETH' && row.value !== 'USDT') {
            return (
              <div>
                <Flag name={row.original.flag} /> {row.value}
              </div>
            );
           } else if(row.value === 'ETH'){
            return (
              <div>
                <Icon name={row.original.flag} /> {row.value}
              </div>
            );
            } else {
              return(<div>
                <img style={{paddingTop: 5}} width={20} height={20} src={theter} /> {row.value}</div>)
            }
        },
        width: 70
      },
      {
        Header: "Medio de pago",
        accessor: "paymentMethod",
        width: 80,
        Cell: row => {
          if (this.state.details.length > 0) {
            var text = "MoneyClick";
            if (row.value === "MONEYCLICK") {
              return (
                <span className="fake-link" title={text}>
                  {text}
                </span>
              );
            }
            for (var i = 0; i < this.state.details.length; i++) {
              if (this.state.details[i].id !== undefined) {
                if (row.value === this.state.details[i].id) {
                  var text = this.state.details[i].detail;
                  return (
                    <span className="fake-link" title={text}>
                      {row.value.slice(-4)}
                    </span>
                  );
                }
                if (i + 1 === this.state.details.length) {
                  return row.value.slice(-4);
                }
              } else {
                return row.value.slice(-4);
              }
            }
          } else {
            return row.value.slice(-4);
          }
        }
      },
      {
        Header: "Tipo de operación",
        accessor: "operationType",
        width: 255
      },
      {
        Header: "Precio",
        accessor: "price",
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right"
            }
          };
        },
        Cell: row => {
          return (
            <NumberFormat
              value={this.floorDecimals(row.value, 2)}
              decimalScale={2}
              fixedDecimalScale={true}
              displayType={"text"}
              thousandSeparator={true}
            />
          );
        }
      }
    ];
    return (
      <div>
        {/* {!this.state.showOffersTable && (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        )} */}
        <ReactTable
        loading={!this.state.showOffersTable}
          defaultSorted={[
            {
              id: "date",
              desc: true
            }
          ]}
          style={{ minHeight: 277 }}
          showPageSizeOptions={false}
          className="transactionTable"
          data={this.state.offersTable}
          columns={adTableHeaders}
          defaultPageSize={5}
          previousText="Anterior"
          nextText="Siguiente"
          loadingText="Cargando..."
          noDataText="No hay transacciones"
          pageText="Página"
          ofText="de"
          rowsText="filas"
          pageJumpText="ir a la página"
          rowsSelectorText="filas por página"
          minRow={5}
        />
      </div>
    );
  }
}

class PaymentTypesBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyToSearch: "",
      paymentMethodsAmount: null,
      listCurrencies: [],
      paymentMethodsToSearch: [],
      selectDefinitivePaymentMethods: [],
      showSearch: false,
      totalBalanceToShow: 0,
      keySelectPayment: Math.random(),
      showResult: true,
      listMovementsTable: null,
      colors: {
        names: {
          aqua: "#00ffff",
          /*azure: "#f0ffff",
          beige: "#f5f5dc",*/
          black: "#000000",
          blue: "#0000ff",
          brown: "#a52a2a",
          cyan: "#00ffff",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgrey: "#a9a9a9",
          darkgreen: "#006400",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkviolet: "#9400d3",
          fuchsia: "#ff00ff",
          gold: "#ffd700",
          green: "#008000",
          indigo: "#4b0082",
          /*khaki: "#f0e68c",
          lightblue: "#add8e6",
          lightcyan: "#e0ffff",
          lightgreen: "#90ee90",
          lightgrey: "#d3d3d3",
          lightpink: "#ffb6c1",
          lightyellow: "#ffffe0",*/
          lime: "#00ff00",
          magenta: "#ff00ff",
          maroon: "#800000",
          navy: "#000080",
          olive: "#808000",
          orange: "#ffa500",
          pink: "#ffc0cb",
          purple: "#800080",
          violet: "#800080",
          red: "#ff0000",
          /*silver: "#c0c0c0",
          white: "#ffffff",*/
          yellow: "#ffff00"
        }
      }
    };
  }
  componentWillMount() {
    this.getCurrencyPaymentMethods();
    this.getInfoPaymentMethods();
  }

  randomColor = () => {
    var result;
    var count = 0;
    for (var prop in this.state.colors.names)
      if (Math.random() < 1 / ++count) result = prop;
    return result;
  };

  getCurrencyPaymentMethods = () => {
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then(resp => {
        let currenciesPaymentMethod = [];
        Object.entries(resp.data).forEach(([key, value]) => {
          let currencyToAdd = {};
          currencyToAdd.key = key;
          currencyToAdd.value = key;
          let countryCoin = key.split("_");
          currencyToAdd.text = countryCoin.length > 1 ? countryCoin[1] : key;
          let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
          if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAdd.flag = currencyCurrent.flag;
          } else if(key === "ETH") {
					  currencyToAdd.icon = "ethereum";
          } else if(key === "USDT") {
            currencyToAdd.image =  { avatar: true, size: 'mini',src: theter };
          };
        
          currenciesPaymentMethod.push(currencyToAdd);
        });
        this.setState({
          listCurrencies: currenciesPaymentMethod,
          showSearch: true
        });
      })
      .catch(error => {
        //console.log(error);
      });
  };
  getInfoPaymentMethods(currency) {
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then(resp => {
        let curren = currency;
        var paymentMethod = [];
        Object.entries(resp.data).forEach(([key, value]) => {
          for (var i = 0; i < value.length; i++) {
            var paymentToAdd = {};
            paymentToAdd.currency = key;
            paymentToAdd.key = value[i].id;
            paymentToAdd.value = value[i].id;
            if (value[i].type === "TRANSFER_TO_CRYPTO_WALLET") {
              paymentToAdd.text =
                value[i].id.slice(-4) + " - " + value[i].walletAddress;
            } else if (value[i].type === "ZELLE") {
              paymentToAdd.text =
                value[i].id.slice(-4) +
                " - " +
                value[i].email +
                " - " +
                value[i].userName;
            } else {
              paymentToAdd.text =
                value[i].id.slice(-4) +
                " - " +
                value[i].bank +
                this.validateData(value[i].accountNumber) +
                this.validateData(value[i].accountNumber) +
                this.validateData(value[i].accountHolderId) +
                this.validateData(value[i].accountHolderName);
            }
            paymentMethod.push(paymentToAdd);
          }
        });
        this.setState({ selectPaymentMethods: paymentMethod }, () => {
          //console.log(curren);
          this.setDataInSelect(curren);
        });
      })
      .catch(error => {
        //console.log(error);
      });
  }
  validateData(value) {
    if (value !== undefined) {
      return " - " + value;
    } else {
      return " ";
    }
  }
  setDataInSelect(currency) {
    var paymentMethods = this.state.selectPaymentMethods.slice();
    var definitiveMethods = [];
    for (var i = 0; i < paymentMethods.length; i++) {
      if (paymentMethods[i].currency === currency) {
        definitiveMethods.push(paymentMethods[i]);
      }
    }
    var definitiveMethodsUniqueKey = _.uniq(definitiveMethods, "key");
    this.setState({
      currencyToSearch: currency,
      selectDefinitivePaymentMethods: definitiveMethodsUniqueKey,
      paymentMethodsToSearch: [],
      keySelectPayment: Math.random()
    });
  }
  pickCurrency = (e, data) => {
    this.setState(
      {
        paymentMethodsAmount: null,
        paymentMethodsToSearch: [],
        selectDefinitivePaymentMethods: []
      },
      () => {
        this.getInfoPaymentMethods(data.value);
      }
    );
  };
  pickPaymentMethods = (e, data) => {
    this.setState({
      paymentMethodsToSearch: data.value,
      paymentMethodsAmount: null
    });
  };
  getPaymentMethodsBalance = () => {
    this.setState({ showResult: false });
    //var url = URL_BASE_DBTC + "/otc/getDollarBTCPaymentBalance";
    var body = {
      currency: this.state.currencyToSearch,
      paymentIds: this.state.paymentMethodsToSearch
    };

    let url = otc.getDollarBTCPaymentBalance(body);
    url
      .then(res => {
        var paymentMethodShow = [];
        var totalBalance = 0;
        Object.entries(res.data).forEach(([key, value]) => {
          var paymentMetToAdd = {};
          paymentMetToAdd.id = key;
          paymentMetToAdd.amounts = [];
          var amountToPush = {};
          if (value.length > 0) {
            for (var i = 0; i < value.length; i++) {
              amountToPush = {};
              amountToPush.currency = value[i].currency;
              amountToPush.amount = value[i].amount;
              paymentMetToAdd.amounts.push(amountToPush);
            }
          } else {
            amountToPush.amount = 0;
            paymentMetToAdd.amounts.push(amountToPush);
          }
          paymentMethodShow.push(paymentMetToAdd);
        });
        for (var j = 0; j < paymentMethodShow.length; j++) {
          for (var y = 0; y < paymentMethodShow[j].amounts.length; y++)
            totalBalance =
              totalBalance + paymentMethodShow[j].amounts[y].amount;
        }
        this.getPaymentMethodsMovements();
        this.setState({
          paymentMethodsAmount: paymentMethodShow,
          totalBalanceToShow: totalBalance
        });
      })
      .catch(error => {
        //console.log(error);
      });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  getPaymentMethodsMovements = () => {
    //var url = URL_BASE_DBTC + "/otc/getDollarBTCPaymentBalanceMovements";
    var body = {
      currency: this.state.currencyToSearch,
      initTimestamp: "",
      endTimestamp: "",
      balanceOperationType: null,
      paymentIds: this.state.paymentMethodsToSearch
    };
    /*axios
      .post(url, body)*/
    let url = otc.getDollarBTCPaymentBalanceMovements(body);
    url
      .then(res => {
        var listMovements = [];
        var detailInfo = {};
        Object.entries(res.data).forEach(([paymentId, movements]) => {
          var totalAmount = 0;
          var movementToAdd = {};
          movementToAdd.paymentTypeId = paymentId.slice(-4);
          Object.entries(movements).forEach(([keyData, movementInfo]) => {
            movementToAdd.date = moment(keyData.split("__")[0]).valueOf();
            detailInfo = {};
            var statusFail = false;
            Object.entries(movementInfo).forEach(([infoName, infoDetail]) => {
              if (infoName === "addedAmount") {
                detailInfo.newAmount = infoDetail.amount;
                detailInfo.type = "add";
                totalAmount = totalAmount + infoDetail.amount;
                detailInfo[paymentId.slice(-4)] = totalAmount;
              } else if (infoName === "substractedAmount") {
                detailInfo.newAmount = infoDetail.amount;
                detailInfo.type = "remove";
                totalAmount = totalAmount - infoDetail.amount;
                detailInfo[paymentId.slice(-4)] = totalAmount;
              } else if (infoName === "balanceOperationStatus") {
                if (infoDetail === "FAIL") {
                  statusFail = true;
                  if (detailInfo.type === "add") {
                    totalAmount = totalAmount - detailInfo.newAmount;
                    detailInfo[paymentId.slice(-4)] = totalAmount;
                  } else {
                    totalAmount = totalAmount + detailInfo.newAmount;
                    detailInfo[paymentId.slice(-4)] = totalAmount;
                  }
                }
              }
            });
            if (!statusFail) {
              let merged = { ...movementToAdd, ...detailInfo };
              listMovements.push(merged);
            }
          });
        });
        this.setState({
          listMovementsTable: listMovements,
          showResult: true
        });
      })
      .catch(error => {
        //console.log(error);
      });
  };
  render() {
    return (
      <div>
        {!this.state.showSearch && (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        )}
        {!this.state.showResult && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Moneda a consultar:</label>
              <Dropdown
                fluid
                search
                placeholder="Seleccione una moneda"
                options={this.state.listCurrencies}
                onChange={this.pickCurrency}
              />
            </Form.Field>
            {this.state.currencyToSearch !== "" && (
              <Form.Field width={12} key={this.state.keySelectPayment}>
                <label>Medio(s) de pago a consultar:</label>
                <Select
                  search
                  multiple
                  placeholder="Seleccione medios"
                  options={this.state.selectDefinitivePaymentMethods}
                  onChange={this.pickPaymentMethods}
                />
              </Form.Field>
            )}
            <Form.Button
              disabled={
                this.state.currencyToSearch === "" ||
                this.state.paymentMethodsToSearch.length <= 0
              }
              icon
              labelPosition="left"
              color="blue"
              style={{ marginTop: 23 }}
              type="submit"
              onClick={this.getPaymentMethodsBalance}
            >
              <Icon name="search" />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        {this.state.paymentMethodsAmount !== null && (
          <div>
            <Divider />
            <Grid>
              <Grid.Row columns={2}>
                <Divider section />
                <Grid.Column width="8">
                  <List as="ol">
                    <List.Item>
                      <List.Header>Balance en los medios de pago:</List.Header>
                      <List.Item as="ol">
                        {this.state.paymentMethodsAmount.map(
                          paymentMethodAmount => (
                            <List.Item
                              key={paymentMethodAmount.id}
                              as="li"
                              value="*"
                            >
                              <b>{paymentMethodAmount.id.slice(-4)}</b>
                              <List.Item as="ol">
                                {paymentMethodAmount.amounts.map(
                                  (amount, i) => (
                                    <List.Item key={i} as="li" value="-">
                                      {amount.currency !== undefined ? (
                                        <div>
                                          <label>
                                            <b>{amount.currency}: </b>
                                          </label>{" "}
                                          <NumberFormat
                                            value={this.floorDecimals(
                                              amount.amount,
                                              4
                                            )}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                          />
                                        </div>
                                      ) : (
                                        amount.amount
                                      )}
                                    </List.Item>
                                  )
                                )}
                              </List.Item>
                            </List.Item>
                          )
                        )}
                      </List.Item>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Form>
                    <Form.Field>
                      <Header as="h4">
                        Total del balance de las cuentas consultadas (
                        {this.state.currencyToSearch}):{" "}
                        <NumberFormat
                          value={this.floorDecimals(
                            this.state.totalBalanceToShow,
                            4
                          )}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </Header>
                    </Form.Field>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {this.state.listMovementsTable !== null && (
              <Container style={{ height: 300 }}>
                <Divider hidden />
                <ResponsiveContainer>
                  <LineChart
                    data={this.state.listMovementsTable}
                    margin={{ top: 5, right: 30, left: 30, bottom: 45 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      tickFormatter={(value, name, props) =>
                        moment(value).format("DD/MM/YYYY HH:mm:ss")
                      }
                      type="number"
                      domain={["auto", "auto"]}
                      dataKey="date"
                    />
                    <YAxis
                      tickFormatter={(value, name, props) =>
                        value.toLocaleString("en-US", {
                          maximumFractionDigits: 4
                        })
                      }
                    />
                    <Tooltip
                      labelFormatter={(value, name, props) =>
                        moment(value).format("DD/MM/YYYY HH:mm:ss")
                      }
                      formatter={(value, name, props) => (
                        <NumberFormat
                          value={this.floorDecimals(value, 4)}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      )}
                    />
                    <Legend />
                    {this.state.paymentMethodsToSearch.map(id => {
                      return (
                        <Line
                          key={id.slice(-4)}
                          name={id.slice(-4) + " balance"}
                          dot={false}
                          type="monotone"
                          dataKey={id.slice(-4)}
                          stroke={this.randomColor()}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </Container>
            )}
          </div>
        )}
      </div>
    );
  }
}
const CustomFrame = ({ title, children }) => {
  return (
    <div className="defaultWidgetFrame">
      <div className="defaultWidgetFrameHeader">
        <span className="title">{title}</span>
        {children.props.text === "offers" && (
          <Popup
            content="Refrescar"
            trigger={
              <Button
                onClick={children.props.onRefresh}
                circular
                size="mini"
                icon="redo alternate"
                floated="right"
                style={{ display: "block" }}
                compact
                basic
              />
            }
          />
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.loadOffers = this.loadOffers.bind(this);
    this.state = {
      tableInfo: {},
      widgets: {
        OTCBalance: {
          type: OTCBalance,
          title: "Balance OTC",
          props: {
            text: "balance"
          }
        },
        ActualAd: {
          type: ActualAd,
          title: "Ofertas OTC",
          props: {
            text: "offers",
            onRefresh: this.loadOffers,
            dataTable: {},
            showTable: false
          }
        },
        PaymentTypesBalance: {
          type: PaymentTypesBalance,
          title: "Balance medios de pago",
          props: {
            text: "balancePayments"
          }
        }
      },
      layout: {
        rows: [
          {
            columns: [
              {
                className: "column",
                widgets: [{ key: "OTCBalance" }]
              },
              {
                className: "column",
                widgets: [{ key: "ActualAd" }]
              }
            ]
          },
          {
            columns: [
              {
                className: "column",
                widgets: [{ key: "PaymentTypesBalance" }]
              }
            ]
          }
        ]
      }
    };
  }
  getOffers() {
    this.setState({
      loadingTable: false
    });
    /*let url =
      URL_BASE_DBTC +
      config.urlDollar.getOffersAdmin +
      userService.getUserName();
    axios
      .get(url)*/
    let url = otc.getOffersAdmin(userService.getUserName());
    url
      .then(resp => {
        this.setState(
          {
            tableInfo: resp.data
          },
          () => {
            let aux = this.state.widgets;
            aux.ActualAd.props.dataTable = this.state.tableInfo;
            this.setState({
              widgets: aux
            });
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  }
  loadOffers() {
    this.getOffers();
  }
  componentWillMount() {
    this.getOffers();
  }

  render() {
    return (
      <Grid stretched>
        <Divider section hidden />
        <Dashboard
          rowClass="ui equal width grid dashboardRow"
          widgets={this.state.widgets}
          layout={this.state.layout}
          frameComponent={CustomFrame}
        />
      </Grid>
    );
  }
}
