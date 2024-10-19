import React, { Component } from "react";
import {
  Grid,
  Card,
  Image,
  Button,
  List,
  Message,
  Segment
} from "semantic-ui-react";
import ves from "../../../../img/ve.svg";
import Gauge from "react-canvas-gauge";
import localb from "../../../../img/localbitcoin.png";
import hitbtc from "../../../../img/hitbtc-review-logo (1).png";
import config from "../../../../services/config";
import Sockette from "sockette";
import uuid from "uuid";
import addressApi from "../../../../services/address";
import "../MarketOperations.css";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
export default class MarketBuy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 80,
      viewPayments: true,
      indexPayment: null,
      viewWallets: true,
      indexWallets: null,
      viewMessages: false,
      load: false,
      selectedPaymentId: "",
      selectedAddressId: "",
      viewMessagesEnd: false,
      messageEnd: "",
      socket: null
    };
    this._isMounted = false;
    this.handleExecute = this.handleExecute.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.socketReady = this.socketReady.bind(this);
    this.handleResponseSocket = this.handleResponseSocket.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    if (
      window.sessionStorage.getItem("websocketKey") === undefined ||
      window.sessionStorage.getItem("websocketKey") === null
    ) {
      window.sessionStorage.setItem("websocketKey", uuid.v4());
    }
    this.connectSocket();
  }
  connectSocket() {
    if (this._isMounted) {
      this.setState({
        socket: new Sockette(URL_WEBSOCKET_DBTC + "/marketOperation", {
          timeout: 60000,
          onopen: e => {
            this.socketReady();
          },
          onmessage: e => {
            this.handleResponseSocket(e.data);
          }
        })
      });
    }
  }
  socketReady() {
    ////console.log("wsKey: ", window.sessionStorage.getItem("websocketKey"));
    let men = {
      method: "getBuySuggestions",
      params: {
        id: window.sessionStorage.getItem("websocketKey")
      }
    };
    if (this.state.socket !== null) {
      try {
        // //console.log("wsKey: ", window.sessionStorage.getItem("websocketKey"));
        this.state.socket.json(men);
      } catch (e) {
        //console.log(e);
      }
    }
  }
  handleResponseSocket(data) {
    //console.log(data);
  }
  viewPayments() {
    this.setState({ viewPayments: !this.state.viewPayments });
  }
  viewWallet() {
    this.setState({ viewWallets: !this.state.viewWallets });
  }
  handleBuyButton() {
    if (
      this.state.selectedPaymentId !== "" &&
      this.state.selectedAddressId !== ""
    ) {
      this.handleExecute();
    } else {
      this.setState({
        viewPayments: true,
        viewWallets: true,
        viewMessages: true,
        message: "Seleccione medio de pago y cartera"
      });
      const timer = setTimeout(() => {
        this.setState({
          viewMessages: false,
          message: ""
        });
        clearTimeout(timer);
      }, 5000);
    }
  }
  handleCancel() {
    this.setState({
      viewMessages: false,
      message: ""
    });
  }
  handleExecute() {
    this.setState({ load: true });
    const time = setTimeout(() => {
      this.setState({ load: false, viewPayments: false, viewWallets: false });
      clearTimeout(time);
    }, 5000);
  }
  handlePaymentMethod(e, data) {
    this.setState({ selectedPaymentId: data.id });
  }
  handleAddressMethod(e, data) {
    this.setState({ selectedAddressId: data.id });
  }
  handleClickEndOperations() {
    this.setState({
      viewMessagesEnd: true,
      messageEnd: "Ingrese los datos requeridos"
    });
    const time = setTimeout(() => {
      this.setState({ viewMessagesEnd: false, messageEnd: "" });
      clearTimeout(time);
    }, 5000);
  }
  async getBalanceAddresToBlocChain(currency, address) {
    try {
      const response = await addressApi.getBalanceBlockChain(currency, address);
      //console.log(response);
    } catch (error) {
      //console.log(error);
    }
  }
  render() {
    let st = { margin: "8px 0px 1px 10px", width: "100px", height: "100px" };
    let scale = [
      { scale: 10, quantity: 3, startColor: "#ff2a04", endColor: "#ff2a04" },
      { scale: 10, quantity: 3, startColor: "yellow", endColor: "yellow" },
      { scale: 10, quantity: 4, startColor: "green", endColor: "green" }
    ];
    return (
      <Grid>
        <Grid.Column
          computer={6}
          mobile={16}
          tablet={8}
          largeScreen={8}
          widescreen={4}
        >
          <Segment loading={this.state.load} style={{ padding: "0px" }} basic>
            <Card>
              <Card.Content style={{ paddingBottom: "2px" }}>
                <Image floated="left" size="mini" src={ves} circular />
                <Card.Header>VES</Card.Header>
                <Card.Meta>Bolivar Venezolano</Card.Meta>
              </Card.Content>
              <Card.Content>
                <div style={{ alignContent: "center", textAlign: "center" }}>
                  <Image size="small" src={localb} centered />
                  <Gauge
                    style={st}
                    scaleList={scale}
                    unit={"%"}
                    value={this.state.value}
                  />
                </div>
                <div style={{ textAlign: "letf", fontSize: "12px" }}>
                  Precio max. de operación 10,000
                </div>
                <div
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  onClick={this.viewPayments.bind(this)}
                >
                  Medios de pago
                </div>
                {this.state.viewPayments && (
                  <List verticalAlign="middle" size="mini" selection animated>
                    <List.Item
                      id="venezuela"
                      onClick={this.handlePaymentMethod.bind(this)}
                    >
                      <List.Content
                        style={{
                          color:
                            this.state.selectedPaymentId === "venezuela"
                              ? "blue"
                              : "black"
                        }}
                      >
                        VENEZUELA-100,000
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content style={{ color: "black" }}>
                        BANPLUS-100,000
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content style={{ color: "black" }}>
                        BANCAMIGA-100,000
                      </List.Content>
                    </List.Item>
                  </List>
                )}
                <div
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  onClick={this.viewWallet.bind(this)}
                >
                  Carteras
                </div>
                {this.state.viewWallets && (
                  <List verticalAlign="middle" size="mini" selection animated>
                    <List.Item
                      id="local_a"
                      onClick={this.handleAddressMethod.bind(this)}
                    >
                      <List.Content
                        style={{
                          color:
                            this.state.selectedAddressId === "local_a"
                              ? "blue"
                              : "black"
                        }}
                      >
                        LOCAL_A-adsdtewffsdfds
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content style={{ color: "black" }}>
                        LOCAL_B-dassdasdradsada
                      </List.Content>
                    </List.Item>
                  </List>
                )}
                {this.state.viewMessages && (
                  <Message color="blue" style={{ fontSize: "10px" }}>
                    {this.state.message}
                  </Message>
                )}
              </Card.Content>
              <Card.Content extra>
                <div style={{ textAlign: "center" }}>
                  <Button
                    color="blue"
                    onClick={this.handleBuyButton.bind(this)}
                  >
                    Comprar
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </Segment>
        </Grid.Column>
        <Grid.Column
          computer={6}
          mobile={16}
          tablet={8}
          largeScreen={8}
          widescreen={4}
        >
          <Card color="blue">
            <Card.Content style={{ paddingBottom: "2px" }}>
              <Image floated="left" size="mini" src={ves} circular />
              <Card.Header>VES</Card.Header>
              <Card.Meta>Bolivar Venezolano</Card.Meta>
            </Card.Content>
            <Card.Content>
              <div style={{ alignContent: "center", textAlign: "center" }}>
                <Image size="small" src={hitbtc} centered />
                <Gauge
                  style={st}
                  scaleList={scale}
                  unit={"%"}
                  value={this.state.value}
                />
              </div>
              <div style={{ textAlign: "letf", fontSize: "12px" }}>
                Precio max. de operación 10,000
              </div>
              {this.state.viewMessagesEnd && (
                <Message color="blue" style={{ fontSize: "10px" }}>
                  {this.state.messageEnd}
                </Message>
              )}
            </Card.Content>
            <Card.Content extra>
              <div style={{ textAlign: "center" }}>
                <Button
                  color="blue"
                  onClick={this.handleClickEndOperations.bind(this)}
                >
                  Cerrar
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
