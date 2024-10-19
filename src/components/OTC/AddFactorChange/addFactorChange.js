import React, { Component } from "react";
import "../OTC.css";
import {
	Icon,
	Flag,
	Dimmer,
	Loader,
	Grid,
	Segment,
	Dropdown,
	Button,
	Input,
	Modal,
	Message,
	Popup,
} from "semantic-ui-react";
import otcService from "../../../services/otc";
import currency from "../../../common/currency";
import NumberFormat from "react-number-format";
import user from "../../../services/user";
import theter from '../../../img/tether-seeklogo.svg';
import btcImg from '../../../img/icn-bitcoin-amarillo.png';
class addFactorChange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currencies: [],
			loadForm: false,
			targetCurrencies: [],
			targetCurrencySelected: "",
			factorsConfigs: [],
			factor: "",
			typeFactorSelected: "",
			factorActuals: [],
			statusSelected: "INACTIVE",
			sendRequest: false,
			loadSend: false,
		};
	}
	componentDidMount() {
		this.getCurrencies();
	}
	getCurrencies() {
		this.setState({ loadForm: true });
		otcService
			.getCurrencies()
			.then((response) => {
				this.setState({ loadForm: false });
				let arrayCurrency = response.data;
				//   //console.log('currencies ',response.data);
				for (let i = 0; i < arrayCurrency.length; i++) {
					let currencyFiltered = currency.currencies.filter((currency) => {
						return currency.value === arrayCurrency[i].shortName;
					});
					if (currencyFiltered !== undefined && currencyFiltered.length > 0 &&
						 currencyFiltered[0].value !== "ETH"  &&
						 currencyFiltered[0].value !== "USDT" &&
						 currencyFiltered[0].value !== "BTC") {
							 	arrayCurrency[i].flag = currencyFiltered[0].flag;
					}else if(currencyFiltered[0].value === "ETH") {
						arrayCurrency[i].icon = currencyFiltered[0].icon;
					}else if(currencyFiltered[0].value === "USDT"){
							arrayCurrency[i].image = { avatar: true, size: 'mini',src: theter };;
					}else if(currencyFiltered[0].value === "BTC"){
							arrayCurrency[i].image = { avatar: true, size: 'mini',src: btcImg };;
					}
				
					
					arrayCurrency[i].value = arrayCurrency[i].shortName;
					arrayCurrency[i].text = currencyFiltered[0].text;
				}
				this.setState(
					{
						currencies: arrayCurrency,
					},
					() => this.getCurrentFactors(),
				);
			})
			.catch((error) => {
				//console.log('error getCurrencies ',error);
			});
	}
	async getCurrentFactors() {
		try {
			const response = await otcService.getChangeFactor();
			let array = [];
			let originalArray = [];
			let aux;
			Object.entries(response.data).forEach(([key, value]) => {
				let ob = {
					label: "",
					amount: "",
					equivalent: "",
					status: "",
					id: "",
					showDecimal: false,
					showDecimalAmount: false,
					type: "",
				};

				if (key.includes("PA_USD_")) {
					let first = key.split("_")[0];
					let second = key.split("_")[1];
					let third = key.split("_")[2];
					aux = first + "_" + second + "-" + third;
					ob = {
						label: aux,
						amount: value.amount,
						equivalent: 0,
						status: value.status,
						id: key,
						showDecimal: false,
						showDecimalAmount: false,
						type: value.type,
					};
				} else if (key.includes("_PA_USD")) {
					let first = key.split("_")[0];
					let second = key.split("_")[1];
					let third = key.split("_")[2];
					aux = first + "-" + second + "_" + third;
					ob = {
						label: aux,
						amount: value.amount,
						equivalent: 0,
						status: value.status,
						id: key,
						showDecimal: false,
						showDecimalAmount: false,
						type: value.type,
					};
				} else {
					ob = {
						label: key.split("_")[0] + " - " + key.split("_")[1],
						amount: value.amount,
						equivalent: 0,
						status: value.status,
						id: key,
						showDecimal: false,
						showDecimalAmount: false,
						type: value.type,
					};
				}

				let originalData = {
					key: key,
					value: value,
				};
				let valueEquivalent = 1 / value.amount;
				let setValue;
				if (valueEquivalent.toString().includes("e")) {
					setValue = Number(valueEquivalent).toFixed(12);
					ob.showDecimal = true;
				} else {
					setValue = valueEquivalent;
					let stringEquivalent = String(valueEquivalent);
					if (stringEquivalent.includes(".")) {
						let splitValueEquivalent = stringEquivalent.split(".")[1];
						let fixedValue = stringEquivalent.split(".")[0];
						if (splitValueEquivalent.length > 4 && fixedValue.length === 1) {
							ob.showDecimal = true;
						}
					}
				}
				let amountString = String(value.amount);
				if (amountString.includes(".")) {
					let splitValue = amountString.split(".")[1];
					let intValue = amountString.split(".")[0];
					if (splitValue.length > 4 && intValue.length === 1) {
						ob.showDecimalAmount = true;
					}
				}
				ob.equivalent = setValue;
				originalArray.push(originalData);
				array.push(ob);
			});
			this.setState({ factorsConfigs: array, factorActuals: originalArray });
		} catch (error) {}
	}
	handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
	handleSearchChangeDesteny = (e, { searchQueryT }) =>
		this.setState({ searchQueryT });
	handleChangeCurrencies(e, { value }) {
		this.setState({ baseSelected: value }, () => {
			let targetCurrencies = this.state.currencies.filter((currency) => {
				return currency.value !== value;
			});
			this.setState({ targetCurrencies: targetCurrencies });
		});
	}
	handleChangeTargetCurrency(e, { value }) {
		this.setState({ targetCurrencySelected: value });
	}
	onChangeFactor(e, data) {
		if(!isNaN(data.value)){
			const factor = data.value;
        	const re2 = /^[0-9.]*$/;
        	if (factor === '' || re2.test(factor)) {
            	this.setState({ factor: factor, errroFactor: false });
			}
		} else {
			this.setState({
				errroFactor: true
			})
		}
		
		
	}
	setTypeFactor(e, { value }) {
		this.setState({ typeFactorSelected: value });
	}
	async addTypeFactor() {
		let bodyTosent = {};
		let keySelected =
			this.state.baseSelected + "_" + this.state.targetCurrencySelected;
		for (let factor of this.state.factorActuals) {
			if (factor.key !== keySelected) {
				Object.defineProperty(bodyTosent, factor.key, {
					value: factor.value,
					enumerable: true,
					configurable: true,
					writeable: true,
				});
			}
		}
		let valueToSet = {
			amount: Number(this.state.factor),
			type: this.state.typeFactorSelected,
			status: this.state.statusSelected,
		};
		Object.defineProperty(
			bodyTosent,
			this.state.baseSelected + "_" + this.state.targetCurrencySelected,
			{
				value: valueToSet,
				enumerable: true,
				configurable: true,
				writeable: true,
			},
		);
		let bodyEnd = {
			userName: user.getUserName(),
			changeFactors: bodyTosent,
		};
		this.setState({ loadSend: true });
		try {
			const response = await otcService.updateFactorsChange(bodyEnd);
			this.setState({ loadSend: false });
			if (response.data === "OK") {
				this.setState(
					{
						sendRequest: true,
						viewMessage: true,
						message: "Su solicitud ha sido procesada exitasamente",
						colorMessage: "green",
					},
					() => this.getCurrentFactors(),
				);
			} else {
				this.setState({
					sendRequest: false,
					viewMessage: true,
					message: "Su solicitud no ha sido procesada, intente de nuevo",
					colorMessage: "red",
				});
				setTimeout(() => {
					this.setState({ viewMessage: false, message: "", colorMessage: "" });
				}, 6000);
			}
		} catch (error) {
			this.setState({ loadSend: false });
			this.setState({
				sendRequest: false,
				viewMessage: true,
				message: "Su solicitud no ha sido procesada, intente de nuevo",
				colorMessage: "red",
			});
			setTimeout(() => {
				this.setState({ viewMessage: false, message: "", colorMessage: "" });
			}, 6000);
		}
	}
	viewModalConfirm() {
		this.setState({ modalConfirm: true });
	}
	changeStatusFactor(id, action) {
		this.setState(
			(state) => {
				const factorActuals = state.factorActuals.map((element) => {
					if (element.key === id) {
						element.value.status = action;
						return element;
					} else {
						return element;
					}
				});
				return { factorActuals };
			},
			async () => {
				let bodyTosent = {};
				for (let factor of this.state.factorActuals) {
					Object.defineProperty(bodyTosent, factor.key, {
						value: factor.value,
						enumerable: true,
						configurable: true,
						writeable: true,
					});
				}
				let bodyEnd = {
					userName: user.getUserName(),
					changeFactors: bodyTosent,
				};
				this.setState({ loadSend: true });
				try {
					const response = await otcService.updateFactorsChange(bodyEnd);
					this.setState({ loadSend: false });
					if (response.data === "OK") {
						this.setState(
							{
								sendRequest: true,
								viewMessage: true,
								message: "Su solicitud ha sido procesada exitasamente",
								colorMessage: "green",
							},
							() => this.getCurrentFactors(),
						);
					} else {
						this.setState({
							sendRequest: false,
							viewMessage: true,
							message: "Su solicitud no ha sido procesada, intente de nuevo",
							colorMessage: "red",
						});
						setTimeout(() => {
							this.setState({
								viewMessage: false,
								message: "",
								colorMessage: "",
							});
						}, 6000);
					}
				} catch (error) {
					this.setState({ loadSend: false });
					this.setState({
						sendRequest: false,
						viewMessage: true,
						message: "Su solicitud no ha sido procesada, intente de nuevo",
						colorMessage: "red",
					});
					setTimeout(() => {
						this.setState({
							viewMessage: false,
							message: "",
							colorMessage: "",
						});
					}, 6000);
				}
			},
		);
	}
	setchangeStatusFactor(id, action) {
		this.setState({
			idFactor: id,
			typeChangeSetinfactor: action,
			modalConfirmChageFactor: true,
		});
	}
	render() {
		return (
			<div>
				<Modal open={this.state.modalConfirm}>
					<Modal.Header>Confirmación</Modal.Header>
					<Segment loading={this.state.loadSend} basic>
						<Modal.Content>
							<Modal.Description>
								<div>
									<p>
										¿Desea que el factor configurado este activo
										inmediatamente?, por defecto el factor se agregara inactivo
									</p>
								</div>
								{this.state.viewMessage && (
									<div style={{ marginTop: "20px" }}>
										<Message color={this.state.colorMessage}>
											{this.state.message}
										</Message>
									</div>
								)}
							</Modal.Description>
						</Modal.Content>
					</Segment>
					{!this.state.sendRequest && (
						<Modal.Actions>
							<Button
								color='grey'
								disabled={this.state.loadSend === true}
								onClick={() => {
									this.addTypeFactor();
								}}>
								No
							</Button>
							<Button
								color='blue'
								disabled={this.state.loadSend === true}
								onClick={() => {
									this.setState({ statusSelected: "ACTIVE" }, () => {
										this.addTypeFactor();
									});
								}}>
								Si
							</Button>
						</Modal.Actions>
					)}
					{this.state.sendRequest && (
						<Modal.Actions>
							<Button
								color='grey'
								onClick={() => {
									this.setState({
										factor: 0,
										targetCurrencySelected: "",
										baseSelected: "",
										typeFactorSelected: "",
										targetCurrencies: [],
										modalConfirm: false,
										viewMessage: false,
										colorMessage: "",
										message: "",
										sendRequest: false,
									});
								}}>
								Cerrar
							</Button>
						</Modal.Actions>
					)}
				</Modal>
				<Modal open={this.state.modalConfirmChageFactor} size='small'>
					<Modal.Header>Confirmación</Modal.Header>
					<Segment loading={this.state.loadSend} basic>
						<Modal.Description>
							<Modal.Content>
								<div style={{ alignContent: "center", textAlign: "center" }}>
									<p style={{ fontSize: "16px" }}>
										¿Seguro que desea realizar esta acción?
									</p>
								</div>
								{this.state.viewMessage && (
									<div style={{ marginTop: "20px" }}>
										<Message color={this.state.colorMessage}>
											{this.state.message}
										</Message>
									</div>
								)}
							</Modal.Content>
						</Modal.Description>
					</Segment>
					{!this.state.sendRequest && (
						<Modal.Actions>
							<Button
								disabled={this.state.loadSend === true}
								color='grey'
								onClick={() => {
									this.setState({
										modalConfirmChageFactor: false,
										idFactor: "",
										typeChangeSetinfactor: "",
									});
								}}>
								No
							</Button>
							<Button
								disabled={this.state.loadSend === true}
								color='blue'
								onClick={() => {
									this.changeStatusFactor(
										this.state.idFactor,
										this.state.typeChangeSetinfactor,
									);
								}}>
								Si
							</Button>
						</Modal.Actions>
					)}
					{this.state.sendRequest && (
						<Modal.Actions>
							<Button
								color='grey'
								onClick={() => {
									this.setState({
										modalConfirmChageFactor: false,
										idFactor: "",
										typeChangeSetinfactor: "",
										viewMessage: false,
										colorMessage: "",
										message: "",
										sendRequest: false,
									});
								}}>
								Cerrar
							</Button>
						</Modal.Actions>
					)}
				</Modal>
				<Segment loading={this.state.loadForm} basic>
					<Grid>
						<Grid.Row columns={5}>
							<Grid.Column>
								<label>Moneda Base</label>
								<Dropdown
									placeholder='Seleccione Base'
									search
									selection
									value={this.state.baseSelected}
									options={this.state.currencies}
									onChange={this.handleChangeCurrencies.bind(this)}
									onSearchChange={this.handleSearchChange.bind(this)}
								/>
							</Grid.Column>
							{this.state.targetCurrencies.length > 0 && (
								<Grid.Column>
									<label>Moneda Destino</label>
									<Dropdown
										placeholder='Seleccione Objetivo'
										search
										selection
										value={this.state.targetCurrencySelected}
										options={this.state.targetCurrencies}
										onChange={this.handleChangeTargetCurrency.bind(this)}
										onSearchChange={this.handleSearchChangeDesteny.bind(this)}
									/>
								</Grid.Column>
							)}
							{this.state.targetCurrencySelected !== "" && (
								<Grid.Column>
									<label>Tipo de Factor de Cambio </label>
									<Dropdown
										placeholder='Seleccione Tipo'
										selection
										options={[
											{ text: "Tope", value: "TOP" },
											{ text: "Fijo", value: "FIXED" },
										]}
										value={this.state.typeFactorSelected}
										onChange={this.setTypeFactor.bind(this)}
									/>
								</Grid.Column>
							)}
							{this.state.targetCurrencySelected !== "" && (
								<Grid.Column>
									<label>Factor de Cambio Maximo </label>
									<Input
										placeholder='factor de cambio'
										value={this.state.factor}
										onChange={this.onChangeFactor.bind(this)}
										type='text'></Input>
										{this.state.errroFactor && (
										<div style={{color: "red", paddingTop: 10}}>{"Factor de cambio invalido"}</div>)}
								</Grid.Column>
							)}
								
							<Grid.Column>
								<Button
									style={{ marginTop: "20px" }}
									icon
									color='blue'
									labelPosition='right'
									disabled={
										this.state.baseSelected === "" ||
										this.state.targetCurrencySelected === "" ||
										this.state.factor === ""
									}
									onClick={this.viewModalConfirm.bind(this)}>
									<Icon name='plus' />
									Agregar
								</Button>
							</Grid.Column>
						</Grid.Row>
						<br />
						{this.state.factorsConfigs.length > 0 && (
							<h3 style={{ marginTop: "10px", marginBottom: "15px" }}>
								Factores actuales
							</h3>
						)}
						{this.state.factorsConfigs.map((data, index) => {
							return (
								<Grid.Row
									columns='1'
									style={{ paddingTop: "1px", paddingBottom: "5px" }}>
									<Grid.Column
										style={{ marginTop: "0px", marginBottom: "0px" }}>
										<label
											key={index}
											style={{ marginLeft: "10px", fontWeight: "bold" }}
											color='blue'>
											{data.label}
											{" -> "}

											{data.amount.toString().includes("e") && (
												<NumberFormat
													value={Number.parseFloat(data.amount).toFixed(8)}
													//	decimalScale={data.showDecimalAmount !== true ? 2 : 8}
													fixedDecimalScale={true}
													displayType={"text"}
													thousandSeparator={true}
												/>
											)}
											{!data.amount.toString().includes("e") && (
												<NumberFormat
													value={data.amount}
													decimalScale={data.showDecimalAmount !== true ? 2 : 8}
													fixedDecimalScale={true}
													displayType={"text"}
													thousandSeparator={true}
												/>
											)}
											{" ("}
											<NumberFormat
												value={data.equivalent}
												decimalScale={data.showDecimal !== true ? 2 : 8}
												fixedDecimalScale={true}
												displayType={"text"}
												thousandSeparator={true}
											/>
											{")"}
											{"    "}
											{data.type === "TOP" ? " Tipo: Tope " : " Tipo: Fijo "}
											{data.status === "ACTIVE" && (
												<Popup
													content='Inactivar'
													trigger={
														<Button
															size='mini'
															circular
															icon
															color='green'
															style={{ marginLeft: "15px" }}
															onClick={() =>
																this.setchangeStatusFactor(data.id, "INACTIVE")
															}>
															<Icon name='check'></Icon>
														</Button>
													}
												/>
											)}
											{data.status === "INACTIVE" && (
												<Popup
													content='Activar'
													trigger={
														<Button
															size='mini'
															circular
															icon
															style={{ marginLeft: "15px" }}
															color='red'
															onClick={() =>
																this.setchangeStatusFactor(data.id, "ACTIVE")
															}>
															<Icon name='times'></Icon>
														</Button>
													}
												/>
											)}
										</label>
									</Grid.Column>
								</Grid.Row>
							);
						})}
					</Grid>
				</Segment>
			</div>
		);
	}
}
export default addFactorChange;
