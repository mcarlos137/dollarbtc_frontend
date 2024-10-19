import React, {Component} from 'react'
import config from "../../../services/config";
import axios from "axios";
import {Button, Divider, Header, Message, Segment, Form, Grid,Responsive} from "semantic-ui-react";
import ReCAPTCHA from "react-google-recaptcha";
import translate from "../../../i18n/translate";

const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
const recapcha = React.createRef();

class SendTokenResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loadForm: false,
      errorUser: false,
      errorCaptcha: false,
      captcha: "",
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
  handleEmail(e, data) {
    //console.log(e);
    this.setState({ email: e.target.value });
  }
  handleCaptcha(params) {
    this.setState({
      captcha: params
    });
  }
  handleSendToken() {
    if (this.state.email !== "" && this.state.captcha !== "") {
      let url = URL_BASE_BUSHIDO + config.urlBushido.passwordReset;
      let body = {
        email: this.state.email,
        reset: false,
        source: "PORTAL_NORMAL"
      };
      axios
        .post(url, body)
        .then(res => {
          //console.log(res);
          this.props.changeItem("token");
          if (recapcha.current !== null) {
            recapcha.current.reset("capt");
          }
        })
        .catch(error => {
          if (recapcha.current !== null) {
            recapcha.current.reset("capt");
          }
          //console.log(error);
        });
    } else {
      this.setState({ errorUser: true });
      setTimeout(() => {
        this.setState({ errorUser: false });
      }, 3000);
    }
  }
  cancelChange() {
    window.location.href = "/login";
  }
  render() {
    let labelUser;
    let t = this.state.translator;
    if (this.state.errorUser) {
      labelUser = <Message error header="Error" content={t("sendTokenResetPassword.errors.incompleteData")}/>;
    }
    return (
      <div>
        <Responsive minWidth={992}>
        <Form
          onSubmit={this.handleSendToken.bind(this)}
          loading={this.state.loadForm}
          error
          unstackable
        >
          <Segment basic textAlign="center">
            {t("sendTokenResetPassword.form.title")}
          </Segment>
          <Form.Field>
            <label>Email </label>
            <input
              placeholder=""
              value={this.state.email}
              onChange={this.handleEmail.bind(this)}
              type="email"
            />
          </Form.Field>
          <Segment basic textAlign="center">
            <Divider hidden />
            <p>{t("sendTokenResetPassword.form.captchaLabel")}</p>
            <Grid columns="equal" relaxed="very">
              <Grid.Row>
                <Grid.Column largeScreen={2}>
                  <p />
                </Grid.Column>
                <Grid.Column>
                  <ReCAPTCHA
                    id="capt"
                    ref={recapcha}
                    badge="inline"
                    sitekey="6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c"
                    onChange={this.handleCaptcha.bind(this)}
                  />
                </Grid.Column>
                <Grid.Column />
              </Grid.Row>
            </Grid>
            <Divider hidden />
            {labelUser}
            <Form.Button type="submit" color="blue" size="large">
              {t("sendTokenResetPassword.form.buttonConfirm")}
            </Form.Button>
            <Divider hidden />
          </Segment>
        </Form>
        <Header textAlign="center">
          {" "}
          <Button basic size="small" onClick={this.cancelChange.bind(this)}>
            {t("sendTokenResetPassword.form.buttonClose")}
          </Button>
        </Header>
        </Responsive>
         <Responsive minWidth={0} maxWidth={991} >
        <Form
          onSubmit={this.handleSendToken.bind(this)}
          loading={this.state.loadForm}
          error
          unstackable
        >
          <Segment basic textAlign="center" className="titleComponentMobile">
            {t("sendTokenResetPassword.form.title")}
          </Segment>
          <Form.Field>
            <label className="titleComponentMobile">Email </label>
            <input
              placeholder=""
              value={this.state.email}
              onChange={this.handleEmail.bind(this)}
              type="email"
            />
          </Form.Field>
          <Segment basic
                        textAlign="center"
                        verticalAlign="middle"
                        style={{ textAlign: "-webkit-center" }}>
            <Divider hidden />
            <p className="titleComponentMobile">{t("sendTokenResetPassword.form.captchaLabel")}</p>
            <Grid >
              <Grid.Row columns={1} centered>
                <Grid.Column textAlign="center"
                              verticalAlign="middle">
                  <ReCAPTCHA
                    id="capt"
                    ref={recapcha}
                    badge="inline"
                    size="compact" 
                    style={{
                      marginLeft:25
                    }}
                    sitekey="6LfIo3QUAAAAAAIomeMn1KSxZ_-HmYOw8SGAzp9c"
                    onChange={this.handleCaptcha.bind(this)}
                  />
                </Grid.Column>
                <Grid.Column />
              </Grid.Row>
            </Grid>
            <Divider hidden />
            {labelUser}
            <Form.Button type="submit" color="blue" size="large" style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}>
              {t("sendTokenResetPassword.form.buttonConfirm")}
            </Form.Button>
          </Segment>
        </Form>
        <Header textAlign="center">
          {" "}
          <Button basic size="small" onClick={this.cancelChange.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"200px"}}>
            {t("sendTokenResetPassword.form.buttonClose")}
          </Button>
        </Header>
        </Responsive> 
      </div>
    );
  }
}

export default translate(SendTokenResetPassword);