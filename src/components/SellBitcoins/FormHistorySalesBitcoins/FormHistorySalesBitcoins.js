import React, { Component } from "react";
import "../SellBitcoins.css";
import {
  Container,
  Header,
  Segment,
  Form,
  Grid,
  Icon,
  Dimmer,
  Loader,
  Feed,
  Button,
  Label,
  Popup,
  Flag,
  Accordion,
  Image,
  Message,
  Modal,
  List,
  Rating,
  Divider,
} from "semantic-ui-react";
import ReactTable from "react-table";
import term from "../../../common/termAndConditionsSell";
import * as jsPDF from "jspdf";
//import * as jsPDF from 'jspdf';

import "react-table/react-table.css";
import otcAPI from "../../../services/otc";
import currency from "../../../common/currency";
import avatarNull from "../../../img/avatarNull.png";
import { Link } from "react-router-dom";
import user from "../../../services/user";
import Sockette from "sockette";
import { parse } from "query-string";
import Files from "react-files";
import uuid from "uuid";
import translate from "../../../i18n/translate";
import Resizer from "react-image-file-resizer";
import { isMobile } from "react-device-detect";
import TermsAndConditions from "../../TermsAndConditions/TermsAndConditions";
import TakePhoto from "../../ModalTakePhoto/TakePhoto";
import attachments from "../../../services/attachments";
import config from "../../../services/config";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
class FormHistorySalesBitcoins extends Component {
  constructor(props) {
    super(props);
    this.selfRef = React.createRef();
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
    this.state = {
      operationsFromUser: [],
      tableReady: false,
      contactMessages: [],
      bank: "",
      accountNumber: "",
      accountHolder: "",
      holderId: "",
      operationSelected: "",
      isAuth: user.getUserAuth(),
      transactionTable: [],
      paymentType: "",
      paymentTypeKey: "",
      userEmail: "",
      username: "",
      errorFileMessage: false,
      idImg: "",
      selected: 0,
      textMessageNew: "",
      idOperationSelected: "",
      socket: null,
      socketStatus: null,
      messageWithoutText: false,
      selectedFile: null,
      loadingNewFile: false,
      messageErrorAdjuntar: false,
      activeIndexOne: true,
      activeIndexTwo: false,
      constantPaymentsTypes: mapPayments,
      messagesForClient: null,
      addFile: true,
      fileName: "",
      ceroOperations: false,
      activeIndexThree: false,
      showCanvas: false,
      dataToPdf: [],
      textTerm: [],
      showModalTerm: false,
      translator: props.translate,
      showModalCancelSell: false,
      resultCancelMessage: false,
      loadingCancelSell: false,
      sellCancelWindowByCurrency: new Map(),
      showCancellationButton: false,
      popupVariable: [],
      labelsClientPayment: new Map(),
      listItemHistorial: [],
      taseVat: "",
      currencyVat: "",
      comissionSell: "",
      currencyComission: "",
      showModalQualify: false,
      ratingQualify: 0,
      commentReview: "",
      reviewReady: false,
      reviewSuccess: false,
      reviewFail: false,
      loadingReview: false,
      instructionMessage: "",
    };
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.getSellFromUser = this.getSellFromUser.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
      for (let message of this.state.allMessageInstructions) {
        if (message.language === nextProps.language) {
          this.setState({ messageByStatusOperation: message.message });
        }
      }
    }
  }

  typeExistInArray(type) {
    let arrayKeys = Object.keys(this.state.constantPaymentsTypes);
    ////////console.log("arrayKeys ", arrayKeys);
    let index = arrayKeys.findIndex((key) => key === type);
    return index > -1;
  }

  handleChangeTextMessageNew(e) {
    if (e.which !== 13) {
      this.setState({
        textMessageNew: e.target.value,
      });
    }
  }

  handleKeyPressed(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  }
  sendReview() {
    let body = {
      userName: sessionStorage.getItem("username"),
      operationId: this.state.idOperationSelected,
      operationType: "OTC__SELL",
      comment: this.state.commentReview,
      starsQuantity: this.state.ratingQualify,
    };
    this.setState({ loadingReview: true });
    otcAPI
      .createReview(body)
      .then((resp) => {
        if (resp.data === "OK") {
          this.setState({
            reviewReady: true,
            reviewSuccess: true,
            ratingQualify: 0,
            commentReview: "",
            loadingReview: false,
          });
          setTimeout(() => {
            this.setState({
              showModalQualify: false,
              // ratingQualify: 0,
              //commentReview: "",
              reviewSuccess: false,
            });
          }, 5000);
        } else {
          this.setState({ reviewFail: true });
          setTimeout(() => {
            this.setState({
              reviewFail: false,
              showModalQualify: false,
              ratingQualify: 0,
              commentReview: "",
            });
          }, 5000);
        }
      })
      .catch((error) => {
        ////console.log(error);
      });
    // //console.log("final del send review")
    this.handleShowOperationSell(this.state.idOperationSelected);
  }

  handleComment(e) {
    this.setState({ commentReview: e.target.value });
  }
  closeModalQualify() {
    this.setState({
      showModalQualify: false,
      ratingQualify: 0,
      commentReview: "",
    });
    this.handleShowOperationSell(this.state.idOperationSelected);
  }
  handleRate(e, data) {
    if (!this.state.showModalQualify) {
      ////console.log(data.rating);
      this.setState({ showModalQualify: true, ratingQualify: data.rating });
    } else {
      ////console.log(data.rating);
      this.setState({ ratingQualify: data.rating });
    }
  }
  async handleValueMessageSell(value, operationId) {
    let result = JSON.parse(value);
    if (result !== undefined) {
      if (result.params !== undefined) {
        // //////console.log(
        //   "llega del socket de operaciones de ventas ",
        //    result.params
        //  );
        for (let i = 0; i < result.params.data.length; i++) {
          let messageToAdd = result.params.data[i];
          if (messageToAdd !== null) {
            let index = this.state.contactMessages.findIndex((messageAdded) => {
              return messageToAdd.timestamp === messageAdded.timestamp;
            });
            if (index === -1) {
              if (messageToAdd.attachment !== undefined) {
                messageToAdd.urlFile = await this.getOperationsAttachment(
                  operationId,
                  messageToAdd.attachment
                );
              }
              this.state.contactMessages.push(messageToAdd);
            }
          }
        }
        if (result.params.data.length > 0) {
          this.state.contactMessages.sort(function (a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          this.setState({
            contactMessages: this.state.contactMessages,
          });
        }
      }
    }
  }

  getSellFromUser = (operationIdByDefault) => {
    let bodyGetOperationsSell = {
      userName: sessionStorage.getItem("username"),
      currency: "",
      otcOperationType: "SELL",
      otcOperationStatus: null,
      brokerUserName: "",
      specialIndexes: {},
    };

    otcAPI.getOperations(bodyGetOperationsSell).then((res) => {
      // //////console.log(res);
      res.data.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].id === operationIdByDefault) {
          this.setState({
            selected: i,
          });
        }
      }

      if (res.data.length > 0) {
        this.handleShowOperationSell(
          operationIdByDefault !== null ? operationIdByDefault : res.data[0].id
        );
        this.makeTableData(res.data);
      } else {
        this.setState({
          ceroOperations: true,
        });
      }
      this.setState({
        tableReady: true,
      });
    });
  };
  componentDidMount() {
    let arr = [];
    Object.entries(term.ters).forEach(([key, value]) => {
      arr.push(value);
    });

    this.setState({ textTerm: arr });
    this.openSocketStatus();
    if (typeof parse(window.location.search).id !== "undefined") {
      this.getSellFromUser(parse(window.location.search).id);
      var uri = window.location.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
    } else {
      this.getSellFromUser(null);
    }

    window.sessionStorage.setItem("sellOperationSocketId", "");
    otcAPI
      .getCurrencies()
      .then((res) => {
        let cancelWindowByCurrency = new Map();
        res.data.map((currency) => {
          if (!currency.hasOwnProperty("sellCancelWindow")) {
            cancelWindowByCurrency.set(
              currency.shortName,
              currency.sellCancelWindow
            );
          }
        });
        if (cancelWindowByCurrency.size > 0)
          this.setState({ sellCancelWindowByCurrency: cancelWindowByCurrency });
      })
      .catch((error) => {
        //////console.log(error);
      });
  }

  componentWillUnmount() {
    if (this.state.socket !== undefined && this.state.socket !== null) {
      this.state.socket.close();
    }
  }

  makeTableData = (operations) => {
    var operationsTable = [];
    for (let i = 0; i < operations.length; i++) {
      let operation = operations[i];
      let operationTable = {};
      operationTable.operationId = operation.id;
      operationTable.timestamp = operation.timestamp;
      operationTable.btc = (operation.amount / operation.price)
        .toLocaleString("en-US", {
          maximumFractionDigits: 8,
        })
        .toString();
      operationTable.amount = operation.amount;
      operationTable.currency = operation.currency;
      operationTable.operationStatus = operation.otcOperationStatus;
      operationTable.actions = "";
      if (operation.currency !== "ETH") {
        operationTable.flag = currency.currencies.filter((currency) => {
          return operation.currency === currency.alias;
        })[0].flag;
      } else {
        operationTable.src = currency.currencies.filter((currency) => {
          return operation.currency === currency.alias;
        })[0].img;
      }
      operationsTable.push(operationTable);
    }
    operationsTable.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
    this.setState({ transactionTable: operationsTable });
  };
  getReviewPerOperation(operationId) {
    otcAPI
      .getReviewPerOperation(operationId)
      .then((resp) => {
        Object.entries(resp.data).forEach(([key, value]) => {
          if (key === "starsQuantity") {
            this.setState({ ratingQualify: value });
          }
        });
        //console.log("ratingQualify dentro del getReviewporOperation:", this.state.ratingQualify)
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  handleShowOperationSell(idOperation) {
    this.setState({
      ratingQualify: 0,
      instructionMessage: "",
    });

    otcAPI.getOperation(idOperation).then((res) => {
      //console.log("dentro del showOperationSell")

      this.getReviewPerOperation(idOperation);
      //  this.state.messageTerminsAndConditions = [];
      // this.state.listItemHistorial = [];
      // this.state.popupVariable = [];
      let array = [];
      let messageInstructionsLanguage = [];
      //  ////console.log(res.data);
      this.setState({
        messageTerminsAndConditions: [],
        listItemHistorial: [],
        popupVariable: [],
        currencySell: res.data.currency,
        ticket: res.data.id,
        hour: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
        dateOperation: res.data.timestamp.split("T")[0],

        amountFiat: res.data.amount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }),
        comissionSell: "",
        taseVat: "",
        tax: 0,
        currencyComission: "",
        currencyVat: "",
        messageByStatusOperation: "",
        allMessageInstructions: [],
      });

      if (res.data.dollarBTCPayment !== undefined) {
        if (res.data.dollarBTCPayment.messages !== undefined) {
          Object.entries(res.data.dollarBTCPayment.messages).forEach(
            ([keyMess, valueMess]) => {
              if (
                keyMess.includes("SELL") &&
                keyMess.includes("INSTRUCTIONS") &&
                keyMess.includes(res.data.otcOperationStatus)
              ) {
                let messageBody = {
                  language: keyMess.split("__")[3].toLowerCase(),
                  message: valueMess,
                };
                if (
                  keyMess.split("__")[3].toLowerCase() === this.props.language
                ) {
                  this.setState({ messageByStatusOperation: valueMess });
                }
                messageInstructionsLanguage.push(messageBody);
              }
            }
          );
        }
      }
      if (messageInstructionsLanguage.length > 0) {
        this.setState({ allMessageInstructions: messageInstructionsLanguage });
      }
      array.push({
        label: this.state.translator("sell.mySells.bill.ticket"),
        value: res.data.id,
      });
      array.push({
        label: this.state.translator("sell.mySells.bill.time"),
        value: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
      });
      array.push({
        label: this.state.translator("sell.mySells.bill.date"),
        value: res.data.timestamp.split("T")[0],
      });
      array.push({
        label:
          this.state.translator("sell.mySells.bill.amountIn") +
          res.data.currency,
        value: res.data.amount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }),
      });

      this.validateCancelWindow();
      if (res.data.clientPayment !== undefined) {
        if (res.data.clientPayment.type !== "TRANSFER_TO_CRYPTO_WALLET") {
          array.push({
            label: this.state.translator("sell.mySells.bill.amountBTC"),
            value: (res.data.amount / res.data.price).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            }),
          });
          array.push({
            label: this.state.translator("sell.mySells.bill.appliedRate"),
            value: res.data.price.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            }),
          });
          // array.push({
          //   label: this.state.translator("sell.mySells.bill.tax"),
          //   value: 0
          // });
          this.setState({
            amountBTC: (res.data.amount / res.data.price).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 8,
              }
            ),
            price: res.data.price.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            }),
            isCrypto: false,
            bankRate: 0,

            issuingBank:
              res.data.clientPayment !== undefined
                ? res.data.clientPayment.bank
                : "",
            nameOfThePayer:
              res.data.dollarBTCPayment !== undefined &&
              res.data.dollarBTCPayment !== null &&
              res.data.dollarBTCPayment.accountHolderName !== undefined
                ? res.data.dollarBTCPayment.accountHolderName
                : "",
            bankDollarBTC:
              res.data.dollarBTCPayment !== undefined &&
              res.data.dollarBTCPayment !== null &&
              res.data.dollarBTCPayment.bank !== undefined
                ? res.data.dollarBTCPayment.bank
                : "",
          });
          // array.push({
          //   label: this.state.translator("sell.mySells.bill.bankRate"),
          //   value: 0
          // });
          array.push({
            label: this.state.translator("sell.mySells.bill.issuingBank"),
            value:
              res.data.dollarBTCPayment !== undefined &&
              res.data.dollarBTCPayment !== null &&
              res.data.dollarBTCPayment.bank !== undefined
                ? res.data.dollarBTCPayment.bank
                : "",
          });
          array.push({
            label: this.state.translator("sell.mySells.bill.namePayer"),
            value:
              res.data.dollarBTCPayment !== undefined &&
              res.data.dollarBTCPayment !== null &&
              res.data.dollarBTCPayment.accountHolderName !== undefined
                ? res.data.dollarBTCPayment.accountHolderName
                : "",
          });
          array.push({
            label: this.state.translator("sell.mySells.bill.receivingBank"),
            value:
              res.data.clientPayment !== undefined
                ? res.data.clientPayment.bank
                : "",
          });
          if (res.data.dollarBTCPayment !== undefined) {
            if (res.data.dollarBTCPayment.messages !== undefined) {
              if (
                res.data.dollarBTCPayment.messages.SELL__INSTRUCTIONS !==
                undefined
              ) {
                if (
                  res.data.dollarBTCPayment.messages.SELL__INSTRUCTIONS !== ""
                ) {
                  this.setState({
                    instructionMessage:
                      res.data.dollarBTCPayment.messages.SELL__INSTRUCTIONS,
                  });
                }
              }
            }
          }
          if (res.data.charges !== undefined) {
            Object.entries(res.data.charges).forEach(
              ([chargeKey, chargeValue]) => {
                if (chargeKey === "COMMISSION") {
                  array.push({
                    label: this.state.translator(
                      "dynamicForm.labels.commission"
                    ),
                    value: chargeValue.amount + " " + chargeValue.currency,
                  });
                  this.setState({
                    comissionSell: chargeValue.amount,
                    currencyComission: chargeValue.currency,
                  });
                }
                if (chargeKey === "VAT") {
                  array.push({
                    label: this.state.translator("dynamicForm.labels.vat"),
                    value: chargeValue.amount + " " + chargeValue.currency,
                  });
                  this.setState({
                    taseVat: chargeValue.amount,
                    currencyVat: chargeValue.currency,
                  });
                }
              }
            );
          }
          this.setState({ dataToPdf: array }, () => this.activeAutoScrollUp());
        } else {
          this.setState({
            isCrypto: true,
            amountBTC: (res.data.amount * res.data.price).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 8,
              }
            ),
            price: res.data.price,
          });
          array.push({
            label: this.state.translator("sell.mySells.bill.amountBTC"),
            value: (res.data.amount * res.data.price).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            }),
          });
          array.push({
            label: this.state.translator("sell.mySells.bill.appliedRate"),
            value: res.data.price.toLocaleString("en-US", {
              maximumFractionDigits: 8,
            }),
          });
          if (res.data.charges !== undefined) {
            Object.entries(res.data.charges).forEach(
              ([chargeKey, chargeValue]) => {
                if (chargeKey === "COMMISSION") {
                  array.push({
                    label: this.state.translator(
                      "dynamicForm.labels.commission"
                    ),
                    value: chargeValue.amount + " " + chargeValue.currency,
                  });
                  this.setState({
                    comissionSell: chargeValue.amount,
                    currencyComission: chargeValue.currency,
                  });
                }
                if (chargeKey === "VAT") {
                  array.push({
                    label: this.state.translator("dynamicForm.labels.vat"),
                    value: chargeValue.amount + " " + chargeValue.currency,
                  });
                  this.setState({
                    taseVat: chargeValue.amount,
                    currencyVat: chargeValue.currency,
                  });
                }
              }
            );
          }
          this.setState({ dataToPdf: array }, () => this.activeAutoScrollUp());
        }
      }
      let arrayItem = [];
      Object.entries(res.data.clientPayment).forEach(([key, val]) => {
        ////////console.log('key :',key,"value :",val);
        if (
          key !== "id" &&
          key !== "messages" &&
          key !== "type" &&
          key !== "active" &&
          key !== "acceptIn" &&
          key !== "acceptOut" &&
          key !== "joinField" &&
          key !== "automaticCharge" &&
          key !== "currency" &&
          key !== "accountStatus" &&
          key !== "accountCurrency" &&
          key !== "accountBalance" &&
          key !== "automatic" &&
          key !== "verified" &&
          key !== "sendToPayments" &&
          key !== "buyBalance" &&
          key !== "mcVerified"
        ) {
          arrayItem.push([key, val]);
          //this.state.listItemHistorial.push(<div key={key}>{val}</div>);
          //let v = this.state.labelsClientPayment.get(key) + ":" + "      " + val;
        }
      });
      if (res.data.description === "") {
        arrayItem.push([
          "description",
          "dynamicForm.labels.descriptionContent",
        ]);
      } else {
        arrayItem.push(["description", res.data.description]);
      }
      let keys = Object.keys(res.data);

      if (keys.indexOf("charges") !== -1) {
        Object.entries(res.data.charges).forEach(([keyCharges, valCharges]) => {
          if (keyCharges === "COMMISSION") {
            arrayItem.push([
              "commission",
              valCharges.amount + " " + valCharges.currency,
            ]);
          }
          if (keyCharges === "VAT") {
            arrayItem.push([
              "vat",
              valCharges.amount + " " + valCharges.currency,
            ]);
          }
        });
      }
      this.setState({
        listItemHistorial: arrayItem,
      });

      if (
        res.data.clientPayment.messages !== null &&
        res.data.clientPayment.messages !== undefined
      ) {
        Object.entries(res.data.clientPayment.messages).forEach(
          ([key, value]) => {
            if (value !== "") {
              this.setState({
                messageTerminsAndConditions: [
                  ...this.state.messageTerminsAndConditions,
                  <Message
                    key={key}
                    color={key.split("_")[1].toLowerCase()}
                    content={
                      value.substring(0, 1) + value.toLowerCase().substring(1)
                    }
                    className="padding-top-message"
                    size="tiny"
                  />,
                ],
              });

              /* this.state.messageTerminsAndConditions.push(
                <Message
                  key={key}
                  color={key.split("_")[1].toLowerCase()}
                  content={
                    value.substring(0, 1) + value.toLowerCase().substring(1)
                  }
                  className="padding-top-message"
                  size="tiny"
                />
              );*/
            }
          }
        );
      }
      this.setState({
        paymentType: this.state.constantPaymentsTypes[
          res.data.clientPayment.type
        ],
        paymentTypeKey: res.data.clientPayment.type,
      });
      this.closeConexionSocket();
      this.openSocket(idOperation);
      ////////console.log(
      // "this.state.listPayments.has(res.data.clientPayment.type) ",
      // this.state.constantPaymentsTypes.has(res.data.clientPayment.type)
      //);
      if (this.state.constantPaymentsTypes.has(res.data.clientPayment.type)) {
        this.setState({
          idOperationSelected: idOperation,
          messagesForClient: res.data.clientPayment.messages,
          bank: res.data.clientPayment.bank,
          accountNumber: res.data.clientPayment.accountNumber,
          accountHolder: res.data.clientPayment.accountHolder,
          holderId: res.data.clientPayment.holderId,
          operationStatusNow: res.data.otcOperationStatus,
        });
      } else {
        this.setState({
          idOperationSelected: idOperation,
          messagesForClient: res.data.clientPayment.messages,
          userEmail: res.data.clientPayment.userEmail,
          username: res.data.clientPayment.userName,
          operationStatusNow: res.data.otcOperationStatus,
        });
      }
    });
  }
  activeAutoScrollUp() {
    window.scrollBy(0, -3000);
  }
  reconnectSocket(operationId) {
    let ws = window.sessionStorage.getItem("sellOperationSocketId");
    ////////console.log("en el reconnect ", ws);
    this.socketReady(operationId, ws);
  }
  async getOperationsAttachment(operationId, fileName) {
    let result, type;
    try {
      const response = await attachments.getOtcAttachment(
        operationId,
        fileName
      );
      if (fileName.includes("pdf")) {
        type = "application/pdf";
      } else if (fileName.includes("jpg") || fileName.includes("jpeg")) {
        type = "image/jpg";
      } else if (fileName.includes("png")) {
        type = "image/png";
      } else {
        type = "";
      }
      let blob = new Blob([response.data], {
        type: type !== "" ? type : response.headers["content-type"],
      });
      let image = URL.createObjectURL(blob);
      result = image;
    } catch (error) {
      result = "";
    }
    return result;
  }
  openSocket = (operationId) => {
    this.setState({
      socket: new Sockette(URL_WEBSOCKET_DBTC + "/otc", {
        onopen: (e) =>
          this.socketReady(
            operationId,
            window.sessionStorage.getItem("sellOperationSocketId")
          ),
        onmessage: (e) => this.handleValueMessageSell(e.data, operationId),
        onreconnect: (e) => this.reconnectSocket(operationId),
      }),
    });
  };
  openSocketStatus() {
    this.setState({
      socketStatus: new Sockette(URL_WEBSOCKET_DBTC + "/otc", {
        onopen: (e) => {
          this.socketReadyStatus(
            e,
            window.sessionStorage.getItem("sellOperationSocketId")
          );
        },
        onmessage: (e) => {
          this.handleStatus(e.data);
        },
      }),
    });
  }

  socketReadyStatus(e, webSocketId) {
    let wsId = null;
    if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
      window.sessionStorage.setItem("sellOperationSocketId", wsId);
    } else {
      wsId = webSocketId;
    }
    let st = {
      method: "getOperationChangeStatuses",
      params: {
        userName: user.getUserName(),
        websocketKey: webSocketId,
      },
    };
    if (this.state.socketStatus !== null) {
      try {
        this.state.socketStatus.json(st);
      } catch (e) {}
    }
  }
  handleStatus(res) {
    // //////console.log(res)
    let result = JSON.parse(res);
    if (result !== undefined) {
      //   //////console.log(result)
      for (let i = 0; i < result.params.data.length; i++) {
        var statusAdd = result.params.data[i];
        this.setState((state) => {
          const transactionTable = state.transactionTable.map((item) => {
            if (item.operationId === statusAdd.id) {
              item.operationStatus = statusAdd.otcOperationStatus;
              return item;
            } else {
              return item;
            }
          });
          return transactionTable;
        });
        if (this.state.idOperationSelected === statusAdd.id) {
          this.setState({
            operationStatusNow: statusAdd.otcOperationStatus,
          });
        }
      }
      // //////console.log(this.state.transactionTable);
    }
  }
  closeConexionSocket() {
    if (this.state.socket !== null && this.state.socket !== undefined) {
      this.state.socket.close();
      this.setState({
        contactMessages: [],
        selectedFile: null,
      });
    }
    window.sessionStorage.setItem("sellOperationSocketId", "");
  }

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

  socketReady(idOperation, webSocketId) {
    //llamar de nuevo cuando seleccione otra operación
    let wsId = null;
    if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
      window.sessionStorage.setItem("sellOperationSocketId", wsId);
    } else {
      ////////console.log("estoy en el else del connect: ", webSocketId);
      wsId = webSocketId;
    }
    let body = {
      method: "getOperationMessages",
      params: {
        id: idOperation,
        side: "User",
        websocketKey: wsId,
      },
    };
    if (this.state.socket !== null) {
      try {
        this.state.socket.json(body);
      } catch (e) {}
    }
  }

  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };

  blankErrors(label) {
    if (label === "messageWithoutText") {
      setTimeout(() => {
        this.setState({ messageWithoutText: false, message: "" });
      }, 5000);
    }
  }

  handleSendMessage() {
    if (this.state.textMessageNew === "" && this.state.selectedFile === null) {
      this.setState({
        messageWithoutText: true,
        message: "sell.mySells.errors.requiredField",
      });
      this.blankErrors("messageWithoutText");
    } else if (
      this.state.selectedFile !== null &&
      typeof this.state.selectedFile.name !== "undefined"
    ) {
      let formData = new FormData();
      formData.append("attachment", this.state.selectedFile);
      formData.append("userName", window.sessionStorage.getItem("username"));
      formData.append("id", this.state.idOperationSelected);
      formData.append("message", this.state.textMessageNew);
      formData.append("operationMessageSide", "USER");
      otcAPI.addPostOperationMessageWithFile(formData);
    } else {
      let formData = new FormData();
      formData.append("userName", window.sessionStorage.getItem("username"));
      formData.append("id", this.state.idOperationSelected);
      formData.append("message", this.state.textMessageNew);
      formData.append("operationMessageSide", "USER");
      otcAPI.addPostOperationMessageWithFile(formData);
    }
    this.setState({
      textMessageNew: "",
    });
    this.deleteFile();
  }

  getTrProps = (state, rowInfo) => {
    if (rowInfo && rowInfo.row) {
      return {
        onClick: (e) => {
          this.setState({
            selected: rowInfo.index,
          });
        },
        style: {
          background:
            rowInfo.index === this.state.selected ? "rgba(0,0,0,.07)" : "white",
          color: rowInfo.index === this.state.selected ? "black" : "black",
        },
      };
    } else {
      return {};
    }
  };

  handleClick(e, titleProps) {
    this.setState({ activeIndexOne: !this.state.activeIndexOne });
  }
  handleClickTwo(e, titleProps) {
    this.setState({ activeIndexTwo: !this.state.activeIndexTwo });
  }
  handleClickThree(e, titleProps) {
    this.setState({ activeIndexThree: !this.state.activeIndexThree });
  }

  fileChangedHandler(file) {
    if (file !== undefined && file.length > 0) {
      if (file[0].extension !== "pdf") {
        if (file[0].size > 500000) {
          var object = {
            img: file[0].preview.url,
            name: file[0].name,
            type: file[0].type,
            extension: file[0].extension,
            key: "identityURL",
            file: file[0],
          };
          let ex = String(file[0].extension);
          this.setState({ loadingNewFile: true });
          this.newresice(
            file[0],
            ex.toLocaleUpperCase(),
            "selectedFile",
            object
          );
          this.setState({
            addFile: false,
            fileName: file[0].name,
          });
        } else {
          this.setState({ loadingNewFile: true });
          this.setState({
            selectedFile: file[0],
            addFile: false,
            fileName: file[0].name,
          });
        }
      } else {
        this.setState({ loadingNewFile: true });
        this.setState({
          selectedFile: file[0],
          addFile: false,
          fileName: file[0].name,
        });
      }
    }
  }
  deleteFile() {
    this.selfRef.current.removeFiles();
    this.setState({ selectedFile: {}, addFile: true, fileName: "" });
  }
  handleDismiss() {
    this.setState({ viewMessage: false });
  }
  fileChangedHandlerError(error) {
    if (error.code === 1) {
      this.setState({
        messageErrorAdjuntar: true,
        message: "sell.mySells.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    } else {
      this.setState({
        messageErrorAdjuntar: true,
        message: "sell.mySells.errors.exceededSize",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
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

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  notifyClaim() {
    var body = {
      id: this.state.idOperationSelected,
      otcOperationStatus: "CLAIM",
      paymentId: null,
      userChange: true,
    };
    otcAPI
      .changeOperationStatus(body)
      .then((res) => {
        if (res.data === "OK") {
          this.setState({ viewMessage: true, operationStatusNow: "CLAIM" });
          this.getSellFromUser(null);
          setTimeout(() => {
            this.setState({ viewMessage: false });
          }, 8000);
        }
      })
      .catch((error) => {
        //////console.log(error);
      });
  }

  printInvoice() {
    let doc = new jsPDF();

    doc.addFont("Montserrat");
    doc.setFontSize(20);
    doc.text(60, 20, this.state.translator("sell.mySells.bill.pdfHeader"));
    let x = 20,
      y = 40;
    doc.setFontSize(12);
    for (let data of this.state.dataToPdf) {
      doc.text(data.label + ":" + " " + data.value, x, y);
      y = y + 10;
    }
    //  doc.addImage(ima, "PNG", 10, 40, 180, 180);
    doc.save("Factura.pdf");
  }
  handleShowTermAndCondicionModal() {
    this.setState({ showModalTerm: true });
  }
  handleCloseModalTerm() {
    this.setState({ showModalTerm: false });
  }
  formatTime(timeValue, format) {
    var fmt = format.toUpperCase();
    var re = /^(H|HH)(:MM)(:SS)?( AM)?$/;
    if (!re.test(fmt)) {
      fmt = "H:MM AM";
    }
    var MM = "0" + timeValue.getMinutes();
    MM = MM.substring(MM.length - 2, MM.length);
    var SS = "0" + timeValue.getSeconds();
    SS = SS.substring(SS.length - 2, SS.length);
    var H = "" + timeValue.getHours();
    var HH = "0" + H;
    HH = HH.substring(HH.length - 2, HH.length);
    var meridian = "";
    if (fmt.indexOf(" AM") !== -1) {
      meridian = "AM";
      if (HH === "00") {
        HH = "12";
      }
      if (HH === "12") {
        meridian = "PM";
      }
      if (parseInt(HH, 10) > 12) {
        meridian = "PM";
        var hrs = parseInt(HH, 10) - 12;
        H = "" + hrs;
        HH = "0" + H;
        HH = HH.substring(HH.length - 2, HH.length);
      }
    }

    var result = "";
    if (fmt.indexOf("HH") === -1) {
      result += H + ":" + MM;
    } else {
      result += HH + ":" + MM;
    }
    if (fmt.indexOf("SS") !== -1) {
      result += ":" + SS;
    }
    if (fmt.indexOf(" AM") !== -1) {
      result += " " + meridian;
    }
    return result;
  }
  newresice(file, type, target, ob) {
    Resizer.imageFileResizer(
      file,
      1024,
      678,
      type,
      70,
      0,
      (uri) => {
        var end = new File([uri], ob.name, {
          type: ob.type,
          lastModified: Date.now(),
        });
        ob.file = end;
        this.setState({ [target]: ob.file });
        //  //////console.log(uri, ob);
      },
      "blob"
    );
  }

  openModalCancelSell() {
    this.setState({
      showModalCancelSell: true,
    });
  }
  closeModalCancelSell() {
    this.setState({
      showModalCancelSell: false,
    });
  }
  cancelSell() {
    this.setState({
      loadingCancelSell: true,
    });
    let body = {
      id: this.state.idOperationSelected,
      otcOperationStatus: "CANCELED",
      paymentId: null,
      userChange: true,
    };
    otcAPI
      .changeOperationStatus(body)
      .then((res) => {
        if (res.data === "OK") {
          this.setState({
            resultCancelMessage: true,
            operationStatusNow: "CANCELED",
            loadingCancelSell: true,
            message: "sell.mySells.modalCancel.successCancelSell",
          });
          this.getSellFromUser(null);
        } else {
          this.setState({
            resultCancelMessage: true,
            message: "sell.mySells.errors.failCancelSell",
            loadingCancelSell: true,
          });
        }
        setTimeout(() => {
          this.setState({
            resultCancelMessage: false,
            showModalCancelSell: false,
            loadingCancelSell: false,
            message: "",
          });
        }, 6000);
      })
      .catch((error) => {
        //////console.log(error);
        this.setState({
          resultCancelMessage: true,
          message: "sell.mySells.errors.failCancelSell",
          loadingCancelSell: true,
        });
        setTimeout(() => {
          this.setState({
            resultCancelMessage: false,
            showModalCancelSell: false,
            loadingCancelSell: false,
            message: "",
          });
        }, 6000);
      });
  }

  validateCancelWindow() {
    let window = this.state.sellCancelWindowByCurrency.has(
      this.state.currencySell
    )
      ? this.state.sellCancelWindowByCurrency.get(this.state.currencySell)
      : "";
    if (window !== undefined) {
      if (window !== "") {
        let creationDate = new Date(this.state.hour);
        let expirationDate = new Date();
        expirationDate.setDate(creationDate + window);
        let now = new Date();
        if (expirationDate.getTime() < now.getTime()) {
          this.setState({ showCancellationButton: true });
        }
      }
    }
  }
  render() {
    let t = this.state.translator;
    // let textTerm = Object.keys(term.ters).map((value, index) => (
    //   <p key={index}>{t("sell.mySells.terms." + value)}</p>
    // ));
    let labelMessageWithoutText,
      labelResultCancel,
      messageFailReview,
      messageSuccessReview;
    //labelMessageErrorAdjunto,
    //  labelRules,

    /* if (
      this.state.messagesForClient !== null &&
      typeof this.state.messagesForClient !== undefined
    ) {
      //No se usa
      labelRules = (
        <Message
          negative
          content={
            this.state.messagesForClient.ALERT_RED ===
            "OPERATION MUST BE COMPLETED IN 90 MINUTES."
              ? "La operación debe ser completada en 90 minutos."
              : this.state.messagesForClient.ALERT_RED ===
                "OPERATION FROM DIFFERENT BANK MUST BE COMPLETED IN 72 HOURS."
              ? "La operación de diferentes bancos sera completada en 72 horas."
              : this.state.messagesForClient.ALERT_RED
          }
        />
      );
    }*/
    if (this.state.reviewSuccess) {
      messageSuccessReview = (
        <Message
          positive
          content={t("buy.history.modalQualify.messageSuccess")}
        />
      );
    }
    if (this.state.reviewFail) {
      messageFailReview = (
        <Message
          negative
          content={t("buy.history.modalQualify.messageError")}
        />
      );
    }
    if (this.state.messageWithoutText) {
      labelMessageWithoutText = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }
    /* if (this.state.messageErrorAdjuntar) {
      labelMessageErrorAdjunto = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }*/
    if (this.state.resultCancelMessage) {
      labelResultCancel = (
        <Message
          basic
          color={
            this.state.message.includes("successCancelSell") ? "green" : "red"
          }
        >
          {t(this.state.message)}
        </Message>
      );
    }
    let statusLabel = (status) => {
      if (status === "STARTED") {
        let value = t("sell.mySells.tableHeaders.statusValues.started");
        return (
          <Label size="mini" color="yellow">
            <Icon name="check circle" />
            {value}
          </Label>
        );
      } else if (status === "SUCCESS") {
        let value = t("sell.mySells.tableHeaders.statusValues.success");
        return (
          <Label size="mini" color="green">
            <Icon name="check circle" />
            {value}
          </Label>
        );
      } else if (status === "WAITING_FOR_PAYMENT") {
        let value = t("sell.mySells.tableHeaders.statusValues.waitingPayment");
        return (
          <Label size="mini" color="blue">
            <Icon name="sync" loading />
            {value}
          </Label>
        );
      } else if (status === "CANCELED") {
        let value = t("sell.mySells.tableHeaders.statusValues.canceled");
        return (
          <Label size="mini" color="red">
            <Icon name="warning circle" />
            {value}
          </Label>
        );
      } else if (status === "PAID") {
        let value = t("sell.mySells.tableHeaders.statusValues.paid");
        return (
          <Label size="mini" color="orange">
            <Icon name="info" />
            {value}
          </Label>
        );
      } else if (status === "CLAIM") {
        let value = t("sell.mySells.tableHeaders.statusValues.claim");
        return (
          <Label size="mini" color="grey">
            <Icon name="info" />
            {value}
          </Label>
        );
      } else if (status === "WAITING_TO_START_OPERATION") {
        let value = t(
          "sell.mySells.tableHeaders.statusValues.waitingToStartOperation"
        );
        return (
          <Label size="mini" color="purple">
            <Icon name="wait" />
            {value}
          </Label>
        );
      } else if (status === "WAITING_FOR_RECEIVER_CONFIRMATION") {
        let value = t(
          "sell.mySells.tableHeaders.statusValues.waitingConfirmation"
        );
        return (
          <Label size="mini" color="teal">
            <Icon name="info" />
            {value}
          </Label>
        );
      } else {
        return (
          <Label size="mini" color="grey">
            <Icon name="info" />
            {status}
          </Label>
        );
      }
    };
    const popupValues = [];
    const listDetailsOperation = [];
    this.state.listItemHistorial.forEach(([key, val]) => {
      if (key === "description") {
        val = t(val);
      }
      popupValues.push(
        <span key={key}>
          <b>{t("dynamicForm.labels." + key)}</b>
          {":" + "      " + val}
          <br />
        </span>
      );

      // let size = v.length;
      // if (size > 45 || window.innerWidth < 400) {
      //   v = v.substring(0, 45);
      //   v = v + "...";
      //   listDetailsOperation.push(
      //     <span key={key}>
      //       {v}
      //       <br />
      //     </span>
      //   );
      // } else {
      listDetailsOperation.push(
        <span key={key}>
          <b>{t("dynamicForm.labels." + key)}</b>
          {":" + "      " + val}
          <br />
        </span>
      );
      // }
    });
    const data = this.state.transactionTable;
    const transactionTableHeaders = [
      {
        Header: t("sell.mySells.tableHeaders.id"),
        accessor: "operationId",
        minWidth: 55,
        Cell: (row) => {
          return row.value.substring(row.value.length - 4, row.value.length);
        },
      },
      {
        Header: t("sell.mySells.tableHeaders.date"),
        accessor: "timestamp",
        minWidth: 110,
        width: 160,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: t("sell.mySells.tableHeaders.btc"),
        accessor: "btc",
        width: 95,
        Cell: (row) => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          });
        },
      },
      {
        Header: t("sell.mySells.tableHeaders.amount"),
        accessor: "amount",
        Cell: (row) => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          });
        },
      },
      {
        Header: t("sell.mySells.tableHeaders.coin"),
        accessor: "currency",
        minWidth: 70,
        Cell: (row) => (
          <div>
            {row.value !== "ETH" && <Flag name={row.original.flag} />}
            {row.value === "ETH" && (
              <Image src={row.original.src} className={"iconEth"} />
            )}
            {row.value}
          </div>
        ),
      },
      {
        Header: t("sell.mySells.tableHeaders.status"),
        accessor: "operationStatus",
        minWidth: 110,
        Cell: (row) => {
          return statusLabel(row.value);
        },
      },
      {
        Header: "",
        accessor: "actions",
        filterable: false,
        width: 50,
        Cell: (row) => (
          <div>
            <Button
              icon="zoom-in"
              size={"tiny"}
              onClick={() =>
                this.handleShowOperationSell(row.original.operationId)
              }
            />
          </div>
        ),
      },
    ];
    const transactionTableHeadersMobile = [
      {
        Header: "",
        accessor: "currency",
        minWidth: 15,
        Cell: (row) => (
          <div>
            {row.value !== "ETH" && <Flag name={row.original.flag} />}
            {row.value === "ETH" && (
              <Image src={row.original.src} className={"iconEth"} />
            )}
          </div>
        ),
      },
      {
        Header: t("sell.mySells.tableHeaders.date"),
        accessor: "timestamp",
        show: false,
      },
      {
        Header: t("sell.mySells.tableHeaders.transactions"),
        accessor: "actions",
        Cell: (row) => (
          <div>
            <List>
              <List.Item
                onClick={() =>
                  this.handleShowOperationSell(row.original.operationId)
                }
              >
                <List.Header>
                  <small>
                    {row.original.operationId.substring(
                      row.original.operationId.length - 4,
                      row.original.operationId.length
                    ) +
                      ", " +
                      this.formatDate(new Date(row.original.timestamp))}
                  </small>
                </List.Header>
                <List.Content floated="left" verticalAlign="middle">
                  <small>
                    {row.original.btc.toLocaleString("en-US", {
                      maximumFractionDigits: 8,
                    })}
                    {" BTC"}
                    {" - "}
                    {row.original.amount.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {row.original.currency}
                  </small>
                </List.Content>
              </List.Item>
            </List>
          </div>
        ),
      },
      {
        Header: t("sell.mySells.tableHeaders.status"),
        accessor: "operationStatus",
        minWidth: 40,
        Cell: (row) => {
          return statusLabel(row.value);
        },
      },
    ];
    return (
      <div>
        {!this.state.isAuth && (
          <Header as="h5" textAlign="center">
            {t("sell.notAuth.part1")}{" "}
            <Link
              to="/login"
              name="login"
              onClick={this.handleItemOther.bind(this)}
            >
              {t("sell.notAuth.part2")}
            </Link>{" "}
            {t("sell.notAuth.part3")}{" "}
            <Link
              to="/registration"
              name="registration"
              onClick={this.handleItemOther.bind(this)}
            >
              {t("sell.notAuth.part4")}
            </Link>
            {t("sell.notAuth.part5")}
          </Header>
        )}
        {this.state.isAuth && (
          <Container textAlign="justified" className="">
            {!this.state.tableReady && (
              <Dimmer active inverted>
                <Loader inverted>{t("sell.loading")}</Loader>
              </Dimmer>
            )}

            {this.state.tableReady && (
              <Grid>
                {this.state.messageByStatusOperation !== "" && (
                  <Grid.Row columns={1} only="computer">
                    <br />
                    <Grid.Column>
                      <Message
                        info
                        content={this.state.messageByStatusOperation}
                      />
                    </Grid.Column>
                  </Grid.Row>
                )}
                <Grid.Row>
                  <Grid.Column
                    largeScreen={this.state.ceroOperations ? 16 : 10}
                    tablet={16}
                    mobile={16}
                    computer={10}
                    widescreen={this.state.ceroOperations ? 16 : 10}
                  >
                    {isMobile && (
                      <div style={{ marginTop: 30 }}>
                        {sessionStorage.getItem("auth") === "false" && (
                          <div>
                            {" "}
                            <Divider hidden></Divider>
                            <Divider hidden></Divider>
                          </div>
                        )}
                        {sessionStorage.getItem("auth") !== "true" && (
                          <div>
                            <Header
                              as="h4"
                              textAlign="center"
                              className="titleComponent"
                              style={{ fontWeight: "bold" }}
                            >
                              {t("sell.menu.mySells")}
                            </Header>
                            <Divider
                              style={{ marginTop: -10, borderColor: "#207ef2" }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {this.state.instructionMessage !== "" && (
                      <Grid.Row columns={1} only="computer">
                        <br />
                        <Grid.Column>
                          <Message
                            info
                            content={this.state.instructionMessage}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    )}
                    <ReactTable
                      className="transactionTable"
                      data={data}
                      columns={
                        isMobile
                          ? transactionTableHeadersMobile
                          : transactionTableHeaders
                      }
                      defaultPageSize={isMobile ? 6 : 8}
                      previousText={
                        isMobile ? "<" : t("sell.mySells.table.previous")
                      }
                      nextText={isMobile ? ">" : t("sell.mySells.table.next")}
                      loadingText={t("sell.mySells.table.loading")}
                      noDataText={t("sell.mySells.table.noData")}
                      pageText={t("sell.mySells.table.page")}
                      ofText={t("sell.mySells.table.of")}
                      rowsText={t("sell.mySells.table.rows")}
                      pageJumpText={t("sell.mySells.table.pageJump")}
                      rowsSelectorText={t("sell.mySells.table.rowsSelector")}
                      minRow={isMobile ? 6 : 8}
                      getTrProps={this.getTrProps}
                    />
                  </Grid.Column>
                  <Grid.Column
                    mobile={16}
                    largeScreen={this.state.ceroOperations ? 0 : 6}
                    tablet={16}
                    computer={this.state.ceroOperations ? 0 : 6}
                    widescreen={this.state.ceroOperations ? 0 : 6}
                  >
                    <div hidden={this.state.ceroOperations}>
                      <Container>
                        {!isMobile && (
                          <Segment
                            color={isMobile === false ? "orange" : ""}
                            basic={isMobile}
                          >
                            <Container>
                              <Form>
                                <Accordion
                                  fluid
                                  styled
                                  exclusive={false}
                                  style={
                                    isMobile === true
                                      ? { backgroundColor: "whitesmoke" }
                                      : {}
                                  }
                                >
                                  <Accordion.Title
                                    style={
                                      isMobile === true
                                        ? { color: "black" }
                                        : {}
                                    }
                                    active={this.state.activeIndexOne}
                                    index={0}
                                    onClick={this.handleClick.bind(this)}
                                  >
                                    <Icon name="dropdown" />
                                    {t("sell.mySells.accordion.details")}
                                  </Accordion.Title>
                                  <Accordion.Content
                                    active={this.state.activeIndexOne}
                                  >
                                    <Grid>
                                      <Grid.Row
                                        columns={2}
                                        verticalAlign="middle"
                                      >
                                        <Grid.Column>
                                          <label>
                                            {t(
                                              "sell.mySells.accordion.operation"
                                            )}{" "}
                                            #:{" "}
                                            <strong>
                                              {this.state.idOperationSelected.slice(
                                                -4
                                              )}
                                            </strong>
                                          </label>
                                        </Grid.Column>
                                        <Grid.Column textAlign="right">
                                          {this.state.operationStatusNow ===
                                            "SUCCESS" && (
                                            <Popup
                                              trigger={
                                                <Rating
                                                  disabled={
                                                    this.state.ratingQualify > 0
                                                  }
                                                  icon="star"
                                                  rating={
                                                    this.state.ratingQualify
                                                  }
                                                  maxRating={5}
                                                  onRate={this.handleRate.bind(
                                                    this
                                                  )}
                                                />
                                              }
                                              content={t(
                                                "buy.history.accordion.qualify"
                                              )}
                                            />
                                          )}
                                        </Grid.Column>
                                      </Grid.Row>
                                    </Grid>

                                    <div>
                                      <label className="ui compact">
                                        {this.state.paymentType}
                                      </label>
                                    </div>
                                    {/* <Message info>
                                    {this.state.listItemHistorial}
                                  </Message> */}
                                    <Popup
                                      trigger={
                                        <span>
                                          <Message info size={"small"}>
                                            {listDetailsOperation}
                                          </Message>
                                        </span>
                                      }
                                      content={popupValues}
                                      position="top center"
                                      size="small"
                                      wide
                                    />
                                  </Accordion.Content>
                                  <Accordion.Title
                                    active={this.state.activeIndexTwo}
                                    index={1}
                                    onClick={this.handleClickTwo.bind(this)}
                                  >
                                    <Icon name="dropdown" />
                                    {t("sell.mySells.accordion.terms")}
                                  </Accordion.Title>
                                  <Accordion.Content
                                    active={this.state.activeIndexTwo}
                                  >
                                    <Message info size="small">
                                      {" "}
                                      {term.ters.item1.slice(0, 25)}
                                      <a
                                        className="linkVerMas"
                                        onClick={this.handleShowTermAndCondicionModal.bind(
                                          this
                                        )}
                                      >
                                        {t("sell.mySells.accordion.seeMore")}
                                      </a>
                                    </Message>
                                  </Accordion.Content>
                                  {this.state.operationStatusNow ===
                                    "SUCCESS" && (
                                    <Accordion.Title
                                      active={this.state.activeIndexThree}
                                      index={2}
                                      onClick={this.handleClickThree.bind(this)}
                                    >
                                      <Icon name="dropdown" />
                                      {t("sell.mySells.accordion.digitalBill")}
                                    </Accordion.Title>
                                  )}
                                  <Accordion.Content
                                    active={this.state.activeIndexThree}
                                  >
                                    <Message info size={"small"}>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t(
                                              "sell.mySells.bill.ticket"
                                            )}:{" "}
                                          </b>
                                        </label>
                                        {this.state.ticket}
                                      </div>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t("sell.mySells.bill.date")}:{" "}
                                          </b>
                                        </label>
                                        {this.state.dateOperation}
                                      </div>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t("sell.mySells.bill.time")}:{" "}
                                          </b>
                                        </label>
                                        {this.state.hour}
                                      </div>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t(
                                              "sell.mySells.bill.amountBTC"
                                            )}:{" "}
                                          </b>
                                        </label>
                                        {this.state.amountBTC}
                                      </div>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t("sell.mySells.bill.amountIn")}
                                            {this.state.currencySell} :{" "}
                                          </b>
                                        </label>
                                        {this.state.amountFiat}
                                      </div>
                                      <div>
                                        <label>
                                          <b>
                                            {" "}
                                            {t("sell.mySells.bill.appliedRate")}
                                            :{" "}
                                          </b>
                                        </label>
                                        {this.state.price}
                                      </div>
                                      {this.state.taseVat !== "" && (
                                        <div>
                                          <label>
                                            <b>
                                              {" "}
                                              {t(
                                                "dynamicForm.labels.vat"
                                              )}:{" "}
                                            </b>
                                          </label>
                                          {this.state.taseVat +
                                            " " +
                                            this.state.currencyVat}
                                        </div>
                                      )}
                                      {this.state.comissionSell !== "" && (
                                        <div>
                                          <label>
                                            <b>
                                              {t(
                                                "dynamicForm.labels.commission"
                                              )}
                                              :{" "}
                                            </b>
                                          </label>
                                          {this.state.comissionSell +
                                            " " +
                                            this.state.currencyComission}
                                        </div>
                                      )}
                                      {!this.state.isCrypto && (
                                        <span>
                                          {" "}
                                          <div>
                                            <label>
                                              <b>
                                                {t(
                                                  "sell.mySells.bill.issuingBank"
                                                )}
                                                :{" "}
                                              </b>
                                            </label>
                                            {this.state.bankDollarBTC}
                                          </div>
                                          <div>
                                            <label>
                                              <b>
                                                {" "}
                                                {t(
                                                  "sell.mySells.bill.namePayer"
                                                )}
                                                :{" "}
                                              </b>
                                            </label>
                                            {this.state.nameOfThePayer}
                                          </div>
                                          <div>
                                            <label>
                                              <b>
                                                {" "}
                                                {t(
                                                  "sell.mySells.bill.receivingBank"
                                                )}
                                                :{" "}
                                              </b>
                                            </label>
                                            {this.state.issuingBank}
                                          </div>
                                        </span>
                                      )}
                                      <br />
                                      <Header textAlign="center">
                                        <Button
                                          color="blue"
                                          content={t(
                                            "sell.mySells.accordion.buttonDownload"
                                          )}
                                          style={
                                            isMobile
                                              ? {
                                                  borderRadius: "40px/40px",
                                                  height: "40px",
                                                  width: "200px",
                                                }
                                              : {}
                                          }
                                          onClick={this.printInvoice.bind(this)}
                                        />
                                      </Header>
                                    </Message>
                                  </Accordion.Content>
                                </Accordion>
                                {this.state.operationStatusNow !== "CLAIM" && (
                                  <br />
                                )}
                                {this.state.operationStatusNow === "CLAIM" && (
                                  <Message color="red" textAlign="center">
                                    {t("sell.mySells.warningClaim")}
                                  </Message>
                                )}
                                <Form.TextArea
                                  rows={2}
                                  placeholder={t(
                                    "sell.mySells.placeholderMessage"
                                  )}
                                  onChange={this.handleChangeTextMessageNew.bind(
                                    this
                                  )}
                                  onKeyPress={this.handleKeyPressed.bind(this)}
                                  value={this.state.textMessageNew}
                                />
                                {labelMessageWithoutText}
                                <br />
                                <Form.Field width={16}>
                                  <div align="center">
                                    {this.state.addFile !== true && (
                                      <Label>
                                        {this.state.fileName}{" "}
                                        <Icon
                                          name="delete"
                                          onClick={this.deleteFile.bind(this)}
                                        />
                                      </Label>
                                    )}
                                  </div>
                                </Form.Field>
                                {this.state.showCancellationButton && (
                                  <Message size="mini" textAlign="center">
                                    {t("sell.mySells.cancellationWindow")}
                                    {this.state.hour}
                                    {" min"}
                                  </Message>
                                )}
                                {this.state.viewMessage && (
                                  <Message info textAlign="center">
                                    {t("sell.mySells.claimNotificationSent")}
                                  </Message>
                                )}
                                <Form.Group inline>
                                  {this.state.operationStatusNow ===
                                    "SUCCESS" && (
                                    <Button
                                      size="mini"
                                      color="grey"
                                      onClick={this.notifyClaim.bind(this)}
                                    >
                                      {t("sell.mySells.buttonClaim")}
                                    </Button>
                                  )}
                                  {this.state.operationStatusNow ===
                                    "CANCELED" && (
                                    <Button
                                      size="mini"
                                      color="grey"
                                      onClick={this.notifyClaim.bind(this)}
                                    >
                                      {t("sell.mySells.buttonClaim")}
                                    </Button>
                                  )}
                                  {(this.state.operationStatusNow ===
                                    "WAITING_TO_START_OPERATION" ||
                                    this.state.operationStatusNow ===
                                      "WAITING_FOR_RECEIVER_CONFIRMATION") /*&&
                                    this.state.showCancellationButton*/ && (
                                    <Button
                                      size="mini"
                                      color="red"
                                      basic
                                      onClick={this.openModalCancelSell.bind(
                                        this
                                      )}
                                    >
                                      {t("sell.mySells.buttonCancel")}
                                    </Button>
                                  )}
                                  <Files
                                    ref={this.selfRef}
                                    onChange={this.fileChangedHandler.bind(
                                      this
                                    )}
                                    onError={this.fileChangedHandlerError.bind(
                                      this
                                    )}
                                    accepts={["image/*", ".pdf"]}
                                    multiple={false}
                                    maxFiles={1}
                                    maxFileSize={5000000}
                                    minFileSize={0}
                                    clickable={this.state.addFile}
                                  >
                                    {" "}
                                    <Button
                                      basic
                                      size="mini"
                                      color="grey"
                                      disabled={!this.state.addFile}
                                    >
                                      {t("sell.mySells.buttonAttachment")}
                                    </Button>
                                  </Files>
                                  <TakePhoto
                                    onHandlerFile={this.fileChangedHandler.bind(
                                      this
                                    )}
                                  />
                                  <Button
                                    color="blue"
                                    floated="right"
                                    size="mini"
                                    onClick={this.handleSendMessage.bind(this)}
                                  >
                                    {t("sell.mySells.buttonSend")}
                                  </Button>
                                  {/* <Grid.Column
                                      largeScreen={11}
                                      mobile={16}
                                      tablet={11}
                                      computer={12}
                                      floated="right"
                                    >
                                      <Grid columns={2}>
                                        <Grid.Column
                                          largeScreen={12}
                                          mobile={12}
                                          tablet={12}
                                          computer={12}
                                          floated="right"
                                        ></Grid.Column>
                                        <Grid.Column
                                          largeScreen={4}
                                          mobile={4}
                                          tablet={4}
                                          computer={4}
                                          floated="right"
                                        ></Grid.Column>
                                      </Grid>
                                    </Grid.Column> */}
                                </Form.Group>
                                <Form.Field>
                                  <Feed
                                    style={
                                      this.state.paymentTypeKey === "ZELLE"
                                        ? { height: 240, overflowX: "auto" }
                                        : { height: 200, overflowX: "auto" }
                                    }
                                  >
                                    {this.state.contactMessages.map(
                                      (message, i) => (
                                        <Feed.Event key={i}>
                                          <Feed.Label image={avatarNull} />
                                          <Feed.Content>
                                            <Feed.Summary>
                                              <Popup
                                                trigger={
                                                  <a>
                                                    {message.userName ===
                                                    user.getUserName()
                                                      ? t(
                                                          "sell.mySells.labelMe"
                                                        )
                                                      : t(
                                                          "sell.mySells.labelModerator"
                                                        )}
                                                  </a>
                                                }
                                                content={
                                                  message.userName ===
                                                  user.getUserName()
                                                    ? t("sell.mySells.labelMe")
                                                    : t(
                                                        "sell.mySells.labelModerator"
                                                      )
                                                }
                                                inverted
                                              />
                                              <Feed.Date>
                                                {" "}
                                                {this.formatDate(
                                                  new Date(message.timestamp)
                                                )}
                                              </Feed.Date>
                                            </Feed.Summary>
                                            <Feed.Extra text>
                                              {message.message ===
                                              "OPERATION 10 MINUTES LEFT"
                                                ? t(
                                                    "sell.mySells.operationTimeLeft"
                                                  )
                                                : message.message ===
                                                  "OPERATION TIMEOUT"
                                                ? t(
                                                    "sell.mySells.operationTimeout"
                                                  )
                                                : message.message}
                                            </Feed.Extra>
                                            <Feed.Extra images>
                                              <a>
                                                {message.attachment !==
                                                  undefined && (
                                                  <Popup
                                                    trigger={
                                                      <Button
                                                        onClick={() =>
                                                          window.open(
                                                            message.urlFile,
                                                            "_blank"
                                                          )
                                                        }
                                                        size="tiny"
                                                        color="blue"
                                                        icon
                                                      >
                                                        <Icon name="file image outline" />
                                                      </Button>
                                                    }
                                                    content={t(
                                                      "sell.mySells.buttonSeeAttachment"
                                                    )}
                                                  />
                                                )}
                                              </a>
                                            </Feed.Extra>
                                          </Feed.Content>
                                        </Feed.Event>
                                      )
                                    )}
                                  </Feed>
                                </Form.Field>
                              </Form>
                            </Container>
                          </Segment>
                        )}
                      </Container>
                    </div>
                    {isMobile && (
                      <div
                        hidden={this.state.ceroOperations}
                        style={{ marginTop: 30 }}
                      >
                        <Accordion fluid styled exclusive={false}>
                          <Accordion.Title
                            style={isMobile === true ? { color: "black" } : {}}
                            active={this.state.activeIndexOne}
                            index={0}
                            onClick={this.handleClick.bind(this)}
                          >
                            <Icon name="dropdown" />
                            {t("sell.mySells.accordion.details")}
                          </Accordion.Title>
                          <Accordion.Content active={this.state.activeIndexOne}>
                            <Grid>
                              <Grid.Row columns={2} verticalAlign="middle">
                                <Grid.Column>
                                  <label>
                                    {t("sell.mySells.accordion.operation")} #:{" "}
                                    <strong>
                                      {this.state.idOperationSelected.slice(-4)}
                                    </strong>
                                  </label>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  {this.state.operationStatusNow ===
                                    "SUCCESS" && (
                                    <Popup
                                      trigger={
                                        <Rating
                                          disabled={
                                            this.state.ratingQualify > 0
                                          }
                                          icon="star"
                                          rating={this.state.ratingQualify}
                                          maxRating={5}
                                          onRate={this.handleRate.bind(this)}
                                        />
                                      }
                                      content={t(
                                        "buy.history.accordion.qualify"
                                      )}
                                    />
                                  )}
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>

                            <div>
                              <label className="ui compact">
                                {this.state.paymentType}
                              </label>
                            </div>
                            {/* <Message info>
                                    {this.state.listItemHistorial}
                                  </Message> */}
                            <Popup
                              trigger={
                                <span>
                                  <Message info size={"small"}>
                                    {listDetailsOperation}
                                  </Message>
                                </span>
                              }
                              content={popupValues}
                              position="top center"
                              size="small"
                              wide
                            />
                          </Accordion.Content>
                          <Accordion.Title
                            active={this.state.activeIndexTwo}
                            index={1}
                            onClick={this.handleClickTwo.bind(this)}
                          >
                            <Icon name="dropdown" />
                            {t("sell.mySells.accordion.terms")}
                          </Accordion.Title>
                          <Accordion.Content active={this.state.activeIndexTwo}>
                            <Message info size="small">
                              {" "}
                              {term.ters.item1.slice(0, 25)}
                              <a
                                className="linkVerMas"
                                onClick={this.handleShowTermAndCondicionModal.bind(
                                  this
                                )}
                              >
                                {t("sell.mySells.accordion.seeMore")}
                              </a>
                            </Message>
                          </Accordion.Content>
                          {this.state.operationStatusNow === "SUCCESS" && (
                            <Accordion.Title
                              active={this.state.activeIndexThree}
                              index={2}
                              onClick={this.handleClickThree.bind(this)}
                            >
                              <Icon name="dropdown" />
                              {t("sell.mySells.accordion.digitalBill")}
                            </Accordion.Title>
                          )}
                          <Accordion.Content
                            active={this.state.activeIndexThree}
                          >
                            <Message info size={"small"}>
                              <div>
                                <label>
                                  <b>{t("sell.mySells.bill.ticket")}:</b>{" "}
                                </label>
                                {this.state.ticket}
                              </div>
                              <div>
                                <label>
                                  <b>{t("sell.mySells.bill.date")}:</b>{" "}
                                </label>
                                {this.state.dateOperation}
                              </div>
                              <div>
                                <label>
                                  <b>{t("sell.mySells.bill.time")}: </b>
                                </label>
                                {this.state.hour}
                              </div>
                              <div>
                                <label>
                                  <b> {t("sell.mySells.bill.amountBTC")}: </b>
                                </label>
                                {this.state.amountBTC}
                              </div>
                              <div>
                                <label>
                                  <b>
                                    {" "}
                                    {t("sell.mySells.bill.amountIn")}
                                    {this.state.currencySell} :{" "}
                                  </b>
                                </label>
                                {this.state.amountFiat}
                              </div>
                              <div>
                                <label>
                                  <b> {t("sell.mySells.bill.appliedRate")}: </b>
                                </label>
                                {this.state.price}
                              </div>
                              {this.state.taseVat !== "" && (
                                <div>
                                  <label>
                                    <b>{t("dynamicForm.labels.vat")}: </b>
                                  </label>
                                  {this.state.taseVat +
                                    " " +
                                    this.state.currencyVat}
                                </div>
                              )}
                              {this.state.comissionSell !== "" && (
                                <div>
                                  <label>
                                    <b>
                                      {" "}
                                      {t("dynamicForm.labels.commission")}:{" "}
                                    </b>
                                  </label>
                                  {this.state.comissionSell +
                                    " " +
                                    this.state.currencyComission}
                                </div>
                              )}
                              {!this.state.isCrypto && (
                                <span>
                                  {" "}
                                  <div>
                                    <label>
                                      <b>
                                        {" "}
                                        {t(
                                          "sell.mySells.bill.issuingBank"
                                        )}:{" "}
                                      </b>
                                    </label>
                                    {this.state.bankDollarBTC}
                                  </div>
                                  <div>
                                    <label>
                                      <b>
                                        {t("sell.mySells.bill.namePayer")}:{" "}
                                      </b>
                                    </label>
                                    {this.state.nameOfThePayer}
                                  </div>
                                  <div>
                                    <label>
                                      <b>
                                        {t("sell.mySells.bill.receivingBank")}:{" "}
                                      </b>
                                    </label>
                                    {this.state.issuingBank}
                                  </div>
                                </span>
                              )}
                              <br />
                              <Header textAlign="center">
                                <Button
                                  color="blue"
                                  style={
                                    isMobile
                                      ? {
                                          borderRadius: "40px/40px",
                                          height: "40px",
                                          width: "200px",
                                        }
                                      : {}
                                  }
                                  content={t(
                                    "sell.mySells.accordion.buttonDownload"
                                  )}
                                  onClick={this.printInvoice.bind(this)}
                                />
                              </Header>
                            </Message>
                          </Accordion.Content>
                        </Accordion>
                        {this.state.operationStatusNow !== "CLAIM" && <br />}
                        {this.state.operationStatusNow === "CLAIM" && (
                          <Message color="red" textAlign="center">
                            {t("sell.mySells.warningClaim")}
                          </Message>
                        )}
                        <Form>
                          {this.state.operationStatusNow === "SUCCESS" && (
                            <div align="center">
                              <Button
                                fluid
                                style={{
                                  borderRadius: "40px/40px",
                                  height: "40px",
                                  width: "200px",
                                  marginTop: 5,
                                }}
                                size="mini"
                                color="grey"
                                onClick={this.notifyClaim.bind(this)}
                              >
                                {t("sell.mySells.buttonClaim")}
                              </Button>
                              <Divider hidden></Divider>
                            </div>
                          )}
                          {this.state.operationStatusNow === "CANCELED" && (
                            <div align="center">
                              <Button
                                size="mini"
                                color="grey"
                                style={{
                                  borderRadius: "40px/40px",
                                  height: "40px",
                                  width: "200px",
                                  marginTop: 5,
                                }}
                                onClick={this.notifyClaim.bind(this)}
                              >
                                {t("sell.mySells.buttonClaim")}
                              </Button>
                              <Divider hidden></Divider>
                            </div>
                          )}

                          <Form.TextArea
                            style={{
                              borderColor: "silver",
                              borderWidth: 1,
                            }}
                            placeholder={t("sell.mySells.placeholderMessage")}
                            onChange={this.handleChangeTextMessageNew.bind(
                              this
                            )}
                            onKeyPress={this.handleKeyPressed.bind(this)}
                            value={this.state.textMessageNew}
                          />
                        </Form>
                        {labelMessageWithoutText}
                        <Form.Field width={16}>
                          <div align="center">
                            {this.state.addFile !== true && (
                              <Label>
                                {this.state.fileName}{" "}
                                <Icon
                                  name="delete"
                                  onClick={this.deleteFile.bind(this)}
                                />
                              </Label>
                            )}
                          </div>
                        </Form.Field>
                        {this.state.showCancellationButton && (
                          <Message size="mini" textAlign="center">
                            {t("sell.mySells.cancellationWindow")}
                            {this.state.hour}
                            {" min"}
                          </Message>
                        )}
                        {this.state.viewMessage && (
                          <Message info textAlign="center">
                            {t("sell.mySells.claimNotificationSent")}
                          </Message>
                        )}
                        <Form.Field style={{ marginTop: 20 }}>
                          <Grid centered>
                            {(this.state.operationStatusNow ===
                              "WAITING_TO_START_OPERATION" ||
                              this.state.operationStatusNow ===
                                "WAITING_FOR_RECEIVER_CONFIRMATION") && (
                              <Button
                                size="mini"
                                color="red"
                                style={{
                                  borderRadius: "40px/40px",
                                  height: "40px",
                                  width: "200px",
                                  marginTop: 5,
                                }}
                                fluid
                                basic
                                onClick={this.openModalCancelSell.bind(this)}
                              >
                                {t("sell.mySells.buttonCancel")}
                              </Button>
                            )}
                            <Files
                              ref={this.selfRef}
                              onChange={this.fileChangedHandler.bind(this)}
                              onError={this.fileChangedHandlerError.bind(this)}
                              accepts={["image/*", ".pdf"]}
                              multiple={false}
                              maxFiles={1}
                              maxFileSize={5000000}
                              minFileSize={0}
                              clickable={this.state.addFile}
                            >
                              <Button
                                basic
                                size="mini"
                                color="grey"
                                style={{
                                  borderRadius: "40px/40px",
                                  height: "40px",
                                  width: "110px",
                                  marginTop: 8,
                                  marginLeft: -10,
                                }}
                                disabled={!this.state.addFile}
                              >
                                {t("sell.mySells.buttonAttachment")}
                              </Button>
                            </Files>
                            <TakePhoto
                              size="large"
                              onHandlerFile={this.fileChangedHandler.bind(this)}
                            />
                            <Button
                              color="blue"
                              size="mini"
                              style={{
                                borderRadius: "40px/40px",
                                height: "40px",
                                width: "110px",
                                marginTop: 8,
                                marginLeft: 5,
                                marginRight: 2,
                              }}
                              onClick={this.handleSendMessage.bind(this)}
                            >
                              {t("sell.mySells.buttonSend")}
                            </Button>
                          </Grid>
                        </Form.Field>
                        <Form.Field>
                          {isMobile && (
                            <div>
                              <Divider hidden></Divider>
                              <Divider hidden></Divider>
                            </div>
                          )}
                          <Feed
                            style={
                              this.state.paymentTypeKey === "ZELLE"
                                ? { height: 240, overflowX: "auto" }
                                : { height: 200, overflowX: "auto" }
                            }
                          >
                            {this.state.contactMessages.map((message, i) => (
                              <Feed.Event key={i}>
                                <Feed.Label image={avatarNull} />
                                <Feed.Content>
                                  <Feed.Summary>
                                    <Popup
                                      trigger={
                                        <a>
                                          {message.userName ===
                                          user.getUserName()
                                            ? t("sell.mySells.labelMe")
                                            : t("sell.mySells.labelModerator")}
                                        </a>
                                      }
                                      content={
                                        message.userName === user.getUserName()
                                          ? t("sell.mySells.labelMe")
                                          : t("sell.mySells.labelModerator")
                                      }
                                      inverted
                                    />
                                    <Feed.Date>
                                      {" "}
                                      {this.formatDate(
                                        new Date(message.timestamp)
                                      )}
                                    </Feed.Date>
                                  </Feed.Summary>
                                  <Feed.Extra text>
                                    {message.message ===
                                    "OPERATION 10 MINUTES LEFT"
                                      ? t("sell.mySells.operationTimeLeft")
                                      : message.message === "OPERATION TIMEOUT"
                                      ? t("sell.mySells.operationTimeout")
                                      : message.message}
                                  </Feed.Extra>
                                  <Feed.Extra images>
                                    <a>
                                      {message.attachment !== undefined && (
                                        <Popup
                                          trigger={
                                            <Button
                                              onClick={() =>
                                                window.open(
                                                  message.urlFile,
                                                  "_blank"
                                                )
                                              }
                                              size="tiny"
                                              color="blue"
                                              icon
                                            >
                                              <Icon name="file image outline" />
                                            </Button>
                                          }
                                          content={t(
                                            "sell.mySells.buttonSeeAttachment"
                                          )}
                                        />
                                      )}
                                    </a>
                                  </Feed.Extra>
                                </Feed.Content>
                              </Feed.Event>
                            ))}
                          </Feed>
                        </Form.Field>
                      </div>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Container>
        )}
        <Modal
          open={this.state.showModalTerm}
          onClose={this.handleCloseModalTerm.bind(this)}
        >
          <Modal.Header>{t("sell.mySells.modalTerms.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Message info>
                <TermsAndConditions />
              </Message>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            {!isMobile && (
              <Button
                onClick={this.handleCloseModalTerm.bind(this)}
                color="grey"
              >
                {t("sell.mySells.modalTerms.buttonClose")}
              </Button>
            )}
            {isMobile && (
              <div align="center">
                {" "}
                <Button
                  onClick={this.handleCloseModalTerm.bind(this)}
                  color="grey"
                  style={
                    isMobile
                      ? {
                          borderRadius: "40px/40px",
                          height: "40px",
                          width: "200px",
                          textAlign: "center",
                          marginTop: 8,
                        }
                      : {}
                  }
                >
                  {t("sell.mySells.modalTerms.buttonClose")}
                </Button>
                <Divider hidden></Divider>
              </div>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.showModalCancelSell}
          onClose={this.closeModalCancelSell}
        >
          <Modal.Header>{t("sell.mySells.modalCancel.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {!this.state.resultCancelMessage &&
                t("sell.mySells.modalCancel.content")}
              {this.state.resultCancelMessage && labelResultCancel}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <div hidden={this.state.operationReady}>
              <Button
                color="red"
                onClick={this.closeModalCancelSell.bind(this)}
                disabled={this.state.loadingCancelSell}
              >
                {t("sell.mySells.modalCancel.buttonClose")}
              </Button>
              <Button
                onClick={this.cancelSell.bind(this)}
                loading={this.state.loadingCancelSell}
                color="green"
              >
                {t("sell.mySells.modalCancel.buttonAccept")}
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.showModalQualify}
          onClose={this.closeModalQualify.bind(this)}
          size="tiny"
        >
          {this.state.loadingReview && (
            <Dimmer active inverted>
              <Loader inverted>{t("buy.loading")}</Loader>
            </Dimmer>
          )}

          <Modal.Header>{t("buy.history.modalQualify.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {messageSuccessReview}
              {messageFailReview}
              <Form>
                <Form.Field style={{ textAlign: "center" }}>
                  <Rating
                    size="huge"
                    icon="star"
                    rating={this.state.ratingQualify}
                    onRate={this.handleRate.bind(this)}
                    maxRating={5}
                  />
                </Form.Field>
                <Form.Field>
                  <strong>
                    <label>{t("buy.history.modalQualify.comment")}</label>
                  </strong>
                  <Form.TextArea
                    placeholder={t("buy.history.modalQualify.comment")}
                    onChange={this.handleComment.bind(this)}
                    value={this.state.commentReview}
                  />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.sendReview.bind(this)}
              color="blue"
              disabled={
                this.state.commentReview === "" ||
                this.state.ratingQualify === 0
              }
            >
              {t("buy.history.modalQualify.send")}
            </Button>
            <Button onClick={this.closeModalQualify.bind(this)} color="grey">
              {t("buy.modalTerms.buttonClose")}
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(FormHistorySalesBitcoins);
