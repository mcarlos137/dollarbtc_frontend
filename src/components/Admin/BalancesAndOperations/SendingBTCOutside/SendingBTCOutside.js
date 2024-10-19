/* eslint-disable no-loop-func */
import React, { Component } from 'react';
import '../../Admin.css';
import {
  Container,
  Form,
  Button,
  Divider,
  Segment,
  Icon,
  Header,
  Loader,
  Dimmer,
  Modal,
  Popup,
  Select,
  Message,
  Label,
  Input,
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import userService from '../../../../services/user';
import addressService from '../../../../services/address';
import _ from 'underscore';

class SendingBTCOutside extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSendingMovements: [],
      changeStatusModal: false,
      rowToChange: null,
      colorSelected2: '',
      walletToSend: null,
      listUsersEmail: [],
      allAddressConcat: '',
      showSendingTable: false,
      flagUser: '',
      userWalletsToSend: [],
      showNotEnoughBalanceMessage: false,
      showSuccessSendMessage: false,
      markFailModal: false,
      messageToFail: '',
      idTransaction: '',
      messageOperation: '',
      walletUsed: '',
      showSuccessMarkAsFailMessage: false,
      showSuccessMarkAsOkMessage: false,
      userInfo: {},
      showOwnWallets: false,
      showReportManual: false,
      coldWallet: [],
    };
  }
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
  getActualUserInfo = (allInfo) => {
    var listKeys = Object.keys(allInfo);
    var listActualKeys = [];
    var actualfirstNameKey;
    var actualLastnameKey;
    var actualPhoneKey;
    var actualQuestionSecurityKey;
    var actualAnswerSecurityKey;
    var actualTypeDocumentIdentityKey;
    var actualNumberDocumentIdentityKey;
    var actualGenderKey;
    var actualBirthdateKey;
    var actualBirthplaceKey;
    var actualFamilyNameKey;
    var actualFamilyEmailKey;
    var actualUserLocalBitcoinKey;
    var actualUserFacebookKey;
    var actualUserAddressKey;
    var otherKeys = [];
    var actualNickName;
    var actualFlag;
    var actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration;
    var actualWallets;
    var isACompany = false;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i] === 'company') {
        isACompany = true;
      }
      if (listKeys[i].startsWith('firstName')) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('lastName')) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith('phone')) {
        actualPhoneKey = listKeys[i];
      } else if (listKeys[i].startsWith('flag')) {
        actualFlag = listKeys[i];
      } else if (listKeys[i].startsWith('questionSecurity')) {
        actualQuestionSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith('answerSecurity')) {
        actualAnswerSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith('typeDocumentIdentity')) {
        actualTypeDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith('numberDocumentIdentity')) {
        actualNumberDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith('gender')) {
        actualGenderKey = listKeys[i];
      } else if (listKeys[i].startsWith('birthdate')) {
        actualBirthdateKey = listKeys[i];
      } else if (listKeys[i].startsWith('birthplace')) {
        actualBirthplaceKey = listKeys[i];
      } else if (listKeys[i].startsWith('familyName')) {
        actualFamilyNameKey = listKeys[i];
      } else if (listKeys[i].startsWith('familyEmail')) {
        actualFamilyEmailKey = listKeys[i];
      } else if (listKeys[i].startsWith('userLocalBitcoin')) {
        actualUserLocalBitcoinKey = listKeys[i];
      } else if (listKeys[i].startsWith('userFacebook')) {
        actualUserFacebookKey = listKeys[i];
      } else if (listKeys[i].startsWith('userDirection')) {
        actualUserAddressKey = listKeys[i];
      } else if (listKeys[i].startsWith('nickname')) {
        actualNickName = listKeys[i];
      } else if (listKeys[i].startsWith('companyName')) {
        actualCompanyName = listKeys[i];
      } else if (listKeys[i].startsWith('companyTypeOfFiscalRecord')) {
        actualCompanyTypeOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyNumberOfFiscalRecord')) {
        actualCompanyNumberOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith('companyYearRegistration')) {
        actualCompanyYearRegistration = listKeys[i];
      } else if (listKeys[i].startsWith('wallets')) {
        actualWallets = listKeys[i];
      } else if (
        listKeys[i] !== 'name' &&
        listKeys[i] !== 'masterWalletIds' &&
        listKeys[i] !== 'verification' &&
        !listKeys[i].endsWith('URL') &&
        listKeys[i] !== 'company'
      ) {
        otherKeys.push(listKeys[i]);
      }
    }
    listActualKeys.push(
      actualfirstNameKey,
      actualLastnameKey,
      actualPhoneKey,
      actualQuestionSecurityKey,
      actualAnswerSecurityKey,
      actualTypeDocumentIdentityKey,
      actualNumberDocumentIdentityKey,
      actualGenderKey,
      actualFlag,
      actualBirthdateKey,
      actualBirthplaceKey,
      actualFamilyNameKey,
      actualFamilyEmailKey,
      actualUserLocalBitcoinKey,
      actualUserFacebookKey,
      actualUserAddressKey,
      actualNickName,
      actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration,
      actualWallets,
      'address',
      'operationAccount',
      'environment',
      'type',
      'active',
      'email'
    );
    var allKeys = listActualKeys.concat(otherKeys);
    var modifiedObj = _.pick(allInfo, [allKeys]);
    var normalizeObject = { other: [] };
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith('firstName')) {
        normalizeObject.firstName = value;
      } else if (key.startsWith('lastName')) {
        normalizeObject.lastName = value;
      } else if (key.startsWith('email')) {
        normalizeObject.email = value;
      } else if (key.startsWith('active')) {
        normalizeObject.active = value;
      } else if (key.startsWith('flag')) {
        Object.entries(value).forEach(([k, v]) => {
          if (k === 'color') {
            normalizeObject.flag = v;
            this.setState({ flagUser: v });
          }
        });
        // normalizeObject.flag = value;
      } else if (key === 'type') {
        normalizeObject.type = value;
      } else if (key.startsWith('environment')) {
        normalizeObject.environment = value;
      } else if (key.startsWith('operationAccount')) {
        normalizeObject.operationAccount = value;
      } else if (key.startsWith('address')) {
        normalizeObject.address = value;
      } else if (key.startsWith('questionSecurity')) {
        normalizeObject.questionSecurity = value;
      } else if (key.startsWith('answerSecurity')) {
        normalizeObject.answerSecurity = value;
      } else if (key.startsWith('typeDocumentIdentity')) {
        normalizeObject.typeDocumentIdentity = value;
      } else if (key.startsWith('numberDocumentIdentity')) {
        normalizeObject.numberDocumentIdentity = value;
      } else if (key.startsWith('gender')) {
        normalizeObject.gender = value;
      } else if (key.startsWith('birthdate')) {
        normalizeObject.birthdate = value;
      } else if (key.startsWith('birthplace')) {
        normalizeObject.birthplace = value;
      } else if (key.startsWith('familyName')) {
        normalizeObject.familyName = value;
      } else if (key.startsWith('familyEmail')) {
        normalizeObject.familyEmail = value;
      } else if (key.startsWith('userLocalBitcoin')) {
        normalizeObject.userLocalBitcoin = value;
      } else if (key.startsWith('userFacebook')) {
        normalizeObject.userFacebook = value;
      } else if (key.startsWith('userDirection')) {
        normalizeObject.userDirection = value;
      } else if (key.startsWith('phone')) {
        normalizeObject.phone = value;
      } else if (key.startsWith('nickname')) {
        normalizeObject.nickname = value;
      } else if (key.startsWith('companyName')) {
        normalizeObject.companyName = value;
      } else if (key.startsWith('companyTypeOfFiscalRecord')) {
        normalizeObject.companyTypeOfFiscalRecord = value;
      } else if (key.startsWith('companyNumberOfFiscalRecord')) {
        normalizeObject.companyNumberOfFiscalRecord = value;
      } else if (key.startsWith('companyYearRegistration')) {
        normalizeObject.companyYearRegistration = value;
      } else if (key.startsWith('wallets')) {
        normalizeObject.wallets = value;
      } else if (
        !key.startsWith('paymentId') &&
        !key.startsWith('enableRequestDebitCards') &&
        !key.startsWith('enableOneDepositVerification') &&
        !key.startsWith('enableActivateGiftCards')
      ) {
        normalizeObject.other.push({ dataName: key, dataValue: value });
      }
    });
    normalizeObject.isACompany = isACompany;
    return normalizeObject;
  };
  closeUserDetailModal = () => {
    this.setState({ userDetailModal: false });
  };
  openUserDetailModal = (user) => {
    this.getUserConfig(user);
  };
  getUserConfig = (username) => {
    //var url = URL_BASE_DBTC + config.urlDollar.userConfig + username + "/OK";
    userService
      .getConfigUserGeneral(username)
      .then((resp) => {
        var lastUserInfo = this.getActualUserInfo(resp.data.result);
        this.setState({
          userInfo: lastUserInfo,
          userDetailModal: true,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  componentDidMount() {
    this.getSendingMovements();
  }
  async getSendingMovements() {
    try {
      const response = await addressService.getMovementProcesUsers();
      //console.log("getMovementProcesUsers ", response.data);
      this.makeDataTable(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  makeDataTable = (sendingMovements) => {
    var sendingMove = [];

    Object.entries(sendingMovements).forEach(([dateKey, movementInfo]) => {
      var sendingToAdd = {};
      Object.entries(movementInfo).forEach(
        ([movementeName, movementDetail]) => {
          if (movementeName === 'timestamp') {
            var date =
              movementDetail.split('T')[0] +
              'T' +
              movementDetail
                .split('T')[1]
                .replace(/-/g, ':')
                .replace('::', '.');
            sendingToAdd.timestamp = new Date(date);
          } else if (movementeName === 'substractedAmount') {
            Object.entries(movementDetail).forEach(([key, value]) => {
              if (key === 'currency') {
                sendingToAdd.currency = value;
              } else if (key === 'amount') {
                sendingToAdd.amount = value;
              } else if (key === 'initialAmount') {
                sendingToAdd.initialAmount = value;
              }
            });
          } else if (movementeName === 'balanceOperationType') {
            sendingToAdd.balanceOperationType = movementDetail;
          } else if (movementeName === 'balanceOperationStatus') {
            sendingToAdd.balanceOperationStatus = movementDetail;
          } else if (movementeName === 'balanceOperationProcessId') {
            sendingToAdd.balanceOperationProcessId = movementDetail;
          } else if (movementeName === 'targetAddress') {
            sendingToAdd.targetAddress = movementDetail;
          } else if (movementeName === 'userName') {
            sendingToAdd.userName = movementDetail;
          } else if (movementeName === 'processSendOutIn48Hours') {
            sendingToAdd.processSendOutIn48Hours = true;
          }
        }
      );
      sendingMove.push(sendingToAdd);
    });
    var definitiveListSending = [];
    for (var j = 0; j < sendingMove.length; j++) {
      if (
        (sendingMove[j].balanceOperationType === 'SEND' ||
          sendingMove[j].balanceOperationType === 'SEND_OUT') &&
        (sendingMove[j].currency === 'BTC' ||
          sendingMove[j].currency === 'USDT' ||
          sendingMove[j].currency === 'ETH')
      ) {
        definitiveListSending.push(sendingMove[j]);
      }
    }
    //	console.log("definitiveListSending", definitiveListSending);
    this.setState({
      listSendingMovements: definitiveListSending,
      showSendingTable: true,
    });
  };
  closeChangeStatusModal = () => {
    this.setState({
      changeStatusModal: false,
      walletToSend: null,
      showReportManual: false,
      idTransaction: '',
      messageOperation: '',
      walletUsed: '',
    });
  };
  closeMarkFailModal = () => {
    this.setState({ markFailModal: false, messageToFail: '' });
  };
  openChangeStatusModal = (row) => {
    this.setState(
      {
        rowToChange: row,
        walletToSend: null,
      },
      () => {
        this.getUsersAddressesWithReceivedBTCTransactions(
          this.state.rowToChange.currency
        );
      }
    );
  };
  pickWalletToSend = (e, data) => {
    this.setState({ walletToSend: data.value });
  };
  defineRedToSent(currency, wallet) {
    if (currency === 'BTC') {
      return '';
    }
    if (currency === 'ETH') {
      return '';
    }
    if (currency === 'USDT') {
      let lower = String(wallet).toLowerCase();
      lower = lower.substring(0, 1);
      if (lower === 't') {
        return 'TRC-20';
      } else {
        return 'ERC-20';
      }
    }
  }
  getPositionString = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  };
  async getBalanceByAddress(address) {
    var urlGetBalances =
      'https://cors-anywhere.herokuapp.com/https://blockchain.info/balance?active=' +
      address;
    let balance = null;
    try {
      const response = await axios.get(urlGetBalances);
      balance = response.data[address].final_balance;
      return balance;
    } catch (error) {
      return balance;
    }
  }
  async getUsersAddressesWithReceivedBTCTransactions(crypto) {
    try {
      const response =
        await userService.getUsersAddressesWithReceivedBTCTransactions(crypto);

      var listWallet = response.data;
      var definitiveAddressBalance = [];
      for (var i = 0; i < listWallet.length; i++) {
        Object.entries(listWallet[i]).forEach(([key, value]) => {
          if (key === 'addresses') {
            Object.entries(value).forEach(([address, amount]) => {
              var addressBTCBalance = {};
              addressBTCBalance.userName = listWallet[i].userName;
              addressBTCBalance.key = address;
              addressBTCBalance.balance = amount;
              addressBTCBalance.text =
                addressBTCBalance.userName +
                ' - ' +
                addressBTCBalance.key +
                ' - ' +
                crypto +
                addressBTCBalance.balance;
              addressBTCBalance.value = address + '-' + amount;
              addressBTCBalance.address = address + '-' + amount;
              if (addressBTCBalance.balance > 0) {
                definitiveAddressBalance.push(addressBTCBalance);
              }
            });
          }
        });
      }
      this.setState(
        {
          userWalletsToSend: definitiveAddressBalance,
        },

        () => {
          this.setState({ changeStatusModal: true });
        }
      );
    } catch (error) {
      if (
        error !== undefined &&
        error.response !== undefined &&
        error.response.status === 502
      ) {
        this.setState({ showSendingTable: true });
      }
      this.setState({ showSendingTable: true });
    }
  }
  /*async getWalletsBalance() {
		try {
			const response = await userService.getUserWithBtcBalance();
			var listUser = response.data;
			this.getAllConfiUser(listUser);
		} catch (error) {}
	}*/
  /*getAllConfiUser(listName) {
		var body = {
			userNames: listName,
		};
		userService
			.getUserConfigs(body)
			.then((res) => {
				const regexAddressBTC = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
				var allAddress = "";
				var allUserConfigs = res.data.result;

				var usernameAddressBalance = [];
				for (var j = 0; j < allUserConfigs.length; j++) {
					let address = "";
					let mcAddres = "";
					if (allUserConfigs[j].wallets !== undefined) {
						if (allUserConfigs[j].wallets.current !== undefined) {
							let current = allUserConfigs[j].wallets.current;
							address = Object.values(current)[0].address;
						}
						if (allUserConfigs[j].wallets.old !== undefined) {
							Object.entries(allUserConfigs[j].wallets.old).forEach(
								([key, value]) => {
									if (regexAddressBTC.test(value.address)) {
										var usernameAddressToAdd = {};
										if (allAddress === "") {
											allAddress = value.address;
										} else {
											allAddress = allAddress + "|" + value.address;
										}
										usernameAddressToAdd.email = allUserConfigs[j].name;
										usernameAddressToAdd.address = value.address;
										//usernameAddressToAdd.privatekey = allUserConfigs[j].privateKey;
										usernameAddressBalance.push(usernameAddressToAdd);
									}
								},
							);
						}
					} else if (allUserConfigs[j].address !== undefined) {
						address = allUserConfigs[j].address;
					}
					if (allUserConfigs[j].mcWallets !== undefined) {
						if (allUserConfigs[j].mcWallets.current !== undefined) {
							let mcCurrent = allUserConfigs[j].mcWallets.current;
							mcAddres = Object.values(mcCurrent)[0].address;
						}
						if (allUserConfigs[j].mcWallets.old !== undefined) {
							Object.entries(allUserConfigs[j].mcWallets.old).forEach(
								([keyMc, valueMc]) => {
									if (regexAddressBTC.test(valueMc.address)) {
										var usernameAddressToAddM = {};
										if (allAddress === "") {
											allAddress = valueMc.address;
										} else {
											allAddress = allAddress + "|" + valueMc.address;
										}
										usernameAddressToAddM.email = allUserConfigs[j].name;
										usernameAddressToAddM.address = valueMc.address;
										//usernameAddressToAdd.privatekey = allUserConfigs[j].privateKey;
										usernameAddressBalance.push(usernameAddressToAddM);
									}
								},
							);
						}
					}

					if (regexAddressBTC.test(mcAddres)) {
						var usernameAddressToAddMC = {};
						if (allAddress === "") {
							allAddress = mcAddres;
						} else {
							allAddress = allAddress + "|" + mcAddres;
						}
						usernameAddressToAddMC.email = allUserConfigs[j].name;
						usernameAddressToAddMC.address = mcAddres;
						//usernameAddressToAdd.privatekey = allUserConfigs[j].privateKey;
						usernameAddressBalance.push(usernameAddressToAddMC);
					}
					if (regexAddressBTC.test(address)) {
						var usernameAddressToAdd = {};
						if (allAddress === "") {
							allAddress = address;
						} else {
							allAddress = allAddress + "|" + address;
						}
						usernameAddressToAdd.email = allUserConfigs[j].name;
						usernameAddressToAdd.address = address;
						//usernameAddressToAdd.privatekey = allUserConfigs[j].privateKey;
						usernameAddressBalance.push(usernameAddressToAdd);
					}
				}

				var definitiveAddressBalance = [];
				var coldAddressBalance = [];
				addressService
					.getAddressByCurrency("BTC")
					.then(async (rep) => {
						var addressBTC = rep.data;

						for (var t = 0; t < addressBTC.length; t++) {
							var addressBTCBalance = {};
							if (regexAddressBTC.test(addressBTC[t].address)) {
								addressBTCBalance.address = addressBTC[t].address;
								addressBTCBalance.otcMasterAccount =
									addressBTC[t].otcMasterAccount;
								addressBTCBalance.hasPrivateKey = addressBTC[t].hasPrivateKey;
								addressBTCBalance.email = "dollarBTC";
								let privateKey = addressBTC[t].hasPrivateKey;
								try {
									const balanceAddress = await this.getBalanceByAddress(
										addressBTC[t].address,
									);
									addressBTCBalance.balance = balanceAddress;
									addressBTCBalance.key = addressBTC[t].address;
									addressBTCBalance.text =
										"dollarBTC " +
										"- " +
										addressBTC[t].otcMasterAccount.slice(4) +
										" - " +
										addressBTC[t].address +
										" - BTC " +
										this.floorDecimals(balanceAddress * 0.00000001, 8);
									addressBTCBalance.value = addressBTC[t].address;
								} catch (error) {
									console.log(error);
								}
								if (addressBTCBalance.balance > 0) {
									if (privateKey === false) {
										coldAddressBalance.push(addressBTCBalance);
									} else {
										definitiveAddressBalance.push(addressBTCBalance);
									}
								}
							}
						}
					})
					.catch((error) => {
						this.setState({ showSendingTable: true });
						console.log(error);
					});

				var indexOfSeparator = this.getPositionString(allAddress, "|", 125);

				var urlGetBalances =
					"https://cors-anywhere.herokuapp.com/https://blockchain.info/balance?active=" +
					allAddress.slice(0, indexOfSeparator);
				axios
					.get(urlGetBalances)
					.then((respo) => {
						Object.entries(respo.data).forEach(([address, balanceInfo]) => {
							for (var x = 0; x < usernameAddressBalance.length; x++) {
								if (usernameAddressBalance[x].address === address) {
									if (balanceInfo.final_balance > 0) {
										var usernameAddressWithBalance = usernameAddressBalance[x];
										usernameAddressWithBalance.balance =
											balanceInfo.final_balance;
										usernameAddressWithBalance.key =
											usernameAddressBalance[x].address;
										usernameAddressWithBalance.value =
											usernameAddressBalance[x].address +
											"-" +
											this.floorDecimals(
												balanceInfo.final_balance * 0.00000001,
												8,
											);
										usernameAddressWithBalance.text =
											usernameAddressBalance[x].email +
											" - " +
											usernameAddressBalance[x].address +
											" - BTC " +
											this.floorDecimals(
												balanceInfo.final_balance * 0.00000001,
												8,
											);
										definitiveAddressBalance.push(usernameAddressWithBalance);
									}
								}
							}
						});
						this.setState(
							{
								userWalletsToSend: definitiveAddressBalance,
								coldWallet: coldAddressBalance,
							},

							() => {
								this.setState({ showSendingTable: true });
							},
						);
					})
					.catch((error) => {
						if (
							error !== undefined &&
							error.response !== undefined &&
							error.response.status === 502
						) {
							this.setState({ showSendingTable: true });
						}
						this.setState({ showSendingTable: true });
						//console.log(error);
					});
			})
			.catch((error) => {
				this.setState({ showSendingTable: true });
				console.log(error);
			});
	}*/
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  sendBTCManually() {
    let body = {
      userName: this.state.rowToChange.userName,
      balanceOperationProcessId:
        this.state.rowToChange.balanceOperationProcessId,
      adminMessage: this.state.messageOperation,
      baseAddress: this.state.walletUsed,
      txId: this.state.idTransaction,
      balanceOperationStatus: 'OK',
    };
    userService
      .processBalanceMovements(body)
      .then((resp) => {
        if (resp.data.result === 'OK') {
          this.setState({
            showSuccessMarkAsOkMessage: true,
            loadSend: false,
            messageToFail: '',
          });
          setTimeout(() => {
            this.setState({
              showSuccessMarkAsOkMessage: false,
            });
          }, 5000);
          this.getSendingMovements();
          this.closeChangeStatusModal();
        }
      })
      .catch((error) => {});
  }
  sendBTC = () => {
    this.setState({ loadSend: true });
    var urlOk;
    let bodyWallet;
    if (this.state.walletToSend !== null) {
      if (
        Number(this.state.walletToSend.split(/[-]/)[1]) >=
        this.state.rowToChange.initialAmount
      ) {
        bodyWallet = {
          userName: this.state.rowToChange.userName,
          balanceOperationProcessId:
            this.state.rowToChange.balanceOperationProcessId,
          adminMessage: '',
          baseAddress: this.state.walletToSend.split(/[-]/)[0],
          txId: '',
          balanceOperationStatus: 'OK',
        };
        urlOk = userService.processBalanceMovementsNNull(bodyWallet);
        urlOk
          .then((resp) => {
            this.setState({
              showSuccessMarkAsOkMessage: true,
              loadSend: false,
              messageToFail: '',
            });
            setTimeout(() => {
              this.setState({
                showSuccessMarkAsOkMessage: false,
              });
            }, 5000);
            this.getSendingMovements();
            this.closeChangeStatusModal();
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        this.setState({
          showNotEnoughBalanceMessage: true,
          loadSend: false,
          messageToFail: '',
        });
        setTimeout(() => {
          this.setState({
            showNotEnoughBalanceMessage: false,
          });
        }, 5000);
      }
    } else {
      bodyWallet = {
        userName: this.state.rowToChange.userName,
        balanceOperationProcessId:
          this.state.rowToChange.balanceOperationProcessId,
        adminMessage: '',
        baseAddress: null,
        txId: '',
        balanceOperationStatus: 'OK',
      };
      urlOk = userService.processBalanceMovementsNNull(bodyWallet);
      urlOk
        .then((resp) => {
          this.setState({
            showSuccessMarkAsOkMessage: true,
            loadSend: false,
            messageToFail: '',
          });
          setTimeout(() => {
            this.setState({
              showSuccessMarkAsOkMessage: false,
            });
          }, 5000);
          this.getSendingMovements();
          this.closeChangeStatusModal();
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };
  markAsFail = () => {
    this.setState({ loadSend: true });
    let body = {
      userName: this.state.rowToChange.userName,
      balanceOperationProcessId:
        this.state.rowToChange.balanceOperationProcessId,
      adminMessage: this.state.messageToFail,
      baseAddress: '',
      txId: '',
      balanceOperationStatus: 'FAIL',
    };
    var urlFail = userService.processBalanceMovementsFail(body);
    urlFail
      .then((resp) => {
        this.setState({
          showSuccessMarkAsFailMessage: true,
          loadSend: false,
          messageToFail: '',
        });
        setTimeout(() => {
          this.setState({
            showSuccessMarkAsFailMessage: false,
          });
        }, 5000);
        this.getSendingMovements();
        this.closeMarkFailModal();
        this.closeChangeStatusModal();
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  handleMessageFail = (e) => {
    this.setState({ messageToFail: e.target.value });
  };
  handleAddressToSend = (e) => {
    this.setState({ walletToSend: e.target.value });
  };
  handleWalletUsed = (e, data) => {
    this.setState({ walletUsed: data.value.split('-')[0] });
  };
  handleIdTransaction = (e) => {
    this.setState({ idTransaction: e.target.value });
  };
  handleMessage = (e) => {
    this.setState({ messageOperation: e.target.value });
  };
  handleColors2(e, data) {
    this.setState({
      colorSelected2: data.value,
      colorlabel2: data.text,
    });
  }
  addFlag() {
    let body = {
      operatorUserName: window.sessionStorage.getItem('username'),
      userName: this.state.usernameSelected,
      flagColor: this.state.colorSelected2.toUpperCase(),
    };
    //	console.log(body);
    this.setState({ loadModal: true });
    userService
      .addFlag(body)
      .then((res) => {
        //	console.log(res);
        if (res.data !== 'OK') {
          this.setState({
            loadModal: false,
            message: 'Error de la actualizacion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          this.setState({
            loadModal: false,
            message: 'Actualizacion exitosa',
            colorMessage: 'green',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
              colorSelected: '',
              data3: [],
              userDetailModal: true,
            });

            this.getUserConfig(this.state.usernameSelected);
            this.closeModalonly();
          }, 5000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.toString().includes('Network')) {
          this.setState({
            loadModal: false,
            message: 'Error de conexion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          //	console.log("dentro del else catch inesperado addflag");
          this.setState({
            loadModal: false,
            message:
              'Ha ocurrido un error inesperado, por favor intente mas tarde',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({ message: '', showMessage2: false });
          }, 5000);
          this.closeModal();
        }
      });
  }
  openModal() {
    this.setState({ openModal: true, userDetailModal: false });
  }
  closeModal() {
    this.setState({ openModal: false, colorSelected2: '' });
  }
  closeModalonly() {
    this.setState({
      userDetailModal: true,
      openModal: false,
      colorSelected2: '',
    });
  }
  render() {
    const listColors = [
      {
        key: 'select',
        text: 'seleccione',
        value: null,
        //description: "",
      },
      {
        key: 'red',
        text: 'Rojo',
        value: 'red',
        //description: "Usuario Estafador",
      },
      {
        key: 'purple',
        text: 'Violeta',
        value: 'purple',
        //description: "Usuario problemático",
      },
      {
        key: 'green',
        text: 'Verde',
        value: 'green',
        //description: "Usuario Confiable",
      },
      {
        key: 'yellow',
        text: 'Amarillo',
        value: 'yellow',
        //description: "Usuario Sospechoso",
      },
      {
        key: 'black',
        text: 'Negro',
        value: 'black',
        //description: "Usuario Suspendido",
      },
      {
        key: 'orange',
        text: 'Naranja',
        value: 'orange',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'blue',
        text: 'Azul',
        value: 'blue',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'grey',
        text: 'Gris',
        value: 'grey',
        //	description: "Usuario en Investigacion",
      },
    ];
    let messageNotEnoughBalance,
      messageSuccessSend,
      messageSuccessMarkAsFail,
      messageSuccessMarkAsOk;
    if (this.state.showSuccessMarkAsFailMessage) {
      messageSuccessMarkAsFail = (
        <Message negative>
          <Message.Header>Operación marcada como fallida</Message.Header>
          <p>La operación ha sido marcada como fallida exitosamente.</p>
        </Message>
      );
    }
    if (this.state.showSuccessMarkAsOkMessage) {
      messageSuccessMarkAsOk = (
        <Message success>
          <Message.Header>Operación marcada como exitosa</Message.Header>
          <p>La operación ha sido marcada como exitosa exitosamente.</p>
        </Message>
      );
    }
    if (this.state.showNotEnoughBalanceMessage) {
      messageNotEnoughBalance = (
        <Message negative>
          <Message.Header>Balance insuficiente</Message.Header>
          <p>
            No hay suficiente saldo en la cartera seleccionada para realizar el
            envío.
          </p>
        </Message>
      );
    }
    if (this.state.showSuccessSendMessage) {
      messageSuccessSend = (
        <Message success>
          <Message.Header>Transacción exitosa</Message.Header>
          <p>La operación ha sido realizada exitosamente.</p>
        </Message>
      );
    }
    const sendingMovementsTableHeaders = [
      {
        Header: 'Id',
        accessor: 'balanceOperationProcessId',
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        width: 165,
        Cell: (row) => {
          return this.formatDate(row.value);
        },
      },
      {
        Header: 'Usuario',
        accessor: 'userName',
        width: 135,
        Cell: (row) => {
          return (
            <p
              className='fake-link'
              onClick={() => this.openUserDetailModal(row.value)}
            >
              {row.value}
            </p>
          );
        },
      },
      {
        Header: 'Monto',
        accessor: 'initialAmount',
        width: 130,
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
      {
        Header: 'Moneda',
        accessor: 'currency',
        Cell: (row) => {
          return row.value;
        },
        width: 100,
      },
      {
        Header: 'Destino',
        accessor: 'targetAddress',
        Cell: (row) => {
          return (
            <p>
              {this.defineRedToSent(row.original.currency, row.value) +
                ' ' +
                row.value}
            </p>
          );
        },
      },
      {
        Header: 'Envio en 12 horas',
        accessor: 'processSendOutIn48Hours',
        Cell: (row) => {
          if (row.value === true) {
            return <p>SI</p>;
          } else {
            return <p>NO</p>;
          }
        },
      },
      {
        Header: 'Estatus',
        accessor: 'balanceOperationStatus',
        Cell: (row) => {
          return (
            <Label color='blue'>
              <Icon name='sync' loading />
              PROCESANDO
            </Label>
          );
        },
        width: 150,
      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        width: 75,
        Cell: (row) => {
          return (
            <div>
              <Popup
                trigger={
                  <Button
                    onClick={() => this.openChangeStatusModal(row.original)}
                    color='blue'
                    size='tiny'
                    circular
                    icon
                  >
                    <Icon
                      name={
                        row.original.currency === 'BTC'
                          ? 'btc'
                          : row.original.currency === 'USDT'
                          ? 'usd'
                          : 'ethereum'
                      }
                    />
                  </Button>
                }
                content={'Enviar ' + row.original.currency}
              />
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Modal
          open={this.state.changeStatusModal}
          onClose={this.closeChangeStatusModal}
        >
          {this.state.rowToChange !== null && (
            <Modal.Header>
              Enviar {this.state.rowToChange.currency}
            </Modal.Header>
          )}
          <Modal.Content>
            <Modal.Description>
              {this.state.rowToChange !== null && (
                <div>
                  {/*<p>
                          <b>Atención:</b> el proceso de envío debe hacerse
                          desde un manejador de wallets seguro. Aquí solo se
                          reporta que la operación fue realizada.
                        </p>*/}
                  <p style={{ textAlign: 'justify' }}>
                    {this.state.showReportManual
                      ? 'Indique los datos utilizados para el envío de'
                      : 'Está seguro que desea aprobar el envio de'}{' '}
                    los fondos solicitados por el usuario{' '}
                    <b>{this.state.rowToChange.userName}</b>, cuyo id es{' '}
                    <b>
                      {this.state.rowToChange.balanceOperationProcessId &&
                        this.state.rowToChange.balanceOperationProcessId.slice(
                          -4
                        )}
                    </b>{' '}
                    con un monto a enviar de{' '}
                    <b>
                      {this.state.rowToChange.initialAmount}{' '}
                      {this.state.rowToChange.currency +
                        ' ' +
                        this.defineRedToSent(
                          this.state.rowToChange.currency,
                          this.state.rowToChange.targetAddress
                        )}
                    </b>{' '}
                    hacia la dirección destino{' '}
                    <b>{this.state.rowToChange.targetAddress}</b>, de ser
                    necesario puede seleccionar una cartera
                  </p>
                </div>
              )}
              <Divider />
              <Form>
                {this.state.showReportManual ? (
                  <div>
                    <Form.Group>
                      <Form.Field width={16}>
                        {/* <label>Cartera utilizada</label>
                        <Input
                          placeholder="Cartera utilizada"
                          onChange={this.handleWalletUsed.bind(this)}
                          value={this.state.walletUsed}
                        /> */}
                        <label>Cartera utilizada</label>
                        <Select
                          placeholder='Seleccione una cartera'
                          options={this.state.coldWallet}
                          onChange={this.handleWalletUsed.bind(this)}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group>
                      <Form.Field width={16}>
                        <label>ID de la transacción</label>
                        <Input
                          placeholder='ID de la transacción'
                          onChange={this.handleIdTransaction.bind(this)}
                          value={this.state.idTransaction}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group>
                      <Form.Field width={16}>
                        <label>Mensaje</label>
                        <Input
                          placeholder='Mensaje'
                          onChange={this.handleMessage.bind(this)}
                          value={this.state.messageOperation}
                        />
                      </Form.Field>
                    </Form.Group>
                  </div>
                ) : (
                  <div>
                    <Form.Group>
                      <Form.Field width={16}>
                        <label>Cartera a pagar</label>
                        <Select
                          placeholder='Seleccione una cartera'
                          options={this.state.userWalletsToSend}
                          value={this.state.walletToSend}
                          onChange={this.pickWalletToSend.bind(this)}
                        />
                      </Form.Field>
                    </Form.Group>
                  </div>
                )}

                {messageNotEnoughBalance}
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.closeChangeStatusModal}
              loading={this.state.loadSend}
              color='grey'
            >
              <Icon name='remove' /> Cancelar
            </Button>
            {this.state.coldWallet.length > 0 && (
              <Button
                onClick={() => {
                  this.setState({
                    showReportManual: true,
                  });
                }}
                loading={this.state.loadSend}
                color='blue'
              >
                <Icon name='hand paper outline' /> Reportar envío manual
              </Button>
            )}
            <Button
              type='submit'
              color='red'
              loading={this.state.loadSend}
              onClick={() => {
                this.setState({
                  markFailModal: true,
                  changeStatusModal: false,
                  walletToSend: null,
                });
              }}
            >
              <Icon name='exclamation circle' /> Marcar fallido
            </Button>
            {this.state.showReportManual && (
              <Button
                type='submit'
                color='blue'
                disabled={
                  this.state.walletUsed === null ||
                  this.state.idTransaction === ''
                }
                onClick={this.sendBTCManually.bind(this)}
                loading={this.state.loadSend}
              >
                <Icon name='checkmark' /> Enviar
              </Button>
            )}
            {!this.state.showReportManual && (
              <Button
                type='submit'
                color='blue'
                onClick={() => this.sendBTC()}
                loading={this.state.loadSend}
              >
                <Icon name='checkmark' /> Enviar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.markFailModal}
          onClose={this.closeMarkFailModal}
          closeOnEscape={false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Marcar fallido</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {this.state.rowToChange !== null && (
                <p style={{ textAlign: 'justify' }}>
                  Debe agregar una razón por la cual no es posible realizar el
                  envío de los {this.state.rowToChange.currency} solicitado por
                  el usuario <b>{this.state.rowToChange.userName}</b>, cuyo id
                  es{' '}
                  <b>
                    {this.state.rowToChange.balanceOperationProcessId &&
                      this.state.rowToChange.balanceOperationProcessId.slice(
                        -4
                      )}
                  </b>{' '}
                  con un monto a enviar de{' '}
                  <b>
                    {this.state.rowToChange.initialAmount}{' '}
                    {this.state.rowToChange.currency +
                      ' ' +
                      this.defineRedToSent(
                        this.state.rowToChange.currency,
                        this.state.rowToChange.targetAddress
                      )}
                  </b>{' '}
                  hacia la dirección destino{' '}
                  <b>{this.state.rowToChange.targetAddress}</b>
                </p>
              )}
              <Divider />
              <Form>
                <Form.Group>
                  <Form.Field width={16}>
                    <label>Razón</label>
                    <input
                      placeholder='Address incorrecta'
                      onChange={this.handleMessageFail}
                    />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => {
                this.setState({
                  markFailModal: false,
                  messageToFail: '',
                  changeStatusModal: true,
                });
              }}
              loading={this.state.loadSend}
              color='grey'
            >
              <Icon name='remove' /> Cancelar
            </Button>
            <Button
              type='submit'
              color='red'
              loading={this.state.loadSend}
              onClick={this.markAsFail}
              disabled={this.state.messageToFail === ''}
            >
              <Icon name='exclamation circle' /> Marcar fallido
            </Button>
          </Modal.Actions>
        </Modal>

        <Modal
          closeIcon
          open={this.state.openModal}
          onClose={this.closeModal.bind(this)}
        >
          <Modal.Header>{'Seleccione el Tipo de la Alerta'}</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loadModal}>
              <p>
                ¿Está seguro que desea este color para la nueva alerta de este
                usuario?
              </p>
              <Form>
                <Form.Group inline>
                  <label>
                    <b>Tipo de la Alerta</b>
                  </label>
                  <Form.Select
                    search
                    options={listColors}
                    onChange={this.handleColors2.bind(this)}
                  ></Form.Select>

                  {this.state.colorSelected2 && (
                    <Label
                      circular
                      color={this.state.colorSelected2}
                      style={{ marginLeft: '20px' }}
                    />
                  )}

                  {this.state.colorSelected2 && (
                    <Label style={{ marginLeft: '20px' }}>
                      {this.state.colorSelected2.toLowerCase() === 'green'
                        ? 'Usuario Confiable'
                        : this.state.colorSelected2.toLowerCase() === 'purple'
                        ? 'Usuario problemático'
                        : this.state.colorSelected2.toLowerCase() === 'red'
                        ? 'Posible Estafador'
                        : this.state.colorSelected2.toLowerCase() === 'black'
                        ? 'Usuario Suspendido'
                        : this.state.colorSelected2.toLowerCase() === 'orange'
                        ? 'Usuario en Investigación'
                        : this.state.colorSelected2.toLowerCase() === 'yellow'
                        ? 'Usuario Sospechoso'
                        : this.state.colorSelected2.toLowerCase() === 'blue'
                        ? 'Usuario VIP'
                        : this.state.colorSelected2.toLowerCase() === 'grey'
                        ? 'Usuario de pruebas'
                        : ''}
                    </Label>
                  )}
                </Form.Group>
              </Form>
              {this.state.showMessage2 && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {this.state.colorSelected2 !== '' &&
              this.state.colorSelected2 !== undefined && (
                <div>
                  <Button
                    onClick={this.closeModalonly.bind(this)}
                    disabled={this.state.showMessage2 || this.state.loadModal}
                    negative
                  >
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button
                    onClick={this.addFlag.bind(this)}
                    disabled={this.state.showMessage2 || this.state.loadModal}
                    positive
                  >
                    <Icon name='checkmark' />
                    Si
                  </Button>
                </div>
              )}
          </Modal.Actions>
        </Modal>

        <Modal
          closeIcon
          open={this.state.userDetailModal}
          onClose={this.closeUserDetailModal}
        >
          <Modal.Header>Detalle de usuario</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Button
                style={{ marginLeft: '350px' }}
                //disabled={this.state.userInfo === ""}
                color='blue'
                // style={{ marginTop: 23 }}
                onClick={this.openModal.bind(this)}
                //loading={this.state.loadSearch}
              >
                Agregar Alerta
              </Button>
              {this.state.flagUser !== '' &&
                this.state.userInfo.flag !== '' &&
                this.state.userInfo.flag !== undefined &&
                this.state.userInfo.flag !== null && (
                  <Popup
                    position='top center'
                    trigger={
                      <Segment
                        textAlign='center'
                        color={this.state.userInfo.flag.toLowerCase()}
                        inverted
                      >
                        {this.state.userInfo.flag === 'GREEN'
                          ? 'Usuario Confiable'
                          : this.state.userInfo.flag === 'PURPLE'
                          ? 'Usuario problemático'
                          : this.state.userInfo.flag === 'RED'
                          ? 'Usuario Estafador'
                          : this.state.userInfo.flag === 'BLACK'
                          ? 'Usuario Suspendido'
                          : this.state.userInfo.flag === 'ORANGE'
                          ? 'Usuario en Investigación'
                          : this.state.userInfo.flag === 'YELLOW'
                          ? 'Usuario Sospechoso'
                          : this.state.userInfo.flag === 'BLUE'
                          ? 'Usuario VIP'
                          : this.state.userInfo.flag === 'GREY'
                          ? 'Usuario de pruebas'
                          : ''}
                      </Segment>
                    }
                    content='Tipo de Alerta'
                  />
                )}
              <Form>
                {this.state.userInfo.isACompany && (
                  <Divider horizontal>
                    <Header as='h4'>Datos de la empresa</Header>
                  </Divider>
                )}
                {this.state.userInfo.isACompany && (
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>Nombre de la empresa</label>
                      <p className='infoUserParagraph'>
                        {this.state.userInfo.companyName !== undefined &&
                        this.state.userInfo.companyName !== ''
                          ? this.state.userInfo.companyName
                          : 'No posee'}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Tipo de registro fiscal</label>
                      <p className='infoUserParagraph'>
                        {this.state.userInfo.companyTypeOfFiscalRecord !==
                          undefined &&
                        this.state.userInfo.companyTypeOfFiscalRecord !== ''
                          ? this.state.userInfo.companyTypeOfFiscalRecord
                          : 'No posee'}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Número de registro fiscal</label>
                      <p className='infoUserParagraph'>
                        {this.state.userInfo.companyNumberOfFiscalRecord !==
                          undefined &&
                        this.state.userInfo.companyNumberOfFiscalRecord !== ''
                          ? this.state.userInfo.companyNumberOfFiscalRecord
                          : 'No posee'}
                      </p>
                    </Form.Field>
                    <Form.Field>
                      <label>Año de registro</label>
                      <p className='infoUserParagraph'>
                        {this.state.userInfo.companyYearRegistration !==
                          undefined &&
                        this.state.userInfo.companyYearRegistration !== ''
                          ? this.state.userInfo.companyYearRegistration
                          : 'No posee'}
                      </p>
                    </Form.Field>
                  </Form.Group>
                )}
                <Divider horizontal>
                  <Header as='h4'>Datos personales</Header>
                </Divider>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Nombres</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.firstName !== undefined &&
                      this.state.userInfo.firstName !== ''
                        ? this.state.userInfo.firstName
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Apellidos</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.lastName !== undefined &&
                      this.state.userInfo.lastName !== ''
                        ? this.state.userInfo.lastName
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Sexo</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.gender !== undefined &&
                      this.state.userInfo.gender !== ''
                        ? this.state.userInfo.gender === 'male'
                          ? 'Masculino'
                          : 'Femenino'
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Tipo de documento</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.typeDocumentIdentity !== undefined &&
                      this.state.userInfo.typeDocumentIdentity !== ''
                        ? this.state.userInfo.typeDocumentIdentity
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Número de documento</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.numberDocumentIdentity !==
                        undefined &&
                      this.state.userInfo.numberDocumentIdentity !== ''
                        ? this.state.userInfo.numberDocumentIdentity
                        : 'No posee'}
                    </p>
                  </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Fecha de nacimiento</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.birthdate !== undefined &&
                      this.state.userInfo.birthdate !== ''
                        ? this.state.userInfo.birthdate
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Lugar de nacimiento</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.birthplace !== undefined &&
                      this.state.userInfo.birthplace !== ''
                        ? this.state.userInfo.birthplace
                        : 'No posee'}
                    </p>
                  </Form.Field>

                  <Form.Field>
                    <label>Teléfono</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.phone !== undefined &&
                      this.state.userInfo.phone !== '' &&
                      this.state.userInfo.phone !== '0'
                        ? this.state.userInfo.phone
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Dirección</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.userDirection !== undefined &&
                      this.state.userInfo.userDirection !== ''
                        ? this.state.userInfo.userDirection
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field></Form.Field>
                  {/* <Form.Field>
										<label>Usuario localBitcoin</label>
										<p className='infoUserParagraph'>
											{this.state.userInfo.userLocalBitcoin !== undefined &&
											this.state.userInfo.userLocalBitcoin !== ""
												? this.state.userInfo.userLocalBitcoin
												: "No posee"}
										</p>
									</Form.Field> */}
                </Form.Group>
                <Form.Group widths='equal'>
                  {/* <Form.Field>
										<label>Usuario de Facebook</label>
										<p className='infoUserParagraph'>
											{this.state.userInfo.userFacebook !== undefined &&
											this.state.userInfo.userFacebook !== ""
												? this.state.userInfo.userFacebook
												: "No posee"}
										</p>
									</Form.Field> */}
                  <Form.Field>
                    <label>Pregunta de seguridad</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.questionSecurity !== undefined &&
                      this.state.userInfo.questionSecurity !== ''
                        ? '**************' //this.state.userInfo.questionSecurity
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Respuesta de seguridad</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.answerSecurity !== undefined &&
                      this.state.userInfo.answerSecurity !== ''
                        ? '**************' // this.state.userInfo.answerSecurity
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Familiar de contacto</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.familyName !== undefined &&
                      this.state.userInfo.familyName !== ''
                        ? this.state.userInfo.familyName
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field>
                    <label>Email del contacto</label>
                    <p className='infoUserParagraph'>
                      {this.state.userInfo.familyEmail !== undefined &&
                      this.state.userInfo.familyEmail !== ''
                        ? this.state.userInfo.familyEmail
                        : 'No posee'}
                    </p>
                  </Form.Field>
                  <Form.Field></Form.Field>
                </Form.Group>
                <Divider horizontal>
                  <Header as='h4'>Datos del usuario</Header>
                </Divider>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Email</label>
                    {this.state.userInfo.email !== undefined &&
                    this.state.userInfo.email !== ''
                      ? this.state.userInfo.email
                      : 'No posee'}
                  </Form.Field>
                  <Form.Field style={{ marginRight: -110 }}>
                    <label>Address</label>
                    {this.state.userInfo.address !== undefined &&
                    this.state.userInfo.address !== ''
                      ? this.state.userInfo.address
                      : 'No posee'}
                  </Form.Field>
                  <Form.Field />
                  <Form.Field>
                    <label>Tipo de usuario</label>
                    {this.state.userInfo.type}
                  </Form.Field>
                  <Form.Field>
                    <label>Estatus del usuario</label>
                    {this.state.userInfo.active ? 'Activo' : 'Inactivo'}
                  </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Nombre de usuario</label>
                    {this.state.userInfo.nickname !== undefined &&
                    this.state.userInfo.nickname !== ''
                      ? this.state.userInfo.nickname
                      : 'No posee'}
                  </Form.Field>
                  <Form.Field>
                    <label>Ambiente del usuario</label>
                    {this.state.userInfo.environment}
                  </Form.Field>
                  <Form.Field>
                    <label>Cuenta de operación</label>
                    {this.state.userInfo.operationAccount}
                  </Form.Field>
                  <Form.Field />
                  <Form.Field />
                </Form.Group>
                {this.state.userInfo &&
                  this.state.userInfo.other &&
                  this.state.userInfo.other.length > 0 && (
                    <Container>
                      <Divider horizontal>
                        <Header as='h4'>Datos adicionales</Header>
                      </Divider>
                      <Form.Group widths={5}>
                        {/* {this.state.userInfo.other.map((k) => {
													return (
														<Form.Field>
															<label>
																{k.dataName === "nickname"
																	? "Nombre de usuario"
																	: k.dataName}
															</label>
															<p className='infoUserParagraph'>{k.dataValue}</p>
														</Form.Field>
													);
												})} */}
                        {Object.entries(this.state.userInfo.other).map((k) => {
                          return (
                            <Form.Field key={k.dataName}>
                              <label>
                                {k.dataName === 'nickname'
                                  ? 'Nombre de usuario'
                                  : k.dataName}
                              </label>
                              <p className='infoUserParagraph'>{k.dataValue}</p>
                            </Form.Field>
                          );
                        })}
                      </Form.Group>
                    </Container>
                  )}
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        {!this.state.showSendingTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {messageSuccessSend}
        {messageSuccessMarkAsFail}
        {messageSuccessMarkAsOk}
        <ReactTable
          className='transactionTable'
          data={this.state.listSendingMovements}
          columns={sendingMovementsTableHeaders}
          defaultPageSize={5}
          previousText='Anterior'
          nextText='Siguiente'
          loadingText='Cargando...'
          noDataText='No existen envíos'
          pageText='Página'
          ofText='de'
          rowsText='filas'
          pageJumpText='ir a la página'
          rowsSelectorText='filas por página'
          minRow={5}
        />
      </div>
    );
  }
}
export default SendingBTCOutside;
