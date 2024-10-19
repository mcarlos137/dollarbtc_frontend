import React, { Component } from "react";
import "../../Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../../services/user";
import MasterAccountBalance from "../MasterAccountMenu/MasterAccountBalance/MasterAccountBalance";
import AutoTransferBetweenMasterSettings from "../MasterAccountMenu/AutoTransferBetweenMasterSettings/AutoTransferBetweenMasterSettings";

class MasterAccountMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
      actionsUser: [],
    };
  }
  // componentDidMount() {}

  componentDidMount() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = "";
      if (arrayFunctions.indexOf("consult_master_accounts") !== -1) {
        nameItem = "masterAccountBalance";
      } else {
        nameItem = "autoTransferBetweenMasterSettings";
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
          {this.state.actionsUser.indexOf("consult_master_accounts") !== -1 && (
            <Menu.Item
              content="Balance"
              name="masterAccountBalance"
              active={this.state.activeItem === "masterAccountBalance"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("otc_account_configuration") !==
            -1 && (
            <Menu.Item
              content="Configuración de transferencias automáticas"
              name="autoTransferBetweenMasterSettings"
              active={
                this.state.activeItem === "autoTransferBetweenMasterSettings"
              }
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        {/* <Menu.Item
            content="Balance"
            name="masterAccountBalance"
            active={this.state.activeItem === "masterAccountBalance"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Configuración de transferencias automáticas"
            name="autoTransferBetweenMasterSettings"
            active={
              this.state.activeItem === "autoTransferBetweenMasterSettings"
            }
            onClick={this.handleItemClick}
          /> */}
        <Segment color="orange">
          {this.state.activeItem === "masterAccountBalance" && (
            <Container as={MasterAccountBalance} />
          )}
          {this.state.activeItem === "autoTransferBetweenMasterSettings" && (
            <Container as={AutoTransferBetweenMasterSettings} />
          )}
        </Segment>
      </Container>
    );
  }
}

export default MasterAccountMenu;
