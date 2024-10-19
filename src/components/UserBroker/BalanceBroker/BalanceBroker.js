import React, { Component } from "react";
import {
	Segment,
	Grid,
	Button,
	Modal,
	Icon,
	Form,
	Select,
	Input,
	Dimmer,
	Loader,
	Message,
	Divider,
	Label,
	Flag,
	Image,
	Accordion,
	Header,
	Popup,
} from "semantic-ui-react";
import ReactTable from "react-table";
import term from "../../../common/termAndConditionsSell";
import * as jsPDF from "jspdf";
import translate from "../../../i18n/translate";
import otc from "../../../services/otc";
import brokerService from "../../../services/brokers";
import AddAccount from "../../Profile/AddAcount/AddAcount";
import NumberFormat from "react-number-format";
import ISOCURRENCIES from "../../../common/ISO4217";
import AddOwnAccount from "../../Profile/AddOwnAccount/AddOwnAccount";
import WaitingVerification from "../../Profile/WaitingVerificationAccount/WaitingVerificationAccount";
import TermsAndConditions from "../../TermsAndConditions/TermsAndConditions";
import Tether from "../../../img/tether-seeklogo.svg";
import Eth from "../../../img/eth.svg";

class BalanceBroker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			translator: props.translate,
			showModalSendPayment: false,
			listPayments: [],
			optionPaymentMethod: "",
			paymentMethodSelect: "",
			addAccount: false,
			addOwnAccount: false,
			viewAdd: false,
			viewForm: false,
			verification: false,
			ceroOperations: false,
			amountToSend: "",
			currencyToSend: "",
			descriptionToSend: "",
			balanceAvailable: "",
			balanceByCurrency: [],
			load: false,
			paymentSelect: {},
			showModalConfirm: false,
			viewMessage: false,
			viewMessageError: false,
			message: "",
			tableReady: false,
			tableOperations: [],
			listItemHistorial: [],
			idOperationSelected: "",
			activeIndexOne: true,
			activeIndexTwo: false,
			activeIndexThree: false,
			showModalTerm: false,
			dataToPdf: [],
			ticket: "",
			hour: "",
			dateOperation: "",
			amountFiat: "",
			comission: "",
			taseVat: "",
			tax: 0,
			currencyComission: "",
			currencyVat: "",
			chargesByOperation: [],
		};
		this.openModalSendPayment = this.openModalSendPayment.bind(this);
		this.detailsOperation = this.detailsOperation.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	handleShowTermAndCondicionModal() {
		this.setState({ showModalTerm: true });
	}
	handleCloseModalTerm() {
		this.setState({ showModalTerm: false });
	}
	componentDidMount() {
		this.getBalanceBroker();
		this.getOperations();
	}
	handleClick(e, titleProps) {
		this.setState({ activeIndexOne: !this.state.activeIndexOne });
	}
	handleClickTwo(e, titleProps) {
		this.setState({ activeIndexTwo: !this.state.activeIndexTwo });
	}
	handleClickThree(e, titleProps) {
		this.setState({ activeIndexThree: !this.state.activeIndexThree });
	}
	getPayments(method) {
		let user = sessionStorage.getItem("username");
		let currency = this.state.currencyToSend;
		otc
			.getPayments(currency, user)
			.then((resp) => {
				let arrayPayment = [];
				let id = "";
				let bank = "";
				let accountNumber = "";
				let accountHolderName = "";
				let currency = currency;
				let item = {
					key: "create",
					value: "create",
					text: this.state.translator("buy.form.fields.createPaymentMethod"),
				};
				arrayPayment.push(item);
				for (let i = 0; i < resp.data.length; i++) {
					let payment = {};
					Object.entries(resp.data[i]).forEach(([key, value]) => {
						if (key === "bank") {
							bank = value;
						} else if (key === "accountNumber") {
							accountNumber = value;
						} else if (key === "accountHolderName") {
							accountHolderName = value;
						} else if (key === "id") {
							id = value;
						}
					});
					if (method === "OWN") {
						if (resp.data[i].verified !== undefined) {
							payment.key = id;
							payment.value = id;
							payment.text =
								bank + " - " + accountNumber + " - " + accountHolderName;

							arrayPayment.push(payment);
						}
					} else {
						if (resp.data[i].verified === undefined) {
							payment.key = id;
							payment.value = id;
							payment.text =
								bank + " - " + accountNumber + " - " + accountHolderName;

							arrayPayment.push(payment);
						}
					}
				}
				this.setState({ listPayments: arrayPayment });
			})
			.catch((error) => {});
	}
	getBalanceBroker() {
		this.setState({ load: true });
		brokerService
			.getBalance(sessionStorage.getItem("username"))
			.then((resp) => {
				let arrayBalance = [];
				for (let val of resp.data) {
					arrayBalance.push(val);
				}
				this.setState({ balanceByCurrency: arrayBalance }, () => {
					this.setState({ load: false });
				});
			})
			.catch((error) => {});
	}
	getOperations() {
		let body = {
			userName: null,
			currency: null,
			otcOperationType: null,
			otcOperationStatus: null,
			brokerUserName: sessionStorage.getItem("username"),
			specialIndexes: {},
		};
		otc
			.getOperations(body)
			.then((resp) => {
				let operation = resp.data;
				var tableOperationsToShow = [];
				for (let i = 0; i < operation.length; i++) {
					let objOperationBroker = {};
					objOperationBroker.id = operation[i].id;
					objOperationBroker.idToShow = operation[i].id.slice(-4);
					objOperationBroker.date = this.formatDate(
						new Date(operation[i].timestamp),
					);
					objOperationBroker.currency = operation[i].currency;
					let currency = objOperationBroker.currency;
					let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
						return c.key === currency;
					})[0];
					if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
						objOperationBroker.flag = currencyCurrent.flag;
					} else if(currency === "ETH") {
						objOperationBroker.src = Eth;
					} else if(currency === "USDT") {
						objOperationBroker.src = Tether;
					}

					objOperationBroker.amount = operation[i].amount;
					objOperationBroker.clientPayment = operation[i].clientPayment;
					objOperationBroker.operationType = operation[i].otcOperationType;
					objOperationBroker.status = operation[i].otcOperationStatus;
					objOperationBroker.price = operation[i].price;
					objOperationBroker.charges = operation[i].charges;
					objOperationBroker.description = operation[i].description;
					if (operation[i].price !== undefined) {
						objOperationBroker.amountBTC =
							operation[i].amount / operation[i].price;
					} else {
						objOperationBroker.amountBTC = null;
					}
					tableOperationsToShow.push(objOperationBroker);
				}
				if (resp.data.length > 0) {
					this.detailsOperation(resp.data[0].id);
				} else {
					this.setState({
						ceroOperations: true,
					});
				}
				this.setState({
					tableOperations: tableOperationsToShow,
					tableReady: true,
				});
			})
			.catch((error) => {});
	}
	openModalSendPayment(currency, amount) {
		this.setState({
			showModalSendPayment: true,
			currencyToSend: currency,
			balanceAvailable: amount,
		});
	}
	closeModalSend() {
		this.setState({
			showModalSendPayment: false,
			viewForm: false,
			listPayments: [],
			paymentMethodSelect: "",
			currencyToSend: "",
			descriptionToSend: "",
			amountToSend: "",
		});
	}
	openModalConfirm() {
		//console.log(this.state.amountToSend.toString(), "amount TO send");
		// if (
		// 	this.state.amountToSend.toString() !== "NaN" &&
		// 	this.state.amountToSend !== null &&
		// 	this.state.amountToSend !== undefined &&
		// 	this.state.amountToSend !== ""
		// ) {
		this.getCharges();
		this.setState({ showModalConfirm: true });
		//}
	}
	closeModalConfirm() {
		this.setState({ showModalConfirm: false });
	}
	pickPaymentMethodSelect(e, data) {
		this.setState({ paymentMethodSelect: data.value });
		if (data.value === "create") {
			this.setState({ viewAdd: true, viewForm: false });
		} else {
			this.getClientPayment(data.value);
			this.setState({ viewForm: true });
		}
	}
	getClientPayment(id) {
		otc
			.getClientPayment(id, sessionStorage.getItem("username"))
			.then((resp) => {
				this.setState({
					paymentSelect: resp.data,
				});
			})
			.catch((error) => {});
	}
	pickPaymentMethod(e, data) {
		this.getPayments(data.value);
		this.setState({
			optionPaymentMethod: data.value,
			listPayments: [],
			paymentMethodSelect: "",
			viewForm: false,
		});
	}
	changeForm(type) {
		if (type === "OWN") {
			this.setState({ verification: true });
		} else {
			this.setState({ verification: true });
		}
	}
	backFormSendToPayments(method) {
		this.getPayments(method);
		this.setState({ viewForm: true });
	}
	getCharges() {
		let bodyCharges = {
			currency: this.state.currencyToSend,
			amount: parseFloat(this.state.amountToSend),
			btcPrice: null,
			operationType: "BROKER_SEND_TO_PAYMENT",
			paymentType: this.state.paymentSelect.type,
		};
		if (
			bodyCharges.amount > 0 &&
			bodyCharges.amount !== null &&
			bodyCharges.amount !== undefined &&
			bodyCharges.amount.toString() !== "NaN"
		) {
			otc
				.getChargesByOperation(bodyCharges)
				.then((resp) => {
					console.log(resp.data);
					let charges = [];
					Object.entries(resp.data).forEach(([key, value]) => {
						if (key === "VAT") {
							charges.push({
								label: this.state.translator("buy.modalConfirm.charges.VAT"),
								value: value.amount + " " + value.currency,
							});
						} else if (key === "COMMISSION") {
							charges.push({
								label: this.state.translator(
									"buy.modalConfirm.charges.COMMISSION",
								),
								value: value.amount + " " + value.currency,
							});
						} else {
							charges.push({
								label: key,
								value: value.amount + " " + value.currency,
							});
						}
					});
					this.setState({ chargesByOperation: charges });
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log("error del amount");

			this.setState({
				viewMessageError: true,
				message: "broker.balanceOption.message.noBalance",
			});
			setTimeout(() => {
				this.setState({
					viewMessageError: false,
					message: "",
				});
			}, 5000);
		}
	}
	sendToPayment() {
		let body = {
			userName: sessionStorage.getItem("username"),
			currency: this.state.currencyToSend,
			description: this.state.descriptionToSend,
			amount: this.state.amountToSend,
			payment: this.state.paymentSelect,
			paymentType: null,
		};
		brokerService
			.sendToPaymentMethod(body)
			.then((resp) => {
				if (resp.data === "THERE IS NO OFFER TO THIS CURRENCY") {
					this.setState({
						viewMessageError: true,
						message: "broker.balanceOption.message.noOffer",
					});
					setTimeout(() => {
						this.setState({
							viewMessageError: false,
							message: "",
						});
					}, 5000);
				} else if (
					resp.data === "THERE IS NO DOLLARBTC SEND TO PAYMENT TO THIS CURRENCY"
				) {
					this.setState({
						viewMessageError: true,
						message: "broker.balanceOption.message.errorOperation",
					});
					setTimeout(() => {
						this.setState({
							viewMessageError: false,
							message: "",
						});
					}, 5000);
				} else if (
					resp.data === "AMOUNT MUST BE BETWEEN 100.0 AND 5000.0 USD"
				) {
					this.setState({
						viewMessageError: true,
						message: "broker.balanceOption.message.errorAmount",
					});
					setTimeout(() => {
						this.setState({
							viewMessageError: false,
							message: "",
						});
					}, 5000);
				} else if (resp.data === "USER HAS NO BALANCE") {
					this.setState({
						viewMessageError: true,
						message: "broker.balanceOption.message.noBalance",
					});
					setTimeout(() => {
						this.setState({
							viewMessageError: false,
							message: "",
						});
					}, 5000);
				} else if (resp.data === "DOES NOT HAVE ENOUGH BALANCE") {
					this.setState({
						viewMessageError: true,
						message: "broker.balanceOption.message.noBalance",
					});
					setTimeout(() => {
						this.setState({
							viewMessageError: false,
							message: "",
						});
					}, 5000);
				} else {
					let body = {
						userName: sessionStorage.getItem("username"),
						currency: this.state.currencyToSend,
						description: this.state.descriptionToSend,
						amount: this.state.amountToSend,
						payment: this.state.paymentSelect,
						paymentType: resp.data,
					};
					brokerService
						.sendToPaymentMethod(body)
						.then((res) => {
							console.log(res.data);
							if (res.data === "DOES NOT HAVE ENOUGH BALANCE") {
								this.setState({
									viewMessageError: true,
									message: "broker.balanceOption.message.noBalance",
								});
								setTimeout(() => {
									this.setState({
										showModalConfirm: false,
										viewMessageError: false,
										message: "",
									});
								}, 5000);
							} else {
								this.setState(
									{
										showModalConfirm: false,
										viewMessage: true,
										message: "broker.balanceOption.message.success",
									},
									() => {
										this.getBalanceBroker();
									},
								);
								setTimeout(() => {
									this.setState({
										viewMessage: false,
										message: "",
									});
									this.closeModalSend();
								}, 5000);
							}
						})
						.catch((err) => {});
				}
			})
			.catch((error) => {});
	}
	handleDescription(e, data) {
		this.setState({ descriptionToSend: data.value });
	}
	formatDate(date) {
		let regi = "es-ES";
		let cad = "";
		var options = {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			hour12: "true",
		};
		let data = date.toLocaleString(regi, options);
		if (regi === "es-ES") {
			data = data.split(" ");
			let day = data[0];
			let month = data[1];
			data[0] = month;
			data[1] = day;

			for (date of data) {
				cad = cad + " " + date;
			}
		} else {
			cad = data;
		}

		return cad;

		// lunes, 26 de diciembre de 2050 9 a. m.
	}
	printInvoice() {
		let doc = new jsPDF();

		doc.addFont("Montserrat");
		doc.setFontSize(20);
		doc.text(60, 20, this.state.translator("sell.mySells.bill.pdfHeader"));
		let x = 20,
			y = 40;
		doc.setFontSize(12);
		for (let data of this.state.dataToPdf) {
			doc.text(data.label + ":" + " " + data.value, x, y);
			y = y + 10;
		}
		//  doc.addImage(ima, "PNG", 10, 40, 180, 180);
		doc.save("Factura.pdf");
	}
	formatTime(timeValue, format) {
		var fmt = format.toUpperCase();
		var re = /^(H|HH)(:MM)(:SS)?( AM)?$/;
		if (!re.test(fmt)) {
			fmt = "H:MM AM";
		}
		var MM = "0" + timeValue.getMinutes();
		MM = MM.substring(MM.length - 2, MM.length);
		var SS = "0" + timeValue.getSeconds();
		SS = SS.substring(SS.length - 2, SS.length);
		var H = "" + timeValue.getHours();
		var HH = "0" + H;
		HH = HH.substring(HH.length - 2, HH.length);
		var meridian = "";
		if (fmt.indexOf(" AM") !== -1) {
			meridian = "AM";
			if (HH === "00") {
				HH = "12";
			}
			if (HH === "12") {
				meridian = "PM";
			}
			if (parseInt(HH, 10) > 12) {
				meridian = "PM";
				var hrs = parseInt(HH, 10) - 12;
				H = "" + hrs;
				HH = "0" + H;
				HH = HH.substring(HH.length - 2, HH.length);
			}
		}

		var result = "";
		if (fmt.indexOf("HH") === -1) {
			result += H + ":" + MM;
		} else {
			result += HH + ":" + MM;
		}
		if (fmt.indexOf("SS") !== -1) {
			result += ":" + SS;
		}
		if (fmt.indexOf(" AM") !== -1) {
			result += " " + meridian;
		}
		return result;
	}
	detailsOperation(idOperation) {
		this.setState({ idOperationSelected: idOperation });
		otc
			.getOperation(idOperation)
			.then((res) => {
				let infoOperation = res.data;
				let arrayItem = [];
				let array = [];
				array.push({
					label: this.state.translator("sell.mySells.bill.ticket"),
					value: res.data.id,
				});
				array.push({
					label: this.state.translator("sell.mySells.bill.time"),
					value: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
				});
				array.push({
					label: this.state.translator("sell.mySells.bill.date"),
					value: res.data.timestamp.split("T")[0],
				});
				array.push({
					label:
						this.state.translator("sell.mySells.bill.amountIn") +
						res.data.currency,
					value: res.data.amount.toLocaleString("en-US", {
						maximumFractionDigits: 2,
					}),
				});
				if (infoOperation.clientPayment !== undefined) {
					if (
						infoOperation.clientPayment.type !== "TRANSFER_TO_CRYPTO_WALLET"
					) {
						array.push({
							label: this.state.translator("sell.mySells.bill.amountBTC"),
							value: (res.data.amount / res.data.price).toLocaleString(
								"en-US",
								{
									maximumFractionDigits: 8,
								},
							),
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.appliedRate"),
							value: res.data.price.toLocaleString("en-US", {
								maximumFractionDigits: 2,
							}),
						});
						this.setState({
							amountBTC: (res.data.amount / res.data.price).toLocaleString(
								"en-US",
								{
									maximumFractionDigits: 8,
								},
							),
							price: res.data.price.toLocaleString("en-US", {
								maximumFractionDigits: 2,
							}),
							isCrypto: false,
							bankRate: 0,

							issuingBank:
								res.data.clientPayment !== undefined
									? res.data.clientPayment.bank
									: "",
							nameOfThePayer:
								res.data.dollarBTCPayment !== undefined &&
								res.data.dollarBTCPayment !== null &&
								res.data.dollarBTCPayment.accountHolderName !== undefined
									? res.data.dollarBTCPayment.accountHolderName
									: "",
							bankDollarBTC:
								res.data.dollarBTCPayment !== undefined &&
								res.data.dollarBTCPayment !== null &&
								res.data.dollarBTCPayment.bank !== undefined
									? res.data.dollarBTCPayment.bank
									: "",
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.issuingBank"),
							value:
								res.data.dollarBTCPayment !== undefined &&
								res.data.dollarBTCPayment !== null &&
								res.data.dollarBTCPayment.bank !== undefined
									? res.data.dollarBTCPayment.bank
									: "",
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.namePayer"),
							value:
								res.data.dollarBTCPayment !== undefined &&
								res.data.dollarBTCPayment !== null &&
								res.data.dollarBTCPayment.accountHolderName !== undefined
									? res.data.dollarBTCPayment.accountHolderName
									: "",
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.receivingBank"),
							value:
								res.data.clientPayment !== undefined
									? res.data.clientPayment.bank
									: "",
						});
						if (infoOperation.charges !== undefined) {
							Object.entries(infoOperation.charges).forEach(
								([chargeKey, chargeValue]) => {
									if (chargeKey === "COMMISSION") {
										array.push({
											label: this.state.translator(
												"dynamicForm.labels.commission",
											),
											value: chargeValue.amount + " " + chargeValue.currency,
										});
										this.setState({
											comissionSell: chargeValue.amount,
											currencyComission: chargeValue.currency,
										});
									}
									if (chargeKey === "VAT") {
										array.push({
											label: this.state.translator("dynamicForm.labels.vat"),
											value: chargeValue.amount + " " + chargeValue.currency,
										});
										this.setState({
											taseVat: chargeValue.amount,
											currencyVat: chargeValue.currency,
										});
									}
								},
							);
						}
						this.setState({ dataToPdf: array });
					} else {
						this.setState({
							isCrypto: true,
							amountBTC: (res.data.amount * res.data.price).toLocaleString(
								"en-US",
								{
									maximumFractionDigits: 8,
								},
							),
							price: res.data.price,
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.amountBTC"),
							value: (res.data.amount * res.data.price).toLocaleString(
								"en-US",
								{
									maximumFractionDigits: 8,
								},
							),
						});
						array.push({
							label: this.state.translator("sell.mySells.bill.appliedRate"),
							value: res.data.price.toLocaleString("en-US", {
								maximumFractionDigits: 8,
							}),
						});
						if (infoOperation.charges !== undefined) {
							Object.entries(infoOperation.charges).forEach(
								([chargeKey, chargeValue]) => {
									if (chargeKey === "COMMISSION") {
										array.push({
											label: this.state.translator(
												"dynamicForm.labels.commission",
											),
											value: chargeValue.amount + " " + chargeValue.currency,
										});
										this.setState({
											comissionSell: chargeValue.amount,
											currencyComission: chargeValue.currency,
										});
									}
									if (chargeKey === "VAT") {
										array.push({
											label: this.state.translator("dynamicForm.labels.vat"),
											value: chargeValue.amount + " " + chargeValue.currency,
										});
										this.setState({
											taseVat: chargeValue.amount,
											currencyVat: chargeValue.currency,
										});
									}
								},
							);
						}
						this.setState({ dataToPdf: array });
					}
				}
				Object.entries(infoOperation.clientPayment).forEach(([key, val]) => {
					if (
						key !== "id" &&
						key !== "messages" &&
						key !== "type" &&
						key !== "active" &&
						key !== "acceptIn" &&
						key !== "acceptOut" &&
						key !== "joinField" &&
						key !== "automaticCharge" &&
						key !== "currency" &&
						key !== "accountStatus" &&
						key !== "accountCurrency" &&
						key !== "accountBalance" &&
						key !== "automatic" &&
						key !== "verified" &&
						key !== "sendToPayments" &&
						key !== "buyBalance"
					) {
						arrayItem.push([key, val]);
					}
				});
				if (infoOperation.description === "") {
					arrayItem.push([
						"description",
						"dynamicForm.labels.descriptionContent",
					]);
				} else {
					arrayItem.push(["description", infoOperation.description]);
				}
				Object.entries(infoOperation.charges).forEach(
					([keyCharges, valCharges]) => {
						if (keyCharges === "COMMISSION") {
							arrayItem.push([
								"commission",
								valCharges.amount + " " + valCharges.currency,
							]);
						}
						if (keyCharges === "VAT") {
							arrayItem.push([
								"vat",
								valCharges.amount + " " + valCharges.currency,
							]);
						}
					},
				);
				this.setState({
					listItemHistorial: arrayItem,
					operationStatusNow: res.data.otcOperationStatus,
					currency: res.data.currency,
					ticket: res.data.id,
					hour: this.formatTime(new Date(res.data.timestamp), "HH:MM:SS AM"),
					dateOperation: res.data.timestamp.split("T")[0],
					amountFiat: res.data.amount.toLocaleString("en-US", {
						maximumFractionDigits: 2,
					}),
				});
			})
			.catch((error) => {});
	}
	render() {
		console.log(this.state.amountToSend);
		let t = this.state.translator;
		let messageSuccess, messageError;
		if (this.state.viewMessage) {
			messageSuccess = <Message success>{t(this.state.message)}</Message>;
		}
		if (this.state.viewMessageError) {
			messageError = <Message negative>{t(this.state.message)}</Message>;
		}
		let statusLabel = (status) => {
			if (status === "SUCCESS") {
				let value = "broker.balanceOption.tableHeaders.statusValues.success";
				return (
					<Label size='mini' color='green'>
						<Icon name='check circle' />
						{t(value)}
					</Label>
				);
			} else if (status === "WAITING_FOR_PAYMENT") {
				let value =
					"broker.balanceOption.tableHeaders.statusValues.waitingPayment";
				return (
					<Label size='mini' color='blue'>
						<Icon name='sync' loading />
						{t(value)}
					</Label>
				);
			} else if (status === "CANCELED") {
				let value = "broker.balanceOption.tableHeaders.statusValues.canceled";
				return (
					<Label size='mini' color='red'>
						<Icon name='warning circle' />
						{t(value)}
					</Label>
				);
			} else if (status === "PAY_VERIFICATION") {
				let value =
					"broker.balanceOption.tableHeaders.statusValues.payVerification";
				return (
					<Label size='mini' color='orange'>
						<Icon name='info' />
						{t(value)}
					</Label>
				);
			} else if (status === "CLAIM") {
				let value = "broker.balanceOption.tableHeaders.statusValues.claim";
				return (
					<Label size='mini' color='grey'>
						<Icon name='info' />
						{t(value)}
					</Label>
				);
			} else {
				return (
					<Label size='mini' color='grey'>
						<Icon name='info' />
						{status}
					</Label>
				);
			}
		};
		const popupValues = [];
		const listDetailsOperation = [];
		this.state.listItemHistorial.forEach(([key, val]) => {
			if (key === "description") val = t(val);
			let v = t("dynamicForm.labels." + key) + ":" + "      " + val;
			popupValues.push(
				<span key={key}>
					{t("dynamicForm.labels." + key) + ":" + "      " + val}
					<br />
				</span>,
			);

			let size = v.length;
			if (size > 45 || window.innerWidth < 400) {
				v = v.substring(0, 45);
				v = v + "...";
				listDetailsOperation.push(
					<span key={key}>
						{v}
						<br />
					</span>,
				);
			} else {
				listDetailsOperation.push(
					<span key={key}>
						{t("dynamicForm.labels." + key) + ":" + "      " + val}
						<br />
					</span>,
				);
			}
		});
		const data = this.state.tableOperations;
		const transactionTableHeaders = [
			{
				Header: "ID",
				accessor: "idToShow",
				minWidth: 50,
				filterable: true,
			},
			{
				Header: t("broker.balanceOption.tableHeaders.date"),
				accessor: "date",
				width: 100,
			},
			{
				Header: t("broker.balanceOption.tableHeaders.currency"),
				accessor: "currency",
				minWidth: 70,
				Cell: (row) => (
					<div>
						{row.value !== "ETH" && row.value !== "USDT" && <Flag name={row.original.flag} />}
						{(row.value === "ETH" || row.value === "USDT") && <Image src={row.original.src} />}
						{row.value}
					</div>
				),
			},
			{
				Header: t("broker.balanceOption.tableHeaders.price"),
				accessor: "price",
				width: 80,
				getProps: () => {
					return {
						style: {
							textAlign: "left",
						},
					};
				},
				Cell: (row) => {
					return row.value.toLocaleString("en-US", {
						maximumFractionDigits: 2,
					});
				},
			},
			{
				Header: t("broker.balanceOption.tableHeaders.amount"),
				accessor: "amount",
				width: 80,
				getProps: () => {
					return {
						style: {
							textAlign: "left",
						},
					};
				},
				Cell: (row) => {
					return row.value.toLocaleString("en-US", {
						maximumFractionDigits: 2,
					});
				},
			},
			{
				Header: "BTC",
				accessor: "amountBTC",
				width: 90,
				getProps: () => {
					return {
						style: {
							textAlign: "left",
						},
					};
				},
				Cell: (row) => {
					return row.value.toLocaleString("en-US", {
						maximumFractionDigits: 8,
					});
				},
			},
			{
				Header: t("broker.balanceOption.tableHeaders.type"),
				accessor: "operationType",
				minWidth: 80,
				Cell: (row) => {
					if (row.value === "BUY") {
						return t("broker.balanceOption.tableHeaders.typeValue.buy");
					} else if (row.value === "SELL") {
						return t("broker.balanceOption.tableHeaders.typeValue.sell");
					} else {
						return row.value;
					}
				},
			},
			{
				Header: t("broker.balanceOption.tableHeaders.status"),
				accessor: "status",
				minWidth: 110,
				Cell: (row) => {
					return statusLabel(row.value);
				},
			},
			{
				Header: "",
				accessor: "actions",
				filterable: false,
				width: 50,
				Cell: (row) => (
					<Button
						icon='zoom-in'
						size='tiny'
						onClick={() => {
							this.detailsOperation(row.original.id);
						}}
					/>
				),
			},
		];
		return (
			<div>
				<Grid centered columns='equal'>
					<Grid.Row>
						<Grid.Column width={8}>
							<b>
								<label> {t("broker.balanceOption.balance")}</label>
							</b>
							<Segment.Group>
								{this.state.load && (
									<Dimmer active inverted>
										<Loader />
									</Dimmer>
								)}
								<Segment size='large'>
									{this.state.balanceByCurrency.length > 0 && (
										<Grid columns='equal'>
											{this.state.balanceByCurrency.map((balance) => {
												return (
													<Grid.Row
														key={balance.currency}
														style={{
															paddingTop: "8px",
															paddingBottom: "8px",
														}}>
														<Grid.Column width={6}>
															<p>{balance.currency}</p>
														</Grid.Column>
														<Grid.Column width={6} textAlign='right'>
															{balance.currency === "BTC" ? (
																<p>
																	{balance.amount.toLocaleString("en-US", {
																		maximumFractionDigits: 8,
																	})}
																</p>
															) : (
																<p>
																	{balance.amount.toLocaleString("en-US", {
																		maximumFractionDigits: 2,
																	})}
																</p>
															)}
														</Grid.Column>
														{balance.currency !== "BTC" && balance.amount > 0 && (
															<Grid.Column width={3} textAlign='right'>
																<Button
																	onClick={() =>
																		this.openModalSendPayment(
																			balance.currency,
																			balance.amount,
																		)
																	}
																	style={{ marginTop: -10 }}
																	color='blue'
																	size='tiny'
																	icon>
																	{t("broker.balanceOption.send")}
																</Button>
															</Grid.Column>
														)}
													</Grid.Row>
												);
											})}
										</Grid>
									)}
								</Segment>
							</Segment.Group>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Modal
					open={this.state.showModalSendPayment}
					onClose={this.closeModalSend.bind(this)}>
					<Modal.Header>
						{t("broker.balanceOption.sendToPayments")}
					</Modal.Header>
					<Modal.Content>
						{messageSuccess}
						<Form>
							<Grid>
								<Grid.Column columns='equal'>
									<Grid.Row>
										<Form.Group>
											<Form.Field>
												<p>
													{t("broker.balanceOption.balanceSendToPayment")}
													{"  "}
													<b>
														{this.state.currencyToSend}{" "}
														{this.state.balanceAvailable.toLocaleString(
															"en-US",
															{
																maximumFractionDigits: 2,
															},
														)}
													</b>
												</p>
											</Form.Field>
										</Form.Group>
									</Grid.Row>
									<Grid.Row>
										<Form.Group>
											<Form.Field width={8}>
												<label>
													{t("broker.balanceOption.sendToPayments")}
												</label>
												<Select
													placeholder={t("broker.balanceOption.paymenthMethod")}
													options={[
														{
															key: "OWN",
															value: "OWN",
															text: t("broker.balanceOption.own"),
														},
														{
															key: "THIRD",
															value: "THIRD",
															text: t("broker.balanceOption.thirdParties"),
														},
													]}
													onChange={this.pickPaymentMethod.bind(this)}
												/>
											</Form.Field>

											{this.state.optionPaymentMethod !== "" && (
												<Form.Field width={8}>
													<label>
														{t("broker.balanceOption.paymenthMethod")}{" "}
														{this.state.optionPaymentMethod === "OWN"
															? t("broker.balanceOption.own")
															: t("broker.balanceOption.thirdParties")}
													</label>
													<Select
														disabled={this.state.listPayments.length === 0}
														placeholder={t(
															"broker.addOfferOption.selectTypeOfPayment",
														)}
														options={this.state.listPayments}
														value={this.state.paymentMethodSelect}
														onChange={this.pickPaymentMethodSelect.bind(this)}
													/>
												</Form.Field>
											)}
										</Form.Group>
									</Grid.Row>
									{this.state.paymentMethodSelect === "create" &&
										this.state.optionPaymentMethod === "OWN" &&
										!this.state.verification && (
											<AddOwnAccount
												addAccount={this.state.viewAdd}
												changeStatusForm={this.changeForm.bind(this)}
											/>
										)}
									{this.state.paymentMethodSelect === "create" &&
										this.state.optionPaymentMethod === "THIRD" &&
										!this.state.verification && (
											<AddAccount
												backForm={this.backFormSendToPayments.bind(this)}
												addAccount={this.state.viewAdd}
												changeStatusForm={this.changeForm.bind(this)}
											/>
										)}
									{this.state.verification &&
										!this.state.viewForm &&
										this.state.optionPaymentMethod === "OWN" && (
											<WaitingVerification
												backForm={this.backFormSendToPayments.bind(this)}
												addAccount={this.state.viewAdd}
											/>
										)}
									{this.state.viewForm && (
										<Grid.Row>
											<Form.Group widths='equal'>
												<Form.Field>
													<label>{t("broker.balanceOption.amount")}</label>
													<NumberFormat
														value={this.state.amountToSend}
														placeholder={t("broker.balanceOption.amount")}
														thousandSeparator={true}
														decimalScale={2}
														fixedDecimalScale={true}
														onValueChange={(values) => {
															const { value } = values;
															this.setState({
																amountToSend: parseFloat(value),
															});
														}}
														suffix={
															"   " + this.state.currencyToSend.toUpperCase()
														}
													/>
												</Form.Field>
												<Form.Field>
													<label>{t("broker.balanceOption.description")}</label>
													<Input
														fluid
														placeholder={t("broker.balanceOption.description")}
														onChange={this.handleDescription.bind(this)}
													/>
												</Form.Field>
											</Form.Group>
										</Grid.Row>
									)}
								</Grid.Column>
							</Grid>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.closeModalSend.bind(this)} color='blue'>
							<Icon name='remove' /> {t("broker.balanceOption.cancel")}
						</Button>

						<Button
							onClick={this.openModalConfirm.bind(this)}
							disabled={
								!this.state.viewForm ||
								this.state.amountToSend === "" ||
								this.state.amountToSend.toString() === "NaN" ||
								this.state.amountToSend === 0
							}
							color='blue'>
							<Icon name='checkmark' /> {t("broker.balanceOption.send")}
						</Button>
					</Modal.Actions>
				</Modal>
				<Modal
					open={this.state.showModalConfirm}
					onClose={this.closeModalConfirm.bind(this)}>
					<Modal.Header>
						{t("broker.balanceOption.sendToPayments")}
					</Modal.Header>
					<Modal.Content>
						{messageError}
						{t("broker.balanceOption.messageConfirmation")}{" "}
						<b>
							{this.state.amountToSend} {this.state.currencyToSend}
						</b>{" "}
						{t("broker.balanceOption.messageConfirmation1")}{" "}
						<b>
							{this.state.paymentMethodSelect.slice(-4)}
							{" - "} {this.state.paymentSelect.bank}
							{" - "}
							{this.state.paymentSelect.accountHolderName}{" "}
						</b>
						?
						{this.state.chargesByOperation.length !== 0 && (
							<div>
								<Divider />
								<h4>{t("buy.modalConfirm.charges.header")}</h4>
							</div>
						)}
						{this.state.chargesByOperation.length !== 0 &&
							this.state.chargesByOperation.map((item, index) => (
								<div>
									<span>
										{item.label}
										{item.value}
									</span>
								</div>
							))}
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.closeModalConfirm.bind(this)} color='blue'>
							<Icon name='remove' /> {t("broker.balanceOption.cancel")}
						</Button>
						<Button onClick={this.sendToPayment.bind(this)} color='blue'>
							<Icon name='checkmark' /> {t("broker.balanceOption.confirm")}
						</Button>
					</Modal.Actions>
				</Modal>
				<Modal
					open={this.state.showModalTerm}
					onClose={this.handleCloseModalTerm.bind(this)}>
					<Modal.Header>{t("sell.mySells.modalTerms.header")}</Modal.Header>
					<Modal.Content>
						<Modal.Description>
							<Message info>
								<TermsAndConditions />
							</Message>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleCloseModalTerm.bind(this)} color='grey'>
							{t("sell.mySells.modalTerms.buttonClose")}
						</Button>
					</Modal.Actions>
				</Modal>
				<Divider hidden />
				{!this.state.tableReady && (
					<Dimmer active inverted>
						<Loader inverted>{t("wallet.tx.loading")}</Loader>
					</Dimmer>
				)}
				<Grid>
					<Grid.Row>
						<Grid.Column
							largeScreen={12}
							tablet={16}
							mobile={16}
							computer={12}
							widescreen={12}
							style={{ marginRight: -20 }}>
							<ReactTable
								defaultSorted={[
									{
										id: "date",
										desc: true,
									},
								]}
								style={{ fontSize: 12, minHeight: 277 }}
								className='transactionTable'
								data={data}
								columns={transactionTableHeaders}
								defaultPageSize={5}
								previousText={t("broker.balanceOption.table.previous")}
								nextText={t("broker.balanceOption.table.next")}
								loadingText={t("broker.balanceOption.table.loading")}
								noDataText={t("broker.balanceOption.table.noData")}
								pageText={t("broker.balanceOption.table.page")}
								ofText={t("broker.balanceOption.table.of")}
								rowsText={t("broker.balanceOption.table.rows")}
								pageJumpText={t("broker.balanceOption.table.pageJump")}
								rowsSelectorText={t("broker.balanceOption.table.rowsSelector")}
								minRow={8}
							/>
						</Grid.Column>
						<Grid.Column
							mobile={16}
							largeScreen={4}
							tablet={16}
							computer={4}
							widescreen={4}>
							<div
								style={{ marginRight: -20 }}
								hidden={this.state.ceroOperations}>
								<Accordion
									fluid
									styled
									exclusive={false}
									// style={
									//   isMobile === true
									//     ? { backgroundColor: "whitesmoke" }
									//     : {}
									// }
								>
									<Accordion.Title
										// style={
										//   isMobile === true
										//     ? { color: "black" }
										//     : {}
										// }
										active={this.state.activeIndexOne}
										index={0}
										onClick={this.handleClick.bind(this)}>
										<Icon name='dropdown' />
										{t("sell.mySells.accordion.details")}
									</Accordion.Title>
									<Accordion.Content active={this.state.activeIndexOne}>
										<Grid>
											<Grid.Row
												columns={2}
												verticalAlign='middle'
												textAlign='left'>
												<span style={{ marginLeft: 20 }}>
													{t("sell.mySells.accordion.operation")} #:{" "}
													<strong>
														{this.state.idOperationSelected.slice(-4)}
													</strong>
												</span>
											</Grid.Row>
										</Grid>

										{/* <div>
                                      <label className="ui compact">
                                        {this.state.paymentType}
                                      </label>
                                    </div> */}
										{/* <Message info>
                                    {this.state.listItemHistorial}
                                  </Message> */}
										<Popup
											trigger={
												<span>
													<Message info size={"small"}>
														{listDetailsOperation}
													</Message>
												</span>
											}
											content={popupValues}
											position='top center'
											size='small'
											wide
										/>
									</Accordion.Content>
									<Accordion.Title
										active={this.state.activeIndexTwo}
										index={1}
										onClick={this.handleClickTwo.bind(this)}>
										<Icon name='dropdown' />
										{t("sell.mySells.accordion.terms")}
									</Accordion.Title>
									<Accordion.Content active={this.state.activeIndexTwo}>
										<Message info size='small'>
											{" "}
											{term.ters.item1.slice(0, 25)}
											<a
												className='linkVerMas'
												onClick={this.handleShowTermAndCondicionModal.bind(
													this,
												)}>
												{t("sell.mySells.accordion.seeMore")}
											</a>
										</Message>
									</Accordion.Content>
									{this.state.operationStatusNow === "SUCCESS" && (
										<Accordion.Title
											active={this.state.activeIndexThree}
											index={2}
											onClick={this.handleClickThree.bind(this)}>
											<Icon name='dropdown' />
											{t("sell.mySells.accordion.digitalBill")}
										</Accordion.Title>
									)}
									<Accordion.Content active={this.state.activeIndexThree}>
										<Message info size={"small"}>
											<div>
												<label>{t("sell.mySells.bill.ticket")}: </label>
												{this.state.ticket.substring(0, 20) + "..."}
											</div>
											<div>
												<label>{t("sell.mySells.bill.date")}: </label>
												{this.state.dateOperation}
											</div>
											<div>
												<label>{t("sell.mySells.bill.time")}: </label>
												{this.state.hour}
											</div>
											<div>
												<label>{t("sell.mySells.bill.amountBTC")}: </label>
												{this.state.amountBTC}
											</div>
											<div>
												<label>
													{t("sell.mySells.bill.amountIn")}
													{this.state.currencySell} :{" "}
												</label>
												{this.state.amountFiat}
											</div>
											<div>
												<label>{t("sell.mySells.bill.appliedRate")}: </label>
												{this.state.price}
											</div>
											{this.state.taseVat !== "" && (
												<div>
													<label>{t("dynamicForm.labels.vat")}: </label>
													{this.state.taseVat + " " + this.state.currencyVat}
												</div>
											)}
											{this.state.comissionSell !== "" && (
												<div>
													<label>{t("dynamicForm.labels.commission")}: </label>
													{this.state.comissionSell +
														" " +
														this.state.currencyComission}
												</div>
											)}
											{!this.state.isCrypto && (
												<span>
													{" "}
													<div>
														<label>
															{t("sell.mySells.bill.issuingBank")}:{" "}
														</label>
														{this.state.bankDollarBTC}
													</div>
													<div>
														<label>{t("sell.mySells.bill.namePayer")}: </label>
														{this.state.nameOfThePayer}
													</div>
													<div>
														<label>
															{t("sell.mySells.bill.receivingBank")}:{" "}
														</label>
														{this.state.issuingBank}
													</div>
												</span>
											)}
											<br />
											<Header textAlign='center'>
												<Button
													color='blue'
													content={t("sell.mySells.accordion.buttonDownload")}
													onClick={this.printInvoice.bind(this)}
												/>
											</Header>
										</Message>
									</Accordion.Content>
								</Accordion>
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}
export default translate(BalanceBroker);
