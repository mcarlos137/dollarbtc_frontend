import React, { Component } from "react";
import {
  Button,
  Header,
  Segment,
  Form,
  Container,
  Grid,
  Divider,
  Message,
  Modal
} from "semantic-ui-react";
import Files from "react-files";
import FormData from "form-data";
import "./Verification.css";
import selff from "../../img/verifyiconId.png";
import bank from "../../img/verifyicon2.png";
import location from "../../img/verifyicon3.png";
import id from "../../img/verifyicon1.png";
import Axios from "axios";
import userService from "../../services/user";
import prefits from "../../common/prefits";
import config from "../../services/config";
class Verification extends Component {
  constructor(props) {
    super(props);
    this.dniRef = React.createRef();
    this.bankRef = React.createRef();
    this.locationRef = React.createRef();
    this.selfRef = React.createRef();
    this.state = {
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
      formLoad: false,
      messageText: "",
      prefit: [],
      firstName: "",
      lastName: "",
      userPhone: "",
      partialPhone: "",
      partialNumber: "",
      birtdate: "",
      birtdateCountry: "",
      sex: "",
      contSend: 0,
      typeDocument: "",
      otherDocument: "",
      numberDocumentId: "",
      direction: "",
      question: "",
      request: "",
      nameFamily: "",
      emailFamily: "",
      userLocalBitcoin: "",
      userFacebook: "",
      selectOther: false,
      contSend: 0,
      open: false,
      endsend: false,
      twoFactor:
        window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
      email: userService.getUserEmail(),
      sexList: [
        { key: "m", value: "male", text: "Masculino" },
        { key: "f", value: "female", text: "Femenino" }
      ],
      documentType: [
        { key: "i", value: "id", text: "ID" },
        { key: "dn", value: "dni", text: "DNI" },
        { key: "cd", value: "cedula", text: "Cedula" },
        { key: "pass", value: "passport", text: "Pasaporte" },
        { key: "ot", value: "other", text: "Otro" }
      ],
      userData: {}
    };
    this.initVerification = this.initVerification.bind(this);
  }
  handleCancel() {
    window.location.href = "/profile";
  }
  componentDidMount() {
    this.setState({
      prefit: prefits.country,
      firstName: window.sessionStorage.getItem("firstName"),
      lastName: window.sessionStorage.getItem("lastName"),
      userPhone: window.sessionStorage.getItem("phone"),
      partialPhone: window.sessionStorage.getItem("countryCode"),
      partialNumber: window.sessionStorage.getItem("phone")
    });
    let user = userService.getDataUserBTC();
    let username = userService.getUserName();
    let data = userService.getConfigUserGeneral(username);
    data.then(resp => {
      this.setState({ userData: resp.data.result });
    });
    if (user !== null) {
      this.setState({
        userLocalBitcoin: user.userLocalBitcoin,
        userFacebook: user.userFacebook,
        direction: user.userDirection
      });
    }
  }
  onFilesChange(files) {
    if (files !== undefined && files.length > 0) {
      var object = {
        img: files[0].preview.url,
        name: files[0].name,
        type: files[0].type,
        extension: files[0].extension,
        key: "identityURL",
        file: files[0]
      };
      this.setState({
        idFile: object,
        idImg: files[0].preview.url,
        addFileDni: false
      });
    }
  }

  onFilesError(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileDni: true,
        messageText: "Tipo de archivo no soportado"
      });
      setTimeout(() => {
        this.setState({ errorFileDni: false, messageText: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileDni: true,
        messageText: "Tamaño de archivo excede el permitido"
      });
      setTimeout(() => {
        this.setState({ errorFileDni: false, messageText: "" });
      }, 5000);
    }
  }
  onFilesChangeBank(file) {
    if (file !== undefined && file.length > 0) {
      var object = {
        img: file[0].preview.url,
        name: file[0].name,
        type: file[0].type,
        extension: file[0].extension,
        key: "bankURL",
        file: file[0]
      };
      this.setState({
        bankImg: file[0].preview.url,
        bankFile: object,
        addFileBank: false
      });
    }
  }
  onFilesErrorBank(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileBank: true,
        messageText: "Tipo de archivo no soportado"
      });
      setTimeout(() => {
        this.setState({ errorFileBank: false, messageText: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileBank: true,
        messageText: "Tamaño de archivo excede el permitido"
      });
      setTimeout(() => {
        this.setState({ errorFileBank: false, messageText: "" });
      }, 5000);
    }
  }
  onFilesChangeLocation(file) {
    if (file !== undefined && file.length > 0) {
      var object = {
        img: file[0].preview.url,
        name: file[0].name,
        type: file[0].type,
        extension: file[0].extension,
        key: "locationURL",
        file: file[0]
      };
      this.setState({
        locationImg: file[0].preview.url,
        locationFile: object,
        addFileLocation: false
      });
    }
  }
  onFilesErrorLocation(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileLocation: true,
        messageText: "Tipo de archivo no soportado"
      });
      setTimeout(() => {
        this.setState({ errorFileLocation: false, messageText: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileLocation: true,
        messageText: "Tamaño de archivo excede el permitido"
      });
      setTimeout(() => {
        this.setState({ errorFileLocation: false, messageText: "" });
      }, 5000);
    }
  }
  onFilesChangeSelfie(file) {
    if (file !== undefined && file.length > 0) {
      var object = {
        img: file[0].preview.url,
        name: file[0].name,
        type: file[0].type,
        extension: file[0].extension,
        key: "selfURL",
        file: file[0]
      };
      this.setState({
        selffImg: file[0].preview.url,
        selfFile: object,
        addFileSelf: false
      });
    }
  }
  onFilesErrorSelfie(error, file) {
    if (error.code === 1) {
      this.setState({
        errorFileSelf: true,
        messageText: "Tipo de archivo no soportado"
      });
      setTimeout(() => {
        this.setState({ errorFileSelf: false, messageText: "" });
      }, 5000);
    } else {
      this.setState({
        errorFileSelf: true,
        messageText: "Tamaño de archivo excede el permitido"
      });
      setTimeout(() => {
        this.setState({ errorFileSelf: false, messageText: "" });
      }, 5000);
    }
  }
  onRemoveFile(e, data) {
    if (data.id === "file-dni") {
      this.dniRef.current.removeFiles();
      this.setState({
        idFile: {},
        idImg: id,
        addFileDni: true
      });
    }
    if (data.id === "file-bank") {
      this.bankRef.current.removeFiles();
      this.setState({
        bankFile: {},
        bankImg: bank,
        addFileBank: true
      });
    }
    if (data.id === "file-location") {
      this.locationRef.current.removeFiles();
      this.setState({
        locationFile: {},
        locationImg: location,
        addFileLocation: true
      });
    }
    if (data.id === "file-self") {
      this.selfRef.current.removeFiles();
      this.setState({
        selfFile: {},
        selffImg: selff,
        addFileSelf: true
      });
    }
  }
  onLoadFile(e, data) {
    if (this.state.idFile.file !== undefined) {
      if (this.state.bankFile.file !== undefined) {
        if (this.state.locationFile.file !== undefined) {
          if (this.state.selfFile.file !== undefined) {
            this.setState({ formLoad: true });

            this.onLoadFileSend();
            let array = [
              {
                email: this.state.email,
                field: "firstName",
                data: this.state.firstName
              },
              {
                email: this.state.email,
                field: "lastName",
                data: this.state.lastName
              },
              {
                email: this.state.email,
                field: "phone",
                data: this.state.partialPhone + this.state.partialNumber
              },
              {
                email: this.state.email,
                field: "answerSecurity",
                data: this.state.request
              },
              {
                email: this.state.email,
                field: "questionSecurity",
                data: this.state.question
              },
              {
                email: this.state.email,
                field: "typeDocumentIdentity",
                data: this.state.typeDocument
              },
              {
                email: this.state.email,
                field: "numberDocumentIdentity",
                data: this.state.numberDocumentId
              },
              {
                email: this.state.email,
                field: "gender",
                data: this.state.sex
              },
              {
                email: this.state.email,
                field: "birthdate",
                data: this.state.birtdate
              },
              {
                email: this.state.email,
                field: "birthplace",
                data: this.state.birtdateCountry
              },
              {
                email: this.state.email,
                field: "familyName",
                data: this.state.nameFamily
              },
              {
                email: this.state.email,
                field: "familyEmail",
                data: this.state.emailFamily
              },
              {
                email: this.state.email,
                field: "userLocalBitcoin",
                data: this.state.userLocalBitcoin
              },
              {
                email: this.state.email,
                field: "userFacebook",
                data: this.state.userFacebook
              },
              {
                email: this.state.email,
                field: "userDirection",
                data: this.state.direction
              }
            ];
            this.setState({ arrayUserData: array });
          } else {
            this.setState({
              viewMessage: true,
              textMessage: "Disculpe debe incluir todos los archivos"
            });
            setTimeout(() => {
              this.setState({ viewMessage: false, textMessage: "" });
            }, 5000);
          }
        } else {
          this.setState({
            viewMessage: true,
            textMessage: "Disculpe debe incluir todos los archivos"
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
          }, 5000);
        }
      } else {
        this.setState({
          viewMessage: true,
          textMessage: "Disculpe debe incluir todos los archivos"
        });
        setTimeout(() => {
          this.setState({ viewMessage: false, textMessage: "" });
        }, 5000);
      }
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "Disculpe debe incluir todos los archivos"
      });
      setTimeout(() => {
        this.setState({ viewMessage: false, textMessage: "" });
      }, 5000);
    }
  }
  async addDataUserAsync(body) {
    try {
      let response = await userService.addDataUserAsync(body);
      if (response.data !== "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  async addDataUser(objnw, arra, contaaa) {
    let keys = [];
    if (contaaa < arra.length) {
      keys = Object.keys(this.state.userData);
      if (keys.indexOf(objnw.field) === -1) {
        let body = {
          userName: this.state.email,
          fieldName: objnw.field,
          fieldValue: objnw.data
        };
        let resp = await this.addDataUserAsync(body);
        if (resp) {
          contaaa = contaaa + 1;
          this.addDataUser(arra[contaaa], arra, contaaa);
        } else {
          this.addDataUser(arra[contaaa], arra, contaaa);
        }
      } else {
        let cont = 0;
        for (let key in this.state.userData) {
          if (objnw.field === key) {
            //console.log(objnw.field, key);
            for (let obj in this.state.userData) {
              if (obj.indexOf("__") === -1) {
                if (objnw.field === obj) {
                  cont++;
                  //console.log(objnw.field, obj);
                }
              } else if (obj.split("__")[0] === objnw.field) {
                cont++;
                //console.log(objnw.field, obj);
              }
            }
            if (cont > 1) {
              let index = cont - 1;
              let campo = objnw.field + "__" + index;
              Object.entries(this.state.userData).forEach(([k, v]) => {
                if (k === campo) {
                  if (v !== objnw.data) {
                    let newValue = cont;
                    objnw.field = objnw.field + "__" + newValue;
                    let body = {
                      userName: this.state.email,
                      fieldName: objnw.field,
                      fieldValue: objnw.data
                    };
                    this.addDataUserAsync(body);
                    contaaa = contaaa + 1;
                    this.addDataUser(arra[contaaa], arra, contaaa);
                  }
                }
              });
            } else {
              if (objnw.data !== this.state.userData[key]) {
                //console.log("aquiiii");
                objnw.field = objnw.field + "__" + 1;
                let body = {
                  userName: this.state.email,
                  fieldName: objnw.field,
                  fieldValue: objnw.data
                };
                this.addDataUserAsync(body);
                contaaa = contaaa + 1;
                this.addDataUser(arra[contaaa], arra, contaaa);
              } else {
                contaaa = contaaa + 1;
                this.addDataUser(arra[contaaa], arra, contaaa);
              }
            }
          }
        }
      }
    } else {
      this.initVerification();
    }
  }
  onLoadFileSend() {
    let formData = new FormData();
    let formDataBank = new FormData();
    let formDataLocation = new FormData();
    let formDataSelfie = new FormData();
    formData.append(
      "attachment",
      this.state.idFile.file,
      this.state.idFile.name
    );
    formData.append("userName", window.sessionStorage.getItem("username"));
    formData.append("fieldName", this.state.idFile.key);

    formDataBank.append(
      "attachment",
      this.state.bankFile.file,
      this.state.bankFile.name
    );
    formDataBank.append("userName", window.sessionStorage.getItem("username"));
    formDataBank.append("fieldName", this.state.bankFile.key);

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
    let array = [formData, formDataBank, formDataLocation, formDataSelfie];
    let cont = 0;

    this.sendFiles(array[0], cont, array);
  }
  sendSimpleFile(formdata) {
    let config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    /*var url = "https://service8081.dollarbtc.com/userAddAttachment";
    Axios.post(url, formdata, config)*/
    let url = userService.userAddAttachment(formdata);
    url.then(resp => {});
  }
  sendFiles(formdata, cont, array) {
    let config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    //var url = "https://service8081.dollarbtc.com/userAddAttachment";

    if (cont < array.length) {
      /*Axios.post(url, formdata, config)*/
      let url = userService.userAddAttachment(formdata);
      url
        .then(res => {
          cont = cont + 1;

          this.sendFiles(array[cont], cont, array);
          this.setState({ contSend: this.state.contSend + 1 }, () => {});
        })
        .catch(error => {
          cont = cont + 1;
          this.sendFiles(array[cont], cont, array);
        });
    } else {
      var user = {
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        countryCode: this.state.partialPhone,
        phone: this.state.partialNumber,
        has2FAEnabled: this.state.twoFactor //this.state.twoFactor
      };
      userService.updateProfile(user);
      let cont = 0;
      this.addDataUser(
        this.state.arrayUserData[0],
        this.state.arrayUserData,
        cont
      );
    }
  }
  resultUpdate() {
    setTimeout(() => {
      let userdata = {
        userLocalBitcoin: this.state.userLocalBitcoin,
        userFacebook: this.state.userFacebook,
        userDirection: this.state.direction
      };
      window.sessionStorage.setItem("userDataDBTC", JSON.stringify(userdata));
      this.setState({
        resultUpdate: userService.getUpdateUser(),
        formLoad: false,
        viewMessage: true,
        textMessage: "Su datos han sido actualizados satisfactoriamente",
        firstName: window.sessionStorage.getItem("firstName"),
        lastName: window.sessionStorage.getItem("lastName"),
        userPhone: window.sessionStorage.getItem("phone"),
        twoFactor:
          window.sessionStorage.getItem("twoFactor") === "true" ? true : false
      });
    }, 8000);
  }
  initVerification() {
    let body = {
      userName: window.sessionStorage.getItem("username"),
      fieldNames: [
        this.state.idFile.key,
        this.state.bankFile.key,
        this.state.locationFile.key,
        this.state.selfFile.key,
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
        "userDirection"
      ],
      userVerificationType: "C",
      info: "Initial verification user account"
    };

    let url = userService.verifyUserRequestCore(body);
    url
      .then(rep => {
        if (rep.data !== "OK") {
          let s = rep.data.split("USER DOES NOT HAVE FIELDNAME ");
          if (s[1] === "firstName") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "firstName",
              this.state.firstName
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "lastName") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "lastName",
              this.state.lastName
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "phone") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "phone",
              this.state.partialPhone + this.state.partialNumber
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "questionSecurity") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "questionSecurity",
              this.state.question
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "answerSecurity") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "answerSecurity",
              this.state.request
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "typeDocumentIdentity") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "typeDocumentIdentity",
              this.state.typeDocument
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "numberDocumentIdentity") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "numberDocumentIdentity",
              this.state.numberDocumentId
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "gender") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "gender",
              this.state.sex
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "birthdate") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "birthdate",
              this.state.birtdate
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "birthplace") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "birthplace",
              this.state.birtdateCountry
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "familyName") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "familyName",
              this.state.nameFamily
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "familyEmail") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "familyEmail",
              this.state.emailFamily
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userLocalBitcoin") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "userLocalBitcoin",
              this.state.userLocalBitcoin
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userFacebook") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "userFacebook",
              this.state.userFacebook
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "userDirection") {
            userService.addInfoToUserDollarBtc(
              this.state.email,
              "userDirection",
              this.state.direction
            );
            setTimeout(() => {
              this.initVerification();
            }, 5000);
          }
          if (s[1] === "identityURL") {
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
          if (s[1] === "bankURL") {
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
          if (s[1] === "locationURL") {
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
          if (s[1] === "selfURL") {
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
          this.setState({ formLoad: false, endsend: true });
          this.setState({
            viewMessage: true,
            textMessage:
              "Sus archivos han sido enviados satisfactoriamente. Este proceso de verificación puede tardar hasta 72 horas.",
            idFile: {},
            bankFile: {},
            locationFile: {},
            selfFile: {}
          });
          this.selfRef.current.removeFiles();
          this.setState({
            selfFile: {},
            selffImg: selff,
            addFileSelf: true
          });
          this.locationRef.current.removeFiles();
          this.setState({
            locationFile: {},
            locationImg: location,
            addFileLocation: true
          });
          this.bankRef.current.removeFiles();
          this.setState({
            bankFile: {},
            bankImg: bank,
            addFileBank: true
          });
          this.dniRef.current.removeFiles();
          this.setState({
            idFile: {},
            idImg: id,
            addFileDni: true
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              textMessage: ""
            });
          }, 15000);
        }
      })
      .catch(error => {
        //console.log(error);
      });
  }
  handleFirtsName(e) {
    this.setState({ firstName: e.target.value });
  }
  handleLastName(e) {
    this.setState({ lastName: e.target.value });
  }
  handlePrefit(e, data) {
    let val = e.target.value;
    this.setState({ partialPhone: val });
  }
  handleNumberPhone(e, data) {
    var numeros = "0123456789";
    let valid;
    for (let elem in e.target.value) {
      if (numeros.indexOf(e.target.value.charAt(elem), 0) !== -1) {
        valid = true;
      } else {
        valid = false;
      }
    }
    if (valid) {
      this.setState({ partialNumber: e.target.value });
    } else {
      this.setState({
        errorCode: true
      });
    }
  }
  handleBirtdate(e, data) {
    this.setState({ birtdate: e.target.value });
  }
  handleBirtdateCountry(e, data) {
    this.setState({ birtdateCountry: e.target.value });
  }
  handleSex(e, data) {
    this.setState({ sex: data.value });
    let da = this.state.sexList.find(function(ele) {
      return ele.value === e.target.value;
    });
    if (da !== undefined) {
    }
  }
  handleTypeDocument(e, data) {
    if (data.value === "other") {
      this.setState({ selectOther: true });
    } else {
      this.setState({ selectOther: false });
    }
    this.setState({
      typeDocument: data.value,
      typeDocumentText: data.value
    });
    let da = this.state.documentType.find(function(ele) {
      return ele.text === data.value;
    });
    if (da !== undefined) {
    }
  }
  handleOtherTypeDocument(e, data) {
    this.setState({
      otherDocument: e.target.value,
      typeDocument: e.target.value
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
  handleUserLocalBitcoin(e, data) {
    this.setState({ userLocalBitcoin: e.target.value });
  }
  handleUserFacebook(e, data) {
    this.setState({ userFacebook: e.target.value });
  }
  handleRequest(e, data) {
    this.setState({ request: e.target.value });
  }
  closeModal() {
    this.setState({ open: false });
  }
  showModal() {
    this.setState({ open: true });
  }
  closeModalEnd() {
    this.setState({ open: false, endsend: false });
    window.location.href = "/profile";
  }
  render() {
    let message,
      messageErrord,
      messageErrorb,
      messageErrorl,
      messageErrors,
      buy;
    if (this.props.buy === undefined || this.props.buy === null) {
      buy = false;
    } else {
      buy = true;
    }
    let list2 = this.state.prefit.map((element, i) => (
      <option value={element.value} key={i}>
        {element.text}
      </option>
    ));
    if (this.state.viewMessage) {
      message = <Message info content={this.state.textMessage} />;
    }
    if (this.state.errorFileDni) {
      messageErrord = <Message info content={this.state.messageText} />;
    }
    if (this.state.errorFileDni) {
      messageErrorb = <Message info content={this.state.messageText} />;
    }
    if (this.state.errorFileDni) {
      messageErrorl = <Message info content={this.state.messageText} />;
    }
    if (this.state.errorFileDni) {
      messageErrors = <Message info content={this.state.messageText} />;
    }
    return (
      <div>
        <Grid columns="equal">
          <Grid.Column />
          <Grid.Column width={12}>
            <Container>
              <Segment color="orange" textAlign="left">
                <Header as="h2" textAlign="center">
                  Verificar usuario
                </Header>

                <Container className="container-form-verify">
                  <Form onSubmit={this.showModal.bind(this)} error>
                    <Divider hidden />
                    <Form.Group>
                      <Form.Input
                        required
                        label="Nombres"
                        width={4}
                        placeholder="Ingrese nombres"
                        value={this.state.firstName}
                        onChange={this.handleFirtsName.bind(this)}
                      />
                      <Form.Input
                        required
                        label="Apellidos"
                        width={4}
                        placeholder="Ingrese apellidos"
                        value={this.state.lastName}
                        onChange={this.handleLastName.bind(this)}
                      />
                      <Form.Select
                        width={4}
                        required
                        id="select-rebeld-sex"
                        placeholder="Seleccione..."
                        value={this.state.sex}
                        options={this.state.sexList}
                        onChange={this.handleSex.bind(this)}
                        label="Sexo"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Select
                        required
                        width={4}
                        id="select-rebeld"
                        placeholder="Seleccione..."
                        options={this.state.documentType}
                        onChange={this.handleTypeDocument.bind(this)}
                        label="Tipo de documento"
                      />

                      {this.state.selectOther && (
                        <Form.Input
                          required
                          width={4}
                          label="Especifique"
                          value={this.state.otherDocument}
                          onChange={this.handleOtherTypeDocument.bind(this)}
                        />
                      )}
                      <Form.Input
                        required
                        width={4}
                        label="Número de documento "
                        value={this.state.numberDocumentId}
                        onChange={this.handleNumberDocumentId.bind(this)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Input
                        required
                        label="Fecha de nacimiento"
                        type="date"
                        width={4}
                        value={this.state.birtdate}
                        onChange={this.handleBirtdate.bind(this)}
                      />
                      <Form.Input
                        width={4}
                        label="Lugar de nacimiento"
                        value={this.state.birtdateCountry}
                        onChange={this.handleBirtdateCountry.bind(this)}
                      />
                      <Form.Input
                        required
                        width={4}
                        list="countrys"
                        placeholder="Seleccione un pais..."
                        onChange={this.handlePrefit.bind(this)}
                        value={this.state.partialPhone}
                        label="Código del país"
                      />
                      <datalist id="countrys">{list2}</datalist>

                      <Form.Input
                        required
                        width={4}
                        label="Teléfono móvil"
                        placeholder="ejemplo 1234567"
                        value={this.state.partialNumber}
                        onChange={this.handleNumberPhone.bind(this)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Input
                        required
                        width={4}
                        label="Pregunta seguridad"
                        value={this.state.question}
                        onChange={this.handleQuestion.bind(this)}
                      />
                      <Form.Input
                        required
                        width={4}
                        label="Respuesta seguridad"
                        value={this.state.request}
                        onChange={this.handleRequest.bind(this)}
                      />
                      <Form.Input
                        width={4}
                        label="Familiar de contacto"
                        value={this.state.nameFamily}
                        placeholder="Nombre de familiar "
                        onChange={this.handleNameFamily.bind(this)}
                      />
                      <Form.Input
                        width={4}
                        label="Email del contacto"
                        value={this.state.emailFamily}
                        placeholder="Email "
                        type="email"
                        onChange={this.handleEmailFamily.bind(this)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.TextArea
                        required
                        width={16}
                        label="Dirección"
                        value={this.state.direction}
                        onChange={this.handleDirection.bind(this)}
                      />
                    </Form.Group>
                    <Divider hidden />
                    <Grid>
                      <div style={{ marginTop: "8px", textAlign: "center" }}>
                        Haga click sobre el icono o arrastre para cargar el
                        archivo correspondiente.
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          textAlign: "center",
                          marginBottom: "5px"
                        }}
                      >
                        Tipos de archivos permitidos: jpg, jpeg, png, gif, pdf.
                        Tamaño máximo de los archivos 500kb
                      </div>
                      <Grid.Row textAlign="center">
                        <Grid.Column
                          largeScreen={8}
                          computer={8}
                          tablet={16}
                          mobile={16}
                        >
                          {" "}
                          <Form.Field required>
                            <label>
                              Documento de identificación(DNI,PASAPORTE,ID)
                            </label>

                            <Segment placeholder className="sizeSement">
                              <Form.Field>
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
                                  maxFileSize={500000}
                                  minFileSize={0}
                                  clickable={this.state.addFileDni}
                                >
                                  <Header textAlign="center">
                                    <img
                                      alt=""
                                      src={this.state.idImg}
                                      className="imageFileV"
                                    />
                                    <p style={{ fontSize: "13px" }}>
                                      {this.state.idFile.name}
                                    </p>
                                    {messageErrord}
                                  </Header>
                                </Files>
                                {!this.state.addFileDni && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-dni"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    Cambiar
                                  </Button>
                                )}
                                {this.errorFileDni && (
                                  <Message
                                    error
                                    header="Disculpe"
                                    content="Archivo no soportado"
                                  />
                                )}
                                <br />
                              </Form.Field>
                            </Segment>
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                          largeScreen={8}
                          computer={8}
                          tablet={16}
                          mobile={16}
                        >
                          <Form.Field required>
                            {" "}
                            <label>
                              Comprobante de cuenta bancaria asociada
                            </label>
                            <Segment placeholder className="sizeSement">
                              <Form.Field>
                                <Files
                                  className="files-dropzone"
                                  ref={this.bankRef}
                                  onChange={this.onFilesChangeBank.bind(this)}
                                  onError={this.onFilesErrorBank.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={500000}
                                  minFileSize={0}
                                  clickable={this.state.addFileBank}
                                >
                                  <Header textAlign="center">
                                    <img
                                      alt=""
                                      src={this.state.bankImg}
                                      className="imageFileV"
                                    />
                                    <p style={{ fontSize: "13px" }}>
                                      {this.state.bankFile.name}
                                    </p>
                                    {messageErrorb}
                                  </Header>
                                </Files>

                                {!this.state.addFileBank && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-bank"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    Cambiar
                                  </Button>
                                )}
                                {this.errorFileBank && (
                                  <Message
                                    error
                                    header="Disculpe"
                                    content="Archivo no soportado"
                                  />
                                )}
                              </Form.Field>
                            </Segment>
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column
                          largeScreen={8}
                          computer={8}
                          tablet={16}
                          mobile={16}
                        >
                          <Form.Field required>
                            {" "}
                            <label>Comprobante de dirección</label>
                            <Segment placeholder className="sizeSement">
                              <Form.Field>
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
                                  maxFileSize={500000}
                                  minFileSize={0}
                                  clickable={this.state.addFileLocation}
                                >
                                  <Header textAlign="center">
                                    <img
                                      alt=""
                                      src={this.state.locationImg}
                                      className="imageFileV"
                                    />
                                    <p style={{ fontSize: "13px" }}>
                                      {this.state.locationFile.name}
                                    </p>
                                    {messageErrorl}
                                  </Header>
                                </Files>

                                {!this.state.addFileLocation && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-location"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    Cambiar
                                  </Button>
                                )}
                                {this.errorFileLocation && (
                                  <Message
                                    error
                                    header="Disculpe"
                                    content="Archivo no soportado"
                                  />
                                )}
                              </Form.Field>
                            </Segment>
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column
                          largeScreen={8}
                          computer={8}
                          tablet={16}
                          mobile={16}
                        >
                          <Form.Field required>
                            <label>Selfie con documento de dirección</label>

                            <Segment placeholder className="sizeSement">
                              <Form.Field>
                                <Files
                                  className="files-dropzone"
                                  ref={this.selfRef}
                                  onChange={this.onFilesChangeSelfie.bind(this)}
                                  onError={this.onFilesErrorSelfie.bind(this)}
                                  accepts={["image/*", ".pdf"]}
                                  multiple={false}
                                  maxFiles={1}
                                  maxFileSize={500000}
                                  minFileSize={0}
                                  clickable={this.state.addFileSelf}
                                >
                                  <Header textAlign="center">
                                    <img
                                      alt=""
                                      src={this.state.selffImg}
                                      className="imageFileV"
                                    />
                                    <p style={{ fontSize: "13px" }}>
                                      {this.state.selfFile.name}
                                    </p>
                                    {messageErrors}
                                  </Header>
                                </Files>

                                {!this.state.addFileSelf && (
                                  <Button
                                    color="blue"
                                    size="tiny"
                                    id="file-self"
                                    onClick={this.onRemoveFile.bind(this)}
                                  >
                                    Cambiar
                                  </Button>
                                )}
                                {this.errorFileSelf && (
                                  <Message
                                    error
                                    header="Disculpe"
                                    content="Archivo no soportado"
                                  />
                                )}
                              </Form.Field>
                            </Segment>
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column textAlign="center">
                          <Divider hidden />
                          <Button type="submit" color="blue" size="large">
                            Verificar
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Form>
                  <Header textAlign="center">
                    {!this.state.formLoad && (
                      <Button
                        basic
                        size="tiny"
                        onClick={this.handleCancel.bind(this)}
                      >
                        Regresar
                      </Button>
                    )}
                  </Header>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
          <Grid.Column />
        </Grid>
        <Modal open={this.state.open}>
          <Modal.Header>Iniciar verificación</Modal.Header>
          <Modal.Content>
            <Segment basic loading={this.state.formLoad}>
              <Header as="h3">
                Todos los datos serán verificados. Desea iniciar el proceso ?
              </Header>
              {message}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.endsend && (
              <Button
                onClick={this.closeModal.bind(this)}
                negative
                disabled={this.state.formLoad}
              >
                No
              </Button>
            )}
            {!this.state.endsend && (
              <Button
                onClick={this.onLoadFile.bind(this)}
                positive
                disabled={this.state.formLoad}
              >
                Si
              </Button>
            )}
            {this.state.endsend && (
              <Button onClick={this.closeModalEnd.bind(this)} color="blue">
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default Verification;
