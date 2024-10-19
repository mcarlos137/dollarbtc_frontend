import React, { Component } from "react";
import "./Home.css";
//Dependents
import {
	Grid,
	Segment,
	Item,
	Image,
	Icon,
	Message,
	Button,
	Header,
	List,
	Divider,
	Responsive,
	Container,
	Popup,
	Label,
	Dimmer,
	Loader,
	Statistic,
} from "semantic-ui-react";
import {
	DirectLink,
	Element,
	Events,
	animateScroll as scroll,
	scrollSpy,
	scroller,
} from "react-scroll";

import { Link, Redirect } from "react-router-dom";
import power from "../../img/power.png";
import lock from "../../img/lock.png";
import x from "../../img/x.png";
import iconHome1 from "../../img/iconHome1.png";
import iconHome2 from "../../img/iconHome2.png";
import iconHome3 from "../../img/iconHome3.png";
import { parse } from "query-string";
import binance from "../../img/binance.png";
import iconDeposit from "../../img/icn-boton-depositar.png";
import iconTransfer from "../../img/icn-boton-transferir.png";
import hitbtc from "../../img/hitbtc.png";
import localbitcoin from "../../img/localbitcoins.jpg";
import cryptocompare from "../../img/cryptocompare.png";
import aws from "../../img/aws.png";
import user from "../../services/user";
import market from "../../services/market";
import brokers from "../../services/brokers";
import model from "../../services/model";
import axios from "axios";
import currency from "../../common/currency";
import AdSense from "react-adsense";

import Carrousel from "../Carrousel/Carrousel";
import PriceCoin from "../PriceCoin/PriceCoin";
import Calculator from "../Calculator/Calculator";
import FiatCarrouselStadicts from "./FiatCarrouselStadicts/FiatCarrouselStadicts";
import FiatHome from "./FiatHome/FiatHome";
import WalletAndBalance from "./WalletAndBalance/WalletAndBalance";
import MoneyClickHome from "./MoneyClickHome/MoneyClickHome";
import MobileHome from "../MobileHome/MobileHome";
import translate from "../../i18n/translate";
import AssociatedCompaniesCarousel from "./AssociatedCompaniesCarousel/AssociatedCompaniesCarousel";
import CreditIconsHome from "./CreditIcons/CreditIconsHome";
import Review from "./Review/Review";
import otc from "../../services/otc";
import packageJson from "../../../package.json";
class Home extends Component {
	constructor(props) {
		super(props);
		this.homeRef = React.createRef();
		this.state = {
			tokenVerify: "",
			emailVerify: "",
			userVerify: false,
			coins: [],
			list: [],
			list2: [],
			showListCurrency: true,
			show: false,
			scrollPosition: 0,
			translator: props.translate,
			token: "",
			params: "",
			userUSDBalance: 0,
			userBTCBalance: 0,
			userBTCBalancenNew: 0,
			hftUSD: 0,
			hftBTC: 0,
			homeClient: packageJson.designCompany,
		};
		this.closeMessage = this.closeMessage.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	sell() {
		window.location.href = "/sell";
	}
	buy() {
		window.location.href = "/buy";
	}

	getBalanceUserUpdate() {
		let username = user.getUserName();
		let response = user.getBalanceUser(username);
		response
			.then((resp) => {
				let acum = 0;
				let data1 = 0;
				let acumUSD = 0;
				let result = {
					available: 0,
					availableusd: 0,
					estimated: 0,
				};
				let acumdefered = 0;
				let acumdeferedUsd = 0;
				if (
					resp.data.result.modelBalances !== undefined &&
					resp.data.result.modelBalances.length > 0
				) {
					for (let val of resp.data.result.modelBalances) {
						for (let data of val.availableAmounts) {
							if (data.currency === "BTC") {
								acum = acum + parseFloat(data.amount);
							}
							if (data.currency === "USD") {
								acumUSD = acumUSD + parseFloat(data.amount);
								if (isNaN(acumUSD)) {
									acumUSD = 0;
								} else {
									acumUSD = acumUSD;
								}
							}
						}
					}
				}
				let decimales = Math.pow(10, 8);
				let data2 = Math.floor(acum * decimales) / decimales;
				if (isNaN(data2)) {
					data2 = 0;
				} else {
					data2 = data2;
				}
				if (resp.data.result.availableAmounts !== undefined) {
					if (resp.data.result.availableAmounts.length > 0) {
						if (resp.data.result.availableAmounts[0].amount > 0) {
							acumdefered =
								acumdefered +
								Math.floor(
									resp.data.result.availableAmounts[0].amount * decimales,
								) /
									decimales;
						} else {
							acumdefered = acumdefered;
						}

						if (resp.data.result.availableAmounts[1].amount > 0) {
							let value = resp.data.result.availableAmounts[1].amount;
							if (isNaN(value)) {
								acumdeferedUsd = 0;
							} else {
								acumdeferedUsd = value;
							}
							//acumdeferedUsd =resp.data.result.availableAmounts[1].amount
						} else {
							acumdeferedUsd = 0;
						}
					}
				}
				if (resp.data.result.deferredAmounts !== undefined) {
					if (resp.data.result.deferredAmounts.length > 0) {
						if (resp.data.result.deferredAmounts[0].amount > 0) {
							acumdefered =
								acumdefered +
								Math.floor(
									resp.data.result.deferredAmounts[0].amount * decimales,
								) /
									decimales;
						} else {
							acumdefered = acumdefered;
						}
					}
				}
				result.available = acumdefered;
				result.availableusd = acumdeferedUsd;
				result.estimated = data2;
				let username = user.getUserName();
				let response = model.getInitialAmounts(username);
				response
					.then((resp) => {
						if (resp.data.length === 0) {
							this.setState({
								userUSDBalance: 0,
								userBTCBalanceNew: 0,
							});
						} else {
							var data = resp.data;
							let acumUSD = 0;
							let acumBTC = 0;
							Object.entries(data).forEach(([index, data]) => {
								if (data.currency === "USD") {
									acumUSD = data.amount;
									if (isNaN(acumUSD)) {
										acumUSD = 0;
									} else {
										acumUSD = acumUSD;
									}
								}
								if (data.currency === "BTC") {
									acumBTC = data.amount;
									if (isNaN(acumBTC)) {
										acumBTC = 0;
									} else {
										acumBTC = acumBTC;
									}
								}
								this.setState({
									userUSDBalance: acumUSD,
									userBTCBalanceNew: acumBTC,
								});
							});
						}
					})
					.catch((error) => {
						//console.log(error);
					});

				this.setState({
					userBTCBalance: result,
					view: true,
					// userUSDBalance: acumUSD
				});
				// if(this.state.userBTCBalance.availableusd !== undefined && this.state.userUSDBalance !== undefined &&
				// 	this.state.userBTCBalanceNew !== undefined)
				// {
				// 		this.setState({
				// 			show: true
				// 		  });

				// }
				window.sessionStorage.setItem("userBalanceBTC", JSON.stringify(result));
			})
			.catch((error) => {
				//console.log(error);
			});
	}

	componentDidMount() {
		if (window.sessionStorage.getItem("auth") === "true") {
			this.setState({ userBTCBalance: user.getBalanceStorageUserBTC() }, () => {
				//console.log(this.state.userBTCBalance);
			});
			this.getBalanceUserUpdate();
			//	this.getInitialAmounts();
		}

		this.readUrlWhitParams();
		window.addEventListener("scroll", this.handleScroll.bind(this));

		Events.scrollEvent.register("begin", function () {
			////console.log("begin", arguments);
		});

		Events.scrollEvent.register("end", function () {
			////console.log("end", arguments);
		});
		this.getCoins();
		this.getCoins2();
		const query = parse(window.location.search);
		if (query.t !== undefined) {
			var body = {
				token: query.t,
				email: query.e,
			};
			this.setState({ emailVerify: query.e });
			user.verifyUserRequest(body).then((rep) => {
				this.setState({ userVerify: true });
				this.sendStartVerificationEmail(query.u);
				if (window.sessionStorage.getItem("auth") !== undefined) {
					if (window.sessionStorage.getItem("auth") === "true") {
						window.sessionStorage.setItem("verify", true);
					}
				}
			});
		} else if (query.thirdPartySend !== undefined) {
			window.location.href =
				"/transferConfirm/?thirdPartySend=" + query.thirdPartySend;
		}
	}
	sendStartVerificationEmail(email) {
		let bodybtc = {
			userName: email,
			fieldNames: ["email"],
			userVerificationType: "A",
			info: "Verification user email",
		};
		user
			.verifyUserRequestCore(bodybtc)
			.then((res) => {
				//console.log(res);
			})
			.catch((error) => {
				//console.log(error);
			});
	}
	getCoins() {
		let url = market.getFullPriceInfo();
		/*axios
      .get("https://service8081.dollarbtc.com/analysis/getFullPriceInfo")*/
		url
			.then((res) => {
				let arr = [];
				if (res.data !== undefined) {
					Object.entries(res.data).forEach(([k, v]) => {
						let curren = currency.currencies.find(function (element) {
							return element.value === k;
						});
						if (k !== "PA_USD") {
							if (curren !== undefined) {
								let decimales = Math.pow(10, 4);
								let buy6, sell6, buy24, sell24;
								let sell, buy, usdprice, price, forex;
								Object.entries(v).forEach(([valKey, valValue]) => {
									if (valKey === "localBitcoins") {
										Object.entries(valValue).forEach(([intk, intv]) => {
											if (intk === "btcPrice") {
												price = intv;
											}
											if (intk === "usdPrice") {
												usdprice = intv;
											}
											if (intk === "ask") {
												Object.entries(intv).forEach(([askKey, askValue]) => {
													if (askKey === "average") {
														Object.entries(askValue).forEach(
															([averaaskkey, averaaskvalue]) => {
																if (averaaskkey === "price") {
																	buy = averaaskvalue;
																}
																if (averaaskkey === "6H%") {
																	buy6 = averaaskvalue;
																}
																if (averaaskkey === "24H%") {
																	buy24 = averaaskvalue;
																}
															},
														);
													}
												});
											}
											if (intk === "bid") {
												Object.entries(intv).forEach(([bidkey, bidvalue]) => {
													if (bidkey === "average") {
														Object.entries(bidvalue).forEach(
															([averakey, averavalue]) => {
																if (averakey === "6H%") {
																	sell6 = averavalue;
																}
																if (averakey === "24H%") {
																	sell24 = averavalue;
																}
																if (averakey === "price") {
																	sell = averavalue;
																}
															},
														);
													}
												});
											}
										});
									}
									if (valKey === "forex") {
										forex = valValue.usdRate;
									}
								});
								var ob = {
									img: curren.img,
									flag: curren.flag,
									text: this.state.translator(curren.traslate),
									value: k,
									price: Math.floor(price * decimales) / decimales,
									priority: curren.priority,
									sell: sell,
									buy: buy,
									usd_price: usdprice !== undefined ? usdprice : 0,
									forex_price: forex !== undefined ? forex : 0,
									name: curren.name,
									percent: [
										{
											activity: this.state.translator("commons.avgBuy"),
											buyOne: buy6,
											buyTwo: buy24,
										},
										{
											activity: this.state.translator("commons.avgSell"),
											sellOne: sell6,
											sellTwo: sell24,
										},
									],
								};
								this.setState({ list: [...this.state.list, ob] });
							} else {
								let decimales = Math.pow(10, 4);
								let buy6, sell6, buy24, sell24;
								let sell, buy, usdprice, price, forex;
								Object.entries(v).forEach(([valKey, valValue]) => {
									if (valKey === "localBitcoins") {
										Object.entries(valValue).forEach(([intk, intv]) => {
											if (intk === "btcPrice") {
												price = intv;
											}
											if (intk === "usdPrice") {
												usdprice = intv;
											}
											if (intk === "ask") {
												Object.entries(intv).forEach(([askKey, askValue]) => {
													if (askKey === "average") {
														Object.entries(askValue).forEach(
															([averaaskkey, averaaskvalue]) => {
																if (averaaskkey === "price") {
																	buy = averaaskvalue;
																}
																if (averaaskkey === "6H%") {
																	buy6 = averaaskvalue;
																}
																if (averaaskkey === "24H%") {
																	buy24 = averaaskvalue;
																}
															},
														);
													}
												});
											}
											if (intk === "bid") {
												Object.entries(intv).forEach(([bidkey, bidvalue]) => {
													if (bidkey === "average") {
														Object.entries(bidvalue).forEach(
															([averakey, averavalue]) => {
																if (averakey === "6H%") {
																	sell6 = averavalue;
																}
																if (averakey === "24H%") {
																	sell24 = averavalue;
																}
																if (averakey === "price") {
																	sell = averavalue;
																}
															},
														);
													}
												});
											}
										});
									}
									if (valKey === "forex") {
										forex = valValue.usdRate;
									}
								});
								var ob = {
									img: "",
									flag: "",
									text: "",
									value: k,
									price: Math.floor(price * decimales) / decimales,
									priority: 19,
									sell: sell,
									buy: buy,
									usd_price: usdprice !== undefined ? usdprice : 0,
									forex_price: forex !== undefined ? forex : 0,
									name: "",
									percent: [
										{
											activity: this.state.translator("commons.avgBuy"),
											buyOne: buy6,
											buyTwo: buy24,
										},
										{
											activity: this.state.translator("commons.avgSell"),
											sellOne: sell6,
											sellTwo: sell24,
										},
									],
								};
								this.setState({ list: [...this.state.list, ob] });
							}
						}
					});
					this.setState({
						list: this.state.list.sort(function (a, b) {
							return a.priority - b.priority;
						}),
						show: true,
					});
				}
			})
			.catch((error) => {
				//////console.log(error);

				this.setState({ show: true });
			});
	}
	getCoins2() {
		let url = market.getReducedOffers();
		/*axios
      .get("https://service8081.dollarbtc.com/website/getReducedOffers")*/
		url.then((res) => {
			let arr = [];
			let body = {};
			if (res.data !== undefined) {
				Object.entries(res.data).forEach(([k, v]) => {
					let curren = currency.currencies.find(function (element) {
						if (element.value === v.currency) {
							body = {
								currency: v.currency,
								askPrice: v.askPrice !== undefined ? v.askPrice : "",
								bidPrice: v.bidPrice !== undefined ? v.bidPrice : "",
								img: element.img,
							};
							arr.push(body);
						}
					});
					this.setState({
						list2: arr,
					});
				});
				this.setState({
					showListCurrency: false,
				});
			}
		});
	}
	componentWillMount() {
		this.props.setView(true);
	}
	closeMessage() {
		setTimeout(() => {
			this.setState({
				userVerify: false,
			});
			var uri = window.location.toString();
			if (uri.indexOf("?") > 0) {
				var clean_uri = uri.substring(0, uri.indexOf("?"));
				window.history.replaceState({}, document.title, clean_uri);
			}
		}, 10000);
	}
	handleBuy(e, data) {
		// //////console.log(data);
		window.location.href = "/buy/?c=" + data.id;
	}
	handleSell(e, data) {
		window.location.href = "/sell/?c=" + data.name;
	}
	activeAutoScroll() {
		window.scrollBy({
			top: 480,
			left: 0,
			behaviour: "instant",
		});
	}
	activeAutoScrollUp() {
		window.scrollBy(0, -3000);
	}
	scrollToTop() {
		scroll.scrollToTop({
			duration: 800,
			delay: 0,
			smooth: "easeInOutQuart",
		});
	}
	scrollToBottom() {
		scroll.scrollToBottom({
			duration: 800,
			delay: 0,
			smooth: "easeInOutQuart",
		});
	}
	handleScroll() {
		// //////console.log(document.body.scrollTop);
		this.setState({ scrollPosition: window.pageYOffset });
	}
	componentWillUnmount() {
		this.props.setView(false);
		window.removeEventListener("scroll", this.handleScroll);
		Events.scrollEvent.remove("begin");
		Events.scrollEvent.remove("end");
	}
	setItem(e, data) {
		this.props.setItem(data.id);
	}
	setItemMobile(data) {
		this.props.setItem(data);
	}
	setItemLogue(data) {
		this.props.setItem(data);
	}

	readUrlWhitParams() {
		let query = parse(window.location.search);
		//console.log(query);
		let keys = Object.keys(query);
		if (keys.length > 0) {
			let tokenUrl = "";
			let typeOffer = "";

			if (query.offerKey !== undefined) {
				tokenUrl = query.offerKey;
				typeOffer = "offerKey";
				////console.log('tokenUrl', tokenUrl);
				//console.log('typeOffer', typeOffer);

				if (tokenUrl !== undefined && tokenUrl !== " " && tokenUrl !== null) {
					//console.log('entrando ');
					otc
						.getOfferByUrl(tokenUrl)
						.then((res) => {
							//console.log('entrando al readUrl sin brokerOffer', res.data);
							for (let i in res.data) {
								if (res.data.offerType === "BID") {
									//console.log('entrando al BID');
									window.location.href = "/sell/?" + typeOffer + "=" + tokenUrl;
									window.sessionStorage.setItem("tokenOffert", tokenUrl);
								} else if (res.data.offerType === "ASK") {
									//console.log('entrando al ask');
									window.location.href = "/buy/?" + typeOffer + "=" + tokenUrl;
									window.sessionStorage.setItem("tokenOffert", tokenUrl);
									//////console.log(window.sessionStorage.getItem("token"));
								}
							}
							//this.setState({ listUser: list, loadForm: false });
						})
						.catch((error) => {
							//console.log(error);
						});
				}
			} else if (query.brokerOfferKey !== undefined) {
				tokenUrl = query.brokerOfferKey;
				typeOffer = "brokerOfferKey";
				//console.log('tokenUrl', tokenUrl);
				//console.log('typeOffer', typeOffer);

				if (tokenUrl !== undefined && tokenUrl !== " " && tokenUrl !== null) {
					brokers
						.getOfferByUrl(tokenUrl)
						.then((res) => {
							////console.log("entrando al readUrl con brokerOffer", res.data);
							for (let i in res.data) {
								if (res.data.offerType === "BID") {
									//////console.log("entrando al BID")
									window.location.href = "/sell/?" + typeOffer + "=" + tokenUrl;
									window.sessionStorage.setItem("tokenOffert", tokenUrl);
								} else if (res.data.offerType === "ASK") {
									//////console.log("entrando al ask")
									window.location.href = "/buy/?" + typeOffer + "=" + tokenUrl;
									window.sessionStorage.setItem("tokenOffert", tokenUrl);
									//////console.log(window.sessionStorage.getItem("token"));
								}
							}
							//this.setState({ listUser: list, loadForm: false });
						})
						.catch((error) => {
							//////console.log(error);
						});
				}
			}
		}

		// if (tokenUrl !== undefined || tokenUrl !== " ") {

		//   this.setState({ param: body });
		//   // user.verifyUserRequest(body);
		//   setTimeout(() => {
		//     this.setState({ userVerify: user.getRequestVerify() });
		//     if (window.sessionStorage.getItem("auth") !== undefined) {
		//       if (window.sessionStorage.getItem("auth") === "true") {
		//         window.sessionStorage.setItem("verify", true);
		//       }
		//     }
		//   }, 3000);
		// }
	}
	render() {
		//   console.log(this.state.list.length);
		let t = this.state.translator;
		let calculator;
		let buttonScroll;
		let listT, fiat, fiatHome;
		if (this.state.scrollPosition < 1060) {
			buttonScroll = (
				<Button
					size='big'
					icon='angle down'
					circular
					className='flotante'
					onClick={this.scrollToBottom}
				/>
			);
		} else {
			buttonScroll = (
				<Button
					size='big'
					icon='angle up'
					circular
					className='flotante'
					onClick={this.scrollToTop}
				/>
			);
		}

		calculator = <Calculator coins={this.state.list} />;
		fiat = <FiatCarrouselStadicts coins={this.state.list} />;
		fiatHome = <FiatHome coins={this.state.list} />;
		// listT = this.state.list2.map((element, i) => (
		//   <div>
		//     {element.value !== "BTC" && (
		//       <List.Item key={`key-${i}`}>
		//         <Grid>
		//           <Grid.Column width={3}>
		//             <Image
		//               size="mini"
		//               circular
		//               src={element.img}
		//               className="avaStyle"
		//             />
		//           </Grid.Column>
		//           <Grid.Column width={6} textAlign="right">
		//             <div style={{ marginBottom: "5px" }} />
		//             <span>
		//               {element.buy.toLocaleString("en-US", {
		//                 maximumFractionDigits: 2
		//               })}
		//             </span>
		//           </Grid.Column>
		//           <Grid.Column width={7} textAlign="right">
		//             <div style={{ marginBottom: "5px" }} />
		//             <span style={{ marginRight: "15px" }}>
		//               {element.sell.toLocaleString("en-US", {
		//                 maximumFractionDigits: 2
		//               })}
		//             </span>
		//           </Grid.Column>
		//         </Grid>
		//         <Divider hidden style={{ marginTop: "7px", marginBottom: "7px" }} />
		//       </List.Item>
		//     )}
		//   </div>
		// ));
		listT = this.state.list2.map((element, i) => (
			<div>
				{element.value !== "BTC" && (
					<List.Item key={`key-${i}`}>
						<Grid>
							<Grid.Column width={3}>
								<Image
									size='mini'
									circular
									src={element.img}
									className='avaStyle'
								/>
							</Grid.Column>
							<Grid.Column width={6} textAlign='right'>
								<div style={{ marginBottom: "5px" }} />
								<span>
									{element.askPrice.toLocaleString("en-US", {
										maximumFractionDigits: 2,
									})}
								</span>
							</Grid.Column>
							<Grid.Column width={7} textAlign='right'>
								<div style={{ marginBottom: "5px" }} />
								<span style={{ marginRight: "15px" }}>
									{element.bidPrice.toLocaleString("en-US", {
										maximumFractionDigits: 2,
									})}
								</span>
							</Grid.Column>
						</Grid>
						<Divider hidden style={{ marginTop: "7px", marginBottom: "7px" }} />
					</List.Item>
				)}
			</div>
		));
		let rail;
		if (this.state.userVerify) {
			rail = (
				<Grid.Row textAlign='center' columns='equal'>
					<Grid.Column />
					<Grid.Column width={16}>
						<Message
							color='blue'
							inverted
							header={
								<div>
									{t("home.notificationEmailVerify.header.line1")}
									<strong> {this.state.emailVerify} </strong>
									{t("home.notificationEmailVerify.header.line2")}
								</div>
							}
							content={t("home.notificationEmailVerify.content")}
							size='tiny'
						/>
					</Grid.Column>
					<Grid.Column />
				</Grid.Row>
			);
			this.closeMessage();
		}
		const square = { width: 175, height: 175 };
		return (
			<div id='cont' ref={this.homeRef}>
				<Responsive minWidth={1200}>
					{buttonScroll}
					{window.sessionStorage.getItem("auth") !== "true" &&
						window.sessionStorage.getItem("userType") !== "ADMIN" && (
							<Grid columns='equal' doubling style={{ marginTop: "-30px" }}>
								{rail}
								<Grid.Row centered columns={1} style={{ marginTop: "10px" }}>
									<Grid.Column>
										<PriceCoin
											source='home'
											loading={this.state.list.length > 0 ? false : true}
										/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column largeScreen={11} mobile={16} tablet={16}>
										<Carrousel />
									</Grid.Column>
									<Grid.Column>
										<Segment
											color={
												this.state.homeClient === "CONVERTRUE" ||
												this.state.homeClient === "BANCRIPT"
													? "black"
													: "orange"
											}
											loading={this.state.showListCurrency}>
											<Header
												textAlign='center'
												as='h4'
												className='titleComponent'>
												{t("home.shortcut.header")}{" "}
											</Header>
											<Divider />
											<div className='text-center'>
												<Icon
													name='bitcoin'
													color='black'
													size='large'
													style={{ marginBottom: "7px" }}
												/>
												<span style={{ color: "black", fontSize: "18px" }}>
													{" "}
													<b>BITCOIN</b>
												</span>
											</div>
											<Grid>
												<Grid.Row>
													<Grid.Column width={1} />
													<Grid.Column width={7} textAlign='center'>
														<div as='h5'>
															<span style={{ fontSize: "10px" }}>
																{t("home.shortcut.buy")}
															</span>
														</div>
													</Grid.Column>
													<Grid.Column width={7} textAlign='center'>
														<div as='h5'>
															<span style={{ fontSize: "10px" }}>
																{t("home.shortcut.sell")}
															</span>
														</div>
													</Grid.Column>
													<Grid.Column width={1} />
												</Grid.Row>
											</Grid>
											<List className='liststyle'>{listT}</List>
											{window.sessionStorage.getItem("userType") !==
												"ADMIN" && (
												<Header textAlign='center'>
													<Link to='/buy'>
														<Button
															color='blue'
															id='buy'
															onClick={this.setItem.bind(this)}>
															<span
																style={{ color: "white", fontSize: "10px" }}>
																{t("home.shortcut.buyVerb")}
															</span>
														</Button>
													</Link>
													<Link to='/sell'>
														<Button
															color='blue'
															id='sell'
															onClick={this.setItem.bind(this)}>
															<span
																style={{ color: "white", fontSize: "10px" }}>
																{t("home.shortcut.sellVerb")}
															</span>
														</Button>
													</Link>
												</Header>
											)}
										</Segment>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row centered columns={1}>
									<Grid.Column style={{ textAlign: "center" }}>
										<Segment inverted>
											<Header as='h4' inverted color='white'>
												{t("fiatCarouselStatistics.footerLabel")}
											</Header>
										</Segment>
									</Grid.Column>
								</Grid.Row>

								<Grid.Row columns={1} centered>
									<Grid.Column
										largeScreen={16}
										mobile={16}
										tablet={16}
										computer={16}>
										{fiat}
									</Grid.Column>
								</Grid.Row>

								<Grid.Row>
									<Grid.Column
										largeScreen={5}
										computer={5}
										mobile={16}
										tablet={16}>
										<Segment
											style={{ paddingTop: "4px", paddingBottom: "3px" }}>
											<div />
											<Item.Group className='banner-item'>
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome1}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.first.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.first.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
												<Divider hidden />
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome2}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.second.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.second.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
												<Divider hidden />
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome3}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.third.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.third.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
											</Item.Group>
											<div style={{ marginTop: "5px" }} />
											<div />
										</Segment>
									</Grid.Column>
									<Grid.Column
										largeScreen={11}
										computer={11}
										mobile={16}
										tablet={16}>
										{calculator}
									</Grid.Column>
								</Grid.Row>
								<Grid.Row style={{ marginTop: "-80px" }}>
									<Grid.Column
										//largeScreen={5}
										computer={16}
										//mobile={16}
										//tablet={16}
									>
										<AssociatedCompaniesCarousel />
									</Grid.Column>
									<Grid.Column
										largeScreen={3}
										tablet={16}
										mobile={16}
										computer={3}></Grid.Column>
								</Grid.Row>
								<Grid.Row centered textAlign='center'>
									<Header textAlign='center'>
										{t("commons.benefits.header")}
									</Header>
								</Grid.Row>
								<Divider hidden />
								<Grid.Row columns='equal'>
									<Grid.Column textAlign='center'>
										<Image src={power} centered />
										<Header as='h5'>
											{t("commons.benefits.items.first.header")}
										</Header>
										<p>{t("commons.benefits.items.first.content")} </p>
									</Grid.Column>
									<Grid.Column textAlign='center'>
										<Image src={lock} centered />
										<Header as='h5'>
											{t("commons.benefits.items.second.header")}
										</Header>
										<p>{t("commons.benefits.items.second.content")} </p>
									</Grid.Column>
									<Grid.Column textAlign='center'>
										<Image src={x} centered />
										<Header as='h5'>
											{t("commons.benefits.items.third.header")}
										</Header>
										<p>{t("commons.benefits.items.third.content")} </p>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						)}

					{window.sessionStorage.getItem("auth") === "true" &&
						window.sessionStorage.getItem("userType") !== "ADMIN" && (
							<Container
								style={{
									marginTop:
										user.getUserAuth() &&
										window.sessionStorage.getItem("userType") === "ADMIN"
											? "65px"
											: "5px",
									paddingTop:
										window.sessionStorage.getItem("userType") === "ADMIN"
											? "10px"
											: "0px",
								}}>
								<div>
									<Grid columns='equal' centered>
										<Grid.Column
											largeScreen={13}
											mobile={16}
											tablet={14}
											computer={14}>
											{this.state.userBTCBalance.availableusd === undefined ||
												this.state.userUSDBalance === undefined ||
												(this.state.userBTCBalanceNew === undefined && (
													<Dimmer active inverted>
														<Loader inverted>Cargando...</Loader>
													</Dimmer>
												))}
											{this.state.userBTCBalance.availableusd !== undefined &&
												this.state.userUSDBalance !== undefined &&
												this.state.userBTCBalanceNew !== undefined && (
													<Grid
														columns='equal'
														doubling
														style={{ marginTop: "-30px" }}>
														{rail}

														<Grid.Row>
															<Grid.Column
																largeScreen={11}
																mobile={16}
																tablet={16}>
																<WalletAndBalance
																	balanceUser={this.state.userBTCBalance}
																	balanceUsdUser={this.state.userUSDBalance}
																	balancebtcUser={this.state.userBTCBalanceNew}
																	setItem={this.setItemLogue.bind(this)}
																/>

																<Divider hidden></Divider>
																<Grid>
																	<Grid.Column
																		largeScreen={8}
																		mobile={8}
																		tablet={8}>
																		<div align='center'>
																			<Button
																				style={{
																					marginTop: 0,
																					backgroundColor: "#207ef2 ",
																					color: "white",
																					width: "300px",
																					height: "50px",
																				}}
																				onClick={this.buy}>
																				<div align='center'>
																					<Image
																						src={iconDeposit}
																						style={{
																							width: "30px",
																							height: "30px",
																						}}
																						spaced='right'
																					/>
																					{""}
																					{t("home.homeLogue.deposit")}
																				</div>
																			</Button>
																		</div>
																	</Grid.Column>
																	<Grid.Column
																		largeScreen={8}
																		mobile={8}
																		tablet={8}>
																		<div align='center'>
																			<Button
																				style={{
																					marginTop: 0,
																					backgroundColor: "#207ef2 ",
																					color: "white",
																					width: "300px",
																					height: "50px",
																				}}
																				onClick={this.sell}>
																				<div align='center'>
																					<Image
																						src={iconTransfer}
																						style={{
																							width: "40px",
																							height: "30px",
																						}}
																						spaced='right'
																					/>
																					{""}
																					{t("home.homeLogue.transfer")}
																				</div>
																			</Button>
																		</div>
																	</Grid.Column>
																</Grid>
															</Grid.Column>
															<Grid.Column>
																<MoneyClickHome
																	balanceUser={this.state.userBTCBalance}
																/>
															</Grid.Column>
														</Grid.Row>
														<Grid.Row centered columns={1}>
															<Grid.Column style={{ textAlign: "center" }}>
																<Segment inverted>
																	<Header as='h4' inverted color='white'>
																		{t("fiatCarouselStatistics.footerLabel")}
																	</Header>
																</Segment>
															</Grid.Column>
														</Grid.Row>

														<Grid.Row columns={1} centered>
															<Grid.Column
																largeScreen={16}
																mobile={16}
																tablet={16}
																computer={16}>
																{fiatHome}
															</Grid.Column>
														</Grid.Row>
													</Grid>
												)}
										</Grid.Column>
									</Grid>
								</div>
							</Container>
						)}
				</Responsive>
				<Responsive minWidth={992} maxWidth={1199}>
					{buttonScroll}
					{window.sessionStorage.getItem("auth") !== "true" &&
						window.sessionStorage.getItem("userType") !== "ADMIN" && (
							<Grid columns='equal' doubling style={{ marginTop: "-30px" }}>
								{rail}
								<Grid.Row centered columns={1} style={{ marginTop: "10px" }}>
									<Grid.Column>
										<PriceCoin
											source='home'
											loading={this.state.list.length > 0 ? false : true}
										/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column largeScreen={11} mobile={16} tablet={16}>
										<Carrousel />
									</Grid.Column>
									<Grid.Column>
										<Segment
											color='orange'
											loading={this.state.list.length <= 0}>
											<Header
												textAlign='center'
												as='h4'
												className='titleComponent'>
												{t("home.shortcut.header")}{" "}
											</Header>
											<Divider />
											<div className='text-center'>
												<Icon
													name='bitcoin'
													color='black'
													size='large'
													style={{ marginBottom: "7px" }}
												/>
												<span style={{ color: "black", fontSize: "18px" }}>
													{" "}
													<b>BITCOIN</b>
												</span>
											</div>
											<Grid>
												<Grid.Row>
													<Grid.Column width={1} />
													<Grid.Column width={7} textAlign='center'>
														<div as='h5'>
															<span style={{ fontSize: "10px" }}>
																{t("home.shortcut.buy")}
															</span>
														</div>
													</Grid.Column>
													<Grid.Column width={7} textAlign='center'>
														<div as='h5'>
															<span style={{ fontSize: "10px" }}>
																{t("home.shortcut.sell")}
															</span>
														</div>
													</Grid.Column>
													<Grid.Column width={1} />
												</Grid.Row>
											</Grid>
											<List className='liststyle'>{listT}</List>
											{window.sessionStorage.getItem("userType") !==
												"ADMIN" && (
												<Header textAlign='center'>
													<Link to='/buy'>
														<Button
															color='blue'
															id='buy'
															onClick={this.setItem.bind(this)}>
															<span
																style={{ color: "white", fontSize: "10px" }}>
																{t("home.shortcut.buyVerb")}
															</span>
														</Button>
													</Link>
													<Link to='/sell'>
														<Button
															color='blue'
															id='sell'
															onClick={this.setItem.bind(this)}>
															<span
																style={{ color: "white", fontSize: "10px" }}>
																{t("home.shortcut.sellVerb")}
															</span>
														</Button>
													</Link>
												</Header>
											)}
										</Segment>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row centered columns={1}>
									<Grid.Column style={{ textAlign: "center" }}>
										<Segment inverted>
											<Header as='h4' inverted color='white'>
												{t("fiatCarouselStatistics.footerLabel")}
											</Header>
										</Segment>
									</Grid.Column>
								</Grid.Row>

								<Grid.Row columns={1} centered>
									<Grid.Column
										largeScreen={16}
										mobile={16}
										tablet={16}
										computer={16}>
										{fiat}
									</Grid.Column>
								</Grid.Row>

								<Grid.Row>
									<Grid.Column
										largeScreen={5}
										computer={5}
										mobile={16}
										tablet={16}>
										<Segment
											style={{ paddingTop: "4px", paddingBottom: "3px" }}>
											<div />
											<Item.Group className='banner-item'>
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome1}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.first.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.first.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
												<Divider hidden />
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome2}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.second.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.second.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
												<Divider hidden />
												<Item
													as={
														window.sessionStorage.getItem("auth") !== "true"
															? "a"
															: ""
													}
													href={
														window.sessionStorage.getItem("auth") !== "true"
															? "/registration"
															: "/"
													}>
													<Image
														src={iconHome3}
														size='tiny'
														className='image-banner'
													/>
													<Item.Content verticalAlign='top'>
														<Item.Header className='titleItem'>
															{t("home.banner.items.third.header")}
														</Item.Header>
														<Item.Meta>
															<p className='justifyText'>
																{t("home.banner.items.third.content")}
															</p>
														</Item.Meta>
													</Item.Content>
												</Item>
											</Item.Group>
											<div style={{ marginTop: "5px" }} />
											<div />
										</Segment>
									</Grid.Column>
									<Grid.Column
										largeScreen={11}
										computer={11}
										mobile={16}
										tablet={16}>
										{calculator}
									</Grid.Column>
								</Grid.Row>
								<Grid.Row style={{ marginTop: "-80px" }}>
									<Grid.Column
										//largeScreen={5}
										computer={16}
										//mobile={16}
										//tablet={16}
									>
										<AssociatedCompaniesCarousel />
									</Grid.Column>
									<Grid.Column
										largeScreen={3}
										tablet={16}
										mobile={16}
										computer={3}></Grid.Column>
								</Grid.Row>
								<Grid.Row centered textAlign='center'>
									<Header textAlign='center'>
										{t("commons.benefits.header")}
									</Header>
								</Grid.Row>
								<Divider hidden />
								<Grid.Row columns='equal'>
									<Grid.Column textAlign='center'>
										<Image src={power} centered />
										<Header as='h5'>
											{t("commons.benefits.items.first.header")}
										</Header>
										<p>{t("commons.benefits.items.first.content")} </p>
									</Grid.Column>
									<Grid.Column textAlign='center'>
										<Image src={lock} centered />
										<Header as='h5'>
											{t("commons.benefits.items.second.header")}
										</Header>
										<p>{t("commons.benefits.items.second.content")} </p>
									</Grid.Column>
									<Grid.Column textAlign='center'>
										<Image src={x} centered />
										<Header as='h5'>
											{t("commons.benefits.items.third.header")}
										</Header>
										<p>{t("commons.benefits.items.third.content")} </p>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						)}

					{window.sessionStorage.getItem("auth") === "true" &&
						window.sessionStorage.getItem("userType") !== "ADMIN" && (
							<Container
								style={{
									marginTop:
										user.getUserAuth() &&
										window.sessionStorage.getItem("userType") === "ADMIN"
											? "65px"
											: "5px",
									paddingTop:
										window.sessionStorage.getItem("userType") === "ADMIN"
											? "10px"
											: "0px",
								}}>
								<div>
									<Grid columns='equal' centered>
										<Grid.Column
											largeScreen={13}
											mobile={16}
											tablet={14}
											computer={14}>
											{this.state.userBTCBalance.availableusd === undefined ||
												this.state.userUSDBalance === undefined ||
												(this.state.userBTCBalanceNew === undefined && (
													<Dimmer active inverted>
														<Loader inverted>Cargando...</Loader>
													</Dimmer>
												))}
											{this.state.userBTCBalance.availableusd !== undefined &&
												this.state.userUSDBalance !== undefined &&
												this.state.userBTCBalanceNew !== undefined && (
													<Grid
														columns='equal'
														doubling
														style={{ marginTop: "-30px" }}>
														{rail}

														<Grid.Row>
															<Grid.Column
																largeScreen={11}
																mobile={16}
																tablet={16}>
																<WalletAndBalance
																	balanceUser={this.state.userBTCBalance}
																	balanceUsdUser={this.state.userUSDBalance}
																	balancebtcUser={this.state.userBTCBalanceNew}
																	setItem={this.setItemLogue.bind(this)}
																/>

																<Divider hidden></Divider>
																<Grid>
																	<Grid.Column
																		largeScreen={8}
																		mobile={8}
																		tablet={8}>
																		<div align='center'>
																			<Button
																				style={{
																					marginTop: -10,
																					backgroundColor: "#207ef2 ",
																					color: "white",
																					width: "392px",
																					height: "50px",
																				}}
																				onClick={this.buy}>
																				<div align='center'>
																					<Image
																						src={iconDeposit}
																						style={{
																							width: "30px",
																							height: "30px",
																						}}
																						spaced='right'
																					/>
																					{""}
																					{t("home.homeLogue.deposit")}
																				</div>
																			</Button>
																		</div>
																	</Grid.Column>
																	<Grid.Column
																		largeScreen={8}
																		mobile={8}
																		tablet={8}>
																		<div align='center'>
																			<Button
																				style={{
																					marginTop: -10,
																					backgroundColor: "#207ef2 ",
																					color: "white",
																					width: "392px",
																					height: "50px",
																				}}
																				onClick={this.sell}>
																				<div align='center'>
																					<Image
																						src={iconTransfer}
																						style={{
																							width: "40px",
																							height: "30px",
																						}}
																						spaced='right'
																					/>
																					{""}
																					{t("home.homeLogue.transfer")}
																				</div>
																			</Button>
																		</div>
																	</Grid.Column>
																</Grid>
															</Grid.Column>
															<Grid.Column>
																<MoneyClickHome
																	balanceUser={this.state.userBTCBalance}
																/>
															</Grid.Column>
														</Grid.Row>
														<Grid.Row centered columns={1}>
															<Grid.Column style={{ textAlign: "center" }}>
																<Segment inverted>
																	<Header as='h4' inverted color='white'>
																		{t("fiatCarouselStatistics.footerLabel")}
																	</Header>
																</Segment>
															</Grid.Column>
														</Grid.Row>

														<Grid.Row columns={1} centered>
															<Grid.Column
																largeScreen={16}
																mobile={16}
																tablet={16}
																computer={16}>
																{fiatHome}
															</Grid.Column>
														</Grid.Row>
													</Grid>
												)}
										</Grid.Column>
									</Grid>
								</div>
							</Container>
						)}
				</Responsive>
				<Responsive minWidth={0} maxWidth={991}>
					<MobileHome
						balanceUser={this.state.userBTCBalance}
						balanceUsdUser={this.state.userUSDBalance}
						balancebtcUser={this.state.userBTCBalanceNew}
						balanceUserMoneyClick={this.state.userBTCBalance}
						// balanceUser={this.props.balanceUser}
						// balanceUsdUser={this.props.balanceUsdUser}
						setItem={this.setItemMobile.bind(this)}
						downloadGuide={this.props.downloadGuide}
					/>
				</Responsive>
				{window.sessionStorage.getItem("auth") !== "true" &&
					window.sessionStorage.getItem("userType") !== "ADMIN" && (
						<Divider hidden />
					)}
				{/* <CreditIconsHome /> */}
			</div>
		);
	}
}
export default translate(Home);
