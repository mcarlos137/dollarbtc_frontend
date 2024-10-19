import React, { Component } from "react";
import "../BuyBitcoins.css";
import {
  Container,
  Divider,
  Header,
  Segment,
  Form,
  Grid,
  Button,
  Dimmer,
  Loader,
  Feed,
  Label,
  Icon,
  Popup,
  Flag,
  Message,
  Accordion,
  Modal,
  Responsive,
  Image,
  List,
  Rating,
  GridColumn,
} from "semantic-ui-react";
import Sockette from "sockette";
import Files from "react-files";
import ReactTable from "react-table";
import * as jsPDF from "jspdf";
import "react-table/react-table.css";
import Countdown, { zeroPad } from "react-countdown-now";
import otcAPI from "../../../services/otc";
import currency from "../../../common/currency";
import avatarNull from "../../../img/avatarNull.png";
import { Link } from "react-router-dom";
import user from "../../../services/user";
import { parse } from "query-string";
import uuid from "uuid";
import translate from "../../../i18n/translate";
import Resizer from "react-image-file-resizer";
import { isMobile } from "react-device-detect";
import TermsAndConditions from "../../TermsAndConditions/TermsAndConditions";
import term from "../../../common/termAndConditionsSell";
import TakePhoto from "../../ModalTakePhoto/TakePhoto";
import attachments from "../../../services/attachments";
import config from "../../../services/config";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
// Random component
const Completionist = () => <span>El tiempo de operación expiro</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        {zeroPad(hours, 2)}:{zeroPad(minutes, 2)}
      </span>
    );
  }
};

class FormHistoryBuyBitcoins extends Component {
  constructor(props) {
    super(props);
    this.selfRef = React.createRef();
    this.title = React.createRef();
    this._Mounted = false;
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
      listPayments: mapPayments,
      operationsFromUser: [],
      tableReady: false,
      contactMessages: [],
      bank: "",
      accountNumber: "",
      accountHolder: "",
      holderId: "",
      isAuth: user.getUserAuth(),
      transactionTable: [],
      operationSelected: "",
      paymentType: "",
      statusOperation: "",
      paymentTypeKey: "",
      errorFileMessage: false,
      localDateInMiliseconds: 0,
      timeForOperationInMiliseconds: 0,
      textMessageNew: "",
      message: "",
      type: "",
      idOperationSelected: "",
      socket: null,
      socketStatus: null,
      messageWithoutText: false,
      selected: 0,
      addFile: true,
      activeIndexOne: true,
      activeIndexTwo: false,
      activeIndexThree: false,
      selectedFile: {},
      fileName: "",
      loadingNewFile: false,
      messageErrorAdjuntar: false,
      activeIndex: 0,
      ceroOperations: false,
      paymentSelected: null,
      listItemHistorialSinDatosBancarios: [],
      listItemHistorialConDatosBancarios: [],
      verificationStatus: "",
      timeleftOperation: 0,
      showModalCancelBuy: false,
      showModalTerminsAnsConditions: false,
      ticket: "",
      hour: "",
      dateOperation: "",
      amountBTC: "",
      amountFiat: "",
      price: "",
      tax: "",
      bankRate: "",
      issuingBank: "",
      nameOfThePayer: "",
      bankDollarBTC: "",
      currency: "",
      termsAndConditionsAccepted: false,
      dataToPdf: [],
      translator: props.translate,
      popupVariable: [],
      vat: "",
      currencyVat: "",
      comissionBuy: "",
      comissionCurrency: "",
      showModalQualify: false,
      ratingQualify: 0,
      commentReview: "",
      reviewReady: false,
      reviewSuccess: false,
      reviewFail: false,
      loadingReview: false,
      showMessageByStatusOperation: "",
      messageStatusOperation: [],
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
      if (this.state.messageStatusOperation.length > 0) {
        for (let message of this.state.messageStatusOperation) {
          if (message.language === nextProps.language) {
            this.setState({ showMessageByStatusOperation: message.message });
          }
        }
      }
    }
  }
  handleChangeTextMessageNew(e) {
    this.setState({
      textMessageNew: e.target.value,
    });
  }

  sendReview() {
    let body = {
      userName: sessionStorage.getItem("username"),
      operationId: this.state.idOperationSelected,
      operationType: "OTC__BUY",
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
              showModalQualify: false,
              ratingQualify: 0,
              commentReview: "",
              reviewFail: false,
            });
          }, 5000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.handleShowOperationBuy(this.state.idOperationSelected);
  }
  handleComment(e) {
    this.setState({ commentReview: e.target.value });
  }
  getBuyFromUser = (operationIdByDefault) => {
    let bodyGetOperationsSell = {
      userName: sessionStorage.getItem("username"),
      currency: "",
      otcOperationType: "BUY",
      otcOperationStatus: null,
    };

    otcAPI.getOperations(bodyGetOperationsSell).then((res) => {
      ////////console.log(res);

      this.setState({
        operationsFromUser: res.data,
        tableReady: true,
      });
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
        this.handleShowOperationBuy(
          operationIdByDefault !== null ? operationIdByDefault : res.data[0].id
        );
      } else {
        this.setState({
          ceroOperations: true,
        });
      }
      this.makeTableData(res.data);
      this.setState({ tableReady: true });
    });
  };
  validateTimeForBuy(dateOperationString) {
    //console.log("dateOperationString:", dateOperationString)
    this.setState({
      localDateInMiliseconds: Date.now(),
    });
    let timeRest = this.state.paymentSelected.minutesLeft * 60 * 1000;
    //console.log("payment selected:", this.state.paymentSelected)
    //console.log("time rest", timeRest)
    //console.log("timeRest sin multi", this.state.paymentSelected.minutesLeft)
    if (timeRest > 0) {
      this.setState({
        timeForOperationInMiliseconds: timeRest,
      });
    } else {
      this.setState({
        timeForOperationInMiliseconds: 0,
      });
    }
  }
  notifyPaid() {
    var body = {
      id: this.state.idOperationSelected,
      otcOperationStatus: "PAY_VERIFICATION",
      userChange: true,
      paymentId: null,
    };
    otcAPI
      .changeOperationStatus(body)
      .then((resp) => {
        //////////console.log('response notify paid',resp.data);
        if (resp.data === "OK") {
          this.setState({
            statusOperation: "PAY_VERIFICATION",
            viewMessage: true,
          });
          this.blankErrors("messageWithoutText");
        }
        this.componentWillUnmount();
        this.componentDidMount();
      })
      .catch((error) => {
        //////////console.log('error pay verefication',error);
      });
  }
  closeConexionSocket() {
    if (this.state.socket !== null && this.state.socket !== undefined) {
      this.state.socket.close();
      this.setState({
        contactMessages: [],
        selectedFile: null,
      });
    }
    window.sessionStorage.setItem("buyOperationSocketId", "");
  }
  componentWillUnmount() {
    this._Mounted = false;
    if (this.state.socket !== undefined && this.state.socket !== null) {
      this.state.socket.close();
    }
  }
  componentDidMount() {
    this._Mounted = true;
    this.openSocketStatus();
    if (typeof parse(window.location.search).id !== "undefined") {
      this.getBuyFromUser(parse(window.location.search).id);
      var uri = window.location.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
    } else {
      this.getBuyFromUser(null);
    }
    let username = user.getUserName();
    let userconfig = user.getConfigUserGeneral(username);
    userconfig
      .then((resp) => {
        this.setState({
          verificationStatus:
            resp.data.result.verification !== undefined &&
            resp.data.result.verification.C !== undefined
              ? resp.data.result.verification.C.userVerificationStatus
              : "UNINITIATED",
        });
      })
      .catch((error) => {
        //////////console.log(error);
      });
    window.sessionStorage.setItem("buyOperationSocketId", "");
  }
  socketReady(event, idOperation, webSocketId) {
    //llamar de nuevo cuando seleccione otra operación
    let wsId = null;
    if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
      window.sessionStorage.setItem("buyOperationSocketId", wsId);
    } else {
      ////////////console.log("estoy en el else del connect: ", webSocketId);
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
    if (this.state.socket !== null && event.target.readyState === 1) {
      try {
        this.state.socket.json(body);
      } catch (e) {}
    }
  }

  openSocketStatus() {
    this.setState({
      socketStatus: new Sockette(URL_WEBSOCKET_DBTC + "/otc", {
        onopen: (e) => {
          this.socketReadyStatus(
            e,
            window.sessionStorage.getItem("buyOperationSocketId")
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
      window.sessionStorage.setItem("buyOperationSocketId", wsId);
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
    //////////console.log(res)
    if (this._Mounted) {
      let result = JSON.parse(res);
      if (result !== undefined) {
        //////////console.log(result)
        for (let i = 0; i < result.params.data.length; i++) {
          var statusAdd = result.params.data[i];
          if (statusAdd !== null) {
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
                statusOperation: statusAdd.otcOperationStatus,
              });
            }
          }
        }
        //////////console.log(this.state.transactionTable);
      }
    }
  }
  activeAutoScrollUp() {
    window.scrollBy(0, -3000);
  }
  reconnectSocket(e, operationId) {
    let ws = window.sessionStorage.getItem("buyOperationSocketId");
    this.socketReady(e, operationId, ws);
  }
  openSocket = (operationId) => {
    this.setState({
      socket: new Sockette(URL_WEBSOCKET_DBTC + "/otc", {
        onopen: (e) => {
          this.socketReady(
            e,
            operationId,
            window.sessionStorage.getItem("buyOperationSocketId")
          );
          ////////////console.log("conectando...", e);
        },
        onmessage: (e) => {
          this.handleValue(e.data, operationId);
          ////////////console.log("respuesta... ", e);
        },
        onreconnect: (e) => {
          this.reconnectSocket(e, operationId);
          ////////////console.log("reconectando...", e);
        },
      }),
    });
  };
  async getOperationsAttachment(operationId, fileName) {
    // let result;
    // try {
    //   const response = await attachments.getOtcAttachment(
    //     operationId,
    //     fileName
    //   );
    //   let blob = new Blob([response.data], {
    //     type: response.headers["content-type"],
    //   });
    //   let image = URL.createObjectURL(blob);
    //   result = image;
    // } catch (error) {
    //   result = "";
    // }
    // return result;
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
  async handleValue(value, operationId) {
    let result = JSON.parse(value);
    if (result !== undefined) {
      if (result.params !== undefined) {
        for (let i = 0; i < result.params.data.length; i++) {
          let messageToAdd = result.params.data[i];
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
      operationsTable.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
      operationsTable.push(operationTable);
    }

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
      })
      .catch((error) => {
        ////////console.log(error);
      });
  }
  handleShowOperationBuy(idOperation) {
    let messages = [];
    this.setState({
      ratingQualify: 0,
      messageStatusOperation: [],
      showMessageByStatusOperation: "",
    });
    otcAPI.getOperation(idOperation).then((res) => {
      this.getReviewPerOperation(idOperation);
      let amountB = res.data.amount / res.data.price;
      if (res.data.dollarBTCPayment !== undefined) {
        if (res.data.dollarBTCPayment.messages !== undefined) {
          Object.entries(res.data.dollarBTCPayment.messages).forEach(
            ([key, value]) => {
              if (key.includes("BUY") && key.includes("INSTRUCTIONS")) {
                if (key.includes(res.data.otcOperationStatus)) {
                  if (key.includes("EN")) {
                    let message = {
                      language: "en",
                      message: value,
                    };
                    messages.push(message);
                  } else {
                    let message = {
                      language: "es",
                      message: value,
                    };
                    messages.push(message);
                  }
                }
              }
            }
          );
        }
      }
      for (let mes of messages) {
        if (mes.language === this.props.language) {
          this.setState({ showMessageByStatusOperation: mes.message });
        }
      }
      this.setState({
        messageStatusOperation: messages,
        ticket: res.data.id,
        hour: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
        dateOperation: res.data.timestamp.split("T")[0],
        amountBTC: "",
        amountFiat: "",
        price: "",
        tax: "",
        bankRate: "",
        vat: "",
        comissionBuy: "",
        currencyVat: "",
        comissionCurrency: "",
        issuingBank:
          res.data.clientPayment !== null &&
          res.data.clientPayment !== undefined
            ? res.data.clientPayment.bank
            : "",
        nameOfThePayer:
          res.data.clientPayment !== null &&
          res.data.clientPayment !== undefined &&
          res.data.clientPayment.accountHolderName !== undefined
            ? res.data.clientPayment.accountHolderName
            : "",
        bankDollarBTC:
          res.data.dollarBTCPayment !== null &&
          res.data.dollarBTCPayment !== undefined &&
          res.data.dollarBTCPayment.bank !== null &&
          res.data.dollarBTCPayment.bank !== undefined
            ? res.data.dollarBTCPayment.bank
            : "",
        currency: res.data.currency,
        termsAndConditionsAccepted:
          res.data.termsAndConditionsAccepted !== undefined,
      });
      let array = [];
      array.push({ label: "buy.history.bill.ticket", value: res.data.id });
      array.push({
        label: "Hora",
        value: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
      });
      array.push({
        label: "buy.history.bill.date",
        value: res.data.timestamp.split("T")[0],
      });

      array.push({
        label:
          this.state.translator("buy.history.bill.amountIn") +
          res.data.currency,
        value: res.data.amount.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }),
      });

      if (res.data.dollarBTCPayment.type !== "TRANSFER_TO_CRYPTO_WALLET") {
        let val = res.data.amount / res.data.price;
        array.push({
          label: "buy.history.bill.amountBTC",
          value: val.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
        });
        array.push({
          label: "buy.history.bill.appliedRate",
          value: res.data.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          }),
        });
        array.push({ label: "buy.history.bill.tax", value: 0 });
        this.setState({
          amountBTC: val.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
          price: res.data.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          }),
          amountFiat: res.data.amount.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          }),
          isCrypto: false,
          bankRate: 0,

          issuingBank:
            res.data.clientPayment !== undefined &&
            res.data.clientPayment !== null
              ? res.data.clientPayment.bank
              : "",
          nameOfThePayer:
            res.data.dollarBTCPayment !== undefined &&
            res.data.dollarBTCPayment.accountHolderName !== undefined
              ? res.data.dollarBTCPayment.accountHolderName
              : "",
          bankDollarBTC:
            res.data.dollarBTCPayment !== undefined &&
            res.data.dollarBTCPayment.bank !== undefined
              ? res.data.dollarBTCPayment.bank
              : "",
        });
        array.push({ label: "buy.history.bill.bankRate", value: 0 });
        array.push({
          label: "buy.history.bill.issuingBank",
          value:
            res.data.dollarBTCPayment !== undefined &&
            res.data.dollarBTCPayment.bank !== undefined
              ? res.data.dollarBTCPayment.bank
              : "",
        });
        array.push({
          label: "buy.history.bill.namePayer",
          value:
            res.data.dollarBTCPayment !== undefined &&
            res.data.dollarBTCPayment.accountHolderName !== undefined
              ? res.data.dollarBTCPayment.accountHolderName
              : "",
        });
        array.push({
          label: "buy.history.bill.receivingBank",
          value:
            res.data.clientPayment !== undefined &&
            res.data.clientPayment !== null
              ? res.data.clientPayment.bank
              : "",
        });
        if (res.data.charges !== undefined) {
          Object.entries(res.data.charges).forEach(
            ([chargeKey, chargeValue]) => {
              if (chargeKey === "COMMISSION") {
                array.push({
                  label: this.state.translator("dynamicForm.labels.commission"),
                  value: chargeValue.amount + " " + chargeValue.currency,
                });
                this.setState({
                  comissionBuy: chargeValue.amount,
                  comissionCurrency: chargeValue.currency,
                });
              }
              if (chargeKey === "VAT") {
                array.push({
                  label: this.state.translator("dynamicForm.labels.vat"),
                  value: chargeValue.amount + " " + chargeValue.currency,
                });
                this.setState({
                  vat: chargeValue.amount,
                  currencyVat: chargeValue.currency,
                });
              }
            }
          );
        }
        this.setState({ dataToPdf: array }, () => this.activeAutoScrollUp());
      } else {
        let vale = res.data.amount * res.data.price;
        this.setState({
          isCrypto: true,
          amountBTC: vale.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
          price: res.data.price.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
        });
        array.push({
          label: "buy.history.bill.amountBTC",
          value: vale.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
        });
        array.push({
          label: "buy.history.bill.appliedRate",
          value: res.data.price.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          }),
        });
        if (res.data.charges !== undefined) {
          Object.entries(res.data.charges).forEach(
            ([chargeKey, chargeValue]) => {
              if (chargeKey === "COMMISSION") {
                array.push({
                  label: this.state.translator("dynamicForm.labels.commission"),
                  value: chargeValue.amount + " " + chargeValue.currency,
                });
                this.setState({
                  comissionBuy: chargeValue.amount,
                  comissionCurrency: chargeValue.currency,
                });
              }
              if (chargeKey === "VAT") {
                array.push({
                  label: this.state.translator("dynamicForm.labels.vat"),
                  value: chargeValue.amount + " " + chargeValue.currency,
                });
                this.setState({
                  vat: chargeValue.amount,
                  currencyVat: chargeValue.currency,
                });
              }
            }
          );
        }
        this.setState({ dataToPdf: array }, () => this.activeAutoScrollUp());
      }
      //this.state.listItemHistorialSinDatosBancarios = [];
      this.setState({
        popupVariable: [],
        listItemHistorialSinDatosBancarios: [],
      });
      let notInfoBanck = [];
      if (res.data.dollarBTCPayment.messages !== undefined) {
        if (
          res.data.dollarBTCPayment.messages.BUY__INSTRUCTIONS !== undefined
        ) {
          if (res.data.dollarBTCPayment.messages.BUY__INSTRUCTIONS !== "") {
            this.setState({
              instructionMessage:
                res.data.dollarBTCPayment.messages.BUY__INSTRUCTIONS,
            });
          }
        }
      }
      Object.entries(res.data.dollarBTCPayment).forEach(([key, val]) => {
        if (
          key !== "id" &&
          key !== "messages" &&
          key !== "type" &&
          key !== "active" &&
          key !== "acceptIn" &&
          key !== "acceptOut" &&
          key !== "joinField" &&
          key !== "payWindow" &&
          key !== "joinMyPayments" &&
          key !== "joinFieldValue" &&
          key !== "accountNumber" &&
          key !== "accountHolderId" &&
          key !== "accountHolderName" &&
          key !== "value" &&
          key !== "description" &&
          key !== "sendToPayments" &&
          key !== "buyBalance"
        ) {
          notInfoBanck.push(
            <span key={key}>
              {val}
              <br />
            </span>
          );
        }
      });
      let keysOne = Object.keys(res.data);

      if (keysOne.indexOf("charges") !== -1) {
        Object.entries(res.data.charges).forEach(([keyCharges, valCharges]) => {
          if (keyCharges === "COMMISSION") {
            notInfoBanck.push([
              "commission",
              valCharges.amount + " " + valCharges.currency,
            ]);
          }
          if (keyCharges === "VAT") {
            notInfoBanck.push([
              "vat",
              valCharges.amount + " " + valCharges.currency,
            ]);
          }
        });
      }
      this.setState({ listItemHistorialSinDatosBancarios: notInfoBanck });
      let arrayItem = [];
      let typeDollar = "";
      if (res.data.dollarBTCPayment.type !== undefined) {
        typeDollar = res.data.dollarBTCPayment.type;
        this.setState({
          typeDollar: typeDollar,
        });
      }
      Object.entries(res.data.dollarBTCPayment).forEach(([key, val]) => {
        if (
          key !== "id" &&
          key !== "messages" &&
          key !== "type" &&
          key !== "active" &&
          key !== "acceptIn" &&
          key !== "acceptOut" &&
          key !== "joinField" &&
          key !== "payWindow" &&
          key !== "joinMyPayments" &&
          key !== "joinFieldValue" &&
          key !== "value" &&
          key !== "accountStatus" &&
          key !== "accountCurrency" &&
          key !== "accountBalance" &&
          key !== "automatic" &&
          key !== "description" &&
          key !== "sendToPayments" &&
          key !== "buyBalance"
        ) {
          if (typeDollar !== "CREDIT_CARD") {
            arrayItem.push([key, val]);
          } else {
            if (key === "currency") {
              arrayItem.push([key, val]);
            }
          }
        } else {
          if (key === "type") {
            if (typeDollar === "CREDIT_CARD") {
              arrayItem.push([key, val]);
            }
          }
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

      //=============================================================
      // if (keys.indexOf("clientPayment") !== -1) {
      //   if (res.data.clientPayment !== null ||
      //     res.data.clientPayment !== undefined ||
      //     res.data.clientPayment !== "") {
      //     let type = ''
      //     if ( res.data.clientPayment.type !== undefined){
      //       type = res.data.clientPayment.type
      //       // arrayItem.push(["type", type]);
      //       this.setState({
      //         type:type
      //       })
      //     }
      //   } else {
      //     ////////console.log("error de datos")
      //   }
      // }
      this.setState({
        listItemHistorialConDatosBancarios: arrayItem,
      });

      this.setState({
        paymentSelected: res.data,
      });
      if (res.data.dollarBTCPayment.joinField === "bank") {
        this.setState({
          bank: res.data.dollarBTCPayment.bank,
          accountNumber: res.data.dollarBTCPayment.accountNumber,
          accountHolder: res.data.dollarBTCPayment.accountHolderName,
          holderId: res.data.dollarBTCPayment.accountHolderId,
        });
      } else {
        this.setState({
          userEmail: res.data.dollarBTCPayment.email,
          userName: res.data.dollarBTCPayment.userName,
        });
      }
      let has = this.state.listPayments.has(res.data.dollarBTCPayment.type);
      this.setState({
        idOperationSelected: idOperation,
        statusOperation: res.data.otcOperationStatus,
        paymentType: has
          ? this.state.listPayments.get(res.data.dollarBTCPayment.type)
          : res.data.dollarBTCPayment.type,
        paymentTypeKey: res.data.dollarBTCPayment.type,
      });
      //console.log("timestamp", res.data.timestamp)
      this.validateTimeForBuy(res.data.timestamp);
      this.closeConexionSocket();
      this.openSocket(idOperation);
    });
  }

  blankErrors(label) {
    if (label === "messageWithoutText") {
      setTimeout(() => {
        this.setState({ messageWithoutText: false, message: "" });
      }, 5000);
    } else if (label === "messageErrorAdjuntar") {
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    }
  }
  sendMessageWithFile() {
    let formData = new FormData();
    formData.append("attachment", this.state.selectedFile);
    formData.append("userName", window.sessionStorage.getItem("username"));
    formData.append("id", this.state.idOperationSelected);
    formData.append("message", this.state.textMessageNew);
    formData.append("operationMessageSide", "USER");
    otcAPI.addPostOperationMessageWithFile(formData);
    this.deleteFile();
    this.setState({
      textMessageNew: "",
    });
  }
  sendMessageWithOutFile() {
    let formData = new FormData();
    formData.append("userName", window.sessionStorage.getItem("username"));
    formData.append("id", this.state.idOperationSelected);
    formData.append("message", this.state.textMessageNew);
    formData.append("operationMessageSide", "USER");
    otcAPI.addPostOperationMessageWithFile(formData);
    this.deleteFile();
    this.setState({
      textMessageNew: "",
    });
  }
  handleSendMessage() {
    if (this.state.selectedFile !== null || this.state.textMessageNew !== "") {
      if (this.state.selectedFile !== null) {
        this.sendMessageWithFile();
      } else {
        this.sendMessageWithOutFile();
      }
      this.setState({
        textMessageNew: "",
      });
      this.deleteFile();
    } else {
      this.setState({
        messageWithoutText: true,
        message: "buy.history.errors.requiredField",
      });
      this.blankErrors("messageWithoutText");
    }
  }
  handleKeyPressed(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
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

  fileChangedHandler(file) {
    ////////console.log(file);
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
        //  //////////console.log(uri, ob);
      },
      "blob"
    );
  }
  deleteFile() {
    this.selfRef.current.removeFiles();
    this.setState({ selectedFile: {}, addFile: true, fileName: "" });
  }
  fileChangedHandlerError(error) {
    if (error.code === 1) {
      this.setState({
        messageErrorAdjuntar: true,
        message: "buy.history.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    } else {
      this.setState({
        messageErrorAdjuntar: true,
        message: "buy.history.errors.exceededSize",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    }
  }
  handleClick(e, titleProps) {
    this.setState({ activeIndexOne: !this.state.activeIndexOne });
  }
  handleClickTwo(e, titleProps) {
    this.setState({ activeIndexTwo: !this.state.activeIndexTwo });
  }
  handleClickThree(e, titleProps) {
    this.setState({ activeIndexThree: !this.state.activeIndexThree });
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
  cancelBuyConfirm() {
    this.setState({
      showModalCancelBuy: true,
    });
  }
  cancelBuy() {
    var body = {
      id: this.state.idOperationSelected,
      otcOperationStatus: "CANCELED",
      userChange: true,
      paymentId: null,
    };
    let response = otcAPI
      .changeOperationStatus(body)
      .then((resp) => {
        if (response.data === "OK") {
          this.setState({
            statusOperation: "CANCELED",
            viewMessage: true,
          });
          this.blankErrors("messageWithoutText");
        }
        this.componentWillUnmount();
        this.componentDidMount();
      })
      .catch((error) => {
        //////////console.log('error cancelar compra: ',error);
      });
    this.closeModalCancelBuy();
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
        this.setState({ viewMessage: true, statusOperation: "CLAIM" });
        this.componentWillUnmount();
        this.componentDidMount();
      })
      .catch((error) => {
        //////////console.log('error reclamar: ',error);
      });
  }
  closeModalCancelBuy() {
    this.setState({
      showModalCancelBuy: false,
    });
  }
  handleRate(e, data) {
    if (!this.state.showModalQualify) {
      // ////////console.log(data.rating)
      this.setState({ showModalQualify: true, ratingQualify: data.rating });
    } else {
      //////////console.log(data.rating)
      this.setState({ ratingQualify: data.rating });
    }
  }
  closeModalQualify() {
    this.setState({
      showModalQualify: false,
      ratingQualify: 0,
      commentReview: "",
    });
    this.handleShowOperationBuy(this.state.idOperationSelected);
  }
  openModalTerminsAnsConditions() {
    this.setState({
      showModalTerminsAnsConditions: true,
    });
  }
  closeModalViewTerminosAndConditions() {
    this.setState({
      showModalTerminsAnsConditions: false,
    });
  }
  printInvoice() {
    let doc = new jsPDF();

    doc.addFont("Montserrat");
    doc.setFontSize(20);
    doc.text(60, 20, this.state.translator("buy.history.bill.pdfHeader"));
    let x = 20,
      y = 40;
    doc.setFontSize(12);
    for (let data of this.state.dataToPdf) {
      doc.text(
        this.state.translator(data.label) + ":" + " " + data.value,
        x,
        y
      );
      y = y + 10;
    }
    //  doc.addImage(ima, "PNG", 10, 40, 180, 180);
    doc.save("Factura.pdf");
  }

  goToWallet() {
    window.location.reload();
  }

  render() {
    let t = this.state.translator;
    let labelMessageWithoutText,
      labelMessageErrorAdjunto,
      labelPAID,
      messageFailReview,
      messageSuccessReview;
    if (this.state.messageWithoutText) {
      labelMessageWithoutText = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }
    if (this.state.messageErrorAdjuntar) {
      labelMessageErrorAdjunto = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }

    if (
      this.state.statusOperation === "WAITING_FOR_PAYMENT" &&
      this.state.timeForOperationInMiliseconds <= 0
    ) {
      labelPAID = (
        <div className="padding-top-and-button widthFull">
          <Message
            negative
            content={t("buy.history.messages.waitingPaymentExpired")}
          />
        </div>
      );
    } else if (this.state.statusOperation === "PAY_VERIFICATION") {
      labelPAID = (
        <div class=" padding-top-and-button widthFull">
          <Message
            info
            content={t("buy.history.messages.payVerificationSent")}
          />
        </div>
      );
    }
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

    let statusLabel = (status) => {
      if (status === "SUCCESS") {
        let value = "buy.history.tableHeaders.statusValues.success";
        return (
          <Label size="mini" color="green">
            <Icon name="check circle" />
            {t(value)}
          </Label>
        );
      } else if (status === "WAITING_FOR_PAYMENT") {
        let value = "buy.history.tableHeaders.statusValues.waitingPayment";
        return (
          <Label size="mini" color="blue">
            <Icon name="sync" loading />
            {t(value)}
          </Label>
        );
      } else if (status === "CANCELED") {
        let value = "buy.history.tableHeaders.statusValues.canceled";
        return (
          <Label size="mini" color="red">
            <Icon name="warning circle" />
            {t(value)}
          </Label>
        );
      } else if (status === "PAY_VERIFICATION") {
        let value = "buy.history.tableHeaders.statusValues.payVerification";
        return (
          <Label size="mini" color="orange">
            <Icon name="info" />
            {t(value)}
          </Label>
        );
      } else if (status === "CLAIM") {
        let value = "buy.history.tableHeaders.statusValues.claim";
        return (
          <Label size="mini" color="grey">
            <Icon name="info" />
            {t(value)}
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

    this.state.listItemHistorialConDatosBancarios.forEach(([key, val]) => {
      let v = "";

      if (key === "type" && val === "CREDIT_CARD") {
        popupValues.push(
          <span key={key} style={{ textAlign: "left" }}>
            <b>{t("dynamicForm.labels." + key)}</b>
            {":" + "    " + t("dynamicForm.labels." + val)}
            <br />
          </span>
        );

        listDetailsOperation.push(
          <span key={key} style={{ textAlign: "left" }}>
            <b>{t("dynamicForm.labels." + key)}</b>
            {":" + "    " + t("dynamicForm.labels." + val)}
            <br />
          </span>
        );
      } else {
        val = t(val);
        v = t("dynamicForm.labels." + key) + ":" + "  " + val;
        popupValues.push(
          <span key={key} style={{ textAlign: "left" }}>
            <b>{t("dynamicForm.labels." + key)}</b>
            {":" + "    " + val}
            <br />
          </span>
        );

        //   let size = v.length;
        // if (size > 40 || window.innerWidth < 400) {
        //   v = v.substring(0, 40);
        //   v = v + "...";
        //   let split = v.split(":")[0]
        //   let split2 = v.split(":")[1]

        //   listDetailsOperation.push(
        //     <span key={key}  >
        //        <b>{t("dynamicForm.labels." + key)}</b>{":" + "      " + val}
        //       <br />
        //     </span>
        //   );
        // } else {
        listDetailsOperation.push(
          <span key={key} style={{ textAlign: "left" }}>
            <b>{t("dynamicForm.labels." + key)}</b>
            {":" + " " + val}
            <br />
          </span>
        );
        // }
      }

      // if (key === "description")
    });

    const data = this.state.transactionTable;
    const transactionTableHeaders = [
      {
        Header: "ID",
        accessor: "operationId",
        minWidth: 55,
        Cell: (row) => {
          return row.value.substring(row.value.length - 4, row.value.length);
        },
      },
      {
        Header: t("buy.history.tableHeaders.date"),
        accessor: "timestamp",
        minWidth: 110,
        width: 160,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: "BTC",
        accessor: "btc",
        width: 95,
        Cell: (row) => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          });
        },
      },
      {
        Header: t("buy.history.tableHeaders.amount"),
        accessor: "amount",
        Cell: (row) => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          });
        },
      },
      {
        Header: t("buy.history.tableHeaders.currency"),
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
        Header: t("buy.history.tableHeaders.status"),
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
          <Button
            icon="zoom-in"
            size={"tiny"}
            onClick={() => {
              this.handleShowOperationBuy(row.original.operationId);
            }}
          />
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
        Header: t("buy.history.tableHeaders.date"),
        accessor: "timestamp",
        show: false,
      },
      {
        Header: t("buy.history.tableHeaders.transactions"),
        accessor: "actions",
        Cell: (row) => (
          <div>
            <List>
              <List.Item
                onClick={() =>
                  this.handleShowOperationBuy(row.original.operationId)
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
                <List.Content verticalAlign="middle">
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
        Header: t("buy.history.tableHeaders.status"),
        accessor: "operationStatus",
        minWidth: 40,
        Cell: (row) => {
          return statusLabel(row.value);
        },
      },
    ];
    return (
      <div>
        <Responsive minWidth={992}>
          {!this.state.isAuth && (
            <Header as="h5" textAlign="center">
              {t("buy.notAuth.part1")}{" "}
              <Link to="/login">{t("buy.notAuth.part2")}</Link>{" "}
              {t("buy.notAuth.part3")}{" "}
              <Link to="/registration">{t("buy.notAuth.part4")}</Link>{" "}
              {t("buy.notAuth.part5")}
            </Header>
          )}
          {this.state.isAuth && (
            <Container textAlign="justified" className="BuyBitcoins">
              {!this.state.tableReady && (
                <Dimmer active inverted>
                  <Loader inverted>{t("buy.loading")}</Loader>
                </Dimmer>
              )}
              {this.state.tableReady && (
                <Grid>
                  {this.state.showMessageByStatusOperation !== "" && (
                    <Grid.Row columns={1} only="computer">
                      <br />
                      <Grid.Column>
                        <Message
                          info
                          content={this.state.showMessageByStatusOperation}
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
                          isMobile ? "<" : t("buy.history.table.previous")
                        }
                        nextText={isMobile ? ">" : t("buy.history.table.next")}
                        loadingText={t("buy.history.table.loading")}
                        noDataText={t("buy.history.table.noData")}
                        pageText={t("buy.history.table.page")}
                        ofText={t("buy.history.table.of")}
                        rowsText={t("buy.history.table.rows")}
                        pageJumpText={t("buy.history.table.pageJump")}
                        rowsSelectorText={t("buy.history.table.rowsSelector")}
                        minRow={isMobile ? 6 : 8}
                        getTrProps={this.getTrProps}
                      />
                      {this.factura}
                    </Grid.Column>
                    <Responsive
                      as={Grid.Row}
                      {...Responsive.onlyMobile}
                      {...Responsive.onlyTablet}
                    >
                      {" "}
                      <Divider hidden />
                      <Message info>
                        {t("buy.history.messages.sentProof2")}
                        {
                          <strong>{t("buy.history.buttonMarkPayment")}</strong>
                        }{" "}
                      </Message>
                      <Divider hidden />
                    </Responsive>
                    <Grid.Column
                      mobile={16}
                      largeScreen={this.state.ceroOperations ? 0 : 6}
                      tablet={16}
                      computer={this.state.ceroOperations ? 0 : 6}
                      widescreen={this.state.ceroOperations ? 0 : 6}
                    >
                      <div hidden={this.state.ceroOperations}>
                        <Container>
                          {isMobile && <Divider hidden />}
                          <Segment color="orange" textAlign="left">
                            <Container>
                              <Form>
                                <Form.Field>
                                  <Button fluid color="blue" href="/wallet">
                                    Wallet
                                  </Button>
                                </Form.Field>
                                <Form.Field>
                                  <Accordion fluid styled exclusive={false}>
                                    <Accordion.Title
                                      active={this.state.activeIndexOne}
                                      index={0}
                                      onClick={this.handleClick.bind(this)}
                                    >
                                      <Icon name="dropdown" />
                                      {t("buy.history.accordion.details")}
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
                                                "buy.history.accordion.operation"
                                              )}{" "}
                                              <strong>
                                                {" "}
                                                {this.state.idOperationSelected.slice(
                                                  -4
                                                )}
                                              </strong>
                                            </label>
                                          </Grid.Column>
                                          <Grid.Column textAlign="right">
                                            {this.state.statusOperation ===
                                              "SUCCESS" && (
                                              <Popup
                                                trigger={
                                                  <Rating
                                                    disabled={
                                                      this.state.ratingQualify >
                                                      0
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
                                      <Divider
                                        hidden
                                        style={{ margin: "2px 0px 2px 0px" }}
                                      />
                                      <div
                                        hidden={
                                          this.state.statusOperation !==
                                          "WAITING_FOR_PAYMENT_METHOD_VERIFICATION"
                                        }
                                      >
                                        <Message info>
                                          {
                                            this.state
                                              .listItemHistorialSinDatosBancarios
                                          }
                                        </Message>
                                      </div>
                                      <div
                                        hidden={
                                          this.state.statusOperation ===
                                          "WAITING_FOR_PAYMENT_METHOD_VERIFICATION"
                                        }
                                      >
                                        <Popup
                                          trigger={
                                            <span>
                                              <Message
                                                info
                                                size={"small"}
                                                style={{ textAlign: "left" }}
                                              >
                                                {listDetailsOperation}
                                              </Message>
                                            </span>
                                          }
                                          content={popupValues}
                                          position="top center"
                                          size="small"
                                          wide
                                        />
                                      </div>
                                    </Accordion.Content>

                                    <Accordion.Title
                                      active={this.state.activeIndexTwo}
                                      index={1}
                                      onClick={this.handleClickTwo.bind(this)}
                                    >
                                      <Icon name="dropdown" />
                                      {t("buy.history.accordion.terms")}
                                    </Accordion.Title>
                                    <Accordion.Content
                                      active={this.state.activeIndexTwo}
                                    >
                                      <Message info size={"small"}>
                                        {term.ters.item1.slice(0, 25)}
                                        <a
                                          class="linkVerMas"
                                          onClick={this.openModalTerminsAnsConditions.bind(
                                            this
                                          )}
                                        >
                                          {t("buy.history.accordion.seeMore")}
                                        </a>
                                      </Message>
                                    </Accordion.Content>
                                    {this.state.statusOperation ===
                                      "SUCCESS" && (
                                      <Accordion.Title
                                        active={this.state.activeIndexThree}
                                        index={2}
                                        onClick={this.handleClickThree.bind(
                                          this
                                        )}
                                      >
                                        <Icon name="dropdown" />
                                        {t("buy.history.accordion.digitalBill")}
                                      </Accordion.Title>
                                    )}
                                    <Accordion.Content
                                      active={this.state.activeIndexThree}
                                    >
                                      <Message
                                        info
                                        size={"small"}
                                        style={{ textAlign: "left" }}
                                      >
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.ticket")}:{" "}
                                            </b>
                                          </label>
                                          {this.state.ticket}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.time")}:{" "}
                                            </b>
                                          </label>
                                          {this.state.hour.split(".")[0]}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.date")}:{" "}
                                            </b>
                                          </label>
                                          {this.state.dateOperation}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.amountBTC")}:{" "}
                                            </b>
                                          </label>
                                          {this.state.amountBTC}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.amountIn")}{" "}
                                              {this.state.currency}:{" "}
                                            </b>
                                          </label>
                                          {this.state.amountFiat}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t(
                                                "buy.history.bill.appliedRate"
                                              )}
                                              :{" "}
                                            </b>
                                          </label>
                                          {this.state.price.toLocaleString(
                                            "en-US",
                                            {
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </div>
                                        {this.state.vat !== "" && (
                                          <div>
                                            <label>
                                              <b>
                                                {" "}
                                                {t(
                                                  "dynamicForm.labels.vat"
                                                )}:{" "}
                                              </b>
                                            </label>
                                            {this.state.vat +
                                              " " +
                                              this.state.currencyVat}
                                          </div>
                                        )}
                                        {this.state.comissionBuy !== "" && (
                                          <div>
                                            <label>
                                              <b>
                                                {t(
                                                  "dynamicForm.labels.commission"
                                                )}
                                                :{" "}
                                              </b>
                                            </label>
                                            {this.state.comissionBuy +
                                              " " +
                                              this.state.comissionCurrency}
                                          </div>
                                        )}
                                        <div>
                                          <label>
                                            <b>
                                              {t(
                                                "buy.history.bill.issuingBank"
                                              )}
                                              :{" "}
                                            </b>
                                          </label>
                                          {this.state.issuingBank}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t("buy.history.bill.namePayer")}:{" "}
                                            </b>
                                          </label>
                                          {this.state.nameOfThePayer}
                                        </div>
                                        <div>
                                          <label>
                                            <b>
                                              {t(
                                                "buy.history.bill.receivingBank"
                                              )}
                                              :{" "}
                                            </b>
                                          </label>
                                          {this.state.bankDollarBTC}
                                        </div>
                                        <Header textAlign="center">
                                          <Button
                                            className={"marginTopMedium"}
                                            color={"blue"}
                                            onClick={this.printInvoice.bind(
                                              this
                                            )}
                                            content={t(
                                              "buy.history.accordion.buttonDownload"
                                            )}
                                          />
                                        </Header>
                                      </Message>
                                    </Accordion.Content>
                                  </Accordion>
                                </Form.Field>
                                <Form.Field>
                                  {this.state.timeForOperationInMiliseconds >
                                    0 &&
                                    this.state.statusOperation ===
                                      "WAITING_FOR_PAYMENT" && (
                                      <div className="padding-top-bottom-btn-marcar-pago">
                                        <Countdown
                                          date={
                                            this.state.localDateInMiliseconds +
                                            this.state
                                              .timeForOperationInMiliseconds
                                          }
                                          renderer={(props) => (
                                            <p>
                                              {t("buy.history.payWindow")}{" "}
                                              <strong>
                                                {" "}
                                                {Math.floor(
                                                  props.total / (1000 * 60)
                                                )}{" "}
                                                {t("buy.history.minutes")}{" "}
                                              </strong>
                                            </p>
                                          )}
                                        />
                                      </div>
                                    )}

                                  {labelPAID}
                                </Form.Field>
                                {this.state.statusOperation === "CLAIM" && (
                                  <Form.Field>
                                    <Message
                                      color={"red"}
                                      content={t("buy.history.warningClaim")}
                                      className="padding-top-message"
                                    />
                                  </Form.Field>
                                )}
                                <div>
                                  <textarea
                                    rows={4}
                                    placeholder={t(
                                      "buy.history.placeholderMessage"
                                    )}
                                    onKeyPress={this.handleKeyPressed.bind(
                                      this
                                    )}
                                    onChange={this.handleChangeTextMessageNew.bind(
                                      this
                                    )}
                                    value={this.state.textMessageNew}
                                  />
                                </div>
                                <div>{labelMessageWithoutText}</div>
                                <br />
                                <Form.Field>
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
                                <Form.Group inline>
                                  {(this.state.statusOperation === "SUCCESS" ||
                                    this.state.statusOperation ===
                                      "CANCELED") && (
                                    <Button
                                      color="grey"
                                      size="mini"
                                      style={{
                                        marginBottom:
                                          window.innerWidth <= 495 ? 6 : 0,
                                      }}
                                      onClick={this.notifyClaim.bind(this)}
                                    >
                                      {t("buy.history.buttonClaim")}
                                    </Button>
                                  )}
                                  {/* {this.state.timeForOperationInMiliseconds >
                                    0 &&
                                    this.state.statusOperation ===
                                      "WAITING_FOR_PAYMENT" && !this.state.termsAndConditionsAccepted && (
                                      <Popup
                                          trigger={
                                              <Button
                                                  color="orange"
                                                  size="mini"
                                              >
                                                  Marcar pago
                                              </Button>
                                          }
                                          content='Antes de marcar pago por favor acepta los términos y condiciones'
                                      />
                                    )} */}
                                  {this.state.timeForOperationInMiliseconds >
                                    0 &&
                                    this.state.statusOperation ===
                                      "WAITING_FOR_PAYMENT" && (
                                      <Button
                                        color="orange"
                                        size="mini"
                                        disabled={
                                          !this.state.verificationStatus == "OK"
                                        }
                                        onClick={this.notifyPaid.bind(this)}
                                      >
                                        {t("buy.history.buttonMarkPayment")}
                                      </Button>
                                    )}

                                  <Files
                                    className={"imput-file-style"}
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
                                    <Button
                                      basic
                                      size="mini"
                                      color="grey"
                                      icon="paperclip"
                                      style={{
                                        marginBottom:
                                          window.innerWidth <= 495 ? 5 : 0,
                                      }}
                                      disabled={!this.state.addFile}
                                    >
                                      {t("buy.history.buttonAttachment")}
                                    </Button>
                                  </Files>
                                  <TakePhoto
                                    onHandlerFile={this.fileChangedHandler.bind(
                                      this
                                    )}
                                  />
                                  <Button
                                    color="blue"
                                    id="add-file-button-save"
                                    size="mini"
                                    style={{
                                      marginBottom:
                                        window.innerWidth <= 495 ? 5 : 0,
                                    }}
                                    onClick={this.handleSendMessage.bind(this)}
                                  >
                                    {t("buy.history.buttonSend")}
                                  </Button>
                                </Form.Group>
                                {this.state.timeForOperationInMiliseconds > 0 &&
                                  this.state.statusOperation ===
                                    "WAITING_FOR_PAYMENT" && (
                                    <div align="center">
                                      <Form.Field>
                                        <Button
                                          basic
                                          size="mini"
                                          color="red"
                                          compact
                                          onClick={this.cancelBuyConfirm.bind(
                                            this
                                          )}
                                        >
                                          {t("buy.history.buttonClose")}
                                        </Button>
                                      </Form.Field>
                                    </div>
                                  )}
                                <Form.Field width={6}>
                                  {labelMessageErrorAdjunto}
                                </Form.Field>
                                <Form.Group inline>
                                  <Form.Field
                                    style={{
                                      width:
                                        this.state
                                          .timeForOperationInMiliseconds <= 0 ||
                                        this.state.statusOperation ===
                                          "PAY_VERIFICATION" ||
                                        this.state.statusOperation ===
                                          "FINISHED" ||
                                        this.state.statusOperation ===
                                          "CANCELED"
                                          ? "100%"
                                          : "100%",
                                    }}
                                  >
                                    <Feed
                                      style={
                                        this.state
                                          .timeForOperationInMiliseconds > 0
                                          ? { height: 200, overflowY: "auto" }
                                          : { height: 180, overflowY: "auto" }
                                      }
                                    >
                                      {this.state.contactMessages.map(
                                        (message, i) => (
                                          <Feed.Event key={i}>
                                            <Feed.Label image={avatarNull} />
                                            <Feed.Content>
                                              <Feed.Summary>
                                                <a>
                                                  {message.userName ===
                                                  sessionStorage.getItem(
                                                    "username"
                                                  )
                                                    ? t("buy.history.labelMe")
                                                    : t(
                                                        "buy.history.labelModerator"
                                                      )}
                                                </a>
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
                                                      "buy.history.operationTimeLeft"
                                                    )
                                                  : message.message ===
                                                    "OPERATION TIMEOUT"
                                                  ? t(
                                                      "buy.history.operationTimeout"
                                                    )
                                                  : message.message.indexOf(
                                                      "was created"
                                                    ) != -1
                                                  ? t(
                                                      "buy.history.theOperation"
                                                    ) +
                                                    message.message
                                                      .split(" ")[2]
                                                      .slice(-4) +
                                                    t("buy.history.wasCreated")
                                                  : message.message.indexOf(
                                                      "change status to CLAIM"
                                                    ) != -1
                                                  ? t(
                                                      "buy.history.theOperation"
                                                    ) +
                                                    message.message
                                                      .split(" ")[2]
                                                      .slice(-4) +
                                                    t("buy.history.wasClaimed")
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
                                                        "buy.history.buttonSeeAttachment"
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
                                </Form.Group>
                              </Form>
                            </Container>
                          </Segment>
                        </Container>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              )}
            </Container>
          )}
          <Modal
            open={this.state.showModalCancelBuy}
            onClose={this.closeModalCancelBuy}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.history.modalCancel.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                {t("buy.history.modalCancel.content")}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div hidden={this.state.operationReady}>
                <Button
                  color="grey"
                  onClick={this.closeModalCancelBuy.bind(this)}
                >
                  {t("buy.history.modalCancel.buttonClose")}
                </Button>
                <Button
                  onClick={this.cancelBuy.bind(this)}
                  disabled={this.state.formLoad}
                  color="blue"
                >
                  {t("buy.history.modalCancel.buttonAccept")}
                </Button>
              </div>
            </Modal.Actions>
          </Modal>
          <Modal
            open={this.state.showModalTerminsAnsConditions}
            onClose={this.closeModalViewTerminosAndConditions.bind(this)}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.modalTerms.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Message info>
                  <TermsAndConditions />
                </Message>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div hidden={this.state.operationReady}>
                <Button
                  onClick={this.closeModalViewTerminosAndConditions.bind(this)}
                  color="grey"
                >
                  {t("buy.modalTerms.buttonClose")}
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
          {/* <canvas id="invoice" width="400" height="300">
              <div align="center"><h1>{t("buy.history.bill.header")}</h1></div>
            <br/>
              <div><label>{t("buy.history.bill.ticket")}:{" "}</label>{this.state.ticket}</div>
              <div><label>{t("buy.history.bill.time")}:{" "}</label>{this.state.hour.split(".")[0]}</div>
              <div><label>{t("buy.history.bill.date")}:{" "}</label>{this.state.dateOperation}</div>
              <div><label>{t("buy.history.bill.amountBTC")}:{" "}</label>{this.state.amountBTC}</div>
              <div><label>{t("buy.history.bill.currencyFiat")}:{" "}</label>{this.state.currency}</div>
              <div><label>{t("buy.history.bill.amountFiat")}:{" "}</label>{this.state.amountFiat}</div>
              <div><label>{t("buy.history.bill.appliedRate")}:{" "}</label>{this.state.price.toLocaleString("en-US", {
                  maximumFractionDigits: 2
              })}</div>
              <div><label>{t("buy.history.bill.tax")}:{" "}</label>{this.state.tax!=""?this.state.tax:0}</div>
              <div><label>{t("buy.history.bill.bankRate")}:{" "}</label>{this.state.bankRate!=""?this.state.bankRate:0}</div>
              <div><label>{t("buy.history.bill.issuingBank")}:{" "}</label>{this.state.issuingBank}</div>
              <div><label>{t("buy.history.bill.namePayer")}:{" "}</label>{this.state.nameOfThePayer}</div>
              <div><label>{t("buy.history.bill.receivingBank")}:{" "}</label>{this.state. bankDollarBTC}</div>
            </canvas>*/}
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Container>
            <Divider hidden></Divider>
            {/* <Header as="h4" textAlign="center" className="titleComponent" style={{fontWeight:"bold"}}>
              {t("buy.menu.myBuys")}
              </Header>
              <Divider style={{ marginTop: -10 ,borderColor:"#207ef2"}} /> */}
            {!this.state.isAuth && (
              <Header as="h5" textAlign="center">
                {t("buy.notAuth.part1")}{" "}
                <Link to="/login">{t("buy.notAuth.part2")}</Link>{" "}
                {t("buy.notAuth.part3")}{" "}
                <Link to="/registration">{t("buy.notAuth.part4")}</Link>{" "}
                {t("buy.notAuth.part5")}
              </Header>
            )}
            {this.state.isAuth && (
              <Container textAlign="justified" className="BuyBitcoins">
                {!this.state.tableReady && (
                  <Dimmer active inverted>
                    <Loader inverted>{t("buy.loading")}</Loader>
                  </Dimmer>
                )}
                {this.state.tableReady && (
                  <Grid>
                    <div
                      hidden={
                        this.state.statusOperation !== "WAITING_FOR_PAYMENT" ||
                        this.state.timeForOperationInMiliseconds <= 0
                      }
                    >
                      <Grid.Row columns={1} only="computer">
                        <br />
                        <Grid.Column>
                          <Message
                            info
                            content={t(
                              "buy.history.messages.sentProofValidPayment"
                            )}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </div>
                    <Grid.Row>
                      <Grid.Column
                        largeScreen={this.state.ceroOperations ? 16 : 10}
                        tablet={16}
                        mobile={16}
                        computer={10}
                        widescreen={this.state.ceroOperations ? 16 : 10}
                      >
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
                            isMobile ? "<" : t("buy.history.table.previous")
                          }
                          nextText={
                            isMobile ? ">" : t("buy.history.table.next")
                          }
                          loadingText={t("buy.history.table.loading")}
                          noDataText={t("buy.history.table.noData")}
                          pageText={t("buy.history.table.page")}
                          ofText={t("buy.history.table.of")}
                          rowsText={t("buy.history.table.rows")}
                          pageJumpText={t("buy.history.table.pageJump")}
                          rowsSelectorText={t("buy.history.table.rowsSelector")}
                          minRow={isMobile ? 6 : 8}
                          getTrProps={this.getTrProps}
                        />
                        {this.factura}
                      </Grid.Column>
                      <Responsive
                        as={Grid.Row}
                        {...Responsive.onlyMobile}
                        {...Responsive.onlyTablet}
                      >
                        {" "}
                        <Divider hidden />
                        <Message info>
                          {t("buy.history.messages.sentProof2")}
                          {
                            <strong>
                              {t("buy.history.buttonMarkPayment")}
                            </strong>
                          }{" "}
                        </Message>
                        <Divider hidden />
                      </Responsive>
                      <Grid.Column
                        mobile={16}
                        largeScreen={this.state.ceroOperations ? 0 : 6}
                        tablet={16}
                        computer={this.state.ceroOperations ? 0 : 6}
                        widescreen={this.state.ceroOperations ? 0 : 6}
                      >
                        <div hidden={this.state.ceroOperations}>
                          {isMobile && <Divider hidden />}
                          <Form>
                            <Form.Field>
                              <Button
                                fluid
                                color="blue"
                                href="/wallet"
                                onClick={this.goToWallet.bind(this)}
                              >
                                Wallet
                              </Button>
                            </Form.Field>
                            <Form.Field>
                              <Accordion fluid styled exclusive={false}>
                                <Accordion.Title
                                  active={this.state.activeIndexOne}
                                  index={0}
                                  onClick={this.handleClick.bind(this)}
                                >
                                  <Icon name="dropdown" />
                                  {t("buy.history.accordion.details")}
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
                                          {t("buy.history.accordion.operation")}{" "}
                                          <strong>
                                            {" "}
                                            {this.state.idOperationSelected.slice(
                                              -4
                                            )}
                                          </strong>
                                        </label>
                                      </Grid.Column>
                                      <Grid.Column textAlign="right">
                                        {this.state.statusOperation ===
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
                                  <Divider
                                    hidden
                                    style={{ margin: "2px 0px 2px 0px" }}
                                  />
                                  <div
                                    hidden={
                                      this.state.statusOperation !==
                                      "WAITING_FOR_PAYMENT_METHOD_VERIFICATION"
                                    }
                                  >
                                    <Message info>
                                      {
                                        this.state
                                          .listItemHistorialSinDatosBancarios
                                      }
                                    </Message>
                                  </div>
                                  <div
                                    hidden={
                                      this.state.statusOperation ===
                                      "WAITING_FOR_PAYMENT_METHOD_VERIFICATION"
                                    }
                                  >
                                    <Popup
                                      trigger={
                                        <span>
                                          <Message
                                            info
                                            size={"small"}
                                            style={{ textAlign: "left" }}
                                          >
                                            {listDetailsOperation}
                                          </Message>
                                        </span>
                                      }
                                      content={popupValues}
                                      position="top center"
                                      size="small"
                                      wide
                                    />
                                  </div>
                                </Accordion.Content>

                                <Accordion.Title
                                  active={this.state.activeIndexTwo}
                                  index={1}
                                  onClick={this.handleClickTwo.bind(this)}
                                >
                                  <Icon name="dropdown" />
                                  {t("buy.history.accordion.terms")}
                                </Accordion.Title>
                                <Accordion.Content
                                  active={this.state.activeIndexTwo}
                                >
                                  <Message info size={"small"}>
                                    {term.ters.item1.slice(0, 25)}
                                    <a
                                      class="linkVerMas"
                                      onClick={this.openModalTerminsAnsConditions.bind(
                                        this
                                      )}
                                    >
                                      {t("buy.history.accordion.seeMore")}
                                    </a>
                                  </Message>
                                </Accordion.Content>
                                {this.state.statusOperation === "SUCCESS" && (
                                  <Accordion.Title
                                    active={this.state.activeIndexThree}
                                    index={2}
                                    onClick={this.handleClickThree.bind(this)}
                                  >
                                    <Icon name="dropdown" />
                                    {t("buy.history.accordion.digitalBill")}
                                  </Accordion.Title>
                                )}
                                <Accordion.Content
                                  active={this.state.activeIndexThree}
                                >
                                  <Message
                                    info
                                    size={"small"}
                                    style={{ textAlign: "left" }}
                                  >
                                    <div>
                                      <label textAlign="left">
                                        <b>{t("buy.history.bill.ticket")}: </b>
                                      </label>
                                      {this.state.ticket}
                                    </div>
                                    <div>
                                      <label>
                                        <b>{t("buy.history.bill.time")}: </b>
                                      </label>
                                      {this.state.hour.split(".")[0]}
                                    </div>
                                    <div>
                                      <label>
                                        <b>{t("buy.history.bill.date")}: </b>
                                      </label>
                                      {this.state.dateOperation}
                                    </div>
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.amountBTC")}:{" "}
                                        </b>
                                      </label>
                                      {this.state.amountBTC}
                                    </div>
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.amountIn")}{" "}
                                          {this.state.currency}:{" "}
                                        </b>{" "}
                                      </label>
                                      {this.state.amountFiat}
                                    </div>
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.appliedRate")}:{" "}
                                        </b>
                                      </label>
                                      {this.state.price.toLocaleString(
                                        "en-US",
                                        {
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </div>
                                    {this.state.vat !== "" && (
                                      <div>
                                        <label>
                                          <b>{t("dynamicForm.labels.vat")}: </b>{" "}
                                        </label>
                                        {this.state.vat +
                                          " " +
                                          this.state.currencyVat}
                                      </div>
                                    )}
                                    {this.state.comissionBuy !== "" && (
                                      <div>
                                        <label>
                                          <b>
                                            {t("dynamicForm.labels.commission")}
                                            :{" "}
                                          </b>
                                        </label>
                                        {this.state.comissionBuy +
                                          " " +
                                          this.state.comissionCurrency}
                                      </div>
                                    )}
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.issuingBank")}:{" "}
                                        </b>
                                      </label>
                                      {this.state.issuingBank}
                                    </div>
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.namePayer")}:{" "}
                                        </b>
                                      </label>
                                      {this.state.nameOfThePayer}
                                    </div>
                                    <div>
                                      <label>
                                        <b>
                                          {t("buy.history.bill.receivingBank")}:{" "}
                                        </b>
                                      </label>
                                      {this.state.bankDollarBTC}
                                    </div>
                                    <Header textAlign="center">
                                      <Button
                                        className={"marginTopMedium"}
                                        color={"blue"}
                                        onClick={this.printInvoice.bind(this)}
                                        content={t(
                                          "buy.history.accordion.buttonDownload"
                                        )}
                                      />
                                    </Header>
                                  </Message>
                                </Accordion.Content>
                              </Accordion>
                            </Form.Field>
                            <Form.Field>
                              {this.state.timeForOperationInMiliseconds > 0 &&
                                this.state.statusOperation ===
                                  "WAITING_FOR_PAYMENT" && (
                                  <div className="padding-top-bottom-btn-marcar-pago">
                                    <Countdown
                                      date={
                                        this.state.localDateInMiliseconds +
                                        this.state.timeForOperationInMiliseconds
                                      }
                                      renderer={(props) => (
                                        <p>
                                          {t("buy.history.payWindow")}{" "}
                                          <strong>
                                            {" "}
                                            {Math.floor(
                                              props.total / (1000 * 60)
                                            )}{" "}
                                            {t("buy.history.minutes")}{" "}
                                          </strong>
                                        </p>
                                      )}
                                    />
                                  </div>
                                )}

                              {labelPAID}
                            </Form.Field>
                            {this.state.statusOperation === "CLAIM" && (
                              <Form.Field>
                                <Message
                                  color={"red"}
                                  content={t("buy.history.warningClaim")}
                                  className="padding-top-message"
                                />
                              </Form.Field>
                            )}
                            {(this.state.statusOperation === "SUCCESS" ||
                              this.state.statusOperation === "CANCELED") && (
                              <Form.Field>
                                <Divider hidden></Divider>
                                <Grid centered>
                                  <Button
                                    color="grey"
                                    size="mini"
                                    style={{
                                      borderRadius: "40px/40px",
                                      height: "40px",
                                      width: "200px",
                                    }}
                                    onClick={this.notifyClaim.bind(this)}
                                  >
                                    {t("buy.history.buttonClaim")}
                                  </Button>
                                </Grid>
                              </Form.Field>
                            )}
                            <Form.Field>
                              <Form.Group inline>
                                {this.state.timeForOperationInMiliseconds > 0 &&
                                  this.state.statusOperation ===
                                    "WAITING_FOR_PAYMENT" && (
                                    <Button
                                      color="orange"
                                      size="mini"
                                      disabled={
                                        !this.state.verificationStatus == "OK"
                                      }
                                      onClick={this.notifyPaid.bind(this)}
                                      style={{
                                        borderRadius: "40px/40px",
                                        height: "40px",
                                        width: "120px",
                                        marginRigth: 9,
                                        marginLeft: 10,
                                      }}
                                    >
                                      {t("buy.history.buttonMarkPayment")}
                                    </Button>
                                  )}
                                {this.state.timeForOperationInMiliseconds > 0 &&
                                  this.state.statusOperation ===
                                    "WAITING_FOR_PAYMENT" && (
                                    <Form.Field>
                                      <Button
                                        basic
                                        size="mini"
                                        color="red"
                                        style={{
                                          borderRadius: "40px/40px",
                                          height: "40px",
                                          width: "120px",
                                          marginLeft: 9,
                                        }}
                                        compact
                                        onClick={this.cancelBuyConfirm.bind(
                                          this
                                        )}
                                      >
                                        {t("buy.history.buttonClose")}
                                      </Button>
                                    </Form.Field>
                                  )}
                              </Form.Group>
                              <Divider hidden></Divider>
                            </Form.Field>
                            <Divider></Divider>
                            <div>
                              <textarea
                                rows={4}
                                placeholder={t(
                                  "buy.history.placeholderMessage"
                                )}
                                onKeyPress={this.handleKeyPressed.bind(this)}
                                onChange={this.handleChangeTextMessageNew.bind(
                                  this
                                )}
                                value={this.state.textMessageNew}
                              />
                            </div>
                            {/* <div>{labelMessageWithoutText}</div> */}
                            <Form.Field style={{ marginTop: -23 }}>
                              <Form.Group inline>
                                <Files
                                  className={"imput-file-style"}
                                  ref={this.selfRef}
                                  onChange={this.fileChangedHandler.bind(this)}
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
                                  <Divider hidden></Divider>
                                  <Button
                                    basic
                                    size="mini"
                                    color="grey"
                                    style={{
                                      borderRadius: "40px/40px",
                                      height: "40px",
                                      width: "125px",
                                      marginRigth: 10,
                                      marginLeft: 10,
                                    }}
                                    disabled={!this.state.addFile}
                                  >
                                    {t("buy.history.buttonAttachment")}
                                  </Button>
                                  <Divider hidden></Divider>
                                </Files>

                                <Button
                                  color="blue"
                                  id="add-file-button-save"
                                  size="mini"
                                  style={{
                                    borderRadius: "40px/40px",
                                    height: "40px",
                                    width: "125px",
                                    marginLeft: 10,
                                  }}
                                  onClick={this.handleSendMessage.bind(this)}
                                >
                                  {t("buy.history.buttonSend")}
                                </Button>
                              </Form.Group>
                            </Form.Field>
                            <Form.Field>
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

                            <Form.Field style={{ marginTop: 20 }}>
                              {/* <Form.Group inline> */}
                              <Grid centered>
                                {/* {(this.state.statusOperation ===
                                      "SUCCESS" || this.state.statusOperation ===
                                      "CANCELED")&& (
                                          <Button
                                              color="grey"
                                              size="mini"
                                              style={{borderRadius:"40px/40px",height:"40px",width:"200px"}}
                                              onClick={this.notifyClaim.bind(this)}
                                          >
                                            {t("buy.history.buttonClaim")}
                                          </Button>)} */}
                                {/* {this.state.timeForOperationInMiliseconds >
                                    0 &&
                                    this.state.statusOperation ===
                                      "WAITING_FOR_PAYMENT" && !this.state.termsAndConditionsAccepted && (
                                      <Popup
                                          trigger={
                                              <Button
                                                  color="orange"
                                                  size="mini"
                                              >
                                                  Marcar pago
                                              </Button>
                                          }
                                          content='Antes de marcar pago por favor acepta los términos y condiciones'
                                      />
                                    )}  */}
                                {/* {this.state.timeForOperationInMiliseconds >
                                  0 &&
                                  this.state.statusOperation ===
                                  "WAITING_FOR_PAYMENT" && (
                                              <Button
                                                  color="orange"
                                                  size="mini"
                                                  disabled={
                                                      !this.state.verificationStatus ==
                                                      'OK'
                                                  }
                                                  onClick={this.notifyPaid.bind(this)}
                                                  style={{borderRadius:"40px/40px",height:"40px",width:"200px"}}
                                              >
                                                {t("buy.history.buttonMarkPayment")}
                                              </Button>
                                  )} */}
                                {/* <Files
                                      className={"imput-file-style"}
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
                                    <Divider hidden></Divider>
                                     <Button
                                      basic
                                      size="mini"
                                      color="grey"
                                      style={{borderRadius:"40px/40px",height:"40px",width:"200px"}}
                                      disabled={!this.state.addFile}
                                    >
                                      {t("buy.history.buttonAttachment")}
                                    </Button>
                                    <Divider hidden></Divider>
                                  </Files> */}

                                {/* <Button
                                      color="blue"
                                      id="add-file-button-save"
                                      size="mini"
                                      style={{borderRadius:"40px/40px",height:"40px",width:"200px"}}
                                      onClick={this.handleSendMessage.bind(this)}
                                  >
                                    {t("buy.history.buttonSend")}
                                  </Button>  */}
                              </Grid>
                            </Form.Field>
                            {/* </Form.Group> */}
                            {/* {this.state.timeForOperationInMiliseconds >
                                0 && this.state.statusOperation === "WAITING_FOR_PAYMENT" && (<div align="center">
                                    <Form.Field>
                                      <Divider hidden></Divider>
                                    <Button
                                        basic
                                        size="mini"
                                        color="red"
                                        style={{borderRadius:"40px/40px",height:"40px",width:"200px"}}
                                        compact
                                        onClick={this.cancelBuyConfirm.bind(this)}
                                    >
                                      {t("buy.history.buttonClose")}
                                    </Button>
                                </Form.Field>
                                </div>)} */}
                            <Form.Field width={6}>
                              {labelMessageErrorAdjunto}
                            </Form.Field>
                            <Form.Group inline>
                              <Form.Field
                                style={{
                                  width:
                                    this.state.timeForOperationInMiliseconds <=
                                      0 ||
                                    this.state.statusOperation ===
                                      "PAY_VERIFICATION" ||
                                    this.state.statusOperation === "FINISHED" ||
                                    this.state.statusOperation === "CANCELED"
                                      ? "100%"
                                      : "100%",
                                }}
                              >
                                <Feed
                                  style={
                                    this.state.timeForOperationInMiliseconds > 0
                                      ? { height: 200, overflowY: "auto" }
                                      : { height: 180, overflowY: "auto" }
                                  }
                                >
                                  {this.state.contactMessages.map(
                                    (message, i) => (
                                      <Feed.Event key={i}>
                                        <Feed.Label image={avatarNull} />
                                        <Feed.Content>
                                          <Feed.Summary>
                                            <a>
                                              {message.userName ===
                                              sessionStorage.getItem("username")
                                                ? t("buy.history.labelMe")
                                                : t(
                                                    "buy.history.labelModerator"
                                                  )}
                                            </a>
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
                                                  "buy.history.operationTimeLeft"
                                                )
                                              : message.message ===
                                                "OPERATION TIMEOUT"
                                              ? t(
                                                  "buy.history.operationTimeout"
                                                )
                                              : message.message.indexOf(
                                                  "was created"
                                                ) != -1
                                              ? t("buy.history.theOperation") +
                                                message.message
                                                  .split(" ")[2]
                                                  .slice(-4) +
                                                t("buy.history.wasCreated")
                                              : message.message.indexOf(
                                                  "change status to CLAIM"
                                                ) != -1
                                              ? t("buy.history.theOperation") +
                                                message.message
                                                  .split(" ")[2]
                                                  .slice(-4) +
                                                t("buy.history.wasClaimed")
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
                                                    "buy.history.buttonSeeAttachment"
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
                            </Form.Group>
                          </Form>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
              </Container>
            )}
            <Modal
              open={this.state.showModalCancelBuy}
              onClose={this.closeModalCancelBuy}
              className="BuyBitcoins"
            >
              <Modal.Header>{t("buy.history.modalCancel.header")}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  {t("buy.history.modalCancel.content")}
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <div hidden={this.state.operationReady}>
                  <Button
                    color="grey"
                    onClick={this.closeModalCancelBuy.bind(this)}
                  >
                    {t("buy.history.modalCancel.buttonClose")}
                  </Button>
                  <Button
                    onClick={this.cancelBuy.bind(this)}
                    disabled={this.state.formLoad}
                    color="blue"
                  >
                    {t("buy.history.modalCancel.buttonAccept")}
                  </Button>
                </div>
              </Modal.Actions>
            </Modal>
            <Modal
              open={this.state.showModalTerminsAnsConditions}
              onClose={this.closeModalViewTerminosAndConditions.bind(this)}
              className="BuyBitcoins"
            >
              <Modal.Header>{t("buy.modalTerms.header")}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Message info>
                    <TermsAndConditions />
                  </Message>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <div hidden={this.state.operationReady}>
                  <Button
                    onClick={this.closeModalViewTerminosAndConditions.bind(
                      this
                    )}
                    color="grey"
                  >
                    {t("buy.modalTerms.buttonClose")}
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

              <Modal.Header>
                {t("buy.history.modalQualify.header")}
              </Modal.Header>
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
                    this.state.commentReview === "" &&
                    this.state.ratingQualify === 0
                  }
                >
                  {t("buy.history.modalQualify.send")}
                </Button>
                <Button
                  onClick={this.closeModalQualify.bind(this)}
                  color="grey"
                >
                  {t("buy.modalTerms.buttonClose")}
                </Button>
              </Modal.Actions>
            </Modal>
            {/* <canvas id="invoice" width="400" height="300">
              <div align="center"><h1>{t("buy.history.bill.header")}</h1></div>
            <br/>
              <div><label>{t("buy.history.bill.ticket")}:{" "}</label>{this.state.ticket}</div>
              <div><label>{t("buy.history.bill.time")}:{" "}</label>{this.state.hour.split(".")[0]}</div>
              <div><label>{t("buy.history.bill.date")}:{" "}</label>{this.state.dateOperation}</div>
              <div><label>{t("buy.history.bill.amountBTC")}:{" "}</label>{this.state.amountBTC}</div>
              <div><label>{t("buy.history.bill.currencyFiat")}:{" "}</label>{this.state.currency}</div>
              <div><label>{t("buy.history.bill.amountFiat")}:{" "}</label>{this.state.amountFiat}</div>
              <div><label>{t("buy.history.bill.appliedRate")}:{" "}</label>{this.state.price.toLocaleString("en-US", {
                  maximumFractionDigits: 2
              })}</div>
              <div><label>{t("buy.history.bill.tax")}:{" "}</label>{this.state.tax!=""?this.state.tax:0}</div>
              <div><label>{t("buy.history.bill.bankRate")}:{" "}</label>{this.state.bankRate!=""?this.state.bankRate:0}</div>
              <div><label>{t("buy.history.bill.issuingBank")}:{" "}</label>{this.state.issuingBank}</div>
              <div><label>{t("buy.history.bill.namePayer")}:{" "}</label>{this.state.nameOfThePayer}</div>
              <div><label>{t("buy.history.bill.receivingBank")}:{" "}</label>{this.state. bankDollarBTC}</div>
            </canvas>*/}
          </Container>
        </Responsive>
      </div>
    );
  }
}
export default translate(FormHistoryBuyBitcoins);
