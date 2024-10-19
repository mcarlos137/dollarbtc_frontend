import React, { Component } from "react";
import "./CodeResetPassword.css";
import {
  Header,
  Divider,
  Form,
  Message,
  Button,
  Responsive,
} from "semantic-ui-react";
import translate from "../../../i18n/translate";
import user from "../../../services/user";
var nav3 = window.Event ? true : false;
class CodeResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      code: "",
      viewMessage: false,
      message: "",
      loadForm: false,
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
  componentDidMount() {
    this.setState({ token: this.props.getToken() });
    let body = { token: this.props.getToken(), enforceSms: true };
    user
      .passwordResetToken(body)
      .then((res) => {
        //console.log(res);
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  acceptNumer(evt) {
    // NOTE: Backspace = 8, Enter = 13, '0' = 48, '9' = 57
    var key = nav3 ? evt.which : evt.keyCode;
    return key <= 13 || (key >= 48 && key <= 57);
  }
  handleCode(e) {
    if (/^([0-9])*$/.test(e.target.value)) {
      this.setState({
        code: e.target.value,
        errorCode: false,
      });
    } else {
      this.setState({
        errorCode: true,
      });
    }
  }
  handleConfirmCode() {
    this.setState({ loadForm: true });
    let body = {
      token: this.state.token,
      code: this.state.code,
    };
    user
      .passwordResetCode(body)
      .then((res) => {
        if (res.data.payload === true) {
          this.props.changeItem("password");
          this.setState({
            token: "",
            code: "",
            viewMessage: false,
            message: "",
            loadForm: false,
          });
        } else {
          this.setState({
            viewMessage: true,
            message: "codeResetPassword.errors.failToken",
            loadForm: false,
            code: "",
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              message: "",
            });
          }, 3000);
        }
      })
      .catch((error) => {
        this.setState({
          viewMessage: true,
          message: "codeResetPassword.errors.serverError",
          loadForm: false,
          code: "",
        });
        setTimeout(() => {
          this.setState({
            viewMessage: false,
            message: "",
          });
        }, 3000);
        //console.log(error);
      });
  }
  handleCodeReSent() {
    this.setState({ loadForm: true });
    let body = { token: this.state.token, enforceSms: true };
    user
      .passwordResetToken(body)
      .then((res) => {
        //console.log(res);
        this.setState({
          viewMessage: true,
          message: "codeResetPassword.responseAccept",
          loadForm: false,
          code: "",
        });
        setTimeout(() => {
          this.setState({
            viewMessage: false,
            message: "",
          });
        }, 3000);
      })
      .catch((error) => {
        this.setState({
          viewMessage: true,
          message: "codeResetPassword.errors.serverError2",
          loadForm: false,
          code: "",
        });
        setTimeout(() => {
          this.setState({
            viewMessage: false,
            message: "",
          });
        }, 3000);
        //console.log(error);
      });
  }
  cancelProces() {
    this.props.changeItem("sendToken");
    this.setState({
      token: "",
      code: "",
      viewMessage: false,
      message: "",
      loadForm: false,
    });
  }
  render() {
    let mess;
    let t = this.state.translator;
    if (this.state.viewMessage) {
      mess = <Message info content={t(this.state.message)} />;
    }
    if (this.state.errorCode) {
    }
    return (
      <div>
        <Responsive minWidth={992}>
          <p>{t("codeResetPassword.message")}</p>
          <Form
            onSubmit={this.handleConfirmCode.bind(this)}
            loading={this.state.loadForm}
            error
            unstackable
          >
            <Form.Field>
              <label>{t("codeResetPassword.labelCode")}</label>
              <input
                placeholder=""
                value={this.state.code}
                onChange={this.handleCode.bind(this)}
                type="number"
              />
            </Form.Field>
            <Header as="h5" textAlign="center">
              <Divider hidden />
              {mess}
              <Form.Button type="submit" color="blue" size="large">
                {t("codeResetPassword.buttonContinue")}
              </Form.Button>
              <Divider hidden />
            </Header>
          </Form>
          <Header textAlign="center">
            <Button basic size="tiny" onClick={this.cancelProces.bind(this)}>
              {t("codeResetPassword.buttonClose")}
            </Button>
          </Header>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <p className="titleComponentMobile">
            {t("codeResetPassword.message")}
          </p>
          <Form
            onSubmit={this.handleConfirmCode.bind(this)}
            loading={this.state.loadForm}
            error
            unstackable
          >
            <Form.Field>
              <label className="titleComponentMobile">
                {t("codeResetPassword.labelCode")}
              </label>
              <input
                placeholder=""
                value={this.state.code}
                onChange={this.handleCode.bind(this)}
                type="number"
              />
            </Form.Field>
            <Header as="h5" textAlign="center">
              <Divider hidden />
              {mess}
              <Form.Button
                type="submit"
                color="blue"
                size="large"
                style={{
                  borderRadius: "40px/40px",
                  height: "50px",
                  width: "200px",
                }}
              >
                {t("codeResetPassword.buttonContinue")}
              </Form.Button>
              <Divider hidden />
            </Header>
          </Form>
          <Header textAlign="center">
            <Button
              basic
              size="tiny"
              onClick={this.cancelProces.bind(this)}
              style={{
                borderRadius: "40px/40px",
                height: "50px",
                width: "200px",
              }}
            >
              {t("codeResetPassword.buttonClose")}
            </Button>
          </Header>
        </Responsive>
      </div>
    );
  }
}
export default translate(CodeResetPassword);
