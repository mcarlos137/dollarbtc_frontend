import React, { Component } from "react";
import "./AddAcount.css";
import user from "../../../services/user";
import otc from "../../../services/otc";
import paymentApi from "../../../services/payment";
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
  Input,
  Label,
} from "semantic-ui-react";
import currency from "../../../common/currency";
import DinamicForm from "../../DinamicForm/DinamicForm";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";

class AddAcount extends Component {
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
      idHolder: "",
      nameHolder: "",
      accountNumber: "",
      imgCountry: "",
      country: "",
      bank: "",
      formAdd: Math.random(),
      list: [],
      banks: [],
      paymentBody: [],
      fields: [],
      payment: "",
      paymentName: "",
      clientPaymenType: {},
      paymentTypeBody: "",
      listCountrysView: [],
      getresult: false,
      listCountrys: [],
      currencies: [],
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
      emailReceiver: "",
      errorEmailReceiver: false,
      messageErrorReceiver: "",
      translator: props.translate,
      specialValue: false,
      paymentsUserForCurrency: [],
      showMessageRecomende: false,
      hasCreditCard: {},
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    let resp;
    let keys = [];
    this.setState({ formLoad: true });
    this.getTypePayments();
    resp = otc.getCurrencies();
    resp
      .then((r) => {
        this.setState({ formLoad: false });
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
        //console.log(error);
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
        // //console.log(resp.data);
        this.setState({ paymentsUserForCurrency: resp.data });
      })
      .catch((error) => {
        this.setState({ paymentsUserForCurrency: [] });
        //console.log(error);
      });
  }
  handleCountry(e, data) {
    this.setState({ showMessageRecomende: false });
    this.getPaymentUser(data.value);
    let array = [];
    let payments = this.state.list.find(function (ele) {
      return data.value === ele.shortName;
    });
    this.groupPaymentTypesByCurrency(payments);
    let paymentdata = this.state.currencies.find(function (ele) {
      return data.value === ele.value;
    });

    for (let value of payments.clientPaymentTypes) {
      let has;
      has = this.constantPaymentsTypes.has(value.name);
      if (has) {
        array.push({
          text: this.constantPaymentsTypes.get(value.name),
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
        if (
          payment.allowToAddPayment === true &&
          payment.name !== "CREDIT_CARD"
        ) {
          for (let field of payment.fields) {
            let ob = {};
            let fieldExist = fields.find(function (element) {
              return element.name === field.name;
            });
            if (fieldExist === undefined) {
              if (field.client !== undefined) {
                if (field.values !== undefined) {
                  if (payment.name === "TRANSFER_WITH_SPECIFIC_BANK") {
                    this.setState({ showMessageRecomende: true });
                    field.values = field.values.map(function (element) {
                      return element + "**";
                    });
                  }
                  ob.name = field.name;
                  ob.values = field.values;
                  ob.client = field.client;
                  ob.required = field.required;
                  fields.push(ob);
                } else {
                  ob.name = field.name;
                  ob.client = field.client;
                  ob.required = field.required;
                  fields.push(ob);
                }
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
  handleField(e, data) {
    if (data.value.toString().includes("**")) {
      data.value = data.value.split("**")[0];
    }
    let oj = {
      [data.name]: data.value,
    };

    this.setState({ paymentBody: [...this.state.paymentBody, oj] });
  }
  handleEmailReceiver(e, data) {
    //  //console.log(data);
    this.setState({ emailReceiver: data.value });
  }
  handleNewAcount(e) {
    e.preventDefault();
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let pay = {};
    let body = {};
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
    //  //console.log(pay);
    let auxPaymentType = this.state.listPaymentTypes.filter(
      (p) => p.value.name === "CREDIT_CARD"
    );
    if (this.state.specialValue) {
      body = {
        userName: user.getUserName(),
        currency: this.state.country,
        bankLogin: pay.bankLogin,
        bankPassword: pay.bankPassword,
        paymentBank: pay.bank,
        paymentType: this.state.payment,
      };
      //  //console.log(body);
      this.setState({ formLoad: true });
      paymentApi
        .createExternalPaymentMethod(body)
        .then((resp) => {
          //  //console.log(resp);
          this.setState({
            formLoad: false,
            formAdd: Math.random(),
            getresult: true,
          });
          let keysResp = Object.keys(resp.data);
          if (keysResp.length > 0) {
            if (this.state.paymentsUserForCurrency.length > 0) {
              let paymentExist = this.state.paymentsUserForCurrency.find(
                function (element) {
                  return element.id === resp.data.id;
                }
              );
              if (paymentExist === undefined) {
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
                  emailReceiver: "",
                });
              } else {
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
                emailReceiver: "",
              });
            }
          } else {
            this.setState({
              viewMessage: true,
              textMessage:
                "profile.addAccount.messages.errorExternalPaymentCreate",
              payment: "",
              formLoad: false,
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
              getresult: true,
              emailReceiver: "",
            });
            setTimeout(() => {
              this.setState({ viewMessage: false, textMessage: "" });
              //this.handleCancel();
            }, 5000);
          }
        })
        .catch((error) => {
          //  //console.log(error);
          this.setState({
            viewMessage: true,
            textMessage: "profile.addAccount.messages.errorServer",
            payment: "",
            formLoad: false,
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
            getresult: true,
            emailReceiver: "",
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
            //this.handleCancel();
          }, 5000);
        });
    } else {
      if (this.state.emailReceiver !== "") {
        if (regex.test(this.state.emailReceiver)) {
          pay.messages = this.state.messagesBody;
          pay.type = this.state.payment;
          pay.automaticCharge = this.state.automatic;
          pay.emailReceiver = this.state.emailReceiver;
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
          //console.log(pay);
          otc
            .addPayment(body)
            .then((resp) => {
              // //console.log(resp);
              this.setState({
                formLoad: false,
                formAdd: Math.random(),
                getresult: true,
              });
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
                emailReceiver: "",
                hasCreditCard: {},
              });
              setTimeout(() => {
                this.setState({ viewMessage: false, textMessage: "" });
                //this.handleCancel();
                if (this.props.addAccount) {
                  this.props.changeStatusForm("THIRD");
                }
              }, 5000);
            })
            .catch((error) => {
              //console.log(error);
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
                getresult: true,
                emailReceiver: "",
                formLoad: false,
                hasCreditCard: {},
              });
              setTimeout(() => {
                this.setState({ viewMessage: false, textMessage: "" });
                //this.handleCancel();
              }, 5000);
            });
        } else {
          this.setState({
            messageEmailReceiver:
              "profile.addAccount.messages.errorEmailReceiverWrong",
            errorEmailReceiver: true,
          });
          setTimeout(() => {
            this.setState({
              messageEmailReceiver: "",
              errorEmailReceiver: false,
            });
          }, 4000);
        }
      } else {
        this.setState({
          messageEmailReceiver:
            "profile.addAccount.messages.errorEmailReceiverEmpty",
          errorEmailReceiver: true,
        });
        setTimeout(() => {
          this.setState({
            messageEmailReceiver: "",
            errorEmailReceiver: false,
          });
        }, 4000);
      }
    }
  }
  handleCancel() {
    //   //console.log(this.props);
    if (!this.props.addAccount) {
      this.props.changeItem("list-other");
      this.props.changeItemTwo("optionCurren");
    } else {
      this.props.backForm("OWN");
    }
  }
  handleSpecial(value) {
    this.setState({ specialValue: value });
  }
  render() {
    let t = this.state.translator;
    let list = this.state.currencies;
    let message, errorEmail;
    if (this.state.viewMessage) {
      message = (
        <Message
          info
          style={isMobile ? { width: 200 } : {}}
          content={t(this.state.textMessage)}
        />
      );
    }
    if (this.state.errorEmailReceiver) {
      errorEmail = (
        <Label
          basic
          color="red"
          pointing
          content={this.state.messageEmailReceiver}
        />
      );
    }
    let massageRecomended = (
      <Message color="green" style={isMobile ? { width: 200 } : {}}>
        <span style={{ fontWeight: "bold" }}>
          {t("sell.form.messages.recomended")}
        </span>
      </Message>
    );
    return (
      <div align="center">
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

        <Grid columns="equal">
          {isMobile && <Grid.Column mobile={2} />}
          <Grid.Column largeScreen={11} mobile={8} computer={11} tablet={11}>
            <Form
              error
              loading={this.state.formLoad}
              key={this.state.formAdd}
              onSubmit={this.handleNewAcount.bind(this)}
            >
              <Form.Group columns="equal">
                <Form.Field>
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
              </Form.Group>
              {this.state.showMessageRecomende === true && massageRecomended}
              <DinamicForm
                field={this.state.fields}
                setData={this.handleField.bind(this)}
                operation="sell"
                setSpecialValue={this.handleSpecial.bind(this)}
                creditCard={this.state.hasCreditCard}
              />
              {this.state.country !== "" && !this.state.specialValue && (
                <div>
                  <Divider hidden />
                  <Form.Group>
                    <Form.Field width={isMobile ? 16 : 8}>
                      <label
                        style={
                          isMobile
                            ? { color: "#207ef2", textAlign: "left" }
                            : { textAlign: "left" }
                        }
                      >
                        {t("profile.addAccount.emailReceiver")}
                      </label>
                      <Input
                        style={isMobile ? { width: 200 } : {}}
                        fluid
                        required
                        name="emailReceiver"
                        placeholder={t(
                          "profile.addAccount.placeholderEmailReceiver"
                        )}
                        onChange={this.handleEmailReceiver.bind(this)}
                      />
                      {errorEmail}
                    </Form.Field>
                  </Form.Group>
                </div>
              )}
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
                {(this.props.addAccount && this.state.getresult) ||
                  (this.state.getresult && (
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
                  ))}
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column largeScreen={5} computer={5} tablet={5} mobile={null} />
        </Grid>
      </div>
    );
  }
}
export default translate(AddAcount);
