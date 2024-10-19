import React, { Component } from "react";
import "./LoginTwoFactor.css";
import user from "../../services/user.js";
import config from "../../services/config.js";
import axios from "axios";
import {
  Segment,
  Grid,
  Form,
  Message,
  Icon,
  Divider,
  Header,
  Modal,
  Button,
  Container,
  Label,
  Responsive,
} from "semantic-ui-react";
import translate from "../../i18n/translate";
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
class LoginTwoFactor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      textResult: "",
      timer: false,
      result: "",
      loadForm: false,
      viewModal: false,
      //	bodyHeader: '',
      viewOptionConfirm: true,
      message: "",
      viewMessage: false,
      sendtoken: false,
      errorToken: false,
      errorCode: false,
      verified: false,

      token: "",
      viewMessageServer: false,
      messageServer: "",
      translator: props.translate,
      questions: [],
      securityQuestions: false,
      securityAnswer: "",
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
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
  componentDidMount() {
    if (window.sessionStorage.getItem("2FactorPrefered") === "PHONE") {
      this.reSentCode();
    }
  }
  handleHelp() {
    user
      .getSecurityQuestionsByUser(user.getUserName(), 1)
      .then((resp) => {
        let validQuestion = [];
        if (resp.data.length > 0) {
          for (let quest of resp.data) {
            if (quest !== "") {
              validQuestion.push(quest);
            }
          }
          if (validQuestion.length > 0) {
            this.setState({
              questions: validQuestion,
              securityQuestions: true,
            });
          } else {
            this.setState({
              securityQuestions: false,
            });
          }
        } else {
          this.setState({
            securityQuestions: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          securityQuestions: false,
        });
      })
      .finally(() => {
        this.setState({
          viewModal: true,
          sendtoken: false,
          loadForm: false,
          message: "login2FA.helpMessage",
        });
      });
  }

  handleConfirHelp() {}
  reSentCode() {
    ////  ('ejecutando el metodo resendcode por dentro');
    this.setState({ code: "" });
    let body = {};
    if (window.sessionStorage.getItem("2FactorPrefered") === "PHONE") {
      body = {
        userName: user.getUserName(),
        language: window.sessionStorage.getItem("language").toUpperCase(),
        sendSms: true,
        sendMail: false,
      };

      user
        .sendAuthCodeCore(body)
        .then((res) => {
          //////  (res);
          this.setState({
            timer: true,
          });
          setTimeout(() => {
            this.setState({ timer: false });
          }, 30000);
        })
        .catch((error) => {
          //	////  (error);
          this.setState({
            timer: false,
          });
          setTimeout(() => {
            this.setState({ timer: true });
          }, 30000);
        });
      // } else {
      // 	this.setState({
      // 		timer: true,
      // 	});
      // 	setTimeout(() => {
      // 		this.setState({ timer: false });
      // 	}, 30000);
      // }
      // else if (window.sessionStorage.getItem('2FactorPrefered') === 'GOOGLE') {
      // 	body = {
      // 		userName: user.getUserName(),
      // 		language: window.sessionStorage.getItem('language').toUpperCase(),
      // 		sendSms: false,
      // 		sendMail: true,
      // 	};
    }
  }
  loginCode() {
    //////  ('en el login code');
    if (this.state.code !== "") {
      let request = {
        userName: user.getUserName(),
        code: this.state.code,
      };
      if (window.sessionStorage.getItem("2FactorPrefered") === "GOOGLE") {
        user
          .verifyGACode(request)
          .then((resp) => {
            ////  (resp);
            if (resp.data === "OK") {
              user.getBalanceUser(user.getUserName());
              window.sessionStorage.setItem("timeLogin", new Date());
              window.sessionStorage.setItem("auth", true);
              window.location.href = "/";
              // this.props.session();
            } else {
              this.setState({
                message: "login2FA.errors.failAuth",
                viewMessage: true,
              });
              setTimeout(() => {
                this.setState({ message: "", viewMessage: false });
              }, 3000);
            }
          })
          .catch((error) => {
            //////  (error);
            this.setState({
              message: "login2FA.errors.serverError",
              viewMessage: true,
            });
            setTimeout(() => {
              this.setState({ message: "", viewMessage: false });
            }, 3000);
          });
      } else if (window.sessionStorage.getItem("2FactorPrefered") === "PHONE") {
        user
          .authCodeCore(request)
          .then((res) => {
            //////  (res);
            if (res.data === "OK") {
              user.getBalanceUser(user.getUserName());
              window.sessionStorage.setItem("timeLogin", new Date());
              window.sessionStorage.setItem("auth", true);
              window.location.href = "/";
              // this.props.session();
            } else {
              this.setState({
                message: "login2FA.errors.failAuth",
                viewMessage: true,
              });
              setTimeout(() => {
                this.setState({ message: "", viewMessage: false });
              }, 3000);
            }
          })
          .catch((error) => {
            //////  (error);
            this.setState({
              message: "login2FA.errors.serverError",
              viewMessage: true,
            });
            setTimeout(() => {
              this.setState({ message: "", viewMessage: false });
            }, 3000);
          });
      } else {
        this.setState({
          errorCode: true,
          message: "login2FA.errors.requiredField",
        });
        setTimeout(() => {
          this.setState({ errorCode: false, message: "" });
        }, 8000);
      }
    }
  }
  handleToken(e) {
    this.setState({ token: e.target.value });
  }
  sendTokenHelp() {
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.headers.post["Accept"] = "application/json";
    let body = {
      email: user.getUserEmail(),
      source: "PORTAL_NORMAL",
    };
    axios
      .post(URL_BASE_BUSHIDO + config.urlBushido.generateTokenVerify, body, {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      })
      .then((res) => {
        //// ////////  (res);
        if (res.data.errors == null) {
          this.setState({
            sendtoken: true,
            message: "login2FA.successSendToken",
          });
          setTimeout(() => {
            this.setState({ timer: true });
          }, 30000);
        }
      })
      .catch((error) => {
        this.setState({
          viewMessageServer: true,
          messageServer: "login2FA.errors.serverError2",
        });
        setTimeout(() => {
          this.setState({ timer: true });
        }, 30000);
        //// ////////  (error);
      });
  }
  confirmToken() {
    if (this.state.token !== "") {
      axios.defaults.headers.post["Content-Type"] = "text/html;charset=utf-8";
      axios.defaults.headers.post["Accept"] = "application/json";
      axios
        .post(
          URL_BASE_BUSHIDO + config.urlBushido.verifyToken,
          this.state.token,
          {
            auth: {
              username: atob(user.getHeader()).split(":")[1],
              password: atob(user.getHeader()).split(":")[0],
            },
          }
        )
        .then((resp) => {
          if (resp.data.errors === null) {
            let body = {
              email: user.getUserEmail(),
              firstName: window.sessionStorage.getItem("firstName"),
              lastName: window.sessionStorage.getItem("lastName"),
              countryCode: window.sessionStorage.getItem("countryCode"),
              phone: window.sessionStorage.getItem("phone"),
              has2FAEnabled: false,
            };
            user
              .updateProfile(body, user.getUserName())
              .then((resp) => {
                this.endHelp();
                if (resp.data.payload === true) {
                  sessionStorage.setItem("twoFactor", true);
                } else {
                  this.setState({
                    loadForm: false,
                    viewMessageServer: true,
                    messageServer: "login2FA.errors.serverError2",
                  });
                  setTimeout(() => {
                    this.closeModal();
                  }, 5000);
                }
              })
              .catch((error) => {
                this.setState({
                  loadForm: false,
                  viewMessageServer: true,
                  messageServer: "login2FA.errors.serverError2",
                });
                setTimeout(() => {
                  this.closeModal();
                }, 5000);
              });
          } else {
            this.setState({
              viewMessageServer: true,
              messageServer: "login2FA.errors.failVerifyToken",
            });
          }
          this.setState({ verified: true });
        })
        .catch((error) => {
          this.setState(
            {
              loadForm: false,
              viewMessageServer: true,
              messageServer: "login2FA.errors.serverError2",
            },
            () => {
              setTimeout(() => {
                this.closeModal();
              }, 5000);
            }
          );
          //// ////////  (error);
        });
    } else {
      this.setState({
        errorToken: true,
      });
      setTimeout(() => {
        this.setState({ errorToken: false });
      }, 3000);
    }
  }
  endHelp() {
    user.logout();
    this.setState({
      token: "",
      loadForm: false,
      viewMessageServer: true,
      messageServer: "login2FA.endHelpMessage",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 4000);
  }
  closeModal() {
    this.setState({
      viewModal: false,
      token: "",
      message: "",
      messageServer: "",
      viewMessageServer: false,
    });
  }
  handleSecurityAnswer(e) {
    this.setState({ securityAnswer: e.target.value });
  }
  checkAnswerSecurity() {
    let body = {
      userName: user.getUserName(),
      securityQuestionsAndAnswers: {
        [this.state.questions[0]]: this.state.securityAnswer,
      },
    };
    if (this.state.securityAnswer !== "" && this.state.token !== "") {
      this.setState({
        loadForm: true,
      });
      user
        .validateSecurityAnswer(body)
        .then((resp) => {
          console.log(resp.data);
          if (resp.data === "OK") {
            this.setState({ errorAnswer: false });
            this.confirmToken();
          } else if (resp.data === "FAIL") {
            this.setState(
              {
                loadForm: false,
                viewMessageServer: true,
                messageServer: "login2FA.errors.failVerifyAnswer",
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    viewMessageServer: false,
                    messageServer: "",
                  });
                }, 5000);
              }
            );
          }
        })
        .catch((error) => {
          //// ////////  (error);
          this.setState(
            {
              loadForm: false,
              viewMessageServer: true,
              messageServer: "login2FA.errors.serverError2",
            },
            () => {
              setTimeout(() => {
                this.closeModal();
              }, 5000);
            }
          );
        });
    } else if (this.state.securityAnswer === "") {
      this.setState(
        {
          errorAnswer: true,
        },
        () => {
          setTimeout(() => {
            this.setState({ errorAnswer: false });
          }, 3000);
        }
      );
    } else if (this.state.token === "") {
      this.setState({
        errorToken: true,
      });
      setTimeout(() => {
        this.setState({ errorToken: false });
      }, 3000);
    }
  }
  render() {
    //   (window.sessionStorage);
    let t = this.state.translator;
    let message, labelToken, labelCode, messagetoken, labelAnswer, body2;
    if (this.state.viewMessage) {
      message = (
        <Message error header="Error " content={t(this.state.message)} />
      );
    }
    if (this.state.viewMessageServer) {
      messagetoken = <Message info content={t(this.state.messageServer)} />;
    }
    if (this.state.errorToken) {
      labelToken = (
        <Label basic color="red" pointing>
          {t("login2FA.errors.requiredField")}
        </Label>
      );
    }
    if (this.state.errorCode) {
      labelCode = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAnswer) {
      labelAnswer = (
        <Label basic color="red" pointing>
          {t("login2FA.errors.requiredField")}
        </Label>
      );
    }
    let bodyModal;
    if (this.state.sendtoken) {
      bodyModal = (
        <div>
          <Segment basic>
            <Modal.Content>
              <Segment basic textAlign="center">
                <div>{t(this.state.message)}</div>
              </Segment>
              <Divider hidden />
              <Grid>
                <Grid.Column width={4}></Grid.Column>
                <Grid.Column width={8}>
                  <Form loading={this.state.loadForm} error>
                    <Form.Field hidden={this.state.verified}>
                      <label>
                        {t("login2FA.modalSendToken.send.labelToken")}
                      </label>
                      <input
                        value={this.state.token}
                        onChange={this.handleToken.bind(this)}
                      />
                      {labelToken}
                    </Form.Field>
                    {this.state.securityQuestions && (
                      <Form.Field hidden={this.state.verified}>
                        <label>
                          {t(
                            "login2FA.modalSendToken.send.labelSecurityQuestion"
                          )}
                        </label>
                        <input
                          value={this.state.securityAnswer}
                          onChange={this.handleSecurityAnswer.bind(this)}
                          placeholder={this.state.questions[0]}
                        />
                        {labelAnswer}
                      </Form.Field>
                    )}
                  </Form>
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
              </Grid>

              {messagetoken}
              <Divider hidden />
            </Modal.Content>
            <Modal.Actions>
              <Button
                floated="right"
                color="blue"
                onClick={
                  this.state.securityQuestions
                    ? this.checkAnswerSecurity.bind(this)
                    : this.confirmToken.bind(this)
                }
              >
                {t("login2FA.modalSendToken.send.buttonConfirm")}
              </Button>
              <Button
                onClick={this.closeModal.bind(this)}
                color="grey"
                floated="right"
              >
                {t("login2FA.modalSendToken.send.buttonClose")}
              </Button>
            </Modal.Actions>
            <Divider hidden />
          </Segment>
          <Divider hidden />
        </div>
      );
    } else {
      bodyModal = (
        <div>
          <Segment basic>
            <Modal.Content>
              <Segment basic textAlign="center">
                <p>{t(this.state.message)}</p>
                <div>{t("login2FA.modalSendToken.notSend.labelQuestion")}</div>
              </Segment>
            </Modal.Content>
            <Divider hidden />
            <Modal.Actions>
              <Button
                positive
                onClick={this.sendTokenHelp.bind(this)}
                floated="right"
              >
                {t("login2FA.modalSendToken.notSend.buttonYes")}
              </Button>
              <Button
                negative
                onClick={this.closeModal.bind(this)}
                floated="right"
              >
                {t("login2FA.modalSendToken.notSend.buttonNo")}
              </Button>

              <Divider hidden />
            </Modal.Actions>
            <Divider hidden />
          </Segment>
        </div>
      );
    }
    body2 = (
      <p>
        {window.sessionStorage.getItem("2FactorPrefered") === "PHONE" &&
          t("login2FA.body")}

        {window.sessionStorage.getItem("2FactorPrefered") === "GOOGLE" &&
          t("login2FA.body2")}
      </p>
    );

    return (
      <div>
        <Responsive minWidth={992}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                <Segment color="orange" textAlign="left">
                  <Header as="h2" textAlign="center">
                    {t("login2FA.header")}
                  </Header>
                  <Container className="container-form">
                    <div />
                    <Header icon textAlign="center">
                      <Icon name="mobile alternate" />
                    </Header>
                    {body2}
                    <Form
                      onSubmit={this.loginCode.bind(this)}
                      loading={this.state.loadForm}
                      error
                      unstackable
                    >
                      <Form.Field>
                        <label>{t("login2FA.form.label")}</label>
                        <input
                          placeholder="xxxxxxx"
                          value={this.state.code}
                          onChange={this.handleCode.bind(this)}
                        />
                        {labelCode}
                      </Form.Field>
                      <Divider hidden />
                      {message}
                      <Header textAlign="center">
                        <Form.Button type="submit" color="blue" size="large">
                          {t("login2FA.form.buttonConfirm")}
                        </Form.Button>
                      </Header>
                    </Form>
                    <Header textAlign="center">
                      {window.sessionStorage.getItem("2FactorPrefered") ===
                        "PHONE" && (
                        <Button
                          disabled={this.state.timer === true}
                          onClick={this.reSentCode.bind(this)}
                          color="blue"
                          size="small"
                        >
                          {t("login2FA.form.buttonResend")}
                        </Button>
                      )}
                    </Header>
                    <Header textAlign="center">
                      <Button
                        basic
                        size="tiny"
                        onClick={this.handleHelp.bind(this)}
                      >
                        {t("login2FA.form.iNeedHelp")}
                      </Button>
                    </Header>
                  </Container>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
          <Modal open={this.state.viewModal}>
            <Header content={t("login2FA.modalSendToken.header")} />
            {bodyModal}
          </Modal>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                <Segment basic>
                  <Header as="h4" className="titleComponent" textAlign="center">
                    {t("login2FA.header")}
                  </Header>
                  <hr style={{ borderColor: "#207ef2" }}></hr>
                  <Container className="container-form">
                    <div />
                    <Header icon textAlign="center">
                      <Icon
                        name="mobile alternate"
                        style={{ color: "#207ef2" }}
                      />
                    </Header>
                    <p style={{ color: "#207ef2", textAlign: "justify" }}>
                      {window.sessionStorage.getItem("2FactorPrefered") ===
                        "GOOGLE" && t("login2FA.body2")}
                      {window.sessionStorage.getItem("2FactorPrefered") ===
                        "PHONE" && t("login2FA.body")}
                    </p>
                    <Form
                      onSubmit={this.loginCode.bind(this)}
                      loading={this.state.loadForm}
                      error
                      unstackable
                    >
                      <Form.Field>
                        <label style={{ color: "#207ef2" }}>
                          {t("login2FA.form.label")}
                        </label>
                        <input
                          placeholder="xxxxxxx"
                          value={this.state.code}
                          onChange={this.handleCode.bind(this)}
                        />
                        {labelCode}
                      </Form.Field>
                      <Divider hidden />
                      {message}
                      <Header textAlign="center">
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
                          {t("login2FA.form.buttonConfirm")}
                        </Form.Button>
                      </Header>
                    </Form>
                    <Header textAlign="center">
                      <Button
                        disabled={this.state.timer}
                        onClick={this.reSentCode.bind(this)}
                        color="grey"
                        size="small"
                        style={{
                          borderRadius: "40px/40px",
                          height: "50px",
                          width: "200px",
                        }}
                      >
                        {t("login2FA.form.buttonResend")}
                      </Button>
                    </Header>
                    <Header textAlign="center">
                      <Button
                        basic
                        size="tiny"
                        onClick={this.handleHelp.bind(this)}
                        style={{
                          borderRadius: "40px/40px",
                          height: "50px",
                          width: "200px",
                        }}
                      >
                        {t("login2FA.form.iNeedHelp")}
                      </Button>
                    </Header>
                  </Container>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
          <Modal open={this.state.viewModal}>
            <Header content={t("login2FA.modalSendToken.header")} />
            {bodyModal}
          </Modal>
        </Responsive>
      </div>
    );
  }
}
export default translate(LoginTwoFactor);
