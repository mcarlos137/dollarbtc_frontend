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
import franc from "franc";
import logoUser from "../../../img/avatarNull.png";
import { isSafari } from "react-device-detect";
import alertSound from "../../../audio/to-the-point.mp3";
import Cookies from "universal-cookie";
import logo from "../../../img/miniIcon.png";
import iconClose from "../../../img/close-icon.svg";
const cookies = new Cookies();

class ConfigChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messagesRead: [],
			messageUnread: [],
			chatAll: [],
			chatByUser: [],
			isLoading: true,
			messageChat: "",
			chatUser: "",
			answer: "",
			adminUserName: "",
			language: "",
			name: "",
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
		};
		this.source = alertSound;
		this.audio = new Audio(this.source);
		this.onClickChatRoom = this.onClickChatRoom.bind(this);
		this.sendAnswer = this.sendAnswer.bind(this);
		this.onChangeAnswer = this.onChangeAnswer.bind(this);
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
	componentWillUnmount() {
		/*if(this.state.socket !== null){
      this.state.socket.close();
    }*/
	}
	componentWillReceiveProps(nextProps, nextContext) {
		/* if (this.props.state.newChatMessage !== nextProps.state.newChatMessage) {
      this.onMessageReceived(nextProps.state.chatStack);
    }*/
	}

	//========> Obtener listado de salas de chat
	/*onChangeCurrency(e, data){
    this.setState({
      language:data.value
    });
  }*/
	getListChatRooms(e, data) {
		let chatAll = [];

		let adminUserName = window.sessionStorage.getItem("email");
		chatApi
			.getAllChatRooms(adminUserName)
			.then((resp) => {
				this.setState({
					isLoading: false,
				});
				if (resp.data.errors === null) {
					let chatRooms = resp.data.payload;
					for (let chatRoom of chatRooms) {
						let arraymessage = chatRoom.messages;
						let type = arraymessage[0].user.type;

						if (arraymessage[arraymessage.length - 1].language === data.value) {
							let room = {
								id: chatRoom.id,
								count: arraymessage.length,
								type: type,
								name: chatRoom.userName,
								message: arraymessage,
							};
							chatAll.push(room);
						}
					}

					this.setState({ chatAll: chatAll });
					console.log(this.state.chatAll);
				}
			})
			.catch((error) => {
				this.setState({
					isLoading: false,
				});
			});
	}
	//========> al seleccionar sala de chat , se debe traer los ultimos mensajes almacenado en bushido
	//y ejecutarse el socket para esa sala de chat
	onClickChatRoom(name) {
		let arrayChatUser = this.state.chatAll.find(function (element) {
			return element.name === name;
		});

		if (arrayChatUser !== undefined) {
			this.setState({
				msg: arrayChatUser,
			});
		}
		this.setState({
			showHeader: true,
			name: name,
		});

		// chatApi.getMessagesByUser(adminUserName)
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
			onreconnect: (e) => {
				console.log("Trying to reconnect", e);
			},
		});
		this.setState({
			socketChatAdmin,
		});
	}
	onConnectedChatRoom(e) {
		let languageText = franc(this.state.messageChat, {
			minLength: 2,
			only: ["spa", "eng"],
		});
		let wsId = null;
		wsId = uuid.v4();
		let st = {
			method: "getMessages",
			params: {
				websocketKey: uuid.v4(),
				userName: this.state.userChat,
				subject: "GENERAL",
				language: utils.determinateLanguage(languageText),
				side: "Admin",
			},
		};
		if (this.state.socketChatAdmin !== null) {
			try {
				this.state.socketChatAdmin.json(st);
			} catch (e) {
				console.log("entrando a catch", e);
			}
		}
	}
	onErrorChatRoom(error) {
		console.log(`WebSocket error: ${error}`);
	}
	onCloseChatRoom(e) {}
	//========> fin de websocket
	//========> envio de mensajes del admin
	sendAnswer(e) {
		let languageText = franc(this.state.answer, {
			minLength: 2,
			only: ["spa", "eng"],
		});
		let lastTimeMessage = new Date().getTime();
		let chatBody = {
			userName: this.state.name,
			name: this.state.name,
			message: this.state.answer,
			subject: "GENERAL",
			language: utils.determinateLanguage(languageText),
			adminUserName: window.sessionStorage.getItem("email"),
			privateMessage: false,
		};

		this.addAdminMessage(chatBody);

		console.log("comenzara crear sala de chat para bushido");
		let chatBodyBushido = {
			msg: this.state.answer,
			receiver: this.state.name,
			time: new Date().getTime(),
			sender: window.sessionStorage.getItem("email"),
			type: "CHAT",
			user: {
				username: window.sessionStorage.getItem("email"),
				name: "ADMIN",
				loginDate: lastTimeMessage,
				type: this.state.isAuth ? "REGISTER" : "UNREGISTER",
			},
			language: utils.determinateLanguage(languageText),
			email: this.state.name,
			private: true,
			adminUserName: window.sessionStorage.getItem("email"),
		};

		chatApi
			.saveChatMessage(chatBodyBushido)
			.then((resp) => {
				console.log("entro a then de create chat bushido");
				console.log(resp.data);
			})
			.catch((error) => {
				console.log("catch , ", error);
			});

		// this.addAdminMessage(chatBody);
		e.preventDefault();
	}
	addAdminMessage(message) {
		let c = this.state.msg.message;
		let adminUserName = window.sessionStorage.getItem("email");

		c.push(
			<div>
				<Image src={logo} avatar style={{ float: "right" }} />
				<div className='ballon'>{this.state.answer}</div>
			</div>,
		);

		this.initWebSocketChatAdmin(adminUserName);
		this.setState(
			{
				msg: c,
			},
			() => {
				if (this.state.isWindowsVisible) this.scrollToBottom();
			},
		);

		chatApi.postMessage(message);
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

			if (response.method === "currentMessages") {
				let data = response.params.data;
				for (let message of data) {
					if (
						message.adminUserName === undefined &&
						message.adminUserName === ""
					) {
						this.addResponseMessage(message.message);
						// if (!this.state.isWindowsVisible) {

						let countMessagesUnread = this.countUnreadMesagges();
						this.setState(
							{
								//idChatUpdate: id,
								itemListClass: "item-newmessage",
								count: countMessagesUnread,
							},
							() => {
								this.togglePlay();
							},
						);
						//}
					}
				}
			}
		}
	}
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
	onChangeAnswer(e, data) {
		this.setState({
			answer: data.value,
		});
	}
	markMessagesAsRead(messages) {
		let idsUnread = [];
		messages.map((m) => {
			if (!m.delivered) idsUnread.push(m.id);
		});
		console.log(idsUnread);
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
		const salas = [{ key: "ge", value: "GENEREAL", text: "General" }];

		const idiomas = [
			{ key: "es", value: "ES", text: "Español" },
			{ key: "en", value: "EN", text: "Ingles" },
		];

		return (
			<Grid celled='internally'>
				<Grid.Column
					computer={4}
					largeScreen={4}
					mobile={16}
					tablet={4}></Grid.Column>
				<Grid.Column computer={8} largeScreen={8} mobile={16} tablet={8}>
					<Grid.Row></Grid.Row>
					<Grid.Row>
						<Grid.Column computer={5} largeScreen={5} mobile={16} tablet={5}>
							<label>Sala:</label> <Divider hidden></Divider>
							<label>Idiomas:</label> <Divider hidden></Divider>
						</Grid.Column>
						<Grid.Column
							computer={6}
							largeScreen={6}
							mobile={6}
							tablet={6}
							textAlign='center'>
							<Select
								search
								placeholder='Seleccione una Sala'
								options={salas}
							/>
							<Divider hidden></Divider>
							<Select
								search
								placeholder='Seleccione un Idioma'
								options={idiomas}
							/>
							<Divider hidden></Divider>
							<Button type='submit' onClick={this.sendAnswer} color='blue'>
								<Icon name='search' />
								Buscar
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid.Column>
				<Grid.Column
					computer={4}
					largeScreen={4}
					mobile={16}
					tablet={4}></Grid.Column>
			</Grid>
		);
	}
}

export default ConfigChat;
