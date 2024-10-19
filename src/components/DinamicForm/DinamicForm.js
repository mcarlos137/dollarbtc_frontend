import React, { Component } from "react";
import { Grid, Form, Button, Message, Input, Select } from "semantic-ui-react";
import otcAPI from "../../services/otc";
import payment from "../../services/payment";
import user from "../../services/user";
import Axios from "axios";
import config from "../../services/config";
import translate from "../../i18n/translate";
import banks from "../../common/banks";
import { isMobile } from "react-device-detect";
import NumberFormat from "react-number-format";
class DinamicForm extends Component {
  constructor(props) {
    super(props);
    const listLabel = new Map();
    listLabel.set("bank", "dynamicForm.labels.bank");
    listLabel.set("accountNumber", "dynamicForm.labels.accountNumber");
    listLabel.set("accountHolderName", "dynamicForm.labels.accountHolderName");
    listLabel.set("accountInterbankCode", "dynamicForm.labels.accountInterbankCode");
    listLabel.set("accountHolderPhone", "dynamicForm.labels.accountHolderPhone");
    listLabel.set("accountHolderId", "dynamicForm.labels.accountHolderId");
    listLabel.set("accountType", "dynamicForm.labels.accountType");
    listLabel.set("bankLogin", "dynamicForm.labels.bankLogin");
    listLabel.set("bankPassword", "dynamicForm.labels.bankPassword");
    listLabel.set("options", "dynamicForm.labels.optionsSelect");
    listLabel.set("accountWireNumber", "dynamicForm.labels.accountWireNumber");
    listLabel.set("cardType", "dynamicForm.labels.cardType");
    listLabel.set("cardNumber", "dynamicForm.labels.cardNumber");
    listLabel.set("cardHolderName", "dynamicForm.labels.cardHolderName");
    listLabel.set("expDate", "dynamicForm.labels.expDate");
    listLabel.set("csc", "dynamicForm.labels.csc");
    listLabel.set("zipCode", "dynamicForm.labels.zipCode");
    listLabel.set("accountAddress", "dynamicForm.labels.accountAddress");
    listLabel.set("accountZip", "dynamicForm.labels.accountZip");
    listLabel.set("bankRoutingNumber", "dynamicForm.labels.bankRoutingNumber");
    listLabel.set("bankSwiftCode", "dynamicForm.labels.bankSwiftCode");
    listLabel.set(
      "accountWireRoutingNumber",
      "dynamicForm.labels.accountWireRoutingNumber"
    );
    this.state = {
      values: [
        {
          key: "default",
          value: "default",
          text: this.props.translate("dynamicForm.labels.optionsTextOne"),
        },
        {
          key: "special",
          value: "special",
          text: this.props.translate("dynamicForm.labels.optionsTextTwo"),
        },
      ],
      specialValue: false,
      listLabel: listLabel,
      valueSelect: "default",
      fields: [],
      loading: false,
      accountHolderNameByDefault:
        sessionStorage.getItem("firstName") !== "null" &&
        sessionStorage.getItem("firstName") !== null &&
        sessionStorage.getItem("firstName") !== "" &&
        sessionStorage.getItem("firstName") !== " "
          ? sessionStorage.getItem("firstName") +
            " " +
            sessionStorage.getItem("lastName")
          : "",
      translator: props.translate,
      viewMessageErrorExternal: false,
      message: "",
      paymentsUser: [],
      color: "",
      result: false,
      containsCreditCard: false,
      fieldsCreditCard: [],
      fieldsOthers: [],
      valuesTypes: [
        {
          key: "credit_card",
          value: "credit_card",
          text: this.props.translate("dynamicForm.labels.creditCard"),
        },
        {
          key: "account",
          value: "account",
          text: this.props.translate("dynamicForm.labels.bankAccount"),
        },
      ],
    };
    this.getInfoUser = this.getInfoUser.bind(this);
    this.fixFields = this.fixFields.bind(this);
    this.limit = this.limit.bind(this);
    this.cardExpiry = this.cardExpiry.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.field !== nextProps.field) {
      this.setState({ specialValue: false, valueSelect: "default" });
    }
    this.fixFields();
    if (this.props.language !== nextProps.language) {
      this.setState((state) => {
        const values = state.values.map((item, index) => {
          if (index === 0) {
            return (item.text = nextProps.translate(
              "dynamicForm.labels.optionsTextOne"
            ));
          } else {
            return (item.text = nextProps.translate(
              "dynamicForm.labels.optionsTextTwo"
            ));
          }
        });
        return values;
      });
      this.setState((state) => {
        const valuesTypes = state.valuesTypes.map((item, index) => {
          if (index === 0) {
            return (item.text = nextProps.translate(
              "dynamicForm.labels.creditCard"
            ));
          } else {
            return (item.text = nextProps.translate(
              "dynamicForm.labels.bankAccount"
            ));
          }
        });
        return valuesTypes;
      });
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  getInfoUser() {
    let username = user.getUserName();
    user.getConfigUserGeneral(username).then((resp) => {
      let data = user.getActualUserInfo(resp.data.result);
      if (
        data.firstName !== "" &&
        data.firstName !== undefined &&
        data.firstName !== null
      ) {
        this.setState({
          accountHolderNameByDefault: data.firstName + " " + data.lastName,
        });
      } else {
        this.setState({
          accountHolderNameByDefault: "",
        });
      }
    });
  }
  componentWillMount() {
    this.getInfoUser();
  }
  componentDidMount() {
    this.fixFields();
  }
  fixFields() {
    let aux = this.props.field.filter((value) => value.name === "cardType");
    let hasCreditCard = this.props.creditCard;
    let fields = this.props.field;
    if (hasCreditCard !== undefined && fields !== undefined) {
      if (hasCreditCard.isCreditCard) {
        let fieldsCreditCard = hasCreditCard.fields;
        fieldsCreditCard = fields.filter((value) => {
          return fieldsCreditCard.find((f) => f.name === value.name);
        });
        let fieldsOthers = fields.filter((value) => {
          return (
            fieldsCreditCard.filter((fcc) => {
              return value.name === fcc.name;
            }).length === 0 || value.name === "bank"
          );
        });
        this.setState({
          fieldsCreditCard: hasCreditCard.fields,
          fieldsOthers: fields,
          containsCreditCard: true,
        });
      } else {
        let c = false;
        if (aux.length > 0) {
          c = true;
        }
        this.setState({ fields: this.props.field, containsCreditCard: c });
      }
    } else {
      let c = false;
      if (aux.length > 0) {
        c = true;
      }
      this.setState({ fields: this.props.field, containsCreditCard: c });
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  sendPaymentToVerify() {
    if (this.props.operation === "buy") {
      this.setState({
        loading: false,
      });
      let bodyClientPayment = {};
      let clientPaymentObject = {};
      for (let value of this.props.paymentBody) {
        Object.entries(value).forEach(([key, val]) => {
          Object.defineProperty(clientPaymentObject, key, {
            value: val,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        });
      }

      if (this.state.specialValue) {
        bodyClientPayment = {
          userName: sessionStorage.getItem("username"),
          currency: this.props.currencyLabelSelected,
          bankLogin: clientPaymentObject.bankLogin,
          bankPassword: clientPaymentObject.bankPassword,
          paymentBank: clientPaymentObject.bank,
          paymentType: this.props.typePaymentSeleted,
        };

        this.setState({ loading: true });
        payment
          .createExternalPaymentMethod(bodyClientPayment)
          .then((resp) => {
            let keysResp = Object.keys(resp.data);
            if (keysResp.length > 0) {
              if (this.props.paymentsUser.length > 0) {
                let paymentExist = this.props.paymentsUser.find(function (
                  element
                ) {
                  return element.id === resp.data.id;
                });

                if (paymentExist === undefined) {
                  this.setState({ loading: false });

                  this.setState({
                    viewMessageErrorExternal: true,
                    message: "profile.addAccount.messages.addAccountSuccess",
                    loading: false,
                    color: "blue",
                    result: true,
                  });
                  setTimeout(() => {
                    this.setState({
                      viewMessageErrorExternal: false,
                      message: "",
                      loading: false,
                      color: "",
                    });
                    this.props.setClientPayment(resp.data);
                  }, 3500);
                } else {
                  this.setState({
                    viewMessageErrorExternal: true,
                    message:
                      "profile.addAccount.messages.errorExistExternalPayment",
                    loading: false,
                    color: "red",
                    result: false,
                  });
                  setTimeout(() => {
                    this.setState({
                      viewMessageErrorExternal: false,
                      message: "",
                      loading: false,
                    });
                  }, 6000);
                }
              } else {
                this.setState({ loading: false });
                this.props.setClientPayment(resp.data);
              }
            } else {
              this.setState({
                viewMessageErrorExternal: true,
                message:
                  "profile.addAccount.messages.errorExternalPaymentCreate",
                loading: false,
                color: "red",
                result: false,
              });
              setTimeout(() => {
                this.setState({
                  viewMessageErrorExternal: false,
                  message: "",
                  loading: false,
                });
              }, 6000);
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            this.setState({
              viewMessageErrorExternal: true,
              message: "profile.addAccount.messages.errorExternalPaymentCreate",
              loading: false,
              color: "red",
            });
            setTimeout(() => {
              this.setState({
                viewMessageErrorExternal: false,
                message: "",
                loading: false,
              });
            }, 6000);
            ////console.log(error);
          });
      } else {
        clientPaymentObject.accountHolderName = this.state.accountHolderNameByDefault;
        clientPaymentObject.automaticCharge = this.props.clientPaymentTypeSelected.automaticCharge;
        clientPaymentObject.messages = this.props.clientPaymentTypeSelected.messages;
        clientPaymentObject.type = this.props.clientPaymentTypeSelected.name;
        clientPaymentObject.verified = false;

        if (
          clientPaymentObject.bank === undefined ||
          clientPaymentObject.bank === null ||
          clientPaymentObject.bank === ""
        ) {
          this.setState({
            viewMessageErrorExternal: true,
            message: "sell.form.errors.incompleteData",
          });
          setTimeout(() => {
            this.setState({
              viewMessageErrorExternal: false,
              message: "",
            });
          }, 6000);
        } else {
          bodyClientPayment = {
            userName: sessionStorage.getItem("username"),
            currency: this.props.currencyLabelSelected,
            payment: clientPaymentObject,
          };

          otcAPI
            .addPayment(bodyClientPayment)
            .then((idPaymentVerification) => {
              if (this.state.containsCreditCard) {
                clientPaymentObject.id = idPaymentVerification.data;
                this.props.setClientPayment(clientPaymentObject);
              }
              this.addPaymentToConfigUser(idPaymentVerification.data);
            })
            .catch((error) => {});
        }
      }
    }
  }

  async addPaymentToConfigUser(paymentId) {
    try {
      let body = {
        userName: window.sessionStorage.getItem("username"),
        fieldName: "paymentId__" + paymentId,
        fieldValue: paymentId,
      };
      const response = await user.addDataUserAsync(body);
      if (response.data === "OK") {
        this.initVerification(body.fieldName);
      }
    } catch (error) {
      //console.log(error);
    }
  }

  initVerification(fieldName) {
    let body = {
      userName: window.sessionStorage.getItem("username"),
      fieldNames: [fieldName],
      userVerificationType: "D",
      info: "Verification payment from client",
    };

    // Axios
    let url = user.verifyUserRequestCore(body);
    url.then((rep) => {
      if (rep.data === "OK") {
        setTimeout(() => {
          this.setState({
            loading: false,
          });
          this.props.handleToUpdate();
        }, 4000);
      }
    });
  }
  returnValues(key, data) {
    let arra = [];
    if (!this.props.joinFieldValue) {
      for (let value of data) {
        arra.push({ key: value, value: value, text: value });
      }
    } else {
      if (key === "bank") {
        arra.push({
          key: this.props.dollarBTCPaymentSelected.bank,
          value: this.props.dollarBTCPaymentSelected.bank,
          text: this.props.dollarBTCPaymentSelected.bank,
        });
      } else {
        for (let value of data) {
          arra.push({ key: value, value: value, text: value });
        }
      }
    }

    return arra;
  }
  onChangeSelect(e, data) {
    if (data.name === "bank" && this.props.operation !== "sell") {
      let bank = banks.banks.find(function (element) {
        return data.value === element.name;
      });
      if (bank !== undefined && bank !== "" && bank !== null) {
        if (bank.activeCredentials) {
          this.props.setSpecialValue(true);
          this.props.setData(e, data);
          this.setState({ specialValue: true });
        } else {
          this.props.setSpecialValue(false);
          this.props.setData(e, data);
          this.setState({ specialValue: false });
        }
      } else {
        this.props.setSpecialValue(false);
        this.props.setData(e, data);
        this.setState({ specialValue: false });
      }
    } else if (data.name === "bank" && this.props.operation === "sell") {
      let bank = banks.banks.find(function (element) {
        return data.value === element.name;
      });
      if (bank !== undefined) {
        if (bank.activeCredentials) {
          this.props.setSpecialValue(true);
          this.props.setData(e, data);
          this.setState({ specialValue: true, valueSelect: "" });
        } else {
          this.props.setSpecialValue(false);
          this.props.setData(e, data);
          this.setState({ specialValue: false, valueSelect: "default" });
        }
      } else {
        this.props.setSpecialValue(false);
        this.props.setData(e, data);
        this.setState({ specialValue: false, valueSelect: "default" });
      }

      this.props.setData(e, data);
    } else {
      this.props.setData(e, data);
    }
  }
  onSelecType(e, data) {
    this.setState({ valueSelect: data.value });
    if (data.value === "default") {
      this.props.setSpecialValue(false);
    } else {
      this.props.setSpecialValue(true);
    }
  }
  onChangeSelectTypePayment(e, data) {
    if (data.value === "credit_card") {
      this.props.selectDataCredit();

      this.setState({
        fields: this.state.fieldsCreditCard,
      });
    } else {
      this.props.selectDataAccount();
      this.setState({
        fields: this.state.fieldsOthers,
      });
    }
  }
  limit(val, max) {
    if (val.length === 1 && val[0] > max[0]) {
      val = "0" + val;
    }

    if (val.length === 2) {
      if (Number(val) === 0) {
        val = "01";

        //this can happen when user paste number
      } else if (val > max) {
        val = max;
      }
    }

    return val;
  }

  cardExpiry(val) {
    let month = this.limit(val.substring(0, 2), "12");
    let year = val.substring(2, 4);

    return month + (year.length ? "/" + year : "");
  }
  render() {
    let t = this.state.translator;
    return (
      <Form
        loading={this.state.loading}
        onSubmit={this.sendPaymentToVerify.bind(this)}
      >
        <Grid columns={isMobile ? 1 : 2}>
          {this.state.containsCreditCard &&
            (this.props.operation !== "buy" ||
              this.props.source === "profile") && (
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <div>
                  <label
                    style={
                      isMobile
                        ? {
                            color: "#207ef2",
                            fontSize: "bold",
                            textAlign: "left",
                          }
                        : { textAlign: "left" }
                    }
                  >
                    <strong>
                      {t("dynamicForm.labels.placeholderTypePayment")}
                    </strong>
                  </label>
                  <Form.Select
                    list="list"
                    options={this.state.valuesTypes}
                    placeholder={t("dynamicForm.labels.placeholderTypePayment")}
                    onChange={this.onChangeSelectTypePayment.bind(this)}
                    // label={t("dynamicForm.labels.placeholderTypePayment")}
                  />
                </div>
              </Grid.Column>
            )}
          {this.state.fields.map((item) => {
            if (
              item.values === undefined &&
              this.props.operation === "buy" &&
              !this.state.specialValue &&
              item.client === true
            ) {
              return (
                <Grid.Column
                  largeScreen={8}
                  mobile={16}
                  tablet={8}
                  computer={8}
                >
                  {!this.state.specialValue &&
                    item.name === "accountHolderName" &&
                    item.client === true && (
                      <Form.Field
                        required={item.required === true ? true : false}
                      >
                        <label
                          style={
                            isMobile
                              ? { color: "#207ef2", textAlign: "left" }
                              : { textAlign: "left" }
                          }
                        >
                          {this.state.listLabel.has(item.name)
                            ? t(this.state.listLabel.get(item.name))
                            : this.capitalizeFirstLetter(item.name)}
                        </label>
                        {this.state.accountHolderNameByDefault !== "" && (
                          <Input
                            className="FormInput"
                            required={item.required === true ? true : false}
                            name={item.name}
                            onChange={this.props.setData}
                            value={this.state.accountHolderNameByDefault}
                            disabled={
                              this.state.accountHolderNameByDefault !== ""
                            }
                          />
                        )}
                        {this.state.accountHolderNameByDefault === "" && (
                          <div>
                            <Input
                              className="FormInput"
                              required={item.required === true ? true : false}
                              name={item.name}
                              onChange={this.props.setData}
                            />
                            {/* <label>{t("dynamicForm.labels.remember")}</label> */}
                          </div>
                        )}
                      </Form.Field>
                    )}
                  {!this.state.specialValue &&
                    item.name !== "accountHolderName" &&
                    item.name !== "expDate" &&
                    item.client === true && (
                      <Form.Field
                        required={item.required === true ? true : false}
                      >
                        <label
                          style={
                            isMobile
                              ? { color: "#207ef2", textAlign: "left" }
                              : { textAlign: "left" }
                          }
                        >
                          {this.state.listLabel.has(item.name)
                            ? t(this.state.listLabel.get(item.name))
                            : this.capitalizeFirstLetter(item.name)}
                        </label>
                        <Input
                          style={
                            isMobile ? { width: 200, textAlign: "left" } : {}
                          }
                          required
                          name={item.name}
                          onChange={this.props.setData}
                        />
                      </Form.Field>
                    )}
                  {!this.state.specialValue &&
                    item.name === "expDate" &&
                    item.client === true && (
                      <Form.Field
                        required={item.required === true ? true : false}
                      >
                        <label style={isMobile ? { color: "#207ef2" } : {}}>
                          {this.state.listLabel.has(item.name)
                            ? t(this.state.listLabel.get(item.name))
                            : this.capitalizeFirstLetter(item.name)}
                        </label>

                        <NumberFormat
                          style={
                            isMobile
                              ? { width: 200, textAlign: "left" }
                              : { textAlign: "left" }
                          }
                          required={item.required === true ? true : false}
                          format={this.cardExpiry}
                          name={item.name}
                          type="text"
                          onValueChange={(values) => {
                            let data = {
                              name: item.name,
                              value: values.formattedValue,
                            };
                            this.props.setData(null, data);
                          }}
                          placeholder="MM/YY"
                        />
                      </Form.Field>
                    )}
                </Grid.Column>
              );
            }
            if (
              item.values === undefined &&
              this.state.valueSelect === "default" &&
              this.props.operation === "sell" &&
              item.client === true
            ) {
              return (
                <Grid.Column
                  largeScreen={8}
                  mobile={16}
                  tablet={8}
                  computer={8}
                >
                  <Form.Field required={item.required === true ? true : false}>
                    <label
                      style={
                        isMobile
                          ? { color: "#207ef2", textAlign: "left" }
                          : { textAlign: "left" }
                      }
                    >
                      {this.state.listLabel.has(item.name)
                        ? t(this.state.listLabel.get(item.name))
                        : this.capitalizeFirstLetter(item.name)}
                    </label>
                    <Input
                      style={isMobile ? { width: 200, textAlign: "left" } : {}}
                      required={item.required === true ? true : false}
                      name={item.name}
                      onChange={this.props.setData}
                    />
                  </Form.Field>
                </Grid.Column>
              );
            }
            if (item.values !== undefined) {
              if (
                item.name !== "bank" &&
                item.client === true &&
                this.props.operation === "sell" &&
                this.state.valueSelect === "default"
              ) {
                return (
                  <Grid.Column
                    largeScreen={8}
                    mobile={16}
                    tablet={8}
                    computer={8}
                  >
                    <Form.Field
                      required={item.required === true ? true : false}
                    >
                      <label
                        style={
                          isMobile
                            ? { color: "#207ef2", textAlign: "left" }
                            : { textAlign: "left" }
                        }
                      >
                        {this.state.listLabel.has(item.name)
                          ? t(this.state.listLabel.get(item.name))
                          : this.capitalizeFirstLetter(item.name)}
                      </label>
                      <Select
                        list="list"
                        required={item.required === true ? true : false}
                        // style={isMobile ? { color: "#207ef2",textAlign:"center" } : {}}
                        options={this.returnValues(item.name, item.values)}
                        name={item.name}
                        placeholder={t("dynamicForm.placeholderOption")}
                        onChange={this.onChangeSelect.bind(this)}
                      />
                    </Form.Field>
                  </Grid.Column>
                );
              } else if (
                !this.state.specialValue &&
                item.name !== "bank" &&
                item.client === true &&
                this.props.operation !== "sell"
              ) {
                return (
                  <Grid.Column
                    largeScreen={8}
                    mobile={16}
                    tablet={8}
                    computer={8}
                  >
                    <Form.Field
                      required={item.required === true ? true : false}
                    >
                      <label
                        style={
                          isMobile
                            ? { color: "#207ef2", textAlign: "left" }
                            : {}
                        }
                      >
                        {this.state.listLabel.has(item.name)
                          ? t(this.state.listLabel.get(item.name))
                          : this.capitalizeFirstLetter(item.name)}
                      </label>
                      <Select
                        list="list"
                        required={item.required === true ? true : false}
                        // style={isMobile ? { color: "#207ef2",textAlign:"left" } : {}}
                        options={this.returnValues(item.name, item.values)}
                        name={item.name}
                        placeholder={t("dynamicForm.placeholderOption")}
                        onChange={this.onChangeSelect.bind(this)}
                      />
                    </Form.Field>
                  </Grid.Column>
                );
              }
              if (item.name === "bank" && item.client === true) {
                return (
                  <Grid.Column
                    largeScreen={8}
                    mobile={16}
                    tablet={8}
                    computer={8}
                  >
                    <Form.Field required>
                      <label
                        style={
                          isMobile
                            ? { color: "#207ef2", textAlign: "left" }
                            : { textAlign: "left" }
                        }
                      >
                        {this.state.listLabel.has(item.name)
                          ? t(this.state.listLabel.get(item.name))
                          : this.capitalizeFirstLetter(item.name)}
                      </label>
                      <Form.Select
                        list="list"
                        required
                        // style={isMobile ? { color: "#207ef2",textAlign:"left" } : {}}
                        options={this.returnValues(item.name, item.values)}
                        name={item.name}
                        placeholder={t("dynamicForm.placeholderOption")}
                        onChange={this.onChangeSelect.bind(this)}
                      />
                    </Form.Field>
                  </Grid.Column>
                );
              }
            }
          })}
          {this.props.operation === "sell" && this.state.specialValue && (
            <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
              <Form.Field required>
                <label
                  style={
                    isMobile
                      ? { color: "#207ef2", textAlign: "left" }
                      : { textAlign: "left" }
                  }
                >
                  {this.state.listLabel.has("options")
                    ? t(this.state.listLabel.get("options"))
                    : this.capitalizeFirstLetter("options")}
                </label>
                <Select
                  list="list"
                  required
                  // style={isMobile ? { color: "#207ef2",textAlign:"left" } : {}}
                  options={this.state.values}
                  placeholder={t("dynamicForm.placeholderOption")}
                  onChange={this.onSelecType.bind(this)}
                />
              </Form.Field>
            </Grid.Column>
          )}
          {this.state.valueSelect === "special" &&
            this.props.operation === "sell" && (
              <Grid>
                <Grid.Column
                  largeScreen={11}
                  mobile={16}
                  tablet={11}
                  computer={11}
                >
                  <Form.Field required>
                    <label style={isMobile ? { color: "#207ef2" } : {}}>
                      {this.state.listLabel.has("bankLogin")
                        ? t(this.state.listLabel.get("bankLogin"))
                        : this.capitalizeFirstLetter("bankLogin")}
                    </label>
                    <Input
                      style={isMobile ? { width: 200, textAlign: "left" } : {}}
                      required
                      name="bankLogin"
                      onChange={this.props.setData}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column
                  largeScreen={11}
                  mobile={16}
                  tablet={11}
                  computer={11}
                >
                  <Form.Field required>
                    <label style={isMobile ? { color: "#207ef2" } : {}}>
                      {this.state.listLabel.has("bankPassword")
                        ? t(this.state.listLabel.get("bankPassword"))
                        : this.capitalizeFirstLetter("bankPassword")}
                    </label>
                    <Input
                      required
                      type="password"
                      name="bankPassword"
                      onChange={this.props.setData}
                      style={isMobile ? { width: 200, textAlign: "left" } : {}}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid>
            )}
          {this.state.specialValue && this.props.operation === "buy" && (
            <Grid>
              <Grid.Column
                largeScreen={11}
                mobile={16}
                tablet={11}
                computer={11}
              >
                <Form.Field required>
                  <label style={isMobile ? { color: "#207ef2" } : {}}>
                    {this.state.listLabel.has("bankLogin")
                      ? t(this.state.listLabel.get("bankLogin"))
                      : this.capitalizeFirstLetter("bankLogin")}
                  </label>
                  <Input
                    required
                    // style={isMobile ? { color: "#207ef2" } : {}}
                    name="bankLogin"
                    onChange={this.props.setData}
                    style={
                      isMobile
                        ? { color: "#207ef2", width: 200, textAlign: "left" }
                        : {}
                    }
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column
                largeScreen={11}
                mobile={16}
                tablet={11}
                computer={11}
              >
                <Form.Field required>
                  <label style={isMobile ? { color: "#207ef2" } : {}}>
                    {this.state.listLabel.has("bankPassword")
                      ? t(this.state.listLabel.get("bankPassword"))
                      : this.capitalizeFirstLetter("bankPassword")}
                  </label>
                  <Input
                    name="bankPassword"
                    type="password"
                    onChange={this.props.setData}
                    style={
                      isMobile
                        ? { color: "#207ef2", width: 200, textAlign: "left" }
                        : {}
                    }
                  />
                </Form.Field>
              </Grid.Column>
            </Grid>
          )}
        </Grid>
        {this.state.viewMessageErrorExternal && (
          <Grid colums={1}>
            <Grid.Column largeScreen={16} mobile={16} tablet={16} computer={16}>
              <Message
                color={this.state.color}
                content={t(this.state.message)}
              />
            </Grid.Column>
          </Grid>
        )}
        {this.props.operation === "buy" &&
          this.props.source === undefined &&
          sessionStorage.getItem("auth") === "true" && (
            <div>
              <br />
              {!this.state.result && (
                <Button type="submit" color="blue" floated={"right"}>
                  {!this.state.specialValue && t("dynamicForm.buttonVerify")}
                  {this.state.specialValue && t("dynamicForm.buttonAdd")}
                </Button>
              )}
            </div>
          )}
      </Form>
    );
  }
}

export default translate(DinamicForm);
