import FormSellBitcoins from "./FormSellBitcoins/FormSellBitcoins";
import FormHistorySalesBitcoins from "./FormHistorySalesBitcoins/FormHistorySalesBitcoins";
import React, { Component } from "react";
import "./SellBitcoins.css";
import "react-table/react-table.css";
import {
  Menu,
  Grid,
  Header,
  Message,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import user from "../../services/user";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";
class SellBitcoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "sellBitcoins",
      isAuth: user.getUserAuth(),
      viewMessageEmail: false,
      emailSended: false,
      emailSendSuccess: false,
      show: false,
      statusVerificationUser: {
        A: false,
        B: false,
        C: false,
      },
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
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  redirectToSellHistory() {
    this.setState({ activeItem: "salesHistory" });
  }

  componentDidMount() {
    if (this.state.isAuth) {
      let username = user.getUserName();
      user.getConfigUserGeneral(username).then((resp) => {
        this.setState({
          show: true,
        });
        if (resp.data.result.verification === undefined) {
          this.emailVerify();
          this.setState({
            hasVerificationEmail: false,
            emailSendSuccess: true,
          });
          let status = {
            A: false,
            B: false,
            C: "UNINITIATED",
          };
          this.setState({ statusVerificationUser: status, show: true });
        } else {
          let a, b, c;
          if (resp.data.result.verification.A !== undefined) {
            a = true;
          } else {
            this.emailVerify();
            this.setState({
              hasVerificationEmail: false,
              emailSendSuccess: true,
            });
            a = false;
          }
          if (resp.data.result.verification.B !== undefined) {
            b = true;
          } else {
            b = false;
          }
          if (resp.data.result.verification.C !== undefined) {
            c = resp.data.result.verification.C.userVerificationStatus;
          } else {
            c = "UNINITIATED";
          }
          let status = {
            A: a,
            B: b,
            C: c,
          };
          this.setState({ statusVerificationUser: status });
        }
      });
    } else {
      this.setState({
        show: true,
      });
    }
  }
  emailVerify() {
    user.verifyUserInit(sessionStorage.getItem("email"));
    //console.log(sessionStorage.getItem("email"));
    this.setState({
      viewMessageEmail: true,
      emailSended: true,
    });
  }
  componentDidUpdate() {
    if (this.state.emailSended === true) {
      let username = user.getUserName();
      let userconfig = user.getConfigUserGeneral(username);
      userconfig
        .then((resp) => {
          if (resp.data.result.verification === undefined) {
            let status = {
              A: false,
              B: false,
              C: "UNINITIATED",
            };
            this.setState({ statusVerificationUser: status });
          } else {
            let a, b, c;
            if (resp.data.result.verification.A !== undefined) {
              a = true;

              this.setState({ emailSended: false });
            } else {
              a = false;
            }
            if (resp.data.result.verification.B !== undefined) {
              b = true;
            } else {
              b = false;
            }
            if (resp.data.result.verification.C !== undefined) {
              c = resp.data.result.verification.C.userVerificationStatus;
            } else {
              c = "UNINITIATED";
            }
            let status = {
              A: a,
              B: b,
              C: c,
            };
            this.setState({ statusVerificationUser: status });
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  }
  handleItemOther(e, data) {
    this.props.setView(data.name);
  }
  render() {
    let t = this.state.translator;
    const { activeItem, isAuth } = this.state;
    return (
      <div>
        <Dimmer.Dimmable dimmed={!this.state.show}>
          <Dimmer active={!this.state.show} inverted>
            <Loader>{t("sell.loading")}</Loader>
          </Dimmer>
          {!this.state.show && (
            <Segment>
              <p style={{ color: "white" }}>holaaaaaaa</p>
            </Segment>
          )}
          {/* {!isAuth && (
            <Header as="h5" textAlign="center">
              {t("sell.notAuth.part1")}{" "}
              <Link
                to="/login"
                name="login"
                onClick={this.handleItemOther.bind(this)}
              >
                {t("sell.notAuth.part2")}
              </Link>{" "}
              {t("sell.notAuth.part3")}{" "}
              <Link
                to="/registration"
                name="registration"
                onClick={this.handleItemOther.bind(this)}
              >
                {t("sell.notAuth.part4")}
              </Link>
              {t("sell.notAuth.part5")}
            </Header>
          )} */}
          {!this.state.statusVerificationUser.A &&
            this.state.show &&
            isAuth && (
              <Message
                info
                content={
                  t("sell.notVerifiedA.part1") +
                  sessionStorage.getItem("email") +
                  t("sell.notVerifiedA.part2")
                }
              />
            )}
          {isAuth && this.state.statusVerificationUser.A === true && (
            <Grid columns="equal" centered>
              <Grid.Column
                largeScreen={activeItem === "sellBitcoins" ? 13 : 16}
                mobile={16}
                tablet={14}
                computer={activeItem === "sellBitcoins" ? 14 : 16}
              >
                {isMobile && (
                  <Menu
                    pointing
                    secondary
                    style={{ borderColor: "white", marginLeft: 40 }}
                  >
                    <Menu.Item
                      content={t("sell.menu.sell")}
                      name="sellBitcoins"
                      active={activeItem === "sellBitcoins"}
                      onClick={this.handleItemClick}
                      style={
                        activeItem === "sellBitcoins" && isMobile
                          ? {
                              color: "#207ef2",
                              fontWeight: "bold",
                              borderColor: "#207ef2",
                            }
                          : {
                              color: isMobile ? "#207ef2" : "black",
                              fontWeight: "bold",
                              borderColor: "white",
                            }
                      }
                    />
                    <Menu.Item
                      content={t("sell.menu.mySells")}
                      name="salesHistory"
                      id="salesHistory"
                      active={activeItem === "salesHistory"}
                      onClick={this.handleItemClick}
                      style={
                        activeItem === "salesHistory" && isMobile
                          ? {
                              color: "#207ef2",
                              fontWeight: "bold",
                              borderColor: "#207ef2",
                            }
                          : {
                              color: isMobile ? "#207ef2" : "black",
                              fontWeight: "bold",
                              borderColor: "white",
                            }
                      }
                    />
                  </Menu>
                )}
                {!isMobile && (
                  <Menu pointing style={{ marginTop: 30 }}>
                    {" "}
                    <Menu.Item
                      content={t("sell.menu.sell")}
                      name="sellBitcoins"
                      active={activeItem === "sellBitcoins"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      content={t("sell.menu.mySells")}
                      name="salesHistory"
                      active={activeItem === "salesHistory"}
                      onClick={this.handleItemClick}
                    />
                  </Menu>
                )}
                {activeItem === "sellBitcoins" && (
                  <FormSellBitcoins
                    redirectToMySell={this.redirectToSellHistory.bind(this)}
                  />
                )}
                {activeItem === "salesHistory" && <FormHistorySalesBitcoins />}
              </Grid.Column>
            </Grid>
          )}
          {!isAuth && isMobile && (
            <FormSellBitcoins
              redirectToMySell={this.redirectToSellHistory.bind(this)}
            />
          )}
          {!isAuth && !isMobile && (
            <Grid columns="equal" centered>
              <Grid.Column
                largeScreen={activeItem === "sellBitcoins" ? 13 : 16}
                mobile={16}
                tablet={14}
                computer={activeItem === "sellBitcoins" ? 14 : 16}
              >
                <Menu
                  pointing={isMobile === true ? false : true}
                  size={isMobile === true ? "huge" : ""}
                  secondary={isMobile === true ? true : false}
                  style={{ marginTop: 30 }}
                >
                  <Menu.Item
                    content={t("sell.menu.sell")}
                    name="sellBitcoins"
                    active={activeItem === "sellBitcoins"}
                    onClick={this.handleItemClick}
                    style={
                      activeItem === "sellBitcoins" && isMobile
                        ? {
                            backgroundColor: "#207ef2",
                            color: "white",
                            fontWeight: "bold",
                          }
                        : { color: isMobile ? "grey" : "" }
                    }
                  />
                </Menu>

                {activeItem === "sellBitcoins" && (
                  <FormSellBitcoins
                    redirectToMySell={this.redirectToSellHistory.bind(this)}
                  />
                )}
              </Grid.Column>
            </Grid>
          )}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default translate(SellBitcoins);
