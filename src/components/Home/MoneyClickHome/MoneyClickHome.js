import React, { Component } from "react";
import {
  Grid,
  Segment,
  Button,
  Divider,
  Image,
  Header,
  Modal,
  Form,
  Select,
  Label,
  Input,
  Container,
  Message,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import translate from "../../../i18n/translate";
import logoMC from "../../../img/logoNuevoMC2.png";
import fondoMC from "../../../img/banner-moneyclick.png";
import fondoMCTablet from "../../../img/background-moneyclick.jpg";
import playstore from "../../../img/playStore.png";
import appstore from "../../../img/appStore.png";
import RetailService from "../../../services/moneyclick";
import user from "../../../services/user";
import "../../Moneyclick/Moneyclick.css";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";

class MoneyClickHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      changeModalOpen: false,
      balanceBtc: "",
      balanceMoneyClick: "",
      typeTransfer: "",
      confirmMessage: "",
      typeExchangeSelectedNew: "",
      amountDollarBTC: "",
      amountMoneyClick: "",
      userMoneyClick: false,
      show: false,
      balanceOtherCurrenciesColOne: [],
      balanceOtherCurrenciesColTwo: [],
      openSendConfirmMoneyClick: false,
      openSendConfirmDollarBtc: false,
      openConfirmOperation: false,
      errorAmountCrypto: false,
      message: "",
      user: window.sessionStorage.getItem("username"),
    };
  }

  //inicio de  metodos de modal de cambio
  openChangeModal = () => this.setState({ changeModalOpen: true });
  closeChangeModal = () => {
    this.setState({
      typeExchangeSelectedNew: "",
      changeModalOpen: false,
      amountMoneyClick: "",
      amountDollarBTC: "",
    });
  };
  handleTypeExchangeToSelected(e, data) {
    this.setState({
      typeExchangeSelectedNew: data.value,
    });
  }
  //fin de  metodos de modal de cambio

  //inicio modal de Confirmacion
  aceptSendConfirmOperation = () =>
    this.setState({ openConfirmOperation: true });
  closeSendConfirmOperation = () =>
    this.setState({ openConfirmOperation: false });
  //fin modal de Confirmacion

  closeConfirmOperation = () => this.setState({ openConfirmOperation: false });

  //inicio de  valores de Transferencia
  handleChangeAmountMoneyClick(e, data) {
    let value = parseFloat(e.target.value);
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = Number(value);
    }

    this.setState({ amountMoneyClick: val });
  }
  handleChangeAmountDollarBTC(e, data) {
    let value = parseFloat(e.target.value);
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = Number(value);
    }

    this.setState({ amountDollarBTC: val });
  }
  //fin de  valores de compra o venta

  //inicio de metodo de transferencia de BTC
  transferBTC = () => {
    let username = user.getUserName();
    let amount = 0;
    let typeTransfer = "";

    if (this.state.typeExchangeSelectedNew === "Moneyclick") {
      amount = this.state.amountMoneyClick;
      typeTransfer = "TRANSFER_FROM_BALANCE_TO_MCBALANCE";
    }
    if (this.state.typeExchangeSelectedNew === "DollarBTC") {
      amount = this.state.amountDollarBTC;
      typeTransfer = "TRANSFER_FROM_MCBALANCE_TO_BALANCE";
    }

    if (
      (this.state.typeExchangeSelectedNew === "Moneyclick" &&
        amount > this.props.balanceUser.available) ||
      (this.state.typeExchangeSelectedNew === "DollarBTC" &&
        amount > this.state.balanceMoneyClick)
    ) {
      this.setState({
        errorAmountCrypto: true,
        message: "home.homeLogue.moneyClickHome.send.failmessage",
      });
      setTimeout(() => {
        this.setState({
          errorAmountCrypto: false,
          message: "",
        });
      }, 6000);
    } else {
      if (amount === 0) {
        this.setState({
          errorAmountCrypto: true,
          message: "home.homeLogue.moneyClickHome.send.failmessage2",
        });
        setTimeout(() => {
          this.setState({
            errorAmountCrypto: false,
            message: "",
          });
        }, 6000);
      } else {
        let body = {
          userName: username,
          amount: amount,
          balanceOperationType: typeTransfer,
        };

        user
          .transferBTC(body)
          .then((res) => {
            if (res.data === "OK") {
              this.setState({ confirmMessage: "OK" });
            } else {
              this.setState({ confirmMessage: "FAIL" });
            }

            this.aceptSendConfirmOperation();
            // setTimeout(() => {
            //   this.closeSendConfirmOperation();
            // }, 8000);

            if (res.data === "OK") {
              window.location.reload();
            }
          })
          .catch((error) => {
            //console.log(error);
          });
      }
    }
  };
  //fin  de metodo de transferencia de BTC

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  floorDecimals(value, numberDecimals) {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  }
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  OpenMoneyClick() {
    window.location.href = "/moneyclick";
  }
  componentDidMount() {
    this.loadUserDevices();
    this.getBalance();
    if (this.state.userMoneyClick === false) {
      this.setState({
        show: false,
      });
    }
  }
  loadUserDevices() {
    this.setState({
      show: true,
    });
    let devices = JSON.parse(window.sessionStorage.getItem("devices"));

    if (devices !== null && devices !== undefined) {
      if (devices.length > 0) {
        devices.map((device) => {
          if (
            device.source === "MONEYCLICK" ||
            device.source === "MONEYCLICK_WEB"
          ) {
            this.setState({
              userMoneyClick: true,
            });
          }
        });
      }
    }
  }
  getBalance() {
    if (this.state.user !== null) {
      this.setState({ loading: true });
      RetailService.getBalanceMoneyclick(this.state.user)
        .then((resp) => {
          let currenciesColOne = [];
          let currenciesColTwo = [];
          Object.entries(resp.data).forEach(([key, value], index) => {
            if (
              key !== "usdEstimatedBalance" &&
              key !== "btcEstimatedBalance" &&
              key !== "BTC"
            ) {
              let module = index % 2;
              let obj = {};
              obj.currency = key;
              Object.entries(value).forEach(([k, v]) => {
                if (k === "availableBalance") {
                  obj.balance = v;
                  if (module === 0) {
                    currenciesColOne.push(obj);
                    this.setState({
                      balanceOtherCurrenciesColOne: currenciesColOne,
                    });
                  } else {
                    currenciesColTwo.push(obj);
                    this.setState({
                      balanceOtherCurrenciesColTwo: currenciesColTwo,
                    });
                  }
                }
              });
            }
            if (key === "BTC") {
              Object.entries(value).forEach(([k, v]) => {
                if (k === "availableBalance") {
                  this.setState({
                    balanceMoneyClick: v,
                  });
                }
              });
            }
          });
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  render() {
    let t = this.state.translator;
    let labelAmountCryptoError, labelconfirmMessage;

    if (this.state.confirmMessage === "OK") {
      labelconfirmMessage = (
        <Message info>
          <Message.Header>
            {t("home.homeLogue.moneyClickHome.send.success")}
          </Message.Header>
          <p>{t("home.homeLogue.moneyClickHome.send.successmessage")}</p>
        </Message>
      );
    }

    if (this.state.confirmMessage === "FAIL") {
      labelconfirmMessage = (
        <Message negative>
          <Message.Header>
            {t("home.homeLogue.moneyClickHome.send.fail")}
          </Message.Header>
          <p>{t("home.homeLogue.moneyClickHome.send.failmessage")}</p>
        </Message>
      );
    }

    if (this.state.errorAmountCrypto) {
      labelAmountCryptoError = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }

    const typeExchangeEs = [
      {
        key: "Moneyclick",
        value: "Moneyclick",
        text: "Desde DollarBTC a Moneyclick",
      },
      // { key: "DollarBTC", value: "DollarBTC", text: "Desde Moneyclick a DollarBTC" }
    ];
    const typeExchangeEn = [
      {
        key: "Moneyclick",
        value: "Moneyclick",
        text: "From DollarBTC to Moneyclick",
      },
      // { key: "DollarBTC", value: "DollarBTC", text: "From Moneyclick to DollarBTC" }
    ];

    let playStore = (
      <Image src={playstore} size="small" className="logo-storeMC" />
    );
    let appStore = (
      <Image src={appstore} size="small" className="logo-storeMC" />
    );

    return (
      <div>
        {this.state.userMoneyClick === true && (
          <div>
            {this.state.balanceOtherCurrenciesColTwo.length === 0 && (
              <Dimmer active inverted>
                <Loader inverted>Cargando...</Loader>
              </Dimmer>
            )}
            {this.state.balanceOtherCurrenciesColTwo.length !== 0 && (
              <Segment
                raised
                style={{
                  backgroundColor: "#B2CED7",
                  marginTop: window.innerWidth >= 1200 ? 5 : 20,
                }}
              >
                <div align="center">
                  <Image
                    id="logomc"
                    src={logoMC}
                    alt=""
                    style={{
                      height: window.innerWidth >= 1200 ? 40 : 80,
                      marginTop: -6,
                    }}
                  />
                </div>
                <Grid style={{ marginTop: 2 }}>
                  <Grid.Row centered>
                    <Grid.Column style={{ marginLeft: -25 }}>
                      <span
                        style={{
                          fontWeight: "900",
                          color: "#3566A0",
                          fontSize: window.innerWidth >= 1200 ? 12 : 14,
                          marginLeft: window.innerWidth >= 1200 ? -20 : 0,
                        }}
                      >
                        <strong>
                          {"BTC"}
                          {":"}
                        </strong>
                      </span>
                      {this.state.balanceOtherCurrenciesColTwo.length !== 0 &&
                        this.state.balanceOtherCurrenciesColTwo.map(
                          (item, index) => (
                            <div key={index}>
                              <span
                                style={{
                                  fontWeight: "900",
                                  color: "#3566A0",
                                  fontSize: window.innerWidth >= 1200 ? 12 : 14,
                                  marginLeft:
                                    window.innerWidth >= 1200 ? -20 : 0,
                                }}
                              >
                                <strong>
                                  {item.currency}
                                  {":"}
                                </strong>
                              </span>
                            </div>
                          )
                        )}
                      {this.state.balanceOtherCurrenciesColOne.length !== 0 &&
                        this.state.balanceOtherCurrenciesColOne.map(
                          (item, index) => (
                            <div key={index}>
                              <span
                                style={{
                                  fontWeight: "900",
                                  color: "#3566A0",
                                  fontSize: window.innerWidth >= 1200 ? 12 : 14,
                                  marginLeft:
                                    window.innerWidth >= 1200 ? -20 : 0,
                                }}
                              >
                                {item.currency}
                                {":"}
                              </span>
                            </div>
                          )
                        )}
                    </Grid.Column>
                    <Grid.Column style={{ marginLeft: 20 }}>
                      <span
                        style={{
                          color: "#2F66A8 ",
                          marginLeft: "1 px",
                          fontSize: window.innerWidth >= 1200 ? 12 : 14,
                        }}
                      >
                        {this.state.balanceMoneyClick !== null
                          ? this.floorDecimals(this.state.balanceMoneyClick, 8)
                          : 0}
                      </span>
                      {this.state.balanceOtherCurrenciesColTwo.length !== 0 &&
                        this.state.balanceOtherCurrenciesColTwo.map(
                          (item, index) => (
                            <div key={index}>
                              <span
                                style={{
                                  color: "#2F66A8 ",
                                  marginLeft: "1 px",
                                  fontSize: window.innerWidth >= 1200 ? 12 : 14,
                                }}
                              >
                                {item.balance !== null
                                  ? item.balance.toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                    })
                                  : 0}
                              </span>
                            </div>
                          )
                        )}
                      {this.state.balanceOtherCurrenciesColOne.length !== 0 &&
                        this.state.balanceOtherCurrenciesColOne.map(
                          (item, index) => (
                            <div key={index}>
                              <span
                                style={{
                                  color: "#2F66A8 ",
                                  marginLeft: "1 px",
                                  fontSize: window.innerWidth >= 1200 ? 12 : 14,
                                }}
                              >
                                {item.balance !== null
                                  ? item.balance.toLocaleString("en-US", {
                                      maximumFractionDigits: 2,
                                    })
                                  : 0}
                              </span>
                            </div>
                          )
                        )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <div align="center">
                  <Button
                    style={{
                      backgroundColor: "#2F66A8 ",
                      color: "white",
                      width: "200px",
                      height: "35px",
                      marginTop: 8,
                    }}
                    onClick={this.openChangeModal}
                  >
                    {t("home.homeLogue.moneyClickHome.buttonChangeMoneyclick")}
                  </Button>
                </div>
              </Segment>
            )}
          </div>
        )}
        {this.state.userMoneyClick === false && (
          <div>
            {" "}
            {this.state.show && (
              <Dimmer active inverted>
                <Loader inverted>Cargando...</Loader>
              </Dimmer>
            )}
            {window.innerWidth > 1200 && (
              <Segment basic>
                <Image
                  src={fondoMC}
                  className="img-background"
                  style={{ marginLeft: "16px", marginTop: "-14px" }}
                />
                <Header
                  as="h3"
                  className="title-logueado"
                  style={{ marginLeft: "120px" }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group style={{ marginLeft: "100px", height: 2 }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 1200 && window.innerWidth > 991 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMCTablet}
                  className="img-background"
                  style={{ marginTop: 20, marginLeft: -15, marginRight: -40 }}
                />
                <Header
                  as="h3"
                  className="title-logueado"
                  style={{ marginLeft: "420px" }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group style={{ marginLeft: "400px" }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 991 && window.innerWidth > 556 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMCTablet}
                  className="img-background"
                  style={{ marginTop: 20, marginLeft: -15, marginRight: -40 }}
                />
                <Header
                  as="h3"
                  className="title-logueado"
                  style={{ marginLeft: "320px" }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group style={{ marginLeft: "300px" }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 556 && window.innerWidth > 450 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMCTablet}
                  className="img-background"
                  style={{ marginTop: 20, marginLeft: -15, marginRight: -40 }}
                />
                <Header
                  as="h3"
                  className="title-logueado"
                  style={{
                    marginTop: window.innerWidth >= 485 ? 80 : 80,
                    marginLeft: window.innerWidth >= 485 ? "220px" : "200px",
                  }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group
                  style={{
                    marginLeft: window.innerWidth >= 485 ? "220px" : "190px",
                  }}
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 450 && window.innerWidth > 410 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMC}
                  className="img-background"
                  style={{
                    marginTop: 20,
                    marginLeft: -15,
                    marginRight: -40,
                    width: 500,
                  }}
                />
                <Header
                  as="h2"
                  className="title-logueado"
                  style={{ marginTop: "-250px", marginLeft: "180px" }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group style={{ marginTop: 20, marginLeft: "170px" }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 410 && window.innerWidth > 321 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMC}
                  className="img-background"
                  style={{
                    marginTop: 20,
                    marginLeft: -15,
                    marginRight: -40,
                    width: 500,
                  }}
                />
                <Header
                  as="h2"
                  className="title-logueado"
                  style={{
                    marginTop: window.innerWidth >= 365 ? "-200px" : "-180px",
                    marginLeft: window.innerWidth >= 365 ? "160px" : "120px",
                  }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group
                  style={{
                    marginTop: window.innerWidth >= 365 ? 20 : 20,
                    marginLeft: window.innerWidth >= 365 ? "150px" : "110px",
                  }}
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
            {window.innerWidth <= 321 && (
              <Segment basic style={{ marginRight: -30 }}>
                <Image
                  src={fondoMC}
                  className="img-background"
                  style={{
                    marginTop: 20,
                    marginLeft: -15,
                    marginRight: -40,
                    width: 500,
                  }}
                />
                <Header
                  as="h2"
                  className="title-logueado"
                  style={{ marginTop: -180, marginLeft: "100px" }}
                >
                  {t("moneyclick.downloadMoneyclick")}
                </Header>
                <Image.Group style={{ marginTop: 30, marginLeft: "90px" }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick"
                    className="button-logueado"
                  >
                    {playStore}
                  </a>
                  <a
                    href="https://apps.apple.com/es/app/moneyclick/id1501864260"
                    className="button-logueado"
                  >
                    {appStore}
                  </a>
                </Image.Group>
              </Segment>
            )}
          </div>
        )}

        {/* ===MODAL=== */}
        <Modal
          open={this.state.changeModalOpen}
          onClose={this.closeChangeModal}
        >
          <Modal.Header>
            {t("home.homeLogue.fastchangeTitleModal")}
          </Modal.Header>
          <Divider hidden></Divider>
          {this.state.confirmMessage === "" && (
            <Grid>
              <Grid.Column width={2}></Grid.Column>
              <Grid.Column width={12}>
                <Segment basic>
                  <Container className="container-form-modal">
                    <Form
                      error={this.state.error !== ""}
                      success={this.state.success}
                      loading={this.state.loadForm}
                      unstackable
                    >
                      <Grid columns={1}>
                        <Grid.Column
                          largeScreen={16}
                          mobile={16}
                          tablet={16}
                          computer={16}
                        >
                          <Form.Field required>
                            <label>
                              {t("home.homeLogue.moneyClickHome.typeChange")}
                            </label>
                            <Select
                              placeholder={t(
                                "home.homeLogue.moneyClickHome.placeholderTypeChange"
                              )}
                              fluid
                              single
                              disabled={this.state.blockField}
                              selection
                              options={
                                this.props.language === "es"
                                  ? typeExchangeEs
                                  : typeExchangeEn
                              }
                              onChange={this.handleTypeExchangeToSelected.bind(
                                this
                              )}
                              value={this.state.typeExchangeSelectedNew}
                              selectValue={this.state.typeExchangeSelectedNew}
                              defaultValue={this.state.typeExchangeSelectedNew}
                            />
                          </Form.Field>
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew ===
                              "Moneyclick" &&
                            this.props.balanceUser !== null &&
                            this.floorDecimals(
                              this.props.balanceUser.available,
                              8
                            ) !== 0 && (
                              <div>
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.moneyClickHome.availableBalance"
                                      )}
                                    </strong>

                                    {this.props.balanceUser !== null
                                      ? " " +
                                        this.floorDecimals(
                                          this.props.balanceUser.available,
                                          8
                                        )
                                      : 0}
                                    {this.props.balanceUser !== null
                                      ? "  "
                                      : ""}
                                    {"BTC"}
                                  </span>
                                </Form.Field>
                                <Grid columns={2}>
                                  <Grid.Column
                                    largeScreen={8}
                                    mobile={16}
                                    tablet={16}
                                    computer={8}
                                  >
                                    <Form.Field required>
                                      <label>
                                        {t(
                                          "home.homeLogue.moneyClickHome.amount"
                                        )}{" "}
                                        BTC
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountMoneyClick}
                                        decimalScale={8}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "BTC"
                                        }
                                        thousandSeparator={false}
                                        allowNegative={false}
                                        onChange={this.handleChangeAmountMoneyClick.bind(
                                          this
                                        )}
                                      />
                                      {labelAmountCryptoError}
                                    </Form.Field>
                                  </Grid.Column>
                                </Grid>
                              </div>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew ===
                              "DollarBTC" &&
                            this.props.balanceUser !== null &&
                            this.floorDecimals(
                              this.state.balanceMoneyClick,
                              8
                            ) !== 0 && (
                              <div>
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.moneyClickHome.availableBalance"
                                      )}
                                    </strong>

                                    {this.state.balanceMoneyClick !== null
                                      ? " " +
                                        this.floorDecimals(
                                          this.state.balanceMoneyClick,
                                          8
                                        )
                                      : 0}
                                    {this.state.balanceMoneyClick !== null
                                      ? "  "
                                      : ""}
                                    {"BTC"}
                                  </span>
                                </Form.Field>
                                <Grid columns={2}>
                                  <Grid.Column
                                    largeScreen={8}
                                    mobile={16}
                                    tablet={16}
                                    computer={8}
                                  >
                                    <Form.Field required>
                                      <label>
                                        {t(
                                          "home.homeLogue.moneyClickHome.amount"
                                        )}{" "}
                                        BTC
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountDollarBTC}
                                        decimalScale={8}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "BTC"
                                        }
                                        thousandSeparator={false}
                                        allowNegative={false}
                                        onChange={this.handleChangeAmountDollarBTC.bind(
                                          this
                                        )}
                                      />
                                      {labelAmountCryptoError}
                                    </Form.Field>
                                  </Grid.Column>
                                </Grid>
                              </div>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew ===
                              "DollarBTC" &&
                            (this.floorDecimals(
                              this.state.balanceMoneyClick,
                              8
                            ) === 0 ||
                              this.state.balanceMoneyClick === null) && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.moneyClickHome.send.failBalanceAmount"
                                    ) +
                                      " " +
                                      "Moneyclick"}
                                  </p>
                                </Message>
                              </Form.Field>
                            )}

                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew ===
                              "Moneyclick" &&
                            (this.floorDecimals(
                              this.props.balanceUser.available,
                              8
                            ) === 0 ||
                              this.props.balanceUser === null) && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.moneyClickHome.send.failBalanceAmount"
                                    ) +
                                      " " +
                                      "DollarBTC"}
                                  </p>
                                </Message>
                              </Form.Field>
                            )}
                        </Grid.Column>
                      </Grid>
                    </Form>
                  </Container>
                </Segment>
              </Grid.Column>
              <Grid.Column width={2}></Grid.Column>
            </Grid>
          )}
          {this.state.confirmMessage !== "" && (
            <Grid>
              <Grid.Column width={2}></Grid.Column>
              <Grid.Column width={12}>{labelconfirmMessage}</Grid.Column>
              <Grid.Column width={2}></Grid.Column>
            </Grid>
          )}
          <Divider hidden></Divider>
          <Modal.Actions>
            <Button onClick={this.closeChangeModal}>
              {t("home.homeLogue.moneyClickHome.send.buttonClose")}
            </Button>
            {(this.state.typeExchangeSelectedNew === "Moneyclick" ||
              this.state.typeExchangeSelectedNew === "DollarBTC") && (
              <Button floated="right" color="blue" onClick={this.transferBTC}>
                {t("home.homeLogue.moneyClickHome.change")}
              </Button>
            )}
          </Modal.Actions>
          {/* <Modal
                  size={"mini"}
                  open={this.state.openConfirmOperation}
                  onClose={this.closeSendConfirmOperation}>
                  <Modal.Content>
                  {this.state.confirmMessage === "OK" &&(
                    <Message info>
                      <Message.Header>{t("home.homeLogue.moneyClickHome.send.success")}</Message.Header>
                      <p>{t("home.homeLogue.moneyClickHome.send.successmessage")}</p>
                    </Message>)}
                    {this.state.confirmMessage === "FAIL" &&(
                    <Message negative>
                      <Message.Header>{t("home.homeLogue.moneyClickHome.send.fail")}</Message.Header>
                      <p>{t("home.homeLogue.moneyClickHome.send.failmessage")}</p>
                    </Message>)}
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="grey" onClick={this.closeConfirmOperation}>
                    {t("home.homeLogue.moneyClickHome.send.buttonClose")}
                    </Button>
                  </Modal.Actions>
                </Modal> */}
        </Modal>
        {/* <Modal open={this.state.changeModalOpen} onClose={this.closeChangeModal}>
        <Modal.Header>{t("home.homeLogue.changeTitleModal")}</Modal.Header>
        <Divider hidden></Divider>
        <Grid >
          <Grid.Column width={2}></Grid.Column>
          <Grid.Column width={12}>
            <Grid columns="equal">
              <Segment color="orange" loading={this.state.load}>
                <Grid columns="equal">
                  <Grid.Column>
                    <Segment basic textAlign="center">
                      <Header>{t("home.homeLogue.moneyClickHome.dollarBtcToMoneyclick")}</Header>
                      <br />
                      <Grid columns="equal">
                        <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                          <Grid.Column textAlign="left">
                            <p>{t("home.homeLogue.moneyClickHome.availableBalance")} BTC</p>
                          </Grid.Column>
                          <Grid.Column textAlign="right">
                          <p style={{ color: "black",fontSize:14}}>
                              {this.props.balanceUser !== null
                                              ? this.floorDecimals(
                                                this.props.balanceUser.available,
                                                8
                                                )
                              : 0}
                            </p> 
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column
                            textAlign="left"
                            width={6}>
                            <p style={{ marginTop: 10 }}>
                              {t("home.homeLogue.moneyClickHome.amount")} BTC
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            width={5}>
                            <p>
                            <Input
                              size="small"
                              type={
                                  <NumberFormat
                                    value={this.state.amountMoneyClick}
                                    decimalScale={8}
                                    placeholder={t("home.homeLogue.moneyClickHome.amount")}
                                    thousandSeparator={false}
                                    allowNegative={false}
                                    onValueChange={values => {
                                      const { value } = values;
                                      this.handleChangeAmountMoneyClick(parseFloat(value));
                                    }}
                                  />
                                }/>
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <br />
                      {this.state.amountMoneyClick !=0 &&(
                      <Button
                        floated="right"
                        color="blue"
                        onClick={this.aceptSendConfirmMoneyClick}>
                        {t("home.homeLogue.moneyClickHome.change")}
                      </Button>)}
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment basic textAlign="center">
                      <Header>{t("home.homeLogue.moneyClickHome.moneyclickToDollarBtc")}</Header>
                      <br />
                      <Grid columns="equal">
                        <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                          <Grid.Column textAlign="left">
                            <p>{t("home.homeLogue.moneyClickHome.availableBalance")} BTC</p>
                          </Grid.Column>
                          <Grid.Column textAlign="right">
                            <p style={{ color: "black",fontSize:14}}>
                              {this.state.balanceMoneyClick !== null
                                              ? this.floorDecimals(
                                                this.state.balanceMoneyClick,
                                                8
                                                )
                              : 0}
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column
                            textAlign="left"
                            width={6}>
                            <p style={{ marginTop: 10 }}>
                              {t("home.homeLogue.moneyClickHome.amount")} BTC
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            textAlign="right"
                            width={5}>
                            <p>
                              <Input
                                size="tiny"
                                type={
                                  <NumberFormat
                                    value={this.state.amountDollarBTC}
                                    decimalScale={8}
                                    placeholder={t("home.homeLogue.moneyClickHome.amount")}
                                    thousandSeparator={false}
                                    allowNegative={false}
                                    onValueChange={values => {
                                      const { value } = values;
                                      this.handleChangeAmountDollarBTC(
                                        parseFloat(value)
                                      );
                                    }}
                                  />
                                }
                              />
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <br />
                      {this.state.amountDollarBTC !=0 &&(
                      <Button
                        floated="right"
                        color="blue"
                        onClick={this.aceptSendConfirmDollarBtc}>
                        {t("home.homeLogue.moneyClickHome.change")}
                      </Button>)}
                    </Segment>
                  </Grid.Column>
                </Grid>
              </Segment>
              <Container textAlign="right">
                <Modal
                  size={"mini"}
                  open={this.state.openSendConfirmMoneyClick}
                  onClose={this.closeSendConfirmMoneyClick}>
                  <Modal.Header>{t("home.homeLogue.moneyClickHome.send.confirmTx")}</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <p>{t("home.homeLogue.moneyClickHome.send.confirMessage")}</p>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="grey" onClick={this.closeSendConfirmMoneyClick}>
                      {t("home.homeLogue.moneyClickHome.send.buttonClose")}
                    </Button>
                    <Button
                      onClick={this.transferBTC}
                      color="blue"
                    >
                      {t("home.homeLogue.moneyClickHome.send.buttonAccept")}
                    </Button>
                  </Modal.Actions>
                </Modal>
                <Modal
                  size={"mini"}
                  open={this.state.openSendConfirmDollarBtc}
                  onClose={this.closeSendConfirmDollarBtc}>
                  <Modal.Header>{t("home.homeLogue.moneyClickHome.send.confirmTx")}</Modal.Header>
                  <Modal.Content>
                    <p>{t("home.homeLogue.moneyClickHome.send.confirMessage")}</p>
                  </Modal.Content>
                  <Modal.Actions>
                  <Button color="grey" onClick={this.closeSendConfirmDollarBtc}>
                      {t("home.homeLogue.moneyClickHome.send.buttonClose")}
                    </Button>
                    <Button 
                      onClick={this.transferBTC} 
                      color="blue">
                      {t("home.homeLogue.moneyClickHome.send.buttonAccept")}
                    </Button>
                  </Modal.Actions>
                </Modal>
                <Modal
                  size={"mini"}
                  open={this.state.openConfirmOperation}
                  onClose={this.closeConfirmOperation}>
                  <Modal.Content>
                  {this.state.confirmMessage === "OK" &&(
                    <Message info>
                      <Message.Header>{t("home.homeLogue.moneyClickHome.send.success")}</Message.Header>
                      <p>{t("home.homeLogue.moneyClickHome.send.successmessage")}</p>
                    </Message>)}
                    {this.state.confirmMessage === "FAIL" &&(
                    <Message negative>
                      <Message.Header>{t("home.homeLogue.moneyClickHome.send.fail")}</Message.Header>
                      <p>{t("home.homeLogue.moneyClickHome.send.failmessage")}</p>
                    </Message>)}
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="grey" onClick={this.closeConfirmOperation}>
                    {t("home.homeLogue.moneyClickHome.send.buttonClose")}
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Container>
            </Grid>
          </Grid.Column>
          <Grid.Column width={2}></Grid.Column>
        </Grid>
        <Divider hidden></Divider>
        <Modal.Actions>
          <Button onClick={this.closeChangeModal}>
          {t("home.homeLogue.moneyClickHome.send.buttonClose")}
          </Button>
        </Modal.Actions>
      </Modal> */}
      </div>
    );
  }
}

export default translate(MoneyClickHome);
