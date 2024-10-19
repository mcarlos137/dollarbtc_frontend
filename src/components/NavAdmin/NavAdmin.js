import React, { Component } from "react";
import { Menu, Container, Responsive, Image, Icon,Checkbox } from "semantic-ui-react";
import { Link } from "react-router-dom";
import SideNavAdmin from "./SideNavAdmin/SideNavAdmin";
import logo from "../../img/logov2.png";
import "./NavAdmin.css";
import ContainerInboxAdmin from "../Containers/ContainerInboxAdmin";
import ContainerMenuNavAdmin from "../Containers/ContainerNavAdmin";
import user from "../../services/user";

class NavAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: "dashboard",
      checked:false,
      screenWith: window.innerWidth,
      actionsUser: []
    };
  }
  handleSetView(view) {
    this.setState({ activeView: view });
  }
  handleItem(e, data) {
    this.setState({ activeView: data.name });
  }
  handleChangeScreen(e, data) {
    this.setState({ screenWith: data.width });
  }
  componentDidMount() {
    let data = user.getUserRol();
    if (data !== null) {
      this.setState({ actionsUser: data.functionsAvailables });
    }
  }
  componentWillMount() {
    let data = user.getUserRol();
    if (data !== null) {
      this.setState({ actionsUser: data.functionsAvailables });
    }
    if(window.sessionStorage.getItem("modeAdmin")==="true"){
      this.setState({ checked: true });
    }
    if(window.sessionStorage.getItem("modeAdmin")==="false"){
      this.setState({ checked: false });
    }
  }
  componentDidUpdate() {}

  handleMode = (e, data) => {
   window.sessionStorage.setItem("modeAdmin", data.checked);
   this.setState({ checked: data.checked });
  };

  render() {
    let active = this.state.activeView;
    return (
      <div>
        <Responsive
          minWidth={Responsive.onlyTablet.minWidth}
          onUpdate={this.handleChangeScreen.bind(this)}
        >
          <Menu
            fixed="top"
            compact
            text
            stackable
            className="nav-admin"
            size="tiny"
          >
            <Container>
              <Menu.Item
                as={Link}
                to="/dashboard"
                header
                className="logo-item"
                name="dashboard"
                active={active === "dashboard"}
                onClick={this.handleItem.bind(this)}
              >
                <Image src={logo} className="logo" style={{ height: 30 }} />
              </Menu.Item>
              <Menu.Menu position="right" className="nav-admin">
                <Menu.Item style={{ marginRight: "10px" }}>
                <Menu.Item style={{ marginRight: "10px" }} inverted>
                   <span style={{ color: "white" }}>{"Modo Trabajo off/on :  "}</span>
                  <Checkbox style={{  marginLeft: "10px"}} toggle onChange={this.handleMode.bind(
                                    this
                                  )} checked={this.state.checked}/>              
                </Menu.Item>
                  <Link to="/dashboard">
                    <Icon name="dashboard" size="big" inverted />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <ContainerMenuNavAdmin />{" "}
                </Menu.Item>
                <Menu.Item style={{ marginLeft: "25px!important" }}>
                  <ContainerInboxAdmin />
                </Menu.Item>
                <Menu.Item>
                  <Link to="/profile">
                    <Icon name="user circle" size="big" inverted />
                  </Link>
                </Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>
        </Responsive>
        <Responsive minWidth={0} maxWidth={768}>
          <SideNavAdmin setView={this.handleSetView.bind(this)} />
        </Responsive>
      </div>
    );
  }
}
export default NavAdmin;
