import React, { Component } from "react";
import { Segment, Header, Label, Grid, Image } from "semantic-ui-react";
import crytpLev from "../../img/crypto lev.png";
import fxLeve from "../../img/boton fx lev.png";
import { isMobile } from "react-device-detect";
import "./PriceCoin.css";
import Sockette from "sockette";
const coins = ["BTCUSD", "ETHUSD", "LTCUSD", "BCHUSD", "XRPBTC"];
class PriceCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btc: "0",
      eth: "0",
      litecoin: "0",
      btcCash: "0",
      ripple: "0",
      colorbtc: "",
      eventcolorbtc: "#efefef",
      eventcoloreth: "#efefef",
      eventcolorltc: "#efefef",
      eventcolorcash: "#efefef",
      eventcolorripple: "#efefef",
      socket: null
    };
    this._isMounted = false;
    this.socketReady = this.socketReady.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.initSoket = this.initSoket.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.initSoket();
  }
  initSoket() {
    if (this._isMounted) {
      this.setState({
        socket: new Sockette("wss://api.hitbtc.com/api/2/ws", {
          onopen: e => this.socketReady(),
          onmessage: e => this.handleValue(e.data)
        })
      });
    }
  }
  componentWillUnmount() {
    if (this.state.socket !== null) {
      this.state.socket.close();
      //this.setState({ socket: null });
    }
  }
  socketReady() {
    for (let coin of coins) {
      let men = {
        method: "subscribeTicker",
        params: {
          symbol: coin
        },
        id: 123
      };
      if (this.state.socket !== null) {
        try {
          this.state.socket.json(men);
        } catch (e) {}
      }
    }
  }
  colorChange(old, newValue) {
    if (newValue > old) {
      return "green";
    } else {
      return "red";
    }
  }
  eventLabel(label) {
    if (label === "btc") {
      this.setState({ eventcolorbtc: " " });
      setTimeout(() => {
        this.setState({ eventcolorbtc: "#efefef" });
      }, 1500);
    }
    if (label === "eth") {
      this.setState({ eventcoloreth: " " });
      setTimeout(() => {
        this.setState({ eventcoloreth: "#efefef" });
      }, 1500);
    }
    if (label === "ltc") {
      this.setState({ eventcolorltc: " " });
      setTimeout(() => {
        this.setState({ eventcolorltc: "#efefef" });
      }, 1500);
    }
    if (label === "cash") {
      this.setState({ eventcolorcash: " " });
      setTimeout(() => {
        this.setState({ eventcolorcash: "#efefef" });
      }, 1500);
    }
    if (label === "ripple") {
      this.setState({ eventcolorripple: " " });
      setTimeout(() => {
        this.setState({ eventcolorripple: "#efefef" });
      }, 1500);
    }
  }
  handleValue(value) {
    let result = JSON.parse(value);

    if (result !== undefined) {
      if (result.params !== undefined) {
        let n = Number(result.params.last);
        let r = n.toLocaleString("en-US", {
          maximumFractionDigits: 8
        });
        this.setState({
          colorbtc:
            result.params.symbol === "BTCUSD" && this.state.btc !== r
              ? this.colorChange(this.state.btc, result.params.last)
              : this.state.colorbtc,
          btc: result.params.symbol === "BTCUSD" ? r : this.state.btc,
          eventcolorbtc:
            result.params.symbol === "BTCUSD" && this.state.btc !== r
              ? this.eventLabel("btc")
              : this.state.eventcolorbtc,
          coloreth:
            result.params.symbol === "ETHUSD" && this.state.eth !== r
              ? this.colorChange(this.state.eth, result.params.last)
              : this.state.coloreth,
          eventcoloreth:
            result.params.symbol === "ETHUSD" && this.state.eth !== r
              ? this.eventLabel("eth")
              : this.state.eventcoloreth,
          eth: result.params.symbol === "ETHUSD" ? r : this.state.eth,
          litecoin: result.params.symbol === "LTCUSD" ? r : this.state.litecoin,
          colorltc:
            result.params.symbol === "LTCUSD" && this.state.litecoin !== r
              ? this.colorChange(this.state.litecoin, r)
              : this.state.colorltc,
          eventcolorltc:
            result.params.symbol === "LTCUSD" && this.state.litecoin !== r
              ? this.eventLabel("ltc")
              : this.state.eventcolorltc,
          btcCash: result.params.symbol === "BCHUSD" ? r : this.state.btcCash,
          colorcash:
            result.params.symbol === "BCHUSD" && this.state.btcCash !== r
              ? this.colorChange(this.state.btcCash, result.params.last)
              : this.state.colorcash,
          eventcolorcash:
            result.params.symbol === "BCHUSD" && this.state.btcCash !== r
              ? this.eventLabel("cash")
              : this.state.eventcolorcash,
          ripple: result.params.symbol === "XRPBTC" ? r : this.state.ripple,
          colorripple:
            result.params.symbol === "XRPBTC" && this.state.ripple !== r
              ? this.colorChange(this.state.ripple, result.params.last)
              : this.state.colorripple,
          eventcolorripple:
            result.params.symbol === "XRPUSD" && this.state.ripple !== r
              ? this.eventLabel("ripple")
              : this.state.eventcolorripple
        });
      }
      //
    }
  }
  render() {
    let view, viewMobile;
    if (this._isMounted === true) {
      view = (
        <Segment
          style={{
            backgroundColor: "#efefef",
            borderColor: "white",
            boxShadow: "none"
          }}
          className="segmentstyle"
          loading={
            this.state.btc === "0" ||
            this.state.eth === "0" ||
            this.state.btcCash === "0" ||
            this.state.ripple === "0" ||
            this.state.litecoin === "0"
          }
        >
          <Grid columns={3}>
            {this.props.source === "home" && (
              <Grid.Column largeScreen={2} computer={2} verticalAlign="middle">
                <Image src={fxLeve} alt="" />
              </Grid.Column>
            )}
            <Grid.Column
              style={{ paddingLeft: "0px", paddingRight: "px" }}
              tablet={16}
              computer={12}
              largeScreen={12}
              mobile={16}
            >
              <Header textAlign="center">
                <Label.Group
                  size={this.props.source === "home" ? "medium" : "small"}
                  className="labelstyle"
                >
                  <Label
                    color={
                      this.state.eventcolorbtc !== " "
                        ? this.state.eventcolorbtc
                        : null
                    }
                    style={{ fontSize: "10px", backgroundColor: "#efefef" }}
                  >
                    BITCOIN{" "}
                    <span
                      style={{
                        color: "#207ef2",
                        fontWeight: "bold"
                      }}
                    >
                      {" "}
                      ₮{this.state.btc}
                      <Label
                        circular
                        color={
                          this.state.colorbtc !== " " &&
                          this.state.colorbtc !== ""
                            ? this.state.colorbtc
                            : null
                        }
                        empty
                        style={{
                          verticalAlign: "bottom",
                          backgroundColor: "#efefef"
                        }}
                      />
                    </span>
                  </Label>
                  <Label
                    color={
                      this.state.eventcoloreth !== " "
                        ? this.state.eventcoloreth
                        : null
                    }
                    style={{ fontSize: "10px", backgroundColor: "#efefef" }}
                  >
                    ETHER{" "}
                    <span style={{ color: "#207ef2", fontWeight: "bold" }}>
                      {" "}
                      ₮{this.state.eth}{" "}
                      <Label
                        circular
                        color={this.state.coloreth}
                        empty
                        style={{
                          verticalAlign: "bottom",
                          backgroundColor: "#efefef"
                        }}
                      />
                    </span>
                  </Label>
                  {this.props.source === "home" && (
                    <Label
                      color={
                        this.state.eventcolorltc !== " "
                          ? this.state.eventcolorltc
                          : null
                      }
                      style={{ fontSize: "10px", backgroundColor: "#efefef" }}
                    >
                      LITECOIN{" "}
                      <span style={{ color: "#207ef2" }}>
                        {" "}
                        ₮{this.state.litecoin}
                        <Label
                          circular
                          color={this.state.colorltc}
                          empty
                          style={{
                            verticalAlign: "bottom",
                            backgroundColor: "#efefef"
                          }}
                        />
                      </span>
                    </Label>
                  )}
                  {this.props.source === "home" && (
                    <Label
                      color={
                        this.state.eventcolorcash !== " "
                          ? this.state.eventcolorcash
                          : null
                      }
                      style={{ fontSize: "10px", backgroundColor: "#efefef" }}
                    >
                      BITCOIN CASH{" "}
                      <span style={{ color: "#207ef2" }}>
                        {" "}
                        ₮{this.state.btcCash}{" "}
                        <Label
                          circular
                          color={this.state.colorcash}
                          empty
                          style={{
                            verticalAlign: "bottom",
                            backgroundColor: "#efefef"
                          }}
                        />
                      </span>
                    </Label>
                  )}
                  {this.props.source === "home" && (
                    <Label
                      color={
                        this.state.eventcolorripple !== " "
                          ? this.state.eventcolorripple
                          : null
                      }
                      style={{ fontSize: "10px", backgroundColor: "#efefef" }}
                    >
                      RIPPLE{" "}
                      <span style={{ color: "#207ef2" }}>
                        {" "}
                        {this.state.ripple}{" "}
                        <Label
                          circular
                          color={this.state.colorripple}
                          empty
                          style={{
                            verticalAlign: "bottom",
                            backgroundColor: "#efefef"
                          }}
                        />
                      </span>
                    </Label>
                  )}
                </Label.Group>
              </Header>
            </Grid.Column>
            {this.props.source === "home" && (
              <Grid.Column verticalAlign="middle" largeScreen={2} computer={2}>
                <Image src={crytpLev} alt="" />
              </Grid.Column>
            )}
          </Grid>
        </Segment>
      );
      viewMobile = (
        <Segment
          style={{
            backgroundColor: "#efefef",
            borderColor: "white",
            boxShadow: "none"
          }}
          className="segmentstyle"
          loading={
            this.state.btc === "0" ||
            this.state.eth === "0" ||
            this.state.btcCash === "0" ||
            this.state.ripple === "0" ||
            this.state.litecoin === "0"
          }
        >
          <Grid columns={3}>
            {this.props.source === "home" && (
              <Grid.Column largeScreen={2} computer={2} verticalAlign="middle">
                <Image src={fxLeve} alt="" />
              </Grid.Column>
            )}
            <Grid.Column
              style={{ paddingLeft: "0px", paddingRight: "px" }}
              tablet={16}
              computer={12}
              largeScreen={12}
              mobile={16}
            >
              <Header textAlign="center">
                <Label.Group
                  size={this.props.source === "home" ? "medium" : "small"}
                  className="labelstyle"
                >
                  <Label
                    style={{
                      fontSize: "10px",
                      backgroundColor: "white"
                    }}
                  >
                    BITCOIN{" "}
                    <span style={{ color: "#207ef2", fontWeight: "bold" }}>
                      {" "}
                      ₮{this.state.btc}
                      <Label
                        circular
                        color={
                          this.state.colorbtc !== " " &&
                          this.state.colorbtc !== ""
                            ? this.state.colorbtc
                            : null
                        }
                        empty
                        style={{ verticalAlign: "bottom" }}
                      />
                    </span>
                  </Label>
                  <Label style={{ fontSize: "10px", backgroundColor: "white" }}>
                    ETHER{" "}
                    <span style={{ color: "#207ef2", fontWeight: "bold" }}>
                      {" "}
                      ₮{this.state.eth}{" "}
                      <Label
                        circular
                        color={this.state.coloreth}
                        empty
                        style={{ verticalAlign: "bottom" }}
                      />
                    </span>
                  </Label>
                </Label.Group>
              </Header>
            </Grid.Column>
            {this.props.source === "home" && (
              <Grid.Column verticalAlign="middle" largeScreen={2} computer={2}>
                <Image src={crytpLev} alt="" />
              </Grid.Column>
            )}
          </Grid>
        </Segment>
      );
    }
    return <div>{isMobile ? viewMobile : view}</div>;
  }
}
export default PriceCoin;
