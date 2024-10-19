import React, { Component } from "react";
import {
  Form,
  Modal,
  Segment,
  Header,
  Grid,
  Button,
  Message,
  Icon,
  Divider,
  Label,
  Popup,
  List,
  Dimmer,
  Loader,
  Image,
  Step,
} from "semantic-ui-react";
import { Document, Page } from "react-pdf";
import "react-circular-progressbar/dist/styles.css";
import "./OptionDetail.css";
import userService from "../../../services/user";
import _ from "underscore";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
import attachments from "../../../services/attachments";
class OptionDetail extends Component {
  constructor(props) {
    super(props);
    this._Mounted = false;
    this.state = {
      firstName: "",
      lastName: "",
      userPhone: "",
      email: userService.getUserEmail(),
      userVerify: userService.getUserStatus() === "true",
      viewMessage: false,
      viewMessageEmail: false,
      userVerifyC:
        userService.getUserVerificationStatus() !== null
          ? userService.getUserVerificationStatus().C
          : "UNINITIATED",
      phoneVerified:
        window.sessionStorage.getItem("phoneVerified") === "true"
          ? true
          : false,
      codeVerify: "",
      loadForm: false,
      resultUpdate: null,
      modalOpen: false,
      sendForm: false,
      sexList: [
        { value: "male", text: "profile.optionDetail.sexList.male" },
        { value: "female", text: "profile.optionDetail.sexList.female" },
      ],
      documentType: [
        { value: "id", text: "ID" },
        { value: "dni", text: "DNI" },
        {
          value: "cedula",
          text: "profile.optionDetail.documentType.identificationCard",
        },
        {
          value: "passport",
          text: "profile.optionDetail.documentType.passport",
        },
        { value: "other", text: "profile.optionDetail.documentType.other" },
      ],
      gender: "",
      birthdate: "",
      typeDocument: "",
      numberDocumentId: "",
      sendEmail: false,
      userDirection: "",
      userLocalBitcoin: "",
      userFacebook: "",
      show: false,
      userData: {},
      userImage: [],
      interval: null,
      nickname: sessionStorage.getItem("nickname"),
      nicknameTem: "",
      errorInRed: false,
      juridic: false,
      translator: props.translate,
      modalMessage: "profile.optionDetail.messages.emptyMessage",
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
    this.setState({
      userVerify: userService.getUserStatus() === "true",
      firstName: window.sessionStorage.getItem("firstName"),
      lastName: window.sessionStorage.getItem("lastName"),
      userPhone: window.sessionStorage.getItem("phone"),
    });
    let username = userService.getUserName();
    let data = userService.getConfigUserGeneral(username);
    data
      .then((resp) => {
        let userData = this.getActualUserInfo(resp.data.result);
        // console.log(userData);
        sessionStorage.setItem(
          "nickname",
          userData.nickname !== undefined ? userData.nickname : ""
        );
        this.setState(
          {
            userData: userData,
            nickname: userData.nickname !== undefined ? userData.nickname : "",
            juridic:
              resp.data.result.company !== undefined &&
              resp.data.result.company === "true"
                ? true
                : false,
            nicknameExist: userData.nickname !== undefined,
          },
          () => {
            this._Mounted = true;
          }
        );

        this.loadImageUser(resp.data.result);
        if (resp.data.result.verification === undefined) {
          this.setState({
            userVerifyC: "UNINITIATED",
            show: true,
            phoneVerified: false,
          });
        } else {
          if (resp.data.result.verification.C === undefined) {
            this.setState({ userVerifyC: "UNINITIATED", show: true });
          } else {
            this.setState({
              userVerifyC:
                resp.data.result.verification.C.userVerificationStatus,
              show: true,
            });
          }
          if (resp.data.result.verification.B === undefined) {
            this.setState({ phoneVerified: false });
          } else {
            this.setState({ phoneVerified: true });
          }
          if (resp.data.result.verification.A === undefined) {
            this.setState({ userVerify: false });
          } else {
            this.setState({ userVerify: true });
          }
        }
      })
      .catch((error) => {
        this.setState({ errorInRed: true, show: true });
        this._Mounted = true;
        ////console.log(error);
      });
  }
  componentWillUnmount() {
    this._Mounted = false;
    clearInterval(this.state.interval);
  }
  async loadImageUser(userInfo) {
    if (userInfo.identityURL !== undefined) {
      try {
        let nameValue = String(userInfo.identityURL);
        if (nameValue.includes("https://attachment.dollarbtc.com")) {
          nameValue = nameValue.split("https://attachment.dollarbtc.com")[1];
          nameValue = nameValue.split("/")[2];
        }
        const response = await attachments.getAttachementUser(
          userService.getUserName(),
          nameValue
        );
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        let image = URL.createObjectURL(blob);
        this.setState({
          userImage: [
            ...this.state.userImage,
            {
              src: image,
              name: "identityURL",
              isPdf: userInfo.identityURL.includes("pdf"),
              message: "profile.optionDetail.docsImages.identity",
              status: true,
            },
          ],
        });
      } catch (error) {
        //console.log(error);
      }
    }
    if (userInfo.bankURL !== undefined) {
      try {
        let nameValue = String(userInfo.bankURL);
        if (nameValue.includes("https://attachment.dollarbtc.com")) {
          nameValue = nameValue.split("https://attachment.dollarbtc.com")[1];
          nameValue = nameValue.split("/")[2];
        }
        const response = await attachments.getAttachementUser(
          userService.getUserName(),
          nameValue
        );
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        let image = URL.createObjectURL(blob);
        this.setState({
          userImage: [
            ...this.state.userImage,
            {
              src: image,
              name: "bankURL",
              isPdf: userInfo.bankURL.includes("pdf"),
              message: "profile.optionDetail.docsImages.bank",
              status: true,
            },
          ],
        });
      } catch (error) {
        //console.log(error);
      }
    }
    if (userInfo.locationURL !== undefined) {
      try {
        let nameValue = String(userInfo.locationURL);
        if (nameValue.includes("https://attachment.dollarbtc.com")) {
          nameValue = nameValue.split("https://attachment.dollarbtc.com")[1];
          nameValue = nameValue.split("/")[2];
        }
        const response = await attachments.getAttachementUser(
          userService.getUserName(),
          nameValue
        );
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        let image = URL.createObjectURL(blob);
        this.setState({
          userImage: [
            ...this.state.userImage,
            {
              src: image,
              name: "locationURL",
              isPdf: userInfo.locationURL.includes("pdf"),
              message: "profile.optionDetail.docsImages.location",
              status: true,
            },
          ],
        });
      } catch (error) {
        //console.log(error);
      }
    }
    if (userInfo.selfURL !== undefined) {
      try {
        let nameValue = String(userInfo.selfURL);
        if (nameValue.includes("https://attachment.dollarbtc.com")) {
          nameValue = nameValue.split("https://attachment.dollarbtc.com")[1];
          nameValue = nameValue.split("/")[2];
        }
        const response = await attachments.getAttachementUser(
          userService.getUserName(),
          nameValue
        );
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        let image = URL.createObjectURL(blob);
        this.setState({
          userImage: [
            ...this.state.userImage,
            {
              src: image,
              name: "selfURL",
              isPdf: userInfo.selfURL.includes("pdf"),
              message: "profile.optionDetail.docsImages.selfie",
              status: true,
            },
          ],
        });
      } catch (error) {
        // console.log(error);
      }
    }
  }
  getActualUserInfo = (allInfo) => {
    var listKeys = Object.keys(allInfo);
    var listActualKeys = [];
    var actualfirstNameKey;
    var actualLastnameKey;
    var actualPhoneKey;
    var actualQuestionSecurityKey;
    var actualAnswerSecurityKey;
    var actualTypeDocumentIdentityKey;
    var actualNumberDocumentIdentityKey;
    var actualGenderKey;
    var actualBirthdateKey;
    var actualBirthplaceKey;
    var actualFamilyNameKey;
    var actualFamilyEmailKey;
    var actualUserLocalBitcoinKey;
    var actualUserFacebookKey;
    var actualUserAddressKey;
    var actualNickName;
    var actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration;
    for (var i = 0; i < listKeys.length; i++) {
      if (listKeys[i].startsWith("firstName")) {
        actualfirstNameKey = listKeys[i];
      } else if (listKeys[i].startsWith("lastName")) {
        actualLastnameKey = listKeys[i];
      } else if (listKeys[i].startsWith("phone")) {
        actualPhoneKey = listKeys[i];
      } else if (listKeys[i].startsWith("questionSecurity")) {
        actualQuestionSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith("answerSecurity")) {
        actualAnswerSecurityKey = listKeys[i];
      } else if (listKeys[i].startsWith("typeDocumentIdentity")) {
        actualTypeDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith("numberDocumentIdentity")) {
        actualNumberDocumentIdentityKey = listKeys[i];
      } else if (listKeys[i].startsWith("gender")) {
        actualGenderKey = listKeys[i];
      } else if (listKeys[i].startsWith("birthdate")) {
        actualBirthdateKey = listKeys[i];
      } else if (listKeys[i].startsWith("birthplace")) {
        actualBirthplaceKey = listKeys[i];
      } else if (listKeys[i].startsWith("familyName")) {
        actualFamilyNameKey = listKeys[i];
      } else if (listKeys[i].startsWith("familyEmail")) {
        actualFamilyEmailKey = listKeys[i];
      } else if (listKeys[i].startsWith("userLocalBitcoin")) {
        actualUserLocalBitcoinKey = listKeys[i];
      } else if (listKeys[i].startsWith("userFacebook")) {
        actualUserFacebookKey = listKeys[i];
      } else if (listKeys[i].startsWith("userDirection")) {
        actualUserAddressKey = listKeys[i];
      } else if (listKeys[i].startsWith("nickname")) {
        actualNickName = listKeys[i];
      } else if (listKeys[i] === "companyName") {
        actualCompanyName = listKeys[i];
      } else if (listKeys[i].startsWith("companyTypeOfFiscalRecord")) {
        actualCompanyTypeOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith("companyNumberOfFiscalRecord")) {
        actualCompanyNumberOfFiscalRecord = listKeys[i];
      } else if (listKeys[i].startsWith("companyYearRegistration")) {
        actualCompanyYearRegistration = listKeys[i];
      }
    }
    listActualKeys.push(
      actualfirstNameKey,
      actualLastnameKey,
      actualPhoneKey,
      actualQuestionSecurityKey,
      actualAnswerSecurityKey,
      actualTypeDocumentIdentityKey,
      actualNumberDocumentIdentityKey,
      actualGenderKey,
      actualBirthdateKey,
      actualBirthplaceKey,
      actualFamilyNameKey,
      actualFamilyEmailKey,
      actualUserLocalBitcoinKey,
      actualUserFacebookKey,
      actualUserAddressKey,
      actualNickName,
      actualCompanyName,
      actualCompanyTypeOfFiscalRecord,
      actualCompanyNumberOfFiscalRecord,
      actualCompanyYearRegistration,
      "address",
      "operationAccount",
      "environment",
      "type",
      "active",
      "email"
    );
    var modifiedObj = _.pick(allInfo, [listActualKeys]);
    var normalizeObject = {};
    Object.entries(modifiedObj).forEach(([key, value]) => {
      if (key.startsWith("firstName")) {
        normalizeObject.firstName = value;
      } else if (key.startsWith("lastName")) {
        normalizeObject.lastName = value;
      } else if (key.startsWith("email")) {
        normalizeObject.email = value;
      } else if (key.startsWith("active")) {
        normalizeObject.active = value;
      } else if (key === "type") {
        normalizeObject.type = value;
      } else if (key.startsWith("environment")) {
        normalizeObject.environment = value;
      } else if (key.startsWith("operationAccount")) {
        normalizeObject.operationAccount = value;
      } else if (key.startsWith("address")) {
        normalizeObject.address = value;
      } else if (key.startsWith("questionSecurity")) {
        normalizeObject.questionSecurity = value;
      } else if (key.startsWith("answerSecurity")) {
        normalizeObject.answerSecurity = value;
      } else if (key.startsWith("typeDocumentIdentity")) {
        normalizeObject.typeDocumentIdentity = value;
      } else if (key.startsWith("numberDocumentIdentity")) {
        normalizeObject.numberDocumentIdentity = value;
      } else if (key.startsWith("gender")) {
        normalizeObject.gender = value;
      } else if (key.startsWith("birthdate")) {
        normalizeObject.birthdate = value;
      } else if (key.startsWith("birthplace")) {
        normalizeObject.birthplace = value;
      } else if (key.startsWith("familyName")) {
        normalizeObject.familyName = value;
      } else if (key.startsWith("familyEmail")) {
        normalizeObject.familyEmail = value;
      } else if (key.startsWith("userLocalBitcoin")) {
        normalizeObject.userLocalBitcoin = value;
      } else if (key.startsWith("userFacebook")) {
        normalizeObject.userFacebook = value;
      } else if (key.startsWith("userDirection")) {
        normalizeObject.userDirection = value;
      } else if (key.startsWith("phone")) {
        normalizeObject.phone = value;
      } else if (key.startsWith("nickname")) {
        normalizeObject.nickname = value;
      } else if (key.startsWith("companyName")) {
        normalizeObject.companyName = value;
      } else if (key.startsWith("companyTypeOfFiscalRecord")) {
        normalizeObject.companyTypeOfFiscalRecord = value;
      } else if (key.startsWith("companyNumberOfFiscalRecord")) {
        normalizeObject.companyNumberOfFiscalRecord = value;
      } else if (key.startsWith("companyYearRegistration")) {
        normalizeObject.companyYearRegistration = value;
      }
    });
    return normalizeObject;
  };
  handleNickName(e) {
    this.setState({ nicknameTem: e.target.value });
  }
  handleNickNameModal() {
    this.setState({ showModalNick: true });
  }
  hadleVerifyUserTwoLevel() {
    window.location.href = "/verify";
  }
  handleEditProfile() {
    this.setState({
      activeItem: "editProfile",
    });
    this.props.changeItem("editProfile");
  }
  getSexValue(value) {
    let data = this.state.sexList.find(function (ele) {
      return ele.value === value;
    });
    if (data !== undefined) {
      return data.text;
    } else {
      return value;
    }
  }
  getTypeIdentityValue(value) {
    let data = this.state.documentType.find(function (ele) {
      return ele.value === value;
    });
    if (data !== undefined) {
      return data.text;
    } else {
      return value;
    }
  }
  emailVerify() {
    userService.verifyUserInit(this.state.email);
    let interval = setInterval(() => {
      this.getConfigUser();
    }, 10000);
    this.setState({ interval: interval });
    this.setState({ viewMessageEmail: true, sendEmail: true });
    setTimeout(() => {
      this.setState({ viewMessageEmail: false });
    }, 7000);
  }
  handleVerifyPhone() {
    // userService
    //   .sendMessagePhone()
    // //console.log(this.state.phoneVerified);
    //console.log(window.sessionStorage.getItem('language').toUpperCase());
    let body = {
      userName: userService.getUserName(),
      language: window.sessionStorage.getItem("language").toUpperCase(),
      sendSms: true,
      sendMail: false,
    };
    userService
      .sendAuthCodeCore(body)
      .then((resp) => {
        //  console.log(resp);
      })
      .catch((error) => {
        //  console.log(error);
      });
    this.setState({
      modalOpen: true,
      modalMessage: "profile.optionDetail.messages.modalMessage",
    });
  }
  getConfigUser() {
    let username = userService.getUserName();
    let data = userService.getConfigUserGeneral(username);
    data.then((resp) => {
      if (resp.data.result.verification !== undefined) {
        if (resp.data.result.verification.A !== undefined) {
          this.setState({ userVerify: true });
          this.verifySession();
          clearInterval(this.state.interval);
        }
      }
    });
  }
  verifySession(resp) {
    let userStatusA, userStatusB, userStatusC;

    if (resp.data.result.verification === undefined) {
      userStatusC = "UNINITIATED";
      userStatusA = false;
      userStatusB = false;
    } else {
      if (resp.data.result.verification.C === undefined) {
        userStatusC = "UNINITIATED";
      } else {
        userStatusC = resp.data.result.verification.C.userVerificationStatus;
      }
      if (resp.data.result.verification.A === undefined) {
        userStatusA = false;
      } else {
        userStatusA = true;
      }
      if (resp.data.result.verification.B === undefined) {
        userStatusB = false;
      } else {
        userStatusB = true;
      }
    }

    let verificationStatus = {
      A: userStatusA,
      B: userStatusB,
      C: userStatusC,
    };
    window.sessionStorage.setItem(
      "userVerificationStatus",
      JSON.stringify(verificationStatus)
    );
  }
  handleCodeVerify(e) {
    this.setState({ codeVerify: e.target.value });
  }
  handleConfirmCodePhone() {
    if (this.state.codeVerify !== "") {
      this.setState({ loadForm: true, sendForm: true });
      let body = {
        userName: userService.getUserName(),
        code: this.state.codeVerify,
      };
      userService
        .authCodeCore(body)
        .then(async (resp) => {
          //console.log(resp);
          if (resp.data === "OK") {
            await userService.verifyPhoneBushido(userService.getUserName());
            // console.log("entrando al validate code con el input lleno OK");
            this.setState({
              resultUpdate: "",
              resultUpdate2: true,
              viewMessage: true,
              textMessage: "profile.optionDetail.messages.phoneVerified",
              phoneVerified: true,
              codeVerify: "",
              loadForm: false,
            });
            window.sessionStorage.setItem("phoneVerified", "true");
            let status = userService.getUserVerificationStatus();
            // console.log(status);
            let statusUpdate;
            if (status === null) {
              statusUpdate = {
                A: status,
                B: true,
                C: status,
              };
            } else {
              statusUpdate = {
                A: status.A,
                B: true,
                C: status.C,
              };
            }

            window.sessionStorage.setItem(
              "userVerificationStatus",
              JSON.stringify(statusUpdate)
            );

            let send = {
              userName: sessionStorage.getItem("username"),
              fieldNames: ["phone"],
              userVerificationType: "B",
              info: "Verification of user's telephone number",
            };
            let url = userService.verifyUserRequestCore(send);
            url
              .then((rep) => {
                // console.log(rep);
              })
              .catch((error) => {
                //console.log(error);
              });
          } else {
            //console.log('entrando por el else');
            this.setState({
              viewMessage: true,
              resultUpdate: "",
              resultUpdate2: false,
              textMessage:
                "profile.optionDetail.messages.phoneVerificationFail",
              phoneVerified: false,
              codeVerify: "",
              loadForm: false,
            });
          }
        })
        .catch((error) => {
          //console.log(error);
          this.setState({
            resultUpdate: "",
            resultUpdate2: false,
            viewMessage: true,
            textMessage: "profile.optionDetail.messages.phoneVerificationFail",
            phoneVerified: false,
            codeVerify: "",
            loadForm: false,
          });
        });
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "profile.optionDetail.messages.emptyField",
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          textMessage: "",
        });
      }, 3000);
    }
  }
  closeModalOption() {
    this.setState({
      modalOpen: false,
      modalMessage: "",
      viewMessage: false,
      textMessage: "",
      resultUpdate: null,
      resultUpdate2: false,
      sendForm: false,
      codeVerify: "",
    });
  }
  closeModalOptionNick() {
    this.setState({
      showModalNick: false,
      viewMessageNick: false,
      textMessage: "",
      sendForm: false,
    });
  }

  formatDataVisualUser(string) {
    if (string.length !== undefined) {
      if (string.length > 0) {
        let long = string.length;
        let porcent = Math.round(long * 0.4);
        let array = [];
        for (let x of string) {
          array.push(x);
        }

        let rever = array.reverse();
        let result = "";
        if (rever.length >= 2 && rever.length <= 11) {
          for (let i = 2; i < porcent + 2; i++) {
            if (rever[i] !== undefined) {
              rever[i] = "*";
            } else {
              continue;
            }
          }
        }
        if (rever.length >= 11) {
          for (let i = 4; i < porcent + 4; i++) {
            if (rever[i] !== undefined) {
              rever[i] = "*";
            } else {
              continue;
            }
          }
        }
        if (rever.length < 2) {
          for (let i = 0; i < porcent; i++) {
            if (rever[i] !== undefined) {
              rever[i] = "*";
            } else {
              continue;
            }
          }
        }

        let res = rever.reverse();
        for (let t of res) {
          result = result + t;
        }

        return result;
      }
    }
  }
  async addDataUser() {
    try {
      sessionStorage.setItem("nickname", this.state.nicknameTem);
      let body = {
        userName: userService.getUserName(),
        fieldName: "nickname",
        fieldValue: this.state.nicknameTem,
      };

      const response =
        this.state.nicknameExist === true
          ? await userService.updateUserData(body)
          : await userService.addDataUserAsync(body);
      if (response.data === "OK") {
        this.setState({
          nickname: this.state.nicknameTem,
          viewMessageNick: true,
          textMessage: "profile.optionDetail.messages.nicknameCreated",
          updateNick: true,
        });
      }
    } catch {}
  }
  handleConfirmNickName() {
    if (this.state.nicknameTem !== "") {
      this.setState({ sendForm: true, loadForm: true });
      // //////console.log(this.state.nicknameTem);
      userService
        .updateNewNickName(this.state.nicknameTem)
        .then((resp) => {
          // //////console.log(resp);
          this.setState({ loadForm: false });
          if (resp.data.errors === null) {
            if (resp.data.payload === true) {
              this.addDataUser();
            } else {
              this.setState({
                viewMessageNick: true,
                sendForm: false,
                textMessage: "profile.optionDetail.messages.duplicatedNickname",
              });
              setTimeout(() => {
                this.setState({
                  viewMessageNick: false,
                  textMessage: "",
                });
              }, 6000);
            }
          } else {
            this.setState({
              viewMessageNick: true,
              sendForm: false,
              textMessage: "profile.optionDetail.messages.errorServer",
            });
            setTimeout(() => {
              this.setState({
                viewMessageNick: false,
                textMessage: "",
              });
            }, 6000);
          }
        })
        .catch((error) => {
          //////console.log(error);
        });
    } else {
      this.setState({
        viewMessageNick: true,
        textMessage: "profile.optionDetail.messages.requiredField",
      });
      setTimeout(() => {
        this.setState({
          viewMessageNick: false,
          textMessage: "",
        });
      }, 6000);
    }
  }
  render() {
    // console.log(this.state.userImage)
    let t = this.state.translator;
    let email, phone, message, stepPhone, stepUsuario, images;
    let cancelButtonModal, buttonModal, messageToken, cancel, nickname;
    if (this.state.viewMessageEmail) {
      message = (
        <Message
          info
          content={t("profile.optionDetail.messages.emailVerification")}
        />
      );
    }
    if (this.state.userData.phone !== undefined) {
      if (this.state.phoneVerified) {
        stepPhone = (
          <Step className="step-verified">
            <Popup
              trigger={
                <Step.Content>
                  <Step.Title>
                    <span style={{ color: "white" }}>
                      {t("profile.optionDetail.stepPhone.phone")}
                    </span>
                  </Step.Title>
                </Step.Content>
              }
              content={t("profile.optionDetail.stepPhone.verified")}
            />
          </Step>
        );
      } else {
        stepPhone = (
          <Step className="stepnot-verified">
            <Popup
              trigger={
                <Step.Content>
                  <Step.Title>
                    <span style={{ color: "white" }}>
                      {t("profile.optionDetail.stepPhone.phone")}
                    </span>
                  </Step.Title>
                </Step.Content>
              }
              content={t("profile.optionDetail.stepPhone.notVerify")}
            />
          </Step>
        );
      }
    } else {
      stepPhone = (
        <Step>
          <Popup
            trigger={
              <Step.Content>
                <Step.Title>
                  <span style={{ color: "gray" }}>
                    {t("profile.optionDetail.stepPhone.phone")}
                  </span>
                </Step.Title>
              </Step.Content>
            }
            content={t("profile.optionDetail.stepPhone.popup")}
          />
        </Step>
      );
    }
    if (this.state.userVerifyC === "UNINITIATED") {
      stepUsuario = (
        <Step>
          <Popup
            trigger={
              <Step.Content>
                <Step.Title>
                  <span style={{ color: "gray" }}>
                    {t("profile.optionDetail.stepUser.user")}
                  </span>
                </Step.Title>
              </Step.Content>
            }
            content={t("profile.optionDetail.stepUser.popup")}
          />
        </Step>
      );
    } else {
      if (this.state.userVerifyC === "OK") {
        stepUsuario = (
          <Step className="step-verified">
            <Popup
              trigger={
                <Step.Content>
                  <Step.Title>
                    <span style={{ color: "white" }}>
                      {t("profile.optionDetail.stepUser.user")}
                    </span>
                  </Step.Title>
                </Step.Content>
              }
              content={t("profile.optionDetail.stage.verified")}
            />
          </Step>
        );
      }
      if (this.state.userVerifyC === "FAIL") {
        stepUsuario = (
          <Step className="stepnot-verified">
            <Popup
              trigger={
                <Step.Content>
                  <Step.Title>
                    <span style={{ color: "white" }}>
                      {t("profile.optionDetail.stepUser.user")}
                    </span>
                  </Step.Title>
                </Step.Content>
              }
              content={t("profile.optionDetail.stage.fail")}
            />
          </Step>
        );
      }
      if (this.state.userVerifyC === "PROCESSING") {
        stepUsuario = (
          <Step>
            <Popup
              trigger={
                <Step.Content>
                  <Step.Title>
                    <span style={{ color: "grey" }}>
                      {t("profile.optionDetail.stepUser.user")}
                    </span>
                  </Step.Title>
                </Step.Content>
              }
              content={t("profile.optionDetail.stage.processing")}
            />
          </Step>
        );
      }
    }
    if (this.state.resultUpdate === null) {
      buttonModal = (
        <Button
          color="blue"
          type="submit"
          disabled={this.state.sendForm}
          onClick={this.handleConfirmCodePhone.bind(this)}
        >
          {t("profile.optionDetail.stepPhone.verify")}
        </Button>
      );
      cancelButtonModal = (
        <Button
          color="grey"
          disabled={this.state.sendForm}
          onClick={this.closeModalOption.bind(this)}
        >
          {t("profile.optionDetail.stepPhone.buttonCancel")}
        </Button>
      );
    }
    if (this.state.viewMessage) {
      messageToken = (
        <Message info floating content={t(this.state.textMessage)} />
      );
      cancel = (
        <Button color="blue" onClick={this.closeModalOption.bind(this)}>
          {t("profile.optionDetail.messages.close")}
        </Button>
      );
    }
    if (this.state.viewMessageNick) {
      messageToken = (
        <Message info floating content={t(this.state.textMessage)} />
      );
    }
    if (this.state.userImage.length > 0) {
      images = this.state.userImage.map((element, id) => {
        if (element.isPdf) {
          return (
            <Modal
              key={id}
              trigger={
                <List.Item
                  key={id}
                  style={{ marginBottom: "-100px" }}
                  // onClick={() => window.open(element.src, "_blank")}
                >
                  <Document file={element.src} externalLinkTarget="_blank">
                    <Page pageNumber={1} width={150} height={150} />
                  </Document>
                </List.Item>
              }
            >
              <Modal.Header>{t(element.message)}</Modal.Header>
              <Modal.Content>
                <Grid centered>
                  <Document file={element.src} externalLinkTarget="_blank">
                    <Page pageNumber={1} width={400} height={400} />
                  </Document>
                </Grid>
              </Modal.Content>
            </Modal>
          );
        } else {
          return (
            <Modal
              key={id}
              trigger={
                <List.Item>
                  <Image
                    src={element.src}
                    size="small"
                    as="a"
                    style={{ maxHeight: "500px" }}
                  />
                </List.Item>
              }
            >
              <Modal.Header>{t(element.message)}</Modal.Header>
              <Modal.Content>
                <Image centered src={element.src} size="medium" />
              </Modal.Content>
            </Modal>
          );
        }
      });
    }

    return (
      <div>
        <Dimmer.Dimmable dimmed={!this.state.show}>
          <Dimmer active={!this.state.show} inverted>
            <Loader>{t("profile.optionDetail.loading")}</Loader>
          </Dimmer>
          {this.state.errorInRed && (
            <Segment color={!isMobile ? "orange" : ""} basic={isMobile}>
              <Header
                textAlign="center"
                style={isMobile ? { color: "#207ef2" } : {}}
              >
                {t("profile.optionDetail.messages.yourData")}
              </Header>
              <Message
                info
                content={t("profile.optionDetail.messages.errorInRed")}
              />
            </Segment>
          )}
          {!this.state.errorInRed && (
            <Segment color={!isMobile ? "orange" : ""} basic={isMobile}>
              {!isMobile && (
                <Header textAlign="center">
                  {t("profile.optionDetail.messages.yourData")}
                </Header>
              )}
              {isMobile && (
                <div>
                  <Header
                    as="h4"
                    textAlign="center"
                    className="titleComponent"
                    style={{ fontWeight: "bold" }}
                  >
                    {t("profile.optionDetail.messages.yourData")}
                  </Header>
                  <Divider style={{ marginTop: -10, borderColor: "#207ef2" }} />
                </div>
              )}
              <Grid columns="equal">
                <Grid.Row textAlign="center">
                  <Grid.Column
                    largeScreen={16}
                    mobile={16}
                    computer={16}
                    tablet={16}
                  >
                    <Form.Field inline>
                      <Step.Group size="mini">
                        <Step
                          className={
                            this.state.userVerify === false
                              ? "stepnot-verified"
                              : "step-verified"
                          }
                        >
                          <Popup
                            trigger={
                              <Step.Content>
                                <Step.Title>
                                  <span style={{ color: "white" }}>
                                    {t("profile.optionDetail.stepEmail.email")}
                                  </span>
                                </Step.Title>
                              </Step.Content>
                            }
                            content={
                              this.state.userVerify === false
                                ? t("profile.optionDetail.stepEmail.popup")
                                : t("profile.optionDetail.stepEmail.verified")
                            }
                          />
                        </Step>

                        {stepPhone}

                        {stepUsuario}
                      </Step.Group>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    largeScreen={16}
                    computer={16}
                    mobile={16}
                    tablet={16}
                  >
                    {this.state.show && (
                      <Form>
                        <Form.Group widths="equal">
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.nickname.value")}{" "}
                                {this.state.nickname === "" && (
                                  <Button
                                    title={t(
                                      "profile.optionDetail.nickname.popup"
                                    )}
                                    size="tiny"
                                    onClick={this.handleNickNameModal.bind(
                                      this
                                    )}
                                  >
                                    {t("profile.optionDetail.nickname.create")}
                                  </Button>
                                )}
                              </strong>
                            </label>

                            <div />
                            {this.state.nickname !== "" && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.nickname}
                              </p>
                            )}
                            {this.state.nickname !== "" && <div />}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.name")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.firstName !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.userData.firstName}
                              </p>
                            )}
                            {this.state.userData.firstName === undefined && (
                              <div />
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.lastName")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.lastName !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.userData.lastName}
                              </p>
                            )}
                            {this.state.userData.lastName === undefined && (
                              <div />
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.email")} {email}
                              </strong>
                              {!this.state.userVerify && (
                                <Button
                                  size="tiny"
                                  onClick={this.emailVerify.bind(this)}
                                >
                                  {t(
                                    "profile.optionDetail.stepEmail.buttonVerify"
                                  )}
                                </Button>
                              )}
                            </label>
                            <div />
                            <p style={isMobile ? { color: "#207ef2" } : {}}>
                              {this.formatDataVisualUser(this.state.email)}
                            </p>
                            {this.state.email === "" && <div />}
                          </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.phone")} {phone}
                              </strong>
                              {!this.state.phoneVerified &&
                                this.state.userData.phone !== undefined && (
                                  <Button
                                    size="tiny"
                                    onClick={this.handleVerifyPhone.bind(this)}
                                  >
                                    {t("profile.optionDetail.stepPhone.verify")}
                                  </Button>
                                )}
                            </label>
                            <div />
                            {this.state.userData.phone !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.phone
                                )}
                              </p>
                            )}
                            {this.state.userData.phone === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.id")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.typeDocumentIdentity !==
                              undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  t(
                                    this.getTypeIdentityValue(
                                      this.state.userData.typeDocumentIdentity
                                    )
                                  )
                                )}
                              </p>
                            )}
                            {this.state.userData.typeDocumentIdentity ===
                              undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.number")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.numberDocumentIdentity !==
                              undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.numberDocumentIdentity
                                )}
                              </p>
                            )}
                            {this.state.userData.numberDocumentIdentity ===
                              undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.sex")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.gender !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {t(
                                  this.getSexValue(this.state.userData.gender)
                                )}
                              </p>
                            )}
                            {this.state.userData.gender === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.birthday")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.birthdate !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.userData.birthdate}
                              </p>
                            )}
                            {this.state.userData.birthdate === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.birthplace")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.birthplace !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.userData.birthplace}
                              </p>
                            )}
                            {this.state.userData.birthplace === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.familyContact")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.familyName !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.state.userData.familyName}
                              </p>
                            )}
                            {this.state.userData.familyName === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.emailContact")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.familyEmail !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.familyEmail
                                )}
                              </p>
                            )}
                            {this.state.userData.familyEmail === undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                        </Form.Group>
                        <Form.Group >
                          <Form.Field width={4}>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t(
                                  "profile.optionDetail.fields.securityQuestion"
                                )}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.questionSecurity !==
                              undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.questionSecurity
                                )}
                              </p>
                            )}
                            {this.state.userData.questionSecurity ===
                              undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field width={4}>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t(
                                  "profile.optionDetail.fields.securityAnswer"
                                )}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.answerSecurity !==
                              undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.answerSecurity
                                )}
                              </p>
                            )}
                            {this.state.userData.answerSecurity ===
                              undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field>
                          <Form.Field width={8}></Form.Field>
                          {/* <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t(
                                  "profile.optionDetail.fields.localbitcoinUser"
                                )}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.userLocalBitcoin !==
                              undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.userLocalBitcoin
                                )}
                              </p>
                            )}
                            {this.state.userData.userLocalBitcoin ===
                              undefined && (
                              <p style={{ color: "white" }}>holaaaa </p>
                            )}
                          </Form.Field> */}
                          {/* <Form.Field>
                            <label>
                              <strong
                                style={isMobile ? { color: "#207ef2" } : {}}
                              >
                                {t("profile.optionDetail.fields.userFacebook")}
                              </strong>
                            </label>
                            <div />
                            {this.state.userData.userFacebook !== undefined && (
                              <p style={isMobile ? { color: "#207ef2" } : {}}>
                                {this.formatDataVisualUser(
                                  this.state.userData.userFacebook
                                )}
                              </p>
                            )}
                            {this.state.userData.userFacebook === undefined && (
                              <div />
                            )}
                          </Form.Field> */}
                        </Form.Group>
                        {this.state.juridic && (
                          <Form.Group widths="equal">
                            <Form.Field>
                              <label>
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t("profile.optionDetail.fields.companyName")}
                                </strong>
                              </label>
                              <div />
                              {this.state.userData.companyName !==
                                undefined && (
                                <p style={isMobile ? { color: "#207ef2" } : {}}>
                                  {this.state.userData.companyName}
                                </p>
                              )}
                              {this.state.userData.companyName ===
                                undefined && (
                                <p style={{ color: "white" }}>holaaaa </p>
                              )}
                            </Form.Field>
                            <Form.Field>
                              <label>
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t(
                                    "profile.optionDetail.fields.documentTypeFiscalRecord"
                                  )}
                                </strong>
                              </label>
                              <div />
                              {this.state.userData.companyTypeOfFiscalRecord !==
                                undefined && (
                                <p style={isMobile ? { color: "#207ef2" } : {}}>
                                  {
                                    this.state.userData
                                      .companyTypeOfFiscalRecord
                                  }
                                </p>
                              )}
                              {this.state.userData.companyTypeOfFiscalRecord ===
                                undefined && (
                                <p style={{ color: "white" }}>holaaaa </p>
                              )}
                            </Form.Field>
                            <Form.Field>
                              <label>
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t(
                                    "profile.optionDetail.fields.numberFiscalRecord"
                                  )}
                                </strong>
                              </label>
                              <div />
                              {this.state.userData
                                .companyNumberOfFiscalRecord !== undefined && (
                                <p style={isMobile ? { color: "#207ef2" } : {}}>
                                  {
                                    this.state.userData
                                      .companyNumberOfFiscalRecord
                                  }
                                </p>
                              )}
                              {this.state.userData
                                .companyNumberOfFiscalRecord === undefined && (
                                <p style={{ color: "white" }}>holaaaa </p>
                              )}
                            </Form.Field>
                            <Form.Field>
                              <label>
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t(
                                    "profile.optionDetail.fields.registrationYear"
                                  )}
                                </strong>
                              </label>
                              <div />
                              {this.state.userData.companyYearRegistration !==
                                undefined && (
                                <p style={isMobile ? { color: "#207ef2" } : {}}>
                                  {this.state.userData.companyYearRegistration}
                                </p>
                              )}
                              {this.state.userData.companyYearRegistration ===
                                undefined && (
                                <p style={{ color: "white" }}>holaaaa </p>
                              )}
                            </Form.Field>
                          </Form.Group>
                        )}
                        <Form.Group>
                          <Form.Field width={12}>
                            <label>
                              {this.state.juridic && (
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t(
                                    "profile.optionDetail.fields.companyAddress"
                                  )}
                                </strong>
                              )}
                              {!this.state.juridic && (
                                <strong
                                  style={isMobile ? { color: "#207ef2" } : {}}
                                >
                                  {t("profile.optionDetail.fields.address")}
                                </strong>
                              )}
                            </label>
                            <div />
                            {this.state.userData.userDirection !==
                              undefined && (
                              <Form.TextArea
                                id="text-dir"
                                style={{
                                  border: "0px",
                                  paddingTop: "0px",
                                  paddingLeft: "0px",
                                  fontFamily: "inherit",
                                  opacity: "inherit!important",
                                }}
                                style={isMobile ? { color: "#207ef2" } : {}}
                                disabled
                                value={this.state.userData.userDirection}
                              />
                            )}
                            {this.state.userData.userDirection ===
                              undefined && <div />}
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    )}
                    {message}
                  </Grid.Column>
                </Grid.Row>
                {this.state.userImage.length > 0 && (
                  <Grid.Row style={{ paddingTop: "0px" }}>
                    <Grid.Column
                      largeScreen={16}
                      computer={16}
                      mobile={16}
                      tablet={16}
                    >
                      <Header
                        as="h5"
                        textAlign="center"
                        style={isMobile ? { color: "#207ef2" } : {}}
                      >
                        {t("profile.optionDetail.fields.documents")}
                        <Divider hidden />
                        <List horizontal>{images}</List>
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                )}
              </Grid>
              <Segment textAlign="center" basic>
                <Button
                  color="blue"
                  size={isMobile ? "large" : "medium"}
                  style={{ borderRadius: isMobile ? 40 : "" }}
                  onClick={this.handleEditProfile.bind(this)}
                >
                  <span>{t("profile.optionDetail.buttonUpdate")}</span>
                </Button>
              </Segment>
            </Segment>
          )}
        </Dimmer.Dimmable>
        <Modal open={this.state.modalOpen} size="small">
          <Header
            icon="exclamation circle"
            content={t("profile.optionDetail.modalVerification.header")}
          />

          <Modal.Content>
            <Modal.Description>
              <Form loading={this.state.loadForm} error>
                <Segment basic>
                  <p style={{ fontSize: 14 }}>{t(this.state.modalMessage)}</p>
                  <Form.Field hidden={this.state.resultUpdate2}>
                    <label>
                      {t("profile.optionDetail.modalVerification.labelCode")}
                    </label>
                    <input
                      type="text"
                      value={this.state.codeVerify}
                      onChange={this.handleCodeVerify.bind(this)}
                    />
                  </Form.Field>
                  {messageToken}
                </Segment>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            {cancelButtonModal}
            {buttonModal}
            {cancel}
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.showModalNick} size="small">
          <Header
            icon="exclamation circle"
            content={t("profile.optionDetail.modalNickname.header")}
          />
          <Modal.Content>
            <Modal.Description>
              <Form loading={this.state.loadForm} error>
                <Segment basic>
                  <h3>{t("profile.optionDetail.modalNickname.subHeader")}</h3>

                  <Form.Field>
                    <label>
                      {t("profile.optionDetail.modalNickname.labelNickname")}
                    </label>
                    <input
                      type="text"
                      value={this.state.nicknameTem}
                      onChange={this.handleNickName.bind(this)}
                    />
                  </Form.Field>
                  {messageToken}
                </Segment>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.updateNick && (
              <Button
                color="grey"
                disabled={this.state.sendForm}
                onClick={this.closeModalOptionNick.bind(this)}
              >
                {t("profile.optionDetail.modalNickname.buttonClose")}
              </Button>
            )}
            {!this.state.updateNick && (
              <Button
                color="blue"
                type="submit"
                disabled={this.state.sendForm}
                onClick={this.handleConfirmNickName.bind(this)}
              >
                {t("profile.optionDetail.modalNickname.buttonSave")}
              </Button>
            )}
            {this.state.updateNick && (
              <Button
                color="blue"
                onClick={this.closeModalOptionNick.bind(this)}
              >
                {t("profile.optionDetail.modalNickname.buttonClose")}
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(OptionDetail);
