import React, { Component } from "react";
import translate from "../../../../i18n/translate";
import ReactTable from "react-table";
import RetailService from "../../../../services/moneyclick";
import { Form, Icon, Select, Label, Popup, Divider } from "semantic-ui-react";

class MovementsRetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMovements: [],
      translator: props.translate,
      balanceTypeOptions: [],
      balanceTypeSelected: "",
      typeSelectToSearch: "",
      loading: false,
      idRetail: ""
    };

    this.formatDate = this.formatDate.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    if (this.props.idRetail !== null) {
      this.setState({ idRetail: this.props.idRetail });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.idRetail !== this.props.idRetail) {
      this.setState({ dataMovements: [], typeSelectToSearch: "" });
    }
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  async getBalanceByType() {
    try {
      const response = await RetailService.getMovementsRetail(
        this.props.idRetail,
        this.state.typeSelectToSearch
      );
      this.setState({ loading: true });
      let data = [];
      Object.entries(response.data).forEach(([key, value]) => {
        let additionalInfo,
          btcPrice,
          balanceOperationStatus,
          balanceOperationType,
          amount,
          currency,
          type,
          user,
          timestamp = this.formatDate(new Date(key.split("__")[0]));
        Object.entries(value).forEach(([inerKey, inerValue]) => {
          if (inerKey === "additionalInfo") {
            additionalInfo = inerValue;
            if (inerValue.includes("USER")) {
              let text = inerValue.split(" ");
              user = text[text.length - 1];
            }
            if (inerValue.includes("SELL BALANCE")) {
              type = "SELL_BALANCE";
            }
            if (inerValue.includes("BUY BALANCE")) {
              type = "BUY_BALANCE";
            }
            if (inerValue.includes("ADDED TO RETAIL ESCROW ")) {
              type = "ADDED_ESCROW";
            }
          }
          if (inerKey === "btcPrice") {
            btcPrice = inerValue;
          }
          if (inerKey === "balanceOperationStatus") {
            balanceOperationStatus = inerValue;
          }
          if (inerKey === "balanceOperationType") {
            balanceOperationType = inerValue;
          }
          if (inerKey === "addedAmount") {
            if (inerValue.amount !== undefined) {
              currency = inerValue.currency;
              if (currency === "BTC") {
                amount =
                  inerValue.amount.toLocaleString("en-US", {
                    maximumFractionDigits: 8
                  }) +
                  " " +
                  inerValue.currency;
              } else {
                amount =
                  inerValue.amount.toLocaleString("en-US", {
                    maximumFractionDigits: 2
                  }) +
                  " " +
                  inerValue.currency;
              }
            }
          } else {
            if (inerValue.amount !== undefined) {
              currency = inerValue.currency;
              if (currency === "BTC") {
                amount =
                  inerValue.amount.toLocaleString("en-US", {
                    maximumFractionDigits: 8
                  }) +
                  " " +
                  inerValue.currency;
              } else {
                amount =
                  inerValue.amount.toLocaleString("en-US", {
                    maximumFractionDigits: 2
                  }) +
                  " " +
                  inerValue.currency;
              }
            }
          }
        });
        let fullData = {
          additionalInfo: additionalInfo,
          btcPrice: btcPrice,
          balanceOperationStatus: balanceOperationStatus,
          balanceOperationType: balanceOperationType,
          timestamp: timestamp,
          amount: amount,
          currency: currency,
          user: user,
          type: type
        };
        data.push(fullData);
      });
      data.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      this.setState({ dataMovements: data, loading: false });
    } catch (error) {
      this.setState({ loading: false, isFetching: false });
    }
  }
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true"
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
  }
  handleTypeToSearch(e, data) {
    this.setState({
      typeSelectToSearch: data.value
    });
  }

  render() {
    let t = this.state.translator;
    const tableHeaders = [
      {
        Header: t("profile.optionPointsOfSales.movementsTable.type"),
        accessor: "balanceOperationType",
        width: 50,
        Cell: row =>
          row.value === "CREDIT" ? (
            <Icon color="green" name="add" />
          ) : (
            <Icon color="red" name="minus" />
          )
      },
      {
        Header: t("profile.optionPointsOfSales.movementsTable.date"),
        accessor: "timestamp"
      },
      {
        Header: t("profile.optionPointsOfSales.movementsTable.amount"),
        accessor: "amount"
      },
      {
        Header: t("profile.optionPointsOfSales.movementsTable.typeOperation"),
        accessor: "type",
        Cell: row => {
          if (row.value !== undefined) {
            if (row.value === "BUY_BALANCE") {
              return t("profile.optionPointsOfSales.menu.buyBalance");
            } else if (row.value === "SELL_BALANCE") {
              return t("profile.optionPointsOfSales.menu.sellBalance");
            } else if (row.value === "ADDED_ESCROW") {
              return t("profile.optionPointsOfSales.menu.retail.escrow");
            } else {
              return row.value;
            }
          } else {
            return "N/A";
          }
        }
      },
      {
        Header: t("profile.optionPointsOfSales.movementsTable.info"),
        accessor: "user",
        Cell: row => {
          if (row.value !== undefined) {
            return row.value;
          } else {
            return "N/A";
          }
        }
      },
      {
        Header: t("profile.optionPointsOfSales.movementsTable.status"),
        accessor: "balanceOperationStatus",
        Cell: row => {
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
                {t("wallet.tx.table.cells.processing")}
              </Label>
            );
          } else if (row.value === "FAIL") {
            return (
              <Popup
                trigger={
                  <Label color="red">
                    <Icon name="warning circle" />
                    {t("wallet.tx.table.cells.failure")}
                  </Label>
                }
                content={
                  row.original.message !== undefined
                    ? row.original.message
                    : t("wallet.tx.table.cells.failure")
                }
                on="hover"
              />
            );
          }
        }
      }
    ];
    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Field>
              {/* <label>
                {t("profile.optionPointsOfSales.movementsSearch.typeBalance")}
              </label> */}
              <Select
                search
                placeholder={t(
                  "profile.optionPointsOfSales.movementsSearch.selectSearch"
                )}
                options={[
                  {
                    key: "CASH",
                    value: "CASH",
                    text: t("profile.optionPointsOfSales.movementsSearch.cash")
                  },
                  {
                    key: "NO_CASH",
                    value: "NO_CASH",
                    text: t(
                      "profile.optionPointsOfSales.movementsSearch.noCash"
                    )
                  },
                  {
                    key: "ESCROW",
                    value: "ESCROW",
                    text: t(
                      "profile.optionPointsOfSales.movementsSearch.escrow"
                    )
                  }
                ]}
                onChange={this.handleTypeToSearch.bind(this)}
                value={this.state.typeSelectToSearch}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.typeSelectToSearch === ""}
              icon
              labelPosition="left"
              color="blue"
              type="submit"
              onClick={this.getBalanceByType.bind(this)}
            >
              <Icon name="search" />
              {t("profile.optionPointsOfSales.movementsSearch.search")}
            </Form.Button>
          </Form.Group>
        </Form>
        <ReactTable
          className="transactionTable"
          data={this.state.dataMovements}
          columns={tableHeaders}
          defaultPageSize={5}
          previousText={t("profile.optionMovements.table.previous")}
          nextText={t("profile.optionMovements.table.next")}
          loadingText={t("profile.optionMovements.table.loading")}
          noDataText={t("profile.optionMovements.table.noData")}
          pageText={t("profile.optionMovements.table.page")}
          ofText={t("profile.optionMovements.table.of")}
          rowsText={t("profile.optionMovements.table.rows")}
          pageJumpText={t("profile.optionMovements.table.pageJump")}
          rowsSelectorText={t("profile.optionMovements.table.rowsSelector")}
          minRow={5}
          loading={this.state.loading}
          defaultSorted={[
            {
              id: "date",
              desc: true
            }
          ]}
        />
        <Divider hidden />
      </div>
    );
  }
}

export default translate(MovementsRetail);
