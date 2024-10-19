import React, { Component } from "react";
import logo from "../../../img/logov2.png";
import { Sidebar, Menu, Container, Image, Icon } from "semantic-ui-react";
// Components
//import Otc from "../../OTC/OTC";

import Profile from "../../Profile/Profile";

import BalancesAndOperations from "../../Admin/BalancesAndOperations/BalancesAndOperations";
import Users from "../../Admin/Users/Users";
import AdSettings from "../../OTC/AdSettings/AdSettings";
import OperationsControl from "../../OTC/OperationsControl/OperationsControl";
import MarketModulator from "../../MarketModulator/MarketModulator";
import AdminDashboard from "../../AdminDashboard/AdminDashboard";
import ContainerInboxAdmin from "../../Containers/ContainerInboxAdmin";
class SideNavAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "",
      visible: false,
      homeactive: false
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
  handleItem(e, data) {
    this.setState({ activeView: data.name });
    this.props.setView(data.name);
  }
  handlePusher() {
    if (this._isMounted) {
      const { visible } = this.state;
      if (visible) this.setState({ visible: false });
    }
  }
  handleSetView(view) {
    this.setState({ activeView: view });
    this.props.setView(view);
  }
  handleToggle() {
    if (this._isMounted) {
      this.setState({ visible: !this.state.visible });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  setView(data) {
    this.setState({ homeactive: data });
  }

  render() {
    let s;
    let active = this.state.activeView;
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
          >
            <Menu.Item
              name="dashboard"
              active={active === "dashboard"}
              onClick={this.handleItem.bind(this)}
            >
              <span className="menu-item">Dashboard</span>
            </Menu.Item>
            <Menu.Item
              name="balancesAndOperations"
              active={active === "balancesAndOperations"}
              onClick={this.handleItem.bind(this)}
            >
              <span className="menu-item">
                Balances y operaciones de cuentas
              </span>
            </Menu.Item>
            <Menu.Item
              name="otcOferts"
              active={active === "otcOferts"}
              onClick={this.handleItem.bind(this)}
            >
              <span className="menu-item">Ofertas OTC</span>
            </Menu.Item>
            <Menu.Item
              name="otcOperations"
              active={active === "otcOperations"}
              onClick={this.handleItem.bind(this)}
            >
              <span className="menu-item">Operaciones OTC</span>
            </Menu.Item>
            <Menu.Item
              name="verifyUsersAccounts"
              onClick={this.handleItem.bind(this)}
              active={active === "verifyUsersAccounts"}
            >
              <span className="menu-item">Usuarios</span>
            </Menu.Item>
            <Menu.Item
              name="marketModulator"
              onClick={this.handleItem.bind(this)}
              active={active === "marketModulator"}
            >
              {" "}
              <span className="menu-item">Modulador de mercado</span>
            </Menu.Item>
            <Menu.Item
              name="profile"
              onClick={this.handleItem.bind(this)}
              active={active === "profile"}
            >
              <span className="menu-item">Perfil</span>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={false}
            onClick={this.handlePusher.bind(this)}
            style={{ minHeight: "100vh" }}
          >
            <Menu fixed="top" inverted className="nav">
              <Menu.Item
                name="dashboard"
                active={this.state.active === "dashboard"}
                onClick={this.handleItem.bind(this)}
              >
                <Image size="small" src={logo} />
              </Menu.Item>
              {<ContainerInboxAdmin />}
              <Menu.Item onClick={this.handleToggle.bind(this)}>
                <Icon name="sidebar" />
              </Menu.Item>
            </Menu>
            <Container style={{ marginTop: "6em" }}>
              {this.state.activeView === "balancesAndOperations" && (
                <div>
                  <BalancesAndOperations />
                </div>
              )}
              {this.state.activeView === "masterModulator" && (
                <div>
                  <MarketModulator />
                </div>
              )}
              {this.state.activeView === "otcOferts" && (
                <div>
                  <AdSettings />
                </div>
              )}
              {this.state.activeView === "otcOperations" && (
                <div>
                  <OperationsControl />
                </div>
              )}
              {this.state.activeView === "verifyUsersAccounts" && (
                <div>
                  <Users />
                </div>
              )}
              {this.state.activeView === "profile" && (
                <div>
                  <Profile />
                </div>
              )}
              {this.state.activeView === "dashboard" && (
                <div>
                  <AdminDashboard />
                </div>
              )}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      );
    }
    return <div>{s}</div>;
  }
}
export default SideNavAdmin;
