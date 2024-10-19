import React, { Component } from "react";
import translate from "../../../i18n/translate";
import { Header, Menu, Segment, Divider } from "semantic-ui-react";
import OptionSecurity from "../OptionSecurity/OptionSecurity";
import Devices from "../Devices/Devices";
import { isMobile } from "react-device-detect";
class OptionAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "security",
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
            {t("profile.optionAccount.header")}
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
              {t("profile.optionAccount.header")}
            </Header>
            <Divider style={{ marginTop: -10, borderColor: "#207ef2" }} />
          </div>
        )}

        {!isMobile && (
          <div>
          <Menu attached="top" tabular>
            <Menu.Item
              name="security"
              content={t("profile.optionAccount.menu.security")}
              active={active === "security"}
              onClick={this.handleItemClick.bind(this)}
            />
            <Menu.Item
              content={t("profile.optionAccount.menu.devices")}
              name="list-devices"
              active={active === "list-devices"}
              onClick={this.handleItemClick.bind(this)}
            />
          </Menu>
          <Segment basic>
            {this.state.active === "security" && (
              <OptionSecurity changeItem={this.props.changeItem} />
            )}
            {this.state.active === "list-devices" && (
              <Devices changeItem={this.props.changeItem} />
            )}
          </Segment>
        </div>
        )}  
        {isMobile && (
          <div>
          <Menu secondary size={isMobile ? "small":"huge"}  style={isMobile ? {borderColor:"white",marginLeft:20 ,marginLeft:60}:{} } pointing={isMobile}>
            <Menu.Item
              name="security"
              content={t("profile.optionAccount.menu.security")}
              active={active === "security"}
              onClick={this.handleItemClick.bind(this)}
              style={
                active === "security" && isMobile
                  ? {
                      color: "#207ef2",
                      fontWeight: "bold",
                      borderColor:"#207ef2"
                    }
                  : {
                      color: isMobile ? "#207ef2" : "black",
                      fontWeight: "bold",
                      borderColor:"white"
                     
                    }
              }
            />
            <Menu.Item
              content={t("profile.optionAccount.menu.devices")}
              name="list-devices"
              active={active === "list-devices"}
              onClick={this.handleItemClick.bind(this)}
              style={
                active === "list-devices" && isMobile
                  ? {
                      color: "#207ef2",
                      fontWeight: "bold",
                      borderColor:"#207ef2"
                    }
                  : {
                      color: isMobile ? "#207ef2" : "black",
                      fontWeight: "bold",
                      borderColor:"white"
                     
                    }
              }
            />
          </Menu>
          <Segment basic>
            {this.state.active === "security" && (
              <OptionSecurity changeItem={this.props.changeItem} />
            )}
            {this.state.active === "list-devices" && (
              <Devices changeItem={this.props.changeItem} />
            )}
          </Segment>
        </div>
        )}   

        {/* <div>
          <Menu attached="top" tabular>
            <Menu.Item
              name="security"
              content={t("profile.optionAccount.menu.security")}
              active={active === "security"}
              onClick={this.handleItemClick.bind(this)}
            />
            <Menu.Item
              content={t("profile.optionAccount.menu.devices")}
              name="list-devices"
              active={active === "list-devices"}
              onClick={this.handleItemClick.bind(this)}
            />
          </Menu>
          <Segment basic>
            {this.state.active === "security" && (
              <OptionSecurity changeItem={this.props.changeItem} />
            )}
            {this.state.active === "list-devices" && (
              <Devices changeItem={this.props.changeItem} />
            )}
          </Segment>
        </div> */}
      </Segment>
    );
  }
}

export default translate(OptionAccount);
