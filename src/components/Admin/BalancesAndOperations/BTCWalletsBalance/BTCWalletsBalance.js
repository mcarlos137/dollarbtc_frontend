import React, { Component } from "react";
import "../../Admin.css";
import {
  Menu,
  Segment,
  Container,
  Grid,
  Form,
  Divider,
  Icon,
  Header,
  Loader,
  Dimmer,
  Popup,
  Select,
  Message,
  Label,
  Dropdown,
} from "semantic-ui-react";
import ReactTable from "react-table";
import config from "../../../../services/config";
import axios from "axios";
import moment from "moment";
import NumberFormat from "react-number-format";
import userService from "../../../../services/user";
import _ from "underscore";
import otc from "../../../../services/otc";
class BTCWalletsBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsersEmail: [],
      userToSearch: "",
      showUserBalance: false,
      showUserSearch: false,
      walletBTCAmount: null,
      showUserWithoutAddressMessage: false,
      addressToSearch: null,
      userAddresses: [],
      showUserBadAddress: false,
      walletBTCMovements: [],
      loadSearch: false,
      activeItem: "onDollarBTC",
      showOndollarBTCBalance: false,
      walletBalanceBTC: 0,
      toVerifiedWalletBalanceBTC: 0,
      hftModelsBalance: 0,
      balancesTotal: 0,
      transactionTable: [],
      renderNow: false,
      allIncomingBTC: 0,
      allOutcomingBTC: 0,
      tableReady: false,
      details: [],
    };
  }
  getOTCDetail = async (txArray) => {
    let otcId = txArray.filter((obj) => Object.keys(obj).includes("allOTCid"));
    var listDetails = [];
    if (otcId.length === 0) {
      this.setState({ tableReady: true });
    }
    for (var i = 0; i < otcId.length; i++) {
      var toPush = await otc
        .getOperation(otcId[i].allOTCid)
        .then((res) => {
          if (!_.isEmpty(res.data)) {
            return {
              id: res.data.id,
              amount: res.data.amount,
              currency: res.data.currency,
              price: res.data.price,
            };
          } else {
            return {};
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      if (!_.isEmpty(toPush)) {
        listDetails.push(toPush);
      }
      if (i + 1 === otcId.length) {
        this.setState({ details: listDetails }, () => {
          this.setState({ tableReady: true });
        });
      }
    }
  };
  getWalletBalanceDBC = () => {
    this.setState({ showOndollarBTCBalance: false });
    var availableAmounts = [];
    var toVerifiedAmounts = [];
    var modelBalances = [];
    userService
      .getBalanceUser(this.state.userToSearch)
      .then((resp) => {
        availableAmounts = resp.data.result.availableAmounts;
        toVerifiedAmounts = resp.data.result.deferredAmounts;
        modelBalances = resp.data.result.modelBalances;
        for (var i = 0; i < availableAmounts.length; i++) {
          if (availableAmounts[i].currency === "BTC") {
            this.setState({
              walletBalanceBTC: this.floorDecimals(
                availableAmounts[i].amount,
                8
              ),
            });
          }
        }
        var totalModal = 0;
        for (var x = 0; x < modelBalances.length; x++) {
          for (var k = 0; k < modelBalances[x].estimatedValues.length; k++) {
            if (modelBalances[x].estimatedValues[k].currency === "BTC") {
              totalModal =
                totalModal + modelBalances[x].estimatedValues[k].amount;
            }
          }
        }
        this.setState({
          hftModelsBalance: this.floorDecimals(totalModal, 8),
        });
        for (var j = 0; j < toVerifiedAmounts.length; j++) {
          if (toVerifiedAmounts[j].currency === "BTC") {
            this.setState({
              toVerifiedWalletBalanceBTC: this.floorDecimals(
                toVerifiedAmounts[j].amount,
                8
              ),
            });
          }
        }
        this.setState({
          balancesTotal: this.floorDecimals(
            this.state.walletBalanceBTC +
              this.state.hftModelsBalance +
              this.state.toVerifiedWalletBalanceBTC,
            8
          ),
        });
        this.setState({ showOndollarBTCBalance: true });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  componentDidMount() {
    this.getUsers();
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  getUsers = () => {
    userService
      .getUsers()
      .then((resp) => {
        var listUser = resp.data;
        var listEmail = [];
        for (var i = 0; i < listUser.length; i++) {
            var emailOption = {};
            emailOption.key = i;
            emailOption.value = listUser[i];
            emailOption.text = listUser[i];
            listEmail.push(emailOption);
        }
        this.setState(
          {
            listUsersEmail: listEmail,
          },
          () => {
            this.setState({
              showUserSearch: true,
            });
          }
        );
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  pickUser = (e, data) => {
    this.setState({
      userToSearch: data.value,
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
  getUserBlockChain = () => {
    this.setState({
      showUserBalance: false,
      loadSearch: true,
      showUserBadAddress: false,
      showUserWithoutAddressMessage: false,
      showUserBalanceDollarBTC: false,
      walletBalanceBTC: 0,
      toVerifiedWalletBalanceBTC: 0,
      hftModelsBalance: 0,
      balancesTotal: 0,
      walletBTCAmount: null,
      activeItem: "onDollarBTC",
    });
    // var url =
    //   URL_BASE_DBTC +
    //   config.urlDollar.userConfig +
    //   this.state.userToSearch +
    //   "/OK";
    // axios
    //   .get(url)
    userService
      .getConfigUserGeneral(this.state.userToSearch)
      .then((res) => {
        if (res.data.result.address !== undefined) {
          let addresses = [];
          if (res.data.result.wallets !== undefined) {
            let old = res.data.result.wallets.old;
            let current = Object.values(res.data.result.wallets.current).map(
              (w) => {
                return w.address;
              }
            )[0];
            addresses = Object.keys(old).map((key) => {
              return old[key].address;
            });
            addresses.push(current);
            this.setState({
              addressToSearch: current,
            });
          } else {
            addresses.push(res.data.result.address);
            this.setState({
              addressToSearch: res.data.result.address,
            });
          }
          this.formatUserAddresses(addresses);
          this.getWalletBalanceDBC();
          var dateInit = new Date();
          var timeback = 1000 * 60 * 60 * 24 * 180;
          var dateEnd = new Date(dateInit.getTime() - timeback);
          userService
            .userMovements(
              this.state.userToSearch,
              dateEnd.toISOString(),
              dateInit.toISOString()
            )
            .then((res) => {
              this.makeTableData(res.data.result);
            })
            .catch((error) => {
              //console.log(error);
            });
          let arrayPromises = [];
          addresses.map((addr) => {
            let urlBC = config.apiBlockCypherUrl + "/btc/main/addrs/" + addr;
            arrayPromises.push(axios.get(urlBC, { withCredentials: false }));
          });
          axios
            .all(arrayPromises)
            .then(
              axios.spread((...responses) => {
                responses.forEach((resp) => {
                  var userBTCTxRefs = resp.data;
                  var BTCWalletAmountSatoshis;
                  var BTCWalletTxRefs = [];

                  BTCWalletAmountSatoshis = userBTCTxRefs.balance;
                  var definitiveTxToTable = [];
                  if (userBTCTxRefs.n_tx > 0) {
                    BTCWalletTxRefs = userBTCTxRefs.txrefs;
                    for (var i = 0; i < BTCWalletTxRefs.length; i++) {
                      var txToAdd = {};
                      if (BTCWalletTxRefs[i].tx_input_n === -1) {
                        txToAdd.type = "receive";
                      } else if (BTCWalletTxRefs[i].tx_output_n === -1) {
                        txToAdd.type = "send";
                      }
                      txToAdd.amount = BTCWalletTxRefs[i].value * 0.00000001;
                      if (BTCWalletTxRefs[i].block_height === -1) {
                        txToAdd.confirmed = false;
                      } else {
                        txToAdd.confirmed = true;
                      }
                      if (BTCWalletTxRefs[i].confirmed !== undefined) {
                        txToAdd.dateConfirmed = BTCWalletTxRefs[i].confirmed;
                      } else {
                        txToAdd.dateConfirmed = "Sin confirmar";
                      }
                      definitiveTxToTable.push(txToAdd);
                    }
                  }
                  var BTCWalletAmount = BTCWalletAmountSatoshis * 0.00000001;
                  this.setState({
                    walletBTCMovements: definitiveTxToTable,
                    walletBTCAmount: BTCWalletAmount,
                    showUserBalance: true,
                    loadSearch: false,
                    activeItem: "onDollarBTC",
                  });
                });
              })
            )
            .catch((error) => {
              if (error.response.status === 404) {
                this.setState({
                  showUserBadAddress: true,
                  showUserBalance: true,
                  walletBTCAmount: null,
                  loadSearch: false,
                });
                setTimeout(() => {
                  this.setState({
                    showUserBadAddress: false,
                  });
                }, 5000);
              }
            });
        } else {
          this.setState({
            showUserWithoutAddressMessage: true,
            showUserBalance: true,
            walletBTCAmount: null,
            loadSearch: false,
          });
          setTimeout(() => {
            this.setState({
              showUserWithoutAddressMessage: false,
            });
          }, 5000);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  formatUserAddresses(addresses) {
    let values = [];
    for (let i = 0; i < addresses.length; i++) {
      let obj = {
        key: "addrs" + (i + 1),
        value: addresses[i],
        text: addresses[i],
      };
      values.push(obj);
    }
    this.setState({
      userAddresses: values,
    });
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  makeTableData = (movements) => {
    var tx = {};
    var txArray = [];
    Object.entries(movements).forEach(([key, value]) => {
      tx = {};
      tx.date = new Date(key.split("__")[0]);
      Object.entries(value).forEach(([k, v]) => {
        if (k === "addedAmount") {
          tx.type = "add";
          if (v.currency === "BTC") {
            tx.amountBTC = v.amount;
          }
        } else if (k === "substractedAmount") {
          tx.type = "remove";
          if (v.currency === "BTC") {
            tx.amountBTC = v.amount;
          }
        } else if (k === "balanceOperationType") {
          if (v === "WITHDRAW") {
            tx.description = "Envío de BTC";
          } else if (v === "INITIAL_DEPOSIT") {
            tx.description = "Movimiento inicial";
          } else if (v === "DEPOSIT") {
            tx.description = "BTC recibidos";
          } else if (v === "TRANSFER_TO_DOLLARBTC") {
            tx.description = "Envío de BTC";
          } else if (v === "TRANSFER_FROM_DOLLARBTC") {
            tx.description = "BTC recibidos";
          } else if (v === "RECEIVE") {
            tx.description = "BTC recibidos";
          } else if (v === "SEND") {
            tx.description = "Envío de BTC";
          } else if (v === "CREDIT") {
            tx.description = "Crédito";
          } else if (v === "DEBIT") {
            tx.description = "Débito";
          } else if (v.includes("MODEL")) {
            v = v.replace("MODEL", "PLAN");
            if (v === "PLAN_ACTIVATION") {
              tx.description = "Activación del plan ";
            } else if (v === "PLAN_INACTIVATION") {
              tx.description = "Inactivación del plan ";
            }
          }
        } else if (k === "targetAddress") {
          if (tx.description === "Envío de BTC") {
            tx.description = tx.description + " a " + v.toUpperCase();
          }
        } else if (k === "address") {
          if (tx.description === "BTC recibidos") {
            tx.description = tx.description + " de " + v.toUpperCase();
          }
        } else if (k === "additionalInfo") {
          if (
            tx.description === "Activación del plan " ||
            tx.description === "Inactivación del plan "
          ) {
            tx.description =
              tx.description + v.toUpperCase().split("__")[1].toLowerCase();
          } else if (v.startsWith("OTC")) {
            tx.OTCid = v.split("id ")[1].slice(-4);
            tx.allOTCid = v.split("id ")[1];
          } else if (tx.description.startsWith("Envío")) {
            if (v !== "") {
              tx.description = tx.description + " (" + v + ")";
            }
          }
        } else if (k === "balanceOperationStatus") {
          tx.status = v;
        } else if (k === "message") {
          tx.message = v;
        }
        tx.feeBTC = null;
      });
      txArray.push(tx);
    });
    var allOutcoming = 0;
    var allIncoming = 0;
    for (var i = 0; i < txArray.length; i++) {
      if (txArray[i].status === "OK") {
        if (txArray[i].type === "add") {
          allIncoming = allIncoming + txArray[i].amountBTC;
        } else if (txArray[i].type === "remove") {
          allOutcoming = allOutcoming + txArray[i].amountBTC;
        }
      }
    }

    this.getOTCDetail(txArray);
    this.setState({
      transactionTable: txArray,
      allIncomingBTC: this.floorDecimals(allIncoming, 8),
      allOutcomingBTC: this.floorDecimals(allOutcoming, 8),
      renderNow: true,
    });
  };
  render() {
    const data = this.state.transactionTable;
    const transactionTableHeaders = [
      {
        Header: "Tipo",
        accessor: "type",
        Cell: (row) =>
          row.value === "add" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          ),
        width: 60,
      },
      {
        Header: "Fecha",
        accessor: "date",
        width: 280,
        Cell: (row) => {
          return this.formatDate(row.value);
        },
      },
      {
        Header: "ID OTC",
        accessor: "OTCid",
        width: 100,
        Cell: (row) => {
          if (this.state.details.length > 0) {
            for (var i = 0; i < this.state.details.length; i++) {
              if (this.state.details[i].id !== undefined) {
                if (row.value === this.state.details[i].id.slice(-4)) {
                  var text =
                    "Moneda: " +
                    this.state.details[i].currency.toString() +
                    "\nPrecio: " +
                    this.state.details[i].price.toLocaleString("EN-us", {
                      maximumFractionDigits: 4,
                    }) +
                    "\nMonto: " +
                    this.state.details[i].amount.toLocaleString("EN-us", {
                      maximumFractionDigits: 4,
                    });

                  return (
                    <span className="fake-link" title={text}>
                      {row.value}
                    </span>
                  );
                }
                if (i + 1 === this.state.details.length) {
                  return row.value;
                }
              } else {
                return row.value;
              }
            }
          } else {
            return row.value;
          }
        },
      },
      {
        Header: "Monto BTC",
        accessor: "amountBTC",
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right",
            },
          };
        },
        Cell: (row) =>
          row.original.type === "add" ? (
            <p style={{ color: "green" }}>
              {" "}
              {this.floorDecimals(row.value, 8)}{" "}
            </p>
          ) : (
            <p style={{ color: "red" }}> {this.floorDecimals(row.value, 8)} </p>
          ),
        width: 200,
      },
      {
        Header: "Descripción",
        accessor: "description",
      },
      // {
      //   Header: "Comisión por depósito",
      //   accessor: "feeBTC",
      //   width: 160
      // },
      {
        Header: "Estatus",
        accessor: "status",
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
                content={
                  row.original.message !== undefined
                    ? row.original.message
                    : "Fallida"
                }
                on="hover"
              />
            );
          }
        },
        width: 150,
      },
    ];

    const walletBTCMovementsTableHeaders = [
      {
        Header: "Tipo",
        accessor: "type",
        Cell: (row) =>
          row.value === "receive" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          ),
      },
      {
        Header: "Monto BTC",
        accessor: "amount",
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "right",
            },
          };
        },
        Cell: (row) => {
          return (
            <NumberFormat
              value={this.floorDecimals(row.value, 8)}
              displayType={"text"}
              thousandSeparator={true}
            />
          );
        },
      },
      {
        Header: "Fecha de confirmación",
        accessor: "dateConfirmed",
        Cell: (row) => {
          if (row.value !== "Sin confirmar") {
            return moment(row.value).format("YYYY/MM/DD HH:mm:ss");
          } else {
            return row.value;
          }
        },
      },
      {
        Header: "Confirmada",
        accessor: "confirmed",
        Cell: (row) =>
          row.value === true ? (
            <Icon color="green" name="check circle" />
          ) : (
            <Icon color="blue" name="sync" loading />
          ),
      },
    ];
    var messageWithoutAddressUser, messageBadAddress;
    if (this.state.showUserWithoutAddressMessage) {
      messageWithoutAddressUser = (
        <Message negative>
          <Message.Header>Usuario sin address</Message.Header>
          <p>Este usuario no posee una address asociada.</p>
        </Message>
      );
    }
    if (this.state.showUserBadAddress) {
      messageBadAddress = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>
            Este usuario posee una address incorrecta o no pertenece al
            blockchain BTC.
          </p>
        </Message>
      );
    }
    return (
      <Container>
        {!this.state.showUserSearch && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Usuario a consultar:</label>
              <Select
                search
                placeholder="Seleccione un usuario"
                options={this.state.listUsersEmail}
                onChange={this.pickUser}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.userToSearch === ""}
              icon
              labelPosition="left"
              color="blue"
              style={{ marginTop: 23 }}
              type="submit"
              onClick={this.getUserBlockChain}
              loading={this.state.loadSearch}
            >
              <Icon name="search" />
              Buscar
            </Form.Button>
            <Form.Field>
              <label>
                Total de usuarios registrados:{" "}
                <strong>{this.state.listUsersEmail.length}</strong>
              </label>
            </Form.Field>
          </Form.Group>
        </Form>
        {messageWithoutAddressUser}
        {messageBadAddress}
        {this.state.walletBTCAmount !== null && (
          <Menu size="small" pointing secondary>
            <Menu.Item
              content="En dollarBTC"
              name="onDollarBTC"
              active={this.state.activeItem === "onDollarBTC"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              content="En blockchain"
              name="onBlockchain"
              active={this.state.activeItem === "onBlockchain"}
              onClick={this.handleItemClick}
            />
          </Menu>
        )}
        {this.state.activeItem === "onBlockchain" &&
          this.state.walletBTCAmount !== null && (
            <Container>
              {this.state.walletBTCAmount !== null && (
                <div>
                  {!this.state.showUserBalance && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Grid>
                    <Grid.Row columns={3} divided>
                      <Grid.Column width={8}>
                        <label>
                          <b>Addresses: </b>
                        </label>
                        <Dropdown
                          fluid
                          selection
                          defaultValue={this.state.userAddresses[0].text}
                          options={this.state.userAddresses}
                        />
                        {/*this.state.addressToSearch*/}
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Grid.Column>
                          <label>
                            <b>Cantidad de address: </b>
                          </label>{" "}
                          <NumberFormat
                            value={this.state.userAddresses.length}
                            displayType={"text"}
                          />
                        </Grid.Column>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Grid.Column>
                          <label>
                            <b>Balance: </b>
                          </label>{" "}
                          <NumberFormat
                            value={this.floorDecimals(
                              this.state.walletBTCAmount,
                              8
                            )}
                            displayType={"text"}
                            thousandSeparator={true}
                          />{" "}
                          BTC
                        </Grid.Column>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Divider section />
                  <Header as="h4">Movimientos de la cartera BTC</Header>
                  <ReactTable
                    className="transactionTable"
                    defaultSorted={[
                      {
                        id: "dateConfirmed",
                        desc: true,
                      },
                    ]}
                    data={this.state.walletBTCMovements}
                    columns={walletBTCMovementsTableHeaders}
                    defaultPageSize={5}
                    previousText="Anterior"
                    nextText="Siguiente"
                    loadingText="Cargando..."
                    noDataText="Este usuario no posee movimientos en su cartera"
                    pageText="Página"
                    ofText="de"
                    rowsText="filas"
                    pageJumpText="ir a la página"
                    rowsSelectorText="filas por página"
                    minRow={5}
                  />
                </div>
              )}
            </Container>
          )}
        {this.state.activeItem === "onDollarBTC" &&
          this.state.walletBTCAmount !== null && (
            <Container>
              {this.state.walletBTCAmount !== null && (
                <div>
                  {!this.state.showOndollarBTCBalance && (
                    <Dimmer active inverted>
                      <Loader inverted>Cargando...</Loader>
                    </Dimmer>
                  )}
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column width={8}>
                        <Grid.Column>
                          <Segment secondary>
                            <Grid columns="equal">
                              <Grid.Row>
                                <Grid.Column width={8}>
                                  <p>Saldo disponible: </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  {this.state.walletBalanceBTC} BTC
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo en HFT: </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  {this.state.hftModelsBalance} BTC
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo por verificar: </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  {this.state.toVerifiedWalletBalanceBTC} BTC
                                </Grid.Column>
                              </Grid.Row>
                              <Divider section />
                              <Grid.Row style={{ marginTop: -20 }}>
                                <Grid.Column width={8}>
                                  <p>Saldo total: </p>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                  {this.state.balancesTotal} BTC
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Segment>
                        </Grid.Column>
                        <Grid.Column />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Divider section />
                  <Header as="h4">Movimientos de la cartera BTC</Header>
                  <ReactTable
                    defaultSorted={[
                      {
                        id: "date",
                        desc: true,
                      },
                    ]}
                    className="transactionTable"
                    data={data}
                    columns={transactionTableHeaders}
                    defaultPageSize={5}
                    previousText="Anterior"
                    nextText="Siguiente"
                    loadingText="Cargando..."
                    noDataText="No hay transacciones"
                    pageText="Página"
                    ofText="de"
                    rowsText="filas"
                    pageJumpText="ir a la página"
                    rowsSelectorText="filas por página"
                    minRow={5}
                  />
                </div>
              )}
            </Container>
          )}
      </Container>
    );
  }
}

export default BTCWalletsBalance;
