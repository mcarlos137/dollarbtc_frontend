import React, { Component } from "react";
import "../../Admin.css";
import { Grid, Form, Input, Icon } from "semantic-ui-react";
import ReactTable from "react-table";
import NumberFormat from "react-number-format";

class InfoOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  render() {
    const accountMasterBalancesTableHeaders = [
      {
        Header: "Moneda",
        accessor: "currency",
        width: 250,
      },
      {
        Header: "Balance de Operaciones",
        accessor: "operationBalance",
        width: 250,
        Cell: (row) => {
          var decimals = 0;
          if (row.original.currency === "BTC") {
            decimals = 8;
          } else {
            decimals = 2;
          }
          return (
            <NumberFormat
              value={this.floorDecimals(row.value, decimals)}
              displayType={"text"}
              thousandSeparator={true}
            />
          );
        },
      },
      {
        Header: "Comision",
        accessor: "COMMISSION",
        width: 250,
      },
      {
        Header: "VAT",
        accessor: "VAT",
        width: 250,
      },
    ];
    return (
      <span>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <b>Saldos de Cuentas OTC:</b>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Form.Field>
                <label>Consultar desde:</label>
                <Input
                  type="date"
                  name="date1"
                  onChange={this.props.pickDateFrom}
                ></Input>
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <label>Consultar hasta:</label>
                <Input
                  type="date"
                  name="date2"
                  onChange={this.props.pickDateTo}
                ></Input>
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Form.Button
                  icon
                  labelPosition="left"
                  color="blue"
                  type="submit"
                  onClick={this.props.getBalanceAcountCountOtc}
                >
                  <Icon name="search" />
                  Buscar
                </Form.Button>
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ReactTable
          style={{ marginTop: 20 }}
          className="transactionTable"
          data={this.props.OTCAccountBalances}
          columns={accountMasterBalancesTableHeaders}
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
    );
  }
}
export default InfoOperations;
