import React, { Component } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Segment, Image, Button, Header, Grid } from "semantic-ui-react";
import "../FiatCarrouselStadicts/FiatCarrouselStadicts.css";
import FiatGaugeModal from "../FiatGaugeModal/FiatGaugeModal";
import translate from "../../../i18n/translate";
class FiatHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: this.props.coins,
      symbol: "",
      showmodal: false,
      data: null,
      buy: 0,
      sell: 0,
      currentIndex: 0,
      translator: props.translate
    };
    this._isMounted = false;
  }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 4 }
  };
  onSlideChange(e) {}
  handleClickItem(e, data) {
    //console.log(data);
  }
  componentWillMount() {
    this._isMounted = true;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  handleClickItemStatic(e, data) {
    let el = this.props.coins.find(function(element) {
      return data.name === element.value;
    });
    this.setState({
      symbol: "BTC" + data.name,
      showmodal: true,
      data: el.percent,
      buy: el.buy,
      sell: el.sell
    });
  }
  handleModal() {
    this.setState({ symbol: "", showmodal: false });
  }
  slideTo(i) {
    if (this._isMounted) {
      this.setState({ currentIndex: i });
    }
  }

  onSlideChanged(e) {
    if (this._isMounted) {
      this.setState({ currentIndex: e.item });
    }
  }

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
    let currentIndex, carousel;
    let t = this.state.translator;
    currentIndex = this.state.currentIndex;
    let fiatCurrencies = this.props.coins.filter(c => {
      return c.value !== "ETH" && c.value !== "BTC";
    });
    let listItem = fiatCurrencies.map((item, i) => (
      <Segment key={`key-${i}`} basic>
         <div>
          <Header textAlign="center" as="h2">
            <Image src={item.img} className="file-style" size="mini" />
            <span className="head-style" style={{ fontSize:20}}> BTC / {item.value} </span>
          </Header>
        </div> 
        <Header
          textAlign="center"
          style={{ marginTop: "15px", marginBottom: "40px" }}
        >
          {item.buy !== 0 && (
            <div className="price-style-homeLogue">
              {t("fiatCarouselStatistics.buy")}{" "}
              {item.buy.toLocaleString("en-US", {
                maximumFractionDigits: 2
              })}{" "}
            </div>
          )}
          {item.sell !== 0 && (
            <div className="price-style-homeLogue">
              {t("fiatCarouselStatistics.sell")}{" "}
              {item.sell.toLocaleString("en-US", {
                maximumFractionDigits: 2
              })}{" "}
            </div>
          )}
          {item.usd_price !== 0 && (
            <div className="price-conver-style-homeLogue">
              {t("fiatCarouselStatistics.usdChange")} ->{" "}
              {item.usd_price.toLocaleString("en-US", {
                maximumFractionDigits: 2
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value !== "VES" && (
            <div className="price-conver-style-homeLogue">
              {t("fiatCarouselStatistics.forexPrice")} ->{" "}
              {item.forex_price.toLocaleString("en-US", {
                maximumFractionDigits: 2
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value === "VES" && (
            <div className="price-conver-style-homeLogue">
              <br />
            </div>
          )}
        </Header>
        <div style={{ marginTop: -20 }}>
          <Header textAlign="center">
            <Button
              color="blue"
              size="tiny"
              compact
              name={item.value}
              onClick={this.handleClickItemStatic.bind(this)}
            >
              <span style={{ fontSize: "10px" }}>
                {" "}
                {t("fiatCarouselStatistics.statistics")}
              </span>
            </Button>
          </Header>
        </div>
      </Segment>
    ));

    if (this._isMounted) {
      carousel = (
        <AliceCarousel
          id="alice-custom"
          items={listItem}
          autoPlay={false}
          startIndex={currentIndex}
          fadeOutAnimation={true}
          mouseDragEnabled={false}
          playButtonEnabled={false}
          autoPlayInterval={4000}
          buttonsDisabled={true}
          keysControlDisabled={true}
          dotsDisabled={true}
          responsive={this.responsive}
          disableAutoPlayOnAction={true}
          onSlideChange={this.onSlideChange}
          onSlideChanged={this.onSlideChanged}
          itemsInSlide={2}
        />
      );
    }
    return (
      <div>
        {window.innerWidth > 430 && (
          <div>
            <Grid columns="equal">
              <Grid.Row>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <Button
                    basic
                    name="left"
                    circular
                    style={{
                      marginLeft: window.innerWidth <= 430 ? 0 : -20
                    }}
                    icon="angle left"
                    onClick={this.slidePrev.bind(this)}
                  />
                </Grid.Column>
                <Grid.Column computer={14} mobile={14}>
                  {carousel}
                </Grid.Column>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <Button
                    basic
                    name="right"
                    circular
                    icon="angle right"
                    onClick={this.slideNext.bind(this)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <FiatGaugeModal
              symbol={this.state.symbol}
              show={this.state.showmodal}
              close={this.handleModal.bind(this)}
              data={this.state.data}
              buy={this.state.buy}
              sell={this.state.sell}
            />
          </div>
        )}

        {window.innerWidth <= 430 && (
          <div>
            <Grid columns="equal">
              <Grid.Row>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <Button
                    basic
                    name="left"
                    circular
                    style={{
                      marginLeft: window.innerWidth <= 430 ? 0 : -20
                    }}
                    icon="angle left"
                    onClick={this.slidePrev.bind(this)}
                  />
                </Grid.Column>
                <Grid.Column mobile={12} style={{ marginLeft: -30 }}>
                  {carousel}
                </Grid.Column>
                <Grid.Column verticalAlign="middle">
                  <Button
                    basic
                    name="right"
                    circular
                    icon="angle right"
                    style={{
                      marginLeft: window.innerWidth <= 430 ? -5 : 0
                    }}
                    onClick={this.slideNext.bind(this)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <FiatGaugeModal
              symbol={this.state.symbol}
              show={this.state.showmodal}
              close={this.handleModal.bind(this)}
              data={this.state.data}
              buy={this.state.buy}
              sell={this.state.sell}
            />
          </div>
        )}
      </div>
    );
  }
}

export default translate(FiatHome);