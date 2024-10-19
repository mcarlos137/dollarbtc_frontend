import React, { Component } from "react";
import {
  Container,
  Grid,
  Header
} from "semantic-ui-react";
import MarketBuy from "./MarketBuy/MarketBuy";
import MarketSell from "./MarketSell/MarketSell";

class MarketOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { key: "otc", text: "OTC", value: "OTC" },
        { key: "core", text: "CORE", value: "CORE" },
        { key: "hft", text: "HTF", value: "HFT" }
      ],
      masterAccountSelected: "OTC"
    };
  }
  handleMasterAccount(e, data) {
    this.setState({ masterAccountSelected: data.value });
  }
  render() {
    return (
      <Container>
        <Grid divided>
          <Grid.Row columns="2">
            <Grid.Column>
              <Header>Compra</Header>
              <MarketBuy />
            </Grid.Column>
            <Grid.Column>
              <Header>Venta</Header>
              <MarketSell />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default MarketOperations;
