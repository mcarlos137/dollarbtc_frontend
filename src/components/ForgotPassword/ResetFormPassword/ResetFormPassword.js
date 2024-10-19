import React, { Component } from "react";
import "./ResetFormPassword.css";
import {
  Grid,
  Button,
  Header,
  Message,
  Label,
  Form,
  Icon,
  Input,
  Responsive
} from "semantic-ui-react";
import user from "../../../services/user";
import config from "../../../services/config";
import axios from "axios";
import translate from "../../../i18n/translate";
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class ResetFormPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenVerify: this.props.getToken(),
      errorRepeat: false,
      errorNewPassword: false,
      newPassword: "",
      repeatPassword: "",
      formLoad: false,
      viewMessage: false,
      textMessage: "",
      resultUpdatePasswordChange: null,
      hidden: true,
      hiddenRepeat: true,
      translator: props.translate
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
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
  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }
  toggleShowRepeat() {
    this.setState({ hiddenRepeat: !this.state.hiddenRepeat });
  }
  handleChangePassword() {
    if (
      this.state.errorNewPassword === false &&
      this.state.errorRepeat === false &&
      this.state.newPassword !== "" &&
      this.state.repeatPassword !== ""
    ) {
      this.setState({ formLoad: true });
      let urlconfir = URL_BASE_BUSHIDO + config.urlBushido.passwordResetConfirm;
      var req = {
        token: this.state.tokenVerify,
        password: this.state.newPassword
      };
      axios.post(urlconfir, req).then(res => {
        if (!res.data.errors || res.data.errors.length === 0) {
          this.setState({
            formLoad: false,
            resultUpdatePasswordChange: true
          });
        } else {
          this.setState({
            formLoad: false,
            resultUpdatePasswordChange: false
          });
        }
      });
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "resetFormPassword.errors.wrongData"
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          textMessage: ""
        });
      }, 7000);
    }
  }
  resultUpdatePasswordEnd() {
    setTimeout(() => {
      this.setState({
        loadForm: false,
        resultUpdatePasswordChange: user.getResultSendTokenUpdatePassword()
      });
    }, 6000);
  }
  render() {
    let errorNew, errorRepeat, messageToken;
    let t = this.state.translator;
    if (this.state.viewMessage) {
      messageToken = (
        <Message info floating content={t(this.state.textMessage)} />
      );
    }
    if (this.state.errorNewPassword) {
      errorNew = (
        <Label basic color="red" pointing>
          {t("resetFormPassword.errors.minimalLength")}
        </Label>
      );
    }
    if (this.state.errorRepeat) {
      errorRepeat = (
        <Label basic color="red" pointing>
          {t("resetFormPassword.errors.notMatch")}
        </Label>
      );
    }
    if (this.state.resultUpdatePasswordChange === true) {
      messageToken = (
        <Message info floating content={t("resetFormPassword.successChange")} />
      );
      setTimeout(() => {
        this.setState({
          tokenVerify: this.props.getToken(),
          errorRepeat: false,
          errorNewPassword: false,
          newPassword: "",
          repeatPassword: "",
          formLoad: false,
          viewMessage: false,
          textMessage: "",
          resultUpdatePasswordChange: null
        });
        window.location.href = "/login";
      }, 5000);
    } else if (this.state.resultUpdatePasswordChange === false) {
      messageToken = (
        <Message
          info
          floating
          content={t("resetFormPassword.errors.failChange")}
        />
      );
      setTimeout(() => {
        this.setState({
          tokenVerify: this.props.getToken(),
          errorRepeat: false,
          errorNewPassword: false,
          newPassword: "",
          repeatPassword: "",
          viewMessage: false,
          textMessage: "",
          resultUpdatePasswordChange: null
        });
        window.location.href = "/login";
      }, 5000);
    }
    return (
      <div>
        <Responsive minWidth={992}>
      <Grid columns="equal">
        <Grid.Column />
        <Grid.Column largeScreen={10} mobile={16} computer={10}>
          <Form
            error
            onSubmit={this.handleChangePassword.bind(this)}
            loading={this.state.formLoad}
          >
            <Form.Field>
              <label>{t("resetFormPassword.form.labelNew")}</label>
              <Input
                icon={
                  this.state.hidden ? (
                    <Icon
                      name="eye"
                      circular
                      link
                      onClick={this.toggleShow.bind(this)}
                    />
                  ) : (
                    <Icon
                      name="eye slash"
                      circular
                      link
                      onClick={this.toggleShow.bind(this)}
                    />
                  )
                }
                type={this.state.hidden ? "password" : "text"}
                value={this.state.newPassword}
                onChange={this.handleNewPassword.bind(this)}
              />
              {errorNew}
            </Form.Field>
            <Form.Field>
              <label>{t("resetFormPassword.form.labelRepeat")}</label>
              <Input
                icon={
                  this.state.hiddenRepeat ? (
                    <Icon
                      name="eye"
                      circular
                      link
                      onClick={this.toggleShowRepeat.bind(this)}
                    />
                  ) : (
                    <Icon
                      name="eye slash"
                      circular
                      link
                      onClick={this.toggleShowRepeat.bind(this)}
                    />
                  )
                }
                type={this.state.hiddenRepeat ? "password" : "text"}
                value={this.state.repeatPassword}
                onChange={this.handleRepeatPassword.bind(this)}
              />
              {errorRepeat}
            </Form.Field>
            <Header textAlign="center">
              <Button type="submit" color="blue">
                {t("resetFormPassword.form.buttonSend")}
              </Button>
            </Header>
          </Form>
          {messageToken}
        </Grid.Column>
        <Grid.Column />
      </Grid>
      </Responsive>
        <Responsive minWidth={0} maxWidth={991} >
        <Grid columns="equal">
        <Grid.Column />
        <Grid.Column largeScreen={10} mobile={16} computer={10}>
          <Form
            error
            onSubmit={this.handleChangePassword.bind(this)}
            loading={this.state.formLoad}
          >
            <Form.Field>
              <label className="titleComponentMobile">{t("resetFormPassword.form.labelNew")}</label>
              <Input
                icon={
                  this.state.hidden ? (
                    <Icon
                      name="eye"
                      circular
                      link
                      onClick={this.toggleShow.bind(this)}
                    />
                  ) : (
                    <Icon
                      name="eye slash"
                      circular
                      link
                      onClick={this.toggleShow.bind(this)}
                    />
                  )
                }
                type={this.state.hidden ? "password" : "text"}
                value={this.state.newPassword}
                onChange={this.handleNewPassword.bind(this)}
              />
              {errorNew}
            </Form.Field>
            <Form.Field>
              <label className="titleComponentMobile">{t("resetFormPassword.form.labelRepeat")}</label>
              <Input
                icon={
                  this.state.hiddenRepeat ? (
                    <Icon
                      name="eye"
                      circular
                      link
                      onClick={this.toggleShowRepeat.bind(this)}
                    />
                  ) : (
                    <Icon
                      name="eye slash"
                      circular
                      link
                      onClick={this.toggleShowRepeat.bind(this)}
                    />
                  )
                }
                type={this.state.hiddenRepeat ? "password" : "text"}
                value={this.state.repeatPassword}
                onChange={this.handleRepeatPassword.bind(this)}
              />
              {errorRepeat}
            </Form.Field>
            <Header textAlign="center">
              <Button type="submit" color="blue" style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}>
                {t("resetFormPassword.form.buttonSend")}
              </Button>
            </Header>
          </Form>
          {messageToken}
        </Grid.Column>
        <Grid.Column />
      </Grid>
        </Responsive>
      </div>
    );
  }
}
export default translate(ResetFormPassword);
