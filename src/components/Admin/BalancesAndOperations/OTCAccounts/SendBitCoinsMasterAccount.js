import React, { Component } from "react";
import userService from "../../../../services/user";
import axios from "axios";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Icon,
  Dropdown,
  Label,
  Loader,
  Segment,
  Message,
  Grid,
  Form,
  Modal,
  Accordion,
  List,
} from "semantic-ui-react";
import translate from "../../../../i18n/translate";
import util from "../../../../services/utils";
import WAValidator from "wallet-address-validator";
import masterAccount from "../../../../services/masterAccount";
class SendBitCoinsMasterAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      amount: "",
      code: "",
      address: "",
      description: "",
      errorAddress: false,
      errorAmount: false,
      errorDescription: false,
      walletBalanceBTC: 0,
      toVerifiedWalletBalanceBTC: 0,
      showSendBTC: false,
      openSendConfirm: false,
      openSendConfirm2: false,
      sended: false,
      notsended: false,
      sendSuccess: false,
      sendError: false,
      disableContinue: false,
      maxAvailableToSend: 0,
      verifyToken: "",
      showTokenExpirated: false,
      showTokenNotFound: false,
      loadingSending: false,
      activeIndexAccordion: 0,
      translator: props.translate,
      addressActual: [],
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  componentDidMount() {}
  transactionUpTo = (walletBalance, transactionFee) => {
    var maxToSend = walletBalance;
    if (maxToSend < 0) {
      this.setState({ maxAvailableToSend: 0 });
    } else {
      this.setState({ maxAvailableToSend: maxToSend });
    }
  };
  handleAmount = (e) => {
    if (e.target.value !== "") {
      if (util.validateNumber(e.target.value, this.state.amount)) {
        let number = Number(e.target.value);
        if (number >= 0) {
          this.setState({ amount: e.target.value });
        }
      }
    } else {
      this.setState({ amount: e.target.value });
    }
  };
  handleAddress = (e) => {
    if (util.validateAddress(e.target.value)) {
      this.setState({ address: e.target.value });
    }
  };
  handleDescription = (e) => {
    this.setState({ description: e.target.value });
  };
  handleToken = (e) => {
    this.setState({ verifyToken: e.target.value });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  textAddressValidator(value) {
    let valid = WAValidator.validate(value, "BTC");
    return valid;
  }
  sendBitcoins = () => {
    const re = /^[0-9]\d*(\.\d+)?$/;
    if (this.state.address !== "") {
      if (this.textAddressValidator(this.state.address)) {
        if (
          this.state.amount !== "" &&
          re.test(this.state.amount) &&
          this.state.amount <= this.props.balanceOtcBtc &&
          this.state.amount > 0
        ) {
          this.aceptSendConfirm();
        } else {
          if (this.state.amount === "") {
            this.setState({
              errorAmount: true,
              message: "wallet.send.errors.required",
            });
            setTimeout(() => {
              this.setState({
                errorAmount: false,
              });
            }, 5000);
          } else if (!re.test(this.state.amount)) {
            this.setState({
              errorAmount: true,
              message: "wallet.send.errors.numberFormat",
            });
            setTimeout(() => {
              this.setState({
                errorAmount: false,
              });
            }, 5000);
          } else if (this.state.amount >= this.state.maxAvailableToSend) {
            this.setState({
              errorAmount: true,
              message: "wallet.send.errors.maxAllow",
            });
            setTimeout(() => {
              this.setState({
                errorAmount: false,
              });
            }, 5000);
          } else if (this.state.amount <= 0) {
            this.setState({
              errorAmount: true,
              message: "wallet.send.errors.positiveNumber",
            });
            setTimeout(() => {
              this.setState({
                errorAmount: false,
              });
            }, 5000);
          }
        }
      } else {
        this.setState({
          errorAddress: true,
          message: "wallet.send.errors.format",
        });
        setTimeout(() => {
          this.setState({
            errorAddress: false,
          });
        }, 7000);
      }
    } else {
      this.setState({
        errorAddress: true,
        message: "wallet.send.errors.required",
      });
      setTimeout(() => {
        this.setState({
          errorAddress: false,
        });
      }, 5000);
    }
  };
  async aceptSendConfirm() {
    this.setState({ openSendConfirm: true });

    // this.executeSendBitcoins();
  }
  async executeSendBitcoins() {
    this.setState({ loadingSending: true });
    var body = {
      masterAccountName: this.props.otcName,
      amounts: {
        BTC: Number(this.state.amount),
      },
      targetAddress: this.state.address,
      additionalInfo: this.state.description,
    };
    console.log(body);
    try {
      const response = await masterAccount.sendBitCoinsMasterAccount(body);
      if (response.data === "OK") {
        this.setState({ sendSuccess: true });
        this.setState({ address: "" });
        this.setState({ amount: "" });
        this.setState({ description: "" });
        this.setState({ loadingSending: false }, () => {
          this.closeSendConfirm();
        });
        setTimeout(() => {
          this.setState({
            sendSuccess: false,
          });
        }, 7000);
      } else {
        this.setState({ sendError: true });
        this.setState({ address: "" });
        this.setState({ amount: "" });
        this.setState({ description: "" });
        this.setState({ loadingSending: false }, () => {
          this.closeSendConfirm();
        });

        setTimeout(() => {
          this.setState({
            sendError: false,
          });
        }, 7000);
      }
    } catch (error) {
      this.setState({ sendError: true });
      this.setState({ address: "" });
      this.setState({ amount: "" });
      this.setState({ description: "" });
      this.setState({ loadingSending: false }, () => {
        this.closeSendConfirm();
      });

      setTimeout(() => {
        this.setState({
          sendError: false,
        });
      }, 7000);
    }
  }
  closeSendConfirm = () => this.setState({ openSendConfirm: false });
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = this.state.activeIndexAccordion === index ? -1 : index;
    this.setState({ activeIndexAccordion: newIndex });
  };

  handleChange(e, { value }) {
    this.setState({ selected: value });
  }
  render() {
    const options = [
      { key: "EMAIL", text: "Email", value: "EMAIL" },
      { key: "PHONE", text: "Sms", value: "PHONE" },
    ];
    let t = this.state.translator;
    let labelAddress,
      labelAmount,
      messageSendSuccess,
      messageSendError,
      messageTokenNotFound,
      messageTokenExpirated; //labelDescription,
    if (this.state.showTokenNotFound) {
      messageTokenNotFound = (
        <Message negative>
          <Message.Header>
            {t("wallet.send.errors.tokenNotFoundHeader")}
          </Message.Header>
          <p>{t("wallet.send.errors.tokenNotFoundBody")}</p>
        </Message>
      );
    }
    if (this.state.showTokenExpirated) {
      messageTokenExpirated = (
        <Message negative>
          <Message.Header>
            {t("wallet.send.errors.tokenExpiredHeader")}
          </Message.Header>
          <p>{t("wallet.send.errors.tokenExpiredBody")}</p>
        </Message>
      );
    }
    if (this.state.sendSuccess) {
      messageSendSuccess = (
        <Message positive>
          <Message.Header>{t("wallet.send.successTxHeader")}</Message.Header>
          <p>{t("wallet.send.successTxBody")}</p>
        </Message>
      );
    }
    if (this.state.sendError) {
      messageSendError = (
        <Message negative>
          <Message.Header>{t("wallet.send.errors.weSorry")}</Message.Header>
          <p>{t("wallet.send.errors.failTransaction")}</p>
        </Message>
      );
    }
    if (this.state.errorAddress) {
      labelAddress = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    if (this.state.errorAmount) {
      labelAmount = (
        <Label basic color="red" pointing>
          {t(this.state.message)}
        </Label>
      );
    }
    return (
      <div>
        <Container textAlign="justified">
          {this.state.loadingSending && (
            <Dimmer active inverted>
              <Loader inverted>{t("wallet.send.waiting")}</Loader>
            </Dimmer>
          )}
          <Grid centered>
            <Grid.Row>
              <Grid.Column computer={8} largeScreen={8} tablet={8} mobile={16}>
                <Divider hidden />
                <Grid columns="equal">
                  <Grid.Column width={1} />
                  <Grid.Column width={12} style={{ marginLeft: "15px" }}>
                    <Segment secondary>
                      <Grid columns="equal">
                        <Grid.Row>
                          <Grid.Column width={7}>
                            <p style={{ fontWeight: "bold" }}>
                              {t("wallet.send.availableBalance")}
                            </p>
                          </Grid.Column>
                          <Grid.Column textAlign="right">
                            <div>{this.props.balanceOtcBtc} BTC</div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid>
                <Divider hidden />
                <Grid columns="equal">
                  <Grid.Column />
                  <Grid.Column largeScreen={13} computer={13} mobile={16}>
                    <Form>
                      {messageSendSuccess}
                      {messageSendError}
                      {messageTokenExpirated}
                      {messageTokenNotFound}
                      <Form.Field>
                        <label>{t("wallet.send.addressReceiver")}</label>
                        <input
                          value={this.state.address}
                          onChange={this.handleAddress.bind(this)}
                          type="text"
                          placeholder={t("wallet.send.addressReceiver")}
                        />
                        {labelAddress}
                      </Form.Field>
                      <Form.Field>
                        <label>{t("wallet.send.amountBTC")}</label>
                        <input
                          placeholder="0.0000000"
                          value={this.state.amount}
                          onChange={this.handleAmount.bind(this)}
                          type="text"
                        />
                        {labelAmount}
                      </Form.Field>
                      <Form.Field>
                        <label>{t("wallet.send.description")}</label>
                        <input
                          value={this.state.description}
                          onChange={this.handleDescription.bind(this)}
                          placeholder={t("wallet.send.placeholderDescription")}
                        />
                      </Form.Field>

                      <Container textAlign="right">
                        <Button
                          onClick={this.sendBitcoins.bind(this)}
                          color="blue"
                          style={{
                            marginTop: window.innerWidth <= 364 ? 8 : 0,
                          }}
                        >
                          {t("wallet.send.buttonContinue")}
                        </Button>
                      </Container>
                    </Form>
                  </Grid.Column>
                  <Grid.Column />
                </Grid>
              </Grid.Column>
              <Grid.Column computer={8} largeScreen={8} tablet={8} mobile={16}>
                <Grid>
                  <Divider hidden />
                  <Grid.Column largeScreen={13} computer={13} mobile={16}>
                    <Accordion styled>
                      <Accordion.Title
                        active={this.state.activeIndexAccordion === 0}
                        index={0}
                        onClick={this.handleClick}
                      >
                        <Icon name="dropdown" />
                        {t("wallet.send.info.question")}
                      </Accordion.Title>
                      <Accordion.Content
                        active={this.state.activeIndexAccordion === 0}
                      >
                        <List as="ol">
                          <List.Item as="li" value="-">
                            {t("wallet.send.info.answer1")}
                          </List.Item>
                          <List.Item as="li" value="-">
                            {t("wallet.send.info.answer2")}
                          </List.Item>
                        </List>
                      </Accordion.Content>

                      <Accordion.Title
                        active={this.state.activeIndexAccordion === 1}
                        index={1}
                        onClick={this.handleClick}
                      >
                        <Icon name="dropdown" />
                        {t("wallet.send.info.commissions")}
                      </Accordion.Title>
                      <Accordion.Content
                        active={this.state.activeIndexAccordion === 1}
                      >
                        <List as="ol">
                          <List.Item as="li" value="-">
                            {t("wallet.send.info.internal")}
                          </List.Item>
                          <List.Item as="li" value="-">
                            {t("wallet.send.info.external")}
                          </List.Item>
                        </List>
                      </Accordion.Content>
                    </Accordion>
                  </Grid.Column>
                  <Grid.Column />
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider hidden />
          <Modal
            size={"small"}
            open={this.state.openSendConfirm}
            onClose={this.closeSendConfirm}
            loading={this.state.loadingSending}
          >
            <Modal.Header>{t("wallet.send.confirmTx")}</Modal.Header>
            <Modal.Content>
              <p>{t("wallet.send.confirMessage")}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={this.closeSendConfirm}>
                {t("wallet.send.buttonNot")}
              </Button>
              <Button
                onClick={this.executeSendBitcoins.bind(this)}
                color="green"
              >
                {t("wallet.send.buttonYes")}
              </Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </div>
    );
  }
}
export default translate(SendBitCoinsMasterAccount);
