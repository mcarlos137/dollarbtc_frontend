import React, { Component } from "react";
import "./Brokers.css";
import {
  Container,
  Divider,
  Header,
  Grid,
  Icon,
  Button
} from "semantic-ui-react";
import ReactTable from "react-table";
import brokersAPI from "../../services/brokers";
import "react-table/react-table.css";
export default class BrokersBuy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brokersBuy: [],
      tableReady: false,
      testData: [
        {
          currency: "",
          name: "",
          lastSeenInSeconds: "",
          provider: "",
          trust: "",
          trades: "",
          uniquePartners: "",
          offerType: "",
          active: "",
          price: "",
          minPerOperationAmount: "",
          maxPerOperationAmount: "",
          redirectionURL: ""
        }
      ]
    };
  }

  componentDidMount() {
    this.getBuy();
  }

  getBuy() {
    brokersAPI.getBrokers("ASK").then(brokers => {
      let dataTable = [];
      if (brokersAPI.length === "" || brokersAPI.length === null) {
        alert("EL JSON NO TRAE INFORMACION");
      }
      for (let i = 0; i < brokers.data.length; i++) {
        let item = {
          user: brokers.data[i].name,
          price: brokers.data[i].price.toLocaleString("en-US", {
            maximumFractionDigits: 2
          }),
          currency: brokers.data[i].currency,
          limits:
            brokers.data[i].minPerOperationAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2
            }) +
            " - " +
            brokers.data[i].maxPerOperationAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2
            }),
          statusUser:
            brokers.data[i].trust +
            "/" +
            brokers.data[i].trades +
            "/" +
            brokers.data[i].uniquePartners,
          lastSeen: brokers.data[i].lastSeenInSeconds,
          available: brokers.data[i].active,
          actions: ""
        };
        dataTable.push(item);
      }
      this.setState({
        brokersBuy: dataTable
      });
    });
  }
  render() {
    const transactionTableHeaders = [
      {
        Header: "Usuario",
        accessor: "user",
        minWidth: 200
      },
      {
        Header: "Moneda",
        accessor: "currency",
        minWidth: 70
      },
      {
        Header: "Precio",
        accessor: "price",
        minWidth: 80
      },
      {
        Header: "Límites",
        accessor: "limits",
        minWidth: 160
      },
      {
        Header: "Trust / Trades / Unique Partners",
        accessor: "statusUser",
        minWidth: 220,
        Cell: row => {
          let status = row.value.split("/");
          return (
            <div>
              <Icon name="thumbs up" color="green" size={"large"} />
              <label class="letterLarge">{status[0] + " "}</label>
              <Icon name="chart line" size={"large"} />
              <label class="letterLarge">{" " + status[1] + " "}</label>
              <Icon name="users" size={"large"} />
              <label class="letterLarge">{" " + status[2]}</label>
            </div>
          );
        }
      },
      {
        Header: "Visto hace",
        accessor: "lastSeen",
        Cell: row => {
          if (row.value < 60) {
            return (
              <div>
                <label class="letterTiny">{row.value} Seg.</label>
              </div>
            );
          } else if (row.value >= 60 && row.value < 3600) {
            return (
              <div>
                <label class="letterTiny">
                  {Math.floor(row.value / 60)} Min(s) con {row.value % 60}{" "}
                  Seg(s)
                </label>
              </div>
            );
          } else {
            return (
              <div>
                <label class="letterTiny">
                  {Math.floor(row.value / 3600)} Hr(s) con{" "}
                </label>
                <label class="letterTiny" hidden={row.value % 3600 < 60}>
                  {" "}
                  {Math.floor((row.value % 3600) / 60)} Min(s)
                </label>
                <label class="letterTiny" hidden={row.value % 3600 > 60}>
                  {" "}
                  {row.value % 3600} Seg(s)
                </label>
              </div>
            );
          }
        },
        minWidth: 130
      },
      {
        Header: "Disponible",
        accessor: "available",
        Cell: row => {
          if (row.value === true) {
            return <Icon name="checkmark" color="green" size={"big"} />;
          } else {
            return <Icon name="delete" color="red" size={"big"} />;
          }
        }
      },
      {
        Header: "",
        accessor: "actions",
        filterable: false,
        Cell: row => {
          return (
            <Button className="ui green button" size={"tiny"}>
              Comprar
            </Button>
          );
        },
        minWidth: 100
      }
    ];
    var data = this.state.brokersBuy;
    return (
      <div>
        <Container textAlign="justified" className="Brokers">
          <Header size="large">
            <Header.Content>Comprar</Header.Content>
          </Header>
          <Divider section />
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <ReactTable
                  defaultSorted={[
                    {
                      id: "price",
                      desc: true
                    }
                  ]}
                  className="transactionTable"
                  data={data}
                  columns={transactionTableHeaders}
                  defaultPageSize={5}
                  previousText="Anterior"
                  nextText="Siguiente"
                  loadingText="Cargando..."
                  noDataText="No hay operaciones"
                  pageText="Página"
                  ofText="de"
                  rowsText="filas"
                  pageJumpText="ir a la página"
                  rowsSelectorText="filas por página"
                  minRow={15}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}
