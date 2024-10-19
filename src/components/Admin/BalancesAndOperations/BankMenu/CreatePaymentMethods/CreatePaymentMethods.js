import React, { Component } from "react";
import ISOCURRENCIES from "../../../../../common/ISO4217";
import "../../../Admin.css";
import {
	Form,
	Button,
	Divider,
	Icon,
	Header,
	Modal,
	Select,
	Message,
	Label,
	Input,
	TextArea,
	Checkbox,
	Segment,
	Dropdown,
	Dimmer,
	Loader,
} from "semantic-ui-react";
import ReactTable from "react-table";
import userService from "../../../../../services/user";
import otcService from "../../../../../services/otc";
import otc from "../../../../../services/otc";
import _ from "underscore";
import NumberFormat from "react-number-format";
import theter from '../../../../../img/tether-seeklogo.svg';
import paymentInstructionsDefault from "../../../../../common/paymentInstructionsDefault";
class CreatePaymentMethods extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadCreate: false,
			allFormKey: Math.random(),
			currenciesToAddOptions: [],
			statusArray: [
				{ key: "active", text: "Activo", value: true },
				{ key: "inactive", text: "Inactivo", value: false },
			],
			currencyToAdd: "",
			statusAcceptInToAdd: "",
			statusAcceptOutToAdd: "",
			statusToAdd: "",
			toConfirmPaymentTypes: [],
			paymentTypeModalOpen: false,
			paymentTypeToAdd: "",
			paymentWindow: "",
			greenAlertOption: "",
			blueAlertOption: "",
			redAlertOption: "",
			greenBuyAlertOption: "",
			blueBuyAlertOption: "",
			redBuyAlertOption: "",
			allFieldsArray: [],
			fieldsToAdd: [],
			keyFieldsSelect: Math.random(),
			keyFieldsFormGroup: Math.random(),
			keyStatusFormGroup: Math.random(),
			paymentTypesOptions: [],
			listOperators: [],
			paymentTypesByCurrencyOptions: [],
			messagesAlertOptions: [
				{ value: "default", text: "Por defecto" },
				{ value: "other", text: "Otro" },
			],
			currencySelect: "",
			joinFieldValueBoolean: false,
			joinMyPaymentsBoolean: false,
			periodTimeToAdd: "minutes",
			showMessageSucessCreation: false,
			showMessageErrorCreation: false,
			BUY__ALERT_BLUE: "",
			BUY__ALERT_RED: "",
			BUY__ALERT_GREEN: "",
			SELL__ALERT_GREEN: "",
			SELL__ALERT_BLUE: "",
			SELL__ALERT_RED: "",
			defaultMessagesAlert: [],
			textGreenSell: true,
			textBlueSell: true,
			textRedSell: true,
			textGreenBuy: true,
			textBlueBuy: true,
			textRedBuy: true,
			optionMessage: true,
			messageError: false,
			nameText: "",
			rules: [],
			rulesBuy: [],
			minOperation: "",
			maxOperation: "",
			paymentTypeSelectSend: "",
			paymentTypesByCurrencyOptionsSend: [],
			oldPaymentTypesByCurrencyOptionsSend: [],
			minOperationBuy: "",
			maxOperationBuy: "",
			paymentTypeSelectBuy: "",
			paymentTypesByCurrencyOptionsBuy: [],
			oldPaymentTypesByCurrencyOptionsBuy: [],
			buy_instruction: "",
			buy_instruction_mc: "",
			sell_instruction: "",
			operationStatusMessageBuy: "",
			operationStatusMessage: "",
			statusOptionsBuy: [],
			statusOptionsSell: [],
			languageMessage: "",
			languageMessageBuy: "",
			allStatus: [],
			messageInstructionsSell: [],
			messageInstructionsBuy: [],
			optionsLenguageSell: [],
			optionsLenguageBuy: [],
			typeMessageSelectedSell: "",
			typeMessageSelectedBuy: "",
			optionsTypeMessagesBuy: [],
			optionsTypeMessagesSell: [],
			isAlertMessage: false,
			isInstructionsMessage: false,
			typeAlertSelected: "",
			useInstructionsDefaultBuy: false,
			useInstructionsDefaultMcBuy: false,
			useInstructionsDefaultSell: false,
			defaultInstructions: {
				buy: {},
				sell: {},
			},
			existsDefaultInstructionsBuy: "",
			existsDefaultInstructionsSell: "",
			typeMessageSelectedMcBuy: "",
			optionsLenguageMcBuy: [],
			languageMessageMcBuy: "",
			restrictedDeposits: false,
			financialTypesToShow: [],
			financialTypeSelected: null,
		};
		this.pickOTCOperationStatusToSearch = this.pickOTCOperationStatusToSearch.bind(
			this,
		);
		this.onChangeTypeMessageSell = this.onChangeTypeMessageSell.bind(this);
		this.onChangeTypeMessageBuy = this.onChangeTypeMessageBuy.bind(this);
		this.onChangeInstructionsDefaultBuy = this.onChangeInstructionsDefaultBuy.bind(
			this,
		);
		this.onChangeInstructionsDefaultSell = this.onChangeInstructionsDefaultSell.bind(
			this,
		);
	}
	componentWillMount() {

		this.setOperationsStatusSellAndBuy();
		this.loadCurrencies();
		this.initData();
	}
	handleBuyGreenAlert = (e) => {
		this.setState({ BUY__ALERT_GREEN: e.target.value }, () => {
			this.setState({ buy_instruction: this.state.BUY__ALERT_GREEN });
		});
	};
	handleBuyBlueAlert = (e) => {
		this.setState({ BUY__ALERT_BLUE: e.target.value }, () => {
			this.setState({ buy_instruction: this.state.BUY__ALERT_BLUE });
		});
	};
	handleBuyRedAlert = (e) => {
		this.setState({ BUY__ALERT_RED: e.target.value }, () => {
			this.setState({ buy_instruction: this.state.BUY__ALERT_RED });
		});
	};
	loadCurrencies = () => {
		this.setState({ loading: true });
		let currencyService = otc.getAdminCurrencies(userService.getUserName());
		currencyService
			.then((resp) => {
				let currencies = resp.data;
				let selectCurrencies = [];
				let fieldsByCurrencies = [];
				let paymentTypesArray = [];
				let currencyCurrent = {};
				for (let i = 0; i < currencies.length; i++) {
					let currencyToAddSelect = {};
					let countryCoin = currencies[i].shortName.split("_");
					currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
						if (countryCoin.length > 1)
							return c.flag === countryCoin[0].toLowerCase();
						else return c.key === countryCoin[0];
					})[0];
				 	if (currencyCurrent !== undefined  && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
						currencyToAddSelect.flag = currencyCurrent.flag;
					} else if(currencies[i].shortName === "ETH") {
					  currencyToAddSelect.icon = "ethereum";
          			} else if(currencies[i].shortName === "USDT") {
           				currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          			};
						
					currencyToAddSelect.key = currencies[i].shortName;
					currencyToAddSelect.value = currencies[i].shortName;
					currencyToAddSelect.text = currencies[i].fullName;
					selectCurrencies.push(currencyToAddSelect);
					var objectFieldsByCurrenciesToPush = {};
					var clientPaymentTypesArray = [];
					objectFieldsByCurrenciesToPush.currency = currencies[i].shortName;
					for (var j = 0; j < currencies[i].clientPaymentTypes.length; j++) {
						var objectPaymentTypeToPush = {};
						objectPaymentTypeToPush.messages =
							currencies[i].clientPaymentTypes[j].messages;
						objectPaymentTypeToPush.key =
							currencies[i].shortName +
							"/" +
							currencies[i].clientPaymentTypes[j].name;
						objectPaymentTypeToPush.value =
							currencies[i].shortName +
							"/" +
							currencies[i].clientPaymentTypes[j].name;
						objectPaymentTypeToPush.text =
							currencies[i].clientPaymentTypes[j].name;
						if (
							currencies[i].clientPaymentTypes[j].name ===
							"TRANSFER_INTERNATIONAL_BANK"
						) {
							objectPaymentTypeToPush.text =
								"Transferencia internacional (Swift o Aba)";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "CASH_DEPOSIT"
						) {
							objectPaymentTypeToPush.text = "Depósito en efectivo";
						} else if (
							currencies[i].clientPaymentTypes[j].name ===
							"TRANSFER_WITH_SPECIFIC_BANK"
						) {
							objectPaymentTypeToPush.text =
								"Transferencia desde un banco específico";
						} else if (
							currencies[i].clientPaymentTypes[j].name ===
							"TRANSFER_NATIONAL_BANK"
						) {
							objectPaymentTypeToPush.text =
								"Transferencia desde un tercer banco";
						} else if (
							currencies[i].clientPaymentTypes[j].name ===
							"TRANSFER_TO_CRYPTO_WALLET"
						) {
							objectPaymentTypeToPush.text =
								"Transferencia desde una crypto wallet";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "WIRE_TRANSFER"
						) {
							objectPaymentTypeToPush.text =
								"Wire (Transferencia cablegráfica)";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "CHECK_DEPOSIT"
						) {
							objectPaymentTypeToPush.text = "Depósito en cheque";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "CREDIT_CARD"
						) {
							objectPaymentTypeToPush.text = "Tarjeta de Crédito";
						} else if (
							currencies[i].clientPaymentTypes[j].name ===
							"PERSONAL_CHECK_DEPOSIT"
						) {
							objectPaymentTypeToPush.text = "Cheque personal";
						} else if (
							currencies[i].clientPaymentTypes[j].name ===
							"CASHIER_CHECK_DEPOSIT"
						) {
							objectPaymentTypeToPush.text = "Cheque de gerencia";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "MONEY_ORDER"
						) {
							objectPaymentTypeToPush.text = "Orden de dinero";
						} else if (
							currencies[i].clientPaymentTypes[j].name === "MOBILE_PAYMENT"
						) {
							objectPaymentTypeToPush.text = "Pago Móvil";
						} else {
							objectPaymentTypeToPush.text =
								currencies[i].clientPaymentTypes[j].name;
						}
						paymentTypesArray.push(objectPaymentTypeToPush);
						for (
							var k = 0;
							k < currencies[i].clientPaymentTypes[j].fields.length;
							k++
						) {
							if (
								!JSON.stringify(clientPaymentTypesArray).includes(
									currencies[i].clientPaymentTypes[j].fields[k].name,
								)
							) {
								clientPaymentTypesArray.push(
									currencies[i].clientPaymentTypes[j].fields[k],
								);
							} else {
								if (
									currencies[i].clientPaymentTypes[j].fields[k].values !==
									undefined
								) {
									for (var y = 0; y < clientPaymentTypesArray.length; y++) {
										if (
											clientPaymentTypesArray[y].name ===
											currencies[i].clientPaymentTypes[j].fields[k].name
										) {
											clientPaymentTypesArray[y].values = _.union(
												clientPaymentTypesArray[y].values,
												currencies[i].clientPaymentTypes[j].fields[k].values,
											);
										}
									}
								}
							}
						}
					}
					var fieldsArrayUniq = _.uniq(clientPaymentTypesArray, "name");
					objectFieldsByCurrenciesToPush.clientPaymentTypes = fieldsArrayUniq;
					fieldsByCurrencies.push(objectFieldsByCurrenciesToPush);
				}

				this.setState(
					{
						currenciesToAddOptions: selectCurrencies,
						allFieldsArray: fieldsByCurrencies,
						paymentTypesOptions: paymentTypesArray,
					},
					() => this.setState({ loading: false }),
				);
			})
			.catch((error) => {
				this.setState({ loading: false });
				//console.log(error);
			});
	};

	pickProfile = (e, data) => {
		this.setState({ profileToSearch: data.value });
	};

	pickCurrency = (e, data) => {
		let financialTypesAux = [];
		otcService.getFinancialTypes(data.value).then(resp =>{
			console.log('getFinancialTypes ', resp.data);
			resp.data.forEach(financialType =>{
				if(financialType.active){
					financialTypesAux.push({text : this.getTextSpanish(financialType.name), value: financialType});
				}
			})
			return financialTypesAux;
		}).then(financialTypes =>{
			this.setState({
				financialTypesToShow: financialTypes
			})
		});
		this.setState({ currencySelect: data.value });
		var paymentTypesArray = [];
	
		for (var c = 0; c < this.state.paymentTypesOptions.length; c++) {
			if (this.state.paymentTypesOptions[c].key.split("/")[0] === data.value) {
				paymentTypesArray.push(this.state.paymentTypesOptions[c]);
			}
		}
		this.setState({
			currencyToAdd: data.value,
			paymentTypesByCurrencyOptions: paymentTypesArray,
			paymentTypesByCurrencyOptionsSend: paymentTypesArray,
			oldPaymentTypesByCurrencyOptionsSend: paymentTypesArray,
			paymentTypesByCurrencyOptionsBuy: paymentTypesArray,
			oldPaymentTypesByCurrencyOptionsBuy: paymentTypesArray,
			keyFieldsSelect: Math.random(),
			keyFieldsFormGroup: Math.random(),
			keyStatusFormGroup: Math.random(),
			fieldsToAdd: [],
			statusToAdd: "",
			statusAcceptInToAdd: "",
			statusAcceptOutToAdd: ""
		});
		Object.entries(this.state).forEach(([key]) => {
			if (key.endsWith("Dynamic")) {
				this.setState({ [key]: undefined });
			}
		});
	};

	getPlaceHolder(value){
		if (value === "accountNumber") {
			return 'xxxxx-xxxxxx-xxxxxx-xxxxx'
		}else{
			return '';		}
	}
	getTextSpanish(value){
		if (value === "bank") {
				return "Banco";
			} else if (value === "accountNumber") {
				return "Número de cuenta";
			} else if (
				value === "accountHolderName"
			) {
				return "Titular de la cuenta";
			} else if (
				value === "accountInterbankCode"
			) {
				return "Código interbancario";
			} else if (
				value === "accountHolderPhone"
			) {
				return "Teléfono del titular";
			} else if (
				value === "accountHolderId"
			) {
				return "Id del titular";
			} else if (value === "accountType") {
				return "Tipo de cuenta";
			}
			else if (value === "officesInfoId") {
				return "ID de Oficina";
			} else if (value === "address") {
				return "Address";
			} else if (
				value === "accountWireNumber"
			) {
				return "Número de cuenta wire";
			} else if (value === "cardType") {
				return "Tipo de Tarjeta de Crédito";
			} else if (value === "cardNumber") {
				return "Número de Tarjeta de Crédito";
			} else if (value === "cardHolderName") {
				return "Nombre del titular de la tarjeta";
			} else if (value === "expDate") {
				return "Fecha de expiración";
			} else if (value === "csc") {
				return "Código de Seguridad (CSC)";
			} else if (value === "zipCode") {
				return "Código Postal";
			} else if (value === "accountAddress") {
				return "Dirección de la cuenta";
			} else if (value === "accountZip") {
				return "Código postal";
			} else if (
				value === "bankRoutingNumber"
			) {
				return "N° routing bancario";
			} else if (value === "bankSwiftCode") {
				return "Código de swift bancario";
			} else if (value === "bankAccount") {
				return "Cuenta bancaria";
			} else if (
				value === "accountWireRoutingNumber"
			) {
				return "Número de ruta wire";
			} else if (
				value === "userName"
			) {
				return "Usuario";
			} else if (
				value === "userHolderName"
			) {
				return "Nombre del titular";
			} else if (
				value === "BANK_ACCOUNT"
			) {
				return "Cuenta Bancaria";
			} else if (
				value === "ZELLE"
			) {
				return "Zelle";
			} else if (
				value === "OFFICE"
			) {
				return "Oficina";
			} else if (
				value === "CREDIT_CARD"
			) {
				return "Tarjeta de Crédito";
			} else if (
				value === "PAYPAL"
			) {
				return "Paypal";
			} else if (
				value === "MOBILE_PAYMENT"
			) {
				return "Pago Móvil";
			} else {
				return value;
			}
	}

	onChangeFinancialType(e, data){
		console.log('onChangeFinancialType ', data.value);
		let fields = [], optionsArray, joinFieldsArray = [];
		this.setState({
			financialTypeSelected: data.value
		}, ()=>{
			let arrayFieldsAux = [], textSpanish;
			data.value.fields.forEach(field =>{
				optionsArray = []
			textSpanish = this.getTextSpanish(field.name);
				arrayFieldsAux.push({key: field.name, text: textSpanish, value: field});
				joinFieldsArray.push({key: field.name, text: textSpanish, value: field.name});
				fields.push(field);
					if (field.values !== undefined) {
						field.values.forEach(value =>{
							optionsArray.push({key : value, text: value, value: value});
						})
						this.setState({
							[field.name+ "OptionsDynamic"]: optionsArray,
						})
					}
			});
			this.setState({
				fieldsToAdd: fields,
				joinFieldsArray
			})
		})
	}

	pickStatus = (e, data) => {
		this.setState({ statusToAdd: data.value });
	};

	pickStatusAcceptIn = (e, data) => {
		this.setState({ statusAcceptInToAdd: data.value });
	};
	pickStatusAcceptOut = (e, data) => {
		this.setState({ statusAcceptOutToAdd: data.value });
	};
	pickBank = (e, data) => {
		this.setState({ bankToAdd: data.value });
	};
	pickMessagesAlert = (e, data) => {
		if (data.name === "alert_sell_green") {
			this.setState({ greenAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textGreenSell: true });
				let messageGreen = this.state.defaultMessagesAlert.find(function (
					element,
				) {
					return element.name === "SELL__ALERT_GREEN";
				});
				//console.log(messageGreen);
				if (messageGreen !== undefined) {
					this.setState(
						{
							SELL__ALERT_GREEN: messageGreen.val,
						},
						() => {
							this.setState({ sell_instruction: this.state.SELL__ALERT_GREEN });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_sell_green",
						SELL__ALERT_GREEN: "",
					});
				}
			} else {
				this.setState({
					textGreenSell: false,
					SELL__ALERT_GREEN: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_sell_blue") {
			this.setState({ blueAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textBlueSell: true });
				let messageBlue = this.state.defaultMessagesAlert.find(function (
					element,
				) {
					return element.name === "SELL__ALERT_BLUE";
				});
				if (messageBlue !== undefined) {
					this.setState(
						{
							SELL__ALERT_BLUE: messageBlue.val,
						},
						() => {
							this.setState({ sell_instruction: this.state.SELL__ALERT_BLUE });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_sell_blue",
						SELL__ALERT_BLUE: "",
					});
				}
			} else {
				this.setState({
					textBlueSell: false,
					SELL__ALERT_BLUE: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_sell_red") {
			this.setState({ redAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textRedSell: true });
				let messageRed = this.state.defaultMessagesAlert.find(function (
					element,
				) {
					return element.name === "SELL__ALERT_RED";
				});
				//console.log(messageRed);
				if (messageRed !== undefined) {
					this.setState(
						{
							SELL__ALERT_RED: messageRed.val,
						},
						() => {
							this.setState({ sell_instruction: this.state.SELL__ALERT_RED });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_sell_red",
						SELL__ALERT_RED: "",
					});
				}
			} else {
				this.setState({
					textRedSell: false,
					SELL__ALERT_RED: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_buy_green") {
			this.setState({ greenBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textGreenBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_GREEN";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_GREEN: message.val,
						},
						() => {
							this.setState({ buy_instruction: this.state.BUY__ALERT_GREEN });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_green",
						BUY__ALERT_GREEN: "",
					});
				}
			} else {
				this.setState({
					textGreenBuy: false,
					BUY__ALERT_GREEN: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_buy_blue") {
			this.setState({ blueBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textBlueBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_BLUE";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_BLUE: message.val,
						},
						() => {
							this.setState({ buy_instruction: this.state.BUY__ALERT_BLUE });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_blue",
						BUY__ALERT_BLUE: "",
					});
				}
			} else {
				this.setState({
					textBlueBuy: false,
					BUY__ALERT_BLUE: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_buy_red") {
			this.setState({ redBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textRedBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_RED";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_RED: message.val,
						},
						() => {
							this.setState({ buy_instruction: this.state.BUY__ALERT_RED });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_red",
						BUY__ALERT_RED: "",
					});
				}
			} else {
				this.setState({ textRedBuy: false, BUY__ALERT_RED: "", nameText: "" });
			}
		}
	};
	pickMessagesAlertMc = (e, data) => {
		if (data.name === "alert_buy_green_mc") {
			this.setState({ greenBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textGreenBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_GREEN";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_GREEN: message.val,
						},
						() => {
							this.setState({
								buy_instruction_mc: this.state.BUY__ALERT_GREEN,
							});
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_green_mc",
						BUY__ALERT_GREEN: "",
					});
				}
			} else {
				this.setState({
					textGreenBuy: false,
					BUY__ALERT_GREEN: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_buy_blue_mc") {
			this.setState({ blueBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textBlueBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_BLUE";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_BLUE: message.val,
						},
						() => {
							this.setState({ buy_instruction_mc: this.state.BUY__ALERT_BLUE });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_blue_mc",
						BUY__ALERT_BLUE: "",
					});
				}
			} else {
				this.setState({
					textBlueBuy: false,
					BUY__ALERT_BLUE: "",
					nameText: "",
				});
			}
		} else if (data.name === "alert_buy_red_mc") {
			this.setState({ redBuyAlertOption: data.value });
			if (data.value === "default") {
				this.setState({ textRedBuy: true });
				let message = this.state.defaultMessagesAlert.find(function (element) {
					return element.name === "BUY__ALERT_RED";
				});
				if (message !== undefined) {
					this.setState(
						{
							BUY__ALERT_RED: message.val,
						},
						() => {
							this.setState({ buy_instruction_mc: this.state.BUY__ALERT_RED });
						},
					);
				} else {
					this.setState({
						messageError: true,
						nameText: "alert_buy_red_mc",
						BUY__ALERT_RED: "",
					});
				}
			} else {
				this.setState({ textRedBuy: false, BUY__ALERT_RED: "", nameText: "" });
			}
		}
	};
	pickpaymentTypeToAdd = (e, data) => {
		let array = [];
		this.setState({
			paymentTypeToAdd: data.value,
			defaultMessagesAlert: [],
			optionMessage: false,
			messageError: false,
			nameText: "",
		});
		let paymentType = this.state.paymentTypesByCurrencyOptions.find(function (
			element,
		) {
			return element.key === data.value;
		});
		//console.log(paymentType);
		Object.entries(paymentType.messages).forEach(([key, value]) => {
			let objMessage = {
				name: key,
				val: value,
			};

			array.push(objMessage);
		});
		//console.log(array);
		this.setState({ defaultMessagesAlert: array });
	};

	handleAccountNumber = (e) => {
		this.setState({ accountNumberToAdd: e.target.value });
	};
	handlePaymentWindow = (e) => {
		this.setState({
			paymentWindow: e.target.value,
		});
	};
	handleAccountHolder = (e) => {
		this.setState({ accountHolderToAdd: e.target.value });
	};
	handleAccountHolderId = (e) => {
		this.setState({ accountHolderIdToAdd: e.target.value });
	};

	handleGreenAlert = (e) => {
		let addAlert = e.target.value !== "";
		this.setState({ SELL__ALERT_GREEN: e.target.value }, () => {
			this.setState({ sell_instruction: this.state.SELL__ALERT_GREEN });
		});
	};
	handleBlueAlert = (e) => {
		this.setState({ SELL__ALERT_BLUE: e.target.value }, () => {
			this.setState({ sell_instruction: this.state.SELL__ALERT_BLUE });
		});
	};
	handleRedAlert = (e) => {
		this.setState({ SELL__ALERT_RED: e.target.value }, () => {
			this.setState({ sell_instruction: this.state.SELL__ALERT_RED });
		});
	};
	openAddPaymentTypeModal = () => this.setState({ paymentTypeModalOpen: true });

	closeAddPaymentTypeModal = () => {
		this.setState({
			paymentTypeModalOpen: false,
			paymentTypeToAdd: "",
			paymentWindow: "",
			joinMyPaymentsBoolean: false,
			joinFieldValueBoolean: false,
			periodTimeToAdd: "minutes",
			textGreenSell: true,
			textBlueSell: true,
			textRedSell: true,
			textGreenBuy: true,
			textBlueBuy: true,
			textRedBuy: true,
			optionMessage: true,
			messageError: false,
			nameText: "",
			greenAlertOption: "",
			blueAlertOption: "",
			redAlertOption: "",
			greenBuyAlertOption: "",
			blueBuyAlertOption: "",
			redBuyAlertOption: "",
			BUY__ALERT_BLUE: "",
			BUY__ALERT_RED: "",
			BUY__ALERT_GREEN: "",
			SELL__ALERT_GREEN: "",
			SELL__ALERT_BLUE: "",
			SELL__ALERT_RED: "",
			buy_instruction: "",
			buy_instruction_mc: "",
			sell_instruction: "",
			operationStatusMessage: "",
			operationStatusMessageBuy: "",
			languageMessage: "",
			languageMessageBuy: "",
			statusOptionsBuy: this.state.allStatus,
			statusOptionsSell: this.state.allStatus,
			messageInstructionsBuy: [],
			messageInstructionsSell: [],
			typeMessageSelectedSell: "",
			typeMessageSelectedBuy: "",
			useInstructionsDefaultBuy: false,
			useInstructionsDefaultMcBuy: false,
			useInstructionsDefaultSell: false,
			typeMessageSelectedMcBuy: "",
			operationStatusMessageMcBuy: "",
			languageMessageMcBuy: "",
			optionsLenguageMcBuy: [],
		});
	};
	addPaymentType = () => {
		var paymentTypes = this.state.toConfirmPaymentTypes;
		var paymentTypeObjectToAdd = {};
		var paymentToRemove = this.state.paymentTypeToAdd;
		paymentTypeObjectToAdd.name = this.state.paymentTypeToAdd.split("/")[1];
		paymentTypeObjectToAdd.payWindow =
			this.state.paymentWindow + " " + this.state.periodTimeToAdd;
		paymentTypeObjectToAdd.joinMyPayments = this.state.joinMyPaymentsBoolean;
		paymentTypeObjectToAdd.joinFieldValue = this.state.joinFieldValueBoolean;
		paymentTypeObjectToAdd.messages = {};
		if (this.state.messageInstructionsBuy.length > 0) {
			for (let message of this.state.messageInstructionsBuy) {
				Object.defineProperty(paymentTypeObjectToAdd.messages, message.key, {
					value: message.value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			}
		}
		if (this.state.messageInstructionsSell.length > 0) {
			for (let message of this.state.messageInstructionsSell) {
				Object.defineProperty(paymentTypeObjectToAdd.messages, message.key, {
					value: message.value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			}
		}
		paymentTypes.push(paymentTypeObjectToAdd);
		var removedPaymentTypeArray = _.reject(
			this.state.paymentTypesByCurrencyOptions,
			function (el) {
				return el.key === paymentToRemove;
			},
		);
		this.setState({
			toConfirmPaymentTypes: paymentTypes,
			paymentTypesByCurrencyOptions: removedPaymentTypeArray,
		});
		this.closeAddPaymentTypeModal();
	};

	removePaymentType = (paymentTypeName) => {
		var optionsToAddArray = this.state.paymentTypesByCurrencyOptions;
		var objectToPush = {};
		objectToPush.key = this.state.currencyToAdd + "/" + paymentTypeName;
		objectToPush.value = this.state.currencyToAdd + "/" + paymentTypeName;
		if (paymentTypeName === "TRANSFER_INTERNATIONAL_BANK") {
			objectToPush.text = "Transferencia internacional (Swift o Aba)";
		} else if (paymentTypeName === "CASH_DEPOSIT") {
			objectToPush.text = "Depósito en efectivo";
		} else if (paymentTypeName === "TRANSFER_WITH_SPECIFIC_BANK") {
			objectToPush.text = "Transferencia desde un banco específico";
		} else if (paymentTypeName === "TRANSFER_NATIONAL_BANK") {
			objectToPush.text = "Transferencia desde un tercer banco";
		} else if (paymentTypeName === "TRANSFER_TO_CRYPTO_WALLET") {
			objectToPush.text = "Transferencia desde una crypto wallet";
		} else if (paymentTypeName === "WIRE_TRANSFER") {
			objectToPush.text = "Wire (Transferencia cablegráfica)";
		} else if (paymentTypeName === "CHECK_DEPOSIT") {
			objectToPush.text = "Depósito en cheque";
		} else if (paymentTypeName === "CREDIT_CARD") {
			objectToPush.text = "Tarjeta de crédito";
		} else if (paymentTypeName === "PERSONAL_CHECK_DEPOSIT") {
			objectToPush.text = "Cheque personal";
		} else if (paymentTypeName === "CASHIER_CHECK_DEPOSIT") {
			objectToPush.text = "Cheque de gerencia";
		} else if (paymentTypeName === "MONEY_ORDER") {
			objectToPush.text = "Orden de dinero";
		}else if (paymentTypeName === "MOBILE_PAYMENT") {
			objectToPush.text = "Pago Móvil";
		} else {
			objectToPush.text = paymentTypeName;
		}
		optionsToAddArray.push(objectToPush);
		var removedPaymentTypeArray = _.reject(
			this.state.toConfirmPaymentTypes,
			function (el) {
				return el.name === paymentTypeName;
			},
		);
		this.setState({
			toConfirmPaymentTypes: removedPaymentTypeArray,
			paymentTypesByCurrencyOptions: optionsToAddArray,
		});
	};
	createDollarBTCPayment = () => {
		this.setState({ loadCreate: true });
		var paymentObject = {};
		paymentObject.active = this.state.statusToAdd;
		paymentObject.acceptIn = this.state.statusAcceptInToAdd;
		paymentObject.acceptOut = this.state.statusAcceptOutToAdd;
		paymentObject.financialType = this.state.financialTypeSelected.name;
		paymentObject.restrictedDeposits = this.state.restrictedDeposits;
		Object.entries(this.state).forEach(([key, value]) => {
			if (key.endsWith("ToAddDynamic")) {
				if (value !== "" && value !== undefined) {
					paymentObject[key.replace("ToAddDynamic", "")] = value;
				}
			}
		});
		if (this.state.rules.length > 0) {
			let rulesToset = [];
			for (let rule of this.state.rules) {
				let rul = {
					type: rule.type,
					minPerOperationAmount: rule.minPerOperationAmount,
					maxPerOperationAmount: rule.maxPerOperationAmount,
				};
				rulesToset.push(rul);
			}
			paymentObject.sendToPayments = rulesToset;
		}
		if (this.state.rulesBuy.length > 0) {
			let rulesToset = [];
			for (let rule of this.state.rulesBuy) {
				let rul = {
					type: rule.type,
					minPerOperationAmount: rule.minPerOperationAmount,
					maxPerOperationAmount: rule.maxPerOperationAmount,
				};
				rulesToset.push(rul);
			}
			paymentObject.buyBalance = rulesToset;
		}
		paymentObject.types = this.state.toConfirmPaymentTypes;
		paymentObject.asociatedEmails = this.state.emailsToSave;
		var body = {
			currency: this.state.currencyToAdd,
			payment: paymentObject,
		};
		console.log(body);
		let createPayment = otc.addDollarBTCPayment(body);
		createPayment
			.then((resp) => {
				console.log(resp);
				if (resp.status === 200) {
					this.sucessCreation();
				}
			})
			.catch((error) => {
				console.log(error);
				this.setState({ showMessageErrorCreation: true }, () => {
					setTimeout(() => {
						this.setState({
							showMessageErrorCreation: false,
							loadCreate: false,
						});
					}, 5000);
				});
			});
	};
	sucessCreation = () => {
		this.setState(
			{
				loadCreate: false,
				allFormKey: Math.random(),
				currencyToAdd: "",
				statusAcceptInToAdd: "",
				statusAcceptOutToAdd: "",
				statusToAdd: "",
				toConfirmPaymentTypes: [],
				paymentTypeModalOpen: false,
				paymentTypeToAdd: "",
				paymentWindow: "",
				BUY__ALERT_BLUE: "",
				BUY__ALERT_RED: "",
				BUY__ALERT_GREEN: "",
				SELL__ALERT_GREEN: "",
				SELL__ALERT_BLUE: "",
				SELL__ALERT_RED: "",
				messageError: false,
				nameText: "",
				allFieldsArray: [],
				fieldsToAdd: [],
				keyFieldsSelect: Math.random(),
				keyFieldsFormGroup: Math.random(),
				keyStatusFormGroup: Math.random(),
				paymentTypesOptions: [],
				paymentTypesByCurrencyOptions: [],
				joinFieldValueBoolean: false,
				joinMyPaymentsBoolean: false,
				periodTimeToAdd: "minutes",
				showMessageSucessCreation: true,
				useInstructionsDefaultBuy: false,
				useInstructionsDefaultMcBuy: false,
				useInstructionsDefaultSell: false,
			},
			() => {
				this.setOperationsStatusSellAndBuy();
				this.loadCurrencies();
			},
		);
		setTimeout(() => {
			this.setState({
				showMessageSucessCreation: false,
			});
		}, 5000);
	};
	toggleJoinMyPayments = (e, data) => {
		this.setState({ joinMyPaymentsBoolean: data.checked });
	};

	toggleIsRestrictedDeposits = (e, data) => {
		this.setState({ restrictedDeposits: data.checked });
	};
	

	toggleJoinFieldValue = (e, data) => {
		this.setState({ joinFieldValueBoolean: data.checked });
	};
	setPicketPaymentTypeSelectSend(e, data) {
		this.setState({ paymentTypeSelectSend: data.value });
	}
	setMinAmountOperationSend(value) {
		this.setState({ minOperation: value });
	}
	setMaxAmountOperationSend(value) {
		this.setState({ maxOperation: value });
	}
	addRulesToSendPayments() {
		let min = Number(this.state.minOperation);
		let max = Number(this.state.maxOperation);
		if (min < max) {
			let value = this.state.paymentTypeSelectSend.split("/")[1];
			let originalValue = this.state.paymentTypeSelectSend;
			let text = this.state.oldPaymentTypesByCurrencyOptionsSend.find(function (
				element,
			) {
				return element.value === originalValue;
			});
			let rule = {
				type: value,
				minPerOperationAmount: Number(this.state.minOperation),
				maxPerOperationAmount: Number(this.state.maxOperation),
				text:
					text.text +
					" - " +
					"Min. " +
					this.state.minOperation +
					" - " +
					"Max. " +
					this.state.maxOperation,
				key: this.state.paymentTypeSelectSend,
			};
			this.setState({ rules: [...this.state.rules, rule] }, () => {
				let newOptions = this.state.paymentTypesByCurrencyOptionsSend.filter(
					function (element) {
						return element.value !== originalValue;
					},
				);
				//console.log(newOptions);
				this.setState({
					paymentTypesByCurrencyOptionsSend: newOptions,
					paymentTypeSelectSend: "",
					minOperation: "",
					maxOperation: "",
				});
			});
		} else {
			this.setState({ errorAmount: true });
			setTimeout(() => {
				this.setState({ errorAmount: false });
			}, 6000);
		}
	}
	removeRulesToSendPayments(key) {
		let newRules = this.state.rules.filter(function (element) {
			return element.key !== key;
		});
		this.setState({ rules: newRules });
		let findOption = this.state.oldPaymentTypesByCurrencyOptionsSend.find(
			function (element) {
				return element.value === key;
			},
		);
		this.setState({
			paymentTypesByCurrencyOptionsSend: [
				...this.state.paymentTypesByCurrencyOptionsSend,
				findOption,
			],
		});
	}
	setPicketPaymentTypeSelectBuy(e, data) {
		this.setState({ paymentTypeSelectBuy: data.value });
	}
	setMinAmountOperationBuy(value) {
		this.setState({ minOperationBuy: value });
	}
	setMaxAmountOperationBuy(value) {
		this.setState({ maxOperationBuy: value });
	}
	addRulesToBuyBalancePayments() {
		let min = Number(this.state.minOperationBuy);
		let max = Number(this.state.maxOperationBuy);
		if (min < max) {
			let value = this.state.paymentTypeSelectBuy.split("/")[1];
			let originalValue = this.state.paymentTypeSelectBuy;
			let text = this.state.oldPaymentTypesByCurrencyOptionsBuy.find(function (
				element,
			) {
				return element.value === originalValue;
			});
			let rule = {
				type: value,
				minPerOperationAmount: Number(this.state.minOperationBuy),
				maxPerOperationAmount: Number(this.state.maxOperationBuy),
				text:
					text.text +
					" - " +
					"Min. " +
					this.state.minOperationBuy +
					" - " +
					"Max. " +
					this.state.maxOperationBuy,
				key: this.state.paymentTypeSelectBuy,
			};
			this.setState({ rulesBuy: [...this.state.rulesBuy, rule] }, () => {
				let newOptions = this.state.paymentTypesByCurrencyOptionsBuy.filter(
					function (element) {
						return element.value !== originalValue;
					},
				);
				//console.log(newOptions);
				this.setState({
					paymentTypesByCurrencyOptionsBuy: newOptions,
					paymentTypeSelectBuy: "",
					minOperationBuy: "",
					maxOperationBuy: "",
				});
			});
		} else {
			this.setState({ errorAmountBuy: true });
			setTimeout(() => {
				this.setState({ errorAmountBuy: false });
			}, 6000);
		}
	}
	removeRulesToBuyBalancePayments(key) {
		let newRules = this.state.rulesBuy.filter(function (element) {
			return element.key !== key;
		});
		this.setState({ rulesBuy: newRules });
		let findOption = this.state.oldPaymentTypesByCurrencyOptionsBuy.find(
			function (element) {
				return element.value === key;
			},
		);
		this.setState({
			paymentTypesByCurrencyOptionsBuy: [
				...this.state.paymentTypesByCurrencyOptionsBuy,
				findOption,
			],
		});
	}
	pickOTCOperationStatusToSearch(e, data) {
		//console.log(data.value);
		let existsDefaultInstructionsSell = this.state.defaultInstructions.sell[
			data.value
		][this.state.languageMessage];
		this.setState({
			operationStatusMessage: data.value,
			existsDefaultInstructionsSell: existsDefaultInstructionsSell,
		});
	}
	pickOTCOperationStatusBuy = (e, data) => {
		let existsDefaultInstructionsBuy = this.state.defaultInstructions.buy[
			data.value
		][this.state.languageMessageBuy];
		this.setState({
			operationStatusMessageBuy: data.value,
			existsDefaultInstructionsBuy: existsDefaultInstructionsBuy,
		});
	};
	pickOTCOperationStatusMcBuy = (e, data) => {
		this.setState(
			{
				operationStatusMessageMcBuy: data.value,
				existsDefaultInstructionsBuy: this.state.defaultInstructions.buy[
					data.value
				][this.state.languageMessageMcBuy],
			},
			() => console.log(this.state.existsDefaultInstructionsBuy),
		);
	};
	pickLanguageMessage(e, data) {
		this.setState(
			{
				languageMessage: data.value,
				operationStatusMessage: "",
				existsDefaultInstructionsSell: "",
			},
			() => {
				let existingStatusByLang = this.state.messageInstructionsSell
					.filter((msg) => {
						return msg.key.includes(this.state.languageMessage);
					})
					.map((m) => {
						return m.key.split("__")[1];
					});
				//console.log(existingStatusByLang);
			},
		);
	}
	pickLanguageMessageBuy(e, data) {
		this.setState(
			{
				languageMessageBuy: data.value,
				operationStatusMessageBuy: "",
				existsDefaultInstructionsBuy: "",
			},
			() => {
				let existingStatusByLang = this.state.messageInstructionsBuy
					.filter((msg) => {
						return msg.key.includes(this.state.languageMessageBuy);
					})
					.map((m) => {
						return m.key.split("__")[1];
					});
				//console.log(existingStatusByLang);
			},
		);
	}
	pickLanguageMessageMcBuy(e, data) {
		this.setState(
			{
				languageMessageMcBuy: data.value,
				operationStatusMessageMcBuy: "",
				existsDefaultInstructionsBuy: "",
			},
			() => {
				let existingStatusByLang = this.state.messageInstructionsBuy
					.filter((msg) => {
						return msg.key.includes(this.state.languageMessageBuy);
					})
					.map((m) => {
						return m.key.split("__")[1];
					});
				//console.log(existingStatusByLang);
			},
		);
	}
	addMessageInstructionsBuy() {
		let status = this.state.operationStatusMessageBuy;
		let statusFind = this.state.allStatus.find(function (element) {
			return element.value === status;
		});
		let message,
			auxMessages = [];
		if (this.state.typeMessageSelectedBuy === "ALERT") {
			let typeAlert;
			if (this.state.BUY__ALERT_GREEN !== "") {
				typeAlert = "ALERT_GREEN";
				message = {
					key: "BUY__" + typeAlert + "__" + this.state.languageMessageBuy,
					value: this.state.BUY__ALERT_GREEN,
					text: this.state.languageMessageBuy + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.BUY__ALERT_BLUE !== "") {
				typeAlert = "ALERT_BLUE";
				message = {
					key: "BUY__" + typeAlert + "__" + this.state.languageMessageBuy,
					value: this.state.BUY__ALERT_BLUE,
					text: this.state.languageMessageBuy + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.BUY__ALERT_RED !== "") {
				typeAlert = "ALERT_RED";
				message = {
					key: "BUY__" + typeAlert + "__" + this.state.languageMessageBuy,
					value: this.state.BUY__ALERT_RED,
					text: this.state.languageMessageBuy + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
		} else if (this.state.typeMessageSelectedMcBuy === "ALERT_MC") {
			let typeAlert;
			if (this.state.BUY__ALERT_GREEN !== "") {
				typeAlert = "ALERT_GREEN";
				message = {
					key:
						"MC_BUY_BALANCE__" +
						typeAlert +
						"__" +
						this.state.languageMessageMcBuy,
					value: this.state.BUY__ALERT_GREEN,
					text: this.state.languageMessageMcBuy + " MC" + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.BUY__ALERT_BLUE !== "") {
				typeAlert = "ALERT_BLUE";
				message = {
					key:
						"MC_BUY_BALANCE__" +
						typeAlert +
						"__" +
						this.state.languageMessageMcBuy,
					value: this.state.BUY__ALERT_BLUE,
					text: this.state.languageMessageMcBuy + " MC" + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.BUY__ALERT_RED !== "") {
				typeAlert = "ALERT_RED";
				message = {
					key:
						"MC_BUY_BALANCE__" +
						typeAlert +
						"__" +
						this.state.languageMessageMcBuy,
					value: this.state.BUY__ALERT_RED,
					text: this.state.languageMessageMcBuy + " MC" + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
		} else if (this.state.typeMessageSelectedMcBuy === "INSTRUCTIONS_MC") {
			let statusSelected = this.state.operationStatusMessageMcBuy;
			let statusFindMC = this.state.allStatus.find(function (element) {
				return element.value === statusSelected;
			});
			message = {
				key:
					"MC_BUY_BALANCE__" +
					this.state.operationStatusMessageMcBuy +
					"__INSTRUCTIONS__" +
					this.state.languageMessageMcBuy,
				value: this.state.buy_instruction_mc,
				text: this.state.languageMessageMcBuy + " - " + statusFindMC.text,
			};
			auxMessages.push(message);
		} else {
			message = {
				key:
					"BUY__" +
					this.state.operationStatusMessageBuy +
					"__INSTRUCTIONS__" +
					this.state.languageMessageBuy,
				value: this.state.buy_instruction,
				text: this.state.languageMessageBuy + " - " + statusFind.text,
			};
			auxMessages.push(message);
		}
		console.log(auxMessages);
		let auxNewKeys = auxMessages.map((item) => item.key);
		let auxMessageInstructionBuy = this.state.messageInstructionsBuy.filter(
			(msg) => auxNewKeys.indexOf(msg.key) < 0,
		);
		this.setState(
			{
				messageInstructionsBuy: [...auxMessageInstructionBuy, ...auxMessages],
			},
			() => {
				let filterArray = this.state.messageInstructionsBuy.filter(
					(element) => {
						return element.key.includes("EN") || element.key.includes("ES");
					},
				);
				if (filterArray.length === 2) {
					let newStatusAvailable = this.state.statusOptionsBuy.filter(
						(element) => {
							return element.value !== status;
						},
					);
					this.setState({ statusOptionsBuy: newStatusAvailable });
				}
			},
		);
		this.setState({
			operationStatusMessageBuy: "",
			languageMessageBuy: "",
			buy_instruction: "",
			buy_instruction_mc: "",
			existsDefaultInstructionsBuy: "",
			useInstructionsDefaultBuy: false,
			useInstructionsDefaultMcBuy: false,
			BUY__ALERT_GREEN: "",
			BUY__ALERT_BLUE: "",
			BUY__ALERT_RED: "",
			redBuyAlertOption: "",
			blueBuyAlertOption: "",
			greenBuyAlertOption: "",
			typeMessageSelectedMcBuy: "",
			languageMessageMcBuy: "",
			operationStatusMessageMcBuy: "",
			typeMessageSelectedBuy: "",
			isAlertMcMessageBuy: false,
		});
	}
	addMessageInstructionsSell() {
		let status = this.state.operationStatusMessage;
		let statusFind = this.state.allStatus.find(function (element) {
			return element.value === status;
		});

		let message,
			auxMessages = [];
		if (this.state.typeMessageSelectedSell === "ALERT") {
			let typeAlert;
			if (this.state.SELL__ALERT_GREEN !== "") {
				typeAlert = "ALERT_GREEN";
				message = {
					key: "SELL__" + typeAlert + "__" + this.state.languageMessage,
					value: this.state.SELL__ALERT_GREEN,
					text: this.state.languageMessage + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.SELL__ALERT_BLUE !== "") {
				typeAlert = "ALERT_BLUE";
				message = {
					key: "SELL__" + typeAlert + "__" + this.state.languageMessage,
					value: this.state.SELL__ALERT_BLUE,
					text: this.state.languageMessage + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
			if (this.state.SELL__ALERT_RED !== "") {
				typeAlert = "ALERT_RED";
				message = {
					key: "SELL__" + typeAlert + "__" + this.state.languageMessage,
					value: this.state.SELL__ALERT_RED,
					text: this.state.languageMessage + " - " + typeAlert,
				};
				auxMessages.push(message);
			}
		} else {
			message = {
				key:
					"SELL__" +
					this.state.operationStatusMessage +
					"__INSTRUCTIONS__" +
					this.state.languageMessage,
				value: this.state.sell_instruction,
				text: this.state.languageMessage + " - " + statusFind.text,
			};
			auxMessages.push(message);
		}
		let auxNewKeys = auxMessages.map((item) => item.key);
		let auxMessageInstructionSell = this.state.messageInstructionsSell.filter(
			(msg) => auxNewKeys.indexOf(msg.key) < 0,
		);
		this.setState(
			{
				messageInstructionsSell: [...auxMessageInstructionSell, ...auxMessages],
			},
			() => {
				let filterArray = this.state.messageInstructionsSell.filter(
					(element) => {
						return (
							(element.key.includes("EN") || element.key.includes("ES")) &&
							element.key.includes(status)
						);
					},
				);
				if (filterArray.length === 2) {
					let newStatusAvailable = this.state.statusOptionsSell.filter(
						(element) => {
							return element.value !== status;
						},
					);
					this.setState({ statusOptionsSell: newStatusAvailable });
				}
			},
		);
		this.setState({
			operationStatusMessage: "",
			languageMessage: "",
			sell_instruction: "",
			existsDefaultInstructionsSell: "",
			useInstructionsDefaultSell: false,
			SELL__ALERT_GREEN: "",
			SELL__ALERT_BLUE: "",
			SELL__ALERT_RED: "",
			redAlertOption: "",
			blueAlertOption: "",
			greenAlertOption: "",
		});
	}
	removeMessageBuy(key) {
		let newMessageBuy = this.state.messageInstructionsBuy.filter(function (
			element,
		) {
			return element.key !== key;
		});
		this.setState({
			messageInstructionsBuy: newMessageBuy,
		});
		let keySplit = key.split("__")[1];
		let findTypeToincludeArray = this.state.allStatus.find(function (ele) {
			return ele.value === keySplit;
		});
		if (findTypeToincludeArray !== undefined) {
			this.setState({
				statusOptionsBuy: [
					...this.state.statusOptionsBuy,
					findTypeToincludeArray,
				],
			});
		}
	}
	removeMessageSell(key) {
		let newMessageSell = this.state.messageInstructionsSell.filter(function (
			element,
		) {
			return element.key !== key;
		});
		this.setState({
			messageInstructionsSell: newMessageSell,
		});
		let keySplit = key.split("__")[1];
		let findTypeToincludeArray = this.state.allStatus.find(function (ele) {
			return ele.value === keySplit;
		});
		if (findTypeToincludeArray !== undefined) {
			this.setState({
				statusOptionsSell: [
					...this.state.statusOptionsSell,
					findTypeToincludeArray,
				],
			});
		}
	}
	setOperationsStatusSellAndBuy() {
		var operationsStatuses = [
			{
				key: "WAITING_FOR_PAYMENT",
				value: "WAITING_FOR_PAYMENT",
				text: "ESPERANDO POR PAGO",
			},
			{
				key: "CANCELED",
				value: "CANCELED",
				text: "CANCELADA",
			},
			{
				key: "SUCCESS",
				value: "SUCCESS",
				text: "EXITOSA",
			},
			{
				key: "CLAIM",
				value: "CLAIM",
				text: "RECLAMO",
			},
			{
				key: "PAY_VERIFICATION",
				value: "PAY_VERIFICATION",
				text: "VERIFICANDO PAGO",
			},
			{
				key: "WAITING_TO_START_OPERATION",
				value: "WAITING_TO_START_OPERATION",
				text: "ESPERANDO PARA INICIAR OPERACIÓN",
			},
		];
		let typeMessage = [
			{
				key: "ALERT",
				value: "ALERT",
				text: "Alerta",
			},
			{
				key: "INSTRUCTIONS",
				value: "INSTRUCTIONS",
				text: "Instrucciones",
			},
		];
		let typeMessageBuy = [
			{
				key: "ALERT_MC",
				value: "ALERT_MC",
				text: "Alerta",
			},
			{
				key: "INSTRUCTIONS_MC",
				value: "INSTRUCTIONS_MC",
				text: "Instrucciones",
			},
		];
		let instructionByStatus = paymentInstructionsDefault;
		this.setState({
			statusOptionsSell: operationsStatuses,
			statusOptionsBuy: operationsStatuses,
			allStatus: operationsStatuses,
			optionsTypeMessagesBuy: typeMessage,
			optionsTypeMessagesSell: typeMessage,
			defaultInstructions: instructionByStatus,
			optionsTypeMessagesMcBuy: typeMessageBuy,
		});
	}
	onChangeTypeMessageSell(e, data) {
		this.setState({ optionsLenguageSell: [] });
		let isAlert = false,
			isInstructions = false;
		if (data.value === "ALERT") {
			isAlert = true;
		} else isInstructions = true;
		var optionsLenguage = [
			{ key: "EN", text: "Inglés", value: "EN" },
			{ key: "ES", text: "Español", value: "ES" },
		];
		this.setState({ optionsLenguageSell: optionsLenguage });
		this.setState({
			typeMessageSelectedSell: data.value,
			isAlertMessageSell: isAlert,
			isInstructionsMessageSell: isInstructions,
		});
	}
	onChangeTypeMessageMcBuy(e, data) {
		this.setState({ optionsLenguageMcBuy: [] });
		var optionsLenguage = [
			{ key: "EN", text: "Inglés", value: "EN" },
			{ key: "ES", text: "Español", value: "ES" },
		];
		this.setState({ optionsLenguageMcBuy: optionsLenguage });

		this.setState({
			typeMessageSelectedMcBuy: data.value,
			isAlertMcMessageBuy: data.value === "ALERT_MC",
			isInstructionsMessageMcBuy: data.value !== "ALERT_MC",
		});
	}
	onChangeTypeMessageBuy(e, data) {
		this.setState({ optionsLenguageBuy: [] });
		let isAlert = false,
			isInstructions = false;
		if (data.value === "ALERT") {
			isAlert = true;
		} else isInstructions = true;
		var optionsLenguage = [
			{ key: "EN", text: "Inglés", value: "EN" },
			{ key: "ES", text: "Español", value: "ES" },
		];
		this.setState({ optionsLenguageBuy: optionsLenguage });
		this.setState({
			typeMessageSelectedBuy: data.value,
			isAlertMessageBuy: isAlert,
			isInstructionsMessageBuy: isInstructions,
		});
	}
	onChangeInstructionsDefaultBuy(e, data) {
		let msg = data.checked ? this.state.existsDefaultInstructionsBuy : "";
		this.setState({
			useInstructionsDefaultBuy: data.checked,
			buy_instruction: msg,
		});
	}
	onChangeInstructionsDefaultMcBuy(e, data) {
		let msg = data.checked ? this.state.existsDefaultInstructionsBuy : "";
		this.setState({
			useInstructionsDefaultMcBuy: data.checked,
			buy_instruction_mc: msg,
		});
	}
	onChangeInstructionsDefaultSell(e, data) {
		let msg = data.checked ? this.state.existsDefaultInstructionsSell : "";
		this.setState({
			useInstructionsDefaultSell: data.checked,
			sell_instruction: msg,
		});
	}

	pickEmails = (e, data) => {
		console.log(data.value);
		var optionsArray = [];
		optionsArray.push(data.value);

		this.setState({ emailsToSave: data.value });
	};

	initData() {
		this.setState({ listOperators: [], show: false });
		let listEmail = [];
		userService
			.listNamesByIndexAndValue("type", "ADMIN")
			.then((resp) => {
				Object.entries(resp.data).forEach(([k, v]) => {
					let obj = {
						key: v,
						text: v,
						value: v,
					};
					listEmail.push(obj);
				});

				this.setState({
					listOperators: listEmail,
				});
			})
			.catch((error) => {
				this.setState({ show: true, errorInRed: true });
			});
	}

	render() {
		var optionsLenguage = [
			{ key: "EN", text: "Ingles", value: "EN" },
			{ key: "ES", text: "Español", value: "ES" },
		];
		const paymentTypesTableHeaders = [
			{
				Header: "Tipo",
				accessor: "name",
				Cell: (row) => {
					if (row.value === "TRANSFER_INTERNATIONAL_BANK") {
						return "Transferencia internacional (Swift o Aba)";
					} else if (row.value === "CASH_DEPOSIT") {
						return "Depósito en efectivo";
					} else if (row.value === "TRANSFER_WITH_SPECIFIC_BANK") {
						return "Transferencia desde un banco específico";
					} else if (row.value === "TRANSFER_NATIONAL_BANK") {
						return "Transferencia desde un tercer banco";
					} else if (row.value === "TRANSFER_TO_CRYPTO_WALLET") {
						return "Transferencia desde una crypto wallet";
					} else if (row.value === "WIRE_TRANSFER") {
						return "Wire (Transferencia cablegráfica)";
					} else if (row.value === "CHECK_DEPOSIT") {
						return "Depósito en cheque";
					} else if (row.value === "CREDIT_CARD") {
						return "Tarjeta de crédito";
					} else if (row.value === "PERSONAL_CHECK_DEPOSIT") {
						return "Cheque personal";
					} else if (row.value === "CASHIER_CHECK_DEPOSIT") {
						return "Cheque de gerencia";
					} else if (row.value === "MONEY_ORDER") {
						return "Orden de dinero";
					}else if (row.value === "MOBILE_PAYMENT") {
						return "Pago Móvil";
					} else {
						return row.value;
					}
				},
			},
			{
				Header: "Ventana de pago",
				accessor: "payWindow",
				width: 136,
				Cell: (row) => {
					return row.value
						.replace("minutes", "minutos")
						.replace("hours", "horas");
				},
			},
			{
				Header: "Medio de pago requerido",
				accessor: "joinMyPayments",
				Cell: (row) => {
					if (row.value) {
						return <Icon color='green' name='check' />;
					} else {
						return <Icon color='red' name='cancel' />;
					}
				},
			},
			{
				Header: "Solo campo agrupador",
				accessor: "joinFieldValue",
				Cell: (row) => {
					if (row.value) {
						return <Icon color='green' name='check' />;
					} else {
						return <Icon color='red' name='cancel' />;
					}
				},
			},
			{
				Header: "Mensajes",
				accessor: "messages",
				width: 525,
				getProps: (state, rowInfo, column) => {
					return {
						style: {
							maxHeight: 120,
							overflowY: "auto",
						},
					};
				},
				Cell: (row) => {
					let output = [];
					Object.keys(row.value).forEach((key) => {
						output.push(key + ":: " + row.value[key]);
					});
					if (output.length > 0) {
						return output.map((info, i) => (
							<div key={i} style={{ marginTop: 10 }}>
								<Label
									style={{ cursor: "pointer" }}
									color={
										info.includes("ALERT")
											? info.split("ALERT_")[1].split(":: ")[0].includes("__")
												? info.split("ALERT_")[1].split("__")[0].toLowerCase()
												: info.split("ALERT_")[1].split(":: ")[0].toLowerCase()
											: ""
									}
									content={
										info.split(":: ")[1].length > 30
											? info.split(":: ")[1].substring(0, 30) + "..."
											: info.split(":: ")[1]
									}
									title={info.split(":: ")[1]}
								/>
							</div>
						));
					} else {
						return "No se agregaron mensajes";
					}
				},
			},
			{
				Header: "",
				accessor: "actions",
				width: 45,
				Cell: (row) => {
					return (
						<Button
							color='red'
							onClick={() => this.removePaymentType(row.original.name)}
							title='Eliminar'
							size='mini'
							icon
							circular
							labelPosition='left'>
							<Icon name='cancel' />
						</Button>
					);
				},
			},
		];
		let messageSucessCreation, messageErrorCreation;
		if (this.state.showMessageSucessCreation) {
			messageSucessCreation = (
				<Message positive>
					<Message.Header>Creación exitosa</Message.Header>
					<p>El medio de pago ha sido creado exitosamente.</p>
				</Message>
			);
		}
		if (this.state.showMessageErrorCreation) {
			messageErrorCreation = (
				<Message negative>
					<Message.Header>Error</Message.Header>
					<p>Lo sentimos, ha ocurrido un error. Intente de nuevo.</p>
				</Message>
			);
		}
		return (
			<span>
				{messageSucessCreation}
				{messageErrorCreation}
				{this.state.loading === true && (
					<Dimmer active inverted style={{ height: "200px", marginTop: 10 }}>
						<Loader inverted style={{ height: "200px", marginTop: 100 }}>
							Cargando...
						</Loader>
					</Dimmer>
				)}
				{this.state.loading === false && (
					<Form key={this.state.allFormKey}>
						<Form.Group widths={2}>
							<Form.Field>
								<label>Moneda</label>
								<Dropdown
									fluid
    								selection
									placeholder='Seleccione una moneda'
									options={this.state.currenciesToAddOptions}
									onChange={this.pickCurrency}
								/>
							</Form.Field>
							{this.state.currencyToAdd !== "" && (
								<Form.Field key={this.state.keyFieldsSelect}>
									<label>Financial Types</label>
									<Select
										fluid
    									selection
										placeholder='Financial Types'
										options={this.state.financialTypesToShow}
										onChange={this.onChangeFinancialType.bind(this)}
									/>
								</Form.Field>
							)}
						</Form.Group>
						{<Form.Group key={this.state.keyFieldsFormGroup} widths={4}>
							{this.state.fieldsToAdd.map((field, i) => (
								<Form.Field key={i}>
									<label>{this.getTextSpanish(field.name)}</label>
									{this.getTextSpanish(field.name) !== "Banco" &&
									this.getTextSpanish(field.name) !== "Tipo de cuenta" ? (
										<input
											placeholder={this.getPlaceHolder(field.name)}
											onChange={(e) =>
												this.setState({
													[field.name + "ToAddDynamic"]: e.target
														.value,
												})
											}
										/>
									) : (
										<Select
											search
											placeholder='Seleccione'
											options={
												this.state[field.name + "OptionsDynamic"]
											}
											onChange={(e, data) =>
												this.setState({
													[field.name + "ToAddDynamic"]: data.value,
												})
											}
										/>
									)}
								</Form.Field>
							))}
										</Form.Group>}
						{this.state.financialTypeSelected !== null && (
							<Form.Group key={this.state.keyStatusFormGroup} widths='equal'>
								<Form.Field>
									<label>Debitar</label>
									<Select
										search
										placeholder='Seleccione un estado'
										options={this.state.statusArray}
										onChange={this.pickStatusAcceptOut}
									/>
								</Form.Field>
								<Form.Field>
									<label>Acreditar</label>
									<Select
										search
										placeholder='Seleccione un estado'
										options={this.state.statusArray}
										onChange={this.pickStatusAcceptIn}
									/>
								</Form.Field>
								<Form.Field>
									<label>Estado</label>
									<Select
										search
										placeholder='Seleccione un estado'
										options={this.state.statusArray}
										onChange={this.pickStatus}
									/>
								</Form.Field>
									<Form.Field style={{paddingTop: 30}}>
									<Checkbox
										label='Depósito restringido'
										onChange={this.toggleIsRestrictedDeposits}
										checked={this.state.restrictedDeposits}
									/>
								</Form.Field>
							</Form.Group>
						)}
					</Form>
				)}
				{this.state.financialTypeSelected !== null && (
					<span>
						<Divider section />
						<div style={{ textAlign: "right" }}>
							<Button
								color='blue'
								icon
								labelPosition='left'
								onClick={this.openAddPaymentTypeModal}>
								<Icon name='add' />
								Agregar tipo de pago
							</Button>
						</div>
						<ReactTable
							style={{ marginTop: 20 }}
							className='transactionTable'
							data={this.state.toConfirmPaymentTypes}
							columns={paymentTypesTableHeaders}
							defaultPageSize={5}
							previousText='Anterior'
							nextText='Siguiente'
							loadingText='Cargando...'
							noDataText='No se han agregado tipos de pago'
							pageText='Página'
							ofText='de'
							rowsText='filas'
							pageJumpText='ir a la página'
							rowsSelectorText='filas por página'
							minRow={5}
						/>
						<Segment basic>
							<Header as='h4'>Parámetros para ENVÍOS DE DINERO</Header>
							{this.state.errorAmount && (
								<Message negative>
									<Message.Header>Error</Message.Header>
									<p>El mínimo de operación debe ser menor al máximo.</p>
								</Message>
							)}
							<div>
								{this.state.rules.map((item, index) => (
									<Label key={index} style={{ marginBottom: 10 }}>
										{item.text}
										<Icon
											name='delete'
											onClick={() => this.removeRulesToSendPayments(item.key)}
										/>
									</Label>
								))}
							</div>
							<Form style={{ marginTop: 20 }}>
								<Form.Group widths='equal'>
									<Form.Select
										fluid
										label='Tipos de medios de pago'
										options={this.state.paymentTypesByCurrencyOptionsSend}
										placeholder='Tipos'
										onChange={this.setPicketPaymentTypeSelectSend.bind(this)}
										value={this.state.paymentTypeSelectSend}
									/>
									<Form.Field fluid>
										<label>Mínimo por operación</label>
										<NumberFormat
											value={this.state.minOperation}
											allowNegative={false}
											thousandSeparator={true}
											placeholder=''
											onValueChange={(values) =>
												this.setMinAmountOperationSend(values.value)
											}
											name='fiat'
										/>
									</Form.Field>
									<Form.Field fluid>
										<label>Máximo por operación</label>
										<NumberFormat
											value={this.state.maxOperation}
											allowNegative={false}
											thousandSeparator={true}
											placeholder=''
											onValueChange={(values) =>
												this.setMaxAmountOperationSend(values.value)
											}
											name='fiat'
										/>
									</Form.Field>
									<Button
										color='blue'
										disabled={
											this.state.paymentTypeSelectSend === "" ||
											this.state.minOperation === "" ||
											this.state.maxOperation === ""
										}
										style={{ marginTop: 23, height: 38 }}
										onClick={this.addRulesToSendPayments.bind(this)}>
										Agregar
									</Button>
								</Form.Group>
							</Form>
						</Segment>
						<Segment basic>
							<Header as='h4'>Parámetros para RECARGA DE SALDO</Header>
							{this.state.errorAmountBuy && (
								<Message negative>
									<Message.Header>Error</Message.Header>
									<p>El mínimo de operación debe ser menor al máximo.</p>
								</Message>
							)}
							<div>
								{this.state.rulesBuy.map((item, index) => (
									<Label key={index} style={{ marginBottom: 10 }}>
										{item.text}
										<Icon
											name='delete'
											onClick={() =>
												this.removeRulesToBuyBalancePayments(item.key)
											}
										/>
									</Label>
								))}
							</div>
							<Form style={{ marginTop: 20 }}>
								<Form.Group widths='equal'>
									<Form.Select
										fluid
										label='Tipos de medios de pago'
										options={this.state.paymentTypesByCurrencyOptionsBuy}
										placeholder='Tipos'
										onChange={this.setPicketPaymentTypeSelectBuy.bind(this)}
										value={this.state.paymentTypeSelectBuy}
									/>
									<Form.Field fluid>
										<label>Mínimo por operación</label>
										<NumberFormat
											value={this.state.minOperationBuy}
											allowNegative={false}
											thousandSeparator={true}
											placeholder=''
											onValueChange={(values) =>
												this.setMinAmountOperationBuy(values.value)
											}
											name='fiat'
										/>
									</Form.Field>
									<Form.Field fluid>
										<label>Máximo por operación</label>
										<NumberFormat
											value={this.state.maxOperationBuy}
											allowNegative={false}
											thousandSeparator={true}
											placeholder=''
											onValueChange={(values) =>
												this.setMaxAmountOperationBuy(values.value)
											}
											name='fiat'
										/>
									</Form.Field>
									<Button
										color='blue'
										disabled={
											this.state.paymentTypeSelectBuy === "" ||
											this.state.minOperationBuy === "" ||
											this.state.maxOperationBuy === ""
										}
										style={{ marginTop: 23, height: 38 }}
										onClick={this.addRulesToBuyBalancePayments.bind(this)}>
										Agregar
									</Button>
								</Form.Group>
							</Form>

							<Form style={{ marginTop: 20 }}>
								<Form.Field>
									<Header as='h4'>Correos a Asignar al Medio de Pago</Header>
									{/* <label>Correos:</label> */}

									{this.state.listOperators.length === 0 && (
										<Segment
											basic
											loading={this.state.listOperators.length === 0}></Segment>
									)}

									{this.state.listOperators.length > 0 && (
										<Form.Select
											label='Correos'
											search
											multiple
											placeholder='Seleccione'
											options={this.state.listOperators}
											onChange={this.pickEmails.bind(this)}
										/>
									)}
								</Form.Field>
							</Form>
						</Segment>
						<div style={{ textAlign: "right", marginTop: 20 }}>
							<Button
								color='blue'
								disabled={
								this.state.toConfirmPaymentTypes.length < 1}
								onClick={this.createDollarBTCPayment}
								loading={this.state.loadCreate}>
								Crear
							</Button>
						</div>
					</span>
				)}
				<Modal
					open={this.state.paymentTypeModalOpen}
					onClose={this.closeAddPaymentTypeModal}>
					<Header icon='add' content='Agregar tipo de pago' />
					<Modal.Content>
						<Form>
							<Form.Group widths='equal'>
								<Form.Field>
									<label>Tipo de pago</label>
									<Select
										search
										placeholder='Seleccione un tipo'
										options={this.state.paymentTypesByCurrencyOptions}
										onChange={this.pickpaymentTypeToAdd.bind(this)}
										value={this.state.paymentTypeToAdd}
									/>
								</Form.Field>
								<Form.Field>
									<label>Ventana de pago</label>
									<Input
										label={
											<Select
												defaultValue='minutes'
												options={[
													{
														key: "minutes",
														value: "minutes",
														text: "min",
													},
													{ key: "hours", value: "hours", text: "hrs" },
												]}
												onChange={(e, data) => {
													this.setState({ periodTimeToAdd: data.value });
												}}
											/>
										}
										labelPosition='right'
										placeholder='90'
										onChange={this.handlePaymentWindow}
										value={this.state.paymentWindow}
									/>
								</Form.Field>
							</Form.Group>
							<Form.Group widths='equal'>
								<Form.Field>
									<Checkbox
										label='Requiere medio de pago de cliente (Compra)'
										onChange={this.toggleJoinMyPayments}
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										label='Permite solo el mismo valor del campo agrupador (Compra)'
										onChange={this.toggleJoinFieldValue}
									/>
								</Form.Field>
							</Form.Group>
							{/*Los mensajes de venta a partir de aqui*/}
							<Divider content='Mensajes en Ventas' horizontal />
							<div>
								{((this.state.isAlertMessageSell &&
									this.state.languageMessage !== "") ||
									this.state.messageInstructionsSell.find((m) =>
										m.key.includes("ALERT"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de Alerta
									</label>
								)}

								{this.state.messageInstructionsSell.map((item, index) => {
									if (item.key.includes("ALERT")) {
										return (
											<Label
												key={index}
												style={{ marginBottom: 10 }}
												color={item.key
													.split("__")[1]
													.split("_")[1]
													.toLowerCase()}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageSell(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<div>
								{((this.state.isInstructionsMessageSell &&
									this.state.languageMessage !== "") ||
									this.state.messageInstructionsSell.find((m) =>
										m.key.includes("INSTRUCTIONS"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de instrucción
									</label>
								)}
								{this.state.messageInstructionsSell.map((item, index) => {
									if (item.key.includes("INSTRUCTIONS")) {
										return (
											<Label key={index} style={{ marginBottom: 10 }}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageSell(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<Form.Group widths='equal'>
								<Form.Field>
									<label>Tipo de Mensaje</label>
									<Select
										disabled={this.state.paymentTypeToAdd === ""}
										placeholder='Seleccione un tipo'
										value={this.state.typeMessageSelectedSell}
										options={this.state.optionsTypeMessagesSell}
										onChange={this.onChangeTypeMessageSell}
									/>
								</Form.Field>
								<Form.Field>
									<label>Idioma</label>
									<Select
										disabled={this.state.typeMessageSelectedSell === ""}
										placeholder='Seleccione idioma'
										options={this.state.optionsLenguageSell}
										value={this.state.languageMessage}
										onChange={this.pickLanguageMessage.bind(this)}
									/>
								</Form.Field>
								<Form.Field style={{ marginTop: 24 }}>
									<Button
										color='blue'
										disabled={this.state.languageMessage === ""}
										onClick={this.addMessageInstructionsSell.bind(this)}>
										Incluir mensaje
									</Button>
								</Form.Field>
							</Form.Group>

							{this.state.isAlertMessageSell && (
								<div>
									{this.state.languageMessage !== "" && (
										<Form.Group widths='equal'>
											<Form.Field>
												<label>Alerta verde</label>
												<Select
													search
													placeholder='Seleccione una opción'
													name='alert_sell_green'
													disabled={this.state.optionMessage}
													options={this.state.messagesAlertOptions}
													onChange={this.pickMessagesAlert.bind(this)}
													value={this.state.greenAlertOption}
												/>
												<Divider hidden />
												{this.state.messageError &&
													this.state.nameText === "alert_sell_green" && (
														<Label basic color='red' pointing='below'>
															No hay mensaje por defecto
														</Label>
													)}
												<TextArea
													disabled={this.state.textGreenSell}
													placeholder='Ingrese el mensaje.'
													onChange={this.handleGreenAlert}
													value={this.state.SELL__ALERT_GREEN}
												/>
											</Form.Field>
											<Form.Field>
												<label>Alerta azul</label>
												<Select
													search
													placeholder='Seleccione una opción'
													name='alert_sell_blue'
													disabled={this.state.optionMessage}
													options={this.state.messagesAlertOptions}
													onChange={this.pickMessagesAlert}
													value={this.state.blueAlertOption}
												/>
												<Divider hidden />
												{this.state.messageError &&
													this.state.nameText === "alert_sell_blue" && (
														<Label basic color='red' pointing='below'>
															No hay mensaje por defecto
														</Label>
													)}
												<TextArea
													disabled={this.state.textBlueSell}
													placeholder='Ingrese el mensaje.'
													onChange={this.handleBlueAlert}
													value={this.state.SELL__ALERT_BLUE}
												/>
											</Form.Field>
											<Form.Field>
												<label>Alerta roja</label>
												<Select
													search
													placeholder='Seleccione una opción'
													name='alert_sell_red'
													disabled={this.state.optionMessage}
													options={this.state.messagesAlertOptions}
													onChange={this.pickMessagesAlert}
													value={this.state.redAlertOption}
												/>
												<Divider hidden />
												{this.state.messageError &&
													this.state.nameText === "alert_sell_red" && (
														<Label basic color='red' pointing='below'>
															No hay mensaje por defecto
														</Label>
													)}
												<TextArea
													disabled={this.state.textRedSell}
													placeholder='Ingrese el mensaje.'
													onChange={this.handleRedAlert}
													value={this.state.SELL__ALERT_RED}
												/>
											</Form.Field>
										</Form.Group>
									)}
								</div>
							)}

							{this.state.isInstructionsMessageSell && (
								<div>
									{this.state.languageMessage !== "" && (
										<Form.Group>
											<Form.Field width={5}>
												<label>Estatus</label>
												<Select
													disabled={this.state.paymentTypeToAdd === ""}
													placeholder='Seleccione un estatus'
													value={this.state.operationStatusMessage}
													options={this.state.statusOptionsSell}
													onChange={this.pickOTCOperationStatusToSearch.bind(
														this,
													)}
												/>
											</Form.Field>
											{this.state.existsDefaultInstructionsSell !== "" && (
												<Form.Field style={{ marginTop: "30px" }}>
													<Checkbox
														label={<label>Usar mensaje por defecto</label>}
														checked={this.state.useInstructionsDefaultSell}
														onChange={this.onChangeInstructionsDefaultSell}
													/>
												</Form.Field>
											)}
										</Form.Group>
									)}
									{this.state.operationStatusMessage !== "" &&
										this.state.languageMessage !== "" && (
											<Form.Field fluid>
												<label>Mensaje</label>
												<TextArea
													fluid
													disabled={
														this.state.languageMessage === "" ||
														this.state.operationStatusMessage === "" ||
														this.state.useInstructionsDefaultSell
													}
													placeholder='Ingrese el mensaje.'
													onChange={(e, data) =>
														this.setState({ sell_instruction: data.value })
													}
													value={this.state.sell_instruction}
												/>
											</Form.Field>
										)}
								</div>
							)}
							{/*Los mensajes de compra a partir de aqui*/}
							<Divider content='Mensajes en Compras' horizontal />
							<div>
								{((this.state.isAlertMessageBuy &&
									this.state.languageMessageBuy !== "") ||
									this.state.messageInstructionsBuy.find(
										(m) => m.key.includes("ALERT") && !m.key.includes("MC"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de Alerta
									</label>
								)}

								{this.state.messageInstructionsBuy.map((item, index) => {
									if (item.key.includes("ALERT") && !item.key.includes("MC")) {
										return (
											<Label
												key={index}
												style={{ marginBottom: 10 }}
												color={item.key
													.split("__")[1]
													.split("_")[1]
													.toLowerCase()}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageBuy(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<div>
								{((this.state.isInstructionsMessageBuy &&
									this.state.languageMessageBuy !== "") ||
									this.state.messageInstructionsBuy.find(
										(m) =>
											m.key.includes("INSTRUCTIONS") && !m.key.includes("MC"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de Instrucción
									</label>
								)}

								{this.state.messageInstructionsBuy.map((item, index) => {
									if (
										item.key.includes("INSTRUCTIONS") &&
										!item.key.includes("MC")
									) {
										return (
											<Label key={index} style={{ marginBottom: 10 }}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageBuy(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<Form.Group widths='equal'>
								<Form.Field>
									<label>Tipo de Mensaje</label>
									<Select
										disabled={this.state.paymentTypeToAdd === ""}
										placeholder='Seleccione un tipo'
										value={this.state.typeMessageSelectedBuy}
										options={this.state.optionsTypeMessagesBuy}
										onChange={this.onChangeTypeMessageBuy}
									/>
								</Form.Field>
								<Form.Field>
									<label>Idioma</label>
									<Select
										disabled={this.state.typeMessageSelectedBuy === ""}
										placeholder='Seleccione idioma'
										options={this.state.optionsLenguageBuy}
										value={this.state.languageMessageBuy}
										onChange={this.pickLanguageMessageBuy.bind(this)}
									/>
								</Form.Field>
								<Form.Field style={{ marginTop: 24 }}>
									<Button
										color='blue'
										disabled={
											this.state.languageMessageBuy === "" ||
											this.state.buy_instruction === ""
										}
										onClick={this.addMessageInstructionsBuy.bind(this)}>
										Incluir mensaje
									</Button>
								</Form.Field>
							</Form.Group>

							{this.state.isAlertMessageBuy &&
								this.state.languageMessageBuy !== "" && (
									<Form.Group widths='equal'>
										<Form.Field>
											<label>Alerta verde</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_green'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlert}
												value={this.state.greenBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_green" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textGreenBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyGreenAlert}
												value={this.state.BUY__ALERT_GREEN}
											/>
										</Form.Field>
										<Form.Field>
											<label>Alerta azul</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_blue'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlert}
												value={this.state.blueBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_blue" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textBlueBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyBlueAlert}
												value={this.state.BUY__ALERT_BLUE}
											/>
										</Form.Field>
										<Form.Field>
											<label>Alerta roja</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_red'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlert}
												value={this.state.redBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_red" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textRedBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyRedAlert}
												value={this.state.BUY__ALERT_RED}
											/>
										</Form.Field>
									</Form.Group>
								)}
							{this.state.isInstructionsMessageBuy && (
								<div>
									{this.state.languageMessageBuy !== "" && (
										<Form.Group>
											<Form.Field width={5}>
												<label>Estatus</label>
												<Select
													placeholder='Seleccione un estatus'
													disabled={this.state.paymentTypeToAdd === ""}
													options={this.state.statusOptionsBuy}
													value={this.state.operationStatusMessageBuy}
													onChange={this.pickOTCOperationStatusBuy.bind(this)}
												/>
											</Form.Field>
											{this.state.existsDefaultInstructionsBuy !== "" && (
												<Form.Field style={{ marginTop: "30px" }}>
													<Checkbox
														label={<label>Usar mensaje por defecto</label>}
														checked={this.state.useInstructionsDefaultBuy}
														onChange={this.onChangeInstructionsDefaultBuy.bind(
															this,
														)}
													/>
												</Form.Field>
											)}
										</Form.Group>
									)}
									{this.state.languageMessageBuy !== "" &&
										this.state.operationStatusMessageBuy !== "" && (
											<Form.Field fluid>
												<label>Mensaje</label>
												<TextArea
													fluid
													disabled={
														this.state.languageMessageBuy === "" ||
														this.state.operationStatusMessageBuy === "" ||
														this.state.useInstructionsDefaultBuy
													}
													placeholder='Ingrese el mensaje.'
													onChange={(e, data) =>
														this.setState({ buy_instruction: data.value })
													}
													value={this.state.buy_instruction}
												/>
											</Form.Field>
										)}
								</div>
							)}
							<Divider
								content='Mensajes en Recarga de Saldo MoneyClick'
								horizontal
							/>
							<div>
								{((this.state.isAlertMcMessageBuy &&
									this.state.languageMessageBuy !== "") ||
									this.state.messageInstructionsBuy.find(
										(m) =>
											m.key.includes("MC") && !m.key.includes("INSTRUCTIONS"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de Alerta Recarga de Saldo
									</label>
								)}

								{this.state.messageInstructionsBuy.map((item, index) => {
									if (
										item.key.includes("MC") &&
										!item.key.includes("INSTRUCTIONS")
									) {
										return (
											<Label
												key={index}
												style={{ marginBottom: 10 }}
												color={item.key
													.split("__")[1]
													.split("_")[1]
													.toLowerCase()}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageBuy(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<div>
								{((this.state.isInstructionsMessageMcBuy &&
									this.state.languageMessageMcBuy !== "") ||
									this.state.messageInstructionsBuy.find(
										(m) =>
											m.key.includes("INSTRUCTIONS") && m.key.includes("MC"),
									) !== undefined) && (
									<label style={{ fontWeight: "bold" }}>
										Mensajes de Instrucción
									</label>
								)}

								{this.state.messageInstructionsBuy.map((item, index) => {
									if (
										item.key.includes("INSTRUCTIONS") &&
										item.key.includes("MC")
									) {
										return (
											<Label key={index} style={{ marginBottom: 10 }}>
												{item.value.length > 10
													? item.text + " - " + item.value.slice(0, 9) + "..."
													: item.text + " - " + item.value}
												<Icon
													name='delete'
													onClick={() => this.removeMessageBuy(item.key)}
												/>
											</Label>
										);
									}
								})}
							</div>
							<Form.Group widths='equal'>
								<Form.Field>
									<label>Tipo de Mensaje</label>
									<Select
										disabled={this.state.paymentTypeToAdd === ""}
										placeholder='Seleccione un tipo'
										value={this.state.typeMessageSelectedMcBuy}
										options={this.state.optionsTypeMessagesMcBuy}
										onChange={this.onChangeTypeMessageMcBuy.bind(this)}
									/>
								</Form.Field>
								<Form.Field>
									<label>Idioma</label>
									<Select
										disabled={this.state.typeMessageSelectedMcBuy === ""}
										placeholder='Seleccione idioma'
										options={this.state.optionsLenguageMcBuy}
										value={this.state.languageMessageMcBuy}
										onChange={this.pickLanguageMessageMcBuy.bind(this)}
									/>
								</Form.Field>
								<Form.Field style={{ marginTop: 24 }}>
									<Button
										color='blue'
										disabled={
											this.state.languageMessageMcBuy === "" ||
											this.state.buy_instruction_mc === ""
										}
										onClick={this.addMessageInstructionsBuy.bind(this)}>
										Incluir mensaje
									</Button>
								</Form.Field>
							</Form.Group>
							{this.state.isAlertMcMessageBuy &&
								this.state.languageMessageMcBuy !== "" && (
									<Form.Group widths='equal'>
										<Form.Field>
											<label>Alerta verde</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_green_mc'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlertMc.bind(this)}
												value={this.state.greenBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_green_mc" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textGreenBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyGreenAlert}
												value={this.state.BUY__ALERT_GREEN}
											/>
										</Form.Field>
										<Form.Field>
											<label>Alerta azul</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_blue_mc'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlertMc.bind(this)}
												value={this.state.blueBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_blue_mc" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textBlueBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyBlueAlert}
												value={this.state.BUY__ALERT_BLUE}
											/>
										</Form.Field>
										<Form.Field>
											<label>Alerta roja</label>
											<Select
												search
												placeholder='Seleccione una opción'
												name='alert_buy_red_mc'
												disabled={this.state.optionMessage}
												options={this.state.messagesAlertOptions}
												onChange={this.pickMessagesAlertMc.bind(this)}
												value={this.state.redBuyAlertOption}
											/>
											<Divider hidden />
											{this.state.messageError &&
												this.state.nameText === "alert_buy_red_mc" && (
													<Label basic color='red' pointing='below'>
														No hay mensaje por defecto
													</Label>
												)}
											<TextArea
												disabled={this.state.textRedBuy}
												placeholder='Ingrese el mensaje.'
												onChange={this.handleBuyRedAlert}
												value={this.state.BUY__ALERT_RED}
											/>
										</Form.Field>
									</Form.Group>
								)}
							{this.state.isInstructionsMessageMcBuy && (
								<div>
									{this.state.languageMessageMcBuy !== "" && (
										<Form.Group>
											<Form.Field width={5}>
												<label>Estatus</label>
												<Select
													placeholder='Seleccione un estatus'
													disabled={this.state.paymentTypeToAdd === ""}
													options={this.state.statusOptionsBuy}
													value={this.state.operationStatusMessageMcBuy}
													onChange={this.pickOTCOperationStatusMcBuy.bind(this)}
												/>
											</Form.Field>
											{this.state.existsDefaultInstructionsBuy !== "" && (
												<Form.Field style={{ marginTop: "30px" }}>
													<Checkbox
														label={<label>Usar mensaje por defecto</label>}
														checked={this.state.useInstructionsDefaultMcBuy}
														onChange={this.onChangeInstructionsDefaultMcBuy.bind(
															this,
														)}
													/>
												</Form.Field>
											)}
										</Form.Group>
									)}
									{this.state.languageMessageMcBuy !== "" &&
										this.state.operationStatusMessageMcBuy !== "" && (
											<Form.Field fluid>
												<label>Mensaje</label>
												<TextArea
													fluid
													disabled={
														this.state.languageMessageMcBuy === "" ||
														this.state.operationStatusMessageMcBuy === "" ||
														this.state.useInstructionsDefaultMcBuy
													}
													placeholder='Ingrese el mensaje.'
													onChange={(e, data) =>
														this.setState({ buy_instruction_mc: data.value })
													}
													value={this.state.buy_instruction_mc}
												/>
											</Form.Field>
										)}
								</div>
							)}
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button
							type='submit'
							onClick={this.closeAddPaymentTypeModal}
							color='grey'
							icon
							labelPosition='left'>
							<Icon name='cancel' />
							Cancelar
						</Button>
						<Button
							type='submit'
							onClick={this.addPaymentType}
							color='blue'
							icon
							labelPosition='left'
							disabled={
								this.state.paymentTypeToAdd === "" ||
								this.state.paymentWindow === ""
							}>
							<Icon name='add' />
							Agregar
						</Button>
					</Modal.Actions>
				</Modal>
			</span>
		);
	}
}

export default CreatePaymentMethods;