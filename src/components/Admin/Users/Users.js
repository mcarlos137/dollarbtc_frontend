import React, { Component } from "react";
import "../../Admin/Admin.css";
import { Menu, Segment, Container } from "semantic-ui-react";
import userService from "../../../services/user";
import UserAdministration from "./UserAdministration/UserAdministration";
import UserBalance from "./UserBalance/UserBalance";
import ProfileBalance from "./ProfileBalance/ProfileBalance";
import ContainerUserVerification from "../../Containers/ContainerUserVerification";
import Useralerts from "./UserAlerts/UserAlerts";

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: "",
			actionsUser: [],
		};
	}
	componentDidMount() {
		let availableFunctionsUser = userService.getUserRol();
		if (availableFunctionsUser !== null) {
			let arrayFunctions = availableFunctionsUser.functionsAvailables;
			let nameItem = "";
			if (arrayFunctions.indexOf("users_verifications") !== -1) {
				nameItem = "userVerification";
			} else {
				if (arrayFunctions.indexOf("users_data") !== -1) {
					nameItem = "userBalance";
				} else {
					if (arrayFunctions.indexOf("users_profiles") !== -1) {
						nameItem = "userProfile";
					} else {
						nameItem = "userAdministration";
					}
				}
			}
			this.setState({
				actionsUser: arrayFunctions,
				activeItem: nameItem,
			});
		}
		//  this.setState({ actionsUser: new Array() });
	}
	handleItemClick = (e, { name }) => this.setState({ activeItem: name });
	render() {
		return (
			<Container>
				<Menu size='large' pointing>
					{this.state.actionsUser.indexOf("users_verifications") !== -1 && (
						<Menu.Item
							content='Procesos de verificación'
							name='userVerification'
							active={this.state.activeItem === "userVerification"}
							onClick={this.handleItemClick}
						/>
					)}
					{this.state.actionsUser.indexOf("users_data") !== -1 && (
						<Menu.Item
							content='Datos de usuarios'
							name='userBalance'
							active={this.state.activeItem === "userBalance"}
							onClick={this.handleItemClick}
						/>
					)}
					{this.state.actionsUser.indexOf("users_profiles") !== -1 && (
						<Menu.Item
							content='Perfiles de usuarios'
							name='userProfile'
							active={this.state.activeItem === "userProfile"}
							onClick={this.handleItemClick}
						/>
					)}
					{this.state.actionsUser.indexOf("users_administration") !== -1 && (
						<Menu.Item
							content='Administrar usuarios'
							name='userAdministration'
							active={this.state.activeItem === "userAdministration"}
							onClick={this.handleItemClick}
						/>
					)}
					{/* {this.state.actionsUser.indexOf("users_alerts") !== -1 && ( */}
					<Menu.Item
						content='Lista de Alertas'
						name='userAlerts'
						active={this.state.activeItem === "userAlerts"}
						onClick={this.handleItemClick}
					/>
					{/* )} */}
				</Menu>
				<Segment color='orange'>
					{this.state.activeItem === "userVerification" && (
						<Container as={ContainerUserVerification} />
					)}
					{this.state.activeItem === "userBalance" && (
						<Container as={UserBalance} />
					)}
					{this.state.activeItem === "userProfile" && (
						<Container as={ProfileBalance} />
					)}
					{this.state.activeItem === "userAdministration" && (
						<Container as={UserAdministration} />
					)}
					{this.state.activeItem === "userAlerts" && (
						<Container as={Useralerts} />
					)}
				</Segment>
			</Container>
		);
	}
}

export default Users;
