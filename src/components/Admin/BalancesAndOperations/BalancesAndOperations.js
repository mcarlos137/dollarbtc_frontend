import React, { Component } from "react";
import "../Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../services/user";
import UserBalance from "../Users/UserBalance/UserBalance";
import ProfileBalance from "../Users/ProfileBalance/ProfileBalance";
import CurrencyConfigMenu from "../CurrencyConfigMenu/CurrencyConfigMenu";
import OTCAccounts from "../../Admin/BalancesAndOperations/OTCAccounts/OTCAccounts";
import MenuOtcAccounts from "../../Admin/BalancesAndOperations/OTCAccounts/MenuOtcAccounts";
//import SendingBTCOutside from "../../Admin/BalancesAndOperations/SendingBTCOutside/SendingBTCOutside";
import MasterAccountMenu from "../../Admin/BalancesAndOperations/MasterAccountMenu/MasterAccountMenu";
import BankMenu from "../BalancesAndOperations/BankMenu/BankMenu";
import CryptoWalletsMenu from "./CryptoWallets/CryptoWalletsMenu";

class BalancesAndOperations extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "", actionsUser: [] };
  }
  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = "";
      if (
        arrayFunctions.indexOf("consult_master_accounts") !== -1 ||
        arrayFunctions.indexOf("otc_account_configuration") !== -1
      ) {
        nameItem = "masterAccounts";
      } else {
        if (
          arrayFunctions.indexOf("otc_account_transactions") !== -1 ||
          arrayFunctions.indexOf("send_bitcoins") !== -1 ||
          arrayFunctions.indexOf("receive_bitcoins") !== -1 ||
          arrayFunctions.indexOf("consult_operations_report") !== -1
        ) {
          nameItem = "otcAccounts";
        } else {
          if (
            arrayFunctions.indexOf("create_means_of_payment") !== -1 ||
            arrayFunctions.indexOf("edit_payment_methods") !== -1 ||
            arrayFunctions.indexOf("consult_balance") !== -1
          ) {
            nameItem = "banks";
          } else {
            nameItem = "cryptoWallets";
          }
        }
      }
      this.setState({
        actionsUser: arrayFunctions,
        activeItem: nameItem,
      });
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <Container>
        <Menu size="large" pointing>
          {(this.state.actionsUser.indexOf("consult_master_accounts") !== -1 ||
            this.state.actionsUser.indexOf("otc_account_configuration") !==
              -1) && (
            <Menu.Item
              content="Cuentas maestras"
              name="masterAccounts"
              active={this.state.activeItem === "masterAccounts"}
              onClick={this.handleItemClick}
            />
          )}
          {(this.state.actionsUser.indexOf("otc_account_transactions") !== -1 ||
            this.state.actionsUser.indexOf("send_bitcoins") !== -1 ||
            this.state.actionsUser.indexOf("receive_bitcoins") !== -1 ||
            this.state.actionsUser.indexOf("consult_operations_report") !==
              -1) && (
            <Menu.Item
              content="Cuentas OTC"
              name="otcAccounts"
              active={this.state.activeItem === "otcAccounts"}
              onClick={this.handleItemClick}
            />
          )}
          {(this.state.actionsUser.indexOf("create_means_of_payment") !== -1 ||
            this.state.actionsUser.indexOf("edit_payment_methods") !== -1 ||
            this.state.actionsUser.indexOf("consult_balance") !== -1) && (
            <Menu.Item
              content="Medios de pago"
              name="banks"
              active={this.state.activeItem === "banks"}
              onClick={this.handleItemClick}
            />
          )}
          {(this.state.actionsUser.indexOf("create_crypto_portfolios") !== -1 ||
            this.state.actionsUser.indexOf("check_crypto_portfolios") !==
              -1) && (
            <Menu.Item
              content="Crypto Carteras"
              name="cryptoWallets"
              active={this.state.activeItem === "cryptoWallets"}
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        {this.state.activeItem === "currencyConfig" && (
          <Container as={CurrencyConfigMenu} />
        )}
        {this.state.activeItem === "userBalance" && (
          <Segment color="orange">
            <Container as={UserBalance} />
          </Segment>
        )}
        {this.state.activeItem === "userProfiles" && (
          <Segment color="orange">
            <Container as={ProfileBalance} />
          </Segment>
        )}
        {this.state.activeItem === "otcAccounts" && (
          <Segment color="orange">
            <Container as={MenuOtcAccounts} />
          </Segment>
        )}
        {this.state.activeItem === "banks" && <Container as={BankMenu} />}
        {this.state.activeItem === "masterAccounts" && (
          <Container as={MasterAccountMenu} />
        )}
        {this.state.activeItem === "cryptoWallets" && (
          <Container as={CryptoWalletsMenu} />
        )}
      </Container>
    );
  }
}
export default BalancesAndOperations;
