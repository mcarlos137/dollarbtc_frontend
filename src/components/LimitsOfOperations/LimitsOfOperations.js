import React, { Component } from "react";
import {
  Table,
  Accordion,
  Grid,
  Header,
  Container,
  Segment,
  Responsive,
  Divider,
} from "semantic-ui-react";
//import "./Faqs.css";
import NumberFormat from "react-number-format";
import otc from "../../services/otc";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";

class LimitsOfOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      translator: props.translate,
      limitsOfOperations: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.getLimitsOfOperations();
    this.setState({
      translator: this.props.translate,
    });
  }
  getLimitsOfOperations() {
    this.setState({ loading: true });
    otc
      .getLimitsOfOperations()
      .then((resp) => {
        let limits = resp.data;
        let listLimits = [];
        let limitByCurrency = [];

        Object.entries(limits).forEach(([key, value]) => {
          let objFinal = {};
          objFinal.currency = key;
          Object.entries(value).forEach(([k, v]) => {
            if (k === "dayly") {
              Object.entries(v).forEach(([user, val]) => {
                if (user === "normal") {
                  let data = [];
                  Object.entries(val).forEach(([i, j]) => {
                    let normalObj = {};
                    normalObj.name = i;
                    normalObj.valueDayly = j;
                    data.push(normalObj);
                  });
                  objFinal.normal = data;
                } else if (user === "company") {
                  let data = [];
                  Object.entries(val).forEach(([i, j]) => {
                    let companyObj = {};
                    companyObj.name = i;
                    companyObj.valueDayly = j;
                    data.push(companyObj);
                  });
                  objFinal.company = data;
                } else if (user === "broker") {
                  let data = [];
                  Object.entries(val).forEach(([i, j]) => {
                    let brokerObj = {};
                    brokerObj.name = i;
                    brokerObj.valueDayly = j;
                    data.push(brokerObj);
                  });
                  objFinal.broker = data;
                }
              });
            } else {
              Object.entries(v).forEach(([user, val]) => {
                if (user === "normal") {
                  let dataNormal = objFinal.normal;
                  for (let i = 0; i < dataNormal.length; i++) {
                    let value = dataNormal[i];
                    Object.entries(val).forEach(([i, j]) => {
                      if (value.name === i) {
                        value.valueMonthly = j;
                      }
                    });
                  }
                } else if (user === "company") {
                  let dataCompany = objFinal.company;
                  for (let i = 0; i < dataCompany.length; i++) {
                    let value = dataCompany[i];
                    Object.entries(val).forEach(([i, j]) => {
                      if (value.name === i) {
                        value.valueMonthly = j;
                      }
                    });
                  }
                } else if (user === "broker") {
                  let dataBroker = objFinal.broker;
                  for (let i = 0; i < dataBroker.length; i++) {
                    let value = dataBroker[i];
                    Object.entries(val).forEach(([i, j]) => {
                      if (value.name === i) {
                        value.valueMonthly = j;
                      }
                    });
                  }
                }
              });
            }
          });
          limitByCurrency.push(objFinal);
        });

        this.setState({ limitsOfOperations: limitByCurrency, loading: false });
      })
      .catch((error) => {});
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  render() {
    let t = this.state.translator;
    const { activeIndex } = this.state;

    return (
      <div>
        {isMobile && <Divider hidden style={{ marginTop: "3em" }} />}
        <Segment color={!isMobile ? "orange" : ""} loading={this.state.loading}>
          <Header
            as="h4"
            style={{
              color: "#207ef2",
              fontWeight: "bold",
              textAlign: "center",
              paddingTop: 20,
            }}
            size="medium"
          >
            {t("limits.title")}
          </Header>
          <Segment.Group>
            {this.state.limitsOfOperations.length !== 0 &&
              this.state.limitsOfOperations.map((item, index) => (
                <Segment>
                  <Accordion
                    key={index}
                    defaultActiveIndex={0}
                    panels={[
                      {
                        key: item.currency,
                        title: item.currency,
                        content: {
                          content: (
                            <Grid>
                              <Grid.Row columns={3} textAlign="left">
                                <Grid.Column computer={1} largeScreen={1} />
                                <Grid.Column
                                  computer={item.currency !== "BTC" ? 9 : 7}
                                  largeScreen={item.currency !== "BTC" ? 9 : 7}
                                  mobile={16}
                                  tablet={16}
                                  //style={{ marginLeft: -30 }}
                                >
                                  <Table
                                    basic="very"
                                    style={{ fontSize: "0.9em" }}
                                    textAlign="left"
                                  >
                                    <Table.Header>
                                      <Table.Row textAlign="left">
                                        <Table.HeaderCell />
                                        <Table.HeaderCell>
                                          {t(
                                            "limits.contentLimit.contentTitle.normal"
                                          )}
                                          <br />
                                          <br />
                                          {t(
                                            "limits.contentLimit.dayly"
                                          )} /{" "}
                                          {t("limits.contentLimit.monthly")}
                                        </Table.HeaderCell>
                                      </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                      {item.normal.map((key, i) => (
                                        <Table.Row>
                                          <Table.Cell>
                                            <Header
                                              as="h5"
                                              style={{ fontSize: "1em" }}
                                            >
                                              {t(
                                                "limits.contentLimit.contentTitle." +
                                                  key.name
                                              )}
                                            </Header>
                                          </Table.Cell>
                                          <Table.Cell
                                            textAlign={
                                              "left"
                                              //isMobile ? "left" : "center"
                                            }
                                          >
                                            <NumberFormat
                                              value={key.valueDayly}
                                              displayType={"text"}
                                              thousandSeparator={true}
                                            />{" "}
                                            /{" "}
                                            <NumberFormat
                                              value={key.valueMonthly}
                                              displayType={"text"}
                                              thousandSeparator={true}
                                            />
                                            {" " + item.currency}
                                          </Table.Cell>
                                        </Table.Row>
                                      ))}
                                    </Table.Body>
                                  </Table>
                                </Grid.Column>
                                <Grid.Column
                                  computer={item.currency !== "BTC" ? 4 : 3}
                                  largeScreen={item.currency !== "BTC" ? 4 : 3}
                                  mobile={16}
                                  tablet={16}
                                >
                                  {isMobile ? (
                                    <Table
                                      basic="very"
                                      style={{ fontSize: "0.9em" }}
                                    >
                                      <Table.Header>
                                        <Table.Row
                                          textAlign={
                                            isMobile ? "center" : "left"
                                          }
                                        >
                                          <Table.HeaderCell />

                                          <Table.HeaderCell>
                                            {t(
                                              "limits.contentLimit.contentTitle.company"
                                            )}
                                            <br />
                                            <br />
                                            {t(
                                              "limits.contentLimit.dayly"
                                            )} /{" "}
                                            {t("limits.contentLimit.monthly")}
                                          </Table.HeaderCell>
                                        </Table.Row>
                                      </Table.Header>
                                      <Table.Body>
                                        {item.company.map((key, i) => (
                                          <Table.Row>
                                            <Table.Cell>
                                              <Header as="h5">
                                                {t(
                                                  "limits.contentLimit.contentTitle." +
                                                    key.name
                                                )}
                                              </Header>
                                            </Table.Cell>
                                            <Table.Cell>
                                              <NumberFormat
                                                value={key.valueDayly}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                              />{" "}
                                              /{" "}
                                              <NumberFormat
                                                value={key.valueMonthly}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                              />
                                              {" " + item.currency}
                                            </Table.Cell>
                                          </Table.Row>
                                        ))}
                                      </Table.Body>
                                    </Table>
                                  ) : (
                                    <Table
                                      basic="very"
                                      textAlign="left"
                                      style={{
                                        marginLeft: -30,
                                        fontSize: "0.9em",
                                      }}
                                    >
                                      <Table.Header>
                                        <Table.Row>
                                          <Table.HeaderCell>
                                            {t(
                                              "limits.contentLimit.contentTitle.company"
                                            )}
                                            <br />
                                            <br />
                                            {t(
                                              "limits.contentLimit.dayly"
                                            )} /{" "}
                                            {t("limits.contentLimit.monthly")}
                                          </Table.HeaderCell>
                                        </Table.Row>
                                      </Table.Header>
                                      <Table.Body>
                                        {item.company.map((key, i) => (
                                          <Table.Row>
                                            {isMobile && (
                                              <Table.Cell>
                                                <Header as="h5">
                                                  {t(
                                                    "limits.contentLimit.contentTitle." +
                                                      key.name
                                                  )}
                                                </Header>
                                              </Table.Cell>
                                            )}
                                            <Table.Cell>
                                              <NumberFormat
                                                value={key.valueDayly}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                              />{" "}
                                              /{" "}
                                              <NumberFormat
                                                value={key.valueMonthly}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                              />
                                              {" " + item.currency}
                                            </Table.Cell>
                                          </Table.Row>
                                        ))}
                                      </Table.Body>
                                    </Table>
                                  )}
                                </Grid.Column>
                                {item.currency === "BTC" && (
                                  <Grid.Column
                                    computer={5}
                                    largeScreen={5}
                                    mobile={16}
                                    tablet={16}
                                  >
                                    {isMobile ? (
                                      <Table
                                        basic="very"
                                        style={{ fontSize: "0.9em" }}
                                      >
                                        <Table.Header>
                                          <Table.Row textAlign="center">
                                            <Table.HeaderCell />

                                            <Table.HeaderCell>
                                              {t(
                                                "limits.contentLimit.contentTitle.broker"
                                              )}
                                              <br />
                                              <br />
                                              {t(
                                                "limits.contentLimit.dayly"
                                              )} /{" "}
                                              {t("limits.contentLimit.monthly")}
                                            </Table.HeaderCell>
                                          </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                          {item.broker.map((key, i) => (
                                            <Table.Row>
                                              <Table.Cell>
                                                <Header as="h5">
                                                  {t(
                                                    "limits.contentLimit.contentTitle." +
                                                      key.name
                                                  )}
                                                </Header>
                                              </Table.Cell>
                                              <Table.Cell>
                                                <NumberFormat
                                                  value={key.valueDayly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />{" "}
                                                /{" "}
                                                <NumberFormat
                                                  value={key.valueMonthly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                                {" " + item.currency}
                                              </Table.Cell>
                                            </Table.Row>
                                          ))}
                                        </Table.Body>
                                      </Table>
                                    ) : (
                                      <Table
                                        basic="very"
                                        textAlign="left"
                                        style={{
                                          fontSize: "0.9em",
                                          marginLeft:
                                            item.currency === "BTC" ? -90 : -10,
                                          paddingRight:
                                            item.currency === "BTC" ? "9em" : 0,
                                        }}
                                      >
                                        <Table.Header>
                                          <Table.Row>
                                            {item.currency !== "BTC" ? (
                                              <Table.HeaderCell />
                                            ) : (
                                              ""
                                            )}
                                            <Table.HeaderCell>
                                              {t(
                                                "limits.contentLimit.contentTitle.broker"
                                              )}
                                              <br />
                                              <br />
                                              {t(
                                                "limits.contentLimit.dayly"
                                              )} /{" "}
                                              {t("limits.contentLimit.monthly")}
                                            </Table.HeaderCell>
                                          </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                          {item.broker.map((key, i) => (
                                            <Table.Row>
                                              {item.currency !== "BTC" ? (
                                                <Table.Cell>
                                                  <Header
                                                    as="h5"
                                                    style={{ fontSize: "1em" }}
                                                  >
                                                    {t(
                                                      "limits.contentLimit.contentTitle." +
                                                        key.name
                                                    )}
                                                  </Header>
                                                </Table.Cell>
                                              ) : (
                                                ""
                                              )}

                                              <Table.Cell>
                                                <NumberFormat
                                                  value={key.valueDayly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />{" "}
                                                /{" "}
                                                <NumberFormat
                                                  value={key.valueMonthly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                                {" " + item.currency}
                                              </Table.Cell>
                                            </Table.Row>
                                          ))}
                                        </Table.Body>
                                      </Table>
                                    )}
                                  </Grid.Column>
                                )}
                              </Grid.Row>
                              {item.currency !== "BTC" && (
                                <Grid.Row textAlign="left">
                                  <Grid.Column computer={1} largeScreen={1} />
                                  <Grid.Column
                                    computer={13}
                                    largeScreen={13}
                                    mobile={16}
                                    tablet={16}
                                  >
                                    {isMobile ? (
                                      <Table
                                        basic="very"
                                        style={{ fontSize: "0.9em" }}
                                      >
                                        <Table.Header>
                                          <Table.Row textAlign="center">
                                            <Table.HeaderCell />

                                            <Table.HeaderCell>
                                              {t(
                                                "limits.contentLimit.contentTitle.broker"
                                              )}
                                              <br />
                                              <br />
                                              {t(
                                                "limits.contentLimit.dayly"
                                              )} /{" "}
                                              {t("limits.contentLimit.monthly")}
                                            </Table.HeaderCell>
                                          </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                          {item.broker.map((key, i) => (
                                            <Table.Row>
                                              <Table.Cell>
                                                <Header as="h5">
                                                  {t(
                                                    "limits.contentLimit.contentTitle." +
                                                      key.name
                                                  )}
                                                </Header>
                                              </Table.Cell>
                                              <Table.Cell>
                                                <NumberFormat
                                                  value={key.valueDayly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />{" "}
                                                /{" "}
                                                <NumberFormat
                                                  value={key.valueMonthly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                                {" " + item.currency}
                                              </Table.Cell>
                                            </Table.Row>
                                          ))}
                                        </Table.Body>
                                      </Table>
                                    ) : (
                                      <Table
                                        basic="very"
                                        textAlign="left"
                                        style={{
                                          fontSize: "0.9em",
                                          marginLeft: 10,
                                          paddingRight: 10,
                                        }}
                                      >
                                        <Table.Header>
                                          <Table.Row>
                                            {item.currency !== "BTC" ? (
                                              <Table.HeaderCell />
                                            ) : (
                                              ""
                                            )}
                                            <Table.HeaderCell>
                                              {t(
                                                "limits.contentLimit.contentTitle.broker"
                                              )}
                                              <br />
                                              <br />
                                              {t(
                                                "limits.contentLimit.dayly"
                                              )} /{" "}
                                              {t("limits.contentLimit.monthly")}
                                            </Table.HeaderCell>
                                          </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                          {item.broker.map((key, i) => (
                                            <Table.Row>
                                              {item.currency !== "BTC" ? (
                                                <Table.Cell>
                                                  <Header
                                                    as="h5"
                                                    style={{ fontSize: "1em" }}
                                                  >
                                                    {t(
                                                      "limits.contentLimit.contentTitle." +
                                                        key.name
                                                    )}
                                                  </Header>
                                                </Table.Cell>
                                              ) : (
                                                ""
                                              )}

                                              <Table.Cell>
                                                <NumberFormat
                                                  value={key.valueDayly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />{" "}
                                                /{" "}
                                                <NumberFormat
                                                  value={key.valueMonthly}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                                {" " + item.currency}
                                              </Table.Cell>
                                            </Table.Row>
                                          ))}
                                        </Table.Body>
                                      </Table>
                                    )}
                                  </Grid.Column>
                                </Grid.Row>
                              )}
                            </Grid>
                          ),
                        },
                      },
                    ]}
                    fluid
                  ></Accordion>
                </Segment>
              ))}
          </Segment.Group>
        </Segment>
      </div>
    );
  }
}
export default translate(LimitsOfOperations);
