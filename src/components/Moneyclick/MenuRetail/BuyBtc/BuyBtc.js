import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import translate from "../../../../i18n/translate";
import ReactTable from "react-table";
import RetailService from "../../../../services/moneyclick";

class BuyBtc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataBuy: [],
      translator: props.translate,
      idRetail: this.props.idRetail,
      load: false
    };
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
      this.getInfoRetail(this.props.idRetail);
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.idRetail !== this.props.idRetail) {
      this.getInfoRetail(this.props.idRetail);
    }
  }
  getInfoRetail(idRetail) {
    this.setState({ load: true });
    RetailService.getInfoRetail(idRetail)
      .then(resp => {
        let op = {};
        let array = [];
        let data = resp.data.operations;
        for (let val of data) {
          if (val.type === "BUY_BTC") {
            op.currency = val.currency;
            op.minPerOperationAmount = val.offer.minPerOperationAmount;
            op.maxPerOperationAmount = val.offer.maxPerOperationAmount;
            op.price = val.offer.price;
            array.push(op);
          }
        }
        this.setState({
          dataBuy: array,
          load: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let t = this.state.translator;
    const tableHeaders = [
      {
        Header: t(
          "profile.optionPointsOfSales.menu.retail.operationsTable.currency"
        ),
        accessor: "currency"
      },
      {
        Header: t(
          "profile.optionPointsOfSales.menu.retail.operationsTable.bottom"
        ),
        accessor: "minPerOperationAmount",
        Cell: row => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 2
          });
        }
      },
      {
        Header: t(
          "profile.optionPointsOfSales.menu.retail.operationsTable.top"
        ),
        accessor: "maxPerOperationAmount",
        Cell: row => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 2
          });
        }
      },
      {
        Header: t(
          "profile.optionPointsOfSales.menu.retail.operationsTable.price"
        ),
        accessor: "price",
        Cell: row => {
          return row.value.toLocaleString("en-US", {
            maximumFractionDigits: 2
          });
        }
      }
    ];
    return (
      <div>
        <ReactTable
          className="transactionTable"
          data={this.state.dataBuy}
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
          loading={this.state.load}
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

export default translate(BuyBtc);
