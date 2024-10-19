import React, { Component } from "react";
import {
	Button,
	Grid,
	Header,
	Icon,
	Input,
	Select,
	Segment,
	Message,
	Image,
	Label,
	Divider,
} from "semantic-ui-react";
import CustomerList from "./CustomerList/CustomerList";
import ChatBox from "./ChatBox/ChatBox";
import * as uuid from "uuid";
import Sockette from "sockette";
import chatApi from "../../../services/chat";
import user from "../../../services/user";
import utils from "../../../services/utils";
//import franc from "franc";
import logoUser from "../../../img/avatarNull.png";
import { isSafari } from "react-device-detect";
import alertSound from "../../../audio/to-the-point.mp3";
import Cookies from "universal-cookie";
import logo from "../../../img/miniIcon.png";
import iconClose from "../../../img/close-icon.svg";
import config from "../../../services/config";
import axios from "axios";
import userService from "../../../services/user";

class ChatAgent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messagesRead: [],
			messageUnread: [],
			automaticMessagesToShow: [],
			chatAll: [],
			chatByUser: [],
			isLoading: true,
			messageChat: "",
			chatUser: "",
			answer: "",
			text: "",
			chatold: [],
			adminUserName: "",
			language: "",
			languageSelected: "",
			roomSelected: "",
			name: "",
			subject: "",
			idiom: "",
			msg: null,
			socket: props.state.socketChat,
			email: "",
			showHeader: false,
			ctOnLineUsers: 0,
			onLineUsers: [],
			itemListClass: "item-normal",
			idChatUpdate: "",
			hasPermissionToPlaySound: !isSafari,
			play: false,
			lastTimeMessage: 0,
			searchLoad: false,
			// unRead: true,
		};
		this.source = alertSound;
		this.audio = new Audio(this.source);
		this.onClickChatRoom = this.onClickChatRoom.bind(this);
		this.sendAnswer = this.sendAnswer.bind(this);
		// this.onChangeAnswer = this.onChangeAnswer.bind(this);
		this.onMessageReceivedChatRoom = this.onMessageReceivedChatRoom.bind(this);
		this.countUnreadMesagges = this.countUnreadMesagges.bind(this);
		this.getListChatRooms = this.getListChatRooms.bind(this);
		//this.findAuthorMessage = this.findAuthorMessage.bind(this);
		this.compareDate = this.compareDate.bind(this);
		this.isOnline = this.isOnline.bind(this);
		this.changeStatusOnLineUser = this.changeStatusOnLineUser.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.togglePlay = this.togglePlay.bind(this);
		this.addResponseMessage = this.addResponseMessage.bind(this);
		this.addAdminMessage = this.addAdminMessage.bind(this);
		this.initWebSocketChatAdmin = this.initWebSocketChatAdmin.bind(this);
	}
	componentDidMount() {}
	componentWillUnmount() {}
	componentWillReceiveProps(nextProps, nextContext) {}

	markAdminMessagesAsReaded(name, subject, idiom) {
		//let subject = "GENERAL";

		chatApi
			.markAdminMessagesAsReaded(name, subject, idiom)
			.then((resp) => {
				// this.setState((state) => {
				let chatAll = [];
				let trueChat = [];
				let falseChat = [];

				const a = this.state.chatAll.map((item) => {
					if (item.name === name) {
						item.notReadedMessages = false;
						return item;
					} else {
						return item;
					}
				});
				for (let c of a) {
					if (c.notReadedMessages !== false) {
						trueChat.push(c);
					} else {
						falseChat.push(c);
					}
				}
				for (let t of trueChat) {
					chatAll.push(t);
				}
				for (let f of falseChat) {
					chatAll.push(f);
				}
				// return chatAll;
				this.setState({
					chatAll: chatAll,
				});
				// });
			})
			.catch((error) => {});
	}

	filterFunction(e, data) {
		if (data.value !== "") {
			const newData = this.state.chatold.filter(function (item) {
				const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();

				const textData = data.value.toUpperCase();
				if (itemData.indexOf(textData) > -1) {
					return itemData;
				}
			});
			this.setState({
				chatAll: newData,
				text: data.value,
			});
		} else {
			this.setState({
				chatAll: this.state.chatold,
				text: data.value,
			});
		}
	}
	MakeStatelanguage(e, value) {
		this.setState({
			languageSelected: value.value,
		});
	}

	MakeStaterooms(e, value) {
		this.setState({
			roomSelected: value.value,
		});
	}
	getListChatRooms(e, data) {
		this.setState({
			searchLoad: true,
			showHeader: false,
		});
		let chatAll = [];
		let trueChat = [];
		let falseChat = [];
		let listChat = {
			userName: "",
			subject: this.state.roomSelected,
			language: this.state.languageSelected,
			notReadedMessages: this.state.notReadedMessagesSelected,
		};

		chatApi
			.getAllChatRooms(listChat)
			.then((resp) => {
				console.log(resp);
				this.setState({
					isLoading: false,
				});
				let chatRooms = resp.data;
				for (let chatRoom of chatRooms) {
					let room = {
						subject: chatRoom.subject,
						language: chatRoom.language,
						notReadedMessages: chatRoom.notReadedMessages,
						name: chatRoom.userName,
					};
					if (room.notReadedMessages === true) {
						trueChat.push(room);
					} else {
						falseChat.push(room);
					}
				}
				for (let t of trueChat) {
					chatAll.push(t);
				}
				for (let f of falseChat) {
					chatAll.push(f);
				}

				this.setState({
					chatAll: chatAll,
					chatold: chatAll,
					searchLoad: false,
				});
			})
			.catch((error) => {
				this.setState({
					isLoading: false,
				});
			});
	}

	onClickChatRoom(name, subject, language) {
		this.setState({
			showHeader: true,
			name: name,
			subject: subject,
			idiom: language,
			itemListClass: "item-normal",
			msg: [],
			//  unRead: false,
		});

		this.initWebSocketChatAdmin(name);
		this.markAdminMessagesAsReaded(name, subject, language);
	}
	//========> cargar mensajes anteriores de esa sala de chat
	/*  retryAdminMessages(begin, end){
    chatApi
      .getAdminMessages(begin, end)  //cambiar por servicio de sala de chat selecionada
      .then(resp=>{

        let arraymessage = resp.data.messages;
        let datamessages = arraymessage.data;
        for(let message of datamessages){
          if (message.adminUserName!==undefined && message.adminUserName!==""){
            this.addAdminMessage(message.message);
          }
          else{
            this.addUserMessage(message.message);
          }
        }
      })
      .catch(error=>{
        console.log("Error retrying admin messages, ", error);
        this.setState({
          isLoading:false
        })
      })
  }*/
	//========> fin de cargar mensajes anteriores de esa sala de chat
	//========> inicializacion de websocket para esa sala de chat
	initWebSocketChatAdmin(userName) {
		let url = "wss:websocket.dollarbtc.com/chat";
		const socketChatAdmin = new Sockette(url, {
			onopen: (e) => this.onConnectedChatRoom(e),
			onmessage: (e) => this.onMessageReceivedChatRoom(e),
			onerror: (e) => this.onErrorChatRoom(e),
			onclose: (e) => this.onCloseChatRoom(e),
			onreconnect: (e) => {},
		});
		this.setState({
			socketChatAdmin,
		});
	}
	onConnectedChatRoom(e) {
		let st = {
			method: "getMessages",
			params: {
				websocketKey: uuid.v4(),
				userName: this.state.name,
				subject: this.state.roomSelected,
				language: this.state.languageSelected,
				side: "Admin",
			},
		};

		if (this.state.socketChatAdmin !== null) {
			try {
				this.state.socketChatAdmin.json(st);
			} catch (e) {}
		}
	}
	onErrorChatRoom(error) {}
	onCloseChatRoom(e) {}
	//========> fin de websocket
	//========> envio de mensajes del admin
	sendAnswerAutomatic(e) {
		// e.preventDefault();
		if (e !== "") {
			let text = e;
			let chatBody = {
				userName: this.state.name,
				name: this.state.name,
				message: text,
				subject: this.state.subject,
				language: this.state.idiom,
				adminUserName: window.sessionStorage.getItem("email"),
				privateMessage: false,
			};
			this.setState({
				answer: "",
			});

			chatApi.postMessage(chatBody);
		}
	}
	sendAnswer(e) {
		// e.preventDefault();
		if (this.state.answer !== "") {
			/* let languageText = franc(this.state.answer, {
        minLength: 2,
        only: ["spa", "eng"]
      });*/
			let text = this.state.answer;
			let chatBody = {
				userName: this.state.name,
				name: this.state.name,
				message: text,
				subject: this.state.subject,
				language: this.state.idiom,
				adminUserName: window.sessionStorage.getItem("email"),
				privateMessage: false,
			};
			this.setState({
				answer: "",
			});

			chatApi.postMessage(chatBody);
			//this.setState({msg:[...this.state.msg,chatBody]})
			// this.addAdminMessage(chatBody);
		}
	}
	addAdminMessage(message) {
		if (message !== undefined) {
			this.setState({ msg: [...this.state.msg, message.message] });
			chatApi.postMessage(message);
		}
	}
	//========> fin de envio de mensajes del admin
	//========> respuesta de mensajes del usuario
	addResponseMessage(message) {
		let c = this.state.conversation;
		c.push(
			<div>
				<Image src={logoUser} avatar style={{ float: "left" }} />
				<div className='ballon-user'>{message}</div>
			</div>,
		);
		this.setState(
			{
				conversation: c,
			},
			() => {
				if (this.state.isWindowsVisible) this.scrollToBottom();
			},
		);
	}
	onMessageReceivedChatRoom(payload) {
		if (payload.data.startsWith("{")) {
			let response = JSON.parse(payload.data);
			if (response.method === "oldMessages") {
				let data = response.params.data;
				if (this.state.msg.length === 0) {
					if (data !== undefined) {
						this.setState({
							msg: data,
						});
					}
				}
			}
			if (response.method === "currentMessages") {
				if (response.params.userName === this.state.name) {
					let data = response.params.data;
					if (data !== undefined) {
						for (let val of data) {
							this.setState({ msg: [...this.state.msg, val] }, () =>
								console.log(this.state.msg),
							);
						}
					}
				}
			}
		}
	}
	handleMessage = (e) => {
		let newMessage = e.target.value;
		this.setState({
			answer: newMessage,
		});
	};

	countUnreadMesagges() {
		let ct = 0;
		ct++;
		return ct;
	}
	//========> fin de envio de mensajes del usuario

	/*  countUnreadMesagges(messages){
    let ct=0;
    messages.map(m=>{
      if(!m.delivered)
        ct++;
    });
    return ct;
  }*/

	/* findAuthorMessage(messages){
    let result = messages.find(m=>m.sender !== "admin");
    return {
      isRegister: result.user.type === "REGISTER",
      name: result.user.name,
      username: result.user.username
    };
  }*/

	/* retryChatAdminMessages(begin, end){
    chatApi
      .getAdminMessages(begin, end)
      .then(resp=> {
        if(resp.data.payload !== null) {
          let unread = this.state.unreadMessages;
          let ctPendingMessages = resp.data.payload.length;
          if(ctPendingMessages>0){
            this.pushNewChatNotification("PENDING_CHAT_MESSAGE");
          }
        }
      })
      .catch(error=>{
        console.log("Error retrying admin messages, ", error);
      })
  }*/
	// onChangeAnswer(e, data){
	//   console.log('valor de data.value');
	//   console.log(data.value);
	//   console.log('valor state text');
	//   console.log(this.state.text);
	//   console.log('antes');
	//   console.log(this.state.answer);
	//   this.setState({
	//     answer: data.value,
	//     text: this.state.answer
	//   })
	//   console.log('despues');
	//   console.log(this.state.answer);
	//   console.log('despues texto');
	//   console.log(this.state.text);
	// }
	markMessagesAsRead(messages) {
		let idsUnread = [];
		messages.map((m) => {
			if (!m.delivered) idsUnread.push(m.id);
		});
		if (idsUnread !== undefined && idsUnread.length > 0) {
			chatApi
				.markAsRead(idsUnread)
				.then((resp) => {
					if (resp.data.payload === "OK") {
						this.retryAdminMessages(0, 100);
					}
				})
				.catch((error) => {
					console.log("An error occurred marking msg as read", error);
				});
		}
	}
	compareDate(a, b) {
		return b.lastDate - a.lastDate;
	}
	changeStatusOnLineUser(user, value) {
		let messageAll = this.state.messageAll;
		let index = messageAll.findIndex((m) => m.author === user);
		if (index >= 0) {
			messageAll[index].isOnline = value;
			this.setState({
				messageAll,
			});
		}
	}
	//===MENSAJES EN AUTOMATICO===

	// loadAutomaticMessage = (id, messageToLoad) => {
	loadAutomaticMessage = (messageToLoad) => {
		this.setState({ messageToSend: messageToLoad });
		if (
			messageToLoad !== "" ||
			(this.state.selectedFile !== null &&
				this.state.selectedFile !== undefined)
		) {
			this.setState({
				loadingSendButton: true,
				sendingAutomaticMessage: true,
			});
		}
	};
	//================
	isOnline(user, arrUser) {
		return arrUser.findIndex((u) => u === user) >= 0;
	}
	onKeyPress(e) {
		if (e.charCode === 13) {
			if (this.state.answer && this.state.answer.trim().length) {
				this.sendAnswer(e);
			}
		}
	}
	togglePlay() {
		//if (this._isMounted) {
		this.setState({ play: !this.state.play }, () => {
			if (this.state.hasPermissionToPlaySound)
				this.state.play ? this.audio.play() : this.audio.pause();
		});
		//}
	}
	render() {
		// const salas = [{ key: "ge", value: "GENERAL", text: "General" }];
		const salas = [
			{ key: "ge", value: "GENERAL", text: "General" },
			{ key: "mc", value: "MONEYCLICK", text: "MoneyClick" },
			{ key: "buy", value: "BUY", text: "Compras" },
			{ key: "sell", value: "SELL", text: "Ventas" },
			{ key: "hft", value: "HFT", text: "Planes Hft" },
		];

		const idiomas = [
			{ key: "es", value: "ES", text: "Español" },
			{ key: "en", value: "EN", text: "Ingles" },
		];

		const automaticMessagesToShowEs = [
			"Buenos Dìas.",
			"Buenas Tardes.",
			"Buenos Noches.",
			"Espere un minuto , por favor.",
		];
		const automaticMessagesToShowEn = [
			"Good Morning.",
			"Good Afternoon.",
			"Good Evening.",
			"Wait a minute , please.",
		];

		return (
			<Grid celled='internally'>
				<Grid.Column computer={5} largeScreen={5} mobile={16} tablet={5}>
					<Grid.Row>
						<Grid.Column computer={16} largeScreen={16} mobile={16} tablet={16}>
							<label>Salas:</label>{" "}
							<Select
								style={{ marginLeft: 15 }}
								search
								placeholder='Seleccione una Sala'
								options={salas}
								onChange={this.MakeStaterooms.bind(this)}
								value={this.state.roomSelected}
							/>
							<Divider hidden></Divider>
							<label>Idioma:</label>{" "}
							<Select
								search
								placeholder='Seleccione un idioma'
								options={idiomas}
								onChange={this.MakeStatelanguage.bind(this)}
								value={this.state.languageSelected}
							/>
							<Divider hidden></Divider>
							<Button
								type='submit'
								onClick={this.getListChatRooms}
								color='blue'
								style={{ marginLeft: 80 }}
								loading={this.state.searchLoad}>
								<Icon name='search' />
								Buscar
							</Button>
							<Divider hidden></Divider>
						</Grid.Column>
					</Grid.Row>

					<CustomerList
						{...this.state}
						onClickChatRoom={this.onClickChatRoom.bind(this)}
						filter={this.filterFunction.bind(this)}
					/>
				</Grid.Column>
				<Grid.Column computer={7} largeScreen={7} mobile={16} tablet={7}>
					<Segment.Group>
						{this.state.showHeader === false && (
							<Segment placeholder>
								<Header icon>
									<Icon name='conversation' />
									Seleccione un chat para comenzar
								</Header>
							</Segment>
						)}
						{this.state.showHeader === true && (
							<div>
								<Segment>
									<Header as='h4'>
										<Icon name='user' />
										<Header.Content>{this.state.name}</Header.Content>
									</Header>
								</Segment>
								<ChatBox {...this.state} />
							</div>
						)}

						<Segment>
							<Grid>
								<Grid.Row>
									<Grid.Column
										computer={16}
										largeScreen={16}
										mobile={16}
										tablet={16}>
										<Input
											type='text'
											action
											fluid
											value={this.state.answer}
											onKeyPress={this.onKeyPress}
											placeholder='Escriba su respuesta aquí... '
											onChange={this.handleMessage.bind(this)}
											disabled={this.state.showHeader === false}>
											{/* onChange={this.onChangeAnswer} */}
											<input />
											<Button
												type='submit'
												icon='send'
												color='blue'
												disabled={
													!(
														this.state.answer && this.state.answer.trim().length
													)
												}
												onClick={this.sendAnswer}
											/>
										</Input>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					</Segment.Group>
				</Grid.Column>
				<Grid.Column computer={4} largeScreen={4} mobile={16} tablet={4}>
					<Segment
						style={{
							marginTop: 5,
							width: 305,
							marginLeft: 12,
						}}>
						<Grid.Row>
							<Grid.Column>
								<Header as='h4'>Mensajes predeterminados</Header>
							</Grid.Column>
						</Grid.Row>
						<Divider fitted />
						<Grid.Row>
							{this.state.idiom === "ES" && (
								<Grid.Column>
									{automaticMessagesToShowEs.map((automaticMessage) => (
										<Button
											key={automaticMessage}
											compact
											size='mini'
											style={{ marginBottom: 5 }}
											onClick={() => {
												this.sendAnswerAutomatic(automaticMessage);
											}}>
											{automaticMessage}
										</Button>
									))}
								</Grid.Column>
							)}
							{this.state.idiom === "EN" && (
								<Grid.Column>
									{automaticMessagesToShowEn.map((automaticMessage) => (
										<Button
											key={automaticMessage}
											compact
											size='mini'
											style={{ marginBottom: 5 }}
											onClick={() => {
												this.sendAnswerAutomatic(automaticMessage);
											}}>
											{automaticMessage}
										</Button>
									))}
								</Grid.Column>
							)}
						</Grid.Row>
					</Segment>
				</Grid.Column>
			</Grid>
		);
	}
}

export default ChatAgent;
