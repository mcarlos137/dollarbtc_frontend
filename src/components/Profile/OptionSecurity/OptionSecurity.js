import React, { Component } from "react";
import {
	Segment,
	Header,
	Modal,
	Button,
	Form,
	Grid,
	Message,
	Input,
	Image,
	Icon,
	Divider,
	Progress,
	Dropdown,
	List,
	Popup,
} from "semantic-ui-react";
import ReactTooltip from "react-tooltip";
import QRCode from "qrcode.react";
import userService from "../../../services/user";
import "./OptionSecurity.css";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
import attachments from "../../../services/attachments";
class OptionSecurity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "",
			viewMessage: false,
			textMessage: "",
			password: "",
			newPassword: "",
			repeatPassword: "",
			selected2: "",
			loadForm: false,
			modalOpen: false,
			errorCode: false,
			modalOpen2: false,
			codetwofactor: false,
			usercode: "",
			modalMessage: "profile.emptyMessage",
			modalTwoFactor: false,
			modalInactiveTwoFactor: false,
			kur: false,
			modalkur: false,
			modalSendCode: false,
			userPhone: window.sessionStorage.getItem("phone"),
			phoneVerified:
				window.sessionStorage.getItem("phoneVerified") === "true"
					? true
					: false,
			twoFactor:
				window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
			codeVerify: "",
			userVerifyD:
				userService.getUserVerificationStatus() !== null
					? userService.getUserVerificationStatus().D
					: "UNINITIATED",
			sendRequest: false,
			resultUpdate: false,
			translator: props.translate,
			validActiveTwoFactor: false,
			load: false,
		};
		this.closeModalOption = this.closeModalOption.bind(this);
		this.closeModalOption2 = this.closeModalOption2.bind(this);
		this.closeModalOption3 = this.closeModalOption3.bind(this);
		this._Mounted = false;
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	componentWillMount() {
		this.verifying();
	}
	componentDidMount() {
		this.get2FPreference();
		this._Mounted = true;
		this.setState({ load: true });
		let userName = userService.getUserName();
		userService
			.getConfigUserGeneral(userName)
			.then((resp) => {
				let user = userService.getActualUserInfo(resp.data.result);
				this.setState({ load: false });
				if (
					user.answerSecurity !== undefined &&
					user.questionSecurity !== undefined
				) {
					if (user.answerSecurity !== "" && user.questionSecurity !== "") {
						this.setState({ validActiveTwoFactor: true });
					} else {
						this.setState({ validActiveTwoFactor: false });
					}
				} else {
					this.setState({ validActiveTwoFactor: false });
				}
			})
			.catch((error) => {
				//////////(error);
				this.setState({ load: false });
			});
	}

	verifying() {
		let username = userService.getUserName();
		let data = userService.getConfigUserGeneral(username);
		data
			.then((resp) => {
				// let userData = this.getActualUserInfo(resp.data.result);
				if (resp.data.result.verification === undefined) {
					this.setState({
						userVerifyC: "UNINITIATED",
						show: true,
						phoneVerified: false,
					});
				} else {
					if (resp.data.result.verification.C === undefined) {
						this.setState({ userVerifyC: "UNINITIATED", show: true });
					} else {
						this.setState({
							userVerifyC:
								resp.data.result.verification.C.userVerificationStatus,
							show: true,
						});
					}
					if (resp.data.result.verification.B === undefined) {
						//console.log('verification B :', resp.data.result.verification.B)
						this.setState({ phoneVerified: false });
						window.sessionStorage.setItem("phoneVerified", "false");
					} else {
						//console.log('verification B :', resp.data.result.verification.B)
						this.setState({ phoneVerified: true });
						window.sessionStorage.setItem("phoneVerified", "true");
					}
					if (resp.data.result.verification.A === undefined) {
						this.setState({ userVerify: false });
					} else {
						this.setState({ userVerify: true });
					}
				}
			})
			.catch((error) => {
				//console.log(error);
			});
	}

	componentWillUnmount() {
		this._Mounted = false;
	}
	closeModalOption() {
		this.setState({
			modalOpen: false,
			modalMessage: "",
			viewMessage: false,
			textMessage: "",
			resultUpdate: false,
		});
	}
	closeModalOption2() {
		this.setState({
			modalSendCode: false,
			modalMessage: "",
			viewMessage: false,
			textMessage: "",
			//sendRequest: false,
			sendRequest2: false,
			resultUpdate: false,
		});
	}
	closeModalOption3() {
		this.setState({
			modalOpen: false,
			selected2: "",
			modalMessage: "",
			viewMessage: false,
			textMessage: "",
			modalTwoFactor: false,
			sendRequest: false,
		});
	}
	handleOptionChangePassword() {
		this.props.changeItem("updatePassword");
		this.setState({
			resultUpdate: null,
			viewMessage: false,
			textMessage: "",
			password: "",
			newPassword: "",
			repeatPassword: "",
			loadForm: false,
			modalOpen: false,
			modalMessage: "",
			userPhone: window.sessionStorage.getItem("phone"),
			phoneVerified:
				window.sessionStorage.getItem("phoneVerified") === "true"
					? true
					: false,
			twoFactor:
				window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
			codeVerify: "",
		});
	}
	handleOptionSendSmsorEmail() {
		this.setState({
			modalSendCode: true,
		});
	}

	activeTwoFactor() {
		let isQrCreated = sessionStorage.getItem("isQrCodeCreated");
		if (isQrCreated === "true") {
			this.verifyKur();
		}
		if (window.sessionStorage.getItem("2FactorPrefered") === "PHONE") {
			//('caso phone');
			this.setState({
				modalTwoFactor: true,
				modalMessage: "profile.optionSecurity.activeTwoFactor",
				selected2: window.sessionStorage.getItem("2FactorPrefered"),
			});
		} else if (window.sessionStorage.getItem("2FactorPrefered") === "GOOGLE") {
			//('caso google');
			this.setState({
				modalTwoFactor: true,
				modalMessage: "profile.optionSecurity.activeTwoFactorGA",
				selected2: window.sessionStorage.getItem("2FactorPrefered"),
			});
		} else if (
			window.sessionStorage.getItem("2FactorPrefered") === "undefined"
		) {
			//('caso undeifned');
			//window.sessionStorage.setItem('2FactorPrefered', 'PHONE');
			this.setState({
				modalTwoFactor: true,
				modalMessage: "profile.optionSecurity.activeTwoFactor1",
			});
		}
	}
	inactiveTwoFactor() {
		this.setState({
			modalInactiveTwoFactor: true,
			modalMessage: "profile.optionSecurity.inactivateTwoFactor",
		});
	}
	handleVerifyAccount() {
		window.location.href = "/verify";
	}
	handleUpdateActiveTwoFactor() {
		this.setState({ loadForm: true, sendRequest: true });
		let two;
		two = !this.state.twoFactor;
		let body = {
			email: userService.getUserEmail(),
			firstName: window.sessionStorage.getItem("firstName"),
			lastName: window.sessionStorage.getItem("lastName"),
			countryCode: window.sessionStorage.getItem("countryCode"),
			phone: window.sessionStorage.getItem("phone"),
			has2FAEnabled: two,
		};
		userService
			.updateProfile(body, userService.getUserName())
			.then((resp) => {
				//('resp2', resp);
				this.resultUpdateTwoFactor();
				if (two === true) {
					this.Update2FactorPrefered();
				}
				this.setState({
					viewMessage: true,
					textMessage: "profile.optionSecurity.successUpdate",
					loadForm: false,
				});

				// setTimeout(() => {
				//   this.closeModalOption3();
				// }, 2000);
			})
			.catch((error) => {
				//////(error);
				this.setState({
					viewMessage: true,
					textMessage: "profile.optionSecurity.errors.failUpdate",
					loadForm: false,
				});
			});
	}

	createKur() {
		this.setState({ loadForm: true, sendRequest3: true });
		let body = {
			userName: userService.getUserName(),
		};
		userService
			.createGASecretKey(body)
			.then(async (resp) => {
				////////(resp);
				// this.resultUpdateTwoFactor();
				await userService.setQrDataUser(userService.getUserName());
				sessionStorage.setItem("isQrCodeCreated", true);
				this.setState({ kur: true, sendRequest3: true, loadForm: false });
				this.verifyKur();
			})
			.catch((error) => {
				////////(error);
				this.setState({
					viewMessage: true,
					textMessage: "profile.optionSecurity.errors.failUpdate",
					loadForm: false,
					kur: false,
					sendRequest3: false,
				});
			});
	}
	verifyKur() {
		this.getGoogleQrUser();
	}
	async getGoogleQrUser() {
		try {
			const response = await attachments.getQRGoogleAuth(
				userService.getUserName(),
			);
			// console.log(response);
			let blob = new Blob([response.data], {
				type: response.headers["content-type"],
			});
			let image = URL.createObjectURL(blob);
			this.setState({
				usercode: image,
			});
		} catch (error) {}
	}
	handleChange(e, { value }) {
		this.setState({ selected: value });
	}

	handleChange2(e, { value }) {
		this.setState({ selected2: value });
	}
	UpdateSecurityCode() {
		this.setState({ loadForm: true });
		var body = {
			username: window.sessionStorage.getItem("username"),
			prefered: this.state.selected,
		};
		userService
			.preferedSecurity(body)
			.then((resp) => {
				window.sessionStorage.setItem(
					"preferedSendCodeSecurity",
					this.state.selected,
				);

				this.setState({
					viewMessage: true,
					textMessage: "profile.optionSecurity.successUpdate",
					loadForm: false,
					sendRequest2: true,
				});
				// setTimeout(() => {
				//   this.closeModalOption2();
				// }, 2000);
			})
			.catch((error) => {
				this.setState({
					viewMessage: true,
					textMessage: "profile.optionSecurity.errors.failUpdate",
					loadForm: false,
					sendRequest2: false,
				});
			});
	}

	Update2FactorPrefered() {
		if (
			this.state.selected2 === "" ||
			this.state.selected2 === null ||
			this.state.selected2 === undefined
		) {
			//////('dentro del if');
			this.setState({
				selected2: window.sessionStorage.getItem("2FactorPrefered"),
			});
		} else {
			var body = {
				username: window.sessionStorage.getItem("username"),
				prefered: this.state.selected2,
			};
			userService
				.preferedSecurityTwoFactor(body)
				.then((resp) => {
					////('resp', resp);
					window.sessionStorage.setItem(
						"2FactorPrefered",
						this.state.selected2,
					);
					this.setState({
						codetwofactor: true,
						viewMessage: true,
						textMessage: "profile.optionSecurity.successUpdate",
						loadForm: false,
					});
				})
				.catch((error) => {
					////(error);
					this.setState({
						viewMessage: true,
						textMessage: "profile.optionSecurity.errors.failUpdate",
						loadForm: false,
					});
				});
		}
	}

	get2FPreference() {
		//////(window.sessionStorage.getItem('2FactorPrefered'));
		userService
			.preferedUserSendCodeTwoFactor()
			.then((resp) => {
				if (resp.data.payload === false) {
					window.sessionStorage.setItem("2FactorPrefered", "undefined");
				} else {
					window.sessionStorage.setItem("2FactorPrefered", resp.data.payload);
				}
			})
			.catch((error) => {});
	}
	handleCode(e) {
		if (/^([0-9])*$/.test(e.target.value)) {
			this.setState({
				code: e.target.value,
				errorCode: false,
			});
		} else {
			this.setState({
				errorCode: true,
			});
		}
	}
	resultUpdateTwoFactor() {
		this.setState({ resultUpdate: true, sendRequest: false });
		this.setState({
			viewMessage: true,
			textMessage: "profile.optionSecurity.successUpdate",
			loadForm: false,
		});
		this.state.twoFactor === true
			? window.sessionStorage.setItem("twoFactor", false)
			: window.sessionStorage.setItem("twoFactor", true);
		this.state.twoFactor === true
			? this.setState({ twoFactor: false })
			: this.setState({ twoFactor: true });
	}
	closeModal() {
		this.setState({
			resultUpdate: false,
			modalInactiveTwoFactor: false,
			viewMessage: false,
			modalTwoFactor: false,
			textMessage: "",
		});
		this.setState({
			modalOpen: false,
			selected2: "",
			modalMessage: "",
			viewMessage: false,
			textMessage: "",
			modalTwoFactor: false,
			sendRequest: false,
		});
	}

	render() {
		//	console.log("this.state.twoFactor:", this.state.twoFactor);
		//console.log('session verified:', window.sessionStorage.getItem('phoneVerified'))
		let t = this.state.translator;
		let disabledTwoFactor =
			this.state.phoneVerified === false ||
			this.state.validActiveTwoFactor === false
				? true
				: false;
		let pass = atob(userService.getHeader()).split(":")[0];
		let cont = 0;
		let messageToken,
			percentSecurity,
			buttonActiveTwoFac,
			buttonInactiveTwoFac,
			iconTwoFactor,
			buttomModal,
			buttomModal2,
			buttomModal3;
		buttomModal2 = (
			<div>
				{(this.state.sendRequest2 || this.state.selected === "") && (
					<Button onClick={this.closeModalOption2.bind(this)} color='grey'>
						{t("profile.optionSecurity.buttonClose")}
					</Button>
				)}

				{!this.state.sendRequest2 && this.state.selected !== "" && (
					<div>
						<Button
							onClick={this.closeModalOption2.bind(this)}
							color='grey'
							disabled={this.state.sendRequest2}>
							{t("profile.optionSecurity.buttonClose")}
						</Button>
						<Button
							color='blue'
							disabled={this.state.sendRequest2}
							onClick={this.UpdateSecurityCode.bind(this)}>
							{t("profile.optionSecurity.buttonAccept")}
						</Button>
					</div>
				)}
			</div>
		);
		if (!this.state.resultUpdate) {
			buttomModal3 = (
				<div>
					{this.state.selected2 === "PHONE" && (
						<div>
							<Button onClick={this.closeModalOption3.bind(this)} color='grey'>
								{t("profile.optionSecurity.buttonClose")}
							</Button>
							<Button
								color='blue'
								disabled={this.state.sendRequest}
								onClick={this.handleUpdateActiveTwoFactor.bind(this)}>
								{t("profile.optionSecurity.buttonAccept")}
							</Button>
						</div>
					)}
					{this.state.selected2 === "GOOGLE" && (
						<div>
							<Button onClick={this.closeModalOption3.bind(this)} color='grey'>
								{t("profile.optionSecurity.buttonClose")}
							</Button>

							<Button
								color='blue'
								disabled={this.state.sendRequest}
								onClick={this.handleUpdateActiveTwoFactor.bind(this)}>
								{t("profile.optionSecurity.buttonAccept")}
							</Button>
						</div>
					)}
					{this.state.selected2 === "" && (
						<div>
							<Button onClick={this.closeModalOption3.bind(this)} color='grey'>
								{t("profile.optionSecurity.buttonClose")}
							</Button>
						</div>
					)}
				</div>
			);
		} else {
			buttomModal3 = (
				<Button onClick={this.closeModal.bind(this)} color='grey'>
					{t("profile.optionSecurity.buttonClose")}
				</Button>
			);
		}
		if (!this.state.resultUpdate) {
			buttomModal = (
				<div>
					<Button
						onClick={this.closeModal.bind(this)}
						color='red'
						//disabled={this.state.sendRequest}
					>
						{t("profile.optionSecurity.buttonNo")}
					</Button>
					<Button
						color='green'
						//	disabled={this.state.sendRequest}
						onClick={this.handleUpdateActiveTwoFactor.bind(this)}>
						{t("profile.optionSecurity.buttonYes")}
					</Button>
				</div>
			);
		} else {
			buttomModal = (
				<Button onClick={this.closeModal.bind(this)} color='grey'>
					{t("profile.optionSecurity.buttonClose")}
				</Button>
			);
		}
		if (this.state.viewMessage) {
			messageToken = (
				<Message info floating content={t(this.state.textMessage)} />
			);
		}
		if (this.state.twoFactor) {
			cont++;
			buttonInactiveTwoFac = (
				<div align='center'>
					{!isMobile && (
						<Button
							color='blue'
							compact
							//disabled={disabledTwoFactor}
							onClick={this.inactiveTwoFactor.bind(this)}>
							<span>{t("profile.optionSecurity.buttonDisabled2FA")}</span>
						</Button>
					)}

					{isMobile && (
						<Button
							color='blue'
							compact
							style={{
								borderRadius: "40px/40px",
								height: "50px",
								width: "200px",
							}}
							onClick={this.inactiveTwoFactor.bind(this)}>
							<span>{t("profile.optionSecurity.buttonDisabled2FA")}</span>
						</Button>
					)}
				</div>
			);

			iconTwoFactor = (
				<Popup trigger={<Icon name='check' color='green' />}>
					{t("profile.optionSecurity.popUpActivated")}
				</Popup>
			);
		} else {
			// cont--;
			iconTwoFactor = (
				<Popup trigger={<Icon name='ban' color='red' />}>
					{t("profile.optionSecurity.popUpInactivated")}
				</Popup>
			);
			buttonActiveTwoFac = (
				<div>
					{!isMobile && (
						<Button
							color='blue'
							//disabled={disabledTwoFactor}
							onClick={this.activeTwoFactor.bind(this)}>
							<span>{t("profile.optionSecurity.buttonEnabled2FA")}</span>
						</Button>
					)}
					{isMobile && (
						<div align='center'>
							<Button
								color='blue'
								// disabled={disabledTwoFactor}
								onClick={this.activeTwoFactor.bind(this)}
								style={{
									borderRadius: "40px/40px",
									height: "50px",
									width: "200px",
								}}>
								<span>{t("profile.optionSecurity.buttonEnabled2FA")}</span>
							</Button>
						</div>
					)}
				</div>
			);
		}

		if (pass.length >= 8) {
			cont++;
		}
		if (
			window.sessionStorage.getItem("2FactorPrefered") !== "" ||
			window.sessionStorage.getItem("2FactorPrefered") !== "null" ||
			window.sessionStorage.getItem("2FactorPrefered") !== "undefined"
		) {
			cont++;
		}
		if (window.sessionStorage.getItem("preferedSendCodeSecurity") !== "") {
			cont++;
		}
		percentSecurity = (cont / 4) * 100;
		percentSecurity = Math.floor(percentSecurity);
		let textLabel, color;
		if (percentSecurity < 25) {
			textLabel = t("profile.optionSecurity.percents.low");
			color = "green";
		}
		if (percentSecurity >= 25 && percentSecurity <= 50) {
			textLabel = t("profile.optionSecurity.percents.middle");
			color = "olive";
		}
		if (percentSecurity >= 50 && percentSecurity <= 75) {
			textLabel = t("profile.optionSecurity.percents.middle");
			color = "teal";
		}
		if (percentSecurity > 75) {
			textLabel = t("profile.optionSecurity.percents.high");
			color = "blue";
		}

		let optionsPreferedTwoFactor = [];
		let options = [];
		if (this.state.phoneVerified === true) {
			optionsPreferedTwoFactor = [
				{
					key: "GOOGLE",
					text: t(
						"profile.optionSecurity.twoFactorOptions.preferedTwoFactorRequest.google",
					),
					value: "GOOGLE",
				},
				{
					key: "PHONE",
					text: t(
						"profile.optionSecurity.twoFactorOptions.preferedTwoFactorRequest.sms",
					),
					value: "PHONE",
				},
			];

			options = [
				{
					key: "EMAIL",
					text: t(
						"profile.optionSecurity.secureCodeProcessRequest.prefered.email",
					),
					value: "EMAIL",
				},
				{
					key: "PHONE",
					text: t(
						"profile.optionSecurity.secureCodeProcessRequest.prefered.sms",
					),
					value: "PHONE",
				},
			];
		} else {
			if (this.state.phoneVerified === false) {
				options = [
					{
						key: "EMAIL",
						text: t(
							"profile.optionSecurity.secureCodeProcessRequest.prefered.email",
						),
						value: "EMAIL",
					},
				];
				optionsPreferedTwoFactor = [
					{
						key: "GOOGLE",
						text: t(
							"profile.optionSecurity.twoFactorOptions.preferedTwoFactorRequest.google",
						),
						value: "GOOGLE",
					},
				];
			}
		}

		//	console.log(window.sessionStorage.getItem("preferedSendCodeSecurity"));
		return (
			<div>
				<ReactTooltip />
				<Grid colums='equal'>
					<Grid.Row>
						<Grid.Column largeScreen={2} tablet={2} />
						<Grid.Column largeScreen={12} mobile={16} tablet={12}>
							<Segment basic loading={this.state.load}>
								<div style={isMobile ? { color: "#207ef2" } : {}}>
									{t("profile.optionSecurity.progress")}
								</div>
								<Progress percent={percentSecurity} progress color={color}>
									{textLabel}
								</Progress>
								<div style={{ textAling: "center" }}>
									<p style={isMobile ? { color: "#207ef2" } : {}}>
										{t("profile.optionSecurity.list.header")}
									</p>
								</div>

								<List>
									<Popup
										trigger={
											<List.Item>
												<List.Icon name='key' />
												<List.Content
													style={isMobile ? { color: "#207ef2" } : {}}>
													{t(
														"profile.optionSecurity.list.options.changePassword",
													)}
												</List.Content>
											</List.Item>
										}>
										{t("profile.optionSecurity.list.options.recommendation")}
									</Popup>
									<List.Item>
										{iconTwoFactor}
										<List.Content style={isMobile ? { color: "#207ef2" } : {}}>
											{this.state.twoFactor === false &&
												t("profile.optionSecurity.list.options.twoFA")}

											{window.sessionStorage.getItem("2FactorPrefered") ===
												null &&
												t("profile.optionSecurity.list.options.twoFA") +
													"   " +
													"via " +
													"unknow"}

											{window.sessionStorage.getItem("2FactorPrefered") ===
												"PHONE" &&
												this.state.twoFactor === true &&
												t("profile.optionSecurity.list.options.twoFA") +
													"   " +
													"via " +
													"SMS"}

											{window.sessionStorage.getItem("2FactorPrefered") !==
												"null" &&
												window.sessionStorage.getItem("2FactorPrefered") ===
													"GOOGLE" &&
												this.state.twoFactor === true &&
												t("profile.optionSecurity.list.options.twoFA") +
													"    " +
													"via " +
													"Google Authenticator"}
										</List.Content>
									</List.Item>

									<Popup
										trigger={
											<List.Item>
												<List.Icon
													name='envelope outline'
													color={
														window.sessionStorage.getItem(
															"preferedSendCodeSecurity",
														) !== "null"
															? "green"
															: ""
													}
												/>
												<List.Content
													style={isMobile ? { color: "#207ef2" } : {}}>
													{window.sessionStorage.getItem(
														"preferedSendCodeSecurity",
													) === "null" &&
														t(
															"profile.optionSecurity.list.options.SendSmsorEmail",
														) +
															"     " +
															"(Email-Sms)"}
													{window.sessionStorage.getItem(
														"preferedSendCodeSecurity",
													) === "EMAIL" &&
														t(
															"profile.optionSecurity.list.options.SendSmsorEmail",
														) +
															"     " +
															"(Email)"}
													{window.sessionStorage.getItem(
														"preferedSendCodeSecurity",
													) === "PHONE" &&
														t(
															"profile.optionSecurity.list.options.SendSmsorEmail",
														) +
															"     " +
															"(Sms)"}
												</List.Content>
											</List.Item>
										}>
										{/* {t('profile.optionSecurity.list.options.recommendation')} */}
										{window.sessionStorage.getItem(
											"preferedSendCodeSecurity",
										) === "null" &&
											t("profile.optionSecurity.list.options.SendSmsorEmail") +
												"     " +
												"(Email-Sms)"}
										{window.sessionStorage.getItem(
											"preferedSendCodeSecurity",
										) === "EMAIL" &&
											t("profile.optionSecurity.list.options.SendSmsorEmail") +
												"     " +
												"(Email)"}
										{window.sessionStorage.getItem(
											"preferedSendCodeSecurity",
										) === "PHONE" &&
											t("profile.optionSecurity.list.options.SendSmsorEmail") +
												"     " +
												"(Sms)"}
									</Popup>

									{/* </List.Item> */}
								</List>
								<Divider hidden />
								<Grid colums='equal'>
									{/* <Grid.Column width={3} /> */}
									<Grid.Column
										largeScreen={5}
										tablet={5}
										widescreen={5}
										mobile={16}>
										{!isMobile && (
											<Button
												color='blue'
												onClick={this.handleOptionChangePassword.bind(this)}>
												<span>
													{t("profile.optionSecurity.buttonChangePassword")}
												</span>
											</Button>
										)}
										{isMobile && (
											<div align='center'>
												{" "}
												<Button
													color='blue'
													onClick={this.handleOptionChangePassword.bind(this)}
													style={{
														borderRadius: "40px/40px",
														height: "50px",
														width: "200px",
													}}>
													<span>
														{t("profile.optionSecurity.buttonChangePassword")}
													</span>
												</Button>
											</div>
										)}
									</Grid.Column>
									<Grid.Column
										largeScreen={5}
										tablet={5}
										widescreen={5}
										mobile={16}>
										{buttonActiveTwoFac}
										{buttonInactiveTwoFac}
									</Grid.Column>
									<Grid.Column
										largeScreen={5}
										tablet={5}
										widescreen={5}
										mobile={16}>
										{!isMobile && (
											<Button
												color='blue'
												//	disabled={disabledTwoFactor}
												onClick={this.handleOptionSendSmsorEmail.bind(this)}>
												<span>
													{t(
														"profile.optionSecurity.list.options.labelSmsorEmail",
													)}
												</span>
											</Button>
										)}
										{isMobile && (
											<div align='center'>
												{" "}
												<Button
													color='blue'
													//disabled={disabledTwoFactor}
													onClick={this.handleOptionSendSmsorEmail.bind(this)}
													style={{
														borderRadius: "40px/40px",
														height: "50px",
														width: "200px",
													}}>
													<span>
														{t(
															"profile.optionSecurity.list.options.labelSmsorEmail",
														)}
													</span>
												</Button>
											</div>
										)}
									</Grid.Column>
								</Grid>
							</Segment>
						</Grid.Column>
						<Grid.Column />
					</Grid.Row>
				</Grid>
				<Modal open={this.state.modalInactiveTwoFactor}>
					<Header
						icon='exclamation circle'
						content={t("profile.optionSecurity.verify")}
					/>
					<Modal.Content>
						<Modal.Description>
							<Segment basic loading={this.state.loadForm}>
								<p>{t(this.state.modalMessage)}</p>
								<Form error>{messageToken}</Form>
							</Segment>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>{buttomModal}</Modal.Actions>
				</Modal>
				<Modal open={this.state.modalTwoFactor}>
					<Header content={t("profile.optionSecurity.verify")} />
					<Modal.Content>
						<Modal.Description>
							<Segment basic>
								<p>
									{t("profile.optionSecurity.list.options.labelSmsorEmail")}
								</p>
								<Dropdown
									placeholder={t(
										"profile.optionSecurity.list.options.labelSmsorEmail",
									)}
									selection
									fluid
									options={optionsPreferedTwoFactor}
									onChange={this.handleChange2.bind(this)}
									value={this.state.selected2}></Dropdown>
							</Segment>

							<Segment basic loading={this.state.loadForm}>
								{!this.state.sendRequest && (
									<div>
										{" "}
										{this.state.selected2 === "GOOGLE" && (
											<div>
												{this.state.usercode !== "" && (
													<Grid centered>
														<Grid.Row>
															<Image src={this.state.usercode} size='medium' />

															<Divider hidden></Divider>
														</Grid.Row>

														{/* <Button
													onClick={this.verifyKur.bind(this)}
													color='green'>
													{t('profile.optionSecurity.buttonVerify')}
												</Button> */}
													</Grid>
												)}
												{this.state.usercode === "" && (
													<div>
														<Grid centered>
															<Grid.Row>
																{/* <Segment>
																{/* <p>Hacer click en el boton "crear"</p> 
															</Segment> */}

																<Button
																	onClick={this.createKur.bind(this)}
																	color='blue'
																	disabled={this.state.sendRequest3}>
																	{t("profile.optionSecurity.buttonCreate")}
																</Button>
															</Grid.Row>
														</Grid>
														<Divider hidden></Divider>{" "}
													</div>
												)}
												<p>{t("profile.optionSecurity.activeTwoFactorGA")}</p>
											</div>
										)}
										{this.state.selected2 === "PHONE" && (
											<p>{t("profile.optionSecurity.activeTwoFactor")}</p>
										)}
										{this.state.selected2 === "undefined" && (
											<p>{t("profile.optionSecurity.activeTwoFactor1")}</p>
										)}
									</div>
								)}
								{/* <p>{t(this.state.modalMessage)}</p> */}
								<Divider hidden></Divider>
								<Form error>{messageToken}</Form>
							</Segment>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>{buttomModal3}</Modal.Actions>
				</Modal>
				<Modal open={this.state.modalSendCode}>
					<Header
						icon='exclamation circle'
						content={t("profile.optionSecurity.verify")}
					/>
					<Modal.Content>
						<Modal.Description>
							<Segment basic loading={this.state.loadForm}>
								<p>{t("profile.optionSecurity.list.options.SendSmsorEmail")}</p>

								<Dropdown
									placeholder={t(
										"profile.optionSecurity.list.options.labelSmsorEmail",
									)}
									selection
									fluid
									disabled={this.state.sendRequest2}
									hidden={this.state.sendRequest2}
									options={options}
									onChange={this.handleChange.bind(this)}
									value={this.state.selected}></Dropdown>
							</Segment>
							<Form error>{messageToken}</Form>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>{buttomModal2}</Modal.Actions>
				</Modal>
			</div>
		);
	}
}
export default translate(OptionSecurity);
