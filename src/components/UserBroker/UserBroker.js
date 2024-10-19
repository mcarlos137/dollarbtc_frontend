import React, { Component } from "react";
import { Menu, Segment, Container } from "semantic-ui-react";
import OffersMenu from "./OffersMenu/OffersMenu";
import HistoryOffer from "./HistoryOffer/HistoryOffer";
import ActualOffer from "./ActualOffer/ActualOffer";
import BalanceBroker from "./BalanceBroker/BalanceBroker";
import translate from "../../i18n/translate";

class UserBroker extends Component {
  constructor(props) {
    super(props);
    this.state = { translator: props.translate, activeItem: "balance" };
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
      <div>
        <Container>
          <Menu size="large" pointing>
            <Menu.Item
              content="Balance"
              name="balance"
              active={this.state.activeItem === "balance"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              content={t("broker.addOffer")}
              name="addConfiguration"
              active={this.state.activeItem === "addConfiguration"}
              onClick={this.handleItemClick}
            />

            <Menu.Item
              content={t("broker.actualOffer")}
              name="actualOffer"
              active={this.state.activeItem === "actualOffer"}
              onClick={this.handleItemClick}
            />

            <Menu.Item
              content={t("broker.historyOffer")}
              name="historyOffer"
              active={this.state.activeItem === "historyOffer"}
              onClick={this.handleItemClick}
            />
          </Menu>
          {this.state.activeItem === "balance" && (
            <Segment color="orange">
              <Container as={BalanceBroker} />
            </Segment>
          )}
          {this.state.activeItem === "addConfiguration" && (
            <Container as={OffersMenu} />
          )}

          {this.state.activeItem === "historyOffer" && (
            <Segment color="orange">
              <Container as={HistoryOffer} />
            </Segment>
          )}
          {this.state.activeItem === "actualOffer" && (
            <Segment color="orange">
              <Container as={ActualOffer} />
            </Segment>
          )}
        </Container>
      </div>
    );
  }
}

export default translate(UserBroker);
