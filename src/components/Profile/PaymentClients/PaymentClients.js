import React, { Component } from "react";
import WalletAccount from "../WalletAccount/WalletAccount";
import ListAccount from "../ListAccount/ListAccount";
import ListAccountOther from "../ListAccountOther/ListAccountOther";
import { Segment, Menu } from "semantic-ui-react";
import translate from "../../../i18n/translate";
class PaymentClients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "wallet",
      translator: props.translate
    };
  }
  handleItemClick(id, data) {
    this.setState({ active: data.name });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  render() {
    let t = this.state.translator;
    let active = this.state.active;
    return (
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
          />
          <Menu.Item
            content={t("profile.optionCurrent.menu.other")}
            name="list-other"
            active={active === "list-other"}
            onClick={this.handleItemClick.bind(this)}
          />
        </Menu>
        <Segment color="orange">
          {this.state.active === "wallet" && <WalletAccount />}
          {this.state.active === "list-holder" && <ListAccount />}
          {this.state.active === "list-other" && <ListAccountOther />}
        </Segment>
      </div>
    );
  }
}

export default translate(PaymentClients);
