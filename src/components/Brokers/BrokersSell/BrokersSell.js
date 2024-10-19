import React, { Component } from "react";
import "../Brokers.css";
import {
  Container,
  Divider,
  Header,
  Grid,
  Icon,
  Button,
  Label
} from "semantic-ui-react";
import ReactTable from "react-table";
//import brokersAPI from "../../../services/brokers"
import "react-table/react-table.css";
export default class BrokersSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brokersSell: [],
      tableReady: false,
      testData: []
    };
  }

  componentDidMount() {
    this.getBuy();
  }

  getBuy() {
    /*brokersAPI.getBrokers().then(brokers =>{
           let broker=null;
           for(let i=0;i<brokers.data.length;i++){*/
    let broker = null,
      dataTable = [];
    for (let i = 0; i < this.state.testData.length; i++) {
      broker = this.state.testData[i];
      let item = {
        user: broker.name,
        price: broker.price.toLocaleString("en-US", {
          maximumFractionDigits: 2
        }),
        limits:
          broker.currency +
          " " +
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
      brokersSell: dataTable
    });
    // })
  }
  render() {
    const transactionTableHeaders = [
      {
        Header: "Usuario",
        accessor: "user",
        minWidth: 220
      },
      {
        Header: "Precio",
        accessor: "price"
      },
      {
        Header: "Límites",
        accessor: "limits",
        minWidth: 220
      },
      {
        Header: "Trust / Trades / Unique Partners",
        accessor: "statusUser",
        minWidth: 220,
        Cell: row => {
          let status = row.value.split("/");
          return (
            <div>
              <Icon name="checkmark" />
              <Label>{status[0]}</Label>
              <Icon name="user" />
              <Label>{status[1]}</Label>
              <Icon name="zoom-in" />
              <Label>{status[2]}</Label>
            </div>
          );
        }
      },
      {
        Header: "last seen",
        accessor: "lastSeen"
      },
      {
        Header: "Disponible",
        accessor: "available",
        Cell: row => {
          if (row.value === true) {
            return <Icon name="checkmark" />;
          } else {
            return <Icon name="delete" />;
          }
        }
      },
      {
        Header: "Buy",
        accessor: "actions",
        filterable: false,
        Cell: row => {
          return <Button className="ui green button">Buy now</Button>;
        }
      }
    ];
    var data = this.state.brokersSell;
    return (
      <div>
        <Container textAlign="justified" className="BrokersSell">
          <Header size="large">
            <Header.Content>Vender</Header.Content>
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
