import React, { Component } from 'react';
import '../../../Admin.css';
import {
  Menu,
  Segment,
  Container,
  Grid,
  Form,
  Divider,
  Icon,
  Header,
  Loader,
  Dimmer,
  Popup,
  Select,
  Message,
  Label,
  Button,
  Modal,
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import config from '../../../../../services/config';
import axios from 'axios';
import moment from 'moment';
import addressApi from '../../../../../services/address';
import NumberFormat from 'react-number-format';
import WAValidator from 'wallet-address-validator';
import RetailService from '../../../../../services/moneyclick';
import userService from '../../../../../services/user';
import otcService from '../../../../../services/otc';
import CurrenciesFlag from '../../../../../common/currencyFlag';
import mcIcon from '../../../../../img/splash_mc.jpg';
import _ from 'underscore';
class CryptoWalletsBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsersEmail: [],
      userToSearch: '',
      showDataMC: false,
      showUserBalance: false,
      showUserSearch: false,
      walletBTCAmount: null,
      listSize: null,
      showUserWithoutAddressMessage: false,
      addressToSearch: null,
      userAddresses: [],
      showUserBadAddress: false,
      walletBTCMovements: [],
      loadSearch: false,
      activeItem: 'onDollarBTC',
      showOndollarBTCBalance: false,
      walletBalanceBTC: 0,
      toVerifiedWalletBalanceBTC: 0,
      hftModelsBalance: 0,
      balancesTotal: 0,
      transactionTable: [],
      renderNow: false,
      allIncomingBTC: 0,
      allOutcomingBTC: 0,
      tableReady: false,
      showModalDetail: false,
      details: [],
      dataMC: [],
      balanceOtherCurrenciesColOne: [],
      balanceOtherCurrenciesColTwo: [],
      currenciesData: [],
      dataDetail: [],
      dataDetailTwo: [],
      dataDetailThree: [],
    };
  }

  async getCurrencies() {
    let currencies = await otcService.getCurrencies();
    currencies = currencies.data.filter((curren) => {
      return curren.active === true;
    });
    this.setState({ currenciesData: currencies, showDataMC: true }, () => {
      this.getMovementUser();
    });
  }
  async getMovementUser() {
    try {
      const response = await userService.getMovementsUser(
        this.state.userToSearch
      );
      let keys = Object.keys(response.data);
      if (keys.length > 0) {
        await this.formatedDataToRender(response.data);
      } else {
        this.setState({
          dataMC: [],
        });
      }
    } catch (error) {}
  }
  async formatedDataToRender(data) {
    let array = [];
    console.log(data);
    this.setState({ dataMC: [] });
    try {
      Object.entries(data).forEach(([key, value]) => {
        let t = this.state.translator;
        let dateOperation,
          typeOp,
          typeOp2,
          amountOp,
          currencyOp,
          btcPrice,
          statusOp,
          flagData,
          styleAmount,
          user,
          description,
          targetAddress,
          initialAmount,
          comision,
          sended,
          receiver,
          fulladdress,
          idOperation,
          dateOperation2,
          accountAddress,
          accountHolderName,
          accountInterbankCode,
          accountHolderPhone,
          accountNumber,
          accountZip,
          automaticCharge,
          bank,
          bankRoutingNumber,
          bankSwiftCode,
          currencySend,
          typeSend,
          verified,
          receiverUserName,
          zelle,
          canceledReason = '';
        dateOperation = key.split('__')[0];
        dateOperation2 = this.formatDate(new Date(dateOperation));
        Object.entries(value).forEach(([inerKey, inerValue]) => {
          if (inerKey === 'receiverUserName') {
            receiverUserName = inerValue;
          }
          if (inerKey === 'addedAmount') {
            receiver = 'true';
            amountOp = inerValue.amount;
            currencyOp = inerValue.currency;
            if (currencyOp !== 'BTC' && currencyOp !== 'ETH') {
              amountOp = this.floorDecimals(inerValue.amount, 2);
            } else {
              amountOp = inerValue.amount.toFixed(8);
            }
            flagData = CurrenciesFlag.currenciesFlag[inerValue.currency];
            if (flagData === undefined) {
              let findCurren = this.state.currenciesData.find((currency) => {
                return currency.shortName === inerValue.currency;
              });
              if (findCurren !== undefined) {
                flagData = {
                  key: findCurren.shortName.toLowerCase(),
                  value: findCurren.shortName,
                  flag: findCurren.shortName.toLowerCase(),
                  text: findCurren.shortName,
                  img: mcIcon,
                  alias: findCurren.shortName,
                  isCripto: false,
                  symbol: ' ',
                  priority: 10,
                };
              }
            }
          }

          if (inerKey === 'substractedAmount') {
            sended = 'true';
            initialAmount = this.floorDecimals(inerValue.initialAmount, 2);
            comision = this.floorDecimals(
              inerValue.amount - inerValue.initialAmount,
              2
            );
            amountOp = inerValue.amount;
            currencyOp = inerValue.currency;

            if (currencyOp !== 'BTC' && currencyOp !== 'ETH') {
              amountOp = this.floorDecimals(inerValue.amount, 2);
            } else {
              amountOp = inerValue.amount.toFixed(8);
            }
            flagData = CurrenciesFlag.currenciesFlag[inerValue.currency];
            if (flagData === undefined) {
              let findCurren = this.state.currenciesData.find((currency) => {
                return currency.shortName === inerValue.currency;
              });
              if (findCurren !== undefined) {
                flagData = {
                  key: findCurren.shortName.toLowerCase(),
                  value: findCurren.shortName,
                  flag: findCurren.shortName.toLowerCase(),
                  text: findCurren.shortName,
                  img: mcIcon,
                  alias: findCurren.shortName,
                  isCripto: false,
                  symbol: ' ',
                  priority: 10,
                };
              }
            }
            // styleAmount = appStyle.amountBalanceTitleMinus;
          }
          if (inerKey === 'balanceOperationType') {
            typeOp = inerValue;

            let val = typeOp
              .toLocaleString('en-US', {
                maximumFractionDigits: 12,
              })
              .toLowerCase();
            //   console.log('val ', val);
            if (val === 'send_sms') {
              typeOp2 = 'Envio a MoneyClick';
            } else if (val === 'send_to_payment') {
              typeOp2 = 'Envio a medio de pago';
            } else if (val === 'debit') {
              typeOp2 = 'Débito';
            } else if (val === 'credit') {
              typeOp2 = 'Abono';
            } else if (val === 'send') {
              typeOp2 = 'Envio a tercero';
            } else if (val === 'receive') {
              typeOp2 = 'Recibir MoneyClick';
            } else if (val === 'mc_fast_change') {
              typeOp2 = 'Cambio rápido';
            } else if (val === 'change_from') {
              typeOp2 = 'Cambio de';
            } else if (val === 'send_national_sms') {
              typeOp2 = 'Envio Nacional MoneyClick';
            } else if (val === 'mc_send_sms_national') {
              typeOp2 = 'Envio Nacional MoneyClick';
            } else if (val === 'send_international_sms') {
              typeOp2 = 'Envio Internacional MoneyClick';
            } else if (val === 'transfer_mc_dbtc') {
              typeOp2 = 'Transferencia de saldo MoneyClick a dollarBTC';
            } else if (val === 'transfer_from_mcbalance_to_balance') {
              typeOp2 = 'Transferencia de saldo MoneyClick a dollarBTC';
            } else if (val === 'transfer_from_balance_to_mcbalance') {
              typeOp2 = 'Transferencia de saldo dollarBTC a MoneyClick';
            } else if (val === 'currency_change') {
              typeOp2 = 'Cambio de moneda';
            } else if (val === 'transfer_dbtc_mc') {
              typeOp2 = 'Transferencia de saldo dollarBTC a MoneyClick';
            } else if (val === 'send_out') {
              typeOp2 = 'Envió a wallet externa';
            } else if (val === 'mc_retail_buy') {
              typeOp2 = 'Compra de saldo en Punto Moneyclick';
            } else if (val === ' mc_retail_sell') {
              typeOp2 = 'Venta de saldo en Punto Moneyclick';
            } else if (val === 'mc_retail_buy_balance') {
              typeOp2 = 'Compra de saldo en Punto Moneyclick';
            } else if (val === 'mc_retail_sell_balance') {
              typeOp2 = 'Venta de saldo en Punto Moneyclick';
            } else if (val === 'BUY_BALANCE') {
              typeOp2 = 'Compra de saldo en Punto Moneyclick';
            } else if (val === 'buy_balance') {
              typeOp2 = 'Compra de saldo en Punto Moneyclick';
            } else if (val === 'mc_buy_balance') {
              typeOp2 = 'Recarga de saldo';
            } else if (val === 'mc_sell_balance') {
              typeOp2 = 'Venta de saldo en Punto Moneyclick';
            } else if (val === 'SELL_BALANCE') {
              typeOp2 = 'Venta de saldo en Punto Moneyclick';
            } else if (val === 'SELL_BALANCE') {
              typeOp2 = 'Venta de saldo en Punto Moneyclick';
            } else if (val === 'RECEIVED_FROM_OUTSIDE_WALLET') {
              typeOp2 = 'Recibido desde wallet externa';
            } else if (val === 'receive_in') {
              typeOp2 = 'Recibir';
            } else if (val === 'receive_out') {
              typeOp2 = 'Recibido desde wallet externa';
            } else if (val === 'mc_send_sms_international') {
              typeOp2 = 'Envio Internacional MoneyClick';
            } else if (val === 'send_in') {
              typeOp2 = 'Envió a wallet';
            } else if (val === 'mc_add_escrow') {
              typeOp2 = 'Depósito de Garantía';
            } else if (val === 'added_to_retail_escrow') {
              typeOp2 =
                'Agregado al depósito de garantía en el Punto MoneyClick';
            } else if (val === 'mc_buy_crypto' || val === 'mc_buy_bitcoins') {
              typeOp2 = 'Compra de Crypto';
            } else if (val === 'mc_sell_crypto' || val === 'mc_sell_bitcoins') {
              typeOp2 = 'Venta de Crypto';
            } else if (val === 'mc_message_offer_change') {
              typeOp2 = 'Chat de Oferta';
            } else {
              // console.log('no definido ', val);
              typeOp2 = 'No definido';
            }
          }
          if (inerKey === 'balanceOperationStatus') {
            if (inerValue === 'OK') {
              statusOp = 'Exitosa';
            } else if (inerValue === 'WAITING_FOR_PAYMENT') {
              statusOp = 'Esperando por pago';
            } else if (inerValue === 'FAIL') {
              statusOp = 'Cancelada';
            } else if (inerValue === 'PAY_VERIFICATION') {
              statusOp = 'Verificando pago';
            } else if (inerValue === 'CLAIM') {
              statusOp = 'Reclamo';
            } else if (inerValue === 'PROCESSING') {
              statusOp = 'En proceso';
            } else {
              statusOp = inerValue;
            }
          }
          if (inerKey === 'additionalInfo') {
            if (inerValue.indexOf('DESCRIPTION') !== -1) {
              let info = inerValue.split(' ');
              // if (info[2] === "PAYMENT") {
              //   user = "";
              // } else {
              //   if (inerValue.indexOf("-") !== -1) {
              //     let sendTo = inerValue.split("-")[0];

              //     let first = this.getFirtWord(sendTo);

              //     user = sendTo.split(first)[1];
              //     ////console.log("user legal:", user)
              //   } else {
              //     user = info[2];
              //   }
              // }
              let desc = inerValue.split('DESCRIPTION')[1];
              if (desc.charAt(0) !== ' ') {
                description = desc;
              } else {
                description = desc.substring(1, desc.length);
              }
            }
            // else if (inerValue.indexOf("OTC operation id") !== -1) {
            //   let value = inerValue.split("OTC operation id ")[1];
            //   let id = value.substring(value.length - 4, value.length);
            //   idOperation = id;
            // }
            else if (inerValue.indexOf('ROLLBACK FROM') !== -1) {
              // let val = inerValue.split("ROLLBACK FROM ")[1];
              // user = val;
              description = 'Reintegro';
            } else if (inerValue.indexOf('RECEIVE FROM') !== -1) {
              let content = inerValue.split('RECEIVE FROM ');
              user = content[1];
              description = 'Pago recibido'; // t(
              //);
            } else if (inerValue.indexOf('CHANGE FROM') !== -1) {
              let content = inerValue.split('CHANGE FROM ');
              let currencies = content[1].split('-')[0];
              description =
                'Cambio de ' +
                currencies.split('TO')[0] +
                ' -> ' +
                currencies.split('TO')[1];
            } else if (inerValue.includes('BUY BALANCE RETAIL')) {
              let idRetail = inerValue.split(' ')[3];
              idRetail = idRetail.substring(
                idRetail.length - 4,
                idRetail.length
              );
              description =
                'Compra de saldo en Punto Moneyclick' + ' ' + idRetail;
            } else if (inerValue.includes('SELL BALANCE RETAIL')) {
              let idRetail = inerValue.split(' ')[3];
              idRetail = idRetail.substring(
                idRetail.length - 4,
                idRetail.length
              );
              description =
                'Venta de saldo en Punto Moneyclick' + ' ' + idRetail;
            } else if (inerValue.includes('ADDED TO RETAIL ESCROW')) {
              let idRetail = inerValue.split(' ')[4];
              idRetail = idRetail.substring(
                idRetail.length - 4,
                idRetail.length
              );
              description =
                'Agregado al depósito de garantía en el Punto MoneyClick:' +
                ' ' +
                idRetail;
            } else if (inerValue.includes('INITIAL_MOVEMENT')) {
              let idRetail = inerValue.split(' ')[4];
              idRetail = idRetail.substring(
                idRetail.length - 4,
                idRetail.length
              );
              description = 'Movimiento inicial';
            } else if (inerValue.includes('RECEIVED FROM OUTSIDE WALLET')) {
              description = 'Recibido desde wallet externa';
            } else if (inerValue.includes('TARGET ADDRESS')) {
              let idRetail = inerValue.split('TARGET ADDRESS', 2);
              description =
                idRetail[0] + ' ' + 'Cartera destino:' + ' ' + idRetail[1];
            } else {
              description = inerValue;
            }
          }
          if (inerKey === 'btcPrice') {
            btcPrice = inerValue;
          }
          if (inerKey === 'balanceOperationProcessId') {
            let id = inerValue.substring(
              inerValue.length - 4,
              inerValue.length
            );
            idOperation = id;
          }
          if (inerKey === 'operationId') {
            let id = inerValue.substring(
              inerValue.length - 4,
              inerValue.length
            );
            idOperation = id;
          }
          if (inerKey === 'targetAddress') {
            let sub = '...';
            sub =
              sub +
              inerValue.substring(inerValue.length - 10, inerValue.length);
            targetAddress = sub;
            fulladdress = inerValue;
          }
          if (inerKey === 'canceledReason') {
            canceledReason = inerValue;
          }
          if (inerKey === 'clientPayment') {
            accountAddress = inerValue.accountAddress;
            accountHolderName = inerValue.accountHolderName;
            if (inerValue.accountInterbankCode !== undefined) {
              accountInterbankCode = inerValue.accountInterbankCode;
            }
            if (inerValue.accountHolderPhone !== undefined) {
              accountHolderPhone = inerValue.accountInterbankCode;
            }
            accountNumber = inerValue.accountNumber;
            accountZip = inerValue.accountZip;
            automaticCharge = inerValue.automaticCharge;
            bank = inerValue.bank;
            bankRoutingNumber = inerValue.bankRoutingNumber;
            bankSwiftCode = inerValue.bankSwiftCode;
            currencySend = inerValue.currency;
            // if (inerValue.type === "TRANSFER_WITH_SPECIFIC_BANK") {
            //   typeSend = t("profile.addAccount.specificBank");
            // } else if (inerValue.type === "TRANSFER_NATIONAL_BANK") {
            //   typeSend = t("profile.addAccount.thirdBank");
            // } else if (inerValue.type === "CHECK_DEPOSIT") {
            //   typeSend = t("profile.addAccount.checkDeposit");
            // } else {
            //   typeSend = t("profile.addAccount.checkDeposit");
            // }

            verified = inerValue.verified;
            zelle = inerValue.zelle;
          }
        });

        let ob = {
          initialAmount: initialAmount,
          comision: comision,
          sended: sended,
          receiver: receiver,
          currency: currencyOp,
          receiverUserName: receiverUserName,
          amount: amountOp,
          status: statusOp,
          type: typeOp2,
          dateOperation: dateOperation,
          date: dateOperation2,
          key: dateOperation,
          btcPrice: btcPrice,
          flag: flagData,
          style: '',
          user: user,
          description: description,
          canceledReason: canceledReason,
          fulladdress: fulladdress,
          typeOp: typeOp,
          accountAddress: accountAddress,
          accountHolderName: accountHolderName,
          accountInterbankCode: accountInterbankCode,
          accountHolderPhone: accountHolderPhone,
          accountNumber: accountNumber,
          accountZip: accountZip,
          automaticCharge: automaticCharge,
          bank: bank,
          bankRoutingNumber: bankRoutingNumber,
          bankSwiftCode: bankSwiftCode,
          currencySend: currencySend,
          typeSend: typeSend,
          verified: verified,
          zelle: zelle,
        };
        if (idOperation !== undefined) {
          ob.idOperation = idOperation;
        }
        if (targetAddress !== undefined) {
          ob.targetAddress = targetAddress;
          ob.fulladdress = fulladdress;
        }

        console.log(ob);
        array.push(ob);
      });

      array.sort((a, b) => {
        return new Date(b.key).getTime() - new Date(a.key).getTime();
      });

      this.setState({ dataMC: array, showDataMC: false }, () => {
        // this.showOperationByUrl(this.state.data);
      });
    } catch (error) {
      //console.log(error);
    }
  }
  getOTCDetail = async (txArray) => {
    let otcId = txArray.filter((obj) => Object.keys(obj).includes('allOTCid'));
    var listDetails = [];
    if (otcId.length === 0) {
      this.setState({ tableReady: true });
    }
    for (var i = 0; i < otcId.length; i++) {
      var toPush = otcService
        .getOperation(otcId[i].allOTCid)
        .then((res) => {
          if (!_.isEmpty(res.data)) {
            return {
              id: res.data.id,
              amount: res.data.amount,
              currency: res.data.currency,
              price: res.data.price,
            };
          } else {
            return {};
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      if (!_.isEmpty(toPush)) {
        listDetails.push(toPush);
      }
      if (i + 1 === otcId.length) {
        this.setState({ details: listDetails }, () => {
          this.setState({ tableReady: true });
        });
      }
    }
  };
  getWalletBalanceDBC = () => {
    this.setState({ showOndollarBTCBalance: false });
    var availableAmounts = [];
    var toVerifiedAmounts = [];
    var modelBalances = [];
    userService
      .getBalanceUser(this.state.userToSearch)
      .then((resp) => {
        availableAmounts = resp.data.result.availableAmounts;
        toVerifiedAmounts = resp.data.result.deferredAmounts;
        modelBalances = resp.data.result.modelBalances;
        const formatter = new Intl.NumberFormat('en-US', {
          currency: 'BTC',
          maximumSignificantDigits: 8,
        });
        for (var i = 0; i < availableAmounts.length; i++) {
          if (availableAmounts[i].currency === 'BTC') {
            this.setState({
              walletBalanceBTC: formatter.format(availableAmounts[i].amount),
            });
          }
        }
        var totalModal = 0;
        if (modelBalances !== undefined) {
          //console.log("modelbalances dentro de la condicion", modelBalances);
          for (var x = 0; x < modelBalances.length; x++) {
            for (var k = 0; k < modelBalances[x].estimatedValues.length; k++) {
              if (modelBalances[x].estimatedValues[k].currency === 'BTC') {
                totalModal =
                  totalModal + modelBalances[x].estimatedValues[k].amount;
              }
            }
          }

          this.setState({
            hftModelsBalance: formatter.format(totalModal),
          });
        }

        for (var j = 0; j < toVerifiedAmounts.length; j++) {
          if (toVerifiedAmounts[j].currency === 'BTC') {
            this.setState({
              toVerifiedWalletBalanceBTC: formatter.format(
                toVerifiedAmounts[j].amount
              ),
            });
          }
        }
        this.setState({
          balancesTotal: formatter.format(
            this.state.walletBalanceBTC +
              this.state.hftModelsBalance +
              this.state.toVerifiedWalletBalanceBTC
          ),
        });
        this.setState({ showOndollarBTCBalance: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    //this.getUsers();
    this.listSize();
  }
  listSize = () => {
    userService.listSize().then((resp) => {
      this.setState({ listSize: resp.data, showUserSearch: true });
    });
  };
  handleItemClick = (e, { name }) => {
    if (name === 'onMoneyclick') {
      this.getBalance();
    }
    this.setState({ activeItem: name });
  };
  // getUsers = () => {
  //   userService
  //     .getUsers()
  //     .then((resp) => {
  //       var listUser = resp.data;
  //       var listEmail = [];
  //       let optionDBTC = {};
  //       optionDBTC.key = 0;
  //       optionDBTC.value = "dollarBTC";
  //       optionDBTC.text = "dollarBTC";
  //       listEmail.push(optionDBTC);
  //       for (var i = 0; i < listUser.length; i++) {
  //           var emailOption = {};
  //           emailOption.key = i + 1;
  //           emailOption.value = listUser[i];
  //           emailOption.text = listUser[i];
  //           listEmail.push(emailOption);
  //       }
  //       this.setState(
  //         {
  //           listUsersEmail: listEmail,
  //         },
  //         () => {
  //           this.setState({
  //             showUserSearch: true,
  //           });
  //         }
  //       );
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  pickUser = (e, data) => {
    this.setState({
      userToSearch: data.value,
    });
  };
  formatDate(date) {
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: 'true',
    };
    let data = date.toLocaleString(regi, options);
    if (regi === 'es-ES') {
      data = data.split(' ');
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + ' ' + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  getBalance() {
    if (this.state.userToSearch !== null) {
      this.setState({ showUserBalance: false });
      RetailService.getBalanceMoneyclick(this.state.userToSearch)
        .then((resp) => {
          //  console.log('getBalanceMoneyclick ', resp.data);
          this.getCurrencies();
          this.setState({ showUserBalance: true });
          let currenciesColOne = [];
          let currenciesColTwo = [];
          Object.entries(resp.data).forEach(([key, value], index) => {
            let module = index % 2;
            let obj = {};
            obj.currency = key;
            Object.entries(value).forEach(([k, v]) => {
              if (k === 'availableBalance') {
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
          });
        })
        .catch((error) => {
          this.setState({ showUserBalance: true });
          console.log(error);
        });
    }
  }
  getMovementsByAddress(addr) {
    let splitAddress = addr.split('_');
    let urlBC;
    if (splitAddress[1] === 'BTC') {
      urlBC = config.apiBlockCypherUrl + '/btc/main/addrs/' + splitAddress[0];
    } else {
      if (splitAddress[1] !== 'TRON') {
        urlBC =
          'https://api.blockcypher.com/v1/eth/main/addrs/' + splitAddress[0];
      }
    }

    //console.log('urlbc metodo', urlBC, 'config', config.apiBlockCypherUrl);
    if (urlBC) {
      var BTCWalletAmountSatoshis = 0;
      this.setState({ showUserBalance: false });
      axios
        .get(urlBC, { withCredentials: false })
        .then((resp) => {
          // console.log(resp.data);
          var userBTCTxRefs = resp.data;
          let definitiveTxToTable = [];
          var BTCWalletTxRefs = [];
          var wallet = userBTCTxRefs.address;
          BTCWalletAmountSatoshis =
            BTCWalletAmountSatoshis + userBTCTxRefs.balance;
          if (userBTCTxRefs.n_tx > 0) {
            BTCWalletTxRefs = userBTCTxRefs.txrefs;

            for (var i = 0; i < BTCWalletTxRefs.length; i++) {
              var txToAdd = {};
              if (BTCWalletTxRefs[i].tx_input_n === -1) {
                txToAdd.type = 'receive';
              } else if (BTCWalletTxRefs[i].tx_output_n === -1) {
                txToAdd.type = 'send';
              }
              txToAdd.amount = BTCWalletTxRefs[i].value * 0.00000001;
              if (BTCWalletTxRefs[i].block_height === -1) {
                txToAdd.confirmed = false;
              } else {
                txToAdd.confirmed = true;
              }
              if (BTCWalletTxRefs[i].confirmed !== undefined) {
                txToAdd.dateConfirmed = BTCWalletTxRefs[i].confirmed;
              } else {
                txToAdd.dateConfirmed = 'Sin confirmar';
              }
              txToAdd.address = wallet;
              definitiveTxToTable.push(txToAdd);
            }
          }

          var BTCWalletAmount = BTCWalletAmountSatoshis * 0.00000001;
          this.setState({
            walletBTCMovements: definitiveTxToTable,
            walletBTCAmount: BTCWalletAmount,
            showUserBalance: true,
            loadSearch: false,
          });
        })
        .catch((error) => {
          this.setState({
            showUserBadAddress: true,
            showUserBalance: true,
            walletBTCAmount: null,
            loadSearch: false,
          });
          setTimeout(() => {
            this.setState({
              showUserBadAddress: false,
            });
          }, 5000);
        });
    }
  }
  getUserBlockChain = () => {
    this.setState({
      showUserBalance: false,
      loadSearch: true,
      showUserBadAddress: false,
      showUserWithoutAddressMessage: false,
      showUserBalanceDollarBTC: false,
      walletBalanceBTC: 0,
      toVerifiedWalletBalanceBTC: 0,
      hftModelsBalance: 0,
      balancesTotal: 0,
      walletBTCAmount: null,
      dataMC: [],
      activeItem:
        this.state.userToSearch !== 'dollarBTC'
          ? 'onDollarBTC'
          : 'onBlockchain',
    });

    if (this.state.userToSearch !== 'dollarBTC') {
      userService
        .getConfigUserGeneral(this.state.userToSearch)
        .then((res) => {
          if (Object.keys(res.data.result).length > 0) {
            // if (res.data.result.address !== undefined) {
            let addresses = { red: 'BTC', address: [] };
            let mcAddressesBtc = { red: 'BTC', address: [] };
            let mcAddressesEth = { red: 'ETH', address: [] };
            let mcAddressesTron = { red: 'TRON', address: [] };
            if (res.data.result.wallets !== undefined) {
              let old = res.data.result.wallets.old;
              let current = Object.values(res.data.result.wallets.current).map(
                (w) => {
                  return w.address;
                }
              )[0];
              addresses.address = Object.keys(old).map((key) => {
                return old[key].address;
              });
              addresses.address.push(current);
              this.setState({
                addressToSearch: current,
              });
            }
            if (res.data.result.mcWallets !== undefined) {
              let mcOld = res.data.result.mcWallets.old;
              let mcCurrent = Object.values(
                res.data.result.mcWallets.current
              ).map((w) => {
                return w.address;
              })[0];
              mcAddressesBtc.address = Object.keys(mcOld).map((key) => {
                return mcOld[key].address;
              });
              mcAddressesBtc.address.push(mcCurrent);
            }
            if (res.data.result.mcWalletsEthereum !== undefined) {
              let mcOldETH = res.data.result.mcWalletsEthereum.old;
              let mcCurrentETH = Object.values(
                res.data.result.mcWalletsEthereum.current
              ).map((w) => {
                return w.address;
              })[0];
              mcAddressesEth.address.concat(
                Object.keys(mcOldETH).map((key) => {
                  return mcOldETH[key].address;
                })
              );
              mcAddressesEth.address.push(mcCurrentETH);
            }
            if (res.data.result.mcWalletsTron !== undefined) {
              let mcOldTron = res.data.result.mcWalletsTron.old;
              let mcCurrentTron = Object.values(
                res.data.result.mcWalletsTron.current
              ).map((w) => {
                return w.address;
              })[0];
              mcAddressesTron.address.concat(
                Object.keys(mcOldTron).map((key) => {
                  return mcOldTron[key].address;
                })
              );
              mcAddressesTron.address.push(mcCurrentTron);
            }
            let arrayresult = [
              addresses,
              mcAddressesBtc,
              mcAddressesEth,
              mcAddressesTron,
            ];
            if (arrayresult.length > 0) {
              this.formatUserAddresses(arrayresult);
            } else {
              this.setState({
                showUserWithoutAddressMessage: true,
                showUserBalance: true,
                walletBTCAmount: null,
                loadSearch: false,
              });
              setTimeout(() => {
                this.setState({
                  showUserWithoutAddressMessage: false,
                });
              }, 5000);
            }

            this.getWalletBalanceDBC();
            var dateInit = new Date();
            var timeback = 1000 * 60 * 60 * 24 * 180;
            var dateEnd = new Date(dateInit.getTime() - timeback);
            userService
              .userMovements(
                this.state.userToSearch,
                dateEnd.toISOString(),
                dateInit.toISOString()
              )
              .then((res) => {
                //    console.log(res.data.result);
                this.makeTableData(res.data.result);
                this.setState({
                  showUserBalance: true,
                  loadSearch: false,
                  activeItem: 'onDollarBTC',
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            this.setState({
              showUserWithoutAddressMessage: true,
              showUserBalance: true,
              walletBTCAmount: null,
              loadSearch: false,
            });
            setTimeout(() => {
              this.setState({
                showUserWithoutAddressMessage: false,
              });
            }, 5000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      addressApi
        .getAddressByCurrency('BTC')
        .then((resp) => {
          // console.log(resp);
          if (resp.data.length > 0) {
            let addresses = [];
            for (let addressObj of resp.data) {
              if (WAValidator.validate(addressObj.address, 'BTC')) {
                addresses.push(addressObj.address);
              }
            }
            if (addresses.length > 0) {
              let arrayPromises = [];
              addresses.map((addr) => {
                let urlBC =
                  config.apiBlockCypherUrl + '/btc/main/addrs/' + addr;

                arrayPromises.push(
                  axios.get(urlBC, { withCredentials: false })
                );
              });
              this.setState({
                addressToSearch: addresses[0],
              });
              this.formatUserAddresses(addresses);
            } else {
              this.setState({
                showUserWithoutAddressMessage: true,
                showUserBalance: true,
                walletBTCAmount: null,
                loadSearch: false,
              });
              setTimeout(() => {
                this.setState({
                  showUserWithoutAddressMessage: false,
                });
              }, 5000);
            }
          } else {
            this.setState({
              showUserWithoutAddressMessage: true,
              showUserBalance: true,
              walletBTCAmount: null,
              loadSearch: false,
            });
            setTimeout(() => {
              this.setState({
                showUserWithoutAddressMessage: false,
              });
            }, 5000);
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };
  formatUserAddresses(addresses) {
    let values = [];
    for (let i = 0; i < addresses.length; i++) {
      for (let address of addresses[i].address) {
        let obj = {
          key: 'addrs' + (i + 1),
          value: address + '_' + addresses[i].red,
          text: addresses[i].red + ' - ' + address,
        };
        values.push(obj);
      }
    }

    this.setState(
      {
        userAddresses: values,
        addressSelected: values[0].value,
      },
      () => this.getMovementsByAddress(values[0].value)
    );
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  makeTableData = (movements) => {
    var tx = {};
    var txArray = [];
    const formatter = new Intl.NumberFormat('en-US', {
      currency: 'BTC',
      maximumSignificantDigits: 8,
    });
    Object.entries(movements).forEach(([key, value]) => {
      tx = {};
      tx.date = new Date(key.split('__')[0]);
      Object.entries(value).forEach(([k, v]) => {
        if (k === 'receiverUserName') {
          tx.receiverUserName = v;
        } else if (k === 'addedAmount') {
          tx.type = 'add';
          if (v.currency === 'BTC') {
            tx.amountBTC = formatter.format(v.amount);
          }
        } else if (k === 'substractedAmount') {
          tx.type = 'remove';
          if (v.currency === 'BTC') {
            tx.amountBTC = formatter.format(v.amount);
          }
        } else if (k === 'balanceOperationType') {
          if (v === 'WITHDRAW') {
            tx.description = 'Envío de BTC';
          } else if (v === 'INITIAL_DEPOSIT') {
            tx.description = 'Movimiento inicial';
          } else if (v === 'DEPOSIT') {
            tx.description = 'BTC recibidos';
          } else if (v === 'TRANSFER_TO_DOLLARBTC') {
            tx.description = 'Envío de BTC';
          } else if (v === 'TRANSFER_FROM_DOLLARBTC') {
            tx.description = 'BTC recibidos';
          } else if (v === 'RECEIVE') {
            tx.description = 'BTC recibidos';
          } else if (v === 'SEND') {
            tx.description = 'Envío de BTC';
          } else if (v === 'CREDIT') {
            tx.description = 'Crédito';
          } else if (v === 'BUY') {
            tx.description = 'Compra';
          } else if (v === 'TRANSFER_FROM_BALANCE_TO_MCBALANCE') {
            tx.description = 'Cambio de DBTC A MC';
          } else if (v === 'DEBIT') {
            tx.description = 'Débito';
          } else if (v.includes('MODEL')) {
            v = v.replace('MODEL', 'PLAN');
            if (v === 'PLAN_ACTIVATION') {
              tx.description = 'Activación del plan ';
            } else if (v === 'PLAN_INACTIVATION') {
              tx.description = 'Inactivación del plan ';
            }
          } else tx.description = v;
        } else if (k === 'targetAddress') {
          if (tx.description === 'Envío de BTC') {
            tx.description = tx.description + ' a ' + v.toUpperCase();
          }
        } else if (k === 'address') {
          if (tx.description === 'BTC recibidos') {
            tx.description = tx.description + ' de ' + v.toUpperCase();
          }
        } else if (k === 'additionalInfo') {
          if (
            tx.description === 'Activación del plan ' ||
            tx.description === 'Inactivación del plan '
          ) {
            tx.description =
              tx.description + v.toUpperCase().split('__')[1].toLowerCase();
          } else if (v.startsWith('OTC')) {
            tx.OTCid = v.split('id ')[1].slice(-4);
            tx.allOTCid = v.split('id ')[1];
          } else if (tx.description.startsWith('Envío')) {
            if (v !== '') {
              tx.description = tx.description + ' (' + v + ')';
            }
          }
        } else if (k === 'balanceOperationStatus') {
          tx.status = v;
        } else if (k === 'message') {
          tx.message = v;
        }
        tx.feeBTC = null;
      });
      txArray.push(tx);
    });
    var allOutcoming = 0;
    var allIncoming = 0;
    for (var i = 0; i < txArray.length; i++) {
      if (txArray[i].status === 'OK') {
        if (txArray[i].type === 'add') {
          allIncoming = allIncoming + txArray[i].amountBTC;
        } else if (txArray[i].type === 'remove') {
          allOutcoming = allOutcoming + txArray[i].amountBTC;
        }
      }
    }
    this.getOTCDetail(txArray);
    this.setState({
      transactionTable: txArray,
      allIncomingBTC: formatter.format(allIncoming),
      allOutcomingBTC: formatter.format(allOutcoming),
      renderNow: true,
    });
  };

  handleSearchUser = (e) => {
    this.setState({ userToSearch: e.target.value });
  };

  handleDetailButton(e, data) {
    let dataDetail = [];
    let dataDetailTwo = [];
    let dataDetailThree = [];
    let c = 0;
    Object.entries(data.data).forEach(([key, value]) => {
      if (
        key !== 'flag' &&
        key !== 'key' &&
        key !== 'typeOp' &&
        key !== 'targetAddress'
      ) {
        if (value !== undefined && value !== '') {
          c += 1;
          let d = {
            dataName: key,
            dataValue: value,
          };
          if (c <= 5) {
            dataDetail.push(d);
          } else if (c > 5 && c <= 10) {
            dataDetailTwo.push(d);
          } else {
            dataDetailThree.push(d);
          }
        }
      }
    });
    this.setState({
      showModalDetail: true,
      dataDetail: dataDetail,
      dataDetailTwo: dataDetailTwo,
      dataDetailThree: dataDetailThree,
    });
  }

  closeDetailModal = () => {
    this.setState({
      showModalDetail: false,
    });
  };
  render() {
    //console.log(this.state.transactionTable);
    const data = this.state.transactionTable;
    const transactionTableHeaders = [
      {
        Header: 'Tipo',
        accessor: 'type',
        Cell: (row) =>
          row.value === 'add' ? (
            <Icon color='green' name='add' />
          ) : (
            <Icon color='red' name='minus' />
          ),
        width: 60,
      },
      {
        Header: 'Fecha',
        accessor: 'date',
        width: 280,
        Cell: (row) => {
          return this.formatDate(row.value);
        },
      },
      {
        Header: 'ID OTC',
        accessor: 'OTCid',
        width: 100,
        Cell: (row) => {
          if (row.value !== undefined) {
            if (this.state.details.length > 0) {
              for (var i = 0; i < this.state.details.length; i++) {
                if (this.state.details[i].id !== undefined) {
                  if (row.value === this.state.details[i].id.slice(-4)) {
                    var text =
                      'Moneda: ' +
                      this.state.details[i].currency.toString() +
                      '\nPrecio: ' +
                      this.state.details[i].price.toLocaleString('EN-us', {
                        maximumFractionDigits: 4,
                      }) +
                      '\nMonto: ' +
                      this.state.details[i].amount.toLocaleString('EN-us', {
                        maximumFractionDigits: 4,
                      });

                    return (
                      <span className='fake-link' title={text}>
                        {row.value}
                      </span>
                    );
                  }
                  if (i + 1 === this.state.details.length) {
                    return row.value;
                  }
                } else {
                  return row.value;
                }
              }
            } else {
              return row.value;
            }
          } else {
            return 'N/A';
          }
        },
      },
      {
        Header: 'Monto',
        accessor: 'amountBTC',
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'right',
            },
          };
        },
        Cell: (row) =>
          row.original.type === 'add' ? (
            <p style={{ color: 'green' }}> {row.value} </p>
          ) : (
            <p style={{ color: 'red' }}> {row.value} </p>
          ),
        width: 200,
      },
      {
        Header: 'Descripción',
        accessor: 'description',
      },
      // {
      //   Header: "Comisión por depósito",
      //   accessor: "feeBTC",
      //   width: 160
      // },
      {
        Header: 'Receptor',
        accessor: 'receiverUserName',
      },
      {
        Header: 'Estatus',
        accessor: 'status',
        Cell: (row) => {
          if (row.value === 'OK') {
            return (
              <Label color='green'>
                <Icon name='check circle' />
                OK
              </Label>
            );
          } else if (row.value === 'PROCESSING') {
            return (
              <Label color='blue'>
                <Icon name='sync' loading />
                PROCESANDO
              </Label>
            );
          } else if (row.value === 'FAIL') {
            return (
              <Popup
                trigger={
                  <Label color='red'>
                    <Icon name='warning circle' />
                    FALLIDA
                  </Label>
                }
                content={
                  row.original.message !== undefined
                    ? row.original.message
                    : 'Fallida'
                }
                on='hover'
              />
            );
          } else {
            return (
              <Label color='teal'>
                <Icon name='exclamation' />
                {row.value}
              </Label>
            );
          }
        },
        width: 150,
      },
    ];

    const transactionMCTableHeaders = [
      {
        Header: 'Tipo',
        accessor: 'receiver',
        Cell: (row) =>
          row.value === 'true' ? (
            <Icon color='green' name='add' />
          ) : (
            <Icon color='red' name='minus' />
          ),
        width: 60,
      },
      {
        Header: 'Fecha',
        accessor: 'dateOperation',
        width: 200,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
      {
        Header: 'Tipo de Operación',
        accessor: 'type',
        width: 200,
        Cell: (row) => {
          if (row.value !== undefined) {
            if (this.state.details.length > 0) {
              for (var i = 0; i < this.state.details.length; i++) {
                if (this.state.details[i].id !== undefined) {
                  if (row.value === this.state.details[i].id.slice(-4)) {
                    var text =
                      'Moneda: ' +
                      this.state.details[i].currency.toString() +
                      '\nPrecio: ' +
                      this.state.details[i].price.toLocaleString('EN-us', {
                        maximumFractionDigits: 4,
                      }) +
                      '\nMonto: ' +
                      this.state.details[i].amount.toLocaleString('EN-us', {
                        maximumFractionDigits: 4,
                      });

                    return (
                      <span className='fake-link' title={text}>
                        {row.value}
                      </span>
                    );
                  }
                  if (i + 1 === this.state.details.length) {
                    return row.value;
                  }
                } else {
                  return row.value;
                }
              }
            } else {
              return row.value;
            }
          } else {
            return 'N/A';
          }
        },
      },
      {
        Header: 'Descripción',
        accessor: 'description',
      },
      {
        Header: 'Receptor',
        accessor: 'receiverUserName',
        Cell: (row) =>
          row.original.typeOp.includes('SEND') ? (
            <p>
              {row.original.receiverUserName
                ? row.value
                : row.original.targetAddress}{' '}
            </p>
          ) : (
            <p> {'N/A'} </p>
          ),
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'right',
            },
          };
        },
        Cell: (row) =>
          row.original.receiver === 'true' ? (
            <p style={{ color: 'green' }}> {row.value} </p>
          ) : (
            <p style={{ color: 'red' }}> {row.value} </p>
          ),
        width: 150,
      },
      {
        Header: 'Moneda',
        accessor: 'currency',
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'center',
            },
          };
        },
        width: 50,
      },

      // {
      //   Header: "Comisión por depósito",
      //   accessor: "feeBTC",
      //   width: 160
      // },
      {
        Header: 'Estatus',
        accessor: 'status',
        Cell: (row) => {
          if (row.value === 'Exitosa') {
            return (
              <Label color='green'>
                <Icon name='check circle' />
                OK
              </Label>
            );
          } else if (row.value === 'En proceso') {
            return (
              <Label color='blue'>
                <Icon name='sync' loading />
                PROCESANDO
              </Label>
            );
          } else if (row.value === 'Cancelada') {
            return (
              <Popup
                trigger={
                  <Label color='red'>
                    <Icon name='warning circle' />
                    FALLIDA
                  </Label>
                }
                content={
                  row.original.message !== undefined
                    ? row.original.message
                    : 'Fallida'
                }
                on='hover'
              />
            );
          } else {
            return (
              <Label color='teal'>
                <Icon name='exclamation' />
                {row.value}
              </Label>
            );
          }
        },
        width: 130,
      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        width: 80,
        Cell: (row) => {
          return (
            <Button
              icon='eye'
              circular
              compact
              size='tiny'
              color='blue'
              title='Ver Detalle'
              data={row.original}
              onClick={this.handleDetailButton.bind(this)}
            />
          );
        },
      },
    ];

    const walletBTCMovementsTableHeaders = [
      {
        Header: 'Tipo',
        accessor: 'type',
        Cell: (row) =>
          row.value === 'receive' ? (
            <Icon color='green' name='add' />
          ) : (
            <Icon color='red' name='minus' />
          ),
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: 'right',
            },
          };
        },
        Cell: (row) => {
          return (
            <NumberFormat
              value={this.floorDecimals(row.value, 8)}
              displayType={'text'}
              thousandSeparator={true}
            />
          );
        },
      },

      // {
      // 	Header: "Receptor",
      // 	accessor: "receiverUserName",
      // },
      {
        Header: 'Fecha de confirmación',
        accessor: 'dateConfirmed',
        Cell: (row) => {
          if (row.value !== 'Sin confirmar') {
            return moment(row.value).format('YYYY/MM/DD HH:mm:ss');
          } else {
            return row.value;
          }
        },
      },
      {
        Header: 'Confirmada',
        accessor: 'confirmed',
        Cell: (row) =>
          row.value === true ? (
            <Icon color='green' name='check circle' />
          ) : (
            <Icon color='blue' name='sync' loading />
          ),
      },
    ];
    var messageWithoutAddressUser, messageBadAddress;
    if (this.state.showUserWithoutAddressMessage) {
      messageWithoutAddressUser = (
        <Message negative>
          <Message.Header>Usuario sin address</Message.Header>
          <p>Este usuario no posee una address asociada.</p>
        </Message>
      );
    }
    if (this.state.showUserBadAddress) {
      messageBadAddress = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>
            Este usuario posee una address incorrecta o no pertenece al
            blockchain BTC.
          </p>
        </Message>
      );
    }
    return (
      <Container>
        {!this.state.showUserSearch && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              {/* <label>Usuario a consultar:</label>
              <Select
                search
                placeholder="Seleccione un usuario"
                options={this.state.listUsersEmail}
                onChange={this.pickUser}
              /> */}
              <label>Usuario a consultar:</label>
              <input
                placeholder='Indique un usuario'
                onChange={this.handleSearchUser}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.userToSearch === ''}
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={this.getUserBlockChain}
              loading={this.state.loadSearch}
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
            <Form.Field>
              <label>
                Total de usuarios registrados:{' '}
                {/* <strong>{this.state.listUsersEmail.length}</strong> */}
                <strong>{this.state.listSize}</strong>
              </label>
            </Form.Field>
          </Form.Group>
        </Form>
        {messageWithoutAddressUser}
        {messageBadAddress}
        {this.state.walletBTCAmount !== null && (
          <Menu size='small' pointing secondary>
            {this.state.userToSearch !== 'dollarBTC' && (
              <Menu.Item
                content='En dollarBTC'
                name='onDollarBTC'
                active={this.state.activeItem === 'onDollarBTC'}
                onClick={this.handleItemClick}
              />
            )}
            <Menu.Item
              content='En blockchain'
              name='onBlockchain'
              active={this.state.activeItem === 'onBlockchain'}
              onClick={this.handleItemClick}
            />
            {this.state.userToSearch !== 'dollarBTC' && (
              <Menu.Item
                content='En MoneyClick'
                name='onMoneyclick'
                active={this.state.activeItem === 'onMoneyclick'}
                onClick={this.handleItemClick}
              />
            )}
          </Menu>
        )}
        {this.state.activeItem === 'onBlockchain' &&
          this.state.walletBTCAmount !== null && (
            <Container>
              {this.state.walletBTCAmount !== null && (
                <div>
                  {!this.state.showUserBalance && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Grid>
                    <Grid.Row columns={3} divided>
                      <Grid.Column width={10}>
                        <Form>
                          <Form.Group>
                            <Form.Field width={12}>
                              <label>Addresses:</label>
                              <Select
                                defaultValue={this.state.addressSelected}
                                options={this.state.userAddresses}
                                value={this.state.addressSelected}
                                onChange={(e, data) =>
                                  this.setState({ addressSelected: data.value })
                                }
                              />
                            </Form.Field>
                            <Form.Field>
                              <Button
                                style={{ marginTop: 23 }}
                                onClick={() =>
                                  this.getMovementsByAddress(
                                    this.state.addressSelected
                                  )
                                }
                              >
                                Consultar
                              </Button>
                            </Form.Field>
                          </Form.Group>
                        </Form>
                      </Grid.Column>
                      <Grid.Column width={3}>
                        <Grid.Column>
                          <label>
                            <b>Cantidad de address: </b>
                          </label>{' '}
                          <NumberFormat
                            value={this.state.userAddresses.length}
                            displayType={'text'}
                          />
                        </Grid.Column>
                      </Grid.Column>
                      <Grid.Column width={3}>
                        <Grid.Column>
                          <label>
                            <b>Balance: </b>
                          </label>{' '}
                          <NumberFormat
                            value={this.floorDecimals(
                              this.state.walletBTCAmount,
                              8
                            )}
                            displayType={'text'}
                            thousandSeparator={true}
                          />{' '}
                        </Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Divider section />
                  <Header as='h4'>Movimientos de la cartera</Header>
                  <ReactTable
                    className='transactionTable'
                    defaultSorted={[
                      {
                        id: 'dateConfirmed',
                        desc: true,
                      },
                    ]}
                    data={this.state.walletBTCMovements}
                    columns={walletBTCMovementsTableHeaders}
                    defaultPageSize={5}
                    previousText='Anterior'
                    nextText='Siguiente'
                    loadingText='Cargando...'
                    noDataText='Este usuario no posee movimientos en su cartera'
                    pageText='Página'
                    ofText='de'
                    rowsText='filas'
                    pageJumpText='ir a la página'
                    rowsSelectorText='filas por página'
                    minRow={5}
                  />
                </div>
              )}
            </Container>
          )}
        {this.state.activeItem === 'onDollarBTC' &&
          this.state.userToSearch !== 'dollarBTC' &&
          this.state.walletBTCAmount !== null && (
            <Container>
              {this.state.walletBTCAmount !== null && (
                <div>
                  {!this.state.showOndollarBTCBalance && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Grid>
                    <Grid.Row columns='equal'>
                      <Grid.Column width={8}>
                        <Grid.Column>
                          <Segment secondary>
                            <Grid columns='equal'>
                              <Grid.Row>
                                <Grid.Column width={8}>
                                  <p>Saldo disponible: </p>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                  {this.state.walletBalanceBTC}
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo en HFT: </p>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                  {this.state.hftModelsBalance}
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo por verificar: </p>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                  {this.state.toVerifiedWalletBalanceBTC}
                                </Grid.Column>
                              </Grid.Row>
                              <Divider section />
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo total: </p>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                  {this.state.balancesTotal}
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Segment>
                        </Grid.Column>
                        <Grid.Column />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Divider section />
                  <Header as='h4'>Movimientos de la cartera</Header>
                  <ReactTable
                    defaultSorted={[
                      {
                        id: 'date',
                        desc: true,
                      },
                    ]}
                    className='transactionTable'
                    data={data}
                    columns={transactionTableHeaders}
                    defaultPageSize={5}
                    previousText='Anterior'
                    nextText='Siguiente'
                    loadingText='Cargando...'
                    noDataText='No hay transacciones'
                    pageText='Página'
                    ofText='de'
                    rowsText='filas'
                    pageJumpText='ir a la página'
                    rowsSelectorText='filas por página'
                    minRow={5}
                  />
                </div>
              )}
            </Container>
          )}
        {this.state.activeItem === 'onMoneyclick' && (
          <Container>
            <div>
              {!this.state.showUserBalance && (
                <Dimmer active inverted>
                  <Loader inverted>Cargando...</Loader>
                </Dimmer>
              )}
              <Grid>
                <Grid.Row columns='equal'>
                  <Grid.Column largeScreen={7} computer={7}>
                    <Segment secondary>
                      <label> Saldo disponible</label>
                      <Grid style={{ marginTop: 10 }}>
                        <Grid.Row>
                          <Grid.Column mobile={7} tablet={7} computer={7}>
                            <p>
                              <span>
                                {this.state.balanceOtherCurrenciesColTwo
                                  .length !== 0 &&
                                  this.state.balanceOtherCurrenciesColTwo.map(
                                    (item, index) => (
                                      <div key={index}>
                                        <span>
                                          {item.currency}
                                          {':'}
                                        </span>
                                        <span style={{ marginLeft: 10 }}>
                                          {item.balance !== null
                                            ? item.balance.toLocaleString(
                                                'en-US',
                                                {
                                                  maximumFractionDigits:
                                                    item.currency === 'BTC' ||
                                                    item.currency === 'ETH'
                                                      ? 8
                                                      : 2,
                                                }
                                              )
                                            : 0}
                                        </span>
                                        <Divider
                                          hidden
                                          style={{ margin: '4px 0px 4px 0px' }}
                                        />
                                      </div>
                                    )
                                  )}
                              </span>
                            </p>
                          </Grid.Column>
                          <Grid.Column mobile={1} tablet={1} computer={1}>
                            <Divider vertical></Divider>
                          </Grid.Column>
                          <Grid.Column mobile={7} tablet={7} computer={7}>
                            <p>
                              <span>
                                {this.state.balanceOtherCurrenciesColOne
                                  .length !== 0 &&
                                  this.state.balanceOtherCurrenciesColOne.map(
                                    (item, index) => (
                                      <div key={index}>
                                        <span>
                                          {item.currency}
                                          {':'}
                                        </span>
                                        <span style={{ marginLeft: 10 }}>
                                          {item.balance !== null
                                            ? item.balance.toLocaleString(
                                                'en-US',
                                                {
                                                  maximumFractionDigits:
                                                    item.currency === 'BTC' ||
                                                    item.currency === 'ETH'
                                                      ? 8
                                                      : 2,
                                                }
                                              )
                                            : 0}
                                        </span>
                                        <Divider
                                          hidden
                                          style={{ margin: '4px 0px 4px 0px' }}
                                        />
                                      </div>
                                    )
                                  )}
                              </span>
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                    <Grid.Column />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider section />
              <Header as='h4'>Movimientos de MoneyClick</Header>
              <ReactTable
                defaultSorted={[
                  {
                    id: 'dateOperation',
                    desc: true,
                  },
                ]}
                className='transactionTable'
                data={this.state.dataMC}
                columns={transactionMCTableHeaders}
                defaultPageSize={5}
                previousText='Anterior'
                nextText='Siguiente'
                loading={this.state.showDataMC}
                loadingText='Cargando...'
                noDataText='No hay transacciones'
                pageText='Página'
                ofText='de'
                rowsText='filas'
                pageJumpText='ir a la página'
                rowsSelectorText='filas por página'
                minRow={5}
              />
            </div>
          </Container>
        )}
        <Modal
          open={this.state.showModalDetail}
          onClose={this.closeDetailModal}
        >
          <Modal.Header>
            <Icon name='file alternate outline' />
            Detalles del Movimiento
          </Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                <Form.Group widths='five'>
                  {this.state.dataDetail.map((k) => (
                    <Form.Field key={k.dataName}>
                      <label>
                        <strong>
                          {k.dataName === 'initialAmount'
                            ? 'Monto Inicial'
                            : k.dataName === 'comision'
                            ? 'Comisión'
                            : k.dataName === 'sended'
                            ? 'Emisor'
                            : k.dataName === 'currency'
                            ? 'Moneda'
                            : k.dataName === 'date'
                            ? 'Fecha'
                            : k.dataName === 'receiver'
                            ? 'Receptor'
                            : k.dataName === 'amount'
                            ? 'Monto'
                            : k.dataName === 'status'
                            ? 'Estatus'
                            : k.dataName === 'type'
                            ? 'Tipo'
                            : k.dataName === 'dateOperation'
                            ? 'Fecha de Operación'
                            : k.dataName === 'btcPrice'
                            ? 'Precio de Bitcoin'
                            : k.dataName === 'description'
                            ? 'Descripción'
                            : k.dataName === 'fulladdress'
                            ? 'Dirección'
                            : k.dataName === 'canceledReason'
                            ? 'Razón de cancelación'
                            : k.dataName === 'accountAddress'
                            ? 'Dirección de cuenta'
                            : k.dataName === 'accountHolderName'
                            ? 'Títular de la Cuenta'
                            : k.dataName === 'accountInterbankCode'
                            ? 'Código interbancario'
                            : k.dataName === 'accountHolderPhone'
                            ? 'Teléfono del titular'
                            : k.dataName === 'accountNumber'
                            ? 'Número de Cuenta'
                            : k.dataName === 'accountZip'
                            ? 'Código Postal'
                            : k.dataName === 'automaticCharge'
                            ? 'Cambio automatico'
                            : k.dataName === 'bank'
                            ? 'Banco'
                            : k.dataName === 'bankRoutingNumber'
                            ? 'Routing Bancario'
                            : k.dataName === 'bankSwiftCode'
                            ? 'Código Swift del banco'
                            : k.dataName === 'currencySend'
                            ? 'Moneda a Enviar'
                            : k.dataName === 'typeSend'
                            ? 'Tipo de Envio'
                            : k.dataName === 'verified'
                            ? 'Verifiado'
                            : k.dataName === 'zelle'
                            ? 'Zelle'
                            : k.dataName === 'idOperation'
                            ? 'ID de Operación'
                            : k.dataName}
                        </strong>
                      </label>
                      {k.dataName === 'dateOperation' ? (
                        <p className='infoUserParagraph'>
                          {this.formatDate(new Date(k.dataValue))}
                        </p>
                      ) : (
                        <p className='infoUserParagraph'>
                          {' '}
                          {k.dataName === 'sended' || k.dataName === 'receiver'
                            ? 'SI'
                            : k.dataValue}
                        </p>
                      )}
                      <br></br>
                    </Form.Field>
                  ))}
                </Form.Group>
                <Form.Group widths='five'>
                  {this.state.dataDetailTwo.map((k) => (
                    <Form.Field key={k.dataName}>
                      <label>
                        <strong>
                          {k.dataName === 'initialAmount'
                            ? 'Monto Inicial'
                            : k.dataName === 'comision'
                            ? 'Comisión'
                            : k.dataName === 'sended'
                            ? 'Emisor'
                            : k.dataName === 'currency'
                            ? 'Moneda'
                            : k.dataName === 'date'
                            ? 'Fecha'
                            : k.dataName === 'receiver'
                            ? 'Receptor'
                            : k.dataName === 'amount'
                            ? 'Monto'
                            : k.dataName === 'status'
                            ? 'Estatus'
                            : k.dataName === 'type'
                            ? 'Tipo'
                            : k.dataName === 'dateOperation'
                            ? 'Fecha de Operación'
                            : k.dataName === 'btcPrice'
                            ? 'Precio de Bitcoin'
                            : k.dataName === 'description'
                            ? 'Descripción'
                            : k.dataName === 'fulladdress'
                            ? 'Dirección'
                            : k.dataName === 'canceledReason'
                            ? 'Razón de cancelación'
                            : k.dataName === 'accountAddress'
                            ? 'Dirección de cuenta'
                            : k.dataName === 'accountHolderName'
                            ? 'Títular de la Cuenta'
                            : k.dataName === 'accountInterbankCode'
                            ? 'Código interbancario'
                            : k.dataName === 'accountHolderPhone'
                            ? 'Teléfono del titular'
                            : k.dataName === 'accountNumber'
                            ? 'Número de Cuenta'
                            : k.dataName === 'accountZip'
                            ? 'Código Postal'
                            : k.dataName === 'automaticCharge'
                            ? 'Cambio automatico'
                            : k.dataName === 'bank'
                            ? 'Banco'
                            : k.dataName === 'bankRoutingNumber'
                            ? 'Routing Bancario'
                            : k.dataName === 'bankSwiftCode'
                            ? 'Código Swift del banco'
                            : k.dataName === 'currencySend'
                            ? 'Moneda a Enviar'
                            : k.dataName === 'typeSend'
                            ? 'Tipo de Envio'
                            : k.dataName === 'verified'
                            ? 'Verifiado'
                            : k.dataName === 'zelle'
                            ? 'Zelle'
                            : k.dataName === 'idOperation'
                            ? 'ID de Operación'
                            : k.dataName}
                        </strong>
                      </label>
                      {k.dataName === 'dateOperation' ? (
                        <p className='infoUserParagraph'>
                          {this.formatDate(new Date(k.dataValue))}
                        </p>
                      ) : (
                        <p className='infoUserParagraph'>
                          {' '}
                          {k.dataName === 'sended' || k.dataName === 'receiver'
                            ? 'SI'
                            : k.dataValue}
                        </p>
                      )}
                      <br></br>
                    </Form.Field>
                  ))}
                </Form.Group>
                <Form.Group widths='five'>
                  {this.state.dataDetailThree.map((k) => (
                    <Form.Field key={k.dataName}>
                      <label>
                        <strong>
                          {k.dataName === 'initialAmount'
                            ? 'Monto Inicial'
                            : k.dataName === 'comision'
                            ? 'Comisión'
                            : k.dataName === 'sended'
                            ? 'Emisor'
                            : k.dataName === 'currency'
                            ? 'Moneda'
                            : k.dataName === 'date'
                            ? 'Fecha'
                            : k.dataName === 'receiver'
                            ? 'Receptor'
                            : k.dataName === 'amount'
                            ? 'Monto'
                            : k.dataName === 'status'
                            ? 'Estatus'
                            : k.dataName === 'type'
                            ? 'Tipo'
                            : k.dataName === 'dateOperation'
                            ? 'Fecha de Operación'
                            : k.dataName === 'btcPrice'
                            ? 'Precio de Bitcoin'
                            : k.dataName === 'description'
                            ? 'Descripción'
                            : k.dataName === 'fulladdress'
                            ? 'Dirección'
                            : k.dataName === 'canceledReason'
                            ? 'Razón de cancelación'
                            : k.dataName === 'accountAddress'
                            ? 'Dirección de cuenta'
                            : k.dataName === 'accountHolderName'
                            ? 'Títular de la Cuenta'
                            : k.dataName === 'accountInterbankCode'
                            ? 'Código interbancario'
                            : k.dataName === 'accountHolderPhone'
                            ? 'Teléfono del titular'
                            : k.dataName === 'accountNumber'
                            ? 'Número de Cuenta'
                            : k.dataName === 'accountZip'
                            ? 'Código Postal'
                            : k.dataName === 'automaticCharge'
                            ? 'Cambio automatico'
                            : k.dataName === 'bank'
                            ? 'Banco'
                            : k.dataName === 'bankRoutingNumber'
                            ? 'Routing Bancario'
                            : k.dataName === 'bankSwiftCode'
                            ? 'Código Swift del banco'
                            : k.dataName === 'currencySend'
                            ? 'Moneda a Enviar'
                            : k.dataName === 'typeSend'
                            ? 'Tipo de Envio'
                            : k.dataName === 'verified'
                            ? 'Verifiado'
                            : k.dataName === 'zelle'
                            ? 'Zelle'
                            : k.dataName === 'idOperation'
                            ? 'ID de Operación'
                            : k.dataName}
                        </strong>
                      </label>
                      {k.dataName === 'dateOperation' ? (
                        <p className='infoUserParagraph'>
                          {this.formatDate(new Date(k.dataValue))}
                        </p>
                      ) : (
                        <p className='infoUserParagraph'>
                          {' '}
                          {k.dataName === 'sended' || k.dataName === 'receiver'
                            ? 'SI'
                            : k.dataValue}
                        </p>
                      )}
                      <br></br>
                    </Form.Field>
                  ))}
                </Form.Group>
              </Form>
            </Container>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeDetailModal}>
              <Icon name='arrow alternate circle left' /> Cerrar
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

export default CryptoWalletsBalance;
