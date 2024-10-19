import React, { Component } from "react";
import "./MobileCalculator.css";
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
import translate from "../../../i18n/translate";
import NumberFormat from "react-number-format";
import logoBitcoin from "../../../img/bitcoin-logo.png";

class MobileCalculator extends Component {
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
          loading={this.state.coins.length > 0 ? false : true}
        >
          <Container>
            <Header as="h3" textAlign="center" style={{color: "#207ef2"}}>
              {t("calculator.header")}
            </Header>
            <Divider hidden />
            <Grid columns="equal" stretched doubling>
              <Grid.Column largeScreen={2} computer={2} tablet={2} mobile={2}>
                <p />
              </Grid.Column>
              <Grid.Column
                inline="true"
                tablet={16}
                mobile={16}
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
              <Grid.Column
                inline="true"
                tablet={16}
                mobile={16}
              >
                <div align="center">
                <p textAlign="center" style={{color: "#207ef2"}}>A</p>
                </div>
               
                
              </Grid.Column>
              <Grid.Column tablet={16} mobile={16}>
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
         
              <Grid columns="equal" textAlign="center">
                  <Grid.Column>
                     <Item.Image
                       size="tiny"
                       src={this.state.baseImg}
                       circular
                       style={{ marginRight: "5px", marginBottom: 20 }}
                     />
                      <Input style={{ width: "130px" ,padding: "5px"}}
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
                   <Grid.Column>
                     <Item.Image
                       size="tiny"
                       src={this.state.targetImg}
                       circular
                       style={{ marginRight: "5px", marginBottom: 20 }}
                     />
                     
                       <Input style={{ width: "130px" ,padding: "5px"}}
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
                 </Grid>
          </Container>
          <Divider hidden />
          <Divider hidden />
           <Container id="container-pading-mobile">
             <div className="textPrice">
             {market1 !== 0  && market1 !== "0" && (<div style={{ fontWeight: "bold" }}>
                 1 {this.state.coinsbase} = {market1} {this.state.coinstarget}
             </div>) }
               {market2 !== 0 && market2 !== "0" &&( <div style={{ fontWeight: "bold" }}>
                 1 {this.state.coinstarget} = {market2} {this.state.coinsbase}
               </div>)}
               <br />
               <br />
               <p style={{ fontSize: "12px"}}>{t("calculator.footerMobile")}</p>
             </div>
           </Container>
        </Segment>
      </div>
    );
  }
}
//Calculator.propTypes = {};

export default translate(MobileCalculator);


// import React, { Component } from "react";
// import "./MobileCalculator.css";
// import {
//   Segment,
//   Grid,
//   Divider,
//   Header,
//   Select,
//   Item,
//   Input,
//   Container,
//   Icon,
//   Form,
//   Label
// } from "semantic-ui-react";
// import translate from "../../../i18n/translate";
// import logoBitcoin from "../../../img/bitcoin-logo.png";

// class MobileCalculator extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       baseImg: "",
//       baseValue: "",
//       targetImg: "",
//       targetValue: "",
//       coins: [],
//       coinsbase: "",
//       coinstarget: "",
//       errorBase: false,
//       errorTarget: false,
//       priceBase: "",
//       priceTarget: "",
//       marketPriceTarget: 0,
//       marketPriceBase: 0,
//       translator: props.translate
//     };
//     this.blankErrors = this.blankErrors.bind(this);
//     this.calculatePrice = this.calculatePrice.bind(this);
//   }
//   componentWillReceiveProps(nextProps, nextContext) {
//     this.setState({ coins: nextProps.coins });
//     if (this.props.language !== nextProps.language) {
//       this.setState({
//         translator: nextProps.translate
//       });
//     }
//   }
//   componentWillMount() {}

//   componentDidMount() {
//     this.setState(
//       {
//         coins: this.props.coins
//       },
//       () => {
//         let ob = {
//           img: logoBitcoin,
//           flag: logoBitcoin,
//           text: "Bitcoin",
//           value: "BTC",
//           price: 1,
//           priority: 0,
//           name: ""
//         };
//         this.state.coins.push(ob);
//       }
//     );
//   }

//   handleBase(e, data) {
//     if (data.value !== this.state.coinstarget) {
//       let base = this.state.coins.find(function(element) {
//         return data.value === element.value;
//       });

//       this.setState({
//         baseImg: base.img,
//         baseValue: base.text,
//         coinsbase: data.value,
//         priceBase: base.price.toLocaleString("en-US", {
//           maximumFractionDigits: 2
//         }),
//         marketPriceBase: base.price
//       });
//     } else {
//       this.setState({
//         errorBase: true,
//         baseImg: "",
//         baseValue: "",
//         coinsbase: "",
//         priceBase: "",
//         marketPriceBase: 0
//       });
//     }
//   }
//   handleTarget(e, data) {
//     if (data.value !== this.state.coinsbase) {
//       let base = this.state.coins.find(function(element) {
//         return data.value === element.value;
//       });
//       this.setState({
//         targetImg: base.img,
//         targetValue: base.text,
//         coinstarget: data.value,
//         priceTarget: base.price.toLocaleString("en-US", {
//           maximumFractionDigits: 2
//         }),
//         marketPriceTarget: base.price
//       });
//     } else {
//       this.setState({
//         errorTarget: true,
//         targetImg: "",
//         targetValue: "",
//         coinstarget: "",
//         priceTarget: "",
//         marketPriceTarget: 0
//       });
//     }
//   }
//   blankErrors(target) {
//     if (target === "base") {
//       setTimeout(() => {
//         this.setState({ errorBase: false });
//       }, 6000);
//     } else {
//       setTimeout(() => {
//         this.setState({ errorTarget: false });
//       }, 6000);
//     }
//   }
//   validateEntry(e) {}
//   calculatePrice(e, data) {
//     var numeros = "0123456789.";
//     let valid;
//     while (e.target.value.indexOf(",") !== -1)
//       e.target.value = e.target.value.replace(",", "");
//     if (e.target.value.length > 1) {
//       for (let elem in e.target.value) {
//         if (numeros.indexOf(e.target.value.charAt(elem), 0) !== -1) {
//           valid = true;
//         } else {
//           valid = false;
//         }
//       }
//     } else {
//       valid = true;
//     }
//     if (valid) {
//       let number = Number(e.target.value);
//       let currencyTarget = this.state.coinstarget;
//       let currencyBase = this.state.coinsbase;
//       let decimales = Math.pow(10, 4);
//       let element = this.state.coins.find(function(value) {
//         return data.id === value.value;
//       });
//       let calc = number / element.price;
//       if (data.name === "base") {
//         let value = this.state.coins.find(function(coin) {
//           return coin.value === currencyTarget;
//         });
//         let price = value.price * calc;
//         price = Math.floor(price * decimales) / decimales;
//         this.setState({
//           priceTarget: price.toLocaleString("en-US", {
//             maximumFractionDigits: 2
//           }),
//           priceBase: number.toLocaleString("en-US", {
//             maximumFractionDigits: 2
//           })
//         });
//       } else {
//         let value = this.state.coins.find(function(coin) {
//           return coin.value === currencyBase;
//         });
//         let price = value.price * calc;
//         price = Math.floor(price * decimales) / decimales;
//         this.setState({
//           priceBase: price.toLocaleString("en-US", {
//             maximumFractionDigits: 2
//           }),
//           priceTarget: number.toLocaleString("en-US", {
//             maximumFractionDigits: 2
//           })
//         });
//       }
//     }
//   }
//   render() {
//     let t = this.state.translator;
//     let errorbase, errortarget, market1, market2;
//     if (
//       this.state.marketPriceBase !== 0 &&
//       this.state.marketPriceTarget !== 0
//     ) {
//       market1 = (1 / this.state.marketPriceBase) * this.state.marketPriceTarget;
//       let resul1 = market1.toLocaleString("en-US", {
//         maximumFractionDigits: 4
//       });
//       market1 = resul1;
//       market2 = (1 / this.state.marketPriceTarget) * this.state.marketPriceBase;
//       market2 = market2.toLocaleString("en-US", {
//         maximumFractionDigits: 4
//       });
//     }
//     if (this.state.errorBase) {
//       errorbase = (
//         <Label basic color="red" pointing>
//           {t("calculator.errors.target")}
//         </Label>
//       );
//       this.blankErrors("base");
//     }
//     if (this.state.errorTarget) {
//       errortarget = (
//         <Label basic color="red" pointing>
//           {t("calculator.errors.base")}
//         </Label>
//       );
//       this.blankErrors("target");
//     }
//     return (
//       <div>
//         <Segment
//           textAlign="center"
//           // color="orange"
//           style={{
//             padding: 30,
//             backgroundColor: "#efefef",
//             borderColor: "white",
//             boxShadow: "none"
//           }}
//         >
//           <Header as="h3" className="titleComponent" textAlign="center">
//             {t("calculator.header")}
//           </Header>
//           <Divider hidden />
//           {/* <Form>
//             {" "}
//             {/*widths="equal"
//             <Form.Field>
//               {" "}
//               {/* inline*/}
//           {errorbase}
//           <Select
//             id="select-buy-mobile"
//             onChange={this.handleBase.bind(this)}
//             placeholder={t("calculator.placeholderBase")}
//             options={this.state.coins}
//             fluid
//             style={{
//               marginBottom: "20px"
//               //   marginRight: window.innerWidth <= 334 ? 30 : 0,window.innerWidth <= 495 ? 6 : 0
//               //   marginLeft: window.innerWidth <= 334 ? 30 : 0
//             }}
//           />
//           <span
//             id="indicator-label"
//             style={{
//               marginBottom: window.innerWidth <= 334 ? 6 : 0,
//               marginLeft: window.innerWidth <= 334 ? 55 : "",
//               marginRight: window.innerWidth <= 334 ? 45 : "",
//               marginTop: "20px",
//               color: "#207ef2"
//             }}
//           >
//             A
//           </span>{" "}
//           {errortarget}
//           <Select
//             id="select-sell-mobile"
//             onChange={this.handleTarget.bind(this)}
//             placeholder={t("calculator.placeholderTarget")}
//             options={this.state.coins}
//             fluid
//             style={{
//               marginRight: window.innerWidth <= 334 ? 30 : 0,
//               marginLeft: window.innerWidth <= 334 ? 35 : 0,
//               marginTop: "20px"
//             }}
//           />
//           {/* </Form.Field>
//           </Form> */}
//           <Grid columns="equal">
//             <div style={{ marginTop: "5px", marginBottom: "5px" }} />
//             <Grid.Row>
//               <Grid.Column textAlign="center">
//                 {/* <Item.Image size="mini" src={this.state.baseImg} circular /> */}
//               </Grid.Column>
//               <Grid.Column textAlign="center">
//                 {/* <Item.Image size="mini" src={this.state.targetImg} circular /> */}
//               </Grid.Column>
//             </Grid.Row>
//             <div style={{ marginTop: "5px", marginBottom: "5px" }} />
//           </Grid>
//           <Grid.Row>
//             <Form.Group>
//               <Form.Field inline>
//                 {/* <Input
//                   placeholder={t("calculator.placeholderCoinBase")}
//                   name="base"
//                   className="calculator-imput-mobile"
//                   id={this.state.coinsbase}
//                   value={this.state.priceBase}
//                   onChange={this.calculatePrice.bind(this)}
//                   onKeyPress={this.validateEntry.bind(this)}
//                   style={{
//                     marginBottom: window.innerWidth <= 495 ? 6 : 0,
//                     marginRight: window.innerWidth <= 334 ? 30 : 0,
//                     marginLeft: window.innerWidth <= 334 ? 30 : 0
//                   }}
//                 />{" "} */}
//                 {/* <Icon
//                   name="exchange"
//                   size="large"
//                   disabled
//                   id="icon-mobile-calculator"
//                   style={{
//                     marginBottom: window.innerWidth <= 334 ? 6 : 0,
//                     marginLeft: window.innerWidth <= 334 ? 55 : "",
//                     marginRight: window.innerWidth <= 334 ? 45 : ""
//                   }}
//                 /> */}
//                 {/* <Input
//                   placeholder={t("calculator.placeholderCoinTarget")}
//                   name="target"
//                   className="calculator-imput-mobile"
//                   value={this.state.priceTarget}
//                   id={this.state.coinstarget}
//                   onChange={this.calculatePrice.bind(this)}
//                   onKeyPress={this.validateEntry.bind(this)}
//                   style={{
//                     marginRight: window.innerWidth <= 334 ? 30 : 0,
//                     marginLeft: window.innerWidth <= 334 ? 35 : 0
//                   }}
//                 /> */}
//                 <Grid columns="equal">
//                   <Grid.Column>
//                     <Item.Image
//                       size="tiny"
//                       src={this.state.baseImg}
//                       circular
//                       style={{ marginRight: "5px", marginBottom: 20 }}
//                     />
//                     <Item.Content style={{ fontSize: 20 }}>
//                       {this.state.priceBase}
//                     </Item.Content>
//                   </Grid.Column>
//                   <Grid.Column>
//                     <Item.Image
//                       size="tiny"
//                       src={this.state.targetImg}
//                       circular
//                       style={{
//                         marginBottom: 20
//                       }}
//                     />
//                     <Item.Content style={{ fontSize: 20 }}>
//                       {this.state.priceTarget}
//                     </Item.Content>
//                   </Grid.Column>
//                 </Grid>
//               </Form.Field>
//             </Form.Group>
//           </Grid.Row>
//           <Divider hidden />
//           <Container id="container-pading-mobile">
//             <div className="textPrice">
//               <div style={{ fontWeight: "bold" }}>
//                 1 {this.state.coinsbase} = {market1} {this.state.coinstarget}
//               </div>
//               <div style={{ fontWeight: "bold" }}>
//                 1 {this.state.coinstarget} = {market2} {this.state.coinsbase}
//               </div>
//               <br />
//               <br />
//               <p style={{ fontSize: "14px" }}>{t("calculator.footer")}</p>
//             </div>
//           </Container>
//         </Segment>
//       </div>
//     );
//   }
// }

// export default translate(MobileCalculator);
