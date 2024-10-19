import React, { Component } from "react";
import translate from "../../i18n/translate";
import NumberFormat from "react-number-format";
import otcService from "../../services/otc";
import userService from "../../services/user";
import {
  Segment,
  Grid,
  Container,
  Header,
  List,
  Button,
  Message,
} from "semantic-ui-react";
import { parse } from "query-string";
import { isMobile } from "react-device-detect";
import { Redirect } from "react-router-dom";
class TransferConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      idOperation: "",
      succesRequest: false,
      load: false,
      message: "",
      color: "",
      viewMessage: false,
    };
  }
  componentDidMount() {
    this.getTransferData();
  }
  async getTransferData() {
    const query = parse(window.location.search);
    console.log(query);

    if (query.thirdPartySend !== undefined) {
      this.setState({ load: true });
      this.setState({ idOperation: query.thirdPartySend }, async () => {
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
          var clean_uri = uri.substring(0, uri.indexOf("?"));
          window.history.replaceState({}, document.title, clean_uri);
        }
        try {
          const response = await otcService.getThirdPartyData(
            this.state.idOperation
          );
          this.setState({ load: false });
          console.log(response.data);
        } catch (error) {
          this.setState({ load: false });
          console.log(error);
        }
      });
    } else {
      var uri = window.location.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
      window.location.href = "/";
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  async confirTransaction(value) {
    this.setState({ load: true });
    let body = {
      id: this.state.idOperation,
      confirm: value,
    };
    try {
      const response = await userService.sendConfirmUserThirdParty(body);
      console.log(response);
      this.setState({ load: false });
      if (response.data === "OK") {
        this.setState({
          succesRequest: true,
          message: "receibeExternalConfirm.successMessage",
          color: "green",
          viewMessage: true,
        });
      } else {
        this.setState({
          succesRequest: true,
          message: "receibeExternalConfirm.errorServer",
          color: "red",
          viewMessage: true,
        });
      }
    } catch (error) {
      let e = String(error);
      if (e.includes("Network")) {
        this.setState({
          succesRequest: false,
          message: "receibeExternalConfirm.errorConexion",
          color: "red",
          viewMessage: true,
        });
        setTimeout(() => {
          this.setState({
            message: "",
            color: "",
            viewMessage: false,
          });
        }, 6000);
      } else {
        this.setState({
          succesRequest: true,
          message: "receibeExternalConfirm.errorServer",
          color: "red",
        });
      }
    }
  }
  render() {
    let t = this.state.translator;
    return (
      <div>
        <Container>
          <Grid columns="equal" centered>
            <Grid.Column
              largeScreen={2}
              mobile={0}
              tablet={0}
              computer={2}
            ></Grid.Column>
            <Grid.Column largeScreen={12} mobile={16} tablet={14} computer={12}>
              <Segment
                color={isMobile ? "blue" : "orange"}
                textAlign="center"
                loading={this.state.load}
              >
                <Header>{t("receibeExternalConfirm.title")}</Header>
                <List>
                  <List.Item>Apples</List.Item>
                  <List.Item>Pears</List.Item>
                  <List.Item>Oranges</List.Item>
                </List>
                <p> {t("receibeExternalConfirm.question")}</p>
                {this.state.viewMessage === true && (
                  <Message color={this.state.color} compact>
                    {t(this.state.message)}
                  </Message>
                )}
                {this.state.succesRequest === false && (
                  <div>
                    <Button
                      color="blue"
                      onClick={() => this.confirTransaction(true)}
                    >
                      {t("receibeExternalConfirm.buttonYes")}
                    </Button>
                    <Button onClick={() => this.confirTransaction(false)}>
                      {t("receibeExternalConfirm.buttonNo")}
                    </Button>
                  </div>
                )}
                {this.state.succesRequest === true && (
                  <div>
                    <Button
                      color="blue"
                      onClick={() => {
                        window.location.href = "/";
                      }}
                    >
                      {t("receibeExternalConfirm.buttonEnd")}
                    </Button>
                  </div>
                )}
              </Segment>
            </Grid.Column>
            <Grid.Column
              largeScreen={2}
              mobile={0}
              tablet={0}
              computer={2}
            ></Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}
export default translate(TransferConfirm);
