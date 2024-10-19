import React, { Component } from "react";
import "../Brokers.css";
import {
  Container,
  Divider,
  Header,
  Grid,
  Icon,
  Button
} from "semantic-ui-react";
import ReactTable from "react-table";
import brokersAPI from "../../../services/brokers";
import "react-table/react-table.css";
export default class BrokersBuy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brokersBuy: [],
      tableReady: false,
      testData: [
        {
          currency: "VES",
          name: "CARLOS DANIEL",
          lastSeenInSeconds: 90,
          provider: "localBitcoins",
          trust: 1568,
          trades: 2154,
          uniquePartners: 123,
          offerType: "ASK",
          active: true,
          price: 9100000,
          minPerOperationAmount: 1000000,
          maxPerOperationAmount: 5000000,
          redirectionURL: ""
        },
        {
          currency: "USD",
          name: "CARLOS DANIEL",
          lastSeenInSeconds: 3670,
          provider: "localBitcoins",
          trust: 1568,
          trades: 2154,
          uniquePartners: 123,
          offerType: "ASK",
          active: true,
          price: 3850,
          minPerOperationAmount: 200,
          maxPerOperationAmount: 500,
          redirectionURL: ""
        },
        {
          currency: "COP",
          name: "CARLOS DANIEL",
          lastSeenInSeconds: 45,
          provider: "localBitcoins",
          trust: 1568,
          trades: 2154,
          uniquePartners: 123,
          offerType: "ASK",
          active: true,
          price: 10500000,
          minPerOperationAmount: 1000000,
          maxPerOperationAmount: 4000000,
          redirectionURL: ""
        },
        {
          currency: "ARS",
          name: "CARLOS DANIEL",
          lastSeenInSeconds: 45,
          provider: "localBitcoins",
          trust: 1568,
          trades: 2154,
          uniquePartners: 123,
          offerType: "ASK",
          active: false,
          price: 39.02,
          minPerOperationAmount: 2000,
          maxPerOperationAmount: 5000,
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
      let broker = null,
        dataTable = [];
      //console.log("brokers", brokers);
      for (let i = 0; i < brokers.data.length; i++) {
        broker = this.state.testData[i];
        let item = {
          user: broker.name,
          price: broker.price.toLocaleString("en-US", {
            maximumFractionDigits: 2
          }),
          currency: broker.currency,
          limits:
            broker.minPerOperationAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2
            }) +
            " - " +
            broker.maxPerOperationAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2
            }),
          statusUser:
            broker.trust + "/" + broker.trades + "/" + broker.uniquePartners,
          lastSeen: broker.lastSeenInSeconds,
          available: broker.active,
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
                  noDataText="No hay operacipnes"
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
