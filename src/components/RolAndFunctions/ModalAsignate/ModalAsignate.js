import React, { Component } from "react";
import {
	Modal,
	Segment,
	Button,
	Grid,
	Header,
	Form,
	Dropdown,
	Message,
} from "semantic-ui-react";
import user from "../../../services/user";
class ModalAsignate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOperators: [],
			show: false,
			seletedOperators: [],
			searchQuery: null,
			loading: true,
			sendPost: false,
			viewMessage: false,
			textMessage: "",
			colorMessage: "",
		};
	}
	componentDidMount() {
		// user
		//   .getUsersInfo()
		//   .then(resp => {
		//     let array = [];
		//     for (let userdata of resp.data.result.users) {
		//       if (userdata.type === "ADMIN") {
		//         let data = {
		//           key: user.getActualUserInfo(userdata).email,
		//           text: user.getActualUserInfo(userdata).email,
		//           value: user.getActualUserInfo(userdata).email
		//         };

		//         array.push(data);
		//       }
		//     }

		//     this.setState({ listOperators: array, loading: false });
		//   })
		//   .catch(error => {
		//     //console.log(error);
		//   });

		let listEmail = [];
		let infoUser = "";
		let data = {};
		user
			.listNamesByIndexAndValue("type", "ADMIN")
			.then((resp) => {
				console.log(resp);
				let array = [];
				Object.entries(resp.data).forEach(([key, value]) => {
					data = {
						key: value,
						text: value,
						value: value,
					};

					listEmail.push(data);
				});
				console.log(listEmail);
				this.setState({ listOperators: listEmail, loading: false });
				// let body1 = {
				// 	userNames: listEmail,
				// };

				// user
				// 	.getUserConfigs(body1)
				// 	.then((resp) => {
				// 		Object.entries(resp.data).forEach(([ke, val]) => {
				// 			Object.entries(val).forEach(([k, v]) => {
				// 				let data = user.getActualUserInfo(v);
				// 				array.push(data);
				// 			});
				// 		});
				// 	})
				// 	.catch((error) => {
				// 		console.log(error);
				// 	});

				// let body2 = {
				// 	users: listEmail,
				// };

				// user
				// 	.getListAllRolToUser(body2)
				// 	.then((resp) => {
				// 		for (let resul of resp.data.payload) {
				// 			let itemUser = array.find(function (element) {
				// 				return element.name === resul.email;
				// 			});
				// 			let rolName, rolId;
				// 			if (resul.rol !== null) {
				// 				rolId = resul.rol.id;
				// 				rolName = resul.rol.name;
				// 			}
				// 			if (itemUser !== undefined) {
				// 				itemUser.nameRol = rolName;
				// 				itemUser.idRol = rolId;
				// 				this.setState({
				// 					listOperators: [...this.state.listOperators, itemUser],
				// 				});
				// 			}
				// 		}
				// 		this.setState({ show: true });
				// 		//						console.log(this.state.listOperators);
				// 	})
				// 	.catch((error) => {
				// 		this.setState({ show: true });
				// 	});
			})
			.catch((error) => {
				//	this.setState({ show: true, errorInRed: true });
			});
	}
	handleChange(e, { value }) {
		this.setState({ seletedOperators: value });
	}
	handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
	handleCancelAsig() {
		this.setState({ seletedOperators: [] });
		this.props.cancelAsig();
	}
	handleConfirAsig() {
		if (this.state.seletedOperators.length > 0) {
			let body = {
				rol: this.props.rolSeleted,
				users: this.state.seletedOperators,
			};
			this.setState({ loading: true });
			user
				.multiAsignateRol(body)
				.then((resp) => {
					if (resp.data.payload) {
						this.setState({
							viewMessage: true,
							textMessage: "El rol ha sido asignado a los usuarios",
							colorMessage: "blue",
							sendPost: true,
							loading: false,
						});
					} else {
						this.setState({
							viewMessage: true,
							textMessage:
								"Este rol no ha podido ser encontrado intente de nuevo",
							colorMessage: "red",
							loading: false,
						});
					}
				})
				.catch((error) => {
					//console.log(error);
					this.setState({
						viewMessage: true,
						textMessage: "Ha ocurrido un error de conexión, intente mas tarde",
						colorMessage: "red",
						loading: false,
						sendPost: true,
					});
				});
		} else {
			this.setState({
				viewMessage: true,
				textMessage: "Debe escoger por lo menos un operador",
				colorMessage: "red",
			});
			setTimeout(() => {
				this.setState(
					{
						viewMessage: false,
						textMessage: "",
						colorMessage: "",
					},
					8000,
				);
			});
		}
	}
	render() {
		let name;
		if (
			this.props.rolSeleted.name !== "" &&
			this.props.rolSeleted.name !== undefined
		) {
			name = this.props.rolSeleted.name;
		} else {
			name = "";
		}
		return (
			<Modal open={this.props.show}>
				<Header>Rol: {name}</Header>
				<Modal.Content>
					<Segment basic loading={this.state.loading}>
						<Grid>
							<Grid.Column
								largeScreen={16}
								computer={16}
								tablet={16}
								mobile={16}>
								<Form>
									<Form.Field>
										<label>
											Seleccione los usuarios a los cuales asignará el rol
										</label>
										<Dropdown
											placeholder='Operadores'
											fluid
											multiple
											search
											selection
											onChange={this.handleChange.bind(this)}
											onSearchChange={this.handleSearchChange.bind(this)}
											value={this.state.seletedOperators}
											options={this.state.listOperators}
										/>
									</Form.Field>
								</Form>
							</Grid.Column>
						</Grid>
						{this.state.viewMessage && (
							<Message color={this.state.colorMessage}>
								{this.state.textMessage}
							</Message>
						)}
					</Segment>
				</Modal.Content>
				<Modal.Actions>
					{!this.state.sendPost && (
						<Button
							color='grey'
							onClick={this.handleCancelAsig.bind(this)}
							disabled={this.state.loading}>
							Cancelar
						</Button>
					)}
					{this.state.sendPost && (
						<Button
							color='grey'
							onClick={this.handleCancelAsig.bind(this)}
							disabled={this.state.loading}>
							Cerrar
						</Button>
					)}
					{!this.state.sendPost && (
						<Button
							color='blue'
							onClick={this.handleConfirAsig.bind(this)}
							disabled={this.state.loading}>
							Guardar
						</Button>
					)}
				</Modal.Actions>
			</Modal>
		);
	}
}
export default ModalAsignate;
