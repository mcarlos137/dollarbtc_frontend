import React, { Component } from "react";
import "./Admin.css";
import {
  Menu
} from "semantic-ui-react";
import Users from "../Admin/Users/Users";
import BalancesAndOperations from "./BalancesAndOperations/BalancesAndOperations";
class Admin extends Component {
  state = {
    activeItem: "balancesAndOperations",
    userDetailModal: false,
    userInfo: {}
  };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        <Menu size="large" pointing>
          <Menu.Item
            content="Balances y operaciones"
            name="balancesAndOperations"
            active={activeItem === "balancesAndOperations"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Usuarios"
            name="users"
            active={activeItem === "users"}
            onClick={this.handleItemClick}
          />
        </Menu>
        {this.state.activeItem === "users" && <Users />}
        {this.state.activeItem === "balancesAndOperations" && (
          <BalancesAndOperations />
        )}
      </div>
    );
  }
}

export default Admin;
