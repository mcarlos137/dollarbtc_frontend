import React, { Component } from "react";
import {
  Label,
  Dropdown,
  Menu,
  Responsive,
  Popup,
  Grid,
  Button,
  Header,
} from "semantic-ui-react";
import Sockette from "sockette";
import user from "../../services/user";
import "./InboxMessage.css";
import soundAlert2 from "../../audio/oh-finally.mp3";
import { isSafari } from "react-device-detect";
import icon from "../../img/iconmenu1.png";
import icon2 from "../../img/icn-notificacion-azul-DBTC.png";
import icon3 from "../../img/icn-notificacion-negro.png";
import uuid from "uuid";
import translate from "../../i18n/translate";
import packageJson from "../../../package.json";
import config from "../../services/config";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;

class InboxMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      notifications: [],
      countUnread: 0,
      play: false,
      translator: props.translate,
      hasPermissionToPlaySound: !isSafari,
      openPopup: false,
      inboxMessageClient: packageJson.designCompany,
    };
    this.source = soundAlert2;
    //this.source = isSafari ? soundAlertSafari : soundAlert2;
    this.audio = new Audio(this.source);
    this.togglePlay = this.togglePlay.bind(this);
    this.socketReady = this.socketReady.bind(this);
    this.handleResponseSocket = this.handleResponseSocket.bind(this);
    this.onClickMessage = this.onClickMessage.bind(this);
    this.validateAudioPlaySafari = this.validateAudioPlaySafari.bind(this);
    this.handleClickAcceptPermissionAudio = this.handleClickAcceptPermissionAudio.bind(
      this
    );
    this._isMounted = false;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    this._isMounted = true;
    window.sessionStorage.setItem("websocketKey", uuid.v4());
    this.setState({
      socket: new Sockette(URL_WEBSOCKET_DBTC + "/user", {
        timeout: 60000,
        onopen: (e) => {
          this.socketReady();
        },
        onmessage: (e) => {
          this.handleResponseSocket(e.data);
        },
        /*onreconnect: e => ////console.log('Reconnecting...'+new Date(), e),
        onclose: e => ////console.log('Closed!'+new Date(), e),
        onerror: e => ////console.log('Error:', e)*/
      }),
    });
    if (isSafari) this.validateAudioPlaySafari();
  }

  validateAudioPlaySafari() {
    let promise = this.audio.play();

    if (promise !== undefined) {
      promise
        .then((_) => {
          // Autoplay started!
          ////console.log("permission granted");
          this.audio.play();
          this.setState({ hasPermissionToPlaySound: true });
        })
        .catch((error) => {
          ////console.log(error);
          // Autoplay was prevented.
          ////console.log("There's not permission to play sounds");
          // Show a "Play" button so that user can start playback.
          this.setState({ openPopup: true });
        });
    } else {
      ////console.log("audio promise undefined");
    }
  }
  handleClickAcceptPermissionAudio() {
    //////console.log("En el click de los permisos");
    let promise = this.audio.play();
    if (promise !== undefined) {
      promise
        .then((_) => {
          // Autoplay started!
          ////console.log("permission granted");
          this.audio.play();
          this.setState({ openPopup: false, hasPermissionToPlaySound: true });
        })
        .catch((error) => {
          ////console.log(error);
          // Autoplay was prevented.
          ////console.log("There's not permission to play sounds");
          // Show a "Play" button so that user can start playback.
          this.setState({ openPopup: true });
        });
    } else {
      ////console.log("audio promise undefined");
      this.setState({ openPopup: false });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    let auxSocket = this.state.socket;
    if (auxSocket !== undefined && auxSocket !== null) {
      if (!this.state.socket.open) this.state.socket.close();
      ////console.log("cerrando");
    }
  }
  state = {
    socket: null,
    notifications: [],
    countUnread: 0,
  };

  socketReady() {
    //////console.log("wsKey: ", window.sessionStorage.getItem("websocketKey"));
    let men = {
      method: "getMessages",
      params: {
        userName: user.getUserName(),
        websocketKey: window.sessionStorage.getItem("websocketKey"),
      },
    };
    if (this.state.socket !== null) {
      try {
        this.state.socket.json(men);
      } catch (e) {}
    }
  }

  togglePlay() {
    if (this._isMounted) {
      this.setState({ play: !this.state.play });
      if (this.state.hasPermissionToPlaySound)
        this.state.play ? this.audio.play() : this.audio.pause();
    }
  }

  onClickMessage = (e, data) => {
    var notification = this.state.notifications.find((n) => {
      return n.id === data.value;
    });
    let all = this.state.notifications;
    let index = this.state.notifications.indexOf(notification);
    if (index !== -1) {
      let url = notification.value;
      let id = notification.id;
      var ctUnread = this.state.countUnread;
      if (this.isURLValid(url)) {
        if (!notification.readed) {
          user
            .markMessageAsRead(user.getUserName(), id)
            .then((resp) => {
              ////console.log(resp);
              window.open(url, "_self");
              all[index].readed = true;
              ctUnread--;
              this.setState({
                notifications: all,
                countUnread: ctUnread,
              });
            })
            .catch((error) => {
              ////console.log(error);
            });
        } else {
          window.open(url, "_self");
        }
      } else if (url === "none" || url === "NONE" || url === null) {
        if (!notification.readed) {
          user
            .markMessageAsRead(user.getUserName(), id)
            .then((resp) => {
              //console.log("entrando por el url none");
              all[index].readed = true;
              ctUnread--;
              this.setState({
                notifications: all,
                countUnread: ctUnread,
              });
            })
            .catch((error) => {
              ////console.log(error);
            });
        }
      }
    }
  };

  handleResponseSocket(resp) {
    let msgs;
    if (this._isMounted) {
      let result = JSON.parse(resp);
      //console.log("result:", result.params.data);
      if (result !== undefined) {
        if (result.params !== undefined) {
          let notifications = this.state.notifications;
          let unread = this.state.countUnread;
          if (result.params.data !== undefined || result.params.data !== null) {
            msgs = result.params.data;
            // //console.log("msgs:", msgs)
            if (msgs.length > 0) {
              if (result.method !== "currentOperationMessages") {
                //////console.log("en el metodo: "+result.method);
                notifications = [];
                unread = 0;
              }
              if (notifications.length === 1) {
                const emptyMsg = notifications.find((n) => {
                  return n.id === "empty";
                });
                if (notifications.indexOf(emptyMsg) !== -1) {
                  notifications = [];
                }
              }
              msgs = msgs.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
              });

              msgs.forEach((m, index) => {
                if (m !== null) {
                  if (
                    m.redirectionPath !== null &&
                    m.redirectionPath !== undefined &&
                    m.redirectionPath !== ""
                  ) {
                    if (
                      m.redirectionPath.includes("mc_") ||
                      m.redirectionPath.includes("send_to_payment")
                    ) {
                      //console.log("esta operacion es de mcweb")

                      msgs.splice(index, 1);
                      ////console.log("m eliminado:", arr)
                      //console.log("msgs nuevos:", msgs)
                    } else {
                      //console.log("dentro del else")
                      let pieceMesssage = m.message.split(" ");

                      let msg = "";
                      if (
                        notifications.length > 0 &&
                        pieceMesssage[2] !== undefined
                      ) {
                        let previousNotifications = notifications.filter(
                          (pn) => {
                            return (
                              pn.text.split(" ")[2] ===
                                pieceMesssage[2].substring(
                                  pieceMesssage[2].length - 4,
                                  pieceMesssage[2].length
                                ) &&
                              !pn.readed &&
                              m.id !== pn.id
                            );
                          }
                        );
                        previousNotifications.forEach((p) => {
                          if (!m.readed && !p.readed) {
                            p.readed = true;
                            user
                              .markMessageAsRead(user.getUserName(), p.id)
                              .then((res) => {
                                unread--;
                                this.setState({
                                  countUnread: unread,
                                });
                              })
                              .catch((error) => {
                                ////console.log(error);
                              });
                          }
                        });
                      }
                      if (pieceMesssage.indexOf("FINISHED") !== -1) {
                        msg =
                          this.props.translate(
                            "inbox.messages.finished.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.finished.part2");
                      } else if (
                        pieceMesssage.indexOf("message") !== -1 &&
                        pieceMesssage.indexOf("has") !== -1 &&
                        pieceMesssage.indexOf("new") !== -1
                      ) {
                        msg =
                          this.props.translate(
                            "inbox.messages.newMessage.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate(
                            "inbox.messages.newMessage.part2"
                          );
                      } else if (pieceMesssage.indexOf("CANCELED") !== -1) {
                        msg =
                          this.props.translate(
                            "inbox.messages.canceled.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.canceled.part2");
                      } else if (
                        pieceMesssage.indexOf("WAITING_FOR_PAYMENT") !== -1
                      ) {
                        msg =
                          this.props.translate(
                            "inbox.messages.waitingPayment.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate(
                            "inbox.messages.waitingPayment.part2"
                          );
                      } else if (pieceMesssage.indexOf("FAIL") !== -1) {
                        msg =
                          this.props.translate("inbox.messages.fail.part1") +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.fail.part2");
                      } else if (
                        pieceMesssage.indexOf("LEFT") !== -1 &&
                        pieceMesssage.indexOf("MINUTES") !== -1 &&
                        pieceMesssage.indexOf("OPERATION") !== -1
                      ) {
                        msg = this.props.translate(
                          "inbox.messages.operationTimeLeft"
                        );
                      } else if (
                        pieceMesssage.indexOf("OPERATION") !== -1 &&
                        pieceMesssage.indexOf("TIMEOUT") !== -1
                      ) {
                        msg = this.props.translate(
                          "inbox.messages.operationTimeExpired"
                        );
                      } else if (pieceMesssage.indexOf("PAID") !== -1) {
                        msg =
                          this.props.translate("inbox.messages.paid.part1") +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.paid.part2");
                      } else if (
                        pieceMesssage.indexOf("was") !== -1 &&
                        pieceMesssage.indexOf("created") !== -1
                      ) {
                        msg =
                          this.props.translate("inbox.messages.created.part1") +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.created.part2");
                      } else if (pieceMesssage.indexOf("SUCCESS") !== -1) {
                        msg =
                          this.props.translate("inbox.messages.success.part1") +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.success.part2");
                      } else if (pieceMesssage.indexOf("CLAIM") !== -1) {
                        msg =
                          this.props.translate("inbox.messages.claim.part1") +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate("inbox.messages.claim.part2");
                      } else if (
                        pieceMesssage.indexOf("PAY_VERIFICATION") !== -1
                      ) {
                        msg =
                          this.props.translate(
                            "inbox.messages.payVerification.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate(
                            "inbox.messages.payVerification.part2"
                          );
                      } else if (
                        pieceMesssage.indexOf(
                          "WAITING_FOR_RECEIVER_CONFIRMATION"
                        ) !== -1
                      ) {
                        msg =
                          this.props.translate(
                            "inbox.messages.receiverConfirmation.part1"
                          ) +
                          pieceMesssage[2].substring(
                            pieceMesssage[2].length - 4,
                            pieceMesssage[2].length
                          ) +
                          this.props.translate(
                            "inbox.messages.receiverConfirmation.part2"
                          );
                      } else {
                        msg = m.message;
                      }
                      let notif = {
                        text: msg,
                        value: m.redirectionPath,
                        id: m.id,
                        readed: m.readed,
                        timestamp: m.timestamp,
                      };
                      if (
                        !m.readed &&
                        m.redirectionPath.includes("mc_") !== true &&
                        m.redirectionPath.includes("send_to_payment") !== true
                      )
                        unread++;
                      notifications.push(notif);
                    }
                  }
                }
              });
              notifications = notifications.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
              });
              this.setState({
                notifications: notifications,
                countUnread: unread,
              });
              if (this.state.countUnread > 0) {
                this.togglePlay();
                this.setState({
                  play: false,
                });
              }
            } else if (notifications.length === 0) {
              let notif = {
                text: "inbox.messages.noMessages",
                value: "emptyNotifications",
                id: "empty",
              };
              notifications.push(notif);
              this.setState({
                notifications: notifications,
              });
            }
          } else {
            let notif = {
              text: "inbox.messages.noMessages",
              value: "emptyNotifications",
              id: "empty",
            };
            notifications.push(notif);
            this.setState({
              notifications: notifications,
            });
          }
        }
      }
    }
  }

  isURLValid = (url) => {
    return (
      url !== "none" &&
      url !== "NONE" &&
      url !== "emptyNotifications" &&
      url !== "" &&
      url !== null
    );
  };
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
  render() {
    let t = this.state.translator;
    const { notifications, countUnread } = this.state;
    const notificationsRead = notifications.filter((n) => {
      return n.readed;
    });

    const notificationsUnread = notifications.filter((n) => {
      return !n.readed;
    });

    return (
      <div>
        <Responsive minWidth={0} maxWidth={340}>
          <Menu.Item>
            <Popup
              open={this.state.openPopup}
              position="bottom center"
              size="small"
              style={{ top: "50px", right: "10px", left: "5px" }}
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header textAlign="center" as="h5">
                      {t("inbox.popupSafari.headerAuthSession")}
                    </Header>
                    <p>
                      <small>{t("inbox.popupSafari.messageAuthSession")}</small>
                    </p>
                    <Button
                      size="mini"
                      fluid
                      color="blue"
                      onClick={this.handleClickAcceptPermissionAudio}
                    >
                      {t("inbox.popupSafari.buttonAuthorize")}
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header as="h6">
                      {t("inbox.popupSafari.headerAuthPermanent")}
                    </Header>
                    <p>
                      <small>
                        {t("inbox.popupSafari.messageAuthPermanent")}
                      </small>
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Popup>
            {countUnread > 0 && (
              <Label
                id="countUnreadInbox"
                circular
                floating
                className={
                  window.sessionStorage.getItem("userType") === "ADMIN"
                    ? "badgestyle-admin"
                    : "badgestyleMovile"
                }
              >
                {countUnread}
              </Label>
            )}
            <Dropdown
              style={{
                marginLeft: window.innerWidth <= 364 ? -5 : 0,
                marginRight: window.innerWidth <= 364 ? -5 : 0,
              }}
              scrolling
              item
              text={
                <img
                  alt=""
                  src={
                    this.state.inboxMessageClient !== "GMB" &&
                    this.state.inboxMessageClient !== "BANCRIPT"
                      ? icon2
                      : icon3
                  }
                  style={{
                    width: 30,
                    height: 70,
                    marginBottom: window.innerWidth <= 364 ? "" : "",
                    marginTop: window.innerWidth <= 364 ? "" : "",
                  }}
                />
              }
              icon={null}
              name="message"
            >
              <Dropdown.Menu
                position={window.innerWidth <= 364 ? "left" : "center"}
                size="medium"
                style={{ right: "-100px", left: "-115px" }}
              >
                <Dropdown.Header content={t("inbox.unread")} />
                {notificationsUnread.length > 0 &&
                  notificationsUnread.map((n) => (
                    <Dropdown.Item
                      id="itemMessageUnread"
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                    >
                      <div className="inboxMessage unread-message">
                        <p className="message-container">
                          <strong>{n.text.trim()}</strong>
                        </p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                {notificationsUnread.length === 0 && (
                  <Dropdown.Item id="itemMessage">
                    <div className="inboxMessage">
                      <p className="message-container">
                        {t("inbox.notNotifications")}
                      </p>
                    </div>
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Header content={t("inbox.read")} />
                {notificationsRead.length > 0 &&
                  notificationsRead.map((n) => (
                    <Dropdown.Item
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                      id="itemMessageRead"
                    >
                      <div
                        className={
                          this.isURLValid(n.url)
                            ? "inboxMessage readed-message"
                            : "inboxMessage readed-message normal-cursor"
                        }
                      >
                        <p className="message-container">{n.text.trim()}</p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Responsive>
        <Responsive minWidth={341} maxWidth={991}>
          <Menu.Item>
            <Popup
              open={this.state.openPopup}
              position="bottom center"
              size="small"
              style={{ top: "50px", right: "10px", left: "5px" }}
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header textAlign="center" as="h5">
                      {t("inbox.popupSafari.headerAuthSession")}
                    </Header>
                    <p>
                      <small>{t("inbox.popupSafari.messageAuthSession")}</small>
                    </p>
                    <Button
                      size="mini"
                      fluid
                      color="blue"
                      onClick={this.handleClickAcceptPermissionAudio}
                    >
                      {t("inbox.popupSafari.buttonAuthorize")}
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header as="h6">
                      {t("inbox.popupSafari.headerAuthPermanent")}
                    </Header>
                    <p>
                      <small>
                        {t("inbox.popupSafari.messageAuthPermanent")}
                      </small>
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Popup>
            {countUnread > 0 && (
              <Label
                id="countUnreadInbox"
                circular
                floating
                className={
                  window.sessionStorage.getItem("userType") === "ADMIN"
                    ? "badgestyle-admin"
                    : "badgestyleMovile"
                }
              >
                {countUnread}
              </Label>
            )}
            <Dropdown
              style={{
                marginLeft: window.innerWidth <= 364 ? -5 : 0,
                marginRight: window.innerWidth <= 364 ? -5 : 0,
              }}
              scrolling
              item
              text={
                <img
                  alt=""
                  src={
                    this.state.inboxMessageClient !== "GMB" &&
                    this.state.inboxMessageClient !== "BANCRIPT"
                      ? icon2
                      : icon3
                  }
                  style={{
                    width: 30,
                    height: 70,
                    marginBottom: window.innerWidth <= 364 ? "" : "",
                    marginTop: window.innerWidth <= 364 ? "" : "",
                  }}
                />
              }
              icon={null}
              name="message"
            >
              <Dropdown.Menu
                position="center"
                size="medium"
                style={{ right: "-100px", left: "-115px" }}
              >
                <Dropdown.Header content={t("inbox.unread")} />
                {notificationsUnread.length > 0 &&
                  notificationsUnread.map((n) => (
                    <Dropdown.Item
                      id="itemMessageUnread"
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                    >
                      <div className="inboxMessage unread-message">
                        <p className="message-container">
                          <strong>{n.text.trim()}</strong>
                        </p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                {notificationsUnread.length === 0 && (
                  <Dropdown.Item id="itemMessage">
                    <div className="inboxMessage">
                      <p className="message-container">
                        {t("inbox.notNotifications")}
                      </p>
                    </div>
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Header content={t("inbox.read")} />
                {notificationsRead.length > 0 &&
                  notificationsRead.map((n) => (
                    <Dropdown.Item
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                      id="itemMessageRead"
                    >
                      <div
                        className={
                          this.isURLValid(n.url)
                            ? "inboxMessage readed-message"
                            : "inboxMessage readed-message normal-cursor"
                        }
                      >
                        <p className="message-container">{n.text.trim()}</p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Responsive>

        <Responsive minWidth={992}>
          <Menu.Item>
            <Popup
              open={this.state.openPopup}
              position="bottom center"
              size="small"
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header textAlign="center" as="h5">
                      {t("inbox.popupSafari.headerAuthSession")}
                    </Header>
                    <p>
                      <small>{t("inbox.popupSafari.messageAuthSession")}</small>
                    </p>
                    <Button
                      size="mini"
                      fluid
                      color="blue"
                      onClick={this.handleClickAcceptPermissionAudio}
                    >
                      {t("inbox.popupSafari.buttonAuthorize")}
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="justified">
                    <Header as="h6">
                      {t("inbox.popupSafari.headerAuthPermanent")}
                    </Header>
                    <p>
                      <small>
                        {t("inbox.popupSafari.messageAuthPermanent")}
                      </small>
                    </p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Popup>
            {countUnread > 0 && (
              <Label
                id="countUnreadInbox"
                circular
                floating
                className={
                  window.sessionStorage.getItem("userType") === "ADMIN"
                    ? "badgestyle-admin"
                    : "badgestyle"
                }
              >
                {countUnread}
              </Label>
            )}
            <Dropdown
              style={{
                marginLeft: window.innerWidth <= 364 ? -5 : 0,
                marginRight: window.innerWidth <= 364 ? -5 : 0,
              }}
              scrolling
              item
              text={
                <img
                  alt=""
                  src={
                    this.state.inboxMessageClient !== "GMB" &&
                    this.state.inboxMessageClient !== "BANCRIPT"
                      ? icon2
                      : icon3
                  }
                  style={{
                    height: 50,
                    marginBottom: window.innerWidth <= 364 ? "" : "-1px",
                    marginTop: window.innerWidth <= 364 ? "" : "1px",
                  }}
                />
              }
              icon={null}
              name="message"
            >
              <Dropdown.Menu
                position="center"
                size="medium"
                style={{ right: "-100px", left: "-115px" }}
              >
                <Dropdown.Header content={t("inbox.unread")} />
                {notificationsUnread.length > 0 &&
                  notificationsUnread.map((n) => (
                    <Dropdown.Item
                      id="itemMessageUnread"
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                    >
                      <div className="inboxMessage unread-message">
                        <p className="message-container">
                          <strong>{n.text.trim()}</strong>
                        </p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                {notificationsUnread.length === 0 && (
                  <Dropdown.Item id="itemMessage">
                    <div className="inboxMessage">
                      <p className="message-container">
                        {t("inbox.notNotifications")}
                      </p>
                    </div>
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Header content={t("inbox.read")} />
                {notificationsRead.length > 0 &&
                  notificationsRead.map((n) => (
                    <Dropdown.Item
                      key={n.id}
                      onClick={this.onClickMessage}
                      value={n.id}
                      id="itemMessageRead"
                    >
                      <div
                        className={
                          this.isURLValid(n.url)
                            ? "inboxMessage readed-message"
                            : "inboxMessage readed-message normal-cursor"
                        }
                      >
                        <p className="message-container">{n.text.trim()}</p>
                        <div className="date-message-align">
                          {this.formatDate(new Date(n.timestamp))}
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Responsive>
      </div>
    );
  }
}
export default translate(InboxMessage);
