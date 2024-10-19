import React, {Component} from 'react'
import translate from "../../i18n/translate";
import { Widget, addResponseMessage, addUserMessage, dropMessages, toggleWidget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import "./ChatClient.css";
import logo from "../../img/miniIcon.png";
import franc from "franc";

class ChatClient2 extends Component {

  constructor(props){
    super(props);
    this.state= {
      translator: props.translate,
      pathname: "",
      isAuth: window.sessionStorage.getItem("auth") === "true",
      chatContactInfo: props.infoChat
    };
    this.updateMessages = this.updateMessages.bind(this);
  }
  componentWillUnmount() {
    dropMessages();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  componentDidMount() {
    let auth = window.sessionStorage.getItem("auth") === "true";
    this.setState({
      pathname: window.location.pathname,
      isAuth: auth
    },()=>{
      if(this.state.chatContactInfo.name !== undefined && this.state.chatContactInfo.name!== ""){
        dropMessages();
        addResponseMessage(this.state.translator("chat.welcome")+this.state.chatContactInfo.name);
        addResponseMessage(this.state.translator("chat.messageWelcomeRegister"));
        toggleWidget();
      }else if(!this.state.isAuth){
        dropMessages();
        addResponseMessage(this.state.translator("chat.welcome"));
        addResponseMessage(this.state.translator("chat.messageWelcomeUnregister"));
      }else{
        let welcomeMessage="";
        welcomeMessage = window.sessionStorage.getItem("firstName");
        if(welcomeMessage === null || welcomeMessage === ""){
          welcomeMessage = window.sessionStorage.getItem("nickname");
          if(welcomeMessage === null || welcomeMessage === "")
            welcomeMessage = window.sessionStorage.getItem("username");
        }
        dropMessages();
        addResponseMessage(this.state.translator("chat.welcome")+welcomeMessage);
        addResponseMessage(this.state.translator("chat.messageWelcomeRegister"))
      }
    })
  }

  handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    let languageText= franc(newMessage,{
      minLength: 2,
      only: ['spa', "eng"]
    });
    let username;
    console.log(languageText);
    if(this.state.isAuth){
      username=window.sessionStorage.getItem("email");
    }else{

    }
    addResponseMessage(newMessage);
  };

  updateMessages(infoChat){
    console.log(infoChat);
    if(infoChat.name !== undefined && infoChat.name!== ""){
      dropMessages();
      addResponseMessage(this.state.translator("chat.welcome")+infoChat.name);
      addResponseMessage(this.state.translator("chat.messageWelcomeRegister"));
      toggleWidget();
    }else if(!this.state.isAuth){
      dropMessages();
      addResponseMessage(this.state.translator("chat.welcome"));
      addResponseMessage(this.state.translator("chat.messageWelcomeUnregister"));
    }else{
      let welcomeMessage="";
      welcomeMessage = window.sessionStorage.getItem("firstName");
      if(welcomeMessage === null || welcomeMessage === ""){
        welcomeMessage = window.sessionStorage.getItem("nickname");
        if(welcomeMessage === null || welcomeMessage === "")
          welcomeMessage = window.sessionStorage.getItem("username");
      }
      dropMessages();
      addResponseMessage(this.state.translator("chat.welcome")+welcomeMessage);
      addResponseMessage(this.state.translator("chat.messageWelcomeRegister"))
    }

  }
  render() {
    let t = this.state.translator;
    /*let infoChat = this.props.infoChat;
    this.updateMessages(infoChat);*/
    return (
      <Widget
        handleNewUserMessage={this.handleNewUserMessage}
        title={t("chat.headerTitle")}
        subtitle={t("chat.subtitle")}
        profileAvatar={logo}
        senderPlaceHolder={t("chat.placeholderSender")}
      />
    )
  }
}

export default translate(ChatClient2);
