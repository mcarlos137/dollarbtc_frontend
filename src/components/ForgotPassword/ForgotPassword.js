import React, { Component } from "react";
import "./ForgotPassword.css";
import {
  Grid,
  Container,
  Header,
  Segment,
  Responsive,
  Divider
} from "semantic-ui-react";
import TokenResetPassword from "./TokenResetPassword/TokenResetPassword";
//import CodeResetPassword from "./CodeResetPassword/CodeResetPassword";
import ResetFormPassword from "./ResetFormPassword/ResetFormPassword";
import translate from "../../i18n/translate";
import SendTokenResetPassword from "./SendTokenResetPassword/SendTokenResetPassword";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "sendToken",
      tokenGeneral: "",
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
  handleItem(view) {
    this.setState({ activeItem: view });
  }
  handleTokenGeneral(token) {
    this.setState({ tokenGeneral: token });
  }
  handleGetToken() {
    return this.state.tokenGeneral;
  }
  render() {
    let activeItem = this.state.activeItem;
    let t = this.state.translator;
    return (
      <div>
        <Responsive minWidth={992}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                <Segment color="orange" textAlign="left">
                  <div />
                  <Header as="h4" className="title" textAlign="center">
                    {t("forgotPassword.header")}
                  </Header>
                  <Container className="container-form">
                    {activeItem === "sendToken" && (
                      <SendTokenResetPassword changeItem={this.handleItem} />
                    )}
                    {activeItem === "token" && (
                      <TokenResetPassword
                        changeItem={this.handleItem}
                        setToken={this.handleTokenGeneral.bind(this)}
                      />
                    )}

                    {/* {activeItem === "code" && (
                  <CodeResetPassword
                    changeItem={this.handleItem}
                    getToken={this.handleGetToken.bind(this)}
                  />
                )}
                {activeItem === "password" && (
                  <ResetFormPassword
                    changeItem={this.handleItem}
                    getToken={this.handleGetToken.bind(this)}
                  />
                )} */}
                    {activeItem === "code" && (
                      <ResetFormPassword
                        changeItem={this.handleItem}
                        getToken={this.handleGetToken.bind(this)}
                      />
                    )}
                  </Container>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          <Grid columns="equal">
            <Grid.Column />
            <Grid.Column largeScreen={10} mobile={16} tablet={14}>
              <Container>
                <div />
                <Header as="h4" className="titleComponent" textAlign="center">
                  {t("forgotPassword.header")}
                </Header>
                <hr style={{ borderColor: "#207ef2" }}></hr>
                <Divider hidden></Divider>
                <Container className="container-form">
                  {activeItem === "sendToken" && (
                    <SendTokenResetPassword changeItem={this.handleItem} />
                  )}
                  {activeItem === "token" && (
                    <TokenResetPassword
                      changeItem={this.handleItem}
                      setToken={this.handleTokenGeneral.bind(this)}
                    />
                  )}
                  {/* {activeItem === "code" && (
                    <CodeResetPassword
                      changeItem={this.handleItem}
                      getToken={this.handleGetToken.bind(this)}
                    />
                  )}
                  {activeItem === "password" && (
                    <ResetFormPassword
                      changeItem={this.handleItem}
                      getToken={this.handleGetToken.bind(this)}
                    />
                  )} */}
                  {activeItem === "code" && (
                    <ResetFormPassword
                      changeItem={this.handleItem}
                      getToken={this.handleGetToken.bind(this)}
                    />
                  )}
                </Container>
              </Container>
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Responsive>
      </div>
    );
  }
}
export default translate(ForgotPassword);
