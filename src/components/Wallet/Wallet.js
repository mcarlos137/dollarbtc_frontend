import React, { Component } from "react";
import "./Wallet.css";
import { Menu, Segment, Responsive ,Divider} from "semantic-ui-react";
import "react-table/react-table.css";
import translate from "../../i18n/translate";
import SendBitcoins from "./SendBitcoins";
import Transactions from "./Transactions";
import ReceiveBitcoins from "./ReceiveBitcoins";
import MenuTransactions from "./MenuTransactions";
import { isMobile } from "react-device-detect";
class Wallet extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      activeItem: "transactions",
      miniMenu: false,
      translator: props.translate,
    };
  }
  /* state = { activeItem: "sendBitcoins",miniMenu:false };*/
  componentWillReceiveProps(nextProps, nextContext)
  {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount()
  {
    if (window.innerWidth < 640) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleChangeScreen(e, data)
  {
    if (data.width < 640) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  render()
  {
    //console.log(this.props);
    let t = this.state.translator;
    let menu;
    const { activeItem } = this.state;
    if (!this.state.miniMenu) {
      menu = (
        <Menu pointing>
          <Menu.Item
            style={{ fontSize: window.innerWidth <= 364 ? 15 : "" }}
            content={t("wallet.menu.tx")}
            name="transactions"
            active={activeItem === "transactions"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content={t("wallet.menu.send")}
            name="sendBitcoins"
            active={activeItem === "sendBitcoins"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content={t("wallet.menu.receive")}
            name="receiveBitcoins"
            active={activeItem === "receiveBitcoins"}
            onClick={this.handleItemClick}
          />
        </Menu>
      );
    } else {
      menu = (
        <Menu
          icon
          // pointing={isMobile === true ? false : true}
          // size={isMobile === true ? "huge" : "huge"}
          // secondary={isMobile === true ? true : false}
          // style={{ marginTop: 50 }}
          // widths={isMobile ? 3 : ""}
          pointing
          secondary
          style={isMobile ? { borderColor: "white", marginLeft: 40 } : {}}
        >
          <Menu.Item
            style={{ fontSize: window.innerWidth <= 364 ? 15 : "" }}
            content={t("wallet.menuMobile.tx")}
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
            content={t("wallet.menuMobile.send")}
            name="sendBitcoins"
            style={
              activeItem === "sendBitcoins" && isMobile
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
            active={activeItem === "sendBitcoins"}
            onClick={this.handleItemClick}
          >
            {/* <Icon name="external square alternate" color="blue" />*/}
          </Menu.Item>
          <Menu.Item
            content={t("wallet.menuMobile.receive")}
            name="receiveBitcoins"
            id="receiveBitcoins"
            style={
              activeItem === "receiveBitcoins" && isMobile
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
            active={activeItem === "receiveBitcoins"}
            onClick={this.handleItemClick}
          >
            {/*<Icon name="in cart" color="blue" />*/}
          </Menu.Item>
        </Menu>
      );
    }
    return (
      <Responsive onUpdate={this.handleChangeScreen.bind(this)}>
        {window.innerWidth <= 800 &&(
          <div>
          <Divider hidden></Divider>
          </div>
        )}
        
        {menu}
        <Segment color={isMobile ? "" : "orange"} basic={isMobile}>
          {activeItem === "sendBitcoins" && (
            <SendBitcoins token={this.props.token} />
          )}
          {activeItem === "receiveBitcoins" && <ReceiveBitcoins />}
          {activeItem === "transactions" && <MenuTransactions />}
        </Segment>
      </Responsive>
    );
  }
}
export default translate(Wallet);
