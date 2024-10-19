import React, { Component } from "react";
import ISOCURRENCIES from "../../../common/ISO4217";
import "../Admin.css";
import {
  Segment,
  Container,
  Grid,
  Form,
  Button,
  Divider,
  Icon,
  Header,
  Select,
  Step,
  Checkbox,
  } from "semantic-ui-react";


class AddCurrencyConfig extends Component {
  constructor(props) {
    super(props);
    var isoCurrenciesArray = [];
    Object.keys(ISOCURRENCIES).forEach(function eachKey(key) {
      if (key === "ISOCURRENCIES") {
        isoCurrenciesArray = ISOCURRENCIES[key];
      }
    });
    this.state = {
      stepSelected: "generalData",
      currencyOptionsSelect: isoCurrenciesArray,
      currencyToAdd: "",
      completeNameToAdd: "",
      statusOptionsSelect: [
        { text: "Activa", key: "Activa", value: true },
        { text: "Inactiva", key: "Inactiva", value: false }
      ],
      statusToAdd: "",
      testArray: [
        {
          key: "TRANSFER_NATIONAL_BANK",
          text: "TRANSFER_NATIONAL_BANK",
          value: "TRANSFER_NATIONAL_BANK"
        },
        {
          key: "TRANSFER_WITH_SPECIFIC_BANK",
          text: "TRANSFER_WITH_SPECIFIC_BANK",
          value: "TRANSFER_WITH_SPECIFIC_BANK"
        }
      ],
      paymentToAdd: "",
      paymentsToAddList: []
    };
  }
  handleStepClick = stepClicked => {
    this.setState({ stepSelected: stepClicked });
  };
  pickCurrency = (e, data) => {
    this.setState({
      currencyToAdd: data.value.split("_")[0],
      completeNameToAdd: data.value.split("_")[1]
    });
  };
  pickPaymentTypeToAdd = (e, data) => {
    this.setState({
      paymentToAdd: data.value
    });
  };
  pickStatus = (e, data) => {
    this.setState({
      statusToAdd: data.value
    });
  };
  handleCompleteName = e => {
    this.setState({ completeNameToAdd: e.target.value });
  };
  addPaymentTypeToForm = () => {
    var paymentToAddArray = [];
    for (var i = 0; i < this.state.testArray.length; i++) {
      if (this.state.testArray[i].value === this.state.paymentToAdd) {
        paymentToAddArray = this.state.paymentsToAddList;
        paymentToAddArray.push(this.state.paymentToAdd);
        this.setState({
          testArray: this.state.testArray.splice(i + 1, 1),
          paymentsToAddList: paymentToAddArray
        });
        break;
      }
    }
  };
  removePaymentTypeFromForm = valueToRemove => {
    var paymentToAddArray = [];
    for (var i = 0; i < this.state.paymentsToAddList.length; i++) {
      if (this.state.paymentsToAddList[i] === valueToRemove) {
        paymentToAddArray = this.state.testArray;
        var objectToAdd = {
          key: valueToRemove,
          text: valueToRemove,
          value: valueToRemove
        };
        paymentToAddArray.push(objectToAdd);
        this.setState({
          testArray: paymentToAddArray,
          paymentsToAddList: this.state.paymentsToAddList.splice(i + 1, 1)
        });
        break;
      }
    }
  };
  render() {
    return (
      <div style={{ margin: -14 }}>
        <Step.Group size="mini" attached="top" widths={4} ordered>
          <Step active={this.state.stepSelected === "generalData"}>
            <Step.Content>
              <Step.Title>Datos generales</Step.Title>
            </Step.Content>
          </Step>
          <Step active={this.state.stepSelected === "paymentTypes"}>
            <Step.Content>
              <Step.Title>Medios de pago</Step.Title>
            </Step.Content>
          </Step>
          <Step active={this.state.stepSelected === "automaticChatMessages"}>
            <Step.Content>
              <Step.Title>Mensajes predeterminados</Step.Title>
            </Step.Content>
          </Step>
          <Step active={this.state.stepSelected === "checklistConfig"}>
            <Step.Content>
              <Step.Title>Lista de tareas</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
        <Segment attached>
          {this.state.stepSelected === "generalData" && (
            <Container>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Moneda</label>
                    <Select
                      placeholder="Seleccione la moneda"
                      search
                      options={this.state.currencyOptionsSelect}
                      onChange={this.pickCurrency}
                    />
                  </Form.Field>
                  <Form.Field width={5}>
                    <label>Código</label>
                    {this.state.currencyToAdd !== "" ? (
                      <p style={{ marginTop: 15 }}>
                        {this.state.currencyToAdd}
                      </p>
                    ) : (
                      <p style={{ marginTop: 15 }}>XXX</p>
                    )}
                  </Form.Field>
                  <Form.Field>
                    <label>Estado</label>
                    <Select
                      placeholder="Seleccione el estado"
                      options={this.state.statusOptionsSelect}
                      onChange={this.pickStatus}
                    />
                  </Form.Field>
                </Form.Group>
                <div style={{ textAlign: "right" }}>
                  <Button
                    color="blue"
                    type="submit"
                    onClick={() => this.handleStepClick("paymentTypes")}
                    // disabled={
                    //   this.state.completeNameToAdd === "" ||
                    //   this.state.currencyToAdd === "" ||
                    //   this.state.statusToAdd === ""
                    // }
                  >
                    Siguiente
                  </Button>
                </div>
              </Form>
            </Container>
          )}
          {this.state.stepSelected === "paymentTypes" && (
            <Container>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Tipo de medio de pago</label>
                    <Select
                      placeholder="Seleccione el tipo de pago"
                      search
                      options={this.state.testArray}
                      onChange={this.pickPaymentTypeToAdd}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Button
                      style={{ marginTop: 24 }}
                      type="submit"
                      color="blue"
                      icon
                      onClick={() => this.addPaymentTypeToForm()}
                    >
                      <Icon name="add" />
                    </Button>
                  </Form.Field>
                </Form.Group>
                <Divider section />
                {this.state.paymentsToAddList.length > 0 && (
                  <span>
                    {this.state.paymentsToAddList.map(k => {
                      return (
                        <Grid key={k}>
                          <Grid.Row columns="equal">
                            <Grid.Column width={5}>
                              <Header style={{ marginTop: 6 }}>{k}</Header>
                            </Grid.Column>
                            <Grid.Column>
                              <Button
                                circular
                                size="mini"
                                style={{ marginLeft: 10 }}
                                type="submit"
                                color="red"
                                icon
                                onClick={() =>
                                  this.removePaymentTypeFromForm(k)
                                }
                              >
                                <Icon name="remove" />
                              </Button>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row columns="equal">
                            <Grid.Column>
                              <Form.Group widths={2}>
                                <Form.Field>
                                  <label>Bancos</label>
                                  <Select
                                    placeholder="Seleccione"
                                    search
                                    multiple
                                    options={[
                                      {
                                        key: "BNCO",
                                        text: "bancooooooooooooooo",
                                        value: "bancooooooooooooooo"
                                      }
                                    ]}
                                  />
                                </Form.Field>
                              </Form.Group>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column>
                              <Form.Group widths="equal">
                                <Form.Field>
                                  <Checkbox
                                    label="Añadir mensaje verde"
                                    onChange={this.toggleGreenMessage()}
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <Checkbox
                                    label="Añadir mensaje azul"
                                    onChange={this.toggleBlueMessage()}
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <Checkbox
                                    label="Añadir mensaje rojo"
                                    onChange={this.toggleRedMessage()}
                                  />
                                </Form.Field>
                              </Form.Group>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      );
                    })}
                  </span>
                )}

                <Grid>
                  <Grid.Row columns="equal">
                    <Grid.Column textAlign="left">
                      <Button
                        color="blue"
                        type="submit"
                        onClick={() => this.handleStepClick("generalData")}
                      >
                        Anterior
                      </Button>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                      <Button
                        color="blue"
                        type="submit"
                        onClick={() =>
                          this.handleStepClick("automaticChatMessages")
                        }
                      >
                        Siguiente
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Container>
          )}
          {this.state.stepSelected === "automaticChatMessages" && "cccccc"}
          {this.state.stepSelected === "checklistConfig" && "dddddd"}
        </Segment>
      </div>
    );
  }
}

export default AddCurrencyConfig;