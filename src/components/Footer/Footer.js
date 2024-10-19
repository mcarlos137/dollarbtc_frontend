import React, { Component } from "react";
import { Divider, Icon, Segment, Grid, Image } from "semantic-ui-react";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";
import logoBandera1 from "../../img/a.png";
import logoBandera2 from "../../img/v.png";
import logoAws from "../../img/amzws.png";
import logoClient from "../../img/logoGMBfooter.png";
import logoBancript from "../../img/Bancript.png";
import logoBlockchain from "../../img/blockchain c.png";
import packageJson from "../../../package.json";
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footerClient: packageJson.designCompany,
      translator: props.translate,
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  componentDidMount() {
    let wind = window.sessionStorage.getItem("auth");
    let mobile = isMobile;
    this.setState({ wind: wind, mobile: mobile });
  }
  render() {
    let t = this.state.translator;
    let labelMessage;
    //console.log(this.state.wind, this.state.mobile);

    if (this.state.wind == true && this.state.mobile == true) {
      labelMessage = (
        <Grid style={{ background: "white" }}>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={null}
            widescreen={4}
          />

          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/contact" hidden>
              <span style={{ color: "white" }}>{t("footer.contact")}</span>
            </a>
          </Grid.Column>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/faqs" hidden>
              {" "}
              <span style={{ color: "white" }}>
                {t("navCommons.help.options.faqs")}
              </span>
            </a>
          </Grid.Column>
          <Grid.Column />
        </Grid>
      );
    }

    if (this.state.wind == null && this.state.mobile == true) {
      labelMessage = (
        <Grid>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={null}
            widescreen={4}
          />

          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/contact">
              <span style={{ color: "white" }}>{t("footer.contact")}</span>
            </a>
          </Grid.Column>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/faqs">
              {" "}
              <span style={{ color: "white" }}>
                {t("navCommons.help.options.faqs")}
              </span>
            </a>
          </Grid.Column>
          <Grid.Column />
        </Grid>
      );
    }

    if (this.state.wind == null && this.state.mobile == false) {
      labelMessage = (
        <Grid>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={null}
            widescreen={4}
          />

          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/contact">
              <span style={{ color: "white" }}>{t("footer.contact")}</span>
            </a>
          </Grid.Column>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/faqs">
              {" "}
              <span style={{ color: "white" }}>
                {t("navCommons.help.options.faqs")}
              </span>
            </a>
          </Grid.Column>
          <Grid.Column />
        </Grid>
      );
    }

    if (this.state.wind == true && this.state.mobile == false) {
      labelMessage = (
        <Grid style={{ background: "white" }}>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={null}
            widescreen={4}
          />

          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/contact" hidden>
              <span style={{ color: "white" }}>{t("footer.contact")}</span>
            </a>
          </Grid.Column>
          <Grid.Column
            largeScreen={4}
            tablet={4}
            computer={4}
            mobile={16}
            widescreen={4}
          >
            <a href="/faqs" hidden>
              {" "}
              <span style={{ color: "white" }}>
                {t("navCommons.help.options.faqs")}
              </span>
            </a>
          </Grid.Column>
          <Grid.Column />
        </Grid>
      );
    }

    return (
      <Segment
        inverted
        vertical
        style={{
          margin: "5em 0em 0em",
          padding: "0px 0em 20px",
          backgroundColor: "#1b1c1d",
        }}
        textAlign="center"
      >
        {" "}
        {labelMessage}
        <Divider
          section
          style={{
            backgroundColor: "#207ef2",
            marginTop: "15px",
            marginBottom: "15px",
            height: "5px",
          }}
        />
        <Grid>
          <Grid.Column
            largeScreen={1}
            computer={1}
            widescreen={1}
            tablet={16}
            mobile={16}
          />
          <Grid.Column
            largeScreen={6}
            tablet={16}
            computer={6}
            mobile={16}
            widescreen={6}
          >
            <Grid>
              <Grid.Row colums={2}>
                <Grid.Column
                  largeScreen={4}
                  tablet={4}
                  computer={4}
                  mobile={4}
                  widescreen={4}
                >
                  <Image src={logoBandera1} alt="" centered={true} />
                </Grid.Column>
                <Grid.Column
                  largeScreen={12}
                  tablet={12}
                  computer={12}
                  mobile={12}
                  widescreen={12}
                >
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    Dollarbtc.OÜ - Register Code 14778513
                  </span>
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    Providence Nº 50125491
                  </span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row colums={2} style={{ marginTop: -10 }}>
                <Grid.Column
                  largeScreen={4}
                  tablet={4}
                  computer={4}
                  mobile={4}
                  widescreen={4}
                >
                  <Image src={logoBandera2} alt="" centered={true} />
                </Grid.Column>
                <Grid.Column
                  largeScreen={12}
                  tablet={12}
                  computer={12}
                  mobile={12}
                  widescreen={12}
                >
                  <span style={{ fontSize: "10px", float: "left" }}>
                    Registriosakond Tartu Maakohtu, Pikk 32,
                  </span>
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    44307 ,Rakvere
                  </span>
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    Harju Maakond. Tallinn, Kesklinna linnaosa,
                  </span>
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    Narva mnt5, 10117, Estonia.
                  </span>
                  <br />
                  <br />
                  <span style={{ fontSize: "10px", float: "left" }}>
                    {" "}
                    All rights reserved <Icon name="copyright outline" />
                    Copyright <Icon name="copyright outline" /> 2015-2019
                  </span>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>

          {/* <Grid.Column
            largeScreen={2}
            computer={2}
            tablet={16}
            widescreen={2}
            mobile={16}
          /> */}

          <Grid.Column
            largeScreen={3}
            tablet={8}
            computer={3}
            mobile={8}
            widescreen={3}
            textAlign="center"
          >
            <Grid.Row>
              <Image
                src={logoBlockchain}
                style={{ marginTop: "8px" }}
                centered={true}
                alt=""
                size="small"
              />
            </Grid.Row>
            {this.state.footerClient === "GMB" ||
              (this.state.footerClient === "BANCRIPT" && (
                <Grid.Row>
                  <Image
                    src={logoAws}
                    style={{ marginTop: "15px" }}
                    centered={true}
                    alt=""
                    size="small"
                  />
                </Grid.Row>
              ))}
          </Grid.Column>
          <Grid.Column
            largeScreen={3}
            tablet={8}
            computer={3}
            mobile={8}
            widescreen={3}
            textAlign="center"
          >
            {this.state.footerClient !== "GMB" &&
              this.state.footerClient !== "BANCRIPT" && (
                <Grid.Row>
                  <Image
                    src={logoAws}
                    style={{ marginTop: "15px" }}
                    centered={true}
                    alt=""
                    size="small"
                  />
                </Grid.Row>
              )}
            {this.state.footerClient === "GMB" ||
              (this.state.footerClient === "BANCRIPT" && (
                <Grid.Row>
                  <Image
                    src={
                      this.state.footerClient === "GMB"
                        ? logoClient
                        : logoBancript
                    }
                    style={{ marginTop: "15px" }}
                    centered={true}
                    alt=""
                    size="small"
                  />
                </Grid.Row>
              ))}
          </Grid.Column>
          <Grid.Column
            largeScreen={1}
            computer={1}
            widescreen={1}
            tablet={16}
            mobile={16}
          />
        </Grid>
      </Segment>
    );
  }
}

export default translate(Footer);
