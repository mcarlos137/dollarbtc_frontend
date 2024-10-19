import React, { Component } from "react";
import "../OTC.css";
import { Icon, Flag, Dimmer, Loader,Image } from "semantic-ui-react";
import ReactTable from "react-table";
import translate from "../../../i18n/translate";
import brokerServices from "../../../services/brokers";
import otc from "../../../services/otc";
import NumberFormat from "react-number-format";
import _ from "underscore";
import theter from '../../../img/tether-seeklogo.svg';
import ISOCURRENCIES from "../../../common/ISO4217";

class HistoryOffer extends Component {
  constructor(props) {
    super(props);
    const mapPayments = new Map();
    mapPayments.set(
      "TRANSFER_WITH_SPECIFIC_BANK",
      props.translate("profile.addAccount.specificBank")
    );
    mapPayments.set(
      "TRANSFER_NATIONAL_BANK",
      props.translate("profile.addAccount.thirdBank")
    );
    mapPayments.set(
      "CHECK_DEPOSIT",
      props.translate("profile.addAccount.checkDeposit")
    );
    mapPayments.set(
      "CASH_DEPOSIT",
      props.translate("profile.addAccount.cashDeposit")
    );
    mapPayments.set(
      "WIRE_TRANSFER",
      props.translate("profile.addAccount.wire")
    );
    mapPayments.set(
      "TRANSFER_INTERNATIONAL_BANK",
      props.translate("profile.addAccount.international")
    );
    mapPayments.set(
      "TRANSFER_TO_CRYPTO_WALLET",
      props.translate("profile.addAccount.cryptoWallet")
    );
    mapPayments.set(
      "ELECTRONIC_TRANSFER",
      props.translate("profile.addAccount.electronicTrans")
    );
    this.state = {
      mapPayments: mapPayments,
      offersTable: [],
      showOffersTable: false,
      details: [],
      translator: props.translate
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const mapPayments = new Map();
    mapPayments.set(
      "TRANSFER_WITH_SPECIFIC_BANK",
      nextProps.translate("profile.addAccount.specificBank")
    );
    mapPayments.set(
      "TRANSFER_NATIONAL_BANK",
      nextProps.translate("profile.addAccount.thirdBank")
    );
    mapPayments.set(
      "CHECK_DEPOSIT",
      nextProps.translate("profile.addAccount.checkDeposit")
    );
    mapPayments.set(
      "CASH_DEPOSIT",
      nextProps.translate("profile.addAccount.cashDeposit")
    );
    mapPayments.set(
      "WIRE_TRANSFER",
      nextProps.translate("profile.addAccount.wire")
    );
    mapPayments.set(
      "TRANSFER_INTERNATIONAL_BANK",
      nextProps.translate("profile.addAccount.international")
    );
    mapPayments.set(
      "TRANSFER_TO_CRYPTO_WALLET",
      nextProps.translate("profile.addAccount.cryptoWallet")
    );
    mapPayments.set(
      "ELECTRONIC_TRANSFER",
      nextProps.translate("profile.addAccount.electronicTrans")
    );
    this.setState({
      mapPayments: mapPayments
    });

    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  validateData(value) {
    if (value !== undefined) {
      return "-" + value;
    } else {
      return " ";
    }
  }
  getOfferDetail = async offerArray => {
    let paymentIdArray = offerArray.filter(obj =>
      Object.keys(obj).includes("paymentMethod")
    );
    var listDetails = [];
    if (paymentIdArray.length === 0) {
      this.setState({ showOffersTable: true });
    }
    for (var i = 0; i < paymentIdArray.length; i++) {
      let currency = paymentIdArray[i].currency;
      let id = paymentIdArray[i].paymentMethod;
      var toPush = await otc
        .getDollarBTCPayment(currency, id)
        .then(res => {
          if (!_.isEmpty(res.data)) {
            if (res.data.bank !== undefined) {
              return {
                id: res.data.id,
                detail:
                  res.data.bank +
                  "-" +
                  res.data.accountNumber +
                  "-" +
                  res.data.accountHolderName +
                  this.validateData(res.data.accountHolderId)
              };
            } else {
              return {
                id: res.data.id,
                detail: res.data.walletAddress
              };
            }
          } else {
            return {};
          }
        })
        .catch(error => {
          //console.log(error);
        });
      if (!_.isEmpty(toPush)) {
        listDetails.push(toPush);
      }
      if (i + 1 === paymentIdArray.length) {
        this.setState({ details: listDetails }, () => {
          this.setState({ showOffersTable: false });
        });
      }
    }
  };

  getOffers() {
    let user = sessionStorage.getItem("username");
    let listOffer = [];
    brokerServices
      .getOldOffer(user)
      .then(resp => {
        Object.entries(resp.data).forEach(([key, value]) => {
          let offerToAdd = {};
          offerToAdd.operationType = key.split("__")[1];
          offerToAdd.paymentMethod = key.split("__")[2];
          offerToAdd.paymentType = this.state.mapPayments.get(
            key.split("__")[3]
          );
          let currency = key.split("__")[0];

          let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
            return c.key === currency;
          })[0];
          if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            offerToAdd.flag = currencyCurrent.flag;
          } else if(currency === "ETH"){
            offerToAdd.flag = "ethereum";
          };
          offerToAdd.currency = currency;
          if (value.length > 0) {
            for (var i = 0; i < value.length; i++) {
              var offer = {};
              if (value[i].price !== undefined) {
                offer.price = value[i].price;
              } else {
                offer.price = value[i].limitPrice;
              }

              offer.minPerOperationAmount = value[i].minPerOperationAmount;
              offer.maxPerOperationAmount = value[i].maxPerOperationAmount;
              offer.totalAmount = value[i].totalAmount;
              offer.accumulatedAmount = value[i].accumulatedAmount;
              offer.date = this.formatDate(new Date(value[i].timestamp));
              offer.minMax =
                offer.minPerOperationAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                }) +
                "-" +
                offer.maxPerOperationAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                });
              offer.acumTotal =
                offer.accumulatedAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                }) +
                "/" +
                offer.totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                });
              let merged = { ...offerToAdd, ...offer };
              listOffer.push(merged);
            }
          }
        });
        this.getOfferDetail(listOffer);
        this.setState({ offersTable: listOffer });
      })
      .catch(error => {
        //console.log(error);
      });
  }
  componentDidMount() {
    this.getOffers();
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

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  render() {
    let t = this.state.translator;
    const adTableHeaders = [
      {
        Header: t("broker.actualOfferTable.currency"),
        accessor: "currency",
        Cell: row => {
          if (row.value !== "ETH" && row.value !== "USDT" ) {
            return (
              <div>
                <Flag name={row.original.flag} /> {row.value}
              </div>
            );
         	} else if(row.value === "ETH"){
            return (
              <div>
                <Icon name={row.original.flag} /> {row.value}
              </div>
            );
          } else {
						return (
							<div>
								<Image src={theter} size={"mini"} className={"iconEth"}/> {row.value}
							</div>
						);
					}
        },
        width: 70
      },
      {
        Header: t("broker.actualOfferTable.date"),
        accessor: "date",
        width: 170
      },
      {
        Header: t("broker.actualOfferTable.payMethod"),
        accessor: "paymentMethod",
        Cell: row => {
          if (this.state.details.length > 0) {
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
        Header: t("broker.actualOfferTable.typeOfPayment"),
        accessor: "paymentType"
      },
      {
        Header: t("broker.actualOfferTable.typeOperation"),
        accessor: "operationType",
        width: 80,
        Cell: row => {
          if (row.value === "BID") {
            return t("broker.addOfferOption.buy");
          } else if (row.value === "ASK") {
            return t("broker.addOfferOption.sell");
          } else {
            return row.value;
          }
        }
      },
      {
        Header: t("broker.actualOfferTable.price"),
        accessor: "price",
        getProps: () => {
          return {
            style: {
              textAlign: "left"
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
              style={{ textAlign: "left" }}
            />
          );
        }
      },
      {
        Header: "Min-Máx",
        accessor: "minMax",
        getProps: () => {
          return {
            style: {
              textAlign: "left"
            }
          };
        }
      },
      {
        Header: t("broker.actualOfferTable.accumulated"),
        accessor: "acumTotal",
        getProps: () => {
          return {
            style: {
              textAlign: "left"
            }
          };
        }
      }
    ];
    return (
      <div>
        {this.state.showOffersTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <ReactTable
          defaultSorted={[
            {
              id: "date",
              desc: true
            }
          ]}
          style={{ fontSize: 12 }}
          className="transactionTable"
          data={this.state.offersTable}
          columns={adTableHeaders}
          defaultPageSize={5}
          loading={this.state.showOffersTable}
          previousText={t("broker.actualOfferTable.table.previous")}
          nextText={t("broker.actualOfferTable.table.next")}
          loadingText={t("broker.actualOfferTable.table.loading")}
          noDataText={t("broker.actualOfferTable.table.noData")}
          pageText={t("broker.actualOfferTable.table.page")}
          ofText={t("broker.actualOfferTable.table.of")}
          rowsText={t("broker.actualOfferTable.table.rows")}
          pageJumpText={t("broker.actualOfferTable.table.pageJump")}
          rowsSelectorText={t("broker.actualOfferTable.table.rowsSelector")}
          minRow={5}
          filterable
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            return row[id] !== undefined
              ? String(row[id]).startsWith(filter.value.toUpperCase())
              : true;
          }}
        />
      </div>
    );
  }
}
export default translate(HistoryOffer);
