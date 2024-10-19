import React, { Component } from "react";
import { Menu, Grid, Dimmer, Loader } from "semantic-ui-react";
import Rols from "./Rols/Rols";
import Operators from "./Operators/Operators";

class RolAndFunctions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "rol",
      show: true
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.setState({ show: true });
  }
  handleActiveItem(e, data) {
    this.setState({ activeItem: data.name });
  }
  render() {
    return (
      <Dimmer.Dimmable dimmed={!this.state.show}>
        <Dimmer active={!this.state.show} inverted>
          <Loader>Cargando...</Loader>
        </Dimmer>
        <Grid centered>
          <Grid.Column largeScreen={16} mobile={16} tablet={16} computer={16}>
            <Menu pointing>
              <Menu.Item
                content="Roles"
                name="rol"
                active={this.state.activeItem === "rol"}
                onClick={this.handleActiveItem.bind(this)}
              />
              <Menu.Item
                content="Operadores"
                name="operator"
                active={this.state.activeItem === "operator"}
                onClick={this.handleActiveItem.bind(this)}
              />
            </Menu>
            {this.state.activeItem === "rol" && <Rols />}
            {this.state.activeItem === "operator" && <Operators />}
          </Grid.Column>
        </Grid>
      </Dimmer.Dimmable>
    );
  }
}

export default RolAndFunctions;
