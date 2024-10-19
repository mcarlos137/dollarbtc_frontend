import React, { Component } from 'react';
import {
	Segment,
	Header,
	Message,
	Form,
	Button,
	Label,
	Modal,
	Grid,
	Divider,
	Icon,
	Input,
} from 'semantic-ui-react';
import './UpdatePasswordUser.css';
import userService from '../../../services/user';
import axios from 'axios';
import config from '../../../services/config';
import translate from '../../../i18n/translate';
import { isMobile } from 'react-device-detect';
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class UpdatePasswordUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			newPassword: '',
			repeatPassword: '',
			errorMachPassword: false,
			errorNewPassword: false,
			errorRepeat: false,
			oldPassword: atob(userService.getHeader()).split(':')[0],
			tokenVerify: '',
			modalOpen: false,
			modalMessage: 'profile.emptyMessage',
			resultUpdatePasswordChange: false,
			viewMessage: false,
			textMessage: '',
			sendConfirm: false,
			hidden: true,
			hiddenNew: true,
			hiddenRepeat: true,
			translator: props.translate,
		};
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	handleCancelChangePassword() {
		this.setState({
			resultUpdate: null,
			resultUpdatePasswordChange: false,
			viewMessage: false,
			textMessage: '',
			password: '',
			newPassword: '',
			repeatPassword: '',
		});
		//this.props.changeItem('optionSecurity');
		window.location.href = '/profile';
	}
	handlePassword(e) {
		if (e.target.value !== this.state.oldPassword) {
			this.setState({ password: e.target.value, errorMachPassword: true });
		} else {
			this.setState({ password: e.target.value, errorMachPassword: false });
		}
	}
	handleNewPassword(e) {
		if (e.target.value.length < 4) {
			this.setState({ newPassword: e.target.value, errorNewPassword: true });
		} else {
			this.setState({ newPassword: e.target.value, errorNewPassword: false });
		}
	}
	handleRepeatPassword(e) {
		if (e.target.value !== this.state.newPassword) {
			this.setState({ repeatPassword: e.target.value, errorRepeat: true });
		} else {
			this.setState({ repeatPassword: e.target.value, errorRepeat: false });
		}
	}
	handleChangePassword() {
		if (
			this.state.errorMachPassword === false &&
			this.state.errorNewPassword === false &&
			this.state.errorRepeat === false &&
			this.state.password !== null &&
			this.state.newPassword !== '' &&
			this.state.repeatPassword !== ''
		) {
			this.setState({ formLoad: true });
			userService
				.sentTokenUpdatePassword()
				.then((resp) => {
					if (resp.data.errors === null) {
						this.setState(
							{
								resultUpdate: true,
								formLoad: false,
							},
							() => {
								this.showModal();
							},
						);
					} else {
						this.setState(
							{
								resultUpdate: false,
								formLoad: false,
							},
							() => {
								this.showModal();
							},
						);
					}
				})
				.catch((error) => {
					this.setState({
						viewMessage: true,
						textMessage: 'profile.updatePasswordUser.errors.server',
					});
				});

			//	this.resultUpdatePassword();
		} else {
			this.setState({
				viewMessage: true,
				textMessage: 'profile.updatePasswordUser.errors.wrongData',
			});
			setTimeout(() => {
				this.setState({
					viewMessage: false,
					textMessage: '',
				});
			}, 4000);
		}
	}
	toggleShow() {
		this.setState({ hidden: !this.state.hidden });
	}
	toggleShowNew() {
		this.setState({ hiddenNew: !this.state.hiddenNew });
	}
	toggleShowRepeat() {
		this.setState({ hiddenRepeat: !this.state.hiddenRepeat });
	}
	resultUpdatePassword() {
		setTimeout(() => {
			this.setState({
				resultUpdate: userService.getResultSendTokenUpdatePassword(),
				formLoad: false,
			});
			this.showModal();
		}, 3000);
	}
	showModal() {
		if (this.state.resultUpdate) {
			this.setState({
				modalOpen: true,
				modalMessage: 'profile.updatePasswordUser.modalMessage',
			});
		} else {
			this.setState({
				viewMessage: true,
				textMessage: 'profile.updatePasswordUser.errors.server',
			});
		}
	}
	handleTokenVerify(e) {
		this.setState({ tokenVerify: e.target.value });
	}
	handleConfirmTokenPasswordChange() {
		if (this.state.tokenVerify !== '') {
			this.setState({ loadForm: true, sendConfirm: true });
			this.confirChangePassword(this.state.tokenVerify, this.state.newPassword);
			// this.resultUpdatePasswordEnd();
		} else {
			this.setState({ errorToken: true });
			setTimeout(() => {
				this.setState({ errorToken: false });
			}, 4000);
		}
	}

	passwordResetToken() {
		let body = {
			token: '', //this.state.tokenVerify
			enforceSms: true,
			language: window.sessionStorage.getItem('language').toUpperCase(),
			source: 'PORTAL_NORMAL',
		};
		userService
			.passwordResetToken(body)
			.then((resp) => {
				//console.log(resp);
				if (resp.data.payload === true) {
					this.passwordResetCode();
				}
			})
			.catch((error) => {
				//console.log(error);
			});
	}

	passwordResetCode() {
		let body = {
			token: this.state.tokenVerify,
			code: true,
		};

		userService
			.passwordResetCode(body)
			.then((resp) => {
				//console.log(resp);
			})
			.catch((error) => {
				//console.log(error);
			});
	}

	confirChangePassword(token, password) {
		let urlinit = URL_BASE_BUSHIDO + config.urlBushido.passwordResetInit;
		let urlconfir = URL_BASE_BUSHIDO + config.urlBushido.passwordResetConfirm;
		var hashCredencial = '';
		var request = { token: token };
		axios
			.post(urlinit, request)
			.then((res) => {
				if (res.data.errors === null) {
					var req = { token: token, password: password };
					axios
						.post(urlconfir, req)
						.then((res) => {
							//console.log(res);
							if (res.data.payload === true) {
								//console.log('payload true');
								this.setState({
									resultUpdatePasswordChange: true,
									loadForm: false,
									tokenVerify: '',
									viewMessage: true,
									textMessage:
										'profile.updatePasswordUser.successPasswordUpdate',
								});
								hashCredencial = btoa(
									password + ':' + window.sessionStorage.getItem('username'),
								);
								window.sessionStorage.setItem('header', hashCredencial);
							} else {
								//console.log('payload false');
								this.setState({
									resultUpdatePasswordChange: false,
									loadForm: false,
									viewMessage: true,
									textMessage: 'profile.updatePasswordUser.errors.genericError',
								});
								setTimeout(() => {
									this.setState({ viewMessage: false, textMessage: '' });
								}, 7000);
							}
						})
						.catch((error) => {
							//console.log(error);
						});
				} else {
					this.setState({
						resultUpdatePasswordChange: false,
						loadForm: false,
						tokenVerify: '',
						viewMessage: true,
						textMessage: 'profile.updatePasswordUser.errors.wrongToken',
					});
					setTimeout(() => {
						this.setState({
							viewMessage: false,
							textMessage: '',
							sendConfirm: false,
						});
					}, 7000);
				}
			})
			.catch((error) => {
				//console.log(error);
			});
	}
	resultUpdatePasswordEnd() {
		setTimeout(() => {
			this.setState({
				resultUpdatePasswordChange: userService.getResultSendTokenUpdatePassword(),
				loadForm: false,
			});
			this.closeModalOption();
		}, 6000);
	}
	closeModalOption() {
		this.setState({
			modalOpen: false,
			resultUpdatePasswordChange: null,
			password: '',
			newPassword: '',
			repeatPassword: '',
			errorMachPassword: false,
			errorNewPassword: false,
			errorRepeat: false,
			oldPassword: atob(userService.getHeader()).split(':')[0],
			tokenVerify: '',
			modalMessage: '',
			viewMessage: false,
			textMessage: '',
		});
		this.props.changeItem('optionAccount');
	}

	render() {
		//console.log(window.sessionStorage);
		let t = this.state.translator;
		let errorMach, errorNew, errorRepeat, messageToken;

		if (this.state.viewMessage) {
			messageToken = (
				<Message info floating content={t(this.state.textMessage)} />
			);
		}

		if (this.state.errorMachPassword) {
			errorMach = (
				<Label basic color='red' pointing>
					{t('profile.updatePasswordUser.errors.wrongPassword')}
				</Label>
			);
		}
		if (this.state.errorNewPassword) {
			errorNew = (
				<Label basic color='red' pointing>
					{t('profile.updatePasswordUser.errors.minimalChar')}
				</Label>
			);
		}
		if (this.state.errorRepeat) {
			errorRepeat = (
				<Label basic color='red' pointing>
					{t('profile.updatePasswordUser.errors.notMatch')}
				</Label>
			);
		}

		return (
			<div>
				<Segment color={!isMobile ? 'orange' : ''} basic={isMobile}>
					<Header
						textAlign='center'
						style={isMobile ? { color: '#207ef2' } : {}}>
						{t('profile.updatePasswordUser.changePassword')}
					</Header>
					<Divider
						style={isMobile ? { marginTop: -10, borderColor: '#207ef2' } : {}}
					/>
					<Grid columns='equal'>
						<Grid.Column />
						<Grid.Column largeScreen={10} mobile={16} computer={10}>
							<Form
								error
								onSubmit={this.handleChangePassword.bind(this)}
								loading={this.state.formLoad}>
								<Form.Field>
									<label style={isMobile ? { color: '#207ef2' } : {}}>
										{t('profile.updatePasswordUser.currentPassword')}
									</label>
									<Input
										icon={
											this.state.hidden ? (
												<Icon
													name='eye'
													circular
													link
													onClick={this.toggleShow.bind(this)}
												/>
											) : (
												<Icon
													name='eye slash'
													circular
													link
													onClick={this.toggleShow.bind(this)}
												/>
											)
										}
										type={this.state.hidden ? 'password' : 'text'}
										value={this.state.password}
										onChange={this.handlePassword.bind(this)}
									/>
									{errorMach}
								</Form.Field>
								<Form.Field>
									<label style={isMobile ? { color: '#207ef2' } : {}}>
										{t('profile.updatePasswordUser.newPassword')}
									</label>
									<Input
										icon={
											this.state.hiddenNew ? (
												<Icon
													name='eye'
													circular
													link
													onClick={this.toggleShowNew.bind(this)}
												/>
											) : (
												<Icon
													name='eye slash'
													circular
													link
													onClick={this.toggleShowNew.bind(this)}
												/>
											)
										}
										type={this.state.hiddenNew ? 'password' : 'text'}
										value={this.state.newPassword}
										onChange={this.handleNewPassword.bind(this)}
										placeholder={t(
											'profile.updatePasswordUser.placeholderNewPassword',
										)}
									/>
									{errorNew}
								</Form.Field>
								<Form.Field>
									<label style={isMobile ? { color: '#207ef2' } : {}}>
										{t('profile.updatePasswordUser.repeatPassword')}
									</label>
									<Input
										icon={
											this.state.hiddenRepeat ? (
												<Icon
													name='eye'
													circular
													link
													onClick={this.toggleShowRepeat.bind(this)}
												/>
											) : (
												<Icon
													name='eye slash'
													circular
													link
													onClick={this.toggleShowRepeat.bind(this)}
												/>
											)
										}
										type={this.state.hiddenRepeat ? 'password' : 'text'}
										value={this.state.repeatPassword}
										onChange={this.handleRepeatPassword.bind(this)}
									/>
									{errorRepeat}
								</Form.Field>
								<Form.Group>
									{!isMobile && (
										<div>
											<Button type='submit' color='blue'>
												{t('profile.updatePasswordUser.buttonSend')}
											</Button>
											<Button
												color='blue'
												onClick={this.handleCancelChangePassword.bind(this)}>
												{t('profile.updatePasswordUser.buttonClose')}
											</Button>
										</div>
									)}
									{isMobile && (
										<div align='center'>
											<Button
												type='submit'
												color='blue'
												style={{
													borderRadius: '40px/40px',
													height: '50px',
													width: '200px',
												}}>
												{t('profile.updatePasswordUser.buttonSend')}
											</Button>
											{/* <Divider hidden></Divider> */}
											<Button
												color='blue'
												onClick={this.handleCancelChangePassword.bind(this)}
												style={{
													borderRadius: '40px/40px',
													height: '50px',
													width: '200px',
													marginTop: 20,
												}}>
												{t('profile.updatePasswordUser.buttonClose')}
											</Button>
										</div>
									)}
								</Form.Group>
							</Form>
							{messageToken}
						</Grid.Column>
						<Grid.Column />
					</Grid>
				</Segment>
				<Modal open={this.state.modalOpen} size='small'>
					<Header
						icon='exclamation circle'
						content={t('profile.updatePasswordUser.verify')}
					/>
					<Modal.Content>
						<p style={{ fontSize: '14px' }}>{t(this.state.modalMessage)}</p>
						<Grid>
							<Grid.Column width={4}></Grid.Column>
							<Grid.Column width={8}>
								<Form loading={this.state.loadForm} error>
									<Form.Field hidden={this.state.resultUpdatePasswordChange}>
										<label>Token</label>
										<input
											type='text'
											value={this.state.tokenVerify}
											onChange={this.handleTokenVerify.bind(this)}
										/>
									</Form.Field>
									{messageToken}
									<Divider hidden />
								</Form>
							</Grid.Column>
							<Grid.Column width={4}></Grid.Column>
						</Grid>
					</Modal.Content>
					<Modal.Actions>
						{this.state.resultUpdatePasswordChange && (
							<Button
								color='grey'
								onClick={this.closeModalOption.bind(this)}
								style={
									isMobile
										? {
												borderRadius: '40px/40px',
												height: '50px',
												width: '200px',
												marginTop: 20,
										  }
										: {}
								}>
								{t('profile.updatePasswordUser.buttonClose')}
							</Button>
						)}
						{!this.state.resultUpdatePasswordChange && (
							<Button
								color='grey'
								onClick={this.closeModalOption.bind(this)}
								style={
									isMobile
										? {
												borderRadius: '40px/40px',
												height: '50px',
												width: '200px',
												marginTop: 20,
										  }
										: {}
								}>
								{t('profile.updatePasswordUser.buttonClose')}
							</Button>
						)}
						{!this.state.resultUpdatePasswordChange && (
							<Button
								color='blue'
								disabled={this.state.sendConfirm}
								onClick={this.handleConfirmTokenPasswordChange.bind(this)}
								style={
									isMobile
										? {
												borderRadius: '40px/40px',
												height: '50px',
												width: '200px',
												marginTop: 20,
										  }
										: {}
								}>
								{t('profile.updatePasswordUser.buttonVerify')}
							</Button>
						)}
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}
export default translate(UpdatePasswordUser);
