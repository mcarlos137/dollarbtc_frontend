import React, { Component } from "react";
import { Grid, Segment, Icon, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../MobileHome.css";
import translate from "../../../i18n/translate";

class MobileBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  floorDecimals(value, numberDecimals) {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  }
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  render() {
    let t = this.state.translator;
    return (
      <Segment secondary raised>
        <div align="center">
        <label textAlign="center"><strong>{t("homeMobile.balance.header")}</strong></label>
        </div>
        <Grid style={{marginTop:10}}>
          <Grid.Row>
            <Grid.Column mobile={8} tablet={8} textAlign="center" >
              
            <Link
                to="/wallet"
                name="wallet"
                onClick={this.setItem.bind(this)}
              > 

                <p className="content-menu">
                  <span>
                    <span className="balance">
                      {t("homeMobile.balance.content.balance")}
                    </span>
                    <br></br>
                    <span style={{ color: "#7AB5FD", marginLeft: "1 px" }}>
                      {this.props.balanceUser !== null
                        ? this.floorDecimals(
                            this.props.balanceUser.available,
                            8
                          )
                        : 0}
                    </span>
                    <Icon
                      name="btc"
                      style={{ color: "#7AB5FD", marginRight: "1 px" }}
                    />
                    
                  </span>
                </p>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
              <Link
                to="/"
                name="forex"
                onClick={this.setItem.bind(this)}
              >
                <p className="content-menu ">
                  <span>
                    <span className="balance">
                      {t("homeMobile.balance.content.forex")}
                    </span>
                    <br></br>
                    <span style={{ color: "#7AB5FD", marginLeft: "1 px" }}>
                      {this.props.balanceUser !== null
                        ? this.floorDecimals(
                          0,
                          8
                        )
                        : 0}
                    </span>
                    <Icon
                      name="btc"
                      style={{ color: "#7AB5FD", marginRight: "1 px" }}
                    />
                  </span>
                </p>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} textAlign="center">
              <Link
                to="/HFTplans"
                name="HFTplans"
                onClick={this.setItem.bind(this)}
              >
                <p className="content-menu ">
                  <span>
                    <span className="balance">
                      {t("homeMobile.balance.content.hft")}
                    </span>
                    <br></br>
                    <span style={{ color: "#7AB5FD", marginLeft: "1 px" }}>
                      {this.props.balanceUser !== null
                        ? this.floorDecimals(
                            this.props.balanceUser.estimated,
                            8
                          )
                        : 0}
                    </span>
                    <Icon
                      name="btc"
                      style={{ color: "#7AB5FD", marginRight: "1 px" }}
                    />
                     {this.props.balanceUsdUser !== 0 &&
                          <span style={{ color: "#7AB5FD" }}>
                            / {""} {this.props.balanceUsdUser} 
                            <Icon name="dollar" style={{ color: "#7AB5FD" }} />
                          </span>
                          } 
                  </span>
                </p>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
              <Link
                to="/"
                name="cryptoexchange"
                onClick={this.setItem.bind(this)}
              >
                <p className="content-menu ">
                  <span>
                    <span className="balance">
                      {t("homeMobile.balance.content.cryptoExchange")}
                    </span>
                    <br></br>
                    <span style={{ color: "#7AB5FD", marginLeft: "1 px" }}>
                      {this.props.balanceUser !== null
                        ? this.floorDecimals(
                          0,
                          8
                        )
                        : 0}
                    </span>
                    <Icon
                      name="dollar"
                      style={{ color: "#7AB5FD", marginRight: "1 px" }}
                    />
                  </span>
                </p>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default translate(MobileBalance);
