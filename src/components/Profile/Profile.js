import React, { Component } from 'react';
import {
	Menu,
	Icon,
	Segment,
	Grid,
	Button,
	Responsive,
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';
import './Profile.css';
import userService from '../../services/user';
import AddAcount from './AddAcount/AddAcount';
import AddOwnAccount from './AddOwnAccount/AddOwnAccount';
import UpdateProfile from './UpdateProfile/UpdateProfile';
import UpdatePasswordUser from './UpdatePasswordUser/UpdatePasswordUser';
import OptionDetail from './OptionDetail/OptionDetail';
import OptionCurren from './OptionCurren/OptionCurren';
import translate from '../../i18n/translate';
import OptionAccount from './OptionAccount/OptionAccount';
import { isMobile } from 'react-device-detect';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeItem: 'optionDetail',
			positionMenuVertical: true,
			act: 'wallet',
			translator: props.translate,
		};
		this.handleChangeScreen = this.handleChangeScreen.bind(this);
		this.handleItem = this.handleItem.bind(this);
		this.handleItemTwo = this.handleItemTwo.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState({
				translator: nextProps.translate,
			});
		}
	}
	handleItem(e, data) {
		this.setState({ activeItem: data.name });
	}
	handleItemTwo(view) {
		this.setState({ activeItem: view });
	}
	handleItemCurrenActive(data) {
		this.setState({ act: data });
	}
	componentDidMount() {
		if (window.innerWidth <= 1126) {
			this.setState({
				positionMenuVertical: false,
				activeItem: this.state.activeItem,
			});
		} else {
			this.setState({
				positionMenuVertical: true,
				activeItem: this.state.activeItem,
			});
		}
		if (window.innerWidth < 640) {
			this.setState({ miniMenu: true, activeItem: this.state.activeItem });
		} else {
			this.setState({ miniMenu: false, activeItem: this.state.activeItem });
		}
	}
	handleChangeScreen(e, data) {
		if (data.width <= 1126) {
			this.setState({
				positionMenuVertical: false,
				activeItem: this.state.activeItem,
			});
		} else {
			this.setState({
				positionMenuVertical: true,
				activeItem: this.state.activeItem,
			});
		}
		if (data.width < 640) {
			this.setState({ miniMenu: true, activeItem: this.state.activeItem });
		} else {
			this.setState({ miniMenu: false, activeItem: this.state.activeItem });
		}
	}
	closeSesion() {
		userService.logout();
		window.location.href = '/';
	}
	render() {
		//console.log(window.sessionStorage.getItem('preferedSendCodeSecurity'));
		let t = this.state.translator;
		let activeItem = this.state.activeItem;
		let menu;
		if (!this.state.miniMenu) {
			menu = (
				<Menu
					icon='labeled'
					vertical={this.state.positionMenuVertical}
					pointing
					compact>
					<Menu.Item
						name='optionDetail'
						active={activeItem === 'optionDetail'}
						onClick={this.handleItem}>
						<Segment raised size='tiny'>
							<Icon name='user' size='big' color='blue' />
							<br />
							{t('profile.menu.myInfo')}
						</Segment>
					</Menu.Item>

					<Menu.Item
						name='optionCurren'
						active={activeItem === 'optionCurren'}
						onClick={this.handleItem}>
						<Segment raised size='tiny'>
							<Icon name='clipboard check' size='big' color='blue' />
							<br />
							{t('profile.menu.paymentMethods')}
						</Segment>
					</Menu.Item>

					<Menu.Item
						name='optionAccount'
						active={activeItem === 'optionAccount'}
						onClick={this.handleItem}>
						<Segment raised size='tiny'>
							<Icon name='lock' size='big' color='blue' />
							<br />
							{t('profile.menu.accountSecurity')}
						</Segment>
					</Menu.Item>
					<Menu.Item>
						<Button color='blue' onClick={this.closeSesion.bind(this)}>
							{t('profile.menu.logout')}
						</Button>
					</Menu.Item>
				</Menu>
			);
		} else {
			menu = (
				<Menu icon secondary size='huge' widths={3}>
					<Menu.Item
						name='optionDetail'
						active={activeItem === 'optionDetail'}
						style={
							activeItem === 'optionDetail'
								? { backgroundColor: '#207ef2', color: 'white' }
								: {
										color: 'white',
										backgroundColor: '#1667BF',
								  }
						}
						onClick={this.handleItem}>
						<Icon name='user' inverted size='large' />
					</Menu.Item>

					<Menu.Item
						name='optionCurren'
						id='optionCurren'
						active={activeItem === 'optionCurren'}
						style={
							activeItem === 'optionCurren'
								? { backgroundColor: '#207ef2', color: 'white' }
								: {
										color: 'white',
										backgroundColor: '#1667BF',
								  }
						}
						onClick={this.handleItem}>
						<Icon name='clipboard check' inverted size='large' />
					</Menu.Item>

					<Menu.Item
						name='optionAccount'
						id='optionAccount'
						active={activeItem === 'optionAccount'}
						style={
							activeItem === 'optionAccount'
								? { backgroundColor: '#207ef2', color: 'white' }
								: {
										color: 'white',
										backgroundColor: '#1667BF',
								  }
						}
						onClick={this.handleItem}>
						<Icon name='lock' inverted size='large' />
					</Menu.Item>
					{/* <Menu.Item
            onClick={this.closeSesion.bind(this)}
            style={{
              color: "white",
              backgroundColor: "#1667BF"
            }}
          >
            <Icon name="sign-out" inverted size="large" />
          </Menu.Item> */}
				</Menu>
			);
		}
		return (
			<Responsive onUpdate={this.handleChangeScreen.bind(this)}>
				<ReactTooltip />
				<Grid>
					<Grid.Column largeScreen={3} mobile={16} tablet={16}>
						{menu}
					</Grid.Column>
					<Grid.Column largeScreen={12} tablet={16} mobile={16}>
						{activeItem === 'optionDetail' && (
							<OptionDetail changeItem={this.handleItemTwo} />
						)}
						{activeItem === 'optionCurren' && (
							<OptionCurren
								changeItemTwo={this.handleItemTwo.bind(this)}
								activeItem={this.state.act}
								changeItem={this.handleItemCurrenActive.bind(this)}
							/>
						)}
						{activeItem === 'optionAccount' && (
							<OptionAccount changeItem={this.handleItemTwo} />
						)}
						{activeItem === 'editProfile' && (
							<UpdateProfile
								source={'profile'}
								changeItem={this.handleItemTwo}
							/>
						)}
						{activeItem === 'updatePassword' && (
							<UpdatePasswordUser changeItem={this.handleItemTwo} />
						)}
						{activeItem === 'addAcount' && (
							<Segment color={!isMobile ? 'orange' : ''} basic={isMobile}>
								<AddAcount
									changeItem={this.handleItemCurrenActive.bind(this)}
									changeItemTwo={this.handleItemTwo}
								/>
							</Segment>
						)}
						{activeItem === 'addOwnAccount' && (
							<Segment color={!isMobile ? 'orange' : ''} basic={isMobile}>
								<AddOwnAccount
									changeItem={this.handleItemCurrenActive.bind(this)}
									changeItemTwo={this.handleItemTwo}
								/>
							</Segment>
						)}
					</Grid.Column>
				</Grid>
			</Responsive>
		);
	}
}
export default translate(Profile);
