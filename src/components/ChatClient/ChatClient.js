import React, { Component } from "react";
import "./ChatClientForm/ChatClientForm.css";
import logo from "../../img/miniIcon.png";
import translate from "../../i18n/translate";
import franc from "franc";
import {
  Button,
  Header,
  Image,
  Segment,
  Grid,
  Label,
  Divider
} from "semantic-ui-react";
import iconChat from "../../img/chat-bubbles.svg";
import iconClose from "../../img/close-icon.svg";
import logoUser from "../../img/avatarNull.png";
import TextArea from "react-textarea-autosize";
import uuid from "uuid";
import Sockette from "sockette";
import chatApi from "../../services/chat";
import utils from "../../services/utils";
import user from "../../services/user";
import { isSafari } from "react-device-detect";
import alertSound from "../../audio/to-the-point.mp3";
import Cookies from "universal-cookie";
import { ProgressIndicator } from "office-ui-fabric-react";
const cookies = new Cookies();

class ChatClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      pathname: "",
      isAuth: window.sessionStorage.getItem("auth") === "true",
      chatContactInfo: props.infoChat,
      conversation: [],
      previousMessages: [],
      isWindowsVisible: false,
      socket: null,
      username: "",
      subject: "",
      message: "",
      persisted: "",
      va: "",
      email: "",
      idiom:"",
      ctUnread: 0,
      idsUnread: [],
      hasPermissionToPlaySound: !isSafari,
      play: false,
      lastTimeMessage: 0,
      openSocket: false
    };
    this.el = React.createRef();
    this.source = alertSound;
    this.audio = new Audio(this.source);
    this.addResponseMessage = this.addResponseMessage.bind(this);
    this.addUserMessage = this.addUserMessage.bind(this);
    this.dropMessages = this.dropMessages.bind(this);
    this.toggleWidget = this.toggleWidget.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.onSubmitMessage = this.onSubmitMessage.bind(this);
    this.init = this.init.bind(this);
    this.initWebSocket = this.initWebSocket.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    // this.retryPreviousMessages = this.retryPreviousMessages.bind(this);
    //  this.markMessagesAsRead = this.markMessagesAsRead.bind(this);
    //  this.addDividerMessages = this.addDividerMessages.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }
  componentWillUnmount() {
    if (this.state.socket !== null) {
      this.state.socket.close();
    }
    this.dropMessages();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  componentDidMount() {
    this.init();
    let varSub;
    if (this.state.isWindowsVisible) this.scrollToBottom();
    if (window.location.pathname === "/buy") {
      varSub = "BUY"
    }
    else if  (window.location.pathname === "/sell") {
      varSub = "SELL"
    }
    else if  (window.location.pathname === "/HFTplans") {
      varSub = "HFT"
    }else{
      varSub = "GENERAL"
    }
    this.setState({
      subject: varSub
    });
    
  }

  init() {
    let auth = window.sessionStorage.getItem("auth") === "true";
    let username = "",
      email;
    if (auth) {
      email = window.sessionStorage.getItem("email");
    }
    if (
      this.state.chatContactInfo.name !== undefined &&
      this.state.chatContactInfo.name !== ""
    ) {
      this.dropMessages();
      this.addResponseMessage(
        this.state.translator("chat.welcome") + this.state.chatContactInfo.name
      );
      this.addResponseMessage(
        this.state.translator("chat.messageWelcomeRegister")
      );
      username = this.state.chatContactInfo.name;
      email = this.state.chatContactInfo.email;
      //cuando se ejecuta realemnte
      if (this.state.chatContactInfo.messages.length > 0) {
        let msgs = this.state.chatContactInfo.messages;
        let isToday = false;
        msgs.map(m => {
          if (m.sender === "admin") this.addResponseMessage(m.msg);
          else this.addUserMessage(m.msg);
          isToday = utils.isToday(new Date(m.time));
        });
        if (!isToday) {
        }
        this.addDividerMessages(this.state.translator("chat.todayLabel"));
      } //==========
      this.toggleWidget();
    } else if (!auth) {
      this.dropMessages();
      this.addResponseMessage(this.state.translator("chat.welcome"));
      this.addResponseMessage(
        this.state.translator("chat.messageWelcomeUnregister")
      );
    } else {
      let welcomeMessage = "";
      welcomeMessage = window.sessionStorage.getItem("firstName");
      if (welcomeMessage === null || welcomeMessage === "") {
        welcomeMessage = window.sessionStorage.getItem("nickname");
        if (welcomeMessage === null || welcomeMessage === "")
          welcomeMessage = window.sessionStorage.getItem("username");
      }
      username = welcomeMessage;
      this.dropMessages();
      //this.retryPreviousMessages(email, welcomeMessage);
      //console.log('ejecutado retrypreviousmessages');
      /* this.initWebSocket(email);
      console.log('ejecutado initsocket');*/
    }

    this.setState({
      pathname: window.location.pathname,
      isAuth: auth,
      username: username,
      email: email
    });
  }
  initWebSocket(user) {
    //  let url = "ws://192.168.0.105:8080/bushido-wallet-service/chat/";
    //let url ="wss://service8080.dollarbtc.com/bushido-wallet-service-1.0.3/chat/";

    let url = "wss:websocket.dollarbtc.com/chat";
    const socket = new Sockette(url, {
      // timeout: 5e3,
      onopen: e => this.onConnected(e),
      onmessage: e => this.onMessageReceived(e),
      onerror: e => this.onError(e),
      onclose: e => this.onClose(e),
      onreconnect: e => {
      }
    });
    this.setState({
      socket
    });
  }
  onConnected(e) {
   /* if (this.state.persisted === "") {
      let languageText = franc(this.state.message, {
        minLength: 2,
        only: ["spa", "eng"]
      });
      this.setState({ persisted: utils.determinateLanguage(languageText) });
    }*/

    let wsId = window.sessionStorage.getItem("chatSocketId", wsId);
    if (wsId === null || wsId === "") {
      wsId = uuid.v4();
      window.sessionStorage.setItem("chatSocketId", wsId);
    }
    
    

    let chatBody = {
      method: "getMessages",
      params: {
        websocketKey: wsId,
        userName: this.state.username,
        //subject: "GENERAL",
        subject: this.state.subject,
        language: this.state.idiom, //"ES"
        side: "User",
      },
    };

    try {
      this.state.socket.json(chatBody);
      this.setState({
        message: "",
        openSocket: true
      });
    } catch (e) {}
  }
  onError(error) {
  }
  onMessageReceived(payload) {
    // console.log("recibiendo");
    // console.log(payload.data);
    if (payload.data.startsWith("{")) {
      let response = JSON.parse(payload.data);

      if (response.method === "currentMessages") {
        let data = response.params.data;
        for (let message of data) {
          if (
            message.adminUserName !== undefined &&
            message.adminUserName !== ""
          ) {
            // console.log("cargando nuevos mensajes");
            // console.log(message.message);
            this.addResponseMessage(message.message);
            if (!this.state.isWindowsVisible) {
              let ct = this.state.ctUnread;
              ct++;
              this.setState(
                {
                  ctUnread: ct
                },
                () => {
                  this.togglePlay();
                }
              );
            }
          }
        }
      }

      // if (payload.data.startsWith("{")) {
      //   let response = JSON.parse(payload.data);
      //   //console.log(response);

      //
      //   //console.log('mensaje de respuesta',response.message);

      //  /* if (this.state.lastTimeMessage !== response.time)
      //     if (response.sender === this.state.email)
      //       this.addUserMessage(response.msg);
      //     else if (response.sender !== this.state.email)
      //       this.addResponseMessage(response.msg);*/
      // } else if (payload.data.startsWith("Username ")) {
      /* let r = this.state.translator("chat.userTaken");
      if (!this.state.isWindowsVisible) {
        let ct = this.state.ctUnread;
        ct++;
        this.setState(
          {
            ctUnread: ct
          },
          () => {
            this.togglePlay();
          }
        );
      }
      this.addResponseMessage(r);
    }*/
    }
  }
  onClose(e) {
    /* let languageText = franc(this.state.message, {
      minLength: 2,
      only: ["spa", "eng"]
    });
    let wsId = null;
    //if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
   /*   window.sessionStorage.setItem("chatSocketId", wsId);
    } else {
      wsId = webSocketId;
    }
    console.log("Closed", e);
    let chatBody = {
      method: "getMessages",
      params: {
        websocketKey: wsId,
        userName: this.state.email,
        subject: "GENERAL",
        languaje: utils.determinateLanguage(languageText),
        side: "User"
      }
    };
    this.state.socket.json(chatBody);*/
  }

  /*  openSocketStatus() {
    this.setState({
      socket: new Sockette("wss:websocket.dollarbtc.com/chat", {
        onopen: e => {
          this.socketReadyStatus(e);
        }, onmessage: e => {
          this.handleStatus(e.data);
        }

      })
    });
  }*/

  /*socketReadyStatus(e) {
    let languageText = franc(this.state.message, {
      minLength: 2,
      only: ["spa", "eng"]
    });
    let wsId = null;
    //if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
   /*   window.sessionStorage.setItem("chatSocketId", wsId);
    } else {
      wsId = webSocketId;
    }
    console.log("entrando a socket ready status");

    let st = {
      method: "getMessages",
      params: {
        websocketKey: wsId,
        userName: this.state.email,
        subject: "GENERAL",
        languaje: utils.determinateLanguage(languageText),
        side: "User"
      }
    };
    
    if (this.state.socket !== null) {
      console.log(this.state.socket);
      try {
        console.log('entrando al try');
        this.state.socket.json(st);
      } catch (e) {
        console.log('entrando a catch');
      }
    }
  }
  handleStatus(res) {
    console.log('entrando en el onmenssage');
    console.log(res);
    if (this._Mounted) {
      let result = JSON.parse(res);
      if (result !== undefined) {
        console.log(result);
      }
      //console.log(this.state.transactionTable);
    }
  }*/
  addResponseMessage(message) {
    let c = this.state.conversation;
    c.push(
      <div>
        <Image src={logo} avatar style={{ float: "left" }} />
        <div className="ballon">{message}</div>
      </div>
    );
    this.setState(
      {
        conversation: c
      },
      () => {
        if (this.state.isWindowsVisible) this.scrollToBottom();
      }
    );
  }
  addUserMessage(message) {
    let c = this.state.conversation;

    c.push(
      <div>
        <Image src={logoUser} avatar style={{ float: "right" }} />
        <div className="ballon-user">{this.state.message}</div>
      </div>
    );
    // console.log(this.state.message);
    if (this.state.openSocket === false) {
      this.initWebSocket(this.state.email);
    }
    this.setState(
      {
        conversation: c
      },
      () => {
        if (this.state.isWindowsVisible) this.scrollToBottom();
      }
    );
    chatApi.postMessage(message);
    if (this.state.openSocket !== false) {
      this.setState({
        message: ""
      });
    }
  }
  addDividerMessages(text) {
    let c = this.state.conversation;
    c.push(<Divider horizontal>{text}</Divider>);
    this.setState({
      conversation: c
    });
  }
  dropMessages() {
    this.setState({
      conversation: []
    });
  }
  toggleWidget() {
    this.setState({
      isWindowsVisible: true
    });
  }
  togglePlay() {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  }

  handleMessage = e => {
    let newMessage = e.target.value;
    this.setState({
      message: newMessage
    });
  };

  onSubmitMessage(e) {
    let idiom = "";
    let chatBody = {};
    if (this.state.message !== "") {
      
      // this.setState({ va: this.state.message });
      if (this.state.idiom === "") {
      let languageText = franc(this.state.message, {
        minLength: 2,
        only: ["spa", "eng"]
      });
      
      idiom = utils.determinateLanguage(languageText)
      chatBody = {
        userName: this.state.username,
        name: window.sessionStorage.getItem("nickname"),
        message: this.state.message,
        //subject: "GENERAL",
        subject: this.state.subject,
        language: idiom,
        adminUserName: "",
        privateMessage: false,
      };

      this.setState({
        idiom:idiom
      })
      
    }else{
      // let text = this.state.message;
      chatBody = {
        userName: this.state.username,
        name: window.sessionStorage.getItem("nickname"),
        message: this.state.message,
        //subject: "GENERAL",
        subject: this.state.subject,
        language: this.state.idiom,
        adminUserName: "",
        privateMessage: false,
      };
    }
      this.addUserMessage(chatBody);
    }
  }

  onClickButton() {
    this.setState(
      {
        isWindowsVisible: !this.state.isWindowsVisible,
        ctUnread: 0
      },
      () => {
        if (this.state.ctUnread > 0 && this.state.isWindowsVisible) {
          //  this.markMessagesAsRead();
        } else if (this.state.isWindowsVisible) {
          this.scrollToBottom();
        }
      }
    );
  }
  onKeyPress(e) {
    if (e.charCode === 13) {
      if (this.state.message && this.state.message.trim().length) {
        this.onSubmitMessage(e);
      }
    }
  }
  scrollToBottom = () => {
    const scrollHeight = this.messageListClient.scrollHeight;
    const height = this.messageListClient.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageListClient.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  render() {
    let t = this.state.translator;
    return (
      <div>
        {this.state.ctUnread > 0 && (
          <Label circular floating color="red">
            {this.state.ctUnread}
          </Label>
        )}
        <Button className="floating-chat" onClick={this.onClickButton}>
          {this.state.ctUnread > 0 && (
            <Label circular floating color="red">
              {this.state.ctUnread}
            </Label>
          )}
          {!this.state.isWindowsVisible && (
            <Image src={iconChat} alt="img" size="mini" />
          )}
          {this.state.isWindowsVisible && (
            <Image
              src={iconClose}
              avatar
              alt="img"
              size="mini"
              style={{ marginRight: "0px" }}
            />
          )}
        </Button>
        {this.state.isWindowsVisible && (
          <div className="window">
            <Header
              attached="top"
              textAlign="center"
              as="h4"
              className="window-header"
            >
              {t("chat.headerTitle")}
              <br />
              <p className="window-subheader">{t("chat.subtitle")}</p>
            </Header>
            <Segment
              attached
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <div
                className="container-messages"
                ref={el => {
                  this.messageListClient = el;
                }}
              >
                {this.state.conversation.map(c => (
                  <div className="message" key={uuid.v4()}>
                    {c}
                  </div>
                ))}
                <div
                  ref={el => {
                    this.el = el;
                  }}
                />
                <br />
              </div>
            </Segment>
            <Segment attached="bottom" className="chat-bottom">
              <Grid>
                <Grid.Column width={13}>
                  <TextArea
                    className="chat-textarea"
                    value={this.state.message}
                    onKeyPress={this.onKeyPress.bind(this)}
                    autoFocus
                    maxRows={3}
                    minRows={1}
                    onChange={this.handleMessage.bind(this)}
                    style={{ width: "290px" }}
                  />
                </Grid.Column>
                <Grid.Column width={3} style={{ paddingLeft: "0px" }}>
                  <Button
                    onClick={this.onSubmitMessage}
                    disabled={
                      !(this.state.message && this.state.message.trim().length)
                    }
                    circular
                    icon="send"
                    color="blue"
                  />
                </Grid.Column>
              </Grid>
            </Segment>
          </div>
        )}
      </div>
    );
  }
}

export default translate(ChatClient);
