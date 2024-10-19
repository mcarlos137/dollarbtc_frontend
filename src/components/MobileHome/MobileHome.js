import React, { Component } from "react";
import {
  Grid,
  Segment,
  Image,
  Icon,
  Dropdown,
  Dimmer,
  Loader,
  Message,
  Button,
  Header,
  List,
  Container,
  Responsive,
  Divider,
} from "semantic-ui-react";
import "./MobileHome.css";
import otc from "../../services/otc";
import { Link } from "react-router-dom";
import { parse } from "query-string";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import user from "../../services/user";
import market from "../../services/market";
import currency from "../../common/currency";
import axios from "axios";
//Components
import CreditIconsHome from "../Home/CreditIcons/CreditIconsHome";
import PriceCoin from "../PriceCoin/PriceCoin";
import MobileCalculator from "./MobileCalculator/MobileCalculator";
import MobileFiat from "./MobileFiat/MobileFiat";
import CarouselPlatforms from "./MobileCarouselPlatforms/CarouselPlatforms";
import CarosuelBenefits from "./MobileCarouselBenefits/CarosuelBenefits";
import MobileOperations from "./MobileOperations/MobileOperations";
import MobileBalance from "./MobileBalance/MobileBalance";
import MobileOtherOperations from "./MobileOtherOptions/MobileOtherOptions";
import MobileHelp from "./MobileHelp/MobileHelp";
import MobileMoneyclick from "./MobileMoneyclick/MobileMoneyclick";
import WalletAndBalance from "../Home/WalletAndBalance/WalletAndBalance";
import iconDeposit from "../../img/icn-boton-depositar.png";
import iconTransfer from "../../img/icn-boton-transferir.png";
import logoBroker from "../../img/brokers.png";
import logodbtc from "../../img/logoDollarBtc.png";
import MoneyClickHome from "../Home/MoneyClickHome/MoneyClickHome";
import translate from "../../i18n/translate";
import packageJson from "../../../package.json";
class MobileHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenVerify: "",
      emailVerify: "",
      userVerify: false,
      coins: [],
      list: [],
      list2: [],
      show: false,
      scrollPosition: 0,
      buybutton: false,
      sellbutton: true,
      action: "buy",
      listCountrys: [],
      translator: props.translate,
      isMoneyclick: false,
      user: window.sessionStorage.getItem("username"),
      homeClient: packageJson.designCompany,
    };
    this.closeMessage = this.closeMessage.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  isMoneyclick() {
    let devices = JSON.parse(window.sessionStorage.getItem("devices"));
    if (devices !== null) {
      if (devices.length !== 0 || devices.length !== undefined) {
        for (let i = 0; i < devices.length; i++) {
          Object.entries(devices[i]).forEach(([key, value]) => {
            if (key === "source") {
              if (value === "MONEYCLICK") {
                this.setState({ isMoneyclick: true });
              }
            }
          });
        }
      }
    }
  }

  componentDidMount() {
    //console.log(this.props);
    this.getCoins();
    this.getCoins2();
    this.getPaymentType();
    this.isMoneyclick();
    const query = parse(window.location.search);
    if (query.t !== undefined) {
      var body = {
        token: query.t,
        email: query.e,
      };
      this.setState({ emailVerify: query.e });
      user.verifyUserRequest(body);
      this.setState({ userVerify: user.getRequestVerify() });
      user.verifyUserRequest(body).then((rep) => {
        this.setState({ userVerify: true });
        this.sendStartVerificationEmail(query.u);
        if (window.sessionStorage.getItem("auth") !== undefined) {
          if (window.sessionStorage.getItem("auth") === "true") {
            window.sessionStorage.setItem("verify", true);
          }
        }
      });
    }
  }
  sendStartVerificationEmail(email) {
    let bodybtc = {
      userName: email,
      fieldNames: ["email"],
      userVerificationType: "A",
      info: "Verification user email",
    };
    user
      .verifyUserRequestCore(bodybtc)
      .then((res) => {
        //console.log(res);
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  getPaymentType() {
    let arr = [];
    let resT = otc.getClientPaymentTypes();
    resT
      .then((res) => {
        Object.entries(res.data).forEach(([key, value]) => {
          let curren = currency.currencies.find(function (element) {
            return element.value === key;
          });
          if (curren !== undefined) {
            let ob = {
              flag: curren.flag,
              text: curren.textMob,
              value: { currency: key, value: value },
              key: key,
              data: { currency: key, value: value },
            };
            arr.push(ob);
          } else {
            let ob = {
              flag: "",
              text: "",
              value: { currency: key, value: value },
              key: key,
              data: { currency: key, value: value },
            };
            arr.push(ob);
          }
        });
        this.setState({ listCountrys: arr });
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  getCoins() {
    /* axios
      .get("https://service8081.dollarbtc.com/analysis/getFullPriceInfo")*/
    let url = market.getFullPriceInfo();
    url
      .then((res) => {
        if (res.data !== undefined) {
          Object.entries(res.data).forEach(([k, v]) => {
            let curren = currency.currencies.find(function (element) {
              return element.value === k;
            });
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
              let ob = {
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
  getCoins2() {
    /* axios
      .get("https://service8081.dollarbtc.com/website/getReducedOffers")*/
    let url = market.getReducedOffers();
    url.then((res) => {
      let arr = [];
      let body = {};
      if (res.data !== undefined) {
        Object.entries(res.data).forEach(([k, v]) => {
          let curren = currency.currencies.find(function (element) {
            if (element.value === v.currency) {
              body = {
                currency: v.currency,
                askPrice: v.askPrice,
                bidPrice: v.bidPrice,
                img: element.img,
              };
              arr.push(body);
            }
          });
          this.setState({
            list2: arr,
          });
        });
      }
    });
  }

  componentWillMount() {
    // this.props.setView(true);
  }
  closeMessage() {
    setTimeout(() => {
      this.setState({
        userVerify: false,
      });
    }, 7000);
  }
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  activeButtonBuy(e, data) {
    this.setState({ buybutton: false, sellbutton: true, action: "buy" });
  }
  activeButtonSell(e, data) {
    this.setState({ sellbutton: false, buybutton: true, action: "sell" });
  }
  handleCurrencyAction(e, data) {
    this.props.setItem(this.state.action);
    window.location.href =
      "/" + this.state.action + "/?c=" + data.value.currency;
  }
  render() {
    //console.log(window.innerWidth)
    let t = this.state.translator;
    let auth = sessionStorage.getItem("auth") === "true";
    let calculator;
    let listT, fiat;
    calculator = <MobileCalculator coins={this.state.list} />;
    fiat = <MobileFiat coins={this.state.list} />;
    // listT = this.state.list.map((element, i) => (
    //   <div>
    //     {element.value !== "BTC" && (
    //       <List.Item key={`key-${i}`}>
    //         <Grid>
    //           <Grid.Column width={3}>
    //             <Image
    //               size="mini"
    //               circular
    //               src={element.img}
    //               className="avaStyle"
    //             />
    //           </Grid.Column>
    //           <Grid.Column width={6} textAlign="right">
    //             <div style={{ marginBottom: "5px" }} />
    //             <span>
    //               {element.buy.toLocaleString("en-US", {
    //                 maximumFractionDigits: 2
    //               })}
    //             </span>
    //           </Grid.Column>
    //           <Grid.Column width={7} textAlign="right">
    //             <div style={{ marginBottom: "5px" }} />
    //             <span style={{ marginRight: "15px" }}>
    //               {element.sell.toLocaleString("en-US", {
    //                 maximumFractionDigits: 2
    //               })}
    //             </span>
    //           </Grid.Column>
    //         </Grid>
    //         <Divider hidden style={{ marginTop: "7px", marginBottom: "7px" }} />
    //       </List.Item>
    //     )}
    //   </div>
    // ));
    listT = this.state.list2.map((element, i) => (
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
                  {element.askPrice.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Grid.Column>
              <Grid.Column width={7} textAlign="right">
                <div style={{ marginBottom: "5px" }} />
                <span style={{ marginRight: "15px" }}>
                  {element.bidPrice.toLocaleString("en-US", {
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
    let rail;
    if (this.state.userVerify) {
      rail = (
        <Message
          color="black"
          header={
            <div>
              {t("home.notificationEmailVerify.header.line1 ")}
              <strong>{this.state.emailVerify}</strong>
              {t(" home.notificationEmailVerify.header.line2")}
            </div>
          }
          content={t("home.notificationEmailVerify.content")}
          size="tiny"
        />
      );
      this.closeMessage();
    }
    let wi = window.innerWidth;
    return (
      <div>
        {rail}
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={null} tablet={4} />
            <Grid.Column mobile={16} tablet={8}>
              {/* {!auth && (
                <Segment id="item-country-custom-mobile">
                  <Button.Group
                    size="mini"
                    style={{
                      marginLeft: window.innerWidth <= 364 ? 70 : 0,
                      marginRight: window.innerWidth <= 364 ? 10 : 10
                    }}
                  >
                    <Button
                      id="button-buy-menu"
                      color="green"
                      compact
                      size="mini"
                      name="buybutton"
                      basic={this.state.buybutton}
                      onClick={this.activeButtonBuy.bind(this)}
                    >
                      {t("home.shortcut.buy")}
                    </Button>
                    <Button
                      id="button-sell-menu"
                      color="red"
                      circular
                      name="sellbutton"
                      compact
                      onClick={this.activeButtonSell.bind(this)}
                      basic={this.state.sellbutton}
                    >
                      {t("home.shortcut.sell")}
                    </Button>
                  </Button.Group>
                  <Dropdown
                    icon={
                      <Icon name="angle down" style={{ marginLeft: "3px" }} />
                    }
                    style={{ marginLeft: window.innerWidth <= 364 ? 70 : 0 }}
                    placeholder={t("homeMobile.placeholderSelectCoin")}
                    floating
                    item={true}
                    onChange={this.handleCurrencyAction.bind(this)}
                    options={this.state.listCountrys}
                  />
                </Segment>
              )} */}
            </Grid.Column>
            <Grid.Column mobile={null} tablet={6} />
          </Grid.Row>
        </Grid>
        <Divider hidden />
        {window.sessionStorage.getItem("auth") === "true" && (
          <div>
            {this.props.balanceUser.availableusd === undefined ||
              this.props.balanceUsdUser === undefined ||
              (this.props.balancebtcUser === undefined && (
                <Dimmer active inverted>
                  <Loader inverted>Cargando...</Loader>
                </Dimmer>
              ))}
            {this.props.balanceUser.availableusd !== undefined &&
              this.props.balanceUsdUser !== undefined &&
              this.props.balancebtcUser !== undefined && (
                <div>
                  <Grid>
                    {this.state.homeClient !== "MAIN" && (
                      <Grid.Row>
                        <Grid.Column
                          mobile={
                            sessionStorage.getItem("userType") === "BROKER"
                              ? 8
                              : 16
                          }
                        >
                          <Image
                            centered
                            size="small"
                            id="logoBroker"
                            src={logodbtc}
                            alt=""
                          />
                        </Grid.Column>
                        {sessionStorage.getItem("userType") === "BROKER" && (
                          <Grid.Column mobile={8}>
                            <Image
                              style={{ marginTop: 5 }}
                              centered
                              size="small"
                              id="logoBroker"
                              src={logoBroker}
                              alt=""
                            />
                          </Grid.Column>
                        )}
                      </Grid.Row>
                    )}
                    <Grid.Row>
                      <Grid.Column mobile={16} tablet={16}>
                        <WalletAndBalance
                          balanceUser={this.props.balanceUser}
                          balanceUsdUser={this.props.balanceUsdUser}
                          balancebtcUser={this.props.balancebtcUser}
                          setItem={this.props.setItem.bind(this)}
                        />

                        <Divider hidden></Divider>
                        <Responsive minWidth={0} maxWidth={336}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="left">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 281
                                        ? "140px"
                                        : "130px",
                                    height: "40px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="right">
                                <Button
                                  size="large"
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 281
                                        ? "140px"
                                        : "130px",
                                    height: "40px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "30px",
                                        height: "20px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={337} maxWidth={372}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="left">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 355
                                        ? "140px"
                                        : "150px",
                                    height: "40px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="right">
                                <Button
                                  size="large"
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 355
                                        ? "140px"
                                        : "150px",
                                    height: "40px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "30px",
                                        height: "20px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={373} maxWidth={496}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="left">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 391
                                        ? "160px"
                                        : "170px",
                                    height: "40px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="right">
                                <Button
                                  size="large"
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    fontSize: 10,
                                    width:
                                      window.innerWidth <= 391
                                        ? "160px"
                                        : "170px",
                                    height: "40px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "30px",
                                        height: "20px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={497} maxWidth={673}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="left">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth <= 535
                                        ? "219px"
                                        : "240px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="right">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth <= 535
                                        ? "219px"
                                        : "240px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={674} maxWidth={710}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 681
                                        ? "300px"
                                        : "312px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 681
                                        ? "300px"
                                        : "312px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={711} maxWidth={753}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={754} maxWidth={767}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 764
                                        ? "308px"
                                        : "320px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={768} maxWidth={773}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width: "320px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={774} maxWidth={824}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 800
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                        <Responsive minWidth={825} maxWidth={991}>
                          <Grid>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.buy}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconDeposit}
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.deposit")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                            <Grid.Column largeScreen={8} mobile={8} tablet={8}>
                              <div align="center">
                                <Button
                                  style={{
                                    marginTop: 0,
                                    backgroundColor: "#207ef2 ",
                                    color: "white",
                                    width:
                                      window.innerWidth >= 756
                                        ? "345px"
                                        : "325px",
                                    height: "50px",
                                  }}
                                  onClick={this.sell}
                                >
                                  <div align="center">
                                    <Image
                                      src={iconTransfer}
                                      style={{
                                        width: "40px",
                                        height: "30px",
                                      }}
                                      spaced="right"
                                    />
                                    {""}
                                    {t("home.homeLogue.transfer")}
                                  </div>
                                </Button>
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Responsive>
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={16}>
                        <MoneyClickHome
                          balanceUser={this.props.balanceUserMoneyClick}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    {/* <Grid.Row>
                <Grid.Column mobile={16} tablet={16}>
                  <MobileBalance
                    balanceUser={this.props.balanceUser}
                    balanceUsdUser={this.props.balanceUsdUser}
                    setItem={this.props.setItem.bind(this)}
                  />
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8}>
                  <MobileMoneyclick />
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8}>
                  <MobileOperations setItem={this.props.setItem.bind(this)} />
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8}>
                  <MobileOtherOperations
                    setItem={this.props.setItem.bind(this)}
                  />
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8}>
                  <MobileHelp
                    setItem={this.props.setItem.bind(this)}
                    downloadGuide={this.props.downloadGuide}
                  />
                  <Divider hidden />
                </Grid.Column>
              </Grid.Row> */}
                  </Grid>
                </div>
              )}
          </div>
        )}
        {window.sessionStorage.getItem("auth") !== "true" && (
          <Container>
            <Grid.Column>
              <PriceCoin
                source="mobile"
                loading={this.state.list.length <= 0}
              />
            </Grid.Column>
            <Divider hidden />
            <Carousel
              id="carousel-mobile"
              showThumbs={false}
              showArrows={true}
              showStatus={false}
              interval={4000}
              autoPlay={true}
              infiniteLoop={true}
            >
              <Grid>
                <Grid.Row columns="1">
                  <Grid.Column mobile={16}>
                    <Segment
                      textAlign="center"
                      style={{
                        borderColor: "white",
                        border: "2px",
                        boxShadow: "0px 0px 0px 0px",
                      }}
                    >
                      <Header>
                        <span style={{ color: "#207ef2" }}>
                          {t("homeMobile.carousel.item1.header")}
                        </span>
                      </Header>
                      <p style={{ color: "#207ef2" }}>
                        {t("homeMobile.carousel.item1.content")}
                      </p>
                    </Segment>
                    <Divider hidden />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid>
                <Grid.Row columns="1">
                  <Grid.Column>
                    <Segment
                      textAlign="center"
                      style={{
                        borderColor: "white",
                        border: "2px",
                        boxShadow: "0px 0px 0px 0px",
                      }}
                    >
                      <Header>
                        <span style={{ color: "#207ef2" }}>
                          {t("homeMobile.carousel.item2.header")}
                        </span>
                      </Header>
                      <p style={{ color: "#207ef2" }}>
                        {t("homeMobile.carousel.item2.content")}
                      </p>
                    </Segment>
                    <Divider hidden />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid>
                <Grid.Row columns="1">
                  <Grid.Column>
                    <Segment
                      textAlign="center"
                      style={{
                        borderColor: "white",
                        border: "2px",
                        boxShadow: "0px 0px 0px 0px",
                      }}
                    >
                      <Header>
                        <span style={{ color: "#207ef2" }}>
                          {t("homeMobile.carousel.item3.header")}
                        </span>
                      </Header>
                      <p style={{ color: "#207ef2" }}>
                        {t("homeMobile.carousel.item3.content")}
                      </p>
                    </Segment>
                    <Divider hidden />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {/* <Grid>
              <Grid.Row columns="1">
                <Grid.Column>
                  <Segment
                    textAlign="center"
                    style={{
                      borderColor: "white",
                      border: "2px",
                      boxShadow: "0px 0px 0px 0px"
                    }}
                  >
                    <Header>
                      <span style={{ color: "#207ef2" }}>
                        {t("homeMobile.carousel.cryptoExchange.header")}
                      </span>
                    </Header>
                    <p style={{ color: "#207ef2" }}>
                      {t("homeMobile.carousel.cryptoExchange.content")}
                    </p>
                  </Segment>
                  <Divider hidden />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid>
              <Grid.Row columns="1">
                <Grid.Column>
                  <Segment
                    textAlign="center"
                    style={{
                      borderColor: "white",
                      border: "2px",
                      boxShadow: "0px 0px 0px 0px"
                    }}
                  >
                    <Header>
                      <span style={{ color: "#207ef2" }}>
                        {t("homeMobile.carousel.creditCards.header")}
                      </span>
                    </Header>
                    <p style={{ color: "#207ef2" }}>
                      {t("homeMobile.carousel.creditCards.content")}
                    </p>
                  </Segment>
                  <Divider hidden />
                </Grid.Column>
              </Grid.Row>
            </Grid> */}
            </Carousel>
          </Container>
        )}
        {window.sessionStorage.getItem("auth") !== "true" && (
          <Grid>
            <Grid.Row columns="equal" textAlign="center">
              <Grid.Column />
              <Grid.Column width={12}>
                <Segment textAlign="center" basic>
                  <Button
                    name="registration"
                    as={Link}
                    onClick={this.setItem.bind(this)}
                    to="/registration"
                    id="button-mobile"
                    color="blue"
                    className="get-access"
                    style={{
                      height: "40px",
                      width: "200px",
                    }}
                  >
                    {t("carousel.openAccount")}
                  </Button>
                </Segment>
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
            {/* <Grid.Row>
            <Grid.Column>
              <Segment inverted color="orange">
                <Header
                  as="h4"
                  style={{ textAlign: "center" }}
                  inverted
                  color="white"
                >
                  {t("fiatCarouselStatistics.footerLabel")}
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row> */}
            <Grid.Row>
              <Grid.Column mobile={16} tablet={8}>
                <Segment style={{ borderColor: "white", boxShadow: "none" }}>
                  <Header
                    textAlign="center"
                    as="h3"
                    style={{ fontWeight: "900", color: "#207ef2" }}
                  >
                    <strong>{t("home.shortcut.header")}</strong>
                  </Header>
                  <Divider style={{ borderColor: "#207ef2" }} />
                  <div className="text-center">
                    <Icon
                      name="bitcoin"
                      color="yellow"
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
                            {t("home.shortcut.buy")}
                          </span>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={7} textAlign="center">
                        <div as="h5">
                          <span style={{ fontSize: "10px" }}>
                            {t("home.shortcut.sell")}
                          </span>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={1} />
                    </Grid.Row>
                  </Grid>

                  <List className="liststyle-mobile">{listT}</List>
                  {window.sessionStorage.getItem("userType") !== "ADMIN" && (
                    <Header textAlign="center">
                      <Link to="/buy">
                        <Button
                          color="blue"
                          name="buy"
                          onClick={this.setItem.bind(this)}
                          // className="get-access"
                          style={{
                            borderRadius: "40px/40px",
                            height: "40px",
                            width: "130px",
                            marginRight: 10,
                          }}
                        >
                          <span style={{ color: "white", fontSize: "10px" }}>
                            {t("home.shortcut.buyVerb")}
                          </span>
                        </Button>
                      </Link>
                      <Link to="/sell">
                        <Button
                          color="blue"
                          name="sell"
                          onClick={this.setItem.bind(this)}
                          // className="get-access"
                          style={{
                            borderRadius: "40px/40px",
                            height: "40px",
                            width: "130px",
                            marginLeft: 10,
                          }}
                        >
                          <span style={{ color: "white", fontSize: "10px" }}>
                            {t("home.shortcut.sellVerb")}
                          </span>
                        </Button>
                      </Link>
                    </Header>
                  )}
                  {/* <label className="atention">*</label>
              
              <label className="atention2">{t("home.shortcut.atention")}</label> */}
                </Segment>
                {/*<Divider hidden />
              <Segment textAlign="center" color="orange" inverted padded="very">
                <Header> Google Adsense</Header>
              </Segment>*/}
                {/* {wi < 768 && <Divider hidden />} */}
              </Grid.Column>
              {/* <Grid.Column mobile={16} tablet={8} /> */}
            </Grid.Row>
            {/* <Grid.Row /> */}
          </Grid>
        )}

        {/*<Grid.Row>
            <Segment inverted>
            <Header
              as="h4"
              style={{ textAlign: "center" }}
              inverted
              color="white"
            >
              {t("fiatCarouselStatistics.footerLabel")}
            </Header>
          </Segment>
        </Grid.Row>*/}

        <Grid.Row centered columns={1}>
          <Grid.Column>
            {fiat}
            {/*<Divider hidden />
            <Segment textAlign="center" color="orange" inverted padded="very">
              <Header> Google Adsense</Header>
            </Segment>*/}

            <Divider hidden />
            {calculator}
          </Grid.Column>
        </Grid.Row>
      </div>
    );
  }
}
export default translate(MobileHome);
