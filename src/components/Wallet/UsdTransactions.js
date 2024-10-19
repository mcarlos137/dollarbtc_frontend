import React, { Component } from "react";
import axios from "axios";
import userService from "../../services/user";
import otcService from "../../services/otc";
import config from "../../services/config";
import _ from "underscore";
import {
  Container,
  Dimmer,
  Divider,
  Icon,
  Label,
  Loader,
  Popup,
  Segment,
  Grid,
} from "semantic-ui-react";
import ReactTable from "react-table";
import ReactTooltip from "react-tooltip";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";
const URL_BASE_DBTC = config.apiDollarBtcUrl;
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;

class UsdTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMovements: [],
      transactionTable: [],
      tableReady: false,
      balanceDollarBTC: [],
      allIncomingBTC: 0,
      allOutcomingBTC: 0,
      allFeeTransferBTC: 0,
      amount: 0,
      renderNow: false,
      details: [],
      translator: props.translate,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  getGeneralTrans = function () {
    axios
      .get(
        URL_BASE_BUSHIDO +
          "/api/v2/tx/deposit/user/" +
          userService.getUserName(),
        {
          auth: {
            username: atob(userService.getHeader()).split(":")[1],
            password: atob(userService.getHeader()).split(":")[0],
          },
        }
      )
      .then((res) => {
        this.setState({ balanceDollarBTC: res.data.payload });
      })
      .catch((error) => {
        ////console.log(error);
      });
  };
  updateBalanceDBC = function (value, currency, address) {
    var balance = {
      userName: userService.getUserName(),
      balanceOperationType: "RECEIVE",
      address: address,
      privateKey: "",
      amounts: {},
    };
    Object.defineProperty(balance.amounts, currency, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    userService
      .balanceOperation(balance)
      .then((res) => {})
      .catch((error) => {
        ////console.log(error);
      });
  };
  async updateDeposit(value, address) {
    var body = {
      address: address,
      amount: value,
    };
    try {
      const res = await userService.updateDepositToUser(body);
    } catch (error) {}
  }
  webBlockCypherBTC = (currency, address) => {
    var cr = String(currency).toLowerCase();
    // ////console.log(cr, address);
    var url = config.apiBlockCypherUrl + "/" + cr + "/main/addrs/" + address;
    axios
      .get(url, { withCredentials: false })
      .then((res) => {
        var tx = res.data.txrefs;
        for (var j = 0; j < this.state.balanceDollarBTC.length; j++) {
          if (this.state.balanceDollarBTC[j].currency === currency) {
            var lastRegisteredTxDate = new Date(
              this.state.balanceDollarBTC[j].amount
            );
            if (lastRegisteredTxDate === "Invalid Date") {
              lastRegisteredTxDate = new Date("2010-12-10T01:02:29.000Z");
            }
          }
        }
        if (tx !== undefined && tx.length > 0) {
          for (var x = 0; x < tx.length; x++) {
            var newLatestTxDate;
            if (tx[x].tx_input_n === -1) {
              var txDate = new Date(tx[x].confirmed);
              if (
                txDate > lastRegisteredTxDate ||
                lastRegisteredTxDate === undefined ||
                lastRegisteredTxDate === null
              ) {
                var BTCvalue = tx[x].value * 0.00000001;
                this.updateBalanceDBC(BTCvalue, currency, address);
                if (
                  txDate > newLatestTxDate ||
                  newLatestTxDate === undefined ||
                  newLatestTxDate === null
                ) {
                  newLatestTxDate = txDate;
                }
              }
            }
          }
        }
        if (newLatestTxDate !== undefined) {
          this.updateDeposit(newLatestTxDate.toISOString(), address);
        }
      })
      .catch((error) => {
        ////console.log(error);
      });
  };
  componentDidMount() {
    var dateInit = new Date();
    var timeback = 1000 * 60 * 60 * 24 * 180;
    var dateEnd = new Date(dateInit.getTime() - timeback);
    userService
      .userMovements(
        userService.getUserName(),
        dateEnd.toISOString(),
        dateInit.toISOString()
      )
      .then((res) => {
        this.makeTableData(res.data.result);
      })
      .catch((error) => {
        this.setState({
          transactionTable: [],
          renderNow: true,
        });
        //console.log(error);
      });
    //  this.getGeneralTrans();
    //   this.webBlockCypherBTC("BTC", userService.getAddress());
  }

  getOTCDetail = async (txArray) => {
    let otcId = txArray.filter((obj) => Object.keys(obj).includes("allOTCid"));
    var listDetails = [];
    if (otcId.length === 0) {
      this.setState({ tableReady: true });
    }
    for (var i = 0; i < otcId.length; i++) {
      try {
        const response = otcService.getOperationAsync(otcId[i].allOTCid);
        if (!_.isEmpty(response.data)) {
          var toPush = {
            id: response.data.id,
            amount: response.data.amount,
            currency: response.data.currency,
            price: response.data.price,
          };
        } else {
          var toPush = {};
        }
      } catch (error) {}
      if (!_.isEmpty(toPush)) {
        listDetails.push(toPush);
      }
      //  console.log(listDetails);
      if (i + 1 === otcId.length) {
        this.setState({ details: listDetails }, () =>
          this.setState({ tableReady: true })
        );
      }
    }
  };
  makeTableData = (movements) => {
    //console.log(movements);
    var tx = {};
    var validArray = [];
    var txArray = [];
    Object.entries(movements).forEach(([key, value]) => {
      tx = {};
      if (value.addedAmount !== undefined) {
        if (value.addedAmount.currency === "USD") {
          tx.date = new Date(key.split("__")[0]).getTime();
          Object.entries(value).forEach(([k, v]) => {
            tx.OTCid = "";
            if (k === "addedAmount") {
              if (v.currency === "USD") {
                tx.type = "add";
                tx.amountBTC = v.amount;
              }
            } else if (k === "substractedAmount") {
              if (v.currency === "USD") {
                tx.amountBTC = v.amount;
                tx.type = "remove";
              }
            } else if (k === "balanceOperationType") {
              if (v === "WITHDRAW") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.withdraw"
                );
              } else if (v === "INITIAL_DEPOSIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.initialDeposit"
                );
              } else if (v === "DEPOSIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.deposit"
                );
              } else if (v === "TRANSFER_TO_DOLLARBTC") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.transferToDollarBTC"
                );
              } else if (v === "TRANSFER_FROM_DOLLARBTC") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.transferFromDollarBTC"
                );
              } else if (v === "RECEIVE") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.receive"
                );
              } else if (v === "SEND") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.send"
                );
              } else if (v === "CREDIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.credit"
                );
              } else if (v === "DEBIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.debit"
                );
              } else if (v === "FAST_CHANGE") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.change"
                );
              } else if (v.includes("MODEL")) {
                v = v.replace("MODEL", "PLAN");
                if (v === "PLAN_ACTIVATION") {
                  tx.description = this.state.translator(
                    "wallet.tx.operationType.planActivation"
                  );
                } else if (v === "PLAN_INACTIVATION") {
                  tx.description = this.state.translator(
                    "wallet.tx.operationType.planInactivation"
                  );
                }
              }
            } else if (k === "targetAddress") {
              if (
                tx.description ===
                this.state.translator("wallet.tx.operationType.withdraw")
              ) {
                tx.description =
                  tx.description +
                  this.state.translator("wallet.tx.operationType.to") +
                  v.toUpperCase();
              }
            } else if (k === "address") {
              if (
                tx.description ===
                this.state.translator("wallet.tx.operationType.deposit")
              ) {
                tx.description =
                  tx.description +
                  this.state.translator("wallet.tx.operationType.from") +
                  v.toUpperCase();
              }
            } else if (k === "additionalInfo") {
              if (
                tx.description ===
                  this.state.translator(
                    "wallet.tx.operationType.planActivation"
                  ) ||
                tx.description ===
                  this.state.translator(
                    "wallet.tx.operationType.planInactivation"
                  )
              ) {
                tx.description =
                  tx.description + v.toUpperCase().split("__")[1].toLowerCase();
              } else if (v.startsWith("OTC")) {
                tx.OTCid = v.split("id ")[1].slice(-4);
                tx.allOTCid = v.split("id ")[1];
              } else if (tx.description === "BTC sent") {
                if (v !== "") {
                  tx.description = tx.description + " (" + v + ")";
                }
              }
            } else if (k === "balanceOperationStatus") {
              tx.status = v;
            } else if (k === "message") {
              tx.message = v;
            }
            if (k === "btcPrice") {
              tx.feeBTC = v;
            }
          });
          txArray.push(tx);
        }
      } else if (value.substractedAmount !== undefined) {
        if (value.substractedAmount.currency === "USD") {
          tx.date = new Date(key.split("__")[0]).getTime();
          Object.entries(value).forEach(([k, v]) => {
            tx.OTCid = "";
            if (k === "addedAmount") {
              if (v.currency === "USD") {
                tx.type = "add";
                tx.amountBTC = v.amount;
              }
            } else if (k === "substractedAmount") {
              if (v.currency === "USD") {
                tx.amountBTC = v.amount;
                tx.type = "remove";
              }
            } else if (k === "balanceOperationType") {
              if (v === "WITHDRAW") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.withdraw"
                );
              } else if (v === "INITIAL_DEPOSIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.initialDeposit"
                );
              } else if (v === "DEPOSIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.deposit"
                );
              } else if (v === "TRANSFER_TO_DOLLARBTC") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.transferToDollarBTC"
                );
              } else if (v === "TRANSFER_FROM_DOLLARBTC") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.transferFromDollarBTC"
                );
              } else if (v === "RECEIVE") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.receive"
                );
              } else if (v === "SEND") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.send"
                );
              } else if (v === "CREDIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.credit"
                );
              } else if (v === "DEBIT") {
                tx.description = this.state.translator(
                  "wallet.tx.operationType.debit"
                );
              } else if (v === "FAST_CHANGE") {
                console.log(v);
                tx.description = this.state.translator(
                  "wallet.tx.operationType.change"
                );
              } else if (v.includes("MODEL")) {
                v = v.replace("MODEL", "PLAN");
                if (v === "PLAN_ACTIVATION") {
                  tx.description = this.state.translator(
                    "wallet.tx.operationType.planActivation"
                  );
                } else if (v === "PLAN_INACTIVATION") {
                  tx.description = this.state.translator(
                    "wallet.tx.operationType.planInactivation"
                  );
                }
              }
            } else if (k === "targetAddress") {
              if (
                tx.description ===
                this.state.translator("wallet.tx.operationType.withdraw")
              ) {
                tx.description =
                  tx.description +
                  this.state.translator("wallet.tx.operationType.to") +
                  v.toUpperCase();
              }
            } else if (k === "address") {
              if (
                tx.description ===
                this.state.translator("wallet.tx.operationType.deposit")
              ) {
                tx.description =
                  tx.description +
                  this.state.translator("wallet.tx.operationType.from") +
                  v.toUpperCase();
              }
            } else if (k === "additionalInfo") {
              if (
                tx.description ===
                  this.state.translator(
                    "wallet.tx.operationType.planActivation"
                  ) ||
                tx.description ===
                  this.state.translator(
                    "wallet.tx.operationType.planInactivation"
                  )
              ) {
                tx.description =
                  tx.description + v.toUpperCase().split("__")[1].toLowerCase();
              } else if (v.startsWith("OTC")) {
                tx.OTCid = v.split("id ")[1].slice(-4);
                tx.allOTCid = v.split("id ")[1];
              } else if (tx.description === "BTC sent") {
                if (v !== "") {
                  tx.description = tx.description + " (" + v + ")";
                }
              }
            } else if (k === "balanceOperationStatus") {
              tx.status = v;
            } else if (k === "message") {
              tx.message = v;
            }
            if (k === "btcPrice") {
              tx.feeBTC = v;
            }
          });
          txArray.push(tx);
        }
      }
    });
    var allOutcoming = 0;
    var allIncoming = 0;

    for (var i = 0; i < txArray.length; i++) {
      if (txArray[i].status === "OK") {
        if (txArray[i].type === "add" && txArray[i].amountBTC !== undefined) {
          allIncoming = allIncoming + txArray[i].amountBTC;
        } else if (txArray[i].type === "remove") {
          if (txArray[i].amountBTC !== undefined) {
            allOutcoming = allOutcoming + txArray[i].amountBTC;
          }
        }
      }
    }
    this.getOTCDetail(txArray);
    this.setState({
      transactionTable: txArray,
      allIncomingBTC: this.floorDecimals(allIncoming, 8),
      allOutcomingBTC: this.floorDecimals(allOutcoming, 8),
      renderNow: true,
    });
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
    const data = this.state.transactionTable;
    const transactionTableHeaders = [
      {
        Header: t("wallet.tx.table.headers.type"),
        accessor: "type",
        Cell: (row) =>
          row.value === "add" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          ),
        width: 60,
      },
      {
        Header: t("wallet.tx.table.headers.date"),
        accessor: "date",
        width: 280,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: "ID OTC",
        accessor: "OTCid",
        width: 100,
        Cell: (row) => {
          if (this.state.details.length > 0) {
            for (var i = 0; i < this.state.details.length; i++) {
              if (this.state.details[i].id !== undefined) {
                if (row.value === this.state.details[i].id.slice(-4)) {
                  var text =
                    t("wallet.tx.table.cells.coin") +
                    this.state.details[i].currency.toString() +
                    t("wallet.tx.table.cells.price") +
                    this.state.details[i].price.toLocaleString("EN-us", {
                      maximumFractionDigits: 4,
                    }) +
                    t("wallet.tx.table.cells.amount") +
                    this.state.details[i].amount.toLocaleString("EN-us", {
                      maximumFractionDigits: 4,
                    });

                  return (
                    <span className="fake-link" title={text}>
                      {row.value}
                    </span>
                  );
                }
                if (i + 1 === this.state.details.length) {
                  return row.value;
                }
              } else {
                return row.value;
              }
            }
          } else {
            return row.value;
          }
        },
      },
      {
        Header: t("wallet.tx.table.headers.amount"),
        accessor: "amountBTC",
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
              {" "}
              <b>{this.floorDecimals(row.value, 8)}</b>{" "}
            </p>
          ) : (
            <p style={{ color: "red" }}>
              {" "}
              <b>{this.floorDecimals(row.value, 8)}</b>{" "}
            </p>
          ),
        width: 200,
      },
      {
        Header: t("wallet.tx.table.headers.description"),
        accessor: "description",
      },
      {
        Header: t("wallet.tx.table.headers.status"),
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
                {t("wallet.tx.table.cells.processing")}
              </Label>
            );
          } else if (row.value === "FAIL") {
            return (
              <Popup
                trigger={
                  <Label color="red">
                    <Icon name="warning circle" />
                    {t("wallet.tx.table.cells.failure")}
                  </Label>
                }
                content={
                  row.original.message !== undefined
                    ? row.original.message
                    : t("wallet.tx.table.cells.failure")
                }
                on="hover"
              />
            );
          }
        },
        width: 150,
      },
    ];
    return (
      <Container textAlign="justified">
        {!this.state.renderNow && (
          <Dimmer active inverted>
            <Loader inverted>{t("wallet.send.loading")}</Loader>
          </Dimmer>
        )}
        <Grid columns="equal">
          <Grid.Column largeScreen={5} mobile={16}>
            <Segment secondary>
              <Grid columns="equal">
                <Grid.Row columns="equal">
                  <Grid.Column width={8}>
                    <p
                      style={
                        isMobile ? { color: "#207ef2", fontWeight: "bold" } : {}
                      }
                    >
                      {t("wallet.tx.totalReceivedUsd")}
                    </p>
                  </Grid.Column>
                  <Grid.Column textAlign="right">
                    <div style={isMobile ? { color: "#207ef2" } : {}}>
                      {this.state.allIncomingBTC}
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal" style={{ marginTop: -20 }}>
                  <Grid.Column width={8}>
                    <p
                      style={
                        isMobile ? { color: "#207ef2", fontWeight: "bold" } : {}
                      }
                    >
                      {t("wallet.tx.totalSentUsd")}
                    </p>
                  </Grid.Column>
                  <Grid.Column textAlign="right">
                    <div style={isMobile ? { color: "#207ef2" } : {}}>
                      {this.state.allOutcomingBTC}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
        <Divider section />
        {!this.state.tableReady && (
          <Dimmer active inverted>
            <Loader inverted>{t("wallet.tx.loading")}</Loader>
          </Dimmer>
        )}
        {this.state.tableReady && (
          <ReactTable
            // defaultSorted={[
            // 	{
            // 		id: 'date',
            // 		desc: true,
            // 	},
            // ]}

            className="transactionTable"
            data={data}
            columns={transactionTableHeaders}
            defaultPageSize={5}
            previousText={t("wallet.tx.table.params.previousText")}
            nextText={t("wallet.tx.table.params.nextText")}
            loadingText={t("wallet.tx.table.params.loadingText")}
            noDataText={t("wallet.tx.table.params.noDataText")}
            pageText={t("wallet.tx.table.params.pageText")}
            ofText={t("wallet.tx.table.params.ofText")}
            rowsText={t("wallet.tx.table.params.rowsText")}
            pageJumpText={t("wallet.tx.table.params.pageJumpText")}
            rowsSelectorText={t("wallet.tx.table.params.rowsSelectorText")}
            minRow={5}
          />
        )}
        <ReactTooltip html={true} />
      </Container>
    );
  }
}

export default translate(UsdTransactions);
