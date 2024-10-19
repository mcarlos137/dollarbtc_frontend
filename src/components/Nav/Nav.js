import React, { Component } from 'react';
import './Nav.css';
import logo2 from '../../img/logoDollarBtc.png';
import {
  Menu,
  Container,
  Image,
  Responsive,
  Icon,
  Dropdown,
  Popup,
  Divider,
  Button,
  Modal,
  Grid,
  Segment,
  Label,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import SideNav from './SideNav/SideNav';
import user from '../../services/user';
import model from '../../services/model';
import otc from '../../services/otc';
import config from '../../services/config';
import InboxMessage from '../InboxMessage/InboxMessage';
import hftIcon from '../../img/HFT_ICON.png';
import walletIcon from '../../img/AA.png';
import iconLogout from '../../img/icn-logout.png';
import axios from 'axios';
import translate from '../../i18n/translate';
import * as jsPDF from 'jspdf';
import ISOCURRENCIES from '../../common/ISO4217';
import utils from '../../services/utils';
import logoMC from '../../img/logoNuevoMC.jpg';
import logoBroker from '../../img/brokers.png';
import logodbtc from '../../img/logov2.png';
import logoBrokerBlanco from '../../img/logo-brokers-blanco.png';
import forexIcon from '../../img/FOREX.png';
import exchangeIcon from '../../img/cryptoexchange.png';
import logoClient from '../../img/logoGMBfooter.png';
import logoConvertrue from '../../img/convertrue.png';
import logoBancript from '../../img/Bancript.png';
import blockchainPdf from '../../common/Blockchain_ la revolucion indus - Preukschat (Coordinador).pdf';
import packageJson from '../../../package.json';
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      active: 'home',
      screenWith: window.innerWidth,
      auth: user.getUserAuth() === 'true',
      countOptions: 8,
      activity: this.props.active,
      view: false,
      balanceDollarBTC: [],
      listCountrys: [],
      buybutton: false,
      sellbutton: true,
      action: 'buy',
      translator: props.translate,
      loadNewAddress: false,
      errorNewAddress: false,
      successNewAddress: true,
      navClient: packageJson.designCompany,
      userUSDBalance: 0,
      userBTCBalance: 0,
      userBTCBalancenNew: 0, //
    };
    ///this.getBalanceUserUpdate = this.getBalanceUserUpdate.bind(this);
    this.onClickDownloadGuide = this.onClickDownloadGuide.bind(this);
    this.generateNewAddress = this.generateNewAddress.bind(this);
    this.updateWalletsInformation = this.updateWalletsInformation.bind(this);
    this.closeModalNewAddress = this.closeModalNewAddress.bind(this);
  }
  handlePusher() {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
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
              if (data.currency === 'BTC') {
                acum = acum + parseFloat(data.amount);
              }
              if (data.currency === 'USD') {
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
                if (data.currency === 'USD') {
                  acumUSD = data.amount;
                  if (isNaN(acumUSD)) {
                    acumUSD = 0;
                  } else {
                    acumUSD = acumUSD;
                  }
                }
                if (data.currency === 'BTC') {
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
        window.sessionStorage.setItem('userBalanceBTC', JSON.stringify(result));
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  componentDidMount() {
    let arr = [];
    this.setState({ auth: user.getUserAuth() === 'true' ? true : false });
    if (user.getUserAuth() === 'true') {
      this.setState({ userBTCBalance: user.getBalanceStorageUserBTC() });
      //this.getBalanceUserUpdate();
    }
    this.getGeneralTrans();
    this.getBalanceUserUpdate();

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
    this.webBlockCypherBTC('BTC', addresses);
  }
  generateNewAddress() {
    this.setState({ loadNewAddress: true });
    let body = {
      userName: user.getUserName(),
    };
    user
      .addNewWalletToUser(body)
      .then((res) => {
        //console.log(res);
        setTimeout(() => {
          this.setState({
            loadNewAddress: true,
            errorNewAddress: false,
            successNewAddress: true,
          });
        }, 4000);
      })
      .catch((error) => {
        //console.log(error);
        setTimeout(() => {
          this.setState({
            loadNewAddress: true,
            errorNewAddress: true,
            successNewAddress: false,
          });
        }, 4000);
      });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  handleItem(e, data) {
    this.setState({ active: data.name });
    //this.getBalanceUserUpdate();
    this.getGeneralTrans();
    this.webBlockCypherBTC('BTC', user.getAddress());
  }
  handleSetView(view) {
    this.setState({ active: view });
  }
  handleChangeScreen(e, data) {
    this.setState({ screenWith: data.width });
  }
  // getBalanceUserUpdate() {
  //   let username = user.getUserName();
  //   user.getBalanceUser(username).then(resp => {
  //       let acum = 0;
  //       let data1 = 0;
  //       let acumUSD = 0;
  //       let result = {
  //         available: 0,
  //         estimated: 0
  //       };
  //       let acumdefered = 0;
  //       if (
  //         resp.data.result.modelBalances !== undefined &&
  //         resp.data.result.modelBalances.length > 0
  //       ) {
  //         for (let val of resp.data.result.modelBalances) {
  //           for (let data of val.availableAmounts) {
  //             if (data.currency === "BTC") {
  //               acum = acum + parseFloat(data.amount);
  //             }
  //             if (data.currency === "USD") {
  //               acumUSD = acumUSD + parseFloat(data.amount);
  //             }
  //           }
  //         }
  //       }
  //       let decimales = Math.pow(10, 8);
  //       let data2 = Math.floor(acum * decimales) / decimales;
  //       if (resp.data.result.availableAmounts !== undefined) {
  //         if (resp.data.result.availableAmounts.length > 0) {
  //           if (resp.data.result.availableAmounts[0].amount > 0) {
  //             acumdefered =
  //               acumdefered +
  //               Math.floor(
  //                 resp.data.result.availableAmounts[0].amount * decimales
  //               ) /
  //                 decimales;
  //           } else {
  //             acumdefered = acumdefered;
  //           }
  //         }
  //       }
  //       if (resp.data.result.deferredAmounts !== undefined) {
  //         if (resp.data.result.deferredAmounts.length > 0) {
  //           if (resp.data.result.deferredAmounts[0].amount > 0) {
  //             acumdefered =
  //               acumdefered +
  //               Math.floor(
  //                 resp.data.result.deferredAmounts[0].amount * decimales
  //               ) /
  //                 decimales;
  //           } else {
  //             acumdefered = acumdefered;
  //           }
  //         }
  //       }
  //       result.available = acumdefered;
  //       result.estimated = data2;
  //       this.setState({
  //         userBTCBalance: result,
  //         view: true,
  //         userUSDBalance: acumUSD
  //       });
  //       window.sessionStorage.setItem("userBalanceBTC", JSON.stringify(result));
  //     })
  //     .catch(error => {
  //       //console.log(error);
  //     });
  // }
  getGeneralTrans = function () {
    axios
      .get(URL_BASE_BUSHIDO + '/api/v2/tx/deposit/user/' + user.getUserName(), {
        auth: {
          username: atob(user.getHeader()).split(':')[1],
          password: atob(user.getHeader()).split(':')[0],
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
    return Math.floor(value * decimales) / decimales;
  }
  formatBTC(value) {
    const formatter = new Intl.NumberFormat('en-US', {
      currency: 'BTC',
      maximumSignificantDigits: 8,
    });
    return formatter.format(value);
  }
  updateBalanceDBC = function (value, currency, address) {
    var balance = {
      userName: user.getUserName(),
      balanceOperationType: 'RECEIVE',
      address: address,
      privateKey: '',
      amounts: {},
      targetAddress: '',
      additionalInfo: 'DEPOSIT TO WALLET',
    };
    Object.defineProperty(balance.amounts, currency, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    user
      .balanceOperation(balance)
      .then((res) => {
        // this.getBalanceUserUpdate();
      })
      .catch((error) => {
        //  //console.log(error);
      });
  };
  async updateDeposit(value, address) {
    var body = {
      address: address,
      amount: value,
    };
    try {
      const res = await user.updateDepositToUser(body);
    } catch (error) {}
  }
  webBlockCypherBTC = (currency, addresses) => {
    if (addresses !== undefined && addresses !== null) {
      let cr = String(currency).toLowerCase();
      // //console.log(cr, address);
      let arrayPromises = [];
      addresses.map((address) => {
        let url =
          config.apiBlockCypherUrl + '/' + cr + '/main/addrs/' + address;
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
                  //console.log(lastRegisteredTxDate);
                  //console.log(this.state.balanceDollarBTC[j]);
                  if (lastRegisteredTxDate === 'Invalid Date') {
                    lastRegisteredTxDate = new Date('2010-12-10T01:02:29.000Z');
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
    }
  };
  componentWillUpdate(nextProps, nextState) {
    //  //console.log(nextState, nextState);
    if (this.state.active !== nextProps.active) {
      // this.getBalanceUserUpdate();
    }
  }
  activeButtonBuy(e, data) {
    this.setState({ buybutton: false, sellbutton: true, action: 'buy' });
  }
  activeButtonSell(e, data) {
    this.setState({ sellbutton: false, buybutton: true, action: 'sell' });
  }
  handleCurrencyAction(e, data) {
    window.location.href = '/' + this.state.action + '/?c=' + data.value;
  }
  closeSession() {
    user.logout();
    // window.sessionStorage.clear();
    window.location.href = '/';
  }
  onClickDownloadGuide() {
    //console.log("estoy aquí")
    let doc = new jsPDF('p', 'in', 'letter');
    let margin = 0.5,
      verticalOffset = margin,
      size; // inches on a 8.5 x 11 inch sheet.
    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    doc.addFont('Montserrat');
    doc.setFontType('bold');

    doc.setTextColor(79, 129, 189);
    size = 14;
    let text = this.state.translator('guide.header');
    let lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;
    size = 12;
    doc.setFontType('normal');
    text = this.state.translator('guide.modules.one.header');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.sub');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.commons.generalObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      '\u2022 ' +
      this.state.translator('guide.modules.one.generals.one') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.one.generals.two') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.one.generals.three') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator('guide.commons.specificObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text = '\u2022 ' + this.state.translator('guide.modules.one.specifics.one');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = '\u2022 ' + this.state.translator('guide.modules.one.specifics.two');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.three');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.four');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.five');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = '\u2022 ' + this.state.translator('guide.modules.one.specifics.six');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.seven');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.eight');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.nine');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = '\u2022 ' + this.state.translator('guide.modules.one.specifics.ten');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.eleven');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.twelve');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.thirteen');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.fourteen');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.fifteen');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.one.specifics.sixteen');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator('guide.commons.content');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.one.content.l1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l4');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l5');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l6');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l7');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l8');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l9');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l10');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l11');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l12');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l13');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l14');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l15');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l16');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l17');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    text = this.state.translator('guide.modules.one.content.l18');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l19');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l20');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l21');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l22');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.one.content.l23');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    doc.setFontType('normal');
    text = this.state.translator('guide.modules.two.header');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.sub');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.two.intro');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.generalObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      '\u2022 ' +
      this.state.translator('guide.modules.two.generals.one') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.two.generals.two') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.two.generals.three') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator('guide.commons.specificObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text = '\u2022 ' + this.state.translator('guide.modules.two.specifics.one');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = '\u2022 ' + this.state.translator('guide.modules.two.specifics.two');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.two.specifics.three');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.two.specifics.four');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.two.specifics.five');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = '\u2022 ' + this.state.translator('guide.modules.two.specifics.six');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.two.specifics.seven');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.theoreticalSection');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.two.content.theoretical.l1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l4');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l5');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l6');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l7');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l8');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l9');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l10');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l11');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l12');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.theoretical.l13');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.practicalSection');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.two.content.practical.l1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l4');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l5');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l6');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l7');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    text = this.state.translator('guide.modules.two.content.practical.l8');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.two.content.practical.l9');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.conclusions');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.two.conclusions');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    doc.setFontType('normal');
    text = this.state.translator('guide.modules.three.header');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.sub');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.three.intro');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.generalObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o1') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o2') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o3') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o4') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o5') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o6') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;
    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o7') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o8') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o9') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o10') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o11') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o12') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' +
      this.state.translator('guide.modules.three.generals.o13') +
      '\n';
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator('guide.commons.specificObjectives');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o4');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o5');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o6');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o7');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o8');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o9');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      '\u2022 ' + this.state.translator('guide.modules.three.specifics.o10');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.theoreticalSection');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.three.content.theoretical.t1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t4');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t5');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t6');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t7');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.theoretical.t8');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.practicalSection');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.three.content.practical.p1');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.practical.p2');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator('guide.modules.three.content.practical.p3');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator('guide.commons.conclusions');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator('guide.modules.three.conclusions');
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.save('GuiaCryptos.pdf');
  }
  closeModalNewAddress() {
    this.setState({
      loadNewAddress: false,
      errorNewAddress: false,
      successNewAddress: false,
    });
  }
  render() {
    let t = this.state.translator;
    let friendOptions = [
      { text: t('navPublic.lang.en'), value: 'en', disabled: false },
      { text: t('navPublic.lang.es'), value: 'es' },
    ];
    let { handleClick } = this.props;
    // let wind = window.innerWidth;
    //   if(wind <= 400 ){
    //       friendOptions = [
    //         { text: t("navPublic.lang.resume.en"), value: "en", disabled: false },
    //         { text: t("navPublic.lang.resume.es"), value: "es" },

    //       ];
    //     }
    let active = this.state.active;
    let message;
    let data = this.state.userBTCBalance;
    message = <InboxMessage />;
    return (
      <div>
        {window.sessionStorage.getItem('auth') !== 'true' &&
          window.sessionStorage.getItem('userType') !== 'ADMIN' && (
            <Responsive
              minWidth={992}
              onUpdate={this.handleChangeScreen.bind(this)}
            >
              <Menu fixed='top' text className='nav-admin' fluid size='tiny'>
                <Container>
                  <Menu.Item style={{ marginRight: '20px' }}>
                    <span>
                      <span style={{ color: 'white' }}>
                        {' '}
                        {t('navCommons.market')}
                        {'  '}
                        {'  '}
                      </span>
                      <Dropdown
                        id='lengu-select'
                        style={{ marginLeft: '10px' }}
                        inline
                        icon={<Icon name='angle down' inverted />}
                        options={friendOptions}
                        defaultValue={this.props.language}
                        onChange={handleClick}
                      />
                    </span>
                  </Menu.Item>

                  {/* <Menu.Item>
                <Popup
                  trigger={
                    <span style={{ color: "white" }}>
                      {" "}
                      9 am - 4 pm Soporte{"   "}
                      <strong style={{ marginRight: "10px" }}>
                        <Icon name="whatsapp" size="large" />
                        <a
                          href="https://web.whatsapp.com/send?phone=584129897009&text=Hola%20necesito%20ayuda"
                          target="_blank"
                          style={{ color: "white", marginTop: "2px" }}
                        >
                          +58 4129897009
                        </a>
                      </strong>
                    </span>
                  }
                  content={
                    <span style={{ fontSize: "12px" }}>Lunes a Viernes</span>
                  }
                />
                </Menu.Item>*/}

                  <Menu.Menu position='right' className='nav-admin'>
                    <Menu.Item style={{ marginRight: '100px' }}>
                      <Icon name='user circle' size='large' inverted />
                      <Dropdown
                        text={
                          sessionStorage.getItem('nickname') !== ''
                            ? sessionStorage.getItem('nickname')
                            : t('navPublic.account.header')
                        }
                        inline
                        id='drop-nav-login'
                        icon={<Icon name='angle down' inverted />}
                      >
                        <Dropdown.Menu as='div' id='list-options-drop'>
                          <Dropdown.Item as={Link} to='/profile'>
                            <span className='list-item-custom-admin'>
                              {t('nav.profile')}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={this.closeSession.bind(this)}>
                            <span className='list-item-custom-admin'>
                              {t('nav.logout')}
                            </span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item
                      style={{ marginRight: '25px' }}
                      as={Link}
                      to='/wallet'
                      name='wallet'
                      onClick={this.handleItem.bind(this)}
                    >
                      <Popup
                        trigger={
                          <p>
                            <Image src={walletIcon} verticalAlign='middle' />
                            <span>
                              <span
                                style={{ color: 'white', marginLeft: '1px' }}
                              >
                                {data !== null
                                  ? this.formatBTC(
                                      this.state.userBTCBalance.available
                                    )
                                  : 0}
                              </span>
                              <Icon name='btc' style={{ color: 'white' }} />
                            </span>
                          </p>
                        }
                        content='Wallet'
                        position='bottom left'
                      />
                    </Menu.Item>
                    <Menu.Item
                      style={{ marginRight: '25px' }}
                      as={Link}
                      to='/HFTplans'
                      name='HFTplans'
                      onClick={this.handleItem.bind(this)}
                      id='balance-item'
                    >
                      <Popup
                        trigger={
                          <p>
                            <Image src={hftIcon} verticalAlign='middle' />
                            <span style={{ color: 'white' }}>
                              <span style={{ color: 'white' }}>
                                {data !== null
                                  ? this.floorDecimals(
                                      this.state.userBTCBalance.estimated,
                                      8
                                    )
                                  : 0}
                              </span>
                              <Icon name='btc' style={{ color: 'white' }} />

                              {this.state.userUSDBalance !== 0 && (
                                <span style={{ color: 'white' }}>
                                  / {''} {this.state.userUSDBalance}
                                  <Icon
                                    name='dollar'
                                    style={{ color: 'white' }}
                                  />
                                </span>
                              )}
                            </span>
                          </p>
                        }
                        content={t('navPublic.account.options.hft')}
                        position='bottom left'
                      />
                    </Menu.Item>
                    <Menu.Item
                      style={{ marginRight: '25px' }}
                      as={Link}
                      to='/'
                      name='forex'
                      onClick={this.handleItem.bind(this)}
                      id='balance-forex-item'
                    >
                      <Popup
                        trigger={
                          <p>
                            <Image
                              src={forexIcon}
                              verticalAlign='middle'
                              size='mini'
                            />
                            <span style={{ color: 'white' }}>
                              <span style={{ color: 'white' }}>
                                {data !== null ? this.floorDecimals(0, 8) : 0}
                              </span>
                              <Icon name='btc' style={{ color: 'white' }} />
                            </span>
                          </p>
                        }
                        content='Fx'
                        position='bottom left'
                      />
                    </Menu.Item>
                    <Menu.Item
                      style={{ marginRight: '25px' }}
                      as={Link}
                      to='/fastExchange'
                      name='fastExchange'
                      onClick={this.handleItem.bind(this)}
                      id='balance-cryptoexchange-item'
                    >
                      <Popup
                        trigger={
                          <p>
                            <Image
                              src={exchangeIcon}
                              verticalAlign='middle'
                              size='mini'
                            />
                            <span style={{ color: 'white' }}>
                              <span style={{ color: 'white' }}>
                                {data !== null ? this.floorDecimals(0, 8) : 0}
                              </span>
                              <Icon name='dollar' style={{ color: 'white' }} />
                            </span>
                          </p>
                        }
                        content='Fast Change'
                        position='bottom left'
                      />
                    </Menu.Item>
                    <Menu.Item>{message}</Menu.Item>
                  </Menu.Menu>
                </Container>
              </Menu>
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              {!this.state.brokerPresentation && (
                <Menu text>
                  <Container>
                    <Menu.Item
                      as={Link}
                      to='/'
                      header
                      name='home'
                      id='home'
                      active={active === 'home'}
                      onClick={this.handleItem.bind(this)}
                    >
                      <Image style={{ height: 50 }} src={logo2} />
                    </Menu.Item>
                    <Menu.Item
                      as={Link}
                      to='/buy'
                      name='buy'
                      id='buy'
                      active={active === 'buy'}
                      onClick={this.handleItem.bind(this)}
                    >
                      <span className='menu-item2'>{t('navCommons.buy')}</span>
                    </Menu.Item>
                    <Menu.Item
                      as={Link}
                      to='/sell'
                      name='sell'
                      id='sell'
                      active={active === 'sell'}
                      onClick={this.handleItem.bind(this)}
                    >
                      <span className='menu-item2'>{t('navCommons.sell')}</span>
                    </Menu.Item>

                    {/*<Menu.Item
                as={Link}
                to="/faqs"
                name="faqs"
                id="faqs"
                active={active === "faqs"}
                onClick={this.handleItem.bind(this)}
              >
                <span className="menu-item2">{t("navCommons.help.options.faqs")}</span>
              </Menu.Item>*/}

                    {/* <Menu.Item
                as={Link}
                to="/whoweare"
                name="whoweare"
                id="whoweare"
                active={active === "whoweare"}
                onClick={this.handleItem.bind(this)}
              >
                <span className="menu-item2">
                  {t("navCommons.help.options.who")}
                </span>
              </Menu.Item> */}

                    <Menu.Item
                      as={Link}
                      name='forum'
                      to='/forum'
                      id='forum'
                      onClick={this.handleItem.bind(this)}
                      active={active === 'forum'}
                    >
                      <span className='menu-item2'>
                        {t('navCommons.forum')}
                      </span>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                        as='div'
                        id='help-new'
                        text={t('navCommons.help.header')}
                        icon={<Icon name='angle down' />}
                      >
                        <Dropdown.Menu as='div' id='list-options-drop'>
                          <Dropdown.Item as={Link} to='/' disabled>
                            <span className='list-item-custom-admin'>
                              {t('navCommons.help.options.support')}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={this.onClickDownloadGuide}>
                            <span className='list-item-custom-admin'>
                              {t('navCommons.help.options.guide')}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to='/limits'>
                            <span className='list-item-custom-admin'>
                              {' '}
                              {t('navCommons.help.options.limits')}{' '}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to='/charges'>
                            <span className='list-item-custom-admin'>
                              {' '}
                              {t('navCommons.help.options.charges')}{' '}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <a href={blockchainPdf} target='_blank'>
                              <span className='list-item-custom-admin'>
                                {t('navCommons.help.options.blockchain')}
                              </span>
                            </a>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to='/faqs'>
                            <span className='list-item-custom-admin'>
                              {t('navCommons.help.options.faqs')}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to='/legal'>
                            <span className='list-item-custom-admin'>
                              {t('navCommons.help.options.legal')}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to='/contact'>
                            <span className='list-item-custom-admin'>
                              {t('navCommons.help.options.contact')}
                            </span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Menu position='right' fluid>
                      {sessionStorage.getItem('userType') === 'BROKER' &&
                        this.state.navClient === 'MAIN' && (
                          <Menu.Item
                            as={Link}
                            to='/broker'
                            name='broker'
                            id='broker'
                            style={{ width: 150, marginTop: 5 }}
                            onClick={this.handleItem.bind(this)}
                          >
                            <Image
                              size='small'
                              id='logoBroker'
                              src={logoBrokerBlanco}
                              alt=''
                            />
                          </Menu.Item>
                        )}
                      <Menu.Item
                        as={Link}
                        to='/moneyclick'
                        name='moneyclick'
                        id='moneyclick'
                        style={{ width: 125 }}
                        onClick={this.handleItem.bind(this)}
                      >
                        <Image id='logomc' src={logoMC} alt='' />
                      </Menu.Item>
                    </Menu.Menu>
                    {/*<Menu.Menu position="right">
                <Menu.Item id="item-country-custom">
                  <Button.Group style={{ marginRight: "15px" }} size="mini">
                    <Button
                      id="button-buy-menu"
                      color="green"
                      compact
                      size="mini"
                      name="buybutton"
                      basic={this.state.buybutton}
                      onClick={this.activeButtonBuy.bind(this)}
                    >
                      {t("navCommons.coins.buy")}
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
                      {t("navCommons.coins.sell")}
                    </Button>
                  </Button.Group>
                  <Dropdown
                    placeholder={t("navCommons.coins.options.placeholder")}
                    search
                    item={true}
                    floating
                    onChange={this.handleCurrencyAction.bind(this)}
                    options={this.state.listCountrys}
                  />
                </Menu.Item>
              </Menu.Menu>*/}
                  </Container>
                </Menu>
              )}
            </Responsive>
          )}
        {window.sessionStorage.getItem('auth') === 'true' &&
          window.sessionStorage.getItem('userType') !== 'ADMIN' && (
            <Responsive
              minWidth={992}
              onUpdate={this.handleChangeScreen.bind(this)}
            >
              <Menu
                fixed='top'
                text
                className={
                  this.state.navClient === 'MAIN'
                    ? 'nav-public'
                    : this.state.navClient === 'GMB' ||
                      this.state.navClient === 'BANCRIPT'
                    ? 'nav-publicClient'
                    : 'nav-publicConvertrue'
                }
                fluid
                size='tiny'
              >
                <Container>
                  <Menu.Item style={{ marginRight: '20px' }}>
                    <span>
                      <span
                        style={{
                          color:
                            this.state.navClient !== 'CONVERTRUE'
                              ? 'white'
                              : '#207ef2',
                        }}
                      >
                        {' '}
                        {t('navCommons.market')}
                        {'  '}
                        {'  '}
                      </span>
                      <Dropdown
                        id={
                          this.state.navClient === 'CONVERTRUE'
                            ? 'lengu-select-convertrue'
                            : 'lengu-select'
                        }
                        style={{ marginLeft: '10px' }}
                        inline
                        icon={<Icon name='angle down' inverted />}
                        options={friendOptions}
                        defaultValue={this.props.language}
                        onChange={handleClick}
                      />
                    </span>
                  </Menu.Item>
                  {sessionStorage.getItem('userType') === 'BROKER' &&
                    this.state.navClient === 'MAIN' && (
                      <Menu.Item
                        position='right'
                        as={Link}
                        to='/broker'
                        name='broker'
                        id='broker'
                        style={{ width: 150, marginTop: 5 }}
                        onClick={this.handleItem.bind(this)}
                      >
                        <Image
                          style={{ marginLeft: '-100px' }}
                          size='small'
                          id='logoBroker'
                          src={logoBrokerBlanco}
                          alt=''
                        />
                      </Menu.Item>
                    )}
                  {this.state.navClient === 'GMB' && (
                    <Container
                      style={{ border: 'none', backgroundColor: 'black' }}
                    >
                      <div
                        style={{
                          marginLeft: window.innerWidth >= 1200 ? 320 : 250,
                        }}
                      >
                        <Divider hidden style={{ marginTop: -5 }}></Divider>
                        <Image
                          src={logoClient}
                          verticalAlign='middle'
                          size='small'
                        />
                        <Divider hidden style={{ marginTop: 5 }}></Divider>
                      </div>
                    </Container>
                  )}
                  {this.state.navClient === 'BANCRIPT' && (
                    <Container
                      style={{ border: 'none', backgroundColor: 'black' }}
                    >
                      <div
                        style={{
                          marginLeft: window.innerWidth >= 1200 ? 250 : 250,
                        }}
                      >
                        <Divider hidden style={{ marginTop: -5 }}></Divider>
                        <Image
                          src={logoBancript}
                          verticalAlign='middle'
                          style={{ width: 300, height: 80 }}
                        />
                        <Divider hidden style={{ marginTop: 5 }}></Divider>
                      </div>
                    </Container>
                  )}
                  {this.state.navClient === 'CONVERTRUE' && (
                    <Container
                      style={{ border: 'none', backgroundColor: '#ffffff' }}
                    >
                      <div
                        style={{
                          marginLeft: window.innerWidth >= 1200 ? 250 : 250,
                        }}
                      >
                        <Divider hidden style={{ marginTop: -5 }}></Divider>
                        <Image
                          src={logoConvertrue}
                          verticalAlign='middle'
                          size='medium'
                        />
                        <Divider hidden style={{ marginTop: 5 }}></Divider>
                      </div>
                    </Container>
                  )}
                  {this.state.navClient !== 'MAIN' && (
                    <Menu.Item
                      position='right'
                      as={Link}
                      to='/broker'
                      name='broker'
                      id='broker'
                      style={{
                        width: 100,
                        marginTop:
                          this.state.navClient === 'BANCRIPT' ? 60 : 25,
                        marginRight: '180px',
                      }}
                      onClick={this.handleItem.bind(this)}
                    >
                      <Image
                        style={{ marginRight: '5px' }}
                        size='small'
                        id='logoBroker'
                        src={
                          this.state.navClient !== 'CONVERTRUE'
                            ? logodbtc
                            : logo2
                        }
                        alt=''
                      />
                      {sessionStorage.getItem('userType') === 'BROKER' && (
                        <Image
                          style={{ marginRight: '20px' }}
                          size='small'
                          id='logoBroker'
                          src={
                            this.state.navClient !== 'CONVERTRUE'
                              ? logoBrokerBlanco
                              : logoBroker
                          }
                          alt=''
                        />
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item
                    position='right'
                    style={{ marginTop: 5 }}
                    onClick={this.closeSession.bind(this)}
                  >
                    <Image
                      style={{ marginLeft: '-100px', width: 125 }}
                      size='small'
                      src={iconLogout}
                      alt=''
                    />
                  </Menu.Item>
                </Container>
              </Menu>
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              {this.state.navClient !== 'MAIN' && (
                <div>
                  <Divider hidden />
                  <Divider hidden />
                </div>
              )}
              {this.state.navClient === 'BANCRIPT' && (
                <div>
                  <Divider hidden />
                  <Divider hidden />
                </div>
              )}
              {this.state.navClient === 'MAIN' && (
                <div align='center'>
                  <Image
                    size='small'
                    src={logo2}
                    as={Link}
                    to='/'
                    header
                    name='home'
                    id='home'
                    active={active === 'home'}
                    onClick={this.handleItem.bind(this)}
                  />
                </div>
              )}
              {!this.state.brokerPresentation && (
                <Container
                  style={{
                    marginTop:
                      user.getUserAuth() &&
                      window.sessionStorage.getItem('userType') === 'ADMIN'
                        ? '65px'
                        : '5px',
                    paddingTop:
                      window.sessionStorage.getItem('userType') === 'ADMIN'
                        ? '10px'
                        : '0px',
                  }}
                >
                  <div>
                    <Grid columns='equal' centered>
                      <Grid.Column
                        largeScreen={13}
                        mobile={16}
                        tablet={14}
                        computer={14}
                      >
                        <Menu text>
                          <Container>
                            <Menu.Item>
                              <Icon
                                name='user circle'
                                size='big'
                                inverted
                                style={
                                  this.state.navClient !== 'GMB' &&
                                  this.state.navClient !== 'BANCRIPT'
                                    ? { color: '#207ef2' }
                                    : { color: '#000000' }
                                }
                              />
                              <Dropdown
                                style={
                                  this.state.navClient !== 'GMB' &&
                                  this.state.navClient !== 'BANCRIPT'
                                    ? { color: '#207ef2' }
                                    : { color: '#000000' }
                                }
                                text={
                                  sessionStorage.getItem('nickname') !== ''
                                    ? sessionStorage.getItem('nickname')
                                    : t('navPublic.account.header')
                                }
                                inline
                                id='drop-nav-login2'
                                icon={
                                  <Icon
                                    name='angle down'
                                    inverted
                                    style={
                                      this.state.navClient !== 'GMB' &&
                                      this.state.navClient !== 'BANCRIPT'
                                        ? { color: '#207ef2' }
                                        : { color: '#000000' }
                                    }
                                  />
                                }
                              >
                                <Dropdown.Menu as='div' id='list-options-drop'>
                                  <Dropdown.Item as={Link} to='/'>
                                    <span className='list-item-custom-admin'>
                                      {t('nav.init')}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item as={Link} to='/profile'>
                                    <span className='list-item-custom-admin'>
                                      {t('nav.profile')}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={this.closeSession.bind(this)}
                                  >
                                    <span className='list-item-custom-admin'>
                                      {t('nav.logout')}
                                    </span>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Menu.Item>
                            <Menu.Item
                              style={
                                this.state.navClient !== 'GMB' &&
                                this.state.navClient !== 'BANCRIPT'
                                  ? { marginLeft: -10, color: '#207ef2' }
                                  : { marginLeft: -10, color: '#000000' }
                              }
                              as={Link}
                              to='/buy'
                              name='buy'
                              id='buy'
                              active={active === 'buy'}
                              onClick={this.handleItem.bind(this)}
                            >
                              <span className='menu-item2'>
                                {t('navCommons.buy')}
                              </span>
                            </Menu.Item>
                            <Menu.Item
                              style={
                                this.state.navClient !== 'GMB' &&
                                this.state.navClient !== 'BANCRIPT'
                                  ? {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#207ef2',
                                    }
                                  : {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#000000',
                                    }
                              }
                              as={Link}
                              to='/sell'
                              name='sell'
                              id='sell'
                              active={active === 'sell'}
                              onClick={this.handleItem.bind(this)}
                            >
                              <span className='menu-item2'>
                                {t('navCommons.sell')}
                              </span>
                            </Menu.Item>
                            <Menu.Item
                              style={
                                this.state.navClient !== 'GMB' &&
                                this.state.navClient !== 'BANCRIPT'
                                  ? {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#207ef2',
                                    }
                                  : {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#000000',
                                    }
                              }
                              as={Link}
                              name='forum'
                              to='/forum'
                              id='forum'
                              onClick={this.handleItem.bind(this)}
                              active={active === 'forum'}
                            >
                              <span className='menu-item2'>
                                {t('navCommons.forum')}
                              </span>
                            </Menu.Item>
                            <Menu.Item
                              style={
                                this.state.navClient !== 'GMB' &&
                                this.state.navClient !== 'BANCRIPT'
                                  ? {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#207ef2',
                                    }
                                  : {
                                      marginLeft:
                                        window.innerWidth >= 1200 ? 0 : -15,
                                      color: '#000000',
                                    }
                              }
                            >
                              <Dropdown
                                as='div'
                                id='help-new'
                                text={t('navCommons.help.header')}
                                icon={<Icon name='angle down' />}
                              >
                                <Dropdown.Menu as='div' id='list-options-drop'>
                                  <Dropdown.Item as={Link} to='/' disabled>
                                    <span className='list-item-custom-admin'>
                                      {t('navCommons.help.options.support')}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item as={Link} to='/faqs'>
                                    <span className='list-item-custom-admin'>
                                      {t('navCommons.help.options.faqs')}
                                    </span>
                                  </Dropdown.Item>
                                  {/* <Dropdown.Item onClick={this.onClickDownloadGuide}>
                        <span className="list-item-custom-admin">
                          {t("navCommons.help.options.guide")}
                        </span>
                      </Dropdown.Item> */}
                                  <Dropdown.Item as={Link} to='/limits'>
                                    <span className='list-item-custom-admin'>
                                      {' '}
                                      {t('navCommons.help.options.limits')}{' '}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item as={Link} to='/charges'>
                                    <span className='list-item-custom-admin'>
                                      {' '}
                                      {t(
                                        'navCommons.help.options.charges'
                                      )}{' '}
                                    </span>
                                  </Dropdown.Item>
                                  {/* <Dropdown.Item>
                        <a href={blockchainPdf} target="_blank">
                          <span className="list-item-custom-admin">
                            {t("navCommons.help.options.blockchain")}
                          </span>
                        </a>
                      </Dropdown.Item> */}

                                  <Dropdown.Item as={Link} to='/legal'>
                                    <span className='list-item-custom-admin'>
                                      {t('navCommons.help.options.legal')}
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item as={Link} to='/contact'>
                                    <span className='list-item-custom-admin'>
                                      {t('navCommons.help.options.contact')}
                                    </span>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Menu.Item>
                            {this.state.navClient !== 'MAIN' && (
                              <Menu.Item
                                style={{
                                  marginLeft:
                                    window.innerWidth >= 1200 ? -30 : -30,
                                }}
                              >
                                {message}
                              </Menu.Item>
                            )}
                            {this.state.navClient === 'MAIN' && (
                              <Menu.Item
                                style={{
                                  marginLeft:
                                    window.innerWidth >= 1200 ? -30 : -30,
                                }}
                              >
                                {message}
                              </Menu.Item>
                            )}
                            {window.location.pathname !== '/' && (
                              <Menu.Menu
                                position='right'
                                fluid
                                as={Link}
                                to='/wallet'
                                style={{
                                  marginRight:
                                    window.innerWidth >= 1200 ? 0 : 6,
                                }}
                              >
                                <Segment
                                  inverted
                                  style={{
                                    marginTop: 10,
                                    marginLeft:
                                      window.innerWidth >= 1200 ? -220 : -100,
                                    width:
                                      window.innerWidth >= 1200 ? 210 : 170,
                                    height: 45,
                                    backgroundColor: '#EAEDED',

                                    //backgroundColor: "#DDE2E8",
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
                                              window.innerWidth >= 1200
                                                ? 0
                                                : -15,
                                            color: '#207ef2',
                                          }}
                                        >
                                          <span className='menu-item1'>
                                            {t('nav.availableBalance')}
                                          </span>
                                        </Menu.Item>
                                      </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row
                                      columns='equal'
                                      style={{
                                        marginTop: -25,
                                      }}
                                    >
                                      <Grid.Column>
                                        <Menu.Item
                                          style={{
                                            marginTop: -5,
                                            color: '#000000',
                                          }}
                                          name='buy'
                                          id='buy'
                                        >
                                          <span
                                            style={{
                                              // color: "black",
                                              fontSize: 11,
                                              //fontWeight: "900",
                                              marginLeft:
                                                window.innerWidth >= 1200
                                                  ? 0
                                                  : -15,
                                            }}
                                          >
                                            {this.state.userBTCBalance !== 0
                                              ? this.floorDecimals(
                                                  this.state.userBTCBalance
                                                    .availableusd,
                                                  2
                                                )
                                              : 0}
                                            {' USD'}
                                          </span>
                                        </Menu.Item>
                                      </Grid.Column>
                                      <Grid.Column>
                                        <Menu.Item
                                          style={{
                                            marginTop: -5,
                                            color: '#000000',
                                          }}
                                        >
                                          <span
                                            style={{
                                              //color: "black",
                                              fontSize: 11,
                                              //fontWeight: "900",
                                              marginLeft:
                                                window.innerWidth >= 1200
                                                  ? -20
                                                  : -30,
                                              marginRight:
                                                window.innerWidth >= 1200
                                                  ? 0
                                                  : -30,
                                            }}
                                          >
                                            {this.state.userBTCBalance
                                              .available !== 0
                                              ? this.formatBTC(
                                                  this.state.userBTCBalance
                                                    .available
                                                )
                                              : 0}
                                            {' BTC'}
                                          </span>
                                        </Menu.Item>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>
                                </Segment>
                              </Menu.Menu>
                            )}
                            {/* <Menu.Menu position='right' fluid>
															{sessionStorage.getItem("userType") ===
																"BROKER" &&
																this.state.navClient === "MAIN" && (
																	<Menu.Item
																		as={Link}
																		to='/broker'
																		name='broker'
																		id='broker'
																		style={{
																			width: 250,
																			marginTop: 5,
																			marginLeft:
																				window.innerWidth >= 1200 ? 90 : -5,
																		}}
																		onClick={this.handleItem.bind(this)}>
																		<Image
																			size='small'
																			id='logoBroker'
																			src={logoBroker}
																			alt=''
																		/>
																	</Menu.Item>
																)}
															{sessionStorage.getItem("userType") ===
																"BROKER" &&
																this.state.navClient !== "MAIN" && (
																	<Menu.Item
																		as={Link}
																		to='/broker'
																		name='broker'
																		id='broker'
																		style={{
																			width:
																				window.innerWidth >= 1200 ? 120 : 100,
																			marginTop: 5,
																			marginLeft:
																				window.innerWidth >= 1200 ? -120 : -100,
																		}}
																		onClick={this.handleItem.bind(this)}>
																		<Image
																			size='small'
																			id='logoBroker'
																			src={logoBroker}
																			alt=''
																		/>
																	</Menu.Item>
																)}
														</Menu.Menu> */}
                          </Container>
                        </Menu>
                      </Grid.Column>
                    </Grid>
                  </div>
                </Container>
              )}
            </Responsive>
          )}

        <Responsive minWidth={0} maxWidth={991}>
          <SideNav
            balanceUser={this.state.userBTCBalance}
            setView={this.handleSetView.bind(this)}
            handleClick={handleClick}
            onClickDownloadGuide={this.onClickDownloadGuide}
            token={this.props.token}
          />
        </Responsive>
        <Modal
          size='tiny'
          open={this.state.loadNewAddress}
          onClose={this.closeModalNewAddress}
        >
          <Modal.Header>{t('nav.newAddressModal.header')}</Modal.Header>
          <Modal.Content>
            {this.state.successNewAddress && (
              <p>{t('nav.newAddressModal.body.successMessage')}</p>
            )}
            {this.state.errorNewAddress && (
              <p>{t('nav.newAddressModal.body.errorMessage')}</p>
            )}
            <br />
            <p>
              {t('nav.newAddressModal.body.commonMessage.part1')}
              <strong>
                {t('nav.newAddressModal.body.commonMessage.part2')}
              </strong>{' '}
              {t('nav.newAddressModal.body.commonMessage.part3')}
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.closeModalNewAddress}>
              {t('nav.newAddressModal.buttonClose')}
            </Button>
            <Button
              labelPosition='right'
              onClick={() => {
                this.closeModalNewAddress();
                window.open('/wallet', '_self');
              }}
            >
              {t('nav.newAddressModal.buttonOk')}
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(Nav);
