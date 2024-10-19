import React, { Component } from "react";
import { Segment, Menu, Header, Divider } from "semantic-ui-react";

import WalletAccount from "../WalletAccount/WalletAccount";
import ListAccount from "../ListAccount/ListAccount";
import ListAccountOther from "../ListAccountOther/ListAccountOther";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
class OptionCurren extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.activeItem,
      translator: props.translate
    };
    this._Mounted = false;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    this._Mounted = true;
  }

  handleItemClick(id, data) {
    this.setState({ active: data.name });
  }
  handleChangeItem(data) {
    this.setState({ active: data });
  }
  componentWillUnmount() {
    this._Mounted = false;
  }
  render() {
    let t = this.state.translator;
    let active = this.state.active;
    let mount = this._Mounted;
    return (
      <Segment color={!isMobile ? "orange" : ""} basic={isMobile}>
        {!isMobile && (
          <Header textAlign="center">
            {t("profile.optionCurrent.paymentMethods")}
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
              {t("profile.optionCurrent.paymentMethods")}
            </Header>
            <Divider style={{ marginTop: -10, borderColor: "#207ef2" }} />
          </div>
        )}
        {/* <div>
          <Menu attached="top" tabular>
            <Menu.Item
              name="wallet"
              content={t("profile.optionCurrent.menu.wallet")}
              active={active === "wallet"}
              onClick={this.handleItemClick.bind(this)}
            />
            <Menu.Item
              content={t("profile.optionCurrent.menu.holder")}
              name="list-holder"
              active={active === "list-holder"}
              onClick={this.handleItemClick.bind(this)}
              style={{
                maxWidth: window.innerWidth <= 430 ? 90 : "",
                padding: window.innerWidth <= 430 ? 5 : "",
                textAlign: "center"
              }}
            />
            <Menu.Item
              content={t("profile.optionCurrent.menu.other")}
              name="list-other"
              active={active === "list-other"}
              onClick={this.handleItemClick.bind(this)}
              style={{
                maxWidth: window.innerWidth <= 430 ? 90 : "",
                padding: window.innerWidth <= 430 ? 5 : "",
                textAlign: "center"
              }}
            />
          </Menu>
          <Segment basic>
            {this.state.active === "wallet" && <WalletAccount />}
            {this.state.active === "list-holder" && (
              <ListAccount
                changeItem={this.props.changeItem}
                cancel={this.handleChangeItem.bind(this)}
                changeItemTwo={this.props.changeItemTwo}
              />
            )}
            {this.state.active === "list-other" && (
              <ListAccountOther changeItem={this.props.changeItemTwo} />
            )}
          </Segment>
        </div> */}
        {!isMobile && (
          <div>
          <Menu attached="top" tabular>
            <Menu.Item
              name="wallet"
              content={t("profile.optionCurrent.menu.wallet")}
              active={active === "wallet"}
              onClick={this.handleItemClick.bind(this)}
            />
            <Menu.Item
              content={t("profile.optionCurrent.menu.holder")}
              name="list-holder"
              active={active === "list-holder"}
              onClick={this.handleItemClick.bind(this)}
              style={{
                maxWidth: window.innerWidth <= 430 ? 90 : "",
                padding: window.innerWidth <= 430 ? 5 : "",
                textAlign: "center"
              }}
            />
            <Menu.Item
              content={t("profile.optionCurrent.menu.other")}
              name="list-other"
              active={active === "list-other"}
              onClick={this.handleItemClick.bind(this)}
              style={{
                maxWidth: window.innerWidth <= 430 ? 90 : "",
                padding: window.innerWidth <= 430 ? 5 : "",
                textAlign: "center"
              }}
            />
          </Menu>
          <Segment basic>
            {this.state.active === "wallet" && <WalletAccount />}
            {this.state.active === "list-holder" && (
              <ListAccount
                changeItem={this.props.changeItem}
                cancel={this.handleChangeItem.bind(this)}
                changeItemTwo={this.props.changeItemTwo}
              />
            )}
            {this.state.active === "list-other" && (
              <ListAccountOther changeItem={this.props.changeItemTwo} />
            )}
          </Segment>
        </div>
        )}
         {isMobile && (
          <div>
          <Menu icon secondary pointing size={isMobile ? "small":"huge"} style={{borderColor:"white"}}>
            <Menu.Item
              name="wallet"
              // content={t("profile.optionCurrent.menuMobile.wallet")}
              active={active === "wallet"}
              onClick={this.handleItemClick.bind(this)}
              style={
                active === "wallet"
                  ? { color: "#207ef2",
                  fontWeight: "bold",
                  borderColor:"#207ef2",height:60 , width:70}
                  : {
                    color: isMobile ? "#207ef2" : "black",
                    fontWeight: "bold",
                    borderColor:"white",height:60 , width:70
                    }
              }
            >
              <p>{t("profile.optionCurrent.menu.wallet")}</p>
            </Menu.Item>
            <Menu.Item
              // content={t("profile.optionCurrent.menuMobile.holder")}
              name="list-holder"
              active={active === "list-holder"}
              onClick={this.handleItemClick.bind(this)}
              // style={{
              //   maxWidth: window.innerWidth <= 430 ? 90 : "",
              //   padding: window.innerWidth <= 430 ? 5 : "",
              //   textAlign: "center"
              // }}
              style={
                active === "list-holder"
                  ? { color: "#207ef2",
                  fontWeight: "bold",
                  borderColor:"#207ef2",height:60 , width:110,marginLeft:10}
                  : {
                    color: isMobile ? "#207ef2" : "black",
                    fontWeight: "bold",
                    borderColor:"white",height:60 , width:110,marginLeft:10
                    }
              }> 
              <p style={active === "list-holder"
                  ? { color: "#207ef2",
                  fontWeight: "bold",
                  borderColor:"#207ef2",height:60 , width:110,marginLeft:-10,marginTop:10}
                  : {
                    color: isMobile ? "#207ef2" : "black",
                    fontWeight: "bold",
                    borderColor:"white",height:60 , width:110,marginLeft:-10,marginTop:10
                    }
              }>{t("profile.optionCurrent.menuMobile.holder")}</p>
              </Menu.Item>
            <Menu.Item
              // content={t("profile.optionCurrent.menuMobile.other")}
              name="list-other"
              active={active === "list-other"}
              onClick={this.handleItemClick.bind(this)}
              // style={{
              //   maxWidth: window.innerWidth <= 430 ? 90 : "",
              //   padding: window.innerWidth <= 430 ? 5 : "",
              //   textAlign: "center"
              // }}
              style={
                active === "list-other"
                  ? { color: "#207ef2",
                  fontWeight: "bold",
                  borderColor:"#207ef2",height:60 , width:105,marginLeft:10,marginRigth:-100}
                  : {
                    color: isMobile ? "#207ef2" : "black",
                    fontWeight: "bold",
                    borderColor:"white",height:60 , width:105,marginLeft:10,marginRigth:-100
                    }
              }
            >
              <p style={active === "list-other"
                  ? { color: "#207ef2",
                  fontWeight: "bold",
                  borderColor:"#207ef2",height:60 , width:105,marginLeft:-10,marginTop:10}
                  : {
                    color: isMobile ? "#207ef2" : "black",
                    fontWeight: "bold",
                    borderColor:"white",height:60 , width:105,marginLeft:-10,marginTop:10
                    }
              }>{t("profile.optionCurrent.menuMobile.other")}</p>
              </Menu.Item>
          </Menu>
          <Segment basic>
            {this.state.active === "wallet" && <WalletAccount />}
            {this.state.active === "list-holder" && (
              <ListAccount
                changeItem={this.props.changeItem}
                cancel={this.handleChangeItem.bind(this)}
                changeItemTwo={this.props.changeItemTwo}
              />
            )}
            {this.state.active === "list-other" && (
              <ListAccountOther changeItem={this.props.changeItemTwo} />
            )}
          </Segment>
        </div>
        )}
      </Segment>
    );
  }
}
export default translate(OptionCurren);
