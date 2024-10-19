import React, {Component} from 'react'
import {Segment, Header, Input, Icon, Image, Form, Button, Label} from "semantic-ui-react";
import logo from "../../../img/miniIcon.png";
import iconChat from "../../../img/chat-bubbles.svg";
import iconClose from "../../../img/close-icon.svg";
import "./ChatClientForm.css"
import translate from "../../../i18n/translate";
import Cookies from "universal-cookie";
import chatApi from "../../../services/chat";
import uuid from "uuid";
import utils from "../../../services/utils";
const cookies = new Cookies();
class ChatClientForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      isWindowsVisible: false,
      userName:"",
      userEmail:"",
      errorType:"",
      errors:{
        name:"",
        email:""
      },
      success:false,
      translator: props.translate,
      handleRegister: props.handleRegister
    };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.blankErrors = this.blankErrors.bind(this);
    this.blankFields = this.blankFields.bind(this);
    this.saveSession = this.saveSession.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  onSubmitForm(e){
    e.preventDefault();
    if(this.validateFields()){
      
     // let previousSession = cookies.get(utils.getSessionChatUnregisterKey());
     // if(previousSession !== undefined){
        // console.log("if1");
        // console.log(previousSession);
        // console.log(previousSession.email);
        // console.log(this.state.userEmail);
        //previousSession = JSON.parse(previousSession);
       // if(previousSession.email === this.state.userEmail){
         // console.log("if1.1");
          //Retry previous messages
          // let previousMessages = [];
          // chatApi
          //   .getMessagesByUserUnregister(this.state.userEmail)
          //   .then(resp=>{
          //     console.log(resp.data.payload);
          //     previousMessages = resp.data.payload;
          //     this.saveSession(previousMessages, previousSession.key);
          //   })
          //   .catch(error=>{
          //     console.log("if catch 1.1");
          //     console.log(error);
          //   })
       // }else{
        //   console.log("else1.1");
        //   this.saveSession([], uuid.v4())
        // }
     // }else{ console.log("else1");
        this.saveSession([], uuid.v4())
     // }
    }
  }
  saveSession(messages, key){
    let expiration;
    let body;
    expiration = new Date();
    expiration.setDate((new Date()).getDate() + 1);
    body = {
      registered: true,
      name: this.state.userName,
      email: this.state.userEmail,
      key: key,
      messages:messages
    };
    cookies.set(utils.getSessionChatUnregisterKey(),JSON.stringify(body), {
      path: "/",
      expires: expiration
    });
    this.state.handleRegister(body);
  }
  onClickButton(){
    this.setState({
      isWindowsVisible: !this.state.isWindowsVisible
    })
  }
  onChangeName(e, data){
    this.setState({
      userName: e.target.value.toUpperCase()
    })
  }
  onChangeEmail(e, data){
    this.setState({
      userEmail: e.target.value.toLowerCase()
    })
  }
  validateFields(){
    if(this.state.userName===""){
      this.setState({
        errorType:"NAME",
        errors:{
          name:"chat.form.error.name",
          email:""
        }
      },()=>{
        this.blankErrors("NAME");
      });
      return false
    }
    if(this.state.userEmail === ""){
      this.setState({
        errorType:"EMAIL",
        errors:{
          name:"",
          email:"chat.form.error.email"
        }
      },()=>{
        this.blankErrors("EMAIL");
      });
      return false;
    }
    let regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(this.state.userEmail)){
      this.setState({
        errorType:"EMAIL",
        errors:{
          name:"",
          email:"chat.form.error.emailWrong"
        }
      },()=>{
        this.blankErrors("EMAIL");
      });
      return false;
    }

    return true;

  }
  blankErrors(type){
    var errors = {};
    if (type === "NAME") {
      errors = {
        name: this.state.errors.name,
        email: "",
      };

      setTimeout(() => {
        this.setState({ errorType: "", errors: errors });
      }, 4000);
    }
    if (type === "EMAIL") {
      errors = {
        name: "",
        email: this.state.errors.email,
      };
      setTimeout(() => {
        this.setState({ errorType: "", errors: errors });
      }, 4000);
    }
  }
  blankFields(){
    this.setState({
      userName:"",
      userEmail:"",
      errorType:"",
      errors:{
        name:"",
        email:""
      }
    })
  }

  render() {
    let t = this.state.translator;
    let errorName, errorEmail, errorMessage, message;
    if (this.state.errorType === "NAME") {
      errorName = (
        <Label basic color="red" pointing>
          {t(this.state.errors.name)}
        </Label>
      );
    }
    if (this.state.errorType === "EMAIL") {
      errorEmail = (
        <Label basic color="red" pointing>
          {t(this.state.errors.email)}
        </Label>
      );
    }
    return (
      <div className="fabs">
        <Button
          className="floating-chat"
          onClick={this.onClickButton}
        >
          {!this.state.isWindowsVisible && (
            <Image src={iconChat} alt="img" size="mini" />
          )}
          {this.state.isWindowsVisible && (
            <Image src={iconClose} avatar alt="img" size="mini" style={{ marginRight:"0px"}}/>
          )}
        </Button>
        {this.state.isWindowsVisible &&(
          <div className="window">
            <Header attached="top" textAlign="center" as="h4" className="window-header">
              {t("chat.headerTitle")}
             <br/>
              <p className="window-subheader">{t("chat.subtitle")}</p>
            </Header>
            <Segment attached >
              <div className="message">
                <Image src={logo} avatar style={{float:"left"}}/>
                <div className="ballon">
                  {t("chat.welcome")}
                </div>
              </div>
              <div className="message">
                <Image src={logo} avatar style={{float:"left"}}/>
                <div className="ballon">
                  {t("chat.messageWelcomeUnregister")}
                </div>
              </div>
              <Form
                error={this.state.errorType !== ""}
                success={this.state.success}
              >
                <Form.Field>
                  <Input iconPosition="left" placeholder={t("chat.form.name")} fluid>
                    <Icon name="user" />
                    <input type="text" value={this.state.userName} onChange={this.onChangeName} required/>
                  </Input>
                  {errorName}
                </Form.Field>
                <Form.Field>
                  <Input iconPosition='left' placeholder={t("chat.form.email")} fluid required>
                    <Icon name="at"/>
                    <input type="email" value={this.state.userEmail} onChange={this.onChangeEmail} />
                  </Input>
                  {errorEmail}
                </Form.Field>
              </Form>
            </Segment>
            <Header attached="bottom">
             <Button onClick={this.onSubmitForm} fluid color="blue" content={t("chat.form.buttonSend")}/>
            </Header>
          </div>
        )}
      </div>
    )
  }
}

export default translate(ChatClientForm);
