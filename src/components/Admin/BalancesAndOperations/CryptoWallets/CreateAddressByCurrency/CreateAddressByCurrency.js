import React, { Component } from "react";
import {
  Container,
  Grid,
  Select,
  Input,
  Form,
  Divider,
  Message,
  Label,
  Segment
} from "semantic-ui-react";
import cryptocurrencies from "../../../../../common/cryptocurrencies";
import addressP from "../../../../../common/addressProviders";
import addressApi from "../../../../../services/address";
import config from "../../../../../services/config";
import otc from "../../../../../services/otc";
import axios from "axios";
import userService from "../../../../../services/user";
class CreateAddressByCurrency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cryptos: [],
      provider: [],
      addressToSave: "",
      privateKeyToSave: "",
      currencyToSave: "",
      addressProviderToSave: "",
      loading: false,
      resultCreateAddress: false,
      errorType: "",
      errorMessage: "",
      OTCAccountsSelectOptions: [],
      OTCAccount: ""
    };
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeAddressProvider = this.onChangeAddressProvider.bind(this);
    this.onChangePrivateKey = this.onChangePrivateKey.bind(this);
    this.onClickCreate = this.onClickCreate.bind(this);
    this.validFields = this.validFields.bind(this);
    this.whitenErrors = this.whitenErrors.bind(this);
    this.whitenFields = this.whitenFields.bind(this);
  }
  componentDidMount() {
    this.getOTCAccounts();
    this.setState({
      cryptos: cryptocurrencies.cryptos,
      provider: addressP.provider
    });
  }
  onChangeCurrency(e, data) {
    this.setState({
      currencyToSave: data.value
    });
  }
  onChangeAddress(e) {
    this.setState({
      addressToSave: e.target.value
    });
  }
  onChangePrivateKey(e) {
    this.setState({
      privateKeyToSave: e.target.value
    });
  }
  onChangeAddressProvider(e, data) {
    //console.log(data.value);
    this.setState({
      addressProviderToSave: data.value
    });
  }
  validFields() {
    if (this.state.currencyToSave === "") {
      this.setState({
        errorType: "CURRENCY_EMPTY",
        errorMessage: "Este campo es requerido"
      });
      this.whitenErrors();
      return false;
    }
    if (this.state.addressToSave === "") {
      this.setState({
        errorType: "ADDRESS_EMPTY",
        errorMessage: "Este campo es requerido"
      });
      this.whitenErrors();
      return false;
    }
    if (this.state.OTCAccount === "") {
      this.setState({
        errorType: "OTCACCOUNT_EMPTY",
        errorMessage: "Este campo es requerido"
      });
      this.whitenErrors();
      return false;
    }
    // if(this.state.privateKeyToSave === ""){
    //   this.setState({
    //     errorType: "PRIVATE_KEY_EMPTY",
    //     errorMessage: "Este campo es requerido"
    //   });
    //   this.whitenErrors();
    //   return false;
    // }
    // if(this.state.addressProviderToSave === ""){
    //   this.setState({
    //     errorType: "PROVIDER_EMPTY",
    //     errorMessage: "Este campo es requerido"
    //   });
    //   this.whitenErrors();
    //   return false;
    // }
    return true;
  }
  whitenErrors() {
    setTimeout(() => {
      this.setState({
        errorType: "",
        errorMessage: "",
        resultCreateAddress: ""
      });
    }, 3000);
  }
  pickOTCAccount = (e, data) => {
    this.setState({ OTCAccount: data.value });
  };
  getOTCAccounts = () => {
    /*var url =
      URL_BASE_DBTC +
      "/masterAccountNew/getOTCMasterAccountNames/" +
      userService.getUserName();*/
    let url = otc.getMasterAccount(userService.getUserName());
      url
      .then(resp => {
        var OTCaccountsArray = resp.data;
        var OTCAccountsToSelect = [];
        for (var i = 0; i < OTCaccountsArray.length; i++) {
          var objectToPush = {};
          objectToPush.key = OTCaccountsArray[i].name;
          objectToPush.text = OTCaccountsArray[i].description;
          var currenciesString = "";
          for (var j = 0; j < OTCaccountsArray[i].currencies.length; j++) {
            if (j > 0) {
              currenciesString += "_" + OTCaccountsArray[i].currencies[j];
            } else {
              currenciesString = OTCaccountsArray[i].currencies[j];
            }
          }
          objectToPush.value = OTCaccountsArray[i].name;
          OTCAccountsToSelect.push(objectToPush);
        }
        this.setState({
          OTCAccountsSelectOptions: OTCAccountsToSelect
          //showOTCAccounts: true
        });
      })
      .catch(error => {});
  };
  whitenFields() {
    this.setState({
      addressToSave: "",
      privateKeyToSave: "",
      currencyToSave: "",
      addressProviderToSave: "",
      OTCAccount: ""
    });
  }
  onClickCreate() {
    if (this.validFields()) {
      this.setState({
        loading: true
      });
      let body = {
        currency: this.state.currencyToSave,
        address: this.state.addressToSave,
        privateKey: this.state.privateKeyToSave,
        otcMasterAccount: this.state.OTCAccount
        //addressProvider: this.state.addressProviderToSave
      };
      addressApi
        .createAddressByCurrency(body)
        .then(res => {
          //console.log(res);
          if (res.status === 200 && res.data === "OK") {
            this.setState(
              {
                resultCreateAddress: true,
                loading: false
              },
              () => {
                this.whitenFields();
                setTimeout(() => {
                  this.setState({
                    resultCreateAddress: false
                  });
                }, 3000);
              }
            );
          } else {
            this.setState(
              {
                loading: false,
                errorType: "FAIL",
                errorMessage: "Ha ocurrido un error. Intente más tarde"
              },
              () => {
                this.whitenFields();
                this.whitenErrors();
              }
            );
          }
        })
        .catch(error => {
          //console.log(error);
          this.setState({
            loading: false,
            errorType: "FAIL",
            errorMessage: "Ha ocurrido un error. Intente más tarde"
          });
          this.whitenErrors();
        });
    }
  }
  render() {
    let resultCreateMessage,
      errorCurrencyMessage,
      errorAddressMessage,
      errorPrivateKeyMessage,
      errorProviderMessage,
      errorOtcAccountMessage,
      errorInvalidAddress,
      errorInvalidPrivateKey;
    if (this.state.resultCreateAddress) {
      resultCreateMessage = (
        <div>
          <Message
            size="large"
            success
            content="La dirección ha sido creada exitosamente"
          />
        </div>
      );
    }
    switch (this.state.errorType) {
      case "ADDRESS_EMPTY":
        errorAddressMessage = (
          <Label basic color="red" pointing>
            {this.state.errorMessage}
          </Label>
        );
        break;
      case "CURRENCY_EMPTY":
        errorCurrencyMessage = (
          <Label basic color="red" pointing>
            {this.state.errorMessage}
          </Label>
        );
        break;
      case "OTCACCOUNT_EMPTY":
        errorOtcAccountMessage = (
          <Label basic color="red" pointing>
            {this.state.errorMessage}
          </Label>
        );
        break;
      // case "PRIVATE_KEY_EMPTY":
      //   errorPrivateKeyMessage=(
      //     <Label basic color="red" pointing>
      //       {this.state.errorMessage}
      //     </Label>
      //   );
      //   break;
      // case "PROVIDER_EMPTY":
      //   errorProviderMessage=(
      //     <Label basic color="red" pointing>
      //       {this.state.errorMessage}
      //     </Label>
      //   );
      //   break;
      case "INVALID_ADDRESS":
        errorInvalidAddress = (
          <Label basic color="red" pointing>
            {this.state.errorMessage}
          </Label>
        );
        break;
      case "INVALID_PRIVATE_KEY":
        errorInvalidPrivateKey = (
          <Label basic color="red" pointing>
            {this.state.errorMessage}
          </Label>
        );
        break;
      case "FAIL":
        resultCreateMessage = (
          <div>
            <Message size="large" error content={this.state.errorMessage} />
          </div>
        );
        break;
      default:
      //console.log("default");
    }
    return (
      <Container>
        <Form
          error={this.state.errorType === "FAIL"}
          success={this.state.resultCreateAddress}
          loading={this.state.loading}
          unstackable
          onSubmit={this.onClickCreate}
        >
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column largeScreen={6} computer={6} tablet={16} mobile={16}>
                <Form.Field>
                  <label>
                    Criptomoneda <span style={{ color: "red" }}> *</span>
                  </label>
                  <Select
                    options={this.state.cryptos}
                    placeholder="Seleccione"
                    onChange={this.onChangeCurrency}
                    value={this.state.currencyToSave}
                  />
                  {errorCurrencyMessage}
                </Form.Field>
              </Grid.Column>
              <Divider hidden={true} />
              <Grid.Column
                largeScreen={10}
                computer={10}
                tablet={16}
                mobile={16}
              >
                <Form.Field>
                  <label>
                    Address <span style={{ color: "red" }}> *</span>
                  </label>
                  <Input
                    placeholder="Dirección de cartera"
                    onChange={this.onChangeAddress}
                    type="text"
                    value={this.state.addressToSave}
                  />
                  {errorAddressMessage}
                  {errorInvalidAddress}
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column
                largeScreen={10}
                computer={10}
                tablet={16}
                mobile={16}
              >
                <Form.Field>
                  <label>Private key</label>
                  <Input
                    placeholder="Clave privada"
                    onChange={this.onChangePrivateKey}
                    type="text"
                    value={this.state.privateKeyToSave}
                  />
                  {errorPrivateKeyMessage}
                  {errorInvalidPrivateKey}
                </Form.Field>
              </Grid.Column>
              <Divider hidden={true} />
              <Grid.Column largeScreen={6} computer={6} tablet={16} mobile={16}>
                <Form.Field>
                  <label>Cuenta OTC</label>
                  <Select
                    search
                    placeholder="Seleccione una cuenta"
                    options={this.state.OTCAccountsSelectOptions}
                    onChange={this.pickOTCAccount}
                  />
                  {errorOtcAccountMessage}
                </Form.Field>
                {/* <Form.Field>
                  <label>Proveedor de la dirección <span style={{color:"red"}}> *</span></label>
                  <Select
                    options={this.state.provider}
                    onChange={this.onChangeAddressProvider}
                    value={this.state.addressProviderToSave}
                    placeholder="Seleccione"
                  />
                  {errorProviderMessage}
                </Form.Field> */}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Segment basic>{resultCreateMessage}</Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column textAlign="right">
                <Form.Button
                  size="large"
                  color="blue"
                  type="submit"
                  loading={this.state.loading}
                  disabled={this.state.loading}
                >
                  Crear
                </Form.Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Container>
    );
  }
}

export default CreateAddressByCurrency;
