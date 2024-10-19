import React, { Component } from "react";
import {
	Segment,
	Grid,
	Menu,
	Dimmer,
	Loader,
	Divider,
	Image,
	Responsive,
	Header,
	Select,
} from "semantic-ui-react";
import "./MoneyclickInfo.css";
import translate from "../../../i18n/translate";
import { Link } from "react-router-dom";
import RetailService from "../../../services/moneyclick";
import userService from "../../../services/user";
import MenuRetail from "../MenuRetail/MenuRetail";
import playstore from "../../../img/playStore.png";
import backgroundMC from "../../../img/background-moneyclick.jpg";
// import playstore from "../../img/playStore.png";
// import appstore from "../../img/appStore.png";
import appstore from "../../../img/appStore.png";
import phone from "../../../img/telefono-app.png";
import logoMCRetail from "../../../img/logo-moneyclick-retail.jpg";
import logoMCAdmin from "../../../img/logo-moneyclick-admin.jpg";
import logoMC from "../../../img/logoNuevoMC.jpg";
import MCphone from "../../../img/telefono-app.png";
import "../../Moneyclick/Moneyclick.css";

class Retail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			translator: props.translate,
			load: false,
			user: window.sessionStorage.getItem("username"),
			auth: userService.getUserAuth() === "true" ? true : false,
			balanceBtc: 0,
			balanceOtherCurrenciesColOne: [],
			balanceOtherCurrenciesColTwo: [],
			isMoneyclick: false,
			activeMenuRetail: false,
			loading: false,
			activeItem: "",
			activeId: "",
			retails: [],
			retailsInfo: [],
			retailsInfoMobile: [],
			retailSelected: "",
		};
		this.handleItem = this.handleItem.bind(this);
	}

	componentDidMount() {
		this.getBalance();
		this.isMoneyclick();
		let retail = JSON.parse(window.sessionStorage.getItem("retail"));
		// let retail = [
		//   "81af463767884fa4aaff94f4d2cb12e4",
		//   "67ea43ab0cfa4f6dbf28a77d8f4376ee"
		// ];
		if (retail !== null) {
			this.getInfo(retail);
			this.getInfoMobile(retail);
		}
		if (window.innerWidth < 640) {
			this.setState({ miniMenu: true });
		} else {
			this.setState({ miniMenu: false });
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
		this.setState({ activeItem: data.name, activeId: data.id });
	}
	isMoneyclick() {
		let devices = JSON.parse(window.sessionStorage.getItem("devices"));

		if (devices !== null) {
			if (devices.length !== 0 || devices.length !== undefined) {
				for (let i = 0; i < devices.length; i++) {
					Object.entries(devices[i]).forEach(([key, value]) => {
						if (key === "source") {
							if (value === "MONEYCLICK") {
								this.setState({ isMoneyclick: true });
							}
						}
					});
				}
			}
		}
	}
	getBalance() {
		if (this.state.user !== null) {
			this.setState({ loading: true });
			RetailService.getBalanceMoneyclick(this.state.user)
				.then((resp) => {
					let currenciesColOne = [];
					let currenciesColTwo = [];
					Object.entries(resp.data).forEach(([key, value], index) => {
						if (
							key !== "usdEstimatedBalance" &&
							key !== "btcEstimatedBalance" &&
							key !== "BTC"
						) {
							let module = index % 2;
							let obj = {};
							obj.currency = key;
							Object.entries(value).forEach(([k, v]) => {
								if (k === "availableBalance") {
									obj.balance = v;
									if (module === 0) {
										currenciesColOne.push(obj);
										this.setState({
											balanceOtherCurrenciesColOne: currenciesColOne,
										});
									} else {
										currenciesColTwo.push(obj);
										this.setState({
											balanceOtherCurrenciesColTwo: currenciesColTwo,
										});
									}
								}
							});
						}
					});
					this.setState({ loading: false });
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}
	getInfo(retail) {
		for (let i = 0; i < retail.length; i++) {
			this.setState({ activeId: retail[0], load: true });
			RetailService.getInfoRetail(retail[i])
				.then((resp) => {
					var ob = {
						id: retail[i],
						name: resp.data.title,
					};

					this.setState({ retailsInfo: [...this.state.retailsInfo, ob] });
				})
				.catch((error) => {
					console.log(error);
				});
		}

		this.setState({
			load: false,
		});
	}

	getInfoMobile(retail) {
		for (let i = 0; i < retail.length; i++) {
			this.setState({ activeId: retail[0], load: true });
			RetailService.getInfoRetail(retail[i])
				.then((resp) => {
					var optionToPush = {};
					optionToPush.key = retail[i];
					optionToPush.text = resp.data.title;
					optionToPush.value = retail[i];
					this.setState({
						retailsInfoMobile: [...this.state.retailsInfoMobile, optionToPush],
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}

		this.setState({
			load: false,
		});
	}

	MakeStateRetail(e, value) {
		this.setState({
			activeId: value.value,
			activeMenuRetail: true,
		});
	}

	render() {
		let playStore = (
			<Image src={playstore} size='small' className='logo-storeMC' />
		);
		let appStore = (
			<Image src={appstore} size='small' className='logo-storeMC' />
		);
		let t = this.state.translator;
		return (
			<div>
				<Responsive minWidth={992}>
					{this.state.auth && (
						<Segment color='orange'>
							{/* {this.state.auth && ( */}
							<div>
								<div>
									<Dimmer.Dimmable dimmed={!this.state.loading}>
										<Dimmer active={this.state.loading} inverted>
											<Loader>{t("profile.optionDetail.loading")}</Loader>
										</Dimmer>
										<Grid columns='equal'>
											<Grid.Row>
												<Grid.Column largeScreen={1} tablet={1} computer={1} />
												<Grid.Column
													largeScreen={7}
													mobile={16}
													tablet={8}
													computer={7}>
													<b>
														<label> {t("moneyclick.balanceAvailable")}</label>
													</b>

													<Segment secondary style={{ borderStyle: "none" }}>
														<Grid style={{ marginTop: 10 }}>
															<Grid.Row>
																<Grid.Column mobile={7} tablet={7} computer={7}>
																	<span>
																		{this.state.balanceOtherCurrenciesColTwo
																			.length !== 0 &&
																			this.state.balanceOtherCurrenciesColTwo.map(
																				(item, index) => (
																					<div key={index}>
																						<span className='balance'>
																							{item.currency}
																							{":"}
																						</span>
																						<span
																							style={{
																								color: "#207ef2 ",
																								marginLeft: "1 px",
																							}}>
																							{item.balance !== null
																								? item.balance.toLocaleString(
																										"en-US",
																										{
																											maximumFractionDigits: 2,
																										},
																								  )
																								: 0}
																						</span>
																						<Divider
																							hidden
																							style={{
																								margin: "4px 0px 4px 0px",
																							}}
																						/>
																					</div>
																				),
																			)}
																	</span>
																</Grid.Column>
																<Grid.Column mobile={1} tablet={1} computer={1}>
																	<Divider vertical></Divider>
																</Grid.Column>
																<Grid.Column mobile={7} tablet={7} computer={7}>
																	<span>
																		{this.state.balanceOtherCurrenciesColOne
																			.length !== 0 &&
																			this.state.balanceOtherCurrenciesColOne.map(
																				(item, index) => (
																					<div key={index}>
																						<span className='balance'>
																							{item.currency}
																							{":"}
																						</span>
																						<span
																							style={{
																								color: "#207ef2 ",
																								marginLeft: "1 px",
																							}}>
																							{item.balance !== null
																								? item.balance.toLocaleString(
																										"en-US",
																										{
																											maximumFractionDigits: 2,
																										},
																								  )
																								: 0}
																						</span>
																						<Divider
																							hidden
																							style={{
																								margin: "4px 0px 4px 0px",
																							}}
																						/>
																					</div>
																				),
																			)}
																	</span>
																</Grid.Column>
															</Grid.Row>
														</Grid>
													</Segment>
												</Grid.Column>
											</Grid.Row>
										</Grid>
									</Dimmer.Dimmable>
									<Divider hidden />
								</div>

								{window.sessionStorage.getItem("retail") !== null && (
									<div>
										<Divider hidden />
										<Dimmer active={this.state.load} inverted>
											<Loader>{t("profile.optionDetail.loading")}</Loader>
										</Dimmer>
										<Grid.Row>
											<Grid.Column
												largeScreen={16}
												mobile={16}
												tablet={8}
												computer={16}>
												<Menu pointing>
													{this.state.retailsInfo.length !== 0 &&
														this.state.retailsInfo.map((item, index) => (
															<div key={index}>
																<Menu.Item
																	id={item.id}
																	name={item.name}
																	active={item.id === this.state.activeId}
																	onClick={this.handleItem}
																	content={item.name}></Menu.Item>
															</div>
														))}
												</Menu>
												<MenuRetail idRetail={this.state.activeId} />
											</Grid.Column>
										</Grid.Row>
										<Grid centered divided columns={3}>
											<Divider hidden />
											<Header
												as='h3'
												color='blue'
												className='title-download-apps'>
												{t("profile.optionPointsOfSales.title")}
											</Header>
											<Grid.Row>
												<Grid.Column textAlign='center'>
													<Image
														size='small'
														centered
														src={logoMC}
														className='logoMC'
													/>
													<Image.Group>
														<Link to='/'>
															<Image
																size='tiny'
																src={playstore}
																className='logo-store-retail'
															/>
														</Link>
														<Link to='/'>
															<Image
																size='tiny'
																src={appstore}
																className='logo-store-retail'
															/>
														</Link>
													</Image.Group>
												</Grid.Column>

												<Grid.Column textAlign='center'>
													<Image centered size='small' src={logoMCRetail} />
													<Image.Group>
														<Link to='/'>
															<Image
																size='tiny'
																src={playstore}
																className='logo-store-retail'
															/>
														</Link>
														<Link to='/'>
															<Image
																size='tiny'
																src={appstore}
																className='logo-store-retail'
															/>
														</Link>
													</Image.Group>
												</Grid.Column>

												<Grid.Column textAlign='center'>
													<Image centered size='small' src={logoMCAdmin} />
													<Image.Group>
														<Link to='/'>
															<Image
																size='tiny'
																src={playstore}
																className='logo-store-retail'
															/>
														</Link>
														<Link to='/'>
															<Image
																size='tiny'
																src={appstore}
																className='logo-store-retail'
															/>
														</Link>
													</Image.Group>
												</Grid.Column>
											</Grid.Row>
										</Grid>
									</div>
								)}
								{window.sessionStorage.getItem("retail") === null && (
									<Grid columns={2} verticalAlign='middle'>
										<Grid.Row className='img-phone'>
											<Grid.Column
												centered
												largeScreen={8}
												tablet={8}
												computer={8}>
												<Header
													as='h3'
													color='blue'
													className='title-moneyclick'>
													{t("moneyclick.downloadMoneyclick")}
												</Header>
												<Divider hidden />
												<Image.Group className='img-download'>
													<Link to='/'>
														<Image
															size='small'
															src={playstore}
															className='logo-store'
														/>
													</Link>
													<Link to='/'>
														<Image
															size='small'
															src={appstore}
															className='logo-store'
														/>
													</Link>
												</Image.Group>
											</Grid.Column>
											<Grid.Column
												centered
												largeScreen={8}
												tablet={8}
												computer={8}>
												<Image floated='left' src={phone} />
											</Grid.Column>
										</Grid.Row>
									</Grid>
								)}
							</div>
							{/* )} */}
						</Segment>
					)}

					{!this.state.auth &&
						window.sessionStorage.getItem("retail") === null && (
							<div>
								<Grid centered>
									<Grid.Column
										largeScreen={13}
										mobile={16}
										tablet={14}
										computer={13}>
										<Segment color='orange' style={{ padding: 0 }}>
											<Image src={backgroundMC} className='img-background' />
											<Header
												as='h1'
												className='title-download'
												style={{ marginLeft: "-140px" }}>
												{t("moneyclick.downloadMoneyclick")}
											</Header>
											<Image.Group
												className='button-download'
												style={{ marginLeft: "-140px" }}>
												{/* <Link to='/'>{playStore}</Link>
											<Link to='/'>{appStore}</Link> */}
												<a href='https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick'>
													{/* <Link to="" > */}
													{playStore}
													{/* </Link> */}
												</a>
												<a href='https://apps.apple.com/es/app/moneyclick/id1501864260'>
													{/* <Link to="" > */}
													{appStore}
													{/* </Link> */}
												</a>
											</Image.Group>
										</Segment>
									</Grid.Column>
								</Grid>
							</div>
						)}
				</Responsive>

				<Responsive minWidth={0} maxWidth={991}>
					<div>
						<Dimmer.Dimmable dimmed={!this.state.loading}>
							<Dimmer active={this.state.loading} inverted>
								<Loader>{t("profile.optionDetail.loading")}</Loader>
							</Dimmer>
							<Grid columns='equal'>
								<Grid.Row>
									<Grid.Column largeScreen={1} tablet={1} computer={1} />
									<Grid.Column
										largeScreen={7}
										mobile={16}
										tablet={8}
										computer={7}>
										<b>
											<Header
												as='h4'
												textAlign='center'
												className='titleComponentMobile'>
												{t("moneyclick.balanceAvailable")}
											</Header>
											<hr style={{ borderColor: "#207ef2" }}></hr>
										</b>

										<Segment secondary style={{ borderStyle: "none" }}>
											<Grid style={{ marginTop: 10 }}>
												<Grid.Row>
													<Grid.Column mobile={7} tablet={8}>
														<span>
															{this.state.balanceOtherCurrenciesColTwo
																.length !== 0 &&
																this.state.balanceOtherCurrenciesColTwo.map(
																	(item, index) => (
																		<div key={index}>
																			<span className='balance'>
																				{item.currency}
																				{":"}
																			</span>
																			<span
																				style={{
																					color: "#207ef2 ",
																					marginLeft: "1 px",
																				}}>
																				{item.balance !== null
																					? item.balance.toLocaleString(
																							"en-US",
																							{
																								maximumFractionDigits: 2,
																							},
																					  )
																					: 0}
																			</span>
																			<Divider
																				hidden
																				style={{ margin: "4px 0px 4px 0px" }}
																			/>
																		</div>
																	),
																)}
														</span>
													</Grid.Column>
													<Grid.Column mobile={1} tablet={6}>
														<Divider vertical></Divider>
													</Grid.Column>
													<Grid.Column mobile={7} tablet={8}>
														<span>
															{this.state.balanceOtherCurrenciesColOne
																.length !== 0 &&
																this.state.balanceOtherCurrenciesColOne.map(
																	(item, index) => (
																		<div key={index}>
																			<span className='balance'>
																				{item.currency}
																				{":"}
																			</span>
																			<span
																				style={{
																					color: "#207ef2 ",
																					marginLeft: "1 px",
																				}}>
																				{item.balance !== null
																					? item.balance.toLocaleString(
																							"en-US",
																							{
																								maximumFractionDigits: 2,
																							},
																					  )
																					: 0}
																			</span>
																			<Divider
																				hidden
																				style={{ margin: "4px 0px 4px 0px" }}
																			/>
																		</div>
																	),
																)}
														</span>
													</Grid.Column>
												</Grid.Row>
											</Grid>
										</Segment>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Dimmer.Dimmable>
						<Divider hidden />
					</div>
					{window.sessionStorage.getItem("retail") !== null &&
						this.state.auth === true && (
							<div>
								<Dimmer.Dimmable dimmed={!this.state.loading}>
									<Dimmer active={this.state.loading} inverted>
										<Loader>{t("profile.optionDetail.loading")}</Loader>
									</Dimmer>
									{/* <Dimmer active={this.state.load} inverted>
                  <Loader>{t("profile.optionDetail.loading")}</Loader>
                </Dimmer> */}
									<Grid.Row>
										<Grid.Column
											largeScreen={16}
											mobile={16}
											tablet={8}
											computer={16}>
											<Select
												placeholder='Seleccionar Retails'
												style={{ width: "375px" }}
												options={this.state.retailsInfoMobile}
												onChange={this.MakeStateRetail.bind(this)}
												// value={this.state.activeId}
											/>
											{this.state.activeMenuRetail === true && (
												<MenuRetail idRetail={this.state.activeId} />
											)}
											<Divider hidden></Divider>

											{/* <MenuRetail idRetail={this.state.activeId} />  */}
										</Grid.Column>
									</Grid.Row>
									<Grid centered divided>
										<Grid.Column textAlign='center'>
											<Divider hidden />
											<Header
												as='h4'
												color='blue'
												className='title-download-apps'>
												{t("profile.optionPointsOfSales.title")}
											</Header>
											<Grid.Row>
												<Image
													size='small'
													centered
													src={logoMC}
													className='logoMC'
												/>
												<Image.Group>
													<Link to='/'>
														<Image
															size='tiny'
															src={playstore}
															className='logo-store-retail'
														/>
													</Link>
													<Link to='/'>
														<Image
															size='tiny'
															src={appstore}
															className='logo-store-retail'
														/>
													</Link>
												</Image.Group>
											</Grid.Row>

											<Grid.Row>
												<Image centered size='small' src={logoMCRetail} />
												<Image.Group>
													<Link to='/'>
														<Image
															size='tiny'
															src={playstore}
															className='logo-store-retail'
														/>
													</Link>
													<Link to='/'>
														<Image
															size='tiny'
															src={appstore}
															className='logo-store-retail'
														/>
													</Link>
												</Image.Group>
											</Grid.Row>

											<Grid.Row>
												<Image centered size='small' src={logoMCAdmin} />
												<Image.Group>
													<Link to='/'>
														<Image
															size='tiny'
															src={playstore}
															className='logo-store-retail'
														/>
													</Link>
													<Link to='/'>
														<Image
															size='tiny'
															src={appstore}
															className='logo-store-retail'
														/>
													</Link>
												</Image.Group>
											</Grid.Row>
										</Grid.Column>
									</Grid>
								</Dimmer.Dimmable>
							</div>
						)}
					{window.sessionStorage.getItem("retail") === null &&
						this.state.auth === false && (
							<div>
								<Grid>
									<Grid.Column
										largeScreen={8}
										mobile={8}
										tablet={8}
										computer={8}>
										<Header
											as='h4'
											color='blue'
											className='title-download-apps'
											style={{ textAlign: "center" }}>
											{t("profile.optionPointsOfSales.titleMobile")}
										</Header>
										<Grid.Row>
											{/* <Image.Group>
											<Link to='/'>
												<Image
													size='medium'
													src={playstore}
													className='logo-store-retail'
												/>
											</Link>
										</Image.Group> */}
											<Image.Group
											//	className='button-download'
											// style={{ marginLeft: "-140px" }}
											>
												{/* <Link to='/'>{playStore}</Link>
											<Link to='/'>{appStore}</Link> */}
												<a href='https://play.google.com/store/apps/details?id=com.dollarbtc.moneyclick'>
													{/* <Link to="" > */}
													{/* {playstore} */}
													{/* </Link> */}
													<Image
														size='small'
														src={playstore}
														className='logo-store-retail'
													/>
												</a>
											</Image.Group>
										</Grid.Row>
										<Grid.Row>
											<Image.Group
											// className='button-download'
											>
												{/* <Link to='/'>
												<Image
													size='medium'
													src={appstore}
													className='logo-store-retail'
												/>
											</Link> */}
												<a href='https://apps.apple.com/es/app/moneyclick/id1501864260'>
													{/* <Link to="" > */}
													{/* {appstore} */}
													{/* </Link> */}
													<Image
														size='small'
														src={appstore}
														className='logo-store-retail'
													/>
												</a>
											</Image.Group>
										</Grid.Row>
									</Grid.Column>
									<Grid.Column
										largeScreen={8}
										mobile={8}
										tablet={8}
										computer={8}>
										<Grid.Row>
											<Image
												size='medium'
												centered
												src={MCphone}
												className='logoMC'
											/>
										</Grid.Row>
									</Grid.Column>
								</Grid>
							</div>
						)}
				</Responsive>
			</div>
		);
	}
}
export default translate(Retail);
