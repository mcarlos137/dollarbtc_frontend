import React, { Component } from "react";
import {
  Segment,
  Grid,
  Form,
  Dimmer,
  Loader,
  List,
  Responsive,
  Divider
} from "semantic-ui-react";
import NumberFormat from "react-number-format";
import translate from "../../../../i18n/translate";
import RetailService from "../../../../services/moneyclick";
import currency from "../../../../common/currency";
import { isMobile } from "react-device-detect";

class Retail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      loading: false,
      escrowBalance: {},
      escrowLimits: [],
      cashBalance: [],
      noCashBalance: [],
      name: "",
      description: "",
      coordinate: "",
      currencies: [],
      idRetail: this.props.idRetail,
      actualLimitEscrow: "",
      retails: [],
      balanceAvailable: false,
      balanceAvailableUser: "",
      email: "",
      estatusCreate: ""
    };
    this._Mounted = false;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    this._Mounted = true;
    let balance = JSON.parse(window.sessionStorage.getItem("userBalanceBTC"));
    if (balance !== null) {
      this.getBalanceUser(balance);
    }
    if (this.props.idRetail !== "") {
      this.getBalance(this.props.idRetail);
      this.getInfoRetail(this.props.idRetail);
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.idRetail !== this.props.idRetail &&
      this.props.idRetail !== ""
    ) {
      this.getInfoRetail(this.props.idRetail);
      this.getBalance(this.props.idRetail);
    }
  }
  getBalanceUser(balance) {
    Object.entries(balance).forEach(([key, value]) => {
      if (key === "available") {
        if (value === 0) {
          this.setState({ balanceAvailable: true });
        } else {
          this.setState({ balanceAvailableUser: value });
        }
      }
    });
  }
  getBalance(idRetail) {
    this.setState({ loading: true });
    RetailService.getBalanceRetail(idRetail)
      .then(resp => {
        this.setState({
          cashBalance: resp.data.cashBalance,
          noCashBalance: resp.data.noCashBalance,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getInfoRetail(idRetail) {
    RetailService.getInfoRetail(idRetail)
      .then(resp => {
        console.log(resp.data);
        let curren = resp.data.currencies;
        let array = [];
        let obCurren = {};
        let coordinates =
          resp.data.coordinate.latitude + "," + resp.data.coordinate.longitude;
        for (let val of curren) {
          let currencyFiltered = currency.currencies.filter(currency => {
            return currency.value === val;
          });

          if (currencyFiltered !== undefined && currencyFiltered.length > 0) {
            obCurren.value = currencyFiltered[0].value;
            obCurren.img = currencyFiltered[0].img;
          }
          array.push(obCurren);
        }
        this.setState({
          escrowBalance: resp.data.escrowBalances,
          name: resp.data.title,
          description: resp.data.description,
          email: resp.data.email,
          estatusCreate: resp.data.mcRetailCreateStatus,
          coordinate: coordinates,
          currencies: array,
          escrowLimits: resp.data.escrowLimits
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentWillUnmount() {
    this._Mounted = false;
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };

  render() {
    let t = this.state.translator;
    let mount = this._Mounted;
    return (
      <div>
        {!isMobile && (
          <Segment basic>
            <div>
              <Dimmer.Dimmable dimmed={!this.state.loading}>
                <Dimmer active={this.state.loading} inverted>
                  <Loader>{t("profile.optionDetail.loading")}</Loader>
                </Dimmer>
                <Grid columns="equal">
                  <Grid.Row>
                    <Grid.Column
                      largeScreen={8}
                      mobile={16}
                      tablet={8}
                      computer={8}
                    >
                      {Object.keys(this.state.escrowBalance).length > 0 && (
                        <Segment secondary>
                          <Grid columns="equal">
                            <Grid.Row>
                              <Grid.Column width={8}>
                                <p>
                                  {t(
                                    "profile.optionPointsOfSales.menu.retail.escrow"
                                  )}
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                            {Object.entries(this.state.escrowBalance).map(
                              ([key, value]) => (
                                <Grid.Row key={key} style={{ marginTop: -20 }}>
                                  <Grid.Column width={8}>
                                    <p style={{ marginLeft: 8 }}>{key}</p>
                                  </Grid.Column>
                                  <Grid.Column textAlign="right">
                                    <p style={{ marginRight: 10 }}>
                                      {value.toLocaleString("en-US", {
                                        maximumFractionDigits: 2
                                      })}
                                    </p>
                                  </Grid.Column>
                                </Grid.Row>
                              )
                            )}
                            <Divider style={{ margin: "-0.5rem 0 0.4rem 0" }} />
                            <Grid.Row>
                              <Grid.Column width={10}>
                                <p>
                                  {t(
                                    "profile.optionPointsOfSales.menu.retail.escrowLimit"
                                  )}
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                            {this.state.escrowLimits.map((item, index) => (
                              <Grid.Row key={index} style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p style={{ marginLeft: 8 }}>
                                    {item.currency}
                                  </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  <p style={{ marginRight: 10 }}>
                                    {item.amount.toLocaleString("en-US", {
                                      maximumFractionDigits: 2
                                    })}
                                  </p>
                                </Grid.Column>
                              </Grid.Row>
                            ))}
                          </Grid>
                        </Segment>
                      )}
                    </Grid.Column>
                    <Grid.Column
                      largeScreen={8}
                      mobile={16}
                      tablet={8}
                      computer={8}
                    >
                      {(this.state.cashBalance.length > 0 ||
                        this.state.noCashBalance.length > 0) && (
                        <Segment secondary>
                          <Grid columns="equal">
                            <Grid.Row>
                              <Grid.Column width={10}>
                                <p>
                                  {t(
                                    "profile.optionPointsOfSales.menu.retail.cash"
                                  )}
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                            {this.state.cashBalance.map((item, index) => (
                              <Grid.Row key={index} style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p style={{ marginLeft: 8 }}>
                                    {item.currency}
                                  </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  <p style={{ marginRight: 10 }}>
                                    {item.amount.toLocaleString("en-US", {
                                      maximumFractionDigits: 2
                                    })}
                                  </p>
                                </Grid.Column>
                              </Grid.Row>
                            ))}
                            <Divider style={{ margin: "-0.5rem 0 0.4rem 0" }} />
                            <Grid.Row>
                              <Grid.Column width={10}>
                                <p>
                                  {t(
                                    "profile.optionPointsOfSales.menu.retail.noCash"
                                  )}
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                            {this.state.noCashBalance.map((item, index) => (
                              <Grid.Row key={index} style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p style={{ marginLeft: 8 }}>
                                    {item.currency}
                                  </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  <p style={{ marginRight: 10 }}>
                                    {item.amount.toLocaleString("en-US", {
                                      maximumFractionDigits: 2
                                    })}
                                  </p>
                                </Grid.Column>
                              </Grid.Row>
                            ))}
                          </Grid>
                        </Segment>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column
                      largeScreen={16}
                      mobile={16}
                      tablet={16}
                      computer={16}
                    >
                      <Grid.Row>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.id"
                                )}
                              </label>
                              <p>{this.props.idRetail}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.name"
                                )}
                              </label>
                              <p>{this.state.name}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.description"
                                )}
                              </label>
                              <p>{this.state.description}</p>
                            </Form.Field>
                          </Form.Group>
                        </Form>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column
                      largeScreen={11}
                      mobile={8}
                      tablet={10}
                      computer={11}
                    >
                      <Form>
                        <Form.Group widths="equal">
                          <Form.Field>
                            <label>
                              {" "}
                              {t(
                                "profile.optionPointsOfSales.menu.retail.email"
                              )}
                            </label>
                            <p>{this.state.email}</p>
                          </Form.Field>
                          <Form.Field>
                            <label>
                              {" "}
                              {t(
                                "profile.optionPointsOfSales.menu.retail.statusCreated"
                              )}
                            </label>
                            <p>
                              {this.state.estatusCreate === "ACTIVATED" &&
                                t(
                                  "profile.optionPointsOfSales.menu.retail.ACTIVATED"
                                )}
                              {this.state.estatusCreate === "FAIL" &&
                                t(
                                  "profile.optionPointsOfSales.menu.retail.FAIL"
                                )}
                              {this.state.estatusCreate === "SENDED" &&
                                t(
                                  "profile.optionPointsOfSales.menu.retail.SENDED"
                                )}
                              {this.state.estatusCreate === "ANALYSING" &&
                                t(
                                  "profile.optionPointsOfSales.menu.retail.ANALYSING"
                                )}
                            </p>
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Grid.Column>
                    <Grid.Column
                      largeScreen={5}
                      mobile={8}
                      tablet={6}
                      computer={5}
                    >
                      <Form style={{ marginLeft: -23 }}>
                        <Form.Group>
                          <Form.Field>
                            <label>
                              {" "}
                              {t(
                                "profile.optionPointsOfSales.menu.retail.coordinates"
                              )}
                            </label>
                            <p>{this.state.coordinate}</p>
                          </Form.Field>
                        </Form.Group>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Dimmer.Dimmable>
            </div>
          </Segment>
        )}
        {isMobile && (
          <Responsive>
            <Segment basic>
              {Object.keys(this.state.escrowBalance).length > 0 && (
                <Segment secondary>
                  <Grid columns="equal">
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <p>
                          {t("profile.optionPointsOfSales.menu.retail.escrow")}
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                    {Object.entries(this.state.escrowBalance).map(
                      ([key, value]) => (
                        <Grid.Row key={key} style={{ marginTop: -20 }}>
                          <Grid.Column width={8}>
                            <p style={{ marginLeft: 8 }}>{key}</p>
                          </Grid.Column>
                          <Grid.Column textAlign="right">
                            <p style={{ marginRight: 10 }}>
                              {value.toLocaleString("en-US", {
                                maximumFractionDigits: 2
                              })}
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                      )
                    )}
                  </Grid>
                </Segment>
              )}
              <Segment basic>
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      largeScreen={16}
                      mobile={16}
                      tablet={16}
                      computer={16}
                    >
                      <Grid.Row>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.id"
                                )}
                              </label>
                              <p>{this.props.idRetail}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.name"
                                )}
                              </label>
                              <p>{this.state.name}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.description"
                                )}
                              </label>
                              <p>{this.state.description}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.coordinates"
                                )}
                              </label>
                              <p>{this.state.coordinate}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.email"
                                )}
                              </label>
                              <p>{this.state.email}</p>
                            </Form.Field>
                            <Form.Field>
                              <label>
                                {" "}
                                {t(
                                  "profile.optionPointsOfSales.menu.retail.statusCreated"
                                )}
                              </label>
                              <p>
                                {this.state.estatusCreate === "ACTIVATED" &&
                                  t(
                                    "profile.optionPointsOfSales.menu.retail.ACTIVATED"
                                  )}
                                {this.state.estatusCreate === "FAIL" &&
                                  t(
                                    "profile.optionPointsOfSales.menu.retail.FAIL"
                                  )}
                                {this.state.estatusCreate === "SENDED" &&
                                  t(
                                    "profile.optionPointsOfSales.menu.retail.SENDED"
                                  )}
                                {this.state.estatusCreate === "ANALYSING" &&
                                  t(
                                    "profile.optionPointsOfSales.menu.retail.ANALYSING"
                                  )}
                              </p>
                            </Form.Field>
                          </Form.Group>
                        </Form>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Segment>
          </Responsive>
        )}
      </div>
    );
  }
}
export default translate(Retail);
