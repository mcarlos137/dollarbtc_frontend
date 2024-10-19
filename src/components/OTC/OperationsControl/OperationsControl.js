import React, { Component } from "react";
import "../OTC.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import _ from "underscore";
import ContainerActualOperations from "../../Containers/ContainerOperationControl";

class OperationsControl extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "actualOperations" };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    return (
      <Container>
        <Menu size="large" pointing>
          <Menu.Item
            content="Operaciones en curso"
            name="actualOperations"
            active={this.state.activeItem === "actualOperations"}
            onClick={this.handleItemClick}
          />
        </Menu>

        <Segment color="orange">
          {this.state.activeItem === "actualOperations" && (
            <Container as={ContainerActualOperations} />
          )}
        </Segment>
      </Container>
    );
  }
}
export default OperationsControl;
