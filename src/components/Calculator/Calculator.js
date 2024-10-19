import React, { Component } from "react";
import "./Calculator.css";
import {
  Segment,
  Grid,
  Divider,
  Header,
  Select,
  Item,
  Input,
  Container,
  Icon,
  Form,
  Label,
  Responsive
} from "semantic-ui-react";
import translate from "../../i18n/translate";
import NumberFormat from "react-number-format";
import logoBitcoin from "../../img/bitcoin-logo.png";
import iconSync from "../../img/icn-calculadora.png";

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseImg: "",
      baseValue: "",
      targetImg: "",
      targetValue: "",
      coins: [],
      coinsbase: "",
      coinstarget: "",
      errorBase: false,
      errorTarget: false,
      priceBase: "",
      priceTarget: "",
      marketPriceTarget: 0,
      marketPriceBase: 0,
      translator: props.translate
    };
    this.blankErrors = this.blankErrors.bind(this);
    this.calculatePrice = this.calculatePrice.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ coins: nextProps.coins });
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentWillMount() {}

  componentDidMount() {
    this.setState(
      {
        coins: this.props.coins
      },
      () => {
        let ob = {
          img: logoBitcoin,
          flag: logoBitcoin,
          text: "Bitcoin",
          value: "BTC",
          price: 1,
          priority: 0,
          name: ""
        };
        this.state.coins.push(ob);
      }
    );
  }
  handleBase(e, data) {
    if (data.value !== this.state.coinstarget) {
      let base = this.state.coins.find(function(element) {
        return data.value === element.value;
      });
      if (base !== undefined) {
        this.setState({
          baseImg: base.img,
          baseValue: base.text,
          coinsbase: data.value,
          priceBase: base.price.toLocaleString("en-US", {
            maximumFractionDigits: 2
          }),
          marketPriceBase: base.price
        });
      }
    } else {
      this.setState({
        errorBase: true,
        baseImg: "",
        baseValue: "",
        coinsbase: "",
        priceBase: "",
        marketPriceBase: 0
      });
    }
  }
  handleTarget(e, data) {
    if (data.value !== this.state.coinsbase) {
      let base = this.state.coins.find(function(element) {
        return data.value === element.value;
      });
      if (base !== undefined) {
        this.setState({
          targetImg: base.img,
          targetValue: base.text,
          coinstarget: data.value,
          priceTarget: base.price.toLocaleString("en-US", {
            maximumFractionDigits: 2
          }),
          marketPriceTarget: base.price
        });
      }
    } else {
      this.setState({
        errorTarget: true,
        targetImg: "",
        targetValue: "",
        coinstarget: "",
        priceTarget: "",
        marketPriceTarget: 0
      });
    }
  }
  blankErrors(target) {
    if (target === "base") {
      setTimeout(() => {
        this.setState({ errorBase: false });
      }, 6000);
    } else {
      setTimeout(() => {
        this.setState({ errorTarget: false });
      }, 6000);
    }
  }
  validateEntry(e) {}
  calculatePrice(value, name, id) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }

    let currencyTarget = this.state.coinstarget;
    let currencyBase = this.state.coinsbase;
    let decimales = Math.pow(10, 4);
    let element = this.state.coins.find(function(elem) {
      return id === elem.value;
    });
    let selectBase = this.state.coins.find(function(val) {
      return currencyBase === val.value;
    });

    let selectTarget = this.state.coins.find(function(val) {
      return currencyTarget === val.value;
    });

    if (element !== undefined) {
      if (element.price > 0) {
        let calc = val / element.price;
        if (name === "base") {
          console.log(val, id);
          let value = this.state.coins.find(function(coin) {
            return coin.value === currencyTarget;
          });
          if (value !== undefined) {
            if (value.value === "BTC") {
              let price = val / selectBase.price;
              this.setState({
                priceTarget: price,
                priceBase: val
              });
            } else {
              let price = value.price * calc;
              price = Math.floor(price * decimales) / decimales;
              this.setState({
                priceTarget: price,
                priceBase: val
              });
            }
          }
        } else {
          let value = this.state.coins.find(function(coin) {
            return coin.value === currencyBase;
          });
          console.log(val, id);
          if (value !== undefined) {
            if (value.value === "BTC") {
              let price = val / selectTarget.price;
              this.setState({
                priceBase: price,
                priceTarget: val
              });
            } else {
              let price = value.price * calc;
              price = Math.floor(price * decimales) / decimales;
              this.setState({
                priceBase: price,
                priceTarget: val
              });
            }
          }
        }
      }
    }
  }
  render() {
    let t = this.state.translator;
    let errorbase, errortarget, market1, market2;
    if (
      this.state.marketPriceBase !== 0 &&
      this.state.marketPriceTarget !== 0
    ) {
      market1 = (1 / this.state.marketPriceBase) * this.state.marketPriceTarget;
      if (this.state.coinstarget !== "BTC") {
        let resul1 = market1.toLocaleString("en-US", {
          maximumFractionDigits: 4
        });
        market1 = resul1;
      } else {
        let resul1 = market1.toLocaleString("en-US", {
          maximumFractionDigits: 8
        });
        market1 = resul1;
      }

      market2 = (1 / this.state.marketPriceTarget) * this.state.marketPriceBase;
      if (this.state.coinsbase !== "BTC") {
        market2 = market2.toLocaleString("en-US", {
          maximumFractionDigits: 4
        });
      } else {
        market2 = market2.toLocaleString("en-US", {
          maximumFractionDigits: 8
        });
      }
    }
    if (this.state.errorBase) {
      errorbase = (
        <Label basic color="red" pointing="below">
          {t("calculator.errors.target")}
        </Label>
      );
      this.blankErrors("base");
    }
    if (this.state.errorTarget) {
      errortarget = (
        <Label basic color="red" pointing="below">
          {t("calculator.errors.base")}
        </Label>
      );
      this.blankErrors("target");
    }
    return (
      <div>
        <Segment
          secondary
          style={{ borderStyle: "none" }}
          loading={this.state.coins.length > 0 ? false : true}
        >
          <Container>
            <Header as="h4" className="titleComponent" textAlign="center">
              {t("calculator.header")}
            </Header>
            <Divider style={{ color: "#207ef2 " }} />
            <Grid columns="equal" stretched doubling>
              <Grid.Column largeScreen={2} computer={2} tablet={2} mobile={2}>
                <p />
              </Grid.Column>
              <Grid.Column
                inline="true"
                largeScreen={6}
                computer={6}
                tablet={6}
                mobile={6}
              >
                {errorbase}
                <Select
                  onChange={this.handleBase.bind(this)}
                  placeholder={t("calculator.placeholderBase")}
                  options={this.state.coins}
                  size="tiny"
                  className="selectstyle"
                />
              </Grid.Column>
              <Grid.Column largeScreen={6} computer={6} tablet={6} mobile={6}>
                {errortarget}
                <Select
                  onChange={this.handleTarget.bind(this)}
                  placeholder={t("calculator.placeholderTarget")}
                  options={this.state.coins}
                  size="tiny"
                />
              </Grid.Column>
              <Grid.Column largeScreen={2} computer={2} mobile={2}>
                <p />
              </Grid.Column>
            </Grid>
            <Divider hidden />
            <Responsive
              as={Grid}
              columns="equal"
              stretched
              doubling
              minWidth={Responsive.onlyTablet.minWidth}
            >
              <Grid.Row>
                <Grid.Column
                  largeScreen={2}
                  computer={2}
                  tablet={2}
                  mobile={null}
                >
                  <p />
                </Grid.Column>
                <Grid.Column
                  largeScreen={12}
                  computer={12}
                  tablet={12}
                  mobile={16}
                >
                  <div style={{ textAlign: "center" }}>
                    <Form.Field inline>
                      <Item.Image
                        size="mini"
                        src={this.state.baseImg}
                        //circular
                        style={{ marginRight: "0px", marginTop: "-6px" }}
                      />
                      <Input
                        id={this.state.coinsbase}
                        name="base"
                        type={
                          <NumberFormat
                            placeholder={t("calculator.placeholderCoinBase")}
                            decimalScale={
                              this.state.coinsbase !== "BTC" ? 2 : 8
                            }
                            allowNegative={false}
                            thousandSeparator={true}
                            value={this.state.priceBase}
                            onKeyPress={this.validateEntry.bind(this)}
                            onValueChange={values => {
                              const { value } = values;
                              this.calculatePrice(
                                parseFloat(value),
                                "base",
                                this.state.coinsbase
                              );
                            }}
                          />
                        }
                      />

                      {/* <Icon name="" size="mini" /> */}
                      <Item.Image
                        size="mini"
                        src={iconSync}
                        circular
                        style={{ marginRight: "0px", marginTop: "-6px" }}
                      />
                      {/* <Icon
                        name=""
                        size="mini"
                        style={{ marginRight: "0px" }}
                      /> */}
                      <Input
                        id={this.state.coinstarget}
                        name="target"
                        type={
                          <NumberFormat
                            placeholder={t("calculator.placeholderCoinTarget")}
                            decimalScale={
                              this.state.coinstarget !== "BTC" ? 2 : 8
                            }
                            allowNegative={false}
                            thousandSeparator={true}
                            value={this.state.priceTarget}
                            onKeyPress={this.validateEntry.bind(this)}
                            onValueChange={values => {
                              const { value } = values;
                              this.calculatePrice(
                                parseFloat(value),
                                "target",
                                this.state.coinstarget
                              );
                            }}
                          />
                        }
                      />

                      <Item.Image
                        size="mini"
                        src={this.state.targetImg}
                        //circular
                        style={{ marginLeft: "0px", marginTop: "-6px" }}
                      />
                    </Form.Field>
                  </div>
                </Grid.Column>
                <Grid.Column
                  largeScreen={2}
                  computer={2}
                  tablet={2}
                  mobile={null}
                >
                  <p />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column
                  largeScreen={2}
                  computer={2}
                  tablet={2}
                  mobile={null}
                >
                  <p />
                </Grid.Column>
                <Grid.Column
                  largeScreen={6}
                  computer={6}
                  tablet={12}
                  mobile={16}
                >
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "-20px",
                      marginLeft: " 25px "
                    }}
                  >
                    <div>
                      1 {this.state.coinsbase} = {market1}{" "}
                      {this.state.coinstarget}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column
                  largeScreen={6}
                  computer={6}
                  tablet={12}
                  mobile={16}
                >
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "-20px",
                      marginRight: "25px "
                    }}
                  >
                    <div>
                      1 {this.state.coinstarget} = {market2}{" "}
                      {this.state.coinsbase}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column
                  largeScreen={2}
                  computer={2}
                  tablet={2}
                  mobile={null}
                >
                  <p />
                </Grid.Column>
              </Grid.Row>
            </Responsive>
            <Responsive as={Grid} {...Responsive.onlyMobile}>
              <Grid.Column width={16} textAlign="center">
                <Item.Image
                  size="mini"
                  src={this.state.baseImg}
                  circular
                  style={{ marginRight: "5px" }}
                />
                <Input
                  id={this.state.coinsbase}
                  name="base"
                  type={
                    <NumberFormat
                      placeholder={t("calculator.placeholderCoinBase")}
                      decimalScale={this.state.coinsbase !== "BTC" ? 2 : 8}
                      allowNegative={false}
                      thousandSeparator={true}
                      value={this.state.priceBase}
                      onKeyPress={this.validateEntry.bind(this)}
                      onValueChange={values => {
                        const { value } = values;
                        this.calculatePrice(
                          parseFloat(value),
                          "base",
                          this.state.coinsbase
                        );
                      }}
                    />
                  }
                />
              </Grid.Column>
              <Grid.Column width={16} textAlign="center">
                <Icon name="exchange" size="large" disabled />
              </Grid.Column>
              <Grid.Column width={16} textAlign="center">
                <Item.Image
                  size="mini"
                  src={this.state.targetImg}
                  circular
                  style={{ marginLeft: "5px" }}
                />
                <Input
                  id={this.state.coinstarget}
                  name="target"
                  type={
                    <NumberFormat
                      placeholder={t("calculator.placeholderCoinTarget")}
                      decimalScale={this.state.coinstarget !== "BTC" ? 2 : 8}
                      allowNegative={false}
                      thousandSeparator={true}
                      value={this.state.priceTarget}
                      onKeyPress={this.validateEntry.bind(this)}
                      onValueChange={values => {
                        const { value } = values;
                        this.calculatePrice(
                          parseFloat(value),
                          "target",
                          this.state.coinstarget
                        );
                      }}
                    />
                  }
                />
              </Grid.Column>
            </Responsive>
          </Container>
          <Divider hidden />
          <Divider hidden />
          <div className="textPrice">
            {/* <div>
              1 {this.state.coinsbase} ={market1} {this.state.coinstarget}
            </div>
            <div>
              1 {this.state.coinstarget} = {market2} {this.state.coinsbase}
            </div> */}
            <br />
            <p style={{ fontSize: "10px" }}>{t("calculator.footer")}</p>
          </div>
        </Segment>
      </div>
    );
  }
}
Calculator.propTypes = {};

export default translate(Calculator);
