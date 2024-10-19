import React, { Component } from "react";
import {
  Button,
  Header,
  Segment,
  Grid,
  Menu,
  Modal,
  Message,
  Dimmer,
  Loader,
  Responsive,
  Divider,
  Container,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import userAPI from "../../services/user";
import ShoppingHistory from "./FormHistoryBuyBitcoins/FormHistoryBuyBitcoins";
import FormProcessBuyBitCoin from "./FormProcessBuyBitcoin/FormProcessBuyBitCoin";
import FormBuyBitCoin from "./FormBuyBitcoin/FormBuyBitcoin";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";
class BuyBitcoins extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      activeItem: "buyBitcoins",
      withDinamicLargeScreen: 14,
      withDinamicTable: 14,
      show: false,
      windowInitial: true,
      message: "",
      configUser: null,
      isAuth: userAPI.getUserAuth(),
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
  handleItemClick(e, data) {
    //console.log(data, this._isMounted);
    if (this._isMounted) {
      this.setState({
        activeItem: data.name,
        withDinamicLargeScreen: data.name === "buyBitcoins" ? 13 : 16,
        withDinamicTable: data.name === "buyBitcoins" ? 14 : 16,
      });
      if (data.name === "buyBitcoins") {
        window.open("/buy", "_self");
      }
    }
  }
  handleItemClickMobile(e, data) {
    //console.log(data, this._isMounted);
    if (this._isMounted) {
      this.setState({
        activeItem: data.name,
      });
    }
  }
  redirectToBuy() {
    // var uri = window.location.toString();
    // if (uri.indexOf("?") > 0) {
    //   var clean_uri = uri.substring(0, uri.indexOf("?"));
    //   window.history.replaceState({}, document.title, clean_uri);
    // }
    this.setState({
      activeItem: "shoppingHistory",
      withDinamicLargeScreen: 16,
      withDinamicTable: 16,
    });
  }
  componentDidMount() {
    this._isMounted = true;
    let username = userAPI.getUserName();
    if (username !== null) {
      userAPI.getConfigUserGeneral(username).then((resp) => {
        this.setState({
          configUser: resp.data.result,
          show: true,
        });
      });
    }
  }
  closeSendConfirm() {
    this.setState({
      windowInitial: false,
    });
  }
  handleItemOther(e, data) {
    this.props.setView(data.name);
  }
  render() {
    let activeItem = this.state.activeItem;
    let t = this.state.translator;
    return (
      <div>
        <Responsive minWidth={992}>
          {!userAPI.getUserAuth() && (
            // <Header as="h5" textAlign="center">
            //   {t("buy.notAuth.part1")}
            //   <Link
            //     name="login"
            //     onClick={this.handleItemOther.bind(this)}
            //     to="/login"
            //   >
            //     {t("buy.notAuth.part2")}
            //   </Link>
            //   {t("buy.notAuth.part3")}
            //   <Link
            //     onClick={this.handleItemOther.bind(this)}
            //     name="registration"
            //     to="/registration"
            //   >
            //     {t("buy.notAuth.part4")}
            //   </Link>
            //   {t("buy.notAuth.part5")}
            // </Header>
            <Grid columns="equal" centered>
              <Grid.Column
                largeScreen={activeItem === "buyBitcoins" ? 13 : 16}
                mobile={16}
                tablet={14}
                computer={activeItem === "buyBitcoins" ? 14 : 16}
              >
                <Menu pointing style={{ marginTop: 30 }}>
                  <Menu.Item
                    content={t("buy.menu.buy")}
                    name="buyBitcoins"
                    active={activeItem === "buyBitcoins"}
                    onClick={this.handleItemClick.bind(this)}
                  />
                </Menu>

                {activeItem === "buyBitcoins" && (
                  <FormBuyBitCoin
                    handleItemClick={this.redirectToBuy.bind(this)}
                  />
                )}
              </Grid.Column>
            </Grid>
          )}
          <Dimmer.Dimmable dimmed={userAPI.getUserAuth() && !this.state.show}>
            <Dimmer active={userAPI.getUserAuth() && !this.state.show} inverted>
              <Loader>{t("buy.loading")}</Loader>
            </Dimmer>
            {!this.state.show && userAPI.getUserAuth() && (
              <Segment>
                <p style={{ color: "white" }}>holaaaaaaa</p>
              </Segment>
            )}
            {userAPI.getUserAuth() && this.state.show && (
              <div>
                <Grid columns="equal" centered>
                  <Grid.Column
                    largeScreen={activeItem === "buyBitcoins" ? 13 : 16}
                    mobile={16}
                    tablet={14}
                    computer={activeItem === "buyBitcoins" ? 14 : 16}
                  >
                    <Menu pointing style={{ marginTop: 30 }}>
                      <Menu.Item
                        content={t("buy.menu.buy")}
                        name="buyBitcoins"
                        active={activeItem === "buyBitcoins"}
                        onClick={this.handleItemClick.bind(this)}
                      />
                      <Menu.Item
                        content={t("buy.menu.myBuys")}
                        name="shoppingHistory"
                        active={activeItem === "shoppingHistory"}
                        onClick={this.handleItemClick.bind(this)}
                      />
                    </Menu>
                    {activeItem === "buyBitcoins" &&
                      this.state.configUser !== null && (
                        <FormProcessBuyBitCoin
                          configUser={this.state.configUser}
                          handleItemClick={this.redirectToBuy.bind(this)}
                        />
                      )}
                    {activeItem === "shoppingHistory" && <ShoppingHistory />}
                  </Grid.Column>
                </Grid>
              </div>
            )}
            {userAPI.getUserAuth() &&
              this.state.configUser !== null &&
              typeof this.state.configUser.verification !== "undefined" &&
              typeof this.state.configUser.verification.C === "undefined" && (
                <Modal
                  open={this.state.windowInitial}
                  onClose={this.closeSendConfirm.bind(this)}
                  className="BuyBitcoins"
                >
                  <Modal.Header>{t("buy.modalNotVerify.header")}</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <Message
                        info
                        content={t("buy.modalNotVerify.notVerifiedA")}
                      />
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="blue"
                      onClick={this.closeSendConfirm.bind(this)}
                    >
                      {t("buy.modalNotVerify.buttonClose")}
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
          </Dimmer.Dimmable>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          {!userAPI.getUserAuth() && (
            <Grid columns="equal" centered>
              <Grid.Column
                largeScreen={16}
                mobile={16}
                tablet={16}
                computer={16}
              >
                <FormBuyBitCoin
                  handleItemClick={this.redirectToBuy.bind(this)}
                />
              </Grid.Column>
            </Grid>
          )}
          <Dimmer.Dimmable dimmed={userAPI.getUserAuth() && !this.state.show}>
            <Dimmer active={userAPI.getUserAuth() && !this.state.show} inverted>
              <Loader>{t("buy.loading")}</Loader>
            </Dimmer>
            {!this.state.show && userAPI.getUserAuth() && (
              <Segment>
                <p style={{ color: "white" }}></p>
              </Segment>
            )}
            {userAPI.getUserAuth() && this.state.show && (
              <div>
                <Grid columns="equal" centered>
                  <Grid.Column
                    largeScreen={activeItem === "buyBitcoins" ? 13 : 16}
                    mobile={16}
                    tablet={14}
                    computer={activeItem === "buyBitcoins" ? 14 : 16}
                  >
                    {/* <Menu pointing>
                    <Menu.Item
                      content={t("buy.menu.buy")}
                      name="buyBitcoins"
                      active={activeItem === "buyBitcoins"}
                      onClick={this.handleItemClick.bind(this)}
                    />
                    <Menu.Item
                      content={t("buy.menu.myBuys")}
                      name="shoppingHistory"
                      active={activeItem === "shoppingHistory"}
                      onClick={this.handleItemClick.bind(this)}
                    />
                  </Menu>  */}

                    <Menu
                      icon
                      size={isMobile === true ? "small" : "huge"}
                      secondary={isMobile === true ? true : false}
                      style={{
                        borderColor: "white",
                        marginLeft: 20,
                        marginLeft: 60,
                      }}
                      pointing
                    >
                      <Menu.Item
                        content={t("buy.menu.buy")}
                        name="buyBitcoins"
                        style={
                          activeItem === "buyBitcoins" && isMobile
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
                        active={activeItem === "buyBitcoins"}
                        onClick={
                          isMobile && this.handleItemClickMobile.bind(this)
                        }
                      ></Menu.Item>
                      <Menu.Item
                        content={t("buy.menu.myBuys")}
                        name="shoppingHistory"
                        style={
                          activeItem === "shoppingHistory" && isMobile
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
                        active={activeItem === "shoppingHistory"}
                        onClick={this.handleItemClick.bind(this)}
                      ></Menu.Item>
                    </Menu>

                    {activeItem === "buyBitcoins" &&
                      this.state.configUser !== null && (
                        <FormProcessBuyBitCoin
                          configUser={this.state.configUser}
                          handleItemClick={this.redirectToBuy.bind(this)}
                        />
                      )}
                    {activeItem === "shoppingHistory" && <ShoppingHistory />}
                  </Grid.Column>
                </Grid>
              </div>
            )}
            {userAPI.getUserAuth() &&
              this.state.configUser !== null &&
              typeof this.state.configUser.verification !== "undefined" &&
              typeof this.state.configUser.verification.C === "undefined" && (
                <Modal
                  open={this.state.windowInitial}
                  onClose={this.closeSendConfirm.bind(this)}
                  className="BuyBitcoins"
                >
                  <Modal.Header>{t("buy.modalNotVerify.header")}</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <Message
                        info
                        content={t("buy.modalNotVerify.notVerifiedA")}
                      />
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="blue"
                      onClick={this.closeSendConfirm.bind(this)}
                    >
                      {t("buy.modalNotVerify.buttonClose")}
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
          </Dimmer.Dimmable>
        </Responsive>
      </div>
    );
  }
}
export default translate(BuyBitcoins);
