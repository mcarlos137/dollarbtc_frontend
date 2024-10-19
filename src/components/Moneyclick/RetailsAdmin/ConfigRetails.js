import React, { Component } from "react";
import { Menu, Grid, Dimmer, Loader } from "semantic-ui-react";
import Retails from "./ListRetails";
import MapRetails from "./MapRetails";

class ConfigRetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "map",
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
                content="Mapa de Puntos de Intercambio"
                name="map"
                active={this.state.activeItem === "map"}
                onClick={this.handleActiveItem.bind(this)}
              />
              <Menu.Item
                content="Administrar Puntos de Intercambio"
                name="list"
                active={this.state.activeItem === "list"}
                onClick={this.handleActiveItem.bind(this)}
              />
            </Menu>
            {this.state.activeItem === "map" && <MapRetails />} 
            {this.state.activeItem === "list" && <Retails />}
          </Grid.Column>
        </Grid>
      </Dimmer.Dimmable>
    );
  }
}

export default ConfigRetails;