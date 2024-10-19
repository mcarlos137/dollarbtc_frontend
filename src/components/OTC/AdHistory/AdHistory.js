import React, { Component } from "react";
import "../OTC.css";
import { Icon, Flag, Dimmer, Loader,Image } from "semantic-ui-react";
import ReactTable from "react-table";
import config from "../../../services/config";
import axios from "axios";
import userService from "../../../services/user";
import NumberFormat from "react-number-format";
import _ from "underscore";
import ISOCURRENCIES from "../../../common/ISO4217";
import theter from '../../../img/tether-seeklogo.svg';
const URL_BASE_DBTC = config.apiDollarBtcUrl;

class AdHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { offersTable: [], showOffersTable: false, details: [] };
  }
  validateData(value) {
    if (value !== undefined) {
      return "-" + value;
    } else {
      return " ";
    }
  }
  getOfferDetail = async (offerArray) => {
    let paymentIdArray = offerArray.filter((obj) =>
      Object.keys(obj).includes("paymentMethod")
    );
    var listDetails = [];
    if (paymentIdArray.length === 0) {
      this.setState({ showOffersTable: true });
    }
    for (var i = 0; i < paymentIdArray.length; i++) {
      var urlGetDetail =
        URL_BASE_DBTC +
        "/otc/getDollarBTCPayment/" +
        paymentIdArray[i].currency +
        "/" +
        paymentIdArray[i].paymentMethod;
      var toPush = await axios
        .get(urlGetDetail)
        .then((res) => {
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
                  this.validateData(res.data.accountHolderId),
              };
            } else {
              return {
                id: res.data.id,
                detail: res.data.walletAddress,
              };
            }
          } else {
            return {};
          }
        })
        .catch((error) => {
          //console.log(error);
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
  makeDataTable = (offers) => {
    var tableToShow = [];
    Object.entries(offers).forEach(([currency, operationType]) => {
      Object.entries(operationType).forEach(([operationName, offerInfo]) => {
        var offerToAdd = {};
        console.log(operationName);
        var offerType = operationName.split("__")[0];
        offerToAdd.paymentMethod = operationName.split("__")[1];
        if (operationName.split("__")[2] === "TRANSFER_INTERNATIONAL_BANK") {
          offerToAdd.paymentType = "Transferencia internacional (Swift o Aba)";
        } else if (operationName.split("__")[2] === "CASH_DEPOSIT") {
          offerToAdd.paymentType = "Depósito en efectivo";
        } else if (
          operationName.split("__")[2] === "TRANSFER_WITH_SPECIFIC_BANK"
        ) {
          offerToAdd.paymentType = "Transferencia desde un banco específico";
        } else if (operationName.split("__")[2] === "TRANSFER_NATIONAL_BANK") {
          offerToAdd.paymentType = "Transferencia desde un tercer banco";
        } else if (
          operationName.split("__")[2] === "TRANSFER_TO_CRYPTO_WALLET"
        ) {
          offerToAdd.paymentType = "Transferencia desde una crypto wallet";
        } else if (operationName.split("__")[2] === "WIRE_TRANSFER") {
          offerToAdd.paymentType = "Wire (Transferencia cablegráfica)";
        } else if (operationName.split("__")[2] === "CHECK_DEPOSIT") {
          offerToAdd.paymentType = "Depósito en cheque";
        } else if (operationName.split("__")[2] === "RETAIL") {
          offerToAdd.paymentType = "Retail (Minorista)";
        } else if (operationName.split("__")[2] === "MAIN") {
          offerToAdd.paymentType = "Main (Principal)";
        } else if (operationName.split("__")[2] === "CREDIT_CARD") {
          offerToAdd.paymentType = "Tarjeta de crédito";
        } else if (operationName.split("__")[2] === "PERSONAL_CHECK_DEPOSIT") {
          offerToAdd.paymentType = "Cheque personal";
        } else if (operationName.split("__")[2] === "CASHIER_CHECK_DEPOSIT") {
          offerToAdd.paymentType = "Cheque de gerencia";
        } else if (operationName.split("__")[2] === "MONEY_ORDER") {
          offerToAdd.paymentType = "Orden de dinero";
        } else {
          offerToAdd.paymentType = operationName.split("__")[2];
        }
        let countryCoin = currency.split("_");
        let countryPrefix = countryCoin.length > 1 ? countryCoin[0] : "";
        let symbol = countryCoin.length > 1 ? countryCoin[1] : countryCoin[0];
        let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
          if (countryCoin.length > 1)
            return c.flag === countryPrefix.toLowerCase();
          else return c.key === symbol;
        })[0];
        if (currencyCurrent !== undefined  && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
          offerToAdd.flag = currencyCurrent.flag;
        } else if( symbol === "ETH") {
          offerToAdd.flag = "ethereum";
        }

        offerToAdd.currency = symbol;
        if (offerType === "ASK") {
          offerToAdd.operationType = "COMPRA";
        } else if (offerType === "BID") {
          offerToAdd.operationType = "VENTA";
        }

        for (var i = 0; i < offerInfo.length; i++) {
          var offer = {};
          offer.price = offerInfo[i].price;
          offer.minPerOperationAmount = offerInfo[i].minPerOperationAmount;
          offer.maxPerOperationAmount = offerInfo[i].maxPerOperationAmount;
          offer.totalAmount = offerInfo[i].totalAmount;
          offer.accumulatedAmount = offerInfo[i].accumulatedAmount;
          offer.date = new Date(offerInfo[i].timestamp).getTime(); //this.formatDate(new Date(offerInfo[i].timestamp));
          offer.minMax =
            offer.minPerOperationAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            }) +
            "-" +
            offer.maxPerOperationAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            });
          offer.acumTotal =
            offer.accumulatedAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            }) +
            "/" +
            offer.totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            });
          let merged = { ...offerToAdd, ...offer };
          tableToShow.push(merged);
        }
      });
    });
    this.getOfferDetail(tableToShow);
    this.setState({ offersTable: tableToShow });
  };
  getOffers() {
    var url =
      URL_BASE_DBTC + "/otcAdmin/getOldOffers/" + userService.getUserName();
    axios
      .get(url)
      .then((resp) => {
        this.makeDataTable(resp.data);
      })
      .catch((error) => {
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

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  render() {
    const adTableHeaders = [
      {
        Header: "Moneda",
        accessor: "currency",
        Cell: (row) => {
          if (row.value !== "ETH" && row.value !== "USDT") {
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
        width: 70,
      },
      {
        Header: "Fecha",
        accessor: "date",
        width: 170,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: "Medio de pago",
        accessor: "paymentMethod",
        Cell: (row) => {
          if (this.state.details.length > 0) {
            if (row.value === "MONEYCLICK") {
              var text = "MoneyClick";
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
        },
      },
      {
        Header: "Tipo de pago",
        accessor: "paymentType",
      },
      {
        Header: "Tipo de operación",
        accessor: "operationType",
        width: 80,
      },
      {
        Header: "Precio",
        accessor: "price",
        getProps: () => {
          return {
            style: {
              textAlign: "left",
            },
          };
        },
        Cell: (row) => {
          return (
            <NumberFormat
              value={this.floorDecimals(row.value, 2)}
              decimalScale={2}
              fixedDecimalScale={true}
              displayType={"text"}
              thousandSeparator={true}
            />
          );
        },
      },
      {
        Header: "Min-Máx",
        accessor: "minMax",
        getProps: () => {
          return {
            style: {
              textAlign: "left",
            },
          };
        },
      },
      {
        Header: "Acumulado/Total",
        accessor: "acumTotal",
        getProps: () => {
          return {
            style: {
              textAlign: "left",
            },
          };
        },
      },
    ];
    return (
      <div>
        {!this.state.showOffersTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <ReactTable
          defaultSorted={[
            {
              id: "date",
              desc: true,
            },
          ]}
          style={{ fontSize: 12 }}
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
export default AdHistory;
