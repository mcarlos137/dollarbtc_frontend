import React, { Component } from "react";
import {
	Modal,
	Header,
	Segment,
	Form,
	Button,
	Dropdown,
	Message,
	Checkbox,
	Divider,
} from "semantic-ui-react";
import currency from "../../../../common/currency";
import NumberFormat from "react-number-format";
import otc from "../../../../services/otc";
import user from "../../../../services/user";
import prefij from "../../../../common/prefits";

class ModalCustomizeOperator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			operator: {},
			checkedRol: false,
			listRol: [],
			email: "",
			toDepositPercent: 0,
			toTransferPercent: 0,
			firstName: "",
			lastName: "",
			phone: "",
			password: "",
			nickname: "",
			currencyLabelSelected: "",
			formLoad: false,
			rolAsignate: "",
			selectRolAsignate: "",
			currencies: [],
			seletedCurrencies: [],
			color: "",
			viewMessage: false,
			textMessage: "",
			endPost: false,
			codes: [],
			partialNumber: "",
			partialPhone: "",
			listUser: [],
			selecteduser: "",
			endUpdate: false,
			currencyUser: [],
			obtCurren: false,
			nameOperator: "",
			verificationTypeC: false,
			verificationTypeD: false,
			onlyOwnPayments: false,
			typesVerifications: [],
			successVerificationCheck: false,
			errorInRed: false,
		};
		this.confirmSendNewOperator = this.confirmSendNewOperator.bind(this);
	}
	componentDidMount() {
		this.setState({ formLoad: true });
		let codes = [];
		let rolsAvailables = [];
		for (let code of prefij.country) {
			if (code.value !== "") {
				let ob = {
					text: code.value + " " + code.nombre,
					value: code.value,
					key: code.value,
				};
				codes.push(ob);
			}
		}
		user
			.listNamesByIndexAndValue("type", "ADMIN")
			.then((resp) => {
				let array = [];
				let listEmail = [];
				Object.entries(resp.data).forEach(([key, value]) => {
					listEmail.push(value);
				});
				let body1 = {
					userNames: listEmail,
				};

				//	console.log("body1:", body1);
				user
					.getUserConfigs(body1)
					.then((resp) => {
						//		console.log("resp.data:", resp.data);
						Object.entries(resp.data).forEach(([ke, val]) => {
							Object.entries(val).forEach(([k, v]) => {
								let data = user.getActualUserInfo(v);
								//array.push(data);
								let userdatalist = {
									key: data.name,
									text: data.name,
									value: data.name,
								};
								array.push(userdatalist);
								//	console.log(array);
							});
						});
					})
					.catch((error) => {
						console.log(error);
					});

				user.getAllRols().then((respr) => {
					for (let rol of respr.data.payload) {
						let ob = {
							key: rol.id,
							text: rol.name,
							value: rol,
						};
						rolsAvailables.push(ob);
					}
					this.setState({ listRol: rolsAvailables });

					let respOtc;
					let keys = [];

					respOtc = otc.getCurrencies();
					respOtc
						.then((r) => {
							this.setState({ formLoad: false });
							for (let currency of r.data) {
								keys.push(currency.shortName);
							}
							this.setState(() => ({
								list: r.data,
								currencies: currency.currencies.filter((currency) => {
									return keys.find((key) => key === currency.alias) && currency.key !== "btc";
								}),
							}));
						})
						.catch((error) => {
							this.setState({ formLoad: false });
						});
				});
				this.setState({ listUser: array });
			})
			.catch((error) => {});

		this.setState({ codes: codes });
	}
	componentDidUpdate() {
		if (this.props.operator.email !== undefined) {
			if (this.state.operator.email === undefined) {
				if (this.state.obtCurren === false) {
					otc.getCurrenciesOperator(this.props.operator.email).then((resp) => {
						this.setState({ obtCurren: true });
						let keys = [];
						let listRol = {};
						for (let currency of resp.data) {
							keys.push(currency.shortName);
						}
						let rolId = this.props.operator.idRol;
						//	console.log("rolId:", rolId);
						//if (this.state.listRol !== undefined) {
						listRol = this.state.listRol.find(function (element) {
							return element.key === rolId;
						});
						//	}
						//		console.log("listRol:", listRol);
						this.setState({
							seletedCurrencies: keys,
							actualCurrencies: keys,
							obtCurren: false,
						});
						this.setState({
							rolAsignate:
								this.props.operator.idRol !== null
									? this.props.operator.idRol
									: "",
							selectRolAsignate: listRol !== undefined ? listRol.value : "",
							operator: this.props.operator,
							email: this.props.operator.email,
							firstName: this.props.operator.firstName,
							lastName: this.props.operator.lastName,
							nickname: this.props.operator.nickname,
							twoFactor: false,
							actualRol:
								this.props.operator.idRol !== null
									? this.props.operator.idRol
									: "",
							nameOperator: this.props.operator.name,
							verificationTypeC: this.props.operator.allowVerificationTypeC,
							verificationTypeD: this.props.operator.allowVerificationTypeD,
							onlyOwnPayments: this.props.operator.allowAssignedPaymentsOnly,
						});
					});
				}
			}
		}
	}

	handleChangeRol(e, data) {
		this.setState({
			rolAsignate: data.value.id,
			selectRolAsignate: data.value,
		});
	}
	handleChangeCurrencies(e, { value }) {
		this.setState({ seletedCurrencies: value });
	}
	handleSelectedUser(e, data) {
		this.setState({ selecteduser: data.value });
	}
	handleSearchChangeUser = (e, { searchQueryU }) =>
		this.setState({ searchQueryU });

	handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });

	handleSelectedRol(e, data) {
		this.setState({ selectedrol: data.value });
	}
	handleSendNewOperator() {
		if (this.state.selecteduser !== "") {
			this.setState({ formLoad: true });
			this.confirmSendNewOperator();
		} else {
			this.setState({
				viewMessage: true,
				color: "red",
				textMessage: "Debe incluir todos los datos requeridos",
			});
			setTimeout(() => {
				this.setState({ viewMessage: false, color: "", textMessage: "" });
			}, 8000);
		}
	}
	handleVerificationType = (e, data) => {
		if (data.name === "C") {
			this.state.typesVerifications.push(data.name);
			this.setState({ verificationTypeC: data.checked });
		} else if (data.name === "D") {
			this.state.typesVerifications.push(data.name);
			this.setState({ verificationTypeD: data.checked });
		}
	};
	// handleVerificationTypeD = (e, data) => {
	//   this.setState({ verificationTypeD: data.checked });
	// };

	handleonlyOwnPayments = (e, data) => {
		this.setState({ onlyOwnPayments: data.checked });
	};
	confirmSendNewOperator() {
		user
			.createOperator(this.state.selecteduser)
			.then((resp) => {
				if (this.state.selectedrol !== null) {
					let body = {
						userEmail: this.state.selecteduser,
						rol: this.state.selectedrol.id,
					};
					user.asignateRol(body).then((resp) => {
						this.setState({
							formLoad: false,
							viewMessage: true,
							endPost: true,
							textMessage: "El operador ha sido creado satisfactoriamente",
							color: "blue",
						});
					});
				} else {
					this.setState({
						formLoad: false,
						viewMessage: true,
						endPost: false,
						textMessage: "El operador ha sido creado satisfactoriamente",
						color: "blue",
					});
				}
			})
			.catch((error) => {});
	}

	cancelCustomize() {
		this.setState({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			operator: {},
			nickname: "",
			checkedRol: false,
			endUpdate: false,
			viewMessage: false,
			textMessage: "",
			color: "",
			endPost: false,
			verificationTypeC: false,
			verificationTypeD: false,
			onlyOwnPayments: false,
			verificationByType: [],
		});
		this.props.cancel();
	}
	verificationByType() {
		if (this.state.typesVerifications.length > 0) {
			for (let i = 0; i < this.state.typesVerifications.length; i++) {
				let body = {};
				if (this.state.typesVerifications[i] === "C") {
					body = {
						userName: this.state.nameOperator,
						type: "C",
						allow: this.state.verificationTypeC,
					};
				} else if (this.state.typesVerifications[i] === "D") {
					body = {
						userName: this.state.nameOperator,
						type: "D",
						allow: this.state.verificationTypeD,
					};
				}
				otc
					.checkVerification(body)
					.then((resp) => {
						if (resp.data === "OK") {
							this.setState({ successVerificationCheck: true });
						}
					})
					.catch((error) => {});
			}
		}
	}
	onlyOwnPayments() {
		let body = {
			userName: this.state.email,
			allow: this.state.onlyOwnPayments,
		};
		//console.log(body);
		user
			.onlyOwnPayments(body)
			.then((res) => {
				//	console.log(res);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	handleChangeCurrencySelect(e, data) {
		if (data !== null && data !== undefined && data !== "") {
			this.setState({
				currencyLabelSelected: data.value,
			});
			//	this.getImageCurrency(data.value);
		} else {
			this.setState({
				currencyLabelSelected: "",
			});
		}
	}
	asignateRolToUserService() {
		if (this.state.seletedCurrencies.length > 0) {
			let b = {
				userName: this.state.email,
				currencies: this.state.seletedCurrencies,
			};
			this.setState({ formLoad: true });
			this.verificationByType();
			this.onlyOwnPayments();
			otc
				.updateCurrenciesToUser(b)
				.then((r) => {
					if (r.data === "OK") {
						if (this.state.actualRol === "") {
							if (this.state.rolAsignate !== "") {
								let body = {
									userEmail: this.state.email,
									rol: this.state.rolAsignate,
								};
								user
									.asignateRol(body)
									.then((resp) => {
										this.props.operatorInTable(
											this.state.email,
											this.state.rolAsignate,
										);
										if (
											resp.data.payload ||
											this.state.successVerificationCheck
										) {
											this.setState({
												formLoad: false,
												viewMessage: true,
												endUpdate: true,
												textMessage:
													"Los datos han sido actualizados satisfactoriamente",
												color: "blue",
												operator: {},
												typesVerifications: [],
											});
										} else {
											this.setState({
												operator: {},
												formLoad: false,
												viewMessage: true,
												endUpdate: true,
												textMessage:
													"Los datos no han podido ser actualizados ",
												color: "red",
											});
										}
									})
									.catch((error) => {});
							}
						} else {
							if (this.state.actualRol !== this.state.rolAsignate) {
								let body = {
									userEmail: this.state.email,
									rol: this.state.rolAsignate,
								};
								this.setState({ formLoad: true });
								user
									.asignateRol(body)
									.then((resp) => {
										this.props.operatorInTable(
											this.state.email,
											this.state.rolAsignate,
										);
										if (resp.data.payload) {
											this.props.editRolUser(
												this.state.email,
												this.rolAsignate,
											);
											this.setState({
												formLoad: false,
												viewMessage: true,
												endUpdate: true,
												operator: {},
												textMessage:
													"El rol de usuario ha sido actualizado satisfactoriamente",
												color: "blue",
											});
										} else {
											this.setState({
												formLoad: false,
												viewMessage: true,
												endUpdate: true,
												textMessage:
													"Los datos no han podido ser actualizados ",
												color: "red",
												operator: {},
											});
										}
									})
									.catch((error) => {});
							} else {
								this.setState({
									formLoad: false,
									viewMessage: true,
									endUpdate: true,
									typesVerifications: [],
									textMessage:
										"Los datos han sido actualizados satisfactoriamente",
									color: "blue",
								});
							}
						}
					} else {
						this.setState({
							formLoad: false,
							viewMessage: true,
							endUpdate: true,
							textMessage:
								"Los datos no han podido ser actualizados intente mas tarde",
							color: "red",
						});
					}
				})
				.catch((error) => {
					this.setState({ formLoad: false, errorInRed: true });
				});
		} else {
			this.setState({
				formLoad: false,
				viewMessage: true,
				textMessage:
					"Debe colocar por lo menos una moneda para actualizar datos del operador ",
				color: "red",
			});
			setTimeout(() => {
				this.setState({
					viewMessage: false,
					textMessage: "",
					color: "",
				});
			});
		}
	}

	setComissions() {
		let body = {
			userName: this.state.email,
			currency: this.state.currencyLabelSelected,
			mcBuyBalancePercent:
				this.state.toDepositPercent !== "" ? this.state.toDepositPercent : 0,
			sendToPaymentPercent:
				this.state.toTransferPercent !== "" ? this.state.toTransferPercent : 0,
		};
		console.log(body);
		otc
			.editAdminUserCommissions(body)
			.then((resp) => {
				console.log(resp);
			})
			.catch((error) => {
				console.log(error);
			});
	}
	handleTransferPercent(e) {
		this.setState({ toTransferPercent: Number(e.target.value) });
	}
	handleDepositPercent(e) {
		this.setState({ toDepositPercent: Number(e.target.value) });
	}
	render() {
		if (this.props.operator.email === undefined) {
			return (
				<Modal open={this.props.show}>
					<Modal.Content>
						<Segment basic loading={this.state.formLoad}>
							<Form>
								<Header>
									Seleccione de la lista al nuevo operador, si desea puede
									asignar un rol al operador
								</Header>
								<Form.Group equal>
									<Form.Dropdown
										label='Usuarios'
										required
										search
										selection
										options={this.state.listUser}
										onChange={this.handleSelectedUser.bind(this)}
										onSearchChange={this.handleSearchChangeUser.bind(this)}
										value={this.state.selecteduser}
										width={10}
									/>
								</Form.Group>
								<Form.Group equal>
									<Form.Dropdown
										label='Roles'
										search
										selection
										options={this.state.listRol}
										onChange={this.handleSelectedRol.bind(this)}
										value={this.state.selectedrol}
										width={10}
									/>
								</Form.Group>
							</Form>
							{this.state.viewMessage && (
								<Message color={this.state.color}>
									{this.state.textMessage}
								</Message>
							)}
						</Segment>
					</Modal.Content>
					<Modal.Actions>
						{!this.state.endPost && (
							<Button
								disabled={this.state.formLoad}
								color='grey'
								onClick={this.cancelCustomize.bind(this)}>
								Cancelar
							</Button>
						)}
						{this.state.endPost && (
							<Button color='grey' onClick={this.cancelCustomize.bind(this)}>
								Cerrar
							</Button>
						)}
						{!this.state.endPost && (
							<Button
								color='blue'
								disabled={this.state.formLoad}
								onClick={this.handleSendNewOperator.bind(this)}>
								Guardar
							</Button>
						)}
					</Modal.Actions>
				</Modal>
			);
		} else {
			return (
				<Modal open={this.props.show}>
					<Header>Datos del operador seleccionado</Header>
					<Modal.Content>
						{this.state.errorInRed && (
							<Message
								info
								content='Verifique su conexión a internet e intente de nuevo'
							/>
						)}
						{!this.state.errorInRed && (
							<Segment basic loading={this.state.formLoad}>
								<Form>
									<Form.Group equal>
										<Form.Input
											value={this.state.email}
											disabled
											width={8}
											type='email'
											label='Correo'
										/>
										<Form.Input
											disabled
											width={8}
											value={this.state.nickname}
											label='Nombre de usuario'
											type='text'
										/>
									</Form.Group>
									<Form.Group>
										<Form.Dropdown
											label='Monedas a operar'
											required
											multiple
											search
											selection
											options={this.state.currencies}
											onChange={this.handleChangeCurrencies.bind(this)}
											onSearchChange={this.handleSearchChange.bind(this)}
											value={this.state.seletedCurrencies}
											width={8}
										/>
										<Form.Field width={8}>
											<label>Rol</label>
											<Dropdown
												options={this.state.listRol}
												selection
												placeholder='Seleccione rol'
												value={this.state.selectRolAsignate}
												onChange={this.handleChangeRol.bind(this)}
											/>
											<Divider hidden />
											<Checkbox
												label='Permitir verificación tipo C'
												name='C'
												checked={this.state.verificationTypeC}
												onChange={this.handleVerificationType}
											/>
											<Divider hidden />
											<Checkbox
												label='Permitir verificación tipo D'
												name='D'
												checked={this.state.verificationTypeD}
												onChange={this.handleVerificationType}
											/>
											<Divider hidden />
											<Checkbox
												label='Medios de Pago Asignados'
												checked={this.state.onlyOwnPayments}
												onChange={this.handleonlyOwnPayments}
											/>
											<Divider hidden />

											<label>
												<b>
													porcentaje de comisión para operaciones en medios de
													pago
												</b>
											</label>
											<Divider hidden />
											<Segment>
												<Form.Dropdown
													label='Monedas asignadas'
													search
													selection
													options={this.state.currencies}
													onChange={this.handleChangeCurrencySelect.bind(this)}
													//	onSearchChange={this.handleSearchChange.bind(this)}
													value={this.state.currencyLabelSelected}
												/>
												<Divider hidden />
												<Form.Group inline>
													<Form.Field width={14}>
														<label>Para Depósitos</label>
														<NumberFormat
															value={this.state.toDepositPercent}
															allowNegative={false}
															thousandSeparator={true}
															onChange={this.handleDepositPercent.bind(this)}
														/>
													</Form.Field>
													<Form.Field width={16}>
														<label>Para Transferencias</label>
														<NumberFormat
															value={this.state.toTransferPercent}
															allowNegative={false}
															thousandSeparator={true}
															onChange={this.handleTransferPercent.bind(this)}
														/>
													</Form.Field>
												</Form.Group>
											</Segment>
											<Form.Field>
												<Button onClick={this.setComissions.bind(this)}>
													Agregar
												</Button>
											</Form.Field>
										</Form.Field>
									</Form.Group>
								</Form>
								{this.state.viewMessage && (
									<Message color={this.state.color}>
										{this.state.textMessage}
									</Message>
								)}
							</Segment>
						)}
					</Modal.Content>
					<Modal.Actions>
						{!this.state.endUpdate && (
							<Button
								disabled={this.state.formLoad}
								color='grey'
								onClick={this.cancelCustomize.bind(this)}>
								Cancelar
							</Button>
						)}
						{this.state.endUpdate && (
							<Button color='grey' onClick={this.cancelCustomize.bind(this)}>
								Cerrar
							</Button>
						)}
						{!this.state.endUpdate && (
							<Button
								disabled={this.state.formLoad}
								color='blue'
								onClick={this.asignateRolToUserService.bind(this)}>
								Guardar
							</Button>
						)}
					</Modal.Actions>
				</Modal>
			);
		}
	}
}

export default ModalCustomizeOperator;
