import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import translate from "../../../../i18n/translate";
import ReactTable from "react-table";
import RetailService from "../../../../services/moneyclick";
import { isMobile } from "react-device-detect";

class CurrencyOperationsType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCurrencyOperations: [],
      idRetail: this.props.idRetail,
      load: false,

      translator: props.translate
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
        this.setState({
          dataCurrencyOperations: resp.data.operations,
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
          "profile.optionPointsOfSales.menu.retail.operationsTable.type"
        ),
        accessor: "type",
        Cell: row => {
          if (row.value === "SELL_BALANCE") {
            return t(
              "profile.optionPointsOfSales.menu.retail.operationsTable.sellBalance"
            );
          } else if (row.value === "BUY_BALANCE") {
            return t(
              "profile.optionPointsOfSales.menu.retail.operationsTable.buyBalance"
            );
          } else {
            return row.value;
          }
        }
      }
    ];
    return (
      <div>
        {isMobile && <Divider hidden />}
        <ReactTable
          className="transactionTable"
          data={this.state.dataCurrencyOperations}
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

export default translate(CurrencyOperationsType);
