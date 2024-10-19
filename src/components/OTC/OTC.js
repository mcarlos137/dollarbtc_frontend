import React, { Component } from "react";
import "./OTC.css";
import { Menu } from "semantic-ui-react";
import _ from "underscore";
import AdSettings from "./AdSettings/AdSettings";
import OperationsControl from "./OperationsControl/OperationsControl";
class OTC extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "adSettings" };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <div>
        <Menu size="large" pointing>
          <Menu.Item
            content="Configuración de ofertas"
            name="adSettings"
            active={this.state.activeItem === "adSettings"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Control de operaciones"
            name="operationsControl"
            active={this.state.activeItem === "operationsControl"}
            onClick={this.handleItemClick}
          />
        </Menu>
        {this.state.activeItem === "adSettings" && <AdSettings />}
        {this.state.activeItem === "operationsControl" && <OperationsControl />}
      </div>
    );
  }
}
export default OTC;
