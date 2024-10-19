import React, { Component } from "react";
import "./CarouselPlatforms.css";
import Carousel from "react-alice-carousel";
import { Segment, Image } from "semantic-ui-react";
import binance from "../../../img/binance.png";
import hitbtc from "../../../img/hitbtc.png";
import localbitcoin from "../../../img/localbitcoins.jpg";
import cryptocompare from "../../../img/cryptocompare.png";
import aws from "../../../img/aws.png";
import kraken from "../../../img/kraken-logo.png";
import bitfinex from "../../../img/Bitfinex.png";
import bitmex from "../../../img/bitmex-logo.png";
import bitstamp from "../../../img/bitstamp.png";
class CarouselPlatforms extends Component {
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 3 }
  };
  render() {
    return (
      <Segment color="orange">
        <Carousel
          id="carousel-mobileplatforms"
          showThumbs={false}
          showArrows={true}
          showStatus={false}
          duration={3000}
          autoPlay={true}
          infinite={true}
          buttonsDisabled={true}
          responsive={this.responsive}
        >
          <Image
            src={localbitcoin}
            className="carousel-platforms"
            style={{
              width: "255px"
              // marginLeft: "20px"
            }}
            href="https://localbitcoins.com/es/"
            target="_blank"
          />
          <Image
            src={binance}
            className="carousel-platforms"
            style={{
              width: "255px",
              marginTop: "15px"
            }}
            target="_blank"
            href="https://www.binance.com/es"
          />
          <Image
            src={hitbtc}
            className="carousel-platforms-1"
            style={{
              width: "260px",
              marginTop: "-10px"
              // marginLeft: "15px"
            }}
            href="https://hitbtc.com/es_"
            target="_blank"
          />
          <Image
            src={cryptocompare}
            className="carousel-platforms"
            style={{
              width: "255px",
              height: "70px",
              marginTop: "53px"
              // marginLeft: "15px"
            }}
            target="_blank"
            href="https://www.cryptocompare.com/"
          />
          <Image
            src={bitfinex}
            className="carousel-platforms-1"
            style={{
              marginTop: "15px",
              //marginLeft: "15px",
              width: "250px"
            }}
            href="https://www.bitfinex.com/"
            target="_blank"
          />
          <Image
            src={bitmex}
            className="carousel-platforms-1"
            style={{
              marginTop: "65px",
              //marginLeft: "25px",
              width: "220px"
            }}
            href="https://www.bitmex.com/"
            target="_blank"
          />
          <Image
            src={bitstamp}
            className="carousel-platforms"
            style={{
              marginTop: "45px",
              //marginLeft: "10px",
              width: "250px"
            }}
            href="https://www.bitstamp.net/"
            target="_blank"
          />
        </Carousel>
      </Segment>
    );
  }
}

export default CarouselPlatforms;
