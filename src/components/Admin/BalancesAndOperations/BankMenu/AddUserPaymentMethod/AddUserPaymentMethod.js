import React, { Component } from "react";
import ISOCURRENCIES from "../../../../../common/ISO4217";
import "../../../Admin.css";
import { Dropdown, Form, Select } from "semantic-ui-react";
import config from "../../../../../services/config";
import axios from "axios";
import userService from "../../../../../services/user";
import otc from "../../../../../services/otc";
import theter from '../../../../../img/tether-seeklogo.svg'

class AddUserPaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsersEmail: [],
      userToAdd: "",
      currenciesToAddOptions: [],
      currencyToAdd: "",
      accountHolderToAdd: "",
      accountHolderIdToAdd: "",
      accountNumberToAdd: ""
    };
  }
  componentWillMount() {
    this.getUsers();
    this.loadCurrenciesToSearch();
  }
  loadCurrenciesToSearch = () => {
    //var url = URL_BASE_DBTC + "/otc/getCurrencies";
    let currency = otc.getAdminCurrencies(userService.getUserName());
    currency
      .then(resp => {
        var currencies = resp.data;
        var selectCurrencies = [];
        let currencyCurrent = {};
        for (var i = 0; i < currencies.length; i++) {
          var currencyToAddSelect = {};
          let countryCoin = currencies[i].shortName.split("_");
          currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
          if (currencyCurrent !== undefined  && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAddSelect.flag = currencyCurrent.flag;
          } else if(currencies[i].shortName === "ETH") {
					  currencyToAddSelect.icon = "ethereum";
          } else if(currencies[i].shortName === "USDT") {
            currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          };
          currencyToAddSelect.key = currencies[i].shortName;
          currencyToAddSelect.value = currencies[i].shortName;
          currencyToAddSelect.text = currencies[i].fullName;
          selectCurrencies.push(currencyToAddSelect);
        }
        this.setState({ currenciesToAddOptions: selectCurrencies });
      })
      .catch(error => {
        //console.log(error);
      });
  };
  getUsers = () => {
    userService
      .getUsers()
      .then(resp => {
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
            listUsersEmail: listEmail
          },
          () => {
            this.setState({
              showUserSearch: true
            });
          }
        );
      })
      .catch(error => {
        //console.log(error);
      });
  };
  pickUser = (e, data) => {
    this.setState({
      userToAdd: data.value
    });
  };
  pickCurrency = (e, data) => {
    this.setState({
      currencyToAdd: data.value
    });
  };
  handleAccountHolder = e => {
    this.setState({ accountHolderToAdd: e.target.value });
  };
  handleAccountHolderId = e => {
    this.setState({ accountHolderIdToAdd: e.target.value });
  };
  handleAccountNumber = e => {
    this.setState({ accountNumberToAdd: e.target.value });
  };
  render() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Usuario</label>
            <Dropdown
              search
              placeholder="Seleccione un usuario"
              options={this.state.listUsersEmail}
              onChange={this.pickUser}
            />
          </Form.Field>
          <Form.Field>
            <label>Moneda</label>
            <Dropdown
              fluid
              search
              placeholder="Seleccione una moneda"
              options={this.state.currenciesToAddOptions}
              onChange={this.pickCurrency}
            />
          </Form.Field>
          <Form.Field>
            <label>Banco</label>
            <Select
              search
              placeholder="Seleccione una moneda"
              options={this.state.currenciesToAddOptions}
              onChange={this.pickCurrency}
            />
          </Form.Field>
          <Form.Field>
            <label>Tipo de pago</label>
            <Select
              search
              placeholder="Seleccione una moneda"
              options={this.state.currenciesToAddOptions}
              onChange={this.pickCurrency}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Número de cuenta</label>
            <input
              placeholder="xxxxx-xxxxxx-xxxxxx-xxxxx"
              onChange={this.handleAccountNumber}
            />
          </Form.Field>
          <Form.Field>
            <label>Nombre del titular</label>
            <input
              placeholder="Pedro Manrique"
              onChange={this.handleAccountHolder}
            />
          </Form.Field>
          <Form.Field>
            <label>Número de documento del titular</label>
            <input
              placeholder="xxxx456xxxx"
              onChange={this.handleAccountHolderId}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default AddUserPaymentMethod;
