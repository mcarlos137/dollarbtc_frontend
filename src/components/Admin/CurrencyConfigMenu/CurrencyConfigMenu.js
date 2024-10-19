import React, { Component } from "react";
import "../Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import AddCurrencyConfig from "../AddCurrencyConfig/AddCurrencyConfig";
import EditCurrencyConfig from "../EditCurrencyConfig/EditCurrencyConfig";
class CurrencyConfigMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "addCurrencyConfig"
    };
  }
  componentDidMount() {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <Container>
        <Menu size="small" pointing secondary>
          <Menu.Item
            content="Añadir moneda"
            name="addCurrencyConfig"
            active={this.state.activeItem === "addCurrencyConfig"}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Segment color="orange">
          {this.state.activeItem === "addCurrencyConfig" && (
            <Container as={AddCurrencyConfig} />
          )}
          {this.state.activeItem === "editCurrencyConfig" && (
            <Container as={EditCurrencyConfig} />
          )}
        </Segment>
      </Container>
    );
  }
}
export default CurrencyConfigMenu;
