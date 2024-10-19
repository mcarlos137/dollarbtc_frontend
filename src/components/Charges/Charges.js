import React, { Component } from "react";
import {
	Table,
	Accordion,
	Grid,
	Header,
	Container,
	Segment,
	Responsive,
	Divider,
} from "semantic-ui-react";
//import "./Faqs.css";
import NumberFormat from "react-number-format";
import otc from "../../services/otc";
import translate from "../../i18n/translate";
import { isMobile } from "react-device-detect";
class Charges extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			translator: props.translate,
			charges: [],
			loading: false,
		};
	}
	componentDidMount() {
		this.getCharges();
		this.setState({
			translator: this.props.translate,
		});
	}
	getCharges() {
		this.setState({ loading: true });
		otc
			.getCharges()
			.then((resp) => {
				//	console.log(resp);
				let charges = resp.data;
				let listCharges = [];
				Object.entries(charges).forEach(([key, value]) => {
					let objChargeByCurrency = {};
					objChargeByCurrency.currency = key;
					objChargeByCurrency.typeOperation = value;
					listCharges.push(objChargeByCurrency);
				});
				console.log(listCharges);
				this.setState({ charges: listCharges, loading: false });
			})
			.catch((error) => {
				console.log(error);
			});
	}
	handleClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	};
	floorDecimals = (value, numberDecimals) => {
		let decimales = Math.pow(10, numberDecimals);
		return Math.floor(value * decimales) / decimales;
	};
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	render() {
		let t = this.state.translator;
		const { activeIndex } = this.state;

		return (
			<div>
				{isMobile && <Divider hidden style={{ marginTop: "3em" }} />}
				<Segment color={!isMobile ? "orange" : ""} loading={this.state.loading}>
					<Header
						as='h4'
						style={{
							color: "#207ef2",
							fontWeight: "bold",
							textAlign: "center",
							paddingTop: 20,
						}}
						size='medium'>
						{t("charges.title")}
					</Header>
					<Segment.Group>
						{this.state.charges.length !== 0 &&
							this.state.charges.map((item, index) => (
								<Segment>
									<Accordion
										key={index}
										defaultActiveIndex={0}
										panels={[
											{
												key: item.currency,
												title: item.currency,
												content: {
													content: (
														<Grid>
															<Grid.Row centered>
																<Grid.Column computer={2} largeScreen={2} />
																<Grid.Column
																	computer={12}
																	largeScreen={12}
																	mobile={16}>
																	<Table basic='very'>
																		<Table.Body>
																			{Object.entries(item.typeOperation).map(
																				function ([key, value]) {
																					return (
																						<Table.Row>
																							<Table.Cell>
																								<Header as='h5'>
																									{t("charges.content." + key)}
																								</Header>
																							</Table.Cell>
																							<Table.Cell>
																								<NumberFormat
																									value={value.amount}
																									displayType={"text"}
																									thousandSeparator={true}
																								/>{" "}
																								{value.type === "ABSOLUTE" &&
																									value.currency}{" "}
																								{value.type === "PERCENT" &&
																									"%"}
																							</Table.Cell>
																						</Table.Row>
																					);
																				},
																			)}
																		</Table.Body>
																	</Table>
																</Grid.Column>
																<Grid.Column computer={2} largeScreen={2} />
															</Grid.Row>
														</Grid>
													),
												},
											},
										]}
										fluid></Accordion>
								</Segment>
							))}
					</Segment.Group>
				</Segment>
			</div>
		);
	}
}
export default translate(Charges);
