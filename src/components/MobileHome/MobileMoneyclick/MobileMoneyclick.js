import React, { Component } from "react";
import { Grid, Segment, Icon, Divider } from "semantic-ui-react";
import "../MobileHome.css";
import translate from "../../../i18n/translate";

class MobileMoneyclick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      balanceBtc: "",
      balanceOtherCurrenciesColOne: [],
      balanceOtherCurrenciesColTwo: [],
      user: window.sessionStorage.getItem("username")
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  floorDecimals(value, numberDecimals) {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  }
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  componentDidMount() {
    let balanceMoneyclick = JSON.parse(
      window.sessionStorage.getItem("balanceMoneyClick")
    );
    if (balanceMoneyclick !== null) {
      this.getBalance(balanceMoneyclick);
    }
  }
  getBalance(balanceMoneyClick) {
    if (this.state.user !== null) {
      let currenciesColOne = [];
      let currenciesColTwo = [];
      Object.entries(balanceMoneyClick).forEach(([key, value], index) => {
        if (
          key !== "usdEstimatedBalance" &&
          key !== "btcEstimatedBalance" &&
          key !== "BTC"
        ) {
          const module = index % 2;
          let obj = {};
          obj.currency = key;
          Object.entries(value).forEach(([k, v]) => {
            if (k === "availableBalance") {
              obj.balance = v;
              if (module === 0) {
                currenciesColOne.push(obj);
                this.setState({
                  balanceOtherCurrenciesColOne: currenciesColOne
                });
              } else {
                currenciesColTwo.push(obj);
                this.setState({
                  balanceOtherCurrenciesColTwo: currenciesColTwo
                });
              }
            }
          });
        }
      });
    }
  }
  render() {
    let t = this.state.translator;
    return (
      //   <Segment raised color="blue">
      //   <Grid>
      //     <Grid.Row>
      //       <Grid.Column mobile={7} tablet={8} textAlign="center">
      //         <div className="label-home-mobile">
      //           <span>{t("homeMobile.moneyClick.header")}</span>
      //         </div>
      //       </Grid.Column>
      //       <Grid.Column mobile={9} tablet={8} textAlign="center">
      //         <p className="content-menu">
      //           <span>
      //             <span className="balance">
      //               {t("homeMobile.balance.content.balance")}
      //             </span>
      //             <span style={{ color: "#207ef2 ", marginLeft: "1 px" }}>
      //               {this.state.balanceBtc !== ""
      //                 ? this.floorDecimals(this.state.balanceBtc, 8)
      //                 : 0}
      //             </span>
      //             <Icon
      //               name="btc"
      //               style={{ color: "#207ef2 ", marginRight: "1 px" }}
      //             />
      //             <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
      //             {this.state.balanceOtherCurrenciesColOne.length !== 0 &&
      //               this.state.balanceOtherCurrenciesColOne.map((item, index) => (
      //                 <div key={index}>
      //                   <span className="balance">
      //                     {item.currency}
      //                     {":"}
      //                   </span>
      //                   <span style={{ color: "#207ef2 ", marginLeft: "1 px" }}>
      //                     {item.balance !== null
      //                       ? item.balance.toLocaleString("en-US", {
      //                           maximumFractionDigits: 2
      //                         })
      //                       : 0}
      //                   </span>
      //                   <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
      //                 </div>
      //               ))}
      //             <span className="balance">
      //               {t("homeMobile.moneyClick.download")}
      //             </span>
      //           </span>
      //         </p>
      //       </Grid.Column>
      //     </Grid.Row>
      //   </Grid>
      // </Segment>

      <Segment raised secondary>
        <div align="center">
          <label textAlign="center">
            <strong>{t("homeMobile.moneyClick.header")}</strong>
          </label>
        </div>
        <Grid style={{ marginTop: 10 }}>
          <Grid.Row>
            <Grid.Column mobile={7} tablet={8}>
              <p>
                <span>
                  {this.state.balanceOtherCurrenciesColTwo.length !== 0 &&
                    this.state.balanceOtherCurrenciesColTwo.map(
                      (item, index) => (
                        <div key={index}>
                          <span className="balance">
                            {item.currency}
                            {":"}
                          </span>
                          <span
                            style={{ color: "#207ef2 ", marginLeft: "1 px" }}
                          >
                            {item.balance !== null
                              ? item.balance.toLocaleString("en-US", {
                                  maximumFractionDigits: 2
                                })
                              : 0}
                          </span>
                          <Divider
                            hidden
                            style={{ margin: "4px 0px 4px 0px" }}
                          />
                        </div>
                      )
                    )}
                </span>
              </p>
            </Grid.Column>
            <Grid.Column mobile={1} tablet={6}>
              <Divider vertical></Divider>
            </Grid.Column>
            <Grid.Column mobile={7} tablet={8}>
              <p>
                <span>
                  {this.state.balanceOtherCurrenciesColOne.length !== 0 &&
                    this.state.balanceOtherCurrenciesColOne.map(
                      (item, index) => (
                        <div key={index}>
                          <span className="balance">
                            {item.currency}
                            {":"}
                          </span>
                          <span
                            style={{ color: "#207ef2 ", marginLeft: "1 px" }}
                          >
                            {item.balance !== null
                              ? item.balance.toLocaleString("en-US", {
                                  maximumFractionDigits: 2
                                })
                              : 0}
                          </span>
                          <Divider
                            hidden
                            style={{ margin: "4px 0px 4px 0px" }}
                          />
                        </div>
                      )
                    )}
                </span>
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider></Divider>
        <div align="center" style={{ marginTop: 10 }}>
          <label className="balance" textAlign="center">
            <strong>{t("homeMobile.moneyClick.download")}</strong>
          </label>
        </div>
      </Segment>
    );
  }
}

export default translate(MobileMoneyclick);
