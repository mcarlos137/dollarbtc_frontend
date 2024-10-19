import React, { Component } from "react";
import "./NavPublic.css";
import logo2 from "../../img/logoDollarBtc.png";
import hftIcon from "../../img/HFT_ICON.png";
import hftIconConver from "../../img/HFT_ICONCONVER.png";
import logoMC from "../../img/logoNuevoMC.jpg";
import logoClient from "../../img/logoGMBfooter.png";
import logoConvertrue from "../../img/convertrue.png";
import {
  Menu,
  Container,
  Image,
  Responsive,
  Dropdown,
  Icon,
  Popup,
  Divider,
  Button,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { parse } from "query-string";
import user from "../../services/user";
import otc from "../../services/otc";
import SideNavBarPublic from "./SideNavBarPublic/SideNavBarPublic";
import logoBancript from "../../img/Bancript.png";
import utils from "../../services/utils";
import translate from "../../i18n/translate";
import * as jsPDF from "jspdf";
import ISOCURRENCIES from "../../common/ISO4217";
import blockchainPdf from "../../common/Blockchain_ la revolucion indus - Preukschat (Coordinador).pdf";
import packageJson from "../../../package.json";
class NavPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      active: "home",
      activeButton: "stylebutton",
      screenWith: window.innerWidth,
      auth: user.getUserAuth() === "true" ? true : false,
      countOptions: 8,
      userBTCBalance: null,
      buybutton: false,
      sellbutton: true,
      tokenurl: "",
      typeOffer: "",
      varlog: true,
      action: "buy",
      currencyAction: "",
      listCountrys: [],
      translator: props.translate,
      navPublicClient: packageJson.designCompany,
      brokerPresentation: false,
    };
    this.onClickDownloadGuide = this.onClickDownloadGuide.bind(this);
  }
  handlePusher() {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  }

  componentDidMount() {
    // let domain = window.location.href.split("/")[3];
    // if (domain === "presentationBroker") {
    //     this.setState({ brokerPresentation: true });
    // }
    this.readUrlWhitParams();

  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentWillUpdate(nextProps, nextState) {}
  handleToggle() {
    this.setState({ visible: !this.state.visible });
  }
  handleItem(e, data) {
    this.setState({ active: data.name });
  }
  handleSetView(view) {
    this.setState({ activeView: view });
  }
  handleChangeScreen(e, data) {
    this.setState({ screenWith: data.width });
  }
  activeButtonBuy(e, data) {
    this.setState({ buybutton: false, sellbutton: true, action: "buy" });
  }
  activeButtonSell(e, data) {
    this.setState({ sellbutton: false, buybutton: true, action: "sell" });
  }

  readUrlWhitParams() {
    let query = parse(window.location.search);
    let keys = Object.keys(query);
    if (keys.length === 0) {
      //console.log("no tiene nada la url", query);
      this.setState({ varlog: false });
    } else {
      let tokenUrl = [];
      let typeOffer = "";
      if (query.offerKey !== undefined) {
        tokenUrl = query.offerKey;
        typeOffer = "offerKey";
      } else if (query.brokerOfferKey !== undefined) {
        tokenUrl = query.brokerOfferKey;
        typeOffer = "brokerOfferKey";
      }

      if (tokenUrl !== undefined && tokenUrl !== " " && tokenUrl !== null) {
        this.setState({
          varlog: true,
        });
        this.setState({
          tokenurl: tokenUrl,
          typeOffer: typeOffer,
        });
      }
      // window.sessionStorage.setItem("tokenOffert", this.state.tokenurl);
      // console.log("token de la session",)
    }
  }

  handleCurrencyAction(e, data) {
    window.location.href = "/" + this.state.action + "/?c=" + data.value;
  }
  onClickLang(e, data) {
    //console.log(data.value);
  }
  onClickDownloadGuide() {
    let doc = new jsPDF("p", "in", "letter");
    let margin = 0.5,
      verticalOffset = margin,
      size; // inches on a 8.5 x 11 inch sheet.
    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    doc.addFont("Montserrat");
    doc.setFontType("bold");

    doc.setTextColor(79, 129, 189);
    size = 14;
    let text = this.state.translator("guide.header");
    let lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;
    size = 12;
    doc.setFontType("normal");
    text = this.state.translator("guide.modules.one.header");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.sub");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.commons.generalObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      "\u2022 " +
      this.state.translator("guide.modules.one.generals.one") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.one.generals.two") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.one.generals.three") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator("guide.commons.specificObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text = "\u2022 " + this.state.translator("guide.modules.one.specifics.one");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = "\u2022 " + this.state.translator("guide.modules.one.specifics.two");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.three");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.four");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.five");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = "\u2022 " + this.state.translator("guide.modules.one.specifics.six");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.seven");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.eight");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.nine");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = "\u2022 " + this.state.translator("guide.modules.one.specifics.ten");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.eleven");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.twelve");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.thirteen");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.fourteen");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.fifteen");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.one.specifics.sixteen");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator("guide.commons.content");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.one.content.l1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l4");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l5");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l6");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l7");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l8");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l9");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l10");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l11");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l12");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l13");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l14");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l15");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l16");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l17");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    text = this.state.translator("guide.modules.one.content.l18");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l19");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l20");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l21");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l22");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.one.content.l23");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    doc.setFontType("normal");
    text = this.state.translator("guide.modules.two.header");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.sub");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.two.intro");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.generalObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      "\u2022 " +
      this.state.translator("guide.modules.two.generals.one") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.two.generals.two") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.two.generals.three") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator("guide.commons.specificObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text = "\u2022 " + this.state.translator("guide.modules.two.specifics.one");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = "\u2022 " + this.state.translator("guide.modules.two.specifics.two");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.two.specifics.three");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.two.specifics.four");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.two.specifics.five");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = "\u2022 " + this.state.translator("guide.modules.two.specifics.six");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.two.specifics.seven");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.theoreticalSection");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.two.content.theoretical.l1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l4");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l5");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l6");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l7");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l8");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l9");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l10");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l11");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l12");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.theoretical.l13");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.practicalSection");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.two.content.practical.l1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l4");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l5");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l6");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l7");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    text = this.state.translator("guide.modules.two.content.practical.l8");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.two.content.practical.l9");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.conclusions");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.two.conclusions");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;
    doc.setFontType("normal");
    text = this.state.translator("guide.modules.three.header");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.sub");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.three.intro");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.generalObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o1") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o2") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o3") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o4") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o5") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o6") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;
    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o7") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o8") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o9") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o10") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o11") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o12") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " +
      this.state.translator("guide.modules.three.generals.o13") +
      "\n";
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;
    text = this.state.translator("guide.commons.specificObjectives");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;
    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o4");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o5");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o6");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o7");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o8");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o9");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text =
      "\u2022 " + this.state.translator("guide.modules.three.specifics.o10");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.addPage();

    doc
      .setDrawColor(255, 255, 255)
      .setLineWidth(1 / 72)
      .line(margin, margin, margin, 11 - margin)
      .line(8.5 - margin, margin, 8.5 - margin, 11 - margin);
    verticalOffset = margin;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.theoreticalSection");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.three.content.theoretical.t1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t4");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t5");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t6");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t7");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.theoretical.t8");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.practicalSection");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.three.content.practical.p1");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.practical.p2");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    text = this.state.translator("guide.modules.three.content.practical.p3");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(79, 129, 189);
    size = 12;

    text = this.state.translator("guide.commons.conclusions");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.setTextColor(8, 13, 20);
    size = 11;

    text = this.state.translator("guide.modules.three.conclusions");
    lines = doc.setFontSize(size).splitTextToSize(text, 7.5);
    doc.text(0.5, verticalOffset + size / 72, lines);
    verticalOffset += ((lines.length + 0.5) * size) / 72;

    doc.save("GuiaCryptos.pdf");
  }
  render() {
    let registrationtoken =
      "/registration/?" + this.state.typeOffer + "=" + this.state.tokenurl;
    let logintoken;
    if (this.state.varlog) {
      logintoken =
        "/login/?" + this.state.typeOffer + "=" + this.state.tokenurl;
    } else {
      logintoken = "/login";
    }

    let t = this.state.translator;
    let friendOptions = [
      { text: t("navPublic.lang.en"), value: "en", disabled: false },
      { text: t("navPublic.lang.es"), value: "es" },
    ];
    let active = this.state.active;
    let { handleClick } = this.props;
    return (
      <div>
        <Responsive
          minWidth={992}
          onUpdate={this.handleChangeScreen.bind(this)}
        >
          <Menu
            fixed="top"
            text
            className={
              this.state.navPublicClient === "MAIN"
                ? "nav-public"
                : this.state.navPublicClient === "GMB" ||
                  this.state.navPublicClient === "BANCRIPT"
                ? "nav-publicClient"
                : "nav-publicConvertrue-som"
            }
            fluid
            size="tiny"
          >
            <Container>
              <Menu.Item style={{ marginRight: "20px" }}>
                <span>
                  <span
                    style={{
                      color:
                        this.state.navPublicClient !== "CONVERTRUE"
                          ? "white"
                          : "#207ef2",
                    }}
                  >
                    {" "}
                    {t("navCommons.market")}
                    {"  "}
                    {"  "}
                  </span>
                  <Dropdown
                    id={
                      this.state.navPublicClient === "CONVERTRUE"
                        ? "lengu-select-convertrue"
                        : "lengu-select"
                    }
                    style={{ marginLeft: "10px" }}
                    inline
                    icon={
                      <Icon
                        name="angle down"
                        style={{
                          color:
                            this.state.navPublicClient !== "CONVERTRUE"
                              ? "white"
                              : "#207ef2",
                        }}
                      />
                    }
                    options={friendOptions}
                    defaultValue={this.props.language}
                    onChange={handleClick}
                  />
                </span>
              </Menu.Item>
              {this.state.navPublicClient === "GMB" && (
                <Container style={{ border: "none", backgroundColor: "black" }}>
                  <div align="center">
                    <Divider hidden style={{ marginTop: -5 }}></Divider>
                    <Image
                      src={logoClient}
                      verticalAlign="middle"
                      size="small"
                    />
                    <Divider hidden style={{ marginTop: 5 }}></Divider>
                  </div>
                </Container>
              )}
              {this.state.navPublicClient === "BANCRIPT" && (
                <Container style={{ border: "none", backgroundColor: "black" }}>
                  <div align="center">
                    <Divider hidden style={{ marginTop: -5 }}></Divider>
                    <Image
                      src={logoBancript}
                      verticalAlign="middle"
                      style={{ width: 300, height: 80 }}
                    />
                    <Divider hidden style={{ marginTop: 5 }}></Divider>
                  </div>
                </Container>
              )}
              {this.state.navPublicClient === "CONVERTRUE" && (
                <Container
                  style={{ border: "none", backgroundColor: "#ffffff" }}
                >
                  <div align="center">
                    <Divider hidden style={{ marginTop: -5 }}></Divider>
                    <Image
                      src={logoConvertrue}
                      verticalAlign="middle"
                      size="medium"
                    />
                    <Divider hidden style={{ marginTop: 5 }}></Divider>
                  </div>
                </Container>
              )}
              <Menu.Menu
                position="right"
                className={
                  this.state.navPublicClient === "MAIN"
                    ? "nav-public"
                    : this.state.navPublicClient === "GMB" ||
                      this.state.navPublicClient === "BANCRIPT"
                    ? "nav-publicClient"
                    : "nav-publicConvertrue"
                }
              >
                <Menu.Item style={{ marginRight: "25px" }}>
                  <Icon
                    name="user circle"
                    size="large"
                    style={{
                      color:
                        this.state.navPublicClient !== "CONVERTRUE"
                          ? "white"
                          : "#207ef2",
                    }}
                  />

                  <Dropdown
                    text={t("navPublic.account.header")}
                    inline
                    id={
                      this.state.navPublicClient !== "CONVERTRUE"
                        ? "drop-nav-public"
                        : "drop-nav-public-convertrue"
                    }
                    icon={
                      <Icon
                        name="angle down"
                        style={{
                          color:
                            this.state.navPublicClient !== "CONVERTRUE"
                              ? "white"
                              : "#207ef2",
                        }}
                      />
                    }
                  >
                    <Dropdown.Menu as="div" id="list-options-drop">
                      {this.state.varlog === true && (
                        <div>
                          <Dropdown.Item as={Link} to={registrationtoken}>
                            <span className="list-item-custom-admin">
                              {t("navPublic.account.options.signup")}{" "}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to={logintoken}>
                            <span className="list-item-custom-admin">
                              {" "}
                              {t("navPublic.account.options.login")}{" "}
                            </span>
                          </Dropdown.Item>
                        </div>
                      )}
                      {this.state.varlog === false && (
                        <div>
                          <Dropdown.Item as={Link} to={"/registration"}>
                            <span className="list-item-custom-admin">
                              {t("navPublic.account.options.signup")}{" "}
                            </span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to={"/login"}>
                            <span className="list-item-custom-admin">
                              {" "}
                              {t("navPublic.account.options.login")}{" "}
                            </span>
                          </Dropdown.Item>
                        </div>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>

                <Menu.Item
                  style={{
                    marginRight:
                      this.state.navPublicClient !== "CONVERTRUE"
                        ? "25px"
                        : "110px",
                  }}
                  as={Link}
                  to="/HFTplans"
                  name="HFTplans"
                  onClick={this.handleItem.bind(this)}
                  id="balance-item"
                >
                  <Popup
                    trigger={
                      <p>
                        <Image
                          src={
                            this.state.navPublicClient !== "CONVERTRUE"
                              ? hftIcon
                              : hftIconConver
                          }
                          verticalAlign="middle"
                        />
                        <span
                          style={{
                            color:
                              this.state.navPublicClient !== "CONVERTRUE"
                                ? "white"
                                : "#207ef2",
                          }}
                        >
                          {t("navPublic.account.options.fixedTermAccounts")}{" "}
                        </span>
                      </p>
                    }
                    content={t("navPublic.account.options.fixedTermAccounts")}
                    position="bottom left"
                  />
                </Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>
          <Divider hidden />
          <Divider hidden />
          {this.state.navPublicClient !== "MAIN" && (
            <div>
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              {this.state.navPublicClient === "BANCRIPT" && (
                <div>
                  <Divider hidden />
                  <Divider hidden />
                  <Divider hidden />
                </div>
              )}
            </div>
          )}
          {!this.state.brokerPresentation && (
            <Menu text>
              <Container>
                <Menu.Item
                  as={Link}
                  to="/"
                  header
                  name="home"
                  id="home"
                  active={active === "home"}
                  onClick={this.handleItem.bind(this)}
                >
                  <Image style={{ height: 50 }} src={logo2} />
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/buy"
                  name="buy"
                  id="buy"
                  active={active === "buy"}
                  onClick={this.handleItem.bind(this)}
                >
                  <span className="menu-item2"> {t("navCommons.buy")} </span>
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/sell"
                  name="sell"
                  id="sell"
                  active={active === "sell"}
                  onClick={this.handleItem.bind(this)}
                >
                  <span className="menu-item2"> {t("navCommons.sell")} </span>
                </Menu.Item>

                {/* <Menu.Item
                                as={Link}
                                to="/whoweare"
                                name="whoweare"
                                id="whoweare"
                                active={active === "whoweare"}
                                onClick={this.handleItem.bind(this)}

                            >
                                <span className="menu-item2">{t("navCommons.help.options.who")}</span>
                            </Menu.Item> */}

                <Menu.Item
                  as={Link}
                  name="forum"
                  to="/forum"
                  id="forum"
                  onClick={this.handleItem.bind(this)}
                  active={active === "forum"}
                >
                  <span className="menu-item2"> {t("navCommons.forum")} </span>
                </Menu.Item>
                <Menu.Item>
                  <Dropdown
                    as="div"
                    id="help-new"
                    text={t("navCommons.help.header")}
                    icon={<Icon name="angle down" />}
                  >
                    <Dropdown.Menu as="div" id="list-options-drop">
                      <Dropdown.Item as={Link} to="/" disabled>
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.support")}{" "}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/faqs">
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.faqs")}{" "}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/limits">
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.limits")}{" "}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/charges">
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.charges")}{" "}
                        </span>
                      </Dropdown.Item>
                      {/* <Dropdown.Item onClick={this.onClickDownloadGuide} >
                                                <span className="list-item-custom-admin" > {t("navCommons.help.options.guide")} </span>
                                            </Dropdown.Item >
                                            <Dropdown.Item>
                                                <a href={blockchainPdf} target="_blank">
                                                    <span className="list-item-custom-admin">
                                                        {t("navCommons.help.options.blockchain")}
                                                    </span></a>
                                            </Dropdown.Item> */}
                      <Dropdown.Item as={Link} to="/legal">
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.legal")}{" "}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/contact">
                        <span className="list-item-custom-admin">
                          {" "}
                          {t("navCommons.help.options.contact")}{" "}
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
                <Menu.Menu position="right">
                  <Menu.Item
                    as={Link}
                    to="/moneyclick"
                    name="moneyclick"
                    id="moneyclick"
                    onClick={this.handleItem.bind(this)}
                  >
                    <Image src={logoMC} alt="" size="tiny" />
                  </Menu.Item>
                </Menu.Menu>
                {/*<Menu.Menu position="right" >
                                <Menu.Item id="item-country-custom" >
                                    <Button.Group style={
                                        { marginRight: "15px" }
                                    }
                                        size="mini" >
                                        <Button id="button-buy-menu"
                                            color="green"
                                            compact size="mini"
                                            name="buybutton"
                                            basic={this.state.buybutton}
                                            onClick={this.activeButtonBuy.bind(this)} > {t("navCommons.coins.buy")}
                                        </Button>
                                        <Button id="button-sell-menu"
                                            color="red"
                                            circular name="sellbutton"
                                            compact onClick={this.activeButtonSell.bind(this)}
                                            basic={this.state.sellbutton} > {t("navCommons.coins.sell")}
                                        </Button>
                                    </Button.Group >
                                    <Dropdown item={true}
                                        placeholder={t("navCommons.coins.options.placeholder")}
                                        floating onChange={this.handleCurrencyAction.bind(this)}
                                        options={this.state.listCountrys} />
                                </Menu.Item >
                            </Menu.Menu>*/}
              </Container>
            </Menu>
          )}
        </Responsive>

        <Responsive minWidth={0} maxWidth={991}>
          <SideNavBarPublic
            setView={this.handleSetView.bind(this)}
            handleClick={handleClick}
            onClickDownloadGuide={this.onClickDownloadGuide}
          />
        </Responsive>
      </div>
    );
  }
}
export default translate(NavPublic);
