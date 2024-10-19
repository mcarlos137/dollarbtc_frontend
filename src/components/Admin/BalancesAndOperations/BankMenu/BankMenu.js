import React, { Component } from "react";
import "../../Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../../services/user";
import CreatePaymentMethods from "../BankMenu/CreatePaymentMethods/CreatePaymentMethods";
import ListPaymentMethods from "../BankMenu/ListPaymentMethods/ListPaymentMethods";
import BalancePaymentMethods from "../BankMenu/BalancePaymentMethods/BalancePaymentMethods";
import AddUserPaymentMethod from "../BankMenu//AddUserPaymentMethod/AddUserPaymentMethod";

class BankMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      actionsUser: [],
    };
  }
  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = "";
      if (arrayFunctions.indexOf("edit_payment_methods") !== -1) {
          nameItem = "listPaymentMethods";
      } else {
        if (arrayFunctions.indexOf("consult_balance") !== -1) {
           nameItem = "balancePaymentMethods";
        } else {
          nameItem = "createPaymentMethods";
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
        <Menu size="small" pointing secondary>
          {/* {this.state.actionsUser.indexOf("balance_payments_add") !== -1 && (
            <Menu.Item
              content="Crear medio de pago"
              name="createPaymentMethods"
              active={this.state.activeItem === "createPaymentMethods"}
              onClick={this.handleItemClick}
            />
          )}
          <Menu.Item
            content="Consultar medios de pago"
            name="listPaymentMethods"
            active={this.state.activeItem === "listPaymentMethods"}
            onClick={this.handleItemClick}
          /> */}
         
          {this.state.actionsUser.indexOf("edit_payment_methods") !== -1 && (
            <Menu.Item
              content="Consultar medios de pago"
              name="listPaymentMethods"
              active={this.state.activeItem === "listPaymentMethods"}
              onClick={this.handleItemClick}
            />
          )}
          {/* <Menu.Item
            content="Consultar movimientos"
            name="listPaymentMovements"
            active={this.state.activeItem === "listPaymentMovements"}
            onClick={this.handleItemClick}
          /> */}
          {this.state.actionsUser.indexOf("consult_balance") !== -1 && (
            <Menu.Item
              content="Consultar balances"
              name="balancePaymentMethods"
              active={this.state.activeItem === "balancePaymentMethods"}
              onClick={this.handleItemClick}
            />
          )}
           {this.state.actionsUser.indexOf("create_means_of_payment") !== -1 && (
            <Menu.Item
              content="Crear medio de pago"
              name="createPaymentMethods"
              active={this.state.activeItem === "createPaymentMethods"}
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        <Segment color="orange">
          {this.state.activeItem === "createPaymentMethods" && (
            <Container as={CreatePaymentMethods} />
          )}
          {this.state.activeItem === "listPaymentMethods" && (
            <Container as={ListPaymentMethods} />
          )}
          {this.state.activeItem === "balancePaymentMethods" && (
            <Container as={BalancePaymentMethods} />
          )}
          {this.state.activeItem === "addUserPaymentMethod" && (
            <Container as={AddUserPaymentMethod} />
          )}
          {/* {this.state.activeItem === "listPaymentMovements" && (
            <Container as={ListPaymentMovements} />
          )} */}
        </Segment>
      </Container>
    );
  }
}

export default BankMenu;
