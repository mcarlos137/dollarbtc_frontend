import React, { Component } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {
  Segment,
  Image,
  Button,
  Header,
  Grid,
  Divider,
} from "semantic-ui-react";
import "./MobileFiat.css";
import FiatGaugeModal from "../../Home/FiatGaugeModal/FiatGaugeModal";
import translate from "../../../i18n/translate";
import packageJson from "../../../../package.json";
class MobileFiat extends Component {
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
      translator: props.translate,
      mobileFiatClient: packageJson.designCompany,
      activeSeeMore: false,
      activeButton: false,
      activeButtonNo: false,
    };
    this._isMounted = false;
  }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 4 },
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
        translator: nextProps.translate,
      });
    }
  }
  handleClickItemStatic(e, data) {
    let el = this.props.coins.find(function (element) {
      return data.name === element.value;
    });
    this.setState({
      symbol: "BTC" + data.name,
      showmodal: true,
      data: el.percent,
      buy: el.buy,
      sell: el.sell,
    });
  }
  handleClickFiat(e, data) {
    this.setState({
      activeSeeMore: true,
      activeButton: true,
      activeButtonNo: true,
    });
  }
  handleClickFiatNo(e, data) {
    this.setState({
      activeSeeMore: false,
      activeButton: false,
      activeButtonNo: false,
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
    let fiatCurrencies = this.props.coins.filter((c) => {
      return (
        c.value !== "ETH" &&
        c.value !== "BTC" &&
        c.value !== "CLP" &&
        c.value !== "PEN" &&
        c.value !== "DOP" &&
        c.value !== "BRL" &&
        c.value !== "ARS" &&
        c.value !== "MXN" &&
        c.value !== "CNY" &&
        c.value !== "RUB" &&
        c.value !== "INR" &&
        c.value !== "CAD" &&
        c.value !== "JPY" &&
        c.value !== "CHF" &&
        c.value !== "CRC" &&
        c.value !== "PAB" &&
        c.value !== "PA_USD"
      );
    });
    let listItem = fiatCurrencies.map((item, i) => (
      <Segment key={`key-${i}`} basic>
        <div>
          <Header textAlign="center" as="h2">
            <Image src={item.img} className="file-style" size="tiny" />
            <span className="head-style"> BTC / {item.value} </span>
          </Header>
        </div>
        <Header
          textAlign="center"
          style={{ marginTop: "15px", marginBottom: "17px" }}
        >
          {item.buy !== 0 && (
            <div className="price-style">
              {t("fiatCarouselStatistics.buy")}{" "}
              {item.buy.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
            </div>
          )}
          {item.sell !== 0 && (
            <div className="price-style">
              {t("fiatCarouselStatistics.sell")}{" "}
              {item.sell.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
            </div>
          )}
          {item.usd_price !== 0 && (
            <div className="price-conver-style">
              {t("fiatCarouselStatistics.usdChange")} ->{" "}
              {item.usd_price.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value !== "VES" && (
            <div className="price-conver-style">
              {t("fiatCarouselStatistics.forexPrice")} ->{" "}
              {item.forex_price.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value === "VES" && (
            <div className="price-conver-style">
              <br />
            </div>
          )}
        </Header>
        <div>
          <Header textAlign="center">
            <Button
              color="blue"
              size="tiny"
              compact
              name={item.value}
              onClick={this.handleClickItemStatic.bind(this)}
              style={{
                borderRadius: "40px/40px",
                height: "40px",
                width: "200px",
              }}
            >
              <span style={{ fontSize: "9px" }}>
                {" "}
                {t("fiatCarouselStatistics.statistics")}
              </span>
            </Button>
          </Header>
        </div>
      </Segment>
    ));

    let fiatCurrenciesMore = this.props.coins.filter((c) => {
      return (
        c.value !== "ETH" &&
        c.value !== "BTC" &&
        c.value !== "USD" &&
        c.value !== "VES" &&
        c.value !== "COP" &&
        c.value !== "EUR"
      );
    });
    let listItemMore = fiatCurrenciesMore.map((item, i) => (
      <Segment key={`key-${i}`} basic>
        <div>
          <Header textAlign="center" as="h2">
            <Image src={item.img} className="file-style" size="tiny" />
            <span className="head-style"> BTC / {item.value} </span>
          </Header>
        </div>
        <Header
          textAlign="center"
          style={{ marginTop: "15px", marginBottom: "17px" }}
        >
          {item.buy !== 0 && (
            <div className="price-style">
              {t("fiatCarouselStatistics.buy")}{" "}
              {item.buy.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
            </div>
          )}
          {item.sell !== 0 && (
            <div className="price-style">
              {t("fiatCarouselStatistics.sell")}{" "}
              {item.sell.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
            </div>
          )}
          {item.usd_price !== 0 && (
            <div className="price-conver-style">
              {t("fiatCarouselStatistics.usdChange")} ->{" "}
              {item.usd_price.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value !== "VES" && (
            <div className="price-conver-style">
              {t("fiatCarouselStatistics.forexPrice")} ->{" "}
              {item.forex_price.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}{" "}
              {item.value}
            </div>
          )}
          {item.usd_price !== 0 && item.value === "VES" && (
            <div className="price-conver-style">
              <br />
            </div>
          )}
        </Header>
        <div>
          <Header textAlign="center">
            <Button
              color="blue"
              size="tiny"
              compact
              name={item.value}
              onClick={this.handleClickItemStatic.bind(this)}
              style={{
                borderRadius: "40px/40px",
                height: "40px",
                width: "200px",
              }}
            >
              <span style={{ fontSize: "9px" }}>
                {" "}
                {t("fiatCarouselStatistics.statistics")}
              </span>
            </Button>
          </Header>
        </div>
      </Segment>
    ));

    // if (this._isMounted) {
    //   carousel = (
    //     <AliceCarousel
    //       id="alice-custom"
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
    //       itemsInSlide={2}
    //     />
    //   );
    // }
    return (
      <div>
        <div align="center">
          {/* <Segment basic>
                <Header textAlign="center" as="h3"  style={{fontWeight:"900",color: "#207ef2"}}>
                  <strong>{t("home.shortcut.priceReferential")}</strong>
                </Header> 
                <Divider style={{ borderColor: "#207ef2" }} />
                </Segment> */}
          <Divider hidden></Divider>
          <Grid.Row>
            <Grid.Column>
              <Segment
                inverted
                color={
                  this.state.mobileFiatClient === "MAIN" ||
                  this.state.mobileFiatClient === "CONVERTRUE"
                    ? "orange"
                    : "black"
                }
              >
                <Header
                  as="h4"
                  style={{ textAlign: "center" }}
                  inverted
                  color="white"
                >
                  {t("fiatCarouselStatistics.footerLabel")}
                </Header>
              </Segment>
              <Divider hidden></Divider>
            </Grid.Column>
          </Grid.Row>
        </div>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column verticalAlign="middle" textAlign="center">
              {/* <Button
                    basic
                    name="left"
                    circular
                    style={{
                      marginLeft: window.innerWidth <= 430 ? 0 : -20
                    }}
                    icon="angle left"
                    onClick={this.slidePrev.bind(this)}
                  /> */}
            </Grid.Column>
            {/* <Grid.Column computer={4}>
                <Segment
                  textAlign="center"
                  color="orange"
                  inverted
                  padded="very"
                  fluid
                  size="huge"
                >
                  <Header> Google Adsense</Header>
                </Segment>
              </Grid.Column> */}
            <Grid.Column mobile={16}>
              {listItem}
              {/* <div align="center">
                  <Divider style={{ borderColor: "#207ef2",marginLeft:15,marginRight:15}} />
                  </div> */}
              {this.state.activeSeeMore === true && listItemMore}
              {this.state.activeButton !== true && (
                <div align="center">
                  <Divider
                    style={{
                      borderColor: "#207ef2",
                      marginLeft: 15,
                      marginRight: 15,
                    }}
                  />

                  <Button
                    basic
                    // color="blue"
                    name="more"
                    onClick={this.handleClickFiat.bind(this)}
                    style={{
                      borderRadius: "40px/40px",
                      height: "40px",
                      width: "200px",
                    }}
                  >
                    <span>{t("home.shortcut.seeMore")}</span>
                  </Button>
                </div>
              )}
              {this.state.activeButtonNo === true && (
                <div align="center">
                  <Button
                    color="grey"
                    name="nomore"
                    onClick={this.handleClickFiatNo.bind(this)}
                    style={{
                      borderRadius: "40px/40px",
                      height: "40px",
                      width: "200px",
                    }}
                  >
                    <span style={{ color: "white", fontSize: "10px" }}>
                      {t("home.shortcut.hide")}
                    </span>
                  </Button>
                </div>
              )}
            </Grid.Column>
            {/* <Grid.Column computer={4}>
                <Segment
                  textAlign="center"
                  color="orange"
                  inverted
                  padded="very"
                  fluid
                  size="huge"
                >
                  <Header> Google Adsense</Header>
                </Segment>
              </Grid.Column> */}
            <Grid.Column verticalAlign="middle">
              {/* <Button
                    basic
                    name="right"
                    circular
                    icon="angle right"
                    style={{
                      marginLeft: window.innerWidth <= 430 ? -5 : 0
                    }}
                    onClick={this.slideNext.bind(this)}
                  /> */}
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
    );
  }
}

export default translate(MobileFiat);
