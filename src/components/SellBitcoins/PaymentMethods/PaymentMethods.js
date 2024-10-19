import React, { Component } from "react";
import "../SellBitcoins.css";
import {
  Checkbox,
  Divider,
  Select,
  Grid,
  Label,
  Message,
  Responsive
} from "semantic-ui-react";
import "react-table/react-table.css";

//Esta clase no se esta usando por eso no esta traducida
class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: "",
      holderId: "",
      accountHolder: "",
      accountNumber: "",
      message: "",
      userEmail: "",
      username: "",
      showRules: false,
      messageRule: "",
      constantPaymentsTypes: {
        TRANSFER_WITH_SPECIFIC_BANK:
          "Transferencia a banco específico (Recomendado)",
        TRANSFER_TO_NATIONAL_BANK: "Transferencia de banco nacional"
      }
    };
  }

  IsTransferenciaBancaria(type) {
    let arrayKeys = Object.keys(this.state.constantPaymentsTypes);
    let index = arrayKeys.findIndex(key => key === type);
    return index > -1;
  }

  handleBankPaymentMethod(event, data) {
    this.setState({
      bank: data.value
    });

    this.props.handleBank(event, data);
  }
  handleAccountNumberPaymentMethod(e) {
    this.setState({
      accountNumber: e.target.value
    });
    this.props.handleAccountNumber(e);
  }
  handleHolderNamePaymentMethod(e) {
    this.setState({
      accountHolder: e.target.value
    });
    this.props.handleHolderName(e);
  }
  handleHolderIdPaymentMethod(e) {
    this.setState({
      holderId: e.target.value
    });
    this.props.handleHolderId(e);
  }
  handleUserEmailPaymentMethod(e) {
    this.setState({
      userEmail: e.target.value
    });
    this.props.handleUserEmail(e);
  }
  handleUsernamePaymentMethod(e) {
    this.setState({
      username: e.target.value
    });
    this.props.handleUsername(e);
  }

  render() {
    let labelBankError,
      labelAccountNumber,
      labelAccountHolder,
      labelAccountHolderId,
      labelUserEmail,
      labelUsername,
      labelRules;
    if (this.props.messagesForClient !== null) {
      labelRules = (
        <Message
          negative
          content={
            this.props.messagesForClient.ALERT_RED ===
            "OPERATION MUST BE COMPLETED IN 90 MINUTES."
              ? "La operación debe ser completada en 90 minutos."
              : this.props.messagesForClient.ALERT_RED ===
                "OPERATION FROM DIFFERENT BANK MUST BE COMPLETED IN 72 HOURS."
              ? "La operación de diferentes bancos sera completada en 72 horas."
              : this.props.messagesForClient.ALERT_RED
          }
        />
      );
    }
    if (this.props.errorBank) {
      labelBankError = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }
    if (this.props.errorAccountHolder) {
      labelAccountHolder = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }
    if (this.props.errorHolderId) {
      labelAccountHolderId = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }
    if (this.props.errorAccountNumber) {
      labelAccountNumber = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }

    if (this.props.errorUserEmail) {
      labelUserEmail = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }
    if (this.props.errorUsername) {
      labelUsername = (
        <Label basic color="red" pointing>
          {this.props.message}
        </Label>
      );
    }
    return (
      <div>
        <div
          hidden={
            !this.props.isCreateTypePaymentSelected ||
            !this.IsTransferenciaBancaria(this.props.paymentTypeSelected.name)
          }
        >
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <Select
                  options={this.props.banksForSelect}
                  value={this.state.bank}
                  onChange={this.handleBankPaymentMethod.bind(this)}
                  placeholder="Banco"
                />
                {labelBankError}
              </Grid.Column>
              <Responsive {...Responsive.onlyMobile}>
                <Grid.Column>
                  <Divider hidden />
                </Grid.Column>
              </Responsive>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <input
                  placeholder="Nro. de Cuenta"
                  value={this.state.accountNumber}
                  onChange={this.handleAccountNumberPaymentMethod.bind(this)}
                />
                {labelAccountNumber}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <input
                  placeholder="Nombre del Titular"
                  value={this.state.accountHolder}
                  onChange={this.handleHolderNamePaymentMethod.bind(this)}
                />
                {labelAccountHolder}
              </Grid.Column>
              <Responsive {...Responsive.onlyMobile}>
                <Grid.Column>
                  <Divider hidden />
                </Grid.Column>
              </Responsive>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <input
                  placeholder="Nro. de Documento"
                  value={this.state.holderId}
                  onChange={this.handleHolderIdPaymentMethod.bind(this)}
                />
                {labelAccountHolderId}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div
          hidden={
            !this.props.isCreateTypePaymentSelected ||
            this.props.paymentTypeSelected.name !== "ZELLE"
          }
        >
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <input
                  placeholder="Email"
                  type="email"
                  value={this.state.userEmail}
                  onChange={this.handleUserEmailPaymentMethod.bind(this)}
                />
                {labelUserEmail}
              </Grid.Column>
              <Responsive {...Responsive.onlyMobile}>
                <Grid.Column>
                  <Divider hidden />
                </Grid.Column>
              </Responsive>
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <input
                  placeholder="Usuario"
                  value={this.state.username}
                  onChange={this.handleUsernamePaymentMethod.bind(this)}
                />
                {labelUsername}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid columns={16}>
          <Grid.Row>
            <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8} />
            <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
              <div
                hidden={
                  !this.props.isCreatedPayment ||
                  !this.props.isCreateTypePaymentSelected
                }
              >
                <Checkbox
                  checked
                  label="Agregar a Frecuentes"
                  value={this.props.isCheckedAddPayment}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {labelRules}
      </div>
    );
  }
}
