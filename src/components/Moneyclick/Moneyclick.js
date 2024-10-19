import React, { Component } from "react";
import {
	Image,
	Grid,
	Segment,
	Header,
	Responsive,
	Divider,
} from "semantic-ui-react";
import translate from "../../i18n/translate";
import userService from "../../services/user";
import MoneyclickInfo from "./MoneyclickInfo/MoneyclickInfo";
import backgroundMC from "../../img/background-moneyclick.jpg";
import playstore from "../../img/playStore.png";
import appstore from "../../img/appStore.png";
import "./Moneyclick.css";
import { Link } from "react-router-dom";

class MenuMoneyclick extends Component {
	constructor(props) {
		super(props);
		this.state = {
			translator: props.translate,
		};
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}

	componentDidMount() {}

	closeSesion() {
		userService.logout();
		window.location.href = "/";
	}
	render() {
		let t = this.state.translator;
		let playStore = (
			<Image src={playstore} size='small' className='logo-storeMC' />
		);
		let appStore = (
			<Image src={appstore} size='small' className='logo-storeMC' />
		);
		return (
			<div>
				{window.sessionStorage.getItem("auth") !== "true" ? (
					<div>
						<Responsive minWidth={992}>
							<Grid centered>
								<Grid.Column
									largeScreen={13}
									mobile={16}
									tablet={14}
									computer={13}>
									<Segment color='orange' style={{ padding: 0 }}>
										<Image src={backgroundMC} className='img-background' />
										<Header as='h1' className='title-download'>
											{t("moneyclick.downloadMoneyclick")}
										</Header>
										<Image.Group className='button-download'>
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
						</Responsive>
						<Responsive minWidth={0} maxWidth={992}>
							<Divider hidden></Divider>
							<Divider hidden></Divider>
							<Grid centered>
								<Grid.Column
									largeScreen={13}
									mobile={16}
									tablet={14}
									computer={13}>
									<Segment color='orange' style={{ padding: 0 }}>
										<Grid.Row>
											<Image src={backgroundMC} />
											<Header
												as='h4'
												className='titleComponent'
												textAlign='center'>
												{t("moneyclick.downloadMoneyclick")}
											</Header>
										</Grid.Row>
										<Grid.Row>
											<Image.Group centered style={{ marginLeft: 10 }}>
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
										</Grid.Row>
									</Segment>
								</Grid.Column>
							</Grid>
						</Responsive>
					</div>
				) : (
					<Grid columns='equal' centered>
						<Grid.Column largeScreen={13} mobile={16} tablet={14} computer={13}>
							<MoneyclickInfo />
						</Grid.Column>
					</Grid>
				)}
			</div>
		);
	}
}
export default translate(MenuMoneyclick);
