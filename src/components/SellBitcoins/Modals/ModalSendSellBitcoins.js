import React, { Component } from 'react';
import '../SellBitcoins.css';
import
{
	Button,
	Divider,
	Modal,
	Message,
	Dropdown,
	Form,
	Segment,
	Grid,
} from 'semantic-ui-react';
import userService from '../../../services/user';

import WAValidator from 'wallet-address-validator';
import axios from 'axios';
import 'react-table/react-table.css';
import otcAPI from '../../../services/otc';
import NumberFormat from 'react-number-format';
import translate from '../../../i18n/translate';
import { isMobile } from 'react-device-detect';
import config from '../../../services/config';
class ModalSendSellBitcoins extends Component
{
	constructor(props)
	{
		super(props);
		const mapPayments = new Map();
		mapPayments.set(
			'TRANSFER_WITH_SPECIFIC_BANK',
			'profile.addAccount.specificBank',
		);
		mapPayments.set('TRANSFER_NATIONAL_BANK', 'profile.addAccount.thirdBank');
		mapPayments.set('CHECK_DEPOSIT', 'profile.addAccount.checkDeposit');
		mapPayments.set('CASH_DEPOSIT', 'profile.addAccount.cashDeposit');
		mapPayments.set('WIRE_TRANSFER', 'profile.addAccount.wire');
		mapPayments.set(
			'TRANSFER_INTERNATIONAL_BANK',
			'profile.addAccount.international',
		);
		mapPayments.set(
			'TRANSFER_TO_CRYPTO_WALLET',
			'profile.addAccount.cryptoWallet',
		);

		let responseAfterSell = new Map();
		responseAfterSell.set(
			'THERE IS NO MATCH OFFER',
			'sell.mySells.modalSendSell.messages.notMatchOffer',
		);
		responseAfterSell.set(
			'MASTER ACCOUNT OTC HAS NOT ENOUGH BALANCE',
			'sell.mySells.modalSendSell.messages.notBalanceMaster',
		);
		responseAfterSell.set(
			'USER HAS NOT ENOUGH BALANCE',
			'sell.mySells.modalSendSell.messages.notBalanceUser',
		);
		responseAfterSell.set(
			'THIS PAYMENT IS NOT AVAILABLE AT THIS MOMENT',
			'sell.mySells.modalSendSell.messages.notAvailable',
		);

		responseAfterSell.set(
			'USER MONTHLY LIMIT REACHED',
			'buy.form.errors.usermonthlyLimit',
		);
		this.state = {
			responseAfterSell: responseAfterSell,
			constantPaymentsTypes: mapPayments,
			message: '',
			operationReady: false,
			listItemModal: [],
			sended: false,
			notsended: false,
			otherClose: false,
			address: '',
			send: false,
			disableContinue: false,
			loadForm: false,
			translator: props.translate,
			amountBitcoins: this.props.amountBitcoins,
			priceChangue: false,
			openSendConfirm2: false,
			openSendConfirm3: false,
			verifyToken: '',
			disableAcept: false,
			selected: '',
			showTokenExpirated: false,
			showTokenNotFound: false,
			loadingSending: false,
			validCode: false,
			opensellmodal: false
		};

		this.aceptSendConfirm = this.aceptSendConfirm.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext)
	{
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	componentDidMount()
	{
		this.setState({ amountBitcoins: this.props.amountBitcoins, opensellmodal: this.props.openSellConfirm });
		let prefered = window.sessionStorage.getItem('preferedSendCodeSecurity');


		if (prefered !== 'PHONE') {
			this.sendTokenVerifyToEmailUser();
		} else {
			this.sentCodeToPhone();
		}


	}
	aceptSendConfirm()
	{
		this.setState({ loadForm: true, send: true });
		let body = this.props.bodySellBitCoins;
		otcAPI
			.createOperation(body)
			.then((res) =>
			{
				//  //console.log(res.data);
				this.setState({ loadForm: false, send: false });
				let msg = '';
				let existe = this.state.responseAfterSell.has(res.data);
				if (existe) {
					//	////console.log('existe');
					msg = this.state.responseAfterSell.get(res.data);
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				} else if (res.data.toString().includes('PRICE CHANGE. NEW PRICE')) {
					////console.log('change price');
					let number = Number(res.data.toString().split(':')[1]);
					let parse = number.toLocaleString('en-EN', {
						maximumFractionDigits: 2,
					});
					msg =
						this.state.translator(
							'sell.mySells.modalSendSell.messages.newPrice',
						) +
						parse +
						', ' +
						this.state.translator(
							'sell.mySells.modalSendSell.messages.confirmChange',
						);
					this.setState(
						{
							amountChangedTo: parseFloat(res.data.split(':')[1]),
						},
						() =>
						{
							body.price = this.state.amountChangedTo;
							let amountNew = this.floorDecimals(
								body.amount / this.state.amountChangedTo,
								8,
							);
							this.props.changueAmountbit(
								amountNew,
								this.state.amountChangedTo,
								body,
							);
							this.setState({
								amountBitcoins: this.floorDecimals(
									body.amount / this.state.amountChangedTo,
									8,
								),
							});
						},
					);
					this.setState({
						message: msg,
						operationReady: false,
						priceChangue: true,
						send: false,
					});
				} else if (
					res.data.toString().includes('AMOUNT IS NOT BETWEEN MIN AND MAX')
				) {
					////console.log('condicion 0');
					msg =
						this.state.translator(
							'sell.mySells.modalSendSell.messages.notBetweenMinMax',
						) +
						res.data.toString().split('AMOUNT IS NOT BETWEEN MIN AND MAX')[1];
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				} else if (res.data.toString().includes('THERE IS NO MATCH OFFER')) {
					////console.log('condicion 1');
					msg = this.state.translator(
						'sell.mySells.modalSendSell.messages.thereNotMatchOffer',
					);
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				}
				else if (res.data.toString().includes('USER DAYLY LIMIT REACHED')) {
					msg = this.state.translator(
						'buy.form.errors.userdaylyLimit',
					);
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				}

				else if (res.data.toString().includes('USER MONTHLY LIMIT REACHED')) {
					msg = this.state.translator(
						'buy.form.errors.usermonthlyLimit',
					);
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				} else if (res.data.split(' ').length > 1) {
					msg = res.data;
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				} else {
					msg = this.state.translator(
						'sell.mySells.modalSendSell.messages.confirmSell',
					);
					this.setState({
						message: msg,
						operationReady: true,
						priceChangue: false,
					});
				}

				if (this.props.allowToAddPayment) {
					let body = {
						userName: sessionStorage.getItem('username'),
						currency: this.props.currencyLabelSelected,
						payment: this.props.bodySellBitCoins.clientPayment,
					};
					otcAPI.addPayment(body);
				}
			})
			.catch((error) =>
			{
				//  //console.log(error);
			});
	}
	handleToken = (e) =>
	{
		this.setState({ verifyToken: e.target.value });
	};
	closeSendConfirm = () =>
	{
		this.setState({
			listItemModal: [],
			send: false,
			loadForm: false,
			verifyToken: '',
			validCode: false,
			message: '',
			showMessageError: false,
			opensellmodal: false
		});
		this.props.handleCloseSendConfirm();
	};
	async sendTokenVerifyToEmailUser()
	{
		var body = {
			email: window.sessionStorage.getItem("email"),
			source: 'PORTAL_NORMAL',
		};
		try {
			if (this.props.openSellConfirm === true) {
				const response = await userService.sendTokenToEmailUser(body);
				//console.log(response);
			}

		} catch (error) {
			//console.log(error);
		}
	}
	handleChange(e, { value })
	{
		this.setState({ selected: value });
	}
	sendToMySales = () =>
	{
		this.props.handleCloseSendConfirm();
		this.props.redirectToMySellToModal();
	};
	floorDecimals = (value, numberDecimals) =>
	{
		let decimales = Math.pow(10, numberDecimals);
		return Math.floor(value * decimales) / decimales;
	};
	sentCodeToPhone()
	{
		this.setState({ code: '' });
		let body = {
			userName: userService.getUserName(),
			language: window.sessionStorage.getItem('language').toUpperCase(),
			sendSms: true,
			sendMail: false,
		};

		if (this.props.openSellConfirm === true) {
			userService
				.sendAuthCodeCore(body)
				.then((res) =>
				{
					// //console.log(res);
					// //console.log('dentro de la respuesta del 200 ok envio sms');
				})
				.catch((error) =>
				{
					// //console.log(error);
				});
		}

	}
	validateCode()
	{
		if (this.state.verifyToken !== '') {
			this.setState({ loadForm: true, send: true });
			let prefered = window.sessionStorage.getItem('preferedSendCodeSecurity');
			if (prefered === 'PHONE') {
				let request = {
					userName: userService.getUserName(),
					code: this.state.verifyToken,
				};
				userService
					.authCodeCore(request)
					.then((resp) =>
					{
						//console.log(resp);
						this.setState({ loadForm: false });
						if (resp.data === 'OK') {
							this.setState({ validCode: true }, () =>
							{
								this.aceptSendConfirm();
							});
						} else {
							//console.log('por el else distinto de ok');
							this.setState({
								showMessageError: true,
								send: false,
								message: 'login2FA.errors.failAuth',
							});
							setTimeout(() =>
							{
								this.setState({
									showMessageError: false,
									message: '',
									verifyToken: '',
								});
							}, 3000);
						}
					})
					.catch((error) =>
					{
						//console.log(error);
						this.setState({
							send: false,
							loadForm: false,
							showMessageError: true,
							message: 'login2FA.errors.serverError',
						});
						setTimeout(() =>
						{
							this.setState({
								showMessageError: false,
								message: '',
							});
						}, 5000);
					});
			} else {
				this.validateTokenEmail();
			}
		} else {
			this.setState({
				showMessageError: true,
				send: false,
				message: 'sell.form.errors.tokenInvalid',
			});
			setTimeout(() =>
			{
				this.setState({
					showMessageError: false,
					message: '',
				});
			}, 5000);
		}
	}
	async validateTokenEmail()
	{
		//console.log('entrando al validate email');
		try {
			this.setState({ send: true });
			const response = await userService.verifyTokenToEmail(
				this.state.verifyToken,
			);
			if (response.data.payload === true) {
				this.setState({ validCode: true }, () =>
				{
					this.aceptSendConfirm();
				});
			} else {
				//console.log('entrando al validate email else not ok');
				//console.log(response.data);
				this.setState({ send: false, loadForm: false });
				if (response.data.errors[0].code === 21) {
					this.setState({
						verifyToken: '',
						showMessageError: true,
						message: 'hft.myPlans.errors.tokenNotFound.content',
					});
					setTimeout(() =>
					{
						this.setState({
							verifyToken: '',
							showMessageError: false,
							message: '',
						});
					}, 5000);
				}
				if (response.data.errors[0].code === 23) {
					this.setState({
						verifyToken: '',
						showMessageError: true,
						message: 'hft.myPlans.errors.tokenExpired.content',
					});
					setTimeout(() =>
					{
						this.setState({
							verifyToken: '',
							showMessageError: false,
							message: '',
						});
					}, 5000);
				}
				this.setState({
					showMessageError: true,
					message: 'login2FA.errors.serverError',
				});
				setTimeout(() =>
				{
					this.setState({
						showMessageError: false,
						message: '',
					});
				}, 5000);
			}
		} catch (error) {
			//console.log(error);
			this.setState({ send: false });
			this.setState({
				showMessageError: true,
				message: 'login2FA.errors.serverError',
			});
			setTimeout(() =>
			{
				this.setState({
					showMessageError: false,
					message: '',
				});
			}, 5000);
		}
	}
	render()
	{
		////console.log(this.props.openSellConfirm)
		let t = this.state.translator;
		let labelMessage,
			arrayItems = [];
		if (
			this.props.bodySellBitCoins !== null &&
			this.props.bodySellBitCoins.clientPayment !== undefined
		) {
			Object.entries(this.props.bodySellBitCoins.clientPayment).forEach(
				([key, val]) =>
				{
					if (
						key !== 'id' &&
						key !== 'messages' &&
						key !== 'type' &&
						key !== 'active' &&
						key !== 'acceptIn' &&
						key !== 'acceptOut' &&
						key !== 'joinField' &&
						key !== 'payWindow' &&
						key !== 'automaticCharge' &&
						key !== 'verified'
					)
						arrayItems.push(<div key={key}>{val}</div>);
				},
			);
		}

		if (this.state.operationReady || this.state.priceChangue) {
			if (this.state.message === t("buy.form.errors.userdaylyLimit") ||
				this.state.message === t("buy.form.errors.usermonthlyLimit")) {
				labelMessage = <Message error content={t(this.state.message)} />;
			} else {
				labelMessage = <Message info content={t(this.state.message)} />;
			}

		}
		if (this.state.showMessageError) {
			labelMessage = <Message error content={t(this.state.message)} />;
		}

		const options = [
			{ key: 'EMAIL', text: 'Email', value: 'EMAIL' },
			{ key: 'PHONE', text: 'Sms', value: 'PHONE' },
		];
		return (
			<div>
				<Modal
					open={this.state.opensellmodal}
					onClose={this.closeSendConfirm.bind(this)}
					size='small'
					className='SellBitcoins'
					closeOnEscape={false}
					closeOnDimmerClick={false}>
					<Modal.Header>{t('sell.mySells.modalSendSell.header')}</Modal.Header>
					<Modal.Content>
						<Modal.Description>
							<Segment basic loading={this.state.loadForm}>
								<div align='center'>
									<strong>
										{t('sell.mySells.modalSendSell.requestSell')}{' '}
										<NumberFormat
											value={this.props.amountBitcoins}
											displayType={'text'}
											thousandSeparator={true}
										/>{' '}
										{t('sell.mySells.modalSendSell.btcBy')}{' '}
										<NumberFormat
											value={this.props.amountFiat}
											displayType={'text'}
											thousandSeparator={true}
										/>{' '}
										{this.props.currencyLabelSelected}
									</strong>
									<Divider />
								</div>
								<Grid>
									<Grid.Row columns={2}>
										<Grid.Column largeScreen={8} computer={8}>
											<label>
												{this.state.constantPaymentsTypes.has(
													this.props.namePaymenType,
												)
													? t(
														this.state.constantPaymentsTypes.get(
															this.props.namePaymenType,
														),
													)
													: this.props.namePaymenType}{' '}
											</label>
											{arrayItems}
										</Grid.Column>
										{this.props.infoOffices.length > 0 && (
											<Grid>
												<Grid.Row
													columns={
														this.props.infoOffices.length === 1
															? 1
															: isMobile
																? 1
																: 2
													}>
													{this.props.infoOffices.map((info, index) => (
														<Grid.Column key={index}>
															<Message
																info
																size={'small'}
																style={{ textAlign: 'left' }}>
																{info.value}
															</Message>
															<br />
														</Grid.Column>
													))}
												</Grid.Row>
											</Grid>
										)}

										<Grid.Column largeScreen={8} computer={8}>
											{this.props.chargesByOperation.length !== 0 && (
												<strong>{t('buy.modalConfirm.charges.header')}</strong>
											)}

											{this.props.chargesByOperation.length !== 0 &&
												this.props.chargesByOperation.map((item, index) => (
													<div>
														<span>
															{item.label}
															{item.value}
														</span>
													</div>
												))}
										</Grid.Column>
									</Grid.Row>
								</Grid>
								<div>
									{this.state.validCode !== true && (
										<Grid>
											<Grid.Row columns={1}>
												<Grid.Column>
													<p>
														{window.sessionStorage.getItem(
															'preferedSendCodeSecurity',
														) === 'PHONE'
															? t('wallet.send.descriptionTxSms')
															: t('wallet.send.descriptionTx')}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row columns={1}>
												<Grid.Column>
													<Form>
														<Form.Field>
															<label>
																{window.sessionStorage.getItem(
																	'preferedSendCodeSecurity',
																) === 'PHONE'
																	? t('wallet.send.code')
																	: t('wallet.send.token')}
															</label>
															<Form.Input
																placeholder='xxxxxxx'
																onChange={this.handleToken.bind(this)}
																value={this.state.verifyToken}
															/>
														</Form.Field>
													</Form>
												</Grid.Column>
											</Grid.Row>
										</Grid>
									)}
									<Divider hidden />
								</div>
								<Divider hidden />
								{labelMessage}
							</Segment>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						{!this.state.operationReady && !isMobile && (
							<Button
								disabled={this.state.send}
								color='grey'
								onClick={this.closeSendConfirm}>
								{t('sell.mySells.modalSendSell.buttonClose')}
							</Button>
						)}
						{!this.state.operationReady && isMobile && (
							<div align='center'>
								<Button
									disabled={this.state.send}
									color='grey'
									onClick={this.closeSendConfirm}
									style={{
										borderRadius: '40px/40px',
										height: '50px',
										width: '200px',
									}}>
									{t('sell.mySells.modalSendSell.buttonClose')}
								</Button>
								<Divider hidden></Divider>
							</div>
						)}
						{!this.state.operationReady && !isMobile && (
							<Button
								disabled={this.state.send}
								onClick={
									this.state.validCode
										? this.aceptSendConfirm.bind(this)
										: this.validateCode.bind(this)
								}
								color='blue'>
								{t('sell.mySells.modalSendSell.buttonAccept')}
							</Button>
						)}
						{!this.state.operationReady && isMobile && (
							<div align='center'>
								<Button
									disabled={this.state.send}
									onClick={
										this.state.validCode
											? this.aceptSendConfirm.bind(this)
											: this.validateCode.bind(this)
									}
									color='blue'
									style={{
										borderRadius: '40px/40px',
										height: '50px',
										width: '200px',
									}}>
									{t('sell.mySells.modalSendSell.buttonAccept')}
								</Button>
								<Divider hidden></Divider>
							</div>
						)}

						{this.state.operationReady &&
							!this.state.priceChangue &&
							!isMobile && (
								<Button color='blue' onClick={this.sendToMySales.bind(this)}>
									{t('sell.mySells.modalSendSell.buttonClose')}
								</Button>
							)}
						{this.state.operationReady && !this.state.priceChangue && isMobile && (
							<div align='center'>
								<Button
									color='blue'
									onClick={this.sendToMySales.bind(this)}
									style={{
										borderRadius: '40px/40px',
										height: '50px',
										width: '200px',
									}}>
									{t('sell.mySells.modalSendSell.buttonClose')}
								</Button>
								<Divider hidden></Divider>
							</div>
						)}

						<br />
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}
export default translate(ModalSendSellBitcoins);
