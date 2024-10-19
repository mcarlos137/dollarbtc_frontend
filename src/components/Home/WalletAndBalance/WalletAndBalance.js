import React, { Component } from "react";
import
{
  Grid,
  Segment,
  Modal,
  Button, Popup,
  Image,
  Header,
  Divider,
  Input,
  Container,
  Form,
  Message,
  Label,
  Select,
  Responsive,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import translate from "../../../i18n/translate";
import walletIcon from "../../../img/icn-wallet.png";
import NumberFormat from "react-number-format";
import hftIcon from "../../../img/icn-btc.png";
import market from "../../../services/market";
import user from "../../../services/user";
import otc from "../../../services/otc";

class WalletAndBalance extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      changeModalOpen: false,
      currentCurrency: "usd",
      amountBuy: "",
      amountSell: "",
      amountUSDSell: "",
      amountUSDBuy: "",
      btcPriceBuy: 0,
      btcPriceSell: 0,
      maxPerOperationAmountBuy: 0,
      maxPerOperationAmountSell: 0,
      minPerOperationAmountBuy: 0,
      minPerOperationAmountSell: 0,
      confirmMessage: "",
      amountReceiveBuy: 0,
      amountReceiveSell: 0,
      openSendConfirmBuy: false,
      openSendConfirmSell: false,
      openConfirmOperation: false,
      errorAmountFiatSell: false,
      errorAmountCryptoSell: false,
      errorAmountFiatBuy: false,
      errorAmountCryptoBuy: false,
      showButtonSell: false,
      loadingButtons: false,
      showButtonBuy: false,
      typeExchangeSelectedNew: "",
      translator: props.translate,
    };
    this.handleChangeAmountBuy = this.handleChangeAmountBuy.bind(this);
    this.handleChangeAmountSell = this.handleChangeAmountSell.bind(this);
  }

  componentDidMount()
  {
    this.priceOffer();
  }

  componentWillReceiveProps(nextProps, nextContext)
  {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  floorDecimals(value, numberDecimals)
  {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  }
  formatBTC(value){
     const formatter = new Intl.NumberFormat("en-US", {
       currency: "BTC",
       maximumSignificantDigits: 8,
     });
     return formatter.format(value);
  }
  setItem(e, data)
  {
    this.props.setItem(data.name);
  }
  priceOffer()
  {
    let priceBuy = 0;
    let priceSell = 0;

    let currency = "USD";
    let paymentId = "DOLLARBTC";
    let paymentType = "MAIN";

    otc
      .getOffersFastChangeCurrentAccounts(currency, paymentId, paymentType)
      .then((res) =>
      {
        var Offerts = res.data;
        Object.entries(Offerts).forEach(([currency, offerts]) =>
        {
         
          if (currency === "USD") {
            Object.entries(offerts).forEach(([offertType, dataOffert]) =>
            {
              
              if (offertType === "ASK__DOLLARBTC__MAIN") {
                this.setState({
                  btcPriceBuy: dataOffert.price,
                  maxPerOperationAmountBuy: dataOffert.maxPerOperationAmount,
                  minPerOperationAmountBuy: dataOffert.minPerOperationAmount,
                });
              } else {
                this.setState({
                  btcPriceSell: dataOffert.price,
                  maxPerOperationAmountSell: dataOffert.maxPerOperationAmount,
                  minPerOperationAmountSell: dataOffert.minPerOperationAmount,
                });
              }
            });
          }
        });
      })
      .catch((error) =>
      {
        //console.log(error);
      });
  }
  //inicio de  metodos de modal de cambio
  openChangeModal = () => this.setState({ changeModalOpen: true });

  closeChangeModal = () =>
  {
    this.setState({
      changeModalOpen: false,
      typeExchangeSelectedNew: "",
      amountBuy: "",
      amountUSDBuy: "",
      amountUSDSell: "",
      amountSell: "",
    });
  };
  //fin de  metodos de modal de cambio
  handleTypeExchangeToSelected(e, data)
  {
    this.setState({
      typeExchangeSelectedNew: data.value,
    });
  }
  //inicio de  valores de compra o venta
  handleChangeAmountBuy(value)
  {
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = value;
    }

    let result = val / this.state.btcPriceBuy;
    let floorDecimalsResult = this.floorDecimals(result, 8);

    let floorDecimalsResultVal;
    if (isNaN(floorDecimalsResult)) {
      floorDecimalsResultVal = 0;
    } else {
      floorDecimalsResultVal = floorDecimalsResult;
    }

    this.setState({ amountBuy: val, amountReceiveBuy: floorDecimalsResultVal });
  }
  handleChangeAmountSell(value)
  {
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = value;
    }

    let result = val * this.state.btcPriceSell;
    let floorDecimalsResult = this.floorDecimals(result, 8);
    let floorDecimalsResultVal;
    if (isNaN(floorDecimalsResult)) {
      floorDecimalsResultVal = 0;
    } else {
      floorDecimalsResultVal = floorDecimalsResult;
    }

    this.setState({
      amountSell: val,
      amountReceiveSell: floorDecimalsResultVal,
    });
  }
  handleAmountBitcoinsSell(e, data)
  {
    if (e.target.name === "fiat") {
      while (e.target.value.indexOf(",") !== -1) {
        e.target.value = e.target.value.replace(",", "");
      }
      let value = Number(e.target.value);
      if (
        value === this.state.maxPerOperationAmountSell ||
        value <= this.state.maxPerOperationAmountSell
      ) {
        this.setState({
          errorAmountFiatSell: false,
          message: "",
        });
        this.setState({ amountUSDSell: e.target.value });
        let calculate = this.floorDecimals(
          e.target.value / this.state.btcPriceSell,
          8
        );
        let toString = calculate.toString();
        if (toString.indexOf("e") === -1) {
          this.setState({ amountSell: calculate });
        } else {
          this.setState({ amountSell: 0.0 });
        }
      } else {
        this.setState({
          errorAmountFiatSell: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimit",
        });
        setTimeout(() =>
        {
          this.setState({
            errorAmountFiatSell: false,
            message: "",
          });
        }, 8000);
      }
    }
    if (e.target.name === "crypto") {
      let compareAmount = Number(e.target.value) * this.state.btcPriceSell;

      if (compareAmount <= this.props.balanceUser.available) {
        this.setState({
          amountSell: Number(e.target.value),
          amountUSDSell: compareAmount,
        });
      } else {
        this.setState({
          amountSell: Number(e.target.value),
          amountUSDSell: compareAmount,
          errorAmountCryptoSell: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimitAvalible",
        });
        setTimeout(() =>
        {
          this.setState({
            errorAmountCryptoSell: false,
            message: "",
          });
        }, 8000);
      }
    }
  }
  handleAmountBitcoinsBuy(e, data)
  {
    if (e.target.name === "crypto") {
      let value = Number(e.target.value);
      let calculate = this.floorDecimals(
        e.target.value * this.state.btcPriceBuy,
        8
      );
      if (
        value === this.state.maxPerOperationAmountBuy ||
        value <= this.state.maxPerOperationAmountBuy
      ) {
        this.setState({
          errorAmountCryptoBuy: false,
          message: "",
        });
        this.setState({ amountBuy: e.target.value });

        let toString = calculate.toString();
        if (toString.indexOf("e") === -1) {
          this.setState({ amountUSDBuy: calculate });
        } else {
          this.setState({ amountUSDBuy: 0.0 });
        }
      } else {
        this.setState({
          amountBuy: e.target.value,
          amountUSDBuy: calculate,
          errorAmountCryptoBuy: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimit",
        });
        setTimeout(() =>
        {
          this.setState({
            errorAmountCryptoBuy: false,
            message: "",
          });
        }, 8000);
      }
    }
    if (e.target.name === "fiat") {
      while (e.target.value.indexOf(",") !== -1) {
        e.target.value = e.target.value.replace(",", "");
      }

      let compareAmount = Number(e.target.value) / this.state.btcPriceBuy;

      if (e.target.value <= this.props.balanceUser.availableusd) {
        this.setState({
          amountUSDBuy: Number(e.target.value),
          amountBuy: compareAmount,
        });
      } else {
        this.setState({
          amountUSDBuy: Number(e.target.value),
          amountBuy: compareAmount,
          errorAmountFiatBuy: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimitAvalible",
        });
        setTimeout(() =>
        {
          this.setState({
            errorAmountFiatBuy: false,
            message: "",
          });
        }, 8000);
      }
    }
  }
  //fin de  valores de compra o venta

  //inicio modal de compra
  aceptSendConfirmBuy = () => this.setState({ openSendConfirmBuy: true });
  closeSendConfirmBuy = () => this.setState({ openSendConfirmBuy: false });
  //fin modal de compra

  //inicio modal de compra
  aceptSendConfirmSell = () => this.setState({ openSendConfirmSell: true });
  closeSendConfirmSell = () => this.setState({ openSendConfirmSell: false });
  //fin modal de compra
  closeConfirmOperation = () => this.setState({ openConfirmOperation: false });
  //inicio de metodo de compra
  fastChangeToBTC = () =>
  {
    if (
      this.state.amountBuy < this.state.minPerOperationAmountBuy ||
      this.state.amountBuy > this.state.maxPerOperationAmountBuy
    ) {
      this.setState({
        errorAmountCryptoBuy: true,
        message: "home.homeLogue.WalletAndBalance.send.failLimits",
      });
      setTimeout(() =>
      {
        this.setState({
          errorAmountCryptoBuy: false,
          message: "",
        });
      }, 8000);
    } else {
      if (this.state.amountUSDBuy <= this.props.balanceUser.availableusd) {

        this.setState({ loadingButtons: true });
        let username = user.getUserName();

        let body = {
          userName: username,
          currency: "USD",
          amount: this.state.amountBuy,
          btcPrice: this.state.btcPriceBuy,
        };

        market
          .fastChangeToBTC(body)
          .then((res) =>
          {
            if (res.data === "OK") {
              this.setState({ confirmMessage: "OK", typeExchangeSelectedNew: " " });
            } else {
              if (res.data === "DOES NOT HAVE ENOUGH BALANCE") {
                this.setState({ confirmMessage: "failBalance" });
              } else {
                this.setState({ confirmMessage: "failLimits" });
              }
            }
            this.setState({
              openConfirmOperation: true,
              openSendConfirmBuy: false,
            });
            setTimeout(() =>
            {
              this.closeConfirmOperation();
            }, 6000);

            if (res.data === "OK") {
              window.location.reload();
            }
          })
          .catch((error) =>
          {
            //console.log(error);
          });
      } else {
        this.setState({
          errorAmountFiatBuy: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimitAvalible",
        });
        // setTimeout(() => {
        //   this.closeConfirmOperation();
        // }, 6000);
      }
    }
  };
  //fin  de metodo de compra

  //inicio de metodo de venta
  fastChangeFromBTC = () =>
  {
    if (
      this.state.amountUSDSell < this.state.minPerOperationAmountSell ||
      this.state.amountUSDSell > this.state.maxPerOperationAmountSell
    ) {
      this.setState({
        errorAmountFiatSell: true,
        message: "home.homeLogue.WalletAndBalance.send.failLimits",
      });
      setTimeout(() =>
      {
        this.setState({
          errorAmountFiatSell: false,
          message: "",
        });
      }, 8000);
    } else {
      if (this.state.amountSell <= this.props.balanceUser.available) {
        this.setState({ loadingButtons: true });
        let username = user.getUserName();

        let body = {
          userName: username,
          currency: "USD",
          amount: this.state.amountUSDSell,
          btcPrice: this.state.btcPriceSell,
        };

        market
          .fastChangeFromBTC(body)
          .then((res) =>
          {
            if (res.data === "OK") {
              this.setState({ confirmMessage: "OK", typeExchangeSelectedNew: " " });
            } else {
              if (res.data === "DOES NOT HAVE ENOUGH BALANCE") {
                this.setState({ confirmMessage: "failBalance" });
              } else {
                this.setState({ confirmMessage: "failLimits" });
              }
            }
            this.setState({
              openConfirmOperation: true,
              openSendConfirmSell: false,
            });
            setTimeout(() =>
            {
              this.closeConfirmOperation();
            }, 6000);
            if (res.data === "OK") {
              window.location.reload();
            }
          })
          .catch((error) =>
          {
            //console.log(error);
          });
      } else {
        this.setState({
          errorAmountCryptoSell: true,
          message: "home.homeLogue.WalletAndBalance.amountMaxLimitAvalible",
        });
        setTimeout(() =>
        {
          this.setState({
            errorAmountCryptoSell: false,
            message: "",
          });
        }, 8000);
      }
    }
  };
  //fin  de metodo de venta
  render()
  {
    const typeExchangeEs = [
      { key: "USD", value: "USD", text: "Desde BTC a USD" },
      { key: "BTC", value: "BTC", text: "Desde USD a BTC" },
    ];
    const typeExchangeEn = [
      { key: "USD", value: "USD", text: "From BTC to USD" },
      { key: "BTC", value: "BTC", text: "From USD to BTC" },
    ];

    let t = this.state.translator;
    let labelAmountFiatSell,
      labelAmountCryptoErrorSell,
      labelAmountFiatBuy,
      labelconfirmMessage,
      labelAmountCryptoErrorBuy;

    if (this.state.confirmMessage === "OK") {
      labelconfirmMessage = (
        <Message info>
          <Message.Header>
            {t("home.homeLogue.WalletAndBalance.send.success")}
          </Message.Header>
          <p>{t("home.homeLogue.WalletAndBalance.send.successmessage")}</p>
        </Message>
      );
    }
    if (this.state.confirmMessage === "failBalance") {
      labelconfirmMessage = (
        <Message negative>
          <Message.Header>
            {t("home.homeLogue.WalletAndBalance.send.fail")}
          </Message.Header>
          <p>{t("home.homeLogue.WalletAndBalance.send.failBalance")}</p>
        </Message>
      );
    }

    if (this.state.confirmMessage === "failLimits") {
      labelconfirmMessage = (
        <Message negative>
          <Message.Header>
            {t("home.homeLogue.WalletAndBalance.send.fail")}
          </Message.Header>
          <p>{t("home.homeLogue.WalletAndBalance.send.failLimits")}</p>
        </Message>
      );
    }

    if (this.state.errorAmountFiatSell) {
      labelAmountFiatSell = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmountCryptoSell) {
      labelAmountCryptoErrorSell = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmountFiatBuy) {
      labelAmountFiatBuy = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmountCryptoBuy) {
      labelAmountCryptoErrorBuy = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }

    return (
      <div>
        <Responsive minWidth={992}>
          <Grid>
            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
              <Segment
                inverted
                style={{ marginTop: "5px", backgroundColor: "#DDE2E8" }}
              >
                {/*as={Link} "to="/wallet"  name="wallet */}
                <Grid>
                  <Grid.Row>
                    <Grid.Column largeScreen={1} tablet={1}></Grid.Column>
                    <Grid.Column largeScreen={14} tablet={14}>
                      <Header
                        textAlign="center"
                        as="h4"
                        style={{ fontWeight: "900", color: "#207ef2" }}
                      >
                        <stong style={{ fontWeight: "900", fontSize: 14 }}>
                          {t("home.homeLogue.accountCurrent")}
                        </stong>
                      </Header>
                      <Divider style={{ borderColor: "#207ef2" }} />
                      <div align="center">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUser !== null &&
                                this.props.balanceUser !== undefined
                                  ? this.floorDecimals(
                                      this.props.balanceUser.availableusd,
                                      2
                                    )
                                  : 0}
                              </span>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 30,
                                }}
                              >
                                USD
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row style={{ marginTop: "-20px" }}>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <p
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUser !== null
                                  ? this.formatBTC(
                                      this.props.balanceUser.available
                                    )
                                  : 0}
                              </p>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                                marginTop: window.innerWidth >= 1200 ? 5 : 5,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                }}
                              >
                                BTC
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>
                    </Grid.Column>
                    <Grid.Column largeScreen={1} tablet={1}></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column largeScreen={4} tablet={4}>
                      <Popup
                        trigger={
                          <Image
                            src={walletIcon}
                            size="mini"
                            verticalAlign="middle"
                            style={{ marginLeft: "20px" }}
                            as={Link}
                            to="/wallet"
                            name="wallet"
                          />
                        }
                      >
                        {t("navPublic.account.options.transactions")}
                      </Popup>
                    </Grid.Column>
                    <Grid.Column
                      largeScreen={window.innerWidth >= 1200 ? 5 : 4}
                      tablet={window.innerWidth >= 1200 ? 5 : 4}
                    ></Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}>
                      <Button
                        style={{
                          backgroundColor: "#207ef2",
                          color: "white",
                          fontSize: window.innerWidth >= 1200 ? 10 : 12,
                          width: window.innerWidth >= 1200 ? 80 : 120,
                          height: window.innerWidth >= 1200 ? 30 : 30,
                          marginLeft: window.innerWidth >= 1200 ? 10 : 7,
                        }}
                        onClick={this.openChangeModal}
                      >
                        <stong>{t("home.homeLogue.change")}</stong>
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
              <Segment
                inverted
                style={{ marginTop: "5px", backgroundColor: "#DDE2E8" }}
              >
                {/*as={Link} "to="/wallet"  name="wallet */}
                <Grid as={Link} to="/hftplans" name="hftplans">
                  <Grid.Row>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                    <Grid.Column largeScreen={12} tablet={12}>
                      <Header
                        textAlign="center"
                        as="h4"
                        style={{ fontWeight: "900", color: "#207ef2" }}
                      >
                        <strong style={{ fontWeight: "900", fontSize: 14 }}>
                          {t("home.homeLogue.accountFixedTerm")}
                        </strong>
                      </Header>
                      <Divider style={{ borderColor: "#207ef2" }} />
                      <div align="center">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUsdUser !== 0
                                  ? this.floorDecimals(
                                      this.props.balanceUsdUser,
                                      2
                                    )
                                  : 0}
                              </span>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 30,
                                }}
                              >
                                USD
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row style={{ marginTop: "-20px" }}>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <p
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {/* {this.props.balanceUser !== null
                                ? this.floorDecimals(
                                    this.props.balanceUser.estimated,
                                    8
                                  )
                                : 0} */}
                                {this.props.balancebtcUser !== null
                                  ? this.formatBTC(this.props.balancebtcUser)
                                  : 0}
                              </p>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                                marginTop: window.innerWidth >= 1200 ? 5 : 5,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                }}
                              >
                                BTC
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>
                    </Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column largeScreen={4} tablet={4}>
                      <Popup
                        trigger={
                          <Image
                            src={hftIcon}
                            verticalAlign="middle"
                            style={{ marginLeft: "20px", height: "35px" }}
                          />
                        }
                      >
                        {t("home.homeLogue.accountFixedTerm2")}
                      </Popup>
                    </Grid.Column>
                    <Grid.Column largeScreen={4} tablet={4}></Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid>
            <Grid.Column
              mobile={window.innerWidth <= 673 ? 16 : 8}
              tablet={window.innerWidth <= 673 ? 16 : 8}
            >
              <Segment
                inverted
                style={{ marginTop: "5px", backgroundColor: "#DDE2E8" }}
              >
                {/*as={Link} "to="/wallet"  name="wallet */}
                <Grid>
                  <Grid.Row>
                    <Grid.Column largeScreen={1} tablet={1}></Grid.Column>
                    <Grid.Column largeScreen={14} tablet={14}>
                      <Header
                        textAlign="center"
                        as="h4"
                        style={{ fontWeight: "900", color: "#207ef2" }}
                      >
                        <stong style={{ fontWeight: "900", fontSize: 14 }}>
                          {t("home.homeLogue.accountCurrent")}
                        </stong>
                      </Header>
                      <Divider style={{ borderColor: "#207ef2" }} />
                      <div align="center">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 673 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUser !== null &&
                                this.props.balanceUser !== undefined
                                  ? this.floorDecimals(
                                      this.props.balanceUser.availableusd,
                                      2
                                    )
                                  : 0}
                              </span>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 674 ? 0 : -20,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                  marginRight:
                                    window.innerWidth >= 674 ? 0 : 30,
                                }}
                              >
                                USD
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row style={{ marginTop: "-20px" }}>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <p
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 674 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUser !== null
                                  ? this.formatBTC(
                                      this.props.balanceUser.available
                                    )
                                  : 0}
                              </p>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 674 ? 0 : -20,
                                marginTop: window.innerWidth >= 674 ? 5 : 5,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                }}
                              >
                                BTC
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>
                    </Grid.Column>
                    <Grid.Column largeScreen={1} tablet={1}></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column largeScreen={4} tablet={4}>
                      <Popup
                        trigger={
                          <Image
                            src={walletIcon}
                            size="mini"
                            verticalAlign="middle"
                            style={{ marginLeft: "20px" }}
                            as={Link}
                            to="/wallet"
                            name="wallet"
                          />
                        }
                      >
                        Wallet
                      </Popup>
                    </Grid.Column>
                    <Grid.Column
                      largeScreen={window.innerWidth >= 674 ? 5 : 4}
                      tablet={window.innerWidth >= 674 ? 5 : 4}
                    ></Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}>
                      <Button
                        style={{
                          backgroundColor: "#207ef2",
                          color: "white",
                          fontSize: window.innerWidth >= 674 ? 10 : 12,
                          width: window.innerWidth >= 674 ? 80 : 120,
                          height: window.innerWidth >= 674 ? 30 : 30,
                          marginLeft: window.innerWidth >= 674 ? 8 : 7,
                        }}
                        onClick={this.openChangeModal}
                      >
                        <stong>{t("home.homeLogue.change")}</stong>
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
            <Grid.Column
              mobile={window.innerWidth <= 673 ? 16 : 8}
              tablet={window.innerWidth <= 673 ? 16 : 8}
            >
              <Segment
                inverted
                style={{ marginTop: "5px", backgroundColor: "#DDE2E8" }}
              >
                {/*as={Link} "to="/wallet"  name="wallet */}
                <Grid as={Link} to="/hftplans" name="hftplans">
                  <Grid.Row>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                    <Grid.Column largeScreen={12} tablet={12}>
                      <Header
                        textAlign="center"
                        as="h4"
                        style={{ fontWeight: "900", color: "#207ef2" }}
                      >
                        <strong style={{ fontWeight: "900", fontSize: 14 }}>
                          {t("home.homeLogue.accountFixedTerm")}
                        </strong>
                      </Header>
                      <Divider style={{ borderColor: "#207ef2" }} />
                      <div align="center">
                        <Grid>
                          <Grid.Row>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {this.props.balanceUsdUser !== 0
                                  ? this.floorDecimals(
                                      this.props.balanceUsdUser,
                                      2
                                    )
                                  : 0}
                              </span>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 30,
                                }}
                              >
                                USD
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row style={{ marginTop: "-20px" }}>
                            <Grid.Column
                              largeScreen={9}
                              tablet={9}
                              style={{ textAlign: "right" }}
                            >
                              <p
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 20,
                                }}
                              >
                                {/* {this.props.balanceUser !== null
                                ? this.floorDecimals(
                                    this.props.balanceUser.estimated,
                                    8
                                  )
                                : 0} */}
                                {this.props.balancebtcUser !== null
                                  ? this.formatBTC(this.props.balancebtcUser)
                                  : 0}
                              </p>
                            </Grid.Column>
                            <Grid.Column
                              style={{
                                textAlign: "left",
                                marginLeft: window.innerWidth >= 1200 ? 0 : -20,
                                marginTop: window.innerWidth >= 1200 ? 5 : 5,
                              }}
                            >
                              <span
                                style={{
                                  color: "black",
                                  fontSize: 18,
                                  fontWeight: "900",
                                }}
                              >
                                BTC
                              </span>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>
                    </Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column largeScreen={4} tablet={4}>
                      <Popup
                        trigger={
                          <Image
                            src={hftIcon}
                            verticalAlign="middle"
                            style={{ marginLeft: "20px", height: "35px" }}
                          />
                        }
                      >
                        {t("home.homeLogue.accountFixedTerm2")}
                      </Popup>
                    </Grid.Column>
                    <Grid.Column largeScreen={4} tablet={4}></Grid.Column>
                    <Grid.Column largeScreen={2} tablet={2}></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid>
        </Responsive>
        {/* ===MODAL=== */}
        <Modal
          open={this.state.changeModalOpen}
          onClose={this.closeChangeModal}
        >
          <Modal.Header>{t("home.homeLogue.changeTitleModal")}</Modal.Header>
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
                              {t("home.homeLogue.WalletAndBalance.typeChange")}
                            </label>
                            <Select
                              placeholder={t(
                                "home.homeLogue.WalletAndBalance.placeholderTypeChange"
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
                            this.state.typeExchangeSelectedNew === "USD" &&
                            this.props.balanceUser !== null &&
                            this.floorDecimals(
                              this.props.balanceUser.available,
                              8
                            ) !== 0 &&
                            this.state.btcPriceSell !== 0 && (
                              <div>
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.WalletAndBalance.availableBalance"
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
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.WalletAndBalance.businessLimits"
                                      )}
                                    </strong>

                                    {this.state.typeExchangeSelectedNew
                                      ? " " +
                                        this.state.minPerOperationAmountSell
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? " - "
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? " " +
                                        this.state.maxPerOperationAmountSell
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? "  "
                                      : ""}
                                    {this.state.typeExchangeSelectedNew}
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
                                          "home.homeLogue.WalletAndBalance.amount"
                                        )}{" "}
                                        BTC
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountSell}
                                        decimalScale={8}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "BTC"
                                        }
                                        thousandSeparator={false}
                                        allowNegative={false}
                                        onChange={this.handleAmountBitcoinsSell.bind(
                                          this
                                        )}
                                        name="crypto"
                                      />
                                      {labelAmountCryptoErrorSell}
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
                                        {t(
                                          "home.homeLogue.WalletAndBalance.amount"
                                        )}{" "}
                                        USD
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountUSDSell}
                                        decimalScale={2}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "USD"
                                        }
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        onChange={this.handleAmountBitcoinsSell.bind(
                                          this
                                        )}
                                        name="fiat"
                                      />
                                      {labelAmountFiatSell}
                                    </Form.Field>
                                  </Grid.Column>
                                  <Form.Field>
                                    <span>
                                      1 BTC = {"USD"}{" "}
                                      {this.state.btcPriceSell.toLocaleString(
                                        "en-US",
                                        { maximumFractionDigits: 2 }
                                      )}
                                    </span>
                                  </Form.Field>
                                </Grid>
                              </div>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew === "BTC" &&
                            this.props.balanceUser !== null &&
                            this.floorDecimals(
                              this.props.balanceUser.availableusd,
                              2
                            ) !== 0 &&
                            this.state.btcPriceBuy !== 0 && (
                              <div>
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.WalletAndBalance.availableBalance"
                                      )}
                                    </strong>

                                    {this.props.balanceUser !== null
                                      ? " " +
                                        this.floorDecimals(
                                          this.props.balanceUser.availableusd,
                                          2
                                        )
                                      : 0}
                                    {this.props.balanceUser !== null
                                      ? "  "
                                      : ""}
                                    {"USD"}
                                  </span>
                                </Form.Field>
                                <Form.Field>
                                  <span>
                                    <strong>
                                      {t(
                                        "home.homeLogue.WalletAndBalance.businessLimits"
                                      )}
                                    </strong>

                                    {this.state.typeExchangeSelectedNew
                                      ? " " +
                                        this.state.minPerOperationAmountBuy
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? " - "
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? " " +
                                        this.state.maxPerOperationAmountBuy
                                      : ""}
                                    {this.state.typeExchangeSelectedNew
                                      ? "  "
                                      : ""}
                                    {this.state.typeExchangeSelectedNew}
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
                                          "home.homeLogue.WalletAndBalance.amount"
                                        )}{" "}
                                        USD
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountUSDBuy}
                                        decimalScale={2}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "USD"
                                        }
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        onChange={this.handleAmountBitcoinsBuy.bind(
                                          this
                                        )}
                                        name="fiat"
                                      />
                                      {labelAmountFiatBuy}
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
                                        {t(
                                          "home.homeLogue.WalletAndBalance.amount"
                                        )}{" "}
                                        BTC
                                      </label>
                                      <NumberFormat
                                        value={this.state.amountBuy}
                                        decimalScale={8}
                                        placeholder={
                                          t("fastChange.buy.amount") +
                                          " " +
                                          "BTC"
                                        }
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        onChange={this.handleAmountBitcoinsBuy.bind(
                                          this
                                        )}
                                        name="crypto"
                                      />
                                      {labelAmountCryptoErrorBuy}
                                    </Form.Field>
                                  </Grid.Column>
                                  <Form.Field>
                                    <span>
                                      1 BTC = {"USD"}{" "}
                                      {this.state.btcPriceBuy.toLocaleString(
                                        "en-US",
                                        { maximumFractionDigits: 2 }
                                      )}
                                    </span>
                                  </Form.Field>
                                </Grid>
                              </div>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew === "BTC" &&
                            (this.floorDecimals(
                              this.props.balanceUser.availableusd,
                              2
                            ) === 0 ||
                              this.props.balanceUser === null) &&
                            this.state.btcPriceBuy !== 0 && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.WalletAndBalance.send.failBalanceAmount"
                                    ) +
                                      " " +
                                      "USD"}
                                  </p>
                                </Message>
                              </Form.Field>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew === "BTC" &&
                            this.state.btcPriceBuy === 0 && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.WalletAndBalance.avalibleOption"
                                    )}
                                  </p>
                                </Message>
                              </Form.Field>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew === "USD" &&
                            (this.floorDecimals(
                              this.props.balanceUser.available,
                              8
                            ) === 0 ||
                              this.props.balanceUser === null) &&
                            this.state.btcPriceSell !== 0 && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.WalletAndBalance.send.failBalanceAmount"
                                    ) +
                                      " " +
                                      "BTC"}
                                  </p>
                                </Message>
                              </Form.Field>
                            )}
                          {this.state.typeExchangeSelectedNew !== "" &&
                            this.state.typeExchangeSelectedNew === "USD" &&
                            this.state.btcPriceSell === 0 && (
                              <Form.Field>
                                <Message negative>
                                  <p>
                                    {t(
                                      "home.homeLogue.WalletAndBalance.avalibleOption"
                                    )}
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
              {t("home.homeLogue.WalletAndBalance.send.buttonClose")}
            </Button>
            {this.state.typeExchangeSelectedNew === "USD" && (
              <Button
                onClick={this.fastChangeFromBTC}
                color="blue"
                disabled={this.state.loadingButtons}
                loading={this.state.loadingButtons}
              >
                {t("home.homeLogue.WalletAndBalance.send.buttonAccept")}
              </Button>
            )}
            {this.state.typeExchangeSelectedNew === "BTC" && (
              <Button
                onClick={this.fastChangeToBTC}
                color="blue"
                disabled={this.state.loadingButtons}
                loading={this.state.loadingButtons}
              >
                {t("home.homeLogue.WalletAndBalance.send.buttonAccept")}
              </Button>
            )}
          </Modal.Actions>
          {/* <Modal
                  size={"mini"}
                  open={this.state.openConfirmOperation}
                  onClose={this.closeConfirmOperation}>
                  <Modal.Content>
                  {this.state.confirmMessage === "OK" &&(
                    <Message info>
                      <Message.Header>{t("home.homeLogue.WalletAndBalance.send.success")}</Message.Header>
                      <p>{t("home.homeLogue.WalletAndBalance.send.successmessage")}</p>
                    </Message>)}
                  {this.state.confirmMessage === "failBalance" &&(
                    <Message negative>
                      <Message.Header>{t("home.homeLogue.WalletAndBalance.send.fail")}</Message.Header>
                      <p>{t("home.homeLogue.WalletAndBalance.send.failBalance")}</p>
                    </Message>)}
                    {this.state.confirmMessage === "failLimits" &&(
                    <Message negative>
                      <Message.Header>{t("home.homeLogue.WalletAndBalance.send.fail")}</Message.Header>
                      <p>{t("home.homeLogue.WalletAndBalance.send.failLimits")}</p>
                    </Message>)}
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="grey" onClick={this.closeConfirmOperation}>
                    {t("home.homeLogue.WalletAndBalance.send.buttonClose")}
                    </Button>
                  </Modal.Actions>
                </Modal> */}
        </Modal>
      </div>
    );
  }
}

export default translate(WalletAndBalance);
