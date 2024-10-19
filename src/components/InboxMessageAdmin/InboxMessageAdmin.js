import React, { Component } from "react";
import {
	Label,
	Menu,
	Dropdown,
	Popup,
	Header,
	Button,
	Grid,
} from "semantic-ui-react";
import icon from "../../img/iconmenu1.png";
import soundAlert2 from "../../audio/oh-finally.mp3";
import { isSafari } from "react-device-detect";

class InboxMessageAdmin extends Component {
	constructor(props) {
		super(props);
		////console.log(props.state);
		this.state = {
			notifications: [],
			countUnread: 0,
			play: true,
			hasPermissionToPlaySound: !isSafari,
			openPopup: false,
		};
		this._isMounted = false;
		this.source = soundAlert2;
		//this.source = isSafari ? soundAlertSafari : soundAlert2;
		this.audio = new Audio(this.source);
		this.togglePlay = this.togglePlay.bind(this);
		this.handleMessages = this.handleMessages.bind(this);
		this.onClickMessage = this.onClickMessage.bind(this);
		this.validateAudioPlaySafari = this.validateAudioPlaySafari.bind(this);
		this.handleClickAcceptPermissionAudio = this.handleClickAcceptPermissionAudio.bind(
			this,
		);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.state.unreadAdmin !== nextProps.state.unreadAdmin) {
			this.handleMessages(nextProps.state.notificationsAdmin);
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	componentDidMount() {
		this._isMounted = true;
		this.handleMessages(this.props.state.notificationsAdmin);
		if (isSafari) this.validateAudioPlaySafari();
	}
	validateAudioPlaySafari() {
		let promise = this.audio.play();

		if (promise !== undefined) {
			promise
				.then((_) => {
					// Autoplay started!
					this.audio.play();
					//console.log("permission granted");
					this.setState({ hasPermissionToPlaySound: true });
				})
				.catch((error) => {
					//console.log(error);
					// Autoplay was prevented.
					//console.log("There's not permission to play sounds");
					// Show a "Play" button so that user can start playback.
					this.setState({ openPopup: true });
				});
		} else {
			//console.log("audio promise undefined");
		}
	}
	handleClickAcceptPermissionAudio() {
		////console.log("En el click de los permisos");
		let promise = this.audio.play();

		if (promise !== undefined) {
			promise
				.then((_) => {
					// Autoplay started!
					//console.log("permission granted");
					this.audio.play();
					this.setState({ openPopup: false, hasPermissionToPlaySound: true });
				})
				.catch((error) => {
					//console.log(error);
					// Autoplay was prevented.
					//console.log("There's not permission to play sounds");
					// Show a "Play" button so that user can start playback.
					this.setState({ openPopup: true });
				});
		} else {
			//console.log("audio promise undefined");
			this.setState({ openPopup: false });
		}
	}

	handleMessages(resp) {
		if (this._isMounted) {
			let keys = Object.keys(resp);
			////console.log(resp);
			if (keys.length > 1) {
				let result = JSON.parse(resp);
				////console.log(result);
				if (result !== undefined) {
					if (result.params !== undefined) {
						let notifications = [];
						//let notifications = this.state.notifications;
						let unread = 0;
						if (
							result.params.data !== undefined ||
							result.params.data !== null
						) {
							let msgs = result.params.data;
							if (msgs.length > 0) {
								if (result.method !== "currentAdminOperationMessages") {
									////console.log("en el metodo: "+result.method);
									notifications = [];
									unread = 0;
								}
								if (notifications.length === 1) {
									const emptyMsg = notifications.find((n) => {
										return n.id === "empty";
									});
									if (notifications.indexOf(emptyMsg) !== -1) {
										notifications = [];
									}
								}
								msgs = msgs.sort((a, b) => {
									return new Date(a.timestamp) - new Date(b.timestamp);
								});
								if (msgs !== null && msgs !== undefined && msgs !== "") {
									msgs.forEach((m, index) => {
										let pieceMesssage;
										if (m !== null) {
											if (m.id !== undefined && m.id !== null) {
												pieceMesssage = m.id;
											}
										}
										let msg = "";
										if (
											pieceMesssage !== null &&
											pieceMesssage !== undefined &&
											pieceMesssage !== ""
										) {
											if (notifications.length > 0) {
												let previousNotifications = notifications.filter(
													(pn) => {
														return (
															pn.text.split(" ")[2] ===
																pieceMesssage[2].substring(
																	pieceMesssage[2].length - 4,
																	pieceMesssage[2].length,
																) &&
															!pn.readed &&
															m.id !== pn.id
														);
													},
												);
												previousNotifications.forEach((p) => {
													if (!m.readed && !p.readed) {
														p.readed = true;
														unread--;
														this.setState({
															countUnread: unread,
														});
													}
												});
											}
											if (pieceMesssage.indexOf("FINISHED") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: FINALIZADA";
											} else if (
												pieceMesssage.indexOf("message") !== -1 &&
												pieceMesssage.indexOf("has") !== -1 &&
												pieceMesssage.indexOf("new") !== -1
											) {
												msg =
													"La operacion " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha recibido un nuevo mensaje";
											} else if (pieceMesssage.indexOf("CANCELED") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: CANCELADA";
											} else if (
												pieceMesssage.indexOf("WAITING_FOR_PAYMENT") !== -1
											) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: ESPERANDO POR PAGO";
											} else if (pieceMesssage.indexOf("FAIL") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: FALLIDA";
											} else if (
												pieceMesssage.indexOf("LEFT") !== -1 &&
												pieceMesssage.indexOf("MINUTES") !== -1 &&
												pieceMesssage.indexOf("OPERATION") !== -1
											) {
												msg = "Quedan 10 minutos para cerrar la operación";
											} else if (
												pieceMesssage.indexOf("OPERATION") !== -1 &&
												pieceMesssage.indexOf("TIMEOUT") !== -1
											) {
												msg = "El tiempo de operación ha expirado";
											} else if (pieceMesssage.indexOf("PAID") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: PAGADA";
											} else if (
												pieceMesssage.indexOf("was") !== -1 &&
												pieceMesssage.indexOf("created") !== -1
											) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha sido CREADA";
											} else if (pieceMesssage.indexOf("SUCCESS") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: EXITOSA";
											} else if (pieceMesssage.indexOf("CLAIM") !== -1) {
												msg =
													"La operación " +
													pieceMesssage[2].substring(
														pieceMesssage[2].length - 4,
														pieceMesssage[2].length,
													) +
													" ha cambiado su estado a: RECLAMO";
											} else if (
												m.message !== undefined &&
												m.message === "NEW_CHAT_MESSAGE"
											) {
												msg = "Ha recibido un nuevo mensaje en el chat";
											} else if (
												m.message !== undefined &&
												m.message === "PENDING_CHAT_MESSAGE"
											) {
												msg = "Tiene mensajes pendientes en el chat";
											} else {
												msg =
													"La operacion: " +
													m.id.substring(m.id.length - 4, m.id.length) +
													" tiene un nuevo mensaje del usuario: " +
													m.userName;
											}
										}
										let notif = {
											text: msg,
											value: m.redirectionPath,
											id: m.id,
											readed: m.readed,
											timestamp: m.timestamp,
										};
										if (!m.readed) unread++;
										notifications.push(notif);
									});
								}
								notifications = notifications
									.sort((a, b) => {
										return new Date(b.timestamp) - new Date(a.timestamp);
									})
									.filter(
										(thing, index, self) =>
											index === self.findIndex((t) => t.id === thing.id),
									);
								//unread = notifications.length;

								this.setState({
									notifications: notifications,
									countUnread: unread,
								});
								if (unread > 0) {
									this.togglePlay();
									this.setState({
										play: !this.state.play,
									});
								}
							} else if (notifications.length === 0) {
								let notif = {
									text: "No tiene mensajes para mostrar",
									value: "emptyNotifications",
									id: "empty",
								};
								notifications.push(notif);
								this.setState({
									notifications: notifications,
								});
							}
						} else {
							let notif = {
								text: "No tiene mensajes para mostrar",
								value: "emptyNotifications",
								id: "empty",
							};
							notifications.push(notif);
							this.setState({
								notifications: notifications,
							});
						}
					}
				}
			}
		}
	}

	togglePlay() {
		if (this._isMounted) {
			//this.setState({ play: !this.state.play });
			if (this.state.hasPermissionToPlaySound)
				setTimeout(
					this.state.play ? this.audio.play() : this.audio.pause(),
					2000,
				);
		}
	}

	onClickMessage = (e, data) => {
		let notification = this.state.notifications.find((n) => {
			return n.id === data.value;
		});
		let all = this.state.notifications;
		let index = this.state.notifications.indexOf(notification);
		if (index !== -1) {
			let ctUnread = this.state.countUnread;
			let url = notification.value;
			all[index].readed = true;
			ctUnread--;
			this.setState({
				notifications: all,
				countUnread: ctUnread,
			});
			this.props.actions.markAsReaded(notification.id, notification.timestamp);
			if (this.isURLValid(url)) {
				window.open(url, "_self");
			}
		}
	};

	onMessageReceivedChatRoom = (e, data) => {
		let notification = this.state.notifications.find((n) => {
			return n.id === data.value;
		});
		let all = this.state.notifications;
		let index = this.state.notifications.indexOf(notification);
		if (index !== -1) {
			let ctUnread = this.state.countUnread;
			let url = notification.value;
			all[index].readed = true;
			ctUnread--;
			this.setState({
				notifications: all,
				countUnread: ctUnread,
			});
			this.props.actions.markAsReaded(notification.id, notification.timestamp);
			if (this.isURLValid(url)) {
				window.open(url, "_self");
			}
		}
	};

	isURLValid = (url) => {
		return (
			url !== "none" &&
			url !== "NONE" &&
			url !== "emptyNotifications" &&
			url !== ""
		);
	};
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
	render() {
		let notifications = this.state.notifications;
		/*let notifications= this.state.notifications;
    let countUnread= this.state.countUnread;*/
		////console.log(notifications+"--"+countUnread);
		let notificationsRead, notificationsUnread;

		notificationsRead = notifications.filter((n) => {
			return n.readed;
		});
		notificationsUnread = notifications.filter((n) => {
			return !n.readed;
		});
		return (
			<Menu.Item>
				<Popup
					open={this.state.openPopup}
					position='bottom center'
					size='small'
					style={{ top: "50px", right: "30px" }}>
					<Grid>
						<Grid.Row>
							<Grid.Column textAlign='justified'>
								<Header textAlign='center' as='h5'>
									Autorizar audio
								</Header>
								<p>
									<small>
										Haga click en el botón para autorizar la reproducción de
										audio en esta sesión
									</small>
								</p>
								<Button
									size='mini'
									fluid
									color='blue'
									onClick={this.handleClickAcceptPermissionAudio}>
									Autorizar
								</Button>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column textAlign='justified'>
								<Header as='h6'>Autorización permanente</Header>
								<p>
									<small>
										Diríjase a configuraciones del navegador para autorizar a
										dollarBTC.com la reproducción automática de audio (solo para
										propósitos informativos sin publicidad de terceros)
									</small>
								</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Popup>
				{notificationsUnread.length > 0 && (
					<Label
						id='countUnreadInbox'
						circular
						floating
						className={
							window.sessionStorage.getItem("userType") === "ADMIN"
								? "badgestyle-admin"
								: "badgestyle"
						}>
						{notificationsUnread.length}
					</Label>
				)}
				<Dropdown
					fluid
					scrolling
					item
					text={
						<img
							alt=''
							src={icon}
							style={{ marginTop: "-5px", width: "35px", height: "25px" }}
						/>
					}
					icon={null}
					name='message'>
					<Dropdown.Menu className='left'>
						<Dropdown.Header content='No Leidas' />
						{notificationsUnread.length > 0 &&
							notificationsUnread.map((n) => (
								<Dropdown.Item
									id='itemMessageUnread'
									key={n.id}
									onClick={this.onClickMessage}
									value={n.id}>
									<div className='inboxMessage unread-message'>
										<p className='message-container'>
											<strong>{n.text.trim()}</strong>
										</p>
										<div className='date-message-align'>
											{this.formatDate(new Date(n.timestamp))}
										</div>
									</div>
								</Dropdown.Item>
							))}
						{notificationsUnread.length === 0 && (
							<Dropdown.Item id='itemMessage'>
								<div className='inboxMessage'>
									<p className='message-container'>
										No tiene notificaciones pendientes
									</p>
								</div>
							</Dropdown.Item>
						)}
						<Dropdown.Divider />
						<Dropdown.Header content='Leidas' />
						{notificationsRead.length > 0 &&
							notificationsRead.map((n) => (
								<Dropdown.Item
									key={n.id}
									onClick={this.onClickMessage}
									value={n.id}
									id='itemMessageRead'>
									<div
										className={
											this.isURLValid(n.url)
												? "inboxMessage readed-message"
												: "inboxMessage readed-message normal-cursor"
										}>
										<p className='message-container'>{n.text.trim()}</p>
										<div className='date-message-align'>
											{this.formatDate(new Date(n.timestamp))}
										</div>
									</div>
								</Dropdown.Item>
							))}
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Item>
		);
	}
}

export default InboxMessageAdmin;
