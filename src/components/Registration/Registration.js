import React, { Component } from "react";
import {
	Button,
	Form,
	Container,
	Header,
	Segment,
	Grid,
	Divider,
	Modal,
	Label,
	Message,
	List,
	Icon,
	Responsive,
} from "semantic-ui-react";
import ReCAPTCHA from "react-google-recaptcha";
import "./Registration.css";
import { parse } from "query-string";
//Services
import axios from "axios";
import uuid from "uuid";
import { Redirect, Link } from "react-router-dom";
import user from "../../services/user";
import config from "../../services/config.js";
import termsAndConditions from "../../common/termsAndConditions";
import translate from "../../i18n/translate";
const recapcha = React.createRef();
class Registration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			captchaValue: "",
			password: "",
			email: "",
			nickname: "",
			passwordRepeat: "",
			listUser: [],
			conditions: "false",
			loadform: false,
			statusModal: false,
			resultPost: " ",
			tokenurl: "",
			messageError: "",
			varlog: false,
			errorForm: false,
			errorPassword: false,
			errorRepeatPassword: false,
			errorCondition: false,
			errorCapcha: false,
			errorEmail: false,
			seeTermsAndConditions: false,
			termsAndConditions: termsAndConditions,
			company: false,
			hidden: true,
			hiddenRepeat: true,
			translator: props.translate,
		};
		this.handleCaptcha = this.handleCaptcha.bind(this);
		this.handleUserEmail = this.handleUserEmail.bind(this);
		this.handleUserPassword = this.handleUserPassword.bind(this);
		this.handleRepeatPassword = this.handleRepeatPassword.bind(this);
		this.handleConditions = this.handleConditions.bind(this);
		this.handleRegistrer = this.handleRegistrer.bind(this);
		this.onClickCloseModalTermsAndConditions = this.onClickCloseModalTermsAndConditions.bind(
			this,
		);
		this.onClickTermsAndConditions = this.onClickTermsAndConditions.bind(this);
		this.authUserLogin = this.authUserLogin.bind(this);
		this.setLoginFull = this.setLoginFull.bind(this);
		this.setLoginNotVerifiedEmail = this.setLoginNotVerifiedEmail.bind(this);
		this.sigNin = this.sigNin.bind(this);
		this.sigNinDollarBtc = this.sigNinDollarBtc.bind(this);
		this.setPinUser = this.setPinUser.bind(this);
		this.toggleShow = this.toggleShow.bind(this);
		this.toggleShowRepeat = this.toggleShowRepeat.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	handleCaptcha(params) {
		////console.log(params);
		this.setState({
			captchaValue: params,
		});
	}
	handleUserMC() {
		if (this.props.setView !== undefined) {
			this.props.setView("completeAccount");
		}
		this.setState({ completeAccount: true });
	}
	handleUserEmail(e) {
		this.setState({ email: e.target.value.toLowerCase() });
	}
	handleNickName(e) {
		var er = new RegExp(/\s/);
		if (!er.test(e.target.value)) {
			if (e.target.value.length < 21) {
				this.setState({ nickname: e.target.value });
			} else {
				this.setState({
					errorNickName: true,
					messageError: "registration.errors.errorMaxLongitude",
				});
				setTimeout(() => {
					this.setState({
						errorNickName: false,
						messageError: "",
					});
				}, 5000);
			}
		} else {
			this.setState({
				errorNickName: true,
				messageError: "registration.errors.errorBlankSpace",
			});
			setTimeout(() => {
				this.setState({
					errorNickName: false,
					messageError: "",
				});
			}, 5000);
		}
	}
	handleUserPassword(e) {
		this.setState({ password: e.target.value, nameHide: "password" });
	}
	handleRepeatPassword(e) {
		this.setState({
			passwordRepeat: e.target.value,
			hideRepeatPass: "passwordRepeat",
		});
	}
	handleConditions(e) {
		if (this.state.conditions === "false") {
			this.setState({ conditions: "true" });
		} else {
			this.setState({ conditions: "false" });
		}

		this.onClickCloseModalTermsAndConditions();
	}
	handleRegistryCompany() {
		this.setState({ company: !this.state.company });
	}
	handleModalClose() {
		this.setState({ statusModal: false, resultPost: "" });

		let query = parse(window.location.search);
		let tokenUrl = "";
		let typeOffer = "";
		if (query.offerKey !== undefined) {
			tokenUrl = query.offerKey;
			typeOffer = "offerKey";
			window.location.href = "/?" + typeOffer + "=" + tokenUrl;
		} else if (query.brokerOfferKey !== undefined) {
			tokenUrl = query.brokerOfferKey;
			typeOffer = "brokerOfferKey";
			window.location.href = "/?" + typeOffer + "=" + tokenUrl;
		} else {
			this.setState({
				registrer: true,
			});
			// window.location.href = "/";
		}
	}
	toggleShow() {
		this.setState({ hidden: !this.state.hidden });
	}
	toggleShowRepeat() {
		this.setState({ hiddenRepeat: !this.state.hiddenRepeat });
	}
	setBalanceInStore(username) {
		user
			.getBalanceUser(username)
			.then(async (resp) => {
				let acum = 0;
				let result = {
					available: 0,
					estimated: 0,
				};
				let acumdefered = 0;
				if (
					resp.data.result.modelBalances !== undefined &&
					resp.data.result.modelBalances.length > 0
				) {
					for (let val of resp.data.result.modelBalances) {
						for (let data of val.availableAmounts) {
							if (data.currency === "BTC") {
								acum = acum + parseFloat(data.amount);
							}
						}
					}
				}
				let decimales = Math.pow(10, 8);
				let data2 = Math.floor(acum * decimales) / decimales;
				if (resp.data.result.availableAmounts !== undefined) {
					if (resp.data.result.availableAmounts.length > 0) {
						if (resp.data.result.availableAmounts[0].amount > 0) {
							acumdefered =
								acumdefered +
								Math.floor(
									resp.data.result.availableAmounts[0].amount * decimales,
								) /
									decimales;
						} else {
							acumdefered = acumdefered;
						}
					}
				}
				if (resp.data.result.deferredAmounts !== undefined) {
					if (resp.data.result.deferredAmounts.length > 0) {
						if (resp.data.result.deferredAmounts[0].amount > 0) {
							acumdefered =
								acumdefered +
								Math.floor(
									resp.data.result.deferredAmounts[0].amount * decimales,
								) /
									decimales;
						} else {
							acumdefered = acumdefered;
						}
					}
				}
				result.available = acumdefered;
				result.estimated = data2;
				let sendType = {
					userName: username,
					fieldName: "sourceSignin",
					fieldValue: "DOLLARBTC",
				};
				await this.addDataUserAsync(sendType);
				sessionStorage.setItem("userBalanceBTC", JSON.stringify(result));
			})
			.catch((error) => {
				sessionStorage.setItem("userBalanceBTC", "");
			});
	}
	sigNin(email, password) {
		var body = {
			firstName: "",
			lastName: "",
			username: email,
			password: password,
			organization: "individuals",
			email: email,
			regCode: "",
			phone: "",
			countryCode: "",
			source: "PORTAL_NORMAL",
			nickname: this.state.nickname,
		};
		var userdollarbtc = {
			userName: email,
			email: email,
			masterWalletIds: {},
			amounts: {
				BTC: 0,
				USDT: 0,
				ETH: 0,
			},
			userProfile: "NORMAL",
		};
		user
			.sigNin(body)
			.then((res) => {
				if (res.data.payload && res.data.errors === null) {
					var wallets = {};
					for (var i = 0; i < res.data.payload.length; i++) {
						Object.defineProperty(wallets, res.data.payload[i].currency, {
							value: res.data.payload[i].name,
							enumerable: true,
							configurable: true,
							writable: true,
						});
					}
					userdollarbtc.masterWalletIds = wallets;
					var pin = { username: email, pin: "2018", regCode: "" };
					this.setPinUser(pin, userdollarbtc, password);
				} else {
					if (res.data.errors[0].code === 48) {
						this.setState({ loadform: false });
						this.setState({
							errorForm: true,
							messageError: "registration.errors.form.username",
						});
						setTimeout(() => {
							this.setState({ errorForm: false, messageError: "" });
						}, 6000);
					}
					if (res.data.errors[0].code === 20) {
						this.setState({ loadform: false });
						this.setState({
							errorForm: true,
							messageError: "registration.errors.form.alreadyEmail",
						});
						setTimeout(() => {
							this.setState({ errorForm: false, messageError: "" });
						}, 6000);
					}
					if (res.data.errors[0].code === 7) {
						this.setState({ loadform: false });
						this.setState({
							errorForm: true,
							messageError: "registration.errors.form.alreadyEmail",
						});
						setTimeout(() => {
							this.setState({ errorForm: false, messageError: "" });
						}, 6000);
					}
				}
			})
			.catch((error) => {
				this.setState({ loadform: false });
				//console.log(error);
				this.setState({
					resultPost: "registration.errors.resultPost",
				});
			});
	}
	setPinUser(pin, body, password) {
		user
			.setPinUserB(pin)
			.then((res) => {
				if (res.data.payload != null) {
					this.sigNinDollarBtc(body, password);
				}
			})
			.catch((error) => {
				this.setState({ loadform: false });
				console.log(error);
				this.result = error;
			});
	}
	async addDataUserAsync(body) {
		try {
			let response = await user.addDataUserAsync(body);
			if (response.data !== "OK") {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	}
	async sigNinDollarBtc(body, password) {
		// //console.log(body, this.state.nickname);
		user
			.sigNinDollarBtcB(body)
			.then(async (resp) => {
				//console.log(resp.data);
				if (resp.data.result === "OK") {
					let send = {
						userName: body.userName,
						fieldName: "nickname",
						fieldValue: this.state.nickname,
					};
					this.addDataUserAsync(send);

					let setCompany = {
						userName: body.userName,
						fieldName: "company",
						fieldValue: this.state.company,
					};
					this.addDataUserAsync(setCompany);

					this.setState({ loadform: false });
					this.authUserLogin(body.userName, password);
					this.setBalanceInStore(body.userName);
					user.generateKeyService(body.userName, password);
					this.setState({
						resultPost: "success",
						username: "",
						statusModal: true,
						password: "",
						passwordRepeat: "",
						email: "",
						conditions: "false",
					});

					recapcha.current.reset();
				}
			})
			.catch((error) => {
				//console.log(error);
			});
	}
	setUser(user) {
		user.getConfigUserGeneral(user).then((res) => {
			let dataendUser = this.getActualUserInfo(res.data.result);
			let dataUser = {
				birthdate:
					dataendUser.birthdate !== undefined ? dataendUser.birthdate : "",
				gender: dataendUser.gender !== undefined ? dataendUser.gender : "",
				birthplace:
					dataendUser.birthplace !== undefined ? dataendUser.birthplace : "",
				userLocalBitcoin:
					dataendUser.userLocalBitcoin !== undefined
						? dataendUser.userLocalBitcoin
						: "",
				userFacebook:
					dataendUser.userFacebook !== undefined
						? dataendUser.userFacebook
						: "",
			};
			sessionStorage.setItem("userDataDBTC", JSON.stringify(dataUser));
			if (res.data.result.verification === undefined) {
				let status = {
					C: "UNINITIATED",
					A: false,
					B: false,
				};
				sessionStorage.setItem(
					"userVerificationStatus",
					JSON.stringify(status),
				);
			} else {
				let a, b, c;
				if (res.data.result.verification.C === undefined) {
					c = "UNINITIATED";
				} else {
					c = res.data.result.verification.C.userVerificationStatus;
				}
				if (res.data.result.verification.A === undefined) {
					a = false;
				} else {
					a = true;
				}
				if (res.data.result.verification.B === undefined) {
					b = false;
				} else {
					b = true;
				}
				let status = {
					A: a,
					B: b,
					C: c,
				};
				sessionStorage.setItem(
					"userVerificationStatus",
					JSON.stringify(status),
				);
			}
		});
	}
	handleRegistrer() {
		let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if (this.state.email !== "") {
			if (regex.test(this.state.email)) {
				if (this.state.nickname !== "") {
					if (this.state.password !== "") {
						if (this.state.password.length >= 4) {
							if (this.state.password === this.state.passwordRepeat) {
								if (this.state.captchaValue !== "") {
									if (this.state.conditions === "true") {
										this.setState({ loadform: true });
										// this.getResult();
										this.sigNin(this.state.email, this.state.password);
									} else {
										this.setState({
											errorForm: true,
											messageError: "registration.errors.form.terms",
										});
										this.blankErrors("other");
									}
								} else {
									this.setState({
										errorForm: true,
										messageError: "registration.errors.form.captcha",
									});
									this.blankErrors("other");
								}
							} else {
								this.setState({
									errorRepeatPassword: true,
									messageError: "registration.errors.form.confirmPassword",
								});
								this.blankErrors("errorRepeatPassword");
							}
						} else {
							this.setState({
								errorPassword: true,
								messageError: "registration.errors.form.password",
							});
							this.blankErrors("errorPassword");
						}
					} else {
						this.setState({
							errorPassword: true,
							messageError: "registration.errors.errorRequiredField",
						});
						this.blankErrors("errorPassword");
					}
				} else {
					this.setState({
						errorNickName: true,
						messageError: "registration.errors.errorRequiredField",
					});
					setTimeout(() => {
						this.setState({
							errorNickName: false,
							messageError: "",
						});
					}, 6000);
				}
			} else {
				this.setState({
					errorEmail: true,
					messageError: "registration.errors.form.email",
				});
				this.blankErrors("errorEmail");
			}
		} else {
			this.setState({
				errorEmail: true,
				messageError: "registration.errors.errorRequiredField",
			});
			this.blankErrors("errorEmail");
		}
	}
	blankErrors(label) {
		if (label === "errorEmail") {
			setTimeout(() => {
				this.setState({ errorEmail: false, messageError: "" });
			}, 5000);
		}
		if (label === "errorPassword") {
			setTimeout(() => {
				this.setState({ errorPassword: false, messageError: "" });
			}, 5000);
		}
		if (label === "errorRepeatPassword") {
			setTimeout(() => {
				this.setState({ errorRepeatPassword: false, messageError: "" });
			}, 5000);
		}
		if (label === "other") {
			setTimeout(() => {
				this.setState({ errorForm: false, messageError: "" });
			}, 5000);
		}
	}
	getResult() {
		setTimeout(() => {
			if (user.getResponseResult()) {
				this.authUserLogin(this.state.email, this.state.password);
				this.setState({
					resultPost: "success",
					username: "",
					statusModal: true,
					password: "",
					passwordRepeat: "",
					email: "",
					conditions: "false",
				});

				recapcha.current.reset();
				this.setState({ loadform: false });
			} else {
				this.setState({
					resultPost: "registration.errors.resultPost",
				});
				this.setState({ loadform: false });
			}
		}, 12000);
	}
	authUserLogin(username, password, walletsDLBT) {
		user
			.authUser(username, password)
			.then((res) => {
				//	console.log(res);
				if (!res.data.errors || res.data.errors.length === 0) {
					this.setLoginFull(res, password, walletsDLBT);
				} else if (
					res.data.errors[0].code === 28 ||
					res.data.errors[0].code === 29
				) {
					this.setLoginNotVerifiedEmail(res, username, password, walletsDLBT);
				} else {
					this.setState({ noauth: true });
				}
				this.setState({ loadForm: false, user: "", password: "" });
				if (recapcha.current !== null) {
					recapcha.current.reset("capt");
				}
			})
			.catch((error) => {
				//console.log(error);
				this.setState({
					errorCaptcha: true,
					message: "registration.errors.unexpectedError",
					user: "",
					password: "",
					loadForm: false,
				});
				if (recapcha.current !== null) {
					recapcha.current.reset("capt");
				}
				this.blankErrors("errorCaptcha");
				// //console.log(error);
			});
	}
	setLoginFull(res, password, walletsDLBT) {
		var websocketKey = uuid.v4();
		window.sessionStorage.setItem("firstName", res.data.user.firstName);
		window.sessionStorage.setItem("lastName", res.data.user.lastName);
		window.sessionStorage.setItem("phone", res.data.user.phone);
		window.sessionStorage.setItem("countryCode", res.data.user.countryCode);
		window.sessionStorage.setItem("twoFactor", res.data.user.has2FAEnabled);
		window.sessionStorage.setItem("phoneVerified", res.data.user.phoneVerified);
		window.sessionStorage.setItem("username", res.data.user.username);
		window.sessionStorage.setItem("email", res.data.user.email);
		window.sessionStorage.setItem("nickname", this.state.nickname);
		window.sessionStorage.setItem("websocketKey", websocketKey);
		let hashCredencial = btoa(password + ":" + res.data.user.username);
		window.sessionStorage.setItem("header", hashCredencial);
		window.sessionStorage.setItem("verify", true);
		let walletsBushido = res.data.user.wallets;
		let walletsToUpdate = [];
		if (walletsDLBT !== undefined) {
			let currentAddress = Object.values(walletsDLBT.current)[0].address;
			////console.log(currentAddress);
			walletsToUpdate = walletsBushido.filter((wallet) => {
				if (
					wallet.creationDate === undefined ||
					wallet.creationDate === null ||
					wallet.creationDate === 0
				)
					if (wallet.address === currentAddress) return wallet;
			});
			////console.log(walletsToUpdate);
			if (walletsToUpdate.length > 0)
				this.updateWalletCreationDate(walletsToUpdate);
		}
		window.sessionStorage.setItem(
			"wallets",
			JSON.stringify(
				walletsToUpdate.length > 0 ? walletsToUpdate : walletsBushido,
			),
		);

		if (res.data.user.has2FAEnabled === true) {
			if (
				res.data.user.lastConexion === null ||
				res.data.user.lastConexion === undefined
			) {
				window.sessionStorage.setItem("auth", false);
				user.updateLastConexion(res.data.user.username);
			} else {
				let actualDate = new Date();
				let lastDate = new Date(res.data.user.lastConexion);
				let result = actualDate.getTime() - lastDate.getTime();
				if (result > 3600000) {
					window.sessionStorage.setItem("auth", false);
				} else {
					this.setState({ auth: true });
					window.sessionStorage.setItem("auth", true);
				}
			}
		} else {
			this.setState({ auth: true });
			window.sessionStorage.setItem("auth", true);
			user.updateLastConexion(res.data.user.email);
			// if (window.location.search) {
			// }
		}

		if (this.state.varlog === true) {
			window.location.href =
				"/?" + this.state.typeOffer + "=" + this.state.tokenurl;
		}
	}
	setLoginNotVerifiedEmail(res, email, password, walletsDLBT) {
		////console.log(email, password);
		var websocketKey = uuid.v4();
		window.sessionStorage.setItem("auth", true);
		window.sessionStorage.setItem("firstName", "");
		window.sessionStorage.setItem("lastName", "");
		window.sessionStorage.setItem("phone", "");
		window.sessionStorage.setItem("countryCode", "");
		window.sessionStorage.setItem("twoFactor", false);
		window.sessionStorage.setItem("phoneVerified", false);
		window.sessionStorage.setItem("username", email);
		window.sessionStorage.setItem("email", email);
		window.sessionStorage.setItem("websocketKey", websocketKey);
		window.sessionStorage.setItem("nickname", this.state.nickname);
		let hashCredencial = btoa(password + ":" + email);
		window.sessionStorage.setItem("header", hashCredencial);
		window.sessionStorage.setItem("verify", false);
		window.sessionStorage.setItem("emailSend", "true");
		let walletsBushido = res.data.user.wallets;
		let walletsToUpdate = [];
		if (walletsDLBT !== undefined) {
			let currentAddress = Object.values(walletsDLBT.current)[0].address;
			////console.log(currentAddress);
			walletsToUpdate = walletsBushido.filter((wallet) => {
				if (
					wallet.creationDate === undefined ||
					wallet.creationDate === null ||
					wallet.creationDate === 0
				)
					if (wallet.address === currentAddress) return wallet;
			});
			////console.log(walletsToUpdate);
			if (walletsToUpdate.length > 0)
				this.updateWalletCreationDate(walletsToUpdate);
		}
		window.sessionStorage.setItem(
			"wallets",
			JSON.stringify(
				walletsToUpdate.length > 0 ? walletsToUpdate : walletsBushido,
			),
		);

		user.updateLastConexion(email);
		this.setState({ auth: true });
	}
	onClickCloseModalTermsAndConditions() {
		this.setState({
			seeTermsAndConditions: false,
		});
	}
	componentDidMount() {
		this.readUrlWhitParams();
	}
	onClickTermsAndConditions() {
		this.setState({
			seeTermsAndConditions: true,
		});
	}
	handleItemOther(e, data) {
		this.props.setView(data.name);
	}
	readUrlWhitParams() {
		let query = parse(window.location.search);

		if (query === "" || query === null) {
			// console.log("no tiene nada la url", query);
			this.setState({ varlog: false });
		} else {
			//  console.log("dentro del else del readUrlParams");
			let tokenUrl = [];
			let typeOffer = "";
			if (query.offerKey !== undefined) {
				tokenUrl = query.offerKey;
				typeOffer = "offerKey";
			} else if (query.brokerOfferKey !== undefined) {
				tokenUrl = query.brokerOfferKey;
				typeOffer = "brokerOfferKey";
			}

			if (tokenUrl !== undefined && tokenUrl !== " " && tokenUrl !== null) {
				this.setState({
					varlog: true,
				});
				this.setState({
					tokenurl: tokenUrl,
					typeOffer: typeOffer,
				});
			}
		}
	}
	gotoLoginToken() {
		window.location.href =
			"/login/?" + this.state.typeOffer + "=" + this.state.tokenurl;
	}
	render() {
		let errorPassword;
		let errorEmail;
		let errorRepeatPassword;
		let errorForm;
		let resultPostMessage, errornickname;
		let resultPost = this.state.resultPost;
		let t = this.state.translator;

		if (this.state.registrer) {
			return <Redirect to='/' />;
		}
		if (this.state.errorPassword) {
			errorPassword = (
				<Label basic color='red' pointing>
					{t(this.state.messageError)}
				</Label>
			);
		}
		if (this.state.errorNickName) {
			errornickname = (
				<Label basic color='red' pointing>
					{t(this.state.messageError)}
				</Label>
			);
		}
		if (this.state.errorEmail) {
			errorEmail = (
				<Label basic color='red' pointing>
					{t(this.state.messageError)}
				</Label>
			);
		}
		if (this.state.errorRepeatPassword) {
			errorRepeatPassword = (
				<Label basic color='red' pointing>
					{t(this.state.messageError)}
				</Label>
			);
		}
		if (this.state.errorForm) {
			errorForm = <Message error content={t(this.state.messageError)} />;
		}
		if (resultPost === "success") {
			resultPostMessage = (
				<div>
					{t("registration.modalResult.resultPost.header")}
					<List bulleted>
						<List.Item>
							{t("registration.modalResult.resultPost.items.line1")}
						</List.Item>
						<List.Item>
							{t("registration.modalResult.resultPost.items.line2")}
						</List.Item>
						<List.Item>
							{t("registration.modalResult.resultPost.items.line3")}
						</List.Item>
						<List.Item>
							{t("registration.modalResult.resultPost.items.line4")}
						</List.Item>
						<List.Item>
							{t("registration.modalResult.resultPost.items.line5")}
						</List.Item>
					</List>
					<Message
						warning
						content={t("registration.modalResult.resultPost.warningMessage")}
					/>
					<Message
						info
						content={t("registration.modalResult.resultPost.infoMessage")}
					/>
				</div>
			);
		} else {
			resultPostMessage = <div>{resultPost}</div>;
		}
		return (
			<div>
				<Responsive minWidth={1200}>
					<Grid columns='equal'>
						<Grid.Column />
						<Grid.Column largeScreen={10} mobile={16} tablet={14}>
							<Container>
								<Segment color='orange' textAlign='left'>
									<div />
									<Header as='h4' className='titleComponent' textAlign='center'>
										{t("registration.header")}
									</Header>
									<Container className='container-form'>
										<Form
											error
											unstackable
											loading={this.state.loadform}
											onSubmit={this.handleRegistrer}>
											<Segment>
												<Form.Field>
													<Form.Input
														type='email'
														label={t("registration.form.email")}
														value={this.state.email}
														onChange={this.handleUserEmail}
														required
													/>
													{errorEmail}
												</Form.Field>
												<Form.Field>
													<Form.Input
														type='text'
														label={t("registration.form.username")}
														value={this.state.nickname}
														onChange={this.handleNickName.bind(this)}
														required
													/>
													{errornickname}
												</Form.Field>
												<Form.Field>
													<Form.Input
														placeholder={t(
															"registration.form.password.placeholder",
														)}
														icon={
															this.state.hidden ? (
																<Icon
																	name='eye'
																	circular
																	link
																	onClick={this.toggleShow}
																/>
															) : (
																<Icon
																	name='eye slash'
																	circular
																	link
																	onClick={this.toggleShow}
																/>
															)
														}
														type={this.state.hidden ? "password" : "text"}
														label={t("registration.form.password.label")}
														value={this.state.password}
														required
														onChange={this.handleUserPassword}
													/>
													{errorPassword}
												</Form.Field>
												<Form.Field>
													<Form.Input
														icon={
															this.state.hiddenRepeat ? (
																<Icon
																	name='eye'
																	circular
																	link
																	onClick={this.toggleShowRepeat}
																/>
															) : (
																<Icon
																	name='eye slash'
																	circular
																	link
																	onClick={this.toggleShowRepeat}
																/>
															)
														}
														label={t("registration.form.confirmPassword")}
														type={this.state.hiddenRepeat ? "password" : "text"}
														required
														value={this.state.passwordRepeat}
														onChange={this.handleRepeatPassword}
													/>
													{errorRepeatPassword}
												</Form.Field>

												<Form.Field>
													<Divider horizontal>
														{t("login.form.optionsUser")}
													</Divider>
												</Form.Field>
												<div className='text-center' style={{ marginTop: 20 }}>
													<Button
														basic
														as={Link}
														to='/completeAccount'
														color='blue'
														onClick={this.handleUserMC.bind(this)}>
														<span style={{ fontSize: "11px" }}>
															{t("login.form.userMoney")}
														</span>
													</Button>
												</div>
											</Segment>
											{
												<Grid>
													<Grid.Row columns={1}>
														<Grid.Column textAlign='center'>
															<Form.Field>
																<Form.Checkbox
																	label={t("registration.form.companyText")}
																	onChange={this.handleRegistryCompany.bind(
																		this,
																	)}
																	checked={this.state.company}
																/>
															</Form.Field>
														</Grid.Column>
													</Grid.Row>
												</Grid>
											}
											<Segment basic textAlign='center'>
												<p> {t("registration.form.captcha")} </p>
												<Grid>
													<Grid.Row columns={1} centered>
														<Grid.Column
															textAlign='center'
															verticalAlign='middle'
															width={window.innerWidth <= 394 ? 5 : ""}>
															<ReCAPTCHA
																id='reca'
																ref={recapcha}
																badge='inline'
																size={
																	window.innerWidth < 394 ? "compact" : "normal"
																}
																style={{
																	marginLeft: window.innerWidth < 394 ? 0 : 70,
																}}
																sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
																onChange={this.handleCaptcha}
															/>
														</Grid.Column>
														<Grid.Column />
													</Grid.Row>
												</Grid>
											</Segment>
											<Header as='h5' textAlign='center'>
												<Grid>
													<Grid.Row columns={1}>
														<Grid.Column style={{ marginLeft: "100px" }}>
															<Form.Group inline>
																<Form.Checkbox
																	onChange={this.handleConditions}
																	checked={this.state.conditions === "true"}
																/>
																<Form.Field>
																	<label>
																		{t("registration.form.terms.first")}
																		<a
																			href='#'
																			onClick={this.onClickTermsAndConditions}>
																			{t("registration.form.terms.second")}
																		</a>
																	</label>
																</Form.Field>
															</Form.Group>
														</Grid.Column>
													</Grid.Row>
												</Grid>
												<Divider hidden />
												{errorForm}
												<Form.Button
													color='blue'
													size='large'
													content={t("registration.header")}
												/>
												{/* <Divider hidden />

												<div className='text-center' style={{ marginTop: 20 }}>
													<Button
														basic
														as={Link}
														to='/completeAccount'
														color='blue'
														onClick={this.handleUserMC.bind(this)}>
														<span style={{ fontSize: "11px" }}>
															{t("login.form.userMoney")}
														</span>
													</Button>
												</div> */}
												<Divider hidden />
												{this.state.varlog === true && (
													// <Form.Button
													//   color="blue"
													//   size="large"
													//   content={t("registration.header")}
													// />
													<label
														//to="/login"
														// name="login"
														style={{ color: "#207ef2" }}
														onClick={this.gotoLoginToken.bind(this)}>
														{t("registration.alreadyExists")}
													</label>
												)}
												{this.state.varlog === false && (
													<Link
														to='/login'
														name='login'
														onClick={this.handleItemOther.bind(this)}>
														{t("registration.alreadyExists")}
													</Link>
												)}
											</Header>
										</Form>
									</Container>
								</Segment>
							</Container>
						</Grid.Column>
						<Grid.Column />
						<Modal open={this.state.statusModal}>
							<Modal.Header>
								{this.state.resultPost === "success"
									? t("registration.modalResult.headerSuccess")
									: t("registration.modalResult.headerError")}
							</Modal.Header>
							<Modal.Content>
								<p>{resultPostMessage}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleModalClose.bind(this)}>
									{t("registration.modalResult.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>

						<Modal open={this.state.seeTermsAndConditions}>
							<Modal.Header>{t("registration.modalTerms.header")}</Modal.Header>
							<Modal.Content>
								<p>{t("registration.modalTerms.content.termsAndConditions")}</p>
								<h4>{t("registration.modalTerms.content.item1.title")}</h4>
								<p>{t("registration.modalTerms.content.item1.content")}</p>
								<h4>{t("registration.modalTerms.content.item2.title")}</h4>
								<p>{t("registration.modalTerms.content.item2.content")}</p>
								<h4>{t("registration.modalTerms.content.item3.title")}</h4>
								<p>{t("registration.modalTerms.content.item3.content")}</p>
								<h4>{t("registration.modalTerms.content.item4.title")}</h4>
								<p>{t("registration.modalTerms.content.item4.content")}</p>
								<h4>{t("registration.modalTerms.content.item5.title")}</h4>
								<p>{t("registration.modalTerms.content.item5.content")}</p>
								<h4>{t("registration.modalTerms.content.item6.title")}</h4>
								<p>{t("registration.modalTerms.content.item6.content")}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleConditions}>
									{t("registration.modalTerms.agreeButton")}
								</Button>
								<Button
									onClick={this.onClickCloseModalTermsAndConditions.bind(this)}>
									{t("registration.modalTerms.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>
					</Grid>
				</Responsive>
				<Responsive minWidth={1127} maxWidth={1199}>
					<Grid columns='equal'>
						<Grid.Column />
						<Grid.Column largeScreen={10} mobile={16} tablet={14}>
							<Container>
								<Segment color='orange' textAlign='left'>
									<div />
									<Header as='h4' className='titleComponent' textAlign='center'>
										{t("registration.header")}
									</Header>
									<Container className='container-form'>
										<Form
											error
											unstackable
											loading={this.state.loadform}
											onSubmit={this.handleRegistrer}>
											<Form.Field>
												<Form.Input
													type='email'
													label={t("registration.form.email")}
													value={this.state.email}
													onChange={this.handleUserEmail}
													required
												/>
												{errorEmail}
											</Form.Field>
											<Form.Field>
												<Form.Input
													type='text'
													label={t("registration.form.username")}
													value={this.state.nickname}
													onChange={this.handleNickName.bind(this)}
													required
												/>
												{errornickname}
											</Form.Field>
											<Form.Field>
												<Form.Input
													placeholder={t(
														"registration.form.password.placeholder",
													)}
													icon={
														this.state.hidden ? (
															<Icon
																name='eye'
																circular
																link
																onClick={this.toggleShow}
															/>
														) : (
															<Icon
																name='eye slash'
																circular
																link
																onClick={this.toggleShow}
															/>
														)
													}
													type={this.state.hidden ? "password" : "text"}
													label={t("registration.form.password.label")}
													value={this.state.password}
													required
													onChange={this.handleUserPassword}
												/>
												{errorPassword}
											</Form.Field>
											<Form.Field>
												<Form.Input
													icon={
														this.state.hiddenRepeat ? (
															<Icon
																name='eye'
																circular
																link
																onClick={this.toggleShowRepeat}
															/>
														) : (
															<Icon
																name='eye slash'
																circular
																link
																onClick={this.toggleShowRepeat}
															/>
														)
													}
													label={t("registration.form.confirmPassword")}
													type={this.state.hiddenRepeat ? "password" : "text"}
													required
													value={this.state.passwordRepeat}
													onChange={this.handleRepeatPassword}
												/>
												{errorRepeatPassword}
											</Form.Field>
											{
												<Grid>
													<Grid.Row columns={1}>
														<Grid.Column textAlign='center'>
															<Form.Field>
																<Form.Checkbox
																	label={t("registration.form.companyText")}
																	onChange={this.handleRegistryCompany.bind(
																		this,
																	)}
																	checked={this.state.company}
																/>
															</Form.Field>
														</Grid.Column>
													</Grid.Row>
												</Grid>
											}
											<Segment basic textAlign='center'>
												<p> {t("registration.form.captcha")} </p>
												<Grid>
													<Grid.Row columns={1} centered>
														<Grid.Column
															style={{ marginLeft: "120px" }}
															verticalAlign='middle'
															width={window.innerWidth <= 394 ? 5 : ""}>
															<ReCAPTCHA
																id='reca'
																ref={recapcha}
																badge='inline'
																size={
																	window.innerWidth < 394 ? "compact" : "normal"
																}
																style={{
																	marginLeft: window.innerWidth < 394 ? 0 : 70,
																}}
																sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
																onChange={this.handleCaptcha}
															/>
														</Grid.Column>
														<Grid.Column />
													</Grid.Row>
												</Grid>
											</Segment>
											<Header as='h5' textAlign='center'>
												<Grid style={{ marginLeft: "200px" }}>
													<Grid.Row columns={1}>
														<Grid.Column>
															<Form.Group inline>
																<Form.Checkbox
																	onChange={this.handleConditions}
																	checked={this.state.conditions === "true"}
																/>
																<Form.Field>
																	<label>
																		{t("registration.form.terms.first")}
																		<a
																			href='#'
																			onClick={this.onClickTermsAndConditions}>
																			{t("registration.form.terms.second")}
																		</a>
																	</label>
																</Form.Field>
															</Form.Group>
														</Grid.Column>
													</Grid.Row>
												</Grid>
												<Divider hidden />
												{errorForm}
												<Form.Button
													color='blue'
													size='large'
													content={t("registration.header")}
												/>
												<Divider hidden />

												{this.state.varlog === true && (
													// <Form.Button
													//   color="blue"
													//   size="large"
													//   content={t("registration.header")}
													// />
													<label
														//to="/login"
														// name="login"
														style={{ color: "#207ef2" }}
														onClick={this.gotoLoginToken.bind(this)}>
														{t("registration.alreadyExists")}
													</label>
												)}
												{this.state.varlog === false && (
													<Link
														to='/login'
														name='login'
														onClick={this.handleItemOther.bind(this)}>
														{t("registration.alreadyExists")}
													</Link>
												)}
											</Header>
										</Form>
									</Container>
								</Segment>
							</Container>
						</Grid.Column>
						<Grid.Column />
						<Modal open={this.state.statusModal}>
							<Modal.Header>
								{this.state.resultPost === "success"
									? t("registration.modalResult.headerSuccess")
									: t("registration.modalResult.headerError")}
							</Modal.Header>
							<Modal.Content>
								<p>{resultPostMessage}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleModalClose.bind(this)}>
									{t("registration.modalResult.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>

						<Modal open={this.state.seeTermsAndConditions}>
							<Modal.Header>{t("registration.modalTerms.header")}</Modal.Header>
							<Modal.Content>
								<p>{t("registration.modalTerms.content.termsAndConditions")}</p>
								<h4>{t("registration.modalTerms.content.item1.title")}</h4>
								<p>{t("registration.modalTerms.content.item1.content")}</p>
								<h4>{t("registration.modalTerms.content.item2.title")}</h4>
								<p>{t("registration.modalTerms.content.item2.content")}</p>
								<h4>{t("registration.modalTerms.content.item3.title")}</h4>
								<p>{t("registration.modalTerms.content.item3.content")}</p>
								<h4>{t("registration.modalTerms.content.item4.title")}</h4>
								<p>{t("registration.modalTerms.content.item4.content")}</p>
								<h4>{t("registration.modalTerms.content.item5.title")}</h4>
								<p>{t("registration.modalTerms.content.item5.content")}</p>
								<h4>{t("registration.modalTerms.content.item6.title")}</h4>
								<p>{t("registration.modalTerms.content.item6.content")}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleConditions}>
									{t("registration.modalTerms.agreeButton")}
								</Button>
								<Button
									onClick={this.onClickCloseModalTermsAndConditions.bind(this)}>
									{t("registration.modalTerms.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>
					</Grid>
				</Responsive>
				<Responsive minWidth={992} maxWidth={1126}>
					<Grid columns='equal'>
						<Grid.Column />
						<Grid.Column largeScreen={10} mobile={16} tablet={14}>
							<Container>
								<Segment color='orange' textAlign='left'>
									<div />
									<Header as='h4' className='titleComponent' textAlign='center'>
										{t("registration.header")}
									</Header>
									<Container className='container-form'>
										<Form
											error
											unstackable
											loading={this.state.loadform}
											onSubmit={this.handleRegistrer}>
											<Form.Field>
												<Form.Input
													type='email'
													label={t("registration.form.email")}
													value={this.state.email}
													onChange={this.handleUserEmail}
													required
												/>
												{errorEmail}
											</Form.Field>
											<Form.Field>
												<Form.Input
													type='text'
													label={t("registration.form.username")}
													value={this.state.nickname}
													onChange={this.handleNickName.bind(this)}
													required
												/>
												{errornickname}
											</Form.Field>
											<Form.Field>
												<Form.Input
													placeholder={t(
														"registration.form.password.placeholder",
													)}
													icon={
														this.state.hidden ? (
															<Icon
																name='eye'
																circular
																link
																onClick={this.toggleShow}
															/>
														) : (
															<Icon
																name='eye slash'
																circular
																link
																onClick={this.toggleShow}
															/>
														)
													}
													type={this.state.hidden ? "password" : "text"}
													label={t("registration.form.password.label")}
													value={this.state.password}
													required
													onChange={this.handleUserPassword}
												/>
												{errorPassword}
											</Form.Field>
											<Form.Field>
												<Form.Input
													icon={
														this.state.hiddenRepeat ? (
															<Icon
																name='eye'
																circular
																link
																onClick={this.toggleShowRepeat}
															/>
														) : (
															<Icon
																name='eye slash'
																circular
																link
																onClick={this.toggleShowRepeat}
															/>
														)
													}
													label={t("registration.form.confirmPassword")}
													type={this.state.hiddenRepeat ? "password" : "text"}
													required
													value={this.state.passwordRepeat}
													onChange={this.handleRepeatPassword}
												/>
												{errorRepeatPassword}
											</Form.Field>
											{
												<Grid>
													<Grid.Row columns={1}>
														<Grid.Column textAlign='center'>
															<Form.Field>
																<Form.Checkbox
																	label={t("registration.form.companyText")}
																	onChange={this.handleRegistryCompany.bind(
																		this,
																	)}
																	checked={this.state.company}
																/>
															</Form.Field>
														</Grid.Column>
													</Grid.Row>
												</Grid>
											}
											<Segment basic textAlign='center'>
												<p> {t("registration.form.captcha")} </p>
												<Grid>
													<Grid.Row columns={1} centered>
														<Grid.Column
															style={{ marginLeft: "20px" }}
															verticalAlign='middle'
															width={window.innerWidth <= 394 ? 5 : ""}>
															<ReCAPTCHA
																id='reca'
																ref={recapcha}
																badge='inline'
																size={
																	window.innerWidth < 394 ? "compact" : "normal"
																}
																style={{
																	marginLeft: window.innerWidth < 394 ? 0 : 70,
																}}
																sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
																onChange={this.handleCaptcha}
															/>
														</Grid.Column>
														<Grid.Column />
													</Grid.Row>
												</Grid>
											</Segment>
											<Header as='h5' textAlign='center'>
												<Grid style={{ marginLeft: "200px" }}>
													<Grid.Row columns={1}>
														<Grid.Column>
															<Form.Group inline>
																<Form.Checkbox
																	onChange={this.handleConditions}
																	checked={this.state.conditions === "true"}
																/>
																<Form.Field>
																	<label>
																		{t("registration.form.terms.first")}
																		<a
																			href='#'
																			onClick={this.onClickTermsAndConditions}>
																			{t("registration.form.terms.second")}
																		</a>
																	</label>
																</Form.Field>
															</Form.Group>
														</Grid.Column>
													</Grid.Row>
												</Grid>
												<Divider hidden />
												{errorForm}
												<Form.Button
													color='blue'
													size='large'
													content={t("registration.header")}
												/>
												<Divider hidden />

												{this.state.varlog === true && (
													// <Form.Button
													//   color="blue"
													//   size="large"
													//   content={t("registration.header")}
													// />
													<label
														//to="/login"
														// name="login"
														style={{ color: "#207ef2" }}
														onClick={this.gotoLoginToken.bind(this)}>
														{t("registration.alreadyExists")}
													</label>
												)}
												{this.state.varlog === false && (
													<Link
														to='/login'
														name='login'
														onClick={this.handleItemOther.bind(this)}>
														{t("registration.alreadyExists")}
													</Link>
												)}
											</Header>
										</Form>
									</Container>
								</Segment>
							</Container>
						</Grid.Column>
						<Grid.Column />
						<Modal open={this.state.statusModal}>
							<Modal.Header>
								{this.state.resultPost === "success"
									? t("registration.modalResult.headerSuccess")
									: t("registration.modalResult.headerError")}
							</Modal.Header>
							<Modal.Content>
								<p>{resultPostMessage}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleModalClose.bind(this)}>
									{t("registration.modalResult.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>

						<Modal open={this.state.seeTermsAndConditions}>
							<Modal.Header>{t("registration.modalTerms.header")}</Modal.Header>
							<Modal.Content>
								<p>{t("registration.modalTerms.content.termsAndConditions")}</p>
								<h4>{t("registration.modalTerms.content.item1.title")}</h4>
								<p>{t("registration.modalTerms.content.item1.content")}</p>
								<h4>{t("registration.modalTerms.content.item2.title")}</h4>
								<p>{t("registration.modalTerms.content.item2.content")}</p>
								<h4>{t("registration.modalTerms.content.item3.title")}</h4>
								<p>{t("registration.modalTerms.content.item3.content")}</p>
								<h4>{t("registration.modalTerms.content.item4.title")}</h4>
								<p>{t("registration.modalTerms.content.item4.content")}</p>
								<h4>{t("registration.modalTerms.content.item5.title")}</h4>
								<p>{t("registration.modalTerms.content.item5.content")}</p>
								<h4>{t("registration.modalTerms.content.item6.title")}</h4>
								<p>{t("registration.modalTerms.content.item6.content")}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleConditions}>
									{t("registration.modalTerms.agreeButton")}
								</Button>
								<Button
									onClick={this.onClickCloseModalTermsAndConditions.bind(this)}>
									{t("registration.modalTerms.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>
					</Grid>
				</Responsive>
				<Responsive minWidth={0} maxWidth={991}>
					<Grid columns='equal'>
						<Grid.Column />
						<Grid.Column largeScreen={10} mobile={16} tablet={14}>
							<Container>
								{/* <Segment color="orange" textAlign="left"> */}
								<div />
								<Header as='h4' className='titleComponent' textAlign='center'>
									{t("registration.header")}
								</Header>
								<hr style={{ borderColor: "#207ef2" }}></hr>
								<Divider hidden></Divider>
								<Container className='container-form'>
									<Form
										error
										unstackable
										loading={this.state.loadform}
										onSubmit={this.handleRegistrer}>
										<Form.Field>
											<label className='titleComponentMobile'>
												{t("registration.form.email")}
											</label>
											<Form.Input
												type='email'
												value={this.state.email}
												onChange={this.handleUserEmail}
												required
											/>
											{errorEmail}
										</Form.Field>
										<Form.Field>
											<label className='titleComponentMobile'>
												{t("registration.form.username")}
											</label>
											<Form.Input
												type='text'
												value={this.state.nickname}
												onChange={this.handleNickName.bind(this)}
												required
											/>
											{errornickname}
										</Form.Field>
										<Form.Field>
											<label className='titleComponentMobile'>
												{t("registration.form.password.label")}
											</label>
											<Form.Input
												placeholder={t(
													"registration.form.password.placeholder",
												)}
												icon={
													this.state.hidden ? (
														<Icon
															name='eye'
															circular
															link
															onClick={this.toggleShow}
														/>
													) : (
														<Icon
															name='eye slash'
															circular
															link
															onClick={this.toggleShow}
														/>
													)
												}
												type={this.state.hidden ? "password" : "text"}
												value={this.state.password}
												required
												onChange={this.handleUserPassword}
											/>
											{errorPassword}
										</Form.Field>
										<Form.Field>
											<label className='titleComponentMobile'>
												{t("registration.form.confirmPassword")}
											</label>
											<Form.Input
												icon={
													this.state.hiddenRepeat ? (
														<Icon
															name='eye'
															circular
															link
															onClick={this.toggleShowRepeat}
														/>
													) : (
														<Icon
															name='eye slash'
															circular
															link
															onClick={this.toggleShowRepeat}
														/>
													)
												}
												type={this.state.hiddenRepeat ? "password" : "text"}
												required
												value={this.state.passwordRepeat}
												onChange={this.handleRepeatPassword}
											/>
											{errorRepeatPassword}
										</Form.Field>
										{
											<Header as='h5' textAlign='center'>
												<Grid>
													<Grid.Row columns={2}>
														<Grid.Column mobile={3}>
															<Form.Field textAlign='center'>
																<Form.Checkbox
																	style={{
																		borderStyle: "groove",
																		borderColor: "grey",
																	}}
																	onChange={this.handleRegistryCompany.bind(
																		this,
																	)}
																	checked={this.state.company}
																/>
															</Form.Field>
														</Grid.Column>
														<Grid.Column mobile={12}>
															<Form.Field>
																<label
																	textAlign='center'
																	className='titleComponentMobile'>
																	{t("registration.form.companyText")}
																</label>
															</Form.Field>
														</Grid.Column>
													</Grid.Row>
												</Grid>
											</Header>
										}
										<Segment basic textAlign='center'>
											<p className='titleComponentMobile'>
												{" "}
												{t("registration.form.captcha")}{" "}
											</p>
											<Grid>
												<Grid.Row columns={1} centered>
													<Grid.Column
														textAlign='center'
														verticalAlign='middle'
														width={window.innerWidth <= 394 ? 5 : ""}>
														<ReCAPTCHA
															id='reca'
															ref={recapcha}
															badge='inline'
															size={
																window.innerWidth < 394 ? "compact" : "normal"
															}
															style={{
																marginLeft: window.innerWidth < 394 ? 0 : 70,
															}}
															sitekey='6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c'
															onChange={this.handleCaptcha}
														/>
													</Grid.Column>
													<Grid.Column />
												</Grid.Row>
											</Grid>
										</Segment>
										<Header as='h5' textAlign='center'>
											{window.innerWidth <= 429 && (
												<Segment basic textAlign='center'>
													<Grid>
														<Grid.Row columns={2}>
															<Grid.Column mobile={2}>
																<Form.Field textAlign='center'>
																	<Form.Checkbox
																		style={{
																			borderStyle: "groove",
																			borderColor: "grey",
																		}}
																		onChange={this.handleConditions}
																		checked={this.state.conditions === "true"}
																	/>
																</Form.Field>
															</Grid.Column>
															<Grid.Column mobile={12}>
																<Form.Field>
																	<label
																		textAlign='center'
																		className='titleComponentMobile'>
																		{t("registration.form.terms.first")}
																		<a
																			href='#'
																			onClick={this.onClickTermsAndConditions}>
																			{t("registration.form.terms.second")}
																		</a>
																	</label>
																</Form.Field>
															</Grid.Column>
														</Grid.Row>
													</Grid>
												</Segment>
											)}
											{window.innerWidth > 429 && (
												<Segment basic textAlign='center'>
													<Grid>
														<Grid.Row columns={2}>
															<Grid.Column mobile={2}>
																<Form.Field textAlign='center'>
																	<Form.Checkbox
																		style={{
																			borderStyle: "groove",
																			borderColor: "grey",
																		}}
																		onChange={this.handleConditions}
																		checked={this.state.conditions === "true"}
																	/>
																</Form.Field>
															</Grid.Column>
															<Grid.Column mobile={12}>
																<Form.Field>
																	<label
																		textAlign='center'
																		className='titleComponentMobile'>
																		{t("registration.form.terms.first")}
																		<a
																			href='#'
																			onClick={this.onClickTermsAndConditions}>
																			{t("registration.form.terms.second")}
																		</a>
																	</label>
																</Form.Field>
															</Grid.Column>
														</Grid.Row>
													</Grid>
												</Segment>
											)}

											<Divider hidden />
											{errorForm}
											<Form.Button
												color='blue'
												size='large'
												style={{
													borderRadius: "40px/40px",
													height: "50px",
													width: "200px",
												}}
												content={t("registration.header")}
											/>
											<Divider hidden />
											<Link
												to='/login'
												name='login'
												onClick={this.handleItemOther.bind(this)}>
												{t("registration.alreadyExists")}
											</Link>
										</Header>
									</Form>
								</Container>
								{/* </Segment> */}
							</Container>
						</Grid.Column>
						<Grid.Column />
						<Modal open={this.state.statusModal}>
							<Modal.Header>
								{this.state.resultPost === "success"
									? t("registration.modalResult.headerSuccess")
									: t("registration.modalResult.headerError")}
							</Modal.Header>
							<Modal.Content>
								<p>{resultPostMessage}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleModalClose.bind(this)}>
									{t("registration.modalResult.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>

						<Modal open={this.state.seeTermsAndConditions}>
							<Modal.Header>{t("registration.modalTerms.header")}</Modal.Header>
							<Modal.Content>
								<p>{t("registration.modalTerms.content.termsAndConditions")}</p>
								<h4>{t("registration.modalTerms.content.item1.title")}</h4>
								<p>{t("registration.modalTerms.content.item1.content")}</p>
								<h4>{t("registration.modalTerms.content.item2.title")}</h4>
								<p>{t("registration.modalTerms.content.item2.content")}</p>
								<h4>{t("registration.modalTerms.content.item3.title")}</h4>
								<p>{t("registration.modalTerms.content.item3.content")}</p>
								<h4>{t("registration.modalTerms.content.item4.title")}</h4>
								<p>{t("registration.modalTerms.content.item4.content")}</p>
								<h4>{t("registration.modalTerms.content.item5.title")}</h4>
								<p>{t("registration.modalTerms.content.item5.content")}</p>
								<h4>{t("registration.modalTerms.content.item6.title")}</h4>
								<p>{t("registration.modalTerms.content.item6.content")}</p>
							</Modal.Content>
							<Modal.Actions>
								<Button color='blue' onClick={this.handleConditions}>
									{t("registration.modalTerms.agreeButton")}
								</Button>
								<Button
									onClick={this.onClickCloseModalTermsAndConditions.bind(this)}>
									{t("registration.modalTerms.closeButton")}
								</Button>
							</Modal.Actions>
						</Modal>
					</Grid>
				</Responsive>
			</div>
		);
	}
}
export default translate(Registration);
