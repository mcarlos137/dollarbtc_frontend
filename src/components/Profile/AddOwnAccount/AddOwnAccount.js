import React, { Component } from "react";
import "./AddOwnAccount.css";
import user from "../../../services/user";
import otc from "../../../services/otc";
import paymentApi from "../../../services/payment";
import config from "../../../services/config";
import axios from "axios";
import {
  Segment,
  Header,
  Form,
  Button,
  Message,
  Image,
  Grid,
  Divider,
  Responsive,
} from "semantic-ui-react";
import currency from "../../../common/currency";
import DinamicForm from "../../DinamicForm/DinamicForm";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
import { array } from "prop-types";
import { stubFalse } from "lodash";
class AddOwnAccount extends Component {
  constructor(props) {
    super(props);
    this.fields = [];
    this.constantPaymentsTypes = new Map();
    this.constantPaymentsTypes.set(
      "TRANSFER_WITH_SPECIFIC_BANK",
      props.translate("profile.addAccount.specificBank")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_NATIONAL_BANK",
      props.translate("profile.addAccount.thirdBank")
    );
    this.constantPaymentsTypes.set(
      "CHECK_DEPOSIT",
      props.translate("profile.addAccount.checkDeposit")
    );
    this.constantPaymentsTypes.set(
      "CASH_DEPOSIT",
      props.translate("profile.addAccount.cashDeposit")
    );
    this.constantPaymentsTypes.set(
      "WIRE_TRANSFER",
      props.translate("profile.addAccount.wire")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_INTERNATIONAL_BANK",
      props.translate("profile.addAccount.international")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_TO_CRYPTO_WALLET",
      props.translate("profile.addAccount.cryptoWallet")
    );
    this.constantPaymentsTypes.set(
      "CREDIT_CARD",
      props.translate("profile.addAccount.creditCard")
    );
    this.state = {
      forLoad: false,
      automatic: null,
      firstName: sessionStorage.getItem("firstName"),
      lastName: "",
      idHolder: "",
      nameHolder: "",
      accountNumber: "",
      imgCountry: "",
      bank: "",
      formAdd: Math.random(),
      banks: [],
      paymentBody: [],
      fields: [],
      payment: "",
      paymentName: "",
      clientPaymenType: {},
      paymentTypeBody: "",
      listCountrysView: [],
      listCountrys: [],
      getresult: false,
      selectDataAccount: false,
      selectDataCredit: false,
      listPayments: [
        {
          text: props.translate("profile.addAccount.transfer"),
          value: "TRANSFER_TO_BANK_ACCOUNT",
          key: "bank",
        },
        {
          text: "Zelle",
          value: "ZELLE",
          key: "zell",
        },
      ],
      statusA: false,
      statusB: false,
      statusC: false,
      list: [],
      currencies: [],
      translator: props.translate,
      specialValue: false,
      paymentsUserForCurrency: [],
      showMessageRecomende: false,
      hasCreditCard: {
        isCreditCard: false,
      },
    };
    this.getInfoUser = this.getInfoUser.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  getInfoUser() {
    let username = user.getUserName();
    user.getConfigUserGeneral(username).then((resp) => {
      if (resp.data.result.verification !== undefined) {
        if (resp.data.result.verification.A !== undefined) {
          if (resp.data.result.verification.B !== undefined) {
            if (resp.data.result.verification.C !== undefined) {
              this.setState({
                statusA: true,
                statusB: true,
                statusC: resp.data.result.verification.C.userVerificationStatus,
              });
            } else {
              this.setState({
                statusA: true,
                statusB: true,
                statusC: "UNINITIATED",
              });
            }
          } else {
            this.setState({ statusA: true });
          }
        }
      }
      let data = user.getActualUserInfo(resp.data.result);

      this.setState({ firstName: data.firstName, lastName: data.lastName });
    });
  }
  componentDidMount() {
    let resp;
    //let arr = [];
    this.getTypePayments();
    this.getInfoUser();
    this.setState({ formLoad: true });
    let keys = [];
    resp = otc.getCurrencies();
    resp
      .then((r) => {
        this.setState({ formLoad: false, view: true });
        for (let currency of r.data) {
          keys.push(currency.shortName);
        }
        this.setState(() => ({
          currencies: currency.currencies.filter((currency) => {
            return keys.find((key) => key === currency.alias);
          }),
        }));
      })
      .catch((error) => {
        this.setState({ formLoad: false });
      });
  }
  getTypePayments() {
    let arrayList = [];
    otc
      .getClientPaymentTypes()
      .then((respo) => {
        Object.entries(respo.data).forEach(([key, value]) => {
          let data = {
            shortName: key,
            clientPaymentTypes: value,
          };
          arrayList.push(data);
        });
        this.setState({ list: arrayList });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getPaymentUser(currency) {
    otc
      .getPayments(currency, sessionStorage.getItem("username"))
      .then((resp) => {
        this.setState({ paymentsUserForCurrency: resp.data });
      })
      .catch((error) => {
        this.setState({ paymentsUserForCurrency: [] });
      });
  }
  handleCountry(e, data) {
    this.setState({ showMessageRecomende: false });
    let array = [];

    this.getPaymentUser(data.value);
    let payments = this.state.list.find(function (ele) {
      return data.value === ele.shortName;
    });
    this.groupPaymentTypesByCurrency(payments);
    let paymentdata = this.state.currencies.find(function (ele) {
      return data.value === ele.value;
    });

    for (let value of payments.clientPaymentTypes) {
      if (value.allowToAddPayment === true) {
        let has;
        has = this.constantPaymentsTypes.has(value.name);
        if (has) {
          let textView = this.constantPaymentsTypes.get(value.name);
          if (value.name === "TRANSFER_WITH_SPECIFIC_BANK") {
            let arrayText = "";
            this.setState({
              fields: value.fields,
            });
            for (let test of value.fields) {
              if (test.name === "bank") {
                for (let testvalue of test.values) {
                  if (arrayText === "") {
                    arrayText = arrayText + testvalue;
                  } else {
                    arrayText = arrayText + " - " + testvalue;
                  }
                }
              }
            }
            textView = textView + " (" + arrayText + ")";
          }
          array.push({
            text: textView, //this.constantPaymentsTypes.get(value.name),
            value: value,
            key: value.name,
            client: value.client,
            required: value.required,
          });
        } else {
          array.push({
            text: value.description,
            value: value,
            key: value.name,
            client: value.client,
            required: value.required,
          });
        }
      }
    }
    this.fields = [];
    this.setState({
      country: paymentdata.value,
      imgCountry: paymentdata.img,
      listPaymentTypes: array,
    });
  }
  groupPaymentTypesByCurrency(payments) {
    let fields = [];
    let fieldsCreditCard = [];
    let paymentsType = payments.clientPaymentTypes;

    if (paymentsType.length > 0) {
      for (let payment of paymentsType) {
        if (payment.allowToAddPayment === true) {
          for (let field of payment.fields) {
            let ob = {};
            let objCreditCard = {};
            let fieldExist = fields.find(function (element) {
              return element.name === field.name;
            });

            if (fieldExist === undefined) {
              if (field.values !== undefined) {
                if (payment.name === "TRANSFER_WITH_SPECIFIC_BANK") {
                  this.setState({ showMessageRecomende: true });
                  field.values = field.values.map(function (element) {
                    return "*" + element;
                  });
                }
                ob.name = field.name;
                ob.values = field.values;
                fields.push(ob);
              } else {
                ob.name = field.name;
                fields.push(ob);
              }
            } else {
              if (field.values !== undefined) {
                fields.map(function (element) {
                  if (element.name === field.name) {
                    for (let value of field.values) {
                      if (element.values.indexOf(value) === -1) {
                        element.values.push(value);
                      }
                    }
                  }

                  return element;
                });
              }
            }
            if (payment.name === "CREDIT_CARD") {
              objCreditCard.name = field.name;
              objCreditCard.values = field.values;
              objCreditCard.required = field.required;
              objCreditCard.client = field.client;
              fieldsCreditCard.push(objCreditCard);
            }
          }
        }
        this.fields = fields;
        let hasCreditCard = {
          isCreditCard: fieldsCreditCard.length > 0,
          fields: fieldsCreditCard,
        };
        this.hasCreditCard = hasCreditCard;

        this.setState({ fields: fields, hasCreditCard: hasCreditCard });
      }
    }
  }
  findTypePaymentName() {}
  handlePayment(e, data) {
    this.fields = data.value.fields;

    this.setState({
      paymentName: data.value.description,
      payment: data.value.name,
      messagesBody: data.value.messages,
      automatic: data.value.automaticCharge,
      forceVerification: data.value.forceVerification,
    });
  }

  handleField(e, data) {
    let oj = {
      [data.name]: data.value.replace("*", ""),
    };
    this.setState({ paymentBody: [...this.state.paymentBody, oj] }, () => {});
  }

  handleNewAcount(e, data) {
    e.preventDefault();
    let pay = {};
    let body = {};

    if (
      this.state.paymentBody !== "" &&
      this.state.paymentBody !== undefined &&
      this.state.paymentBody !== null
    ) {
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
    }
    let auxPaymentType;

    if (
      this.state.listPaymentTypes !== "" &&
      this.state.listPaymentTypes !== undefined &&
      this.state.listPaymentTypes !== null
    ) {
      auxPaymentType = this.state.listPaymentTypes.filter(
        (p) => p.value.name === "CREDIT_CARD"
      );
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "sell.form.errors.incompleteData",
      });

      setTimeout(() => {
        this.setState({
          viewMessage: false,
          textMessage: "",
        });
      }, 5000);
    }

    if (this.state.specialValue) {
      this.setState({ forceVerification: false });
      body = {
        userName: user.getUserName(),
        currency: this.state.country,
        bankLogin: pay.bankLogin,
        bankPassword: pay.bankPassword,
        paymentBank: pay.bank,
        paymentType: this.state.payment,
      };

      this.setState({ formLoad: true });
      paymentApi
        .createExternalPaymentMethod(body)
        .then((resp) => {
          let keysRes = Object.keys(resp.data);
          if (keysRes.length > 0) {
            if (this.state.paymentsUserForCurrency.length > 0) {
              let paymentExist = this.state.paymentsUserForCurrency.find(
                function (element) {
                  return element.id === resp.data.id;
                }
              );
              if (paymentExist === undefined) {
                this.setState({ formLoad: false, formAdd: Math.random() });
                this.setState({
                  viewMessage: true,
                  textMessage: "profile.addAccount.messages.addAccountSuccess",
                  payment: "",
                  country: "",
                  idHolder: "",
                  bank: "",
                  paymentText: "",
                  countryText: "",
                  accountHolder: "",
                  nameHolder: "",
                  imgCountr: "",
                  banks: [],
                  paymentBody: [],
                  fields: [],
                  clientPaymenType: {},
                  paymentTypeBody: "",
                  listCountrysView: [],
                  getresult: true,
                });
                this.fields = [];
                setTimeout(() => {
                  this.setState({ viewMessage: false, textMessage: "" });
                  this.handleCancel();
                }, 5000);
              } else {
                this.setState({ formLoad: false });
                this.setState({
                  viewMessage: true,
                  textMessage:
                    "profile.addAccount.messages.errorExistExternalPayment",
                  payment: "",
                  country: "",
                  idHolder: "",
                  imgCountr: "",
                  bank: "",
                  paymentText: "",
                  countryText: "",
                  accountHolder: "",
                  nameHolder: "",
                  banks: [],
                  paymentBody: [],
                  fields: [],
                  clientPaymenType: {},
                  paymentTypeBody: "",
                  listCountrysView: [],
                });
                setTimeout(() => {
                  this.setState({ viewMessage: false, textMessage: "" });
                }, 5000);
              }
            } else {
              this.setState({ formLoad: false, formAdd: Math.random() });
              this.setState({
                viewMessage: true,
                textMessage: "profile.addAccount.messages.addAccountSuccess",
                payment: "",
                country: "",
                idHolder: "",
                bank: "",
                paymentText: "",
                countryText: "",
                accountHolder: "",
                nameHolder: "",
                imgCountr: "",
                banks: [],
                paymentBody: [],
                fields: [],
                clientPaymenType: {},
                paymentTypeBody: "",
                listCountrysView: [],
                getresult: true,
              });
              setTimeout(() => {
                this.setState({ viewMessage: false, textMessage: "" });
                this.handleCancel();
              }, 5000);
            }
          } else {
            this.setState({ formLoad: false });
            this.setState({
              viewMessage: true,
              textMessage:
                "profile.addAccount.messages.errorExternalPaymentCreate",
              payment: "",
              country: "",
              idHolder: "",
              imgCountr: "",
              bank: "",
              paymentText: "",
              countryText: "",
              accountHolder: "",
              nameHolder: "",
              banks: [],
              paymentBody: [],
              fields: [],
              clientPaymenType: {},
              paymentTypeBody: "",
              listCountrysView: [],
            });
            setTimeout(() => {
              this.setState({ viewMessage: false, textMessage: "" });
            }, 5000);
          }
        })
        .catch((error) => {
          this.setState({ formLoad: false });
          this.setState({
            viewMessage: true,
            textMessage: "profile.addAccount.messages.errorServer",
            payment: "",
            country: "",
            idHolder: "",
            imgCountr: "",
            bank: "",
            paymentText: "",
            countryText: "",
            accountHolder: "",
            nameHolder: "",
            banks: [],
            paymentBody: [],
            fields: [],
            clientPaymenType: {},
            paymentTypeBody: "",
            listCountrysView: [],
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
          }, 5000);
        });
    } else {
      //validando

      let count = 0;
      let arraynames = [];

      if (
        this.state.selectDataCredit === true &&
        this.state.selectDataAccount === false
      ) {
        this.state.hasCreditCard.fields.map((item) => {
          if (item.client === true) {
            count++;
            arraynames.push(item.name);
          }
        });
      } else if (
        this.state.selectDataCredit === false &&
        this.state.selectDataAccount === true
      ) {
        this.state.fields.map((item) => {
          if (item.client === true) {
            count++;
            arraynames.push(item.name);
          }
        });
      }

      let nameacum = [];
      let namearraynames;
      Object.entries(this.state.paymentBody).forEach(([key, value]) => {
        Object.entries(value).forEach(([key2, value2]) => {
          arraynames.map((item, index) => {
            namearraynames = item;
            //name del item del array rekerido namearraynames

            if (key2.includes(namearraynames)) {
              if (value2 === null || value2 === undefined || value2 === "") {
                this.setState({
                  viewMessage: true,
                  textMessage: "sell.form.errors.incompleteData",
                });
                setTimeout(() => {
                  this.setState({
                    viewMessage: false,
                    textMessage: "",
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
                viewMessage: true,
                textMessage: "sell.form.errors.incompleteData",
              });
              setTimeout(() => {
                this.setState({
                  viewMessage: false,
                  textMessage: "",
                });
              }, 5000);
              return false;
            }
          });
        });
      });

      if (nameacum.length !== arraynames.length) {
        this.setState({
          viewMessage: true,
          textMessage: "sell.form.errors.incompleteData",
        });
        setTimeout(() => {
          this.setState({
            viewMessage: false,
            textMessage: "",
          });
        }, 5000);
        return false;
      }

      pay.verified = false;
      pay.messages = this.state.messagesBody;
      pay.type = this.state.payment;
      pay.accountHolderName = this.state.firstName + " " + this.state.lastName;
      pay.automaticCharge = this.state.automatic;
      pay.forceVerification = this.state.forceVerification;
      this.setState({ formLoad: true });
      if (pay.hasOwnProperty("cardType")) {
        pay.messages = auxPaymentType[0].value.messages;
        pay.type = auxPaymentType[0].value.name;
        pay.automaticCharge = auxPaymentType[0].value.automaticCharge;
        pay.forceVerification = auxPaymentType[0].value.forceVerification;
      }
      body = {
        userName: user.getUserName(),
        currency: this.state.country,
        payment: pay,
      };
      otc
        .addPayment(body)
        .then((resp) => {
          if (resp.status === 200) {
            let field = "paymentId__" + resp.data;
            this.addInfoUser(field, resp.data);
            this.setState({ formLoad: false, formAdd: Math.random() });
            this.setState({
              viewMessage: true,
              textMessage: "profile.addAccount.messages.addAccountSuccess",
              payment: "",
              country: "",
              idHolder: "",
              bank: "",
              paymentText: "",
              countryText: "",
              accountHolder: "",
              nameHolder: "",
              imgCountr: "",
              banks: [],
              paymentBody: [],
              fields: [],
              clientPaymenType: {},
              paymentTypeBody: "",
              listCountrysView: [],
              getresult: true,
            });
            this.fields = [];
            setTimeout(() => {
              this.setState({ viewMessage: false, textMessage: "" });
              this.handleCancel();
            }, 5000);
          } else {
          }
        })
        .catch((error) => {
          this.setState({ formLoad: false });
          this.setState({
            viewMessage: true,
            textMessage: "profile.addAccount.messages.errorServer",
            payment: "",
            country: "",
            idHolder: "",
            imgCountr: "",
            bank: "",
            paymentText: "",
            countryText: "",
            accountHolder: "",
            nameHolder: "",
            banks: [],
            paymentBody: [],
            fields: [],
            clientPaymenType: {},
            paymentTypeBody: "",
            listCountrysView: [],
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
          }, 5000);
        });
    }
  }
  handleCancel() {
    if (!this.props.addAccount) {
      this.props.changeItem("list-holder");
      this.props.changeItemTwo("optionCurren");
    }
  }
  async addInfoUser(field, value) {
    try {
      let body = {
        userName: window.sessionStorage.getItem("username"),
        fieldName: field,
        fieldValue: value,
      };
      const response = await user.addDataUserAsync(body);
      if (response.data === "OK") {
        this.initVerificationAccount(field);
      }
    } catch (error) {
      //console.log(error);
    }
  }
  initVerificationAccount(value) {
    let body = {
      userName: window.sessionStorage.getItem("username"),
      fieldNames: [value],
      userVerificationType: "D",
      info: "Verification payment from client",
    };
    let url = user.verifyUserRequestCore(body);
    url
      .then((resp) => {
        this.setState({ formLoad: false, formAdd: Math.random() });
        this.setState({
          viewMessage: true,
          textMessage: "profile.addAccount.messages.addAccountSuccess",
          payment: "",
          country: "",
          idHolder: "",
          bank: "",
          paymentText: "",
          countryText: "",
          accountHolder: "",
          nameHolder: "",
          imgCountr: "",
          banks: [],
          paymentBody: [],
          fields: [],
          clientPaymenType: {},
          paymentTypeBody: "",
          listCountrysView: [],
          getresult: true,
          hasCreditCard: {
            isCreditCard: false,
          },
        });
        this.fields = [];
        setTimeout(() => {
          this.setState({ viewMessage: false, textMessage: "" });
          this.handleCancel();
          if (this.props.addAccount) {
            this.props.changeStatusForm("OWN");
          }
        }, 5000);
      })
      .catch((error) => {
        this.setState({
          viewMessage: true,
          textMessage: "profile.addAccount.messages.errorServer",
          payment: "",
          country: "",
          idHolder: "",
          imgCountr: "",
          bank: "",
          paymentText: "",
          countryText: "",
          accountHolder: "",
          nameHolder: "",
          banks: [],
          paymentBody: [],
          fields: [],
          clientPaymenType: {},
          paymentTypeBody: "",
          listCountrysView: [],
          hasCreditCard: {
            isCreditCard: false,
          },
        });
        setTimeout(() => {
          this.setState({ viewMessage: false, textMessage: "" });
          this.handleCancel();
        }, 5000);
      });
  }
  handleSpecial(value) {
    this.setState({ specialValue: value });
  }
  selectDataAccount() {
    this.setState({ selectDataAccount: true, selectDataCredit: false });
  }
  selectDataCredit() {
    this.setState({ selectDataCredit: true, selectDataAccount: false });
  }
  render() {
    let t = this.state.translator;
    let list = this.state.currencies;
    let message;
    if (this.state.viewMessage) {
      message = (
        <Message
          info
          style={isMobile ? { width: 200 } : {}}
          content={t(this.state.textMessage)}
        />
      );
    }
    let valid;
    if (
      this.state.statusA &&
      this.state.statusB &&
      this.state.statusC === "OK"
    ) {
      valid = true;
    }
    let massageRecomended = (
      <Message
        color="green"
        style={isMobile ? { width: 200 } : { marginBottom: 10 }}
      >
        <span style={{ fontWeight: "bold" }}>
          {t("sell.form.messages.recomended")}
        </span>
      </Message>
    );
    return (
      <div>
        {!this.props.addAccount && (
          <div>
            <Header
              textAlign="center"
              style={isMobile ? { color: "#207ef2" } : {}}
            >
              {t("profile.addAccount.addPaymentMethod")}
            </Header>
            <Divider
              style={isMobile ? { marginTop: -10, borderColor: "#207ef2" } : {}}
            />
          </div>
        )}
        {valid === true && (
          <div align="center">
            <Message
              style={isMobile ? { width: 200 } : { marginBottom: 10 }}
              color="red"
              content={t("profile.addOwnAccount.messages.addPaymentMethod")}
            />
            {isMobile && <Divider hidden></Divider>}
          </div>
        )}
        {!this.state.statusA && this.state.view && (
          <div>
            {" "}
            <Message
              info
              content={
                <div>
                  {t("profile.addOwnAccount.messages.statusAFail.part1")}
                  <strong> {sessionStorage.getItem("username")}</strong>
                  {t("profile.addOwnAccount.messages.statusAFail.part2")}
                </div>
              }
            />
            <Form.Field>
              <Button
                color="blue"
                onClick={this.handleCancel.bind(this)}
                style={
                  isMobile
                    ? {
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                        marginTop: 20,
                      }
                    : {}
                }
              >
                {t("profile.addAccount.buttonBack")}
              </Button>
            </Form.Field>
          </div>
        )}
        {!this.state.statusB && this.state.statusA && (
          <div>
            {" "}
            <Message
              info
              content={t("profile.addOwnAccount.messages.statusBFail")}
            />
            <Form.Field>
              <Button
                color="blue"
                onClick={this.handleCancel.bind(this)}
                style={
                  isMobile
                    ? {
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                        marginTop: 20,
                      }
                    : {}
                }
              >
                {t("profile.addAccount.buttonBack")}
              </Button>
            </Form.Field>
          </div>
        )}
        {this.state.statusC === "UNINITIATED" && (
          <div>
            {" "}
            <Message
              info
              content={t("profile.addOwnAccount.messages.statusCUninitiated")}
            />
            <Form.Field>
              <Button
                color="blue"
                onClick={this.handleCancel.bind(this)}
                style={
                  isMobile
                    ? {
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                        marginTop: 20,
                      }
                    : {}
                }
              >
                {t("profile.addAccount.buttonBack")}
              </Button>
            </Form.Field>
          </div>
        )}
        {this.state.statusC === "PROCESSING" && (
          <div>
            {" "}
            <Message
              info
              content={t("profile.addOwnAccount.messages.statusCProcessing")}
            />
            <Form.Field>
              <Button
                color="blue"
                onClick={this.handleCancel.bind(this)}
                style={
                  isMobile
                    ? {
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                        marginTop: 20,
                      }
                    : {}
                }
              >
                {t("profile.addAccount.buttonBack")}
              </Button>
            </Form.Field>
          </div>
        )}
        {this.state.statusC === "FAIL" && (
          <div>
            {" "}
            <Message
              info
              content={
                <div>
                  {t("profile.addOwnAccount.messages.statusCFail.part1")}{" "}
                  <a href="/contact">
                    {t("profile.addOwnAccount.messages.statusCFail.contactUs")}
                  </a>
                </div>
              }
            />
            <Form.Field>
              <Button
                color="blue"
                onClick={this.handleCancel.bind(this)}
                style={
                  isMobile
                    ? {
                        borderRadius: "40px/40px",
                        height: "50px",
                        width: "200px",
                        marginTop: 20,
                      }
                    : {}
                }
              >
                {t("profile.addAccount.buttonBack")}
              </Button>
            </Form.Field>
          </div>
        )}
        {valid === true && (
          <Grid columns="equal">
            {isMobile && <Grid.Column mobile={2} />}
            <Grid.Column largeScreen="11" mobile={8} computer={11} tablet={11}>
              <Form
                error
                loading={this.state.formLoad}
                key={this.state.formAdd}
                onSubmit={this.handleNewAcount.bind(this)}
              >
                <Form.Group columns="equal">
                  <Form.Field required>
                    <label
                      style={
                        isMobile
                          ? { color: "#207ef2", textAlign: "left" }
                          : { textAlign: "left" }
                      }
                    >
                      <strong>{t("sell.form.coin")}</strong>
                    </label>
                    <Form.Select
                      // label={t("sell.form.coin")}
                      required
                      onChange={this.handleCountry.bind(this)}
                      placeholder={t("profile.addAccount.placeholderCoin")}
                      options={list}
                      size="tiny"
                    />
                  </Form.Field>
                  <Form.Field>
                    <Image
                      style={{ marginTop: "24px" }}
                      src={this.state.imgCountry}
                      circular
                      size="mini"
                    />
                  </Form.Field>
                  <Responsive as={Form.Field} {...Responsive.onlyMobile}>
                    {" "}
                    <Divider hidden />
                    <br />
                  </Responsive>
                  {/*  <Form.Field>
                    <Form.Select //se llena el select de tipo de pago
                      label={t("sell.form.type")}
                      onChange={this.handlePayment.bind(this)}
                      placeholder={t(
                        "profile.addAccount.placeholderMethodPayment"
                      )}
                      options={this.state.listPaymentTypes} //typePaymentsBankBySelect
                      size="tiny"
                    />
                      </Form.Field>*/}
                </Form.Group>
                {this.state.showMessageRecomende === true && massageRecomended}
                <DinamicForm
                  field={this.state.fields}
                  setData={this.handleField.bind(this)}
                  selectDataAccount={this.selectDataAccount.bind(this)}
                  selectDataCredit={this.selectDataCredit.bind(this)}
                  operation="buy"
                  source="profile"
                  setSpecialValue={this.handleSpecial.bind(this)}
                  creditCard={this.state.hasCreditCard}
                />
                <Divider hidden />
                {message} <br />
                <Form.Group>
                  {!this.state.getresult && (
                    <Form.Field>
                      <Form.Button
                        type="submit"
                        color="blue"
                        style={
                          isMobile
                            ? {
                                borderRadius: "40px/40px",
                                height: "50px",
                                width: "200px",
                                marginTop: 20,
                              }
                            : {}
                        }
                      >
                        {t("profile.addAccount.buttonAdd")}
                      </Form.Button>
                    </Form.Field>
                  )}
                  {!this.state.getresult && !this.props.addAccount && (
                    <Form.Field>
                      <Button
                        color="blue"
                        onClick={this.handleCancel.bind(this)}
                        style={
                          isMobile
                            ? {
                                borderRadius: "40px/40px",
                                height: "50px",
                                width: "200px",
                                marginTop: 20,
                              }
                            : {}
                        }
                      >
                        {t("profile.addAccount.buttonBack")}
                      </Button>
                    </Form.Field>
                  )}
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column
              largeScreen={5}
              computer={5}
              tablet={5}
              mobile={null}
            />
          </Grid>
        )}
      </div>
    );
  }
}
export default translate(AddOwnAccount);
