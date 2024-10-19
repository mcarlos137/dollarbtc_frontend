import React, { Component } from "react";
import ISOCURRENCIES from "../../../../../common/ISO4217";
import "../../../Admin.css";
import {
  Container,
  Grid,
  Form,
  Divider,
  Icon,
  Header,
  Loader,
  Dimmer,
  Popup,
  Select,
  List,
  Label,
  Input,
  Dropdown,
} from "semantic-ui-react";
import ReactTable from "react-table";
import moment from "moment";
import NumberFormat from "react-number-format";
import userService from "../../../../../services/user";
import otc from "../../../../../services/otc";
import _ from "underscore";
import theter from '../../../../../img/tether-seeklogo.svg';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

class BalancePaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: "",
      dateTo: "",
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
      listMovementsChart: null,
      colors: {
        names: {
          aqua: "#00ffff",
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
          yellow: "#ffff00",
        },
      },
    };
    this.pickDateFrom = this.pickDateFrom.bind(this);
    this.pickDateTo = this.pickDateTo.bind(this);
  }
  componentDidMount() {
    this.getCurrencyPaymentMethods();
    this.getInfoPaymentMethods();
  }

  pickDateFrom(e, date) {
    this.setState({ dateFrom: e.target.value });
  }

  pickDateTo(e, date1) {
    this.setState({ dateTo: e.target.value });
  }

  getCurrencyPaymentMethods = () => {
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then((resp) => {
        let currenciesPaymentMethod = [];
        Object.entries(resp.data).forEach(([key, value]) => {
          let currencyToAdd = {};
          currencyToAdd.key = key;
          currencyToAdd.value = key;
          let countryCoin = key.split("_");
          currencyToAdd.text = countryCoin.length > 1 ? countryCoin[1] : key;
          let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
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
          showSearch: true,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  validateData(value) {
    if (value !== undefined) {
      return " - " + value;
    } else {
      return " ";
    }
  }
  getInfoPaymentMethods = () => {
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then((resp) => {
        var paymentMethod = [];
        Object.entries(resp.data).forEach(([key, value]) => {
          for (var i = 0; i < value.length; i++) {
            var paymentToAdd = {};
            paymentToAdd.currency = key;
            paymentToAdd.key = value[i].id;
            paymentToAdd.value = value[i].id;
            var spanishType = "";
            if (value[i].type === "TRANSFER_INTERNATIONAL_BANK") {
              spanishType = "Transferencia internacional (Swift o Aba)";
            } else if (value[i].type === "CASH_DEPOSIT") {
              spanishType = "Depósito en efectivo";
            } else if (value[i].type === "TRANSFER_WITH_SPECIFIC_BANK") {
              spanishType = "Transferencia desde un banco específico";
            } else if (value[i].type === "TRANSFER_NATIONAL_BANK") {
              spanishType = "Transferencia desde un tercer banco";
            } else if (value[i].type === "TRANSFER_TO_CRYPTO_WALLET") {
              spanishType = "Transferencia desde una crypto wallet";
            } else if (value[i].type === "WIRE_TRANSFER") {
              spanishType = "Wire (Transferencia cablegráfica)";
            } else if (value[i].type === "CHECK_DEPOSIT") {
              spanishType = "Depósito en cheque";
            } else if (value[i].type === "CASHIER_CHECK_DEPOSIT") {
              spanishType = "Depósito en cheque de caja";
            } else {
              spanishType = value[i].type;
            }
            if (value[i].type === "TRANSFER_TO_CRYPTO_WALLET") {
              paymentToAdd.text =
                value[i].id.slice(-4) + " - " + value[i].walletAddress;
            } else if (value[i].type === "ZELLE") {
              paymentToAdd.text =
                value[i].id.slice(-4) +
                " - " +
                value[i].email +
                this.validateData(value[i].userName);
            } else {
              paymentToAdd.text =
                value[i].id.slice(-4) +
                this.validateData(value[i].bank) +
                this.validateData(value[i].accountNumber) +
                this.validateData(value[i].accountHolderId) +
                this.validateData(value[i].accountHolderName) +
                " - " +
                spanishType;
            }
            paymentMethod.push(paymentToAdd);
          }
        });
        this.setState({ selectPaymentMethods: paymentMethod });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  pickCurrency = (e, data) => {
    this.getInfoPaymentMethods();
    var paymentMethods = this.state.selectPaymentMethods.slice();
    var definitiveMethods = [];
    for (var i = 0; i < paymentMethods.length; i++) {
      if (paymentMethods[i].currency === data.value) {
        definitiveMethods.push(paymentMethods[i]);
      }
    }
    var definitiveMethodsUniqueKey = _.uniq(definitiveMethods, "key");
    this.setState({
      currencyToSearch: data.value,
      selectDefinitivePaymentMethods: definitiveMethodsUniqueKey,
      paymentMethodsToSearch: [],
      keySelectPayment: Math.random(),
      listMovementsTable: null,
      listMovementsChart: null,
      paymentMethodsAmount: null,
    });
  };
  pickPaymentMethods = (e, data) => {
    this.setState({ paymentMethodsToSearch: data.value });
  };
  getPaymentMethodsBalance = () => {
    let dateFrom,dateTo;
    if(this.state.dateFrom===""){
      dateFrom="";
    }else{
      dateFrom=new Date(this.state.dateFrom).toISOString();
    }
    if(this.state.dateTo===""){
      dateTo="";
    }else{
      dateTo=new Date(this.state.dateTo).toISOString();
    }
    this.setState({ showResult: false });
    var body = {
      userName: userService.getUserName(),
      currency: this.state.currencyToSearch,
      paymentIds: this.state.paymentMethodsToSearch,
      initTimestamp: dateFrom,
      finalTimestamp: dateTo
    };
    let url = otc.getDollarBTCPaymentBalance(body);
    url
      .then((res) => {
        this.setState({
          showResult: true,
        });
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
          totalBalanceToShow: totalBalance,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  getPaymentMethodsMovements = () => {
    var body = {
      currency: this.state.currencyToSearch,
      initTimestamp: "",
      endTimestamp: "",
      balanceOperationType: null,
      paymentIds: this.state.paymentMethodsToSearch,
    };

    let url = otc.getDollarBTCPaymentBalanceMovements(body);
    url
      .then((res) => {
        var listMovements = [];
        var detailInfo = {};
        var listMovementsToChart = [];
        let detailInfoChart = {};
        let date1 = new Date(this.state.dateFrom);
        let date2 = new Date(this.state.dateTo);

        if (this.state.dateFrom === "" && this.state.dateTo === "") {
          Object.entries(res.data).forEach(([paymentId, movements]) => {
            var movementToAdd = {};
            var movementToChart = {};
            var totalAmount = 0;
            movementToAdd.paymentTypeId = paymentId;
            movementToChart.paymentTypeId = paymentId.slice(-4);

            Object.entries(movements).forEach(([keyData, movementInfo]) => {
              movementToAdd.date = moment(keyData.split("__")[0]).format(
                "YYYY/MM/DD HH:mm:ss"
              );
              movementToChart.date = moment(keyData.split("__")[0]).valueOf();
              detailInfoChart = {};
              var statusFail = false;

              Object.entries(movementInfo).forEach(([infoName, infoDetail]) => {
                if (infoName === "balanceOperationStatus") {
                  detailInfo.status = infoDetail;

                  //to chart
                  if (infoDetail === "FAIL") {
                    statusFail = true;
                    if (detailInfoChart.type === "add") {
                      totalAmount = totalAmount - detailInfoChart.newAmount;
                      detailInfoChart[paymentId.slice(-4)] = totalAmount;
                    } else {
                      totalAmount = totalAmount + detailInfoChart.newAmount;
                      detailInfoChart[paymentId.slice(-4)] = totalAmount;
                    }
                  }
                } else if (infoName === "balanceOperationType") {
                  detailInfo.operationType = infoDetail;
                } else if (infoName === "addedAmount") {
                  detailInfo.type = "add";
                  detailInfo.amount = infoDetail.amount;

                  //to chart
                  detailInfoChart.newAmount = infoDetail.amount;
                  detailInfoChart.type = "add";
                  totalAmount = totalAmount + infoDetail.amount;
                  detailInfoChart[paymentId.slice(-4)] = totalAmount;
                } else if (infoName === "substractedAmount") {
                  detailInfo.type = "remove";
                  detailInfo.amount = infoDetail.amount;

                  //to chart
                  detailInfoChart.newAmount = infoDetail.amount;
                  detailInfoChart.type = "remove";
                  totalAmount = totalAmount - infoDetail.amount;
                  detailInfoChart[paymentId.slice(-4)] = totalAmount;
                } else if (infoName === "additionalInfo") {
                  if (infoDetail.startsWith("OTC operation id")) {
                    var OTCid =
                      "ID de la operación OTC " + infoDetail.slice(-4);
                    detailInfo.additionalInfo = OTCid;
                  } else {
                    detailInfo.additionalInfo = infoDetail;
                  }
                }
              });
              let merged = { ...movementToAdd, ...detailInfo };
              listMovements.push(merged);
              if (!statusFail) {
                let merged2 = { ...movementToChart, ...detailInfoChart };
                listMovementsToChart.push(merged2);
              }
            });
          });
          this.setState({
            listMovementsTable: listMovements,
            listMovementsChart: listMovementsToChart,
            showResult: true,
          });
        } else {
          if (this.state.dateFrom === "") {
            Object.entries(res.data).forEach(([paymentId, movements]) => {
              var movementToAdd = {};
              var movementToChart = {};
              var totalAmount = 0;
              movementToAdd.paymentTypeId = paymentId;
              movementToChart.paymentTypeId = paymentId.slice(-4);

              Object.entries(movements).forEach(([keyData, movementInfo]) => {
                let n = new Date(keyData.split("__")[0]);

                if (n.getTime() <= date2.getTime()) {
                  movementToAdd.date = moment(keyData.split("__")[0]).format(
                    "YYYY/MM/DD HH:mm:ss"
                  );
                  movementToChart.date = moment(
                    keyData.split("__")[0]
                  ).valueOf();
                  detailInfoChart = {};
                  var statusFail = false;

                  Object.entries(movementInfo).forEach(
                    ([infoName, infoDetail]) => {
                      if (infoName === "balanceOperationStatus") {
                        detailInfo.status = infoDetail;

                        //to chart
                        if (infoDetail === "FAIL") {
                          statusFail = true;
                          if (detailInfoChart.type === "add") {
                            totalAmount =
                              totalAmount - detailInfoChart.newAmount;
                            detailInfoChart[paymentId.slice(-4)] = totalAmount;
                          } else {
                            totalAmount =
                              totalAmount + detailInfoChart.newAmount;
                            detailInfoChart[paymentId.slice(-4)] = totalAmount;
                          }
                        }
                      } else if (infoName === "balanceOperationType") {
                        detailInfo.operationType = infoDetail;
                      } else if (infoName === "addedAmount") {
                        detailInfo.type = "add";
                        detailInfo.amount = infoDetail.amount;

                        //to chart
                        detailInfoChart.newAmount = infoDetail.amount;
                        detailInfoChart.type = "add";
                        totalAmount = totalAmount + infoDetail.amount;
                        detailInfoChart[paymentId.slice(-4)] = totalAmount;
                      } else if (infoName === "substractedAmount") {
                        detailInfo.type = "remove";
                        detailInfo.amount = infoDetail.amount;

                        //to chart
                        detailInfoChart.newAmount = infoDetail.amount;
                        detailInfoChart.type = "remove";
                        totalAmount = totalAmount - infoDetail.amount;
                        detailInfoChart[paymentId.slice(-4)] = totalAmount;
                      } else if (infoName === "additionalInfo") {
                        if (infoDetail.startsWith("OTC operation id")) {
                          var OTCid =
                            "ID de la operación OTC " + infoDetail.slice(-4);
                          detailInfo.additionalInfo = OTCid;
                        } else {
                          detailInfo.additionalInfo = infoDetail;
                        }
                      }
                    }
                  );

                  let merged = { ...movementToAdd, ...detailInfo };
                  listMovements.push(merged);
                  if (!statusFail) {
                    let merged2 = { ...movementToChart, ...detailInfoChart };
                    listMovementsToChart.push(merged2);
                  }
                } else {
                  ////console.log(n.getTime(),date1.getTime(),date2.getTime())
                }
              });
            });
            this.setState({
              listMovementsTable: listMovements,
              listMovementsChart: listMovementsToChart,
              showResult: true,
            });
          } else {
            if (this.state.dateTo === "") {
              Object.entries(res.data).forEach(([paymentId, movements]) => {
                var movementToAdd = {};
                var movementToChart = {};
                var totalAmount = 0;
                movementToAdd.paymentTypeId = paymentId;
                movementToChart.paymentTypeId = paymentId.slice(-4);

                Object.entries(movements).forEach(([keyData, movementInfo]) => {
                  let n = new Date(keyData.split("__")[0]);

                  if (n.getTime() >= date1.getTime()) {
                    movementToAdd.date = moment(keyData.split("__")[0]).format(
                      "YYYY/MM/DD HH:mm:ss"
                    );
                    movementToChart.date = moment(
                      keyData.split("__")[0]
                    ).valueOf();
                    detailInfoChart = {};
                    var statusFail = false;

                    Object.entries(movementInfo).forEach(
                      ([infoName, infoDetail]) => {
                        if (infoName === "balanceOperationStatus") {
                          detailInfo.status = infoDetail;

                          //to chart
                          if (infoDetail === "FAIL") {
                            statusFail = true;
                            if (detailInfoChart.type === "add") {
                              totalAmount =
                                totalAmount - detailInfoChart.newAmount;
                              detailInfoChart[
                                paymentId.slice(-4)
                              ] = totalAmount;
                            } else {
                              totalAmount =
                                totalAmount + detailInfoChart.newAmount;
                              detailInfoChart[
                                paymentId.slice(-4)
                              ] = totalAmount;
                            }
                          }
                        } else if (infoName === "balanceOperationType") {
                          detailInfo.operationType = infoDetail;
                        } else if (infoName === "addedAmount") {
                          detailInfo.type = "add";
                          detailInfo.amount = infoDetail.amount;

                          //to chart
                          detailInfoChart.newAmount = infoDetail.amount;
                          detailInfoChart.type = "add";
                          totalAmount = totalAmount + infoDetail.amount;
                          detailInfoChart[paymentId.slice(-4)] = totalAmount;
                        } else if (infoName === "substractedAmount") {
                          detailInfo.type = "remove";
                          detailInfo.amount = infoDetail.amount;

                          //to chart
                          detailInfoChart.newAmount = infoDetail.amount;
                          detailInfoChart.type = "remove";
                          totalAmount = totalAmount - infoDetail.amount;
                          detailInfoChart[paymentId.slice(-4)] = totalAmount;
                        } else if (infoName === "additionalInfo") {
                          if (infoDetail.startsWith("OTC operation id")) {
                            var OTCid =
                              "ID de la operación OTC " + infoDetail.slice(-4);
                            detailInfo.additionalInfo = OTCid;
                          } else {
                            detailInfo.additionalInfo = infoDetail;
                          }
                        }
                      }
                    );

                    let merged = { ...movementToAdd, ...detailInfo };
                    listMovements.push(merged);
                    if (!statusFail) {
                      let merged2 = { ...movementToChart, ...detailInfoChart };
                      listMovementsToChart.push(merged2);
                    }
                  } else {
                    ////console.log(n.getTime(),date1.getTime(),date2.getTime())
                  }
                });
              });
              this.setState({
                listMovementsTable: listMovements,
                listMovementsChart: listMovementsToChart,
                showResult: true,
              });
            } else {
              Object.entries(res.data).forEach(([paymentId, movements]) => {
                var movementToAdd = {};
                var movementToChart = {};
                var totalAmount = 0;
                movementToAdd.paymentTypeId = paymentId;
                movementToChart.paymentTypeId = paymentId.slice(-4);

                Object.entries(movements).forEach(([keyData, movementInfo]) => {
                  let n = new Date(keyData.split("__")[0]);

                  if (
                    n.getTime() >= date1.getTime() &&
                    n.getTime() <= date2.getTime()
                  ) {
                    movementToAdd.date = moment(keyData.split("__")[0]).format(
                      "YYYY/MM/DD HH:mm:ss"
                    );
                    movementToChart.date = moment(
                      keyData.split("__")[0]
                    ).valueOf();
                    detailInfoChart = {};
                    var statusFail = false;

                    Object.entries(movementInfo).forEach(
                      ([infoName, infoDetail]) => {
                        if (infoName === "balanceOperationStatus") {
                          detailInfo.status = infoDetail;

                          //to chart
                          if (infoDetail === "FAIL") {
                            statusFail = true;
                            if (detailInfoChart.type === "add") {
                              totalAmount =
                                totalAmount - detailInfoChart.newAmount;
                              detailInfoChart[
                                paymentId.slice(-4)
                              ] = totalAmount;
                            } else {
                              totalAmount =
                                totalAmount + detailInfoChart.newAmount;
                              detailInfoChart[
                                paymentId.slice(-4)
                              ] = totalAmount;
                            }
                          }
                        } else if (infoName === "balanceOperationType") {
                          detailInfo.operationType = infoDetail;
                        } else if (infoName === "addedAmount") {
                          detailInfo.type = "add";
                          detailInfo.amount = infoDetail.amount;

                          //to chart
                          detailInfoChart.newAmount = infoDetail.amount;
                          detailInfoChart.type = "add";
                          totalAmount = totalAmount + infoDetail.amount;
                          detailInfoChart[paymentId.slice(-4)] = totalAmount;
                        } else if (infoName === "substractedAmount") {
                          detailInfo.type = "remove";
                          detailInfo.amount = infoDetail.amount;

                          //to chart
                          detailInfoChart.newAmount = infoDetail.amount;
                          detailInfoChart.type = "remove";
                          totalAmount = totalAmount - infoDetail.amount;
                          detailInfoChart[paymentId.slice(-4)] = totalAmount;
                        } else if (infoName === "additionalInfo") {
                          if (infoDetail.startsWith("OTC operation id")) {
                            var OTCid =
                              "ID de la operación OTC " + infoDetail.slice(-4);
                            detailInfo.additionalInfo = OTCid;
                          } else {
                            detailInfo.additionalInfo = infoDetail;
                          }
                        }
                      }
                    );

                    let merged = { ...movementToAdd, ...detailInfo };
                    listMovements.push(merged);
                    if (!statusFail) {
                      let merged2 = { ...movementToChart, ...detailInfoChart };
                      listMovementsToChart.push(merged2);
                    }
                  } else {
                    ////console.log(n.getTime(),date1.getTime(),date2.getTime())
                  }
                });
              });
              this.setState({
                listMovementsTable: listMovements,
                listMovementsChart: listMovementsToChart,
                showResult: true,
              });
            }
          }
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  randomColor = () => {
    var result;
    var count = 0;
    for (var prop in this.state.colors.names)
      if (Math.random() < 1 / ++count) result = prop;
    return result;
  };
  validatorDate() {
    if (
      this.state.dateTo === this.state.dateFrom &&
      this.state.dateFrom !== "" &&
      this.state.dateTo !== ""
    ) {
      alert("la fecha final no puede ser igual a la inicial o viceversa");
    }
    if (this.state.dateFrom !== "" && this.state.dateTo === "") {
      alert("falta un elemento de fecha para la consulta");
    }
    if (this.state.dateTo !== "" && this.state.dateFrom === "") {
      alert("falta un elemento de fecha para la consulta");
    }
  }

  render() {
    const paymentMovementsTableHeaders = [
      {
        Header: "ID",
        accessor: "paymentTypeId",
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 60,
      },
      {
        Header: "Fecha",
        accessor: "date",
      },
      {
        Header: "Tipo de operación",
        accessor: "operationType",
        Cell: (row) => {
          if (row.value === "DEBIT") {
            return "DÉBITO";
          } else if (row.value === "CREDIT") {
            return "CRÉDITO";
          } else if (row.value === "BUY") {
            return "COMPRA";
          } else if (row.value === "MC_BUY_BALANCE") {
            return "COMPRA DE SALDO MONEYCLICK";
          } else if (row.value === "SEND_TO_PAYMENT") {
            return "ENVIO A MEDIO DE PAGO";
          } else {
            return row.value;
          }
        },
      },
      {
        Header: "Monto",
        accessor: "amount",
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right",
            },
          };
        },
        Cell: (row) =>
          row.original.type === "add" ? (
            <p style={{ color: "green" }}>
              <NumberFormat
                value={this.floorDecimals(row.value, 8)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </p>
          ) : (
            <p style={{ color: "red" }}>
              <NumberFormat
                value={this.floorDecimals(row.value, 8)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </p>
          ),
        width: 200,
      },
      {
        Header: "Información adicional",
        accessor: "additionalInfo",
      },
      {
        Header: "Estatus",
        accessor: "status",
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
          }
        },
        width: 150,
      },
    ];
    return (
      <div>
        {!this.state.showSearch && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
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
              <Form.Field width={8} key={this.state.keySelectPayment}>
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

            <Form.Field>
              <label>consultar desde:</label>
              <Input
                type="date"
                name="date1"
                onChange={this.pickDateFrom}
              ></Input>
            </Form.Field>

            <Form.Field>
              <label>consultar hasta:</label>
              <Input
                type="date"
                name="date2"
                onChange={this.pickDateTo}
              ></Input>
            </Form.Field>

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
                          (paymentMethodAmount) => (
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
                                          </label>
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
                  {this.state.listMovementsChart !== null && (
                    <Container style={{ height: 250 }}>
                      <Divider hidden />
                      <ResponsiveContainer>
                        <LineChart
                          data={this.state.listMovementsChart}
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
                                maximumFractionDigits: 4,
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
                          {this.state.paymentMethodsToSearch.map((id) => {
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
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {this.state.listMovementsTable !== null && (
              <div>
                <Divider />
                <Header as="h4">
                  Movimientos de los medios de pago consultados
                </Header>
                <ReactTable
                  defaultSorted={[
                    {
                      id: "date",
                      desc: true,
                    },
                  ]}
                  className="transactionTable"
                  data={this.state.listMovementsTable}
                  columns={paymentMovementsTableHeaders}
                  defaultPageSize={5}
                  previousText="Anterior"
                  nextText="Siguiente"
                  loadingText="Cargando..."
                  noDataText="Estos medios de pago no poseen movimientos"
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
        )}
      </div>
    );
  }
}

export default BalancePaymentMethods;
