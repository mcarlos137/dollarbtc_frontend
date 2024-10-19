import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  Label,
  Feed,
  Icon,
  Popup,
  Divider,
  Responsive,
  Modal,
  Image,
} from "semantic-ui-react";
import Files from "react-files";
import FormData from "form-data";
import "./ChatWaiting.css";
import avatarNull from "../../../../img/avatarNull.png";
import otcAPI from "../../../../services/otc";
import uuid from "uuid";
import Sockette from "sockette";
import translate from "../../../../i18n/translate";
import TakePhoto from "../../../ModalTakePhoto/TakePhoto";
import { isMobile } from "react-device-detect";
import attachments from "../../../../services/attachments";
import config from "../../../../services/config";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
class ChatWaiting extends Component {
  constructor(props) {
    super(props);
    this.selfRef = React.createRef();
    this.state = {
      addFile: true,
      socket: null,
      verificationOperationId: this.props.paymentData,
      timerId: "",
      contactMessages: [],
      selectedFile: {},
      fileName: "",
      textMessageNew: "",
      messageWithoutText: false,
      message: "",
      messageErrorAdjuntar: false,
      translator: props.translate,
      showImage: false,
      selectImage: "",
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
    this.openSocket(this.props.paymentData);
  }
  closeConexionSocket() {
    if (this.state.socket !== null && this.state.socket !== undefined) {
      this.state.socket.close();
      this.setState({
        contactMessages: [],
        selectedFile: null,
      });
    }
    window.sessionStorage.setItem("buyOperationSocketId", "");
  }
  openSocket = (operationId) => {
    this.setState({
      socket: new Sockette(URL_WEBSOCKET_DBTC + "/otc", {
        onopen: (e) => {
          this.socketReady(e, operationId, null);
          // //console.log("conectando...", e);
        },
        onmessage: (e) => {
          this.handleValue(e.data, operationId);
          ////console.log("respuesta... ", e);
        },
        onreconnect: (e) => {
          this.reconnectSocket(e, operationId);
          ////console.log("reconectando...", e);
        },
      }),
    });
  };
  socketReady(event, idOperation, webSocketId) {
    //llamar de nuevo cuando seleccione otra operación
    let wsId = null;
    if (webSocketId === null || webSocketId === "") {
      wsId = uuid.v4();
      window.sessionStorage.setItem("buyOperationSocketId", wsId);
    } else {
      ////console.log("estoy en el else del connect: ", webSocketId);
      wsId = webSocketId;
    }
    let body = {
      method: "getOperationMessages",
      params: {
        id: idOperation,
        side: "User",
        websocketKey: wsId,
      },
    };

    if (this.state.socket !== null && event.target.readyState === 1) {
      try {
        this.state.socket.json(body);
        // //console.log(body);
      } catch (e) {}
    }
  }
  reconnectSocket(e, operationId) {
    let ws = window.sessionStorage.getItem("buyOperationSocketId");
    this.socketReady(e, operationId, ws);
  }
  async handleValue(value, operationId) {
    console.log(value);
    let result = JSON.parse(value);
    if (result !== undefined) {
      if (result.params !== undefined) {
        /*  //console.log(
          "llega del socket de operaciones de compra ",
          result.params
        );*/
        for (let i = 0; i < result.params.data.length; i++) {
          let messageToAdd = result.params.data[i];
          let index = this.state.contactMessages.findIndex((messageAdded) => {
            return messageToAdd.timestamp === messageAdded.timestamp;
          });
          if (index === -1) {
            if (messageToAdd.attachment !== undefined) {
              messageToAdd.urlFile = await this.getOperationsAttachment(
                operationId,
                messageToAdd.attachment
              );
            }
            this.state.contactMessages.push(messageToAdd);
          }
        }
        if (result.params.data.length > 0) {
          this.state.contactMessages.sort(function (a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          this.setState({
            contactMessages: this.state.contactMessages,
          });
        }
      }
    }
  }
  async getOperationsAttachment(operationId, fileName) {
    let result;
    try {
      const response = await attachments.getOtcAttachment(
        operationId,
        fileName
      );
      let blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      let image = URL.createObjectURL(blob);
      result = image;
    } catch (error) {
      result = "";
    }
    return result;
  }
  cancelVerificationPayment() {
    this.props.cancel();
  }
  handleChangeTextMessageNew(e) {
    this.setState({
      textMessageNew: e.target.value,
    });
  }
  handleSendMessage() {
    if (this.state.selectedFile !== null || this.state.textMessageNew !== "") {
      if (this.state.selectedFile !== null) {
        this.sendMessageWithFile();
      } else {
        this.sendMessageWithOutFile();
      }
      this.setState({
        textMessageNew: "",
      });
      this.deleteFile();
    } else {
      this.setState({
        messageWithoutText: true,
        message: "profile.waitingVerification.chatWaiting.errors.requiredField",
      });
      setTimeout(() => {
        this.setState({
          messageWithoutText: false,
          message: "",
        });
      }, 5000);
    }
  }
  sendMessageWithFile() {
    let formData = new FormData();
    formData.append("attachment", this.state.selectedFile);
    formData.append("userName", window.sessionStorage.getItem("username"));
    formData.append("id", this.state.verificationOperationId);
    formData.append("message", this.state.textMessageNew);
    formData.append("operationMessageSide", "USER");
    otcAPI.addPostOperationMessageWithFile(formData);
    this.deleteFile();
    this.setState({
      textMessageNew: "",
    });
  }
  sendMessageWithOutFile() {
    let formData = new FormData();
    formData.append("userName", window.sessionStorage.getItem("username"));
    formData.append("id", this.state.verificationOperationId);
    formData.append("message", this.state.textMessageNew);
    formData.append("operationMessageSide", "USER");
    otcAPI.addPostOperationMessageWithFile(formData);
    this.deleteFile();
    this.setState({
      textMessageNew: "",
    });
  }
  fileChangedHandler(file) {
    if (file !== undefined && file.length > 0) {
      this.setState({ loadingNewFile: true });
      this.setState({
        selectedFile: file[0],
        addFile: false,
        fileName: file[0].name,
      });
    }
  }
  deleteFile() {
    this.selfRef.current.removeFiles();
    this.setState({ selectedFile: {}, addFile: true, fileName: "" });
  }
  fileChangedHandlerError(error) {
    if (error.code === 1) {
      this.setState({
        messageErrorAdjuntar: true,
        message:
          "profile.waitingVerification.chatWaiting.errors.fileNotSupported",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    } else {
      this.setState({
        messageErrorAdjuntar: true,
        message: "profile.waitingVerification.chatWaiting.errors.exceededSize",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    }
  }
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true",
    };
    let data = date.toLocaleString(regi, options);
    if (regi === "es-ES") {
      data = data.split(" ");
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + " " + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  componentWillUnmount() {
    if (this.state.socket !== undefined && this.state.socket !== null) {
      this.state.socket.close();
    }
    window.sessionStorage.setItem("buyOperationSocketId", "");
  }
  handleKeyPressed(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  }
  render() {
    let t = this.state.translator;
    let labelMessageWithoutText, labelMessageErrorAdjunto;
    if (this.state.messageWithoutText) {
      labelMessageWithoutText = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }
    if (this.state.messageErrorAdjuntar) {
      labelMessageErrorAdjunto = (
        <div class="widthFull">
          <Label basic color="red" pointing>
            {t(this.state.message)}
          </Label>
        </div>
      );
    }
    return (
      <div>
        <Responsive minWidth={992}>
          <Segment>
            <div>
              <textarea
                style={{ width: "100%", borderColor: "gainsboro" }}
                placeholder={t(
                  "profile.waitingVerification.chatWaiting.placeholderMessage"
                )}
                onChange={this.handleChangeTextMessageNew.bind(this)}
                value={this.state.textMessageNew}
                onKeyPress={this.handleKeyPressed.bind(this)}
              />
            </div>
            <div>{labelMessageWithoutText}</div>
            <br />
            <div className="padding-top-and-button">
              <Form>
                <Form.Field>
                  <div align="center">
                    {this.state.addFile !== true && (
                      <Label>
                        {this.state.fileName}{" "}
                        <Icon
                          name="delete"
                          onClick={this.deleteFile.bind(this)}
                        />
                      </Label>
                    )}
                  </div>
                </Form.Field>
                <Form.Group inline>
                  <Form.Field>
                    <Button
                      color="red"
                      content={t(
                        "profile.waitingVerification.chatWaiting.buttonCloseVerification"
                      )}
                      compact
                      size="mini"
                      onClick={this.cancelVerificationPayment.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Files
                      ref={this.selfRef}
                      onChange={this.fileChangedHandler.bind(this)}
                      onError={this.fileChangedHandlerError.bind(this)}
                      accepts={["image/*", ".pdf"]}
                      multiple={false}
                      maxFiles={1}
                      maxFileSize={500000}
                      minFileSize={0}
                      clickable={this.state.addFile}
                    >
                      {" "}
                      <Button
                        basic
                        size="mini"
                        compact
                        color="grey"
                        disabled={!this.state.addFile}
                      >
                        {t(
                          "profile.waitingVerification.chatWaiting.buttonAttachment"
                        )}
                      </Button>
                    </Files>
                  </Form.Field>
                  <Form.Field>
                    <TakePhoto
                      buttonSize="large"
                      onHandlerFile={this.fileChangedHandler.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Button
                      color="blue"
                      size="small"
                      compact
                      onClick={this.handleSendMessage.bind(this)}
                    >
                      {t("profile.waitingVerification.chatWaiting.buttonSend")}
                    </Button>
                  </Form.Field>
                </Form.Group>
              </Form>
            </div>
            <Form.Field width={6}>{labelMessageErrorAdjunto}</Form.Field>
            <Form.Group inline>
              <Form.Field className="list-messages">
                <Feed>
                  {this.state.contactMessages.map((message, i) => (
                    <Feed.Event key={i}>
                      <Feed.Label image={avatarNull} />
                      <Feed.Content>
                        <Feed.Summary>
                          <a>
                            {message.userName ===
                            sessionStorage.getItem("email")
                              ? t(
                                  "profile.waitingVerification.chatWaiting.labelMe"
                                )
                              : t(
                                  "profile.waitingVerification.chatWaiting.labelModerator"
                                )}
                          </a>
                          <Feed.Date>
                            {" "}
                            {this.formatDate(new Date(message.timestamp))}
                          </Feed.Date>
                        </Feed.Summary>
                        <Feed.Extra text>
                          {message.message === "OPERATION 10 MINUTES LEFT"
                            ? t(
                                "profile.waitingVerification.chatWaiting.operationTimeLeft"
                              )
                            : message.message === "OPERATION TIMEOUT"
                            ? t(
                                "profile.waitingVerification.chatWaiting.operationTimeExpired"
                              )
                            : message.message}
                        </Feed.Extra>
                        <Feed.Extra images>
                          <a>
                            {message.attachment !== undefined && (
                              <Popup
                                trigger={
                                  <Button
                                    onClick={() => {
                                      this.setState(
                                        { selectImage: message.urlFile },
                                        () => {
                                          this.setState({ showImage: true });
                                        }
                                      );
                                    }}
                                    size="tiny"
                                    color="blue"
                                    icon
                                  >
                                    <Icon name="file image outline" />
                                  </Button>
                                }
                                content={t(
                                  "profile.waitingVerification.chatWaiting.buttonSeeAttachment"
                                )}
                              />
                            )}
                          </a>
                        </Feed.Extra>
                      </Feed.Content>
                    </Feed.Event>
                  ))}
                </Feed>
              </Form.Field>
            </Form.Group>
          </Segment>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          {isMobile && (
            <div align="center">
              <Divider hidden></Divider>
              <Form.Field>
                <Button
                  color="red"
                  content={t(
                    "profile.waitingVerification.chatWaiting.buttonCloseVerification"
                  )}
                  style={
                    isMobile
                      ? {
                          borderRadius: "40px/40px",
                          height: "50px",
                          width: "200px",
                        }
                      : {}
                  }
                  compact
                  size="mini"
                  onClick={this.cancelVerificationPayment.bind(this)}
                />
                <Divider></Divider>
              </Form.Field>
            </div>
          )}

          <div>
            <textarea
              rows={4}
              style={{ width: "100%", borderColor: "gainsboro" }}
              placeholder={t(
                "profile.waitingVerification.chatWaiting.placeholderMessage"
              )}
              onChange={this.handleChangeTextMessageNew.bind(this)}
              value={this.state.textMessageNew}
              onKeyPress={this.handleKeyPressed.bind(this)}
            />
          </div>
          <div>{labelMessageWithoutText}</div>

          <Form>
            <Form.Field>
              <Form.Group inline>
                <Files
                  ref={this.selfRef}
                  onChange={this.fileChangedHandler.bind(this)}
                  onError={this.fileChangedHandlerError.bind(this)}
                  accepts={["image/*", ".pdf"]}
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={500000}
                  minFileSize={0}
                  clickable={this.state.addFile}
                >
                  {" "}
                  <Button
                    basic
                    size="mini"
                    compact
                    color="grey"
                    disabled={!this.state.addFile}
                    style={{
                      borderRadius: "40px/40px",
                      height: "40px",
                      width: "95px",
                      marginRight: 10,
                    }}
                  >
                    {t(
                      "profile.waitingVerification.chatWaiting.buttonAttachment"
                    )}
                  </Button>
                </Files>
                <TakePhoto
                  buttonSize="large"
                  onHandlerFile={this.fileChangedHandler.bind(this)}
                />

                <Button
                  color="blue"
                  size="small"
                  compact
                  onClick={this.handleSendMessage.bind(this)}
                  style={
                    isMobile
                      ? {
                          borderRadius: "40px/40px",
                          height: "40px",
                          width: "95px",
                        }
                      : {}
                  }
                >
                  {t("profile.waitingVerification.chatWaiting.buttonSend")}
                </Button>
              </Form.Group>
            </Form.Field>
          </Form>
          <Form.Field width={6}>{labelMessageErrorAdjunto}</Form.Field>
          <Form.Group inline>
            <Form.Field className="list-messages">
              <Feed>
                {this.state.contactMessages.map((message, i) => (
                  <Feed.Event key={i}>
                    <Feed.Label image={avatarNull} />
                    <Feed.Content>
                      <Feed.Summary>
                        <a>
                          {message.userName === sessionStorage.getItem("email")
                            ? t(
                                "profile.waitingVerification.chatWaiting.labelMe"
                              )
                            : t(
                                "profile.waitingVerification.chatWaiting.labelModerator"
                              )}
                        </a>
                        <Feed.Date>
                          {" "}
                          {this.formatDate(new Date(message.timestamp))}
                        </Feed.Date>
                      </Feed.Summary>
                      <Feed.Extra text>
                        {message.message === "OPERATION 10 MINUTES LEFT"
                          ? t(
                              "profile.waitingVerification.chatWaiting.operationTimeLeft"
                            )
                          : message.message === "OPERATION TIMEOUT"
                          ? t(
                              "profile.waitingVerification.chatWaiting.operationTimeExpired"
                            )
                          : message.message}
                      </Feed.Extra>
                      <Feed.Extra images>
                        <a>
                          {message.attachmentURL !== undefined && (
                            <Popup
                              trigger={
                                <Button
                                  onClick={() => {
                                    this.setState(
                                      { selectImage: message.attachmentURL },
                                      () => {
                                        this.setState({ showImage: true });
                                      }
                                    );
                                  }}
                                  size="tiny"
                                  color="blue"
                                  icon
                                >
                                  <Icon name="file image outline" />
                                </Button>
                              }
                              content={t(
                                "profile.waitingVerification.chatWaiting.buttonSeeAttachment"
                              )}
                            />
                          )}
                        </a>
                      </Feed.Extra>
                    </Feed.Content>
                  </Feed.Event>
                ))}
              </Feed>
            </Form.Field>
          </Form.Group>
        </Responsive>
        <Modal open={this.state.showImage}>
          <Modal.Content>
            <Image centered src={this.state.selectImage} size="big" />
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() =>
                this.setState({ showImage: false, selectImage: "" })
              }
              color="grey"
            >
              <p>{t("buy.modalTerms.buttonClose")}</p>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default translate(ChatWaiting);
