import React, { Component } from "react";
import "./MarketModulator.css";
import { Menu } from "semantic-ui-react";
import AutomaticRules from "./Rules/AutomaticRules";
import ActiveMarkets from "./ActiveMarkets/ActiveMarkets";

class MarketModulator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "activeMarkets"
    };
    this.handleItemMenuClick = this.handleItemMenuClick.bind(this);
  }

  handleItemMenuClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <div>
        <Menu size="large" pointing>
          <Menu.Item
            content="Mercados Activos"
            name="activeMarkets"
            active={this.state.activeItem === "activeMarkets"}
            onClick={this.handleItemMenuClick}
          />
          <Menu.Item
            disabled
            content="Reglas Automáticas"
            name="automaticRules"
            active={this.state.activeItem === "automaticRules"}
            onClick={this.handleItemMenuClick}
          />
        </Menu>
        {this.state.activeItem === "activeMarkets" && <ActiveMarkets />}
        {this.state.activeItem === "automaticRules" && <AutomaticRules />}
      </div>
    );
  }
}
export default MarketModulator;
