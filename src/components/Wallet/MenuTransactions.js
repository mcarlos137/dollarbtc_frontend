import React, { Component } from "react";
import "./Wallet.css";
import { Menu, Segment, Responsive } from "semantic-ui-react";
import "react-table/react-table.css";
import translate from "../../i18n/translate";
import Transactions from "./Transactions";
import UsdTransactions from "./UsdTransactions";
import { isMobile } from "react-device-detect";
class MenuTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "transactions",
      miniMenu: false,
      translator: props.translate,
    };
  }
  /* state = { activeItem: "sendBitcoins",miniMenu:false };*/
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    if (window.innerWidth < 640) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleChangeScreen(e, data) {
    if (data.width < 640) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  render() {
    let t = this.state.translator;
    let menu;
    const { activeItem } = this.state;
    if (!this.state.miniMenu) {
      menu = (
        <Menu pointing secondary>
          <Menu.Item
            style={{ fontSize: window.innerWidth <= 364 ? 15 : "" }}
            content={t("wallet.menu.btc_tx")}
            name="transactions"
            active={activeItem === "transactions"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content={t("wallet.menu.usd_tx")}
            name="usdtransactions"
            active={activeItem === "usdtransactions"}
            onClick={this.handleItemClick}
          />
        </Menu>
      );
    } else {
      menu = (
        <Menu
          icon
          pointing
          // pointing={isMobile === true ? false : true}
          // size={isMobile === true ? "huge" : "huge"}
          // secondary={isMobile === true ? true : false}
          // style={{ marginTop: 50 }}
          // widths={isMobile ? 3 : ""}

          secondary
          style={isMobile ? { borderColor: "white", marginLeft: 40 } : {}}
        >
          <Menu.Item
            style={{ fontSize: window.innerWidth <= 364 ? 15 : "" }}
            content={t("wallet.menuMobile.btc_tx")}
            name="transactions"
            style={
              activeItem === "transactions" && isMobile
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
            active={activeItem === "transactions"}
            onClick={this.handleItemClick}
          >
            {/*<Icon name="exchange" color="blue" />*/}
          </Menu.Item>
          <Menu.Item
            content={t("wallet.menuMobile.usd_tx")}
            name="usdtransactions"
            style={
              activeItem === "usdtransactions" && isMobile
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
            active={activeItem === "usdtransactions"}
            onClick={this.handleItemClick}
          >
            {/* <Icon name="external square alternate" color="blue" />*/}
          </Menu.Item>
        </Menu>
      );
    }
    return (
      <Responsive onUpdate={this.handleChangeScreen.bind(this)}>
        {menu}
        <Segment basic>
          {activeItem === "usdtransactions" && <UsdTransactions />}
          {activeItem === "transactions" && <Transactions />}
        </Segment>
      </Responsive>
    );
  }
}
export default translate(MenuTransactions);
