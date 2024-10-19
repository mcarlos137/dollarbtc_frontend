import React, { Component } from "react";
import "../Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../services/user";
import SendingBTCOutside from "../../Admin/BalancesAndOperations/SendingBTCOutside/SendingBTCOutside";
import LotSendToPaymentMethods from "../../Admin/ExternalSend/LotSendToPaymentMethods/LotSendToPaymentMethods";
import MoneyOrders from "../../Admin/ExternalSend/MoneyOrders/MoneyOrders";

class ExternalSend extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "sendingBTCOutside", actionsUser: [] };
  }
  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    // //console.log(availableFunctionsUser);
    if (availableFunctionsUser !== null) {
      this.setState({
        actionsUser: availableFunctionsUser.functionsAvailables,
      });
    }
    //  this.setState({ actionsUser: new Array() });
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <Container>
        <Menu size="large" pointing>
          {this.state.actionsUser.indexOf("external_send") !== -1 && (
            <Menu.Item
              content="Salidas Externas de Cryptos"
              name="sendingBTCOutside"
              active={this.state.activeItem === "sendingBTCOutside"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("external_send") !== -1 && (
            <Menu.Item
              content="Salidas en Lotes a Bancos"
              name="lotSendToPaymentMethods"
              active={this.state.activeItem === "lotSendToPaymentMethods"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("external_send") !== -1 && (
            <Menu.Item
              content="Entradas de Ordenes de Dinero"
              name="moneyOrders"
              active={this.state.activeItem === "moneyOrders"}
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        {this.state.activeItem === "sendingBTCOutside" && (
          <Segment color="orange">
            <Container as={SendingBTCOutside} />
          </Segment>
        )}
        {this.state.activeItem === "lotSendToPaymentMethods" && (
          <Segment color="orange">
            <Container as={LotSendToPaymentMethods} />
          </Segment>
        )}
         {this.state.activeItem === "moneyOrders" && (
          <Segment color="orange">
            <Container as={MoneyOrders} />
          </Segment>
        )}
      </Container>
    );
  }
}
export default ExternalSend;
