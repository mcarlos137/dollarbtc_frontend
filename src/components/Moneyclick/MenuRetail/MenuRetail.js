import React, { Component } from "react";
import {
  Menu,
  Responsive,
  Grid,
  Button,
  Divider,
  Header
} from "semantic-ui-react";
import Retail from "./Retail/Retail";
import translate from "../../../i18n/translate";
import CurrencyOperationsType from "./CurrencyOperationsType/CurrencyOperationsType";
import Movements from "./MovementsRetail/MovementsRetail";
import userService from "../../../services/user";
import { isMobile } from "react-device-detect";

class MenuRetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "information",
      auth: userService.getUserAuth() === "true" ? true : false,
      positionMenuVertical: true,
      translator: props.translate
    };
    this.handleItem = this.handleItem.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  handleItem(e, data) {
    this.setState({ activeItem: data.name });
  }

  render() {
    let t = this.state.translator;
    let activeItem = this.state.activeItem;

    return (
      <div>
        <Responsive minWidth={992}>
          {this.state.auth && (
            <div>
              {window.sessionStorage.getItem("retail") !== null && (
                <div>
                  {!isMobile && (
                    <Menu size="small" pointing secondary>
                      <Menu.Item
                        name="information"
                        content={t(
                          "profile.optionPointsOfSales.menu.information"
                        )}
                        active={activeItem === "information"}
                        onClick={this.handleItem}
                      ></Menu.Item>

                      <Menu.Item
                        name="operations"
                        content={t(
                          "profile.optionPointsOfSales.menu.operations"
                        )}
                        active={activeItem === "operations"}
                        onClick={this.handleItem}
                      ></Menu.Item>
                      <Menu.Item
                        name="movements"
                        content={t(
                          "profile.optionPointsOfSales.menu.retail.movements"
                        )}
                        active={activeItem === "movements"}
                        onClick={this.handleItem}
                      ></Menu.Item>
                    </Menu>
                  )}
                  {/* {isMobile && (
                    <Menu size="small" pointing secondary>
                      <Menu.Item
                        name="information"
                        content={t(
                          "profile.optionPointsOfSales.menu.information"
                        )}
                        active={activeItem === "information"}
                        onClick={this.handleItem}
                      ></Menu.Item>
                    </Menu>
                  )} */}
                  {this.state.activeItem === "information" && (
                    <Retail idRetail={this.props.idRetail} />
                  )}
                  {this.state.activeItem === "operations" && (
                    <CurrencyOperationsType idRetail={this.props.idRetail} />
                  )}
                  {this.state.activeItem === "movements" && (
                    <Movements idRetail={this.props.idRetail} />
                  )}
                </div>
              )}
            </div>
          )}
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          {this.state.auth && (
            <div>
              {window.sessionStorage.getItem("retail") !== null && (
                <div>
                  {isMobile && (
                    <Grid columns="equal">
                      <Divider hidden></Divider>
                      <b>
                        <Header
                          as="h4"
                          textAlign="center"
                          className="titleComponentMobile"
                        >
                          {this.props.idRetail}
                        </Header>
                        <hr style={{ borderColor: "#207ef2" }}></hr>
                      </b>
                      <Grid.Row>
                        <Grid.Column
                          largeScreen={5}
                          mobile={5}
                          tablet={5}
                          computer={5}
                        >
                          <Button
                            content={t(
                              "profile.optionPointsOfSales.menu.informationMobile"
                            )}
                            primary
                            name="information"
                            style={{
                              fontSize: "10px",
                              width: "100px",
                              height: "35px",
                              paddingLeft: "10px"
                            }}
                            onClick={this.handleItem}
                          />
                        </Grid.Column>
                        <Grid.Column
                          largeScreen={5}
                          mobile={10}
                          tablet={10}
                          computer={5}
                        >
                          <Button
                            content={t(
                              "profile.optionPointsOfSales.menu.operationsMobile"
                            )}
                            primary
                            name="operations"
                            style={{
                              fontSize: "10px",
                              //width: "100px",
                              height: "35px"
                            }}
                            onClick={this.handleItem}
                          />
                        </Grid.Column>
                        {/* <Grid.Column
                        largeScreen={4}
                        mobile={4}
                        tablet={4}
                        computer={4}
                      >
                        <Button content= {t(
                        "profile.optionPointsOfSales.menu.retail.movements"
                      )} primary style={{ fontSize:"10px", width:"80px",height:"19px"}} />
                       
                      </Grid.Column> */}
                      </Grid.Row>
                    </Grid>
                  )}
                  {this.state.activeItem === "information" && (
                    <Retail idRetail={this.props.idRetail} />
                  )}
                  {this.state.activeItem === "operations" && (
                    <CurrencyOperationsType idRetail={this.props.idRetail} />
                  )}
                  {this.state.activeItem === "movements" && (
                    <Movements idRetail={this.props.idRetail} />
                  )}
                </div>
              )}
            </div>
          )}
        </Responsive>
      </div>
    );
  }
}
export default translate(MenuRetail);
