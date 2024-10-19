import React, { Component } from 'react';
import {
  Button,
  Container,
  Dimmer,
  Flag,
  Header,
  Icon,
  Loader,
  Segment,
  Select,
  Message,
  Form,
  Grid,
  Label,
  Checkbox,
  Dropdown,
} from 'semantic-ui-react';
import config from '../../../services/config';
import userService from '../../../services/user';
import axios from 'axios';
import _ from 'underscore';
import otc from '../../../services/otc';
import NumberFormat from 'react-number-format';
import ISOCURRENCIES from '../../../common/ISO4217';
import theter from '../../../img/tether-seeklogo.svg'
const URL_BASE_DBTC = config.apiDollarBtcUrl;

class DynamicOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyToAdd: '',
      operationToAdd: '',
      limitPriceToAdd: '',
      minPerOperationToAdd: '',
      maxPerOperationToAdd: '',
      useChangePriceByOperationToAdd: false,
      totalAmountToAdd: '',
      sourceToAdd: '',
      marginPercentToAdd: 0,
      spreadPercentToAdd: 0,
      messageError: '',
      messageSuccess: false,
      currenciesToAdd: [],
      keyForm: Math.random(),
      addLoad: false,
      btcusdSellAveragePrice: 0,
      btcusdBuyAveragePrice: 0,
      referencePrices: [],
      referenceHeaderFlag: null,
      showReferencePrices: false,
      showAdd: false,
      paymentMethodToAdd: '',
      paymentMethodTypeToAdd: [],
      paymentMethods: [],
      paymentMethodTypes: [],
      loadingPaymentMethods: false,
      loadingPaymentMethodsTypes: false,
      formPaymentMethodKey: Math.random(),
      formPaymentMethodTypeKey: Math.random(),
    };
  }
  operationOptions = [
    {
      key: 'BID',
      value: 'BID',
      text: 'Venta',
    },
    {
      key: 'ASK',
      value: 'ASK',
      text: 'Compra',
    },
  ];
  sourceOptions = [
    {
      key: 'localbitcoins',
      value: 'LocalBitcoins',
      text: 'LocalBitcoins',
    },
    {
      key: 'coinbase',
      value: 'Coinbase',
      text: 'Coinbase',
    },
  ];
  pickSource = (e, data) => {
    this.setState({
      sourceToAdd: data.value,
    });
  };
  pickCurrency = (e, data) => {
    this.setState(
      {
        currencyToAdd: data.value,
        paymentMethodToAdd: '',
        paymentMethodTypeToAdd: [],
        formPaymentMethodKey: Math.random(),
        formPaymentMethodTypeKey: Math.random(),
      },
      () => {
        this.getReferencePrice(data.value);
        this.getPaymentMethodsByCurrency(data.value);
      }
    );
  };
  pickPaymentMethod = (e, data) => {
    this.setState({ paymentMethodToAdd: data.value }, () => {
      this.getPaymentTypeByPaymentMethod(data.value);
    });
  };
  pickPaymentMethodType = (e, data) => {
    this.setState({ paymentMethodTypeToAdd: data.value });
  };
  pickOperation = (e, data) => {
    this.setState({
      operationToAdd: data.value,
      paymentMethodToAdd: '',
      paymentMethodTypeToAdd: [],
      formPaymentMethodKey: Math.random(),
      formPaymentMethodTypeKey: Math.random(),
    });
    if (this.state.currencyToAdd !== '') {
      this.getPaymentMethodsByCurrency(this.state.currencyToAdd);
    }
  };
  handleUseChangePriceByOperation = (e, data) => {
    this.setState({ useChangePriceByOperationToAdd: data.checked });
  };
  validateData(value) {
    if (value !== undefined) {
      return '-' + value;
    } else {
      return ' ';
    }
  }
  getPaymentTypeByPaymentMethod = (paymentMethodId) => {
    this.setState({ loadingPaymentMethodsTypes: true });
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then((resp) => {
        var paymentMethodsByCurrencies = resp.data;
        var paymentMethodsArray = [];
        Object.entries(paymentMethodsByCurrencies).forEach(
          ([currencyMethod, paymentMethod]) => {
            if (currencyMethod === this.state.currencyToAdd) {
              for (var i = 0; i < paymentMethod.length; i++) {
                var paymenMethodToAdd = {};
                if (
                  paymentMethod[i].active &&
                  this.state.paymentMethodToAdd === paymentMethod[i].id
                ) {
                  var paymentTypeSpanish = '';
                  if (paymentMethod[i].type === 'TRANSFER_INTERNATIONAL_BANK') {
                    paymentTypeSpanish =
                      'Transferencia internacional (Swift o Aba)';
                  } else if (paymentMethod[i].type === 'CASH_DEPOSIT') {
                    paymentTypeSpanish = 'Depósito en efectivo';
                  } else if (
                    paymentMethod[i].type === 'TRANSFER_WITH_SPECIFIC_BANK'
                  ) {
                    paymentTypeSpanish =
                      'Transferencia desde un banco específico';
                  } else if (
                    paymentMethod[i].type === 'TRANSFER_NATIONAL_BANK'
                  ) {
                    paymentTypeSpanish = 'Transferencia desde un tercer banco';
                  } else if (
                    paymentMethod[i].type === 'TRANSFER_TO_CRYPTO_WALLET'
                  ) {
                    paymentTypeSpanish =
                      'Transferencia desde una crypto wallet';
                  } else if (paymentMethod[i].type === 'WIRE_TRANSFER') {
                    paymentTypeSpanish = 'Wire (Transferencia cablegráfica)';
                  } else if (paymentMethod[i].type === 'CHECK_DEPOSIT') {
                    paymentTypeSpanish = 'Depósito en cheque';
                  } else if (paymentMethod[i].type === 'CREDIT_CARD') {
                    paymentTypeSpanish = 'Tarjeta de crédito';
                  } else if (
                    paymentMethod[i].type === 'PERSONAL_CHECK_DEPOSIT'
                  ) {
                    paymentTypeSpanish = 'Cheque personal';
                  } else if (
                    paymentMethod[i].type === 'CASHIER_CHECK_DEPOSIT'
                  ) {
                    paymentTypeSpanish = 'Cheque de gerencia';
                  } else if (paymentMethod[i].type === 'MONEY_ORDER') {
                    paymentTypeSpanish = 'Orden de dinero';
                  } else {
                    paymentTypeSpanish = paymentMethod[i].type;
                  }
                  if (
                    this.state.operationToAdd === 'ASK' &&
                    paymentMethod[i].acceptOut
                  ) {
                    paymenMethodToAdd.id = paymentMethod[i].id;
                    paymenMethodToAdd.key = i;
                    paymenMethodToAdd.value = paymentMethod[i].type;
                    paymenMethodToAdd.text = paymentTypeSpanish;
                  } else if (
                    this.state.operationToAdd === 'BID' &&
                    paymentMethod[i].acceptIn
                  ) {
                    paymenMethodToAdd.id = paymentMethod[i].id;
                    paymenMethodToAdd.key = i;
                    paymenMethodToAdd.value = paymentMethod[i].type;
                    paymenMethodToAdd.text = paymentTypeSpanish;
                  }
                }
                paymentMethodsArray.push(paymenMethodToAdd);
              }
            }
          }
        );

        // if (this.state.paymentMethodToAdd === "MONEYCLICK") {
        //   paymentMethodsArray.push(
        //     {
        //       key: "MAIN",
        //       value: "MAIN",
        //       text: "Main (Principal)"
        //     },
        //     {
        //       key: "RETAIL",
        //       value: "RETAIL",
        //       text: "Retail (Minorista)"
        //     }
        //   );
        // }
        var paymentMethodsArrayUniqueKey = _.uniq(
          paymentMethodsArray,
          'key'
        ).filter((value) => Object.keys(value).length !== 0);

        otc.getSpecialPayments(userService.getUserName()).then((resp) => {
          var SpecialPayments = resp.data;
          Object.entries(SpecialPayments).forEach(
            ([currencyMethod, paymentMethods]) => {
              if (currencyMethod === this.state.currencyToAdd) {
                Object.entries(paymentMethods).forEach((paymentMethod) => {
                  if (paymentMethodId === paymentMethod[0]) {
                    let typepaymentMethods = paymentMethod[1];
                    for (var i = 0; i < typepaymentMethods.length; i++) {
                      var paymenMethodToAdd = {};

                      paymenMethodToAdd.id = typepaymentMethods[i];
                      paymenMethodToAdd.key = typepaymentMethods[i];
                      paymenMethodToAdd.value = typepaymentMethods[i];
                      paymenMethodToAdd.text = typepaymentMethods[i];
                      paymentMethodsArrayUniqueKey.push(paymenMethodToAdd);
                    }
                  }
                });
              }
            }
          );
        });

        this.setState({
          paymentMethodTypes: paymentMethodsArrayUniqueKey,
          loadingPaymentMethodsTypes: false,
        });
      })
      .catch((error) => {});
  };
  getPaymentMethodsByCurrency = (currency) => {
    this.setState({ loadingPaymentMethods: true });
    otc
      .getPaymentsAdmin(userService.getUserName())
      .then((resp) => {
        var paymentMethodsByCurrencies = resp.data;
        var paymentMethodsArray = [];
        Object.entries(paymentMethodsByCurrencies).forEach(
          ([currencyMethod, paymentMethod]) => {
            if (currencyMethod === currency) {
              for (var i = 0; i < paymentMethod.length; i++) {
                var paymenMethodToAdd = {};
                if (paymentMethod[i].active) {
                  if (
                    this.state.operationToAdd === 'ASK' &&
                    paymentMethod[i].acceptOut
                  ) {
                    paymenMethodToAdd.key = paymentMethod[i].id;
                    paymenMethodToAdd.value = paymentMethod[i].id;
                    paymenMethodToAdd.text =
                      paymentMethod[i].bank !== undefined
                        ? paymentMethod[i].id.slice(-4) +
                          ' - ' +
                          paymentMethod[i].bank +
                          ' - ' +
                          paymentMethod[i].accountHolderName +
                          ' - ' +
                          paymentMethod[i].accountNumber +
                          this.validateData(paymentMethod[i].accountHolderId)
                        : paymentMethod[i].id.slice(-4) +
                          ' - ' +
                          paymentMethod[i].walletAddress;
                  } else if (
                    this.state.operationToAdd === 'BID' &&
                    paymentMethod[i].acceptIn
                  ) {
                    paymenMethodToAdd.key = paymentMethod[i].id;
                    paymenMethodToAdd.value = paymentMethod[i].id;
                    paymenMethodToAdd.text =
                      paymentMethod[i].bank !== undefined
                        ? paymentMethod[i].id.slice(-4) +
                          ' - ' +
                          paymentMethod[i].bank +
                          ' - ' +
                          paymentMethod[i].accountHolderName +
                          ' - ' +
                          paymentMethod[i].accountNumber +
                          this.validateData(paymentMethod[i].accountHolderId)
                        : paymentMethod[i].id.slice(-4) +
                          ' - ' +
                          paymentMethod[i].walletAddress;
                  }
                }
                paymentMethodsArray.push(paymenMethodToAdd);
              }
            }
          }
        );
        otc.getSpecialPayments(userService.getUserName()).then((resp) => {
          var paymentMethodsByCurrencies = resp.data;
        });

        var paymentMethodsArrayUniqueKey = _.uniq(
          paymentMethodsArray,
          'key'
        ).filter((value) => Object.keys(value).length !== 0);

        otc.getSpecialPayments(userService.getUserName()).then((resp) => {
          var SpecialPayments = resp.data;
          Object.entries(SpecialPayments).forEach(
            ([currencyMethod, paymentMethods]) => {
              if (currencyMethod === currency) {
                Object.entries(paymentMethods).forEach((paymentMethod) => {
                  paymentMethodsArrayUniqueKey.push({
                    key: paymentMethod[0],
                    value: paymentMethod[0],
                    text: paymentMethod[0],
                  });
                });
              }
            }
          );
        });

        this.setState({
          paymentMethods: paymentMethodsArrayUniqueKey,
          loadingPaymentMethods: false,
        });
      })
      .catch((error) => {});
  };
  getConfig = () => {
    this.setState({ showAdd: false });
    //var url = URL_BASE_DBTC + config.urlDollar.getCurrencies;
    let currency = otc.getAdminCurrencies(userService.getUserName());
    currency
      .then((resp) => {
        let currencies = resp.data;
        let selectCurrencies = [];
        let currencyCurrent = {};
        for (let i = 0; i < currencies.length; i++) {
          let currencyToAddSelect = {};
          let countryCoin = currencies[i].shortName.split('_');
          currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
          if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAddSelect.flag = currencyCurrent.flag;
          } else if(currencies[i].shortName === "ETH"){
					  currencyToAddSelect.icon = "ethereum";
          } else if(currencies[i].shortName === "USDT"){
            currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          };
          currencyToAddSelect.key = currencies[i].shortName;
          currencyToAddSelect.value = currencies[i].shortName;
          currencyToAddSelect.text = currencies[i].fullName;
          selectCurrencies.push(currencyToAddSelect);
        }
        this.setState({ currenciesToAdd: selectCurrencies, showAdd: true });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  componentWillMount() {
    this.getConfig();
  }
  getReferencePrice = (symbolBase) => {
    let countryCoin = symbolBase.split('_');
    let countryPrefix = countryCoin.length > 1 ? countryCoin[0] : '';
    let symbol = countryCoin.length > 1 ? countryCoin[1] : countryCoin[0];
    this.setState({ showReferencePrices: false });
    var url = URL_BASE_DBTC + '/analysis/getFullPriceInfo';
    axios
      .get(url)
      .then((res) => {
        var prices = [];
        this.setState({ referencePrices: [], referenceHeaderFlag: '' });
        Object.entries(res.data).forEach(([currency, sourceReferences]) => {
          if (currency === symbol) {
            Object.entries(sourceReferences).forEach(
              ([sourceReferencesTitle, sourceReferencesData]) => {
                var referenceToAdd;
                if (sourceReferencesTitle === 'localBitcoins') {
                  var bid = sourceReferencesData.bid.average.price;
                  var ask = sourceReferencesData.ask.average.price;
                  var usdPrice = sourceReferencesData.usdPrice;
                  referenceToAdd = {
                    source: 'LocalBitcoins',
                    bid: bid,
                    ask: ask,
                    toUsd: usdPrice,
                  };
                } else if (sourceReferencesTitle === 'forex') {
                  var usdRate = sourceReferencesData.usdRate;
                  referenceToAdd = {
                    source: 'Forex',
                    toUsd: usdRate,
                  };
                }
                prices.push(referenceToAdd);
              }
            );
            let flag = '';
            let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
              if (countryCoin.length > 1)
                return c.flag === countryPrefix.toLowerCase();
              else return c.key === symbol;
            })[0];
            if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
              flag = currencyCurrent.flag;
            } else if(symbol === "ETH") {
              flag = "ethereum";
            } else {
              flag = "usdt";
            }
            this.setState(
              { referencePrices: prices, referenceHeaderFlag: flag },
              () => {
                this.setState({ showReferencePrices: true });
              }
            );
          }
        });
        if (this.state.referencePrices.length === 0) {
          this.setState({ showReferencePrices: false });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  addConfig = () => {
    this.setState({ addLoad: true });
    if (
      this.state.limitPriceToAdd !== '' &&
      this.state.marginPercentToAdd !== '' &&
      this.state.spreadPercentToAdd !== '' &&
      this.state.sourceToAdd !== '' &&
      this.state.minPerOperationToAdd !== '' &&
      this.state.maxPerOperationToAdd !== '' &&
      this.state.totalAmountToAdd !== '' &&
      this.state.paymentMethodToAdd !== '' &&
      this.state.paymentMethodTypeToAdd !== []
    ) {
      for (var i = 0; i < this.state.paymentMethodTypeToAdd.length; i++) {
        var body = {
          currency: this.state.currencyToAdd,
          limitPrice: this.state.limitPriceToAdd,
          source: this.state.sourceToAdd,
          marginPercent: this.state.marginPercentToAdd,
          spreadPercent: this.state.spreadPercentToAdd,
          minPerOperationAmount: this.state.minPerOperationToAdd,
          maxPerOperationAmount: this.state.maxPerOperationToAdd,
          totalAmount: this.state.totalAmountToAdd,
          offerType: this.state.operationToAdd,
          paymentId: this.state.paymentMethodToAdd,
          paymentType: this.state.paymentMethodTypeToAdd[i],
          useChangePriceByOperationBalance: this.state
            .useChangePriceByOperationToAdd,
        };
        otc
          .addDynammicOffer(body)
          .then((res) => {
            //console.log(res);
            if (i === this.state.paymentMethodTypeToAdd.length) {
              this.setState(
                {
                  messageSuccess: true,
                  currencyToAdd: '',
                  operationToAdd: '',
                  limitPriceToAdd: '',
                  sourceToAdd: '',
                  marginPercentToAdd: '',
                  spreadPercentToAdd: '',
                  minPerOperationToAdd: '',
                  maxPerOperationToAdd: '',
                  totalAmountToAdd: '',
                  useChangePriceByOperationToAdd: false,
                  keyForm: Math.random(),
                },
                function () {
                  this.setState({ addLoad: false });
                  setTimeout(() => {
                    this.setState({
                      messageSuccess: false,
                    });
                  }, 7000);
                }
              );
            }
          })
          .catch((error) => {
            this.setState({ addLoad: false });
            this.setState({
              messageError:
                'No se ha podido realizar la operación en este momento. Intente de nuevo.',
            });
            setTimeout(() => {
              this.setState({
                messageError: '',
              });
            }, 5000);
            //console.log(error.response);
          });
      }
    } else {
      this.setState({ addLoad: false });
      this.setState({
        messageError:
          'Debe llenar la información de todos los campos para poder añadir la oferta',
      });
      setTimeout(() => {
        this.setState({
          messageError: '',
        });
      }, 5000);
    }
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  render() {
    let messageAddError, messageAddSuccess;
    if (this.state.messageError !== '') {
      messageAddError = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{this.state.messageError}</p>
        </Message>
      );
    }
    if (this.state.messageSuccess) {
      messageAddSuccess = (
        <Message positive>
          <Message.Header>Oferta añadida</Message.Header>
          <p>La oferta ha sido añadida exitosamente.</p>
        </Message>
      );
    }
    return (
      <Form key={this.state.keyForm}>
        {this.state.addLoad && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {!this.state.showAdd && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {messageAddError}
        {messageAddSuccess}
        {this.state.referencePrices.length > 0 && (
          <Segment loading={!this.state.showReferencePrices}>
            <Header>
              {this.state.referenceHeaderFlag !== 'ethereum' &&  this.state.referenceHeaderFlag !== 'usdt' ? (
                <Flag name={this.state.referenceHeaderFlag} />
              ) : this.state.referenceHeaderFlag === "ethereum" ? (
                        <Icon name={this.state.referenceHeaderFlag} />
                      ) : (<img style={{paddingTop: 5}} width={20} height={20} src={theter} />)}{' '}
              Precios de referencia
            </Header>
            {this.state.referencePrices.map((referencePrice) => {
              return (
                <Grid.Row style={{ marginTop: 10 }} key={referencePrice.source}>
                  {referencePrice.source}{' '}
                  {referencePrice.bid !== undefined && (
                    <Label>
                      Compra
                      <Label.Detail>
                        <NumberFormat
                          value={this.floorDecimals(referencePrice.ask, 2)}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </Label.Detail>
                    </Label>
                  )}
                  {referencePrice.bid !== undefined && (
                    <Label>
                      Venta
                      <Label.Detail>
                        <NumberFormat
                          value={this.floorDecimals(referencePrice.bid, 2)}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </Label.Detail>
                    </Label>
                  )}
                  {referencePrice.toUsd !== undefined && (
                    <Label>
                      {'1 USD >'}
                      <Label.Detail>
                        <NumberFormat
                          value={
                            this.state.referenceHeaderFlag !== 'ethereum'
                              ? this.floorDecimals(referencePrice.toUsd, 2)
                              : this.floorDecimals(referencePrice.toUsd, 8)
                          }
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </Label.Detail>
                    </Label>
                  )}
                </Grid.Row>
              );
            })}
          </Segment>
        )}
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Tipo de operación</label>
            <Select
              placeholder='Seleccione el tipo'
              options={this.operationOptions}
              onChange={this.pickOperation}
            />
          </Form.Field>
          <Form.Field>
            <label>Moneda</label>
            {this.state.currenciesToAdd !== [] ? (
              <Dropdown
                fluid
                placeholder='Seleccione la moneda'
                options={this.state.currenciesToAdd}
                onChange={this.pickCurrency}
              />
            ) : null}
          </Form.Field>
          <Form.Field key={this.state.formPaymentMethodKey}>
            <label>Medio de Pago</label>
            {this.state.currenciesToAdd !== [] ? (
              <Select
                loading={this.state.loadingPaymentMethods}
                disabled={this.state.paymentMethods.length === 0}
                placeholder='Seleccione el medio de pago'
                options={this.state.paymentMethods}
                onChange={this.pickPaymentMethod}
              />
            ) : null}
          </Form.Field>
          <Form.Field key={this.state.formPaymentMethodTypeKey}>
            <label>Tipo de medio de pago</label>
            {this.state.currenciesToAdd !== [] ? (
              <Select
                loading={this.state.loadingPaymentMethodsTypes}
                disabled={
                  // this.state.paymentMethodTypes.length === 0 ||
                  this.state.paymentMethodToAdd === ''
                }
                multiple
                placeholder='Seleccione tipo de pago'
                options={this.state.paymentMethodTypes}
                onChange={this.pickPaymentMethodType}
              />
            ) : null}
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Fuente</label>
            <Select
              placeholder='Fuente'
              options={this.sourceOptions}
              onChange={this.pickSource}
            />
          </Form.Field>
          <Form.Field>
            <label>Porcentaje de Margen</label>
            <NumberFormat
              placeholder='Porcentaje de margen'
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={true}
              onValueChange={(values) => {
                const { value } = values;
                this.setState({ marginPercentToAdd: parseFloat(value) });
              }}
              suffix={' ' + '%'}
            />
          </Form.Field>
          <Form.Field>
            <label>Porcentaje de Propagación</label>
            <NumberFormat
              placeholder='Porcentaje de propagación'
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={true}
              onValueChange={(values) => {
                const { value } = values;
                this.setState({ spreadPercentToAdd: parseFloat(value) });
              }}
              suffix={' ' + '%'}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Precio límite</label>
            {this.state.currencyToAdd !== '' ? (
              <NumberFormat
                placeholder='Precio límite'
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ limitPriceToAdd: parseFloat(value) });
                }}
                suffix={
                  '   ' + this.state.currencyToAdd.toUpperCase() + ' / BTC'
                }
              />
            ) : (
              <NumberFormat
                placeholder='Precio límite'
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ limitPriceToAdd: parseFloat(value) });
                }}
              />
            )}
          </Form.Field>
          <Form.Field>
            <label>Mínimo por operación</label>
            {this.state.currencyToAdd !== '' ? (
              <NumberFormat
                placeholder='Mínimo por operación'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ minPerOperationToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
                suffix={'   ' + this.state.currencyToAdd.toUpperCase()}
              />
            ) : (
              <NumberFormat
                placeholder='Mínimo por operación'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ minPerOperationToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
              />
            )}
          </Form.Field>
          <Form.Field>
            <label>Máximo por operación</label>
            {this.state.currencyToAdd !== '' ? (
              <NumberFormat
                placeholder='Máximo por operación'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ maxPerOperationToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
                suffix={'   ' + this.state.currencyToAdd.toUpperCase()}
              />
            ) : (
              <NumberFormat
                placeholder='Máximo por operación'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ maxPerOperationToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
              />
            )}
          </Form.Field>
          <Form.Field>
            <label>Total máximo acumulado</label>
            {this.state.currencyToAdd !== '' ? (
              <NumberFormat
                placeholder='Total máximo acumulado'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ totalAmountToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
                suffix={'   ' + this.state.currencyToAdd.toUpperCase()}
              />
            ) : (
              <NumberFormat
                placeholder='Total máximo acumulado'
                decimalScale={2}
                fixedDecimalScale={true}
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({ totalAmountToAdd: parseFloat(value) });
                }}
                thousandSeparator={true}
              />
            )}
          </Form.Field>
        </Form.Group>
        <Container textAlign='left'>
          <Checkbox
            label='Utilizar precios calculados por balance de operaciones'
            onChange={this.handleUseChangePriceByOperation}
          />
        </Container>

        <Container textAlign='right'>
          <Button
            onClick={this.addConfig}
            icon
            labelPosition='left'
            color='blue'
            type='submit'
          >
            <Icon name='add' />
            Añadir
          </Button>
        </Container>
      </Form>
    );
  }
}

export default DynamicOffer;
