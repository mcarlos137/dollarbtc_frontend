import React, { Component } from 'react';
import '../OTC.css';
import {
  Segment,
  Form,
  Button,
  Icon,
  Message,
  Flag,
  Dimmer,
  Loader,
  Popup,
  Modal,
  Grid,
  Label,
  Header,
  Container,
  Checkbox,
  Divider,
  Image
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import otc from '../../../services/otc';
import config from '../../../services/config';
import axios from 'axios';
import userService from '../../../services/user';
import NumberFormat from 'react-number-format';
import _ from 'underscore';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ISOCURRENCIES from '../../../common/ISO4217';
import theter from '../../../img/tether-seeklogo.svg';
const URL_BASE_DBTC = config.apiDollarBtcUrl;
class ActualAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offersTable: [],
      showOffersTable: false,
      modalRemove: false,
      currencyToRemove: '',
      operationTypeToRemove: '',
      paymentIdToRemove: '',
      paymentTypeToRemove: '',
      messageError: '',
      messageSuccess: false,
      details: [],
      paymentTypeToShow: '',
      editModal: false,
      showReferencePrices: false,
      referencePrices: [],
      referenceHeaderFlag: '',
      currencyToUpdate: '',
      minPerOperationToUpdate: 0,
      maxPerOperationToUpdate: 0,
      accumulatedAmountToUpdate: 0,
      priceToUpdate: 0,
      paymentIdToUpdate: '',
      offerTypeToUpdate: '',
      paymentTypeToUpdate: '',
      sourceToUpdate: '',
      limitPriceToUpdate: 0,
      marginPercentToUpdate: null,
      spreadPercentToUpdate: null,
      paymentTypeEditToShow: '',
      priceToShow: 0,
      minPerOperationToShow: 0,
      maxPerOperationToShow: 0,
      accumulatedAmountToShow: 0,
      limitPriceToShow: 0,
      marginPercentToShow: 0,
      spreadPercentToShow: 0,
      messageErrorEdit: '',
      messageSuccessEdit: '',
      modalTypeToEdit: '',
      useChangePriceByOperation: false,
      copied: false,
    };
    this.closeEditOfferModal = this.closeEditOfferModal.bind(this);
    this.openEditOfferModal = this.openEditOfferModal.bind(this);
    this.updateOffer = this.updateOffer.bind(this);
    this.updateDynamicOffer = this.updateDynamicOffer.bind(this);
    this.clearFieldsEditModal = this.clearFieldsEditModal.bind(this);
    this.selectModalType = this.selectModalType.bind(this);
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
            } else if(symbol === 'ETH'){
              flag = 'ethereum';
            }else if(symbol === 'USDT'){
              flag = 'usdt';
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
  onClickCopyBtn = () => {
    this.setState({
      copied: true,
    });
    setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 7000);
  };
  removeAdd = () => {
    var opType = '';
    if (this.state.operationTypeToRemove === 'COMPRA') {
      opType = 'ASK';
    } else if (this.state.operationTypeToRemove === 'VENTA') {
      opType = 'BID';
    }
    var body = {
      currency: this.state.currencyToRemove,
      offerType: opType,
      paymentId: this.state.paymentIdToRemove,
      paymentType: this.state.paymentTypeToRemove,
    };
    otc
      .removeOffer(body)
      .then((res) => {
        this.setState(
          {
            messageSuccess: true,
            currencyToRemove: '',
            operationTypeToRemove: '',
            paymentIdToRemove: '',
            paymentTypeToRemove: '',
            modalRemove: false,
          },
          function () {
            this.getOffers();
            setTimeout(() => {
              this.setState({
                messageSuccess: false,
              });
            }, 7000);
          }
        );
      })
      .catch((error) => {
        this.setState({
          messageError:
            'No se ha podido realizar la operación en este momento. Intente de nuevo.',
        });
        setTimeout(() => {
          this.setState({
            messageError: '',
          });
        }, 5000);
        //console.log(error);
      });
  };
  validateData(value) {
    if (value !== undefined) {
      return '-' + value;
    } else {
      return ' ';
    }
  }
  openRemoveConfirmModal = (
    currencyRemove,
    operationTypeRemove,
    paymentId,
    paymentType,
    paymentTypeSpanish
  ) =>
    this.setState({
      modalRemove: true,
      currencyToRemove: currencyRemove,
      operationTypeToRemove: operationTypeRemove,
      paymentIdToRemove: paymentId,
      paymentTypeToRemove: paymentType,
      paymentTypeToShow: paymentTypeSpanish,
    });
  closeRemoveConfirmModal = () => this.setState({ modalRemove: false });

  getOfferDetail = async (offerArray) => {
    let paymentIdArray = offerArray.filter((obj) =>
      Object.keys(obj).includes('paymentMethod')
    );
    var listDetails = [];
    if (paymentIdArray.length === 0) {
      this.setState({ showOffersTable: true });
    }
    for (var i = 0; i < paymentIdArray.length; i++) {
      var urlGetDetail =
        URL_BASE_DBTC +
        '/otc/getDollarBTCPayment/' +
        paymentIdArray[i].currency +
        '/' +
        paymentIdArray[i].paymentMethod;
      var toPush = await axios
        .get(urlGetDetail)
        .then((res) => {
          if (!_.isEmpty(res.data)) {
            if (res.data.bank !== undefined) {
              return {
                id: res.data.id,
                detail:
                  res.data.bank +
                  '-' +
                  res.data.accountNumber +
                  '-' +
                  res.data.accountHolderName +
                  this.validateData(res.data.accountHolderId),
              };
            } else {
              return {
                id: res.data.id,
                detail: res.data.walletAddress,
              };
            }
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
      if (i + 1 === paymentIdArray.length) {
        this.setState({ details: listDetails }, () => {
          this.setState({ showOffersTable: true });
        });
      }
    }
  };
  makeDataTable = (offers) => {
    var tableToShow = [];
    Object.entries(offers).forEach(([currency, operationType]) => {
      Object.entries(operationType).forEach(([operationName, offerInfo]) => {
        var offer = {};
        var offerType = operationName.split('__')[0];
        offer.paymentMethod = operationName.split('__')[1];
        offer.paymentType = operationName.split('__')[2];
        if (operationName.split('__')[2] === 'TRANSFER_INTERNATIONAL_BANK') {
          offer.paymentTypeSpanish =
            'Transferencia internacional (Swift o Aba)';
        } else if (operationName.split('__')[2] === 'CASH_DEPOSIT') {
          offer.paymentTypeSpanish = 'Depósito en efectivo';
        } else if (
          operationName.split('__')[2] === 'TRANSFER_WITH_SPECIFIC_BANK'
        ) {
          offer.paymentTypeSpanish = 'Transferencia desde un banco específico';
        } else if (operationName.split('__')[2] === 'TRANSFER_NATIONAL_BANK') {
          offer.paymentTypeSpanish = 'Transferencia desde un tercer banco';
        } else if (
          operationName.split('__')[2] === 'TRANSFER_TO_CRYPTO_WALLET'
        ) {
          offer.paymentTypeSpanish = 'Transferencia desde una crypto wallet';
        } else if (operationName.split('__')[2] === 'WIRE_TRANSFER') {
          offer.paymentTypeSpanish = 'Wire (Transferencia cablegráfica)';
        } else if (operationName.split('__')[2] === 'CHECK_DEPOSIT') {
          offer.paymentTypeSpanish = 'Depósito en cheque';
        } else if (operationName.split('__')[2] === 'RETAIL') {
          offer.paymentTypeSpanish = 'Retail (Minorista)';
        } else if (operationName.split('__')[2] === 'MAIN') {
          offer.paymentTypeSpanish = 'Main (Principal)';
        } else if (operationName.split('__')[2] === 'CREDIT_CARD') {
          offer.paymentTypeSpanish = 'Tarjeta de crédito';
        } else if (operationName.split('__')[2] === 'PERSONAL_CHECK_DEPOSIT') {
          offer.paymentTypeSpanish = 'Cheque personal';
        } else if (operationName.split('__')[2] === 'CASHIER_CHECK_DEPOSIT') {
          offer.paymentTypeSpanish = 'Cheque de gerencia';
        } else if (operationName.split('__')[2] === 'MONEY_ORDER') {
          offer.paymentTypeSpanish = 'Orden de dinero';
        } else {
          offer.paymentTypeSpanish = operationName.split('__')[2];
        }

        offer.paymentMethodAndType =
          offer.paymentMethod + '/' + offer.paymentTypeSpanish;
        let countryCoin = currency.split('_');
        let countryPrefix = countryCoin.length > 1 ? countryCoin[0] : '';
        let symbol = countryCoin.length > 1 ? countryCoin[1] : countryCoin[0];
        let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
          if (countryCoin.length > 1)
            return c.flag === countryPrefix.toLowerCase();
          else return c.key === symbol;
        })[0];
        if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
          offer.flag = currencyCurrent.flag;
        } else if(symbol === "ETH"){
					  offer.flag = "ethereum";
        };
        
        offer.currency = currency;

        if (offerType === 'ASK') {
          offer.operationType = 'COMPRA';
        } else if (offerType === 'BID') {
          offer.operationType = 'VENTA';
        }
        Object.entries(offerInfo).forEach(([infoLabel, infoData]) => {
          if (infoLabel === 'price') {
            offer.price = infoData;
          } else if (infoLabel === 'minPerOperationAmount') {
            offer.minPerOperationAmount = infoData;
          } else if (infoLabel === 'maxPerOperationAmount') {
            offer.maxPerOperationAmount = infoData;
          } else if (infoLabel === 'totalAmount') {
            offer.totalAmount = infoData;
          } else if (infoLabel === 'timestamp') {
            offer.date = this.formatDate(new Date(infoData));
          } else if (infoLabel === 'accumulatedAmount') {
            offer.accumulatedAmount = infoData;
          } else if (infoLabel === 'limitPrice') {
            offer.limitPrice = infoData;
          } else if (infoLabel === 'marginPercent') {
            offer.marginPercent = infoData;
          } else if (infoLabel === 'spreadPercent') {
            offer.spreadPercent = infoData;
          } else if (infoLabel === 'source') {
            offer.source = infoData;
          } else if (infoLabel === 'useChangePriceByOperationBalance') {
            offer.useChangePriceByOperationBalance = infoData;
            this.setState.useChangePriceByOperation = infoData;
          } else if (infoLabel === 'url') {
            offer.url = infoData;
          }
        });
        if (
          offer.hasOwnProperty('marginPercent') &&
          offer.hasOwnProperty('spreadPercent')
        ) {
          offer.offerType = 'dynamic';
          let marginPercent =
            offer.marginPercent < 0
              ? '(' +
                offer.marginPercent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }) +
                ')' +
                '% '
              : offer.marginPercent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }) + '%';
          let spreadPercent =
            offer.spreadPercent < 0
              ? '(' +
                offer.spreadPercent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }) +
                ')' +
                ' %'
              : offer.spreadPercent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }) + ' %';
          offer.percents = marginPercent + ' - ' + spreadPercent;
        } else {
          offer.offerType = 'static';
          offer.percents = 'N/A';
        }
        if (!offer.hasOwnProperty('source')) offer.source = 'N/A';
        if (!offer.hasOwnProperty('limitPrice')) offer.limitPrice = 'N/A';
        if (!offer.hasOwnProperty('price')) offer.price = 'N/A';
        if (!offer.hasOwnProperty('url')) offer.url = 'N/A';
        offer.minMax =
          offer.minPerOperationAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          }) +
          '-' +
          offer.maxPerOperationAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          });
        offer.acumTotal =
          offer.accumulatedAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          }) +
          '/' +
          offer.totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          });

        tableToShow.push(offer);
      });
    });
    this.getOfferDetail(tableToShow);
    this.setState({ offersTable: tableToShow });
  };

  getOffers() {
    /*var url =
            URL_BASE_DBTC + "/otcAdmin/getOffers/" + userService.getUserName();
        axios
            .get(url)*/
    let url = otc.getOffersAdmin(userService.getUserName());
    url
      .then((resp) => {
        this.makeDataTable(resp.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  refreshGetOffers() {
    this.setState({ showOffersTable: false });
    this.getOffers();
  }
  componentDidMount() {
    this.getOffers();
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  handleUseChangePriceByOperation = (e, data) => {
    this.setState({ useChangePriceByOperation: data.checked });
  };
  formatDate(date) {
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: 'true',
    };
    let data = date.toLocaleString(regi, options);
    if (regi === 'es-ES') {
      data = data.split(' ');
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + ' ' + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  closeEditOfferModal() {
    this.clearFieldsEditModal();
  }
  openEditOfferModal(original) {
    this.getReferencePrice(original.currency);
    let opType = '';
    if (original.operationType === 'COMPRA') {
      opType = 'ASK';
    } else if (original.operationType === 'VENTA') {
      opType = 'BID';
    }
    setTimeout(() => {
      if (original.offerType === 'static') {
        this.setState({
          editModal: true,
          minPerOperationToShow: original.minPerOperationAmount,
          maxPerOperationToShow: original.maxPerOperationAmount,
          accumulatedAmountToShow: original.totalAmount,
          currencyToUpdate: original.currency,
          priceToShow: original.price,
          paymentIdToUpdate: original.paymentMethod,
          offerTypeToUpdate: opType,
          paymentTypeToUpdate: original.paymentType,
          paymentTypeEditToShow: original.paymentTypeSpanish,
          modalTypeToEdit: original.offerType,
          useChangePriceByOperation: original.useChangePriceByOperationBalance,
        });
      } else {
        this.setState({
          editModal: true,
          priceToShow: original.price,
          minPerOperationToShow: original.minPerOperationAmount,
          maxPerOperationToShow: original.maxPerOperationAmount,
          accumulatedAmountToShow: original.totalAmount,
          currencyToUpdate: original.currency,
          limitPriceToShow: original.limitPrice,
          paymentIdToUpdate: original.paymentMethod,
          offerTypeToUpdate: opType,
          paymentTypeToUpdate: original.paymentType,
          paymentTypeEditToShow: original.paymentTypeSpanish,
          sourceToUpdate: original.source,
          marginPercentToShow: original.marginPercent,
          spreadPercentToShow: original.spreadPercent,
          modalTypeToEdit: original.offerType,
          useChangePriceByOperation: original.useChangePriceByOperationBalance,
        });
      }
    }, 2000);
  }
  updateOffer() {
    let minAmount = this.state.minPerOperationToUpdate;
    let maxAmount = this.state.maxPerOperationToUpdate;
    let maxPrevious = this.state.maxPerOperationToShow;
    let minPrevious = this.state.minPerOperationToShow;
    let price = this.state.priceToUpdate;
    let totalAmount = this.state.accumulatedAmountToUpdate;
    let body = {
      currency: this.state.currencyToUpdate,
      paymentId: this.state.paymentIdToUpdate,
      offerType: this.state.offerTypeToUpdate,
      paymentType: this.state.paymentTypeToUpdate,
      minPerOperationAmount: null,
      maxPerOperationAmount: null,
      totalAmount: null,
      price: null,
      useChangePriceByOperationBalance: this.state.useChangePriceByOperation,
    };
    if (minAmount > 0 && maxAmount > 0 && minAmount >= maxAmount) {
      this.setState({
        messageErrorEdit:
          'El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else if (minAmount > 0 && maxAmount <= 0 && minAmount >= maxPrevious) {
      this.setState({
        messageErrorEdit:
          'El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación actual',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else if (maxAmount > 0 && minAmount <= 0 && maxAmount <= minPrevious) {
      this.setState({
        messageErrorEdit:
          'El monto máximo por operación no puede ser menor o igual que el monto mínimo por operación actual',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else {
      if (minAmount > 0) body.minPerOperationAmount = minAmount;
      if (maxAmount > 0) body.maxPerOperationAmount = maxAmount;
      if (price > 0) body.price = price;
      if (totalAmount > 0) body.totalAmount = totalAmount;
      ////console.log(body);
      otc
        .editOffer(body)
        .then((resp) => {
          ////console.log(resp);
          this.setState({
            messageSuccessEdit:
              'La edición de la oferta se ha realizado exitosamente',
          });
          this.getOffers();
          setTimeout(() => {
            this.closeEditOfferModal();
          }, 3000);
        })
        .catch((error) => {
          //console.log(error);
          this.setState({
            messageErrorEdit:
              'La edición de la oferta no se ha podido completar de forma exitosa. Intente más tarde',
          });
          setTimeout(() => {
            this.closeEditOfferModal();
          }, 3000);
        });
    }
  }
  updateDynamicOffer() {
    let minAmount = this.state.minPerOperationToUpdate;
    let maxAmount = this.state.maxPerOperationToUpdate;
    let maxPrevious = this.state.maxPerOperationToShow;
    let minPrevious = this.state.minPerOperationToShow;
    let limitPrice = this.state.limitPriceToUpdate;
    let totalAmount = this.state.accumulatedAmountToUpdate;
    let body = {
      currency: this.state.currencyToUpdate,
      source: this.state.sourceToUpdate,
      paymentId: this.state.paymentIdToUpdate,
      offerType: this.state.offerTypeToUpdate,
      paymentType: this.state.paymentTypeToUpdate,
      minPerOperationAmount: null,
      maxPerOperationAmount: null,
      totalAmount: null,
      limitPrice: null,
      marginPercent: null,
      spreadPercent: null,
      useChangePriceByOperationBalance: this.state.useChangePriceByOperation,
    };
    if (minAmount > 0 && maxAmount > 0 && minAmount >= maxAmount) {
      this.setState({
        messageErrorEdit:
          'El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else if (minAmount > 0 && maxAmount <= 0 && minAmount >= maxPrevious) {
      this.setState({
        messageErrorEdit:
          'El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación actual',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else if (maxAmount > 0 && minAmount <= 0 && maxAmount <= minPrevious) {
      this.setState({
        messageErrorEdit:
          'El monto máximo por operación no puede ser menor o igual que el monto mínimo por operación actual',
      });
      setTimeout(() => {
        this.setState({ messageErrorEdit: '' });
      }, 3000);
    } else {
      if (minAmount > 0) body.minPerOperationAmount = minAmount;
      if (maxAmount > 0) body.maxPerOperationAmount = maxAmount;
      if (limitPrice > 0) body.limitPrice = limitPrice;
      if (totalAmount > 0) body.totalAmount = totalAmount;
      body.marginPercent = this.state.marginPercentToUpdate;
      body.spreadPercent = this.state.spreadPercentToUpdate;
      otc
        .updateDynamicOffer(body)
        .then((resp) => {
          this.setState({
            messageSuccessEdit:
              'La edición de la oferta se ha realizado exitosamente',
          });
          this.getOffers();
          setTimeout(() => {
            this.closeEditOfferModal();
          }, 3000);
        })
        .catch((error) => {
          //console.log(error);
          this.setState({
            messageErrorEdit:
              'La edición de la oferta no se ha podido completar de forma exitosa. Intente más tarde',
          });
          setTimeout(() => {
            this.closeEditOfferModal();
          }, 3000);
        });
    }
  }
  selectModalType() {
    
    if (this.state.modalTypeToEdit === 'static') this.updateOffer();
    else if (this.state.modalTypeToEdit === 'dynamic')
      this.updateDynamicOffer();
  }
  clearFieldsEditModal() {
    this.setState({
      editModal: false,
      messageSuccessEdit: '',
      messageErrorEdit: '',
      minPerOperationToShow: 0,
      maxPerOperationToShow: 0,
      accumulatedAmountToShow: 0,
      currencyToUpdate: '',
      priceToShow: 0,
      paymentIdToUpdate: '',
      offerTypeToUpdate: '',
      paymentTypeToUpdate: '',
      paymentTypeEditToShow: '',
      useChangePriceByOperation: false,
    });
  }
  render() {
    let messageAddSuccess,
      messageAddError,
      messageEditError,
      messageEditSuccess,
      messageCopied;
    if (this.state.copied) {
      messageCopied = (
        <Message info>
          <Message.Content>Enlace copiado</Message.Content>
        </Message>
      );
    }
    if (this.state.messageSuccess) {
      messageAddSuccess = (
        <Message positive>
          <Message.Header>Oferta inactivada</Message.Header>
          <p>La oferta ha sido inactivada exitosamente.</p>
        </Message>
      );
    }
    if (this.state.messageError !== '') {
      messageAddError = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{this.state.messageError}</p>
        </Message>
      );
    }
    if (this.state.messageErrorEdit !== '') {
      messageEditError = (
        <Message negative>
          <p>{this.state.messageErrorEdit}</p>
        </Message>
      );
    }
    if (this.state.messageSuccessEdit !== '') {
      messageEditSuccess = (
        <Message success>
          <p>{this.state.messageSuccessEdit}</p>
        </Message>
      );
    }
    const adTableHeaders = [
      {
        Header: 'Moneda',
        accessor: 'currency',
        Cell: (row) => {
          if (row.value !== 'ETH' && row.value !== 'USDT') {
            return (
              <div>
                <Flag name={row.original.flag} /> {row.value}
              </div>
            );
          } else if(row.value === 'ETH'){
            return (
              <div>
                <Icon name={row.original.flag} /> {row.value}
              </div>
            );
          } else {
            return(<div>
                    <img style={{paddingTop: 5}} width={20} height={20} src={theter} /> {row.value}</div>)
          }
        },
        width: 70,
      },
      {
        Header: 'Fecha',
        accessor: 'date',
        width: 130,
      },
      {
        Header: 'Medio de pago / Tipo de pago',
        accessor: 'paymentMethodAndType',
        Cell: (row) => {
          let method = row.value.split('/')[0];
          let type = row.value.split('/')[1];
          if (this.state.details.length > 0) {
            var text = 'MoneyClick';
            if (method === 'MONEYCLICK') {
              return (
                <span className='fake-link' title={text}>
                  {text + '/' + type}
                </span>
              );
            }
            for (var i = 0; i < this.state.details.length; i++) {
              if (this.state.details[i].id !== undefined) {
                if (method === this.state.details[i].id) {
                  var text = this.state.details[i].detail;
                  return (
                    <span className='fake-link' title={text}>
                      {method.slice(-4) + '/' + type}
                    </span>
                  );
                }
                if (i + 1 === this.state.details.length) {
                  return method.slice(-4) + '/' + type;
                }
              } else {
                return method.slice(-4) + '/' + type;
              }
            }
          } else {
            return method.slice(-4) + '/' + type;
          }
        },
      },
      {
        Header: 'Tipo de operación',
        accessor: 'operationType',
        width: 80,
      },
      {
        Header: 'Precio límite',
        accessor: 'limitPrice',
        getProps: () => {
          return {
            style: {
              textAlign: 'left',
            },
          };
        },
        Cell: (row) => {
          return row.value !== 'N/A' ? (
            <NumberFormat
              value={this.floorDecimals(row.value, 2)}
              decimalScale={2}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={true}
            />
          ) : (
            row.value
          );
        },
      },
      {
        Header: 'Precio',
        accessor: 'price',
        getProps: () => {
          return {
            style: {
              textAlign: 'left',
            },
          };
        },
        Cell: (row) => {
          return row.value !== 'N/A' ? (
            <NumberFormat
              value={this.floorDecimals(row.value, 2)}
              decimalScale={2}
              fixedDecimalScale={true}
              displayType={'text'}
              thousandSeparator={true}
            />
          ) : (
            row.value
          );
        },
      },
      {
        Header: 'Min-Máx',
        accessor: 'minMax',
        getProps: () => {
          return {
            style: {
              textAlign: 'left',
            },
          };
        },
      },
      {
        Header: 'Acumulado/Total',
        accessor: 'acumTotal',
        getProps: () => {
          return {
            style: {
              textAlign: 'left',
            },
          };
        },
      },
      {
        Header: 'Fuente',
        accessor: 'source',
        width: 80,
      },
      {
        Header: 'Margen - Propagación',
        accessor: 'percents',
        width: 90,
      },
      {
        Header: 'URL',
        accessor: 'url',
        filterable: false,
        width: 60,
        Cell: (row) => {
          return row.value !== 'N/A' ? (
            <CopyToClipboard text={row.value}>
              <Button
                onClick={this.onClickCopyBtn}
                // data-tip={t("wallet.receive.buttonCopy")}
                color='blue'
                size='tiny'
                icon
                circular
              >
                <Icon name='copy' />
              </Button>
            </CopyToClipboard>
          ) : (
            row.value
          );
        },
      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        filterable: false,
        width: 70,
        Cell: (row) => (
          <div>
            <Popup
              trigger={
                <Button
                  onClick={() => this.openEditOfferModal(row.original)}
                  color='blue'
                  size='tiny'
                  circular
                  icon
                >
                  <Icon name='edit outline' />
                </Button>
              }
              content='Editar oferta'
            />
            <Modal
              open={this.state.modalRemove}
              onClose={this.closeRemoveConfirmModal}
              trigger={
                <Popup
                  trigger={
                    <Button
                      onClick={() =>
                        this.openRemoveConfirmModal(
                          row.original.currency,
                          row.original.operationType,
                          row.original.paymentMethod,
                          row.original.paymentType,
                          row.original.paymentTypeSpanish
                        )
                      }
                      color='blue'
                      size='tiny'
                      circular
                      icon
                    >
                      <Icon name='remove' />
                    </Button>
                  }
                  content='Inactivar oferta'
                />
              }
            >
              <Modal.Header>Inactivar oferta</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  {this.state.paymentIdToRemove !== undefined && (
                    <p>
                      ¿Estás seguro que deseas inactivar la oferta de la moneda{' '}
                      <b>{this.state.currencyToRemove}</b>, cuyo tipo de
                      operación es <b>{this.state.operationTypeToRemove}</b>, el
                      medio de pago es el{' '}
                      <b>
                        {this.state.paymentIdToRemove === 'MONEYCLICK'
                          ? 'MoneyClick'
                          : this.state.paymentIdToRemove.slice(-4)}
                      </b>{' '}
                      y el tipo de pago es <b>{this.state.paymentTypeToShow}</b>
                      ?
                    </p>
                  )}
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.closeRemoveConfirmModal} color='red'>
                  <Icon name='remove' /> No
                </Button>
                <Button onClick={this.removeAdd} color='green'>
                  <Icon name='checkmark' /> Si
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
        ),
      },
    ];
    return (
      <div>
        {!this.state.showOffersTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        {messageAddSuccess}
        {messageAddError}
        {messageCopied}
        <Divider hidden></Divider>
        <Container textAlign='right'>
          <Button
            color='blue'
            type='submit'
            onClick={() => this.refreshGetOffers()}
            icon
            labelPosition='left'
            position='right'
          >
            <Icon name='refresh' />
            Refrescar
          </Button>
        </Container>
        <Divider hidden></Divider>
        <ReactTable
          defaultSorted={[
            {
              id: 'date',
              desc: true,
            },
          ]}
          style={{ fontSize: 12 }}
          className='transactionTable'
          data={this.state.offersTable}
          columns={adTableHeaders}
          defaultPageSize={5}
          previousText='Anterior'
          nextText='Siguiente'
          loadingText='Cargando...'
          noDataText='No hay transacciones'
          pageText='Página'
          ofText='de'
          rowsText='filas'
          pageJumpText='ir a la página'
          rowsSelectorText='filas por página'
          minRow={5}
          filterable
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            return row[id] !== undefined
              ? String(row[id]).startsWith(filter.value.toUpperCase())
              : true;
          }}
        />
        <Modal open={this.state.editModal} onClose={this.closeEditOfferModal}>
          <Modal.Header>Editar oferta</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {this.state.referencePrices.length > 0 && (
                <Segment loading={!this.state.showReferencePrices}>
                  <Header>
                    {(this.state.referenceHeaderFlag !== 'ethereum'  &&  this.state.referenceHeaderFlag !== 'usdt') ? (
                      <Flag name={this.state.referenceHeaderFlag} />
                    ) : this.state.referenceHeaderFlag === "ethereum" ? (
                        <Icon name={this.state.referenceHeaderFlag} />
                      ) : (<img style={{paddingTop: 5}} width={20} height={20} src={theter} />)}{' '}
                    Precios de referencia
                  </Header>
                  {this.state.referencePrices.map((referencePrice) => {
                    return (
                      <Grid.Row
                        style={{ marginTop: 10 }}
                        key={referencePrice.source}
                      >
                        {referencePrice.source}{' '}
                        {referencePrice.bid !== undefined && (
                          <Label>
                            Compra
                            <Label.Detail>
                              <NumberFormat
                                value={this.floorDecimals(
                                  referencePrice.ask,
                                  2
                                )}
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
                                value={this.floorDecimals(
                                  referencePrice.bid,
                                  2
                                )}
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
                                    ? this.floorDecimals(
                                        referencePrice.toUsd,
                                        2
                                      )
                                    : this.floorDecimals(
                                        referencePrice.toUsd,
                                        8
                                      )
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
              {this.state.currencyToUpdate !== '' && (
                <p>
                  Ud. está editando la información de la oferta con la moneda{' '}
                  <b>{this.state.currencyToUpdate}</b>, cuyo tipo de operación
                  es{' '}
                  <b>
                    {this.state.offerTypeToUpdate === 'BID'
                      ? 'VENTA'
                      : 'COMPRA'}
                  </b>
                  , el medio de pago es el{' '}
                  <b>
                    {this.state.paymentIdToUpdate === 'MONEYCLICK'
                      ? 'MoneyClick'
                      : this.state.paymentIdToUpdate.slice(-4)}
                  </b>{' '}
                  y el tipo de pago es <b>{this.state.paymentTypeEditToShow}</b>
                </p>
              )}
              {this.state.modalTypeToEdit === 'dynamic' && (
                <p>
                  <strong>
                    Precio actual:{' '}
                    {this.state.priceToShow.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </p>
              )}
              <p>Valores previos:</p>
              {this.state.currencyToUpdate !== '' && (
                <Form>
                  <Form.Group widths='equal'>
                    {this.state.modalTypeToEdit === 'static' && (
                      <Form.Field>
                        <label>
                          Precio:{' '}
                          <strong>
                            {this.state.priceToShow.toLocaleString('en-US', {
                              maximumFractionDigits: 2,
                            })}
                          </strong>
                        </label>
                      </Form.Field>
                    )}
                    <Form.Field>
                      <label>
                        Mínimo por operación:{' '}
                        <strong>
                          {this.state.minPerOperationToShow.toLocaleString(
                            'en-US',
                            { maximumFractionDigits: 2 }
                          )}
                        </strong>
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Máximo por operación:{' '}
                        <strong>
                          {this.state.maxPerOperationToShow.toLocaleString(
                            'en-US',
                            { maximumFractionDigits: 2 }
                          )}
                        </strong>
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Total máximo acumulado:{' '}
                        <strong>
                          {this.state.accumulatedAmountToShow.toLocaleString(
                            'en-US',
                            { maximumFractionDigits: 2 }
                          )}
                        </strong>
                      </label>
                    </Form.Field>
                  </Form.Group>
                </Form>
              )}
              {this.state.modalTypeToEdit === 'dynamic' && (
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>
                        Precio límite:{' '}
                        <strong>
                          {this.state.limitPriceToShow.toLocaleString('en-US', {
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Porcentaje de margen:{' '}
                        <strong>
                          {this.state.marginPercentToShow.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 4,
                            }
                          ) + ' %'}
                        </strong>
                      </label>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Porcentaje de propagación:{' '}
                        <strong>
                          {this.state.spreadPercentToShow.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 4,
                            }
                          ) + ' %'}
                        </strong>
                      </label>
                    </Form.Field>
                  </Form.Group>
                </Form>
              )}
              <Form>
                <Form.Group widths='equal'>
                  {this.state.modalTypeToEdit === 'static' && (
                    <Form.Field>
                      <label>Precio</label>
                      <NumberFormat
                        placeholder='Precio'
                        value={this.state.priceToUpdate}
                        fixedDecimalScale={true}
                        decimalScale={2}
                        onValueChange={(values) => {
                          let { floatValue } = values;
                          this.setState({ priceToUpdate: floatValue });
                        }}
                        thousandSeparator={true}
                        suffix={
                          '   ' +
                          this.state.currencyToUpdate.toUpperCase() +
                          ' / BTC'
                        }
                        allowNegative={false}
                      />
                    </Form.Field>
                  )}
                  <Form.Field>
                    <label>Mínimo por operación</label>
                    <NumberFormat
                      placeholder='Mínimo por operación'
                      decimalScale={2}
                      fixedDecimalScale={true}
                      value={this.state.minPerOperationToUpdate}
                      onValueChange={(values) => {
                        let { value } = values;
                        this.setState({
                          minPerOperationToUpdate: parseFloat(value),
                        });
                      }}
                      thousandSeparator={true}
                      suffix={'   ' + this.state.currencyToUpdate.toUpperCase()}
                      allowNegative={false}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Máximo por operación</label>
                    <NumberFormat
                      placeholder='Máximo por operación'
                      decimalScale={2}
                      value={this.state.maxPerOperationToUpdate}
                      fixedDecimalScale={true}
                      onValueChange={(values) => {
                        const { value } = values;
                        this.setState({
                          maxPerOperationToUpdate: parseFloat(value),
                        });
                      }}
                      thousandSeparator={true}
                      suffix={'   ' + this.state.currencyToUpdate.toUpperCase()}
                      allowNegative={false}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Total máximo acumulado</label>
                    <NumberFormat
                      placeholder='Total máximo acumulado'
                      decimalScale={2}
                      value={this.state.accumulatedAmountToUpdate}
                      fixedDecimalScale={true}
                      onValueChange={(values) => {
                        const { value } = values;
                        this.setState({
                          accumulatedAmountToUpdate: parseFloat(value),
                        });
                      }}
                      thousandSeparator={true}
                      suffix={'   ' + this.state.currencyToUpdate.toUpperCase()}
                      allowNegative={false}
                    />
                  </Form.Field>
                </Form.Group>
                {this.state.modalTypeToEdit === 'dynamic' && (
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <label>Precio límite</label>
                      <NumberFormat
                        placeholder='Precio límite'
                        thousandSeparator={true}
                        decimalScale={2}
                        value={this.state.limitPriceToUpdate}
                        fixedDecimalScale={true}
                        onValueChange={(values) => {
                          const { value } = values;
                          this.setState({
                            limitPriceToUpdate: parseFloat(value),
                          });
                        }}
                        suffix={
                          '   ' +
                          this.state.currencyToUpdate.toUpperCase() +
                          ' / BTC'
                        }
                        allowNegative={false}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Porcentaje de Margen</label>
                      <NumberFormat
                        placeholder='Margen'
                        decimalScale={2}
                        value={this.state.marginPercentToUpdate}
                        fixedDecimalScale={true}
                        onValueChange={(values) => {
                          const { value } = values;
                          this.setState({
                            marginPercentToUpdate: parseFloat(value),
                          });
                        }}
                        thousandSeparator={true}
                        suffix={' %'}
                        allowNegative={true}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Porcentaje de propagación</label>
                      <NumberFormat
                        placeholder='Propagación'
                        decimalScale={2}
                        value={this.state.spreadPercentToUpdate}
                        fixedDecimalScale={true}
                        onValueChange={(values) => {
                          const { value } = values;
                          this.setState({
                            spreadPercentToUpdate: parseFloat(value),
                          });
                        }}
                        thousandSeparator={true}
                        suffix={' %'}
                        allowNegative={true}
                      />
                    </Form.Field>
                  </Form.Group>
                )}
                <Container textAlign='left'>
                  <Checkbox
                    label='Utilizar precios calculados por balance de operaciones'
                    checked={
                      this.state.useChangePriceByOperation !== undefined
                        ? this.state.useChangePriceByOperation
                        : this.state.useChangePriceByOperation
                    }
                    onChange={this.handleUseChangePriceByOperation}
                  />
                </Container>
              </Form>
              {messageEditError}
              {messageEditSuccess}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeEditOfferModal} color='red'>
              <Icon name='remove' /> Cancelar
            </Button>
            <Button onClick={this.selectModalType} color='blue'>
              <Icon name='save' /> Guardar
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
export default ActualAd;
