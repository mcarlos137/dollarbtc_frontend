import React, { Component } from "react";
import {
  Menu
} from "semantic-ui-react";
import Groups from "./Groups";
import Topics from "./Topics";
import SendNotifications from "./SendNotifications";
class Notifications extends Component {
  state = {
    activeItem: "groups",
    userDetailModal: false,
    userInfo: {}
  };
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        <Menu size="large" pointing>
          <Menu.Item
            content="Grupos"
            name="groups"
            active={activeItem === "groups"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Temas"
            name="topics"
            active={activeItem === "topics"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            content="Notificaciones"
            name="notifications"
            active={activeItem === "notifications"}
            onClick={this.handleItemClick}
          />
        </Menu>
        
        {this.state.activeItem === "groups" && <Groups />}
        {this.state.activeItem === "topics" && (<Topics />)}
        {this.state.activeItem === "notifications" && (<SendNotifications />)}
      </div>
    );
  }
}

export default Notifications;