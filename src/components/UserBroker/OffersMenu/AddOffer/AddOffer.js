import React, { Component } from "react";
import {
    Segment,
    Container,
    Form,
    Button,
    Select,
    Icon,
    Message,
    Flag,
    Dimmer,
    Loader,
    Grid,
    Label,
    Header,
    Divider,
    Dropdown
} from "semantic-ui-react";
import translate from "../../../../i18n/translate";
import config from "../../../../services/config";
import brokerServices from "../../../../services/brokers";
import otc from "../../../../services/otc";
import axios from "axios";
import NumberFormat from "react-number-format";
import _ from "underscore";
import ISOCURRENCIES from "../../../../common/ISO4217";
import theter from '../../../../img/tether-seeklogo.svg';
const URL_BASE_DBTC = config.apiDollarBtcUrl;

class AddOffer extends Component {
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
            currencyToAdd: "",
            operationToAdd: "",
            priceToAdd: "",
            minPerOperationToAdd: "",
            maxPerOperationToAdd: "",
            totalAmountToAdd: "",
            messageError: "",
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
            paymentMethodToAdd: "",
            paymentMethodTypeToAdd: [],
            paymentMethods: [],
            paymentMethodTypes: [],
            loadingPaymentMethods: false,
            loadingPaymentMethodsTypes: false,
            formPaymentMethodKey: Math.random(),
            formPaymentMethodTypeKey: Math.random(),
            paymentMethodsByCurrency: [],
            askBottomLimit: "",
            askTopLimit: "",
            bidBottomLimit: "",
            bidTopLimit: "",
            priceBidMax: "",
            priceAskMin: "",
            limitsAsk: "",
            limitsBid: "",
            viewPrices: false,
        };
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
    getOfferParams(currency) {
        let idToAdd = ""
        brokerServices.getOffersParams(currency).then(resp => {
            let data = resp.data;
            let active = false;
            let acceptIn = false;
            let acceptOut = false;
            if (data.hasOwnProperty("payments")) {
                Object.entries(data).forEach(([key, value]) => {
                    if (key === "payments") {
                        for (let i = 0; i < value.length; i++) {
                            idToAdd = value[i].paymentId;

               otc
                  .getDollarBTCPayment(currency, idToAdd)
                   // eslint-disable-next-line no-loop-func
                   .then(res => {
                    let payMethods = {};
                    let bank = "";
                    let accountHolderName = "";
                    let accountNumber = "";
                      let accountHolderId = "";
                      Object.entries(res.data).forEach(([item, val]) => {
                        
                            if (item === "active") {
                                active = val;
                              }
                              if (item === "acceptIn") {
                                acceptIn = val;
                              }
                              if (item === "acceptOut") {
                                acceptOut = val;
                              }
                              if (item === "bank") {
                                bank = val;
                              }
                              if (item === "accountNumber") {
                                accountNumber = val;
                              }
                              if (item === "accountHolderName") {
                                accountHolderName = val;
                              }
                              if (
                                (this.state.operationToAdd === "ASK" &&
                                  acceptIn &&
                                  active) ||
                                (this.state.operationToAdd === "BID" &&
                                  acceptOut &&
                                  active)
                              ) {
                                payMethods.key = idToAdd;
                                payMethods.value = idToAdd;
                                payMethods.text =
                                  bank !== undefined
                                    ? idToAdd.slice(-4) +
                                      " - " +
                                      bank +
                                      " - " +
                                      accountHolderName +
                                      " - " +
                                      accountNumber +
                                      this.validateData(accountHolderId)
                                        : idToAdd.slice(-4);
                                        const result = this.state.paymentMethods.find( element=>{
                                            return element.key===idToAdd
                                        });
                                          if (result === undefined) {
                                            this.setState({
                                                  paymentMethods: [...this.state.paymentMethods,payMethods],viewPrices: true}
                                            );
                                          }
                              } else {
                                this.setState({
                                    viewPrices: false, 
                                    messageError:
                                        "broker.addOfferOption.messages.errorPaymentMethod"
                                });
                                setTimeout(() => {
                                    this.setState({
                                        messageError: ""
                                    });
                                }, 5000);
                            }
                          
                      
                      });
                      
                   
                  })
                  .catch(error => {});
                            Object.entries(value[i]).forEach(([k, v]) => {
                                let paymentType = {}
                                if (k === "paymentType") {
                                    paymentType.key = v;
                                    paymentType.value = v;
                                    paymentType.text = this.state.mapPayments.get(v)
                                    this.setState({ paymentMethodTypes: [...this.state.paymentMethodTypes, paymentType] })
                                }
                            })
                        }
                     
                    }
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
                })
               
            } else {
                this.setState({
                    viewPrices: false, 
                    messageError:
                        "broker.addOfferOption.messages.errorPaymentMethod"
                });
                setTimeout(() => {
                    this.setState({
                        messageError: ""
                    });
                }, 5000);
            }
        }).catch(error => {
            
        })
    }

    pickCurrency = (e, data) => {
        this.setState(
            {
                currencyToAdd: data.value,
                paymentMethodToAdd: "",
                priceToAdd: "",
            minPerOperationToAdd: "",
            maxPerOperationToAdd: "",
            totalAmountToAdd: "",
                paymentMethodTypes: [],
                paymentMethods:[],
                paymentMethodTypeToAdd: [],
                formPaymentMethodKey: Math.random(),
                formPaymentMethodTypeKey: Math.random()
            },
            () => {
                this.getReferencePrice(data.value);
                this.getOfferParams(data.value);
            }
        );
    };
    pickPaymentMethod = (e, data) => {
        this.setState({ paymentMethodToAdd: data.value });
    };
    pickPaymentMethodType = (e, data) => {
        this.setState({ paymentMethodTypeToAdd: data.value });
    };
    pickOperation = (e, data) => {
        this.setState({
            operationToAdd: data.value,
            paymentMethodToAdd: "",
            priceToAdd: "",
            minPerOperationToAdd: "",
            maxPerOperationToAdd: "",
            totalAmountToAdd: "",
            paymentMethods: [],
            paymentMethodTypes:[],
            paymentMethodTypeToAdd: [],
            formPaymentMethodKey: Math.random(),
            formPaymentMethodTypeKey: Math.random()
        });
    };

    handleMinAmountPerOperation = e => {
        this.setState({
            minPerOperationToAdd: Number(e.target.value.split(" ")[0])
        });
    };
    handleMaxAmountPerOperation = e => {
        this.setState({
            maxPerOperationToAdd: Number(e.target.value.split(" ")[0])
        });
    };
    handleTotalAmount = e => {
        this.setState({ totalAmountToAdd: Number(e.target.value.split(" ")[0]) });
    };

    validateData(value){
        if (value !== undefined) {
            return "-" + value;
        } else {
            return " "
        }
    }
    getConfig = () => {
       this.setState({ showAdd: false });
        let currency = otc.getCurrencies();
        currency
            .then(resp => {
                console.log('hi ');
                let currencies = resp.data;
                let selectCurrencies = [];
                let currencyCurrent = {};
                for (let i = 0; i < currencies.length; i++) {
                    let currencyToAddSelect = {};
                    let countryCoin = currencies[i].shortName.split("_");
                    currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
                        if (countryCoin.length > 1)
                            return c.flag === countryCoin[0].toLowerCase();
                        else return c.key === countryCoin[0]
                    })[0];
                    if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
                        currencyToAddSelect.flag = currencyCurrent.flag;
                    } else if(currencies[i].shortName === "ETH"){
                        currencyToAddSelect.icon =  "ethereum";
                    } else if(currencies[i].shortName === "USDT"){
                         currencyToAddSelect.image =  { avatar: true, src: theter };
                    };
                    currencyToAddSelect.key = currencies[i].shortName;
                    currencyToAddSelect.value = currencies[i].shortName;
                    currencyToAddSelect.text = currencies[i].fullName;
                    selectCurrencies.push(currencyToAddSelect);
                }
                //console.log('selectCurrencies ', selectCurrencies);
                this.setState({ currenciesToAdd: selectCurrencies, showAdd: true });
            })
            .catch(error => {
                //console.log(error);
            });
    };
    componentWillMount() {
        this.getConfig();
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
                        var flag = "";
                        let currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter(c => {
                            if (countryCoin.length > 1)
                                return c.flag === countryPrefix.toLowerCase();
                            else return c.key === symbol
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
            .catch(error => {
                //console.log(error);
            });
    };
    addConfig = () => {
       
        if (
            this.state.priceToAdd !== "" &&
            this.state.minPerOperationToAdd !== "" &&
            this.state.maxPerOperationToAdd !== "" &&
            this.state.totalAmountToAdd !== "" &&
            this.state.paymentMethodToAdd !== "" &&
            this.state.paymentMethodTypeToAdd !== []
        ) {
            if (this.state.operationToAdd === "ASK") {
                if (this.state.minPerOperationToAdd >= this.state.askBottomLimit &&
                    this.state.maxPerOperationToAdd <= this.state.totalAmountToAdd &&
                    this.state.totalAmountToAdd <= this.state.askTopLimit &&
                    this.state.maxPerOperationToAdd <= this.state.askTopLimit) {
                    if (this.state.priceToAdd >= this.state.priceAskMin) {
                        this.setState({ addLoad: true });
                        for (var i = 0; i < this.state.paymentMethodTypeToAdd.length; i++) {
                          var body = {
                            userName: sessionStorage.getItem("username"),
                            currency: this.state.currencyToAdd,
                            paymentId: this.state.paymentMethodToAdd,
                            price: this.state.priceToAdd,
                            minPerOperationAmount: this.state.minPerOperationToAdd,
                            maxPerOperationAmount: this.state.maxPerOperationToAdd,
                            totalAmount: this.state.totalAmountToAdd,
                            offerType: this.state.operationToAdd,
                            paymentType: this.state.paymentMethodTypeToAdd[i],
                          };
                          brokerServices
                             .createStaticOffer(body)
                                // eslint-disable-next-line no-loop-func
                                .then(res => {
                                    if (res.data === "OK") {
                                        if (i === this.state.paymentMethodTypeToAdd.length) {
                                            this.setState(
                                                {
                                                    messageSuccess: true,
                                                    currencyToAdd: "",
                                                    operationToAdd: "",
                                                    priceToAdd: "",
                                                    minPerOperationToAdd: "",
                                                    maxPerOperationToAdd: "",
                                                    totalAmountToAdd: "",
                                                    paymentMethods: [],
                                                    paymentMethodTypes: [],
                                                    referencePrices: []
                                                },
                                                function () {
                                                    this.setState({ addLoad: false });
                                                    setTimeout(() => {
                                                        this.setState({
                                                            messageSuccess: false
                                                        });
                                                    }, 7000);
                                                }
                                            );
                                        }
                            
                        }
                        
                    })
                    .catch(error => {
                        this.setState({ addLoad: false });
                        this.setState({
                            messageError:
                                "broker.addOfferOption.messages.errorOperation"
                        });
                        setTimeout(() => {
                            this.setState({
                                messageError: ""
                            });
                        }, 5000);
                    });
            
                        }
                        
                    } else {
                        this.setState({
                            messageError:
                                "broker.addOfferOption.messages.limitPriceAsk"
                        });
                        setTimeout(() => {
                            this.setState({
                              messageError: ""
                            });
                          }, 5000);
                    }
                    
                } else {
                    this.setState({
                        messageError:
                            "broker.addOfferOption.messages.limitExceded"
                    });
                    setTimeout(() => {
                        this.setState({
                          messageError: ""
                        });
                      }, 5000);
                }
                
            } else {
                if (this.state.minPerOperationToAdd >= this.state.bidBottomLimit &&
                this.state.totalAmountToAdd <= this.state.bidTopLimit &&
                this.state.maxPerOperationToAdd <= this.state.bidTopLimit &&
                this.state.maxPerOperationToAdd <= this.state.totalAmountToAdd) {
                    if (this.state.priceToAdd <= this.state.priceBidMax) {
                        this.setState({ addLoad: true });
                    for (var i = 0; i < this.state.paymentMethodTypeToAdd.length; i++) {
                      var body = {
                        userName: sessionStorage.getItem("username"),
                        currency: this.state.currencyToAdd,
                        paymentId: this.state.paymentMethodToAdd,
                        price: this.state.priceToAdd,
                        minPerOperationAmount: this.state.minPerOperationToAdd,
                        maxPerOperationAmount: this.state.maxPerOperationToAdd,
                        totalAmount: this.state.totalAmountToAdd,
                        offerType: this.state.operationToAdd,
                        paymentType: this.state.paymentMethodTypeToAdd[i],
                      };
                        
                      brokerServices.createStaticOffer(body)
                                  .then(res => {
                                      if (res.data === "OK") {
                                          if (i === this.state.paymentMethodTypeToAdd.length) {
                                              this.setState(
                                                  {
                                                      messageSuccess: true,
                                                      currencyToAdd: "",
                                                      operationToAdd: "",
                                                      priceToAdd: "",
                                                      minPerOperationToAdd: "",
                                                      maxPerOperationToAdd: "",
                                                      totalAmountToAdd: "",
                                                      paymentMethods: [],
                                                      paymentMethodTypes: [],
                                                      referencePrices: []
                                                  },
                                                  function () {
                                                      this.setState({ addLoad: false });
                                                      setTimeout(() => {
                                                          this.setState({
                                                              messageSuccess: false
                                                          });
                                                      }, 7000);
                                                  }
                                              );
                                          }
                              
                          }
                          
                      })
                      .catch(error => {
                          this.setState({ addLoad: false });
                          this.setState({
                              messageError:
                                  "broker.addOfferOption.messages.errorOperation"
                          });
                          setTimeout(() => {
                              this.setState({
                                  messageError: ""
                              });
                          }, 5000);
                      });
                    }
                    
                } else {
                        this.setState({
                            addLoad: false,
                        messageError:
                            "broker.addOfferOption.messages.limitPriceAsk"
                        });
                        setTimeout(() => {
                            this.setState({
                              messageError: ""
                            });
                          }, 5000);
                }
              } else {
                    this.setState({
                        addLoad: false,
                    messageError:
                        "broker.addOfferOption.messages.limitExceded"
                    });
                    setTimeout(() => {
                        this.setState({
                          messageError: ""
                        });
                      }, 5000);
            }
            }
                
        } else {
            this.setState({ addLoad: false });
            this.setState({
                messageError:
                    "broker.addOfferOption.messages.incompleteInfo"
            });
            setTimeout(() => {
                this.setState({
                    messageError: ""
                });
            }, 5000);
        }
    };
    floorDecimals = (value, numberDecimals) => {
        let decimales = Math.pow(10, numberDecimals);
        return Math.floor(value * decimales) / decimales;
    };
    render() {
        let t = this.state.translator;
        let messageAddError, messageAddSuccess;
        if (this.state.messageError !== "") {
            messageAddError = (
                <Message negative>
                    <Message.Header>Error</Message.Header>
                    <p>{t(this.state.messageError)}</p>
                </Message>
            );
        }
        if (this.state.messageSuccess) {
            messageAddSuccess = (
                <Message positive>
                    <Message.Header>{t("broker.addOfferOption.messages.addOffer")}</Message.Header>
                    <p>{t("broker.addOfferOption.messages.alertAddOffer")}</p>
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
                {this.state.referencePrices.length > 0 && this.state.viewPrices &&  (
                    <div>
                    <Grid columns={2}>
                      <Grid.Row>
                        <Grid.Column largeScreen={8} computer={8}>
                                    <Segment loading={!this.state.showReferencePrices}
                                        style={{ paddingBottom: 15 }}>
                        <Header>
                            {this.state.referenceHeaderFlag !== "ethereum" &&  this.state.referenceHeaderFlag !== 'usdt' ? (
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
                                    {referencePrice.bid !== undefined && (
                                        <Label>
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
                                        <Label>
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
                                        <Label>
                                            1 USD 
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
                                <Grid.Column largeScreen={8} computer={8}>
                  <Segment>
                    <Header>
                      {t("broker.actualOfferTable.modalEdit.limitOffer")}
                    </Header>
                    <Grid.Row style={{ marginTop: 10 }}>
                    {t("broker.addOfferOption.limitPerOperation")}{" "}
                      <Label>
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
                          <Label>
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
                          <Label>
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
              </Grid.Row>
            </Grid>
            <Divider hidden />
          </div>
                )}
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>{t("broker.addOfferOption.typeOperation")}</label>
                        <Select
                            placeholder={t("broker.addOfferOption.selectType")}
                            options={[
                                {
                                    key: "BID",
                                    value: "BID",
                                    text: t("broker.addOfferOption.buy")
                                },
                                {
                                    key: "ASK",
                                    value: "ASK",
                                    text: t("broker.addOfferOption.sell")
                                    
                                }
                            ]}
                            onChange={this.pickOperation}
                            value={this.state.operationToAdd}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>{t("broker.addOfferOption.currency")}</label>
                        {this.state.currenciesToAdd !== [] ? (
                            <Dropdown
                                fluid
                                placeholder={t("broker.addOfferOption.selectCurrency")}
                                options={this.state.currenciesToAdd}
                                onChange={this.pickCurrency}
                                value={this.state.currencyToAdd}
                            />
                        ) : null}
                    </Form.Field>
                    <Form.Field key={this.state.formPaymentMethodKey}>
                        <label>{t("broker.addOfferOption.paymentMethod")}</label>
                        {this.state.currenciesToAdd !== [] ? (
                            <Select
                                loading={this.state.loadingPaymentMethods}
                                disabled={this.state.paymentMethods.length === 0}
                                placeholder={t("broker.addOfferOption.selectPaymentMethod")}
                                options={this.state.paymentMethods}
                                onChange={this.pickPaymentMethod}
                                value={this.state.paymentMethodToAdd}
                            />
                        ) : null}
                    </Form.Field>
                    <Form.Field key={this.state.formPaymentMethodTypeKey}>
                        <label>{t("broker.addOfferOption.typeOfPayment")}</label>
                        {this.state.currenciesToAdd !== [] ? (
                            <Select
                                loading={this.state.loadingPaymentMethodsTypes}
                                disabled={
                                    this.state.paymentMethodTypes.length === 0 || this.state.paymentMethods.length===0
                                }
                                multiple
                                placeholder={t("broker.addOfferOption.selectTypeOfPayment")}
                                options={this.state.paymentMethodTypes}
                                onChange={this.pickPaymentMethodType}
                                value={this.state.paymentMethodTypeToAdd}
                            />
                        ) : null}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>{t("broker.addOfferOption.price")}</label>
                        {this.state.currencyToAdd !== "" ? (
                            <NumberFormat
                                value={this.state.priceToAdd}
                                placeholder={t("broker.addOfferOption.price")}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({ priceToAdd: parseFloat(value) });
                                    
                                }}
                                suffix={
                                    "   " + this.state.currencyToAdd.toUpperCase() + " / BTC"
                                }
                            />
                        ) : (
                                <NumberFormat
                                value={this.state.priceToAdd}
                                    placeholder={t("broker.addOfferOption.price")}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={values => {
                                        const { value } = values;
                                        this.setState({ priceToAdd: parseFloat(value) });
                                    }}
                                />
                            )}
                    </Form.Field>
                    <Form.Field>
                        <label>{t("broker.addOfferOption.minPerOperation")}</label>
                        {this.state.currencyToAdd !== "" ? (
                            <NumberFormat
                            value={this.state.minPerOperationToAdd}
                                placeholder={t("broker.addOfferOption.minPerOperation")}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({ minPerOperationToAdd: parseFloat(value) });
                                }}
                                thousandSeparator={true}
                                suffix={"   " + this.state.currencyToAdd.toUpperCase()}
                            />
                        ) : (
                                <NumberFormat
                                value={this.state.minPerOperationToAdd}
                                    placeholder={t("broker.addOfferOption.minPerOperation")}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={values => {
                                        const { value } = values;
                                        this.setState({ minPerOperationToAdd: parseFloat(value) });
                                    }}
                                    thousandSeparator={true}
                                />
                            )}
                    </Form.Field>
                    <Form.Field>
                        <label>{t("broker.addOfferOption.maxPerOperation")}</label>
                        {this.state.currencyToAdd !== "" ? (
                            <NumberFormat
                            value={this.state.maxPerOperationToAdd}
                                placeholder={t("broker.addOfferOption.maxPerOperation")}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({ maxPerOperationToAdd: parseFloat(value) });
                                }}
                                thousandSeparator={true}
                                suffix={"   " + this.state.currencyToAdd.toUpperCase()}
                            />
                        ) : (
                                <NumberFormat
                                value={this.state.maxPerOperationToAdd}
                                    placeholder={t("broker.addOfferOption.maxPerOperation")}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={values => {
                                        const { value } = values;
                                        this.setState({ maxPerOperationToAdd: parseFloat(value) });
                                    }}
                                    thousandSeparator={true}
                                />
                            )}
                    </Form.Field>
                    <Form.Field>
                        <label>{t("broker.addOfferOption.totalAccumulated")}</label>
                        {this.state.currencyToAdd !== "" ? (
                            <NumberFormat
                                value={this.state.totalAmountToAdd}
                                placeholder={t("broker.addOfferOption.totalAccumulated")}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                onValueChange={values => {
                                    const { value } = values;
                                    this.setState({ totalAmountToAdd: parseFloat(value) });
                                }}
                                thousandSeparator={true}
                                suffix={"   " + this.state.currencyToAdd.toUpperCase()}
                            />
                        ) : (
                                <NumberFormat
                                value={this.state.totalAmountToAdd}
                                    placeholder={t("broker.addOfferOption.totalAccumulated")}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={values => {
                                        const { value } = values;
                                        this.setState({ totalAmountToAdd: parseFloat(value) });
                                    }}
                                    thousandSeparator={true}
                                />
                            )}
                    </Form.Field>
                </Form.Group>
                <Container textAlign="right">
                    <Button
                        onClick={this.addConfig}
                        icon
                        labelPosition="left"
                        color="blue"
                        type="submit"
                    >
                        <Icon name="add" />
                        {t("broker.addOfferOption.add")}
          </Button>
                </Container>
            </Form>
        );
    }
}
export default translate(AddOffer);