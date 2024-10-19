import React, { Component } from "react";
import "../OTC.css";
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
    Divider
} from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import translate from "../../../i18n/translate";
import ReactTable from "react-table";
import brokerServices from "../../../services/brokers";
import otc from "../../../services/otc";
import config from "../../../services/config";
import axios from "axios";
import NumberFormat from "react-number-format";
import _ from "underscore";
import ISOCURRENCIES from "../../../common/ISO4217";
import theter from '../../../img/tether-seeklogo.svg'
const URL_BASE_DBTC = config.apiDollarBtcUrl;
class ActualOffer extends Component {
    constructor(props) {
        super(props);
        const mapPayments = new Map();
        mapPayments.set(
          "TRANSFER_WITH_SPECIFIC_BANK",
          props.translate("profile.addAccount.specificBank")
        );
        mapPayments.set(
          "TRANSFER_NATIONAL_BANK",
          props.translate("profile.addAccount.thirdBank")
        );
        mapPayments.set(
          "CHECK_DEPOSIT",
          props.translate("profile.addAccount.checkDeposit")
        );
        mapPayments.set(
          "CASH_DEPOSIT",
          props.translate("profile.addAccount.cashDeposit")
        );
        mapPayments.set(
          "WIRE_TRANSFER",
          props.translate("profile.addAccount.wire")
        );
        mapPayments.set(
          "TRANSFER_INTERNATIONAL_BANK",
          props.translate("profile.addAccount.international")
        );
        mapPayments.set("TRANSFER_TO_CRYPTO_WALLET",
          props.translate("profile.addAccount.cryptoWallet")
        );
        mapPayments.set("ELECTRONIC_TRANSFER",
            props.translate("profile.addAccount.electronicTrans"));
        
        this.state = {
            mapPayments: mapPayments,
            translator: props.translate,
            offersTable: [],
            showOffersTable: false,
            modalRemove: false,
            currencyToRemove: "",
            operationTypeToRemove: "",
            paymentIdToRemove: "",
            paymentTypeToRemove: "",
            messageError: "",
            messageSuccess: false,
            details: [],
            paymentTypeToShow: "",
            editModal: false,
            showReferencePrices: false,
            referencePrices: [],
            referenceHeaderFlag: "",
            currencyToUpdate: "",
            minPerOperationToUpdate: 0,
            maxPerOperationToUpdate: 0,
            accumulatedAmountToUpdate: 0,
            priceToUpdate: 0,
            paymentIdToUpdate: "",
            offerTypeToUpdate: "",
            paymentTypeToUpdate: "",
            sourceToUpdate: "",
            limitPriceToUpdate: 0,
            marginPercentToUpdate: 0,
            spreadPercentToUpdate: 0,
            paymentTypeEditToShow: "",
            priceToShow: 0,
            minPerOperationToShow: 0,
            maxPerOperationToShow: 0,
            accumulatedAmountToShow: 0,
            limitPriceToShow: 0,
            marginPercentToShow: 0,
            spreadPercentToShow: 0,
            messageErrorEdit: "",
            messageSuccessEdit: "",
            modalTypeToEdit: "",
            askBottomLimit: "",
            askTopLimit: "",
            bidBottomLimit: "",
            bidTopLimit: "",
            priceBidMax: "",
            priceAskMin: "",
            marginPercentBid: "",
            marginPercentAsk: "",
            spreadPercentsBid: "",
            spreadPercentsAsk: "",
            copied: false,
            limitsAsk: "",
            limitsBid:""
        };
        this.closeEditOfferModal = this.closeEditOfferModal.bind(this);
        this.openEditOfferModal = this.openEditOfferModal.bind(this);
        this.updateOffer = this.updateOffer.bind(this);
        this.updateDynamicOffer = this.updateDynamicOffer.bind(this);
        this.clearFieldsEditModal = this.clearFieldsEditModal.bind(this);
        this.selectModalType = this.selectModalType.bind(this);
    }
    getReferencePrice = symbolBase => {
        let countryCoin = symbolBase.split("_");
        let countryPrefix = countryCoin.length > 1 ? countryCoin[0] : "";
        let symbol = countryCoin.length > 1 ? countryCoin[1] : countryCoin[0];
        this.setState({ showReferencePrices: false });
        var url = URL_BASE_DBTC + "/analysis/getFullPriceInfo";
        axios
            .get(url)
            .then(res => {
                var prices = [];
                this.setState({ referencePrices: [], referenceHeaderFlag: "" });
                Object.entries(res.data).forEach(([currency, sourceReferences]) => {
                    if (currency === symbol) {
                        Object.entries(sourceReferences).forEach(
                            ([sourceReferencesTitle, sourceReferencesData]) => {
                                var referenceToAdd;
                                if (sourceReferencesTitle === "localBitcoins") {
                                    var bid = sourceReferencesData.bid.average.price;
                                    var ask = sourceReferencesData.ask.average.price;
                                    var usdPrice = sourceReferencesData.usdPrice;
                                    referenceToAdd = {
                                        source: "LocalBitcoins",
                                        bid: bid,
                                        ask: ask,
                                        toUsd: usdPrice
                                    };
                                } else if (sourceReferencesTitle === "forex") {
                                    var usdRate = sourceReferencesData.usdRate;
                                    referenceToAdd = {
                                        source: "Forex",
                                        toUsd: usdRate
                                    };
                                }
                                prices.push(referenceToAdd);
                            }
                        );
                        let flag = "";
                        let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
                            if (countryCoin.length > 1)
                                return c.flag === countryPrefix.toLowerCase();
                            else return c.key === symbol
                        })[0];
                        if (currencyCurrent !== undefined  && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
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
            .catch(error => {
                //console.log(error);
            });
    };
    removeAdd = () => {
        
        var body = {
            userName:sessionStorage.getItem("username"),
            currency: this.state.currencyToRemove,
            paymentId: this.state.paymentIdToRemove,
            offerType: this.state.operationTypeToRemove,
            paymentType: this.state.paymentTypeToRemove
        };
        brokerServices
            .removeOffer(body)
            .then(res => {
                if(res.data==="OK"){this.setState(
                    {
                        messageSuccess: true,
                        currencyToRemove: "",
                        operationTypeToRemove: "",
                        paymentIdToRemove: "",
                        paymentTypeToRemove: "",
                        modalRemove: false
                    },
                    function () {
                        this.getOffers();
                        setTimeout(() => {
                            this.setState({
                                messageSuccess: false
                            });
                        }, 7000);
                    }
                );}
            })
            .catch(error => {
                this.setState({
                    messageError:
                        "broker.actualOfferTable.message.errorOperation"
                });
                setTimeout(() => {
                    this.setState({
                        messageError: ""
                    });
                }, 5000);
                //console.log(error);
            });
    };
    validateData(value) {
        if (value !== undefined) {
          return "-" + value;
        } else {
          return " ";
        }
      }
    openRemoveConfirmModal = (
        currencyRemove,
        operationTypeRemove,
        paymentId,
        paymentType
    ) =>
        this.setState({
            modalRemove: true,
            currencyToRemove: currencyRemove,
            operationTypeToRemove: operationTypeRemove,
            paymentIdToRemove: paymentId,
            paymentTypeToRemove: paymentType,
            paymentTypeToShow: this.state.mapPayments.get(paymentType)
        });
    closeRemoveConfirmModal = () => this.setState({ modalRemove: false });

    getOfferDetail = async offerArray => {
        let paymentIdArray = offerArray.filter(obj =>
          Object.keys(obj).includes("paymentMethod")
        );
        var listDetails = [];
        if (paymentIdArray.length === 0) {
          this.setState({ showOffersTable: true });
        }
        for (var i = 0; i < paymentIdArray.length; i++) {
          let currency = paymentIdArray[i].currency;
          let id = paymentIdArray[i].paymentMethod;
          var toPush = await otc
            .getDollarBTCPayment(currency, id)
            .then(res => {
              if (!_.isEmpty(res.data)) {
                if (res.data.bank !== undefined) {
                  return {
                    id: res.data.id,
                    detail:
                      res.data.bank +
                      "-" +
                      res.data.accountNumber +
                      "-" +
                      res.data.accountHolderName +
                      this.validateData(res.data.accountHolderId)
                  };
                } else {
                  return {
                    id: res.data.id,
                    detail: res.data.walletAddress
                  };
                }
              } else {
                return {};
              }
            })
            .catch(error => {
              //console.log(error);
            });
          if (!_.isEmpty(toPush)) {
            listDetails.push(toPush);
          }
          if (i + 1 === paymentIdArray.length) {
              this.setState({ details: listDetails }, () => {
              this.setState({ showOffersTable: false });
            });
          }
        }
      };
  
    floorDecimals = (value, numberDecimals) => {
        let decimales = Math.pow(10, numberDecimals);
        return Math.floor(value * decimales) / decimales;
    };


    closeEditOfferModal() {
        this.clearFieldsEditModal();
    }
    openEditOfferModal(original) {
        console.log(original)
        this.getReferencePrice(original.currency);
        this.getOfferParams(original.currency);
       
        setTimeout(() => {
            if (original.offerType === "static") {
                this.setState(
                    {
                        editModal: true,
                        minPerOperationToShow: original.minPerOperationAmount,
                        maxPerOperationToShow: original.maxPerOperationAmount,
                        accumulatedAmountToShow: original.totalAmount,
                        currencyToUpdate: original.currency,
                        priceToShow: original.price,
                        paymentIdToUpdate: original.paymentMethod,
                        offerTypeToUpdate: original.operationType,
                        paymentTypeToUpdate: original.paymentType,
                        paymentTypeEditToShow: original.paymentType,
                        modalTypeToEdit: original.offerType
                    })
            } else {
                this.setState(
                    {
                        editModal: true,
                        priceToShow: original.price,
                        minPerOperationToShow: original.minPerOperationAmount,
                        maxPerOperationToShow: original.maxPerOperationAmount,
                        accumulatedAmountToShow: original.totalAmount,
                        currencyToUpdate: original.currency,
                        limitPriceToShow: original.limitPrice,
                        paymentIdToUpdate: original.paymentMethod,
                        offerTypeToUpdate: original.operationType,
                        paymentTypeToUpdate: original.paymentType,
                        paymentTypeEditToShow: original.paymentType,
                        sourceToUpdate: original.source,
                        marginPercentToShow: original.marginPercent,
                        spreadPercentToShow: original.spreadPercent,
                        modalTypeToEdit: original.offerType
                    })
            }
        }
            , 2000);

    }
    updateOffer() {
        let minAmount = this.state.minPerOperationToUpdate;
        let maxAmount = this.state.maxPerOperationToUpdate;
        let maxPrevious = this.state.maxPerOperationToShow;
        let minPrevious = this.state.minPerOperationToShow;
        let price = this.state.priceToUpdate;
        let totalAmount = this.state.accumulatedAmountToUpdate;
        let body = {
            userName:sessionStorage.getItem("username"),
            currency: this.state.currencyToUpdate,
            paymentId: this.state.paymentIdToUpdate,
            price: null,
            minPerOperationAmount: null,
            maxPerOperationAmount: null,
            totalAmount: null,
            offerType: this.state.offerTypeToUpdate,
            paymentType: this.state.paymentTypeToUpdate
        };
        if ((minAmount > 0 && maxAmount > 0) && minAmount >= maxAmount) {
            this.setState({
                messageErrorEdit: "broker.actualOfferTable.message.errorAmount1"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        } else if ((minAmount > 0 && maxAmount <= 0) && minAmount >= maxPrevious) {
            this.setState({
                messageErrorEdit:  "broker.actualOfferTable.message.errorAmount2"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        } else if ((maxAmount > 0 && minAmount <= 0) && maxAmount <= minPrevious) {
            this.setState({
                messageErrorEdit: "broker.actualOfferTable.message.errorAmount3"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        }  else {
            
            if (this.state.offerTypeToUpdate === "BID") {
                if (price > 0 && price <= this.state.priceBidMax) {
                     body.price = price;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorPrice"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                   
                if (minAmount >= this.state.bidBottomLimit && minAmount > 0) {
                    body.minPerOperationAmount = minAmount;
                } else {
                     this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitMin"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                if (totalAmount <= this.state.bidTopLimit && totalAmount > 0) {
                    body.maxPerOperationAmount = maxAmount;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitMax"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                if (totalAmount > 0 && totalAmount <= this.state.bidTopLimit) {
                    body.totalAmount = totalAmount;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitOffer"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
            } else {
                if (price > 0 && price >= this.state.priceAskMin) {
                    body.price = price;
                } else {
                    this.setState({
                        messageErrorEdit:  "broker.actualOfferTable.message.errorPriceMaxOffer" 
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                    
                    if (minAmount >= this.state.askBottomLimit && minAmount > 0) {
                        body.minPerOperationAmount = minAmount;
                    } else {
                         this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitMin"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
                    if (maxAmount <= this.state.askTopLimit && maxAmount > 0) {
                        body.maxPerOperationAmount = maxAmount;
                    } else {
                        this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitMax"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
                    if (totalAmount > 0 && totalAmount <= this.state.askTopLimit) {
                        body.totalAmount = totalAmount;
                    } else {
                        this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitOffer"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
            }
            
            brokerServices.editOfferStatic(body)
                .then(resp => {
                    if (resp.data === "OK") {
                        this.setState({
                            messageSuccessEdit: "broker.actualOfferTable.message.successEditOffer"
                        });
                        this.getOffers();
                        setTimeout(() => {
                            this.closeEditOfferModal()
                        }, 3000);
                    }
                })
                .catch(error => {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorEditOffer"
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
            userName:sessionStorage.getItem("username"),
            currency: this.state.currencyToUpdate,
            paymentId: this.state.paymentIdToUpdate,
            source: this.state.sourceToUpdate,
            limitPrice: null,
            marginPercent: null,
            spreadPercent: null,
            minPerOperationAmount: null,
            maxPerOperationAmount: null,
            totalAmount: null,
            offerType: this.state.offerTypeToUpdate,
            paymentType: this.state.paymentTypeToUpdate
        };
        if ((minAmount > 0 && maxAmount > 0) && minAmount >= maxAmount) {
            this.setState({
                messageErrorEdit: "broker.actualOfferTable.message.errorAmount1"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        } else if ((minAmount > 0 && maxAmount <= 0) && minAmount >= maxPrevious) {
            this.setState({
                messageErrorEdit: "broker.actualOfferTable.message.errorAmount2"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        } else if ((maxAmount > 0 && minAmount <= 0) && maxAmount <= minPrevious) {
            this.setState({
                messageErrorEdit: "broker.actualOfferTable.message.errorAmount3"
            });
            setTimeout(() => {
                this.setState({ messageErrorEdit: "" })
            }, 3000);
        } else {
            if (this.state.offerTypeToUpdate === "BID") {
                if (limitPrice > 0 && limitPrice <= this.state.priceBidMax) {
                     body.limitPrice = limitPrice;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorPrice"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                   
                if (minAmount >= this.state.bidBottomLimit && minAmount > 0) {
                    body.minPerOperationAmount = minAmount;
                } else {
                     this.setState({
                        messageErrorEdit:  "broker.actualOfferTable.message.errorLimitMin"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                if (totalAmount <= this.state.bidTopLimit && totalAmount > 0) {
                    body.maxPerOperationAmount = maxAmount;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitMax"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                if (totalAmount > 0 && totalAmount <= this.state.bidTopLimit) {
                    body.totalAmount = totalAmount;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitOffer"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }

                if (this.state.marginPercentToUpdate > 0 &&
                    this.state.marginPercentToUpdate >= this.state.marginPercentBid) {
                    body.marginPercent = this.state.marginPercentToUpdate;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitMinPercent"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                 }
                     
                if (this.state.spreadPercentToUpdate > 0 &&
                    this.state.marginPercentToUpdate >= this.state.spreadPercentsBid) {
                    body.spreadPercent = this.state.spreadPercentToUpdate;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorLimitMinSpread"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                 }
                     
            } else {
                if (limitPrice > 0 && limitPrice >= this.state.priceAskMin) {
                    body.limitPrice = limitPrice;
                } else {
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorPriceMaxOffer"
                    });
                    setTimeout(() => {
                        this.setState({ messageErrorEdit: "" })
                    }, 3000);
                }
                    
                    if (minAmount >= this.state.askBottomLimit && minAmount > 0) {
                        body.minPerOperationAmount = minAmount;
                    } else {
                         this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitMin"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
                    if (maxAmount <= this.state.askTopLimit && maxAmount > 0) {
                        body.maxPerOperationAmount = maxAmount;
                    } else {
                        this.setState({
                            messageErrorEdit:"broker.actualOfferTable.message.errorLimitMax"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
                    if (totalAmount > 0 && totalAmount <= this.state.askTopLimit) {
                        body.totalAmount = totalAmount;
                    } else {
                        this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitOffer"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                    }
                    if (this.state.marginPercentToUpdate > 0 &&
                        this.state.marginPercentToUpdate >= this.state.marginPercentAsk) {
                        body.marginPercent = this.state.marginPercentToUpdate;
                    } else {
                        this.setState({
                            messageErrorEdit:  "broker.actualOfferTable.message.errorLimitMinPercent"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                     }
                         
                    if (this.state.spreadPercentToUpdate > 0 &&
                        this.state.marginPercentToUpdate >= this.state.spreadPercentsAsk) {
                        body.spreadPercent = this.state.spreadPercentToUpdate;
                    } else {
                        this.setState({
                            messageErrorEdit: "broker.actualOfferTable.message.errorLimitMinSpread"
                        });
                        setTimeout(() => {
                            this.setState({ messageErrorEdit: "" })
                        }, 3000);
                     }
            }
    
            brokerServices.editOfferDynamic(body)
                .then(resp => {
                    if (resp.data === "OK") {
                        this.setState({
                        messageSuccessEdit: "broker.actualOfferTable.message.successEditOffer"
                    });
                    this.getOffers();
                    setTimeout(() => {
                        this.closeEditOfferModal()
                    }, 3000);}
                })
                .catch(error => {
                    //console.log(error);
                    this.setState({
                        messageErrorEdit: "broker.actualOfferTable.message.errorEditOffer"
                    });
                    setTimeout(() => {
                        this.closeEditOfferModal();
                    }, 3000);
                });
       }
    }
    selectModalType() {
        if (this.state.modalTypeToEdit === "static")
            this.updateOffer();
        else if (this.state.modalTypeToEdit === "dynamic")
            this.updateDynamicOffer();
    }
    clearFieldsEditModal() {
        this.setState({
            editModal: false,
            messageSuccessEdit: "",
            messageErrorEdit: "",
            minPerOperationToShow: 0,
            maxPerOperationToShow: 0,
            accumulatedAmountToShow: 0,
            currencyToUpdate: "",
            priceToShow: 0,
            paymentIdToUpdate: "",
            offerTypeToUpdate: "",
            paymentTypeToUpdate: "",
            paymentTypeEditToShow: "",
            useChangePriceByOperation:false
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const mapPayments = new Map();
        mapPayments.set(
          "TRANSFER_WITH_SPECIFIC_BANK",
          nextProps.translate("profile.addAccount.specificBank")
        );
        mapPayments.set(
          "TRANSFER_NATIONAL_BANK",
          nextProps.translate("profile.addAccount.thirdBank")
        );
        mapPayments.set(
          "CHECK_DEPOSIT",
          nextProps.translate("profile.addAccount.checkDeposit")
        );
        mapPayments.set(
          "CASH_DEPOSIT",
          nextProps.translate("profile.addAccount.cashDeposit")
        );
        mapPayments.set(
          "WIRE_TRANSFER",
          nextProps.translate("profile.addAccount.wire")
        );
        mapPayments.set(
          "TRANSFER_INTERNATIONAL_BANK",
          nextProps.translate("profile.addAccount.international")
        );
        mapPayments.set("TRANSFER_TO_CRYPTO_WALLET",
          nextProps.translate("profile.addAccount.cryptoWallet")
        );
        mapPayments.set("ELECTRONIC_TRANSFER",
          nextProps.translate("profile.addAccount.electronicTrans"));
        this.setState({
          mapPayments:mapPayments
        });

        if (this.props.language !== nextProps.language) {
          this.setState({
            translator: nextProps.translate
          });
        }
    }
    componentDidMount() {
        this.getOffers()
    }
    getOffers() {
        let user = sessionStorage.getItem("username")
        let listOffer = [];
        brokerServices.getOfferByUser(user).then(resp => {
            Object.entries(resp.data).forEach(([key, value]) => {
                let offer = {}
                offer.operationType = key.split("__")[1];
                offer.paymentMethod = key.split("__")[2];
                offer.paymentType = key.split("__")[3];
                offer.payMethodAndType= offer.paymentMethod+"/"+this.state.mapPayments.get(offer.paymentType)
                let currency = key.split("__")[0];

                let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
                     return c.key === currency
                })[0];
                if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
                    offer.flag = currencyCurrent.flag;
                } else if(currency === "ETH") {
					offer.flag = "ethereum";
                }
                offer.currency = currency;
                
                Object.entries(value).forEach(([k, v]) => {
                    if (k === "timestamp") {
                        offer.date= this.formatDate(new Date(v))
                    } else if (k === "price") {
                        offer.price= v
                    } else if (k === "minPerOperationAmount") {
                        offer.minPerOperationAmount= v
                    } else if (k === "maxPerOperationAmount") {
                        offer.maxPerOperationAmount=v
                    } else if (k === "totalAmount") {
                        offer.totalAmount=v
                    } else if (k === "url") {
                        offer.url=v
                    } else if (k === "accumulatedAmount") {
                        offer.accumulatedAmount=v
                    } else if (k === "limitPrice") {
                        offer.limitPrice= v
                    }else if (k === "marginPercent") {
                        offer.marginPercent= v
                    }else if (k === "spreadPercent") {
                        offer.spreadPercent= v
                    }else if (k === "source") {
                        offer.source= v
                    }

                    if (!offer.hasOwnProperty("source"))
                    offer.source = "N/A";
                if (!offer.hasOwnProperty("limitPrice"))
                    offer.limitPrice = "N/A";
                if (!offer.hasOwnProperty("price"))
                    offer.price = "N/A";
                if (offer.hasOwnProperty("marginPercent") && offer.hasOwnProperty("spreadPercent")) {
                        offer.offerType = "dynamic";
                        offer.percents =
                            offer.marginPercent.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            }) +
                            "% - " +
                            offer.spreadPercent.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            }) +
                            " %"
                    } else {
                        offer.offerType = "static";
                        offer.percents = "N/A";
                }
                    if (offer.hasOwnProperty("minPerOperationAmount") && offer.hasOwnProperty("maxPerOperationAmount") && offer.hasOwnProperty("accumulatedAmount") && offer.hasOwnProperty("totalAmount")) {
                        offer.minMax =
                            offer.minPerOperationAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            }) +
                            "-" +
                            offer.maxPerOperationAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            });
                        offer.acumTotal =
                            offer.accumulatedAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            }) +
                            "/" +
                            offer.totalAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 4
                            });
                    }
                })
                listOffer.push(offer)
            })

            this.getOfferDetail(listOffer);
            this.setState({ offersTable: listOffer })
            
        }).catch(error => {
            
        })
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

        // lunes, 26 de diciembre de 2050 9 a. m.
    }
    getOfferParams(currency) {
        brokerServices
          .getOffersParams(currency)
          .then(resp => {
            let data = resp.data;
              Object.entries(data).forEach(([key, value]) => {
                if (key === "limits") {
                    this.setState({
                        askBottomLimit: value.askBottom,
                        askTopLimit: value.askTop,
                         bidBottomLimit: value.bidBottom, 
                         bidTopLimit: value.bidTop,
                        limitsAsk: value.askBottom.toLocaleString("en-US", {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 4
                       }) + " - " + value.askTop.toLocaleString("en-US", {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 4
                       }),
                         limitsBid: value.bidBottom.toLocaleString("en-US", {
                             minimumFractionDigits: 2,
                             maximumFractionDigits: 4
                           }) + " - "+value.bidTop.toLocaleString("en-US", {
                             minimumFractionDigits: 2,
                             maximumFractionDigits: 4
                           })
                     })
             
         }
                if (key === "prices") {
                    this.setState({
                        priceAskMin: value.askMin,
                        priceBidMax: value.bidMax
                    })
                }
                if (key === "marginPercents") {
                    this.setState({
                        marginPercentAsk: value.askMin,
                        marginPercentBid: value.bidMin
                      });
                }
                if (key === "spreadPercents") {
                    this.setState({
                        spreadPercentsAsk: value.askMin,
                        spreadPercentsBid: value.bidMin
                      });
                }
              });
        
          })
          .catch(error => {});
    }
    onClickCopyBtn = () => {
        this.setState({
          copied: true
        });
        setTimeout(() => {
          this.setState({
            copied: false
          });
        }, 7000);
      };
    render() {
        let t = this.state.translator;
        let messageAddSuccess, messageAddError, messageEditError, messageEditSuccess, messageCopied;
        if (this.state.copied) {
            messageCopied = (
              <Message info>
                <Message.Content>{t("broker.actualOfferTable.message.url")}</Message.Content>
              </Message>
            );
          }
        if (this.state.messageSuccess) {
            messageAddSuccess = (
                <Message positive>
                    <Message.Header>{t("broker.actualOfferTable.message.offerInactivate")}</Message.Header>
                    <p>{t("broker.actualOfferTable.message. alertOfferInactivate")}</p>
                </Message>
            );
        }
        if (this.state.messageError !== "") {
            messageAddError = (
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{t(this.state.messageError)}</p>
                </Message>
            );
        }
        if (this.state.messageErrorEdit !== "") {
            messageEditError = (
                <Message negative>
                    <p>{t(this.state.messageErrorEdit)}</p>
                </Message>
            );
        }
        if (this.state.messageSuccessEdit !== "") {
            messageEditSuccess = (
                <Message success>
                    <p>{t(this.state.messageSuccessEdit)}</p>
                </Message>
            );
        }
        const adTableHeaders = [
            {
                Header: t("broker.actualOfferTable.currency"),
                accessor: "currency",
                Cell: row => {
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
                width: 70
            },
            {
                Header:  t("broker.actualOfferTable.date"),
                accessor: "date",
                width: 130
            },
            {
                Header: t("broker.actualOfferTable.paymentMethod"),
                accessor: "payMethodAndType",
                Cell: row => {
                    let method = row.value.split("/")[0];
                    let type = row.value.split("/")[1];
                    if (this.state.details.length > 0) {
                        for (var i = 0; i < this.state.details.length; i++) {
                            if (this.state.details[i].id !== undefined) {
                                if (method === this.state.details[i].id) {
                                    var text = this.state.details[i].detail;
                                    return (
                                        <span className="fake-link" title={text}>
                                            {method.slice(-4) + "/" + type}
                                        </span>
                                    );
                                }
                                if (i + 1 === this.state.details.length) {
                                    return method.slice(-4) + "/" + type;
                                }
                            } else {
                                return method.slice(-4) + "/" + type;
                            }
                        }
                    } else {
                        return method.slice(-4) + "/" + type;
                        }
                    }
            },
            {
                Header: t("broker.actualOfferTable.typeOperation"),
                accessor: "operationType",
                width: 80,
                Cell: row => {
                        if (row.value === "BID") {
                           return t("broker.addOfferOption.buy")
                        } else if (row.value === "ASK"){
                            return t("broker.addOfferOption.sell") 
                        }else{
                            return row.value
                        }
                    
                }
            },
            {
                Header: t("broker.actualOfferTable.priceLimit"),
                accessor: "limitPrice",
                width: 80,
                getProps: () => {
                    return {
                      style: {
                        textAlign: "left"
                      }
                    };
                  },
                Cell: row => {
                    return (
                        row.value !== "N/A" ?
                            <NumberFormat
                                value={this.floorDecimals(row.value, 2)}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                displayType={"text"}
                                thousandSeparator={true}
                            />
                            : row.value
                    );
                }
            },
            {
                Header: t("broker.actualOfferTable.price"),
                accessor: "price",
                getProps: () => {
                    return {
                      style: {
                        textAlign: "left"
                      }
                    };
                  },
                width: 80,
                Cell: row => {
                    return (
                        row.value !== "N/A" ?
                            <NumberFormat
                                value={this.floorDecimals(row.value, 2)}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                displayType={"text"}
                                thousandSeparator={true}
                                style={{textAlign:"left"}}
                            />
                            : row.value
                    );
                }
            },
            {
                Header: "Min-Máx",
                accessor: "minMax",
                getProps: () => {
                    return {
                      style: {
                        textAlign: "left"
                      }
                    };
                  }
            },
            {
                Header: t("broker.actualOfferTable.accumulated"),
                accessor: "acumTotal",
                getProps: () => {
                    return {
                      style: {
                        textAlign: "left"
                      }
                    };
                  }
            },
            {
                Header: t("broker.actualOfferTable.source"),
                accessor: "source",
                width: 80
            },
            {
                Header: t("broker.actualOfferTable.marginPropagation"),
                accessor: "percents",
                width: 90
            },
            {
                Header: "URL",
                accessor: "url",
                filterable: false,
                width: 60,
                Cell: row => (
                    <CopyToClipboard text={row.value}>
                        <Button
                                onClick={this.onClickCopyBtn}
                                data-tip={t("wallet.receive.buttonCopy")}
                                color="blue"
                                size="tiny"
                                icon
                                circular
                            >
                                <Icon name="copy" />
                            </Button>
                    </CopyToClipboard>
                )
            },
            {
                Header: t("broker.actualOfferTable.actions"),
                accessor: "actions",
                filterable: false,
                width: 70,
                Cell: row => (
                    <div>
                        <Popup
                            trigger={
                                <Button
                                    onClick={() => this.openEditOfferModal(row.original)}
                                    color="blue"
                                    size="tiny"
                                    circular
                                    icon
                                >
                                    <Icon name="edit outline" />
                                </Button>
                            }
                            content={t("broker.actualOfferTable.buttonEdit")}
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
                                                    row.original.paymentType
                                                )
                                            }
                                            color="blue"
                                            size="tiny"
                                            circular
                                            icon
                                        >
                                            <Icon name="remove" />
                                        </Button>
                                    }
                                    content={t("broker.actualOfferTable.buttonInactivate")}
                                />
                            }
                        >
                            <Modal.Header>{t("broker.actualOfferTable.modalInactivate.header")}</Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
                                    {this.state.paymentIdToRemove !== undefined && (
                                        <p>
                                            {t("broker.actualOfferTable.modalInactivate.content1")}{" "}
                                            <b>{this.state.currencyToRemove}</b>, {t("broker.actualOfferTable.modalInactivate.content2")}<b>{this.state.operationTypeToRemove==="BID"?t("broker.actualOfferTable.modalEdit.buy"):t("broker.actualOfferTable.modalEdit.sell")}</b>, {t("broker.actualOfferTable.modalInactivate.content3")}{" "}
                                            <b>{this.state.paymentIdToRemove.slice(-4)}</b>
                                            {t("broker.actualOfferTable.modalInactivate.content4")}<b>{this.state.paymentTypeToShow}</b>?
                    </p>
                                    )}
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={this.closeRemoveConfirmModal} color="red">
                                    <Icon name="remove" /> {t("broker.actualOfferTable.modalInactivate.buttonNegative")}
                </Button>
                                <Button onClick={this.removeAdd} color="green">
                                    <Icon name="checkmark" /> {t("broker.actualOfferTable.modalInactivate.buttonYes")}
                </Button>
                            </Modal.Actions>
                        </Modal>
                    </div>
                )
            }
        ];
        return (
            <div>
                {messageAddSuccess}
                {messageAddError}
                {messageCopied}
                {this.state.showOffersTable && (
                    <Dimmer active inverted>
                        <Loader inverted>{t("broker.actualOfferTable.table.loading")}</Loader>
                    </Dimmer>
                )}
                <ReactTable
                    defaultSorted={[
                        {
                            id: "date",
                            desc: true
                        }
                    ]}
                    style={{ fontSize: 12 }}
                    className="transactionTable"
                    data={this.state.offersTable}
                    loading={this.state.showOffersTable}
                    columns={adTableHeaders}
                    defaultPageSize={5}
                    previousText={t("broker.actualOfferTable.table.previous")}
                    nextText={t("broker.actualOfferTable.table.next")}
                    loadingText={t("broker.actualOfferTable.table.loading")}
                    noDataText={t("broker.actualOfferTable.table.noData")}
                    pageText={t("broker.actualOfferTable.table.page")}
                    ofText={t("broker.actualOfferTable.table.of")}
                    rowsText={t("broker.actualOfferTable.table.rows")}
                    pageJumpText={t("broker.actualOfferTable.table.pageJump")}
                    rowsSelectorText={t("broker.actualOfferTable.table.rowsSelector")}
                    minRow={5}
                    filterable
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        return row[id] !== undefined
                            ? String(row[id]).startsWith(filter.value.toUpperCase())
                            : true;
                    }}
                />
                <Modal
                    open={this.state.editModal}
                    onClose={this.closeEditOfferModal}
                >
                    <Modal.Header>{t("broker.actualOfferTable.modalEdit.header")}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            {this.state.referencePrices.length > 0 && (
                                 <div>
                                 <Grid>
                                 <Grid.Row>
                                   <Grid.Column largeScreen={8} computer={8}>
                                    <Segment style={{paddingBottom: this.state.modalTypeToEdit === "dynamic"?24:8}} 
                                             loading={!this.state.showReferencePrices}>
                                    <Header>
                                        {this.state.referenceHeaderFlag !== "ethereum" &&  this.state.referenceHeaderFlag !== 'usdt'? (
                                            <Flag name={this.state.referenceHeaderFlag} />
                                        ) : this.state.referenceHeaderFlag === "ethereum" ? (
                                            <Icon name={this.state.referenceHeaderFlag} />
                                        ) : (<img style={{paddingTop: 5}} width={20} height={20} src={theter} />)}{' '}
                                        {t("broker.addOfferOption.referencePrices")}
                                    </Header>
                                    {this.state.referencePrices.map(referencePrice => {
                                        return (
                                            <Grid.Row style={{ marginTop: 10 }} key={referencePrice.source}>
                                                {referencePrice.source}{" "}
                                                {referencePrice.ask !== undefined && (
                                                    <Label size="small">
                                                       {t("broker.addOfferOption.buy")}
                            <Label.Detail>
                                                            <NumberFormat
                                                                value={this.floorDecimals(referencePrice.ask, 2)}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                        </Label.Detail>
                                                    </Label>
                                                )}
                                                {referencePrice.bid !== undefined && (
                                                    <Label size="small">
                                                        {t("broker.addOfferOption.sell")}
                            <Label.Detail>
                                                            <NumberFormat
                                                                value={this.floorDecimals(referencePrice.bid, 2)}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                        </Label.Detail>
                                                    </Label>
                                                )}
                                                {referencePrice.toUsd !== undefined && (
                                                    <Label size="small">
                                                        {'1 USD >'}
                            <Label.Detail>
                                                            <NumberFormat
                                                                value={this.state.referenceHeaderFlag !== "ethereum" ? this.floorDecimals(referencePrice.toUsd, 2) : this.floorDecimals(referencePrice.toUsd, 8)}
                                                                decimalScale={2}
                                                                fixedDecimalScale={true}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                        </Label.Detail>
                                                    </Label>
                                                )}
                                            </Grid.Row>
                                        );
                                    })}
                                                  
                                            </Segment>
                                            </Grid.Column>
                                            {this.state.modalTypeToEdit === "dynamic" ?
                                                <Grid.Column largeScreen={8} computer={8}>
                                                <Segment>
                                                  <Header>
                                                    {t("broker.actualOfferTable.modalEdit.limitOffer")}
                                                  </Header>
                                                  <Grid.Row style={{ marginTop: 10 }}>
                                                    {t("broker.addOfferOption.MinPercentMargin")}{" "}
                                                    <Label size="small">
                                                      <Label.Detail>
                                                        <NumberFormat
                                                          value={
                                                            this.state.operationToAdd === "BID"
                                                              ? this.state.marginPercentBid
                                                              : this.state.marginPercentAsk
                                                          }
                                                          decimalScale={2}
                                                          fixedDecimalScale={true}
                                                          displayType={"text"}
                                                          thousandSeparator={true}
                                                          suffix={" " + "%"}
                                                        />
                                                      </Label.Detail>
                                                    </Label>
                                                  {/* </Grid.Row>
                                                  <Grid.Row style={{ marginTop: 10 }}> */}
                                                            {" "}
                                                    {t("broker.addOfferOption.MinPercentSpread")}{" "}
                                                    <Label size="small">
                                                      <Label.Detail>
                                                        <NumberFormat
                                                          value={
                                                            this.state.operationToAdd === "BID"
                                                              ? this.state.spreadPercentsBid
                                                              : this.state.spreadPercentsAsk
                                                          }
                                                          decimalScale={2}
                                                          fixedDecimalScale={true}
                                                          displayType={"text"}
                                                          thousandSeparator={true}
                                                          suffix={" " + "%"}
                                                        />
                                                      </Label.Detail>
                                                    </Label>
                                                        </Grid.Row>
                                                        
                                                        <Grid.Row style={{ marginTop: 10 }}>
                                               {t("broker.addOfferOption.limitPerOperation")}{" "}
                                                 <Label size="small">
                                                   <Label.Detail>
                                                      { this.state.operationToAdd === "BID"?
                                                                                   this.state.limitsBid :
                                                                                   this.state.limitsAsk                           }
                                                   </Label.Detail>
                                                 </Label>
                                               </Grid.Row>
                                                  <Grid.Row style={{ marginTop: 10 }}>
                                                    {this.state.operationToAdd === "BID" ? (
                                                      <div>
                                                        {t("broker.addOfferOption.bidMax")}{" "}
                                                        <Label size="small">
                                                          <Label.Detail>
                                                            <NumberFormat
                                                              value={this.floorDecimals(
                                                                this.state.priceBidMax,
                                                                2
                                                              )}
                                                              decimalScale={2}
                                                              fixedDecimalScale={true}
                                                              displayType={"text"}
                                                              thousandSeparator={true}
                                                            />
                                                          </Label.Detail>
                                                        </Label>
                                                      </div>
                                                    ) : (
                                                      <div>
                                                        {t("broker.addOfferOption.askMin")}{" "}
                                                        <Label size="small">
                                                          <Label.Detail>
                                                            <NumberFormat
                                                              value={this.floorDecimals(
                                                                this.state.priceAskMin,
                                                                2
                                                              )}
                                                              decimalScale={2}
                                                              fixedDecimalScale={true}
                                                              displayType={"text"}
                                                              thousandSeparator={true}
                                                            />
                                                          </Label.Detail>
                                                        </Label>
                                                      </div>
                                                    )}
                                                  </Grid.Row>
                                                </Segment>
                                              </Grid.Column>:
                                             <Grid.Column largeScreen={8} computer={8}>
                                             <Segment style={{paddingBottom:30}}>
                                               <Header>
                                                 {t("broker.actualOfferTable.modalEdit.limitOffer")}
                                               </Header>
                                               <Grid.Row style={{ marginTop: 10 }}>
                                               {t("broker.addOfferOption.limitPerOperation")}{" "}
                                                 <Label size="small">
                                                   <Label.Detail>
                                                      { this.state.operationToAdd === "BID"?
                                                                                   this.state.limitsBid :
                                                                                   this.state.limitsAsk                           }
                                                   </Label.Detail>
                                                 </Label>
                                               </Grid.Row>
                                               <Grid.Row style={{ marginTop: 10 }}>
                                                 {this.state.operationToAdd === "BID" ? (
                                                   <div>
                                                     {t("broker.addOfferOption.bidMax")}{" "}
                                                     <Label size="small">
                                                       <Label.Detail>
                                                         <NumberFormat
                                                           value={this.floorDecimals(
                                                             this.state.priceBidMax,
                                                             2
                                                           )}
                                                           decimalScale={2}
                                                           fixedDecimalScale={true}
                                                           displayType={"text"}
                                                           thousandSeparator={true}
                                                         />
                                                       </Label.Detail>
                                                     </Label>
                                                   </div>
                                                 ) : (
                                                   <div>
                                                     {t("broker.addOfferOption.askMin")}{" "}
                                                     <Label size="small">
                                                       <Label.Detail>
                                                         <NumberFormat
                                                           value={this.floorDecimals(
                                                             this.state.priceAskMin,
                                                             2
                                                           )}
                                                           decimalScale={2}
                                                           fixedDecimalScale={true}
                                                           displayType={"text"}
                                                           thousandSeparator={true}
                                                         />
                                                       </Label.Detail>
                                                     </Label>
                                                   </div>
                                                 )}
                                               </Grid.Row>
                                             </Segment>
                                           </Grid.Column>
                                            }
                                        </Grid.Row>
            </Grid>
            <Divider hidden />
          </div>
                            )}
                            {this.state.currencyToUpdate !== "" && (
                                <p>
                                    {t("broker.actualOfferTable.modalEdit.descriptionEdit1")}
                                    {" "}
                                    <b>{this.state.currencyToUpdate}</b>,  
                                    {t("broker.actualOfferTable.modalEdit.descriptionEdit2")} <b>{this.state.offerTypeToUpdate === "BID" ? t("broker.actualOfferTable.modalEdit.buy"): t("broker.actualOfferTable.modalEdit.sell")}</b>,{t("broker.actualOfferTable.modalEdit.descriptionEdit3")}{" "}                                                        <b>{this.state.paymentIdToUpdate.slice(-4)}</b> 
                                    {t("broker.actualOfferTable.modalEdit.descriptionEdit4")} <b>{this.state.mapPayments.get(this.state.paymentTypeEditToShow)}</b>
                                </p>
                            )}
                            {this.state.modalTypeToEdit === "dynamic" && (
                                <p><strong>{t("broker.actualOfferTable.modalEdit.actualPrice")}{this.state.priceToShow.toLocaleString(
                                    "en-US",
                                    { maximumFractionDigits: 2 }
                                )}</strong></p>)}
                            <p>{t("broker.actualOfferTable.modalEdit.previousValues")}</p>
                            {this.state.currencyToUpdate !== "" && (
                                <Form>
                                    <Form.Group widths="equal">
                                        {this.state.modalTypeToEdit === "static" && (
                                            <Form.Field>
                                                <label>{t("broker.addOfferOption.price")}:{" "}
                                                    <strong>
                                                        {this.state.priceToShow.toLocaleString(
                                                            "en-US",
                                                            { maximumFractionDigits: 2 }
                                                        )}
                                                    </strong>
                                                </label>
                                            </Form.Field>
                                        )}
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.minPerOperation")}:{" "}
                                                <strong>
                                                    {this.state.minPerOperationToShow.toLocaleString(
                                                        "en-US",
                                                        { maximumFractionDigits: 2 }
                                                    )}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.maxPerOperation")}:{" "}
                                                <strong>
                                                    {this.state.maxPerOperationToShow.toLocaleString(
                                                        "en-US",
                                                        { maximumFractionDigits: 2 }
                                                    )}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.totalAccumulated")}:{" "}
                                                <strong>
                                                    {this.state.accumulatedAmountToShow.toLocaleString(
                                                        "en-US",
                                                        { maximumFractionDigits: 2 }
                                                    )}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            )}
                            {this.state.modalTypeToEdit === "dynamic" && (
                                <Form>
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.priceLimit")}:{" "}
                                                <strong>
                                                    {this.state.limitPriceToShow.toLocaleString(
                                                        "en-US",
                                                        { maximumFractionDigits: 2 }
                                                    )}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.marginPercentage")}:{" "}
                                                <strong>
                                                    {this.state.marginPercentToShow.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 4
                                                    }) + " %"}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.propagationPercentage")}:{" "}
                                                <strong>
                                                    {this.state.spreadPercentToShow.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 4
                                                    }) + " %"}
                                                </strong>
                                            </label>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            )}
                            <Form>
                                <Form.Group widths="equal">
                                    {this.state.modalTypeToEdit === "static" && (
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.price")}</label>
                                            <NumberFormat
                                                placeholder={t("broker.addOfferOption.price")}
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                onValueChange={(values) => {
                                                    let { floatValue } = values;
                                                    this.setState({ priceToUpdate: floatValue });
                                                }}
                                                thousandSeparator={true}
                                                suffix={"   " + this.state.currencyToUpdate.toUpperCase() + " / BTC"}
                                                allowNegative={false}
                                            />
                                        </Form.Field>
                                    )}
                                    <Form.Field>
                                        <label>{t("broker.addOfferOption.minPerOperation")}</label>
                                        <NumberFormat
                                            placeholder=
                                            {t("broker.addOfferOption.minPerOperation")}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            onValueChange={values => {
                                                let { value } = values;
                                                this.setState({ minPerOperationToUpdate: parseFloat(value) });
                                            }}
                                            thousandSeparator={true}
                                            suffix={"   " + this.state.currencyToUpdate.toUpperCase()}
                                            allowNegative={false}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>{t("broker.addOfferOption.maxPerOperation")}</label>
                                        <NumberFormat
                                            placeholder=
                                            {t("broker.addOfferOption.maxPerOperation")}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({ maxPerOperationToUpdate: parseFloat(value) });
                                            }}
                                            thousandSeparator={true}
                                            suffix={"   " + this.state.currencyToUpdate.toUpperCase()}
                                            allowNegative={false}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>{t("broker.addOfferOption.totalAccumulated")}</label>
                                        <NumberFormat
                                            placeholder={t("broker.addOfferOption.totalAccumulated")}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            onValueChange={values => {
                                                const { value } = values;
                                                this.setState({ accumulatedAmountToUpdate: parseFloat(value) });
                                            }}
                                            thousandSeparator={true}
                                            suffix={"   " + this.state.currencyToUpdate.toUpperCase()}
                                            allowNegative={false}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                {this.state.modalTypeToEdit === "dynamic" && (
                                    <Form.Group widths="equal">
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.priceLimit")}</label>
                                            <NumberFormat
                                                placeholder={t("broker.addOfferOption.priceLimit")}
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                onValueChange={values => {
                                                    const { value } = values;
                                                    this.setState({ limitPriceToUpdate: parseFloat(value) });
                                                }}
                                                suffix={
                                                    "   " + this.state.currencyToUpdate.toUpperCase() + " / BTC"
                                                }
                                                allowNegative={false}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>{t("broker.addOfferOption.marginPercentage")}</label>
                                            <NumberFormat
                                                placeholder={t("broker.addOfferOption.marginPercentage")}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                onValueChange={values => {
                                                    const { value } = values;
                                                    this.setState({ marginPercentToUpdate: parseFloat(value) });
                                                }}
                                                thousandSeparator={true}
                                                suffix={" %"}
                                                allowNegative={false}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>
                                                {t("broker.addOfferOption.propagationPercentage")}</label>
                                            <NumberFormat
                                                placeholder={t("broker.addOfferOption.propagationPercentage")}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                onValueChange={values => {
                                                    const { value } = values;
                                                    this.setState({ spreadPercentToUpdate: parseFloat(value)});
                                                }}
                                                thousandSeparator={true}
                                                suffix={" %"}
                                                allowNegative={false}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                )}
                            </Form>
                            {messageEditError}
                            {messageEditSuccess}
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeEditOfferModal} color="red">
                            <Icon name="remove" />
                            {t("broker.actualOfferTable.modalEdit.buttonCancel")}
            </Button>
                        <Button onClick={this.selectModalType} color="blue">
                            <Icon name="save" />
                            {t("broker.actualOfferTable.modalEdit.buttonSave")}
            </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }


}
export default translate(ActualOffer);