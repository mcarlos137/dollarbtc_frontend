import React, { Component } from "react";
import "../SellBitcoins.css";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Segment,
  Form,
  Select,
  Grid,
  Label,
  Modal,
  Image,
  Message,
  Input,
  Header,
  TextArea,
} from "semantic-ui-react";
import "react-table/react-table.css";
import brokers from "../../../services/brokers";
import NumberFormat from "react-number-format";
import otcAPI from "../../../services/otc";
import paymentApi from "../../../services/payment";
import currency from "../../../common/currency";
import TermsAndConditions from "../../TermsAndConditions/TermsAndConditions";
import term from "../../../common/termAndConditionsSell";
import { parse } from "query-string";
import ModalSendSellBitcoins from "../Modals/ModalSendSellBitcoins";
import user from "../../../services/user";
import DinamicForm from "../../DinamicForm/DinamicForm";
import axios from "axios";
import translate from "../../../i18n/translate";
import Concate from "unique-concat";
import { isMobile } from "react-device-detect";
import config from "../../../services/config";
const URL_BASE_CORE = config.apiDollarBtcUrl;
class FormSellBitcoins extends Component {
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
      typeCurrency: "",
      color: "",
      paymentDollar: "",
      viewBrokerOffer: false,
      varlog: false,
      constantPaymentsTypes: mapPayments,
      currencyLabelSelected: "", //guarda el nombre de la moneda selecciona.
      isCurrencySelected: false, // se usa para mostrar ciertos label justo luego que se selecciona la moneda fiat.
      minAmount: 0, //monto minimo fiat para cada operación de venta.
      maxAmount: 0, //monto minimo fiat para cada operación de venta.
      price: 0, //precio del bitcoin que se obtiene para la operación en getOffers.
      prices: [], // guarda todos los prices de las diferendtes monedas.
      priceForCalculator: 0, //precio del bitcoin que se obtiene para la operación en getOffers
      currencies: [], // guarda todas las modenas fiat en forma estatica. Este array se filtra por las monedas asociadas.
      payments: [], //contiene todos los pagos asociados a la moneda que selecciono el usuario.
      typePayments: [], // contiene todos las formas de pagos.
      paymentsFromUserForSelect: [], //contiene todos las formas de pagos asociados al usuario formateados para el select.
      typePaymentsFormaterBySelect: [], //contine los typos de pagos que se muestran en el combo de metodos de pago.
      cheboxesPayments: [], // contiene todos los payments asociados a la forma de pago seleccionado previamente.
      paymentSelected: "", //Contiene el payment seleccionado en el combo.
      commentInitial: "", // comentario inical en la operación.
      amountFiat: "", //monto
      amountBitcoins: "",
      allowToAddPayment: false,
      isCreatedPayment: false, //Indica si el usuario ha seleccionado un type de pago que ha registrado previamente.
      isCheckedAddPayment: true,
      errorAmountFiat: false,
      errorTerms: false,
      balanceBitcoins: "",
      message: "",
      errorMoneda: false,
      errorPayment: false,
      openSellConfirm: false,
      bodySellBitCoins: null,
      bank: "",
      holderId: "",
      accountHolder: "",
      accountNumber: "",
      userEmail: "",
      username: "",
      userName: "",
      errorBank: "",
      errorAccountNumber: false,
      errorAccountHolder: false,
      errorHolderId: false,
      errorUserEmail: false,
      errorUsername: false,
      isAuth: user.getUserAuth(),
      paymentsForClients: null,
      paymentsDollarBTC: null,
      banksForSelect: [],
      namePaymenType: "",
      fields: [],
      paymentBody: [],
      paymentTypeKeySelected: "",
      emailSendSuccess: false,
      statusVerificationUser: {},
      hasVerificationEmail: false,
      loading: true,
      listPaymentDolarBtc: [],
      allMessageTerminsAndConditions: [],
      pricetosend: 0,
      loadingForm: true,
      notPaymentMethods: true,
      forexPrice: "",
      localBitCoinPrice: "",
      keyForm: Math.random(),
      keyPayments: Math.random(),
      keyAccountReceiver: Math.random(),
      notOfer: true,
      errorAmountCrypto: false,
      checkterm: false,
      showModalTerm: false,
      textTerm: [],
      translator: props.translate,
      isElectronicTrans: false,
      typeBankSelect: "",
      typePaymentsAvailableToCurrency: [],
      errorAccountTypeReceiver: false,
      paymentType: "",
      paymentId: "",
      brokeruserName: null,
      accountTypesReceiver: [
        {
          text: props.translate("sell.form.typeReceiverAccount.own"),
          value: "OWN_ACCOUNT",
          key: "own",
        },
        {
          text: props.translate("sell.form.typeReceiverAccount.thirdParties"),
          value: "THIRD_PARTIES",
          key: "third",
        },
        // {
        //   text: props.translate("sell.form.typeReceiverAccount.moneyClick"),
        //   value: "MONEYCLICK",
        //   key: "moneyclick",
        //   disabled: "yes"
        // },
        {
          text: props.translate("sell.form.typeReceiverAccount.creditCard"),
          value: "CREDITCARD",
          key: "creditcard",
          disabled: "yes",
        },
      ],
      optionsReceiptOfFunds: [
        {
          text: props.translate("sell.form.typeReceiverFund.cash"),
          value: "CASH_DEPOSIT",
          key: "cash",
        },
        {
          text: props.translate(
            "sell.form.typeReceiverFund.electronicTransfer"
          ),
          value: "ELECTRONIC",
          key: "electronic",
        },
      ],
      accountTypeSelected: "",
      paymentsFromUserForSelectByType: [],
      emailReceiver: "",
      errorEmailReceiver: false,
      operationConcept: "",
      errorOperationConcept: false,
      messageTerminsAndConditions: [],
      specialValue: false,
      chargesByOperation: [],
      typeReceiverFundSelected: "",
      officeInfo: [],
      officeInfoView: [],
      activeTypeReceiver: false,
    };
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
    this.handleChangeCurrencySelect = this.handleChangeCurrencySelect.bind(
      this
    );
    this.handleSubmitSellBitcoins = this.handleSubmitSellBitcoins.bind(this);
    this.handlePaymentSelected = this.handlePaymentSelected.bind(this);
    this.handleAmountBitcoins = this.handleAmountBitcoins.bind(this);
    //this.handleChangePaymentType = this.handleChangePaymentType.bind(this);
    this.blankErrors = this.blankErrors.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.getOffersNew = this.getOffersNew.bind(this);
    this.handleChangeAccountTypeReceiver = this.handleChangeAccountTypeReceiver.bind(
      this
    );
    this.handleChangeTypeReceptionFund = this.handleChangeTypeReceptionFund.bind(
      this
    );
    this.handleEmailReceiver = this.handleEmailReceiver.bind(this);
    this.handleOperationConcept = this.handleOperationConcept.bind(this);
    this._isMounted = false;
  }

  getPriority(paymentType) {
    let priority = 0;
    switch (paymentType) {
      case "TRANSFER_WITH_SPECIFIC_BANK":
        priority = 0;
        break;
      case "TRANSFER_NATIONAL_BANK":
        priority = 1;
        break;
      case "WIRE_TRANSFER":
        priority = 2;
        break;
      case "CASH_DEPOSIT":
        priority = 3;
        break;
      default:
        priority = 4;
    }
    return priority;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({ messageTerminsAndConditions: [] });
      let messageToPush = [];
      for (let messsage of this.state.allMessageTerminsAndConditions) {
        if (messsage.language === nextProps.language) {
          messageToPush.push(
            <Message
              key={messsage.color}
              color={messsage.color}
              //content={value}
              content={messsage.text}
            />
          );
        }
      }
      this.setState(
        {
          translator: nextProps.translate,
        },
        () => {
          this.setState({ messageTerminsAndConditions: messageToPush });
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
            constantPaymentsTypes: mapPayments,
            accountTypesReceiver: [
              {
                text: nextProps.translate("sell.form.typeReceiverAccount.own"),
                value: "OWN_ACCOUNT",
                key: "own",
              },
              {
                text: nextProps.translate(
                  "sell.form.typeReceiverAccount.thirdParties"
                ),
                value: "THIRD_PARTIES",
                key: "third",
              },
              {
                text: nextProps.translate(
                  "sell.form.typeReceiverAccount.moneyClick"
                ),
                value: "MONEYCLICK",
                key: "moneyclick",
                disabled: "yes",
              },
              {
                text: nextProps.translate(
                  "sell.form.typeReceiverAccount.creditCard"
                ),
                value: "CREDITCARD",
                key: "creditcard",
                disabled: "yes",
              },
            ],
          });
        }
      );

      if (this.state.officeInfo.length > 0) {
        let arrayInfo = [];
        for (let info of this.state.officeInfo) {
          let obj = {
            fullInfo: info,
            value: [],
          };
          Object.entries(info).forEach(([key, val]) => {
            if (key === "website") {
              let v = "";
              if (isMobile) {
                v = val.substring(0, 20) + "...";
              } else {
                v = val;
              }
              obj.value.push(
                <span key={key} style={{ textAlign: "left" }}>
                  <b>
                    {nextProps.translate("officeInfo." + key)}
                    {": "}
                    <a href={val} target="_blank">
                      {v}
                    </a>
                  </b>
                  <br />
                </span>
              );
            } else if (key.includes("phone") && val !== "") {
              obj.value.push(
                <span key={key} style={{ textAlign: "left" }}>
                  <b>{nextProps.translate("officeInfo.phone")}</b>
                  {": " + val}
                  <br />
                </span>
              );
            } else if (!key.includes("phone") && val !== "") {
              obj.value.push(
                <span key={key} style={{ textAlign: "left" }}>
                  <b>{nextProps.translate("officeInfo." + key)}</b>
                  {": " + val}
                  <br />
                </span>
              );
            }
          });
          arrayInfo.push(obj);
        }
        this.setState({ officeInfoView: arrayInfo });
      }
    }
  }
  componentDidMount() {
    this.getWalletBalanceDBC();

    this._isMounted = true;
    let arr = [];
    Object.entries(term.ters).forEach(([key, value]) => {
      arr.push(key);
    });

    this.setState({ textTerm: arr });
    this.onLoadPrices();
    if (typeof parse(window.location.search).id !== "undefined") {
      this.redirectToMySells();
    } else {
      const query = parse(window.location.search);
      if (query.c !== undefined) {
        this.setState({ queryFromUrl: query.c });
        this.onLoadPrices();
      } else {
        this.onLoadPrices();
      }
    }
  }
  redirectToMySells() {
    if (this._isMounted) {
      this.setState({
        openSellConfirm: false,
      });
      this.props.redirectToMySell();
    }
  }
  onLoadPrices = () => {
    let values = [];
    if (this._isMounted) {
      let keys = [];
      otcAPI
        .getCurrencies()
        .then((res) => {
          this.setState({ loadingForm: false });
          this.getCoins();
          for (let currency of res.data) {
            keys.push(currency.shortName);
          }
          values = currency.currencies.filter((currency) => {
            return keys.find((key) => key === currency.alias);
          });
          
          this.setState(
            {
              prices: res.data,
              currencies: values,
            },
            () => {
              this.readUrlWhitParams();
              if (this.state.queryFromUrl !== undefined) {
                let q = this.state.queryFromUrl;
                let curren = values.find(function (element) {
                  return element.value === q;
                });
                this.handleChangeCurrency(null, curren);
                // var uri = window.location.toString();
                // if (uri.indexOf("?") > 0) {
                // 	var clean_uri = uri.substring(0, uri.indexOf("?"));
                // 	window.history.replaceState({}, document.title, clean_uri);
                // }
              }
            }
          );
        })
        .catch((error) => {});
    }
  };
  getCoins() {
    axios.get(URL_BASE_CORE + "/analysis/getFullPriceInfo").then((res) => {
      let map = new Map();
      Object.entries(res.data).forEach(([key, value]) => {
        map.set(key, value);
      });
      this.setState({ mapPrice: map }, () => {});
    });
  }
  handleChangeCurrencySelect(event, data) {
    this.setState({ typeReceiverFundSelected: "", activeTypeReceiver: false });
    this.handleChangeCurrency(data.value);
  }
  handleChangeCurrency(data) {
    if (this.state.varlog === false) {
      this.setState({
        minAmount: "",
        minAmountNumber: "",
        maxAmount: "",
        maxAmountNumber: "",
        pricetosend: "",
        priceForCalculator: "",
        price: "",
        isCurrencySelected: false,
        messageTerminsAndConditions: [],
        notOfer: true,
        imgCurrencySelected: "",
        checkterm: false,
        localBitCoinPrice: "",
        forexPrice: "",
        typeCurrency: "",
        isElectronicTrans: false,
        accountTypeSelected: "",
        emailReceiver: "",
        operationConcept: "",
        viewMessage: false,
        officeInfoView: [],
      });
      this.setState({
        paymentTypeKeySelected: "",
        //automatic: null,
        fields: [],
      });
      this.setState({
        typeBankSelect: "",
        allowToAddPayment: false,
        paymentSelected: "",
        paymentsFromUserForSelect: [],
        paymentsFromUserForSelectByType: [],
        isCreatedPayment: false,
      });
      this.setState({
        typePaymentsFormaterBySelect: [],
        paymentsForClients: null,
        typePaymentsBankBySelect: [],
        loadingForm: true,
      });
      this.setState({ currencyLabelSelected: data });

      this.setState({ listPaymentDolarBtc: [], notPaymentMethods: true });
      this.setState({ listOfertsByCurrency: [] });

      otcAPI.getOffersByCurrency(data).then(
        (r) => {
          Object.entries(r.data).forEach(([key, value]) => {
            let keys = Object.keys(value);
            if (keys.length > 0) {
              Object.entries(value).forEach(([inerKey, inerValue]) => {
                if (inerKey.indexOf("BID") !== -1) {
                  let ofert = {
                    key: inerKey,
                    value: inerValue,
                    priority: this.getPriority(inerKey.split("__")[2]),
                  };

                  this.setState(
                    {
                      listOfertsByCurrency: [
                        ...this.state.listOfertsByCurrency,
                        ofert,
                      ],
                    },
                    () => {
                      this.setState(
                        {
                          listOfertsByCurrency: this.state.listOfertsByCurrency.sort(
                            (a, b) => (a.priority > b.priority ? 1 : -1)
                          ),
                        },
                        () => {
                          let offerCash = this.state.listOfertsByCurrency.find(
                            function (element) {
                              return (
                                element.key.split("__")[2] === "CASH_DEPOSIT"
                              );
                            }
                          );
                          if (offerCash !== undefined) {
                            this.setState({
                              typeReceiverFundSelected: "",
                              activeTypeReceiver: false,
                            });
                          } else {
                            this.setState({
                              typeReceiverFundSelected: "ELECTRONIC",
                              activeTypeReceiver: true,
                            });
                          }
                        }
                      );
                    }
                  );
                }
              });
              otcAPI.getPayments(data, "dollarBTC").then((resp) => {
                for (let payment of resp.data) {
                  if (payment.type === "TRANSFER_TO_CRYPTO_WALLET") {
                    this.setState({ typeCurrency: "crypto" });
                    break;
                  } else {
                    continue;
                  }
                }
                this.setState({ loadingForm: false });
                let value = this.state.mapPrice.get(data);

                let paymentForCurrency = this.state.prices.find(function (ele) {
                  return ele.shortName === data;
                });
                if (value !== undefined) {
                  this.setState({
                    forexPrice: value.forex.usdRate,
                    localBitCoinPrice: value.localBitcoins.usdPrice,
                  });
                }
                this.setState({
                  paymentdata: paymentForCurrency,
                  currencyLabelSelected: data,
                });
                if (resp.data.length > 0) {
                  this.setState({
                    listPaymentDolarBtc: resp.data,
                    notPaymentMethods: false,
                  });
                  this.state.currencies
                    .filter((currency) => {
                      return data === currency.alias;
                    })
                    .map((currencySelected) => {
                      this.setState({
                        imgCurrencySelected: currencySelected.img,
                      });
                    });
                  this.getClientPaymentType(data);
                  if (sessionStorage.getItem("auth") !== "true") {
                    for (
                      let c = 0;
                      c < this.state.listOfertsByCurrency.length;
                      c++
                    ) {
                      var offerFirst = this.state.listOfertsByCurrency[0];
                    }
                    if (offerFirst !== undefined) {
                      Object.entries(offerFirst).forEach(([offer, value]) => {
                        if (offer === "key") {
                          let typeOffer = value.split("__")[0];
                          let paymentId = value.split("__")[1];
                          let paymentType = value.split("__")[2];

                          this.getOffersNew(paymentId, paymentType, typeOffer);
                        }
                      });
                    }
                  }
                } else {
                  this.setState({
                    viewMessage: true,
                    message: "sell.form.errors.notPaymentMethods",
                    messageTerminsAndConditions: "",
                  });
                  setTimeout(() => {
                    this.setState({ viewMessage: false, message: "" });
                  }, 6000);
                }
              });
            } else {
              this.setState({ notOfer: true });
              this.setState({
                viewMessage: true,
                notPaymentMethods: true,
                loadingForm: false,
                message: "sell.form.errors.notOffersByCurrency",
              });
            }
          });
        },
        (error) => {
          this.setState({ notOfer: true });
          this.setState({
            viewMessage: true,
            notPaymentMethods: true,
            loadingForm: false,
            message: "sell.form.errors.notOffersByCurrency",
          });
        }
      );
    } else {
      this.setState({
        paymentTypeKeySelected: "",
        //automatic: null,
        fields: [],
      });
      this.setState({
        typeBankSelect: "",
        allowToAddPayment: false,
        officeInfoView: [],
        //paymentSelected: "",
        paymentsFromUserForSelect: [],
        //paymentsFromUserForSelectByType: [],
        isCreatedPayment: false,
      });
      this.setState({
        typePaymentsFormaterBySelect: [],
        paymentsForClients: null,
        typePaymentsBankBySelect: [],
        loadingForm: false,
      });
      this.setState({ currencyLabelSelected: data });

      this.setState({ listPaymentDolarBtc: [] });
      this.setState({ listOfertsByCurrency: [] });
      otcAPI.getDollarBTCPayment(data, this.state.paymentId).then((r) => {
        let pay = {};
        Object.entries(r.data).forEach(([key, value]) => {
          if (
            key !== "types" &&
            key !== "acceptIn" &&
            key !== "acceptOut" &&
            key !== "active" &&
            key !== "sendToPayments" &&
            key !== "buybalance"
          ) {
            Object.defineProperty(pay, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          }

          pay.type = this.state.paymentType;
          this.setState({
            paymentDollar: pay,
            joinField: pay.joinField,
            paymentTypeKeySelected: pay.type,
          });
        });
      });
    }
  }

  changueAmountBtc(value, prices, body) {
    this.setState({ amountBitcoins: value, pricetosend: prices }, () => {
      this.setState({
        bodySellBitCoins: body,
      });
    });
  }

  getClientPaymentType(currency) {
    this.setState({
      typePaymentsFormaterBySelect: [],
      // paymentsForClients: null,
      typePaymentsBankBySelect: [],
    });
    otcAPI.getClientPaymentTypeForCurrency(currency).then((res) => {
      let arrayPaymentsAllowToAddPayment = [];
      let arrayBanks = [];
      let myMapOfFields = new Map();
      let myMapOfMessages = new Map();
      for (let clientPaymentType of res.data) {
        if (
          clientPaymentType.allowToAddPayment !== undefined &&
          clientPaymentType.allowToAddPayment &&
          clientPaymentType.name !== "CREDIT_CARD"
        ) {
          //get Fields to show

          for (let field of clientPaymentType.fields) {
            if (field.name === "bank") {
              if (clientPaymentType.name === "TRANSFER_WITH_SPECIFIC_BANK") {
                field.values = field.values.map(function (element) {
                  return element + "**";
                });
              }
              arrayBanks = Concate(arrayBanks, field.values, null);
              field.values = arrayBanks;
            }
            myMapOfFields.set(field.name, field);
          }
          for (var [key, value] of Object.entries(clientPaymentType.messages)) {
            myMapOfMessages.set(key, value);
          }
        }
      }

      this.setState(
        {
          fields: Array.from(myMapOfFields.values()),
        },
        () => {}
      );

      this.setState({ typePaymentsAvailableToCurrency: res.data });

      this.onLoadPayments(this.state.currencyLabelSelected);
    });
  }
  onLoadPayments = (moneda) => {
    otcAPI
      .getPayments(moneda, sessionStorage.getItem("username"))
      .then((res) => {
        this.setState({
          paymentsFromUserForSelect: [],
        });
        let item = {
          text: this.state.translator("sell.form.create"),
          value: "crear",
        };
        this.state.paymentsFromUserForSelect.push(item);
        for (let i = 0; i < res.data.length; i++) {
          let array = " ";
          //Aqui se debe establecer una ondicion para decidir que tipo de operación es (cuentas propias o envios de dinero)
          // Hay que agregar el combo como la primera opcion para que seleccione el tipo de operación y de alli mostrar los siguientes combos
          if (res.data[i].type !== "CREDIT_CARD") {
            Object.entries(res.data[i]).forEach(([key, val]) => {
              if (
                key !== "id" &&
                key !== "messages" &&
                key !== "active" &&
                key !== "type" &&
                key !== "acceptIn" &&
                key !== "acceptOut" &&
                key !== "joinField" &&
                key !== "payWindow" &&
                key !== "automaticCharge" &&
                key !== "verified" &&
                key !== "forceVerification" &&
                key !== "automatic" &&
                key !== "accountBalance" &&
                key !== "accountCurrency" &&
                key !== "accountStatus" &&
                key !== "sendToPayments" &&
                key !== "buyBalance"
              ) {
                array = array + " - " + val;
              }
            });
            item = {
              text: array.substring(3),
              value: res.data[i],
            };

            this.state.paymentsFromUserForSelect.push(item);
          }
        }
        this.setState({
          payments: res.data,
          paymentsFromUserForSelect: this.state.paymentsFromUserForSelect,
        });
      })
      .catch((error) => {});
  };
  handlePaymentSelected = (event, data) => {
    if (this.state.varlog === true) {
      this.setState({
        checkterm: false,
        emailReceiver: "",
        operationConcept: "",
      });
      if (data.value === "crear") {
        this.setState({
          isCreatedPayment: true,
          allowToAddPayment: true,
        });
      } else {
        this.setState({
          isCreatedPayment: false,
          allowToAddPayment: false,
        });
      }
    } else {
      this.setState({
        minAmount: "",
        minAmountNumber: "",
        maxAmount: "",
        maxAmountNumber: "",
        pricetosend: "",
        priceForCalculator: "",
        price: "",
        isCurrencySelected: false,
        checkterm: false,
        typeBankSelect: "",
        amountBitcoins: "",
        amountFiat: "",
        isCreatedPayment: false,
        notOfer: true,
        isElectronicTrans: false,
        emailReceiver: "",
        operationConcept: "",
        allowToAddPayment: false,
        messageTerminsAndConditions: [],
      });
    }

    let keys = Object.keys(data.value);
    if (keys.indexOf("bank") !== -1) {
      let value = data.value.bank;
      for (let paymentType of this.state.typePaymentsAvailableToCurrency) {
        for (let field of paymentType.fields) {
          if (field.name === "bank") {
            if (field.values.indexOf(value) !== -1) {
              data.value.type = paymentType.name;
              data.value.messages = paymentType.messages;
            } else {
              if (data.value.type === paymentType.name) {
                data.value.messages = paymentType.messages;
              }
            }
          }
        }
      }
    } else {
      for (let typePay of this.state.typePaymentsAvailableToCurrency) {
        Object.entries(typePay).forEach(([key, val]) => {
          if (key === "name") {
            if (val === data.value.type) {
              data.value.messages = typePay.messages;
            }
          }
        });
      }
    }
    this.setState({
      // fields: [],
      paymentBody: [],
      paymentSelected: data.value,
    });
    let pass = true;
    if (pass === true) {
      if (data.value === "crear") {
        this.setState({
          isCreatedPayment: true,
          allowToAddPayment: true,
        });

        this.setPaymentDollarBTC();
      } else {
        let array = [];
        let paymentDollar;

        if (this.state.varlog === false) {
          for (let dollarpay of this.state.listPaymentDolarBtc) {
            if (dollarpay.joinField !== undefined) {
              let joinField = dollarpay.joinField;
              // joinFieldValue = dollarpay.joinFieldValue;
              if (dollarpay.joinFieldValue === true) {
                if (dollarpay.active && dollarpay.acceptOut) {
                  Object.entries(data.value).forEach(([key, value]) => {
                    if (key === joinField) {
                      let findValueMacht = value;
                      Object.entries(dollarpay).forEach(
                        ([dollarkey, dollarval]) => {
                          if (dollarkey === joinField) {
                            if (findValueMacht === dollarval) {
                              array.push(dollarpay);
                            }
                          }
                        }
                      );
                    }
                  });
                }
              } else {
                if (dollarpay.active && dollarpay.acceptOut) {
                  array.push(dollarpay);
                }
              }
            } else {
              if (dollarpay.active && dollarpay.acceptOut) {
                array.push(dollarpay);
              }
            }
          }
          if (array.length > 0) {
            let ofert;
            let minOfert = 99999999999999;

            for (let ofertList of this.state.listOfertsByCurrency) {
              let partial = ofertList.key.split("__");
              if (partial[2] === data.value.type) {
                for (let payment of array) {
                  if (
                    payment.type === data.value.type &&
                    payment.id === partial[1]
                  ) {
                    if (ofertList.value.price < minOfert) {
                      minOfert = ofertList.value.price;
                      ofert = ofertList;
                      paymentDollar = payment;
                    }
                  }
                }
              }
            }

            if (ofert !== undefined) {
              for (let payment of array) {
                if (ofert.key.indexOf(payment.id) !== -1) {
                  paymentDollar = payment;
                  break;
                } else {
                  continue;
                }
              }
              this.setState({ paymentDollar: paymentDollar });
              this.getOffersNew(paymentDollar.id, data.value.type, "BID");
            } else {
              let val = Math.floor(Math.random() * array.length);
              paymentDollar = array[val];
              this.setState({ paymentDollar: paymentDollar });
              this.getOffersNew(paymentDollar.id, data.value.type, "BID");
            }
            Object.entries(data.value).forEach(([key, val]) => {
              if (key !== "id" && key !== "messages" && key !== "type") {
                let item = {
                  [key]: val,
                };
                this.state.paymentBody.push(item);
              }
            });
            if (paymentDollar.messages !== undefined) {
              this.loadMessages(paymentDollar.messages);
            } else {
              this.loadMessages(
                this.state.typePaymentsAvailableToCurrency.filter(
                  (paymentType) => paymentType.name === paymentDollar.type
                )[0].messages
              );
            }
            this.setState({
              paymentBody: this.state.paymentBody,
              paymentTypeKeySelected: data.value.type,
              isCreatedPayment: false,
            });
          } else {
            let arrayValid = [];
            for (let dollarpay of this.state.listPaymentDolarBtc) {
              if (dollarpay.type === data.value.type) {
                if (dollarpay.active && dollarpay.acceptOut) {
                  arrayValid.push(dollarpay);
                }
              }
            }
            if (arrayValid.length > 0) {
              let ofert;
              let minOfert = 99999999999999;
              for (let ofertList of this.state.listOfertsByCurrency) {
                if (ofertList.key.indexOf(data.value.type) !== -1) {
                  if (ofertList.value.price < minOfert) {
                    minOfert = ofertList.value.price;
                    ofert = ofertList;
                  }
                }
              }

              if (ofert !== undefined) {
                for (let payment of arrayValid) {
                  if (ofert.key.indexOf(payment.id) !== 1) {
                    paymentDollar = payment;
                    break;
                  }
                }
                this.setState({ paymentDollar: paymentDollar });
                this.getOffersNew(paymentDollar.id, data.value.type, "BID");
              } else {
                let val = Math.floor(Math.random() * arrayValid.length);
                paymentDollar = arrayValid[val];

                this.setState({ paymentDollar: paymentDollar });
                this.getOffersNew(paymentDollar.id, data.value.type, "BID");
              }
              Object.entries(data.value).forEach(([key, val]) => {
                if (key !== "id" && key !== "messages" && key !== "type") {
                  let item = {
                    [key]: val,
                  };
                  this.state.paymentBody.push(item);
                }
              });
              if (paymentDollar.messages !== undefined) {
                this.loadMessages(paymentDollar.messages);
              } else {
                this.loadMessages(
                  this.state.typePaymentsAvailableToCurrency.filter(
                    (paymentType) => paymentType.name === paymentDollar.type
                  )[0].messages
                );
              }

              this.setState({
                paymentBody: this.state.paymentBody,
                paymentTypeKeySelected: data.value.type,
                isCreatedPayment: false,
              });
            } else {
              this.setState({
                viewMessage: true,
                typeBankSelect: "",
                amountBitcoins: "",
                amountFiat: "",
                isCurrencySelected: false,
                isCreatedPayment: false,
                message: "sell.form.errors.paymentMethodsNotAvailable",
                messageTerminsAndConditions: "",
              });
              setTimeout(() => {
                this.setState({
                  viewMessage: false,
                  message: "",
                  keyForm: Math.random(),
                  keyPayments: Math.random(),
                  keyAccountReceiver: Math.random(),
                });
              }, 7000);
            }
          }
        } else {
          Object.entries(data.value).forEach(([key, val]) => {
            if (key !== "id" && key !== "messages" && key !== "type") {
              let item = {
                [key]: val,
              };
              this.state.paymentBody.push(item);
            }
          });
          if (this.state.paymentDollar.messages !== undefined) {
            this.loadMessages(this.state.paymentDollar.messages);
          }

          this.setState({
            paymentBody: this.state.paymentBody,
            paymentTypeKeySelected: data.value.type,
            isCreatedPayment: false,
          });
        }
      }
    } else {
      this.setState({
        viewMessage: true,
        typeBankSelect: "",
        amountBitcoins: "",
        amountFiat: "",
        isCurrencySelected: false,
        isCreatedPayment: false,
        message: "sell.form.errors.paymentMethodsNotAvailable",
        messageTerminsAndConditions: "",
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          message: "",
          keyForm: Math.random(),
          keyPayments: Math.random(),
          keyAccountReceiver: Math.random(),
        });
      }, 7000);
    }
  };
  getOffersNew(payment, typePayment, typeOfert) {
    if (this.state.viewBrokerOffer === true) {
      let query = parse(window.location.search);
      if (query === "" || query === null) {
      } else {
        let tokenUrl = "";
        let typeOffer = "";
        if (query.offerKey !== undefined) {
          tokenUrl = query.offerKey;
          typeOffer = "offerKey";
        } else if (query.brokerOfferKey !== undefined) {
          tokenUrl = query.brokerOfferKey;
          typeOffer = "brokerOfferKey";
        }

        brokers.getOfferByUrl(tokenUrl).then((res) => {
          for (let i in res.data) {
            if (res.data.offerType === "BID") {
              let currency = res.data.currency;
              let paymentType = res.data.paymentType;
              let maxPerOperAmount = res.data.maxPerOperationAmount;
              let minPerOperAmount = res.data.minPerOperationAmount;
              //let totalamount = 6000//revisar el servicio esta mandando montos por encima de los limites
              let price = res.data.price;
              let paymentId = res.data.paymentId;

              this.setState({
                currencyLabelSelected: currency,
                dollarBTCPaymentTypeElectronicSelected: paymentType,
                minAmount: minPerOperAmount,
                maxAmount: maxPerOperAmount,
                maxAmountNumber: maxPerOperAmount,
                minAmountNumber: minPerOperAmount,
                priceForCalculator: price,
                priceUSD: price,
                // amountFiat: totalamount,
                brokeruserName: res.data.userName,
                paymentType: paymentType,
                paymentId: paymentId,
                viewBrokerOffer: true,
              });
            }
          }
        });
      }
    } else {
      this.setState({
        minAmount: "",
        minAmountNumber: "",
        maxAmount: "",
        maxAmountNumber: "",
        pricetosend: "",
        priceForCalculator: "",
        price: "",
        isCurrencySelected: false,
        loadingForm: true,
        viewMessage: false,
        notOfer: true,
        checkterm: false,
      });
      // let array = [];
      let ofertSelect;
      otcAPI
        .getOffersNewService(
          this.state.currencyLabelSelected,
          payment,
          typeOfert,
          typePayment
        )
        .then((resp) => {
          let keys = Object.keys(resp.data);
          this.setState({ loadingForm: false });
          Object.entries(resp.data).forEach(([key, val]) => {
            keys = Object.keys(val);
            if (keys.length > 0) {
              this.setState({ notOfer: false });
              Object.entries(val).forEach(([inerKey, inerValue]) => {
                ofertSelect = inerValue;
              });

              if (this.state.typeCurrency !== "crypto") {
                this.setState({
                  minAmount: ofertSelect.minPerOperationAmount.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 2,
                    }
                  ),
                  minAmountNumber: ofertSelect.minPerOperationAmount,
                });
                this.setState({
                  maxAmount: ofertSelect.maxPerOperationAmount.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 2,
                    }
                  ),
                  maxAmountNumber: ofertSelect.maxPerOperationAmount,
                });
                this.setState({
                  pricetosend: ofertSelect.price,
                  priceForCalculator: ofertSelect.price,
                  price: ofertSelect.price.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  }),
                });
              } else {
                this.setState({
                  minAmount: ofertSelect.minPerOperationAmount,
                  minAmountNumber: ofertSelect.minPerOperationAmount,
                });
                this.setState({
                  maxAmount: ofertSelect.maxPerOperationAmount,
                  maxAmountNumber: ofertSelect.maxPerOperationAmount,
                });
                this.setState({
                  pricetosend: ofertSelect.price,
                  priceForCalculator: ofertSelect.price,
                  price: ofertSelect.price.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  }),
                });
              }

              this.setState({
                amountBitcoins: "",
                amountFiat: "",
                bank: "",
                holderId: "",
                isCurrencySelected: true,
                accountHolder: "",
                accountNumber: "",
              });
            } else {
              // this.setState({ paymentDollar: "" });
              if (this.state.listOfertsByCurrency.length > 0) {
                if (
                  this.state.accountTypeSelected === "OWN_ACCOUNT" ||
                  this.state.accountTypeSelected === "THIRD_PARTIES"
                ) {
                  let filterArray = this.state.listOfertsByCurrency.filter(
                    function (element) {
                      if (element.value.paymentType !== "MAIN") {
                        return element;
                      }
                    }
                  );

                  if (filterArray.length > 0) {
                    let min = 999999999999999999;
                    let ofert;
                    for (let oferts of this.state.listOfertsByCurrency) {
                      for (let pay of this.state.listPaymentDolarBtc) {
                        if (oferts.key.indexOf(pay.id) !== -1) {
                          if (oferts.value.price < min) {
                            min = oferts.value.price;
                            //payment = pay;
                            ofert = oferts;
                          }
                        }
                      }
                    }
                    this.setState({ notOfer: false });
                    if (this.state.typeCurrency !== "crypto") {
                      this.setState({
                        minAmount: ofert.value.minPerOperationAmount.toLocaleString(
                          "en-US",
                          {
                            maximumFractionDigits: 2,
                          }
                        ),
                        minAmountNumber: ofert.value.minPerOperationAmount,
                      });
                      this.setState({
                        maxAmount: ofert.value.maxPerOperationAmount.toLocaleString(
                          "en-US",
                          {
                            maximumFractionDigits: 2,
                          }
                        ),
                        maxAmountNumber: ofert.value.maxPerOperationAmount,
                      });
                      this.setState({
                        pricetosend: ofert.value.price,
                        priceForCalculator: ofert.value.price,
                        price: ofert.value.price.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        }),
                      });
                    } else {
                      this.setState({
                        minAmount: ofert.value.minPerOperationAmount,
                        minAmountNumber: ofert.value.minPerOperationAmount,
                      });
                      this.setState({
                        maxAmount: ofert.value.maxPerOperationAmount,
                        maxAmountNumber: ofert.value.maxPerOperationAmount,
                      });
                      this.setState({
                        pricetosend: ofert.value.price,
                        priceForCalculator: ofert.value.price,
                        price: ofert.value.price.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        }),
                      });
                    }

                    this.setState({
                      amountBitcoins: "",
                      amountFiat: "",
                      bank: "",
                      holderId: "",
                      isCurrencySelected: true,
                      accountHolder: "",
                      accountNumber: "",
                    });
                  } else {
                    this.setState({ notOfer: true });
                    this.setState({
                      viewMessage: true,
                      typeBankSelect: "",
                      amountBitcoins: "",
                      amountFiat: "",
                      isCurrencySelected: false,
                      isCreatedPayment: false,
                      message: "sell.form.errors.notOffers",
                      messageTerminsAndConditions: "",
                    });
                    if (this.state.paymentSelected !== "crear") {
                      this.setState({
                        paymentSelected: "",
                      });
                    }
                    setTimeout(() => {
                      this.setState({
                        viewMessage: false,
                        message: "",
                        keyForm: Math.random(),
                        keyPayments: Math.random(),
                        keyAccountReceiver: Math.random(),
                      });
                    }, 7000);
                  }
                }
              } else {
                this.setState({ notOfer: true });
                this.setState({
                  viewMessage: true,
                  typeBankSelect: "",
                  amountBitcoins: "",
                  amountFiat: "",
                  isCurrencySelected: false,
                  isCreatedPayment: false,
                  message: "sell.form.errors.notOffers",
                  messageTerminsAndConditions: "",
                });
                if (this.state.paymentSelected !== "crear") {
                  this.setState({
                    paymentSelected: "",
                  });
                }
                setTimeout(() => {
                  this.setState({
                    viewMessage: false,
                    message: "",
                    keyForm: Math.random(),
                    keyPayments: Math.random(),
                    keyAccountReceiver: Math.random(),
                  });
                }, 7000);
              }
            }
          });
        })
        .catch((error) => {
          this.setState({
            typePaymentsFormaterBySelect: [],
            paymentsForClients: null,
            typePaymentsBankBySelect: [],
          });
          this.setState({
            viewMessage: true,
            isCurrencySelected: false,
            isCreatedPayment: false,
            message: "sell.form.errors.errorServer",
            messageTerminsAndConditions: "",
          });
          setTimeout(() => {
            this.setState({
              paymentSelected: "",
            });
            this.setState({ viewMessage: false, message: "" });
          }, 5000);
          this.setState({ loadingForm: false });
        });
    }
  }

  rejectOffer() {
    window.sessionStorage.setItem("tokenOffert", "");
    window.location.href = "/sell";
  }
  setPaymentDollarBTC() {
    if (this.state.varlog === true) {
      this.setState({ ofertAvailabelToType: true });
      this.setState({
        candidatePayment: [],
        viewMessage: false,
        checkterm: false,
        joinField: this.state.paymentDollar.joinField,
      });
    } else {
      this.setState({
        joinField: "",
        candidatePayment: [],
        ofertAvailabelToType: false,
        minAmount: "",
        minAmountNumber: "",
        maxAmount: "",
        maxAmountNumber: "",
        pricetosend: "",
        priceForCalculator: "",
        price: "",
        isCurrencySelected: false,
        viewMessage: false,
        notOfer: true,
        checkterm: false,
      });

      let array = [];
      let paymentDollar;
      let joinField = "";
      this.setState({ paymentDollar: {} });
      for (let dollarpay of this.state.listPaymentDolarBtc) {
        if (dollarpay.joinField !== undefined) {
          joinField = dollarpay.joinField;
          if (dollarpay.joinFieldValue === true) {
            if (dollarpay.active && dollarpay.acceptOut) {
              for (let paymenMethod of this.state.fields) {
                if (paymenMethod.name === joinField) {
                  Object.entries(dollarpay).forEach(
                    ([dollarkey, dollarval]) => {
                      if (dollarkey === joinField) {
                        array.push(dollarpay);
                      }
                    }
                  );
                }
              }
            }
          } else {
            if (dollarpay.active && dollarpay.acceptOut) {
              array.push(dollarpay);
            }
          }
        } else {
          if (dollarpay.active && dollarpay.acceptOut) {
            array.push(dollarpay);
          }
        }
      }
      if (array.length > 0) {
        // verifica si hay medios de pago de dollarBTC validos.
        this.setState({ ofertAvailabelToType: true });

        if (joinField !== "") {
          this.setState(
            { joinField: joinField, candidatePayment: array },
            () => {
              if (joinField !== "bank") {
                this.getBestOffertCrypto();
              }
            }
          );
        } else {
          let payment;
          let min = 999999999999999999;
          for (let oferts of this.state.listOfertsByCurrency) {
            for (let pay of array) {
              if (oferts.key.indexOf(pay.id) !== -1) {
                if (oferts.value.price < min) {
                  min = oferts.value.price;
                  payment = pay;
                }
              }
            }
          }

          if (payment !== undefined) {
            paymentDollar = payment;
            this.setState({ paymentDollar: payment });
          } else {
            let val = Math.floor(Math.random() * array.length);
            paymentDollar = array[val];
            this.setState({ paymentDollar: paymentDollar });
          }
          this.getOffersNew(paymentDollar.id, paymentDollar.type, "BID");
        }
      } else {
        this.setState({ ofertAvailabelToType: true });
        //   // En caso que no hayan medios de pagos de dollarBTC validos.
        //   this.setState({
        //     viewMessage: true,
        //     message: "sell.form.errors.notOffers",
        //     messageTerminsAndConditions: ""
        //   });
        //   setTimeout(() => {
        //     this.setState({ viewMessage: false, message: "" });
        //   }, 6000);
      }
    }
  }
  loadMessages(messages) {
    let content = "";
    let messagesToShow = [];
    let allMessage = [];
    let lenguage = "";
    this.setState({
      messageTerminsAndConditions: [],
      allMessageTerminsAndConditions: [],
    });
    let keys = Object.keys(messages);
    if (keys.length > 0) {
      Object.entries(messages).forEach(([key, value]) => {
        if (key.includes("SELL") && key.includes("ALERT")) {
          let keyTem = key.split("__")[1];
          let language =
            key.split("__")[2] !== undefined
              ? key.split("__")[2].toLowerCase()
              : "";

          if (value !== "") {
            content = value;
            allMessage.push({
              text: content,
              language: language,
              color: keyTem.split("_")[1].toLowerCase(),
            });
            if (language === this.props.language) {
              messagesToShow.push(
                <Message
                  key={keyTem.split("_")[1].toLowerCase()}
                  color={keyTem.split("_")[1].toLowerCase()}
                  //content={value}
                  content={content}
                />
              );
            }
            // if (
            //   value.startsWith(
            //     "Aviso: El pago se emitirá dentro de un plazo de 90 minutos."
            //   )
            // ) {
            //   content = this.state.translator("sell.form.messages.greenAlert");
            // } else if (
            //   value.startsWith(
            //     "Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan"
            //   )
            // ) {
            //   content = this.state.translator("sell.form.messages.redAlert");
            // } else if (
            //   value.startsWith(
            //     "Nota: En algunos casos ciertas transferencias pueden tardar"
            //   )
            // ) {
            //   content = this.state.translator("sell.form.messages.blueAlert");
            // } else content = value;
          }
        }
      });
    }

    this.setState({
      messageTerminsAndConditions: messagesToShow,
      allMessageTerminsAndConditions: allMessage,
    });
  }
  handleField(e, data) {
    if (data.value.toString().includes("**")) {
      data.value = data.value.split("**")[0];
    }
    let oj = {
      [data.name]: data.value,
    };

    if (this.state.joinField !== "" && this.state.joinField === "bank") {
      //options: bank
      if (data.name === this.state.joinField) {
        this.getOfferWithBank(data);
      }
    }

    this.setState({ paymentBody: [...this.state.paymentBody, oj] });
  }

  getOfferWithBank(data) {
    if (this.state.varlog === false) {
      let ofert;
      let payment;
      let paymentSomeJoinFieldAndvalueOfSelect = [];
      for (let candidate of this.state.candidatePayment) {
        Object.entries(candidate).forEach(([key, val]) => {
          if (key === this.state.joinField) {
            // obtiene todos los payment que tengan el mismo campo agrupador y ademas sean del mismo banco.
            if (data.value === val) {
              paymentSomeJoinFieldAndvalueOfSelect.push(candidate);
            }
          }
        });
      }

      //obtenemos la oferta de venta con menor precio que este asociada a un payment de dollarBTC habilitado.
      let findOfert = false;
      for (let oferts of this.state.listOfertsByCurrency) {
        let partial = oferts.key.split("__");
        for (let paym of paymentSomeJoinFieldAndvalueOfSelect) {
          if (partial[1] === paym.id) {
            ofert = oferts;
            findOfert = true;
            break;
          }
        }
        if (findOfert) {
          break;
        }
      }
      if (ofert !== undefined) {
        // Si hay una oferta con el banco seleccionado.
        for (let paymen of paymentSomeJoinFieldAndvalueOfSelect) {
          if (
            ofert.key.indexOf(paymen.type) !== -1 &&
            ofert.key.indexOf(paymen.id) !== -1
          ) {
            payment = paymen;
            break;
          } else {
            continue;
          }
        }
        if (payment !== undefined) {
          this.setState({
            paymentDollar: payment,
            paymentTypeKeySelected:
              payment.type !== undefined ? payment.type : payment.paymentType,
          });
          if (payment.type !== undefined) {
            this.getOffersNew(payment.id, payment.type, "BID");
          } else {
            this.getOffersNew(payment.id, payment.paymentType, "BID");
          }
        } else {
          this.setState({ notOfer: true });
          this.setState({
            viewMessage: true,
            typeBankSelect: "",
            amountBitcoins: "",
            amountFiat: "",
            isCurrencySelected: false,
            isCreatedPayment: false,
            message: "sell.form.errors.notOffers",
            messageTerminsAndConditions: "",
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              message: "",
              keyForm: Math.random(),
              keyPayments: Math.random(),
              keyAccountReceiver: Math.random(),
            });
          }, 7000);
        }
      } else {
        //En caso que no exista una oferta con el mismo banco se selecciona la de menor precio.

        let listOfertsWithPriorityMinorTo4 = this.state.listOfertsByCurrency.filter(
          (ofert) => ofert.priority < 4
        );

        if (listOfertsWithPriorityMinorTo4.length > 0) {
          ofert = listOfertsWithPriorityMinorTo4[0];
        } else {
          let min = 999999999999999999;
          for (let oferts of this.state.listOfertsByCurrency) {
            if (oferts.value.price < min) {
              min = oferts.value.price;
              ofert = oferts;
            }
          }
        }

        let partial = ofert.key.split("__");
        for (let paymen of this.state.candidatePayment) {
          if (paymen.id === partial[1]) {
            payment = paymen;
            break;
          }
        }
        if (payment !== undefined) {
          if (payment.type !== undefined) {
            this.setState({
              paymentDollar: payment,
              paymentTypeKeySelected: payment.type,
            });
            this.getOffersNew(payment.id, payment.type, "BID");
          } else {
            this.setState({
              paymentDollar: payment,
              paymentTypeKeySelected: payment.paymentType,
            });
            this.getOffersNew(payment.id, payment.paymentType, "BID");
          }
        } else {
          this.setState({ notOfer: true });
          this.setState({
            viewMessage: true,
            typeBankSelect: "",
            amountBitcoins: "",
            amountFiat: "",
            isCurrencySelected: false,
            isCreatedPayment: false,
            message: "sell.form.errors.notOffers",
            messageTerminsAndConditions: "",
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              message: "",
              keyForm: Math.random(),
              keyPayments: Math.random(),
              keyAccountReceiver: Math.random(),
            });
          }, 7000);
        }
      }
    }
  }

  getBestOffertCrypto() {
    let ofert, paymentAux;
    let min = 999999999999999999;
    for (let oferts of this.state.listOfertsByCurrency) {
      if (oferts.value.price < min) {
        min = oferts.value.price;
        ofert = oferts;
      }
    }

    let partial = ofert.key.split("__");
    for (let paymen of this.state.candidatePayment) {
      if (paymen.id === partial[1]) {
        paymentAux = paymen;
        break;
      }
    }
    if (paymentAux.type !== undefined) {
      this.setState({
        paymentDollar: paymentAux,
        paymentTypeKeySelected: paymentAux.type,
      });
      this.getOffersNew(paymentAux.id, paymentAux.type, "BID");
    } else {
      this.setState({
        paymentDollar: paymentAux,
        paymentTypeKeySelected: paymentAux.paymentType,
      });
      this.getOffersNew(paymentAux.id, paymentAux.paymentType, "BID");
    }
  }
  handleAmountBitcoins(e, data) {
    if (this.state.typeCurrency !== "crypto") {
      if (e.target.name === "fiat") {
        while (e.target.value.indexOf(",") !== -1) {
          e.target.value = e.target.value.replace(",", "");
        }
        let value = new Number(e.target.value);
        if (
          value === this.state.maxAmountNumber ||
          value <= this.state.maxAmountNumber
        ) {
          this.setState({
            errorAmountFiat: false,
            message: "",
          });
          this.setState({ amountFiat: e.target.value });
          let calculate = this.floorDecimals(
            e.target.value / this.state.priceForCalculator,
            8
          );
          let toString = calculate.toString();
          if (toString.indexOf("e") === -1) {
            this.setState({ amountBitcoins: calculate });
          } else {
            this.setState({ amountBitcoins: 0.0 });
          }
        } else {
          this.setState({
            errorAmountFiat: true,
            message: "sell.form.errors.amountMaxLimit",
          });
          setTimeout(() => {
            this.setState({
              errorAmountFiat: false,
              message: "",
            });
          }, 8000);
        }
      }
      if (e.target.name === "crypto") {
        let compareAmount =
          Number(e.target.value) * this.state.priceForCalculator;

        if (compareAmount <= this.state.maxAmountNumber) {
          this.setState({
            amountBitcoins: Number(e.target.value),
            amountFiat: compareAmount,
          });
        } else {
          this.setState({
            errorAmountCrypto: true,
            message: "sell.form.errors.amountMaxLimit",
          });
          setTimeout(() => {
            this.setState({
              errorAmountCrypto: false,
              message: "",
            });
          }, 8000);
        }
      }
    } else {
      if (e.target.name === "fiat") {
        let value = Number(e.target.value);
        if (
          value === this.state.maxAmountNumber ||
          value < this.state.maxAmountNumber
        ) {
          this.setState({
            errorAmountFiat: false,
            message: "",
          });
          this.setState({ amountFiat: e.target.value });
          let calculate = this.floorDecimals(
            e.target.value / this.state.priceForCalculator,
            8
          );
          let toString = calculate.toString();
          if (toString.indexOf("e") === -1) {
            this.setState({ amountBitcoins: calculate });
          } else {
            this.setState({ amountBitcoins: 0.0 });
          }
        } else {
          this.setState({
            errorAmountFiat: true,
            message: "sell.form.errors.amountMaxLimit",
          });
          setTimeout(() => {
            this.setState({
              errorAmountFiat: false,
              message: "",
            });
          }, 8000);
        }
      }
      if (e.target.name === "crypto") {
        let compareAmount =
          Number(e.target.value) / this.state.priceForCalculator;

        if (compareAmount <= this.state.maxAmountNumber) {
          this.setState({
            amountBitcoins: Number(e.target.value),
            amountFiat: compareAmount,
          });
        } else {
          this.setState({
            errorAmountCrypto: true,
            message: "sell.form.errors.amountMaxLimit",
          });
          setTimeout(() => {
            this.setState({
              errorAmountCrypto: false,
              message: "",
            });
          }, 8000);
        }
      }
    }
  }
  gotoSigninToken() {
    let query = parse(window.location.search);
    if (query === "" || query === null || query === undefined) {
    } else {
      let tokenUrl = "";
      let typeOffer = "";
      if (query.offerKey !== undefined) {
        tokenUrl = query.offerKey;
        typeOffer = "offerKey";
      } else if (query.brokerOfferKey !== undefined) {
        tokenUrl = query.brokerOfferKey;
        typeOffer = "brokerOfferKey";
      }
      window.location.href = "/registration/?" + typeOffer + "=" + tokenUrl;
    }
  }
  handleComment(e) {
    this.setState({
      commentInitial: e.target.value,
    });
  }
  validateFields() {
    let amountNumber = Number(this.state.amountFiat);

    if (this.state.currencyLabelSelected === "") {
      this.setState({
        errorMoneda: true,
        message: "sell.form.errors.requiredField",
      });
      this.blankErrors("errorMoneda");
      return false;
    } else if (this.state.amountFiat === "") {
      this.setState({
        errorAmountFiat: true,
        message: "sell.form.errors.requiredField",
      });
      this.blankErrors("errorAmountFiat");
      return false;
    } else if (
      amountNumber < this.state.minAmount ||
      amountNumber > this.state.maxAmount
    ) {
      this.setState({
        errorAmountFiat: true,
        message: "sell.form.errors.outBordersAmount",
      });
      this.blankErrors("errorAmountFiat");
      return false;
    } else if (this.state.typeReceiverFundSelected === "ELECTRONIC") {
      if (this.state.paymentSelected === "") {
        this.setState({
          errorPayment: true,
          message: "sell.form.errors.requiredField",
        });
        this.blankErrors("errorPayment");
        return false;
      } else if (this.state.paymentSelected === "crear") {
        if (!this.state.specialValue) {
          let count = 0;
          let arraynames = [];
          this.state.fields.map((item) => {
            if (item.client === true) {
              count++;
              arraynames.push(item.name);
            }
          });
          let nameacum = [];
          let namearraynames;
          Object.entries(this.state.paymentBody).forEach(([key, value]) => {
            Object.entries(value).forEach(([key2, value2]) => {
              arraynames.map((item, index) => {
                namearraynames = item;
                //name del item del array rekerido namearraynames

                if (key2.includes(namearraynames)) {
                  if (
                    value2 === null ||
                    value2 === undefined ||
                    value2 === ""
                  ) {
                    this.setState({
                      viewMessageTerm: true,
                      message: "sell.form.errors.incompleteData",
                    });
                    setTimeout(() => {
                      this.setState({
                        viewMessageTerm: false,
                        message: "",
                      });
                    }, 5000);
                    return false;
                  } else {
                    const resultado = nameacum.find(
                      (element) => element.name === namearraynames
                    );

                    if (resultado === undefined) {
                      let ob = {
                        name: namearraynames,
                        value: value2,
                      };
                      nameacum.push(ob);
                    } else {
                      resultado.value = value2;
                    }
                  }
                } else {
                  this.setState({
                    viewMessageTerm: true,
                    message: "sell.form.errors.incompleteData",
                  });
                  setTimeout(() => {
                    this.setState({
                      viewMessageTerm: false,
                      message: "",
                    });
                  }, 5000);
                  return false;
                }
              });
            });
          });

          if (nameacum.length !== arraynames.length) {
            this.setState({
              viewMessageTerm: true,
              message: "sell.form.errors.incompleteData",
            });
            setTimeout(() => {
              this.setState({
                viewMessageTerm: false,
                message: "",
              });
            }, 5000);
            return false;
          }
        }
        if (this.state.accountTypeSelected === "THIRD_PARTIES") {
          let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (this.state.emailReceiver === "") {
            this.setState({
              errorEmailReceiver: true,
              message: "sell.form.errors.emailReceiverEmpty",
            });
            this.blankErrors("errorEmailReceiver");
            return false;
          } else if (!regex.test(this.state.emailReceiver)) {
            this.setState({
              errorEmailReceiver: true,
              message: "sell.form.errors.emailReceiverWrongFormat",
            });
            this.blankErrors("errorEmailReceiver");
            return false;
          } else if (this.state.operationConcept === "") {
            this.setState({
              errorOperationConcept: true,
              message: "sell.form.errors.conceptOperationEmpty",
            });
            this.blankErrors("errorOperationConcept");
            return false;
          }
        }
      }
    } else if (this.state.accountTypeSelected === "") {
      this.setState({
        errorAccountTypeReceiver: true,
        message: "sell.form.errors.accountTypeReceiverEmpty",
      });
      this.blankErrors("errorAccountTypeReceiver");
      return false;
    } else if (this.state.accountTypeSelected === "THIRD_PARTIES") {
      if (this.state.operationConcept === "") {
        this.setState({
          errorOperationConcept: true,
          message: "sell.form.errors.conceptOperationEmpty",
        });
        this.blankErrors("errorOperationConcept");
        return false;
      }
    }
    //}
    return true;
  }
  getCharges() {
    let bodyCharges = {
      currency: this.state.currencyLabelSelected,
      amount: parseFloat(this.state.amountFiat),
      btcPrice: this.state.priceForCalculator,
      operationType: "SELL",
      paymentType: this.state.paymentTypeKeySelected,
    };
    	if (
				bodyCharges.amount > 0 &&
				bodyCharges.amount !== null &&
				bodyCharges.amount !== undefined &&
				bodyCharges.amount.toString() !== "NaN"
			) {
				otcAPI
					.getChargesByOperation(bodyCharges)
					.then((resp) => {
						let charges = [];
						Object.entries(resp.data).forEach(([key, value]) => {
							if (key === "VAT") {
								charges.push({
									label: this.state.translator("buy.modalConfirm.charges.VAT"),
									value: value.amount + " " + value.currency,
								});
							} else if (key === "COMMISSION") {
								charges.push({
									label: this.state.translator(
										"buy.modalConfirm.charges.COMMISSION",
									),
									value: value.amount + " " + value.currency,
								});
							} else {
								charges.push({
									label: key,
									value: value.amount + " " + value.currency,
								});
							}
						});
						this.setState({ chargesByOperation: charges });
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				console.log("error del amount");
			}
   
  }
  handleSubmitSellBitcoins() {
    if (this.validateFields()) {
      if (this.state.checkterm === false) {
        this.setState({
          viewMessageTerm: true,
          message: "sell.form.errors.acceptTerms",
        });
        setTimeout(() => {
          this.setState({
            viewMessageTerm: false,
            message: "",
          });
        }, 7000);
      } else {
        this.getCharges();
        let pay = {};
        // let paymentDollar = {};
        if (this.state.isCreatedPayment) {
          for (let value of this.state.paymentBody) {
            Object.entries(value).forEach(([key, val]) => {
              Object.defineProperty(pay, key, {
                value: val,
                enumerable: true,
                configurable: true,
                writable: true,
              });
            });
          }
          if (this.state.specialValue) {
            let bodyClientPayment = {
              userName: sessionStorage.getItem("username"),
              currency: this.state.currencyLabelSelected,
              bankLogin: pay.bankLogin,
              bankPassword: pay.bankPassword,
              paymentBank: pay.bank,
            };
            this.setState({ loadingForm: true });
            paymentApi
              .createExternalPaymentMethod(bodyClientPayment)
              .then((resp) => {
                this.setState({ loadingForm: false });
                let keysResp = Object.keys(resp.data);
                if (keysResp.length > 0) {
                  let paymentExist = this.state.payments.find(function (
                    element
                  ) {
                    return element.id === resp.data.id;
                  });
                  if (paymentExist === undefined) {
                    let body = {
                      userName: sessionStorage.getItem("username"),
                      currency: this.state.currencyLabelSelected,
                      message: this.state.commentInitial,
                      amount: this.state.amountFiat.toString(),
                      price: this.state.pricetosend,
                      otcOperationType: "SELL",
                      clientPayment: resp.data,
                      description:
                        this.state.accountTypeSelected === "THIRD_PARTIES"
                          ? this.state.operationConcept
                          : "",
                    };

                    if (this.state.paymentDollar !== "") {
                      body.dollarBTCPayment = this.state.paymentDollar;
                    }
                    if (this.state.brokeruserName !== null) {
                      body.brokerUserName = this.state.brokeruserName;
                    }
                    this.setState({
                      bodySellBitCoins: body,
                      openSellConfirm: true,
                    });
                  } else {
                    this.setState({
                      viewMessageErrorExternal: true,
                      message:
                        "profile.addAccount.messages.errorExistExternalPayment",
                      color: "red",
                    });
                    setTimeout(() => {
                      this.setState({
                        viewMessageErrorExternal: false,
                        message: "",
                        color: "",
                      });
                    }, 6000);
                  }
                } else {
                  this.setState({
                    viewMessageErrorExternal: true,
                    message:
                      "profile.addAccount.messages.errorExternalPaymentCreate",
                    color: "red",
                  });
                  setTimeout(() => {
                    this.setState({
                      viewMessageErrorExternal: false,
                      message: "",
                      color: "",
                    });
                  }, 6000);
                }
              })
              .catch((error) => {
                this.setState({ loadingForm: false });
                this.setState({
                  viewMessageErrorExternal: true,
                  message:
                    "profile.addAccount.messages.errorExternalPaymentCreate",
                });
                setTimeout(() => {
                  this.setState({
                    viewMessageErrorExternal: false,
                    message: "",
                  });
                }, 6000);
              });
          } else {
            pay.type = this.state.paymentTypeKeySelected;
            let typePay = this.state.typePaymentsAvailableToCurrency.find(
              function (element) {
                return element.name === pay.type;
              }
            );
            // pay.automaticCharge

            if (typePay !== undefined) {
              pay.automaticCharge = typePay.automaticCharge;
            }
            if (this.state.accountTypeSelected === "THIRD_PARTIES") {
              pay.emailReceiver = this.state.emailReceiver;
            }
            if (this.state.accountTypeSelected === "OWN_ACCOUNT") {
              pay.verified = false;
            }
            let body = {
              userName: sessionStorage.getItem("username"),
              currency: this.state.currencyLabelSelected,
              message: this.state.commentInitial,
              amount: this.state.amountFiat.toString(),
              price: this.state.pricetosend,
              otcOperationType: "SELL",
              clientPayment: pay,
              description:
                this.state.accountTypeSelected === "THIRD_PARTIES"
                  ? this.state.operationConcept
                  : "",
            };

            if (this.state.paymentDollar !== "") {
              body.dollarBTCPayment = this.state.paymentDollar;
            }
            if (this.state.brokeruserName !== null) {
              body.brokerUserName = this.state.brokeruserName;
            }
            this.setState(
              {
                bodySellBitCoins: body,
                openSellConfirm: true,
              }
              // () => {
              //   //////console.log(
              //     "this.state.bodySellBitCoins ",
              //     this.state.bodySellBitCoins
              //   );
              //}
            );
          }
        } else {
          pay = this.state.paymentSelected;
          let body = {
            userName: sessionStorage.getItem("username"),
            currency: this.state.currencyLabelSelected,
            message: this.state.commentInitial,
            amount: this.state.amountFiat.toString(),
            price: this.state.pricetosend,
            otcOperationType: "SELL",
            clientPayment: pay,
            description:
              this.state.accountTypeSelected === "THIRD_PARTIES"
                ? this.state.operationConcept
                : "",
          };

          if (this.state.paymentDollar !== "") {
            body.dollarBTCPayment = this.state.paymentDollar;
          }
          if (this.state.brokeruserName !== null) {
            body.brokerUserName = this.state.brokeruserName;
          }
          this.setState(
            {
              bodySellBitCoins: body,
              openSellConfirm: true,
            },
            () => {}
          );
        }
      }
    }
  }
  handleCloseSendConfirm() {
    this.setState({
      openSellConfirm: false,
    });
  }
  blankErrors(label) {
    if (label === "errorMoneda") {
      setTimeout(() => {
        this.setState({ errorMoneda: false, message: "" });
      }, 5000);
    } else if (label === "errorAmountFiat") {
      setTimeout(() => {
        this.setState({ errorAmountFiat: false, message: "" });
      }, 5000);
    } else if (label === "errorPayment") {
      setTimeout(() => {
        this.setState({ errorPayment: false, message: "" });
      }, 5000);
    } else if (label === "errorBank") {
      setTimeout(() => {
        this.setState({ errorBank: false, message: "" });
      }, 5000);
    } else if (label === "errorAccountNumber") {
      setTimeout(() => {
        this.setState({ errorAccountNumber: false, message: "" });
      }, 5000);
    } else if (label === "errorAccountHolder") {
      setTimeout(() => {
        this.setState({ errorAccountHolder: false, message: "" });
      }, 5000);
    } else if (label === "errorHolderId") {
      setTimeout(() => {
        this.setState({ errorHolderId: false, message: "" });
      }, 5000);
    } else if (label === "errorUserEmail") {
      setTimeout(() => {
        this.setState({ errorUserEmail: false, message: "" });
      }, 5000);
    } else if (label === "errorUsername") {
      setTimeout(() => {
        this.setState({ errorUsername: false, message: "" });
      }, 5000);
    } else if (label === "errorUsername") {
      setTimeout(() => {
        this.setState({ errorUsername: false, message: "" });
      }, 5000);
    } else if (label === "errorEmailReceiver") {
      setTimeout(() => {
        this.setState({ errorEmailReceiver: false, message: "" });
      }, 5000);
    } else if (label === "errorAccountTypeReceiver") {
      setTimeout(() => {
        this.setState({ errorAccountTypeReceiver: false, message: "" });
      }, 5000);
    } else if (label === "errorOperationConcept") {
      setTimeout(() => {
        this.setState({ errorOperationConcept: false, message: "" });
      }, 5000);
    }
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  loadStatusUser() {
    let username = user.getUserName();
    user.getConfigUserGeneral(username).then((resp) => {
      if (resp.data.result.verification === undefined) {
        this.emailVerify();
        this.setState({
          hasVerificationEmail: false,
          emailSendSuccess: true,
        });
        let status = {
          A: false,
          B: false,
          C: "UNINITIATED",
        };
        this.setState({ statusVerificationUser: status });
      } else {
        let a, b, c;
        if (resp.data.result.verification.A !== undefined) {
          a = true;
        } else {
          if (!this.state.statusVerificationUser.A) {
            this.emailVerify();
            this.setState({
              hasVerificationEmail: false,
              emailSendSuccess: true,
            });
          }
          a = false;
        }
        if (resp.data.result.verification.B !== undefined) {
          b = true;
        } else {
          b = false;
        }
        if (resp.data.result.verification.C !== undefined) {
          c = resp.data.result.verification.C.userVerificationStatus;
        } else {
          c = "UNINITIATED";
        }
        let status = {
          A: a,
          B: b,
          C: c,
        };
        this.setState({ statusVerificationUser: status });
      }
      this.setState({
        loading: false,
      });
    });
  }
  emailVerify() {
    user.verifyUserInit(sessionStorage.getItem("email"));
    this.setState({
      viewMessageEmail: true,
      emailSended: true,
    });
  }

  readUrlWhitParams() {
    let query = parse(window.location.search);
    if (query === "" || query === null) {
    } else {
      let tokenUrl = "";
      let typeOffer = "";
      if (query.offerKey !== undefined) {
        tokenUrl = query.offerKey;
        typeOffer = "offerKey";
      } else if (query.brokerOfferKey !== undefined) {
        tokenUrl = query.brokerOfferKey;
        typeOffer = "brokerOfferKey";
      }
      if (
        tokenUrl !== undefined &&
        tokenUrl !== "" &&
        tokenUrl !== null &&
        tokenUrl !== " "
      ) {
        brokers
          .getOfferByUrl(tokenUrl)
          .then((res) => {
            for (let i in res.data) {
              if (res.data.offerType === "BID") {
                this.setState(
                  {
                    varlog: true,
                    notPaymentMethods: false,
                    paymentId: res.data.paymentId,
                    paymentType: res.data.paymentType,
                    currencyLabelSelected: res.data.currency,
                    dollarBTCPaymentTypeElectronicSelected:
                      res.data.paymentType,
                    priceForCalculator: res.data.price,
                    minAmount: res.data.minPerOperationAmount,
                    maxAmount: res.data.maxPerOperationAmount,
                    maxAmountNumber: res.data.maxPerOperationAmount,
                    minAmountNumber: res.data.minPerOperationAmount,
                    priceUSD: res.data.price,
                    pricetosend: res.data.price,
                    brokeruserName: res.data.userName, //res.data.totalAmount,
                    viewBrokerOffer: true,
                  },
                  () => {
                    // this.handleChangeCurrencySelect(this.state.currencyLabelSelected)
                    this.state.currencies
                      .filter((currency) => {
                        return (
                          this.state.currencyLabelSelected === currency.alias
                        );
                      })
                      .map((currencySelected) => {
                        this.setState({
                          imgCurrencySelected: currencySelected.img,
                        });
                      });

                    let value = undefined;
                    if (this.state.mapPrice !== undefined) {
                      value = this.state.mapPrice.get(
                        this.state.currencyLabelSelected
                      );
                    }

                    if (value !== undefined) {
                      this.setState({
                        forexPrice: value.forex.usdRate,
                        localBitCoinPrice: value.localBitcoins.usdPrice,
                      });
                    }

                    this.handleChangeCurrency(this.state.currencyLabelSelected);
                    this.getClientPaymentType(this.state.currencyLabelSelected);

                    // this.handleAmountBitcoinsNoEvent()
                  }
                );
              }
            }
          })
          .catch((error) => {
            ////////console.log(error);
          });
      }
    }
  }

  redirectToMySell() {
    this.props.redirectToMySell();
  }
  componentWillMount() {
    this._isMounted = false;
  }
  handleShowTermAndCondicionModal() {
    this.setState({ showModalTerm: true });
  }
  handleCloseModalTerm() {
    this.setState({ showModalTerm: false });
  }
  handleCheckterms(e, data) {
    this.setState({ checkterm: !this.state.checkterm, showModalTerm: false });
  }
  toggle = () =>
    this.setState({ allowToAddPayment: !this.state.allowToAddPayment });
  handleChangeAccountTypeReceiver(event, data) {
    if (this.state.varlog === true) {
      this.setState({
        isCurrencySelected: true,
        checkterm: false,
        typeBankSelect: "",
        amountBitcoins: "",
        amountFiat: "",
        isCreatedPayment: false,
        notOfer: false,
        isElectronicTrans: false,
        accountTypeSelected: "",
        //paymentSelected: "",
        messageTerminsAndConditions: [],
        officeInfoView: [],
      });
    } else {
      this.setState({
        minAmount: "",
        minAmountNumber: "",
        maxAmount: "",
        maxAmountNumber: "",
        pricetosend: "",
        priceForCalculator: "",
        price: "",
        isCurrencySelected: false,
        checkterm: false,
        typeBankSelect: "",
        amountBitcoins: "",
        amountFiat: "",
        isCreatedPayment: false,
        notOfer: false,
        isElectronicTrans: false,
        accountTypeSelected: "",
        messageTerminsAndConditions: [],
        officeInfoView: [],
      });
    }

    this.setState(
      {
        accountTypeSelected: data.value,
        paymentsFromUserForSelectByType: [],
      },
      function () {
        let paymentsFromUserOwn = [];
        let paymentsFromUserThird = [];
        this.state.paymentsFromUserForSelect.map((payment) => {
          if (payment.value === "crear") {
            paymentsFromUserOwn.push(payment);
          }
          if (payment.value.verified !== undefined) {
            paymentsFromUserOwn.push(payment);
          } else {
            paymentsFromUserThird.push(payment);
            // if (payment.value === "crear") {
            //   paymentsFromUserThird.push(payment);
            //   paymentsFromUserOwn.push(payment);
            // } else {

            // }
          }
        });

        if (data.value === "OWN_ACCOUNT") {
          this.setState({
            paymentsFromUserForSelectByType: paymentsFromUserOwn,
          });
        } else if (data.value === "THIRD_PARTIES") {
          this.setState({
            paymentsFromUserForSelectByType: paymentsFromUserThird,
          });
        }
      }
    );
  }
  async handleChangeTypeReceptionFund(event, data) {
    this.setState({
      typeReceiverFundSelected: data.value,
      officeInfoView: [],
      accountTypeSelected: "",
      paymentSelected: "",
      isCurrencySelected: false,
    });
    if (data.value === "CASH_DEPOSIT") {
      let array = [];
      let paymentDollar;

      if (this.state.varlog === false) {
        for (let dollarpay of this.state.listPaymentDolarBtc) {
          if (dollarpay.joinField !== undefined) {
            let joinField = dollarpay.joinField;
            // joinFieldValue = dollarpay.joinFieldValue;
            if (dollarpay.joinFieldValue === true) {
              if (dollarpay.active && dollarpay.acceptOut) {
                Object.entries(data.value).forEach(([key, value]) => {
                  if (key === joinField) {
                    let findValueMacht = value;
                    Object.entries(dollarpay).forEach(
                      ([dollarkey, dollarval]) => {
                        if (dollarkey === joinField) {
                          if (findValueMacht === dollarval) {
                            array.push(dollarpay);
                          }
                        }
                      }
                    );
                  }
                });
              }
            } else {
              if (dollarpay.active && dollarpay.acceptOut) {
                array.push(dollarpay);
              }
            }
          } else {
            if (dollarpay.active && dollarpay.acceptOut) {
              array.push(dollarpay);
            }
          }
        }
        if (array.length > 0) {
          let ofert;
          let minOfert = 99999999999999;
          for (let ofertList of this.state.listOfertsByCurrency) {
            let partial = ofertList.key.split("__");
            if (partial[2] === data.value) {
              for (let payment of array) {
                if (payment.type === data.value && payment.id === partial[1]) {
                  if (ofertList.value.price < minOfert) {
                    minOfert = ofertList.value.price;
                    ofert = ofertList;
                    paymentDollar = payment;
                  }
                }
              }
            }
          }
          if (ofert !== undefined) {
            for (let payment of array) {
              if (ofert.key.indexOf(payment.id) !== -1) {
                paymentDollar = payment;
                break;
              } else {
                continue;
              }
            }
            this.setState({ paymentDollar: paymentDollar });
            this.getOffersNew(paymentDollar.id, data.value, "BID");
            if (paymentDollar.officesInfoId !== undefined) {
              let infoOffices = await this.getOfficeInfo(
                paymentDollar.officesInfoId
              );
              if (infoOffices !== false) {
                this.setState({ officeInfoView: infoOffices });
              }
            }
          } else {
            let val = Math.floor(Math.random() * array.length);
            paymentDollar = array[val];
            this.setState({ paymentDollar: paymentDollar });
            this.getOffersNew(paymentDollar.id, data.value, "BID");
            this.setState({ notOfer: true });
            this.setState({
              viewMessage: true,
              typeBankSelect: "",
              amountBitcoins: "",
              amountFiat: "",
              isCurrencySelected: false,
              isCreatedPayment: false,
              message: "sell.form.errors.notOffers",
              messageTerminsAndConditions: "",
            });
          }
        }
      }
    }
  }
  async getOfficeInfo(officeId) {
    try {
      const response = await otcAPI.getOfficesInfoOtc(
        this.state.currencyLabelSelected,
        officeId
      );
      let arrayInfo = [];
      this.setState({ officeInfo: response.data });
      for (let info of response.data) {
        let obj = {
          fullInfo: info,
          value: [],
        };
        // eslint-disable-next-line no-loop-func
        Object.entries(info).forEach(([key, val]) => {
          if (key === "website") {
            let v = "";
            if (isMobile) {
              v = val.substring(0, 20) + "...";
            } else {
              v = val;
            }
            obj.value.push(
              <span key={key} style={{ textAlign: "left" }}>
                <b>
                  {this.props.translate("officeInfo." + key)}
                  {": "}
                  <a href={val} target="_blank">
                    {v}
                  </a>
                </b>
                <br />
              </span>
            );
          } else if (key.includes("phone") && val !== "") {
            obj.value.push(
              <span key={key} style={{ textAlign: "left" }}>
                <b>{this.props.translate("officeInfo.phone")}</b>
                {": " + val}
                <br />
              </span>
            );
          } else if (!key.includes("phone") && val !== "") {
            obj.value.push(
              <span key={key} style={{ textAlign: "left" }}>
                <b>{this.props.translate("officeInfo." + key)}</b>
                {": " + val}
                <br />
              </span>
            );
          }
        });
        arrayInfo.push(obj);
      }
      return arrayInfo;
    } catch (error) {
      return false;
    }
  }
  handleEmailReceiver(event, data) {
    this.setState({
      emailReceiver: data.value,
    });
  }
  handleOperationConcept(event, data) {
    this.setState({
      operationConcept: data.value,
    });
  }
  handleSpecial(value) {
    this.setState({ specialValue: value });
  }
  gotoSignin() {
    window.location.href = "/registration";
  }

  getWalletBalanceDBC = function () {
    //this.setState({ showSendBTC: false });
    var availableAmounts = [];
    user
      .getBalanceUser(user.getUserName())
      .then((resp) => {
        availableAmounts = resp.data.result.availableAmounts;
        for (var i = 0; i < availableAmounts.length; i++) {
          if (availableAmounts[i].currency === "BTC") {
            this.setState({
              balanceBitcoins: this.floorDecimals(
                availableAmounts[i].amount,
                8
              ),
            });
          }
        }
      })
      .catch((error) => {
        //////console.log(error);
      });
  };
  render() {
    let t = this.state.translator;
    let textTerm = this.state.textTerm.map((value, index) => (
      <p key={index}>{t("sell.mySells.terms." + value)}</p>
    ));
    let labelAmountFiatError,
      labelMonedaError,
      labelPaymentError,
      labePaymentTypeError,
      labePaymentTypeErrorBank,
      labelAmountCryptoError,
      labelTerms,
      labelAccountTypeReceiver,
      labelEmailReceiver,
      labelOperationConcept;
    //changueValue;
    if (this.state.errorMoneda) {
      labelMonedaError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmountFiat) {
      labelAmountFiatError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmountCrypto) {
      labelAmountCryptoError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorPayment) {
      labelPaymentError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }

    if (this.state.errorAccountTypeReceiver) {
      labelAccountTypeReceiver = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorEmailReceiver) {
      labelEmailReceiver = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorOperationConcept) {
      labelOperationConcept = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorTerms) {
      labelTerms = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    let massageRecomended = (
      <Message color="green">
        <span style={{ fontWeight: "bold" }}>
          {t("sell.form.messages.recomended")}
        </span>
      </Message>
    );
    return (
      <div>
        <Grid columns="equal">
          <Grid.Column largeScreen={16} mobile={16} tablet={16} computer={16}>
            <Container>
              <Segment
                color={!isMobile ? "orange" : ""}
                loading={this.state.loadingForm}
                basic={isMobile}
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
                          {t("sell.menu.sell")}
                        </Header>
                        <Divider
                          style={{ marginTop: -10, borderColor: "#207ef2" }}
                        />{" "}
                      </div>
                    )}
                  </div>
                )}
                {this._isMounted && (
                  <Container className="container-form">
                    <Form>
                      <Grid columns={2}>
                        <Grid.Column
                          largeScreen={8}
                          mobile={11}
                          tablet={10}
                          computer={12}
                        >
                          <Form.Field required key={this.state.keyForm}>
                            <label
                              style={
                                isMobile === true ? { color: "#207ef2" } : {}
                              }
                            >
                              {t("sell.form.coin")}
                            </label>
                            <Select
                              fluid
                              single
                              selection
                              disabled={this.state.viewBrokerOffer}
                              placeholder={t("sell.form.placeholderCoin")}
                              options={this.state.currencies}
                              onChange={this.handleChangeCurrencySelect}
                              value={this.state.currencyLabelSelected}
                              selectValue={this.state.currencyLabelSelected}
                            />
                            {labelMonedaError}
                          </Form.Field>
                        </Grid.Column>

                        <Grid.Column
                          largeScreen={8}
                          mobile={5}
                          tablet={6}
                          computer={4}
                        >
                          {this.state.currencyLabelSelected !== "" && (
                            <Form.Field>
                              <Divider hidden style={{ marginBottom: "8px" }} />
                              <Image
                                avatar
                                size="mini"
                                src={this.state.imgCurrencySelected}
                              />
                            </Form.Field>
                          )}
                        </Grid.Column>
                      </Grid>
                      {this.state.currencyLabelSelected !== "" &&
                        sessionStorage.getItem("auth") === "true" && (
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field
                                key={this.state.typeReceiverFundSelected}
                                required
                              >
                                <label
                                  required
                                  style={
                                    isMobile === true
                                      ? { color: "#207ef2" }
                                      : {}
                                  }
                                >
                                  {t("sell.form.receiptOfFunds")}
                                </label>
                                <Select
                                  required
                                  disabled={this.state.activeTypeReceiver}
                                  //(label={t("sell.form.accountTypeReceiver")}
                                  placeholder={t(
                                    "sell.form.placeholderTypeReceiverFunds"
                                  )}
                                  style={
                                    isMobile === true
                                      ? { color: "#207ef2" }
                                      : {}
                                  }
                                  options={this.state.optionsReceiptOfFunds}
                                  value={this.state.typeReceiverFundSelected}
                                  onChange={this.handleChangeTypeReceptionFund}
                                />
                                {/* {labelAccountTypeReceiver} */}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        )}
                      {this.state.typeReceiverFundSelected === "ELECTRONIC" &&
                        sessionStorage.getItem("auth") === "true" && (
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field
                                key={this.state.keyAccountReceiver}
                                required
                              >
                                <label
                                  required
                                  style={
                                    isMobile === true
                                      ? { color: "#207ef2" }
                                      : {}
                                  }
                                >
                                  {t("sell.form.accountTypeReceiver")}
                                </label>
                                <Select
                                  required
                                  disabled={this.state.notPaymentMethods}
                                  //(label={t("sell.form.accountTypeReceiver")}
                                  placeholder={t(
                                    "sell.form.placeholderAccountTypeReceiver"
                                  )}
                                  style={
                                    isMobile === true
                                      ? { color: "#207ef2" }
                                      : {}
                                  }
                                  options={this.state.accountTypesReceiver}
                                  value={this.state.accountTypeSelected}
                                  onChange={
                                    this.handleChangeAccountTypeReceiver
                                  }
                                />
                                {labelAccountTypeReceiver}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        )}
                      {this.state.officeInfoView.length > 0 &&
                        this.state.typeReceiverFundSelected ===
                          "CASH_DEPOSIT" && (
                          <Grid>
                            {this.state.officeInfoView.map((info, index) => (
                              <Grid.Row columns={1}>
                                <Grid.Column key={index}>
                                  <Message
                                    info
                                    size={"small"}
                                    style={{ textAlign: "left" }}
                                  >
                                    {info.value}
                                  </Message>
                                </Grid.Column>
                              </Grid.Row>
                            ))}
                          </Grid>
                        )}
                      {this.state.accountTypeSelected !== "" && (
                        <Grid columns={1}>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            <Form.Field key={this.state.keyPayments} required>
                              <label
                                required
                                style={
                                  isMobile === true ? { color: "#207ef2" } : {}
                                }
                              >
                                {t("sell.form.paymentMethods")}
                              </label>
                              <Select
                                required
                                disabled={this.state.notPaymentMethods}
                                style={
                                  isMobile === true ? { color: "#207ef2" } : {}
                                }
                                placeholder={t(
                                  "sell.form.placeholderPaymentMethods"
                                )}
                                options={
                                  this.state.paymentsFromUserForSelectByType
                                }
                                value={this.state.paymentSelected}
                                onChange={this.handlePaymentSelected}
                              />
                              {labelPaymentError}
                            </Form.Field>
                          </Grid.Column>
                        </Grid>
                      )}

                      {this.state.messageTerminsAndConditions.length > 0 && (
                        <Grid>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            {this.state.messageTerminsAndConditions}
                          </Grid.Column>
                        </Grid>
                      )}

                      {this.state.isCreatedPayment &&
                        this.state.ofertAvailabelToType && (
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              {this.state.joinField === "bank" &&
                                massageRecomended}
                              <DinamicForm
                                field={this.state.fields}
                                setData={this.handleField.bind(this)}
                                paymentBody={this.state.paymentBody}
                                operation="sell"
                                setSpecialValue={this.handleSpecial.bind(this)}
                              />
                            </Grid.Column>
                            {this.state.accountTypeSelected ===
                              "THIRD_PARTIES" &&
                              !this.state.specialValue && (
                                <Grid.Column
                                  largeScreen={16}
                                  mobile={16}
                                  tablet={16}
                                  computer={16}
                                >
                                  <Form.Field required>
                                    <label
                                      style={
                                        isMobile === true
                                          ? { color: "#207ef2" }
                                          : {}
                                      }
                                    >
                                      {t("sell.form.emailReceiver")}
                                    </label>
                                    <Input
                                      fluid
                                      name="emailReceiver"
                                      placeholder={t(
                                        "sell.form.placeholderEmailReceiver"
                                      )}
                                      onChange={this.handleEmailReceiver}
                                    />
                                    {labelEmailReceiver}
                                  </Form.Field>
                                </Grid.Column>
                              )}
                            {this.state.isCreatedPayment &&
                              this.state.ofertAvailabelToType && (
                                <Grid.Column
                                  largeScreen={8}
                                  mobile={16}
                                  tablet={16}
                                  computer={8}
                                >
                                  <div>
                                    <Checkbox
                                      defaultChecked
                                      label={t("sell.form.addToFrequent")}
                                      onChange={this.toggle}
                                      checked={this.state.allowToAddPayment}
                                    />
                                  </div>
                                </Grid.Column>
                              )}
                          </Grid>
                        )}

                      {this.state.viewMessage && (
                        <Grid colums={1}>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            <Message
                              color="red"
                              content={t(this.state.message)}
                            />
                          </Grid.Column>
                        </Grid>
                      )}
                      {(this.state.paymentSelected !== "" ||
                        sessionStorage.getItem("auth") !== "true" ||
                        this.state.typeReceiverFundSelected ===
                          "CASH_DEPOSIT") &&
                        !this.state.notOfer && (
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <label
                                style={
                                  isMobile === true ? { color: "#207ef2" } : {}
                                }
                              >
                                <strong
                                  style={
                                    isMobile === true
                                      ? { color: "#207ef2", fontSize: 11 }
                                      : {}
                                  }
                                >
                                  {t("sell.form.businessLimits")}
                                </strong>

                                {"   "}
                              </label>
                              {this.state.isCurrencySelected && (
                                //  agregado viernes29nov

                                <strong>
                                  <span
                                    style={
                                      isMobile === true
                                        ? { color: "#207ef2", fontSize: 11 }
                                        : {}
                                    }
                                  >
                                    {this.state.minAmount}
                                    {"\t\t-\t\t"}
                                    {this.state.maxAmount}{" "}
                                    {this.state.currencyLabelSelected}
                                  </span>
                                  <br></br>
                                  <br></br>
                                  {sessionStorage.getItem("auth") ===
                                    "true" && (
                                    <label
                                      style={
                                        isMobile === true
                                          ? { color: "#207ef2", fontSize: 11 }
                                          : {}
                                      }
                                    >
                                      {t(
                                        "home.homeLogue.WalletAndBalance.availableBalance"
                                      )}
                                      {":  "}
                                      {this.state.balanceBitcoins} BTC
                                    </label>
                                  )}
                                </strong>
                              )}
                            </Grid.Column>
                          </Grid>
                        )}

                      {(this.state.paymentSelected !== "" ||
                        sessionStorage.getItem("auth") !== "true" ||
                        this.state.typeReceiverFundSelected ===
                          "CASH_DEPOSIT") &&
                        !this.state.notOfer && (
                          <Grid columns={2}>
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={16}
                              computer={8}
                            >
                              <Form.Field required>
                                <label
                                  style={{
                                    fontSize: ".92857143em",
                                    fontWeight: "700",
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  <strong>
                                    {this.state.currencyLabelSelected !== ""
                                      ? t("sell.form.amountIn") +
                                        this.state.currencyLabelSelected
                                      : t("sell.form.amount")}
                                  </strong>
                                </label>
                                <NumberFormat
                                  value={this.state.amountFiat}
                                  readOnly={!this.state.isCurrencySelected}
                                  decimalScale={
                                    this.state.typeCurrency === "crypto" ? 8 : 0
                                  }
                                  placeholder={
                                    this.state.currencyLabelSelected !== ""
                                      ? t("sell.form.amountIn") +
                                        this.state.currencyLabelSelected
                                      : t("sell.form.amountFiat")
                                  }
                                  thousandSeparator={
                                    this.state.typeCurrency !== "crypto"
                                      ? true
                                      : false
                                  }
                                  allowNegative={false}
                                  onChange={this.handleAmountBitcoins.bind(
                                    this
                                  )}
                                  name="fiat"
                                />
                                {labelAmountFiatError}
                              </Form.Field>
                            </Grid.Column>
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={16}
                              computer={8}
                            >
                              <Form.Field required>
                                <label
                                  style={{
                                    fontSize: ".92857143em",
                                    fontWeight: "700",
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  <strong>{t("sell.form.amountBTC")}</strong>
                                </label>
                                <NumberFormat
                                  value={this.state.amountBitcoins}
                                  decimalScale={8}
                                  placeholder="BTC"
                                  allowNegative={false}
                                  onChange={this.handleAmountBitcoins.bind(
                                    this
                                  )}
                                  name="crypto"
                                />
                                {labelAmountCryptoError}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        )}

                      {window.sessionStorage.getItem("auth") !== "true" &&
                        this.state.viewBrokerOffer && (
                          <div>
                            <Grid columns={2}>
                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={10}
                              >
                                {/* {this.state.isCurrencySelected !== "" && */}
                                <Form.Field>
                                  <label>
                                    <strong>
                                      {t("sell.form.businessLimits")}
                                    </strong>
                                    {"   "}
                                  </label>

                                  <span>
                                    {this.state.minAmount}
                                    {"\t\t-\t\t"}
                                    {this.state.maxAmount}{" "}
                                    {this.state.currencyLabelSelected}
                                  </span>
                                </Form.Field>
                              </Grid.Column>
                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={6}
                              >
                                {this.state.hasBankCredentials && (
                                  <Form.Field>
                                    <span>
                                      <strong>
                                        {t(
                                          "buy.form.fields.bankAccountBalance"
                                        )}{" "}
                                        {this.state.availableBalanceCurrency}
                                      </strong>
                                    </span>
                                  </Form.Field>
                                )}
                              </Grid.Column>
                            </Grid>
                            <Grid.Column>
                              <Divider hidden />
                            </Grid.Column>
                            <Grid columns={2}>
                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={8}
                              >
                                <Form.Field required>
                                  <label>
                                    {t("buy.form.fields.amount")}{" "}
                                    {this.state.currencyLabelSelected !== ""
                                      ? "en " + this.state.currencyLabelSelected
                                      : ""}
                                  </label>
                                  <NumberFormat
                                    value={this.state.amountFiat}
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    placeholder={
                                      this.state.currencyLabelSelected !== ""
                                        ? this.state.currencyLabelSelected
                                        : t("buy.form.fields.amountFiat")
                                    }
                                    allowNegative={false}
                                    onChange={this.handleAmountBitcoins.bind(
                                      this
                                    )}
                                    name="fiat"
                                  />
                                  {labelAmountFiatError}
                                </Form.Field>
                                <Form.Field>
                                  {!this.state.currencyLabelSelected === "" && (
                                    <div class="marginTopAndLetterSmall">
                                      <span style={{ marginRight: "10px" }}>
                                        <label>
                                          1 BTC ={" "}
                                          {this.state.currencyLabelSelected}{" "}
                                          {this.state.priceForCalculator.toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 2 }
                                          )}
                                        </label>
                                      </span>
                                    </div>
                                  )}
                                  {this.state.currencyLabelSelected !==
                                    "crypto" && (
                                    <span style={{ marginRight: "10px" }}>
                                      1 BTC = {this.state.currencyLabelSelected}{" "}
                                      {this.state.priceForCalculator.toLocaleString(
                                        "en-US",
                                        { maximumFractionDigits: 2 }
                                      )}
                                    </span>
                                  )}
                                  {this.state.typeCurrency === "crypto" && (
                                    <span style={{ marginRight: "10px" }}>
                                      1 BTC = {this.state.currencyLabelSelected}{" "}
                                      {this.floorDecimals(
                                        1 / this.state.priceForCalculator,
                                        8
                                      )}
                                    </span>
                                  )}
                                  <br />
                                  {this.state.priceUSD !== "" &&
                                    this.state.typeCurrency !== "crypto" && (
                                      <span style={{ marginRight: "10px" }}>
                                        1 USD ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.state.priceUSD.toLocaleString(
                                          "en-US",
                                          { maximumFractionDigits: 2 }
                                        )}{" "}
                                        {t("sell.form.averagePriceReference")}
                                      </span>
                                    )}
                                  {this.state.priceUSD !== "" &&
                                    this.state.typeCurrency === "crypto" && (
                                      <span style={{ marginRight: "10px" }}>
                                        1 USD ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.floorDecimals(
                                          1 / this.state.priceForCalculator,
                                          8
                                        )}{" "}
                                        {t("sell.form.averagePriceReference")}
                                      </span>
                                    )}
                                  {this.state.forexPrice !== "" &&
                                    this.state.typeCurrency !== "crypto" &&
                                    this.state.currencyLabelSelected !==
                                      "VES" && (
                                      <span style={{ marginRight: "10px" }}>
                                        1 USD ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.state.forexPrice.toLocaleString(
                                          "en-US",
                                          {
                                            maximumFractionDigits: 2,
                                          }
                                        )}{" "}
                                        {t("sell.form.forexRate")}
                                      </span>
                                    )}
                                  <br />
                                </Form.Field>
                              </Grid.Column>

                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={8}
                              >
                                <Form.Field>
                                  <label>
                                    {t("buy.form.fields.amountBTC")}
                                  </label>
                                  <NumberFormat
                                    // readOnly={!this.state.isCurrencySelected}
                                    value={this.state.amountBitcoins}
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    placeholder={"BTC"}
                                    onChange={this.handleAmountBitcoins.bind(
                                      this
                                    )}
                                    name="crypto"
                                  />
                                  {labelAmountCryptoError}
                                </Form.Field>
                                {this.state.currencyLabelSelected !== "ETH" && (
                                  <Grid.Column
                                    largeScreen={8}
                                    computer={8}
                                    mobile={8}
                                    tablet={8}
                                  >
                                    <div className="bold">
                                      {(
                                        this.state.amountFiat /
                                        this.state.priceUSD
                                      ).toLocaleString("en-US", {
                                        maximumFractionDigits: 2,
                                      })}{" "}
                                      USD
                                    </div>
                                  </Grid.Column>
                                )}
                              </Grid.Column>
                            </Grid>
                            <Grid columns={3}>
                              <Grid.Column
                                largeScreen={8}
                                computer={8}
                                mobile={8}
                                tablet={8}
                              >
                                <div>
                                  <Form.Field>
                                    {!this.state.currencyLabelSelected ===
                                      "" && (
                                      <div class="marginTopAndLetterSmall">
                                        <span style={{ marginRight: "10px" }}>
                                          <label>
                                            1 BTC ={" "}
                                            {this.state.currencyLabelSelected}{" "}
                                            {this.state.priceForCalculator.toLocaleString(
                                              "en-US",
                                              { maximumFractionDigits: 2 }
                                            )}
                                          </label>
                                        </span>
                                      </div>
                                    )}
                                  </Form.Field>
                                </div>
                              </Grid.Column>
                            </Grid>
                            <Grid>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <div>
                                  <Button
                                    onClick={() => this.gotoSigninToken()}
                                    color="blue"
                                    size="large"
                                  >
                                    {t("navPublic.account.options.signup")}
                                  </Button>
                                </div>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}

                      {this.state.isCurrencySelected && (
                        <Grid columns="equal">
                          <Grid.Column
                            largeScreen={8}
                            mobile={16}
                            tablet={8}
                            computer={8}
                          >
                            {this.state.typeCurrency !== "crypto" && (
                              <span
                                style={{
                                  marginRight: "10px",
                                  color: isMobile === true ? "#207ef2" : "",
                                }}
                              >
                                1 BTC = {this.state.currencyLabelSelected}{" "}
                                {this.state.priceForCalculator.toLocaleString(
                                  "en-US",
                                  { maximumFractionDigits: 2 }
                                )}
                              </span>
                            )}
                            {this.state.typeCurrency === "crypto" && (
                              <span
                                style={{
                                  marginRight: "10px",
                                  color: isMobile === true ? "#207ef2" : "",
                                }}
                              >
                                1 BTC = {this.state.currencyLabelSelected}{" "}
                                {this.floorDecimals(
                                  1 / this.state.priceForCalculator,
                                  8
                                )}
                              </span>
                            )}
                            <br />
                            {this.state.localBitCoinPrice !== "" &&
                              this.state.typeCurrency !== "crypto" && (
                                <span
                                  style={{
                                    marginRight: "10px",
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  1 USD = {this.state.currencyLabelSelected}{" "}
                                  {this.state.localBitCoinPrice.toLocaleString(
                                    "en-US",
                                    { maximumFractionDigits: 2 }
                                  )}{" "}
                                  {t("sell.form.averagePriceReference")}
                                </span>
                              )}
                            {this.state.localBitCoinPrice !== "" &&
                              this.state.typeCurrency === "crypto" && (
                                <span
                                  style={{
                                    marginRight: "10px",
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  1 USD = {this.state.currencyLabelSelected}{" "}
                                  {this.floorDecimals(
                                    1 / this.state.priceForCalculator,
                                    8
                                  )}{" "}
                                  {t("sell.form.averagePriceReference")}
                                </span>
                              )}
                            <br />
                            {this.state.forexPrice !== "" &&
                              this.state.typeCurrency !== "crypto" &&
                              this.state.currencyLabelSelected !== "VES" && (
                                <span
                                  style={{
                                    marginRight: "10px",
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  1 USD = {this.state.currencyLabelSelected}{" "}
                                  {this.state.forexPrice.toLocaleString(
                                    "en-US",
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  {t("sell.form.forexRate")}
                                </span>
                              )}
                          </Grid.Column>
                          {this.state.localBitCoinPrice !== "" && (
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={8}
                              computer={8}
                            >
                              {this.state.typeCurrency !== "crypto" && (
                                <div
                                  className="bold"
                                  style={{
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  {(
                                    this.state.amountFiat /
                                    this.state.localBitCoinPrice
                                  ).toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  USD
                                </div>
                              )}
                              {this.state.typeCurrency === "crypto" && (
                                <div
                                  className="bold"
                                  style={{
                                    color: isMobile === true ? "#207ef2" : "",
                                  }}
                                >
                                  {(
                                    this.state.amountFiat *
                                    this.state.localBitCoinPrice
                                  ).toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  USD
                                </div>
                              )}
                            </Grid.Column>
                          )}
                        </Grid>
                      )}

                      {(this.state.paymentSelected !== "" ||
                        this.state.typeReceiverFundSelected ===
                          "CASH_DEPOSIT") &&
                        !this.state.notOfer && (
                          <Grid columns={1}>
                            {this.state.accountTypeSelected ===
                              "THIRD_PARTIES" && (
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <label
                                    style={{
                                      color: isMobile === true ? "#207ef2" : "",
                                    }}
                                  >
                                    {t("sell.form.operationConcept")}
                                  </label>
                                  <Input
                                    fluid
                                    name="operationConcept"
                                    placeholder={t(
                                      "sell.form.placeholderOperationConcept"
                                    )}
                                    onChange={this.handleOperationConcept}
                                  />
                                  {labelOperationConcept}
                                </Form.Field>
                              </Grid.Column>
                            )}
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <label
                                style={{
                                  color: isMobile === true ? "#207ef2" : "",
                                  fontWeight: "bold",
                                }}
                              >
                                {t("sell.form.comment")}
                              </label>
                              <TextArea
                                value={this.state.commentInitial}
                                onChange={this.handleComment}
                                style={{
                                  minHeight: 105,
                                }}
                              />
                            </Grid.Column>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Group inline required>
                                <Form.Checkbox
                                  onChange={this.handleCheckterms.bind(this)}
                                  checked={this.state.checkterm}
                                  required
                                />
                                <Form.Field required>
                                  {t("sell.form.accept")}{" "}
                                  <a
                                    onClick={this.handleShowTermAndCondicionModal.bind(
                                      this
                                    )}
                                    className={"linkVerMas"}
                                  >
                                    {t("sell.form.terms")}
                                    {""}
                                  </a>
                                </Form.Field>
                              </Form.Group>

                              {this.state.viewMessageTerm && (
                                <Message info>{t(this.state.message)}</Message>
                              )}
                            </Grid.Column>
                            {this.state.viewMessageErrorExternal && (
                              <Grid colums={1}>
                                <Grid.Column
                                  largeScreen={16}
                                  mobile={16}
                                  tablet={16}
                                  computer={16}
                                >
                                  <Message
                                    color={this.state.color}
                                    content={t(this.state.message)}
                                  />
                                </Grid.Column>
                              </Grid>
                            )}
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                              textAlign="center"
                            >
                              {sessionStorage.getItem("auth") === "true" &&
                                !isMobile && (
                                  <div align="right">
                                    <Button
                                      onClick={this.handleSubmitSellBitcoins}
                                      type="submit"
                                      color="blue"
                                      size="large"
                                    >
                                      {t("sell.form.sell")}
                                    </Button>
                                  </div>
                                )}

                              {sessionStorage.getItem("auth") === "true" &&
                                this.state.varlog && (
                                  <div align="right">
                                    <Button
                                      onClick={this.rejectOffer.bind(this)}
                                      type="button"
                                      color="red"
                                      size="large"
                                      style={{ marginTop: "10px" }}
                                    >
                                      {t("sell.form.reject")}
                                    </Button>
                                  </div>
                                )}

                              {sessionStorage.getItem("auth") === "true" &&
                                isMobile && (
                                  <div align="center">
                                    <Button
                                      onClick={this.handleSubmitSellBitcoins}
                                      type="submit"
                                      color="blue"
                                      size="large"
                                      style={{
                                        borderRadius: "40px/40px",
                                        height: "50px",
                                        width: "200px",
                                      }}
                                    >
                                      {t("sell.form.sell")}
                                    </Button>
                                  </div>
                                )}
                            </Grid.Column>
                          </Grid>
                        )}

                      <Grid>
                        <Grid.Column
                          largeScreen={16}
                          mobile={16}
                          tablet={16}
                          computer={16}
                          textAlign="center"
                        >
                          {sessionStorage.getItem("auth") !== "true" &&
                            !this.state.notOfer &&
                            !isMobile && (
                              <div align="right">
                                <Button
                                  onClick={() => this.gotoSignin()}
                                  color="blue"
                                  size="large"
                                >
                                  {t("navPublic.account.options.signup")}
                                </Button>
                              </div>
                            )}
                          {sessionStorage.getItem("auth") !== "true" &&
                            !this.state.notOfer &&
                            isMobile && (
                              <div align="center">
                                <Button
                                  onClick={() => this.gotoSignin()}
                                  color="blue"
                                  size="large"
                                  style={{
                                    borderRadius: "40px/40px",
                                    height: "50px",
                                    width: "200px",
                                  }}
                                >
                                  {t("navPublic.account.options.signup")}
                                </Button>
                              </div>
                            )}
                        </Grid.Column>
                      </Grid>
                    </Form>
                  </Container>
                )}
                {!this._isMounted && <div>holaaa</div>}
              </Segment>

              <Divider hidden section />
              <Divider hidden section />
            </Container>
          </Grid.Column>
        </Grid>

        {this.state.openSellConfirm && (
          <ModalSendSellBitcoins
            namePaymenType={this.state.paymentTypeKeySelected}
            openSellConfirm={this.state.openSellConfirm}
            amountBitcoins={this.state.amountBitcoins}
            amountFiat={this.state.amountFiat}
            messageTerminsAndConditions={this.state.messageTerminsAndConditions}
            currencyLabelSelected={this.state.currencyLabelSelected}
            allowToAddPayment={this.state.allowToAddPayment}
            commentInitial={this.state.commentInitial}
            paymentType={this.state.paymentSelected}
            bodySellBitCoins={this.state.bodySellBitCoins}
            handleCloseSendConfirm={this.handleCloseSendConfirm.bind(this)}
            redirectToMySellToModal={this.redirectToMySell.bind(this)}
            changueAmountbit={this.changueAmountBtc.bind(this)}
            chargesByOperation={this.state.chargesByOperation}
            infoOffices={this.state.officeInfoView}
          />
        )}

        <Modal
          open={this.state.showModalTerm}
          //open={this.handleShowTermAndCondicionModal.bind(this)}
          //
          onClose={this.handleCloseModalTerm.bind(this)}
        >
          <Modal.Header>{t("sell.form.terms")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Message info>
                <TermsAndConditions />
              </Message>
            </Modal.Description>
          </Modal.Content>
          {isMobile && (
            <div align="center">
              <Modal.Actions>
                <Button
                  onClick={this.handleCloseModalTerm.bind(this)}
                  color="grey"
                  style={{
                    borderRadius: "40px/40px",
                    height: "50px",
                    width: "200px",
                  }}
                >
                  {t("sell.form.buttonClose")}
                </Button>
                {!this.state.checkterm && (
                  <Button
                    color="blue"
                    onClick={this.handleCheckterms.bind(this)}
                    style={{
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px",
                    }}
                  >
                    {t("sell.form.buttonAcceptTerms")}
                  </Button>
                )}
              </Modal.Actions>
            </div>
          )}
          {!isMobile && (
            <Modal.Actions>
              <Button
                onClick={this.handleCloseModalTerm.bind(this)}
                color="grey"
              >
                {t("sell.form.buttonClose")}
              </Button>
              {!this.state.checkterm && (
                <Button color="blue" onClick={this.handleCheckterms.bind(this)}>
                  {t("sell.form.buttonAcceptTerms")}
                </Button>
              )}
            </Modal.Actions>
          )}
        </Modal>
      </div>
    );
  }
}

export default translate(FormSellBitcoins);
