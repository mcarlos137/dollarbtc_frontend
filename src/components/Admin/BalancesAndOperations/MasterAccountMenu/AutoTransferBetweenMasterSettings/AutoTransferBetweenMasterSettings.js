import React, { Component } from "react";
import "../../../Admin.css";
import {
  Grid,
  Form,
  Button,
  Divider,
  Icon,
  Loader,
  Dimmer,
  Modal,
  Select,
  List,
  Message,
  Label,
} from "semantic-ui-react";
import ReactTable from "react-table";
import marketModulator from "../../../../../services/marketModulator";
import masterAccount from "../../../../../services/masterAccount";

class AutoTransferBetweenMasterSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      automaticRules: [],
      editRulesModal: false,
      masterAccountNames: [],
      baseAccountToAdd: null,
      accountTargetsOptions: null,
      accountTargets: null,
      keyTargetsAccount: Math.random(),
      percentsTargetAccount: [],
      operationType: null,
      operationTypeOptions: [],
      modelsTarget: null,
      modelTargetsOptions: null,
      jsonRules: [],
      executionTime: null,
      statusToAdd: null,
      keyForm: Math.random(),
      showMessageExceedPercent: false,
      showStep: "ADD",
      showMasterAccountTable: false,
      loadConfirmButton: false,
    };
  }

  handleExecutionTime = (e) => {
    this.setState({ executionTime: parseInt(e.target.value) });
  };
  handlePercent = (e) => {
    var percents = this.state.percentsTargetAccount;
    var percentToAdd = {};
    percentToAdd.name = e.target.id;
    percentToAdd.percent = parseInt(e.target.value);
    const index = percents.findIndex((e) => e.name === percentToAdd.name);
    if (index === -1) {
      percents.push(percentToAdd);
    } else {
      percents[index] = percentToAdd;
    }
    var definitiveArray = [];
    if (this.state.accountTargets !== null) {
      for (var i = 0; i < this.state.accountTargets.length; i++) {
        for (var j = 0; j < percents.length; j++) {
          if (percents[j].name === this.state.accountTargets[i]) {
            definitiveArray.push(percents[j]);
          }
        }
      }
    } else {
      for (var z = 0; z < this.state.modelsTarget.length; z++) {
        for (var x = 0; x < percents.length; x++) {
          if (percents[x].name === this.state.modelsTarget[z]) {
            if (!isNaN(percents[x].percent)) {
              definitiveArray.push(percents[x]);
            }
          }
        }
      }
    }
    var totalPercent = 0;
    for (var y = 0; y < definitiveArray.length; y++) {
      if (!isNaN(definitiveArray[y].percent)) {
        totalPercent = totalPercent + definitiveArray[y].percent;
      }
    }
    if (totalPercent <= 100 || isNaN(totalPercent)) {
      this.setState({
        percentsTargetAccount: definitiveArray,
        showMessageExceedPercent: false,
      });
    } else {
      this.setState({ showMessageExceedPercent: true });
    }
  };

  pickOperationType = (e, data) => {
    if (data.value === "TRANSFER_BETWEEN_MASTERS") {
      this.setState({
        operationType: data.value,
        modelsTarget: null,
        accountTargets: null,
      });
    } else if (data.value === "TRANSFER_TO_CLIENTS") {
      this.setState({
        operationType: data.value,
        accountTargets: null,
        modelsTarget: null,
      });
    }
  };

  pickBaseAccount = (e, data) => {
    this.getDetailOperationType();
    this.getAccountsNames();
    this.getModelsNames();
    this.setState(
      {
        baseAccountToAdd: data.value,
        accountTargets: null,
        keyTargetsAccount: Math.random(),
      },
      () => {
        let masterAccountsBase = this.state.masterAccountNames.slice();
        var index = masterAccountsBase
          .map((x) => {
            return x.value;
          })
          .indexOf(this.state.baseAccountToAdd);
        masterAccountsBase.splice(index, 1);
        this.setState({ accountTargetsOptions: masterAccountsBase });
      }
    );
  };

  pickTargetsAccounts = (e, data) => {
    this.setState({ modelsTarget: null, accountTargets: data.value });
  };

  pickTargetsModels = (e, data) => {
    this.setState({ accountTargets: null, modelsTarget: data.value });
  };
  pickStatus = (e, data) => {
    this.setState({ statusToAdd: data.value });
  };

  getAccountsNames = () => {
    masterAccount
      .getMasterAccountNames()
      .then((resp) => {
        var masterAccount = [];
        for (var i = 0; i < resp.data.length; i++) {
          var masterAccountToAdd = {};
          masterAccountToAdd.key = resp.data[i];
          masterAccountToAdd.value = resp.data[i];
          masterAccountToAdd.text = resp.data[i];
          masterAccount.push(masterAccountToAdd);
        }
        this.setState({
          masterAccountNames: masterAccount,
        });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  getModelsNames = () => {
    var options = [
      { key: "defensive", value: "defensive", text: "defensive" },
      { key: "moderate", value: "moderate", text: "moderate" },
      { key: "intense", value: "intense", text: "intense" },
      { key: "aggressive", value: "aggressive", text: "aggressive" },
    ];
    this.setState({ modelTargetsOptions: options });
  };
  componentDidMount() {
    this.getAutomaticRules();
    this.getAccountsNames();
  }
  getAutomaticRules = () => {
    let url = masterAccount.getAutomaticRulesMaster();
    url
      .then((resp) => {
        this.makeDataTable(resp.data);
      })
      .catch((error) => {});
  };
  makeDataTable = (rules, toConfirm) => {
    if (!toConfirm) {
      var automRules = [];
      for (var i = 0; i < rules.length; i++) {
        var ruleToAdd = {};
        ruleToAdd.baseAccount = rules[i].baseAccount;
        ruleToAdd.active = rules[i].active ? "Activa" : "Inactiva";
        ruleToAdd.balanceOperationType = rules[i].balanceOperationType;
        ruleToAdd.executionPeriodInHours = rules[i].executionPeriodInHours;
        ruleToAdd.targetAccountsOrClientModelNameAndPercents =
          rules[i].targetAccountsOrClientModelNameAndPercents;
        automRules.push(ruleToAdd);
      }
      //console.log("automatic rules", automRules);
      this.setState({
        automaticRules: automRules,
        showMasterAccountTable: true,
      });
    } else {
      var toConfirmAutomRules = [];
      for (var j = 0; j < rules.length; j++) {
        var toConfirmruleToAdd = {};
        toConfirmruleToAdd.baseAccount = rules[j].baseAccount;
        toConfirmruleToAdd.active = rules[j].active ? "Activa" : "Inactiva";
        toConfirmruleToAdd.balanceOperationType = rules[j].balanceOperationType;
        toConfirmruleToAdd.executionPeriodInHours =
          rules[j].executionPeriodInHours;
        toConfirmruleToAdd.targetAccountsOrClientModelNameAndPercents =
          rules[j].targetAccountsOrClientModelNameAndPercents;
        toConfirmAutomRules.push(toConfirmruleToAdd);
      }
      //console.log("to confirm auto rules", toConfirmAutomRules);
      this.setState({
        toConfirmAutomaticRules: toConfirmAutomRules,
        showStep: "CONFIRM",
      });
    }
  };
  getDetailOperationType = () => {
    masterAccount
      .getMasterAccountDetails()
      .then((resp) => {
        var operationTypes = [
          {
            key: "TRANSFER_BETWEEN_MASTERS",
            value: "TRANSFER_BETWEEN_MASTERS",
            text: "Transferencia entre cuentas maestras",
          },
        ];
        for (var i = 0; i < resp.data.length; i++) {
          if (this.state.baseAccountToAdd === resp.data[i].name) {
            if (resp.data[i].transferToClients) {
              var typeToAdd = {
                key: "TRANSFER_TO_CLIENTS",
                value: "TRANSFER_TO_CLIENTS",
                text: "Transferencia a clientes",
              };
              operationTypes.push(typeToAdd);
            }
          }
        }
        this.setState({ operationTypeOptions: operationTypes });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  openEditRules = () =>
    this.setState({
      editRulesModal: true,
      showStep: "ADD",
      toConfirmAutomaticRules: [],
      jsonRules: [],
    });
  closeEditRules = () =>
    this.setState({
      editRulesModal: false,
      showStep: "ADD",
      toConfirmAutomaticRules: [],
      jsonRules: [],
    });
  sendJSONRules = () => {
    this.addAnotherRule();
    this.makeDataTable(this.state.jsonRules, true);
  };
  modifyJSON() {
    this.setState({ loadConfirmButton: true });
    var automaticRules = { automaticRules: this.state.jsonRules };
    marketModulator
      .editAutomaticRules(automaticRules)
      .then((res) => {
        this.setState({ loadConfirmButton: false });
        this.getAutomaticRules();
        this.closeEditRules();
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  addAnotherRule = () => {
    var allRules = this.state.jsonRules;
    var ruleToAdd = {
      baseAccount: this.state.baseAccountToAdd,
      active: this.state.statusToAdd === "SI" ? true : false,
      executionPeriodInHours: parseInt(this.state.executionTime),
      balanceOperationType: this.state.operationType,
      targetAccountsOrClientModelNameAndPercents: this.state
        .percentsTargetAccount,
    };
    allRules.push(ruleToAdd);
    this.setState({
      baseAccountToAdd: null,
      statusToAdd: null,
      executionTime: null,
      operationType: null,
      modelsTarget: null,
      accountTargets: null,
      percentsTargetAccount: [],
      keyForm: Math.random(),
      jsonRules: allRules,
    });
  };
  render() {
    let messageExceedPercent;
    if (this.state.showMessageExceedPercent) {
      messageExceedPercent = (
        <Message negative>
          <Message.Header>Porcentaje excedido</Message.Header>
          <p>
            El porcentaje total de las cuentas/modelos destinos puede ser máximo
            de 100.
          </p>
        </Message>
      );
    }
    const autoTransferAccountMasterTableHeaders = [
      {
        Header: "Cuenta base",
        accessor: "baseAccount",
      },
      {
        Header: "Estatus",
        accessor: "active",
        width: 95,
        Cell: (row) => {
          if (row.value === "Activa") {
            return (
              <Label color="green">
                <Icon name="check" />
                Activa
              </Label>
            );
          } else if (row.value === "Inactiva") {
            return (
              <Label color="red">
                <Icon name="exclamation" />
                Inactiva
              </Label>
            );
          }
        },
      },
      {
        Header: "Tipo de operación",
        accessor: "balanceOperationType",
        Cell: (row) => {
          if (row.value === "TRANSFER_BETWEEN_MASTERS") {
            return "Transferencia entre cuentas maestras";
          } else if (row.value === "TRANSFER_TO_CLIENTS") {
            return "Transferencia a clientes";
          } else return row.value;
        },
      },
      {
        Header: "Período entre ejecuciones(H)",
        accessor: "executionPeriodInHours",
      },
      {
        Header: "Cuentas/Modelos destinos",
        accessor: "targetAccountsOrClientModelNameAndPercents",
        Cell: (row) => {
          if (row.value.length > 0) {
            return (
              <List>
                {row.value.map((targetAccount, i) => (
                  <List.Item key={i}>
                    {targetAccount.name}: {targetAccount.percent}%
                  </List.Item>
                ))}
              </List>
            );
          } else {
            return 0;
          }
        },
      },
    ];
    const activeStatusOptions = [
      { key: "SI", value: "SI", text: "SI" },
      { key: "NO", value: "NO", text: "NO" },
    ];
    return (
      <div>
        {!this.state.showMasterAccountTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Modal
          open={this.state.editRulesModal}
          onClose={this.closeEditRules}
          trigger={
            <Button
              onClick={this.openEditRules}
              icon
              type="submit"
              color="blue"
              labelPosition="left"
            >
              <Icon name="pencil alternate" />
              Crear reglas
            </Button>
          }
        >
          <Modal.Header>
            <Icon name="pencil alternate" />
            Crear reglas
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {this.state.showStep === "ADD" && (
                <Form key={this.state.keyForm}>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Cuenta base</label>
                      <Select
                        placeholder="Seleccione una cuenta"
                        options={this.state.masterAccountNames}
                        onChange={this.pickBaseAccount}
                      />
                    </Form.Field>
                    {this.state.operationTypeOptions.length > 0 && (
                      <Form.Field>
                        <label>Operación</label>
                        <Select
                          placeholder="Seleccione un tipo"
                          options={this.state.operationTypeOptions}
                          onChange={this.pickOperationType}
                        />
                      </Form.Field>
                    )}
                    {this.state.baseAccountToAdd !== null &&
                      this.state.operationType ===
                        "TRANSFER_BETWEEN_MASTERS" && (
                        <Form.Field key={this.state.keyTargetsAccount}>
                          <label>Cuentas destino</label>
                          <Select
                            placeholder="Seleccione las cuentas"
                            multiple
                            selection
                            options={this.state.accountTargetsOptions}
                            onChange={this.pickTargetsAccounts}
                          />
                        </Form.Field>
                      )}
                    {this.state.baseAccountToAdd !== null &&
                      this.state.operationType === "TRANSFER_TO_CLIENTS" && (
                        <Form.Field key={this.state.keyTargetsAccount}>
                          <label>Modelos destino</label>
                          <Select
                            placeholder="Seleccione los modelos"
                            multiple
                            selection
                            options={this.state.modelTargetsOptions}
                            onChange={this.pickTargetsModels}
                          />
                        </Form.Field>
                      )}
                  </Form.Group>
                  {messageExceedPercent}
                  <Form.Group widths="equal">
                    {this.state.modelsTarget !== null && (
                      <Form.Field>
                        <Grid.Row columns={2}>
                          {this.state.modelsTarget.map((targetModel, i) => (
                            <Grid.Column width={8} key={i}>
                              <label>Porcentaje a {targetModel}</label>
                              <input
                                placeholder="20"
                                id={targetModel}
                                onChange={this.handlePercent}
                              />
                            </Grid.Column>
                          ))}
                        </Grid.Row>
                      </Form.Field>
                    )}
                    {this.state.accountTargets !== null && (
                      <Form.Field>
                        <Grid.Row columns={2}>
                          {this.state.accountTargets.map((targetAccount, i) => (
                            <Grid.Column width={8} key={i}>
                              <label>Porcentaje a {targetAccount}</label>
                              <input
                                placeholder="20"
                                id={targetAccount}
                                onChange={this.handlePercent}
                              />
                            </Grid.Column>
                          ))}
                        </Grid.Row>
                      </Form.Field>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Field>
                      <label>Período de ejecución (Horas)</label>
                      <input
                        placeholder="72"
                        onChange={this.handleExecutionTime}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Activo</label>
                      <Select
                        placeholder="Seleccione el estatus"
                        options={activeStatusOptions}
                        onChange={this.pickStatus}
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              )}
              {this.state.showStep === "CONFIRM" && (
                <div>
                  <p>
                    ¿Está seguro que desea que estas sean las nuevas reglas
                    automáticas de transferencia entre cuentas master?
                  </p>
                  <ReactTable
                    className="transactionTable"
                    data={this.state.toConfirmAutomaticRules}
                    columns={autoTransferAccountMasterTableHeaders}
                    defaultPageSize={5}
                    previousText="Anterior"
                    nextText="Siguiente"
                    loadingText="Cargando..."
                    noDataText="No existen reglas de transferencias"
                    pageText="Página"
                    ofText="de"
                    rowsText="filas"
                    pageJumpText="ir a la página"
                    rowsSelectorText="filas por página"
                    minRow={5}
                  />
                </div>
              )}
            </Modal.Description>
            {this.state.showStep === "ADD" && (
              <div style={{ textAlign: "right" }}>
                <Button
                  type="submit"
                  onClick={this.closeEditRules}
                  color="grey"
                  icon
                  labelPosition="left"
                >
                  <Icon name="cancel" />
                  Cancelar
                </Button>
                <Button.Group>
                  <Button
                    type="submit"
                    onClick={this.addAnotherRule}
                    color="blue"
                    icon
                    disabled={
                      this.state.percentsTargetAccount.length <= 0 ||
                      this.state.executionTime === null ||
                      this.state.statusToAdd === null ||
                      this.state.showMessageExceedPercent
                    }
                    labelPosition="left"
                  >
                    <Icon name="add" />
                    Agregar otra regla
                  </Button>
                  <Button
                    disabled={
                      this.state.percentsTargetAccount.length <= 0 ||
                      this.state.executionTime === null ||
                      this.state.statusToAdd === null ||
                      this.state.showMessageExceedPercent
                    }
                    type="submit"
                    color="blue"
                    onClick={this.sendJSONRules}
                    icon
                    labelPosition="right"
                  >
                    Confirmar
                    <Icon name="right arrow" />
                  </Button>
                </Button.Group>
              </div>
            )}
            {this.state.showStep === "CONFIRM" && (
              <div style={{ textAlign: "right" }}>
                <Button
                  type="submit"
                  onClick={this.closeEditRules}
                  color="grey"
                  icon
                  labelPosition="left"
                >
                  <Icon name="cancel" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  onClick={this.modifyJSON.bind(this)}
                  loading={this.state.loadConfirmButton}
                  icon
                  labelPosition="right"
                >
                  Si
                  <Icon name="checkmark" />
                </Button>
              </div>
            )}
          </Modal.Content>
        </Modal>
        <Divider />
        <ReactTable
          className="transactionTable"
          data={this.state.automaticRules}
          columns={autoTransferAccountMasterTableHeaders}
          defaultPageSize={5}
          previousText="Anterior"
          nextText="Siguiente"
          loadingText="Cargando..."
          noDataText="No existen reglas de transferencias"
          pageText="Página"
          ofText="de"
          rowsText="filas"
          pageJumpText="ir a la página"
          rowsSelectorText="filas por página"
          minRow={5}
        />
      </div>
    );
  }
}

export default AutoTransferBetweenMasterSettings;
