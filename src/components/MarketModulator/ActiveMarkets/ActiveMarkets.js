import React, { Component } from "react";
import {
  Container,
  Dimmer,
  Loader,
  Accordion,
  Segment,
  Card,
  Icon,
  Button,
  Popup,
  Header,
  Modal
} from "semantic-ui-react";
import modulatorAPI from "../../../services/marketModulator";

class ActiveMarkets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSymbols: [],
      showSymbolsTable: false,
      markets: [],
      activeIndex: 0,
      manualRules: {},
      modalTitle: "",
      modalBody: "",
      modalIcon: "",
      symbolModification: "",
      modifyAction: "",
      openModal: false,
      currentSymbolValue: false
    };
    this.loadActiveSymbols = this.loadActiveSymbols.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.loadManualsRules = this.loadManualsRules.bind(this);
    this.closeModalModification = this.closeModalModification.bind(this);
    this.confirmModifyRule = this.confirmModifyRule.bind(this);
    this.showModalModification = this.showModalModification.bind(this);
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  componentDidMount() {
    this.loadActiveSymbols();
  }

  loadActiveSymbols = () => {
    this.setState({
      showSymbolsTable: true
    });
    modulatorAPI
      .getActiveSymbols()
      .then(res => {
        if (res.status === 200) {
          if (res.data !== undefined && res.data !== null) {
            if (res.data.result !== undefined && res.data.result) {
              if (
                res.data.result.activeSymbols !== undefined &&
                res.data.result.activeSymbols !== null
              ) {
                let symbols = res.data.result.activeSymbols;
                this.loadManualsRules(symbols);
              }
            }
          }
        }
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          activeSymbols: [],
          showSymbolsTable: false,
          markets: []
        });
      });
  };

  loadManualsRules(syms) {
    modulatorAPI
      .getManualRules()
      .then(res => {
        let resp = res.data.result;
        let auxMarket = syms;
        if (resp !== undefined) {
          if (resp.shutdownMarketsSpecific === "") {
            auxMarket.forEach(m => {
              m.close = false;
            });
          } else {
            let shutdownMarkets = resp.shutdownMarketsSpecific.split("__");
            shutdownMarkets.forEach(sM => {
              let aux = auxMarket.find(market => market.symbol === sM);
              if (aux !== undefined) {
                auxMarket[auxMarket.indexOf(aux)].close = true;
              }
            });
          }
          if (resp.blockMarketsSpecific === "") {
            auxMarket.forEach(m => {
              m.block = false;
            });
          } else {
            let blockMarkets = resp.blockMarketsSpecific.split("__");
            blockMarkets.forEach(bM => {
              let aux = auxMarket.find(market => market.symbol === bM);
              if (aux !== undefined) {
                auxMarket[auxMarket.indexOf(aux)].block = true;
              }
            });
          }
          this.setState({
            activeSymbols: auxMarket,
            manualRules: resp
          });
        }
      })
      .then(() => {
        let symbols = this.state.activeSymbols;
        let markets = [];
        symbols.forEach(s => {
          let aux = markets.find(m => m.exchange === s.exchangeId);
          if (aux === undefined) {
            markets.push({
              exchange: s.exchangeId,
              symbols: symbols.filter(symbol => symbol.exchangeId === s.exchangeId)
            });
          }
        });
        this.setState({
          showSymbolsTable: false,
          markets: markets
        });
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          showSymbolsTable: false,
        });
      });
  }

  showModalModification = (e, data) => {
    let symbolActionCurrentValue = data.id;
    let values = symbolActionCurrentValue.split("__");
    let symbol = values[0];
    let opt = values[1];
    let currentValue = values[2] === "true";
    let action = "";
    let icon = "";
    if (opt === "SHUTDOWN") {
      if (currentValue) {
        action = "Abrir";
        icon = "check";
      } else {
        action = "Cerrar";
        icon = "close";
      }
    } else {
      if (currentValue) {
        action = "Desbloquear";
        icon = "unlock";
      } else {
        action = "Bloquear";
        icon = "lock";
      }
    }
    this.setState({
      symbolModification: symbol,
      modifyAction: opt,
      currentSymbolValue: currentValue,
      modalTitle: action + " regla",
      modalBody: "¿Confirma que desea " + action + " el simbolo: " + symbol + "?",
      modalIcon: icon,
    },()=>{
      this.setState({ openModal: true});
    });
  };
  closeModalModification = () => {
    this.setState({
      symbolModification: "",
      modalTitle: "",
      modalBody: "",
      modalIcon: "",
      modifyAction: "",
      openModal: false,
      currentSymbolValue: false
    });
  };

  confirmModifyRule = () => {
    let rules = this.state.manualRules;
    let symbol = this.state.symbolModification;
    let opt = this.state.modifyAction;
    if (opt === "SHUTDOWN") {
      let newValue = "";
        if (rules.shutdownMarketsSpecific.indexOf(symbol)!== -1) {
          let arr = rules.shutdownMarketsSpecific.split("__");
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== symbol && arr[i]!=="") {
              if(i!== (arr.length-1) && arr.length>1)
                newValue += arr[i]+"__";
              else newValue += arr[i];
            }
          }
        } else newValue = rules.shutdownMarketsSpecific+"__"+symbol;
      let shutdownMarketsSpecific = rules.shutdownMarketsSpecific === "" ? symbol : newValue;
      this.handleModificationRule(shutdownMarketsSpecific, opt);
    } else if (opt === "BLOCK") {
      let newValue2 = "";
        if (rules.blockMarketsSpecific.indexOf(symbol)!== -1) {
          let arr2 = rules.blockMarketsSpecific.split("__");
          for (let j = 0; j < arr2.length; j++) {
            if (arr2[j] !== symbol && arr2[j]!=="") {
              if(j!== (arr2.length-1) && arr2.length>1)
                newValue2 += arr2[j]+"__";
              else newValue2 += arr2[j];
            }
          }
        } else newValue2 = rules.blockMarketsSpecific+"__"+symbol;
      let blockMarketsSpecific = rules.blockMarketsSpecific === "" ? symbol : newValue2;
      this.handleModificationRule(blockMarketsSpecific, opt);
    }
  };

  handleModificationRule = (rule, opt) => {
    let auxManualRules = this.state.manualRules;
    if(opt==="SHUTDOWN"){
      auxManualRules.shutdownMarketsSpecific = rule;
    }else if(opt==="BLOCK"){
      auxManualRules.blockMarketsSpecific = rule
    }
    this.setState({
      manualRules: auxManualRules
    }, ()=>{
      let body = {
        config: {
          shutdownMarketsAll: this.state.manualRules.shutdownMarketsAll,
          shutdownMarketsBase: this.state.manualRules.shutdownMarketsBase,
          shutdownMarketsSpecific:this.state.manualRules.shutdownMarketsSpecific,
          protectionCurrency: this.state.manualRules.protectionCurrency,
          blockMarketsAll: this.state.manualRules.blockMarketsAll,
          blockMarketsBase: this.state.manualRules.blockMarketsBase,
          blockMarketsSpecific: this.state.manualRules.blockMarketsSpecific
        }
      };
      //let body ={"config":{"shutdownMarketsAll":false,"shutdownMarketsBase":"","shutdownMarketsSpecific":"","protectionCurrency":"USDT","blockMarketsAll":false,"blockMarketsBase":"","blockMarketsSpecific":"LTCUSDT"}};
      ////console.log(body);
      modulatorAPI
        .updateManualRules(body)
        .then(res => {
          if (res.data.result === "OK") {
            this.closeModalModification();
            this.loadActiveSymbols();
          }
        })
        .catch(error => {
          this.closeModalModification();
          //console.log(error);
        });
    });

  };
  render() {
    let {
      activeIndex,
      markets,
      openModal,
      modalBody,
      modalIcon,
      modalTitle
    } = this.state;
    return (
      <Container>
        <Segment color="orange">
          <Dimmer active={this.state.showSymbolsTable} inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
          <Accordion fluid styled>
            {markets.map((m, index) => (
              <div key={m.exchange}>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={this.handleClick}
                >
                  <Icon name="dropdown" />
                  {m.exchange}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === index}>
                  <Card.Group itemsPerRow={6}>
                    {m.symbols.map(value => (
                      <Card raised key={value.symbol}>
                        <Card.Content>
                          <Card.Description style={{ textAlign: "center" }}>
                            {value.symbol}
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                          <div className="ui two buttons">
                            <Popup
                              trigger={
                                <Button
                                  basic
                                  icon
                                  color="blue"
                                  id={value.symbol + "__BLOCK__" + value.block}
                                  size="mini"
                                  onClick={this.showModalModification}
                                >
                                  <Icon
                                    name={value.block ? "lock" : "unlock"}
                                    color="blue"
                                  />
                                </Button>
                              }
                              content={value.block ? "Desbloquear" : "Bloquear"}
                              size="mini"
                              position="bottom center"
                            />
                            <Popup
                              trigger={
                                <Button
                                  basic
                                  icon
                                  color="blue"
                                  id={
                                    value.symbol + "__SHUTDOWN__" + value.close
                                  }
                                  size="mini"
                                  onClick={this.showModalModification}
                                >
                                  <Icon
                                    name={value.close ? "close" : "check"}
                                    color="blue"
                                  />
                                </Button>
                              }
                              content={value.close ? "Abrir" : "Cerrar"}
                              size="mini"
                              position="bottom center"
                            />
                          </div>
                        </Card.Content>
                      </Card>
                    ))}
                  </Card.Group>
                </Accordion.Content>
              </div>
            ))}
          </Accordion>
        </Segment>
        <Modal
          basic
          size="small"
          open={openModal}
          onClose={this.closeModalModification}
          centered={true}
        >
          <Header icon={modalIcon} content={modalTitle} />
          <Modal.Content>
            <p>{modalBody}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              basic
              color="red"
              inverted
              onClick={this.closeModalModification}
            >
              <Icon name="remove" /> No
            </Button>
            <Button color="green" inverted onClick={this.confirmModifyRule}>
              <Icon name="checkmark" /> Si
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}
export default ActiveMarkets;
