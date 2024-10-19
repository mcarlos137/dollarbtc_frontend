import React, { Component } from "react";
import logo2 from "../../../img/logoDollarBtc.png";
import gmb from "../../../img/logo-gmb-responsive.png";
import convertrue from "../../../img/convertrue.png";
import logoBancript from "../../../img/Bancript.png";
import walletIcon from "../../../img/AA.png";
import "./SideNav.css";
import {
  Sidebar,
  Menu,
  Container,
  Image,
  Icon,
  Popup,
  Dropdown,
  Grid,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Home from "../../Home/Home";
import Wallet from "../../Wallet/Wallet";
import Profile from "../../Profile/Profile";
import HFTPlans from "../../HFTplans/HFTplans";
import Forum from "../../Forum/Forum";
import axios from "axios";
import config from "../../../services/config";
import otc from "../../../services/otc";
import user from "../../../services/user";
import model from "../../../services/model";
import BuyBitcoins from "../../BuyBitcoins/BuyBitcoins";
import SellBitcoins from "../../SellBitcoins/SellBitcoins";
import InboxMessage from "../../InboxMessage/InboxMessage";
import WhoWeAre from "../../Help/WhoWeAre/WhoWeAre";
import ContactUs from "../../ContactUs/ContactUs";
import translate from "../../../i18n/translate";
import Faqs from "../../Faqs/Faqs";
import FastChange from "../../FastChange/FastChange";
import Moneyclick from "../../Moneyclick/Moneyclick";
import Broker from "../../Brokers/Brokers";
import ISOCURRENCIES from "../../../common/ISO4217";
import utils from "../../../services/utils";
import { isMobile } from "react-device-detect";
import logoMC from "../../../img/logoNuevoMC.jpg";
import logoBROKER from "../../../img/brokers.png";
import blockchainPdf from "../../../common/Blockchain_ la revolucion indus - Preukschat (Coordinador).pdf";
import Charges from "../../Charges/Charges";
import LimitsOperations from "../../LimitsOfOperations/LimitsOfOperations";
import CompleteAccount from "../../Registration/CompleteAccount";
import Legal from "../../Legal/Legal";
import packageJson from "../../../../package.json";
import theter from '../../../img/tether-seeklogo.svg';

const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "home",
      visible: false,
      sidenavClient: packageJson.designCompany,
      homeactive: false,
      translator: props.translate,
      userUSDBalance: 0,
      userBTCBalance: 0,
      userBTCBalancenNew: 0,
    };
    this._isMounted = false;
  }
  getBalanceUserUpdate() {
    let username = user.getUserName();
    let response = user.getBalanceUser(username);
    response
      .then((resp) => {
        let acum = 0;
        let data1 = 0;
        let acumUSD = 0;
        let result = {
          available: 0,
          availableusd: 0,
          estimated: 0,
        };
        let acumdefered = 0;
        let acumdeferedUsd = 0;
        if (
          resp.data.result.modelBalances !== undefined &&
          resp.data.result.modelBalances.length > 0
        ) {
          for (let val of resp.data.result.modelBalances) {
            for (let data of val.availableAmounts) {
              if (data.currency === "BTC") {
                acum = acum + parseFloat(data.amount);
              }
              if (data.currency === "USD") {
                acumUSD = acumUSD + parseFloat(data.amount);
                if (isNaN(acumUSD)) {
                  acumUSD = 0;
                } else {
                  acumUSD = acumUSD;
                }
              }
            }
          }
        }
        let decimales = Math.pow(10, 8);
        let data2 = Math.floor(acum * decimales) / decimales;
        if (isNaN(data2)) {
          data2 = 0;
        } else {
          data2 = data2;
        }
        if (resp.data.result.availableAmounts !== undefined) {
          if (resp.data.result.availableAmounts.length > 0) {
            if (resp.data.result.availableAmounts[0].amount > 0) {
              acumdefered =
                acumdefered +
                Math.floor(
                  resp.data.result.availableAmounts[0].amount * decimales
                ) /
                  decimales;
            } else {
              acumdefered = acumdefered;
            }

            if (resp.data.result.availableAmounts[1].amount > 0) {
              let value = resp.data.result.availableAmounts[1].amount;
              if (isNaN(value)) {
                acumdeferedUsd = 0;
              } else {
                acumdeferedUsd = value;
              }
              //acumdeferedUsd =resp.data.result.availableAmounts[1].amount
            } else {
              acumdeferedUsd = 0;
            }
          }
        }
        if (resp.data.result.deferredAmounts !== undefined) {
          if (resp.data.result.deferredAmounts.length > 0) {
            if (resp.data.result.deferredAmounts[0].amount > 0) {
              acumdefered =
                acumdefered +
                Math.floor(
                  resp.data.result.deferredAmounts[0].amount * decimales
                ) /
                  decimales;
            } else {
              acumdefered = acumdefered;
            }
          }
        }
        result.available = acumdefered;
        result.availableusd = acumdeferedUsd;
        result.estimated = data2;
        let username = user.getUserName();
        let response = model.getInitialAmounts(username);
        response
          .then((resp) => {
            if (resp.data.length === 0) {
              this.setState({
                userUSDBalance: 0,
                userBTCBalanceNew: 0,
              });
            } else {
              var data = resp.data;
              let acumUSD = 0;
              let acumBTC = 0;
              Object.entries(data).forEach(([index, data]) => {
                if (data.currency === "USD") {
                  acumUSD = data.amount;
                  if (isNaN(acumUSD)) {
                    acumUSD = 0;
                  } else {
                    acumUSD = acumUSD;
                  }
                }
                if (data.currency === "BTC") {
                  acumBTC = data.amount;
                  if (isNaN(acumBTC)) {
                    acumBTC = 0;
                  } else {
                    acumBTC = acumBTC;
                  }
                }
                this.setState({
                  userUSDBalance: acumUSD,
                  userBTCBalanceNew: acumBTC,
                });
              });
            }
          })
          .catch((error) => {
            //console.log(error);
          });

        this.setState({
          userBTCBalance: result,
          view: true,
          // userUSDBalance: acumUSD
        });
        // if(this.state.userBTCBalance.availableusd !== undefined && this.state.userUSDBalance !== undefined &&
        // 	this.state.userBTCBalanceNew !== undefined)
        // {
        // 		this.setState({
        // 			show: true
        // 		  });

        // }
        window.sessionStorage.setItem("userBalanceBTC", JSON.stringify(result));
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  componentDidMount() {
    this._isMounted = true;
    let path = window.location.pathname.split("/");

    if (path[1] !== "") {
      this.setState({ activeView: path[1] });
    } else {
      this.setState({ activeView: "home" });
    }

    let arr = [];
    this.setState({ auth: user.getUserAuth() === "true" ? true : false });
    if (user.getUserAuth() === "true") {
      this.setState({ userBTCBalance: user.getBalanceStorageUserBTC() }, () => {
        //console.log(this.state.userBTCBalance);
      });
      this.getBalanceUserUpdate();
    }
    this.getGeneralTrans();
    this.updateWalletsInformation();
    let resT = otc.getCurrencies();
    resT
      .then((res) => {
        var currencies = res.data;
        let currencyCurrent = {};
        for (var i = 0; i < currencies.length; i++) {
          var currencyToAddSelect = {};
          let countryCoin = currencies[i].shortName.split("_");
          currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
          if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAddSelect.flag = currencyCurrent.flag;
          } else if(currencies[i].shortName === "ETH") {
					  currencyToAddSelect.icon = "ethereum";
          } else if(currencies[i].shortName === "USDT") {
            currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          };
           
          currencyToAddSelect.key = currencies[i].shortName;
          currencyToAddSelect.value = currencies[i].shortName;
          currencyToAddSelect.text = this.state.translator(
            "navCommons.coins.options." +
              utils.formatCountryCoinCode(currencies[i].shortName)
          );

          /*if (currencies[i].shortName === "USD") {
            currencyToAddSelect.key = "USD";
            currencyToAddSelect.value = "USD";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.usd");
            currencyToAddSelect.flag = "us";
          } else if (currencies[i].shortName === "VES") {
            currencyToAddSelect.key = "VES";
            currencyToAddSelect.value = "VES";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.ves");
            currencyToAddSelect.flag = "ve";
          } else if (currencies[i].shortName === "COP") {
            currencyToAddSelect.key = "COP";
            currencyToAddSelect.value = "COP";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.cop");
            currencyToAddSelect.flag = "co";
          } else if (currencies[i].shortName === "EUR") {
            currencyToAddSelect.key = "EUR";
            currencyToAddSelect.value = "EUR";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.eur");
            currencyToAddSelect.flag = "eu";
          } else if (currencies[i].shortName === "RD$") {
            currencyToAddSelect.key = "RD$";
            currencyToAddSelect.value = "RD$";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.rd$");
            currencyToAddSelect.flag = "do";
          } else if (currencies[i].shortName === "CLP") {
            currencyToAddSelect.key = "CLP";
            currencyToAddSelect.value = "CLP";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.clp");
            currencyToAddSelect.flag = "cl";
          } else if (currencies[i].shortName === "PEN") {
            currencyToAddSelect.key = "PEN";
            currencyToAddSelect.value = "PEN";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.pen");
            currencyToAddSelect.flag = "pe";
          } else if (currencies[i].shortName === "BRL") {
            currencyToAddSelect.key = "BRL";
            currencyToAddSelect.value = "BRL";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.brl");
            currencyToAddSelect.flag = "br";
          } else if (currencies[i].shortName === "ARS") {
            currencyToAddSelect.key = "ARS";
            currencyToAddSelect.value = "ARS";
            currencyToAddSelect.text =  this.state.translator("navCommons.coins.options.ars");
            currencyToAddSelect.flag = "ar";
          } else if (currencies[i].shortName === "MXN") {
            currencyToAddSelect.key = "MXN";
            currencyToAddSelect.value = "MXN";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.mxn");
            currencyToAddSelect.flag = "mx";
          } else if (currencies[i].shortName === "CRC") {
            currencyToAddSelect.key = "CRC";
            currencyToAddSelect.value = "CRC";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.crc");
            currencyToAddSelect.flag = "cr";
          } else if (currencies[i].shortName === "PAB") {
            currencyToAddSelect.key = "PAB";
            currencyToAddSelect.value = "PAB";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.pab");
            currencyToAddSelect.flag = "pa";
          } else if (currencies[i].shortName === "PA_USD") {
            currencyToAddSelect.key = "PA_USD";
            currencyToAddSelect.value = "PA_USD";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.paUsd");
            currencyToAddSelect.flag = "pa";
          }  else if (currencies[i].shortName === "ETH") {
            currencyToAddSelect.key = "ETH";
            currencyToAddSelect.value = "ETH";
            currencyToAddSelect.text = this.state.translator("navCommons.coins.options.eth");
            currencyToAddSelect.icon = "ethereum";
          } else {
            currencyToAddSelect.key = currencies[i].shortName;
            currencyToAddSelect.value = currencies[i].shortName;
            currencyToAddSelect.text = currencies[i].fullName;
          }*/
          arr.push(currencyToAddSelect);
        }
        this.setState({ listCountrys: arr });
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  updateWalletsInformation() {
    let addresses = [];
    let now = new Date();
    let creation,
      expiration = new Date();
    if (user.getWallets() === null) {
      addresses.push(user.getAddress());
    } else {
      Object.values(user.getWallets()).map((value) => {
        Object.entries(value).forEach(([date, wallet]) => {
          addresses.push(wallet.address);
          creation = new Date(date);
          expiration.setDate(creation.getDate() + 30);
          if (now.getTime() >= expiration.getTime()) {
            //console.log("Generating a new address, previous expired");
            this.generateNewAddress();
          }
        });
      });
    }
    if (addresses.length > 0 && addresses !== undefined) {
      this.webBlockCypherBTC("BTC", addresses, "nosingle");
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  handleItem(e, data) {
    if (this._isMounted) {
      this.setState({ activeView: data.name });
      this.props.setView(data.name);
    }

    this.setState({ active: data.name });
    this.getBalanceUserUpdate();
    this.getGeneralTrans();
    this.handlePusher();
    if (
      user.getAddress() !== "" &&
      user.getAddress() !== null &&
      user.getAddress() !== undefined
    ) {
      this.webBlockCypherBTC("BTC", user.getAddress(), "single");
    }
  }
  handlePusher() {
    if (this._isMounted) {
      const { visible } = this.state;
      if (visible) this.setState({ visible: false });
    }
  }
  handleToggle() {
    if (this._isMounted) {
      this.setState({ visible: !this.state.visible });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleSetView(view) {
    this.setState({ activeView: view });
    this.props.setView(view);
  }

  handleSubitemHelp(e, data) {
    if (this._isMounted) {
      this.setState({ activeView: data.value });
      this.props.setView(data.value);
    }
  }
  setView(data) {
    this.setState({ homeactive: data });
  }

  webBlockCypherBTC = (currency, addresses, source) => {
    if (addresses !== undefined && addresses !== null) {
      let cr = String(currency).toLowerCase();
      // //console.log(cr, address);
      let arrayPromises = [];
      if (source !== "single") {
        addresses.map((address) => {
          let url =
            config.apiBlockCypherUrl + "/" + cr + "/main/addrs/" + address;
          arrayPromises.push(axios.get(url, { withCredentials: false }));
        });
        axios
          .all(arrayPromises)
          .then(
            axios.spread((...responses) => {
              responses.forEach((res) => {
                var tx = res.data.txrefs;
                for (var j = 0; j < this.state.balanceDollarBTC.length; j++) {
                  if (this.state.balanceDollarBTC[j].currency === currency) {
                    var lastRegisteredTxDate = new Date(
                      this.state.balanceDollarBTC[j].amount
                    );
                    if (lastRegisteredTxDate === "Invalid Date") {
                      lastRegisteredTxDate = new Date(
                        "2010-12-10T01:02:29.000Z"
                      );
                    }
                  }
                }
                if (tx !== undefined && tx.length > 0) {
                  for (var x = 0; x < tx.length; x++) {
                    var newLatestTxDate;
                    if (tx[x].tx_input_n === -1) {
                      var txDate = new Date(tx[x].confirmed);
                      if (
                        txDate > lastRegisteredTxDate ||
                        lastRegisteredTxDate === undefined ||
                        lastRegisteredTxDate === null
                      ) {
                        var BTCvalue = tx[x].value * 0.00000001;
                        this.updateBalanceDBC(
                          BTCvalue,
                          currency,
                          res.data.address
                        );
                        if (
                          txDate > newLatestTxDate ||
                          newLatestTxDate === undefined ||
                          newLatestTxDate === null
                        ) {
                          newLatestTxDate = txDate;
                        }
                      }
                    }
                  }
                }
                if (newLatestTxDate !== undefined) {
                  this.updateDeposit(
                    newLatestTxDate.toISOString(),
                    res.data.address
                  );
                }
              });
            })
          )
          .catch((error) => {
            // //console.log(error);
          });
      } else {
        let url =
          config.apiBlockCypherUrl + "/" + cr + "/main/addrs/" + addresses;
        axios.get(url, { withCredentials: false }).then(
          (res) => {
            var tx = res.data.txrefs;
            for (var j = 0; j < this.state.balanceDollarBTC.length; j++) {
              if (this.state.balanceDollarBTC[j].currency === currency) {
                var lastRegisteredTxDate = new Date(
                  this.state.balanceDollarBTC[j].amount
                );
                if (lastRegisteredTxDate === "Invalid Date") {
                  lastRegisteredTxDate = new Date("2010-12-10T01:02:29.000Z");
                }
              }
            }
            if (tx !== undefined && tx.length > 0) {
              for (var x = 0; x < tx.length; x++) {
                var newLatestTxDate;
                if (tx[x].tx_input_n === -1) {
                  var txDate = new Date(tx[x].confirmed);
                  if (
                    txDate > lastRegisteredTxDate ||
                    lastRegisteredTxDate === undefined ||
                    lastRegisteredTxDate === null
                  ) {
                    var BTCvalue = tx[x].value * 0.00000001;
                    this.updateBalanceDBC(BTCvalue, currency, res.data.address);
                    if (
                      txDate > newLatestTxDate ||
                      newLatestTxDate === undefined ||
                      newLatestTxDate === null
                    ) {
                      newLatestTxDate = txDate;
                    }
                  }
                }
              }
            }
            if (newLatestTxDate !== undefined) {
              this.updateDeposit(
                newLatestTxDate.toISOString(),
                res.data.address
              );
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  };

  getGeneralTrans = function () {
    axios
      .get(URL_BASE_BUSHIDO + "/api/v2/tx/deposit/user/" + user.getUserName(), {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      })
      .then((res) => {
        this.setState({ balanceDollarBTC: res.data.payload });
      })
      .catch((error) => {
        ////console.log(error);
      });
  };
  floorDecimals(value, numberDecimals) {
    let decimales = Math.pow(10, numberDecimals);
    let n=Math.floor(value * decimales) / decimales;
    if (isNaN(n)) {
    n= 0;
  }
    return n;
  }
  handleItemHome(e, data) {
    this.setState({ activeView: data.name });
    this.props.setView(data.name);
  }
  closeSession() {
    user.logout();
    //window.sessionStorage.clear();
    window.location.href = "/";
  }
  render() {
    let message;
    message = <InboxMessage />;
    let t = this.state.translator;
    let friendOptions = [
      { text: t("navPublic.lang.en"), value: "en", disabled: false },
      { text: t("navPublic.lang.es"), value: "es" },
    ];

    if (isMobile === true) {
      friendOptions = [
        { text: t("navPublic.lang.resume.en"), value: "en", disabled: false },
        { text: t("navPublic.lang.resume.es"), value: "es" },
      ];
    }

    let wind = window.innerWidth;

    let nickname = window.sessionStorage.getItem("nickname");
    let email = window.sessionStorage.getItem("email");
    let username = window.sessionStorage.getItem("username");
    if (nickname !== null && nickname !== undefined) {
      let sizenick = nickname.length;
      if (sizenick > 10) {
        nickname = nickname.substring(0, 10);
      }
    }
    let sizemail = email.length;
    let sizeuser = username.length;

    if (sizemail > 10) {
      email = email.substring(0, 10);
    }

    if (sizeuser > 10) {
      username = username.substring(0, 10);
    }

    let active = this.state.activeView;
    let s;

    let { handleClick } = this.props;
    if (this._isMounted) {
      s = (
        <div>
          {window.sessionStorage.getItem("auth") === "true" &&
            window.sessionStorage.getItem("userType") !== "ADMIN" && (
              <Menu
                fixed="top"
                text
                className={
                  this.state.sidenavClient === "MAIN" ||
                  this.state.sidenavClient === "CONVERTRUE"
                    ? "nav-admin"
                    : "nav-adminClient"
                }
                fluid
                size="tiny"
              >
                <Container>
                  <Menu.Item>
                    <span>
                      <Dropdown
                        id="lengu-selectMovile"
                        style={{ marginLeft: "10px" }}
                        inline
                        icon={<Icon name="angle down" inverted />}
                        options={friendOptions}
                        defaultValue={this.props.language}
                        onChange={handleClick}
                      />
                    </span>
                  </Menu.Item>
                </Container>
              </Menu>
            )}
          {window.sessionStorage.getItem("auth") === "true" &&
            window.sessionStorage.getItem("userType") !== "ADMIN" && (
              <Sidebar.Pushable
                style={{
                  marginTop: "25px",
                  marginLeft: window.innerWidth >= 764 ? "50px" : "0px",
                  marginRight: window.innerWidth >= 764 ? "50px" : "0px",
                }}
              >
                <Sidebar
                  className="nav"
                  as={Menu}
                  animation="push"
                  direction="left"
                  icon="labeled"
                  inverted
                  vertical
                  visible={this.state.visible}
                  width="thin"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Menu.Item
                    name="home"
                    as={Link}
                    to="/home"
                    active={active === "home"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">{t("nav.init")}</span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="buy"
                    to="/buy"
                    active={active === "buy"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.buy")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="sell"
                    to="/sell"
                    active={active === "sell"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.sell")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="forum"
                    to="/forum"
                    active={active === "forum"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.forum")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="HFTplans"
                    to="/HFTplans"
                    active={active === "HFTplans"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navPublic.account.options.hft")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    to="/wallet"
                    id="wallet"
                    name="wallet"
                    active={active === "wallet"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile"> WALLET</span>
                  </Menu.Item>
                  <Menu.Item
                    id="profile"
                    name="profile"
                    active={active === "profile"}
                    as={Link}
                    to="/profile"
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile">{t("nav.profile")}</span>
                  </Menu.Item>
                  <Menu.Item
                    id="faqs"
                    name="faqs"
                    as={Link}
                    to="/faqs"
                    active={active === "faqs"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile">
                      {t("navCommons.help.options.faqs")}
                    </span>
                  </Menu.Item>
                  {/* <Dropdown
              item
              text={
                <span style={{ color: "white", fontSize: "11px" }}>
                  {t("navCommons.help.header")}
                </span>
              }
              style={{ backgroundColor: "#207ef2" }}
            >

              <Dropdown.Menu id="list-options-drop-side">
                <Dropdown.Item
                  value="support"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/"
                  disabled
                  style={{ backgroundColor: "#207ef2" }}
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.support")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item onClick={this.props.onClickDownloadGuide} style={{ backgroundColor: "#207ef2" }}>
                  <span className="list-item-custom-admin">
                    {t("navCommons.help.options.guide")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="faqs"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/faqs"
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.faqs")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="contact"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/contact"
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.contact")}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
                  <Dropdown
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                    item
                    text={
                      <span
                        style={{
                          color: "white",
                          fontSize: "11px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("navCommons.help.header")}
                      </span>
                    }
                  >
                    <Dropdown.Menu
                      id="list-options-drop-side-public"
                      style={{
                        backgroundColor:
                          this.state.sidenavClient === "GMB" ||
                          this.state.sidenavClient === "BANCRIPT"
                            ? "#000000"
                            : "#207ef2",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      <Dropdown.Item
                        value="support"
                        onClick={this.handleSubitemHelp.bind(this)}
                        disabled
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.support")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="limits"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/limits"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.limits")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="charges"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/charges"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.charges")}
                        </span>
                      </Dropdown.Item>
                      {/* <Dropdown.Item onClick={this.props.onClickDownloadGuide}>
                  <span
                    className="list-item-custom-admin"
                    style={{
                      backgroundColor: "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                  >
                    {t("navCommons.help.options.guide")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <a href={blockchainPdf} target="_blank">
                    <span
                      className="list-item-custom-admin"
                      style={{
                        backgroundColor: "#207ef2",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {t("navCommons.help.options.blockchain")}
                    </span>
                  </a>
                </Dropdown.Item> */}
                      <Dropdown.Item
                        value="legal"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/legal"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.legal")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="contact"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/contact"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.contact")}
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item
                    name={t("closeSession")}
                    as={Link}
                    to="/home"
                    id="closeSession-mobile"
                    onClick={this.closeSession.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">{t("nav.logout")}</span>
                  </Menu.Item>
                  <Menu.Item style={{ backgroundColor: "#ffffff" }}>
                    <Menu.Item
                      as={Link}
                      to="/moneyclick"
                      name="moneyclick"
                      id="moneyclick"
                      onClick={this.handleItem.bind(this)}
                      style={{ marginLeft: -23 }}
                    >
                      <Image src={logoMC} alt="" size="big" />
                    </Menu.Item>

                    {window.sessionStorage.getItem("userType") === "BROKER" && (
                      <Menu.Item
                        as={Link}
                        to="/broker"
                        name="broker"
                        id="broker"
                        onClick={this.handleItem.bind(this)}
                      >
                        <label
                          className="nav-publicBrokers-question"
                          style={{ marginLeft: -23 }}
                        >
                          ¿Eres Broker?
                        </label>
                        <br></br>
                        <label
                          className="nav-publicBrokers-question"
                          style={{ marginLeft: -23 }}
                        >
                          Seleccione aqui!
                        </label>
                        <br></br>
                        <br></br>
                        {/* <label className="nav-publicBrokers" style={{ marginLeft: -32}}><strong>BROKERS</strong></label> */}
                        <Image
                          src={logoBROKER}
                          alt=""
                          size="big"
                          style={{ marginLeft: -13 }}
                        />
                      </Menu.Item>
                    )}

                    {/* <Menu.Item
                as={Link}
                to="/broker"
                name="broker"
                id="broker"
                onClick={this.handleItem.bind(this)}
              >
                <label className="nav-publicBrokers-question">
                  ¿Eres Broker?
                </label>
                <br></br>
                <label className="nav-publicBrokers-question">
                  Seleccione aqui!
                </label>
                <br></br>
                <br></br>
                {/* <label className="nav-publicBrokers" style={{ marginLeft: -32}}><strong>BROKERS</strong></label> */}
                    {/* <Image src={logoBROKER} alt="" size="big" />
              </Menu.Item> */}
                  </Menu.Item>
                  {/* <Menu.Item
              as={Link}
              to="/whoweare"
              id="whoweare"
              name="whoweare"
              active={active === "whoweare"}
              onClick={this.handleItem.bind(this)}
              style={{ marginRight: "0px", borderRightStyle: "hidden" }}
            >
              <span className="menu-item">
                {t("navCommons.help.options.who")}
              </span>
            </Menu.Item> */}
                </Sidebar>
                <Sidebar.Pusher>
                  {window.innerWidth < 500 && (
                    <Menu
                      fixed="top"
                      inverted
                      className="nav"
                      style={{ backgroundColor: "white" }}
                    >
                      <Grid>
                        <Grid.Row>
                          <Menu.Item
                            // fitted
                            // style={{ marginRight: window.innerWidth <= 364 ? 0 : 0 }}

                            position="left"
                            style={{ backgroundColor: "white" }}
                            onClick={this.handleToggle.bind(this)}
                          >
                            <span>
                              {/* <Dropdown
                    id="lengu-select"
                    style={{ marginLeft: "10px" }}
                    inline
                    icon={<Icon name="angle down" inverted />}
                    options={friendOptions}
                    defaultValue={this.props.language}
                    onChange={handleClick}
                  /> */}
                              <Icon
                                name="bars"
                                size="large"
                                style={{
                                  color:
                                    this.state.sidenavClient === "GMB" ||
                                    this.state.sidenavClient === "BANCRIPT"
                                      ? "#000000"
                                      : "#207ef2",
                                }}
                                inverted
                              />
                            </span>
                          </Menu.Item>

                          {/* <Menu.Menu position="right" className="nav">


                <Menu.Item
                  //fitted = "horizontally"
                  style={{ marginRight: "25px" }}
                  as={Link}
                  to="/wallet"
                  name="wallet"
                  onClick={this.handleItem.bind(this)}
                >
                  <Popup
                    trigger={
                      <p>
                        <span style={{ marginLeft: "1 px" }}>
                          <Image src={walletIcon} verticalAlign="middle" />
                          <span style={{ color: "white", marginLeft: "1 px" }}>
                            {this.props.balanceUser.available}
                          </span>
                          <Icon
                            name="btc"
                            style={{ color: "white", marginRight: "1 px" }}
                          />
                        </span>
                      </p>
                    }
                    content="Wallet"
                    position="bottom left"
                  />
                </Menu.Item>
              </Menu.Menu> */}

                          {/* cerrar session  */}
                          <Menu.Item
                            position="left"
                            name="home"
                            id="home"
                            active={active === "home"}
                            onClick={this.handleItemHome.bind(this)}
                            style={{
                              marginLeft:
                                window.innerWidth >= 370 ? "0px" : "-20px",
                              marginRight:
                                window.innerWidth >= 437 ? "-40px" : "-20px",
                              backgroundColor: "white",
                              width: 180,
                            }}
                            as={Link}
                            to="/"
                          >
                            <Image
                              style={
                                this.state.sidenavClient !== "CONVERTRUE"
                                  ? {
                                      width:
                                        window.innerWidth >= 437 ? 300 : 150,
                                      height:
                                        window.innerWidth >= 437 ? 50 : 50,
                                      marginLeft:
                                        window.innerWidth >= 500
                                          ? "-50px"
                                          : "0px",
                                    }
                                  : {
                                      width:
                                        window.innerWidth >= 437 ? 300 : 150,
                                      height:
                                        window.innerWidth >= 437 ? 50 : 30,
                                      marginLeft:
                                        window.innerWidth >= 500
                                          ? "-50px"
                                          : "0px",
                                    }
                              }
                              src={
                                this.state.sidenavClient === "BANCRIPT"
                                  ? logoBancript
                                  : this.state.sidenavClient === "GMB"
                                  ? gmb
                                  : this.state.sidenavClient === "CONVERTRUE"
                                  ? convertrue
                                  : logo2
                              }
                            />
                          </Menu.Item>
                          <Menu.Item
                            style={{
                              marginLeft:
                                window.innerWidth >= 437 ? "-200px" : "-50px",
                              marginRight:
                                window.innerWidth >= 437 ? "100px" : "0px",
                              width: 80,
                            }}
                          >
                            {message}
                          </Menu.Item>
                          {/* <Menu.Item  style={{ backgroundColor: "white",width:80 }}>
              {message}
              </Menu.Item>
              <Menu.Item  position="left" style={{ backgroundColor: "white",width:70 }} >
                  <Dropdown  style={this.state.sidenavClient === "MAIN" ? { color: "#207ef2" } : { color: "#000000" }}
                   id="drop-nav-login2"
                   icon={null}
                   text={
                    <Icon name="user circle" size="large" inverted style={this.state.sidenavClient === "MAIN" ? { color: "#207ef2" } : { color: "#000000" }}/>
                  }
                  >
                    <Dropdown.Menu as="div" id="list-options-drop" position="rigth">
                      <Dropdown.Item as={Link} to="/profile">
                        <span className="list-item-custom-admin">
                          {t("nav.profile")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.closeSession.bind(this)}>
                        <span className="list-item-custom-admin">
                          {t("nav.logout")}
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> 
                 </Menu.Item> */}
                          <Menu.Item
                            position="right"
                            style={{
                              marginLeft:
                                window.innerWidth >= 352 ? "-5px" : "-20px",
                              backgroundColor: "white",
                            }}
                          >
                            <span>
                              <Dropdown
                                style={
                                  this.state.sidenavClient === "MAIN" ||
                                  this.state.sidenavClient === "CONVERTRUE"
                                    ? { color: "#207ef2" }
                                    : { color: "#000000" }
                                }
                                id="drop-nav-login2"
                                icon={null}
                                text={
                                  <Icon
                                    name="user circle"
                                    size="large"
                                    inverted
                                    style={
                                      this.state.sidenavClient === "MAIN" ||
                                      this.state.sidenavClient === "CONVERTRUE"
                                        ? { color: "#207ef2" }
                                        : { color: "#000000" }
                                    }
                                  />
                                }
                              >
                                <Dropdown.Menu
                                  as="div"
                                  id="list-options-drop"
                                  position="rigth"
                                >
                                  <Dropdown.Item as={Link} to="/profile">
                                    <span className="list-item-custom-admin">
                                      {t("nav.profile")}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={this.closeSession.bind(this)}
                                  >
                                    <span className="list-item-custom-admin">
                                      {t("nav.logout")}
                                    </span>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </span>
                          </Menu.Item>
                        </Grid.Row>
                        {window.innerWidth < 500 && (
                          <Grid.Row>
                            <Menu.Item
                              position="right"
                              style={{
                                marginLeft:
                                  window.innerWidth >= 352 ? "-5px" : "-20px",
                                backgroundColor: "white",
                              }}
                            >
                              <Segment
                                inverted
                                style={{
                                  marginTop: -100,
                                  marginLeft:
                                    window.innerWidth >= 1200 ? -220 : -100,
                                  width: window.innerWidth >= 1200 ? 210 : 170,
                                  height: 45,
                                  backgroundColor: "#ffffff",
                                }}
                              >
                                <Grid
                                  style={{
                                    marginTop: -25,
                                  }}
                                >
                                  <Grid.Row>
                                    <Grid.Column>
                                      <Menu.Item
                                        style={{
                                          marginLeft:
                                            window.innerWidth >= 1200 ? 0 : -15,
                                          color: "#207ef2",
                                        }}
                                      >
                                        <span className="menu-item1">
                                          {t("nav.availableBalance")}
                                        </span>
                                      </Menu.Item>
                                    </Grid.Column>
                                  </Grid.Row>
                                  <Grid.Row
                                    columns="equal"
                                    style={{
                                      marginTop: -30,
                                    }}
                                  >
                                    <Grid.Column>
                                      <Menu.Item
                                        style={{
                                          marginTop: -5,
                                          color: "#000000",
                                        }}
                                        to="/buy"
                                        name="buy"
                                        id="buy"
                                        active={active === "buy"}
                                      >
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 9,
                                            fontWeight: "900",
                                            marginLeft:
                                              window.innerWidth >= 1200
                                                ? 0
                                                : -15,
                                          }}
                                        >
                                          {this.state.userBTCBalance
                                            .availableusd !== 0
                                            ? this.floorDecimals(
                                                this.state.userBTCBalance
                                                  .availableusd,
                                                2
                                              )
                                            : 0}
                                          {" USD"}
                                        </span>
                                      </Menu.Item>
                                    </Grid.Column>
                                    <Grid.Column>
                                      <Menu.Item
                                        style={{
                                          marginTop: -5,
                                          color: "#000000",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "black",
                                            fontSize: 9,
                                            fontWeight: "900",
                                            marginLeft: -40,
                                            marginRight:
                                              window.innerWidth >= 1200
                                                ? 0
                                                : -30,
                                          }}
                                        >
                                          {this.state.userBTCBalance
                                            .available !== 0
                                            ? this.floorDecimals(
                                                this.state.userBTCBalance
                                                  .available,
                                                8
                                              )
                                            : 0}
                                          {" BTC"}
                                        </span>
                                      </Menu.Item>
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              </Segment>
                            </Menu.Item>
                          </Grid.Row>
                        )}
                      </Grid>
                    </Menu>
                  )}

                  {window.innerWidth >= 500 && (
                    <Menu
                      fixed="top"
                      inverted
                      className="nav"
                      style={{ backgroundColor: "white" }}
                    >
                      <Menu.Item
                        position="left"
                        style={{ backgroundColor: "white" }}
                        onClick={this.handleToggle.bind(this)}
                      >
                        <span>
                          <Icon
                            name="bars"
                            size="large"
                            style={{
                              color:
                                this.state.sidenavClient === "GMB" ||
                                this.state.sidenavClient === "BANCRIPT"
                                  ? "#000000"
                                  : "#207ef2",
                            }}
                            inverted
                          />
                        </span>
                      </Menu.Item>
                      <Menu.Item
                        position="left"
                        name="home"
                        id="home"
                        active={active === "home"}
                        onClick={this.handleItemHome.bind(this)}
                        style={{
                          marginLeft:
                            window.innerWidth >= 370 ? "0px" : "-20px",
                          marginRight:
                            window.innerWidth >= 437 ? "-40px" : "-20px",
                          backgroundColor: "white",
                          width: 180,
                        }}
                        as={Link}
                        to="/"
                      >
                        <Image
                          style={
                            this.state.sidenavClient !== "CONVERTRUE"
                              ? {
                                  width: window.innerWidth >= 437 ? 300 : 150,
                                  height: window.innerWidth >= 437 ? 50 : 50,
                                  marginLeft:
                                    window.innerWidth >= 500 ? "-50px" : "0px",
                                }
                              : {
                                  width: window.innerWidth >= 437 ? 280 : 150,
                                  height: window.innerWidth >= 437 ? 35 : 30,
                                  marginLeft:
                                    window.innerWidth >= 500 ? "-50px" : "0px",
                                }
                          }
                          src={
                            this.state.sidenavClient === "BANCRIPT"
                              ? logoBancript
                              : this.state.sidenavClient === "GMB"
                              ? gmb
                              : this.state.sidenavClient === "CONVERTRUE"
                              ? convertrue
                              : logo2
                          }
                        />
                      </Menu.Item>
                      <Menu.Item
                        style={{
                          marginLeft:
                            window.innerWidth >= 437 ? "-200px" : "-50px",
                          marginRight:
                            window.innerWidth >= 437 ? "100px" : "0px",
                          width: 80,
                        }}
                      >
                        {message}
                      </Menu.Item>
                      <Menu.Item>
                        <Segment
                          inverted
                          style={{
                            marginTop: 10,
                            marginLeft: -80,
                            marginRight: -100,
                            width: 200,
                            height: 65,
                            backgroundColor: "#DDE2E8",
                          }}
                        >
                          <Grid
                            style={{
                              marginTop: -35,
                            }}
                          >
                            <Grid.Row>
                              <Grid.Column>
                                <Menu.Item
                                  style={
                                    this.state.navClient !== "GMB" &&
                                    this.state.navClient !== "BANCRIPT"
                                      ? {
                                          marginLeft:
                                            window.innerWidth >= 1200 ? 0 : -15,
                                          color: "#207ef2",
                                        }
                                      : { color: "#000000" }
                                  }
                                >
                                  <span className="menu-item1">
                                    {t("nav.availableBalance")}
                                  </span>
                                </Menu.Item>
                              </Grid.Column>
                            </Grid.Row>
                            <Grid.Row
                              columns="equal"
                              style={{
                                marginTop: -30,
                              }}
                            >
                              <Grid.Column>
                                <Menu.Item
                                  style={{
                                    marginTop: -5,
                                    color: "#000000",
                                  }}
                                  to="/buy"
                                  name="buy"
                                  id="buy"
                                  active={active === "buy"}
                                >
                                  <span
                                    style={{
                                      color: "black",
                                      fontSize:
                                        window.innerWidth >= 620 ? 11 : 8,
                                      fontWeight: "900",
                                      marginLeft:
                                        window.innerWidth >= 620 ? -15 : -20,
                                    }}
                                  >
                                    {this.state.userBTCBalance !== 0
                                      ? this.floorDecimals(
                                          this.state.userBTCBalance
                                            .availableusd,
                                          2
                                        )
                                      : 0}
                                    {" USD"}
                                  </span>
                                </Menu.Item>
                              </Grid.Column>
                              <Grid.Column>
                                <Menu.Item
                                  style={{
                                    marginTop: -5,
                                    color: "#000000",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "black",
                                      fontSize:
                                        window.innerWidth >= 620 ? 11 : 8,
                                      fontWeight: "900",
                                      marginLeft:
                                        window.innerWidth >= 620 ? -30 : -40,
                                      marginRight:
                                        window.innerWidth >= 620 ? -30 : -40,
                                    }}
                                  >
                                    {this.state.userBTCBalance.available !== 0
                                      ? this.floorDecimals(
                                          this.state.userBTCBalance.available,
                                          8
                                        )
                                      : 0}
                                    {" BTC"}
                                  </span>
                                </Menu.Item>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Segment>
                      </Menu.Item>

                      <Menu.Item
                        position="right"
                        style={{
                          marginLeft:
                            window.innerWidth >= 352 ? "-5px" : "-20px",
                          backgroundColor: "white",
                        }}
                      >
                        <span>
                          <Dropdown
                            style={
                              this.state.sidenavClient === "MAIN" ||
                              this.state.sidenavClient === "CONVERTRUE"
                                ? { color: "#207ef2" }
                                : { color: "#000000" }
                            }
                            id="drop-nav-login2"
                            icon={null}
                            text={
                              <Icon
                                name="user circle"
                                size="large"
                                inverted
                                style={
                                  this.state.sidenavClient === "MAIN" ||
                                  this.state.sidenavClient === "CONVERTRUE"
                                    ? { color: "#207ef2" }
                                    : { color: "#000000" }
                                }
                              />
                            }
                          >
                            <Dropdown.Menu
                              as="div"
                              id="list-options-drop"
                              position="rigth"
                            >
                              <Dropdown.Item as={Link} to="/profile">
                                <span className="list-item-custom-admin">
                                  {t("nav.profile")}
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={this.closeSession.bind(this)}
                              >
                                <span className="list-item-custom-admin">
                                  {t("nav.logout")}
                                </span>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </span>
                      </Menu.Item>
                    </Menu>
                  )}

                  {/* <Menu.Menu position="right" className="nav">
                <Menu.Item
                  fitted
                  icon={<Icon name="user circle" size="large" inverted />}
                  as={Link}
                  name="profile"
                  to="/profile"
                  id="profile-mobile"
                  content={
                    nickname !== ""
                      ? nickname
                      : t("navPublic.account.header") || username !== ""
                      ? username
                      : t("navPublic.account.header") || email !== ""
                      ? email
                      : t("navPublic.account.header")
                  }
                  style={{ fontStyle: "bold" }}
                  inline="true"
                  onClick={this.handleItem.bind(this)}
                />
                <InboxMessage />

                <Menu.Item
                  to="/"
                  style={{ marginRight: "10px", color: "white" }}
                  as={Link}
                  onClick={this.closeSession.bind(this)}
                  //icon={<Icon name="sign out alternate icon" size= {"large"}/>}
                >
                  <Popup
                    trigger={
                      <p>
                        <span style={{ marginLeft: "1 px" }}>
                          <Icon name="sign out" size={"large"} />
                        </span>
                      </p>
                    }
                    content={t("nav.logout")}
                    position="bottom left"
                  />
                </Menu.Item>
              </Menu.Menu> */}
                  {/* <Menu widths={1} id="home-mobile-version-menu-login">
              <Menu.Item
                name="home"
                id="home"
                active={this.state.activeView === "home"}
                onClick={this.handleItem.bind(this)}
              >
                <Image style={{ width: 220, height: 70 }} src={logo2} />
              </Menu.Item>
            </Menu> */}

                  <Grid columns="equal" id="grid-mobile-home">
                    <Grid.Row textAlign="center" className="titleComponent">
                      <Grid.Column mobile={6} tablet={6} />
                      <Grid.Column textAlign="center" mobile={5} tablet={5}>
                        {this.state.activeView !== "home" && (
                          <Segment
                            id="segment-style-home-mobile"
                            textAlign="center"
                          >
                            <Dropdown
                              item
                              icon={
                                <Icon
                                  name="bars"
                                  size="large"
                                  color="grey"
                                  inverted
                                />
                              }
                            >
                              <Dropdown.Menu id="list-options-drop-side-public-mobile-version">
                                <Dropdown.Item
                                  as={Link}
                                  to="/buy"
                                  name="buy"
                                  id="buy-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.buyMobile")}
                                  </span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as={Link}
                                  to="/sell"
                                  name="sell"
                                  id="sell-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.sellMobile")}
                                  </span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as={Link}
                                  name="forum"
                                  to="/forum"
                                  id="forum-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.forumMobile")}
                                  </span>
                                </Dropdown.Item>

                                <Dropdown.Item
                                  as={Link}
                                  name="HFTplans"
                                  to="/HFTplans"
                                  id="HFTplans"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navPublic.account.options.hft")}
                                  </span>
                                </Dropdown.Item>
                                {this.state.auth && (
                                  <Dropdown.Item
                                    as={Link}
                                    to="/wallet"
                                    id="wallet"
                                    name="wallet"
                                    onClick={this.handleItem.bind(this)}
                                  >
                                    <span className="list-item-custom-admin-side">
                                      {t("navPublic.account.options.wallet")}
                                    </span>
                                  </Dropdown.Item>
                                )}

                                <Dropdown.Item
                                  as={Link}
                                  name="profile"
                                  to="/profile"
                                  id="profile-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("nav.profile")}
                                  </span>
                                </Dropdown.Item>

                                {/* <Dropdown.Item
                            as={Link}
                            name="whoweare"
                            to="/whoweare"
                            id="whoweare-mobile"
                            onClick={this.handleItem.bind(this)}
                          >
                            <span className="list-item-custom-admin-side">
                              {t("navCommons.help.options.who")}
                            </span>
                          </Dropdown.Item> */}

                                <Dropdown.Item
                                  as={Link}
                                  name="faqs"
                                  to="/faqs"
                                  id="faqs-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.help.options.faqs")}
                                  </span>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <Dropdown
                                    as="div"
                                    id="help-new"
                                    style={{ color: "#0066ff" }}
                                    text={t("navCommons.help.headerMobile")}
                                    icon={
                                      <Icon
                                        name="angle down"
                                        style={{ marginLeft: "50px" }}
                                      />
                                    }
                                  >
                                    <Dropdown.Menu
                                      as="div"
                                      id="list-options-drop"
                                      style={{ right: "-50px", left: "-55px" }}
                                      position="center"
                                      size="medium"
                                    >
                                      <Dropdown.Item as={Link} to="/" disabled>
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.support")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={
                                          this.props.onClickDownloadGuide
                                        }
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.guide")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        as={Link}
                                        to="/legal"
                                        name="contact"
                                        onClick={this.handleItem.bind(this)}
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.legal")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        as={Link}
                                        to="/contact"
                                        name="contact"
                                        onClick={this.handleItem.bind(this)}
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.contact")}
                                        </span>
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  name="closeSession"
                                  id="closeSession-mobile"
                                  onClick={this.closeSession.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("nav.logout")}
                                  </span>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Segment>
                        )}
                      </Grid.Column>
                      <Grid.Column mobile={5} tablet={5} />
                    </Grid.Row>
                  </Grid>

                  <Container style={{ marginTop: "7em" }}>
                    {this.state.activeView === "home" && (
                      <div>
                        <Home
                          balanceUser={this.state.userBTCBalance}
                          balanceUsdUser={this.state.userUSDBalance}
                          setItem={this.handleSetView.bind(this)}
                          setView={this.setView.bind(this)}
                          downloadGuide={this.props.onClickDownloadGuide}
                        />
                      </div>
                    )}
                    {this.state.activeView === "buy" && (
                      <div>
                        <BuyBitcoins />
                      </div>
                    )}
                    {this.state.activeView === "sell" && (
                      <div>
                        <SellBitcoins />
                      </div>
                    )}
                    {this.state.activeView === "forum" && (
                      <div>
                        <Forum />
                      </div>
                    )}
                    {this.state.activeView === "profile" && (
                      <div>
                        <Profile />
                      </div>
                    )}
                    {this.state.activeView === "wallet" && (
                      <div>
                        <Wallet />
                      </div>
                    )}
                    {this.state.activeView === "HFTplans" && (
                      <div>
                        <HFTPlans setItem={this.handleSetView.bind(this)} />
                      </div>
                    )}
                    {this.state.activeView === "whoweare" && (
                      <div>
                        <WhoWeAre />
                      </div>
                    )}
                    {this.state.activeView === "contact" && (
                      <div>
                        <ContactUs />
                      </div>
                    )}
                    {this.state.activeView === "faqs" && (
                      <div>
                        <Faqs />
                      </div>
                    )}
                    {this.state.activeView === "fastExchange" && (
                      <div>
                        <FastChange />
                      </div>
                    )}
                    {this.state.activeView === "moneyclick" && (
                      <div>
                        <Moneyclick />
                      </div>
                    )}
                    {this.state.activeView === "broker" && (
                      <div>
                        <Broker />
                      </div>
                    )}
                    {this.state.activeView === "charges" && (
                      <div>
                        <Charges />
                      </div>
                    )}
                    {this.state.activeView === "limits" && (
                      <div>
                        <LimitsOperations />
                      </div>
                    )}
                    {this.state.activeView === "completeAccount" && (
                      <div>
                        <CompleteAccount
                          setItem={this.handleSetView.bind(this)}
                        />
                      </div>
                    )}
                    {this.state.activeView === "legal" && (
                      <div>
                        <Legal />
                      </div>
                    )}
                  </Container>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            )}
          {window.sessionStorage.getItem("auth") !== "true" &&
            window.sessionStorage.getItem("userType") !== "ADMIN" && (
              <Sidebar.Pushable>
                <Sidebar
                  className="nav"
                  as={Menu}
                  animation="push"
                  direction="left"
                  icon="labeled"
                  inverted
                  vertical
                  visible={this.state.visible}
                  width="thin"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Menu.Item
                    name="home"
                    as={Link}
                    to="/home"
                    active={active === "home"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">{t("nav.init")}</span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="buy"
                    to="/buy"
                    active={active === "buy"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.buy")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="sell"
                    to="/sell"
                    active={active === "sell"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.sell")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="forum"
                    to="/forum"
                    active={active === "forum"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navCommons.forum")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    name="HFTplans"
                    to="/HFTplans"
                    active={active === "HFTplans"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">
                      {t("navPublic.account.options.hft")}
                    </span>
                  </Menu.Item>
                  <Menu.Item
                    as={Link}
                    to="/wallet"
                    id="wallet"
                    name="wallet"
                    active={active === "wallet"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile"> WALLET</span>
                  </Menu.Item>
                  <Menu.Item
                    id="profile"
                    name="profile"
                    active={active === "profile"}
                    as={Link}
                    to="/profile"
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile">{t("nav.profile")}</span>
                  </Menu.Item>
                  <Menu.Item
                    id="faqs"
                    name="faqs"
                    as={Link}
                    to="/faqs"
                    active={active === "faqs"}
                    onClick={this.handleItem.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    <span className="menu-item-mobile">
                      {t("navCommons.help.options.faqs")}
                    </span>
                  </Menu.Item>
                  {/* <Dropdown
              item
              text={
                <span style={{ color: "white", fontSize: "11px" }}>
                  {t("navCommons.help.header")}
                </span>
              }
              style={{ backgroundColor: "#207ef2" }}
            >

              <Dropdown.Menu id="list-options-drop-side">
                <Dropdown.Item
                  value="support"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/"
                  disabled
                  style={{ backgroundColor: "#207ef2" }}
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.support")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item onClick={this.props.onClickDownloadGuide} style={{ backgroundColor: "#207ef2" }}>
                  <span className="list-item-custom-admin">
                    {t("navCommons.help.options.guide")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="faqs"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/faqs"
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.faqs")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="contact"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/contact"
                >
                  <span className="list-item-custom-admin-side">
                    {t("navCommons.help.options.contact")}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
                  <Dropdown
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                    item
                    text={
                      <span
                        style={{
                          color: "white",
                          fontSize: "11px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {t("navCommons.help.header")}
                      </span>
                    }
                  >
                    <Dropdown.Menu
                      id="list-options-drop-side-public"
                      style={{
                        backgroundColor:
                          this.state.sidenavClient === "GMB" ||
                          this.state.sidenavClient === "BANCRIPT"
                            ? "#000000"
                            : "#207ef2",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      <Dropdown.Item
                        value="support"
                        onClick={this.handleSubitemHelp.bind(this)}
                        disabled
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.support")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="limits"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/limits"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.limits")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="charges"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/charges"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.charges")}
                        </span>
                      </Dropdown.Item>
                      {/* <Dropdown.Item onClick={this.props.onClickDownloadGuide}>
                  <span
                    className="list-item-custom-admin"
                    style={{
                      backgroundColor: "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                  >
                    {t("navCommons.help.options.guide")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <a href={blockchainPdf} target="_blank">
                    <span
                      className="list-item-custom-admin"
                      style={{
                        backgroundColor: "#207ef2",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {t("navCommons.help.options.blockchain")}
                    </span>
                  </a>
                </Dropdown.Item> */}
                      <Dropdown.Item
                        value="legal"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/legal"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.legal")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="contact"
                        onClick={this.handleSubitemHelp.bind(this)}
                        as={Link}
                        to="/contact"
                      >
                        <span
                          className="list-item-custom-admin-side"
                          style={{
                            backgroundColor:
                              this.state.sidenavClient === "GMB" ||
                              this.state.sidenavClient === "BANCRIPT"
                                ? "#000000"
                                : "#207ef2",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {t("navCommons.help.options.contact")}
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item
                    name={t("closeSession")}
                    as={Link}
                    to="/home"
                    id="closeSession-mobile"
                    onClick={this.closeSession.bind(this)}
                    style={{
                      backgroundColor:
                        this.state.sidenavClient === "GMB" ||
                        this.state.sidenavClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="menu-item-mobile">{t("nav.logout")}</span>
                  </Menu.Item>
                  <Menu.Item style={{ backgroundColor: "#ffffff" }}>
                    <Menu.Item
                      as={Link}
                      to="/moneyclick"
                      name="moneyclick"
                      id="moneyclick"
                      onClick={this.handleItem.bind(this)}
                      style={{ marginLeft: -23 }}
                    >
                      <Image src={logoMC} alt="" size="big" />
                    </Menu.Item>

                    {window.sessionStorage.getItem("userType") === "BROKER" && (
                      <Menu.Item
                        as={Link}
                        to="/broker"
                        name="broker"
                        id="broker"
                        onClick={this.handleItem.bind(this)}
                      >
                        <label
                          className="nav-publicBrokers-question"
                          style={{ marginLeft: -23 }}
                        >
                          ¿Eres Broker?
                        </label>
                        <br></br>
                        <label
                          className="nav-publicBrokers-question"
                          style={{ marginLeft: -23 }}
                        >
                          Seleccione aqui!
                        </label>
                        <br></br>
                        <br></br>
                        {/* <label className="nav-publicBrokers" style={{ marginLeft: -32}}><strong>BROKERS</strong></label> */}
                        <Image
                          src={logoBROKER}
                          alt=""
                          size="big"
                          style={{ marginLeft: -13 }}
                        />
                      </Menu.Item>
                    )}

                    {/* <Menu.Item
                as={Link}
                to="/broker"
                name="broker"
                id="broker"
                onClick={this.handleItem.bind(this)}
              >
                <label className="nav-publicBrokers-question">
                  ¿Eres Broker?
                </label>
                <br></br>
                <label className="nav-publicBrokers-question">
                  Seleccione aqui!
                </label>
                <br></br>
                <br></br>
                {/* <label className="nav-publicBrokers" style={{ marginLeft: -32}}><strong>BROKERS</strong></label> */}
                    {/* <Image src={logoBROKER} alt="" size="big" />
              </Menu.Item> */}
                  </Menu.Item>
                  {/* <Menu.Item
              as={Link}
              to="/whoweare"
              id="whoweare"
              name="whoweare"
              active={active === "whoweare"}
              onClick={this.handleItem.bind(this)}
              style={{ marginRight: "0px", borderRightStyle: "hidden" }}
            >
              <span className="menu-item">
                {t("navCommons.help.options.who")}
              </span>
            </Menu.Item> */}
                </Sidebar>
                <Sidebar.Pusher>
                  <Menu
                    fixed="top"
                    inverted
                    className="nav"
                    style={{ backgroundColor: "white" }}
                  >
                    <Menu.Item
                      // fitted
                      // style={{ marginRight: window.innerWidth <= 364 ? 0 : 0 }}

                      position="left"
                      style={{ backgroundColor: "white" }}
                      onClick={this.handleToggle.bind(this)}
                    >
                      <span>
                        {/* <Dropdown
                    id="lengu-select"
                    style={{ marginLeft: "10px" }}
                    inline
                    icon={<Icon name="angle down" inverted />}
                    options={friendOptions}
                    defaultValue={this.props.language}
                    onChange={handleClick}
                  /> */}
                        <Icon
                          name="bars"
                          size="large"
                          style={{ color: "#207ef2" }}
                          inverted
                        />
                      </span>
                    </Menu.Item>

                    {/* <Menu.Menu position="right" className="nav">


                <Menu.Item
                  //fitted = "horizontally"
                  style={{ marginRight: "25px" }}
                  as={Link}
                  to="/wallet"
                  name="wallet"
                  onClick={this.handleItem.bind(this)}
                >
                  <Popup
                    trigger={
                      <p>
                        <span style={{ marginLeft: "1 px" }}>
                          <Image src={walletIcon} verticalAlign="middle" />
                          <span style={{ color: "white", marginLeft: "1 px" }}>
                            {this.props.balanceUser.available}
                          </span>
                          <Icon
                            name="btc"
                            style={{ color: "white", marginRight: "1 px" }}
                          />
                        </span>
                      </p>
                    }
                    content="Wallet"
                    position="bottom left"
                  />
                </Menu.Item>
              </Menu.Menu> */}

                    {/* cerrar session  */}
                    {/* <Menu.Item
                name="home"
                id="home"
                active={active === "home"}
                onClick={this.handleItemHome.bind(this)}
                style={{ marginRight: "-5px", backgroundColor: "white" }}
                as={Link}
                to="/"
              >
                <span>
                  <Image style={{ width: 200, height: 66 }} src={logo2} />
                </span>
              </Menu.Item>
              <Menu.Item position="right" style={{ backgroundColor: "white" }}>
                <span>
                  <Dropdown
                    id="lengu-select"
                    style={{ marginLeft: "-5px" }}
                    inverted
                    inline
                    icon={
                      <Icon
                        name="angle down"
                        inverted
                        style={{ color: "#207ef2" }}
                      />
                    }
                    options={friendOptions}
                    defaultValue={this.props.language}
                    onChange={handleClick}
                  />
                </span>
              </Menu.Item> */}
                    {/* <Menu.Menu position="right" className="nav">
                <Menu.Item
                  fitted
                  icon={<Icon name="user circle" size="large" inverted />}
                  as={Link}
                  name="profile"
                  to="/profile"
                  id="profile-mobile"
                  content={
                    nickname !== ""
                      ? nickname
                      : t("navPublic.account.header") || username !== ""
                      ? username
                      : t("navPublic.account.header") || email !== ""
                      ? email
                      : t("navPublic.account.header")
                  }
                  style={{ fontStyle: "bold" }}
                  inline="true"
                  onClick={this.handleItem.bind(this)}
                />
                <InboxMessage />

                <Menu.Item
                  to="/"
                  style={{ marginRight: "10px", color: "white" }}
                  as={Link}
                  onClick={this.closeSession.bind(this)}
                  //icon={<Icon name="sign out alternate icon" size= {"large"}/>}
                >
                  <Popup
                    trigger={
                      <p>
                        <span style={{ marginLeft: "1 px" }}>
                          <Icon name="sign out" size={"large"} />
                        </span>
                      </p>
                    }
                    content={t("nav.logout")}
                    position="bottom left"
                  />
                </Menu.Item>
              </Menu.Menu> */}
                  </Menu>
                  {/* <Menu widths={1} id="home-mobile-version-menu-login">
              <Menu.Item
                name="home"
                id="home"
                active={this.state.activeView === "home"}
                onClick={this.handleItem.bind(this)}
              >
                <Image style={{ width: 220, height: 70 }} src={logo2} />
              </Menu.Item>
            </Menu> */}
                  <Grid columns="equal" id="grid-mobile-home">
                    <Grid.Row textAlign="center" className="titleComponent">
                      <Grid.Column mobile={6} tablet={6} />
                      <Grid.Column textAlign="center" mobile={5} tablet={5}>
                        {this.state.activeView !== "home" && (
                          <Segment
                            id="segment-style-home-mobile"
                            textAlign="center"
                          >
                            <Dropdown
                              item
                              icon={
                                <Icon
                                  name="bars"
                                  size="large"
                                  color="grey"
                                  inverted
                                />
                              }
                            >
                              <Dropdown.Menu id="list-options-drop-side-public-mobile-version">
                                <Dropdown.Item
                                  as={Link}
                                  to="/buy"
                                  name="buy"
                                  id="buy-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.buyMobile")}
                                  </span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as={Link}
                                  to="/sell"
                                  name="sell"
                                  id="sell-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.sellMobile")}
                                  </span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  as={Link}
                                  name="forum"
                                  to="/forum"
                                  id="forum-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.forumMobile")}
                                  </span>
                                </Dropdown.Item>

                                <Dropdown.Item
                                  as={Link}
                                  name="HFTplans"
                                  to="/HFTplans"
                                  id="HFTplans"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navPublic.account.options.hft")}
                                  </span>
                                </Dropdown.Item>
                                {this.state.auth && (
                                  <Dropdown.Item
                                    as={Link}
                                    to="/wallet"
                                    id="wallet"
                                    name="wallet"
                                    onClick={this.handleItem.bind(this)}
                                  >
                                    <span className="list-item-custom-admin-side">
                                      {t("navPublic.account.options.wallet")}
                                    </span>
                                  </Dropdown.Item>
                                )}

                                <Dropdown.Item
                                  as={Link}
                                  name="profile"
                                  to="/profile"
                                  id="profile-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("nav.profile")}
                                  </span>
                                </Dropdown.Item>

                                {/* <Dropdown.Item
                            as={Link}
                            name="whoweare"
                            to="/whoweare"
                            id="whoweare-mobile"
                            onClick={this.handleItem.bind(this)}
                          >
                            <span className="list-item-custom-admin-side">
                              {t("navCommons.help.options.who")}
                            </span>
                          </Dropdown.Item> */}

                                <Dropdown.Item
                                  as={Link}
                                  name="faqs"
                                  to="/faqs"
                                  id="faqs-mobile"
                                  onClick={this.handleItem.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("navCommons.help.options.faqs")}
                                  </span>
                                </Dropdown.Item>

                                <Dropdown.Item>
                                  <Dropdown
                                    as="div"
                                    id="help-new"
                                    style={{ color: "#0066ff" }}
                                    text={t("navCommons.help.headerMobile")}
                                    icon={
                                      <Icon
                                        name="angle down"
                                        style={{ marginLeft: "50px" }}
                                      />
                                    }
                                  >
                                    <Dropdown.Menu
                                      as="div"
                                      id="list-options-drop"
                                      style={{ right: "-50px", left: "-55px" }}
                                      position="center"
                                      size="medium"
                                    >
                                      <Dropdown.Item as={Link} to="/" disabled>
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.support")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={
                                          this.props.onClickDownloadGuide
                                        }
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.guide")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        as={Link}
                                        to="/legal"
                                        name="contact"
                                        onClick={this.handleItem.bind(this)}
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.legal")}
                                        </span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        as={Link}
                                        to="/contact"
                                        name="contact"
                                        onClick={this.handleItem.bind(this)}
                                      >
                                        <span className="list-item-custom-admin-side">
                                          {t("navCommons.help.options.contact")}
                                        </span>
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  name="closeSession"
                                  id="closeSession-mobile"
                                  onClick={this.closeSession.bind(this)}
                                >
                                  <span className="list-item-custom-admin-side">
                                    {t("nav.logout")}
                                  </span>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </Segment>
                        )}
                      </Grid.Column>
                      <Grid.Column mobile={5} tablet={5} />
                    </Grid.Row>
                  </Grid>

                  <Container style={{ marginTop: "7em" }}>
                    {this.state.activeView === "home" && (
                      <div>
                        <Home
                          balanceUser={this.state.userBTCBalance}
                          balanceUsdUser={this.state.userUSDBalance}
                          setItem={this.handleSetView.bind(this)}
                          setView={this.setView.bind(this)}
                          downloadGuide={this.props.onClickDownloadGuide}
                        />
                      </div>
                    )}
                    {this.state.activeView === "buy" && (
                      <div>
                        <BuyBitcoins />
                      </div>
                    )}
                    {this.state.activeView === "sell" && (
                      <div>
                        <SellBitcoins />
                      </div>
                    )}
                    {this.state.activeView === "forum" && (
                      <div>
                        <Forum />
                      </div>
                    )}
                    {this.state.activeView === "profile" && (
                      <div>
                        <Profile />
                      </div>
                    )}
                    {this.state.activeView === "wallet" && (
                      <div>
                        <Wallet />
                      </div>
                    )}
                    {this.state.activeView === "HFTplans" && (
                      <div>
                        <HFTPlans setItem={this.handleSetView.bind(this)} />
                      </div>
                    )}

                    {this.state.activeView === "whoweare" && (
                      <div>
                        <WhoWeAre />
                      </div>
                    )}
                    {this.state.activeView === "contact" && (
                      <div>
                        <ContactUs />
                      </div>
                    )}
                    {this.state.activeView === "faqs" && (
                      <div>
                        <Faqs />
                      </div>
                    )}
                    {this.state.activeView === "fastExchange" && (
                      <div>
                        <FastChange />
                      </div>
                    )}
                    {/* {this.state.activeView === "SendingRemittances" && (
                <div>
                  <SendingRemittances setItem={this.handleSetView.bind(this)} />
                </div>
              )} */}
                    {this.state.activeView === "moneyclick" && (
                      <div>
                        <Moneyclick />
                      </div>
                    )}
                    {this.state.activeView === "broker" && (
                      <div>
                        <Broker />
                      </div>
                    )}
                    {this.state.activeView === "charges" && (
                      <div>
                        <Charges />
                      </div>
                    )}
                    {this.state.activeView === "limits" && (
                      <div>
                        <LimitsOperations />
                      </div>
                    )}
                    {this.state.activeView === "completeAccount" && (
                      <div>
                        <CompleteAccount
                          setItem={this.handleSetView.bind(this)}
                        />
                      </div>
                    )}
                    {this.state.activeView === "legal" && (
                      <div>
                        <Legal />
                      </div>
                    )}
                  </Container>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            )}
        </div>
      );
    }
    return <div>{s}</div>;
  }
}
export default translate(SideNav);
