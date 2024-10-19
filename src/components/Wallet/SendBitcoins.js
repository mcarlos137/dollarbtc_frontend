import React, { Component } from "react";
import userService from "../../services/user";
import otcService from "../../services/otc";
import {
	Button,
	Container,
	Dimmer,
	Divider,
	Icon,
	Dropdown,
	Label,
	Loader,
	Segment,
	Message,
	Grid,
	Form,
	Modal,
	Accordion,
	List,
} from "semantic-ui-react";
import translate from "../../i18n/translate";
import util from "../../services/utils";
import WAValidator from "wallet-address-validator";
import { isMobile } from "react-device-detect";
import NumberFormat from "react-number-format";
class SendBitcoins extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "",
			amount: "",
			code: "",
			address: "",
			description: "",
			errorAddress: false,
			errorAmount: false,
			errorDescription: false,
			walletBalanceBTC: 0,
			toVerifiedWalletBalanceBTC: 0,
			showSendBTC: false,
			openSendConfirm: false,
			openSendConfirm2: false,
			amountAndComission: 0,
			sended: false,
			notsended: false,
			sendSuccess: false,
			sendError: false,
			disableContinue: false,
			maxAvailableToSend: 0,
			verifyToken: "",
			showTokenExpirated: false,
			showTokenNotFound: false,
			loadingSending: false,
			activeIndexAccordion: 0,
			translator: props.translate,
			addressActual: [],
			phoneVerified:
				window.sessionStorage.getItem("phoneVerified") === "true"
					? true
					: false,
			chargesAmounts: [],
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
		let username = userService.getUserName();
		let config = userService.getConfigUserGeneral(username);
		let address = [];
		config.then((resp) => {
			if (resp.data.result.wallets !== undefined) {
				let old = resp.data.result.wallets.old;
				let current = Object.values(resp.data.result.wallets.current).map(
					(w) => {
						return w.address;
					},
				)[0];
				address = Object.keys(old).map((key) => {
					return old[key].address;
				});
				address.push(current);
			} else {
				let add = resp.data.result.address;
				address.push(add);
			}
			this.setState({ addressActual: address });
		});
		this.getWalletBalanceDBC();
		//	console.log("dentro del didmount");
		//	this.transactionUpTo(this.state.walletBalanceBTC);
	}

	getWalletBalanceDBC = function () {
		this.setState({ showSendBTC: false });
		var availableAmounts = [];
		var toVerifiedAmounts = [];
		userService
			.getBalanceUser(userService.getUserName())
			.then((resp) => {
				availableAmounts = resp.data.result.availableAmounts;
				toVerifiedAmounts = resp.data.result.deferredAmounts;
				for (var i = 0; i < availableAmounts.length; i++) {
					if (availableAmounts[i].currency === "BTC") {
						this.setState({
							walletBalanceBTC: this.floorDecimals(
								availableAmounts[i].amount,
								8,
							),
						});
					}
				}
				for (var j = 0; j < toVerifiedAmounts.length; j++) {
					if (toVerifiedAmounts[j].currency === "BTC") {
						this.setState({
							toVerifiedWalletBalanceBTC: this.floorDecimals(
								toVerifiedAmounts[j].amount,
								8,
							),
						});
					}
				}
				// console.log(
				// 	"dentro del getWalletBalanceDBC y ejecutando el transactionUpTo",
				// );
				this.transactionUpTo(this.state.walletBalanceBTC); //, this.transactionFee
				this.setState({ showSendBTC: true });
			})
			.catch((error) => {
				//////console.log(error);
			});
	};
	transactionFee = 0.00005;
	transactionUpTo = (walletBalance) => {
		//, transactionFee
		var maxToSend = walletBalance;
		if (maxToSend !== null && maxToSend !== undefined) {
			if (maxToSend <= 0) {
				this.setState(
					{ maxAvailableToSend: 0 },
					() => console.log("el amount es cero ERROR! "),
					//	this.getComissionToOperation(this.state.maxAvailableToSend),
				);
			} else {
				this.setState({ maxAvailableToSend: maxToSend }, () =>
					this.getComissionToOperation(this.state.maxAvailableToSend),
				);
			}
		} else {
			console.log("error del else");
			this.setState({
				errorForm: true,
				message: "registration.errors.unexpectedError",
			});
			setTimeout(() => {
				this.setState({
					errorForm: false,
					message: "",
				});
			}, 5000);
		}
	};
	handleAmount = (e) => {
		if (e.target.value !== "") {
			if (util.validateNumber(e.target.value, this.state.amount)) {
				let number = Number(e.target.value);
				if (number >= 0) {
					this.setState({ amount: e.target.value });
				}
			}
		} else {
			this.setState({ amount: e.target.value });
		}
	};
	handleAddress = (e) => {
		this.setState({ address: e.target.value });
	};
	handleDescription = (e) => {
		this.setState({ description: e.target.value });
	};
	handleToken = (e) => {
		this.setState({ verifyToken: e.target.value });
	};
	floorDecimals = (value, numberDecimals) => {
		let decimales = Math.pow(10, numberDecimals);
		return Math.floor(value * decimales) / decimales;
	};
	textAddressValidator(value) {
		let valid = WAValidator.validate(value, "BTC");
		//	console.log("valid:", valid);
		return valid;
	}
	reSentCode() {
		this.setState({ code: "" });
		let body = {
			userName: window.sessionStorage.getItem("username"),
			language: window.sessionStorage.getItem("language").toUpperCase(),
			sendSms: true,
			sendMail: false,
		};
		userService
			.sendAuthCodeCore(body)
			.then((res) => {
				//	console.log("dentro de la respuesta del 200 ok");
				this.setState({ disableContinue: true, sended: true });
				////console.log(res);
			})
			.catch((error) => {
				////console.log(error);
				this.setState({ disableContinue: false, notsended: true });
			});
	}
	async getComissionToOperation(amount) {
		let body = {};
		let bodyOut = {};
		//	console.log(amount);
		if (
			amount > 0 &&
			amount !== null &&
			amount !== undefined &&
			amount.toString() !== "NaN"
		) {
			body = {
				currency: "BTC",
				amount: amount,
				btcPrice: null,
				operationType: "SEND_IN",
				paymentType: null,
			};
			bodyOut = {
				currency: "BTC",
				amount: amount,
				btcPrice: null,
				operationType: "SEND_OUT",
				paymentType: null,
			};
			let arraycharges = [];
			try {
				let responseGetCharges = await otcService.getChargesByOperationOtc(
					body,
				);
				let responseGetChargesOut = await otcService.getChargesByOperationOtc(
					bodyOut,
				);
				// console.log("responseGetChargesOut:", responseGetChargesOut);
				// console.log("responseGetCharges:", responseGetCharges);

				if (responseGetCharges.data.COMMISSION !== undefined) {
					this.setState({
						commisionByOperarionIn: Number(
							responseGetCharges.data.COMMISSION.amount,
						).toFixed(8),
					});
					arraycharges.push({
						typeOperation: "SEND_IN",
						comission: responseGetCharges.data.COMMISSION.amount,
					});
				}
				if (responseGetChargesOut.data.COMMISSION !== undefined) {
					this.setState({
						commisionByOperarionOut: Number(
							responseGetChargesOut.data.COMMISSION.amount,
						).toFixed(8),
					});
					arraycharges.push({
						typeOperation: "SEND_OUT",
						comission: responseGetChargesOut.data.COMMISSION.amount,
					});
				}
				this.setState({ chargesAmounts: arraycharges });
			} catch (errorCharges) {
				console.log(errorCharges);
			}
		} else {
			console.log("error del amount");
			this.setState({
				errorForm: true,
				message: "registration.errors.unexpectedError",
			});
			setTimeout(() => {
				this.setState({
					errorForm: false,
					message: "",
				});
			}, 5000);
		}
	}
	async defineTypeSend(address) {
		try {
			const res = await userService.getSendOpetarionType(address);
			let typeOperationFind = this.state.chargesAmounts.find((item) => {
				return res.data === item.typeOperation;
			});
			//	console.log("typeOperationFind:", typeOperationFind);
			if (typeOperationFind !== undefined) {
				//	console.log(
				//	"dentro de typeOperationFind !== undefined:",
				//		typeOperationFind.comission,
				//	);
				return typeOperationFind.comission;
			} else {
				//	return 0;
				this.setState({
					errorForm: true,
					message: "registration.errors.unexpectedError",
				});
				setTimeout(() => {
					this.setState({
						errorCharges: false,
						message: "",
					});
				}, 5000);
			}
		} catch (error) {
			this.setState({
				errorForm: true,
				message: "registration.errors.unexpectedError",
			});
			setTimeout(() => {
				this.setState({
					errorForm: false,
					message: "",
				});
			}, 5000);
			//	return 0;
		}
	}
	sendBitcoins = async () => {
		this.setState({ loadingSending2: true });
		const re = /^[0-9]\d*(\.\d+)?$/;
		if (this.state.address !== "") {
			if (this.textAddressValidator(this.state.address)) {
				let comission = await this.defineTypeSend(this.state.address);
				//	console.log("comission:", comission);

				if (comission === undefined) {
					this.setState({
						errorForm: true,
						message: "registration.errors.unexpectedError",
					});
					setTimeout(() => {
						this.setState({
							errorForm: false,
							message: "",
						});
					}, 5000);
				}
				let totalAmountValidate;
				if (
					this.state.maxAvailableToSend > 0 &&
					this.state.maxAvailableToSend > comission
				) {
					totalAmountValidate = this.state.maxAvailableToSend - comission;
				} else {
					totalAmountValidate = this.state.maxAvailableToSend;
				}
				// console.log("totalAmountValidate:", totalAmountValidate);
				this.setState({
					amountAndComission: Number(totalAmountValidate).toFixed(8),
				});
				if (
					this.state.amount !== "" &&
					re.test(this.state.amount) &&
					this.state.amount <= totalAmountValidate &&
					this.state.amount > 0
				) {
					let addressSelected = this.state.address;
					let addressInArray = this.state.addressActual.find(function (
						element,
					) {
						return element === addressSelected;
					});
					if (addressInArray === undefined) {
						var body = {
							email: userService.getUserEmail().toString(),
							source: "PORTAL_NORMAL",
						};
						if (
							window.sessionStorage.getItem("preferedSendCodeSecurity") ===
							"EMAIL"
						) {
							userService
								.sendTokenToEmailUser(body)
								.then((res) => {
									this.setState({
										openSendConfirm: true,
										disableContinue: true,
										sended: true,
									});
								})
								.catch((error) => {
									this.setState({
										disableContinue: false,
										notsended: true,
									});
								});
						} else if (
							window.sessionStorage.getItem("preferedSendCodeSecurity") ===
							"PHONE"
						) {
							this.reSentCode();
							this.setState({ openSendConfirm: true });
							this.setState({ loadingSending2: false });
						} else if (
							window.sessionStorage.getItem("preferedSendCodeSecurity") ===
								"null" &&
							this.state.selected === "EMAIL"
						) {
							userService
								.sendTokenToEmailUser(body)
								.then((res) => {
									//	console.log(res);
									this.setState({
										openSendConfirm: true,
										disableContinue: true,
										sended: true,
									});
								})
								.catch((error) => {
									console.log(error);
									this.setState({ disableContinue: false, notsended: true });
								});
						} else if (
							window.sessionStorage.getItem("preferedSendCodeSecurity") ===
								"null" &&
							this.state.selected === "PHONE"
						) {
							this.reSentCode();
						}
					} else {
						this.setState({ loadingSending2: false });
						this.setState({
							errorAddress: true,
							message: "wallet.send.errors.equalAddress",
						});
						setTimeout(() => {
							this.setState({
								errorAddress: false,
							});
						}, 7000);
					}
				} else {
					if (this.state.amount === "") {
						this.setState({ loadingSending2: false });
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.required",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					} else if (!re.test(this.state.amount)) {
						this.setState({ loadingSending2: false });
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.numberFormat",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					} else if (this.state.amount >= totalAmountValidate) {
						this.setState({ loadingSending2: false });
						this.setState({
							//errorAmount: true,
							errorAmountMax: true,
							message: "wallet.send.errors.maxAllow",
						});
						setTimeout(() => {
							this.setState({
								// errorAmount: false,
								errorAmountMax: false,
							});
						}, 8000);
					} else if (this.state.amount <= 0) {
						this.setState({ loadingSending2: false });
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.positiveNumber",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					}
				}
			} else {
				this.setState({ loadingSending2: false });
				this.setState({
					errorAddress: true,
					message: "wallet.send.errors.format",
				});
				setTimeout(() => {
					this.setState({
						errorAddress: false,
					});
				}, 7000);
			}
		} else {
			this.setState({ loadingSending2: false });
			this.setState({
				errorAddress: true,
				message: "wallet.send.errors.required",
			});
			setTimeout(() => {
				this.setState({
					errorAddress: false,
				});
			}, 5000);
		}
	};

	async aceptSendConfirm() {
		this.setState({ loadingSending: true });
		try {
			if (
				this.state.selected === "PHONE" ||
				window.sessionStorage.getItem("preferedSendCodeSecurity") === "PHONE"
			) {
				let body = {
					userName: userService.getUserName(),
					code: this.state.verifyToken,
				};
				userService
					.authCodeCore(body)
					.then(async (resp) => {
						//	console.log("resp del code phone", resp);
						//	this.setState({ loadingSending: false });
						if (resp.data === "OK") {
							this.executeSendBitcoins();
						} else {
							this.setState({ verifyToken: "" });
							this.setState({ address: "" });
							this.setState({ amount: "" });
							this.setState({ loadingSending: false });
							this.closeSendConfirm2();
							// this.closeSendConfirm();
							this.setState({ sendError: true });
							setTimeout(() => {
								this.setState({
									sendError: false,
								});
							}, 7000);
						}
					})
					.catch((error) => {
						this.setState({ sendError: true });
						setTimeout(() => {
							this.setState({
								sendError: false,
							});
						}, 7000);
						console.log(error);
					});
			} else if (
				this.state.selected === "EMAIL" ||
				window.sessionStorage.getItem("preferedSendCodeSecurity") === "EMAIL"
			) {
				const res = await userService.verifyTokenToEmail(
					this.state.verifyToken,
				);
				this.setState({ loadingSending: false });
				if (res.data.errors === null) {
					this.executeSendBitcoins();
				} else {
					if (res.data.errors[0].code === 21) {
						this.setState({ verifyToken: "" });
						this.setState({ address: "" });
						this.setState({ amount: "" });
						this.setState({ loadingSending: false });
						this.setState({ showTokenNotFound: true });
						this.setState({ description: "" });
						this.closeSendConfirm2();
						setTimeout(() => {
							this.setState({
								showTokenNotFound: false,
							});
						}, 7000);
					}
					if (res.data.errors[0].code === 23) {
						this.setState({ verifyToken: "" });
						this.setState({ address: "" });
						this.setState({ amount: "" });
						this.setState({ loadingSending: false });
						this.closeSendConfirm();
						this.setState({ showTokenExpirated: true });
						this.setState({ description: "" });
						setTimeout(() => {
							this.setState({
								showTokenExpirated: false,
							});
						}, 7000);
					}
					this.closeSendConfirm();
				}
			}
		} catch (error) {
			this.setState({ sendError: true });
			this.setState({ address: "" });
			this.setState({ amount: "" });
			this.setState({ description: "" });
			this.setState({ loadingSending: false }, () => {
				this.closeSendConfirm2();
			});

			setTimeout(() => {
				this.setState({
					sendError: false,
				});
			}, 7000);
		}
	}
	executeSendBitcoins() {
		var body = {
			userName: userService.getUserName(),
			balanceOperationType: "SEND",
			address: "",
			privateKey: "",
			amounts: {
				BTC: this.state.amount,
			},
			targetAddress: this.state.address,
			additionalInfo: this.state.description,
		};

		console.log(body.amounts.BTC);

		if (
			body.amounts.BTC !== null &&
			body.amounts.BTC !== "" &&
			body.amounts.BTC !== undefined &&
			body.amounts.BTC.toString() !== "NaN" &&
			body.amounts.BTC > 0
		) {
			userService
				.balanceOperation(body)
				.then((res) => {
					this.getWalletBalanceDBC();
					this.closeSendConfirm();
					this.setState({ sendSuccess: true });
					this.setState({ address: "" });
					this.setState({ amount: "" });
					this.setState({ description: "" });
					this.setState({ loadingSending: false }, () => {
						//	console.log("cerrando el modal");
						this.closeSendConfirm2();
					});
					setTimeout(() => {
						this.setState({
							sendSuccess: false,
						});
					}, 7000);
				})
				.catch((error) => {
					this.closeSendConfirm();
					this.setState({ sendError: true });
					this.setState({ address: "" });
					this.setState({ amount: "" });
					this.setState({ description: "" });
					this.setState({ loadingSending: false }, () => {
						this.closeSendConfirm2();
					});

					setTimeout(() => {
						this.setState({
							sendError: false,
						});
					}, 7000);
					//////console.log(error);
				});
		} else {
			console.log("Error Amount");
			this.closeSendConfirm();
			this.setState({ sendError: true });
			this.setState({ address: "" });
			this.setState({ amount: "" });
			this.setState({ description: "" });
			this.setState({ loadingSending: false }, () => {
				this.closeSendConfirm2();
			});

			setTimeout(() => {
				this.setState({
					sendError: false,
				});
			}, 7000);
		}
	}
	closeSendConfirm = () => this.setState({ openSendConfirm: false });
	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const newIndex = this.state.activeIndexAccordion === index ? -1 : index;
		this.setState({ activeIndexAccordion: newIndex });
	};

	aceptSendConfirm2 = () =>
		this.setState({ openSendConfirm2: true, openSendConfirm: false });

	closeSendConfirm2 = () =>
		this.setState({ openSendConfirm2: false, disableContinue: false });

	handleUpdateSendCode() {
		let body = {
			username: userService.getUserName(),
			prefered: this.state.selected,
		};
		////console.log(body);
		userService
			.preferedSecurity(body)
			.then((resp) => {
				////console.log(resp);
			})
			.catch((error) => {
				////console.log(error);
			});
	}
	handleChange(e, { value }) {
		this.setState({ selected: value });
	}

	Updating() {
		const re = /^[0-9]\d*(\.\d+)?$/;
		if (this.state.address !== "") {
			if (this.textAddressValidator(this.state.address)) {
				if (
					this.state.amount !== "" &&
					re.test(this.state.amount) &&
					this.state.amount <= this.state.maxAvailableToSend &&
					this.state.amount > 0
				) {
					let addressSelected = this.state.address;
					let addressInArray = this.state.addressActual.find(function (
						element,
					) {
						return element === addressSelected;
					});
					if (addressInArray === undefined) {
						this.setState({ openSendConfirm: true });
					} else {
						this.setState({
							errorAddress: true,
							message: "wallet.send.errors.equalAddress",
						});
						setTimeout(() => {
							this.setState({
								errorAddress: false,
							});
						}, 7000);
					}
				} else {
					if (this.state.amount === "") {
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.required",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					} else if (!re.test(this.state.amount)) {
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.numberFormat",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					} else if (this.state.amount >= this.state.maxAvailableToSend) {
						this.setState({
							//errorAmount: true,
							errorAmountMax: true,
							message: "wallet.send.errors.maxAllow",
						});
						setTimeout(() => {
							this.setState({
								//errorAmount: false,
								errorAmountMax: false,
							});
						}, 8000);
					} else if (this.state.amount <= 0) {
						this.setState({
							errorAmount: true,
							message: "wallet.send.errors.positiveNumber",
						});
						setTimeout(() => {
							this.setState({
								errorAmount: false,
							});
						}, 5000);
					}
				}
			} else {
				this.setState({
					errorAddress: true,
					message: "wallet.send.errors.format",
				});
				setTimeout(() => {
					this.setState({
						errorAddress: false,
					});
				}, 7000);
			}
		} else {
			this.setState({
				errorAddress: true,
				message: "wallet.send.errors.required",
			});
			setTimeout(() => {
				this.setState({
					errorAddress: false,
				});
			}, 5000);
		}
	}
	render() {
		let options = [];
		if (this.state.phoneVerified === true) {
			options = [
				{ key: "EMAIL", text: "Email", value: "EMAIL" },
				{ key: "PHONE", text: "Sms", value: "PHONE" },
			];
		} else {
			options = [{ key: "EMAIL", text: "Email", value: "EMAIL" }];
		}

		let t = this.state.translator;
		let labelAddress,
			labelAmount,
			messageSendSuccess,
			messageSendError,
			errorForm,
			messageSendError2,
			messageTokenNotFound,
			messageTokenExpirated; //labelDescription,
		if (this.state.errorForm) {
			errorForm = <Message error content={t(this.state.message)} />;
		}
		if (this.state.showTokenNotFound) {
			messageTokenNotFound = (
				<Message negative>
					<Message.Header>
						{t("wallet.send.errors.tokenNotFoundHeader")}
					</Message.Header>
					<p>{t("wallet.send.errors.tokenNotFoundBody")}</p>
				</Message>
			);
		}
		if (this.state.showTokenExpirated) {
			messageTokenExpirated = (
				<Message negative>
					<Message.Header>
						{t("wallet.send.errors.tokenExpiredHeader")}
					</Message.Header>
					<p>{t("wallet.send.errors.tokenExpiredBody")}</p>
				</Message>
			);
		}
		if (this.state.sendSuccess) {
			messageSendSuccess = (
				<Message positive>
					<Message.Header>{t("wallet.send.successTxHeader")}</Message.Header>
					<p>{t("wallet.send.successTxBody")}</p>
				</Message>
			);
		}
		if (this.state.sendError) {
			messageSendError = (
				<Message negative>
					<Message.Header>{t("wallet.send.errors.weSorry")}</Message.Header>
					<p>{t("wallet.send.errors.failTransaction")}</p>
				</Message>
			);
		}
		if (this.state.errorAddress) {
			labelAddress = (
				<Label basic color='red' pointing>
					{t(this.state.message)}
				</Label>
			);
		}
		if (this.state.errorAmount) {
			labelAmount = (
				<Label basic color='red' pointing>
					{t(this.state.message)}
					{"    " + "(" + this.state.amountAndComission + ")"}
				</Label>
			);
		}

		if (this.state.errorAmountMax) {
			messageSendError2 = (
				<Message negative>
					<Message.Header>{t(this.state.message)}</Message.Header>
					<p>
						{t("wallet.send.errors.maxAllow2") +
							" " +
							this.state.amountAndComission}
					</p>
				</Message>
			);
		}
		return (
			<div>
				<Container textAlign='justified'>
					{!this.state.showSendBTC && (
						<Dimmer active inverted>
							<Loader inverted>{t("wallet.send.loading")}</Loader>
						</Dimmer>
					)}
					{this.state.loadingSending && (
						<Dimmer active inverted>
							<Loader inverted>{t("wallet.send.waiting")}</Loader>
						</Dimmer>
					)}
					{this.state.loadingSending2 && (
						<Dimmer active inverted>
							<Loader inverted></Loader>
						</Dimmer>
					)}
					<Grid centered>
						<Grid.Row>
							<Grid.Column computer={8} largeScreen={8} tablet={8} mobile={16}>
								{!isMobile && <Divider hidden />}
								<Grid columns='equal'>
									{!isMobile && <Grid.Column />}
									<Grid.Column
										largeScreen={10}
										tablet={14}
										mobile={16}
										computer={14}>
										<Segment secondary>
											<Grid columns='equal'>
												<Grid.Row>
													<Grid.Column width={8}>
														<p
															style={
																isMobile
																	? { color: "#207ef2", fontWeight: "bold" }
																	: {}
															}>
															{t("wallet.send.availableBalance")}
														</p>
													</Grid.Column>
													<Grid.Column textAlign='right'>
														<div style={isMobile ? { color: "#207ef2" } : {}}>
															{this.state.walletBalanceBTC} BTC
														</div>
													</Grid.Column>
												</Grid.Row>
												<Grid.Row style={{ marginTop: -20 }}>
													<Grid.Column width={8}>
														<p
															style={
																isMobile
																	? { color: "#207ef2", fontWeight: "bold" }
																	: {}
															}>
															{t("wallet.send.verifiedBalance")}
														</p>
													</Grid.Column>
													<Grid.Column textAlign='right'>
														<div style={isMobile ? { color: "#207ef2" } : {}}>
															{this.state.toVerifiedWalletBalanceBTC} BTC
														</div>
													</Grid.Column>
												</Grid.Row>
											</Grid>
										</Segment>
									</Grid.Column>
									{!isMobile && <Grid.Column />}
								</Grid>
								{!isMobile && <Divider hidden />}
								<Grid columns='equal'>
									{!isMobile && <Grid.Column />}
									<Grid.Column largeScreen={13} computer={13} mobile={16}>
										<Form>
											{messageSendSuccess}
											{messageSendError}
											{messageTokenExpirated}
											{messageTokenNotFound}
											<Form.Field>
												<label style={isMobile ? { color: "#207ef2" } : {}}>
													{t("wallet.send.addressReceiver")}
												</label>
												<input
													value={this.state.address}
													onChange={this.handleAddress}
													type='text'
													placeholder={t("wallet.send.addressReceiver")}
												/>
												{labelAddress}
											</Form.Field>
											<Form.Field>
												<label style={isMobile ? { color: "#207ef2" } : {}}>
													{t("wallet.send.amountBTC")}
												</label>
												<NumberFormat
													placeholder='0.0000000'
													value={this.state.amount}
													thousandSeparator
													fixedDecimalScale={8}
													maxLength={15}
													renderText={(formattedValue) => (
														<input
															placeholder='0.0000000'
															value={formattedValue}
															type='text'></input>
													)}
													onValueChange={(values) => {
														const { floatValue } = values;
														this.setState({ amount: floatValue });
														// let sumValun =
														//   this.state.walletBalanceBTC + 0.00015;
														// if (floatValue <= sumValun) {
														//   this.setState({ amount: floatValue });
														// }
													}}></NumberFormat>
												{/* <input
                          placeholder="0.0000000"
                          value={this.state.amount}
                          onChange={this.handleAmount}
                          type="text"
                        /> */}
												{labelAmount}
											</Form.Field>
											<Form.Field>
												<label style={isMobile ? { color: "#207ef2" } : {}}>
													{t("wallet.send.description")}
												</label>
												<input
													value={this.state.description}
													onChange={this.handleDescription}
													placeholder={t("wallet.send.placeholderDescription")}
												/>
												{messageSendError2}
												{errorForm}
											</Form.Field>

											<Container textAlign='right'>
												<Modal
													trigger={
														<div align={isMobile ? "center" : "right"}>
															{window.sessionStorage.getItem(
																"preferedSendCodeSecurity",
															) === "null" && (
																<Button
																	onClick={this.Updating.bind(this)}
																	color='blue'
																	size={isMobile ? "large" : ""}
																	style={{
																		marginTop: window.innerWidth <= 364 ? 8 : 0,
																		borderRadius: isMobile ? 40 : "",
																	}}>
																	{t("wallet.send.buttonContinue")}
																</Button>
															)}
															{window.sessionStorage.getItem(
																"preferedSendCodeSecurity",
															) !== "null" && (
																<Button
																	onClick={this.sendBitcoins}
																	color='blue'
																	type='submit'
																	size={isMobile ? "large" : ""}
																	style={{
																		marginTop: window.innerWidth <= 364 ? 8 : 0,
																		borderRadius: isMobile ? 40 : "",
																	}}>
																	{t("wallet.send.buttonContinue")}
																</Button>
															)}
														</div>
													}
													open={this.state.openSendConfirm}
													onClose={this.closeSendConfirm}>
													<Modal.Header>
														{t("wallet.send.confirmTx")}
													</Modal.Header>
													<Modal.Content>
														<Modal.Description>
															{window.sessionStorage.getItem(
																"preferedSendCodeSecurity",
															) === "EMAIL" && (
																<p>{t("wallet.send.descriptionTx")}</p>
															)}
															{window.sessionStorage.getItem(
																"preferedSendCodeSecurity",
															) === "PHONE" && (
																<p>{t("wallet.send.descriptionTxSms")}</p>
															)}

															{window.sessionStorage.getItem(
																"preferedSendCodeSecurity",
															) === "null" && (
																<div>
																	<p>
																		{t(
																			"profile.optionSecurity.list.options.SendSmsorEmail",
																		) +
																			"     " +
																			"(Email-Sms)"}
																	</p>

																	<Divider hidden></Divider>
																	<Grid>
																		<Grid.Row>
																			<Dropdown
																				style={{ marginLeft: "10px" }}
																				placeholder={t(
																					"profile.optionSecurity.list.options.labelSmsorEmail",
																				)}
																				selection
																				options={options}
																				onChange={this.handleChange.bind(this)}
																				value={this.state.selected}></Dropdown>
																			{this.state.selected === "PHONE" && (
																				<Button
																					style={{ marginLeft: "5px" }}
																					onClick={this.reSentCode.bind(this)}
																					disabled={this.state.disableContinue}
																					color='blue'>
																					{t("wallet.send.buttonContinue")}
																				</Button>
																			)}
																			{this.state.selected === "EMAIL" && (
																				<Button
																					style={{ marginLeft: "5px" }}
																					disabled={this.state.disableContinue}
																					onClick={this.sendBitcoins.bind(this)}
																					color='blue'>
																					{t("wallet.send.buttonContinue")}
																				</Button>
																			)}
																		</Grid.Row>
																	</Grid>
																	{this.state.sended === true && (
																		<Message
																			info
																			content={t("wallet.send.sended")}
																		/>
																	)}
																	{this.state.notsended === true && (
																		<Message
																			info
																			content={t("wallet.send.notsended")}
																		/>
																	)}
																</div>
															)}
															<Divider hidden></Divider>
															<Form>
																<Form.Field>
																	<label>Token</label>
																	<input
																		placeholder='xxxxxxx'
																		onChange={this.handleToken}
																	/>
																</Form.Field>
															</Form>
														</Modal.Description>
													</Modal.Content>
													<Modal.Actions>
														<Button
															color='grey'
															onClick={this.closeSendConfirm}>
															{t("wallet.send.buttonClose")}
														</Button>
														<Button
															disabled={this.state.verifyToken === ""}
															onClick={this.aceptSendConfirm2.bind(this)}
															color='blue'>
															{t("wallet.send.buttonAccept")}
														</Button>
													</Modal.Actions>
												</Modal>

												<Modal
													size={"small"}
													open={this.state.openSendConfirm2}
													onClose={this.closeSendConfirm2}
													loading={this.state.loadingSending}>
													<Modal.Header>
														{t("wallet.send.confirmTx")}
													</Modal.Header>
													<Modal.Content>
														<p>{t("wallet.send.confirMessage")}</p>
													</Modal.Content>
													<Modal.Actions>
														<Button
															color='red'
															loading={this.state.loadingSending}
															onClick={this.closeSendConfirm2}>
															{t("wallet.send.buttonNot")}
														</Button>

														<Button
															onClick={this.aceptSendConfirm.bind(this)}
															loading={this.state.loadingSending}
															color='green'>
															{t("wallet.send.buttonYes")}
														</Button>
													</Modal.Actions>
												</Modal>
											</Container>
										</Form>
									</Grid.Column>
									<Grid.Column />
								</Grid>
							</Grid.Column>
							<Grid.Column computer={8} largeScreen={8} tablet={8} mobile={16}>
								<Grid>
									{!isMobile && <Divider hidden />}
									<Grid.Column largeScreen={13} computer={13} mobile={16}>
										<Accordion styled>
											<Accordion.Title
												active={this.state.activeIndexAccordion === 0}
												index={0}
												onClick={this.handleClick}>
												<Icon name='dropdown' />
												{t("wallet.send.info.question")}
											</Accordion.Title>
											<Accordion.Content
												active={this.state.activeIndexAccordion === 0}>
												<List as='ol'>
													<List.Item as='li' value='-'>
														{t("wallet.send.info.answer1")}
													</List.Item>
													<List.Item as='li' value='-'>
														{t("wallet.send.info.answer2")}
													</List.Item>
												</List>
											</Accordion.Content>

											<Accordion.Title
												active={this.state.activeIndexAccordion === 1}
												index={1}
												onClick={this.handleClick}>
												<Icon name='dropdown' />
												{t("wallet.send.info.commissions")}
											</Accordion.Title>
											<Accordion.Content
												active={this.state.activeIndexAccordion === 1}>
												<List as='ol'>
													<List.Item as='li' value='-'>
														{t("wallet.send.info.internal")}
													</List.Item>
													<List.Item as='li' value='-'>
														{t("wallet.send.info.external")}
														{Number(this.state.commisionByOperarionOut).toFixed(
															8,
														) + " BTC"}
													</List.Item>
												</List>
											</Accordion.Content>
										</Accordion>
									</Grid.Column>
									<Grid.Column />
								</Grid>
							</Grid.Column>
						</Grid.Row>
					</Grid>
					<Divider hidden />
				</Container>
			</div>
		);
	}
}
export default translate(SendBitcoins);
