/* eslint-disable no-loop-func */
import React, { Component } from "react";
import "../BuyBitcoins.css";
import {
  Button,
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
  Responsive,
  Header,
  GridRow,
} from "semantic-ui-react";
import currency from "../../../common/currency";
import brokers from "../../../services/brokers";
import market from "../../../services/market";
import NumberFormat from "react-number-format";
import DinamicForm from "../../DinamicForm/DinamicForm";
import otcAPI from "../../../services/otc";
import forexAPI from "../../../services/forex";
import { parse } from "query-string";
import paymentApi from "../../../services/payment";
import Axios from "axios";
import translate from "../../../i18n/translate";
import term from "../../../common/termAndConditionsSell";
import { isMobile } from "react-device-detect";
import TermsAndConditions from "../../TermsAndConditions/TermsAndConditions";
//import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";
import "../BuyBitcoins.css";
class FormBuyBitcoin extends Component {
  constructor(props) {
    let timer = null;
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
      "PERSONAL_CHECK_DEPOSIT",
      props.translate("profile.addAccount.personalCheckDeposit")
    );
    mapPayments.set(
      "CASHIER_CHECK_DEPOSIT",
      props.translate("profile.addAccount.cashierCheckDeposit")
    );
    mapPayments.set(
      "MONEY_ORDER",
      props.translate("profile.addAccount.moneyOrder")
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
    mapPayments.set(
      "CREDIT_CARD",
      props.translate("profile.addAccount.creditCard")
    );
    mapPayments.set(
      "ACCOUNT_BANK",
      props.translate("dynamicForm.labels.bankAndOffice")
    );
    mapPayments.set("MAIN", props.translate("moneyclick.menu.moneyclick"));
    this.state = {
      showPreviewModal: false,
      sectionStyle: {
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        backgroundImage: "",
      },
      specialValue: false,
      allMessageTerminsAndConditions: [],
      mapPayments: mapPayments,
      currencyLabelSelected: null, //guarda el nombre de la moneda selecciona.
      isCurrencySelected: false, // se usa para mostrar ciertos label justo luego que se selecciona la moneda fiat.
      minAmount: 0, //monto minimo fiat para cada operación de compra.
      maxAmount: 0, //monto minimo fiat para cada operación de compra.
      priceForCalculator: 0, //precio del bitcoin que se obtiene para la operación en getOffers
      prices: [], // guarda todos los prices de las diferendtes monedas.
      paymentsDollarBTC: [], //contiene todos los pagos asociados a la moneda que selecciono el usuario.
      checkBoxSinRepetir: [],
      typePaymentsSelect: [], // contiene todos las formas de pagos asociados a dollarBTC.
      dollarBTCTypePaymentSelected: null,
      selectPaymentsDollarBTCFormated: [], // contiene todos los paymentsDollarBTC asociados a la forma de pago seleccionado previamente.
      dollarBTCPaymentSelected: "", //Contiene el payment de dollarBTC seleccionado en el combo.
      clientPaymentSelected: null, // Contiene el payment del cliente seleccionado en el combo.
      dollarBTCPaymentTypeSeleced: null,
      clientPaymentTypeSelected: null,
      paymentsFromUserForSelect: [],
      commentInitial: "", // comentario inical en la operación.
      amountFiat: "", //monto
      amountBitcoins: "",
      errorAmountFiat: false,
      errorPaymentTypeElectronic: "",
      message: "",
      messageOperation: "",
      messageTerminsAndConditions: "",
      errorMoneda: false,
      errorPayment: false,
      bodyBuyBitCoins: "",
      openBuyConfirm: false,
      imgCurrencySelected: "",
      currencyNameByURL: "",
      operationReady: false,
      acceptIn: true,
      listItemModal: [],
      viewBrokerOffer: false,
      identifier: "",
      isCreatedClientPayment: false,
      dollarBTCTypePaymentsFormaterSelect: [],
      formLoad: false,
      viewMessage: false,
      textMessage: "",
      resultUpdate: null,
      paymentBody: [],
      paymentIdBroker: "",
      BrokerUserName: "",
      ////////////////////////////////////////////Variables de la verificación de usuario.
      joinMyPayments: false,
      joinFieldValue: false,
      contSend: 0,
      show: false,
      showDimmer: false,
      statusUser: {},
      priceUSDByCurrency: [],
      priceUSD: 0,
      payWindow: "",
      showModalCreatePayment: false,
      bankSelectedDollarBTC: "",
      rateForex: "",
      currencies: [], // guarda todas las modenas fiat en forma estatica. Este array se filtra por las monedas asociadas.
      clientTypePayments: [],
      pricetosend: "",
      accumulatedAmount: 0,
      totalAmount: 0,
      offerWithoutFunds: false,
      listOfertsByCurrency: [],
      offerMaxPrice: {},
      errorAmountCrypto: false,
      showModalTerminsAnsConditions: false,
      viewMessageTerm: false,
      termsAndConditionsAccepted: false,
      translator: props.translate,
      isElectronicTrans: false,
      typePaymentsElectronics: [],
      dollarBTCPaymentTypeElectronicSelected: null,
      hasBankCredentials: false,
      availableBalanceCurrency: "",
      allPaymentsUserByCurrency: [],
      amountChangedTo: 0,
      errorServer: false,
      hasOffersAsk: false,
      textTerm: [],
      paymentFilteredByOferts: [],
      typePaymentSelectedNew: "",
      typePaymentsToSelected: [],
      blockField: false,
      newLimits: "",
      optionCheckDeposit: [],
      chargesByOperation: [],
      infoOfficess: [],
      isRealDataInfoOffices: [],
    };
    this.handleChangeCurrencySelect = this.handleChangeCurrencySelect.bind(
      this
    );
    this.handleSubmitBuyBitcoins = this.handleSubmitBuyBitcoins.bind(this);
    this.handleComments = this.handleComments.bind(this);
    this.blankErrors = this.blankErrors.bind(this);
    this.closeSendConfirm = this.closeSendConfirm.bind(this);
    this.aceptSendConfirm = this.aceptSendConfirm.bind(this);
    this.handleBankAccountBalance = this.handleBankAccountBalance.bind(this);
    this.findBankAccountBalance = this.findBankAccountBalance.bind(this);
    this.getOfferByCurrency = this.getOfferByCurrency.bind(this);
    this._isMounted = false;
    this.getBrokerOffer = this.getBrokerOffer.bind(this);
    this.getOfferByUrl = this.getOfferByUrl.bind(this);
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
      "PERSONAL_CHECK_DEPOSIT",
      nextProps.translate("profile.addAccount.personalCheckDeposit")
    );
    mapPayments.set(
      "CASHIER_CHECK_DEPOSIT",
      nextProps.translate("profile.addAccount.cashierCheckDeposit")
    );
    mapPayments.set(
      "MONEY_ORDER",
      nextProps.translate("profile.addAccount.moneyOrder")
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
    mapPayments.set(
      "CREDIT_CARD",
      nextProps.translate("profile.addAccount.creditCard")
    );
    mapPayments.set(
      "ACCOUNT_BANK",
      nextProps.translate("dynamicForm.labels.bankAndOffice")
    );
    mapPayments.set("MAIN", nextProps.translate("moneyclick.menu.moneyclick"));
    this.setState(
      {
        statusUser: nextProps.statusUser,
        mapPayments: mapPayments,
      },
      () => {
        this.setState({
          show: true,
        });
        //////////console.log('statusUser after refresh', this.state.statusUser)
      }
    );

    if (
      this.props.language !== nextProps.language &&
      this.state.allMessageTerminsAndConditions !== undefined
    ) {
      // ////////console.log(this.state.allMessageTerminsAndConditions)
      this.setState({ messageTerminsAndConditions: [] }, () => {
        for (let val of this.state.allMessageTerminsAndConditions) {
          let color = val.color;
          let message = "";
          if (nextProps.language === val.language) {
            message = val.message;
            if (color !== "blue") {
              this.state.messageTerminsAndConditions.push(
                <Message
                  color={color}
                  content={() => {
                    if (
                      message.startsWith(
                        "Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.ethAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Nota: Sus bitcoins estarán diferidos hasta que su depósito esté acreditado y sea verificado"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.blueAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Atención: La transferencia sólo podrá realizarla desde su cuenta bancaria verificada y"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.redAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Up to a maximum of $ 2,000 is allowed"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.errors.comercialLimit"
                      );
                    } else if (
                      message.startsWith(
                        "Please note that for your first trade with us, we require that you initiate the wire in person at your bank"
                      )
                    ) {
                      return this.state.translator("buy.form.errors.firstBuy");
                      //Tenga en cuenta que para su primera operación con nosotros, le solicitamos que inicie la transferencia en persona en su banco.
                    } else return message;
                  }}
                  class="padding-top-message"
                />
              );
            } else {
              this.state.messageTerminsAndConditions.push(
                <Message
                  info
                  content={() => {
                    if (
                      message.startsWith(
                        "Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.ethAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Nota: Sus bitcoins estarán diferidos hasta que su depósito esté acreditado y sea verificado"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.blueAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Atención: La transferencia sólo podrá realizarla desde su cuenta bancaria verificada y"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.redAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Un monto maximo de $ 2,000 es permitido"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.errors.comercialLimit"
                      );
                    } else if (
                      message.startsWith(
                        "Tenga en cuenta que para su primera operación con nosotros, le solicitamos que inicie la transferencia en persona en su banco."
                      )
                    ) {
                      return this.state.translator("buy.form.errors.firstBuy");
                    } else return message;
                  }}
                  class="padding-top-message"
                />
              );
            }
          }
        }
      });

      this.setState({
        translator: nextProps.translate,
      });
      if (this.state.typePaymentsToSelected.length > 0) {
        let setArray = this.state.typePaymentsToSelected.map((element) => {
          let item = {
            text: mapPayments.get(element.value),
            value: element.value,
            disabled: element.disabled,
          };
          return item;
        });
        this.setState({ typePaymentsToSelected: setArray });
      }
      if (this.state.dollarBTCTypePaymentsFormaterSelect.length > 0) {
        let setArraytype = this.state.dollarBTCTypePaymentsFormaterSelect.map(
          (element) => {
            let item = {
              text: mapPayments.get(element.value),
              value: element.value,
              description: element.description,
            };
            return item;
          }
        );
        this.setState({ dollarBTCTypePaymentsFormaterSelect: setArraytype });
      }
      if (this.state.typePaymentsElectronics.length > 0) {
        let setArraytypeElectronic = this.state.typePaymentsElectronics.map(
          (element) => {
            let item = {
              text: mapPayments.get(element.value),
              value: element.value,
            };
            return item;
          }
        );
        this.setState({ typePaymentsElectronics: setArraytypeElectronic });
      }
      if (this.state.optionCheckDeposit.length > 0) {
        let setArraytypeDeposit = this.state.optionCheckDeposit.map(
          (element) => {
            let item = {
              text: mapPayments.get(element.value),
              value: element.value,
              key: element.key,
            };
            return item;
          }
        );
        this.setState({ optionCheckDeposit: setArraytypeDeposit });
      }
      if (this.state.isRealDataInfoOffices.length > 0) {
        let arrayInfo = [];
        for (let info of this.state.isRealDataInfoOffices) {
          let obj = {
            fullInfo: info,
            value: [],
          };
          Object.entries(info).forEach(([key, val]) => {
            if (key === "website" && val !== "") {
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
        this.setState({ infoOfficess: arrayInfo });
      }
    }
  }
  handleComments(e) {
    this.setState({ commentInitial: e.target.value });
  }
  handleIdentifier(e) {
    this.setState({ identifier: e.target.value });
  }
  getCurrencies() {
    this.setState({ loadForm: true });
    otcAPI
      .getCurrencies()
      .then((response) => {
        this.setState({ loadForm: false });
        let arrayCurrency = response.data;
        //   //////////console.log('currencies ',response.data);
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
        this.setState(
          {
            currencies: arrayCurrency,
          },
          () => {
            this.readUrlWhitParams();
            let keys = Object.keys(parse(window.location.search));
            if (keys.indexOf("c") !== -1) {
              this.handleChangeCurrency(parse(window.location.search).c);
            } else {
              if (
                sessionStorage.getItem(
                  "formBuyBitcoins.currencyLabelSelected"
                ) !== "null" &&
                sessionStorage.getItem(
                  "formBuyBitcoins.currencyLabelSelected"
                ) !== ""
              ) {
                // ////////console.log('es null?',sessionStorage.getItem('formBuyBitcoins.currencyLabelSelected'));
                this.setState(
                  {
                    currencyLabelSelected: sessionStorage.getItem(
                      "formBuyBitcoins.currencyLabelSelected"
                    ),
                  },
                  () => {
                    this.handleChangeCurrency(this.state.currencyLabelSelected);
                  }
                );
              }
            }
          }
        );
      })
      .catch((error) => {
        //////////console.log('error getCurrencies ',error);
      });
  }
  saveInsessionStorage(key, value) {
    if (key === "currencyLabelSelected") {
      sessionStorage.setItem("formBuyBitcoins.currencyLabelSelected", value);
    } else if (key === "dollarBTCTypePaymentSelected") {
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentSelected",
        value
      );
    } else if (key === "bankSelectedDollarBTC") {
      sessionStorage.setItem("formBuyBitcoins.bankSelectedDollarBTC", value);
    } else if (key === "dollarBTCTypePaymentTransferSelected") {
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentTransferSelected",
        value
      );
    }
  }
  clearDatasessionStorageFormBuy(item) {
    if (item === "currency") {
      sessionStorage.setItem("formBuyBitcoins.currencyLabelSelected", null);
      sessionStorage.setItem("formBuyBitcoins.bankSelectedDollarBTC", null);
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentSelected",
        null
      );
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentTransferSelected",
        null
      );
      // sessionStorage.setItem("typePaymentSelectedNew", "");
    } else if (item === "bank") {
      sessionStorage.setItem("formBuyBitcoins.bankSelectedDollarBTC", null);
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentSelected",
        null
      );
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentTransferSelected",
        null
      );
    } else if (item === "paymentType") {
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentSelected",
        null
      );
      sessionStorage.setItem(
        "formBuyBitcoins.dollarBTCTypePaymentTransferSelected",
        null
      );
    }
  }
  getForexRate(currency) {
    forexAPI
      .getRate("USD" + currency)
      .then((res) => {
        //  //////////console.log('rateForex ',res.data.rate);
        this.setState({
          rateForex: res.data.rate,
        });
      })
      .catch((error) => {
        //////////console.log('error forex ',error);
      });
    this.state.currencies
      .filter((currencyInArray) => {
        return currency === currencyInArray.shortName;
      })
      .map((currencySelected) => {
        let sectionStyleNow = {
          backgroundImage: "url(" + currencySelected.img + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        };
        this.setState({
          sectionStyle: sectionStyleNow,
        });
        this.setState({
          imgCurrencySelected: currencySelected.img,
        });
      });
    let arrayPriceUSD = this.state.priceUSDByCurrency.filter((coin) => {
      return coin.currency === currency;
    });
    this.setState({
      priceUSD: arrayPriceUSD.length > 0 ? arrayPriceUSD[0].priceUSD : 0,
    });
  }
  handleChangeCurrency(currency) {
    // ////////console.log(currency)

    //obtiene la tasa forex de la moneda
    this.getForexRate(currency);
    this.setState(
      {
        currencyLabelSelected: currency,
        isCurrencySelected: true,
        typePaymentsToSelected: [],
      },
      () => this.saveInsessionStorage("currencyLabelSelected", currency)
    );

    this.getClientPaymentType(currency);
  }
  handleChangeCurrencySelect(event, data) {
    this.clearDatasessionStorageFormBuy("currency");
    this.cleanFields("currency");
    this.setState({ isCheckDeposit: false });
    this.handleChangeCurrency(data.value);
    this.setState({ bankSelectedDollarBTC: "", infoOfficess: [] });
  }
  async getInfoOfficedsByPayment(officeId) {
    try {
      const response = await otcAPI.getOfficesInfoOtc(
        this.state.currencyLabelSelected,
        officeId
      );
      let arrayInfo = [];
      this.setState({ isRealDataInfoOffices: response.data });
      for (let info of response.data) {
        let obj = {
          fullInfo: info,
          value: [],
        };
        Object.entries(info).forEach(([key, val]) => {
          if (key === "website" && val !== "") {
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
  async handleChangePaymentDollarBTC(bankSelect, source) {
    if (source === undefined) {
      this.cleanFields("paymentsDollarBTC", bankSelect);
    }
    this.setState({
      dollarBTCTypePaymentsFormaterSelect: [],
      typePaymentsElectronics: [],
      dollarBTCTypePaymentSelected: "",
      dollarBTCPaymentTypeElectronicSelected: null,
      dollarBTCPaymentTypeSeleced: null,
      typeCheckSelected: "",
      clientPaymentSelected: null,
      isElectronicTrans: false,
      isCreatedClientPayment: false,
      isCheckDeposit: false,
      messageTerminsAndConditions: [],
      paymentsFromUserForSelect: [],
      infoOfficess: [],
    });

    let arrayFilteredByBank;

    if (bankSelect.toString().includes("BANK")) {
      let splitArray = bankSelect.toString().split("__")[2];
      let typePayment = bankSelect.toString().split("__")[3];
      let paymentTypeSelect = this.state.paymentsDollarBTC.find((payment) => {
        if (payment.bank === splitArray) {
          return payment;
        }
      });
      if (paymentTypeSelect.officesInfoId !== undefined) {
        let infoOffices = await this.getInfoOfficedsByPayment(
          paymentTypeSelect.officesInfoId
        );
        if (infoOffices !== false) {
          this.setState({ infoOfficess: infoOffices });
        }
      }

      arrayFilteredByBank = this.state.paymentsDollarBTC.filter((payment) => {
        if (payment.bank === splitArray && payment.active) {
          return payment;
        }
      });
      //////////console.log(bankSelect, "aquiiii", arrayFilteredByBank);
    } else {
      let typePayment = bankSelect.toString().split("__")[3];
      arrayFilteredByBank = this.state.paymentsDollarBTC.filter(
        (payment) => payment.active
      );
    }
    //////////console.log(arrayFilteredByBank);
    let mapTypes = new Map();
    let mapTypeTransferElectronic = new Map();
    let idPaymentBanck = bankSelect.toString().split("__")[1];
    if (arrayFilteredByBank.length > 0) {
      for (let i = 0; i < arrayFilteredByBank.length; i++) {
        let type = arrayFilteredByBank[i].type;
        if (
          type === "TRANSFER_WITH_SPECIFIC_BANK" ||
          type === "TRANSFER_NATIONAL_BANK" ||
          type === "TRANSFER_INTERNATIONAL_BANK" ||
          type === "WIRE_TRANSFER"
        ) {
          let findOffertsByType = this.state.allOfferts.find(function (ofert) {
            return (
              ofert.id.includes(arrayFilteredByBank[i].id) &&
              ofert.id.includes(type)
            );
          });
          if (findOffertsByType !== undefined) {
            let item = {};
            item.text = this.state.mapPayments.get(arrayFilteredByBank[i].type);
            item.value = arrayFilteredByBank[i].type;
            mapTypeTransferElectronic.set(arrayFilteredByBank[i].type, item);
            if (!mapTypes.has("ELECTRONIC_TRANSFER")) {
              arrayFilteredByBank[i].text = this.state.mapPayments.get(
                "ELECTRONIC_TRANSFER"
              );
              arrayFilteredByBank[i].value = "ELECTRONIC_TRANSFER";
              arrayFilteredByBank[i].description = "";

              mapTypes.set("ELECTRONIC_TRANSFER", arrayFilteredByBank[i]);
            }
          }
        } else if (type !== "CREDIT_CARD") {
          if (
            type === "PERSONAL_CHECK_DEPOSIT" ||
            type === "CASHIER_CHECK_DEPOSIT" ||
            type === "MONEY_ORDER"
          ) {
            let findOffertsByType = this.state.allOfferts.find(function (
              ofert
            ) {
              return (
                ofert.id.includes(arrayFilteredByBank[i].id) &&
                ofert.id.includes(type)
              );
            });
            if (findOffertsByType !== undefined) {
              if (!mapTypes.has("CHECK_DEPOSIT")) {
                arrayFilteredByBank[i].text = this.state.mapPayments.get(
                  "CHECK_DEPOSIT"
                );
                arrayFilteredByBank[i].value = "CHECK_DEPOSIT";
                arrayFilteredByBank[i].description = "";

                mapTypes.set("CHECK_DEPOSIT", arrayFilteredByBank[i]);
              }
            }
          } else {
            //  ////////console.log(type);
            let findOffertsByType = this.state.allOfferts.find(function (
              ofert
            ) {
              return (
                ofert.id.includes(arrayFilteredByBank[i].id) &&
                ofert.id.includes(type)
              );
            });
            if (findOffertsByType !== undefined) {
              if (!mapTypes.has(type)) {
                arrayFilteredByBank[i].text = this.state.mapPayments.get(
                  arrayFilteredByBank[i].type
                );
                arrayFilteredByBank[i].value = arrayFilteredByBank[i].type;
                arrayFilteredByBank[i].description = "";
                mapTypes.set(
                  arrayFilteredByBank[i].type,
                  arrayFilteredByBank[i]
                );
              }
            }
          }
        }
      }
    } else {
      this.setState({
        viewMessage: true,
        hasOffersAsk: false,
        message: "buy.form.errors.notOffersForCurrencyAndBank",
        messageTerminsAndConditions: "",
      });

      this.timer = setTimeout(() => {
        this.setState({ viewMessage: false, message: "" });
      }, 3000);
    }
    this.setState(
      {
        bankSelectedDollarBTC: bankSelect,
      },
      () => {
        sessionStorage.setItem(
          "formBuyBitcoins.bankSelectedDollarBTC",
          bankSelect
        );
        this.setState(
          {
            dollarBTCTypePaymentsFormaterSelect: Array.from(mapTypes.values()),
            typePaymentsElectronics: Array.from(
              mapTypeTransferElectronic.values()
            ),
          },
          () => {
            if (
              sessionStorage.getItem(
                "formBuyBitcoins.dollarBTCTypePaymentSelected"
              ) !== "null" &&
              sessionStorage.getItem(
                "formBuyBitcoins.dollarBTCTypePaymentSelected"
              ) !== null
            ) {
              //  ////////console.log("aq")
              this.setState(
                {
                  dollarBTCTypePaymentSelected: sessionStorage.getItem(
                    "formBuyBitcoins.dollarBTCTypePaymentSelected"
                  ),
                },
                () => {
                  this.handleOnchangeDollarBTCTypePayments(
                    this.state.dollarBTCTypePaymentSelected
                  );
                  if (
                    sessionStorage.getItem(
                      "formBuyBitcoins.dollarBTCTypePaymentTransferSelected"
                    ) !== "null" &&
                    this.state.dollarBTCTypePaymentSelected ===
                      "ELECTRONIC_TRANSFER"
                  ) {
                    //    //////////console.log("paso el if raro",this.state.dollarBTCTypePaymentSelected)
                    this.setState(
                      {
                        dollarBTCPaymentTypeElectronicSelected: sessionStorage.getItem(
                          "formBuyBitcoins.dollarBTCTypePaymentTransferSelected"
                        ),
                      },
                      () => {
                        this.handleDollarBTCTypePaymentElectronic(
                          this.state.dollarBTCPaymentTypeElectronicSelected
                        );
                      }
                    );
                  }
                }
              );
            } else if (mapTypes.size === 1) {
              this.setState(
                {
                  dollarBTCTypePaymentSelected: Array.from(mapTypes.values())[0]
                    .value,
                  modalTern: true,
                },
                () => {
                  this.handleOnchangeDollarBTCTypePayments(
                    this.state.dollarBTCTypePaymentSelected
                  );
                }
              );
            }

            if (
              mapTypeTransferElectronic.size === 1 &&
              this.state.dollarBTCTypePaymentsFormaterSelect.length === 1
            ) {
              this.setState(
                {
                  dollarBTCPaymentTypeElectronicSelected: Array.from(
                    mapTypeTransferElectronic.values()
                  )[0].value,
                  modalTern: true,
                },
                () => {
                  this.handleDollarBTCTypePaymentElectronic(
                    this.state.dollarBTCPaymentTypeElectronicSelected
                  );
                }
              );
            }
          }
        );
      }
    );
  }
  formatedByOfertUrl(paymentDBT, typeOfert) {
    let arrayClientTypePayments = this.state.clientTypePayments.find((item) => {
      return item.name === typeOfert;
    });
    this.setState(
      {
        clientPaymentTypeSelected: arrayClientTypePayments, //Obtengo la configuración base del payment type del cliente.
      },
      async () => {
        if (paymentDBT !== undefined) {
          if (paymentDBT.officesInfoId !== undefined) {
            let infoOffices = await this.getInfoOfficedsByPayment(
              paymentDBT.officesInfoId
            );
            if (infoOffices !== false) {
              this.setState({ infoOfficess: infoOffices });
            }
          }
          if (typeOfert !== "CREDIT_CARD") {
            this.loadItemShowModal(paymentDBT);
            if (paymentDBT.payWindow !== undefined) {
              ////////console.log("si es distinto de credit card:", paymentDBT)
              this.setState({
                payWindow: paymentDBT.payWindow,
              });
            }
            this.setState({ listItemModal: [] });
            this.loadTerminsAnsConditions(
              this.state.clientPaymentTypeSelected.messages,
              paymentDBT.messages
            );
            this.setState(
              {
                acceptIn: paymentDBT.acceptIn,
                joinMyPayments: paymentDBT.joinMyPayments,
                joinFieldValue: paymentDBT.joinFieldValue,
                dollarBTCPaymentSelected: paymentDBT,
              },
              () => {
                this.onLoadPaymentsClients(this.state.currencyLabelSelected);
              }
            );
            //////console.log(this.state.dollarBTCPaymentSelected)
            let mapTypes = new Map();
            let mapTypeTransferElectronic = new Map();
            let type = paymentDBT.type;
            ////////console.log("type", type);

            if (
              type === "TRANSFER_WITH_SPECIFIC_BANK" ||
              type === "TRANSFER_NATIONAL_BANK" ||
              type === "TRANSFER_INTERNATIONAL_BANK" ||
              type === "WIRE_TRANSFER"
            ) {
              let item = {};
              item.text = this.state.mapPayments.get(type);
              item.value = type;
              mapTypeTransferElectronic.set(type, item);
              ////////console.log("cargando", mapTypeTransferElectronic);

              if (!mapTypes.has("ELECTRONIC_TRANSFER")) {
                let itemTwo = {};
                itemTwo.text = this.state.mapPayments.get(
                  "ELECTRONIC_TRANSFER"
                );
                itemTwo.value = "ELECTRONIC_TRANSFER";
                itemTwo.description = "";

                mapTypes.set("ELECTRONIC_TRANSFER", itemTwo);
              }
            } else if (type !== "CREDIT_CARD") {
              ////////console.log("entrando por distinto de credit card");
              if (
                type === "PERSONAL_CHECK_DEPOSIT" ||
                type === "CASHIER_CHECK_DEPOSIT" ||
                type === "MONEY_ORDER"
              ) {
                if (!mapTypes.has("CHECK_DEPOSIT")) {
                  ////////console.log("entrando por check deposit");
                  let item = {};
                  item.text = this.state.mapPayments.get("CHECK_DEPOSIT");
                  item.value = "CHECK_DEPOSIT";
                  item.description = "";

                  mapTypes.set("CHECK_DEPOSIT", item);
                }
              } else {
                ////////console.log("has type", mapTypes.has(type));
                if (!mapTypes.has(type)) {
                  ////////console.log("entrando por el else no tiene type");
                  let item = {};
                  item.text = this.state.mapPayments.get(type);
                  item.value = type;
                  item.description = "";
                  mapTypes.set(type, item);
                  ////////console.log(mapTypes, "mapTypes");
                }
              }
            }
            //////////console.log(mapTypeTransferElectronic, mapTypes, "BANK__" + paymentDBT.id + "__" + paymentDBT.bank)
            this.setState(
              {
                bankSelectedDollarBTC:
                  "BANK__" + paymentDBT.id + "__" + paymentDBT.bank,
              },
              () => {
                this.setState(
                  {
                    dollarBTCTypePaymentsFormaterSelect: Array.from(
                      mapTypes.values()
                    ),
                    typePaymentsElectronics: Array.from(
                      mapTypeTransferElectronic.values()
                    ),
                  },
                  () => {
                    let value = Array.from(mapTypes.values())[0].value;
                    this.handleOnchangeDollarBTCTypePayments(value, "url");
                    this.setState({
                      dollarBTCTypePaymentSelected: Array.from(
                        mapTypes.values()
                      )[0].value,
                      modalTern: true,
                    });
                    ////////console.log("ANTES", mapTypeTransferElectronic);
                    if (mapTypeTransferElectronic.size > 0) {
                      this.setState(
                        {
                          dollarBTCPaymentTypeElectronicSelected: Array.from(
                            mapTypeTransferElectronic.values()
                          )[0].value,
                          modalTern: true,
                        }
                        // () => {
                        //   this.handleDollarBTCTypePaymentElectronic(
                        //     this.state.dollarBTCPaymentTypeElectronicSelected
                        //   );
                        // }
                      );
                    }
                  }
                );
              }
            );
          } else {
            this.setState({ dollarBTCPaymentTypeSeleced: typeOfert }, () =>
              this.loadOfferPaymentClientAndMessages(typeOfert)
            );
          }
        }
      }
    );
  }
  handleChangePaymentDollarBTCSelect = (event, data) => {
    //////console.log(7)
    this.clearDatasessionStorageFormBuy("bank");
    this.handleChangePaymentDollarBTC(data.value);
  };
  validateBuy() {
    //////console.log(this.state.dollarBTCPaymentSelected)
    if (this.state.currencyLabelSelected === "") {
      this.setState({
        errorMoneda: true,
        message: "buy.form.errors.requiredField",
      });
      this.blankErrors("errorMoneda");
      return false;
    } else if (this.state.amountFiat === "" || this.state.amountFiat === 0) {
      this.setState({
        errorAmountFiat: true,
        message: "buy.form.errors.requiredField",
      });
      this.blankErrors("errorAmountFiat");
      return false;
    } else if (
      this.state.amountFiat < this.state.minAmountNumber ||
      this.state.amountFiat > this.state.maxAmountNumber
    ) {
      this.setState({
        errorAmountFiat: true,
        message: "buy.form.errors.minAndMax",
      });
      this.blankErrors("errorAmountFiat");
      return false;
    } else if (this.state.dollarBTCPaymentSelected === "") {
      //////console.log("error de payment selected")
      this.setState({
        errorPayment: true,
        message: "buy.form.errors.requiredField",
      });
      this.blankErrors("errorPayment");
      return false;
    } else if (
      this.state.isCreatedClientPayment &&
      this.state.dollarBTCPaymentTypeSeleced === null
    ) {
      this.setState({
        errorPaymentType: true,
        message: "buy.form.errors.requiredField",
      });
      this.blankErrors("errorPaymentType");
      return false;
    } else if (this.state.hasBankCredentials) {
      let number = Number(this.state.availableBalanceCurrency);
      if (number < this.state.minAmountNumber) {
        this.setState({
          errorBalanceExteral: true,
          message: "buy.form.errors.notBalanceExternal",
        });
        setTimeout(() => {
          this.setState({
            errorBalanceExteral: false,
            message: "",
          });
        }, 5000);
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  getCharges() {
    let bodyCharges = {
      currency: this.state.currencyLabelSelected,
      amount: parseFloat(this.state.amountFiat),
      btcPrice: this.state.priceForCalculator,
      operationType: "BUY",
      paymentType: this.state.dollarBTCPaymentSelected.type,
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
                "buy.modalConfirm.charges.COMMISSION"
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
      .catch((error) => {console.log(error)});
    }else{
      console.log("error del amount")
    }
  }
  handleSubmitBuyBitcoins(event, data) {
    if (this.state.termsAndConditionsAccepted === false) {
      //////////console.log('1er error');
      this.setState({
        viewMessageTerm: true,
        message: "buy.form.errors.acceptTerms",
      });
      setTimeout(() => {
        this.setState({
          viewMessageTerm: false,
          message: "",
        });
      }, 7000);
    } else {
      if (this.validateBuy()) {
        event.preventDefault();
        let clientPaymentObject = this.state.clientPaymentSelected;
        // //////console.log("clientPaymentSelected:", clientPaymentObject)
        this.getCharges();
        // //////console.log("escogido payment:", this.state.dollarBTCPaymentSelected)
        let body = {
          userName: sessionStorage.getItem("username"),
          currency: this.state.currencyLabelSelected,
          message: this.state.commentInitial,
          amount: this.state.amountFiat,
          price: this.state.pricetosend,
          otcOperationType: "BUY",
          description: this.state.identifier,
          dollarBTCPayment: this.state.dollarBTCPaymentSelected,
          clientPayment: clientPaymentObject,
        };

        //////console.log("body antes del confirm:", body)

        if (
          this.state.BrokerUserName !== "" &&
          this.state.BrokerUserName !== undefined
        ) {
          body.brokerUserName = this.state.BrokerUserName;
        }
        this.setState(
          {
            bodyBuyBitCoins: body,
            openBuyConfirm: true,
          },
          () => {
            //  ////////console.log('bodyBuyBitCoins ', this.state.bodyBuyBitCoins);
          }
        );
      }
    }
  }
  getCoins() {
    let array = [];
    let url = market.getLocalbitcoinReducedTickers();
    /*Axios.get(
      "https://service8081.dollarbtc.com/website/getLocalbitcoinReducedTickers"
    )*/
    url.then((res) => {
      res.data.forEach(function (element) {
        let item = { currency: element.currency, priceUSD: element.usdPrice };
        array.push(item);
      });
    });
    this.setState({
      priceUSDByCurrency: array,
    });
  }
  componentDidMount() {
    let arr = [];
    Object.entries(term.ters).forEach(([key, value]) => {
      arr.push(key);
    });

    this.setState({ textTerm: arr });
    this.getCoins();
    if (typeof parse(window.location.search).id !== "undefined") {
      this.redirectToMyBuys();
      // var uri = window.location.toString();
      // if (uri.indexOf("?") > 0) {
      // 	var clean_uri = uri.substring(0, uri.indexOf("?"));
      // 	window.history.replaceState({}, document.title, clean_uri);
      // }
    } else {
      this._isMounted = true;
      this.getCurrencies();
    }
  }

  getValidateAmountOfOffer(
    totalAmount,
    accumulatedAmount,
    minPerOperationAmount,
    maxPerOperationAmount
  ) {
    let totalAmountLeft = totalAmount - accumulatedAmount;
    if (totalAmountLeft <= 0) {
      return false;
    } else {
      if (totalAmountLeft < minPerOperationAmount) {
        this.setState({
          minPerOperationAmount: totalAmountLeft,
        });
      } else {
        this.setState({
          minPerOperationAmount: minPerOperationAmount,
        });
      }
      if (totalAmountLeft < maxPerOperationAmount) {
        this.setState({
          maxPerOperationAmount: totalAmountLeft,
        });
      } else {
        this.setState({
          maxPerOperationAmount: maxPerOperationAmount,
        });
      }
      return true;
    }
  }
  getOffers = (currency, operation, type) => {
    this.setState({
      minAmount: 0,
      minAmountNumber: 0,
      maxAmount: 0,
      maxAmountNumber: 0,
      pricetosend: 0,
      priceForCalculator: 0,
      price: "",
      isCurrencySelected: false,
      loadingForm: true,
      hasOffersAsk: false,
    });
    let array = [];
    let may = 0;
    let maxOfert;
    this.setState({ listOfertsByCurrency: [] });
    //this.setState({ bestOfertByPayment: bestOfertsByType });

    let listBestOfertByTipe = [];
    let listPaymentsByBank = [];
    if (
      this.state.bankSelectedDollarBTC !== "" &&
      this.state.bankSelectedDollarBTC.includes("BANK")
    ) {
      // ////////console.log("auiii", this.state.allOfferts, this.state.bankSelectedDollarBTC, this.state.paymentsDollarBTC, this.state.bestOfertByPayment)
      let nameBank = this.state.bankSelectedDollarBTC.split("__")[2];
      listBestOfertByTipe = this.state.allOfferts.filter(function (element) {
        return element.id.includes(type);
      });
      listPaymentsByBank = this.state.paymentsDollarBTC.filter(function (
        element
      ) {
        return element.bank === nameBank && element.type === type;
      });
      for (let ofert of listBestOfertByTipe) {
        for (let payments of listPaymentsByBank) {
          if (ofert.id.includes(payments.id)) {
            if (ofert.value.price > may) {
              may = ofert.value.price;
              maxOfert = ofert.value;
            }
          }
        }
      }
    } else {
      maxOfert = this.state.bestOfertByPayment.find(function (element) {
        if (element.typeSet === type) {
          return element;
        }
      });
    }
    let paymentId;
    let idPayment, findPaymentBest;
    if (maxOfert !== undefined) {
      if (maxOfert.value !== undefined) {
        paymentId = maxOfert.value.paymentId;
      } else {
        paymentId = maxOfert.paymentId;
      }
      findPaymentBest = this.state.paymentsDollarBTC.find(function (element) {
        return element.id === paymentId;
      });
      if (findPaymentBest !== undefined) {
        idPayment = findPaymentBest.id;
      } else {
        idPayment = this.state.bankSelectedDollarBTC.split("__")[1];
        findPaymentBest = this.state.paymentsDollarBTC.find(function (element) {
          return element.id === paymentId;
        });
      }
    } else {
      idPayment = this.state.bankSelectedDollarBTC.split("__")[1];
      findPaymentBest = this.state.paymentsDollarBTC.find(function (element) {
        return element.id === paymentId;
      });
      // //////console.log("findPaymentBest:", findPaymentBest)
    }
    ////////console.log("findPaymentBest:", findPaymentBest)
    this.setState(
      {
        //dollarBTCPaymentSelected: findPaymentBest,
        hasOffersAsk: true,
      },
      () => {
        otcAPI
          .getOffersNewService(
            this.state.currencyLabelSelected,
            idPayment,
            "ASK",
            type
          )
          .then((resp) => {
            //  ////////console.log(resp.data);
            let keys = Object.keys(resp.data);

            this.setState({ loadingForm: false, offerMaxPrice: resp.data });
            Object.entries(resp.data).forEach(([key, val]) => {
              keys = Object.keys(val);
              if (keys.length > 0) {
                Object.entries(val).forEach(([inerKey, inerValue]) => {
                  array.push(inerValue);
                });

                let ofertSelect;
                let maxLimit = 0;
                for (let ofert of array) {
                  if (ofert.maxPerOperationAmount > maxLimit) {
                    ofertSelect = ofert;
                    maxLimit = ofert.maxPerOperationAmount;
                  }
                }
                let hasFunds = this.getValidateAmountOfOffer(
                  ofertSelect.totalAmount,
                  ofertSelect.accumulatedAmount,
                  ofertSelect.minPerOperationAmount,
                  ofertSelect.maxPerOperationAmount
                );
                if (hasFunds) {
                  this.setState({
                    minAmount: this.state.minPerOperationAmount.toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                      }
                    ),
                    minAmountNumber: this.state.minPerOperationAmount,
                  });
                  this.setState({
                    maxAmount: this.state.maxPerOperationAmount.toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                      }
                    ),
                    maxAmountNumber: this.state.maxPerOperationAmount,
                  });
                  //  ////////console.log("ENTRANDO POR EL METODO ELSE VIEWBROKEROFFER",ofertSelect.price);
                  this.setState({
                    accumulatedAmount: ofertSelect.accumulatedAmount,
                    totalAmount: ofertSelect.totalAmount,
                    pricetosend: ofertSelect.price,
                    priceForCalculator: ofertSelect.price,
                    price: ofertSelect.price.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    }),
                  });
                  this.setState({
                    amountBitcoins: "",
                    amountFiat: "",
                    bank: "",
                    holderId: "",
                    isCurrencySelected: true,
                    accountHolder: "",
                    accountNumber: "",
                    automatic: null,
                  });
                } else {
                  this.setState({
                    viewMessage: true,
                    hasOffersAsk: false,
                    message: "buy.form.errors.notAmount",
                    messageTerminsAndConditions: "",
                  });
                  setTimeout(() => {
                    this.setState({
                      viewMessage: false,
                      message: "",
                    });
                  }, 7000);
                }
              } else {
                this.setState({
                  viewMessage: true,
                  hasOffersAsk: false,
                  message: "buy.form.errors.notOffersForCurrencyAndBank",
                  messageTerminsAndConditions: "",
                });

                this.timer = setTimeout(() => {
                  this.setState({
                    viewMessage: false,
                    message: "",
                  });
                }, 3000);
              }
            });
          })
          .catch((error) => {
            // ////////console.log(error);
          });
      }
    );
    // //////console.log("8", this.state.dollarBTCPaymentSelected)
    //§©
  };
  getBestOfertByBankSelected(bank, type) {}
  onLoadPaymentsDollarBTC = (moneda) => {
    this.setState({ loadForm: true });
    otcAPI
      .getPayments(moneda, "dollarBTC")
      .then((res) => {
        ////console.log("onLoadPayments", res.data);
        this.setState({ loadForm: false });
        if (res.data.length > 0) {
          this.setState(
            {
              paymentsDollarBTC: res.data,
            },
            async () => {
              let map = new Map();
              let payments = this.state.paymentsDollarBTC.filter(
                (paymentFiltered) => {
                  return paymentFiltered.acceptIn && paymentFiltered.active;
                }
              );
              if (payments.length > 0) {
                await this.getOfferByCurrency(moneda, payments);
              } else {
                this.setState({
                  viewMessage: true,
                  message: "buy.form.errors.notOffersForCurrency",
                });
                this.timer = setTimeout(() => {
                  this.setState({ viewMessage: false, message: "" });
                }, 3000);
              }
            }
          );
        } else {
          if (
            this.state.currencyLabelSelected !== null &&
            this.state.currencyLabelSelected !== ""
          ) {
            this.setState({
              viewMessage: true,
              message: "buy.form.errors.notOffersForCurrency",
            });
            this.timer = setTimeout(() => {
              this.setState({ viewMessage: false, message: "" });
            }, 3000);
          }
        }
      })
      .catch((error) => {
        //////////console.log(error);
        this.setState({ loadForm: false });
      });
  };
  setBanksOptions() {
    ///   ////////console.log(this.state.paymentsDollarBTC);
    let payments = this.state.paymentsDollarBTC.filter((paymentFiltered) => {
      return paymentFiltered.acceptIn && paymentFiltered.active;
    });
    // ////////console.log(this.state.paymentsDollarBTC, payments);
    if (payments.length > 0) {
      let newPayments = this.definePayments(payments);
      let map = new Map();
      let array = [];
      let name = "";
      for (let pay of newPayments) {
        let find = array.find(function (element) {
          return element.text === pay.bank;
        });
        if (find === undefined) {
          name = pay.bank;
          let arr = newPayments.filter(function (element) {
            if (element.bank === name) {
              return element;
            }
          });
          if (pay.joinField !== undefined && pay.joinField === "bank") {
            array.push({
              text: name,
              value: "BANK__" + pay.id + "__" + name,
              key: name,
            });
          } else if (
            pay.walletAddress !== undefined ||
            pay.address !== undefined
          ) {
            array.push({
              text: pay.walletAddress,
              value: "CRYPTO__" + pay.walletAddress,
            });
          } else if (pay.joinField !== undefined) {
            array.push({
              text: name,
              value: "BANK__" + pay.id + "__" + name,
              key: name,
            });
          }
        }
      }
      //   ////////console.log(array,newPayments);
      this.setState(
        {
          selectPaymentsDollarBTCFormated: array,
          paymentFilteredByOferts: newPayments,
        },
        () => {
          //  ////////console.log(array)
          if (this.state.viewBrokerOffer === false) {
            let value = sessionStorage.getItem(
              "formBuyBitcoins.bankSelectedDollarBTC"
            );
            if (value !== null && value !== "null") {
              //   ////////console.log("entrando en el if")
              this.setState(
                {
                  bankSelectedDollarBTC: value,
                },
                () => {
                  this.handleChangePaymentDollarBTC(
                    this.state.bankSelectedDollarBTC,
                    ""
                  );
                }
              );
            } else if (array.length === 1) {
              if (this.state.viewBrokerOffer === true) {
                let paymentId = this.state.paymentIdBroker;
                let find = array.find(function (element) {
                  let split = element.value.split("__")[1];
                  if (split === paymentId) {
                    return element;
                  }
                });
                if (find !== undefined) {
                  this.setState(
                    {
                      bankSelectedDollarBTC: find.value,
                    },
                    () => {
                      this.handleChangePaymentDollarBTC(
                        this.state.bankSelectedDollarBTC
                      );
                    }
                  );
                } else {
                  this.setState(
                    {
                      bankSelectedDollarBTC: array[0].value,
                    },
                    () => {
                      this.handleChangePaymentDollarBTC(
                        this.state.bankSelectedDollarBTC
                      );
                    }
                  );
                }
              } else {
                this.setState({
                  bankSelectedDollarBTC: array[0].value,
                });
              }
            }
          }
        }
      );
    } else {
      this.setState({
        viewMessage: true,
        message: "buy.form.errors.notOffersForCurrency",
      });
      this.timer = setTimeout(() => {
        this.setState({ viewMessage: false, message: "" });
      }, 3000);
    }
  }
  definePayments(paymentsDBTC) {
    let payments = [];
    let typesOffers = [];
    for (let ofertType of this.state.allOfferts) {
      let type = ofertType.id.split("__")[2];
      let filterType = this.state.allOfferts.filter(function (element) {
        return element.id.includes(type);
      });
      let findByType = typesOffers.find(function (ele) {
        return ele.type === type;
      });
      if (findByType === undefined) {
        let item = {
          type: type,
          list: filterType,
        };
        typesOffers.push(item);
      }
    }
    //////////console.log(typesOffers);
    let bestOfertsByType = [];
    for (let bestOfert of typesOffers) {
      let max = 0;
      let bestOfertSelect;
      for (let offert of bestOfert.list) {
        // if (offert.value.price > max) {
        //   max = offert.value.price;

        // }
        bestOfertSelect = offert.value;
        //////////console.log(bestOfertSelect, bestOfert);
        let item = {
          typeSet: bestOfertSelect.paymentType,
          value: bestOfertSelect,
        };
        bestOfertsByType.push(item);
      }
    }
    for (let ofert of bestOfertsByType) {
      let tempPayment = paymentsDBTC.find(function (pay) {
        return pay.id === ofert.value.paymentId && pay.type === ofert.typeSet;
      });
      if (tempPayment !== undefined) {
        let tempPaymentIner = payments.find(function (pay) {
          return tempPayment.id === pay.id;
        });
        if (tempPaymentIner === undefined) {
          payments.push(tempPayment);
        }
      }
    }

    this.setState({ bestOfertByPayment: bestOfertsByType });
    //  ////////console.log(payments);
    return payments;
  }
  async getOfferByCurrency(currency, paymentsDBTC) {
    let payments = [];
    try {
      this.setState({ loadForm: true });
      let res = await otcAPI.getOffersByCurrencyAsync(currency);
      this.setState({ loadForm: false });
      let offers = [];
      let validate = Object.keys(res.data[currency]);
      if (validate.length > 0) {
        Object.entries(Object.values(res.data)[0]).filter(([key, value]) => {
          if (key.includes("ASK")) {
            let ob = {
              id: key,
              value: value,
            };
            offers.push(ob);
          }
        });

        // ////////console.log("load payments dollarBTC", offers);
        this.setState({ allOfferts: offers }, () => {
          this.setBanksOptions();
        });
        this.setAvailableCurrencyOfert(offers);
      } else {
        this.setState({
          viewMessage: true,
          message: "buy.form.errors.notOffersForCurrency",
        });
        this.timer = setTimeout(() => {
          this.setState({ viewMessage: false, message: "" });
        }, 3000);
      }
    } catch (error) {
      this.setState({ loadForm: false });
      return payments;
    }
  }
  setAvailableCurrencyOfert(oferts) {
    let array = [];
    for (let ofert of oferts) {
      if (
        ofert.id.includes("TRANSFER_WITH_SPECIFIC_BANK") ||
        ofert.id.includes("TRANSFER_NATIONAL_BANK") ||
        ofert.id.includes("TRANSFER_INTERNATIONAL_BANK") ||
        ofert.id.includes("WIRE_TRANSFER") ||
        ofert.id.includes("PERSONAL_CHECK_DEPOSIT") ||
        ofert.id.includes("CASHIER_CHECK_DEPOSIT") ||
        ofert.id.includes("MONEY_ORDER") ||
        ofert.id.includes("CASH_DEPOSIT")
      ) {
        let item = {
          text: this.state.mapPayments.get("ACCOUNT_BANK"),
          value: "ACCOUNT_BANK",
          disabled: false,
        };
        let findValue = array.find(function (element) {
          return element.value === "ACCOUNT_BANK";
        });
        if (findValue === undefined) {
          array.push(item);
        }
      } else {
        if (ofert.id.split("__")[2] !== "RETAIL") {
          let item = {
            text: this.state.mapPayments.get(ofert.id.split("__")[2]),
            value: ofert.id.split("__")[2],
            disabled: ofert.id.split("__")[2] !== "MAIN" ? false : true,
          };
          let findValue = array.find(function (element) {
            return element.value === ofert.id.split("__")[2];
          });
          if (findValue === undefined) {
            array.push(item);
          }
        }
      }
    }

    this.setState({ typePaymentsToSelected: array }, () => {
      let value = sessionStorage.getItem("typePaymentSelectedNew");
      if (value !== null && value !== "null" && value !== "") {
        ////////console.log("auiiii");
        this.setState({ typePaymentSelectedNew: value }, () =>
          this.setOptionsByTypePaymentMethodSelected(
            this.state.typePaymentSelectedNew,
            ""
          )
        );
      }
    });
  }
  blankErrors(label) {
    if (label === "errorMoneda") {
      setTimeout(() => {
        this.setState({ errorMoneda: false, message: "" });
      }, 2500);
    } else if (label === "errorAmountFiat") {
      setTimeout(() => {
        this.setState({ errorAmountFiat: false, message: "" });
      }, 5000);
    } else if (label === "errorPayment") {
      setTimeout(() => {
        this.setState({ errorPayment: false, message: "" });
      }, 5000);
    } else if (label === "errorPaymentType") {
      setTimeout(() => {
        this.setState({ errorPaymentType: false, message: "" });
      }, 5000);
    }
  }
  sendConfirm() {
    this.setState({
      amountChangedTo: 0,
      newLimits: "",
      errorServer: false,
    });
    otcAPI
      .createOperation(this.state.bodyBuyBitCoins)
      .then((res) => {
        let msg = "";
        let newLimits = "";
        this.clearDatasessionStorageFormBuy("currency");
        if (
          res.data === "THERE IS NO MATCH OFFER" ||
          res.data === "MASTER ACCOUNT OTC HAS NOT ENOUGH BALANCE" ||
          res.data === "THIS PAYMENT IS NOT AVAILABLE AT THIS MOMENT" ||
          res.data === "MASTER ACCOUNT HAS NOT ENOUGH BALANCE"
        ) {
          msg = "buy.form.errors.notProcessed";
        } else if (res.data.includes("AMOUNT IS NOT BETWEEN MIN AND MAX")) {
          msg = "buy.form.errors.amountBetween"; //+ res.data.toString().split("AMOUNT IS NOT BETWEEN MIN AND MAX")[1];
          newLimits =
            res.data.split("AMOUNT IS NOT BETWEEN MIN AND MAX")[1] +
            " " +
            this.state.currencyLabelSelected;
          // ////////console.log(newLimits);
          this.setState({ newLimits: newLimits });
        } else if (res.data === "USER HAS NOT ENOUGH BALANCE") {
          msg = "buy.form.errors.notBalance";
        } else if (
          res.data.includes("USER DAYLY LIMIT REACHED") ||
          res.data === "USER DAYLY LIMIT REACHED"
        ) {
          msg = "buy.form.errors.userdaylyLimit";
        } else if (
          res.data.includes("USER MONTHLY LIMIT REACHED") ||
          res.data === "USER MONTHLY LIMIT REACHED"
        ) {
          msg = "buy.form.errors.usermonthlyLimit";
        } else if (res.data.includes("PRICE CHANGE")) {
          this.setState(
            {
              amountChangedTo: parseFloat(res.data.split(":")[1]),
            },
            () => {
              this.state.bodyBuyBitCoins.price = this.state.amountChangedTo;
              this.setState(
                {
                  bodyBuyBitCoins: this.state.bodyBuyBitCoins,
                  priceForCalculator: this.state.amountChangedTo,
                  amountBitcoins: this.floorDecimals(
                    this.state.amountFiat / this.state.amountChangedTo,
                    8
                  ),
                },
                () => {
                  //////////console.log('bodyBuyBitCoins after change',this.state.bodyBuyBitCoins);
                }
              );
            }
          );
          msg = "buy.form.errors.changePrice";
        } else {
          msg = "buy.form.messages.successRequest";
        }
        this.setState({
          formLoad: false,
          messageOperation: msg,
          operationReady: true,
        });
      })
      .catch((error) => {
        // //////console.log('error create buy ', error);
        let e = error.toString();
        if (e.includes("Network")) {
          this.setState({
            formLoad: false,
            errorServer: true,
            messageOperation: "buy.form.errors.server",
            operationReady: true,
          });
          setTimeout(() => {
            this.setState({
              errorServer: false,
              messageOperation: "",
            });
          }, 5000);
        } else {
          this.setState({
            formLoad: false,
            errorServer: true,
            messageOperation: "buy.form.errors.server",
            operationReady: true,
          });
          setTimeout(() => {
            this.setState({
              errorServer: false,
              messageOperation: "",
            });
          }, 5000);
        }
      });
  }
  handleToUpdateFromFormBuyBTC() {
    var num = Math.floor(Math.random() * 100);
    this.props.handleToUpdate(num);
  }
  aceptSendConfirm() {
    this.setState({ formLoad: true });
    this.sendConfirm();
  }
  closeSendConfirm() {
    this.setState({
      openBuyConfirm: false,
    });
  }
  closeModalCreatePayment() {
    this.setState({
      showModalCreatePayment: false,
    });
  }
  redirectToMyBuys() {
    this.setState({
      openBuyConfirm: false,
    });
    sessionStorage.setItem("tokenUrl", null);
    this.props.handleItemClick();
  }
  rejectOffer() {
    this.setState({ viewBrokerOffer: false, blockField: false });
    window.sessionStorage.setItem("tokenUrl", "");
    window.location.href = "/buy";
  }
  readUrlWhitParams() {
    let query = parse(window.location.search);
    let keys = Object.keys(query);
    let token = sessionStorage.getItem("tokenUrl");
    ////////console.log(token);
    if (keys.length > 0) {
      let tokenUrl = "";
      let typeOffer = "";
      let t = "";
      if (query.offerKey !== undefined) {
        tokenUrl = query.offerKey;
        typeOffer = "offerKey";

        t = "/?" + typeOffer + "=" + tokenUrl;
        sessionStorage.setItem("tokenUrl", typeOffer + "_" + tokenUrl);
      } else if (query.brokerOfferKey !== undefined) {
        tokenUrl = query.brokerOfferKey;
        typeOffer = "brokerOfferKey";
        sessionStorage.setItem("tokenUrl", typeOffer + "_" + tokenUrl);
        t = "/?" + typeOffer + "=" + tokenUrl;
      }
      if (tokenUrl !== undefined && tokenUrl !== " " && tokenUrl !== null) {
        this.setState({
          urltoken: t,
          loadForm: true,
        });
        if (typeOffer === "brokerOfferKey") {
          this.getBrokerOffer(tokenUrl);
        } else {
          this.getOfferByUrl(tokenUrl);
        }
      }
    }
  }
  getBrokerOffer(token) {
    brokers
      .getOfferByUrl(token)
      .then((res) => {
        //////////console.log("username broker", res.data)

        if (res.data.offerType === "ASK") {
          let currency = res.data.currency;
          let paymentType = res.data.paymentType;
          let BrokerUserName = res.data.userName;
          let maxPerOperAmount = res.data.maxPerOperationAmount;
          let minPerOperAmount = res.data.minPerOperationAmount;
          let totalamount = res.data.totalAmount;
          let price = res.data.price;
          let paymentId = res.data.paymentId;
          this.getForexRate(currency);
          // this.getClientPaymentType(currency)

          otcAPI
            .getClientPaymentTypeForCurrency(currency)
            .then((respa) => {
              // let paymentId = res.data.paymentId
              this.setState(
                {
                  clientTypePayments: respa.data,
                },
                () => {
                  otcAPI
                    .getPayments(currency, "dollarBTC")
                    .then((resp) => {
                      if (resp.data.length > 0) {
                        this.setState(
                          {
                            paymentsDollarBTC: resp.data,
                          },
                          async () => {
                            let map = new Map();
                            let payments = this.state.paymentsDollarBTC.filter(
                              (paymentFiltered) => {
                                return (
                                  paymentFiltered.acceptIn &&
                                  paymentFiltered.active
                                );
                              }
                            );
                            await this.getOfferByCurrency(currency, payments);
                            if (
                              paymentType === "TRANSFER_WITH_SPECIFIC_BANK" ||
                              paymentType === "TRANSFER_NATIONAL_BANK" ||
                              paymentType === "TRANSFER_INTERNATIONAL_BANK" ||
                              paymentType === "WIRE_TRANSFER" ||
                              paymentType === "CASH_DEPOSIT"
                            ) {
                              this.setState(
                                { typePaymentSelectedNew: "ACCOUNT_BANK" }
                                // this.setBanksOptions()
                              );
                            } else {
                              if (paymentType === "CREDIT_CARD") {
                                this.setState({
                                  typePaymentSelectedNew: "CREDIT_CARD",
                                });
                              } else if (paymentType === "MAIN") {
                                this.setState({
                                  typePaymentSelectedNew: "MAIN",
                                });
                              }
                            }
                            this.setState({ loadForm: false });
                            this.setState(
                              {
                                currencyLabelSelected: currency,
                                dollarBTCPaymentTypeElectronicSelected: paymentType,

                                minAmount: minPerOperAmount,
                                maxAmount: maxPerOperAmount,
                                maxAmountNumber: maxPerOperAmount,
                                minAmountNumber: minPerOperAmount,
                                priceForCalculator: price,
                                blockField: true,
                                // priceUSD: price,
                                BrokerUserName: BrokerUserName,
                                viewBrokerOffer: true,
                                paymentIdBroker: paymentId,
                                pricetosend: price,
                                hasOffersAsk: true,
                                isCurrencySelected: true,
                              },
                              () => {
                                let findPayment = this.state.paymentsDollarBTC.find(
                                  function (element) {
                                    return element.id === paymentId;
                                  }
                                );
                                let itemvalue;
                                if (
                                  findPayment.joinField === "bank" &&
                                  findPayment.bank !== undefined
                                ) {
                                  itemvalue = "BANK__" + findPayment.bank;
                                }
                                ////////console.log("findPayment:", findPayment)
                                this.setState({
                                  dollarBTCPaymentSelected: findPayment,
                                });
                                ////////console.log("dollarBTCPaymentSelected:", this.state.dollarBTCPaymentSelected)
                                this.formatedByOfertUrl(
                                  findPayment,
                                  paymentType
                                );
                              }
                            );
                          }
                        );
                      }
                    })
                    .catch((error) => {
                      this.setState({ loadForm: false });
                      //////////console.log(error);
                    });
                }
              );
            })
            .catch((error) => {
              this.setState({ loadForm: false });
            });
        }
      })
      .catch((error) => {
        this.setState({ loadForm: false });
        //////////console.log(error);
      });
  }
  getOfferByUrl(token) {
    otcAPI
      .getOfferByUrl(token)
      .then((res) => {
        //   ////////console.log("username ", res.data)

        if (res.data.offerType === "ASK") {
          let currency = res.data.currency;
          let paymentType = res.data.paymentType;
          let maxPerOperAmount = res.data.maxPerOperationAmount;
          let minPerOperAmount = res.data.minPerOperationAmount;
          let totalamount = res.data.totalAmount;
          let price = res.data.price;
          let paymentId = res.data.paymentId;
          this.getForexRate(currency);
          // this.getClientPaymentType(currency)

          otcAPI
            .getClientPaymentTypeForCurrency(currency)
            .then((respa) => {
              // let paymentId = res.data.paymentId
              this.setState(
                {
                  clientTypePayments: respa.data,
                },
                () => {
                  otcAPI
                    .getPayments(currency, "dollarBTC")
                    .then((resp) => {
                      if (resp.data.length > 0) {
                        this.setState(
                          {
                            paymentsDollarBTC: resp.data,
                          },
                          async () => {
                            let map = new Map();
                            let payments = this.state.paymentsDollarBTC.filter(
                              (paymentFiltered) => {
                                return (
                                  paymentFiltered.acceptIn &&
                                  paymentFiltered.active
                                );
                              }
                            );
                            await this.getOfferByCurrency(currency, payments);
                            let array = [];
                            let url = market.getLocalbitcoinReducedTickers();

                            url.then((res) => {
                              let find = res.data.find(function (element) {
                                return element.currency === currency;
                              });
                              if (find !== undefined) {
                                this.setState({ priceUSD: find.usdPrice });
                              }
                            });
                            if (
                              paymentType === "TRANSFER_WITH_SPECIFIC_BANK" ||
                              paymentType === "TRANSFER_NATIONAL_BANK" ||
                              paymentType === "TRANSFER_INTERNATIONAL_BANK" ||
                              paymentType === "WIRE_TRANSFER" ||
                              paymentType === "CASH_DEPOSIT"
                            ) {
                              this.setState(
                                { typePaymentSelectedNew: "ACCOUNT_BANK" }
                                //  this.setBanksOptions()
                              );
                            } else {
                              if (paymentType === "CREDIT_CARD") {
                                this.setState({
                                  typePaymentSelectedNew: "CREDIT_CARD",
                                });
                              } else if (paymentType === "MAIN") {
                                this.setState({
                                  typePaymentSelectedNew: "MAIN",
                                });
                              }
                            }
                            this.setState({ loadForm: false });
                            this.setState(
                              {
                                currencyLabelSelected: currency,
                                dollarBTCPaymentTypeElectronicSelected: paymentType,

                                minAmount: minPerOperAmount,
                                maxAmount: maxPerOperAmount,
                                maxAmountNumber: maxPerOperAmount,
                                minAmountNumber: minPerOperAmount,
                                priceForCalculator: price,
                                blockField: true,
                                // priceUSD: price,
                                viewBrokerOffer: true,
                                paymentIdBroker: paymentId,
                                pricetosend: price,
                                hasOffersAsk: true,
                                isCurrencySelected: true,
                              },
                              () => {
                                let findPayment = this.state.paymentsDollarBTC.find(
                                  function (element) {
                                    return element.id === paymentId;
                                  }
                                );
                                let itemvalue;
                                if (findPayment.bank !== undefined) {
                                  itemvalue = "BANK__" + findPayment.bank;
                                }
                                this.setState({
                                  dollarBTCPaymentSelected: findPayment,
                                });
                                //////console.log("dollarBTCPaymentSelected:", this.state.dollarBTCPaymentSelected)
                                this.formatedByOfertUrl(
                                  findPayment,
                                  paymentType
                                );
                              }
                            );
                          }
                        );
                      }
                    })
                    .catch((error) => {
                      this.setState({ loadForm: false });
                      //////////console.log(error);
                    });
                }
              );
            })
            .catch((error) => {
              this.setState({ loadForm: false });
            });
        }
      })
      .catch((error) => {
        this.setState({ loadForm: false });
        //////////console.log(error);
      });
  }
  handleClientPaymentSelected = (event, data) => {
    //////////console.log(data.value);
    let keys = Object.keys(data.value);
    if (keys.indexOf("bank") !== -1) {
      let value = data.value.bank;
      for (let paymentType of this.state.clientTypePayments) {
        for (let field of paymentType.fields) {
          if (field.name === "bank") {
            if (field.values.indexOf(value) !== -1) {
              data.value.type = paymentType.name;
              data.value.messages = paymentType.messages;
              // //////////console.log(field.values);
              this.findBankAccountBalance(
                this.state.currencyLabelSelected,
                data.value.id,
                data.value.bank
              );
            }
          }
        }
      }
    }
    if (this.state.modalTern === true && data.value === "crear") {
      if (
        sessionStorage.getItem("previewModal") !== "true" &&
        this.state.showPreviewModal === false
      ) {
        this.setState(
          { showModalCreatePayment: true, showPreviewModal: true },
          () => {
            sessionStorage.setItem("previewModal", true);
          }
        );
      }
    }
    this.setState({
      isCreatedClientPayment: data.value === "crear",
      clientPaymentSelected: data.value,
    });
  };
  setPaymentUserFromDinamicForm(paymentUser) {
    let array = "";
    //////////console.log(paymentUser);
    Object.entries(paymentUser).forEach(([key, val]) => {
      if (
        key !== "id" &&
        key !== "messages" &&
        key !== "type" &&
        key !== "active" &&
        key !== "acceptIn" &&
        key !== "acceptOut" &&
        key !== "joinField" &&
        key !== "payWindow" &&
        key !== "automaticCharge" &&
        key !== "verified" &&
        key !== "automatic" &&
        key !== "accountBalance" &&
        key !== "accountCurrency" &&
        key !== "accountStatus"
      )
        array = array + " - " + val;
      if (key === "cardNumber") {
        let aux = "**** **** **** " + val.slice(-4);
        array = array.replace(val, aux);
      }
      if (key === "accountHolderName") {
        let accountHolderName = val;
        if (array.includes(accountHolderName)) {
          array = array.replace(accountHolderName + " -", "");
        }
      }
    });
    let item = {
      text: array.substring(3),
      value: paymentUser,
    };
    this.state.paymentsFromUserForSelect.push(item);
    this.setState(
      {
        paymentsFromUserForSelect: this.state.paymentsFromUserForSelect,
      },
      () => {
        this.setState({
          clientPaymentSelected: paymentUser,
        });
      }
    );
    this.findBankAccountBalance(
      paymentUser.currency,
      paymentUser.id,
      paymentUser.bank
    );
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  handleAmountBitcoins(e, data) {
    if (e.target.name === "fiat") {
      while (e.target.value.indexOf(",") !== -1) {
        e.target.value = e.target.value.replace(",", "");
      }
      let value = Number(e.target.value);
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
          message: "buy.form.errors.amountMaxLimit",
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
          message: "buy.form.errors.amountMaxLimit",
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

  handleAmountBitcoinsNoEvent() {
    if (this.state.amountFiat !== "") {
      let value = Number(this.state.amountFiat);

      if (
        value === this.state.maxAmountNumber ||
        value <= this.state.maxAmountNumber
      ) {
        this.setState({
          errorAmountFiat: false,
          message: "",
        });
        let calculate = this.floorDecimals(
          value / this.state.priceForCalculator,
          8
        );
        let toString = calculate.toString();
        //  ////////console.log(toString);
        if (toString.indexOf("e") === -1) {
          this.setState({ amountBitcoins: calculate });
          // ////////console.log(this.state.amountBitcoins);
        } else {
          this.setState({ amountBitcoins: 0.0 });
        }
      } else {
        this.setState({
          errorAmountFiat: true,
          message: "buy.form.errors.amountMaxLimit",
        });
        setTimeout(() => {
          this.setState({
            errorAmountFiat: false,
            message: "",
          });
        }, 8000);
      }
    }
  }
  cleanFields(opcion) {
    // ////////console.log("aquii tambien",opcion)
    // eslint-disable-next-line default-case
    switch (opcion) {
      case "currency":
        this.setState({
          selectPaymentsDollarBTCFormated: [],
          bankSelectedDollarBTC: "",
          dollarBTCTypePaymentsFormaterSelect: [],
          typePaymentsElectronics: [],
          dollarBTCPaymentTypeSeleced: null,
          paymentsFromUserForSelect: [],
          clientPaymentSelected: null,
          dollarBTCPaymentTypeElectronicSelected: null,
          dollarBTCPaymentSelected: "",
          minAmountNumber:
            this.state.viewBrokerOffer === true
              ? this.state.minAmountNumber
              : 0,
          priceForCalculator:
            this.state.viewBrokerOffer === true
              ? this.state.priceForCalculator
              : 0,
          messageTerminsAndConditions: [],
          isElectronicTrans: false,
          typePaymentsSelect: [],
          amountFiat: "",
          amountBitcoins: "",
          isCreatedClientPayment: false,
          typeCheckSelected: "",
          isCheckDeposit: false,
        });
        //  this.clearDatasessionStorageFormBuy("currency")
        break;
      case "paymentsDollarBTC":
        this.setState({
          bankSelectedDollarBTC:
            this.state.viewBrokerOffer === true
              ? this.state.bankSelectedDollarBTC
              : "",
          dollarBTCPaymentTypeElectronicSelected:
            this.state.viewBrokerOffer === true
              ? this.state.dollarBTCPaymentTypeElectronicSelected
              : null,
          dollarBTCPaymentSelected:
            this.state.viewBrokerOffer === true
              ? this.state.dollarBTCPaymentSelected
              : "",
          priceForCalculator:
            this.state.viewBrokerOffer === true
              ? this.state.priceForCalculator
              : 0,
          minAmountNumber:
            this.state.viewBrokerOffer === true
              ? this.state.minAmountNumber
              : 0,
        });
        //this.clearDatasessionStorageFormBuy("paymentType")
        break;
      case "typePaymentsDollarBTC":
        this.setState({
          paymentsFromUserForSelect: [],
          messageTerminsAndConditions: [],
          clientPaymentSelected: null,
          dollarBTCPaymentSelected: "",
          minAmountNumber:
            this.state.viewBrokerOffer === true
              ? this.state.minAmountNumber
              : 0,
          dollarBTCPaymentTypeElectronicSelected: null,
          priceForCalculator:
            this.state.viewBrokerOffer === true
              ? this.state.priceForCalculator
              : 0,
          isElectronicTrans: false,
          isCreatedClientPayment: false,
        });
        // this.clearDatasessionStorageFormBuy("paymentType")

        break;
    }
  }
  handleOnChangeDollarBTCTypePaymentElectronic(event, data) {
    //ultimo combo  onchange
    this.handleDollarBTCTypePaymentElectronic(data.value);
  }
  handleDollarBTCTypePaymentElectronic(value) {
    // ////////console.log(value);
    this.setState(
      {
        dollarBTCPaymentTypeElectronicSelected: value,
        dollarBTCPaymentTypeSeleced: "ELECTRONIC_TRANSFER",
        isCreatedClientPayment: false,
        isCheckDeposit: false,
      },
      () => {
        this.saveInsessionStorage(
          "dollarBTCTypePaymentTransferSelected",
          value
        );
        this.handleBankAccountBalance();
        //  ////////console.log(
        //  " en el callback dollarBTCPaymentTypeSeleced",
        //  this.state.dollarBTCPaymentTypeSeleced
        // );
      }
    );
    this.loadOfferPaymentClientAndMessages(value);
    //}
    // ////////console.log(" dollarBTCPaymentTypeElectronicSelected", this.state.dollarBTCPaymentTypeElectronicSelected)
  }
  loadFieldToCheckDeposit() {
    let ofertsBySelect = [];
    let bank = this.state.bankSelectedDollarBTC.split("__")[2];
    let typesCheckAvailables = [
      "PERSONAL_CHECK_DEPOSIT",
      "CASHIER_CHECK_DEPOSIT",
      "MONEY_ORDER",
    ];
    for (let type of typesCheckAvailables) {
      let findPayment = this.state.paymentsDollarBTC.filter(function (ele) {
        return ele.bank === bank && ele.type === type;
      });
      for (let payment of findPayment) {
        let findOfertAvailable = this.state.allOfferts.find(function (element) {
          return element.id.includes(type) && element.id.includes(payment.id);
        });
        if (findOfertAvailable !== undefined) {
          let objSet = {
            key: type,
            text: this.state.mapPayments.get(type),
            value: type,
          };
          ofertsBySelect.push(objSet);
        }
      }
    }
    if (ofertsBySelect.length > 0) {
      this.setState({ optionCheckDeposit: ofertsBySelect });
    } else {
      this.setState({
        viewMessage: true,
        message: "buy.form.errors.notOffersForCurrencyAndBank",
        messageTerminsAndConditions: "",
      });

      this.timer = setTimeout(() => {
        this.setState({ viewMessage: false, message: "" });
      }, 3000);
    }
  }
  handleOnchangeDollarBTCTypePayments(paymentType, source) {
    if (source === undefined) {
      this.cleanFields("typePaymentsDollarBTC");
    }

    if (this.state.modalTern !== true) {
      if (
        sessionStorage.getItem("previewModal") !== "true" &&
        this.state.showPreviewModal === false
      ) {
        this.setState(
          { showModalCreatePayment: true, showPreviewModal: true },
          () => {
            sessionStorage.setItem("previewModal", true);
          }
        );
      }
    }

    if (paymentType !== "ELECTRONIC_TRANSFER") {
      if (paymentType !== "CHECK_DEPOSIT") {
        sessionStorage.setItem(
          "formBuyBitcoins.dollarBTCTypePaymentTransferSelected",
          null
        );
        this.setState({
          isElectronicTrans: false,
        });

        this.loadOfferPaymentClientAndMessages(paymentType);
      } else {
        this.setState({ isCheckDeposit: true, optionCheckDeposit: [] }, () =>
          this.loadFieldToCheckDeposit()
        );
      }
    } else {
      this.setState(
        {
          isElectronicTrans: true,
        },
        () => {
          if (this.state.viewBrokerOffer === false) {
            this.saveInsessionStorage(
              "dollarBTCTypePaymentSelected",
              this.state.dollarBTCPaymentTypeSeleced
            );
          }
        }
      );
    }

    this.setState(
      {
        dollarBTCPaymentTypeSeleced: paymentType,
      },
      () => {
        if (this.state.viewBrokerOffer === false) {
          this.saveInsessionStorage(
            "dollarBTCTypePaymentSelected",
            this.state.dollarBTCPaymentTypeSeleced
          );
        }
      }
    );
  }
  loadOfferPaymentClientAndMessages(paymentType) {
    let arrayClientTypePayments = this.state.clientTypePayments.filter(
      (item) => {
        return item.name === paymentType;
      }
    );

    if (arrayClientTypePayments.length > 0) {
      this.setState(
        {
          dollarBTCPaymentTypeElectronicSelected: paymentType,
          clientPaymentTypeSelected: arrayClientTypePayments[0], //Obtengo la configuración base del payment type del cliente.
        },
        () => {
          let dollarBTCPaymentSelectAleatory = this.getPaymentDollarBTC(
            paymentType
          );
          // //////console.log("dollarBTCPaymentSelectAleatory:", dollarBTCPaymentSelectAleatory)
          this.setState({
            listItemModal: [],
          });
          if (dollarBTCPaymentSelectAleatory.length > 0) {
            if (paymentType !== "CREDIT_CARD") {
              this.loadItemShowModal(dollarBTCPaymentSelectAleatory[0]);
              if (dollarBTCPaymentSelectAleatory[0].payWindow !== undefined) {
                this.setState({
                  payWindow: dollarBTCPaymentSelectAleatory[0].payWindow,
                });
                // //////console.log(3)
                ////////console.log("payWindow:", this.state.payWindow)
              }
            }
            this.loadTerminsAnsConditions(
              this.state.clientPaymentTypeSelected.messages,
              dollarBTCPaymentSelectAleatory[0].messages
            );
            this.setState(
              {
                acceptIn: dollarBTCPaymentSelectAleatory[0].acceptIn,
                joinMyPayments:
                  dollarBTCPaymentSelectAleatory[0].joinMyPayments,
                joinFieldValue:
                  dollarBTCPaymentSelectAleatory[0].joinFieldValue,
                dollarBTCPaymentSelected: dollarBTCPaymentSelectAleatory[0],
              },
              () => {
                this.getOffers(
                  this.state.currencyLabelSelected,
                  "ASK",
                  paymentType
                );
                this.onLoadPaymentsClients(this.state.currencyLabelSelected);
              }
            );
            // //////console.log(4, dollarBTCPaymentSelectAleatory[0])
            // let v = dollarBTCPaymentSelectAleatory[0]
            // this.setState({
            //   dollarBTCPaymentSelected: v,
            // })
            //////console.log("paymentselected:", this.state.dollarBTCPaymentSelected)
          } else {
            this.setState({
              viewMessage: true,
              message: "buy.form.errors.notOffersForCurrencyAndBank",
              messageTerminsAndConditions: "",
            });

            this.timer = setTimeout(() => {
              this.setState({ viewMessage: false, message: "" });
            }, 3000);
          }
        }
      );
    }
  }
  getPaymentDollarBTC(paymentType) {
    let dollarBTCPaymentSelectAleatory;
    if (paymentType !== "TRANSFER_TO_CRYPTO_WALLET") {
      if (paymentType !== "CREDIT_CARD") {
        //Debo obtener el payment de dollarBTC que cumpla con todas las condiciones(acceptIn,active) y ademas que cumpla con las codiciones de los filtros seleccionados previamente(type y bank).
        dollarBTCPaymentSelectAleatory = this.state.paymentsDollarBTC.filter(
          (paymentFiltered) => {
            //////console.log(1)
            return (
              paymentFiltered.acceptIn &&
              paymentFiltered.active &&
              paymentFiltered.type === paymentType &&
              paymentFiltered.bank ===
                this.state.bankSelectedDollarBTC.split("__")[2]
            );
          }
        );
      } else {
        dollarBTCPaymentSelectAleatory = this.state.paymentsDollarBTC.filter(
          (paymentFiltered) => {
            //////console.log(2)
            return (
              paymentFiltered.acceptIn &&
              paymentFiltered.active &&
              paymentFiltered.type === paymentType
            );
          }
        );
      }
    } else {
      //////console.log(5)
      //Debo obtener el payment de dollarBTC que cumpla con todas las condiciones(acceptIn,active) y ademas que cumpla con las codiciones de los filtros seleccionados previamente(type y bank).
      dollarBTCPaymentSelectAleatory = this.state.paymentsDollarBTC.filter(
        (paymentFiltered) => {
          return (
            paymentFiltered.acceptIn &&
            paymentFiltered.active &&
            paymentFiltered.type === paymentType
          );
        }
      );
    }
    return dollarBTCPaymentSelectAleatory;
  }
  loadTerminsAnsConditions(messageOfClientPayments, messageOfDollarBtcPayment) {
    let mapAux = new Map();
    let arrayMessage = [];
    // this.setState({ allMessageTerminsAndConditions: [] });
    // ////////console.log(messageOfClientPayments,messageOfDollarBtcPayment);
    Object.entries(messageOfDollarBtcPayment).forEach(([key, val]) => {
      if (
        key.toString().includes("BUY") &&
        key.toString().includes("ALERT") &&
        !key.toString().includes("MC")
      ) {
        if (key.toString().includes("EN")) {
          let obj = {};
          let aplitKey = key.split("__")[1];
          obj.color = aplitKey.split("_")[1].toLowerCase();
          if (val !== "") {
            obj.message = val;
            obj.language = "en";
            arrayMessage.push(obj);
            mapAux.set(obj.color, obj.message);
          }
        } else if (key.toString().includes("ES")) {
          let obj = {};
          let aplitKey = key.split("__")[1];
          obj.color = aplitKey.split("_")[1].toLowerCase();
          if (val !== "") {
            obj.message = val;
            obj.language = "es";
            arrayMessage.push(obj);
            mapAux.set(obj.color, obj.message);
          }
        }
      }
    });
    Object.entries(messageOfClientPayments).forEach(([key, val]) => {
      if (key.toString().includes("BUY")) {
        let color;
        let aplitKey = key.split("__")[1];
        color = aplitKey.split("_")[1].toLowerCase();
        if (!mapAux.has(color)) {
          let obj = {};
          obj.color = color;
          obj.message = val;
          arrayMessage.push(obj);
        }
      }
    });

    this.setState(
      {
        messageTerminsAndConditions: [],
        allMessageTerminsAndConditions: arrayMessage,
      },
      () => {
        for (let val of arrayMessage) {
          let color = val.color;
          let message = "";
          if (this.props.language === val.language) {
            message = val.message;
            if (color !== "blue") {
              this.state.messageTerminsAndConditions.push(
                <Message
                  color={color}
                  content={() => {
                    if (
                      message.startsWith(
                        "Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.ethAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Nota: Sus bitcoins estarán diferidos hasta que su depósito esté acreditado y sea verificado"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.blueAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Atención: La transferencia sólo podrá realizarla desde su cuenta bancaria verificada y"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.redAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Up to a maximum of $ 2,000 is allowed"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.errors.comercialLimit"
                      );
                    } else if (
                      message.startsWith(
                        "Please note that for your first trade with us, we require that you initiate the wire in person at your bank"
                      )
                    ) {
                      return this.state.translator("buy.form.errors.firstBuy");
                      //Tenga en cuenta que para su primera operación con nosotros, le solicitamos que inicie la transferencia en persona en su banco.
                    } else return message;
                  }}
                  class="padding-top-message"
                />
              );
            } else {
              this.state.messageTerminsAndConditions.push(
                <Message
                  info
                  content={() => {
                    if (
                      message.startsWith(
                        "Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.ethAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Nota: Sus bitcoins estarán diferidos hasta que su depósito esté acreditado y sea verificado"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.blueAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Atención: La transferencia sólo podrá realizarla desde su cuenta bancaria verificada y"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.messages.redAlert"
                      );
                    } else if (
                      message.startsWith(
                        "Un monto maximo de $ 2,000 es permitido"
                      )
                    ) {
                      return this.state.translator(
                        "buy.form.errors.comercialLimit"
                      );
                    } else if (
                      message.startsWith(
                        "Tenga en cuenta que para su primera operación con nosotros, le solicitamos que inicie la transferencia en persona en su banco."
                      )
                    ) {
                      return this.state.translator("buy.form.errors.firstBuy");
                    } else return message;
                  }}
                  class="padding-top-message"
                />
              );
            }
          }
        }
      }
    );
  }
  loadItemShowModal(object) {
    this.setState(
      {
        listItemModal: [],
      },
      () => {
        let array = [];

        Object.entries(object).forEach(([key, val]) => {
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
            key !== "description" &&
            key !== "value" &&
            key !== "text" &&
            key !== "sendToPayments" &&
            key !== "buyBalance"
          ) {
            array.push(<div>{val}</div>);
          }
        });
        this.setState({
          listItemModal: array,
        });
      }
    );
  }
  handleOnchangeDollarBTCTypePaymentsSelect = (event, data) => {
    //////console.log(6)
    this.clearDatasessionStorageFormBuy("paymentType");
    this.setState({ isCheckDeposit: false, isElectronicTrans: false });
    this.handleOnchangeDollarBTCTypePayments(data.value);
  };
  getClientPaymentType(currency) {
    this.setState({ loadForm: true });
    otcAPI
      .getClientPaymentTypeForCurrency(currency)
      .then((res) => {
        ////console.log("getClientPaymentType por currency :", res.data);
        this.setState({ loadForm: false });
        this.setState({
          clientTypePayments: res.data,
        });
      })
      .catch((error) => {
        this.setState({ loadForm: false });
      });
    this.onLoadPaymentsDollarBTC(currency);
  }
  onLoadPaymentsClients = (moneda) => {
    otcAPI
      .getPayments(moneda, sessionStorage.getItem("username"))
      .then((res) => {
        //	////console.log("onLoadPaymentsClients por moneda y username:", res.data);
        this.setState({
          paymentsFromUserForSelect: [],
        });
        let item = {
          text: this.state.translator("buy.form.fields.createPaymentMethod"),
          value: "crear",
        };
        // this.state.paymentsFromUserForSelect.push(item);
        this.setState((state) => {
          const paymentsFromUserForSelect = state.paymentsFromUserForSelect.concat(
            item
          );
          return { paymentsFromUserForSelect };
        });
        let accountHolderName = "";
        for (let i = 0; i < res.data.length; i++) {
          let array = " ";
          //////////console.log(res.data[i]);
          if (
            typeof res.data[i].verified !== undefined &&
            res.data[i].verified &&
            (((this.state.dollarBTCPaymentTypeSeleced ===
              "TRANSFER_WITH_SPECIFIC_BANK" ||
              this.state.dollarBTCPaymentTypeElectronicSelected ===
                "TRANSFER_WITH_SPECIFIC_BANK") &&
              res.data[i].bank === this.state.dollarBTCPaymentSelected.bank &&
              res.data[i].type !== "CREDIT_CARD") ||
              ((this.state.dollarBTCPaymentTypeSeleced ===
                "TRANSFER_NATIONAL_BANK" ||
                this.state.dollarBTCPaymentTypeElectronicSelected ===
                  "TRANSFER_NATIONAL_BANK") &&
                res.data[i].type === "TRANSFER_NATIONAL_BANK") ||
              ((this.state.dollarBTCPaymentTypeSeleced === "CREDIT_CARD" ||
                this.state.dollarBTCPaymentTypeElectronicSelected ===
                  "CREDIT_CARD") &&
                res.data[i].type === "CREDIT_CARD"))
          ) {
            //////////console.log("con la vida podrida");
            Object.entries(res.data[i]).forEach(([key, val]) => {
              //////////console.log([key,val]);
              if (
                key !== "id" &&
                key !== "messages" &&
                key !== "type" &&
                key !== "active" &&
                key !== "acceptIn" &&
                key !== "acceptOut" &&
                key !== "joinField" &&
                key !== "payWindow" &&
                key !== "automaticCharge" &&
                key !== "verified" &&
                key !== "automatic" &&
                key !== "accountBalance" &&
                key !== "accountCurrency" &&
                key !== "accountStatus" &&
                key !== "forceVerification"
              )
                array = array + " - " + val;
              if (key === "accountHolderName") {
                accountHolderName = val;
                if (array.includes(accountHolderName)) {
                  array = array.replace(accountHolderName + " -", "");
                }
              }
              if (key === "cardNumber") {
                let aux = "**** **** **** " + val.slice(-4);
                array = array.replace(val, aux);
              }
            });
            item = {
              text: array.substring(3),
              value: res.data[i],
            };
            /*if(accountHolderName!=="")
              if(utils.isAccountOwnedUser(name, lastName, res.data[i].verified, accountHolderName)){
                this.state.paymentsFromUserForSelect.push(item);
              }
            else */
            this.state.paymentsFromUserForSelect.push(item);
          }
        }
        this.setState({
          paymentsFromUserForSelect: this.state.paymentsFromUserForSelect,
          loadingForm: false,
          allPaymentsUserByCurrency: res.data,
        });
      });
  };
  handleField(e, data) {
    let oj = {
      [data.name]: data.value,
    };

    this.setState({ paymentBody: [...this.state.paymentBody, oj] });
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
  aceptTerminsAnsConditions(e, data) {
    this.setState({
      termsAndConditionsAccepted: !this.state.termsAndConditionsAccepted,
      showModalTerminsAnsConditions: false,
    });
  }
  handleSpecial() {
    this.setState({ specialValue: !this.state.specialValue });
  }
  handleBankAccountBalance() {
    if (
      this.state.dollarBTCPaymentTypeSeleced === "ELECTRONIC_TRANSFER" &&
      (this.state.dollarBTCPaymentTypeElectronicSelected ===
        "TRANSFER_WITH_SPECIFIC_BANK" ||
        this.state.dollarBTCPaymentTypeElectronicSelected ===
          "TRANSFER_NATIONAL_BANK")
    ) {
      let bankSelected = this.state.paymentsFromUserForSelect.filter(
        (payment) =>
          payment.value.bank !== undefined &&
          payment.value.bank === this.state.bankSelectedDollarBTC.split("__")[2]
      );
      // //////////console.log(bankSelected);
      if (bankSelected !== undefined && bankSelected.length > 0) {
        if (
          bankSelected[0].value.bankLogin !== undefined &&
          bankSelected[0].value.bankPassword !== undefined
        ) {
          this.setState(
            {
              hasBankCredentials: true,
            },
            () => {
              this.findBankAccountBalance(
                this.state.currencyLabelSelected,
                bankSelected[0].id,
                bankSelected[0].bank
              );
            }
          );
        }
      }
    }
  }
  findBankAccountBalance(currency, idPayment, bank) {
    this.setState({
      loadForm: true,
    });
    paymentApi
      .getExternalPaymentMethod(currency, idPayment, bank)
      .then((res) => {
        // //////////console.log(res);
        let keys = Object.keys(res.data);
        if (keys.length > 0) {
          let number = Number(res.data.amount);
          if (number > 0) {
            this.setState({
              availableBalanceCurrency: res.data.amount,
              hasBankCredentials: true,
              isCreatedClientPayment: false,
              loadForm: false,
            });
          } else {
            this.setState({
              availableBalanceCurrency: "",
              hasBankCredentials: false,
              isCreatedClientPayment: false,
              loadForm: false,
            });
          }
        } else {
          this.setState({
            availableBalanceCurrency: "",
            hasBankCredentials: false,
            isCreatedClientPayment: false,
            loadForm: false,
          });
        }
        //set value
      })
      .catch((error) => {
        //////////console.log(error);
        this.setState({
          availableBalanceCurrency: "",
          hasBankCredentials: false,
          isCreatedClientPayment: false,
          loadForm: false,
        });
      });
  }
  gotoSignin() {
    if (
      this.state.viewBrokerOffer === true &&
      this.state.urltoken !== undefined
    ) {
      window.location.href = "/registration" + this.state.urltoken;
    } else {
      window.location.href = "/registration";
    }
  }

  gotoSigninToken() {
    let query = parse(window.location.search);
    if (query === "" || query === null || query === undefined) {
      // ////////console.log("no tiene nada la url", query);
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
  handleTypePaymentsToSelected(e, data) {
    this.setState({
      minAmount: 0,
      minAmountNumber: 0,
      maxAmount: 0,
      maxAmountNumber: 0,
      pricetosend: 0,
      priceForCalculator: 0,
      price: "",
      isCurrencySelected: false,
      hasOffersAsk: false,
      clientPaymentSelected: null,
      infoOfficess: [],
    });
    this.setState(
      {
        typePaymentSelectedNew: data.value,
        dollarBTCTypePaymentsFormaterSelect: [],
        isElectronicTrans: false,
        isCheckDeposit: false,
        messageTerminsAndConditions: [],
        dollarBTCPaymentTypeElectronicSelected: "",
        dollarBTCPaymentSelected: "",
        hasOffersAsk: false,
        joinMyPayments: false,
      },
      () =>
        this.setOptionsByTypePaymentMethodSelected(
          this.state.typePaymentSelectedNew,
          ""
        )
    );
  }
  setOptionsByTypePaymentMethodSelected(value, source) {
    if (source === "") {
    }
    // this.cleanFields("paymentsDollarBTC");
    //////////console.log("entroe Aquii")
    if (value === "ACCOUNT_BANK") {
      //this.setBanksOptions();
      sessionStorage.setItem("typePaymentSelectedNew", value);
    } else {
      if (value === "CREDIT_CARD") {
        sessionStorage.setItem("formBuyBitcoins.bankSelectedDollarBTC", null);
        this.clearDatasessionStorageFormBuy("bank");
        this.setState(
          { dollarBTCPaymentTypeSeleced: value, bankSelectedDollarBTC: "" },
          () => this.loadOfferPaymentClientAndMessages(value)
        );
      }
      sessionStorage.setItem("typePaymentSelectedNew", value);
    }
  }
  handleOnChangeTypeCheck(e, data) {
    this.setState({ typeCheckSelected: data.value }, () =>
      this.loadOfferPaymentClientAndMessages(data.value)
    );
  }
  render() {
    // ////////console.log(this.props.language)
    let t = this.state.translator;
    let labelAmountFiat,
      labelAmountCryptoError,
      labelMoneda,
      labelPayment,
      labelPaymentError,
      labePaymentTypeError,
      labelMessage,
      labelPaymentTypeElectronic;

    // let textTerm = this.state.textTerm.map((value, index) => (
    //   <p key={index}>{t("sell.mySells.terms." + value)}</p>
    // ));

    if (this.state.errorPayment) {
      labelPaymentError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorPaymentType) {
      labePaymentTypeError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorMoneda) {
      labelMoneda = (
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
      labelPayment = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }

    if (this.state.errorPaymentTypeElectronic) {
      labelPaymentTypeElectronic = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }

    if (this.state.errorAmountFiat) {
      labelAmountFiat = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorBalanceExteral) {
      labelAmountFiat = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.operationReady || this.state.errorServer) {
      let content;
      if (this.state.messageOperation.startsWith("buy.")) {
        if (this.state.newLimits !== "") {
          content = t(this.state.messageOperation) + this.state.newLimits;
        } else if (this.state.amountChangedTo !== 0) {
          content =
            t(this.state.messageOperation) +
            " a " +
            this.state.amountChangedTo.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            }) +
            " " +
            this.state.currencyLabelSelected +
            ", " +
            this.state.translator(
              "sell.mySells.modalSendSell.messages.confirmChange"
            );
        } else content = t(this.state.messageOperation);
      } else content = t(this.state.messageOperation);
      labelMessage = <Message info content={content} />;
      if (
        this.state.messageOperation === "buy.form.errors.userdaylyLimit" ||
        this.state.messageOperation === "buy.form.errors.usermonthlyLimit"
      ) {
        content = t(this.state.messageOperation);
        labelMessage = <Message error content={content} />;
      }
    }
    return (
      <div>
        <Responsive minWidth={992}>
          <Grid columns="equal">
            <Grid.Column largeScreen={16} mobile={16} tablet={16}>
              <Container>
                <Segment color="orange" loading={this.state.loadingForm}>
                  <Container className="container-form">
                    <Form
                      error={this.state.error !== ""}
                      success={this.state.success}
                      loading={this.state.loadForm}
                      unstackable
                    >
                      <Grid columns={2}>
                        <Grid.Column
                          largeScreen={8}
                          mobile={11}
                          tablet={10}
                          computer={12}
                        >
                          <Form.Field inline required>
                            <label>{t("buy.form.fields.currency")}</label>
                            <Select
                              placeholder={t(
                                "buy.form.fields.placeholderCurrency"
                              )}
                              fluid
                              single
                              disabled={this.state.blockField}
                              selection
                              options={this.state.currencies}
                              onChange={this.handleChangeCurrencySelect}
                              value={this.state.currencyLabelSelected}
                            />
                            {labelMoneda}
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
                              <Divider
                                hidden
                                style={{ marginBottom: "3.5px" }}
                              />
                              <Image
                                avatar
                                size="mini"
                                src={this.state.imgCurrencySelected}
                              />
                            </Form.Field>
                          )}
                        </Grid.Column>
                      </Grid>
                      {this.state.typePaymentsToSelected.length > 0 && (
                        <div>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <label>
                                  {t("buy.form.fields.paymentMethods")}
                                </label>
                                <Select
                                  placeholder={t(
                                    "buy.form.fields.placeholderPaymentMethods"
                                  )}
                                  fluid
                                  single
                                  disabled={this.state.blockField}
                                  selection
                                  options={this.state.typePaymentsToSelected}
                                  onChange={this.handleTypePaymentsToSelected.bind(
                                    this
                                  )}
                                  value={this.state.typePaymentSelectedNew}
                                  selectValue={
                                    this.state.typePaymentSelectedNew
                                  }
                                  defaultValue={
                                    this.state.typePaymentSelectedNew
                                  }
                                />
                                {labelPayment}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}
                      {this.state.selectPaymentsDollarBTCFormated.length > 0 &&
                        this.state.typePaymentSelectedNew !== "" &&
                        this.state.typePaymentSelectedNew ===
                          "ACCOUNT_BANK" && (
                          <div>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <label>{t("buy.form.fields.banks")}</label>
                                  <Select
                                    placeholder={t("buy.form.fields.banks")}
                                    fluid
                                    single
                                    selection
                                    disabled={this.state.blockField}
                                    options={
                                      this.state.selectPaymentsDollarBTCFormated
                                    }
                                    onChange={
                                      this.handleChangePaymentDollarBTCSelect
                                    }
                                    value={this.state.bankSelectedDollarBTC}
                                    selectValue={
                                      this.state.bankSelectedDollarBTC
                                    }
                                    defaultValue={
                                      this.state.bankSelectedDollarBTC
                                    }
                                  />
                                  {labelPayment}
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                            {this.state.infoOfficess.length > 0 && (
                              <Grid>
                                {this.state.infoOfficess.map((info, index) => (
                                  <Grid.Row columns={1} key={index}>
                                    <Grid.Column>
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
                          </div>
                        )}

                      {this.state.dollarBTCTypePaymentsFormaterSelect.length >
                        0 &&
                        this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                          <div>
                            <Grid.Column>
                              {/* <Divider hidden /> */}
                            </Grid.Column>
                            <Grid>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <label>
                                    {t("buy.form.fields.paymentsType")}
                                  </label>
                                  <Select
                                    placeholder={t(
                                      "buy.form.fields.placeholderSelect"
                                    )}
                                    fluid
                                    selection
                                    disabled={this.state.blockField}
                                    onChange={
                                      this
                                        .handleOnchangeDollarBTCTypePaymentsSelect
                                    }
                                    options={
                                      this.state
                                        .dollarBTCTypePaymentsFormaterSelect
                                    }
                                    value={
                                      this.state.dollarBTCPaymentTypeSeleced
                                    }
                                    selectValue={
                                      this.state.dollarBTCPaymentTypeSeleced
                                    }
                                    defaultValue={
                                      this.state.dollarBTCPaymentTypeSeleced
                                    }
                                  />
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}
                      {this.state.isElectronicTrans &&
                        this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                          <div>
                            {/* <Grid.Column>
                        {/* <Divider hidden />
                      </Grid.Column> */}
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <Form.Select
                                    label={t("buy.form.fields.typeElectro")}
                                    options={this.state.typePaymentsElectronics}
                                    value={
                                      this.state
                                        .dollarBTCPaymentTypeElectronicSelected
                                    }
                                    disabled={this.state.blockField}
                                    selectValue={
                                      this.state
                                        .dollarBTCPaymentTypeElectronicSelected
                                    }
                                    onChange={this.handleOnChangeDollarBTCTypePaymentElectronic.bind(
                                      this
                                    )}
                                    defaultValue={
                                      this.state
                                        .dollarBTCPaymentTypeElectronicSelected
                                    }
                                    placeholder={t(
                                      "buy.form.fields.placeholderType"
                                    )}
                                  />
                                  {/* <Divider
                            hidden
                          /> */}
                                  {labelPaymentTypeElectronic}
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}
                      {this.state.isCheckDeposit &&
                        this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                          <div>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <Form.Select
                                    label={t("buy.form.fields.typeCheck")}
                                    options={this.state.optionCheckDeposit}
                                    value={this.state.typeCheckSelected}
                                    selectValue={this.state.typeCheckSelected}
                                    onChange={this.handleOnChangeTypeCheck.bind(
                                      this
                                    )}
                                    placeholder={t("buy.form.fields.typeCheck")}
                                  />
                                  {/* <Divider
                            hidden
                          /> */}
                                  {labelPaymentTypeElectronic}
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}
                      <Grid.Column>
                        <Divider hidden />
                      </Grid.Column>
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
                      <Form.Field>
                        {this.state.messageTerminsAndConditions}
                      </Form.Field>

                      {this.state.dollarBTCPaymentTypeElectronicSelected !==
                        "" &&
                        this.state.dollarBTCPaymentTypeElectronicSelected !==
                          null &&
                        this.state.dollarBTCPaymentSelected !== "" &&
                        this.state.hasOffersAsk === true &&
                        this.state.joinMyPayments &&
                        sessionStorage.getItem("auth") === "true" && (
                          <div>
                            <Grid.Column>
                              <Divider hidden />
                            </Grid.Column>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <label>
                                    {t("buy.form.fields.ownPaymentMethods")}
                                  </label>
                                  <Select
                                    placeholder={t(
                                      "buy.form.fields.placeholderOwnPaymentMethods"
                                    )}
                                    options={
                                      this.state.paymentsFromUserForSelect
                                    }
                                    value={this.state.clientPaymentSelected}
                                    onChange={this.handleClientPaymentSelected.bind(
                                      this
                                    )}
                                  />

                                  {labelPaymentError}
                                  {/*
                            <Divider hidden section />
                            <Divider hidden section /> */}
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}

                      {this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected !== "crear" &&
                        this.state.priceForCalculator === 0 && (
                          <Message
                            color={"red"}
                            content={t("buy.form.errors.otOffers")}
                          />
                        )}
                      {this.state.isCreatedClientPayment && (
                        <div>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            ></Grid.Column>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              {this.state.isCreatedClientPayment && (
                                <DinamicForm
                                  currencyLabelSelected={
                                    this.state.currencyLabelSelected
                                  }
                                  field={
                                    this.state.clientPaymentTypeSelected !==
                                    null
                                      ? this.state.clientPaymentTypeSelected
                                          .fields
                                      : []
                                  }
                                  joinFieldValue={this.state.joinFieldValue}
                                  clientPaymentTypeSelected={
                                    this.state.clientPaymentTypeSelected
                                  }
                                  setClientPayment={this.setPaymentUserFromDinamicForm.bind(
                                    this
                                  )}
                                  dollarBTCPaymentSelected={
                                    this.state.dollarBTCPaymentSelected
                                  }
                                  setData={this.handleField.bind(this)}
                                  handleToUpdate={this.handleToUpdateFromFormBuyBTC.bind(
                                    this
                                  )}
                                  paymentBody={this.state.paymentBody}
                                  operation="buy"
                                  setSpecialValue={this.handleSpecial.bind(
                                    this
                                  )}
                                  typePaymentSeleted={
                                    this.state
                                      .dollarBTCPaymentTypeElectronicSelected
                                  }
                                  paymentsUser={
                                    this.state.allPaymentsUserByCurrency
                                  }
                                />
                              )}
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}
                      {((this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected !== "crear") ||
                        !this.state.joinMyPayments) &&
                        this.state.minAmountNumber > 0 && (
                          <div>
                            <Grid>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={10}
                              >
                                {this.state.isCurrencySelected !== "" && (
                                  <Form.Field>
                                    <span>
                                      <strong>
                                        {t("buy.form.fields.commercialLimits")}
                                      </strong>

                                      {this.state.isCurrencySelected
                                        ? " " + this.state.minAmount
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? " - "
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? " " + this.state.maxAmount
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? "  "
                                        : ""}
                                      {this.state.currencyLabelSelected}
                                    </span>
                                  </Form.Field>
                                )}
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}
                      {((this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected !== "crear") ||
                        !this.state.joinMyPayments) &&
                        this.state.minAmountNumber > 0 && (
                          <div>
                            <Grid columns={2}>
                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={10}
                              ></Grid.Column>
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
                                    readOnly={!this.state.isCurrencySelected}
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
                                  {labelAmountFiat}
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
                                    readOnly={!this.state.isCurrencySelected}
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
                                    {this.state.currencyLabelSelected !==
                                      "crypto" && (
                                      <span style={{ marginRight: "10px" }}>
                                        1 BTC ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.state.priceForCalculator.toLocaleString(
                                          "en-US",
                                          { maximumFractionDigits: 2 }
                                        )}
                                      </span>
                                    )}
                                    {this.state.typeCurrency === "crypto" && (
                                      <span style={{ marginRight: "10px" }}>
                                        1 BTC ={" "}
                                        {this.state.currencyLabelSelected}{" "}
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
                                    <br />
                                  </Form.Field>
                                  <Form.Field style={{ marginBottom: 0 }}>
                                    {this.state.currencyLabelSelected !== "" ||
                                      (this.state.priceUSD !== 0 && (
                                        <div class="letterSmall">
                                          <span style={{ marginRight: "10px" }}>
                                            {this.state
                                              .currencyLabelSelected !==
                                              "crypto" && (
                                              <label>
                                                1 USD ={" "}
                                                {
                                                  this.state
                                                    .currencyLabelSelected
                                                }{" "}
                                                {this.state.priceUSD.toLocaleString(
                                                  "en-US",
                                                  { maximumFractionDigits: 2 }
                                                )}{" "}
                                                {t(
                                                  "buy.form.fields.averagePriceReference"
                                                )}
                                              </label>
                                            )}
                                            {this.state
                                              .currencyLabelSelected ===
                                              "crypto" && (
                                              <label>
                                                1 USD ={" "}
                                                {
                                                  this.state
                                                    .currencyLabelSelected
                                                }{" "}
                                                {this.state.priceUSD.toLocaleString(
                                                  "en-US",
                                                  { maximumFractionDigits: 8 }
                                                )}{" "}
                                                {t(
                                                  "buy.form.fields.averagePriceReference"
                                                )}
                                              </label>
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                  </Form.Field>
                                  <Form.Field>
                                    {this.state.currencyLabelSelected !==
                                      "ETH" &&
                                      this.state.currencyLabelSelected !==
                                        "VES" &&
                                      this.state.rateForex !== null &&
                                      typeof this.state.rateForex !==
                                        undefined &&
                                      this.state.rateForex !== "" && (
                                        <div>
                                          1 USD ={" "}
                                          {this.state.currencyLabelSelected}{" "}
                                          {this.state.rateForex.toLocaleString(
                                            "en-US",
                                            { maximumFractionDigits: 2 }
                                          )}{" "}
                                          {t("buy.form.fields.forexRate")}
                                        </div>
                                      )}
                                  </Form.Field>
                                </div>
                              </Grid.Column>
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
                            </Grid>
                          </div>
                        )}

                      {this.state.dollarBTCPaymentSelected !== "" &&
                        this.state.hasOffersAsk === true &&
                        sessionStorage.getItem("auth") !== "true" && (
                          <Grid>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <div>
                                <Button
                                  floated={"right"}
                                  color="blue"
                                  size="large"
                                  onClick={() => this.gotoSignin()}
                                >
                                  {t("navPublic.account.options.signup")}
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        )}
                      {((this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected === "crear") ||
                        !this.state.joinMyPayments) &&
                        this.state.priceForCalculator > 0 &&
                        sessionStorage.getItem("auth") === "true" && (
                          <div>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              {/* <Form.Group inline >
                        <Form.Checkbox
                          onChange={this.aceptTerminsAnsConditions.bind(this)}
                          checked={this.state.termsAndConditionsAccepted}

                        />
                        <Form.Field required
                          onClick={this.openModalTerminsAnsConditions.bind(
                            this
                          )}>
                          {t("buy.form.fields.accept")}{" "}
                          <label>
                          <a
                            onClick={this.openModalTerminsAnsConditions.bind(this)}
                            className={"linkVerMas"}
                          >
                            {t("buy.form.fields.terms")}
                          </a>
                          </label>
                        </Form.Field>
                      </Form.Group> */}
                              {this.state.viewMessageTerm && (
                                <Message info>{t(this.state.message)}</Message>
                              )}
                            </Grid.Column>
                          </div>
                        )}

                      {/* viewBrokerOffer:false, ========================================================*/}
                      {((this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected === "crear") ||
                        !this.state.joinMyPayments) &&
                        this.state.priceForCalculator > 0 &&
                        sessionStorage.getItem("auth") === "true" && (
                          <div>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              {/* <Form.Group inline >
                        <Form.Checkbox
                          onChange={this.aceptTerminsAnsConditions.bind(this)}
                          checked={this.state.termsAndConditionsAccepted}

                        />
                        <Form.Field required
                          onClick={this.openModalTerminsAnsConditions.bind(
                            this
                          )}>
                          {t("buy.form.fields.accept")}{" "}
                          <label>
                          <a
                            onClick={this.openModalTerminsAnsConditions.bind(this)}
                            className={"linkVerMas"}
                          >
                            {t("buy.form.fields.terms")}
                          </a>
                          </label>
                        </Form.Field>
                      </Form.Group> */}
                              {this.state.viewMessageTerm && (
                                <Message info>{t(this.state.message)}</Message>
                              )}
                            </Grid.Column>
                          </div>
                        )}

                      {/* viewBrokerOffer:false, ========================================================*/}
                      {((this.state.clientPaymentSelected !== null &&
                        this.state.clientPaymentSelected !== "crear") ||
                        !this.state.joinMyPayments) &&
                        this.state.priceForCalculator > 0 &&
                        sessionStorage.getItem("auth") === "true" && (
                          <div>
                            <Grid.Column>{/* <Divider hidden/> */}</Grid.Column>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field>
                                  <label>
                                    {t("buy.form.fields.messageToTheModerator")}
                                  </label>
                                  <Form.TextArea
                                    value={this.state.commentInitial}
                                    onChange={this.handleComments}
                                  />
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                            <Grid.Column>
                              {/* <Divider hidden /> */}
                            </Grid.Column>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Field required>
                                  <input
                                    value={this.state.identifier}
                                    placeholder={t(
                                      "buy.form.fields.identifyBuy"
                                    )}
                                    onChange={this.handleIdentifier.bind(this)}
                                  />
                                </Form.Field>
                              </Grid.Column>
                            </Grid>
                            <Grid.Column>
                              <Divider hidden />
                            </Grid.Column>
                            <Grid columns={1}>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <Form.Group inline>
                                  <Form.Checkbox
                                    onChange={this.aceptTerminsAnsConditions.bind(
                                      this
                                    )}
                                    checked={
                                      this.state.termsAndConditionsAccepted
                                    }
                                  />
                                  <Form.Field
                                    required
                                    onClick={this.openModalTerminsAnsConditions.bind(
                                      this
                                    )}
                                  >
                                    {t("buy.form.fields.accept")}{" "}
                                    <label>
                                      <a
                                        onClick={this.openModalTerminsAnsConditions.bind(
                                          this
                                        )}
                                        className={"linkVerMas"}
                                      >
                                        {t("buy.form.fields.terms")}
                                      </a>
                                    </label>
                                  </Form.Field>
                                </Form.Group>
                                {this.state.viewMessageTerm && (
                                  <Message info>
                                    {t(this.state.message)}
                                  </Message>
                                )}
                              </Grid.Column>
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                                textAlign="left"
                              >
                                <div>
                                  <Button
                                    type="submit"
                                    color="blue"
                                    size="large"
                                    onClick={this.handleSubmitBuyBitcoins.bind(
                                      this
                                    )}
                                  >
                                    {t("buy.form.fields.buttonBuy")}
                                  </Button>
                                  {this.state.viewBrokerOffer === true && (
                                    <Button
                                      color="red"
                                      size="large"
                                      onClick={this.rejectOffer.bind(this)}
                                    >
                                      {t("buy.form.fields.reject")}
                                    </Button>
                                  )}
                                </div>
                              </Grid.Column>
                            </Grid>
                          </div>
                        )}
                    </Form>
                  </Container>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
          <Divider hidden section />
          <Modal
            open={this.state.openBuyConfirm}
            onClose={this.closeSendConfirm}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.modalConfirm.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Segment loading={this.state.formLoad}>
                  <div align="center">
                    <strong>
                      {t("buy.modalConfirm.request.part1")}{" "}
                      <NumberFormat
                        value={this.state.amountBitcoins}
                        displayType={"text"}
                        thousandSeparator={true}
                      />{" "}
                      {t("buy.modalConfirm.request.part2")}{" "}
                      <NumberFormat
                        value={this.state.amountFiat}
                        displayType={"text"}
                        thousandSeparator={true}
                      />{" "}
                      {this.state.currencyLabelSelected}
                    </strong>
                  </div>
                  <Divider />
                  <Grid>
                    <Grid.Row columns={2}>
                      <Grid.Column largeScreen={8} computer={8}>
                        <div>
                          {this.state.dollarBTCPaymentSelected !== "" && (
                            <label>
                              {this.state.mapPayments.has(
                                this.state.dollarBTCPaymentSelected.type
                              )
                                ? this.state.mapPayments.get(
                                    this.state.dollarBTCPaymentSelected.type
                                  )
                                : this.state.dollarBTCPaymentSelected.type}
                            </label>
                          )}
                        </div>
                        {this.state.listItemModal}
                      </Grid.Column>
                      <Grid.Column largeScreen={8} computer={8}>
                        {this.state.chargesByOperation.length !== 0 && (
                          <strong>
                            {t("buy.modalConfirm.charges.header")}
                          </strong>
                        )}
                        {this.state.chargesByOperation.length !== 0 &&
                          this.state.chargesByOperation.map((item, index) => (
                            <div>
                              <span>
                                {item.label}
                                {item.value}
                              </span>
                            </div>
                          ))}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Divider />
                  {this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                    <div>
                      <strong>
                        {t("buy.modalConfirm.payWindow.part1")}
                        {this.state.payWindow.split(" ")[0]}
                        {t("buy.modalConfirm.payWindow.part2")}
                      </strong>
                    </div>
                  )}

                  {labelMessage}
                </Segment>
                {this.state.infoOfficess.length > 0 && (
                  <Segment>
                    <Grid>
                      <Grid.Row
                        columns={
                          this.state.infoOfficess.length === 1
                            ? 1
                            : isMobile
                            ? 1
                            : 2
                        }
                      >
                        {this.state.infoOfficess.map((info, index) => (
                          <Grid.Column key={index}>
                            <Message
                              info
                              size={"small"}
                              style={{ textAlign: "left" }}
                            >
                              {info.value}
                            </Message>
                            <br></br>
                          </Grid.Column>
                        ))}
                      </Grid.Row>
                    </Grid>
                  </Segment>
                )}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div
                hidden={
                  this.state.operationReady &&
                  this.state.amountChangedTo === 0 &&
                  !this.state.errorServer
                }
              >
                <Button
                  color="grey"
                  onClick={this.closeSendConfirm}
                  disabled={this.state.formLoad}
                >
                  {t("buy.modalConfirm.buttonClose")}
                </Button>
                <Button
                  onClick={this.aceptSendConfirm}
                  disabled={this.state.formLoad}
                  color="blue"
                >
                  {t("buy.modalConfirm.buttonAccept")}
                </Button>
              </div>
              <div
                hidden={
                  !this.state.operationReady ||
                  this.state.amountChangedTo > 0 ||
                  this.state.errorServer
                }
              >
                <Button color="blue" onClick={this.redirectToMyBuys.bind(this)}>
                  {t("buy.modalConfirm.buttonClose")}
                </Button>
                <br />
              </div>
            </Modal.Actions>
          </Modal>
          <Modal
            open={this.state.showModalCreatePayment}
            onClose={this.closeModalCreatePayment.bind(this)}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.modalCreatePayment.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Message info>
                  <h3>{t("buy.modalCreatePayment.body.h3")}</h3>
                  <p>{t("buy.modalCreatePayment.body.p1")}</p>
                  <p>{t("buy.modalCreatePayment.body.p2")}</p>
                  <ul>
                    <li type="disc">
                      <strong>
                        {t(
                          "buy.modalCreatePayment.body.list.item1.recommended"
                        )}
                      </strong>
                      {t("buy.modalCreatePayment.body.list.item1.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item1.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item1.body.p2")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item1.body.p3")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item2.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p4")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item2.body.p5")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item3.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p4")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p5")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p6")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item3.body.p5")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item4.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p4")}
                      </li>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item5.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item5.body")}{" "}
                      </li>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item6.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item6.body")}
                      </li>
                    </ul>
                  </ul>
                </Message>
              </Modal.Description>
            </Modal.Content>
            {!isMobile && (
              <Modal.Actions>
                <div align="right">
                  <Button
                    onClick={this.closeModalCreatePayment.bind(this)}
                    color="blue"
                  >
                    {t("buy.modalCreatePayment.buttonAccept")}
                  </Button>
                </div>
              </Modal.Actions>
            )}
            {isMobile && (
              <Modal.Actions>
                <div align="center">
                  <Button
                    onClick={this.closeModalCreatePayment.bind(this)}
                    color="blue"
                    style={{
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px",
                    }}
                  >
                    {t("buy.modalCreatePayment.buttonAccept")}
                  </Button>
                </div>
              </Modal.Actions>
            )}
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
                  <p>{t("buy.modalTerms.buttonClose")}</p>
                </Button>
                {!this.state.termsAndConditionsAccepted && (
                  <Button
                    color="blue"
                    onClick={this.aceptTerminsAnsConditions.bind(this)}
                  >
                    <p>{t("buy.modalTerms.buttonAcceptTerms")}</p>
                  </Button>
                )}
              </div>
            </Modal.Actions>
          </Modal>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid columns="equal">
            <Grid.Column largeScreen={16} mobile={16} tablet={16}>
              <Container>
                <Container>
                  <Divider hidden></Divider>
                  {sessionStorage.getItem("auth") !== "true" && (
                    <div>
                      <Header
                        as="h4"
                        textAlign="center"
                        className="titleComponent"
                        style={{ fontWeight: "bold" }}
                      >
                        {t("buy.menu.buy")}
                      </Header>
                      <Divider
                        style={{ marginTop: -10, borderColor: "#207ef2" }}
                      />
                    </div>
                  )}
                </Container>
                <Container
                  className="container-form"
                  loading={this.state.loadingForm}
                >
                  <Form
                    error={this.state.error !== ""}
                    success={this.state.success}
                    loading={this.state.loadForm}
                    unstackable
                  >
                    <Grid columns={2}>
                      <Grid.Column
                        largeScreen={8}
                        mobile={11}
                        tablet={10}
                        computer={12}
                      >
                        <Form.Field inline required>
                          <label className="titleMobile">
                            {t("buy.form.fields.currency")}
                          </label>
                          <Select
                            placeholder={t(
                              "buy.form.fields.placeholderCurrency"
                            )}
                            fluid
                            single
                            selection
                            disabled={this.state.blockField}
                            options={this.state.currencies}
                            onChange={this.handleChangeCurrencySelect}
                            value={this.state.currencyLabelSelected}
                          />
                          {labelMoneda}
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
                            <Divider hidden style={{ marginBottom: "3.5px" }} />
                            <Image
                              avatar
                              size="mini"
                              src={this.state.imgCurrencySelected}
                            />
                          </Form.Field>
                        )}
                      </Grid.Column>
                    </Grid>
                    {this.state.typePaymentsToSelected.length > 0 && (
                      <div>
                        <Grid columns={1}>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            <Form.Field required>
                              <label className="titleMobile">
                                {t("buy.form.fields.paymentMethods")}
                              </label>
                              <Select
                                placeholder={t(
                                  "buy.form.fields.placeholderPaymentMethods"
                                )}
                                fluid
                                single
                                disabled={this.state.blockField}
                                selection
                                options={this.state.typePaymentsToSelected}
                                onChange={this.handleTypePaymentsToSelected.bind(
                                  this
                                )}
                                value={this.state.typePaymentSelectedNew}
                                selectValue={this.state.typePaymentSelectedNew}
                              />
                              {labelPayment}
                            </Form.Field>
                          </Grid.Column>
                        </Grid>
                      </div>
                    )}
                    {this.state.selectPaymentsDollarBTCFormated.length > 0 &&
                      this.state.typePaymentSelectedNew !== "" &&
                      this.state.typePaymentSelectedNew === "ACCOUNT_BANK" && (
                        <div>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <label className="titleMobile">
                                  {t("buy.form.fields.banks")}
                                </label>
                                <Select
                                  placeholder={t("buy.form.fields.banks")}
                                  fluid
                                  single
                                  selection
                                  disabled={this.state.blockField}
                                  options={
                                    this.state.selectPaymentsDollarBTCFormated
                                  }
                                  onChange={
                                    this.handleChangePaymentDollarBTCSelect
                                  }
                                  value={this.state.bankSelectedDollarBTC}
                                  selectValue={this.state.bankSelectedDollarBTC}
                                />
                                {labelPayment}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                          {this.state.infoOfficess.length > 0 && (
                            <Grid>
                              <Grid.Row columns={1}>
                                {this.state.infoOfficess.map((info, index) => (
                                  <Grid.Column key={index}>
                                    <Message
                                      info
                                      size={"small"}
                                      style={{ textAlign: "left" }}
                                    >
                                      {info.value}
                                    </Message>
                                    <br></br>
                                  </Grid.Column>
                                ))}
                              </Grid.Row>
                            </Grid>
                          )}
                        </div>
                      )}

                    {this.state.dollarBTCTypePaymentsFormaterSelect.length >
                      0 &&
                      this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                        <div>
                          <Grid.Column>{/* <Divider hidden /> */}</Grid.Column>
                          <Grid>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <label className="titleMobile">
                                  {t("buy.form.fields.paymentsType")}
                                </label>
                                <Select
                                  placeholder={t(
                                    "buy.form.fields.placeholderSelect"
                                  )}
                                  fluid
                                  selection
                                  disabled={this.state.blockField}
                                  onChange={
                                    this
                                      .handleOnchangeDollarBTCTypePaymentsSelect
                                  }
                                  options={
                                    this.state
                                      .dollarBTCTypePaymentsFormaterSelect
                                  }
                                  value={this.state.dollarBTCPaymentTypeSeleced}
                                  selectValue={
                                    this.state.dollarBTCPaymentTypeSeleced
                                  }
                                />
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}
                    {this.state.isElectronicTrans &&
                      this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                        <div>
                          {/* <Grid.Column>
                        {/* <Divider hidden />
                      </Grid.Column> */}
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <label className="titleMobile">
                                  {t("buy.form.fields.typeElectro")}
                                </label>
                                <Form.Select
                                  // label={t("buy.form.fields.typeElectro")}
                                  options={this.state.typePaymentsElectronics}
                                  value={
                                    this.state
                                      .dollarBTCPaymentTypeElectronicSelected
                                  }
                                  selectValue={
                                    this.state
                                      .dollarBTCPaymentTypeElectronicSelected
                                  }
                                  onChange={this.handleOnChangeDollarBTCTypePaymentElectronic.bind(
                                    this
                                  )}
                                  placeholder={t(
                                    "buy.form.fields.placeholderType"
                                  )}
                                  disabled={this.state.blockField}
                                />
                                {/* <Divider
                            hidden
                          /> */}
                                {labelPaymentTypeElectronic}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}
                    {this.state.isCheckDeposit &&
                      this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                        <div>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <Form.Select
                                  label={t("buy.form.fields.typeCheck")}
                                  options={this.state.optionCheckDeposit}
                                  value={this.state.typeCheckSelected}
                                  selectValue={this.state.typeCheckSelected}
                                  onChange={this.handleOnChangeTypeCheck.bind(
                                    this
                                  )}
                                  placeholder={t("buy.form.fields.typeCheck")}
                                />
                                {/* <Divider
                            hidden
                          /> */}
                                {labelPaymentTypeElectronic}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}
                    <Grid.Column>
                      <Divider hidden />
                    </Grid.Column>
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
                    <Form.Field>
                      {this.state.messageTerminsAndConditions}
                    </Form.Field>

                    {this.state.dollarBTCPaymentTypeElectronicSelected !== "" &&
                      this.state.dollarBTCPaymentTypeElectronicSelected !==
                        null &&
                      this.state.dollarBTCPaymentSelected !== "" &&
                      this.state.hasOffersAsk === true &&
                      this.state.joinMyPayments &&
                      sessionStorage.getItem("auth") === "true" && (
                        <div>
                          <Grid.Column>
                            <Divider hidden />
                          </Grid.Column>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <label className="titleMobile">
                                  {t("buy.form.fields.ownPaymentMethods")}
                                </label>
                                <Select
                                  placeholder={t(
                                    "buy.form.fields.placeholderOwnPaymentMethods"
                                  )}
                                  options={this.state.paymentsFromUserForSelect}
                                  value={this.state.clientPaymentSelected}
                                  onChange={this.handleClientPaymentSelected.bind(
                                    this
                                  )}
                                />

                                {labelPaymentError}
                                {/*
                            <Divider hidden section />
                            <Divider hidden section /> */}
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                        </div>
                      )}

                    {this.state.clientPaymentSelected !== null &&
                      this.state.clientPaymentSelected !== "crear" &&
                      this.state.priceForCalculator === 0 && (
                        <Message
                          color={"red"}
                          content={t("buy.form.errors.otOffers")}
                        />
                      )}
                    {this.state.isCreatedClientPayment && (
                      <div>
                        <Grid columns={1}>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          ></Grid.Column>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            {this.state.isCreatedClientPayment && (
                              <DinamicForm
                                currencyLabelSelected={
                                  this.state.currencyLabelSelected
                                }
                                field={
                                  this.state.clientPaymentTypeSelected !== null
                                    ? this.state.clientPaymentTypeSelected
                                        .fields
                                    : []
                                }
                                joinFieldValue={this.state.joinFieldValue}
                                clientPaymentTypeSelected={
                                  this.state.clientPaymentTypeSelected
                                }
                                setClientPayment={this.setPaymentUserFromDinamicForm.bind(
                                  this
                                )}
                                dollarBTCPaymentSelected={
                                  this.state.dollarBTCPaymentSelected
                                }
                                setData={this.handleField.bind(this)}
                                handleToUpdate={this.handleToUpdateFromFormBuyBTC.bind(
                                  this
                                )}
                                paymentBody={this.state.paymentBody}
                                operation="buy"
                                setSpecialValue={this.handleSpecial.bind(this)}
                                typePaymentSeleted={
                                  this.state
                                    .dollarBTCPaymentTypeElectronicSelected
                                }
                                paymentsUser={
                                  this.state.allPaymentsUserByCurrency
                                }
                              />
                            )}
                          </Grid.Column>
                        </Grid>
                      </div>
                    )}
                    {((this.state.clientPaymentSelected !== null &&
                      this.state.clientPaymentSelected !== "crear") ||
                      !this.state.joinMyPayments) &&
                      this.state.minAmountNumber > 0 && (
                        <div>
                          <Grid columns={2}>
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={16}
                              computer={10}
                            >
                              {this.state.isCurrencySelected !== "" && (
                                <Form.Field>
                                  <span>
                                    <strong
                                      style={{
                                        color: "#207ef2",
                                        fontSize: 12,
                                      }}
                                    >
                                      {t("buy.form.fields.commercialLimits")}{" "}
                                    </strong>

                                    <strong
                                      style={{
                                        color: "#207ef2",
                                        fontSize: 12,
                                      }}
                                    >
                                      {this.state.isCurrencySelected
                                        ? " " + this.state.minAmount
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? " - "
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? " " + this.state.maxAmount
                                        : ""}
                                      {this.state.isCurrencySelected
                                        ? "  "
                                        : ""}
                                      {this.state.currencyLabelSelected}
                                    </strong>
                                  </span>
                                </Form.Field>
                              )}
                            </Grid.Column>
                            {this.state.hasBankCredentials && (
                              <Grid.Column
                                largeScreen={8}
                                mobile={16}
                                tablet={16}
                                computer={6}
                              >
                                {this.state.hasBankCredentials && (
                                  <Form.Field>
                                    <span>
                                      <strong className="titleMobile">
                                        {t(
                                          "buy.form.fields.bankAccountBalance"
                                        )}{" "}
                                        {this.state.availableBalanceCurrency}
                                      </strong>
                                    </span>
                                  </Form.Field>
                                )}
                              </Grid.Column>
                            )}
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
                                <label className="titleMobile">
                                  {t("buy.form.fields.amount")}{" "}
                                  {this.state.currencyLabelSelected !== ""
                                    ? "en " + this.state.currencyLabelSelected
                                    : ""}
                                </label>
                                <NumberFormat
                                  readOnly={!this.state.isCurrencySelected}
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
                                {labelAmountFiat}
                              </Form.Field>
                            </Grid.Column>
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={16}
                              computer={8}
                            >
                              <Form.Field>
                                <label className="titleMobile">
                                  {t("buy.form.fields.amountBTC")}
                                </label>
                                <NumberFormat
                                  readOnly={!this.state.isCurrencySelected}
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
                            </Grid.Column>
                          </Grid>
                          <Grid>
                            <Grid.Column
                              largeScreen={16}
                              computer={16}
                              mobile={16}
                              tablet={16}
                            >
                              <div>
                                <Form.Field>
                                  {!this.state.currencyLabelSelected === "" && (
                                    <div class="marginTopAndLetterSmall">
                                      <span
                                        style={{
                                          marginRight: "10px",
                                          color: "#348DFC",
                                        }}
                                      >
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
                                    <span
                                      style={{
                                        marginRight: "10px",
                                        color: "#348DFC",
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
                                        color: "#348DFC",
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
                                  {this.state.priceUSD !== "" &&
                                    this.state.typeCurrency !== "crypto" && (
                                      <span
                                        style={{
                                          marginRight: "10px",
                                          color: "#348DFC",
                                        }}
                                      >
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
                                      <span
                                        style={{
                                          marginRight: "10px",
                                          color: "#348DFC",
                                        }}
                                      >
                                        1 USD ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.floorDecimals(
                                          1 / this.state.priceForCalculator,
                                          8
                                        )}{" "}
                                        {t("sell.form.averagePriceReference")}
                                      </span>
                                    )}
                                  <br />
                                </Form.Field>
                                <Form.Field>
                                  {this.state.currencyLabelSelected !== "" ||
                                    (this.state.priceUSD !== 0 && (
                                      <div class="letterSmall">
                                        <span
                                          style={{
                                            marginRight: "10px",
                                            color: "#348DFC",
                                          }}
                                        >
                                          {this.state.currencyLabelSelected !==
                                            "crypto" && (
                                            <label>
                                              1 USD ={" "}
                                              {this.state.currencyLabelSelected}{" "}
                                              {this.state.priceUSD.toLocaleString(
                                                "en-US",
                                                { maximumFractionDigits: 2 }
                                              )}{" "}
                                              {t(
                                                "buy.form.fields.averagePriceReference"
                                              )}
                                            </label>
                                          )}
                                          {this.state.currencyLabelSelected ===
                                            "crypto" && (
                                            <label>
                                              1 USD ={" "}
                                              {this.state.currencyLabelSelected}{" "}
                                              {this.state.priceUSD.toLocaleString(
                                                "en-US",
                                                { maximumFractionDigits: 8 }
                                              )}{" "}
                                              {t(
                                                "buy.form.fields.averagePriceReference"
                                              )}
                                            </label>
                                          )}
                                        </span>
                                      </div>
                                    ))}
                                </Form.Field>
                                <Form.Field>
                                  {this.state.currencyLabelSelected !== "ETH" &&
                                    this.state.currencyLabelSelected !==
                                      "VES" &&
                                    this.state.rateForex !== null &&
                                    typeof this.state.rateForex !== undefined &&
                                    this.state.rateForex !== "" && (
                                      <div
                                        class="letterSmall"
                                        style={{ color: "#348DFC" }}
                                      >
                                        1 USD ={" "}
                                        {this.state.currencyLabelSelected}{" "}
                                        {this.state.rateForex.toLocaleString(
                                          "en-US",
                                          { maximumFractionDigits: 2 }
                                        )}{" "}
                                        <label style={{ color: "#348DFC" }}>
                                          {t("buy.form.fields.forexRate")}
                                        </label>
                                      </div>
                                    )}
                                </Form.Field>
                              </div>
                            </Grid.Column>
                            {this.state.currencyLabelSelected !== "ETH" && (
                              <Grid.Column
                                largeScreen={16}
                                computer={16}
                                mobile={16}
                                tablet={16}
                              >
                                <div
                                  className="bold"
                                  style={{ color: "#1A71DD" }}
                                >
                                  {(
                                    this.state.amountFiat / this.state.priceUSD
                                  ).toLocaleString("en-US", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  <label style={{ color: "#1A71DD" }}>
                                    USD
                                  </label>
                                </div>
                              </Grid.Column>
                            )}
                          </Grid>
                        </div>
                      )}
                    {((this.state.clientPaymentSelected !== null &&
                      this.state.clientPaymentSelected !== "crear") ||
                      !this.state.joinMyPayments) &&
                      this.state.priceForCalculator > 0 &&
                      sessionStorage.getItem("auth") === "true" && (
                        <div>
                          <Grid.Column>{/* <Divider hidden/> */}</Grid.Column>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field>
                                <label className="titleMobile">
                                  {t("buy.form.fields.messageToTheModerator")}
                                </label>
                                <Form.TextArea
                                  value={this.state.commentInitial}
                                  onChange={this.handleComments}
                                />
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                          <Grid.Column>{/* <Divider hidden /> */}</Grid.Column>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Field required>
                                <input
                                  value={this.state.identifier}
                                  placeholder={t("buy.form.fields.identifyBuy")}
                                  onChange={this.handleIdentifier.bind(this)}
                                />
                              </Form.Field>
                            </Grid.Column>
                          </Grid>
                          <Grid.Column>
                            <Divider hidden />
                          </Grid.Column>
                          <Grid columns={1}>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <Form.Group inline>
                                <Form.Checkbox
                                  onChange={this.aceptTerminsAnsConditions.bind(
                                    this
                                  )}
                                  checked={
                                    this.state.termsAndConditionsAccepted
                                  }
                                />
                                <Form.Field
                                  required
                                  onClick={this.openModalTerminsAnsConditions.bind(
                                    this
                                  )}
                                >
                                  {t("buy.form.fields.accept")}{" "}
                                  <label>
                                    <a
                                      onClick={this.openModalTerminsAnsConditions.bind(
                                        this
                                      )}
                                      className={"linkVerMas"}
                                    >
                                      {t("buy.form.fields.terms")}
                                    </a>
                                  </label>
                                </Form.Field>
                              </Form.Group>
                              {this.state.viewMessageTerm && (
                                <Message info>{t(this.state.message)}</Message>
                              )}
                            </Grid.Column>
                            <Grid.Column
                              largeScreen={16}
                              mobile={16}
                              tablet={16}
                              computer={16}
                            >
                              <div>
                                <Button
                                  type="submit"
                                  color="blue"
                                  size="large"
                                  style={{
                                    borderRadius: "40px/40px",
                                    height: "40px",
                                    width: "240px",
                                  }}
                                  onClick={this.handleSubmitBuyBitcoins.bind(
                                    this
                                  )}
                                >
                                  {t("buy.form.fields.buttonBuy")}
                                </Button>
                              </div>
                            </Grid.Column>

                            {this.state.viewBrokerOffer === true && (
                              <Grid.Column
                                largeScreen={16}
                                mobile={16}
                                tablet={16}
                                computer={16}
                              >
                                <div>
                                  <Button
                                    color="red"
                                    size="large"
                                    style={{
                                      borderRadius: "40px/40px",
                                      height: "40px",
                                      width: "240px",
                                    }}
                                    onClick={this.rejectOffer.bind(this)}
                                  >
                                    {t("buy.form.fields.reject")}
                                  </Button>
                                </div>
                              </Grid.Column>
                            )}
                          </Grid>
                        </div>
                      )}

                    {this.state.dollarBTCPaymentSelected !== "" &&
                      this.state.hasOffersAsk === true &&
                      sessionStorage.getItem("auth") !== "true" && (
                        <Grid>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            <div>
                              <Form.Field centered>
                                <Button
                                  floated={"center"}
                                  color="blue"
                                  size="large"
                                  onClick={() => this.gotoSignin()}
                                  style={{
                                    borderRadius: "40px/40px",
                                    height: "50px",
                                    width: "200px",
                                    marginLeft: 15,
                                  }}
                                >
                                  {t("navPublic.account.options.signup")}
                                </Button>
                              </Form.Field>
                            </div>
                          </Grid.Column>
                        </Grid>
                      )}
                    {((this.state.clientPaymentSelected !== null &&
                      this.state.clientPaymentSelected === "crear") ||
                      !this.state.joinMyPayments) &&
                      this.state.priceForCalculator > 0 &&
                      sessionStorage.getItem("auth") === "true" && (
                        <div>
                          <Grid.Column
                            largeScreen={16}
                            mobile={16}
                            tablet={16}
                            computer={16}
                          >
                            {/* <Form.Group inline >
                        <Form.Checkbox
                          onChange={this.aceptTerminsAnsConditions.bind(this)}
                          checked={this.state.termsAndConditionsAccepted}

                        />
                        <Form.Field required
                          onClick={this.openModalTerminsAnsConditions.bind(
                            this
                          )}>
                          {t("buy.form.fields.accept")}{" "}
                          <label>
                          <a
                            onClick={this.openModalTerminsAnsConditions.bind(this)}
                            className={"linkVerMas"}
                          >
                            {t("buy.form.fields.terms")}
                          </a>
                          </label>
                        </Form.Field>
                      </Form.Group> */}
                            {this.state.viewMessageTerm && (
                              <Message info>{t(this.state.message)}</Message>
                            )}
                          </Grid.Column>
                        </div>
                      )}

                    {/* viewBrokerOffer:false, ========================================================*/}
                    {this.state.viewBrokerOffer === true && (
                      <div>
                        <Grid columns={2}>
                          <Grid.Column
                            largeScreen={8}
                            mobile={16}
                            tablet={16}
                            computer={10}
                          >
                            {this.state.isCurrencySelected !== "" && (
                              <Form.Field>
                                <span>
                                  <strong className="titleMobile">
                                    {t("buy.form.fields.commercialLimits")}
                                  </strong>
                                  <strong className="titleMobile">
                                    {this.state.isCurrencySelected
                                      ? " " + this.state.minAmount
                                      : ""}
                                    {this.state.isCurrencySelected ? " - " : ""}
                                    {this.state.isCurrencySelected
                                      ? " " + this.state.maxAmount
                                      : ""}
                                    {this.state.isCurrencySelected ? "  " : ""}
                                    {this.state.currencyLabelSelected}
                                  </strong>
                                </span>
                              </Form.Field>
                            )}
                          </Grid.Column>
                          {this.state.hasBankCredentials && (
                            <Grid.Column
                              largeScreen={8}
                              mobile={16}
                              tablet={16}
                              computer={6}
                            >
                              {this.state.hasBankCredentials && (
                                <Form.Field>
                                  <span>
                                    <strong className="titleMobile">
                                      {t("buy.form.fields.bankAccountBalance")}{" "}
                                      {this.state.availableBalanceCurrency}
                                    </strong>
                                  </span>
                                </Form.Field>
                              )}
                            </Grid.Column>
                          )}
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
                              <label className="titleMobile">
                                {t("buy.form.fields.amount")}{" "}
                                {this.state.currencyLabelSelected !== ""
                                  ? "en " + this.state.currencyLabelSelected
                                  : ""}
                              </label>
                              <NumberFormat
                                readOnly={!this.state.isCurrencySelected}
                                value={this.state.amountFiat}
                                allowNegative={false}
                                thousandSeparator={true}
                                placeholder={
                                  this.state.currencyLabelSelected !== ""
                                    ? this.state.currencyLabelSelected
                                    : t("buy.form.fields.amountFiat")
                                }
                                allowNegative={false}
                                onChange={this.handleAmountBitcoins.bind(this)}
                                name="fiat"
                              />
                              {labelAmountFiat}
                            </Form.Field>
                          </Grid.Column>
                          <Grid.Column
                            largeScreen={8}
                            mobile={16}
                            tablet={16}
                            computer={8}
                          >
                            <Form.Field>
                              <label className="titleMobile">
                                {t("buy.form.fields.amountBTC")}
                              </label>
                              <NumberFormat
                                readOnly={!this.state.isCurrencySelected}
                                value={this.state.amountBitcoins}
                                allowNegative={false}
                                thousandSeparator={true}
                                placeholder={"BTC"}
                                onChange={this.handleAmountBitcoins.bind(this)}
                                name="crypto"
                              />
                              {labelAmountCryptoError}
                            </Form.Field>
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
                                {!this.state.currencyLabelSelected === "" && (
                                  <div class="marginTopAndLetterSmall">
                                    <span style={{ marginRight: "10px" }}>
                                      <label style={{ color: "#348DFC" }}>
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
                              <Form.Field>
                                {this.state.currencyLabelSelected !== "" ||
                                  (this.state.priceUSD !== 0 && (
                                    <div class="letterSmall">
                                      <span style={{ marginRight: "10px" }}>
                                        {this.state.currencyLabelSelected !==
                                          "ETH" && (
                                          <label style={{ color: "#348DFC" }}>
                                            1 USD ={" "}
                                            {this.state.currencyLabelSelected}{" "}
                                            {this.state.priceUSD.toLocaleString(
                                              "en-US",
                                              { maximumFractionDigits: 2 }
                                            )}{" "}
                                            {t(
                                              "buy.form.fields.averagePriceReference"
                                            )}
                                          </label>
                                        )}
                                        {this.state.currencyLabelSelected ===
                                          "ETH" && (
                                          <label style={{ color: "#348DFC" }}>
                                            1 USD ={" "}
                                            {this.state.currencyLabelSelected}{" "}
                                            {this.state.priceUSD.toLocaleString(
                                              "en-US",
                                              { maximumFractionDigits: 8 }
                                            )}{" "}
                                            {t(
                                              "buy.form.fields.averagePriceReference"
                                            )}
                                          </label>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                              </Form.Field>
                              <Form.Field>
                                {this.state.currencyLabelSelected !== "ETH" &&
                                  this.state.currencyLabelSelected !== "VES" &&
                                  this.state.rateForex !== null &&
                                  typeof this.state.rateForex !== undefined &&
                                  this.state.rateForex !== "" && (
                                    <div
                                      class="letterSmall"
                                      style={{ color: "#348DFC" }}
                                    >
                                      1 USD = {this.state.currencyLabelSelected}{" "}
                                      {this.state.rateForex.toLocaleString(
                                        "en-US",
                                        { maximumFractionDigits: 2 }
                                      )}{" "}
                                      <label style={{ color: "#348DFC" }}>
                                        {t("buy.form.fields.forexRate")}
                                      </label>
                                    </div>
                                  )}
                              </Form.Field>
                            </div>
                          </Grid.Column>
                          {this.state.currencyLabelSelected !== "ETH" && (
                            <Grid.Column
                              largeScreen={8}
                              computer={8}
                              mobile={8}
                              tablet={8}
                            >
                              <div
                                className="bold"
                                style={{ color: "#1A71DD" }}
                              >
                                {(
                                  this.state.amountFiat / this.state.priceUSD
                                ).toLocaleString("en-US", {
                                  maximumFractionDigits: 2,
                                })}{" "}
                                <label style={{ color: "#1A71DD" }}>USD</label>
                              </div>
                            </Grid.Column>
                          )}
                        </Grid>
                        <div>
                          <Button
                            floated={"center"}
                            color="blue"
                            size="large"
                            onClick={() => this.gotoSigninToken()}
                          >
                            {t("navPublic.account.options.signup")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Form>
                </Container>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
          <Divider hidden section />
          <Modal
            open={this.state.openBuyConfirm}
            onClose={this.closeSendConfirm}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.modalConfirm.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Segment loading={this.state.formLoad}>
                  <div align="center">
                    <strong>
                      {t("buy.modalConfirm.request.part1")}{" "}
                      <NumberFormat
                        value={this.state.amountBitcoins}
                        displayType={"text"}
                        thousandSeparator={true}
                      />{" "}
                      {t("buy.modalConfirm.request.part2")}{" "}
                      <NumberFormat
                        value={this.state.amountFiat}
                        displayType={"text"}
                        thousandSeparator={true}
                      />{" "}
                      {this.state.currencyLabelSelected}
                    </strong>
                  </div>
                  <Divider />
                  <div>
                    <label>
                      {this.state.mapPayments.has(
                        this.state.dollarBTCPaymentSelected.type
                      )
                        ? this.state.mapPayments.get(
                            this.state.dollarBTCPaymentSelected.type
                          )
                        : this.state.dollarBTCPaymentSelected.type}
                    </label>
                  </div>
                  {this.state.listItemModal}
                  <Divider />
                  {this.state.typePaymentSelectedNew !== "CREDIT_CARD" && (
                    <div>
                      <strong>
                        {t("buy.modalConfirm.payWindow.part1")}
                        {this.state.payWindow.split(" ")[0]}
                        {t("buy.modalConfirm.payWindow.part2")}
                      </strong>
                    </div>
                  )}
                  {labelMessage}
                  {this.state.chargesByOperation.length !== 0 && (
                    <div>
                      <Divider />
                      <h4>{t("buy.modalConfirm.charges.header")}</h4>
                    </div>
                  )}
                  {this.state.chargesByOperation.length !== 0 &&
                    this.state.chargesByOperation.map((item, index) => (
                      <div>
                        <span>
                          {item.label}
                          {item.value}
                        </span>
                      </div>
                    ))}
                </Segment>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div align="center">
                <div
                  hidden={
                    this.state.operationReady &&
                    this.state.amountChangedTo === 0 &&
                    !this.state.errorServer
                  }
                >
                  <Button
                    color="grey"
                    onClick={this.closeSendConfirm}
                    disabled={this.state.formLoad}
                    style={{
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px",
                    }}
                  >
                    {t("buy.modalConfirm.buttonClose")}
                  </Button>
                  <Divider hidden></Divider>
                  <Button
                    onClick={this.aceptSendConfirm}
                    disabled={this.state.formLoad}
                    color="blue"
                    style={{
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px",
                    }}
                  >
                    {t("buy.modalConfirm.buttonAccept")}
                  </Button>
                  <Divider hidden></Divider>
                </div>
                <div
                  hidden={
                    !this.state.operationReady ||
                    this.state.amountChangedTo > 0 ||
                    this.state.errorServer
                  }
                >
                  <Button
                    color="blue"
                    onClick={this.redirectToMyBuys.bind(this)}
                    style={{
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px",
                    }}
                  >
                    {t("buy.modalConfirm.buttonClose")}
                  </Button>
                  <br />
                </div>
              </div>
            </Modal.Actions>
            <Divider hidden></Divider>
          </Modal>
          <Modal
            open={this.state.showModalCreatePayment}
            onClose={this.closeModalCreatePayment.bind(this)}
            className="BuyBitcoins"
          >
            <Modal.Header>{t("buy.modalCreatePayment.header")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Message info>
                  <h3>{t("buy.modalCreatePayment.body.h3")}</h3>
                  <p>{t("buy.modalCreatePayment.body.p1")}</p>
                  <p>{t("buy.modalCreatePayment.body.p2")}</p>
                  <ul>
                    <li type="disc">
                      <strong>
                        {t(
                          "buy.modalCreatePayment.body.list.item1.recommended"
                        )}
                      </strong>
                      {t("buy.modalCreatePayment.body.list.item1.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item1.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item1.body.p2")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item1.body.p3")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item2.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item2.body.p4")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item2.body.p5")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item3.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p4")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p5")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item3.body.p6")}
                      </li>
                      <p>
                        {t("buy.modalCreatePayment.body.list.item3.body.p5")}
                      </p>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item4.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p1")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p2")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p3")}
                      </li>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item4.body.p4")}
                      </li>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item5.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item5.body")}{" "}
                      </li>
                    </ul>
                    <li type="disc">
                      {t("buy.modalCreatePayment.body.list.item6.header")}
                    </li>
                    <ul>
                      <li type="circle">
                        {t("buy.modalCreatePayment.body.list.item6.body")}
                      </li>
                    </ul>
                  </ul>
                </Message>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              {!isMobile && (
                <Modal.Actions>
                  <div align="center">
                    <Button
                      onClick={this.closeModalCreatePayment.bind(this)}
                      color="blue"
                      style={{
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                      }}
                    >
                      {t("buy.modalCreatePayment.buttonAccept")}
                    </Button>
                  </div>
                </Modal.Actions>
              )}
              {isMobile && (
                <Modal.Actions>
                  <div align="center">
                    <Button
                      onClick={this.closeModalCreatePayment.bind(this)}
                      color="blue"
                      style={{
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                      }}
                    >
                      {t("buy.modalCreatePayment.buttonAccept")}
                    </Button>
                  </div>
                </Modal.Actions>
              )}
            </Modal.Actions>
            <Divider hidden />
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
            {isMobile && (
              <Modal.Actions>
                <div align="center">
                  <div hidden={this.state.operationReady}>
                    <Button
                      onClick={this.closeModalViewTerminosAndConditions.bind(
                        this
                      )}
                      color="grey"
                      style={{
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                      }}
                    >
                      <p>{t("buy.modalTerms.buttonClose")}</p>
                    </Button>
                    <Divider hidden></Divider>
                    {!this.state.termsAndConditionsAccepted && (
                      <Button
                        color="blue"
                        onClick={this.aceptTerminsAnsConditions.bind(this)}
                        style={{
                          borderRadius: "40px/40px",
                          height: "50px",
                          width: "200px",
                        }}
                      >
                        <p>{t("buy.modalTerms.buttonAcceptTerms")}</p>
                      </Button>
                    )}
                    <Divider hidden></Divider>
                  </div>
                </div>
              </Modal.Actions>
            )}
          </Modal>
        </Responsive>
      </div>
    );
  }
}
export default translate(FormBuyBitcoin);
