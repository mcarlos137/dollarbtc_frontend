import React, { Component } from "react";
import config from "../../services/config";
import axios from "axios";
import moment from "moment";
import userService from "../../services/user";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Icon,
  Loader,
  Popup,
  Segment,
  Message,
  Grid,
  Header,
  Label,
  Modal,
  Form,
} from "semantic-ui-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import translate from "../../i18n/translate";
import modelService from "../../services/model";

const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;

class MyPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPlans: [],
      valueActualBalance: 0,
      showMyPlans: false,
      showModifyDescription: false,
      planNameToChange: "",
      descriptionToAdd: "",
      changingDescription: false,
      planNameToInactivate: "",
      verifyToken: "",
      openSendConfirm: false,
      successfulInactivate: false,
      errorInactivate: false,
      translator: props.translate,
      endInactivate: false,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    this.getMyPlans();
  }
  modifyDescription = () => {
    this.setState({ changingDescription: true });
    modelService
      .modelModifyDescription(
        this.state.planNameToChange,
        this.state.descriptionToAdd.replace(" ", "__")
      )
      .then((res) => {
        this.closeModifyDescription();
        this.getMyPlans();
        this.setState({ changingDescription: false });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  calculateActualBalance = (additionalMovementsDate, initialAmount) => {
    var actualBalance = initialAmount;
    if (additionalMovementsDate !== undefined) {
      Object.entries(additionalMovementsDate).forEach(([key, value]) => {
        var arrayMovements = value;
        for (var i = 0; i < arrayMovements.length; i++) {
          actualBalance = actualBalance + arrayMovements[i].amount;
        }
      });
    }
    return actualBalance;
  };
  buildGraphData = (additionalMovementsDate) => {
    var graphData = [];
    if (additionalMovementsDate !== undefined) {
      Object.entries(additionalMovementsDate).forEach(([key, value]) => {
        var arrayMovements = value;
        for (var i = 0; i < arrayMovements.length; i++) {
          var cleanAmount = this.floorDecimals(arrayMovements[i].amount, 8);
          var obj = {
            date: moment.utc(key).format("YYYY/MM/DD"),
          };
          Object.defineProperty(obj, arrayMovements[i].currency, {
            value: cleanAmount,
            enumerable: true,
            configurable: true,
            writable: true,
          });
          graphData.push(obj);
        }
      });
    }
    return graphData;
  };
  closeModifyDescription = () => {
    this.setState({ showModifyDescription: false });
    this.setState({ planNameToChange: "" });
  };
  showModifyDescription = (planNameToChange) => {
    this.setState({ showModifyDescription: true });
    this.setState({ planNameToChange: planNameToChange });
  };
  showInactivatePlanConfirmToken = (planNameToInactivate) => {
    var urlTokenSend = URL_BASE_BUSHIDO + config.urlBushido.generateTokenVerify;
    var body = {
      email: userService.getUserEmail().toString(),
      source: "PORTAL_NORMAL",
    };
    axios
      .post(urlTokenSend, body, {
        auth: {
          username: atob(userService.getHeader()).split(":")[1],
          password: atob(userService.getHeader()).split(":")[0],
        },
      })
      .then((res) => {
        this.setState({ openSendConfirm: true });
      })
      .catch((error) => {
        //console.log(error);
      });
    this.setState({ planNameToInactivate: planNameToInactivate });
  };
  getMyPlans = () => {
    modelService
      .modelListUser(userService.getUserName())
      .then((res) => {
        let listMyPlans = res.data.result.models;

        for (var i = 0; i < listMyPlans.length; i++) {
          if (
            listMyPlans[i].name.split("__")[1].toUpperCase() === "DEFENSIVE"
          ) {
            listMyPlans[i].spanishName = "defensive";
          } else if (
            listMyPlans[i].name.split("__")[1].toUpperCase() === "MODERATE"
          ) {
            listMyPlans[i].spanishName = "moderate";
          } else if (
            listMyPlans[i].name.split("__")[1].toUpperCase() === "INTENSE"
          ) {
            listMyPlans[i].spanishName = "intense";
          } else if (
            listMyPlans[i].name.split("__")[1].toUpperCase() === "AGGRESSIVE"
          ) {
            listMyPlans[i].spanishName = "aggressive";
          } else if (
            listMyPlans[i].name.split("__")[1].toUpperCase() === "ARBITRAGE"
          ) {
            listMyPlans[i].spanishName = "arbitrage";
          }
          listMyPlans[i].initialTimestamp = moment(
            listMyPlans[i].initialTimestamp
          ).format("YYYY/MM/DD");
          listMyPlans[i].finalTimestamp = moment(
            listMyPlans[i].finalTimestamp
          ).format("YYYY/MM/DD");
          let listCurrentBalance = listMyPlans[i].currentBalance;
          var actualBalance;
          if (listCurrentBalance === undefined) {
            actualBalance = 0;
          } else {
            Object.entries(listCurrentBalance).forEach(([d, x]) => {
              Object.entries(x).forEach(([y, z]) => {
                if (y === "amount") {
                  actualBalance = z;
                }
              });
            });
          }

          var yields = listMyPlans[i].yields;

          var actualPerformance;
          Object.entries(yields).forEach(([d, x]) => {
            Object.entries(x).forEach(([y, z]) => {
              if (y === "amount") {
                let y = z * 100;
                actualPerformance = Math.trunc(y);
              }
            });
          });

          var Proyectedyields = listMyPlans[i].projectedYields;
          var proyectedPerformance;
          Object.entries(Proyectedyields).forEach(([d, x]) => {
            Object.entries(x).forEach(([y, z]) => {
              if (y === "amount") {
                let x = z * 100;
                proyectedPerformance = Math.trunc(x);
              }
            });
          });

          // var actualPerformance = this.floorDecimals(
          //   ((actualBalance - listMyPlans[i].initialAmounts[0].amount) * 100) /
          //   listMyPlans[i].initialAmounts[0].amount,
          //   2
          // );
          listMyPlans[i].actualBalance = actualBalance;
          listMyPlans[i].actualPerformance = actualPerformance;
          var lengthDaysPlan =
            new Date(listMyPlans[i].finalTimestamp) -
            new Date(listMyPlans[i].initialTimestamp);
          var actualDaysPlan =
            moment() - new Date(listMyPlans[i].initialTimestamp);
          listMyPlans[i].expectedPerformance = proyectedPerformance;
          // this.floorDecimals(
          //   (lengthDaysPlan * actualPerformance) / actualDaysPlan,
          //   2
          // );
          var graphData = this.buildGraphData(
            listMyPlans[i].additionalMovements
          );
          listMyPlans[i].graphData = graphData.slice(-3);
          listMyPlans[i].allGraphData = graphData;
          listMyPlans[i].status = listMyPlans[i].active;
        }
        this.setState({ myPlans: listMyPlans });
        this.setState({ showMyPlans: true });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  handleDescription = (e) => {
    this.setState({ descriptionToAdd: e.target.value });
  };
  handleToken = (e) => {
    this.setState({ verifyToken: e.target.value });
  };
  closeSendConfirm = () => {
    this.setState({
      openSendConfirm: false,
      endInactivate: false,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
    });
    this.setState({ verifyToken: "" });
    this.setState({ planNameToInactivate: "" });
  };
  closeSuccessfulInactivate = () => {
    this.setState({ successfulInactivate: false });
  };
  closeErrorInactivate = () => {
    this.setState({ errorInactivate: false });
  };
  aceptSendConfirm = () => {
    this.setState({ loadingInvest: true, loading: true });
    var urlTokenVerify = URL_BASE_BUSHIDO + config.urlBushido.verifyToken;
    axios
      .post(urlTokenVerify, this.state.verifyToken, {
        auth: {
          username: atob(userService.getHeader()).split(":")[1],
          password: atob(userService.getHeader()).split(":")[0],
        },
        headers: { "Content-Type": "text/plain" },
      })
      .then((res) => {
        if (res.data.errors == null) {
          modelService
            .modelInactivate(this.state.planNameToInactivate)
            .then((res) => {
              // this.closeSendConfirm();
              // this.setState({ successfulInactivate: true });
              this.setState({
                verifyToken: "",
                loading: false,
                viewMessage: true,
                colorMessage: "blue",
                textMessage: "hft.myPlans.modalSuccess.content",
                endInactivate: true,
              });
            })
            .catch((error) => {
              //console.log(error);
              // this.closeSendConfirm();
              this.setState({
                loading: false,
                viewMessage: true,
                colorMessage: "red",
                textMessage: "hft.myPlans.modalFail.content",
              });
              this.setState({ verifyToken: "" });
            });
        } else {
          if (res.data.errors[0].code === 21) {
            this.setState({ verifyToken: "", loading: false });
            this.setState({ showTokenNotFound: true });
            setTimeout(() => {
              this.setState({
                showTokenNotFound: false,
              });
            }, 7000);
          }
          if (res.data.errors[0].code === 23) {
            this.setState({ verifyToken: "" });
            this.setState({ showTokenExpirated: true });
            setTimeout(() => {
              this.setState({
                showTokenExpirated: false,
              });
            }, 7000);
          }
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true",
    };
    let data = date.toLocaleString(regi, options);
    if (regi === "es-ES") {
      data = data.split(" ");
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + " " + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  render() {
    let t = this.state.translator;
    var messageTokenNotFound, messageTokenExpirated;
    if (this.state.showTokenNotFound) {
      messageTokenNotFound = (
        <Message negative>
          <p>{t("hft.myPlans.errors.tokenNotFound.content")}</p>
        </Message>
      );
    }
    if (this.state.showTokenExpirated) {
      messageTokenExpirated = (
        <Message negative>
          <p>{t("hft.myPlans.errors.tokenExpired.content")}</p>
        </Message>
      );
    }
    return (
      <Container>
        {!this.state.showMyPlans && (
          <Dimmer active inverted>
            <Loader inverted>{t("hft.myPlans.loading")}</Loader>
          </Dimmer>
        )}
        {this.state.changingDescription && (
          <Dimmer active inverted>
            <Loader inverted>{t("hft.myPlans.loading")}</Loader>
          </Dimmer>
        )}
        <Grid columns="equal">
          {this.state.myPlans.map((myPlan, i) => (
            <Grid.Column
              largeScreen={8}
              tablet={16}
              mobile={16}
              key={i}
              style={{ paddingBottom: "0px" }}
            >
              <Segment style={{ minHeight: "330px" }}>
                <Grid columns={1}>
                  <Grid.Row columns={2} style={{ paddingBottom: "0px" }}>
                    <Grid.Column>
                      <Header
                        className="headerListPlans"
                        textAlign="justified"
                        size="medium"
                      >
                        <Header.Content>
                          {t("hft.commons.plansName." + myPlan.spanishName)}
                        </Header.Content>
                        <Header.Subheader>
                          {t("hft.myPlans.description")}
                          {myPlan.description}
                        </Header.Subheader>
                      </Header>
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                      <Button.Group size="mini" floated="right">
                        <Button
                          compact
                          onClick={() =>
                            this.showInactivatePlanConfirmToken(myPlan.name)
                          }
                        >
                          {t("hft.myPlans.buttonInactivate")}
                        </Button>
                        <Popup
                          inverted
                          trigger={
                            <Button
                              onClick={() =>
                                this.showModifyDescription(myPlan.name)
                              }
                              color="blue"
                              icon
                            >
                              <Icon name="pencil" />
                            </Button>
                          }
                          content={t("hft.myPlans.addDescription")}
                        />
                      </Button.Group>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="equal">
                    <Grid.Column>
                      <Grid textAlign="justified" columns="equal">
                        <Grid.Row
                          columns={4}
                          style={{
                            fontSize: "12px",
                            paddingBottom: "0px",
                            paddingTop: "0px",
                          }}
                        >
                          <Grid.Column
                            computer={4}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>{t("hft.myPlans.initialDate")}</p>
                          </Grid.Column>
                          <Grid.Column
                            computer={5}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>
                              {this.formatDate(
                                new Date(myPlan.initialTimestamp)
                              )}
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            computer={4}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>{t("hft.myPlans.initialBalance")}</p>
                          </Grid.Column>
                          <Grid.Column
                            computer={3}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>
                              {this.floorDecimals(
                                myPlan.initialAmounts[0].amount,
                                8
                              )}{" "}
                              {myPlan.initialAmounts[0].currency}
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                          columns={4}
                          style={{ fontSize: "12px", paddingBottom: "0px" }}
                        >
                          <Grid.Column
                            computer={4}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>{t("hft.myPlans.finalDate")}</p>
                          </Grid.Column>
                          <Grid.Column
                            computer={5}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>
                              {this.formatDate(new Date(myPlan.finalTimestamp))}
                            </p>
                          </Grid.Column>
                          <Grid.Column
                            computer={4}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>{t("hft.myPlans.currentBalance")}</p>
                          </Grid.Column>
                          <Grid.Column
                            computer={3}
                            largeScreen={4}
                            mobile={8}
                            tablet={8}
                          >
                            <p>
                              {this.floorDecimals(myPlan.actualBalance, 8)}{" "}
                              {myPlan.initialAmounts[0].currency}
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                    <Grid.Column />
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      {myPlan.graphData.length !== 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            width={225}
                            height={200}
                            data={myPlan.graphData}
                            margin={{
                              top: 15,
                              right: 0,
                              left: -15,
                              bottom: 15,
                            }}
                            barSize={20}
                          >
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar
                              dataKey={myPlan.initialAmounts[0].currency}
                              fill="#f7921a"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {myPlan.graphData.length === 0 && (
                        <Segment
                          id="noMovementsPlaceholder"
                          placeholder
                          size="tiny"
                        >
                          <Header icon>
                            <Icon name="wait" />
                            {t("hft.myPlans.notMovements")}
                          </Header>
                        </Segment>
                      )}
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                      <Label
                        id="actualPerformanceLabel"
                        //style = {{size : window.innerWidth <= 374 ? 10:0 }}
                        color="blue"
                      >
                        {t("hft.myPlans.yield")}
                        <Label.Detail
                          style={{ size: window.innerWidth <= 374 ? 10 : 0 }}
                        >
                          {myPlan.actualPerformance} %
                        </Label.Detail>
                      </Label>
                      <Label
                        id="expectedPerformanceLabel"
                        //size="medium"
                        //style = {{size : window.innerWidth <= 374 ? 10:0 }}
                        color="blue"
                      >
                        {t("hft.myPlans.projectedYield")}
                        <Label.Detail
                          style={{ size: window.innerWidth <= 374 ? 10 : 0 }}
                        >
                          {myPlan.expectedPerformance} %
                        </Label.Detail>
                      </Label>
                      <Divider section hidden />
                      {myPlan.allGraphData.length > 3 && (
                        <Modal
                          closeIcon
                          trigger={
                            <Button
                              id="seeMoreChart"
                              icon
                              labelPosition="left"
                              floated="left"
                              compact
                              type="submit"
                            >
                              <Icon name="chart bar outline" />
                              {t("hft.myPlans.seeMore")}
                            </Button>
                          }
                        >
                          <Modal.Header>
                            <Header as="h2">
                              <Icon name="chart bar outline" />
                              <Header.Content>
                                {t("hft.myPlans.modalDetails.header")}{" "}
                                {t(
                                  "hft.commons.plansName." + myPlan.spanishName
                                )}
                                <Header.Subheader>
                                  {t("hft.myPlans.modalDetails.subheader")}
                                </Header.Subheader>
                              </Header.Content>
                            </Header>
                          </Modal.Header>
                          <Modal.Content>
                            <ResponsiveContainer width="99%" aspect={3}>
                              <BarChart
                                width={850}
                                height={300}
                                data={myPlan.allGraphData}
                                margin={{
                                  top: 15,
                                  right: 0,
                                  left: -15,
                                  bottom: 15,
                                }}
                                barSize={20}
                              >
                                <CartesianGrid strokeDasharray="1 1" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <ReferenceLine y={0} stroke="#000" />
                                <Bar
                                  dataKey={myPlan.initialAmounts[0].currency}
                                  fill="#f7921a"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </Modal.Content>
                        </Modal>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
              <Divider hidden />
            </Grid.Column>
          ))}
        </Grid>
        <Modal
          open={this.state.showModifyDescription}
          onClose={this.closeModifyDescription}
        >
          <Modal.Header>{t("hft.myPlans.modalModifyDesc.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Field>
                  <label>{t("hft.myPlans.modalModifyDesc.planDesc")}</label>
                  <input
                    placeholder={t(
                      "hft.myPlans.modalModifyDesc.placeholderDesc"
                    )}
                    onChange={this.handleDescription}
                  />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.modifyDescription} primary>
              <Icon name="checkmark" />{" "}
              {t("hft.myPlans.modalModifyDesc.header")}
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.openSendConfirm}
          onClose={this.closeSendConfirm}
        >
          <Modal.Header>{t("hft.myPlans.modalConfirm.header")}</Modal.Header>
          <Modal.Content>
            <Segment basic loading={this.state.loading}>
              <Modal.Description>
                <p>{t("hft.myPlans.modalConfirm.description")}</p>
                <Form>
                  <Form.Field>
                    <label>Token</label>
                    <input
                      placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
                      onChange={this.handleToken}
                      value={this.state.verifyToken}
                    />
                  </Form.Field>
                </Form>
                {messageTokenNotFound}
                {messageTokenExpirated}
                {this.state.viewMessage && (
                  <Message color={this.state.colorMessage}>
                    {t(this.state.textMessage)}
                  </Message>
                )}
              </Modal.Description>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.endInactivate && (
              <Button
                color="red"
                onClick={this.closeSendConfirm}
                disabled={this.state.loading}
              >
                {t("hft.myPlans.modalConfirm.actions.buttonNo")}
              </Button>
            )}
            {this.state.endInactivate && (
              <Button color="blue" onClick={this.closeSendConfirm}>
                {t("hft.myPlans.modalConfirm.actions.buttonNo")}
              </Button>
            )}
            {!this.state.endInactivate && (
              <Button
                disabled={this.state.verifyToken === "" || this.state.loading}
                onClick={this.aceptSendConfirm}
                color="green"
              >
                {t("hft.myPlans.modalConfirm.actions.buttonYes")}
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          closeIcon
          open={this.state.successfulInactivate}
          onClose={this.closeSuccessfulInactivate}
        >
          <Modal.Header>{t("hft.myPlans.modalSuccess.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>{t("hft.myPlans.modalSuccess.content")}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Modal
          closeIcon
          open={this.state.errorInactivate}
          onClose={this.closeErrorInactivate}
        >
          <Modal.Header>{t("hft.myPlans.modalFail.header")}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>{t("hft.myPlans.modalFail.content")}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Container>
    );
  }
}

export default translate(MyPlans);
