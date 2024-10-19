import React, { Component } from "react";
import "../BuyBitcoins.css";
import {
  Header,
  Segment,
  Form,
  Grid,
  Button,
  Label,
  Icon,
  Message,
  Responsive,
  Divider,
} from "semantic-ui-react";
import Files from "react-files";
import id from "../../../img/verifyicon1.png";
import bank from "../../../img/verifyicon2.png";
import location from "../../../img/verifyicon3.png";
import selff from "../../../img/verifyiconId.png";
import userAPI from "../../../services/user";
import translate from "../../../i18n/translate";
import Resizer from "react-image-file-resizer";
class FormVerificationIdentity extends Component {
  constructor(props) {
    super(props);
    this.dniRef = React.createRef();
    this.bankRef = React.createRef();
    this.locationRef = React.createRef();
    this.selfRef = React.createRef();
    this.newresice = this.newresice.bind(this);
    this.state = {
      dataPreload: null,
      firstName: "",
      lastName: "",
      userPhone: "",
      partialPhone: "",
      birtdate: "",
      birtdateCountry: "",
      sex: "",
      sexList: [
        {
          key: "m",
          value: "male",
          text: props.translate("buy.formVerificationIdentity.sexList.male"),
        },
        {
          key: "f",
          value: "female",
          text: props.translate("buy.formVerificationIdentity.sexList.female"),
        },
      ],
      documentType: [
        {
          key: "i",
          value: "id",
          text: props.translate("buy.formVerificationIdentity.documentType.id"),
        },
        {
          key: "dn",
          value: "dni",
          text: props.translate(
            "buy.formVerificationIdentity.documentType.dni"
          ),
        },
        {
          key: "cd",
          value: "cedula",
          text: props.translate(
            "buy.formVerificationIdentity.documentType.identificationCard"
          ),
        },
        {
          key: "pass",
          value: "passport",
          text: props.translate(
            "buy.formVerificationIdentity.documentType.passport"
          ),
        },
        {
          key: "ot",
          value: "other",
          text: props.translate(
            "buy.formVerificationIdentity.documentType.other"
          ),
        },
      ],
      email: this.props.configUser.email,
      typeDocument: "",
      otherDocument: "",
      numberDocumentId: "",
      isPdf: false,
      direction: "",
      question: "",
      request: "",
      nameFamily: "",
      emailFamily: "",
      userLocalBitcoin: "",
      userFacebook: "",
      idImg: id,
      addFileDni: true,
      bankImg: bank,
      addFileBank: true,
      locationImg: location,
      addFileLocation: true,
      selffImg: selff,
      addFileSelf: true,
      idFile: {},
      bankFile: {},
      locationFile: {},
      selfFile: {},
      errorFileDni: false,
      errorFileBank: false,
      errorFileLocation: false,
      errorFileSelf: false,
      messageText: "",
      errorPaymentType: false,
      errorTypeDocument: false,
      errorDocument: false,
      errorQuestion: false,
      errorResponse: false,
      errorNetwork: false,
      errorOtherTypedocument: false,
      selecteOtherFile: false,
      errorFile: false,
      arrayUserData: [],
      userData: this.props.configUser,
      identitySended: false,
      translator: props.translate,
      juridic: false,
      companyName: "",
      companyTypeOfFiscalRecord: "",
      companyNumberOfFiscalRecord: "",
      companyYearRegistration: "",
    };
    this.initVerification = this.initVerification.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState(
        {
          translator: nextProps.translate,
        },
        () => {
          this.setState({
            sexList: [
              {
                key: "m",
                value: "male",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.sexList.male"
                ),
              },
              {
                key: "f",
                value: "female",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.sexList.female"
                ),
              },
            ],
            documentType: [
              {
                key: "i",
                value: "id",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.documentType.id"
                ),
              },
              {
                key: "dn",
                value: "dni",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.documentType.dni"
                ),
              },
              {
                key: "cd",
                value: "cedula",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.documentType.identificationCard"
                ),
              },
              {
                key: "pass",
                value: "passport",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.documentType.passport"
                ),
              },
              {
                key: "ot",
                value: "other",
                text: nextProps.translate(
                  "buy.formVerificationIdentity.documentType.other"
                ),
              },
            ],
          });
        }
      );
    }
  }
  componentDidMount() {
    ////console.log(userAPI.getActualUserInfo(this.state.userData));
    this.formatPreviusData(userAPI.getActualUserInfo(this.state.userData));
    this.setState({
      dataPreLoad: userAPI.getActualUserInfo(this.state.userData),
      juridic:
        this.state.userData.company !== undefined &&
        this.state.userData.company === "true"
          ? true
          : false,
    });
  }
  formatPreviusData(userData) {
    console.log(userData);
    if (userData.typeDocumentIdentity !== undefined) {
      let document = this.state.documentType.find(function (element) {
        return element.value === userData.typeDocumentIdentity;
      });
      if (document === undefined) {
        this.setState({ typeDocument: "other" });
      } else {
        this.setState({ typeDocument: userData.typeDocumentIdentity });
      }
    } else {
      this.setState({ typeDocument: "" });
    }
    this.setState(
      {
        request:
          userData.answerSecurity === undefined
            ? this.state.request
            : userData.answerSecurity,
        typeDocument:
          userData.typeDocumentIdentity === undefined
            ? this.state.typeDocument
            : userData.typeDocumentIdentity,
        numberDocumentId:
          userData.numberDocumentIdentity === undefined
            ? this.state.numberDocumentId
            : userData.numberDocumentIdentity,
        direction:
          userData.userDirection === undefined
            ? this.state.direction
            : userData.userDirection,
        question:
          userData.questionSecurity === undefined
            ? this.state.question
            : userData.questionSecurity,
        nameFamily:
          userData.familyName === undefined
            ? this.state.nameFamily
            : userData.familyName,
        emailFamily:
          userData.familyEmail === undefined
            ? this.state.emailFamily
            : userData.familyEmail,
        firstName:
          userData.firstName === undefined
            ? this.state.firstName
            : userData.firstName,
        lastName:
          userData.lastName === undefined
            ? this.state.lastName
            : userData.lastName,
        birtdate:
          userData.birthdate === undefined
            ? this.state.birtdate
            : userData.birthdate,
        sex: userData.gender === undefined ? this.state.sex : userData.gender,
        birtdateCountry:
          userData.birthplace === undefined
            ? this.state.birtdateCountry
            : userData.birthplace,
        userLocalBitcoin:
          userData.userLocalBitcoin === undefined
            ? this.state.userLocalBitcoin
            : userData.userLocalBitcoin,
        userFacebook:
          userData.userFacebook === undefined
            ? this.state.userFacebook
            : userData.userFacebook,
        existId:
          this.state.userData.identityURL === undefined
            ? false
            : this.state.userData.identityURL === ""
            ? false
            : this.state.userData.identityURL === null
            ? false
            : true,
        existBank:
          this.state.userData.bankURL === undefined
            ? false
            : this.state.userData.bankURL === ""
            ? false
            : this.state.userData.bankURL === null
            ? false
            : true,
        existSelf:
          this.state.userData.selfURL === undefined
            ? false
            : this.state.userData.selfURL === ""
            ? false
            : this.state.userData.selfURL === null
            ? false
            : true,
        existLocation:
          this.state.userData.locationURL === undefined
            ? false
            : this.state.userData.locationURL === ""
            ? false
            : this.state.userData.locationURL === null
            ? false
            : true,
      },
      () => console.log(this.state.existId)
    );
  }
  handleRequest(e, data) {
    this.setState({ request: e.target.value });
  }
  handleTypeDocument(e, data) {
    this.setState({
      selecteOtherFile: data.value === "other",
      typeDocument: data.value,
      typeDocumentText: data.value,
    });
    let da = this.state.documentType.find(function (ele) {
      return ele.text === data.value;
    });
    if (da !== undefined) {
    }
  }
  handleOtherTypeDocument(e, data) {
    this.setState({
      otherDocument: e.target.value,
      typeDocument: e.target.value,
    });
  }
  handleNumberDocumentId(e, data) {
    this.setState({ numberDocumentId: e.target.value });
  }
  handleDirection(e, data) {
    this.setState({ direction: e.target.value });
  }
  handleQuestion(e, data) {
    this.setState({ question: e.target.value });
  }
  handleNameFamily(e, data) {
    this.setState({ nameFamily: e.target.value });
  }
  handleEmailFamily(e, data) {
    this.setState({ emailFamily: e.target.value });
  }
  handlefirstName(e) {
    this.setState({ firstName: e.target.value });
  }
  handleLastName(e) {
    this.setState({ lastName: e.target.value });
  }
  handleBirtdate(e, data) {
    this.setState({ birtdate: e.target.value });
  }
  handleSex(e, data) {
    this.setState({ sex: data.value });
    let da = this.state.sexList.find(function (ele) {
      return ele.value === e.target.value;
    });
    if (da !== undefined) {
    }
  }
  onFilesChange(files) {
    if (files !== undefined && files.length > 0) {
      if (files[0].extension !== "pdf") {
        if (files[0].size > 500000) {
          let obj = files[0];
          //console.log(obj)
          let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });

          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "identityURL",
            file: f,
          };
          this.setState({
            idImg: obj.preview.url,
            addFileDni: false,
          });
          let ex = String(obj.extension);
          this.newresice(f, ex.toLocaleUpperCase(), "idFile", object);
        } else {
          let obj = files[0];
          //console.log(obj)
          let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });

          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "identityURL",
            file: f,
          };
          this.setState({
            idFile: object,
            idImg: obj.preview.url,
            addFileDni: false,
          });
        }
      } else {
        let obj = files[0];
        //console.log(obj)
        let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
        let newnamesinn = newname1.replace(/ñ/gi, "n");
        let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
        let newname = sinacentos;
        let f = new File([obj], newname, { type: obj.type });

        var object = {
          img: obj.preview.url,
          name: f.name,
          type: f.type,
          extension: obj.extension,
          key: "identityURL",
          file: f,
        };
        this.setState({
          idFile: object,
          idImg: obj.preview.url,
          addFileDni: false,
        });
      }
    }
  }
  onFilesError(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileDni: true,
        textMessage: "buy.formVerificationIdentity.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ errorFileDni: false, textMessage: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileDni: true,
        textMessage: "buy.formVerificationIdentity.errors.fileSize",
      });
      setTimeout(() => {
        this.setState({ errorFileDni: false, textMessage: "" });
      }, 5000);
    }
  }
  onFilesChangeBank(file) {
    if (file !== undefined && file.length > 0) {
      if (file[0].extension !== "pdf") {
        if (file[0].size > 500000) {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "bankURL",
            file: f,
          };
          this.setState({
            bankImg: obj.preview.url,
            addFileBank: false,
          });
          let ex = String(obj.extension);
          this.newresice(f, ex.toLocaleUpperCase(), "bankFile", object);
        } else {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "bankURL",
            file: f,
          };
          this.setState({
            bankImg: obj.preview.url,
            bankFile: object,
            addFileBank: false,
          });
        }
      } else {
        let obj = file[0];
        //console.log(obj)
        let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
        let newnamesinn = newname1.replace(/ñ/gi, "n");
        let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
        let newname = sinacentos;
        let f = new File([obj], newname, { type: obj.type });
        var object = {
          img: obj.preview.url,
          name: f.name,
          type: f.type,
          extension: obj.extension,
          key: "bankURL",
          file: f,
        };
        this.setState({
          bankImg: obj.preview.url,
          bankFile: object,
          addFileBank: false,
        });
      }
    }
  }
  onFilesErrorBank(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileBank: true,
        textMessage: "buy.formVerificationIdentity.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ errorFileBank: false, textMessage: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileBank: true,
        textMessage: "buy.formVerificationIdentity.errors.fileSize",
      });
      setTimeout(() => {
        this.setState({ errorFileBank: false, textMessage: "" });
      }, 5000);
    }
  }
  onFilesChangeLocation(file) {
    if (file !== undefined && file.length > 0) {
      if (file[0].extension !== "pdf") {
        if (file[0].size > 500000) {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "locationURL",
            file: f,
          };
          this.setState({
            locationImg: obj.preview.url,
            addFileLocation: false,
          });
          let ex = String(obj.extension);
          this.newresice(f, ex.toLocaleUpperCase(), "locationFile", object);
        } else {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "locationURL",
            file: f,
          };
          this.setState({
            locationImg: obj.preview.url,
            locationFile: object,
            addFileLocation: false,
          });
        }
      } else {
        let obj = file[0];
        //console.log(obj)
        let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
        let newnamesinn = newname1.replace(/ñ/gi, "n");
        let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
        let newname = sinacentos;
        let f = new File([obj], newname, { type: obj.type });
        var object = {
          img: obj.preview.url,
          name: f.name,
          type: f.type,
          extension: obj.extension,
          key: "locationURL",
          file: f,
        };
        this.setState({
          locationImg: obj.preview.url,
          locationFile: object,
          addFileLocation: false,
        });
      }
    }
  }
  onFilesErrorLocation(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileLocation: true,
        textMessage: "buy.formVerificationIdentity.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ errorFileLocation: false, textMessage: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileLocation: true,
        textMessage: "buy.formVerificationIdentity.errors.fileSize",
      });
      setTimeout(() => {
        this.setState({ errorFileLocation: false, textMessage: "" });
      }, 5000);
    }
  }
  onFilesChangeSelfie(file) {
    if (file !== undefined && file.length > 0) {
      if (file[0].extension !== "pdf") {
        if (file[0].size > 500000) {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "selfURL",
            file: f,
          };
          this.setState({
            selffImg: obj.preview.url,
            addFileSelf: false,
          });
          let ex = String(obj.extension);
          this.newresice(f, ex.toLocaleUpperCase(), "selfFile", object);
        } else {
          let obj = file[0];
          //console.log(obj)
          let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
          let newnamesinn = newname1.replace(/ñ/gi, "n");
          let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
          let newname = sinacentos;
          let f = new File([obj], newname, { type: obj.type });
          var object = {
            img: obj.preview.url,
            name: f.name,
            type: f.type,
            extension: obj.extension,
            key: "selfURL",
            file: f,
          };
          this.setState({
            selffImg: obj.preview.url,
            selfFile: object,
            addFileSelf: false,
          });
        }
      } else {
        let obj = file[0];
        //console.log(obj)
        let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
        let newnamesinn = newname1.replace(/ñ/gi, "n");
        let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
        let newname = sinacentos;
        let f = new File([obj], newname, { type: obj.type });
        var object = {
          img: obj.preview.url,
          name: f.name,
          type: f.type,
          extension: obj.extension,
          key: "selfURL",
          file: f,
        };
        this.setState({
          selffImg: obj.preview.url,
          selfFile: object,
          addFileSelf: false,
        });
      }
    }
  }
  onFilesErrorSelfie(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileSelf: true,
        textMessage: "buy.formVerificationIdentity.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ errorFileSelf: false, textMessage: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileSelf: true,
        textMessage: "buy.formVerificationIdentity.errors.fileSize",
      });
      setTimeout(() => {
        this.setState({ errorFileSelf: false, textMessage: "" });
      }, 5000);
    }
  }
  onRemoveFile(e, data) {
    if (data.id === "file-dni") {
      this.dniRef.current.removeFiles();
      this.setState({
        idFile: {},
        idImg: id,
        addFileDni: true,
      });
    }
    if (data.id === "file-bank") {
      this.bankRef.current.removeFiles();
      this.setState({
        bankFile: {},
        bankImg: bank,
        addFileBank: true,
      });
    }
    if (data.id === "file-location") {
      this.locationRef.current.removeFiles();
      this.setState({
        locationFile: {},
        locationImg: location,
        addFileLocation: true,
      });
    }
    if (data.id === "file-self") {
      this.selfRef.current.removeFiles();
      this.setState({
        selfFile: {},
        selffImg: selff,
        addFileSelf: true,
      });
    }
  }

  handleCancel() {
    this.setState({
      partialPhone: window.sessionStorage.getItem("countryCode"),
      firstName: window.sessionStorage.getItem("firstName"),
      lastName: window.sessionStorage.getItem("lastName"),
      partialNumber: window.sessionStorage.getItem("phone"),
      actualPhone:
        window.sessionStorage.getItem("countryCode") +
        window.sessionStorage.getItem("phone"),
    });

    // this.props.changeItem("optionDetail");
  }
  determinateAddDataUser(data) {}
  onLoadFile(e, data) {
    if (this.validateFormVerification()) {
      if (this.state.idFile.file !== undefined || this.state.existId === true) {
        if (
          this.state.bankFile.file !== undefined ||
          this.state.existBank === true
        ) {
          if (
            this.state.locationFile.file !== undefined ||
            this.state.existLocation === true
          ) {
            if (
              this.state.selfFile.file !== undefined ||
              this.state.existSelf === true
            ) {
              this.setState({
                identitySended: true,
                formLoad: true,
              });

              let array = [
                {
                  email: userAPI.getUserName(),
                  field: "firstName",
                  data: this.state.firstName,
                },
                {
                  email: userAPI.getUserName(),
                  field: "lastName",
                  data: this.state.lastName,
                },
                {
                  email: userAPI.getUserName(),
                  field: "answerSecurity",
                  data: this.state.request !== "" ? this.state.request : " ",
                },
                {
                  email: userAPI.getUserName(),
                  field: "questionSecurity",
                  data: this.state.question,
                },
                {
                  email: userAPI.getUserName(),
                  field: "typeDocumentIdentity",
                  data: this.state.typeDocument,
                },
                {
                  email: userAPI.getUserName(),
                  field: "numberDocumentIdentity",
                  data: this.state.numberDocumentId,
                },
                {
                  email: userAPI.getUserName(),
                  field: "gender",
                  data: this.state.sex,
                },
                {
                  email: userAPI.getUserName(),
                  field: "birthdate",
                  data: this.state.birtdate,
                },
                {
                  email: userAPI.getUserName(),
                  field: "familyName",
                  data: this.state.nameFamily,
                },
                {
                  email: userAPI.getUserName(),
                  field: "familyEmail",
                  data: this.state.emailFamily,
                },
                {
                  email: userAPI.getUserName(),
                  field: "userDirection",
                  data: this.state.direction,
                },
                {
                  email: userAPI.getUserName(),
                  field: "birthplace",
                  data: this.state.birtdateCountry,
                },
                {
                  email: userAPI.getUserName(),
                  field: "userLocalBitcoin",
                  data: this.state.userLocalBitcoin,
                },
                {
                  email: userAPI.getUserName(),
                  field: "userFacebook",
                  data: this.state.userFacebook,
                },
                {
                  email: userAPI.getUserName(),
                  field: "phone",
                  data:
                    sessionStorage.getItem("countryCode") +
                    sessionStorage.getItem("phone"),
                },
              ];
              if (this.state.juridic) {
                array.push({
                  email: userAPI.getUserName(),
                  field: "companyName",
                  data: this.state.companyName,
                });
                array.push({
                  email: userAPI.getUserName(),
                  field: "companyTypeOfFiscalRecord",
                  data: this.state.locationLegalRegistry,
                });
                array.push({
                  email: userAPI.getUserName(),
                  field: "companyNumberOfFiscalRecord",
                  data: this.state.numberLocationLegalRegistry,
                });
                array.push({
                  email: userAPI.getUserName(),
                  field: "companyYearRegistration",
                  data: this.state.yearRegistry,
                });
              }
              this.setState({ arrayUserData: array }, () => {
                var user = {
                  email: this.state.email,
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  countryCode: sessionStorage.getItem("countryCode"),
                  phone: sessionStorage.getItem("phone"),
                  has2FAEnabled: window.sessionStorage.getItem("twoFactor"), //this.state.twoFactor
                };
                userAPI
                  .updateProfile(user, userAPI.getUserName())
                  .then((resp) => {
                    sessionStorage.setItem("firstName", this.state.firstName);
                    sessionStorage.setItem("lastName", this.state.lastName);
                    this.addDataUser(this.state.arrayUserData);
                  })
                  .catch((error) => {
                    ////console.log("on load files")
                    let e = error.toString();
                    if (e.includes("Network")) {
                      ////console.log(error)
                      this.setState({
                        errorNetwork: true,
                        textMessage:
                          "buy.formVerificationIdentity.errors.errorNetwork",
                        identitySended: false,
                        formLoad: false,
                      });

                      setTimeout(() => {
                        this.setState({
                          errorNetwork: false,
                          textMessage: "",
                        });
                      }, 4000);
                    }
                  });
              });
            } else {
              this.setState({
                viewMessage: true,
                textMessage: "buy.formVerificationIdentity.errors.missingFiles",
              });
              setTimeout(() => {
                this.setState({ viewMessage: false, textMessage: "" });
              }, 5000);
            }
          } else {
            this.setState({
              viewMessage: true,
              textMessage: "buy.formVerificationIdentity.errors.missingFiles",
            });
            setTimeout(() => {
              this.setState({ viewMessage: false, textMessage: "" });
            }, 5000);
          }
        } else {
          this.setState({
            viewMessage: true,
            textMessage: "buy.formVerificationIdentity.errors.missingFiles",
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
          }, 5000);
        }
      } else {
        this.setState({
          viewMessage: true,
          textMessage: "buy.formVerificationIdentity.errors.missingFiles",
        });
        setTimeout(() => {
          this.setState({ viewMessage: false, textMessage: "" });
        }, 5000);
      }
    }
  }
  async addDataUser(arra) {
    let keys = [];
    keys = Object.keys(this.state.userData);
    for (let data of arra) {
      let body = {
        userName: userAPI.getUserName(),
        fieldName: data.field,
        fieldValue: data.data,
      };
      if (keys.indexOf(data.field) === -1) {
        await this.addDataUserAsync(body);
      } else {
        await this.updateDataUser(body);
      }
    }
    this.onLoadFileSend();
  }
  async addDataUserAsync(body) {
    try {
      let response = await userAPI.addDataUserAsync(body);
      if (response.data !== "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log(error)
      //console.log("add data user async")
      let e = error.toString();
      if (e.includes("Network")) {
        this.setState({
          errorNetwork: true,
          textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
          loadform: false,

          identitySended: false,
        });

        setTimeout(() => {
          this.setState({
            errorNetwork: false,
            textMessage: "",
          });
        }, 4000);
      }
      return false;
    }
  }
  async updateDataUser(body) {
    try {
      let response = await userAPI.updateUserData(body);
      if (response.data !== "ok") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log("update data user")
      let e = error.toString();
      if (e.includes("Network")) {
        this.setState({
          loadform: false,
          errorNetwork: true,
          textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
          identitySended: false,
        });

        setTimeout(() => {
          this.setState({
            errorNetwork: false,
            textMessage: "",
          });
        }, 4000);
      }
      return false;
    }
  }
  async onLoadFileSend() {
    // ////console.log("llgueeee");
    let arrayToFile = [];
    if (this.state.existId !== true) {
      arrayToFile.push({
        name: "attachment",
        file: this.state.idFile.file,
        fileName: this.state.idFile.name,
        fieldName: this.state.idFile.key,
      });
    }
    if (this.state.existBank !== true) {
      arrayToFile.push({
        name: "attachment",
        file: this.state.bankFile.file,
        fileName: this.state.bankFile.name,
        fieldName: this.state.bankFile.key,
      });
    }
    if (this.state.existLocation !== true) {
      arrayToFile.push({
        name: "attachment",
        file: this.state.locationFile.file,
        fileName: this.state.locationFile.name,
        fieldName: this.state.locationFile.key,
      });
    }
    if (this.state.existSelf !== true) {
      arrayToFile.push({
        name: "attachment",
        file: this.state.selfFile.file,
        fileName: this.state.selfFile.name,
        fieldName: this.state.selfFile.key,
      });
    }
    let keys = [];
    keys = Object.keys(this.state.userData);
    for (let data of arrayToFile) {
      if (keys.indexOf(data.fieldName) === -1) {
        let formData = new FormData();
        formData.append("attachment", data.file, data.fileName);
        formData.append("userName", window.sessionStorage.getItem("username"));
        formData.append("fieldName", data.fieldName);
        try {
          await userAPI.userAddAttachmentAsync(formData);
        } catch (error) {
          this.setState({
            errorNetwork: true,
            textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
            formLoad: false,
            endsend: true,
          });
          break;
        }
      } else {
        try {
          if (
            this.state.userData[data.fieldName] === "" ||
            this.state.userData[data.fieldName] === null
          ) {
            let formData = new FormData();
            formData.append("attachment", data.file, data.fileName);
            formData.append(
              "userName",
              window.sessionStorage.getItem("username")
            );
            formData.append("fieldName", data.fieldName);
            await userAPI.userAddAttachmentAsync(formData);
          }
        } catch (error) {
          let e = error.toString();
          if (e.includes("Network")) {
            this.setState({
              errorNetwork: true,
              textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
              formLoad: false,
            });
          } else {
            this.setState({
              errorNetwork: true,
              textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
              formLoad: false,
              endsend: true,
            });
          }

          break;
        }
      }
    }
    this.initVerification();
  }
  sendSimpleFile(formdata) {
    let config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    /*var url = "https://service8081.dollarbtc.com/userAddAttachment";
    Axios.post(url, formdata, config)*/
    let url = userAPI.userAddAttachment(formdata);
    url
      .then((resp) => {
        //console.log(resp);
      })
      .catch((error) => {
        //console.log("send SimpleFile:", error)
        let e = error.toString();

        if (e.includes("Network")) {
          this.setState({
            formLoad: false,
            errorNetwork: true,
            textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
          });

          setTimeout(() => {
            this.setState({
              errorNetwork: false,
              textMessage: "",
              identitySended: false,
            });
          }, 4000);
        }
        // else if (e.includes("500")) {
        //   this.setState({
        //     //identitySended: false,
        //     formLoad: false,
        //     errorNetwork: true,
        //     textMessage: 'Error Servidor'
        //   });

        //   setTimeout(() =>
        //   {
        //     this.setState({

        //       errorNetwork: false,
        //       textMessage: '',
        //       identitySended: false,
        //     })
        //   }, 4000);
        // // }
      });
  }
  initVerification() {
    let fields = [];
    if (!this.state.juridic) {
      fields = [
        "identityURL",
        "bankURL",
        "locationURL",
        "selfURL",
        "firstName",
        "lastName",
        "phone",
        "questionSecurity",
        "answerSecurity",
        "typeDocumentIdentity",
        "numberDocumentIdentity",
        "gender",
        "birthdate",
        "birthplace",
        "familyName",
        "familyEmail",
        "userLocalBitcoin",
        "userFacebook",
        "userDirection",
      ];
    } else {
      fields = [
        "identityURL",
        "bankURL",
        "locationURL",
        "selfURL",
        "firstName",
        "lastName",
        "phone",
        "questionSecurity",
        "answerSecurity",
        "typeDocumentIdentity",
        "numberDocumentIdentity",
        "gender",
        "birthdate",
        "birthplace",
        "familyName",
        "familyEmail",
        "userLocalBitcoin",
        "userFacebook",
        "userDirection",
        "companyName",
        "companyTypeOfFiscalRecord",
        "companyNumberOfFiscalRecord",
        "companyYearRegistration",
      ];
    }
    let body = {
      userName: window.sessionStorage.getItem("username"),
      fieldNames: fields,
      userVerificationType: "C",
      info: "Initial verification user account",
    };
    let url = userAPI.verifyUserRequestCore(body);
    url
      .then((rep) => {
        ////console.log(rep);
        if (rep.data !== "OK") {
          ////console.log("la respuesta es OK")
          this.setState({
            formLoad: false,
          });
          let s = rep.data.split("USER DOES NOT HAVE FIELDNAME ");
          if (s[1] === "firstName") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "firstName",
              this.state.firstName
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "lastName") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "lastName",
              this.state.lastName
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "phone") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "phone",
              this.state.partialPhone + this.state.partialNumber
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "questionSecurity") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "questionSecurity",
              this.state.question
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "answerSecurity") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "answerSecurity",
              this.state.request
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "typeDocumentIdentity") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "typeDocumentIdentity",
              this.state.typeDocument
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "numberDocumentIdentity") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "numberDocumentIdentity",
              this.state.numberDocumentId
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "gender") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "gender",
              this.state.sex
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "birthdate") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "birthdate",
              this.state.birtdate
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "birthplace") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "birthplace",
              this.state.birtdateCountry
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "familyName") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "familyName",
              this.state.nameFamily
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "familyEmail") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "familyEmail",
              this.state.emailFamily
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userLocalBitcoin") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "userLocalBitcoin",
              this.state.userLocalBitcoin
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userFacebook") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "userFacebook",
              this.state.userFacebook
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userDirection") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "userDirection",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "companyName") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "companyName",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "companyTypeOfFiscalRecord") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "companyTypeOfFiscalRecord",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "companyYearRegistration") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "companyYearRegistration",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "companyNumberOfFiscalRecord") {
            userAPI.addInfoToUserDollarBtc(
              userAPI.getUserName(),
              "companyNumberOfFiscalRecord",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "identityURL" && this.state.existId === false) {
            let formData = new FormData();
            formData.append(
              "attachment",
              this.state.idFile.file,
              this.state.idFile.name
            );
            formData.append(
              "userName",
              window.sessionStorage.getItem("username")
            );
            formData.append("fieldName", this.state.idFile.key);
            this.sendSimpleFile(formData);
          }
          if (s[1] === "bankURL" && this.state.existBank === false) {
            let formDataBank = new FormData();
            formDataBank.append(
              "attachment",
              this.state.bankFile.file,
              this.state.bankFile.name
            );
            formDataBank.append(
              "userName",
              window.sessionStorage.getItem("username")
            );
            formDataBank.append("fieldName", this.state.bankFile.key);
            this.sendSimpleFile(formDataBank);
          }
          if (s[1] === "locationURL" && this.state.existLocation === false) {
            let formDataLocation = new FormData();
            formDataLocation.append(
              "attachment",
              this.state.locationFile.file,
              this.state.locationFile.name
            );
            formDataLocation.append(
              "userName",
              window.sessionStorage.getItem("username")
            );
            formDataLocation.append("fieldName", this.state.locationFile.key);
            this.sendSimpleFile(formDataLocation);
          }
          if (s[1] === "selfURL" && this.state.existSelf === false) {
            let formDataSelfie = new FormData();
            formDataSelfie.append(
              "attachment",
              this.state.selfFile.file,
              this.state.selfFile.name
            );
            formDataSelfie.append(
              "userName",
              window.sessionStorage.getItem("username")
            );
            formDataSelfie.append("fieldName", this.state.selfFile.key);
            this.sendSimpleFile(formDataSelfie);
          }
        } else {
          ////console.log("el servicio no es OK")
          var num = Math.floor(Math.random() * 100);
          this.props.handleToUpdate(num);
          this.setState({ formLoad: false, endsend: true });
          this.setState({
            viewMessage: true,
            textMessage: "buy.formVerificationIdentity.successFilesFiles",
            idFile: {},
            bankFile: {},
            locationFile: {},
            selfFile: {},
          });
          this.selfRef.current.removeFiles();
          this.setState({
            selfFile: {},
            selffImg: selff,
            addFileSelf: true,
          });
          this.locationRef.current.removeFiles();
          this.setState({
            locationFile: {},
            locationImg: location,
            addFileLocation: true,
          });
          this.bankRef.current.removeFiles();
          this.setState({
            bankFile: {},
            bankImg: bank,
            addFileBank: true,
          });
          this.dniRef.current.removeFiles();
          this.setState({
            idFile: {},
            idImg: id,
            addFileDni: true,
          });
        }
      })
      .catch((error) => {
        let e = error.toString();
        if (e.includes("Network")) {
          this.setState({
            loadform: false,
            errorNetwork: true,
            textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
            identitySended: false,
          });

          setTimeout(() => {
            this.setState({
              errorNetwork: false,
              textMessage: "",
            });
          }, 4000);
        }
        //console.log(error);
      });
  }
  validateFormVerification() {
    if (this.state.typeDocument === "") {
      this.setState({
        errorTypeDocument: true,
        textMessage: "buy.formVerificationIdentity.errors.selectTypeDocument",
      });
      setTimeout(() => {
        this.setState({
          errorTypeDocument: false,
          textMessage: "",
        });
      }, 5000);
      return false;
    } else if (
      this.state.typeDocument === "other" &&
      this.state.otherDocument === ""
    ) {
      this.setState({
        errorOtherTypedocument: true,
        textMessage: "buy.formVerificationIdentity.errors.emptyIDNumberType",
      });
      setTimeout(() => {
        this.setState({
          errorOtherTypedocument: false,
          textMessage: "",
        });
      }, 5000);
      return false;
    } else if (this.state.numberDocumentId === "") {
      this.setState({
        errorDocument: true,
        textMessage: "buy.formVerificationIdentity.errors.emptyIDNumber",
      });
      setTimeout(() => {
        this.setState({
          errorDocument: false,
          textMessage: "",
        });
      }, 5000);
      return false;
    } else if (this.state.firstName === "") {
      this.setState({
        errorResponse: true,
        textMessage: "profile.updateProfile.errors.emptyName",
      });
      setTimeout(() => {
        this.setState({
          errorResponse: false,
          textMessage: "",
        });
      }, 5000);
      return false;
    } else if (this.state.lastName === "") {
      this.setState({
        errorResponse: true,
        textMessage: "profile.updateProfile.errors.emptyLastName",
      });
      setTimeout(() => {
        this.setState({
          errorResponse: false,
          textMessage: "",
        });
      }, 5000);
      return false;
    } else {
      return true;
    }
  }

  handleBirtdateCountry(e, data) {
    this.setState({ birtdateCountry: e.target.value });
  }

  handleUserLocalBitcoin(e, data) {
    this.setState({ userLocalBitcoin: e.target.value });
  }
  handleUserFacebook(e, data) {
    this.setState({ userFacebook: e.target.value });
  }
  handleTypeRegistryLegaly(e, data) {
    this.setState({ locationLegalRegistry: e.target.value });
  }
  handleNumberRegistryLegaly(e, data) {
    this.setState({ numberLocationLegalRegistry: e.target.value });
  }
  handleCompanyName(e, data) {
    this.setState({ companyName: e.target.value });
  }
  handleYearRegistryCompany(e, data) {
    this.setState({ yearRegistry: e.target.value });
  }
  newresice(file, type, target, ob) {
    Resizer.imageFileResizer(
      file,
      1024,
      678,
      type,
      70,
      0,
      (uri) => {
        var end = new File([uri], ob.name, {
          type: ob.type,
          lastModified: Date.now(),
        });
        ob.file = end;
        this.setState({ [target]: ob }, () => {
          //////console.log(this.state.idFile);
        });
        //  //////console.log(uri, ob);
      },
      "blob"
    );
  }
  render() {
    let t = this.state.translator;
    let errorTypeDocument,
      errorOtherTypedocument,
      errorDocument,
      errorQuestion,
      errorResponse,
      errorNetwork;
    let messageErrorDNI,
      messageErrorBANK,
      messageErrorLOCATION,
      messageErrorSELF;
    if (this.state.errorTypeDocument) {
      errorTypeDocument = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorOtherTypedocument) {
      errorOtherTypedocument = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorDocument) {
      errorDocument = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorQuestion) {
      errorQuestion = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorResponse) {
      errorResponse = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }

    if (this.state.errorFileDni) {
      messageErrorDNI = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorFileBank) {
      messageErrorBANK = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorFileLocation) {
      messageErrorLOCATION = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    if (this.state.errorFileSelf) {
      messageErrorSELF = (
        <Label basic color="red" pointing>
          {t(this.state.textMessage)}
        </Label>
      );
    }
    return (
      <div>
        <Responsive minWidth={992}>
          <Grid divided>
            <Grid.Row centered>
              <Grid.Column
                largeScreen={16}
                tablet={16}
                mobile={16}
                computer={16}
              >
                <Segment color="orange" loading={this.state.formLoad}>
                  <Form>
                    <Form.Group>
                      <Form.Field width={8}>
                        <Form.Input
                          label={t("buy.formVerificationIdentity.form.name")}
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderName"
                          )}
                          value={this.state.firstName}
                          onChange={this.handlefirstName.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field width={8}>
                        <Form.Input
                          label={t(
                            "buy.formVerificationIdentity.form.lastName"
                          )}
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderLastName"
                          )}
                          value={this.state.lastName}
                          onChange={this.handleLastName.bind(this)}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group>
                      <Form.Field width={8}>
                        <Form.Input
                          label={t(
                            "buy.formVerificationIdentity.form.birthday"
                          )}
                          type="date"
                          value={this.state.birtdate}
                          onChange={this.handleBirtdate.bind(this)}
                        />
                      </Form.Field>
                      <Form.Field width={8}>
                        <Form.Select
                          className="inputStyle"
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderSex"
                          )}
                          options={this.state.sexList}
                          value={this.state.sex}
                          onChange={this.handleSex.bind(this)}
                          label={t("buy.formVerificationIdentity.form.sex")}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group>
                      <Form.TextArea
                        width={16}
                        label={t(
                          "buy.formVerificationIdentity.form.birthplace"
                        )}
                        value={this.state.birtdateCountry}
                        onChange={this.handleBirtdateCountry.bind(this)}
                      />
                      <Form.TextArea
                        width={16}
                        label={
                          this.state.juridic === true
                            ? t("profile.updateProfile.form.addressCompany")
                            : t("profile.updateProfile.form.addressPersonal")
                        }
                        value={this.state.direction}
                        onChange={this.handleDirection.bind(this)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Field
                        width={this.state.typeDocument !== "other" ? 8 : 6}
                      >
                        <Form.Select
                          required
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderDocumentType"
                          )}
                          value={this.state.typeDocument}
                          options={this.state.documentType}
                          onChange={this.handleTypeDocument.bind(this)}
                          label={t(
                            "buy.formVerificationIdentity.form.documentType"
                          )}
                        />
                        {errorTypeDocument}
                      </Form.Field>
                      {this.state.selecteOtherFile && (
                        <Form.Field width={5}>
                          <Form.Input
                            required
                            label={t("buy.formVerificationIdentity.form.other")}
                            value={this.state.otherDocument}
                            onChange={this.handleOtherTypeDocument.bind(this)}
                          />
                          {errorOtherTypedocument}
                        </Form.Field>
                      )}
                      <Form.Field
                        width={this.state.typeDocument !== "other" ? 8 : 5}
                      >
                        <Form.Input
                          required
                          label={t(
                            "buy.formVerificationIdentity.form.numberId"
                          )}
                          value={this.state.numberDocumentId}
                          onChange={this.handleNumberDocumentId.bind(this)}
                        />
                        {errorDocument}
                      </Form.Field>
                    </Form.Group>
                    <Form.Group>
                      <Form.Input
                        width={8}
                        label={
                          this.state.juridic
                            ? t(
                                "buy.formVerificationIdentity.form.contactCompany"
                              )
                            : t(
                                "buy.formVerificationIdentity.form.contactFamily"
                              )
                        }
                        value={this.state.nameFamily}
                        onChange={this.handleNameFamily.bind(this)}
                      />
                      <Form.Input
                        width={8}
                        label={t(
                          "buy.formVerificationIdentity.form.contactEmailFamily"
                        )}
                        value={this.state.emailFamily}
                        placeholder="Email "
                        type="email"
                        onChange={this.handleEmailFamily.bind(this)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Field width={8}>
                        <Form.Input
                          label={t(
                            "buy.formVerificationIdentity.form.securityQuestion"
                          )}
                          value={this.state.question}
                          onChange={this.handleQuestion.bind(this)}
                        />
                        {errorQuestion}
                      </Form.Field>
                      <Form.Field width={8}>
                        <Form.Input
                          label={t(
                            "buy.formVerificationIdentity.form.securityAnswer"
                          )}
                          value={this.state.request}
                          onChange={this.handleRequest.bind(this)}
                        />
                        {errorResponse}
                      </Form.Field>
                    </Form.Group>
                    {/* <Form.Group>
                      <Form.Input
                        width={8}
                        label={t(
                          "buy.formVerificationIdentity.form.localbitcoinUser"
                        )}
                        value={this.state.userLocalBitcoin}
                        onChange={this.handleUserLocalBitcoin.bind(this)}
                      />
                      <Form.Input
                        width={8}
                        label={t(
                          "buy.formVerificationIdentity.form.facebookUser"
                        )}
                        value={this.state.userFacebook}
                        onChange={this.handleUserFacebook.bind(this)}
                      />
                    </Form.Group> */}
                    {this.state.juridic && (
                      <div>
                        <Form.Group>
                          <Form.Input
                            required
                            width={8}
                            label={t(
                              "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.name"
                            )}
                            value={this.state.companyName}
                            onChange={this.handleCompanyName.bind(this)}
                          />
                          <Form.Input
                            required
                            width={8}
                            label={t(
                              "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerYear"
                            )}
                            value={this.state.yearRegistry}
                            onChange={this.handleYearRegistryCompany.bind(this)}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Input
                            required
                            width={8}
                            label={t(
                              "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscalType"
                            )}
                            value={this.state.locationLegalRegistry}
                            onChange={this.handleTypeRegistryLegaly.bind(this)}
                          />
                          <Form.Input
                            required
                            width={8}
                            label={t(
                              "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscalNumber"
                            )}
                            value={this.state.numberLocationLegalRegistry}
                            onChange={this.handleNumberRegistryLegaly.bind(
                              this
                            )}
                          />
                        </Form.Group>
                        <Form.Group>
                          {this.state.existId !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  required
                                  className="files-dropzone"
                                  ref={this.dniRef}
                                  onChange={this.onFilesChange.bind(this)}
                                  onError={this.onFilesError.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  id="identity"
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileDni}
                                >
                                  <Header textAlign="center">
                                    {this.state.idFile.extension !== "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.idImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.idFile.extension === "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.idFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.idFile.name}
                                      </p>
                                    )}
                                    {this.state.idFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.documentID"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorDNI}
                                  </Header>
                                </Files>

                                {!this.state.addFileDni && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-dni"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileDni && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                                <br />
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existBank !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.bankRef}
                                  onChange={this.onFilesChangeBank.bind(this)}
                                  onError={this.onFilesErrorBank.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileBank}
                                >
                                  <Header textAlign="center">
                                    {this.state.bankFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.bankImg}
                                        className="imageFileV"
                                      />
                                    )}

                                    {this.state.bankFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.bankFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.bankFile.name}
                                      </p>
                                    )}
                                    {this.state.bankFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.bankAccountSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorBANK}
                                  </Header>
                                </Files>

                                {!this.state.addFileBank && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-bank"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileBank && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                        <Form.Group>
                          {this.state.existLocation !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.locationRef}
                                  onChange={this.onFilesChangeLocation.bind(
                                    this
                                  )}
                                  onError={this.onFilesErrorLocation.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileLocation}
                                >
                                  <Header textAlign="center">
                                    {this.state.locationFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.locationImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.locationFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.locationFile.name !==
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.locationFile.name}
                                      </p>
                                    )}
                                    {this.state.locationFile.name ===
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscal"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorLOCATION}
                                  </Header>
                                </Files>

                                {!this.state.addFileLocation && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-location"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileLocation && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existSelf !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.selfRef}
                                  onChange={this.onFilesChangeSelfie.bind(this)}
                                  onError={this.onFilesErrorSelfie.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileSelf}
                                >
                                  <Header textAlign="center">
                                    {this.state.selfFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.selffImg}
                                        className="imageFileV"
                                      />
                                    )}

                                    {this.state.selfFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.selfFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.selfFile.name}
                                      </p>
                                    )}
                                    {this.state.selfFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.selfieSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorSELF}
                                  </Header>
                                </Files>

                                {!this.state.addFileSelf && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-self"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileSelf && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                      </div>
                    )}
                    {!this.state.juridic && (
                      <div>
                        <Form.Group>
                          {this.state.existId !== true && (
                            <Form.Field width={8}>
                              <div className="letterSmall" />
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.dniRef}
                                  onChange={this.onFilesChange.bind(this)}
                                  onError={this.onFilesError.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  id="identity"
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileDni}
                                >
                                  <Header textAlign="center">
                                    {this.state.idFile.extension !== "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.idImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.idFile.extension === "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.idFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.idFile.name}
                                      </p>
                                    )}
                                    {this.state.idFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.documentID"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorDNI}
                                  </Header>
                                </Files>
                                {!this.state.addFileDni && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-dni"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileDni && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existLocation !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.locationRef}
                                  onChange={this.onFilesChangeLocation.bind(
                                    this
                                  )}
                                  onError={this.onFilesErrorLocation.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileLocation}
                                >
                                  <Header textAlign="center">
                                    {this.state.locationFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.locationImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.locationFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.locationFile.name !==
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.locationFile.name}
                                      </p>
                                    )}
                                    {this.state.locationFile.name ===
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.addressSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorLOCATION}
                                  </Header>
                                </Files>

                                {!this.state.addFileLocation && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-location"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileLocation && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                        <Form.Group>
                          {this.state.existBank !== true && (
                            <Form.Field width={8}>
                              <Segment
                                placeholder
                                className="sizeSement"
                                centered
                              >
                                <Files
                                  className="files-dropzone"
                                  ref={this.bankRef}
                                  onChange={this.onFilesChangeBank.bind(this)}
                                  onError={this.onFilesErrorBank.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileBank}
                                >
                                  <Header textAlign="center">
                                    {this.state.bankFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.bankImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.bankFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.bankFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.bankFile.name}
                                      </p>
                                    )}
                                    {this.state.bankFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.bankAccountSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorBANK}
                                  </Header>
                                </Files>

                                {!this.state.addFileBank && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-bank"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileBank && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existSelf !== true && (
                            <Form.Field width={8}>
                              <Segment placeholder className="sizeSement">
                                <Files
                                  className="files-dropzone"
                                  ref={this.selfRef}
                                  onChange={this.onFilesChangeSelfie.bind(this)}
                                  onError={this.onFilesErrorSelfie.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileSelf}
                                >
                                  <Header textAlign="center">
                                    {this.state.selfFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.selffImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.selfFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.selfFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.selfFile.name}
                                      </p>
                                    )}
                                    {this.state.selfFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.selfieSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorSELF}
                                  </Header>
                                </Files>

                                {!this.state.addFileSelf && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-self"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileSelf && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                      </div>
                    )}
                    <Form.Field>
                      {this.state.viewMessage && (
                        <div>
                          <Message info content={this.state.textMessage} />
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <div align="center" hidden={this.state.identitySended}>
                        <Form.Button
                          onClick={this.onLoadFile.bind(this)}
                          color="blue"
                        >
                          {t("buy.formVerificationIdentity.form.buttonVerify")}
                        </Form.Button>

                        <Form.Button
                          onClick={this.handleCancel.bind(this)}
                          basic
                        >
                          {t("profile.updateProfile.form.buttonBack")}
                        </Form.Button>
                      </div>
                    </Form.Field>
                  </Form>
                  <Divider hidden />
                  {this.state.errorNetwork && (
                    <div>
                      <Message error content={t(this.state.textMessage)} />
                    </div>
                  )}
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row />
          </Grid>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid divided>
            <Grid.Row centered>
              <Grid.Column
                largeScreen={16}
                tablet={16}
                mobile={16}
                computer={16}
              >
                <Segment loading={this.state.formLoad}>
                  <Form>
                    <Form.Group>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.name")}
                        </label>
                        <Form.Input
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderName"
                          )}
                          value={this.state.firstName}
                          onChange={this.handlefirstName.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>

                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.lastName")}
                        </label>
                        <Form.Input
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderLastName"
                          )}
                          value={this.state.lastName}
                          onChange={this.handleLastName.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.birthday")}
                        </label>
                        <Form.Input
                          type="date"
                          value={this.state.birtdate}
                          onChange={this.handleBirtdate.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.sex")}
                        </label>
                        <Form.Select
                          className="inputStyle"
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderSex"
                          )}
                          value={this.state.sex}
                          options={this.state.sexList}
                          onChange={this.handleSex.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.birthplace")}
                        </label>
                        <Form.TextArea
                          value={this.state.birtdateCountry}
                          onChange={this.handleBirtdateCountry.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {this.state.juridic === true
                            ? t("profile.updateProfile.form.addressCompany")
                            : t("profile.updateProfile.form.addressPersonal")}
                        </label>
                        <Form.TextArea
                          value={this.state.direction}
                          onChange={this.handleDirection.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field
                        width={this.state.typeDocument !== "other" ? 8 : 6}
                      >
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.documentType")}
                        </label>
                        <Form.Select
                          required
                          placeholder={t(
                            "buy.formVerificationIdentity.form.placeholderDocumentType"
                          )}
                          value={this.state.typeDocument}
                          options={this.state.documentType}
                          onChange={this.handleTypeDocument.bind(this)}
                        />
                        {errorTypeDocument}
                        <Divider hidden></Divider>
                      </Form.Field>
                      {this.state.selecteOtherFile && (
                        <Form.Field width={16}>
                          <label className="titleComponentMobile">
                            {t("buy.formVerificationIdentity.form.other")}
                          </label>
                          <Form.Input
                            required
                            value={this.state.otherDocument}
                            onChange={this.handleOtherTypeDocument.bind(this)}
                          />
                          {errorOtherTypedocument}
                          <Divider hidden></Divider>
                        </Form.Field>
                      )}
                      <Form.Field
                        width={this.state.typeDocument !== "other" ? 8 : 5}
                      >
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.numberId")}
                        </label>
                        <Form.Input
                          required
                          value={this.state.numberDocumentId}
                          onChange={this.handleNumberDocumentId.bind(this)}
                        />
                        {errorDocument}
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {this.state.juridic
                            ? t(
                                "buy.formVerificationIdentity.form.contactCompany"
                              )
                            : t(
                                "buy.formVerificationIdentity.form.contactFamily"
                              )}
                        </label>
                        <Form.Input
                          value={this.state.nameFamily}
                          onChange={this.handleNameFamily.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t(
                            "buy.formVerificationIdentity.form.contactEmailFamily"
                          )}
                        </label>
                        <Form.Input
                          value={this.state.emailFamily}
                          placeholder="Email "
                          type="email"
                          onChange={this.handleEmailFamily.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t(
                            "buy.formVerificationIdentity.form.securityQuestion"
                          )}
                        </label>
                        <Form.Input
                          value={this.state.question}
                          onChange={this.handleQuestion.bind(this)}
                        />
                        {errorQuestion}
                        <Divider hidden></Divider>
                      </Form.Field>
                      <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t(
                            "buy.formVerificationIdentity.form.securityAnswer"
                          )}
                        </label>
                        <Form.Input
                          value={this.state.request}
                          onChange={this.handleRequest.bind(this)}
                        />
                        {errorResponse}
                        <Divider hidden></Divider>
                      </Form.Field>
                      {/* <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t(
                            "buy.formVerificationIdentity.form.localbitcoinUser"
                          )}
                        </label>
                        <Form.Input
                          value={this.state.userLocalBitcoin}
                          onChange={this.handleUserLocalBitcoin.bind(this)}
                        />
                        <Divider hidden></Divider>
                      </Form.Field> */}
                      {/* <Form.Field width={16}>
                        <label className="titleComponentMobile">
                          {t("buy.formVerificationIdentity.form.facebookUser")}
                        </label>
                        <Form.Input
                          value={this.state.userFacebook}
                          onChange={this.handleUserFacebook.bind(this)}
                        />
                      </Form.Field> */}
                    </Form.Group>
                    {this.state.juridic && (
                      <div>
                        <Form.Group>
                          <Form.Field width={16}>
                            <label className="titleComponentMobile">
                              {t(
                                "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.name"
                              )}
                            </label>
                            <Form.Input
                              required
                              value={this.state.companyName}
                              onChange={this.handleCompanyName.bind(this)}
                            />
                          </Form.Field>
                          <Form.Field width={16}>
                            <label className="titleComponentMobile">
                              {t(
                                "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerYear"
                              )}
                            </label>
                            <Form.Input
                              required
                              value={this.state.yearRegistry}
                              onChange={this.handleYearRegistryCompany.bind(
                                this
                              )}
                            />
                          </Form.Field>
                          <Form.Field width={16}>
                            <label className="titleComponentMobile">
                              {t(
                                "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscalType"
                              )}
                            </label>
                            <Form.Input
                              required
                              value={this.state.locationLegalRegistry}
                              onChange={this.handleTypeRegistryLegaly.bind(
                                this
                              )}
                            />
                          </Form.Field>
                          <Form.Field width={16}>
                            <label className="titleComponentMobile">
                              {t(
                                "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscalNumber"
                              )}
                            </label>
                            <Form.Input
                              required
                              value={this.state.numberLocationLegalRegistry}
                              onChange={this.handleNumberRegistryLegaly.bind(
                                this
                              )}
                            />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          {this.state.existId !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  required
                                  className="files-dropzone"
                                  ref={this.dniRef}
                                  onChange={this.onFilesChange.bind(this)}
                                  onError={this.onFilesError.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  id="identity"
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileDni}
                                >
                                  <Header textAlign="center">
                                    {this.state.idFile.extension !== "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.idImg}
                                        className="imageFileV"
                                      />
                                    )}

                                    {this.state.idFile.extension === "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.idFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.idFile.name}
                                      </p>
                                    )}
                                    {this.state.idFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.documentID"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorDNI}
                                  </Header>
                                </Files>
                                {!this.state.addFileDni && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-dni"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileDni && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                                <br />
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existBank !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.bankRef}
                                  onChange={this.onFilesChangeBank.bind(this)}
                                  onError={this.onFilesErrorBank.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileBank}
                                >
                                  <Header textAlign="center">
                                    {this.state.bankFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.bankImg}
                                        className="imageFileV"
                                      />
                                    )}

                                    {this.state.bankFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}

                                    {this.state.bankFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.bankFile.name}
                                      </p>
                                    )}
                                    {this.state.bankFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.bankAccountSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorBANK}
                                  </Header>
                                </Files>

                                {!this.state.addFileBank && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-bank"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileBank && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existLocation !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.locationRef}
                                  onChange={this.onFilesChangeLocation.bind(
                                    this
                                  )}
                                  onError={this.onFilesErrorLocation.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileLocation}
                                >
                                  <Header textAlign="center">
                                    {this.state.locationFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.locationImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.locationFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}

                                    {this.state.locationFile.name !==
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.locationFile.name}
                                      </p>
                                    )}
                                    {this.state.locationFile.name ===
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.registerFiscal"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorLOCATION}
                                  </Header>
                                </Files>

                                {!this.state.addFileLocation && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-location"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileLocation && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                          {this.state.existSelf !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.selfRef}
                                  onChange={this.onFilesChangeSelfie.bind(this)}
                                  onError={this.onFilesErrorSelfie.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileSelf}
                                >
                                  <Header textAlign="center">
                                    {this.state.selfFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.selffImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.selfFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.selfFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.selfFile.name}
                                      </p>
                                    )}
                                    {this.state.selfFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.selfieSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorSELF}
                                  </Header>
                                </Files>

                                {!this.state.addFileSelf && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-self"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileSelf && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedCompany.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                      </div>
                    )}
                    {!this.state.juridic && (
                      <div>
                        <Form.Group>
                          {this.state.existId !== true && (
                            <Form.Field width={16}>
                              <div className="letterSmall" />
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.dniRef}
                                  onChange={this.onFilesChange.bind(this)}
                                  onError={this.onFilesError.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  id="identity"
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileDni}
                                >
                                  <Header textAlign="center">
                                    {this.state.idFile.extension !== "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.idImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.idFile.extension === "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.idFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.idFile.name}
                                      </p>
                                    )}
                                    {this.state.idFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.documentID"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorDNI}
                                  </Header>
                                </Files>
                                {!this.state.addFileDni && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-dni"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileDni && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                              <Divider hidden></Divider>
                            </Form.Field>
                          )}
                          {this.state.existLocation !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.locationRef}
                                  onChange={this.onFilesChangeLocation.bind(
                                    this
                                  )}
                                  onError={this.onFilesErrorLocation.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileLocation}
                                >
                                  <Header textAlign="center">
                                    {this.state.locationFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.locationImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.locationFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.locationFile.name !==
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.locationFile.name}
                                      </p>
                                    )}
                                    {this.state.locationFile.name ===
                                      undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.addressSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorLOCATION}
                                  </Header>
                                </Files>

                                {!this.state.addFileLocation && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-location"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileLocation && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                              <Divider hidden></Divider>
                            </Form.Field>
                          )}
                        </Form.Group>
                        <Form.Group>
                          {this.state.existBank !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder centered>
                                <Files
                                  className="files-dropzone"
                                  ref={this.bankRef}
                                  onChange={this.onFilesChangeBank.bind(this)}
                                  onError={this.onFilesErrorBank.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileBank}
                                >
                                  <Header textAlign="center">
                                    {this.state.bankFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.bankImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.bankFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.bankFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.bankFile.name}
                                      </p>
                                    )}
                                    {this.state.bankFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.bankAccountSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorBANK}
                                  </Header>
                                </Files>

                                {!this.state.addFileBank && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-bank"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileBank && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                              <Divider hidden></Divider>
                            </Form.Field>
                          )}
                          {this.state.existSelf !== true && (
                            <Form.Field width={16}>
                              <Segment placeholder>
                                <Files
                                  className="files-dropzone"
                                  ref={this.selfRef}
                                  onChange={this.onFilesChangeSelfie.bind(this)}
                                  onError={this.onFilesErrorSelfie.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={5000000}
                                  minFileSize={0}
                                  clickable={this.state.addFileSelf}
                                >
                                  <Header textAlign="center">
                                    {this.state.selfFile.extension !==
                                      "pdf" && (
                                      <img
                                        alt=""
                                        src={this.state.selffImg}
                                        className="imageFileV"
                                      />
                                    )}
                                    {this.state.selfFile.extension ===
                                      "pdf" && (
                                      <div>
                                        <Icon
                                          name="file pdf"
                                          size="big"
                                          color="blue"
                                        />
                                      </div>
                                    )}
                                    {this.state.selfFile.name !== undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {this.state.selfFile.name}
                                      </p>
                                    )}
                                    {this.state.selfFile.name === undefined && (
                                      <p style={{ fontSize: "11px" }}>
                                        {t(
                                          "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.selfieSupport"
                                        )}
                                      </p>
                                    )}
                                    {messageErrorSELF}
                                  </Header>
                                </Files>

                                {!this.state.addFileSelf && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-self"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    {t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.buttonChange"
                                    )}
                                  </Button>
                                )}
                                {this.errorFileSelf && (
                                  <Message
                                    error
                                    content={t(
                                      "buy.formVerificationIdentity.form.verifyCUninitiatedPersonal.fileNotSupported"
                                    )}
                                  />
                                )}
                              </Segment>
                            </Form.Field>
                          )}
                        </Form.Group>
                      </div>
                    )}
                    <Form.Field>
                      {this.state.viewMessage && (
                        <div>
                          <Message info content={this.state.textMessage} />
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      {/* <Segment placeholder > */}
                      <div align="center" hidden={this.state.identitySended}>
                        <Form.Button
                          onClick={this.onLoadFile.bind(this)}
                          color="blue"
                          style={{
                            borderRadius: "40px/40px",
                            height: "50px",
                            width: "200px",
                          }}
                        >
                          {t("buy.formVerificationIdentity.form.buttonVerify")}
                        </Form.Button>
                        <Form.Button
                          onClick={this.handleCancel.bind(this)}
                          basic
                        >
                          {t("profile.updateProfile.form.buttonBack")}
                        </Form.Button>
                      </div>
                      {/* </Segment> */}
                    </Form.Field>
                  </Form>
                  <Divider hidden />
                  {this.state.errorNetwork && (
                    <div>
                      <Message error content={t(this.state.textMessage)} />
                    </div>
                  )}
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row />
          </Grid>
        </Responsive>
      </div>
    );
  }
}
export default translate(FormVerificationIdentity);
