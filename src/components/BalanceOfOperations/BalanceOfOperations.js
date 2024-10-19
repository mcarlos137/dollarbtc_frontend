import React, { Component, PureComponent } from "react";
import otcService from "../../services/otc";
import userService from "../../services/user";
import iso from "../../common/ISO4217";
import {
  Form,
  Segment,
  Grid,
  Header,
  Icon,
  Dropdown,
  Divider,
  Popup,
  Message,
} from "semantic-ui-react";
import Gauge from "react-canvas-gauge";
import Sockette from "sockette";
import config from "../../services/config";
import usda from "../../services/usda";
import BalanceCompromise from "../BalanceCompromise/BalanceCompromise";
import NumberFormat from "react-number-format";
import moment from "moment";
import uuid from "uuid";
import "./BalanceOfOperations.css";
import theter from '../../img/tether-seeklogo.svg'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
const URL_WEBSOCKET_DBTC = config.webSocketsDBTC;
class CustomizedLabel extends PureComponent {
  constructor(props) {
    super(props);
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  render() {
    const { x, y, stroke, value, font } = this.props;
    let valueSet;
    if (this.props.font === "Fiat") {
      valueSet = this.floorDecimals(value, 4);
    } else {
      valueSet = this.floorDecimals(value, 8);
    }

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={8} textAnchor="middle">
        {valueSet.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}
      </text>
    );
  }
}
class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          transform="rotate(-15)"
          style={{ fontSize: 10 }}
        >
          {moment(payload.value).format("DD/MM/YYYY HH:mm:ss")}
        </text>
      </g>
    );
  }
}
class CustomizedAxisYTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} fill="#666" textAnchor="end" style={{ fontSize: 12 }}>
          {payload.value.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </text>
      </g>
    );
  }
}
class CustomizedAxisYBTCTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} fill="#666" textAnchor="end" style={{ fontSize: 12 }}>
          {payload.value}
        </text>
      </g>
    );
  }
}
class BalanceOfOperations extends Component {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/5br7g9d6/";
  constructor(props) {
    super(props);
    this.state = {
      selectedBalance: "",
      selectedCurrency: [],
      availableCurrency: [],
      listCurrencys: [],
      load: false,
      socket: null,
      socketsGrafic: null,
      showMessage: false,
      message: "",
      color: "",
      topBuyChangePercent: "",
      bottomBuyChangePercent: "",
      topSellChangePercent: "",
      bottomSellChangePercent: "",
    };
    this.timer = null;
    this._isMounted = false;
    this.getBalanceForCurrency = this.getBalanceForCurrency.bind(this);
    this.handleValueSocket = this.handleValueSocket.bind(this);
    this.handleChangeValueGraficSocket = this.handleChangeValueGraficSocket.bind(
      this
    );
    this.handleChangeDifusinFactor = this.handleChangeDifusinFactor.bind(this);
    this.handleChangePorcentVariation = this.handleChangePorcentVariation.bind(
      this
    );
  }
  componentDidMount() {
    this.setState({ load: true });
    this.getAvailableCurrency();
    //  this.getParamsUSDA();
  }
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
  getAvailableCurrency() {
    this._isMounted = true;
    otcService.getAdminCurrencies(userService.getUserName()).then(
      (resp) => {
        for (let currency of resp.data) {
          let findCurrency = iso.ISOCURRENCIES.find(function (element) {
            return element.key == currency.shortName;
          });
          if (findCurrency !== undefined){
          if(findCurrency.key === "ETH") {
            findCurrency.icon = "ethereum";
          } else if(findCurrency.key === "USDT") {
            findCurrency.image =  { avatar: true, size: 'mini',src: theter };
          }
          findCurrency.text = currency.fullName;
           this.setState({
              availableCurrency: [
                ...this.state.availableCurrency,
                findCurrency,
              ],
            });
        }

         
        }
        this.initSoket();
        this.initSoketGrafic();
        this.setState({ load: false });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getParamsUSDA() {
    usda
      .getParamsUsda()
      .then((resp) => {
        let params = resp.data;
        this.setState({
          topBuyChangePercent: params.topBuyChangePercent,
          bottomBuyChangePercent: params.bottomBuyChangePercent,
          topSellChangePercent: params.topSellChangePercent,
          bottomSellChangePercent: params.bottomSellChangePercent,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChangeTopBuyChangePercent(value) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }
    this.setState({ topBuyChangePercent: val });
  }
  handleChangeBottomBuyChangePercent(value) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }
    this.setState({ bottomBuyChangePercent: val });
  }
  handleTopSellChangePercent(value) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }
    this.setState({ topSellChangePercent: val });
  }
  handleBottomSellChangePercent(value) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }
    this.setState({ bottomSellChangePercent: val });
  }
  updateParamsUSDA() {
    if (
      this.state.topSellChangePercent > this.state.bottomSellChangePercent &&
      this.state.topBuyChangePercent > this.state.bottomBuyChangePercent
    ) {
      let params = {
        topBuyChangePercent: this.state.topBuyChangePercent,
        bottomBuyChangePercent: this.state.bottomBuyChangePercent,
        topSellChangePercent: this.state.topSellChangePercent,
        bottomSellChangePercent: this.state.bottomSellChangePercent,
      };
      this.setState({ load: true });
      usda
        .editParamsUsda(params)
        .then((resp) => {
          if (resp.data === "OK") {
            this.setState({ load: false });
            this.setState({
              message: "El % de cambio ha sido actualizado exitosamente",
              showMessage: true,
              color: "green",
            });
            this.timer = setTimeout(() => {
              this.setState({ message: "", showMessage: false, color: "" });
            }, 5000);
          } else {
            this.setState({
              message: "Disculpe no se ha podido realizar el cambio requerido",
              showMessage: true,
              color: "red",
            });
            this.timer = setTimeout(() => {
              this.setState({ message: "", showMessage: false, color: "" });
            }, 5000);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ load: false });
          this.setState({
            message: "Disculpe ha ocurrido un error intente más tarde",
            showMessage: true,
            color: "red",
          });
          this.timer = setTimeout(() => {
            this.setState({ message: "", showMessage: false, color: "" });
          }, 5000);
        });
    } else {
      this.setState({
        message:
          "El porcentaje máximo debe ser mayor al porcentaje mínimo de cambio",
        showMessage: true,
        color: "red",
      });
      this.timer = setTimeout(() => {
        this.setState({ message: "", showMessage: false, color: "" });
      }, 5000);
    }
  }
  handleChange(e, { value }) {
    this.setState({ selectedCurrency: value }, () => {
      this.addCurrency(this.state.selectedCurrency);
    });
  }

  handleChange2(e, { value }) {
    this.setState({ selectedBalance: value });
  }

  handleChangeMethods(e, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.method = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  renderLabelDrop(value) {
    return value;
  }
  async addCurrency(currencys) {
    let datanew = [];
    for (let currency of currencys) {
      let findCurrency = this.state.listCurrencys.find(function (element) {
        return element.key === currency.split("_")[0];
      });
      let dataCurrency = {
        key: currency.split("_")[0],
        sell: "",
        buy: "",
        average: "",
        oferValue: 0,
        disabled: false,
        spreatFactor: 0,
        porcentVariation: 0,
        lastOperationValue: 0,
        lastOperationType: "",
        balanceAmount: 0,
        periodStatistic: "4",
        periodStatisticTime: "H",
        btcGraficData: [],
        currencyGraficData: [],
        periodStatisticTimeOfert: "",
        periodStatisticOfert: "",
        timeBand: "4",
        timeBandBase: "H",
        amountBandGrafic: 0,
        method: "",
      };
      if (findCurrency !== undefined) {
        dataCurrency.sell = findCurrency.sell;
        dataCurrency.buy = findCurrency.buy;
        dataCurrency.average = findCurrency.average;
        dataCurrency.oferValue = findCurrency.oferValue;
        dataCurrency.disabled = findCurrency.disabled;
        dataCurrency.spreatFactor = findCurrency.spreatFactor;
        dataCurrency.porcentVariation = findCurrency.porcentVariation;
        dataCurrency.lastOperationValue = findCurrency.lastOperationValue;
        dataCurrency.lastOperationType = findCurrency.lastOperationType;
        dataCurrency.balanceAmount = findCurrency.balanceAmount;
        dataCurrency.periodStatistic = findCurrency.periodStatistic;
        dataCurrency.periodStatisticTime = findCurrency.periodStatisticTime;
        dataCurrency.btcGraficData = findCurrency.btcGraficData;
        dataCurrency.currencyGraficData = findCurrency.currencyGraficData;
        dataCurrency.periodStatisticTimeOfert =
          findCurrency.periodStatisticTimeOfert;
        dataCurrency.amountBandGrafic = findCurrency.amountBandGrafic;
        dataCurrency.timeBand = findCurrency.timeBand;
        dataCurrency.timeBandBase = findCurrency.timeBandBase;
        dataCurrency.method = findCurrency.method;
      }
      datanew.push(dataCurrency);
    }
    //console.log(datanew);
    this.setState({ listCurrencys: datanew }, async () => {
      for (let curren of this.state.listCurrencys) {
        await this.getBalanceOperationsParams(curren.key);
      }
    });
  }
  getBalanceForCurrency(currency) {
    this.setState(
      (state) => {
        const listCurrencys = state.listCurrencys.map((element) => {
          if (element.key === currency.key) {
            element.disabled = true;
            return element;
          } else {
            return element;
          }
        });
        return { listCurrencys };
      },
      () => {
        this.sendMessages(currency.key, currency.oferValue);
      }
    );
  }
  getBalanceForCurrencyForTime(currency) {
    this.setState(
      (state) => {
        const listCurrencys = state.listCurrencys.map((element) => {
          if (element.key === currency.key) {
            element.disabled = true;
            return element;
          } else {
            return element;
          }
        });
        return { listCurrencys };
      },
      () => {
        this.sendMessagesTime(
          currency.key,
          currency.timeBand,
          currency.timeBandBase
        );
      }
    );
  }
  async getBalanceOperationsParams(currency) {
    this.setState({ load: true });
    try {
      const response = await otcService.getOperationParams(currency);
      this.setState({ load: false });
      Object.entries(response.data).forEach(([key, value]) => {
        if (key === "maxSpreadPercent") {
          this.handleChangeDifusinFactorRest(value, currency);
        } else if (key === "changePercent") {
          this.handleChangePorcentVariationRest(value, currency);
        }
      });
    } catch (error) {
      this.setState({ load: false });
      console.log(error);
    }
  }
  getLiquidityAndVolume(currency) {
    let findCurrency = this.state.listCurrencys.find(function (element) {
      return element.key === currency;
    });
    if (findCurrency !== undefined) {
      this.sendMessagesGrafic(
        findCurrency.key,
        findCurrency.periodStatistic + findCurrency.periodStatisticTime,
        findCurrency.oferValue
      );
    }
  }
  getLiquidityAndVolumeWithTime(currency, timeBand, timeBandBase) {
    let findCurrency = this.state.listCurrencys.find(function (element) {
      return element.key === currency;
    });
    if (findCurrency !== undefined) {
      this.sendMessagesGraficWithTime(
        findCurrency.key,
        findCurrency.periodStatistic + findCurrency.periodStatisticTime,
        timeBand,
        timeBandBase
      );
    }
  }
  initSoketGrafic() {
    if (this._isMounted) {
      this.setState({
        socketsGrafic: new Sockette(URL_WEBSOCKET_DBTC + "/otcAdmin", {
          onopen: (e) => this.socketReady(e),
          onmessage: (e) => this.handleChangeValueGraficSocket(e.data),
        }),
      });
    }
  }
  initSoket() {
    if (this._isMounted) {
      this.setState({
        socket: new Sockette(URL_WEBSOCKET_DBTC + "/otcAdmin", {
          onopen: (e) => this.socketReady(e),
          onmessage: (e) => this.handleValueSocket(e.data),
        }),
      });
    }
  }
  sendMessages(currency, amount) {
    let men = {
      method: "getOperationBalance",
      params: {
        websocketKey: uuid.v4(),
        currency: currency,
        amountBand: amount,
      },
    };
    if (this.state.socket !== null && this.state.socketReady === true) {
      try {
        this.state.socket.json(men);
      } catch (e) {
        console.log(e);
      }
    }
  }
  sendMessagesTime(currency, timeBa, timeBandB) {
    let time = Number(timeBa);
    let men = {
      method: "getOperationBalance",
      params: {
        websocketKey: uuid.v4(),
        currency: currency,
        timeBand: time,
        timeBandBase: timeBandB,
      },
    };
    console.log(men);
    if (this.state.socket !== null && this.state.socketReady === true) {
      try {
        this.state.socket.json(men);
      } catch (e) {
        console.log(e);
      }
    }
  }
  sendMessagesGrafic(currency, period, amount) {
    let men = {
      method: "getOperationLiquidityAndVolume",
      params: {
        websocketKey: uuid.v4(),
        currency: currency,
        period: period,
        amountBand: amount,
      },
    };
    if (this.state.socketsGrafic !== null && this.state.socketReady === true) {
      try {
        this.state.socketsGrafic.json(men);
      } catch (e) {
        console.log(e);
      }
    }
  }
  sendMessagesGraficWithTime(currency, period, timeBan, timeBandB) {
    let time = Number(timeBan);
    let men = {
      method: "getOperationLiquidityAndVolume",
      params: {
        websocketKey: uuid.v4(),
        currency: currency,
        period: period,
        timeBand: time,
        timeBandBase: timeBandB,
      },
    };
    console.log(men);
    if (this.state.socketsGrafic !== null && this.state.socketReady === true) {
      try {
        this.state.socketsGrafic.json(men);
      } catch (e) {
        console.log(e);
      }
    }
  }
  socketReady(e) {
    this.setState({ socketReady: true });
  }
  handleChangePorcentVariationRest(value, currency) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }

    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.porcentVariation = val;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangeDifusinFactorRest(value, currency) {
    let val;
    if (isNaN(value)) {
      val = "";
    } else {
      val = value;
    }

    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.spreatFactor = val;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangePorcentVariation(e, data) {
    // let val;
    // if (isNaN(value)) {
    //   val = 0;
    // } else {
    //   val = value;
    // }
    console.log(data);
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.porcentVariation = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangeDifusinFactor(e, data) {
    // let val;
    // if (isNaN(value)) {
    //   val = 0;
    // } else {
    //   val = value;
    // }
    console.log(data);
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.spreatFactor = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangeValueGraficSocket(value) {
    let data = JSON.parse(value);
    console.log(data);
    let graficData = [];
    let btcGraficData = [];
    let arrayLiquidity = [];
    let arrayVolume = [];
    let arrayBtcLiquidity = [];
    let arrayBtcVolumen = [];
    let currency = data.params.currency;
    let keys = Object.keys(data.params.data);
    if (keys.length > 0) {
      Object.entries(data.params.data).forEach(([key, value]) => {
        if (key === "liquidity") {
          Object.entries(value).forEach(([keyLiquidity, valueLiquidity]) => {
            let objLiquid = {
              date: keyLiquidity,
              liquid: valueLiquidity,
            };
            arrayLiquidity.push(objLiquid);
          });
        } else if (key === "volume") {
          Object.entries(value).forEach(([keyVolume, valueVolume]) => {
            let objVolume = {
              date: keyVolume,
              volume: valueVolume,
            };
            arrayVolume.push(objVolume);
          });
        } else if (key === "btcLiquidity") {
          Object.entries(value).forEach(
            ([keybtcLiquidity, valuebtcLiquidity]) => {
              let obDataBtc = {
                date: keybtcLiquidity,
                liquid: valuebtcLiquidity,
              };
              arrayBtcLiquidity.push(obDataBtc);
            }
          );
        } else if (key === "btcVolume") {
          Object.entries(value).forEach(([keybtcVolumen, valuebtcVolumen]) => {
            let obDataBtcVolum = {
              date: keybtcVolumen,
              volume: valuebtcVolumen,
            };
            arrayBtcVolumen.push(obDataBtcVolum);
          });
        }
      });
      for (let item of arrayLiquidity) {
        let findVolumeData = arrayVolume.find(function (element) {
          return element.date === item.date;
        });
        //  console.log(findVolumeData);
        if (findVolumeData !== undefined) {
          let obData = {
            date: moment(item.date).valueOf(),
            liquid: item.liquid,
            volume: findVolumeData.volume,
          };
          graficData.push(obData);
        }
      }
      for (let item of arrayBtcLiquidity) {
        let findVolumeData = arrayBtcVolumen.find(function (element) {
          return element.date === item.date;
        });
        // console.log(findVolumeData);
        if (findVolumeData !== undefined) {
          let obDataBtc = {
            date: moment(item.date).valueOf(),
            liquid: item.liquid,
            volume: findVolumeData.volume,
          };
          btcGraficData.push(obDataBtc);
        }
      }
      this.hadleValueLiquidyAndVolum(currency, graficData, btcGraficData);
    }
  }
  hadleValueLiquidyAndVolum(currency, data, dataBTC) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.btcGraficData = dataBTC;
          element.currencyGraficData = data;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleValueSocket(value) {
    let data = JSON.parse(value);
    console.log(data);
    let keys = Object.keys(data.params.data);
    if (keys.length > 0) {
      this.setState((state) => {
        const listCurrencys = state.listCurrencys.map((element) => {
          if (element.key === data.params.currency) {
            element.sell =
              data.params.data.lastSellPrice !== undefined &&
              data.params.data.lastSellPrice !== 0
                ? data.params.data.lastSellPrice
                : data.params.data.bidPrice;
            element.buy =
              data.params.data.lastBuyPrice !== undefined &&
              data.params.data.lastBuyPrice !== 0
                ? data.params.data.lastBuyPrice
                : data.params.data.askPrice;
            element.average =
              Math.round(
                data.params.data.bandBalancePercent * Math.pow(10, 2)
              ) / Math.pow(10, 2);
            element.lastOperationValue = this.defineLastOperationValue(
              data.params.data.askPrice,
              data.params.data.bidPrice,
              data.params.data.lastBuyPrice,
              data.params.data.lastSellPrice,
              data.params.data.lastOTCOperationType
            );
            element.lastOperationType = data.params.data.lastOTCOperationType;
            element.balanceAmount = data.params.data.balanceAmount;
            return element;
          } else {
            return element;
          }
        });
        return { listCurrencys };
      });
    }
  }
  defineLastOperationValue(
    valueBuy,
    valueSell,
    lastvalueBuy,
    lastvalueSell,
    typeOperation
  ) {
    if (typeOperation !== undefined) {
      if (typeOperation === "SELL") {
        return lastvalueSell !== 0 ? lastvalueSell : valueSell;
      } else {
        return lastvalueBuy !== 0 ? lastvalueBuy : valueBuy;
      }
    } else {
      return 0;
    }
  }
  handlePriceByCurrency(value, currency) {
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = value;
    }
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.oferValue = val;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleBandPriceCurrency(value, currency) {
    let val;
    if (isNaN(value)) {
      val = 0;
    } else {
      val = value;
    }
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.amountBandGrafic = val;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangePeriod(e, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.periodStatistic = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangePeriodBand(e, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.timeBand = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  handleChangePeriodOfert(e, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === data.name) {
          element.periodStatisticOfert = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  onChangePeriod(currency, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.periodStatisticTime = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  onChangePeriodBandBase(currency, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.timeBandBase = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  onChangePeriodOfert(currency, data) {
    this.setState((state) => {
      const listCurrencys = state.listCurrencys.map((element) => {
        if (element.key === currency) {
          element.periodStatisticTimeOfert = data.value;
          return element;
        } else {
          return element;
        }
      });
      return { listCurrencys };
    });
  }
  async resetValueByCurrency(currency) {
    try {
      const response = await otcService.resetBalanceOperation(currency);
      console.log(response);
      this.setState((state) => {
        const listCurrencys = state.listCurrencys.map((element) => {
          if (element.key === currency) {
            element.disabled = false;
            element.oferValue = 0;
            return element;
          } else {
            return element;
          }
        });
        return { listCurrencys };
      });
    } catch (error) {
      console.log(error);
    }
  }
  async setNewValueParam(currency, spreat, change) {
    let body = {
      currency: currency,
      maxSpreadPercent: spreat,
      changePercent: change,
    };
    this.setState({ load: true });
    try {
      const response = await otcService.setOperationParams(body);
      this.setState({ load: false });
      console.log(response);
      if (response.data === "OK") {
        this.setState({
          message:
            "El % de Propagación y % de Variación han sido cambiados exitosamente",
          showMessage: true,
          color: "green",
        });
        this.timer = setTimeout(() => {
          this.setState({ message: "", showMessage: false, color: "" });
        }, 5000);
      } else {
        this.setState({
          message: "Disculpe no se ha podido realizar el cambio requerido",
          showMessage: true,
          color: "red",
        });
        this.timer = setTimeout(() => {
          this.setState({ message: "", showMessage: false, color: "" });
        }, 5000);
      }
    } catch (error) {
      this.setState({ load: false });
      this.setState({
        message: "Disculpe ha ocurrido un error intente más tarde",
        showMessage: true,
        color: "red",
      });
      this.timer = setTimeout(() => {
        this.setState({ message: "", showMessage: false, color: "" });
      }, 5000);
      console.log(error);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (this.state.socket !== undefined && this.state.socket !== null) {
      if (!this.state.socket.open) this.state.socket.close();
      //console.log("cerrando");
    }
    if (
      this.state.socketsGrafic !== undefined &&
      this.state.socketsGrafic !== null
    ) {
      if (!this.state.socketsGrafic.open) this.state.socketsGrafic.close();
      //console.log("cerrando");
    }
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  }
  renderText(value, entry) {
    const { color } = entry;
    if (value === "liquid") {
      return <span style={{ color, marginTop: 100 }}>Liquidez</span>;
    } else {
      return <span style={{ color }}>Volumen</span>;
    }
  }
  nameLabel(value) {
    if (value === "volume") {
      return "Volumen";
    } else {
      return "Liquidez";
    }
  }
  customizePrice(value) {
    if (value !== undefined) {
      return value.toLocaleString("en-US", {
        maximumFractionDigits: 4,
      });
    } else {
      return 0;
    }
  }
  render() {
    let scale = [
      {
        scale: 10,
        quantity: 4,
        startColor: "#ff2a04",
        endColor: "#ff2a04",
      },
      { scale: 10, quantity: 3, startColor: "yellow", endColor: "yellow" },
      { scale: 10, quantity: 4, startColor: "green", endColor: "green" },
    ];
    let st = { margin: "0px 0px 5px 0px", width: "120px", height: "120px" };
    const options = [
      { key: "m", text: "Minutos", value: "m" },
      { key: "H", text: "Horas", value: "H" },
    ];
    const methods = [
      { key: "a", text: "Franja de tiempo", value: "a" },
      { key: "b", text: "Franja de monto", value: "b" },
    ];
    const selectedBalance = [
      {
        key: "Balance de Compromiso",
        text: "Balance de Inversión",
        value: "Balance de Compromiso",
      },
      {
        key: "Balance de Operaciones",
        text: "Balance de Operaciones",
        value: "Balance de Operaciones",
      },
    ];
    return (
      <Segment basic loading={this.state.load}>
        <Grid>
          <Grid.Row columns="equal" centered>
            <Grid.Column
              mobile="16"
              computer="10"
              largeScreen="10"
              widescreen="10"
              tablet="10"
            >
              <Form.Field inline>
                <label>Seleccione el balance a consultar</label>
                <Dropdown
                  placeholder="Seleccione"
                  fluid
                  selection
                  onChange={this.handleChange2.bind(this)}
                  value={this.state.selectedBalance}
                  options={selectedBalance}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.selectedBalance !== "" &&
          this.state.selectedBalance !== "Balance de Compromiso" && (
            <div>
              <Grid>
                <Grid.Row columns="equal" centered>
                  <Grid.Column
                    mobile="16"
                    computer="10"
                    largeScreen="10"
                    widescreen="10"
                    tablet="10"
                  >
                    <Form>
                      <Form.Field inline>
                        <label>Selecciona la(s) Moneda(s)</label>
                        <Dropdown
                          placeholder="Monedas"
                          fluid
                          multiple
                          selection
                          onChange={this.handleChange.bind(this)}
                          value={this.state.selectedCurrency}
                          options={this.state.availableCurrency}
                        />
                      </Form.Field>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Grid>
                {this.state.listCurrencys.map((item, index) => (
                  <Grid.Column
                    key={index}
                    largeScreen={16}
                    computer={16}
                    mobile={16}
                    tablet={16}
                    verticalAlign="top"
                  >
                    <Grid>
                      <Grid.Row>
                        <Grid.Column
                          largeScreen={4}
                          computer={4}
                          mobile={16}
                          tablet={4}
                          verticalAlign="top"
                        >
                          <Header textAlign="center">{item.key}</Header>
                          <div style={{ textAlign: "center" }}>
                            {" "}
                            <Gauge
                              style={st}
                              scaleList={scale}
                              unit={"%"}
                              value={item.average}
                              minValue={-55}
                              maxValue={100}
                            />
                          </div>
                          <p
                            style={{ textAlign: "center" }}
                            className={
                              window.innerWidth < 768
                                ? "mobile-gauge-legend"
                                : ""
                            }
                          >
                            <Icon name="circle" color="red" />
                            <span className="legend">Venta</span>
                            <Icon name="circle" className="icon-color-gauge" />
                            <span className="legend">Equilibrio</span>
                            <Icon name="circle" color="green" />
                            <span className="legend">Compra</span>
                          </p>
                          <div>
                            {item.lastOperationType !== undefined &&
                              item.lastOperationType !== "" &&
                              item.lastOperationValue !== 0 && (
                                <Form.Field inline style={{ width: 325 }}>
                                  <label>Precio última transacción: </label>

                                  <span>
                                    {" "}
                                    {item.lastOperationValue.toLocaleString(
                                      "en-US",
                                      {
                                        maximumFractionDigits: 4,
                                      }
                                    )}
                                  </span>
                                  {item.lastOperationType === "SELL" && (
                                    <Icon name="circle" color="red" />
                                  )}
                                  {item.lastOperationType === "BUY" && (
                                    <Icon name="circle" color="green" />
                                  )}
                                </Form.Field>
                              )}
                            <br />
                            {item.buy !== "" && (
                              <div
                                style={{
                                  flexDirection: "row",
                                  textAlign: "right",
                                }}
                              >
                                <span style={{ textAlign: "start" }}>
                                  Precio compra{" "}
                                </span>
                                <span style={{ textAlign: "end" }}>
                                  {" "}
                                  {this.customizePrice(item.buy)}
                                </span>
                              </div>
                            )}
                            {item.sell !== "" && (
                              <div
                                style={{
                                  flexDirection: "row",
                                  textAlign: "right",
                                }}
                              >
                                <span style={{ textAlign: "start" }}>
                                  Precio venta{" "}
                                </span>
                                <span style={{ textAlign: "end" }}>
                                  {" "}
                                  {this.customizePrice(item.sell)}
                                </span>
                              </div>
                            )}

                            {item.balanceAmount !== undefined &&
                              item.balanceAmount !== 0 && (
                                <div style={{ textAlign: "center" }}>
                                  <br />
                                  <span
                                    style={{ textAlign: "start", fontSize: 16 }}
                                  >
                                    <strong> Balance </strong>
                                  </span>
                                  {item.balanceAmount < 0 && (
                                    <span
                                      style={{
                                        textAlign: "end",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                      }}
                                    >
                                      {" "}
                                      {item.balanceAmount.toLocaleString(
                                        "en-US",
                                        {
                                          maximumFractionDigits: 4,
                                        }
                                      )}
                                    </span>
                                  )}
                                  {item.balanceAmount >= 0 && (
                                    <span
                                      style={{
                                        textAlign: "end",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                      }}
                                    >
                                      {"  +"}
                                      {item.balanceAmount.toLocaleString(
                                        "en-US",
                                        {
                                          maximumFractionDigits: 4,
                                        }
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>
                        </Grid.Column>
                        <Grid.Column
                          largeScreen={6}
                          computer={6}
                          mobile={16}
                          tablet={6}
                          textAlign="center"
                          verticalAlign="top"
                        >
                          <Header textAlign="center">
                            {item.key + " " + item.periodStatistic}
                          </Header>

                          {item.currencyGraficData !== undefined &&
                            item.currencyGraficData.length > 0 && (
                              <ComposedChart
                                width={400}
                                height={250}
                                data={item.currencyGraficData}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 20,
                                  bottom: 10,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  tick={<CustomizedAxisTick />}
                                  type="number"
                                  domain={["dataMin", "dataMax"]}
                                  dataKey="date"
                                />
                                <YAxis tick={<CustomizedAxisYTick />} />
                                <Tooltip
                                  labelFormatter={(value, name, props) =>
                                    moment(value).format("DD/MM/YYYY HH:mm:ss")
                                  }
                                  formatter={(value, name, props) => [
                                    <NumberFormat
                                      value={this.floorDecimals(value, 2)}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />,
                                    this.nameLabel(name),
                                  ]}
                                />
                                <Legend formatter={this.renderText} />
                                <Bar
                                  dataKey="volume"
                                  barSize={20}
                                  fill="#f7941d"
                                  label={<CustomizedLabel font="Fiat" />}
                                />

                                <Line
                                  type="monotone"
                                  dataKey="liquid"
                                  stroke="#207ef2"
                                  label={<CustomizedLabel font="Fiat" />}
                                />
                              </ComposedChart>
                            )}
                          {item.currencyGraficData === undefined ||
                            (item.currencyGraficData.length === 0 && (
                              <Segment>
                                <Grid>
                                  <Grid.Column verticalAlign="middle">
                                    <Header textAlign="center">
                                      Coloque un periodo para consultar la
                                      grafica
                                    </Header>
                                  </Grid.Column>
                                </Grid>
                              </Segment>
                            ))}
                        </Grid.Column>
                        <Grid.Column
                          largeScreen={6}
                          computer={6}
                          mobile={16}
                          tablet={6}
                          textAlign="center"
                          verticalAlign="top"
                        >
                          <Header textAlign="center">
                            BTC {" " + item.periodStatistic}
                          </Header>
                          {item.btcGraficData !== undefined &&
                            item.btcGraficData.length > 0 && (
                              <ComposedChart
                                width={400}
                                height={250}
                                data={item.btcGraficData}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 20,
                                  bottom: 10,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  tick={<CustomizedAxisTick />}
                                  type="number"
                                  domain={["dataMin", "dataMax"]}
                                  dataKey="date"
                                />
                                <YAxis tick={<CustomizedAxisYBTCTick />} />
                                <Tooltip
                                  labelFormatter={(value, name, props) =>
                                    moment(value).format("DD/MM/YYYY HH:mm:ss")
                                  }
                                  formatter={(value, name, props) => [
                                    <NumberFormat
                                      value={this.floorDecimals(value, 8)}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />,
                                    this.nameLabel(name),
                                  ]}
                                />
                                <Legend formatter={this.renderText} />
                                <Bar
                                  dataKey="volume"
                                  barSize={20}
                                  fill="#f7941d"
                                  label={<CustomizedLabel font="Crypto" />}
                                />

                                <Line
                                  type="monotone"
                                  dataKey="liquid"
                                  stroke="#207ef2"
                                  label={<CustomizedLabel font="Crypto" />}
                                />
                              </ComposedChart>
                            )}
                          {item.currencyGraficData === undefined ||
                            (item.currencyGraficData.length === 0 && (
                              <Segment>
                                <Grid>
                                  <Grid.Column verticalAlign="middle">
                                    <Header textAlign="center">
                                      Coloque un periodo para consultar la
                                      grafica
                                    </Header>
                                  </Grid.Column>
                                </Grid>
                              </Segment>
                            ))}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row style={{ paddingBottom: 0 }}>
                        <Form>
                          {this.state.showMessage && (
                            <Message
                              color={this.state.color}
                              textAlign="center"
                              style={{ textAlign: "center" }}
                            >
                              {this.state.message}
                            </Message>
                          )}
                          <Form.Group>
                            <Form.Field>
                              <Form.Select
                                label="Selecciona un metodo a consultar"
                                placeholder="Metodos"
                                size="small"
                                name={item.key}
                                fluid
                                onChange={this.handleChangeMethods.bind(this)}
                                value={item.method}
                                options={methods}
                              />
                            </Form.Field>
                            {item.method === "b" && (
                              <Form.Input
                                style={{ paddingRight: 0 }}
                                size="small"
                                label="Franja de oferta"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handlePriceByCurrency(
                                        parseFloat(value),
                                        item.key
                                      );
                                    }}
                                    thousandSeparator={true}
                                  />
                                }
                              />
                            )}
                            {item.method === "a" && (
                              <Form.Input
                                placeholder="Tiempo"
                                label="Banda de tiempo atras"
                                type="number"
                                disabled={item.amountBandGrafic !== 0}
                                style={{
                                  backgroundColor: "white",
                                }}
                                action={
                                  <Dropdown
                                    button
                                    basic
                                    floating
                                    text={item.timeBandBase === "m" ? "M" : "H"}
                                    options={options}
                                    defaultValue={item.timeBandBase}
                                    onChange={(e, data) =>
                                      this.onChangePeriodBandBase(
                                        item.key,
                                        data
                                      )
                                    }
                                  />
                                }
                                size="small"
                                value={item.timeBand}
                                name={item.key}
                                onChange={this.handleChangePeriodBand.bind(
                                  this
                                )}
                              />
                            )}
                            {item.method !== "" && (
                              <Form.Input
                                placeholder="Tiempo"
                                label="Periodo Liquidez/Volumen"
                                type="number"
                                style={{
                                  backgroundColor: "white",
                                }}
                                action={
                                  <Dropdown
                                    button
                                    basic
                                    floating
                                    text={
                                      item.periodStatisticTime === "m"
                                        ? "M"
                                        : "H"
                                    }
                                    options={options}
                                    defaultValue={item.periodStatisticTime}
                                    onChange={(e, data) =>
                                      this.onChangePeriod(item.key, data)
                                    }
                                  />
                                }
                                size="small"
                                value={item.periodStatistic}
                                name={item.key}
                                onChange={this.handleChangePeriod.bind(this)}
                              />
                            )}
                            {item.method === "b" && (
                              <Popup
                                content="Consultar graficas"
                                trigger={
                                  <Form.Button
                                    style={{ marginTop: 22 }}
                                    circular
                                    icon="redo"
                                    disabled={
                                      item.periodStatistic === "" ||
                                      item.oferValue === 0
                                    }
                                    onClick={() => {
                                      this.getBalanceForCurrency(item);
                                      this.getLiquidityAndVolume(item.key);
                                      //  this.getParamsUSDA();
                                    }}
                                  />
                                }
                              />
                            )}

                            {item.method === "a" && (
                              <Popup
                                content="Consultar graficas"
                                trigger={
                                  <Form.Button
                                    style={{ marginTop: 22 }}
                                    circular
                                    icon="redo"
                                    disabled={
                                      item.timeBand === "" ||
                                      item.timeBandBase === ""
                                    }
                                    onClick={() => {
                                      this.getBalanceForCurrencyForTime(item);
                                      this.getLiquidityAndVolumeWithTime(
                                        item.key,
                                        item.timeBand,
                                        item.timeBandBase
                                      );
                                    }}
                                  />
                                }
                              />
                            )}
                            {item.disabled === true && (
                              <Form.Button
                                color="blue"
                                style={{ marginTop: 22, marginRight: -40 }}
                                onClick={() =>
                                  this.resetValueByCurrency(item.key)
                                }
                                content="Resetear Precios"
                              />
                            )}
                          </Form.Group>
                        </Form>
                      </Grid.Row>
                      {item.disabled === true && (
                        <Grid.Row style={{ paddingTop: 0 }}>
                          <Form>
                            <Form.Group>
                              <Form.Input
                                label="% de Propagación"
                                size="small"
                                name={item.key}
                                value={item.porcentVariation}
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    value={item.porcentVariation}
                                    defaultValue={item.porcentVariation}
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleChangePorcentVariationRest(
                                        parseFloat(value),
                                        item.key
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Form.Input
                                label="% de Variación"
                                size="small"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    value={item.spreatFactor}
                                    defaultValue={item.spreatFactor}
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleChangeDifusinFactorRest(
                                        parseFloat(value),
                                        item.key
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Popup
                                content="Cambiar Difusión y variación"
                                trigger={
                                  <Form.Button
                                    onClick={() =>
                                      this.setNewValueParam(
                                        item.key,
                                        item.spreatFactor,
                                        item.porcentVariation
                                      )
                                    }
                                    disabled={
                                      item.spreatFactor === 0 ||
                                      item.porcentVariation === 0 ||
                                      item.spreatFactor === "" ||
                                      item.porcentVariation === ""
                                    }
                                    style={{ marginTop: 22 }}
                                    circular
                                    icon="redo"
                                  />
                                }
                              />
                            </Form.Group>
                          </Form>
                        </Grid.Row>
                      )}
                      {item.disabled === true && item.key === "USDA" && (
                        <Grid.Row style={{ paddingTop: 0 }}>
                          <Form>
                            <Form.Group>
                              <Form.Input
                                label="% Max. cambio en compra"
                                size="small"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    value={this.state.topBuyChangePercent}
                                    defaultValue={
                                      this.state.topBuyChangePercent
                                    }
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleChangeTopBuyChangePercent(
                                        parseFloat(value)
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Form.Input
                                label="% Min. cambio en compra"
                                size="small"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    value={this.state.bottomBuyChangePercent}
                                    defaultValue={
                                      this.state.bottomBuyChangePercent
                                    }
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleChangeBottomBuyChangePercent(
                                        parseFloat(value)
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Form.Input
                                label="% Max. cambio en venta"
                                size="small"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    value={this.state.topSellChangePercent}
                                    defaultValue={
                                      this.state.topSellChangePercent
                                    }
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleTopSellChangePercent(
                                        parseFloat(value)
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Form.Input
                                label="% Min. cambio en venta"
                                size="small"
                                type={
                                  <NumberFormat
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    defaultValue={
                                      this.state.bottomSellChangePercent
                                    }
                                    onValueChange={(values) => {
                                      const { value } = values;
                                      this.handleBottomSellChangePercent(
                                        parseFloat(value)
                                      );
                                    }}
                                    suffix={" " + "%"}
                                  />
                                }
                              />
                              <Popup
                                content="Actualizar porcentaje de cambio"
                                trigger={
                                  <Form.Button
                                    onClick={this.updateParamsUSDA.bind(this)}
                                    disabled={
                                      this.state.topBuyChangePercent === "" ||
                                      this.state.bottomBuyChangePercent ===
                                        "" ||
                                      this.state.topSellChangePercent === "" ||
                                      this.state.bottomSellChangePercent === ""
                                    }
                                    style={{ marginTop: 22 }}
                                    circular
                                    icon="redo"
                                  />
                                }
                              />
                            </Form.Group>
                          </Form>
                        </Grid.Row>
                      )}
                    </Grid>
                  </Grid.Column>
                ))}
              </Grid>
            </div>
          )}
        <Divider hidden />
        {this.state.selectedBalance !== "" &&
          this.state.selectedBalance === "Balance de Compromiso" && (
            <BalanceCompromise currency={this.state.availableCurrency} />
          )}
      </Segment>
    );
  }
}

export default BalanceOfOperations;
