import React, { Component } from "react";
import { Container, Menu, Segment } from "semantic-ui-react";
import AddOfferStatic from "./AddOffer/AddOffer";
import DynamicOffer from "./DynamicOffer/DynamicOffer";
import translate from "../../../i18n/translate";

class OffersMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "createStaticOffer",
      translator: props.translate
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    let t = this.state.translator;
    return (
      <Container>
        <Menu size="small" pointing secondary>
          <Menu.Item
            content={t("broker.addOfferOption.static")}
            name="createStaticOffer"
            active={this.state.activeItem === "createStaticOffer"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content={t("broker.addOfferOption.dynamic")}
            name="createDynamicOffer"
            active={this.state.activeItem === "createDynamicOffer"}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Segment color="orange">
          {this.state.activeItem === "createStaticOffer" && (
            <Container as={AddOfferStatic} />
          )}
          {this.state.activeItem === "createDynamicOffer" && (
            <Container as={DynamicOffer} />
          )}
        </Segment>
      </Container>
    );
  }
}

export default translate(OffersMenu);
