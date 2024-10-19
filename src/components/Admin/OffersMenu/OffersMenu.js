import React, { Component } from "react";
import { Container, Menu, Segment } from "semantic-ui-react";
import AddConfiguration from "../../OTC/AddConfiguration/AddConfiguration";
import DynamicOffer from "../DynamicOffer/DynamicOffer";

class OffersMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "createStaticOffer"
    };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <Container>
        <Menu size="small" pointing secondary>
          <Menu.Item
            content="Estática"
            name="createStaticOffer"
            active={this.state.activeItem === "createStaticOffer"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Dinámica"
            name="createDynamicOffer"
            active={this.state.activeItem === "createDynamicOffer"}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Segment color="orange">
          {this.state.activeItem === "createStaticOffer" && (
            <Container as={AddConfiguration} />
          )}
          {this.state.activeItem === "createDynamicOffer" && (
            <Container as={DynamicOffer} />
          )}
        </Segment>
      </Container>
    );
  }
}

export default OffersMenu;
