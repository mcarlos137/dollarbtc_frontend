import React, { Component } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Segment, Image, Button, Header, Grid } from "semantic-ui-react";
import localbitcoin from "../../../img/localbitcoins.jpg";
import cryptocompare from "../../../img/cryptocompare.png";
import binance from "../../../img/binance.png";
import hitbtc from "../../../img/hitbtc.png";
import aws from "../../../img/aws.png";
import endred from "../../../img/Edenred logo.jpg";
import kraken from "../../../img/kraken-logo.png";
import broxel from "../../../img/broxel-logo.png";
import bitfinex from "../../../img/Bitfinex.png";
import bitmex from "../../../img/bitmex-logo.png";
import bitstamp from "../../../img/bitstamp.png";
import poloniex from "../../../img/poloniex.png";

class AssociatedCompaniesCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      currentIndex: 0
    };
  }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 3 }
  };
  componentWillMount() {
    this._isMounted = true;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  onSlideChanged(e) {
    if (this._isMounted) {
      this.setState({ currentIndex: e.item });
    }
  }

  onSlideChange(e) {}
  slideNext() {
    if (this._isMounted) {
      this.setState({ currentIndex: this.state.currentIndex + 1 });
    }
  }

  slidePrev() {
    if (this._isMounted) {
      this.setState({ currentIndex: this.state.currentIndex - 1 });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    // let listItem = this.state.companies;
    // let currentIndex, carousel;
    // currentIndex = this.state.currentIndex;
    // listItem.push(
    //   <Image
    //     src={localbitcoin}
    //     style={{
    //       width: "200px",
    //     }}
    //     href="https://localbitcoins.com/es/"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     href="https://www.cryptocompare.com/"
    //     src={cryptocompare}
    //     style={{
    //       marginTop: "51px",
    //       width: "200px",
    //     }}
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={binance}
    //     style={{
    //       marginTop: "17px",
    //       width: "200px",
    //     }}
    //     href="https://www.binance.com/es"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={hitbtc}
    //     style={{
    //       width: "200px",
    //     }}
    //     href="https://hitbtc.com/es_"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={kraken}
    //     style={{
    //       marginTop: "35px",
    //       width: "200px",
    //     }}
    //     href="https://www.kraken.com/"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={bitfinex}
    //     style={{
    //       marginTop: "5px",
    //       width: "200px",
    //     }}
    //     href="https://www.bitfinex.com/"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={bitmex}
    //     style={{
    //       marginTop: "53px",
    //       width: "200px",
    //     }}
    //     href="https://www.bitmex.com/"
    //     target="_blank"
    //   />
    // );
    // listItem.push(
    //   <Image
    //     src={bitstamp}
    //     style={{
    //       marginTop: "35px",
    //       width: "200px",
    //     }}
    //     href="https://www.bitstamp.net/"
    //     target="_blank"
    //   />
    // );
    // listItem = listItem.map((item, i)=>(
    //   <div key={`key-${i}`}>
    //     {item}
    //   </div>
    // ));
    // if (this._isMounted) {
    //   carousel = (
    //     <AliceCarousel
    //       id="alice-custom-companies"
    //       items={listItem}
    //       autoPlay={false}
    //       startIndex={currentIndex}
    //       fadeOutAnimation={true}
    //       mouseDragEnabled={false}
    //       playButtonEnabled={false}
    //       autoPlayInterval={4000}
    //       buttonsDisabled={true}
    //       keysControlDisabled={true}
    //       dotsDisabled={true}
    //       responsive={this.responsive}
    //       disableAutoPlayOnAction={true}
    //       onSlideChange={this.onSlideChange}
    //       onSlideChanged={this.onSlideChanged}
    //     />
    //   );
    // }
    return (
      // <Grid colums="equal">
      //   <Grid.Row>
      //     <Grid.Column verticalAlign="middle">
      //       <Button
      //         basic
      //         name="left"
      //         circular
      //         icon="angle left"
      //         onClick={this.slidePrev.bind(this)}
      //       />
      //     </Grid.Column>
      //     <Grid.Column largeScreen={14} computer={14} mobile={12}>
      //       {carousel}
      //     </Grid.Column>
      //     <Grid.Column verticalAlign="middle">
      //       <Button
      //         basic
      //         name="right"
      //         circular
      //         icon="angle right"
      //         onClick={this.slideNext.bind(this)}
      //       />
      //     </Grid.Column>
      //   </Grid.Row>
      // </Grid>
      <Grid
        verticalAlign={"middle"}
        style={{ marginTop: "30px", marginLeft: 55 }}
      >
        <Grid.Row columns={4} verticalAlign={"middle"}>
          <Grid.Column>
            <Image
              src={localbitcoin}
              size="medium"
              style={{ marginTop: "15px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={cryptocompare}
              size="medium"
              style={{ marginTop: "5px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={kraken}
              size="small"
              style={{ marginBottom: "8px", marginLeft: 35 }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={binance}
              size="medium"
              style={{ marginLeft: "-20px" }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          columns={5}
          style={{ marginTop: "-40px" }}
          verticalAlign={"middle"}
        >
          <Grid.Column>
            <Image
              src={poloniex}
              size="tiny"
              inline
              style={{ marginTop: "10px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={bitfinex}
              size="medium"
              style={{ marginTop: "10px", marginLeft: "-45px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={hitbtc}
              size="medium"
              style={{ marginTop: "-15px", marginLeft: "-15px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={bitmex}
              size="small"
              style={{ marginTop: "10px", marginRigth: "25px" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Image
              src={bitstamp}
              size="small"
              style={{ marginTop: "10px", marginRigth: "25px" }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AssociatedCompaniesCarousel;
