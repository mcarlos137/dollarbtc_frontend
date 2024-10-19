import React, { Component } from "react";
import {
	Message,
	Grid,
	Button,
	Header,
	Segment,
	Divider,
} from "semantic-ui-react";
import ChatWaiting from "./ChatWaiting/ChatWaiting";
import user from "../../../services/user";
import otc from "../../../services/otc";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
class WaitingVerificationAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listData: [],
			status: this.props.status,
			load: false,
			translator: props.translate,
			isCreditCard: false,
		};
		this.listLabelDataToVerify = new Map();
		this.listLabelDataToVerify.set(
			"bank",
			props.translate("profile.waitingVerification.listLabelDataToVerify.bank"),
		);
		this.listLabelDataToVerify.set(
			"accountNumber",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.accountNumber",
			),
		);
		this.listLabelDataToVerify.set(
			"accountHolderName",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.accountHolderName",
			),
		);
		this.listLabelDataToVerify.set(
			"accountInterbankCode",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.accountInterbankCode",
			),
		);
		this.listLabelDataToVerify.set(
			"accountHolderPhone",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.accountHolderPhone",
			),
		);
		this.listLabelDataToVerify.set("accountHolderId", "ID");
		this.listLabelDataToVerify.set(
			"type",
			props.translate("profile.waitingVerification.listLabelDataToVerify.type"),
		);
		this.listLabelDataToVerify.set(
			"currency",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.currency",
			),
		);
		this.listLabelDataToVerify.set(
			"accountType",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.accountType",
			),
		);
		this.listLabelDataToVerify.set(
			"cardType",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.cardType",
			),
		);
		this.listLabelDataToVerify.set(
			"cardNumber",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.cardNumber",
			),
		);
		this.listLabelDataToVerify.set(
			"cardHolderName",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.cardHolderName",
			),
		);
		this.listLabelDataToVerify.set(
			"expDate",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.expDate",
			),
		);
		this.listLabelDataToVerify.set(
			"csc",
			props.translate("profile.waitingVerification.listLabelDataToVerify.csc"),
		);
		this.listLabelDataToVerify.set(
			"zipCode",
			props.translate(
				"profile.waitingVerification.listLabelDataToVerify.zipCode",
			),
		);
		this.constantPaymentsTypes = new Map();
		this.constantPaymentsTypes.set(
			"TRANSFER_WITH_SPECIFIC_BANK",
			props.translate("profile.addAccount.specificBank"),
		);
		this.constantPaymentsTypes.set(
			"TRANSFER_NATIONAL_BANK",
			props.translate("profile.addAccount.thirdBank"),
		);
		this.constantPaymentsTypes.set(
			"CHECK_DEPOSIT",
			props.translate("profile.addAccount.checkDeposit"),
		);
		this.constantPaymentsTypes.set(
			"CASH_DEPOSIT",
			props.translate("profile.addAccount.cashDeposit"),
		);
		this.constantPaymentsTypes.set(
			"WIRE_TRANSFER",
			props.translate("profile.addAccount.wire"),
		);
		this.constantPaymentsTypes.set(
			"TRANSFER_INTERNATIONAL_BANK",
			props.translate("profile.addAccount.international"),
		);
		this.constantPaymentsTypes.set(
			"TRANSFER_TO_CRYPTO_WALLET",
			props.translate("profile.addAccount.cryptoWallet"),
		);
		this.constantPaymentsTypes.set(
			"CREDIT_CARD",
			props.translate("profile.addAccount.creditCard"),
		);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	componentDidMount() {
		let array = [];
		// //console.log(this.props);
		this.setState({ load: true });
		let username = user.getUserName();
		let confi = user.getConfigUserGeneral(username);
		confi.then((resp) => {
			let id = resp.data.result.verification.D.fieldNames[0];
			let payment = otc.getClientPayment(id.split("__")[1]);
			payment.then((res) => {
				this.setState({
					paymentData: res.data,
					idVerify: resp.data.result.verification.D.verificationOperationId,
				});
				// //console.log(res.data);
				Object.entries(res.data).forEach(([key, val]) => {
					if (
						key === "type" ||
						key === "accountHolderId" ||
						key === "accountHolderName" ||
						key === "accountInterbankCode" ||
						key === "accountHolderPhone" ||
						key === "accountNumber" ||
						key === "bank" ||
						key === "currency" ||
						key === "accountType" ||
						key === "cardType" ||
						key === "cardNumber" ||
						key === "cardHolderName" ||
						key === "expDate" ||
						key === "csc" ||
						key === "zipCode"
					) {
						array.push(
							<span key={key}>
								{this.listLabelDataToVerify.has(key)
									? this.listLabelDataToVerify.get(key)
									: key}
								:
								{this.constantPaymentsTypes.has(val)
									? this.constantPaymentsTypes.get(val)
									: " " + val}
								<br />
							</span>,
						);
					} else {
						if (
							key !== "automaticCharge" &&
							key !== "id" &&
							key !== "messages" &&
							key !== "verified" &&
							key !== "forceVerification"
						) {
							array.push(
								<span key={key}>
									{key}: {" " + val}
									<br />
								</span>,
							);
						}
					}
					if (key === "cardNumber") {
						this.setState({ isCreditCard: true });
					}
				});
				this.setState({ listData: array }, () => {
					let timerId = setInterval(() => this.getDataUserNow(), 10000);
					this.setState({ timer: timerId });
					this.setState({ load: false });
				});
			});
		});
	}
	getDataUserNow() {
		let username = user.getUserName();
		user.getConfigUserGeneral(username).then((resp) => {
			this.setState({
				status: resp.data.result.verification.D.userVerificationStatus,
			});
			if (
				resp.data.result.verification.D.userVerificationStatus !== "PROCESSING"
			) {
				clearInterval(this.state.timer);
			}
		});
	}
	cancelVerification() {
		this.setState({ load: true });
		console.log(this.state.paymentData.id);
		user
			.cancelVerification(this.state.paymentData.id, "D")
			.then((resp) => {
				console.log("resp cancelVerification ", resp);
				if (resp.data === "OK") {
					let response = otc.deletePaymentUser(
						this.state.paymentData.currency,
						this.state.paymentData.id,
					);
					response.then((resp) => {
						console.log(resp);
					});
					clearInterval(this.state.timer);
					this.setState({ load: false, status: "CANCELED" });
				}
			})
			.catch((error) => {
				console.log(error);
				this.setState({ load: false });
			});
	}

	cancel() {
		// //console.log(this.props);
		if (this.props.addAccount) {
			this.props.backForm("OWN");
		} else {
			this.props.cancel();
		}
	}
	componentWillUnmount() {
		clearInterval(this.state.timer);
	}
	render() {
		let t = this.state.translator;
		//let data = this.state.paymentData;
		return (
			<Segment basic loading={this.state.load}>
				<Grid>
					<Grid.Row>
						<Grid.Column>
							{this.state.status === "PROCESSING" && (
								<Message
									info
									header={t(
										"profile.waitingVerification.messages.processing.header",
									)}
									content={
										this.state.isCreditCard
											? t(
													"profile.waitingVerification.messages.processing.creditCardContent",
											  )
											: t(
													"profile.waitingVerification.messages.processing.content",
											  )
									}
								/>
							)}
							{this.state.status === "FAIL" && (
								<Message
									color='red'
									header={t("profile.waitingVerification.messages.fail.header")}
									content={t(
										"profile.waitingVerification.messages.fail.content",
									)}
								/>
							)}
							{this.state.status === "OK" && (
								<Message
									info
									header={t(
										"profile.waitingVerification.messages.success.header",
									)}
									content={t(
										"profile.waitingVerification.messages.success.content",
									)}
								/>
							)}
							{this.state.status === "CANCELED" && (
								<Message
									info
									header={t(
										"profile.waitingVerification.messages.canceled.header",
									)}
									content={t(
										"profile.waitingVerification.messages.canceled.content",
									)}
								/>
							)}
						</Grid.Column>
					</Grid.Row>
					{this.state.status !== "OK" &&
						this.state.status !== "CANCELED" &&
						!isMobile && (
							<Grid.Row>
								<Grid.Column
									largeScreen={8}
									computer={8}
									mobile={16}
									tablet={8}>
									{this.state.paymentData !== undefined && (
										<ChatWaiting
											paymentData={this.state.idVerify}
											status={this.state.status}
											cancel={this.cancelVerification.bind(this)}
										/>
									)}
								</Grid.Column>
								<Grid.Column
									largeScreen={8}
									computer={8}
									mobile={16}
									tablet={8}>
									<Message
										info
										header={t(
											"profile.waitingVerification.messages.data.header",
										)}
										content={this.state.listData}
									/>
								</Grid.Column>
							</Grid.Row>
						)}
					{this.state.status !== "OK" &&
						this.state.status !== "CANCELED" &&
						isMobile && (
							<Grid.Row>
								<Grid.Column
									largeScreen={8}
									computer={8}
									mobile={16}
									tablet={8}>
									<Message
										info
										header={t(
											"profile.waitingVerification.messages.data.header",
										)}
										content={this.state.listData}
									/>
								</Grid.Column>
								<Divider hidden></Divider>
								<Grid.Column
									largeScreen={8}
									computer={8}
									mobile={16}
									tablet={8}>
									{this.state.paymentData !== undefined && (
										<ChatWaiting
											paymentData={this.state.idVerify}
											status={this.state.status}
											cancel={this.cancelVerification.bind(this)}
										/>
									)}
								</Grid.Column>
							</Grid.Row>
						)}
					{this.state.status === "OK" && (
						<Grid.Row>
							<Grid.Column>
								<Header textAlign={isMobile ? "center" : "left"}>
									<Button
										color='blue'
										onClick={this.cancel.bind(this)}
										style={
											isMobile
												? {
														borderRadius: "40px/40px",
														height: "50px",
														width: "200px",
														marginTop: 20,
												  }
												: {}
										}>
										{t("profile.waitingVerification.buttonBack")}
									</Button>
								</Header>
							</Grid.Column>
						</Grid.Row>
					)}
					{this.state.status === "CANCELED" && (
						<Grid.Row>
							<Grid.Column>
								<Header textAlign={isMobile ? "center" : "left"}>
									<Button
										color='blue'
										onClick={this.cancel.bind(this)}
										style={
											isMobile
												? {
														borderRadius: "40px/40px",
														height: "50px",
														width: "200px",
														marginTop: 20,
												  }
												: {}
										}>
										{t("profile.waitingVerification.buttonBack")}
									</Button>
								</Header>
							</Grid.Column>
						</Grid.Row>
					)}
				</Grid>
			</Segment>
		);
	}
}
export default translate(WaitingVerificationAccount);
