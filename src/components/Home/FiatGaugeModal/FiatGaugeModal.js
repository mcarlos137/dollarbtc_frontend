import React, { Component } from "react";
import market from "../../../services/market";
import {
  Modal,
  Table,
  Segment,
  Icon,
  Button,
  Grid,
  Divider
} from "semantic-ui-react";
import Gauge from "react-canvas-gauge";
import "./FiatGaugeModal.css";
import translate from "../../../i18n/translate";
class FiatGaugeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: this.props.symbol,
      open: this.props.show,
      value: 0,
      data: null,
      buyPrice: this.props.buy,
      sellPrice: this.props.sell,
      translator: props.translate
    };
  }
  componentDidMount() {}
  getPercent(symbol) {
    if (symbol !== "") {
      let response = market.getPercentGauge(symbol);
      response
        .then(resp => {
          this.setState({ value: resp.data });
        })
        .catch(error => {
          //console.log(error);
        });
    }
  }
  componentWillUpdate(nextProps, nextState) {}
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      open: nextProps.show,
      symbol: nextProps.symbol,
      data: nextProps.data,
      sellPrice: nextProps.sell,
      buyPrice: nextProps.buy
    });
    this.getPercent(nextProps.symbol);
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  closeModal() {
    this.setState({
      open: false,
      symbol: "",
      value: 0,
      data: null,
      buyPrice: 0,
      sellPrice: 0
    });
    this.props.close();
  }
  render() {
    //console.log(window.innerWidth);
    let t = this.state.translator;
    let st = { margin: "10px 0px 10px 15px", width: "150px", height: "150px" };
    let stmobile = {
      margin: "10px 20px 10px 90px",
      width: "150px",
      height: "150px"
    };
    let scale = [
      { scale: 10, quantity: 3, startColor: "#ff2a04", endColor: "#ff2a04" },
      { scale: 10, quantity: 3, startColor: "yellow", endColor: "yellow" },
      { scale: 10, quantity: 4, startColor: "green", endColor: "green" }
    ];
    return (
      <Modal open={this.state.open} centered={false}>
        <Modal.Header>{this.state.symbol}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Column
              largeScreen={1}
              computer={1}
              mobile={null}
              tablet={1}
            />
            <Grid.Column
              largeScreen={4}
              computer={4}
              mobile={16}
              tablet={4}
              textAling="center"
              style={{ marginLeft: window.innerWidth < 339 ? "-25px" : "" }}
            >
              <Gauge
                style={window.innerWidth < 768 ? stmobile : st}
                scaleList={scale}
                unit={"%"}
                value={this.state.value}
              />
              <p
                className={window.innerWidth < 768 ? "mobile-gauge-legend" : ""}
              >
                <Icon name="circle" color="red" />
                <span className="legend">{t("home.fiatGaugeModal.sell")}</span>
                <Icon name="circle" className="icon-color-gauge" />
                <span className="legend">N/O</span>
                <Icon name="circle" color="green" />
                <span className="legend">{t("home.fiatGaugeModal.buy")}</span>
              </p>
            </Grid.Column>
            <Grid.Column largeScreen={10} computer={10} mobile={16} tablet={10}>
              <Divider hidden />
              <Segment
                basic
                style={{
                  marginLeft: window.innerWidth < 339 ? "-10px" : "5px"
                }}
              >
                <Table
                  basic="very"
                  unstackable
                  size="small"
                  style={{
                    marginLeft: window.innerWidth < 339 ? "-10px" : "5px"
                  }}
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell style={{ textAlign: "center" }}>
                        {t("home.fiatGaugeModal.table.headers.type")}
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{ textAlign: "center" }}>
                        {t("home.fiatGaugeModal.table.headers.price")}
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{ textAlign: "center" }}>
                        {t("home.fiatGaugeModal.table.headers.change6H")}
                      </Table.HeaderCell>
                      <Table.HeaderCell style={{ textAlign: "center" }}>
                        {t("home.fiatGaugeModal.table.headers.change24H")}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body style={{ marginLeft: "-10px" }}>
                    {this.state.data !== null && (
                      <Table.Row>
                        <Table.Cell>{this.state.data[0].activity}</Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.buyPrice.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.data[0].buyOne.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.data[0].buyTwo.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                      </Table.Row>
                    )}
                    {this.state.data !== null && (
                      <Table.Row>
                        <Table.Cell>{this.state.data[1].activity}</Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.sellPrice.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.data[1].sellOne.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                          {this.state.data[1].sellTwo.toLocaleString("en-US", {
                            maximumFractionDigits: 2
                          })}
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Segment>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.closeModal.bind(this)}>
            {t("home.fiatGaugeModal.buttonClose")}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
export default translate(FiatGaugeModal);
