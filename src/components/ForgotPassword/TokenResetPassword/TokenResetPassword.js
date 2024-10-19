import React, { Component } from "react";
import "./TokenResetPassword.css";
import { Header, Message, Divider, Button, Form ,Responsive} from "semantic-ui-react";

import config from "../../../services/config";
import axios from "axios";
import translate from "../../../i18n/translate";
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class TokenResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadForm: false,
      token: "",
      email: "",
      error: false,
      message: "",
      translator:props.translate
    };
  }
  componentWillReceiveProps(nextProps, nextContext){
    if(this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      })
    }
  }
  handleToken(e, data) {
    this.setState({ token: e.target.value });
    this.props.setToken(e.target.value);
  }
  handleConfirmToken() {
    if (this.state.token !== "") {
      this.setState({ loadForm: true });
      let url = URL_BASE_BUSHIDO + config.urlBushido.passwordResetInit;
      let body = {
        token: this.state.token
      };
      axios
        .post(url, body)
        .then(res => {
          //console.log(res);
          if (!res.data.errors || res.data.errors.length === 0) {
            if (res.data.payload === true) {
              this.setState({ loadForm: false });
              this.props.setToken(this.state.token);
              this.props.changeItem("code");
            } else {
              this.setState({ loadForm: false });
              this.props.setToken(this.state.token);
              this.props.changeItem("password");
            }
          } else {
            this.setState({
              loadForm: false,
              error: true,
              message: "tokenResetPassword.errors.failToken"
            });
          }
        })
        .catch(error => {
          this.setState({
            loadForm: false,
            error: true,
            message: "tokenResetPassword.errors.serverError"
          });
          //console.log(error);
        });
    } else {
      this.setState({
        error: true,
        message: "tokenResetPassword.errors.emptyToken"
      });
      setTimeout(() => {
        this.setState(
          {
            error: false,
            message: ""
          },
          3000
        );
      });
    }
  }
  cancelProces() {
    this.props.changeItem("sendToken");
  }
  render() {
    let mess;
    let t = this.state.translator;
    if (this.state.error) {
      mess = <Message info content={t(this.state.message)} />;
    }

    return (
      <div>
      <Responsive minWidth={992} >
     
        <p>
          {t("tokenResetPassword.message")}
        </p>
        <Form
          onSubmit={this.handleConfirmToken.bind(this)}
          loading={this.state.loadForm}
          error
          unstackable
        >
          <Form.Field>
            <label>Token</label>
            <input
              placeholder=""
              value={this.state.token}
              onChange={this.handleToken.bind(this)}
            />
          </Form.Field>
          <Header as="h5" textAlign="center">
            <Divider hidden />
            {mess}
            <Form.Button type="submit" color="blue" size="large">
              {t("tokenResetPassword.buttonContinue")}
            </Form.Button>
            <Divider hidden />
            <Button basic size="small" onClick={this.cancelProces.bind(this)}>
              {t("tokenResetPassword.buttonCancel")}
            </Button>
          </Header>
        </Form>
        </Responsive>
         <Responsive minWidth={0} maxWidth={991} >
         <p className="titleComponentMobile" textAlign="justify">
          {t("tokenResetPassword.message")}
        </p>
        <Form
          onSubmit={this.handleConfirmToken.bind(this)}
          loading={this.state.loadForm}
          error
          unstackable
        >
          <Form.Field>
            <label className="titleComponentMobile">Token</label>
            <input
              placeholder=""
              value={this.state.token}
              onChange={this.handleToken.bind(this)}
            />
          </Form.Field>
          <Header as="h5" textAlign="center">
            <Divider hidden />
            {mess}
            <Form.Button type="submit" color="blue" size="large" style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}>
              {t("tokenResetPassword.buttonContinue")}
            </Form.Button>
            <Divider hidden />
            <Button basic size="small" onClick={this.cancelProces.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}>
              {t("tokenResetPassword.buttonCancel")}
            </Button>
          </Header>
        </Form>
         </Responsive>
      </div>
    );
  }
}
export default translate(TokenResetPassword);
