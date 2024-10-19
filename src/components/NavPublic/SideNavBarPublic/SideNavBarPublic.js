import React, { Component } from "react";
import logo2 from "../../../img/logoDollarBtc.png";
import gmb from "../../../img/logo-gmb-responsive.png";
import bancript from "../../../img/Bancript.png";
import logo3 from "../../../img/512.png";
import {
  Sidebar,
  Menu,
  Container,
  Image,
  Icon,
  Divider,
  Dropdown,
  Grid,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

// Components
import Home from "../../Home/Home";
import Registration from "../../Registration/Registration";
import Login from "../../Login/Login";
import CompleteAccount from "../../Registration/CompleteAccount";
import HFTPlans from "../../HFTplans/HFTplans";
import Forum from "../../Forum/Forum";
import BuyBitcoins from "../../BuyBitcoins/BuyBitcoins";
import SellBitcoins from "../../SellBitcoins/SellBitcoins";
import WhoWeAre from "../../Help/WhoWeAre/WhoWeAre";
import ContactUs from "../../ContactUs/ContactUs";
import Faqs from "../../Faqs/Faqs";
import "./SideNavBarPublic.css";
import Moneyclick from "../../Moneyclick/Moneyclick";
import Broker from "../../Brokers/Brokers";
import translate from "../../../i18n/translate";
import logoMC from "../../../img/logoNuevoMC.jpg";
import logoConvertrue from "../../../img/convertrue.png";
import logoBROKER from "../../../img/brokers.png";
import ForgotPassword from "../../ForgotPassword/ForgotPassword";
import LoginTwoFactor from "../../LoginTwoFactor/LoginTwoFactor";
import blockchainPdf from "../../../common/Blockchain_ la revolucion indus - Preukschat (Coordinador).pdf";
import Charges from "../../Charges/Charges";
import LimitsOperations from "../../LimitsOfOperations/LimitsOfOperations";
import Legal from "../../Legal/Legal";
import packageJson from "../../../../package.json";
class SideNavBarPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "home",
      visible: false,
      homeactive: false,
      sideNavPublicClient: packageJson.designCompany,
      translator: props.translate,
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    let path = window.location.pathname.split("/");
    if (path[1] !== "") {
      this.setState({ activeView: path[1] });
    } else {
      this.setState({ activeView: "home" });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  handleItem(e, data) {
    this.setState({ activeView: data.name });
    this.props.setView(data.name);
    this.handleToggle();
  }
  handleItemHome(e, data) {
    this.setState({ activeView: data.name });
    this.props.setView(data.name);
  }
  handleSetView(view) {
    this.setState({ activeView: view });
    this.props.setView(view);
  }
  handlePusher() {
    if (this._isMounted) {
      const { visible } = this.state;
      if (visible) this.setState({ visible: false });
    }
  }
  handleToggle() {
    if (this._isMounted) {
      this.setState({ visible: !this.state.visible });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleSubitemHelp(e, data) {
    if (this._isMounted) {
      this.setState({ activeView: data.value });
      this.props.setView(data.value);
      this.handleToggle();
    }
  }
  setView(data) {
    this.setState({ homeactive: data });
  }
  render() {
    let t = this.state.translator;
    let friendOptions = [
      { text: t("navPublic.lang.resume.en"), value: "en", disabled: false },
      { text: t("navPublic.lang.resume.es"), value: "es" },
    ];
    let active = this.state.activeView;
    let s;
    let { handleClick } = this.props;
    if (this._isMounted) {
      s = (
        <Sidebar.Pushable>
          <Sidebar
            className="nav"
            as={Menu}
            animation="push"
            direction="left"
            icon="labeled"
            inverted
            vertical
            visible={this.state.visible}
            width="thin"
            style={{ backgroundColor: "#ffffff" }}
          >
            <Menu.Item
              name="home"
              as={Link}
              to="/home"
              active={active === "home"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <span className="menu-item-mobile">{t("nav.init")}</span>
            </Menu.Item>
            <Menu.Item
              name="buy"
              as={Link}
              to="/buy"
              active={active === "buy"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <span className="menu-item-mobile">
                {t("navPublic.account.options.buy")}
              </span>
            </Menu.Item>
            <Menu.Item
              name="sell"
              as={Link}
              to="/sell"
              active={active === "sell"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <span className="menu-item-mobile">
                {t("navPublic.account.options.sell")}
              </span>
            </Menu.Item>
            <Menu.Item
              name="forum"
              as={Link}
              to="/forum"
              active={active === "forum"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <span className="menu-item-mobile">
                {t("navPublic.account.options.forum")}
              </span>
            </Menu.Item>
            <Menu.Item
              name="HFTplans"
              as={Link}
              to="/HFTplans"
              active={active === "HFTplans"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              <span className="menu-item-mobile">
                {t("navPublic.account.options.hft")}
              </span>
            </Menu.Item>
            <Menu.Item
              id="registration"
              name="registration"
              as={Link}
              to="/registration"
              active={active === "registration"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              {" "}
              <span className="menu-item-mobile">
                {t("navPublic.account.options.signup")}
              </span>
            </Menu.Item>
            <Menu.Item
              id="login"
              name="login"
              as={Link}
              to="/login"
              active={active === "login"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              {" "}
              <span className="menu-item-mobile">
                {t("navPublic.account.options.login")}
              </span>
            </Menu.Item>
            <Menu.Item
              id="faqs"
              name="faqs"
              as={Link}
              to="/faqs"
              active={active === "faqs"}
              onClick={this.handleItem.bind(this)}
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              {" "}
              <span className="menu-item-mobile">
                {t("navCommons.help.options.faqs")}
              </span>
            </Menu.Item>
            <Dropdown
              style={{
                backgroundColor:
                  this.state.sideNavPublicClient === "GMB" ||
                  this.state.sideNavPublicClient === "BANCRIPT"
                    ? "#000000"
                    : "#207ef2",
                textAlign: "left",
                fontWeight: "bold",
              }}
              item
              text={
                <span
                  className="menu-item-mobile"
                  style={{ color: "white", fontSize: "11px" }}
                >
                  {t("navCommons.help.header")}
                </span>
              }
            >
              <Dropdown.Menu
                id="list-options-drop-side-public"
                style={{
                  backgroundColor:
                    this.state.sideNavPublicClient === "GMB" ||
                    this.state.sideNavPublicClient === "BANCRIPT"
                      ? "#000000"
                      : "#207ef2",
                  color: "white",
                  fontSize: "11px",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                <Dropdown.Item
                  value="support"
                  onClick={this.handleSubitemHelp.bind(this)}
                  disabled
                >
                  <span
                    className="list-item-custom-admin-side"
                    style={{
                      backgroundColor:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {t("navCommons.help.options.support")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="limits"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/limits"
                >
                  <span
                    className="list-item-custom-admin-side"
                    style={{
                      backgroundColor:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("navCommons.help.options.limits")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="charges"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/charges"
                >
                  <span
                    className="list-item-custom-admin-side"
                    style={{
                      backgroundColor:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("navCommons.help.options.charges")}
                  </span>
                </Dropdown.Item>
                {/* <Dropdown.Item onClick={this.props.onClickDownloadGuide}>
                  <span
                    className="list-item-custom-admin"
                    style={{
                      backgroundColor: "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}
                  >
                    {t("navCommons.help.options.guide")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <a href={blockchainPdf} target="_blank">
                    <span
                      className="list-item-custom-admin"
                      style={{
                        backgroundColor: "#207ef2",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: "bold"
                      }}
                    >
                      {t("navCommons.help.options.blockchain")}
                    </span>
                  </a>
                </Dropdown.Item> */}
                <Dropdown.Item
                  value="legal"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/legal"
                >
                  <span
                    className="list-item-custom-admin-side"
                    style={{
                      backgroundColor:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("navCommons.help.options.legal")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  value="contact"
                  onClick={this.handleSubitemHelp.bind(this)}
                  as={Link}
                  to="/contact"
                >
                  <span
                    className="list-item-custom-admin-side"
                    style={{
                      backgroundColor:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("navCommons.help.options.contact")}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item style={{ backgroundColor: "#ffffff" }}>
              <Menu.Item
                as={Link}
                to="/moneyclick"
                name="moneyclick"
                id="moneyclick"
                onClick={this.handleItem.bind(this)}
                style={{ marginLeft: -23 }}
              >
                <Image src={logoMC} alt="" size="big" />
              </Menu.Item>
              {/* <Menu.Item
                as={Link}
                to="/brocker"
                name="broker"
                id="broker"
                onClick={this.handleItem.bind(this)}
              >
                <label className="nav-publicBrokers-question">
                  ¿Eres Broker?
                </label>
                <br></br>
                <label className="nav-publicBrokers-question">
                  Seleccione aqui!
                </label>
                <br></br>
                <br></br>
                <Image src={logoBROKER} alt="" size="big" />
              </Menu.Item> */}
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher style={{ minHeight: "100vh" }}>
            <Menu
              fixed="top"
              inverted
              className="nav"
              style={{ backgroundColor: "white" }}
            >
              <Menu.Item
                //style={{ marginRight: "20px" }}
                position="left"
                style={{ backgroundColor: "white" }}
                onClick={this.handleToggle.bind(this)}
              >
                <span>
                  <Icon
                    name="bars"
                    size="large"
                    style={{
                      color:
                        this.state.sideNavPublicClient === "GMB" ||
                        this.state.sideNavPublicClient === "BANCRIPT"
                          ? "#000000"
                          : "#207ef2",
                    }}
                    inverted
                  />
                </span>
              </Menu.Item>
              <Menu.Item
                name="home"
                id="home"
                active={active === "home"}
                onClick={this.handleItemHome.bind(this)}
                style={{ marginRight: "-5px" }}
                as={Link}
                to="/"
              >
                <span>
                  <Image
                    style={{
                      width:
                        this.state.sideNavPublicClient === "CONVERTRUE"
                          ? 160
                          : this.state.sideNavPublicClient === "MAIN"
                          ? 180
                          : 150,
                      height:
                        this.state.sideNavPublicClient === "CONVERTRUE"
                          ? 33
                          : this.state.sideNavPublicClient === "MAIN"
                          ? 66
                          : 50,
                    }}
                    src={
                      this.state.sideNavPublicClient === "MAIN"
                        ? logo2
                        : this.state.sideNavPublicClient === "CONVERTRUE"
                        ? logoConvertrue
                        : this.state.sideNavPublicClient === "GMB"
                        ? gmb
                        : bancript
                    }
                  />
                </span>
              </Menu.Item>
              <Menu.Item position="right">
                <span>
                  <Dropdown
                    id={
                      this.state.sideNavPublicClient === "GMB" ||
                      this.state.sideNavPublicClient === "BANCRIPT"
                        ? "lengu-selectGmb"
                        : "lengu-select"
                    }
                    style={{ marginLeft: "-25px" }}
                    inline
                    icon={
                      <Icon
                        name="angle down"
                        inverted
                        style={{
                          color:
                            this.state.sideNavPublicClient === "GMB" ||
                            this.state.sideNavPublicClient === "BANCRIPT"
                              ? "#000000"
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

              {/* <Menu.Menu position="left" className="nav">
                 <Menu.Item onClick={this.handleToggle.bind(this)}>
                  <Icon name="sidebar" size="mini" />
                </Menu.Item>
              </Menu.Menu>*/}
            </Menu>
            {/* <Menu widths={1} id="home-mobile-version-menu">
               <Menu.Item
              // name="home"
              // id="home"
              // active={active === "home"}
              // onClick={this.handleItem.bind(this)}
              >
                {/* <Image style={{ width: 220, height: 70 }} src={logo2} />
              </Menu.Item>
            </Menu>*/}
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Grid columns="equal" id="grid-mobile-home">
              <Grid.Row textAlign="center">
                <Grid.Column mobile={6} tablet={6} />
                <Grid.Column textAlign="center" mobile={5} tablet={5}>
                  <Segment id="segment-style-home-mobile" textAlign="center">
                    {/*
                        ===================Menu central OVALADO========================
                    <Dropdown
                      item
                      icon={
                        <Icon name="bars" size="large" color="grey" inverted />
                      }
                    >
                      <Dropdown.Menu id="list-options-drop-side-public-mobile-version">
                        <Dropdown.Item
                          name="buy"
                          id="buy-mobile"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navCommons.buyMobile")}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          name="sell"
                          id="sell-mobile"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navCommons.sellMobile")}
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          name="forum"
                          id="forum-mobile"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navCommons.forumMobile")}
                          </span>
                        </Dropdown.Item>

                        <Dropdown.Item
                          as={Link}
                          name="HFTplans"
                          to="/HFTplans"
                          id="HFTplans"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navPublic.account.options.hft")}
                          </span>
                        </Dropdown.Item>

                        <Dropdown.Item
                          as={Link}
                          name="registration"
                          to="/registration"
                          id="registration"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navPublic.account.options.signup")}
                          </span>
                        </Dropdown.Item>

                        <Dropdown.Item
                          as={Link}
                          name="login"
                          to="/login"
                          id="login"
                          onClick={this.handleItem.bind(this)}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navPublic.account.options.login")}
                          </span>
                        </Dropdown.Item>

                        {/* <Dropdown.Item
                          as={Link}
                          name="whoweare"
                          to="/whoweare"
                          id="whoweare"
                          onClick={this.handleItem.bind(this)}
                          style={{
                            marginRight: "0px",
                            borderRightStyle: "hidden"
                          }}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navCommons.help.options.who")}
                          </span>
                        </Dropdown.Item> */}

                    {/* <Dropdown.Item
                          as={Link}
                          name="faqs"
                          to="/faqs"
                          id="faqs-mobile"
                          onClick={this.handleItem.bind(this)}
                          style={{ borderRigth: "0px" }}
                        >
                          <span className="list-item-custom-admin-side">
                            {t("navCommons.help.options.faqs")}
                          </span>
                        </Dropdown.Item>

                        <Dropdown.Item>
                          <Dropdown
                            as="div"
                            style={{ color: "#0066ff" }}
                            id="help-new"
                            text={t("navCommons.help.headerMobile")}
                            icon={
                              <Icon
                                name="angle down"
                                style={{ marginLeft: "50px" }}
                              />
                            }
                          >
                            <Dropdown.Menu
                              as="div"
                              id="list-options-drop"
                              style={{ right: "-50px", left: "-55px" }}
                              position="center"
                              size="medium"
                            >
                              <Dropdown.Item as={Link} to="/" disabled>
                                <span className="list-item-custom-admin-side">
                                  {t("navCommons.help.options.support")}
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={this.props.onClickDownloadGuide}
                              >
                                <span className="list-item-custom-admin-side">
                                  {t("navCommons.help.options.guide")}
                                </span>
                              </Dropdown.Item>

                              <Dropdown.Item
                                as={Link}
                                to="/contact"
                                name="contact"
                                onClick={this.handleItem.bind(this)}
                              >
                                <span className="list-item-custom-admin-side">
                                  {t("navCommons.help.options.contact")}
                                </span>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>*/}
                  </Segment>
                </Grid.Column>
                <Grid.Column mobile={5} tablet={5} />
              </Grid.Row>
            </Grid>
            <Container style={{ marginTop: "1em" }}>
              {this.state.activeView === "home" && (
                <div>
                  <Home
                    setItem={this.handleSetView.bind(this)}
                    setView={this.setView.bind(this)}
                  />
                </div>
              )}
              {this.state.activeView === "buy" && (
                <div>
                  <BuyBitcoins setView={this.setView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "sell" && (
                <div>
                  <SellBitcoins setView={this.setView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "forum" && (
                <div>
                  <Forum />
                </div>
              )}
              {this.state.activeView === "login" && (
                <div>
                  <Login setView={this.handleSetView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "registration" && (
                <div>
                  <Registration setView={this.setView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "HFTplans" && (
                <div>
                  <HFTPlans setItem={this.handleSetView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "whoweare" && (
                <div>
                  <WhoWeAre />
                </div>
              )}
              {this.state.activeView === "contact" && (
                <div>
                  <ContactUs />
                </div>
              )}
              {this.state.activeView === "faqs" && (
                <div>
                  <Faqs />
                </div>
              )}
              {this.state.activeView === "moneyclick" && (
                <div>
                  <Moneyclick />
                </div>
              )}
              {this.state.activeView === "forgotPassword" && (
                <div>
                  <ForgotPassword />
                </div>
              )}
              {this.state.activeView === "loginTwoFactor" && (
                <div>
                  <LoginTwoFactor />
                </div>
              )}
              {this.state.activeView === "completeAccount" && (
                <div>
                  <CompleteAccount setView={this.handleSetView.bind(this)} />
                </div>
              )}
              {this.state.activeView === "charges" && (
                <div>
                  <Charges />
                </div>
              )}
              {this.state.activeView === "limits" && (
                <div>
                  <LimitsOperations />
                </div>
              )}
              {this.state.activeView === "legal" && (
                <div>
                  <Legal />
                </div>
              )}
              {/* {this.state.activeView === "broker" && (
                <div>
                  <Broker />
                </div>
              )} */}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      );
    }
    return <div>{s}</div>;
  }
}
export default translate(SideNavBarPublic);
