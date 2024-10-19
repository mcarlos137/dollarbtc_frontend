import React, { Component } from "react";
import ReactTable from "react-table";
import {
	Modal,
	Button,
	Segment,
	Divider,
	Header,
	Dimmer,
	Loader,
	Message,
} from "semantic-ui-react";
import user from "../../../services/user";
import ModalCustomizeOperator from "./ModalCustomizeOperator/ModalCustomizeOperator";
class Operators extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOperators: [],
			show: false,
			showDeleleConfirm: false,
			showModify: false,
			emailDeleted: "",
			userModify: {},
			userDeleted: {},
			load: false,
			textMessage: "",
			viewMessage: false,
			colorMessage: "",
			endDelete: false,
			errorInRed: false,
			listRol: [],
		};
		this.initData = this.initData.bind(this);
		this.handleModifyOperator = this.handleModifyOperator.bind(this);
	}

	componentDidMount() {
		this.initData();
		let rolsAvailables = [];
		user
			.getAllRols()
			.then((respr) => {
				for (let rol of respr.data.payload) {
					let ob = {
						key: rol.id,
						text: rol.name,
						value: rol,
					};
					rolsAvailables.push(ob);
				}
				this.setState({ listRol: rolsAvailables });
			})
			.catch((error) => {});
	}
	initData() {
		this.setState({ listOperators: [], show: false });
		let listEmail = [];
		let infoUser = "";
		user
			.listNamesByIndexAndValue("type", "ADMIN")
			.then((resp) => {
				let array = [];
				Object.entries(resp.data).forEach(([key, value]) => {
					listEmail.push(value);
				});

				let body1 = {
					userNames: listEmail,
				};

				user
					.getUserConfigs(body1)
					.then((resp) => {
						Object.entries(resp.data).forEach(([ke, val]) => {
							Object.entries(val).forEach(([k, v]) => {
								let data = user.getActualUserInfo(v);
								array.push(data);
							});
						});
					})
					.catch((error) => {
						console.log(error);
					});

				let body2 = {
					users: listEmail,
				};

				user
					.getListAllRolToUser(body2)
					.then((resp) => {
						for (let resul of resp.data.payload) {
							let itemUser = array.find(function (element) {
								return element.name === resul.email;
							});
							let rolName, rolId;
							if (resul.rol !== null) {
								rolId = resul.rol.id;
								rolName = resul.rol.name;
							}
							if (itemUser !== undefined) {
								itemUser.nameRol = rolName;
								itemUser.idRol = rolId;
								this.setState({
									listOperators: [...this.state.listOperators, itemUser],
								});
							}
						}
						this.setState({ show: true });
						//						console.log(this.state.listOperators);
					})
					.catch((error) => {
						this.setState({ show: true });
					});
			})
			.catch((error) => {
				this.setState({ show: true, errorInRed: true });
			});
	}
	handleActionButton(e, data) {
		if (data.name === "modify") {
			let userSelected = this.state.listOperators.find(function (element) {
				return element.email === data.id;
			});

			user
				.getConfigUserGeneral(data.id)
				.then((response) => {
					let typeC = response.data.result.allowVerificationTypeC;
					let typeD = response.data.result.allowVerificationTypeD;
					if (typeC !== undefined) {
						userSelected.allowVerificationTypeC = typeC;
					} else {
						userSelected.allowVerificationTypeC = false;
					}
					if (typeD !== undefined) {
						userSelected.allowVerificationTypeD = typeD;
					} else {
						userSelected.allowVerificationTypeD = false;
					}
					userSelected.allowAssignedPaymentsOnly =
						response.data.result.allowAssignedPaymentsOnly;
				})
				.catch((error) => {});
			if (userSelected !== undefined) {
				this.setState({ userModify: userSelected }, () =>
					this.setState({ showModify: true }),
				);
			}
		} else {
			let userSelected = this.state.listOperators.find(function (eleement) {
				return eleement.email === data.id;
			});
			if (userSelected !== undefined) {
				this.setState(
					{ userDeleted: userSelected, emailDeleted: userSelected.email },
					() => this.setState({ showDeleleConfirm: true }),
				);
			}
		}
	}
	handleAddOperator() {
		this.setState({ showModify: true });
	}
	handleModifyOperator(id, rol) {
		this.setState((state) => {
			const listEdit = state.listOperators.map((item, index) => {
				if (id === item.email) {
					item.rol = rol;
					return item;
				} else {
					return item;
				}
			});
			return listEdit;
		});
	}
	cancelDelete() {
		this.setState({
			showDeleleConfirm: false,
			userDeleted: {},
			emailDeleted: "",
			textMessage: "",
			colorMessage: "",
			viewMessage: false,
			endDelete: false,
		});
		this.initData();
	}
	deleteConfirm() {
		this.setState({ load: true });
		let body = {
			email: this.state.emailDeleted,
		};
		user
			.deleteRolAUser(body)
			.then((resp) => {
				this.setState({ load: false });
				if (resp.data.payload) {
					this.setState({
						viewMessage: true,
						textMessage: "El rol del usuario ha sido borrado",
						colorMessage: "blue",
						endDelete: true,
					});
				} else {
					this.setState({
						viewMessage: true,
						endDelete: true,
						textMessage: "No se ha encontrado el usuario",
						colorMessage: "red",
					});
				}
			})
			.catch((error) => {
				this.setState({
					viewMessage: true,
					endDelete: true,
					textMessage: "Ha ocurrio un error de conexión intente mas tarde",
					colorMessage: "red",
				});
				setTimeout(() => {
					this.setState({
						viewMessage: false,

						textMessage: "",
						colorMessage: "",
					});
				}, 8000);
			});
	}
	cancelCustomize() {
		this.setState({ showModify: false, userModify: {} });
	}

	changueOpertorInTable(user, rol) {
		this.setState((state) => {
			const listOperators = state.listOperators.map((element) => {
				if (element.email === user) {
					let listRol = this.state.listRol.find(function (element) {
						return element.key === rol;
					});
					let dataRol = listRol.value;
					element.nameRol = dataRol.name;
					element.idRol = dataRol.id;
					return element;
				} else {
					return element;
				}
			});
			return { listOperators };
		});
	}
	render() {
		const currensTableHeaders = [
			{
				Header: "Correo",
				accessor: "email",
				width: 250,
			},
			{
				Header: "Teléfono",
				accessor: "phone",
				width: 150,
			},
			{
				Header: "Nombre y apellido",
				Cell: (row) => (
					<div>
						{row.original.firstName !== undefined ? row.original.firstName : ""}{" "}
						{row.original.lastName !== undefined ? row.original.lastName : ""}
					</div>
				),
				width: 250,
			},
			{ Header: "Tipo", accessor: "type", width: 150 },
			{
				Header: "Rol asignado",
				Cell: (row) => (
					<div>
						{row.original.nameRol !== null && row.original.nameRol !== undefined
							? row.original.nameRol
							: "Ninguno"}{" "}
					</div>
				),
				width: 200,
			},
			{
				Header: "Acciónes",
				Cell: (row) => (
					<div>
						<Button
							icon='edit'
							circular
							compact
							size='mini'
							color='blue'
							id={row.original.email}
							name='modify'
							title='Editar'
							onClick={this.handleActionButton.bind(this)}
						/>
						{row.original.idRol !== null &&
							row.original.idRol !== undefined && (
								<Button
									icon='cancel'
									circular
									compact
									size='mini'
									color='blue'
									id={row.original.email}
									name='delete'
									title='Eliminar rol'
									onClick={this.handleActionButton.bind(this)}
								/>
							)}
					</div>
				),
			},
		];
		return (
			<div>
				<Dimmer.Dimmable dimmed={!this.state.show}>
					<Dimmer active={!this.state.show} inverted>
						<Loader>Cargando...</Loader>
					</Dimmer>
					<Segment color='orange'>
						{this.state.errorInRed && (
							<Message
								info
								content='Verifique su conexión a internet e intente de nuevo'
							/>
						)}
						{!this.state.errorInRed && (
							<div>
								<ReactTable
									className='rolTable'
									data={this.state.listOperators}
									columns={currensTableHeaders}
									defaultPageSize={5}
									previousText='Anterior'
									nextText='Siguiente'
									loadingText='Cargando...'
									noDataText='No hay operadores registrados'
									pageText='Página'
									ofText='de'
									rowsText='filas'
									pageJumpText='ir a la página'
									rowsSelectorText='filas por página'
									minRow={5}
									defaultFilterMethod={(filter, row, column) => {
										const id = filter.pivotId || filter.id;
										return row[id] !== undefined
											? String(row[id]).startsWith(filter.value.toUpperCase())
											: true;
									}}
								/>
								<Divider hidden />
								<Button
									floated='right'
									color='blue'
									onClick={this.handleAddOperator.bind(this)}>
									Agregar
								</Button>
								<Divider hidden />
								<Divider hidden />
							</div>
						)}
					</Segment>
				</Dimmer.Dimmable>
				<Modal open={this.state.showDeleleConfirm} size='tiny'>
					<Header icon='exclamation circle' content='Verificación' />
					<Modal.Content>
						<Segment basic loading={this.state.load}>
							<p>Seguro que desea eliminar el rol de este operador</p>
							<p>
								<strong>{this.state.emailDeleted}</strong>
							</p>
							{this.state.viewMessage && (
								<Message color={this.state.colorMessage}>
									{this.state.textMessage}
								</Message>
							)}
						</Segment>
					</Modal.Content>
					<Modal.Actions>
						{!this.state.endDelete && (
							<Button
								color='grey'
								disabled={this.state.load}
								onClick={this.cancelDelete.bind(this)}>
								Cancelar
							</Button>
						)}
						{this.state.endDelete && (
							<Button color='grey' onClick={this.cancelDelete.bind(this)}>
								Cerrar
							</Button>
						)}
						{!this.state.endDelete && (
							<Button
								color='blue'
								disabled={this.state.load}
								onClick={this.deleteConfirm.bind(this)}>
								Eliminar
							</Button>
						)}
					</Modal.Actions>
				</Modal>
				<ModalCustomizeOperator
					cancel={this.cancelCustomize.bind(this)}
					operator={this.state.userModify}
					show={this.state.showModify}
					editRolUser={this.handleModifyOperator}
					operatorInTable={this.changueOpertorInTable.bind(this)}
				/>
			</div>
		);
	}
}

export default Operators;
