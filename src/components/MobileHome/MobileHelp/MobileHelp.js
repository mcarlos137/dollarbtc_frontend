import React, { Component } from "react";
import { Grid, Segment, Image, Button, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../MobileHome.css";
import translate from "../../../i18n/translate";

class MobileHelp extends Component {
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
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  render() {
    let t = this.state.translator;
    return (
     
      <Segment raised secondary>
        <div align="center">
          <label textAlign="center">
            <strong>{t("homeMobile.help.header")}</strong>
          </label>
        </div>
        <Grid style={{ marginTop: 10 }}>
          <Grid.Row centered>
            <Grid.Column mobile={3} tablet={3}></Grid.Column>
            <Grid.Column mobile={10} tablet={10}>
              {/* <label textAlign="center"><strong>{t("homeMobile.help.header")}</strong></label> */}
              <Link
                to="/charges"
                name="charges"
                onClick={this.setItem.bind(this)}
              >
                <div align="center">
                  <span style={{ color: "#207ef2 ", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.charges")}
                  </span>
                </div>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
              <Link
                to="/limits"
                name="limits"
                onClick={this.setItem.bind(this)}
              >
                <div align="center">
                  <span style={{ color: "#207ef2 ", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.limits")}
                  </span>
                </div>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
              <Link to="/faqs" name="faqs" onClick={this.setItem.bind(this)}>
                <div align="center">
                  <span style={{ color: "#207ef2 ", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.faq")}
                  </span>
                </div>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
              {/* <a onClick={this.props.downloadGuide}>
                <div align="center">
                  <span style={{ color: "#207ef2", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.guide")}
                  </span>
                </div>
              </a> */}
              <Link to="/legal" name="legal" onClick={this.setItem.bind(this)}>
                <div align="center">
                  <span style={{ color: "#207ef2 ", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.legal")}
                  </span>
                </div>
              </Link>
              <Divider hidden style={{ margin: "4px 0px 4px 0px" }} /> 
              <Link
                to="/contact"
                name="contact"
                onClick={this.setItem.bind(this)}
              >
                <div align="center">
                  <span style={{ color: "#207ef2 ", fontWeight: "bold" }}>
                    {t("homeMobile.help.content.contact")}
                  </span>
                </div>
              </Link>
            </Grid.Column>
            <Grid.Column mobile={3} tablet={3}></Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default translate(MobileHelp);
