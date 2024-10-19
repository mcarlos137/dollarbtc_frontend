import React, { Component } from "react";
import "../OTC.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../services/user";

import OffersMenu from "../../Admin/OffersMenu/OffersMenu";
import AdHistory from "../AdHistory/AdHistory";
import ActualAd from "../ActualAd/ActualAd";
import AddFactorChange from "../AddFactorChange/addFactorChange";
class AdSettings extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { activeItem: "addConfiguration", actionsUser: [] };
  }
  componentDidMount()
  {
    let availableFunctionsUser = userService.getUserRol();
    // //console.log(availableFunctionsUser);
    if (availableFunctionsUser !== null) {
      this.setState({
        actionsUser: availableFunctionsUser.functionsAvailables
      });
    }
  }
  componentWillReceiveProps(nextProps) { }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render()
  {
    return (
      <Container>
        <Menu size="large" pointing>
          {this.state.actionsUser.indexOf("otc_offers_add") !== -1 && (
            <Menu.Item
              content="Añadir oferta"
              name="addConfiguration"
              active={this.state.activeItem === "addConfiguration"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("otc_offers_list") !== -1 && (
            <Menu.Item
              content="Ofertas actuales"
              name="actualAd"
              active={this.state.activeItem === "actualAd"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("otc_offers_old") !== -1 && (
            <Menu.Item
              content="Historial de ofertas"
              name="adHistory"
              active={this.state.activeItem === "adHistory"}
              onClick={this.handleItemClick}
            />
          )}
          {this.state.actionsUser.indexOf("otc_offers_factorChange") !== -1 && (
            <Menu.Item
              content="Factor de Cambio"
              name="adChangeFactor"
              active={this.state.activeItem === "adChangeFactor"}
              onClick={this.handleItemClick}
            />
          )}
        </Menu>
        {this.state.activeItem === "addConfiguration" && (
          <Container as={OffersMenu} />
        )}
        {this.state.activeItem === "adHistory" && (
          <Segment color="orange">
            <Container as={AdHistory} />
          </Segment>
        )}
        {this.state.activeItem === "actualAd" && (
          <Segment color="orange">
            <Container as={ActualAd} />
          </Segment>
        )}

        {this.state.activeItem === "adChangeFactor" && (
          <Segment color="orange">
            <Container as={AddFactorChange} />
          </Segment>
        )}
      </Container>
    );
  }
}
export default AdSettings;
