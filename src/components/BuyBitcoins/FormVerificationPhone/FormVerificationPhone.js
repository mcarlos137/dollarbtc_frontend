import React, { Component } from "react";
import "../BuyBitcoins.css";
import
{
  Form,
  Button,
  Popup,
  Message,
  Responsive,
  Segment
} from "semantic-ui-react";
import prefits from "../../../common/prefits";
import userAPI from "../../../services/user";
import NumberFormat from "react-number-format";
import translate from "../../../i18n/translate";

class FormVerificationPhone extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      phoneInvalide: false,
      codeSended: false,
      codeVerified: false,
      errorNetwork: false,
      partialPhone: "", textMessage2L: "",
      phone: "",
      prefit: prefits.country,
      codeVerify: "", time: 60,
      loading: false,
      disabledBtnSendCode: false,
      disabledBtnReSendCode: true,
      translator: props.translate,
      phonebool: false,
      searchQuery: null
    };
  }
  componentWillReceiveProps(nextProps, nextContext)
  {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  // minusOne()
  // {

  //   const [counter, setCounter] = React.useState(60);
  //   //console.log(counter)
  //   React.useEffect(() =>
  //   {
  //     const timer =
  //       counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //     return () => clearInterval(timer);
  //   }, [counter]);

  //   //console.log(counter)

  // }
  sendCode()
  {
    ////console.log('entrando al sendCode');
    ////console.log(window.sessionStorage);
    let body = {
      userName: window.sessionStorage.getItem("username"),
      language: window.sessionStorage.getItem("language").toUpperCase(),
      sendSms: true,
      sendMail: false
    };
    ////console.log(body);
    userAPI
      .sendAuthCodeCore(body)
      .then(resp =>
      {
        ////console.log(resp);

        //this.minusOne()
        // //console.log({counter})

        let text =
          this.state.translator(
            "buy.formVerificationPhone.messages.sentToken.part1"
          ) +
          sessionStorage.getItem("countryCode") +
          this.state.phone.substring(0, 3) +
          this.state.translator(
            "buy.formVerificationPhone.messages.sentToken.part2"
          ) +
          sessionStorage.getItem("phone").slice(-2) +
          this.state.translator(
            "buy.formVerificationPhone.messages.sentToken.part3"
          );
        if (resp.data === "OK") {
          ////console.log('dentro del OK');

          this.setState({
            loading: false,
            codeSended: true,
            textMessage: text,
            disabledBtnReSendCode: true
            // partialPhone: "",
            // phone: "",
          });
          setTimeout(() =>
          {
            this.setState({
              disabledBtnReSendCode: false
            });
          }, 60000);
        } else {
          this.setState({
            loading: false,
            phoneInvalide: true,
            textMessage: "buy.formVerificationPhone.errors.tokenNotSent",
            partialPhone: "",
            phone: "",
          });
        }
      })
      .catch(error =>
      {
        let e = error.toString()
        if (e.includes("Network")) {
          this.setState({
            errorNetwork: true,
            textMessage2: 'buy.formVerificationIdentity.errors.errorNetwork'
          })

        }

        setTimeout(() =>
        {
          this.setState({
            errorNetwork: false,
            textMessage2: ''
          })
        }, 4000);
        //console.log(error);
        // this.setState({
        //   partialPhone: "",
        //   phone: ""
        // })
      });
  }

  componentDidMount()
  {
    userAPI.getConfigUserGeneral(userAPI.getUserName()).then(res =>
    {
      ////console.log(res.data.result.phone);
      if (res.data.result.phone !== undefined) {
        this.setState({ phonebool: true });
      }
    });
  }
  async updateDataUser(body)
  {
    try {
      let response = await userAPI.updateUserData(body);
      ////console.log(response);
      if (response.data !== "ok") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  handleVerifyPhone()
  {
    this.setState({
      loading: true
    });




    if (this.state.partialPhone === "" ||
      this.state.phone === "" ||
      this.state.partialPhone === null ||
      this.state.phone === null ||
      this.state.partialPhone === undefined ||
      this.state.phone === undefined) {
      this.setState({
        loading: false,
        phoneInvalide: true,
        textMessage: "buy.formVerificationPhone.errors.tokenNotSent",
        partialPhone: "",
        phone: ""
      });
    } else {
      if (this.state.partialPhone === "1C") {
        let aux = this.state.partialPhone.split("C", [2])
        //console.log(aux)
        let val = aux[0]
        //console.log("val:", val)

        //console.log("despues del setstate del handleverifyphone", val)

        let body = {
          email: userAPI.getUserEmail(),
          firstName: window.sessionStorage.getItem("firstName"),
          lastName: window.sessionStorage.getItem("lastName"),
          countryCode: val,
          phone: this.state.phone,
          has2FAEnabled: window.sessionStorage.getItem("twoFactor")
        };
        //console.log("body", body)
        let username = window.sessionStorage.getItem('username')
        userAPI
          .updateProfile(body, username)
          .then(async resp =>
          {
            if (resp.data.payload === true) {
              if (this.state.phonebool === true) {
                let body2 = {
                  userName: userAPI.getUserName(),
                  fieldName: "phone",
                  fieldValue: val + this.state.phone
                };
                //console.log("body2", body2)
                let a = await this.updateDataUser(body2);
                //console.log("a", a);
                if (a === true) {
                  this.sendCode();
                }
              } else {
                let body3 = {
                  userName: userAPI.getUserName(),
                  fieldName: "phone",
                  fieldValue: val + this.state.phone
                };
                //console.log("body3", body3)
                try {
                  const response = await userAPI.addDataUserAsync(body3);
                  this.sendCode();
                } catch (error) {
                  //console.log(error)
                  let e = error.toString()
                  if (e.includes("Network")) {
                    this.setState({
                      errorNetwork: true,
                      textMessage2: 'buy.formVerificationIdentity.errors.errorNetwork'
                    })

                  }

                  setTimeout(() =>
                  {
                    this.setState({
                      errorNetwork: false,
                      textMessage2: ''
                    })
                  }, 4000);
                }
              }

              sessionStorage.setItem("countryCode", val);

              sessionStorage.setItem("phone", this.state.phone);

            } else {
              this.setState({
                loading: false,
                phoneInvalide: true,
                textMessage: "buy.formVerificationPhone.errors.phoneUsed"
              });
              setTimeout(() =>
              {
                this.setState({ phoneInvalide: false, textMessage: "" });
              }, 7000);
            }
          })
          .catch(error =>
          {
            this.setState({
              loading: false,
              phoneInvalide: true,
              textMessage: "buy.formVerificationPhone.errors.tokenNotSent"
            });
            //////console.log(error);
          });
      } else {
        let body = {
          email: userAPI.getUserEmail(),
          firstName: window.sessionStorage.getItem("firstName"),
          lastName: window.sessionStorage.getItem("lastName"),
          countryCode: this.state.partialPhone,
          phone: this.state.phone,
          has2FAEnabled: window.sessionStorage.getItem("twoFactor")
        };
        //console.log("body", body)
        let username = window.sessionStorage.getItem('username')
        userAPI
          .updateProfile(body, username)
          .then(async resp =>
          {
            if (resp.data.payload === true) {
              if (this.state.phonebool === true) {
                let body2 = {
                  userName: userAPI.getUserName(),
                  fieldName: "phone",
                  fieldValue: this.state.partialPhone + this.state.phone
                };
                //console.log("body2", body2)
                let a = await this.updateDataUser(body2);
                //console.log("a", a);
                if (a === true) {
                  this.sendCode();
                }
              } else {
                let body3 = {
                  userName: userAPI.getUserName(),
                  fieldName: "phone",
                  fieldValue: this.state.partialPhone + this.state.phone
                };
                //console.log("body3", body3)
                try {
                  const response = await userAPI.addDataUserAsync(body3);
                  this.sendCode();
                } catch (error) {
                  //console.log(error)
                  let e = error.toString()
                  if (e.includes("Network")) {
                    this.setState({
                      errorNetwork: true,
                      textMessage2: 'buy.formVerificationIdentity.errors.errorNetwork'
                    })

                  }

                  setTimeout(() =>
                  {
                    this.setState({
                      errorNetwork: false,
                      textMessage2: ''
                    })
                  }, 4000);
                }
              }

              sessionStorage.setItem("countryCode", this.state.partialPhone);

              sessionStorage.setItem("phone", this.state.phone);

            } else {
              this.setState({
                loading: false,
                phoneInvalide: true,
                partialPhone: "",
                phone: "",
                textMessage: "buy.formVerificationPhone.errors.phoneUsed"
              });
              setTimeout(() =>
              {
                this.setState({ phoneInvalide: false, textMessage: "" });
              }, 7000);
            }
          })
          .catch(error =>
          {
            let e = error.toString()
            if (e.includes("Network")) {
              this.setState({
                errorNetwork: true,
                textMessage2: 'buy.formVerificationIdentity.errors.errorNetwork'
              })

            }

            setTimeout(() =>
            {
              this.setState({
                errorNetwork: false,
                textMessage2: ''
              })
            }, 4000);
            this.setState({
              loading: false,
              phoneInvalide: true,
              textMessage: "buy.formVerificationPhone.errors.tokenNotSent"
            });
            //////console.log(error);
          });
      }


    }

  }
  handleCodeVerify(e)
  {
    this.setState({ codeVerify: e.target.value });
  }

  initVerification()
  {
    let send = {
      userName: sessionStorage.getItem("username"),
      fieldNames: ["phone"],
      userVerificationType: "B",
      info: "Verification of user's telephone number"
    };
    let url = userAPI.verifyUserRequestCore(send);
    // Axios.post(url, send)
    url
      .then(rep =>
      {
        ////////console.log("respuesta de la verificacion de telefono ", rep.data);
        setTimeout(() =>
        {
          this.props.handleToUpdate(2);
        }, 4000);
      })
      .catch(error =>
      {
        //////console.log(error);
      });
  }
  handleConfirmCodePhone()
  {
    ////console.log('enviando');
    this.setState({
      loading: true,
      disabledBtnSendCode: true
    });
    setTimeout(() =>
    {
      this.setState({
        disabledBtnSendCode: false
      });
    }, 10000);
    let body = {
      userName: userAPI.getUserName(),
      code: this.state.codeVerify
    };
    userAPI
      .authCodeCore(body)
      .then(async res =>
      {
        if (res.data === "OK") {
          const result = await userAPI.verifyPhoneBushido(
            userAPI.getUserName()
          );
          //console.log(result);
          sessionStorage.setItem("phoneVerified", true);
          let msj
          if (this.state.partialPhone === "1C") {
            let aux = this.state.partialPhone.split("C", [2])
            let val = aux[0]
            // this.setState({ partialPhone: val })
            // //console.log(this.state.partialPhone)
            msj =
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part1"
              ) +
              val +
              this.state.phone.substring(0, 3) +
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part2"
              ) +
              this.state.phone.slice(-2) +
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part3"
              );
          } else {
            msj =
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part1"
              ) +
              this.state.partialPhone +
              this.state.phone.substring(0, 3) +
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part2"
              ) +
              this.state.phone.slice(-2) +
              this.state.translator(
                "buy.formVerificationPhone.messages.verifiedPhone.part3"
              );
          }
          this.setState({
            loading: false,
            codeVerified: true,
            textMessage: msj
          });
          setTimeout(() => this.initVerification(), 3000);
        } else {
          sessionStorage.setItem("phoneVerified", false);
          this.setState({
            loading: false,
            codeVerified: false,
            textMessage: "buy.formVerificationPhone.messages.failVerification",
            codeVerify: ""
          });
        }
      })
      .catch(error =>
      {
        sessionStorage.setItem("phoneVerified", false);
        //////console.log(error);
        this.setState({
          loading: false,
          codeVerified: false,
          textMessage: "buy.formVerificationPhone.messages.failVerification"
        });
      });
  }
  handlePrefit(e, data)
  {
    this.setState({ partialPhone: data.value });

  }

  clearView()
  {
    this.setState({
      phoneInvalide: false,
      codeSended: false,
      codeVerified: false,
      partialPhone: "",
      phone: "",
      codeVerify: "",
      loading: false,
      disabledBtnSendCode: false
    });
  }
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery, });

  render()
  {
    let t = this.state.translator;
    let list = [];
    if (this.state.prefit.length > 0) {
      for (let pre of this.state.prefit) {
        if (pre.value !== "") {
          if (pre.nombre === "Canada") {
            ////console.log("dentro de la condicion canada")
            let valu2 = pre.value + "C"
            // //console.log("text:" + pre.nombre, "value:" + valu2, "key:" + pre.iso2)

            list.push({ text: pre.nombre, value: valu2, key: pre.iso2 });
          } else {
            list.push({ text: pre.nombre, value: pre.value, key: pre.iso2 });
          }
        }
      }
    }
    let messageInfo;
    if (
      this.state.codeSended ||
      this.state.phoneInvalide ||
      this.state.codeVerified
    ) {
      messageInfo = (
        <Message
          info
          content={
            this.state.textMessage.startsWith("buy.")
              ? t(this.state.textMessage)
              : this.state.textMessage
          }
        />
      );
    }
    return (
      <div>
        <Message
          info
          content={t("buy.formVerificationPhone.messages.notVerifyB")}
        />
        <div>
          <Responsive minWidth={992}>
            <Form>
              {!this.state.codeSended && (
                <div>
                  <Form
                    loading={this.state.loading}
                    onSubmit={this.handleVerifyPhone.bind(this)}
                  >
                    <Form.Group>
                      <Form.Field>
                        <Form.Select
                          required
                          label={t(
                            "profile.updateProfile.form.placeholderCountry"
                          )}
                          selection
                          search={true}
                          options={list}
                          value={this.state.partialPhone}
                          placeholder={t(
                            "profile.updateProfile.form.placeholderCountry"
                          )}
                          onChange={this.handlePrefit.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>
                          {t("buy.formVerificationPhone.formRequestCode.phone")}
                        </label>
                        <NumberFormat
                          value={this.state.phone}
                          allowNegative={false}
                          thousandSeparator={false}
                          placeholder={"12345678"}
                          onValueChange={values =>
                          {
                            const { value } = values;
                            this.setState({ phone: value });
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <div className="marginTop">
                          <Button color="blue" type="submit">
                            {t(
                              "buy.formVerificationPhone.formRequestCode.buttonSend"
                            )}
                          </Button>
                        </div>
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </div>
              )}
              {messageInfo}
              {this.state.codeSended && !this.state.codeVerified && (
                <div>
                  <Form>
                    <Form.Group inline>
                      <Form.Field>
                        <label>
                          {t("buy.formVerificationPhone.formCodeSent.code")}
                        </label>
                      </Form.Field>
                      <Form.Field>
                        <Form.Input
                          type="text"
                          value={this.state.codeVerify}
                          onChange={this.handleCodeVerify.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Button
                          color="blue"
                          disabled={this.state.disabledBtnSendCode}
                          onClick={this.handleConfirmCodePhone.bind(this)}
                        >
                          {t(
                            "buy.formVerificationPhone.formCodeSent.buttonVerify"
                          )}
                        </Button>
                      </Form.Field>
                      <Form.Field>
                        <Button
                          basic
                          onClick={this.sendCode.bind(this)}
                          disabled={this.state.disabledBtnReSendCode}
                        >
                          {t(
                            "buy.formVerificationPhone.formCodeSent.buttonResend"
                          )}
                        </Button>
                      </Form.Field>
                      <Form.Field>
                        <Popup
                          trigger={
                            <Button
                              icon="angle left"
                              onClick={this.clearView.bind(this)}
                            />
                          }
                          content={t(
                            "buy.formVerificationPhone.formCodeSent.buttonBack"
                          )}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </div>
              )}
            </Form>
            {this.state.errorNetwork && (
              <div>
                <Message
                  error
                  content={
                    t(this.state.textMessage2)
                  }
                />
              </div>
            )}
          </Responsive>
          <Responsive minWidth={0} maxWidth={991}>
            <Form>
              {!this.state.codeSended && (
                <div>
                  <Form
                    loading={this.state.loading}
                    onSubmit={this.handleVerifyPhone.bind(this)}
                  >
                    <Segment placeholder>
                      <Form.Field>
                        <label className="titleMobile">
                          {t(
                            "buy.formVerificationPhone.formRequestCode.countryCode"
                          )}
                        </label>
                        <Form.Select
                          required
                          selection
                          search={true}
                          options={list}
                          value={this.state.partialPhone}
                          placeholder={t(
                            "profile.updateProfile.form.placeholderCountry"
                          )}
                          onChange={this.handlePrefit.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label className="titleMobile">
                          {t("buy.formVerificationPhone.formRequestCode.phone")}
                        </label>
                        <NumberFormat
                          value={this.state.phone}
                          allowNegative={false}
                          thousandSeparator={false}
                          placeholder={"12345678"}
                          onValueChange={values =>
                          {
                            const { value } = values;
                            this.setState({ phone: value });
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <div className="marginTop">
                          <Button
                            color="blue"
                            type="submit"
                            style={{
                              borderRadius: "40px/40px",
                              height: "50px",
                              width: "200px"
                            }}
                          >
                            {t(
                              "buy.formVerificationPhone.formRequestCode.buttonSend"
                            )}
                          </Button>
                        </div>
                      </Form.Field>
                    </Segment>
                  </Form>
                </div>
              )}
              {messageInfo}
              {this.state.codeSended && !this.state.codeVerified && (
                <div>
                  <Form>
                    <Segment placeholder>
                      <Form.Group inline>
                        <Form.Field>
                          <label>
                            {t("buy.formVerificationPhone.formCodeSent.code")}
                          </label>
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            type="text"
                            value={this.state.codeVerify}
                            onChange={this.handleCodeVerify.bind(this)}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Button
                            color="blue"
                            disabled={this.state.disabledBtnSendCode}
                            onClick={this.handleConfirmCodePhone.bind(this)}
                          >
                            {t(
                              "buy.formVerificationPhone.formCodeSent.buttonVerify"
                            )}
                          </Button>
                        </Form.Field>
                        <Form.Field>
                          <Button
                            basic
                            onClick={this.handleVerifyPhone.bind(this)}
                            disabled={this.state.disabledBtnReSendCode}
                          >
                            {t(
                              "buy.formVerificationPhone.formCodeSent.buttonResend"
                            )}
                          </Button>
                        </Form.Field>
                        <Form.Field>
                          <Popup
                            trigger={
                              <Button
                                icon="angle left"
                                onClick={this.clearView.bind(this)}
                              />
                            }
                            content={t(
                              "buy.formVerificationPhone.formCodeSent.buttonBack"
                            )}
                          />
                        </Form.Field>
                      </Form.Group>
                    </Segment>
                  </Form>
                </div>
              )}
            </Form>
          </Responsive>
        </div>
      </div>
    );
  }
}
export default translate(FormVerificationPhone);
