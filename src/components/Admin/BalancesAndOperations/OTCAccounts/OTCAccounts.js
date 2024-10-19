import React, { Component } from "react";
import "../../Admin.css";
import { Grid, Icon, Popup, Label } from "semantic-ui-react";
import ReactTable from "react-table";
import NumberFormat from "react-number-format";
class OTCAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };

  render() {
    const accountMasterMovementsTableHeaders = [
      {
        Header: "Tipo",
        accessor: "type",
        Cell: (row) =>
          row.value === "add" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          ),
        width: 55,
      },
      {
        Header: "Fecha",
        accessor: "date",
      },
      {
        Header: "Moneda",
        accessor: "currency",
        width: 89,
      },
      {
        Header: "Monto",
        accessor: "amount",
        width: 152,
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right",
              fontWeight: "bold",
            },
          };
        },
        Cell: (row) => {
          var colorAmount = "";
          if (row.original.type === "add") {
            colorAmount = "green";
          } else {
            colorAmount = "red";
          }
          return (
            <NumberFormat
              style={{ color: colorAmount }}
              value={this.floorDecimals(row.value, 8)}
              displayType={"text"}
              thousandSeparator={true}
            />
          );
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
          } else if (row.value === "TRANSFER_TO_MASTER") {
            return "Transferencia a cuenta maestra";
          } else if (row.value === "SEND_IN") {
            return "Envío a Wallet interna";
          } else if (row.value === "SEND_OUT") {
            return "Envío a wallet externa";
          } else return row.value;
        },
      },
      {
        Header: "Estatus",
        accessor: "balanceOperationStatus",
        Cell: (row) => {
          if (row.value === "OK") {
            return (
              <Label color="green">
                <Icon name="check circle" />
                OK
              </Label>
            );
          } else if (row.value === "PROCESSING") {
            return (
              <Label color="blue">
                <Icon name="sync" loading />
                PROCESANDO
              </Label>
            );
          } else if (row.value === "FAIL") {
            return (
              <Popup
                trigger={
                  <Label color="red">
                    <Icon name="warning circle" />
                    FALLIDA
                  </Label>
                }
                content={row.original.message}
                on="hover"
              />
            );
          } else {
            return row.value;
          }
        },
        width: 150,
      },
    ];
    return (
      <span>
        {this.props.OTCAccountBalance !== "" && (
          <span>
            <Grid>
              <Grid.Row columns="equal">
                <Grid.Column>
                  <b>Balance:</b>{" "}
                  <NumberFormat
                    value={this.floorDecimals(this.props.OTCAccountBalance, 8)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />{" "}
                  BTC
                </Grid.Column>
                <Grid.Column>
                  <b>Moneda(s):</b> {this.props.OTCAccountCurrencies}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <ReactTable
              style={{ marginTop: 20 }}
              className="transactionTable"
              data={this.props.OTCAccountMovements}
              columns={accountMasterMovementsTableHeaders}
              defaultPageSize={5}
              previousText="Anterior"
              nextText="Siguiente"
              loadingText="Cargando..."
              noDataText="No existen movimientos"
              pageText="Página"
              ofText="de"
              rowsText="filas"
              pageJumpText="ir a la página"
              rowsSelectorText="filas por página"
              minRow={5}
            />
          </span>
        )}
      </span>
    );
  }
}

export default OTCAccounts;
