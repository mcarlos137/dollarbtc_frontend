import React, { Component } from "react";
import {
  Segment,
  Grid,
  Form,
  Header,
  Button,
  Icon,
  Select,
  Divider,
  Image
} from "semantic-ui-react";
import "./BuySellComponent.css";

class BuySellComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: this.props.coins,
      coinBuy: "",
      priceBuy: "",
      imgBuy: "",
      resultBuy: "",
      coinSell: "",
      priceSell: "",
      imgSell: "",
      resultSell: "",
      numberBuy: "",
      numberSell: ""
    };
  }
  handleTargetBuy(e, data) {
    let currency = this.state.coins.find(element => {
      return data.value === element.value;
    });
    //console.log(this.state.coins);
    this.setState({
      coinBuy: data.value,
      priceBuy: currency.sell.price,
      imgBuy: currency.img,
      numberBuy: new Number(currency.sell.price),
      resultBuy: new Number(currency.sell.price) / new Number(currency.sell.price)
    });
  }
  handleTargetSell(e, data) {
    let currency = this.state.coins.find(element => {
      return data.value === element.value;
    });
    this.setState({
      coinSell: data.value,
      priceSell: currency.buy.price,
      imgSell: currency.img,
      numberSell: new Number(currency.buy.price),
      resultSell: new Number(currency.buy.price) / new Number(currency.buy.price)
    });
  }
  handleInputBuy(e, data) {
    if (this.state.priceBuy !== "") {
      let number =new  Number(e.target.value);
      let pricebuy = new Number(this.state.priceBuy);
      this.setState({
        resultBuy: number / pricebuy,
        numberBuy: e.target.value
      });
    }
  }
  handleInputBuyBTC(e, data) {
    if (this.state.priceBuy !== "") {
      let number = new Number(e.target.value);
      let pricebuy = new Number(this.state.priceBuy);
      this.setState({
        numberBuy: number * pricebuy,
        resultBuy: e.target.value
      });
    }
  }
  handleInputSell(e, data) {
    if (this.state.priceSell !== "") {
      let number = new Number(e.target.value);
      let pricesell = new Number(this.state.priceSell);
      this.setState({ resultSell: number / pricesell });
    }
  }
  handleInputSellBTC(e, data) {
    if (this.state.priceSell !== "") {
      let number = new Number(e.target.value);
      let pricesell = new Number(this.state.priceSell);
      this.setState({ numberSell: number * pricesell });
    }
  }
  handleSendBuy() {
    if (this.state.coinBuy !== "") {
      window.location.href =
        "/buy/?c=" + this.state.coinBuy + "&" + "a=" + this.state.numberBuy;
    }
  }
  handleSendSell() {
    if (this.state.coinSell !== "") {
      window.location.href =
        "/sell/?c=" + this.state.coinSell + "&" + "a=" + this.state.numberSell;
    }
  }
  render() {
    let databuy = [];
    let datasell = [];
    for (let value of this.state.coins) {
      if (value.sell !== undefined) {
        databuy.push(value);
      }
    }
    for (let ele of this.state.coins) {
      if (ele.buy !== undefined) {
        datasell.push(ele);
      }
    }
    return (
      <Segment color="orange" loading={this.state.coins.length > 0 ? false:true}>
        <Grid columns="two" divided>
          <Grid.Row>
            <Grid.Column largeScreen={8} tablet={8} mobile={16}>
              <Header as="h3" textAlign="center">
                <Icon name="bitcoin" size="large" color="orange" />
                Comprar Bitcoin
              </Header>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <div>
                      {" "}
                      <Select
                        onChange={this.handleTargetBuy.bind(this)}
                        placeholder="Selecione una moneda"
                        options={databuy}
                        size="tiny"
                      />
                    </div>
                  </Form.Field>
                  <Form.Field>
                    <span style={{ marginRight: "10px" }}>
                      1 BTC = {this.state.coinBuy} {this.state.priceBuy}
                    </span>
                    <Image avatar size="mini" src={this.state.imgBuy} />
                  </Form.Field>
                </Form.Group>
              </Form>
              <Divider hidden />
              <Form onSubmit={this.handleSendBuy.bind(this)}>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Monto ({this.state.coinBuy})</label>
                    <input
                      fluid="true"
                      placeholder="Monto moneda"
                      value={this.state.numberBuy}
                      onChange={this.handleInputBuy.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Valor en BTC</label>
                    <input
                      fluid="true"
                      placeholder="Monto en bitcoin"
                      value={this.state.resultBuy}
                      onChange={this.handleInputBuyBTC.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label style={{ color: "white" }}>Middle name</label>
                    <Button color="blue" type="submit">
                      Comprar
                    </Button>
                  </Form.Field>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column largeScreen={8} tablet={8} mobile={16}>
              <Header as="h3" textAlign="center">
                <Icon name="bitcoin" size="large" color="orange" />
                Vender Bitcoin
              </Header>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <div>
                      {" "}
                      <Select
                        onChange={this.handleTargetSell.bind(this)}
                        placeholder="Selecione una moneda"
                        options={datasell}
                        size="tiny"
                      />
                    </div>
                  </Form.Field>
                  <Form.Field>
                    <span style={{ marginRight: "10px" }}>
                      1 BTC = {this.state.coinSell} {this.state.priceSell}
                    </span>
                    <Image avatar size="mini" src={this.state.imgSell} />
                  </Form.Field>
                </Form.Group>
              </Form>
              <Divider hidden />
              <Form onSubmit={this.handleSendSell.bind(this)}>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Monto ({this.state.coinSell})</label>
                    <input
                      fluid="true"
                      placeholder="Monto para venta"
                      value={this.state.numberSell}
                      onChange={this.handleInputSell.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Valor en BTC</label>
                    <input
                      fluid="true"
                      placeholder="Monto en BTC"
                      value={this.state.resultSell}
                      onChange={this.handleInputSellBTC.bind(this)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label style={{ color: "white" }}>Middle name</label>
                    <Button color="blue" type="submit">
                      Vender
                    </Button>
                  </Form.Field>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
export default BuySellComponent;
