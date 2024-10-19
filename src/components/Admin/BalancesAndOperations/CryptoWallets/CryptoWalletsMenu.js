import React, { Component } from "react";
import userService from "../../../../services/user";
import { Container, Menu, Segment } from "semantic-ui-react";
import CryptoWalletsBalance from "./CryptoWalletsBalance/CryptoWalletsBalance";
import CreateAddressByCurrency from "./CreateAddressByCurrency/CreateAddressByCurrency";

class CryptoWalletsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "", actionsUser: [] };
  }
  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = "";
      if (arrayFunctions.indexOf("check_crypto_portfolios") !== -1) {
        nameItem = "cryptoWalletBalances";
      } else {
        nameItem = "createAddress";
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
        <Menu size="small" pointing secondary>
          {this.state.actionsUser.indexOf("check_crypto_portfolios") !== -1 && (
            <Menu.Item
              content="Consultar"
              name="cryptoWalletBalances"
              active={this.state.activeItem === "cryptoWalletBalances"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("create_crypto_portfolios") !==
            -1 && (
            <Menu.Item
              content="Crear"
              name="createAddress"
              active={this.state.activeItem === "createAddress"}
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        {this.state.activeItem === "createAddress" && (
          <Segment color="orange">
            <Container as={CreateAddressByCurrency} />
          </Segment>
        )}
        {this.state.activeItem === "cryptoWalletBalances" && (
          <Segment color="orange">
            <Container as={CryptoWalletsBalance} />
          </Segment>
        )}
      </Container>
    );
  }
}

export default CryptoWalletsMenu;
