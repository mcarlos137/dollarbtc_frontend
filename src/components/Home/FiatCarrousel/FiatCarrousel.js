import React, { Component } from "react";
import "./FiatCarrousel.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Header, Segment, Image, Container, Divider } from "semantic-ui-react";
import Br from "../../../img/br.svg";
import Cl from "../../../img/cl.svg";
import Co from "../../../img/co.svg";
import Es from "../../../img/es.svg";
import Do from "../../../img/do.svg";
import Pe from "../../../img/pe.svg";
import Ve from "../../../img/ve.svg";
import Ar from "../../../img/ar.svg";
import Ca from "../../../img/ca.svg";
import Mx from "../../../img/mx.svg";
import Cn from "../../../img/cn.svg";
import Ru from "../../../img/ru.svg";
import Jp from "../../../img/jp.svg";
import In from "../../../img/in.svg";
import Ch from "../../../img/ch.svg";
import market from "../../../services/market";
import axios from "axios";

class FiatCarrousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCoin: [],
      cont: 0,
      btcusdBuyAveragePrice: 0,
      btcusdSellAveragePrice: 0
    };
    this.getUsdPrice = this.getUsdPrice.bind(this);
    this.startTextPrice = this.startTextPrice.bind(this);
  }
  componentWillMount() {}
  componentDidMount() {
    this.getUsdPrice();
  }
  getUsdPrice() {
    /*axios
      .get(
        "https://service8081.dollarbtc.com/website/getLocalbitcoinTicker/BTCUSD"
      )*/
      let url = market.getLocalbitcoinTicker(BTCUSD);
      url.then(res => {
        //console.log(res);
        if (res.data !== {}) {
          this.setState({
            btcusdSellAveragePrice: res.data.ask.average.price,
            btcusdBuyAveragePrice: res.data.bid.average.price
          });
          this.startTextPrice("ves", "BTC", "VES", Ve);
          this.startTextPrice("eur", "BTC", "EUR", Es);
          this.startTextPrice("cop", "BTC", "COP", Co);
          this.startTextPrice("clp", "BTC", "CLP", Cl);
          this.startTextPrice("pen", "BTC", "PEN", Pe);
          this.startTextPrice("rd", "BTC", "DOP", Do);
          this.startTextPrice("brl", "BTC", "BRL", Br);
          this.startTextPrice("ars", "BTC", "ARS", Ar);
          this.startTextPrice("mxn", "BTC", "MXN", Mx);
          this.startTextPrice("cny", "BTC", "CNY", Cn);
          this.startTextPrice("rub", "BTC", "RUB", Ru);
          this.startTextPrice("inr", "BTC", "INR", In);
          this.startTextPrice("cad", "BTC", "CAD", Ca);
          this.startTextPrice("jpy", "BTC", "JPY", Jp);
          this.startTextPrice("chf", "BTC", "CHF", Ch);
        } else {
          this.getUsdPrice();
        }
      })
      .catch(error => {
        this.getUsdPrice();
        //console.log(error);
      });
  }
  startTextPrice(id, symbolAsset, symbolBase, img) {
    this.setState({ cont: this.state.cont + 1 });
   /* axios
      .get(
        "https://service8081.dollarbtc.com/website/getLocalbitcoinTicker/" +
          symbolAsset + "/" +
          symbolBase
      )*/
      let url = market.getLocalbitcoinTickerTwo(symbolAsset,symbolBase);
      url.then(res => {
        var priceSum = 0;
        if (res.data !== {}) {
          let ask = res.data.ask.average.price;
          let bid = res.data.bid.average.price;
          priceSum = ask + bid;
          let result =
            priceSum /
            (this.state.btcusdSellAveragePrice +
              this.state.btcusdBuyAveragePrice);
          if (symbolBase === "DOP") {
            let element = {
              value: result.toLocaleString("en-US", {
                maximumFractionDigits: 2
              }),
              text: symbolAsset + "/" + "RD$",
              imag: img,
              key: symbolBase
            };
            this.setState({ listCoin: [...this.state.listCoin, element] });
          } else {
            let element2 = {
              value: result.toLocaleString("en-US", {
                maximumFractionDigits: 2
              }),
              text: symbolAsset + " / " + symbolBase,
              imag: img,
              key: symbolBase
            };
            this.setState({ listCoin: [...this.state.listCoin, element2] });
          }
        }
      })
      .catch(error => {
        //console.log(error);
      });
  }
  componentDidUpdate() {}
  render() {
    let list;
    // if (this.state.cont === 15) {
    list = this.state.listCoin.map(element => (
      <div key={element.key}>
        <Container style={{ backgroundColor: "white", height: "308px" }}>
          <Segment color="orange" style={{ height: "308px" }} loading={this.state.coins.length > 0 ? false: true }>
            <br />
            <Divider hidden />
            <Divider horizontal>Mercado</Divider>
            <Header as="h1">
              <Image
                src={element.imag}
                circular
                size="tiny"
                style={{ marginBottom: "10px" }}
              />
              {element.text}
            </Header>
            <Divider hidden />
            <p className="text-price">
              1 USD > {element.value} {element.key}
            </p>
            <Divider horizontal>Precio</Divider>
          </Segment>
        </Container>
      </div>
    ));
    //}

    return (
      <Carousel autoPlay showThumbs={false} showArrows infiniteLoop>
        {list}
      </Carousel>
    );
  }
}
export default FiatCarrousel;
