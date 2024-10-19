import React, { Component } from "react";
import {
  Container,
  Grid,
  Segment,
  Modal,
  Form,
  Header,
  Input,
  Button
} from "semantic-ui-react";
import translate from "../../i18n/translate";
import user from "../../services/user";
import NumberFormat from "react-number-format";
import { isMobile, isTablet } from "react-device-detect";
class FastChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      amountBuy: "",
      amountSell: "",
      priceBuy: 0,
      priceSell: 0,
      comissionBuy: 0,
      comissionSell: 0,
      amountReceiveBuy: 0,
      amountReceiveSell: 0,
      openSendConfirm: false,
      openSendConfirm2: false
    };
    this.handleChangeAmountBuy = this.handleChangeAmountBuy.bind(this);
    this.handleChangeAmountSell = this.handleChangeAmountSell.bind(this);
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  handleChangeAmountBuy(value) {
    this.setState({ amountBuy: value });
  }
  handleChangeAmountSell(value) {
    this.setState({ amountSell: value });
  }

  aceptSendConfirm = () => this.setState({ openSendConfirm: true });

  closeSendConfirm = () => this.setState({ openSendConfirm: false });

  aceptSendConfirm2 = () =>
    this.setState({ openSendConfirm2: true, openSendConfirm: false });

  closeSendConfirm2 = () => this.setState({ openSendConfirm2: false });

  render() {
    let t = this.state.translator;
    let availableBalanceUser = user.getBalanceStorageUserBTC();
    return (
      <Grid columns="equal">
        <Grid.Column
          mobile="16"
          largeScreen="16"
          widescreen="16"
          computer="16"
          tablet="16"
        >
          <Segment color="orange" loading={this.state.load}>
            <div />
            <Header as="h4" className="titleComponent" textAlign="center">
              {t("fastChange.title")}
            </Header>
            <Grid>
              {!isMobile && (
                <Grid.Column
                  largeScreen={1}
                  computer={1}
                  tablet={null}
                  mobile={null}
                  widescreen={1}
                />
              )}
              <Grid.Column
                largeScreen={6}
                computer={6}
                tablet={7}
                mobile={16}
                widescreen={6}
              >
                {/*Compra componente */}
                <Segment basic textAlign="center">
                  <Header>{t("fastChange.buy.title")}</Header>
                  <br />
                  <Grid columns="equal">
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.buy.availableBalance")} USD</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>0</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column
                        textAlign={
                          isMobile === true || isTablet === true
                            ? "center"
                            : "left"
                        }
                        mobile={16}
                        computer={8}
                        largeScreen={8}
                        widescreen={8}
                        tablet={16}
                      >
                        <p style={{ marginTop: 10 }}>
                          {t("fastChange.buy.amount")} BTC
                        </p>
                      </Grid.Column>
                      <Grid.Column
                        textAlign={
                          isMobile === true || isTablet === true
                            ? "center"
                            : "right"
                        }
                        mobile={16}
                        computer={8}
                        largeScreen={8}
                        widescreen={8}
                        tablet={8}
                      >
                        <p>
                          <Input
                            size="tiny"
                            type={
                              <NumberFormat
                                value={this.state.amountBuy}
                                decimalScale={8}
                                placeholder={t("fastChange.buy.amount")}
                                thousandSeparator={false}
                                allowNegative={false}
                                onValueChange={values => {
                                  const { value } = values;
                                  this.handleChangeAmountBuy(parseFloat(value));
                                }}
                              />
                            }
                          />
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.buy.price")} BTC</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.priceBuy}</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.buy.commission")}</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.comissionBuy}</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.buy.amountReceive")} BTC</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.amountReceiveBuy}</p>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <br />
                  <Button
                    floated="right"
                    color="blue"
                    onClick={this.aceptSendConfirm}
                  >
                    {t("fastChange.buy.title")}
                  </Button>
                </Segment>
              </Grid.Column>
              {!isMobile && (
                <Grid.Column
                  largeScreen={2}
                  computer={2}
                  tablet={2}
                  mobile={null}
                  widescreen={2}
                />
              )}
              {isTablet && (
                <Grid.Column
                  largeScreen={1}
                  computer={1}
                  tablet={1}
                  mobile={null}
                  widescreen={1}
                />
              )}
              <Grid.Column
                largeScreen={6}
                computer={6}
                tablet={7}
                mobile={16}
                widescreen={6}
              >
                <Segment basic textAlign="center">
                  <Header>{t("fastChange.sell.title")}</Header>
                  <br />
                  <Grid columns="equal">
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.sell.availableBalance")} BTC</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{availableBalanceUser.available}</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column
                        textAlign={
                          isMobile === true || isTablet === true
                            ? "center"
                            : "left"
                        }
                        mobile={16}
                        computer={8}
                        largeScreen={8}
                        widescreen={8}
                        tablet={16}
                      >
                        <p style={{ marginTop: 10 }}>
                          {t("fastChange.sell.amount")} BTC
                        </p>
                      </Grid.Column>
                      <Grid.Column
                        textAlign={
                          isMobile === true || isTablet === true
                            ? "center"
                            : "right"
                        }
                        computer={8}
                        largeScreen={8}
                        widescreen={8}
                        tablet={16}
                      >
                        <p>
                          <Input
                            size="tiny"
                            type={
                              <NumberFormat
                                value={this.state.amountSell}
                                decimalScale={8}
                                placeholder={t("fastChange.sell.amount")}
                                thousandSeparator={false}
                                allowNegative={false}
                                onValueChange={values => {
                                  const { value } = values;
                                  this.handleChangeAmountSell(
                                    parseFloat(value)
                                  );
                                }}
                              />
                            }
                          />
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.sell.price")} BTC</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.priceSell}</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.sell.commission")}</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.comissionSell}</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                      <Grid.Column textAlign="left">
                        <p>{t("fastChange.sell.amountReceive")} USD</p>
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <p>{this.state.amountReceiveSell}</p>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <br />
                  <Button
                    floated="right"
                    color="blue"
                    onClick={this.aceptSendConfirm}
                  >
                    {t("fastChange.sell.title")}
                  </Button>
                </Segment>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Container textAlign="right">
          <Modal
            open={this.state.openSendConfirm}
            onClose={this.closeSendConfirm}
          >
            <Modal.Header>{t("wallet.send.confirmTx")}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>{t("wallet.send.descriptionTx")}</p>
                <Form>
                  <Form.Field>
                    <label>Token</label>
                    <input placeholder="xxxxxxx" onChange={this.handleToken} />
                  </Form.Field>
                </Form>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color="grey" onClick={this.closeSendConfirm}>
                {t("wallet.send.buttonClose")}
              </Button>
              <Button
                disabled={this.state.verifyToken === ""}
                onClick={this.aceptSendConfirm2}
                color="blue"
              >
                {t("wallet.send.buttonAccept")}
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            size={"small"}
            open={this.state.openSendConfirm2}
            onClose={this.closeSendConfirm2}
          >
            <Modal.Header>{t("wallet.send.confirmTx")}</Modal.Header>
            <Modal.Content>
              <p>{t("wallet.send.confirMessage")}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeSendConfirm2}>
                {t("wallet.send.buttonNot")}
              </Button>
              <Button onClick={this.closeSendConfirm2} color="green">
                {t("wallet.send.buttonYes")}
              </Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </Grid>
    );
  }
}

export default translate(FastChange);
