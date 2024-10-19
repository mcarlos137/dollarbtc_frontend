import React, { Component } from "react";
import otcService from "../../services/otc";
import userService from "../../services/user";
import otc from "../../services/otc";
import axios from "axios";
import { Segment, Grid, Button, Divider } from "semantic-ui-react";
import Sockette from "sockette";
import config from "../../services/config";
import NumberFormat from "react-number-format";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
class BalanceCompromise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: [],
      availableCurrency: [],
      _isMounted: false,
      socketReady: false,
      bodyBalance: [],
      socket: null,
      valueBalance: "",
      valueBalance2: "",
      socketStatus: null,
      show: false,
      load: true,
      OTCAccountsBalance: "",
      otcBalance: [],
      selectedotcBalance: "",
      NewselectedotcBalance: [],
      statevarietyOtc: [],
      statevarietyValuebtc: [],
      statevarietyValueusd: [],
      stateobjectOTC: [],
    };
    this._isMounted = false;
    this.timer = null;
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (this.state.socket !== undefined && this.state.socket !== null) {
      if (!this.state.socket.open) this.state.socket.close();
      console.log("cerrando");
    }
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  componentDidMount() {
    this._isMounted = true;
    //this.getOTCAccountsBalance()
    this.getOTCAccounts();
    this.postOtcBalance();
  }
  initSoket() {
    if (this._isMounted) {
      this.setState({
        socket: new Sockette(URL_WEBSOCKET_DBTC +"/otcAdmin", {
          onopen: (e) => this.socketReady(e),
          onmessage: (e) => this.handleValueSocket(e.data),
        }),
      });
    }
  }
  handleValueSocket(data) {
    let value = JSON.parse(data); // se parsea porke el socket solo trae texto plano
    Object.entries(value.params.data).forEach(([key, value]) => {
      //la estructura del socket es value.params.data
      let currency = key;

      this.setState((state) => {
        const stateobjectOTC = state.stateobjectOTC.map((element) => {
          // se comparan las currency ke trae la data del socket vs las currency del array en el state
          //si se nota algun cambio en la data entrante del socket se actualiza el contenido del array
          //en el state
          if (element.id === currency) {
            if (value.totalBalance !== element.valueid.totalBalance) {
              element.valueid.totalBalance = value.totalBalance;
            }
            if (value.idealBalance !== element.valueid.idealBalance) {
              element.valueid.idealBalance = value.idealBalance;
            }
            element.valueid.values = value.values;
            return element;
          } else {
            return element;
          }
        });
        return { stateobjectOTC };
      });
    });
  }
  socketReady(e) {
    this.setState({ socketReady: true });
    let men = {
      method: "getClientsBalance",
      params: {
        websocketKey: window.sessionStorage.getItem("websocketKey"),
      },
    };
    try {
      this.state.socket.json(men);
    } catch (e) {
      console.log(e);
    }
  }

  reconnectSocket(operationId) {
    let ws = window.sessionStorage.getItem("sellOperationSocketId");
    ////console.log("en el reconnect ", ws);
    this.socketReady(operationId, ws);
  }

  getOTCAccounts = () => {
    /*var url =
			URL_BASE_DBTC +
			'/masterAccountNew/getOTCMasterAccountNames/' +
			userService.getUserName();
		axios
			.get(url)*/
    let url = otc.getMasterAccount(userService.getUserName());
    url
      .then((resp) => {
        var OTCaccountsArray = resp.data;
        var OTCAccountsToSelect = [];
        for (var i = 0; i < OTCaccountsArray.length; i++) {
          var objectToPush = {};
          objectToPush.key = OTCaccountsArray[i].name;
          objectToPush.text = OTCaccountsArray[i].description;
          var currenciesString = "";
          for (var j = 0; j < OTCaccountsArray[i].currencies.length; j++) {
            if (j > 0) {
              currenciesString += "_" + OTCaccountsArray[i].currencies[j];
            } else {
              currenciesString = OTCaccountsArray[i].currencies[j];
            }
          }
          objectToPush.value = OTCaccountsArray[i].name;
          OTCAccountsToSelect.push(objectToPush);
        }
        this.setState({
          otcBalance: OTCAccountsToSelect,
        });
      })
      .catch((error) => {});
  };

  handleChange(e, { value }) {
    this.setState({ selectedCurrency: value }, () => {});
  }

  handleChange2(e, { value }) {
    this.setState({ selectedotcBalance: value });
  }

  handleSubmiotOtc() {
    let body = {
      otcMasterAccounts: this.state.otcBalance,
    };
    //console.log(body)
    // let varietyOtc = [];
    // let varietyValuebtc = [];
    // let varietyValueusd = [];
    let objectOTC = [];
    otcService
      .getBalanceOtcOperations()
      .then((res) => {
        // console.log("res antes del for ", res)
        Object.entries(res.data).forEach(([key, value]) => {
          // console.log("dentro del primer object entries",res.data)//nombres de las otc
          if (key !== "BTC") {
            let currencies = this.props.currency.find(function (element) {
              return element.key === key;
            });
            // console.log(this.props.currency)
            let ob;
            if (currencies !== undefined) {
              ob = {
                id: key,
                name: currencies.text,
                valueid: value,
                active: false,
                changueNameBalance: "USD",
              };
            } else {
              ob = {
                id: key,
                name: key,
                valueid: value,
                active: false,
                changueNameBalance: "USD",
              };
            }

            objectOTC.push(ob);
          } else {
            let ob = {
              id: key,
              name: "Bitcoins",
              valueid: value,
              active: false,
              changueNameBalance: "BTC",
            };
            objectOTC.push(ob);
          }
        });
        this.setState(
          {
            stateobjectOTC: objectOTC,
          },
          () => {
            this.initSoket();
          }
        );
      })
      .catch((error) => {
        console.log("error get otcBalance ", error);
      });
    this.setState({
      bodyBalance: body,
    });
  }

  postOtcBalance() {
    this.handleSubmiotOtc();
  }

  showing(e, data) {
    this.setState((state) => {
      const stateobjectOTC = state.stateobjectOTC.map((element) => {
        //comparamos los atributos del compnente dinamico en el render, con los atributos del array de la variable de estado
        if (data.id === element.id) {
          // console.log(element)
          element.active = !element.active; // variable ke controla el clickeo de los eye Buttons
          return element;
        } else {
          return element;
        }
      });
      return { stateobjectOTC };
    });
  }

  makesplit(data) {
    let value = 0;
    Object.entries(data).forEach(([keyvalues, val]) => {
      if (keyvalues.includes("Balance")) {
        value = val;
      }
    });
    return value;
  }

  render() {
    //console.log(this.state.stateobjectOTC,"stateobjectOTC")
    const listItems = this.state.stateobjectOTC.map((selectionotc, index) => (
      <Grid.Column key={index} width={8}>
        <Segment>
          <b>{selectionotc.name}</b>
          <Divider></Divider>
          <Segment>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column textAlign="center">
                  <label>
                    <b>{"Balance total:"}</b>
                  </label>
                  <Button
                    circular
                    style={{ marginLeft: 10 }}
                    icon="eye"
                    color="blue"
                    id={selectionotc.id}
                    onClick={this.showing.bind(this)}
                  ></Button>
                </Grid.Column>
                {selectionotc.valueid.idealBalance !== undefined && (
                  <Grid.Column style={{ marginTop: 10 }} textAlign="center">
                    <label>
                      <b>{"Balance ideal:"}</b>
                    </label>
                  </Grid.Column>
                )}
              </Grid.Row>

              {selectionotc.valueid.totalBalance !== undefined && (
                <Grid.Row columns="equal">
                  <Grid.Column textAlign="center">
                    <NumberFormat
                      value={this.floorDecimals(
                        selectionotc.valueid.totalBalance,
                        selectionotc.id === "BTC" ? 8 : 2
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <NumberFormat
                      value={this.floorDecimals(
                        selectionotc.valueid.idealBalance,
                        selectionotc.id === "BTC" ? 8 : 2
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Grid.Column>
                </Grid.Row>
              )}
              <Divider hidden></Divider>
              {selectionotc.active === true && (
                <Grid.Row centered>
                  <Segment width={10} basic>
                    <Grid>
                      <Grid.Row columns="equal">
                        <Grid.Column textAlign="center">
                          {" "}
                          {/*style={{marginLeft:10}} */}
                          <label>
                            <b>{"Moneda"}</b>
                          </label>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                          <label>
                            <b>{"Balance"}</b>
                          </label>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                          {
                            <label>
                              <b>
                                {"Valor de cambio en " +
                                  selectionotc.changueNameBalance}
                              </b>
                            </label>
                          }
                        </Grid.Column>
                      </Grid.Row>
                      <Divider></Divider>
                      {selectionotc.valueid.values.map((val) => (
                        <Grid.Row key={val} columns="equal">
                          <Grid.Column textAlign="center">
                            <label>
                              <b>{val.currency}</b>
                            </label>
                          </Grid.Column>
                          <Grid.Column textAlign="center">
                            {selectionotc.id === "BTC" && (
                              <NumberFormat
                                value={this.floorDecimals(val.balance, 8)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            )}
                            {selectionotc.id !== "BTC" && (
                              <NumberFormat
                                value={this.floorDecimals(val.balance, 2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            )}
                          </Grid.Column>
                          <Grid.Column textAlign="center">
                            {selectionotc.id !== "BTC" && (
                              <NumberFormat
                                value={this.floorDecimals(
                                  this.makesplit(val),
                                  2
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            )}

                            {selectionotc.id === "BTC" && (
                              <NumberFormat
                                value={this.floorDecimals(
                                  this.makesplit(val),
                                  8
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      ))}
                    </Grid>
                  </Segment>
                </Grid.Row>
              )}
            </Grid>
          </Segment>
        </Segment>
      </Grid.Column>
    ));
    return (
      <div>
        <Grid>
          <Grid.Row columns="equal">{listItems}</Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default BalanceCompromise;
