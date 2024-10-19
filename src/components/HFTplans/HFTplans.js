import React, { Component } from "react";
import "./HFTplans.css";
import "./HFTplansMobile.css";
import { Menu, Segment, Dimmer, Responsive } from "semantic-ui-react";
import userService from "../../services/user";
import modelService from "../../services/model";
import translate from "../../i18n/translate";
import ListPlans from "./ListPlans";
import ListPlansMobile from "./ListPlansMobile";
import MyPlans from "./MyPlans";
class HFTplans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      translator: props.translate,
    };
  }
  state = { activeItem: "", showMyPlans: false, loadingHFT: true };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  componentDidMount() {
    this.getMyPlans();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  getMyPlans = () => {
    if (userService.getUserAuth()) {
      modelService
        .modelListUser(userService.getUserName())
        .then((res) => {
          let listMyPlans = res.data.result.models;
          if (listMyPlans !== undefined && listMyPlans.length > 0) {
            this.setState({ activeItem: "myPlans" });
            this.setState({ showMyPlans: true });
          } else {
            this.setState({ activeItem: "listPlans" });
          }
          this.setState({ loadingHFT: false });
        })
        .catch((error) => {
          //console.log(error);
        });
    } else {
      this.setState({ activeItem: "listPlans" });
      this.setState({ loadingHFT: false });
    }
  };
  render() {
    let t = this.state.translator;
    const { activeItem } = this.state;
    return (
      <div>
        <Responsive minWidth={992}>
          {this.state.loadingHFT && <Dimmer active inverted />}
          <Menu pointing>
            <Menu.Item
              content={t("hft.listPlans.title")}
              name="listPlans"
              active={activeItem === "listPlans"}
              onClick={this.handleItemClick}
            />
            {userService.getUserAuth() && this.state.showMyPlans && (
              <Menu.Item
                content={t("hft.myPlans.title")}
                name="myPlans"
                active={activeItem === "myPlans"}
                onClick={this.handleItemClick}
              />
            )}
          </Menu>

          {activeItem === "listPlans" && (
            <ListPlans
              HFTplans={this.getMyPlans.bind(this)}
              setItem={this.props}
              token={this.props.token}
            />
          )}
          {activeItem === "myPlans" && (
            <Segment color="orange">
              <MyPlans />
            </Segment>
          )}
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          {this.state.loadingHFT && <Dimmer active inverted />}

          {activeItem === "listPlans" && (
            <ListPlansMobile
              HFTplans={this.getMyPlans.bind(this)}
              setItem={this.props}
              token={this.props.token}
            />
          )}
          {activeItem === "myPlans" && (
            // <Segment color="orange">
            <MyPlans />
            // </Segment>
          )}
        </Responsive>
      </div>
    );
  }
}

export default translate(HFTplans);
