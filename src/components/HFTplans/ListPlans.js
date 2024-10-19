import React, { Component } from "react";
import userService from "../../services/user";
import config from "../../services/config";
import axios from "axios";
import walking from "../../img/walking.png";
import defensiveIcon from "../../img/planDefensiveIcon.png";
import jogging from "../../img/jogging.png";
import moderateIcon from "../../img/planModerateIcon.png";
import running from "../../img/running.png";
import intenseIcon from "../../img/planIntenseIcon.png";
import sprinting from "../../img/sprinting.png";
import aggressiveIcon from "../../img/planAggressiveIcon.png";
import modelService from "../../services/model";
import Calculator from "../Calculator/Calculator";
import FiatCarrouselStadicts from "../Home/FiatCarrouselStadicts/FiatCarrouselStadicts";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Header,
  Icon,
  Image,
  Label,
  List,
  Loader,
  Responsive,
  Segment,
  Grid,
  Message,
  Modal,
  Form,
  Popup,
  Item,
} from "semantic-ui-react";
import automaticTrading from "../../img/automaticTrading.png";
import trailingStops from "../../img/trailingStops.png";
import backtesting from "../../img/backtesting.png";
import exchanges from "../../img/exchanges.png";
import { Link } from "react-router-dom";
import PriceCoin from "../PriceCoin/PriceCoin";
import iconHome1 from "../../img/iconHome1.png";
import iconHome2 from "../../img/iconHome2.png";
import iconHome3 from "../../img/iconHome3.png";
import Carrousel from "../Carrousel/Carrousel";
import power from "../../img/power.png";
import lock from "../../img/lock.png";
import x from "../../img/x.png";
import MobileHome from "../MobileHome/MobileHome";
import translate from "../../i18n/translate";
import currency from "../../common/currency";
import AssociatedCompaniesCarousel from "../Home/AssociatedCompaniesCarousel/AssociatedCompaniesCarousel";
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
const URL_BASE_CORE = config.apiDollarBtcUrl;
class ListPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPlans: [],
      showListPlans: false,
      openInvestModal: false,
      planNameToInvest: "",
      planMinAmountToInvest: null,
      amountWalletBTC: null,
      amountToInvest: null,
      errorAmount: false,
      openSendConfirm: false,
      verifyToken: "",
      successfulCopy: false,
      errorCopy: false,
      loadingInvest: false,
      coins: [],
      list: [],
      planSpanishNameToInvest: null,
      keyAmountToinvest: Math.random(),
      planIconToInvest: null,
      activatingModel: false,
      translator: props.translate,
      endCopy: false,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
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
    //console.log(this.props);
    this.getCoins();
  }
  componentWillUnmount() {}
  getListPlans = () => {
    modelService
      .modelListAvailable(
        !userService.getUserAuth()
          ? "maibebtc@mailinator.com"
          : userService.getUserName()
      )
      .then((res) => {
        let listPlansWithIcons = res.data.result.availableModels;
        for (var i = 0; i < listPlansWithIcons.length; i++) {
          if (listPlansWithIcons[i].name === "defensive") {
            listPlansWithIcons[i].headerIcon = walking;
            listPlansWithIcons[i].icon = defensiveIcon;
          } else if (listPlansWithIcons[i].name === "moderate") {
            listPlansWithIcons[i].headerIcon = jogging;
            listPlansWithIcons[i].icon = moderateIcon;
          } else if (listPlansWithIcons[i].name === "intense") {
            listPlansWithIcons[i].headerIcon = running;
            listPlansWithIcons[i].icon = intenseIcon;
          } else if (listPlansWithIcons[i].name === "aggressive") {
            listPlansWithIcons[i].headerIcon = sprinting;
            listPlansWithIcons[i].icon = aggressiveIcon;
          }
        }
        if (userService.getUserAuth()) {
          this.getWalletBalanceDBC();
        }

        this.setState({ listPlans: listPlansWithIcons });
        this.setState({ showListPlans: true });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  handleAmountToInvest = (e) => {
    this.setState({ amountToInvest: e.target.value });
  };
  handleToken = (e) => {
    this.setState({ verifyToken: e.target.value });
  };
  getWalletBalanceDBC = function () {
    var availableAmounts = [];
    userService
      .getBalanceUser(userService.getUserName())
      .then((resp) => {
        availableAmounts = resp.data.result.availableAmounts;
        for (var i = 0; i < availableAmounts.length; i++) {
          if (availableAmounts[i].currency === "BTC") {
            this.setState({
              amountWalletBTC: this.floorDecimals(
                availableAmounts[i].amount,
                8
              ),
            });
          }
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  componentWillMount() {
    this.getListPlans();
  }
  showInvestModal = (planName, planMinAmount, planSpanishName, planIcon) => {
    if (!userService.getUserAuth()) {
      window.location.href = "/registration";
    } else {
      this.setState({ openInvestModal: true });
      this.setState({ amountToInvest: null });
      this.setState({
        planNameToInvest: planName,
        planSpanishNameToInvest: planSpanishName,
        planIconToInvest: planIcon,
      });
      this.setState({ planMinAmountToInvest: planMinAmount });
    }
  };
  closeInvestModal = () => {
    this.setState({
      openInvestModal: false,
      endCopy: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
    });
    this.setState({ activatingModel: false });
  };
  closeSendConfirm = () => {
    this.setState({ openSendConfirm: false });
    this.setState({ verifyToken: "" });
  };
  closeSuccessfulCopy = () => {
    this.setState({ successfulCopy: false }, () => this.props.HFTplans());
  };
  closeErrorCopy = () => {
    this.setState({ errorCopy: false });
  };
  activateModelWithoutToken = () => {
    const re = /^[0-9]\d*(\.\d+)?$/;
    if (
      this.state.amountToInvest !== "" &&
      this.state.amountToInvest !== null &&
      this.state.amountToInvest !== undefined &&
      re.test(this.state.amountToInvest)
    ) {
      if (this.state.amountToInvest >= this.state.planMinAmountToInvest) {
        if (this.state.amountToInvest <= this.state.amountWalletBTC) {
          this.setState({ activatingModel: true, loadingInvest: true });

          var body = {
            userName: userService.getUserName(),
            modelName: this.state.planNameToInvest,
            amounts: {
              BTC: parseFloat(this.state.amountToInvest),
            },
          };
          modelService
            .modelCopy(body)
            .then((res) => {
              //  this.closeInvestModal();
              this.setState({
                loadingInvest: false,
                viewMessage: true,
                textMessage: "hft.listPlans.modalSuccess.description",
                colorMessage: "blue",
                endCopy: true,
                activatingModel: false,
              });

              this.setState({ verifyToken: "" });
              this.setState({ amountToInvest: null });
            })
            .catch((error) => {
              //console.log(error);
              this.closeInvestModal();
              this.setState({
                loadingInvest: false,
                viewMessage: true,
                textMessage: "hft.listPlans.modalFail.description",
                colorMessage: "red",
                activatingModel: false,
              });

              this.setState({ loadingInvest: false });
              // this.setState({ errorCopy: true });
              this.setState({ verifyToken: "" });
              this.setState({ amountToInvest: null });
            });
        } else {
          this.setState({
            errorAmount: true,
            message: "hft.listPlans.errors.exceededAmount",
            keyAmountToinvest: Math.random(),
          });
          setTimeout(() => {
            this.setState({
              errorAmount: false,
            });
          }, 5000);
        }
      } else {
        this.setState({
          errorAmount: true,
          message: "hft.listPlans.errors.minimalAmount",
          keyAmountToinvest: Math.random(),
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      }
    } else {
      if (!re.test(this.state.amountToInvest)) {
        this.setState({
          errorAmount: true,
          message: "hft.listPlans.errors.numberFormat",
          keyAmountToinvest: Math.random(),
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      } else {
        this.setState({
          errorAmount: true,
          message: "hft.listPlans.errors.requiredField",
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      }
    }
  };
  aceptSendConfirm = () => {
    this.setState({ loadingInvest: true });
    var urlTokenVerify = URL_BASE_BUSHIDO + config.urlBushido.verifyToken;
    axios
      .post(urlTokenVerify, this.state.verifyToken, {
        auth: {
          username: atob(userService.getHeader()).split(":")[1],
          password: atob(userService.getHeader()).split(":")[0],
        },
        headers: { "Content-Type": "text/plain" },
      })
      .then((res) => {
        if (res.data.errors == null) {
          var body = {
            userName: userService.getUserName(),
            modelName: this.state.planNameToInvest,
            amounts: {
              BTC: parseFloat(this.state.amountToInvest),
            },
          };
          modelService
            .modelCopy(body)
            .then((res) => {
              this.closeSendConfirm();
              this.setState({ loadingInvest: false });
              this.setState({ successfulCopy: true });
              this.setState({ verifyToken: "" });
              this.setState({ amountToInvest: null });
            })
            .catch((error) => {
              //console.log(error);
              this.closeSendConfirm();
              this.setState({ loadingInvest: false });
              this.setState({ errorCopy: true });
              this.setState({ verifyToken: "" });
              this.setState({ amountToInvest: null });
            });
        } else {
          if (res.data.errors[0].code === 21) {
            this.setState({ loadingInvest: false });
            this.setState({ verifyToken: "" });
            this.setState({ loadingSending: false });
            this.setState({ showTokenNotFound: true });
            setTimeout(() => {
              this.setState({
                showTokenNotFound: false,
              });
              this.closeSendConfirm();
            }, 7000);
          }
          if (res.data.errors[0].code === 23) {
            this.setState({ loadingInvest: false });
            this.setState({ verifyToken: "" });
            this.setState({ loadingSending: false });
            this.setState({ showTokenExpirated: true });
            setTimeout(() => {
              this.setState({
                showTokenExpirated: false,
              });
              this.closeSendConfirm();
            }, 7000);
          }
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  sendConfirmToken = () => {
    const re = /^[0-9]\d*(\.\d+)?$/;
    if (
      this.state.amountToInvest !== "" &&
      this.state.amountToInvest !== null &&
      this.state.amountToInvest !== undefined &&
      re.test(this.state.amountToInvest)
    ) {
      if (this.state.amountToInvest >= this.state.planMinAmountToInvest) {
        if (this.state.amountToInvest <= this.state.amountWalletBTC) {
          var urlTokenSend =
            URL_BASE_BUSHIDO + config.urlBushido.generateTokenVerify;
          var body = {
            email: userService.getUserEmail().toString(),
            source: "PORTAL_NORMAL",
          };
          axios
            .post(urlTokenSend, body, {
              auth: {
                username: atob(userService.getHeader()).split(":")[1],
                password: atob(userService.getHeader()).split(":")[0],
              },
            })
            .then((res) => {
              this.closeInvestModal();
              this.setState({ openSendConfirm: true });
            })
            .catch((error) => {
              //console.log(error);
            });
        } else {
          this.setState({
            errorAmount: true,
            message:
              "El monto a invertir es mayor al que posee en su cartera de dollarBTC.",
            keyAmountToinvest: Math.random(),
          });
          setTimeout(() => {
            this.setState({
              errorAmount: false,
            });
          }, 5000);
        }
      } else {
        this.setState({
          errorAmount: true,
          message:
            "El monto a invertir debe ser mayor al mínimo permitido por el plan.",
          keyAmountToinvest: Math.random(),
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      }
    } else {
      if (!re.test(this.state.amountToInvest)) {
        this.setState({
          errorAmount: true,
          message: "Este campo debe poseer un formato numérico",
          keyAmountToinvest: Math.random(),
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      } else {
        this.setState({
          errorAmount: true,
          message: "Este campo es requerido",
        });
        setTimeout(() => {
          this.setState({
            errorAmount: false,
          });
        }, 5000);
      }
    }
  };
  getCoins() {
    axios
      .get(URL_BASE_CORE + "/analysis/getFullPriceInfo")
      .then((res) => {
        let arr = [];
        if (res.data !== undefined) {
          Object.entries(res.data).forEach(([k, v]) => {
            let curren = currency.currencies.find(function (element) {
              return element.value === k;
            });
            if (k !== "PA_USD") {
              if (curren !== undefined) {
                let decimales = Math.pow(10, 4);
                let buy6, sell6, buy24, sell24;
                let sell, buy, usdprice, price, forex;
                Object.entries(v).forEach(([valKey, valValue]) => {
                  if (valKey === "localBitcoins") {
                    Object.entries(valValue).forEach(([intk, intv]) => {
                      if (intk === "btcPrice") {
                        price = intv;
                      }
                      if (intk === "usdPrice") {
                        usdprice = intv;
                      }
                      if (intk === "ask") {
                        Object.entries(intv).forEach(([askKey, askValue]) => {
                          if (askKey === "average") {
                            Object.entries(askValue).forEach(
                              ([averaaskkey, averaaskvalue]) => {
                                if (averaaskkey === "price") {
                                  buy = averaaskvalue;
                                }
                                if (averaaskkey === "6H%") {
                                  buy6 = averaaskvalue;
                                }
                                if (averaaskkey === "24H%") {
                                  buy24 = averaaskvalue;
                                }
                              }
                            );
                          }
                        });
                      }
                      if (intk === "bid") {
                        Object.entries(intv).forEach(([bidkey, bidvalue]) => {
                          if (bidkey === "average") {
                            Object.entries(bidvalue).forEach(
                              ([averakey, averavalue]) => {
                                if (averakey === "6H%") {
                                  sell6 = averavalue;
                                }
                                if (averakey === "24H%") {
                                  sell24 = averavalue;
                                }
                                if (averakey === "price") {
                                  sell = averavalue;
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                  if (valKey === "forex") {
                    forex = valValue.usdRate;
                  }
                });
                var ob = {
                  img: curren.img,
                  flag: curren.flag,
                  text: this.state.translator(curren.traslate),
                  value: k,
                  price: Math.floor(price * decimales) / decimales,
                  priority: curren.priority,
                  sell: sell,
                  buy: buy,
                  usd_price: usdprice !== undefined ? usdprice : 0,
                  forex_price: forex !== undefined ? forex : 0,
                  name: curren.name,
                  percent: [
                    {
                      activity: this.state.translator("commons.avgBuy"),
                      buyOne: buy6,
                      buyTwo: buy24,
                    },
                    {
                      activity: this.state.translator("commons.avgSell"),
                      sellOne: sell6,
                      sellTwo: sell24,
                    },
                  ],
                };
                this.setState({ list: [...this.state.list, ob] });
              } else {
                let decimales = Math.pow(10, 4);
                let buy6, sell6, buy24, sell24;
                let sell, buy, usdprice, price, forex;
                Object.entries(v).forEach(([valKey, valValue]) => {
                  if (valKey === "localBitcoins") {
                    Object.entries(valValue).forEach(([intk, intv]) => {
                      if (intk === "btcPrice") {
                        price = intv;
                      }
                      if (intk === "usdPrice") {
                        usdprice = intv;
                      }
                      if (intk === "ask") {
                        Object.entries(intv).forEach(([askKey, askValue]) => {
                          if (askKey === "average") {
                            Object.entries(askValue).forEach(
                              ([averaaskkey, averaaskvalue]) => {
                                if (averaaskkey === "price") {
                                  buy = averaaskvalue;
                                }
                                if (averaaskkey === "6H%") {
                                  buy6 = averaaskvalue;
                                }
                                if (averaaskkey === "24H%") {
                                  buy24 = averaaskvalue;
                                }
                              }
                            );
                          }
                        });
                      }
                      if (intk === "bid") {
                        Object.entries(intv).forEach(([bidkey, bidvalue]) => {
                          if (bidkey === "average") {
                            Object.entries(bidvalue).forEach(
                              ([averakey, averavalue]) => {
                                if (averakey === "6H%") {
                                  sell6 = averavalue;
                                }
                                if (averakey === "24H%") {
                                  sell24 = averavalue;
                                }
                                if (averakey === "price") {
                                  sell = averavalue;
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                  if (valKey === "forex") {
                    forex = valValue.usdRate;
                  }
                });
                var ob = {
                  img: "",
                  flag: "",
                  text: "",
                  value: k,
                  price: Math.floor(price * decimales) / decimales,
                  priority: 19,
                  sell: sell,
                  buy: buy,
                  usd_price: usdprice !== undefined ? usdprice : 0,
                  forex_price: forex !== undefined ? forex : 0,
                  name: "",
                  percent: [
                    {
                      activity: this.state.translator("commons.avgBuy"),
                      buyOne: buy6,
                      buyTwo: buy24,
                    },
                    {
                      activity: this.state.translator("commons.avgSell"),
                      sellOne: sell6,
                      sellTwo: sell24,
                    },
                  ],
                };
                this.setState({ list: [...this.state.list, ob] });
              }
            }
          });
          this.setState({
            list: this.state.list.sort(function (a, b) {
              return a.priority - b.priority;
            }),
            show: true,
          });
        }
      })
      .catch((error) => {
        //console.log(error);

        this.setState({ show: true });
      });
  }
  handleBuy(e, data) {
    ////console.log(data);
    window.location.href = "/buy/?c=" + data.id;
  }
  handleSell(e, data) {
    window.location.href = "/sell/?c=" + data.name;
  }
  setItem(e, data) {
    this.props.setItem.setItem(data.id);
  }
  setItemMobile(data) {
    this.props.setItem.setItem(data);
  }
  render() {
    let t = this.state.translator;
    let calculator, fiat, listT;
    calculator = <Calculator coins={this.state.list} />;
    fiat = <FiatCarrouselStadicts coins={this.state.list} />;
    listT = this.state.list.map((element, i) => (
      <div>
        {element.value !== "BTC" && (
          <List.Item key={`key-${i}`}>
            <Grid>
              <Grid.Column width={3}>
                <Image
                  size="mini"
                  circular
                  src={element.img}
                  className="avaStyle"
                />
              </Grid.Column>
              <Grid.Column width={6} textAlign="right">
                <div style={{ marginBottom: "5px" }} />
                <span>
                  {element.buy.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Grid.Column>
              <Grid.Column width={7} textAlign="right">
                <div style={{ marginBottom: "5px" }} />
                <span style={{ marginRight: "15px" }}>
                  {element.sell.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Grid.Column>
            </Grid>
            <Divider hidden style={{ marginTop: "7px", marginBottom: "7px" }} />
          </List.Item>
        )}
      </div>
    ));
    var labelAmount, messageTokenNotFound, messageTokenExpirated;
    if (this.state.errorAmount) {
      labelAmount = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.showTokenNotFound) {
      messageTokenNotFound = (
        <Message negative>
          <Message.Header>
            {t("hft.listPlans.errors.tokenNotFound.header")}
          </Message.Header>
          <p>{t("hft.listPlans.errors.tokenNotFound.content")}</p>
        </Message>
      );
    }
    if (this.state.showTokenExpirated) {
      messageTokenExpirated = (
        <Message negative>
          <Message.Header>
            {t("hft.listPlans.errors.tokenExpired.header")}
          </Message.Header>
          <p>{t("hft.listPlans.errors.tokenExpired.header")}</p>
        </Message>
      );
    }
    return (
      <div>
        <Segment color="orange">
          <Container>
            {!this.state.showListPlans && !this.state.show && (
              <Dimmer active inverted>
                <Loader inverted>{t("hft.listPlans.loading")}</Loader>
              </Dimmer>
            )}
            {this.state.loadingInvest && (
              <Dimmer active inverted>
                <Loader inverted>{t("hft.listPlans.investing")}</Loader>
              </Dimmer>
            )}
            <Grid centered>
              <Grid.Row columns="equal">
                {this.state.listPlans.map((plan) => (
                  <Grid.Column
                    largeScreen={4}
                    tablet={8}
                    mobile={16}
                    key={plan.position}
                    textAlign="center"
                  >
                    <Segment
                      secondary
                      color="blue"
                      className="segment-custom"
                      id={"plan" + plan.position}
                    >
                      <Header
                        className="headerPlan"
                        textAlign="center"
                        size="large"
                      >
                        {plan.headerIcon === sprinting ? (
                          <Image
                            src={plan.headerIcon}
                            style={{ height: 48, width: 50 }}
                          />
                        ) : (
                          <Image size="big" src={plan.headerIcon} />
                        )}

                        <Header.Content>
                          {t("hft.commons.plansName." + plan.name)}
                        </Header.Content>
                      </Header>
                      {/* <p>
                    <b className="maxProfit">{plan.maxProfit}</b> / {"   "}
                    <b className="maxRisk">{plan.maxRisk}</b>
                  </p> */}
                      <Divider />
                      {plan.headerIcon === sprinting ? (
                        <Image
                          centered
                          size="tiny"
                          src={plan.icon}
                          style={{ height: 75 }}
                        />
                      ) : (
                        <Image centered size="tiny" src={plan.icon} />
                      )}
                      <Divider hidden />
                      <Header id="minimumAmountToInvest" as="h3">
                        <span style={{ color: "green" }}>
                          {plan.maxProfit} {t("hft.listPlans.profit")}
                        </span>
                        <Header.Subheader>
                          <span style={{ color: "red" }}>
                            {plan.maxRisk} {t("hft.listPlans.risk")}
                          </span>
                        </Header.Subheader>
                      </Header>
                      <Divider hidden />
                      {/*<div style={{ textAlign: "justify" }}>
                        <List as="ol">
                          {plan.spanishFeatures.map((feature, i) => (
                            <List.Item as="li" value="-" key={i}>
                              {feature}
                            </List.Item>
                          ))}
                        </List>
                      </div>*/}
                      <p className="messageStylePlan">
                        {t("hft.listPlans.rendi")} <br />
                        {t("hft.listPlans.ganan")}
                      </p>
                      <Divider hidden />
                      <Header id="minimumAmountToInvest" as="h3">
                        {t("hft.listPlans.opening")} {plan.minAmount.BTC} BTC
                        <Header.Subheader>
                          <p className="messageStylePlan">
                            {t("hft.listPlans.minplace")}
                            <br />
                            {plan.holdingPeriodInDays}{" "}
                            {t("hft.listPlans.periodColocation")}
                          </p>
                        </Header.Subheader>
                      </Header>
                      <Divider hidden />
                      {/* <p className="infoCondition">
                    Período de corte: {plan.cuttoffPeriodInHours} horas
                  </p> */}
                    </Segment>
                    <Modal
                      size="small"
                      trigger={
                        <div>
                          <Popup
                            //   trigger={
                            //    <span>
                            //       <Button
                            //   type="submit"
                            //   color="blue"
                            //   size="large"
                            //   onClick={() =>
                            //     this.showInvestModal(
                            //       plan.name,
                            //       plan.minAmount.BTC,
                            //       t("hft.commons.plansName."+plan.name),
                            //       plan.icon
                            //     )
                            //   }
                            // >
                            //   {t("hft.listPlans.activateButton")}
                            // </Button>
                            //    </span>
                            //   }
                            content={t("hft.listPlans.goActivePlan")}
                            position="bottom center"
                          />
                        </div>
                      }
                      open={this.state.openInvestModal}
                      onClose={this.closeInvestModal}
                    >
                      <Modal.Header>
                        <Image
                          inline
                          spaced="right"
                          size="mini"
                          style={{ marginTop: -12 }}
                          src={this.state.planIconToInvest}
                        />
                        {t("hft.listPlans.modal.header.part1")}{" "}
                        {this.state.planSpanishNameToInvest}
                      </Modal.Header>
                      <Modal.Content>
                        <Modal.Description>
                          <Segment basic loading={this.state.loadingInvest}>
                            <p>
                              {t("hft.listPlans.modal.body.desc.p1")}{" "}
                              {this.state.planSpanishNameToInvest},
                              {t("hft.listPlans.modal.body.desc.p2")}{" "}
                              <b>{this.state.planMinAmountToInvest} BTC.</b>
                            </p>
                            <Grid centered columns="equal">
                              <Grid.Column largeScreen={10}>
                                <Form>
                                  <Form.Group widths="equal">
                                    <Form.Field>
                                      <Segment secondary>
                                        <Grid columns="equal">
                                          <Grid.Column>
                                            {t(
                                              "hft.listPlans.modal.body.yourWallet"
                                            )}{" "}
                                          </Grid.Column>
                                          <Grid.Column textAlign="right">
                                            <b>
                                              {this.state.amountWalletBTC} BTC{" "}
                                            </b>
                                          </Grid.Column>
                                        </Grid>
                                      </Segment>
                                    </Form.Field>
                                  </Form.Group>
                                  <Form.Group widths="equal">
                                    <Form.Field
                                      key={this.state.keyAmountToinvest}
                                    >
                                      <label>
                                        {t("hft.listPlans.modal.body.toInvest")}
                                      </label>
                                      <input
                                        placeholder="0.000001"
                                        onChange={this.handleAmountToInvest}
                                      />
                                      {labelAmount}
                                    </Form.Field>
                                  </Form.Group>
                                </Form>
                              </Grid.Column>
                            </Grid>
                          </Segment>
                        </Modal.Description>
                        {this.state.viewMessage && (
                          <Message color={this.state.colorMessage}>
                            {t(this.state.textMessage)}
                          </Message>
                        )}
                      </Modal.Content>
                      <Modal.Actions>
                        {!this.state.endCopy && (
                          <Button
                            color="blue"
                            type="submit"
                            onClick={this.closeInvestModal}
                            disabled={this.state.activatingModel}
                          >
                            {t("hft.listPlans.modal.actions.buttonClose")}
                          </Button>
                        )}
                        {!this.state.endCopy && (
                          <Button
                            onClick={this.activateModelWithoutToken}
                            color="blue"
                            type="submit"
                            disabled={this.state.activatingModel}
                          >
                            {t("hft.listPlans.modal.actions.buttonAccept")}
                          </Button>
                        )}
                        {this.state.endCopy && (
                          <Button
                            color="blue"
                            type="submit"
                            onClick={this.closeInvestModal}
                            disabled={this.state.activatingModel}
                          >
                            {t("hft.listPlans.modal.actions.buttonClose")}
                          </Button>
                        )}
                      </Modal.Actions>
                    </Modal>
                    <Divider hidden />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
            <Segment padded="very" raised secondary className="caracter-style">
              <Header
                dividing
                size={window.innerWidth < 364 ? "large" : "large"}
                className="headerPlan"
              >
                <Header.Content>
                  {t("hft.listPlans.features.header")}
                </Header.Content>
              </Header>
              <Divider hidden />
              <Grid centered columns={2}>
                <Grid.Row>
                  <Grid.Column
                    textAlign={window.innerWidth < 768 ? "center" : "justified"}
                    computer={8}
                    largeScreen={8}
                    tablet={8}
                    mobile={16}
                  >
                    <Header className="headerPlan">
                      <Image src={automaticTrading} />
                      <Header.Content>
                        {t("hft.listPlans.features.content.trading.header")}
                        <Header.Subheader>
                          {t(
                            "hft.listPlans.features.content.trading.subheader"
                          )}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Grid.Column>
                  <Grid.Column
                    textAlign={window.innerWidth < 768 ? "center" : "justified"}
                    computer={8}
                    largeScreen={8}
                    tablet={8}
                    mobile={16}
                  >
                    <Header className="headerPlan">
                      <Image src={trailingStops} />
                      <Header.Content>
                        {t("hft.listPlans.features.content.trailing.header")}
                        <Header.Subheader>
                          {t(
                            "hft.listPlans.features.content.trailing.subheader"
                          )}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    textAlign={window.innerWidth < 768 ? "center" : "justified"}
                    computer={8}
                    largeScreen={8}
                    tablet={8}
                    mobile={16}
                  >
                    <Header className="headerPlan">
                      <Image
                        src={backtesting}
                        centered={window.innerWidth < 768}
                      />
                      <Header.Content>
                        {t("hft.listPlans.features.content.backtesting.header")}
                        <Header.Subheader>
                          {t(
                            "hft.listPlans.features.content.backtesting.subheader"
                          )}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Grid.Column>
                  <Grid.Column
                    textAlign={window.innerWidth < 768 ? "center" : "justified"}
                    computer={8}
                    largeScreen={8}
                    tablet={8}
                    mobile={16}
                  >
                    <Header className="headerPlan">
                      <Image src={exchanges} />
                      <Header.Content>
                        Exchanges
                        <Header.Subheader>
                          {t(
                            "hft.listPlans.features.content.exchanges.subheader"
                          )}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Container>
        </Segment>
        <Responsive minWidth={992}>
          <Grid columns="equal" doubling>
            <Grid.Row centered columns={1} style={{ marginTop: "10px" }}>
              <Grid.Column>
                <PriceCoin source="home" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column largeScreen={11} mobile={16} tablet={16}>
                <Carrousel />
              </Grid.Column>
              <Grid.Column>
                <Segment color="orange">
                  <Header textAlign="center" as="h4" className="title">
                    {t("hft.listPlans.calculatorContainer.header")}{" "}
                    <Popup
                      trigger={<label className="atention">*</label>}
                      content={t("home.shortcut.atention")}
                      on="hover"
                    />
                  </Header>
                  <Divider />
                  <div className="text-center">
                    <Icon
                      name="bitcoin"
                      color="black"
                      size="large"
                      style={{ marginBottom: "7px" }}
                    />
                    <span style={{ color: "black", fontSize: "18px" }}>
                      {" "}
                      <b>BITCOIN</b>
                    </span>
                  </div>
                  <Divider hidden />
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={1} />
                      <Grid.Column width={7} textAlign="center">
                        <div as="h5">
                          <span style={{ fontSize: "10px" }}>
                            {t("hft.listPlans.calculatorContainer.buy")}
                          </span>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={7} textAlign="center">
                        <div as="h5">
                          <span style={{ fontSize: "10px" }}>
                            {t("hft.listPlans.calculatorContainer.sell")}
                          </span>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={1} />
                    </Grid.Row>
                  </Grid>
                  <List className="liststyle">{listT}</List>
                  <Divider hidden />

                  {window.sessionStorage.getItem("userType") !== "ADMIN" && (
                    <Header textAlign="center">
                      <Link to="/buy">
                        <Button
                          color="blue"
                          id="buy"
                          onClick={this.setItem.bind(this)}
                        >
                          <span style={{ color: "white", fontSize: "10px" }}>
                            {t("hft.listPlans.calculatorContainer.buttons.buy")}
                          </span>
                        </Button>
                      </Link>
                      <Link to="/sell">
                        <Button
                          color="blue"
                          id="sell"
                          onClick={this.setItem.bind(this)}
                        >
                          <span style={{ color: "white", fontSize: "10px" }}>
                            {t(
                              "hft.listPlans.calculatorContainer.buttons.sell"
                            )}
                          </span>
                        </Button>
                      </Link>
                    </Header>
                  )}
                  <Divider hidden />
                  <label className="atention">*</label>

                  <label className="atention2">
                    {t("home.shortcut.atention")}
                  </label>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered columns={1}>
              <Grid.Column style={{ textAlign: "center" }}>
                <Segment inverted>
                  <Header as="h4" inverted color="white">
                    {t("fiatCarouselStatistics.footerLabel")}
                  </Header>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered columns={1}>
              <Grid.Column>{fiat}</Grid.Column>
            </Grid.Row>
            <Divider hidden />
            <Grid.Row>
              <Grid.Column largeScreen={5} computer={5} mobile={16} tablet={16}>
                <Segment style={{ paddingTop: "4px", paddingBottom: "3px" }}>
                  <div />
                  <Item.Group className="banner-item">
                    <Item
                      as={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "a"
                          : ""
                      }
                      href={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "/registration"
                          : "/"
                      }
                    >
                      <Image
                        src={iconHome1}
                        size="tiny"
                        className="image-banner"
                      />
                      <Item.Content verticalAlign="top">
                        <Item.Header className="titleItem">
                          {t("home.banner.items.first.header")}
                        </Item.Header>
                        <Item.Meta>
                          <p className="justifyText">
                            {t("home.banner.items.first.content")}
                          </p>
                        </Item.Meta>
                      </Item.Content>
                    </Item>
                    <Divider hidden />
                    <Item
                      as={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "a"
                          : ""
                      }
                      href={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "/registration"
                          : "/"
                      }
                    >
                      <Image
                        src={iconHome2}
                        size="tiny"
                        className="image-banner"
                      />
                      <Item.Content verticalAlign="top">
                        <Item.Header className="titleItem">
                          {t("home.banner.items.second.header")}
                        </Item.Header>
                        <Item.Meta>
                          <p className="justifyText">
                            {t("home.banner.items.second.content")}
                          </p>
                        </Item.Meta>
                      </Item.Content>
                    </Item>
                    <Divider hidden />
                    <Item
                      as={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "a"
                          : ""
                      }
                      href={
                        window.sessionStorage.getItem("auth") !== "true"
                          ? "/registration"
                          : "/"
                      }
                    >
                      <Image
                        src={iconHome3}
                        size="tiny"
                        className="image-banner"
                      />
                      <Item.Content verticalAlign="top">
                        <Item.Header className="titleItem">
                          {t("home.banner.items.third.header")}
                        </Item.Header>
                        <Item.Meta>
                          <p className="justifyText">
                            {t("home.banner.items.third.content")}
                          </p>
                        </Item.Meta>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                  <div style={{ marginTop: "5px" }} />
                  <div />
                </Segment>
              </Grid.Column>
              <Grid.Column largeScreen={11} mobile={16} tablet={16}>
                {calculator}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ marginTop: "-80px" }}>
              <Grid.Column
                //largeScreen={5}
                computer={16}
                //mobile={16}
                //tablet={16}
              >
                <AssociatedCompaniesCarousel />
              </Grid.Column>
              <Grid.Column largeScreen={3} tablet={16} mobile={16} computer={3}>
                {/* <Segment
                  textAlign="center"
                  color="orange"
                  inverted
                  padded="very"
                >
                  <Header> Google Adsense</Header>
                </Segment> */}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered textAlign="center">
              <Header textAlign="center">{t("commons.benefits.header")}</Header>
            </Grid.Row>
            <Divider hidden />
            <Grid.Row columns="equal">
              <Grid.Column textAlign="center">
                <Image src={power} centered />
                <Header as="h5">
                  {t("commons.benefits.items.first.header")}
                </Header>
                <p>{t("commons.benefits.items.first.content")} </p>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Image src={lock} centered />
                <Header as="h5">
                  {t("commons.benefits.items.second.header")}
                </Header>
                <p>{t("commons.benefits.items.second.content")} </p>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Image src={x} centered />
                <Header as="h5">
                  {t("commons.benefits.items.third.header")}
                </Header>
                <p>{t("commons.benefits.items.third.content")} </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <MobileHome setItem={this.setItemMobile.bind(this)} />
        </Responsive>
        <Modal
          open={this.state.openSendConfirm}
          onClose={this.closeSendConfirm}
        >
          <Modal.Header>{t("hft.listPlans.modalConfirm.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>{t("hft.listPlans.modalConfirm.description")}</p>
              <Form>
                <Form.Field>
                  <label>Token</label>
                  <input
                    placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
                    onChange={this.handleToken}
                  />
                </Form.Field>
              </Form>
              {messageTokenNotFound}
              {messageTokenExpirated}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="grey" onClick={this.closeSendConfirm}>
              {t("hft.listPlans.modalConfirm.actions.buttonClose")}
            </Button>
            <Button
              disabled={this.state.verifyToken === ""}
              onClick={this.aceptSendConfirm}
              id="orangeConfirmTokenBtn"
            >
              <Icon name="checkmark" />
              {t("hft.listPlans.modalConfirm.actions.buttonAccept")}
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          closeIcon
          open={this.state.successfulCopy}
          onClose={this.closeSuccessfulCopy}
        >
          <Modal.Header>{t("hft.listPlans.modalSuccess.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>{t("hft.listPlans.modalSuccess.description")}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Modal
          closeIcon
          open={this.state.errorCopy}
          onClose={this.closeErrorCopy}
        >
          <Modal.Header>{t("hft.listPlans.modalFail.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>{t("hft.listPlans.modalFail.description")}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default translate(ListPlans);
