import React, { Component } from "react";
import { Grid, Card, Image, Button } from "semantic-ui-react";
import config from "../../../../services/config";
import Sockette from "sockette";
import uuid from "uuid";
import ves from "../../../../img/ve.svg";
import addressApi from "../../../../services/address";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
export default class MarketSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    };
    this._isMounted = false;
    this.connectSocket = this.connectSocket.bind(this);
    this.socketReady = this.socketReady.bind(this);
    this.handleResponseSocket = this.handleResponseSocket.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    window.sessionStorage.setItem("websocketKey", uuid.v4());
    this.connectSocket();
  }
  connectSocket() {
    if (this._isMounted) {
      this.setState({
        socket: new Sockette(URL_WEBSOCKET_DBTC + "/marketOperation", {
          timeout: 60000,
          onopen: e => {
            this.socketReady(e);
          },
          onmessage: e => {
            this.handleResponseSocket(e);
          }
        })
      });
    }
  }
  socketReady(e) {
    //   //console.log("wsKey: ", e);
    let men = {
      method: "getSellSuggestions",
      params: {
        id: window.sessionStorage.getItem("websocketKey")
      }
    };
    if (this.state.socket !== null) {
      try {
        this.state.socket.json(men);
      } catch (e) {
        //console.log(e);
      }
    }
  }
  handleResponseSocket(data) {
    //console.log(data);
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
    return (
      <Grid>
        <Grid.Column
          computer={6}
          mobile={16}
          tablet={4}
          largeScreen={8}
          widescreen={4}
        >
          <Card>
            <Card.Content>
              <Image floated="left" size="mini" src={ves} circular />
              <Card.Header>Steve Sanders</Card.Header>
              <Card.Meta>Friends of Elliot</Card.Meta>
              <Card.Description>
                Steve wants to add you to the group{" "}
                <strong>best friends</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div style={{ textAlign: "center" }}>
                <Button color="blue">Vender</Button>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}
